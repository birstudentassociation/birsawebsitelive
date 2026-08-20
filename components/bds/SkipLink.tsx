/**
 * BIRSA Design System: `SkipLink` (REDESIGN-2.0 §3.5, §4.3, navigation cluster).
 *
 * The first focusable thing on every page, targeting `<main id="main">`.
 * Hidden until it receives keyboard focus, via the `.skip-link` class in
 * `app/globals.css` (a frozen contract this component reads, never edits).
 *
 * Carried over from 1.0's `components/SkipLink.tsx` unchanged: a plain
 * anchor with no client behaviour, so it works identically with JavaScript
 * on or off, and it is the reason a keyboard user never has to tab through
 * the header and the service navigation bar just to reach the page's own
 * content.
 */
export type SkipLinkProps = {
  /** `dict.a11y.skip`: "Skip to main content" (or its Thai equivalent). */
  label: string;
};

export default function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#main" className="skip-link">
      {label}
    </a>
  );
}
