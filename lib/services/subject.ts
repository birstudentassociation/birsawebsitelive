/**
 * Subject resolvers (gate 7, `docs/DECISIONS-2.0.md`, decided 2026-08-20).
 *
 * `ServiceDefinition.subject` (`lib/services/defineService.ts`) names a
 * SOURCE, a plain string id, because a definition is a CMS document in 2.0
 * and cannot reference a code module (that file's own header). This module
 * is where code claims that id, exactly the pattern
 * `lib/services/intake.ts`'s `registerSubmissionStore`/`getSubmissionStore`
 * already establishes for a service id: a definition names itself, code
 * registers against the name, and the two halves never need to know how the
 * other is implemented.
 *
 * A resolver turns a raw route segment (whatever a reader typed or a link
 * carried) into either a confirmed subject, with a name in both locales
 * ready to render, or nothing. "Nothing" covers three cases the chassis
 * cannot tell apart from a URL alone: the key never existed, it existed and
 * was retired, or the backing store is not configured. All three are the
 * same thing from a reader's side of the page, which `resolveSubject` treats
 * with a proper not-found rather than a crash, the same "degrade, never
 * crash" rule `lib/services/registry.ts` already applies to a definition
 * that fails to publish.
 *
 * `validateServiceDefinition` (`lib/services/defineService.ts`) reads
 * `isSubjectSourceRegistered` directly rather than taking it through its
 * `context` parameter, matching the exception that file's own header already
 * documents for the privacy register's retention trigger: a source with no
 * registered resolver is exactly the same class of problem as a retention
 * trigger with no implemented path (that file's rule 6), and the fix that
 * needs no signature change is a read, not a widened contract. Unlike the
 * register, which is frozen content, a resolver is a live, test-resettable
 * registration (`_resetSubjectResolversForTests`), the same shape
 * `intake.ts`'s own store registry already has.
 */
import type { LocalizedText } from "@/lib/services/defineService";

/**
 * What resolving a subject key produces. `ok: true` is enough to render a
 * page and to persist a submission: a canonical key (a resolver may
 * normalise casing or whitespace; `key` is what a submission should actually
 * carry) and a name in both locales, since `label` on the definition names
 * the KIND of thing ("item") and this names the ACTUAL one a reader chose
 * ("the tripod").
 */
export type SubjectResolution = { ok: true; key: string; name: LocalizedText } | { ok: false };

export type SubjectResolver = {
  resolve(key: string): Promise<SubjectResolution>;
};

const resolversBySource = new Map<string, SubjectResolver>();

/**
 * Claims `source` for `resolver`. Called once, at module load, by the file
 * that owns the backing catalogue (`lib/services/loanSubmissionStore.ts` for
 * the equipment loan's `"equipment-item"` source), mirroring
 * `registerSubmissionStore`'s own placement and its own reasoning: the
 * officer side of a subject (which catalogue, which rows) stays data, and
 * the resolution side stays code.
 */
export function registerSubjectResolver(source: string, resolver: SubjectResolver): void {
  resolversBySource.set(source, resolver);
}

/** Whether a definition's `subject.source` has a resolver registered at all. What `validateServiceDefinition` rule 9 checks before a subject-taking service can publish. */
export function isSubjectSourceRegistered(source: string): boolean {
  return resolversBySource.has(source);
}

/**
 * Resolves one subject key against a definition's own source. `{ ok: false }`
 * covers "this definition has no subject", "nothing is registered for its
 * source" (should not happen for anything the registry actually publishes,
 * rule 9 refuses it first, but this function does not assume the registry
 * ran) and "the resolver itself found nothing", all alike: none of them are
 * a case a route can do anything about except show a proper not-found.
 */
export async function resolveSubject(
  definition: { subject?: { source: string } },
  key: string
): Promise<SubjectResolution> {
  if (!definition.subject) return { ok: false };
  const trimmed = key.trim();
  if (!trimmed) return { ok: false };
  const resolver = resolversBySource.get(definition.subject.source);
  if (!resolver) return { ok: false };
  return resolver.resolve(trimmed);
}

/**
 * The draft, and confirmation-cookie, scope for a service and (when it has
 * one) its chosen subject. `lib/services/draft.ts` (frozen, not owned this
 * wave) keys its cookies by a single `serviceId` string; passing this
 * composite string as that argument, rather than widening that file's
 * signature, scopes a draft per service AND per subject without touching a
 * file outside this wave's owned path list. A service with no subject gets
 * back exactly its own id, so every existing draft cookie name is
 * unchanged.
 */
export function subjectDraftScope(serviceId: string, subject?: string): string {
  return subject ? `${serviceId}__${subject}` : serviceId;
}

/** Test-only: clears every registered resolver so one test's registration never leaks into another's. */
export function _resetSubjectResolversForTests(): void {
  resolversBySource.clear();
}
