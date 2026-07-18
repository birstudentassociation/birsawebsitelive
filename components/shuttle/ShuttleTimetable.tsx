/**
 * Server component: renders the full hour-by-hour timetable for both
 * shuttle lines as accessible tables. Wraps each table in its own
 * `overflow-x-auto` region (unlike MDX prose tables, these aren't routed
 * through the `table` wrapper in `lib/mdx.tsx`, since they're rendered
 * directly by this component). Footnotes the Pinklao dormitory-service
 * departures and each line's last bus of the day.
 */
import type { Locale } from "@/lib/i18n";
import { shuttleLines, getDormitoryMarker, getDepartureTimes } from "@/lib/shuttle";

export type ShuttleTimetableProps = {
  locale: Locale;
};

type Labels = {
  hour: string;
  departures: string;
  lastBus: string;
};

const labels: Record<Locale, Labels> = {
  en: {
    hour: "Hour",
    departures: "Departures (minutes past the hour)",
    lastBus: "last bus of the day",
  },
  th: {
    hour: "ชั่วโมง",
    departures: "เวลาออกรถ (นาทีในชั่วโมงนั้น)",
    lastBus: "รถคันสุดท้ายของวัน",
  },
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export default function ShuttleTimetable({ locale }: ShuttleTimetableProps) {
  const t = labels[locale];

  return (
    <div className="flex flex-col gap-10">
      {shuttleLines.map((line) => {
        const hours = Object.keys(line.schedule)
          .map(Number)
          .sort((a, b) => a - b);
        const times = getDepartureTimes(line.id);
        const lastBusTime = times[times.length - 1];

        return (
          <div key={line.id} className="flex flex-col gap-3">
            <h3 className="font-display text-lg">{line.name[locale]}</h3>
            <div className="overflow-x-auto">
              <table className="border-line w-full border-collapse text-sm">
                <thead>
                  <tr className="border-line border-b text-left">
                    <th scope="col" className="p-2 font-semibold">
                      {t.hour}
                    </th>
                    <th scope="col" className="p-2 font-semibold">
                      {t.departures}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hours.map((hour) => {
                    const minutes = line.schedule[hour] ?? [];
                    return (
                      <tr key={hour} className="border-line border-b">
                        <td className="p-2 align-top font-mono">{pad2(hour)}:00</td>
                        <td className="p-2 align-top">
                          {minutes.map((minute, i) => {
                            const time = `${pad2(hour)}:${pad2(minute)}`;
                            const marker = getDormitoryMarker(line.id, time);
                            const isLastBus = time === lastBusTime;
                            return (
                              <span key={time} className="mr-2 inline-block whitespace-nowrap">
                                {time}
                                {marker ? (
                                  <sup className="text-brand-deep font-semibold">*</sup>
                                ) : null}
                                {isLastBus ? (
                                  <sup className="text-muted font-semibold">&dagger;</sup>
                                ) : null}
                                {i < minutes.length - 1 ? "," : ""}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {line.dormitoryMarkers?.length ? (
              <ul className="text-muted flex flex-col gap-1 text-xs">
                {line.dormitoryMarkers.map((marker) => (
                  <li key={marker.time}>
                    <sup className="text-brand-deep font-semibold">*</sup> {marker.time}:{" "}
                    {marker.label[locale]}
                  </li>
                ))}
                <li>
                  <sup className="text-muted font-semibold">&dagger;</sup> {lastBusTime}:{" "}
                  {t.lastBus}
                </li>
              </ul>
            ) : (
              <ul className="text-muted flex flex-col gap-1 text-xs">
                <li>
                  <sup className="text-muted font-semibold">&dagger;</sup> {lastBusTime}:{" "}
                  {t.lastBus}
                </li>
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
