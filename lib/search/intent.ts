/**
 * Intent rules: what the reader is probably trying to *do*.
 *
 * Ranking answers "which pages mention these words". It does not answer "this
 * person typed 'ยืมโปรเจคเตอร์' at 11pm and wants the request form, not a news
 * post about a projector". That gap is what this file closes: a small set of
 * hand-written rules that recognise a recurring need and put the thing that
 * resolves it at the top of the page, with the next step already named.
 *
 * Rules are deliberately few and deliberately obvious. A best bet that fires
 * on the wrong query is worse than none, because it looks like the site has
 * misunderstood the reader. Every rule here answers a question BIRSA is asked
 * repeatedly; anything more speculative belongs in page keywords instead,
 * where it can influence ranking without making a claim.
 */
import { courses } from "@/content/course-review/courses";
import { localeHref, type Locale } from "@/lib/i18n";
import { fold } from "@/lib/search/text";

export type BestBetLink = { label: string; href: string };

export type BestBet = {
  id: string;
  title: string;
  description: string;
  /** The one thing we think the reader came to do. */
  action: BestBetLink;
  /** The next most likely things, when the first guess is not it. */
  links: BestBetLink[];
  /** Shown as a short aside, for safety information only. */
  note?: string;
};

type Rule = {
  id: string;
  /** Trigger phrases in either language, matched after folding. */
  triggers: string[];
  /**
   * Tie-break weight when several rules match. Raise it only for rules whose
   * triggers are unambiguous ("ตั้งชมรม" can only mean one thing); leave broad
   * rules low so a specific one always wins.
   */
  weight: number;
  build: (locale: Locale) => BestBet;
};

function bi(locale: Locale, en: string, th: string): string {
  return locale === "en" ? en : th;
}

