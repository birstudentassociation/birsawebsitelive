import type { Bilingual, Row, Topic } from "@/lib/open-data";

const team = {
  activities: { en: "Student activities", th: "ฝ่ายกิจกรรมนักศึกษา" },
  academic: { en: "Academic", th: "ฝ่ายวิชาการ" },
  rights: { en: "Rights and welfare", th: "ฝ่ายคุ้มครองสิทธิและสวัสดิภาพ" },
  running: { en: "BIRSA running costs", th: "ค่าใช้จ่ายสโมสร" },
} satisfies Record<string, Bilingual>;

const project = {
  clubDay: { en: "Club Day and Music Day", th: "Club Day และ Music Day" },
  peaceDay: { en: "Peace Day", th: "Peace Day" },
  halloween: { en: "Halloween and Movie Day", th: "Halloween และ Movie Day" },
  jobFair: { en: "Job Fair and Informal Talk", th: "Job Fair และ Informal Talk" },
  festival: { en: "BIR Festival", th: "BIR Festival" },
  valentine: {
    en: "Valentine, Talk and Health Checkup",
    th: "Valentine, Talk และ Health Checkup",
  },
  women: { en: "International Women's Day", th: "International Women's Day" },
  piu: { en: "Polsci Inter Union", th: "Polsci Inter Union" },
  debate: { en: "Debate", th: "Debate" },
  seminar1: { en: "Academic seminar, term 1", th: "สัมมนาวิชาการ 1/2566" },
  seminar2: { en: "Rights seminar, term 2", th: "สัมมนาด้านสิทธิ 2/2566" },
  running: { en: "BIRSA running costs", th: "ค่าใช้จ่ายสโมสร" },
} satisfies Record<string, Bilingual>;

const item = {
  equipment: { en: "Equipment", th: "ค่าอุปกรณ์" },
  snacks: { en: "Snacks and drinks", th: "ค่าอาหารว่างและเครื่องดื่ม" },
  dinner: { en: "Dinner", th: "ค่าอาหารเย็น" },
  misc: { en: "Miscellaneous", th: "ค่าเบ็ดเตล็ด" },
  pr: { en: "Publicity", th: "ค่าประชาสัมพันธ์" },
  printed: { en: "Printed materials", th: "ค่าเอกสารแจก" },
} satisfies Record<string, Bilingual>;

function line(
  t: Bilingual,
  p: Bilingual,
  i: Bilingual,
  quantity: number | null,
  unitCost: number | null,
  amount: number
): Row {
  return { team: t, project: p, item: i, quantity, unitCost, amount };
}

const speakers = (people: number, hours: string): Bilingual => ({
  en: `Speaker fees (${people} speakers, ${hours})`,
  th: `ค่าตอบแทนวิทยากร (${people} คน, ${hours})`,
});

