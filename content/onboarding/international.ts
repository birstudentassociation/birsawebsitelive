/**
 * "Starting at BIR: step by step": international student track. See
 * `content/onboarding/types.ts` for the shape and `content/onboarding/index.ts`
 * for how this is looked up. Deep-links specific handbook chapters (fees,
 * curriculum and study plan, assessment and degree), the rights-and-welfare,
 * study-support and places-nearby home guides, the elected student bodies
 * ladder and BIRSA committee pages, and /contact, rather than pointing only
 * at each section's index. Hints for the visa-and-immigration,
 * banking-and-money and culture-and-language guides, which each still carry
 * a placeholder Notice marking their specifics as unverified, name only the
 * topics those guides cover, not settled details. Every `href` below is a
 * real route, verified against `content/student-life/en/**\/*.mdx`,
 * `content/activity/en/*.mdx` and the other static routes it points to at
 * the time of writing.
 *
 * Thai copy note (matches `content/student-life/tracks.ts`'s convention for
 * this track): the Thai international guides are condensed summaries written
 * for Thai buddies and staff who support international students, not the
 * international student themself. Thai task copy here is phrased the same
 * way (an overview a buddy/staff reader can skim) rather than second-person
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
    en: "Everything to sort out, roughly in order, before and after you arrive in Bangkok to study at BIR. Tick tasks off as you complete them. Nothing is sent anywhere, it all stays on this device.",
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
        en: "The first week is mostly logistics.",
        th: "สัปดาห์แรกส่วนใหญ่เป็นเรื่องการจัดการเบื้องต้น",
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
        {
          id: "browse-places-nearby",
          label: {
            en: "Browse places to live and eat nearby",
            th: "อ่านเรื่องที่พักและร้านอาหารใกล้เคียง",
          },
          hint: {
            en: "Recommended places to live and where to eat around Tha Prachan and Pinklao.",
            th: "ที่พักแนะนำและร้านอาหารรอบท่าพระจันทร์และปิ่นเกล้า",
          },
          href: "/student-life/home/places-nearby",
        },
      ],
    },
    {
      id: "open-a-bank-account",
      title: { en: "Open a bank account", th: "เปิดบัญชีธนาคาร" },
      connector: "and",
      blurb: {
        en: "Sort out money matters early; some other things, like SIM registration, need a Thai address or ID first.",
        th: "จัดการเรื่องการเงินไว้แต่เนิ่น ๆ เพราะบางเรื่อง เช่น การลงทะเบียนซิม อาจต้องใช้ที่อยู่หรือเอกสารประจำตัวในไทยก่อน",
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
        en: "A working phone, internet, and the campus apps you'll rely on make everything else easier.",
        th: "การมีมือถือใช้งานได้ อินเทอร์เน็ตที่เสถียร และแอปที่ต้องใช้บนแคมปัส ช่วยให้เรื่องอื่น ๆ ง่ายขึ้น",
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
        {
          id: "read-rights-and-welfare",
          label: {
            en: "Read about the TU Greats App and campus rights",
            th: "อ่านเรื่องแอป TU Greats และสิทธิบนแคมปัส",
          },
          hint: {
            en: "The TU Greats App for your student card and booking services, plus campus facility hours.",
            th: "แอป TU Greats สำหรับบัตรนักศึกษาและการจองบริการต่าง ๆ พร้อมเวลาเปิดให้บริการของสถานที่ในมหาวิทยาลัย",
          },
          href: "/student-life/home/rights-and-welfare",
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
            en: "Clubs, elected student bodies, BIRSA events, and volunteering.",
            th: "ชมรม องค์กรนักศึกษาที่มาจากการเลือกตั้ง กิจกรรมของ BIRSA และงานอาสา",
          },
          href: "/student-life/home/getting-involved",
        },
        {
          id: "browse-clubs",
          label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" },
          href: "/clubs",
        },
        {
          id: "read-student-bodies",
          label: {
            en: "Read about student bodies international students can run for",
            th: "อ่านเรื่ององค์กรนักศึกษาที่ลงสมัครได้",
          },
          hint: {
            en: "The ladder of elected student bodies open to BIR students, from BIRSA to Thammasat-wide.",
            th: "บันไดองค์กรนักศึกษาแบบเลือกตั้งที่เปิดให้นักศึกษา BIR ลงสมัคร ตั้งแต่ BIRSA ถึงระดับมหาวิทยาลัย",
          },
          href: "/activity/student-bodies",
        },
        {
          id: "join-birsa-committee",
          label: {
            en: "Read about joining BIRSA's committee",
            th: "อ่านเรื่องการสมัครเข้าคณะกรรมการ BIRSA",
          },
          hint: {
            en: "What BIRSA does, and how committee positions open each year.",
            th: "หน้าที่ของ BIRSA และช่วงเวลาที่เปิดรับสมัครกรรมการแต่ละปี",
          },
          href: "/activity/birsa",
        },
        {
          id: "follow-birsa",
          label: { en: "Follow BIRSA's quick links", th: "ติดตามลิงก์ด่วนของ BIRSA" },
          href: "/quick",
        },
        {
          id: "contact-birsa",
          label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" },
          hint: {
            en: "Message the committee directly with a question or concern.",
            th: "ส่งข้อความถึงกรรมการโดยตรงเมื่อมีคำถามหรือข้อกังวล",
          },
          href: "/contact",
        },
      ],
    },
    {
      id: "plan-your-studies",
      title: { en: "Plan your studies", th: "วางแผนการเรียน" },
      connector: "and",
      blurb: {
        en: "After settling in, plan courses and the rules that govern the degree.",
        th: "เมื่อเริ่มตั้งตัวได้แล้ว วางแผนเรื่องการเลือกวิชาเรียนและกติกาที่เกี่ยวกับการสำเร็จการศึกษา",
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
          id: "read-admission-and-fees",
          label: { en: "Read about admission and fees", th: "อ่านเรื่องการรับเข้าและค่าเล่าเรียน" },
          hint: {
            en: "Application requirements and estimated annual tuition: 125,000 baht for Thai students, 144,000 baht for non-Thai students.",
            th: "เกณฑ์การสมัครและค่าเล่าเรียนโดยประมาณต่อปี นักศึกษาไทย 125,000 บาท นักศึกษาต่างชาติ 144,000 บาท",
          },
          href: "/student-life/handbook/admission-and-fees",
        },
        {
          id: "read-curriculum-and-study-plan",
          label: {
            en: "Read the curriculum and study plan chapter",
            th: "อ่านบทหลักสูตรและแผนการศึกษา",
          },
          hint: {
            en: "The full course structure and the 127-credit total for BIR's 2023 revised curriculum.",
            th: "โครงสร้างรายวิชาทั้งหมดและหน่วยกิตรวม 127 หน่วยกิตของหลักสูตร BIR ฉบับปรับปรุง พ.ศ. 2566",
          },
          href: "/student-life/handbook/curriculum-and-study-plan",
        },
        {
          id: "read-assessment-and-degree",
          label: {
            en: "Read the assessment and degree chapter",
            th: "อ่านบทการวัดผลและการสำเร็จการศึกษา",
          },
          hint: {
            en: "Grading, the credit and GPA requirements for graduating, and honours criteria.",
            th: "หลักการให้เกรด เงื่อนไขหน่วยกิตและเกรดเฉลี่ยสำหรับสำเร็จการศึกษา และเกณฑ์เกียรตินิยม",
          },
          href: "/student-life/handbook/assessment-and-degree",
        },
        {
          id: "read-study-support",
          label: {
            en: "Read about libraries and study support",
            th: "อ่านเรื่องห้องสมุดและบริการสนับสนุนการเรียน",
          },
          hint: {
            en: "Libraries, printing quota, TU-GET, and plagiarism checking.",
            th: "ห้องสมุด โควตาพรินต์ TU-GET และการตรวจสอบการคัดลอกผลงาน",
          },
          href: "/student-life/home/study-support",
        },
        {
          id: "read-activity-regulations",
          label: { en: "Check BIRSA activity regulations", th: "ตรวจสอบระเบียบกิจกรรมของ BIRSA" },
          hint: {
            en: "Three documents: the University's regulation on student activities, the Faculty's notice on student activities, and the University's regulation on student discipline (B.E. 2568).",
            th: "เอกสารสามฉบับ ได้แก่ ข้อบังคับมหาวิทยาลัยว่าด้วยกิจกรรมนักศึกษา ประกาศคณะรัฐศาสตร์ว่าด้วยกิจกรรมนักศึกษา และข้อบังคับมหาวิทยาลัยว่าด้วยวินัยนักศึกษา พ.ศ. 2568",
          },
          href: "/activity/regulations",
        },
      ],
    },
  ],
};
