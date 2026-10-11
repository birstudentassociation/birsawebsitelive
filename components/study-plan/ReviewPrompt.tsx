"use client";

/**
 * "You finished PI280 last term. Two minutes to help next year's students?"
 * on the plan screen, and the same line in a course page's "Your plan" panel
 * for that course.
 *
 * Everything is worked out here, in the browser, from the plan and today's date
 * (`lib/study-plan/reviewPrompt.ts`), so the server renders nothing for it and
 * nothing is tracked: BIRSA is never told that a prompt was shown, followed or
 * dismissed. A dismissal is remembered per course in the stored plan envelope
 * on this device (`dismissedReviewPrompts`), written through the same
 * try/catch storage helpers as the rest of the plan, so blocked storage means
 * the prompt simply comes back next visit.
 *
 * `live` is whether the review form exists at all, which the server decides
 * from the same database configuration the form itself checks. Without it
 * nothing is shown, so a build with no database never asks for a review it
 * cannot take. A reader with JavaScript off sees nothing here, which is the
 * right failure: it is a reminder, not part of the service.
 */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  readStoredEnvelope,
  readStoredPlan,
  writeStoredEnvelope,
} from "@/components/study-plan/PlanStore";
import type { PlanLinkCopy } from "@/components/study-plan/planLinkCopy";
import { parseStoredPlans, type StudyPlan } from "@/lib/study-plan/plan";
import { reviewPromptCodes } from "@/lib/study-plan/reviewPrompt";
import { dismissReviewPrompt } from "@/lib/study-plan/scenarioStore";

export type ReviewPromptProps = {
  /** The plan to work from: the one on screen, or the one stored on this device. */
  plan: StudyPlan;
  /** Ask only about this course, as on its own page. Absent asks about every course in the term. */
  onlyCode?: string;
  /** Whether the review form is live. Nothing is shown when it is not. */
  live: boolean;
  copy: PlanLinkCopy["reviewPrompt"];
  /** The localised course page path without the code, e.g. "/en/student-life/course-reviews". */
  courseLinkBase: string;
};

function subscribe(onChange: () => void): () => void {
  // Another tab dismissing a prompt should update this one.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function noSubscription(): () => void {
  return () => {};
}

function getServerSnapshot(): string | null {
  return null;
}

export default function ReviewPrompt({
  plan,
  onlyCode,
  live,
  copy,
  courseLinkBase,
}: ReviewPromptProps) {
  // False on the server and during hydration, true once mounted, so the first
  // client render matches the server's empty one.
  const mounted = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  );
  const raw = useSyncExternalStore(subscribe, readStoredPlan, getServerSnapshot);
  const storedDismissals = useMemo(
    () => parseStoredPlans(raw)?.dismissedReviewPrompts ?? [],
    [raw]
  );
  // Read once, so the prompt does not change under the reader across a term boundary.
  const [now] = useState(() => new Date());
  const [dismissedHere, setDismissedHere] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status) statusRef.current?.focus();
  }, [status]);

  if (!live || !mounted) return null;

  const asked = reviewPromptCodes(plan, now, [...storedDismissals, ...dismissedHere]);
  const codes = onlyCode ? asked.filter((code) => code === onlyCode) : asked;

  function dismiss(code: string) {
    setDismissedHere((earlier) => [...earlier, code]);
    setStatus(copy.dismissedStatus.replace("{code}", code));
    const envelope = readStoredEnvelope();
    if (envelope) writeStoredEnvelope(dismissReviewPrompt(envelope, code));
  }

  if (codes.length === 0 && !status) return null;

  return (
    <div className="flex flex-col gap-3">
      {codes.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {codes.map((code) => (
              <li
                key={code}
                className="flex flex-col gap-1 rounded-lg border border-line bg-brand-tint p-4"
              >
                <p className="text-ink">{copy.template.replace("{code}", code)}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                  <Link
                    href={`${courseLinkBase}/${code}/review`}
                    className="inline-flex min-h-11 items-center font-semibold text-brand-deep hover:text-brand-dark"
                  >
                    {copy.writeLink}
                    <span className="sr-only"> {code}</span> &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={() => dismiss(code)}
                    className="focus-halo inline-flex min-h-11 items-center text-sm font-semibold text-muted underline underline-offset-2 hover:text-ink"
                  >
                    {copy.dismiss}
                    <span className="sr-only"> {code}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">{copy.note}</p>
        </>
      ) : null}
      {/* Announces a dismissal, and takes focus so it is not lost with the button that was pressed. */}
      <p
        ref={statusRef}
        role="status"
        tabIndex={-1}
        className={status ? "text-sm text-muted" : "sr-only"}
      >
        {status}
      </p>
    </div>
  );
}
