"use client";

/**
 * The rows `ComparePlanRows` shows once a stored plan has been found: for each
 * of the two courses, where it sits in the plan, what it counts towards for
 * this student, and whether the plan covers its prerequisites. All the
 * reasoning is in `lib/course-review/planPanel.ts`, the same derivation the
 * course page's panel uses, so the two cannot disagree.
 *
 * Reports facts about the plan and never judges it, and never says which of
 * the two courses is the better fit: both columns are answered the same way.
 */
import { useState } from "react";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { TermRef } from "@/content/curriculum";
import type { PlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { categoryLabel, formatTermRef } from "@/components/study-plan/studyPlanCopy";
import type { TermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { derivePlanPanel, type PlanPanelView } from "@/lib/course-review/planPanel";
import type { StudyPlan } from "@/lib/study-plan/plan";

export type ComparePlanRowsBodyProps = {
  codes: [string, string];
  locale: "en" | "th";
  copy: PlanLinkCopy;
  compareCopy: TermInsightCopy["courseCompare"];
  plan: StudyPlan;
};

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

export default function ComparePlanRowsBody({
  codes,
  locale,
  copy,
  compareCopy,
  plan,
}: ComparePlanRowsBodyProps) {
  // The clock is read once, so the rows do not shift under the reader.
  const [now] = useState(() => new Date());
  const views = codes.map((code) => derivePlanPanel(code, plan, now));
  const version = CURRICULUM_VERSIONS[plan.versionId];
  const minorName = version.minors.find((m) => m.id === plan.minorId)?.name[locale] ?? "";
  const termText = (term: TermRef) => formatTermRef(copy.terms, term);

  const inCurriculum = (view: PlanPanelView, text: (view: PlanPanelView) => string) =>
    view.versionCode === null
      ? fill(copy.panel.notInYourCurriculum, { curriculum: version.label[locale] })
      : text(view);

  const status = (view: PlanPanelView) =>
    view.status.kind === "passed"
      ? copy.panel.passed
      : view.status.kind === "planned"
        ? fill(copy.panel.plannedTemplate, { term: termText(view.status.term) })
        : copy.panel.notInPlan;

  const counts = (view: PlanPanelView) => {
    if (!view.counts || view.counts.excludedFromTotal) return copy.panel.countsNothing;
    const bucket = view.counts.bucket;
    const name = version.categories.find((c) => c.id === bucket)?.name[locale];
    return categoryLabel(copy.categoryTemplates, bucket, name ?? bucket, minorName);
  };

  const prerequisites = (view: PlanPanelView) =>
    view.prerequisites.length === 0
      ? copy.panel.noPrerequisites
      : view.prerequisitesMet
        ? copy.panel.prerequisitesMet
        : copy.panel.prerequisitesNotMet;

  const rows: [string, (view: PlanPanelView) => string][] = [
    [copy.panel.statusLabel, status],
    [copy.panel.countsLabel, counts],
    [copy.panel.prerequisitesLabel, prerequisites],
  ];

  return (
    <tbody>
      <tr>
        <th scope="colgroup" colSpan={3} className="bg-sunken px-3 py-2 text-left sm:px-4">
          <span className="font-display text-base text-ink">{compareCopy.forYourPlan}</span>
          <span className="mt-0.5 block text-xs font-normal text-muted">
            {compareCopy.forYourPlanNote}
          </span>
        </th>
      </tr>
      {rows.map(([label, text]) => (
        <tr key={label} className="border-t border-line align-top">
          <th scope="row" className="px-3 py-2 text-left font-semibold text-ink sm:px-4">
            {label}
          </th>
          {views.map((view, index) => (
            <td key={codes[index]} className="px-3 py-2 text-muted sm:px-4">
              {inCurriculum(view, text)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
