import Link from "next/link";
import { localeHref, type Locale } from "@/lib/i18n";
import { contact } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import Email from "@/components/Email";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { submitFeedbackAction } from "@/app/[lang]/feedback/actions";

const copy = {
  en: {
    nextTitle: "What happens next",
    questions: "If you have a question, email",
    home: "Go to the home page",
  },
  th: {
    nextTitle: "ขั้นตอนต่อไป",
    questions: "หากมีคำถาม อีเมลถึง",
    home: "กลับหน้าแรก",
  },
} satisfies Record<Locale, unknown>;

export type ConfirmationPageProps = {
  locale: Locale;
  /** The outcome, as the page heading: "Message sent", not "Thank you". */
  title: string;
  reference?: { label: string; value: string };
  /** What happens next and when. */
  next: string[];
  /** Links to what the reader is likely to need next. */
  links?: { href: string; label: string }[];
  /** This journey's path, e.g. "/en/contact/sent", stored with any feedback. */
  sourcePath: string;
};

/**
 * End of a journey, per the GOV.UK Confirmation pages pattern: the outcome
 * as the heading, the reference number if there is one, what happens next,
 * how to get in touch, where to go next, and a way to say what the service
 * was like (Service Manual: measure satisfaction at the end of every
 * journey). Each journey's confirmation has its own address, so it can be
 * bookmarked and its visits counted.
 */
export default function ConfirmationPage({
  locale,
  title,
  reference,
  next,
  links = [],
  sourcePath,
}: ConfirmationPageProps) {
  const t = copy[locale];
  const link = "font-semibold text-brand-deep underline underline-offset-4 hover:text-brand-dark";

  return (
    <>
      <PageHeader title={title} />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        {reference && reference.value ? (
          <div className="rounded-lg border-l-4 border-success bg-success-tint p-6 text-ink">
            <p>{reference.label}</p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-wide">{reference.value}</p>
          </div>
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t.nextTitle}</h2>
          {next.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            {t.questions} <Email address={contact.email} className={link} />
            {locale === "en" ? "." : ""}
          </p>
        </section>

        <ul className="flex flex-col gap-2">
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={link}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href={localeHref(locale, "/")} className={link}>
              {t.home}
            </Link>
          </li>
        </ul>

        <FeedbackForm locale={locale} sourcePath={sourcePath} action={submitFeedbackAction} />
      </div>
    </>
  );
}
