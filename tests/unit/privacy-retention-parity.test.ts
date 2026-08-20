import { describe, it, expect } from "vitest";
import { activities } from "@/content/privacy/register";

/**
 * The register is the promise and `lib/privacy/retention.ts` is the code that
 * keeps it. An activity in one and not the other is a privacy notice that says
 * something the site does not do.
 *
 * This test does not require every activity to be implemented. It requires
 * every UNIMPLEMENTED one to be listed here on purpose, with a reason, so the
 * gap is a decision somebody wrote down rather than something nobody noticed.
 */

// Mirrors `IMPLEMENTED_RETENTION_ACTIVITY_IDS` in lib/services/registry.ts.
const IMPLEMENTED = [
  "equipment-loan",
  "borrower-record",
  "audit-log",
  "feedback",
  "officer-account",
];

const KNOWN_UNIMPLEMENTED: Record<string, string> = {
  "contact-message":
    "Email only, never stored by BIRSA. Retention is the mailbox owner's, and there is no row to purge.",
  "club-proposal": "Email only, same as contact-message.",
  "loan-status":
    "A read path over loans that are purged by the equipment-loan branch. It stores nothing of its own.",
  "rights-request":
    "Email only. The request itself is handled by a person and leaves no BIRSA row.",
  "rate-limiting":
    "In memory, per process, expires in minutes. Nothing survives a cold start to purge.",
  "photo-consent":
    "GATE 3. Decided in principle, not built. There is no photo consent table and therefore no purge path, so no photograph of an identifiable person may be published yet. Building it means a migration, a takedown path, and a branch in purgeExpiredPersonalData, and only then does this id move into IMPLEMENTED.",
};

describe("every register activity is implemented or knowingly not", () => {
  it("accounts for all of them", () => {
    const unaccounted = activities
      .map((a) => a.id)
      .filter((id) => !IMPLEMENTED.includes(id) && !(id in KNOWN_UNIMPLEMENTED));
    expect(unaccounted).toEqual([]);
  });

  it("lists no reason for an activity that does not exist", () => {
    const ids = new Set(activities.map((a) => a.id));
    const stale = Object.keys(KNOWN_UNIMPLEMENTED).filter((id) => !ids.has(id));
    expect(stale).toEqual([]);
  });

  // The one that matters today. If someone implements photo consent they must
  // move the id, and moving it is what makes this test start demanding a real
  // purge path instead of a paragraph.
  it("keeps photo consent out of the implemented set until it is built", () => {
    expect(IMPLEMENTED).not.toContain("photo-consent");
    expect(KNOWN_UNIMPLEMENTED["photo-consent"]).toMatch(/GATE 3/);
  });
});
