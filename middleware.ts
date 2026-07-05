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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1] ?? "";

  let response: NextResponse;
  let activeLocale: Locale;

  if (isLocale(firstSegment)) {
    // Already locale-prefixed — pass through, but refresh the cookie so the
    // visited locale is what persists for next time.
    activeLocale = firstSegment;
    response = NextResponse.next();
  } else {
    // No locale prefix — redirect into the detected locale.
    activeLocale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${activeLocale}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.redirect(url);
  }

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
