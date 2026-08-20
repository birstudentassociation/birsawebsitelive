import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import { previousStepHref, stepIndex, questionStepIds } from "@/lib/services/intake";
import { readServiceDraft } from "@/lib/services/draft";
import { resolveSubject, subjectDraftScope } from "@/lib/services/subject";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import BackLink from "@/components/bds/BackLink";
import { Heading, Text } from "@/components/bds/Type";
import { Stack, Wrap, Section } from "@/components/bds/Layout";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";
import QuestionStepForm from "@/app/[lang]/do/QuestionStepForm";
import { submitQuestionStep } from "@/app/[lang]/do/actions";

/**
 * `/do/[service]/[subject]/[step]` (gate 7, `docs/DECISIONS-2.0.md`,
 * decided 2026-08-20). Exists only for a service that declares `subject`; a
 * service with none has no three-segment step URL at all (its steps are
 * `/do/[service]/[step]`, `app/[lang]/do/[service]/[segment]/page.tsx`), so
 * this file `notFound()`s rather than guess which of the two `segment` was
 * ever meant to be.
 */
type Params = { lang: string; service: string; segment: string; step: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service, segment, step } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition?.subject) return {};
  const resolution = await resolveSubject(definition, segment);
  if (!resolution.ok) return {};
  const question = definition.questions.find((q) => q.id === step);
  if (!question) return {};
  return buildMetadata({
    locale,
    title: question.label[locale],
    description: definition.start.title[locale],
    path: `/do/${service}/${segment}/${step}`,
  });
}

export default async function ServiceSubjectStepPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang, service, segment, step } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const doDict = getDoDictionary(locale);
  const definition = getService(service);

  if (!definition) {
    return <ServiceUnavailable locale={locale} />;
  }
  if (!definition.subject) notFound();

  const resolution = await resolveSubject(definition, segment);
  if (!resolution.ok) notFound();

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
  const draft = await readServiceDraft(subjectDraftScope(service, segment));
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
              href={previousStepHref(definition, question.id, returnTo, segment)}
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
            action={submitQuestionStep.bind(null, service, segment, question.id, locale, returnTo)}
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
