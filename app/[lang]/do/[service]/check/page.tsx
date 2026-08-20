import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import { buildCheckAnswersRows, questionStepIds } from "@/lib/services/intake";
import { readServiceDraft } from "@/lib/services/draft";
import CheckAnswers from "@/components/bds/CheckAnswers";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import BackLink from "@/components/bds/BackLink";
import { Stack } from "@/components/bds/Layout";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";
import CheckAnswersSubmit from "@/app/[lang]/do/CheckAnswersSubmit";
import { submitCheckAnswers } from "@/app/[lang]/do/actions";

type Params = { lang: string; service: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition) return {};
  return buildMetadata({
    locale,
    title: getDictionary(locale).service.checkAnswers.heading,
    description: definition.start.title[locale],
    path: `/do/${service}/check`,
  });
}

/**
 * `/do/[service]/check` (REDESIGN-2.0 §5.1 item 3). Every answer read back,
 * read-only, from the draft, each with a change link that returns to its
 * own question and comes back here afterwards (WCAG 3.3.7,
 * `lib/services/intake.ts`'s `checkAnswersChangeHref`).
 */
export default async function ServiceCheckPage({ params }: { params: Promise<Params> }) {
  const { lang, service } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const doDict = getDoDictionary(locale);
  const definition = getService(service);

  if (!definition) {
    return <ServiceUnavailable locale={locale} />;
  }

  const draft = await readServiceDraft(service);
  const rows = buildCheckAnswersRows(definition, draft, locale, {
    notAnswered: doDict.do.checkAnswers.notAnswered,
    yes: doDict.do.checkAnswers.yes,
    no: doDict.do.checkAnswers.no,
    listSeparator: doDict.do.checkAnswers.listSeparator,
  });

  // Check's own back link retraces the wizard to its last question, not the
  // "returnTo=check" shortcut `previousStepHref` gives a question step (that
  // shortcut exists so a CHANGE link's step comes straight back here; this
  // page is the destination, not a step being edited).
  const ids = questionStepIds(definition);
  const lastQuestionId = ids[ids.length - 1];
  const backHref = lastQuestionId
    ? `/do/${definition.id}/${lastQuestionId}`
    : `/do/${definition.id}`;

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
          <CheckAnswers
            heading={dict.service.checkAnswers.heading}
            items={rows.map((row) => ({
              ...row,
              changeHref: localeHref(locale, row.changeHref),
            }))}
            changeLabel={dict.service.checkAnswers.changeLabel}
          >
            <CheckAnswersSubmit
              action={submitCheckAnswers.bind(null, service, locale)}
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