const planned: Row[] = [
  line(team.activities, project.clubDay, item.equipment, null, null, 4300),
  line(team.activities, project.clubDay, item.dinner, 55, 50, 2750),
  line(team.activities, project.clubDay, item.snacks, 55, 30, 1650),
  line(team.activities, project.clubDay, item.misc, null, null, 1000),
  line(team.activities, project.peaceDay, speakers(2, "1 hour"), 2, 1200, 2400),
  line(team.activities, project.peaceDay, item.printed, null, null, 1000),
  line(team.activities, project.peaceDay, item.snacks, 20, 30, 600),
  line(team.activities, project.peaceDay, item.misc, null, null, 400),
  line(
    team.activities,
    project.halloween,
    { en: "Room decorations", th: "อุปกรณ์ตกแต่งห้อง" },
    null,
    null,
    2000
  ),
  line(team.activities, project.halloween, item.snacks, 20, 30, 600),
  line(team.activities, project.halloween, speakers(1, "1 hour"), 1, 600, 600),
  line(team.activities, project.jobFair, item.equipment, null, null, 4000),
  line(team.activities, project.jobFair, item.dinner, 60, 50, 3000),
  line(team.activities, project.jobFair, item.snacks, 60, 30, 1800),
  line(team.activities, project.jobFair, { en: "Publicity", th: "PR" }, null, null, 2000),
  line(team.activities, project.jobFair, item.misc, null, null, 800),
  line(team.activities, project.festival, item.equipment, null, null, 5000),
  line(team.activities, project.festival, speakers(2, "1 hour"), 2, 600, 1200),
  line(team.activities, project.festival, item.dinner, 20, 50, 1000),
  line(team.activities, project.festival, item.snacks, 20, 30, 600),
  line(team.activities, project.festival, item.misc, null, null, 800),
  line(team.activities, project.valentine, speakers(2, "1 hour"), 2, 1200, 2400),
  line(team.activities, project.valentine, item.equipment, null, null, 2000),
  line(team.activities, project.valentine, item.dinner, 30, 50, 1500),
  line(team.activities, project.valentine, item.snacks, 30, 30, 900),
  line(team.activities, project.valentine, item.misc, null, null, 600),
  line(team.activities, project.women, speakers(2, "1 hour"), 2, 1200, 2400),
  line(team.activities, project.women, item.equipment, null, null, 2000),
  line(team.activities, project.women, item.dinner, 30, 50, 1500),
  line(team.activities, project.women, item.snacks, 30, 30, 900),
  line(team.activities, project.women, item.misc, null, null, 600),
  line(team.activities, project.piu, item.equipment, null, null, 3000),
  line(team.activities, project.piu, item.pr, null, null, 700),
  line(team.activities, project.piu, item.misc, null, null, 700),
  line(team.activities, project.piu, item.snacks, 20, 30, 600),
  line(
    team.academic,
    project.debate,
    {
      en: "Speaker and judge fees",
      th: "ค่าตอบแทนวิทยากรและกรรมการ",
    },
    null,
    null,
    7200
  ),
  line(team.academic, project.debate, { en: "Prizes", th: "ค่ารางวัล" }, null, null, 3000),
  line(
    team.academic,
    project.debate,
    { en: "Snacks and drinks (2 servings)", th: "ค่าอาหารว่างและเครื่องดื่ม (2 มื้อ)" },
    null,
    null,
    1800
  ),
  line(team.academic, project.debate, { en: "Lunch", th: "ค่าอาหารกลางวัน" }, null, null, 1000),
  line(team.academic, project.debate, item.printed, null, null, 500),
  line(team.academic, project.debate, { en: "Publicity", th: "PR" }, null, null, 500),
  line(team.academic, project.debate, item.misc, null, null, 400),
  line(team.academic, project.seminar1, speakers(2, "3 hours"), null, null, 7200),
  line(team.academic, project.seminar1, { en: "Publicity", th: "PR" }, null, null, 2000),
  line(team.academic, project.seminar1, item.snacks, 20, 30, 600),
  line(team.academic, project.seminar1, item.misc, null, null, 400),
  line(team.rights, project.seminar2, speakers(2, "3 hours"), null, null, 7200),
  line(team.rights, project.seminar2, { en: "Publicity", th: "PR" }, null, null, 2000),
  line(team.rights, project.seminar2, item.snacks, 20, 30, 600),
  line(team.rights, project.seminar2, item.misc, null, null, 400),
  line(
    team.running,
    project.running,
    { en: "Snacks and drinks (3 months)", th: "ค่าอาหารว่างและเครื่องดื่ม (3 เดือน)" },
    3,
    3000,
    9000
  ),
  line(
    team.running,
    project.running,
    { en: "Office supplies (2 terms)", th: "วัสดุสำนักงาน (2 เทอม)" },
    2,
    2000,
    4000
  ),
  line(
    team.running,
    project.running,
    { en: "First aid equipment (2 terms)", th: "อุปกรณ์ปฐมพยาบาล (2 เทอม)" },
    2,
    3000,
    6000
  ),
];

