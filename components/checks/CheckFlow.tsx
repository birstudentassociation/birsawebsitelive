import Link from "next/link";
import { localeHref, type Dictionary, type Locale } from "@/lib/i18n";
import { resolveTopic, stepQuery } from "@/lib/smart-answers";
import { service, uiCopy } from "@/content/smart-answers";
import type { SmartAnswerOutcome, SmartAnswerTopic } from "@/content/smart-answers/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import Notice from "@/components/Notice";
import PageHeader from "@/components/PageHeader";
import VisuallyHidden from "@/components/VisuallyHidden";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { submitFeedbackAction } from "@/app/[lang]/feedback/actions";

/**
 * One check (a Smart Answers topic) rendered on the page that hosts it.
 *
 * Every state is a URL on the host page, driven by `?a=` (the answers so far,
 * in order), and every question is a plain GET form, so it all works with
 * JavaScript off. The hosting route reads `searchParams`, so it renders
 * dynamically per request; each state is still bookmarkable.
 *
 * Three states, following GOV.UK smart answers:
 *  - the first question, under the page header, with no separate start page;
 *  - any later question, alone on the page;
 *  - the outcome: the answer, then the reader's route back into the flow.
 */

export type CheckFlowProps = {
  locale: Locale;
  topic: SmartAnswerTopic;
  /** The raw `a` values from the URL; validated here against the authored graph. */
  answerIds: string[];
  dict: Dictionary;
};

/** Label of the section a check lives in, for its breadcrumb. */
function sectionCrumb(topic: SmartAnswerTopic, dict: Dictionary) {
  const href = `/${topic.path.split("/")[1] ?? ""}`;
  const nav = dict.nav.find((item) => item.href === href);
  return { label: nav?.label ?? dict.footer.contact, href };
}

function OutcomeActions({
  outcome,
  locale,
  dict,
}: {
  outcome: SmartAnswerOutcome;
  locale: Locale;
  dict: Dictionary;
}) {
  const actions = outcome.actions ?? [];
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {actions.map((action, index) =>
        // A mailto: opens a mail client, not a tab, so it must not be
        // announced as "opens in a new tab".
        action.external && action.href.startsWith("mailto:") ? (
          <a
            key={index}
            href={action.href}
            className="focus-halo inline-flex min-h-11 items-center rounded-lg border-[1.5px] border-ink px-5 py-2 text-[0.95rem] font-semibold text-ink hover:bg-brand-tint"
          >
            {action.label[locale]}
          </a>
        ) : action.external ? (
          <ExternalLink
            key={index}
            href={action.href}
            newTabLabel={dict.a11y.newTab}
            className="focus-halo min-h-11 rounded-lg bg-brand px-5 text-[0.95rem] font-semibold text-white hover:bg-brand-strong"
          >
            {action.label[locale]}
          </ExternalLink>
        ) : (
          <Button
            key={index}
            href={localeHref(locale, action.href)}
            variant={index === 0 ? "primary" : "secondary"}
          >
            {action.label[locale]}
          </Button>
        )
      )}
    </div>
  );
}

