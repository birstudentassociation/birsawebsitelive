import type { Bilingual, Row, Topic } from "@/lib/open-data";

// Meeting bodies, named once so the register and the count by body always
// use identical labels.
const body = {
  birsa: { en: "BIRSA", th: "BIRSA" },
  jobFair: { en: "Job Fair project team", th: "คณะทำงาน Job Fair" },
  psc: {
    en: "BIRSA and the faculty student committee",
    th: "BIRSA และคณะกรรมการนักศึกษาคณะ (กนศ.ร.)",
  },
  threeWay: {
    en: "Faculty student committee, TUSU and student council",
    th: "คณะกรรมการนักศึกษาคณะ องค์การนักศึกษา (อมธ.) และสภา",
  },
} satisfies Record<string, Bilingual>;

function meeting(
  date: string,
  who: Bilingual,
  typeEn: string,
  typeTh: string,
  start: string | null,
  end: string | null
): Row {
  return { date, body: who, type: { en: typeEn, th: typeTh }, start, end };
}

const register: Row[] = [
  meeting("2024-06-02", body.birsa, "Extraordinary meeting", "ประชุมวิสามัญ", "13:00", "14:00"),
  meeting(
    "2024-06-11",
    body.psc,
    "Joint extraordinary meeting 1 of 2024",
    "ประชุมวิสามัญร่วม ครั้งที่ 1/2567",
    "20:00",
    null
  ),
  meeting(
    "2024-06-14",
    body.threeWay,
    "1st ordinary meeting",
    "ประชุมสามัญ ครั้งที่ 1",
    "14:00",
    "15:00"
  ),
  meeting(
    "2024-06-14",
    body.birsa,
    "Annual planning meeting",
    "ประชุมวางแผนกิจกรรมรายปี",
    "19:00",
    "21:00"
  ),
  meeting(
    "2024-06-29",
    body.birsa,
    "Subcommittee selection",
    "ประชุมคัดเลือกอนุกรรมการ",
    "20:00",
    "20:30"
  ),
  meeting(
    "2024-07-04",
    body.jobFair,
    "Job Fair meeting 1",
    "ประชุม Job Fair ครั้งที่ 1",
    "20:00",
    "21:30"
  ),
  meeting(
    "2024-07-09",
    body.psc,
    "Discussion of the Tham Sing gathering",
    "ปรึกษาเรื่องรวมถ้ำสิงห์",
    null,
    null
  ),
  meeting("2024-09-08", body.jobFair, "Job Fair meeting", "ประชุม Job Fair", null, null),
];

const byBody: Row[] = [
  { body: body.birsa, meetings: 3 },
  { body: body.jobFair, meetings: 2 },
  { body: body.psc, meetings: 2 },
  { body: body.threeWay, meetings: 1 },
];

function decision(date: string, who: Bilingual, en: string, th: string): Row {
  return { date, body: who, decision: { en, th } };
}

