"use client";

/**
 * "Continue your plan": the half of the persistence promise that was missing.
 * `PlanStore` has always saved the plan to this device, but nothing read it
 * back, so a student returning after closing the tab was sent through the
 * whole journey again.
 *
 * This is an enhancement only. With JavaScript off, or with no saved plan, or
 * with a saved value that does not pass `deserialisePlan`, it renders nothing
 * and the start page is exactly what it was. The link it offers goes to the
 * ordinary plan screen carrying the plan in the `plan` query parameter, like
 * every step of the journey, so no new server behaviour is involved.
 */
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import { useStoredPlan } from "@/components/study-plan/useStoredPlan";
import type { PlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { PLAN_FIELD } from "@/lib/study-plan/plan";

export type ContinuePlanProps = {
  copy: PlanLinkCopy["resume"];
  /** The localised plan screen path, e.g. "/en/services/study-plan/plan". */
  planHref: string;
};

export default function ContinuePlan({ copy, planHref }: ContinuePlanProps) {
  const stored = useStoredPlan();
  if (!stored) return null;

  return (
    <Notice variant="info" title={copy.heading}>
      <p>{copy.body.replace("{cohort}", stored.plan.cohort)}</p>
      <p className="mt-1 text-muted">{copy.detail}</p>
      <div className="mt-3">
        <Button href={`${planHref}?${PLAN_FIELD}=${encodeURIComponent(stored.serialised)}`}>
          {copy.button}
        </Button>
      </div>
    </Notice>
  );
}
