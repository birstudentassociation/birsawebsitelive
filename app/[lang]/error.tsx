"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";

/**
 * Segment error boundary for everything under `/[lang]`. Renders inside the
 * locale layout's `<main id="main">`, so it must NOT declare its own `<main>`
 * (that would duplicate the landmark). Errors thrown by the layout itself are
 * caught one level up by `app/global-error.tsx` instead.
 *
 * The locale isn't passed to error boundaries, so read it from the pathname and
 * fall back to the default locale. Raw error details are logged, never shown.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.error.title} lede={dict.error.body} />
      <div className="wrap py-10">
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>{dict.error.tryAgain}</Button>
          <Button href={localeHref(locale, "/")} variant="secondary">
            {dict.error.home}
          </Button>
        </div>
      </div>
    </>
  );
}
