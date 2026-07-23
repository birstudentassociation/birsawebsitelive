import Image from "next/image";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";
import Tag from "@/components/Tag";
import QuickIconGlyph from "@/components/quick/QuickIcon";
import { quickGroups, type QuickItem } from "@/content/quick";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const title = lang === "th" ? "ทางลัด" : "Quick actions";
  return buildMetadata({
    locale: lang,
    title: `${title}: ${dict.site.name}`,
    description: dict.site.description,
    path: "/quick",
  });
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="text-muted h-4 w-4 shrink-0">
      <path
        d="m7.5 4.5 5 5.5-5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuickLinkRow({
  item,
  locale,
  newTabLabel,
  comingSoonLabel,
}: {
  item: QuickItem;
  locale: Locale;
  newTabLabel: string;
  comingSoonLabel: string;
}) {
  const copy = item[locale];
  const rowClasses =
    "border-line bg-surface flex min-h-14 w-full items-center gap-3 rounded-lg border p-3.5 shadow-sm transition-shadow duration-150";

  // The email item's hint is the address itself; never render it as
  // plaintext (it would leak to scrapers even without an <a href>), so this
  // row skips the hint and instead makes the whole row a scrape-proof
  // <Email> link (entity-encoded) using the stretched-link pattern: the
  // visible icon/label stay as plain markup, and an invisible full-area
  // <Email> anchor on top supplies the accessible name and click target.
  const isEmail = item.icon === "email" && !item.placeholder;

  const icon = (
    <span className="text-brand-deep bg-brand-tint flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
      <QuickIconGlyph icon={item.icon} />
    </span>
  );

  const content = (
    <>
      {icon}
      <span className="min-w-0 flex-1">
        {isEmail ? (
          // The whole row is the <Email> stretched link (see below), so
          // this label is decorative markup duplicating its accessible
          // name; hide it from assistive tech to avoid double-announcing.
          <span className="text-ink block font-semibold" aria-hidden="true">
            {copy.label}
          </span>
        ) : (
          <span className="text-ink block font-semibold">{copy.label}</span>
        )}
        {copy.hint && !isEmail ? (
          <span className="text-muted block text-sm">{copy.hint}</span>
        ) : null}
      </span>
    </>
  );

  if (item.placeholder) {
    return (
      <div className={rowClasses} aria-disabled="true">
        {content}
        <Tag variant="neutral" className="shrink-0">
          {comingSoonLabel}
        </Tag>
      </div>
    );
  }

  if (isEmail) {
    // Each email row links to its own address, derived from the item's own
    // `mailto:` href rather than a hardcoded contact address, so multiple
    // email items (primary/secondary) can share this row treatment.
    const address = item.href.replace(/^mailto:/, "");
    return (
      <div className={`${rowClasses} relative`}>
        {content}
        <ChevronIcon />
        {/* Stretched link: a full-area anchor on top of the row supplies
            the accessible name and the scrape-proof mailto href. Its own
            text is rendered transparent (not hidden; hidden/zero-size
            text wouldn't cover the row) since the icon/label/chevron
            above already show the same information to sighted users; the
            global :focus-visible outline still renders on top. */}
        <Email
          address={address}
          label={copy.label}
          className="absolute inset-0 rounded-lg text-transparent"
        />
      </div>
    );
  }

  if (item.external) {
    return (
      <ExternalLink
        href={item.href}
        newTabLabel={newTabLabel}
        className={`${rowClasses} focus-halo hover:shadow-md`}
      >
        {content}
        <ChevronIcon />
      </ExternalLink>
    );
  }

  return (
    <a href={localeHref(locale, item.href)} className={`${rowClasses} focus-halo hover:shadow-md`}>
      {content}
      <ChevronIcon />
    </a>
  );
}

export default async function QuickActionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const heading = locale === "th" ? "ทางลัด" : "Quick actions";
  const comingSoonLabel = locale === "th" ? "เร็ว ๆ นี้" : "Coming soon";

  return (
    <div className="wrap flex flex-col items-center py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Image src="/birsa-logo.png" alt="" width={40} height={40} className="h-10 w-10" />
          <h1 className="font-display text-2xl">{heading}</h1>
        </div>

        <div className="flex flex-col gap-8">
          {quickGroups.map((group) => (
            <nav key={group.key} aria-label={group[locale].heading}>
              <h2 className="text-muted mb-3 text-sm font-semibold tracking-wide uppercase">
                {group[locale].heading}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.key}>
                    <QuickLinkRow
                      item={item}
                      locale={locale}
                      newTabLabel={dict.a11y.newTab}
                      comingSoonLabel={comingSoonLabel}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </div>
  );
}
