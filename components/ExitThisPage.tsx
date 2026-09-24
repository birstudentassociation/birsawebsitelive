"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Where "Exit this page" goes: a neutral page that shows nothing personal.
 * The Thai Meteorological Department's home page plays the part GOV.UK gives
 * BBC Weather.
 */
export const EXIT_URL = "https://www.tmd.go.th/";

const copy = {
  en: {
    label: "Exit this page",
    pressTwo: "Shift, press 2 more times to exit.",
    pressOne: "Shift, press 1 more time to exit.",
    loading: "Loading.",
    overlay: "Loading",
  },
  th: {
    label: "ออกจากหน้านี้",
    pressTwo: "กด Shift อีก 2 ครั้งเพื่อออก",
    pressOne: "กด Shift อีก 1 ครั้งเพื่อออก",
    loading: "กำลังโหลด",
    overlay: "กำลังโหลด",
  },
} satisfies Record<Locale, unknown>;

const PRESSES = 3;
const WINDOW_MS = 5000;

/**
 * GOV.UK "Exit this page", in BIRSA's colours, for pages about harassment,
 * abuse and welfare, where being seen reading the page can put someone at
 * risk. It sits at the top of the main content and stays in view while
 * scrolling. Activating it, or pressing Shift three times within five
 * seconds, blanks the screen at once and replaces this page with a neutral
 * one, so the back button does not return here.
 *
 * Without JavaScript it is a plain link to the neutral page. It does not
 * clear browser history; /staying-safe-online explains what does.
 *
 * It is the first thing in `<main>`, so the skip link followed by one Tab
 * reaches it. That stands in for GOV.UK's secondary skip link, which would
 * need a slot in the site layout on every page.
 */
export default function ExitThisPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [exiting, setExiting] = useState(false);
  const [presses, setPresses] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const timesRef = useRef<number[]>([]);

  function exit() {
    setExiting(true);
    setAnnouncement(t.loading);
    window.location.replace(EXIT_URL);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Shift" || event.repeat) return;
      const now = Date.now();
      const recent = [...timesRef.current.filter((time) => now - time < WINDOW_MS), now];
      timesRef.current = recent;
      setPresses(recent.length);
      if (recent.length >= PRESSES) {
        timesRef.current = [];
        exit();
      } else {
        setAnnouncement(recent.length === 1 ? t.pressTwo : t.pressOne);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // `exit` only reads the locale's copy, which `t` already tracks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  useEffect(() => {
    if (presses === 0 || presses >= PRESSES) return;
    const timer = window.setTimeout(() => {
      timesRef.current = [];
      setPresses(0);
      setAnnouncement("");
    }, WINDOW_MS);
    return () => window.clearTimeout(timer);
  }, [presses]);

  return (
    <>
      <div className="wrap sticky top-2 z-30 flex justify-end pt-3 [@media(min-height:32rem)]:top-[7.5rem]">
        <div className="flex flex-col items-end gap-1">
          <a
            href={EXIT_URL}
            rel="nofollow noreferrer"
            onClick={(event) => {
              event.preventDefault();
              exit();
            }}
            className="focus-halo inline-flex h-11 items-center rounded-lg bg-brand-strong px-5 font-semibold text-white shadow-md hover:opacity-90"
          >
            {t.label}
          </a>
          <span aria-hidden="true" className="flex gap-1.5" data-testid="exit-progress">
            {Array.from({ length: PRESSES }, (_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${index < presses ? "bg-brand-strong" : "bg-line-strong"}`}
              />
            ))}
          </span>
          <span className="sr-only" role="status">
            {announcement}
          </span>
        </div>
      </div>
      {exiting ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cream text-ink">
          <p aria-hidden="true">{t.overlay}</p>
        </div>
      ) : null}
    </>
  );
}
