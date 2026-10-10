/**
 * What the plan screen says after a course page's "Add to plan" link: a
 * confirmation naming the course and the term, with an undo, or the reason
 * nothing was changed.
 *
 * Both are ordinary server-rendered markup, so they appear with JavaScript
 * off, and the undo is a plain link to the plan screen carrying the plan as it
 * arrived. A refusal is a warning, not an error: nothing has gone wrong that
 * the student did, a link was simply stale or did not fit this plan.
 */
import Link from "next/link";
import Notice from "@/components/Notice";
import type { PlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { formatTermRef } from "@/components/study-plan/studyPlanCopy";
import type { CurriculumVersion } from "@/content/curriculum";
import type { AddResult } from "@/lib/study-plan/addToPlan";

export type AddOutcomeNoticeProps = {
  outcome: AddResult;
  linkCopy: PlanLinkCopy;
  version: CurriculumVersion;
  /** The plan screen with the plan exactly as it arrived, and no `add`. */
  undoHref: string;
};

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

export default function AddOutcomeNotice({
  outcome,
  linkCopy,
  version,
  undoHref,
}: AddOutcomeNoticeProps) {
  const termLabel = outcome.term ? formatTermRef(linkCopy.terms, outcome.term) : "";

  if (outcome.status === "refused") {
    return (
      <Notice variant="warning" title={linkCopy.add.refusedTitle}>
        <p>
          {fill(linkCopy.add.reasons[outcome.reason], {
            code: outcome.code || linkCopy.add.noCode,
            term: termLabel,
          })}
        </p>
        <p className="mt-1">{linkCopy.add.unchanged}</p>
      </Notice>
    );
  }

  const title = version.courses.value.find((c) => c.code === outcome.code)?.title ?? "";
  return (
    <Notice variant="success" title={linkCopy.add.addedTitle}>
      <p>{fill(linkCopy.add.addedBody, { code: outcome.code, title, term: termLabel })}</p>
      {outcome.requestedCode ? (
        <p className="mt-1">
          {fill(linkCopy.add.substituted, {
            requested: outcome.requestedCode,
            code: outcome.code,
          })}
        </p>
      ) : null}
      <p className="mt-2">
        <Link href={undoHref} className="font-semibold text-brand-deep underline">
          {linkCopy.add.undoLabel}
          <span className="sr-only"> {outcome.code}</span>
        </Link>
      </p>
    </Notice>
  );
}
