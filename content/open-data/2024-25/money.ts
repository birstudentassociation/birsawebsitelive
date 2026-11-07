import type { Bilingual, Row, Topic } from "@/lib/open-data";

const period: Bilingual = { en: "Academic year 2024 to 2025", th: "ปีการศึกษา 2567" };

const area = {
  activities: { en: "Student activities", th: "กิจกรรมนักศึกษา" },
  academic: { en: "Academic", th: "วิชาการ" },
  welfare: { en: "Rights and welfare", th: "สิทธิและสวัสดิการ" },
  running: { en: "Running costs", th: "ค่าดำเนินงานของ BIRSA" },
  other: { en: "Other (facilities)", th: "อื่น ๆ (สถานที่)" },
} satisfies Record<string, Bilingual>;

const project = {
  partyNight: { en: "BIR Party Night", th: "BIR Party Night" },
  jobFair: { en: "BIR Job Fair", th: "BIR Job Fair" },
  thamSing: { en: "Tham Sing gathering", th: "รวมถ้ำสิงห์" },
  bonding: {
    en: "Tha Prachan and Rangsit bonding event",
    th: "สานสัมพันธ์ท่าพระจันทร์และรังสิต",
  },
  meetAjarn: { en: "Meet Ajarn", th: "อาจารย์พบนิสิต" },
  cups: { en: "Paper cups", th: "แก้วกระดาษ" },
  facilities: { en: "Facilities", th: "สถานที่" },
  games: { en: "Tha Prachan Games", th: "ท่าพระจันทร์เกม" },
  running: { en: "BIRSA running costs", th: "ค่าใช้จ่ายสโมสรนักศึกษา" },
} satisfies Record<string, Bilingual>;

function line(
  a: Bilingual,
  p: Bilingual,
  itemEn: string,
  itemTh: string,
  quantity: number | null,
  unitCost: number | null,
  amount: number
): Row {
  return { area: a, project: p, item: { en: itemEn, th: itemTh }, quantity, unitCost, amount };
}

