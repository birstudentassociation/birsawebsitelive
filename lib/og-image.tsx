import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { HeroTone } from "@/content/emergency/types";
import { ShapedText, shapeText } from "@/lib/og-text";
import { SHARE_IMAGE_ID } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 };

/** Image metadata with a locale-aware alt; the id is fixed so the URL is predictable. */
export function shareImageMetadata(alt: string) {
  return [{ id: SHARE_IMAGE_ID, alt, size: OG_SIZE, contentType: "image/png" }];
}

const BRAND = "#d81f26";
const CREAM = "#fbf7ef";
const INK = "#1f1a17";
const WHITE = "#ffffff";

/**
 * Runs on the default Node.js runtime (not edge) so it can read the bundled
 * logo from disk. All text is shaped with HarfBuzz in `og-text` and drawn as
 * vector images, because Satori cannot position Thai tone marks and vowels.
 */
function logoSrc() {
  const logo = fs.readFileSync(path.join(process.cwd(), "public", "birsa-logo.png"));
  return `data:image/png;base64,${logo.toString("base64")}`;
}

/** The site-wide card: logo and the association's name in both languages. */
export async function renderSiteOgImage() {
  const [name, thaiName] = await Promise.all([
    shapeText("BIR Student Association", 62, 700, BRAND),
    shapeText("สโมสรนักศึกษาการเมืองและการระหว่างประเทศ", 30, 600, BRAND),
  ]);
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
        <img src={logoSrc()} width={220} height={220} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ShapedText pieces={name} size={62} />
          <ShapedText pieces={thaiName} size={30} />
        </div>
      </div>
    </div>,
    OG_SIZE
  );
}

/** A card for one page: its section, its title and the BIRSA mark. */
export async function renderPageOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const fontSize = title.length > 90 ? 46 : title.length > 55 ? 56 : 66;
  const [eyebrowText, titleText, name] = await Promise.all([
    shapeText(eyebrow, 30, 600, BRAND),
    shapeText(title, fontSize, 700, INK),
    shapeText("BIR Student Association", 32, 700, BRAND),
  ]);
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
        padding: "56px 88px",
      }}
    >
      <ShapedText pieces={eyebrowText} size={30} />
      <ShapedText pieces={titleText} size={fontSize} />
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img src={logoSrc()} width={88} height={88} alt="" />
        <ShapedText pieces={name} size={32} />
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
  const bg = HERO_HEX[tone];
  const fontSize = headline.length > 110 ? 44 : headline.length > 70 ? 52 : 62;
  const [eyebrowText, headlineText, contextText, name] = await Promise.all([
    shapeText(eyebrow, 28, 700, bg),
    shapeText(headline, fontSize, 700, WHITE),
    context ? shapeText(context, 32, 600, WHITE) : Promise.resolve(null),
    shapeText("BIR Student Association", 30, 700, WHITE),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: bg,
        padding: "56px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          backgroundColor: WHITE,
          borderRadius: 999,
          padding: "2px 24px",
        }}
      >
        <ShapedText pieces={eyebrowText} size={28} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ShapedText pieces={headlineText} size={fontSize} />
        {contextText ? <ShapedText pieces={contextText} size={32} /> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", backgroundColor: WHITE, borderRadius: 16, padding: 8 }}>
          <img src={logoSrc()} width={64} height={64} alt="" />
        </div>
        <ShapedText pieces={name} size={30} />
      </div>
    </div>,
    OG_SIZE
  );
}

function photoSrc(file: string) {
  const photo = fs.readFileSync(path.join(process.cwd(), "public", file));
  return `data:image/jpeg;base64,${photo.toString("base64")}`;
}

export async function renderCommemorationOgImage({
  photo,
  eyebrow,
  title,
  closing,
}: {
  photo: string;
  eyebrow: string;
  title: string;
  closing: string;
}) {
  const [eyebrowText, titleText, closingText, name] = await Promise.all([
    shapeText(eyebrow, 30, 600, WHITE),
    shapeText(title, 96, 700, WHITE),
    shapeText(closing, 38, 600, WHITE),
    shapeText("BIR Student Association", 28, 700, WHITE),
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
        <ShapedText pieces={eyebrowText} size={30} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
          <ShapedText pieces={titleText} size={96} />
          <ShapedText pieces={closingText} size={38} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", backgroundColor: WHITE, borderRadius: 14, padding: 6 }}>
            <img src={logoSrc()} width={56} height={56} alt="" />
          </div>
          <ShapedText pieces={name} size={28} />
        </div>
      </div>
    </div>,
    OG_SIZE
  );
}
