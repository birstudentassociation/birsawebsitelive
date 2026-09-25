/**
 * Emergency alerts, resolved at build time.
 *
 * The live alert is committed content in `content/emergency/active.ts`, so
 * raising, updating or ending one is a commit and a deploy. Nothing here reads
 * the network or the clock, which keeps every page fully static.
 */
import type { Locale } from "@/lib/i18n";
import { activeEmergency } from "@/content/emergency/active";
import { getScenario, type ScenarioId } from "@/content/emergency/scenarios";
import type { ActiveEmergency, EmergencyScenario } from "@/content/emergency/types";

export type LiveAlert = {
  alert: ActiveEmergency<ScenarioId>;
  scenario: EmergencyScenario;
};

/** The live alert and its guide, or null when there is none. */
export function getLiveAlert(
  active: ActiveEmergency<ScenarioId> | null = activeEmergency
): LiveAlert | null {
  if (!active) return null;
  return { alert: active, scenario: getScenario(active.scenario) };
}

/** Banner line for the live alert: the alert's own text, else the guide's default. */
export function alertBanner(live: LiveAlert, locale: Locale): string {
  return live.alert.banner?.[locale]?.trim() || live.scenario[locale].banner;
}

/** When the alert last changed: the newest update, else the issue time. */
export function alertUpdatedAt(alert: ActiveEmergency): string {
  return alert.updates?.[0]?.at ?? alert.issuedAt;
}

/** "25 September 2026, 14:05" / "25 กันยายน 2026 เวลา 14.05 น." in Bangkok time. */
export function formatAlertTime(locale: Locale, iso: string): string {
  const date = new Date(iso);
  const timeZone = "Asia/Bangkok";
  if (locale === "th") {
    const day = new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone,
    }).format(date);
    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    })
      .format(date)
      .replace(":", ".");
    return `${day} เวลา ${time} น.`;
  }
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
  return `${day}, ${time}`;
}
