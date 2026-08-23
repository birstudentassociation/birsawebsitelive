import type { Metadata } from "next";

import Button from "@/components/bds/Button";
import PageHeader from "@/components/bds/PageHeader";
import { Wrap } from "@/components/bds/Layout";
import { defaultLocale, getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";

/**
 * Segment-level not-found for any unmatched path under `/[lang]`
 * (BUILD-BRIEF-2.0 §7, ROUTE-MAP-2.0 Wave 5F). Next.js *usually* passes the
 * same dynamic `params` used to match the segment, so this can still render
 * in the visited locale, but during static generation (and in some Next.js
 * versions generally) this boundary can be invoked with `params` omitted
 * entirely, so it is treated as optional and falls back to the default
 * locale's copy rather than destructuring blindly.
 *
 * Nothing about the request that produced the 404, in particular the path
 * that did not match, is rendered on this page: a URL a reader typed or
 * followed can carry personal data (an email address pasted where a slug
 * was expected, for example), and this boundary has no way to tell that
 * apart from an ordinary typo, so it says nothing about the path at all.
 */
export async function generateMetadata({
  params,
}: {
  params?: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolved = params ? await params : undefined;
  const lang = resolved?.lang;
  const locale: Locale = lang && isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);

  return { title: `${dict.notFound.title} | ${dict.site.name}` };
}

export default async function NotFound({ params }: { params?: Promise<{ lang: string }> }) {
  const resolved = params ? await params : undefined;
  const lang = resolved?.lang;
  const locale: Locale = lang && isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader
        title={dict.notFound.title}
        lede={dict.notFound.body}
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex flex-col gap-6 py-10">
        <div className="flex flex-wrap gap-3">
          <Button href={localeHref(locale, "/")}>{dict.notFound.home}</Button>
          {dict.nav.map((item) => (
            <Button key={item.href} href={localeHref(locale, item.href)} variant="secondary">
              {item.label}
            </Button>
          ))}
        </div>
      </Wrap>
    </>
  );
}
