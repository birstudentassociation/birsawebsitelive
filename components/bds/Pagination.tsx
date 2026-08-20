import Link from "next/link";
import clsx from "clsx";

import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";
import VisuallyHidden from "@/components/bds/VisuallyHidden";

/**
 * BIRSA Design System: `Pagination` (REDESIGN-2.0 §3.5, §4.3, navigation
 * cluster).
 *
 * A list longer than one page. Never infinite scroll: it breaks the footer
 * and the back button (§4.3 usage rule).
 *
 * Generalised from 1.0's `components/Pager.tsx`, which rendered a bare
 * "Previous"/"Next" pair with a "Page X of Y" caption and drove a client
 * callback. This rebuild follows the `govuk-frontend` `pagination` component
 * instead (§4.3): numbered page links, the current one marked
 * `aria-current="page"` rather than styled by colour alone, and every link's
 * accessible name says what it does rather than repeating a bare "Next" with
 * no context for someone listing links out of order in a screen reader
 * (BUILD-BRIEF-2.0 §7).
 *
 * Two ways to drive it, matching `Button`'s own `href`/`onClick` split:
 * pass `hrefFor` when pagination is a real navigation (page N is a URL, and
 * the reader can open it in a new tab, bookmark it, use back/forward); pass
 * `onPageChange` only for a client-filtered list that has no per-page URL of
 * its own. Prefer `hrefFor` wherever a URL for page N can exist at all.
 */
export type PaginationProps = {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  /** Build the href for a given page, relative to the locale root, e.g. `(p) => \`/whats-on/news?page=${p}\``. */
  hrefFor?: (page: number) => string;
  /** Client-driven paging for a list with no per-page URL. Ignored when `hrefFor` is given. */
  onPageChange?: (page: number) => void;
  /** `dict.a11y.paginationNav`: "Pagination". */
  ariaLabel: string;
  /** `dict.a11y.paginationPrevious`: "Previous", the visible label. */
  previousLabel: string;
  /** `dict.a11y.paginationNext`: "Next", the visible label. */
  nextLabel: string;
  /** `dict.a11y.paginationPage`, containing the literal placeholder "{page}". */
  pageLabelTemplate: string;
  /** `dict.a11y.paginationPreviousPage`, containing the literal placeholder "{page}": the previous link's accessible name, carrying where it goes rather than a bare "Previous". */
  previousPageLabelTemplate: string;
  /** `dict.a11y.paginationNextPage`, containing the literal placeholder "{page}". */
  nextPageLabelTemplate: string;
  /** `dict.a11y.currentPage`: "Current page", appended (visually hidden) to the current page's number. */
  currentPageLabel: string;
  className?: string;
};

function fillPage(template: string, page: number): string {
  return template.replaceAll("{page}", String(page));
}

/** Which page numbers to show: first, last, current and its neighbours, everything if the run is short. */
function visiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withEllipsis: (number | "ellipsis")[] = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (index > 0 && previous !== undefined && page - previous > 1) {
      withEllipsis.push("ellipsis");
    }
    withEllipsis.push(page);
  });
  return withEllipsis;
}

const itemClass =
  "focus-halo flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 font-semibold";

export default function Pagination({
  locale,
  currentPage,
  totalPages,
  hrefFor,
  onPageChange,
  ariaLabel,
  previousLabel,
  nextLabel,
  pageLabelTemplate,
  previousPageLabelTemplate,
  nextPageLabelTemplate,
  currentPageLabel,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function goTo(page: number, event?: React.MouseEvent) {
    if (hrefFor) return; // real <a>: navigation handles itself
    event?.preventDefault();
    onPageChange?.(Math.min(totalPages, Math.max(1, page)));
  }

  function renderNumber(page: number) {
    const isCurrent = page === currentPage;
    const label = fillPage(pageLabelTemplate, page);

    if (isCurrent) {
      return (
        <span
          key={page}
          aria-current="page"
          className={clsx(itemClass, "bg-brand-tint text-brand-deep")}
        >
          <Text as="span" step="body">
            {page}
          </Text>
          <VisuallyHidden> ({currentPageLabel})</VisuallyHidden>
        </span>
      );
    }

    const href = hrefFor ? localeHref(locale, hrefFor(page)) : "#";
    return (
      <Link
        key={page}
        href={href}
        aria-label={label}
        onClick={(event) => goTo(page, event)}
        className={clsx(itemClass, "text-ink hover:bg-sunken")}
      >
        <Text as="span" step="body">
          {page}
        </Text>
      </Link>
    );
  }

  const previousHref =
    hrefFor && currentPage > 1 ? localeHref(locale, hrefFor(currentPage - 1)) : undefined;
  const nextHref =
    hrefFor && currentPage < totalPages ? localeHref(locale, hrefFor(currentPage + 1)) : undefined;

  return (
    <nav
      aria-label={ariaLabel}
      className={clsx("flex items-center justify-between gap-2", className)}
    >
      {currentPage > 1 ? (
        <Link
          href={previousHref ?? "#"}
          onClick={(event) => goTo(currentPage - 1, event)}
          aria-label={fillPage(previousPageLabelTemplate, currentPage - 1)}
          className={clsx(itemClass, "gap-1 text-ink hover:bg-sunken")}
        >
          <Icon name="chevron-left" />
          <Text as="span" step="body">
            {previousLabel}
          </Text>
        </Link>
      ) : (
        <span aria-hidden="true" className={clsx(itemClass, "gap-1 text-muted")}>
          <Icon name="chevron-left" />
          <Text as="span" step="body">
            {previousLabel}
          </Text>
        </span>
      )}

      <ul className="flex items-center gap-1">
        {visiblePages(currentPage, totalPages).map((entry, index) =>
          entry === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden="true" className="px-1 text-muted">
              <Text as="span" step="body">
                …
              </Text>
            </li>
          ) : (
            <li key={entry}>{renderNumber(entry)}</li>
          )
        )}
      </ul>

      {currentPage < totalPages ? (
        <Link
          href={nextHref ?? "#"}
          onClick={(event) => goTo(currentPage + 1, event)}
          aria-label={fillPage(nextPageLabelTemplate, currentPage + 1)}
          className={clsx(itemClass, "gap-1 text-ink hover:bg-sunken")}
        >
          <Text as="span" step="body">
            {nextLabel}
          </Text>
          <Icon name="chevron-right" />
        </Link>
      ) : (
        <span aria-hidden="true" className={clsx(itemClass, "gap-1 text-muted")}>
          <Text as="span" step="body">
            {nextLabel}
          </Text>
          <Icon name="chevron-right" />
        </span>
      )}
    </nav>
  );
}
