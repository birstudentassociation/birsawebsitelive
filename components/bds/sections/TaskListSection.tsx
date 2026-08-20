import TaskList, { type TaskListItem } from "@/components/bds/TaskList";

/**
 * BIRSA Design System: `TaskListSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `task-list` entry of `components/bds/sectionPalette.ts`:
 * sections with status tags, through `TaskList` (service cluster).
 *
 * A CONTRACT TENSION WORTH FLAGGING, NOT SILENTLY WORKED AROUND. `TaskList`
 * is documented, in its own file, as a PAGE-LEVEL component: "renders the
 * page's own `<h1>`... do not wrap it in another component that also
 * renders an `<h1>`". `sectionPalette.ts` treats `task-list` as one of
 * eleven section types an officer can place ALONGSIDE OTHERS inside a
 * page's body, where the page's one `<h1>` belongs to `PageHeader`, not to
 * any section. Used as anything but the sole section on a page, this
 * component therefore produces a second `<h1>` and breaks the heading
 * order §9's accessibility suite asserts, the exact failure `RichTextSection`
 * (this cluster) was built specifically to make impossible for rich text.
 * This cluster does not own `TaskList` and does not alter it; see this
 * cluster's report for the finding. Until it is resolved, treat `task-list`
 * as safe only on a page where it is the one and only section.
 *
 * `items` takes `TaskList`'s own `TaskListItem` type directly rather than a
 * section-local copy, so this section can never drift from whatever shape
 * `TaskList` actually accepts.
 */
export type TaskListSectionProps = {
  heading: string;
  intro?: string;
  items: TaskListItem[];
};

export default function TaskListSection({ heading, intro, items }: TaskListSectionProps) {
  return <TaskList heading={heading} intro={intro} items={items} />;
}
