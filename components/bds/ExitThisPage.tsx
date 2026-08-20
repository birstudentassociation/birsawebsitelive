"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";

/**
 * BIRSA Design System: `ExitThisPage` (REDESIGN-2.0 §4.4, §4.3b
 * `exit-this-page`, service cluster).
 *
 * THE HIGHEST PRIORITY COMPONENT IN THIS CLUSTER. GDS built the original for
 * domestic abuse services. `content/reporting.ts` promises BIRSA handles a
 * harassment report "with the utmost secrecy and care"; this component is
 * the difference between that being a sentence and being a property of the
 * page. A student reporting harassment may be doing it on a shared laptop,
 * a common-room computer, or with someone nearby watching the screen or
 * about to walk past it.
 *
 * PLACEMENT. Render this on EVERY welfare, reporting and rights page, once,
 * as a persistent control: it stays visible regardless of scroll position
 * (`position: fixed`), offset below the site's own sticky chrome via
 * `--bds-chrome-height` (`components/bds/tokens.css`) so it never sits
 * underneath the header. It is not part of the page's reading flow and does
 * not take a heading: place it as a sibling of the page's actual content,
 * anywhere in the tree, since it positions itself.
 *
 * WHAT "LEAVE" MEANS HERE, IN FULL:
 *
 *   1. NAVIGATE AWAY IMMEDIATELY. A click (or the keyboard shortcut) calls
 *      `window.location.replace(exitHref)` synchronously, no confirmation
 *      dialog, no debounce, nothing that gives a second person at the
 *      keyboard time to see what was on screen. `exitHref` is chosen by the
 *      PAGE that renders this component, never by this component: it must
 *      be a genuinely neutral destination unrelated to BIRSA or to the
 *      reason someone is leaving (GDS's own guidance uses things like a
 *      weather site or a search engine home page). Inventing that
 *      destination is a content decision outside this component's brief, so
 *      `exitHref` is required with no default.
 *
 *   2. POLLUTE BROWSER HISTORY. Before navigating, the click handler:
 *        a. `history.replaceState` overwrites THIS page's own entry with a
 *           same-origin, neutral URL (`historyDecoyHref`, default the site
 *           root), so the reporting or welfare page's URL no longer exists
 *           anywhere in session history once the reader leaves.
 *        b. `history.pushState` repeats that same neutral URL
 *           `decoyEntryCount` times (default 5), padding several more
 *           innocuous entries onto the stack ahead of the (now-overwritten)
 *           real one.
 *        c. Only then does `window.location.replace(exitHref)` run, which
 *           lands the browser's current entry on the external destination,
 *           directly on top of the decoy pile.
 *      The result: pressing Back from the external site steps through
 *      several neutral, identical-looking entries before it can reach
 *      anything that predates this visit, and the reporting page's own URL
 *      is gone from the visible history list entirely rather than one Back
 *      press away. `history.pushState`/`replaceState` only accept
 *      same-origin URLs (a cross-origin call throws `SecurityError`), which
 *      is why the decoy entries are same-origin and the actual escape to a
 *      neutral destination is a real navigation, not a history trick.
 *
 *      A NOTE FOR THE SECURITY REVIEW THIS COMPONENT IS FLAGGED FOR: the
 *      `exit-this-page.mjs` currently shipped in `alphagov/govuk-frontend`
 *      does NOT manipulate the History API. It navigates with
 *      `window.location.href` and hides the page behind a "Loading" overlay
 *      while the browser processes that navigation, relying on the browser
 *      itself to make Back land one press away from the sensitive page (not
 *      zero presses, and not hidden from a browser history LIST at all).
 *      This brief explicitly asked for history pollution in addition to
 *      that immediate navigation, which is the more defensive of the two
 *      designs, so that is what is implemented here. Both behaviours (2a
 *      and 2b above) are wrapped in a `try`/`catch`: if the History API
 *      throws for any reason (a browser restriction, a same-origin
 *      mismatch from a misconfigured `historyDecoyHref`), the failure is
 *      swallowed and the far more important step, actually leaving, still
 *      runs unconditionally on the next line.
 *
 *   3. KEYBOARD SHORTCUT. Pressing Shift three times in a row, alone (never
 *      combined with another key, and never as a modifier held while
 *      another key is pressed), within 5 seconds of the first press,
 *      triggers the same leave routine as a click. Any other key, or the
 *      5 second window elapsing, resets the count to zero. This matches
 *      GDS's own timing (`timeoutTime = 5000` in `exit-this-page.mjs`).
 *      Reachable with no pointer at all, which matters when reaching for a
 *      mouse is itself a delay someone cannot afford.
 *
 *   4. NO JAVASCRIPT. The control is a real `<a href={exitHref}>`, not a
 *      `<button>` wired to `onClick`. With scripting disabled, `onClick`
 *      never runs and the browser's default anchor behaviour takes over: a
 *      normal navigation to `exitHref`. There is no history pollution and
 *      no Shift shortcut in that case (both need a script to run), but the
 *      one property that must never depend on JavaScript, actually leaving
 *      the page, still holds. This is BUILD-BRIEF-2.0 §7's "everything
 *      works with JavaScript off, including ExitThisPage" satisfied by
 *      construction rather than by a `<noscript>` fallback bolted on.
 *
 * WHAT THIS COMPONENT DELIBERATELY DOES NOT DO: it does not clear
 * `localStorage`, cookies, or browser cache, and it does not close the tab.
 * Those are outside what a page can do to a browser it does not control,
 * and claiming otherwise in copy would be the kind of promise §9 forbids
 * ("never state a procedure BIRSA does not have").
 */

