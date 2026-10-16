"use client";

import { useEffect, useRef, useState } from "react";

export type ScrollToTopProps = {
  /** dict.actions.backToTop */
  label: string;
};

const SHOW_AFTER_PX = 400;

/** Floating bottom-right button that scrolls to the top; hidden until the visitor scrolls down. */
export default function ScrollToTop({ label }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Watches a sentinel instead of reading `window.scrollY`. Reading scroll
  // geometry right after hydration forces a synchronous layout (a Lighthouse
  // forced reflow); IntersectionObserver entries arrive after the browser's own
  // layout pass, so they never force one.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 h-px w-px"
        style={{ top: SHOW_AFTER_PX }}
      />
      <button
        type="button"
        aria-label={label}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        onClick={handleClick}
        className={`focus-halo fixed right-5 bottom-5 z-50 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-cream text-ink shadow-lg transition-opacity duration-200 hover:bg-sunken ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4.5 w-4.5 shrink-0">
          <path
            d="M10 15V5M5 9.5 10 5l5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
