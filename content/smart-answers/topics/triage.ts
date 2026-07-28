/**
 * The spine of the service: the "I don't know where to start" route, and the
 * three outcomes every other topic is allowed to hand off to.
 *
 * Node ids here are the only ones other topic files may point at from
 * outside their own subgraph. Everything else stays local to its file, so a
 * topic can be rewritten without breaking another one.
 *
 * The root question is deliberately phrased as "what do you need", not "what
 * is your question about". People arrive with a situation, not a category,
 * and the safety route has to be the first thing on the page rather than
 * something they have to recognise as relevant to them.
 */
import type { SmartAnswerService } from "../types";

export const triage: SmartAnswerService = {
  topics: [
    {
      slug: "start",
      title: {
        en: "Start here if you are not sure",
        th: "ถ้ายังไม่รู้ว่าต้องเริ่มตรงไหน เริ่มที่นี่",
      },
      lede: {
        en: "Describe the situation you are in and we will take you to the part of the rules or the service that covers it.",
        th: "บอกสถานการณ์ที่คุณเจอ แล้วเราจะพาไปยังกฎระเบียบหรือบริการส่วนที่เกี่ยวข้อง",
      },
      group: "help",
      start: "q-root",
      keywords: ["help", "start", "not sure", "ช่วย", "เริ่ม", "ไม่รู้"],
      hideFromHub: true,
    },
  ],
  nodes: [
    {
      kind: "question",
      id: "q-root",
      question: {
        en: "What do you need?",
        th: "คุณต้องการอะไร",
      },
      options: [
        {
          id: "emergency",
          label: {
            en: "Something is happening right now and someone could get hurt",
            th: "มีเหตุเกิดขึ้นตอนนี้ และอาจมีคนได้รับอันตราย",
          },
          next: "out-emergency-now",
        },
        {
          id: "activity",
          label: {
            en: "To run an event, start a club, or borrow equipment",
            th: "จะจัดกิจกรรม เริ่มชมรม หรือยืมอุปกรณ์",
          },
          next: "q-root-activity",
        },
        {
          id: "degree",
          label: {
            en: "Something about my degree: registration, exams, grades, graduating",
            th: "เรื่องหลักสูตร เช่น การลงทะเบียน การสอบ เกรด การจบการศึกษา",
          },
          next: "q-academic-topic",
        },
        {
          id: "internship",
          label: {
            en: "To do the internship",
            th: "จะฝึกงาน",
          },
          next: "q-internship-stage",
        },
        {
          id: "money",
          label: {
            en: "Something about money: tuition, fees, costs",
            th: "เรื่องเงิน เช่น ค่าเล่าเรียน ค่าธรรมเนียม ค่าใช้จ่าย",
          },
          next: "q-money-need",
        },
        {
          id: "settle",
          label: {
            en: "To settle in: visa, bank account, phone, first weeks",
            th: "เรื่องการตั้งตัว เช่น วีซ่า บัญชีธนาคาร เบอร์โทรศัพท์ สัปดาห์แรก",
          },
          next: "q-settle-need",
        },
        {
          id: "wellbeing",
          label: {
            en: "Health, wellbeing, or feeling unsafe",
            th: "สุขภาพ ความเป็นอยู่ หรือรู้สึกไม่ปลอดภัย",
          },
          next: "q-wellbeing-need",
        },
        {
          id: "around",
          label: {
            en: "To get to campus, or find my way around it",
            th: "การเดินทางมาคณะ หรือหาที่ต่าง ๆ ในมหาวิทยาลัย",
          },
          next: "q-around-need",
        },
        {
          id: "problem",
          label: {
            en: "To raise a problem, a complaint, or something about my rights",
            th: "จะร้องเรียน แจ้งปัญหา หรือเรื่องสิทธิของตัวเอง",
          },
          next: "q-problem-kind",
        },
        {
          id: "person",
          label: {
            en: "To reach a person about something else",
            th: "อยากติดต่อคนจริง ๆ เรื่องอื่น",
          },
          next: "out-contact-birsa",
        },
      ],
    },

    {
      kind: "question",
      id: "q-root-activity",
      question: {
        en: "Which of these is closest?",
        th: "ข้อไหนใกล้เคียงที่สุด",
      },
      options: [
        {
          id: "event",
          label: {
            en: "Running an event or activity",
            th: "จัดงานหรือกิจกรรม",
          },
          next: "q-activity-body",
        },
        {
          id: "club",
          label: {
            en: "Starting a club or group",
            th: "เริ่มชมรมหรือกลุ่ม",
          },
          next: "q-club-idea",
        },
        {
          id: "equipment",
          label: {
            en: "Borrowing equipment",
            th: "ยืมอุปกรณ์",
          },
          next: "q-equipment-kind",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* Shared outcomes                                                   */
    /* ---------------------------------------------------------------- */

    {
      kind: "outcome",
      id: "out-emergency-now",
      title: {
        en: "Call the emergency services first",
        th: "โทรหาหน่วยงานฉุกเฉินก่อน",
      },
      summary: {
        en: "Police 191. Medical 1669. Fire and rescue 199. Call before you do anything else, including reading the rest of this page.",
        th: "ตำรวจ 191 การแพทย์ 1669 ดับเพลิงและกู้ภัย 199 โทรก่อนทำอย่างอื่น รวมถึงก่อนอ่านหน้านี้ต่อ",
      },
      owner: {
        en: "Emergency services, then Thammasat security. BIRSA cannot respond to an emergency.",
        th: "หน่วยงานฉุกเฉิน จากนั้นคือฝ่ายรักษาความปลอดภัยของมหาวิทยาลัย BIRSA ไม่สามารถรับมือเหตุฉุกเฉินได้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Tell BIRSA or the Faculty afterwards, once everyone is safe, if it affects your studies or wellbeing.",
            th: "เมื่อทุกคนปลอดภัยแล้ว ค่อยแจ้ง BIRSA หรือคณะ หากเรื่องนี้กระทบการเรียนหรือความเป็นอยู่ของคุณ",
          },
        },
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "The emergency guidance pages cover fire, earthquake, flooding, protests near campus, and campus closures, with what to do step by step.",
            th: "หน้าคำแนะนำเหตุฉุกเฉินครอบคลุมเหตุไฟไหม้ แผ่นดินไหว น้ำท่วม การชุมนุมใกล้มหาวิทยาลัย และการปิดพื้นที่ พร้อมขั้นตอนที่ต้องทำ",
          },
        },
      ],
      actions: [
        {
          label: { en: "Emergency guidance", th: "คำแนะนำเหตุฉุกเฉิน" },
          href: "/emergency",
        },
      ],
      related: [
        {
          label: { en: "Safety and emergencies", th: "ความปลอดภัยและเหตุฉุกเฉิน" },
          href: "/student-life/home/safety-and-emergencies",
          description: {
            en: "Campus security, lost student cards, river safety, scams, and reporting harassment.",
            th: "การรักษาความปลอดภัยในมหาวิทยาลัย บัตรนักศึกษาหาย ความปลอดภัยริมน้ำ มิจฉาชีพ และการแจ้งเหตุคุกคาม",
          },
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-contact-birsa",
      title: {
        en: "Ask BIRSA",
        th: "สอบถาม BIRSA",
      },
      summary: {
        en: "Send us the question and we will either answer it or tell you which office can.",
        th: "ส่งคำถามมาได้เลย เราจะตอบให้ หรือบอกว่าต้องติดต่อหน่วยงานไหน",
      },
      body: [
        {
          kind: "paragraph",
          when: { fact: "role", is: "officer" },
          text: {
            en: "If this is committee business, say which body you sit on when you write. It changes who at the Faculty needs to see it.",
            th: "ถ้าเป็นเรื่องของคณะกรรมการ ให้ระบุด้วยว่าคุณอยู่องค์กรใด เพราะมีผลว่าฝ่ายใดของคณะต้องรับเรื่อง",
          },
        },
      ],
      actions: [
        { label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" },
        { label: { en: "Quick actions", th: "ทางลัด" }, href: "/quick" },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-not-covered",
      title: {
        en: "There is no rule on file for this, so ask before you act",
        th: "เรื่องนี้ไม่มีระเบียบที่ระบุไว้ชัดเจน ควรสอบถามก่อนดำเนินการ",
      },
      summary: {
        en: "We could not find anything in the regulations we hold that covers your situation. Rather than guess at a procedure, ask BIRSA or the Faculty office and get it in writing.",
        th: "เราไม่พบข้อกำหนดในระเบียบที่เรามีซึ่งครอบคลุมกรณีของคุณ แทนที่จะเดาขั้นตอนเอง ให้สอบถาม BIRSA หรือสำนักงานคณะ และขอคำตอบเป็นลายลักษณ์อักษร",
      },
      owner: {
        en: "The Faculty office decides. BIRSA can raise it for you.",
        th: "สำนักงานคณะเป็นผู้ตัดสิน BIRSA ช่วยนำเรื่องเสนอให้ได้",
      },
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      related: [
        {
          label: { en: "The regulations we hold", th: "ระเบียบที่เรารวบรวมไว้" },
          href: "/activity/regulations",
          description: {
            en: "The University regulation on student activities, the Faculty Notice, and the discipline regulation, in full.",
            th: "ระเบียบมหาวิทยาลัยว่าด้วยกิจกรรมนักศึกษา ประกาศคณะ และระเบียบว่าด้วยวินัยนักศึกษา ฉบับเต็ม",
          },
        },
      ],
      contactCategory: "question",
    },
  ],
};
