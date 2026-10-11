import Link from "next/link";
import Email from "@/components/Email";
import ExternalLink from "@/components/ExternalLink";
import { birOffice } from "@/content/site";
import { telHref } from "@/content/emergency/contacts";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";

/** The path of the "Contact the BIR office" section of the About BIR guide, in `locale`. */
export function birOfficeContactHref(locale: Locale): string {
  return `${localeHref(locale, birOffice.contactPath)}#${birOffice.contactAnchor[locale]}`;
}

/** The office's phone number as written in `locale`, e.g. "02-221-6111 ext. 3409". */
export function birOfficePhoneText(locale: Locale): string {
  const { phone, ext } = birOffice.phone;
  return `${phone} ${locale === "th" ? "ต่อ" : "ext."} ${ext}`;
}

const copy: Record<Locale, { email: string; phone: string; website: string; details: string }> = {
  en: {
    email: "Email",
    phone: "Phone",
    website: "Website",
    details: "Opening hours and address of the BIR office",
  },
  th: {
    email: "อีเมล",
    phone: "โทรศัพท์",
    website: "เว็บไซต์",
    details: "เวลาทำการและที่อยู่ของสำนักงานโครงการ BIR",
  },
};

/**
 * How to reach the BIR office: email, phone, website and a link to the guide
 * section with its address and opening hours. The one place these details are
 * set out for the routes that send a student's academic question to the
 * office, so each reads the same and takes them from `content/site.ts`.
 */
export default function BirOfficeContact({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const t = copy[locale];
  const newTab = getDictionary(locale).a11y.newTab;
  return (
    <div className={className}>
      <dl className="flex flex-col gap-3 text-sm">
        <div>
          <dt className="font-semibold text-ink">{t.email}</dt>
          <dd>
            <Email address={birOffice.email} className="text-brand-deep hover:text-brand-dark" />
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">{t.phone}</dt>
          <dd>
            <a
              href={telHref(birOffice.phone)}
              className="text-brand-deep hover:text-brand-dark hover:underline"
            >
              {birOfficePhoneText(locale)}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">{t.website}</dt>
          <dd>
            <ExternalLink
              href={birOffice.website}
              newTabLabel={newTab}
              className="text-brand-deep hover:text-brand-dark hover:underline"
            >
              {birOffice.websiteLabel}
            </ExternalLink>
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-sm">
        <Link
          href={birOfficeContactHref(locale)}
          className="font-semibold text-brand-deep hover:underline"
        >
          {t.details} &rarr;
        </Link>
      </p>
    </div>
  );
}
