import clsx from "clsx";
import Tag from "@/components/Tag";
import { internshipLetters } from "@/content/internship";
import type { Locale } from "@/lib/i18n";

export default function InternshipLetters({ locale }: { locale: Locale }) {
  const other: Locale = locale === "en" ? "th" : "en";
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {internshipLetters.map((letter) => (
        <section
          key={letter.id}
          aria-labelledby={`letter-${letter.id}`}
          className={clsx(
            "rounded-lg bg-surface p-5",
            letter.tag.required ? "border-2 border-ink" : "border border-line-strong"
          )}
        >
          <Tag variant={letter.tag.required ? "brand" : "neutral"}>{letter.tag.label[locale]}</Tag>
          <p id={`letter-${letter.id}`} className="mt-3 text-lg leading-snug font-bold">
            {letter.name[locale]}
          </p>
          <p lang={other} className="mt-1 text-sm text-muted">
            {letter.otherName[locale]}
          </p>
          <dl className="mt-4 divide-y divide-line">
            {letter.rows.map((row) => (
              <div key={row.label.en} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2">
                <dt className="text-sm font-semibold text-muted">{row.label[locale]}</dt>
                <dd className="text-sm leading-relaxed">{row.value[locale]}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
