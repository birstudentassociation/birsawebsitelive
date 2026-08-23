import Link from "next/link";

import { Heading, Text } from "@/components/bds/Type";
import SummaryList, { type SummaryListRow } from "@/components/bds/SummaryList";
import PortableTextBody, { type PortableTextBlockLike } from "@/components/about/PortableTextBody";

/**
 * One committee decision (REDESIGN-2.0 §10,
 * `sanity/schemaTypes/documents/decision.ts`): what was decided, when, by
 * which portfolio or meeting, and what it changed. Never a personal account
 * of how the decision came about, matching the schema: there is no "decided
 * by" person on a decision document, only the owning portfolio.
 *
 * A KNOWN GAP IN THE FROZEN SCHEMA, reported rather than fixed here:
 * `decision.summary` is typed as a single Portable Text array
 * (`type: portableText.name`), not the `{ th, en }` bilingual wrapper every
 * other rich text field on the site carries (compare
 * `minutes.publicSummary`, which builds that wrapper itself). `whatChanged`
 * IS a proper `localizedText` and renders per locale correctly; `summary`
 * cannot, because the field it is reading has no locale to select. This
 * component renders whatever language the field actually holds rather than
 * pretending it can select one, and the gap belongs to
 * `sanity/schemaTypes/documents/decision.ts`, which this wave does not own.
 */
export type DecisionSummaryCopy = {
  dateLabel: string;
  portfolioLabel: string;
  meetingLabel: string;
  summaryHeading: string;
  whatChangedHeading: string;
};

export type DecisionSummaryProps = {
  decisionDateFormatted: string;
  portfolioLabel: string;
  meetingTitle?: string;
  meetingHref?: string;
  summary: PortableTextBlockLike[];
  whatChanged: string;
  copy: DecisionSummaryCopy;
};

export default function DecisionSummary({
  decisionDateFormatted,
  portfolioLabel,
  meetingTitle,
  meetingHref,
  summary,
  whatChanged,
  copy,
}: DecisionSummaryProps) {
  const metaRows: SummaryListRow[] = [
    { id: "date", label: copy.dateLabel, value: decisionDateFormatted },
    { id: "portfolio", label: copy.portfolioLabel, value: portfolioLabel },
  ];
  if (meetingTitle) {
    metaRows.push({
      id: "meeting",
      label: copy.meetingLabel,
      value: meetingHref ? (
        <Link href={meetingHref} className="font-semibold text-brand-deep underline">
          {meetingTitle}
        </Link>
      ) : (
        meetingTitle
      ),
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <SummaryList rows={metaRows} />

      <section className="flex flex-col gap-3">
        <Heading level={2}>{copy.summaryHeading}</Heading>
        <PortableTextBody value={summary} headingBaseLevel={3} />
      </section>

      <section className="flex flex-col gap-3">
        <Heading level={2}>{copy.whatChangedHeading}</Heading>
        <Text step="body">{whatChanged}</Text>
      </section>
    </div>
  );
}
