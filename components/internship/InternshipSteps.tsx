import Tag from "@/components/Tag";
import { internshipSteps } from "@/content/internship";
import type { Locale } from "@/lib/i18n";

const stepLabel: Record<Locale, string> = { en: "Step", th: "ขั้นตอนที่" };

export default function InternshipSteps({ locale }: { locale: Locale }) {
  return (
    <ol role="list" className="list-none pl-0">
      {internshipSteps.map((step, index) => (
        <li key={step.id} className="relative mt-0 pb-8 pl-14 last:pb-0">
          {index < internshipSteps.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-11 bottom-1 left-[19px] w-0.5 bg-line-strong"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-surface font-bold"
          >
            {index + 1}
          </span>
          <p className="pt-1.5 text-lg leading-snug font-bold">
            <span className="sr-only">
              {stepLabel[locale]} {index + 1}.{" "}
            </span>
            {step.title[locale]}
          </p>
          {step.when || step.tag ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {step.when ? (
                <span className="text-sm font-semibold text-muted">{step.when[locale]}</span>
              ) : null}
              {step.tag ? (
                <Tag variant={step.tag.required ? "brand" : "neutral"}>
                  {step.tag.label[locale]}
                </Tag>
              ) : null}
            </div>
          ) : null}
          <p className="mt-2 leading-relaxed">{step.detail[locale]}</p>
        </li>
      ))}
    </ol>
  );
}
