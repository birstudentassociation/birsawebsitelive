import Link from "next/link";
import type { BestBet } from "@/lib/search/intent";
import Button from "@/components/Button";
import Notice from "@/components/Notice";

export type BestBetCardProps = {
  bestBet: BestBet;
};

/**
 * The prominent "we think this is what you want" card shown above ordinary
 * results. Title is an `<h2>` so it slots under the page's single `<h1>`
 * without skipping a level; `ResultList`'s own headingless rows sit below it.
 */
export default function BestBetCard({ bestBet }: BestBetCardProps) {
  return (
    <div className="border-brand bg-brand-tint/40 flex flex-col gap-4 rounded-lg border-2 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-ink text-xl">{bestBet.title}</h2>
        <p className="text-ink text-sm leading-relaxed">{bestBet.description}</p>
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
      {bestBet.note ? <Notice variant="warning">{bestBet.note}</Notice> : null}
    </div>
  );
}
