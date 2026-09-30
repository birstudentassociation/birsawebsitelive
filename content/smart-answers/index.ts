/**
 * Barrel for Smart Answers: the assembled service and the shared UI microcopy
 * used by the pages that host a check.
 *
 * Topic files each export a fragment of the same shape as the service. They
 * are concatenated here rather than nested, because there is one graph and
 * `validateService` checks the result as a single object (see
 * `tests/unit/smart-answers.test.ts`).
 *
 * Copy lives here rather than in `content/dictionaries` because it is
 * specific to this feature's chrome, mirroring how other features author
 * their own inline bilingual copy (see `content/student-life/tracks.ts`).
 */
import type { Locale } from "@/lib/i18n";
import type { SmartAnswerService } from "./types";
import { contact } from "./topics/contact";
import { activities } from "./topics/activities";

const fragments: SmartAnswerService[] = [activities, contact];

export const service: SmartAnswerService = {
  topics: fragments.flatMap((fragment) => fragment.topics),
  nodes: fragments.flatMap((fragment) => fragment.nodes),
};

export type SmartAnswersUiCopy = {
  /** Flow chrome. */
  continueLabel: string;
  back: string;
  yourAnswers: string;
  change: string;
  startAgain: string;
  /** Summary line of the collapsible satisfaction feedback shown once an outcome is reached. */
  feedbackSummary: string;
  /** Legend for the satisfaction feedback form inside that disclosure. */
  feedbackHeading: string;
  /** Outcome chrome. */
  whoDecides: string;
  basedOn: string;
  readMore: string;
  /** The "challenge a decision" section: disagreeing with or querying this outcome. */
  notAnswered: string;
  notAnsweredAction: string;
  guidanceDisclaimer: string;
};

export const uiCopy: Record<Locale, SmartAnswersUiCopy> = {
  en: {
    continueLabel: "Continue",
    back: "Back",
    yourAnswers: "Your answers",
    change: "Change",
    startAgain: "Start again",
    feedbackSummary: "Tell us what you thought of this answer",
    feedbackHeading: "What did you think of getting this answer?",
    whoDecides: "Who decides this",
    basedOn: "Based on",
    readMore: "More detail",
    notAnswered: "Think this outcome is wrong, or does not fit your situation?",
    notAnsweredAction: "Query this answer with BIRSA",
    guidanceDisclaimer:
      "This is guidance from BIRSA, a student association, not an official decision by the Faculty. If in doubt, confirm with the Faculty office.",
  },
  th: {
    continueLabel: "ถัดไป",
    back: "ย้อนกลับ",
    yourAnswers: "คำตอบของคุณ",
    change: "แก้ไข",
    startAgain: "เริ่มใหม่",
    feedbackSummary: "บอกเราว่าคุณคิดอย่างไรกับคำตอบนี้",
    feedbackHeading: "คุณคิดเห็นอย่างไรกับคำตอบที่ได้รับ",
    whoDecides: "ใครเป็นผู้ตัดสิน",
    basedOn: "อ้างอิงจาก",
    readMore: "อ่านเพิ่มเติม",
    notAnswered: "คิดว่าคำตอบนี้ไม่ถูกต้อง หรือไม่ตรงกับสถานการณ์ของคุณ",
    notAnsweredAction: "สอบถามหรือโต้แย้งคำตอบนี้กับ BIRSA",
    guidanceDisclaimer:
      "นี่เป็นคำแนะนำจาก BIRSA ซึ่งเป็นองค์กรนักศึกษา ไม่ใช่คำวินิจฉัยอย่างเป็นทางการของคณะ หากไม่แน่ใจ กรุณาตรวจสอบกับสำนักงานคณะอีกครั้ง",
  },
};
