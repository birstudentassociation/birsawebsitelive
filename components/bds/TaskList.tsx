import Link from "next/link";
import clsx from "clsx";

import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * BIRSA Design System: `TaskList` (REDESIGN-2.0 §4.4, §4.3b `task-list-pages`
 * and `complete-multiple-tasks`, service cluster).
 *
 * The GDS pattern for a service made of several sections a reader completes
 * in any order, each carrying a status. Three immediate uses named in the
 * manifest: the international student arrival checklist, the per-portfolio
 * handover checklist (roadmap §4F), and starting a club, which 1.0 built as
 * a linear wizard for something that is genuinely a set of parallel tasks.
 *
 * THE Tag SEAM. `manifest.ts`'s usage note for `TaskList` says each task
 * carries "a status Tag", and `Tag` (`components/bds/Tag.tsx`, `status`
 * cluster, `merge` of 1.0's `Tag.tsx` and `StatusPill.tsx`) is a DIFFERENT
 * agent's owned path in this wave and does not exist in this checkout yet.
 * Creating it here would be exactly the file-ownership violation
 * BUILD-BRIEF-2.0 §10 forbids ("Two agents never hold the same path in the
 * same wave"). So `TaskListItem.status.label` accepts a `React.ReactNode`
 * instead of a fixed status enum: pass a plain string today, and once `Tag`
 * ships, pass `<Tag>{label}</Tag>` instead, with no change to this
 * component's props. `TaskListItem.status.tone` is carried alongside for
 * exactly that future wiring (so a caller can already record which of the
 * four states a task is in); this component does not use `tone` for
 * colour itself, since "never colour alone: the word is the meaning" (`Tag`'s
 * own manifest usage note) is `Tag`'s rule to keep, not this component's to
 * duplicate.
 *
 * ACCESSIBLE PAIRING. Each task's link and its status are programmatically
 * associated (`aria-describedby`) so a screen reader announces them
 * together, "Provide your travel details, Not started", rather than as two
 * unrelated pieces of text a reader has to correlate by eye.
 *
 * A task with no `href` is not yet startable (its prerequisites are
 * incomplete): it renders as plain text rather than a link, matching GDS's
 * own guidance for `cannot-start-yet` tasks.
 *
 * HEADING ORDER: page-level. Renders the page's own `<h1>` from `heading`.
 */
export type TaskListStatus = {
  /**
   * The visible status. A plain string today; `<Tag>{label}</Tag>` once the
   * status cluster's `Tag` component exists (see the file-level TSDoc).
   */
  label: React.ReactNode;
  /** Recorded for the future `Tag` wiring; this component does not read it for colour. */
  tone?: "not-started" | "in-progress" | "cannot-start" | "completed";
};

export type TaskListItem = {
  id: string;
  title: string;
  /** Omit when the task cannot be started yet; it then renders as plain text. */
  href?: string;
  /** A short line under the title, e.g. what the task involves. */
  hint?: string;
  status: TaskListStatus;
};

export type TaskListProps = {
  heading: string;
  intro?: string;
  items: TaskListItem[];
  className?: string;
};

export default function TaskList({ heading, intro, items, className }: TaskListProps) {
  return (
    <Stack gap="xl" className={clsx(className)}>
      <Stack gap="md">
        <Heading level={1}>{heading}</Heading>
        {intro ? <Text step="body">{intro}</Text> : null}
      </Stack>

      <ol className="flex flex-col divide-y divide-line border-y border-line">
        {items.map((item) => {
          const statusId = `task-list-status-${item.id}`;
          return (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                {item.href ? (
                  <Link
                    href={item.href}
                    aria-describedby={statusId}
                    className="focus-halo inline-block font-semibold text-brand-deep underline underline-offset-2"
                  >
                    <Text as="span" step="body">
                      {item.title}
                    </Text>
                  </Link>
                ) : (
                  <Text as="span" step="body" className="font-semibold text-muted">
                    {item.title}
                  </Text>
                )}
                {item.hint ? (
                  <Text as="p" step="body-sm" className="mt-1 text-muted">
                    {item.hint}
                  </Text>
                ) : null}
              </div>
              <div id={statusId}>{item.status.label}</div>
            </li>
          );
        })}
      </ol>
    </Stack>
  );
}
