/**
 * The personal calendar feed (`/en/my-calendar.ics?inc=…&c=…`). Dynamic: the
 * selection is read from the query string and nothing is stored. As with
 * `calendar.ics`, the dotted segment keeps `proxy.ts` away, so `lang` is
 * validated here. `download=1` serves it as an attachment.
 */
import { notFound } from "next/navigation";
import { buildCustomIcs } from "@/lib/calendar-builder/feed";
import { decodeSelection } from "@/lib/calendar-builder/selection";
import { isLocale, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const { searchParams } = new URL(request.url);
  const body = buildCustomIcs(decodeSelection(searchParams), locale, { siteUrl: SITE_URL });
  const disposition =
    searchParams.get("download") === "1"
      ? `attachment; filename="bir-calendar-${locale}.ics"`
      : `inline; filename="bir-calendar-${locale}.ics"`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": disposition,
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
