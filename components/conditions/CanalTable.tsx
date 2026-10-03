import clsx from "clsx";
import { fillTemplate, formatCell } from "@/lib/conditions/format";
import type { CanalPoint, CanalStation, CanalStatus } from "@/lib/conditions/sources/canals";
import type { Locale } from "@/lib/i18n";

type Labels = {
  scrollLabel: string;
  km: string;
  noData: string;
  columns: {
    station: string;
    inside: string;
    outside: string;
    warning: string;
    status: string;
    distance: string;
  };
  status: Record<CanalStatus, string>;
};

type Props = {
  locale: Locale;
  caption: string;
  stations: CanalStation[];
  showDistance?: boolean;
  t: Labels;
};

const statusClass: Record<CanalStatus, string> = {
  critical: "text-error",
  warning: "text-warning",
  normal: "text-success",
  low: "text-ink",
  noData: "text-muted",
};

const cellClass = "px-3 py-2 text-right tabular-nums";

function Level({ point, t }: { point: CanalPoint | null; t: Labels }) {
  if (!point) return <>{t.noData}</>;
  const flagged = point.status === "critical" || point.status === "warning";
  return (
    <span className={clsx(flagged && clsx("font-semibold", statusClass[point.status]))}>
      {formatCell(point.level, 2, t.noData)}
      {flagged ? <span className="sr-only"> ({t.status[point.status]})</span> : null}
    </span>
  );
}

export default function CanalTable({ locale, caption, stations, showDistance, t }: Props) {
  return (
    <div
      role="region"
      aria-label={fillTemplate(t.scrollLabel, { table: caption })}
      tabIndex={0}
      className="relative max-w-full overflow-x-auto rounded-md border border-line bg-surface"
    >
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-sunken">
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              {t.columns.station}
            </th>
            <th scope="col" className={`${cellClass} font-semibold`}>
              {t.columns.inside}
            </th>
            <th scope="col" className={`${cellClass} font-semibold`}>
              {t.columns.outside}
            </th>
            <th scope="col" className={`${cellClass} font-semibold`}>
              {t.columns.warning}
            </th>
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              {t.columns.status}
            </th>
            {showDistance ? (
              <th scope="col" className={`${cellClass} font-semibold`}>
                {t.columns.distance}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {stations.map((station) => (
            <tr key={station.id}>
              <th scope="row" className="px-3 py-2 text-left font-medium">
                {station.name[locale]}
              </th>
              <td className={cellClass}>
                <Level point={station.inside} t={t} />
              </td>
              <td className={cellClass}>
                <Level point={station.outside} t={t} />
              </td>
              <td className={cellClass}>
                {formatCell(station.inside?.warning ?? null, 2, t.noData)}
              </td>
              <td className={clsx("px-3 py-2 font-semibold", statusClass[station.status])}>
                {t.status[station.status]}
              </td>
              {showDistance ? (
                <td className={cellClass}>
                  {station.distanceKm.toFixed(1)} {t.km}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
