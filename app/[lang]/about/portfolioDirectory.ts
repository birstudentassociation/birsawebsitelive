/**
 * Combines `lib/portfolios.ts` (FROZEN, the standing portfolio vocabulary,
 * §7.2) with `content/committee.ts` (the real 2026 committee roster) to
 * answer "who currently holds this portfolio", without inventing anything:
 * both sources already exist and are already treated as ground truth
 * elsewhere on the site (`components/about/CommitteeRoster.tsx`,
 * `app/[lang]/activity/roles/page.tsx`).
 *
 * A `portfolio` Sanity document type exists (`sanity/schemaTypes/documents/
 * portfolio.ts`) for the same job, but requires a `holder` and a
 * `secondHolder` reference to be filled in by an officer before it can
 * publish, and no such documents exist in the CMS yet. Deriving the
 * directory from the two frozen, git-authored sources instead means `/about/
 * portfolios` shows the REAL current holders today, rather than an empty
 * state until someone fills in the Studio. `lib/portfolios.ts`'s own
 * `heldBy` field is exactly the join key this needs: the committee role
 * titles that hold a given portfolio, taken from `content/committee.ts`'s
 * own title strings, not retyped.
 */
import { committee, type CommitteeMember } from "@/content/committee";
import { getPortfolio, portfolios, type Portfolio, type PortfolioId } from "@/lib/portfolios";

export type { Portfolio, PortfolioId };

/**
 * Every committee member currently holding `portfolioId`, in the order
 * `content/committee.ts` lists them (officers before assistant officers,
 * "in the order BIRSA supplied"). Empty only if `lib/portfolios.ts`'s
 * `heldBy` names a role title nobody on the current roster holds, which
 * would itself be worth an officer's attention rather than something this
 * function should paper over.
 */
export function getPortfolioHolders(portfolioId: PortfolioId): CommitteeMember[] {
  const portfolio = getPortfolio(portfolioId);
  return committee.filter((member) => portfolio.heldBy.includes(member.en.title));
}

export function listPortfoliosWithHolders(): Array<{
  portfolio: Portfolio;
  holders: CommitteeMember[];
}> {
  return portfolios.map((portfolio) => ({
    portfolio,
    holders: getPortfolioHolders(portfolio.id),
  }));
}