const rules: Rule[] = [
  {
    id: "borrow-equipment",
    weight: 1,
    triggers: [
      "borrow",
      "loan",
      "rent",
      "equipment",
      "projector",
      "speaker",
      "microphone",
      "mic",
      "camera",
      "tripod",
      "sound system",
      "ยืม",
      "ขอยืม",
      "ยืมของ",
      "เช่า",
      "อุปกรณ์",
      "โปรเจคเตอร์",
      "เครื่องฉาย",
      "ลำโพง",
      "ไมค์",
      "ไมโครโฟน",
      "กล้อง",
      "เครื่องเสียง",
    ],
    build: (locale) => ({
      id: "borrow-equipment",
      title: bi(locale, "Borrow equipment from BIRSA", "ยืมอุปกรณ์จาก BIRSA"),
      description: bi(
        locale,
        "Check what is available on your dates and send a request online. Most items are free to borrow for BIR students and clubs.",
        "ตรวจสอบว่าอุปกรณ์ว่างในวันที่ต้องการหรือไม่ แล้วยื่นคำขอออนไลน์ อุปกรณ์ส่วนใหญ่ให้นักศึกษาและชมรม BIR ยืมได้โดยไม่มีค่าใช้จ่าย"
      ),
      action: {
        label: bi(locale, "See what you can borrow", "ดูอุปกรณ์ที่ยืมได้"),
        href: localeHref(locale, "/services/equipment-loan"),
      },
      links: [
        {
          label: bi(locale, "Check a request you already sent", "ตรวจสอบคำขอที่ยื่นไปแล้ว"),
          href: localeHref(locale, "/services/equipment-loan/status"),
        },
        {
          label: bi(locale, "What each club owns", "อุปกรณ์ที่แต่ละชมรมมี"),
          href: localeHref(locale, "/services/equipment-loan/directory"),
        },
        {
          label: bi(locale, "Am I allowed to borrow this?", "ฉันยืมสิ่งนี้ได้หรือไม่"),
          href: localeHref(locale, "/answers/borrow-equipment"),
        },
      ],
    }),
  },
  {
    id: "loan-status",
    weight: 3,
    triggers: [
      "loan status",
      "my request",
      "reference number",
      "cancel loan",
      "cancel request",
      "cancel my",
      "สถานะคำขอ",
      "คำขอของฉัน",
      "หมายเลขอ้างอิง",
      "ยกเลิกคำขอ",
      "ยกเลิกการยืม",
      "อนุมัติหรือยัง",
    ],
    build: (locale) => ({
      id: "loan-status",
      title: bi(locale, "Check or cancel a loan request", "ตรวจสอบหรือยกเลิกคำขอยืม"),
      description: bi(
        locale,
        "Enter the reference number from your confirmation email to see where your request is, or cancel it.",
        "กรอกหมายเลขอ้างอิงจากอีเมลยืนยันเพื่อดูสถานะคำขอ หรือยกเลิกคำขอ"
      ),
      action: {
        label: bi(locale, "Check a request", "ตรวจสอบคำขอ"),
        href: localeHref(locale, "/services/equipment-loan/status"),
      },
      links: [
        {
          label: bi(locale, "Borrow something else", "ยืมอุปกรณ์อื่น"),
          href: localeHref(locale, "/services/equipment-loan"),
        },
      ],
    }),
  },
  {
    id: "study-plan",
    weight: 2,
    triggers: [
      "graduate",
      "graduation",
      "credits",
      "credit",
      "study plan",
      "curriculum",
      "prerequisite",
      "minor",
      "on track",
      "degree plan",
      "จบ",
      "จบการศึกษา",
      "เรียนจบ",
      "หน่วยกิต",
      "แผนการเรียน",
      "หลักสูตร",
      "วิชาบังคับก่อน",
      "วิชาโท",
      "จบทันไหม",
    ],
    build: (locale) => ({
      id: "study-plan",
      title: bi(locale, "Check your degree plan", "ตรวจแผนการศึกษาของท่าน"),
      description: bi(
        locale,
        "Enter what you have taken and what you plan to take. We check it against your curriculum: credits, prerequisites, the internship rule, and whether you are on track to graduate.",
        "กรอกวิชาที่เรียนแล้วและที่วางแผนจะเรียน ระบบจะตรวจกับหลักสูตรของท่าน ทั้งหน่วยกิต วิชาบังคับก่อน กฎการฝึกงาน และโอกาสจบตามกำหนด"
      ),
      action: {
        label: bi(locale, "Start planning", "เริ่มวางแผน"),
        href: localeHref(locale, "/services/study-plan"),
      },
      links: [
        {
          label: bi(locale, "How the degree is assessed", "การวัดผลและการสำเร็จการศึกษา"),
          href: localeHref(locale, "/student-life/handbook/assessment-and-degree"),
        },
        {
          label: bi(locale, "Which courses should I take?", "ควรลงวิชาใด"),
          href: localeHref(locale, "/answers/choose-courses"),
        },
      ],
    }),
  },
  {
    id: "course-reviews",
    weight: 2,
    triggers: [
      "course review",
      "review",
      "which course",
      "is it hard",
      "workload",
      "easy course",
      "รีวิว",
      "รีวิววิชา",
      "วิชาไหน",
      "ยากไหม",
      "ภาระงาน",
      "วิชาง่าย",
    ],
    build: (locale) => ({
      id: "course-reviews",
      title: bi(locale, "Course reviews", "รีวิวรายวิชา"),
      description: bi(
        locale,
        "What a course is actually like, from students who took it: workload, how it is assessed, and what they wish they had known.",
        "รายวิชาเป็นอย่างไรจริง ๆ จากนักศึกษาที่เคยเรียน ทั้งภาระงาน การวัดผล และสิ่งที่อยากรู้ก่อนลงเรียน"
      ),
      action: {
        label: bi(locale, "Browse course reviews", "ดูรีวิวรายวิชา"),
        href: localeHref(locale, "/student-life/course-reviews"),
      },
      links: [
        {
          label: bi(locale, "Which courses should I take?", "ควรลงวิชาใด"),
          href: localeHref(locale, "/answers/choose-courses"),
        },
      ],
    }),
  },
  {
    id: "contact",
    weight: 2,
    triggers: [
      "contact",
      "who do i ask",
      "who do i tell",
      "who can help",
      "email birsa",
      "phone number",
      "get in touch",
      "ติดต่อ",
      "ถามใคร",
      "บอกใคร",
      "ปรึกษาใคร",
      "อีเมล",
      "เบอร์โทร",
    ],
    build: (locale) => ({
      id: "contact",
      title: bi(locale, "Contact BIRSA", "ติดต่อ BIRSA"),
      description: bi(
        locale,
        "Send BIRSA a message, or find out which office handles your question before you write to anyone.",
        "ส่งข้อความถึง BIRSA หรือดูว่าหน่วยงานใดรับผิดชอบเรื่องของท่านก่อนติดต่อ"
      ),
      action: {
        label: bi(locale, "Contact BIRSA", "ติดต่อ BIRSA"),
        href: localeHref(locale, "/contact"),
      },
      links: [
        {
          label: bi(locale, "Who should I contact?", "ควรติดต่อใคร"),
          href: localeHref(locale, "/answers/who-to-contact"),
        },
        {
          label: bi(locale, "Who does what on the committee", "หน้าที่ของคณะกรรมการ"),
          href: localeHref(locale, "/activity/roles"),
        },
      ],
    }),
  },
  {
    id: "raise-a-problem",
    weight: 4,
    triggers: [
      "harassment",
      "harassed",
      "bullying",
      "bullied",
      "abuse",
      "assault",
      "complaint",
      "unfair",
      "discrimination",
      "report a problem",
      "misconduct",
      "คุกคาม",
      "ล่วงละเมิด",
      "กลั่นแกล้ง",
      "ถูกรังแก",
      "ร้องเรียน",
      "ไม่เป็นธรรม",
      "เลือกปฏิบัติ",
      "แจ้งเรื่อง",
    ],
    build: (locale) => ({
      id: "raise-a-problem",
      title: bi(locale, "Raise a problem or report harassment", "แจ้งปัญหาหรือรายงานการคุกคาม"),
      description: bi(
        locale,
        "You can report this to the BIR Programme Office or to BIRSA's Rights Advocate. You do not have to decide what happens next when you first speak to someone.",
        "ท่านสามารถแจ้งเรื่องต่อสำนักงานหลักสูตร BIR หรือฝ่ายสิทธินักศึกษาของ BIRSA ได้ และไม่จำเป็นต้องตัดสินใจถึงขั้นตอนถัดไปตั้งแต่การพูดคุยครั้งแรก"
      ),
      action: {
        label: bi(locale, "See who to tell and how", "ดูช่องทางการแจ้งเรื่อง"),
        href: localeHref(locale, "/answers/raise-a-problem"),
      },
      links: [
        {
          label: bi(locale, "Contact BIRSA directly", "ติดต่อ BIRSA โดยตรง"),
          href: localeHref(locale, "/contact"),
        },
        {
          label: bi(locale, "Your rights as a student", "สิทธิของนักศึกษา"),
          href: localeHref(locale, "/student-life/home/rights-and-welfare"),
        },
      ],
    }),
  },
  {
    id: "emergency",
    weight: 5,
    triggers: [
      "emergency",
      "fire",
      "earthquake",
      "flood",
      "flooding",
      "shooting",
      "evacuate",
      "evacuation",
      "coup",
      "protest",
      "danger",
      "ฉุกเฉิน",
      "ไฟไหม้",
      "แผ่นดินไหว",
      "น้ำท่วม",
      "กราดยิง",
      "อพยพ",
      "รัฐประหาร",
      "ม็อบ",
      "ชุมนุม",
      "อันตราย",
    ],
    build: (locale) => ({
      id: "emergency",
      title: bi(locale, "Emergency guidance", "คำแนะนำในสถานการณ์ฉุกเฉิน"),
      description: bi(
        locale,
        "What to do, who to call, and how BIRSA will tell you what is happening.",
        "สิ่งที่ต้องทำ ผู้ที่ต้องติดต่อ และวิธีที่ BIRSA จะแจ้งสถานการณ์ให้ท่านทราบ"
      ),
      action: {
        label: bi(locale, "Open emergency guidance", "เปิดคำแนะนำฉุกเฉิน"),
        href: localeHref(locale, "/emergency"),
      },
      links: [
        {
          label: bi(locale, "Safety and emergencies guide", "คู่มือความปลอดภัยและเหตุฉุกเฉิน"),
          href: localeHref(locale, "/student-life/home/safety-and-emergencies"),
        },
      ],
      note: bi(
        locale,
        "If someone is in immediate danger, call 191 for the police or 1669 for an ambulance before reading anything here.",
        "หากมีผู้ตกอยู่ในอันตรายเฉพาะหน้า โทร 191 แจ้งตำรวจ หรือ 1669 เรียกรถพยาบาลก่อนอ่านข้อมูลในหน้านี้"
      ),
    }),
  },
  {
    id: "new-student",
    weight: 2,
    triggers: [
      "new student",
      "freshman",
      "fresher",
      "first year",
      "orientation",
      "getting started",
      "just arrived",
      "นักศึกษาใหม่",
      "เฟรชชี่",
      "ปี 1",
      "ปฐมนิเทศ",
      "เริ่มต้น",
      "เพิ่งเข้า",
      "รายงานตัว",
    ],
    build: (locale) => ({
      id: "new-student",
      title: bi(locale, "Starting at BIR", "เริ่มต้นที่ BIR"),
      description: bi(
        locale,
        "A checklist of what to do before you arrive and in your first weeks, in the order it needs doing.",
        "รายการสิ่งที่ต้องทำก่อนมาถึงและในสัปดาห์แรก เรียงตามลำดับที่ควรทำ"
      ),
      action: {
        label: bi(locale, "Open the checklist", "เปิดเช็คลิสต์"),
        href: localeHref(locale, "/student-life/getting-started"),
      },
      links: [
        {
          label: bi(locale, "Settling in", "การปรับตัว"),
          href: localeHref(locale, "/answers/settle-in"),
        },
        {
          label: bi(locale, "For international students", "สำหรับนักศึกษาต่างชาติ"),
          href: localeHref(locale, "/student-life/international"),
        },
      ],
    }),
  },
  {
    id: "clubs",
    weight: 2,
    triggers: ["join a club", "clubs", "club", "society", "ชมรม", "เข้าชมรม", "สมัครชมรม"],
    build: (locale) => ({
      id: "clubs",
      title: bi(locale, "Find a club to join", "หาชมรมที่อยากเข้าร่วม"),
      description: bi(
        locale,
        "Every BIR club, what it does, whether it is taking members right now, and how to get in touch.",
        "ชมรมทั้งหมดของ BIR ทำอะไรบ้าง กำลังเปิดรับสมาชิกหรือไม่ และติดต่ออย่างไร"
      ),
      action: {
        label: bi(locale, "Browse clubs", "ดูชมรมทั้งหมด"),
        href: localeHref(locale, "/clubs"),
      },
      links: [
        {
          label: bi(locale, "Start a new club", "เริ่มชมรมใหม่"),
          href: localeHref(locale, "/clubs/start"),
        },
        {
          label: bi(locale, "Get involved", "เข้าร่วมกิจกรรม"),
          href: localeHref(locale, "/student-life/home/getting-involved"),
        },
      ],
    }),
  },
  {
    id: "start-club",
    weight: 4,
    triggers: [
      "start a club",
      "new club",
      "create a club",
      "found a club",
      "ตั้งชมรม",
      "เปิดชมรม",
      "ชมรมใหม่",
      "ขอตั้งชมรม",
    ],
    build: (locale) => ({
      id: "start-club",
      title: bi(locale, "Start a club", "เริ่มชมรมใหม่"),
      description: bi(
        locale,
        "Check whether your idea can become a club, then send the proposal to BIRSA.",
        "ตรวจสอบว่าแนวคิดของท่านตั้งเป็นชมรมได้หรือไม่ แล้วส่งข้อเสนอมาที่ BIRSA"
      ),
      action: {
        label: bi(locale, "Start the check", "เริ่มตรวจสอบ"),
        href: localeHref(locale, "/answers/start-a-club-check"),
      },
      links: [
        {
          label: bi(locale, "Send a club proposal", "ส่งข้อเสนอตั้งชมรม"),
          href: localeHref(locale, "/clubs/start"),
        },
      ],
    }),
  },
  {
    id: "military",
    weight: 4,
    triggers: [
      "military",
      "conscription",
      "postponement",
      "ทหาร",
      "เกณฑ์ทหาร",
      "ผ่อนผันทหาร",
      "ผ่อนผัน",
      "รด",
    ],
    build: (locale) => ({
      id: "military",
      title: bi(locale, "Military service postponement", "การผ่อนผันการเกณฑ์ทหาร"),
      description: bi(
        locale,
        "Students can apply to postpone conscription while studying. The university handles this, and the deadline is early in the academic year.",
        "นักศึกษาสามารถยื่นขอผ่อนผันการเกณฑ์ทหารระหว่างศึกษาได้ มหาวิทยาลัยเป็นผู้ดำเนินการ และกำหนดยื่นอยู่ในช่วงต้นปีการศึกษา"
      ),
      action: {
        label: bi(locale, "University services", "บริการจากมหาวิทยาลัย"),
        href: localeHref(locale, "/services/university-services"),
      },
      links: [
        {
          label: bi(locale, "Who should I contact?", "ควรติดต่อใคร"),
          href: localeHref(locale, "/answers/who-to-contact"),
        },
      ],
    }),
  },
  {
    id: "documents",
    weight: 3,
    triggers: [
      "transcript",
      "certificate",
      "student certificate",
      "proof of enrolment",
      "ใบเกรด",
      "ทรานสคริปต์",
      "ใบรับรอง",
      "ใบแสดงผลการศึกษา",
      "หนังสือรับรอง",
    ],
    build: (locale) => ({
      id: "documents",
      title: bi(locale, "Transcripts and certificates", "ใบแสดงผลการศึกษาและใบรับรอง"),
      description: bi(
        locale,
        "These come from the university registrar, not from BIRSA. Here is where to request them and what each document is called.",
        "เอกสารเหล่านี้ออกโดยสำนักทะเบียนของมหาวิทยาลัย ไม่ใช่ BIRSA ดูวิธีขอและชื่อเรียกของแต่ละเอกสารได้ที่นี่"
      ),
      action: {
        label: bi(locale, "University services", "บริการจากมหาวิทยาลัย"),
        href: localeHref(locale, "/services/university-services"),
      },
      links: [
        {
          label: bi(locale, "Quick links to university systems", "ทางลัดไปยังระบบของมหาวิทยาลัย"),
          href: localeHref(locale, "/quick"),
        },
      ],
    }),
  },
  {
    id: "visa",
    weight: 4,
    triggers: [
      "visa",
      "immigration",
      "90 day",
      "re-entry",
      "work permit",
      "วีซ่า",
      "ตรวจคนเข้าเมือง",
      "ตม",
      "รายงานตัว 90 วัน",
    ],
    build: (locale) => ({
      id: "visa",
      title: bi(locale, "Visas and immigration", "วีซ่าและการตรวจคนเข้าเมือง"),
      description: bi(
        locale,
        "Student visas, 90-day reporting, re-entry permits and what to do before your visa expires.",
        "วีซ่านักศึกษา การรายงานตัว 90 วัน ใบอนุญาตกลับเข้าประเทศ และสิ่งที่ต้องทำก่อนวีซ่าหมดอายุ"
      ),
      action: {
        label: bi(locale, "Visa and immigration guide", "คู่มือวีซ่าและตรวจคนเข้าเมือง"),
        href: localeHref(locale, "/student-life/international/visa-and-immigration"),
      },
      links: [
        {
          label: bi(locale, "Arriving and your first week", "การมาถึงและสัปดาห์แรก"),
          href: localeHref(locale, "/student-life/international/arrival-and-first-week"),
        },
      ],
    }),
  },
  {
    id: "money",
    weight: 2,
    triggers: [
      "tuition",
      "fees",
      "scholarship",
      "financial aid",
      "cost of living",
      "budget",
      "ค่าเทอม",
      "ค่าธรรมเนียม",
      "ทุน",
      "ทุนการศึกษา",
      "ค่าครองชีพ",
      "ไม่มีเงิน",
    ],
    build: (locale) => ({
      id: "money",
      title: bi(locale, "Fees, scholarships and money", "ค่าเทอม ทุนการศึกษา และการเงิน"),
      description: bi(
        locale,
        "What you have to pay and when, what help exists if you cannot, and what things actually cost here.",
        "ต้องจ่ายอะไรเมื่อใด มีความช่วยเหลืออะไรหากจ่ายไม่ไหว และค่าใช้จ่ายจริงเป็นเท่าใด"
      ),
      action: {
        label: bi(locale, "Money and fees", "เรื่องเงินและค่าธรรมเนียม"),
        href: localeHref(locale, "/answers/money-and-fees"),
      },
      links: [
        {
          label: bi(locale, "Money matters guide", "คู่มือเรื่องเงิน"),
          href: localeHref(locale, "/student-life/home/money-matters"),
        },
        {
          label: bi(locale, "Admission and fees", "การรับเข้าและค่าธรรมเนียม"),
          href: localeHref(locale, "/student-life/handbook/admission-and-fees"),
        },
      ],
    }),
  },
  {
    id: "health",
    weight: 3,
    triggers: [
      "mental health",
      "counselling",
      "counseling",
      "depressed",
      "anxiety",
      "stressed",
      "sick",
      "clinic",
      "hospital",
      "สุขภาพจิต",
      "เครียด",
      "ซึมเศร้า",
      "ป่วย",
      "หมอ",
      "โรงพยาบาล",
      "ปรึกษา",
    ],
    build: (locale) => ({
      id: "health",
      title: bi(locale, "Health and wellbeing", "สุขภาพและความเป็นอยู่"),
      description: bi(
        locale,
        "Where to get medical care, what the university's counselling service covers, and what to do if you are struggling.",
        "ไปรักษาที่ไหน บริการให้คำปรึกษาของมหาวิทยาลัยครอบคลุมอะไร และควรทำอย่างไรหากกำลังลำบากใจ"
      ),
      action: {
        label: bi(locale, "Health and wellbeing guide", "คู่มือสุขภาพและความเป็นอยู่"),
        href: localeHref(locale, "/student-life/home/health-and-wellbeing"),
      },
      links: [
        {
          label: bi(locale, "Health and safety answers", "คำตอบเรื่องสุขภาพและความปลอดภัย"),
          href: localeHref(locale, "/answers/health-and-safety"),
        },
      ],
    }),
  },
  {
    id: "getting-around",
    weight: 2,
    triggers: [
      "shuttle",
      "shuttle bus",
      "how to get to",
      "transport",
      "boat",
      "ferry",
      "รถรับส่ง",
      "รถเมล์",
      "เรือ",
      "เดินทาง",
      "ไปยังไง",
      "รถตู้",
    ],
    build: (locale) => ({
      id: "getting-around",
      title: bi(locale, "Getting around", "การเดินทาง"),
      description: bi(
        locale,
        "Shuttle buses between campuses, boats and buses to Tha Prachan, and how long each actually takes.",
        "รถรับส่งระหว่างศูนย์ เรือและรถไปท่าพระจันทร์ และเวลาที่ใช้จริงในแต่ละเส้นทาง"
      ),
      action: {
        label: bi(locale, "Shuttle bus times", "ตารางรถรับส่ง"),
        href: localeHref(locale, "/student-life/home/shuttle-bus"),
      },
      links: [
        {
          label: bi(locale, "Getting around guide", "คู่มือการเดินทาง"),
          href: localeHref(locale, "/student-life/home/getting-around"),
        },
        {
          label: bi(locale, "Getting around answers", "คำตอบเรื่องการเดินทาง"),
          href: localeHref(locale, "/answers/getting-around"),
        },
      ],
    }),
  },
  {
    id: "food-and-places",
    weight: 2,
    triggers: [
      "food",
      "eat",
      "restaurant",
      "canteen",
      "cafeteria",
      "coffee",
      "where to eat",
      "อาหาร",
      "กิน",
      "ร้านอาหาร",
      "โรงอาหาร",
      "ของกิน",
      "กินอะไรดี",
      "ร้านกาแฟ",
    ],
    build: (locale) => ({
      id: "food-and-places",
      title: bi(locale, "Places to eat nearby", "ร้านอาหารใกล้มหาวิทยาลัย"),
      description: bi(
        locale,
        "Where students actually eat around Tha Prachan and Pinklao, with a map and rough prices.",
        "ร้านที่นักศึกษากินจริงแถวท่าพระจันทร์และปิ่นเกล้า พร้อมแผนที่และราคาโดยประมาณ"
      ),
      action: {
        label: bi(locale, "Places nearby", "สถานที่ใกล้เคียง"),
        href: localeHref(locale, "/student-life/home/places-nearby"),
      },
      links: [
        {
          label: bi(locale, "Food and budgeting", "อาหารและการวางแผนค่าใช้จ่าย"),
          href: localeHref(locale, "/student-life/home/food-and-budgeting"),
        },
      ],
    }),
  },
  {
    id: "housing",
    weight: 3,
    triggers: [
      "dorm",
      "dormitory",
      "housing",
      "accommodation",
      "apartment",
      "condo",
      "where to live",
      "หอ",
      "หอพัก",
      "ที่พัก",
      "อพาร์ทเมนท์",
      "คอนโด",
      "ห้องเช่า",
      "อยู่ที่ไหน",
    ],
    build: (locale) => ({
      id: "housing",
      title: bi(locale, "Somewhere to live", "ที่พักอาศัย"),
      description: bi(
        locale,
        "Dormitories and private apartments near campus, with what students pay and how far each is.",
        "หอพักและอพาร์ตเมนต์ใกล้มหาวิทยาลัย พร้อมค่าเช่าที่นักศึกษาจ่ายจริงและระยะทาง"
      ),
      action: {
        label: bi(locale, "Places nearby", "สถานที่ใกล้เคียง"),
        href: localeHref(locale, "/student-life/home/places-nearby"),
      },
      links: [
        {
          label: bi(locale, "Settling in", "การปรับตัว"),
          href: localeHref(locale, "/answers/settle-in"),
        },
      ],
    }),
  },
  {
    id: "internet",
    weight: 3,
    triggers: [
      "wifi",
      "wi-fi",
      "internet",
      "eduroam",
      "sim card",
      "phone plan",
      "ไวไฟ",
      "เน็ต",
      "อินเทอร์เน็ต",
      "ซิม",
      "ซิมการ์ด",
    ],
    build: (locale) => ({
      id: "internet",
      title: bi(locale, "Phones and internet", "โทรศัพท์และอินเทอร์เน็ต"),
      description: bi(
        locale,
        "Campus wifi, which SIM to buy, and how to get online in your first week.",
        "ไวไฟในมหาวิทยาลัย ควรซื้อซิมใด และวิธีเชื่อมต่ออินเทอร์เน็ตในสัปดาห์แรก"
      ),
      action: {
        label: bi(locale, "Phones and internet guide", "คู่มือโทรศัพท์และอินเทอร์เน็ต"),
        href: localeHref(locale, "/student-life/international/phones-and-internet"),
      },
      links: [],
    }),
  },
  {
    id: "internship",
    weight: 4,
    triggers: ["internship", "intern", "work placement", "ฝึกงาน", "สหกิจ"],
    build: (locale) => ({
      id: "internship",
      title: bi(locale, "Internship rules", "กฎเกณฑ์การฝึกงาน"),
      description: bi(
        locale,
        "When you can do an internship, what counts, and how it fits into your study plan.",
        "ฝึกงานได้เมื่อใด อะไรนับเป็นการฝึกงาน และจัดวางในแผนการเรียนอย่างไร"
      ),
      action: {
        label: bi(locale, "Check the internship rules", "ตรวจสอบกฎการฝึกงาน"),
        href: localeHref(locale, "/answers/internship-check"),
      },
      links: [
        {
          label: bi(locale, "Internship handbook chapter", "บทว่าด้วยการฝึกงาน"),
          href: localeHref(locale, "/student-life/handbook/internship"),
        },
      ],
    }),
  },
  {
    id: "regulations",
    weight: 2,
    triggers: [
      "regulation",
      "regulations",
      "rules",
      "discipline",
      "punishment",
      "dress code",
      "uniform",
      "allowed",
      "ระเบียบ",
      "ข้อบังคับ",
      "วินัย",
      "บทลงโทษ",
      "แต่งกาย",
      "ชุดนักศึกษา",
      "ทำได้ไหม",
      "ผิดกฎ",
    ],
    build: (locale) => ({
      id: "regulations",
      title: bi(locale, "Student regulations", "ระเบียบนักศึกษา"),
      description: bi(
        locale,
        "The full text of the university and faculty regulations, searchable by provision, plus what they mean in practice.",
        "ระเบียบของมหาวิทยาลัยและคณะฉบับเต็ม ค้นหาได้รายข้อ พร้อมความหมายในทางปฏิบัติ"
      ),
      action: {
        label: bi(locale, "Read the regulations", "อ่านระเบียบ"),
        href: localeHref(locale, "/activity/regulations"),
      },
      links: [
        {
          label: bi(locale, "Academic rules", "กฎเกณฑ์ทางวิชาการ"),
          href: localeHref(locale, "/answers/academic-rules"),
        },
        {
          label: bi(locale, "Getting an activity approved", "การขออนุมัติกิจกรรม"),
          href: localeHref(locale, "/answers/activity-approval"),
        },
      ],
    }),
  },
  {
    id: "calendar",
    weight: 2,
    triggers: [
      "calendar",
      "academic calendar",
      "semester dates",
      "term dates",
      "holiday",
      "exam dates",
      "when does",
      "ปฏิทิน",
      "ปฏิทินการศึกษา",
      "เปิดเทอม",
      "ปิดเทอม",
      "วันหยุด",
      "ตารางสอบ",
      "เมื่อไหร่",
    ],
    build: (locale) => ({
      id: "calendar",
      title: bi(locale, "Dates and what's on", "วันสำคัญและกิจกรรม"),
      description: bi(
        locale,
        "Registration, exams, holidays and BIRSA events. You can also subscribe to the calendar so the dates appear in your own app.",
        "การลงทะเบียน สอบ วันหยุด และกิจกรรมของ BIRSA ท่านสามารถกดติดตามปฏิทินเพื่อให้วันสำคัญไปแสดงในแอปของท่านได้"
      ),
      action: {
        label: bi(locale, "See what's on", "ดูข่าวและกิจกรรม"),
        href: localeHref(locale, "/news"),
      },
      links: [
        {
          label: bi(locale, "Subscribe to the calendar", "ติดตามปฏิทิน"),
          href: localeHref(locale, "/calendar.ics"),
        },
      ],
    }),
  },
];

