import type { Bilingual, Row, Topic } from "@/lib/open-data";

const held: Bilingual = { en: "Held", th: "จัดแล้ว" };
const unknown: Bilingual = { en: "Unknown", th: "ไม่ทราบ" };

function event(
  name: Bilingual,
  date: string,
  participants: number | null,
  staff: number | null,
  budget: number | null,
  status: Bilingual
): Row {
  return { event: name, date, participants, staff, budget, status };
}

const events: Row[] = [
  event(
    {
      en: "Singh Daeng Samphan (joint event with the faculty committee)",
      th: "สิงห์แดงสัมพันธ์ (ร่วมกับคณะกรรมการนักศึกษาคณะ)",
    },
    "2024-08-04",
    null,
    null,
    null,
    held
  ),
  event({ en: "BIR orientation", th: "ปฐมนิเทศ BIR" }, "2024-08-05", null, 14, null, held),
  event({ en: "BIR16 shirt sale", th: "ขายเสื้อ BIR16" }, "2024-08", null, null, null, unknown),
  event({ en: "BIR Job Fair", th: "BIR Job Fair" }, "2024-09-13", 60, 20, 3530, held),
  event(
    { en: "Open House talk", th: "เสวนาในงาน Open House" },
    "2024-11-03",
    null,
    null,
    8800,
    unknown
  ),
  event(
    {
      en: "Open House booth and guidance (Tha Prachan Open)",
      th: "บูธแนะแนวและประชาสัมพันธ์ (ท่าพระจันทร์โอเพ่น)",
    },
    "2024-11-03",
    null,
    null,
    18000,
    unknown
  ),
  event({ en: "Meet Ajarn", th: "อาจารย์พบนิสิต" }, "2024-11", null, null, 90, unknown),
  event({ en: "Tha Prachan Games", th: "ท่าพระจันทร์เกม" }, "2025-01", 90, null, 35000, unknown),
  event({ en: "Tham Sing gathering", th: "รวมถ้ำสิงห์" }, "2025-01-24", 22, null, 15305, unknown),
  event(
    { en: "Tha Prachan and Rangsit bonding event", th: "สานสัมพันธ์ท่าพระจันทร์และรังสิต" },
    "2025-03",
    200,
    null,
    42685,
    unknown
  ),
  event(
    { en: "BIR13 Charity Byenior 2025", th: "BIR13 Charity Byenior 2025" },
    "2025-03-06",
    100,
    null,
    30000,
    unknown
  ),
  event({ en: "BIR Party Night", th: "BIR Party Night" }, "2025-04-04", null, 30, 5900, unknown),
  event(
    {
      en: "Singh Dam and Singh Daeng with Chulalongkorn",
      th: "สิงห์ดำสิงห์แดง (พบจุฬาฯ)",
    },
    "2025-04",
    null,
    null,
    null,
    unknown
  ),
];

