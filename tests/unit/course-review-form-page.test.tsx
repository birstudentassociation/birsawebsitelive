/**
 * The page for writing a review: the form is offered only once the database
 * has the course_review_submissions table, and until then the page keeps the
 * invitation to get in touch. A database that is set but has not had
 * migration 013 applied must read the same as no database, or a student
 * fills in a form that can only fail.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const tables = vi.hoisted(() => ({ reviewTable: true }));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
}));
vi.mock("@/lib/inventory/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/inventory/db")>();
  return {
    ...actual,
    tableExists: async (table: string) =>
      actual.isInventoryConfigured() && table === "course_review_submissions" && tables.reviewTable,
  };
});

import WriteReviewPage from "@/app/[lang]/student-life/course-reviews/[code]/review/page";
import { courses } from "@/content/course-review/courses";

const course = courses[0]!;

async function render(lang: string): Promise<string> {
  const page = await WriteReviewPage({ params: Promise.resolve({ lang, code: course.code }) });
  return renderToStaticMarkup(page);
}

beforeEach(() => {
  tables.reviewTable = true;
  vi.stubEnv("POSTGRES_URL", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("the write a review page", () => {
  it("offers the form once the database and its table are there", async () => {
    vi.stubEnv("POSTGRES_URL", "postgres://example.invalid/db");
    const html = await render("en");
    expect(html).toContain("<form");
    expect(html).toContain('name="workload"');
    expect(html).not.toContain("/contact");
  });

  it("offers no form, and points to /contact, with no database", async () => {
    const html = await render("en");
    expect(html).not.toContain("<form");
    expect(html).not.toContain('name="workload"');
    expect(html).toContain('href="/en/contact"');
  });

  it("offers no form, and points to /contact, when the database is set but the table is missing", async () => {
    vi.stubEnv("POSTGRES_URL", "postgres://example.invalid/db");
    tables.reviewTable = false;
    const html = await render("en");
    expect(html).not.toContain("<form");
    expect(html).not.toContain('name="workload"');
    expect(html).toContain('href="/en/contact"');
  });

  it("does the same in Thai", async () => {
    vi.stubEnv("POSTGRES_URL", "postgres://example.invalid/db");
    tables.reviewTable = false;
    const html = await render("th");
    expect(html).not.toContain("<form");
    expect(html).toContain('href="/th/contact"');
  });
});
