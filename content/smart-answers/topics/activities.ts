/**
 * Topic group "activities": three guided answers about running things, not
 * studying things: whether an activity needs sign-off, whether you're ready
 * to start a club, and how to borrow equipment.
 *
 * Grounding:
 *  - `content/activity/regulations/part04.ts` (Faculty Notice B.E. 2565, Part 4:
 *    BIRSA, ข้อ 24 to 39) and `part05.ts` (Part 5: Faculty activity groups,
 *    ข้อ 40 to 54) and `part10.ts` (Part 10: finance, ข้อ 81 to 85).
 *  - `content/activity/regulations/university-2563/title3b.ts` (Title 3,
 *    Chapter 4: student activity clubs, ข้อ 61 to 71).
 *  - `content/student-life/en/home/getting-involved.mdx` (SATU room booking,
 *    the request form, and sports equipment via faculty/TUSU Tha Prachan).
 *  - `content/clubs/clubs.ts`, `app/[lang]/clubs/start/page.tsx` (BIRSA's
 *    informal "tell us your idea" on-ramp, no minimum numbers).
 *  - `app/[lang]/information-services/equipment-loan/page.tsx`,
 *    `components/equipment/loanWizardCopy.ts`,
 *    `app/[lang]/information-services/equipment-loan/directory/page.tsx`,
 *    `app/[lang]/information-services/equipment-loan/status/page.tsx`, and
 *    `lib/inventory/custodians.ts` for the three genuinely different
 *    equipment routes and what a request needs.
 *
 * Topic 1 (`activity-approval`) and Topic 2 (`start-a-club-check`) port and
 * extend the old single-purpose flows of the same slugs, restructured onto
 * the shared node pool: an unaffiliated activity that turns out to be "start
 * something ongoing" now hands off directly into topic 2's own start node
 * (`q-club-idea`) instead of a duplicate outcome pointing at it. Both keep
 * the old flows' honesty about what the regulations do not cover: an
 * unaffiliated one-off activity has no procedure on file, so those outcomes
 * say so rather than inventing one.
 *
 * `role: officer` changes the answer in topic 1, because the Faculty Notice
 * puts the annual-plan and budget duties on the group committee, not on
 * individual members (ข้อ 26(2), ข้อ 46(2), ข้อ 84): a committee member is
 * told to do the step, an ordinary member is told to ask their committee to.
 */
import type { SmartAnswerService } from "../types";

