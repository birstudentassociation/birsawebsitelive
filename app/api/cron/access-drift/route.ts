import { NextResponse } from "next/server";
import { hasValidCronSecret } from "@/app/api/_lib/cronAuth";
import { isCronConfigured } from "@/lib/inventory/notifications";
import { isInventoryConfigured } from "@/lib/inventory/db";
import {
  getOfficerAccessRegister,
  getStudioAccessRegisterBlockedOnGate1,
  STUDIO_HALF_BLOCKED_ON_GATE_1,
} from "@/lib/officer/accessRegister";
import { computeAccessDrift } from "@/lib/officer/drift";

/**
 * Vercel Cron entrypoint for the access register's daily drift report
 * (REDESIGN-2.0 section 6.8: "the daily cron reports drift"). Follows
 * app/api/cron/daily/route.ts exactly: Vercel Cron issues a GET with
 * `Authorization: Bearer <CRON_SECRET>`, checked with the same
 * constant-time comparison (app/api/_lib/cronAuth.ts); no additional rate
 * limiting, since this path is only ever invoked by the scheduler.
 *
 * `isCronConfigured()` and `isInventoryConfigured()` both degrade instead
 * of throwing, the same house rule every lib/inventory/* module already
 * follows (BUILD-BRIEF-2.0 section 2): a deployment with no CRON_SECRET or
 * no POSTGRES_URL reports itself as not configured rather than erroring.
 *
 * The response carries counts only, never officer names or emails: those
 * are personal data and belong in the console behind auth, never in a log
 * a cron invocation might end up in (BUILD-BRIEF-2.0 section 8). An officer
 * who wants the detail behind a count reads it on /officer/access.
 *
 * NOT YET SCHEDULED. `vercel.json`'s `crons` list is outside this wave's
 * owned paths; see the Wave 4C report for the one line it needs.
 */
export async function GET(request: Request) {
  if (!isCronConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  if (!hasValidCronSecret(request)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  if (!isInventoryConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });
  }

  const [officers, studioMembers] = await Promise.all([
    getOfficerAccessRegister(),
    getStudioAccessRegisterBlockedOnGate1(),
  ]);
  const drift = computeAccessDrift(officers, studioMembers);

  return NextResponse.json(
    {
      ok: true,
      summary: {
        pastTermEnd: drift.pastTermEnd.length,
        noTermEnd: drift.noTermEnd.length,
        underStaffedCapabilities: drift.underStaffedCapabilities.length,
        studioWithoutOfficerAccount: drift.studioWithoutOfficer.length,
        studioCheckBlockedOnGate1: STUDIO_HALF_BLOCKED_ON_GATE_1,
      },
    },
    { status: 200 }
  );
}
