import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import PageHeader from "@/components/bds/PageHeader";
import Notice from "@/components/bds/Notice";
import Tag from "@/components/bds/Tag";
import Card, { CardTitle } from "@/components/bds/Card";
import Button from "@/components/bds/Button";
import NavList, { NavListItem } from "@/components/bds/NavList";
import { Text } from "@/components/bds/Type";
import { Wrap, Stack, Section } from "@/components/bds/Layout";
import OfficerLogin from "@/components/inventory/OfficerLogin";
import { LogoutButton } from "@/components/inventory/ConsoleGate";
import { getSessionOfficer, isInventoryAuthConfigured } from "@/lib/inventory/auth";

/**
 * `/officer`, the single door (REDESIGN-2.0 section 6.8, ROUTE-MAP-2.0 "Wave
 * 4C: the officer console"). Lifts the console up from
 * `/officer/inventory`, which keeps working unchanged at its own path: this
 * page adds a landing point above it rather than moving anything.
 *
 * Authenticated exactly the way `/officer/inventory` already is, through
 * `getSessionOfficer()` (`lib/inventory/auth.ts`) and the same session
 * cookie: the officer console has one login, and this page reuses the
 * existing `OfficerLogin` component rather than inventing a second auth
 * surface. Without JavaScript, `OfficerLogin`'s fallback form redirects to
 * `/officer/inventory` on success (its `returnTo` is fixed there, and that
 * file is outside this wave's owned paths), which still lands a signed-in
 * officer on a working console page.
 *
 * `force-dynamic` for the same reason `app/[lang]/officer/inventory/layout.tsx`
 * sets it: this page reads the session cookie and live data, and
 * `getSessionOfficer()` only short-circuits before touching `cookies()` when
 * the database is unconfigured (as it is during `next build`).
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  const metadata = buildMetadata({
    locale,
    title: dict.officerHub.metaTitle,
    description: dict.officerHub.metaDescription,
    path: "/officer",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

export default async function OfficerHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.officerHub;

  const officer = await getSessionOfficer();

  const helpSlot = officer ? (
    <div className="flex flex-wrap items-center gap-3">
      <LogoutButton locale={locale} />
      <Button variant="ghost" href={localeHref(locale, "/contact")}>
        {dict.actions.contactUs}
      </Button>
    </div>
  ) : (
    <Button variant="ghost" href={localeHref(locale, "/contact")}>
      {dict.actions.contactUs}
    </Button>
  );

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
        helpSlot={helpSlot}
      />
      <Section>
        <Wrap>
          {!officer ? (
            <Stack gap="lg" className="max-w-md">
              {!isInventoryAuthConfigured() ? (
                <Notice variant="warning" title={t.authNotConfiguredTitle}>
                  {t.authNotConfiguredBody}
                </Notice>
              ) : null}
              <OfficerLogin locale={locale} />
            </Stack>
          ) : (
            <Stack gap="lg">
              <Text step="body" className="text-muted">
                {t.greeting.replace("{name}", officer.name)}
              </Text>

              <NavList>
                <NavListItem
                  href={localeHref(locale, "/officer/inventory")}
                  title={t.inventoryTitle}
                >
                  {t.inventoryBody}
                </NavListItem>
                <NavListItem href={localeHref(locale, "/officer/access")} title={t.accessTitle}>
                  {t.accessBody}
                </NavListItem>
              </NavList>

              {/*
                The Studio link is deliberately not a NavListItem: it has
                nowhere to navigate to yet (REDESIGN-2.0 section 6.9, gate 1
                in docs/DECISIONS-2.0.md), and a NavListItem's whole contract
                is a working href. Rendering it as a plain Card with an
                explicit "not available yet" tag says so in the same place a
                reader would otherwise expect a working link, in visible
                text rather than only by the row being unclickable.
              */}
              <Card>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle level={3}>{t.studioTitle}</CardTitle>
                  <Tag variant="warning">{t.studioUnavailableTag}</Tag>
                </div>
                <Text step="body-sm" className="text-muted">
                  {t.studioBody}
                </Text>
                <Text step="body-sm" className="text-muted">
                  {t.studioUnavailableBody}
                </Text>
              </Card>
            </Stack>
          )}
        </Wrap>
      </Section>
    </>
  );
}
