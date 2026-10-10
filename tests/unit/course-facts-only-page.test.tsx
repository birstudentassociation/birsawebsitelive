import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
}));

import CourseDetailPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/[lang]/student-life/course-reviews/[code]/page";
import { courses } from "@/content/course-review/courses";
import { allCourseCodes } from "@/lib/courses/graph";

async function render(lang: string, code: string): Promise<string> {
  const page = await CourseDetailPage({ params: Promise.resolve({ lang, code }) });
  return renderToStaticMarkup(page);
}

const href = (lang: string, code: string) => `href="/${lang}/student-life/course-reviews/${code}"`;

describe("course page for a code outside the PI catalogue", () => {
  // TU104 is only in the 2564 curriculum, so it also shows that the page does
  // not assume the 2568 curriculum lists the code.
  it("shows the code, the English title and the credits", async () => {
    const html = await render("en", "TU104");
    expect(html).toContain("TU104: Critical Thinking, Reading, and Writing");
    expect(html).toContain("Credits");
    expect(html).toContain(">3<");
  });

  it("keeps the English title in the Thai locale", async () => {
    const html = await render("th", "TU104");
    expect(html).toContain("TU104: Critical Thinking, Reading, and Writing");
    expect(html).toContain("ข้อมูลจากหลักสูตรเท่านั้น");
  });

  it("says what it counts towards in each curriculum, including where it is absent", async () => {
    const html = await render("en", "TU104");
    expect(html).toContain("Counts towards");
    expect(html).toContain("Curriculum 2021 (B.E. 2564): General education, part 1");
    expect(html).toContain("Curriculum 2021 (B.E. 2564), 2023 revision: Not in this curriculum");
    expect(html).toContain("Curriculum 2025 (B.E. 2568): Not in this curriculum");
  });

  it("links to the equivalent course and discloses that the pairing is inferred", async () => {
    const html = await render("en", "TU104");
    expect(html).toContain("Replaced by");
    expect(html).toContain(href("en", "LAS101"));
    expect(html).toContain("has not been confirmed by the faculty");
    const thai = await render("th", "TU104");
    expect(thai).toContain("ยังไม่ได้รับการยืนยันจากคณะ");
  });

  it("links to the replaced course from the later one", async () => {
    const html = await render("en", "LAS101");
    expect(html).toContain("Replaces");
    expect(html).toContain(href("en", "TU104"));
  });

  it("shows the recommended term per curriculum", async () => {
    const html = await render("en", "EL105");
    expect(html).toContain("Year 1, Semester 1");
  });

  it("keeps the review section in its no-review state and has no catalogue-only content", async () => {
    const html = await render("en", "TU104");
    expect(html).toContain("No student review yet");
    expect(html).toContain("BIRSA has not recorded how this course is assessed yet");
    expect(html).not.toContain("Usually taken in");
    expect(html).not.toContain("Instructor");
    expect(html).not.toContain("Previous");
  });

  it("says so when a course has no prerequisites", async () => {
    // No course outside the catalogue has one today, so there is no link to
    // check here; the prerequisite and unlock links share the catalogue code path.
    const html = await render("en", "EE210");
    expect(html).toContain("No prerequisites");
  });

  it("is a statically generated page for every code, in both locales", () => {
    const params = generateStaticParams();
    for (const lang of ["en", "th"]) {
      for (const code of allCourseCodes()) {
        expect(params, `${lang} ${code}`).toContainEqual({ lang, code });
      }
    }
  });

  it("has metadata without a catalogue description", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "en", code: "TU104" }),
    });
    expect(JSON.stringify(metadata.title)).toContain(
      "TU104 Critical Thinking, Reading, and Writing"
    );
    expect(String(metadata.description)).toContain("Credits: 3");
  });

  it("is not found for a code no curriculum lists", async () => {
    await expect(render("en", "PI999")).rejects.toThrow("not-found");
    expect(
      await generateMetadata({ params: Promise.resolve({ lang: "en", code: "PI999" }) })
    ).toEqual({});
  });
});

describe("course page for a PI catalogue course", () => {
  it("still shows the 2568 facts it always showed", async () => {
    const html = await render("en", "PI280");
    expect(html).toContain("PI280: ");
    expect(html).toContain("Usually taken in");
    expect(html).toContain("Year 2, Semester 2");
    expect(html).toContain(href("en", "PI271"));
    expect(html).toContain(href("en", "PI364"));
    expect(html).not.toContain("Counts towards<");
    expect(html).not.toContain("Curriculum facts only");
  });

  it("renders every catalogue course", async () => {
    for (const course of courses) {
      const html = await render("en", course.code);
      expect(html, course.code).toContain(`${course.code}: ${course.title.en}`);
    }
  });
});
