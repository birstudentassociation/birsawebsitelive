import Link from "next/link";
import clsx from "clsx";
import { activities } from "@/content/privacy/register";
import { localeHref, type Locale } from "@/lib/i18n";

const copy = {
  en: { linkLabel: "Read the privacy notice" },
  th: { linkLabel: "อ่านประกาศความเป็นส่วนตัว" },
} as const;

export type CollectionNoticeProps = {
  /** id of an entry in `content/privacy/register.ts`'s `activities` array. */
  activityId: string;
  locale: Locale;
  className?: string;
};

/**
 * Section 23 notice-at-collection: a single quiet line of supporting text,
 * the same weight as GOV.UK hint text, placed next to the first identifying
 * field on a form journey. Pulls its wording from the one register at
 * `content/privacy/register.ts` rather than repeating prose in six places,
 * so the notice on the page and the notice in the record of processing
 * activities can never say different things.
 *
 * Renders the activity's `ifYouDoNot` text (section 23(2): whether the
 * field is required, and what happens if it isn't given) plus a link to the
 * full notice at /privacy (section 23's other five items). Renders nothing
 * if the id doesn't match a registered activity, so a typo fails visibly
 * during development rather than silently showing a blank paragraph in
 * production markup.
 */
export default function CollectionNotice({ activityId, locale, className }: CollectionNoticeProps) {
  const activity = activities.find((entry) => entry.id === activityId);
  if (!activity) return null;
  const t = copy[locale];

  return (
    <p className={clsx("text-sm text-muted", className)}>
      {activity.ifYouDoNot[locale]}{" "}
      <Link
        href={localeHref(locale, "/privacy")}
        className="font-semibold text-brand-deep underline"
      >
        {t.linkLabel}
      </Link>
      .
    </p>
  );
}
