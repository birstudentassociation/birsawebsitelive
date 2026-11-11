import { yearCell, type Bilingual, type Dataset, type TrendSection } from "@/lib/open-data";

/*
 * Five years side by side. Every figure here is taken from the yearly
 * editions under content/open-data/<year>/, which hold the sources, notes
 * and conflicts. Only comparisons the records can honestly support are drawn;
 * where a year holds nothing, the value is null and the chart says
 * "no record" rather than showing zero.
 */

const year = {
  y21: yearCell("2021-22"),
  y22: yearCell("2022-23"),
  y23: yearCell("2023-24"),
  y24: yearCell("2024-25"),
  y25: yearCell("2025-26"),
};

const yearColumn = {
  key: "year",
  label: { en: "Academic year", th: "ปีการศึกษา" },
  kind: "text",
} as const;

const allYears: Bilingual = {
  en: "2021 to 2022 through 2025 to 2026",
  th: "ปีการศึกษา 2564 ถึง 2568",
};
const editionsSource: Bilingual = {
  en: "BIRSA's working files for each year, as published in each year's open data",
  th: "เอกสารทำงานของ BIRSA ในแต่ละปี ตามที่เผยแพร่ในข้อมูลเปิดของปีนั้น",
};

export const trendsIntro: Bilingual[] = [
  {
    en: "Each year's committee kept different records, so not every figure exists for every year. The first section shows what each year holds. Where a year has no record, the charts say so and never show it as zero.",
    th: "คณะกรรมการแต่ละปีเก็บบันทึกไม่เหมือนกัน ตัวเลขบางตัวจึงไม่มีในทุกปี ส่วนแรกของหน้านี้แสดงว่าแต่ละปีมีข้อมูลอะไรบ้าง หากปีใดไม่มีบันทึก แผนภูมิจะบอกไว้ และจะไม่แสดงเป็นศูนย์",
  },
  {
    en: "Two records exist for one year only. In 2021 to 2022, 36.95% of eligible students took part in the exam dress referendum and 94.86% of valid votes agreed. In 2022 to 2023, four satisfaction surveys with 313 responses gave mean scores from 4.56 to 5.00 out of 5. Both are in full in those years' figures.",
    th: "มีข้อมูลสองชุดที่มีเพียงปีเดียว ในปีการศึกษา 2564 นักศึกษาที่มีสิทธิ์ร้อยละ 36.95 ร่วมลงประชามติเรื่องชุดสอบ และร้อยละ 94.86 ของบัตรดีเห็นด้วย ในปีการศึกษา 2565 แบบประเมินความพึงพอใจสี่ชุด รวม 313 คำตอบ ได้คะแนนเฉลี่ย 4.56 ถึง 5.00 จาก 5 ดูรายละเอียดทั้งหมดได้ในข้อมูลของปีนั้น",
  },
];

// ---------------------------------------------------------------------------
// 1. What each year holds
// ---------------------------------------------------------------------------

const HELD: Bilingual = { en: "Held", th: "มี" };
const PART: Bilingual = { en: "Partly held", th: "มีบางส่วน" };
const NONE: Bilingual = { en: "Not held", th: "ไม่มี" };

const yearColumns = (["y21", "y22", "y23", "y24", "y25"] as const).map((key) => ({
  key,
  label: year[key],
  kind: "text" as const,
}));

