/**
 * Small shared helpers for the `/privacy/your-data` PDPA rights journey,
 * used by both the server action (`app/[lang]/privacy/your-data/actions.ts`)
 * and its no-JavaScript fallback (`app/api/rights-request/route.ts`), so the
 * two never compute the section 30 deadline differently.
 */
import { todayInBangkok } from "@/lib/bangkok-today";
import { dataRights, RIGHTS_RESPONSE_DAYS, type DataRight } from "@/content/privacy/register";

/** Looks up a right by the id `rightsRequestSchema` validated, e.g. "access". */
export function rightById(id: string): DataRight | undefined {
  return dataRights.find((right) => right.id === id);
}

/**
 * ISO date (YYYY-MM-DD) `RIGHTS_RESPONSE_DAYS` days from now: the date by
 * which section 30 requires BIRSA to answer a request made today. Counted
 * from the Bangkok calendar day, so a request made after midnight in Bangkok
 * is not given the previous day's deadline.
 */
export function rightsDeadlineIso(): string {
  const deadline = new Date(`${todayInBangkok()}T00:00:00Z`);
  deadline.setUTCDate(deadline.getUTCDate() + RIGHTS_RESPONSE_DAYS);
  return deadline.toISOString().slice(0, 10);
}
