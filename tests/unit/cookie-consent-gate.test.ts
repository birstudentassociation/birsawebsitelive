import { describe, it, expect } from "vitest";
import { cookieRecords, browserStorage } from "@/content/privacy/register";

/**
 * GATE 4 IS CONDITIONAL, AND THIS TEST IS THE CONDITION.
 *
 * The operator decided on 2026-08-20 that BIRSA shows no cookie banner, because
 * no consent is required. That answer is only correct while every cookie is
 * strictly necessary. PDPA and GDPR both exempt strictly necessary cookies from
 * consent and neither exempts anything else, so the day one analytics tag, one
 * embedded video that sets a cookie, or one advertising pixel is added, the
 * decision expires and a reject by default banner becomes mandatory.
 *
 * That transition is exactly the kind that happens quietly: someone adds a
 * measurement script for a good reason, nobody connects it to a decision made
 * months earlier, and the site is out of compliance on every single visit
 * without anyone choosing that.
 *
 * So the condition is a test rather than a sentence in a document. If this
 * fails, the fix is NOT to edit the expectation. It is to build the banner, or
 * to remove whatever stopped being essential.
 *
 * See docs/DECISIONS-2.0.md, gate 4.
 */
describe("gate 4: no cookie banner is only correct while nothing is non essential", () => {
  it("every cookie in the register is strictly necessary", () => {
    const nonEssential = cookieRecords.filter((c) => !c.essential).map((c) => c.name);
    expect(
      nonEssential,
      "A non essential cookie means consent is now required. Build the reject by default " +
        "banner, or remove the cookie. Do not edit this test."
    ).toEqual([]);
  });

  // Browser storage carries no `essential` flag and does not need one. Consent
  // attaches to storing or reading data on someone's device for a purpose they
  // did not ask for, and every entry here is a preference the reader set
  // themselves that never leaves their machine. What the GOV.UK guidance does
  // require is that they are TOLD, so the assertion is disclosure rather than
  // consent: every key documented, in both languages.
  it("every browser storage entry is disclosed in both languages", () => {
    for (const entry of browserStorage) {
      expect(entry.purpose.en.trim(), `${entry.key} has no English purpose`).not.toBe("");
      expect(entry.purpose.th.trim(), `${entry.key} has no Thai purpose`).not.toBe("");
    }
  });

  // The thing that would actually end gate 4. Anything here whose purpose is
  // measurement rather than the reader's own preference is analytics, and
  // analytics needs consent whether it lands in a cookie or in local storage.
  it("nothing in browser storage exists to measure the reader", () => {
    const measuring = browserStorage.filter((entry) =>
      // Deliberately not a bare "track": the onboarding entry describes one key
      // per onboarding TRACK, which is a route through the guidance and not
      // tracking. Matching that would train the next person to widen the
      // expectation instead of reading the finding.
      /analytic|tracking|tracker|measurement|pixel|advertis|campaign|telemetry/i.test(
        `${entry.key} ${entry.purpose.en}`
      )
    );
    expect(
      measuring.map((entry) => entry.key),
      "Measurement storage needs consent the same way an analytics cookie does. " +
        "Build the banner, or remove it. Do not edit this test."
    ).toEqual([]);
  });
});
