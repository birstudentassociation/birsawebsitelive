"use client";

/**
 * The content of the "Your plan" panel, loaded by `YourPlanPanel` once a
 * stored plan has been found. All the reasoning is in
 * `lib/course-review/planPanel.ts`; this renders it.
 *
 * Reports facts about the plan and never judges it: a prerequisite that is not
 * met is said to be not met, and "Add to your plan" is still offered, because
 * findings never block (see `lib/study-plan/findings.ts`). Nothing here scores
 * or ranks the course.
 */
import { useState } from "react";
import Link from "next/link";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import type { TermRef } from "@/content/curriculum";
import type { PlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { categoryLabel, formatTermRef } from "@/components/study-plan/studyPlanCopy";
import { buildTermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { derivePlanPanel, type PrerequisiteState } from "@/lib/course-review/planPanel";
import { ADD_PARAM } from "@/lib/study-plan/addToPlan";
import { termKey } from "@/lib/study-plan/derive";
import { PLAN_FIELD, type StudyPlan } from "@/lib/study-plan/plan";
import { whatIf } from "@/lib/study-plan/whatIf";
import { whatIfSentences } from "@/lib/study-plan/whatIfText";

export type YourPlanPanelBodyProps = {
  code: string;
  locale: "en" | "th";
  copy: PlanLinkCopy;
  planHref: string;
  courseLinkBase: string;
  plan: StudyPlan;
  /** The plan re-serialised from the validated plan, ready for a link. */
  serialisedPlan: string;
};

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.75rem_1fr] gap-x-3 px-3 py-2 sm:grid-cols-[14rem_1fr] sm:gap-x-6 sm:px-4 sm:py-2.5">
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="min-w-0 text-muted">{children}</dd>
    </div>
  );
}

export default function YourPlanPanelBody({
  code,
  locale,
  copy,
  planHref,
  courseLinkBase,
  plan,
  serialisedPlan,
}: YourPlanPanelBodyProps) {
  // The clock is read once, on first render, so the panel does not shift
  // under the reader if they leave the tab open across a term boundary.
  const [now] = useState(() => new Date());
  const view = derivePlanPanel(code, plan, now);
  const version = CURRICULUM_VERSIONS[view.versionId];
  const minorName = version.minors.find((m) => m.id === plan.minorId)?.name[locale] ?? "";
  const termText = (term: TermRef) => formatTermRef(copy.terms, term);
  const courseLink = (target: string) => (
    <Link
      href={`${courseLinkBase}/${target}`}
      className="inline-block rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-semibold text-brand-deep hover:text-brand-dark"
    >
      {target}
    </Link>
  );

  // What moving a planned course one term later does, in the student's own
  // curriculum: the same calculation as the plan screen's "If I move this
  // later", so the two cannot disagree.
  const insight = buildTermInsightCopy(locale);
  const deferral =
    view.versionCode && view.status.kind === "planned"
      ? whatIfSentences(
          whatIf(version, plan, { kind: "deferCourse", code: view.versionCode }),
          insight.whatIf,
          termText
        )
      : [];

  const planLink = (extra: string) =>
    `${planHref}?${PLAN_FIELD}=${encodeURIComponent(serialisedPlan)}${extra}`;
  const addHref =
    view.versionCode && view.suggestedTerm
      ? // No fragment: landing on the confirmation at the top matters more
        // than scrolling to the term, which the plan screen opens anyway.
        planLink(`&${ADD_PARAM}=${view.versionCode}&term=${termKey(view.suggestedTerm)}`)
      : null;

  const prerequisiteText = (state: PrerequisiteState): string => {
    switch (state.state) {
      case "passed":
        return copy.panel.prerequisitePassed;
      case "plannedEarlier":
        return fill(copy.panel.prerequisitePlannedEarlier, { term: termText(state.term) });
      case "plannedLater":
        return fill(copy.panel.prerequisitePlannedLater, { term: termText(state.term) });
      case "notMet":
        return copy.panel.prerequisiteNotMet;
    }
  };

  let statusText: string;
  if (view.status.kind === "passed") statusText = copy.panel.passed;
  else if (view.status.kind === "planned") {
    statusText = fill(copy.panel.plannedTemplate, { term: termText(view.status.term) });
  } else statusText = copy.panel.notInPlan;

  let counts: string;
  if (view.counts && !view.counts.excludedFromTotal) {
    const categoryName = version.categories.find((c) => c.id === view.counts!.bucket)?.name[locale];
    counts = categoryLabel(
      copy.categoryTemplates,
      view.counts.bucket,
      categoryName ?? view.counts.bucket,
      minorName
    );
  } else {
    counts = copy.panel.countsNothing;
  }

  return (
    <section aria-labelledby="your-plan-heading" className="flex flex-col gap-2 sm:gap-3">
      <h2 id="your-plan-heading" className="font-display text-lg sm:text-xl">
        {copy.panel.heading}
      </h2>
      <p className="text-sm text-muted">{copy.panel.note}</p>

      {view.versionCode === null ? (
        <p className="rounded-lg border border-line bg-surface p-3 text-sm text-ink sm:p-4">
          {fill(copy.panel.notInYourCurriculum, { curriculum: version.label[locale] })}
        </p>
      ) : (
        <dl className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface text-sm">
          {view.versionCode !== code ? (
            <Row label={fill(copy.panel.counterpartLabel, { curriculum: version.label[locale] })}>
              {courseLink(view.versionCode)}
            </Row>
          ) : null}
          <Row label={copy.panel.statusLabel}>{statusText}</Row>
          <Row label={copy.panel.countsLabel}>{counts}</Row>
          <Row label={copy.panel.prerequisitesLabel}>
            {view.prerequisites.length === 0 ? (
              copy.panel.noPrerequisites
            ) : (
              <>
                <ul className="flex flex-col gap-1">
                  {view.prerequisites.map((state) => (
                    <li key={state.code} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {courseLink(state.code)}
                      <span>{prerequisiteText(state)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1">
                  {view.prerequisitesMet
                    ? copy.panel.prerequisitesMet
                    : copy.panel.prerequisitesNotMet}
                </p>
              </>
            )}
          </Row>
          {deferral.length > 0 ? (
            <Row label={insight.whatIf.panelLabel}>
              <ul className="flex flex-col gap-1">
                {deferral.map((sentence) => (
                  <li key={sentence}>{sentence}</li>
                ))}
              </ul>
            </Row>
          ) : null}
        </dl>
      )}

      {view.versionCode !== null ? (
        <div className="flex flex-col gap-1.5 text-sm">
          {view.status.kind === "none" ? (
            addHref ? (
              <>
                <Link
                  href={addHref}
                  className="inline-flex min-h-11 items-center self-start font-semibold text-brand-deep hover:text-brand-dark"
                >
                  {copy.panel.addLink} &rarr;
                </Link>
                {view.suggestedTerm ? (
                  <p className="text-muted">
                    {fill(copy.panel.suggestedTermTemplate, {
                      term: termText(view.suggestedTerm),
                    })}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-muted">{copy.panel.noSuggestedTerm}</p>
            )
          ) : null}
          <Link
            href={planLink("")}
            className="inline-flex min-h-11 items-center self-start font-semibold text-brand-deep hover:text-brand-dark"
          >
            {copy.panel.openPlan} &rarr;
          </Link>
        </div>
      ) : null}
    </section>
  );
}
