"use server";

import { headers } from "next/headers";
import { checkRateLimit, refundRateLimit } from "@/app/api/_lib/guard";
import { DEMAND_FIELDS, validateDemand } from "@/lib/elective-demand/payload";
import { insertDemand, isElectiveDemandConfigured } from "@/lib/elective-demand/store";

/** The rate limit scope for sending electives, separate from every other form's. */
const DEMAND_RATE_LIMIT_SCOPE = "elective-demand";

/**
 * How many submissions one network address may make in the limiter's ten
 * minute window. Higher than the default of five because a campus network
 * shares an address between many students and registration week is when they
 * all send at once. It is in-memory and per server instance, so it only
 * slows a flood: see `DEMAND_THRESHOLD` for why the published figure is a
 * band and not a count.
 */
const DEMAND_RATE_LIMIT_MAX = 10;

/**
 * Result of sending electives, driving what the plan screen shows next:
 * - `shared`: stored; the form is replaced by a thank-you
 * - `not-agreed`: the box was not ticked, nothing was stored
 * - `invalid`: something in the form was not a course in the curriculum or
 *   not a real term; nothing was stored
 * - `rate-limited`: too many submissions from this network just now
 * - `not-configured`: the database isn't connected, so nothing was stored
 * - `error`: the insert failed
 */
export type DemandFormState =
  | { status: "idle" }
  | { status: "shared" }
  | { status: "not-agreed" }
  | { status: "invalid" }
  | { status: "rate-limited" }
  | { status: "not-configured" }
  | { status: "error" };

function ipFromHeaders(h: Headers): string {
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * Server action for the "share my planned electives" form on the plan screen.
 * Runs on a normal form POST without JavaScript, and `useActionState` in
 * components/study-plan/ElectiveDemandForm.tsx layers the inline result on top.
 *
 * The form carries three things: the curriculum version id, the list of course
 * and term pairs, and the tick. It does not carry the plan, so the request has
 * no cohort, minor or passed courses in it to leave out. Everything is
 * re-validated against the curriculum before anything is stored
 * (`validateDemand`), and the only part of the request kept is the validated
 * payload. The network address is read for the rate limiter, which holds it in
 * memory for ten minutes, and goes no further.
 */
export async function submitElectiveDemand(
  _prev: DemandFormState,
  formData: FormData
): Promise<DemandFormState> {
  const h = await headers();
  const ip = ipFromHeaders(h);
  if (!checkRateLimit(ip, DEMAND_RATE_LIMIT_SCOPE, DEMAND_RATE_LIMIT_MAX)) {
    return { status: "rate-limited" };
  }

  // Honeypot filled: report success and store nothing, never reveal detection.
  if (String(formData.get(DEMAND_FIELDS.honeypot) ?? "")) {
    return { status: "shared" };
  }

  const result = validateDemand({
    versionId: String(formData.get(DEMAND_FIELDS.version) ?? ""),
    entries: String(formData.get(DEMAND_FIELDS.entries) ?? ""),
    agreed: formData.get(DEMAND_FIELDS.agree) === "yes",
    honeypot: "",
  });
  if (!result.ok) {
    // A mistake in the form is not an attempt to flood it, so it does not
    // count against the network's budget.
    refundRateLimit(ip, DEMAND_RATE_LIMIT_SCOPE);
    return { status: result.reason };
  }

  if (!isElectiveDemandConfigured()) {
    refundRateLimit(ip, DEMAND_RATE_LIMIT_SCOPE);
    return { status: "not-configured" };
  }

  const saved = await insertDemand(result.data);
  return saved ? { status: "shared" } : { status: "error" };
}
