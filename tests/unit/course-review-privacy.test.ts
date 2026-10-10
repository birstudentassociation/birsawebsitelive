/**
 * The course review tables are registered in the privacy register, purged by
 * the retention job where they hold raw submissions, and designed to hold
 * nothing that identifies a reviewer. These tests keep the migration, the
 * register and the code telling the same story.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { activityById, processorById } from "@/content/privacy/register";

const ROOT = join(__dirname, "..", "..");
const migration = readFileSync(join(ROOT, "db", "migrations", "013_course_reviews.sql"), "utf8");
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

describe("the course review tables", () => {
  const submissionColumns = columnsOf(migration, "course_review_submissions");

  it("hold no name, student ID, email address, IP address or user agent", () => {
    expect(submissionColumns.length).toBeGreaterThan(8);
    for (const column of submissionColumns) {
      expect(column, column).not.toMatch(
        /(^|_)(name|student|email|phone|ip|agent|contact|address)(_|$)/
      );
    }
  });

  it("carry the fields the form collects and the moderation the console records", () => {
    expect(submissionColumns).toEqual(
      expect.arrayContaining([
        "course_code",
        "term_year",
        "term_semester",
        "instructor_key",
        "workload",
        "workload_band",
        "assessment",
        "tips",
        "quote",
        "locale",
        "status",
        "moderated_by",
        "moderated_at",
        "created_at",
      ])
    );
  });

  it("are mirrored in db/schema.sql with the same columns", () => {
    for (const table of ["course_review_submissions", "published_course_reviews"]) {
      expect(columnsOf(schema, table), table).toEqual(columnsOf(migration, table));
    }
  });

  it("publish bilingual text, the band distribution and the submissions they were drawn from", () => {
    expect(columnsOf(migration, "published_course_reviews")).toEqual(
      expect.arrayContaining([
        "workload_en",
        "workload_th",
        "assessment_en",
        "assessment_th",
        "tips",
        "quotes",
        "band_counts",
        "review_count",
        "published_by",
        "published_at",
        "submission_ids",
      ])
    );
  });

  it("let the role check admit academic_affairs and keep every earlier role", () => {
    expect(migration).toContain("drop constraint if exists officers_role_check");
    expect(migration).toMatch(
      /check \(role in \('admin', 'inventory_manager', 'loan_officer', 'read_only', 'academic_affairs'\)\)/
    );
  });

  it("do not reference raw submissions from the published table with a foreign key", () => {
    // Raw rows are purged after two years; the summary must outlive them.
    const published = migration.slice(
      migration.indexOf("create table if not exists published_course_reviews")
    );
    expect(published).not.toMatch(/references course_review_submissions/);
  });
});

describe("the privacy register", () => {
  it("registers the raw submissions with the two-year rule and names the AI processor", () => {
    const activity = activityById("course-review");
    expect(activity).toBeDefined();
    expect(activity!.retentionTrigger).toBe("created");
    expect(activity!.storage).toBe("database");
    expect(activity!.recipients).toEqual(expect.arrayContaining(["vercel-postgres", "anthropic"]));
    expect(processorById("anthropic")?.outsideThailand).toBe(true);
  });

  it("registers the published summaries as outside the timer, and says why", () => {
    const activity = activityById("course-review-summary");
    expect(activity).toBeDefined();
    expect(activity!.retentionTrigger).toBe("until-unpublished");
    expect(activity!.retentionNote?.en).toMatch(/no personal data about students/);
    expect(activity!.retentionNote?.th.length).toBeGreaterThan(10);
  });

  it("does not collect anything that identifies the reviewer", () => {
    const text = JSON.stringify(activityById("course-review")!.collects).toLowerCase();
    expect(text).not.toMatch(/your name|email address|student id|ip address/);
  });

  it("tells the reader the form is optional and asks them not to identify anyone", () => {
    const { ifYouDoNot } = activityById("course-review")!;
    expect(ifYouDoNot.en).toMatch(/entirely optional/);
    expect(ifYouDoNot.en).toMatch(/do not name other students/);
  });
});

describe("the retention job", () => {
  it("deletes raw submissions by age and never touches published summaries", () => {
    const source = readFileSync(join(ROOT, "lib", "privacy", "retention.ts"), "utf8");
    expect(source).toContain("delete from course_review_submissions where created_at < $1");
    expect(source).not.toMatch(/delete from published_course_reviews/);
  });
});
