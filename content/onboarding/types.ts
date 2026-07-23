/**
 * Content model for "Starting at BIR: step by step" — a GOV.UK-style step by
 * step navigation for new BIR students, one track per audience. Copy is
 * authored natively in both languages inline (site convention: see
 * `content/student-life/tracks.ts` and the `copy` object in
 * `app/[lang]/student-life/page.tsx`), never through `content/dictionaries`.
 *
 * Progress is tracked client-side only (localStorage, keyed by audience);
 * nothing here concerns itself with persistence, which lives in
 * `components/onboarding/StepTasksClient.tsx`.
 */

/** A short string authored natively in both languages (not translated). */
export type Bi = { en: string; th: string };

export type OnboardingAudience = "home" | "international";

export type OnboardingTask = {
  /** Stable slug, unique within its track. Used as the localStorage key for
   * "done" state, so it must never change once published. */
  id: string;
  label: Bi;
  /** Optional supporting detail shown under the label. */
  hint?: Bi;
  /** Path relative to the locale root, e.g. "/student-life/home/shuttle-bus".
   * Never locale-prefixed — build the real link with `localeHref`. Omit for
   * a plain (non-linked) task. */
  href?: string;
  /** True when `href` is an absolute external URL (opens in a new tab). */
  external?: boolean;
};

export type OnboardingStep = {
  /** Stable slug, unique within its track. */
  id: string;
  title: Bi;
  /** Optional short description shown under the step title. */
  blurb?: Bi;
  /** GOV.UK-style "and"/"or" chip shown between this step and the previous
   * one. Omit on the first step (there is no previous step to relate to). */
  connector?: "and" | "or";
  tasks: OnboardingTask[];
};

export type OnboardingTrack = {
  audience: OnboardingAudience;
  title: Bi;
  lede: Bi;
  steps: OnboardingStep[];
};
