/**
 * Tests for lib/privacy/retention.ts, the PDPA s.37(3) purge job.
 *
 * There is no local Postgres (see tests/unit/inventory-a11y.test.tsx for the
 * same constraint elsewhere in this suite), so two layers are covered
 * separately:
 *
 * 1. The pure `select*` decision functions, tested directly with plain JS
 *    rows. This is where the important correctness properties live (the
 *    open-loan exemption, the foreign-key ordering, idempotent officer
 *    anonymisation) and they need no database at all.
 * 2. `purgeExpiredPersonalData()` itself, tested against a small hand-rolled
 *    fake Postgres client that understands exactly the queries this module
 *    issues (see FakeClient below) and mutates an in-memory store the same
 *    way real deletes/updates would. This covers the wiring: the right rows
 *    reach the right pure function, the counts come back correctly, and a
 *    second run doesn't double-purge anything.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { RETENTION_YEARS } from "@/content/privacy/register";

// vi.mock factories are hoisted above imports, so they cannot close over a
// plain top-level `let` (it would still be in its temporal dead zone when
// the factory runs). `vi.hoisted` gives the factory a mutable container it
// can read lazily instead, once each test has populated it in beforeEach.
const dbState = vi.hoisted(() => ({
  configured: true,
  client: null as unknown,
}));

vi.mock("@/lib/inventory/db", () => ({
  isInventoryConfigured: () => dbState.configured,
  sql: { connect: async () => dbState.client },
}));

let store: Store;

import {
  purgeExpiredPersonalData,
  retentionCutoff,
  isTombstonedEmail,
  selectExpiredLoanIds,
  selectExpiredByTimestamp,
  selectDeletableBorrowerIds,
  selectActiveCustodianIds,
  selectCustodiansToClear,
  selectOfficersToAnonymise,
} from "@/lib/privacy/retention";

// ---------------------------------------------------------------------------
// Pure function tests
// ---------------------------------------------------------------------------

const NOW = new Date("2028-07-31T00:00:00.000Z");

function yearsAgoPlusDays(years: number, days: number, from: Date = NOW): string {
  const d = new Date(from);
  d.setUTCFullYear(d.getUTCFullYear() - years);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

describe("retentionCutoff", () => {
  it("is exactly RETENTION_YEARS before `now`", () => {
    const cutoff = retentionCutoff(NOW);
    const expected = new Date(NOW);
    expected.setUTCFullYear(expected.getUTCFullYear() - RETENTION_YEARS);
    expect(cutoff.toISOString()).toBe(expected.toISOString());
  });
});

describe("isTombstonedEmail", () => {
  it("recognises the removed+<id>@invalid shape", () => {
    expect(isTombstonedEmail("removed+abc-123@invalid")).toBe(true);
  });

  it("does not flag an ordinary email", () => {
    expect(isTombstonedEmail("officer@example.com")).toBe(false);
  });
});

describe("selectExpiredLoanIds", () => {
  const cutoff = retentionCutoff(NOW);

  it("never selects an open loan, however old", () => {
    const rows = [
      { id: "l1", status: "checked_out", closedAt: null },
      { id: "l2", status: "overdue", closedAt: null },
      { id: "l3", status: "pending", closedAt: null },
      { id: "l4", status: "approved", closedAt: null },
    ];
    expect(selectExpiredLoanIds(rows, cutoff)).toEqual([]);
  });

  it("keeps a closed loan just under two years old", () => {
    const rows = [{ id: "l5", status: "returned", closedAt: yearsAgoPlusDays(2, 1) }];
    expect(selectExpiredLoanIds(rows, cutoff)).toEqual([]);
  });

  it("purges a closed loan just over two years old", () => {
    const rows = [{ id: "l6", status: "returned", closedAt: yearsAgoPlusDays(2, -1) }];
    expect(selectExpiredLoanIds(rows, cutoff)).toEqual(["l6"]);
  });

  it("purges rejected, cancelled and no_show loans the same way as returned ones", () => {
    const rows = [
      { id: "l7", status: "rejected", closedAt: yearsAgoPlusDays(2, -1) },
      { id: "l8", status: "cancelled", closedAt: yearsAgoPlusDays(2, -1) },
      { id: "l10", status: "no_show", closedAt: yearsAgoPlusDays(2, -1) },
    ];
    expect(selectExpiredLoanIds(rows, cutoff).sort()).toEqual(["l10", "l7", "l8"]);
  });

  it("never purges a closed loan with no closed_at, rather than guessing", () => {
    const rows = [{ id: "l9", status: "returned", closedAt: null }];
    expect(selectExpiredLoanIds(rows, cutoff)).toEqual([]);
  });
});

describe("selectExpiredByTimestamp", () => {
  const cutoff = retentionCutoff(NOW);

  it("keeps rows within the retention period and purges older ones", () => {
    const rows = [
      { id: "a", timestamp: yearsAgoPlusDays(2, 1) },
      { id: "b", timestamp: yearsAgoPlusDays(2, -1) },
    ];
    expect(selectExpiredByTimestamp(rows, cutoff)).toEqual(["b"]);
  });
});

describe("selectDeletableBorrowerIds", () => {
  const cutoff = retentionCutoff(NOW);

  it("never deletes a borrower who still has a loan row, regardless of age", () => {
    const borrowers = [{ id: "b1", updatedAt: yearsAgoPlusDays(5, 0) }];
    const loanBorrowerIds = new Set(["b1"]);
    expect(selectDeletableBorrowerIds(borrowers, loanBorrowerIds, cutoff)).toEqual([]);
  });

  it("deletes an old borrower with no remaining loans", () => {
    const borrowers = [{ id: "b2", updatedAt: yearsAgoPlusDays(2, -1) }];
    expect(selectDeletableBorrowerIds(borrowers, new Set(), cutoff)).toEqual(["b2"]);
  });

  it("keeps a borrower with no loans but a recent update", () => {
    const borrowers = [{ id: "b3", updatedAt: yearsAgoPlusDays(2, 1) }];
    expect(selectDeletableBorrowerIds(borrowers, new Set(), cutoff)).toEqual([]);
  });
});

describe("selectActiveCustodianIds / selectCustodiansToClear", () => {
  const cutoff = retentionCutoff(NOW);

  it("counts a custodian as active from a recently-logged-in officer", () => {
    const active = selectActiveCustodianIds(
      [{ custodianId: "c1", lastActive: yearsAgoPlusDays(2, 1) }],
      [],
      cutoff
    );
    expect(active.has("c1")).toBe(true);
  });

  it("counts a custodian as active from a recently-updated item", () => {
    const active = selectActiveCustodianIds(
      [],
      [{ custodianId: "c2", updatedAt: yearsAgoPlusDays(2, 1) }],
      cutoff
    );
    expect(active.has("c2")).toBe(true);
  });

  it("clears contact fields only for inactive, old-enough custodians that have any set", () => {
    const custodians = [
      { id: "c1", createdAt: yearsAgoPlusDays(5, 0), hasContact: true }, // active
      { id: "c3", createdAt: yearsAgoPlusDays(5, 0), hasContact: true }, // inactive, old, has contact -> cleared
      { id: "c4", createdAt: yearsAgoPlusDays(5, 0), hasContact: false }, // inactive, old, nothing to clear
      { id: "c5", createdAt: yearsAgoPlusDays(0, 0), hasContact: true }, // inactive but brand new
    ];
    const active = new Set(["c1"]);
    expect(selectCustodiansToClear(custodians, active, cutoff)).toEqual(["c3"]);
  });
});

describe("selectOfficersToAnonymise", () => {
  const cutoff = retentionCutoff(NOW);

  it("selects an officer inactive for two years, measured from last_login_at", () => {
    const officers = [
      {
        id: "o1",
        lastLoginAt: yearsAgoPlusDays(2, -1),
        createdAt: yearsAgoPlusDays(5, 0),
        email: "o1@example.com",
      },
    ];
    expect(selectOfficersToAnonymise(officers, cutoff)).toEqual(["o1"]);
  });

  it("falls back to created_at for an officer who never logged in", () => {
    const officers = [
      { id: "o2", lastLoginAt: null, createdAt: yearsAgoPlusDays(2, -1), email: "o2@example.com" },
    ];
    expect(selectOfficersToAnonymise(officers, cutoff)).toEqual(["o2"]);
  });

  it("keeps a recently-active officer", () => {
    const officers = [
      {
        id: "o3",
        lastLoginAt: yearsAgoPlusDays(0, 0),
        createdAt: yearsAgoPlusDays(5, 0),
        email: "o3@example.com",
      },
    ];
    expect(selectOfficersToAnonymise(officers, cutoff)).toEqual([]);
  });

  it("never re-selects an already-tombstoned officer", () => {
    const officers = [
      {
        id: "o4",
        lastLoginAt: yearsAgoPlusDays(5, 0),
        createdAt: yearsAgoPlusDays(5, 0),
        email: "removed+o4@invalid",
      },
    ];
    expect(selectOfficersToAnonymise(officers, cutoff)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// purgeExpiredPersonalData() against a fake Postgres client
// ---------------------------------------------------------------------------

type LoanRow = {
  id: string;
  status: string;
  closed_at: string | null;
  borrower_id: string;
};
type Store = {
  loans: LoanRow[];
  /**
   * Whether the legacy `equipment_loans` table exists at all. It is created by
   * db/schema.sql and by no migration, so a database stood up the way the
   * README describes does not have it — hence the `to_regclass` probe the
   * purge runs before touching it. Defaults to true so the fixtures below keep
   * exercising the table-present path.
   */
  equipment_loans_table_exists: boolean;
  equipment_loans: { id: string; created_at: string }[];
  borrowers: { id: string; updated_at: string }[];
  audit_log: { id: string; created_at: string; officer_id: string | null }[];
  satisfaction_feedback: { id: string; created_at: string }[];
  custodians: {
    id: string;
    created_at: string;
    contact_name_en: string;
    contact_name_th: string;
    contact_email: string | null;
    contact_instagram: string | null;
    contact_other: string | null;
  }[];
  officers: {
    id: string;
    name: string;
    email: string;
    last_login_at: string | null;
    created_at: string;
    passcode_hash: string;
    is_active: boolean;
    custodian_id: string | null;
  }[];
  items: { custodian_id: string; updated_at: string }[];
  purge_log: { ran_at: string; counts: Record<string, number> }[];
};

