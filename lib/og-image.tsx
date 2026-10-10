import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import type { HeroTone } from "@/content/emergency/types";
import { getDictionary, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { blockHeight, fitText, lineText, TextBlock, textWidth, type Fitted } from "@/lib/og-text";

export const OG_SIZE = { width: 1200, height: 630 };

const BRAND = "#d81f26";
const CREAM = "#fbf7ef";
const SUNKEN = "#f3ead9";
const LINE = "#e6dccb";
const INK = "#211c19";
const MUTED = "#5b524a";
const FOREST = "#2f5e4e";
const WHITE = "#ffffff";

const PAD_X = 80;
const ASIDE_WIDTH = 236;
const ASIDE_GAP = 56;

/**
 * Runs on the default Node.js runtime (not edge) so it can read the bundled
 * logo from disk. All text is shaped with HarfBuzz in `og-text` and drawn as
 * vector images, because Satori cannot position Thai tone marks and vowels.
 */
function logoSrc() {
  const logo = fs.readFileSync(path.join(process.cwd(), "public", "birsa-logo.png"));
  return `data:image/png;base64,${logo.toString("base64")}`;
}

function photoSrc(file: string) {
  const photo = fs.readFileSync(path.join(process.cwd(), "public", file));
  return `data:image/jpeg;base64,${photo.toString("base64")}`;
}

/** The public host, shown on cards so a cropped or re-shared image still says where it is from. */
function siteHost(): string | null {
  const { host, hostname } = new URL(SITE_URL);
  return hostname === "localhost" ? null : host.replace(/^www\./, "");
}

function leadingFor(text: Fitted, latin: number, thai: number) {
  return text.ascent > 1 ? thai : latin;
}

export type CardAside =
  | { kind: "date"; month: string; day: string; weekday: string }
  | { kind: "code"; code: string; note: string };

export type CardOptions = {
  locale: Locale;
  /** The section, shown above the title. */
  eyebrow: string;
  title: string;
  summary?: string;
  /** Short facts shown as chips under the title, such as a date or a place. */
  meta?: string[];
  /** A highlighted status, such as a club being open to join or an event having ended. */
  badge?: { text: string; tone: "forest" | "ink" };
  aside?: CardAside;
};

async function asideBlock(aside: CardAside): Promise<ReactNode> {
  if (aside.kind === "date") {
    const [month, day, weekday] = await Promise.all([
      lineText(aside.month, "strong", WHITE, 32),
      lineText(aside.day, "display", WHITE, 132),
      lineText(aside.weekday, "text", WHITE, 26),
    ]);
    return (
      <div
        style={{
          width: ASIDE_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: BRAND,
          borderRadius: 28,
          padding: "20px 0 26px",
        }}
      >
        <TextBlock text={month} />
        <TextBlock text={day} leading={1.02} />
        <TextBlock text={weekday} />
      </div>
    );
  }
  const [code, note] = await Promise.all([
    fitText(aside.code, {
      style: "display",
      color: WHITE,
      sizes: [64, 56, 48],
      maxWidth: ASIDE_WIDTH - 40,
      maxLines: 1,
    }),
    lineText(aside.note, "text", WHITE, 26),
  ]);
  return (
    <div
      style={{
        width: ASIDE_WIDTH,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        backgroundColor: BRAND,
        borderRadius: 28,
        padding: "36px 0 34px",
      }}
    >
      <TextBlock text={code} />
      <TextBlock text={note} />
    </div>
  );
}

async function footer(locale: Locale, color = INK, muted = MUTED, rule = LINE) {
  const host = siteHost();
  const [name, domain] = await Promise.all([
    lineText(getDictionary(locale).site.fullName, "strong", color, 28),
    host ? lineText(host, "text", muted, 26) : Promise.resolve(null),
  ]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `2px solid ${rule}`,
        paddingTop: 26,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", backgroundColor: WHITE, borderRadius: 14, padding: 4 }}>
          <img src={logoSrc()} width={60} height={60} alt="" />
        </div>
        <TextBlock text={name} />
      </div>
      {domain ? <TextBlock text={domain} /> : null}
    </div>
  );
}

const TITLE_LEADING = { latin: 1.08, thai: 1.22 };
const SUMMARY_LEADING = { latin: 1.3, thai: 1.4 };
const STACK_GAP = 18;
const CHIP_PAD_X = 22;
const CHIP_PAD_Y = 6;
const CHIP_GAP = 12;
/** Height left for the title, summary and chips between the eyebrow and the footer. */
const MIDDLE_HEIGHT = 360;

function chipRows(widths: number[], maxWidth: number) {
  let rows = 0;
  let used = Infinity;
  for (const width of widths) {
    if (used + CHIP_GAP + width > maxWidth) {
      rows += 1;
      used = width;
    } else {
      used += CHIP_GAP + width;
    }
  }
  return rows;
}

const hasEllipsis = (text: Fitted) =>
  text.lines.some((line) => line.some((piece) => piece.kind === "word" && piece.ellipsis));

const THAI_MONTH =
  /(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)$/;

/** Thai text split at its spaces, except the spaces inside dates, times and numbers. */
function thaiClauses(text: string): string[] {
  const clauses: string[] = [];
  for (const unit of text.split(/\s+/)) {
    const prev = clauses.at(-1);
    if (prev !== undefined && (/\d$/.test(prev) || /^\d/.test(unit) || THAI_MONTH.test(prev))) {
      clauses[clauses.length - 1] = `${prev} ${unit}`;
    } else {
      clauses.push(unit);
    }
  }
  return clauses;
}

/**
 * As much of the summary as fits in two lines without cutting a sentence:
 * whole sentences in English, clauses between spaces in Thai. Nothing when
 * not even the first one fits.
 */
async function fitSummary(summary: string, width: number, room: number) {
  const units = /[\u0E00-\u0E7F]/.test(summary)
    ? thaiClauses(summary)
    : summary.split(/(?<=[.!?])\s+/);
  let best: Fitted | null = null;
  for (let n = 1; n <= units.length; n++) {
    const text = await fitText(units.slice(0, n).join(" "), {
      style: "text",
      color: MUTED,
      sizes: [30],
      maxWidth: width,
      maxLines: 2,
    });
    const leading = leadingFor(text, SUMMARY_LEADING.latin, SUMMARY_LEADING.thai);
    if (hasEllipsis(text) || blockHeight(text, leading) > room) break;
    best = text;
  }
  return best;
}

function Chip({ text, background }: { text: Fitted; background: string }) {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: background,
        borderRadius: 999,
        padding: `${CHIP_PAD_Y}px ${CHIP_PAD_X}px`,
      }}
    >
      <TextBlock text={text} />
    </div>
  );
}

