/**
 * Small shared helpers for the `/privacy/your-data` PDPA rights journey,
 * used by both the server action (`app/[lang]/privacy/your-data/actions.ts`)
 * and its no-JavaScript fallback (`app/api/rights-request/route.ts`), so the
 * two never compute the section 30 deadline differently.
 */
import { dataRights, RIGHTS_RESPONSE_DAYS, type DataRight } from "@/content/privacy/register";

/** Looks up a right by the id `rightsRequestSchema` validated, e.g. "access". */
export function rightById(id: string): DataRight | undefined {
  return dataRights.find((right) => right.id === id);
}

/**
 * ISO date (YYYY-MM-DD) `RIGHTS_RESPONSE_DAYS` days from now: the date by
 * which section 30 requires BIRSA to answer a request made today. Computed
 * in UTC, which is precise enough for a day-granularity compliance deadline.
 */
export function rightsDeadlineIso(): string {
  const deadline = new Date();
  deadline.setUTCDate(deadline.getUTCDate() + RIGHTS_RESPONSE_DAYS);
  return deadline.toISOString().slice(0, 10);
}
