"use client";

import { useEffect, useRef } from "react";

export type ErrorSummaryItem = {
  /** Element id of the field this error belongs to, for the jump-to link. */
  id: string;
  message: string;
};

export type ErrorSummaryProps = {
  title: string;
  errors: ErrorSummaryItem[];
};

/**
 * Error summary box shown at the top of a form on failed submit. Receives
 * focus on mount so screen reader / keyboard users land on it immediately;
 * each error links to its field via `#id`.
 */
export default function ErrorSummary({ title, errors }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length > 0) {
      ref.current?.focus();
    }
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="focus-halo border-error bg-error-tint rounded-lg border-l-4 p-4"
    >
      <h2 className="text-ink text-base font-semibold">{title}</h2>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
        {errors.map((error) => (
          <li key={error.id}>
            <a href={`#${error.id}`} className="text-brand-deep hover:text-brand-dark font-medium">
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
