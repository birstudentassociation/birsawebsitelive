import Link from "next/link";
import { localeHref, type Locale } from "@/lib/i18n";
import { serializeProfile } from "@/lib/smart-answers";
import {
  audienceQuestions,
  getAudienceChoice,
  type AudienceProfile,
} from "@/content/smart-answers/audience";
import { uiCopy } from "@/content/smart-answers";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import Button from "@/components/bds/Button";

/**
 * The standing summary of what Smart Answers is assuming about the reader,
 * for the `/help/answers` mount of the feature.
 *
 * A `/help`-owned fork of `components/answers/ProfileSummary.tsx`, not an
 * edit of it: that component hardcodes `/answers/you` as its edit link,
 * which is the 1.0 route this route family is migrating away from
 * (`components/answers/**` is not in this agent's owned paths, so the 1.0
 * component is read but never modified, per BUILD-BRIEF-2.0 §10). This
 * fork points at `/help/answers/you` instead and renders through
 * `Text`/`Heading` rather than raw Tailwind size utilities (defect D7).
 */
export default function AnswersProfileSummary({
  locale,
  profile,
  returnTo,
  variant = "full",
}: {
  locale: Locale;
  profile: AudienceProfile;
  /** Path (no locale prefix, query included) to come back to after editing. */
  returnTo: string;
  /** "compact" drops the lede, for use above an answer. */
  variant?: "full" | "compact";
}) {
  const t = uiCopy[locale];
  const token = serializeProfile(profile);
  const editHref = localeHref(
    locale,
    `/help/answers/you?return=${encodeURIComponent(returnTo)}${token ? `&p=${token}` : ""}`
  );
  const isEmpty = Object.keys(profile).length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level={2} step="heading-3">
            {t.profilePrompt}
          </Heading>
          {variant === "full" ? (
            <Text step="body-sm" className="mt-1 text-muted">
              {t.profileLede}
            </Text>
          ) : null}
        </div>
        <Button href={editHref} variant="secondary" className="shrink-0">
          {t.profileSet}
        </Button>
      </div>
    );
  }

  return (
    <Stack gap="sm" className="rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Heading level={2} step="heading-3">
          {t.profileHeading}
        </Heading>
        <Link href={editHref} className="focus-halo font-semibold text-brand-deep hover:underline">
          <Text as="span" step="body-sm">
            {t.profileEdit}
          </Text>
        </Link>
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-2">
        {audienceQuestions.map((question) => {
          const value = profile[question.dimension];
          const choice = value ? getAudienceChoice(question.dimension, value) : undefined;
          return (
            <div key={question.dimension} className="flex flex-col">
              <Text as="dt" step="body-sm" className="text-muted uppercase">
                {question.summaryLabel[locale]}
              </Text>
              <Text as="dd" step="body-sm" className="font-medium text-ink">
                {choice ? choice.label[locale] : t.profileNone}
              </Text>
            </div>
          );
        })}
      </dl>
    </Stack>
  );
}
