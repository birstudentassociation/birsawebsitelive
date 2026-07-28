/**
 * The inline dark-mode bootstrap that runs before first paint in the root
 * layout. It reads the visitor's explicit theme choice from localStorage and
 * sets `data-theme` so there is no flash of the wrong theme; system-preference
 * users need no JS at all (handled by the CSS media-query scope).
 *
 * It then keeps watching `data-theme` for the rest of the page's life, because
 * React can silently take the attribute back off again. React 19 treats
 * `<html>`, `<head>` and `<body>` as "singletons": whenever it has to client-
 * render the root instead of hydrating it (any hydration mismatch outside a
 * Suspense boundary, an error thrown during hydration, or a browser extension
 * that touches the DOM before React gets to it), it re-acquires the existing
 * `<html>` node by stripping EVERY attribute off it and then re-applying only
 * the props it knows about. `data-theme` is not one of those props, so it is
 * dropped and the page snaps back to the OS colour scheme even though the
 * visitor's choice is still sitting in localStorage. `suppressHydrationWarning`
 * silences the warning about the attribute but does not stop the strip.
 *
 * That is what made the theme look like it flipped at random when moving
 * between pages: it only happened on the loads where hydration happened to bail
 * out. The MutationObserver below re-applies the stored choice the moment the
 * attribute goes missing, which runs in the same microtask checkpoint as the
 * React commit that removed it, so nothing wrong is ever painted. It only ever
 * restores a stored value and never removes the attribute, so the toggle
 * clearing the override (and the storage-unavailable fallback in
 * `ThemeToggle.tsx`, which sets the attribute without writing storage) still
 * behave as written.
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
export const THEME_SCRIPT = `(function () {
  var d = document.documentElement;
  function apply() {
    try {
      var t = localStorage.getItem("birsa-theme");
      if ((t === "dark" || t === "light") && d.getAttribute("data-theme") !== t) {
        d.setAttribute("data-theme", t);
      }
    } catch (e) {}
  }
  apply();
  try {
    new MutationObserver(apply).observe(d, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  } catch (e) {}
})();`;

/**
 * Base64 SHA-256 of THEME_SCRIPT's exact bytes, formatted as a CSP source
 * expression. Add this to `script-src` wherever the script is not nonce'd.
 */
export const THEME_SCRIPT_HASH = "sha256-kkiRMltaJwF20T9kzHe/MlCByS9x7NgfnGpmuvRe9VI=";
