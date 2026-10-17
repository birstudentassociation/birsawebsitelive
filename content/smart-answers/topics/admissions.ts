/**
 * The "which admission round" check: which BIR rounds a prospective student
 * can apply through for 2027 entry.
 *
 * Grounding: the guides in `content/information/{en,th}/applying-to-bir/` and
 * the round data in `content/information/admissions.ts`. Outcome text takes
 * its dates, seats, fees and English minimums from that data file, so a change
 * there reaches this check without a second edit.
 *
 * The graph is stateless, so a choice that matters later is carried in the
 * node ids. `-s1` nodes belong to readers with an official SAT result, who
 * can use Inter-Portfolio 1, and `-s0` nodes to readers without one. The
 * school question decides which grade rule applies after the English test:
 * `m6` (in Mathayom 6 now) can also try Inter-Portfolio 2, `other` (finished
 * school, or an international or overseas school) goes straight to the GPAX
 * rule for TCAS 3, and `ged` to the GED score rule.
 *
 * Non-Thai applicants never see Thai rounds. They need the SAT for both
 * non-Thai rounds, and TCAS 3 is for Thai applicants only.
 *
 * The BIR office and its committee decide who is admitted, so every outcome
 * names them as the owner and says so in a note.
 */
import {
  englishTests,
  getAdmissionRound,
  GUIDE_BASE,
  type AdmissionRound,
  type AdmissionRoundId,
} from "@/content/information/admissions";
import { formatSpan } from "@/components/information/format";
import { formatGuideDate, type Locale } from "@/lib/i18n";
import type {
  Bi,
  OutcomeBlock,
  SmartAnswerAction,
  SmartAnswerNode,
  SmartAnswerOption,
  SmartAnswerOutcome,
  SmartAnswerRelated,
  SmartAnswerService,
} from "../types";

type Variant = "m6" | "other" | "ged";
type Sat = "s1" | "s0";

const variants: Variant[] = ["m6", "other", "ged"];
const sats: Sat[] = ["s1", "s0"];

const q = (name: string) => `bir-q-${name}`;
const out = (name: string) => `bir-out-${name}`;

/** Both languages for every locale, so a date can be built once per language. */
const bi = (make: (locale: Locale) => string): Bi => ({ en: make("en"), th: make("th") });

const yes: Bi = { en: "Yes", th: "ใช่" };
const no: Bi = { en: "No", th: "ไม่ใช่" };
const have: Bi = { en: "Yes, I have one", th: "มี" };
const haveNot: Bi = { en: "No, I do not have one", th: "ไม่มี" };

function yesNo(
  yesNext: string,
  noNext: string,
  labels: { yes: Bi; no: Bi } = { yes, no }
): SmartAnswerOption[] {
  return [
    { id: "yes", label: labels.yes, next: yesNext },
    { id: "no", label: labels.no, next: noNext },
  ];
}

/* -------------------------------------------------------------------------- */
/* Facts taken from admissions.ts                                             */
/* -------------------------------------------------------------------------- */

function roundById(id: AdmissionRoundId): AdmissionRound {
  const found = getAdmissionRound(id);
  if (!found) throw new Error(`admissions.ts has no round "${id}"`);
  return found;
}

/** The minimum scores, as one line for a question hint. */
const englishMinimums: Bi = {
  en: `${englishTests
    .map((test) => `${test.name.en} ${test.minimum.en.replace(/^At least/, "at least")}`)
    .join("; ")}.`,
  th: `${englishTests.map((test) => `${test.name.th} ${test.minimum.th}`).join(" หรือ ")}`,
};

/** "A", "A and B", "A, B and C". */
function listNames(ids: AdmissionRoundId[]): Bi {
  const names = (locale: Locale) => ids.map((id) => roundById(id).name[locale]);
  return bi((locale) => {
    const list = names(locale);
    const last = list[list.length - 1] as string;
    if (list.length === 1) return last;
    return `${list.slice(0, -1).join(", ")} ${locale === "th" ? "และ" : "and"} ${last}`;
  });
}

