import { useId } from "react";
import clsx from "clsx";

import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `Table` (REDESIGN-2.0 §4.3, content cluster).
 *
 * Tabular data only, moved out of `.prose` (`app/globals.css`) and formalised
 * as a real component with a real `<th scope>`, rather than markdown-table
 * markup styled by a class name it happens to sit inside.
 *
 * MUST BEHAVE AT 320PX: a table wider than the viewport scrolls INSIDE its
 * own container; the page itself never gains a horizontal scrollbar. The
 * outer `<div>` is `overflow-x-auto` and the `<table>` inside it is
 * `min-w-max`, so the table keeps its natural width and only the wrapper
 * clips and scrolls.
 *
 * A scrollable region has to be reachable without a mouse (BUILD-BRIEF-2.0
 * §7), so the wrapper carries `tabIndex={0}` and an accessible name: it is
 * `role="region"`, `aria-labelledby` the table's own `<caption>`, so a
 * keyboard or screen reader user can `Tab` to the region and immediately
 * hears what it is a region OF, without this component inventing a second
 * label that could drift from the caption text.
 *
 * DATA-DRIVEN, NOT `children`. Accepting `columns` and `rows` rather than a
 * `<thead>`/`<tbody>` children API is what makes `scope="col"` (and the
 * optional `scope="row"` below) unconditional rather than something every
 * caller has to remember to add by hand; a table built from data can only
 * ever come out with real header semantics.
 *
 * `rowHeaders` renders the first cell of every row as `<th scope="row">`
 * rather than `<td>`, for a table where the row is identified by its first
 * column (the GDS "first cell is a header" table option), such as a table
 * of committee portfolios where the portfolio name heads its own row.
 * Leave it off for a table with no natural row identity, such as a plain
 * numeric grid.
 */
export type TableColumn = {
  key: string;
  header: React.ReactNode;
  align?: "left" | "right";
};

export type TableProps = {
  /** Introduces the table's content and doubles as the scroll region's accessible name. */
  caption: React.ReactNode;
  /**
   * Hide the caption visually while keeping it as the accessible name. Use
   * only when the page's own heading immediately above the table already
   * says the same thing, so a visible caption would repeat it.
   */
  captionHidden?: boolean;
  columns: readonly TableColumn[];
  rows: ReadonlyArray<Record<string, React.ReactNode>>;
  /** Stable key for each row. Defaults to the row's index, which is fine for static content but not for a reorderable or filterable list. */
  rowKey?: (row: Record<string, React.ReactNode>, index: number) => string;
  /** Render the first cell of each row as a row header. See this component's TSDoc. */
  rowHeaders?: boolean;
  className?: string;
};

export default function Table({
  caption,
  captionHidden,
  columns,
  rows,
  rowKey,
  rowHeaders,
  className,
}: TableProps) {
  const captionId = useId();

  return (
    <div
      role="region"
      tabIndex={0}
      aria-labelledby={captionId}
      className={clsx("focus-halo overflow-x-auto rounded-lg border border-line", className)}
    >
      <table className="w-full min-w-max border-collapse">
        <caption
          id={captionId}
          className={clsx(
            "border-b border-line bg-sunken px-4 py-3 text-left",
            captionHidden && "sr-only"
          )}
        >
          <Text as="span" step="body-sm" className="font-semibold text-ink">
            {caption}
          </Text>
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={clsx(
                  "border-b border-line px-4 py-3",
                  column.align === "right" ? "text-right" : "text-left"
                )}
              >
                <Text as="span" step="body-sm" className="font-semibold text-ink">
                  {column.header}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey ? rowKey(row, index) : index}
              className="border-b border-line last:border-0"
            >
              {columns.map((column, columnIndex) => {
                const cellClassName = clsx(
                  "px-4 py-3",
                  column.align === "right" ? "text-right" : "text-left"
                );
                if (rowHeaders && columnIndex === 0) {
                  return (
                    <th key={column.key} scope="row" className={cellClassName}>
                      <Text as="span" step="body-sm" className="font-semibold text-ink">
                        {row[column.key]}
                      </Text>
                    </th>
                  );
                }
                return (
                  <td key={column.key} className={cellClassName}>
                    <Text as="span" step="body-sm" className="text-ink">
                      {row[column.key]}
                    </Text>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
