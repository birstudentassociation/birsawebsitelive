/**
 * Visually-hidden text that remains available to screen readers. Used for
 * accessible names/labels that we don't want to show sighted users (e.g.
 * "(opens in a new tab)" after an external link icon).
 */
export default function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
