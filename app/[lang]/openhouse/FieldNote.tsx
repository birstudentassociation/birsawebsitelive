import type { Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/i18n";
import { COPY, OPEN_HOUSE, t } from "@/content/openhouse/copy";

export const FIELDNOTE_SVG_ID = "oh-fieldnote-svg";

export type FieldNoteEntry = { time: string; label: string; value: string };

/**
 * The souvenir. Self-contained SVG (fixed paper palette, generic font families)
 * so it rasterises reliably to PNG on save and reads as a printed card rather
 * than a screen UI. The fixed light palette is deliberate: the artefact is
 * paper, independent of the site theme. A partial day is still a whole card.
 */
export default function FieldNote({
  locale,
  name,
  entries,
}: {
  locale: Locale;
  name: string;
  entries: FieldNoteEntry[];
}) {
  const paper = "#fbf7ef";
  const ink = "#211c19";
  const muted = "#5b524a";
  const brand = "#d81f26";
  const line = "#d9cbb2";
  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";
  const dateLabel = formatDate(locale, OPEN_HOUSE.dateISO);
  const trimmedName = name.trim();
  const rowTop = 300;
  const rowGap = 66;

  return (
    <svg
      id={FIELDNOTE_SVG_ID}
      viewBox="0 0 480 640"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={buildAlt(locale, trimmedName, entries)}
    >
      <rect width="480" height="640" fill={paper} />
      <rect x="20" y="20" width="440" height="600" fill="none" stroke={line} strokeWidth="1" />

      <text x="44" y="70" fontFamily={sans} fontSize="13" letterSpacing="3" fill={brand}>
        BIR · THA PRACHAN
      </text>
      <text x="44" y="92" fontFamily={sans} fontSize="12" letterSpacing="2" fill={muted}>
        OPEN HOUSE 2026
      </text>

      <text x="44" y="168" fontFamily={serif} fontSize="32" fill={ink}>
        {t(COPY.daySubtitle, locale)}
      </text>
      <text x="44" y="194" fontFamily={sans} fontSize="13" fill={muted}>
        {dateLabel}
      </text>

      <path
        d="M44 236 C 110 236, 140 214, 196 218 S 300 262, 360 248 S 430 224, 436 232"
        fill="none"
        stroke={brand}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {entries.length === 0 ? (
        <text x="44" y="330" fontFamily={sans} fontSize="14" fill={muted}>
          {t(COPY.dayEmpty, locale)}
        </text>
      ) : (
        entries.map((e, i) => {
          const y = rowTop + i * rowGap;
          return (
            <g key={i}>
              <text x="44" y={y} fontFamily={sans} fontSize="12" letterSpacing="1" fill={muted}>
                {e.time} · {e.label.toUpperCase()}
              </text>
              <text x="44" y={y + 26} fontFamily={serif} fontSize="19" fill={ink}>
                {e.value}
              </text>
            </g>
          );
        })
      )}

      <line x1="44" y1="566" x2="436" y2="566" stroke={line} strokeWidth="1" />
      <text x="44" y="596" fontFamily={sans} fontSize="12" letterSpacing="2" fill={muted}>
        THA PRACHAN · BANGKOK
      </text>
      {trimmedName ? (
        <text x="44" y="596" textAnchor="start" fontFamily={serif} fontSize="16" fill={ink} dy="22">
          {trimmedName}
        </text>
      ) : null}
      <text
        x="436"
        y="596"
        textAnchor="end"
        fontFamily={sans}
        fontSize="13"
        letterSpacing="2"
        fill={brand}
      >
        BIRSA
      </text>
    </svg>
  );
}

function buildAlt(locale: Locale, name: string, entries: FieldNoteEntry[]): string {
  const who = name ? `${name}. ` : "";
  const lead =
    locale === "th"
      ? `${who}การ์ดวัน Open House ของ BIR ท่าพระจันทร์ 31 ตุลาคม 2026`
      : `${who}BIR Tha Prachan Open House day card, 31 October 2026`;
  if (entries.length === 0) return lead;
  const body = entries.map((e) => `${e.time} ${e.label} ${e.value}`).join("; ");
  return `${lead}. ${body}`;
}
