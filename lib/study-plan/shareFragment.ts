/**
 * The share-with-an-advisor link: a plan carried in the URL fragment.
 *
 * Everything after `#` stays in the browser. It is not sent in the request,
 * not logged by the host and not passed on in a `Referer`, so the read-only
 * view at `/services/study-plan/view` shows a plan that BIRSA never receives.
 * The fragment holds `p`, the plan in the one format every other step uses
 * (`serialisePlan`), and `d`, the day the link was made, so the person
 * reading it can see how old the plan is.
 *
 * Nothing in a fragment is trusted. Anyone can edit a link, and a chat app
 * can cut one short. `decodeShareFragment` returns null for anything that is
 * not a whole, valid plan, through the same `deserialisePlan` validation the
 * plan screen uses, and treats the date as a label only: a missing or
 * malformed date costs the reader the label, never the plan.
 */
import { deserialisePlan, serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";

/** The fragment key that carries the plan. */
export const SHARE_PLAN_KEY = "p";

/** The fragment key that carries the day the link was made, `YYYY-MM-DD`. */
export const SHARE_DATE_KEY = "d";

/**
 * Longest fragment worth decoding. A plan at the schema's limits serialises to
 * well under 10,000 characters, so anything longer is not a plan and is
 * refused before it is parsed.
 */
export const MAX_FRAGMENT_LENGTH = 16000;

export type SharedPlan = {
  plan: StudyPlan;
  /** The day the link was made, or null when the link carries no usable date. */
  sharedOn: string | null;
};

/** Whether `value` is a real calendar day written `YYYY-MM-DD`. */
function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

/**
 * The fragment for a plan, without the leading `#`. `sharedOn` is the day the
 * link is made, `YYYY-MM-DD`; it is left out if it is not a real date, so a
 * bad argument cannot produce a link that decodes to nothing.
 */
export function encodeShareFragment(plan: StudyPlan, sharedOn: string): string {
  const parts = [`${SHARE_PLAN_KEY}=${serialisePlan(plan)}`];
  if (isIsoDate(sharedOn)) parts.push(`${SHARE_DATE_KEY}=${sharedOn}`);
  return parts.join("&");
}

/**
 * The plan a fragment carries, or null when it carries none that is whole and
 * valid. Accepts the fragment with or without its leading `#`. Never throws.
 */
export function decodeShareFragment(fragment: string): SharedPlan | null {
  if (typeof fragment !== "string") return null;
  const bare = fragment.startsWith("#") ? fragment.slice(1) : fragment;
  if (bare.length === 0 || bare.length > MAX_FRAGMENT_LENGTH) return null;

  const values = new Map<string, string>();
  for (const part of bare.split("&")) {
    const at = part.indexOf("=");
    if (at <= 0) continue;
    const key = part.slice(0, at);
    // The first occurrence wins, so a link cannot be made to say two things.
    if (!values.has(key)) values.set(key, part.slice(at + 1));
  }

  const rawPlan = values.get(SHARE_PLAN_KEY);
  if (!rawPlan) return null;
  const plan = deserialisePlan(rawPlan);
  if (!plan) return null;

  const rawDate = values.get(SHARE_DATE_KEY);
  return { plan, sharedOn: rawDate !== undefined && isIsoDate(rawDate) ? rawDate : null };
}

/** The Bangkok calendar day of `now`, `YYYY-MM-DD`, whatever timezone the host is in. */
export function shareDateOf(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** A `YYYY-MM-DD` day in words for `locale`, e.g. "11 October 2026", or null when it is not a real date. */
export function formatShareDate(iso: string, locale: "en" | "th"): string | null {
  if (!isIsoDate(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!)).toLocaleDateString(
    locale === "th" ? "th-TH" : "en-GB",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
  );
}

/** `path` with the plan's fragment appended, e.g. `/en/services/study-plan/view#p=...`. */
export function shareLink(path: string, plan: StudyPlan, sharedOn: string): string {
  return `${path}#${encodeShareFragment(plan, sharedOn)}`;
}
