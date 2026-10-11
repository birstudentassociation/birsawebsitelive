import { NextResponse } from "next/server";
import { requireReviewOfficer } from "@/lib/course-review/access";
import { recordAudit } from "@/lib/inventory/audit";
import { demandCsvFromDatabase } from "@/lib/elective-demand/csv";

/**
 * CSV export of elective demand, one row per course and term, for the download
 * link on app/[lang]/officer/inventory/course-demand/page.tsx. Colocated under
 * the feature's own console segment, like the feedback export, rather than in
 * app/api/inventory/export, which is owned by the inventory suite and open to
 * different roles.
 *
 * The same rule as the page: admins and the Academic Affairs role, BIRSA-wide
 * only (`requireReviewOfficer`). The rows hold no personal data, but a count of
 * who intends to take what is not for every officer, and a download is an
 * action worth a line in the audit log.
 */
export async function GET() {
  const auth = await requireReviewOfficer();
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }

  const csv = await demandCsvFromDatabase();
  await recordAudit({
    officerId: auth.officer.id,
    action: "elective_demand.export",
    entityType: "elective_demand",
    entityId: "all",
  });

  const todayISO = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="birsa-elective-demand-${todayISO}.csv"`,
    },
  });
}
