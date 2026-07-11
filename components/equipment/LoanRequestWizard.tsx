"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Field from "@/components/Field";
import ErrorSummary, { type ErrorSummaryItem } from "@/components/ErrorSummary";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { inventoryLoanRequestSchema } from "@/lib/validation";
import { localeHref, type Locale } from "@/lib/i18n";
import type { LoanWizardItem, LoanWizardLabels, LoanWizardStep } from "@/components/equipment/loanWizardCopy";

export type LoanRequestWizardProps = {
  item: LoanWizardItem;
  locale: Locale;
  labels: LoanWizardLabels;
};

type FieldName = "studentName" | "studentId" | "studentEmail" | "phone" | "startDate" | "endDate" | "reason";

type Values = Record<FieldName, string> & { nickname: string };

type FieldErrors = Partial<Record<FieldName, string>>;

type SubmitState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; reference: string }
  | { status: "unavailable" }
  | { status: "blocklisted" }
  | { status: "limit-exceeded" }
  | { status: "not-configured" }
  | { status: "rate-limited" }
  | { status: "error" };

type DatesAvailability =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "checked"; available: number }
  | { status: "unavailable" }
  | { status: "error" };

// Steps that count towards the visible "Step X of Y" progress indicator.
// The start screen and the confirmation screen are not counted.
const QUESTION_STEPS: LoanWizardStep[] = [
  "name",
  "studentId",
  "email",
  "phone",
  "dates",
  "reason",
  "check",
];

// Base object schema without the cross-field refine, so individual fields
// can be validated one at a time as the user moves through the wizard.
const baseSchema = inventoryLoanRequestSchema.innerType();

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const SERVER_FIELD_TO_STEP: Record<string, LoanWizardStep> = {
  studentName: "name",
  studentId: "studentId",
  studentEmail: "email",
  phone: "phone",
  startDate: "dates",
  endDate: "dates",
  reason: "reason",
};

/**
 * GOV.UK-style one-question-per-page loan request flow: a "before you begin"
 * screen, one field per screen (a combined start/end date-range step checks
 * live availability before letting the user continue), a check-your-answers
 * summary, then a confirmation panel showing the reference number.
 */