export const money: Topic = {
  slug: "money",
  title: {
    en: "Where BIRSA's money was planned to go",
    th: "เงินของ BIRSA วางแผนไว้ว่าจะใช้ไปกับอะไร",
  },
  summary: {
    en: "BIRSA planned to spend ฿111,100 across four areas. No record shows what was actually spent.",
    th: "BIRSA วางแผนใช้เงิน 111,100 บาทใน 4 ด้าน แต่ไม่มีบันทึกว่าใช้จริงเท่าไร",
  },
  mainPoints: [
    {
      en: "The 2023 to 2024 budget plan has lines that add up to ฿111,100.",
      th: "แผนงบประมาณปีการศึกษา 2566 มีรายการย่อยรวมกันได้ 111,100 บาท",
    },
    {
      en: "Student activities take ฿57,300, more than half of the plan.",
      th: "กิจกรรมนักศึกษาใช้งบ 57,300 บาท เกินครึ่งหนึ่งของแผน",
    },
    {
      en: "BIRSA's running costs are the largest single line of the plan at ฿19,000, ahead of Debate at ฿14,400.",
      th: "ค่าใช้จ่ายของสโมสรเป็นรายการเดียวที่ใช้งบมากที่สุด 19,000 บาท รองลงมาคือ Debate 14,400 บาท",
    },
    {
      en: "The plan states a grand total of ฿156,000 that its own lines do not support, so this page does not use it.",
      th: "แผนระบุยอดรวม 156,000 บาท ซึ่งรายการย่อยของแผนเองไม่รองรับ หน้านี้จึงไม่ใช้ตัวเลขนี้",
    },
    {
      en: "BIRSA holds no record of income, actual spending or a closing balance for the year.",
      th: "BIRSA ไม่มีบันทึกรายรับ รายจ่ายจริง หรือเงินคงเหลือสิ้นปีของปีนี้",
    },
  ],
  headlines: [
    {
      value: "฿111,100",
      label: { en: "Planned spending", th: "รายจ่ายตามแผน" },
      context: { en: "Total of the budget plan lines", th: "ผลรวมของรายการย่อยในแผน" },
    },
    {
      value: "฿57,300",
      label: { en: "Planned for student activities", th: "งบที่วางแผนไว้สำหรับกิจกรรมนักศึกษา" },
      context: { en: "Eight activities", th: "กิจกรรม 8 กิจกรรม" },
    },
    {
      value: "฿14,400",
      label: { en: "Planned for Debate", th: "งบที่วางแผนไว้สำหรับ Debate" },
      context: { en: "The largest project", th: "โครงการที่ใช้งบมากที่สุด" },
    },
  ],
  warning: {
    en: "These are planned amounts. BIRSA holds no ledger, receipt total or closing balance for 2023 to 2024, so nothing here shows what was spent.",
    th: "ตัวเลขเหล่านี้เป็นยอดตามแผน BIRSA ไม่มีบัญชี ยอดรวมใบเสร็จ หรือเงินคงเหลือสิ้นปีของปีการศึกษา 2566 จึงไม่มีตัวเลขใดในหน้านี้ที่แสดงว่าใช้จ่ายจริงเท่าไร",
  },
  chart: {
    datasetId: "planned-budget",
    labelKey: "project",
    valueKey: "amount",
    groupBy: true,
    title: {
      en: "Running costs are the largest planned item",
      th: "ค่าใช้จ่ายของสโมสรเป็นรายการที่วางแผนใช้งบมากที่สุด",
    },
    subtitle: {
      en: "Planned spending in baht by project, 2023 to 2024",
      th: "รายจ่ายตามแผนเป็นบาท แยกตามโครงการ ปีการศึกษา 2566",
    },
    alt: {
      en: "A bar chart showing that BIRSA's running costs are planned at 19,000 baht, ahead of Debate at 14,400 baht and Job Fair at 11,600 baht.",
      th: "แผนภูมิแท่งแสดงว่าค่าใช้จ่ายของสโมสรวางแผนไว้ 19,000 บาท สูงกว่า Debate ที่ 14,400 บาท และ Job Fair ที่ 11,600 บาท",
    },
  },
  datasets: [
    {
      id: "planned-budget",
      title: { en: "Planned budget by line", th: "งบประมาณตามแผนแยกรายการ" },
      summary: {
        en: "The budget plan has 53 lines adding up to ฿111,100, last edited on 1 July 2023.",
        th: "แผนงบประมาณมี 53 รายการ รวมได้ 111,100 บาท แก้ไขล่าสุดเมื่อ 1 กรกฎาคม 2566",
      },
      columns: [
        { key: "team", label: { en: "Area", th: "ฝ่าย" }, kind: "text" },
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "quantity", label: { en: "Quantity", th: "จำนวน" }, kind: "number" },
        {
          key: "unitCost",
          label: { en: "Cost per unit (baht, planned)", th: "ค่าใช้จ่ายต่อหน่วย (บาท, ตามแผน)" },
          kind: "money",
        },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "ประมาณการค่าใช้จ่าย (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      rows: planned,
      notes: [
        {
          en: "The plan's own grand total reads ฿156,000. Its lines add up to ฿111,100 and BIRSA has not explained the difference. This table shows the lines, so its total is ฿44,900 lower than the stated figure.",
          th: "ยอดรวมทั้งหมดที่แผนระบุไว้คือ 156,000 บาท แต่รายการย่อยรวมกันได้ 111,100 บาท และ BIRSA ไม่ได้อธิบายส่วนต่าง ตารางนี้แสดงตามรายการย่อย ยอดรวมจึงต่ำกว่าตัวเลขที่ระบุไว้ 44,900 บาท",
        },
        {
          en: "The plan states ฿9,600 for Club Day and ฿57,200 for student activities, but its four Club Day lines add up to ฿9,700. Two of those lines were updated on 28 July 2023 and the subtotal was not.",
          th: "แผนระบุยอด Club Day ไว้ 9,600 บาท และกิจกรรมนักศึกษา 57,200 บาท แต่รายการย่อยของ Club Day ทั้งสี่รายการรวมกันได้ 9,700 บาท โดยสองรายการแก้ไขเมื่อ 28 กรกฎาคม 2566 แต่ยอดรวมย่อยไม่ได้แก้ตาม",
        },
        {
          en: "PolSci Inter Union was added on 1 July 2023. A fourth Rights and welfare event on 6 and 14 October has no amount in the plan and is not counted.",
          th: "โครงการ Polsci Inter Union เพิ่มเข้ามาเมื่อ 1 กรกฎาคม 2566 ส่วนกิจกรรมของฝ่ายคุ้มครองสิทธิวันที่ 6 และ 14 ตุลาคมไม่มีจำนวนเงินในแผนจึงไม่นับรวม",
        },
        {
          en: "Debate lunch and snack lines do not equal quantity times unit cost in the plan, so the quantity and unit cost are left empty. Speaker fees for the two seminars cover 3 hours.",
          th: "รายการอาหารกลางวันและอาหารว่างของ Debate ในแผนไม่เท่ากับจำนวนคูณราคาต่อหน่วย จึงเว้นจำนวนและราคาต่อหน่วยไว้ ส่วนค่าวิทยากรของสัมมนาสองครั้งคิด 3 ชั่วโมง",
        },
      ],
      source: {
        en: "BIRSA budget plan 2023 to 2024 spreadsheet",
        th: "สเปรดชีตแผนงบประมาณ BIRSA ปี 2566",
      },
      period: { en: "Academic year 2023 to 2024", th: "ปีการศึกษา 2566" },
    },
    {
      id: "budget-by-area",
      title: { en: "Planned budget by area", th: "งบประมาณตามแผนแยกตามฝ่าย" },
      summary: {
        en: "Student activities take ฿57,300 of the ฿111,100 planned, ahead of academic work at ฿24,600.",
        th: "กิจกรรมนักศึกษาใช้ 57,300 บาทจาก 111,100 บาทที่วางแผนไว้ มากกว่างานวิชาการที่ 24,600 บาท",
      },
      columns: [
        { key: "team", label: { en: "Area", th: "ฝ่าย" }, kind: "text" },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "ประมาณการค่าใช้จ่าย (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      rows: [
        { team: team.activities, amount: 57300 },
        { team: team.academic, amount: 24600 },
        { team: team.running, amount: 19000 },
        { team: team.rights, amount: 10200 },
      ],
      notes: [
        {
          en: "Amounts are the sums of the lines in the planned budget table.",
          th: "จำนวนเงินคือผลรวมของรายการย่อยในตารางงบประมาณตามแผน",
        },
      ],
      source: {
        en: "BIRSA budget plan 2023 to 2024 spreadsheet",
        th: "สเปรดชีตแผนงบประมาณ BIRSA ปี 2566",
      },
      period: { en: "Academic year 2023 to 2024", th: "ปีการศึกษา 2566" },
    },
    {
      id: "unit-costs",
      title: { en: "Unit costs used in the plan", th: "ราคาต่อหน่วยที่ใช้ในแผน" },
      summary: {
        en: "The plan prices snacks at ฿30 a person, dinner at ฿50 a person and speakers at ฿600 or ฿1,200 an hour.",
        th: "แผนคิดค่าอาหารว่างคนละ 30 บาท อาหารเย็นคนละ 50 บาท และวิทยากรชั่วโมงละ 600 หรือ 1,200 บาท",
      },
      columns: [
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "unit", label: { en: "Unit", th: "หน่วย" }, kind: "text" },
        {
          key: "cost",
          label: { en: "Planned cost (baht)", th: "ราคาตามแผน (บาท)" },
          kind: "money",
        },
      ],
      rows: [
        {
          item: { en: "Snacks and drinks", th: "อาหารว่างและเครื่องดื่ม" },
          unit: { en: "Per person, one serving", th: "ต่อคน ต่อมื้อ" },
          cost: 30,
        },
        {
          item: { en: "Dinner", th: "อาหารเย็น" },
          unit: { en: "Per person, one meal", th: "ต่อคน ต่อมื้อ" },
          cost: 50,
        },
        {
          item: { en: "Speaker, outside the university", th: "วิทยากรภายนอกมหาวิทยาลัย" },
          unit: { en: "Per speaker, per hour", th: "ต่อคน ต่อชั่วโมง" },
          cost: 1200,
        },
        {
          item: { en: "Speaker, university staff", th: "วิทยากรบุคลากรมหาวิทยาลัย" },
          unit: { en: "Per speaker, per hour", th: "ต่อคน ต่อชั่วโมง" },
          cost: 600,
        },
      ],
      notes: [
        {
          en: "The speaker rates come from the plan lines and from the Rights seminar brief.",
          th: "อัตราค่าวิทยากรมาจากรายการในแผนและเอกสารสรุปโครงการสัมมนาด้านสิทธิ",
        },
      ],
      source: {
        en: "BIRSA budget plan 2023 to 2024 and the Rights seminar brief",
        th: "แผนงบประมาณ BIRSA ปี 2566 และเอกสารสรุปโครงการสัมมนาด้านสิทธิ",
      },
      period: { en: "Academic year 2023 to 2024", th: "ปีการศึกษา 2566" },
    },
  ],
};
