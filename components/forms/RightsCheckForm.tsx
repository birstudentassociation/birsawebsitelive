"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import Email from "@/components/Email";
import Field from "@/components/Field";
import SummaryRow from "@/components/forms/SummaryRow";
import type { RightsDraft, CheckState } from "@/app/[lang]/privacy/your-data/actions";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { buildRightsWizardLabels } from "@/components/forms/rightsWizardCopy";
import { buildWizardChromeLabels } from "@/components/forms/wizardChromeCopy";
import { dataRights } from "@/content/privacy/register";

export type RightsCheckFormProps = {
  locale: Locale;
  dict: Dictionary;
  draft: RightsDraft;
  action: (prevState: CheckState, formData: FormData) => Promise<CheckState>;
};

const initialState: CheckState = { status: "idle" };

function rightLabel(locale: Locale, id: string | undefined): string {
  if (!id) return "";
  const right = dataRights.find((entry) => entry.id === id);
  return right ? right.name[locale] : id;
}

/**
 * Final "check your request" step of the `/privacy/your-data` PDPA rights
 * journey: lists every answer collected across the previous steps, each with
 * a "change" link that re-enters that step and returns here, then submits
 * via the `submitRightsCheck` server action. Posts with a plain form so it
 * works without JavaScript; `useActionState` progressively enhances it with
 * an inline result and focus management, the same pattern as
 * `components/forms/ContactForm.tsx`.
 *
 * Unlike the contact journey, there is no inline "success" state here: on
 * success the action redirects to `/privacy/your-data/sent`
 * (Post/Redirect/Get), so this component only ever needs to render the
 * "fallback" (email not configured) and "error" outcomes.
 */
export default function RightsCheckForm({ locale, dict, draft, action }: RightsCheckFormProps) {
  const wizard = buildRightsWizardLabels(locale);
  const chrome = buildWizardChromeLabels(locale);
  const formId = useId();
  const [state, formAction, isPending] = useActionState(action, initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "fallback") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  function buildDraftText(d: RightsDraft): string {
    return [
      `${wizard.checkWhatLabel}: ${rightLabel(locale, d.right)}`,
      `${wizard.checkNameLabel}: ${d.name ?? ""}`,
      `${wizard.checkEmailLabel}: ${d.email ?? ""}`,
      "",
      d.details ?? "",
    ].join("\n");
  }

  if (state.status === "fallback") {
    return (
      <div className="flex flex-col gap-4">
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="border-warning bg-warning-tint text-ink focus-halo rounded-lg border-l-4 p-6"
        >
          <p className="font-semibold">{dict.form.fallbackTitle}</p>
          <p className="mt-1 text-sm">
            {dict.form.fallbackBody}{" "}
            <Email
              address="birsa@tu.ac.th"
              className="text-brand-deep hover:text-brand-dark font-medium"
            />{" "}
            /{" "}
            <Email
              address="birstudentassociation@gmail.com"
              className="text-brand-deep hover:text-brand-dark font-medium"
            />
          </p>
        </div>
        <Field
          as="textarea"
          name="draft"
          label={wizard.checkDetailsLabel}
          value={buildDraftText(state.draft)}
          readOnly
          rows={8}
        />
      </div>
    );
  }

  const stepHref = (step: string) => localeHref(locale, `/privacy/your-data/${step}?returnTo=check`);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" ? <Notice variant="error">{dict.form.genericError}</Notice> : null}

      <dl className="border-line divide-line divide-y rounded-lg border">
        <SummaryRow
          label={wizard.checkWhatLabel}
          value={rightLabel(locale, draft.right)}
          changeHref={stepHref("what")}
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
        <SummaryRow
          label={wizard.checkDetailsLabel}
          value={draft.details?.trim() || wizard.checkDetailsEmpty}
          changeHref={stepHref("details")}
          changeLabel={chrome.change}
        />
      </dl>

      <p className="text-muted text-sm">{dict.form.privacyNote}</p>

      {/* Honeypot: real visitors never see or fill this field. Visually
          hidden, not display:none, so assistive tech that ignores CSS still
          gets an explicit instruction rather than a trap. */}
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
