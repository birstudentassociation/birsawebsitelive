/**
 * The layout of the prerequisite map on the catalogue page: which courses are
 * nodes, which column each sits in, and where every node and edge is drawn.
 *
 * The layout is deterministic and needs no drawing library. A course's column
 * is the length of its longest chain of prerequisites (no prerequisites is
 * column 0, PI280 after PI271 is column 1), and within a column courses are
 * ordered by track and then code, so the same curriculum always produces the
 * same picture. Columns are centred on one another vertically. Only courses
 * that take part in a prerequisite relationship are drawn; the rest of the
 * curriculum has no edges to show.
 *
 * The map is never the only way to read the graph. `mapLists` returns the same
 * information as a nested list ("PI271 unlocks PI280 and PI390"), which the
 * page renders beside the drawing for screen readers and for anyone without
 * JavaScript or who cannot see colour.
 *
 * Pure functions over the course graph, with no React.
 */
import type { CourseTrack } from "@/content/course-review/types";
import type { CurriculumVersionId } from "@/content/curriculum";
import { codesIn, courseNode, prerequisites, unlocks } from "@/lib/courses/graph";

/** A track for a node, or "other" for a course the review catalogue does not hold. */
export type MapTrack = CourseTrack | "other";

/** The order tracks are stacked within a column. */
const TRACK_ORDER: readonly MapTrack[] = [
  "foundational",
  "international-relations",
  "governance-transnational",
  "public-admin-policy",
  "global-political-economy",
  "other",
];

/** Sizes in SVG user units. A node is wide enough for the longest course code at the map's text size. */
export const MAP_GEOMETRY = {
  nodeWidth: 76,
  nodeHeight: 30,
  columnGap: 92,
  rowGap: 10,
  padding: 12,
} as const;

export type MapNode = {
  code: string;
  title: string;
  track: MapTrack;
  /** Column, 0 for a course with no prerequisites. */
  layer: number;
  x: number;
  y: number;
  prerequisites: string[];
  unlocks: string[];
};

export type MapEdge = {
  from: string;
  to: string;
  /** Right-middle of the prerequisite to left-middle of the course it unlocks. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type PrerequisiteMapLayout = {
  versionId: CurriculumVersionId;
  nodes: MapNode[];
  edges: MapEdge[];
  layers: number;
  width: number;
  height: number;
  /** The tracks that appear, in legend order. */
  tracks: MapTrack[];
};

/** Longest chain of prerequisites above each code, in a version. */
function depths(versionId: CurriculumVersionId, codes: readonly string[]): Map<string, number> {
  const memo = new Map<string, number>();
  const depth = (code: string, path: Set<string>): number => {
    const known = memo.get(code);
    if (known !== undefined) return known;
    let best = 0;
    for (const prerequisite of prerequisites(code, versionId)) {
      // A cycle cannot occur in a real curriculum (a test asserts it), but bad
      // data must not hang the build.
      if (path.has(prerequisite)) continue;
      best = Math.max(best, 1 + depth(prerequisite, new Set(path).add(prerequisite)));
    }
    memo.set(code, best);
    return best;
  };
  for (const code of codes) depth(code, new Set([code]));
  return memo;
}

export function buildPrerequisiteMap(versionId: CurriculumVersionId): PrerequisiteMapLayout {
  const { nodeWidth, nodeHeight, columnGap, rowGap, padding } = MAP_GEOMETRY;
  const codes = codesIn(versionId).filter(
    (code) => prerequisites(code, versionId).length > 0 || unlocks(code, versionId).length > 0
  );
  const layerOf = depths(versionId, codes);
  const trackOf = (code: string): MapTrack => courseNode(code)?.catalogue?.track ?? "other";

  const columns = new Map<number, string[]>();
  for (const code of codes) {
    const layer = layerOf.get(code) ?? 0;
    columns.set(layer, [...(columns.get(layer) ?? []), code]);
  }
  for (const column of columns.values()) {
    column.sort(
      (a, b) =>
        TRACK_ORDER.indexOf(trackOf(a)) - TRACK_ORDER.indexOf(trackOf(b)) || a.localeCompare(b)
    );
  }

  const layers = columns.size === 0 ? 0 : Math.max(...columns.keys()) + 1;
  const rowHeight = nodeHeight + rowGap;
  const tallest = Math.max(0, ...[...columns.values()].map((column) => column.length));
  const innerHeight = tallest === 0 ? 0 : tallest * nodeHeight + (tallest - 1) * rowGap;

  const nodes: MapNode[] = [];
  for (const [layer, column] of [...columns].sort((a, b) => a[0] - b[0])) {
    const columnHeight = column.length * nodeHeight + (column.length - 1) * rowGap;
    const top = padding + (innerHeight - columnHeight) / 2;
    column.forEach((code, row) => {
      nodes.push({
        code,
        title: courseNode(code)?.title ?? code,
        track: trackOf(code),
        layer,
        x: padding + layer * (nodeWidth + columnGap),
        y: top + row * rowHeight,
        prerequisites: prerequisites(code, versionId),
        unlocks: unlocks(code, versionId),
      });
    });
  }

  const byCode = new Map(nodes.map((node) => [node.code, node]));
  const edges: MapEdge[] = [];
  for (const node of nodes) {
    for (const target of node.unlocks) {
      const to = byCode.get(target);
      if (!to) continue;
      edges.push({
        from: node.code,
        to: target,
        x1: node.x + nodeWidth,
        y1: node.y + nodeHeight / 2,
        x2: to.x,
        y2: to.y + nodeHeight / 2,
      });
    }
  }

  return {
    versionId,
    nodes,
    edges,
    layers,
    width: layers === 0 ? 0 : padding * 2 + layers * nodeWidth + (layers - 1) * columnGap,
    height: padding * 2 + innerHeight,
    tracks: TRACK_ORDER.filter((track) => nodes.some((node) => node.track === track)),
  };
}

export type MapListItem = {
  code: string;
  title: string;
  unlocks: { code: string; title: string }[];
};

/**
 * The map as lists: each course that unlocks something, with what it unlocks,
 * in column order. Every edge in the drawing appears here once.
 */
export function mapLists(layout: PrerequisiteMapLayout): MapListItem[] {
  const titles = new Map(layout.nodes.map((node) => [node.code, node.title]));
  return layout.nodes
    .filter((node) => node.unlocks.length > 0)
    .map((node) => ({
      code: node.code,
      title: node.title,
      unlocks: node.unlocks.map((code) => ({ code, title: titles.get(code) ?? code })),
    }));
}
