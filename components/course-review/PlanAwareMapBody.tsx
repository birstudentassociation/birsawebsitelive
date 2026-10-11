"use client";

/**
 * The prerequisite map for a visitor with a stored plan: the same drawing, with
 * each course coloured by where it stands (passed, in the plan, available next
 * term, locked), plus those statuses in words.
 *
 * Loaded lazily by `PlanAwareMap` once a plan is found, because working out the
 * statuses needs the course graph in the student's own curriculum version and
 * visitors without a plan should not download it. The statuses come from
 * `mapStatuses`, which is built on the same plan context as the catalogue's
 * "with my plan" filters, so the map and the filters cannot disagree.
 */
import { useState } from "react";
import PrerequisiteMapSvg from "@/components/course-review/PrerequisiteMapSvg";
import { MapLegend, MapScroller } from "@/components/course-review/PrerequisiteMapParts";
import { STATUS_TONES } from "@/components/course-review/mapTones";
import type { TermInsightCopy } from "@/components/study-plan/termInsightCopy";
import { mapStatuses, type MapStatus } from "@/lib/courses/mapStatus";
import type { PrerequisiteMapLayout } from "@/lib/courses/prerequisiteMap";
import type { StudyPlan } from "@/lib/study-plan/plan";

export type PlanAwareMapBodyProps = {
  layout: PrerequisiteMapLayout;
  copy: TermInsightCopy["map"];
  /** The localised course page path without the code. */
  courseLinkBase: string;
  plan: StudyPlan;
};

const STATUS_ORDER: MapStatus[] = ["passed", "planned", "available", "locked", "notInCurriculum"];

export default function PlanAwareMapBody({
  layout,
  copy,
  courseLinkBase,
  plan,
}: PlanAwareMapBodyProps) {
  // Read once on first render so the map does not shift if the tab is left
  // open across a term boundary.
  const [now] = useState(() => new Date());
  const codes = layout.nodes.map((node) => node.code);
  const statuses = mapStatuses(plan, codes, now);
  const present = STATUS_ORDER.filter((status) => codes.some((code) => statuses[code] === status));

  return (
    <div className="flex flex-col gap-3">
      <MapLegend
        title={copy.legendStatus}
        items={present.map((status) => ({
          key: status,
          label: copy.status[status],
          tone: STATUS_TONES[status],
        }))}
      />
      <MapScroller label={copy.summary} hint={copy.scrollHint}>
        <PrerequisiteMapSvg
          layout={layout}
          label={copy.drawingLabel}
          hrefFor={(code) => `${courseLinkBase}/${code}`}
          toneFor={(node) => {
            const status = statuses[node.code] ?? "locked";
            return {
              ...STATUS_TONES[status],
              description: copy.status[status],
            };
          }}
        />
      </MapScroller>
      <ul className="flex flex-col gap-1 text-sm text-muted">
        {present.map((status) => (
          <li key={status}>
            <span className="font-semibold text-ink">{copy.status[status]}</span>{" "}
            {codes.filter((code) => statuses[code] === status).join(", ")}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">{copy.statusNote}</p>
    </div>
  );
}
