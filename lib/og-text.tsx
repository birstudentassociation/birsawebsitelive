import fs from "node:fs";
import path from "node:path";

/**
 * Text for Open Graph cards, shaped with HarfBuzz and drawn as vector paths.
 *
 * Satori (behind next/og) lays out glyphs without OpenType mark positioning,
 * so Thai tone marks and upper vowels land on top of each other. HarfBuzz
 * applies the font's own GSUB and GPOS rules, so each word is shaped here and
 * handed to Satori as an SVG image. Lines are broken here too, word by word,
 * so a title can be fitted to a number of lines before it is drawn.
 *
 * The faces follow the site's type: Fraunces and JenjrusVris for display,
 * Lexend and Sarabun for text. Each word takes the face for its script, and
 * anything a face cannot draw falls back to Sarabun, which covers both.
 */

type Hb = typeof import("harfbuzzjs");
type LoadedFont = { hb: Hb; font: InstanceType<Hb["Font"]>; upem: number };

// Loaded at run time so the bundler leaves the WebAssembly loader alone.
let hbReady: Promise<Hb> | null = null;
function harfbuzz(): Promise<Hb> {
  hbReady ??= import("harfbuzzjs");
  return hbReady;
}

const fonts = new Map<string, Promise<LoadedFont>>();
function loadFont(file: string) {
  let entry = fonts.get(file);
  if (!entry) {
    entry = harfbuzz().then((hb) => {
      const data = fs.readFileSync(path.join(process.cwd(), "assets", "fonts", file));
      const face = new hb.Face(new hb.Blob(new Uint8Array(data)), 0);
      return { hb, font: new hb.Font(face), upem: face.upem };
    });
    fonts.set(file, entry);
  }
  return entry;
}

export type OgStyle = "display" | "text" | "strong";

const FACES: Record<OgStyle, { latin: string; thai: string }> = {
  display: { latin: "Fraunces-SemiBold.ttf", thai: "JenjrusVris.ttf" },
  text: { latin: "Lexend-Medium.ttf", thai: "Sarabun-SemiBold.ttf" },
  strong: { latin: "Lexend-SemiBold.ttf", thai: "Sarabun-Bold.ttf" },
};
const FALLBACK: Record<OgStyle, string> = {
  display: "Sarabun-Bold.ttf",
  text: "Sarabun-SemiBold.ttf",
  strong: "Sarabun-Bold.ttf",
};

const THAI = /[฀-๿]/;

/** Room above and below the baseline, in ems. Thai needs space for stacked marks. */
function metrics(thai: boolean) {
  return thai ? { ascent: 1.12, descent: 0.38 } : { ascent: 1.0, descent: 0.32 };
}

type Glyphs = { paths: string[]; advance: number; upem: number; missing: boolean };

async function shapeWith(file: string, text: string): Promise<Glyphs> {
  const { hb, font, upem } = await loadFont(file);
  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hb.shape(font, buffer);
  let x = 0;
  let missing = false;
  const paths: string[] = [];
  for (const glyph of buffer.getGlyphInfosAndPositions()) {
    if (glyph.codepoint === 0) missing = true;
    const d = font.glyphToPath(glyph.codepoint);
    const { xAdvance = 0, xOffset = 0, yOffset = 0 } = glyph;
    if (d) paths.push(`<path transform="translate(${x + xOffset} ${yOffset})" d="${d}"/>`);
    x += xAdvance;
  }
  return { paths, advance: x, upem, missing };
}

export type Piece =
  | { kind: "word"; src: string; width: number; ellipsis?: boolean }
  | { kind: "space"; width: number };

/** One shaped run of text, with widths in ems so it can be drawn at any size. */
export type Shaped = { pieces: Piece[]; ascent: number; descent: number };

async function shapeWord(
  word: string,
  style: OgStyle,
  color: string,
  thaiBlock: boolean
): Promise<Piece> {
  const face = THAI.test(word) ? FACES[style].thai : FACES[style].latin;
  let glyphs = await shapeWith(face, word);
  if (glyphs.missing) glyphs = await shapeWith(FALLBACK[style], word);
  const { ascent, descent } = metrics(thaiBlock);
  const { paths, advance, upem } = glyphs;
  const top = ascent * upem;
  const total = (ascent + descent) * upem;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${-top} ${advance} ${total}">` +
    `<g transform="scale(1 -1)" fill="${color}">${paths.join("")}</g></svg>`;
  return {
    kind: "word",
    src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    width: advance / upem,
  };
}

