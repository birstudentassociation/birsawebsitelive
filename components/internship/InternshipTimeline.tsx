import clsx from "clsx";
import Tag from "@/components/Tag";
import { internshipTimeline } from "@/content/internship";
import type { Locale } from "@/lib/i18n";

const listLabel: Record<Locale, string> = {
  en: "Internship timeline for students with ID 67",
  th: "ลำดับเวลาการฝึกงานของนักศึกษารหัส 67",
};

export default function InternshipTimeline({ locale }: { locale: Locale }) {
  return (
    <ol
      role="list"
      aria-label={listLabel[locale]}
      className="grid list-none gap-0 pl-0 md:grid-cols-5"
    >
      {internshipTimeline.map((entry, index) => {
        const isBar = entry.span === 2;
        const isLast = index === internshipTimeline.length - 1;
        return (
          <li
            key={entry.id}
            className={clsx(
              "relative mt-0 pb-6 pl-9 md:pt-9 md:pr-4 md:pb-0 md:pl-0",
              isBar && "md:col-span-2"
            )}
          >
            {isBar ? (
              <span
                aria-hidden="true"
                className="absolute top-1 bottom-0 left-[4px] w-2.5 rounded-full bg-brand md:top-[3px] md:right-0 md:bottom-auto md:left-0 md:h-2.5 md:w-auto"
              />
            ) : (
              <>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 bottom-0 left-[8px] w-0.5 bg-line-strong md:top-[7px] md:right-0 md:bottom-auto md:left-0 md:h-0.5 md:w-auto"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute top-1 left-0 h-[18px] w-[18px] rounded-full border-[3px] md:top-0",
                    entry.tag?.required ? "border-brand bg-brand" : "border-ink bg-surface"
                  )}
                />
              </>
            )}
            <p className="text-sm font-semibold text-muted">{entry.when[locale]}</p>
            <p className="mt-1 leading-snug font-bold">{entry.title[locale]}</p>
            <p className="mt-1 text-sm leading-relaxed">{entry.detail[locale]}</p>
            {entry.tag ? (
              <Tag variant={entry.tag.required ? "brand" : "neutral"} className="mt-2">
                {entry.tag.label[locale]}
              </Tag>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
