import Link from "next/link";
import { localeHref, type Locale } from "@/lib/i18n";
import { serializeProfile } from "@/lib/smart-answers";
import {
  audienceQuestions,
  getAudienceChoice,
  type AudienceProfile,
} from "@/content/smart-answers/audience";
import { uiCopy } from "@/content/smart-answers";

/**
 * The standing summary of what the service is assuming about the reader,
 * shown on the hub, on a topic start page, and above every answer.
 *
 * It is deliberately always visible rather than tucked behind a settings
 * link. A tailored answer that does not show its assumptions is worse than
 * an untailored one: the reader cannot tell whether it was written for
 * someone in their situation, and cannot correct it when it was not.
 */
export default function ProfileSummary({
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
  const editHref = localeHref(
    locale,
    `/answers/you?return=${encodeURIComponent(returnTo)}${
      serializeProfile(profile) ? `&p=${serializeProfile(profile)}` : ""
    }`
  );
  const isEmpty = Object.keys(profile).length === 0;

  if (isEmpty) {
    return (
      <div className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-ink text-lg">{t.profilePrompt}</h2>
          {variant === "full" ? (
            <p className="text-muted mt-1 text-sm leading-relaxed">{t.profileLede}</p>
          ) : null}
        </div>
        <Link
          href={editHref}
          className="focus-halo border-ink text-ink hover:bg-brand-tint inline-flex h-11 shrink-0 items-center rounded-lg border-[1.5px] px-5 text-[0.95rem] font-semibold"
        >
          {t.profileSet}
        </Link>
      </div>
    );
  }

  return (
    <div className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-ink text-lg">{t.profileHeading}</h2>
        <Link href={editHref} className="text-brand-deep text-sm font-medium hover:underline">
          {t.profileEdit}
        </Link>
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-2">
        {audienceQuestions.map((question) => {
          const value = profile[question.dimension];
          const choice = value ? getAudienceChoice(question.dimension, value) : undefined;
          return (
            <div key={question.dimension} className="flex flex-col">
              <dt className="text-muted text-xs tracking-wide uppercase">
                {question.summaryLabel[locale]}
              </dt>
              <dd className="text-ink text-sm font-medium">
                {choice ? choice.label[locale] : t.profileNone}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