const coverage: Dataset = {
  id: "what-each-year-holds",
  title: { en: "Records held for each year", th: "บันทึกที่มีในแต่ละปี" },
  summary: {
    en: "Every year holds a budget plan, but no year holds a full account of what was spent.",
    th: "ทุกปีมีแผนงบประมาณ แต่ไม่มีปีใดมีบัญชีรายจ่ายจริงครบถ้วน",
  },
  columns: [{ key: "record", label: { en: "Record", th: "บันทึก" }, kind: "text" }, ...yearColumns],
  rows: [
    {
      record: { en: "Planned budget", th: "แผนงบประมาณ" },
      ...{ y21: HELD, y22: HELD, y23: HELD, y24: HELD, y25: HELD },
    },
    {
      record: { en: "Actual spending", th: "รายจ่ายจริง" },
      ...{ y21: NONE, y22: NONE, y23: NONE, y24: NONE, y25: PART },
    },
    {
      record: { en: "Event attendance", th: "จำนวนผู้เข้าร่วมกิจกรรมจริง" },
      ...{ y21: PART, y22: PART, y23: NONE, y24: NONE, y25: NONE },
    },
    {
      record: { en: "Satisfaction scores", th: "คะแนนความพึงพอใจ" },
      ...{ y21: NONE, y22: HELD, y23: NONE, y24: NONE, y25: NONE },
    },
    {
      record: { en: "Meeting records", th: "บันทึกการประชุม" },
      ...{ y21: HELD, y22: PART, y23: HELD, y24: PART, y25: HELD },
    },
    {
      record: { en: "Committee roles", th: "ตำแหน่งในคณะกรรมการ" },
      ...{ y21: PART, y22: NONE, y23: PART, y24: PART, y25: HELD },
    },
    {
      record: { en: "Vote results", th: "ผลการลงคะแนน" },
      ...{ y21: PART, y22: NONE, y23: NONE, y24: NONE, y25: NONE },
    },
    {
      record: { en: "Club register", th: "ทะเบียนชมรม" },
      ...{ y21: NONE, y22: HELD, y23: PART, y24: NONE, y25: HELD },
    },
  ],
  notes: [
    {
      en: "Actual spending in 2025 to 2026 is partly held because BIRSA's ledger records only June 2025 to March 2026.",
      th: "รายจ่ายจริงปีการศึกษา 2568 มีบางส่วน เพราะบัญชีของ BIRSA บันทึกไว้เพียงเดือนมิถุนายน 2568 ถึงมีนาคม 2569",
    },
    {
      en: "Vote results in 2021 to 2022 are partly held because the exam dress referendum result exists but the April 2022 election result does not.",
      th: "ผลการลงคะแนนปีการศึกษา 2564 มีบางส่วน เพราะมีผลประชามติเรื่องชุดสอบ แต่ไม่มีผลการเลือกตั้งเดือนเมษายน 2565",
    },
  ],
  source: editionsSource,
  period: allYears,
};

// ---------------------------------------------------------------------------
// 2. Planned budget
// ---------------------------------------------------------------------------

const money = (key: string, en: string, th: string, total = false) => ({
  key,
  label: { en, th },
  kind: "money" as const,
  ...(total ? { total } : {}),
});

const plannedBudget: Dataset = {
  id: "planned-budget",
  title: { en: "Planned budget by year", th: "งบประมาณตามแผนแยกตามปี" },
  summary: {
    en: "BIRSA's yearly budget plans ranged from ฿56,542 to ฿223,690, counted by their lines and without the common room.",
    th: "แผนงบประมาณรายปีของ BIRSA อยู่ระหว่าง 56,542 บาท ถึง 223,690 บาท นับตามรายการ และไม่รวมห้องพักนักศึกษา",
  },
  columns: [yearColumn, money("amount", "Planned budget (baht)", "งบประมาณตามแผน (บาท)")],
  rows: [
    { year: year.y21, amount: 209650 },
    { year: year.y22, amount: 223690 },
    { year: year.y23, amount: 111100 },
    { year: year.y24, amount: 141442 },
    { year: year.y25, amount: 56542 },
  ],
  notes: [
    {
      en: "Every figure is a plan or a request, not money received or spent.",
      th: "ตัวเลขทุกตัวเป็นแผนหรือคำขอ ไม่ใช่เงินที่ได้รับหรือใช้จริง",
    },
    {
      en: "Totals are the sum of each plan's lines. Three plans state a different total. 2021 to 2022 states ฿213,150, 2023 to 2024 states ฿156,000 and 2024 to 2025 states ฿124,137. Each year's money page explains why.",
      th: "ยอดรวมคือผลรวมของรายการในแต่ละแผน มีสามแผนที่ระบุยอดรวมต่างออกไป ปีการศึกษา 2564 ระบุ 213,150 บาท ปีการศึกษา 2566 ระบุ 156,000 บาท และปีการศึกษา 2567 ระบุ 124,137 บาท หน้าการเงินของแต่ละปีอธิบายเหตุผลไว้",
    },
    {
      en: "The common room is not a BIRSA project, so its lines are left out of every year.",
      th: "ห้องพักนักศึกษาไม่ใช่โครงการของ BIRSA จึงไม่นับรายการของห้องนี้ในทุกปี",
    },
  ],
  source: {
    en: "BIRSA's budget plan for each year, with 2021 to 2022 built from its welfare budget request and project plans",
    th: "แผนงบประมาณของ BIRSA ในแต่ละปี ส่วนปีการศึกษา 2564 รวมจากคำของบสวัสดิการและแผนโครงการ",
  },
  period: allYears,
};

