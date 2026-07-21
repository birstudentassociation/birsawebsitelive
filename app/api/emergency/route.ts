import { NextResponse } from "next/server";
import { getEmergencyBannerData } from "@/lib/emergency";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * Current emergency-banner state for a locale, polled by `EmergencyBannerClient`
 * so already-open tabs pick up a toggle without a full navigation.
 *
 * The response is CDN-cached (`s-maxage`), so N visitors within the window
 * collapse to ~1 origin invocation per edge region rather than one per request.
 * `stale-while-revalidate` keeps serving instantly while the value refreshes in
 * the background. A flip goes live within `s-maxage` seconds; for an immediate
 * push, purge this route's cache (or `revalidateTag("emergency")`, which also
 * refreshes the server-rendered banner) after changing Edge Config.
 *
 * The underlying read is already cached in `lib/emergency.ts` and never throws,
 * so this always returns 200 with a well-formed payload.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;

  const data = await getEmergencyBannerData(locale);

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
    },
  });
}
