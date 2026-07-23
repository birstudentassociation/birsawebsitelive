/**
 * "Starting at BIR: step by step": home (Thai) student track. See
 * `content/onboarding/types.ts` for the shape and `content/onboarding/index.ts`
 * for how this is looked up. Every `href` below is a real route, verified
 * against `content/student-life/en/home/*.mdx` and the other static routes it
 * points to at the time of writing.
 */
import type { OnboardingTrack } from "./types";

export const homeTrack: OnboardingTrack = {
  audience: "home",
  title: {
    en: "Starting at BIR: for Thai and home students",
    th: "เริ่มต้นที่ BIR: สำหรับนักศึกษาไทย",
  },
  lede: {
    en: "Everything to do, roughly in order, before and during your first weeks at BIR. Tick tasks off as you complete them. Nothing is sent anywhere, it all stays on this device.",
    th: "สิ่งที่ควรทำเรียงตามลำดับคร่าว ๆ ก่อนและระหว่างสัปดาห์แรกที่ BIR ติ๊กในช่องเมื่อทำเสร็จได้เลย ข้อมูลจะถูกเก็บไว้ในอุปกรณ์นี้เท่านั้น ไม่ถูกส่งไปที่ใด",
  },
  steps: [
    {
      id: "before-you-arrive",
      title: { en: "Before term starts", th: "ก่อนเปิดเทอม" },
      blurb: {
        en: "Get the lay of the land before you set foot on campus.",
        th: "ทำความเข้าใจภาพรวมก่อนเปิดเทอม",
      },
      tasks: [
        {
          id: "read-handbook",
          label: { en: "Read the student handbook", th: "อ่านคู่มือนักศึกษา" },
          hint: {
            en: "Curriculum, fees, academic rules and how BIR works.",
            th: "หลักสูตร ค่าเล่าเรียน และระเบียบการเรียนของ BIR",
          },
          href: "/student-life/handbook",
        },
        {
          id: "check-orientation-dates",
          label: {
            en: "Check orientation and term dates",
            th: "ตรวจสอบวันปฐมนิเทศและกำหนดการเปิดเทอม",
          },
          hint: {
            en: "Look for the latest announcements and events.",
            th: "ดูประกาศและกิจกรรมล่าสุด",
          },
          href: "/news",
        },
      ],
    },
    {
      id: "get-set-up",
      title: { en: "Get set up around campus", th: "เตรียมตัวใช้ชีวิตรอบมหาวิทยาลัย" },
      connector: "and",
      blurb: {
        en: "Work out how you'll actually get to and around Tha Prachan.",
        th: "หาทางเดินทางไปและรอบท่าพระจันทร์",
      },
      tasks: [
        {
          id: "learn-shuttle-bus",
          label: { en: "Learn the shuttle bus routes", th: "เรียนรู้เส้นทางรถรับส่ง" },
          hint: {
            en: "Thammasat's two free shuttle lines from Tha Prachan.",
            th: "รถรับส่งฟรี 2 สายจากท่าพระจันทร์",
          },
          href: "/student-life/home/shuttle-bus",
        },
        {
          id: "learn-getting-around",
          label: {
            en: "Learn your way around Tha Prachan",
            th: "เรียนรู้เส้นทางรอบท่าพระจันทร์",
          },
          hint: {
            en: "Campus, the old city, and nearby landmarks.",
            th: "มหาวิทยาลัย เมืองเก่า และสถานที่ใกล้เคียง",
          },
          href: "/student-life/home/getting-around",
        },
      ],
    },
    {
      id: "money-and-food",
      title: { en: "Money and food", th: "เรื่องเงินและอาหาร" },
      connector: "and",
      blurb: {
        en: "Get a feel for everyday costs before they surprise you.",
        th: "ทำความเข้าใจค่าใช้จ่ายประจำวันไว้ล่วงหน้า",
      },
      tasks: [
        {
          id: "read-money-matters",
          label: { en: "Read about money matters", th: "อ่านเรื่องการเงิน" },
          hint: {
            en: "Allowances, part-time work basics and student discounts.",
            th: "เงินที่ได้รับ งานพาร์ทไทม์เบื้องต้น และส่วนลดนักศึกษา",
          },
          href: "/student-life/home/money-matters",
        },
        {
          id: "read-food-and-budgeting",
          label: { en: "Read about food and budgeting", th: "อ่านเรื่องอาหารและงบประมาณ" },
          hint: {
            en: "Where to eat around Tha Prachan and Wang Lang, and rough monthly costs.",
            th: "ที่กินรอบท่าพระจันทร์และวังหลัง พร้อมค่าใช้จ่ายรายเดือนคร่าว ๆ",
          },
          href: "/student-life/home/food-and-budgeting",
        },
      ],
    },
    {
      id: "stay-safe-and-well",
      title: { en: "Stay safe and well", th: "ดูแลความปลอดภัยและสุขภาพ" },
      connector: "and",
      blurb: {
        en: "Know where to turn for health support and how to stay safe day to day.",
        th: "รู้ว่าจะขอความช่วยเหลือด้านสุขภาพได้จากที่ไหน และดูแลความปลอดภัยในชีวิตประจำวันอย่างไร",
      },
      tasks: [
        {
          id: "read-health-and-wellbeing",
          label: {
            en: "Read about health and wellbeing",
            th: "อ่านเรื่องสุขภาพและความเป็นอยู่ที่ดี",
          },
          hint: {
            en: "TU health services, counselling and mental health support.",
            th: "บริการสุขภาพของ มธ. การให้คำปรึกษา และสุขภาพจิต",
          },
          href: "/student-life/home/health-and-wellbeing",
        },
        {
          id: "read-safety-and-emergencies",
          label: {
            en: "Read about safety and emergencies",
            th: "อ่านเรื่องความปลอดภัยและเหตุฉุกเฉิน",
          },
          hint: {
            en: "Campus security, river safety, common scams and how to report harassment.",
            th: "การรักษาความปลอดภัยในมหาวิทยาลัย ความปลอดภัยทางน้ำ กลโกงที่พบบ่อย และการแจ้งเหตุคุกคาม",
          },
          href: "/student-life/home/safety-and-emergencies",
        },
        {
          id: "know-emergency-page",
          label: {
            en: "Know where to find emergency information",
            th: "รู้ว่าจะหาข้อมูลฉุกเฉินได้จากที่ไหน",
          },
          hint: {
            en: "Alert levels, key numbers and what to do first.",
            th: "ระดับการแจ้งเตือน เบอร์โทรสำคัญ และสิ่งที่ต้องทำก่อน",
          },
          href: "/emergency",
        },
      ],
    },
    {
      id: "get-involved",
      title: { en: "Get involved", th: "เข้าร่วมกิจกรรม" },
      connector: "and",
      blurb: {
        en: "BIR gets better once you know people. Here's where to start.",
        th: "ชีวิต BIR จะดีขึ้นเมื่อคุณรู้จักคนรอบตัว เริ่มต้นได้จากที่นี่",
      },
      tasks: [
        {
          id: "read-getting-involved",
          label: { en: "Read about getting involved", th: "อ่านเรื่องการเข้าร่วมกิจกรรม" },
          hint: {
            en: "Clubs, BIRSA events, volunteering and why it's worth your time.",
            th: "ชมรม กิจกรรมของ BIRSA งานอาสา และเหตุผลที่ควรลองเข้าร่วม",
          },
          href: "/student-life/home/getting-involved",
        },
        {
          id: "browse-clubs",
          label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" },
          href: "/clubs",
        },
        {
          id: "follow-birsa",
          label: { en: "Follow BIRSA's quick links", th: "ติดตามลิงก์ด่วนของ BIRSA" },
          hint: {
            en: "Socials, official links and other useful shortcuts in one place.",
            th: "โซเชียลมีเดีย ลิงก์ทางการ และทางลัดที่มีประโยชน์อื่น ๆ ในที่เดียว",
          },
          href: "/quick",
        },
      ],
    },
    {
      id: "plan-your-studies",
      title: { en: "Plan your studies", th: "วางแผนการเรียน" },
      connector: "and",
      blurb: {
        en: "Look further ahead: choosing courses and understanding the rules that govern your degree.",
        th: "มองไปข้างหน้า ทั้งการเลือกวิชาเรียนและกติกาที่เกี่ยวกับการสำเร็จการศึกษา",
      },
      tasks: [
        {
          id: "read-course-reviews",
          label: { en: "Read student course reviews", th: "อ่านรีวิวรายวิชาจากรุ่นพี่" },
          href: "/student-life/course-reviews",
        },
        {
          id: "read-academic-rules",
          label: { en: "Read the academic rules chapter", th: "อ่านบทเรื่องระเบียบการเรียน" },
          hint: {
            en: "Course registration, exam absences, leave, and probation rules.",
            th: "การลงทะเบียนเรียน การขาดสอบ การลาพัก และเกณฑ์การพ้นสภาพ",
          },
          href: "/student-life/handbook/academic-life",
        },
        {
          id: "read-activity-regulations",
          label: { en: "Check BIRSA activity regulations", th: "ตรวจสอบระเบียบกิจกรรมของ BIRSA" },
          href: "/activity/regulations",
        },
      ],
    },
  ],
};
