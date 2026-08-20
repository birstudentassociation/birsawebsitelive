/**
 * The in-code service definitions (REDESIGN-2.0 §5.2, §11.3 item 11).
 *
 * "In 2.0 [a service definition] is a document in the CMS, so an officer
 * creates a service the way they create a page" (`lib/services/defineService.ts`).
 * Wave 3 (the CMS integration) is blocked on a committee decision
 * (`docs/DECISIONS-2.0.md`), so until it lands, definitions are typed
 * TypeScript modules in this directory instead, each exporting one
 * `ServiceDefinition`. `lib/services/registry.ts` is the only file that reads
 * this directory; swapping the source to Sanity later is changing
 * `loadRawDefinitions` in that one file, not anything that touches a route or
 * a question page, which is the whole point of drawing the seam here rather
 * than letting every route import a definition module directly.
 *
 * `exampleChassisDemo` (`example-chassis-demo.ts`) is deliberately not a real
 * BIRSA service and cannot publish; read that file's header. `equipmentLoan`
 * (`equipment-loan.ts`, Wave 4B) is the first real one, migrated from
 * `app/[lang]/services/equipment-loan/**`, which stays in place and keeps
 * serving its own routes and tests unchanged (that migration is Wave 5, per
 * REDESIGN-2.0 §11.4). Do not invent a second real BIRSA service here; the
 * next one built on this chassis is lost and found (REDESIGN-2.0 §5.5),
 * assigned to Wave 4D and gated on `docs/DECISIONS-2.0.md` decision 11.
 */
import { exampleChassisDemo } from "@/lib/services/definitions/example-chassis-demo";
import { equipmentLoan } from "@/lib/services/definitions/equipment-loan";
import type { ServiceDefinition } from "@/lib/services/defineService";

export const rawServiceDefinitions: ServiceDefinition[] = [exampleChassisDemo, equipmentLoan];
