/**
 * Daily notification job for the inventory management suite: overdue
 * flagging, due-soon reminders, pickup-ready alerts, and an officer digest.
 *
 * Guarded against a missing `POSTGRES_URL` like every other lib/inventory/*
 * module (see lib/inventory/db.ts), and against a missing `RESEND_API_KEY`
 * using the same dynamic-import pattern as app/api/loans/decision/route.ts:
 * emails are best-effort and their absence never breaks the underlying
 * status changes or throws out of this module.
 */
import { sql, isInventoryConfigured } from "@/lib/inventory/db";
import { getLowStockItems } from "@/lib/inventory/consumables";

/** Window (in days, inclusive) used for "due soon" reminders. */
export const DUE_SOON_DAYS = 2;

/**
 * True when `endDateISO` falls between `todayISO` and `todayISO + withinDays`
 * inclusive. Pure date-string math (UTC midnight comparisons), no DB or
 * timezone lookups, so it's safe to unit test directly.
 */
export function isDueSoon(endDateISO: string, todayISO: string, withinDays: number): boolean {
  const end = new Date(`${endDateISO}T00:00:00Z`);
  const today = new Date(`${todayISO}T00:00:00Z`);
  if (Number.isNaN(end.getTime()) || Number.isNaN(today.getTime())) {
    return false;
  }
  const diffDays = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= withinDays;
}

export function isCronConfigured(): boolean {
  return !!process.env.CRON_SECRET;
}

type NotifyRow = {
  id: string;
  reference: string;
  start_date: string;
  end_date: string;
  borrower_email: string;
  borrower_name: string;
  item_name_en: string;
};

type ResendClient = { emails: { send: (input: { from: string; to: string; subject: string; text: string }) => Promise<unknown> } };

/**
 * Lazily constructs a Resend client, or returns null when `RESEND_API_KEY`
 * is unset. Callers treat null as "skip all sends for this run."
 */
async function getResendClient(): Promise<ResendClient | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    const { Resend } = await import("resend");
    return new Resend(apiKey) as unknown as ResendClient;
  } catch {
    return null;
  }
}

function fromAddress(): string {
  return process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";
}

async function sendMail(
  resend: ResendClient,
  input: { to: string; subject: string; text: string }
): Promise<boolean> {
  try {
    await resend.emails.send({ from: fromAddress(), to: input.to, subject: input.subject, text: input.text });
    return true;
  } catch {
    return false;
  }
}

