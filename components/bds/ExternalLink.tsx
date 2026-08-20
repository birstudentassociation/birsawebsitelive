import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import VisuallyHidden from "@/components/bds/VisuallyHidden";

/**
 * BIRSA Design System: `ExternalLink` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Any link off the site. BUILD-BRIEF-2.0 §7 makes this non-negotiable: an
 * external link opens in a new tab with `rel="noopener noreferrer"`, carries
 * an `aria-hidden` icon so the arrow never becomes the accessible name on
 * its own, and appends visually hidden text so a screen reader announces
 * that the link leaves the tab, which a sighted reader already sees from the
 * icon.
 *
 * `newTabLabel` is a prop rather than a `useDictionary()` call so this stays
 * a server component: pass `dict.a11y.newTab` (the `a11y` namespace, owned
 * by the navigation cluster this wave; content cluster reads its key names
 * only, per this component's brief).
 *
 * §3.6 of REDESIGN-2.0 describes an external link register that a daily cron
 * reads to find dead links. No such register exists anywhere in this
 * checkout yet and building one is not in this component's owned paths, so
 * this component does not invent one; whichever wave adds §3.6's link-rot
 * engineering should wire its collection at this component, since every
 * external link on the site already passes through it.
 */
export type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  /** `dict.a11y.newTab`: "opens in a new tab" (or its Thai equivalent). */
  newTabLabel: string;
  className?: string;
};

export default function ExternalLink({
  href,
  children,
  newTabLabel,
  className,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("inline-flex items-center gap-1", className)}
    >
      {children}
      <Icon name="external-link" />
      <VisuallyHidden> ({newTabLabel})</VisuallyHidden>
    </a>
  );
}
