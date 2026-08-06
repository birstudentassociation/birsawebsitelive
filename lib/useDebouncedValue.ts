"use client";

/**
 * Debounce a fast-changing value (typically typed input) so dependent effects
 * only run once the reader has paused, not on every keystroke. Follows the
 * hook-file conventions in `lib/usePagination.ts`: a small, dependency-free
 * client hook rather than a dependency. Its first caller is the search
 * typeahead, which would otherwise fetch on every character typed.
 *
 * The pending timer is cleared on every value change and on unmount, so a
 * fast typist never leaves a stray timeout that fires after the component is
 * gone or overwrites a newer value.
 */
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
