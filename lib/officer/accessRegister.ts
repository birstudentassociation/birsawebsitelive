/**
 * The access register (REDESIGN-2.0 section 6.8).
 *
 * BIRSA keeps two logins: the console authenticates against the `officers`
 * table (lib/inventory/auth.ts), and the Studio will authenticate against
 * Sanity project membership. Unifying them would mean custom authentication
 * into Sanity, an enterprise feature disproportionate here, so section 6.8
 * accepts two logins and makes that safe with one access register instead
 * of two: every person and everything they hold, in both systems, in one
 * place.
 *
 * This file has two halves, and they are deliberately not symmetric.
 *
 *   - getOfficerAccessRegister() reads the officers table for real: every
 *     row, joined against the portfolio vocabulary (lib/portfolios.ts) so a
 *     stored portfolio id resolves to its bilingual label.
 *   - getStudioAccessRegisterBlockedOnGate1() is the Sanity half. There is
 *     no Sanity project yet (docs/DECISIONS-2.0.md, gate 1: the non-profit
 *     plan application is undecided), so there is nothing to call. It
 *     returns an empty list rather than inventing membership data or
 *     standing up a Sanity client, and its name says so at every call site.
 *
 * lib/officer/drift.ts is the pure layer that reads both halves; this file
 * is only the join, so drift.ts can be tested with plain arrays.
 */
import { listOfficers } from "@/lib/inventory/officers";
import type { Officer, Role } from "@/lib/inventory/types";
import { getPortfolio, portfolioIds, type PortfolioId } from "@/lib/portfolios";
import type { Locale } from "@/lib/i18n";

/**
 * One officer's row in the access register, joined against the portfolio
 * vocabulary. Carries everything the register and the drift report need,
 * and nothing the passcode hash touches: `listOfficers()` already excludes
 * it from the app-facing `Officer` type.
 */
export type AccessEntry = {
  id: string;
  name: string;
  email: string;
  role: Role;
  /**
   * The portfolio id, when the value stored on the row matches the closed
   * vocabulary in lib/portfolios.ts. Null both for a genuinely global
   * officer (the stored value is null) and for a stored value that does not
   * resolve, so a malformed row is never silently dropped from a count; see
   * `portfolioRaw`.
   */
  portfolioId: PortfolioId | null;
  /** The exact value stored on the row, kept alongside `portfolioId` so a value that does not resolve is still shown on the register rather than hidden. */
  portfolioRaw: string | null;
  termEnd: string | null;
  isActive: boolean;
};

function isKnownPortfolio(value: string): value is PortfolioId {
  return (portfolioIds as readonly string[]).includes(value);
}

function toAccessEntry(officer: Officer): AccessEntry {
  const raw = officer.portfolio;
  const known = raw !== null && isKnownPortfolio(raw);
  return {
    id: officer.id,
    name: officer.name,
    email: officer.email,
    role: officer.role,
    portfolioId: known ? (raw as PortfolioId) : null,
    portfolioRaw: raw,
    termEnd: officer.termEnd,
    isActive: officer.isActive,
  };
}

/**
 * The officers half of the register, read for real. Empty on a missing
 * `POSTGRES_URL` or a query error, the same "never throws" convention as
 * every other lib/inventory/* reader, since `listOfficers()` already
 * guarantees it.
 */
export async function getOfficerAccessRegister(): Promise<AccessEntry[]> {
  const officers = await listOfficers();
  return officers.map(toAccessEntry);
}

/** One person's Sanity Studio membership, shaped the way the Management API reports it. */
export type StudioMember = {
  email: string;
  name: string | null;
  studioRole: string;
};

/**
 * True while the Sanity half of the access register is blocked on gate 1
 * (docs/DECISIONS-2.0.md). Every caller that needs to say so in a summary or
 * on a page reads this constant rather than inferring it from an empty
 * array, since "the list happens to be empty" and "this cannot be checked
 * yet" are different facts and only one of them is true here. Flip this to
 * `false` in the same change that gives
 * `getStudioAccessRegisterBlockedOnGate1` a real implementation.
 */
export const STUDIO_HALF_BLOCKED_ON_GATE_1 = true;

/**
 * THE SANITY HALF OF THE ACCESS REGISTER. BLOCKED ON GATE 1.
 *
 * docs/DECISIONS-2.0.md, gate 1: there is no Sanity project. The non-profit
 * plan application has not been made, so there is no project id, no
 * Management API token, and nothing to call.
 *
 * When gate 1 clears, this function calls the Sanity Management API
 * (`GET /v2021-06-07/projects/{projectId}/members`) and maps each member to
 * a `StudioMember`: their email, display name, and Studio role. Nothing
 * else in this file or in lib/officer/drift.ts needs to change for that:
 * drift.ts already joins whatever this returns against the officers table,
 * and app/[lang]/officer/access already renders whatever list comes back.
 *
 * Until then it returns an empty list. That is not "no one has Studio
 * access", it is "this cannot be checked yet", and the page reads
 * `STUDIO_HALF_BLOCKED_ON_GATE_1` above to say so rather than letting an
 * empty list pass as a clean result. Do not add a Sanity dependency or
 * fabricate membership data here.
 */
export async function getStudioAccessRegisterBlockedOnGate1(): Promise<StudioMember[]> {
  return [];
}

/**
 * The key lib/officer/drift.ts groups officers by for the two-person rule
 * (section 7.2, principle 11). The officers table models one scoped
 * portfolio per row and nothing finer, so a "capability" here is either a
 * portfolio id, or, for a global officer (whose portfolio is null), their
 * console role: section 7.2's "at least two people hold site
 * administration" is exactly a count over the `admin` role, so the role
 * stands in for portfolio where there is no portfolio to count.
 */
export type Capability =
  { kind: "portfolio"; portfolioId: PortfolioId } | { kind: "role"; role: Role };

const roleLabels: Record<Role, Record<Locale, string>> = {
  admin: { en: "Site administration", th: "ผู้ดูแลระบบ" },
  inventory_manager: { en: "Inventory management", th: "ผู้จัดการครุภัณฑ์" },
  loan_officer: { en: "Loan decisions", th: "ผู้พิจารณาการยืม-คืน" },
  read_only: { en: "Read-only access", th: "สิทธิ์ดูข้อมูลอย่างเดียว" },
};

/**
 * A bilingual label for a drift capability, resolving a portfolio through
 * lib/portfolios.ts or naming a global role plainly. Kept out of
 * lib/officer/drift.ts so that module stays free of i18n and testable with
 * plain fixtures.
 */
export function capabilityLabel(capability: Capability, locale: Locale): string {
  if (capability.kind === "portfolio") {
    return getPortfolio(capability.portfolioId).label[locale];
  }
  return roleLabels[capability.role][locale];
}
