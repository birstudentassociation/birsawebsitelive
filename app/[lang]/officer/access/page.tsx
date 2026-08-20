import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localeHref, formatDate, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import PageHeader from "@/components/bds/PageHeader";
import Notice from "@/components/bds/Notice";
import Table, { type TableColumn } from "@/components/bds/Table";
import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";
import { Wrap, Stack, Section } from "@/components/bds/Layout";
import { getSessionOfficer } from "@/lib/inventory/auth";
import { isInventoryConfigured } from "@/lib/inventory/db";
import {
  getOfficerAccessRegister,
  getStudioAccessRegisterBlockedOnGate1,
  capabilityLabel,
  STUDIO_HALF_BLOCKED_ON_GATE_1,
  type AccessEntry,
} from "@/lib/officer/accessRegister";
import { computeAccessDrift, type CapabilityHolders } from "@/lib/officer/drift";
import type { Dictionary } from "@/lib/i18n";

/**
 * `/officer/access`, the single access register (REDESIGN-2.0 section 6.8).
 *
 * Two systems, one register: the officers table, read for real, and the
 * Sanity Studio half, which is blocked on gate 1
 * (docs/DECISIONS-2.0.md) and says so on this page rather than rendering an
 * empty section that could pass for "checked, and empty." The most
 * important judgement in this page is exactly that distinction: a register
 * that silently shows half the access and looks complete is worse than one
 * that admits what it cannot see.
 *
 * Gated to the admin console role, the same way
 * `app/[lang]/officer/inventory/officers/page.tsx` gates its own
 * officer-account management screen: this page lists every officer's name,
 * email, portfolio and term end in one place, which is exactly the kind of
 * page the two-person rule and PDPA both want behind the narrowest role
 * that still does the job, not every signed-in officer.
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
    title: dict.officerAccess.metaTitle,
    description: dict.officerAccess.metaDescription,
    path: "/officer/access",
  });
  return { ...metadata, robots: { index: false, follow: false } };
}

export default async function OfficerAccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.officerAccess;

  const officer = await getSessionOfficer();

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.consoleHomeLabel, href: "/officer" },
              { label: t.title },
            ]}
          />
        }
        helpSlot={
          <Button variant="ghost" href={localeHref(locale, "/contact")}>
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Section>
        <Wrap>
          {!officer ? (
            <Stack gap="md" className="max-w-md">
              <Notice variant="info" title={t.signInNeededTitle}>
                {t.signInNeededBody}
              </Notice>
              <div>
                <Button href={localeHref(locale, "/officer")}>{t.signInLink}</Button>
              </div>
            </Stack>
          ) : officer.role !== "admin" ? (
            <Notice variant="warning" title={t.adminsOnlyTitle} className="max-w-md">
              {t.adminsOnlyBody}
            </Notice>
          ) : !isInventoryConfigured() ? (
            <Notice variant="warning" title={t.dbNotConfiguredTitle} className="max-w-md">
              {t.dbNotConfiguredBody}
            </Notice>
          ) : (
            <AccessRegisterContent locale={locale} dict={dict} />
          )}
        </Wrap>
      </Section>
    </>
  );
}

/** A term end, past-due, or the null case, rendered as plain visible text (never colour alone). */
function termEndText(
  entry: AccessEntry,
  locale: Locale,
  t: Dictionary["officerAccess"],
  todayIso: string
): string {
  if (entry.termEnd === null) {
    return t.noTermEndText;
  }
  const formatted = formatDate(locale, entry.termEnd);
  const isPast = entry.termEnd.slice(0, 10) < todayIso;
  return isPast ? `${formatted} (${t.termEndedSuffix})` : formatted;
}

/** A portfolio, the global case, or an unrecognised stored value, rendered as plain visible text. */
function portfolioText(entry: AccessEntry, locale: Locale, t: Dictionary["officerAccess"]): string {
  if (entry.portfolioId) {
    return capabilityLabel({ kind: "portfolio", portfolioId: entry.portfolioId }, locale);
  }
  if (entry.portfolioRaw === null) {
    return t.noPortfolioText;
  }
  return `${entry.portfolioRaw} ${t.unrecognisedPortfolioSuffix}`;
}

