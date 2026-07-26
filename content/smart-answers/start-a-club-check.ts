/**
 * Smart answer: "Check if you're ready to start a club".
 *
 * Grounded in BIRSA's actual on-ramp (`/clubs/start`: an informal "tell us
 * your idea" form, no minimum numbers) and, once the flow asks about scope,
 * three genuinely different tracks:
 *  - a BIR-programme club: BIRSA is the on-ramp and the faculty student
 *    committee, no formal minimums (Faculty Notice B.E. 2565, ข้อ 24);
 *  - a Faculty activity group, open to the whole Faculty of Political
 *    Science: a 30-signature petition to the Dean, a 20-member minimum, and
 *    a 5-to-10-member committee (Faculty Notice B.E. 2565, ข้อ 41, 43, 44);
 *  - a University-wide student activity club (ชุมนุม), open to students from
 *    any Faculty: a 50-signature petition to the TUSU Executive Committee,
 *    approved by the TUSU Executive Committee then the TUSC, reported to the
 *    Rector, with a 5-club-per-student membership cap and an annual general
 *    meeting (University Regulation B.E. 2563, title3b.ts, ข้อ 62, 64, 65, 66).
 * The flow states plainly which body approves what at each level, rather
 * than treating "start a club" as one procedure.
 */
import type { SmartAnswerFlow } from "./types";

