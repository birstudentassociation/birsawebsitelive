/**
 * Barrel for Smart Answers: the assembled service, the hub's grouping
 * vocabulary, and the shared UI microcopy used by `app/[lang]/answers/**`.
 *
 * Topic files each export a fragment of the same shape as the service. They
 * are concatenated here rather than nested, because the whole point of the
 * rewrite is that there is one graph: a question in `study.ts` can send
 * someone to an outcome in `triage.ts`, and `validateService` checks the
 * result as a single object (see `tests/unit/smart-answers.test.ts`).
 *
 * Copy lives here rather than in `content/dictionaries` because it is
 * specific to this feature's chrome, mirroring how other features author
 * their own inline bilingual copy (see `content/student-life/tracks.ts`).
 */
import type { Locale } from "@/lib/i18n";
import type { Bi, SmartAnswerService, TopicGroupId } from "./types";
import { triage } from "./topics/triage";
import { contact } from "./topics/contact";
import { activities } from "./topics/activities";
import { study } from "./topics/study";
import { living } from "./topics/living";
import { wellbeing } from "./topics/wellbeing";

const fragments: SmartAnswerService[] = [triage, contact, activities, study, living, wellbeing];

export const service: SmartAnswerService = {
  topics: fragments.flatMap((fragment) => fragment.topics),
  nodes: fragments.flatMap((fragment) => fragment.nodes),
};

/** The slug of the "not sure where to start" route, promoted on the hub. */
export const TRIAGE_SLUG = "start";

export type TopicGroup = { id: TopicGroupId; title: Bi; description: Bi };

/**
 * Hub groupings, in display order. Titles are what a student would call the
 * area, not what the institution calls it.
 */
export const topicGroupList: TopicGroup[] = [
  {
    id: "help",
    title: { en: "Getting help", th: "ขอความช่วยเหลือ" },
    description: {
      en: "Finding the right person, and what to do when something goes wrong.",
      th: "หาคนที่รับผิดชอบ และสิ่งที่ต้องทำเมื่อเกิดปัญหา",
    },
  },
  {
    id: "activities",
    title: { en: "Events, clubs and equipment", th: "กิจกรรม ชมรม และอุปกรณ์" },
    description: {
      en: "Running something, starting something, or borrowing what you need for it.",
      th: "การจัดกิจกรรม การเริ่มกลุ่มใหม่ และการยืมอุปกรณ์ที่ต้องใช้",
    },
  },
  {
    id: "study",
    title: { en: "Your degree", th: "การเรียน" },
    description: {
      en: "Registration, exams, grades, the internship, and choosing courses.",
      th: "การลงทะเบียน การสอบ เกรด การฝึกงาน และการเลือกวิชา",
    },
  },
  {
    id: "life",
    title: { en: "Living in Bangkok", th: "การใช้ชีวิตในกรุงเทพ" },
    description: {
      en: "Settling in, money, health, and getting around.",
      th: "การตั้งตัว เรื่องเงิน สุขภาพ และการเดินทาง",
    },
  },
  {
    id: "rights",
    title: { en: "Rights and representation", th: "สิทธิและการมีส่วนร่วม" },
    description: {
      en: "What you are entitled to, and who speaks for you.",
      th: "สิ่งที่คุณมีสิทธิได้รับ และใครเป็นตัวแทนของคุณ",
    },
  },
];

