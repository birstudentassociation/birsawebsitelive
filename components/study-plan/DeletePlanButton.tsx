"use client";

/**
 * Progressive-enhancement layer over the plain submit button that already
 * deletes the plan without JavaScript: the server action clears the draft
 * cookie and redirects to the journey start regardless of whether this file
 * ever runs (see `deleteStudyPlan` in app/[lang]/services/study-plan/actions.ts
 * and the delete section in .../plan/page.tsx).
 *
 * All this adds is clearing `PlanStore`'s localStorage mirror before the
 * form posts, so JavaScript readers do not end up with a stale copy sitting
 * next to the "your plan was deleted" confirmation shown on the page they
 * land on. No `mounted` gate: the fallback button is real markup already, so
 * this only decorates its existing `onClick` rather than changing what is
 * rendered, exactly the same reasoning `PlanStore` uses for rendering
 * nothing at all.
 *
 * Styled by hand to match `components/Button.tsx`'s "danger" variant rather
 * than rendering `<Button>` itself: `Button` carries no "use client"
 * directive of its own (most of its call sites are plain Server Components),
 * so an `onClick` handed to it here would cross the server/client boundary
 * and fail. This is the one place in the plan journey that needs both the
 * button look and a real event handler on the same element.
 */
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { clearStoredPlan } from "./PlanStore";

export default function DeletePlanButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type="submit"
      onClick={() => {
        clearStoredPlan();
      }}
      className={clsx(
        "focus-halo inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-strong px-5 text-[0.95rem] font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:opacity-85",
        className
      )}
    >
      {children}
    </button>
  );
}
