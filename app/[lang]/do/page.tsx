import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { listServices } from "@/lib/services/registry";
import type { ServiceDefinition } from "@/lib/services/defineService";
import PageHeader from "@/components/bds/PageHeader";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";
import { Heading } from "@/components/bds/Type";
import { Section, Wrap } from "@/components/bds/Layout";
import { homeNamespace as homeEn } from "@/content/dictionaries/en/home";
import { homeNamespace as homeTh } from "@/content/dictionaries/th/home";

/**
 * `/do`, the service index (REDESIGN-2.0 §3.2, §5.2, ROUTE-MAP-2.0 "Wave 5A").
 *
 * "Every service, grouped by need: get help, borrow something, apply for
 * money, sign up, tell us something." Driven by `listServices()`
 * (`lib/services/registry.ts`), the registry's own published set, so a new
 * service appears here the moment it publishes, with no change to this file.
 * That is the entire point of the chassis (`lib/services/defineService.ts`'s
 * own header). `listServices()` already excludes anything that failed
 * `validateServiceDefinition`, so an unpublished or half-built definition
 * (`example-chassis-demo`, see that file's own header) never reaches this
 * page.
 *
 * GROUPING, AND THE GAP THIS PAGE FOUND. `ServiceDefinition`
 * (`lib/services/defineService.ts`, frozen) carries no "need" or "category"
 * field, so nothing in the chassis lets a service say which of §3.2's five
 * groups it belongs to. Rather than guess at a heuristic (question shape,
 * `subject` presence) or edit the frozen type, `SERVICE_CATEGORY` below is a
 * small, explicit, page-local lookup with a safe default: a service with no
 * entry lands in "Other services" rather than being dropped, so the "appears
 * without a code change" promise holds even for a service this page has
 * never heard of. Getting a NEW service into its correct group still needs
 * one line added here, which is a real gap and is reported as one in the
 * Wave 5A report, alongside gate 7's own precedent for this kind of finding.
 *
 * TWO GROUPS ARE CURATED LINKS, NOT REGISTRY SERVICES. "Sign up" carries
 * joining a club, and "tell us something" carries the contact route.
 * Neither is a `ServiceDefinition`: Decision 2 (`docs/DECISIONS-2.0.md`)
 * put joining a club under "Do something" while the clubs directory itself
 * stays at `/whats-on/clubs`, owned by another wave, and `/contact` is
 * already a live utility route (`docs/ROUTE-MAP-2.0.md`, "routes that do
 * not move"). Building an actual "join a club" or "contact BIRSA" chassis
 * service is out of scope here; linking to the real pages that already
 * exist, or will, is not.
 *
 * ONE SERVICE SHOULD NOT LOOK BROKEN, ELEVEN SHOULD NOT LOOK LIKE A WALL
 * (this wave's brief). Grouping into short, named sections each rendered as
 * a `NavList` (the job here is "pick where to go next", `NavList`'s own
 * usage rule) does both: a group with one row reads as a normal, short
 * list, not an error state, and a group that grows to several rows stays a
 * compact list of one-line rows rather than a grid of heavy cards. A group
 * with nothing in it (no service and no curated link) is not rendered at
 * all, which is currently "get help" and "apply for money": no chassis
 * service exists for either yet, and Decision 6 (`docs/DECISIONS-2.0.md`)
 * settled that BIRSA holds no welfare service at all, so "get help" has
 * nothing honest to link here (the primary nav's own `/help` already serves
 * that need).
 */
type DoCategory = "borrow" | "signUp" | "tellUs" | "other";

const CATEGORY_ORDER: DoCategory[] = ["borrow", "signUp", "tellUs", "other"];

/** See the file header, "GROUPING, AND THE GAP THIS PAGE FOUND". */
const SERVICE_CATEGORY: Record<string, DoCategory> = {
  "equipment-loan": "borrow",
};

function categoryFor(definition: ServiceDefinition): DoCategory {
  return SERVICE_CATEGORY[definition.id] ?? "other";
}

const homeCopy: Record<Locale, typeof homeEn> = { en: homeEn, th: homeTh };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = homeCopy[lang].doIndex;
  return buildMetadata({
    locale: lang,
    title: copy.title,
    description: copy.lede,
    path: "/do",
  });
}

export default async function DoIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = homeCopy[locale].doIndex;

  const servicesByCategory = new Map<DoCategory, ServiceDefinition[]>();
  for (const definition of listServices()) {
    const category = categoryFor(definition);
    const existing = servicesByCategory.get(category) ?? [];
    existing.push(definition);
    servicesByCategory.set(category, existing);
  }

  return (
    <>
      <PageHeader
        title={copy.title}
        lede={copy.lede}
        helpSlot={
          <Button href={localeHref(locale, "/help")} variant="ghost">
            {copy.helpLabel}
          </Button>
        }
      />

      <Section>
        <Wrap className="flex max-w-[var(--measure)] flex-col gap-10">
          {CATEGORY_ORDER.map((category) => {
            const services = servicesByCategory.get(category) ?? [];
            const staticItems =
              category === "signUp"
                ? [{ key: "joinClub" as const, href: "/whats-on/clubs" }]
                : category === "tellUs"
                  ? [{ key: "contact" as const, href: "/contact" }]
                  : [];

            if (services.length === 0 && staticItems.length === 0) return null;

            return (
              <div key={category}>
                <Heading level={2} step="heading-2">
                  {copy.categories[category]}
                </Heading>
                <NavList className="mt-4">
                  {services.map((definition) => (
                    <NavListItem
                      key={definition.id}
                      href={localeHref(locale, `/do/${definition.id}`)}
                      title={definition.start.title[locale]}
                      footnote={definition.start.howLong[locale]}
                    />
                  ))}
                  {staticItems.map(({ key, href }) => {
                    const item = copy.staticLinks[key];
                    return (
                      <NavListItem key={key} href={localeHref(locale, href)} title={item.label}>
                        {item.hint}
                      </NavListItem>
                    );
                  })}
                </NavList>
              </div>
            );
          })}
        </Wrap>
      </Section>
    </>
  );
}