const decisions: Row[] = [
  decision(
    "2024-06-02",
    body.birsa,
    "Members voted to hold the Tha Prachan and Rangsit bonding event in term 2, and to create a new BIR Discord server.",
    "ที่ประชุมลงมติให้จัดงานสานสัมพันธ์ท่าพระจันทร์และรังสิตในเทอม 2 และให้สร้างเซิร์ฟเวอร์ Discord ของ BIR ขึ้นใหม่"
  ),
  decision(
    "2024-06-02",
    body.birsa,
    "BIRSA planned to recruit 9 more subcommittee members in two rounds, the first by 20 June 2024.",
    "BIRSA วางแผนรับอนุกรรมการเพิ่ม 9 คน เป็นสองรอบ โดยรอบแรกภายในวันที่ 20 มิถุนายน 2567"
  ),
  decision(
    "2024-06-11",
    body.psc,
    "Singh Daeng Samphan was set for Sunday 4 August 2024, in three parts, ending at about 20:00.",
    "กำหนดจัดสิงห์แดงสัมพันธ์วันอาทิตย์ที่ 4 สิงหาคม 2567 แบ่งเป็นสามช่วง เสร็จประมาณ 20:00"
  ),
  decision(
    "2024-06-11",
    body.psc,
    "The bonding event expected 250 people and ฿60,000, with ฿40,000 from Rangsit and ฿20,000 from BIRSA. 19 people had answered BIRSA's interest form.",
    "งานสานสัมพันธ์คาดว่ามีผู้เข้าร่วม 250 คน และงบ 60,000 บาท เป็นส่วนของรังสิต 40,000 บาท และของ BIRSA 20,000 บาท มีผู้ตอบแบบสอบถามความสนใจของ BIRSA 19 คน"
  ),
  decision(
    "2024-06-14",
    body.birsa,
    "The Job Fair was set for about 13 September 2024 in room 103, and Party Night was proposed for 8 April 2025.",
    "กำหนดจัด Job Fair ประมาณวันที่ 13 กันยายน 2567 ที่ห้อง 103 และเสนอจัด Party Night วันที่ 8 เมษายน 2568"
  ),
  decision(
    "2024-06-14",
    body.birsa,
    "Valentine Day was left open, to be run only if BIRSA needed money. Shirt pre-orders were set for 12 to 19 July 2024.",
    "ยังไม่ตัดสินใจเรื่อง Valentine Day และจะจัดก็ต่อเมื่อ BIRSA ต้องการหารายได้ กำหนดรับพรีออเดอร์เสื้อวันที่ 12 ถึง 19 กรกฎาคม 2567"
  ),
  decision(
    "2024-06-14",
    body.birsa,
    "BIRSA held ฿4,000 from the previous committee and had 14 people available to staff the orientation.",
    "BIRSA มีเงินจากคณะกรรมการชุดก่อน 4,000 บาท และมีสมาชิก 14 คนสำหรับงานปฐมนิเทศ"
  ),
  decision(
    "2024-06-29",
    body.birsa,
    "The meeting accepted 4 of the 5 subcommittee applicants. The sports and health post was not confirmed.",
    "ที่ประชุมรับผู้สมัครอนุกรรมการ 4 จาก 5 คน ส่วนตำแหน่งฝ่ายกีฬาและสุขภาพยังไม่ยืนยัน"
  ),
  decision(
    "2024-07-09",
    body.psc,
    "BIRSA planned to send only 5 staff to the Tham Sing gathering, because of its work on Tha Prachan Games.",
    "BIRSA วางแผนส่งสต๊าฟไปรวมถ้ำสิงห์เพียง 5 คน เพราะต้องดูแลงานท่าพระจันทร์เกม"
  ),
  decision(
    "2024-09-08",
    body.jobFair,
    "The Job Fair workshop room (R405) was booked only from 14:00 to 16:00, which left little time to prepare.",
    "ห้องสัมมนาของ Job Fair (ร.405) จองไว้เพียง 14:00 ถึง 16:00 ทำให้มีเวลาเตรียมน้อย"
  ),
];

