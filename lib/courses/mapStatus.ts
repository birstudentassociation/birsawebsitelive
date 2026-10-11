/**
 * Where each course on the prerequisite map stands for a student with a stored
 * plan: passed, planned, available next term, or locked.
 *
 * Built on `buildPlanContext`, so the map agrees with the catalogue's "with my
 * plan" filters and the course page's panel about what is passed, planned and
 * ready. The map draws the current curriculum's codes; a student on another
 * curriculum is matched through the graph's counterparts, and a course their
 * curriculum has no counterpart for is reported as such rather than as locked.
 *
 * Pure, with the clock passed in. The browser loads this only for a visitor who
 * has a plan.
 */
import { counterparts } from "@/lib/courses/graph";
import { buildPlanContext } from "@/lib/course-review/planContext";
import type { StudyPlan } from "@/lib/study-plan/plan";

export type MapStatus = "passed" | "planned" | "available" | "locked" | "notInCurriculum";

export function mapStatuses(
  plan: StudyPlan,
  codes: readonly string[],
  now: Date
): Record<string, MapStatus> {
  const context = buildPlanContext(plan, now);
  const statuses: Record<string, MapStatus> = {};
  for (const code of codes) {
    if (counterparts(code, plan.versionId).length === 0) {
      statuses[code] = "notInCurriculum";
      continue;
    }
    const status = context.status(code);
    if (status.kind === "passed") statuses[code] = "passed";
    else if (status.kind === "planned") statuses[code] = "planned";
    else statuses[code] = context.matcher.ready(code) ? "available" : "locked";
  }
  return statuses;
}