const area = (en: string, th: string) => ({ en, th });
const AREAS = {
  activities: area("Student activities", "กิจกรรมนักศึกษา"),
  welfare: area("Rights and welfare", "สิทธิและสวัสดิการ"),
  academic: area("Academic", "วิชาการ"),
  running: area("Running costs", "ค่าใช้จ่ายดำเนินงาน"),
  other: area("Facilities and other", "สิ่งอำนวยความสะดวกและอื่น ๆ"),
};
const byArea: [keyof typeof AREAS, (number | null)[]][] = [
  ["activities", [38000, 76690, 57300, 104750, 56542]],
  ["welfare", [164500, 34700, 10200, 14800, 0]],
  ["academic", [7150, 17800, 24600, 90, 0]],
  ["running", [0, 30000, 19000, 19000, 0]],
  ["other", [0, 64500, 0, 2802, 0]],
];
const yearList = [year.y21, year.y22, year.y23, year.y24, year.y25];

const budgetByArea: Dataset = {
  id: "planned-budget-by-area",
  title: { en: "Planned budget by area and year", th: "งบประมาณตามแผนแยกตามด้านและปี" },
  summary: {
    en: "Welfare took ฿164,500 of the 2021 to 2022 plan; from 2022 to 2023 student activities took the largest share.",
    th: "สวัสดิการใช้งบ 164,500 บาท ในแผนปีการศึกษา 2564 ตั้งแต่ปีการศึกษา 2565 กิจกรรมนักศึกษาได้สัดส่วนมากที่สุด",
  },
  columns: [
    { key: "area", label: { en: "Area", th: "ด้าน" }, kind: "text" },
    yearColumn,
    money("amount", "Planned budget (baht)", "งบประมาณตามแผน (บาท)"),
  ],
  rows: byArea.flatMap(([key, values]) =>
    values.map((amount, i) => ({ area: AREAS[key], year: yearList[i]!, amount }))
  ),
  notes: [
    {
      en: "Areas follow each plan's own headings, grouped the same way every year. Tha Prachan Games counts as student activities. In 2022 to 2023, facilities and other is ฿33,500 of facilities and ฿31,000 for the Road Show school visits.",
      th: "การแบ่งด้านยึดหัวข้อในแผนของแต่ละปี และจัดกลุ่มแบบเดียวกันทุกปี ท่าพระจันทร์เกมส์นับเป็นกิจกรรมนักศึกษา ในปีการศึกษา 2565 สิ่งอำนวยความสะดวกและอื่น ๆ ประกอบด้วยสิ่งอำนวยความสะดวก 33,500 บาท และ Road Show ไปโรงเรียน 31,000 บาท",
    },
    {
      en: "The 2025 to 2026 plan lists student activities only, so the other areas show ฿0.",
      th: "แผนปีการศึกษา 2568 มีเพียงกิจกรรมนักศึกษา ด้านอื่นจึงเป็น 0 บาท",
    },
  ],
  source: plannedBudget.source,
  period: allYears,
};

// ---------------------------------------------------------------------------
// 3. Recurring events
// ---------------------------------------------------------------------------

const RAN: Bilingual = { en: "Held", th: "จัดแล้ว" };
const PLANNED: Bilingual = { en: "Planned, not confirmed", th: "มีแผน ไม่ยืนยันว่าจัด" };
const NO_RECORD: Bilingual = { en: "No record", th: "ไม่มีบันทึก" };

const ev = (
  en: string,
  th: string,
  cells: [Bilingual, Bilingual, Bilingual, Bilingual, Bilingual]
) => ({
  record: { en, th },
  y21: cells[0],
  y22: cells[1],
  y23: cells[2],
  y24: cells[3],
  y25: cells[4],
});

