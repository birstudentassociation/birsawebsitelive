import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { MIN_QUERY_LENGTH, suggest } from "@/lib/search/query";

/**
 * Typeahead suggestions for `SearchBox`. Deliberately thin: all the real work
 * (tokenising, ranking, synonyms) lives in `lib/search/query.ts`. This route
 * only validates params, rate-limits, and shapes the response.
 *
 * No query is logged and no `Cache-Control` is set: suggestions are per-user
 * and per-keystroke, so caching them would be both wrong (stale/irrelevant
 * results) and a privacy problem (the site's PDPA processing record does not
 * cover retaining search queries).
 */
export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "search", 60)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;

  const q = searchParams.get("q") ?? "";
  if (q.trim().length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ ok: true, suggestions: [] }, { status: 200 });
  }

  // `Number(null)` is 0, which is finite, so an absent `limit` must be caught
  // before the clamp or every default request would ask for a single result.
  const limitParam = searchParams.get("limit");
  const parsedLimit = limitParam === null ? Number.NaN : Number(limitParam);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(20, Math.max(1, Math.trunc(parsedLimit)))
    : 8;

  const suggestions = suggest(locale, q, limit);

  return NextResponse.json({ ok: true, suggestions }, { status: 200 });
}
