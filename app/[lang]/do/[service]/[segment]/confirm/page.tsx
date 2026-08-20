import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import { readConfirmationCookie } from "@/lib/services/draft";
import { subjectDraftScope } from "@/lib/services/subject";
import ConfirmationPanel from "@/components/bds/ConfirmationPanel";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import { Heading, Text } from "@/components/bds/Type";
import { Stack, Wrap, Section } from "@/components/bds/Layout";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";

/**
 * `/do/[service]/[subject]/confirm` (gate 7, `docs/DECISIONS-2.0.md`,
 * decided 2026-08-20). Only for a service that declares `subject`; the
 * no-subject equivalent is the sibling literal
 * `app/[lang]/do/[service]/confirm/page.tsx`. Does not re-resolve the
 * subject: by the time a reader is here, `submitCheckAnswers` has already
 * cleared the draft and written the confirmation cookie, and the subject
 * they chose no longer matters to what this page shows (a reference number
 * it reads back), only to which cookie it reads.
 */
type Params = { lang: string; service: string; segment: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service, segment } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition?.subject) return {};
  return buildMetadata({
    locale,
    title: getDictionary(locale).service.confirmation.referenceLabel,
    description: definition.start.title[locale],
    path: `/do/${service}/${segment}/confirm`,
  });
}

export default async function ServiceSubjectConfirmPage({ params }: { params: Promise<Params> }) {
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

  const reference = await readConfirmationCookie(subjectDraftScope(service, segment));

  if (!reference) {
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

  // Only a service that has actually agreed a turnaround states one. See
  // `publishStandard` in `lib/services/defineService.ts` for why the default
  // is silence.
  const standardMessage = definition.publishStandard
    ? doDict.do.confirmation.standardMessage.replace("{hours}", String(definition.standardHours))
    : undefined;

  return (
    <>
      <ServiceNavigation
        locale={locale}
        serviceName={definition.start.title[locale]}
        links={chassisServiceNavLinks(definition, locale, "other")}
        ariaLabelTemplate={dict.a11y.serviceNavigation}
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <ConfirmationPanel
          heading={doDict.do.confirmation.heading}
          reference={reference}
          referenceLabel={dict.service.confirmation.referenceLabel}
          saveReferenceMessage={dict.service.confirmation.saveReference}
          standardMessage={standardMessage}
        />
      </div>
    </>
  );
}
