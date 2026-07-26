/**
 * Smart answer: "Find the right person to contact". A short triage: safety
 * first, then equipment loans (BIRSA's own and TUSU Tha Prachan's), clubs,
 * raising a problem or complaint (routed by subject the way
 * `content/student-life/en/home/rights-and-welfare.mdx` does: registration
 * to the Registrar, programme matters to the faculty student committee,
 * general matters to TUSU Tha Prachan), the ladder of elected student
 * bodies (see `content/activity/en/student-bodies.mdx`), news, and a
 * general contact fallback. BIRSA is a student association, not a
 * university office (see `content/site.ts` `officialLinks`), so several
 * outcomes hand off to the real office or elected body responsible instead.
 */
import type { SmartAnswerFlow } from "./types";

export const whoToContact: SmartAnswerFlow = {
  slug: "who-to-contact",
  title: {
    en: "Find the right person to contact",
    th: "หาคนที่ใช่สำหรับติดต่อ",
  },
  lede: {
    en: "A couple of quick questions to point you to the right place, from an emergency to a club question.",
    th: "ตอบคำถามสั้น ๆ เพื่อหาช่องทางที่ใช่ ไม่ว่าจะเป็นเหตุฉุกเฉินหรือคำถามเรื่องชมรม",
  },
  whatYoullNeed: [
    { en: "A rough idea of what your question is about", th: "เรื่องคร่าว ๆ ที่อยากสอบถาม" },
  ],
  start: "q-topic",
  nodes: [
    {
      kind: "question",
      id: "q-topic",
      question: {
        en: "What do you need help with?",
        th: "คุณต้องการความช่วยเหลือเรื่องอะไร",
      },
      options: [
        {
          id: "safety",
          label: {
            en: "A safety emergency happening right now",
            th: "เหตุฉุกเฉินด้านความปลอดภัยที่กำลังเกิดขึ้น",
          },
          next: "out-safety",
        },
        {
          id: "equipment",
          label: { en: "Borrowing equipment", th: "ยืมอุปกรณ์" },
          next: "out-equipment",
        },
        {
          id: "clubs",
          label: {
            en: "Clubs: joining or starting one",
            th: "เรื่องชมรม (เข้าร่วมหรือเริ่มใหม่)",
          },
          next: "q-club-detail",
        },
        {
          id: "complaint",
          label: {
            en: "Raising a problem, complaint, or a records or programme question",
            th: "แจ้งปัญหา ร้องเรียน หรือสอบถามเรื่องทะเบียน/หลักสูตร",
          },
          next: "q-complaint-subject",
        },
        {
          id: "representation",
          label: {
            en: "Who represents me, or how to run for a student body",
            th: "ใครเป็นตัวแทนนักศึกษา หรือวิธีลงสมัครองค์กรนักศึกษา",
          },
          next: "out-representation",
        },
        {
          id: "events",
          label: { en: "What's on / upcoming events", th: "กิจกรรมที่กำลังจะจัดขึ้น" },
          next: "out-events",
        },
        {
          id: "other",
          label: {
            en: "Something else, or general feedback",
            th: "เรื่องอื่น ๆ หรือข้อเสนอแนะทั่วไป",
          },
          next: "out-other",
        },
      ],
    },
    {
      kind: "question",
      id: "q-club-detail",
      question: {
        en: "Do you want to join an existing club, or start a new one?",
        th: "คุณต้องการเข้าร่วมชมรมที่มีอยู่แล้ว หรือเริ่มชมรมใหม่",
      },
      options: [
        {
          id: "join",
          label: { en: "Join an existing club", th: "เข้าร่วมชมรมที่มีอยู่" },
          next: "out-clubs-join",
        },
        {
          id: "start",
          label: { en: "Start a new club", th: "เริ่มชมรมใหม่" },
          next: "out-clubs-start",
        },
      ],
    },
    {
      kind: "question",
      id: "q-complaint-subject",
      question: {
        en: "What's it about?",
        th: "เรื่องที่ต้องการติดต่อเกี่ยวกับอะไร",
      },
      hint: {
        en: "The right office depends on the subject, not just that something is wrong.",
        th: "หน่วยงานที่ดูแลขึ้นอยู่กับประเภทของเรื่อง ไม่ใช่แค่ว่ามีปัญหาเกิดขึ้น",
      },
      options: [
        {
          id: "registration",
          label: {
            en: "Registration, enrolment, or official transcripts",
            th: "การลงทะเบียน การขึ้นทะเบียน หรือใบแสดงผลการเรียน",
          },
          next: "out-complaint-registration",
        },
        {
          id: "programme",
          label: {
            en: "Course content, fees, or other programme matters",
            th: "เนื้อหารายวิชา ค่าใช้จ่าย หรือเรื่องอื่นของหลักสูตร",
          },
          next: "out-complaint-programme",
        },
        {
          id: "general",
          label: {
            en: "General or university-wide matters",
            th: "เรื่องทั่วไปหรือเรื่องระดับมหาวิทยาลัย",
          },
          next: "out-complaint-general",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-safety",
      title: { en: "Contact emergency services now", th: "ติดต่อหน่วยฉุกเฉินทันที" },
      summary: {
        en: "For anything genuinely urgent, do not wait for BIRSA: call the emergency services directly, then let BIRSA know.",
        th: "หากเป็นเหตุฉุกเฉินจริง อย่ารอติดต่อ BIRSA ให้โทรหาหน่วยฉุกเฉินโดยตรงก่อน แล้วค่อยแจ้ง BIRSA ทีหลัง",
      },
      body: [
        {
          en: "Police 191, medical emergencies 1669, fire 199.",
          th: "ตำรวจ 191 การแพทย์ฉุกเฉิน 1669 ดับเพลิง 199",
        },
        {
          en: "If BIRSA's site currently shows an active emergency, the emergency page takes you straight to guidance for that specific situation, not just general advice.",
          th: "ถ้าเว็บไซต์ BIRSA แสดงสถานการณ์ฉุกเฉินที่กำลังเกิดขึ้นอยู่ หน้าฉุกเฉินจะพาไปยังคำแนะนำเฉพาะสถานการณ์นั้นโดยตรง ไม่ใช่แค่คำแนะนำทั่วไป",
        },
      ],
      actions: [
        {
          label: { en: "BIRSA emergency guidance", th: "คำแนะนำฉุกเฉินของ BIRSA" },
          href: "/emergency",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-equipment",
      title: { en: "Equipment loans", th: "บริการยืมอุปกรณ์" },
      summary: {
        en: "BIRSA lends out equipment like cameras and speakers for free.",
        th: "BIRSA มีอุปกรณ์ให้ยืมฟรี เช่น กล้องและลำโพง",
      },
      body: [
        {
          en: "For sports equipment, borrow from your own faculty, or from the TUSU Tha Prachan room on floor 2 of the student activity building. Bring your student card.",
          th: "สำหรับอุปกรณ์กีฬา ยืมได้ที่คณะของตัวเอง หรือที่ห้อง อมธ. ท่าพระจันทร์ ชั้น 2 อาคารกิจกรรมนักศึกษา อย่าลืมนำบัตรนักศึกษาไปด้วย",
        },
      ],
      actions: [
        {
          label: { en: "Go to equipment loans", th: "ไปหน้าบริการยืมอุปกรณ์" },
          href: "/information-services/equipment-loan",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-clubs-join",
      title: { en: "Find a club to join", th: "หาชมรมที่อยากเข้าร่วม" },
      summary: {
        en: "Browse existing clubs and see how to join.",
        th: "ดูรายชื่อชมรมที่มีอยู่และวิธีเข้าร่วม",
      },
      actions: [{ label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" }, href: "/clubs" }],
    },
    {
      kind: "outcome",
      id: "out-clubs-start",
      title: { en: "Start a new club", th: "เริ่มชมรมใหม่" },
      summary: {
        en: "If your interest is not covered by an existing club, BIRSA can help you start one.",
        th: "ถ้ายังไม่มีชมรมที่ตรงกับความสนใจของคุณ BIRSA ช่วยให้เกิดขึ้นจริงได้",
      },
      actions: [
        {
          label: { en: "Check if you're ready to start a club", th: "เช็กความพร้อมก่อนเริ่มชมรม" },
          href: "/answers/start-a-club-check",
        },
        { label: { en: "Start a club", th: "เริ่มชมรมใหม่" }, href: "/clubs/start" },
      ],
    },
    {
      kind: "outcome",
      id: "out-complaint-registration",
      title: {
        en: "Contact your faculty and the Registrar's office",
        th: "ติดต่อคณะและสำนักงานทะเบียน",
      },
      summary: {
        en: "Registration matters go to your faculty and the Registrar's office.",
        th: "เรื่องการลงทะเบียนติดต่อคณะและสำนักงานทะเบียนนักศึกษา",
      },
      actions: [
        {
          label: { en: "TU Registrar", th: "สำนักทะเบียน มธ." },
          href: "https://www.reg.tu.ac.th",
          external: true,
        },
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-complaint-programme",
      title: {
        en: "Contact your faculty student committee first",
        th: "ติดต่อกรรมการนักศึกษาประจำคณะก่อน",
      },
      summary: {
        en: "Anything about course content, fees, or your own programme goes to your faculty student committee first, because the rules differ between faculties. For the BIR programme, that's BIRSA.",
        th: "เรื่องเนื้อหารายวิชา ค่าใช้จ่าย หรือเรื่องเฉพาะของหลักสูตร ให้ติดต่อกรรมการนักศึกษาประจำคณะของตัวเองก่อน เพราะแต่ละคณะมีเงื่อนไขต่างกัน สำหรับหลักสูตร BIR กรรมการนักศึกษาคือ BIRSA เอง",
      },
      body: [
        {
          en: "BIRSA is BIR's own elected faculty student committee (สโมสรนักศึกษาสาขาการเมืองการระหว่างประเทศ), so contact BIRSA directly for BIR programme matters.",
          th: "BIRSA คือคณะกรรมการนักศึกษาประจำสาขา BIR ที่มาจากการเลือกตั้ง (สโมสรนักศึกษาสาขาการเมืองการระหว่างประเทศ) ให้ติดต่อ BIRSA โดยตรงสำหรับเรื่องของหลักสูตร BIR",
        },
      ],
      actions: [
        { label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" },
        {
          label: { en: "BIR Programme site", th: "เว็บไซต์หลักสูตร BIR" },
          href: "https://www.birpolsci.com",
          external: true,
        },
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-complaint-general",
      title: { en: "Contact TUSU Tha Prachan", th: "ติดต่อ อมธ. ท่าพระจันทร์" },
      summary: {
        en: "General matters can go to TUSU Tha Prachan (อมธ. ท่าพระจันทร์), the directly elected student union representing all Tha Prachan students.",
        th: "เรื่องทั่วไปสามารถติดต่อ อมธ. ท่าพระจันทร์ ซึ่งเป็นองค์การนักศึกษาที่มาจากการเลือกตั้งโดยตรงและเป็นตัวแทนของนักศึกษาทั้งหมดที่ท่าพระจันทร์",
      },
      body: [
        {
          en: "Email tusu.thaprachan@tu.ac.th, or reach TUSU Tha Prachan on Instagram @tusu.tpc, X @tusu_tpc, or TikTok @tusu.tpc.",
          th: "อีเมล tusu.thaprachan@tu.ac.th หรือติดต่อผ่าน Instagram @tusu.tpc, X @tusu_tpc หรือ TikTok @tusu.tpc",
        },
      ],
      actions: [
        {
          label: { en: "Email TUSU Tha Prachan", th: "ส่งอีเมลถึง อมธ. ท่าพระจันทร์" },
          href: "mailto:tusu.thaprachan@tu.ac.th",
          external: true,
        },
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-representation",
      title: {
        en: "The ladder of elected student bodies",
        th: "บันไดองค์กรนักศึกษาแบบเลือกตั้ง",
      },
      summary: {
        en: "BIR students are represented at four levels: your programme, your faculty, your campus, and the university as a whole.",
        th: "นักศึกษา BIR มีตัวแทนถึง 4 ระดับ ได้แก่ ระดับหลักสูตร ระดับคณะ ระดับวิทยาเขต และระดับมหาวิทยาลัย",
      },
      body: [
        {
          en: "BIR (programme level): BIRSA and BIR class councils.",
          th: "BIR (ระดับหลักสูตร): BIRSA และสภานักศึกษาประจำชั้นปีของ BIR",
        },
        {
          en: "Faculty of Political Science (Singhadang): the Political Science Students' Committee and class councils.",
          th: "คณะรัฐศาสตร์ (สิงห์แดง): คณะกรรมการนักศึกษาคณะรัฐศาสตร์ และสภานักศึกษาประจำชั้นปี",
        },
        {
          en: "Tha Prachan Campus (TPC): TUSU TPC and TUSC TPC, the campus branches of the university student union and council.",
          th: "ศูนย์ท่าพระจันทร์ (TPC): TUSU TPC และ TUSC TPC ซึ่งเป็นสาขาระดับวิทยาเขตของสภานักศึกษาและองค์การนักศึกษามหาวิทยาลัย",
        },
        {
          en: "Thammasat University (all campuses): TUSU, TUSC, and ECTU.",
          th: "มหาวิทยาลัยธรรมศาสตร์ (ทุกศูนย์): TUSU, TUSC และ ECTU",
        },
      ],
      actions: [
        {
          label: { en: "Student bodies you can run for", th: "องค์กรนักศึกษาที่คุณลงสมัครได้" },
          href: "/activity/student-bodies",
        },
        {
          label: { en: "Getting involved", th: "มาร่วมกิจกรรม" },
          href: "/student-life/home/getting-involved",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-events",
      title: { en: "See what's on", th: "ดูกิจกรรมที่จะจัดขึ้น" },
      summary: {
        en: "News and event listings are all in one place.",
        th: "ข่าวสารและกิจกรรมทั้งหมดรวมอยู่ที่หน้าเดียว",
      },
      actions: [{ label: { en: "Go to news", th: "ไปหน้าข่าวสาร" }, href: "/news" }],
    },
    {
      kind: "outcome",
      id: "out-other",
      title: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" },
      summary: {
        en: "For anything else (welfare concerns, feedback, or a question you're not sure who handles), the contact form reaches BIRSA directly.",
        th: "สำหรับเรื่องอื่น ๆ เช่น ความกังวลใจ ข้อเสนอแนะ หรือคำถามที่ไม่แน่ใจว่าใครดูแล ใช้แบบฟอร์มติดต่อเพื่อส่งถึง BIRSA โดยตรง",
      },
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
    },
  ],
};
