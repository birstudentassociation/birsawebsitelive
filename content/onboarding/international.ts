/**
 * "Starting at BIR, step by step": track for students moving to Thailand from
 * abroad. See `content/onboarding/types.ts` for the shape and
 * `content/onboarding/index.ts` for how it is looked up. Every task is an
 * action a student can tick. Internal `href`s point at the grouped guides
 * (`/student-life/{topic}/{slug}`) or at static routes.
 */
import type { OnboardingTrack } from "./types";

export const internationalTrack: OnboardingTrack = {
  audience: "international",
  title: {
    en: "Starting at BIR as an international student",
    th: "เริ่มต้นที่ BIR สำหรับนักศึกษาต่างชาติ",
  },
  lede: {
    en: "Tasks for before you fly and after you arrive in Bangkok, in order. Tick each one when it is done. Your ticks are saved in this browser only.",
    th: "สิ่งที่ต้องทำก่อนเดินทางและหลังมาถึงกรุงเทพฯ เรียงตามลำดับ ทำเสร็จแล้วติ๊กช่องไว้ ระบบเก็บรายการที่ติ๊กในเบราว์เซอร์นี้เท่านั้น",
  },
  steps: [
    {
      id: "before-you-fly",
      title: { en: "Before you fly", th: "ก่อนเดินทาง" },
      blurb: {
        en: "The visa takes the longest, so start there.",
        th: "วีซ่าใช้เวลานานที่สุด จึงควรเริ่มก่อน",
      },
      tasks: [
        {
          id: "apply-ed-visa",
          label: {
            en: "Apply for your Non-Immigrant ED visa",
            th: "ยื่นขอวีซ่านักเรียน (Non-Immigrant ED)",
          },
          hint: {
            en: "Apply through thaievisa.go.th once BIR has accepted you. The visa must be used within 90 days of issue.",
            th: "ยื่นผ่าน thaievisa.go.th หลังได้รับการตอบรับจาก BIR และต้องใช้วีซ่าภายใน 90 วันนับจากวันออกวีซ่า",
          },
          href: "/student-life/before-you-arrive/student-visa",
        },
        {
          id: "fill-in-tdac",
          label: {
            en: "Fill in your TDAC in the 72 hours before you fly",
            th: "กรอกแบบฟอร์ม TDAC ภายใน 72 ชั่วโมงก่อนเดินทาง",
          },
          hint: {
            en: "The Thailand Digital Arrival Card is free and every non-Thai traveller needs one.",
            th: "บัตรเข้าเมืองดิจิทัลของไทยไม่มีค่าใช้จ่าย และชาวต่างชาติทุกคนต้องกรอก",
          },
          href: "/student-life/before-you-arrive/student-visa",
        },
        {
          id: "book-first-nights",
          label: {
            en: "Book somewhere to stay for your first nights",
            th: "จองที่พักสำหรับสองสามคืนแรก",
          },
          href: "/student-life/living-nearby/housing",
        },
        {
          id: "plan-airport-route",
          label: {
            en: "Plan your route from the airport to Tha Prachan",
            th: "วางแผนเส้นทางจากสนามบินไปท่าพระจันทร์",
          },
          href: "/student-life/getting-around/from-the-airport",
        },
      ],
    },
    {
      id: "first-week",
      title: { en: "Set up in your first week", th: "ตั้งค่าในสัปดาห์แรก" },
      connector: "and",
      tasks: [
        {
          id: "register-sim",
          label: {
            en: "Register a Thai SIM card with your passport",
            th: "ลงทะเบียนซิมการ์ดไทยด้วยหนังสือเดินทาง",
          },
          hint: {
            en: "A passport is all you need.",
            th: "ใช้เพียงหนังสือเดินทางเท่านั้น",
          },
          href: "/student-life/first-weeks/sim-and-wifi",
        },
        {
          id: "tu-greats-card",
          label: {
            en: "Install the TU Greats app and activate your student card",
            th: "ติดตั้งแอป TU Greats และเปิดใช้งานบัตรนักศึกษา",
          },
          href: "/student-life/first-weeks/first-two-weeks",
        },
        {
          id: "tu-account-wifi",
          label: {
            en: "Sign in to your TU account and connect to campus Wi-Fi",
            th: "เข้าสู่ระบบบัญชี TU และเชื่อมต่อ Wi-Fi ของมหาวิทยาลัย",
          },
          href: "/student-life/first-weeks/sim-and-wifi",
        },
        {
          id: "bangkok-bank-card",
          label: {
            en: "Activate your Bangkok Bank card",
            th: "เปิดใช้งานบัตรธนาคารกรุงเทพ",
          },
          hint: {
            en: "Collect your student card at the Bangkok Bank Tha Prachan branch and activate the linked account there.",
            th: "รับบัตรนักศึกษาที่ธนาคารกรุงเทพ สาขาท่าพระจันทร์ และเปิดใช้งานบัญชีที่ผูกกับบัตรที่นั่น",
          },
          href: "/student-life/money/bank-account",
        },
      ],
    },
    {
      id: "immigration",
      title: {
        en: "Keep your immigration record in order",
        th: "จัดการเรื่องคนเข้าเมืองให้เรียบร้อย",
      },
      connector: "and",
      blurb: {
        en: "Missing these dates can cost you a fine or a visa extension.",
        th: "ถ้าพลาดกำหนดเหล่านี้ อาจเสียค่าปรับหรือขยายวีซ่าไม่ได้",
      },
      tasks: [
        {
          id: "check-tm30",
          label: {
            en: "Ask your landlord to confirm they have filed your TM30",
            th: "ถามเจ้าของที่พักว่าแจ้ง TM30 แล้วหรือยัง",
          },
          hint: {
            en: "Your landlord must notify Immigration within 24 hours of your arrival. Keep the receipt.",
            th: "เจ้าของที่พักต้องแจ้งตำรวจตรวจคนเข้าเมืองภายใน 24 ชั่วโมงหลังนักศึกษามาถึง เก็บใบรับแจ้งไว้",
          },
          href: "/student-life/rules-and-rights/visa-rules",
        },
        {
          id: "note-90-day-date",
          label: {
            en: "Put your 90-day report date in your calendar",
            th: "บันทึกวันรายงานตัว 90 วันลงในปฏิทิน",
          },
          hint: {
            en: "Count 90 days from your arrival date.",
            th: "นับ 90 วันจากวันที่เดินทางมาถึง",
          },
          href: "/student-life/rules-and-rights/visa-rules",
        },
        {
          id: "report-address",
          label: {
            en: "Report your address to Immigration within 90 days",
            th: "รายงานที่พักต่อสำนักงานตรวจคนเข้าเมืองภายใน 90 วัน",
          },
          hint: {
            en: "Check the Immigration Bureau website for how to report and for the current rules.",
            th: "ดูวิธีรายงานและเงื่อนไขล่าสุดที่เว็บไซต์สำนักงานตรวจคนเข้าเมือง",
          },
          href: "/student-life/rules-and-rights/visa-rules",
        },
        {
          id: "request-extension-letter",
          label: {
            en: "Ask the BIR office for an extension letter a month before your visa ends",
            th: "ขอหนังสือรับรองเพื่อขยายวีซ่าจากสำนักงาน BIR ล่วงหน้า 1 เดือนก่อนวีซ่าหมดอายุ",
          },
          hint: {
            en: "Email bir@tu.ac.th or call 02-221-6111 ext. 3409.",
            th: "อีเมล bir@tu.ac.th หรือโทร 02-221-6111 ต่อ 3409",
          },
          href: "/student-life/rules-and-rights/visa-rules",
        },
      ],
    },
    {
      id: "register-and-study",
      title: { en: "Register and check your fees", th: "ลงทะเบียนและตรวจค่าเล่าเรียน" },
      connector: "and",
      tasks: [
        {
          id: "register-courses",
          label: { en: "Register for your courses", th: "ลงทะเบียนรายวิชา" },
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
      ],
    },
    {
      id: "health-and-money",
      title: { en: "Prepare for health and money", th: "เตรียมพร้อมเรื่องสุขภาพและเงิน" },
      connector: "and",
      tasks: [
        {
          id: "health-insurance",
          label: {
            en: "Arrange your own health insurance and find the nearest hospital",
            th: "จัดทำประกันสุขภาพของตนเองและหาโรงพยาบาลที่ใกล้ที่สุด",
          },
          href: "/student-life/health-and-safety/getting-medical-help",
        },
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
          id: "monthly-budget",
          label: { en: "Set a monthly budget", th: "ตั้งงบรายเดือน" },
          href: "/student-life/money/monthly-costs",
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
          id: "go-to-event",
          label: {
            en: "Go to a BIRSA event in your first month",
            th: "เข้าร่วมกิจกรรมของ BIRSA ภายในเดือนแรก",
          },
          href: "/student-life/getting-involved/clubs-and-events",
        },
      ],
    },
  ],
};
