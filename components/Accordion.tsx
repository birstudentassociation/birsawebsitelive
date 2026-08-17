export type AccordionProps = {
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Open by default. */
  defaultOpen?: boolean;
  /** Fires when the disclosure is toggled, with the new open state: lets a
   * caller mirror the open state elsewhere (e.g. to switch the summary
   * label). The `<details>` element stays otherwise uncontrolled. */
  onToggle?: (open: boolean) => void;
};

/**
 * Native `<details>/<summary>` accordion. No JS required; the marker
 * rotation is CSS-only so it already respects `prefers-reduced-motion`
 * (handled globally in `app/globals.css`).
 */
export default function Accordion({
  summary,
  children,
  className,
  defaultOpen,
  onToggle,
}: AccordionProps) {
  return (
    <details
      className={`group rounded-lg border border-line bg-surface open:shadow-sm ${className ?? ""}`}
      open={defaultOpen}
      onToggle={onToggle ? (event) => onToggle(event.currentTarget.open) : undefined}
    >
      <summary className="focus-halo flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
        >
          <path
            d="m5 7.5 5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="border-t border-line px-4 py-3 text-[0.95rem] leading-relaxed text-ink">
        {children}
      </div>
    </details>
  );
}
