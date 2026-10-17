import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { BestBet } from "@/lib/search/intent";
import Button from "@/components/Button";
import WarningText from "@/components/WarningText";

export type BestBetCardProps = {
  bestBet: BestBet;
  locale: Locale;
};

/**
 * The prominent "we think this is what you want" card shown above ordinary
 * results. Title is an `<h2>` so it slots under the page's single `<h1>`
 * without skipping a level; `ResultList`'s own headingless rows sit below it.
 */
export default function BestBetCard({ bestBet, locale }: BestBetCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-brand bg-brand-tint/40 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-xl text-ink">{bestBet.title}</h2>
        <p className="text-sm leading-relaxed text-ink">{bestBet.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button href={bestBet.action.href}>{bestBet.action.label}</Button>
      </div>

      {bestBet.links.length > 0 ? (
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {bestBet.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-brand-deep hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {/* `note` is only ever used for safety information (e.g. emergency
          phone numbers), so it gets the `warning` treatment: icon + colour +
          text together, never colour alone. */}
      {bestBet.note ? <WarningText locale={locale}>{bestBet.note}</WarningText> : null}
    </div>
  );
}
