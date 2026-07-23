import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getScenario, hasScenario, scenarioIds } from "@/content/emergency/scenarios";
import { scenarioContent, type EmergencySeverity } from "@/content/emergency/types";
import EmergencyHero from "@/components/EmergencyHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";
import { contact, socials } from "@/content/site";

type Params = { lang: string; scenario: string };

/** Severity badge (border + tint) and its accompanying dot colour. */
const severityBadge: Record<EmergencySeverity, string> = {
  critical: "border-error bg-error-tint",
  warning: "border-warning bg-warning-tint",
  info: "border-forest bg-forest-tint",
};
const severityDot: Record<EmergencySeverity, string> = {
  critical: "bg-error",
  warning: "bg-warning",
  info: "bg-forest",
};

export function generateStaticParams() {
  return scenarioIds.map((scenario) => ({ scenario }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, scenario } = await params;
  if (!isLocale(lang) || !hasScenario(scenario)) return {};
  const locale: Locale = lang;
  const c = scenarioContent(getScenario(scenario), locale);

  // Deliberately unindexed: emergency pages only matter while an incident is
  // active, and must never rank in search or appear on the sitemap.
  return {
    ...buildMetadata({
      locale,
      title: c.title,
      description: c.lede,
      path: `/emergency/${scenario}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function EmergencyScenarioPage({ params }: { params: Promise<Params> }) {
  const { lang, scenario } = await params;
  if (!isLocale(lang) || !hasScenario(scenario)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.emergencyPage;
  const s = getScenario(scenario);
  const c = scenarioContent(s, locale);

  const firstAction = c.immediateActions[0];
  const keyNumbers = c.extraContacts?.filter((item) => item.href?.startsWith("tel:")) ?? [];

  return (
    <>
      <EmergencyHero
        scenarioId={s.id}
        title={c.title}
        lede={c.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            onDark
            items={[{ label: t.breadcrumb, href: "/emergency" }, { label: c.title }]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <section
          aria-labelledby="at-a-glance"
          className="border-line bg-surface flex flex-col gap-4 rounded-lg border p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="at-a-glance" className="font-display text-xl">
              {t.atAGlance}
            </h2>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${severityBadge[s.severity]}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${severityDot[s.severity]}`}
                aria-hidden="true"
              />
              {t.alertLevel}: {t.severity[s.severity]}
            </span>
          </div>

          {firstAction ? (
            <div className="flex flex-col gap-1">
              <p className="text-muted text-sm font-medium">{t.doThisFirst}</p>
              <p className="text-ink leading-relaxed">{firstAction}</p>
            </div>
          ) : null}

          {keyNumbers.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-muted text-sm font-medium">{t.keyNumbers}</p>
              <ul className="flex flex-wrap gap-2">
                {keyNumbers.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="border-line bg-cream hover:border-brand-deep inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
                    >
                      <span className="text-muted">{item.label}</span>
                      <span className="text-ink font-semibold">{item.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t.whatToDo}</h2>
          <ol className="text-ink flex list-decimal flex-col gap-2 pl-5 leading-relaxed">
            {c.immediateActions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        {c.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{section.heading}</h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph} className="text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.items ? (
              <ul className="text-muted flex list-disc flex-col gap-2 pl-5 leading-relaxed">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t.usefulContacts}</h2>
          {c.extraContacts && c.extraContacts.length > 0 ? (
            <ul className="text-ink flex flex-col gap-2">
              {c.extraContacts.map((item) => (
                <li key={item.label} className="flex flex-wrap gap-x-2">
                  <span className="font-medium">{item.label}:</span>
                  {item.href ? (
                    <a href={item.href} className="hover:text-brand-deep underline">
                      {item.value}
                    </a>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}

          <h3 className="mt-2 font-medium">{t.birsaContacts}</h3>
          <ul className="text-muted flex flex-col gap-2 text-sm">
            <li>
              <Email address={contact.email} className="hover:text-brand-deep underline" />
            </li>
            <li>
              <Email address={contact.secondaryEmail} className="hover:text-brand-deep underline" />
            </li>
            <li>
              {t.phone}: {contact.phone}
            </li>
            <li>
              {t.address}: {contact.address[locale]}
            </li>
            {socials
              .filter((social) => !social.placeholder && social.id !== "email")
              .map((social) => (
                <li key={social.id}>
                  <ExternalLink
                    href={social.href}
                    newTabLabel={dict.a11y.newTab}
                    className="hover:text-brand-deep underline"
                  >
                    {social.label}
                  </ExternalLink>
                </li>
              ))}
          </ul>
        </section>

        <p className="text-muted border-line border-t pt-6 text-sm leading-relaxed">
          {t.disclaimer}
        </p>
      </div>
    </>
  );
}
