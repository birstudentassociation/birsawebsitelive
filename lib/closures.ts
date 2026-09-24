/**
 * Switching a service off on purpose (holidays, stocktake, a broken inbox),
 * without a deploy. Read from the `closures` item in the same Vercel Edge
 * Config store as the emergency banner:
 *
 *   {
 *     "equipment-loan": { "closed": true, "reopens": "2026-10-12" },
 *     "contact": { "closed": false }
 *   }
 *
 * `reopens` is an optional ISO date. A closed service sends visitors to
 * `/[lang]/unavailable/[service]`, the GOV.UK "Service unavailable" pattern:
 * it says when the service will be back and what to do meanwhile. As with the
 * emergency banner, POST `/api/emergency/revalidate` makes a change instant;
 * otherwise it lands within the hour.
 *
 * Never throws: with Edge Config missing or malformed, every service is open.
 */
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { get } from "@vercel/edge-config";
import { z } from "zod";

export const SERVICES = {
  "equipment-loan": { start: "/services/equipment-loan" },
  contact: { start: "/contact" },
  "start-club": { start: "/clubs/start" },
  "your-data": { start: "/privacy/your-data" },
} as const;

export type ServiceId = keyof typeof SERVICES;

export function isServiceId(value: string): value is ServiceId {
  return Object.hasOwn(SERVICES, value);
}

const closureSchema = z.object({
  closed: z.boolean().default(false),
  reopens: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

const configSchema = z.record(z.string(), closureSchema);

export const CLOSURES_TAG = "closures";

const readClosures = unstable_cache(
  async () => {
    const parsed = configSchema.safeParse(await get("closures"));
    return parsed.success ? parsed.data : {};
  },
  ["closures-config"],
  { revalidate: 3600, tags: [CLOSURES_TAG] }
);

export type Closure = { closed: boolean; reopens?: string };

export async function getClosure(service: ServiceId): Promise<Closure> {
  try {
    const closures = await readClosures();
    const entry = closures[service];
    return entry?.closed ? { closed: true, reopens: entry.reopens } : { closed: false };
  } catch {
    return { closed: false };
  }
}

/**
 * Call from a journey's layout: sends the visitor to the unavailable page
 * while the service is switched off.
 */
export async function redirectIfClosed(service: ServiceId, lang: string): Promise<void> {
  const { closed } = await getClosure(service);
  if (closed) redirect(`/${lang}/unavailable/${service}`);
}
