import { getContact, telHref } from "@/content/emergency/contacts";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  /** Contact ids; anything that is not a phone line is skipped. */
  ids: string[];
  /** dict.emergencyPage.ext */
  extLabel: string;
};

/** Large tap targets that dial straight away, one per key phone line. */
export default function CallButtons({ locale, ids, extLabel }: Props) {
  const phones = ids.flatMap((id) => {
    const contact = getContact(id);
    return contact?.kind === "phone" ? [{ id, contact }] : [];
  });
  if (phones.length === 0) return null;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {phones.map(({ id, contact }) => (
        <li key={id}>
          <a
            href={telHref(contact)}
            className="flex h-full flex-col rounded-md border-2 border-ink bg-surface px-4 py-3 hover:bg-cream focus-visible:outline-offset-2"
          >
            <span className="text-2xl font-semibold text-ink tabular-nums">
              {contact.phone}
              {contact.ext ? ` ${extLabel} ${contact.ext}` : ""}
            </span>
            <span className="text-sm text-muted">{contact.name[locale]}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
