import { describe, expect, it } from "vitest";
import { editions } from "@/content/open-data";
import { openDataCopy } from "@/content/open-data/copy";
import { trends, trendsIntro } from "@/content/open-data/trends";
import {
  buildCsv,
  columnTotal,
  formatMoney,
  formatTableDate,
  isBilingual,
  type Bilingual,
  type Dataset,
  type Topic,
  YEARS,
} from "@/lib/open-data";

const topics: Topic[] = editions.flatMap((e) => e.topics);
const trendDatasets: Dataset[] = trends.map((s) => s.dataset);
const about = editions.flatMap((e) => e.about);
const datasets: Dataset[] = [...topics.flatMap((t) => t.datasets), ...trendDatasets];

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
  ...editions.flatMap((e) =>
    (["en", "th"] as const).map((l) => [`${e.slug}.lede.${l}`, e.lede[l]] as [string, string])
  ),
  ...trendsIntro.flatMap((b, i) =>
    (["en", "th"] as const).map((l) => [`trendsIntro[${i}].${l}`, b[l]] as [string, string])
  ),
  ...trends.flatMap((sec) => {
    const parts: [string, Bilingual | undefined][] = [
      ["title", sec.title],
      ["summary", sec.summary],
      ["chart.title", sec.chart.title],
      ["chart.subtitle", sec.chart.subtitle],
      ["chart.alt", sec.chart.alt],
      ["tile.label", sec.tile?.label],
      ["tile.context", sec.tile?.context],
      ["dataset.title", sec.dataset.title],
      ["dataset.summary", sec.dataset.summary],
      ["dataset.source", sec.dataset.source],
      ["dataset.period", sec.dataset.period],
      ...sec.mainPoints.map((p, i) => [`mainPoints[${i}]`, p] as [string, Bilingual]),
      ...(sec.dataset.notes ?? []).map((n, i) => [`notes[${i}]`, n] as [string, Bilingual]),
      ...sec.dataset.columns.map((c) => [`columns.${c.key}`, c.label] as [string, Bilingual]),
      ...sec.dataset.rows.flatMap((row, r) =>
        Object.entries(row)
          .filter(([, v]) => isBilingual(v))
          .map(([k, v]) => [`rows[${r}].${k}`, v as Bilingual] as [string, Bilingual])
      ),
    ];
    return parts.flatMap(([path, b]) =>
      b
        ? (["en", "th"] as const).map(
            (l) => [`trends.${sec.id}.${path}.${l}`, b[l]] as [string, string]
          )
        : []
    );
  }),
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

  it("dates English by the Gregorian calendar and Thai by the Buddhist Era", () => {
    const beYear = /(?<![\d,.])25[5-7]\d(?![\d,.])/;
    const ceYear = /(?<![\d,.])20[12]\d(?![\d,.])/;
    // Thai letters only: the baht sign shares the Thai Unicode block.
    const thaiLetter = /[ก-ฺเ-๛]/;
    for (const [path, s] of allStrings) {
      if (path.endsWith(".en")) expect(s, path).not.toMatch(beYear);
      // Proper names such as "Polsci Inter Union 2026" keep their own year.
      if (path.endsWith(".th") && thaiLetter.test(s)) expect(s, path).not.toMatch(ceYear);
    }
  });
});

describe("open data trends", () => {
  it("has unique, URL-safe section ids", () => {
    const ids = trends.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("fills every string in both languages, with 2 to 4 main points", () => {
    for (const sec of trends) {
      expect(sec.mainPoints.length, sec.id).toBeGreaterThanOrEqual(2);
      expect(sec.mainPoints.length, sec.id).toBeLessThanOrEqual(4);
    }
    for (const [path, s] of allStrings.filter(([p]) => p.startsWith("trends."))) {
      expect(s.trim(), path).not.toBe("");
    }
  });

  it("draws year charts from one row per year, oldest first, using real columns", () => {
    const longs = YEARS.map((y) => y.long.en);
    for (const sec of trends) {
      const keys = sec.dataset.columns.map((c) => c.key);
      if (sec.chart.kind === "columns") {
        expect(keys).toContain("year");
        expect(keys).toContain(sec.chart.valueKey);
        const years = sec.dataset.rows.map((r) => (isBilingual(r.year) ? r.year.en : ""));
        expect(years, sec.id).toEqual(longs);
      }
      if (sec.chart.kind === "multiples") {
        expect(keys).toContain("year");
        expect(keys).toContain(sec.chart.groupKey);
        expect(keys).toContain(sec.chart.valueKey);
        for (const r of sec.dataset.rows) {
          expect(longs, sec.id).toContain(isBilingual(r.year) ? r.year.en : "");
        }
      }
      if (sec.chart.kind === "matrix") {
        const legend = sec.chart.legend.map((l) => l.value.en);
        expect(sec.dataset.columns.slice(1).map((c) => c.label.en)).toEqual(longs);
        for (const r of sec.dataset.rows) {
          for (const c of sec.dataset.columns.slice(1)) {
            const v = r[c.key];
            expect(legend, `${sec.id} ${c.key}`).toContain(isBilingual(v) ? v.en : "");
          }
        }
      }
    }
  });

  it("only puts year charts on the index as tiles", () => {
    for (const sec of trends.filter((s) => s.tile)) expect(sec.chart.kind).toBe("columns");
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
