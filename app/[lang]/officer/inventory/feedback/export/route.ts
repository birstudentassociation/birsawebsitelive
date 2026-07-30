import { NextResponse } from "next/server";
import { requireRole } from "@/lib/inventory/auth";
import { feedbackCsv } from "@/lib/feedback";

/**
 * CSV export of every feedback response, for the download link on
 * app/[lang]/officer/inventory/feedback/page.tsx. Colocated under the [lang]
 * segment (rather than app/api/inventory/export, which is owned by the
 * inventory suite) since this feature's files are all scoped under
 * app/[lang]/feedback/** and app/[lang]/officer/inventory/feedback/**.
 * Follows the same shape as app/api/inventory/export/route.ts: any active
 * officer role may download, since feedback carries no borrower or
 * custodian-scoped data to restrict.
 */
export async function GET() {
  const auth = await requireRole(["admin", "inventory_manager", "loan_officer", "read_only"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const csv = await feedbackCsv();
  const todayISO = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="birsa-feedback-${todayISO}.csv"`,
    },
  });
}
