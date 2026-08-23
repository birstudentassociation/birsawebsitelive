import Link from "next/link";
import type { BestBet } from "@/lib/search/intent";
import Button from "@/components/bds/Button";
import Notice from "@/components/bds/Notice";
import { Heading, Text } from "@/components/bds/Type";

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
    <div className="flex flex-col gap-4 rounded-lg border-2 border-brand bg-brand-tint/40 p-6">
      <div className="flex flex-col gap-2">
        <Heading level={2} className="text-ink">
          {bestBet.title}
        </Heading>
        <Text step="body-sm" className="text-ink">
          {bestBet.description}
        </Text>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button href={bestBet.action.href}>{bestBet.action.label}</Button>
      </div>

      {bestBet.links.length > 0 ? (
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {bestBet.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-brand-deep hover:underline">
                <Text as="span" step="body-sm">
                  {link.label}
                </Text>
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
