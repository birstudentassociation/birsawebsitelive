import type { Locale } from "@/lib/i18n";
import type { LocalizedStep } from "@/components/onboarding/StepByStep";
import type { DateWindow, JourneyPhase, NextTermJourney } from "@/lib/next-term";
import { weekdayDate } from "@/lib/home/term-status";

export const NEXT_TERM_PATH = "/services/plan-next-term";

const REGISTRAR_URL = "https://www.reg.tu.ac.th";

const TERM_TIMETABLES: Record<string, string> = {
  "2569-2": "/news/bir-timetable-semester-2-2569",
};

function termName(locale: Locale, journey: NextTermJourney): string {
  const { semester } = journey.term;
  if (locale === "th") return semester === "summer" ? "ภาคฤดูร้อน" : `ภาคการศึกษาที่ ${semester}`;
  return semester === "summer" ? "the summer session" : `semester ${semester}`;
}

function capitalised(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function range(locale: Locale, window: DateWindow): string {
  const start = weekdayDate(locale, window.start);
  const end = weekdayDate(locale, window.end);
  return locale === "th" ? `${start} ถึง${end}` : `${start} to ${end}`;
}

export const nextTermCopy = {
  en: {
    breadcrumb: "Services",
    title: "Plan your next term",
    chip: "Plan your next term",
    lede: (journey: NextTermJourney) =>
      `${capitalised(termName("en", journey))} starts ${weekdayDate("en", journey.teachingStart)}. Work through these steps, from choosing courses to the end of add-drop.`,
    keyDatesHeading: "Key dates",
    registration: "Course registration",
    payment: "Pay your fees",
    addDrop: "Late registration and add-drop",
    termStarts: "Classes start",
    notAnnounced: "Not announced yet",
    noJourneyTitle: "No upcoming term dates are recorded yet",
    noJourneyBody:
      "The BIR office announces registration dates on birpolsci.com and the BIR Program Facebook page. They appear here once they are recorded.",
    allDates: "See all dates",
    phase: (phase: JourneyPhase) => {
      const date = weekdayDate("en", phase.date);
      switch (phase.kind) {
        case "beforeRegistration":
          return `Registration opens ${date}`;
        case "registrationOpen":
          return `Registration closes ${date}`;
        case "beforeAddDrop":
          return `Add-drop opens ${date}`;
        case "addDropOpen":
          return `Add-drop closes ${date}`;
        case "beforeTerm":
          return `Classes start ${date}`;
      }
    },
  },
  th: {
    breadcrumb: "บริการ",
    title: "วางแผนเทอมหน้า",
    chip: "วางแผนเทอมหน้า",
    lede: (journey: NextTermJourney) =>
      `${termName("th", journey)}เปิดเรียน${weekdayDate("th", journey.teachingStart)} ทำตามขั้นตอนด้านล่างได้เลย ตั้งแต่เลือกวิชาไปจนถึงปิดช่วงเพิ่มถอนรายวิชา`,
    keyDatesHeading: "วันสำคัญ",
    registration: "ลงทะเบียนเรียน",
    payment: "ชำระค่าธรรมเนียม",
    addDrop: "ลงทะเบียนล่าช้าและเพิ่มถอนรายวิชา",
    termStarts: "เปิดเรียน",
    notAnnounced: "ยังไม่ประกาศ",
    noJourneyTitle: "ยังไม่มีกำหนดการของเทอมหน้า",
    noJourneyBody:
      "สำนักงานโครงการ BIR ประกาศวันลงทะเบียนทาง birpolsci.com และเพจเฟซบุ๊ก BIR Program เมื่อบันทึกกำหนดการแล้วจะแสดงที่หน้านี้",
    allDates: "ดูวันสำคัญทั้งหมด",
    phase: (phase: JourneyPhase) => {
      const date = weekdayDate("th", phase.date);
      switch (phase.kind) {
        case "beforeRegistration":
          return `เปิดลงทะเบียน${date}`;
        case "registrationOpen":
          return `ปิดลงทะเบียน${date}`;
        case "beforeAddDrop":
          return `เปิดเพิ่มถอน${date}`;
        case "addDropOpen":
          return `ปิดเพิ่มถอน${date}`;
        case "beforeTerm":
          return `เปิดเรียน${date}`;
      }
    },
  },
} satisfies Record<Locale, unknown>;

export function keyDateRows(locale: Locale, journey: NextTermJourney) {
  const copy = nextTermCopy[locale];
  const describe = (window?: DateWindow) => (window ? range(locale, window) : copy.notAnnounced);
  return [
    { label: copy.registration, value: describe(journey.registration) },
    { label: copy.payment, value: describe(journey.payment) },
    { label: copy.addDrop, value: describe(journey.addDrop) },
    { label: copy.termStarts, value: weekdayDate(locale, journey.teachingStart) },
  ];
}

export function nextTermSteps(locale: Locale, journey: NextTermJourney): LocalizedStep[] {
  const name = termName(locale, journey);
  const timetable = TERM_TIMETABLES[journey.termKey];
  const en = locale === "en";

  const registrationBlurb = journey.registration
    ? en
      ? `Registration for ${name} runs from ${range(locale, journey.registration)}.`
      : `ลงทะเบียนเรียน${name}ได้ตั้งแต่${range(locale, journey.registration)}`
    : en
      ? "The BIR office has not announced the registration dates yet. Check birpolsci.com and the BIR Program Facebook page."
      : "สำนักงานโครงการ BIR ยังไม่ประกาศวันลงทะเบียน ติดตามได้ที่ birpolsci.com และเพจเฟซบุ๊ก BIR Program";

  const paymentBlurb = journey.payment
    ? en
      ? `Pay between ${range(locale, journey.payment)}.`
      : `ชำระได้ตั้งแต่${range(locale, journey.payment)}`
    : en
      ? "The payment dates have not been announced yet."
      : "ยังไม่ประกาศวันชำระค่าธรรมเนียม";

  const addDropBlurb = journey.addDrop
    ? en
      ? `Late registration and add-drop run from ${range(locale, journey.addDrop)}. Classes start ${weekdayDate(locale, journey.teachingStart)}.`
      : `ลงทะเบียนล่าช้าและเพิ่มถอนรายวิชาได้ตั้งแต่${range(locale, journey.addDrop)} เปิดเรียน${weekdayDate(locale, journey.teachingStart)}`
    : en
      ? `Classes start ${weekdayDate(locale, journey.teachingStart)}. The add-drop dates have not been announced yet.`
      : `เปิดเรียน${weekdayDate(locale, journey.teachingStart)} ยังไม่ประกาศวันเพิ่มถอนรายวิชา`;

  return [
    {
      id: "needs",
      title: en ? "Check what you still need" : "ดูว่ายังขาดวิชาอะไร",
      blurb: en
        ? "Your study plan shows the courses and credits you still need to graduate."
        : "แผนการเรียนจะบอกว่ายังต้องเรียนวิชาอะไรและขาดอีกกี่หน่วยกิตจึงจะจบ",
      tasks: [
        {
          id: "open-plan",
          label: en ? "Open your study plan" : "เปิดแผนการเรียนของคุณ",
          hint: en ? "Start one if you have not made a plan" : "ถ้ายังไม่มีแผน เริ่มสร้างได้เลย",
          href: "/services/study-plan",
        },
        {
          id: "curriculum",
          label: en ? "Read how your curriculum works" : "อ่านโครงสร้างหลักสูตรของคุณ",
          href: "/student-life/studying/curriculum",
        },
      ],
    },
    {
      id: "choose",
      title: en ? "Choose your courses" : "เลือกวิชาที่จะเรียน",
      blurb: en
        ? `See what is offered in ${name}, when it is taught and what students say about it.`
        : `ดูว่า${name}เปิดวิชาอะไร เรียนวันไหน และรุ่นพี่ว่าอย่างไร`,
      tasks: [
        timetable
          ? {
              id: "timetable",
              label: en
                ? `Read the class and exam timetable for ${name}`
                : `อ่านตารางเรียนและตารางสอบ${name}`,
              href: timetable,
            }
          : {
              id: "timetable",
              label: en
                ? "Look for the class timetable in the latest news"
                : "ดูตารางเรียนในข่าวล่าสุด",
              href: "/news",
            },
        {
          id: "reviews",
          label: en ? "Read course reviews by students" : "อ่านรีวิวรายวิชาจากรุ่นพี่",
          href: "/student-life/course-reviews",
        },
        {
          id: "compare",
          label: en ? "Compare courses side by side" : "เปรียบเทียบรายวิชา",
          href: "/student-life/course-reviews/compare",
        },
      ],
    },
    {
      id: "check",
      title: en ? "Check your plan works" : "ตรวจว่าแผนใช้ได้จริง",
      blurb: en
        ? "Make sure you have passed every prerequisite and that no two classes clash."
        : "ตรวจว่าผ่านวิชาบังคับก่อนครบ และไม่มีวิชาที่เวลาเรียนชนกัน",
      tasks: [
        {
          id: "prerequisites",
          label: en
            ? "Check your plan for prerequisite problems"
            : "ตรวจแผนว่ามีปัญหาวิชาบังคับก่อนหรือไม่",
          hint: en ? "Your plan lists anything that needs fixing" : "หน้าแผนจะแจ้งสิ่งที่ต้องแก้",
          href: "/services/study-plan",
        },
        {
          id: "calendar",
          label: en ? "Put your classes in your phone's calendar" : "ใส่เวลาเรียนลงในปฏิทินของคุณ",
          href: "/services/calendar",
        },
      ],
    },
    {
      id: "register",
      title: en ? "Register for your courses" : "ลงทะเบียนเรียน",
      blurb: registrationBlurb,
      tasks: [
        {
          id: "registrar",
          label: en ? "Register on the Registrar's website" : "ลงทะเบียนในเว็บไซต์สำนักทะเบียน",
          href: REGISTRAR_URL,
          external: true,
        },
        {
          id: "full-course",
          label: en
            ? "Ask the BIR office about a registration problem"
            : "สอบถามสำนักงานโครงการ BIR เรื่องปัญหาการลงทะเบียน",
          href: "/contact/academic",
        },
      ],
    },
    {
      id: "pay",
      title: en ? "Pay your fees" : "ชำระค่าธรรมเนียม",
      blurb: paymentBlurb,
      tasks: [
        {
          id: "tu-greats",
          label: en ? "Pay in the TU GREATS app" : "ชำระผ่านแอป TU GREATS",
        },
      ],
    },
    {
      id: "add-drop",
      title: en ? "Add or drop courses" : "เพิ่มหรือถอนรายวิชา",
      blurb: addDropBlurb,
      tasks: [
        {
          id: "how-add-drop",
          label: en
            ? "Read how to add, drop or withdraw a course"
            : "อ่านวิธีเพิ่ม ถอน หรือขอ W รายวิชา",
          href: "/student-life/studying/registration",
        },
        {
          id: "dates-calendar",
          label: en ? "Add BIR dates to your calendar" : "ใส่วันสำคัญของ BIR ลงในปฏิทิน",
          href: "/services/calendar",
        },
      ],
    },
  ];
}
