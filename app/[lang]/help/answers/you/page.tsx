import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/bds/PageHeader";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Notice from "@/components/bds/Notice";
import Radios from "@/components/bds/Radios";
import { Wrap, Stack } from "@/components/bds/Layout";
import { parseProfile, serializeProfile } from "@/lib/smart-answers";
import {
  audienceDimensions,
  audienceQuestions,
  dimensionForValue,
  type AudienceProfile,
} from "@/content/smart-answers/audience";
import { uiCopy } from "@/content/smart-answers";

/**
 * `/help/answers/you` (ROUTE-MAP-2.0 Wave 5C).
 *
 * A rebuild of `app/[lang]/answers/you/page.tsx` against `bds/` primitives
 * (`PageHeader`, `Breadcrumbs`, `Button`, `Notice`, `Radios`) rather than the
 * 1.0 components it imports (defect D7). The 1.0 route stays live and
 * unedited; this is a new mount (BUILD-BRIEF-2.0 §10). `content/smart-answers/**`
 * and `lib/smart-answers.ts` are read, not owned by this agent.
 *
 * Same GET-then-redirect design as the 1.0 page, and for the same reason: a
 * plain form cannot combine three separate radio groups into one `p` token
 * without JavaScript, and the whole feature has to work without it
 * (BUILD-BRIEF-2.0 §7). `safeReturn` only ever sends the reader back inside
 * `/help/answers`, since `return` arrives in the query string and is
 * attacker-controlled.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type PageSearchParams = {
  p?: string | string[];
  return?: string | string[];
  submitted?: string | string[];
} & Partial<Record<(typeof audienceDimensions)[number], string | string[]>>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = uiCopy[locale];

  const base = buildMetadata({
    locale,
    title: t.profileHeading,
    description: t.profileLede,
    path: "/help/answers/you",
  });
  // A settings step, not a destination: useful to link to, not to land on
  // from a search engine.
  return { ...base, robots: { index: false, follow: true } };
}

function firstValue(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

function safeReturn(raw: string): string {
  if (!raw.startsWith("/help/answers")) return "/help/answers";
  if (raw.startsWith("//")) return "/help/answers";
  return raw;
}

export default async function HelpAudienceProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = uiCopy[locale];

  const query = await searchParams;
  const destination = safeReturn(firstValue(query.return) || "/help/answers");

  if (firstValue(query.submitted) === "1") {
    const chosen: AudienceProfile = {};
    for (const dimension of audienceDimensions) {
      const value = firstValue(query[dimension]);
      // Guard against a hand-edited value naming a different dimension.
      if (value && dimensionForValue(value) === dimension) chosen[dimension] = value;
    }

    const token = serializeProfile(chosen);
    const [path, existing] = destination.split("?");
    const carried = new URLSearchParams(existing ?? "");
    carried.delete("p");
    if (token) carried.set("p", token);
    const rest = carried.toString();
    redirect(localeHref(locale, `${path}${rest ? `?${rest}` : ""}`));
  }

  const profile = parseProfile(query.p);
  const formAction = localeHref(locale, "/help/answers/you");
  const cancelHref = localeHref(locale, destination);

  return (
    <>
      <PageHeader
        title={t.profileHeading}
        lede={t.profileLede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.hub.title, href: "/help" },
              { label: t.hub, href: "/help/answers" },
              { label: t.profileHeading },
            ]}
          />
        }
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />

      <Wrap className="py-10">
        <form method="GET" action={formAction} className="flex max-w-[var(--measure)] flex-col gap-8">
          <input type="hidden" name="submitted" value="1" />
          <input type="hidden" name="return" value={destination} />

          <Stack gap="xl">
            {audienceQuestions.map((question) => {
              const current = profile[question.dimension];
              const options = [
                ...question.choices.map((choice) => ({
                  value: choice.value,
                  label: choice.label[locale],
                  hint: choice.hint?.[locale],
                })),
                { value: "", label: t.profileSkip },
              ];

              return (
                <Radios
                  key={question.dimension}
                  name={question.dimension}
                  legend={question.question[locale]}
                  hint={question.hint?.[locale]}
                  options={options}
                  defaultValue={current ?? ""}
                />
              );
            })}

            <Notice variant="info">{t.profileWhy}</Notice>

            <div className="flex items-center gap-5">
              <Button type="submit">{t.profileSave}</Button>
              <Link href={cancelHref} className="focus-halo font-medium text-brand-deep hover:underline">
                {t.back}
              </Link>
            </div>
          </Stack>
        </form>
      </Wrap>
    </>
  );
}
