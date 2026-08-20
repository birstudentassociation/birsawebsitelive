import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import { readConfirmationCookie } from "@/lib/services/draft";
import ConfirmationPanel from "@/components/bds/ConfirmationPanel";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import { Heading, Text } from "@/components/bds/Type";
import { Stack, Wrap, Section } from "@/components/bds/Layout";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";

type Params = { lang: string; service: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition) return {};
  return buildMetadata({
    locale,
    title: getDictionary(locale).service.confirmation.referenceLabel,
    description: definition.start.title[locale],
    path: `/do/${service}/confirm`,
  });
}

/**
 * `/do/[service]/confirm` (REDESIGN-2.0 §5.1 item 4). Reads the reference
 * from `lib/services/draft.ts`'s short-lived confirmation cookie, written by
 * `submitCheckAnswers` the instant a submission succeeds. A reader who lands
 * here with no cookie (the link was bookmarked, or the 30-minute window
 * passed) sees `ServiceUnavailable`-style copy rather than a panel with a
 * blank reference, since there is nothing true left to confirm.
 */
export default async function ServiceConfirmPage({ params }: { params: Promise<Params> }) {
  const { lang, service } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const doDict = getDoDictionary(locale);
  const definition = getService(service);

  if (!definition) {
    return <ServiceUnavailable locale={locale} />;
  }

  const reference = await readConfirmationCookie(service);

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

  const standardMessage = doDict.do.confirmation.standardMessage.replace(
    "{hours}",
    String(definition.standardHours)
  );

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
