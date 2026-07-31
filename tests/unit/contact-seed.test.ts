import { describe, expect, it } from "vitest";
import { deriveContactSeed } from "@/app/[lang]/contact/seed";

describe("deriveContactSeed", () => {
  it("returns the problem category and subject for a safe English path", () => {
    expect(deriveContactSeed("en", "problem", "/en")).toEqual({
      category: "problem",
      subject: "Problem with page: /en",
    });
  });

  it("uses the Thai subject prefix for a safe Thai path", () => {
    const result = deriveContactSeed("th", "problem", "/th/news");
    expect(result.subject).toMatch(/^ปัญหาในหน้า/);
  });

  it("returns a valid non-problem category with no subject", () => {
    expect(deriveContactSeed("en", "question", "/en")).toEqual({
      category: "question",
      subject: undefined,
    });
  });

  it("returns an empty object for an unknown or absent category", () => {
    expect(deriveContactSeed("en", "not-a-category", "/en")).toEqual({});
    expect(deriveContactSeed("en", undefined, "/en")).toEqual({});
  });

  it("omits the subject for a problem category when `from` is not a safe same-site path", () => {
    // "from" feeds an off-site or otherwise unsafe redirect target, so any
    // input that isn't a genuine same-site path must not be echoed into the
    // subject line: "//" and "\\" are alternate path separators some
    // browsers treat as protocol-relative or host-switching, absolute URLs
    // point off-site outright, and a value with no leading "/" isn't a path.
    const unsafeFromValues = ["//evil.example", "https://evil.example", "\\evil", "en", undefined];

    for (const from of unsafeFromValues) {
      expect(deriveContactSeed("en", "problem", from)).toEqual({
        category: "problem",
        subject: undefined,
      });
    }
  });
});
