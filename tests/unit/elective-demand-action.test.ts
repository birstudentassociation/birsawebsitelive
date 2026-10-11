/**
 * Sending electives: the server action and the one insert behind it. The
 * claim these tests defend is that nothing beyond the curriculum version,
 * course codes and terms is sent to the database, however much more a request
 * carries. The database is a stub that records the query text and parameters,
 * so the assertions are about what would actually be stored.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  calls: [] as { text: string; values: unknown[] }[],
  fail: false,
}));
const requester = vi.hoisted(() => ({ ip: "198.51.100.7" }));

vi.mock("@/lib/inventory/db", () => ({
  isInventoryConfigured: () => !!process.env.POSTGRES_URL,
  sql: async (strings: TemplateStringsArray, ...values: unknown[]) => {
    db.calls.push({ text: strings.join("?"), values });
    if (db.fail) throw new Error("database down");
    return { rows: [], rowCount: 0 };
  },
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": requester.ip }),
}));

import { submitElectiveDemand } from "@/app/[lang]/services/study-plan/share-actions";
import { checkRateLimit } from "@/app/api/_lib/guard";
import { insertDemand } from "@/lib/elective-demand/store";

let counter = 0;

function form(fields: Record<string, string> = {}): FormData {
  const data = new FormData();
  const values: Record<string, string> = {
    version: "2568",
    entries: "PI364@2570-1,PI376@2570-summer",
    share: "yes",
    nickname: "",
    ...fields,
  };
  for (const [key, value] of Object.entries(values)) data.append(key, value);
  return data;
}

beforeEach(() => {
  vi.stubEnv("POSTGRES_URL", "postgres://example");
  db.calls = [];
  db.fail = false;
  // A fresh address per test, so rate limit buckets never leak between them.
  counter += 1;
  requester.ip = `203.0.113.${counter}`;
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("submitElectiveDemand", () => {
  it("stores a valid submission and says so", async () => {
    await expect(submitElectiveDemand({ status: "idle" }, form())).resolves.toEqual({
      status: "shared",
    });
    expect(db.calls).toHaveLength(1);
  });

  it("stores only the version, the codes and the terms, as the one insert's parameters", async () => {
    await submitElectiveDemand({ status: "idle" }, form());
    const [call] = db.calls;
    expect(call!.text).toMatch(
      /insert into elective_demand_entries \(curriculum_version, course_code, term_year, term_semester\)/
    );
    // Four values and no more: the version, then the three parallel arrays.
    expect(call!.values).toEqual([
      "2568",
      '{"PI364","PI376"}',
      '{"2570","2570"}',
      '{"1","summer"}',
    ]);
    // No column for, and no value of, anything else.
    expect(call!.text).not.toMatch(/cohort|minor|passed|name|email|ip_|agent|student/i);
  });

  it("ignores everything else a request carries: cohort, minor, passed courses, the plan, identifiers", async () => {
    await submitElectiveDemand(
      { status: "idle" },
      form({
        cohort: "68",
        minor: "governance",
        passed: "PI121,PI122",
        plan: "eyJ2ZXJzaW9uSWQiOiIyNTY4In0",
        name: "Somchai",
        email: "somchai@example.com",
        studentId: "6812345678",
        ip: "203.0.113.200",
      })
    );
    const everything = JSON.stringify(db.calls);
    for (const leaked of [
      "governance",
      "PI121",
      "eyJ2",
      "Somchai",
      "somchai@example.com",
      "6812345678",
      "203.0.113",
      "198.51.100",
    ]) {
      expect(everything, leaked).not.toContain(leaked);
    }
    expect(db.calls[0]!.values).toHaveLength(4);
  });

  it("refuses when the box is not ticked, and stores nothing", async () => {
    await expect(submitElectiveDemand({ status: "idle" }, form({ share: "" }))).resolves.toEqual({
      status: "not-agreed",
    });
    expect(db.calls).toHaveLength(0);
  });

  it("refuses a code that is not in the curriculum or a term that is not real, and stores nothing", async () => {
    for (const entries of ["PI999@2570-1", "PI364@2570-9", "PI364@2570-1,nope"]) {
      await expect(submitElectiveDemand({ status: "idle" }, form({ entries }))).resolves.toEqual({
        status: "invalid",
      });
    }
    await expect(
      submitElectiveDemand({ status: "idle" }, form({ version: "1999" }))
    ).resolves.toEqual({ status: "invalid" });
    expect(db.calls).toHaveLength(0);
  });

  it("says nothing was stored when the database is not configured", async () => {
    vi.stubEnv("POSTGRES_URL", "");
    await expect(submitElectiveDemand({ status: "idle" }, form())).resolves.toEqual({
      status: "not-configured",
    });
    expect(db.calls).toHaveLength(0);
  });

  it("reports an error, not success, when the insert fails", async () => {
    db.fail = true;
    await expect(submitElectiveDemand({ status: "idle" }, form())).resolves.toEqual({
      status: "error",
    });
  });

  it("pretends to succeed on a filled honeypot and stores nothing", async () => {
    await expect(
      submitElectiveDemand({ status: "idle" }, form({ nickname: "bot" }))
    ).resolves.toEqual({ status: "shared" });
    expect(db.calls).toHaveLength(0);
  });

  it("limits how often one network can send, on a scope of its own, and does not count mistakes", async () => {
    // A mistake in the form does not use up the budget.
    for (let i = 0; i < 15; i += 1) {
      await submitElectiveDemand({ status: "idle" }, form({ share: "" }));
    }
    await expect(submitElectiveDemand({ status: "idle" }, form())).resolves.toEqual({
      status: "shared",
    });
    // Real sends do: ten are allowed in the window, the eleventh is not.
    for (let i = 0; i < 9; i += 1) {
      await submitElectiveDemand({ status: "idle" }, form());
    }
    await expect(submitElectiveDemand({ status: "idle" }, form())).resolves.toEqual({
      status: "rate-limited",
    });
    expect(db.calls).toHaveLength(10);
    // Another feature's budget on the same address is untouched.
    expect(checkRateLimit(requester.ip, "course-review")).toBe(true);
  });
});

describe("insertDemand", () => {
  it("does nothing, and says so, with no database or no entries", async () => {
    const payload = {
      versionId: "2568" as const,
      entries: [{ code: "PI364", term: { year: 2570, semester: 1 as const } }],
    };
    vi.stubEnv("POSTGRES_URL", "");
    await expect(insertDemand(payload)).resolves.toBe(false);
    vi.stubEnv("POSTGRES_URL", "postgres://example");
    await expect(insertDemand({ versionId: "2568", entries: [] })).resolves.toBe(false);
    expect(db.calls).toHaveLength(0);
  });
});
