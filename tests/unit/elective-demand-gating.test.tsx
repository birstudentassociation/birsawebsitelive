// @vitest-environment jsdom
/**
 * The elective demand signal must build and render with no environment at all:
 * no POSTGRES_URL and no OFFICER_SESSION_SECRET. Each data-access function
 * returns a neutral value rather than throwing or touching a connection, which
 * is what lets a static build, a preview with no secrets and a half-configured
 * site all work. Nothing is mocked here, so a call that tried to reach a
 * database would fail loudly.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import PlanOutreach from "@/components/study-plan/PlanOutreach";
import { demandCsvFromDatabase, DEMAND_CSV_HEADER } from "@/lib/elective-demand/csv";
import {
  insertDemand,
  isElectiveDemandConfigured,
  listDemandCounts,
  listDemandTerms,
} from "@/lib/elective-demand/store";
import { purgeExpiredPersonalData } from "@/lib/privacy/retention";
import type { StudyPlan } from "@/lib/study-plan/plan";

const plan: StudyPlan = {
  versionId: "2568",
  cohort: "68",
  startYear: 2568,
  minorId: "governance",
  passed: [],
  freeElectiveCreditsPassed: 0,
  terms: [{ term: { year: 3, kind: "semester1" }, codes: ["PI364"], freeElectiveCredits: 0 }],
};

beforeEach(() => {
  vi.stubEnv("POSTGRES_URL", "");
  vi.stubEnv("OFFICER_SESSION_SECRET", "");
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("elective demand with no environment configured", () => {
  it("reports itself as not configured", () => {
    expect(isElectiveDemandConfigured()).toBe(false);
  });

  it("reads return nothing", async () => {
    await expect(listDemandCounts()).resolves.toEqual([]);
    await expect(listDemandTerms("PI364", new Date())).resolves.toEqual([]);
  });

  it("writes fail quietly instead of throwing", async () => {
    await expect(
      insertDemand({
        versionId: "2568",
        entries: [{ code: "PI364", term: { year: 2570, semester: 1 } }],
      })
    ).resolves.toBe(false);
  });

  it("exports a valid, empty CSV", async () => {
    await expect(demandCsvFromDatabase()).resolves.toBe(`${DEMAND_CSV_HEADER.join(",")}\r\n`);
  });

  it("has nothing to purge, and says so without throwing", async () => {
    await expect(purgeExpiredPersonalData()).resolves.toEqual({
      ok: false,
      reason: "not-configured",
    });
  });
});

describe("the plan screen section with and without a database", () => {
  const renderSection = () =>
    render(
      <PlanOutreach
        plan={plan}
        serialisedPlan="x"
        locale="en"
        now={new Date("2026-10-11T05:00:00Z")}
      />
    );

  it("leaves the elective sharing out with no database, and keeps the rest", () => {
    const { container } = renderSection();
    expect(container.querySelector("#share-electives")).toBeNull();
    expect(container.textContent).not.toContain("Share my planned electives");
    expect(container.querySelector("#share-with-advisor")).not.toBeNull();
    expect(container.querySelector("#ask-academic-affairs")).not.toBeNull();
    expect(container.querySelector("#registration-dates")).not.toBeNull();
  });

  it("offers it once a database is configured", () => {
    vi.stubEnv("POSTGRES_URL", "postgres://example");
    const { container } = renderSection();
    expect(container.querySelector("#share-electives")).not.toBeNull();
    expect(container.textContent).toContain("Share my planned electives anonymously");
  });
});
