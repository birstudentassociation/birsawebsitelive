import clsx from "clsx";
import type { Level, Verdict } from "@/lib/conditions/types";
import type { Locale } from "@/lib/i18n";

type Labels = {
  whatToDo: string;
  uncheckedLabel: string;
};

type Props = {
  locale: Locale;
  verdict: Verdict;
  title: string;
  levelLabel: string;
  uncheckedLabels: string[];
  t: Labels;
};

const tones: Record<Level, { border: string; text: string; surface: string }> = {
  normal: { border: "border-t-success", text: "text-success", surface: "bg-surface" },
  takeCare: { border: "border-t-warning", text: "text-warning", surface: "bg-surface" },
  disruption: { border: "border-t-error", text: "text-error", surface: "bg-surface" },
  unknown: { border: "border-t-line-strong", text: "text-muted", surface: "bg-sunken" },
};

function LevelIcon({ level }: { level: Level }) {
  const common = {
    "aria-hidden": "true" as const,
    className: "h-5 w-5 shrink-0",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (level) {
    case "normal":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="8" />
          <path d="M6.5 10.5 9 13l4.5-5.5" />
        </svg>
      );
    case "takeCare":
      return (
        <svg {...common}>
          <path d="M10 2 1 17h18L10 2Z" />
          <path d="M10 8v4" />
          <circle cx="10" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "disruption":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="8" />
          <path d="M7 7l6 6M13 7l-6 6" />
        </svg>
      );
    case "unknown":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="8" />
          <path d="M7.9 7.8A2.2 2.2 0 1 1 10.7 10c-.5.3-.7.7-.7 1.2" />
          <circle cx="10" cy="14" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export default function VerdictCard({
  locale,
  verdict,
  title,
  levelLabel,
  uncheckedLabels,
  t,
}: Props) {
  const tone = tones[verdict.level];
  const headingId = `verdict-${verdict.card}`;

  return (
    <article
      aria-labelledby={headingId}
      className={clsx(
        "flex flex-col gap-3 rounded-lg border border-t-4 border-line p-5 shadow-sm",
        tone.border,
        tone.surface
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 id={headingId} className="font-display text-xl">
          {title}
        </h3>
        <p className={clsx("flex items-center gap-2 font-semibold", tone.text)}>
          <LevelIcon level={verdict.level} />
          <span>{levelLabel}</span>
        </p>
      </div>

      <p className="text-lg leading-snug font-semibold">{verdict.headline[locale]}</p>

      {verdict.hits.length > 0 ? (
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed">
          {verdict.hits.map((hit) => (
            <li key={hit.ruleId}>{hit.why[locale]}</li>
          ))}
        </ul>
      ) : null}

      <div className="text-sm leading-relaxed">
        <p className="font-semibold">{t.whatToDo}</p>
        <p>{verdict.action[locale]}</p>
      </div>

      {uncheckedLabels.length > 0 ? (
        <div className="mt-auto border-t border-line pt-3 text-xs leading-relaxed text-muted">
          <p className="font-semibold">{t.uncheckedLabel}</p>
          <ul className="list-disc pl-4">
            {uncheckedLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