const SHIFT_PRESS_WINDOW_MS = 5000;
const DEFAULT_DECOY_ENTRY_COUNT = 5;
const DEFAULT_HISTORY_DECOY_HREF = "/";

export type ExitThisPageProps = {
  /**
   * Where leaving actually goes. Required, no default: this is a content
   * and safety decision for the page that renders `ExitThisPage`, never for
   * this component to invent. Must be a genuinely neutral site unrelated to
   * BIRSA or to why the reader is leaving.
   */
  exitHref: string;
  /**
   * Same-origin path used to overwrite and pad browser history before the
   * real navigation. Must be same-origin (the History API throws otherwise).
   * Defaults to the site root. Pass a locale-correct path
   * (`localeHref(locale, "/")`) from the calling page when locale matters.
   */
  historyDecoyHref?: string;
  /** How many decoy history entries to push ahead of the replaced one. */
  decoyEntryCount?: number;
  /** Visible button text, e.g. "Leave this page now". */
  label: string;
  /**
   * Visually hidden text explaining the Shift-three-times shortcut, read by
   * assistive technology. Sighted readers are not expected to discover a
   * keyboard shortcut from on-screen text alone; a text explanation this
   * prominent would also defeat the point of a page that needs to look
   * unremarkable, so this stays screen-reader-only rather than becoming
   * visible copy.
   */
  shortcutHint: string;
  /** Announced via `role="status"` at the moment leaving begins. */
  leavingAnnouncement: string;
  className?: string;
};

function pollutHistoryAndLeave(exitHref: string, historyDecoyHref: string, decoyEntryCount: number) {
  try {
    if (typeof window !== "undefined" && window.history) {
      // 2a: overwrite THIS page's own entry so it stops existing in history.
      window.history.replaceState(null, "", historyDecoyHref);
      // 2b: pad several more neutral entries ahead of it.
      for (let i = 0; i < decoyEntryCount; i += 1) {
        window.history.pushState(null, "", historyDecoyHref);
      }
    }
  } catch {
    // Never let a history-hardening failure block the far more important
    // thing: leaving the page. See the file-level TSDoc, point 2.
  }
  // 2c / 1: the real navigation, always, even if the block above threw.
  window.location.replace(exitHref);
}

export default function ExitThisPage({
  exitHref,
  historyDecoyHref = DEFAULT_HISTORY_DECOY_HREF,
  decoyEntryCount = DEFAULT_DECOY_ENTRY_COUNT,
  label,
  shortcutHint,
  leavingAnnouncement,
  className,
}: ExitThisPageProps) {
  const [leaving, setLeaving] = useState(false);
  const keypressCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const leave = useCallback(() => {
    setLeaving(true);
    pollutHistoryAndLeave(exitHref, historyDecoyHref, decoyEntryCount);
  }, [exitHref, historyDecoyHref, decoyEntryCount]);

  useEffect(() => {
    function clearResetTimer() {
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const shiftAlone = event.key === "Shift" && !event.ctrlKey && !event.altKey && !event.metaKey;

      if (!shiftAlone) {
        // Any other key, or Shift used as a modifier with another key,
        // breaks the sequence (matches govuk-frontend's own behaviour).
        keypressCountRef.current = 0;
        clearResetTimer();
        return;
      }

      keypressCountRef.current += 1;
      clearResetTimer();

      if (keypressCountRef.current >= 3) {
        keypressCountRef.current = 0;
        leave();
        return;
      }

      resetTimerRef.current = setTimeout(() => {
        keypressCountRef.current = 0;
      }, SHIFT_PRESS_WINDOW_MS);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearResetTimer();
    };
  }, [leave]);

  return (
    <>
      <div
        className={clsx("fixed right-4 z-50", className)}
        style={{ top: "calc(var(--bds-chrome-height, 0px) + 0.75rem)" }}
      >
        <a
          href={exitHref}
          onClick={(event) => {
            // Enhanced path. Without JS this handler never attaches and the
            // browser follows `href` on its own (file TSDoc, point 4).
            event.preventDefault();
            leave();
          }}
          className="focus-halo inline-flex h-11 min-w-11 items-center gap-2 rounded-lg bg-ink px-4 text-white shadow-lg hover:opacity-90"
        >
          <Icon name="close" />
          <Text as="span" step="body" className="font-semibold">
            {label}
          </Text>
        </a>
        <Text as="p" step="body-sm" className="sr-only">
          {shortcutHint}
        </Text>
      </div>
      <div role="status" className="sr-only">
        {leaving ? leavingAnnouncement : null}
      </div>
    </>
  );
}
