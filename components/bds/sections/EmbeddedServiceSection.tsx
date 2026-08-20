import StartPage, { type StartPageLabels } from "@/components/bds/StartPage";
import type { ServiceDefinition } from "@/lib/services/defineService";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `EmbeddedServiceSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `embedded-service` entry of `components/bds/sectionPalette.ts`:
 * "a link into a service, rendered as a start card", through `StartPage`
 * (service cluster).
 *
 * THE SAME CONTRACT TENSION AS `TaskListSection`, AND WORTH READING
 * ALONGSIDE IT. `StartPage`'s own file header calls it "the one entry point
 * to every BIRSA service" and "a page-level component: it renders the
 * page's own `<h1>`... do not wrap it in another component that also
 * renders an `<h1>`". `sectionPalette.ts`'s own description, "rendered as a
 * start card", reads as something smaller: a teaser embedded among other
 * sections on, say, a guide page, linking OUT to the service's real start
 * page elsewhere. Those two are different components with different
 * heading budgets, and this section can only faithfully be the first one:
 * used as anything but the sole section on a page, it produces a second
 * `<h1>` and breaks heading order (§9). This cluster does not own
 * `StartPage` and does not alter it; see this cluster's report for the
 * finding, which also names `TaskList`. Until it is resolved, treat
 * `embedded-service` as safe only on a page where it is the one and only
 * section, effectively making it a thin re-export of a service's real start
 * page rather than an embeddable card.
 *
 * Props are `StartPage`'s own: `start` (`ServiceDefinition["start"]`,
 * frozen), `locale`, `href` and `labels`, taken directly rather than
 * re-typed, so this section cannot drift from what `StartPage` actually
 * accepts.
 */
export type EmbeddedServiceSectionProps = {
  start: ServiceDefinition["start"];
  locale: Locale;
  href: string;
  labels: StartPageLabels;
};

export default function EmbeddedServiceSection({
  start,
  locale,
  href,
  labels,
}: EmbeddedServiceSectionProps) {
  return <StartPage start={start} locale={locale} href={href} labels={labels} />;
}
