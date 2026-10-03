import { formatBangkokClock, formatCell, type HourRow } from "@/lib/conditions/format";

type Labels = {
  nextHoursCaption: string;
  nextHoursScrollLabel: string;
  nextHoursNone: string;
  noData: string;
  columns: { hour: string; rain: string; chance: string; tide: string; heat: string };
};

type Props = {
  rows: HourRow[];
  t: Labels;
};

const cellClass = "px-3 py-2 text-right tabular-nums";

export default function NextHours({ rows, t }: Props) {
  if (rows.length === 0) return <p className="text-muted">{t.nextHoursNone}</p>;

  return (
    <div
      role="region"
      aria-label={t.nextHoursScrollLabel}
      tabIndex={0}
      className="max-w-full overflow-x-auto rounded-md border border-line bg-surface"
    >
      <table className="w-full min-w-[30rem] border-collapse text-sm">
        <caption className="px-3 py-2 text-left text-muted">{t.nextHoursCaption}</caption>
        <thead>
          <tr className="border-y border-line bg-sunken">
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              {t.columns.hour}
            </th>
            <th scope="col" className={`${cellClass} font-semibold`}>
              {t.columns.rain}
            </th>
            <th scope="col" className={`${cellClass} font-semibold`}>
              {t.columns.chance}
            </th>
            <th scope="col" className={`${cellClass} font-semibold`}>
              {t.columns.tide}
            </th>
            <th scope="col" className={`${cellClass} font-semibold`}>
              {t.columns.heat}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.at}>
              <th scope="row" className="px-3 py-2 text-left font-medium">
                <time dateTime={row.at}>{formatBangkokClock(row.at)}</time>
              </th>
              <td className={cellClass}>{formatCell(row.rain, 1, t.noData)}</td>
              <td className={cellClass}>{formatCell(row.chance, 0, t.noData)}</td>
              <td className={cellClass}>{formatCell(row.tide, 2, t.noData)}</td>
              <td className={cellClass}>{formatCell(row.heat, 0, t.noData)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
