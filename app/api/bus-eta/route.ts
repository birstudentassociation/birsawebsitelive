import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { parseLiveStop, STOP_IDS, type BusEtaResponse } from "@/lib/bus-tracker/live";

/**
 * Same-origin proxy for the OTP "Namtang" live bus-arrival feed, powering the
 * "Live public bus tracker" guide. It fetches `stop-eta/{stopId}` for the three
 * tracked stops (2373, 1573, 1061) server-side — the upstream sends no usable
 * CORS headers, so the browser cannot read it directly — and returns only the
 * shaped arrivals, grouped by the same `patternKey` the baked line data carries
 * (`lib/bus-tracker/data.ts`), so the client can overlay live times onto the
 * static route list.
 *
 * Responses are briefly shared-cached (`s-maxage=20`) so a crowd refreshing the
 * board hits Namtang at most a few times a minute while the numbers stay live.
 */

const UPSTREAM_BASE = "https://namtang-api.otp.go.th/front/stop-eta";
const UPSTREAM_TIMEOUT_MS = 6000;

async function fetchStop(stopId: number, locale: string) {
  try {
    const res = await fetch(`${UPSTREAM_BASE}/${stopId}?locale=${locale}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
    // Upstream errors come back as HTML with an error status, not JSON, so we
    // gate on `res.ok` before parsing.
    if (!res.ok) return null;
    return parseLiveStop(await res.json());
  } catch {
    // Timeout, network error, or non-JSON body: this stop simply has no live
    // arrivals this cycle; the board keeps its static route list and says so.
    return null;
  }
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  // Generous budget: the client polls roughly every 30s and a shared campus IP
  // carries many students at once, so this only catches runaway clients.
  if (!checkRateLimit(ip, "bus-eta", 120)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const localeParam = new URL(request.url).searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;

  const results = await Promise.all(STOP_IDS.map((id) => fetchStop(id, locale)));

  // A stop that failed this cycle contributes an empty map rather than dropping
  // out, so the client always gets an entry for every stop it renders.
  const stops: BusEtaResponse["stops"] = {};
  STOP_IDS.forEach((id, i) => {
    stops[String(id)] = results[i] ?? {};
  });

  const body: BusEtaResponse = { ok: true, updatedAt: new Date().toISOString(), stops };
  return NextResponse.json(body, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" },
  });
}