export const activities: SmartAnswerService = {
  topics: [
    {
      slug: "activity-approval",
      title: {
        en: "Check if your student activity needs approval",
        th: "เช็กว่ากิจกรรมของคุณต้องขออนุมัติหรือไม่",
      },
      lede: {
        en: "Answer a few quick questions to see whether your activity needs sign-off from BIRSA, the PSC, or the Faculty, and who to ask.",
        th: "ตอบคำถามสั้น ๆ เพื่อเช็กว่ากิจกรรมที่จะจัดต้องขออนุมัติจาก BIRSA กนศ.ร. หรือคณะหรือไม่ และต้องติดต่อใคร",
      },
      group: "activities",
      start: "q-activity-body",
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
      keywords: [
        "event",
        "activity",
        "approval",
        "budget",
        "room booking",
        "กิจกรรม",
        "ขออนุมัติ",
        "งบประมาณ",
        "จองห้อง",
      ],
    },
    {
      slug: "start-a-club-check",
      title: {
        en: "Check if you're ready to start a club",
        th: "เช็กความพร้อมก่อนเริ่มชมรม",
      },
      lede: {
        en: "A few questions to see whether you're ready to bring your idea to BIRSA, or what to sort out first.",
        th: "ตอบคำถามสั้น ๆ เพื่อเช็กว่าพร้อมนำไอเดียไปเสนอ BIRSA หรือยัง หรือควรเตรียมอะไรก่อน",
      },
      group: "activities",
      start: "q-club-idea",
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
      keywords: [
        "club",
        "start a club",
        "new club",
        "society",
        "ชมรม",
        "เริ่มชมรม",
        "ตั้งชมรม",
        "ชุมนุม",
      ],
    },
    {
      slug: "borrow-equipment",
      title: {
        en: "Borrow equipment",
        th: "ยืมอุปกรณ์",
      },
      lede: {
        en: "Find the right way to borrow what you need: BIRSA's own equipment, a club's equipment, or sports equipment.",
        th: "หาวิธีที่ถูกต้องในการยืมสิ่งที่ต้องการ ไม่ว่าจะเป็นอุปกรณ์ของ BIRSA เอง อุปกรณ์ของชมรม หรืออุปกรณ์กีฬา",
      },
      group: "activities",
      start: "q-equipment-kind",
      whatYoullNeed: [
        {
          en: "What kind of equipment: BIRSA's catalogue, a club's, or sports equipment",
          th: "อุปกรณ์ที่ต้องการเป็นของ BIRSA ของชมรม หรืออุปกรณ์กีฬา",
        },
        {
          en: "Your Thammasat student ID and student email, if borrowing from BIRSA",
          th: "รหัสนักศึกษาและอีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ หากยืมจาก BIRSA",
        },
        {
          en: "The dates you need it and what it's for",
          th: "วันที่ต้องการยืมและเหตุผลในการยืม",
        },
      ],
      keywords: [
        "equipment",
        "borrow",
        "loan",
        "camera",
        "speaker",
        "sports equipment",
        "อุปกรณ์",
        "ยืม",
        "ยืมอุปกรณ์",
        "อุปกรณ์กีฬา",
      ],
    },
  ],

  nodes: [
    /* ================================================================ */
    /* Topic 1: activity-approval                                        */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-activity-body",
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
          next: "q-activity-budget-space",
        },
        {
          id: "no",
          label: {
            en: "No, it's not tied to an existing body",
            th: "ไม่ใช่ ยังไม่มีองค์กรที่เป็นทางการรองรับ",
          },
          next: "q-activity-oneoff-or-club",
        },
      ],
    },
    {
      kind: "question",
      id: "q-activity-budget-space",
      question: {
        en: "Does it need Faculty budget, or a room/space booking, beyond what your group already planned for this academic year?",
        th: "กิจกรรมนี้ต้องใช้งบประมาณของคณะ หรือขอใช้ห้อง/สถานที่ เพิ่มเติมจากแผนงานที่กลุ่มของคุณเสนอไว้แล้วในปีการศึกษานี้หรือไม่",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, it needs extra budget or space", th: "ใช่ ต้องขอเพิ่มเติม" },
          next: "out-activity-special-approval",
        },
        {
          id: "no",
          label: {
            en: "No, it's within the plan we already submitted",
            th: "ไม่ใช่ อยู่ในแผนที่เสนอไว้แล้ว",
          },
          next: "out-activity-likely-fine",
        },
      ],
    },
    {
      kind: "question",
      id: "q-activity-oneoff-or-club",
      question: {
        en: "Are you planning a one-off activity, or trying to start something ongoing, like a new club or group?",
        th: "นี่เป็นกิจกรรมครั้งเดียว หรือคุณกำลังจะเริ่มสิ่งที่ทำต่อเนื่อง เช่น ชมรมหรือกลุ่มใหม่",
      },
      options: [
        {
          id: "oneoff",
          label: { en: "A one-off activity", th: "กิจกรรมครั้งเดียว" },
          next: "q-activity-oncampus",
        },
        {
          id: "ongoing",
          label: {
            en: "Starting an ongoing club or group",
            th: "เริ่มชมรมหรือกลุ่มที่ทำต่อเนื่อง",
          },
          // Hands off into the shared start-a-club check directly, rather
          // than a duplicate outcome that only links to it.
          next: "q-club-idea",
        },
      ],
    },
    {
      kind: "question",
      id: "q-activity-oncampus",
      question: {
        en: "Will it happen on Faculty premises (Tha Prachan or Rangsit), or off campus?",
        th: "กิจกรรมนี้จัดในพื้นที่คณะ (ท่าพระจันทร์หรือรังสิต) หรือจัดนอกสถานที่",
      },
      options: [
        {
          id: "oncampus",
          label: { en: "On campus", th: "ในคณะ" },
          next: "out-activity-ask-oncampus",
        },
        {
          id: "offcampus",
          label: { en: "Off campus", th: "นอกสถานที่" },
          next: "out-activity-ask-offcampus",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-activity-likely-fine",
      title: {
        en: "Likely fine under your group's existing plan, but check with your committee",
        th: "น่าจะไม่ต้องขออนุมัติเพิ่ม แต่ควรเช็กกับคณะกรรมการของกลุ่มก่อน",
      },
      summary: {
        en: "Activities carried out under an existing group's approved annual plan do not need separate sign-off for each event.",
        th: "กิจกรรมที่อยู่ในแผนงานประจำปีที่กลุ่มของคุณเสนอไว้แล้ว ไม่ต้องขออนุมัติแยกเป็นรายกิจกรรมอีก",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "BIRSA and Faculty activity groups prepare and submit an annual work plan, projects, and budget each year; activities inside that plan are already covered.",
            th: "BIRSA และกลุ่มกิจกรรมคณะต้องจัดทำและเสนอแผนงาน โครงการ และงบประมาณประจำปีไว้ล่วงหน้า กิจกรรมที่อยู่ในแผนนี้จึงไม่ต้องขออนุมัติซ้ำอีก",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "role", is: "officer" },
          text: {
            en: "As the committee member who prepared this plan, confirm the activity was actually listed when your group submitted it. If it wasn't, add it before you go ahead.",
            th: "ในฐานะกรรมการที่จัดทำแผนนี้เอง ตรวจสอบว่ากิจกรรมนี้ถูกระบุไว้ตั้งแต่ตอนที่กลุ่มเสนอแผนแล้วจริง ถ้ายังไม่ได้ระบุ ให้เพิ่มเข้าไปก่อนดำเนินการ",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "If it still needs a room, use the SATU booking system and attach the request form (แบบฟอร์มขอความอนุเคราะห์). This is separate from budget or plan approval.",
            th: "ถ้ายังต้องใช้ห้อง ให้จองผ่านระบบจองห้อง SATU พร้อมแนบแบบฟอร์มขอความอนุเคราะห์ ขั้นตอนนี้แยกจากการขออนุมัติงบประมาณหรือแผนงาน",
          },
        },
      ],
      actions: [
        {
          label: { en: "Ask BIRSA if you're not sure", th: "ถ้าไม่แน่ใจ ติดต่อ BIRSA" },
          href: "/contact",
        },
        {
          label: { en: "SATU booking system", th: "ระบบจองห้อง SATU" },
          href: "https://sa.tu.ac.th/oth/SATU_booking/MENU_booking/",
          external: true,
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
      contactCategory: "question",
    },
    {
      kind: "outcome",
      id: "out-activity-special-approval",
      title: {
        en: "Get sign-off for the extra budget or space first",
        th: "ต้องขออนุมัติงบประมาณหรือสถานที่เพิ่มเติมก่อน",
      },
      summary: {
        en: "Spending outside your group's approved budget needs the Faculty's approval before you go ahead; this is a formal step, not just a courtesy.",
        th: "การใช้จ่ายนอกเหนือจากงบประมาณที่อนุมัติไว้แล้ว ต้องได้รับความเห็นชอบจากคณะก่อนดำเนินการ ไม่ใช่แค่แจ้งให้ทราบ",
      },
      owner: {
        en: "The Faculty decides. Your group's committee raises it with the Faculty, through BIRSA or the PSC as relevant.",
        th: "คณะเป็นผู้พิจารณา คณะกรรมการของกลุ่มคุณเป็นผู้นำเรื่องเสนอต่อคณะ ผ่าน BIRSA หรือ กนศ.ร. แล้วแต่กรณี",
      },
      body: [
        {
          kind: "paragraph",
          when: { fact: "role", is: "officer" },
          text: {
            en: "As a committee member, raise this with the Faculty yourself, through BIRSA or the PSC as relevant, before you book anything or spend money.",
            th: "ในฐานะกรรมการ ให้คุณนำเรื่องเสนอต่อคณะเอง ผ่าน BIRSA หรือ กนศ.ร. แล้วแต่กรณี ก่อนที่จะจองสถานที่หรือใช้จ่ายเงินใด ๆ",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "role", is: "student" },
          text: {
            en: "Ask your group's committee to raise this with the Faculty before anything is booked or any money is spent.",
            th: "ให้คุณแจ้งคณะกรรมการของกลุ่มให้นำเรื่องเสนอต่อคณะ ก่อนที่จะจองสถานที่หรือใช้จ่ายเงินใด ๆ",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "Once approved, book a room in the student activity building or the gym through the SATU booking system and attach the request form (แบบฟอร์มขอความอนุเคราะห์).",
            th: "เมื่อได้รับความเห็นชอบแล้ว จองห้องในอาคารกิจกรรมนักศึกษาหรือโรงยิมผ่านระบบจองห้อง SATU พร้อมแนบแบบฟอร์มขอความอนุเคราะห์",
          },
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
        {
          label: { en: "SATU booking system", th: "ระบบจองห้อง SATU" },
          href: "https://sa.tu.ac.th/oth/SATU_booking/MENU_booking/",
          external: true,
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
      contactCategory: "question",
    },
    {
      kind: "outcome",
      id: "out-activity-ask-oncampus",
      title: {
        en: "Ask BIRSA or the Faculty office before you go ahead",
        th: "ติดต่อ BIRSA หรือสำนักงานคณะก่อนดำเนินการ",
      },
      summary: {
        en: "We do not have a clear-cut rule on file for a one-off activity that is not run by an existing body, even when it's on campus. Ask BIRSA or the Faculty office before you go ahead.",
        th: "สำหรับกิจกรรมครั้งเดียวที่ไม่มีองค์กรที่เป็นทางการรองรับ แม้จะจัดในคณะ เราไม่มีระเบียบที่ระบุขั้นตอนไว้ชัดเจน สอบถาม BIRSA หรือสำนักงานคณะก่อนดำเนินการ",
      },
      owner: {
        en: "The Faculty office decides. BIRSA can help you find a group to run it under.",
        th: "สำนักงานคณะเป็นผู้ตัดสิน BIRSA ช่วยหากลุ่มที่พร้อมรองรับกิจกรรมนี้ให้ได้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "BIRSA or your คกร. (year cohort committee) can help you find a group to run it under, or point you to the right office at the Faculty.",
            th: "BIRSA หรือ คกร. ของรุ่นคุณ ช่วยหากลุ่มที่พร้อมรองรับกิจกรรมนี้ให้ได้ หรือช่วยแนะนำว่าต้องติดต่อฝ่ายไหนของคณะ",
          },
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      related: [
        {
          label: { en: "The regulations we hold", th: "ระเบียบที่เรารวบรวมไว้" },
          href: "/activity/regulations",
        },
      ],
      contactCategory: "question",
    },
    {
      kind: "outcome",
      id: "out-activity-ask-offcampus",
      title: {
        en: "Ask before you go ahead, since off-campus needs extra care",
        th: "สอบถามก่อนดำเนินการ กิจกรรมนอกสถานที่ต้องระวังเป็นพิเศษ",
      },
      summary: {
        en: "We do not have a clear-cut rule on file for an unaffiliated one-off activity, and off-campus trips add real questions around safety, transport, and who's responsible if something goes wrong. Ask BIRSA or the Faculty office first.",
        th: "สำหรับกิจกรรมครั้งเดียวที่ไม่มีองค์กรรองรับ เราไม่มีระเบียบที่ระบุขั้นตอนไว้ชัดเจน และการจัดนอกสถานที่ยังมีเรื่องความปลอดภัย การเดินทาง และผู้รับผิดชอบหากเกิดเหตุ ควรสอบถาม BIRSA หรือสำนักงานคณะก่อน",
      },
      owner: {
        en: "The Faculty office decides. BIRSA can help you find a group to run it under.",
        th: "สำนักงานคณะเป็นผู้ตัดสิน BIRSA ช่วยหากลุ่มที่พร้อมรองรับกิจกรรมนี้ให้ได้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "This matters even more for anything involving travel, an overnight stay, or activities with any physical risk.",
            th: "ยิ่งสำคัญมากขึ้นถ้ากิจกรรมมีการเดินทาง ค้างคืน หรือมีความเสี่ยงทางร่างกาย",
          },
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      contactCategory: "question",
    },

    /* ================================================================ */
    /* Topic 2: start-a-club-check                                       */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-club-idea",
      question: {
        en: "Is there something you want to do together that no existing club already covers?",
        th: "มีสิ่งที่อยากทำร่วมกัน ที่ยังไม่มีชมรมไหนรองรับอยู่แล้วใช่ไหม",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, it's not covered yet", th: "ใช่ ยังไม่มีชมรมรองรับ" },
          next: "q-club-members",
        },
        {
          id: "no",
          label: {
            en: "Not sure / there might already be one",
            th: "ไม่แน่ใจ อาจจะมีอยู่แล้ว",
          },
          next: "out-club-join-existing",
        },
      ],
    },
    {
      kind: "question",
      id: "q-club-members",
      question: {
        en: "Do you already have at least a few other students (roughly 5 or more) who want to join in?",
        th: "ตอนนี้มีเพื่อนนักศึกษาคนอื่นที่อยากเข้าร่วมด้วยแล้วหรือยัง อย่างน้อยประมาณ 5 คน",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, roughly 5 or more", th: "ใช่ ประมาณ 5 คนขึ้นไป" },
          next: "q-club-committee",
        },
        { id: "no", label: { en: "Not yet", th: "ยังไม่มี" }, next: "out-club-find-people" },
      ],
    },
    {
      kind: "question",
      id: "q-club-committee",
      question: {
        en: "Could a few of you take on committee roles (like chair, secretary, or treasurer) to help run it?",
        th: "มีใครในกลุ่มพร้อมรับตำแหน่งกรรมการ เช่น ประธาน เลขานุการ หรือเหรัญญิก เพื่อช่วยดูแลชมรมไหม",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, we've got people for that", th: "มีคนพร้อมรับตำแหน่ง" },
          next: "q-club-scope",
        },
        { id: "no", label: { en: "Not yet", th: "ยังไม่มี" }, next: "out-club-need-committee" },
      ],
    },
    {
      kind: "question",
      id: "q-club-scope",
      question: {
        en: "Who is this mainly for: BIR programme students, the whole Faculty of Political Science, or students from any Faculty?",
        th: "ชมรมนี้เน้นสำหรับใคร นักศึกษาสาขา BIR ทั้งคณะรัฐศาสตร์ หรือนักศึกษาจากคณะไหนก็ได้",
      },
      options: [
        {
          id: "bir",
          label: { en: "Mainly BIR programme students", th: "เน้นนักศึกษาสาขา BIR" },
          next: "out-club-ready-bir",
        },
        {
          id: "faculty",
          label: {
            en: "Open to the whole Faculty of Political Science",
            th: "เปิดกว้างทั้งคณะรัฐศาสตร์",
          },
          next: "out-club-ready-faculty",
        },
        {
          id: "university",
          label: {
            en: "Open to students from any Faculty, university-wide",
            th: "เปิดกว้างสำหรับนักศึกษาคณะไหนก็ได้ ทั้งมหาวิทยาลัย",
          },
          next: "out-club-ready-university",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-club-join-existing",
      title: { en: "Check existing clubs first", th: "ลองดูชมรมที่มีอยู่ก่อน" },
      summary: {
        en: "If an existing club already covers this, joining it is usually quicker than starting a new one.",
        th: "ถ้ามีชมรมที่ตรงกับสิ่งที่อยากทำอยู่แล้ว การเข้าร่วมมักง่ายและเร็วกว่าการเริ่มใหม่",
      },
      actions: [{ label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" }, href: "/clubs" }],
    },
    {
      kind: "outcome",
      id: "out-club-find-people",
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
      contactCategory: "suggestion",
    },
    {
      kind: "outcome",
      id: "out-club-need-committee",
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
      id: "out-club-ready-bir",
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
          kind: "paragraph",
          text: {
            en: "BIRSA is responsible for student activities within the BIR programme, and approves this track itself; there is no separate petition or minimum member count to file with the Faculty or the university.",
            th: "BIRSA รับผิดชอบกิจกรรมนักศึกษาภายในสาขา BIR โดยตรง และเป็นผู้พิจารณาอนุมัติแนวทางนี้เอง ไม่ต้องยื่นคำร้องหรือมีจำนวนสมาชิกขั้นต่ำต่อคณะหรือมหาวิทยาลัยแยกต่างหาก",
          },
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
      id: "out-club-ready-faculty",
      title: {
        en: "You're ready: start with BIRSA, then formalise it with the Dean",
        th: "พร้อมแล้ว เริ่มคุยกับ BIRSA ก่อน แล้วยื่นเรื่องต่อคณบดี",
      },
      summary: {
        en: "Talk to BIRSA first. If you want it to become an official, faculty-wide activity group with its own budget, that formally needs 30 students of the Faculty of Political Science signing a petition for the Dean to consider and appoint.",
        th: "เริ่มคุยกับ BIRSA ก่อน แต่ถ้าต้องการให้เป็น “กลุ่มกิจกรรมคณะ” อย่างเป็นทางการที่มีงบประมาณของตัวเอง ต้องมีนักศึกษาคณะรัฐศาสตร์ไม่น้อยกว่า 30 คน ร่วมลงชื่อยื่นเรื่องให้คณบดีพิจารณาแต่งตั้ง",
      },
      owner: {
        en: "The Dean approves the formation of a Faculty activity group. BIRSA can help you get there.",
        th: "คณบดีเป็นผู้พิจารณาแต่งตั้งกลุ่มกิจกรรมคณะ BIRSA ช่วยเตรียมเรื่องนี้ให้ได้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "That's a separate, more formal step than the BIRSA on-ramp: a Faculty activity group needs at least 20 members and a 5-to-10-member committee, and only the Dean can approve its formation or dissolution.",
            th: "ขั้นตอนนี้เป็นคนละเรื่องกับการเริ่มผ่าน BIRSA และเป็นทางการมากกว่า กลุ่มกิจกรรมคณะต้องมีสมาชิกอย่างน้อย 20 คน มีคณะกรรมการ 5 ถึง 10 คน และการจัดตั้งหรือยุบเลิกทำได้โดยคำสั่งคณบดีเท่านั้น",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "role", is: "officer" },
          text: {
            en: "As a committee member yourself, you already know the shape of a group committee's duties; the group committee that runs this new group will need to submit its own annual work plan to the PSC once it's formed.",
            th: "ในฐานะที่คุณเป็นกรรมการอยู่แล้ว คงคุ้นเคยกับหน้าที่ของคณะกรรมการกลุ่ม เมื่อจัดตั้งแล้ว คณะกรรมการกลุ่มใหม่นี้ต้องเสนอแผนงานประจำปีของตัวเองต่อ กนศ.ร.",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "role", is: "student" },
          text: {
            en: "BIRSA can help you assess whether you need to take this step yet.",
            th: "BIRSA ช่วยดูได้ว่าตอนนี้จำเป็นต้องทำถึงขั้นตอนนี้แล้วหรือยัง",
          },
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
      id: "out-club-ready-university",
      title: {
        en: "You're ready: start with BIRSA, then register with TUSU",
        th: "พร้อมแล้ว เริ่มคุยกับ BIRSA ก่อน แล้วยื่นเรื่องต่อ อมธ.",
      },
      summary: {
        en: "Talk to BIRSA first. If you want it open to students from any Faculty, that's a University-wide student activity club (ชุมนุม), registered with the Thammasat University Student Union (TUSU), not the Faculty.",
        th: "เริ่มคุยกับ BIRSA ก่อน แต่ถ้าต้องการเปิดกว้างให้นักศึกษาคณะไหนก็ได้เข้าร่วม นั่นคือ “ชุมนุมกิจกรรมนักศึกษา” ระดับมหาวิทยาลัย ซึ่งจดทะเบียนกับองค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ (อมธ.) ไม่ใช่กับคณะ",
      },
      owner: {
        en: "The TUSU Executive Committee and the TUSC decide. BIRSA is not part of this approval chain.",
        th: "คณะกรรมการบริหารองค์การนักศึกษาและสภานักศึกษาเป็นผู้พิจารณา BIRSA ไม่ได้อยู่ในสายการอนุมัตินี้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "To form one, at least 50 undergraduate students from various Faculties sign a petition to the TUSU Executive Committee, together with the club's rules, the founding members' names, the first executive committee's names, and the minutes of the founding meeting.",
            th: "การก่อตั้งต้องมีนักศึกษาปริญญาตรีจากหลายคณะไม่น้อยกว่า 50 คน ยื่นคำร้องต่อคณะกรรมการบริหารองค์การนักศึกษา พร้อมระเบียบชุมนุม รายชื่อผู้ก่อตั้ง รายชื่อคณะกรรมการบริหารชุดแรก และรายงานการประชุมก่อตั้ง",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "The TUSU Executive Committee considers it first; if it approves, the Thammasat University Student Council (TUSC) approves next, and the TUSC then reports the result to the Rector to establish the club.",
            th: "คณะกรรมการบริหารองค์การนักศึกษาพิจารณาก่อน หากเห็นชอบจะเสนอต่อสภานักศึกษา (TUSC) เพื่อพิจารณาอนุมัติ แล้วสภานักศึกษาจึงรายงานผลต่ออธิการบดีเพื่อจัดตั้งชุมนุมต่อไป",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "A student may be a member of no more than 5 university-wide clubs at once, and each club's committee must hold an annual general meeting within 60 days before the end of the second semester.",
            th: "นักศึกษาคนหนึ่งเป็นสมาชิกชุมนุมได้ไม่เกิน 5 ชุมนุมพร้อมกัน และคณะกรรมการของแต่ละชุมนุมต้องจัดประชุมใหญ่ภายใน 60 วันก่อนปิดภาคการศึกษาที่สองของปีการศึกษา",
          },
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

    /* ================================================================ */
    /* Topic 3: borrow-equipment                                         */
    /*                                                                    */
    /* Three genuinely different services, per                            */
    /* app/[lang]/information-services/equipment-loan/page.tsx,           */
    /* .../directory/page.tsx, .../status/page.tsx, and                   */
    /* content/student-life/en/home/getting-involved.mdx: BIRSA's own     */
    /* catalogue (online, approved, collected from the BIRSA office),     */
    /* club-owned items (arranged directly with the club), and sports     */
    /* equipment (not BIRSA at all: the student's own faculty or the      */
    /* TUSU Tha Prachan room).                                            */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-equipment-kind",
      question: {
        en: "What do you need to borrow?",
        th: "คุณต้องการยืมอะไร",
      },
      hint: {
        en: "BIRSA's own catalogue, a specific club's equipment, and sports equipment are three separate services with different owners.",
        th: "อุปกรณ์ของ BIRSA เอง อุปกรณ์ของชมรมใดชมรมหนึ่ง และอุปกรณ์กีฬา เป็นบริการคนละส่วนกัน และมีเจ้าของต่างกัน",
      },
      options: [
        {
          id: "birsa",
          label: {
            en: "Something from BIRSA's own equipment catalogue (cameras, speakers, event gear)",
            th: "อุปกรณ์ในรายการของ BIRSA เอง เช่น กล้อง ลำโพง อุปกรณ์จัดกิจกรรม",
          },
          hint: {
            en: "Requested online, approved by BIRSA, collected from the BIRSA office.",
            th: "ส่งคำขอออนไลน์ รอ BIRSA อนุมัติ แล้วมารับที่สำนักงาน BIRSA",
          },
          next: "q-equipment-birsa-ready",
        },
        {
          id: "club",
          label: {
            en: "Equipment owned by a specific club",
            th: "อุปกรณ์ของชมรมใดชมรมหนึ่งโดยเฉพาะ",
          },
          hint: {
            en: "Arranged directly with that club, not through BIRSA.",
            th: "ติดต่อยืมกับชมรมนั้นโดยตรง ไม่ผ่าน BIRSA",
          },
          next: "out-equipment-club",
        },
        {
          id: "sports",
          label: {
            en: "General sports equipment",
            th: "อุปกรณ์กีฬาทั่วไป",
          },
          hint: {
            en: "Not BIRSA: your own faculty, or the TUSU Tha Prachan room.",
            th: "ไม่ใช่ BIRSA แต่เป็นคณะของตัวเอง หรือห้อง อมธ. ท่าพระจันทร์",
          },
          next: "out-equipment-sports",
        },
        {
          id: "check",
          label: {
            en: "Check or cancel a request I already sent to BIRSA",
            th: "ตรวจสอบหรือยกเลิกคำขอที่ส่งให้ BIRSA ไปแล้ว",
          },
          next: "out-equipment-check-existing",
        },
      ],
    },
    {
      kind: "question",
      id: "q-equipment-birsa-ready",
      question: {
        en: "Do you have your Thammasat student ID, your Thammasat student email, and the dates you need it, ready to fill in a request?",
        th: "คุณเตรียมรหัสนักศึกษา อีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ และวันที่ต้องการยืม พร้อมกรอกคำขอแล้วหรือยัง",
      },
      hint: {
        en: "Your student email must be @dome.tu.ac.th or @tu.ac.th. A short reason for borrowing is also asked, though it's optional.",
        th: "อีเมลนักศึกษาต้องเป็น @dome.tu.ac.th หรือ @tu.ac.th ระบบจะถามเหตุผลในการยืมด้วย แต่ข้อนี้ไม่บังคับ",
      },
      options: [
        {
          id: "yes",
          label: { en: "Yes, I have all of that", th: "ใช่ เตรียมครบแล้ว" },
          next: "out-equipment-birsa-request",
        },
        {
          id: "no",
          label: { en: "Not yet", th: "ยังไม่พร้อม" },
          next: "out-equipment-birsa-prepare",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-equipment-birsa-request",
      title: {
        en: "Send your request through BIRSA's equipment catalogue",
        th: "ส่งคำขอผ่านหน้ารายการอุปกรณ์ของ BIRSA",
      },
      summary: {
        en: "Pick the item, fill in the online request, and wait for BIRSA to email you the outcome. Each item has its own maximum loan length.",
        th: "เลือกอุปกรณ์ที่ต้องการ กรอกคำขอออนไลน์ แล้วรอ BIRSA แจ้งผลทางอีเมล อุปกรณ์แต่ละชิ้นมีระยะเวลายืมสูงสุดของตัวเอง",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Pick an item on the equipment loan page and check it's available for your dates.",
              th: "เลือกอุปกรณ์ในหน้ารายการยืมอุปกรณ์ และตรวจสอบว่าว่างในช่วงวันที่ต้องการ",
            },
            {
              en: "Fill in the request: your name, student ID, student email, dates, and (optionally) a reason.",
              th: "กรอกคำขอ ได้แก่ ชื่อ-นามสกุล รหัสนักศึกษา อีเมลนักศึกษา วันที่ยืม-คืน และเหตุผล (ไม่บังคับ)",
            },
            {
              en: "BIRSA reviews the request and emails you the outcome.",
              th: "BIRSA ตรวจสอบคำขอและแจ้งผลทางอีเมล",
            },
            {
              en: "Once approved, collect the item in person from the BIRSA office, and return it by the date you agreed to.",
              th: "เมื่ออนุมัติแล้ว มารับอุปกรณ์ที่สำนักงาน BIRSA ด้วยตนเอง และคืนตามวันที่ตกลงไว้",
            },
          ],
        },
      ],
      actions: [
        {
          label: { en: "Go to the equipment loan catalogue", th: "ไปหน้ารายการอุปกรณ์" },
          href: "/information-services/equipment-loan",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-equipment-birsa-prepare",
      title: {
        en: "Get these ready first, then come back",
        th: "เตรียมสิ่งเหล่านี้ก่อน แล้วค่อยกลับมา",
      },
      summary: {
        en: "A BIRSA equipment request needs your Thammasat student ID, your Thammasat student email, and the dates you want to collect and return the item.",
        th: "คำขอยืมอุปกรณ์ของ BIRSA ต้องใช้รหัสนักศึกษา อีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ และวันที่ต้องการรับและคืนอุปกรณ์",
      },
      body: [
        {
          kind: "steps",
          title: { en: "What you'll need", th: "สิ่งที่ต้องเตรียม" },
          items: [
            {
              en: "Your Thammasat University student ID",
              th: "รหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์",
            },
            {
              en: "Your Thammasat student email (@dome.tu.ac.th or @tu.ac.th)",
              th: "อีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ (@dome.tu.ac.th หรือ @tu.ac.th)",
            },
            {
              en: "The date you'll collect the item and the date you'll return it, within that item's maximum loan length",
              th: "วันที่จะมารับอุปกรณ์และวันที่จะคืน ภายในระยะเวลายืมสูงสุดของอุปกรณ์นั้น",
            },
          ],
        },
      ],
      actions: [
        {
          label: { en: "See what BIRSA has available", th: "ดูอุปกรณ์ที่ BIRSA มีให้ยืม" },
          href: "/information-services/equipment-loan",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-equipment-club",
      title: {
        en: "Borrow this directly from the club",
        th: "ยืมโดยตรงจากชมรม",
      },
      summary: {
        en: "Equipment owned by a club is not in BIRSA's online system. Find the club in the club equipment directory to see what it has and how to reach it.",
        th: "อุปกรณ์ที่เป็นของชมรมไม่ได้อยู่ในระบบออนไลน์ของ BIRSA ดูรายชื่อชมรมในทำเนียบอุปกรณ์ของชมรมเพื่อดูว่ามีอะไรบ้างและติดต่อได้อย่างไร",
      },
      owner: {
        en: "The club itself, not BIRSA. Arrange collection and return directly with them.",
        th: "ชมรมนั้นเอง ไม่ใช่ BIRSA ติดต่อนัดรับและคืนอุปกรณ์กับชมรมโดยตรง",
      },
      actions: [
        {
          label: { en: "Open the club equipment directory", th: "เปิดทำเนียบอุปกรณ์ของชมรม" },
          href: "/information-services/equipment-loan/directory",
        },
        { label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" }, href: "/clubs" },
      ],
    },
    {
      kind: "outcome",
      id: "out-equipment-sports",
      title: {
        en: "Borrow this from your faculty or TUSU Tha Prachan, not BIRSA",
        th: "ยืมได้ที่คณะของตัวเอง หรือ อมธ. ท่าพระจันทร์ ไม่ใช่ BIRSA",
      },
      summary: {
        en: "General sports equipment is not part of BIRSA's service. Borrow it from your own faculty, or from the TUSU Tha Prachan room on floor 2 of the student activity building.",
        th: "อุปกรณ์กีฬาทั่วไปไม่ได้อยู่ในความดูแลของ BIRSA ยืมได้ที่คณะของตัวเอง หรือที่ห้อง อมธ. ท่าพระจันทร์ ชั้น 2 อาคารกิจกรรมนักศึกษา",
      },
      owner: {
        en: "Your own faculty, or TUSU Tha Prachan (อมธ. ท่าพระจันทร์). Not BIRSA.",
        th: "คณะของตัวเอง หรือ อมธ. ท่าพระจันทร์ ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Bring your student card when you go to borrow it.",
            th: "อย่าลืมนำบัตรนักศึกษาไปด้วยเมื่อจะไปยืม",
          },
        },
      ],
      related: [
        {
          label: { en: "Getting involved", th: "การเข้าร่วมกิจกรรมนักศึกษา" },
          href: "/student-life/home/getting-involved",
          description: {
            en: "More on TUSU Tha Prachan and how student activities are organised.",
            th: "รายละเอียดเพิ่มเติมเกี่ยวกับ อมธ. ท่าพระจันทร์ และการจัดกิจกรรมนักศึกษา",
          },
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-equipment-check-existing",
      title: {
        en: "Check or cancel a BIRSA equipment request",
        th: "ตรวจสอบหรือยกเลิกคำขอยืมอุปกรณ์ของ BIRSA",
      },
      summary: {
        en: "Look up a request you already sent to BIRSA with your reference number and the student email you used. You can cancel it there if it's still pending.",
        th: "ค้นหาคำขอที่ส่งให้ BIRSA ไปแล้ว โดยใช้หมายเลขอ้างอิงและอีเมลนักศึกษาที่ใช้ตอนส่งคำขอ หากคำขอยังรอดำเนินการอยู่ สามารถยกเลิกได้จากหน้านี้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "This only covers requests made through BIRSA's own equipment catalogue, not club-owned equipment or sports equipment, which are arranged directly with the club or the faculty/TUSU.",
            th: "ใช้ได้เฉพาะคำขอที่ส่งผ่านรายการอุปกรณ์ของ BIRSA เท่านั้น ไม่รวมอุปกรณ์ของชมรมหรืออุปกรณ์กีฬา ซึ่งต้องติดต่อกับชมรมหรือคณะ/อมธ. โดยตรง",
          },
        },
      ],
      actions: [
        {
          label: { en: "Check a loan request", th: "ตรวจสอบคำขอยืม" },
          href: "/information-services/equipment-loan/status",
        },
      ],
    },
  ],
};
