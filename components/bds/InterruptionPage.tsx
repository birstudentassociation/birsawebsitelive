import clsx from "clsx";

import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * BIRSA Design System: `InterruptionPage` (REDESIGN-2.0 §4.3b
 * `interruption-pages`, service cluster).
 *
 * A full page the reader must take in before continuing, used when
 * something needs saying at the exact moment it matters rather than as a
 * line buried in a paragraph the reader can skim past. Its home is the
 * welfare and reporting flows: §5.4's boundary on what BIRSA can and cannot
 * do (BIRSA is not the police, is not a counsellor, cannot compel the
 * university to act, and so on, as the owning portfolio states it) needs to
 * be said BEFORE a student starts typing a disclosure, not on a page they
 * have already half-filled in. Saying it earlier is also what makes a
 * genuine "I don't want to continue" exit meaningful: read after the fact,
 * it is too late to change what someone already wrote.
 *
 * COMPOSE `ExitThisPage` HERE, DO NOT REBUILD IT. Any `InterruptionPage`
 * that sits in front of a welfare or reporting flow should also carry
 * `ExitThisPage` (`components/bds/ExitThisPage.tsx`, this cluster): pass a
 * rendered `<ExitThisPage ... />` as the `exitThisPage` prop rather than
 * this component growing its own leave-the-page logic. The boundary this
 * page states is exactly the kind of content someone might need to leave
 * mid-read.
 *
 * TWO WAYS FORWARD, NEVER JUST ONE. `continueHref`/`continueLabel` is the
 * only required action (§8 heuristic 3, "user control and freedom": 1.0 had
 * no cancel path out of most flows). `secondaryHref`/`secondaryLabel` is an
 * explicit second option, e.g. "I don't want to continue" back to a safe
 * page, for the reader who read the boundary and decided this is not the
 * right channel for them; supply both together or neither.
 *
 * `children` carries the actual boundary content the owning portfolio
 * writes (what BIRSA can help with, what it cannot, where else to go). It
 * is `React.ReactNode` because this is a page developers place directly in
 * `app/`, not a section an officer composes through the CMS's constrained
 * palette (REDESIGN-2.0 §4.6): that palette's "no raw HTML, no free-form
 * component" rule governs officer-authored content, not a `bds/` component
 * a developer is assembling a page from.
 *
 * HEADING ORDER: page-level. Renders the page's own `<h1>` from `heading`.
 */
export type InterruptionPageProps = {
  heading: string;
  intro?: string;
  /** The boundary content itself: what BIRSA can and cannot do, said before the reader continues. */
  children: React.ReactNode;
  continueHref: string;
  continueLabel: string;
  /** e.g. "I don't want to continue". Supply together with `secondaryLabel`, or omit both. */
  secondaryHref?: string;
  secondaryLabel?: string;
  /** A rendered `<ExitThisPage ... />`. See the file-level TSDoc. */
  exitThisPage?: React.ReactNode;
  className?: string;
};

export default function InterruptionPage({
  heading,
  intro,
  children,
  continueHref,
  continueLabel,
  secondaryHref,
  secondaryLabel,
  exitThisPage,
  className,
}: InterruptionPageProps) {
  return (
    <Stack gap="xl" className={clsx(className)}>
      {exitThisPage}

      <Stack gap="md">
        <Heading level={1}>{heading}</Heading>
        {intro ? <Text step="body">{intro}</Text> : null}
      </Stack>

      <div>{children}</div>

      <div className="flex flex-wrap gap-3">
        <Button href={continueHref}>{continueLabel}</Button>
        {secondaryHref && secondaryLabel ? (
          <Button href={secondaryHref} variant="secondary">
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </Stack>
  );
}
