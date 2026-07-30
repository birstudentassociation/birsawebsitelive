import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Lexend, Sarabun } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { jenjrusVris } from "@/lib/fonts";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import SkipLink from "@/components/SkipLink";
import EmergencyBannerClient from "@/components/EmergencyBannerClient";
import { getEmergencyBannerData } from "@/lib/emergency";
import { THEME_SCRIPT } from "@/lib/theme-script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageFeedback from "@/components/PageFeedback";
import ScrollToTop from "@/components/ScrollToTop";

const fraunces = Fraunces({
  subsets: ["latin"],
  // Display type only ever renders at 600 (headings + wordmark), and
  // font-synthesis-weight is disabled, so one weight is all we ship.
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

  // Runtime emergency mode, toggled via Edge Config without a redeploy. The read
  // is cached (see lib/emergency.ts) so it does not force dynamic rendering; the
  // banner is server-rendered here for no-JS visitors and then refreshed
  // client-side. No `headers()`/nonce read here: that would force every page
  // dynamic; the inline theme script is authorised by hash on strict routes and
  // by `'unsafe-inline'` on the static ones (see middleware.ts).
  const emergency = await getEmergencyBannerData(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${lexend.variable} ${sarabun.variable} ${jenjrusVris.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          // Parser-blocking, first child of <body>; runs before paint so
          // there's no flash of the wrong theme. Only touches the DOM when
          // the visitor made an explicit choice; system-preference users
          // need no JS at all (handled by the CSS media-query scope). It also
          // stays resident to put `data-theme` back if React strips it off
          // <html> during a hydration bail-out; see lib/theme-script.ts.
          // Authorised by CSP hash (THEME_SCRIPT_HASH) on strict routes; edit
          // via lib/theme-script.ts so the hash guard test stays in sync.
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
        <SkipLink label={dict.a11y.skip} />
        <EmergencyBannerClient locale={locale} cta={dict.emergencyBanner.cta} initial={emergency} />
        <Header locale={locale} />
        {/*
          `tabIndex={-1}` makes the skip link actually move focus, not just
          scroll. Without it the browser scrolls to the landmark but leaves
          focus on the link, so the next Tab returns the reader to the header
          nav they were trying to skip (WCAG technique G1). The `outline-none`
          suppresses the focus ring on the landmark itself, which is not an
          interactive control and should not look like one.
        */}
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <PageFeedback locale={locale} prompt={dict.feedback.prompt} report={dict.feedback.report} />
        <Footer locale={locale} />
        <ScrollToTop label={dict.actions.backToTop} />
        <Analytics />
      </body>
    </html>
  );
}
