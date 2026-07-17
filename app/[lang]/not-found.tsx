import { defaultLocale, getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";

/**
 * Segment-level not-found for any unmatched path under `/[lang]`. Next.js
 * *usually* passes the same dynamic `params` used to match the segment, so
 * we can still render in the visited locale, but during static generation
 * (and in some Next.js versions generally) this boundary can be invoked
 * with `params` omitted entirely, so treat it as optional and fall back to
 * the default locale's copy rather than destructuring blindly.
 */
export default async function NotFound({
  params,
}: {
  params?: Promise<{ lang: string }>;
}) {
  const resolved = params ? await params : undefined;
  const lang = resolved?.lang;
  const locale: Locale = lang && isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.notFound.title} lede={dict.notFound.body} />
      <div className="wrap py-10">
        <div className="flex flex-wrap gap-3">
          <Button href={localeHref(locale, "/")}>{dict.notFound.home}</Button>
          {dict.nav.map((item) => (
            <Button key={item.href} href={localeHref(locale, item.href)} variant="secondary">
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
