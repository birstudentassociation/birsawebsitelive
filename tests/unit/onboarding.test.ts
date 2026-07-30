import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  onboardingTracks,
  onboardingAudiences,
  getOnboardingTrack,
  onboardingUiCopy,
  type OnboardingTrack,
} from "@/content/onboarding";
import { locales } from "@/lib/i18n";
import { getGuideEntries, type GuideAudience } from "@/lib/content";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function nonEmpty(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

describe("onboardingAudiences", () => {
  it("is exactly home and international", () => {
    expect(new Set(onboardingAudiences)).toEqual(new Set(["home", "international"]));
  });
});

describe("onboardingTracks", () => {
  it("has exactly one track per audience", () => {
    expect(onboardingTracks.length).toBe(2);
    expect(new Set(onboardingTracks.map((track) => track.audience))).toEqual(
      new Set(["home", "international"])
    );
  });

  it("getOnboardingTrack resolves each audience and rejects unknown strings", () => {
    for (const audience of onboardingAudiences) {
      expect(getOnboardingTrack(audience)?.audience).toBe(audience);
    }
    expect(getOnboardingTrack("staff")).toBeNull();
    expect(getOnboardingTrack("")).toBeNull();
  });

  it("has 5 to 7 steps per track, each with at least one task", () => {
    for (const track of onboardingTracks) {
      expect(track.steps.length, `${track.audience} step count`).toBeGreaterThanOrEqual(5);
      expect(track.steps.length, `${track.audience} step count`).toBeLessThanOrEqual(7);
      for (const step of track.steps) {
        expect(
          step.tasks.length,
          `${track.audience}/${step.id} should have at least one task`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("has unique step ids within each track", () => {
    for (const track of onboardingTracks) {
      const ids = track.steps.map((step) => step.id);
      expect(new Set(ids).size, `${track.audience} step ids`).toBe(ids.length);
    }
  });

  it("has unique task ids within each track", () => {
    for (const track of onboardingTracks) {
      const ids = track.steps.flatMap((step) => step.tasks.map((task) => task.id));
      expect(new Set(ids).size, `${track.audience} task ids`).toBe(ids.length);
    }
  });

  it("every Bi string (track/step/task) is non-empty in both en and th", () => {
    for (const track of onboardingTracks) {
      expect(nonEmpty(track.title.en), `${track.audience} title.en`).toBe(true);
      expect(nonEmpty(track.title.th), `${track.audience} title.th`).toBe(true);
      expect(nonEmpty(track.lede.en), `${track.audience} lede.en`).toBe(true);
      expect(nonEmpty(track.lede.th), `${track.audience} lede.th`).toBe(true);

      for (const step of track.steps) {
        expect(nonEmpty(step.title.en), `${track.audience}/${step.id} title.en`).toBe(true);
        expect(nonEmpty(step.title.th), `${track.audience}/${step.id} title.th`).toBe(true);
        if (step.blurb) {
          expect(nonEmpty(step.blurb.en), `${track.audience}/${step.id} blurb.en`).toBe(true);
          expect(nonEmpty(step.blurb.th), `${track.audience}/${step.id} blurb.th`).toBe(true);
        }
        for (const task of step.tasks) {
          expect(nonEmpty(task.label.en), `${track.audience}/${step.id}/${task.id} label.en`).toBe(
            true
          );
          expect(nonEmpty(task.label.th), `${track.audience}/${step.id}/${task.id} label.th`).toBe(
            true
          );
          if (task.hint) {
            expect(nonEmpty(task.hint.en), `${track.audience}/${step.id}/${task.id} hint.en`).toBe(
              true
            );
            expect(nonEmpty(task.hint.th), `${track.audience}/${step.id}/${task.id} hint.th`).toBe(
              true
            );
          }
        }
      }
    }
  });

  it("connector is only 'and' or 'or' when present", () => {
    for (const track of onboardingTracks) {
      for (const step of track.steps) {
        if (step.connector !== undefined) {
          expect(["and", "or"]).toContain(step.connector);
        }
      }
    }
  });
});

describe("onboarding task hrefs", () => {
  it("every internal href starts with '/' and carries no locale prefix", () => {
    for (const track of onboardingTracks) {
      for (const step of track.steps) {
        for (const task of step.tasks) {
          if (!task.href || task.external) continue;
          expect(task.href.startsWith("/"), `${task.id} href should start with "/"`).toBe(true);
          expect(task.href, `${task.id} href must not be locale-prefixed`).not.toMatch(
            /^\/(en|th)(\/|$)/
          );
        }
      }
    }
  });

  it("every external task is marked external and uses https://", () => {
    for (const track of onboardingTracks) {
      for (const step of track.steps) {
        for (const task of step.tasks) {
          if (!task.external) continue;
          expect(task.external, `${task.id} should be external:true`).toBe(true);
          expect(task.href, `${task.id} external href`).toBeDefined();
          expect(
            task.href!.startsWith("https://"),
            `${task.id} external href must be https://`
          ).toBe(true);
        }
      }
    }
  });

  // Build an allowlist of real internal routes from the content system (guide
  // slugs + handbook chapters) plus the known static routes the tracks link
  // to, then assert every task href resolves against it.
  const guideAudiences: GuideAudience[] = ["home", "international", "handbook"];
  const guideRoutes = new Set<string>();
  for (const audience of guideAudiences) {
    guideRoutes.add(`/student-life/${audience}`);
    for (const entry of getGuideEntries("en", audience)) {
      guideRoutes.add(`/student-life/${audience}/${entry.slug}`);
    }
  }

  const staticRoutes = new Set<string>([
    "/news",
    "/clubs",
    "/quick",
    "/contact",
    "/emergency",
    "/student-life",
    "/student-life/course-reviews",
    "/services/equipment-loan",
    "/activity/regulations",
    "/activity/student-bodies",
    "/activity/birsa",
  ]);

  const allowedRoutes = new Set<string>([...guideRoutes, ...staticRoutes]);

  it("every internal href points to a real, known route", () => {
    for (const track of onboardingTracks) {
      for (const step of track.steps) {
        for (const task of step.tasks) {
          if (!task.href || task.external) continue;
          expect(
            allowedRoutes.has(task.href),
            `${task.id} href "${task.href}" is not a known route`
          ).toBe(true);
        }
      }
    }
  });

  it("every linked handbook chapter file actually exists on disk (en and th)", () => {
    for (const track of onboardingTracks) {
      for (const step of track.steps) {
        for (const task of step.tasks) {
          if (!task.href?.startsWith("/student-life/handbook/")) continue;
          const slug = task.href.split("/").pop()!;
          for (const locale of locales) {
            const filePath = path.join(
              CONTENT_ROOT,
              "student-life",
              locale,
              "handbook",
              `${slug}.mdx`
            );
            expect(fs.existsSync(filePath), `${filePath} should exist`).toBe(true);
          }
        }
      }
    }
  });
});

describe("onboardingUiCopy", () => {
  it("has both locales with non-empty shared microcopy", () => {
    for (const locale of locales) {
      const t = onboardingUiCopy[locale];
      expect(nonEmpty(t.step)).toBe(true);
      expect(nonEmpty(t.and)).toBe(true);
      expect(nonEmpty(t.or)).toBe(true);
      expect(nonEmpty(t.newTab)).toBe(true);
      expect(nonEmpty(t.resetLabel)).toBe(true);
      expect(nonEmpty(t.gettingStarted)).toBe(true);
      expect(nonEmpty(t.markDone("Example task"))).toBe(true);
      expect(nonEmpty(t.progressLine(1, 3))).toBe(true);

      expect(nonEmpty(t.chooser.title)).toBe(true);
      expect(nonEmpty(t.chooser.lede)).toBe(true);
      expect(nonEmpty(t.chooser.homeTitle)).toBe(true);
      expect(nonEmpty(t.chooser.homeBody)).toBe(true);
      expect(nonEmpty(t.chooser.internationalTitle)).toBe(true);
      expect(nonEmpty(t.chooser.internationalBody)).toBe(true);
      expect(nonEmpty(t.chooser.allGuidesTitle)).toBe(true);
      expect(nonEmpty(t.chooser.allGuidesBody)).toBe(true);

      expect(nonEmpty(t.track.privacyTitle)).toBe(true);
      expect(nonEmpty(t.track.privacyBody)).toBe(true);
      expect(nonEmpty(t.track.privacyLinkLabel)).toBe(true);
      expect(nonEmpty(t.track.backToChooser)).toBe(true);
    }
  });

  it("markDone interpolates the task label and progressLine interpolates counts", () => {
    for (const locale of locales) {
      const t = onboardingUiCopy[locale];
      expect(t.markDone("Read the handbook")).toContain("Read the handbook");
      expect(t.progressLine(2, 5)).toContain("2");
      expect(t.progressLine(2, 5)).toContain("5");
    }
  });
});

// Type-level sanity check: ensures the imported type still matches what this
// file assumes without needing its own runtime assertions.
function assertTrackShape(track: OnboardingTrack): void {
  void track.audience;
  void track.title;
  void track.lede;
  void track.steps;
}
void assertTrackShape;
