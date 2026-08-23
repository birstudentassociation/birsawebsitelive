import { Text } from "@/components/bds/Type";
import Portrait from "@/components/bds/Portrait";
import type { ImageField } from "@/components/bds/imageContract";
import type { Locale } from "@/lib/i18n";

/**
 * Renders the holder or holders of one BIRSA portfolio (REDESIGN-2.0 §7.2,
 * "the two person rule"). Nobody is the only holder of anything; where the
 * data says otherwise, this component shows that plainly rather than
 * padding the list or hiding the gap.
 *
 * Each holder's portrait goes through `components/bds/Portrait`, which
 * preserves `lib/committee-portrait.ts`'s placeholder fallback exactly:
 * this component never renders an `<img>` of its own.
 *
 * `holders` carries only what a public roster already publishes: a name, a
 * nickname, a role title. No email, phone, student id or address ever
 * reaches this component (`app/[lang]/about/portfolioDirectory.ts` sources
 * it from `content/committee.ts`, which carries nothing else).
 */
export type PortfolioHolderPerson = {
  /** `content/committee.ts`'s `key`; also the portrait filename stem. */
  key: string;
  firstName: string;
  lastName: string;
  nickname: string;
  title: string;
};

export type PortfolioHoldersProps = {
  holders: PortfolioHolderPerson[];
  locale: Locale;
  /** Shown only when `holders.length === 1`. See this component's TSDoc. */
  singleHolderNote: string;
};

function portraitField(holderKey: string): ImageField {
  return {
    assetId: holderKey,
    // The name renders as adjacent visible text on every row this component
    // draws, so the portrait carries no information of its own (the same
    // reasoning `components/about/CommitteeRoster.tsx` and
    // `components/bds/Portrait.tsx`'s own TSDoc give for that case).
    decorative: true,
    alt: null,
    ratio: "1:1",
  };
}

export default function PortfolioHolders({
  holders,
  locale,
  singleHolderNote,
}: PortfolioHoldersProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-4">
        {holders.map((holder) => (
          <li
            key={holder.key}
            className="flex flex-col items-center gap-3 rounded-lg border border-line bg-surface p-4 text-center shadow-sm"
          >
            <Portrait image={portraitField(holder.key)} locale={locale} />
            <div className="flex flex-col items-center">
              <Text step="body-sm" className="font-semibold text-ink">
                {holder.firstName} {holder.lastName} ({holder.nickname})
              </Text>
              <Text step="body-sm" className="text-muted">
                {holder.title}
              </Text>
            </div>
          </li>
        ))}
      </ul>
      {holders.length === 1 ? (
        <div className="rounded-lg border border-warning bg-warning-tint p-4">
          <Text step="body-sm" className="text-warning">
            {singleHolderNote}
          </Text>
        </div>
      ) : null}
    </div>
  );
}
