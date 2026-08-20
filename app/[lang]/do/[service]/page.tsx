import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import { getService } from "@/lib/services/registry";
import StartPage from "@/components/bds/StartPage";
import ServiceNavigation from "@/components/bds/ServiceNavigation";
import ServiceUnavailable from "@/app/[lang]/do/ServiceUnavailable";
import { chassisServiceNavLinks } from "@/app/[lang]/do/serviceNav";

type Params = { lang: string; service: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, service } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const definition = getService(service);
  if (!definition) return {};
  return buildMetadata({
    locale,
    title: definition.start.title[locale],
    description: definition.start.whoFor[locale],
    path: `/do/${service}`,
  });
}

/**
 * `/do/[service]` (REDESIGN-2.0 §5.1 item 1, ROUTE-MAP-2.0 "Wave 4A: the
 * service chassis routes"). The GDS start page, entirely driven by
 * `definition.start`: nothing here is service-specific beyond the
 * definition itself, which is the whole payoff of the chassis.
 */
export default async function ServiceStartPage({ params }: { params: Promise<Params> }) {
  const { lang, service } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const definition = getService(service);

  if (!definition) {
    return <ServiceUnavailable locale={locale} />;
  }

  const firstStep = definition.questions[0];
  const startHref = firstStep
    ? localeHref(locale, `/do/${definition.id}/${firstStep.id}`)
    : localeHref(locale, `/do/${definition.id}/check`);

  return (
    <>
      <ServiceNavigation
        locale={locale}
        serviceName={definition.start.title[locale]}
        links={chassisServiceNavLinks(definition, locale, "start")}
        ariaLabelTemplate={dict.a11y.serviceNavigation}
      />
      <div className="wrap max-w-[var(--measure)] py-10">
        <StartPage
          start={definition.start}
          locale={locale}
          href={startHref}
          labels={dict.service.startPage}
        />
      </div>
    </>
  );
}
