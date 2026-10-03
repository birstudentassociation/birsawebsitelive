import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contacts, getContact, telHref, type EmergencyContact } from "@/content/emergency/contacts";
import { scenarioIds, scenarios } from "@/content/emergency/scenarios";
import { activeEmergency } from "@/content/emergency/active";
import { landingSections, helpNumbers } from "@/content/emergency/landing";
import type { EmergencyContent } from "@/content/emergency/types";
import {
  alertBanner,
  alertHeadline,
  alertUpdatedAt,
  formatAlertTime,
  getLiveAlert,
} from "@/lib/emergency";

const locales = ["en", "th"] as const;

function allText(content: EmergencyContent): string[] {
  return [
    content.title,
    content.summary,
    content.banner,
    ...content.now,
    ...content.sections.flatMap((section) => [
      section.heading,
      ...(section.body ?? []),
      ...(section.steps ?? []),
      ...(section.items ?? []),
      ...(section.directory ?? []).flatMap((entry) => [
        entry.heading,
        ...entry.places.flatMap((place) => [place.name, ...(place.detail ? [place.detail] : [])]),
        ...(entry.note ? [entry.note] : []),
        ...(entry.links ?? []).map((link) => link.label),
      ]),
      ...(section.actions ?? []).flatMap((action) => [
        action.label,
        ...(action.description ? [action.description] : []),
      ]),
      ...(section.stepByStep ?? []).flatMap((step) => [
        step.title,
        ...(step.blurb ? [step.blurb] : []),
        ...step.tasks.flatMap((task) => [task.label, ...(task.hint ? [task.hint] : [])]),
        ...(step.items ?? []),
      ]),
    ]),
  ];
}

