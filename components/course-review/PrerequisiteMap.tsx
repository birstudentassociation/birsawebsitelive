/**
 * The prerequisite map on the catalogue page: a drawing of which courses need
 * which, and the same information as nested lists.
 *
 * Server-rendered and collapsed behind a disclosure, because the drawing is
 * wide. Opened, it is coloured by track, and a visitor with a stored plan sees
 * it coloured by status instead (`PlanAwareMap`). The drawing is deterministic
 * (lib/courses/prerequisiteMap.ts) and has no dependency beyond React.
 *
 * The lists are the accessible form of the map and are always rendered, not
 * only without JavaScript: "PI271 unlocks PI280 and PI390" is as much the map
 * as the picture is, and it is what a screen reader, a printout or a reader who
 * cannot tell colours apart gets. Every course in it links to its page.
 */
import Link from "next/link";
import PlanAwareMap from "@/components/course-review/PlanAwareMap";
import PrerequisiteMapSvg from "@/components/course-review/PrerequisiteMapSvg";
import { MapLegend, MapScroller } from "@/components/course-review/PrerequisiteMapParts";
import { TRACK_TONES } from "@/components/course-review/mapTones";
import type { TermInsightCopy } from "@/components/study-plan/termInsightCopy";
import type { CourseTrack } from "@/content/course-review/types";
import { buildPrerequisiteMap, mapLists } from "@/lib/courses/prerequisiteMap";
import { CURRENT_VERSION } from "@/lib/courses/graph";

export type PrerequisiteMapProps = {
  copy: TermInsightCopy["map"];
  /** Track names in the page's language. */
  trackLabels: Record<CourseTrack, string>;
  /** The localised course page path without the code, e.g. "/en/student-life/course-reviews". */
  courseLinkBase: string;
};

export default function PrerequisiteMap({
  copy,
  trackLabels,
  courseLinkBase,
}: PrerequisiteMapProps) {
  const layout = buildPrerequisiteMap(CURRENT_VERSION);
  const lists = mapLists(layout);
  const trackName = (track: (typeof layout.tracks)[number]) =>
    track === "other" ? copy.otherTrack : trackLabels[track];
  const hrefFor = (code: string) => `${courseLinkBase}/${code}`;

  return (
    <details className="group rounded-lg border border-line">
      <summary className="focus-halo flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-4 marker:content-none sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className="font-display text-lg text-ink">{copy.summary}</span>
        <span
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform group-open:rotate-180"
        >
          &darr;
        </span>
      </summary>
      <div className="flex flex-col gap-5 border-t border-line p-4 sm:p-5">
        <p className="max-w-[var(--measure)] text-sm leading-relaxed text-muted">{copy.intro}</p>

        <PlanAwareMap layout={layout} copy={copy} courseLinkBase={courseLinkBase}>
          <div className="flex flex-col gap-3">
            <MapLegend
              title={copy.legendTrack}
              items={layout.tracks.map((track) => ({
                key: track,
                label: trackName(track),
                tone: TRACK_TONES[track],
              }))}
            />
            <MapScroller label={copy.summary} hint={copy.scrollHint}>
              <PrerequisiteMapSvg
                layout={layout}
                label={copy.drawingLabel}
                hrefFor={hrefFor}
                toneFor={(node) => ({
                  ...TRACK_TONES[node.track],
                  description: trackName(node.track),
                })}
              />
            </MapScroller>
          </div>
        </PlanAwareMap>

        <section aria-labelledby="prerequisite-map-lists" className="flex flex-col gap-2">
          <h3 id="prerequisite-map-lists" className="font-display text-base">
            {copy.listsHeading}
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {lists.map((item) => (
              <li key={item.code} className="flex flex-col gap-1">
                <span className="text-ink">
                  <Link
                    href={hrefFor(item.code)}
                    className="font-semibold text-brand-deep underline underline-offset-2 hover:text-brand-dark"
                  >
                    {item.code}
                  </Link>{" "}
                  {copy.unlocksTemplate.replace("{title}", item.title)}
                </span>
                <ul className="flex flex-col gap-0.5 pl-5">
                  {item.unlocks.map((target) => (
                    <li key={target.code} className="list-disc text-muted">
                      <Link
                        href={hrefFor(target.code)}
                        className="font-semibold text-brand-deep underline underline-offset-2 hover:text-brand-dark"
                      >
                        {target.code}
                      </Link>{" "}
                      {target.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </details>
  );
}
