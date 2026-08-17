/**
 * Renders the output of `checkPlan`: every finding, sorted problem before
 * warning before note, each with its citation in smaller muted text.
 *
 * Findings never block anything on the plan screen (see `lib/study-plan/
 * findings.ts`'s header comment); this component only presents them, in an
 * order that puts what most needs attention first.
 */
import type { Locale } from "@/lib/i18n";
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
          <p className="text-ink">{finding.message[locale]}</p>
          <p className="mt-1 text-xs text-muted">{finding.source.provision}</p>
        </li>
      ))}
    </ul>
  );
}