export type SmartAnswersUiCopy = {
  hub: string;
  hubLede: string;
  /** Hub search box. */
  searchLabel: string;
  searchHint: string;
  searchButton: string;
  searchResults: string;
  searchNoResults: string;
  searchClear: string;
  /** The "not sure" route promoted at the top of the hub. */
  triageHeading: string;
  triageLede: string;
  triageStart: string;
  /** Audience profile. */
  profileHeading: string;
  profileLede: string;
  profileEdit: string;
  profileSet: string;
  profileNone: string;
  profileSkip: string;
  profileSave: string;
  profilePrompt: string;
  profileClear: string;
  profileWhy: string;
  /** Flow chrome. */
  startNow: string;
  whatYoullBeAsked: string;
  continueLabel: string;
  back: string;
  yourAnswers: string;
  assumed: string;
  change: string;
  startAgain: string;
  /** Legend for the satisfaction feedback form shown once an outcome is reached. */
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
    hub: "Get an answer",
    hubLede:
      "Answer a few questions and get the part of the rules, the handbook or the service that applies to you.",
    searchLabel: "What do you need help with?",
    searchHint: "For example: visa, borrow a projector, missed an exam, start a club.",
    searchButton: "Search",
    searchResults: "Matching topics",
    searchNoResults:
      "No topic matched that. Pick from the list below, or start with the guided route.",
    searchClear: "Clear search",
    triageHeading: "Not sure where to start?",
    triageLede: "Describe your situation and we will take you to the part that covers it.",
    triageStart: "Start here",
    profileHeading: "Answers tailored to you",
    profileLede:
      "Tell us three things about yourself and the questions get shorter and the answers get more specific. You can skip this, and you can change it at any point.",
    profileEdit: "Change",
    profileSet: "Set this",
    profileNone: "Not set",
    profileSkip: "Skip this, show general answers",
    profileSave: "Save and continue",
    profilePrompt: "Get answers written for your situation",
    profileClear: "Clear and show general answers",
    profileWhy:
      "This is only kept in the address bar. Nothing is stored and nothing is sent to us.",
    startNow: "Start now",
    whatYoullBeAsked: "What you'll be asked",
    continueLabel: "Continue",
    back: "Back",
    yourAnswers: "Your answers",
    assumed: "From your profile",
    change: "Change",
    startAgain: "Start again",
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
    hub: "ค้นหาคำตอบ",
    hubLede:
      "ตอบคำถามไม่กี่ข้อ แล้วดูว่ากฎระเบียบ คู่มือนักศึกษา หรือบริการส่วนไหนที่ใช้กับกรณีของคุณ",
    searchLabel: "คุณต้องการความช่วยเหลือเรื่องอะไร",
    searchHint: "เช่น วีซ่า ยืมโปรเจกเตอร์ ขาดสอบ เริ่มชมรม",
    searchButton: "ค้นหา",
    searchResults: "หัวข้อที่ตรงกัน",
    searchNoResults: "ไม่พบหัวข้อที่ตรงกัน เลือกจากรายการด้านล่าง หรือเริ่มจากแบบสอบถามนำทาง",
    searchClear: "ล้างการค้นหา",
    triageHeading: "ยังไม่รู้ว่าต้องเริ่มตรงไหน",
    triageLede: "บอกสถานการณ์ของคุณ แล้วเราจะพาไปยังส่วนที่เกี่ยวข้อง",
    triageStart: "เริ่มที่นี่",
    profileHeading: "คำตอบที่ตรงกับคุณ",
    profileLede:
      "บอกข้อมูลสามอย่างเกี่ยวกับตัวคุณ คำถามจะสั้นลงและคำตอบจะเจาะจงขึ้น จะข้ามก็ได้ และแก้ไขได้ตลอด",
    profileEdit: "แก้ไข",
    profileSet: "ระบุข้อมูล",
    profileNone: "ยังไม่ได้ระบุ",
    profileSkip: "ข้ามไปก่อน ขอดูคำตอบทั่วไป",
    profileSave: "บันทึกและไปต่อ",
    profilePrompt: "ดูคำตอบที่เขียนสำหรับสถานการณ์ของคุณ",
    profileClear: "ล้างข้อมูลและดูคำตอบทั่วไป",
    profileWhy: "ข้อมูลนี้อยู่ในแถบที่อยู่เว็บเท่านั้น ไม่มีการบันทึกและไม่ได้ส่งมาที่เรา",
    startNow: "เริ่มทำแบบสอบถาม",
    whatYoullBeAsked: "คำถามที่จะเจอ",
    continueLabel: "ถัดไป",
    back: "ย้อนกลับ",
    yourAnswers: "คำตอบของคุณ",
    assumed: "จากข้อมูลของคุณ",
    change: "แก้ไข",
    startAgain: "เริ่มใหม่",
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
