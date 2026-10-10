"use client";

/**
 * The "Your plan" panel on a course page: an enhancement that appears only
 * for a visitor with JavaScript and a study plan saved on this device.
 *
 * The server renders nothing for it, so a course page's HTML is the same for
 * everyone and stays statically generated; with no plan, an invalid plan or
 * JavaScript off, this component renders nothing and the page is exactly what
 * it was. The body is loaded lazily, and only once a plan is found, because it
 * needs the whole course graph to answer questions in the student's own
 * curriculum version, which visitors without a plan should not download.
 */
import dynamic from "next/dynamic";
import type { PlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { useStoredPlan } from "@/components/study-plan/useStoredPlan";

const YourPlanPanelBody = dynamic(() => import("@/components/course-review/YourPlanPanelBody"), {
  ssr: false,
});

export type YourPlanPanelProps = {
  /** The course page's code, which may belong to a different curriculum from the student's. */
  code: string;
  locale: "en" | "th";
  copy: PlanLinkCopy;
  /** The localised plan screen path, e.g. "/en/services/study-plan/plan". */
  planHref: string;
  /** The localised course page path without the code, e.g. "/en/student-life/course-reviews". */
  courseLinkBase: string;
};

export default function YourPlanPanel(props: YourPlanPanelProps) {
  const stored = useStoredPlan();
  if (!stored) return null;
  return <YourPlanPanelBody {...props} plan={stored.plan} serialisedPlan={stored.serialised} />;
}
