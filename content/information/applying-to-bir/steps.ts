/**
 * The "Applying to BIR" step by step. Authored natively in both languages
 * (Thai is written as Thai, not translated). Task `href`s are locale-less
 * paths to the guides in `content/information/{locale}/applying-to-bir/`.
 */
import type { Bi, OnboardingStep } from "@/content/onboarding/types";

const guide = (slug: string) => `/information/applying-to-bir/${slug}`;

export const applyingLede: Bi = {
  en: "Six steps from checking you can apply to confirming your place, for 2027 entry. Tick each task when it is done. Your ticks are saved in this browser only.",
  th: "หกขั้นตอนตั้งแต่ตรวจสอบคุณสมบัติจนถึงยืนยันสิทธิ์ สำหรับการเข้าศึกษาปี 2570 ทำเสร็จแล้วติ๊กช่องไว้ ระบบเก็บรายการที่ติ๊กในเบราว์เซอร์นี้เท่านั้น",
};

export const applyingSteps: OnboardingStep[] = [
  {
    id: "check-you-can-apply",
    title: { en: "Check you can apply", th: "ตรวจสอบว่าสมัครได้หรือไม่" },
    blurb: {
      en: "Your nationality and your school results decide which rounds are open to you.",
      th: "สัญชาติและผลการเรียนของคุณเป็นตัวกำหนดว่าสมัครรอบใดได้",
    },
    tasks: [
      {
        id: "compare-rounds",
        label: { en: "Compare the admission rounds", th: "เปรียบเทียบรอบรับสมัคร" },
        hint: {
          en: "See who can apply, the dates, the seats and the grades each round asks for.",
          th: "ดูว่าใครสมัครได้ วันรับสมัคร จำนวนที่นั่ง และเกรดที่แต่ละรอบกำหนด",
        },
        href: guide("admission-rounds"),
      },
      {
        id: "check-english-requirement",
        label: {
          en: "Check the English test scores you need",
          th: "ตรวจสอบคะแนนสอบภาษาอังกฤษที่ต้องใช้",
        },
        href: guide("english-tests-and-qualifications"),
      },
    ],
  },
  {
    id: "choose-your-round",
    title: { en: "Choose your admission round", th: "เลือกรอบรับสมัคร" },
    blurb: {
      en: "Pick the round that fits your nationality and your results.",
      th: "เลือกรอบที่เหมาะกับสัญชาติและผลการเรียนของคุณ",
    },
    tasks: [
      {
        id: "read-inter-portfolio-1",
        label: { en: "Inter-Portfolio 1", th: "Inter-Portfolio 1" },
        href: guide("inter-portfolio-1"),
      },
      {
        id: "read-inter-portfolio-2",
        label: { en: "Inter-Portfolio 2", th: "Inter-Portfolio 2" },
        href: guide("inter-portfolio-2"),
      },
      {
        id: "read-tcas-3",
        label: { en: "TCAS 3 and the BIR written exam", th: "TCAS 3 และการสอบข้อเขียน BIR" },
        href: guide("tcas-3-written-exam"),
      },
      {
        id: "read-non-thai",
        label: { en: "If you are not Thai", th: "สำหรับผู้สมัครที่ไม่ได้มีสัญชาติไทย" },
        href: guide("non-thai-applicants"),
      },
    ],
  },
  {
    id: "get-ready",
    title: {
      en: "Get your English test score and documents ready",
      th: "เตรียมผลสอบภาษาอังกฤษและเอกสาร",
    },
    blurb: {
      en: "Book your English test early. Scores must be no more than 2 years old on the day you apply.",
      th: "ควรจองสอบภาษาอังกฤษล่วงหน้า ผลสอบต้องมีอายุไม่เกิน 2 ปีนับถึงวันสมัคร",
    },
    tasks: [
      {
        id: "english-test",
        label: { en: "Get an English test result", th: "สอบภาษาอังกฤษและรับผลสอบ" },
        href: guide("english-tests-and-qualifications"),
      },
      {
        id: "gather-documents",
        label: { en: "Gather the documents you need", th: "รวบรวมเอกสารที่ต้องใช้" },
        href: guide("documents"),
      },
    ],
  },
  {
    id: "apply-and-pay",
    title: { en: "Apply and pay", th: "สมัครและชำระค่าสมัคร" },
    blurb: {
      en: "Check the closing date for your round before you start.",
      th: "ตรวจสอบวันปิดรับสมัครของรอบที่เลือกก่อนเริ่มสมัคร",
    },
    tasks: [
      {
        id: "check-dates",
        label: { en: "Check the key dates", th: "ตรวจสอบกำหนดการสำคัญ" },
        href: guide("key-dates"),
      },
      {
        id: "use-application-website",
        label: { en: "Use the application website", th: "สมัครผ่านเว็บไซต์รับสมัคร" },
        href: guide("application-website"),
      },
      {
        id: "pay-fee",
        label: { en: "Pay the application fee", th: "ชำระค่าสมัคร" },
        href: guide("fees-and-scholarships"),
      },
    ],
  },
  {
    id: "interview-or-exam",
    title: { en: "Go to your interview or exam", th: "เข้าสัมภาษณ์หรือเข้าสอบ" },
    tasks: [
      {
        id: "prepare-written-exam",
        label: {
          en: "Prepare for the BIR written exam",
          th: "เตรียมตัวสอบข้อเขียน BIR",
        },
        href: guide("tcas-3-written-exam"),
      },
      {
        id: "check-interview-date",
        label: { en: "Check your interview date", th: "ตรวจสอบวันสัมภาษณ์" },
        href: guide("key-dates"),
      },
    ],
  },
  {
    id: "confirm-your-place",
    title: { en: "Confirm your place on myTCAS", th: "ยืนยันสิทธิ์ผ่าน myTCAS" },
    blurb: {
      en: "Thai applicants confirm their place on myTCAS once results are announced.",
      th: "ผู้สมัครสัญชาติไทยยืนยันสิทธิ์ผ่าน myTCAS เมื่อประกาศผลแล้ว",
    },
    tasks: [
      {
        id: "read-common-questions",
        label: { en: "Read the common questions", th: "อ่านคำถามที่พบบ่อย" },
        href: guide("common-questions"),
      },
      {
        id: "plan-tuition",
        label: { en: "Check tuition and scholarships", th: "ตรวจสอบค่าเล่าเรียนและทุนการศึกษา" },
        href: guide("fees-and-scholarships"),
      },
    ],
  },
];