/**
 * The card for a page: section, title, an optional summary and facts, and an
 * optional tile on the right for a date or a course code. Titles are set in
 * the site's display faces at the largest size that fits three lines, and the
 * summary takes whatever height the title and facts leave.
 */
export async function renderCard({
  locale,
  eyebrow,
  title,
  summary,
  meta = [],
  badge,
  aside,
}: CardOptions) {
  const width = OG_SIZE.width - PAD_X * 2 - (aside ? ASIDE_WIDTH + ASIDE_GAP : 0);
  const chipText = (text: string, color: string) =>
    fitText(text, {
      style: badge && text === badge.text ? "strong" : "text",
      color,
      sizes: [26],
      maxWidth: width - CHIP_PAD_X * 2,
      maxLines: 1,
    });
  const [eyebrowText, badgeText, factTexts, asideNode, foot] = await Promise.all([
    lineText(eyebrow, "strong", BRAND, 28),
    badge ? chipText(badge.text, WHITE) : Promise.resolve(null),
    Promise.all(meta.map((fact) => chipText(fact, INK))),
    aside ? asideBlock(aside) : Promise.resolve(null),
    footer(locale),
  ]);

  const chips = [...(badgeText ? [badgeText] : []), ...factTexts];
  const chipHeight = Math.max(0, ...chips.map((chip) => blockHeight(chip))) + CHIP_PAD_Y * 2;
  const rows = chipRows(
    chips.map((chip) => textWidth(chip) + CHIP_PAD_X * 2),
    width
  );
  const chipsBlock = rows ? rows * chipHeight + (rows - 1) * CHIP_GAP + STACK_GAP : 0;

  const titleRoom = MIDDLE_HEIGHT - chipsBlock;
  const shapedTitle = await Promise.all(
    [96, 84, 76, 68, 60, 54, 48].map((size) =>
      fitText(title, { style: "display", color: INK, sizes: [size], maxWidth: width, maxLines: 3 })
    )
  );
  const titleLeading = (text: Fitted) => leadingFor(text, TITLE_LEADING.latin, TITLE_LEADING.thai);
  const titleText =
    shapedTitle.find(
      (text) => !hasEllipsis(text) && blockHeight(text, titleLeading(text)) <= titleRoom
    ) ?? shapedTitle.at(-1)!;

  const summaryRoom = titleRoom - blockHeight(titleText, titleLeading(titleText)) - STACK_GAP;
  const summaryText = summary ? await fitSummary(summary, width, summaryRoom) : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: CREAM,
        borderTop: `14px solid ${BRAND}`,
        padding: `48px ${PAD_X}px 44px`,
      }}
    >
      <TextBlock text={eyebrowText} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: ASIDE_GAP }}>
        <div style={{ width, display: "flex", flexDirection: "column", gap: STACK_GAP }}>
          <TextBlock text={titleText} leading={titleLeading(titleText)} />
          {summaryText ? (
            <TextBlock
              text={summaryText}
              leading={leadingFor(summaryText, SUMMARY_LEADING.latin, SUMMARY_LEADING.thai)}
            />
          ) : null}
          {chips.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: CHIP_GAP }}>
              {badge && badgeText ? (
                <Chip text={badgeText} background={badge.tone === "forest" ? FOREST : INK} />
              ) : null}
              {factTexts.map((fact, i) => (
                <Chip key={i} text={fact} background={SUNKEN} />
              ))}
            </div>
          ) : null}
        </div>
        {asideNode}
      </div>
      {foot}
    </div>,
    OG_SIZE
  );
}

