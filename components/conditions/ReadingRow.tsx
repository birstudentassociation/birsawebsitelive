import clsx from "clsx";
import ExternalLink from "@/components/ExternalLink";
import {
  fillTemplate,
  formatBangkokClock,
  formatBangkokDateTime,
  formatReadingValue,
  type ValueLabels,
} from "@/lib/conditions/format";
import { isFresh, type Reading } from "@/lib/conditions/types";
import type { Locale } from "@/lib/i18n";

type Labels = {
  modelEstimate: string;
  read: string;
  staleSince: string;
  notAvailable: string;
  stationLabel: string;
  thresholdLabel: string;
  sourceLabel: string;
  values: ValueLabels;
};

type Props = {
  locale: Locale;
  reading: Reading;
  label: string;
  threshold: string;
  now: Date;
  newTabLabel: string;
  t: Labels;
};

function itemAttributes(
  item: NonNullable<Reading["items"]>[number],
  locale: Locale,
  kmLabel: string
): string {
  const parts: string[] = [];
  if (item.at) parts.push(formatBangkokDateTime(item.at, locale));
  if (item.distanceKm !== undefined) parts.push(`${item.distanceKm.toFixed(1)} ${kmLabel}`);
  return parts.join(", ");
}

export default function ReadingRow({
  locale,
  reading,
  label,
  threshold,
  now,
  newTabLabel,
  t,
}: Props) {
  const available = reading.value !== null;
  const fresh = Boolean(isFresh(reading, now));
  const grey = !fresh;

  let timeLine: string | null = null;
  if (available && reading.observedAt) {
    timeLine = fresh
      ? fillTemplate(t.read, { time: formatBangkokClock(reading.observedAt) })
      : fillTemplate(t.staleSince, { when: formatBangkokDateTime(reading.observedAt, locale) });
  }

  return (
    <li className="flex flex-col gap-1 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-semibold">{label}</h4>
        <p className={clsx("font-display text-xl", grey ? "text-muted" : "text-ink")}>
          {available
            ? formatReadingValue(reading.value as number, reading.unit, t.values)
            : t.notAvailable}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        {reading.modelled ? (
          <span className="rounded-sm border border-line-strong bg-sunken px-2 py-0.5 text-xs font-medium text-ink">
            {t.modelEstimate}
          </span>
        ) : null}
        {timeLine ? <span>{timeLine}</span> : null}
        <span>
          {t.stationLabel} {reading.station[locale]}
        </span>
      </div>

      {reading.detail ? <p className="text-sm text-muted">{reading.detail[locale]}</p> : null}
      <p className="text-sm text-muted">
        {t.thresholdLabel} {threshold}
      </p>

      {reading.items && reading.items.length > 0 ? (
        <ul className="mt-1 flex list-disc flex-col gap-1 pl-5 text-sm">
          {reading.items.map((item, index) => {
            const attributes = itemAttributes(item, locale, t.values.km);
            return (
              <li key={`${item.title.en}-${index}`}>
                {item.href ? (
                  <ExternalLink
                    href={item.href}
                    newTabLabel={newTabLabel}
                    className="text-brand-deep underline"
                  >
                    {item.title[locale]}
                  </ExternalLink>
                ) : (
                  item.title[locale]
                )}
                {attributes ? <span className="text-muted"> ({attributes})</span> : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="text-sm">
        <span className="text-muted">{t.sourceLabel} </span>
        <ExternalLink
          href={reading.source.url}
          newTabLabel={newTabLabel}
          className="text-brand-deep underline"
        >
          {reading.source.name[locale]}
        </ExternalLink>
      </p>
    </li>
  );
}
