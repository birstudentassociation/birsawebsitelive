import Link from "next/link";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";

/**
 * Body of the "Sorry, there is a problem with the service" page, per the
 * GOV.UK pattern: try again later, what happened to any answers, and how to
 * get help. `onRetry` is the error boundary's reset, when there is one.
 */
export default function ErrorBody({ locale, onRetry }: { locale: Locale; onRetry?: () => void }) {
  const t = getDictionary(locale).error;
  const stop = locale === "en" ? "." : "";

  return (
    <div className="flex max-w-[var(--measure)] flex-col gap-4">
      <p>{t.body}</p>
      <p>{t.saved}</p>
      <p>
        {t.contactLead}{" "}
        <Link
          href={`${localeHref(locale, "/contact")}?category=problem`}
          className="font-semibold text-brand-deep underline underline-offset-4"
        >
          {t.contactLink}
        </Link>
        {stop}
      </p>
      <ul className="flex flex-col gap-2">
        {onRetry ? (
          <li>
            <button
              type="button"
              onClick={onRetry}
              className="text-brand-deep underline underline-offset-4"
            >
              {t.tryAgain}
            </button>
          </li>
        ) : null}
        <li>
          <Link
            href={localeHref(locale, "/")}
            className="text-brand-deep underline underline-offset-4"
          >
            {t.home}
          </Link>
        </li>
      </ul>
    </div>
  );
}
