import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Lexend, Sarabun } from "next/font/google";
import "@/app/globals.css";
import { jenjrusVris } from "@/lib/fonts";
import { defaultLocale, getDictionary, localeHref } from "@/lib/i18n";
import { THEME_SCRIPT } from "@/lib/theme-script";
import NotFoundBody from "@/components/status/NotFoundBody";

const rootDict = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: `${rootDict.notFound.title} | ${rootDict.site.name}`,
};

/**
 * Global (root) not-found. The only root layout lives under `app/[lang]`, so
 * paths that never enter a `[lang]` segment (e.g. a bad locale prefix, or an
 * unmatched top-level path) render THIS boundary with no layout above it.
 * It must therefore emit its own `<html lang>` + `<body>` (WCAG 3.1.1); the
 * segment-level `app/[lang]/not-found.tsx` handles in-locale misses with the
 * full site chrome.
 *
 * The visited locale is unknown here, so we render in the default locale but
 * offer both language homepages so no visitor is stranded.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-en-display",
  display: "swap",
});
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-en-body",
  display: "swap",
});
const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-th",
  display: "swap",
});

export default function GlobalNotFound() {
  const dict = getDictionary(defaultLocale);
  const other = defaultLocale === "th" ? "en" : "th";
  const otherDict = getDictionary(other);

  return (
    <html
      lang={defaultLocale}
      className={`${fraunces.variable} ${lexend.variable} ${sarabun.variable} ${jenjrusVris.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Same bootstrap as the root layout, from the shared constant so the
            two cannot drift (and so this page keeps the guard that stops React
            stripping `data-theme` off <html>). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <main id="main" className="wrap flex min-h-screen flex-col justify-center py-16">
          <h1 className="font-display text-3xl text-ink sm:text-4xl">{dict.notFound.title}</h1>
          <div className="mt-6">
            <NotFoundBody locale={defaultLocale} />
          </div>
          <p className="mt-8">
            <Link
              href={localeHref(other, "/")}
              lang={other}
              className="text-brand-deep underline underline-offset-4"
            >
              {otherDict.notFound.home}
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
