import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Notice from "@/components/bds/Notice";
import ExternalLink from "@/components/bds/ExternalLink";
import Fieldset from "@/components/bds/Fieldset";
import VisuallyHidden from "@/components/bds/VisuallyHidden";
import { Heading, Text } from "@/components/bds/Type";
import { Wrap, Stack } from "@/components/bds/Layout";
import AnswersProfileSummary from "@/components/help/AnswersProfileSummary";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { submitFeedbackAction } from "@/app/[lang]/feedback/actions";
import {
  filterWhen,
  getTopic,
  parseProfile,
  resolveTopic,
  serializeProfile,
  stepQuery,
  toAnswerIds,
  visibleOptions,
} from "@/lib/smart-answers";
import { service, uiCopy } from "@/content/smart-answers";
import type { OutcomeBlock } from "@/content/smart-answers/types";

/**
 * `/help/answers/[topic]/q` (ROUTE-MAP-2.0 Wave 5C), the step engine.
 *
 * A rebuild of `app/[lang]/answers/[topic]/q/page.tsx` against `bds/`
 * primitives rather than the 1.0 components it imports (defect D7). Same
 * design as the 1.0 route and for the same reason: one URL per state, driven
 * entirely by `?p=` (who the reader is) and `?a=` (what they have answered so
 * far, in order), a plain GET form throughout, so it works with JavaScript
 * off (BUILD-BRIEF-2.0 §7). `content/smart-answers/**` and
 * `lib/smart-answers.ts` are read, not owned by this agent, and are shared
 * unedited with the 1.0 route. `components/feedback/FeedbackForm.tsx` is
 * reused unedited too, the same "read a shared component, do not fork it
 * unless the fork needs a different destination" pattern
 * `components/help/AnswersProfileSummary.tsx` documents for itself.
 *
 * HEADING ORDER. A question step's one `<h1>` is the topic title, stable
 * across every step of that topic (matches the topic start page's own H1).
 * The actual question for this step is not a second H1: it is the
 * `Fieldset` legend, rendered at `display-2`, the same visual size as an H1
 * elsewhere on the site, so the reader sees one prominent statement of "what
 * this step is asking" without two same-page headings competing for the one
 * `<h1>` slot. An outcome step's `<h1>` is the outcome's own title, the same
 * pattern the topic start page and every other `/help` page part follows.
 */

type PageParams = { lang: string; topic: string };
type PageSearchParams = { a?: string | string[]; p?: string | string[] };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const { lang, topic: slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const topic = getTopic(service, slug);
  if (!topic) return {};

  const { a, p } = await searchParams;
  const { node } = resolveTopic(service, topic, parseProfile(p), toAnswerIds(a));
  const stepTitle = node.kind === "question" ? node.question[locale] : node.title[locale];

  const base = buildMetadata({
    locale,
    title: `${stepTitle}: ${topic.title[locale]}`,
    description: topic.lede[locale],
    path: `/help/answers/${topic.slug}/q`,
  });

  // Every step state is a distinct URL but none of them are worth indexing:
  // they're mid-journey, not a destination in themselves.
  return { ...base, robots: { index: false, follow: false } };
}

