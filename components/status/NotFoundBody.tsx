import Link from "next/link";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";

/**
 * Body of the "Page not found" page, per the GOV.UK pattern: what to check,
 * a way to report a broken link, and plain links rather than a wall of
 * buttons. Shared by the locale not-found page and the root fallback.
 */
export default function NotFoundBody({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).notFound;
  const stop = locale === "en" ? "." : "";

  return (
    <div className="flex max-w-[var(--measure)] flex-col gap-4">
      <p>{t.typed}</p>
      <p>{t.pasted}</p>
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
        <li>
          <Link
            href={localeHref(locale, "/")}
            className="text-brand-deep underline underline-offset-4"
          >
            {t.home}
          </Link>
        </li>
        <li>
          <Link
            href={localeHref(locale, "/search")}
            className="text-brand-deep underline underline-offset-4"
          >
            {t.search}
          </Link>
        </li>
      </ul>
    </div>
  );
}
