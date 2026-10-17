import clsx from "clsx";

export type InsetTextProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Inset text after the GOV.UK Design System pattern: a grey left border, no
 * fill and no icon. Use it for an aside the reader may want but will not be
 * hurt by missing. The border is grey on purpose; a coloured lip is banned
 * (see tests/unit/no-accent-boxes.test.ts).
 */
export default function InsetText({ className, children }: InsetTextProps) {
  return (
    <div
      className={clsx(
        "border-l-[5px] border-line-strong py-2 pl-4 leading-relaxed text-ink [&>:first-child]:mt-0 [&>:last-child]:mb-0",
        className
      )}
    >
      {children}
    </div>
  );
}
