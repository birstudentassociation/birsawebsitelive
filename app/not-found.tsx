import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Inter, Sarabun } from "next/font/google";
import "@/app/globals.css";
import { defaultLocale, getDictionary, localeHref } from "@/lib/i18n";

const rootDict = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: `${rootDict.notFound.title} | ${rootDict.site.name}`,
};

/**
 * Global (root) not-found. The only root layout lives under `app/[lang]`, so
 * paths that never enter a `[lang]` segment — e.g. a bad locale prefix, or an
 * unmatched top-level path — render THIS boundary with no layout above it.
 * It must therefore emit its own `<html lang>` + `<body>` (WCAG 3.1.1); the
 * segment-level `app/[lang]/not-found.tsx` handles in-locale misses with the
 * full site chrome.
 *
 * The visited locale is unknown here, so we render in the default locale but
 * offer both language homepages so no visitor is stranded.
 */
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600"], variable: "--font-en-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-en-body", display: "swap" });
const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-th", display: "swap" });

export default function GlobalNotFound() {
  const dict = getDictionary(defaultLocale);
  const other = defaultLocale === "th" ? "en" : "th";
  const otherDict = getDictionary(other);

  return (
    <html
      lang={defaultLocale}
      className={`${fraunces.variable} ${inter.variable} ${sarabun.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
  var t = localStorage.getItem("birsa-theme");
  if (t === "dark" || t === "light") {
    document.documentElement.dataset.theme = t;
  }
} catch (e) {}`,
          }}
        />
        <main id="main" className="wrap flex min-h-screen flex-col justify-center py-16">
          <p className="text-brand-deep text-sm font-semibold">404</p>
          <h1 className="font-display text-ink mt-2 text-3xl sm:text-4xl">{dict.notFound.title}</h1>
          <p className="text-muted mt-3 max-w-[var(--measure)] text-lg">{dict.notFound.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={localeHref(defaultLocale, "/")}
              className="focus-halo bg-brand hover:bg-brand-strong inline-flex h-11 items-center rounded-md px-5 text-sm font-semibold text-white"
            >
              {dict.notFound.home}
            </Link>
            <Link
              href={localeHref(other, "/")}
              className="focus-halo border-ink text-ink inline-flex h-11 items-center rounded-md border-[1.5px] px-5 text-sm font-semibold"
            >
              {otherDict.notFound.home}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