const plannedLines: Row[] = [
  line(area.activities, project.partyNight, "Equipment", "ค่าอุปกรณ์", null, null, 4000),
  line(area.activities, project.partyNight, "Staff food", "ค่าอาหารสต๊าฟ", 30, 30, 900),
  line(area.activities, project.partyNight, "Props", "พร็อพ", null, null, 1000),
  line(
    area.activities,
    project.jobFair,
    "Speaker fees (2 speakers, 2 hours)",
    "ค่าตอบแทนวิทยากร (2 คน, 2 ชั่วโมง)",
    4,
    1200,
    4800
  ),
  line(area.activities, project.jobFair, "Staff food", "ค่าอาหารสต๊าฟ", 20, 50, 1000),
  line(
    area.activities,
    project.jobFair,
    "Snacks and drinks for speakers",
    "ค่าของว่างและเครื่องดื่มสำหรับวิทยากร",
    2,
    30,
    60
  ),
  line(
    area.activities,
    project.thamSing,
    "Air conditioned bus, 22 seats",
    "รถบัสปรับอากาศ 22 ที่นั่ง",
    1,
    1000,
    1000
  ),
  line(
    area.activities,
    project.thamSing,
    "Flat rate travel allowance",
    "ค่าพาหนะอัตราเหมาจ่าย",
    22,
    100,
    2200
  ),
  line(
    area.activities,
    project.thamSing,
    "Fuel (litres of diesel)",
    "ค่าเชื้อเพลิง (ลิตร)",
    250,
    29.94,
    7485
  ),
  line(
    area.activities,
    project.thamSing,
    "Meals (22 people, 7 meals)",
    "ค่าอาหาร (22 คน, 7 มื้อ)",
    154,
    30,
    4620
  ),
  line(area.activities, project.bonding, "Snacks", "ค่าอาหารว่าง", 40, 30, 1200),
  line(
    area.activities,
    project.bonding,
    "Air conditioned bus, 45 seats",
    "รถบัสปรับอากาศ 45 ที่นั่ง",
    4,
    2000,
    8000
  ),
  line(
    area.activities,
    project.bonding,
    "Flat rate travel allowance",
    "ค่าพาหนะอัตราเหมาจ่าย",
    200,
    100,
    20000
  ),
  line(
    area.activities,
    project.bonding,
    "Fuel (litres of diesel)",
    "ค่าเชื้อเพลิง (ลิตร)",
    250,
    29.94,
    7485
  ),
  line(area.activities, project.bonding, "Equipment", "ค่าอุปกรณ์", null, null, 2000),
  line(area.activities, project.bonding, "Props", "พร็อพ", null, null, 1000),
  line(area.activities, project.bonding, "Venue decoration", "ค่าตกแต่งสถานที่", null, null, 3000),
  line(
    area.activities,
    project.games,
    "Snacks and drinks (90 people, 4 days)",
    "ค่าอาหารว่างและเครื่องดื่ม (90 คน, 4 วัน)",
    360,
    30,
    10800
  ),
  line(
    area.activities,
    project.games,
    "Dinner (90 people, 4 days)",
    "ค่าอาหารเย็น (90 คน, 4 วัน)",
    360,
    50,
    18000
  ),
  line(
    area.activities,
    project.games,
    "Materials and equipment (supplier quote)",
    "ค่าวัสดุอุปกรณ์ (ตามใบเสนอราคา)",
    null,
    null,
    5500
  ),
  line(area.activities, project.games, "Miscellaneous", "ค่าเบ็ดเตล็ด", null, null, 700),
  line(
    area.academic,
    project.meetAjarn,
    "Food for the lecturers",
    "ค่าอาหารสำหรับอาจารย์",
    3,
    30,
    90
  ),
  line(area.welfare, project.cups, "Cup holder", "ที่วางแก้ว", 1, 200, 200),
  line(area.welfare, project.cups, "Cups (365 days)", "แก้วกระดาษ (365 วัน)", 365, 40, 14600),
  line(
    area.other,
    project.facilities,
    "Toilet air freshener gel",
    "เจลปรับอากาศในห้องน้ำ",
    18,
    89,
    1602
  ),
  line(area.other, project.facilities, "Rubbish bins", "ถังขยะ", 4, 300, 1200),
  line(
    area.running,
    project.running,
    "Snacks and drinks (3 months)",
    "ค่าอาหารว่างและเครื่องดื่ม (3 เดือน)",
    3,
    3000,
    9000
  ),
  line(
    area.running,
    project.running,
    "Office supplies (2 terms)",
    "วัสดุสำนักงาน (2 เทอม)",
    2,
    2000,
    4000
  ),
  line(
    area.running,
    project.running,
    "First aid supplies (2 terms)",
    "อุปกรณ์ปฐมพยาบาล (2 เทอม)",
    2,
    3000,
    6000
  ),
];

