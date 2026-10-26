import type { Locale } from "@/lib/i18n";

type Bi = Record<Locale, string>;

export type TimelineEntry = {
  id: string;
  /** Month labels this entry spans, shown above it. */
  when: Bi;
  title: Bi;
  detail: Bi;
  tag?: { label: Bi; required: boolean };
  /** Number of month columns the entry spans on wide screens. */
  span: 1 | 2;
};

export const internshipTimeline: TimelineEntry[] = [
  {
    id: "form-1",
    when: { en: "March 2027", th: "มีนาคม 2570" },
    title: { en: "Internship Request Form", th: "Internship Request Form" },
    detail: {
      en: "Submit by the end of March to get a Letter of Internship Request.",
      th: "ส่งภายในสิ้นเดือนมีนาคม เพื่อขอหนังสือขอความอนุเคราะห์",
    },
    tag: { label: { en: "If still applying", th: "ถ้ายังสมัครอยู่" }, required: false },
    span: 1,
  },
  {
    id: "form-2",
    when: { en: "April 2027", th: "เมษายน 2570" },
    title: { en: "Secured Internship Form", th: "Secured Internship Form" },
    detail: {
      en: "Submit by the end of April with your proof of acceptance.",
      th: "ส่งภายในสิ้นเดือนเมษายน พร้อมหลักฐานการตอบรับ",
    },
    tag: { label: { en: "Everyone", th: "ทุกคน" }, required: true },
    span: 1,
  },
  {
    id: "orientation",
    when: { en: "May 2027", th: "พฤษภาคม 2570" },
    title: { en: "Internship orientation", th: "ปฐมนิเทศการฝึกงาน" },
    detail: {
      en: "Collect your Letter of Internship.",
      th: "รับหนังสือส่งตัวเข้าฝึกงาน",
    },
    tag: { label: { en: "Everyone", th: "ทุกคน" }, required: true },
    span: 1,
  },
  {
    id: "internship",
    when: { en: "June and July 2027", th: "มิถุนายนและกรกฎาคม 2570" },
    title: { en: "Internship, 8 weeks", th: "ฝึกงาน 8 สัปดาห์" },
    detail: {
      en: "Usually 7 June to 30 July 2027. A private company may set other dates, as long as the internship lasts 8 weeks.",
      th: "ปกติคือ 7 มิถุนายน ถึง 30 กรกฎาคม 2570 บริษัทเอกชนกำหนดวันอื่นได้ หากฝึกงานครบ 8 สัปดาห์",
    },
    span: 2,
  },
];

export type JourneyStep = {
  id: string;
  title: Bi;
  detail: Bi;
  when?: Bi;
  tag?: { label: Bi; required: boolean };
};

export const internshipSteps: JourneyStep[] = [
  {
    id: "happy-hour",
    title: { en: "Attend the Happy Hour session", th: "เข้าร่วมกิจกรรม Happy Hour" },
    detail: {
      en: "Then look for internships in the areas that interest you. You find the organisation yourself.",
      th: "จากนั้นหาที่ฝึกงานในสายงานที่สนใจ นักศึกษาหาหน่วยงานเอง",
    },
  },
  {
    id: "form-1",
    title: { en: "Submit the Internship Request Form", th: "ส่ง Internship Request Form" },
    detail: {
      en: "Upload information about the organisation and your CV. Collect your Letter of Internship Request from the BIR office after 5 to 7 working days.",
      th: "แนบข้อมูลหน่วยงานและ CV แล้วรับหนังสือขอความอนุเคราะห์ที่สำนักงานโครงการ BIR หลังจากนั้น 5 ถึง 7 วันทำการ",
    },
    when: { en: "By the end of March 2027", th: "ภายในเดือนมีนาคม 2570" },
    tag: { label: { en: "If still applying", th: "ถ้ายังสมัครอยู่" }, required: false },
  },
  {
    id: "training",
    title: { en: "Attend at least 2 training sessions", th: "เข้าอบรมอย่างน้อย 2 หัวข้อ" },
    detail: {
      en: "BIR and the Faculty of Political Science run the sessions. BIR checks attendance.",
      th: "BIR และคณะรัฐศาสตร์เป็นผู้จัด โครงการเช็กชื่อผู้เข้าอบรม",
    },
    tag: { label: { en: "Everyone", th: "ทุกคน" }, required: true },
  },
  {
    id: "form-2",
    title: { en: "Submit the Secured Internship Form", th: "ส่ง Secured Internship Form" },
    detail: {
      en: "Once an organisation accepts you, upload your proof of acceptance with the form.",
      th: "เมื่อหน่วยงานตอบรับแล้ว ให้แนบหลักฐานการตอบรับมากับแบบฟอร์ม",
    },
    when: { en: "By the end of April 2027", th: "ภายในเดือนเมษายน 2570" },
    tag: { label: { en: "Everyone", th: "ทุกคน" }, required: true },
  },
  {
    id: "orientation",
    title: { en: "Collect your Letter of Internship", th: "รับหนังสือส่งตัวเข้าฝึกงาน" },
    detail: {
      en: "The BIR office hands it out at the internship orientation.",
      th: "สำนักงานโครงการ BIR แจกหนังสือในวันปฐมนิเทศการฝึกงาน",
    },
    when: { en: "May 2027", th: "พฤษภาคม 2570" },
    tag: { label: { en: "Everyone", th: "ทุกคน" }, required: true },
  },
  {
    id: "register",
    title: { en: "Register and pay for PI574", th: "ลงทะเบียนและชำระค่าลงทะเบียน PI574" },
    detail: {
      en: "Register on reg.tu.ac.th for the summer session and pay by the University's deadline.",
      th: "ลงทะเบียนภาคฤดูร้อนที่ reg.tu.ac.th และชำระเงินภายในกำหนดของมหาวิทยาลัย",
    },
    tag: { label: { en: "Everyone", th: "ทุกคน" }, required: true },
  },
  {
    id: "first-day",
    title: { en: "Start your internship", th: "เริ่มฝึกงาน" },
    detail: {
      en: "Give the Letter of Internship to the organisation on your first day.",
      th: "ยื่นหนังสือส่งตัวเข้าฝึกงานให้หน่วยงานในวันแรก",
    },
    when: { en: "Usually 7 June 2027", th: "ปกติคือ 7 มิถุนายน 2570" },
  },
];