const recurringEvents: Dataset = {
  id: "recurring-events",
  title: { en: "Recurring events by year", th: "กิจกรรมที่จัดซ้ำในแต่ละปี" },
  summary: {
    en: "Club Day, Halloween and Meet Ajarn were held in 2023 to 2024 and again in 2025 to 2026.",
    th: "Club Day, Halloween และ Meet Ajarn จัดในปีการศึกษา 2566 และจัดอีกครั้งในปีการศึกษา 2568",
  },
  columns: [{ key: "record", label: { en: "Event", th: "กิจกรรม" }, kind: "text" }, ...yearColumns],
  rows: [
    ev("Orientation", "ปฐมนิเทศ", [NO_RECORD, PLANNED, PLANNED, RAN, RAN]),
    ev("Club Day", "Club Day", [NO_RECORD, NO_RECORD, RAN, NO_RECORD, RAN]),
    ev("Halloween", "Halloween", [NO_RECORD, NO_RECORD, RAN, NO_RECORD, RAN]),
    ev("Meet Ajarn or Chit Chat", "Meet Ajarn หรือ Chit Chat", [
      NO_RECORD,
      NO_RECORD,
      RAN,
      PLANNED,
      RAN,
    ]),
    ev("Open House", "Open House", [NO_RECORD, RAN, NO_RECORD, PLANNED, RAN]),
    ev("Job Fair", "Job Fair", [NO_RECORD, NO_RECORD, PLANNED, RAN, RAN]),
    ev("Academic seminar", "สัมมนาวิชาการ", [PLANNED, RAN, RAN, NO_RECORD, NO_RECORD]),
    ev("Sports day or games", "กีฬาสีหรือการแข่งขันกีฬา", [
      PLANNED,
      RAN,
      PLANNED,
      PLANNED,
      NO_RECORD,
    ]),
    ev("Polsci Inter Union", "Polsci Inter Union", [NO_RECORD, NO_RECORD, PLANNED, NO_RECORD, RAN]),
  ],
  notes: [
    {
      en: "Held means a report, a completed timeline entry or an attendance figure shows the event took place. Planned means only a plan or form is on file, so it may still have happened.",
      th: "จัดแล้ว หมายถึงมีรายงาน บันทึกว่าเสร็จสิ้น หรือจำนวนผู้เข้าร่วมที่แสดงว่ากิจกรรมเกิดขึ้นจริง มีแผน หมายถึงมีเพียงแผนหรือแบบเสนอโครงการ กิจกรรมจึงอาจจัดไปแล้วก็ได้",
    },
    {
      en: "Sports day or games covers the 2022 esports week, the 2022 Sports Day and Tha Prachan Games.",
      th: "กีฬาสีหรือการแข่งขันกีฬา รวมการแข่งขันอีสปอร์ตปี 2565 กีฬาสีปี 2565 และท่าพระจันทร์เกมส์",
    },
  ],
  source: editionsSource,
  period: allYears,
};

// ---------------------------------------------------------------------------
// 4. What recurring events asked for
// ---------------------------------------------------------------------------

const EVENTS = {
  openHouse: area("Open House", "Open House"),
  tpc: area("Tha Prachan Games", "ท่าพระจันทร์เกมส์"),
  seminar: area("Academic seminar", "สัมมนาวิชาการ"),
  jobFair: area("Job Fair", "Job Fair"),
  clubDay: area("Club Day", "Club Day"),
  halloween: area("Halloween", "Halloween"),
};
const asked: [keyof typeof EVENTS, (number | null)[]][] = [
  ["openHouse", [null, 16800, null, 26800, 32000]],
  ["tpc", [null, null, 35000, 35000, null]],
  ["seminar", [7150, 7350, 4920, null, null]],
  ["jobFair", [null, null, 11600, 3530, 2760]],
  ["clubDay", [null, null, 9700, null, 4200]],
  ["halloween", [null, null, 2889, null, 650]],
];

const eventBudgets: Dataset = {
  id: "event-budgets",
  title: { en: "Budget asked for by recurring event", th: "งบประมาณที่ขอสำหรับกิจกรรมที่จัดซ้ำ" },
  summary: {
    en: "Open House asked for ฿16,800 in 2022 to 2023 and ฿32,000 in 2025 to 2026, almost twice as much.",
    th: "Open House ของบ 16,800 บาท ในปีการศึกษา 2565 และ 32,000 บาท ในปีการศึกษา 2568 เกือบสองเท่า",
  },
  columns: [
    { key: "event", label: { en: "Event", th: "กิจกรรม" }, kind: "text" },
    yearColumn,
    money("amount", "Budget asked for (baht)", "งบประมาณที่ขอ (บาท)"),
  ],
  rows: asked.flatMap(([key, values]) =>
    values.flatMap((amount, i) =>
      amount === null ? [] : [{ event: EVENTS[key], year: yearList[i]!, amount }]
    )
  ),
  notes: [
    {
      en: "Amounts come from the event's project form where one exists, otherwise from the year's budget plan. They are requests, not spending.",
      th: "ตัวเลขมาจากแบบเสนอโครงการของกิจกรรมนั้นหากมี หากไม่มีจะใช้แผนงบประมาณของปีนั้น ตัวเลขเป็นคำขอ ไม่ใช่รายจ่ายจริง",
    },
    {
      en: "Open House 2024 to 2025 adds two forms, ฿8,800 for the talk and ฿18,000 for the booth. Job Fair 2023 to 2024 is the plan line for Job Fair and Informal Talk. The 2021 to 2022 seminar is the rights talk.",
      th: "Open House ปีการศึกษา 2567 รวมสองแบบเสนอ คือการบรรยาย 8,800 บาท และบูธ 18,000 บาท Job Fair ปีการศึกษา 2566 เป็นรายการในแผนสำหรับ Job Fair และ Informal Talk สัมมนาปีการศึกษา 2564 คือเสวนาด้านสิทธิ",
    },
  ],
  source: {
    en: "Project forms and budget plans for each year",
    th: "แบบเสนอโครงการและแผนงบประมาณของแต่ละปี",
  },
  period: allYears,
};

