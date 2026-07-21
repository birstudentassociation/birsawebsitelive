"use client";

/**
 * Presentational Previous/Next pager with a "Page X of Y" indicator,
 * extracted from `components/course-review/CourseReviewBrowser.tsx`
 * (~lines 90-104 and 196-219) so officer console managers can share it.
 *
 * Keeps keyboard focus inside the pager across page changes: when the
 * just-pressed button becomes disabled at a boundary (first/last page),
 * focus moves to its still-enabled sibling instead of being dropped to
 * <body> (WCAG 2.4.3), via the same pendingFocus-ref + effect pattern as the
 * source component.
 */
import { useEffect, useId, useRef } from "react";
import Button from "@/components/Button";

export type PagerProps = {
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
  /** Template containing the literal placeholders "{current}" and "{total}". */
  pageOfTemplate: string;
  className?: string;
};

function fillPageOf(template: string, current: number, total: number): string {
  return template
    .replaceAll("{current}", String(current))
    .replaceAll("{total}", String(total));
}

export default function Pager({
  page,
  totalPages,
  goToPage,
  previousLabel,
  nextLabel,
  pageOfTemplate,
  className,
}: PagerProps) {
  const baseId = useId();
  const prevId = `${baseId}-prev`;
  const nextId = `${baseId}-next`;
  const pendingFocus = useRef<"prev" | "next" | null>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const targetId = pendingFocus.current === "next" ? nextId : prevId;
    pendingFocus.current = null;
    document.getElementById(targetId)?.focus();
  }, [page, prevId, nextId]);

  if (totalPages <= 1) return null;

  function handleGoToPage(target: number) {
    const next = Math.min(totalPages, Math.max(1, target));
    // If the button just pressed will disable at this boundary, hand focus
    // to the opposite button, which stays enabled.
    if (next > page) pendingFocus.current = next === totalPages ? "prev" : "next";
    else if (next < page) pendingFocus.current = next === 1 ? "next" : "prev";
    goToPage(next);
  }

  const pageOfText = fillPageOf(pageOfTemplate, page, totalPages);

  return (
    <nav aria-label={pageOfText} className={className ?? "flex items-center justify-center gap-4"}>
      <Button
        id={prevId}
        variant="secondary"
        onClick={() => handleGoToPage(page - 1)}
        disabled={page === 1}
      >
        {previousLabel}
      </Button>
      <span aria-hidden="true" className="text-muted text-sm">
        {pageOfText}
      </span>
      <Button
        id={nextId}
        variant="secondary"
        onClick={() => handleGoToPage(page + 1)}
        disabled={page === totalPages}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