/** Course codes look like "PI280" or "pi 280"; students type both. */
const COURSE_CODE = /\b([a-z]{2,3})\s?(\d{3})\b/;

/**
 * A query that is (or contains) a real course code is unambiguous: send the
 * reader straight to that course rather than to the browse page.
 */
function courseCodeBet(locale: Locale, foldedQuery: string): BestBet | undefined {
  const match = COURSE_CODE.exec(foldedQuery);
  if (!match) return undefined;
  const code = `${match[1] ?? ""}${match[2] ?? ""}`.toUpperCase();
  const course = courses.find((candidate) => candidate.code.toUpperCase() === code);
  if (!course) return undefined;

  return {
    id: `course:${course.code}`,
    title: `${course.code}: ${course.title[locale]}`,
    description: course.description[locale],
    action: {
      label: bi(locale, "Open this course", "เปิดรายวิชานี้"),
      href: localeHref(locale, `/student-life/course-reviews/${course.code}`),
    },
    links: [
      {
        label: bi(locale, "All course reviews", "รีวิวรายวิชาทั้งหมด"),
        href: localeHref(locale, "/student-life/course-reviews"),
      },
    ],
  };
}

const LATIN = /^[a-z0-9\s'-]+$/;

/**
 * Whether a folded query contains a trigger. Latin triggers must fall on word
 * boundaries, so "art" does not fire on "start a club"; Thai triggers match as
 * substrings, because Thai is written without them.
 */
function hasTrigger(foldedQuery: string, trigger: string): boolean {
  if (!LATIN.test(trigger)) return foldedQuery.includes(trigger);
  const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(s)?($|\\s)`).test(foldedQuery);
}

/**
 * Pick the single best bet for a query, or nothing when no rule clearly fits.
 * Specificity wins: the longest matching trigger, then the rule's own weight,
 * so "start a club" beats the broader "club" rule.
 */
export function matchIntent(locale: Locale, query: string): BestBet | undefined {
  const folded = fold(query);
  if (folded.length < 2) return undefined;

  const direct = courseCodeBet(locale, folded);
  if (direct) return direct;

  let best: { rule: Rule; length: number } | undefined;
  for (const rule of rules) {
    let longest = 0;
    for (const trigger of rule.triggers) {
      const folded_trigger = fold(trigger);
      if (folded_trigger && hasTrigger(folded, folded_trigger)) {
        longest = Math.max(longest, folded_trigger.length);
      }
    }
    if (longest === 0) continue;
    if (
      !best ||
      longest * rule.weight > best.length * best.rule.weight ||
      (longest * rule.weight === best.length * best.rule.weight && rule.weight > best.rule.weight)
    ) {
      best = { rule, length: longest };
    }
  }

  return best?.rule.build(locale);
}

/** Exposed for tests and for the "popular searches" list on the empty state. */
export const intentIds = rules.map((rule) => rule.id);