export const startAClubCheck: SmartAnswerFlow = {
  slug: "start-a-club-check",
  title: {
    en: "Check if you're ready to start a club",
    th: "เช็กความพร้อมก่อนเริ่มชมรม",
  },
  lede: {
    en: "A few questions to see whether you're ready to bring your idea to BIRSA, or what to sort out first.",
    th: "ตอบคำถามสั้น ๆ เพื่อเช็กว่าพร้อมนำไอเดียไปเสนอ BIRSA หรือยัง หรือควรเตรียมอะไรก่อน",
  },
  whatYoullNeed: [
    {
      en: "Roughly how many students are interested so far",
      th: "จำนวนเพื่อนที่สนใจร่วมด้วยคร่าว ๆ",
    },
    {
      en: "Whether anyone is ready to take on a committee role",
      th: "มีใครพร้อมรับตำแหน่งกรรมการหรือยัง",
    },
    {
      en: "Whether it's mainly for BIR students, the whole Faculty, or open university-wide",
      th: "ชมรมนี้เน้นสำหรับนักศึกษา BIR ทั้งคณะ หรือเปิดกว้างทั้งมหาวิทยาลัย",
    },
  ],
  start: "q-idea",
  nodes: [
    {
      kind: "question",
      id: "q-idea",
      question: {
        en: "Is there something you want to do together that no existing club already covers?",
        th: "มีสิ่งที่อยากทำร่วมกัน ที่ยังไม่มีชมรมไหนรองรับอยู่แล้วใช่ไหม",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, it's not covered yet", th: "ใช่ ยังไม่มีชมรมรองรับ" },
          next: "q-members",
        },
        {
          id: "no",
          label: {
            en: "Not sure / there might already be one",
            th: "ไม่แน่ใจ อาจจะมีอยู่แล้ว",
          },
          next: "out-join-existing",
        },
      ],
    },
    {
      kind: "question",
      id: "q-members",
      question: {
        en: "Do you already have at least a few other students (roughly 5 or more) who want to join in?",
        th: "ตอนนี้มีเพื่อนนักศึกษาคนอื่นที่อยากเข้าร่วมด้วยแล้วหรือยัง อย่างน้อยประมาณ 5 คน",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, roughly 5 or more", th: "ใช่ ประมาณ 5 คนขึ้นไป" },
          next: "q-committee",
        },
        { id: "no", label: { en: "Not yet", th: "ยังไม่มี" }, next: "out-find-people" },
      ],
    },
    {
      kind: "question",
      id: "q-committee",
      question: {
        en: "Could a few of you take on committee roles (like chair, secretary, or treasurer) to help run it?",
        th: "มีใครในกลุ่มพร้อมรับตำแหน่งกรรมการ เช่น ประธาน เลขานุการ หรือเหรัญญิก เพื่อช่วยดูแลชมรมไหม",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, we've got people for that", th: "มีคนพร้อมรับตำแหน่ง" },
          next: "q-scope",
        },
        { id: "no", label: { en: "Not yet", th: "ยังไม่มี" }, next: "out-need-committee" },
      ],
    },
    {
      kind: "question",
      id: "q-scope",
      question: {
        en: "Who is this mainly for: BIR programme students, the whole Faculty of Political Science, or students from any Faculty?",
        th: "ชมรมนี้เน้นสำหรับใคร นักศึกษาสาขา BIR ทั้งคณะรัฐศาสตร์ หรือนักศึกษาจากคณะไหนก็ได้",
      },
      options: [
        {
          id: "bir",
          label: { en: "Mainly BIR programme students", th: "เน้นนักศึกษาสาขา BIR" },
          next: "out-ready-bir",
        },
        {
          id: "faculty",
          label: {
            en: "Open to the whole Faculty of Political Science",
            th: "เปิดกว้างทั้งคณะรัฐศาสตร์",
          },
          next: "out-ready-faculty",
        },
        {
          id: "university",
          label: {
            en: "Open to students from any Faculty, university-wide",
            th: "เปิดกว้างสำหรับนักศึกษาคณะไหนก็ได้ ทั้งมหาวิทยาลัย",
          },
          next: "out-ready-university",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-join-existing",
      title: { en: "Check existing clubs first", th: "ลองดูชมรมที่มีอยู่ก่อน" },
      summary: {
        en: "If an existing club already covers this, joining it is usually quicker than starting a new one.",
        th: "ถ้ามีชมรมที่ตรงกับสิ่งที่อยากทำอยู่แล้ว การเข้าร่วมมักง่ายและเร็วกว่าการเริ่มใหม่",
      },
      actions: [{ label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" }, href: "/clubs" }],
    },
    {
      kind: "outcome",
      id: "out-find-people",
      title: { en: "Find a few more people first", th: "หาเพื่อนร่วมทางเพิ่มก่อน" },
      summary: {
        en: "A club needs people to run with, not just an idea. Talk to classmates or your year group before taking the next step.",
        th: "ชมรมต้องมีคนช่วยกันทำ ไม่ใช่แค่มีไอเดีย ชวนเพื่อนร่วมชั้นหรือรุ่นเดียวกันก่อนไปขั้นตอนถัดไป",
      },
      actions: [
        {
          label: {
            en: "Ask BIRSA for ideas on finding people",
            th: "ปรึกษา BIRSA เรื่องการหาคนร่วมชมรม",
          },
          href: "/contact",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-need-committee",
      title: {
        en: "You'll need a small committee eventually",
        th: "สุดท้ายแล้วจะต้องมีคณะกรรมการเล็ก ๆ",
      },
      summary: {
        en: "Running a recognised group means someone has to hold basic roles: even a Faculty activity group needs at least 5 committee members, and a University-wide club needs at least 3. This is not required on day one, but identify who could take these roles on early.",
        th: "การดูแลกลุ่มที่เป็นทางการต้องมีคนรับหน้าที่พื้นฐาน แม้แต่กลุ่มกิจกรรมคณะก็ยังต้องมีกรรมการอย่างน้อย 5 คน และชุมนุมระดับมหาวิทยาลัยก็ต้องมีกรรมการอย่างน้อย 3 คน ไม่จำเป็นต้องมีครบตั้งแต่วันแรก แต่เริ่มมองหาคนที่พร้อมรับตำแหน่งเหล่านี้ไว้ล่วงหน้า",
      },
      actions: [
        {
          label: { en: "Talk to BIRSA about your idea", th: "คุยไอเดียกับ BIRSA" },
          href: "/clubs/start",
        },
      ],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 44: Group committee positions",
            th: "ประกาศ พ.ศ. 2565 ข้อ 44 องค์ประกอบคณะกรรมการกลุ่ม",
          },
          href: "/activity/regulations/political-science-2565#prov-44",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 68: Club committee",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 68 คณะกรรมการบริหารชุมนุม",
          },
          href: "/activity/regulations/university-2563#prov-68",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-ready-bir",
      title: {
        en: "You're ready: tell BIRSA your idea",
        th: "พร้อมแล้ว บอกไอเดียกับ BIRSA",
      },
      summary: {
        en: "You have an idea, people, and potential committee members. For a BIR-programme club, contact BIRSA next.",
        th: "คุณมีไอเดีย มีคนร่วม และมีคนพร้อมเป็นกรรมการแล้ว สำหรับชมรมที่เน้นสาขา BIR ให้ติดต่อ BIRSA เพื่อดำเนินการต่อ",
      },
      body: [
        {
          en: "BIRSA is responsible for student activities within the BIR programme, and approves this track itself; there is no separate petition or minimum member count to file with the Faculty or the university.",
          th: "BIRSA รับผิดชอบกิจกรรมนักศึกษาภายในสาขา BIR โดยตรง และเป็นผู้พิจารณาอนุมัติแนวทางนี้เอง ไม่ต้องยื่นคำร้องหรือมีจำนวนสมาชิกขั้นต่ำต่อคณะหรือมหาวิทยาลัยแยกต่างหาก",
        },
        {
          en: "BIRSA has also been simplifying the process for starting a BIR club this year.",
          th: "ปีนี้ BIRSA กำลังปรับปรุงขั้นตอนการเริ่มชมรม BIR ให้ง่ายขึ้นด้วย",
        },
      ],
      actions: [
        { label: { en: "Start a club", th: "เริ่มชมรมใหม่" }, href: "/clubs/start" },
        { label: { en: "This year's plan", th: "แผนงานปีนี้" }, href: "/activity/this-year" },
      ],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 24: Establishment of BIRSA",
            th: "ประกาศ พ.ศ. 2565 ข้อ 24 การจัดตั้ง BIRSA",
          },
          href: "/activity/regulations/political-science-2565#prov-24",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-ready-faculty",
      title: {
        en: "You're ready: start with BIRSA, then formalise it with the Dean",
        th: "พร้อมแล้ว เริ่มคุยกับ BIRSA ก่อน แล้วยื่นเรื่องต่อคณบดี",
      },
      summary: {
        en: "Talk to BIRSA first. If you want it to become an official, faculty-wide activity group with its own budget, that formally needs 30 students of the Faculty of Political Science signing a petition for the Dean to consider and appoint.",
        th: "เริ่มคุยกับ BIRSA ก่อน แต่ถ้าต้องการให้เป็น “กลุ่มกิจกรรมคณะ” อย่างเป็นทางการที่มีงบประมาณของตัวเอง ต้องมีนักศึกษาคณะรัฐศาสตร์ไม่น้อยกว่า 30 คน ร่วมลงชื่อยื่นเรื่องให้คณบดีพิจารณาแต่งตั้ง",
      },
      body: [
        {
          en: "That's a separate, more formal step than the BIRSA on-ramp: a Faculty activity group needs at least 20 members, a 5-to-10-member committee, and only the Dean can approve its formation or dissolution. BIRSA can help you assess whether you need it yet.",
          th: "ขั้นตอนนี้เป็นคนละเรื่องกับการเริ่มผ่าน BIRSA และเป็นทางการมากกว่า กลุ่มกิจกรรมคณะต้องมีสมาชิกอย่างน้อย 20 คน มีคณะกรรมการ 5 ถึง 10 คน และการจัดตั้งหรือยุบเลิกทำได้โดยคำสั่งคณบดีเท่านั้น BIRSA ช่วยดูได้ว่าตอนนี้จำเป็นต้องทำถึงขั้นนั้นหรือยัง",
        },
      ],
      actions: [{ label: { en: "Start a club", th: "เริ่มชมรมใหม่" }, href: "/clubs/start" }],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 41: Forming a group",
            th: "ประกาศ พ.ศ. 2565 ข้อ 41 การจัดตั้งกลุ่ม",
          },
          href: "/activity/regulations/political-science-2565#prov-41",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 43: Membership minimum and its end",
            th: "ประกาศ พ.ศ. 2565 ข้อ 43 จำนวนสมาชิกและสิ้นสุดสมาชิกภาพ",
          },
          href: "/activity/regulations/political-science-2565#prov-43",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-ready-university",
      title: {
        en: "You're ready: start with BIRSA, then register with TUSU",
        th: "พร้อมแล้ว เริ่มคุยกับ BIRSA ก่อน แล้วยื่นเรื่องต่อ อมธ.",
      },
      summary: {
        en: "Talk to BIRSA first. If you want it open to students from any Faculty, that's a University-wide student activity club (ชุมนุม), registered with the Thammasat University Student Union (TUSU), not the Faculty.",
        th: "เริ่มคุยกับ BIRSA ก่อน แต่ถ้าต้องการเปิดกว้างให้นักศึกษาคณะไหนก็ได้เข้าร่วม นั่นคือ “ชุมนุมกิจกรรมนักศึกษา” ระดับมหาวิทยาลัย ซึ่งจดทะเบียนกับองค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ (อมธ.) ไม่ใช่กับคณะ",
      },
      body: [
        {
          en: "To form one, at least 50 undergraduate students from various Faculties sign a petition to the TUSU Executive Committee, together with the club's rules, the founding members' names, the first executive committee's names, and the minutes of the founding meeting.",
          th: "การก่อตั้งต้องมีนักศึกษาปริญญาตรีจากหลายคณะไม่น้อยกว่า 50 คน ยื่นคำร้องต่อคณะกรรมการบริหารองค์การนักศึกษา พร้อมระเบียบชุมนุม รายชื่อผู้ก่อตั้ง รายชื่อคณะกรรมการบริหารชุดแรก และรายงานการประชุมก่อตั้ง",
        },
        {
          en: "The TUSU Executive Committee considers it first; if it approves, the Thammasat University Student Council (TUSC) approves next, and the TUSC then reports the result to the Rector to establish the club.",
          th: "คณะกรรมการบริหารองค์การนักศึกษาพิจารณาก่อน หากเห็นชอบจะเสนอต่อสภานักศึกษา (TUSC) เพื่อพิจารณาอนุมัติ แล้วสภานักศึกษาจึงรายงานผลต่ออธิการบดีเพื่อจัดตั้งชุมนุมต่อไป",
        },
        {
          en: "A student may be a member of no more than 5 university-wide clubs at once, and each club's committee must hold an annual general meeting within 60 days before the end of the second semester.",
          th: "นักศึกษาคนหนึ่งเป็นสมาชิกชุมนุมได้ไม่เกิน 5 ชุมนุมพร้อมกัน และคณะกรรมการของแต่ละชุมนุมต้องจัดประชุมใหญ่ภายใน 60 วันก่อนปิดภาคการศึกษาที่สองของปีการศึกษา",
        },
      ],
      actions: [{ label: { en: "Start a club", th: "เริ่มชมรมใหม่" }, href: "/clubs/start" }],
      citations: [
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 62: Forming a club",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 62 การก่อตั้งชุมนุม",
          },
          href: "/activity/regulations/university-2563#prov-62",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 64: Approval of a new club",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 64 การพิจารณาอนุมัติจัดตั้งชุมนุม",
          },
          href: "/activity/regulations/university-2563#prov-64",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 65: Club membership limit",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 65 การเป็นสมาชิกชุมนุม",
          },
          href: "/activity/regulations/university-2563#prov-65",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 66: Club annual general meeting",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 66 การประชุมใหญ่ของชุมนุม",
          },
          href: "/activity/regulations/university-2563#prov-66",
        },
      ],
    },
  ],
};
