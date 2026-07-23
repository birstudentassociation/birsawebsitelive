"use client";

/**
 * Progressive-enhancement layer for the onboarding step by step
 * (`components/onboarding/StepByStep.tsx`). Everything server-rendered here
 * (structure, headings, blurb, plain task links) is real, navigable content;
 * this file only adds the optional checkbox + persisted-progress experience
 * on top of it once JavaScript has run.
 *
 * State lives in a small React context (`OnboardingProvider`) so the one
 * "done count" / reset button at the top of the page and every step's task
 * list stay in sync, backed by a single `localStorage` array of done task
 * ids per audience (key `birsa-onboarding-<audience>`). All storage access
 * is wrapped in try/catch: private browsing / disabled storage must never
 * break the page, it just means progress won't persist across visits.
 *
 * Hydration safety follows the same `mounted` gate as `ThemeToggle.tsx`:
 * before mount, state is empty (matching the server-rendered markup exactly,
 * since a server has no localStorage to read), so there is no
 * client/server markup mismatch. Checkboxes only appear once `mounted` is
 * true, i.e. once an effect has actually run in the browser.
 */
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import ExternalLink from "@/components/ExternalLink";
import VisuallyHidden from "@/components/VisuallyHidden";
import { localeHref, type Locale } from "@/lib/i18n";
import { onboardingUiCopy, type OnboardingAudience } from "@/content/onboarding";

// ---------------------------------------------------------------------------
// Shared state: one provider per track, read by every task list plus the
// progress/reset panel.
// ---------------------------------------------------------------------------

type OnboardingContextValue = {
  mounted: boolean;
  doneIds: Record<string, boolean>;
  toggle: (taskId: string) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function storageKeyFor(audience: OnboardingAudience): string {
  return `birsa-onboarding-${audience}`;
}

function readDoneIds(key: string): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return {};
    const next: Record<string, boolean> = {};
    for (const id of parsed) {
      if (typeof id === "string") next[id] = true;
    }
    return next;
  } catch {
    // Storage unavailable (private mode, disabled, quota, corrupt JSON):
    // fall back to "nothing done" rather than breaking the page.
    return {};
  }
}

function writeDoneIds(key: string, doneIds: Record<string, boolean>): void {
  try {
    const ids = Object.keys(doneIds).filter((id) => doneIds[id]);
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Ignore: progress just won't persist for this visit.
  }
}

export type OnboardingProviderProps = {
  audience: OnboardingAudience;
  children: React.ReactNode;
};

/** Wraps a whole track's step by step page; provides the shared done-state. */
export function OnboardingProvider({ audience, children }: OnboardingProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [doneIds, setDoneIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDoneIds(readDoneIds(storageKeyFor(audience)));
    setMounted(true);
  }, [audience]);

  const toggle = (taskId: string) => {
    setDoneIds((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      writeDoneIds(storageKeyFor(audience), next);
      return next;
    });
  };

  const reset = () => {
    setDoneIds({});
    try {
      window.localStorage.removeItem(storageKeyFor(audience));
    } catch {
      // Ignore: nothing to clear if storage was never available.
    }
  };

  return (
    <OnboardingContext.Provider value={{ mounted, doneIds, toggle, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("Onboarding components must be rendered inside <OnboardingProvider>.");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Progress line + reset button. Purely a JS-era enhancement (there is
// nothing to report or reset without JavaScript), so it renders nothing
// until mounted.
// ---------------------------------------------------------------------------

export type OnboardingProgressProps = {
  locale: Locale;
  totalTasks: number;
};

export function OnboardingProgress({ locale, totalTasks }: OnboardingProgressProps) {
  const { mounted, doneIds, reset } = useOnboarding();
  if (!mounted) return null;

  const t = onboardingUiCopy[locale];
  const done = Object.values(doneIds).filter(Boolean).length;

  return (
    <div className="border-line bg-sunken flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
      <p role="status" className="text-ink text-sm font-medium">
        {t.progressLine(done, totalTasks)}
      </p>
      <button
        type="button"
        onClick={reset}
        className="focus-halo border-line-strong text-ink hover:bg-surface flex h-11 items-center rounded-lg border px-4 text-sm font-semibold"
      >
        {t.resetLabel}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-step task checklist.
// ---------------------------------------------------------------------------

export type LocalizedTask = {
  id: string;
  label: string;
  hint?: string;
  href?: string;
  external?: boolean;
};

export type StepTasksClientProps = {
  stepId: string;
  locale: Locale;
  audience: OnboardingAudience;
  tasks: LocalizedTask[];
};

function TaskLink({
  task,
  locale,
  newTabLabel,
  className,
}: {
  task: LocalizedTask;
  locale: Locale;
  newTabLabel: string;
  className?: string;
}) {
  if (!task.href) return <span className={className}>{task.label}</span>;
  if (task.external) {
    return (
      <ExternalLink href={task.href} newTabLabel={newTabLabel} className={className}>
        {task.label}
      </ExternalLink>
    );
  }
  return (
    <Link href={localeHref(locale, task.href)} className={className}>
      {task.label}
    </Link>
  );
}

/** Progressively enhances one step's task list with persisted checkboxes. */
export default function StepTasksClient({ stepId, locale, audience, tasks }: StepTasksClientProps) {
  const { mounted, doneIds, toggle } = useOnboarding();
  const t = onboardingUiCopy[locale];

  return (
    <ul className="flex flex-col">
      {tasks.map((task) => {
        const inputId = `onboarding-${audience}-${stepId}-${task.id}`;
        const hintId = task.hint ? `${inputId}-hint` : undefined;
        const isDone = mounted && Boolean(doneIds[task.id]);

        return (
          <li
            key={task.id}
            className="border-line flex items-start gap-3 border-t py-2 first:border-t-0"
          >
            {mounted ? (
              <label
                htmlFor={inputId}
                className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center"
              >
                <VisuallyHidden>{t.markDone(task.label)}</VisuallyHidden>
                <input
                  id={inputId}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(task.id)}
                  aria-describedby={hintId}
                  className="focus-halo accent-brand h-5 w-5"
                />
              </label>
            ) : // No-JS / pre-mount: no checkbox exists yet, so no space is
            // reserved for one — this keeps the plain-list fallback clean.
            null}
            <div className="min-w-0 flex-1 py-2.5">
              <div className={clsx("flex items-center gap-2", isDone && "text-muted")}>
                {isDone ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="text-success h-4 w-4 shrink-0"
                  >
                    <path
                      d="M4 10.5 8 14l8-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
                <TaskLink
                  task={task}
                  locale={locale}
                  newTabLabel={t.newTab}
                  className={clsx(
                    "font-semibold",
                    task.href ? "text-brand-deep hover:text-brand-dark" : "text-ink",
                    isDone && "line-through decoration-2"
                  )}
                />
              </div>
              {task.hint ? (
                <p id={hintId} className="text-muted mt-1 text-sm leading-relaxed">
                  {task.hint}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
