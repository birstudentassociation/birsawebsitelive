import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Officer, Role } from "@/lib/inventory/types";

const session = vi.hoisted(() => ({ officer: null as unknown }));

vi.mock("@/lib/inventory/auth", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/inventory/auth")>("@/lib/inventory/auth");
  return {
    ...actual,
    // The real requireRole, over a stubbed session lookup.
    requireRole: async (allowed: Role[]) => {
      const officer = session.officer as Officer | null;
      if (!officer) return { ok: false, status: 401 };
      if (!allowed.includes(officer.role)) return { ok: false, status: 403 };
      return { ok: true, officer };
    },
  };
});

import { REVIEW_ROLES, canModerateReviews, requireReviewOfficer } from "@/lib/course-review/access";

function officer(role: Role, custodianId: string | null = null): Officer {
  return {
    id: "o-1",
    email: "o@example.com",
    name: "Officer",
    role,
    custodianId,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    lastLoginAt: null,
  };
}

beforeEach(() => {
  session.officer = null;
});

describe("who may moderate course reviews", () => {
  it("is admins and the academic_affairs role", () => {
    expect([...REVIEW_ROLES].sort()).toEqual(["academic_affairs", "admin"]);
    expect(canModerateReviews(officer("admin"))).toBe(true);
    expect(canModerateReviews(officer("academic_affairs"))).toBe(true);
  });

  it("is nobody else", () => {
    for (const role of ["inventory_manager", "loan_officer", "read_only"] as const) {
      expect(canModerateReviews(officer(role)), role).toBe(false);
    }
  });

  it("is BIRSA-wide officers only, not a club's", () => {
    expect(canModerateReviews(officer("admin", "club-custodian-id"))).toBe(false);
    expect(canModerateReviews(officer("academic_affairs", "club-custodian-id"))).toBe(false);
  });
});

describe("requireReviewOfficer", () => {
  it("lets a permitted officer through", async () => {
    session.officer = officer("academic_affairs");
    await expect(requireReviewOfficer()).resolves.toMatchObject({ ok: true });
  });

  it("says 401 when nobody is signed in", async () => {
    await expect(requireReviewOfficer()).resolves.toEqual({ ok: false, status: 401 });
  });

  it("says 403 for another role and for a club-scoped admin", async () => {
    session.officer = officer("loan_officer");
    await expect(requireReviewOfficer()).resolves.toEqual({ ok: false, status: 403 });
    session.officer = officer("admin", "club-custodian-id");
    await expect(requireReviewOfficer()).resolves.toEqual({ ok: false, status: 403 });
  });
});

describe("the other consoles stay closed to academic_affairs", () => {
  it("is not named in any inventory route's role list", async () => {
    const { readFileSync, readdirSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const root = join(__dirname, "..", "..", "app", "api");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (full.endsWith("route.ts")) files.push(full);
      }
    };
    walk(root);
    expect(files.length).toBeGreaterThan(10);
    // The officer-management routes validate the role enum, which must accept it;
    // every other route lists the roles it allows by name and so must not.
    const naming = files.filter((file) => readFileSync(file, "utf8").includes("academic_affairs"));
    expect(naming.map((file) => file.split("/api/")[1]!).sort()).toEqual([
      "inventory/officers/[id]/route.ts",
      "inventory/officers/route.ts",
    ]);
  });
});
