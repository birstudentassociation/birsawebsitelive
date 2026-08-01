import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SOURCES } from "@/content/curriculum";
import { contact } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import { buildStudyPlanCopy, formatUnsupportedCohort } from "@/components/study-plan/studyPlanCopy";
import { getStudyPlanDraft } from "../actions";

type Reason = "cohort" | "not-sure" | "double-degree";

function parseReason(raw: string | undefined): Reason {
  return raw === "cohort" || raw === "double-degree" ? raw : "not-sure";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);

  return buildMetadata({
    locale,
    title: copy.cannotHelp.title,
    description: copy.cannotHelp.title,
    path: "/services/study-plan/cannot-help",
  });
}

/**
 * The stop page. Not a failure state: it is the service being honest that it
 * cannot plan a degree it does not have reliable data for, or that the
 * student has just told it looks wrong. Renders for any `reason` value,
 * including a missing one, so a bare link to this page never 404s or throws.
 */
export default async function StudyPlanCannotHelpPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ reason?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const copy = buildStudyPlanCopy(locale);
  const { reason: rawReason } = await searchParams;
  const reason = parseReason(rawReason);

  // readDraft is read-only and safe during render; only used here to show the
  // cohort code the student actually entered, back to them.
  const draft = await getStudyPlanDraft();

  const body =
    reason === "cohort"
      ? formatUnsupportedCohort(copy, draft.cohort ?? "")
      : reason === "double-degree"
        ? copy.cannotHelp.doubleDegree
        : copy.cannotHelp.notSure;

  const sourceDocs = Object.values(SOURCES);

  return (
    <>
      <PageHeader title={copy.cannotHelp.title} />
      <div className="wrap max-w-[var(--measure)] flex flex-col gap-8 py-10">
        <Notice variant="info">{body}</Notice>

        <div>
          <h2 className="font-display text-xl">{copy.cannotHelp.whatToDo}</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">{copy.cannotHelp.whatToDoBody}</p>
        </div>

        <div>
          <h2 className="font-display text-xl">{copy.cannotHelp.contactHeading}</h2>
          <ul className="text-muted mt-2 flex flex-col gap-1 text-sm">
            <li>{contact.address[locale]}</li>
            <li>
              <a href={`mailto:${contact.email}`} className="text-brand-deep hover:underline">
                {contact.email}
              </a>
            </li>
            <li>{contact.phone}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl">{copy.cannotHelp.sourcesHeading}</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {sourceDocs.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-deep hover:underline"
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Button href={localeHref(locale, "/services")} variant="secondary">
            {copy.cannotHelp.backToServices}
          </Button>
        </div>
      </div>
    </>
  );
}
