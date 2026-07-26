/**
 * "Starting at BIR: step by step": home (Thai) student track. See
 * `content/onboarding/types.ts` for the shape and `content/onboarding/index.ts`
 * for how this is looked up. Deep-links specific handbook chapters (fees,
 * curriculum and study plan, assessment and degree, about BIR), the
 * rights-and-welfare, study-support and places-nearby home guides, the
 * elected student bodies ladder and BIRSA committee pages, and /contact,
 * rather than pointing only at each section's index. Every `href` below is a
 * real route, verified against `content/student-life/en/**\/*.mdx`,
 * `content/activity/en/*.mdx` and the other static routes it points to at
 * the time of writing.
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
    th: "สิ่งที่ควรทำเรียงตามลำดับคร่าว ๆ ก่อนและระหว่างสัปดาห์แรกที่ BIR ติ๊กในช่องเมื่อทำเสร็จ ข้อมูลจะถูกเก็บไว้ในอุปกรณ์นี้เท่านั้น ไม่ถูกส่งไปที่ใด",
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
        {
          id: "read-about-bir",
          label: { en: "Read about BIR and Thammasat", th: "อ่านเรื่อง BIR และธรรมศาสตร์" },
          hint: {
            en: "A history of Thammasat and the Faculty, and how to contact the BIR programme office.",
            th: "ประวัติธรรมศาสตร์และคณะรัฐศาสตร์ พร้อมช่องทางติดต่อสำนักงานโครงการ BIR",
          },
          href: "/student-life/handbook/about-bir",
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
      ],
    },
    {
      id: "get-set-up",
      title: { en: "Get set up around campus", th: "เตรียมตัวใช้ชีวิตรอบมหาวิทยาลัย" },
      connector: "and",
      blurb: {
        en: "Work out how you'll get to and around Tha Prachan.",
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
        {
          id: "browse-places-nearby",
          label: { en: "Browse food and housing nearby", th: "ดูร้านอาหารและที่พักใกล้เคียง" },
          hint: {
            en: "Around 70 food places and 16 recommended places to live near Tha Prachan and Pinklao.",
            th: "รวมร้านอาหารเกือบ 70 ร้านและที่พักแนะนำ 16 แห่งใกล้ท่าพระจันทร์และปิ่นเกล้า",
          },
          href: "/student-life/home/places-nearby",
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
      id: "know-your-rights-and-support",
      title: { en: "Know your rights and support", th: "รู้สิทธิและบริการสนับสนุนของคุณ" },
      connector: "and",
      blurb: {
        en: "Entitlements and services that come with being a Thammasat student.",
        th: "สิทธิและบริการต่าง ๆ ที่คุณมีในฐานะนักศึกษาธรรมศาสตร์",
      },
      tasks: [
        {
          id: "read-rights-and-welfare",
          label: {
            en: "Read about your rights and welfare",
            th: "อ่านเรื่องสิทธิและสวัสดิการของคุณ",
          },
          hint: {
            en: "Voting rights, dress and title rights, free menstrual products and condoms, and the TU Greats App.",
            th: "สิทธิการเลือกตั้ง สิทธิการแต่งกายและคำนำหน้านาม ผ้าอนามัยและถุงยางอนามัยฟรี และแอป TU Greats",
          },
          href: "/student-life/home/rights-and-welfare",
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
      ],
    },
    {
      id: "get-involved",
      title: { en: "Get involved", th: "เข้าร่วมกิจกรรม" },
      connector: "and",
      blurb: {
        en: "Ways to meet people and get involved in your first weeks.",
        th: "วิธีเริ่มรู้จักคนและเข้าร่วมกิจกรรมในช่วงแรกที่ BIR",
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
            en: "Read about student bodies you can run for",
            th: "อ่านเรื่ององค์กรนักศึกษาที่ลงสมัครได้",
          },
          hint: {
            en: "The ladder of elected student bodies you vote in and can stand for, from BIRSA to Thammasat-wide.",
            th: "บันไดองค์กรนักศึกษาแบบเลือกตั้งที่ลงคะแนนหรือลงสมัครได้ ตั้งแต่ BIRSA ถึงระดับมหาวิทยาลัย",
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
          hint: {
            en: "Socials, official links and other useful shortcuts in one place.",
            th: "โซเชียลมีเดีย ลิงก์ทางการ และทางลัดที่มีประโยชน์อื่น ๆ ในที่เดียว",
          },
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
        en: "Choosing courses and understanding the rules that govern your degree.",
        th: "การเลือกวิชาเรียนและกติกาที่เกี่ยวกับการสำเร็จการศึกษา",
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
