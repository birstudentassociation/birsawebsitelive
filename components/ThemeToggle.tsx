"use client";

import { useEffect, useState } from "react";

export type ThemeToggleProps = {
  /** dict.a11y.theme: neutral label shown before hydration/mount. */
  neutralLabel: string;
  /** dict.a11y.themeDark: shown when the resolved theme is light (pressed=false). */
  darkLabel: string;
  /** dict.a11y.themeLight: shown when the resolved theme is dark (pressed=true). */
  lightLabel: string;
};

type Resolved = "dark" | "light";

function getResolvedTheme(): Resolved {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Theme toggle button: cycles the resolved theme between light and dark.
 * When the chosen theme matches the OS preference, the explicit override is
 * cleared so the user goes back to auto-following the system. Icon
 * visibility is handled purely by CSS (`.theme-icon-sun` / `.theme-icon-moon`
 * in globals.css) so it's correct even before hydration; `aria-pressed` and
 * the accessible label are only computed once mounted, since they depend on
 * `matchMedia`/`localStorage` which aren't available during SSR.
 */
export default function ThemeToggle({ neutralLabel, darkLabel, lightLabel }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [resolved, setResolved] = useState<Resolved>("light");

  useEffect(() => {
    setResolved(getResolvedTheme());
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      // Only reflects the system change if the user has no explicit override.
      setResolved(getResolvedTheme());
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const handleClick = () => {
    const current = getResolvedTheme();
    const next: Resolved = current === "dark" ? "light" : "dark";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    try {
      if ((next === "dark") === systemDark) {
        localStorage.removeItem("birsa-theme");
        document.documentElement.removeAttribute("data-theme");
      } else {
        localStorage.setItem("birsa-theme", next);
        document.documentElement.setAttribute("data-theme", next);
      }
    } catch {
      // Storage may be unavailable (private mode, disabled cookies); still
      // reflect the choice for this page view via the DOM attribute.
      document.documentElement.setAttribute("data-theme", next);
    }

    setResolved(next);
  };

  const ariaLabel = mounted ? (resolved === "dark" ? lightLabel : darkLabel) : neutralLabel;
  const ariaPressed = mounted ? resolved === "dark" : undefined;

  return (
    <button
      type="button"
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      onClick={handleClick}
      className="focus-halo border-line-strong text-ink hover:bg-sunken flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="theme-icon-sun h-4.5 w-4.5 shrink-0">
        <circle cx="10" cy="10" r="4.25" fill="none" stroke="currentColor" strokeWidth={1.75} />
        <path
          d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.66 4.34l-1.42 1.42M5.76 14.24l-1.42 1.42M15.66 15.66l-1.42-1.42M5.76 5.76 4.34 4.34"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="theme-icon-moon h-4.5 w-4.5 shrink-0">
        <path
          d="M17.3 12.5A7.4 7.4 0 0 1 7.5 2.7a7.4 7.4 0 1 0 9.8 9.8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
