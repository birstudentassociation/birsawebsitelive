// `TaskList` (service cluster, §4.4) does not exist in this checkout yet.
// This import is expected to fail typecheck until that cluster lands it;
// see this cluster's report. The prop shape below is this cluster's best
// guess at the GDS task-list pattern `TaskList`'s manifest usage rule
// describes ("several sections completed in any order, each with a status
// Tag"), not a confirmed API.
import TaskList from "@/components/bds/TaskList";

/**
 * BIRSA Design System: `TaskListSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `task-list` entry of `components/bds/sectionPalette.ts`:
 * sections with status tags, through `TaskList` (service cluster).
 * `sectionPalette.ts` validates "every task has a status from the Tag
 * vocabulary"; `TaskStatus` below is this cluster's placeholder for that
 * vocabulary, kept local rather than imported, because neither `TaskList`
 * nor `Tag` (both service/status cluster work landing in this same wave)
 * exist yet to import a real vocabulary from. Reconciling this type with
 * whatever `TaskList` actually ships is cross-cluster work; see this
 * cluster's report.
 */
export type TaskStatus = "not-started" | "in-progress" | "completed" | "cannot-start";

export type TaskListSectionTask = {
  id: string;
  title: string;
  href?: string;
  status: TaskStatus;
};

export type TaskListSectionGroup = {
  id: string;
  title: string;
  tasks: TaskListSectionTask[];
};

export type TaskListSectionProps = {
  groups: TaskListSectionGroup[];
};

export default function TaskListSection({ groups }: TaskListSectionProps) {
  return <TaskList groups={groups} />;
}
