import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { HeroTone } from "@/content/emergency/types";

export const OG_SIZE = { width: 1200, height: 630 };

const BRAND = "#d81f26";
const CREAM = "#fbf7ef";
const INK = "#1f1a17";

/**
 * Runs on the default Node.js runtime (not edge) so it can read the bundled
 * logo and Sarabun font files from disk with `fs`; Satori (which next/og
 * uses) ships no default font, so fonts must be supplied explicitly, and
 * Sarabun covers both Latin and Thai glyphs.
 */
function assets() {
  const logo = fs.readFileSync(path.join(process.cwd(), "public", "birsa-logo.png"));
  const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "assets", "fonts", file));
  return {
    logoSrc: `data:image/png;base64,${logo.toString("base64")}`,
    fonts: [
      {
        name: "Sarabun",
        data: font("Sarabun-SemiBold.ttf"),
        weight: 600 as const,
        style: "normal" as const,
      },
      {
        name: "Sarabun",
        data: font("Sarabun-Bold.ttf"),
        weight: 700 as const,
        style: "normal" as const,
      },
    ],
  };
}

/** The site-wide card: logo and the association's name in both languages. */
export function renderSiteOgImage() {
  const { logoSrc, fonts } = assets();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: CREAM,
        borderTop: `24px solid ${BRAND}`,
        padding: "80px 96px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        {/* Satori needs a raw <img>, not next/image. */}
        <img src={logoSrc} width={220} height={220} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Sarabun",
              fontWeight: 700,
              fontSize: 62,
              color: BRAND,
              lineHeight: 1.1,
            }}
          >
            BIR Student Association
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Sarabun",
              fontWeight: 600,
              fontSize: 30,
              color: BRAND,
            }}
          >
            สโมสรนักศึกษาการเมืองและการระหว่างประเทศ
          </div>
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts }
  );
}

/** Satori cannot line-break unspaced Thai, so the title is laid out word by word. */
function words(text: string): string[] {
  const segmenter = new Intl.Segmenter("th", { granularity: "word" });
  return [...segmenter.segment(text)].map((s) => s.segment);
}

/** A card for one page: its section, its title and the BIRSA mark. */
export function renderPageOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { logoSrc, fonts } = assets();
  const fontSize = title.length > 90 ? 48 : title.length > 55 ? 58 : 68;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: CREAM,
        borderTop: `24px solid ${BRAND}`,
        padding: "64px 88px",
        fontFamily: "Sarabun",
      }}
    >
      <div style={{ display: "flex", fontWeight: 600, fontSize: 30, color: BRAND }}>{eyebrow}</div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontWeight: 700,
          fontSize,
          lineHeight: 1.25,
          color: INK,
        }}
      >
        {words(title).map((word, i) =>
          word.trim() ? (
            <span key={i}>{word}</span>
          ) : (
            <span key={i} style={{ width: fontSize * 0.28 }} />
          )
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img src={logoSrc} width={88} height={88} alt="" />
        <div style={{ display: "flex", fontWeight: 700, fontSize: 32, color: BRAND }}>
          BIR Student Association
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts }
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
export function renderEmergencyOgImage({
  tone,
  eyebrow,
  headline,
  context,
}: {
  tone: HeroTone;
  eyebrow: string;
  headline: string;
  context?: string;
}) {
  const { logoSrc, fonts } = assets();
  const fontSize = headline.length > 110 ? 46 : headline.length > 70 ? 54 : 64;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: HERO_HEX[tone],
        padding: "60px 80px",
        fontFamily: "Sarabun",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: HERO_HEX[tone],
          backgroundColor: "#ffffff",
          borderRadius: 999,
          padding: "8px 24px",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{ display: "flex", flexWrap: "wrap", fontWeight: 700, fontSize, lineHeight: 1.25 }}
        >
          {words(headline).map((word, i) =>
            word.trim() ? (
              <span key={i}>{word}</span>
            ) : (
              <span key={i} style={{ width: fontSize * 0.28 }} />
            )
          )}
        </div>
        {context ? (
          <div style={{ display: "flex", fontWeight: 600, fontSize: 32, opacity: 0.9 }}>
            {context}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 8,
          }}
        >
          <img src={logoSrc} width={64} height={64} alt="" />
        </div>
        <div style={{ display: "flex", fontWeight: 700, fontSize: 30 }}>
          BIR Student Association
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts }
  );
}
