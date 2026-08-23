import { Heading, Text } from "@/components/bds/Type";
import Table from "@/components/bds/Table";
import PortableTextBody, { type PortableTextBlockLike } from "@/components/about/PortableTextBody";
import type { RedactionCategory } from "@/sanity/schemaTypes/documents/minutes";

/**
 * The public record of one committee meeting (REDESIGN-2.0 §10,
 * `sanity/schemaTypes/documents/minutes.ts`, DECISIONS-2.0.md's minutes
 * redaction model).
 *
 * `minutes.ts`'s own design is structural: there is exactly one field for
 * body content (`publicSummary`), and `redactedItems` can only ever hold an
 * item number and a closed category, never a description. This component
 * renders that shape honestly, which means two things it does NOT do:
 *
 *   - it never implies a fuller account of a withheld item exists anywhere
 *     a reader could ask for (no "contact us for the full minutes", no
 *     "request access" link: `redactedItems` has nowhere to record where
 *     such a thing would even live, because BIRSA's minutes schema was
 *     built precisely so there is no such record to point at);
 *   - it never guesses at what a withheld item concerned beyond its
 *     category, because the data itself cannot say more than that.
 */
export type MinutesSummaryCopy = {
  publicSummaryHeading: string;
  withheldHeading: string;
  withheldIntro: string;
  withheldItemLabel: string;
  withheldItemColumn: string;
  withheldCategoryColumn: string;
  categories: Record<RedactionCategory, string>;
};

export type RedactedItem = {
  itemNumber: number;
  category: RedactionCategory;
};

export type MinutesSummaryProps = {
  publicSummary: PortableTextBlockLike[];
  redactedItems: RedactedItem[];
  copy: MinutesSummaryCopy;
};

export default function MinutesSummary({ publicSummary, redactedItems, copy }: MinutesSummaryProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Heading level={2}>{copy.publicSummaryHeading}</Heading>
        <PortableTextBody value={publicSummary} headingBaseLevel={3} />
      </section>

      {redactedItems.length > 0 ? (
        <section className="flex flex-col gap-3">
          <Heading level={2}>{copy.withheldHeading}</Heading>
          <Text step="body-sm" className="text-muted">
            {copy.withheldIntro}
          </Text>
          <Table
            caption={copy.withheldHeading}
            captionHidden
            rowHeaders
            columns={[
              { key: "item", header: copy.withheldItemColumn },
              { key: "category", header: copy.withheldCategoryColumn },
            ]}
            rows={redactedItems
              .slice()
              .sort((a, b) => a.itemNumber - b.itemNumber)
              .map((item) => ({
                item: copy.withheldItemLabel.replace("{n}", String(item.itemNumber)),
                category: copy.categories[item.category],
              }))}
            rowKey={(row) => String(row.item)}
          />
        </section>
      ) : null}
    </div>
  );
}
