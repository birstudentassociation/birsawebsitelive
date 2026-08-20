/**
 * Status lookup (REDESIGN-2.0 §5.1 item 5).
 *
 * "WHAT THIS REPLACES: BIRSA refuses student accounts outright... A reference
 * number PLUS ONE CORROBORATING DETAIL... is enough to check a request's
 * status without ever creating a login" (`components/bds/StatusLookup.tsx`'s
 * own header, which this module is the server-side half of). NO ACCOUNTS,
 * EVER: there is no session, no password, and no "remember me" anywhere in
 * this file, and there never should be.
 *
 * BOTH FIELDS ARE REQUIRED, ALWAYS, RE-CHECKED SERVER-SIDE. The `<input>`s in
 * `StatusLookup` carry `required` so a plain HTML submit cannot even reach
 * the server missing either one, but that is a courtesy to the reader, not
 * the security boundary (that component's own TSDoc says so explicitly), so
 * `lookupSubmission` below re-checks both are non-empty before doing
 * anything else, exactly as if the request had arrived with `required`
 * stripped out by a browser's dev tools.
 *
 * THE CORROBORATING DETAIL IS THE SERVICE'S OWN EMAIL QUESTION. Every
 * publishable definition has exactly one (`defineService.ts` rule 4), so it
 * is always available and it is always something only the person who
 * submitted the request (and BIRSA) would know, which is what makes it a
 * corroborating detail rather than a second copy of the reference. Matched
 * case-insensitively, mirroring `lib/inventory/loans.ts`'s
 * `getLoanByReferenceAndEmail` ("Case-insensitive email match with an exact
 * reference, for student self-service lookup").
 *
 * A MISS AND AN INVALID REFERENCE LOOK THE SAME ON PURPOSE. Returning a
 * different result for "no such reference" versus "reference exists but the
 * detail is wrong" would let someone enumerate valid references by guessing;
 * `getLoanByReferenceAndEmail`'s own equivalent does the same by construction
 * (one query, no separate existence check), and this module keeps that
 * property explicitly rather than relying on it falling out of the
 * implementation by accident.
 */
import type { ServiceDefinition } from "@/lib/services/defineService";
import { emailQuestion, type Submission, type SubmissionStore } from "@/lib/services/intake";

export type StatusLookupOutcome =
  { ok: true; submission: Submission } | { ok: false; reason: "invalid" | "not-found" };

/**
 * Looks up a submission by reference and corroborating detail. `reference`
 * and `detail` are both required and re-validated here regardless of what
 * the form already enforced (see the file header). Returns `not-found` for
 * every failure past that point, including a reference that does not exist
 * at all, a reference for a different service, and a reference that exists
 * with the wrong detail: all three read the same to the caller so none of
 * them can be used to enumerate valid references.
 */
export async function lookupSubmission(
  store: SubmissionStore,
  definition: ServiceDefinition,
  reference: string,
  detail: string
): Promise<StatusLookupOutcome> {
  const trimmedReference = reference.trim();
  const trimmedDetail = detail.trim();
  if (!trimmedReference || !trimmedDetail) {
    return { ok: false, reason: "invalid" };
  }

  const question = emailQuestion(definition);
  if (!question) {
    // Unreachable for a definition the registry actually serves (rule 4
    // guarantees exactly one email question), but this function's contract
    // does not depend on the registry, so it stays a clean miss rather than
    // a throw if it is ever called against something that slipped past
    // validation.
    return { ok: false, reason: "not-found" };
  }

  const submission = await store.findByReference(definition.id, trimmedReference);
  if (!submission) {
    return { ok: false, reason: "not-found" };
  }

  const storedDetail = submission.answers[question.id];
  const storedValue = Array.isArray(storedDetail) ? "" : (storedDetail ?? "");
  if (storedValue.trim().toLowerCase() !== trimmedDetail.toLowerCase()) {
    return { ok: false, reason: "not-found" };
  }

  return { ok: true, submission };
}
