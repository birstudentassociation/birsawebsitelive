"use client";

/**
 * The read-only view of a plan that arrives in the URL fragment, for an advisor
 * who has been sent a link (`/services/study-plan/view#p=...`).
 *
 * The fragment is read here, in the browser, and goes nowhere: it is not in
 * the request, so the server rendered the same page for every visitor and
 * BIRSA never receives the plan. Until the page has hydrated this renders
 * nothing (the server snapshot has no fragment), so there is no markup for the
 * server and the client to disagree about, and a reader with JavaScript off
 * gets the `<noscript>` explanation on the page instead. The fragment is
 * untrusted: it is shown only if `decodeShareFragment` accepts it as a whole,
 * valid plan.
 *
 * Clearly marked read only and dated: the notice says when the plan was made
 * (from the link) and when it was opened (today), because a plan on a screen
 * can look current when it is not.
 */
import { useSyncExternalStore } from "react";
import Link from "next/link";
import Notice from "@/components/Notice";
import PlanDocument from "@/components/study-plan/PlanDocument";
import type { PlanOutreachCopy } from "@/components/study-plan/planOutreachCopy";
import type { StudyPlanCopy } from "@/components/study-plan/studyPlanCopy";
import type { Locale } from "@/lib/i18n";
import { decodeShareFragment, formatShareDate } from "@/lib/study-plan/shareFragment";
import { generatedOnForPrint } from "@/lib/study-plan/print";

export type SharedPlanViewProps = {
  locale: Locale;
  copy: StudyPlanCopy;
  view: PlanOutreachCopy["view"];
  /** The study plan service's start page, for a reader who wants a plan of their own. */
  startHref: string;
};

function subscribe(onChange: () => void): () => void {
  // The reader may paste a different link into the same tab.
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getSnapshot(): string | null {
  return window.location.hash;
}

function getServerSnapshot(): string | null {
  return null;
}

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

export default function SharedPlanView({ locale, copy, view, startHref }: SharedPlanViewProps) {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (hash === null) return null;

  const startLink = (
    <p>
      <Link href={startHref} className="font-semibold text-brand-deep hover:underline">
        {view.startLink} &rarr;
      </Link>
    </p>
  );

  if (hash === "" || hash === "#") {
    return (
      <div className="flex flex-col gap-4">
        <Notice variant="warning" title={view.emptyTitle}>
          {view.emptyBody}
        </Notice>
        {startLink}
      </div>
    );
  }

  const shared = decodeShareFragment(hash);
  if (!shared) {
    return (
      <div className="flex flex-col gap-4">
        <Notice variant="warning" title={view.invalidTitle}>
          {view.invalidBody}
        </Notice>
        {startLink}
      </div>
    );
  }

  const sharedOn = shared.sharedOn ? formatShareDate(shared.sharedOn, locale) : null;
  const openedOn = generatedOnForPrint(locale);

  return (
    <div className="flex flex-col gap-8">
      <Notice variant="info" title={view.readOnlyTitle}>
        <p>{sharedOn ? fill(view.readOnlyDated, { date: sharedOn }) : view.readOnlyUndated}</p>
        <p className="mt-1">{fill(view.openedOn, { date: openedOn })}</p>
      </Notice>
      <div className="flex flex-col gap-6">
        <h2 className="font-display text-2xl">{copy.print.title}</h2>
        <PlanDocument
          plan={shared.plan}
          locale={locale}
          copy={copy}
          extraFacts={sharedOn ? [{ label: view.sharedOnLabel, value: sharedOn }] : []}
        />
      </div>
      {startLink}
    </div>
  );
}
