/**
 * BIRSA Design System: `VisuallyHidden` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Text for assistive technology only. If sighted readers would also benefit
 * from it, it is not hidden text, it is missing text: write it into the
 * visible copy instead of reaching for this component. Use this only for
 * context a screen reader needs and a sighted reader already has some other
 * way to see, such as the field name a "Change" link in `SummaryList` acts
 * on, or the "(opens in a new tab)" note `ExternalLink` appends.
 *
 * Carried over from 1.0's `components/VisuallyHidden.tsx` unchanged: `.sr-only`
 * is the standard clip-based hiding technique (not `display: none`, which
 * would also hide it from assistive technology) and needs no styling of its
 * own here.
 */
export type VisuallyHiddenProps = {
  children: React.ReactNode;
};

export default function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span className="sr-only">{children}</span>;
}
