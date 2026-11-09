import VisuallyHidden from "@/components/VisuallyHidden";

export type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  /** dict.a11y.newTab: passed as a prop so this stays a server component. */
  newTabLabel: string;
  className?: string;
};

/**
 * Anchor for external destinations: opens in a new tab with
 * `rel="noopener noreferrer"`, an aria-hidden ↗ icon, and visually-hidden
 * "(opens in a new tab)" text appended to the accessible name.
 */
export default function ExternalLink({
  href,
  children,
  newTabLabel,
  className,
}: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="ml-1 inline-block h-3.5 w-3.5 align-[-0.125em]"
      >
        <path
          d="M7 13 13 7M8 7h5v5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <VisuallyHidden> ({newTabLabel})</VisuallyHidden>
    </a>
  );
}
