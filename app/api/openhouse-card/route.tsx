import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, formatDate, type Locale } from "@/lib/i18n";
import { dayEntries, parseState } from "@/lib/openhouse";
import { CAMPUS, RIVER, projector, smoothPath } from "@/lib/openhouse-geo";
import { COPY, OPEN_HOUSE, t } from "@/content/openhouse/copy";

export const runtime = "nodejs";

const W = 1200;
const H = 630;
const PAPER = "#fbf7ef";
const INK = "#211c19";
const MUTED = "#5b524a";
const BRAND = "#d81f26";

/**
 * The link-preview image for a shared day. Everything comes from the validated
 * query (the same closed set the page accepts), so an arbitrary URL can only
 * ever render one of the real choices, and nothing personal is ever drawn: the
 * optional name lives only in the visitor's own saved card. Fonts are the
 * site's (Fraunces, Lexend) with JenjrusVris/Sarabun covering Thai; Satori
 * needs them supplied as files.
 */
export function GET(req: Request) {
  const url = new URL(req.url);
  const langParam = url.searchParams.get("lang") ?? "";
  const locale: Locale = isLocale(langParam) ? langParam : "en";
  const state = parseState(Object.fromEntries(url.searchParams));
  const entries = dayEntries(locale, state);
  const th = locale === "th";

  const riverBox = { x: 40, y: 56, w: 220, h: 518 };
  const project = projector(RIVER, riverBox);
  const riverD = smoothPath(RIVER.map(project));
  const campus = project(CAMPUS);

  const display = "Fraunces, JenjrusVris";
  const sans = "Lexend, Sarabun";
  const kicker = th
    ? `BIR · ท่าพระจันทร์ · OPEN HOUSE · ${formatDate(locale, OPEN_HOUSE.dateISO)}`
    : `BIR · THA PRACHAN · OPEN HOUSE · ${formatDate(locale, OPEN_HOUSE.dateISO).toUpperCase()}`;
  const cwd = process.cwd();
  const logoData = fs.readFileSync(path.join(cwd, "public", "birsa-logo.png"));
  const logo = `data:image/png;base64,${logoData.toString("base64")}`;
  const fraunces = fs.readFileSync(path.join(cwd, "assets", "fonts", "Fraunces-SemiBold.ttf"));
  const jenjrus = fs.readFileSync(path.join(cwd, "assets", "fonts", "JenjrusVris.ttf"));
  const lexendMedium = fs.readFileSync(path.join(cwd, "assets", "fonts", "Lexend-Medium.ttf"));
  const lexendSemi = fs.readFileSync(path.join(cwd, "assets", "fonts", "Lexend-SemiBold.ttf"));
  const sarabunSemi = fs.readFileSync(path.join(cwd, "assets", "fonts", "Sarabun-SemiBold.ttf"));
  const sarabunBold = fs.readFileSync(path.join(cwd, "assets", "fonts", "Sarabun-Bold.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: PAPER,
        borderTop: `12px solid ${BRAND}`,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "56px 40px 48px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: th ? 1 : 3,
            color: BRAND,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontFamily: display,
            fontWeight: 600,
            fontSize: entries.length ? 62 : 70,
            lineHeight: th ? 1.35 : 1.05,
            color: INK,
          }}
        >
          {entries.length ? t(COPY.daySubtitle, locale) : t(COPY.headline, locale)}
        </div>
        {entries.length ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, gap: 12 }}>
            {entries.map((e) => (
              <div key={e.time} style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
                <div
                  style={{
                    display: "flex",
                    width: 70,
                    fontFamily: sans,
                    fontWeight: 600,
                    fontSize: 20,
                    color: BRAND,
                  }}
                >
                  {e.time}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: display,
                    fontWeight: 600,
                    fontSize: 29,
                    color: INK,
                  }}
                >
                  {e.value}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 30,
              color: MUTED,
            }}
          >
            {t(COPY.sub, locale)}
          </div>
        )}
        <div style={{ display: "flex", flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Satori needs a raw <img>, not next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={46} height={46} alt="" />
          <div
            style={{
              display: "flex",
              fontFamily: display,
              fontWeight: 600,
              fontSize: 28,
              color: INK,
            }}
          >
            BIRSA
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 14,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 20,
              color: MUTED,
            }}
          >
            {t(COPY.cardPlace, locale)}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", width: 300, height: "100%", position: "relative" }}>
        <svg width={300} height={H - 12} viewBox={`0 0 300 ${H - 12}`}>
          <path d={riverD} fill="none" stroke="#dfe7e4" strokeWidth={22} strokeLinecap="round" />
          <path d={riverD} fill="none" stroke="#8f8578" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={campus.x} cy={campus.y} r={10} fill={BRAND} stroke={PAPER} strokeWidth={4} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: campus.x + 20,
            top: campus.y - 14,
            display: "flex",
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 18,
            color: INK,
          }}
        >
          {th ? "ท่าพระจันทร์" : "Tha Prachan"}
        </div>
      </div>
    </div>,
    {
      width: W,
      height: H,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600 },
        { name: "JenjrusVris", data: jenjrus, weight: 600 },
        { name: "Lexend", data: lexendMedium, weight: 500 },
        { name: "Lexend", data: lexendSemi, weight: 600 },
        { name: "Sarabun", data: sarabunSemi, weight: 500 },
        { name: "Sarabun", data: sarabunBold, weight: 600 },
      ],
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    }
  );
}