/** Where each round takes applications. */
const applyVia: Record<AdmissionRoundId, Bi> = {
  "inter-portfolio-1": { en: "on admission.polsci.tu.ac.th", th: "ที่ admission.polsci.tu.ac.th" },
  "inter-portfolio-2": { en: "on admission.polsci.tu.ac.th", th: "ที่ admission.polsci.tu.ac.th" },
  "tcas-3": { en: "on admission.polsci.tu.ac.th", th: "ที่ admission.polsci.tu.ac.th" },
  "non-thai-1": { en: "with the online Google Form", th: "ผ่าน Google Form" },
  "non-thai-2": { en: "with the online Google Form", th: "ผ่าน Google Form" },
};

function milestoneDate(round: AdmissionRound, id: string): Bi {
  const milestone = round.milestones.find((candidate) => candidate.id === id);
  if (!milestone || milestone.date === "tba") {
    throw new Error(`round "${round.id}" has no dated milestone "${id}"`);
  }
  const date = milestone.date;
  return bi((locale) => formatSpan(locale, date));
}

const nonThaiPrepare: Bi = {
  en: "Get a copy of your passport, a colour ID photo, your official transcript (or HSCES certificates), a certified copy of your official SAT score report, a CV and a statement of purpose of 500 to 1,000 words. Keep the bank slip when you pay.",
  th: "เตรียมสำเนาหนังสือเดินทาง รูปถ่ายสี ระเบียนแสดงผลการเรียนอย่างเป็นทางการหรือใบรับรอง HSCES สำเนารายงานผลสอบ SAT ฉบับทางการที่รับรองสำเนาแล้ว ประวัติส่วนตัว (CV) และ Statement of Purpose ความยาว 500 ถึง 1,000 คำ เก็บหลักฐานการโอนเงินไว้เมื่อชำระค่าสมัคร",
};

/** What to have ready, in the order the guides list it. */
const prepare: Record<AdmissionRoundId, Bi[]> = {
  "inter-portfolio-1": [
    {
      en: "Get certified copies of your ID card, transcript and student certificate (ปพ.7 if you are still studying, ปพ.2 if you have finished). Add your GPAX record (ปพ.1) or HSCES certificates, your official SAT score report and an ID photo.",
      th: "เตรียมสำเนาบัตรประชาชน ระเบียนแสดงผลการเรียน และหนังสือรับรองสถานะนักเรียน (ปพ.7 ถ้ายังเรียนอยู่ ปพ.2 ถ้าจบแล้ว) พร้อม ปพ.1 ที่แสดง GPAX หรือใบรับรอง HSCES ผลสอบ SAT ฉบับทางการ และรูปถ่าย โดยรับรองสำเนาถูกต้องด้วยตนเอง",
    },
  ],
  "inter-portfolio-2": [
    {
      en: "Write your portfolio on the BIR Inter-Portfolio template and export it as a PDF. Get certified copies of your ID card, transcript, Certificate of Student Status (ปพ.7) and English test score, and an ID photo.",
      th: "เขียนแฟ้มสะสมผลงานตามแบบฟอร์ม Inter-Portfolio ของ BIR แล้วส่งออกเป็นไฟล์ PDF เตรียมสำเนาบัตรประชาชน ระเบียนแสดงผลการเรียน ปพ.7 และผลสอบภาษาอังกฤษที่รับรองสำเนาถูกต้อง พร้อมรูปถ่าย",
    },
  ],
  "tcas-3": [
    {
      en: "Get certified copies of your ID card, transcript (or the HSCES GPAX Equivalence Certificate), student certificate (or the HSCES High School Equivalence Certificate) and English test score, and an ID photo.",
      th: "เตรียมสำเนาบัตรประชาชน ระเบียนแสดงผลการเรียนหรือใบรับรองการเทียบ GPAX จาก HSCES ปพ.7 หรือใบรับรองการเทียบวุฒิมัธยมศึกษาจาก HSCES และผลสอบภาษาอังกฤษ ที่รับรองสำเนาถูกต้อง พร้อมรูปถ่าย",
    },
    bi((locale) => {
      const exam = roundById("tcas-3").milestones.find((milestone) => milestone.id === "exam");
      const date =
        exam && exam.date !== "tba" ? formatGuideDate(locale, exam.date.start) : undefined;
      if (!date) throw new Error("tcas-3 has no dated written exam milestone");
      return locale === "th"
        ? `เตรียมสอบข้อเขียน BIR วันที่ ${date} ข้อสอบแบ่งเป็นความรู้ทั่วไปด้านการเมืองและความสัมพันธ์ระหว่างประเทศ 40 เปอร์เซ็นต์ และเรียงความภาษาอังกฤษ 60 เปอร์เซ็นต์`
        : `Prepare for the BIR written exam on ${date}. It is 40 percent general knowledge in politics and international relations and 60 percent English essay.`;
    }),
  ],
  "non-thai-1": [nonThaiPrepare],
  "non-thai-2": [nonThaiPrepare],
};

