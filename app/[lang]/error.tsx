"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import Button from "@/components/bds/Button";
import PageHeader from "@/components/bds/PageHeader";
import { Text } from "@/components/bds/Type";
import { Wrap } from "@/components/bds/Layout";
import { defaultLocale, getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";

/**
 * Segment error boundary for everything under `/[lang]` (BUILD-BRIEF-2.0 §7,
 * ROUTE-MAP-2.0 Wave 5F, REDESIGN-2.0 §8 heuristic 9).
 *
 * Renders inside the locale layout's `<main id="main">`, so it must NOT
 * declare its own `<main>`; a page rendering here means the reader's own
 * request already failed, and the one thing this boundary must never do is
 * make that worse by leaking anything about the failure. `error.digest` is a
 * Next.js-assigned id with no request content in it, but the underlying
 * `Error` object can hold anything a thrown exception happened to carry
 * (a URL, a form value, a database row), so it is logged server-side only,
 * through `console.error`, and never rendered, never included in the digest
 * shown to the reader, and never put in the page's own URL. What the reader
 * sees is a fixed, generic sentence in both locales: no stack trace, no
 * error code standing alone, and nothing that could carry personal data from
 * the failed request onto the page.
 *
 * The locale is not passed to error boundaries, so it is read from the
 * pathname and falls back to the default locale.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side only: never rendered, never sent anywhere else.
    console.error(error);
  }, [error]);

  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader
        title={dict.error.title}
        lede={dict.error.body}
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex flex-col gap-6 py-10">
        <Text step="body" className="text-muted">
          {dict.error.reassurance}
        </Text>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>{dict.error.tryAgain}</Button>
          <Button href={localeHref(locale, "/")} variant="secondary">
            {dict.error.home}
          </Button>
        </div>
      </Wrap>
    </>
  );
}
