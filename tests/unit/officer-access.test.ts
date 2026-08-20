/**
 * The access register's drift rules (REDESIGN-2.0 section 6.8, section 7.2)
 * and the blocked Sanity half (docs/DECISIONS-2.0.md, gate 1).
 *
 * lib/officer/drift.ts is pure over plain arrays, so every fixture here is a
 * plain `AccessEntry[]`, not a database row. Each rule gets a fixture built
 * to trigger exactly that rule and no other, so a test failing here points
 * at one rule, not "something in the drift report changed."
 */
import { describe, expect, it } from "vitest";

import type { AccessEntry, StudioMember } from "@/lib/officer/accessRegister";
import {
  getStudioAccessRegisterBlockedOnGate1,
  STUDIO_HALF_BLOCKED_ON_GATE_1,
} from "@/lib/officer/accessRegister";
import {
  capabilitiesHeldByFewerThanTwo,
  computeAccessDrift,
  currentlyValidHolders,
  officersPastTermEnd,
  officersWithNoTermEnd,
  studioMembersWithoutOfficerAccount,
} from "@/lib/officer/drift";

const ASOF = new Date("2026-08-20T00:00:00Z");

function makeOfficer(overrides: Partial<AccessEntry> & { id: string }): AccessEntry {
  return {
    name: "Officer",
    email: `${overrides.id}@example.com`,
    role: "read_only",
    portfolioId: null,
    portfolioRaw: null,
    termEnd: null,
    isActive: true,
    ...overrides,
  };
}

describe("officersPastTermEnd", () => {
  it("reports exactly the officer whose term end has passed, and nothing else", () => {
    const officers: AccessEntry[] = [
      // Past term end: the one thing this fixture should trigger.
      makeOfficer({ id: "past", portfolioId: "president", termEnd: "2026-01-01" }),
      // Two other, currently valid holders of the same portfolio, so rule 3
      // (fewer than two holders) does not also fire once "past" is excluded
      // from the valid count.
      makeOfficer({ id: "valid-1", portfolioId: "president", termEnd: "2027-01-01" }),
      makeOfficer({ id: "valid-2", portfolioId: "president", termEnd: "2027-06-01" }),
    ];

    expect(officersPastTermEnd(officers, ASOF).map((o) => o.id)).toEqual(["past"]);
    expect(officersWithNoTermEnd(officers)).toEqual([]);
    expect(capabilitiesHeldByFewerThanTwo(officers, ASOF)).toEqual([]);
  });

  it("does not report a future term end", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "future", portfolioId: "treasury", termEnd: "2027-01-01" }),
      makeOfficer({ id: "future-2", portfolioId: "treasury", termEnd: "2027-06-01" }),
    ];
    expect(officersPastTermEnd(officers, ASOF)).toEqual([]);
  });

  it("does not report an inactive officer", () => {
    const officers: AccessEntry[] = [
      makeOfficer({
        id: "inactive-past",
        portfolioId: "treasury",
        termEnd: "2020-01-01",
        isActive: false,
      }),
    ];
    expect(officersPastTermEnd(officers, ASOF)).toEqual([]);
  });
});

describe("officersWithNoTermEnd", () => {
  it("reports exactly the officer with no term end at all, not silently accepted", () => {
    const officers: AccessEntry[] = [
      // No term end: an account nobody has to renew. This is the one thing
      // this fixture should trigger.
      makeOfficer({ id: "no-end", portfolioId: "treasury", termEnd: null }),
      // A second, currently valid holder of the same portfolio, so rule 3
      // does not also fire (a null term end still counts as "currently
      // valid" for the two-person count; see currentlyValidHolders below).
      makeOfficer({ id: "has-end", portfolioId: "treasury", termEnd: "2027-01-01" }),
    ];

    expect(officersWithNoTermEnd(officers).map((o) => o.id)).toEqual(["no-end"]);
    expect(officersPastTermEnd(officers, ASOF)).toEqual([]);
    expect(capabilitiesHeldByFewerThanTwo(officers, ASOF)).toEqual([]);
  });

  it("does not report an inactive officer with no term end", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "inactive-no-end", termEnd: null, isActive: false }),
    ];
    expect(officersWithNoTermEnd(officers)).toEqual([]);
  });
});

describe("currentlyValidHolders", () => {
  it("counts a null term end as valid, and excludes a past one", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "open-ended", termEnd: null }),
      makeOfficer({ id: "expired", termEnd: "2020-01-01" }),
      makeOfficer({ id: "future", termEnd: "2027-01-01" }),
      makeOfficer({ id: "inactive", termEnd: "2027-01-01", isActive: false }),
    ];
    expect(
      currentlyValidHolders(officers, ASOF)
        .map((o) => o.id)
        .sort()
    ).toEqual(["future", "open-ended"]);
  });
});

