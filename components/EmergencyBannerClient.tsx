"use client";

import { useEffect, useState } from "react";
import EmergencyBanner from "@/components/EmergencyBanner";
import type { EmergencyBannerData } from "@/lib/emergency";
import { localeHref, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  cta: string;
  /**
   * Server-rendered state, baked into the static HTML so the banner is present
   * for no-JS visitors and shows immediately on first paint (no flash).
   */
  initial: EmergencyBannerData;
};

const POLL_INTERVAL_MS = 60_000;

/**
 * Emergency banner wrapper. Renders the server-provided `initial` state (so it
 * works with JavaScript disabled and hydrates without a flash), then refreshes
 * from the CDN-cached `/api/emergency` endpoint on mount, on a slow interval,
 * and whenever the tab is refocused, so a tab left open during an emergency
 * toggle picks up the change without a full navigation.
 */
export default function EmergencyBannerClient({ locale, cta, initial }: Props) {
  const [data, setData] = useState<EmergencyBannerData>(initial);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch(`/api/emergency?locale=${locale}`, {
          headers: { accept: "application/json" },
        });
        if (!res.ok) return;
        const next = (await res.json()) as EmergencyBannerData;
        if (!cancelled) setData(next);
      } catch {
        // Keep the last known state on any network/parse error.
      }
    }

    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [locale]);

  if (!data.active) return null;

  return (
    <EmergencyBanner
      href={localeHref(locale, `/emergency/${data.scenarioId}`)}
      message={data.message}
      cta={cta}
      severity={data.severity}
    />
  );
}
