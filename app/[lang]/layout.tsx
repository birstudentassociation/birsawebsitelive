import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Lexend, Sarabun } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { jenjrusVris } from "@/lib/fonts";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import SkipLink from "@/components/bds/SkipLink";
import EmergencyBannerClient from "@/components/EmergencyBannerClient";
import { getEmergencyBannerData } from "@/lib/emergency";
import { THEME_SCRIPT } from "@/lib/theme-script";
import Header from "@/components/bds/Header";
import Footer from "@/components/bds/Footer";
import PhaseBanner from "@/components/bds/PhaseBanner";
import PageFeedback from "@/components/bds/PageFeedback";
import { homeNamespace as phaseCopyEn } from "@/content/dictionaries/en/home";
import { homeNamespace as phaseCopyTh } from "@/content/dictionaries/th/home";

/**
 * `phaseBanner` copy, keyed by locale. Lives in `content/dictionaries/{en,th}/home.ts`
 * (this wave's one namespace file) rather than the frozen `chrome` namespace;
 * see that file's own header for why. Imported directly rather than through
 * `getDictionary()`, the same pattern Wave 4A's `do` namespace already set
 * (`app/[lang]/do/dictionary.ts`).
 */
const phaseCopy: Record<Locale, typeof phaseCopyEn.phaseBanner> = {
  en: phaseCopyEn.phaseBanner,
  th: phaseCopyTh.phaseBanner,
};

/**
 * SEAM, the same pattern `Header`'s `defaultPrimaryNav` uses
 * (`components/bds/Header.tsx`): Decision 2 in `docs/DECISIONS-2.0.md`
 * decided BIRSA ships a visible beta banner, and REDESIGN-2.0 §4.5 requires
 * that turning it off never need a developer. `PhaseBanner` itself already
 * takes `active` as a plain prop rather than deciding anything on its own
 * (see that component's own TSDoc), so this constant is the whole of what
 * "turning it off" means today. It is still a code constant rather than a
 * CMS value, because the CMS is gated (`docs/DECISIONS-2.0.md` gate 1, open):
 * once it lands, whoever wires it replaces this constant, not `PhaseBanner`
 * or the JSX below that reads it, exactly the seam `defaultPrimaryNav`
 * models for the primary nav.
 */
const PHASE_BANNER_ACTIVE = true;

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
  // by `'unsafe-inline'` on the static ones (see proxy.ts).
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
        {/*
          GAP, reported rather than silently fixed. `EmergencyBannerClient`
          (`components/EmergencyBannerClient.tsx`) is not in this wave's owned
          path list and still renders `components/EmergencyBanner.tsx` (1.0)
          internally rather than `components/bds/EmergencyBanner.tsx` (2.0,
          `components/bds/manifest.ts`, status cluster). The brief for this
          wave says "keep the emergency banner working exactly as it does
          today: read lib/emergency.ts and do not change how it is driven",
          which this satisfies unchanged; the presentational swap to the bds
          component needs a change to a file this wave does not own. See the
          Wave 5A report.
        */}
        <EmergencyBannerClient locale={locale} cta={dict.emergencyBanner.cta} initial={emergency} />
        <PhaseBanner
          active={PHASE_BANNER_ACTIVE}
          phaseLabel={phaseCopy[locale].phaseLabel}
          feedbackHref={localeHref(locale, "/feedback")}
          feedbackLabel={phaseCopy[locale].feedbackLabel}
        >
          {phaseCopy[locale].message}
        </PhaseBanner>
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
        {/*
          1.0's `components/ScrollToTop.tsx` is deliberately dropped here: it
          is not a `components/bds/` system component
          (`components/bds/manifest.ts` carries no entry for it), so it has
          no place in "the chrome you set" (this wave's brief) for every other
          wave to build inside. Not a contract this wave owns, so nothing was
          edited; simply not carried into the new chrome. See the report.
        */}
        <Analytics />
      </body>
    </html>
  );
}
