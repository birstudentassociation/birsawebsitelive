import { describe, expect, it } from "vitest";
import { bangkokDistricts, districtsCheckedAt } from "@/content/emergency/districts";
import { scenarioIds, scenarios } from "@/content/emergency/scenarios";
import { matchDistricts, normaliseDistrict, resolveDistrict } from "@/lib/emergency-districts";

const kinds = ["sandbags", "shelters", "parking"] as const;

describe("Bangkok district data", () => {
  it("lists all 50 districts once each", () => {
    expect(bangkokDistricts).toHaveLength(50);
    const ids = bangkokDistricts.map((district) => district.id);
    expect(new Set(ids).size).toBe(50);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    const th = bangkokDistricts.map((district) => district.name.th);
    expect(new Set(th).size).toBe(50);
  });

  it("gives every place both languages, an https source and a dialable phone", () => {
    for (const district of bangkokDistricts) {
      if (district.officePhone) expect(district.officePhone).toMatch(/^\d+(-\d+)*$/);
      for (const kind of kinds) {
        const names = district[kind].map((place) => place.name.en);
        expect(new Set(names).size, `${district.id} ${kind}`).toBe(names.length);
        for (const place of district[kind]) {
          expect(place.name.en.trim(), district.id).not.toBe("");
          expect(place.name.th.trim(), district.id).not.toBe("");
          if (place.detail) {
            expect(place.detail.en.trim(), district.id).not.toBe("");
            expect(place.detail.th.trim(), district.id).not.toBe("");
          }
          if (place.phone) expect(place.phone).toMatch(/^\d+(-\d+)*$/);
          expect(place.source).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("follows the house style (no dashes, no colons outside clock times)", () => {
    for (const district of bangkokDistricts) {
      for (const kind of kinds) {
        for (const place of district[kind]) {
          for (const text of [
            place.name.en,
            place.name.th,
            place.detail?.en ?? "",
            place.detail?.th ?? "",
          ]) {
            expect(text, district.id).not.toMatch(/[–—]| - /);
            expect(text.replace(/\d{1,2}:\d{2}/g, ""), district.id).not.toMatch(/:/);
          }
        }
      }
    }
  });

  it("has a valid check time", () => {
    expect(Number.isNaN(Date.parse(districtsCheckedAt))).toBe(false);
  });

  it("is only searched from sections that name what to show, in both languages alike", () => {
    for (const id of scenarioIds) {
      const { en, th } = scenarios[id];
      en.sections.forEach((section, i) => {
        const other = th.sections[i]!;
        expect(other.districtFinder?.kinds).toEqual(section.districtFinder?.kinds);
        for (const finder of [section.districtFinder, other.districtFinder]) {
          if (!finder) continue;
          expect(finder.kinds.length).toBeGreaterThan(0);
          expect(finder.prompt.trim()).not.toBe("");
          expect(finder.prompt).not.toMatch(/[–—:]/);
        }
      });
    }
  });
});

describe("district matching", () => {
  const find = (query: string) => resolveDistrict(bangkokDistricts, query)?.id ?? null;

  it("folds spacing, case, prefixes and old romanisations", () => {
    expect(normaliseDistrict("Khet Lat Phrao")).toBe(normaliseDistrict("ladprao"));
    expect(normaliseDistrict("เขต ลาดพร้าว")).toBe(normaliseDistrict("ลาดพร้าว"));
  });

  it.each([
    ["Lat Krabang", "lat-krabang"],
    ["lad krabang", "lat-krabang"],
    ["ลาดกระบัง", "lat-krabang"],
    ["เขตลาดกระบัง", "lat-krabang"],
    ["Minburi", "min-buri"],
    ["Sathorn", "sathon"],
    ["Klong Toey", "khlong-toei"],
    ["Huay Kwang", "huai-khwang"],
    ["Thonburi", "thon-buri"],
    ["Rajathevi", "ratchathewi"],
    ["ป้อมปราบ", "pom-prap-sattru-phai"],
    ["ราษฏร์บูรณะ", "rat-burana"],
    ["Don Muang", "don-mueang"],
    ["Chatuchak", "chatuchak"],
  ])("%s finds %s", (query, id) => {
    expect(find(query)).toBe(id);
  });

  it("does not guess when the text could mean several districts", () => {
    expect(find("Bang")).toBeNull();
    expect(find("")).toBeNull();
    expect(find("Chiang Mai")).toBeNull();
  });

  it("prefers an exact name over a longer one that contains it", () => {
    expect(find("Bangkok Noi")).toBe("bangkok-noi");
    expect(find("Watthana")).toBe("watthana");
    expect(matchDistricts(bangkokDistricts, "Watthana")[0]!.id).toBe("watthana");
  });

  it("returns every district for an empty query", () => {
    expect(matchDistricts(bangkokDistricts, "")).toHaveLength(50);
  });
});