export const activities: Topic = {
  slug: "activities",
  title: {
    en: "What did BIRSA plan to run in 2024 to 2025?",
    th: "BIRSA วางแผนจัดกิจกรรมอะไรในปีการศึกษา 2567",
  },
  summary: {
    en: "BIRSA's files list 13 events from August 2024 to April 2025. Three are marked as held and none has an attendance count.",
    th: "เอกสารของ BIRSA ระบุกิจกรรม 13 รายการ ตั้งแต่สิงหาคม 2567 ถึงเมษายน 2568 มี 3 รายการที่ระบุว่าจัดแล้ว และไม่มีรายการใดมีจำนวนผู้เข้าร่วมจริง",
  },
  headlines: [
    {
      value: "13",
      label: { en: "Events on record", th: "กิจกรรมที่มีบันทึก" },
      context: { en: "August 2024 to April 2025", th: "สิงหาคม 2567 ถึงเมษายน 2568" },
    },
    {
      value: "3",
      label: { en: "Events marked as held", th: "กิจกรรมที่ระบุว่าจัดแล้ว" },
    },
    {
      value: "0",
      label: { en: "Events with an attendance count", th: "กิจกรรมที่มีจำนวนผู้เข้าร่วมจริง" },
    },
  ],
  mainPoints: [
    {
      en: "BIRSA's files list 13 events between August 2024 and April 2025.",
      th: "เอกสารของ BIRSA ระบุกิจกรรม 13 รายการ ระหว่างเดือนสิงหาคม 2567 ถึงเมษายน 2568",
    },
    {
      en: "Only 3 events are marked as held, because the activity timeline stops in September 2024.",
      th: "มีเพียง 3 กิจกรรมที่ระบุว่าจัดแล้ว เพราะตารางกิจกรรมหยุดอัปเดตในเดือนกันยายน 2567",
    },
    {
      en: "The BIR Job Fair on 13 September 2024 planned for 60 students and 20 staff on a budget of ฿3,530.",
      th: "BIR Job Fair วันที่ 13 กันยายน 2567 วางแผนนักศึกษา 60 คน ทีมงาน 20 คน งบประมาณ 3,530 บาท",
    },
    {
      en: "The Tham Sing gathering was planned for 24 to 27 January 2025 with 7 universities.",
      th: "รวมถ้ำสิงห์กำหนดจัดวันที่ 24 ถึง 27 มกราคม 2568 ร่วมกับ 7 มหาวิทยาลัย",
    },
    {
      en: "The farewell party on 6 March 2025 planned for 100 guests on a request of ฿30,000.",
      th: "งานเลี้ยงส่งวันที่ 6 มีนาคม 2568 วางแผนผู้เข้าร่วม 100 คน ของบ 30,000 บาท",
    },
  ],
  warning: {
    en: "Participants and budgets are plans, not results. No event has a recorded attendance or final cost.",
    th: "ผู้เข้าร่วมและงบประมาณเป็นตัวเลขตามแผน ไม่ใช่ผลที่เกิดขึ้นจริง ไม่มีกิจกรรมใดมีจำนวนผู้เข้าร่วมหรือค่าใช้จ่ายสุดท้าย",
  },
  datasets: [
    {
      id: "events",
      title: {
        en: "Events planned or held, 2024 to 2025",
        th: "กิจกรรมที่วางแผนหรือจัด ปี 2567 ถึง 2568",
      },
      summary: {
        en: "BIRSA's files list 13 events, with 3 marked as held and planned budgets for 9 of them.",
        th: "เอกสารของ BIRSA ระบุกิจกรรม 13 รายการ ระบุว่าจัดแล้ว 3 รายการ และมีงบประมาณตามแผน 9 รายการ",
      },
      columns: [
        { key: "event", label: { en: "Event", th: "กิจกรรม" }, kind: "text" },
        { key: "date", label: { en: "Date", th: "วันที่จัด" }, kind: "date" },
        {
          key: "participants",
          label: { en: "Planned participants", th: "ผู้เข้าร่วมตามแผน" },
          kind: "number",
        },
        {
          key: "staff",
          label: { en: "Planned staff", th: "ทีมงานตามแผน" },
          kind: "number",
        },
        {
          key: "budget",
          label: { en: "Planned budget (baht)", th: "งบประมาณตามแผน (บาท)" },
          kind: "money",
        },
        { key: "status", label: { en: "Status", th: "สถานะ" }, kind: "text" },
      ],
      rows: events,
      notes: [
        {
          en: "Held means the activity timeline marks it as done. Unknown means the timeline was not updated after September 2024.",
          th: "จัดแล้วหมายถึงตารางกิจกรรมระบุว่าเสร็จสิ้น ไม่ทราบหมายถึงตารางไม่ได้อัปเดตหลังเดือนกันยายน 2567",
        },
        {
          en: "Budgets follow the project request form where there is one, and otherwise the budget plan. Orientation staff is the 14 people BIRSA had available.",
          th: "งบประมาณใช้ตามแบบขออนุมัติโครงการหากมี ถ้าไม่มีใช้ตามแผนงบประมาณ ทีมงานปฐมนิเทศคือสมาชิก BIRSA ที่มีอยู่ 14 คน",
        },
        {
          en: "The timeline gives Meet Ajarn as 12 May and Open House as 3 May. The list places both between October and December, and the Open House forms say 3 November 2024, so both are shown as November 2024.",
          th: "ตารางกิจกรรมระบุอาจารย์พบนิสิตวันที่ 12 พ.ค. และ Open House วันที่ 3 พ.ค. แต่ลำดับในตารางอยู่ระหว่างตุลาคมถึงธันวาคม และแบบขอของ Open House ระบุ 3 พฤศจิกายน 2567 จึงแสดงทั้งสองเป็นเดือนพฤศจิกายน 2567",
        },
        {
          en: "Planned participants differ between documents. The bonding event is 200 in the budget plan and 250 in the 11 June 2024 minutes. For Tham Sing, the plan has 22 people and the minutes say about 5 staff. Games is 90 people a day for 4 days.",
          th: "ผู้เข้าร่วมตามแผนต่างกันระหว่างเอกสาร งานสานสัมพันธ์คือ 200 คนในแผนงบประมาณ และ 250 คนในรายงานประชุม 11 มิถุนายน 2567 รวมถ้ำสิงห์แผนระบุ 22 คน แต่รายงานประชุมระบุสต๊าฟประมาณ 5 คน ท่าพระจันทร์เกมคือวันละ 90 คน เป็นเวลา 4 วัน",
        },
        {
          en: "Party Night is on 4 April in the timeline and on 8 April in the 14 June 2024 meeting notes. The shirt sale is marked done in the timeline but not in the shirt task list.",
          th: "Party Night ตรงกับวันที่ 4 เมษายนในตารางกิจกรรม แต่เป็น 8 เมษายนในบันทึกประชุม 14 มิถุนายน 2567 ส่วนการขายเสื้อตารางกิจกรรมระบุว่าเสร็จแล้ว แต่ตารางงานเสื้อไม่ได้ระบุ",
        },
      ],
      source: {
        en: "BIRSA activity timeline, budget plan, project request forms and meeting notes",
        th: "ตารางกิจกรรม แผนงบประมาณ แบบขออนุมัติโครงการ และบันทึกการประชุมของ BIRSA",
      },
      period: { en: "August 2024 to April 2025", th: "สิงหาคม 2567 ถึงเมษายน 2568" },
    },
    {
      id: "job-fair-sources",
      title: { en: "Why the Job Fair has three budgets", th: "ทำไม Job Fair จึงมีสามงบประมาณ" },
      summary: {
        en: "Three documents give the Job Fair a budget of ฿3,530, ฿2,260 and ฿5,860, and the request form is used elsewhere.",
        th: "เอกสารสามฉบับให้งบ Job Fair เป็น 3,530 บาท 2,260 บาท และ 5,860 บาท โดยหน้านี้ใช้ตามแบบขออนุมัติโครงการ",
      },
      columns: [
        { key: "document", label: { en: "Document", th: "เอกสาร" }, kind: "text" },
        { key: "participants", label: { en: "Students", th: "นักศึกษา" }, kind: "number" },
        { key: "staff", label: { en: "Staff", th: "ทีมงาน" }, kind: "number" },
        { key: "budget", label: { en: "Budget (baht)", th: "งบประมาณ (บาท)" }, kind: "money" },
      ],
      rows: [
        {
          document: { en: "Project request form", th: "แบบขออนุมัติโครงการ" },
          participants: 60,
          staff: null,
          budget: 3530,
        },
        {
          document: { en: "Project proposal", th: "เอกสารโครงการ" },
          participants: 100,
          staff: 20,
          budget: 2260,
        },
        {
          document: {
            en: "Annual budget plan, sum of lines",
            th: "แผนงบประมาณประจำปี รวมจากรายการ",
          },
          participants: null,
          staff: 20,
          budget: 5860,
        },
      ],
      notes: [
        {
          en: "The request form is dated 6 August 2024. The budget plan states a subtotal of ฿4,860, which is ฿1,000 below its lines.",
          th: "แบบขออนุมัติโครงการลงวันที่ 6 สิงหาคม 2567 แผนงบประมาณระบุยอดย่อย 4,860 บาท ซึ่งต่ำกว่าผลรวมของรายการอยู่ 1,000 บาท",
        },
        {
          en: "The proposal budgets speakers at ฿600 each. The plan budgets 2 speakers at ฿1,200 for 2 hours.",
          th: "เอกสารโครงการตั้งค่าวิทยากรคนละ 600 บาท ส่วนแผนงบประมาณตั้งวิทยากร 2 คน คนละ 1,200 บาท เป็นเวลา 2 ชั่วโมง",
        },
      ],
      source: {
        en: "Project request form, Job Fair proposal and BIRSA 2024 budget plan",
        th: "แบบขออนุมัติโครงการ เอกสารโครงการ Job Fair และแผนงบประมาณ BIRSA ปี 2567",
      },
      period: { en: "June to September 2024", th: "มิถุนายนถึงกันยายน 2567" },
    },
  ],
};
