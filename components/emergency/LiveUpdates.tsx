import type { ActiveEmergency } from "@/content/emergency/types";
import { alertUpdatedAt, formatAlertTime } from "@/lib/emergency";
import type { Locale } from "@/lib/i18n";

type Update = NonNullable<ActiveEmergency["updates"]>[number];

type Labels = {
  liveUpdates: string;
  updated: string;
  latest: string;
  /** Contains `{n}`. */
  earlierUpdates: string;
};

type Props = {
  locale: Locale;
  alert: ActiveEmergency;
  t: Labels;
};

/** How many updates show before the rest fold away. */
const SHOWN = 3;

/**
 * The live alert's updates as a newest-first timeline. The latest few are
 * open; older ones fold into a native `<details>` so the page stays short.
 */
export default function LiveUpdates({ locale, alert, t }: Props) {
  const updates = alert.updates ?? [];
  if (updates.length === 0) return null;
  const shown = updates.slice(0, SHOWN);
  const earlier = updates.slice(SHOWN);
  const updatedAt = alertUpdatedAt(alert);

  return (
    <section
      id="live-updates"
      aria-labelledby="live-updates-heading"
      className="flex scroll-mt-24 flex-col gap-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="live-updates-heading" className="font-display text-2xl">
          {t.liveUpdates}
        </h2>
        <p className="text-sm text-muted">
          {t.updated} <time dateTime={updatedAt}>{formatAlertTime(locale, updatedAt)}</time>
        </p>
      </div>

      <Timeline locale={locale} updates={shown} latestLabel={t.latest} markLatest />

      {earlier.length > 0 ? (
        <details className="group">
          <summary className="focus-halo inline-flex cursor-pointer list-none items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            {t.earlierUpdates.replace("{n}", String(earlier.length))}
            <span aria-hidden="true" className="transition-transform group-open:rotate-180">
              &darr;
            </span>
          </summary>
          <div className="mt-5">
            <Timeline locale={locale} updates={earlier} latestLabel={t.latest} />
          </div>
        </details>
      ) : null}
    </section>
  );
}

function Timeline({
  locale,
  updates,
  latestLabel,
  markLatest = false,
}: {
  locale: Locale;
  updates: Update[];
  latestLabel: string;
  markLatest?: boolean;
}) {
  return (
    <ol className="ml-1.5 flex flex-col border-l-2 border-line pl-6">
      {updates.map((update, i) => {
        const latest = markLatest && i === 0;
        return (
          <li key={update.at} className="relative flex flex-col gap-2 pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 -left-[31px] h-3 w-3 rounded-full border-2 ${
                latest ? "border-error bg-error" : "border-muted bg-surface"
              }`}
            />
            <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
              <time dateTime={update.at}>{formatAlertTime(locale, update.at)}</time>
              {latest ? (
                <span className="rounded-full bg-error px-2 py-0.5 text-xs font-semibold tracking-wide text-white uppercase">
                  {latestLabel}
                </span>
              ) : null}
            </p>
            <p className="leading-relaxed font-semibold text-ink">{update.text[locale]}</p>
            {update.points?.[locale]?.length ? (
              <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink">
                {update.points[locale].map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
