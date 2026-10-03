import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ErrorSummary from "@/components/ErrorSummary";
import VisuallyHidden from "@/components/VisuallyHidden";
import { GuideLink } from "@/components/emergency/GuideBlocks";
import { checkerCopy } from "@/content/emergency/claims/checker";
import { guidePartPath } from "@/content/emergency/claims";
import type { EmergencyGuide, EmergencyScenario } from "@/content/emergency/types";
import {
  answersQuery,
  assessClaims,
  multipleChoice,
  nextQuestion,
  questionOptions,
  questionSequence,
  type Answers,
  type ClaimItem,
  type QuestionId,
} from "@/lib/claims-check";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  scenario: EmergencyScenario;
  guide: EmergencyGuide;
  answers: Answers;
  /** The question the reader just submitted, from the hidden `s` field. */
  submitted?: string;
};

/**
 * The flood claims checker, one question per page. Every state is a GET URL,
 * so it works without JavaScript and each step can be bookmarked.
 */
export default function ClaimsChecker({ locale, scenario, guide, answers, submitted }: Props) {
  const dict = getDictionary(locale);
  const t = checkerCopy[locale];
  const base = localeHref(locale, `/emergency/${scenario.id}/${guide.slug}/check`);
  const part = (slug: string) =>
    guidePartPath(
      scenario.id,
      guide,
      guide.en.parts.findIndex((p) => p.slug === slug)
    );
  const current = nextQuestion(answers);
  const sequence = questionSequence(answers.home ? answers : { home: "bangkok" });

  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[
        { label: dict.emergencyPage.breadcrumb, href: "/emergency" },
        { label: scenario[locale].title, href: `/emergency/${scenario.id}` },
        { label: guide[locale].title, href: `/emergency/${scenario.id}/${guide.slug}` },
        { label: t.title },
      ]}
    />
  );

  if (current) {
    const index = sequence.indexOf(current);
    const q = t.questions[current];
    const multiple = multipleChoice.includes(current);
    const options = questionOptions[current] as readonly string[];
    const firstId = `${current}-${options[0]}`;
    const showError = submitted === current;
    const isEntry = index === 0;
    const prior = new URLSearchParams(answersQuery(answers, current).slice(1));
    const backHref = index > 0 ? `${base}${answersQuery(answers, sequence[index - 1])}` : null;
    const describedBy = [q.hint ? `${current}-hint` : null, showError ? `${current}-error` : null]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-6 py-10">
        {breadcrumbs}
        {showError ? (
          <ErrorSummary title={t.errorTitle} errors={[{ id: firstId, message: q.error }]} />
        ) : null}
        {isEntry ? (
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl sm:text-4xl">{t.title}</h1>
            <p className="text-lg leading-relaxed text-muted">{t.lede}</p>
          </div>
        ) : (
          <p className="text-sm font-medium text-muted">{t.title}</p>
        )}

        <form method="GET" action={base} className="flex flex-col gap-6">
          {[...prior.entries()].map(([name, value], i) => (
            <input key={i} type="hidden" name={name} value={value} />
          ))}
          <input type="hidden" name="s" value={current} />
          <fieldset className="flex flex-col gap-4" aria-describedby={describedBy || undefined}>
            <legend className="mb-1 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted">
                {t.questionOf(index + 1, sequence.length)}
              </span>
              {isEntry ? (
                <h2 className="font-display text-2xl">{q.question}</h2>
              ) : (
                <h1 className="font-display text-2xl sm:text-3xl">{q.question}</h1>
              )}
            </legend>
            {q.hint ? (
              <p id={`${current}-hint`} className="leading-relaxed text-muted">
                {q.hint}
              </p>
            ) : null}
            {showError ? (
              <p id={`${current}-error`} className="font-semibold text-error">
                <VisuallyHidden>{t.errorTitle}. </VisuallyHidden>
                {q.error}
              </p>
            ) : null}
            <div
              className={`flex flex-col gap-3 ${showError ? "border-l-4 border-error pl-4" : ""}`}
            >
              {options.map((option) => {
                const label = q.options[option]!;
                const id = `${current}-${option}`;
                return (
                  <div key={option} className="flex flex-col gap-3">
                    {multiple && option === "none" ? (
                      <p className="text-center text-sm font-semibold text-muted">{t.or}</p>
                    ) : null}
                    <label
                      htmlFor={id}
                      className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
                    >
                      <input
                        id={id}
                        type={multiple ? "checkbox" : "radio"}
                        name={current}
                        value={option}
                        required={!multiple}
                        aria-describedby={label.hint ? `${id}-hint` : undefined}
                        className="focus-halo mt-0.5 h-5 w-5 shrink-0 border-input-border accent-brand"
                      />
                      <span className="flex flex-col gap-1">
                        <span className="font-semibold text-ink">{label.label}</span>
                        {label.hint ? (
                          <span id={`${id}-hint`} className="text-sm text-muted">
                            {label.hint}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
          <div className="flex items-center gap-5">
            <Button type="submit">{t.continueLabel}</Button>
            {backHref ? (
              <Link
                href={backHref}
                className="focus-halo inline-flex min-h-11 items-center font-medium text-brand-deep hover:underline"
              >
                {t.back}
              </Link>
            ) : null}
          </div>
        </form>
      </div>
    );
  }

  const result = assessClaims(answers);
  const any = result.government.length + result.bma.length > 0;
  const asked = questionSequence(answers);

  const itemList = (items: ClaimItem[]) => (
    <ul className="flex flex-col divide-y divide-line rounded-lg border border-line bg-surface">
      {items.map((item) => (
        <li
          key={item}
          className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between sm:gap-6"
        >
          <span className="font-semibold text-ink">{t.items[item].title}</span>
          <span className="text-ink sm:text-right">{t.items[item].amount}</span>
        </li>
      ))}
    </ul>
  );

  const linkClass = "font-semibold text-brand-deep underline";

  return (
    <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
      {breadcrumbs}
      <div className="flex flex-col gap-3 rounded-lg border-l-4 border-brand bg-brand-tint p-6">
        <h1 className="font-display text-2xl sm:text-3xl">
          {any ? t.resultTitle : t.nothingTitle}
        </h1>
        {any ? <p className="leading-relaxed text-ink">{t.resultLede}</p> : null}
      </div>

      {result.government.length > 0 ? (
        <section aria-labelledby="from-government" className="flex flex-col gap-3">
          <h2 id="from-government" className="font-display text-2xl">
            {t.fromGovernment}
          </h2>
          {itemList(result.government)}
          <p className="text-sm font-semibold text-muted">{t.howToApply}</p>
          <ul className="flex flex-col gap-1">
            <li>
              <GuideLink
                href={part("apply-for-9000-baht")}
                locale={locale}
                newTabLabel={dict.a11y.newTab}
                className={linkClass}
              >
                {t.applyGovernment}
              </GuideLink>
            </li>
          </ul>
        </section>
      ) : null}

      {result.bma.length > 0 ? (
        <section aria-labelledby="from-bma" className="flex flex-col gap-3">
          <h2 id="from-bma" className="font-display text-2xl">
            {t.fromBma}
          </h2>
          {itemList(result.bma)}
          <p className="text-sm font-semibold text-muted">{t.howToApply}</p>
          <ul className="flex flex-col gap-1">
            {(
              [
                ["claim-online", t.applyBmaOnline],
                ["district-office", t.applyDistrict],
                ["documents", t.documents],
              ] as const
            ).map(([slug, label]) => (
              <li key={slug}>
                <GuideLink
                  href={part(slug)}
                  locale={locale}
                  newTabLabel={dict.a11y.newTab}
                  className={linkClass}
                >
                  {label}
                </GuideLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.notes.length > 0 ? (
        <div className="flex flex-col gap-4">
          {result.notes.map((note) =>
            t.warnings.includes(note) ? (
              <div key={note} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-surface"
                >
                  !
                </span>
                <p className="pt-1 leading-relaxed font-semibold text-ink">{t.notes[note]}</p>
              </div>
            ) : (
              <p
                key={note}
                className="border-l-4 border-input-border py-1 pl-4 leading-relaxed text-ink"
              >
                {t.notes[note]}
              </p>
            )
          )}
        </div>
      ) : null}

      <section aria-labelledby="your-answers" className="flex flex-col gap-3">
        <h2 id="your-answers" className="font-display text-xl">
          {t.yourAnswers}
        </h2>
        <dl className="flex flex-col divide-y divide-line">
          {asked.map((question: QuestionId) => {
            const value = answers[question];
            const chosen = (Array.isArray(value) ? value : [value]).filter(Boolean) as string[];
            return (
              <div
                key={question}
                className="grid grid-cols-1 gap-x-4 gap-y-1 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <dt className="text-sm text-muted sm:col-start-1">
                  {t.questions[question].question}
                </dt>
                <dd className="font-medium text-ink sm:col-start-1">
                  {chosen.map((c) => t.questions[question].options[c]?.label).join(", ")}
                </dd>
                <dd className="sm:col-start-2 sm:row-span-2 sm:row-start-1">
                  <Link
                    href={`${base}${answersQuery(answers, question)}`}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-brand-deep hover:underline"
                  >
                    {t.change}
                    <VisuallyHidden>{` ${t.questions[question].question}`}</VisuallyHidden>
                  </Link>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <ul className="flex flex-col gap-2">
        <li>
          <Link
            href={localeHref(locale, `/emergency/${scenario.id}/${guide.slug}`)}
            className={linkClass}
          >
            {t.readGuide}
          </Link>
        </li>
        <li>
          <Link href={base} className={linkClass}>
            {t.startAgain}
          </Link>
        </li>
      </ul>

      <p className="text-sm leading-relaxed text-muted">{t.disclaimer}</p>
    </div>
  );
}
