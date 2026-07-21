"use client";

/**
 * Client-side pagination over an already-filtered array, extracted from the
 * page/slice pattern in `components/course-review/CourseReviewBrowser.tsx`
 * (PAGE_SIZE + useState page + `.slice()`), so the officer console managers
 * can share it instead of re-deriving it per component.
 *
 * `page` is clamped into `[1, totalPages]` on every render (a `Math.min`
 * guard), so if `items` shrinks after a filter change and the stored page
 * number is now past the end, the page snaps back into range and `pageItems`
 * is never an empty slice past the last page. This mirrors
 * `CourseReviewBrowser`'s `currentPage = Math.min(page, totalPages)`.
 */
import { useMemo, useState } from "react";

export type UsePaginationResult<T> = {
  /** Always within `[1, totalPages]`, even if `goToPage` was last called with
   * a stale value from before `items` shrank. */
  page: number;
  totalPages: number;
  pageItems: T[];
  goToPage: (page: number) => void;
};

export function usePagination<T>(items: T[], pageSize: number): UsePaginationResult<T> {
  const [requestedPage, setRequestedPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  function goToPage(target: number) {
    setRequestedPage(Math.min(totalPages, Math.max(1, target)));
  }

  return { page, totalPages, pageItems, goToPage };
}