const SITE_COPY: Record<Locale, { name: string; other: string; detail: string }> = {
  en: {
    name: "BIR Student Association",
    other: "สโมสรนักศึกษาการเมืองและการระหว่างประเทศ",
    detail: "Politics and International Relations, Thammasat University",
  },
  th: {
    name: "สโมสรนักศึกษาการเมืองและการระหว่างประเทศ",
    other: "BIR Student Association",
    detail: "คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
  },
};

/** The site-wide card: the logo and the association's name in both languages, page language first. */
export async function renderSiteOgImage(locale: Locale = "th") {
  const copy = SITE_COPY[locale];
  const host = siteHost();
  const [name, other, detail, domain] = await Promise.all([
    fitText(copy.name, {
      style: "display",
      color: BRAND,
      sizes: locale === "th" ? [64, 58, 52, 48, 44] : [76, 68, 60],
      maxWidth: 700,
      maxLines: locale === "th" ? 1 : 2,
    }),
    lineText(copy.other, "strong", INK, 32),
    fitText(copy.detail, { style: "text", color: MUTED, sizes: [28], maxWidth: 700, maxLines: 2 }),
    host ? lineText(host, "strong", BRAND, 26) : Promise.resolve(null),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: CREAM,
        borderTop: `14px solid ${BRAND}`,
        padding: `0 ${PAD_X}px`,
        gap: 56,
      }}
    >
      {/* Satori needs a raw <img>, not next/image. */}
      <img src={logoSrc()} width={256} height={256} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 700 }}>
        <TextBlock text={name} leading={leadingFor(name, 1.06, 1.2)} />
        <TextBlock text={other} />
        <div style={{ display: "flex", width: 96, height: 4, backgroundColor: BRAND }} />
        <TextBlock text={detail} />
        {domain ? <TextBlock text={domain} /> : null}
      </div>
    </div>,
    OG_SIZE
  );
}