/** One round as a short list of what to do, with its dates, seats and fee. */
function roundBlock(id: AdmissionRoundId): OutcomeBlock {
  const round = roundById(id);
  const via = applyVia[id];

  const windows = round.window;
  const first = windows[0];
  if (!first) throw new Error(`round "${id}" has no application window`);
  const second = windows[1];

  const apply: Bi = second
    ? {
        en: `Apply for the BIR written exam ${via.en} between ${formatSpan("en", first)}. Then apply on myTCAS between ${formatSpan("en", second)}. The round has ${round.seats} seats.`,
        th: `สมัครสอบข้อเขียน BIR ${via.th} ระหว่างวันที่ ${formatSpan("th", first)} แล้วสมัครผ่าน myTCAS ระหว่างวันที่ ${formatSpan("th", second)} รอบนี้รับ ${round.seats} ที่นั่ง`,
      }
    : {
        en: `Apply ${via.en} between ${formatSpan("en", first)}. The round has ${round.seats} seats.`,
        th: `สมัคร${via.th} ระหว่างวันที่ ${formatSpan("th", first)} รอบนี้รับ ${round.seats} ที่นั่ง`,
      };

  // Inter-Portfolio 1 closes a day before its fee is due, which is easy to miss.
  const pay = round.milestones.find((milestone) => milestone.id === "pay");
  const payDate = pay ? milestoneDate(round, "pay") : undefined;
  const fee: Bi = {
    en: `The fee is ${round.fee.en}${payDate ? ` Pay by 23:59 on ${payDate.en}.` : ""}`,
    th: `${round.fee.th}${payDate ? ` ชำระภายใน 23.59 น. ของวันที่ ${payDate.th}` : ""}`,
  };

  return { kind: "steps", title: round.name, items: [...prepare[id], apply, fee] };
}

/* -------------------------------------------------------------------------- */
/* Shared outcome pieces                                                      */
/* -------------------------------------------------------------------------- */

const guide = (slug: string) => `${GUIDE_BASE}/${slug}`;

const officialNote: OutcomeBlock = {
  kind: "note",
  tone: "info",
  text: {
    en: "birpolsci.com is the official source. Dates and requirements can change, and the BIR committee decides who is admitted. Check birpolsci.com before you apply.",
    th: "birpolsci.com เป็นแหล่งข้อมูลทางการ กำหนดการและเกณฑ์อาจเปลี่ยนแปลง และคณะกรรมการ BIR เป็นผู้ตัดสินว่าใครได้รับคัดเลือก ตรวจสอบที่ birpolsci.com ก่อนสมัครทุกครั้ง",
  },
};

function certificateNote(includesTcas3: boolean): OutcomeBlock {
  return {
    kind: "note",
    tone: "info",
    text: {
      en: `If your school does not grade on a 4.0 scale, apply with the HSCES High School Equivalence Certificate and GPAX Equivalence Certificate.${
        includesTcas3
          ? " In TCAS 3, GED applicants send the GED diploma and score report instead."
          : ""
      }`,
      th: `ถ้าโรงเรียนของคุณไม่ได้ให้เกรดตามมาตรา 4.0 ให้สมัครด้วยใบรับรองการเทียบวุฒิมัธยมศึกษาและใบรับรองการเทียบ GPAX จาก HSCES${
        includesTcas3
          ? " ส่วนผู้ถือ GED ที่สมัครรอบ TCAS 3 ให้ส่ง GED diploma และ GED score report แทน"
          : ""
      }`,
    },
  };
}

const confirmNote: OutcomeBlock = {
  kind: "note",
  tone: "warning",
  text: {
    en: "Do not confirm a place on myTCAS before you apply. If you have already confirmed your right to a place in the TCAS Clearing House system, you cannot apply to BIR.",
    th: "อย่ายืนยันสิทธิ์ใน myTCAS ก่อนสมัคร BIR ผู้ที่ยืนยันสิทธิ์ในระบบ TCAS Clearing House ไปแล้วจะสมัครไม่ได้",
  },
};

