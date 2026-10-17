/**
 * Admission rounds for BSc Politics and International Relations (BIR), 2027
 * entry. The BIR website (birpolsci.com) is the source of truth for dates and
 * rules; seats and the fees come from the official Thai announcements.
 * Dates are ISO (YYYY-MM-DD) and Bangkok time.
 */
import type { Locale } from "@/lib/i18n";

export type Localised = Record<Locale, string>;

export type DateSpan = {
  start: string;
  end?: string;
};

export type AdmissionRoundId =
  "inter-portfolio-1" | "inter-portfolio-2" | "tcas-3" | "non-thai-1" | "non-thai-2";

export type AdmissionMilestone = {
  id: string;
  /** An ISO date or date range, or "tba" until the faculty announces it. */
  date: DateSpan | "tba";
  label: Localised;
  note?: Localised;
};

export type ApplicationWindow = DateSpan & { label?: Localised };

export type AdmissionRound = {
  id: AdmissionRoundId;
  name: Localised;
  /** Locale-less site path of the guide for this round. */
  guide: string;
  who: Localised;
  window: ApplicationWindow[];
  seats: number;
  minimumGrades: Localised;
  tests: Localised;
  selection: Localised;
  fee: Localised;
  milestones: AdmissionMilestone[];
};

export type EnglishTest = {
  id: "toefl" | "ielts" | "tu-get" | "sat";
  name: Localised;
  minimum: Localised;
  requiredFor: AdmissionRoundId[];
  acceptedFor: AdmissionRoundId[];
};

export const GUIDE_BASE = "/services/applying-to-bir";

const nonThaiWho: Localised = {
  en: "Applicants who are not Thai and do not hold a Thai passport. You must be in Grade 12 with at least four semesters of results, or have finished Grade 12 or equivalent.",
  th: "ผู้สมัครที่ไม่ได้มีสัญชาติไทยและไม่ได้ถือหนังสือเดินทางไทย ต้องกำลังเรียนเกรด 12 และมีผลการเรียนอย่างน้อย 4 ภาคเรียน หรือจบเกรด 12 หรือเทียบเท่าแล้ว",
};

const nonThaiGrades: Localised = {
  en: "No minimum GPAX. Records not on a 4.0 scale need the HSCES certificates.",
  th: "ไม่กำหนด GPAX ขั้นต่ำ ผลการเรียนที่ไม่ใช่มาตรา 4.0 ต้องใช้ใบรับรอง HSCES",
};

const nonThaiTests: Localised = {
  en: "Official SAT result for Evidence-Based Reading and Writing, taken in the last 2 years.",
  th: "ผลสอบ SAT ทางการส่วน Evidence-Based Reading and Writing ที่สอบมาไม่เกิน 2 ปี",
};

const nonThaiSelection: Localised = {
  en: "The highest SAT scores are called for an online interview in English. The committee decides.",
  th: "ผู้ที่ได้คะแนน SAT สูงสุดจะได้รับเรียกสัมภาษณ์ออนไลน์เป็นภาษาอังกฤษ คณะกรรมการเป็นผู้ตัดสิน",
};

const nonThaiFee: Localised = {
  en: "1,000 baht or 35 US dollars, not refundable.",
  th: "ค่าสมัคร 1,000 บาท หรือ 35 ดอลลาร์สหรัฐ ไม่คืนเงิน",
};

