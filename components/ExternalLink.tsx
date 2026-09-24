import clsx from "clsx";
import VisuallyHidden from "@/components/VisuallyHidden";

export type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  /** dict.a11y.newTab ("external site"): passed as a prop so this stays a server component. */
  newTabLabel: string;
  className?: string;
};

/**
 * Anchor for destinations off this site. Opens in the same tab, as GOV.UK
 * advises: a new tab disorients people who cannot see it open, and takes the
 * back button away. The aria-hidden ↗ icon and the visually hidden
 * "(external site)" tell every reader that the link leaves BIRSA.
 */
export default function ExternalLink({
  href,
  children,
  newTabLabel,
  className,
}: ExternalLinkProps) {
  return (
    <a href={href} className={clsx("inline-flex items-center gap-1", className)}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0">
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
