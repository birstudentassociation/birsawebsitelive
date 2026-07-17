import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

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
 * A per-request nonce authorises the inline theme script in the layout; Next
 * automatically applies the same nonce to its own scripts once it sees this
 * header on the request. Styles keep `'unsafe-inline'` (React inline styles /
 * Tailwind), so no nonce is added there; a nonce would disable that keyword.
 * `va.vercel-scripts.com` is Vercel Analytics; its beacon posts to `'self'`.
 */
function buildCsp(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self' https://va.vercel-scripts.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `manifest-src 'self'`,
  ].join("; ");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const firstSegment = pathname.split("/")[1] ?? "";

  let response: NextResponse;
  let activeLocale: Locale;

  if (isLocale(firstSegment)) {
    // Already locale-prefixed: pass through, but refresh the cookie so the
    // visited locale is what persists for next time. Forward the nonce (and the
    // CSP) on the request so the layout can read `x-nonce` and Next can nonce
    // its own inline scripts.
    activeLocale = firstSegment;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", csp);
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    // No locale prefix: redirect into the detected locale.
    activeLocale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${activeLocale}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.redirect(url);
  }

  response.headers.set("Content-Security-Policy", csp);
  response.cookies.set(LOCALE_COOKIE, activeLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

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
