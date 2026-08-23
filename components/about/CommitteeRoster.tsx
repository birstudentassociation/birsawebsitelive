/**
 * Renders the real BIRSA committee roster (`content/committee.ts`) as two
 * labelled sections: officers, then assistant officers. Server component:
 * portraits are resolved from the filesystem at render time (same pattern
 * as `lib/content.ts`'s build-time `fs` reads), so BIRSA can drop a photo
 * into `public/committee/<key>.{webp,jpg,jpeg,png}` with no code change.
 *
 * Used from `content/about/{en,th}/birsa.mdx` via the MDX component map in
 * `lib/mdx.tsx`. Rendered as `<h3>` group headings: it sits under the `##`
 * ("Committee structure") heading in the MDX, so heading order stays
 * sequential (h2 -> h3).
 */
import Image from "next/image";
import { committee, committeeGroupLabels, type CommitteeGroup } from "@/content/committee";
import { findPortrait } from "@/lib/committee-portrait";
import { Text } from "@/components/bds/Type";

function PortraitPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-line bg-sunken"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-12 w-12 text-muted"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.4-3.8 4.7-6 7.5-6s6.1 2.2 7.5 6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function MemberCard({
  locale,
  member,
}: {
  locale: "en" | "th";
  member: (typeof committee)[number];
}) {
  const t = member[locale];
  const portraitSrc = findPortrait(member.key);

  return (
    <li className="flex flex-col items-center gap-3 rounded-lg border border-line bg-surface p-4 text-center shadow-sm">
      {portraitSrc ? (
        <Image
          src={portraitSrc}
          alt=""
          width={160}
          height={160}
          className="h-24 w-24 shrink-0 rounded-full border border-line object-cover"
        />
      ) : (
        <PortraitPlaceholder />
      )}
      <div className="flex flex-col items-center">
        <p data-roster-line className="whitespace-nowrap">
          <Text as="span" step="body-sm" className="font-semibold text-ink">
            {t.firstName}
          </Text>
        </p>
        <p data-roster-line className="whitespace-nowrap">
          <Text as="span" step="body-sm" className="font-semibold text-ink">
            {t.lastName}
          </Text>
        </p>
        <p data-roster-line className="whitespace-nowrap">
          <Text as="span" step="body-sm" className="text-muted">
            ({t.nickname})
          </Text>
        </p>
        <Text as="p" step="body-sm" className="mt-1 text-muted">
          {t.title}
        </Text>
      </div>
    </li>
  );
}

export type CommitteeRosterProps = {
  locale: "en" | "th";
};

export default function CommitteeRoster({ locale }: CommitteeRosterProps) {
  const groups: CommitteeGroup[] = ["officer", "assistant"];

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => {
        const members = committee.filter((member) => member.group === group);
        return (
          <section key={group} className="flex flex-col gap-4">
            <h3>{committeeGroupLabels[group][locale]}</h3>
            <ul className="grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-4">
              {members.map((member) => (
                <MemberCard key={member.key} locale={locale} member={member} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
