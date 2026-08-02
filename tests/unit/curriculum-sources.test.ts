import { describe, expect, it } from "vitest";
import { SOURCES, type SourceDocument } from "@/content/curriculum/sources";

describe("SOURCES", () => {
  it("records all nine crawled documents", () => {
    expect(Object.keys(SOURCES)).toHaveLength(9);
  });

  it("gives every document an absolute url and an ISO retrieval date", () => {
    for (const [id, doc] of Object.entries(SOURCES) as [string, SourceDocument][]) {
      expect(doc.url, `${id} url`).toMatch(/^https:\/\//);
      expect(doc.retrieved, `${id} retrieved`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(doc.title.trim().length, `${id} title`).toBeGreaterThan(0);
    }
  });

  it("keys each document by its own id", () => {
    for (const [id, doc] of Object.entries(SOURCES)) {
      expect(doc.id).toBe(id);
    }
  });
});
