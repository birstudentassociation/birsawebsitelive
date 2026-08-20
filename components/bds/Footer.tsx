import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { getDictionary, localeHref } from "@/lib/i18n";
import { contact, officialLinks, socials } from "@/content/site";
import { defaultPrimaryNav, type NavLink } from "@/components/bds/Header";
import { Heading, Text } from "@/components/bds/Type";
import { Stack, Wrap } from "@/components/bds/Layout";
import ExternalLink from "@/components/bds/ExternalLink";
import Email from "@/components/bds/Email";

/**
 * BIRSA Design System: `Footer` (REDESIGN-2.0 §3.2, §3.3, §4.3, navigation
 * cluster).
 *
 * Site chrome, once per page. Link groups are editable documents, not code
 * (§3.3 usage rule): `groups` is a typed prop, and `defaultFooterGroups`
 * below, built from `Header`'s `defaultPrimaryNav`, is the seam the CMS
 * fills once it exists (docs/DECISIONS-2.0.md gate 1). The utility row at
 * the very bottom (accessibility, standards, privacy, cookies, emergency)
 * stays hardcoded: `docs/ROUTE-MAP-2.0.md` lists those as fixed utility
 * routes that are "never nav items" precisely because officers must not be
 * able to remove the accessibility statement or the privacy notice from
 * every page's footer, which is what an editable document there would
 * allow.
 */

export type FooterNavGroup = {
  id: string;
  title: { th: string; en: string };
  links: NavLink[];
};

/** Reuses the five primary destinations (§3.2) as the footer's "Explore" column. */
export const defaultFooterGroups: FooterNavGroup[] = [
  {
    id: "explore",
    title: { en: "Explore", th: "สำรวจ" },
    links: defaultPrimaryNav,
  },
];

export type FooterProps = {
  locale: Locale;
  /** Defaults to `defaultFooterGroups`. See the file header note on why this is a prop. */
  groups?: FooterNavGroup[];
};

/** Renders a social entry: external link treatment unless it is a placeholder with no real destination. */
function SocialLink({
  social,
  newTabLabel,
  comingSoonLabel,
}: {
  social: (typeof socials)[number];
  newTabLabel: string;
  comingSoonLabel: string;
}) {
  if (social.placeholder) {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted">
        <Text as="span" step="body-sm">
          {social.label}
        </Text>
        <Text as="span" step="body-sm" className="rounded-full bg-sunken px-2 py-0.5 font-semibold">
          {comingSoonLabel}
        </Text>
      </span>
    );
  }

  if (social.id === "email") {
    return <Email address={contact.email} label={social.label} className="hover:text-brand-deep" />;
  }

  return (
    <ExternalLink href={social.href} newTabLabel={newTabLabel} className="hover:text-brand-deep">
      {social.label}
    </ExternalLink>
  );
}

export default function Footer({ locale, groups = defaultFooterGroups }: FooterProps) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();
  const comingSoonLabel = locale === "th" ? "เร็ว ๆ นี้" : "coming soon";

  return (
    <footer className="border-t-2 border-brand bg-sunken">
      <Wrap>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Heading level={2} step="heading-3" className="font-display">
              {dict.site.name}
            </Heading>
            <Text step="body-sm" className="mt-2 max-w-[28ch] text-muted">
              {dict.footer.tagline}
            </Text>
          </div>

          <nav aria-label={dict.a11y.footerNav}>
            <Stack gap="lg">
              {groups.map((group) => (
                <div key={group.id}>
                  <Heading level={2} step="body-sm" className="font-semibold tracking-wide text-muted uppercase">
                    {group.title[locale]}
                  </Heading>
                  <Stack as="ul" gap="2xs" className="mt-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={localeHref(locale, link.href)} className="hover:text-brand-deep">
                          <Text as="span" step="body-sm">
                            {link.label[locale]}
                          </Text>
                        </Link>
                      </li>
                    ))}
                  </Stack>
                </div>
              ))}
            </Stack>
          </nav>

          <div>
            <Heading level={2} step="body-sm" className="font-semibold tracking-wide text-muted uppercase">
              {dict.footer.followUs}
            </Heading>
            <Stack as="ul" gap="2xs" className="mt-3">
              {socials.map((social) => (
                <li key={social.id}>
                  <SocialLink
                    social={social}
                    newTabLabel={dict.a11y.newTab}
                    comingSoonLabel={comingSoonLabel}
                  />
                </li>
              ))}
            </Stack>

            <Heading level={2} step="body-sm" className="mt-6 font-semibold tracking-wide text-muted uppercase">
              {dict.footer.contact}
            </Heading>
            <Stack as="ul" gap="2xs" className="mt-3 text-muted">
              <li>
                <Email address={contact.email} className="hover:text-brand-deep" />
              </li>
              <li>
                <Email address={contact.secondaryEmail} className="hover:text-brand-deep" />
              </li>
              <li>
                <Text as="span" step="body-sm">
                  {contact.phone}
                </Text>
              </li>
              <li className="max-w-[32ch]">
                <Text as="span" step="body-sm">
                  {contact.address[locale]}
                </Text>
              </li>
            </Stack>
          </div>

          <div>
            <Heading level={2} step="body-sm" className="font-semibold tracking-wide text-muted uppercase">
              {dict.footer.officialLinks}
            </Heading>
            <Stack as="ul" gap="2xs" className="mt-3">
              {officialLinks.map((link) => (
                <li key={link.id}>
                  <ExternalLink
                    href={link.href}
                    newTabLabel={dict.a11y.newTab}
                    className="hover:text-brand-deep"
                  >
                    {link.label[locale]}
                  </ExternalLink>
                </li>
              ))}
            </Stack>
          </div>
        </div>
      </Wrap>

      <div className="border-t border-line-strong">
        <Wrap>
          <div className="flex flex-col gap-3 py-6 text-muted sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link href={localeHref(locale, "/standards#accessibility")} className="hover:text-brand-deep">
                <Text as="span" step="body-sm">
                  {dict.footer.accessibility}
                </Text>
              </Link>
              <Link href={localeHref(locale, "/standards")} className="hover:text-brand-deep">
                <Text as="span" step="body-sm">
                  {dict.footer.standards}
                </Text>
              </Link>
              <Link href={localeHref(locale, "/privacy")} className="hover:text-brand-deep">
                <Text as="span" step="body-sm">
                  {dict.footer.privacy}
                </Text>
              </Link>
              <Link href={localeHref(locale, "/privacy/cookies")} className="hover:text-brand-deep">
                <Text as="span" step="body-sm">
                  {dict.footer.cookies}
                </Text>
              </Link>
              <Link href={localeHref(locale, "/emergency")} className="hover:text-brand-deep">
                <Text as="span" step="body-sm">
                  {dict.footer.emergency}
                </Text>
              </Link>
            </div>
            <Text step="body-sm" className="max-w-[48ch]">
              {dict.footer.openInfo}
            </Text>
          </div>
          <div className="flex flex-col gap-1 pb-6 text-muted sm:flex-row sm:items-center sm:justify-between">
            <Text as="p" step="body-sm">
              © {year} {dict.footer.rights}
            </Text>
            <Text as="p" step="body-sm">
              {dict.footer.builtNote}
            </Text>
          </div>
        </Wrap>
      </div>
    </footer>
  );
}