describe("emergency guides", () => {
  it.each(scenarioIds)("%s is registered under its own id", (id) => {
    expect(scenarios[id].id).toBe(id);
  });

  it.each(scenarioIds)("%s has the same structure in English and Thai", (id) => {
    const { en, th } = scenarios[id];
    expect(th.now.length).toBe(en.now.length);
    expect(th.sections.map((section) => section.id)).toEqual(
      en.sections.map((section) => section.id)
    );
    en.sections.forEach((section, i) => {
      const other = th.sections[i]!;
      expect(Boolean(other.body), `${section.id} body`).toBe(Boolean(section.body));
      expect(other.steps?.length, `${section.id} steps`).toBe(section.steps?.length);
      expect(other.items?.length, `${section.id} items`).toBe(section.items?.length);
      expect(other.directory?.length, `${section.id} directory`).toBe(section.directory?.length);
      expect(other.links?.length, `${section.id} links`).toBe(section.links?.length);
      expect(
        other.actions?.map((a) => a.href),
        `${section.id} actions`
      ).toEqual(section.actions?.map((a) => a.href));
      expect(
        other.stepByStep?.map((step) => [step.id, ...step.tasks.map((t) => `${t.id} ${t.href}`)]),
        `${section.id} step by step`
      ).toEqual(
        section.stepByStep?.map((step) => [step.id, ...step.tasks.map((t) => `${t.id} ${t.href}`)])
      );
      expect(
        other.stepByStep?.map((step) => step.items?.length),
        `${section.id} step items`
      ).toEqual(section.stepByStep?.map((step) => step.items?.length));
    });
  });

  it.each(scenarioIds)("%s has content in every part", (id) => {
    for (const locale of locales) {
      const content = scenarios[id][locale];
      expect(content.now.length).toBeGreaterThanOrEqual(2);
      expect(content.now.length).toBeLessThanOrEqual(6);
      expect(content.sections.length).toBeGreaterThan(0);
      for (const section of content.sections) {
        expect(section.body || section.steps || section.items).toBeTruthy();
      }
      for (const text of allText(content)) expect(text.trim()).not.toBe("");
      for (const entry of content.sections.flatMap((section) => section.directory ?? [])) {
        expect(entry.heading.trim()).not.toBe("");
        expect(entry.places.length).toBeGreaterThan(0);
        const phones = [
          ...(entry.phones ?? []),
          ...entry.places.flatMap((place) => (place.phone ? [place.phone] : [])),
        ];
        for (const { phone, ext } of phones) {
          expect(phone).toMatch(/^\d+(-\d+)*$/);
          if (ext) expect(ext).toMatch(/^\d+$/);
        }
        for (const link of entry.links ?? []) expect(link.href).toMatch(/^https:\/\//);
      }
      for (const link of content.sections.flatMap((section) => section.links ?? [])) {
        expect(link.label.trim()).not.toBe("");
        expect(link.href).toMatch(/^(https:\/\/|\/[a-z0-9/._-]+$)/);
        if (link.href.startsWith("/")) {
          expect(existsSync(join(process.cwd(), "public", link.href)), link.href).toBe(true);
        }
      }
      for (const section of content.sections) {
        for (const action of section.actions ?? []) {
          expect(action.href).toMatch(/^\/emergency\/[a-z0-9/-]+$/);
        }
        const stepIds = (section.stepByStep ?? []).map((step) => step.id);
        expect(new Set(stepIds).size).toBe(stepIds.length);
        for (const step of section.stepByStep ?? []) {
          expect(step.tasks.length).toBeGreaterThan(0);
          const taskIds = step.tasks.map((task) => task.id);
          expect(new Set(taskIds).size).toBe(taskIds.length);
          for (const task of step.tasks) {
            if (task.href) expect(task.href).toMatch(/^(https:\/\/|\/[a-z0-9/-]+$)/);
          }
        }
      }
    }
  });

  it.each(scenarioIds)("%s section ids are unique kebab-case fragments", (id) => {
    const ids = scenarios[id].en.sections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const sectionId of ids) expect(sectionId).toMatch(/^[a-z]+(-[a-z]+)*$/);
    expect(ids).not.toContain("contacts");
  });

  it.each(scenarioIds)("%s follows the house style (no dashes, no colons in titles)", (id) => {
    for (const locale of locales) {
      const content = scenarios[id][locale];
      expect(content.title).not.toMatch(/:/);
      for (const text of allText(content)) expect(text).not.toMatch(/[–—]/);
    }
  });

  it.each(scenarioIds)("%s only refers to contacts that exist, once each", (id) => {
    const { keyContacts, moreContacts } = scenarios[id];
    const all = [...keyContacts, ...moreContacts];
    expect(keyContacts.length).toBeGreaterThan(0);
    expect(new Set(all).size).toBe(all.length);
    for (const contactId of all) expect(getContact(contactId), contactId).toBeDefined();
  });

  it.each(scenarioIds)("%s cites https sources and a valid review date", (id) => {
    const { sources, reviewed } = scenarios[id];
    expect(sources.length).toBeGreaterThan(0);
    for (const source of sources) {
      expect(source.href).toMatch(/^https:\/\//);
      expect(source.label.en.trim()).not.toBe("");
      expect(source.label.th.trim()).not.toBe("");
    }
    expect(reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(reviewed))).toBe(false);
  });
});

