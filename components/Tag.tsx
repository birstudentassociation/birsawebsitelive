import clsx from "clsx";

type Variant = "neutral" | "brand" | "forest";

const variants: Record<Variant, string> = {
  neutral: "bg-sunken text-ink",
  brand: "bg-brand-tint text-brand-deep",
  forest: "bg-forest-tint text-forest",
};

export type TagProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

/** Small label chip used for categories, statuses, and metadata. */
export default function Tag({ variant = "neutral", className, children }: TagProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
