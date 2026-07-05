import Link from "next/link";
import clsx from "clsx";

export type CardProps = {
  /** When provided, pass the same `href` to a `CardTitle` inside this card
   * so its stretched link makes the whole card clickable — the title text
   * becomes the accessible name for the entire clickable area. */
  href?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Surface card wrapper. Pair with `CardTitle` inside to get a
 * whole-card-clickable stretched link where only the title is the link
 * text (the accessible name for the whole clickable area).
 */
export default function Card({ href, className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "group border-line bg-surface relative flex flex-col gap-2 rounded-lg border p-5 shadow-sm transition-shadow duration-150",
        href && "hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export type CardTitleProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
};

/**
 * Title for use inside `Card`. When `href` matches the card's `href`, this
 * renders the stretched link (`after:absolute after:inset-0`) so the whole
 * card is clickable while the accessible name stays just the title text.
 */
export function CardTitle({ href, children, className, as: Heading = "h3" }: CardTitleProps) {
  return (
    <Heading className={clsx("font-display text-ink text-lg leading-snug", className)}>
      {href ? (
        <Link href={href} className="after:absolute after:inset-0 hover:underline">
          {children}
        </Link>
      ) : (
        children
      )}
    </Heading>
  );
}
