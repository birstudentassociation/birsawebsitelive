"use client";

import { useEffect, useState } from "react";

import Icon from "@/components/bds/Icon";

/**
 * BIRSA Design System: `ThemeToggle` (REDESIGN-2.0 §3.5, §4.3, navigation
 * cluster).
 *
 * Site chrome. Respects the system setting until the reader chooses
 * otherwise (§4.3 usage rule).
 *
 * Carried over from 1.0's `components/ThemeToggle.tsx` unchanged in
 * behaviour, rebuilt on `Icon` so the sun/moon glyphs come from the shared
 * sprite instead of their own inline `<svg>`. Icon visibility is handled by
 * the `.theme-icon-sun` / `.theme-icon-moon` CSS in `app/globals.css`
 * (frozen, read here not written), so it is correct even before hydration;
 * `aria-pressed` and the accessible label are only computed once mounted,
 * since they depend on `matchMedia`/`localStorage`, which do not exist
 * during SSR.
 */
export type ThemeToggleProps = {
  /** `dict.a11y.theme`: neutral label shown before hydration/mount. */
  neutralLabel: string;
  /** `dict.a11y.themeDark`: shown when the resolved theme is light (pressed=false). */
  darkLabel: string;
  /** `dict.a11y.themeLight`: shown when the resolved theme is dark (pressed=true). */
  lightLabel: string;
  className?: string;
};

type Resolved = "dark" | "light";

function getResolvedTheme(): Resolved {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ neutralLabel, darkLabel, lightLabel, className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [resolved, setResolved] = useState<Resolved>("light");

  useEffect(() => {
    // The resolved theme comes from matchMedia/localStorage, which do not
    // exist during SSR. Reading them in render would produce markup that
    // disagrees with the server's, so this mount gate is what keeps
    // hydration consistent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      className={`focus-halo flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-input-border text-ink hover:bg-sunken ${className ?? ""}`}
    >
      <Icon name="sun" className="theme-icon-sun" />
      <Icon name="moon" className="theme-icon-moon" />
    </button>
  );
}
