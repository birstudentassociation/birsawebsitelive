import ExternalLink from "@/components/ExternalLink";
import { telHref } from "@/content/emergency/contacts";
import type { DirectoryPhone, EmergencySection } from "@/content/emergency/types";

type Props = {
  section: EmergencySection;
  /** dict.emergencyPage.ext */
  extLabel: string;
  /** dict.a11y.newTab */
  newTabLabel: string;
};

/** One headed section of an emergency guide: paragraphs, steps, points, then a directory. */
export default function GuideSection({ section, extLabel, newTabLabel }: Props) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="flex scroll-mt-24 flex-col gap-3"
    >
      <h2 id={`${section.id}-heading`} className="font-display text-2xl">
        {section.heading}
      </h2>
      {section.body?.map((paragraph) => (
        <p key={paragraph} className="leading-relaxed text-ink">
          {paragraph}
        </p>
      ))}
      {section.steps ? (
        <ol className="flex list-decimal flex-col gap-2 pl-6 leading-relaxed text-ink">
          {section.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      {section.items ? (
        <ul className="flex list-disc flex-col gap-2 pl-6 leading-relaxed text-ink">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.directory ? (
        <ul className="mt-1 grid gap-3 sm:grid-cols-2">
          {section.directory.map((entry) => (
            <li
              key={entry.heading}
              className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4 text-ink"
            >
              <h3 className="font-semibold">{entry.heading}</h3>
              <ul className="flex flex-col gap-2 leading-relaxed">
                {entry.places.map((place) => (
                  <li key={place.name} className="flex flex-col">
                    <span>{place.name}</span>
                    {place.detail ? (
                      <span className="text-sm text-muted">{place.detail}</span>
                    ) : null}
                    {place.phone ? <PhoneLink phone={place.phone} extLabel={extLabel} /> : null}
                  </li>
                ))}
              </ul>
              {entry.note ? <p className="text-sm text-muted">{entry.note}</p> : null}
              {entry.phones?.length ? (
                <ul className="flex flex-col gap-1">
                  {entry.phones.map((phone) => (
                    <li key={`${phone.phone}-${phone.ext ?? ""}`}>
                      <PhoneLink phone={phone} extLabel={extLabel} />
                    </li>
                  ))}
                </ul>
              ) : null}
              {entry.links?.map((link) => (
                <ExternalLink
                  key={link.href}
                  href={link.href}
                  newTabLabel={newTabLabel}
                  className="self-start text-sm text-brand-deep underline"
                >
                  {link.label}
                </ExternalLink>
              ))}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function PhoneLink({ phone, extLabel }: { phone: DirectoryPhone; extLabel: string }) {
  return (
    <a
      href={telHref(phone)}
      className="self-start font-semibold text-brand-deep tabular-nums underline"
    >
      {phone.phone}
      {phone.ext ? ` ${extLabel} ${phone.ext}` : ""}
    </a>
  );
}
