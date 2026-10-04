/**
 * The live emergency alert. `null` means no alert.
 *
 * To raise one, set this to an object and deploy (a commit to master deploys
 * in about a minute). The banner appears on every page and the guide shows the
 * issue time and updates at the top. To add an update, put a new entry at the
 * start of `updates` and deploy again. To end the alert, set this back to
 * `null` and deploy. Step-by-step instructions are in `docs/EDITING.md`.
 *
 * Example:
 *
 *   export const activeEmergency: ActiveEmergency<ScenarioId> | null = {
 *     scenario: "flooding",
 *     issuedAt: "2026-10-12T07:30:00+07:00",
 *     banner: {
 *       en: "Roads around Tha Prachan are flooded. Classes today are online.",
 *       th: "ถนนรอบท่าพระจันทร์น้ำท่วม วันนี้เรียนออนไลน์",
 *     },
 *     updates: [
 *       {
 *         at: "2026-10-12T07:30:00+07:00",
 *         text: {
 *           en: "Prachan Road and Na Phra That Road are flooded. The faculty has moved today's classes online.",
 *           th: "ถนนพระจันทร์และถนนหน้าพระธาตุน้ำท่วม คณะให้เรียนออนไลน์ทุกวิชาในวันนี้",
 *         },
 *       },
 *     ],
 *   };
 */
import type { ActiveEmergency } from "@/content/emergency/types";
import type { ScenarioId } from "@/content/emergency/scenarios";

export const activeEmergency: ActiveEmergency<ScenarioId> | null = null;
