/**
 * What a student can do with a finished plan beyond reading it: share it with
 * an advisor, send the electives in it to Academic Affairs, ask the BIR office
 * about it, and see the registration dates for its terms.
 *
 * One self-contained section for the bottom of the plan screen, so the screen
 * itself needs a single line to carry it. Every part is optional and every part
 * works with JavaScript off. The plan is read from the plan the screen already
 * holds, through the plan's own types, and nothing here depends on how the
 * browser stores it. The share link carries the plan in its fragment, which a
 * browser never sends to a server; the elective form carries a list of course
 * and term pairs and nothing else; the "ask" link is a `mailto:` to the BIR
 * office with the plan summary in its body, and the same summary is shown as
 * text to copy, so nothing about the question passes through BIRSA.
 */
import Link from "next/link";
import Notice from "@/components/Notice";
import Field from "@/components/Field";
import BirOfficeContact, { birOfficeContactHref } from "@/components/BirOfficeContact";
import ExternalLink from "@/components/ExternalLink";
import CopyLinkButton from "@/components/study-plan/CopyLinkButton";
import ElectiveDemandForm from "@/components/study-plan/ElectiveDemandForm";
import { buildPlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import { submitElectiveDemand } from "@/app/[lang]/services/study-plan/share-actions";
import { calendarEvents, type CalendarEvent } from "@/content/calendar/events";
import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { birOffice } from "@/content/site";
import { currentTerm, termKey } from "@/lib/course-review/terms";
import { buildDemandPayload, encodeDemandEntries } from "@/lib/elective-demand/payload";
import { DEMAND_THRESHOLD } from "@/lib/elective-demand/threshold";
import { academicTermLabel } from "@/lib/elective-demand/terms";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";
import type { FindingSources } from "@/lib/study-plan/findings";
import { mailtoHrefWithFallback } from "@/lib/mailto";
import { PLAN_FIELD, type StudyPlan } from "@/lib/study-plan/plan";
import {
  encodeTermsParam,
  plannedAcademicTerms,
  registrationEventsFor,
} from "@/lib/study-plan/registrationDates";
import { encodeShareFragment, shareDateOf } from "@/lib/study-plan/shareFragment";
import { planSummaryText } from "@/lib/study-plan/summaryText";
import { SITE_URL } from "@/lib/site-url";

export type PlanOutreachProps = {
  plan: StudyPlan;
  /** The plan as the screen carries it, `serialisePlan(plan)`. */
  serialisedPlan: string;
  locale: Locale;
  /** Whether the elective demand table exists to receive a submission (`isElectiveDemandLive`). */
  demandLive: boolean;
  /** What the findings in the emailed summary count besides the plan, such as published reviews. */
  findingSources?: FindingSources;
  /** The instant the screen is rendered at; a parameter so a test can fix it. */
  now?: Date;
};

/** An event's dates in words, e.g. "3 November 2026" or "3 to 7 November 2026". */
function eventDates(event: CalendarEvent, locale: Locale): string {
  const format = (iso: string, withYear: boolean, withMonth: boolean) => {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(Date.UTC(year!, month! - 1, day!)).toLocaleDateString(
      locale === "th" ? "th-TH" : "en-GB",
      {
        day: "numeric",
        ...(withMonth ? { month: "long" as const } : {}),
        ...(withYear ? { year: "numeric" as const } : {}),
        timeZone: "UTC",
      }
    );
  };
  if (!event.end || event.end === event.start) return format(event.start, true, true);
  const sameMonth = event.start.slice(0, 7) === event.end.slice(0, 7);
  const joiner = locale === "th" ? " ถึง " : " to ";
  return `${format(event.start, !sameMonth, !sameMonth)}${joiner}${format(event.end, true, true)}`;
}

export default function PlanOutreach({
  plan,
  serialisedPlan,
  locale,
  demandLive,
  findingSources,
  now = new Date(),
}: PlanOutreachProps) {
  const copy = buildPlanOutreachCopy(locale);
  const version = CURRICULUM_VERSIONS[plan.versionId];

  // Share with an advisor: the whole link is plain text, with the plan after
  // the "#" where no request can carry it.
  const viewPath = localeHref(locale, "/services/study-plan/view");
  const shareLink = `${SITE_URL}${viewPath}#${encodeShareFragment(plan, shareDateOf(now))}`;

  // Elective demand: only on a site that has somewhere to store it.
  const demand = buildDemandPayload(plan);
  const sendingTerm = currentTerm(now);
  const planHref = `${localeHref(locale, "/services/study-plan/plan")}?${PLAN_FIELD}=${encodeURIComponent(serialisedPlan)}`;

  // Ask the BIR office: the summary goes in the body of an email the student
  // sends from their own mail app, and is shown below to copy by hand for the
  // apps that ignore the body and for summaries too long to travel in a link.
  const summary = planSummaryText(plan, locale, copy.summary, undefined, findingSources);
  const askHref = mailtoHrefWithFallback(
    birOffice.email,
    copy.ask.subject,
    summary,
    copy.ask.pasteBody
  );

  // Registration dates: whatever the calendar holds, tagged for these terms.
  const plannedTerms = plannedAcademicTerms(plan);
  const registrationEvents = registrationEventsFor(calendarEvents, plannedTerms);
  const eventTerms = plannedTerms.filter((term) =>
    registrationEvents.some(
      (event) => event.academic && termKey(event.academic.term) === termKey(term)
    )
  );

  return (
    <section aria-labelledby="outreach-heading" className="flex flex-col gap-6">
      <div>
        <h2 id="outreach-heading" className="font-display text-xl">
          {copy.heading}
        </h2>
        <p className="mt-2 leading-relaxed text-muted">{copy.intro}</p>
      </div>

      <div
        id="share-with-advisor"
        className="flex flex-col gap-3 rounded-lg border border-line p-5"
      >
        <h3 className="font-display text-lg">{copy.share.heading}</h3>
        <p className="leading-relaxed text-muted">{copy.share.body}</p>
        <Field
          as="textarea"
          name="share-link"
          label={copy.share.linkLabel}
          value={shareLink}
          readOnly
          rows={4}
          spellCheck={false}
          className="[&_textarea]:font-mono [&_textarea]:text-xs [&_textarea]:break-all"
        />
        <CopyLinkButton
          link={shareLink}
          label={copy.share.copyButton}
          copiedLabel={copy.share.copied}
          failedLabel={copy.share.copyFailed}
        />
        <p>
          <Link
            href={`${viewPath}#${encodeShareFragment(plan, shareDateOf(now))}`}
            className="font-semibold text-brand-deep hover:underline"
          >
            {copy.share.openLink} &rarr;
          </Link>
        </p>
        <p className="text-sm text-muted">{copy.share.datedNote}</p>
        <p className="text-sm text-muted">{copy.share.noScriptNote}</p>
      </div>

      {demandLive ? (
        <div id="share-electives" className="flex flex-col gap-3 rounded-lg border border-line p-5">
          <h3 className="font-display text-lg">{copy.demand.heading}</h3>
          <p className="leading-relaxed text-muted">{copy.demand.intro}</p>
          <ElectiveDemandForm
            locale={locale}
            copy={copy.demand}
            action={submitElectiveDemand}
            permalink={`${planHref}#share-electives`}
            versionId={plan.versionId}
            versionLabel={version.label[locale]}
            entriesValue={encodeDemandEntries(demand.entries)}
            entries={demand.entries.map((entry) => ({
              code: entry.code,
              termLabel: academicTermLabel(entry.term, locale),
            }))}
            windowKey={termKey(sendingTerm)}
            windowLabel={academicTermLabel(sendingTerm, locale)}
            threshold={DEMAND_THRESHOLD}
          />
        </div>
      ) : null}

      <div id="ask-bir-office" className="flex flex-col gap-3 rounded-lg border border-line p-5">
        <h3 className="font-display text-lg">{copy.ask.heading}</h3>
        <p className="leading-relaxed text-muted">{copy.ask.body}</p>
        <p>
          {/* A plain anchor: a mailto link, not a page to prefetch. */}
          <a
            href={askHref}
            className="focus-halo inline-flex min-h-11 items-center justify-center rounded-lg border-[1.5px] border-ink px-5 py-2 text-center text-[0.95rem] font-semibold text-ink transition-colors duration-150 hover:bg-sunken"
          >
            {copy.ask.button}
          </a>
        </p>
        <Field
          as="textarea"
          name="plan-summary"
          label={copy.ask.summaryLabel}
          hint={copy.ask.summaryHint}
          value={summary}
          readOnly
          rows={10}
          spellCheck={false}
        />
        <p className="text-sm text-muted">{copy.ask.note}</p>
        <h4 className="font-display text-base">{copy.ask.otherWaysHeading}</h4>
        <BirOfficeContact locale={locale} />
      </div>

      <div
        id="registration-dates"
        className="flex flex-col gap-3 rounded-lg border border-line p-5"
      >
        <h3 className="font-display text-lg">{copy.calendar.heading}</h3>
        {registrationEvents.length > 0 ? (
          <>
            <p className="leading-relaxed text-muted">{copy.calendar.intro}</p>
            <ul className="flex flex-col gap-1 text-sm text-ink">
              {registrationEvents.map((event) => (
                <li key={event.id}>
                  {event.academic ? `${copy.calendar.windows[event.academic.window]}, ` : ""}
                  {event.academic ? `${academicTermLabel(event.academic.term, locale)}: ` : ""}
                  {eventDates(event, locale)}
                </li>
              ))}
            </ul>
            <p>
              {/* A plain anchor: this is a file download, not a page to prefetch. */}
              <a
                href={`${localeHref(locale, "/services/study-plan/plan/registration.ics")}?terms=${encodeTermsParam(eventTerms)}`}
                className="font-semibold text-brand-deep hover:underline"
              >
                {copy.calendar.download} &darr;
              </a>
            </p>
          </>
        ) : (
          <Notice variant="info" title={copy.calendar.emptyTitle}>
            <p>{copy.calendar.emptyBody}</p>
            <ul className="mt-2 flex flex-col gap-1">
              <li>
                <ExternalLink
                  href={birOffice.website}
                  newTabLabel={getDictionary(locale).a11y.newTab}
                  className="font-semibold text-brand-deep hover:underline"
                >
                  {copy.calendar.websiteLink}
                </ExternalLink>
              </li>
              <li>
                <Link
                  href={birOfficeContactHref(locale)}
                  className="font-semibold text-brand-deep hover:underline"
                >
                  {copy.calendar.contactLink} &rarr;
                </Link>
              </li>
              <li>
                <Link
                  href={localeHref(locale, "/news/academic-calendar-2569")}
                  className="font-semibold text-brand-deep hover:underline"
                >
                  {copy.calendar.calendarPostLink} &rarr;
                </Link>
              </li>
            </ul>
          </Notice>
        )}
      </div>
    </section>
  );
}
