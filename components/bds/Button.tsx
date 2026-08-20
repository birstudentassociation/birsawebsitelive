import Link from "next/link";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Button` (REDESIGN-2.0 §4.3, content cluster).
 *
 * An action. Renders an `<a>` when `href` is supplied, otherwise a real
 * `<button>`: a control that navigates the reader somewhere is a link,
 * styled to look like a button, never a `<button>` wired up with an
 * `onClick` that changes `location`. That distinction is what keeps
 * "open in a new tab", "copy link", middle-click and browser history working
 * the way a reader expects, none of which a `<button>` gives you for free.
 *
 * Every variant meets the 44px minimum target size (`h-11` = 2.75rem = 44px,
 * BUILD-BRIEF-2.0 §7, WCAG 2.5.8, and the site's own higher bar over AA's
 * 24px floor).
 *
 * `start` is new in 2.0: the GDS start-button treatment (REDESIGN-2.0 §4.3b,
 * the `start-pages` pattern) for the single primary action on a service's
 * `StartPage`. It always carries a leading `chevron-right` and always
 * navigates, so it requires `href` at the type level, it cannot be rendered
 * as a `<button>`. Use it once per service, on the start page; every other
 * call to action on the site is `primary`.
 */
type Variant = "primary" | "secondary" | "ghost" | "danger" | "start";

type ButtonAsLink = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type ButtonAsButton = {
  /** `start` always navigates, so it is only valid on the `href` branch below. */
  variant?: Exclude<Variant, "start">;
  className?: string;
  children: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    href?: undefined;
    /** Defaults to `"button"`, never a bare submit left to the browser's guess. */
    type?: "button" | "submit" | "reset";
  };

/** `start` requires `href` at the type level: a start button always navigates. */
export type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "focus-halo inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 font-semibold transition-colors duration-150 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong",
  secondary: "border-[1.5px] border-ink text-ink hover:bg-sunken",
  ghost: "text-ink hover:bg-sunken",
  // `--color-brand-strong` (#b3161c) is defined identically in light and
  // dark mode, unlike `--color-error`, which is lightened for text-on-tint
  // use in dark mode and would fail contrast as a solid white-text fill. It
  // doubles as this site's destructive-action colour for that reason.
  danger: "bg-brand-strong text-white hover:opacity-85",
  start: "bg-brand text-white hover:bg-brand-strong pr-4",
};

export default function Button(props: ButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = clsx(base, variants[variant], className);
  const label = (
    <Text as="span" step="body" className="inline-flex items-center gap-2">
      {children}
      {variant === "start" ? <Icon name="chevron-right" /> : null}
    </Text>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {label}
      </Link>
    );
  }

  const buttonProps = rest as Omit<ButtonAsButton, "href" | "variant" | "className" | "children">;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {label}
    </button>
  );
}
