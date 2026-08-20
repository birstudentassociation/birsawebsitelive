import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import { previousStepHref, stepIndex, questionStepIds } from "@/lib/services/intake";
import { readServiceDraft } from "@/lib/services/draft";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import BackLink from "@/components/bds/BackLink";
import { Heading, Text } from "@/components/bds/Type";
import { Stack, Wrap, Section } from "@/components/bds/Layout";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";
import QuestionStepForm from "@/app/[lang]/do/QuestionStepForm";
import { submitQuestionStep } from "@/app/[lang]/do/actions";

type Params = { lang: string; service: string; step: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service, step } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  const question = definition?.questions.find((q) => q.id === step);
  if (!definition || !question) return {};
  return buildMetadata({
    locale,
    title: question.label[locale],
    description: definition.start.title[locale],
    path: `/do/${service}/${step}`,
  });
}

/**
 * `/do/[service]/[step]` (REDESIGN-2.0 §5.1 item 2, ROUTE-MAP-2.0). One
 * question per page, in `serviceSteps` order. `check` and `confirm` are
 * sibling literal route segments (`app/[lang]/do/[service]/check/`,
 * `.../confirm/`), which Next.js matches before this dynamic `[step]`, so
 * this file only ever renders an actual QUESTION.
 */
export default async function ServiceStepPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang, service, step } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const doDict = getDoDictionary(locale);
  const definition = getService(service);

  if (!definition) {
    return <ServiceUnavailable locale={locale} />;
  }

  const question = definition.questions.find((q) => q.id === step);
  if (!question) {
    return (
      <Section>
        <Wrap className="max-w-[var(--measure)]">
          <Stack gap="md">
            <Heading level={1}>{doDict.do.stepNotFound.title}</Heading>
            <Text step="body">{doDict.do.stepNotFound.body}</Text>
          </Stack>
        </Wrap>
      </Section>
    );
  }

  const { returnTo } = await searchParams;
  const draft = await readServiceDraft(service);
  const index = stepIndex(definition, step);
  const total = questionStepIds(definition).length;
  const progress = doDict.do.stepOf
    .replace("{current}", String(index + 1))
    .replace("{total}", String(total));

  return (
    <>
      <ServiceNavigation
        locale={locale}
        serviceName={definition.start.title[locale]}
        links={chassisServiceNavLinks(definition, locale, "other")}
        ariaLabelTemplate={dict.a11y.serviceNavigation}
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <Stack gap="lg">
          <div className="flex items-center justify-between gap-4">
            <BackLink
              locale={locale}
              href={previousStepHref(definition, question.id, returnTo)}
              label={dict.a11y.back}
            />
            {returnTo !== "check" ? (
              <Text step="body-sm" className="text-muted">
                {progress}
              </Text>
            ) : null}
          </div>
          <Heading level={1}>{question.label[locale]}</Heading>
          <QuestionStepForm
            action={submitQuestionStep.bind(null, service, question.id, locale, returnTo)}
            question={question}
            locale={locale}
            defaultValue={draft[question.id]}
            labels={{
              continueLabel: doDict.do.continueLabel,
              continuing: doDict.do.continuing,
              errorSummaryTitle: dict.form.errorSummaryTitle,
              required: dict.actions.required,
              optional: dict.actions.optional,
              field: dict.field,
              yes: doDict.do.checkAnswers.yes,
              no: doDict.do.checkAnswers.no,
              characterCount: dict.characterCount,
            }}
          />
        </Stack>
      </div>
    </>
  );
}
