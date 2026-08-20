import { sectionTypeIds, type SectionTypeId } from "@/components/bds/sectionPalette";

import AccordionSection, {
  type AccordionSectionProps,
} from "@/components/bds/sections/AccordionSection";
import CardGridSection, {
  type CardGridSectionProps,
} from "@/components/bds/sections/CardGridSection";
import ContactPanelSection, {
  type ContactPanelSectionProps,
} from "@/components/bds/sections/ContactPanelSection";
import EmbeddedServiceSection, {
  type EmbeddedServiceSectionProps,
} from "@/components/bds/sections/EmbeddedServiceSection";
import InsetTextSection, {
  type InsetTextSectionProps,
} from "@/components/bds/sections/InsetTextSection";
import NavListSection, { type NavListSectionProps } from "@/components/bds/sections/NavListSection";
import NoticeSection, { type NoticeSectionProps } from "@/components/bds/sections/NoticeSection";
import RelatedLinksSection, {
  type RelatedLinksSectionProps,
} from "@/components/bds/sections/RelatedLinksSection";
import RichTextSection, {
  type RichTextSectionProps,
} from "@/components/bds/sections/RichTextSection";
import StepByStepSection, {
  type StepByStepSectionProps,
} from "@/components/bds/sections/StepByStepSection";
import TaskListSection, {
  type TaskListSectionProps,
} from "@/components/bds/sections/TaskListSection";

/**
 * BIRSA Design System: the section palette registry (REDESIGN-2.0 §4.6,
 * media cluster).
 *
 * Maps every id in `components/bds/sectionPalette.ts`'s `sectionTypeIds` to
 * the `bds/sections/` component that renders it, so a page can render a
 * list of officer-authored sections from data: `sections: SectionData[]`
 * from the CMS becomes `sections.map(renderSection)` and nothing about the
 * page needs to know which eleven components exist or how to choose
 * between them.
 *
 * `SectionData` is a discriminated union keyed by `type`, one member per
 * `SectionTypeId`, each carrying exactly the props its own section
 * component declares. `renderSection`'s `switch` is exhaustive over that
 * union: removing a case, or `sectionPalette.ts` gaining a twelfth section
 * type this file has not caught up with yet, fails to typecheck rather than
 * silently rendering nothing for an unrecognised section, because the
 * `default` branch below asserts its input has type `never`.
 *
 * None of the eleven section components takes a `className`, a `style`, or
 * any other field in `sectionPalette.ts`'s `forbiddenSchemaFields`, and
 * neither does `SectionData`: this file is itself part of the boundary that
 * keeps officer composition to the fixed palette (§4.6), not just each
 * section individually.
 */
export type SectionData =
  | { type: "rich-text"; props: RichTextSectionProps }
  | { type: "nav-list"; props: NavListSectionProps }
  | { type: "card-grid"; props: CardGridSectionProps }
  | { type: "notice"; props: NoticeSectionProps }
  | { type: "inset-text"; props: InsetTextSectionProps }
  | { type: "accordion"; props: AccordionSectionProps }
  | { type: "step-by-step"; props: StepByStepSectionProps }
  | { type: "task-list"; props: TaskListSectionProps }
  | { type: "contact-panel"; props: ContactPanelSectionProps }
  | { type: "related-links"; props: RelatedLinksSectionProps }
  | { type: "embedded-service"; props: EmbeddedServiceSectionProps };

/**
 * Renders one officer-authored section from data. Use this from a page that
 * lays out `SectionData[]`, rather than importing individual `*Section`
 * components and switching on `type` by hand.
 */
export function renderSection(section: SectionData): React.ReactElement {
  switch (section.type) {
    case "rich-text":
      return <RichTextSection {...section.props} />;
    case "nav-list":
      return <NavListSection {...section.props} />;
    case "card-grid":
      return <CardGridSection {...section.props} />;
    case "notice":
      return <NoticeSection {...section.props} />;
    case "inset-text":
      return <InsetTextSection {...section.props} />;
    case "accordion":
      return <AccordionSection {...section.props} />;
    case "step-by-step":
      return <StepByStepSection {...section.props} />;
    case "task-list":
      return <TaskListSection {...section.props} />;
    case "contact-panel":
      return <ContactPanelSection {...section.props} />;
    case "related-links":
      return <RelatedLinksSection {...section.props} />;
    case "embedded-service":
      return <EmbeddedServiceSection {...section.props} />;
    default: {
      const exhaustive: never = section;
      throw new Error(`Unknown section type: ${JSON.stringify(exhaustive)}`);
    }
  }
}

/**
 * The same mapping, as a lookup keyed by `SectionTypeId`, for callers and
 * tests that want the component itself rather than a rendered element (for
 * example, `tests/unit/bds-sections.test.tsx`'s check that this file names
 * every id in `sectionTypeIds`, with none missing and none extra). `never`
 * as the parameter type is deliberate: every section component takes a
 * different, more specific props type, and a function parameter is safely
 * assignable to a narrower supertype's parameter of `never` no matter what
 * it actually requires, so this record can hold all eleven without erasing
 * any of them to `any`. Prefer `renderSection` above for actually rendering
 * a section: it keeps each component's real props type instead of widening
 * it away.
 */
export const sectionComponents: Record<SectionTypeId, (props: never) => React.ReactElement> = {
  "rich-text": RichTextSection,
  "nav-list": NavListSection,
  "card-grid": CardGridSection,
  notice: NoticeSection,
  "inset-text": InsetTextSection,
  accordion: AccordionSection,
  "step-by-step": StepByStepSection,
  "task-list": TaskListSection,
  "contact-panel": ContactPanelSection,
  "related-links": RelatedLinksSection,
  "embedded-service": EmbeddedServiceSection,
};

/** Re-exported for convenience so a caller of this file need not also import `sectionPalette.ts` directly just to enumerate ids. */
export { sectionTypeIds };
export type { SectionTypeId };
