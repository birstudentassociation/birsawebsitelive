import type { Bilingual, Row, Topic } from "@/lib/open-data";

// Meeting bodies, named once so the register, the count by body and the
// decisions log always use identical labels.
const body = {
  general: { en: "BIRSA general meeting", th: "ประชุมใหญ่ BIRSA" },
  communication: { en: "Communication team", th: "ฝ่ายสื่อสาร" },
  commercial: { en: "Commercial team", th: "ฝ่ายพาณิชย์" },
  classCommittees: {
    en: "BIRSA and class committees",
    th: "BIRSA และคณะกรรมการชั้นปี",
  },
  interpolsci: {
    en: "Interpolsci with partner universities",
    th: "Interpolsci กับมหาวิทยาลัยพันธมิตร",
  },
  psc: {
    en: "BIRSA and the faculty student committee",
    th: "BIRSA และคณะกรรมการนักศึกษาคณะ (กนศ.ร.)",
  },
  secretariat: { en: "Secretariat", th: "ฝ่ายเลขานุการ" },
  clubs: { en: "BIRSA and clubs", th: "BIRSA และชมรม" },
  tusu: { en: "TUSU and TPC", th: "TUSU และ TPC" },
  studentAffairs: { en: "Student Affairs team", th: "ฝ่ายกิจการนักศึกษา" },
  tpcGames: { en: "TPC Games working group", th: "คณะทำงาน TPC Games" },
  closed: { en: "Closed meeting on Interpolsci", th: "ประชุมปิดเรื่อง Interpolsci" },
  staff: { en: "BIRSA and faculty staff", th: "BIRSA และเจ้าหน้าที่คณะ" },
} satisfies Record<string, Bilingual>;

