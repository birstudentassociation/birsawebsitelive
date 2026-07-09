import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Inter, Sarabun } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import SkipLink from "@/components/SkipLink";
import BetaBanner from "@/components/BetaBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  // Display type only ever renders at 600 (headings + wordmark), and
  // font-synthesis-weight is disabled, so one weight is all we ship.
  weight: ["600"],
  variable: "--font-en-display",
  display: "swap",
});

const inter = Inter({
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

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${dict.site.name} | ${dict.site.fullName}`,
      template: `%s | ${dict.site.name}`,
    },
    description: dict.site.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${sarabun.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          // Parser-blocking, first child of <body> — runs before paint so
          // there's no flash of the wrong theme. Only touches the DOM when
          // the visitor made an explicit choice; system-preference users
          // need no JS at all (handled by the CSS media-query scope).
          dangerouslySetInnerHTML={{
            __html: `try {
  var t = localStorage.getItem("birsa-theme");
  if (t === "dark" || t === "light") {
    document.documentElement.dataset.theme = t;
  }
} catch (e) {}`,
          }}
        />
        <SkipLink label={dict.a11y.skip} />
        <BetaBanner message={dict.betaBanner} />
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
