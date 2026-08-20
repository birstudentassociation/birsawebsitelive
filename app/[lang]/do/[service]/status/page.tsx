import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getService } from "@/lib/services/registry";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";
import StatusLookupClient from "@/app/[lang]/do/StatusLookupClient";
import { lookupServiceStatus } from "@/app/[lang]/do/actions";

type Params = { lang: string; service: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition) return {};
  return buildMetadata({
    locale,
    title: getDictionary(locale).service.statusLookup.heading,
    description: definition.start.title[locale],
    path: `/do/${service}/status`,
  });
}

/**
 * `/do/[service]/status` (REDESIGN-2.0 §5.1 item 5, ROUTE-MAP-2.0). No
 * account, ever: a reference number plus one corroborating detail
 * (`lib/services/status.ts`).
 */
export default async function ServiceStatusPage({ params }: { params: Promise<Params> }) {
  const { lang, service } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const doDict = getDoDictionary(locale);
  const definition = getService(service);

  if (!definition) {
    return <ServiceUnavailable locale={locale} />;
  }

  return (
    <>
      <ServiceNavigation
        locale={locale}
        serviceName={definition.start.title[locale]}
        links={chassisServiceNavLinks(definition, locale, "status")}
        ariaLabelTemplate={dict.a11y.serviceNavigation}
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <StatusLookupClient
          locale={locale}
          action={lookupServiceStatus.bind(null, service)}
          labels={{
            heading: dict.service.statusLookup.heading,
            intro: doDict.do.statusLookup.intro,
            referenceLabel: doDict.do.statusLookup.referenceLabel,
            referenceHint: doDict.do.statusLookup.referenceHint,
            detailLabel: doDict.do.statusLookup.detailLabel,
            submitLabel: dict.service.statusLookup.submitLabel,
            errorSummaryTitle: dict.form.errorSummaryTitle,
            invalid: doDict.do.statusLookup.invalidBody,
            notFoundTitle: doDict.do.statusLookup.notFoundTitle,
            notFoundBody: doDict.do.statusLookup.notFoundBody,
            errorTitle: doDict.do.statusLookup.errorTitle,
            errorBody: doDict.do.statusLookup.errorBody,
            rateLimited: doDict.do.rateLimited,
            resultHeading: doDict.do.statusLookup.resultHeading,
            statusLabel: doDict.do.statusLookup.statusLabel,
            submittedLabel: doDict.do.statusLookup.submittedLabel,
            statusText: {
              received: doDict.do.status.received,
              "in-progress": doDict.do.status.inProgress,
              done: doDict.do.status.done,
            },
          }}
        />
      </div>
    </>
  );
}
