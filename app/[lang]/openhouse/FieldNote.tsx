import type { Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/i18n";
import { COPY, OPEN_HOUSE, t } from "@/content/openhouse/copy";
import type { CuratedCourse } from "@/lib/openhouse";

export const FIELDNOTE_SVG_ID = "oh-fieldnote-svg";

/**
 * The souvenir. Rendered as self-contained SVG (fixed paper palette, generic
 * font families) so it rasterises reliably to PNG on save and reads as a
 * printed card rather than a screen UI. Fixed light palette is deliberate: the
 * artefact is paper, independent of the site theme. A partial day is still a
 * whole card — nothing is punished for being skipped.
 */
export default function FieldNote({
  locale,
  name,
  course,
}: {
  locale: Locale;
  name: string;
  course: CuratedCourse | null;
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

  return (
    <svg
      id={FIELDNOTE_SVG_ID}
      viewBox="0 0 480 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={buildAlt(locale, trimmedName, course)}
    >
      <rect width="480" height="600" fill={paper} />
      <rect x="20" y="20" width="440" height="560" fill="none" stroke={line} strokeWidth="1" />

      <text x="44" y="70" fontFamily={sans} fontSize="13" letterSpacing="3" fill={brand}>
        BIR · THA PRACHAN
      </text>
      <text x="44" y="92" fontFamily={sans} fontSize="12" letterSpacing="2" fill={muted}>
        OPEN HOUSE 2026
      </text>

      <text x="44" y="168" fontFamily={serif} fontSize="34" fill={ink}>
        {t(COPY.daySubtitle, locale)}
      </text>
      <text x="44" y="196" fontFamily={sans} fontSize="13" fill={muted}>
        {dateLabel}
      </text>

      {/* small river form */}
      <path
        d="M44 250 C 110 250, 140 226, 196 230 S 300 276, 360 262 S 430 236, 436 244"
        fill="none"
        stroke={brand}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {course ? (
        <>
          <text x="44" y="336" fontFamily={sans} fontSize="12" letterSpacing="1" fill={muted}>
            09:15 · {t(COPY.cardChoiceCourse, locale).toUpperCase()}
          </text>
          <text x="44" y="366" fontFamily={serif} fontSize="22" fill={ink}>
            {course.code} {t(course.title, locale)}
          </text>
          <text x="44" y="390" fontFamily={sans} fontSize="13" fill={muted}>
            {t(course.field, locale)}
          </text>
        </>
      ) : (
        <text x="44" y="356" fontFamily={sans} fontSize="14" fill={muted}>
          {t(COPY.dayEmpty, locale)}
        </text>
      )}

      <line x1="44" y1="496" x2="436" y2="496" stroke={line} strokeWidth="1" />
      <text x="44" y="530" fontFamily={sans} fontSize="12" letterSpacing="2" fill={muted}>
        THA PRACHAN · BANGKOK
      </text>
      {trimmedName ? (
        <text x="44" y="554" fontFamily={serif} fontSize="16" fill={ink}>
          {trimmedName}
        </text>
      ) : null}
      <text
        x="436"
        y="554"
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

function buildAlt(locale: Locale, name: string, course: CuratedCourse | null): string {
  const who = name ? `${name}. ` : "";
  if (locale === "th") {
    return `${who}การ์ดวัน Open House ของ BIR ท่าพระจันทร์ 31 ตุลาคม 2026${
      course ? ` เข้าเรียนวิชา ${course.code} ${course.title.th}` : ""
    }`;
  }
  return `${who}BIR Tha Prachan Open House day card, 31 October 2026${
    course ? `. Sat in on ${course.code} ${course.title.en}` : ""
  }`;
}
