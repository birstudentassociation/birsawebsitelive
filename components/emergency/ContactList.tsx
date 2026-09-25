import { getContact, telHref } from "@/content/emergency/contacts";
import type { Locale } from "@/lib/i18n";
import Email from "@/components/Email";
import ExternalLink from "@/components/ExternalLink";

type Props = {
  locale: Locale;
  ids: string[];
  /** dict.emergencyPage.ext */
  extLabel: string;
  /** dict.a11y.newTab */
  newTabLabel: string;
};

const linkClass = "font-semibold text-ink underline hover:text-brand-deep";

/** Every contact for a guide: name, how to reach it, and when. */
export default function ContactList({ locale, ids, extLabel, newTabLabel }: Props) {
  return (
    <ul className="flex flex-col divide-y divide-line border-y border-line">
      {ids.map((id) => {
        const contact = getContact(id);
        if (!contact) return null;
        return (
          <li key={id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
            <div className="flex-1">
              <p className="font-medium text-ink">{contact.name[locale]}</p>
              {contact.note ? (
                <p className="text-sm leading-relaxed text-muted">{contact.note[locale]}</p>
              ) : null}
            </div>
            <div className="shrink-0 sm:text-right">
              {contact.kind === "phone" ? (
                <a href={telHref(contact)} className={`${linkClass} tabular-nums`}>
                  {contact.phone}
                  {contact.ext ? ` ${extLabel} ${contact.ext}` : ""}
                </a>
              ) : contact.kind === "email" ? (
                <Email address={contact.email} className={linkClass} />
              ) : (
                <ExternalLink href={contact.url} newTabLabel={newTabLabel} className={linkClass}>
                  {contact.display}
                </ExternalLink>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
