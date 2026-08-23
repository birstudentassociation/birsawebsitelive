import { getDictionary, localeHref, type Locale } from "@/lib/i18n";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/bds/Breadcrumbs";
import PageHeader from "@/components/bds/PageHeader";
import Button from "@/components/bds/Button";
import { Wrap, Stack } from "@/components/bds/Layout";

/**
 * The shared page shell for the `/help` route family (REDESIGN-2.0 §3.2,
 * ROUTE-MAP-2.0 Wave 5C). Not a `bds/` component: a page part owned by this
 * route family, per §4.1 ("anything outside `components/bds/` is a page
 * part and may not be imported across route families").
 *
 * Wraps every `/help` page in the same `PageHeader` (one `<h1>`, breadcrumbs,
 * a mandatory `helpSlot`) and the same `Wrap` container, so WCAG 3.2.6
 * consistent help (BUILD-BRIEF-2.0 §7) is a property of this one file rather
 * than something copied into twenty pages by hand. `helpSlot` defaults to a
 * link to `/contact`, which is what every `/help` page falls back to unless
 * it has something more specific to offer.
 *
 * `narrow` (default true) constrains the body to the reading measure, which
 * is right for prose pages. Pages carrying tables, card grids or a two
 * column layout (for example `/help/university-services`) pass
 * `narrow={false}` and set their own width inside `children`.
 */
export type HelpPageShellProps = {
  locale: Locale;
  title: string;
  lede?: string;
  breadcrumbItems: BreadcrumbItem[];
  helpSlot?: React.ReactNode;
  /** Rendered before the main `Wrap`, e.g. `ExitThisPage`. */
  beforeContent?: React.ReactNode;
  narrow?: boolean;
  children: React.ReactNode;
};

export default function HelpPageShell({
  locale,
  title,
  lede,
  breadcrumbItems,
  helpSlot,
  beforeContent,
  narrow = true,
  children,
}: HelpPageShellProps) {
  const dict = getDictionary(locale);

  return (
    <>
      {beforeContent}
      <PageHeader
        title={title}
        lede={lede}
        breadcrumbs={
          <Breadcrumbs locale={locale} label={dict.a11y.breadcrumb} items={breadcrumbItems} />
        }
        helpSlot={
          helpSlot ?? (
            <Button href={localeHref(locale, "/contact")} variant="secondary">
              {dict.actions.contactUs}
            </Button>
          )
        }
      />
      <Wrap className="py-10">
        <Stack gap="2xl" className={narrow ? "max-w-[var(--measure)]" : undefined}>
          {children}
        </Stack>
      </Wrap>
    </>
  );
}
