"use client";

/**
 * Chooses between the two forms of the prerequisite map on the catalogue page.
 *
 * With no stored plan, with an invalid one, with JavaScript off, and on the
 * server and the first client render, it shows `children`: the map coloured by
 * track, already rendered by the server. Only when a valid plan is found does
 * it swap in the status-coloured map, loaded lazily. So the page's HTML is the
 * same for everyone and nothing can mismatch on hydration. The lists that carry
 * the same information in words are rendered by the server outside this
 * component and stay on screen either way.
 */
import dynamic from "next/dynamic";
import type { PlanAwareMapBodyProps } from "@/components/course-review/PlanAwareMapBody";
import { useStoredPlan } from "@/components/study-plan/useStoredPlan";

const PlanAwareMapBody = dynamic(() => import("@/components/course-review/PlanAwareMapBody"), {
  ssr: false,
});

export default function PlanAwareMap({
  children,
  ...props
}: Omit<PlanAwareMapBodyProps, "plan"> & { children: React.ReactNode }) {
  const stored = useStoredPlan();
  if (!stored) return <>{children}</>;
  return <PlanAwareMapBody {...props} plan={stored.plan} />;
}
