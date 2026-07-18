/**
 * Server component: renders the ordered list of stops for both shuttle
 * lines, in travel order. The Sanam Chai line is point-to-point (campus to
 * MRT and back); the Pinklao line is a loop that starts and ends at campus.
 * Used from `content/student-life/{en,th}/home/shuttle-bus.mdx` via the MDX
 * component map in `lib/mdx.tsx`.
 */
import type { Locale } from "@/lib/i18n";
import { shuttleLines } from "@/lib/shuttle";
import Tag from "@/components/Tag";

export type ShuttleRouteProps = {
  locale: Locale;
};

type Labels = {
  campus: string;
  kind: Record<"point-to-point" | "loop", string>;
};

const labels: Record<Locale, Labels> = {
  en: {
    campus: "Boarding point",
    kind: {
      "point-to-point": "Point-to-point: the bus runs straight there and back.",
      loop: "Loop: the bus circles through Pinklao and returns to campus.",
    },
  },
  th: {
    campus: "จุดขึ้นรถ",
    kind: {
      "point-to-point": "วิ่งตรงไปกลับ ไม่มีการวนรอบ",
      loop: "วิ่งวนเป็นลูป ผ่านฝั่งปิ่นเกล้าแล้ววนกลับมหาลัย",
    },
  },
};

export default function ShuttleRoute({ locale }: ShuttleRouteProps) {
  const t = labels[locale];
  const other: Locale = locale === "en" ? "th" : "en";

  return (
    <div className="flex flex-col gap-8">
      {shuttleLines.map((line) => (
        <section key={line.id} className="flex flex-col gap-3">
          <h3 className="font-display text-lg">{line.name[locale]}</h3>
          <p className="text-muted text-sm">{t.kind[line.kind]}</p>
          <ol className="border-line bg-surface flex flex-col gap-0 rounded-lg border">
            {line.stops.map((stop, index) => (
              <li
                key={`${stop.en}-${index}`}
                className="border-line flex items-start justify-between gap-3 border-b p-3 text-sm last:border-b-0"
              >
                <span>
                  <span className="text-muted mr-2 font-mono">{index + 1}.</span>
                  <span className="text-ink font-medium">{stop[locale]}</span>
                  <span className="text-muted"> ({stop[other]})</span>
                </span>
                {stop.isCampus ? <Tag variant="brand">{t.campus}</Tag> : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