type FakeClient = {
  query: <T = Record<string, unknown>>(
    text: string,
    params?: unknown[]
  ) => Promise<{ rows: T[]; rowCount: number }>;
  release: () => void;
};

function norm(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function makeFakeClient(s: Store): FakeClient {
  return {
    async query<T = Record<string, unknown>>(rawText: string, params: unknown[] = []) {
      const text = norm(rawText);

      if (text === "begin" || text === "commit" || text === "rollback") {
        return { rows: [] as T[], rowCount: 0 };
      }

      if (text.includes("from loans where status = any")) {
        const statuses = params[0] as string[];
        const rows = s.loans.filter((l) => statuses.includes(l.status));
        return { rows: rows as unknown as T[], rowCount: rows.length };
      }

      if (text.includes("delete from loans where id = any")) {
        const ids = new Set(params[0] as string[]);
        const before = s.loans.length;
        s.loans = s.loans.filter((l) => !ids.has(l.id));
        return { rows: [] as T[], rowCount: before - s.loans.length };
      }

      if (text.includes("to_regclass('public.equipment_loans')")) {
        return {
          rows: [{ present: s.equipment_loans_table_exists }] as unknown as T[],
          rowCount: 1,
        };
      }

      if (text.includes("select id, created_at from equipment_loans")) {
        if (!s.equipment_loans_table_exists) {
          throw new Error('relation "equipment_loans" does not exist');
        }
        return { rows: s.equipment_loans as unknown as T[], rowCount: s.equipment_loans.length };
      }

      if (text.includes("delete from equipment_loans")) {
        const ids = new Set(params[0] as string[]);
        const before = s.equipment_loans.length;
        s.equipment_loans = s.equipment_loans.filter((r) => !ids.has(r.id));
        return { rows: [] as T[], rowCount: before - s.equipment_loans.length };
      }

      if (text.includes("distinct borrower_id from loans")) {
        const ids = Array.from(new Set(s.loans.map((l) => l.borrower_id)));
        return {
          rows: ids.map((borrower_id) => ({ borrower_id })) as unknown as T[],
          rowCount: ids.length,
        };
      }

      if (text.includes("select id, updated_at from borrowers")) {
        return { rows: s.borrowers as unknown as T[], rowCount: s.borrowers.length };
      }

      if (text.includes("delete from borrowers where id = any")) {
        const ids = new Set(params[0] as string[]);
        const before = s.borrowers.length;
        s.borrowers = s.borrowers.filter((b) => !ids.has(b.id));
        return { rows: [] as T[], rowCount: before - s.borrowers.length };
      }

      if (text.includes("delete from audit_log")) {
        const cutoff = params[0] as string;
        const before = s.audit_log.length;
        s.audit_log = s.audit_log.filter((r) => !(r.created_at < cutoff));
        return { rows: [] as T[], rowCount: before - s.audit_log.length };
      }

      if (text.includes("delete from satisfaction_feedback")) {
        const cutoff = params[0] as string;
        const before = s.satisfaction_feedback.length;
        s.satisfaction_feedback = s.satisfaction_feedback.filter((r) => !(r.created_at < cutoff));
        return { rows: [] as T[], rowCount: before - s.satisfaction_feedback.length };
      }

      if (text.includes("as last_active from officers")) {
        const rows = s.officers
          .filter((o) => o.custodian_id !== null)
          .map((o) => ({
            custodian_id: o.custodian_id,
            last_active: o.last_login_at ?? o.created_at,
          }));
        return { rows: rows as unknown as T[], rowCount: rows.length };
      }

      if (text.includes("select custodian_id, updated_at from items")) {
        return { rows: s.items as unknown as T[], rowCount: s.items.length };
      }

      if (
        text.includes(
          "contact_name_en, contact_name_th, contact_email, contact_instagram, contact_other"
        )
      ) {
        return { rows: s.custodians as unknown as T[], rowCount: s.custodians.length };
      }

      if (text.includes("update custodians set contact_name_en")) {
        const ids = new Set(params[0] as string[]);
        let count = 0;
        for (const c of s.custodians) {
          if (ids.has(c.id)) {
            c.contact_name_en = "";
            c.contact_name_th = "";
            c.contact_email = null;
            c.contact_instagram = null;
            c.contact_other = null;
            count += 1;
          }
        }
        return { rows: [] as T[], rowCount: count };
      }

      if (text.includes("select id, last_login_at, created_at, email from officers")) {
        return { rows: s.officers as unknown as T[], rowCount: s.officers.length };
      }

      if (text.includes("update officers set name")) {
        const [id, name, email, passcodeHash] = params as [string, string, string, string];
        const officer = s.officers.find((o) => o.id === id);
        if (officer) {
          officer.name = name;
          officer.email = email;
          officer.passcode_hash = passcodeHash;
          officer.is_active = false;
        }
        return { rows: [] as T[], rowCount: officer ? 1 : 0 };
      }

      if (text.includes("insert into purge_log")) {
        const counts = JSON.parse(params[0] as string);
        s.purge_log.push({ ran_at: new Date().toISOString(), counts });
        return { rows: [] as T[], rowCount: 1 };
      }

      throw new Error(`FakeClient: unrecognised query: ${rawText}`);
    },
    release() {
      // no-op
    },
  };
}

function freshStore(): Store {
  return {
    loans: [],
    equipment_loans_table_exists: true,
    equipment_loans: [],
    borrowers: [],
    audit_log: [],
    satisfaction_feedback: [],
    custodians: [],
    officers: [],
    items: [],
    purge_log: [],
  };
}

beforeEach(() => {
  dbState.configured = true;
  store = freshStore();
  dbState.client = makeFakeClient(store);
});

describe("purgeExpiredPersonalData", () => {
  it("returns not-configured when there is no database, without touching anything", async () => {
    dbState.configured = false;
    const result = await purgeExpiredPersonalData(NOW);
    expect(result).toEqual({ ok: false, reason: "not-configured" });
  });

  it("never purges an open loan of any age", async () => {
    store.loans.push({
      id: "loan-open",
      status: "checked_out",
      closed_at: null,
      borrower_id: "borrower-open",
    });
    // Give it a very old created_at-equivalent by also making the borrower
    // old, to prove the loan itself is what's protecting the borrower too.
    store.borrowers.push({ id: "borrower-open", updated_at: yearsAgoPlusDays(10, 0) });

    const result = await purgeExpiredPersonalData(NOW);
    expect(result.ok).toBe(true);
    expect(store.loans).toHaveLength(1);
    // The borrower is also spared, because they still have a loan row.
    expect(store.borrowers).toHaveLength(1);
  });

  it("keeps a loan closed just under two years ago and deletes one closed just over", async () => {
    store.loans.push(
      {
        id: "loan-recent",
        status: "returned",
        closed_at: yearsAgoPlusDays(2, 1),
        borrower_id: "b1",
      },
      {
        id: "loan-expired",
        status: "returned",
        closed_at: yearsAgoPlusDays(2, -1),
        borrower_id: "b2",
      }
    );

    const result = await purgeExpiredPersonalData(NOW);
    expect(result).toMatchObject({ ok: true, counts: { loans: 1 } });
    const remainingIds = store.loans.map((l) => l.id);
    expect(remainingIds).toEqual(["loan-recent"]);
  });

  it("still purges everything else when the legacy equipment_loans table does not exist", async () => {
    // `equipment_loans` is created by db/schema.sql and by no migration, so a
    // database stood up the way the README describes (attach Postgres, run
    // scripts/migrate.mjs) never has it. Querying a missing relation aborts
    // the surrounding transaction, which rolled back the whole purge and left
    // every category of expired personal data in place, reported only as a
    // generic error — verified against a real Postgres before the fix.
    store.equipment_loans_table_exists = false;
    store.loans.push({
      id: "loan-expired",
      status: "returned",
      closed_at: yearsAgoPlusDays(2, -1),
      borrower_id: "b1",
    });

    const result = await purgeExpiredPersonalData(NOW);
    expect(result).toMatchObject({ ok: true, counts: { loans: 1, equipmentLoans: 0 } });
    expect(store.loans).toHaveLength(0);
  });

  it("does not delete a borrower who still has a surviving loan", async () => {
    store.loans.push({
      id: "loan-keep",
      status: "checked_out",
      closed_at: null,
      borrower_id: "b-active",
    });
    store.borrowers.push({ id: "b-active", updated_at: yearsAgoPlusDays(10, 0) });

    const result = await purgeExpiredPersonalData(NOW);
    expect(result.ok).toBe(true);
    expect(store.borrowers.map((b) => b.id)).toEqual(["b-active"]);
  });

  it("anonymises an inactive officer rather than deleting them, and audit_log keeps its officer_id", async () => {
    store.officers.push({
      id: "officer-1",
      name: "Somchai Somsri",
      email: "somchai@example.com",
      last_login_at: yearsAgoPlusDays(3, 0),
      created_at: yearsAgoPlusDays(5, 0),
      passcode_hash: "abc:def",
      is_active: true,
      custodian_id: null,
    });
    store.audit_log.push({
      id: "audit-1",
      created_at: yearsAgoPlusDays(0, 0),
      officer_id: "officer-1",
    });

    const result = await purgeExpiredPersonalData(NOW);
    expect(result).toMatchObject({ ok: true, counts: { officersAnonymised: 1 } });

    expect(store.officers).toHaveLength(1);
    const officer = store.officers[0]!;
    expect(officer.name).toBe("Former officer");
    expect(officer.email).toBe("removed+officer-1@invalid");
    expect(officer.passcode_hash).not.toBe("abc:def");
    expect(officer.is_active).toBe(false);

    // The audit row survives untouched, and still points at the (now
    // anonymised, but not deleted) officer.
    expect(store.audit_log).toHaveLength(1);
    expect(store.audit_log[0]!.officer_id).toBe("officer-1");
  });

  it("is idempotent: a second run does not re-anonymise or double-count", async () => {
    store.officers.push({
      id: "officer-2",
      name: "Original Name",
      email: "original@example.com",
      last_login_at: yearsAgoPlusDays(3, 0),
      created_at: yearsAgoPlusDays(5, 0),
      passcode_hash: "abc:def",
      is_active: true,
      custodian_id: null,
    });
    store.loans.push({
      id: "loan-x",
      status: "returned",
      closed_at: yearsAgoPlusDays(3, 0),
      borrower_id: "bx",
    });
    store.audit_log.push({ id: "audit-x", created_at: yearsAgoPlusDays(3, 0), officer_id: null });

    const first = await purgeExpiredPersonalData(NOW);
    expect(first).toMatchObject({
      ok: true,
      counts: { officersAnonymised: 1, loans: 1, auditLog: 1 },
    });

    const second = await purgeExpiredPersonalData(NOW);
    expect(second).toMatchObject({
      ok: true,
      counts: { officersAnonymised: 0, loans: 0, auditLog: 0 },
    });

    expect(store.officers[0]!.email).toBe("removed+officer-2@invalid");
    expect(store.purge_log).toHaveLength(2);
  });
});
