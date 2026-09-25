/**
 * Registry of emergency guides. `content/emergency/active.ts` names one of
 * these by id to raise a site-wide alert.
 *
 * To add a guide, create `./scenarios/<id>.ts` default-exporting an
 * `EmergencyScenario` and add it below. The key must equal the guide's `id`;
 * `tests/unit/emergency.test.ts` checks that and the rest of the shape.
 */
import type { EmergencyScenario, ScenarioGroup } from "@/content/emergency/types";
import fire from "@/content/emergency/scenarios/fire";
import earthquake from "@/content/emergency/scenarios/earthquake";
import activeShooting from "@/content/emergency/scenarios/active-shooting";
import flooding from "@/content/emergency/scenarios/flooding";
import airPollution from "@/content/emergency/scenarios/air-pollution";
import healthAdvisory from "@/content/emergency/scenarios/health-advisory";
import facultyClosure from "@/content/emergency/scenarios/faculty-closure";
import campusClosure from "@/content/emergency/scenarios/campus-closure";
import protests from "@/content/emergency/scenarios/protests";
import coup from "@/content/emergency/scenarios/coup";
import generic from "@/content/emergency/scenarios/generic";

export const scenarios = {
  fire,
  earthquake,
  "active-shooting": activeShooting,
  flooding,
  "air-pollution": airPollution,
  "health-advisory": healthAdvisory,
  "faculty-closure": facultyClosure,
  "campus-closure": campusClosure,
  protests,
  coup,
  generic,
} satisfies Record<string, EmergencyScenario>;

export type ScenarioId = keyof typeof scenarios;

/** All registered ids, in display order (drives static generation). */
export const scenarioIds = Object.keys(scenarios) as ScenarioId[];

/** Index page groups, in display order. */
export const scenarioGroups: ScenarioGroup[] = ["life", "hazard", "disruption", "unrest", "other"];

export function hasScenario(id: string): id is ScenarioId {
  return Object.prototype.hasOwnProperty.call(scenarios, id);
}

export function getScenario(id: ScenarioId): EmergencyScenario {
  return scenarios[id];
}

export type { EmergencyScenario, EmergencySeverity } from "@/content/emergency/types";