export const admissionRounds: AdmissionRound[] = [
  {
    id: "inter-portfolio-1",
    name: { en: "Inter-Portfolio 1", th: "Inter-Portfolio 1" },
    guide: `${GUIDE_BASE}/inter-portfolio-1`,
    who: {
      en: "Thai applicants in Grade 12 (Mathayom 6) with at least four semesters of results, or who have finished Grade 12 or equivalent.",
      th: "ผู้สมัครสัญชาติไทยที่กำลังเรียนชั้น ม.6 และมีผลการเรียนอย่างน้อย 4 ภาคเรียน หรือจบ ม.6 หรือเทียบเท่าแล้ว",
    },
    window: [{ start: "2026-10-06", end: "2026-11-06" }],
    seats: 45,
    minimumGrades: {
      en: "No minimum GPAX. You need at least four semesters of results.",
      th: "ไม่กำหนด GPAX ขั้นต่ำ แต่ต้องมีผลการเรียนอย่างน้อย 4 ภาคเรียน",
    },
    tests: {
      en: "Official SAT result for Evidence-Based Reading and Writing, taken in the last 2 years.",
      th: "ผลสอบ SAT ทางการส่วน Evidence-Based Reading and Writing ที่สอบมาไม่เกิน 2 ปี",
    },
    selection: {
      en: "The highest SAT scores are called for an interview. The committee decides. No portfolio is needed.",
      th: "ผู้ที่ได้คะแนน SAT สูงสุดจะได้รับเรียกสัมภาษณ์ คณะกรรมการเป็นผู้ตัดสิน ไม่ต้องส่งแฟ้มสะสมผลงาน",
    },
    fee: {
      en: "1,000 baht, not refundable.",
      th: "ค่าสมัคร 1,000 บาท ไม่คืนเงิน",
    },
    milestones: [
      {
        id: "apply",
        date: { start: "2026-10-06", end: "2026-11-06" },
        label: { en: "Application period", th: "ช่วงรับสมัคร" },
        note: {
          en: "Apply on admission.polsci.tu.ac.th. It closes at 23:59 Bangkok time on 6 November.",
          th: "สมัครที่ admission.polsci.tu.ac.th ปิดรับเวลา 23:59 น. ตามเวลาประเทศไทยของวันที่ 6 พฤศจิกายน",
        },
      },
      {
        id: "pay",
        date: { start: "2026-11-07" },
        label: { en: "Application fee due", th: "วันสุดท้ายชำระค่าสมัคร" },
        note: {
          en: "Pay by 23:59.",
          th: "ชำระภายในเวลา 23:59 น.",
        },
      },
      {
        id: "interview-list",
        date: { start: "2026-11-13" },
        label: { en: "Interview candidates announced", th: "ประกาศรายชื่อผู้มีสิทธิ์สัมภาษณ์" },
      },
      {
        id: "interview",
        date: { start: "2026-11-15" },
        label: { en: "Interview", th: "สัมภาษณ์" },
        note: {
          en: "Faculty of Political Science, Tha Prachan.",
          th: "คณะรัฐศาสตร์ ท่าพระจันทร์",
        },
      },
      {
        id: "successful",
        date: { start: "2026-12-15" },
        label: { en: "Successful candidates announced", th: "ประกาศรายชื่อผู้ผ่านการคัดเลือก" },
      },
      {
        id: "confirm",
        date: { start: "2027-03-10", end: "2027-03-11" },
        label: { en: "Confirm your place on myTCAS", th: "ยืนยันสิทธิ์ผ่านระบบ myTCAS" },
        note: {
          en: "TCAS round 1, Portfolio.",
          th: "TCAS รอบที่ 1 Portfolio",
        },
      },
      {
        id: "enrolment",
        date: { start: "2027-03-26" },
        label: { en: "Enrolment list announced", th: "ประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษา" },
      },
    ],
  },
  {
    id: "inter-portfolio-2",
    name: { en: "Inter-Portfolio 2", th: "Inter-Portfolio 2" },
    guide: `${GUIDE_BASE}/inter-portfolio-2`,
    who: {
      en: "Thai applicants who are in Grade 12 (Mathayom 6) now.",
      th: "ผู้สมัครสัญชาติไทยที่กำลังเรียนชั้น ม.6",
    },
    window: [{ start: "2027-01-06", end: "2027-01-24" }],
    seats: 5,
    minimumGrades: {
      en: "GPAX of at least 3.75 over five semesters.",
      th: "GPAX อย่างน้อย 3.75 จากผลการเรียน 5 ภาคเรียน",
    },
    tests: {
      en: "One English test result from the last 2 years. See the English test minimums.",
      th: "ผลสอบภาษาอังกฤษ 1 รายการที่สอบมาไม่เกิน 2 ปี ดูคะแนนขั้นต่ำของแต่ละการสอบ",
    },
    selection: {
      en: "A portfolio that shows a social science achievement or leadership, then an interview. The committee decides.",
      th: "พิจารณาแฟ้มสะสมผลงานที่แสดงความสำเร็จหรือความเป็นผู้นำด้านสังคมศาสตร์ แล้วสัมภาษณ์ คณะกรรมการเป็นผู้ตัดสิน",
    },
    fee: {
      en: "1,000 baht, not refundable.",
      th: "ค่าสมัคร 1,000 บาท ไม่คืนเงิน",
    },
    milestones: [
      {
        id: "apply",
        date: { start: "2027-01-06", end: "2027-01-24" },
        label: { en: "Application period", th: "ช่วงรับสมัคร" },
        note: {
          en: "Apply on admission.polsci.tu.ac.th.",
          th: "สมัครที่ admission.polsci.tu.ac.th",
        },
      },
      {
        id: "interview-list",
        date: { start: "2027-02-19" },
        label: { en: "Interview candidates announced", th: "ประกาศรายชื่อผู้มีสิทธิ์สัมภาษณ์" },
      },
      {
        id: "interview",
        date: { start: "2027-02-23" },
        label: { en: "Interview", th: "สัมภาษณ์" },
        note: {
          en: "Faculty of Political Science, Tha Prachan.",
          th: "คณะรัฐศาสตร์ ท่าพระจันทร์",
        },
      },
      {
        id: "successful",
        date: { start: "2027-03-11" },
        label: { en: "Successful candidates announced", th: "ประกาศรายชื่อผู้ผ่านการคัดเลือก" },
      },
      {
        id: "confirm",
        date: { start: "2027-05-03", end: "2027-05-04" },
        label: { en: "Confirm your place on myTCAS", th: "ยืนยันสิทธิ์ผ่านระบบ myTCAS" },
        note: {
          en: "TCAS round 2, Quota.",
          th: "TCAS รอบที่ 2 Quota",
        },
      },
      {
        id: "enrolment",
        date: { start: "2027-05-20" },
        label: { en: "Enrolment list announced", th: "ประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษา" },
      },
    ],
  },
  {
    id: "tcas-3",
    name: { en: "TCAS 3", th: "TCAS รอบ 3" },
    guide: `${GUIDE_BASE}/tcas-3-written-exam`,
    who: {
      en: "Thai applicants only. You must have finished upper secondary school, or be in your last year of it in academic year 2026.",
      th: "เฉพาะผู้สมัครสัญชาติไทย ต้องจบการศึกษาระดับมัธยมศึกษาตอนปลาย หรือกำลังเรียนชั้นปีสุดท้ายในปีการศึกษา 2569",
    },
    window: [
      {
        start: "2027-02-02",
        end: "2027-02-17",
        label: { en: "BIR written exam", th: "สอบข้อเขียน BIR" },
      },
      {
        start: "2027-05-07",
        end: "2027-05-11",
        label: { en: "TCAS 3 on myTCAS", th: "TCAS รอบ 3 บน myTCAS" },
      },
    ],
    seats: 15,
    minimumGrades: {
      en: "GPAX of at least 2.80 over six semesters, or an equivalent. With a GED, at least 165 in each subject.",
      th: "GPAX อย่างน้อย 2.80 จากผลการเรียน 6 ภาคเรียน หรือเทียบเท่า ผู้ถือ GED ต้องได้อย่างน้อย 165 ในแต่ละวิชา",
    },
    tests: {
      en: "The BIR written exam and one English test result from the last 2 years.",
      th: "สอบข้อเขียน BIR และผลสอบภาษาอังกฤษ 1 รายการที่สอบมาไม่เกิน 2 ปี",
    },
    selection: {
      en: "The BIR written exam, then an interview. The exam is 40 percent General Knowledge in Politics and International Relations and 60 percent English essay.",
      th: "คะแนนสอบข้อเขียน BIR แล้วสัมภาษณ์ ข้อสอบแบ่งเป็นความรู้ทั่วไปด้านการเมืองและความสัมพันธ์ระหว่างประเทศ 40 เปอร์เซ็นต์ และเรียงความภาษาอังกฤษ 60 เปอร์เซ็นต์",
    },
    fee: {
      en: "500 baht for the written exam.",
      th: "ค่าสอบข้อเขียน 500 บาท",
    },
    milestones: [
      {
        id: "exam-apply",
        date: { start: "2027-02-02", end: "2027-02-17" },
        label: { en: "Apply for the BIR written exam", th: "สมัครสอบข้อเขียน BIR" },
        note: {
          en: "Apply on admission.polsci.tu.ac.th.",
          th: "สมัครที่ admission.polsci.tu.ac.th",
        },
      },
      {
        id: "exam-eligible",
        date: { start: "2027-03-11" },
        label: {
          en: "Eligible exam applicants announced",
          th: "ประกาศรายชื่อผู้มีสิทธิ์สอบข้อเขียน",
        },
      },
      {
        id: "exam",
        date: { start: "2027-03-21" },
        label: { en: "BIR written exam", th: "สอบข้อเขียน BIR" },
        note: {
          en: "10:00 to 12:00 at the Faculty of Political Science, Tha Prachan.",
          th: "10:00 ถึง 12:00 น. ที่คณะรัฐศาสตร์ ท่าพระจันทร์",
        },
      },
      {
        id: "exam-scores",
        date: { start: "2027-04-22" },
        label: { en: "Exam scores announced", th: "ประกาศผลคะแนนสอบข้อเขียน" },
      },
      {
        id: "admission",
        date: { start: "2027-05-07", end: "2027-05-11" },
        label: { en: "TCAS 3 application period", th: "ช่วงรับสมัคร TCAS รอบ 3" },
        note: {
          en: "Apply on myTCAS. Your BIR written exam score is required.",
          th: "สมัครผ่าน myTCAS ต้องใช้คะแนนสอบข้อเขียน BIR",
        },
      },
      {
        id: "admission-extra",
        date: { start: "2027-05-12", end: "2027-05-13" },
        label: { en: "Extra application days", th: "วันรับสมัครเพิ่มเติม" },
        note: {
          en: "To be confirmed.",
          th: "รอการยืนยัน",
        },
      },
      {
        id: "successful-1",
        date: { start: "2027-05-22" },
        label: {
          en: "Successful candidates announced, first list",
          th: "ประกาศรายชื่อผู้ผ่านการคัดเลือก รายชื่อที่ 1",
        },
        note: { en: "On myTCAS.", th: "ทาง myTCAS" },
      },
      {
        id: "confirm-1",
        date: { start: "2027-05-22", end: "2027-05-23" },
        label: {
          en: "Confirm your place on myTCAS, first list",
          th: "ยืนยันสิทธิ์ผ่านระบบ myTCAS รายชื่อที่ 1",
        },
      },
      {
        id: "successful-2",
        date: { start: "2027-05-27" },
        label: {
          en: "Successful candidates announced, second list",
          th: "ประกาศรายชื่อผู้ผ่านการคัดเลือก รายชื่อที่ 2",
        },
        note: { en: "On myTCAS.", th: "ทาง myTCAS" },
      },
      {
        id: "confirm-2",
        date: { start: "2027-05-27" },
        label: {
          en: "Confirm your place on myTCAS, second list",
          th: "ยืนยันสิทธิ์ผ่านระบบ myTCAS รายชื่อที่ 2",
        },
        note: { en: "Automatic.", th: "ระบบยืนยันให้อัตโนมัติ" },
      },
      {
        id: "interview",
        date: "tba",
        label: { en: "Interview", th: "สัมภาษณ์" },
        note: {
          en: "Faculty of Political Science, Tha Prachan.",
          th: "คณะรัฐศาสตร์ ท่าพระจันทร์",
        },
      },
      {
        id: "enrolment",
        date: "tba",
        label: { en: "Enrolment list announced", th: "ประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษา" },
      },
    ],
  },
  {
    id: "non-thai-1",
    name: { en: "Non-Thai round 1", th: "ผู้สมัครที่ไม่ใช่คนไทย รอบที่ 1" },
    guide: `${GUIDE_BASE}/non-thai-applicants`,
    who: nonThaiWho,
    window: [{ start: "2026-10-06", end: "2026-11-06" }],
    seats: 3,
    minimumGrades: nonThaiGrades,
    tests: nonThaiTests,
    selection: nonThaiSelection,
    fee: nonThaiFee,
    milestones: [
      {
        id: "apply",
        date: { start: "2026-10-06", end: "2026-11-06" },
        label: { en: "Application period", th: "ช่วงรับสมัคร" },
        note: {
          en: "Use the Google Form. It closes at 23:59 Bangkok time on 6 November.",
          th: "สมัครผ่าน Google Form ปิดรับเวลา 23:59 น. ตามเวลาประเทศไทยของวันที่ 6 พฤศจิกายน",
        },
      },
      {
        id: "interview-list",
        date: { start: "2026-11-13" },
        label: { en: "Interview candidates announced", th: "ประกาศรายชื่อผู้มีสิทธิ์สัมภาษณ์" },
        note: { en: "Details by email.", th: "แจ้งรายละเอียดทางอีเมล" },
      },
      {
        id: "interview",
        date: { start: "2026-11-15" },
        label: { en: "Interview", th: "สัมภาษณ์" },
        note: {
          en: "Online. Details by email.",
          th: "สัมภาษณ์ออนไลน์ แจ้งรายละเอียดทางอีเมล",
        },
      },
      {
        id: "successful",
        date: { start: "2026-12-15" },
        label: { en: "Successful candidates announced", th: "ประกาศรายชื่อผู้ผ่านการคัดเลือก" },
        note: { en: "Details by email.", th: "แจ้งรายละเอียดทางอีเมล" },
      },
      {
        id: "enrolment",
        date: { start: "2027-03-26" },
        label: { en: "Enrolment list announced", th: "ประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษา" },
      },
    ],
  },
  {
    id: "non-thai-2",
    name: { en: "Non-Thai round 2", th: "ผู้สมัครที่ไม่ใช่คนไทย รอบที่ 2" },
    guide: `${GUIDE_BASE}/non-thai-applicants`,
    who: nonThaiWho,
    window: [{ start: "2027-01-06", end: "2027-01-24" }],
    seats: 2,
    minimumGrades: nonThaiGrades,
    tests: nonThaiTests,
    selection: nonThaiSelection,
    fee: nonThaiFee,
    milestones: [
      {
        id: "apply",
        date: { start: "2027-01-06", end: "2027-01-24" },
        label: { en: "Application period", th: "ช่วงรับสมัคร" },
        note: { en: "Use the Google Form.", th: "สมัครผ่าน Google Form" },
      },
      {
        id: "interview-list",
        date: { start: "2027-02-19" },
        label: { en: "Interview candidates announced", th: "ประกาศรายชื่อผู้มีสิทธิ์สัมภาษณ์" },
        note: { en: "Details by email.", th: "แจ้งรายละเอียดทางอีเมล" },
      },
      {
        id: "interview",
        date: { start: "2027-02-23" },
        label: { en: "Interview", th: "สัมภาษณ์" },
        note: {
          en: "Online. Details by email.",
          th: "สัมภาษณ์ออนไลน์ แจ้งรายละเอียดทางอีเมล",
        },
      },
      {
        id: "successful",
        date: { start: "2027-05-11" },
        label: { en: "Successful candidates announced", th: "ประกาศรายชื่อผู้ผ่านการคัดเลือก" },
        note: { en: "Details by email.", th: "แจ้งรายละเอียดทางอีเมล" },
      },
      {
        id: "enrolment",
        date: { start: "2027-05-20" },
        label: { en: "Enrolment list announced", th: "ประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษา" },
      },
    ],
  },
];

