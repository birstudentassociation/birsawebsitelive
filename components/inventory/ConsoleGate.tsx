"use client";

/**
 * Client-side log-out control for the inventory console chrome. Deletes the
 * per-officer session cookie via the API, then reloads so every server
 * component in the tree (layout + page) re-reads the now-cleared cookie.
 *
 * Auth gating itself is done server-side, inline in each console page via
 * `getSessionOfficer()` — this component only handles ending a session.
 */
import { useState } from "react";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";

export type LogoutButtonProps = {
  locale: Locale;
  className?: string;
};

const copy: Record<Locale, { logout: string; loggingOut: string }> = {
  en: { logout: "Log out", loggingOut: "Logging out..." },
  th: { logout: "ออกจากระบบ", loggingOut: "กำลังออกจากระบบ..." },
};

export function LogoutButton({ locale, className }: LogoutButtonProps) {
  const t = copy[locale];
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/officer/session", { method: "DELETE" });
    } catch {
      // Ignore: reloading still lands back at the login screen if the
      // cookie is stale or the request failed.
    } finally {
      window.location.reload();
    }
  }

  return (
    <Button variant="secondary" onClick={handleLogout} disabled={loggingOut} className={className}>
      {loggingOut ? t.loggingOut : t.logout}
    </Button>
  );
}