export const money: Topic = {
  slug: "money",
  title: {
    en: "How much did BIRSA plan to spend in 2024 to 2025?",
    th: "BIRSA วางแผนใช้เงินเท่าไรในปีการศึกษา 2567",
  },
  summary: {
    en: "BIRSA planned to spend ฿141,442 across nine projects. No record of actual spending was kept.",
    th: "BIRSA วางแผนใช้เงิน 141,442 บาท ใน 9 โครงการ และไม่มีบันทึกรายจ่ายจริงของปีนี้",
  },
  headlines: [
    {
      value: "฿141,442",
      label: { en: "Planned spending, adding up the lines", th: "รายจ่ายตามแผน รวมจากทุกรายการ" },
      context: { en: "Nine projects, 29 lines", th: "9 โครงการ 29 รายการ" },
    },
    {
      value: "฿124,137",
      label: { en: "Total stated in the plan", th: "ยอดรวมที่แผนระบุไว้" },
      context: {
        en: "฿17,305 lower than its own lines",
        th: "ต่ำกว่ารายการในแผนเอง 17,305 บาท",
      },
    },
    {
      value: "฿42,685",
      label: { en: "Planned for the bonding event", th: "งบที่วางแผนไว้สำหรับงานสานสัมพันธ์" },
      context: { en: "The largest project", th: "โครงการที่ใช้งบมากที่สุด" },
    },
  ],
  mainPoints: [
    {
      en: "The 2024 to 2025 budget plan adds up to ฿141,442 across 29 lines and nine projects.",
      th: "แผนงบประมาณปีการศึกษา 2567 รวมได้ 141,442 บาท จาก 29 รายการ ใน 9 โครงการ",
    },
    {
      en: "The plan states a total of ฿124,137, which is ฿17,305 less than the sum of its own lines.",
      th: "แผนระบุยอดรวม 124,137 บาท ซึ่งน้อยกว่าผลรวมของรายการในแผนเอง 17,305 บาท",
    },
    {
      en: "The Tha Prachan and Rangsit bonding event is the largest project at ฿42,685.",
      th: "งานสานสัมพันธ์ท่าพระจันทร์และรังสิตเป็นโครงการที่ใช้งบมากที่สุด 42,685 บาท",
    },
    {
      en: "Tha Prachan Games follows at ฿35,000, and the two together are over half of the plan.",
      th: "ท่าพระจันทร์เกมตามมาที่ 35,000 บาท และสองโครงการรวมกันเกินครึ่งหนึ่งของแผน",
    },
    {
      en: "Four project request forms ask for ฿60,330 in total, from ฿3,530 to ฿30,000.",
      th: "แบบขออนุมัติโครงการ 4 ฉบับขอรวม 60,330 บาท ตั้งแต่ 3,530 ถึง 30,000 บาท",
    },
  ],
  warning: {
    en: "Every figure on this page is a plan. BIRSA kept no record of income, spending or balances for the year.",
    th: "ตัวเลขทุกตัวในหน้านี้เป็นแผน BIRSA ไม่ได้เก็บบันทึกรายรับ รายจ่าย หรือยอดคงเหลือของปีนี้",
  },
  chart: {
    datasetId: "planned-budget",
    labelKey: "project",
    valueKey: "amount",
    groupBy: true,
    title: {
      en: "Two events take more than half of planned spending",
      th: "สองกิจกรรมใช้งบเกินครึ่งหนึ่งของรายจ่ายตามแผน",
    },
    subtitle: {
      en: "Planned spending in baht by project, 2024 to 2025",
      th: "รายจ่ายตามแผนเป็นบาท แยกตามโครงการ ปีการศึกษา 2567",
    },
    alt: {
      en: "A bar chart showing that the bonding event is planned at 42,685 baht and Tha Prachan Games at 35,000 baht, well above every other project.",
      th: "แผนภูมิแท่งแสดงว่างานสานสัมพันธ์วางแผนไว้ 42,685 บาท และท่าพระจันทร์เกม 35,000 บาท สูงกว่าโครงการอื่นทุกโครงการอย่างชัดเจน",
    },
  },
  datasets: [
    {
      id: "planned-budget",
      title: { en: "Planned budget by line", th: "งบประมาณตามแผนแยกรายการ" },
      summary: {
        en: "The budget plan has 29 lines for nine projects, adding up to ฿141,442 against a stated total of ฿124,137.",
        th: "แผนงบประมาณมี 29 รายการ ใน 9 โครงการ รวมได้ 141,442 บาท ขณะที่ยอดรวมที่ระบุไว้คือ 124,137 บาท",
      },
      columns: [
        { key: "area", label: { en: "Area", th: "หมวด" }, kind: "text" },
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "quantity", label: { en: "Quantity", th: "จำนวน" }, kind: "number" },
        {
          key: "unitCost",
          label: { en: "Planned cost per unit (baht)", th: "ค่าใช้จ่ายต่อหน่วยตามแผน (บาท)" },
          kind: "money",
        },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "ประมาณการค่าใช้จ่าย (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      rows: plannedLines,
      notes: [
        {
          en: "The plan states ฿124,137. That leaves out the Tham Sing gathering (฿15,305), and two subtotals are ฿1,000 below their lines (Job Fair and the bonding event). This table adds the lines.",
          th: "แผนระบุยอด 124,137 บาท ซึ่งไม่รวมรวมถ้ำสิงห์ (15,305 บาท) และมีสองยอดย่อยต่ำกว่ารายการอยู่ 1,000 บาท (Job Fair และงานสานสัมพันธ์) ตารางนี้จึงรวมจากรายการ",
        },
        {
          en: "Job Fair is ฿5,860 here. The project request form says ฿3,530 and the proposal says ฿2,260. The activities page shows all three.",
          th: "Job Fair อยู่ที่ 5,860 บาทในตารางนี้ แต่แบบขออนุมัติโครงการระบุ 3,530 บาท และเอกสารโครงการระบุ 2,260 บาท หน้ากิจกรรมแสดงครบทั้งสามตัวเลข",
        },
        {
          en: "Speaker fees are shown as 4 speaker hours at ฿1,200, from the plan's 2 speakers for 2 hours.",
          th: "ค่าวิทยากรแสดงเป็น 4 ชั่วโมงวิทยากร ชั่วโมงละ 1,200 บาท จากแผนที่ระบุวิทยากร 2 คน 2 ชั่วโมง",
        },
        {
          en: "The plan has a miscellaneous items tab (฿10,670) and a supplier quote (฿4,611). They itemise supplies and are not added here.",
          th: "แผนมีแท็บของเบ็ดเตล็ด (10,670 บาท) และใบเสนอราคา (4,611 บาท) ซึ่งแจกแจงวัสดุอุปกรณ์ และไม่ได้นำมารวมในตารางนี้",
        },
        {
          en: "The plan lists Tha Prachan Games under the sports committee. Here it is counted as a student activity, and the facilities lines are shown as other.",
          th: "แผนจัดท่าพระจันทร์เกมไว้ในฝ่ายกีฬา ที่นี่นับเป็นกิจกรรมนักศึกษา และรายการด้านสถานที่จัดเป็นหมวดอื่น ๆ",
        },
      ],
      source: {
        en: "BIRSA 2024 budget plan spreadsheet",
        th: "ตารางแผนงบประมาณ BIRSA ปี 2567",
      },
      period,
    },
    {
      id: "project-forms",
      title: {
        en: "Project request forms and their budgets",
        th: "แบบขออนุมัติโครงการและงบประมาณ",
      },
      summary: {
        en: "Four project request forms ask for ฿60,330 in total, from ฿3,530 for the Job Fair to ฿30,000 for the farewell party.",
        th: "แบบขออนุมัติโครงการ 4 ฉบับขอรวม 60,330 บาท ตั้งแต่ 3,530 บาทสำหรับ Job Fair ถึง 30,000 บาทสำหรับงานเลี้ยงส่ง",
      },
      columns: [
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        { key: "date", label: { en: "Date of event", th: "วันที่จัด" }, kind: "date" },
        {
          key: "participants",
          label: { en: "Planned participants", th: "ผู้เข้าร่วมตามแผน" },
          kind: "number",
        },
        {
          key: "budget",
          label: { en: "Requested budget (baht)", th: "งบประมาณที่ขอ (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      rows: [
        {
          project: { en: "BIR Job Fair", th: "BIR Job Fair" },
          date: "2024-09-13",
          participants: 60,
          budget: 3530,
        },
        {
          project: { en: "Open House talk", th: "เสวนาในงาน Open House" },
          date: "2024-11-03",
          participants: null,
          budget: 8800,
        },
        {
          project: {
            en: "Open House booth and guidance (Tha Prachan Open)",
            th: "บูธแนะแนวและประชาสัมพันธ์ (ท่าพระจันทร์โอเพ่น)",
          },
          date: "2024-11-03",
          participants: null,
          budget: 18000,
        },
        {
          project: { en: "BIR13 Charity Byenior 2025", th: "BIR13 Charity Byenior 2025" },
          date: "2025-03-06",
          participants: 100,
          budget: 30000,
        },
      ],
      notes: [
        {
          en: "The copies show the request, not the faculty's decision, so approval is not confirmed.",
          th: "สำเนาที่มีแสดงเฉพาะคำขอ ไม่แสดงผลการพิจารณาของคณะ จึงยืนยันการอนุมัติไม่ได้",
        },
        {
          en: "The two Open House forms are handwritten and partly unclear. The amounts are confirmed by the figures written in words.",
          th: "แบบขอสองฉบับของงาน Open House เขียนด้วยมือและอ่านไม่ชัดบางส่วน จำนวนเงินยืนยันได้จากตัวอักษรที่เขียนกำกับ",
        },
        {
          en: "The forms for the talk and the booth do not give a number of participants that can be read.",
          th: "แบบขอของเสวนาและบูธอ่านจำนวนผู้เข้าร่วมไม่ได้",
        },
      ],
      source: {
        en: "Project request forms to the faculty",
        th: "แบบขออนุมัติโครงการถึงคณะ",
      },
      period,
    },
    {
      id: "other-figures",
      title: {
        en: "Other money figures in BIRSA's working files",
        th: "ตัวเลขเงินอื่นในเอกสารทำงานของ BIRSA",
      },
      summary: {
        en: "BIRSA's minutes record ฿4,000 carried over from the previous committee and several estimates for events.",
        th: "รายงานการประชุมบันทึกเงินยกมาจากคณะกรรมการชุดก่อน 4,000 บาท และประมาณการของกิจกรรมหลายรายการ",
      },
      columns: [
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "kind", label: { en: "Kind of figure", th: "ประเภทตัวเลข" }, kind: "text" },
        { key: "amount", label: { en: "Amount (baht)", th: "จำนวนเงิน (บาท)" }, kind: "money" },
        { key: "date", label: { en: "Date of meeting", th: "วันที่ประชุม" }, kind: "date" },
      ],
      rows: [
        {
          item: {
            en: "Savings carried over from the previous committee",
            th: "เงินคงเหลือยกมาจากคณะกรรมการชุดก่อน",
          },
          kind: { en: "Actual balance", th: "ยอดคงเหลือจริง" },
          amount: 4000,
          date: "2024-06-14",
        },
        {
          item: {
            en: "Bonding event, expected total for both sides",
            th: "งานสานสัมพันธ์ งบที่คาดไว้รวมสองฝั่ง",
          },
          kind: { en: "Estimate", th: "ประมาณการ" },
          amount: 60000,
          date: "2024-06-11",
        },
        {
          item: {
            en: "Bonding event, expected Rangsit share",
            th: "งานสานสัมพันธ์ ส่วนของฝั่งรังสิตที่คาดไว้",
          },
          kind: { en: "Estimate", th: "ประมาณการ" },
          amount: 40000,
          date: "2024-06-11",
        },
        {
          item: {
            en: "Bonding event, expected BIRSA share",
            th: "งานสานสัมพันธ์ ส่วนของ BIRSA ที่คาดไว้",
          },
          kind: { en: "Estimate", th: "ประมาณการ" },
          amount: 20000,
          date: "2024-06-11",
        },
        {
          item: {
            en: "Shirt samples, cost of 4 shirts",
            th: "ค่าเสื้อตัวอย่าง 4 ตัว",
          },
          kind: { en: "Quote", th: "ราคาที่เสนอ" },
          amount: 1690,
          date: "2024-06-14",
        },
        {
          item: {
            en: "Shirt design contest, first prize",
            th: "รางวัลที่ 1 การประกวดออกแบบเสื้อ",
          },
          kind: { en: "Planned", th: "ตามแผน" },
          amount: 1500,
          date: "2024-06-14",
        },
        {
          item: {
            en: "Tham Sing joint camp, lower estimate for all universities",
            th: "ค่ายรวมถ้ำสิงห์ ประมาณการขั้นต่ำ รวมทุกมหาวิทยาลัย",
          },
          kind: { en: "Estimate", th: "ประมาณการ" },
          amount: 300000,
          date: null,
        },
        {
          item: {
            en: "Tham Sing joint camp, upper estimate for all universities",
            th: "ค่ายรวมถ้ำสิงห์ ประมาณการขั้นสูง รวมทุกมหาวิทยาลัย",
          },
          kind: { en: "Estimate", th: "ประมาณการ" },
          amount: 500000,
          date: null,
        },
        {
          item: {
            en: "Tham Sing joint camp, highest fee per camper",
            th: "ค่ายรวมถ้ำสิงห์ ค่าธรรมเนียมสูงสุดต่อผู้เข้าค่าย",
          },
          kind: { en: "Planned", th: "ตามแผน" },
          amount: 500,
          date: null,
        },
      ],
      notes: [
        {
          en: "These figures are not added up because they are different kinds. Only the first is a real balance.",
          th: "ไม่ได้รวมตัวเลขเหล่านี้เพราะเป็นคนละประเภท มีเพียงรายการแรกเท่านั้นที่เป็นยอดคงเหลือจริง",
        },
        {
          en: "The bonding estimate of ฿20,000 for BIRSA is below the ฿42,685 in the budget plan. The meeting dates the estimate to 11 June 2024.",
          th: "ประมาณการส่วนของ BIRSA 20,000 บาทต่ำกว่า 42,685 บาทในแผนงบประมาณ รายงานประชุมลงวันที่ 11 มิถุนายน 2567",
        },
        {
          en: "The Tham Sing estimates come from the meeting of the universities and have no date.",
          th: "ประมาณการของรวมถ้ำสิงห์มาจากการประชุมของมหาวิทยาลัยต่าง ๆ และไม่ระบุวันที่",
        },
      ],
      source: {
        en: "BIRSA meeting notes and notes on the Tham Sing gathering",
        th: "บันทึกการประชุม BIRSA และบันทึกเรื่องรวมถ้ำสิงห์",
      },
      period: { en: "June to July 2024", th: "มิถุนายนถึงกรกฎาคม 2567" },
    },
  ],
};