const ip2Note: OutcomeBlock = {
  kind: "paragraph",
  text: {
    en: "Inter-Portfolio 2 is only for students who are in Mathayom 6 now. It also needs a GPAX of at least 3.75 over five semesters, an English test result and an achievement in social science.",
    th: "รอบ Inter-Portfolio 2 สำหรับนักเรียนที่กำลังเรียนชั้น ม.6 อยู่เท่านั้น และต้องมี GPAX ไม่ต่ำกว่า 3.75 จาก 5 ภาคการศึกษา ผลสอบภาษาอังกฤษ และผลงานด้านสังคมศาสตร์",
  },
};

const sat1Missing: OutcomeBlock = {
  kind: "paragraph",
  text: {
    en: "Inter-Portfolio 1 needs an official SAT Evidence-Based Reading and Writing result from the last 2 years, so it is not open to you yet.",
    th: "รอบ Inter-Portfolio 1 ต้องมีผลสอบ SAT ทางการ ส่วน Evidence-Based Reading and Writing ที่สอบมาไม่เกิน 2 ปี คุณจึงยังสมัครรอบนี้ไม่ได้",
  },
};

const tcas3Missing: OutcomeBlock = {
  kind: "paragraph",
  text: {
    en: "TCAS 3 needs an English test result at the minimum score from the last 2 years, and a GPAX of at least 2.80 over six semesters or an equivalent. With a GED it needs at least 165 in every subject. It is not open to you yet.",
    th: "รอบ TCAS 3 ต้องมีผลสอบภาษาอังกฤษตามเกณฑ์ขั้นต่ำที่สอบมาไม่เกิน 2 ปี และ GPAX ไม่ต่ำกว่า 2.80 จาก 6 ภาคการศึกษาหรือเทียบเท่า ผู้ถือ GED ต้องได้อย่างน้อย 165 ทุกวิชา คุณจึงยังสมัครรอบนี้ไม่ได้",
  },
};

const roundGuides: Record<AdmissionRoundId, { slug: string; label: Bi }> = {
  "inter-portfolio-1": {
    slug: "inter-portfolio-1",
    label: { en: "How to apply through Inter-Portfolio 1", th: "วิธีสมัครรอบ Inter-Portfolio 1" },
  },
  "inter-portfolio-2": {
    slug: "inter-portfolio-2",
    label: { en: "How to apply through Inter-Portfolio 2", th: "วิธีสมัครรอบ Inter-Portfolio 2" },
  },
  "tcas-3": {
    slug: "tcas-3-written-exam",
    label: { en: "How to apply through TCAS 3", th: "วิธีสมัครรอบ TCAS 3" },
  },
  "non-thai-1": {
    slug: "non-thai-applicants",
    label: { en: "How to apply if you are not Thai", th: "วิธีสมัครสำหรับผู้ที่ไม่มีสัญชาติไทย" },
  },
  "non-thai-2": {
    slug: "non-thai-applicants",
    label: { en: "How to apply if you are not Thai", th: "วิธีสมัครสำหรับผู้ที่ไม่มีสัญชาติไทย" },
  },
};

const officialSite: SmartAnswerAction = {
  label: { en: "Check birpolsci.com", th: "ตรวจสอบที่ birpolsci.com" },
  href: "https://www.birpolsci.com/prospectivestudents",
  external: true,
};

const related: SmartAnswerRelated[] = [
  {
    label: { en: "Compare the admission rounds", th: "เปรียบเทียบรอบรับสมัคร" },
    href: guide("admission-rounds"),
    description: {
      en: "Who can apply, the dates, the seats and the grades each round asks for.",
      th: "ใครสมัครได้ วันรับสมัคร จำนวนที่นั่ง และเกรดที่แต่ละรอบกำหนด",
    },
  },
  {
    label: { en: "Key dates for 2027 entry", th: "กำหนดการสำคัญรับเข้าศึกษาปี 2570" },
    href: guide("key-dates"),
  },
  {
    label: { en: "Documents you need", th: "เอกสารที่ต้องใช้" },
    href: guide("documents"),
  },
  {
    label: {
      en: "English tests and school qualifications",
      th: "ผลสอบภาษาอังกฤษและวุฒิการศึกษา",
    },
    href: guide("english-tests-and-qualifications"),
  },
];

