/**
 * Runtime emergency mode.
 *
 * A site-wide alert that can be switched on WITHOUT a rebuild or redeploy by
 * flipping a value in a Vercel Edge Config store. Reads happen at the edge on
 * every request (pages already render dynamically for the CSP nonce), so a
 * change in the Vercel dashboard is live within seconds.
 *
 * Edge Config item, keyed `emergency`:
 *   {
 *     "active": true,
 *     "en": "Optional English override message.",
 *     "th": "Optional Thai override message."
 *   }
 *
 * When `active` is true the banner shows. A locale message from Edge Config is
 * used if present; otherwise the component falls back to the dictionary default
 * so translations still live with the rest of the site content.
 */
import { get } from "@vercel/edge-config";
import type { Locale } from "@/lib/i18n";

export type EmergencyNotice = {
  active: boolean;
  /** Per-incident override text from Edge Config, if the editor supplied one. */
  message?: string;
};

type EmergencyConfig = {
  active?: boolean;
  en?: string;
  th?: string;
};

/**
 * Read the current emergency state for a locale. Never throws: if Edge Config
 * is not provisioned (e.g. local dev, or before setup) the site behaves as
 * though emergency mode is off rather than erroring the whole layout.
 */
export async function getEmergencyNotice(locale: Locale): Promise<EmergencyNotice> {
  try {
    const config = await get<EmergencyConfig>("emergency");
    if (!config?.active) return { active: false };
    const message = config[locale]?.trim();
    return { active: true, message: message || undefined };
  } catch {
    return { active: false };
  }
}
