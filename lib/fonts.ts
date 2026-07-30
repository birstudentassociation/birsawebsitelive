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
  // Sarabun is the fallback for Thai text. It is already loaded on every Thai
  // page (it sets the body copy), so skip the synthesised Arial-metric fallback
  // face: falling through to a real Thai face looks far better during the swap,
  // and a synthesised face would not carry the size-adjust below.
  fallback: ["Sarabun", "system-ui", "sans-serif"],
  adjustFontFallback: false,
  declarations: [
    // JenjrusVris is drawn small on the em: its Thai loop height is 460/1000,
    // against Fraunces's 670/1000 cap height and Sarabun's 560/1000. Left
    // alone it renders Thai headings far smaller than the English ones (and
    // smaller than the Sarabun headings it replaced). 140% brings the loop
    // level with Fraunces's caps; strict cap-height parity would be ~152%, but
    // Thai stacks tone marks above the loop, so matching exactly overshoots.
    //
    // Scaling the face here rather than inflating font-size on Thai headings
    // keeps every heading step, `--measure` and the rem rhythm meaning the same
    // thing in both locales. See the Thai heading block in app/globals.css for
    // the matching leading.
    { prop: "size-adjust", value: "140%" },
  ],
});
