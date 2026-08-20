import Link from "next/link";
import clsx from "clsx";

import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `ServiceNavigation` (REDESIGN-2.0 §3.5, §4.4,
 * navigation cluster).
 *
 * The piece 1.0 was missing entirely. A second navigation bar below the site
 * header, scoped to the current service, carrying that service's own links:
 * start again, check status, cancel a request. Without it, a student six
 * steps into the loan wizard sees only the site-wide header, so the service
 * has no identity of its own and no way to expose links that only make sense
 * while inside it. This is what makes `/do` viable at eleven services rather
 * than the two 1.0 had (§3.5, §4.4).
 *
 * A plain server-rendered `<nav>`: every link is a real `<a>`, so it works
 * with JavaScript off, and the caller decides which link is "current" the
 * same way `Breadcrumbs` does, by passing `current: true` on that item
 * rather than this component reading `usePathname` itself. That keeps this
 * a server component, and it is a server component on purpose (see the CSS
 * custom property note below, which needs no client JS to work).
 *
 * CRITICAL, WCAG 2.4.11 (BUILD-BRIEF-2.0 §7, and the long comment on
 * `--bds-service-nav-height` in `components/bds/tokens.css`): `html`'s
 * `scroll-padding-top` is `var(--bds-chrome-height)`, which adds the header
 * and this bar together, and `--bds-service-nav-height` defaults to `0rem`
 * so a page with no service navigation is unaffected. When this component
 * IS rendered, it has to set that variable at the ROOT, not on itself: a
 * custom property set on this `<nav>` would only be visible to its own
 * descendants, and `scroll-padding-top` is read on `<html>`, an ancestor
 * this component cannot reach through the normal cascade. The fix is the
 * plain `<style>` element below, which is valid HTML anywhere in the body,
 * needs no client JavaScript (so it works exactly the same with JS off,
 * unlike a `useEffect` calling `document.documentElement.style.setProperty`,
 * which would leave the very first paint under-corrected and would not run
 * at all without JS), and disappears along with the rest of this
 * component's output the moment a page stops rendering it, letting the
 * `0rem` default in `tokens.css` take back over.
 *
 * The bar is a single fixed-height row (`SERVICE_NAV_HEIGHT`) rather than
 * measured at runtime, precisely so this can stay a plain `<style>` tag
 * instead of a client measurement: a service navigation bar that wrapped
 * across two lines because of a long service name would silently invalidate
 * the height this sets, so keep service names and the link list short
 * enough to fit one row at 320px, the readable-width floor (BUILD-BRIEF-2.0
 * §7).
 */
const SERVICE_NAV_HEIGHT = "3.5rem";

export type ServiceNavLink = {
  href: string;
  label: string;
  /** Marks this link as the page the reader is already on (`aria-current="page"`). */
  current?: boolean;
};

export type ServiceNavigationProps = {
  locale: Locale;
  /** The service's name, e.g. "Equipment loan". Filled into `ariaLabelTemplate`. */
  serviceName: string;
  links: ServiceNavLink[];
  /** `dict.a11y.serviceNavigation`, containing the literal placeholder "{service}". */
  ariaLabelTemplate: string;
  className?: string;
};

export default function ServiceNavigation({
  locale,
  serviceName,
  links,
  ariaLabelTemplate,
  className,
}: ServiceNavigationProps) {
  const ariaLabel = ariaLabelTemplate.replace("{service}", serviceName);

  return (
    <>
      <style>{`:root{--bds-service-nav-height:${SERVICE_NAV_HEIGHT};}`}</style>
      <nav
        aria-label={ariaLabel}
        style={{ top: "var(--bds-header-height)" }}
        className={clsx(
          "sticky z-30 border-b border-line bg-surface",
          className
        )}
      >
        <div className="wrap flex h-14 items-center gap-6 overflow-x-auto">
          <Text as="span" step="body" className="shrink-0 font-semibold text-brand-deep">
            {serviceName}
          </Text>
          <ul className="flex shrink-0 items-center gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={localeHref(locale, link.href)}
                  aria-current={link.current ? "page" : undefined}
                  className={clsx(
                    "focus-halo inline-flex min-h-11 items-center border-b-2 py-1",
                    link.current
                      ? "border-brand font-semibold text-brand-deep"
                      : "border-transparent text-ink hover:text-brand-deep"
                  )}
                >
                  <Text as="span" step="body">
                    {link.label}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
