import type { Bilingual, Row, Topic } from "@/lib/open-data";

const body = {
  general: { en: "BIRSA general meeting", th: "ประชุมใหญ่ BIRSA" },
  dean: { en: "BIRSA and the Dean", th: "BIRSA และคณบดี" },
  psc: {
    en: "BIRSA and the faculty student committee",
    th: "BIRSA และคณะกรรมการนักศึกษาคณะ",
  },
  staff: { en: "BIRSA and faculty staff", th: "BIRSA และเจ้าหน้าที่คณะ" },
} satisfies Record<string, Bilingual>;

const discord: Bilingual = { en: "Discord", th: "Discord" };
const zoom: Bilingual = { en: "Zoom", th: "Zoom" };
const line: Bilingual = { en: "LINE", th: "LINE" };

function meeting(
  date: string,
  who: Bilingual,
  where: Bilingual,
  start: string | null,
  end: string | null,
  present: number | null,
  absent: number | null
): Row {
  return { date, body: who, where, start, end, present, absent };
}

const register: Row[] = [
  meeting("2021-06-10", body.general, discord, "20:15", "21:20", null, 1),
  meeting("2021-07-16", body.dean, zoom, "16:30", "18:12", 18, 1),
  meeting("2021-08-14", body.psc, line, "13:00", null, null, 2),
  meeting("2021-10-22", body.general, discord, null, null, null, 2),
  meeting("2021-11-26", body.dean, zoom, "17:00", "18:12", null, 0),
  meeting(
    "2021-12-20",
    body.staff,
    { en: "Not recorded", th: "ไม่ระบุ" },
    "11:00",
    null,
    null,
    null
  ),
  meeting("2021-12-20", body.general, discord, "17:00", "17:46", null, 1),
  meeting("2022-01-04", body.staff, zoom, "14:00", "14:22", null, 3),
  meeting("2022-04-12", body.general, discord, "14:00", "14:14", null, 0),
];

const byBody: Row[] = [
  { body: body.general, meetings: 4 },
  { body: body.dean, meetings: 2 },
  { body: body.staff, meetings: 2 },
  { body: body.psc, meetings: 1 },
];

function decision(date: string, who: Bilingual, en: string, th: string): Row {
  return { date, body: who, decision: { en, th } };
}

const decisions: Row[] = [
  decision(
    "2021-06-10",
    body.general,
    "Agreed the topics to raise with the Dean, including exam dress, sanitary pads, welfare vending and left-handed desks.",
    "ตกลงเรื่องที่จะเสนอคณบดี ได้แก่ การแต่งกายเข้าสอบ ผ้าอนามัย ตู้สวัสดิการ และโต๊ะสำหรับคนถนัดซ้าย"
  ),
  decision(
    "2021-07-16",
    body.dean,
    "The Dean asked for a written proposal on sanitary pads and the welfare vending machine.",
    "คณบดีขอให้ทำใบหลักการเสนอเรื่องผ้าอนามัยและตู้สวัสดิการ"
  ),
  decision(
    "2021-08-14",
    body.psc,
    "Agreed to run the exam dress referendum together. BIRSA said at least half of eligible students would need to vote.",
    "ตกลงจัดประชามติเรื่องแต่งกายเข้าสอบร่วมกัน BIRSA ระบุว่าต้องมีผู้ลงคะแนนอย่างน้อยกึ่งหนึ่งของผู้มีสิทธิ"
  ),
  decision(
    "2021-10-22",
    body.general,
    "Voted 12 to 0 to join the YSDA coalition.",
    "ลงมติ 12 ต่อ 0 ให้ BIRSA เข้าร่วมภาคี YSDA"
  ),
  decision(
    "2021-11-26",
    body.dean,
    "The Dean said the referendum result was not binding, suggested more public discussion before a second referendum, and asked for a report of five pages or fewer by December.",
    "คณบดีกล่าวว่าผลประชามติไม่มีผลผูกพัน เสนอให้มีเวทีสาธารณะเพิ่มก่อนประชามติครั้งที่สอง และขอรายงานไม่เกิน 5 หน้าภายในเดือนธันวาคม"
  ),
  decision(
    "2021-12-20",
    body.general,
    "Agreed that the first-year cohort election should follow the Thai programme, with BIRSA running it.",
    "ตกลงให้การเลือกตั้งแกนรุ่นปีที่ 1 อิงแนวทางของภาคไทย โดย BIRSA เป็นผู้ดูแล"
  ),
  decision(
    "2022-01-04",
    body.staff,
    "Discussed holding the association election in late April, and whether to use the university system or an online form.",
    "หารือเรื่องจัดเลือกตั้งสโมสรปลายเดือนเมษายน และเลือกว่าจะใช้ระบบของมหาวิทยาลัยหรือแบบฟอร์มออนไลน์"
  ),
  decision(
    "2022-04-12",
    body.general,
    "Planned the handover to the next committee, cut committee seats from 15 to 13 by merging sports and clubs into activities, and noted sanitary pad costs could not be reimbursed.",
    "วางแผนส่งมอบงานให้คณะกรรมการชุดต่อไป ลดตำแหน่งกรรมการจาก 15 เป็น 13 โดยรวมฝ่ายกีฬาและชมรมเข้ากับฝ่ายกิจกรรม และบันทึกว่าเบิกค่าผ้าอนามัยไม่ได้"
  ),
];

