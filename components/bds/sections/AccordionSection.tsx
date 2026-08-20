import Accordion from "@/components/bds/Accordion";

/**
 * BIRSA Design System: `AccordionSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `accordion` entry of `components/bds/sectionPalette.ts`:
 * question and answer pairs, through `Accordion` (content cluster, already
 * built on native `<details>`).
 *
 * `sectionPalette.ts` validates "at least two pairs; one pair is a
 * `Details`", meaning a single question and answer should have been
 * authored as a `Details` section instead, not as a one-item accordion:
 * this is CMS-side publish validation (`sectionPalette.ts`'s own
 * `validates` field), but a broken validation gap that lets one pair
 * through should not render silently, so this component throws in
 * development the same way an invalid `ImageField` does elsewhere in this
 * cluster (`Figure.tsx`'s `assertValidImage`) rather than rendering a
 * single accordion item and moving on. In production it renders the item
 * anyway rather than dropping content a reader may need: an accordion with
 * one pair is a cosmetic wart, not the accessibility failure an unlabelled
 * image is, so the two components make different production choices for
 * the same kind of upstream validation gap.
 */
export type AccordionSectionPair = {
  id: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

export type AccordionSectionProps = {
  pairs: AccordionSectionPair[];
};

export default function AccordionSection({ pairs }: AccordionSectionProps) {
  if (pairs.length < 2 && process.env.NODE_ENV !== "production") {
    throw new Error(
      `bds/AccordionSection: needs at least two pairs (got ${pairs.length}). A single pair belongs in a "details" section, not a one-item accordion (sectionPalette.ts: accordion.validates).`
    );
  }

  return (
    <Accordion
      items={pairs.map((pair) => ({
        id: pair.id,
        summary: pair.question,
        children: pair.answer,
        defaultOpen: pair.defaultOpen,
      }))}
    />
  );
}
