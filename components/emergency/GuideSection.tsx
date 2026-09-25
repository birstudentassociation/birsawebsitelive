import type { EmergencySection } from "@/content/emergency/types";

/** One headed section of an emergency guide: paragraphs, then steps, then points. */
export default function GuideSection({ section }: { section: EmergencySection }) {
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
    </section>
  );
}