export const meetings: Topic = {
  slug: "meetings",
  title: {
    en: "How often did BIRSA meet?",
    th: "BIRSA ประชุมกันบ่อยแค่ไหน",
  },
  summary: {
    en: "BIRSA has nine meeting records from June 2021 to April 2022, and four were its own general meetings.",
    th: "BIRSA มีบันทึกการประชุม 9 ครั้ง ตั้งแต่มิถุนายน 2564 ถึงเมษายน 2565 โดย 4 ครั้งเป็นการประชุมใหญ่ของ BIRSA เอง",
  },
  headlines: [
    {
      value: "9",
      label: { en: "Meeting records", th: "บันทึกการประชุม" },
      context: { en: "June 2021 to April 2022", th: "มิถุนายน 2564 ถึงเมษายน 2565" },
    },
    {
      value: "4",
      label: { en: "General meetings", th: "ประชุมใหญ่" },
    },
    {
      value: "2",
      label: { en: "Meetings with the Dean", th: "ประชุมกับคณบดี" },
    },
  ],
  mainPoints: [
    {
      en: "BIRSA has nine meeting records, from 10 June 2021 to 12 April 2022.",
      th: "BIRSA มีบันทึกการประชุม 9 ครั้ง ตั้งแต่ 10 มิถุนายน 2564 ถึง 12 เมษายน 2565",
    },
    {
      en: "Four were general meetings, two were with the Dean, two with faculty staff and one with the faculty student committee.",
      th: "เป็นประชุมใหญ่ 4 ครั้ง ประชุมกับคณบดี 2 ครั้ง กับเจ้าหน้าที่คณะ 2 ครั้ง และกับคณะกรรมการนักศึกษาคณะ 1 ครั้ง",
    },
    {
      en: "On 22 October 2021 BIRSA voted 12 to 0 to join the YSDA coalition.",
      th: "วันที่ 22 ตุลาคม 2564 BIRSA ลงมติ 12 ต่อ 0 ให้เข้าร่วมภาคี YSDA",
    },
    {
      en: "The Dean met BIRSA on 26 November 2021 and called the referendum result non-binding.",
      th: "คณบดีพบ BIRSA วันที่ 26 พฤศจิกายน 2564 และกล่าวว่าผลประชามติไม่มีผลผูกพัน",
    },
    {
      en: "Minutes record who was absent, not who was present, in all but one meeting.",
      th: "รายงานการประชุมบันทึกผู้ไม่มาประชุม ไม่ได้บันทึกผู้มา ยกเว้นหนึ่งครั้ง",
    },
  ],
  datasets: [
    {
      id: "meeting-register",
      title: { en: "Meetings recorded, 2021 to 2022", th: "การประชุมที่มีบันทึก ปี 2564 ถึง 2565" },
      summary: {
        en: "Nine meetings were recorded between 10 June 2021 and 12 April 2022, most online.",
        th: "มีการประชุมที่บันทึกไว้ 9 ครั้ง ระหว่าง 10 มิถุนายน 2564 ถึง 12 เมษายน 2565 ส่วนใหญ่จัดออนไลน์",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "body", label: { en: "Meeting", th: "การประชุม" }, kind: "text" },
        { key: "where", label: { en: "Held on", th: "ช่องทาง" }, kind: "text" },
        { key: "start", label: { en: "Start", th: "เริ่ม" }, kind: "text" },
        { key: "end", label: { en: "End", th: "สิ้นสุด" }, kind: "text" },
        {
          key: "present",
          label: { en: "Present (actual)", th: "ผู้เข้าประชุมจริง" },
          kind: "number",
        },
        {
          key: "absent",
          label: { en: "Absent (actual)", th: "ผู้ไม่มาประชุมจริง" },
          kind: "number",
        },
      ],
      rows: register,
      notes: [
        {
          en: "Minutes list who was absent, not who was present. Only the Dean meeting of 16 July 2021 lists attendees, 18 in all, and that count includes faculty staff.",
          th: "รายงานการประชุมบันทึกผู้ไม่มา ไม่ได้บันทึกผู้มา มีเพียงการประชุมกับคณบดีวันที่ 16 กรกฎาคม 2564 ที่ระบุผู้เข้าประชุมรวม 18 คน ซึ่งรวมเจ้าหน้าที่คณะ",
        },
        {
          en: "Absence counts are of people named as absent or excused. On 10 June 2021 the meeting had a quorum and one member could not join. On 22 October 2021, 2 members were excused and 12 voted.",
          th: "จำนวนผู้ไม่มาคือผู้ที่บันทึกชื่อว่าไม่มาหรือลาประชุม วันที่ 10 มิถุนายน 2564 ครบองค์ประชุมและมีสมาชิก 1 คนเข้าร่วมไม่ได้ วันที่ 22 ตุลาคม 2564 มีผู้ลา 2 คนและลงมติ 12 คน",
        },
        {
          en: "On 20 December 2021 the faculty staff meeting at 11:00 has notes only, and the later general meeting had one member absent until 17:20.",
          th: "การประชุมกับเจ้าหน้าที่คณะวันที่ 20 ธันวาคม 2564 เวลา 11:00 มีเพียงบันทึกย่อ ส่วนประชุมใหญ่รอบหลังมีสมาชิก 1 คนมาสาย โดยเข้าร่วมตั้งแต่ 17:20",
        },
      ],
      source: {
        en: "BIRSA meeting minutes",
        th: "รายงานการประชุมของ BIRSA",
      },
      period: { en: "June 2021 to April 2022", th: "มิถุนายน 2564 ถึงเมษายน 2565" },
    },
    {
      id: "meetings-by-body",
      title: { en: "Meetings recorded by type", th: "จำนวนการประชุมแยกตามประเภท" },
      summary: {
        en: "General meetings were the most common type, with 4 of the 9 recorded.",
        th: "ประชุมใหญ่พบมากที่สุด 4 ครั้ง จากที่บันทึกไว้ 9 ครั้ง",
      },
      columns: [
        { key: "body", label: { en: "Meeting", th: "การประชุม" }, kind: "text" },
        {
          key: "meetings",
          label: { en: "Meetings (actual)", th: "จำนวนครั้งจริง" },
          kind: "number",
          total: true,
        },
      ],
      declaredTotal: { meetings: 9 },
      rows: byBody,
      source: {
        en: "BIRSA meeting minutes",
        th: "รายงานการประชุมของ BIRSA",
      },
      period: { en: "June 2021 to April 2022", th: "มิถุนายน 2564 ถึงเมษายน 2565" },
    },
    {
      id: "decisions",
      title: { en: "Main decisions and discussions", th: "มติและประเด็นหลักจากการประชุม" },
      summary: {
        en: "Eight meetings are summarised here by their main decision or discussion, in date order.",
        th: "สรุปมติหรือประเด็นหลักของการประชุม 8 ครั้ง เรียงตามวันที่",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "body", label: { en: "Meeting", th: "การประชุม" }, kind: "text" },
        {
          key: "decision",
          label: { en: "Decision or discussion", th: "มติหรือประเด็น" },
          kind: "text",
        },
      ],
      rows: decisions,
      notes: [
        {
          en: "The 20 December 2021 faculty staff meeting is left out because its notes are mostly about a building services contract.",
          th: "การประชุมกับเจ้าหน้าที่คณะวันที่ 20 ธันวาคม 2564 ไม่ได้สรุปไว้ เพราะบันทึกส่วนใหญ่เป็นเรื่องสัญญาจ้างบริการอาคาร",
        },
      ],
      source: {
        en: "BIRSA meeting minutes",
        th: "รายงานการประชุมของ BIRSA",
      },
      period: { en: "June 2021 to April 2022", th: "มิถุนายน 2564 ถึงเมษายน 2565" },
    },
  ],
};
