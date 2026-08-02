import { describe, expect, it } from "vitest";
import { SOURCES, type SourceDocument } from "@/content/curriculum/sources";

describe("SOURCES", () => {
  it("records all eleven crawled or supplied documents", () => {
    expect(Object.keys(SOURCES)).toHaveLength(11);
  });

  it("gives every document either an absolute url or a note on how it was supplied, and an ISO retrieval date", () => {
    for (const [id, doc] of Object.entries(SOURCES) as [string, SourceDocument][]) {
      const hasUrl = /^https:\/\//.test(doc.url);
      const hasNote = Boolean(doc.note && doc.note.trim().length > 0);
      expect(hasUrl || hasNote, `${id} must have an https url or a note`).toBe(true);
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
