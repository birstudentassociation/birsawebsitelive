/**
 * "Starting at BIR: step by step", track registry and shared UI microcopy.
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
      title: "Starting at BIR: step by step",
      lede: "A step-by-step checklist for your first weeks at BIR, tailored to you. Tick things off as you go. Your progress stays in your browser and is never sent to us.",
      homeTitle: "I'm a Thai or home student",
      homeBody:
        "Start here if you're joining BIR from a Thai high school, or you already live in Thailand.",
      internationalTitle: "I'm an international student",
      internationalBody:
        "Start here if you're moving to Bangkok from abroad to study at BIR. A condensed Thai-language summary is also available for buddies and staff.",
      allGuidesTitle: "Browse all student life guides",
      allGuidesBody:
        "See every guide if no track fits, or if you want to explore at your own pace.",
    },
    track: {
      privacyTitle: "Your progress stays on this device",
      privacyBody:
        "Ticked tasks are saved only in this browser's local storage. We never see it, and it's never sent to BIRSA or anyone else. Use the reset button above to clear it, or clear it by clearing your browser's site data.",
      privacyLinkLabel: "Read the full privacy notice",
      backToChooser: "Back to Getting started",
    },
  },
  th: {
    step: "ขั้นตอนที่",
    and: "และ",
    or: "หรือ",
    newTab: "เปิดในแท็บใหม่",
    markDone: (label) => `ทำเครื่องหมายว่า "${label}" เสร็จแล้ว`,
    progressLine: (done, total) => `คุณทำเครื่องหมายว่าเสร็จแล้ว ${done} จาก ${total} รายการ`,
    resetLabel: "ล้างความคืบหน้า",
    gettingStarted: "เริ่มต้นที่ BIR",
    chooser: {
      title: "เริ่มต้นที่ BIR: ทีละขั้นตอน",
      lede: "เช็กลิสต์ทีละขั้นตอนสำหรับช่วงแรกที่ BIR ออกแบบตามกลุ่มนักศึกษา ติ๊กในช่องเมื่อทำเสร็จ ความคืบหน้าจะถูกบันทึกไว้ในเบราว์เซอร์ของคุณเท่านั้น ไม่ถูกส่งมาหาเรา",
      homeTitle: "ฉันเป็นนักศึกษาไทย",
      homeBody: "เริ่มที่นี่ถ้าคุณเข้าเรียน BIR ต่อจากโรงเรียนไทย หรืออาศัยอยู่ในประเทศไทยอยู่แล้ว",
      internationalTitle: "ฉันเป็นนักศึกษาต่างชาติ",
      internationalBody:
        "หน้านี้สรุปขั้นตอนสำหรับนักศึกษาต่างชาติที่ย้ายมาเรียนที่กรุงเทพฯ เขียนแบบสรุปย่อสำหรับเพื่อนบัดดี้และเจ้าหน้าที่ที่ดูแล",
      allGuidesTitle: "ดูคู่มือชีวิตนักศึกษาทั้งหมด",
      allGuidesBody:
        "ดูคู่มือทุกหัวข้อได้ หากไม่แน่ใจว่าเหมาะกับกลุ่มใด หรือต้องการดูภาพรวมทั้งหมดด้วยตัวเอง",
    },
    track: {
      privacyTitle: "ความคืบหน้าของคุณอยู่ในอุปกรณ์นี้เท่านั้น",
      privacyBody:
        "รายการที่ติ๊กไว้จะถูกบันทึกใน local storage ของเบราว์เซอร์นี้เท่านั้น เราไม่เห็นข้อมูลนี้ และไม่ถูกส่งไปให้ BIRSA หรือใครทั้งสิ้น ใช้ปุ่มล้างความคืบหน้าด้านบนเพื่อล้างข้อมูล หรือล้างได้จากการล้างข้อมูลเว็บไซต์ในเบราว์เซอร์",
      privacyLinkLabel: "อ่านประกาศความเป็นส่วนตัวฉบับเต็ม",
      backToChooser: "กลับไปหน้าเริ่มต้นที่ BIR",
    },
  },
};
