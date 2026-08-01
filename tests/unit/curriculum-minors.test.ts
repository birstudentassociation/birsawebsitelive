import { describe, expect, it } from "vitest";
import type { Minor, MinorId, CategoryId } from "@/content/curriculum/types";

describe("the minor model", () => {
  it("names the three minors", () => {
    const ids: MinorId[] = ["governance", "publicAdministration", "globalPoliticalEconomy"];
    expect(ids).toHaveLength(3);
  });

  it("gives a minor a required list and an elective list", () => {
    const minor: Minor = {
      id: "governance",
      name: { en: "Governance and Transnational Studies", th: "ธรรมาภิบาลและการศึกษาข้ามชาติ" },
      required: ["PI380", "PI381", "PI382"],
      electives: ["PI385", "PI386"],
    };
    expect(minor.required).toHaveLength(3);
    expect(minor.electives.length).toBeGreaterThan(0);
  });

  it("has a single pooled category for minor courses", () => {
    const pooled: CategoryId = "minor";
    expect(pooled).toBe("minor");
  });
});
