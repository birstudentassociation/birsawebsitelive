import type { ReactNode } from "react";

/**
 * Colour-coded hero band for an emergency scenario page. Each scenario has its
 * own background colour; text is white. Every colour below has been chosen so
 * that white text (and white/80 breadcrumbs) clears WCAG 2.2 AA contrast
 * (>= 4.5:1) against it.
 *
 * The background is a fixed colour in both light and dark themes (an emergency
 * hero should look the same either way), so these use literal hex values rather
 * than theme tokens. Full class strings are written out so Tailwind's scanner
 * picks them up.
 */
/** Fallback background for an unknown scenario id (matches `generic`). */
const GENERIC_HERO = "bg-[#b3161c]";

const heroBackground: Record<string, string> = {
  coup: "bg-[#000000]",
  "active-shooting": "bg-[#6b21a8]",
  fire: "bg-[#b3161c]",
  earthquake: "bg-[#b3161c]",
  protests: "bg-[#b3161c]",
  "faculty-closure": "bg-[#b3161c]",
  "campus-closure": "bg-[#b3161c]",
  "health-advisory": "bg-[#14532d]",
  flooding: "bg-[#1e40af]",
  generic: GENERIC_HERO,
};

/** Background class for a scenario id (falls back to the generic red). */
export function heroBackgroundClass(scenarioId: string): string {
  return heroBackground[scenarioId] ?? GENERIC_HERO;
}

export type EmergencyHeroProps = {
  scenarioId: string;
  title: string;
  lede: string;
  breadcrumbs?: ReactNode;
};

export default function EmergencyHero({
  scenarioId,
  title,
  lede,
  breadcrumbs,
}: EmergencyHeroProps) {
  return (
    <section className={`${heroBackgroundClass(scenarioId)} border-b border-black/20`}>
      <div className="wrap flex flex-col gap-4 py-10 text-white sm:py-14">
        {breadcrumbs}
        <div className="max-w-[var(--measure)]">
          <h1 className="font-display text-3xl text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 text-lg text-white/90">{lede}</p>
        </div>
      </div>
    </section>
  );
}