/** Hero band colours from `EmergencyHero`, as hex for Satori. */
const HERO_HEX: Record<HeroTone, string> = {
  red: "#b3161c",
  black: "#000000",
  purple: "#6b21a8",
  blue: "#1e40af",
  green: "#14532d",
  brown: "#7c2d12",
  slate: "#334155",
};

/**
 * A card for an emergency guide: the guide's hero colour, the live alert's
 * headline when there is one (else the guide title), and the guide title as
 * context, so a shared link reads as an alert at a glance.
 */
export async function renderEmergencyOgImage({
  locale,
  tone,
  eyebrow,
  headline,
  context,
}: {
  locale: Locale;
  tone: HeroTone;
  eyebrow: string;
  headline: string;
  context?: string;
}) {
  const bg = HERO_HEX[tone];
  const width = OG_SIZE.width - PAD_X * 2;
  const [eyebrowText, headlineText, contextText, foot] = await Promise.all([
    lineText(eyebrow, "strong", bg, 28),
    fitText(headline, {
      style: "strong",
      color: WHITE,
      sizes: [72, 64, 56, 50, 44],
      maxWidth: width,
      maxLines: context ? 3 : 4,
    }),
    context
      ? fitText(context, { style: "text", color: WHITE, sizes: [32], maxWidth: width, maxLines: 1 })
      : Promise.resolve(null),
    footer(locale, WHITE, WHITE, "rgba(255,255,255,0.35)"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: bg,
        padding: `48px ${PAD_X}px 44px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          backgroundColor: WHITE,
          borderRadius: 999,
          padding: "4px 24px",
        }}
      >
        <TextBlock text={eyebrowText} />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <TextBlock text={headlineText} leading={leadingFor(headlineText, 1.1, 1.22)} />
        {contextText ? <TextBlock text={contextText} /> : null}
      </div>
      {foot}
    </div>,
    OG_SIZE
  );
}

/** A photograph with the page's title over a dark wash, for commemorations. */
export async function renderCommemorationOgImage({
  locale,
  photo,
  eyebrow,
  title,
  closing,
}: {
  locale: Locale;
  photo: string;
  eyebrow: string;
  title: string;
  closing: string;
}) {
  const [eyebrowText, titleText, closingText, name] = await Promise.all([
    lineText(eyebrow, "strong", WHITE, 30),
    fitText(title, {
      style: "display",
      color: WHITE,
      sizes: [104, 92, 80],
      maxWidth: 720,
      maxLines: 2,
    }),
    fitText(closing, { style: "text", color: WHITE, sizes: [36], maxWidth: 720, maxLines: 2 }),
    lineText(getDictionary(locale).site.fullName, "strong", WHITE, 28),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#0d0c0b",
      }}
    >
      <img
        src={photoSrc(photo)}
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        alt=""
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.8 }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(to right, rgba(13,12,11,0.95) 0%, rgba(13,12,11,0.75) 45%, rgba(13,12,11,0.1) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
        }}
      >
        <TextBlock text={eyebrowText} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextBlock text={titleText} leading={leadingFor(titleText, 1.04, 1.2)} />
          <TextBlock text={closingText} leading={1.3} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", backgroundColor: WHITE, borderRadius: 14, padding: 6 }}>
            <img src={logoSrc()} width={56} height={56} alt="" />
          </div>
          <TextBlock text={name} />
        </div>
      </div>
    </div>,
    OG_SIZE
  );
}
