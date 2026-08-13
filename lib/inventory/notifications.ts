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
import { todayInBangkok } from "@/lib/bangkok-today";
import { getLowStockItems } from "@/lib/inventory/consumables";
import {
  renderOverdue,
  renderDueSoon,
  renderPickupReady,
  renderOfficerDigest,
} from "@/lib/email/templates";

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
  item_name_th: string;
};

type ResendClient = {
  emails: {
    send: (input: {
      from: string;
      to: string;
      subject: string;
      text: string;
      html?: string;
    }) => Promise<unknown>;
  };
};

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
  input: { to: string; subject: string; text: string; html?: string }
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return true;
  } catch {
    return false;
  }
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
                 i.name_en as item_name_en, i.name_th as item_name_th
          from loans l
          join borrowers b on b.id = l.borrower_id
          join items i on i.id = l.item_id
          where l.status = 'overdue' and l.overdue_notified_at is null
        `;
        for (const row of rows.rows) {
          const email = renderOverdue({
            borrowerName: row.borrower_name,
            itemNameEn: row.item_name_en,
            itemNameTh: row.item_name_th,
            reference: row.reference,
            endDate: row.end_date,
          });
          const sent = await sendMail(resend, {
            to: row.borrower_email,
            subject: email.subject,
            text: email.text,
            html: email.html,
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
                 i.name_en as item_name_en, i.name_th as item_name_th
          from loans l
          join borrowers b on b.id = l.borrower_id
          join items i on i.id = l.item_id
          where l.status = 'checked_out'
            and l.end_date >= ${today}
            and l.end_date <= (${today}::date + ${DUE_SOON_DAYS}::int)
            and l.reminder_sent_at is null
        `;
        for (const row of rows.rows) {
          const email = renderDueSoon({
            borrowerName: row.borrower_name,
            itemNameEn: row.item_name_en,
            itemNameTh: row.item_name_th,
            reference: row.reference,
            endDate: row.end_date,
          });
          const sent = await sendMail(resend, {
            to: row.borrower_email,
            subject: email.subject,
            text: email.text,
            html: email.html,
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
                 i.name_en as item_name_en, i.name_th as item_name_th
          from loans l
          join borrowers b on b.id = l.borrower_id
          join items i on i.id = l.item_id
          where l.status = 'approved'
            and l.start_date <= (${today}::date + 1)
            and l.pickup_alert_sent_at is null
        `;
        for (const row of rows.rows) {
          const email = renderPickupReady({
            borrowerName: row.borrower_name,
            itemNameEn: row.item_name_en,
            itemNameTh: row.item_name_th,
            reference: row.reference,
            startDate: row.start_date,
          });
          const sent = await sendMail(resend, {
            to: row.borrower_email,
            subject: email.subject,
            text: email.text,
            html: email.html,
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
        const email = renderOfficerDigest({
          date: today,
          pending: Number(pendingResult.rows[0]?.count ?? 0),
          overdue: Number(overdueResult.rows[0]?.count ?? 0),
          dueSoon: Number(dueSoonResult.rows[0]?.count ?? 0),
          dueSoonDays: DUE_SOON_DAYS,
          lowStock: lowStock.map((item) => ({
            nameEn: item.name.en,
            nameTh: item.name.th,
            qty: item.qtyOnHand ?? 0,
          })),
        });
        const sent = await sendMail(resend, {
          to: inboxTo,
          subject: email.subject,
          text: email.text,
          html: email.html,
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