const owner: Bi = {
  en: "The BIR committee at the Faculty of Political Science decides who is admitted. BIRSA is a student association and cannot confirm a place. Email bir@tu.ac.th or call 02-221-6111 ext. 3409.",
  th: "คณะกรรมการ BIR ที่คณะรัฐศาสตร์เป็นผู้ตัดสินว่าใครได้รับคัดเลือก BIRSA เป็นองค์กรนักศึกษาและยืนยันที่นั่งให้ไม่ได้ อีเมล bir@tu.ac.th หรือโทร 02-221-6111 ต่อ 3409",
};

/** An outcome for the Thai rounds the reader can use. */
function eligible(
  name: string,
  rounds: AdmissionRoundId[],
  explanation: OutcomeBlock[] = []
): SmartAnswerOutcome {
  const names = listNames(rounds);
  const includesTcas3 = rounds.includes("tcas-3");
  return {
    kind: "outcome",
    id: out(name),
    title: {
      en: `You can apply through ${names.en}`,
      th: `คุณสมัครรอบ ${names.th} ได้`,
    },
    summary: {
      en: `You meet the requirements for ${names.en}. The dates, seats and fees are below.`,
      th: `คุณมีคุณสมบัติครบสำหรับรอบ ${names.th} กำหนดการ จำนวนที่นั่ง และค่าใช้จ่ายอยู่ด้านล่าง`,
    },
    owner,
    body: [
      ...rounds.map(roundBlock),
      ...explanation,
      confirmNote,
      certificateNote(includesTcas3),
      officialNote,
    ],
    actions: [
      ...rounds.map((id) => ({
        label: roundGuides[id].label,
        href: guide(roundGuides[id].slug),
      })),
      officialSite,
    ],
    related,
  };
}

/* -------------------------------------------------------------------------- */
/* Questions                                                                  */
/* -------------------------------------------------------------------------- */

const satHint: Bi = {
  en: "Only an official result counts. It must be from the last 2 years.",
  th: "นับเฉพาะผลสอบอย่างเป็นทางการที่สอบมาไม่เกิน 2 ปี",
};

const satQuestion: Bi = {
  en: "Do you have an official SAT Evidence-Based Reading and Writing result from the last 2 years?",
  th: "คุณมีผลสอบ SAT ทางการ ส่วน Evidence-Based Reading and Writing ที่สอบมาไม่เกิน 2 ปีหรือไม่",
};

/** Where the English test question goes on a yes, by school. */
const afterEnglish: Record<Variant, string> = {
  m6: "gp375",
  other: "gpax280",
  ged: "ged165",
};

