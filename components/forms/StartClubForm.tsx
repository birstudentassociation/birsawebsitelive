"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Email from "@/components/Email";
import Field from "@/components/Field";
import SummaryRow from "@/components/forms/SummaryRow";
import type { StartClubDraft, CheckState } from "@/app/[lang]/clubs/start/actions";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { buildStartClubWizardLabels } from "@/components/forms/startClubWizardCopy";
import { buildWizardChromeLabels } from "@/components/forms/wizardChromeCopy";

export type StartClubCheckFormProps = {
  locale: Locale;
  dict: Dictionary;
  draft: StartClubDraft;
  action: (prevState: CheckState, formData: FormData) => Promise<CheckState>;
};

const initialState: CheckState = { status: "idle" };

/**
 * Final "check your answers" step of the start-a-club journey: lists every
 * answer collected across the previous steps, each with a "change" link
 * that re-enters that step and returns here, then submits via the
 * `submitStartClubCheck` server action. Posts with a plain form so it works
 * without JavaScript; `useActionState` progressively enhances it with an
 * inline result and focus management, the same pattern as the contact form.
 */
export default function StartClubForm({ locale, dict, draft, action }: StartClubCheckFormProps) {
  const wizard = buildStartClubWizardLabels(locale);
  const chrome = buildWizardChromeLabels(locale);
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success" || state.status === "fallback") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  function buildDraftText(d: StartClubDraft): string {
    return [
      `${wizard.fieldLabels.name}: ${d.name ?? ""}`,
      `${wizard.fieldLabels.email}: ${d.email ?? ""}`,
      `${wizard.fieldLabels.clubName}: ${d.clubName ?? ""}`,
      d.members ? `${wizard.fieldLabels.members}: ${d.members}` : null,
      "",
      d.description ?? "",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
  }

  if (state.status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="focus-halo rounded-lg border-l-4 border-success bg-success-tint p-6 text-ink"
      >
        <p className="font-semibold">{wizard.successTitle}</p>
        <p className="mt-1 text-sm">{wizard.successBody}</p>
      </div>
    );
  }

  if (state.status === "fallback") {
    return (
      <div className="flex flex-col gap-4">
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="focus-halo rounded-lg border-l-4 border-warning bg-warning-tint p-6 text-ink"
        >
          <p className="font-semibold">{dict.form.fallbackTitle}</p>
          <p className="mt-1 text-sm">
            {dict.form.fallbackBody}{" "}
            <Email
              address="birsa@tu.ac.th"
              className="font-medium text-brand-deep hover:text-brand-dark"
            />{" "}
            /{" "}
            <Email
              address="birstudentassociation@gmail.com"
              className="font-medium text-brand-deep hover:text-brand-dark"
            />
          </p>
        </div>
        <Field
          as="textarea"
          name="draft"
          label={wizard.fieldLabels.description}
          value={buildDraftText(state.draft)}
          readOnly
          rows={8}
        />
      </div>
    );
  }

  // The clubName step lives at the journey's entry URL (/clubs/start), not
  // /clubs/start/clubName, so it needs its own href rather than the generic
  // step-name pattern the other four fields use.
  const clubNameHref = localeHref(locale, "/clubs/start?returnTo=check");
  const stepHref = (step: string) => localeHref(locale, `/clubs/start/${step}?returnTo=check`);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" ? <Notice variant="error">{dict.form.genericError}</Notice> : null}

      <dl className="divide-y divide-line rounded-lg border border-line">
        <SummaryRow
          label={wizard.checkClubNameLabel}
          value={draft.clubName ?? ""}
          changeHref={clubNameHref}
          changeLabel={chrome.change}
        />
        <SummaryRow
          label={wizard.checkMembersLabel}
          value={draft.members?.trim() || wizard.checkMembersEmpty}
          changeHref={stepHref("members")}
          changeLabel={chrome.change}
        />
        <SummaryRow
          label={wizard.checkDescriptionLabel}
          value={draft.description ?? ""}
          changeHref={stepHref("description")}
          changeLabel={chrome.change}
        />
        <SummaryRow
          label={wizard.checkNameLabel}
          value={draft.name ?? ""}
          changeHref={stepHref("name")}
          changeLabel={chrome.change}
        />
        <SummaryRow
          label={wizard.checkEmailLabel}
          value={draft.email ?? ""}
          changeHref={stepHref("email")}
          changeLabel={chrome.change}
        />
      </dl>

      {/* Honeypot: real visitors never see or fill this. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-nickname`}>Leave this field empty</label>
        <input
          id={`${formId}-nickname`}
          name="nickname"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? wizard.sending : wizard.send}
        </Button>
        {isPending ? (
          <span role="status" className="sr-only">
            {wizard.sending}
          </span>
        ) : null}
      </div>
    </form>
  );
}
