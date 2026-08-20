import clsx from "clsx";

import Button from "@/components/bds/Button";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import type { Locale } from "@/lib/i18n";
import type { ServiceDefinition } from "@/lib/services/defineService";

/**
 * BIRSA Design System: `StartPage` (REDESIGN-2.0 §5.1 item 1, §4.3b
 * `start-pages` and `start-using-a-service`, service cluster).
 *
 * The one entry point to every BIRSA service. Renders every field of a
 * `ServiceDefinition["start"]` (`lib/services/defineService.ts`, frozen):
 * what the service does, who it is for, what the reader needs before they
 * begin, how long it takes, and what happens next. Nothing here is
 * optional, because `defineService.ts` says every field of `start` is
 * publish-blocking, so a `StartPage` that skipped one would be rendering a
 * definition that could never legitimately exist.
 *
 * `start.whoFor` IS ALSO `check-a-service-is-suitable`. The frozen type
 * carries a single bilingual field for "who it is for", documented against
 * the GDS pattern of the same name: it is the field that tells a student
 * this service is not for them before they commit to filling in six pages of
 * questions, and copy authored against it should say both halves (who it is
 * for, and who it is not) rather than only the positive case. This
 * component does not split that into two fields because the frozen contract
 * does not; splitting it here would silently diverge from what
 * `validateServiceDefinition` actually validates.
 *
 * HEADING ORDER. This is a page-level component: it renders the page's own
 * `<h1>` (the service title) and two `<h2>`s ("before you begin", "what
 * happens next"). Do not wrap it in another component that also renders an
 * `<h1>`; if the calling page needs a `PageHeader`-style breadcrumb strip
 * above this, render the breadcrumbs without their own competing heading.
 *
 * The single primary action uses `Button`'s `start` variant (REDESIGN-2.0
 * §4.3b, the `start-pages` pattern's green/red start button with a leading
 * chevron), and there is exactly one per page: the CTA into the first
 * question step (`lib/services/defineService.ts`'s `serviceSteps`, first
 * entry).
 */
export type StartPageLabels = {
  /** Heading over the `before` list, e.g. "Before you begin". */
  beforeHeading: string;
  /** Heading over `howLong`, e.g. "How long it takes". */
  howLongHeading: string;
  /** Heading over `whatNext`, e.g. "What happens next". */
  whatNextHeading: string;
  /** The start button's visible text, e.g. "Start now". */
  startCta: string;
};

export type StartPageProps = {
  /** `ServiceDefinition["start"]`, unchanged from the frozen contract. */
  start: ServiceDefinition["start"];
  locale: Locale;
  /** Where the start button goes: the first question step's URL. */
  href: string;
  labels: StartPageLabels;
  className?: string;
};

export default function StartPage({ start, locale, href, labels, className }: StartPageProps) {
  return (
    <Stack gap="xl" className={clsx(className)}>
      <Stack gap="md">
        <Heading level={1}>{start.title[locale]}</Heading>
        <Text step="body">{start.whoFor[locale]}</Text>
      </Stack>

      <Stack gap="sm" as="div">
        <Heading level={2} step="heading-2">
          {labels.beforeHeading}
        </Heading>
        <Stack as="ul" gap="2xs" className="list-disc pl-5">
          {start.before.map((item, index) => (
            <Text as="li" step="body" key={`${index}-${item[locale]}`}>
              {item[locale]}
            </Text>
          ))}
        </Stack>
      </Stack>

      <Stack gap="sm" as="div">
        <Heading level={2} step="heading-2">
          {labels.howLongHeading}
        </Heading>
        <Text step="body">{start.howLong[locale]}</Text>
      </Stack>

      <Stack gap="sm" as="div">
        <Heading level={2} step="heading-2">
          {labels.whatNextHeading}
        </Heading>
        <Text step="body">{start.whatNext[locale]}</Text>
      </Stack>

      <div>
        <Button href={href} variant="start">
          {labels.startCta}
        </Button>
      </div>
    </Stack>
  );
}