const OPENING = /^[(\[{“‘]+$/;
const STRAIGHT = /^["']+$/;
const CLOSING = /^[)\]}”’"'.,;:!?%…-]+$/;

/** Keeps brackets, quotes and stops on the word they belong to, so a line never starts or ends with one. */
function joinPunctuation(segments: string[]): string[] {
  const out: string[] = [];
  let carry = "";
  for (const segment of segments) {
    const atStart = !out.length || !out.at(-1)!.trim();
    if (OPENING.test(segment) || (STRAIGHT.test(segment) && atStart)) {
      carry += segment;
    } else if (CLOSING.test(segment) && !atStart) {
      out[out.length - 1] += carry + segment;
      carry = "";
    } else {
      out.push(carry + segment);
      carry = "";
    }
  }
  if (carry) out.push(carry);
  return out;
}

/** Splits `text` at word boundaries (Thai included) and shapes each word. */
export async function shapeText(text: string, style: OgStyle, color: string): Promise<Shaped> {
  const thai = THAI.test(text);
  const segmenter = new Intl.Segmenter("th", { granularity: "word" });
  const segments = joinPunctuation(
    [...segmenter.segment(text.replace(/\s+/g, " ").trim())].map((s) => s.segment)
  );
  const pieces = await Promise.all(
    segments.map((segment): Promise<Piece> | Piece =>
      segment.trim()
        ? shapeWord(segment, style, color, thai)
        : { kind: "space", width: style === "display" ? 0.24 : 0.28 }
    )
  );
  return { pieces, ...metrics(thai) };
}

type Line = Piece[];

function lineWidth(line: Line) {
  return line.reduce((sum, piece) => sum + piece.width, 0);
}

/** Greedy line breaking, in ems. Spaces at the ends of a line are dropped. */
function breakLines(pieces: Piece[], maxEms: number): Line[] {
  const lines: Line[] = [];
  let line: Line = [];
  let width = 0;
  for (const piece of pieces) {
    if (piece.kind === "space") {
      if (line.length) {
        line.push(piece);
        width += piece.width;
      }
      continue;
    }
    if (width + piece.width > maxEms && line.some((p) => p.kind === "word")) {
      while (line.at(-1)?.kind === "space") line.pop();
      lines.push(line);
      line = [];
      width = 0;
    }
    line.push(piece);
    width += piece.width;
  }
  while (line.at(-1)?.kind === "space") line.pop();
  if (line.length) lines.push(line);
  return lines;
}

export type Fitted = { size: number; lines: Line[]; ascent: number; descent: number };

/**
 * The largest of `sizes` at which `text` fits in `maxLines` lines of
 * `maxWidth` pixels. At the smallest size, text that still overflows is cut at
 * a word and ends with an ellipsis.
 */
export async function fitText(
  text: string,
  {
    style,
    color,
    sizes,
    maxWidth,
    maxLines,
  }: { style: OgStyle; color: string; sizes: number[]; maxWidth: number; maxLines: number }
): Promise<Fitted> {
  const shaped = await shapeText(text, style, color);
  const ordered = [...sizes].sort((a, b) => b - a);
  for (const size of ordered) {
    const lines = breakLines(shaped.pieces, maxWidth / size);
    if (lines.length <= maxLines) return { size, lines, ...shaped };
  }
  const size = ordered.at(-1)!;
  const maxEms = maxWidth / size;
  const lines = breakLines(shaped.pieces, maxEms).slice(0, maxLines);
  const ellipsis = (await shapeText("…", style, color)).pieces[0]!;
  const last = lines[maxLines - 1]!;
  while (last.length > 1 && lineWidth(last) + ellipsis.width > maxEms) last.pop();
  while (last.at(-1)?.kind === "space") last.pop();
  last.push({ ...ellipsis, ellipsis: true } as Piece);
  return { size, lines, ...shaped };
}

/** Text on one line at a fixed size, for labels and names. */
export async function lineText(text: string, style: OgStyle, color: string, size: number) {
  return fitText(text, { style, color, sizes: [size], maxWidth: 10_000, maxLines: 1 });
}

/** Draws fitted lines. `leading` is the line height as a multiple of the size. */
export function TextBlock({ text, leading }: { text: Fitted; leading?: number }) {
  const { size, lines, ascent, descent } = text;
  const box = (ascent + descent) * size;
  const pull = leading === undefined ? 0 : Math.min(0, leading * size - box);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", marginTop: i === 0 ? 0 : pull }}>
          {line.map((piece, j) =>
            piece.kind === "word" ? (
              // Satori needs a raw <img>, not next/image.
              <img
                key={j}
                src={piece.src}
                width={piece.width * size}
                height={box}
                alt=""
                style={{ flexShrink: 0 }}
              />
            ) : (
              <div key={j} style={{ width: piece.width * size, flexShrink: 0 }} />
            )
          )}
        </div>
      ))}
    </div>
  );
}

/** Height of a drawn `TextBlock`, in pixels. */
export function blockHeight(text: Fitted, leading?: number) {
  const box = (text.ascent + text.descent) * text.size;
  const step = leading === undefined ? box : Math.min(box, leading * text.size);
  return text.lines.length ? box + (text.lines.length - 1) * step : 0;
}

/** Width of the widest line, in pixels. */
export function textWidth(text: Fitted) {
  return Math.max(0, ...text.lines.map((line) => lineWidth(line) * text.size));
}