const questions: SmartAnswerNode[] = [
  {
    kind: "question",
    id: q("nationality"),
    question: { en: "Are you Thai?", th: "คุณมีสัญชาติไทยหรือไม่" },
    hint: {
      en: "Dual nationals with a Thai passport count as Thai.",
      th: "ผู้ถือสองสัญชาติที่ถือหนังสือเดินทางไทยนับเป็นผู้มีสัญชาติไทย",
    },
    options: [
      {
        id: "thai",
        label: { en: "Yes, I am Thai", th: "ใช่ สัญชาติไทย" },
        next: q("school"),
      },
      {
        id: "not-thai",
        label: { en: "No, I am not Thai", th: "ไม่ใช่ ไม่ได้มีสัญชาติไทย" },
        next: q("nt-sat"),
      },
    ],
  },

  {
    kind: "question",
    id: q("nt-sat"),
    question: satQuestion,
    hint: satHint,
    options: yesNo(out("non-thai"), out("non-thai-no-sat"), { yes: have, no: haveNot }),
  },

  {
    kind: "question",
    id: q("school"),
    question: { en: "Where are you in school?", th: "ตอนนี้คุณอยู่ในระดับการศึกษาไหน" },
    options: [
      {
        id: "m6",
        label: { en: "I am in Mathayom 6 now", th: "กำลังเรียนชั้น ม.6" },
        hint: { en: "Grade 12 at a Thai school.", th: "ชั้น ม.6 ของโรงเรียนในประเทศไทย" },
        next: q("sat-m6"),
      },
      {
        id: "graduated",
        label: {
          en: "I have finished Mathayom 6 or an equivalent",
          th: "จบ ม.6 หรือเทียบเท่าแล้ว",
        },
        next: q("sat-other"),
      },
      {
        id: "intl",
        label: {
          en: "I study at an international or overseas school that does not grade on a 4.0 scale",
          th: "เรียนที่โรงเรียนนานาชาติหรือโรงเรียนต่างประเทศที่ไม่ได้ให้เกรดตามมาตรา 4.0",
        },
        next: q("sat-other"),
      },
      {
        id: "ged",
        label: { en: "I have a GED", th: "ใช้วุฒิ GED" },
        next: q("sat-ged"),
      },
    ],
  },

  ...variants.map((variant): SmartAnswerNode => ({
    kind: "question",
    id: q(`sat-${variant}`),
    question: satQuestion,
    hint: satHint,
    options: yesNo(q(`eng-${variant}-s1`), q(`eng-${variant}-s0`), { yes: have, no: haveNot }),
  })),

  ...variants.flatMap((variant) =>
    sats.map((sat): SmartAnswerNode => ({
      kind: "question",
      id: q(`eng-${variant}-${sat}`),
      question: {
        en: "Do you have an English test result at the minimum score from the last 2 years?",
        th: "คุณมีผลสอบภาษาอังกฤษตามเกณฑ์ขั้นต่ำที่สอบมาไม่เกิน 2 ปีหรือไม่",
      },
      hint: {
        en: `The minimums are ${englishMinimums.en}`,
        th: `เกณฑ์ขั้นต่ำคือ ${englishMinimums.th}`,
      },
      options: yesNo(
        q(`${afterEnglish[variant]}-${sat}`),
        sat === "s1" ? out("ip1") : out("none"),
        { yes: have, no: haveNot }
      ),
    }))
  ),

  ...sats.map((sat): SmartAnswerNode => ({
    kind: "question",
    id: q(`gp375-${sat}`),
    question: {
      en: "Is your GPAX over 5 semesters 3.75 or higher?",
      th: "GPAX สะสม 5 ภาคการศึกษาของคุณอยู่ที่ 3.75 ขึ้นไปหรือไม่",
    },
    options: yesNo(q(`ach-${sat}`), q(`gpax280-${sat}`)),
  })),

  ...sats.map((sat): SmartAnswerNode => ({
    kind: "question",
    id: q(`ach-${sat}`),
    question: {
      en: "Do you have an achievement in one of these?",
      th: "คุณมีผลงานข้อใดข้อหนึ่งต่อไปนี้หรือไม่",
    },
    hint: {
      en: "An award in a national or international social science competition; a role as a national representative in international social science activities; a role as your school's representative in national social science activities; or a role as a publicly recognised leader of social activities in your community.",
      th: "ได้รับรางวัลจากการแข่งขันด้านสังคมศาสตร์ระดับประเทศหรือนานาชาติ เป็นตัวแทนประเทศในกิจกรรมด้านสังคมศาสตร์ระดับนานาชาติ เป็นตัวแทนโรงเรียนในกิจกรรมด้านสังคมศาสตร์ระดับประเทศ หรือเป็นผู้นำกิจกรรมเพื่อสังคมในชุมชนที่สาธารณชนรับรู้",
    },
    options:
      sat === "s1"
        ? yesNo(out("ip1-ip2-tcas3"), out("ip1-tcas3"), { yes: have, no: haveNot })
        : yesNo(out("ip2-tcas3"), out("tcas3"), { yes: have, no: haveNot }),
  })),

  ...sats.map((sat): SmartAnswerNode => ({
    kind: "question",
    id: q(`gpax280-${sat}`),
    question: {
      en: "Is your GPAX at least 2.80?",
      th: "GPAX ของคุณอยู่ที่ 2.80 ขึ้นไปหรือไม่",
    },
    hint: {
      en: "Count 6 semesters, or 5 if your school cannot issue the 6th in time. An International Baccalaureate score of at least 4 in five subjects, GCE or IGCSE results at the BIR thresholds, or an HSCES GPAX Equivalence Certificate also count.",
      th: "นับ GPAX 6 ภาคการศึกษา หรือ 5 ภาคการศึกษาถ้าโรงเรียนออกผลของภาคที่ 6 ไม่ทัน ผล IB ที่ได้อย่างน้อย 4 ใน 5 วิชา ผล GCE หรือ IGCSE ตามเกณฑ์ของ BIR หรือใบรับรองการเทียบ GPAX จาก HSCES ก็นับเช่นกัน",
    },
    options: yesNo(
      sat === "s1" ? out("ip1-tcas3") : out("tcas3"),
      sat === "s1" ? out("ip1") : out("none")
    ),
  })),

  ...sats.map((sat): SmartAnswerNode => ({
    kind: "question",
    id: q(`ged165-${sat}`),
    question: {
      en: "Did you score at least 165 in every GED subject?",
      th: "คุณได้คะแนน GED อย่างน้อย 165 ในทุกวิชาหรือไม่",
    },
    hint: {
      en: "A high total does not help if any one subject is below 165.",
      th: "ถ้ามีวิชาใดวิชาหนึ่งต่ำกว่า 165 คะแนนรวมสูงก็ไม่ช่วย",
    },
    options: yesNo(
      sat === "s1" ? out("ip1-tcas3") : out("tcas3"),
      sat === "s1" ? out("ip1") : out("none")
    ),
  })),
];

