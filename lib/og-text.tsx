import fs from "node:fs";
import path from "node:path";

/**
 * Text for Open Graph cards, shaped with HarfBuzz and drawn as vector paths.
 *
 * Satori (behind next/og) lays out glyphs without OpenType mark positioning,
 * so Thai tone marks and upper vowels land on top of each other. HarfBuzz
 * applies the font's own GSUB and GPOS rules, so each word is shaped here and
 * handed to Satori as an SVG image, and wrapping still happens word by word.
 */

type Hb = typeof import("harfbuzzjs");

// Loaded at run time so the bundler leaves the WebAssembly loader alone.
let hbReady: Promise<Hb> | null = null;
function harfbuzz(): Promise<Hb> {
  hbReady ??= import("harfbuzzjs");
  return hbReady;
}

export type OgWeight = 600 | 700;
const FONT_FILES: Record<OgWeight, string> = {
  600: "Sarabun-SemiBold.ttf",
  700: "Sarabun-Bold.ttf",
};

const fonts = new Map<
  OgWeight,
  Promise<{ hb: Hb; font: InstanceType<Hb["Font"]>; upem: number }>
>();
function fontFor(weight: OgWeight) {
  let entry = fonts.get(weight);
  if (!entry) {
    entry = harfbuzz().then((hb) => {
      const data = fs.readFileSync(path.join(process.cwd(), "assets", "fonts", FONT_FILES[weight]));
      const face = new hb.Face(new hb.Blob(new Uint8Array(data)), 0);
      return { hb, font: new hb.Font(face), upem: face.upem };
    });
    fonts.set(weight, entry);
  }
  return entry;
}

/** Room above and below the baseline, in ems, enough for stacked Thai marks. */
const ASCENT = 1.12;
const DESCENT = 0.38;

type Piece = { kind: "word"; src: string; width: number; height: number } | { kind: "space" };

async function shapeWord(text: string, size: number, weight: OgWeight, color: string) {
  const { hb, font, upem } = await fontFor(weight);
  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hb.shape(font, buffer);
  const glyphs = buffer.getGlyphInfosAndPositions();

  let x = 0;
  const paths: string[] = [];
  for (const glyph of glyphs) {
    const d = font.glyphToPath(glyph.codepoint);
    const { xAdvance = 0, xOffset = 0, yOffset = 0 } = glyph;
    if (d) paths.push(`<path transform="translate(${x + xOffset} ${yOffset})" d="${d}"/>`);
    x += xAdvance;
  }
  const top = ASCENT * upem;
  const total = (ASCENT + DESCENT) * upem;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${-top} ${x} ${total}">` +
    `<g transform="scale(1 -1)" fill="${color}">${paths.join("")}</g></svg>`;
  return {
    src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    width: (x / upem) * size,
    height: (ASCENT + DESCENT) * size,
  };
}

/** Splits at word boundaries (Thai included) and shapes each word. */
export async function shapeText(
  text: string,
  size: number,
  weight: OgWeight,
  color: string
): Promise<Piece[]> {
  const segmenter = new Intl.Segmenter("th", { granularity: "word" });
  const segments = [...segmenter.segment(text)].map((s) => s.segment);
  return Promise.all(
    segments.map(async (segment): Promise<Piece> =>
      segment.trim()
        ? { kind: "word", ...(await shapeWord(segment, size, weight, color)) }
        : { kind: "space" }
    )
  );
}

/** Renders shaped pieces as a wrapping row. Spaces become gaps of a quarter em. */
export function ShapedText({ pieces, size }: { pieces: Piece[]; size: number }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
      {pieces.map((piece, i) =>
        piece.kind === "word" ? (
          // Satori needs a raw <img>, not next/image.
          <img key={i} src={piece.src} width={piece.width} height={piece.height} alt="" />
        ) : (
          <div key={i} style={{ width: size * 0.28 }} />
        )
      )}
    </div>
  );
}