export const englishTests: EnglishTest[] = [
  {
    id: "toefl",
    name: { en: "TOEFL", th: "TOEFL" },
    minimum: {
      en: "500 on the paper test, or 61 on the iBT",
      th: "500 สำหรับแบบกระดาษ หรือ 61 สำหรับ iBT",
    },
    requiredFor: [],
    acceptedFor: ["inter-portfolio-2", "tcas-3"],
  },
  {
    id: "ielts",
    name: { en: "IELTS", th: "IELTS" },
    minimum: { en: "6.0 overall", th: "6.0 คะแนนรวม" },
    requiredFor: [],
    acceptedFor: ["inter-portfolio-2", "tcas-3"],
  },
  {
    id: "tu-get",
    name: { en: "TU-GET", th: "TU-GET" },
    minimum: {
      en: "500 on the paper test, or 74 on the computer test",
      th: "500 สำหรับแบบกระดาษ หรือ 74 สำหรับแบบคอมพิวเตอร์",
    },
    requiredFor: [],
    acceptedFor: ["inter-portfolio-2", "tcas-3"],
  },
  {
    id: "sat",
    name: {
      en: "SAT Evidence-Based Reading and Writing",
      th: "SAT Evidence-Based Reading and Writing",
    },
    minimum: { en: "At least 50 percent", th: "อย่างน้อย 50 เปอร์เซ็นต์" },
    requiredFor: ["inter-portfolio-1", "non-thai-1", "non-thai-2"],
    acceptedFor: ["inter-portfolio-2", "tcas-3"],
  },
];

export function getAdmissionRound(id: string): AdmissionRound | undefined {
  return admissionRounds.find((round) => round.id === id);
}
