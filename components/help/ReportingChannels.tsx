import Email from "@/components/Email";
import { reportingChannels, reportingCopy } from "@/content/reporting";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import type { Locale } from "@/lib/i18n";
import type { HeadingLevel } from "@/components/bds/Type";

/**
 * The two official harassment and bullying reporting channels
 * (`content/reporting.ts`), rendered through `bds/` primitives so this page
 * carries no raw Tailwind font size utility (BUILD-BRIEF-2.0 §7, defect D7).
 *
 * A `/help` page part, not a `bds/` component (§4.1): the design system
 * already ships `components/ReportHarassment.tsx` for MDX content, but that
 * component predates the type scale and reaches for `text-xl`/`text-sm`
 * directly, which this route family may not do. This renders the exact same
 * `content/reporting.ts` data (frozen, unedited) through `Text`/`Heading`
 * instead, so the numbers and addresses stay the single source of truth
 * while the markup meets 2.0's own rule.
 *
 * Renders its own heading: place it under page-level content, never inside
 * a section that would break the heading order, and render it at most once
 * per page.
 */
export type ReportingChannelsProps = {
  locale: Locale;
  headingLevel?: HeadingLevel;
  className?: string;
};

export default function ReportingChannels({
  locale,
  headingLevel = 2,
  className,
}: ReportingChannelsProps) {
  return (
    <Stack
      gap="md"
      className={`rounded-lg border-l-4 border-error bg-error-tint p-6${className ? ` ${className}` : ""}`}
    >
      <Heading level={headingLevel}>{reportingCopy.heading[locale]}</Heading>
      <Text step="body">{reportingCopy.intro[locale]}</Text>

      <div className="grid gap-6 sm:grid-cols-2">
        {reportingChannels.map((channel) => (
          <Stack gap="3xs" key={channel.id}>
            <Text step="body" className="font-semibold text-ink">
              {channel.organisation[locale]}
            </Text>
            <Text step="body-sm" className="text-muted">
              {channel.person[locale]}
            </Text>
            <Text step="body-sm">
              {reportingCopy.callLabel[locale]}{" "}
              <a href={channel.phoneHref} className="font-semibold text-ink">
                {channel.phone}
              </a>
              {channel.extension
                ? ` ${reportingCopy.extensionLabel[locale]} ${channel.extension}`
                : null}
            </Text>
            <Text step="body-sm" className="break-words">
              {reportingCopy.emailLabel[locale]} <Email address={channel.email} className="font-semibold" />
            </Text>
          </Stack>
        ))}
      </div>

      <Text step="body" className="font-semibold text-ink">
        {reportingCopy.assurance[locale]}
      </Text>
    </Stack>
  );
}