describe("capabilitiesHeldByFewerThanTwo", () => {
  it("reports a capability held by exactly one person", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "lone-spokesperson", portfolioId: "spokesperson", termEnd: "2027-01-01" }),
    ];

    const result = capabilitiesHeldByFewerThanTwo(officers, ASOF);
    expect(result).toHaveLength(1);
    expect(result[0]!.capability).toEqual({ kind: "portfolio", portfolioId: "spokesperson" });
    expect(result[0]!.holders.map((o) => o.id)).toEqual(["lone-spokesperson"]);
  });

  it("does not report a capability held by exactly two people", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "aa-1", portfolioId: "academic-affairs", termEnd: "2027-01-01" }),
      makeOfficer({ id: "aa-2", portfolioId: "academic-affairs", termEnd: "2027-06-01" }),
    ];
    expect(capabilitiesHeldByFewerThanTwo(officers, ASOF)).toEqual([]);
  });

  it("reports a one-held portfolio alongside a two-held one, without flagging the second", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "lone", portfolioId: "spokesperson", termEnd: "2027-01-01" }),
      makeOfficer({ id: "aa-1", portfolioId: "academic-affairs", termEnd: "2027-01-01" }),
      makeOfficer({ id: "aa-2", portfolioId: "academic-affairs", termEnd: "2027-06-01" }),
    ];

    const result = capabilitiesHeldByFewerThanTwo(officers, ASOF);
    expect(result).toHaveLength(1);
    expect(result[0]!.capability).toEqual({ kind: "portfolio", portfolioId: "spokesperson" });
  });

  it("groups a global (portfolio-less) officer by their console role, matching 'at least two hold site administration'", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "sole-admin", role: "admin", portfolioId: null, termEnd: "2027-01-01" }),
    ];

    const result = capabilitiesHeldByFewerThanTwo(officers, ASOF);
    expect(result).toHaveLength(1);
    expect(result[0]!.capability).toEqual({ kind: "role", role: "admin" });
  });

  it("does not flag the admin role once a second global admin is added", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "admin-1", role: "admin", portfolioId: null, termEnd: "2027-01-01" }),
      makeOfficer({ id: "admin-2", role: "admin", portfolioId: null, termEnd: "2027-06-01" }),
    ];
    expect(capabilitiesHeldByFewerThanTwo(officers, ASOF)).toEqual([]);
  });

  it("does not count an expired holder toward the two-person minimum", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "current", portfolioId: "treasury", termEnd: "2027-01-01" }),
      makeOfficer({ id: "expired", portfolioId: "treasury", termEnd: "2020-01-01" }),
    ];

    const result = capabilitiesHeldByFewerThanTwo(officers, ASOF);
    expect(result).toHaveLength(1);
    expect(result[0]!.holders.map((o) => o.id)).toEqual(["current"]);
  });
});

describe("the Studio half (blocked on gate 1)", () => {
  it("returns an empty list rather than throwing, and says so clearly", async () => {
    await expect(getStudioAccessRegisterBlockedOnGate1()).resolves.toEqual([]);
    expect(STUDIO_HALF_BLOCKED_ON_GATE_1).toBe(true);
  });

  it("studioMembersWithoutOfficerAccount is [] when fed the blocked function's empty list", async () => {
    const studioMembers = await getStudioAccessRegisterBlockedOnGate1();
    const officers: AccessEntry[] = [makeOfficer({ id: "officer-1" })];
    expect(studioMembersWithoutOfficerAccount(studioMembers, officers)).toEqual([]);
  });

  it("is written to work the day the data exists: finds a Studio member with no matching officer", () => {
    const studioMembers: StudioMember[] = [
      { email: "editor@example.com", name: "Editor Person", studioRole: "editor" },
      { email: "officer@example.com", name: "Officer Person", studioRole: "editor" },
    ];
    const officers: AccessEntry[] = [
      makeOfficer({ id: "officer-1", email: "OFFICER@example.com" }),
    ];

    const result = studioMembersWithoutOfficerAccount(studioMembers, officers);
    expect(result.map((m) => m.email)).toEqual(["editor@example.com"]);
  });

  it("matches emails case-insensitively, so casing alone never causes a false positive", () => {
    const studioMembers: StudioMember[] = [
      { email: "Officer@Example.com", name: null, studioRole: "editor" },
    ];
    const officers: AccessEntry[] = [
      makeOfficer({ id: "officer-1", email: "officer@example.com" }),
    ];
    expect(studioMembersWithoutOfficerAccount(studioMembers, officers)).toEqual([]);
  });

  it("does not count an inactive officer's email as covering a Studio member", () => {
    const studioMembers: StudioMember[] = [
      { email: "former@example.com", name: null, studioRole: "editor" },
    ];
    const officers: AccessEntry[] = [
      makeOfficer({ id: "former-officer", email: "former@example.com", isActive: false }),
    ];
    expect(studioMembersWithoutOfficerAccount(studioMembers, officers).map((m) => m.email)).toEqual(
      ["former@example.com"]
    );
  });
});

describe("computeAccessDrift", () => {
  it("assembles all four checks into one report", () => {
    const officers: AccessEntry[] = [
      makeOfficer({ id: "past", portfolioId: "president", termEnd: "2020-01-01" }),
      makeOfficer({ id: "president-2", portfolioId: "president", termEnd: "2027-01-01" }),
      makeOfficer({ id: "president-3", portfolioId: "president", termEnd: "2027-06-01" }),
      makeOfficer({ id: "no-end", portfolioId: "treasury", termEnd: null }),
      makeOfficer({ id: "treasury-2", portfolioId: "treasury", termEnd: "2027-01-01" }),
      makeOfficer({ id: "lone", portfolioId: "spokesperson", termEnd: "2027-01-01" }),
    ];

    const report = computeAccessDrift(officers, [], ASOF);

    expect(report.pastTermEnd.map((o) => o.id)).toEqual(["past"]);
    expect(report.noTermEnd.map((o) => o.id)).toEqual(["no-end"]);
    expect(report.underStaffedCapabilities.map((g) => g.capability)).toEqual([
      { kind: "portfolio", portfolioId: "spokesperson" },
    ]);
    expect(report.studioWithoutOfficer).toEqual([]);
  });
});
