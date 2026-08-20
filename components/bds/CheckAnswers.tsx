import Link from "next/link";
import clsx from "clsx";

import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import VisuallyHidden from "@/components/bds/VisuallyHidden";

/**
 * BIRSA Design System: `CheckAnswers` (REDESIGN-2.0 §5.1 item 3, §4.3b
 * `check-answers`, service cluster).
 *
 * The last step before a service submits anything. Every answer the reader
 * gave is shown back to them, read-only, with a change link that goes back
 * to the exact question step (`lib/services/serviceSteps`).
 *
 * WCAG 3.3.7 (redundant entry): this component never re-asks a question it
 * is already showing the answer to. There is no input here at all, only
 * text and links; a `CheckAnswers` that rendered a form control would be
 * the defect this component exists to prevent.
 *
 * EVERY CHANGE LINK NAMES WHAT IT CHANGES. A row of five links that all say
 * bare "Change" is meaningless read out of a screen reader's link list, so
 * each link's accessible name is `${changeLabel} ${item.question}` (visible
 * "Change" plus the question text, appended visually hidden): "Change your
 * email address", not "Change". This is the GDS `check-answers` pattern's
 * own fix for the same problem `Card`'s stretched-link title solves for
 * listings (`components/bds/Card.tsx`), applied to summary rows instead.
 *
 * `answer` is `React.ReactNode` rather than a plain string so a caller can
 * render a joined list ("Basketball, Board games") for a `choose-several`
 * question, or a localised "Not answered" for an optional question left
 * blank, without this component needing to know about every question type
 * in `lib/services/questionTypes.ts`.
 *
 * HEADING ORDER: page-level. Renders the page's own `<h1>` from `heading`.
 */
export type CheckAnswersItem = {
  /** Stable key, typically the question's `id` from `lib/services/questionTypes.ts`. */
  id: string;
  /** The question text itself, exactly as the question page asked it. */
  question: string;
  /** The reader's answer, already formatted for display. */
  answer: React.ReactNode;
  /** The URL of the question step this answer came from. */
  changeHref: string;
};

export type CheckAnswersProps = {
  heading: string;
  intro?: string;
  items: CheckAnswersItem[];
  /** Visible text on every change link, e.g. "Change". */
  changeLabel: string;
  /**
   * Whatever follows the summary: a "Confirm and send" submit button, most
   * often wrapped around a server action supplied by the page. Submission
   * mechanics are `lib/services/intake.ts`'s job (Wave 4A), not this
   * component's; it only renders what it is given here.
   */
  children?: React.ReactNode;
  className?: string;
};

export default function CheckAnswers({
  heading,
  intro,
  items,
  changeLabel,
  children,
  className,
}: CheckAnswersProps) {
  return (
    <Stack gap="xl" className={clsx(className)}>
      <Stack gap="md">
        <Heading level={1}>{heading}</Heading>
        {intro ? <Text step="body">{intro}</Text> : null}
      </Stack>

      <dl className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-start sm:gap-4"
          >
            <dt>
              <Text as="span" step="body" className="font-semibold text-ink">
                {item.question}
              </Text>
            </dt>
            <dd>
              <Text as="span" step="body">
                {item.answer}
              </Text>
            </dd>
            <dd>
              <Link
                href={item.changeHref}
                className="focus-halo inline-flex min-h-11 items-center text-brand-deep underline underline-offset-2"
              >
                <Text as="span" step="body">
                  {changeLabel}
                </Text>{" "}
                <VisuallyHidden>{item.question}</VisuallyHidden>
              </Link>
            </dd>
          </div>
        ))}
      </dl>

      {children}
    </Stack>
  );
}
