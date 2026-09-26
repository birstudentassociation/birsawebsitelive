import Link from "next/link";
import type { EmergencySeverity } from "@/content/emergency/types";
import { alertBanner, alertUpdatedAt, formatAlertTime, type LiveAlert } from "@/lib/emergency";
import { localeHref, type Locale } from "@/lib/i18n";

type Labels = {
  liveAlert: string;
  issued: string;
  updated: string;
  latest: string;
  allUpdates: string;
  readGuide: string;
  severity: Record<EmergencySeverity, string>;
};

type Props = {
  locale: Locale;
  live: LiveAlert;
  t: Labels;
  /** Link to the guide. Off on the guide page itself. */
  showGuideLink?: boolean;
  /** Where the full list of updates lives, e.g. `#live-updates`. */
  updatesHref: string;
};

const labelTone: Record<EmergencySeverity, string> = {
  critical: "text-error",
  warning: "text-warning",
  info: "text-info",
};

/**
 * The live alert: what it says, when it was issued and updated, and the latest
 * update's headline with a link to the full timeline.
 */
export default function AlertStatus({
  locale,
  live,
  t,
  showGuideLink = false,
  updatesHref,
}: Props) {
  const { alert, scenario } = live;
  const updatedAt = alertUpdatedAt(alert);
  const latest = alert.updates?.[0];

  return (
    <section aria-labelledby="live-alert-heading" className="flex flex-col gap-4 text-ink">
      <div className="flex flex-col gap-1">
        <p
          className={`text-sm font-semibold tracking-wide uppercase ${labelTone[scenario.severity]}`}
        >
          {t.liveAlert}
        </p>
        <h2 id="live-alert-heading" className="font-display text-2xl">
          {alertBanner(live, locale)}
        </h2>
      </div>

      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="font-medium">{t.issued}</dt>
        <dd>
          <time dateTime={alert.issuedAt}>{formatAlertTime(locale, alert.issuedAt)}</time>
        </dd>
        {updatedAt !== alert.issuedAt ? (
          <>
            <dt className="font-medium">{t.updated}</dt>
            <dd>
              <time dateTime={updatedAt}>{formatAlertTime(locale, updatedAt)}</time>
            </dd>
          </>
        ) : null}
      </dl>

      {latest ? (
        <div className="flex flex-col gap-1 border-l-2 border-error pl-4">
          <p className="text-sm font-medium text-muted">
            {t.latest} <time dateTime={latest.at}>{formatAlertTime(locale, latest.at)}</time>
          </p>
          <p className="leading-relaxed font-semibold">{latest.text[locale]}</p>
          <a
            href={updatesHref}
            className="self-start text-sm font-semibold text-brand-deep underline"
          >
            {t.allUpdates}
          </a>
        </div>
      ) : null}

      {showGuideLink ? (
        <Link
          href={localeHref(locale, `/emergency/${scenario.id}`)}
          className="self-start font-semibold underline hover:text-brand-deep"
        >
          {t.readGuide}
        </Link>
      ) : null}
    </section>
  );
}
