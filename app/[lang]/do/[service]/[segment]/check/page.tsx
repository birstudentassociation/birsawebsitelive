import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import { buildCheckAnswersRows, questionStepIds } from "@/lib/services/intake";
import { readServiceDraft } from "@/lib/services/draft";
import { resolveSubject, subjectDraftScope } from "@/lib/services/subject";
import CheckAnswers from "@/components/bds/CheckAnswers";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import BackLink from "@/components/bds/BackLink";
import { Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";
import CheckAnswersSubmit from "@/app/[lang]/do/CheckAnswersSubmit";
import { submitCheckAnswers } from "@/app/[lang]/do/actions";

/**
 * `/do/[service]/[subject]/check` (gate 7, `docs/DECISIONS-2.0.md`, decided
 * 2026-08-20). Only for a service that declares `subject`; the no-subject
 * equivalent is the sibling literal `app/[lang]/do/[service]/check/page.tsx`,
 * which stays exactly as it was and refuses a subject-taking service the
 * same way this file refuses one with none.
 */
type Params = { lang: string; service: string; segment: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service, segment } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition?.subject) return {};
  const resolution = await resolveSubject(definition, segment);
  if (!resolution.ok) return {};
  return buildMetadata({
    locale,
    title: getDictionary(locale).service.checkAnswers.heading,
    description: definition.start.title[locale],
    path: `/do/${service}/${segment}/check`,
  });
}

export default async function ServiceSubjectCheckPage({ params }: { params: Promise<Params> }) {
  const { lang, service, segment } = await params;
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

  const draft = await readServiceDraft(subjectDraftScope(service, segment));
  const rows = buildCheckAnswersRows(
    definition,
    draft,
    locale,
    {
      notAnswered: doDict.do.checkAnswers.notAnswered,
      yes: doDict.do.checkAnswers.yes,
      no: doDict.do.checkAnswers.no,
      listSeparator: doDict.do.checkAnswers.listSeparator,
    },
    segment
  );

  const ids = questionStepIds(definition);
  const lastQuestionId = ids[ids.length - 1];
  const backHref = lastQuestionId
    ? `/do/${definition.id}/${segment}/${lastQuestionId}`
    : `/do/${definition.id}/${segment}`;

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
          <BackLink locale={locale} href={backHref} label={dict.a11y.back} />
          <Text step="body-sm" className="text-muted">
            {doDict.do.subject.chosenNote.replace("{subject}", resolution.name[locale])}
          </Text>
          <CheckAnswers
            heading={dict.service.checkAnswers.heading}
            items={rows.map((row) => ({
              ...row,
              changeHref: localeHref(locale, row.changeHref),
            }))}
            changeLabel={dict.service.checkAnswers.changeLabel}
          >
            <CheckAnswersSubmit
              action={submitCheckAnswers.bind(null, service, segment, locale)}
              labels={{
                confirmAndSend: doDict.do.confirmAndSend,
                sending: doDict.do.sending,
                errorSummaryTitle: dict.form.errorSummaryTitle,
                rateLimited: doDict.do.rateLimited,
                genericError: doDict.do.genericSubmitError,
              }}
            />
          </CheckAnswers>
        </Stack>
      </div>
    </>
  );
}
