/**
 * "Starting at BIR: step by step" — international student track. See
 * `content/onboarding/types.ts` for the shape and `content/onboarding/index.ts`
 * for how this is looked up. Every `href` below is a real route — verified
 * against `content/student-life/en/international/*.mdx` and the other static
 * routes it points to at the time of writing.
 *
 * Thai copy note (matches `content/student-life/tracks.ts`'s convention for
 * this track): the Thai international guides are condensed summaries written
 * for Thai buddies and staff who support international students, not the
 * international student themself. Thai task copy here is phrased the same
 * way — an overview a buddy/staff reader can skim — rather than second-person
 * instructions aimed at the student.
 */
import type { OnboardingTrack } from "./types";

export const internationalTrack: OnboardingTrack = {
  audience: "international",
  title: {
    en: "Starting at BIR: for international students",
    th: "เริ่มต้นที่ BIR: สำหรับนักศึกษาต่างชาติ",
  },
  lede: {
    en: "Everything to sort out, roughly in order, before and after you arrive in Bangkok to study at BIR. Tick tasks off as you complete them — nothing is sent anywhere, it all stays on this device.",
    th: "ภาพรวมสิ่งที่นักศึกษาต่างชาติควรจัดการ เรียงตามลำดับคร่าว ๆ ก่อนและหลังเดินทางมาเรียนที่ BIR ในกรุงเทพฯ หน้านี้เป็นเวอร์ชันสรุปย่อ เขียนไว้ให้เพื่อนบัดดี้ไทยและเจ้าหน้าที่ที่ช่วยดูแลนักศึกษาต่างชาติเข้าใจภาพรวม เนื้อหาฉบับเต็มอยู่ในเวอร์ชันภาษาอังกฤษ ติ๊กในช่องเมื่อทำแต่ละอย่างเสร็จได้ ข้อมูลจะถูกเก็บไว้ในอุปกรณ์นี้เท่านั้น",
  },
  steps: [
    {
      id: "sort-your-visa",
      title: { en: "Sort your visa", th: "จัดการเรื่องวีซ่า" },
      blurb: {
        en: "Start with the paperwork that takes the longest.",
        th: "ภาพรวมเอกสารที่ควรเริ่มจัดการก่อนเป็นอันดับแรก เพราะมักใช้เวลานานที่สุด",
      },
      tasks: [
        {
          id: "read-visa-and-immigration",
          label: { en: "Read about visa and immigration", th: "อ่านเรื่องวีซ่าและการเข้าเมือง" },
          hint: {
            en: "Non-immigrant ED visa basics, 90-day reporting, re-entry permits and extensions.",
            th: "ภาพรวมวีซ่านักเรียนประเภท ED การรายงานตัวทุก 90 วัน และการขอต่อวีซ่า",
          },
          href: "/student-life/international/visa-and-immigration",
        },
      ],
    },
    {
      id: "arrive-and-settle-in",
      title: { en: "Arrive and settle in", th: "เดินทางมาถึงและเริ่มตั้งตัว" },
      connector: "and",
      blurb: {
        en: "The first week is mostly logistics — here's what to expect.",
        th: "สัปดาห์แรกส่วนใหญ่เป็นเรื่องการจัดการเบื้องต้น สรุปสิ่งที่ควรรู้ไว้ให้",
      },
      tasks: [
        {
          id: "read-arrival-and-first-week",
          label: {
            en: "Read about arrival and the first week",
            th: "อ่านเรื่องการเดินทางมาถึงและสัปดาห์แรก",
          },
          hint: {
            en: "Getting from the airport to Tha Prachan, and what to set up first.",
            th: "การเดินทางจากสนามบินมาท่าพระจันทร์ และสิ่งที่ควรจัดการก่อนเป็นอันดับแรก",
          },
          href: "/student-life/international/arrival-and-first-week",
        },
        {
          id: "read-culture-and-language",
          label: {
            en: "Read about culture and language basics",
            th: "อ่านเรื่องวัฒนธรรมและภาษาเบื้องต้น",
          },
          hint: {
            en: "Wai etiquette, temple dress codes, basic Thai phrases and Buddhist holidays.",
            th: "มารยาทการไหว้ การแต่งกายเข้าวัด วลีภาษาไทยพื้นฐาน และวันสำคัญทางศาสนา",
          },
          href: "/student-life/international/culture-and-language",
        },
      ],
    },
    {
      id: "open-a-bank-account",
      title: { en: "Open a bank account", th: "เปิดบัญชีธนาคาร" },
      connector: "and",
      blurb: {
        en: "Sort out money matters early — some other things, like SIM registration, need a Thai address or ID first.",
        th: "แนะนำให้จัดการเรื่องการเงินไว้แต่เนิ่น ๆ เพราะบางเรื่อง เช่น การลงทะเบียนซิม อาจต้องใช้ที่อยู่หรือเอกสารประจำตัวในไทยก่อน",
      },
      tasks: [
        {
          id: "read-banking-and-money",
          label: { en: "Read about banking and money", th: "อ่านเรื่องธนาคารและการเงิน" },
          hint: {
            en: "Opening a Thai bank account, PromptPay, and documents banks usually ask for.",
            th: "การเปิดบัญชีธนาคารไทย พร้อมเพย์ และเอกสารที่ธนาคารมักขอ",
          },
          href: "/student-life/international/banking-and-money",
        },
      ],
    },
    {
      id: "get-connected",
      title: { en: "Get connected", th: "เชื่อมต่อการสื่อสาร" },
      connector: "and",
      blurb: {
        en: "A working phone and reliable internet make everything else easier.",
        th: "การมีมือถือใช้งานได้และอินเทอร์เน็ตที่เสถียรช่วยให้เรื่องอื่น ๆ ง่ายขึ้น",
      },
      tasks: [
        {
          id: "read-phones-and-internet",
          label: { en: "Read about phones and internet", th: "อ่านเรื่องมือถือและอินเทอร์เน็ต" },
          hint: {
            en: "SIM registration, choosing a carrier, and connecting to TU wifi.",
            th: "การลงทะเบียนซิม การเลือกเครือข่าย และการเชื่อมต่อ wifi ของ มธ.",
          },
          href: "/student-life/international/phones-and-internet",
        },
      ],
    },
    {
      id: "look-after-your-health",
      title: { en: "Look after your health", th: "ดูแลสุขภาพ" },
      connector: "and",
      blurb: {
        en: "Know where to go for healthcare, and where to find emergency information, before it's needed.",
        th: "ควรรู้ล่วงหน้าว่าจะไปรักษาพยาบาลที่ไหน และหาข้อมูลฉุกเฉินได้จากที่ใด ก่อนที่จะต้องใช้จริง",
      },
      tasks: [
        {
          id: "read-healthcare-and-insurance",
          label: {
            en: "Read about healthcare and insurance",
            th: "อ่านเรื่องการรักษาพยาบาลและประกันสุขภาพ",
          },
          hint: {
            en: "Hospitals near campus, insurance expectations, emergency numbers and pharmacies.",
            th: "โรงพยาบาลใกล้มหาวิทยาลัย ข้อกำหนดด้านประกัน เบอร์ฉุกเฉิน และร้านขายยา",
          },
          href: "/student-life/international/healthcare-and-insurance",
        },
        {
          id: "know-emergency-page",
          label: {
            en: "Know where to find emergency information",
            th: "รู้ว่าจะหาข้อมูลฉุกเฉินได้จากที่ไหน",
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
        en: "The BIR and BIRSA community is one of the fastest ways to settle in.",
        th: "ชุมชน BIR และ BIRSA เป็นหนึ่งในวิธีที่ช่วยให้ปรับตัวได้เร็วที่สุด",
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
          href: "/quick",
        },
      ],
    },
    {
      id: "plan-your-studies",
      title: { en: "Plan your studies", th: "วางแผนการเรียน" },
      connector: "and",
      blurb: {
        en: "Once things have settled, look ahead to courses and the rules that govern the degree.",
        th: "เมื่อเริ่มตั้งตัวได้แล้ว ให้มองไปข้างหน้าเรื่องการเลือกวิชาเรียนและกติกาที่เกี่ยวกับการสำเร็จการศึกษา",
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
