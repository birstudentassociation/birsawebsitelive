import type { ReactNode } from "react";
import type { HeroTone } from "@/content/emergency/types";

/**
 * Colour-coded hero band for an emergency guide. Every tone below keeps white
 * text (and white/80 breadcrumbs) above WCAG 2.2 AA contrast (4.5:1).
 *
 * The background is the same in light and dark themes (an emergency hero
 * should look the same either way), so these are literal hex values rather
 * than theme tokens. Full class strings are written out so Tailwind's scanner
 * picks them up.
 */
const heroBackground: Record<HeroTone, string> = {
  red: "bg-[#b3161c]",
  black: "bg-[#000000]",
  purple: "bg-[#6b21a8]",
  blue: "bg-[#1e40af]",
  green: "bg-[#14532d]",
  brown: "bg-[#7c2d12]",
  slate: "bg-[#334155]",
};

export type EmergencyHeroProps = {
  tone: HeroTone;
  title: string;
  lede: string;
  breadcrumbs?: ReactNode;
};

export default function EmergencyHero({ tone, title, lede, breadcrumbs }: EmergencyHeroProps) {
  return (
    <section className={`${heroBackground[tone]} border-b border-black/20`}>
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
