import Link from "next/link";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[0.95rem] font-semibold transition-colors duration-150 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "focus-halo bg-brand text-white hover:bg-brand-dark",
  secondary: "border-[1.5px] border-ink text-ink hover:bg-sunken",
  ghost: "text-ink hover:bg-sunken",
};

/**
 * Renders an `<a>` when `href` is provided, otherwise a `<button>`. Both
 * variants meet the 44px minimum target size (h-11 = 2.75rem = 44px).
 */
export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(base, variants[variant], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
