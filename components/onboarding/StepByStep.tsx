import type { Locale } from "@/lib/i18n";
import { onboardingUiCopy } from "@/content/onboarding";
import StepTasksClient, {
  OnboardingProgress,
  OnboardingProvider,
  type LocalizedTask,
} from "@/components/onboarding/StepTasksClient";

/** One step, already in the reader's language. */
export type LocalizedStep = {
  id: string;
  title: string;
  blurb?: string;
  connector?: "and" | "or";
  tasks: LocalizedTask[];
  /** Points to read rather than tick, shown after the tasks. */
  items?: string[];
};

export type StepByStepProps = {
  locale: Locale;
  steps: LocalizedStep[];
  /** localStorage key for the done task ids, e.g. `birsa-onboarding-home`. */
  storageKey: string;
  /** Prefix for checkbox ids, unique on the page. */
  idPrefix: string;
  /** Level of each step's heading: 2 on a page of steps, 3 inside a section. */
  headingLevel?: 2 | 3;
};

/**
 * GOV.UK-style "step by step" navigation, used for the onboarding tracks and
 * emergency guides: a
 * numbered, connected list of steps, each a native `<details>` disclosure
 * (closed by default, no JS required) containing a short blurb and the
 * step's tasks. Fully readable and navigable with JavaScript disabled:
 * every task is a real link or plain text; `StepTasksClient` only adds
 * checkboxes and the progress/reset panel once mounted in the browser.
 *
 * Each step's `<summary>` contains exactly one heading element (an `<h2>`)
 * per its content model (`summary` accepts either phrasing content, or a
 * single heading-content element), which keeps the disclosure's visible
 * label doubling as a real, navigable heading for screen reader users,
 * without producing invalid heading-inside-inline-content markup.
 */
export default function StepByStep({
  locale,
  steps,
  storageKey,
  idPrefix,
  headingLevel = 2,
}: StepByStepProps) {
  const t = onboardingUiCopy[locale];
  const totalTasks = steps.reduce((sum, step) => sum + step.tasks.length, 0);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <OnboardingProvider storageKey={storageKey}>
      <div className="flex flex-col gap-6">
        <OnboardingProgress locale={locale} totalTasks={totalTasks} />

        <ol className="flex flex-col">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const stepLabel = `${t.step} ${index + 1}`;

            return (
              <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                <div
                  aria-hidden="true"
                  className="relative flex w-10 flex-none flex-col items-center self-stretch"
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-brand bg-surface font-display text-base font-semibold text-ink">
                    {index + 1}
                  </span>
                  {!isLast ? (
                    <span className="absolute top-10 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-line-strong" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-2">
                  {step.connector ? (
                    <p className="mb-3 inline-flex items-center rounded-full border border-line-strong bg-sunken px-3 py-1 text-xs font-semibold tracking-wide text-muted uppercase">
                      {t[step.connector]}
                    </p>
                  ) : null}

                  <details className="group rounded-lg border border-line bg-surface open:shadow-sm">
                    <summary className="focus-halo flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-lg px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
                      <Heading className="flex flex-1 items-center justify-between gap-3 font-display text-lg leading-snug text-ink">
                        <span>
                          <span className="mr-2 text-sm font-semibold tracking-wide text-muted uppercase">
                            {stepLabel}
                          </span>
                          {step.title}
                        </span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                        >
                          <path
                            d="m5 7.5 5 5 5-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Heading>
                    </summary>
                    <div className="flex flex-col gap-3 border-t border-line px-4 py-4">
                      {step.blurb ? (
                        <p className="text-[0.95rem] leading-relaxed text-muted">{step.blurb}</p>
                      ) : null}
                      <StepTasksClient
                        stepId={step.id}
                        locale={locale}
                        idPrefix={idPrefix}
                        tasks={step.tasks}
                      />
                      {step.items?.length ? (
                        <ul className="flex list-disc flex-col gap-2 pl-6 text-[0.95rem] leading-relaxed text-ink">
                          {step.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </details>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </OnboardingProvider>
  );
}
