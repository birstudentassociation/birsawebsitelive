/**
 * The inline dark-mode bootstrap that runs before first paint in the root
 * layout. It reads the visitor's explicit theme choice from localStorage and
 * sets `data-theme` so there is no flash of the wrong theme; system-preference
 * users need no JS at all (handled by the CSS media-query scope).
 *
 * This lives in its own module because its EXACT bytes are security-relevant:
 * on strict-CSP routes (the officer console) it is authorised by a SHA-256
 * hash rather than a nonce, so the layout can stay free of any `headers()`
 * read and the public pages can render statically. `THEME_SCRIPT_HASH` below is
 * that hash; `tests/theme-script-hash.test.ts` recomputes it from the source
 * and fails the build if a single byte drifts, so the CSP can never silently
 * start blocking this script.
 *
 * If you edit THEME_SCRIPT, run the test, which prints the new hash to paste back.
 */
export const THEME_SCRIPT = `try {
  var t = localStorage.getItem("birsa-theme");
  if (t === "dark" || t === "light") {
    document.documentElement.dataset.theme = t;
  }
} catch (e) {}`;

/**
 * Base64 SHA-256 of THEME_SCRIPT's exact bytes, formatted as a CSP source
 * expression. Add this to `script-src` wherever the script is not nonce'd.
 */
export const THEME_SCRIPT_HASH = "sha256-A/lKozzm+WYeAvlO+iSVonVgnKt2FLGYzdI1QuUx7yY=";
