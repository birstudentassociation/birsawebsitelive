// `InsetText` (status cluster, split from `Notice.tsx`) does not exist in
// this checkout yet. This import is expected to fail typecheck until that
// cluster lands it; see this cluster's report.
import InsetText from "@/components/bds/InsetText";
import { renderInline, type RichTextInline } from "@/components/bds/sections/RichTextSection";

/**
 * BIRSA Design System: `InsetTextSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `inset-text` entry of `components/bds/sectionPalette.ts`: a
 * quoted or emphasised aside, through `InsetText` (status cluster).
 * `sectionPalette.ts` validates this section as "plain text with inline
 * marks only", which is `RichTextSection`'s own inline vocabulary
 * (`strong`, `em`, `link`, `code`) with no block structure around it: one
 * run of inline content, not a list of blocks. Reusing `RichTextInline` and
 * its renderer from `RichTextSection.tsx` rather than a second copy keeps
 * the two sections' idea of "an inline mark" from drifting apart.
 */
export type InsetTextSectionProps = {
  content: RichTextInline[];
  /** `dict.a11y.newTab`. Only used when `content` includes an external link. */
  newTabLabel: string;
};

export default function InsetTextSection({ content, newTabLabel }: InsetTextSectionProps) {
  return <InsetText>{renderInline(content, newTabLabel)}</InsetText>;
}