/** Today's date in Asia/Bangkok, as YYYY-MM-DD. */
function todayInBangkok(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

export async function runDailyJob(): Promise<
  | {
      ok: true;
      summary: {
        overdueFlagged: number;
        remindersSent: number;
        overdueNotified: number;
        pickupAlerts: number;
        digestSent: boolean;
        emailsSkipped: boolean;
      };
    }
  | { ok: false; reason: "not-configured" }
> {
  if (!isInventoryConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  const summary = {
    overdueFlagged: 0,
    remindersSent: 0,
    overdueNotified: 0,
    pickupAlerts: 0,
    digestSent: false,
    emailsSkipped: false,
  };

  try {
    const today = todayInBangkok();
    const resend = await getResendClient();
    const emailsSkipped = !resend;
    summary.emailsSkipped = emailsSkipped;

    // (a) Flip expired checked-out loans to overdue.
    try {
      const flipped = await sql`
        update loans
        set status = 'overdue'
        where status = 'checked_out' and end_date < ${today}
        returning id
      `;
      summary.overdueFlagged = flipped.rowCount ?? 0;
    } catch {
      // Leave overdueFlagged at 0; continue with the rest of the job.
    }

    // (a2) Notify borrowers of overdue loans not yet notified.
    if (resend) {
      try {
        const rows = await sql<NotifyRow>`
          select l.id, l.reference, l.start_date, l.end_date,
                 b.email as borrower_email, b.name as borrower_name,
                 i.name_en as item_name_en
          from loans l
          join borrowers b on b.id = l.borrower_id
          join items i on i.id = l.item_id
          where l.status = 'overdue' and l.overdue_notified_at is null
        `;
        for (const row of rows.rows) {
          const sent = await sendMail(resend, {
            to: row.borrower_email,
            subject: `[BIRSA] Your loan ${row.reference} is overdue`,
            text: [
              `Hi ${row.borrower_name},`,
              "",
              `Your loan of "${row.item_name_en}" (reference ${row.reference}) was due back on ${row.end_date} and is now overdue.`,
              "Please return it to the BIRSA office as soon as possible.",
            ].join("\n"),
          });
          if (sent) {
            await sql`update loans set overdue_notified_at = now() where id = ${row.id}`;
            summary.overdueNotified += 1;
          }
        }
      } catch {
        // Best-effort; skip remaining overdue notifications on error.
      }
    }

    // (b) Due-soon reminders for loans still checked out.
    if (resend) {
      try {
        const rows = await sql<NotifyRow>`
          select l.id, l.reference, l.start_date, l.end_date,
                 b.email as borrower_email, b.name as borrower_name,
                 i.name_en as item_name_en
          from loans l
          join borrowers b on b.id = l.borrower_id
          join items i on i.id = l.item_id
          where l.status = 'checked_out'
            and l.end_date >= ${today}
            and l.end_date <= (${today}::date + ${DUE_SOON_DAYS}::int)
            and l.reminder_sent_at is null
        `;
        for (const row of rows.rows) {
          const sent = await sendMail(resend, {
            to: row.borrower_email,
            subject: `[BIRSA] Reminder: your loan ${row.reference} is due soon`,
            text: [
              `Hi ${row.borrower_name},`,
              "",
              `Your loan of "${row.item_name_en}" (reference ${row.reference}) is due back on ${row.end_date}.`,
              "Please return it to the BIRSA office on or before that date.",
            ].join("\n"),
          });
          if (sent) {
            await sql`update loans set reminder_sent_at = now() where id = ${row.id}`;
            summary.remindersSent += 1;
          }
        }
      } catch {
        // Best-effort; skip remaining reminders on error.
      }
    }

    // (c) Pickup-ready alerts for approved loans starting soon.
    if (resend) {
      try {
        const rows = await sql<NotifyRow>`
          select l.id, l.reference, l.start_date, l.end_date,
                 b.email as borrower_email, b.name as borrower_name,
                 i.name_en as item_name_en
          from loans l
          join borrowers b on b.id = l.borrower_id
          join items i on i.id = l.item_id
          where l.status = 'approved'
            and l.start_date <= (${today}::date + 1)
            and l.pickup_alert_sent_at is null
        `;
        for (const row of rows.rows) {
          const sent = await sendMail(resend, {
            to: row.borrower_email,
            subject: `[BIRSA] Your loan ${row.reference} is ready for pickup`,
            text: [
              `Hi ${row.borrower_name},`,
              "",
              `Your approved loan of "${row.item_name_en}" (reference ${row.reference}) is ready for pickup starting ${row.start_date}.`,
              "Please collect it from the BIRSA office and bring your student ID.",
            ].join("\n"),
          });
          if (sent) {
            await sql`update loans set pickup_alert_sent_at = now() where id = ${row.id}`;
            summary.pickupAlerts += 1;
          }
        }
      } catch {
        // Best-effort; skip remaining pickup alerts on error.
      }
    }

    // (d) Officer digest: one summary email with counts.
    try {
      const [pendingResult, overdueResult, dueSoonResult, lowStock] = await Promise.all([
        sql<{ count: string }>`select count(*)::text as count from loans where status = 'pending'`,
        sql<{ count: string }>`select count(*)::text as count from loans where status = 'overdue'`,
        sql<{ count: string }>`
          select count(*)::text as count from loans
          where status = 'checked_out'
            and end_date >= ${today}
            and end_date <= (${today}::date + ${DUE_SOON_DAYS}::int)
        `,
        getLowStockItems(),
      ]);

      if (resend) {
        const inboxTo = process.env.BIRSA_INBOX ?? "birsa@tu.ac.th";
        const sent = await sendMail(resend, {
          to: inboxTo,
          subject: `[BIRSA] Daily inventory digest (${today})`,
          text: [
            `Daily inventory summary for ${today}:`,
            "",
            `Pending loan requests: ${pendingResult.rows[0]?.count ?? 0}`,
            `Overdue loans: ${overdueResult.rows[0]?.count ?? 0}`,
            `Due within ${DUE_SOON_DAYS} day(s): ${dueSoonResult.rows[0]?.count ?? 0}`,
            `Low-stock consumables: ${lowStock.length}`,
            ...(lowStock.length > 0
              ? ["", "Low-stock items:", ...lowStock.map((item) => `- ${item.name.en} (qty ${item.qtyOnHand ?? 0})`)]
              : []),
          ].join("\n"),
        });
        summary.digestSent = sent;
      }
    } catch {
      // Best-effort; digest failure never blocks the rest of the job.
    }

    return { ok: true, summary };
  } catch {
    // The whole job is best-effort: never throw, return whatever we
    // managed to accumulate in `summary` so far.
    return { ok: true, summary };
  }
}
