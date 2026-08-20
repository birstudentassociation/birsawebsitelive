import clsx from "clsx";

import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * BIRSA Design System: `StatusLookup` (REDESIGN-2.0 §5.1 item 5, service
 * cluster).
 *
 * WHAT THIS REPLACES: BIRSA refuses student accounts outright (§4.3b names
 * `create-accounts`, `create-a-username` and `passwords` as patterns
 * deliberately not adopted; roadmap §6: "every proposal above works with a
 * reference number and no account"). `StatusLookup` is the thing that makes
 * that refusal survivable: a reference number PLUS ONE CORROBORATING DETAIL
 * (an email address, a phone number, a student ID, whatever the owning
 * service considers safe to ask for) is enough to check a request's status
 * without ever creating a login.
 *
 * BOTH FIELDS ARE REQUIRED, ALWAYS. A reference number alone is a
 * six-to-eight character string a second person could plausibly guess or
 * have seen over someone's shoulder; requiring a corroborating detail too
 * is what keeps this a lookup rather than an open door. Both `<input>`s
 * below carry `required`, so a plain HTML submit with JavaScript off is
 * already unable to reach the server missing either one. The server-side
 * handler (Wave 4A's `lib/services/status.ts`) must still re-validate: HTML
 * `required` is a courtesy to the reader, never the actual security
 * boundary, since it can trivially be removed by a browser's dev tools.
 *
 * NO ACCOUNT, EVER. This component does not accept a password, a session,
 * or a "remember me" option, and never will: adding any of those would be
 * rebuilding the account pattern this component exists to avoid.
 *
 * `action` accepts the same union React's own `<form action>` does: a
 * plain string URL (a normal GET/POST target, works with JavaScript off) or
 * a function (a Next.js Server Action, which Next.js progressively
 * enhances with a real no-JS form fallback on its own). Either way this
 * stays a genuine `<form>`, never a client-side fetch wired to a
 * `<button onClick>`, so BUILD-BRIEF-2.0 §7's "forms work with JavaScript
 * off" holds without this component needing its own client-side code at
 * all.
 *
 * HEADING ORDER: page-level. Renders the page's own `<h1>` from `heading`.
 */
export type StatusLookupProps = {
  heading: string;
  intro?: string;
  action: string | ((formData: FormData) => void | Promise<void>);
  referenceLabel: string;
  referenceHint?: string;
  /** The corroborating detail's question, e.g. "Email address you used". */
  detailLabel: string;
  detailHint?: string;
  /** The native input type for the corroborating detail. Defaults to plain text. */
  detailType?: "text" | "email" | "tel";
  submitLabel: string;
  className?: string;
};

export default function StatusLookup({
  heading,
  intro,
  action,
  referenceLabel,
  referenceHint,
  detailLabel,
  detailHint,
  detailType = "text",
  submitLabel,
  className,
}: StatusLookupProps) {
  const referenceHintId = referenceHint ? "status-lookup-reference-hint" : undefined;
  const detailHintId = detailHint ? "status-lookup-detail-hint" : undefined;

  return (
    <Stack gap="xl" className={clsx(className)}>
      <Stack gap="md">
        <Heading level={1}>{heading}</Heading>
        {intro ? <Text step="body">{intro}</Text> : null}
      </Stack>

      <form action={action}>
        <Stack gap="lg">
          <Stack gap="2xs" as="div">
            <label htmlFor="status-lookup-reference">
              <Text as="span" step="body" className="font-semibold text-ink">
                {referenceLabel}
              </Text>
            </label>
            {referenceHint ? (
              <div id={referenceHintId}>
                <Text as="p" step="body-sm" className="text-muted">
                  {referenceHint}
                </Text>
              </div>
            ) : null}
            <input
              id="status-lookup-reference"
              name="reference"
              type="text"
              required
              autoComplete="off"
              aria-describedby={referenceHintId}
              className="focus-halo h-11 w-full rounded-lg border border-input-border bg-surface px-3 text-body text-ink"
            />
          </Stack>

          <Stack gap="2xs" as="div">
            <label htmlFor="status-lookup-detail">
              <Text as="span" step="body" className="font-semibold text-ink">
                {detailLabel}
              </Text>
            </label>
            {detailHint ? (
              <div id={detailHintId}>
                <Text as="p" step="body-sm" className="text-muted">
                  {detailHint}
                </Text>
              </div>
            ) : null}
            <input
              id="status-lookup-detail"
              name="detail"
              type={detailType}
              required
              autoComplete="off"
              aria-describedby={detailHintId}
              className="focus-halo h-11 w-full rounded-lg border border-input-border bg-surface px-3 text-body text-ink"
            />
          </Stack>

          <div>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </Stack>
      </form>
    </Stack>
  );
}
