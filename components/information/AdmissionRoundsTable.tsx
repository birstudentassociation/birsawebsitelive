/**
 * Comparison of the BIR admission rounds: an at-a-glance table of round, dates
 * and seats, then one summary card per round (an h3 linking to its guide, with
 * a summary list of the details). Server component, authored from MDX as
 * `<AdmissionRoundsTable />` under an h2 (see `lib/mdx.tsx`).
 */
import Link from "next/link";
import { admissionRounds } from "@/content/information/admissions";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";
import { formatSpan } from "./format";

const copy = {
  en: {
    caption: "Compare the BIR admission rounds",
    round: "Round",
    who: "Who can apply",
    window: "Apply between",
    seats: "Seats",
    grades: "Minimum grades",
    tests: "Tests needed",
    selection: "How you are chosen",
    fee: "Fee",
  },
  th: {
    caption: "เปรียบเทียบรอบรับสมัคร BIR",
    round: "รอบ",
    who: "ผู้ที่สมัครได้",
    window: "ช่วงรับสมัคร",
    seats: "จำนวนที่รับ",
    grades: "เกรดขั้นต่ำ",
    tests: "ผลสอบที่ต้องใช้",
    selection: "วิธีคัดเลือก",
    fee: "ค่าสมัคร",
  },
} as const;

export type AdmissionRoundsTableProps = {
  locale: Locale;
};

export default function AdmissionRoundsTable({ locale }: AdmissionRoundsTableProps) {
  const t = copy[locale];
  const tableLabel = `${getDictionary(locale).a11y.table}, ${t.caption}`;

  return (
    <>
      <div className="overflow-x-auto" role="region" aria-label={tableLabel} tabIndex={0}>
        <table>
          <caption className="sr-only">{t.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.round}</th>
              <th scope="col">{t.window}</th>
              <th scope="col">{t.seats}</th>
            </tr>
          </thead>
          <tbody>
            {admissionRounds.map((round) => (
              <tr key={round.id}>
                <th scope="row" className="text-left">
                  {round.name[locale]}
                </th>
                <td>
                  <Windows locale={locale} round={round} />
                </td>
                <td>{round.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {admissionRounds.map((round) => {
          const rows = [
            [t.who, round.who[locale]],
            [t.window, <Windows key="window" locale={locale} round={round} />],
            [t.seats, round.seats],
            [t.grades, round.minimumGrades[locale]],
            [t.tests, round.tests[locale]],
            [t.selection, round.selection[locale]],
            [t.fee, round.fee[locale]],
          ] as const;
          return (
            <section
              key={round.id}
              aria-labelledby={`round-${round.id}`}
              className="rounded-lg border border-line bg-surface"
            >
              <h3
                id={`round-${round.id}`}
                className="m-0 rounded-t-lg border-b border-line bg-sunken px-4 py-3 font-display text-lg font-semibold text-ink"
              >
                <Link href={localeHref(locale, round.guide)}>{round.name[locale]}</Link>
              </h3>
              <dl className="m-0 divide-y divide-line text-sm">
                {rows.map(([key, value]) => (
                  <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-6">
                    <dt className="font-semibold text-muted">{key}</dt>
                    <dd className="m-0 mt-1 text-ink sm:mt-0">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </>
  );
}

function Windows({ locale, round }: { locale: Locale; round: (typeof admissionRounds)[number] }) {
  return round.window.map((window) => (
    <p key={window.start} className="m-0">
      {formatSpan(locale, window)}
      {window.label ? ` (${window.label[locale]})` : null}
    </p>
  ));
}
