/**
 * Minimum English scores for BIR admission, with the rounds that need each
 * test. Server component, authored from MDX as `<EnglishTestScores />`
 * (see `lib/mdx.tsx`).
 */
import Link from "next/link";
import {
  admissionRounds,
  englishTests,
  type AdmissionRoundId,
} from "@/content/information/admissions";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    caption:
      "Minimum English scores. Your score must be no more than 2 years old on the day you apply.",
    test: "Test",
    minimum: "Minimum score",
    required: "Required for",
    accepted: "Counts as your English test for",
    none: "None",
  },
  th: {
    caption: "คะแนนภาษาอังกฤษขั้นต่ำ ผลสอบต้องมีอายุไม่เกิน 2 ปีนับถึงวันที่สมัคร",
    test: "การสอบ",
    minimum: "คะแนนขั้นต่ำ",
    required: "จำเป็นสำหรับ",
    accepted: "ใช้เป็นผลสอบภาษาอังกฤษสำหรับ",
    none: "ไม่มี",
  },
} as const;

export type EnglishTestScoresProps = {
  locale: Locale;
};

function RoundLinks({ locale, ids }: { locale: Locale; ids: AdmissionRoundId[] }) {
  if (ids.length === 0) return <>{copy[locale].none}</>;
  return (
    <ul className="m-0 list-none p-0">
      {ids.map((id) => {
        const round = admissionRounds.find((r) => r.id === id);
        if (!round) return null;
        return (
          <li key={id}>
            <Link href={localeHref(locale, round.guide)}>{round.name[locale]}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function EnglishTestScores({ locale }: EnglishTestScoresProps) {
  const t = copy[locale];

  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-label={`${getDictionary(locale).a11y.table}, ${t.caption}`}
      tabIndex={0}
    >
      <table>
        <caption className="text-left font-semibold">{t.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.test}</th>
            <th scope="col">{t.minimum}</th>
            <th scope="col">{t.required}</th>
            <th scope="col">{t.accepted}</th>
          </tr>
        </thead>
        <tbody>
          {englishTests.map((test) => (
            <tr key={test.id}>
              <th scope="row" className="text-left">
                {test.name[locale]}
              </th>
              <td>{test.minimum[locale]}</td>
              <td>
                <RoundLinks locale={locale} ids={test.requiredFor} />
              </td>
              <td>
                <RoundLinks locale={locale} ids={test.acceptedFor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
