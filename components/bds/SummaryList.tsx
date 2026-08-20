import Link from "next/link";
import clsx from "clsx";

import { Heading, Text, type HeadingLevel } from "@/components/bds/Type";
import VisuallyHidden from "@/components/bds/VisuallyHidden";

/**
 * BIRSA Design System: `SummaryList` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Generalises 1.0's `SummaryRow` (`components/forms/SummaryRow.tsx`, one row
 * at a time) into the full GDS `summary-list` pattern: answers the reader
 * can check and change, on a check-answers page, rendered as one `<dl>` of
 * label, value and an optional change link per row.
 *
 * TWO VARIANTS, ONE COMPONENT. `variant="list"` (the default) is the plain
 * check-answers list. `variant="card"` wraps the same rows in a bordered
 * card with a heading and optional header actions, which is the GDS
 * "summary card" pattern and what the officer console needs for a single
 * record, such as an equipment loan or a club registration, where the
 * record needs a name and record-level actions above its fields. The two
 * are kept as one component, not two, because they share every row-level
 * concern (the label/value/change-link markup, the accessibility rule
 * below) and only differ in the wrapper; splitting them would either
 * duplicate that markup or leave one variant's fixes unapplied to the
 * other.
 *
 * THE CHANGE LINK NEVER READS AS A BARE "CHANGE". `changeLabel` is the
 * VISIBLE word (typically `dict.actions.change`, the same word on every
 * row), but every row also appends the row's own `label` as visually hidden
 * text, so the ACCESSIBLE NAME differs per row: "Change full name", "Change
 * email address", not "Change" repeated five times with no context, which
 * is meaningless read out of context by a screen reader's link list (the
 * Service Manual link-text rule, and the same fix 1.0's `SummaryRow` already
 * had). `changeHref` and `changeLabel` are typed as a pair: a row cannot
 * supply one without the other, so there is no way to ship a change link
 * with nothing for the reader to read.
 *
 * WCAG 3.3.7 redundant entry: a `SummaryList` is the LAST step before
 * submitting, and its whole job is showing the reader what the service
 * already holds. It never re-asks; a row with no `changeHref` is read only,
 * for values (like an item's name) the wizard fixed already and does not
 * offer to change here.
 */
export type SummaryListRow = {
  /** Stable key for the row. */
  id: string;
  label: string;
  value: React.ReactNode;
} & (
  | { changeHref?: undefined; changeLabel?: undefined }
  | {
      /** Where the change link goes, back to the step that answers `label`. */
      changeHref: string;
      /** The change link's VISIBLE text, e.g. `dict.actions.change`. The row's `label` is appended as hidden text; see this component's TSDoc. */
      changeLabel: string;
    }
);

type SummaryListBase = {
  rows: SummaryListRow[];
  className?: string;
};

export type SummaryListProps =
  | (SummaryListBase & { variant?: "list" })
  | (SummaryListBase & {
      variant: "card";
      /** The record's name, e.g. "Loan request LR-2026-0142". Required in the card variant: a record without a name is the wrong variant to use. */
      title: string;
      titleLevel?: HeadingLevel;
      /** Record-level actions shown beside the title, such as a link into the full record. Not per-row change links, which stay on their own rows. */
      actions?: React.ReactNode;
    });

function SummaryListRows({ rows }: { rows: SummaryListRow[] }) {
  return (
    <dl className="divide-y divide-line">
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex flex-col gap-1 px-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
        >
          <div className="min-w-0 sm:flex-1">
            <Text as="dt" step="body-sm" className="font-semibold text-ink">
              {row.label}
            </Text>
            <Text as="dd" step="body-sm" className="mt-0.5 break-words text-muted">
              {row.value}
            </Text>
          </div>
          {row.changeHref ? (
            <dd className="shrink-0">
              <Link
                href={row.changeHref}
                className="focus-halo font-semibold text-brand-deep underline hover:text-brand-dark"
              >
                <Text as="span" step="body-sm">
                  {row.changeLabel}
                </Text>{" "}
                <VisuallyHidden>{row.label}</VisuallyHidden>
              </Link>
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export default function SummaryList(props: SummaryListProps) {
  if (props.variant === "card") {
    const { rows, title, titleLevel = 3, actions, className } = props;
    return (
      <div className={clsx("rounded-lg border border-line bg-surface shadow-sm", className)}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-sunken px-4 py-3">
          <Heading level={titleLevel} step="heading-3">
            {title}
          </Heading>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
        <div className="px-4">
          <SummaryListRows rows={rows} />
        </div>
      </div>
    );
  }

  const { rows, className } = props;
  return (
    <div className={clsx("border-y border-line", className)}>
      <SummaryListRows rows={rows} />
    </div>
  );
}