export default function CheckFlow({
  locale,
  topic,
  answerIds: rawAnswerIds,
  dict,
}: CheckFlowProps) {
  const t = uiCopy[locale];
  const { node, trail, answerIds } = resolveTopic(service, topic, rawAnswerIds);

  const pageHref = localeHref(locale, topic.path);
  const stepHref = (ids: string[]) => `${pageHref}${stepQuery(ids)}`;
  // The first answered step goes back to the bare topic path, which is the entry state.
  const backHref = stepHref(answerIds.slice(0, -1));
  const returnTo = `${topic.path}${stepQuery(answerIds)}`;

  if (node.kind === "question") {
    const isEntry = answerIds.length === 0;
    const section = sectionCrumb(topic, dict);

    const form = (
      <form method="GET" action={pageHref} className="flex flex-col gap-6">
        {/* Every prior answer travels forward as a hidden field, in order, so
            a fresh `a=...` for this step appends after them and the query
            param order matches the trail order. */}
        {answerIds.map((id, index) => (
          <input key={index} type="hidden" name="a" value={id} />
        ))}

        <fieldset
          className="flex flex-col gap-4"
          aria-describedby={node.hint ? "question-hint" : undefined}
        >
          <legend className="mb-1">
            {isEntry ? (
              <h2 className="font-display text-2xl">{node.question[locale]}</h2>
            ) : (
              <h1 className="font-display text-2xl sm:text-3xl">{node.question[locale]}</h1>
            )}
          </legend>
          {node.hint ? (
            <p id="question-hint" className="text-base leading-relaxed text-muted">
              {node.hint[locale]}
            </p>
          ) : null}

          <div className="flex flex-col gap-3">
            {node.options.map((option) => (
              <label
                key={option.id}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
              >
                <input
                  type="radio"
                  name="a"
                  value={option.id}
                  required
                  className="focus-halo mt-0.5 h-5 w-5 shrink-0 border-input-border accent-brand"
                />
                <span className="flex flex-col gap-1">
                  <span className="font-semibold text-ink">{option.label[locale]}</span>
                  {option.hint ? (
                    <span className="text-sm text-muted">{option.hint[locale]}</span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center gap-5">
          <Button type="submit">{t.continueLabel}</Button>
          {isEntry ? null : (
            <Link
              href={backHref}
              className="focus-halo inline-flex min-h-11 items-center font-medium text-brand-deep hover:underline"
            >
              {t.back}
            </Link>
          )}
        </div>
      </form>
    );

    if (isEntry) {
      return (
        <>
          <PageHeader
            title={topic.title[locale]}
            lede={topic.lede[locale]}
            breadcrumbs={
              <Breadcrumbs
                locale={locale}
                label={dict.a11y.breadcrumb}
                items={[
                  { label: dict.site.name, href: "/" },
                  { label: section.label, href: section.href },
                  { label: topic.title[locale] },
                ]}
              />
            }
          />
          <div className="wrap max-w-[var(--measure)] py-10">{form}</div>
        </>
      );
    }

    return (
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-6 py-10">
        <p className="text-sm font-medium text-muted">{topic.title[locale]}</p>
        {form}
      </div>
    );
  }

  const blocks = node.body ?? [];
  const citations = node.citations ?? [];
  const related = node.related ?? [];

  // The "challenge a decision" route: always a "problem" category, regardless
  // of the outcome's own `contactCategory`, so the contact form prefills the
  // subject with the exact answer state being disputed (see
  // `app/[lang]/contact/page.tsx`'s `initialSubject`, which only fires for
  // "problem"). Disagreeing with an outcome is a problem with what BIRSA
  // told the reader, not a fresh question.
  const challengeHref = localeHref(
    locale,
    `/contact?category=problem&from=${encodeURIComponent(returnTo)}`
  );

  return (
    <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
      <div className="flex flex-col gap-4 rounded-lg border-l-4 border-brand bg-brand-tint p-6">
        <h1 className="font-display text-2xl sm:text-3xl">{node.title[locale]}</h1>
        <p className="leading-relaxed text-ink">{node.summary[locale]}</p>

        {blocks.map((block, index) => {
          if (block.kind === "paragraph") {
            return (
              <p key={index} className="leading-relaxed text-ink">
                {block.text[locale]}
              </p>
            );
          }
          if (block.kind === "note") {
            return (
              <Notice key={index} variant={block.tone === "warning" ? "warning" : "info"}>
                {block.text[locale]}
              </Notice>
            );
          }
          return (
            <div key={index} className="flex flex-col gap-2">
              {block.title ? (
                <h2 className="font-display text-lg text-ink">{block.title[locale]}</h2>
              ) : null}
              <ol className="list-inside list-decimal space-y-2 leading-relaxed text-ink">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item[locale]}</li>
                ))}
              </ol>
            </div>
          );
        })}

        {node.owner ? (
          <div className="mt-2 border-t border-line/60 pt-4">
            <h2 className="text-sm font-semibold text-ink">{t.whoDecides}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink">{node.owner[locale]}</p>
          </div>
        ) : null}

        {citations.length > 0 ? (
          <div className="mt-2 border-t border-line/60 pt-4">
            <h2 className="text-sm font-semibold text-ink">{t.basedOn}</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              {citations.map((citation, index) => (
                <li key={index}>
                  <Link
                    href={localeHref(locale, citation.href)}
                    className="text-brand-deep hover:text-brand-dark hover:underline"
                  >
                    {citation.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <OutcomeActions outcome={node} locale={locale} dict={dict} />
      </div>

      {related.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="check-related">
          <h2 id="check-related" className="font-display text-xl">
            {t.readMore}
          </h2>
          <ul className="flex flex-col divide-y divide-line">
            {related.map((item, index) => (
              <li key={index} className="py-3">
                <Link
                  href={localeHref(locale, item.href)}
                  className="font-medium text-brand-deep hover:underline"
                >
                  {item.label[locale]}
                </Link>
                {item.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.description[locale]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* One answer needs no summary; it would only repeat the question above. */}
      {trail.length >= 2 ? (
        <section className="flex flex-col gap-3" aria-labelledby="check-trail">
          <h2 id="check-trail" className="font-display text-xl">
            {t.yourAnswers}
          </h2>
          <dl className="flex flex-col divide-y divide-line">
            {trail.map((step) => (
              <div
                key={step.answerIndex}
                className="grid grid-cols-1 gap-x-4 gap-y-1 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <dt className="text-sm text-muted sm:col-start-1">
                  {step.question.question[locale]}
                </dt>
                <dd className="font-medium text-ink sm:col-start-1">{step.option.label[locale]}</dd>
                <dd className="sm:col-start-2 sm:row-span-2 sm:row-start-1">
                  <Link
                    href={stepHref(answerIds.slice(0, step.answerIndex))}
                    className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-brand-deep hover:underline"
                  >
                    {t.change}
                    <VisuallyHidden>{`: ${step.question.question[locale]}`}</VisuallyHidden>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <p className="leading-relaxed text-ink">
        {t.notAnswered}{" "}
        <Link href={challengeHref} className="font-medium text-brand-deep hover:underline">
          {t.notAnsweredAction}
        </Link>
      </p>

      <div>
        <Link
          href={pageHref}
          className="inline-flex min-h-11 items-center font-medium text-brand-deep hover:underline"
        >
          {t.startAgain}
        </Link>
      </div>

      {/*
        The reader has reached an outcome, so the journey is finished. The
        Service Manual requires a satisfaction prompt at that point, kept out
        of the way in a disclosure. The source path is the fixed topic path
        with no query string, so nothing about the reader's own answers is
        recorded alongside the rating.
      */}
      <details className="rounded-lg border border-line">
        <summary className="focus-halo flex min-h-11 cursor-pointer items-center px-5 py-2 font-medium text-brand-deep hover:underline">
          {t.feedbackSummary}
        </summary>
        <div className="border-t border-line p-5">
          <FeedbackForm
            locale={locale}
            sourcePath={pageHref}
            heading={t.feedbackHeading}
            action={submitFeedbackAction}
          />
        </div>
      </details>

      <Notice variant="info">{t.guidanceDisclaimer}</Notice>
    </div>
  );
}
