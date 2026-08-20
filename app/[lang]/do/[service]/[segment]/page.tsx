import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import { previousStepHref, stepIndex, questionStepIds } from "@/lib/services/intake";
import { readServiceDraft } from "@/lib/services/draft";
import { resolveSubject, subjectDraftScope } from "@/lib/services/subject";
import StartPage from "@/components/bds/StartPage";
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
 * `segment` is either a QUESTION STEP ID (a service with no `subject`) or a
 * SUBJECT KEY (a service that declares one, gate 7,
 * `docs/DECISIONS-2.0.md`, decided 2026-08-20): `/do/<service>/<step>` and
 * `/do/<service>/<subject>` are the same URL shape, and Next.js requires
 * every dynamic segment at one directory level to share a single param name,
 * so this file is that one name and decides which case it is from
 * `definition.subject`, never from the segment's own text.
 */
type Params = { lang: string; service: string; segment: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service, segment } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition) return {};

  if (definition.subject) {
    const resolution = await resolveSubject(definition, segment);
    if (!resolution.ok) return {};
    return buildMetadata({
      locale,
      title: definition.start.title[locale],
      description: definition.start.whoFor[locale],
      path: `/do/${service}/${segment}`,
    });
  }

  const question = definition.questions.find((q) => q.id === segment);
  if (!question) return {};
  return buildMetadata({
    locale,
    title: question.label[locale],
    description: definition.start.title[locale],
    path: `/do/${service}/${segment}`,
  });
}

/**
 * A service with no `subject`: `segment` is a question id, in
 * `serviceSteps` order. `check` and `confirm` are sibling literal route
 * segments (`app/[lang]/do/[service]/check/`, `.../confirm/`), which
 * Next.js matches before this dynamic one, so this branch only ever
 * receives an actual QUESTION.
 */
async function QuestionStepBranch({
  locale,
  service,
  step,
  returnTo,
  definition,
}: {
  locale: Locale;
  service: string;
  step: string;
  returnTo: string | undefined;
  definition: NonNullable<ReturnType<typeof getService>>;
}) {
  const dict = getDictionary(locale);
  const doDict = getDoDictionary(locale);

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

  const draft = await readServiceDraft(subjectDraftScope(service));
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
            action={submitQuestionStep.bind(
              null,
              service,
              undefined,
              question.id,
              locale,
              returnTo
            )}
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

/**
 * A service that declares `subject`: `segment` is the chosen subject's key.
 * An unresolvable one (never existed, retired, or the backing catalogue is
 * not configured, `lib/services/subject.ts`'s own header) is a proper
 * `notFound()`, never a crash. Resolved, this is the service's start page
 * for that one subject, the same `StartPage` component the no-subject start
 * page uses, plus a line naming which subject was chosen (the one thing
 * `definition.start` cannot say, since it is written once for every
 * subject).
 */
async function SubjectStartBranch({
  locale,
  service,
  subject,
  definition,
}: {
  locale: Locale;
  service: string;
  subject: string;
  definition: NonNullable<ReturnType<typeof getService>>;
}) {
  const dict = getDictionary(locale);
  const doDict = getDoDictionary(locale);

  const resolution = await resolveSubject(definition, subject);
  if (!resolution.ok) notFound();

  const firstStep = definition.questions[0];
  const startHref = firstStep
    ? localeHref(locale, `/do/${service}/${subject}/${firstStep.id}`)
    : localeHref(locale, `/do/${service}/${subject}/check`);

  return (
    <>
      <ServiceNavigation
        locale={locale}
        serviceName={definition.start.title[locale]}
        links={chassisServiceNavLinks(definition, locale, "start")}
        ariaLabelTemplate={dict.a11y.serviceNavigation}
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <Stack gap="lg">
          <Text step="body-sm" className="text-muted">
            {doDict.do.subject.chosenNote.replace("{subject}", resolution.name[locale])}
          </Text>
          <StartPage
            start={definition.start}
            locale={locale}
            href={startHref}
            labels={dict.service.startPage}
          />
        </Stack>
      </div>
    </>
  );
}

export default async function ServiceSegmentPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang, service, segment } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const definition = getService(service);

  if (!definition) {
    return <ServiceUnavailable locale={locale} />;
  }

  if (definition.subject) {
    return (
      <SubjectStartBranch
        locale={locale}
        service={service}
        subject={segment}
        definition={definition}
      />
    );
  }

  const { returnTo } = await searchParams;
  return (
    <QuestionStepBranch
      locale={locale}
      service={service}
      step={segment}
      returnTo={returnTo}
      definition={definition}
    />
  );
}