export type LetterCard = {
  id: string;
  name: Bi;
  otherName: Bi;
  tag: { label: Bi; required: boolean };
  rows: { label: Bi; value: Bi }[];
};

export const internshipLetters: LetterCard[] = [
  {
    id: "request",
    name: { en: "Letter of Internship Request", th: "หนังสือขอความอนุเคราะห์รับนักศึกษาฝึกงาน" },
    otherName: {
      en: "หนังสือขอความอนุเคราะห์รับนักศึกษาฝึกงาน",
      th: "Letter of Internship Request",
    },
    tag: { label: { en: "Only while applying", th: "ใช้เฉพาะตอนสมัคร" }, required: false },
    rows: [
      {
        label: { en: "What it does", th: "ใช้ทำอะไร" },
        value: {
          en: "Asks an organisation to consider you and confirms you are a student",
          th: "ขอให้หน่วยงานพิจารณารับนักศึกษา และยืนยันสถานภาพนักศึกษา",
        },
      },
      {
        label: { en: "Form", th: "แบบฟอร์ม" },
        value: { en: "Internship Request Form", th: "Internship Request Form" },
      },
      {
        label: { en: "Deadline", th: "กำหนดส่ง" },
        value: { en: "End of March 2027", th: "ภายในเดือนมีนาคม 2570" },
      },
      {
        label: { en: "Upload", th: "เอกสารแนบ" },
        value: {
          en: "Information about the organisation and your CV",
          th: "ข้อมูลหน่วยงานและ CV",
        },
      },
      {
        label: { en: "Collect", th: "รับหนังสือ" },
        value: {
          en: "From the BIR office after 5 to 7 working days",
          th: "ที่สำนักงานโครงการ BIR หลังจาก 5 ถึง 7 วันทำการ",
        },
      },
      {
        label: { en: "Then", th: "จากนั้น" },
        value: {
          en: "Send it to the organisation with your application",
          th: "ยื่นให้หน่วยงานพร้อมใบสมัคร",
        },
      },
    ],
  },
  {
    id: "internship",
    name: { en: "Letter of Internship", th: "หนังสือส่งตัวเข้าฝึกงาน" },
    otherName: { en: "หนังสือส่งตัวเข้าฝึกงาน", th: "Letter of Internship" },
    tag: { label: { en: "Everyone needs this", th: "ทุกคนต้องมี" }, required: true },
    rows: [
      {
        label: { en: "What it does", th: "ใช้ทำอะไร" },
        value: {
          en: "Confirms your placement so BIR can monitor and assess it for credit",
          th: "ยืนยันที่ฝึกงาน เพื่อให้โครงการติดตามและประเมินผลเพื่อให้หน่วยกิต",
        },
      },
      {
        label: { en: "Form", th: "แบบฟอร์ม" },
        value: { en: "Secured Internship Form", th: "Secured Internship Form" },
      },
      {
        label: { en: "Deadline", th: "กำหนดส่ง" },
        value: { en: "End of April 2027", th: "ภายในเดือนเมษายน 2570" },
      },
      {
        label: { en: "Upload", th: "เอกสารแนบ" },
        value: {
          en: "Proof of acceptance from the organisation",
          th: "หลักฐานการตอบรับจากหน่วยงาน",
        },
      },
      {
        label: { en: "Collect", th: "รับหนังสือ" },
        value: {
          en: "At the internship orientation in May 2027",
          th: "ในวันปฐมนิเทศการฝึกงาน เดือนพฤษภาคม 2570",
        },
      },
      {
        label: { en: "Then", th: "จากนั้น" },
        value: {
          en: "Give it to the organisation on your first day",
          th: "ยื่นให้หน่วยงานในวันแรกของการฝึกงาน",
        },
      },
    ],
  },
];