describe("emergency contacts", () => {
  it.each(Object.entries(contacts as Record<string, EmergencyContact>))(
    "%s is well formed",
    (_id, contact) => {
      expect(contact.name.en.trim()).not.toBe("");
      expect(contact.name.th.trim()).not.toBe("");
      if (contact.kind === "phone") {
        expect(contact.phone).toMatch(/^\d+(-\d+)*$/);
        const digits = contact.phone.replace(/-/g, "");
        expect(digits.length === 4 || digits.length === 3 || digits.length >= 9).toBe(true);
        if (contact.ext) expect(contact.ext).toMatch(/^\d+$/);
      }
      if (contact.kind === "web") expect(contact.url).toMatch(/^https:\/\//);
    }
  );

  it("dials exactly the digits it shows", () => {
    expect(telHref({ phone: "02-248-5115" })).toBe("tel:022485115");
    expect(telHref({ phone: "02-221-6111", ext: "3409" })).toBe("tel:022216111,3409");
    expect(telHref({ phone: "191" })).toBe("tel:191");
  });

  it("index call buttons are all phone lines", () => {
    for (const id of helpNumbers) expect(getContact(id)?.kind).toBe("phone");
  });
});

describe("emergency landing copy", () => {
  it("has matching sections in both languages", () => {
    expect(landingSections.th.map((s) => s.id)).toEqual(landingSections.en.map((s) => s.id));
  });
});

describe("live alert", () => {
  it("is off, or names a guide with valid times newest first", () => {
    if (!activeEmergency) {
      expect(getLiveAlert()).toBeNull();
      return;
    }
    expect(getLiveAlert()?.scenario.id).toBe(activeEmergency.scenario);
    if (activeEmergency.updatesAfter) {
      const ids = scenarios[activeEmergency.scenario].en.sections.map((section) => section.id);
      expect(ids).toContain(activeEmergency.updatesAfter);
    }
    const times = [activeEmergency.issuedAt, ...(activeEmergency.updates ?? []).map((u) => u.at)];
    for (const time of times) expect(time).toMatch(/\+07:00$/);
    const updates = (activeEmergency.updates ?? []).map((u) => Date.parse(u.at));
    expect(updates).toEqual([...updates].sort((a, b) => b - a));
    for (const update of activeEmergency.updates ?? []) {
      expect(update.points?.th.length).toBe(update.points?.en.length);
    }
    for (const locale of locales) {
      expect(activeEmergency.banner?.[locale] ?? "").not.toMatch(/[–—]/);
      for (const update of activeEmergency.updates ?? []) {
        expect(update.text[locale].trim()).not.toBe("");
        expect(update.text[locale]).not.toMatch(/[–—]/);
        for (const point of update.points?.[locale] ?? []) {
          expect(point.trim()).not.toBe("");
          expect(point).not.toMatch(/[–—]/);
        }
      }
    }
  });

  const alert = {
    scenario: "flooding" as const,
    issuedAt: "2026-10-12T07:30:00+07:00",
    updates: [
      {
        at: "2026-10-12T11:05:00+07:00",
        text: { en: "Update", th: "ความคืบหน้า" },
      },
    ],
  };

  it("resolves the named guide and falls back to its banner", () => {
    const live = getLiveAlert(alert)!;
    expect(live.scenario.id).toBe("flooding");
    expect(alertBanner(live, "en")).toBe(scenarios.flooding.en.banner);
  });

  it("prefers the alert's own banner text", () => {
    const live = getLiveAlert({ ...alert, banner: { en: "Custom", th: "ข้อความ" } })!;
    expect(alertBanner(live, "en")).toBe("Custom");
    expect(alertBanner(live, "th")).toBe("ข้อความ");
  });

  it("uses the headline on the alert panel and falls back to the banner", () => {
    const withBanner = getLiveAlert({ ...alert, banner: { en: "Short", th: "สั้น" } })!;
    expect(alertHeadline(withBanner, "en")).toBe("Short");
    const withHeadline = getLiveAlert({
      ...alert,
      banner: { en: "Short", th: "สั้น" },
      headline: { en: "Full", th: "เต็ม" },
    })!;
    expect(alertHeadline(withHeadline, "en")).toBe("Full");
    expect(alertBanner(withHeadline, "en")).toBe("Short");
  });

  it("reports the newest update as the last change", () => {
    expect(alertUpdatedAt(alert)).toBe("2026-10-12T11:05:00+07:00");
    expect(alertUpdatedAt({ scenario: "fire", issuedAt: "2026-10-12T07:30:00+07:00" })).toBe(
      "2026-10-12T07:30:00+07:00"
    );
  });

  it("formats times in Bangkok time", () => {
    expect(formatAlertTime("en", "2026-10-12T00:30:00Z")).toBe("12 October 2026, 07:30");
    expect(formatAlertTime("th", "2026-10-12T00:30:00Z")).toBe("12 ตุลาคม 2026 เวลา 07.30 น.");
  });
});
