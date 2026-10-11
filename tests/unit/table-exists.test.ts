/**
 * `tableExists`: whether a migration's table is there yet. Features that need
 * one are switched on by this rather than by POSTGRES_URL alone, so what
 * matters is the memo (a present table is asked about once, an absent one again
 * after a minute) and that no failure ever escapes. The query runner is a stub
 * that counts the questions put to it. The memo is module-level state, so each
 * test loads a fresh copy of the module.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pg = vi.hoisted(() => ({
  calls: [] as { text: string; values: unknown[] }[],
  present: true,
  fail: false,
  noRows: false,
}));

vi.mock("@vercel/postgres", () => ({
  types: { setTypeParser: () => {} },
  sql: async (strings: TemplateStringsArray, ...values: unknown[]) => {
    pg.calls.push({ text: strings.join("?"), values });
    if (pg.fail) throw new Error("database down");
    return pg.noRows ? { rows: [], rowCount: 0 } : { rows: [{ present: pg.present }], rowCount: 1 };
  },
}));

const RECHECK_MS = 60 * 1000;

async function freshTableExists(): Promise<(table: string) => Promise<boolean>> {
  vi.resetModules();
  const mod = await import("@/lib/inventory/db");
  return mod.tableExists;
}

beforeEach(() => {
  pg.calls = [];
  pg.present = true;
  pg.fail = false;
  pg.noRows = false;
  vi.stubEnv("POSTGRES_URL", "postgres://example");
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-11T05:00:00Z"));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("tableExists", () => {
  it("is false with no POSTGRES_URL, without asking the database", async () => {
    vi.stubEnv("POSTGRES_URL", "");
    const tableExists = await freshTableExists();
    await expect(tableExists("course_review_submissions")).resolves.toBe(false);
    expect(pg.calls).toHaveLength(0);
  });

  it("asks for the table in the public schema, as a parameter", async () => {
    const tableExists = await freshTableExists();
    await tableExists("course_review_submissions");
    expect(pg.calls).toHaveLength(1);
    expect(pg.calls[0]!.text).toContain("to_regclass(");
    expect(pg.calls[0]!.values).toEqual(["public.course_review_submissions"]);
  });

  it("is true when the query says the table is present, and remembers it without asking again", async () => {
    const tableExists = await freshTableExists();
    await expect(tableExists("elective_demand_entries")).resolves.toBe(true);
    expect(pg.calls).toHaveLength(1);

    // Even long after, and even if the database would now say otherwise or fail.
    pg.present = false;
    pg.fail = true;
    vi.advanceTimersByTime(24 * 60 * 60 * 1000);
    await expect(tableExists("elective_demand_entries")).resolves.toBe(true);
    await expect(tableExists("elective_demand_entries")).resolves.toBe(true);
    expect(pg.calls).toHaveLength(1);
  });

  it("is false when the query says the table is absent, and does not ask again within a minute", async () => {
    pg.present = false;
    const tableExists = await freshTableExists();
    await expect(tableExists("elective_demand_entries")).resolves.toBe(false);
    expect(pg.calls).toHaveLength(1);

    // The migration lands, but the answer is not yet due to be rechecked.
    pg.present = true;
    vi.advanceTimersByTime(RECHECK_MS - 1);
    await expect(tableExists("elective_demand_entries")).resolves.toBe(false);
    expect(pg.calls).toHaveLength(1);
  });

  it("asks again once a minute has passed, and is true as soon as the migration has landed", async () => {
    pg.present = false;
    const tableExists = await freshTableExists();
    await expect(tableExists("elective_demand_entries")).resolves.toBe(false);

    pg.present = true;
    vi.advanceTimersByTime(RECHECK_MS);
    await expect(tableExists("elective_demand_entries")).resolves.toBe(true);
    expect(pg.calls).toHaveLength(2);

    // And now it is remembered.
    await expect(tableExists("elective_demand_entries")).resolves.toBe(true);
    expect(pg.calls).toHaveLength(2);
  });

  it("keeps asking once a minute while the table stays absent", async () => {
    pg.present = false;
    const tableExists = await freshTableExists();
    for (let minute = 0; minute < 3; minute += 1) {
      await expect(tableExists("elective_demand_entries")).resolves.toBe(false);
      await expect(tableExists("elective_demand_entries")).resolves.toBe(false);
      vi.advanceTimersByTime(RECHECK_MS);
    }
    expect(pg.calls).toHaveLength(3);
  });

  it("is false, and does not throw, when the query fails, and asks again after a minute", async () => {
    pg.fail = true;
    const tableExists = await freshTableExists();
    await expect(tableExists("course_review_submissions")).resolves.toBe(false);
    await expect(tableExists("course_review_submissions")).resolves.toBe(false);
    expect(pg.calls).toHaveLength(1);

    pg.fail = false;
    vi.advanceTimersByTime(RECHECK_MS);
    await expect(tableExists("course_review_submissions")).resolves.toBe(true);
    expect(pg.calls).toHaveLength(2);
  });

  it("is false when the query returns no row", async () => {
    pg.noRows = true;
    const tableExists = await freshTableExists();
    await expect(tableExists("course_review_submissions")).resolves.toBe(false);
  });

  it("remembers each table on its own", async () => {
    const tableExists = await freshTableExists();
    await expect(tableExists("course_review_submissions")).resolves.toBe(true);
    pg.present = false;
    await expect(tableExists("elective_demand_entries")).resolves.toBe(false);
    await expect(tableExists("course_review_submissions")).resolves.toBe(true);
    expect(pg.calls.map((c) => c.values[0])).toEqual([
      "public.course_review_submissions",
      "public.elective_demand_entries",
    ]);
  });

  it("starts with an empty memo in a fresh module", async () => {
    const first = await freshTableExists();
    await expect(first("course_review_submissions")).resolves.toBe(true);
    pg.present = false;
    const second = await freshTableExists();
    await expect(second("course_review_submissions")).resolves.toBe(false);
  });
});
