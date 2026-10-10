/**
 * Renders the output of `checkPlan`: every finding, sorted problem before
 * warning before note, each with its citation in smaller muted text.
 *
 * Findings never block anything on the plan screen (see `lib/study-plan/
 * findings.ts`'s header comment); this component only presents them, in an
 * order that puts what most needs attention first.
 */
import Link from "next/link";
import { hasPage } from "@/lib/courses/graph";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Finding } from "@/lib/study-plan/findings";

const SEVERITY_ORDER: Record<Finding["severity"], number> = {
  problem: 0,
  warning: 1,
  note: 2,
};

const SEVERITY_BORDER: Record<Finding["severity"], string> = {
  problem: "border-error",
  warning: "border-warning",
  note: "border-line-strong",
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
    <ul className="flex flex-col gap-3">
      {sorted.map((finding) => (
        <li
          key={finding.id}
          className={`rounded-md border-l-4 bg-surface p-3 text-sm ${SEVERITY_BORDER[finding.severity]}`}
        >
          <p className="text-ink">
            <MessageWithCourseLinks message={finding.message[locale]} locale={locale} />
          </p>
          <p className="mt-1 text-xs text-muted">{finding.source.provision}</p>
        </li>
      ))}
    </ul>
  );
}
