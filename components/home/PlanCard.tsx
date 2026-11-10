"use client";

import Link from "next/link";
import clsx from "clsx";
import Icon from "@/components/icons/Icon";
import { useStoredPlan } from "@/components/study-plan/useStoredPlan";
import { planCardCopy, type PlanCardCopy } from "@/components/home/planCardCopy";
import { CURRICULUM_VERSIONS, type TermRef } from "@/content/curriculum";
import { localeHref, type Locale } from "@/lib/i18n";
import { PLAN_FIELD, type StudyPlan } from "@/lib/study-plan/plan";
import { remainingRequirements, termIndex } from "@/lib/study-plan/derive";
import { checkPlan, type Finding } from "@/lib/study-plan/findings";

const SEVERITY_ORDER: Record<Finding["severity"], number> = { problem: 0, warning: 1, note: 2 };
const RING_RADIUS = 28;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const linkClass =
  "inline-flex min-h-11 items-center gap-2 font-medium text-brand-deep underline underline-offset-4";

type Progress = { done: number; total: number | null };

function creditsProgress(plan: StudyPlan): Progress | null {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  if (!version) return null;
  const shortfalls = remainingRequirements(
    version,
    plan.passed,
    plan.minorId,
    plan.freeElectiveCreditsPassed
  );
  const done = shortfalls.reduce((sum, s) => sum + Math.min(s.earned, s.category.credits), 0);
  const total = version.graduationCredits.value;
  const reliable = Number.isFinite(total) && total > 0 && done <= total;
  return { done, total: reliable ? total : null };
}

function topFinding(plan: StudyPlan): Finding | null {
  const version = CURRICULUM_VERSIONS[plan.versionId];
  if (!version) return null;
  const findings = checkPlan(version, plan);
  const ranked = findings
    .map((finding, position) => ({ finding, position }))
    .sort((a, b) => {
      const bySeverity = SEVERITY_ORDER[a.finding.severity] - SEVERITY_ORDER[b.finding.severity];
      if (bySeverity !== 0) return bySeverity;
      const aPrerequisite = a.finding.id.startsWith("prerequisite:") ? 0 : 1;
      const bPrerequisite = b.finding.id.startsWith("prerequisite:") ? 0 : 1;
      return aPrerequisite - bPrerequisite || a.position - b.position;
    });
  return ranked[0]?.finding ?? null;
}

function firstSentence(text: string, locale: Locale): string {
  if (locale === "th") return text;
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

function termName(term: TermRef, copy: PlanCardCopy): string {
  const kind =
    term.kind === "summer"
      ? copy.summer
      : copy.semester.replace("{n}", term.kind === "semester1" ? "1" : "2");
  return copy.yearTerm.replace("{year}", String(term.year)).replace("{term}", kind);
}

function nextTermLine(plan: StudyPlan, copy: PlanCardCopy): string | null {
  const next = [...plan.terms]
    .sort((a, b) => termIndex(a.term) - termIndex(b.term))
    .find((t) => t.codes.length > 0);
  if (!next) return null;
  return copy.nextTermCourses
    .replace("{count}", String(next.codes.length))
    .replace("{term}", termName(next.term, copy));
}

function Ring({ done, total }: { done: number; total: number }) {
  const fraction = Math.min(1, Math.max(0, done / total));
  return (
    <svg
      viewBox="0 0 72 72"
      className="size-16 shrink-0 -rotate-90"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="36"
        cy="36"
        r={RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-sunken"
      />
      <circle
        cx="36"
        cy="36"
        r={RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={RING_CIRCUMFERENCE * (1 - fraction)}
        className="text-forest"
      />
    </svg>
  );
}

export default function PlanCard({ locale, className }: { locale: Locale; className?: string }) {
  const stored = useStoredPlan();
  const copy = planCardCopy[locale];
  const shell = clsx("min-h-48 rounded-2xl border border-line bg-surface p-4 sm:p-5", className);
  const planPath = localeHref(locale, "/services/study-plan/plan");

  if (!stored) {
    return (
      <section aria-labelledby="home-plan-heading" className={shell}>
        <h2 id="home-plan-heading" className="font-display text-xl">
          {copy.emptyHeading}
        </h2>
        <p className="mt-2 text-muted">{copy.emptyBody}</p>
        <Link href={localeHref(locale, "/services/study-plan")} className={clsx(linkClass, "mt-3")}>
          {copy.emptyLink}
          <Icon name="arrow" className="size-4" />
        </Link>
      </section>
    );
  }

  const { plan, serialised } = stored;
  const planHref = `${planPath}?${PLAN_FIELD}=${encodeURIComponent(serialised)}`;
  const progress = creditsProgress(plan);
  const finding = topFinding(plan);
  const termLine = nextTermLine(plan, copy);
  const creditsText = progress
    ? (progress.total === null ? copy.creditsOnly : copy.creditsDone)
        .replace("{done}", String(progress.done))
        .replace("{total}", String(progress.total ?? ""))
    : null;

  return (
    <section aria-labelledby="home-plan-heading" className={shell}>
      <h2 id="home-plan-heading" className="font-display text-xl">
        {copy.heading}
      </h2>
      <div className="mt-3 flex items-center gap-4">
        {progress && progress.total !== null ? (
          <Ring done={progress.done} total={progress.total} />
        ) : null}
        <div>
          {creditsText ? <p className="font-medium">{creditsText}</p> : null}
          {termLine ? <p className="text-muted">{termLine}</p> : null}
        </div>
      </div>
      {finding ? (
        <div className="mt-4 rounded-xl bg-warning-tint p-3 text-warning">
          <div className="flex gap-2">
            <Icon name="alert" className="mt-0.5 size-5 shrink-0" />
            <p>{firstSentence(finding.message[locale], locale)}</p>
          </div>
          <Link href={planHref} className={clsx(linkClass, "mt-1")}>
            {finding.id.startsWith("prerequisite:") ? copy.fixPrerequisite : copy.reviewFinding}
            <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      ) : (
        <Link href={planHref} className={clsx(linkClass, "mt-3")}>
          {copy.continuePlan}
          <Icon name="arrow" className="size-4" />
        </Link>
      )}
      <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-muted">
        <Icon name="lock" className="size-4 shrink-0" />
        <span>{copy.savedOnDevice}</span>
        <Link
          href={planHref}
          className="inline-flex min-h-11 items-center underline underline-offset-4"
        >
          {copy.clearPlan}
        </Link>
      </p>
    </section>
  );
}
