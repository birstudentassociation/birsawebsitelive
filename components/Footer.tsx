import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localeHref } from "@/lib/i18n";
import { contact, officialLinks, socials } from "@/content/site";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";

export type FooterProps = {
  locale: Locale;
};

/** Renders a social entry: external link treatment unless it's a placeholder with no real destination. */
function SocialLink({
  social,
  locale,
  newTabLabel,
}: {
  social: (typeof socials)[number];
  locale: Locale;
  newTabLabel: string;
}) {
  if (social.placeholder) {
    return (
      <span className="text-muted inline-flex items-center gap-1.5">
        {social.label}
        <span className="bg-sunken rounded-full px-2 py-0.5 text-xs font-semibold">
          {locale === "th" ? "เร็ว ๆ นี้" : "coming soon"}
        </span>
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

export default function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-brand bg-sunken border-t-2">
      <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-display text-lg">{dict.site.name}</h2>
          <p className="text-muted mt-2 max-w-[28ch] text-sm">{dict.footer.tagline}</p>
        </div>

        <div>
          <h2 className="text-muted text-sm font-semibold tracking-wide uppercase">
            {dict.footer.explore}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {dict.nav.map((item) => (
              <li key={item.href}>
                <Link href={localeHref(locale, item.href)} className="hover:text-brand-deep">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-muted text-sm font-semibold tracking-wide uppercase">
            {dict.footer.followUs}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {socials.map((social) => (
              <li key={social.id}>
                <SocialLink social={social} locale={locale} newTabLabel={dict.a11y.newTab} />
              </li>
            ))}
          </ul>

          <h2 className="text-muted mt-6 text-sm font-semibold tracking-wide uppercase">
            {dict.footer.contact}
          </h2>
          <ul className="text-muted mt-3 space-y-2 text-sm">
            <li>
              <Email address={contact.email} className="hover:text-brand-deep" />
            </li>
            <li>
              <Email address={contact.secondaryEmail} className="hover:text-brand-deep" />
            </li>
            <li>{contact.phone}</li>
            <li className="max-w-[32ch]">{contact.address[locale]}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-muted text-sm font-semibold tracking-wide uppercase">
            {dict.footer.officialLinks}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
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
          </ul>
        </div>
      </div>

      <div className="border-line-strong border-t">
        <div className="wrap text-muted flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href={localeHref(locale, "/standards#accessibility")}
              className="hover:text-brand-deep"
            >
              {dict.footer.accessibility}
            </Link>
            <Link href={localeHref(locale, "/standards")} className="hover:text-brand-deep">
              {dict.footer.standards}
            </Link>
            <Link href={localeHref(locale, "/privacy")} className="hover:text-brand-deep">
              {dict.footer.privacy}
            </Link>
            <Link href={localeHref(locale, "/emergency")} className="hover:text-brand-deep">
              {dict.footer.emergency}
            </Link>
          </div>
          <p className="max-w-[48ch]">{dict.footer.openInfo}</p>
        </div>
        <div className="wrap text-muted flex flex-col gap-1 pb-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dict.footer.rights}
          </p>
          <p>{dict.footer.builtNote}</p>
        </div>
      </div>
    </footer>
  );
}
