import Link from "next/link";
import Icon from "@/components/icons/Icon";
import { getDueSoon, type DueItem } from "@/lib/home/due-soon";
import { getJourneyPhase, getNextTermJourney, shouldShowJourneyChip } from "@/lib/next-term";
import { NEXT_TERM_PATH, nextTermCopy } from "@/content/next-term";
import { formatDate, localeHref, type Locale } from "@/lib/i18n";
import clsx from "clsx";
import { dueSoonCopy } from "./dueSoonCopy";

export type DueSoonProps = {
  locale: Locale;
  todayKey: string;
  className?: string;
};

function weekdayAbbreviation(locale: Locale, key: string): string {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-gregory" : "en-GB", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00Z`));
}

function dayOfMonth(key: string): number {
  return Number(key.slice(8, 10));
}

function relativePhrase(item: DueItem, locale: Locale): string {
  const copy = dueSoonCopy[locale];
  if (item.ongoing) return copy.onNow;
  if (item.daysUntil === 0) return copy.today;
  if (item.daysUntil === 1) return copy.tomorrow;
  return copy.inDays(item.daysUntil);
}

function closesLabel(closesInDays: number, locale: Locale): string {
  const copy = dueSoonCopy[locale];
  return closesInDays === 0 ? copy.closesToday : copy.closesIn(closesInDays);
}

export function DueSoonRow({ item, locale }: { item: DueItem; locale: Locale }) {
  const copy = dueSoonCopy[locale];
  const urgent = item.closesInDays !== undefined;
  const hasRange = item.end !== undefined && item.end !== item.start;
  const blockDate = item.ongoing && item.end ? item.end : item.start;

  return (
    <li className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <div
        aria-hidden="true"
        className={clsx(
          "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg leading-tight",
          urgent ? "bg-brand text-white" : "bg-sunken text-ink"
        )}
      >
        <span className="text-xs font-semibold">{weekdayAbbreviation(locale, blockDate)}</span>
        <span className="font-display text-xl">{dayOfMonth(blockDate)}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <Link
          href={localeHref(locale, item.href)}
          className="inline-flex min-h-11 items-center font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
        >
          {item.title}
        </Link>
        <p className="text-sm text-muted">
          {hasRange && item.end ? (
            <>
              <time dateTime={item.start}>{formatDate(locale, item.start)}</time>
              {locale === "th" ? " ถึง " : " to "}
              <time dateTime={item.end}>{formatDate(locale, item.end)}</time>
            </>
          ) : (
            <time dateTime={item.start}>{formatDate(locale, item.start)}</time>
          )}
          {`, ${relativePhrase(item, locale)}, ${copy.sources[item.source]}`}
        </p>
        {item.closesInDays !== undefined ? (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white">
            <Icon name="clock" className="h-4 w-4" />
            {closesLabel(item.closesInDays, locale)}
          </p>
        ) : null}
        {item.action ? (
          <Link
            href={localeHref(locale, item.action.href)}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
          >
            {item.action.label}
          </Link>
        ) : null}
      </div>
    </li>
  );
}

export default function DueSoon({ locale, todayKey, className }: DueSoonProps) {
  const copy = dueSoonCopy[locale];
  const items = getDueSoon(todayKey, locale);
  const journey = getNextTermJourney(todayKey);
  const showChip = journey !== null && shouldShowJourneyChip(journey, todayKey);

  return (
    <section
      aria-labelledby="due-soon-heading"
      className={clsx("rounded-2xl border border-line bg-surface p-4 sm:p-5", className)}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4">
        <h2 id="due-soon-heading" className="font-display text-xl">
          {copy.heading}
        </h2>
        <Link
          href={localeHref(locale, "/dates")}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
        >
          <span>
            {copy.allDates}
            <span className="sr-only">{copy.allDatesContext}</span>
          </span>
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
      {showChip && journey ? (
        <Link
          href={localeHref(locale, NEXT_TERM_PATH)}
          className="mb-3 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-study-tint px-4 py-2 text-sm text-study no-underline hover:underline"
        >
          <Icon name="plan" className="h-5 w-5" />
          <span className="flex flex-wrap gap-x-2">
            <span className="font-semibold">{nextTermCopy[locale].chip}</span>
            <span className="sr-only">. </span>
            <span>{nextTermCopy[locale].phase(getJourneyPhase(journey, todayKey))}</span>
          </span>
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      ) : null}
      {items.length > 0 ? (
        <ol aria-label={copy.listLabel} className="divide-y divide-line">
          {items.map((item) => (
            <DueSoonRow key={item.id} item={item} locale={locale} />
          ))}
        </ol>
      ) : (
        <p className="text-muted">{copy.empty}</p>
      )}
    </section>
  );
}