// ---------------------------------------------------------------------------
// 5. Meetings and clubs
// ---------------------------------------------------------------------------

const meetingRecords: Dataset = {
  id: "meeting-records",
  title: { en: "Meeting records held by year", th: "จำนวนบันทึกการประชุมแยกตามปี" },
  summary: {
    en: "BIRSA kept 43 meeting records in 2023 to 2024 and 41 in 2025 to 2026, against 7 to 9 in the other years.",
    th: "BIRSA เก็บบันทึกการประชุม 43 ครั้ง ในปีการศึกษา 2566 และ 41 ครั้ง ในปีการศึกษา 2568 ขณะที่ปีอื่นมี 7 ถึง 9 ครั้ง",
  },
  columns: [
    yearColumn,
    { key: "records", label: { en: "Meeting records", th: "บันทึกการประชุม" }, kind: "number" },
  ],
  rows: [
    { year: year.y21, records: 9 },
    { year: year.y22, records: 7 },
    { year: year.y23, records: 43 },
    { year: year.y24, records: 8 },
    { year: year.y25, records: 41 },
  ],
  notes: [
    {
      en: "This counts the records kept, not the meetings held. A year with few records may have met more often. 2023 to 2024 and 2025 to 2026 also recorded project team meetings.",
      th: "ตัวเลขนี้นับบันทึกที่เก็บไว้ ไม่ใช่จำนวนครั้งที่ประชุมจริง ปีที่มีบันทึกน้อยอาจประชุมบ่อยกว่านั้น ปีการศึกษา 2566 และ 2568 บันทึกการประชุมของทีมโครงการไว้ด้วย",
    },
    {
      en: "The 2024 to 2025 records stop in September 2024.",
      th: "บันทึกของปีการศึกษา 2567 สิ้นสุดในเดือนกันยายน 2567",
    },
  ],
  source: { en: "BIRSA's meeting minutes and notes", th: "รายงานและบันทึกการประชุมของ BIRSA" },
  period: allYears,
};

const clubs: Dataset = {
  id: "clubs",
  title: { en: "Clubs and groups registered by year", th: "จำนวนชมรมและกลุ่มที่ลงทะเบียนแยกตามปี" },
  summary: {
    en: "Registered clubs and groups rose from 4 in 2022 to 2023 to 12 in 2025 to 2026.",
    th: "ชมรมและกลุ่มที่ลงทะเบียนเพิ่มจาก 4 กลุ่ม ในปีการศึกษา 2565 เป็น 12 กลุ่ม ในปีการศึกษา 2568",
  },
  columns: [
    yearColumn,
    { key: "clubs", label: { en: "Clubs and groups", th: "ชมรมและกลุ่ม" }, kind: "number" },
  ],
  rows: [
    { year: year.y21, clubs: null },
    { year: year.y22, clubs: 4 },
    { year: year.y23, clubs: 8 },
    { year: year.y24, clubs: null },
    { year: year.y25, clubs: 12 },
  ],
  notes: [
    {
      en: "2023 to 2024 counts the clubs registered for Club Day. 2024 to 2025 names 10 groups in its files but holds no register, so no count is shown.",
      th: "ปีการศึกษา 2566 นับชมรมที่ลงทะเบียนออกบูธ Club Day ปีการศึกษา 2567 มีชื่อกลุ่ม 10 กลุ่มในเอกสาร แต่ไม่มีทะเบียน จึงไม่แสดงจำนวน",
    },
  ],
  source: {
    en: "Group registration forms, Club Day minutes and club registers",
    th: "แบบลงทะเบียนกลุ่ม รายงานการประชุม Club Day และทะเบียนชมรม",
  },
  period: allYears,
};

// ---------------------------------------------------------------------------
// Sections, in reading order
// ---------------------------------------------------------------------------

