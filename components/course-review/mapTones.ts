/**
 * How a node of the prerequisite map looks, by track and by status.
 *
 * Every class here is a design token through Tailwind's fill, stroke, background
 * and border utilities, so the map follows the light and dark themes with no
 * colour of its own. They are written out in full, not built from parts,
 * because Tailwind only generates a class it can find in the source. Each tone
 * pairs its colour with a border style (and statuses with a glyph) so that
 * colour is never the only way to tell two apart. `box` is for the SVG node,
 * `swatch` for the matching chip in the legend.
 */
import type { MapStatus } from "@/lib/courses/mapStatus";
import type { MapTrack } from "@/lib/courses/prerequisiteMap";

export type ToneStyle = {
  box: string;
  swatch: string;
  dash?: "dashed" | "dotted";
  glyph?: string;
};

export const TRACK_TONES: Record<MapTrack, ToneStyle> = {
  foundational: {
    box: "fill-sunken stroke-line-strong",
    swatch: "border-line-strong bg-sunken",
  },
  "international-relations": {
    box: "fill-forest-tint stroke-forest",
    swatch: "border-forest bg-forest-tint",
  },
  "governance-transnational": {
    box: "fill-brand-tint stroke-brand-deep",
    swatch: "border-brand-deep bg-brand-tint",
  },
  "public-admin-policy": {
    box: "fill-warning-tint stroke-warning",
    swatch: "border-warning bg-warning-tint",
  },
  "global-political-economy": {
    box: "fill-success-tint stroke-success",
    swatch: "border-success bg-success-tint",
    dash: "dashed",
  },
  other: {
    box: "fill-surface stroke-line-strong",
    swatch: "border-line-strong bg-surface",
    dash: "dotted",
  },
};

export const STATUS_TONES: Record<MapStatus, ToneStyle> = {
  passed: {
    box: "fill-success-tint stroke-success",
    swatch: "border-success bg-success-tint",
    glyph: "✓",
  },
  planned: {
    box: "fill-forest-tint stroke-forest",
    swatch: "border-forest bg-forest-tint",
    glyph: "●",
  },
  available: {
    box: "fill-warning-tint stroke-warning",
    swatch: "border-warning bg-warning-tint",
    glyph: "→",
  },
  locked: {
    box: "fill-sunken stroke-line-strong",
    swatch: "border-line-strong bg-sunken",
    dash: "dashed",
    glyph: "–",
  },
  notInCurriculum: {
    box: "fill-surface stroke-line",
    swatch: "border-line bg-surface",
    dash: "dotted",
    glyph: "×",
  },
};
