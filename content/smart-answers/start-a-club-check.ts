/**
 * Smart answer: "Check if you're ready to start a club".
 *
 * Grounded in BIRSA's actual on-ramp (`/clubs/start`: an informal "tell us
 * your idea" form, no minimum numbers) and, where the flow points at
 * something more formal, the Faculty Notice B.E. 2565's rules for a
 * "Faculty activity group" (ข้อ 41 forming a group: 30 signatures to the
 * Dean; ข้อ 43 a 20-member minimum; ข้อ 44 committee positions). The two are
 * genuinely different steps: BIRSA's on-ramp is the easy first move; the
 * Notice's thresholds only bite once a group wants formal, faculty-wide
 * recognition and its own budget, and the flow says so rather than
 * conflating them.
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
    { en: "Who the club is mainly for", th: "ชมรมนี้เน้นสำหรับใคร" },
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
        en: "Is this mainly for BIR programme students, or open to the whole Faculty of Political Science?",
        th: "ชมรมนี้เน้นสำหรับนักศึกษาสาขา BIR หรือเปิดกว้างสำหรับนักศึกษาทั้งคณะรัฐศาสตร์",
      },
      options: [
        {
          id: "bir",
          label: { en: "Mainly BIR programme students", th: "เน้นนักศึกษาสาขา BIR" },
          next: "out-ready-bir",
        },
        {
          id: "faculty",
          label: { en: "Open to the whole Faculty", th: "เปิดกว้างทั้งคณะ" },
          next: "out-ready-faculty",
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
        en: "Running a recognised group means someone has to hold basic roles: even a Faculty activity group needs at least 5 committee members. This is not required on day one, but identify who could take these roles on early.",
        th: "การดูแลกลุ่มที่เป็นทางการต้องมีคนรับหน้าที่พื้นฐาน แม้แต่กลุ่มกิจกรรมคณะก็ยังต้องมีกรรมการอย่างน้อย 5 คน ไม่จำเป็นต้องมีครบตั้งแต่วันแรก แต่เริ่มมองหาคนที่พร้อมรับตำแหน่งเหล่านี้ไว้ล่วงหน้า",
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
          en: "BIRSA is responsible for student activities within the BIR programme.",
          th: "BIRSA รับผิดชอบกิจกรรมนักศึกษาภายในสาขา BIR โดยตรง",
        },
      ],
      actions: [{ label: { en: "Start a club", th: "เริ่มชมรมใหม่" }, href: "/clubs/start" }],
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
        en: "You're ready: start with BIRSA, then formalise it",
        th: "พร้อมแล้ว เริ่มคุยกับ BIRSA ก่อน แล้วค่อยทำให้เป็นทางการ",
      },
      summary: {
        en: "Talk to BIRSA first. If you want it to become an official, faculty-wide activity group with its own budget, that formally needs 30 students of the Faculty of Political Science signing a petition for the Dean to consider.",
        th: "เริ่มคุยกับ BIRSA ก่อน แต่ถ้าต้องการให้เป็น “กลุ่มกิจกรรมคณะ” อย่างเป็นทางการที่มีงบประมาณของตัวเอง ต้องมีนักศึกษาคณะรัฐศาสตร์ไม่น้อยกว่า 30 คน ร่วมลงชื่อยื่นเรื่องให้คณบดีพิจารณา",
      },
      body: [
        {
          en: "That's a separate, more formal step than the BIRSA on-ramp; BIRSA can help you assess whether you need it yet.",
          th: "ขั้นตอนนี้เป็นคนละเรื่องกับการเริ่มผ่าน BIRSA และเป็นทางการมากกว่า BIRSA ช่วยดูได้ว่าตอนนี้จำเป็นต้องทำถึงขั้นนั้นหรือยัง",
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
  ],
};
