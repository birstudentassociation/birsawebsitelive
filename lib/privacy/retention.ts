/**
 * Section 37(3) of Thailand's Personal Data Protection Act B.E. 2562
 * requires not just a stated retention period but "a system to check and
 * delete personal data when the retention period expires." This module is
 * that system. `purgeExpiredPersonalData()` runs once a day from the
 * existing cron (app/api/cron/daily/route.ts) and does the checking and the
 * deleting.
 *
 * `RETENTION_YEARS` comes from content/privacy/register.ts, the same
 * register the /privacy pages render from, so the period this file enforces
 * and the period the notice promises can never drift apart.
 *
 * Delete order follows the foreign keys: loans are removed before borrowers,
 * because a borrower with a remaining loan row can never be deleted (see
 * `selectDeletableBorrowerIds`). Officers are anonymised rather than
 * deleted, never: `audit_log.officer_id` and
 * `loans.decided_by` / `checked_out_by` / `checked_in_by` all reference
 * them, and nulling those out would gut the accountability record s.37(1)
 * depends on rather than protect anyone's privacy.
 *
 * Each step's row-selection logic is a small pure function (exported for
 * unit tests) that takes plain JS rows and a cutoff `Date` and returns the
 * ids to act on. `purgeExpiredPersonalData()` itself is a thin shell around
 * those functions: it fetches the narrow set of columns each step needs,
 * hands them to the pure function, and issues one delete/update per step.
 * That split is what makes the foreign-key ordering and the open-loan
 * exemption testable without a real database.
 *
 * Runs on one dedicated connection (`sql.connect()`, not the pooled `sql`
 * tag used elsewhere in lib/inventory) because a transaction needs BEGIN,
 * the deletes and updates, then COMMIT or ROLLBACK to all happen on the same
 * connection. Guarded against a missing `POSTGRES_URL` the same way as
 * lib/inventory/notifications.ts: an unconfigured database means there is
 * nothing to purge, not an error.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import { RETENTION_YEARS } from "@/content/privacy/register";

/**
 * `loans.status` values that mean the loan is over (db/migrations/005_loans.sql's
 * check constraint has eight statuses; these four are the terminal ones).
 * An open loan (pending, approved, checked_out, overdue) is never purged, no
 * matter how old it is: that is the single most important correctness
 * property of this module. `no_show` is included even though nothing in
 * lib/inventory/loans.ts currently transitions a loan to it: it is still a
 * real status with user-facing copy
 * (app/[lang]/services/equipment-loan/status/statusLookupCopy.ts), and
 * BIRSA's retention decision was two years for every category of personal
 * data, with no silent exception for a status nobody happens to set yet.
 */
const CLOSED_LOAN_STATUSES = ["returned", "rejected", "cancelled", "no_show"] as const;

/** A passcode hash shape that `verifyPasscodeHash` (lib/inventory/auth.ts) can never match: real hashes are "<saltHex>:<hashHex>" with a colon. */
const TOMBSTONE_PASSCODE_HASH = "purged-no-login-possible";

const TOMBSTONE_NAME = "Former officer";

/** True when `email` is already in the `removed+<id>@invalid` shape written by this module, so a later run knows to leave that officer alone. */
export function isTombstonedEmail(email: string): boolean {
  return email.startsWith("removed+") && email.endsWith("@invalid");
}

function tombstoneEmail(officerId: string): string {
  return `removed+${officerId}@invalid`;
}

/** The moment RETENTION_YEARS ago: anything timestamped before this has expired. Exported so tests can pick a fixed `now` rather than depending on the real clock. */
export function retentionCutoff(now: Date = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - RETENTION_YEARS);
  return cutoff;
}

// ---- Pure decision functions -------------------------------------------
//
// None of these touch the database. Each takes the rows a SQL query already
// narrowed down and a cutoff, and returns the ids (or, for custodians, a
// set) to act on. Kept separate from purgeExpiredPersonalData() so the
// foreign-key ordering and the open-loan exemption can be unit tested
// directly, without standing up Postgres.

/** Closed loans (see CLOSED_LOAN_STATUSES) whose closed_at is older than cutoff. A row with no closed_at is never purged: if we don't know when it closed, we don't guess. */
export function selectExpiredLoanIds(
  rows: { id: string; status: string; closedAt: string | null }[],
  cutoff: Date
): string[] {
  return rows
    .filter((row) => (CLOSED_LOAN_STATUSES as readonly string[]).includes(row.status))
    .filter((row) => row.closedAt !== null && new Date(row.closedAt) < cutoff)
    .map((row) => row.id);
}

/** Rows whose single timestamp is older than cutoff. Used for equipment_loans, audit_log and satisfaction_feedback, which purge on age alone. */
export function selectExpiredByTimestamp(
  rows: { id: string; timestamp: string }[],
  cutoff: Date
): string[] {
  return rows.filter((row) => new Date(row.timestamp) < cutoff).map((row) => row.id);
}

