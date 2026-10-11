/**
 * The officer side of the elective demand signal: who may see the counts and
 * download them, and what the CSV holds. Access is the course review console's
 * rule (admins and Academic Affairs, BIRSA-wide only), reused rather than
 * restated, so these tests go through the export route to prove it holds there
 * as well as in `lib/course-review/access.ts`.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Officer, Role } from "@/lib/inventory/types";

const session = vi.hoisted(() => ({ officer: null as unknown }));
const audit = vi.hoisted(() => ({ entries: [] as Record<string, unknown>[] }));
const store = vi.hoisted(() => ({ counts: [] as unknown[] }));

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
vi.mock("@/lib/inventory/audit", () => ({
  recordAudit: async (entry: Record<string, unknown>) => {
    audit.entries.push(entry);
  },
}));
vi.mock("@/lib/elective-demand/store", () => ({
  listDemandCounts: async () => store.counts,
}));

import { GET } from "@/app/[lang]/officer/inventory/course-demand/export/route";
import { canModerateReviews } from "@/lib/course-review/access";
import { DEMAND_CSV_HEADER, demandCsv, demandCsvFromDatabase } from "@/lib/elective-demand/csv";
import type { DemandCount } from "@/lib/elective-demand/store";

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

const counts: DemandCount[] = [
  { courseCode: "PI364", term: { year: 2569, semester: 2 }, students: 31 },
  { courseCode: "PI376", term: { year: 2569, semester: "summer" }, students: 4 },
];

beforeEach(() => {
  session.officer = null;
  audit.entries = [];
  store.counts = counts;
});

describe("who may download elective demand", () => {
  it("lets admins and the Academic Affairs role, and records the download", async () => {
    for (const role of ["admin", "academic_affairs"] as const) {
      session.officer = officer(role);
      audit.entries = [];
      const response = await GET();
      expect(response.status, role).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/csv; charset=utf-8");
      expect(response.headers.get("content-disposition")).toMatch(
        /^attachment; filename="birsa-elective-demand-\d{4}-\d{2}-\d{2}\.csv"$/
      );
      expect(audit.entries).toEqual([
        {
          officerId: "o-1",
          action: "elective_demand.export",
          entityType: "elective_demand",
          entityId: "all",
        },
      ]);
    }
  });

  it("says 401 when nobody is signed in, and returns no data", async () => {
    const response = await GET();
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain("PI364");
    expect(audit.entries).toEqual([]);
  });

  it("says 403 to every other role", async () => {
    for (const role of ["inventory_manager", "loan_officer", "read_only"] as const) {
      session.officer = officer(role);
      const response = await GET();
      expect(response.status, role).toBe(403);
      expect(await response.text()).not.toContain("PI364");
    }
    expect(audit.entries).toEqual([]);
  });

  it("says 403 to a club's officers, however senior", async () => {
    session.officer = officer("admin", "club-custodian-id");
    expect((await GET()).status).toBe(403);
    session.officer = officer("academic_affairs", "club-custodian-id");
    expect((await GET()).status).toBe(403);
  });

  it("is the same rule the course review console uses", () => {
    expect(canModerateReviews(officer("academic_affairs"))).toBe(true);
    expect(canModerateReviews(officer("loan_officer"))).toBe(false);
  });

  it("puts the rows it was given in the body", async () => {
    session.officer = officer("academic_affairs");
    const text = await (await GET()).text();
    expect(text).toContain("PI364,");
    expect(text).toContain(",31\r\n");
  });
});

describe("the CSV", () => {
  it("has a header, one row per course and term, and CRLF line endings throughout", () => {
    const csv = demandCsv(counts);
    expect(csv.endsWith("\r\n")).toBe(true);
    expect(csv).not.toMatch(/[^\r]\n/);
    const lines = csv.trimEnd().split("\r\n");
    expect(lines[0]).toBe(DEMAND_CSV_HEADER.join(","));
    expect(lines).toHaveLength(3);
  });

  it("gives the course, its title, the academic year both ways, the semester and the count", () => {
    const lines = demandCsv(counts).trimEnd().split("\r\n");
    expect(lines[1]).toMatch(/^PI364,.+,2569,2026\/27,2,31$/);
    expect(lines[2]).toMatch(/^PI376,.+,2569,2026\/27,summer,4$/);
  });

  it("holds only those columns: nothing that identifies a student, because nothing does", () => {
    expect(DEMAND_CSV_HEADER).toEqual([
      "course_code",
      "course_title",
      "academic_year_be",
      "academic_year_ce",
      "semester",
      "students",
    ]);
  });

  it("is the header alone when there is nothing to export", () => {
    expect(demandCsv([])).toBe(`${DEMAND_CSV_HEADER.join(",")}\r\n`);
  });

  it("guards against a spreadsheet formula in a text field, as every export does", () => {
    const csv = demandCsv([
      { courseCode: "=HYPERLINK(1)", term: { year: 2569, semester: 1 }, students: 1 },
    ]);
    expect(csv).toContain("'=HYPERLINK(1)");
    expect(csv).not.toMatch(/^=/m);
  });

  it("quotes a field that holds a comma, a quote or a newline", () => {
    const csv = demandCsv([
      { courseCode: 'A,"B"\nC', term: { year: 2569, semester: 1 }, students: 1 },
    ]);
    expect(csv).toContain('"A,""B""\nC"');
  });

  it("reads from the database for the export", async () => {
    store.counts = [];
    await expect(demandCsvFromDatabase()).resolves.toBe(`${DEMAND_CSV_HEADER.join(",")}\r\n`);
    store.counts = counts;
    expect((await demandCsvFromDatabase()).trimEnd().split("\r\n")).toHaveLength(3);
  });
});
