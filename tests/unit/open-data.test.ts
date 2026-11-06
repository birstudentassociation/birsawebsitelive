import { describe, expect, it } from "vitest";
import { editions } from "@/content/open-data";
import { about } from "@/content/open-data/2025-26/about";
import { openDataCopy } from "@/content/open-data/copy";
import {
  buildCsv,
  columnTotal,
  formatMoney,
  formatTableDate,
  isBilingual,
  type Bilingual,
  type Dataset,
  type Topic,
} from "@/lib/open-data";

const topics: Topic[] = editions.flatMap((e) => e.topics);
const datasets: Dataset[] = topics.flatMap((t) => t.datasets);

/** Every bilingual string in a topic, with a path for readable failures. */
function bilingualStrings(topic: Topic): [string, Bilingual][] {
  const out: [string, Bilingual][] = [];
  const add = (path: string, b: Bilingual | undefined) => b && out.push([path, b]);
  add("title", topic.title);
  add("summary", topic.summary);
  add("warning", topic.warning);
  topic.mainPoints.forEach((p, i) => add(`mainPoints[${i}]`, p));
  topic.headlines?.forEach((h, i) => {
    add(`headlines[${i}].label`, h.label);
    add(`headlines[${i}].context`, h.context);
  });
  if (topic.chart) {
    add("chart.title", topic.chart.title);
    add("chart.subtitle", topic.chart.subtitle);
    add("chart.alt", topic.chart.alt);
  }
  for (const d of topic.datasets) {
    add(`${d.id}.title`, d.title);
    add(`${d.id}.summary`, d.summary);
    add(`${d.id}.source`, d.source);
    add(`${d.id}.period`, d.period);
    d.notes?.forEach((n, i) => add(`${d.id}.notes[${i}]`, n));
    d.columns.forEach((c) => add(`${d.id}.columns.${c.key}`, c.label));
    d.rows.forEach((row, r) => {
      for (const [k, v] of Object.entries(row)) {
        if (isBilingual(v)) add(`${d.id}.rows[${r}].${k}`, v);
      }
    });
  }
  return out;
}

const allStrings: [string, string][] = [
  ...topics.flatMap((t) =>
    bilingualStrings(t).flatMap(([path, b]) =>
      (["en", "th"] as const).map((l) => [`${t.slug}.${path}.${l}`, b[l]] as [string, string])
    )
  ),
  ...about.flatMap((s) =>
    [s.heading, ...(s.paragraphs ?? []), ...(s.items ?? [])].flatMap((b, i) =>
      (["en", "th"] as const).map((l) => [`about.${s.id}[${i}].${l}`, b[l]] as [string, string])
    )
  ),
];

