/**
 * The activity calendar as a subscribable iCalendar feed, one per locale
 * (`/en/calendar.ics`, `/th/calendar.ics`). The trailing dot in the path
 * segment means `middleware.ts`'s matcher never touches this route: no
 * locale redirect, no CSP header, so the handler validates `lang` itself
 * and 404s on anything else.
 *
 * Statically generated at build time (`force-static` + `generateStaticParams`)
 * so the response is a plain, cacheable file; it changes only when
 * `content/calendar/events.ts` or `lib/ics.ts`'s `ICS_REVISION` changes and a
 * new build runs.
 */
import { notFound } from "next/navigation";
import { calendarEvents } from "@/content/calendar/events";
import { buildIcs } from "@/lib/ics";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const body = buildIcs(calendarEvents, locale, { siteUrl: SITE_URL });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="birsa-calendar-${locale}.ics"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
