"use client";

import { useEffect } from "react";
import { Fraunces, Inter, Sarabun } from "next/font/google";
import "@/app/globals.css";
import { defaultLocale, getDictionary, localeHref } from "@/lib/i18n";

/**
 * Global error boundary — the last line of defence. It only renders when the
 * root `app/[lang]/layout.tsx` itself throws, so no layout wraps it and it must
 * emit its own `<html lang>` + `<body>` (WCAG 3.1.1), just like the global
 * `app/not-found.tsx`. The visited locale is unknown here, so it renders in the
 * default locale. No inline theme script (which the CSP would block without a
 * nonce); system dark-mode users are still covered by the CSS media query.
 */
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600"], variable: "--font-en-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-en-body", display: "swap" });
const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-th", display: "swap" });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const dict = getDictionary(defaultLocale);

  return (
    <html
      lang={defaultLocale}
      className={`${fraunces.variable} ${inter.variable} ${sarabun.variable}`}
      suppressHydrationWarning
    >
      <body>
        <main id="main" className="wrap flex min-h-screen flex-col justify-center py-16">
          <h1 className="font-display text-ink text-3xl sm:text-4xl">{dict.error.title}</h1>
          <p className="text-muted mt-3 max-w-[var(--measure)] text-lg">{dict.error.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="focus-halo bg-brand hover:bg-brand-strong inline-flex h-11 items-center rounded-md px-5 text-sm font-semibold text-white"
            >
              {dict.error.tryAgain}
            </button>
            <a
              href={localeHref(defaultLocale, "/")}
              className="focus-halo border-ink text-ink inline-flex h-11 items-center rounded-md border-[1.5px] px-5 text-sm font-semibold"
            >
              {dict.error.home}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
