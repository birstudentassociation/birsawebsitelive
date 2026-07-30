import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { THEME_SCRIPT_HASH } from "@/lib/theme-script";
import { buildStrictCsp } from "@/lib/csp.mjs";

const LOCALE_COOKIE = "NEXT_LOCALE";

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
 * This middleware used to run on every non-asset request and set the
 * Content-Security-Policy header for every response, static or not. That was
 * wasted compute: the CSP for ordinary pages (`buildStaticCsp` in
 * `lib/csp.mjs`) is a constant string with no per-request input, so it has
 * moved into `next.config.mjs`'s `headers()` block instead, where the CDN can
 * attach it to prerendered HTML for free. Only two situations still need a
 * request to reach this function, and the `matcher` below is narrowed to
 * exactly those:
 *
 * - No locale prefix at all: the Accept-Language / cookie locale-detect
 *   redirect has to run server-side before there is a page to serve.
 * - `/(th|en)/officer/...`: the officer console keeps the strict, nonce-based
 *   CSP (`buildStrictCsp`), because it reads `cookies()` and is already
 *   dynamic and low-traffic, so paying for middleware here costs nothing
 *   extra. The nonce cannot be precomputed like the static policy, so it has
 *   to stay here rather than in `next.config.mjs`.
 *
 * Every other locale-prefixed path (the vast majority of traffic) never
 * enters this function at all; it is a pure CDN hit on static HTML with the
 * CSP already attached by `next.config.mjs`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (!isLocale(firstSegment)) {
    // No locale prefix: redirect into the detected locale. This is the one
    // case where a request with no locale segment reaches middleware at all;
    // once redirected, the follow-up request is locale-prefixed and, unless
    // it's an officer route, never touches this function again.
    const activeLocale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${activeLocale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);

    // Only write the locale cookie when it actually changes, so a returning
    // visitor whose cookie already matches doesn't pick up a fresh
    // `Set-Cookie` header on every redirect.
    if (request.cookies.get(LOCALE_COOKIE)?.value !== activeLocale) {
      response.cookies.set(LOCALE_COOKIE, activeLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        // GOV.UK Service Manual, "working with cookies and similar
        // technologies": only send cookies with the Secure attribute and,
        // where appropriate, HttpOnly. `secure: process.env.NODE_ENV ===
        // "production"` matches the officer session cookie in
        // app/api/officer/session/route.ts, so localhost HTTP dev still
        // works. This cookie is only ever read server-side (here and in
        // server components), never by client JS, so httpOnly costs nothing.
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
    }

    return response;
  }

  // The matcher below only sends locale-prefixed paths here when they are
  // under `/officer`, so reaching this point means it's the strict-CSP
  // console. Forward the nonce and the CSP on the request headers so Next can
  // apply the nonce to its own inline hydration scripts; reading the CSP this
  // way opts the route into dynamic rendering, which the officer console
  // already requires.
  const nonce = generateNonce();
  const csp = buildStrictCsp(nonce, THEME_SCRIPT_HASH);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match only:
     * - paths that do NOT start with a `/th` or `/en` locale segment (these
     *   still need the locale-detect redirect), and
     * - `/th/officer/...` and `/en/officer/...` (these still need the
     *   per-request nonce).
     *
     * Every other locale-prefixed path is a static page served straight from
     * the CDN with the CSP already attached by `next.config.mjs`, so it's
     * excluded here to avoid paying for a middleware invocation on it.
     *
     * As before, this also excludes api routes, `_next/static`, `_next/image`,
     * and any path that looks like a static file (has a dot in the last
     * segment, e.g. `/robots.txt`, `/favicon.ico`).
     */
    "/((?!api|_next/static|_next/image|.*\\..*|(?:th|en)(?:$|/(?!officer(?:/|$)))).*)",
  ],
};