/* -------------------------------------------------------------------------- */
/* Outcomes                                                                   */
/* -------------------------------------------------------------------------- */

const outcomes: SmartAnswerNode[] = [
  eligible("ip1-ip2-tcas3", ["inter-portfolio-1", "inter-portfolio-2", "tcas-3"]),
  eligible("ip1-tcas3", ["inter-portfolio-1", "tcas-3"], [ip2Note]),
  eligible("ip2-tcas3", ["inter-portfolio-2", "tcas-3"], [sat1Missing]),
  eligible("ip1", ["inter-portfolio-1"], [ip2Note, tcas3Missing]),
  eligible("tcas3", ["tcas-3"], [sat1Missing, ip2Note]),

  {
    kind: "outcome",
    id: out("none"),
    title: {
      en: "You cannot apply through a Thai round yet",
      th: "ตอนนี้คุณยังสมัครรอบสำหรับผู้สมัครสัญชาติไทยไม่ได้",
    },
    summary: {
      en: "You do not meet the requirements for Inter-Portfolio 1, Inter-Portfolio 2 or TCAS 3 yet. Here is what each round still needs.",
      th: "คุณยังไม่ผ่านเกณฑ์ของรอบ Inter-Portfolio 1, Inter-Portfolio 2 และ TCAS รอบ 3 ด้านล่างคือสิ่งที่แต่ละรอบยังต้องใช้",
    },
    owner,
    body: [
      sat1Missing,
      tcas3Missing,
      ip2Note,
      {
        kind: "paragraph",
        text: {
          en: "The English test minimums are in the guide on English tests and school qualifications. It also explains how to use a GED or an international school record.",
          th: "เกณฑ์ขั้นต่ำของผลสอบภาษาอังกฤษอยู่ในคู่มือผลสอบภาษาอังกฤษและวุฒิการศึกษา ซึ่งอธิบายวิธีใช้วุฒิ GED หรือผลการเรียนจากโรงเรียนนานาชาติด้วย",
        },
      },
      officialNote,
    ],
    actions: [
      {
        label: {
          en: "Read the English test minimums",
          th: "ดูเกณฑ์ขั้นต่ำของผลสอบภาษาอังกฤษ",
        },
        href: guide("english-tests-and-qualifications"),
      },
      officialSite,
    ],
    related: related.filter((item) => item.href !== guide("english-tests-and-qualifications")),
  },

  {
    kind: "outcome",
    id: out("non-thai"),
    title: {
      en: "You can apply through the non-Thai rounds",
      th: "คุณสมัครรอบสำหรับผู้ที่ไม่มีสัญชาติไทยได้",
    },
    summary: {
      en: "You meet the requirements for both non-Thai rounds. The dates, seats and fees are below.",
      th: "คุณมีคุณสมบัติครบสำหรับรอบสำหรับผู้ที่ไม่มีสัญชาติไทยทั้งสองรอบ กำหนดการ จำนวนที่นั่ง และค่าใช้จ่ายอยู่ด้านล่าง",
    },
    owner,
    body: [
      roundBlock("non-thai-1"),
      roundBlock("non-thai-2"),
      {
        kind: "paragraph",
        text: {
          en: "TCAS 3 is for Thai applicants only, so it is not open to you.",
          th: "รอบ TCAS 3 สำหรับผู้สมัครสัญชาติไทยเท่านั้น คุณจึงสมัครรอบนี้ไม่ได้",
        },
      },
      {
        kind: "note",
        tone: "info",
        text: {
          en: "If your school records are not on a 4.0 scale, apply with the HSCES High School Equivalence Certificate and GPAX Equivalence Certificate.",
          th: "ถ้าผลการเรียนของคุณไม่ได้ให้เกรดตามมาตรา 4.0 ให้สมัครด้วยใบรับรองการเทียบวุฒิมัธยมศึกษาและใบรับรองการเทียบ GPAX จาก HSCES",
        },
      },
      officialNote,
    ],
    actions: [
      {
        label: roundGuides["non-thai-1"].label,
        href: guide(roundGuides["non-thai-1"].slug),
      },
      officialSite,
    ],
    related,
  },

  {
    kind: "outcome",
    id: out("non-thai-no-sat"),
    title: {
      en: "You need an SAT result before you can apply",
      th: "คุณต้องมีผลสอบ SAT ก่อนจึงจะสมัครได้",
    },
    summary: {
      en: "Both non-Thai rounds need an official SAT Evidence-Based Reading and Writing result from the last 2 years, and you do not have one yet.",
      th: "ทั้งสองรอบสำหรับผู้ที่ไม่มีสัญชาติไทยต้องมีผลสอบ SAT ทางการ ส่วน Evidence-Based Reading and Writing ที่สอบมาไม่เกิน 2 ปี และคุณยังไม่มี",
    },
    owner,
    body: [
      {
        kind: "paragraph",
        text: {
          en: "TCAS 3 is for Thai applicants only, so you cannot use it instead.",
          th: "รอบ TCAS 3 สำหรับผู้สมัครสัญชาติไทยเท่านั้น คุณจึงใช้รอบนี้แทนไม่ได้",
        },
      },
      {
        kind: "paragraph",
        text: {
          en: "The Thammasat International Student Recruitment Program (TISR) is a separate way to apply to Thammasat University. Visit the Office of International Affairs at https://oia.tu.ac.th/ or email info.inter@tu.ac.th.",
          th: "โครงการรับสมัครนักศึกษาต่างชาติของมหาวิทยาลัยธรรมศาสตร์ (TISR) เป็นอีกช่องทางหนึ่งในการสมัครเรียนที่ธรรมศาสตร์ ดูรายละเอียดที่สำนักงานวิเทศสัมพันธ์ https://oia.tu.ac.th/ หรืออีเมล info.inter@tu.ac.th",
        },
      },
      officialNote,
    ],
    actions: [
      {
        label: roundGuides["non-thai-1"].label,
        href: guide(roundGuides["non-thai-1"].slug),
      },
      {
        label: {
          en: "Visit the Office of International Affairs",
          th: "เยี่ยมชมเว็บไซต์สำนักงานวิเทศสัมพันธ์",
        },
        href: "https://oia.tu.ac.th/",
        external: true,
      },
      officialSite,
    ],
    related,
  },
];

