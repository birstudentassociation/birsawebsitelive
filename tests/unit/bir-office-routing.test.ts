/**
 * The BIR office, not BIRSA, announces BIR's academic dates and answers
 * academic questions. These check the places that say so: the news posts that
 * once said BIRSA announced the dates, the where-to-go answers for programme
 * and teaching questions, the checklist hint, and the one set of office
 * details in `content/site.ts` against the guide it points readers to.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { homeTrack } from "@/content/onboarding/home";
import { birOffice } from "@/content/site";
import { contact } from "@/content/smart-answers/topics/contact";
import { birOfficeContactHref, birOfficePhoneText } from "@/components/BirOfficeContact";

const ROOT = process.cwd();
const read = (file: string) => readFileSync(join(ROOT, file), "utf8");

describe("the news posts that mention BIR's academic dates", () => {
  const posts = [
    "content/news/en/academic-calendar-2569.mdx",
    "content/news/th/academic-calendar-2569.mdx",
    "content/news/en/activity-calendar.mdx",
    "content/news/th/activity-calendar.mdx",
  ];

  it("say the BIR office announces them, and point to birpolsci.com", () => {
    for (const file of posts) {
      const text = read(file);
      expect(text, file).toContain("(https://www.birpolsci.com)");
      expect(text, file).toMatch(/BIR Program/);
    }
    expect(read(posts[0]!)).toContain("The BIR office announces BIR's course registration");
    expect(read(posts[1]!)).toContain("สำนักงานโครงการ BIR จะประกาศวันลงทะเบียนเรียน");
    expect(read(posts[2]!)).toContain("The BIR office announces BIR's registration");
    expect(read(posts[3]!)).toContain("สำนักงานโครงการ BIR จะประกาศวันลงทะเบียนเรียน");
  });

  it("no longer say BIRSA announces them", () => {
    for (const file of posts) {
      const text = read(file);
      expect(text, file).not.toMatch(/BIRSA('s)? (will )?(separate )?announce/i);
      expect(text, file).not.toMatch(/announcement of\s+BIR's own/);
      expect(text, file).not.toMatch(/BIRSA จะ(ประกาศ|แจ้ง)วัน/);
      expect(text, file).not.toMatch(/ที่ BIRSA จะแจ้ง/);
    }
  });
});

describe("the where-to-go answers for academic questions", () => {
  const outcome = (id: string) => contact.nodes.find((node) => node.id === id)!;

  it("send programme and teaching questions to the BIR office, not to BIRSA", () => {
    for (const id of ["out-contact-programme", "out-problem-teaching"]) {
      const node = outcome(id);
      expect(node.kind).toBe("outcome");
      if (node.kind !== "outcome") continue;
      const actions = node.actions ?? [];
      expect(
        actions.some((a) => a.href === "mailto:bir@tu.ac.th"),
        id
      ).toBe(true);
      expect(
        actions.some((a) => a.href === "/contact"),
        id
      ).toBe(false);
      expect(node.contactCategory, id).toBeUndefined();
      expect(node.title.en, id).toMatch(/BIR office/);
      expect(node.title.th, id).toContain("สำนักงานโครงการ BIR");
    }
  });
});

describe("the first-weeks checklist", () => {
  it("says the BIR office announces the orientation and term dates", () => {
    const task = homeTrack.steps
      .flatMap((step) => step.tasks)
      .find((t) => t.id === "orientation-dates")!;
    expect(task.hint!.en).toContain("The BIR office announces");
    expect(task.hint!.th).toContain("สำนักงานโครงการ BIR ประกาศ");
    expect(task.href).toBe("/student-life/first-weeks/first-two-weeks");
  });
});

describe("the BIR office details", () => {
  const en = read("content/student-life/en/first-weeks/about-bir.mdx");
  const th = read("content/student-life/th/first-weeks/about-bir.mdx");

  it("match the About BIR guide", () => {
    expect(en).toContain(`<Email address="${birOffice.email}" />`);
    expect(th).toContain(`<Email address="${birOffice.email}" />`);
    expect(en).toContain(`Phone ${birOfficePhoneText("en")}`);
    expect(th).toContain(`โทรศัพท์ ${birOfficePhoneText("th")}`);
    expect(en).toContain(`(${birOffice.website})`);
  });

  it("link to the guide's contact section in each language", () => {
    expect(en).toContain("## Contact the BIR office");
    expect(th).toContain("## ติดต่อสำนักงานโครงการ BIR");
    expect(birOfficeContactHref("en")).toBe(
      "/en/student-life/first-weeks/about-bir#contact-the-bir-office"
    );
    expect(birOfficeContactHref("th")).toBe(
      "/th/student-life/first-weeks/about-bir#ติดต่อสำนักงานโครงการ-bir"
    );
  });
});

describe("mailtoHrefWithFallback", () => {
  it("carries the whole body when the link stays short", async () => {
    const { mailtoHrefWithFallback } = await import("@/lib/mailto");
    const href = mailtoHrefWithFallback("bir@tu.ac.th", "Subject", "Short plan", "Paste it");
    expect(decodeURIComponent(href)).toContain("Short plan");
  });

  it("swaps in the paste prompt when the encoded link would pass the limit", async () => {
    const { mailtoHrefWithFallback, MAILTO_MAX_LENGTH } = await import("@/lib/mailto");
    const href = mailtoHrefWithFallback("bir@tu.ac.th", "Subject", "แผน".repeat(300), "Paste it");
    expect(href.length).toBeLessThanOrEqual(MAILTO_MAX_LENGTH);
    expect(decodeURIComponent(href)).toContain("Paste it");
    expect(decodeURIComponent(href)).not.toContain("แผน");
  });
});
