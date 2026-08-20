"use client";

import { useEffect, useRef } from "react";

import { Heading, Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `ErrorSummary` (REDESIGN-2.0 `components/bds/manifest.ts`,
 * forms cluster, kept from `components/ErrorSummary.tsx`).
 *
 * Every failed submit, at the top of the page, taking focus. Already
 * implemented correctly in 1.0 (BUILD-BRIEF-2.0 section 7): this keeps that
 * focus management byte for byte, only rewriting the visible text through
 * `Heading`/`Text` (defect D7) instead of raw Tailwind `text-*` utilities.
 * Read `components/ErrorSummary.tsx` before touching this file again; it is
 * the one this generalises and it is not to be edited (it stays in place
 * until its own callers migrate in Wave 5).
 *
 * Pair this with `ErrorMessage` on every field that failed: the summary is
 * how a keyboard or screen reader user finds out something is wrong and
 * jumps straight to it, `ErrorMessage` is what confirms the problem once
 * they arrive.
 */
export type ErrorSummaryItem = {
  /** Element id of the field this error belongs to, for the jump-to link. */
  id: string;
  message: string;
};

export type ErrorSummaryProps = {
  title: string;
  errors: ErrorSummaryItem[];
};

export default function ErrorSummary({ title, errors }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Depend on a stable content signature, not the `errors` array reference
  // (callers rebuild that inline on every render). Otherwise the summary
  // would steal focus back from the field on every keystroke while an error
  // is showing (SC 3.2.2 / 2.4.3). Focus moves only when the set of errors
  // actually changes, e.g. on a failed submit.
  const signature = errors.map((error) => `${error.id}:${error.message}`).join("|");

  useEffect(() => {
    if (signature) {
      ref.current?.focus();
    }
  }, [signature]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="focus-halo rounded-lg border-l-4 border-error bg-error-tint p-4"
    >
      <Heading level={2} step="heading-3" className="text-ink">
        {title}
      </Heading>
      <ul className="mt-2 list-inside list-disc space-y-1">
        {errors.map((error) => (
          <li key={error.id}>
            <a
              href={`#${error.id}`}
              className="focus-highlight font-medium text-brand-deep hover:text-brand-dark"
            >
              <Text as="span" step="body-sm">
                {error.message}
              </Text>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
