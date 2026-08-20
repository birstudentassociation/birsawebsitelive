import clsx from "clsx";

import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `BackLink` (REDESIGN-2.0 §3.5, §4.4, navigation cluster).
 *
 * 1.0 had nothing here, so the only way out of a wizard step was browser-back
 * against a draft cookie, which is exactly the fragile pattern GDS built the
 * back link to replace (§8 heuristic 3). Use it on every wizard step
 * (`/do/[service]/[step]`, and the equipment loan and lost and found wizards
 * once they migrate onto the chassis).
 *
 * It is an `<a>`, never a `<button>`: going back one question is navigation,
 * not an action, so it needs a real `href`, keeps working with JavaScript
 * off, and behaves like every other link under middle-click, "open in a new
 * tab" and browser history.
 *
 * `href` is deliberately explicit rather than `history.back()`. This is what
 * "one QUESTION, not one page of history" means in practice: the caller
 * (the step page) always knows which question came before it, and passing
 * that route directly means a reader who arrived on this step from a saved
 * link, a status page, or a validation error redirect still goes back to the
 * right question rather than wherever the browser's history stack happens to
 * hold next.
 */
export type BackLinkProps = {
  locale: Locale;
  /** Path to the previous step, relative to the locale root, e.g. "/do/equipment-loan/dates". */
  href: string;
  /** `dict.a11y.back`: "Back" (or its Thai equivalent). */
  label: string;
  className?: string;
};

export default function BackLink({ locale, href, label, className }: BackLinkProps) {
  return (
    <a
      href={localeHref(locale, href)}
      className={clsx(
        "focus-halo inline-flex min-h-11 items-center gap-1 rounded-md text-ink hover:text-brand-deep",
        className
      )}
    >
      <Icon name="chevron-left" />
      <Text as="span" step="body">
        {label}
      </Text>
    </a>
  );
}
