import { describe, expect, it } from "vitest";
import { csvField } from "@/lib/csv";

describe("csvField", () => {
  it("neutralises values a spreadsheet would run as a formula", () => {
    expect(csvField('=HYPERLINK("x")')).toBe('"\'=HYPERLINK(""x"")"');
    expect(csvField("+1")).toBe("'+1");
    expect(csvField("@SUM(A1)")).toBe("'@SUM(A1)");
  });

  it("leaves plain text and negative numbers alone", () => {
    expect(csvField("Great page")).toBe("Great page");
    expect(csvField("-3")).toBe("-3");
    expect(csvField(null)).toBe("");
  });
});
