/**
 * CSV download for one open data table, per locale:
 * `/en/open-data/2025-26/money/planned-budget.csv`. Built once at build time
 * from the same rows the page renders, so the file always matches the table.
 */
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildCsv, csvFilename } from "@/lib/open-data";
import { editions, getEdition, getTopic } from "@/content/open-data";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    editions.flatMap((edition) =>
      edition.topics.flatMap((topic) =>
        topic.datasets.map((dataset) => ({
          lang,
          edition: edition.slug,
          topic: topic.slug,
          file: `${dataset.id}.csv`,
        }))
      )
    )
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; edition: string; topic: string; file: string }> }
) {
  const { lang, edition: editionSlug, topic: topicSlug, file } = await params;
  if (!isLocale(lang) || !file.endsWith(".csv")) notFound();
  const locale: Locale = lang;
  const edition = getEdition(editionSlug);
  const topic = edition ? getTopic(edition, topicSlug) : undefined;
  const dataset = topic?.datasets.find((d) => `${d.id}.csv` === file);
  if (!edition || !dataset) notFound();

  return new Response(buildCsv(dataset, locale), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvFilename(edition.slug, dataset.id, locale)}"`,
      "Cache-Control": "public, max-age=86400, s-maxage=31536000",
    },
  });
}
