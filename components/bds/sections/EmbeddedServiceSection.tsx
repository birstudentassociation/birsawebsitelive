// `StartPage` (service cluster, §4.4) does not exist in this checkout yet.
// This import is expected to fail typecheck until that cluster lands it;
// see this cluster's report. `StartPage`'s manifest usage rule describes a
// full page ("says what it does, who it is for, what you need, how long,
// and what happens next"), while `sectionPalette.ts` describes this section
// as "a link into a service, rendered as a start card": the props below are
// this cluster's best guess at a compact/embedded usage of `StartPage`
// rather than a confirmed API, since the component does not exist to check
// against.
import StartPage from "@/components/bds/StartPage";

/**
 * BIRSA Design System: `EmbeddedServiceSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `embedded-service` entry of `components/bds/sectionPalette.ts`:
 * a link into a service, rendered as a start card, through `StartPage`
 * (service cluster). "References a published service definition from the
 * registry" (`sectionPalette.ts`) is CMS-side publish validation against
 * `lib/services/defineService.ts`'s registry; this component receives the
 * already-resolved service fields as plain props rather than resolving a
 * service ID itself, the same pattern `ContactPanelSection` uses for
 * portfolio contact details.
 */
export type EmbeddedServiceSectionProps = {
  serviceId: string;
  title: string;
  summary: string;
  href: string;
  startLabel: string;
};

export default function EmbeddedServiceSection({
  serviceId,
  title,
  summary,
  href,
  startLabel,
}: EmbeddedServiceSectionProps) {
  return (
    <StartPage
      serviceId={serviceId}
      title={title}
      summary={summary}
      href={href}
      startLabel={startLabel}
    />
  );
}
