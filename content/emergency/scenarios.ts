/**
 * Registry of pre-prepared emergency scenarios. Edge Config selects one of
 * these by id (see `lib/emergency.ts`); the content itself is authored and
 * reviewed here in the repo, never in Edge Config.
 *
 * To add a scenario: create `./scenarios/<id>.ts` (default-exporting an
 * `EmergencyScenario`) and register it in the `scenarios` map below.
 */
import type { EmergencyScenario } from "@/content/emergency/types";
import generic from "@/content/emergency/scenarios/generic";
import coup from "@/content/emergency/scenarios/coup";
import protests from "@/content/emergency/scenarios/protests";
import facultyClosure from "@/content/emergency/scenarios/faculty-closure";
import campusClosure from "@/content/emergency/scenarios/campus-closure";
import healthAdvisory from "@/content/emergency/scenarios/health-advisory";
import flooding from "@/content/emergency/scenarios/flooding";
import activeShooting from "@/content/emergency/scenarios/active-shooting";
import fire from "@/content/emergency/scenarios/fire";
import earthquake from "@/content/emergency/scenarios/earthquake";

export const scenarios: Record<string, EmergencyScenario> = {
  generic,
  coup,
  protests,
  "faculty-closure": facultyClosure,
  "campus-closure": campusClosure,
  "health-advisory": healthAdvisory,
  flooding,
  "active-shooting": activeShooting,
  fire,
  earthquake,
};

/** All registered scenario ids (drives static generation and validation). */
export const scenarioIds: string[] = Object.keys(scenarios);

/** True if `id` names a registered scenario. */
export function hasScenario(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(scenarios, id);
}

/**
 * Resolve a scenario by id, falling back to `generic` for a missing or unknown
 * id so callers always get a valid scenario (never a blank banner or a 404
 * during an incident).
 */
export function getScenario(id: string | undefined | null): EmergencyScenario {
  if (id) {
    const found = scenarios[id];
    if (found) return found;
  }
  return generic;
}

export type { EmergencyScenario, EmergencySeverity } from "@/content/emergency/types";
