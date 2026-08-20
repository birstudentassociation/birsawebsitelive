/**
 * Access drift (REDESIGN-2.0 section 6.8, section 7.2).
 *
 * Pure functions over the lists lib/officer/accessRegister.ts produces: no
 * database import, no Next.js route, no i18n. That is what makes them
 * trivially testable with plain fixture arrays (tests/unit/officer-access.test.ts)
 * and safe to call from both app/[lang]/officer/access/page.tsx (a server
 * component) and app/api/cron/access-drift/route.ts (the daily cron), which
 * would otherwise have to duplicate this logic to keep the two in sync.
 *
 * Only a type-level import crosses into accessRegister.ts (`import type`),
 * which TypeScript erases entirely at build time, so this module carries no
 * runtime dependency on the database module accessRegister.ts reads from.
 *
 * Four checks, matching section 6.8's list:
 *
 *   1. An officer past their term end.
 *   2. An officer with no term end at all, an account nobody has to renew.
 *   3. Any capability held by fewer than two currently valid holders
 *      (principle 11, section 7.2).
 *   4. Someone in the Studio who is not an officer. Always empty while
 *      gate 1 blocks the Studio half, because the studio member list passed
 *      in is then always empty (see STUDIO_HALF_BLOCKED_ON_GATE_1 in
 *      accessRegister.ts); this function is written to work unchanged the
 *      day that data exists.
 */
import type { AccessEntry, Capability, StudioMember } from "@/lib/officer/accessRegister";

/**
 * `dateIso` before `asOfIso`, comparing only the first ten characters of
 * each. Term end is a plain date, not an instant, so this is deliberately
 * string comparison rather than `Date` subtraction: it gives the same
 * answer regardless of the server's time zone, and works whether the driver
 * hands back a bare "2026-05-31" or a full "2026-05-31T00:00:00.000Z".
 */
function isPast(dateIso: string, asOfIso: string): boolean {
  return dateIso.slice(0, 10) < asOfIso.slice(0, 10);
}

function todayIso(asOf: Date): string {
  return asOf.toISOString().slice(0, 10);
}

/** Rule 1: an active officer whose term end date has passed. */
export function officersPastTermEnd(
  officers: AccessEntry[],
  asOf: Date = new Date()
): AccessEntry[] {
  const today = todayIso(asOf);
  return officers.filter((o) => o.isActive && o.termEnd !== null && isPast(o.termEnd, today));
}

/**
 * Rule 2: an active officer with no term end at all, an account nobody has
 * to renew. Section 6.8 treats this as its own drift condition rather than
 * a safe default: a null term end is a deliberate state to report, not a
 * missing value to ignore.
 */
export function officersWithNoTermEnd(officers: AccessEntry[]): AccessEntry[] {
  return officers.filter((o) => o.isActive && o.termEnd === null);
}

/**
 * An officer whose grant is currently live: active, and not past their term
 * end (a null term end does not disqualify a holder here, it is rule 2's
 * problem, not rule 3's). Used to count holders for rule 3, since an
 * expired or inactive account should not count as a second holder of
 * anything the two-person rule is meant to protect.
 */
export function currentlyValidHolders(
  officers: AccessEntry[],
  asOf: Date = new Date()
): AccessEntry[] {
  const today = todayIso(asOf);
  return officers.filter((o) => o.isActive && (o.termEnd === null || !isPast(o.termEnd, today)));
}

function capabilityOf(officer: AccessEntry): Capability {
  return officer.portfolioId
    ? { kind: "portfolio", portfolioId: officer.portfolioId }
    : { kind: "role", role: officer.role };
}

function capabilityKey(capability: Capability): string {
  return capability.kind === "portfolio"
    ? `portfolio:${capability.portfolioId}`
    : `role:${capability.role}`;
}

export type CapabilityHolders = {
  capability: Capability;
  holders: AccessEntry[];
};

/** Rule 3: any capability (see file header) held by fewer than two currently valid holders. */
export function capabilitiesHeldByFewerThanTwo(
  officers: AccessEntry[],
  asOf: Date = new Date()
): CapabilityHolders[] {
  const valid = currentlyValidHolders(officers, asOf);
  const groups = new Map<string, CapabilityHolders>();

  for (const officer of valid) {
    const capability = capabilityOf(officer);
    const key = capabilityKey(capability);
    const existing = groups.get(key);
    if (existing) {
      existing.holders.push(officer);
    } else {
      groups.set(key, { capability, holders: [officer] });
    }
  }

  return [...groups.values()].filter((group) => group.holders.length < 2);
}

/**
 * Rule 4: someone with Studio access whose email matches no officer
 * account. Matches case-insensitively, since email casing carries no
 * meaning. Always `[]` while the Studio half is blocked on gate 1
 * (accessRegister.ts), because `studioMembers` is then always `[]`; written
 * to work unchanged the day that data exists, rather than thrown away and
 * rewritten later.
 */
export function studioMembersWithoutOfficerAccount(
  studioMembers: StudioMember[],
  officers: AccessEntry[]
): StudioMember[] {
  const officerEmails = new Set(
    officers.filter((o) => o.isActive).map((o) => o.email.toLowerCase())
  );
  return studioMembers.filter((member) => !officerEmails.has(member.email.toLowerCase()));
}

export type AccessDriftReport = {
  pastTermEnd: AccessEntry[];
  noTermEnd: AccessEntry[];
  underStaffedCapabilities: CapabilityHolders[];
  studioWithoutOfficer: StudioMember[];
};

/** All four checks together, the shape both the cron and the access register page render from. */
export function computeAccessDrift(
  officers: AccessEntry[],
  studioMembers: StudioMember[],
  asOf: Date = new Date()
): AccessDriftReport {
  return {
    pastTermEnd: officersPastTermEnd(officers, asOf),
    noTermEnd: officersWithNoTermEnd(officers),
    underStaffedCapabilities: capabilitiesHeldByFewerThanTwo(officers, asOf),
    studioWithoutOfficer: studioMembersWithoutOfficerAccount(studioMembers, officers),
  };
}
