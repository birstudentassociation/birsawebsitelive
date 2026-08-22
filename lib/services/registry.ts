/**
 * The service registry (REDESIGN-2.0 §5.2).
 *
 * Loads every service definition, validates each one against
 * `validateServiceDefinition` (`lib/services/defineService.ts`), and serves
 * only the ones that pass. This is where §5.1 item 10's promise actually
 * becomes enforcement rather than a rule someone has to remember: a
 * definition that collects personal data with no privacy register entry does
 * not fail loudly and take the site down, and it does not quietly publish
 * either. It is dropped, here, once, and every route under `app/[lang]/do/`
 * asks this module whether a service exists rather than importing a
 * definition module directly, so there is exactly one place a bad definition
 * can be caught.
 *
 * THE ONE-FUNCTION SEAM. `loadRawDefinitions()` below is the only place this
 * file knows definitions currently live in
 * `lib/services/definitions/index.ts`. REDESIGN-2.0 §5.2 says definitions are
 * a CMS document in 2.0; Wave 3 (the CMS integration) is blocked on a
 * committee decision, so for now they are typed modules instead
 * (`lib/services/definitions/index.ts`'s own header). When Wave 3 unblocks,
 * swapping the source to Sanity is rewriting the body of this one function
 * (most likely to an async fetch against the Content Lake, cached and
 * revalidated by webhook per REDESIGN-2.0 §6.9) rather than anything in
 * `validateServiceDefinition`, the routes under `app/[lang]/do/`, or any
 * other file that calls this registry. Everything below `loadRawDefinitions`
 * stays the same shape either way, which is deliberate.
 *
 * DEGRADE, NEVER CRASH. Matches the site's existing house rule (used
 * throughout `lib/inventory/*`): a service that fails validation reports
 * itself as unavailable at `/do/<id>` (REDESIGN-2.0 §5.2's own words, "a
 * half-built service reports itself as unavailable rather than taking the
 * site down") rather than throwing during a page render. `getServiceProblems`
 * exists so a future officer-facing surface (the Studio's publish flow, or a
 * console diagnostics page) can show WHY a service did not load, which
 * matters more once the person publishing is an officer rather than a
 * developer (this file's own inspiration, `defineService.ts`'s header).
 */
import { activities } from "@/content/privacy/register";
import {
  validateServiceDefinition,
  type ServiceDefinition,
  type ServiceProblem,
} from "@/lib/services/defineService";
import { rawServiceDefinitions } from "@/lib/services/definitions";

/**
 * Activity ids `lib/privacy/retention.ts` (read-only to this wave) actually
 * deletes on a schedule. Derived by reading that file rather than computed
 * from it at runtime, because the module has no exported manifest of which
 * activities it covers, only SQL against specific tables:
 *
 *   - `equipment-loan`: the `loans` table, purged by `closed_at` once a loan
 *     reaches a terminal status (`selectExpiredLoanIds`).
 *   - `borrower-record`: the `borrowers` table, purged by `updated_at` once
 *     no loan references the row any more (`selectDeletableBorrowerIds`).
 *   - `audit-log`: the `audit_log` table, purged by `created_at`.
 *   - `feedback`: the `satisfaction_feedback` table, purged by `created_at`.
 *   - `officer-account`: `officers` rows, anonymised (never deleted, see that
 *     file's own header on why) by `last_login_at` or `created_at`
 *     (`selectOfficersToAnonymise`).
 *
 * `contact-message`, `club-proposal`, `loan-status` and `rights-request` are
 * NOT here: their register `storage` is `"email"` or `"none"`, and
 * `retention.ts` only ever queries Postgres, so nothing in code currently
 * enforces a deletion for them. `rate-limiting` is `"memory"` and expires on
 * its own; it is also not a chassis-relevant activity (it is not something a
 * service definition could ever reference). If `retention.ts` gains a new
 * purge step, add its activity id here in the same commit, or the registry
 * will keep refusing a service that the code has actually caught up to.
 *
 * THIS IS WHY THE ONE EXAMPLE DEFINITION CANNOT PUBLISH: no existing
 * register activity both belongs on this list and honestly describes a
 * generic chassis submission. See
 * `lib/services/definitions/example-chassis-demo.ts` and the Wave 4A report.
 */