const ord = (n: number): Bilingual => ({
  en: n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`,
  th: `ครั้งที่ ${n}`,
});

const extraordinary: Bilingual = { en: "1st extraordinary", th: "วิสามัญ ครั้งที่ 1" };

function meeting(
  date: string | null,
  who: Bilingual,
  number: Bilingual | string | null,
  start: string | null,
  end: string | null,
  present: number | null,
  absent: number | null,
  items: number | null
): Row {
  return { date, body: who, number, start, end, present, absent, items };
}

const register: Row[] = [
  meeting("2025-05-29", body.general, null, null, null, 6, 5, null),
  meeting("2025-05-31", body.general, null, null, null, 7, 4, null),
  meeting("2025-06-02", body.psc, ord(1), "13:06", "15:05", 19, 2, 4),
  meeting("2025-06-04", body.clubs, "1/2025", "20:14", "22:01", 8, 3, 3),
  meeting("2025-06-10", body.general, ord(4), "20:10", "21:10", 9, 2, 3),
  meeting("2025-06-26", body.general, ord(5), null, null, 9, 2, 2),
  meeting("2025-07-07", body.clubs, "2/2025", "20:10", null, 7, 4, 0),
  meeting("2025-07-08", body.psc, ord(2), null, null, null, null, 4),
  meeting("2025-07-14", body.general, ord(5), "19:11", "20:51", 14, 4, 4),
  meeting("2025-07-19", body.classCommittees, ord(1), "19:11", "19:44", 6, 0, 2),
  meeting("2025-07-31", body.general, extraordinary, "20:00", "21:00", 8, 0, 4),
  meeting("2025-08", body.general, ord(6), "16:30", "17:39", 14, 2, 3),
  meeting("2025-08-22", body.classCommittees, ord(2), "15:33", "16:07", 10, 0, 2),
  meeting("2025-09-03", body.classCommittees, ord(4), "20:09", "20:22", 6, 1, 2),
  meeting("2025-09-04", body.general, ord(7), "16:41", "17:50", 17, 1, 1),
  meeting("2025-09-09", body.classCommittees, ord(5), "11:05", "12:05", 16, 0, 2),
  meeting("2025-09-09", body.tusu, ord(5), "17:07", null, 3, 0, 0),
  meeting("2025-09-09", body.tusu, ord(1), "17:20", "17:43", 2, 0, 1),
  meeting("2025-10-11", body.interpolsci, ord(1), "13:05", "14:44", 10, 0, 5),
  meeting("2025-10-11", body.interpolsci, ord(1), "13:08", null, 16, 0, 6),
  meeting("2025-10-17", body.general, ord(8), null, "20:58", 9, 2, 2),
  meeting("2025-10-21", body.psc, ord(4), "17:00", "17:39", 7, 0, 1),
  meeting("2025-11-02", body.interpolsci, ord(1), "13:10", "13:38", 16, 0, 2),
  meeting("2025-11-21", body.secretariat, ord(1), "20:31", "22:00", 3, 1, 4),
  meeting("2025-11-26", body.closed, ord(1), "20:12", "21:12", 6, 0, 2),
  meeting("2025-12-04", body.general, ord(9), "16:35", "18:05", 17, 3, 2),
  meeting("2025-12-08", body.tpcGames, ord(2), "20:01", "20:41", 7, 0, 4),
  meeting("2025-12-11", body.studentAffairs, ord(1), "14:08", "16:01", 8, 0, 8),
  meeting("2025-12-11", body.commercial, ord(1), "10:05", "11:27", 7, 0, 5),
  meeting("2025-12-11", body.communication, ord(1), "20:36", null, 7, 0, 7),
  meeting("2025-12-26", body.secretariat, ord(6), "21:09", "23:00", 4, 1, 5),
  meeting("2026-01-08", body.commercial, ord(2), "20:11", null, 6, 0, 1),
  meeting("2026-01-16", body.communication, ord(2), "20:15", "21:14", 7, 0, 6),
  meeting("2026-02-09", body.commercial, ord(3), "20:07", "21:23", 4, 0, 4),
  meeting("2026-02-28", body.commercial, ord(4), "19:20", "20:32", 5, 1, 1),
  meeting("2026-03-09", body.communication, ord(3), "20:05", "21:20", 7, 0, 1),
  meeting("2026-03-16", body.communication, ord(4), "20:40", "21:18", 5, 0, 1),
  meeting("2026-03-31", body.general, ord(10), "16:40", "18:57", 16, 4, 2),
  meeting("2026-04-01", body.communication, ord(5), null, "21:36", 5, 0, 4),
  meeting(null, body.commercial, null, null, null, 5, 0, 1),
  meeting(null, body.staff, null, null, null, null, null, 8),
];

const byBody: Row[] = [
  { body: body.general, meetings: 11 },
  { body: body.communication, meetings: 5 },
  { body: body.commercial, meetings: 5 },
  { body: body.classCommittees, meetings: 4 },
  { body: body.interpolsci, meetings: 3 },
  { body: body.psc, meetings: 3 },
  { body: body.secretariat, meetings: 2 },
  { body: body.clubs, meetings: 2 },
  { body: body.tusu, meetings: 2 },
  { body: body.studentAffairs, meetings: 1 },
  { body: body.tpcGames, meetings: 1 },
  { body: body.closed, meetings: 1 },
  { body: body.staff, meetings: 1 },
];

function decision(date: string, who: Bilingual, en: string, th: string): Row {
  return { date, body: who, decision: { en, th } };
}

const decisions: Row[] = [
  decision(
    "2025-06-04",
    body.clubs,
    "Clubs voted 8 to 0 to keep the right of one student to be president of several clubs at once.",
    "ชมรมลงมติ 8 ต่อ 0 ให้นักศึกษาคนเดียวเป็นประธานหลายชมรมได้พร้อมกันต่อไป"
  ),
  decision(
    "2025-06-04",
    body.clubs,
    "Clubs were to renew their founding applications by the end of July 2025, using a new form from BIRSA in June.",
    "ชมรมต้องต่ออายุใบสมัครก่อตั้งภายในสิ้นเดือนกรกฎาคม 2568 โดยใช้แบบฟอร์มใหม่ที่ BIRSA แจกในเดือนมิถุนายน"
  ),
  decision(
    "2025-06-10",
    body.general,
    "Subcommittee applications would run from 15 to 22 June 2025, with interviews on 23 to 25 June and results on 27 June.",
    "รับสมัครอนุกรรมการวันที่ 15 ถึง 22 มิถุนายน 2568 สัมภาษณ์วันที่ 23 ถึง 25 มิถุนายน และประกาศผลวันที่ 27 มิถุนายน"
  ),
  decision(
    "2025-06-10",
    body.general,
    "Club Day was set for 21 August 2025.",
    "กำหนดจัดวันชมรมในวันที่ 21 สิงหาคม 2568"
  ),
  decision(
    "2025-06-26",
    body.general,
    "The meeting approved the Rights Advocate to take up the role, with support from the Vice President.",
    "ที่ประชุมอนุมัติให้ผู้ดำรงตำแหน่งฝ่ายพิทักษ์สิทธิเริ่มทำหน้าที่ โดยมีรองนายกสโมสรช่วยสนับสนุน"
  ),
  decision(
    "2025-07-14",
    body.general,
    "BIR Orientation on 24 July 2025 was given a team, with slides due on 21 July and a run through on 23 July.",
    "มอบหมายทีมงานปฐมนิเทศ BIR วันที่ 24 กรกฎาคม 2568 โดยส่งสไลด์ภายในวันที่ 21 กรกฎาคม และซ้อมในวันที่ 23 กรกฎาคม"
  ),
  decision(
    "2025-07-19",
    body.classCommittees,
    "BIRSA was to prepare its changes to the student activities regulation by 7 August 2025.",
    "BIRSA ต้องเตรียมข้อเสนอแก้ไขระเบียบกิจกรรมนักศึกษาให้เสร็จภายในวันที่ 7 สิงหาคม 2568"
  ),
  decision(
    "2025-08",
    body.general,
    "A booth event at SWU School was approved, with three students to attend.",
    "อนุมัติให้ออกบูทที่โรงเรียน SWU โดยส่งนักศึกษา 3 คน"
  ),
  decision(
    "2025-09-04",
    body.general,
    "Open House staff recruitment was replanned, with the second round open from 10 to 14 September 2025 and interviews on 15 and 16 September.",
    "วางแผนการรับสมัครทีมงานโอเพนเฮาส์ใหม่ โดยรอบที่สองเปิดรับวันที่ 10 ถึง 14 กันยายน 2568 และสัมภาษณ์วันที่ 15 และ 16 กันยายน"
  ),
  decision(
    "2025-09-09",
    body.classCommittees,
    "The Open House working period was set from 20 September to 31 October 2025, with the event on 1 November.",
    "กำหนดช่วงทำงานโอเพนเฮาส์วันที่ 20 กันยายน ถึง 31 ตุลาคม 2568 และวันงานวันที่ 1 พฤศจิกายน"
  ),
  decision(
    "2025-10-17",
    body.general,
    "Halloween Night and Movie Day was set for 30 October 2025, with roles for the film, photo booth and supplies.",
    "กำหนดจัดคืนฮาโลวีนและวันฉายหนังวันที่ 30 ตุลาคม 2568 พร้อมมอบหมายคนเลือกหนัง ดูแลมุมถ่ายภาพ และจัดหาอุปกรณ์"
  ),
  decision(
    "2025-10-21",
    body.psc,
    "Both bodies recorded that the Singhadang Games and the Singhadang field trip could not continue, as they overlapped with other projects.",
    "ทั้งสองฝ่ายบันทึกว่ากิจกรรม Singhadang Games และทริปศึกษาดูงาน Singhadang ไม่สามารถจัดต่อได้ เพราะซ้ำซ้อนกับโครงการอื่น"
  ),
  decision(
    "2025-12-04",
    body.general,
    "The Job Fair was planned for Wednesday 14 January 2026.",
    "วางแผนจัดงานแนะแนวอาชีพ (Job Fair) วันพุธที่ 14 มกราคม 2569"
  ),
  decision(
    "2025-12-26",
    body.secretariat,
    "The Book Exhibition was recorded as cancelled, and the Commercial team noted the same on 8 January 2026.",
    "งานนิทรรศการหนังสือถูกบันทึกว่ายกเลิก และฝ่ายพาณิชย์บันทึกเช่นเดียวกันเมื่อวันที่ 8 มกราคม 2569"
  ),
  decision(
    "2025-12-26",
    body.secretariat,
    "Job Fair staff applications would run from 29 December 2025 to 4 January 2026.",
    "รับสมัครทีมงาน Job Fair วันที่ 29 ธันวาคม 2568 ถึง 4 มกราคม 2569"
  ),
  decision(
    "2026-01-08",
    body.commercial,
    "The Job Fair moved from 14 January to 28 January 2026.",
    "งาน Job Fair เลื่อนจากวันที่ 14 มกราคม เป็นวันที่ 28 มกราคม 2569"
  ),
  decision(
    "2026-02-09",
    body.commercial,
    "The Valentine flower sale was dropped.",
    "ยกเลิกการขายดอกไม้วันวาเลนไทน์"
  ),
  decision(
    "2026-02-28",
    body.commercial,
    "The notebook planned for the Job Fair was cancelled.",
    "ยกเลิกสมุดโน้ตที่วางแผนไว้สำหรับงาน Job Fair"
  ),
  decision(
    "2026-02-28",
    body.commercial,
    "The shirt order form was set to open from 2 to 16 March 2026.",
    "กำหนดเปิดแบบฟอร์มสั่งเสื้อวันที่ 2 ถึง 16 มีนาคม 2569"
  ),
  decision(
    "2026-03-09",
    body.communication,
    "The election was set for 2 April 2026, with unofficial results by 6 April and official results on 9 April.",
    "กำหนดเลือกตั้งวันที่ 2 เมษายน 2569 ประกาศผลไม่เป็นทางการภายในวันที่ 6 เมษายน และผลอย่างเป็นทางการวันที่ 9 เมษายน"
  ),
  decision(
    "2026-03-16",
    body.communication,
    "The candidates' policy statement session was set for 25 March 2026, from 12:00 to 13:00 in Room 103.",
    "กำหนดให้ผู้สมัครแถลงนโยบายวันที่ 25 มีนาคม 2569 เวลา 12:00 ถึง 13:00 ที่ห้อง 103"
  ),
  decision(
    "2026-03-31",
    body.general,
    "Officers were to hand over a manual for the next BIRSA committee by 9 April 2026.",
    "เจ้าหน้าที่ต้องส่งมอบคู่มือสำหรับคณะกรรมการ BIRSA ชุดถัดไปภายในวันที่ 9 เมษายน 2569"
  ),
  decision(
    "2026-04-01",
    body.communication,
    "The election QR code was to go live on social media at 09:00 on 2 April 2026.",
    "เผยแพร่คิวอาร์โค้ดการเลือกตั้งบนโซเชียลมีเดียเวลา 09:00 วันที่ 2 เมษายน 2569"
  ),
];

export const meetings: Topic = {
  slug: "meetings",
  title: {
    en: "How often BIRSA met and what it decided",
    th: "BIRSA ประชุมบ่อยแค่ไหนและตัดสินใจอะไรบ้าง",
  },
  summary: {
    en: "BIRSA recorded 41 meetings from May 2025 to April 2026, and 11 of them were general meetings.",
    th: "BIRSA มีบันทึกการประชุม 41 ครั้งระหว่างพฤษภาคม 2568 ถึงเมษายน 2569 และ 11 ครั้งเป็นการประชุมใหญ่",
  },
  headlines: [
    {
      value: "41",
      label: { en: "Recorded meetings", th: "การประชุมที่มีบันทึก" },
      context: {
        en: "29 May 2025 to 1 April 2026",
        th: "29 พฤษภาคม 2568 ถึง 1 เมษายน 2569",
      },
    },
    {
      value: "11",
      label: { en: "General meetings", th: "การประชุมใหญ่" },
      context: {
        en: "Including one extraordinary meeting",
        th: "รวมการประชุมวิสามัญ 1 ครั้ง",
      },
    },
    {
      value: "23",
      label: { en: "Decisions logged", th: "การตัดสินใจที่บันทึกไว้" },
    },
    {
      value: "9",
      label: {
        en: "People at a typical general meeting",
        th: "ผู้เข้าร่วมประชุมใหญ่โดยทั่วไป",
      },
      context: {
        en: "The middle figure, from 6 to 17",
        th: "ค่ากลาง โดยอยู่ระหว่าง 6 ถึง 17 คน",
      },
    },
  ],
  warning: {
    en: "Some numbered meetings have no minutes, so these figures count recorded meetings only.",
    th: "การประชุมบางครั้งที่มีเลขลำดับไม่มีรายงานการประชุม ตัวเลขเหล่านี้จึงนับเฉพาะการประชุมที่มีบันทึก",
  },
  mainPoints: [
    {
      en: "BIRSA has minutes for 41 meetings between 29 May 2025 and 1 April 2026.",
      th: "BIRSA มีรายงานการประชุม 41 ครั้งระหว่างวันที่ 29 พฤษภาคม 2568 ถึง 1 เมษายน 2569",
    },
    {
      en: "The general meeting met 11 times, including one extraordinary meeting on 31 July 2025.",
      th: "การประชุมใหญ่จัด 11 ครั้ง รวมการประชุมวิสามัญเมื่อวันที่ 31 กรกฎาคม 2568",
    },
    {
      en: "Between 6 and 17 people attended each general meeting, and the middle figure was 9.",
      th: "แต่ละครั้งของการประชุมใหญ่มีผู้เข้าร่วม 6 ถึง 17 คน และค่ากลางคือ 9 คน",
    },
    {
      en: "The Communication team and the Commercial team each met 5 times.",
      th: "ฝ่ายสื่อสารและฝ่ายพาณิชย์ประชุมฝ่ายละ 5 ครั้ง",
    },
    {
      en: "The Job Fair moved from 14 January to 28 January 2026, one of 23 decisions in the log.",
      th: "งาน Job Fair เลื่อนจากวันที่ 14 มกราคมเป็นวันที่ 28 มกราคม 2569 เป็น 1 ใน 23 การตัดสินใจในบันทึก",
    },
  ],
  chart: {
    datasetId: "meetings-by-body",
    labelKey: "body",
    valueKey: "meetings",
    title: {
      en: "The general meeting met most often, ahead of two teams",
      th: "การประชุมใหญ่จัดบ่อยที่สุด นำหน้าสองฝ่าย",
    },
    subtitle: {
      en: "Recorded meetings by body, 2025 to 2026",
      th: "จำนวนการประชุมที่มีบันทึก แยกตามหน่วย ปี 2568 ถึง 2569",
    },
    alt: {
      en: "A bar chart showing that the BIRSA general meeting met 11 times, the Communication and Commercial teams 5 times each, and the other bodies between 1 and 4 times.",
      th: "แผนภูมิแท่งแสดงว่าการประชุมใหญ่ BIRSA ประชุม 11 ครั้ง ฝ่ายสื่อสารและฝ่ายพาณิชย์ฝ่ายละ 5 ครั้ง และหน่วยอื่นประชุมระหว่าง 1 ถึง 4 ครั้ง",
    },
  },
  datasets: [
    {
      id: "meetings-register",
      title: {
        en: "All 41 recorded meetings by date",
        th: "การประชุมที่มีบันทึกทั้ง 41 ครั้ง เรียงตามวันที่",
      },
      summary: {
        en: "BIRSA held 41 recorded meetings, shown with attendance counts and the number of items for consideration.",
        th: "BIRSA มีการประชุมที่มีบันทึก 41 ครั้ง แสดงพร้อมจำนวนผู้เข้าประชุมและจำนวนวาระที่เสนอให้พิจารณา",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "body", label: { en: "Body", th: "หน่วยที่ประชุม" }, kind: "text" },
        { key: "number", label: { en: "Meeting number", th: "ครั้งที่" }, kind: "text" },
        { key: "start", label: { en: "Start", th: "เริ่ม" }, kind: "text" },
        { key: "end", label: { en: "End", th: "สิ้นสุด" }, kind: "text" },
        { key: "present", label: { en: "Present", th: "เข้าร่วม" }, kind: "number" },
        { key: "absent", label: { en: "Absent", th: "ไม่เข้าร่วม" }, kind: "number" },
        {
          key: "items",
          label: { en: "Items for consideration", th: "วาระเพื่อพิจารณา" },
          kind: "number",
        },
      ],
      rows: register,
      notes: [
        {
          en: "Present and absent are counts from the attendance lists, including people who arrived late. For the clubs meetings, BIRSA and each club count as one body. Names are not published.",
          th: "จำนวนผู้เข้าร่วมและไม่เข้าร่วมนับจากรายชื่อผู้เข้าประชุม รวมผู้ที่มาสาย ส่วนการประชุมกับชมรมนับ BIRSA และแต่ละชมรมเป็นหนึ่งหน่วย ไม่เผยแพร่รายชื่อ",
        },
        {
          en: "Items for consideration are the main items under matters for consideration. A blank means the minutes do not give the figure.",
          th: "วาระเพื่อพิจารณานับจากหัวข้อหลักใต้หมวดเรื่องเสนอให้พิจารณา ช่องว่างหมายความว่ารายงานไม่ระบุตัวเลข",
        },
        {
          en: "The 6th general meeting shows a month only, because its heading date conflicts with its content. Two meetings have no date. The 2nd Commercial and 2nd Communication headings had the wrong year or month and were corrected from their content.",
          th: "การประชุมใหญ่ครั้งที่ 6 แสดงเฉพาะเดือน เพราะวันที่ในหัวรายงานขัดกับเนื้อหา มี 2 การประชุมที่ไม่ระบุวันที่ และหัวรายงานของฝ่ายพาณิชย์ครั้งที่ 2 กับฝ่ายสื่อสารครั้งที่ 2 ระบุปีหรือเดือนผิด จึงแก้ตามเนื้อหา",
        },
        {
          en: "Some numbered meetings have no minutes. The Secretariat numbered to 6 and only the 1st and 6th are recorded. The faculty student committee and class committee series have no 3rd. The general meeting numbering repeats the 5th.",
          th: "การประชุมบางครั้งที่มีเลขลำดับไม่มีรายงาน ฝ่ายเลขานุการนับถึงครั้งที่ 6 แต่มีเฉพาะครั้งที่ 1 และ 6 ชุด กนศ.ร. และชุดคณะกรรมการชั้นปีไม่มีครั้งที่ 3 และการประชุมใหญ่ใช้เลขครั้งที่ 5 ซ้ำกัน",
        },
      ],
      source: {
        en: "BIRSA meeting minutes kept by the Secretariat, academic year 2025 to 2026.",
        th: "รายงานการประชุมของ BIRSA ที่ฝ่ายเลขานุการเก็บรักษา ปีการศึกษา 2568",
      },
      period: {
        en: "29 May 2025 to 1 April 2026",
        th: "29 พฤษภาคม 2568 ถึง 1 เมษายน 2569",
      },
    },
    {
      id: "meetings-by-body",
      title: {
        en: "General meeting met most, 11 of 41",
        th: "การประชุมใหญ่จัดมากที่สุด 11 จาก 41 ครั้ง",
      },
      summary: {
        en: "The general meeting met 11 times, more than any other body, out of 41 recorded meetings.",
        th: "การประชุมใหญ่จัด 11 ครั้ง มากกว่าหน่วยอื่น จากการประชุมที่มีบันทึกทั้งหมด 41 ครั้ง",
      },
      columns: [
        { key: "body", label: { en: "Body", th: "หน่วยที่ประชุม" }, kind: "text" },
        {
          key: "meetings",
          label: { en: "Meetings", th: "จำนวนการประชุม" },
          kind: "number",
          total: true,
        },
      ],
      rows: byBody,
      declaredTotal: { meetings: 41 },
      notes: [
        {
          en: "The five Commercial team meetings are in one document. The closed meeting and the TPC Games group are counted on their own.",
          th: "การประชุมฝ่ายพาณิชย์ 5 ครั้งอยู่ในเอกสารเดียวกัน ส่วนการประชุมปิดและคณะทำงาน TPC Games นับแยกต่างหาก",
        },
      ],
      source: {
        en: "BIRSA meeting minutes kept by the Secretariat, academic year 2025 to 2026.",
        th: "รายงานการประชุมของ BIRSA ที่ฝ่ายเลขานุการเก็บรักษา ปีการศึกษา 2568",
      },
      period: {
        en: "29 May 2025 to 1 April 2026",
        th: "29 พฤษภาคม 2568 ถึง 1 เมษายน 2569",
      },
    },
    {
      id: "decisions",
      title: {
        en: "Clear decisions from the minutes",
        th: "การตัดสินใจที่ชัดเจนจากรายงานการประชุม",
      },
      summary: {
        en: "The minutes record 23 clear decisions, from event dates to a clubs vote of 8 to 0.",
        th: "รายงานการประชุมบันทึกการตัดสินใจที่ชัดเจน 23 เรื่อง ตั้งแต่วันจัดงานจนถึงมติชมรม 8 ต่อ 0",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "body", label: { en: "Body", th: "หน่วยที่ประชุม" }, kind: "text" },
        { key: "decision", label: { en: "Decision", th: "การตัดสินใจ" }, kind: "text" },
      ],
      rows: decisions,
      notes: [
        {
          en: "Decisions come from matters for consideration and assignments. Only clear decisions are listed, without names.",
          th: "การตัดสินใจนำมาจากเรื่องเสนอให้พิจารณาและการมอบหมายงาน เลือกเฉพาะเรื่องที่ชัดเจน และไม่ใส่ชื่อบุคคล",
        },
        {
          en: "The later move of the Job Fair to 5 March 2026 is not in these minutes.",
          th: "การเลื่อนงาน Job Fair ต่อไปเป็นวันที่ 5 มีนาคม 2569 ไม่ปรากฏในรายงานการประชุมเหล่านี้",
        },
      ],
      source: {
        en: "BIRSA meeting minutes kept by the Secretariat, academic year 2025 to 2026.",
        th: "รายงานการประชุมของ BIRSA ที่ฝ่ายเลขานุการเก็บรักษา ปีการศึกษา 2568",
      },
      period: {
        en: "June 2025 to April 2026",
        th: "มิถุนายน 2568 ถึง เมษายน 2569",
      },
    },
  ],
};
