import { buildStaticCsp } from "./lib/csp.mjs";

/**
 * Next.js configuration.
 * Security headers support Service Standard point 9 (create a secure service).
 * @type {import('next').NextConfig}
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  /**
   * Normally `.next`. Overridable so a second Next process (an agent
   * verifying a change, a scratch production build) can run against this
   * checkout without fighting an already-running dev server over the same
   * build directory, which on Windows corrupts the shared manifests and
   * produces confusing JSON parse errors on every route.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // AVIF first so Vercel's image optimizer serves AVIF to supporting browsers.
    formats: ["image/avif", "image/webp"],
    // 31 days: site images only change with a deploy, so cache aggressively.
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    // Section merges (see the BIRSA activity + Information & Services reshuffle):
    // "About" folded into "/activity". Locale-prefixed sources preserve the
    // visitor's language. Permanent (308) so search engines follow the move.
    //
    // Course reviews moved from the literal `student-life/home/course-reviews`
    // route (nested under the "home" guide track) to a sibling of `[audience]`
    // at `student-life/course-reviews`, so it reads as its own section rather
    // than a guide topic.
    //
    // "Information and services" renamed to "/services" (nav label "Find a
    // service"): a filing-cabinet category name replaced with a task-based
    // one, per GOV.UK Service Manual naming guidance. Locale-prefixed sources
    // preserve the visitor's language.
    return [
      { source: "/:lang/about", destination: "/:lang/activity", permanent: true },
      { source: "/:lang/about/:slug*", destination: "/:lang/activity/:slug*", permanent: true },
      {
        source: "/:lang/student-life/home/course-reviews",
        destination: "/:lang/student-life/course-reviews",
        permanent: true,
      },
      {
        source: "/:lang/student-life/home/course-reviews/:code",
        destination: "/:lang/student-life/course-reviews/:code",
        permanent: true,
      },
      {
        source: "/:lang/information-services",
        destination: "/:lang/services",
        permanent: true,
      },
      {
        source: "/:lang/information-services/:slug*",
        destination: "/:lang/services/:slug*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // The static CSP is a constant string with no per-request input
        // (unlike the officer console's nonce-based policy), so it belongs
        // here rather than in middleware: the CDN attaches it to the
        // prerendered HTML at no compute cost, instead of paying for a
        // middleware invocation on every page view.
        //
        // Officer routes are excluded by the negative lookahead below because
        // middleware still sets the strict, nonce-based policy for them; a
        // response can only carry one `Content-Security-Policy` header; two
        // conflicting policies would leave the browser enforcing whichever
        // one arrives, breaking the officer console silently.
        source: "/:path((?!th/officer|en/officer).*)",
        headers: [{ key: "Content-Security-Policy", value: buildStaticCsp() }],
      },
      {
        // Static image assets can be replaced in place without a filename
        // change, so cache for a week with SWR rather than marking immutable.
        source: "/birsa-logo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/committee/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
