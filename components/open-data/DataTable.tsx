import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { cellText, columnTotal, moneyDecimals, type Column, type Dataset } from "@/lib/open-data";
import ScrollRegion from "@/components/ScrollRegion";

const labels: Record<Locale, { total: string; scroll: string }> = {
  en: { total: "Total", scroll: "scrollable" },
  th: { total: "รวม", scroll: "เลื่อนดูได้" },
};

function isNumeric(column: Column): boolean {
  return column.kind === "money" || column.kind === "number" || column.kind === "percent";
}

/**
 * A dataset as an accessible table, after the GOV.UK and ONS table patterns:
 * a visible caption, column headers with scope, numbers right-aligned in
 * tabular figures, and a totals row for columns marked `total`. Wide tables
 * scroll inside a focusable region so keyboard users can reach the overflow.
 */
export default function DataTable({
  dataset,
  locale,
  figureLabel,
}: {
  dataset: Dataset;
  locale: Locale;
  /** e.g. "Table 1" */
  figureLabel: string;
}) {
  const t = labels[locale];
  const decimals: Record<string, number> = {};
  for (const column of dataset.columns) {
    if (column.kind === "money") {
      decimals[column.key] = moneyDecimals(
        dataset.rows.map((r) => r[column.key]).filter((v): v is number => typeof v === "number")
      );
    }
  }
  const hasTotals = dataset.columns.some((c) => c.total);
  const caption = `${figureLabel}, ${dataset.title[locale]}`;

  return (
    <ScrollRegion
      role="region"
      aria-label={`${caption}, ${t.scroll}`}
      tabIndex={0}
      className="max-w-full rounded-md border border-line bg-surface"
      scrollClassName="focus-visible:outline-3 focus-visible:outline-offset-2"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="px-3 pt-3 pb-2 text-left text-base font-semibold">{caption}</caption>
        <thead>
          <tr className="border-y border-line bg-sunken">
            {dataset.columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={clsx(
                  "px-3 py-2 align-bottom font-semibold",
                  isNumeric(column) ? "text-right" : "text-left"
                )}
              >
                {column.label[locale]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataset.rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-b-0">
              {dataset.columns.map((column, j) => {
                const text = cellText(locale, column, row[column.key], decimals[column.key]);
                const Cell = j === 0 ? "th" : "td";
                return (
                  <Cell
                    key={column.key}
                    scope={j === 0 ? "row" : undefined}
                    className={clsx(
                      "px-3 py-2 align-top",
                      j === 0 && "font-normal",
                      isNumeric(column) ? "text-right whitespace-nowrap tabular-nums" : "text-left",
                      column.kind === "date" && "whitespace-nowrap"
                    )}
                  >
                    {text}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
        {hasTotals ? (
          <tfoot>
            <tr className="border-t-2 border-line-strong bg-sunken font-semibold">
              {dataset.columns.map((column, j) => {
                if (j === 0) {
                  return (
                    <th key={column.key} scope="row" className="px-3 py-2 text-left">
                      {t.total}
                    </th>
                  );
                }
                return (
                  <td
                    key={column.key}
                    className={clsx(
                      "px-3 py-2",
                      isNumeric(column) && "text-right whitespace-nowrap tabular-nums"
                    )}
                  >
                    {column.total
                      ? cellText(
                          locale,
                          column,
                          columnTotal(dataset, column.key),
                          decimals[column.key]
                        )
                      : ""}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </ScrollRegion>
  );
}
