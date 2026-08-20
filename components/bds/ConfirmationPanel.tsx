import clsx from "clsx";

import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * BIRSA Design System: `ConfirmationPanel` (REDESIGN-2.0 §5.1 item 4,
 * manifest `Panel` usage note, service cluster).
 *
 * Shown once, immediately after a service accepts a submission. Carries the
 * reference number, and the reference number is deliberately the single
 * largest piece of text on the page (`text-display-1`, larger than the
 * `<h1>` above it), because §8 heuristic 6 names this the mitigation for
 * BIRSA's status lookup having no account to fall back on: "recognition
 * rather than recall" fails the moment the reference number scrolls past
 * unnoticed.
 *
 * `saveReferenceMessage` IS NOT OPTIONAL FLAVOUR TEXT. It exists because
 * `StatusLookup` (this cluster) will later ask the reader for this exact
 * number and there is no account to recover it from if it is lost
 * (`lib/services/defineService.ts`, no login anywhere in the chassis). Pass
 * copy that says so explicitly, e.g. "Save this reference number. You will
 * need it to check your request, because BIRSA services do not use
 * accounts," not a generic "please keep a note of this."
 *
 * The manifest describes this as "wrapping `Panel`", the `status` cluster's
 * component. `Panel` does not exist in this checkout yet at the time this
 * component was built (Wave 2 cluster boundary: `status` is a different
 * agent's owned path), so this renders its own equivalent surface rather
 * than importing a file that is not there. THE SEAM: once `Panel` ships,
 * whichever wave next touches this file should replace the `<div>` below
 * with `<Panel>`, keeping this component's props exactly as they are, since
 * the props are the actual contract Wave 4A's confirmation route needs.
 *
 * HEADING ORDER: page-level. Renders the page's own `<h1>` from `heading`.
 */
export type ConfirmationPanelProps = {
  /** e.g. "Request received", "Your report has been sent". */
  heading: string;
  /** The reference number itself, exactly as issued, never reformatted. */
  reference: string;
  /** e.g. "Your reference number". */
  referenceLabel: string;
  /** Explicit instruction to save the reference. See the note above. */
  saveReferenceMessage: string;
  /** The service standard in the reader's own words, e.g. "We aim to reply within 48 hours." Optional: not every confirmation has one yet to state. */
  standardMessage?: string;
  /** "What happens next" content, rendered below the save-reference instruction. */
  children?: React.ReactNode;
  className?: string;
};

export default function ConfirmationPanel({
  heading,
  reference,
  referenceLabel,
  saveReferenceMessage,
  standardMessage,
  children,
  className,
}: ConfirmationPanelProps) {
  return (
    <Stack gap="lg" className={clsx(className)}>
      <div className="rounded-xl bg-forest px-6 py-10 text-center text-white sm:px-10">
        <Heading level={1} step="heading-2" className="text-white">
          {heading}
        </Heading>
        <Text step="body" className="mt-3 text-white/90">
          {referenceLabel}
        </Text>
        <Text as="p" step="display-1" className="mt-1 font-bold break-all text-white">
          {reference}
        </Text>
      </div>

      <Text step="body" className="font-semibold text-ink">
        {saveReferenceMessage}
      </Text>

      {standardMessage ? <Text step="body">{standardMessage}</Text> : null}

      {children}
    </Stack>
  );
}