export const IMPLEMENTED_RETENTION_ACTIVITY_IDS: readonly string[] = [
  "equipment-loan",
  "borrower-record",
  "audit-log",
  "feedback",
  "officer-account",
];

/**
 * Service ids a developer has allowlisted as sensitive (§5.4, §6.12). Not
 * officer-editable: `validateServiceDefinition` rejects any definition whose
 * own `sensitive` field disagrees with this list, in either direction. Empty
 * because no chassis-built service exists yet that qualifies; §5.4 is
 * explicit that the welfare service is built last, by a human reviewer, and
 * only if its hardening requirements can actually be met. Do not add an id
 * here speculatively.
 */
export const SENSITIVE_SERVICE_IDS: readonly string[] = [];

/**
 * The one place this file reads where definitions currently come from. See
 * the file header's "ONE-FUNCTION SEAM" note.
 */
function loadRawDefinitions(): ServiceDefinition[] {
  return rawServiceDefinitions;
}

export type ServiceValidationOutcome =
  | { ok: true; definition: ServiceDefinition }
  | { ok: false; id: string; problems: ServiceProblem[] };

/**
 * Validates one definition against the registry's own context (the real
 * privacy register, the real implemented-retention list, the real sensitive
 * allowlist). Exported separately from the loaded registry below so a future
 * Studio publish flow (REDESIGN-2.0 §6.5) can call the exact same check
 * before writing a document, per `defineService.ts`'s own promise that "the
 * two cannot disagree."
 */
export function validateForRegistry(definition: ServiceDefinition): ServiceValidationOutcome {
  const problems = validateServiceDefinition(definition, {
    knownPrivacyActivityIds: activities.map((activity) => activity.id),
    implementedRetentionActivityIds: IMPLEMENTED_RETENTION_ACTIVITY_IDS,
    registerRetentionTriggers: Object.fromEntries(
      activities.map((activity) => [activity.id, activity.retentionTrigger])
    ),
    sensitiveServiceIds: SENSITIVE_SERVICE_IDS,
  });
  if (problems.length > 0) {
    return { ok: false, id: definition.id, problems };
  }
  return { ok: true, definition };
}

type LoadedRegistry = {
  /** Valid definitions, keyed by id. Only these are ever served. */
  published: Map<string, ServiceDefinition>;
  /** Every outcome, valid and invalid, in load order. For diagnostics. */
  outcomes: ServiceValidationOutcome[];
};

let cached: LoadedRegistry | null = null;

function loadRegistry(): LoadedRegistry {
  if (cached) return cached;

  const outcomes = loadRawDefinitions().map(validateForRegistry);
  const published = new Map<string, ServiceDefinition>();
  for (const outcome of outcomes) {
    if (outcome.ok) {
      published.set(outcome.definition.id, outcome.definition);
    } else {
      // Matches the site's existing "degrade, never crash" convention
      // (`lib/inventory/*`): a bad definition is reported, not thrown, so one
      // half-built service never takes the rest of `/do` down with it.
      console.error(
        `[service registry] "${outcome.id}" failed validation and will not be served:`,
        outcome.problems.map((p) => `${p.field}: ${p.message.en}`).join("; ")
      );
    }
  }

  cached = { published, outcomes };
  return cached;
}

/**
 * Test-only escape hatch: forces the next call to any function in this
 * module to reload and revalidate from `loadRawDefinitions()`. Production
 * code never calls this; the registry is loaded once and reused, the same
 * caching `lib/inventory/*` and the content loaders already rely on.
 */
export function _resetRegistryForTests(): void {
  cached = null;
}

/** One published (valid) service definition by id, or `undefined` if it does not exist or failed validation. Routes under `app/[lang]/do/` use this, never a direct import from `lib/services/definitions/`. */
export function getService(id: string): ServiceDefinition | undefined {
  return loadRegistry().published.get(id);
}

/** Every published (valid) service definition, in the order `lib/services/definitions/index.ts` lists them. For the `/do` index (Wave 5A) and any future service directory. */
export function listServices(): ServiceDefinition[] {
  return [...loadRegistry().published.values()];
}

/** Every load-time outcome, valid and invalid, for a diagnostics or Studio surface. Never rendered to a student. */
export function getRegistryOutcomes(): ServiceValidationOutcome[] {
  return loadRegistry().outcomes;
}
