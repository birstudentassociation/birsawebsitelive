/**
 * Two columns (date, what happens) so the table fits a phone without sideways
 * scrolling. Dated steps for one BIR admission round, or for every round in date order
 * under month headings when no `round` is given. Dates that are not set yet
 * show as "to be announced". Server component, authored from MDX as
 * `<AdmissionDates round="inter-portfolio-1" />` (see `lib/mdx.tsx`).
 */
import {
  admissionRounds,
  getAdmissionRound,
  type AdmissionMilestone,
  type AdmissionRound,
} from "@/content/information/admissions";
import { getDictionary, type Locale } from "@/lib/i18n";
import { formatMonth, formatSpan } from "./format";

const copy = {
  en: {
    caption: "Key dates for",
    allCaption: "Key dates for every admission round",
    monthCaption: "Dates in",
    date: "Date",
    what: "What happens",
    tba: "To be announced",
  },
  th: {
    caption: "กำหนดการของ",
    allCaption: "กำหนดการของทุกรอบรับสมัคร",
    monthCaption: "กำหนดการเดือน",
    date: "วันที่",
    what: "สิ่งที่เกิดขึ้น",
    tba: "ประกาศภายหลัง",
  },
} as const;

export type AdmissionDatesProps = {
  locale: Locale;
  round?: string;
};

type Entry = { round: AdmissionRound; milestone: AdmissionMilestone };

function startOf(entry: Entry): string {
  return entry.milestone.date === "tba" ? "" : entry.milestone.date.start;
}

function TableRegion({
  locale,
  caption,
  children,
}: {
  locale: Locale;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-label={`${getDictionary(locale).a11y.table}, ${caption}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function dateText(locale: Locale, milestone: AdmissionMilestone): string {
  return milestone.date === "tba" ? copy[locale].tba : formatSpan(locale, milestone.date);
}

function DateTable({
  locale,
  caption,
  entries,
  showRound,
  hideCaption,
}: {
  locale: Locale;
  caption: string;
  entries: Entry[];
  showRound: boolean;
  hideCaption?: boolean;
}) {
  const t = copy[locale];
  return (
    <TableRegion locale={locale} caption={caption}>
      <table>
        <caption className={hideCaption ? "sr-only" : "text-left font-semibold"}>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.date}</th>
            <th scope="col">{t.what}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ round, milestone }) => (
            <tr key={`${round.id}-${milestone.id}`}>
              <th scope="row" className="text-left font-normal">
                {dateText(locale, milestone)}
              </th>
              <td>
                {showRound ? (
                  <span className="block text-sm font-semibold text-muted">
                    {round.name[locale]}
                  </span>
                ) : null}
                {milestone.label[locale]}
                {milestone.note ? (
                  <span className="block text-sm text-muted">{milestone.note[locale]}</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableRegion>
  );
}

export default function AdmissionDates({ locale, round }: AdmissionDatesProps) {
  const t = copy[locale];

  if (round !== undefined) {
    const found = getAdmissionRound(round);
    if (!found) throw new Error(`AdmissionDates: unknown round "${round}"`);
    return (
      <DateTable
        locale={locale}
        caption={`${t.caption} ${found.name[locale]}`}
        entries={found.milestones.map((milestone) => ({ round: found, milestone }))}
        showRound={false}
      />
    );
  }

  const entries: Entry[] = admissionRounds.flatMap((r) =>
    r.milestones.map((milestone) => ({ round: r, milestone }))
  );
  const dated = entries
    .filter((entry) => entry.milestone.date !== "tba")
    .sort((a, b) => startOf(a).localeCompare(startOf(b)));
  const undated = entries.filter((entry) => entry.milestone.date === "tba");

  const months = new Map<string, Entry[]>();
  for (const entry of dated) {
    const key = startOf(entry).slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), entry]);
  }

  return (
    <div className="flex flex-col gap-6">
      {[...months.entries()].map(([month, group]) => {
        const heading = formatMonth(locale, month);
        return (
          <section key={month}>
            <h3>{heading}</h3>
            <DateTable
              locale={locale}
              caption={`${t.monthCaption} ${heading}`}
              entries={group}
              showRound
              hideCaption
            />
          </section>
        );
      })}
      {undated.length > 0 ? (
        <section>
          <h3>{t.tba}</h3>
          <DateTable
            locale={locale}
            caption={`${t.allCaption}, ${t.tba}`}
            entries={undated}
            showRound
            hideCaption
          />
        </section>
      ) : null}
    </div>
  );
}
