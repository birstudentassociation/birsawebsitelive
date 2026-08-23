import { Heading } from "@/components/bds/Type";
import Table from "@/components/bds/Table";
import SummaryList from "@/components/bds/SummaryList";
import { formatDate, type Locale } from "@/lib/i18n";
import type { BudgetEntryDirection } from "@/sanity/schemaTypes/documents/budgetEntry";

/**
 * BIRSA's published budget entries, with the totals COMPUTED from the rows
 * rather than typed in by an officer (REDESIGN-2.0 §10,
 * `sanity/schemaTypes/documents/budgetEntry.ts`, this wave's brief: "a free
 * text amount field would be a filing cabinet, not transparency").
 *
 * `budgetEntry` has no field for who requested, approved or spent anything;
 * every entry this component renders carries only a description, an amount,
 * a direction, a date and an owning portfolio, exactly what the schema
 * allows and no more.
 */
export type BudgetEntryRow = {
  id: string;
  description: string;
  amount: number;
  direction: BudgetEntryDirection;
  entryDate: string;
  portfolioLabel: string;
};

export type BudgetTableCopy = {
  tableCaption: string;
  dateHeader: string;
  descriptionHeader: string;
  portfolioHeader: string;
  directionHeader: string;
  amountHeader: string;
  direction: Record<BudgetEntryDirection, string>;
  totalsHeading: string;
  totalIncomeLabel: string;
  totalExpenseLabel: string;
  netLabel: string;
};

export type BudgetTableProps = {
  entries: BudgetEntryRow[];
  copy: BudgetTableCopy;
  locale: Locale;
};

function formatAmount(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-GB").format(amount);
}

export default function BudgetTable({ entries, copy, locale }: BudgetTableProps) {
  const totalIncome = entries
    .filter((entry) => entry.direction === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpense = entries
    .filter((entry) => entry.direction === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const net = totalIncome - totalExpense;

  const sorted = entries.slice().sort((a, b) => a.entryDate.localeCompare(b.entryDate));

  return (
    <div className="flex flex-col gap-8">
      <Table
        caption={copy.tableCaption}
        columns={[
          { key: "entryDate", header: copy.dateHeader },
          { key: "description", header: copy.descriptionHeader },
          { key: "portfolio", header: copy.portfolioHeader },
          { key: "direction", header: copy.directionHeader },
          { key: "amount", header: copy.amountHeader, align: "right" },
        ]}
        rows={sorted.map((entry) => ({
          entryDate: formatDate(locale, entry.entryDate),
          description: entry.description,
          portfolio: entry.portfolioLabel,
          direction: copy.direction[entry.direction],
          amount: formatAmount(locale, entry.amount),
        }))}
        rowKey={(_, index) => sorted[index]?.id ?? String(index)}
      />

      {/* The totals below are derived from the rows above at render time
          (`reduce`), not a separately typed figure, so they can never
          disagree with the table. */}
      <section className="flex flex-col gap-3">
        <Heading level={2}>{copy.totalsHeading}</Heading>
        <SummaryList
          rows={[
            {
              id: "income",
              label: copy.totalIncomeLabel,
              value: formatAmount(locale, totalIncome),
            },
            {
              id: "expense",
              label: copy.totalExpenseLabel,
              value: formatAmount(locale, totalExpense),
            },
            { id: "net", label: copy.netLabel, value: formatAmount(locale, net) },
          ]}
        />
      </section>
    </div>
  );
}
