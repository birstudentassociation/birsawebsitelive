import { NextResponse } from "next/server";
import { requireRole } from "@/lib/inventory/auth";
import { loansCsv, unitsCsv, borrowersCsv } from "@/lib/inventory/reports";

const BUILDERS: Record<string, () => Promise<string>> = {
  loans: loansCsv,
  units: unitsCsv,
  borrowers: borrowersCsv,
};

export async function GET(request: Request) {
  const auth = await requireRole(["admin", "inventory_manager", "loan_officer"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false }, { status: auth.status });
  }
  if (auth.officer.custodianId !== null) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "loans";
  const builder = BUILDERS[type];
  if (!builder) {
    return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
  }

  const csv = await builder();
  const todayISO = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="birsa-${type}-${todayISO}.csv"`,
    },
  });
}
