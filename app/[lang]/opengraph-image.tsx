import { ImageResponse } from "next/og";

export const alt = "BIRSA — BIR Student Association, Thammasat University";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Shared Open Graph image for every page under `/[lang]` (Next.js falls
 * back to this for any route that doesn't define its own). Built with
 * next/og so it renders on the edge runtime without shipping custom font
 * files — system sans-serif is fine for a bold wordmark treatment.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
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
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 700,
              color: "#211c19",
              letterSpacing: -2,
            }}
          >
            BIRSA
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 160,
            height: 8,
            backgroundColor: "#d81f26",
            marginTop: 24,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#211c19",
            maxWidth: 900,
          }}
        >
          BIR Student Association — Thammasat University
        </div>
      </div>
    ),
    { ...size }
  );
}
