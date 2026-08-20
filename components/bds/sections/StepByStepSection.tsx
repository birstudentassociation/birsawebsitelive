import SummaryList from "@/components/bds/SummaryList";

/**
 * BIRSA Design System: `StepByStepSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `step-by-step` entry of `components/bds/sectionPalette.ts`:
 * an ordered process, through `SummaryList` (content cluster, already
 * built) in its plain `variant="list"` form. Each step's `title` becomes a
 * row's `label` and its `description` becomes the row's `value`; no row
 * carries a `changeHref`, because a step-by-step section is read-only
 * narrative, never a check-answers list a reader edits (`SummaryList`'s own
 * WCAG 3.3.7 note: a row with no change link is read only).
 *
 * THIS MAPPING IS A JUDGEMENT CALL, NOT A CONFIRMED FIT, AND IS WORTH
 * REVISITING. `SummaryList` renders a `<dl>` of label/value pairs, not a
 * numbered, connected sequence a reader scans top to bottom as "step 1,
 * step 2, step 3": the GOV.UK pattern this section's `does` field describes
 * ("an ordered process") is normally its own `steps` component with visible
 * numbering and a connecting line, which this design system does not have.
 * `sectionPalette.ts` names `SummaryList` as the component for this section
 * type and that contract is frozen, so this file honours it rather than
 * inventing a different component; see this cluster's report for the
 * concern.
 */
export type StepByStepSectionStep = {
  id: string;
  title: string;
  description: string;
};

export type StepByStepSectionProps = {
  steps: StepByStepSectionStep[];
};

export default function StepByStepSection({ steps }: StepByStepSectionProps) {
  if (steps.length < 2 && process.env.NODE_ENV !== "production") {
    throw new Error(
      `bds/StepByStepSection: needs at least two steps, each with a heading (got ${steps.length}) (sectionPalette.ts: step-by-step.validates).`
    );
  }

  return (
    <SummaryList
      rows={steps.map((step) => ({
        id: step.id,
        label: step.title,
        value: step.description,
      }))}
    />
  );
}