export const admissions: SmartAnswerService = {
  topics: [
    {
      slug: "admission-round",
      path: `${GUIDE_BASE}/which-round`,
      title: {
        en: "Check which BIR admission round you can apply through",
        th: "เช็กว่าสมัคร BIR รอบไหนได้",
      },
      lede: {
        en: "Answer a few questions about your nationality, school and test results to see which BIR admission rounds you can use for 2027 entry, with the dates, seats and fees.",
        th: "ตอบคำถามไม่กี่ข้อเกี่ยวกับสัญชาติ การศึกษา และผลสอบ เพื่อดูว่าสมัคร BIR รอบไหนได้บ้างสำหรับการเข้าศึกษาปี 2570 พร้อมกำหนดการ จำนวนที่นั่ง และค่าใช้จ่าย",
      },
      start: q("nationality"),
      keywords: [
        "bir admission",
        "which round",
        "admission round",
        "apply to bir",
        "can i apply",
        "eligibility",
        "inter-portfolio",
        "portfolio",
        "tcas",
        "tcas 3",
        "sat",
        "ged",
        "gpax",
        "non-thai",
        "international applicant",
        "สมัครเรียน",
        "สมัคร bir",
        "รอบรับสมัคร",
        "รอบไหน",
        "สมัครรอบไหนได้",
        "คุณสมบัติ",
        "พอร์ต",
        "ทีแคส",
        "สอบเข้า",
        "ผู้สมัครต่างชาติ",
      ],
    },
  ],

  nodes: [...questions, ...outcomes],
};
