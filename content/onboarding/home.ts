/**
 * "Starting at BIR, step by step": track for students who already live in
 * Thailand. See `content/onboarding/types.ts` for the shape and
 * `content/onboarding/index.ts` for how it is looked up. Every task is an
 * action a student can tick. Internal `href`s point at the grouped guides
 * (`/student-life/{topic}/{slug}`) or at static routes.
 */
import type { OnboardingTrack } from "./types";

export const homeTrack: OnboardingTrack = {
  audience: "home",
  title: {
    en: "Starting at BIR if you live in Thailand",
    th: "เริ่มต้นที่ BIR สำหรับนักศึกษาไทย",
  },
  lede: {
    en: "Tasks for before term and your first weeks at BIR, in a rough order. Tick each one when it is done. Your ticks are saved in this browser only.",
    th: "สิ่งที่ต้องทำก่อนเปิดเทอมและในสัปดาห์แรกที่ BIR เรียงตามลำดับคร่าว ๆ ทำเสร็จแล้วติ๊กช่องไว้ ระบบเก็บรายการที่ติ๊กในเบราว์เซอร์นี้เท่านั้น",
  },
  steps: [
    {
      id: "set-up",
      title: { en: "Set up your student accounts", th: "ตั้งค่าบัญชีนักศึกษา" },
      blurb: {
        en: "Do these before term starts.",
        th: "ทำให้เสร็จก่อนเปิดเทอม",
      },
      tasks: [
        {
          id: "tu-greats-card",
          label: {
            en: "Install the TU Greats app and activate your student card",
            th: "ติดตั้งแอป TU Greats และเปิดใช้งานบัตรนักศึกษา",
          },
          hint: {
            en: "The app holds your virtual student ID and timetable.",
            th: "แอปเก็บบัตรนักศึกษาแบบดิจิทัลและตารางเรียน",
          },
          href: "/student-life/first-weeks/first-two-weeks",
        },
        {
          id: "bangkok-bank-card",
          label: {
            en: "Activate your Bangkok Bank card",
            th: "เปิดใช้งานบัตรธนาคารกรุงเทพ",
          },
          hint: {
            en: "Collect your student card at the Bangkok Bank Tha Prachan branch and activate the linked account there. Refunds are paid into that account.",
            th: "รับบัตรนักศึกษาที่ธนาคารกรุงเทพ สาขาท่าพระจันทร์ และเปิดใช้งานบัญชีที่ผูกกับบัตรที่นั่น เงินคืนจากมหาวิทยาลัยโอนเข้าบัญชีนี้",
          },
          href: "/student-life/money/bank-account",
        },
        {
          id: "tu-account-wifi",
          label: {
            en: "Sign in to your TU account and connect to campus Wi-Fi",
            th: "เข้าสู่ระบบบัญชี TU และเชื่อมต่อ Wi-Fi ของมหาวิทยาลัย",
          },
          hint: {
            en: "One TU login covers student email, Microsoft 365 and Wi-Fi.",
            th: "บัญชี TU ใช้ได้ทั้งอีเมลนักศึกษา Microsoft 365 และ Wi-Fi",
          },
          href: "/student-life/first-weeks/sim-and-wifi",
        },
        {
          id: "orientation-dates",
          label: {
            en: "Put the orientation and term dates in your calendar",
            th: "บันทึกวันปฐมนิเทศและวันเปิดเทอมลงในปฏิทิน",
          },
          hint: {
            en: "BIRSA posts the dates in news.",
            th: "BIRSA ประกาศวันที่ในหน้าข่าว",
          },
          href: "/news",
        },
      ],
    },
    {
      id: "register-and-plan",
      title: { en: "Register and plan your courses", th: "ลงทะเบียนและวางแผนการเรียน" },
      connector: "and",
      tasks: [
        {
          id: "register-courses",
          label: { en: "Register for your courses", th: "ลงทะเบียนเรียน" },
          hint: {
            en: "You can take up to 22 credits a semester and 6 in summer.",
            th: "ลงได้สูงสุด 22 หน่วยกิตต่อภาคเรียน และ 6 หน่วยกิตในภาคฤดูร้อน",
          },
          href: "/student-life/studying/registration",
        },
        {
          id: "check-study-plan",
          label: {
            en: "Find your cohort's credit total in the study plan",
            th: "ดูจำนวนหน่วยกิตของรุ่นตนเองในแผนการศึกษา",
          },
          hint: {
            en: "127 credits for cohorts 64 to 67. 126 credits for the B.E. 2568 (2025) curriculum.",
            th: "รุ่น 64 ถึง 67 ใช้ 127 หน่วยกิต หลักสูตร พ.ศ. 2568 ใช้ 126 หน่วยกิต",
          },
          href: "/student-life/studying/curriculum",
        },
        {
          id: "check-tuition",
          label: {
            en: "Check your tuition and the payment deadline",
            th: "ตรวจค่าเล่าเรียนและกำหนดชำระเงิน",
          },
          href: "/student-life/money/tuition-and-fees",
        },
        {
          id: "read-course-reviews",
          label: {
            en: "Read student reviews before you choose electives",
            th: "อ่านรีวิวรายวิชาก่อนเลือกวิชาเลือก",
          },
          href: "/student-life/course-reviews",
        },
      ],
    },
    {
      id: "get-to-campus",
      title: { en: "Get to campus", th: "เตรียมการเดินทางมามหาวิทยาลัย" },
      connector: "and",
      tasks: [
        {
          id: "live-bus-tracker",
          label: {
            en: "Save the live bus tracker to your phone",
            th: "บันทึกหน้าติดตามรถเวียนแบบสดไว้ในโทรศัพท์",
          },
          hint: {
            en: "It shows when the next free shuttle arrives.",
            th: "ดูเวลาที่รถเวียนฟรีคันถัดไปจะมาถึง",
          },
          href: "/student-life/getting-around/live-bus-tracker",
        },
        {
          id: "shuttle-routes",
          label: {
            en: "Find the stop for the free shuttle bus",
            th: "หาป้ายรถเวียนฟรี",
          },
          href: "/student-life/getting-around/shuttle-bus",
        },
        {
          id: "plan-journey",
          label: {
            en: "Plan your journey to Tha Prachan",
            th: "วางแผนเส้นทางมาท่าพระจันทร์",
          },
          hint: {
            en: "Buses, boats and the MRT.",
            th: "รถเมล์ เรือ และรถไฟฟ้าใต้ดิน",
          },
          href: "/student-life/getting-around/getting-to-campus",
        },
      ],
    },
    {
      id: "money-food-housing",
      title: { en: "Sort out costs, food and housing", th: "จัดการค่าใช้จ่าย อาหาร และที่พัก" },
      connector: "and",
      tasks: [
        {
          id: "monthly-budget",
          label: {
            en: "Set a monthly budget",
            th: "ตั้งงบรายเดือน",
          },
          href: "/student-life/money/monthly-costs",
        },
        {
          id: "student-discounts",
          label: {
            en: "Find the student discounts you can use",
            th: "ดูส่วนลดสำหรับนักศึกษาที่ใช้ได้",
          },
          href: "/student-life/money/student-discounts",
        },
        {
          id: "where-to-eat",
          label: {
            en: "Choose two or three places to eat near campus",
            th: "เลือกร้านอาหารใกล้มหาวิทยาลัยไว้ 2 ถึง 3 ร้าน",
          },
          href: "/student-life/living-nearby/where-to-eat",
        },
        {
          id: "housing",
          label: {
            en: "Shortlist places to live if you need to move closer",
            th: "คัดที่พักไว้ถ้าต้องย้ายมาอยู่ใกล้มหาวิทยาลัย",
          },
          href: "/student-life/living-nearby/housing",
        },
      ],
    },
    {
      id: "health-and-safety",
      title: { en: "Prepare for health and safety", th: "เตรียมพร้อมเรื่องสุขภาพและความปลอดภัย" },
      connector: "and",
      tasks: [
        {
          id: "save-emergency-numbers",
          label: {
            en: "Save the emergency numbers in your phone",
            th: "บันทึกเบอร์ฉุกเฉินไว้ในโทรศัพท์",
          },
          hint: {
            en: "Call 1669 for an ambulance and 191 for the police.",
            th: "โทร 1669 เรียกรถพยาบาล และ 191 แจ้งตำรวจ",
          },
          href: "/emergency",
        },
        {
          id: "campus-clinic",
          label: {
            en: "Find the campus clinic and its opening hours",
            th: "ดูที่ตั้งและเวลาทำการของคลินิกในมหาวิทยาลัย",
          },
          hint: {
            en: "The clinic is open 08.30 to 16.30.",
            th: "คลินิกเปิด 08.30 ถึง 16.30 น.",
          },
          href: "/student-life/health-and-safety/getting-medical-help",
        },
        {
          id: "harassment-reporting",
          label: {
            en: "Learn how to report harassment",
            th: "ดูวิธีแจ้งเหตุล่วงละเมิด",
          },
          href: "/student-life/rules-and-rights/complaints",
        },
      ],
    },
    {
      id: "study-support",
      title: {
        en: "Find study support and know your rights",
        th: "หาแหล่งช่วยเรียนและรู้สิทธิของนักศึกษา",
      },
      connector: "and",
      tasks: [
        {
          id: "libraries-printing",
          label: {
            en: "Find your library and your printing quota",
            th: "หาห้องสมุดและดูโควตาการพิมพ์เอกสาร",
          },
          href: "/student-life/studying/libraries-and-study-support",
        },
        {
          id: "rights-facilities",
          label: {
            en: "Find the free campus services you can use",
            th: "ใช้บริการฟรีของมหาวิทยาลัย",
          },
          hint: {
            en: "Includes free menstrual products and condoms.",
            th: "รวมผ้าอนามัยและถุงยางอนามัยฟรี",
          },
          href: "/student-life/rules-and-rights/rights-and-facilities",
        },
      ],
    },
    {
      id: "get-involved",
      title: { en: "Get involved", th: "เข้าร่วมกิจกรรม" },
      connector: "and",
      tasks: [
        {
          id: "join-club",
          label: { en: "Join a club", th: "สมัครเข้าชมรม" },
          href: "/clubs",
        },
        {
          id: "student-bodies",
          label: {
            en: "Find out which student bodies you can vote for",
            th: "ดูว่าลงคะแนนเลือกองค์กรนักศึกษาใดได้บ้าง",
          },
          href: "/student-life/getting-involved/student-bodies",
        },
      ],
    },
  ],
};