export default function LoanRequestWizard({ item, locale, labels }: LoanRequestWizardProps) {
  const formId = useId();
  const [step, setStep] = useState<LoanWizardStep>("start");
  const [values, setValues] = useState<Values>({
    studentName: "",
    studentId: "",
    studentEmail: "",
    phone: "",
    startDate: "",
    endDate: "",
    reason: "",
    nickname: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [datesAvailability, setDatesAvailability] = useState<DatesAvailability>({ status: "idle" });
  const checkHeadingRef = useRef<HTMLHeadingElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Question steps use `autoFocus` on their field, but the check-answers and
  // confirmation steps have no single field to focus. Move focus to their
  // heading / result panel on entry so keyboard and screen-reader users aren't
  // dropped on <body> (2.4.3), and the success reference number is announced.
  useEffect(() => {
    if (step === "check") checkHeadingRef.current?.focus();
  }, [step]);
  useEffect(() => {
    if (step === "confirmation" && submitState.status === "success") {
      confirmationRef.current?.focus();
    }
  }, [step, submitState.status]);

  const catalogueHref = localeHref(locale, "/information-services/equipment-loan");
  const contactHref = localeHref(locale, "/contact");

  const fieldId = (name: FieldName) => `${formId}-${name}`;

  function setValue(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function goBack() {
    switch (step) {
      case "name":
        setStep("start");
        return;
      case "studentId":
        setStep("name");
        return;
      case "email":
        setStep("studentId");
        return;
      case "phone":
        setStep("email");
        return;
      case "dates":
        setStep("phone");
        return;
      case "reason":
        setStep("dates");
        return;
      case "check":
        setStep("reason");
        return;
      default:
        return;
    }
  }

  function stepProgress(target: LoanWizardStep): string {
    const index = QUESTION_STEPS.indexOf(target);
    if (index === -1) return "";
    return labels.common.stepOf
      .replace("{current}", String(index + 1))
      .replace("{total}", String(QUESTION_STEPS.length));
  }

  function validateName(): boolean {
    const value = values.studentName.trim();
    if (!baseSchema.shape.studentName.safeParse(value).success) {
      setErrors((prev) => ({ ...prev, studentName: labels.name.errorRequired }));
      return false;
    }
    setErrors((prev) => ({ ...prev, studentName: undefined }));
    return true;
  }

  function validateStudentId(): boolean {
    const value = values.studentId.trim();
    if (!baseSchema.shape.studentId.safeParse(value).success) {
      setErrors((prev) => ({ ...prev, studentId: labels.studentId.errorRequired }));
      return false;
    }
    setErrors((prev) => ({ ...prev, studentId: undefined }));
    return true;
  }

  function validateEmail(): boolean {
    const value = values.studentEmail.trim();
    if (value.length === 0) {
      setErrors((prev) => ({ ...prev, studentEmail: labels.email.errorRequired }));
      return false;
    }
    if (!baseSchema.shape.studentEmail.safeParse(value).success) {
      setErrors((prev) => ({ ...prev, studentEmail: labels.email.errorInvalid }));
      return false;
    }
    setErrors((prev) => ({ ...prev, studentEmail: undefined }));
    return true;
  }

  function validatePhone(): boolean {
    const value = values.phone.trim();
    if (value.length === 0) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
      return true;
    }
    if (!baseSchema.shape.phone.safeParse(value).success) {
      setErrors((prev) => ({ ...prev, phone: labels.phone.errorInvalid }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: undefined }));
    return true;
  }

  function validateDates(): boolean {
    let ok = true;
    const start = values.startDate;
    const end = values.endDate;

    if (start.length === 0) {
      setErrors((prev) => ({ ...prev, startDate: labels.dates.errorStartRequired }));
      ok = false;
    } else if (!baseSchema.shape.startDate.safeParse(start).success) {
      setErrors((prev) => ({ ...prev, startDate: labels.dates.errorStartInvalid }));
      ok = false;
    } else if (start < todayISO()) {
      setErrors((prev) => ({ ...prev, startDate: labels.dates.errorStartPast }));
      ok = false;
    } else {
      setErrors((prev) => ({ ...prev, startDate: undefined }));
    }

    if (end.length === 0) {
      setErrors((prev) => ({ ...prev, endDate: labels.dates.errorEndRequired }));
      ok = false;
    } else if (!baseSchema.shape.endDate.safeParse(end).success) {
      setErrors((prev) => ({ ...prev, endDate: labels.dates.errorEndInvalid }));
      ok = false;
    } else if (start.length > 0 && end < start) {
      setErrors((prev) => ({ ...prev, endDate: labels.dates.errorEndBeforeStart }));
      ok = false;
    } else if (start.length > 0 && end > addDaysISO(start, item.maxLoanDays)) {
      setErrors((prev) => ({ ...prev, endDate: labels.dates.errorTooLong }));
      ok = false;
    } else {
      setErrors((prev) => ({ ...prev, endDate: undefined }));
    }

    return ok;
  }

  async function checkDatesAvailability() {
    setDatesAvailability({ status: "checking" });
    try {
      const params = new URLSearchParams({
        itemKey: item.key,
        start: values.startDate,
        end: values.endDate,
      });
      const response = await fetch(`/api/loans/availability?${params.toString()}`);
      const body = (await response.json()) as {
        ok: boolean;
        available?: number;
      };
      if (!body.ok) {
        setDatesAvailability({ status: "error" });
        return;
      }
      const available = body.available ?? 0;
      if (available > 0) {
        setDatesAvailability({ status: "checked", available });
      } else {
        setDatesAvailability({ status: "unavailable" });
      }
    } catch {
      setDatesAvailability({ status: "error" });
    }
  }

  function handleStepSubmit(event: FormEvent<HTMLFormElement>, current: LoanWizardStep) {
    event.preventDefault();

    if (current === "start") {
      setStep("name");
      return;
    }
    if (current === "name") {
      if (validateName()) setStep("studentId");
      return;
    }
    if (current === "studentId") {
      if (validateStudentId()) setStep("email");
      return;
    }
    if (current === "email") {
      if (validateEmail()) setStep("phone");
      return;
    }
    if (current === "phone") {
      if (validatePhone()) setStep("dates");
      return;
    }
    if (current === "dates") {
      if (datesAvailability.status === "checked" && datesAvailability.available > 0) {
        setStep("reason");
        return;
      }
      if (!validateDates()) return;
      void checkDatesAvailability();
      return;
    }
    if (current === "reason") {
      setErrors((prev) => ({ ...prev, reason: undefined }));
      setStep("check");
      return;
    }
    if (current === "check") {
      void submitRequest();
    }
  }

  async function submitRequest() {
    setSubmitState({ status: "pending" });

    try {
      const response = await fetch("/api/loans/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemKey: item.key,
          studentName: values.studentName.trim(),
          studentId: values.studentId.trim(),
          studentEmail: values.studentEmail.trim(),
          phone: values.phone.trim(),
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.reason.trim(),
          nickname: values.nickname,
        }),
      });
      const body = (await response.json()) as {
        ok: boolean;
        reference?: string;
        reason?: string;
        errors?: Record<string, string[] | undefined>;
      };

      if (body.ok) {
        setSubmitState({ status: "success", reference: body.reference ?? "" });
        setStep("confirmation");
        return;
      }

      if (body.reason === "validation") {
        const fieldErrors = body.errors ?? {};
        const firstField = Object.keys(SERVER_FIELD_TO_STEP).find(
          (key) => (fieldErrors[key]?.length ?? 0) > 0
        );
        if (firstField) {
          const message = fieldErrors[firstField]?.[0] ?? labels.common.errorSummaryTitle;
          setErrors((prev) => ({ ...prev, [firstField as FieldName]: message }));
          setStep(SERVER_FIELD_TO_STEP[firstField] ?? "check");
        }
        setSubmitState({ status: "idle" });
        return;
      }

      if (body.reason === "unavailable") {
        setSubmitState({ status: "unavailable" });
        return;
      }
      if (body.reason === "blocklisted") {
        setSubmitState({ status: "blocklisted" });
        return;
      }
      if (body.reason === "limit-exceeded") {
        setSubmitState({ status: "limit-exceeded" });
        return;
      }
      if (body.reason === "not-configured") {
        setSubmitState({ status: "not-configured" });
        return;
      }
      if (body.reason === "rate-limited") {
        setSubmitState({ status: "rate-limited" });
        return;
      }
      setSubmitState({ status: "error" });
    } catch {
      setSubmitState({ status: "error" });
    }
  }

  function errorItemsFor(names: FieldName[]): ErrorSummaryItem[] {
    return names
      .filter((name) => Boolean(errors[name]))
      .map((name) => ({ id: fieldId(name), message: errors[name] as string }));
  }

  // Terminal / interruption states from the server take over the whole
  // wizard body regardless of which question step the user was on.
  if (submitState.status === "unavailable") {
    return (
      <ResultPanel
        variant="warning"
        title={labels.results.unavailableTitle}
        body={<p>{labels.results.unavailableBody}</p>}
        actionHref={catalogueHref}
        actionLabel={labels.results.backToCatalogue}
      />
    );
  }

  if (submitState.status === "blocklisted") {
    return (
      <ResultPanel
        variant="error"
        title={labels.results.blocklistedTitle}
        body={<p>{labels.results.blocklistedBody}</p>}
        actionHref={contactHref}
        actionLabel={labels.results.contactLink}
      />
    );
  }

  if (submitState.status === "limit-exceeded") {
    return (
      <ResultPanel
        variant="warning"
        title={labels.results.limitExceededTitle}
        body={<p>{labels.results.limitExceededBody}</p>}
        actionHref={contactHref}
        actionLabel={labels.results.contactLink}
      />
    );
  }

  if (submitState.status === "not-configured") {
    return (
      <ResultPanel
        variant="info"
        title={labels.results.notConfiguredTitle}
        body={
          <p>
            {labels.results.notConfiguredBody}{" "}
            <Link href={contactHref} className="text-brand-deep hover:text-brand-dark font-semibold underline">
              {labels.results.contactLink}
            </Link>
            .
          </p>
        }
        actionHref={catalogueHref}
        actionLabel={labels.results.backToCatalogue}
      />
    );
  }

  if (submitState.status === "rate-limited") {
    return (
      <ResultPanel
        variant="warning"
        title={labels.results.rateLimitedTitle}
        body={<p>{labels.results.rateLimitedBody}</p>}
        onRetry={() => setSubmitState({ status: "idle" })}
        retryLabel={labels.results.tryAgain}
      />
    );
  }

  if (submitState.status === "error") {
    return (
      <ResultPanel
        variant="error"
        title={labels.results.errorTitle}
        body={<p>{labels.results.errorBody}</p>}
        onRetry={() => setSubmitState({ status: "idle" })}
        retryLabel={labels.results.tryAgain}
      />
    );
  }

  if (step === "confirmation" && submitState.status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <div
          ref={confirmationRef}
          tabIndex={-1}
          role="status"
          className="border-success bg-success-tint text-ink focus-halo rounded-lg border-l-4 p-6"
        >
          <p className="font-display text-xl">{labels.confirmation.title}</p>
          {submitState.reference ? (
            <p className="mt-3 text-sm">
              <span className="font-semibold">{labels.confirmation.referenceLabel}: </span>
              <span className="font-mono text-base">{submitState.reference}</span>
            </p>
          ) : null}
        </div>
        <div>
          <h2 className="font-display text-lg">{labels.confirmation.nextStepsTitle}</h2>
          <ul className="text-muted mt-3 flex flex-col gap-2 text-sm leading-relaxed">
            {labels.confirmation.nextSteps.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span aria-hidden="true">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Button href={catalogueHref} variant="secondary">
            {labels.confirmation.backToCatalogue}
          </Button>
        </div>
      </div>
    );
  }

  if (step === "start") {
    return (
      <form onSubmit={(event) => handleStepSubmit(event, "start")} noValidate className="flex flex-col gap-6">
        <Link href={catalogueHref} className="text-brand-deep hover:text-brand-dark w-fit text-sm font-medium">
          &larr; {labels.start.backToCatalogue}
        </Link>
        <h2 className="font-display text-2xl sm:text-3xl">{labels.start.title}</h2>
        <p className="text-muted">{labels.start.intro}</p>
        <div className="border-line bg-sunken rounded-lg border p-5">
          <h3 className="text-ink text-base font-semibold">{labels.start.needTitle}</h3>
          <ul className="text-muted mt-2 list-inside list-disc space-y-1 text-sm">
            {labels.start.needItems.map((need) => (
              <li key={need}>{need}</li>
            ))}
          </ul>
        </div>
        <div className="border-line bg-sunken rounded-lg border p-5">
          <h3 className="text-ink text-base font-semibold">{labels.start.termsTitle}</h3>
          <p className="text-muted mt-2 text-sm">{labels.start.termsBody}</p>
        </div>
        <div>
          <Button type="submit">{labels.start.cta}</Button>
        </div>
      </form>
    );
  }

  const progress = stepProgress(step);
  const datesChecked = datesAvailability.status === "checked" && datesAvailability.available > 0;
  const datesChecking = datesAvailability.status === "checking";

  const primaryLabel =
    step === "check"
      ? submitState.status === "pending"
        ? labels.check.submitting
        : labels.check.submit
      : step === "dates"
        ? datesChecking
          ? labels.dates.checking
          : datesChecked
            ? labels.common.continueLabel
            : labels.dates.checkCta
        : labels.common.continueLabel;

  const primaryDisabled = submitState.status === "pending" || (step === "dates" && datesChecking);

  return (
    <form onSubmit={(event) => handleStepSubmit(event, step)} noValidate className="flex flex-col gap-6">
      <button
        type="button"
        onClick={goBack}
        className="text-brand-deep hover:text-brand-dark w-fit text-sm font-medium"
      >
        &larr; {labels.common.back}
      </button>
      {progress ? <p className="text-muted text-sm">{progress}</p> : null}

      {step === "name" ? (
        <>
          <ErrorSummary title={labels.common.errorSummaryTitle} errors={errorItemsFor(["studentName"])} />
          <h2 className="font-display text-2xl sm:text-3xl">{labels.name.question}</h2>
          <Field
            id={fieldId("studentName")}
            name="studentName"
            label={labels.name.question}
            className="sr-only-label"
            required
            requiredLabel={labels.common.required}
            value={values.studentName}
            onChange={(event) => setValue("studentName", event.target.value)}
            error={errors.studentName}
            autoComplete="name"
            autoFocus
          />
        </>
      ) : null}

      {step === "studentId" ? (
        <>
          <ErrorSummary title={labels.common.errorSummaryTitle} errors={errorItemsFor(["studentId"])} />
          <h2 className="font-display text-2xl sm:text-3xl">{labels.studentId.question}</h2>
          <Field
            id={fieldId("studentId")}
            name="studentId"
            label={labels.studentId.question}
            className="sr-only-label"
            hint={labels.studentId.hint}
            required
            requiredLabel={labels.common.required}
            value={values.studentId}
            onChange={(event) => setValue("studentId", event.target.value)}
            error={errors.studentId}
            autoComplete="off"
            autoFocus
          />
        </>
      ) : null}

      {step === "email" ? (
        <>
          <ErrorSummary title={labels.common.errorSummaryTitle} errors={errorItemsFor(["studentEmail"])} />
          <h2 className="font-display text-2xl sm:text-3xl">{labels.email.question}</h2>
          <Field
            id={fieldId("studentEmail")}
            name="studentEmail"
            type="email"
            label={labels.email.question}
            className="sr-only-label"
            hint={labels.email.hint}
            required
            requiredLabel={labels.common.required}
            value={values.studentEmail}
            onChange={(event) => setValue("studentEmail", event.target.value)}
            error={errors.studentEmail}
            autoComplete="email"
            autoFocus
          />
        </>
      ) : null}

      {step === "phone" ? (
        <>
          <ErrorSummary title={labels.common.errorSummaryTitle} errors={errorItemsFor(["phone"])} />
          <h2 className="font-display text-2xl sm:text-3xl">{labels.phone.question}</h2>
          <Field
            id={fieldId("phone")}
            name="phone"
            type="tel"
            label={labels.phone.question}
            className="sr-only-label"
            hint={labels.phone.hint}
            optionalLabel={labels.common.optional}
            value={values.phone}
            onChange={(event) => setValue("phone", event.target.value)}
            error={errors.phone}
            autoComplete="tel"
            autoFocus
          />
        </>
      ) : null}

      {step === "dates" ? (
        <>
          <ErrorSummary title={labels.common.errorSummaryTitle} errors={errorItemsFor(["startDate", "endDate"])} />
          <h2 className="font-display text-2xl sm:text-3xl">{labels.dates.title}</h2>
          <Field
            id={fieldId("startDate")}
            name="startDate"
            type="date"
            label={labels.dates.startQuestion}
            hint={labels.dates.startHint}
            required
            requiredLabel={labels.common.required}
            value={values.startDate}
            onChange={(event) => {
              setValue("startDate", event.target.value);
              setDatesAvailability({ status: "idle" });
            }}
            error={errors.startDate}
            min={todayISO()}
            autoFocus
          />
          <Field
            id={fieldId("endDate")}
            name="endDate"
            type="date"
            label={labels.dates.endQuestion}
            hint={labels.dates.endHint}
            required
            requiredLabel={labels.common.required}
            value={values.endDate}
            onChange={(event) => {
              setValue("endDate", event.target.value);
              setDatesAvailability({ status: "idle" });
            }}
            error={errors.endDate}
            min={values.startDate || todayISO()}
            max={values.startDate ? addDaysISO(values.startDate, item.maxLoanDays) : undefined}
          />

          {datesChecking ? (
            <p role="status" aria-live="polite" className="text-muted text-sm">
              {labels.dates.checking}
            </p>
          ) : null}
          {datesAvailability.status === "checked" ? (
            <Notice variant="success">
              <p role="status">
                {labels.dates.availableTemplate.replace("{count}", String(datesAvailability.available))}
              </p>
            </Notice>
          ) : null}
          {datesAvailability.status === "unavailable" ? (
            <Notice variant="warning" title={labels.dates.noneFreeTitle}>
              <p role="status">{labels.dates.noneFreeBody}</p>
            </Notice>
          ) : null}
          {datesAvailability.status === "error" ? (
            <Notice variant="error" title={labels.dates.checkErrorTitle}>
              <p role="status">{labels.dates.checkErrorBody}</p>
            </Notice>
          ) : null}
        </>
      ) : null}

      {step === "reason" ? (
        <>
          <h2 className="font-display text-2xl sm:text-3xl">{labels.reason.question}</h2>
          <Field
            id={fieldId("reason")}
            name="reason"
            as="textarea"
            label={labels.reason.question}
            className="sr-only-label"
            hint={labels.reason.hint}
            optionalLabel={labels.common.optional}
            value={values.reason}
            onChange={(event) => setValue("reason", event.target.value)}
            error={errors.reason}
            autoFocus
          />
          <p className="text-muted text-sm">{labels.reason.optionalNote}</p>
        </>
      ) : null}

      {step === "check" ? (
        <>
          <ErrorSummary title={labels.common.errorSummaryTitle} errors={errorItemsFor([])} />
          <h2
            ref={checkHeadingRef}
            tabIndex={-1}
            className="font-display focus-halo text-2xl sm:text-3xl"
          >
            {labels.check.title}
          </h2>
          <dl className="border-line divide-line divide-y rounded-lg border">
            <SummaryRow
              label={labels.check.itemLabel}
              value={item.name[locale]}
            />
            <SummaryRow
              label={labels.check.nameLabel}
              value={values.studentName}
              onChange={() => setStep("name")}
              changeLabel={labels.common.change}
            />
            <SummaryRow
              label={labels.check.studentIdLabel}
              value={values.studentId}
              onChange={() => setStep("studentId")}
              changeLabel={labels.common.change}
            />
            <SummaryRow
              label={labels.check.emailLabel}
              value={values.studentEmail}
              onChange={() => setStep("email")}
              changeLabel={labels.common.change}
            />
            <SummaryRow
              label={labels.check.phoneLabel}
              value={values.phone.trim() || labels.check.phoneEmpty}
              onChange={() => setStep("phone")}
              changeLabel={labels.common.change}
            />
            <SummaryRow
              label={labels.check.startDateLabel}
              value={values.startDate}
              onChange={() => setStep("dates")}
              changeLabel={labels.common.change}
            />
            <SummaryRow
              label={labels.check.endDateLabel}
              value={values.endDate}
              onChange={() => setStep("dates")}
              changeLabel={labels.common.change}
            />
            <SummaryRow
              label={labels.check.reasonLabel}
              value={values.reason.trim() || labels.check.reasonEmpty}
              onChange={() => setStep("reason")}
              changeLabel={labels.common.change}
            />
          </dl>

          {/* Honeypot: real visitors never see or fill this field. */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor={fieldId("reason") + "-nickname"}>Leave this field empty</label>
            <input
              id={fieldId("reason") + "-nickname"}
              name="nickname"
              type="text"
              autoComplete="off"
              tabIndex={-1}
              value={values.nickname}
              onChange={(event) => setValue("nickname" as FieldName, event.target.value)}
            />
          </div>
        </>
      ) : null}

      <div>
        <Button type="submit" disabled={primaryDisabled}>
          {primaryLabel}
        </Button>
        <span role="status" aria-live="polite" className="sr-only">
          {submitState.status === "pending" ? labels.check.submitting : ""}
        </span>
      </div>
    </form>
  );
}

function SummaryRow({
  label,
  value,
  onChange,
  changeLabel,
}: {
  label: string;
  value: string;
  onChange?: () => void;
  changeLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div>
        <dt className="text-ink text-sm font-semibold">{label}</dt>
        <dd className="text-muted mt-0.5 text-sm break-words">{value}</dd>
      </div>
      {onChange ? (
        <button
          type="button"
          onClick={onChange}
          className="text-brand-deep hover:text-brand-dark shrink-0 text-sm font-medium underline"
        >
          {changeLabel}
          <span className="sr-only"> {label}</span>
        </button>
      ) : null}
    </div>
  );
}

function ResultPanel({
  variant,
  title,
  body,
  actionHref,
  actionLabel,
  onRetry,
  retryLabel,
}: {
  variant: "info" | "warning" | "error";
  title: string;
  body: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Notice variant={variant} title={title}>
        {body}
      </Notice>
      <div className="flex gap-3">
        {onRetry ? (
          <Button type="button" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        {actionHref ? (
          <Button href={actionHref} variant={onRetry ? "secondary" : "primary"}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
