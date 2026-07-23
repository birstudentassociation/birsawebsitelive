import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { THEME_SCRIPT_HASH } from "@/lib/theme-script";

const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Skip API routes, Next internals, and any path that looks like a static
 * file (has a dot in the last segment, e.g. `/robots.txt`, `/favicon.ico`).
 */
function shouldSkip(pathname: string): boolean {
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) return true;
  const lastSegment = pathname.split("/").pop() ?? "";
  return lastSegment.includes(".");
}

/** Parse a preferred locale out of an Accept-Language header, if present. */
function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter((tag): tag is string => Boolean(tag));

  for (const tag of preferred) {
    const primary = tag.split("-")[0] ?? tag;
    if (isLocale(primary)) return primary;
  }
  return null;
}

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const headerLocale = localeFromAcceptLanguage(request.headers.get("accept-language"));
  if (headerLocale) return headerLocale;

  return defaultLocale;
}

/** Generate a base64 nonce using Web Crypto (available in the Edge runtime). */
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * Content-Security-Policy for Service Standard point 9 (limit attack surface).
 *
 * The policy is split by route so that only the pages that truly need a strict
 * script-src pay the cost of dynamic rendering:
 *
 * - Strict routes (the authenticated officer console, `isStrictPath`) get a
 *   per-request nonce. Next applies that nonce to its own inline hydration
 *   scripts once it sees the CSP on the request header, so no `'unsafe-inline'`
 *   is needed. Using a nonce forces dynamic rendering, but those routes are
 *   already dynamic (they read `cookies()`) and are low-traffic.
 * - Every other route gets `'unsafe-inline'` instead of a nonce. Next's inline
 *   scripts can't be hashed and a nonce would force dynamic rendering, so this
 *   is what lets the public content pages prerender and be CDN-cached. These
 *   pages render only trusted, build-time MDX (no user-supplied HTML), so the
 *   residual XSS surface is bounded; the external-script protections
 *   (`script-src 'self'`, no wildcard hosts) still apply.
 *
 * The inline theme script (`lib/theme-script.ts`) is authorised by its SHA-256
 * hash on strict routes (it carries no nonce) and by `'unsafe-inline'`
 * elsewhere. Styles keep `'unsafe-inline'` (React inline styles / Tailwind).
 * `va.vercel-scripts.com` is Vercel Analytics; its beacon posts to `'self'`.
 */
const SHARED_CSP_DIRECTIVES = [
  `default-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
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

function buildStrictCsp(nonce: string): string {
  return [
    `script-src 'self' 'nonce-${nonce}' '${THEME_SCRIPT_HASH}' https://va.vercel-scripts.com`,
    ...SHARED_CSP_DIRECTIVES,
  ].join("; ");
}

function buildStaticCsp(): string {
  return [
    `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com`,
    ...SHARED_CSP_DIRECTIVES,
  ].join("; ");
}

/**
 * Routes that render authenticated, officer-entered data and must keep a
 * strict, nonce-based script-src. Everything else is served with the
 * static-friendly policy so it can be prerendered and CDN-cached.
 */
function isStrictPath(pathname: string): boolean {
  return /^\/(?:th|en)\/officer(?:\/|$)/.test(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1] ?? "";

  let response: NextResponse;
  let activeLocale: Locale;
  let csp: string;

  if (isLocale(firstSegment)) {
    activeLocale = firstSegment;

    if (isStrictPath(pathname)) {
      // Strict, nonce-based policy. Forward the nonce and the CSP on the request
      // so Next can apply the nonce to its own inline scripts. Reading the CSP
      // opts the route into dynamic rendering, which the officer console already
      // requires (it reads `cookies()`).
      const nonce = generateNonce();
      csp = buildStrictCsp(nonce);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-nonce", nonce);
      requestHeaders.set("Content-Security-Policy", csp);
      response = NextResponse.next({ request: { headers: requestHeaders } });
    } else {
      // Static-friendly policy: no nonce, nothing forces dynamic rendering, so
      // the page can be prerendered and served from the CDN.
      csp = buildStaticCsp();
      response = NextResponse.next();
    }
  } else {
    // No locale prefix: redirect into the detected locale.
    activeLocale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${activeLocale}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.redirect(url);
    csp = buildStaticCsp();
  }

  response.headers.set("Content-Security-Policy", csp);

  // Only write the locale cookie when it actually changes. Setting a cookie on
  // every response adds a `Set-Cookie` header that can defeat CDN caching of the
  // static pages, so returning visitors (whose cookie already matches) get a
  // clean, cacheable response.
  if (request.cookies.get(LOCALE_COOKIE)?.value !== activeLocale) {
    response.cookies.set(LOCALE_COOKIE, activeLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next/static, _next/image (Next internals)
     * - any path with a file extension (favicon.ico, robots.txt, images, etc.)
     */
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
