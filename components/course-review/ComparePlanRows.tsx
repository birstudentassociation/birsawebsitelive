"use client";

/**
 * The compare page's "For your plan" rows: an enhancement that appears only for
 * a visitor with JavaScript and a study plan saved on this device, in the same
 * way as the course page's "Your plan" panel (`YourPlanPanel`).
 *
 * The server renders nothing for it, so the page's HTML is the same for
 * everyone; with no plan, an invalid plan or JavaScript off, the page is the
 * generic comparison and nothing is missing from it. The body is loaded lazily
 * and only once a plan is found, because it needs the whole course graph to
 * answer in the student's own curriculum version.
 */
import dynamic from "next/dynamic";
import type { PlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { useStoredPlan } from "@/components/study-plan/useStoredPlan";
import type { TermInsightCopy } from "@/components/study-plan/termInsightCopy";

const ComparePlanRowsBody = dynamic(
  () => import("@/components/course-review/ComparePlanRowsBody"),
  { ssr: false }
);

export type ComparePlanRowsProps = {
  /** The two course codes, in the order the columns are in. */
  codes: [string, string];
  locale: "en" | "th";
  copy: PlanLinkCopy;
  compareCopy: TermInsightCopy["courseCompare"];
};

export default function ComparePlanRows(props: ComparePlanRowsProps) {
  const stored = useStoredPlan();
  if (!stored) return null;
  return <ComparePlanRowsBody {...props} plan={stored.plan} />;
}
