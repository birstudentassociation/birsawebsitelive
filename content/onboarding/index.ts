/**
 * "Starting at BIR, step by step", track registry and shared UI microcopy.
 * All copy is authored natively in both languages inline (site convention:
 * see `content/student-life/tracks.ts`), never through `content/dictionaries`.
 */
import type { Locale } from "@/lib/i18n";
import type { OnboardingAudience, OnboardingTrack } from "./types";
import { homeTrack } from "./home";
import { internationalTrack } from "./international";

export type {
  Bi,
  OnboardingAudience,
  OnboardingStep,
  OnboardingTask,
  OnboardingTrack,
} from "./types";

export const onboardingAudiences: OnboardingAudience[] = ["home", "international"];

export function isOnboardingAudience(x: string): x is OnboardingAudience {
  return (onboardingAudiences as string[]).includes(x);
}

export const onboardingTracks: OnboardingTrack[] = [homeTrack, internationalTrack];

/** Returns the track for an audience, or `null` if the audience is unknown. */
export function getOnboardingTrack(audience: string): OnboardingTrack | null {
  return onboardingTracks.find((track) => track.audience === audience) ?? null;
}

export type OnboardingUiCopy = {
  /** "Step", followed by a number, e.g. "Step 1". */
  step: string;
  and: string;
  or: string;
  /** "(opens in a new tab)": visually-hidden suffix for external links. */
  newTab: string;
  /** "Mark "<label>" as done": the checkbox's accessible name. */
  markDone: (label: string) => string;
  /** "You have marked X of Y tasks as done.": the live progress line. */
  progressLine: (done: number, total: number) => string;
  resetLabel: string;
  gettingStarted: string;
  chooser: {
    title: string;
    lede: string;
    homeTitle: string;
    homeBody: string;
    internationalTitle: string;
    internationalBody: string;
    allGuidesTitle: string;
    allGuidesBody: string;
  };
  track: {
    privacyTitle: string;
    privacyBody: string;
    privacyLinkLabel: string;
    backToChooser: string;
  };
};

export const onboardingUiCopy: Record<Locale, OnboardingUiCopy> = {
  en: {
    step: "Step",
    and: "and",
    or: "or",
    newTab: "opens in a new tab",
    markDone: (label) => `Mark "${label}" as done`,
    progressLine: (done, total) =>
      total === 1
        ? `You have marked ${done} of ${total} task as done.`
        : `You have marked ${done} of ${total} tasks as done.`,
    resetLabel: "Reset your progress",
    gettingStarted: "Getting started",
    chooser: {
      title: "Starting at BIR, step by step",
      lede: "A checklist for your first weeks at BIR, with one track for each group of students. Tick each task when it is done. Your ticks are saved in this browser only. BIRSA cannot see them.",
      homeTitle: "I already live in Thailand",
      homeBody: "For students joining BIR from a Thai school or who already live in Thailand.",
      internationalTitle: "I am moving to Thailand to study",
      internationalBody:
        "For students moving to Bangkok from abroad, from the visa to the first week and your 90-day report.",
      allGuidesTitle: "Browse all student life guides",
      allGuidesBody: "See every guide if no track fits.",
    },
    track: {
      privacyTitle: "Your ticks stay in this browser",
      privacyBody:
        "Your ticks are saved in this browser only. BIRSA cannot see them. Select Reset your progress to clear them, or clear your browser's site data.",
      privacyLinkLabel: "Read the privacy notice",
      backToChooser: "Back to Getting started",
    },
  },
  th: {
    step: "ขั้นตอนที่",
    and: "และ",
    or: "หรือ",
    newTab: "เปิดในแท็บใหม่",
    markDone: (label) => `ทำเครื่องหมายว่า "${label}" เสร็จแล้ว`,
    progressLine: (done, total) => `ทำเครื่องหมายว่าเสร็จแล้ว ${done} จาก ${total} รายการ`,
    resetLabel: "ล้างความคืบหน้า",
    gettingStarted: "เริ่มต้นที่ BIR",
    chooser: {
      title: "เริ่มต้นที่ BIR ทีละขั้นตอน",
      lede: "รายการสิ่งที่ต้องทำในช่วงแรกที่ BIR แยกตามกลุ่มนักศึกษา ทำเสร็จแล้วติ๊กช่องไว้ ระบบเก็บรายการที่ติ๊กในเบราว์เซอร์นี้เท่านั้น BIRSA ไม่เห็นข้อมูลนี้",
      homeTitle: "ฉันอาศัยอยู่ในประเทศไทยแล้ว",
      homeBody: "สำหรับนักศึกษาที่เข้า BIR จากโรงเรียนในไทย หรืออาศัยอยู่ในประเทศไทยอยู่แล้ว",
      internationalTitle: "ฉันจะย้ายมาเรียนที่ประเทศไทย",
      internationalBody:
        "สำหรับนักศึกษาที่ย้ายมากรุงเทพฯ จากต่างประเทศ ตั้งแต่วีซ่า สัปดาห์แรก ไปจนถึงการรายงานตัว 90 วัน",
      allGuidesTitle: "ดูคู่มือชีวิตนักศึกษาทั้งหมด",
      allGuidesBody: "เลือกอ่านเองได้ทุกหัวข้อ ถ้าไม่มีกลุ่มใดตรงกับนักศึกษา",
    },
    track: {
      privacyTitle: "รายการที่ติ๊กอยู่ในเบราว์เซอร์นี้",
      privacyBody:
        'ระบบเก็บรายการที่ติ๊กไว้ในเบราว์เซอร์นี้เท่านั้น BIRSA ไม่เห็นข้อมูลนี้ กด "ล้างความคืบหน้า" เพื่อลบรายการ หรือล้างข้อมูลเว็บไซต์ในเบราว์เซอร์',
      privacyLinkLabel: "อ่านประกาศความเป็นส่วนตัว",
      backToChooser: "กลับไปหน้าเริ่มต้นที่ BIR",
    },
  },
};
