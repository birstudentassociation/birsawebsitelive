import localFont from "next/font/local";

/**
 * Thai display face: JenjrusVris, used for headings and display type on Thai
 * pages (`html[lang="th"]`). Self-hosted because it is not on Google Fonts.
 *
 * It ships a single weight (usWeightClass 400) plus a true italic, so Thai
 * headings must not ask for 700: `font-synthesis-weight: none` is set globally,
 * which means a bolder request renders at 400 anyway. `app/globals.css` sets
 * Thai headings to 400 for that reason.
 *
 * Body copy stays on Sarabun; this face covers the full Thai block and basic
 * Latin only, so mixed-script headings fall through to Sarabun for anything
 * else (accents, punctuation beyond ASCII, digits in other scripts).
 *
 * Declared here rather than inline so the root layout and the two global
 * boundaries (`app/not-found.tsx`, `app/global-error.tsx`) cannot drift.
 */
export const jenjrusVris = localFont({
  src: [
    {
      path: "../assets/fonts/JenjrusVris.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/JenjrusVris-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-th-display",
  display: "swap",
  // The root layout is shared by both locales, so a preload link would be
  // emitted on English pages that never render a Thai glyph. Let the browser
  // fetch it when the Thai heading rules actually ask for it.
  preload: false,
  // Sarabun is the fallback for Thai text; matching its metrics keeps the
  // swap from shifting layout.
  fallback: ["Sarabun", "system-ui", "sans-serif"],
});
