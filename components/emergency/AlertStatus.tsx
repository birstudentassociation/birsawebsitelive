import Link from "next/link";
import type { EmergencySeverity } from "@/content/emergency/types";
import { alertBanner, alertUpdatedAt, formatAlertTime, type LiveAlert } from "@/lib/emergency";
import { localeHref, type Locale } from "@/lib/i18n";

type Labels = {
  liveAlert: string;
  issued: string;
  updated: string;
  updates: string;
  readGuide: string;
  severity: Record<EmergencySeverity, string>;
};

type Props = {
  locale: Locale;
  live: LiveAlert;
  t: Labels;
  /** Link to the guide. Off on the guide page itself. */
  showGuideLink?: boolean;
};

const labelTone: Record<EmergencySeverity, string> = {
  critical: "text-error",
  warning: "text-warning",
  info: "text-info",
};

/** The live alert: what it says, when it was issued and updated, and its updates. */
export default function AlertStatus({ locale, live, t, showGuideLink = false }: Props) {
  const { alert, scenario } = live;
  const updatedAt = alertUpdatedAt(alert);

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

      {alert.updates && alert.updates.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">{t.updates}</h3>
          <ol className="flex flex-col">
            {alert.updates.map((update) => (
              <li
                key={update.at}
                className="flex flex-col gap-2 border-t border-line py-4 first:border-t-0 first:pt-1"
              >
                <time dateTime={update.at} className="text-sm font-medium text-muted">
                  {formatAlertTime(locale, update.at)}
                </time>
                <p className="leading-relaxed font-semibold">{update.text[locale]}</p>
                {update.points?.[locale]?.length ? (
                  <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed">
                    {update.points[locale].map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
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
