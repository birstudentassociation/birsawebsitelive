import Card, { CardTitle } from "@/components/bds/Card";
import { Text } from "@/components/bds/Type";
import type { HeadingLevel } from "@/components/bds/Type";
import type { ServiceDefinition } from "@/lib/services/defineService";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `EmbeddedServiceSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `embedded-service` entry of `components/bds/sectionPalette.ts`:
 * "a link into a service, rendered as a start card".
 *
 * WHY THIS IS A `Card` AND NOT `StartPage`. The palette originally named
 * `StartPage` as this section's component, and that mapping was wrong. The
 * two are not interchangeable, and the difference is a heading budget.
 *
 * `StartPage` is the one entry point to a service and is page level: it
 * renders the page's own `h1` plus the full `start` contract, who it is for,
 * what you need, how long it takes and what happens next. A SECTION is one
 * item in a list of sections on a page that already has an `h1`. Rendering
 * `StartPage` there put a SECOND `h1` on the host page and broke the heading
 * order the accessibility suite asserts (§9). That is exactly what this same
 * palette forbids an officer from doing through `RichTextSection`, where
 * `h1` is deliberately absent from `allowedBlocks`. A constraint that blocks
 * the officer and then breaks itself is not a constraint, so the mapping
 * changed rather than the rule.
 *
 * So this is what its own description always said: a start CARD. It
 * advertises a service from inside a guide page and links OUT to the
 * service's real start page, where `StartPage` renders properly as the `h1`
 * of a page of its own. The reader meets the full "who it is for and what you
 * need" content once, at the point of starting, rather than twice.
 *
 * The card carries no separate start button on purpose. `CardTitle` renders a
 * stretched link, so the whole card is already one click target whose
 * accessible name is the service title. Adding a button inside would put a
 * second interactive control underneath that stretched link, which is both a
 * nested interactive control and two competing targets for the same
 * destination.
 *
 * `headingLevel` defaults to 2 and is never 1: a section cannot know how
 * deeply it sits in the host page's outline, but it always sits below the
 * page's own heading.
 *
 * Every user facing string arrives as a prop. This cluster owns no dictionary
 * namespace, so the calling page supplies its copy in both locales.
 */
export type EmbeddedServiceSectionProps = {
  /** `ServiceDefinition["start"]`, unchanged from the frozen contract. */
  start: ServiceDefinition["start"];
  locale: Locale;
  /** The service's real start page, where `StartPage` renders as the `h1`. */
  href: string;
  /** Heading level for the card title. Never 1. */
  headingLevel?: Exclude<HeadingLevel, 1>;
};

export default function EmbeddedServiceSection({
  start,
  locale,
  href,
  headingLevel = 2,
}: EmbeddedServiceSectionProps) {
  return (
    <Card href={href}>
      <CardTitle href={href} level={headingLevel}>
        {start.title[locale]}
      </CardTitle>
      <Text step="body" className="text-muted">
        {start.whoFor[locale]}
      </Text>
    </Card>
  );
}
