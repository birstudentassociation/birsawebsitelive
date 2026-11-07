import type { Bilingual, Topic } from "@/lib/open-data";

const year = (n: 1 | 2 | 3 | 4): Bilingual => ({
  en: ["First year", "Second year", "Third year", "Fourth year"][n - 1]!,
  th: `ชั้นปีที่ ${n}`,
});

export const votes: Topic = {
  slug: "votes",
  title: {
    en: "How many students voted in the exam dress referendum?",
    th: "นักศึกษาลงประชามติเรื่องการแต่งกายเข้าสอบกี่คน",
  },
  summary: {
    en: "506 of 1,391 eligible students cast a valid vote on 13 September 2021, and 480 of them agreed with the proposal.",
    th: "นักศึกษา 1,391 คนมีสิทธิลงประชามติเมื่อวันที่ 13 กันยายน 2564 มีบัตรที่ใช้ได้ 506 ใบ และ 480 ใบเห็นด้วยกับข้อเสนอ",
  },
  headlines: [
    {
      value: "506",
      label: { en: "Valid votes", th: "บัตรที่ใช้ได้" },
      context: { en: "From 514 submissions", th: "จากบัตรที่ส่งเข้ามา 514 ใบ" },
    },
    {
      value: "36.38%",
      label: {
        en: "Valid votes as a share of eligible students",
        th: "บัตรที่ใช้ได้ต่อผู้มีสิทธิ",
      },
      context: { en: "506 of 1,391", th: "506 จาก 1,391" },
    },
    {
      value: "94.86%",
      label: { en: "Agreed, of valid votes", th: "เห็นด้วย จากบัตรที่ใช้ได้" },
      context: { en: "480 of 506", th: "480 จาก 506" },
    },
    {
      value: "51.08%",
      label: { en: "Turnout in the first year", th: "ผู้ใช้สิทธิชั้นปีที่ 1" },
      context: { en: "The highest of the four year groups", th: "สูงที่สุดในสี่ชั้นปี" },
    },
  ],
  warning: {
    en: "Two totals are used here. Percentages of valid votes divide by 506. The written report divides by all 514 submissions. Each column says which one it uses.",
    th: "หน้านี้ใช้ฐานคำนวณสองแบบ ร้อยละของบัตรที่ใช้ได้หารด้วย 506 ส่วนรายงานสรุปหารด้วยบัตรที่ส่งเข้ามาทั้งหมด 514 ใบ แต่ละคอลัมน์ระบุว่าใช้ฐานใด",
  },
  mainPoints: [
    {
      en: "1,391 students were eligible to vote, and 514 submitted a vote on 13 September 2021.",
      th: "นักศึกษา 1,391 คนมีสิทธิลงประชามติ และมีผู้ส่งบัตรเข้ามา 514 ใบเมื่อวันที่ 13 กันยายน 2564",
    },
    {
      en: "After checking student numbers, 506 votes were valid and 8 were not.",
      th: "หลังตรวจเลขทะเบียนนักศึกษา มีบัตรที่ใช้ได้ 506 ใบ และใช้ไม่ได้ 8 ใบ",
    },
    {
      en: "Valid votes were 36.38% of eligible students. All 514 submissions were 36.95%.",
      th: "บัตรที่ใช้ได้คิดเป็นร้อยละ 36.38 ของผู้มีสิทธิ ส่วนบัตรที่ส่งทั้งหมด 514 ใบคิดเป็นร้อยละ 36.95",
    },
    {
      en: "Turnout was highest in the first year at 51.08% and lowest in the fourth year at 12.36%.",
      th: "ชั้นปีที่ 1 มีผู้ใช้สิทธิมากที่สุดร้อยละ 51.08 และชั้นปีที่ 4 น้อยที่สุดร้อยละ 12.36",
    },
    {
      en: "480 valid votes agreed with the proposal, which is 94.86% of valid votes or 93.39% of all 514 submissions.",
      th: "มี 480 เสียงเห็นด้วยกับข้อเสนอ เท่ากับร้อยละ 94.86 ของบัตรที่ใช้ได้ หรือร้อยละ 93.39 ของบัตรทั้งหมด 514 ใบ",
    },
    {
      en: "Disagree and abstain received 13 votes each.",
      th: "ไม่เห็นด้วยและงดออกเสียงได้ฝ่ายละ 13 เสียง",
    },
  ],
  chart: {
    datasetId: "referendum-result",
    labelKey: "choice",
    valueKey: "votes",
    title: {
      en: "Almost all votes agreed with the exam dress proposal",
      th: "เกือบทุกเสียงเห็นด้วยกับข้อเสนอเรื่องการแต่งกายเข้าสอบ",
    },
    subtitle: {
      en: "Votes by choice, 13 September 2021, including invalid votes",
      th: "จำนวนเสียงแยกตามตัวเลือก 13 กันยายน 2564 รวมบัตรเสีย",
    },
    alt: {
      en: "A bar chart showing that 480 votes agreed with the exam dress proposal, far above 13 votes each for disagree and abstain, and 8 invalid votes.",
      th: "แผนภูมิแท่งแสดงว่ามี 480 เสียงเห็นด้วยกับข้อเสนอเรื่องการแต่งกายเข้าสอบ สูงกว่าไม่เห็นด้วยและงดออกเสียงฝ่ายละ 13 เสียงมาก และมีบัตรเสีย 8 ใบ",
    },
  },
  datasets: [
    {
      id: "referendum-result",
      title: {
        en: "How the exam dress referendum was decided",
        th: "ผลการลงประชามติเรื่องการแต่งกายเข้าสอบ",
      },
      summary: {
        en: "480 of 514 submissions agreed with the proposal, 13 disagreed, 13 abstained and 8 were invalid.",
        th: "จากบัตรที่ส่งเข้ามา 514 ใบ มี 480 ใบเห็นด้วย 13 ใบไม่เห็นด้วย 13 ใบงดออกเสียง และ 8 ใบเป็นบัตรเสีย",
      },
      columns: [
        { key: "choice", label: { en: "Choice", th: "ตัวเลือก" }, kind: "text" },
        {
          key: "votes",
          label: { en: "Votes (actual)", th: "จำนวนเสียงจริง" },
          kind: "number",
          total: true,
        },
        {
          key: "shareValid",
          label: {
            en: "Share of the 506 valid votes (%)",
            th: "ร้อยละของบัตรที่ใช้ได้ 506 ใบ",
          },
          kind: "percent",
          decimals: 2,
        },
        {
          key: "shareAll",
          label: {
            en: "Share of all 514 submissions (%)",
            th: "ร้อยละของบัตรทั้งหมด 514 ใบ",
          },
          kind: "percent",
          decimals: 2,
        },
      ],
      declaredTotal: { votes: 514 },
      rows: [
        {
          choice: { en: "Agree with the proposal", th: "เห็นด้วยกับข้อเสนอ" },
          votes: 480,
          shareValid: 94.86,
          shareAll: 93.39,
        },
        {
          choice: { en: "Disagree with the proposal", th: "ไม่เห็นด้วยกับข้อเสนอ" },
          votes: 13,
          shareValid: 2.57,
          shareAll: 2.53,
        },
        {
          choice: { en: "Abstain", th: "งดออกเสียง" },
          votes: 13,
          shareValid: 2.57,
          shareAll: 2.53,
        },
        {
          choice: {
            en: "Invalid (student number not matched)",
            th: "บัตรเสีย (เลขทะเบียนไม่ตรง)",
          },
          votes: 8,
          shareValid: null,
          shareAll: 1.56,
        },
      ],
      notes: [
        {
          en: "The proposal was that students may wear what they choose to exams, with no petition to the invigilator. The 8 invalid votes are not part of the 506, so they have no share of valid votes.",
          th: "ข้อเสนอคือให้นักศึกษาแต่งกายเข้าสอบได้ตามต้องการ โดยไม่ต้องเขียนใบคำร้องต่อผู้คุมสอบ บัตรเสีย 8 ใบไม่รวมอยู่ใน 506 ใบ จึงไม่มีร้อยละเทียบกับบัตรที่ใช้ได้",
        },
        {
          en: "The written report gives 93.39%, 2.53%, 2.53% and 1.56%, which divide by 514. The vote count sheet gives 94.86%, 2.57% and 2.57%, which divide by 506. Both are shown.",
          th: "รายงานสรุปใช้ร้อยละ 93.39, 2.53, 2.53 และ 1.56 ซึ่งหารด้วย 514 ส่วนตารางนับคะแนนใช้ร้อยละ 94.86, 2.57 และ 2.57 ซึ่งหารด้วย 506 หน้านี้แสดงทั้งสองแบบ",
        },
        {
          en: "Before student numbers were checked, the count was 488 agree, 13 disagree and 13 abstain. All 8 invalid votes were therefore among the agree votes.",
          th: "ก่อนตรวจเลขทะเบียน นับได้เห็นด้วย 488 ไม่เห็นด้วย 13 และงดออกเสียง 13 บัตรเสียทั้ง 8 ใบจึงอยู่ในกลุ่มเห็นด้วย",
        },
      ],
      source: {
        en: "BIRSA's vote count sheet and its written summary report on the exam dress consultation",
        th: "ตารางนับคะแนนของ BIRSA และรายงานสรุปการรับฟังความคิดเห็นเรื่องการแต่งกายเข้าสอบ",
      },
      period: {
        en: "13 September 2021, 08:30 to 18:00",
        th: "13 กันยายน 2564 เวลา 08:30 ถึง 18:00",
      },
    },
    {
      id: "referendum-turnout-by-year",
      title: {
        en: "Turnout in the exam dress referendum by year group",
        th: "ผู้ใช้สิทธิลงประชามติแยกตามชั้นปี",
      },
      summary: {
        en: "Turnout of valid votes ranged from 51.08% in the first year to 12.36% in the fourth year, and was 36.38% overall.",
        th: "ผู้ใช้สิทธิที่บัตรใช้ได้มีตั้งแต่ร้อยละ 51.08 ในชั้นปีที่ 1 ถึงร้อยละ 12.36 ในชั้นปีที่ 4 และร้อยละ 36.38 โดยรวม",
      },
      columns: [
        { key: "group", label: { en: "Year group", th: "ชั้นปี" }, kind: "text" },
        {
          key: "eligible",
          label: { en: "Eligible students", th: "ผู้มีสิทธิ" },
          kind: "number",
          total: true,
        },
        {
          key: "submitted",
          label: { en: "Votes submitted (actual)", th: "บัตรที่ส่งเข้ามาจริง" },
          kind: "number",
          total: true,
        },
        {
          key: "valid",
          label: { en: "Valid votes (actual)", th: "บัตรที่ใช้ได้จริง" },
          kind: "number",
          total: true,
        },
        {
          key: "turnout",
          label: {
            en: "Valid votes as a share of eligible students (%)",
            th: "บัตรที่ใช้ได้ต่อผู้มีสิทธิ (ร้อยละ)",
          },
          kind: "percent",
          decimals: 2,
        },
      ],
      declaredTotal: { eligible: 1391, submitted: 514, valid: 506 },
      rows: [
        { group: year(1), eligible: 370, submitted: 191, valid: 189, turnout: 51.08 },
        { group: year(2), eligible: 344, submitted: 144, valid: 142, turnout: 41.28 },
        { group: year(3), eligible: 321, submitted: 135, valid: 131, turnout: 40.81 },
        { group: year(4), eligible: 356, submitted: 44, valid: 44, turnout: 12.36 },
      ],
      notes: [
        {
          en: "Turnout in the last column is valid votes divided by eligible students for that year group, so it uses the 506 valid votes and not the 514 submissions.",
          th: "ร้อยละในคอลัมน์สุดท้ายคือบัตรที่ใช้ได้หารด้วยผู้มีสิทธิของชั้นปีนั้น จึงใช้บัตรที่ใช้ได้ 506 ใบ ไม่ใช่บัตรที่ส่งเข้ามา 514 ใบ",
        },
        {
          en: "Overall, 506 valid votes are 36.38% of 1,391 eligible students. All 514 submissions are 36.95%.",
          th: "โดยรวม บัตรที่ใช้ได้ 506 ใบคิดเป็นร้อยละ 36.38 ของผู้มีสิทธิ 1,391 คน ส่วนบัตรที่ส่งทั้งหมด 514 ใบคิดเป็นร้อยละ 36.95",
        },
        {
          en: "The eligible students were those studying for a bachelor degree in the Faculty of Political Science, in the regular and BIR programmes. Year groups follow the vote count sheet.",
          th: "ผู้มีสิทธิคือนักศึกษาระดับปริญญาตรีของคณะรัฐศาสตร์ ทั้งภาคปกติและโครงการ BIR แบ่งชั้นปีตามตารางนับคะแนน",
        },
      ],
      source: {
        en: "BIRSA's vote count sheet, with turnout recalculated from its counts",
        th: "ตารางนับคะแนนของ BIRSA โดยคำนวณร้อยละใหม่จากตัวเลขในตาราง",
      },
      period: { en: "13 September 2021", th: "13 กันยายน 2564" },
    },
    {
      id: "election-timetable",
      title: {
        en: "Timetable set for the April 2022 association election",
        th: "กำหนดการเลือกตั้งสโมสรนักศึกษา เมษายน 2565",
      },
      summary: {
        en: "The election notice set online voting for 21 April 2022. BIRSA holds no vote count, turnout or candidate numbers for it.",
        th: "ประกาศเลือกตั้งกำหนดลงคะแนนออนไลน์วันที่ 21 เมษายน 2565 BIRSA ไม่มีคะแนน อัตราผู้ใช้สิทธิ หรือจำนวนผู้สมัครของการเลือกตั้งนี้",
      },
      columns: [
        { key: "step", label: { en: "Step", th: "ขั้นตอน" }, kind: "text" },
        { key: "date", label: { en: "Planned date", th: "วันที่กำหนด" }, kind: "date" },
      ],
      rows: [
        { step: { en: "Applications open", th: "เปิดรับสมัคร" }, date: "2022-03-21" },
        { step: { en: "Applications close", th: "ปิดรับสมัคร" }, date: "2022-04-08" },
        {
          step: {
            en: "List of eligible slates announced",
            th: "ประกาศรายชื่อผู้มีสิทธิสมัคร",
          },
          date: "2022-04-12",
        },
        {
          step: { en: "Live policy statements", th: "แถลงนโยบายผ่านการถ่ายทอดสด" },
          date: "2022-04-18",
        },
        {
          step: {
            en: "Online voting, 09:00 to 17:00",
            th: "ลงคะแนนออนไลน์ เวลา 09:00 ถึง 17:00",
          },
          date: "2022-04-21",
        },
      ],
      notes: [
        {
          en: "These are planned dates from the election notice. The minutes of 12 April 2022 expect a single slate, in which case students vote to approve or not approve it, and at least half of those voting must approve.",
          th: "วันที่เหล่านี้เป็นกำหนดการจากประกาศเลือกตั้ง รายงานการประชุมวันที่ 12 เมษายน 2565 คาดว่ามีผู้สมัครกลุ่มเดียว ซึ่งจะลงคะแนนรับรองหรือไม่รับรอง และต้องมีผู้รับรองไม่น้อยกว่ากึ่งหนึ่งของผู้มาใช้สิทธิ",
        },
        {
          en: "The notice writes some years in the wrong era by mistake. We read them as 2022, the year of its other dates.",
          th: "ประกาศพิมพ์ปีบางแห่งผิดพลาด เราอ่านเป็นปี 2565 ตามปีในวันที่อื่นของประกาศเดียวกัน",
        },
      ],
      source: {
        en: "The faculty notice on the 2022 association election, and BIRSA meeting minutes",
        th: "ประกาศคณะเรื่องการเลือกตั้งสโมสรนักศึกษา และรายงานการประชุมของ BIRSA",
      },
      period: { en: "March to April 2022", th: "มีนาคมถึงเมษายน 2565" },
    },
  ],
};
