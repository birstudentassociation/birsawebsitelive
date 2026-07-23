import type { Locale } from "@/lib/i18n";
import type { OnboardingTrack } from "@/content/onboarding";
import { onboardingUiCopy } from "@/content/onboarding";
import StepTasksClient, {
  OnboardingProgress,
  OnboardingProvider,
} from "@/components/onboarding/StepTasksClient";

export type StepByStepProps = {
  locale: Locale;
  track: OnboardingTrack;
};

/**
 * GOV.UK-style "step by step" navigation for one onboarding track: a
 * numbered, connected list of steps, each a native `<details>` disclosure
 * (closed by default, no JS required) containing a short blurb and the
 * step's tasks. Fully readable and navigable with JavaScript disabled —
 * every task is a real link or plain text; `StepTasksClient` only adds
 * checkboxes and the progress/reset panel once mounted in the browser.
 *
 * Each step's `<summary>` contains exactly one heading element (an `<h2>`)
 * per its content model (`summary` accepts either phrasing content, or a
 * single heading-content element) — that keeps the disclosure's visible
 * label doubling as a real, navigable heading for screen reader users,
 * without producing invalid heading-inside-inline-content markup.
 */
export default function StepByStep({ locale, track }: StepByStepProps) {
  const t = onboardingUiCopy[locale];
  const totalTasks = track.steps.reduce((sum, step) => sum + step.tasks.length, 0);

  return (
    <OnboardingProvider audience={track.audience}>
      <div className="flex flex-col gap-6">
        <OnboardingProgress locale={locale} totalTasks={totalTasks} />

        <ol className="flex flex-col">
          {track.steps.map((step, index) => {
            const isLast = index === track.steps.length - 1;
            const stepLabel = `${t.step} ${index + 1}`;

            return (
              <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                <div
                  aria-hidden="true"
                  className="relative flex w-10 flex-none flex-col items-center self-stretch"
                >
                  <span className="border-brand bg-surface text-ink font-display flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 text-base font-semibold">
                    {index + 1}
                  </span>
                  {!isLast ? (
                    <span className="bg-line-strong absolute top-10 bottom-0 left-1/2 w-0.5 -translate-x-1/2" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-2">
                  {step.connector ? (
                    <p className="border-line-strong text-muted bg-sunken mb-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                      {t[step.connector]}
                    </p>
                  ) : null}

                  <details className="group border-line bg-surface rounded-lg border open:shadow-sm">
                    <summary className="focus-halo flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-lg px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
                      <h2 className="font-display text-ink flex flex-1 items-center justify-between gap-3 text-lg leading-snug">
                        <span>
                          <span className="text-muted mr-2 text-sm font-semibold tracking-wide uppercase">
                            {stepLabel}
                          </span>
                          {step.title[locale]}
                        </span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          className="text-muted h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
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
                      </h2>
                    </summary>
                    <div className="border-line flex flex-col gap-3 border-t px-4 py-4">
                      {step.blurb ? (
                        <p className="text-muted text-[0.95rem] leading-relaxed">
                          {step.blurb[locale]}
                        </p>
                      ) : null}
                      <StepTasksClient
                        stepId={step.id}
                        locale={locale}
                        audience={track.audience}
                        tasks={step.tasks.map((task) => ({
                          id: task.id,
                          label: task.label[locale],
                          hint: task.hint?.[locale],
                          href: task.href,
                          external: task.external,
                        }))}
                      />
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
