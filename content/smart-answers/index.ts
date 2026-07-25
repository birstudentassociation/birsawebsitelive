/**
 * Barrel for the Smart Answers feature: the flow registry plus the shared
 * step-page microcopy ("Continue", "Back", "Your answers", ...) used by
 * `app/[lang]/answers/[flow]/q/page.tsx`. Kept here (not in
 * `content/dictionaries`) since it's specific to this feature's UI chrome,
 * mirroring how other features author their own inline bilingual copy (see
 * `content/student-life/tracks.ts`).
 */
import type { Locale } from "@/lib/i18n";
import type { SmartAnswerFlow } from "./types";
import { activityApproval } from "./activity-approval";
import { whoToContact } from "./who-to-contact";
import { startAClubCheck } from "./start-a-club-check";

/** Every published Smart Answers flow, in the order shown on `/answers`. */
export const flows: SmartAnswerFlow[] = [activityApproval, whoToContact, startAClubCheck];

export function getFlow(slug: string): SmartAnswerFlow | undefined {
  return flows.find((flow) => flow.slug === slug);
}

export type SmartAnswersUiCopy = {
  hub: string;
  hubLede: string;
  startNow: string;
  whatYoullBeAsked: string;
  continueLabel: string;
  back: string;
  yourAnswers: string;
  change: string;
  startAgain: string;
  basedOn: string;
  guidanceDisclaimer: string;
};

export const uiCopy: Record<Locale, SmartAnswersUiCopy> = {
  en: {
    hub: "Get an answer",
    hubLede:
      "Guided checks based on BIRSA's rules and services. Answer a few questions to see where you stand.",
    startNow: "Start now",
    whatYoullBeAsked: "What you'll be asked",
    continueLabel: "Continue",
    back: "Back",
    yourAnswers: "Your answers",
    change: "Change",
    basedOn: "Based on",
    startAgain: "Start again",
    guidanceDisclaimer:
      "This is guidance from BIRSA, a student association, not an official decision by the Faculty. If in doubt, confirm with the Faculty office.",
  },
  th: {
    hub: "ค้นหาคำตอบ",
    hubLede:
      "แบบตอบคำถามสั้น ๆ เกี่ยวกับกฎระเบียบและบริการของ BIRSA ตอบไม่กี่คำถามเพื่อเช็กสถานะของคุณ",
    startNow: "เริ่มทำแบบสอบถาม",
    whatYoullBeAsked: "คำถามที่จะเจอ",
    continueLabel: "ถัดไป",
    back: "ย้อนกลับ",
    yourAnswers: "คำตอบของคุณ",
    change: "แก้ไข",
    basedOn: "อ้างอิงจาก",
    startAgain: "เริ่มใหม่",
    guidanceDisclaimer:
      "นี่เป็นคำแนะนำจาก BIRSA ซึ่งเป็นองค์กรนักศึกษา ไม่ใช่คำวินิจฉัยอย่างเป็นทางการของคณะ หากไม่แน่ใจ กรุณาตรวจสอบกับสำนักงานคณะอีกครั้ง",
  },
};