async function AccessRegisterContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.officerAccess;
  const [officers, studioMembers] = await Promise.all([
    getOfficerAccessRegister(),
    getStudioAccessRegisterBlockedOnGate1(),
  ]);
  const asOf = new Date();
  const todayIso = asOf.toISOString().slice(0, 10);
  const drift = computeAccessDrift(officers, studioMembers, asOf);

  const officerColumns: TableColumn[] = [
    { key: "name", header: t.colName },
    { key: "email", header: t.colEmail },
    { key: "role", header: t.colRole },
    { key: "portfolio", header: t.colPortfolio },
    { key: "termEnd", header: t.colTermEnd },
    { key: "status", header: t.colStatus },
  ];

  const officerRows = officers.map((entry) => ({
    id: entry.id,
    name: entry.name,
    email: entry.email,
    role: capabilityLabel({ kind: "role", role: entry.role }, locale),
    portfolio: portfolioText(entry, locale, t),
    termEnd: termEndText(entry, locale, t, todayIso),
    status: entry.isActive ? t.statusActive : t.statusInactive,
  }));

  return (
    <Stack gap="lg">
      <div className="flex flex-col gap-4">
        <div>
          <Heading level={2}>{t.officersHeading}</Heading>
          <Text step="body-sm" className="mt-1 text-muted">
            {t.officersLede}
          </Text>
        </div>
        {officers.length === 0 ? (
          <Text step="body-sm" className="text-muted">
            {t.officersEmpty}
          </Text>
        ) : (
          <Table
            caption={t.officersCaption}
            captionHidden
            columns={officerColumns}
            rows={officerRows}
            rowKey={(row) => String(row.id)}
            rowHeaders
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Heading level={2}>{t.studioHeading}</Heading>
        <Notice variant="warning" title={t.studioBlockedTitle}>
          {t.studioBlockedBody}
        </Notice>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <Heading level={2}>{t.driftHeading}</Heading>
          <Text step="body-sm" className="mt-1 text-muted">
            {t.driftLede}
          </Text>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level={3} step="heading-3">
            {t.pastTermEndHeading}
          </Heading>
          {drift.pastTermEnd.length === 0 ? (
            <Notice variant="success">{t.pastTermEndEmpty}</Notice>
          ) : (
            <Table
              caption={t.pastTermEndHeading}
              captionHidden
              columns={[
                { key: "name", header: t.colName },
                { key: "email", header: t.colEmail },
                { key: "termEnd", header: t.colTermEnd },
              ]}
              rows={drift.pastTermEnd.map((entry) => ({
                id: entry.id,
                name: entry.name,
                email: entry.email,
                termEnd: termEndText(entry, locale, t, todayIso),
              }))}
              rowKey={(row) => String(row.id)}
              rowHeaders
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Heading level={3} step="heading-3">
            {t.noTermEndHeading}
          </Heading>
          {drift.noTermEnd.length === 0 ? (
            <Notice variant="success">{t.noTermEndEmpty}</Notice>
          ) : (
            <Table
              caption={t.noTermEndHeading}
              captionHidden
              columns={[
                { key: "name", header: t.colName },
                { key: "email", header: t.colEmail },
                { key: "role", header: t.colRole },
              ]}
              rows={drift.noTermEnd.map((entry) => ({
                id: entry.id,
                name: entry.name,
                email: entry.email,
                role: capabilityLabel({ kind: "role", role: entry.role }, locale),
              }))}
              rowKey={(row) => String(row.id)}
              rowHeaders
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Heading level={3} step="heading-3">
            {t.underStaffedHeading}
          </Heading>
          {drift.underStaffedCapabilities.length === 0 ? (
            <Notice variant="success">{t.underStaffedEmpty}</Notice>
          ) : (
            <Table
              caption={t.underStaffedHeading}
              captionHidden
              columns={[
                { key: "capability", header: t.underStaffedCapabilityCol },
                { key: "holders", header: t.underStaffedHoldersCol },
              ]}
              rows={drift.underStaffedCapabilities.map((group: CapabilityHolders) => ({
                id: capabilityRowKey(group),
                capability: capabilityLabel(group.capability, locale),
                holders: group.holders.map((h) => h.name).join(", "),
              }))}
              rowKey={(row) => String(row.id)}
              rowHeaders
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Heading level={3} step="heading-3">
            {t.studioDriftHeading}
          </Heading>
          {STUDIO_HALF_BLOCKED_ON_GATE_1 ? (
            <Notice variant="warning">{t.studioDriftBlockedBody}</Notice>
          ) : drift.studioWithoutOfficer.length === 0 ? (
            <Notice variant="success">{t.studioDriftEmpty}</Notice>
          ) : (
            <Table
              caption={t.studioDriftHeading}
              captionHidden
              columns={[
                { key: "name", header: t.colName },
                { key: "email", header: t.colEmail },
              ]}
              rows={drift.studioWithoutOfficer.map((member) => ({
                id: member.email,
                name: member.name ?? member.email,
                email: member.email,
              }))}
              rowKey={(row) => String(row.id)}
              rowHeaders
            />
          )}
        </div>
      </div>
    </Stack>
  );
}

function capabilityRowKey(group: CapabilityHolders): string {
  return group.capability.kind === "portfolio"
    ? `portfolio:${group.capability.portfolioId}`
    : `role:${group.capability.role}`;
}
