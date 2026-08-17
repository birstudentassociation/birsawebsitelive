import Link from "next/link";

export type StepNavProps = {
  /** Where the "back" link points. Omit on the first step of a journey. */
  backHref?: string;
  backLabel: string;
  /** e.g. "Step 2 of 6", pre-rendered server-side (no client state needed). */
  progressText?: string;
};

/**
 * Plain server-rendered back link and step-progress text, shared by every
 * one-question-per-page step across the contact, start-a-club, equipment
 * loan request and loan status journeys. A real `<a>` link, not a client
 * "go back" handler, so it works identically with JavaScript on or off.
 */
export default function StepNav({ backHref, backLabel, progressText }: StepNavProps) {
  return (
    <div className="flex flex-col gap-2">
      {backHref ? (
        <Link
          href={backHref}
          className="w-fit text-sm font-medium text-brand-deep hover:text-brand-dark"
        >
          &larr; {backLabel}
        </Link>
      ) : null}
      {progressText ? <p className="text-sm text-muted">{progressText}</p> : null}
    </div>
  );
}
