import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { parseStopEta, THA_PRACHAN_OPPOSITE_STOP_ID } from "@/lib/shuttle-live";

/**
 * Same-origin proxy for the OTP "Namtang" live bus-arrival feed at the
 * "Opposite Tha Prachan" stop, feeding `ShuttleLiveWaitTimes` on the shuttle
 * bus guide. The upstream endpoint
 * (`https://namtang-api.otp.go.th/front/stop-eta/{stopId}`) sends no CORS
 * headers and is HTTP-only-friendly public data, so the browser cannot read it
 * directly; this route fetches it server-side and returns only the three
 * routes the modified-service notice cares about (53, 43, 15), already shaped.
 *
 * The response is briefly shared-cached (`s-maxage=20`) so a lecture hall full
 * of students refreshing the page hits Namtang at most a few times a minute,
 * while the numbers stay live enough to be useful.
 */

const UPSTREAM_BASE = "https://namtang-api.otp.go.th/front/stop-eta";
const UPSTREAM_TIMEOUT_MS = 6000;

export async function GET(request: Request) {
  const ip = getClientIp(request);
  // Generous budget: the client polls roughly every 30s, and a shared campus
  // IP carries many students at once, so this only catches runaway clients.
  if (!checkRateLimit(ip, "shuttle-eta", 120)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;

  const upstream = `${UPSTREAM_BASE}/${THA_PRACHAN_OPPOSITE_STOP_ID}?locale=${locale}`;

  let payload: unknown;
  try {
    const res = await fetch(upstream, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, reason: "upstream-error" }, { status: 502 });
    }
    payload = await res.json();
  } catch {
    // Timeout, network error, or non-JSON body: the board shows its own
    // "couldn't reach live times" state rather than a broken card.
    return NextResponse.json({ ok: false, reason: "upstream-unreachable" }, { status: 502 });
  }

  const routes = parseStopEta(payload);

  return NextResponse.json(
    { ok: true, updatedAt: new Date().toISOString(), routes },
    { status: 200, headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" } }
  );
}