export default async function HelpTopicStepPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { lang, topic: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const topic = getTopic(service, slug);
  if (!topic) notFound();
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

  const { a, p } = await searchParams;
  const profile = parseProfile(p);
  const journey = resolveTopic(service, topic, profile, toAnswerIds(a));
  const { node, trail, facts, answerIds } = journey;

  const token = serializeProfile(profile);
  const qPath = `/help/answers/${topic.slug}/q`;
  const qHref = localeHref(locale, qPath);
  const startHref = localeHref(locale, `/help/answers/${topic.slug}${token ? `?p=${token}` : ""}`);
  const stepHref = (ids: string[]) => `${qHref}${stepQuery(profile, ids)}`;
  const backHref = answerIds.length > 0 ? stepHref(answerIds.slice(0, -1)) : startHref;
  const returnTo = `${qPath}${stepQuery(profile, answerIds)}`;

  const stepLabel = node.kind === "question" ? node.question[locale] : node.title[locale];

  const helpSlot = (
    <Button href={localeHref(locale, "/contact")} variant="secondary">
      {dict.actions.contactUs}
    </Button>
  );

  const breadcrumbs = (
    <Breadcrumbs
      locale={locale}
      label={dict.a11y.breadcrumb}
      items={[
        { label: dict.site.name, href: "/" },
        { label: dict.hub.title, href: "/help" },
        { label: t.hub, href: "/help/answers" },
        { label: topic.title[locale], href: `/help/answers/${topic.slug}` },
        { label: stepLabel },
      ]}
    />
  );

  if (node.kind === "question") {
    const options = visibleOptions(node, facts);
    const fieldsetId = `q-${node.id}`;

    return (
      <>
        <PageHeader title={topic.title[locale]} breadcrumbs={breadcrumbs} helpSlot={helpSlot} />
        <Wrap className="py-10">
          <Stack gap="xl" className="max-w-[var(--measure)]">
            <form method="GET" action={qHref} className="flex flex-col gap-6">
              {/* The profile and every prior answer travel forward as hidden
                  fields, in order, so a fresh `a=...` for this step appends
                  after them and the query param order matches the trail
                  order. */}
              {token ? <input type="hidden" name="p" value={token} /> : null}
              {answerIds.map((id, index) => (
                <input key={index} type="hidden" name="a" value={id} />
              ))}

              <Fieldset id={fieldsetId} legend={node.question[locale]} legendStep="display-2" hint={node.hint?.[locale]}>
                {options.map((option) => (
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
                      <Text as="span" step="body" className="font-semibold text-ink">
                        {option.label[locale]}
                      </Text>
                      {option.hint ? (
                        <Text as="span" step="body-sm" className="text-muted">
                          {option.hint[locale]}
                        </Text>
                      ) : null}
                    </span>
                  </label>
                ))}
              </Fieldset>

              <div className="flex items-center gap-5">
                <Button type="submit">{t.continueLabel}</Button>
                <Link href={backHref} className="focus-halo font-medium text-brand-deep hover:underline">
                  {t.back}
                </Link>
              </div>
            </form>

            <AnswersProfileSummary locale={locale} profile={profile} returnTo={returnTo} variant="compact" />
          </Stack>
        </Wrap>
      </>
    );
  }

  const blocks = filterWhen(node.body, facts) as OutcomeBlock[];
  const actions = filterWhen(node.actions, facts);
  const citations = filterWhen(node.citations, facts);
  const related = filterWhen(node.related, facts);

  // The "challenge a decision" route: always a "problem" category, regardless
  // of the outcome's own `contactCategory`, so the contact form prefills the
  // subject with the exact answer state being disputed. Disagreeing with an
  // outcome is a problem with what BIRSA told the reader, not a fresh
  // question.
  const challengeHref = localeHref(
    locale,
    `/contact?category=problem&from=${encodeURIComponent(returnTo)}`
  );

  return (
    <>
      <PageHeader
        title={node.title[locale]}
        lede={node.summary[locale]}
        breadcrumbs={breadcrumbs}
        helpSlot={helpSlot}
      />
      <Wrap className="py-10">
        <Stack gap="2xl" className="max-w-[var(--measure)]">
          <Stack gap="md" className="rounded-lg border-l-4 border-brand bg-brand-tint p-6">
            {blocks.map((block, index) => {
              if (block.kind === "paragraph") {
                return (
                  <Text step="body" key={index}>
                    {block.text[locale]}
                  </Text>
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
                <Stack gap="xs" key={index}>
                  {block.title ? <Heading level={3}>{block.title[locale]}</Heading> : null}
                  <Text as="ol" step="body" className="list-decimal space-y-2 pl-6">
                    {block.items.map((item, itemIndex) => (
                      <Text as="li" step="body" key={itemIndex}>
                        {item[locale]}
                      </Text>
                    ))}
                  </Text>
                </Stack>
              );
            })}

            {node.owner ? (
              <Stack gap="3xs" className="mt-2 border-t border-line/60 pt-4">
                <Text step="body-sm" className="font-semibold text-ink">
                  {t.whoDecides}
                </Text>
                <Text step="body-sm">{node.owner[locale]}</Text>
              </Stack>
            ) : null}

            {actions.length > 0 ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {actions.map((action, index) =>
                  // A mailto: opens a mail client, not a tab, so it must not
                  // be announced as "opens in a new tab".
                  action.external && action.href.startsWith("mailto:") ? (
                    <a
                      key={index}
                      href={action.href}
                      className="focus-halo inline-flex h-11 items-center rounded-lg border-[1.5px] border-ink px-5 text-ink hover:bg-sunken"
                    >
                      <Text as="span" step="body-sm" className="font-semibold">
                        {action.label[locale]}
                      </Text>
                    </a>
                  ) : action.external ? (
                    <ExternalLink
                      key={index}
                      href={action.href}
                      newTabLabel={dict.a11y.newTab}
                      className="focus-halo inline-flex h-11 items-center rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-strong"
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
            ) : null}

            {citations.length > 0 ? (
              <Stack gap="xs" className="mt-2 border-t border-line/60 pt-4">
                <Text step="body-sm" className="font-semibold text-ink">
                  {t.basedOn}
                </Text>
                <Text as="ul" step="body-sm" className="list-disc space-y-1 pl-5">
                  {citations.map((citation, index) => (
                    <Text as="li" step="body-sm" key={index}>
                      <Link
                        href={localeHref(locale, citation.href)}
                        className="focus-halo font-medium text-brand-deep hover:underline"
                      >
                        {citation.label[locale]}
                      </Link>
                    </Text>
                  ))}
                </Text>
              </Stack>
            ) : null}
          </Stack>

          {related.length > 0 ? (
            <section aria-label={t.readMore}>
              <Stack gap="sm">
                <Heading level={2}>{t.readMore}</Heading>
                <Text as="ul" step="body" className="flex flex-col divide-y divide-line">
                  {related.map((item, index) => (
                    <Text as="li" step="body" key={index} className="py-3">
                      <Link
                        href={localeHref(locale, item.href)}
                        className="focus-halo font-medium text-brand-deep hover:underline"
                      >
                        {item.label[locale]}
                      </Link>
                      {item.description ? (
                        <Text step="body-sm" className="mt-1 text-muted">
                          {item.description[locale]}
                        </Text>
                      ) : null}
                    </Text>
                  ))}
                </Text>
              </Stack>
            </section>
          ) : null}

          {trail.length > 0 ? (
            <section aria-label={t.yourAnswers}>
              <Stack gap="sm">
                <Heading level={2}>{t.yourAnswers}</Heading>
                <dl className="flex flex-col divide-y divide-line">
                  {trail.map((step, index) => {
                    // An automatic step was never the reader's choice, so it
                    // is labelled as an assumption and corrected by editing
                    // the profile, not by re-answering a question they never
                    // saw.
                    const changeHref = step.auto
                      ? localeHref(
                          locale,
                          `/help/answers/you?return=${encodeURIComponent(returnTo)}${
                            token ? `&p=${token}` : ""
                          }`
                        )
                      : stepHref(answerIds.slice(0, step.answerIndex ?? 0));

                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                      >
                        <div>
                          <Text as="dt" step="body-sm" className="text-muted">
                            {step.question.question[locale]}
                          </Text>
                          <Text as="dd" step="body" className="font-medium text-ink">
                            {step.option.label[locale]}
                            {step.auto ? (
                              <Text as="span" step="body-sm" className="ml-2 font-normal text-muted">
                                ({t.assumed})
                              </Text>
                            ) : null}
                          </Text>
                        </div>
                        <Link
                          href={changeHref}
                          className="focus-halo shrink-0 text-sm font-medium text-brand-deep hover:underline"
                        >
                          <Text as="span" step="body-sm">
                            {t.change}
                          </Text>
                          <VisuallyHidden>{`: ${step.question.question[locale]}`}</VisuallyHidden>
                        </Link>
                      </div>
                    );
                  })}
                </dl>
              </Stack>
            </section>
          ) : null}

          <AnswersProfileSummary locale={locale} profile={profile} returnTo={returnTo} variant="compact" />

          <Stack gap="sm" className="rounded-lg border border-line p-5">
            <Heading level={2} step="heading-3">
              {t.notAnswered}
            </Heading>
            <div>
              <Button href={challengeHref} variant="secondary">
                {t.notAnsweredAction}
              </Button>
            </div>
          </Stack>

          <div>
            <Link href={startHref} className="focus-halo font-medium text-brand-deep hover:underline">
              {t.startAgain}
            </Link>
          </div>

          {/*
            The reader has reached an outcome, so the journey is finished. The
            Service Manual requires a satisfaction prompt at that point. The
            source path is the fixed topic route with no query string, so
            nothing about the reader's own answers is recorded alongside the
            rating.
          */}
          <FeedbackForm
            locale={locale}
            sourcePath={localeHref(locale, qPath)}
            heading={t.feedbackHeading}
            action={submitFeedbackAction}
          />

          <Notice variant="info">{t.guidanceDisclaimer}</Notice>
        </Stack>
      </Wrap>
    </>
  );
}
