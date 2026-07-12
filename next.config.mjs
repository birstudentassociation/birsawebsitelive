import { withPayload } from "@payloadcms/next/withPayload";

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
    // "About" folded into "/activity"; "Student life" landing folded into the
    // new "/information-services" hub. Locale-prefixed sources preserve the
    // visitor's language. Permanent (308) so search engines follow the move.
    return [
      { source: "/:lang/about", destination: "/:lang/activity", permanent: true },
      { source: "/:lang/about/:slug*", destination: "/:lang/activity/:slug*", permanent: true },
      {
        source: "/:lang/student-life",
        destination: "/:lang/information-services",
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

// `withPayload` mounts the CMS: it merges Payload's required headers with the
// ones above, externalizes server-only packages, and adds an (ignored under
// Turbopack) webpack config. Because it injects a webpack key, `next build`
// must be run with `--turbopack` (see package.json scripts) so Next.js uses
// Turbopack rather than erroring on the presence of a webpack config.
export default withPayload(nextConfig);
