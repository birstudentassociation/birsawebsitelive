import clsx from "clsx";

export type PanelProps = {
  title: string;
  /** Heading element. Defaults to h1 because a panel is the page's confirmation. */
  headingLevel?: "h1" | "h2" | "h3";
  /** Optional body or reference line shown under the heading. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Confirmation panel after the GOV.UK Design System pattern: solid success
 * fill, centred heading, optional reference line. No border lip. Use it once,
 * on a "sent" or "done" page.
 */
export default function Panel({ title, headingLevel = "h1", children, className }: PanelProps) {
  const Heading = headingLevel;
  return (
    <div className={clsx("bg-success px-4 py-8 text-center text-cream sm:px-8", className)}>
      <Heading className="text-3xl leading-tight font-bold text-cream">{title}</Heading>
      {children ? (
        <div className="mt-4 text-xl leading-snug [&>:last-child]:mb-0">{children}</div>
      ) : null}
    </div>
  );
}
