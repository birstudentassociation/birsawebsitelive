/**
 * Renders the output of `checkPlan`: every finding, sorted problem before
 * warning before note, each with its citation in smaller muted text.
 *
 * Findings never block anything on the plan screen (see `lib/study-plan/
 * findings.ts`'s header comment); this component only presents them, in an
 * order that puts what most needs attention first.
 */
import Link from "next/link";
import Tag from "@/components/Tag";
import WarningText from "@/components/WarningText";
import { hasPage } from "@/lib/courses/graph";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Finding } from "@/lib/study-plan/findings";

const SEVERITY_ORDER: Record<Finding["severity"], number> = {
  problem: 0,
  warning: 1,
  note: 2,
};

const SEVERITY_TAG: Record<
  Finding["severity"],
  { variant: "neutral" | "amber" | "red"; label: Record<Locale, string> }
> = {
  problem: { variant: "red", label: { en: "Problem", th: "ปัญหา" } },
  warning: { variant: "amber", label: { en: "Check", th: "ตรวจสอบ" } },
  note: { variant: "neutral", label: { en: "Note", th: "หมายเหตุ" } },
};

/**
 * A course code as findings write them, e.g. PI300 or LAS101, not part of a
 * longer run of letters or digits. The capture group makes `split` keep the
 * codes, at the odd indices.
 */
const COURSE_CODE = /(?<![A-Za-z0-9])([A-Z]{2,4}\d{3})(?![A-Za-z0-9])/;

/**
 * A finding's message with each course code that has a page turned into a
 * link to it, so "PI300 needs PI211 passed first" takes the student to PI211
 * in one step. The messages stay plain strings in `checkPlan`, so the findings
 * engine is unchanged and a code with no page is simply left as text.
 */
function MessageWithCourseLinks({ message, locale }: { message: string; locale: Locale }) {
  return (
    <>
      {message.split(COURSE_CODE).map((part, i) =>
        i % 2 === 1 && hasPage(part) ? (
          <Link
            key={i}
            href={localeHref(locale, `/student-life/course-reviews/${part}`)}
            className="font-semibold text-brand-deep underline underline-offset-2 hover:text-brand-dark print:text-ink"
          >
            {part}
          </Link>
        ) : (
          part
        )
      )}
    </>
  );
}

export type FindingsListProps = {
  findings: Finding[];
  locale: Locale;
  /** Shown in place of the list when there is nothing to flag. */
  emptyMessage: string;
};

export default function FindingsList({ findings, locale, emptyMessage }: FindingsListProps) {
  if (findings.length === 0) {
    return <p className="text-sm text-muted">{emptyMessage}</p>;
  }

  // A stable sort, not a filter: nothing here is ever dropped, only ordered
  // so a problem is never buried under a note the student read first.
  const sorted = [...findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  return (
    <ul className="flex flex-col divide-y divide-line border-y border-line">
      {sorted.map((finding) => {
        const tag = SEVERITY_TAG[finding.severity];
        const message = (
          <MessageWithCourseLinks message={finding.message[locale]} locale={locale} />
        );
        return (
          <li key={finding.id} className="py-3 text-sm">
            <Tag variant={tag.variant}>{tag.label[locale]}</Tag>
            <div className="mt-2">
              {finding.severity === "problem" ? (
                <WarningText locale={locale}>{message}</WarningText>
              ) : (
                <p className="text-ink">{message}</p>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">{finding.source.provision}</p>
          </li>
        );
      })}
    </ul>
  );
}
