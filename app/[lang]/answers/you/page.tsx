import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Notice from "@/components/Notice";
import { parseProfile, serializeProfile } from "@/lib/smart-answers";
import {
  audienceDimensions,
  audienceQuestions,
  dimensionForValue,
  type AudienceProfile,
} from "@/content/smart-answers/audience";
import { uiCopy } from "@/content/smart-answers";

/**
 * Where the reader tells the service who they are, in three questions they
 * can answer in any combination or skip entirely.
 *
 * The form submits by GET to this same page with one param per dimension.
 * The page then packs those into the single `p` token and redirects to
 * wherever the reader came from, so the profile arrives as part of an
 * ordinary URL and no state is held anywhere else. That redirect is the only
 * reason this route exists rather than the form writing `p` directly: a
 * plain GET form cannot combine three fields into one param without
 * JavaScript, and the whole feature has to work without it.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type PageSearchParams = {
  p?: string | string[];
  return?: string | string[];
  origin?: string | string[];
  stage?: string | string[];
  role?: string | string[];
  submitted?: string | string[];
};

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
    path: "/answers/you",
  });
  // A settings step, not a destination: useful to link to, not to land on
  // from a search engine.
  return { ...base, robots: { index: false, follow: true } };
}

function firstValue(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

/**
 * Only ever return to somewhere inside this feature. `return` arrives in the
 * query string, so it is attacker-controlled and could otherwise be used to
 * bounce someone off the site from a link that looks like ours.
 */
function safeReturn(raw: string): string {
  if (!raw.startsWith("/answers")) return "/answers";
  if (raw.startsWith("//")) return "/answers";
  return raw;
}

export default async function AudienceProfilePage({
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
  const destination = safeReturn(firstValue(query.return) || "/answers");

  // The form came back: pack the three fields into `p` and send the reader on.
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
  const formAction = localeHref(locale, "/answers/you");
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
              { label: t.hub, href: "/answers" },
              { label: t.profileHeading },
            ]}
          />
        }
      />

      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <form method="GET" action={formAction} className="flex flex-col gap-8">
          <input type="hidden" name="submitted" value="1" />
          <input type="hidden" name="return" value={destination} />

          {audienceQuestions.map((question) => {
            const hintId = question.hint ? `${question.dimension}-hint` : undefined;
            const current = profile[question.dimension];

            return (
              <fieldset
                key={question.dimension}
                className="flex flex-col gap-4"
                aria-describedby={hintId}
              >
                <legend>
                  <h2 className="font-display text-xl text-ink">{question.question[locale]}</h2>
                </legend>
                {question.hint ? (
                  <p id={hintId} className="text-sm leading-relaxed text-muted">
                    {question.hint[locale]}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3">
                  {question.choices.map((choice) => (
                    <label
                      key={choice.value}
                      className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint"
                    >
                      <input
                        type="radio"
                        name={question.dimension}
                        value={choice.value}
                        defaultChecked={current === choice.value}
                        className="focus-halo mt-0.5 h-5 w-5 shrink-0 border-input-border accent-brand"
                      />
                      <span className="flex flex-col gap-1">
                        <span className="font-semibold text-ink">{choice.label[locale]}</span>
                        {choice.hint ? (
                          <span className="text-sm text-muted">{choice.hint[locale]}</span>
                        ) : null}
                      </span>
                    </label>
                  ))}

                  {/* No radio selected is a valid, meaningful state, but an
                      already-selected radio cannot be cleared with the
                      keyboard alone, so "prefer not to say" needs to be a
                      real choice rather than the absence of one. */}
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-input-border bg-surface p-4 focus-within:border-brand has-checked:border-brand has-checked:bg-brand-tint">
                    <input
                      type="radio"
                      name={question.dimension}
                      value=""
                      defaultChecked={current === undefined}
                      className="focus-halo mt-0.5 h-5 w-5 shrink-0 border-input-border accent-brand"
                    />
                    <span className="font-semibold text-ink">{t.profileSkip}</span>
                  </label>
                </div>
              </fieldset>
            );
          })}

          <Notice variant="info">{t.profileWhy}</Notice>

          <div className="flex items-center gap-5">
            <Button type="submit">{t.profileSave}</Button>
            <Link href={cancelHref} className="font-medium text-brand-deep hover:underline">
              {t.back}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
