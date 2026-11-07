import type { Bilingual, Row, Topic } from "@/lib/open-data";

const doneReport: Bilingual = { en: "Done, report on file", th: "เสร็จสิ้น มีรายงาน" };
const doneSheet: Bilingual = {
  en: "Marked done in the Master Sheet",
  th: "ระบุว่าเสร็จสิ้นใน Master Sheet",
};
const planned: Bilingual = {
  en: "Planned, no record it was held",
  th: "อยู่ในแผน ไม่มีบันทึกว่าจัดแล้ว",
};

const organisers: Bilingual = { en: "Organisers", th: "ทีมผู้จัด" };
const snacksFor: Bilingual = { en: "Snacks budgeted for", th: "จำนวนที่ตั้งค่าอาหารว่าง" };
const mealsFor: Bilingual = { en: "Snacks and dinner budgeted for", th: "จำนวนที่ตั้งค่าอาหาร" };

function project(
  name: Bilingual,
  date: string | null,
  people: number | null,
  basis: Bilingual | null,
  planBudget: number | null,
  laterBudget: number | null,
  status: Bilingual
): Row {
  return { project: name, date, people, basis, planBudget, laterBudget, status };
}

const same = (s: string): Bilingual => ({ en: s, th: s });

const projects: Row[] = [
  project(
    { en: "BIR orientation", th: "ปฐมนิเทศ BIR" },
    "2023-08-07",
    null,
    null,
    null,
    null,
    planned
  ),
  project(
    { en: "BIR pre-session", th: "Pre-session BIR" },
    "2023-08-10",
    null,
    null,
    null,
    null,
    planned
  ),
  project(same("Club Day"), "2023-08-21", 55, organisers, 9700, 9700, doneReport),
  project(
    { en: "Seminar on 91 years of democracy", th: "เสวนาวิชาการ 91 ปีของประชาธิปไตย" },
    "2023-10-28",
    45,
    { en: "Students, speakers and presenter", th: "นักศึกษา วิทยากร และพิธีกร" },
    10200,
    4920,
    doneReport
  ),
  project(
    { en: "Halloween Spooky Night", th: "Halloween Spooky Night" },
    "2023-10-31",
    30,
    organisers,
    3200,
    2889,
    doneReport
  ),
  project(
    { en: "Internship Talk", th: "Internship Talk" },
    "2023-11-05",
    null,
    null,
    null,
    null,
    doneSheet
  ),
  project(
    { en: "Chit Chat with Ajarn", th: "Chit Chat with Ajarn" },
    "2023-11-15",
    null,
    null,
    null,
    0,
    doneReport
  ),
  project(
    { en: "Job Fair and Informal Talk", th: "Job Fair และ Informal Talk" },
    "2023-11",
    60,
    mealsFor,
    11600,
    null,
    planned
  ),
  project(
    same("Tha Prachan Games 2024"),
    "2024-01-08",
    90,
    { en: "Players", th: "นักกีฬา" },
    null,
    35000,
    planned
  ),
  project(same("Peace Day"), "2024-02-09", 20, snacksFor, 4400, null, planned),
  project(
    { en: "Valentine, Talk and Health Checkup", th: "Valentine, Talk และ Health Checkup" },
    "2024-02-14",
    30,
    mealsFor,
    7400,
    null,
    planned
  ),
  project(
    { en: "Rights seminar on gender", th: "สัมมนาด้านสิทธิ หัวข้อเรื่องเพศ" },
    "2024-03",
    40,
    { en: "Maximum participants", th: "ผู้เข้าร่วมสูงสุด" },
    10200,
    7740,
    planned
  ),
  project(
    { en: "International Women's Day", th: "International Women's Day" },
    "2024-03",
    30,
    mealsFor,
    7400,
    null,
    planned
  ),
  project(same("Trivia Day"), "2024-03-14", null, null, null, null, planned),
  project(
    same("Debate"),
    "2024-04-04",
    50,
    { en: "Lunch budgeted for", th: "จำนวนที่ตั้งค่าอาหารกลางวัน" },
    14400,
    null,
    planned
  ),
  project(same("BIR Festival"), "2024-04", 20, mealsFor, 8600, null, planned),
  project(same("Polsci Inter Union 2024"), "2024-06", null, null, 5000, null, planned),
  project(
    { en: "BIR Merchandise", th: "BIR Merchandise" },
    null,
    null,
    null,
    null,
    null,
    doneSheet
  ),
  project(same("BIR Cortex"), null, null, null, null, null, doneSheet),
];

