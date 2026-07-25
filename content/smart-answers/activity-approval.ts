/**
 * Smart answer: "Check if your student activity needs approval".
 *
 * Grounded in the Faculty of Political Science Notice, B.E. 2565
 * (`political-science-2565`): the Notice mostly governs recognised student
 * bodies (BIRSA, the PSC, Faculty activity groups, clubs) and their annual
 * plans/budgets, rather than a generic one-off event-approval procedure. That
 * shapes the flow honestly: activities inside an existing body's approved
 * plan don't need separate sign-off (ข้อ 26, ข้อ 46); spending outside the
 * budget does (ข้อ 84); an activity with no recognised body behind it has no
 * clear-cut rule on file, so the outcome says so plainly and points to
 * BIRSA/the Faculty office rather than inventing a procedure.
 */
import type { SmartAnswerFlow } from "./types";

export const activityApproval: SmartAnswerFlow = {
  slug: "activity-approval",
  title: {
    en: "Check if your student activity needs approval",
    th: "เช็กว่ากิจกรรมของคุณต้องขออนุมัติหรือไม่",
  },
  lede: {
    en: "Answer a few quick questions to see whether your activity needs sign-off from BIRSA, the PSC, or the Faculty, and who to ask.",
    th: "ตอบคำถามสั้น ๆ เพื่อเช็กว่ากิจกรรมที่จะจัดต้องขออนุมัติจาก BIRSA กนศ.ร. หรือคณะหรือไม่ และต้องติดต่อใคร",
  },
  whatYoullNeed: [
    {
      en: "Whether it's organised by an existing club, committee, or BIRSA/PSC itself",
      th: "กิจกรรมนี้จัดโดยชมรม คณะกรรมการที่มีอยู่แล้ว หรือ BIRSA/กนศ.ร. เองหรือไม่",
    },
    {
      en: "Whether it needs Faculty budget or a room/space booking",
      th: "ต้องใช้งบประมาณของคณะ หรือขอใช้สถานที่หรือไม่",
    },
    {
      en: "Whether it's happening on campus or off campus",
      th: "จัดในคณะหรือออกไปนอกสถานที่",
    },
  ],
  start: "q-affiliated",
  nodes: [
    {
      kind: "question",
      id: "q-affiliated",
      question: {
        en: "Is the activity organised by an official body: BIRSA itself, the PSC (กนศ.ร.), a recognised Faculty activity group, a club, or your year's cohort committee (คกร.)?",
        th: "กิจกรรมนี้จัดโดยองค์กรที่เป็นทางการหรือไม่ เช่น BIRSA เอง กนศ.ร. กลุ่มกิจกรรมคณะที่จดทะเบียนแล้ว ชมรม หรือ คกร. ของรุ่นคุณ",
      },
      hint: {
        en: 'If a few friends are organising something informally, choose "No".',
        th: "ถ้าเป็นการรวมตัวกันเองแบบไม่เป็นทางการ ให้เลือก “ไม่ใช่”",
      },
      options: [
        {
          id: "yes",
          label: {
            en: "Yes, an existing body is organising it",
            th: "ใช่ มีองค์กรที่เป็นทางการจัดอยู่",
          },
          next: "q-budget-space",
        },
        {
          id: "no",
          label: {
            en: "No, it's not tied to an existing body",
            th: "ไม่ใช่ ยังไม่มีองค์กรที่เป็นทางการรองรับ",
          },
          next: "q-oneoff-or-club",
        },
      ],
    },
    {
      kind: "question",
      id: "q-budget-space",
      question: {
        en: "Does it need Faculty budget, or a room/space booking, beyond what your group already planned for this academic year?",
        th: "กิจกรรมนี้ต้องใช้งบประมาณของคณะ หรือขอใช้ห้อง/สถานที่ เพิ่มเติมจากแผนงานที่กลุ่มของคุณเสนอไว้แล้วในปีการศึกษานี้หรือไม่",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, it needs extra budget or space", th: "ใช่ ต้องขอเพิ่มเติม" },
          next: "out-special-approval",
        },
        {
          id: "no",
          label: {
            en: "No, it's within the plan we already submitted",
            th: "ไม่ใช่ อยู่ในแผนที่เสนอไว้แล้ว",
          },
          next: "out-likely-fine",
        },
      ],
    },
    {
      kind: "question",
      id: "q-oneoff-or-club",
      question: {
        en: "Are you planning a one-off activity, or trying to start something ongoing, like a new club or group?",
        th: "นี่เป็นกิจกรรมครั้งเดียว หรือคุณกำลังจะเริ่มสิ่งที่ทำต่อเนื่อง เช่น ชมรมหรือกลุ่มใหม่",
      },
      options: [
        {
          id: "oneoff",
          label: { en: "A one-off activity", th: "กิจกรรมครั้งเดียว" },
          next: "q-oncampus",
        },
        {
          id: "ongoing",
          label: {
            en: "Starting an ongoing club or group",
            th: "เริ่มชมรมหรือกลุ่มที่ทำต่อเนื่อง",
          },
          next: "out-start-a-club",
        },
      ],
    },
    {
      kind: "question",
      id: "q-oncampus",
      question: {
        en: "Will it happen on Faculty premises (Tha Prachan or Rangsit), or off campus?",
        th: "กิจกรรมนี้จัดในพื้นที่คณะ (ท่าพระจันทร์หรือรังสิต) หรือจัดนอกสถานที่",
      },
      options: [
        {
          id: "oncampus",
          label: { en: "On campus", th: "ในคณะ" },
          next: "out-ask-faculty-oncampus",
        },
        {
          id: "offcampus",
          label: { en: "Off campus", th: "นอกสถานที่" },
          next: "out-ask-faculty-offcampus",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-likely-fine",
      title: {
        en: "Likely fine under your group's existing plan, but check with your committee",
        th: "น่าจะไม่ต้องขออนุมัติเพิ่ม แต่ควรเช็กกับคณะกรรมการของกลุ่มก่อน",
      },
      summary: {
        en: "Activities carried out under an existing group's approved annual plan do not need separate sign-off for each event. Confirm with your group's own committee that it's covered.",
        th: "กิจกรรมที่อยู่ในแผนงานประจำปีที่กลุ่มของคุณเสนอไว้แล้ว ไม่ต้องขออนุมัติแยกเป็นรายกิจกรรมอีก แค่เช็กกับคณะกรรมการของกลุ่มว่าอยู่ในแผนจริง",
      },
      body: [
        {
          en: "BIRSA and Faculty activity groups prepare and submit an annual work plan, projects, and budget each year; activities inside that plan are already covered.",
          th: "BIRSA และกลุ่มกิจกรรมคณะต้องจัดทำและเสนอแผนงาน โครงการ และงบประมาณประจำปีไว้ล่วงหน้า กิจกรรมที่อยู่ในแผนนี้จึงไม่ต้องขออนุมัติซ้ำอีก",
        },
      ],
      actions: [
        {
          label: { en: "Ask BIRSA if you're not sure", th: "ถ้าไม่แน่ใจ ติดต่อ BIRSA" },
          href: "/contact",
        },
      ],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 26: Powers and duties (BIRSA's annual work plan and budget)",
            th: "ประกาศ พ.ศ. 2565 ข้อ 26 อำนาจหน้าที่ (แผนงานและงบประมาณประจำปีของ BIRSA)",
          },
          href: "/activity/regulations/political-science-2565#prov-26",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 46: Powers and duties of the group committee (submits its annual work plan to the PSC)",
            th: "ประกาศ พ.ศ. 2565 ข้อ 46 อำนาจหน้าที่คณะกรรมการกลุ่ม (เสนอแผนงานประจำปีต่อ กนศ.ร.)",
          },
          href: "/activity/regulations/political-science-2565#prov-46",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-special-approval",
      title: {
        en: "Get sign-off for the extra budget or space first",
        th: "ต้องขออนุมัติงบประมาณหรือสถานที่เพิ่มเติมก่อน",
      },
      summary: {
        en: "Spending outside your group's approved budget needs the Faculty's approval before you go ahead; this is a formal step, not just a courtesy.",
        th: "การใช้จ่ายนอกเหนือจากงบประมาณที่อนุมัติไว้แล้ว ต้องได้รับความเห็นชอบจากคณะก่อนดำเนินการ ไม่ใช่แค่แจ้งให้ทราบ",
      },
      body: [
        {
          en: "Talk to your group's committee first, then have them raise it with the Faculty (through BIRSA or the PSC, as relevant) before you book anything or spend money.",
          th: "คุยกับคณะกรรมการของกลุ่มคุณก่อน แล้วให้กรรมการนำเรื่องเสนอต่อคณะ (ผ่าน BIRSA หรือ กนศ.ร. แล้วแต่กรณี) ก่อนที่จะจองสถานที่หรือใช้จ่ายเงินใด ๆ",
        },
      ],
      actions: [
        {
          label: {
            en: "Contact BIRSA for help raising this",
            th: "ติดต่อ BIRSA เพื่อขอความช่วยเหลือ",
          },
          href: "/contact",
        },
      ],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 84: Special disbursements outside the budget",
            th: "ประกาศ พ.ศ. 2565 ข้อ 84 การสั่งจ่ายกรณีพิเศษ",
          },
          href: "/activity/regulations/political-science-2565#prov-84",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-start-a-club",
      title: {
        en: "Starting a club or group is a separate check",
        th: "การเริ่มชมรมหรือกลุ่มใหม่ต้องใช้แบบสอบถามอีกชุดหนึ่ง",
      },
      summary: {
        en: "Starting an ongoing club or group is a bigger step than a one-off activity, with its own requirements.",
        th: "การเริ่มชมรมหรือกลุ่มที่ทำต่อเนื่อง เป็นก้าวที่ใหญ่กว่ากิจกรรมครั้งเดียว และมีเงื่อนไขของตัวเอง",
      },
      actions: [
        {
          label: { en: "Check if you're ready to start a club", th: "เช็กความพร้อมก่อนเริ่มชมรม" },
          href: "/answers/start-a-club-check",
        },
        {
          label: { en: "Read how starting a club works", th: "อ่านขั้นตอนการเริ่มชมรม" },
          href: "/clubs/start",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-ask-faculty-oncampus",
      title: {
        en: "Ask BIRSA or the Faculty office before you go ahead",
        th: "ติดต่อ BIRSA หรือสำนักงานคณะก่อนดำเนินการ",
      },
      summary: {
        en: "We do not have a clear-cut rule on file for a one-off activity that is not run by an existing body, even when it's on campus. Ask BIRSA or the Faculty office before you go ahead.",
        th: "สำหรับกิจกรรมครั้งเดียวที่ไม่มีองค์กรที่เป็นทางการรองรับ แม้จะจัดในคณะ เราไม่มีระเบียบที่ระบุขั้นตอนไว้ชัดเจน สอบถาม BIRSA หรือสำนักงานคณะก่อนดำเนินการ",
      },
      body: [
        {
          en: "BIRSA or your คกร. (year cohort committee) can help you find a group to run it under, or point you to the right office at the Faculty.",
          th: "BIRSA หรือ คกร. ของรุ่นคุณ ช่วยหากลุ่มที่พร้อมรองรับกิจกรรมนี้ให้ได้ หรือช่วยแนะนำว่าต้องติดต่อฝ่ายไหนของคณะ",
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
    },
    {
      kind: "outcome",
      id: "out-ask-faculty-offcampus",
      title: {
        en: "Ask before you go ahead, since off-campus needs extra care",
        th: "สอบถามก่อนดำเนินการ กิจกรรมนอกสถานที่ต้องระวังเป็นพิเศษ",
      },
      summary: {
        en: "We do not have a clear-cut rule on file for an unaffiliated one-off activity, and off-campus trips add real questions around safety, transport, and who's responsible if something goes wrong. Ask BIRSA or the Faculty office first.",
        th: "สำหรับกิจกรรมครั้งเดียวที่ไม่มีองค์กรรองรับ เราไม่มีระเบียบที่ระบุขั้นตอนไว้ชัดเจน และการจัดนอกสถานที่ยังมีเรื่องความปลอดภัย การเดินทาง และผู้รับผิดชอบหากเกิดเหตุ ควรสอบถาม BIRSA หรือสำนักงานคณะก่อน",
      },
      body: [
        {
          en: "This matters even more for anything involving travel, an overnight stay, or activities with any physical risk.",
          th: "ยิ่งสำคัญมากขึ้นถ้ากิจกรรมมีการเดินทาง ค้างคืน หรือมีความเสี่ยงทางร่างกาย",
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
    },
  ],
};