export const meetings: Topic = {
  slug: "meetings",
  title: {
    en: "How often did BIRSA meet in 2024 to 2025?",
    th: "BIRSA ประชุมบ่อยแค่ไหนในปีการศึกษา 2567",
  },
  summary: {
    en: "BIRSA has records of 8 meetings, all between June and September 2024, and none records who attended.",
    th: "BIRSA มีบันทึกการประชุม 8 ครั้ง ทั้งหมดอยู่ระหว่างมิถุนายนถึงกันยายน 2567 และไม่มีครั้งใดบันทึกผู้เข้าประชุม",
  },
  headlines: [
    {
      value: "8",
      label: { en: "Meetings with a record", th: "การประชุมที่มีบันทึก" },
      context: { en: "June to September 2024", th: "มิถุนายนถึงกันยายน 2567" },
    },
    {
      value: "0",
      label: { en: "Meetings with attendance recorded", th: "การประชุมที่บันทึกผู้เข้าประชุม" },
    },
  ],
  mainPoints: [
    {
      en: "BIRSA has minutes or agendas for 8 meetings, from 2 June to 8 September 2024.",
      th: "BIRSA มีรายงานหรือวาระการประชุม 8 ครั้ง ตั้งแต่ 2 มิถุนายน ถึง 8 กันยายน 2567",
    },
    {
      en: "7 of the 8 meetings were held between 2 June and 9 July 2024, while the year was being planned.",
      th: "7 จาก 8 ครั้งจัดระหว่าง 2 มิถุนายน ถึง 9 กรกฎาคม 2567 ซึ่งเป็นช่วงวางแผนประจำปี",
    },
    {
      en: "3 meetings were BIRSA's own and 2 were Job Fair project team meetings.",
      th: "3 ครั้งเป็นการประชุมของ BIRSA เองและ 2 ครั้งเป็นการประชุมคณะทำงาน Job Fair",
    },
    {
      en: "3 meetings were with other student bodies, 2 with the faculty student committee.",
      th: "3 ครั้งเป็นการประชุมกับองค์กรนักศึกษาอื่น โดย 2 ครั้งกับคณะกรรมการนักศึกษาคณะ",
    },
    {
      en: "No meeting record exists after 8 September 2024.",
      th: "ไม่มีบันทึกการประชุมหลังวันที่ 8 กันยายน 2567",
    },
  ],
  datasets: [
    {
      id: "register",
      title: {
        en: "Meetings with a record, 2024 to 2025",
        th: "การประชุมที่มีบันทึก ปี 2567 ถึง 2568",
      },
      summary: {
        en: "BIRSA has records of 8 meetings between 2 June and 8 September 2024, with start times for 6.",
        th: "BIRSA มีบันทึกการประชุม 8 ครั้ง ระหว่าง 2 มิถุนายน ถึง 8 กันยายน 2567 โดยมีเวลาเริ่มของ 6 ครั้ง",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "body", label: { en: "Meeting body", th: "ผู้ประชุม" }, kind: "text" },
        { key: "type", label: { en: "Type", th: "ประเภท" }, kind: "text" },
        { key: "start", label: { en: "Start", th: "เริ่ม" }, kind: "text" },
        { key: "end", label: { en: "End", th: "สิ้นสุด" }, kind: "text" },
      ],
      rows: register,
      notes: [
        {
          en: "No record gives the number present or absent, so attendance is not shown.",
          th: "ไม่มีบันทึกใดระบุจำนวนผู้เข้าประชุมหรือผู้ขาดประชุม จึงไม่แสดงข้อมูลการเข้าประชุม",
        },
        {
          en: "The 4 July Job Fair meeting is known from the activity timeline, which gives its time. It has no minutes.",
          th: "การประชุม Job Fair วันที่ 4 กรกฎาคม ทราบจากตารางกิจกรรมซึ่งระบุเวลาไว้ ไม่มีรายงานการประชุม",
        },
        {
          en: "A meeting of the Tham Sing universities and a second Job Fair meeting are undated, so they are not listed.",
          th: "การประชุมของมหาวิทยาลัยในรวมถ้ำสิงห์ และการประชุม Job Fair ครั้งที่ 2 ไม่ระบุวันที่ จึงไม่ได้ลงรายการ",
        },
      ],
      source: {
        en: "BIRSA meeting minutes and agendas, and the activity timeline",
        th: "รายงานและวาระการประชุมของ BIRSA และตารางกิจกรรม",
      },
      period: { en: "June to September 2024", th: "มิถุนายนถึงกันยายน 2567" },
    },
    {
      id: "meetings-by-body",
      title: { en: "Meetings by body", th: "จำนวนการประชุมแยกตามผู้ประชุม" },
      summary: {
        en: "BIRSA held 3 of its own meetings, 2 Job Fair team meetings and 3 meetings with other student bodies.",
        th: "BIRSA ประชุมกันเอง 3 ครั้ง ประชุมคณะทำงาน Job Fair 2 ครั้ง และประชุมกับองค์กรนักศึกษาอื่น 3 ครั้ง",
      },
      columns: [
        { key: "body", label: { en: "Meeting body", th: "ผู้ประชุม" }, kind: "text" },
        {
          key: "meetings",
          label: { en: "Meetings", th: "จำนวนครั้ง" },
          kind: "number",
          total: true,
        },
      ],
      rows: byBody,
      source: {
        en: "BIRSA meeting minutes and agendas",
        th: "รายงานและวาระการประชุมของ BIRSA",
      },
      period: { en: "June to September 2024", th: "มิถุนายนถึงกันยายน 2567" },
    },
    {
      id: "decisions",
      title: { en: "What the meetings decided", th: "การประชุมตัดสินใจอะไรไว้บ้าง" },
      summary: {
        en: "The meetings recorded 10 decisions or plans, mostly for events from August 2024 to April 2025.",
        th: "การประชุมบันทึกมติหรือแผน 10 รายการ ส่วนใหญ่เกี่ยวกับกิจกรรมตั้งแต่สิงหาคม 2567 ถึงเมษายน 2568",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "body", label: { en: "Meeting body", th: "ผู้ประชุม" }, kind: "text" },
        { key: "decision", label: { en: "Decision or plan", th: "มติหรือแผน" }, kind: "text" },
      ],
      rows: decisions,
      notes: [
        {
          en: "Only the two votes on 2 June 2024 are recorded as votes. The other rows are decisions and plans noted in the minutes.",
          th: "มีเพียงการลงคะแนนสองเรื่องวันที่ 2 มิถุนายน 2567 ที่บันทึกว่าเป็นการลงมติ ส่วนรายการอื่นเป็นการตัดสินใจและแผนที่จดไว้ในรายงาน",
        },
      ],
      source: {
        en: "BIRSA meeting minutes",
        th: "รายงานการประชุมของ BIRSA",
      },
      period: { en: "June to September 2024", th: "มิถุนายนถึงกันยายน 2567" },
    },
  ],
};
