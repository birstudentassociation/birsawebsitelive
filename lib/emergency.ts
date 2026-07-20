/**
 * Runtime emergency mode.
 *
 * A site-wide alert that can be switched on WITHOUT a rebuild or redeploy by
 * flipping a value in a Vercel Edge Config store. Reads happen at the edge on
 * every request (pages already render dynamically for the CSP nonce), so a
 * change in the Vercel dashboard is live within seconds.
 *
 * Edge Config only SELECTS which pre-prepared scenario is live; the scenario
 * content lives in `content/emergency/`. Edge Config item, keyed `emergency`:
 *   {
 *     "active": true,
 *     "scenario": "flooding",
 *     "messageOverride": { "en": "", "th": "" }
 *   }
 *
 * `scenario` must match a registered scenario id; an unknown or missing id
 * falls back to the `generic` scenario. `messageOverride` is optional per-
 * incident banner text (e.g. a specific building or time) that wins over the
 * scenario's default `bannerMessage` when present.
 */
import { get } from "@vercel/edge-config";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import {
  getScenario,
  type EmergencyScenario,
  type EmergencySeverity,
} from "@/content/emergency/scenarios";

const configSchema = z.object({
  active: z.boolean().default(false),
  scenario: z.string().optional(),
  messageOverride: z
    .object({ en: z.string().optional(), th: z.string().optional() })
    .optional(),
});

export type EmergencyState = {
  active: boolean;
  /** Always a valid scenario (falls back to `generic`). */
  scenario: EmergencyScenario;
  scenarioId: string;
  /** Locale-resolved banner message (override, else the scenario default). */
  message: string;
  severity: EmergencySeverity;
};

function offState(): EmergencyState {
  const scenario = getScenario("generic");
  return {
    active: false,
    scenario,
    scenarioId: scenario.id,
    message: "",
    severity: scenario.severity,
  };
}

/**
 * Read the current emergency state for a locale. Never throws: if Edge Config
 * is not provisioned (e.g. local dev) or the value is malformed, the site
 * behaves as though emergency mode is off rather than erroring the layout.
 */
export async function getEmergencyState(locale: Locale): Promise<EmergencyState> {
  try {
    const parsed = configSchema.safeParse(await get("emergency"));
    if (!parsed.success || !parsed.data.active) return offState();

    const scenario = getScenario(parsed.data.scenario);
    const override = parsed.data.messageOverride?.[locale]?.trim();
    const message = override || scenario[locale].bannerMessage;

    return {
      active: true,
      scenario,
      scenarioId: scenario.id,
      message,
      severity: scenario.severity,
    };
  } catch {
    return offState();
  }
}