/** Borrowers with no remaining loan row (checked against loanBorrowerIds, the set of borrower_id still present in `loans`) whose own record hasn't been touched within the retention period. */
export function selectDeletableBorrowerIds(
  borrowers: { id: string; updatedAt: string }[],
  loanBorrowerIds: ReadonlySet<string>,
  cutoff: Date
): string[] {
  return borrowers
    .filter((borrower) => !loanBorrowerIds.has(borrower.id))
    .filter((borrower) => new Date(borrower.updatedAt) < cutoff)
    .map((borrower) => borrower.id);
}

/**
 * Custodian ids with recent activity: an officer scoped to that custodian
 * who signed in (or, having never signed in, was created) within the
 * retention period, or an item owned by that custodian that was updated
 * within the retention period. A custodian in this set is never cleared,
 * however old its contact fields are.
 */
export function selectActiveCustodianIds(
  officerActivity: { custodianId: string | null; lastActive: string }[],
  itemActivity: { custodianId: string; updatedAt: string }[],
  cutoff: Date
): Set<string> {
  const active = new Set<string>();
  for (const officer of officerActivity) {
    if (officer.custodianId && new Date(officer.lastActive) >= cutoff) {
      active.add(officer.custodianId);
    }
  }
  for (const item of itemActivity) {
    if (new Date(item.updatedAt) >= cutoff) {
      active.add(item.custodianId);
    }
  }
  return active;
}

/**
 * Custodians whose contact fields should be cleared: not in
 * activeCustodianIds, older themselves than the retention period (a
 * freshly-created custodian with no officers or items yet is not "inactive",
 * it's new), and currently holding at least one contact field worth
 * clearing.
 */
export function selectCustodiansToClear(
  custodians: { id: string; createdAt: string; hasContact: boolean }[],
  activeCustodianIds: ReadonlySet<string>,
  cutoff: Date
): string[] {
  return custodians
    .filter((custodian) => custodian.hasContact)
    .filter((custodian) => !activeCustodianIds.has(custodian.id))
    .filter((custodian) => new Date(custodian.createdAt) < cutoff)
    .map((custodian) => custodian.id);
}

/**
 * Officers inactive for the retention period (measured from last_login_at,
 * or created_at for one who never logged in), skipping any officer already
 * tombstoned by a previous run.
 */
export function selectOfficersToAnonymise(
  officers: { id: string; lastLoginAt: string | null; createdAt: string; email: string }[],
  cutoff: Date
): string[] {
  return officers
    .filter((officer) => !isTombstonedEmail(officer.email))
    .filter((officer) => new Date(officer.lastLoginAt ?? officer.createdAt) < cutoff)
    .map((officer) => officer.id);
}

// ---- Orchestration -------------------------------------------------------

export type PurgeCounts = {
  loans: number;
  equipmentLoans: number;
  borrowers: number;
  auditLog: number;
  satisfactionFeedback: number;
  custodiansCleared: number;
  officersAnonymised: number;
};

function emptyCounts(): PurgeCounts {
  return {
    loans: 0,
    equipmentLoans: 0,
    borrowers: 0,
    auditLog: 0,
    satisfactionFeedback: 0,
    custodiansCleared: 0,
    officersAnonymised: 0,
  };
}

/**
 * Runs every retention step in one transaction and records the result in
 * `purge_log`. Never throws: a failure rolls the transaction back and is
 * reported as `{ ok: false, reason: "error" }`, matching the "degrade
 * gracefully" convention used across lib/inventory.
 */
