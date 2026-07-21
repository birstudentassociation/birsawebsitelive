import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "BIR Student Association, Politics and International Relations, Thammasat University";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Shared Open Graph image for every page under `/[lang]` (Next.js falls back
 * to this for any route that doesn't define its own). Runs on the default
 * Node.js runtime (not edge) so it can read the bundled logo and Sarabun font
 * files from disk with `fs`; Satori (which next/og uses) ships no default
 * font, so fonts must be supplied explicitly, and Sarabun covers both Latin
 * and Thai glyphs for the subtitle.
 */
export default function OpengraphImage() {
  const logoData = fs.readFileSync(path.join(process.cwd(), "public", "birsa-logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  const sarabunSemiBold = fs.readFileSync(
    path.join(process.cwd(), "assets", "fonts", "Sarabun-SemiBold.ttf")
  );
  const sarabunBold = fs.readFileSync(
    path.join(process.cwd(), "assets", "fonts", "Sarabun-Bold.ttf")
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fbf7ef",
        borderTop: "24px solid #d81f26",
        padding: "80px 96px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 56,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs a raw <img>, not next/image */}
        <img src={logoSrc} width={220} height={220} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Sarabun",
              fontWeight: 700,
              fontSize: 62,
              color: "#d81f26",
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
              color: "#d81f26",
            }}
          >
            สโมสรนักศึกษาการเมืองและการระหว่างประเทศ
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Sarabun", data: sarabunSemiBold, weight: 600, style: "normal" },
        { name: "Sarabun", data: sarabunBold, weight: 700, style: "normal" },
      ],
    }
  );
}
