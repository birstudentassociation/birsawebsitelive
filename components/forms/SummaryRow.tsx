import Link from "next/link";

export type SummaryRowProps = {
  label: string;
  value: string;
  /** Href of the step to re-enter, e.g. `/en/contact/name?returnTo=check`. Omit for read-only rows (e.g. the item name on a loan request). */
  changeHref?: string;
  /** Visible "Change" text. */
  changeLabel?: string;
};

/**
 * One row of a check-your-answers summary list: label, value, and an
 * optional "change" link. The link text always carries visually-hidden
 * context naming the field ("Change full name", not a bare "Change"), so it
 * still makes sense read out of context by a screen reader (Service Manual
 * link-text rule).
 */
export default function SummaryRow({ label, value, changeHref, changeLabel }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div>
        <dt className="text-sm font-semibold text-ink">{label}</dt>
        <dd className="mt-0.5 text-sm break-words text-muted">{value}</dd>
      </div>
      {changeHref ? (
        <Link
          href={changeHref}
          className="shrink-0 text-sm font-medium text-brand-deep underline hover:text-brand-dark"
        >
          {changeLabel}
          <span className="sr-only"> {label}</span>
        </Link>
      ) : null}
    </div>
  );
}
