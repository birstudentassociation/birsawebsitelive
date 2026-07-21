// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePagination } from "@/lib/usePagination";

describe("usePagination", () => {
  it("slices the first page by default", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 10));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageItems).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("reports a single page (and the full list) when items fit within pageSize", () => {
    const items = [1, 2, 3];
    const { result } = renderHook(() => usePagination(items, 10));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageItems).toEqual([1, 2, 3]);
  });

  it("reports one page (not zero) for an empty list", () => {
    const { result } = renderHook(() => usePagination<number>([], 10));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageItems).toEqual([]);
  });

  it("moves to the requested page and slices accordingly", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => result.current.goToPage(2));

    expect(result.current.page).toBe(2);
    expect(result.current.pageItems).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it("clamps goToPage above the last page down to totalPages", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => result.current.goToPage(99));

    expect(result.current.page).toBe(3);
    expect(result.current.pageItems).toEqual([20, 21, 22, 23, 24]);
  });

  it("clamps goToPage below the first page up to 1", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => result.current.goToPage(2));
    act(() => result.current.goToPage(-5));

    expect(result.current.page).toBe(1);
  });

  it("resets the effective page (Math.min guard) when the item list shrinks below the current page", () => {
    let items = Array.from({ length: 25 }, (_, i) => i);
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 10), {
      initialProps: { items },
    });

    act(() => result.current.goToPage(3));
    expect(result.current.page).toBe(3);
    expect(result.current.pageItems).toEqual([20, 21, 22, 23, 24]);

    // Simulate a filter narrowing the list to fewer than 2 pages' worth.
    items = Array.from({ length: 5 }, (_, i) => i);
    rerender({ items });

    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(1);
    expect(result.current.pageItems).toEqual([0, 1, 2, 3, 4]);
  });

  it("remembers the requested page again once the item list grows back", () => {
    let items = Array.from({ length: 25 }, (_, i) => i);
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 10), {
      initialProps: { items },
    });

    act(() => result.current.goToPage(3));
    items = Array.from({ length: 5 }, (_, i) => i);
    rerender({ items });
    expect(result.current.page).toBe(1); // clamped

    items = Array.from({ length: 25 }, (_, i) => i);
    rerender({ items });
    expect(result.current.page).toBe(3); // back to the originally requested page
  });
});
