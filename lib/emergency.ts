/**
 * Runtime emergency mode.
 *
 * A site-wide alert that can be switched on WITHOUT a rebuild or redeploy by
 * flipping a value in a Vercel Edge Config store.
 *
 * The read is wrapped in `unstable_cache` (see `readEmergencyConfig`) so it does
 * NOT opt callers into dynamic rendering: the public pages stay static and
 * CDN-cached, and the emergency value refreshes in the background at most every
 * `REVALIDATE_SECONDS`. For an instant flip, call `revalidateTag(EMERGENCY_TAG)`
 * after changing the Edge Config value. The client banner (`EmergencyBanner
 * Client`) additionally polls `/api/emergency` so already-open tabs update
 * without a full navigation.
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
import { unstable_cache } from "next/cache";
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
  messageOverride: z.object({ en: z.string().optional(), th: z.string().optional() }).optional(),
});

type EmergencyConfig = z.infer<typeof configSchema>;

/** Cache tag for on-demand invalidation; also the background revalidation window. */
export const EMERGENCY_TAG = "emergency";
const REVALIDATE_SECONDS = 15;

/**
 * Cached read of the raw Edge Config value. `unstable_cache` means this never
 * forces dynamic rendering on its callers, so the site's pages can prerender.
 * Returns `null` when Edge Config is unprovisioned (local dev) or malformed.
 */
const readEmergencyConfig = unstable_cache(
  async (): Promise<EmergencyConfig | null> => {
    const parsed = configSchema.safeParse(await get("emergency"));
    return parsed.success ? parsed.data : null;
  },
  ["emergency-config"],
  { revalidate: REVALIDATE_SECONDS, tags: [EMERGENCY_TAG] }
);

export type EmergencyState = {
  active: boolean;
  /** Always a valid scenario (falls back to `generic`). */
  scenario: EmergencyScenario;
  scenarioId: string;
  /** Locale-resolved banner message (override, else the scenario default). */
  message: string;
  severity: EmergencySeverity;
};

/** The serialisable subset the banner needs: safe to send over the wire. */
export type EmergencyBannerData = {
  active: boolean;
  scenarioId: string;
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
 * is not provisioned or the value is malformed, the site behaves as though
 * emergency mode is off rather than erroring.
 */
export async function getEmergencyState(locale: Locale): Promise<EmergencyState> {
  try {
    const config = await readEmergencyConfig();
    if (!config || !config.active) return offState();

    const scenario = getScenario(config.scenario);
    const override = config.messageOverride?.[locale]?.trim();
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

/** Banner-shaped, wire-safe view of the current state for a locale. */
export async function getEmergencyBannerData(locale: Locale): Promise<EmergencyBannerData> {
  const state = await getEmergencyState(locale);
  return {
    active: state.active,
    scenarioId: state.scenarioId,
    message: state.message,
    severity: state.severity,
  };
}
