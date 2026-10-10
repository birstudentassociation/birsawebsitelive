"use client";

/**
 * The officer's summary editor: a "Draft summary" form that asks Claude for a
 * draft, and the bilingual form that publishes whatever is in it. Both are
 * server actions on plain forms, so the page works without JavaScript;
 * `useActionState` adds the inline draft, the error summary and focus
 * handling on top.
 *
 * The publish form is keyed by the draft's nonce, so a new draft replaces the
 * fields' defaults without losing an officer's edits to an earlier one until
 * they ask for another.
 */
import { useActionState, useEffect, useId, useRef } from "react";
import Button from "@/components/Button";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Field from "@/components/Field";
import Notice from "@/components/Notice";
import { fillTemplate } from "@/components/course-review/constants";
import {
  draftSummaryAction,
  publishSummaryAction,
  type DraftState,
  type PublishState,
} from "@/app/[lang]/officer/inventory/course-reviews/actions";
import type { ConsoleCopy } from "@/app/[lang]/officer/inventory/course-reviews/copy";
import {
  SUMMARY_LIMITS,
  SUMMARY_QUOTE_SLOTS,
  SUMMARY_TIP_SLOTS,
  summaryToFields,
  type SummaryFields,
} from "@/lib/course-review/summary-form";
import type { ReviewSummary } from "@/lib/course-review/published";
import type { Locale } from "@/lib/i18n";

export type SummaryEditorProps = {
  locale: Locale;
  /** The group id the forms act on, from `groupId` in lib/course-review/groups.ts. */
  group: string;
  copy: ConsoleCopy;
  /** The published summary to edit, or null to start empty. */
  initial: ReviewSummary | null;
  /** Whether a draft can be requested: `ANTHROPIC_API_KEY` is set. */
  canDraft: boolean;
  /** The workload band distribution in words, already in the officer's language. Read only. */
  bandLines: string[];
  published: boolean;
};

const idleDraft: DraftState = { status: "idle" };
const idlePublish: PublishState = { status: "idle" };

type Row = { base: string; label: string; limit: number; rows: number };

