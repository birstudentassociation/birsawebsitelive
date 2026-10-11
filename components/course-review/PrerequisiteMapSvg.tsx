/**
 * The prerequisite map as an inline SVG, drawn from a layout computed by
 * `buildPrerequisiteMap` (lib/courses/prerequisiteMap.ts).
 *
 * Shared by the server-rendered map, coloured by track, and the client map for
 * a visitor with a stored plan, coloured by status, so the two are drawn
 * identically and differ only in the `tone` each passes. It has no state and
 * no hooks, so it renders on the server and in the browser alike.
 *
 * Colour is never the only cue. Each tone also sets a border style (solid,
 * dashed or dotted) and may set a short glyph, and every node's `<title>` gives
 * its code and what the colour means in words. The drawing is a picture of
 * information the page also holds as lists (see `PrerequisiteMap.tsx`), so the
 * SVG is exposed as one labelled image and its links are left out of the tab
 * order: a keyboard or screen reader user follows the lists instead, where the
 * links are real and in reading order.
 *
 * Colours come from the site's design tokens through Tailwind's fill and
 * stroke utilities, so they follow the light and dark themes.
 */
import Link from "next/link";
import {
  MAP_GEOMETRY,
  type MapNode,
  type PrerequisiteMapLayout,
} from "@/lib/courses/prerequisiteMap";

/** How one node looks and what it is called. */
export type MapTone = {
  /** Tailwind fill and stroke utilities for the node's box. */
  box: string;
  /** Border style, so colour is not the only difference between two tones. */
  dash?: "dashed" | "dotted";
  /** A short mark before the code, such as a tick. */
  glyph?: string;
  /** Words for the node's title, for example the track or the status. */
  description: string;
};

export type PrerequisiteMapSvgProps = {
  layout: PrerequisiteMapLayout;
  label: string;
  toneFor: (node: MapNode) => MapTone;
  hrefFor: (code: string) => string;
};

const DASH = { dashed: "5 3", dotted: "1.5 3" } as const;

/** A smooth left-to-right curve between two points at the same horizontal rhythm. */
function edgePath(x1: number, y1: number, x2: number, y2: number): string {
  const middle = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2 - 3} ${y2}`;
}

export default function PrerequisiteMapSvg({
  layout,
  label,
  toneFor,
  hrefFor,
}: PrerequisiteMapSvgProps) {
  const { nodeWidth, nodeHeight } = MAP_GEOMETRY;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={layout.width}
      height={layout.height}
      className="block max-w-none text-line-strong"
    >
      <defs>
        <marker
          id="prerequisite-map-arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
        </marker>
      </defs>
      {layout.edges.map((edge) => (
        <path
          key={`${edge.from}-${edge.to}`}
          d={edgePath(edge.x1, edge.y1, edge.x2, edge.y2)}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          markerEnd="url(#prerequisite-map-arrow)"
        />
      ))}
      {layout.nodes.map((node) => {
        const tone = toneFor(node);
        return (
          <Link key={node.code} href={hrefFor(node.code)} tabIndex={-1}>
            <title>{`${node.code} ${node.title}. ${tone.description}`}</title>
            <rect
              x={node.x}
              y={node.y}
              width={nodeWidth}
              height={nodeHeight}
              rx={7}
              strokeWidth={1.5}
              strokeDasharray={tone.dash ? DASH[tone.dash] : undefined}
              className={tone.box}
            />
            <text
              x={node.x + nodeWidth / 2}
              y={node.y + nodeHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fontWeight={600}
              className="fill-ink"
            >
              {tone.glyph ? `${tone.glyph} ${node.code}` : node.code}
            </text>
          </Link>
        );
      })}
    </svg>
  );
}
