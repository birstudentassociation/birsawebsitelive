/**
 * The elective demand table is registered in the privacy register, purged by
 * the retention job, and designed to hold nothing that identifies who shared a
 * plan. These tests keep the migration, the schema mirror, the register and
 * the code telling the same story.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  activityById,
  browserStorage,
  cookieRecords,
  processorById,
} from "@/content/privacy/register";

const ROOT = join(__dirname, "..", "..");
const migration = readFileSync(join(ROOT, "db", "migrations", "014_elective_demand.sql"), "utf8");
const schema = readFileSync(join(ROOT, "db", "schema.sql"), "utf8");

/** The column names of one `create table` block. */
function columnsOf(sql: string, table: string): string[] {
  const start = sql.indexOf(`create table if not exists ${table} (`);
  expect(start, `${table} is created`).toBeGreaterThan(-1);
  const body = sql.slice(start, sql.indexOf("\n);", start));
  return body
    .split("\n")
    .slice(1)
    .map((line) => /^ {2}([a-z_]+) /.exec(line)?.[1])
    .filter((name): name is string => Boolean(name) && !["unique", "check"].includes(name!));
}

describe("the elective_demand_entries table", () => {
  const columns = columnsOf(migration, "elective_demand_entries");

  it("holds a course, a term and a curriculum version, and the day it arrived", () => {
    expect(columns).toEqual([
      "id",
      "curriculum_version",
      "course_code",
      "term_year",
      "term_semester",
      "created_on",
    ]);
  });

  it("has no name, student ID, email, cohort, minor, passed courses, IP address or user agent", () => {
    for (const column of columns) {
      expect(column, column).not.toMatch(
        /(^|_)(name|student|email|phone|ip|agent|contact|address|cohort|minor|passed|session|user)(_|$)/
      );
    }
  });

  it("cannot tie rows to one submission: a random id and a day, not a serial and a timestamp", () => {
    expect(migration).toContain("id uuid primary key default gen_random_uuid()");
    expect(migration).toContain("created_on date not null default current_date");
    expect(columns).not.toContain("created_at");
    expect(columns).not.toContain("submission_id");
    expect(migration).not.toMatch(/serial/i);
  });

  it("limits the curriculum version, the term and the semester to real values", () => {
    expect(migration).toContain("check (curriculum_version in ('2564', '2564-rev2566', '2568'))");
    expect(migration).toContain("check (term_semester in ('1', '2', 'summer'))");
  });

  it("is mirrored in db/schema.sql with the same columns", () => {
    expect(columnsOf(schema, "elective_demand_entries")).toEqual(columns);
  });

  it("is numbered after the course review migration and applies at most once", () => {
    expect(migration).toMatch(/create table if not exists elective_demand_entries/);
    expect(migration).not.toMatch(/drop table|alter table officers/i);
  });
});

describe("the privacy register", () => {
  const activity = activityById("elective-demand");

  it("registers the activity with the two-year rule, a database and no outside processor", () => {
    expect(activity).toBeDefined();
    expect(activity!.retentionTrigger).toBe("created");
    expect(activity!.storage).toBe("database");
    expect(activity!.recipients).toEqual(["vercel-postgres"]);
    expect(processorById("vercel-postgres")?.receives.en).toMatch(/elective courses/);
  });

  it("collects the courses, the terms and the curriculum, and nothing that identifies the sender", () => {
    const collected = JSON.stringify(activity!.collects).toLowerCase();
    expect(collected).toMatch(/elective courses/);
    expect(collected).toMatch(/curriculum/);
    expect(collected).not.toMatch(/your name|email address|student id|ip address|cohort|minor/);
  });

  it("tells the reader it is optional, what is not asked, and that sending is once a term", () => {
    const { ifYouDoNot } = activity!;
    expect(ifYouDoNot.en).toMatch(/entirely optional/);
    expect(ifYouDoNot.en).toMatch(/do not ask for your name, student ID, cohort or minor/);
    expect(ifYouDoNot.en).toMatch(/once a term/);
    expect(ifYouDoNot.th.length).toBeGreaterThan(40);
  });

  it("says the limit is soft and the figure an indication", () => {
    expect(activity!.retentionNote?.en).toMatch(/courtesy/);
    expect(activity!.retentionNote?.en).toMatch(/indication and not an exact count/);
    expect(activity!.retentionNote?.en).toMatch(/never shows the number/);
  });

  it("registers the browser storage key, with how it is deleted", () => {
    const entry = browserStorage.find((k) => k.key === "birsa-elective-demand");
    expect(entry).toBeDefined();
    expect(entry!.purpose.en).toMatch(/delete button on the plan screen/);
    expect(entry!.purpose.en).toMatch(/never what you sent/);
    expect(entry!.purpose.th.length).toBeGreaterThan(40);
  });

  it("mentions the plan summary in the contact message and its draft cookie", () => {
    expect(JSON.stringify(activityById("contact-message")!.collects)).toMatch(/study plan screen/);
    const cookie = cookieRecords.find((record) => record.name === "birsa_contact_draft");
    expect(cookie!.purpose.en).toMatch(/plan summary/);
  });
});

describe("the retention job", () => {
  const source = readFileSync(join(ROOT, "lib", "privacy", "retention.ts"), "utf8");

  it("deletes elective demand by the day it arrived", () => {
    expect(source).toContain("delete from elective_demand_entries where created_on < $1");
  });

  it("checks the table exists first, so a deploy before the migration cannot abort the purge", () => {
    expect(source).toContain("to_regclass('public.elective_demand_entries')");
  });
});

describe("the browser storage key", () => {
  it("is deleted by the plan screen's delete button", () => {
    const button = readFileSync(
      join(ROOT, "components", "study-plan", "DeletePlanButton.tsx"),
      "utf8"
    );
    expect(button).toContain("clearDemandMarker()");
  });
});