export async function purgeExpiredPersonalData(
  now: Date = new Date()
): Promise<{ ok: true; counts: PurgeCounts } | { ok: false; reason: "not-configured" | "error" }> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  const cutoff = retentionCutoff(now);
  const counts = emptyCounts();
  const client = await sql.connect();

  try {
    await client.query("begin");

    // a. Loans: only CLOSED loans, and only by how long ago they closed.
    // An open loan never appears in this result set.
    const loanRows = await client.query<{ id: string; status: string; closed_at: string | null }>(
      `select id, status, closed_at from loans where status = any($1::text[])`,
      [CLOSED_LOAN_STATUSES]
    );
    const expiredLoanIds = selectExpiredLoanIds(
      loanRows.rows.map((row) => ({ id: row.id, status: row.status, closedAt: row.closed_at })),
      cutoff
    );
    if (expiredLoanIds.length > 0) {
      const deleted = await client.query(`delete from loans where id = any($1::uuid[])`, [
        expiredLoanIds,
      ]);
      counts.loans = deleted.rowCount ?? 0;
    }

    // b. equipment_loans: the legacy table nothing in the current app reads
    // or writes any more (see db/migrations/005_loans.sql), so age alone is
    // enough.
    const equipmentLoanRows = await client.query<{ id: string; created_at: string }>(
      `select id, created_at from equipment_loans`,
      []
    );
    const expiredEquipmentLoanIds = selectExpiredByTimestamp(
      equipmentLoanRows.rows.map((row) => ({ id: row.id, timestamp: row.created_at })),
      cutoff
    );
    if (expiredEquipmentLoanIds.length > 0) {
      const deleted = await client.query(`delete from equipment_loans where id = any($1::uuid[])`, [
        expiredEquipmentLoanIds,
      ]);
      counts.equipmentLoans = deleted.rowCount ?? 0;
    }

    // c. Borrowers: only once every loan row of theirs is already gone
    // (from step a, an earlier purge run, or simply never having one) and
    // their own record hasn't been touched recently.
    const loanBorrowerRows = await client.query<{ borrower_id: string }>(
      `select distinct borrower_id from loans`,
      []
    );
    const loanBorrowerIds = new Set(loanBorrowerRows.rows.map((row) => row.borrower_id));
    const borrowerRows = await client.query<{ id: string; updated_at: string }>(
      `select id, updated_at from borrowers`,
      []
    );
    const deletableBorrowerIds = selectDeletableBorrowerIds(
      borrowerRows.rows.map((row) => ({ id: row.id, updatedAt: row.updated_at })),
      loanBorrowerIds,
      cutoff
    );
    if (deletableBorrowerIds.length > 0) {
      const deleted = await client.query(`delete from borrowers where id = any($1::uuid[])`, [
        deletableBorrowerIds,
      ]);
      counts.borrowers = deleted.rowCount ?? 0;
    }

    // d. audit_log: age alone.
    const auditDeleted = await client.query(`delete from audit_log where created_at < $1`, [
      cutoff.toISOString(),
    ]);
    counts.auditLog = auditDeleted.rowCount ?? 0;

    // e. satisfaction_feedback: age alone. The free-text comment is
    // unmoderated and may contain whatever a visitor chose to type in it.
    const feedbackDeleted = await client.query(
      `delete from satisfaction_feedback where created_at < $1`,
      [cutoff.toISOString()]
    );
    counts.satisfactionFeedback = feedbackDeleted.rowCount ?? 0;

    // f. Custodians: clear contact fields, keep the row. Clubs are not
    // personal data; the people who answer for them are.
    const officerActivityRows = await client.query<{
      custodian_id: string | null;
      last_active: string;
    }>(
      `select custodian_id, coalesce(last_login_at, created_at) as last_active
       from officers where custodian_id is not null`,
      []
    );
    const itemActivityRows = await client.query<{ custodian_id: string; updated_at: string }>(
      `select custodian_id, updated_at from items`,
      []
    );
    const activeCustodianIds = selectActiveCustodianIds(
      officerActivityRows.rows.map((row) => ({
        custodianId: row.custodian_id,
        lastActive: row.last_active,
      })),
      itemActivityRows.rows.map((row) => ({ custodianId: row.custodian_id, updatedAt: row.updated_at })),
      cutoff
    );
    const custodianRows = await client.query<{
      id: string;
      created_at: string;
      contact_name_en: string;
      contact_name_th: string;
      contact_email: string | null;
      contact_instagram: string | null;
      contact_other: string | null;
    }>(
      `select id, created_at, contact_name_en, contact_name_th, contact_email, contact_instagram, contact_other
       from custodians`,
      []
    );
    const custodiansToClear = selectCustodiansToClear(
      custodianRows.rows.map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        hasContact: !!(
          row.contact_name_en ||
          row.contact_name_th ||
          row.contact_email ||
          row.contact_instagram ||
          row.contact_other
        ),
      })),
      activeCustodianIds,
      cutoff
    );
    if (custodiansToClear.length > 0) {
      const cleared = await client.query(
        `update custodians
         set contact_name_en = '', contact_name_th = '', contact_email = null,
             contact_instagram = null, contact_other = null
         where id = any($1::uuid[])`,
        [custodiansToClear]
      );
      counts.custodiansCleared = cleared.rowCount ?? 0;
    }

    // g. Officers: anonymise, never delete. audit_log.officer_id and
    // loans.decided_by / checked_out_by / checked_in_by all reference them,
    // so deleting the row (or nulling those columns) would erase who
    // approved or handled a loan, which is exactly the accountability
    // record s.37(1) exists to keep.
    const officerRows = await client.query<{
      id: string;
      last_login_at: string | null;
      created_at: string;
      email: string;
    }>(`select id, last_login_at, created_at, email from officers`, []);
    const officersToAnonymise = selectOfficersToAnonymise(
      officerRows.rows.map((row) => ({
        id: row.id,
        lastLoginAt: row.last_login_at,
        createdAt: row.created_at,
        email: row.email,
      })),
      cutoff
    );
    for (const officerId of officersToAnonymise) {
      await client.query(
        `update officers
         set name = $2, email = $3, passcode_hash = $4, is_active = false
         where id = $1`,
        [officerId, TOMBSTONE_NAME, tombstoneEmail(officerId), TOMBSTONE_PASSCODE_HASH]
      );
    }
    counts.officersAnonymised = officersToAnonymise.length;

    await client.query(`insert into purge_log (ran_at, counts) values (now(), $1::jsonb)`, [
      JSON.stringify(counts),
    ]);

    await client.query("commit");
    return { ok: true, counts };
  } catch {
    try {
      await client.query("rollback");
    } catch {
      // The connection is on its way out either way; nothing more to do.
    }
    return { ok: false, reason: "error" };
  } finally {
    client.release();
  }
}