export default function SummaryEditor({
  locale,
  group,
  copy: t,
  initial,
  canDraft,
  bandLines,
  published,
}: SummaryEditorProps) {
  const formId = useId();
  const [draft, draftAction, isDrafting] = useActionState(draftSummaryAction, idleDraft);
  const [publish, publishAction, isPublishing] = useActionState(publishSummaryAction, idlePublish);
  const draftRef = useRef<HTMLDivElement>(null);
  const failedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (draft.status === "drafted" || draft.status === "failed") {
      draftRef.current?.focus();
    }
  }, [draft]);
  useEffect(() => {
    if (publish.status === "failed") failedRef.current?.focus();
  }, [publish]);

  // What the fields start with: whichever of the officer's last publish
  // attempt and the latest draft is newer, so a failed attempt keeps what they
  // typed and a fresh draft still replaces it; otherwise the published text.
  const attempt = publish.status === "invalid" || publish.status === "failed" ? publish : null;
  const latestDraft = draft.status === "drafted" ? draft : null;
  const useAttempt = attempt !== null && (latestDraft === null || attempt.at > latestDraft.nonce);
  const fields: SummaryFields = useAttempt
    ? attempt.fields
    : latestDraft
      ? summaryToFields(latestDraft.summary)
      : summaryToFields(initial);
  const errors = useAttempt && attempt.status === "invalid" ? attempt.errors : {};
  const fieldKey = `${latestDraft?.nonce ?? "initial"}-${useAttempt ? attempt.at : "fresh"}`;

  const errorMessage = (name: string, limit: number): string | undefined => {
    const code = errors[name];
    return code ? fillTemplate(t.errors[code], { max: limit }) : undefined;
  };

  const rows: Row[] = [
    { base: "workload", label: t.workloadField, limit: SUMMARY_LIMITS.text, rows: 4 },
    { base: "assessment", label: t.assessmentField, limit: SUMMARY_LIMITS.text, rows: 4 },
    ...Array.from({ length: SUMMARY_TIP_SLOTS }, (_, i) => ({
      base: `tip${i + 1}`,
      label: fillTemplate(t.tipField, { n: i + 1 }),
      limit: SUMMARY_LIMITS.tip,
      rows: 2,
    })),
    ...Array.from({ length: SUMMARY_QUOTE_SLOTS }, (_, i) => ({
      base: `quote${i + 1}`,
      label: fillTemplate(t.quoteField, { n: i + 1 }),
      limit: SUMMARY_LIMITS.quote,
      rows: 2,
    })),
  ];

  const errorItems: ErrorSummaryItem[] = rows.flatMap((row) =>
    (["en", "th"] as const).flatMap((lang) => {
      const message = errorMessage(`${row.base}_${lang}`, row.limit);
      return message
        ? [
            {
              id: `${formId}-${row.base}_${lang}`,
              message: `${row.label} (${lang === "en" ? t.englishHeading : t.thaiHeading}): ${message}`,
            },
          ]
        : [];
    })
  );

  const draftFailure = draft.status === "failed" ? t.draftFailed[draft.reason] : null;

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="draft-heading" className="flex flex-col gap-3">
        <h3 id="draft-heading" className="font-display text-lg text-ink">
          {t.draftTitle}
        </h3>
        {canDraft ? (
          <>
            <p className="max-w-[var(--measure)] text-sm text-muted">{t.draftBody}</p>
            <form action={draftAction} className="flex flex-col gap-3">
              <input type="hidden" name="group" value={group} />
              <input type="hidden" name="locale" value={locale} />
              <div>
                <Button type="submit" variant="secondary" disabled={isDrafting}>
                  {isDrafting ? t.draftingButton : t.draftButton}
                </Button>
                {isDrafting ? (
                  <span role="status" className="sr-only">
                    {t.draftingButton}
                  </span>
                ) : null}
              </div>
            </form>
          </>
        ) : (
          <Notice variant="info" title={t.draftUnavailableTitle}>
            {t.draftUnavailableBody}
          </Notice>
        )}
        {draft.status === "drafted" || draftFailure ? (
          <div ref={draftRef} tabIndex={-1} className="focus-halo">
            {draft.status === "drafted" ? (
              <Notice variant="success">{t.draftReady}</Notice>
            ) : (
              <Notice variant="error">{draftFailure}</Notice>
            )}
          </div>
        ) : null}
      </section>

      <section aria-labelledby="editor-heading" className="flex flex-col gap-4">
        <h3 id="editor-heading" className="font-display text-lg text-ink">
          {t.editorTitle}
        </h3>
        <p className="max-w-[var(--measure)] text-sm text-muted">{t.editorBody}</p>

        <form key={fieldKey} action={publishAction} noValidate className="flex flex-col gap-6">
          <input type="hidden" name="group" value={group} />
          <input type="hidden" name="locale" value={locale} />
          <input
            type="hidden"
            name="origin"
            value={draft.status === "drafted" ? "claude-draft" : "manual"}
          />

          <ErrorSummary title={t.errorSummaryTitle} errors={errorItems} />

          {publish.status === "failed" ? (
            <div ref={failedRef} tabIndex={-1} className="focus-halo">
              <Notice variant="error">{t.publishFailed[publish.reason]}</Notice>
            </div>
          ) : null}

          <div className="flex flex-col gap-1 text-sm">
            <h4 className="font-semibold text-ink">{t.bandsReadOnlyTitle}</h4>
            {bandLines.length === 0 ? (
              <p className="text-muted">{t.bandsReadOnlyNone}</p>
            ) : (
              <ul className="flex list-disc flex-col gap-0.5 pl-5 text-muted">
                {bandLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>

          {rows.map((row) => (
            <fieldset key={row.base} className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-semibold text-ink">{row.label}</legend>
              <div className="grid gap-4 md:grid-cols-2">
                {(["en", "th"] as const).map((lang) => (
                  <Field
                    key={lang}
                    id={`${formId}-${row.base}_${lang}`}
                    name={`${row.base}_${lang}`}
                    as="textarea"
                    label={lang === "en" ? t.englishHeading : t.thaiHeading}
                    lang={lang}
                    rows={row.rows}
                    maxLength={row.limit}
                    defaultValue={fields[`${row.base}_${lang}`]}
                    error={errorMessage(`${row.base}_${lang}`, row.limit)}
                  />
                ))}
              </div>
            </fieldset>
          ))}

          <div>
            <Button type="submit" disabled={isPublishing}>
              {isPublishing ? t.publishingButton : published ? t.updateButton : t.publishButton}
            </Button>
            {isPublishing ? (
              <span role="status" className="sr-only">
                {t.publishingButton}
              </span>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
