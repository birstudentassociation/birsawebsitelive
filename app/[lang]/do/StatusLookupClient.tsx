"use client";

import { useActionState } from "react";

import StatusLookup from "@/components/bds/StatusLookup";
import ErrorSummary from "@/components/bds/ErrorSummary";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import type { Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/i18n";
import type { StatusLookupState } from "@/app/[lang]/do/actions";

/**
 * The client half of `/do/[service]/status` (REDESIGN-2.0 §5.1 item 5).
 * Wraps `components/bds/StatusLookup.tsx` in `useActionState` so the same
 * page shows the "not found", rate-limited and success states without a
 * separate results route, then renders the found submission (never more
 * than its reference, status and submission date, since this component gets
 * only that far from `lib/services/status.ts`, never the answers
 * themselves) below the form.
 */
export type StatusLookupClientLabels = {
  heading: string;
  intro: string;
  referenceLabel: string;
  referenceHint: string;
  detailLabel: string;
  submitLabel: string;
  errorSummaryTitle: string;
  invalid: string;
  notFoundTitle: string;
  notFoundBody: string;
  errorTitle: string;
  errorBody: string;
  rateLimited: string;
  resultHeading: string;
  statusLabel: string;
  submittedLabel: string;
  statusText: { received: string; "in-progress": string; done: string };
};

export default function StatusLookupClient({
  locale,
  action,
  labels,
}: {
  locale: Locale;
  action: (prevState: StatusLookupState, formData: FormData) => Promise<StatusLookupState>;
  labels: StatusLookupClientLabels;
}) {
  const [state, formAction] = useActionState<StatusLookupState, FormData>(action, {
    status: "idle",
  });

  const errorMessage =
    state.status === "invalid"
      ? labels.invalid
      : state.status === "rate-limited"
        ? labels.rateLimited
        : state.status === "error"
          ? labels.errorTitle
          : undefined;

  return (
    <Stack gap="xl">
      {errorMessage ? (
        <ErrorSummary
          title={labels.errorSummaryTitle}
          errors={[{ id: "status-lookup-reference", message: errorMessage }]}
        />
      ) : null}

      <StatusLookup
        heading={labels.heading}
        intro={labels.intro}
        action={formAction}
        referenceLabel={labels.referenceLabel}
        referenceHint={labels.referenceHint}
        detailLabel={labels.detailLabel}
        submitLabel={labels.submitLabel}
      />

      {state.status === "not-found" ? (
        <Stack gap="sm">
          <Heading level={2} step="heading-2">
            {labels.notFoundTitle}
          </Heading>
          <Text step="body">{labels.notFoundBody}</Text>
        </Stack>
      ) : null}

      {state.status === "success" ? (
        <Stack gap="sm" className="rounded-lg border border-line p-6">
          <Heading level={2} step="heading-2">
            {labels.resultHeading}
          </Heading>
          <dl className="flex flex-col gap-2">
            <div>
              <dt>
                <Text as="span" step="body-sm" className="font-semibold text-ink">
                  {labels.referenceLabel}
                </Text>
              </dt>
              <dd>
                <Text as="span" step="body">
                  {state.submission.reference}
                </Text>
              </dd>
            </div>
            <div>
              <dt>
                <Text as="span" step="body-sm" className="font-semibold text-ink">
                  {labels.statusLabel}
                </Text>
              </dt>
              <dd>
                <Text as="span" step="body">
                  {labels.statusText[state.submission.status as keyof typeof labels.statusText]}
                </Text>
              </dd>
            </div>
            <div>
              <dt>
                <Text as="span" step="body-sm" className="font-semibold text-ink">
                  {labels.submittedLabel}
                </Text>
              </dt>
              <dd>
                <Text as="span" step="body">
                  {formatDate(locale, state.submission.createdAt)}
                </Text>
              </dd>
            </div>
          </dl>
        </Stack>
      ) : null}
    </Stack>
  );
}