describe("open data editions", () => {
  it("has at least one edition with topics", () => {
    expect(editions.length).toBeGreaterThan(0);
    expect(topics.length).toBeGreaterThan(0);
  });

  it("uses unique, URL-safe topic slugs and dataset ids", () => {
    for (const edition of editions) {
      const slugs = edition.topics.map((t) => t.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      expect(slugs).not.toContain("about-the-data");
    }
    for (const topic of topics) {
      expect(topic.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      const ids = topic.datasets.map((d) => d.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe.each(topics.map((t) => [t.slug, t] as const))("topic %s", (_slug, topic) => {
  it("has a title, summary, 3 to 6 main points and at least one dataset", () => {
    expect(topic.title.en && topic.title.th).toBeTruthy();
    expect(topic.summary.en && topic.summary.th).toBeTruthy();
    expect(topic.mainPoints.length).toBeGreaterThanOrEqual(3);
    expect(topic.mainPoints.length).toBeLessThanOrEqual(6);
    expect(topic.datasets.length).toBeGreaterThan(0);
    expect(topic.headlines?.length ?? 0).toBeLessThanOrEqual(4);
  });

  it("fills every bilingual string in both languages", () => {
    for (const [path, b] of bilingualStrings(topic)) {
      expect(b.en.trim(), `${path}.en`).not.toBe("");
      expect(b.th.trim(), `${path}.th`).not.toBe("");
    }
  });

  it("points its chart at a real dataset and columns", () => {
    if (!topic.chart) return;
    const d = topic.datasets.find((x) => x.id === topic.chart!.datasetId);
    expect(d).toBeDefined();
    const keys = d!.columns.map((c) => c.key);
    expect(keys).toContain(topic.chart.labelKey);
    expect(keys).toContain(topic.chart.valueKey);
  });
});

describe.each(datasets.map((d) => [d.id, d] as const))("dataset %s", (_id, dataset) => {
  it("has rows whose keys and value types match its columns", () => {
    expect(dataset.rows.length).toBeGreaterThan(0);
    const byKey = new Map(dataset.columns.map((c) => [c.key, c]));
    for (const [r, row] of dataset.rows.entries()) {
      for (const key of Object.keys(row)) {
        expect(byKey.has(key), `row ${r} has unknown key ${key}`).toBe(true);
      }
      for (const column of dataset.columns) {
        const v = row[column.key];
        if (v === null || v === undefined) continue;
        const where = `row ${r} column ${column.key}`;
        if (column.kind === "money" || column.kind === "number" || column.kind === "percent") {
          expect(typeof v, where).toBe("number");
        } else if (column.kind === "date") {
          expect(String(v), where).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
        }
      }
    }
  });

  it("only totals numeric columns", () => {
    for (const c of dataset.columns.filter((c) => c.total)) {
      expect(["money", "number"]).toContain(c.kind);
    }
  });

  it("adds up to any total stated in its source", () => {
    for (const [key, total] of Object.entries(dataset.declaredTotal ?? {})) {
      expect(columnTotal(dataset, key)).toBeCloseTo(total, 2);
    }
  });

  it("has no column that could hold a person", () => {
    const personal =
      /\b(name|nickname|phone|e-?mail|student id|line id|signature|witness|approver)\b|ชื่อ|เบอร์|อีเมล|รหัสนักศึกษา/i;
    for (const c of dataset.columns) {
      expect(`${c.key} ${c.label.en}`, c.key).not.toMatch(personal);
      // "ชื่อ" alone also appears in "ชื่อชมรม" (club name) and "ชื่อโครงการ" (project name).
      expect(
        c.label.th.replace(/ชื่อ(ชมรม|โครงการ|กิจกรรม|ตำแหน่ง|รายการ)/g, ""),
        c.key
      ).not.toMatch(personal);
    }
  });

  it("builds a rectangular CSV with a header row", () => {
    for (const locale of ["en", "th"] as const) {
      const csv = buildCsv(dataset, locale);
      expect(csv.startsWith("﻿")).toBe(true);
      const lines = csv.trimEnd().split("\r\n");
      expect(lines.length).toBe(dataset.rows.length + 1);
    }
  });
});

describe("open data text", () => {
  it("contains no email addresses, phone numbers or student ID numbers", () => {
    for (const [path, s] of allStrings) {
      expect(s, path).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
      expect(s, path).not.toMatch(/\b0\d{1,2}[\s-]?\d{3}[\s-]?\d{4}\b/);
      expect(s, path).not.toMatch(/\b6\d{9}\b/);
    }
    for (const d of datasets) {
      for (const row of d.rows) {
        for (const v of Object.values(row)) {
          if (typeof v === "string") {
            expect(v).not.toMatch(/@|\b6\d{9}\b|\b0\d{8,9}\b/);
          }
        }
      }
    }
  });

  it("uses no dashes and no colons outside clock times", () => {
    const shared = Object.values(openDataCopy).flatMap((c) =>
      Object.values(c).filter((v): v is string => typeof v === "string")
    );
    for (const [path, s] of [
      ...allStrings,
      ...shared.map((s) => ["copy", s] as [string, string]),
    ]) {
      expect(s, path).not.toMatch(/[‒–—―]| - /);
      expect(s.replace(/\b\d{1,2}:\d{2}\b/g, ""), path).not.toMatch(/:/);
    }
  });
});

describe("open data formatting", () => {
  it("formats baht with a sign, separators and consistent decimals", () => {
    expect(formatMoney(230822)).toBe("฿230,822");
    expect(formatMoney(6193.46, 2)).toBe("฿6,193.46");
    expect(formatMoney(-630)).toBe("−฿630");
  });

  it("formats table dates after ONS, without commas", () => {
    expect(formatTableDate("en", "2026-03-05")).toBe("5 Mar 2026");
    expect(formatTableDate("en", "2025-06-29")).toBe("29 June 2025");
    expect(formatTableDate("en", "2025-07")).toBe("July 2025");
    expect(formatTableDate("th", "2026-03-05")).toBe("5 มี.ค. 2569");
  });
});
