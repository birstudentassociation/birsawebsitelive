import Link from "next/link";

import { Heading, Text } from "@/components/bds/Type";
import { Stack, Wrap, Section } from "@/components/bds/Layout";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";

/**
 * Shown at `/do/<id>` and every route under it when `id` does not resolve to
 * a published service, whether because it never existed or because
 * `validateServiceDefinition` refused it (`lib/services/registry.ts`'s own
 * "degrade, never crash" note). This is the chassis's version of the site's
 * existing "not configured" house rule, applied at the granularity of one
 * service rather than one integration.
 *
 * Deliberately its own small page rather than `notFound()`: a half-built
 * service is not a broken URL, it is a service that is not ready yet, and
 * the copy here says that rather than showing the generic not-found
 * template. No `ServiceNavigation` here (there is no service identity to
 * navigate within) and no breadcrumb into a service that does not exist.
 */
export default function ServiceUnavailable({ locale }: { locale: Locale }) {
  const dict = getDoDictionary(locale);
  return (
    <Section>
      <Wrap className="max-w-[var(--measure)]">
        <Stack gap="md">
          <Heading level={1}>{dict.do.unavailable.title}</Heading>
          <Text step="body">{dict.do.unavailable.body}</Text>
          <Link
            href={localeHref(locale, "/do")}
            className="focus-halo text-brand-deep underline underline-offset-2"
          >
            <Text as="span" step="body">
              {dict.do.backToServices}
            </Text>
          </Link>
        </Stack>
      </Wrap>
    </Section>
  );
}
