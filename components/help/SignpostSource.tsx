import ExternalLink from "@/components/bds/ExternalLink";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * The one fixed piece of every §3.6 signpost page (REDESIGN-2.0 §3.6,
 * ROUTE-MAP-2.0 Wave 5C): the named body that actually owns the rest of the
 * picture, and a link out to it. A page part for the `/help` family, not a
 * `bds/` component (§4.1).
 *
 * A signpost page is a real page type, not a lesser one: it says what BIRSA
 * knows, names who decides, and links out. It must never restate the
 * source's own content, which is the drift the audit found live twice
 * (`docs/SCOPE-AUDIT-2.0.md` §4). `body` should say what the named source
 * does, in one or two sentences, not what it currently publishes.
 */
export type SignpostSourceProps = {
  locale: Locale;
  /** The named authoritative body, e.g. "TU International Affairs". */
  name: string;
  /** One or two sentences on what that body actually decides here. Never a restatement of its published content. */
  body: string;
  href: string;
  /** Visible link text naming the destination, e.g. "TU International Affairs website". Never "click here" or a bare "Read more". */
  linkLabel: string;
  className?: string;
};

export default function SignpostSource({
  locale,
  name,
  body,
  href,
  linkLabel,
  className,
}: SignpostSourceProps) {
  const dict = getDictionary(locale);

  return (
    <Stack gap="xs" as="div" className={className}>
      <Text as="p" step="body-sm" className="font-semibold text-muted uppercase">
        {dict.signpost.whoToAskLabel}
      </Text>
      <Heading level={3}>{name}</Heading>
      <Text step="body">{body}</Text>
      <div>
        <ExternalLink
          href={href}
          newTabLabel={dict.a11y.newTab}
          className="font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
        >
          {linkLabel}
        </ExternalLink>
      </div>
    </Stack>
  );
}
