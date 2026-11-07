/**
 * CSV download for one trend table, per locale:
 * `/en/open-data/trends/planned-budget.csv`. Built at build time from the
 * rows the trends page draws, so the file always matches the figure.
 */
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { buildCsv } from "@/lib/open-data";
import { trends } from "@/content/open-data/trends";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => trends.map((s) => ({ lang, file: `${s.id}.csv` })));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; file: string }> }
) {
  const { lang, file } = await params;
  const section = trends.find((s) => `${s.id}.csv` === file);
  if (!isLocale(lang) || !section) notFound();

  return new Response(buildCsv(section.dataset, lang), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="birsa-trends-${section.id}-${lang}.csv"`,
      "Cache-Control": "public, max-age=86400, s-maxage=31536000",
    },
  });
}
