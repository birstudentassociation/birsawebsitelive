import type { Topic } from "@/lib/open-data";

const openHouse = { en: "Open House", th: "Open House" };
const jobFair = { en: "Job Fair", th: "Job Fair" };
const clubDay = { en: "Club Day", th: "Club Day" };
const movie = { en: "Monthly Movie", th: "Monthly Movie" };
const halloween = { en: "Halloween Day", th: "Halloween Day" };
const valentine = { en: "Valentine Day", th: "Valentine Day" };
const meetAjarns = { en: "Meet Ajarns", th: "Meet Ajarns" };

const equipment = { en: "Equipment", th: "ค่าอุปกรณ์" };
const miscellaneous = { en: "Miscellaneous", th: "ค่าเบ็ดเตล็ด" };
const dinner = { en: "Dinner", th: "ค่าอาหารเย็น" };

export const money: Topic = {
  slug: "money",
  title: {
    en: "Where BIRSA's money was planned to go",
    th: "เงินของ BIRSA วางแผนไว้ว่าจะใช้ไปกับอะไร",
  },
  summary: {
    en: "BIRSA planned to spend ฿56,542 on seven student activities. Its own ledger records far less.",
    th: "BIRSA วางแผนใช้เงิน 56,542 บาท กับกิจกรรมนักศึกษาเจ็ดกิจกรรม แต่บัญชีของ BIRSA เองบันทึกไว้น้อยกว่ามาก",
  },
  mainPoints: [
    {
      en: "The 2025 to 2026 budget plan for seven student activities adds up to ฿56,542.",
      th: "แผนงบประมาณปีการศึกษา 2568 สำหรับกิจกรรมนักศึกษาเจ็ดกิจกรรมรวมได้ 56,542 บาท",
    },
    {
      en: "Open House is the largest project at ฿30,000, more than half of the plan.",
      th: "Open House เป็นโครงการที่ใช้งบมากที่สุด 30,000 บาท เกินครึ่งหนึ่งของแผน",
    },
    {
      en: "Job Fair and Club Day come next, at ฿8,500 and ฿8,050.",
      th: "รองลงมาคือ Job Fair 8,500 บาท และ Club Day 8,050 บาท",
    },
    {
      en: "BIRSA's ledger records ฿2,003.28 of spending, less than 4% of the plan.",
      th: "บัญชีของ BIRSA บันทึกรายจ่าย 2,003.28 บาท ไม่ถึงร้อยละ 4 ของแผน",
    },
    {
      en: "The ledger ends at ฿1,006.79 left at the end of March 2026.",
      th: "บัญชีสิ้นสุดที่เงินคงเหลือ 1,006.79 บาท ณ สิ้นเดือนมีนาคม 2569",
    },
  ],
  headlines: [
    {
      value: "฿56,542",
      label: { en: "Planned spending", th: "รายจ่ายตามแผน" },
      context: { en: "Seven student activities", th: "กิจกรรมนักศึกษาเจ็ดกิจกรรม" },
    },
    {
      value: "฿30,000",
      label: { en: "Planned for Open House", th: "งบที่วางแผนไว้สำหรับ Open House" },
      context: { en: "The largest project", th: "โครงการที่ใช้งบมากที่สุด" },
    },
    {
      value: "฿2,003.28",
      label: { en: "Spending in BIRSA's ledger", th: "รายจ่ายในบัญชีของ BIRSA" },
      context: { en: "June 2025 to March 2026", th: "มิถุนายน 2568 ถึงมีนาคม 2569" },
    },
    {
      value: "฿1,006.79",
      label: { en: "Left at the end of March 2026", th: "เงินคงเหลือสิ้นเดือนมีนาคม 2569" },
    },
  ],
  warning: {
    en: "The budget is a plan, not what was spent. BIRSA's ledger records only a small part of it.",
    th: "งบประมาณเป็นเพียงแผน ไม่ใช่ยอดที่ใช้จริง บัญชีของ BIRSA บันทึกไว้เพียงส่วนน้อยของแผน",
  },
  chart: {
    datasetId: "planned-budget",
    labelKey: "project",
    valueKey: "amount",
    groupBy: true,
    title: {
      en: "Open House takes more than half of planned spending",
      th: "Open House ใช้งบเกินครึ่งหนึ่งของรายจ่ายตามแผน",
    },
    subtitle: {
      en: "Planned spending in baht by project, 2025 to 2026",
      th: "รายจ่ายตามแผนเป็นบาท แยกตามโครงการ ปีการศึกษา 2568",
    },
    alt: {
      en: "A bar chart showing that Open House is planned at 30,000 baht, well above Job Fair at 8,500 baht and every other student activity.",
      th: "แผนภูมิแท่งแสดงว่า Open House วางแผนไว้ 30,000 บาท สูงกว่า Job Fair ที่ 8,500 บาท และกิจกรรมนักศึกษาอื่นทุกกิจกรรมอย่างชัดเจน",
    },
  },
  datasets: [
    {
      id: "planned-budget",
      title: { en: "Planned budget by line", th: "งบประมาณตามแผนแยกรายการ" },
      summary: {
        en: "The budget plan lists 19 lines for student activities adding up to ฿56,542, last edited on 20 June 2025.",
        th: "แผนงบประมาณมี 19 รายการสำหรับกิจกรรมนักศึกษา รวมได้ 56,542 บาท แก้ไขล่าสุดเมื่อวันที่ 20 มิถุนายน 2568",
      },
      columns: [
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "quantity", label: { en: "Quantity", th: "จำนวน" }, kind: "number" },
        {
          key: "unitCost",
          label: { en: "Cost per unit (baht)", th: "ค่าใช้จ่ายต่อหน่วย (บาท)" },
          kind: "money",
        },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "ประมาณการค่าใช้จ่าย (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      declaredTotal: { amount: 56542 },
      rows: [
        {
          project: openHouse,
          item: { en: "Handbook", th: "ค่า handbook" },
          quantity: null,
          unitCost: null,
          amount: 10000,
        },
        {
          project: openHouse,
          item: { en: "Speakers", th: "ค่าวิทยากร" },
          quantity: null,
          unitCost: null,
          amount: 9600,
        },
        {
          project: openHouse,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 7000,
        },
        {
          project: openHouse,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 3400,
        },
        {
          project: jobFair,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 5000,
        },
        {
          project: jobFair,
          item: dinner,
          quantity: 30,
          unitCost: 50,
          amount: 1500,
        },
        {
          project: jobFair,
          item: {
            en: "Speaker fees (2 speakers, 1 hour)",
            th: "ค่าตอบแทนวิทยากร (2 คน, 1 ชั่วโมง)",
          },
          quantity: 2,
          unitCost: 600,
          amount: 1200,
        },
        {
          project: jobFair,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 800,
        },
        {
          project: clubDay,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 4300,
        },
        {
          project: clubDay,
          item: dinner,
          quantity: 55,
          unitCost: 50,
          amount: 2750,
        },
        {
          project: clubDay,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 1000,
        },
        {
          project: movie,
          item: {
            en: "Soft drinks, cups and ice for 6 sessions",
            th: "น้ำอัดลม แก้วน้ำ และน้ำแข็ง สำหรับ 6 ครั้ง",
          },
          quantity: 6,
          unitCost: 732,
          amount: 4392,
        },
        {
          project: halloween,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 1000,
        },
        {
          project: halloween,
          item: dinner,
          quantity: 20,
          unitCost: 50,
          amount: 1000,
        },
        {
          project: halloween,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 800,
        },
        {
          project: valentine,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 1000,
        },
        {
          project: valentine,
          item: dinner,
          quantity: 20,
          unitCost: 50,
          amount: 1000,
        },
        {
          project: valentine,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 800,
        },
        {
          project: meetAjarns,
          item: {
            en: "Equipment (room 103, no cost listed)",
            th: "ค่าอุปกรณ์ (ห้อง 103, ไม่มีค่าใช้จ่าย)",
          },
          quantity: null,
          unitCost: null,
          amount: 0,
        },
      ],
      notes: [
        {
          en: "The plan states a Job Fair total of ฿9,500 and a student activities total of ฿57,542, but its four Job Fair lines add up to ฿8,500. This table shows the lines as written, so its total is ฿1,000 lower than the plan's own.",
          th: "แผนระบุยอดรวม Job Fair ไว้ 9,500 บาท และยอดรวมกิจกรรมนักศึกษา 57,542 บาท แต่รายการย่อยของ Job Fair ทั้งสี่รายการรวมได้ 8,500 บาท ตารางนี้แสดงรายการตามที่เขียนไว้ ยอดรวมจึงต่ำกว่ายอดในแผน 1,000 บาท",
        },
        {
          en: "Monthly Movie is planned at ฿732 a session for 3 sessions a term over 2 terms. BIRSA's Master Sheet Mission tab gives ฿2,000 instead. This page uses the budget plan.",
          th: "Monthly Movie วางแผนไว้ครั้งละ 732 บาท เทอมละ 3 ครั้ง รวม 2 เทอม ส่วนแท็บ Mission ใน Master Sheet ของ BIRSA ระบุ 2,000 บาท หน้านี้ใช้ตัวเลขจากแผนงบประมาณ",
        },
        {
          en: "The plan mixes figures per session, per term and per year. In the drinks line, 1 pack at ฿216 is shown with a subtotal of ฿432. The session total of ฿732 follows the subtotals.",
          th: "แผนปนตัวเลขต่อครั้ง ต่อเทอม และต่อปี ในรายการน้ำอัดลม 1 แพ็กราคา 216 บาท แต่ยอดรวมย่อยคือ 432 บาท ยอด 732 บาทต่อครั้งคิดตามยอดรวมย่อย",
        },
        {
          en: "Lines without a quantity are lump sums in the plan. Equipment for Monthly Movie and Meet Ajarns is room 103 with no cost listed.",
          th: "รายการที่ไม่มีจำนวนเป็นยอดเหมาในแผน ค่าอุปกรณ์ของ Monthly Movie และ Meet Ajarns ใช้ห้อง 103 โดยไม่ระบุค่าใช้จ่าย",
        },
      ],
      source: {
        en: "BIRSA 2025 to 2026 budget plan spreadsheet",
        th: "สเปรดชีตแผนงบประมาณ BIRSA ปี 2568",
      },
      period: { en: "Academic year 2025 to 2026", th: "ปีการศึกษา 2568" },
    },
    {
      id: "recorded-transactions",
      title: { en: "Transactions in BIRSA's ledger", th: "รายการในบัญชีของ BIRSA" },
      summary: {
        en: "The ledger records 15 entries from June 2025 to March 2026, with spending of ฿2,003.28.",
        th: "บัญชีบันทึก 15 รายการ ตั้งแต่มิถุนายน 2568 ถึงมีนาคม 2569 มีรายจ่าย 2,003.28 บาท",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "type", label: { en: "Type", th: "ประเภท" }, kind: "text" },
        { key: "category", label: { en: "Category", th: "หมวด" }, kind: "text" },
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "amount", label: { en: "Amount (baht)", th: "จำนวนเงิน (บาท)" }, kind: "money" },
      ],
      rows: [
        {
          date: "2025-06-14",
          type: { en: "Opening balance", th: "ยอดยกมา" },
          category: { en: "Savings from 2024", th: "เงินออมจากปี 2567" },
          item: { en: "BIRSA 2024 savings", th: "เงินออม BIRSA ปี 2567" },
          amount: 6193.46,
        },
        {
          date: "2025-06-14",
          type: { en: "Expense", th: "รายจ่าย" },
          category: { en: "Not recorded", th: "ไม่ได้ระบุ" },
          item: { en: "Minecraft, first quarter", th: "Minecraft ไตรมาสที่ 1" },
          amount: 788.28,
        },
        {
          date: "2025-07-01",
          type: { en: "Opening balance", th: "ยอดยกมา" },
          category: { en: "Savings carried over", th: "เงินออมยกมา" },
          item: { en: "June savings", th: "เงินออมเดือนมิถุนายน" },
          amount: 5405.18,
        },
        {
          date: "2026-01",
          type: { en: "Opening balance", th: "ยอดยกมา" },
          category: { en: "Savings carried over", th: "เงินออมยกมา" },
          item: {
            en: "Savings at the start of the January tab",
            th: "เงินออมตอนต้นแท็บเดือนมกราคม",
          },
          amount: 451.79,
        },
        {
          date: "2026-01-19",
          type: { en: "Expense", th: "รายจ่าย" },
          category: { en: "Merchandise", th: "สินค้าที่ระลึก" },
          item: { en: "Merchandise pencils", th: "ดินสอที่ระลึก" },
          amount: 490,
        },
        {
          date: "2026-02-18",
          type: { en: "Income", th: "รายรับ" },
          category: { en: "Merchandise", th: "สินค้าที่ระลึก" },
          item: { en: "Merchandise pencils", th: "ดินสอที่ระลึก" },
          amount: 455,
        },
        {
          date: "2026-02-18",
          type: { en: "Income", th: "รายรับ" },
          category: { en: "Merchandise", th: "สินค้าที่ระลึก" },
          item: { en: "Merchandise keychains", th: "พวงกุญแจที่ระลึก" },
          amount: 100,
        },
        {
          date: "2026-02-18",
          type: { en: "Income", th: "รายรับ" },
          category: { en: "Merchandise", th: "สินค้าที่ระลึก" },
          item: { en: "Tea works merchandise", th: "สินค้าที่ระลึก Tea works" },
          amount: 140,
        },
        {
          date: "2026-03-01",
          type: { en: "Opening balance", th: "ยอดยกมา" },
          category: { en: "Savings carried over", th: "เงินออมยกมา" },
          item: { en: "January savings", th: "เงินออมเดือนมกราคม" },
          amount: 1331.79,
        },
        {
          date: "2026-03-04",
          type: { en: "Expense", th: "รายจ่าย" },
          category: { en: "Merchandise", th: "สินค้าที่ระลึก" },
          item: { en: "Job Fair stickers", th: "สติกเกอร์ Job Fair" },
          amount: 400,
        },
        {
          date: "2026-03-05",
          type: { en: "Income", th: "รายรับ" },
          category: { en: "Merchandise", th: "สินค้าที่ระลึก" },
          item: { en: "Merchandise keychains, second batch", th: "พวงกุญแจที่ระลึก ล็อตที่สอง" },
          amount: 150,
        },
        {
          date: "2026-03-16",
          type: { en: "Expense", th: "รายจ่าย" },
          category: { en: "Transport", th: "การขนส่ง" },
          item: { en: "Postage within Bangkok", th: "ค่าส่งพัสดุในกรุงเทพฯ" },
          amount: 37,
        },
        {
          date: "2026-03-21",
          type: { en: "Expense", th: "รายจ่าย" },
          category: { en: "Transport", th: "การขนส่ง" },
          item: { en: "Delivery fee for snacks", th: "ค่าจัดส่งขนม" },
          amount: 98,
        },
        {
          date: "2026-03-21",
          type: { en: "Expense", th: "รายจ่าย" },
          category: { en: "Equipment", th: "อุปกรณ์" },
          item: { en: "USB C to Lightning cable", th: "สายชาร์จ USB C เป็น Lightning" },
          amount: 190,
        },
        {
          date: "2026-03-29",
          type: { en: "Owed, outside the totals", th: "ค้างจ่าย นอกยอดรวม" },
          category: { en: "Merchandise", th: "สินค้าที่ระลึก" },
          item: { en: "BIRSA shirts", th: "เสื้อ BIRSA" },
          amount: 630,
        },
      ],
      notes: [
        {
          en: "Opening balances are savings carried from an earlier tab, not new income. Do not add them to the income rows.",
          th: "ยอดยกมาคือเงินออมที่ยกมาจากแท็บก่อนหน้า ไม่ใช่รายรับใหม่ จึงไม่ควรนำไปรวมกับแถวรายรับ",
        },
        {
          en: "The shirt amount of ฿630 is recorded as a debt and kept outside the tracker's totals. It is not counted in the ฿2,003.28 of spending.",
          th: "ค่าเสื้อ 630 บาทบันทึกเป็นหนี้และอยู่นอกยอดรวมของบัญชี จึงไม่นับรวมในรายจ่าย 2,003.28 บาท",
        },
        {
          en: "The ledger has no tabs for August to December 2025, February 2026 or April to June 2026. Those months are not recorded.",
          th: "บัญชีไม่มีแท็บของเดือนสิงหาคมถึงธันวาคม 2568 กุมภาพันธ์ 2569 และเมษายนถึงมิถุนายน 2569 จึงไม่มีบันทึกของเดือนเหล่านั้น",
        },
        {
          en: "The balance was ฿5,405.18 in July 2025 and ฿451.79 at the start of the January tab. The ledger does not explain the ฿4,953.39 difference.",
          th: "ยอดคงเหลือเดือนกรกฎาคม 2568 คือ 5,405.18 บาท และ 451.79 บาทตอนต้นแท็บเดือนมกราคม บัญชีไม่ได้อธิบายส่วนต่าง 4,953.39 บาท",
        },
        {
          en: "The March tab shows ฿1,006.79 left, which is ฿1,331.79 less ฿325 of spending. Errors marked #REF! in the source were not carried over.",
          th: "แท็บเดือนมีนาคมแสดงเงินคงเหลือ 1,006.79 บาท คือ 1,331.79 บาท หักรายจ่าย 325 บาท ข้อผิดพลาด #REF! ในต้นฉบับไม่ได้นำมาใส่ไว้",
        },
        {
          en: "The pencils and Job Fair stickers also appear in the ledger's debt list. The ledger does not say whether they were settled.",
          th: "ดินสอที่ระลึกและสติกเกอร์ Job Fair ปรากฏในรายการหนี้ของบัญชีด้วย บัญชีไม่ได้ระบุว่าชำระแล้วหรือไม่",
        },
      ],
      source: {
        en: "BIRSA account tracker spreadsheet",
        th: "สเปรดชีตบัญชีรายรับรายจ่ายของ BIRSA",
      },
      period: { en: "June 2025 to March 2026", th: "มิถุนายน 2568 ถึงมีนาคม 2569" },
    },
  ],
};
