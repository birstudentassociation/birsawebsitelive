/**
 * Who may use the course review moderation console, and the elective demand
 * page and export beside it, which are Academic Affairs' too.
 *
 * Admins and the Academic Affairs role, and only BIRSA-wide ones: a club's
 * officers are scoped to that club's equipment, and course reviews belong to
 * no club. The console pages check `canModerateReviews` to decide what to
 * render; the server actions check `requireReviewOfficer`, so the rule holds
 * even when an action is called directly without the page.
 */
import { isGlobalOfficer, requireRole } from "@/lib/inventory/auth";
import type { Officer, Role } from "@/lib/inventory/types";

/** The roles the console is for. */
export const REVIEW_ROLES: readonly Role[] = ["admin", "academic_affairs"];

export function canModerateReviews(officer: Officer): boolean {
  return REVIEW_ROLES.includes(officer.role) && isGlobalOfficer(officer);
}

/** The signed-in officer if they may moderate reviews, otherwise why not (401 not signed in, 403 not allowed). */
export async function requireReviewOfficer(): Promise<
  { ok: true; officer: Officer } | { ok: false; status: 401 | 403 }
> {
  const auth = await requireRole([...REVIEW_ROLES]);
  if (!auth.ok) return auth;
  return canModerateReviews(auth.officer) ? auth : { ok: false, status: 403 };
}