export const trends: TrendSection[] = [
  {
    id: "what-each-year-holds",
    title: { en: "What does each year's record hold?", th: "บันทึกของแต่ละปีมีอะไรบ้าง" },
    summary: coverage.summary,
    mainPoints: [
      {
        en: "All five years hold a budget plan, so plans can be compared across every year.",
        th: "ทั้งห้าปีมีแผนงบประมาณ จึงเปรียบเทียบแผนได้ครบทุกปี",
      },
      {
        en: "Only 2025 to 2026 records any actual spending, and only for 10 months.",
        th: "มีเพียงปีการศึกษา 2568 ที่บันทึกรายจ่ายจริง และบันทึกไว้เพียง 10 เดือน",
      },
      {
        en: "Satisfaction scores exist for 2022 to 2023 only, and vote results for 2021 to 2022 only.",
        th: "คะแนนความพึงพอใจมีเฉพาะปีการศึกษา 2565 และผลการลงคะแนนมีเฉพาะปีการศึกษา 2564",
      },
    ],
    chart: {
      kind: "matrix",
      legend: [
        { value: HELD, level: "full" },
        { value: PART, level: "partial" },
        { value: NONE, level: "none" },
      ],
      title: {
        en: "Budget plans are the only record every year holds",
        th: "แผนงบประมาณเป็นบันทึกเดียวที่มีครบทุกปี",
      },
      subtitle: {
        en: "Records held, by academic year, 2021 to 2022 through 2025 to 2026",
        th: "บันทึกที่มี แยกตามปีการศึกษา 2564 ถึง 2568",
      },
      alt: {
        en: "A grid showing that every year holds a budget plan, while actual spending, satisfaction scores and vote results are missing from most years.",
        th: "ตารางแสดงว่าทุกปีมีแผนงบประมาณ ขณะที่รายจ่ายจริง คะแนนความพึงพอใจ และผลการลงคะแนนไม่มีในปีส่วนใหญ่",
      },
    },
    dataset: coverage,
  },
  {
    id: "planned-budget",
    title: { en: "How much did BIRSA plan to spend?", th: "BIRSA วางแผนใช้เงินเท่าไร" },
    summary: plannedBudget.summary,
    mainPoints: [
      {
        en: "The largest plan was ฿223,690 in 2022 to 2023.",
        th: "แผนที่ใหญ่ที่สุดคือ 223,690 บาท ในปีการศึกษา 2565",
      },
      {
        en: "The 2025 to 2026 plan of ฿56,542 is the smallest, because it covers student activities only.",
        th: "แผนปีการศึกษา 2568 จำนวน 56,542 บาท เล็กที่สุด เพราะครอบคลุมเฉพาะกิจกรรมนักศึกษา",
      },
      {
        en: "Three of the five plans state a total that does not match their own lines.",
        th: "แผนสามในห้าปีระบุยอดรวมไม่ตรงกับผลรวมของรายการในแผนเอง",
      },
    ],
    chart: {
      kind: "columns",
      valueKey: "amount",
      title: {
        en: "Budget plans peaked in 2022 to 2023",
        th: "แผนงบประมาณสูงสุดในปีการศึกษา 2565",
      },
      subtitle: {
        en: "Planned budget in baht, by academic year, without the common room",
        th: "งบประมาณตามแผนเป็นบาท แยกตามปีการศึกษา ไม่รวมห้องพักนักศึกษา",
      },
      alt: {
        en: "A column chart showing that planned budgets rose to ฿223,690 in 2022 to 2023 and fell to ฿56,542 in 2025 to 2026.",
        th: "แผนภูมิแท่งแสดงว่างบประมาณตามแผนสูงขึ้นถึง 223,690 บาท ในปีการศึกษา 2565 และลดลงเหลือ 56,542 บาท ในปีการศึกษา 2568",
      },
    },
    dataset: plannedBudget,
    tile: {
      label: { en: "Planned budget", th: "งบประมาณตามแผน" },
      context: { en: "Student activities only", th: "เฉพาะกิจกรรมนักศึกษา" },
    },
  },
  {
    id: "planned-budget-by-area",
    title: { en: "What did the plans put money into?", th: "แผนงบประมาณให้เงินกับด้านใด" },
    summary: budgetByArea.summary,
    mainPoints: [
      {
        en: "In 2021 to 2022, the welfare request of ฿164,500 was 78% of the plan.",
        th: "ในปีการศึกษา 2564 คำของบสวัสดิการ 164,500 บาท คิดเป็นร้อยละ 78 ของแผน",
      },
      {
        en: "Student activities peaked at ฿104,750 in 2024 to 2025, including ฿35,000 for Tha Prachan Games.",
        th: "งบกิจกรรมนักศึกษาสูงสุด 104,750 บาท ในปีการศึกษา 2567 รวมท่าพระจันทร์เกมส์ 35,000 บาท",
      },
      {
        en: "Running costs were planned at ฿19,000 in both 2023 to 2024 and 2024 to 2025.",
        th: "ค่าใช้จ่ายดำเนินงานตามแผนเท่ากัน 19,000 บาท ทั้งปีการศึกษา 2566 และ 2567",
      },
    ],
    chart: {
      kind: "multiples",
      groupKey: "area",
      valueKey: "amount",
      title: {
        en: "Plans moved from welfare to student activities",
        th: "แผนงบประมาณเปลี่ยนจากสวัสดิการไปสู่กิจกรรมนักศึกษา",
      },
      subtitle: {
        en: "Planned budget in baht, by area and academic year, all on one scale",
        th: "งบประมาณตามแผนเป็นบาท แยกตามด้านและปีการศึกษา ใช้สเกลเดียวกันทุกแผง",
      },
      alt: {
        en: "Five small column charts showing that welfare dominated the 2021 to 2022 plan and student activities led every plan after it.",
        th: "แผนภูมิแท่งขนาดเล็กห้าแผงแสดงว่าสวัสดิการเป็นส่วนใหญ่ของแผนปีการศึกษา 2564 และกิจกรรมนักศึกษาเป็นส่วนใหญ่ในทุกแผนหลังจากนั้น",
      },
    },
    dataset: budgetByArea,
  },
  {
    id: "recurring-events",
    title: { en: "Which events came back each year?", th: "กิจกรรมใดกลับมาจัดทุกปี" },
    summary: recurringEvents.summary,
    mainPoints: [
      {
        en: "Orientation is the only event recorded as held in both 2024 to 2025 and 2025 to 2026.",
        th: "ปฐมนิเทศเป็นกิจกรรมเดียวที่บันทึกว่าจัดแล้วทั้งปีการศึกษา 2567 และ 2568",
      },
      {
        en: "Job Fair was planned in 2023 to 2024 and held in each of the two years after.",
        th: "Job Fair มีแผนในปีการศึกษา 2566 และจัดแล้วในสองปีถัดมา",
      },
      {
        en: "No event has a record in all five years.",
        th: "ไม่มีกิจกรรมใดมีบันทึกครบทั้งห้าปี",
      },
    ],
    chart: {
      kind: "matrix",
      legend: [
        { value: RAN, level: "full" },
        { value: PLANNED, level: "partial" },
        { value: NO_RECORD, level: "none" },
      ],
      title: {
        en: "Most recurring events have records in two or three years",
        th: "กิจกรรมที่จัดซ้ำส่วนใหญ่มีบันทึกเพียงสองหรือสามปี",
      },
      subtitle: {
        en: "Recurring events, by academic year, 2021 to 2022 through 2025 to 2026",
        th: "กิจกรรมที่จัดซ้ำ แยกตามปีการศึกษา 2564 ถึง 2568",
      },
      alt: {
        en: "A grid showing which of nine recurring events were held, only planned or not recorded in each of five years, with none recorded every year.",
        th: "ตารางแสดงว่ากิจกรรมที่จัดซ้ำเก้ากิจกรรมจัดแล้ว มีเพียงแผน หรือไม่มีบันทึกในแต่ละปี และไม่มีกิจกรรมใดมีบันทึกครบทุกปี",
      },
    },
    dataset: recurringEvents,
  },
  {
    id: "event-budgets",
    title: {
      en: "What did recurring events ask for?",
      th: "กิจกรรมที่จัดซ้ำของบประมาณเท่าไร",
    },
    summary: eventBudgets.summary,
    mainPoints: [
      {
        en: "Tha Prachan Games asked for ฿35,000 in both years it was planned.",
        th: "ท่าพระจันทร์เกมส์ของบ 35,000 บาท เท่ากันทั้งสองปีที่มีแผน",
      },
      {
        en: "Job Fair asked for less each year, from ฿11,600 in 2023 to 2024 to ฿2,760 in 2025 to 2026.",
        th: "Job Fair ของบน้อยลงทุกปี จาก 11,600 บาท ในปีการศึกษา 2566 เหลือ 2,760 บาท ในปีการศึกษา 2568",
      },
      {
        en: "Club Day asked for ฿9,700 in 2023 to 2024 and ฿4,200 in 2025 to 2026.",
        th: "Club Day ของบ 9,700 บาท ในปีการศึกษา 2566 และ 4,200 บาท ในปีการศึกษา 2568",
      },
    ],
    chart: {
      kind: "multiples",
      groupKey: "event",
      valueKey: "amount",
      title: {
        en: "Open House asks for more, Job Fair and Club Day for less",
        th: "Open House ขอมากขึ้น ส่วน Job Fair และ Club Day ขอน้อยลง",
      },
      subtitle: {
        en: "Budget asked for in baht, by event and academic year, all on one scale",
        th: "งบประมาณที่ขอเป็นบาท แยกตามกิจกรรมและปีการศึกษา ใช้สเกลเดียวกันทุกแผง",
      },
      alt: {
        en: "Six small column charts showing Open House requests rising to ฿32,000 while Job Fair and Club Day requests fell.",
        th: "แผนภูมิแท่งขนาดเล็กหกแผงแสดงว่าคำขอของ Open House เพิ่มเป็น 32,000 บาท ขณะที่คำขอของ Job Fair และ Club Day ลดลง",
      },
    },
    dataset: eventBudgets,
  },
  {
    id: "meeting-records",
    title: { en: "How many meetings were recorded?", th: "มีบันทึกการประชุมกี่ครั้ง" },
    summary: meetingRecords.summary,
    mainPoints: [
      {
        en: "2023 to 2024 kept the most records, 43, including 16 project team meetings.",
        th: "ปีการศึกษา 2566 เก็บบันทึกมากที่สุด 43 ครั้ง รวมการประชุมทีมโครงการ 16 ครั้ง",
      },
      {
        en: "2022 to 2023 kept the fewest, 7 executive committee notes.",
        th: "ปีการศึกษา 2565 เก็บบันทึกน้อยที่สุด คือบันทึกการประชุมกรรมการบริหาร 7 ครั้ง",
      },
    ],
    chart: {
      kind: "columns",
      valueKey: "records",
      title: {
        en: "Two years kept five times as many meeting records",
        th: "สองปีเก็บบันทึกการประชุมมากกว่าปีอื่นราวห้าเท่า",
      },
      subtitle: {
        en: "Meeting records held, by academic year",
        th: "จำนวนบันทึกการประชุมที่มี แยกตามปีการศึกษา",
      },
      alt: {
        en: "A column chart showing 43 meeting records in 2023 to 2024 and 41 in 2025 to 2026, against 7 to 9 in the other three years.",
        th: "แผนภูมิแท่งแสดงบันทึกการประชุม 43 ครั้ง ในปีการศึกษา 2566 และ 41 ครั้ง ในปีการศึกษา 2568 ขณะที่อีกสามปีมี 7 ถึง 9 ครั้ง",
      },
    },
    dataset: meetingRecords,
    tile: {
      label: { en: "Meeting records", th: "บันทึกการประชุม" },
      context: { en: "Kept during the year", th: "เก็บไว้ตลอดปี" },
    },
  },
  {
    id: "clubs",
    title: { en: "How many clubs registered?", th: "มีชมรมลงทะเบียนกี่ชมรม" },
    summary: clubs.summary,
    mainPoints: [
      {
        en: "The number of registered clubs and groups tripled from 4 to 12 over three years of records.",
        th: "จำนวนชมรมและกลุ่มที่ลงทะเบียนเพิ่มขึ้นสามเท่า จาก 4 เป็น 12 ในสามปีที่มีบันทึก",
      },
      {
        en: "2021 to 2022 and 2024 to 2025 hold no club register.",
        th: "ปีการศึกษา 2564 และ 2567 ไม่มีทะเบียนชมรม",
      },
    ],
    chart: {
      kind: "columns",
      valueKey: "clubs",
      title: {
        en: "Registered clubs tripled between 2022 and 2026",
        th: "ชมรมที่ลงทะเบียนเพิ่มขึ้นสามเท่าระหว่างปีการศึกษา 2565 ถึง 2568",
      },
      subtitle: {
        en: "Clubs and groups registered with BIRSA, by academic year",
        th: "ชมรมและกลุ่มที่ลงทะเบียนกับ BIRSA แยกตามปีการศึกษา",
      },
      alt: {
        en: "A column chart showing registered clubs rising from 4 in 2022 to 2023 to 8 and then 12, with two years holding no register.",
        th: "แผนภูมิแท่งแสดงว่าชมรมที่ลงทะเบียนเพิ่มจาก 4 ในปีการศึกษา 2565 เป็น 8 และ 12 โดยมีสองปีที่ไม่มีทะเบียน",
      },
    },
    dataset: clubs,
    tile: {
      label: { en: "Clubs and groups", th: "ชมรมและกลุ่ม" },
      context: { en: "Registered with BIRSA", th: "ลงทะเบียนกับ BIRSA" },
    },
  },
];
