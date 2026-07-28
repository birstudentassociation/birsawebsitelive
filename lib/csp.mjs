/**
 * Content-Security-Policy directives shared between the static policy
 * (applied by `next.config.mjs` at the CDN, no compute cost) and the strict,
 * nonce-based policy (applied by `middleware.ts` for the officer console).
 *
 * This file is plain ESM JavaScript, not TypeScript, because `next.config.mjs`
 * is loaded directly by Node at build time and cannot go through the
 * TypeScript/webpack pipeline the way application code does. `middleware.ts`
 * imports the same file so there is exactly one definition of the directive
 * list; `tsconfig.json` has `allowJs: true` so the import still type-checks
 * from the TypeScript side.
 *
 * Support for Service Standard point 9 (limit attack surface, keep the
 * service secure).
 */

/**
 * Directives common to both the static and strict policies. `script-src` is
 * excluded here because it differs (nonce vs `'unsafe-inline'`) and is built
 * separately by each caller.
 * @type {string[]}
 */
export const SHARED_CSP_DIRECTIVES = [
  `default-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  // OSM tiles for the places map on the student-life guide.
  `img-src 'self' data: blob: https://tile.openstreetmap.org`,
  `font-src 'self'`,
  `connect-src 'self' https://va.vercel-scripts.com`,
  // Google Forms embeds (e.g. event registration on What's on) are framed from
  // docs.google.com. Scoped to that host only; `frame-ancestors 'none'` below
  // still stops anyone from framing us.
  `frame-src https://docs.google.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `manifest-src 'self'`,
];

/**
 * Strict, nonce-based policy for the officer console. The theme script hash
 * is passed in rather than imported, because the hash lives in
 * `lib/theme-script.ts` and this module has to stay importable by plain Node
 * when `next.config.mjs` loads it, with no TypeScript in the chain.
 * @param {string} nonce
 * @param {string} themeScriptHash
 * @returns {string}
 */
export function buildStrictCsp(nonce, themeScriptHash) {
  return [
    `script-src 'self' 'nonce-${nonce}' '${themeScriptHash}' https://va.vercel-scripts.com`,
    ...SHARED_CSP_DIRECTIVES,
  ].join("; ");
}

/**
 * Static policy for every route except the officer console: no nonce, so
 * nothing forces dynamic rendering and the CDN can cache the response. This
 * is a constant string (no per-request input), which is exactly why it can
 * move out of middleware and into `next.config.mjs`'s `headers()`, where the
 * CDN applies it with zero compute per request instead of paying for a
 * middleware invocation on every page view.
 * @returns {string}
 */
export function buildStaticCsp() {
  return [
    `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com`,
    ...SHARED_CSP_DIRECTIVES,
  ].join("; ");
}