export const activities: Topic = {
  slug: "activities",
  title: {
    en: "What BIRSA ran during the year",
    th: "BIRSA จัดกิจกรรมอะไรบ้างในปีนี้",
  },
  summary: {
    en: "BIRSA's records list 19 projects for 2023 to 2024, and seven are marked done. None records how many people came.",
    th: "บันทึกของ BIRSA มี 19 โครงการในปีการศึกษา 2566 โดย 7 โครงการระบุว่าเสร็จสิ้น ไม่มีบันทึกจำนวนผู้เข้าร่วมจริง",
  },
  headlines: [
    {
      value: "19",
      label: { en: "Projects in the records", th: "โครงการในบันทึก" },
      context: { en: "June 2023 to June 2024", th: "มิถุนายน 2566 ถึงมิถุนายน 2567" },
    },
    {
      value: "7",
      label: { en: "Projects marked done", th: "โครงการที่ระบุว่าเสร็จสิ้น" },
      context: { en: "Four have a written report", th: "4 โครงการมีรายงาน" },
    },
    {
      value: "฿9,700",
      label: { en: "Approved for Club Day", th: "งบที่อนุมัติสำหรับ Club Day" },
    },
    {
      value: "36",
      label: {
        en: "First year students who answered the bus survey",
        th: "นักศึกษาปี 1 ที่ตอบแบบสอบถามรถบัส",
      },
    },
  ],
  mainPoints: [
    {
      en: "Seven of the 19 projects are marked done, and four of those have a written report.",
      th: "7 จาก 19 โครงการระบุว่าเสร็จสิ้น และ 4 โครงการในนั้นมีรายงานเป็นลายลักษณ์อักษร",
    },
    {
      en: "Club Day on 21 August 2023 was approved at ฿9,700 and budgeted for 55 organisers.",
      th: "Club Day วันที่ 21 สิงหาคม 2566 ได้รับอนุมัติงบ 9,700 บาท และตั้งงบสำหรับทีมผู้จัด 55 คน",
    },
    {
      en: "The seminar on 28 October 2023 planned for 45 people, including 4 speakers.",
      th: "งานเสวนาวันที่ 28 ตุลาคม 2566 วางแผนไว้ 45 คน รวมวิทยากร 4 คน",
    },
    {
      en: "Of 36 first year students who answered the bus survey, 16 wanted the faculty bus for 8 August 2023.",
      th: "จากนักศึกษาปี 1 จำนวน 36 คนที่ตอบแบบสอบถาม 16 คนต้องการใช้รถบัสของคณะในวันที่ 8 สิงหาคม 2566",
    },
    {
      en: "No project records an actual attendance figure. Reports mention low turnout for Chit Chat with Ajarn.",
      th: "ไม่มีโครงการใดบันทึกจำนวนผู้เข้าร่วมจริง รายงานของ Chit Chat with Ajarn ระบุว่ามีผู้เข้าร่วมน้อย",
    },
  ],
  datasets: [
    {
      id: "projects",
      title: { en: "Projects, 2023 to 2024", th: "โครงการ ปีการศึกษา 2566" },
      summary: {
        en: "BIRSA's records list 19 projects, with seven marked done and twelve planned with no record they were held.",
        th: "บันทึกของ BIRSA มี 19 โครงการ ระบุว่าเสร็จสิ้น 7 โครงการ และอยู่ในแผนโดยไม่มีบันทึกว่าจัดแล้ว 12 โครงการ",
      },
      columns: [
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        {
          key: "date",
          label: { en: "Date (planned or held)", th: "วันที่ (ตามแผนหรือจัดจริง)" },
          kind: "date",
        },
        { key: "people", label: { en: "People planned for", th: "จำนวนคนตามแผน" }, kind: "number" },
        {
          key: "basis",
          label: { en: "What the people figure counts", th: "จำนวนคนนับอะไร" },
          kind: "text",
        },
        {
          key: "planBudget",
          label: { en: "Budget in plan (baht, planned)", th: "งบในแผน (บาท, ตามแผน)" },
          kind: "money",
        },
        {
          key: "laterBudget",
          label: { en: "Later budget (baht, planned)", th: "งบที่ระบุภายหลัง (บาท, ตามแผน)" },
          kind: "money",
        },
        { key: "status", label: { en: "Status", th: "สถานะ" }, kind: "text" },
      ],
      rows: projects,
      notes: [
        {
          en: "The people figure is the number planned for, and it counts different things, as the next column shows. It is not attendance.",
          th: "จำนวนคนคือจำนวนที่วางแผนไว้ และนับสิ่งต่างกันตามคอลัมน์ถัดไป ไม่ใช่จำนวนผู้เข้าร่วมจริง",
        },
        {
          en: "Later budget is the amount on the project form, or for the Rights seminar the revised budget in its brief. Chit Chat with Ajarn asked for no funding. Club Day lines add up to ฿9,700 although the plan states ฿9,600.",
          th: "งบที่ระบุภายหลังคือจำนวนในแบบเสนอโครงการ ส่วนสัมมนาด้านสิทธิคืองบที่แก้ไขในเอกสารสรุปโครงการ Chit Chat with Ajarn ไม่ขอสนับสนุนงบ รายการย่อยของ Club Day รวมได้ 9,700 บาท แม้แผนระบุ 9,600 บาท",
        },
        {
          en: "The Rights seminar brief gives 8 March 2024, but the 13 March minutes show speakers still being confirmed and other minutes mention 29 March, so only the month is shown. The BIR Festival was first set for 24 March, then possibly 21 April 2024, so only the month is shown.",
          th: "เอกสารสรุปสัมมนาด้านสิทธิระบุวันที่ 8 มีนาคม 2567 แต่รายงานการประชุมวันที่ 13 มีนาคมแสดงว่ายังยืนยันวิทยากรอยู่ และรายงานอื่นกล่าวถึงวันที่ 29 มีนาคม จึงแสดงเฉพาะเดือน BIR Festival กำหนดไว้ก่อนเป็น 24 มีนาคม แล้วอาจเป็น 21 เมษายน 2567 จึงแสดงเฉพาะเดือน",
        },
        {
          en: "Only seven rows of the Master Sheet project tab were readable. Minutes of 26 February 2024 expect 100 to 200 people across three universities at the second Polsci Inter Union event.",
          th: "แท็บโครงการใน Master Sheet อ่านได้เพียง 7 แถว รายงานการประชุมวันที่ 26 กุมภาพันธ์ 2567 คาดว่างาน Polsci Inter Union ครั้งที่สองจะมีผู้เข้าร่วม 100 ถึง 200 คนจากสามมหาวิทยาลัย",
        },
      ],
      source: {
        en: "BIRSA project approval forms, project reports, Master Sheet, activity calendar, meeting minutes and budget plan",
        th: "แบบเสนอโครงการ รายงานโครงการ Master Sheet ปฏิทินกิจกรรม รายงานการประชุม และแผนงบประมาณของ BIRSA",
      },
      period: { en: "June 2023 to June 2024", th: "มิถุนายน 2566 ถึงมิถุนายน 2567" },
    },
    {
      id: "bus-survey",
      title: {
        en: "Bus survey for first year orientation",
        th: "แบบสอบถามรถบัสสำหรับปฐมนิเทศปี 1",
      },
      summary: {
        en: "36 first year students answered, and 14 wanted the faculty bus for 4 August and 16 for 8 August 2023.",
        th: "นักศึกษาปี 1 ตอบ 36 คน โดย 14 คนต้องการรถบัสของคณะวันที่ 4 สิงหาคม และ 16 คนวันที่ 8 สิงหาคม 2566",
      },
      columns: [
        { key: "choice", label: { en: "Travel choice", th: "ตัวเลือกการเดินทาง" }, kind: "text" },
        {
          key: "tu",
          label: { en: "TU Orientation, 4 Aug (students)", th: "ปฐมนิเทศ มธ. 4 ส.ค. (คน)" },
          kind: "number",
          total: true,
        },
        {
          key: "polsci",
          label: {
            en: "Polsci Orientation, 8 Aug (students)",
            th: "ปฐมนิเทศคณะรัฐศาสตร์ 8 ส.ค. (คน)",
          },
          kind: "number",
          total: true,
        },
      ],
      declaredTotal: { tu: 36, polsci: 36 },
      rows: [
        { choice: { en: "Travel by themselves", th: "เดินทางไปกลับเอง" }, tu: 21, polsci: 19 },
        {
          choice: { en: "Faculty bus both ways", th: "ใช้รถบัสของคณะไปและกลับ" },
          tu: 13,
          polsci: 16,
        },
        {
          choice: { en: "Faculty bus to Rangsit only", th: "ใช้รถบัสของคณะเฉพาะขาไปรังสิต" },
          tu: 1,
          polsci: 0,
        },
        {
          choice: {
            en: "Faculty bus back to Tha Prachan only",
            th: "ใช้รถบัสของคณะเฉพาะขากลับท่าพระจันทร์",
          },
          tu: 0,
          polsci: 0,
        },
        { choice: { en: "Not attending", th: "ไม่เข้าร่วม" }, tu: 1, polsci: 1 },
      ],
      notes: [
        {
          en: "The 36 respondents are first year students of intake 15 who chose to answer, so the figure is not the size of the intake. Only counts are published.",
          th: "ผู้ตอบ 36 คนคือนักศึกษาปี 1 รุ่น 15 ที่เลือกตอบ จึงไม่ใช่จำนวนนักศึกษาทั้งรุ่น เผยแพร่เฉพาะจำนวนรวม",
        },
      ],
      source: {
        en: "BIRSA summary report of the bus demand survey",
        th: "รายงานสรุปแบบสอบถามความต้องการใช้รถบัสของ BIRSA",
      },
      period: { en: "August 2023", th: "สิงหาคม 2566" },
    },
  ],
};
