// @vitest-environment jsdom
/**
 * The page the contact form's academic category leads to. It names the BIR
 * office and every way of reaching it, links on to the office's contact section
 * and back to the topics, and is plain server-rendered markup with no form, so
 * it reads the same with JavaScript off.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import ContactAcademicPage from "@/app/[lang]/contact/academic/page";

afterEach(() => cleanup());

async function page(lang: string) {
  return ContactAcademicPage({ params: Promise.resolve({ lang }) });
}

describe("the BIR office page for academic questions", () => {
  it("says BIRSA does not answer them and the BIR office does", async () => {
    const { container } = render(await page("en"));
    const text = container.textContent!;
    expect(text).toContain("BIRSA does not answer questions about studies");
    expect(text).toContain("The BIR office answers questions about courses, registration, grades");
    expect(container.querySelector("h1")!.textContent).toBe(
      "Ask the BIR office about your studies"
    );
  });

  it("gives the office's email, phone, website and contact section", async () => {
    const { container } = render(await page("en"));
    const byHref = (needle: string) =>
      [...container.querySelectorAll("a")].find((a) => a.getAttribute("href")!.includes(needle))!;

    expect(byHref("mailto:bir@tu.ac.th").textContent).toBe("bir@tu.ac.th");
    const phone = byHref("tel:");
    expect(phone.getAttribute("href")).toBe("tel:022216111,3409");
    expect(phone.textContent).toBe("02-221-6111 ext. 3409");
    expect(byHref("https://www.birpolsci.com").textContent).toContain("birpolsci.com");
    expect(byHref("/about-bir").getAttribute("href")).toBe(
      "/en/student-life/first-weeks/about-bir#contact-the-bir-office"
    );
  });

  it("says the BIR office announces BIR's academic dates", async () => {
    const { container } = render(await page("en"));
    expect(container.textContent).toContain(
      "announces BIR's registration dates and other academic dates on birpolsci.com"
    );
  });

  it("links back to the topics and has no form to fill in", async () => {
    const { container } = render(await page("en"));
    const back = [...container.querySelectorAll("a")].find(
      (a) => a.textContent === "Choose a different topic"
    )!;
    expect(back.getAttribute("href")).toBe("/en/contact");
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("textarea")).toBeNull();
  });

  it("is in Thai for a Thai reader, with the Thai phone number and section anchor", async () => {
    const { container } = render(await page("th"));
    const text = container.textContent!;
    expect(container.querySelector("h1")!.textContent).toBe(
      "เรื่องการเรียนสอบถามสำนักงานโครงการ BIR"
    );
    expect(text).toContain("BIRSA ไม่ได้ตอบคำถามเรื่องการเรียน");
    expect(text).toContain("02-221-6111 ต่อ 3409");
    expect(
      [...container.querySelectorAll("a")]
        .find((a) => a.getAttribute("href")!.includes("/about-bir"))!
        .getAttribute("href")
    ).toBe("/th/student-life/first-weeks/about-bir#ติดต่อสำนักงานโครงการ-bir");
    expect(
      [...container.querySelectorAll("a")]
        .find((a) => a.textContent === "เลือกเรื่องอื่น")!
        .getAttribute("href")
    ).toBe("/th/contact");
  });

  it("renders to plain markup on the server, with the address in the page", async () => {
    const html = renderToString(await page("en"));
    expect(html).toContain("tel:022216111,3409");
    expect(html).toContain("https://www.birpolsci.com");
    expect(html).not.toContain("<form");
  });

  it("does not exist in a language the site does not have", async () => {
    await expect(page("fr")).rejects.toThrow("404");
  });
});
