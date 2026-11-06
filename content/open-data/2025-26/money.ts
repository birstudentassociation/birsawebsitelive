import type { Topic } from "@/lib/open-data";

const studentActivities = { en: "Student activities", th: "กิจกรรมนักศึกษา" };
const organisation = { en: "Organisation development", th: "พัฒนาองค์กร" };

const commonRoom = { en: "Common room", th: "ห้อง Common" };
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
    en: "BIRSA planned to spend ฿229,822, three quarters of it on the common room. Its own ledger records far less.",
    th: "BIRSA วางแผนใช้เงิน 229,822 บาท สามในสี่เป็นห้อง Common แต่บัญชีของ BIRSA เองบันทึกไว้น้อยกว่ามาก",
  },
  mainPoints: [
    {
      en: "The 2568 to 2569 budget plan totals ฿229,822.",
      th: "แผนงบประมาณปี 2568 รวมทั้งหมด 229,822 บาท",
    },
    {
      en: "The common room accounts for ฿173,280 of the plan, which is 75% of the total.",
      th: "ห้อง Common คิดเป็น 173,280 บาท หรือร้อยละ 75 ของแผนทั้งหมด",
    },
    {
      en: "Seven student activities were planned at ฿56,542 in total, led by Open House at ฿30,000.",
      th: "กิจกรรมนักศึกษาเจ็ดกิจกรรมวางแผนไว้รวม 56,542 บาท มากที่สุดคือ Open House 30,000 บาท",
    },
    {
      en: "BIRSA's ledger records ฿2,003.28 of spending, less than 1% of the plan.",
      th: "บัญชีของ BIRSA บันทึกรายจ่าย 2,003.28 บาท ซึ่งไม่ถึงร้อยละ 1 ของแผน",
    },
    {
      en: "The ledger ends at ฿1,006.79 left at the end of March 2569.",
      th: "บัญชีสิ้นสุดที่เงินคงเหลือ 1,006.79 บาท ณ สิ้นเดือนมีนาคม 2569",
    },
  ],
  headlines: [
    {
      value: "฿229,822",
      label: { en: "Planned spending", th: "รายจ่ายตามแผน" },
      context: { en: "Budget plan, 2025 to 2026", th: "แผนงบประมาณ ปีการศึกษา 2568" },
    },
    {
      value: "75%",
      label: { en: "Planned for the common room", th: "สัดส่วนที่วางแผนไว้สำหรับห้อง Common" },
      context: { en: "฿173,280 of ฿229,822", th: "173,280 บาท จาก 229,822 บาท" },
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
    en: "The budget is a plan, not what was spent. BIRSA's ledger records only a small fraction of it, and the common room items do not appear in the ledger at all, so it does not show how they were paid for.",
    th: "งบประมาณเป็นเพียงแผน ไม่ใช่ยอดที่ใช้จริง บัญชีของ BIRSA บันทึกไว้เพียงส่วนเล็กน้อย และรายการของห้อง Common ไม่ปรากฏในบัญชีเลย จึงไม่ทราบว่าจ่ายด้วยเงินจากแหล่งใด",
  },
  chart: {
    datasetId: "planned-budget",
    labelKey: "project",
    valueKey: "amount",
    groupBy: true,
    title: {
      en: "The common room is three quarters of planned spending",
      th: "ห้อง Common คือสามในสี่ของรายจ่ายตามแผน",
    },
    subtitle: {
      en: "Planned spending in baht by project, 2025 to 2026",
      th: "รายจ่ายตามแผนเป็นบาท แยกตามโครงการ ปีการศึกษา 2568",
    },
    alt: {
      en: "A bar chart showing that the common room is planned at 173,280 baht, far above Open House at 30,000 baht and every other project.",
      th: "แผนภูมิแท่งแสดงว่าห้อง Common วางแผนไว้ 173,280 บาท สูงกว่า Open House ที่ 30,000 บาท และโครงการอื่นทุกโครงการอย่างมาก",
    },
  },
  datasets: [
    {
      id: "planned-budget",
      title: { en: "Planned budget by line", th: "งบประมาณตามแผนแยกรายการ" },
      summary: {
        en: "The budget plan lists 23 lines adding up to ฿229,822, last edited on 20 June 2568.",
        th: "แผนงบประมาณมี 23 รายการ รวมได้ 229,822 บาท แก้ไขล่าสุดเมื่อวันที่ 20 มิถุนายน 2568",
      },
      columns: [
        { key: "division", label: { en: "Division", th: "ฝ่าย" }, kind: "text" },
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
      declaredTotal: { amount: 229822 },
      rows: [
        {
          division: organisation,
          project: commonRoom,
          item: { en: "Television (Sony A95L Series)", th: "โทรทัศน์ (Sony A95L Series)" },
          quantity: null,
          unitCost: null,
          amount: 134990,
        },
        {
          division: organisation,
          project: commonRoom,
          item: { en: "PlayStation 5", th: "PlayStation 5" },
          quantity: null,
          unitCost: null,
          amount: 29490,
        },
        {
          division: organisation,
          project: commonRoom,
          item: {
            en: "Table tennis table (GRAND SPORT, MDF 15 mm)",
            th: "โต๊ะเทเบิลเทนนิส (GRAND SPORT, MDF 15 mm)",
          },
          quantity: null,
          unitCost: null,
          amount: 4900,
        },
        {
          division: organisation,
          project: commonRoom,
          item: { en: "Pool table (model BT 100 US)", th: "โต๊ะพูล (รุ่น BT 100 US)" },
          quantity: null,
          unitCost: null,
          amount: 3900,
        },
        {
          division: studentActivities,
          project: openHouse,
          item: { en: "Handbook", th: "ค่า handbook" },
          quantity: null,
          unitCost: null,
          amount: 10000,
        },
        {
          division: studentActivities,
          project: openHouse,
          item: { en: "Speakers", th: "ค่าวิทยากร" },
          quantity: null,
          unitCost: null,
          amount: 9600,
        },
        {
          division: studentActivities,
          project: openHouse,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 7000,
        },
        {
          division: studentActivities,
          project: openHouse,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 3400,
        },
        {
          division: studentActivities,
          project: jobFair,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 5000,
        },
        {
          division: studentActivities,
          project: jobFair,
          item: dinner,
          quantity: 30,
          unitCost: 50,
          amount: 1500,
        },
        {
          division: studentActivities,
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
          division: studentActivities,
          project: jobFair,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 800,
        },
        {
          division: studentActivities,
          project: clubDay,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 4300,
        },
        {
          division: studentActivities,
          project: clubDay,
          item: dinner,
          quantity: 55,
          unitCost: 50,
          amount: 2750,
        },
        {
          division: studentActivities,
          project: clubDay,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 1000,
        },
        {
          division: studentActivities,
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
          division: studentActivities,
          project: halloween,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 1000,
        },
        {
          division: studentActivities,
          project: halloween,
          item: dinner,
          quantity: 20,
          unitCost: 50,
          amount: 1000,
        },
        {
          division: studentActivities,
          project: halloween,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 800,
        },
        {
          division: studentActivities,
          project: valentine,
          item: equipment,
          quantity: null,
          unitCost: null,
          amount: 1000,
        },
        {
          division: studentActivities,
          project: valentine,
          item: dinner,
          quantity: 20,
          unitCost: 50,
          amount: 1000,
        },
        {
          division: studentActivities,
          project: valentine,
          item: miscellaneous,
          quantity: null,
          unitCost: null,
          amount: 800,
        },
        {
          division: studentActivities,
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
          en: "The plan states a Job Fair total of ฿9,500 and a grand total of ฿230,822, but its four Job Fair lines add up to ฿8,500. This table shows the lines as written, so its total is ฿1,000 lower than the plan's own.",
          th: "แผนระบุยอดรวม Job Fair ไว้ 9,500 บาท และยอดรวมทั้งหมด 230,822 บาท แต่รายการย่อยของ Job Fair ทั้งสี่รายการรวมได้ 8,500 บาท ตารางนี้แสดงรายการตามที่เขียนไว้ ยอดรวมจึงต่ำกว่ายอดในแผน 1,000 บาท",
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
        en: "The ledger records 15 entries from June 2568 to March 2569, with spending of ฿2,003.28.",
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
          en: "The balance was ฿5,405.18 in July 2568 and ฿451.79 at the start of the January tab. The ledger does not explain the ฿4,953.39 difference.",
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
