import type { Bilingual, Row, Topic } from "@/lib/open-data";

const futureDay: Bilingual = { en: "BIR The Future", th: "BIR The Future" };
const esports: Bilingual = { en: "The Rise of Val-rO-V", th: "The Rise of Val-rO-V" };
const rightsTalk: Bilingual = {
  en: "Rights protection talk",
  th: "เสวนาพิทักษ์สิทธิ",
};

const hygiene: Bilingual = { en: "Hygiene", th: "หมวดอนามัย" };
const classroom: Bilingual = { en: "Classroom", th: "หมวดห้องเรียน" };
const library: Bilingual = { en: "Library", th: "หมวดห้องสมุด" };
const vending: Bilingual = {
  en: "Welfare vending and snack machine",
  th: "หมวดตู้น้ำและขนมสวัสดิการ",
};
const shuttle: Bilingual = { en: "MRT shuttle bus", th: "หมวดรถรับส่ง MRT" };

function line(
  project: Bilingual,
  item: Bilingual,
  quantity: number | null,
  unitCost: number | null,
  amount: number
): Row {
  return { project, item, quantity, unitCost, amount };
}

function welfare(category: Bilingual, item: Bilingual, amount: number | null): Row {
  return { category, item, amount };
}

export const money: Topic = {
  slug: "money",
  title: {
    en: "Where BIRSA's money was planned to go",
    th: "เงินของ BIRSA วางแผนไว้ว่าจะใช้ไปกับอะไร",
  },
  summary: {
    en: "BIRSA's plans total ฿168,000 for welfare and ฿45,150 for three projects. It holds no record of actual spending.",
    th: "แผนของ BIRSA ได้แก่งบสวัสดิการ 168,000 บาท และงบสามโครงการ 45,150 บาท BIRSA ไม่มีบันทึกรายจ่ายจริง",
  },
  headlines: [
    {
      value: "฿168,000",
      label: { en: "Planned welfare budget", th: "งบสวัสดิการตามแผน" },
      context: { en: "As stated in the plan", th: "ตามยอดที่ระบุในแผน" },
    },
    {
      value: "฿45,150",
      label: { en: "Planned for three projects", th: "งบตามแผนของสามโครงการ" },
      context: {
        en: "BIR The Future, a talk and an esports event",
        th: "BIR The Future เสวนา และอีสปอร์ต",
      },
    },
    {
      value: "฿35,000",
      label: { en: "Planned for BIR The Future", th: "งบที่วางแผนไว้สำหรับ BIR The Future" },
      context: { en: "The largest project plan", th: "แผนโครงการที่ใหญ่ที่สุด" },
    },
  ],
  warning: {
    en: "Every amount here is a plan. BIRSA holds no account of income or spending for this year, so we cannot say what was spent.",
    th: "ทุกจำนวนในหน้านี้เป็นเพียงแผน BIRSA ไม่มีบัญชีรายรับรายจ่ายของปีนี้ จึงบอกไม่ได้ว่าใช้เงินไปเท่าใด",
  },
  mainPoints: [
    {
      en: "The welfare plan states a total of ฿168,000 across five categories.",
      th: "แผนสวัสดิการระบุยอดรวม 168,000 บาท ใน 5 หมวด",
    },
    {
      en: "The priced lines in the welfare plan add up to ฿164,500. The library total is ฿3,500 more than its lines.",
      th: "รายการที่มีราคาในแผนสวัสดิการรวมได้ 164,500 บาท ยอดหมวดห้องสมุดมากกว่ารายการของหมวด 3,500 บาท",
    },
    {
      en: "Classroom items are the largest welfare category at ฿60,000, mostly air purifiers.",
      th: "หมวดห้องเรียนใช้งบมากที่สุดในแผนสวัสดิการ 60,000 บาท ส่วนใหญ่เป็นเครื่องฟอกอากาศ",
    },
    {
      en: "Three projects were planned at ฿45,150 in total, led by BIR The Future at ฿35,000.",
      th: "สามโครงการวางแผนไว้รวม 45,150 บาท โดย BIR The Future ใช้มากที่สุด 35,000 บาท",
    },
    {
      en: "BIRSA's meeting of 12 April 2022 recorded that sanitary pad costs could not be reimbursed.",
      th: "การประชุม BIRSA วันที่ 12 เมษายน 2565 บันทึกว่าเบิกค่าผ้าอนามัยไม่ได้",
    },
  ],
  chart: {
    datasetId: "welfare-budget-by-category",
    labelKey: "category",
    valueKey: "amount",
    title: {
      en: "Classroom items are the largest part of the welfare plan",
      th: "หมวดห้องเรียนเป็นส่วนที่ใหญ่ที่สุดของแผนสวัสดิการ",
    },
    subtitle: {
      en: "Planned welfare budget in baht by category, 2021 to 2022",
      th: "งบสวัสดิการตามแผนเป็นบาท แยกตามหมวด ปีการศึกษา 2564",
    },
    alt: {
      en: "A bar chart showing that classroom items are planned at 60,000 baht, the most of five welfare categories, ahead of hygiene at 35,000 baht.",
      th: "แผนภูมิแท่งแสดงว่าหมวดห้องเรียนวางแผนไว้ 60,000 บาท สูงที่สุดในห้าหมวดของงบสวัสดิการ ตามด้วยหมวดอนามัย 35,000 บาท",
    },
  },
  datasets: [
    {
      id: "welfare-budget-by-category",
      title: {
        en: "Planned welfare budget by category",
        th: "งบสวัสดิการตามแผนแยกตามหมวด",
      },
      summary: {
        en: "The welfare plan states ฿168,000 across five categories, with classroom items the largest at ฿60,000.",
        th: "แผนสวัสดิการระบุยอด 168,000 บาท ใน 5 หมวด โดยหมวดห้องเรียนมากที่สุด 60,000 บาท",
      },
      columns: [
        { key: "category", label: { en: "Category", th: "หมวด" }, kind: "text" },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "งบตามแผน (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      declaredTotal: { amount: 168000 },
      rows: [
        { category: classroom, amount: 60000 },
        { category: hygiene, amount: 35000 },
        { category: library, amount: 30000 },
        { category: shuttle, amount: 30000 },
        { category: vending, amount: 13000 },
      ],
      notes: [
        {
          en: "These are the totals written in the plan. The library total of ฿30,000 is ฿3,500 more than its priced lines, so the lines in the next table add up to less.",
          th: "ยอดเหล่านี้เป็นยอดที่เขียนไว้ในแผน ยอดหมวดห้องสมุด 30,000 บาท มากกว่ารายการที่มีราคาของหมวด 3,500 บาท ตารางถัดไปจึงรวมได้น้อยกว่า",
        },
        {
          en: "This is a request for faculty welfare money, not money BIRSA received. No record shows it was approved.",
          th: "นี่เป็นคำขอใช้เงินสวัสดิการของคณะ ไม่ใช่เงินที่ BIRSA ได้รับ และไม่มีบันทึกว่าได้รับอนุมัติ",
        },
      ],
      source: {
        en: "BIRSA's welfare budget plan for the faculty",
        th: "แผนงบประมาณสวัสดิการของ BIRSA ที่เสนอต่อคณะ",
      },
      period: { en: "Academic year 2021 to 2022", th: "ปีการศึกษา 2564" },
    },
    {
      id: "welfare-budget-lines",
      title: {
        en: "Planned welfare budget by line",
        th: "งบสวัสดิการตามแผนแยกรายการ",
      },
      summary: {
        en: "The welfare plan lists 12 lines. Ten have a price and add up to ฿164,500, and two have no price.",
        th: "แผนสวัสดิการมี 12 รายการ โดย 10 รายการมีราคา รวมได้ 164,500 บาท และอีก 2 รายการไม่มีราคา",
      },
      columns: [
        { key: "category", label: { en: "Category", th: "หมวด" }, kind: "text" },
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "งบตามแผน (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      rows: [
        welfare(classroom, { en: "PM2.5 air purifiers", th: "เครื่องฟอกอากาศ PM2.5" }, 50000),
        welfare(
          classroom,
          { en: "Left-handed lecture desks", th: "โต๊ะเลคเชอร์สำหรับคนถนัดซ้าย" },
          10000
        ),
        welfare(
          classroom,
          {
            en: "Mobile data SIMs for students learning from far away",
            th: "ซิมอินเทอร์เน็ตสำหรับนักศึกษาที่เรียนทางไกล",
          },
          null
        ),
        welfare(
          hygiene,
          {
            en: "Sanitary pads in 4 restrooms, ฿5,000 a month for 6 months",
            th: "ผ้าอนามัยในห้องน้ำ 4 ห้อง เดือนละ 5,000 บาท เป็นเวลา 6 เดือน",
          },
          30000
        ),
        welfare(
          hygiene,
          {
            en: "Other restroom items, such as bins, tissue and soap",
            th: "สิ่งอำนวยความสะดวกอื่นในห้องน้ำ เช่น ถังขยะ กระดาษชำระ สบู่",
          },
          5000
        ),
        welfare(
          library,
          { en: "New desks with USB charging", th: "โต๊ะใหม่ที่มีช่องชาร์จ USB" },
          20000
        ),
        welfare(
          library,
          { en: "Whiteboards for two meeting rooms", th: "ไวท์บอร์ดในห้องประชุม 2 ห้อง" },
          5000
        ),
        welfare(
          library,
          {
            en: "Loan items such as USB cables and power banks",
            th: "อุปกรณ์ให้ยืม เช่น สาย USB และ power bank",
          },
          1500
        ),
        welfare(library, { en: "Photocopier and WiFi", th: "ตู้ถ่ายเอกสารและ WiFi" }, null),
        welfare(shuttle, { en: "Hire of the shuttle bus", th: "ค่าจ้างเดินรถ" }, 30000),
        welfare(vending, { en: "Upkeep of the machine", th: "งบบำรุงตู้" }, 10000),
        welfare(vending, { en: "Finding a service provider", th: "งบจัดหาผู้ให้บริการ" }, 3000),
      ],
      notes: [
        {
          en: "The plan states ฿168,000 in total. Its priced lines add up to ฿164,500, so the table total follows the lines. The ฿3,500 gap is in the library category.",
          th: "แผนระบุยอดรวม 168,000 บาท แต่รายการที่มีราคารวมได้ 164,500 บาท ยอดรวมของตารางจึงใช้ตามรายการ ส่วนต่าง 3,500 บาทอยู่ในหมวดห้องสมุด",
        },
        {
          en: "Mobile data SIMs and the photocopier have no price in the plan, so their cells are empty. The plan says the photocopier depends on a provider being interested.",
          th: "ซิมอินเทอร์เน็ตและตู้ถ่ายเอกสารไม่มีราคาในแผน จึงเว้นช่องว่างไว้ แผนระบุว่าตู้ถ่ายเอกสารขึ้นอยู่กับว่ามีผู้สนใจให้บริการหรือไม่",
        },
        {
          en: "The meeting of 26 November 2021 reports the left-handed desks as done. The meeting of 12 April 2022 records that the sanitary pads could not be reimbursed. No cost is recorded for either.",
          th: "การประชุมวันที่ 26 พฤศจิกายน 2564 บันทึกว่าโต๊ะสำหรับคนถนัดซ้ายเสร็จแล้ว และการประชุมวันที่ 12 เมษายน 2565 บันทึกว่าเบิกค่าผ้าอนามัยไม่ได้ ไม่มีบันทึกค่าใช้จ่ายของทั้งสองเรื่อง",
        },
      ],
      source: {
        en: "BIRSA's welfare budget plan for the faculty, and BIRSA meeting minutes",
        th: "แผนงบประมาณสวัสดิการของ BIRSA ที่เสนอต่อคณะ และรายงานการประชุมของ BIRSA",
      },
      period: { en: "Academic year 2021 to 2022", th: "ปีการศึกษา 2564" },
    },
    {
      id: "planned-project-budgets",
      title: {
        en: "Planned budgets for three projects",
        th: "งบตามแผนของสามโครงการ",
      },
      summary: {
        en: "Three project plans for early 2022 add up to ฿45,150, and BIR The Future accounts for ฿35,000.",
        th: "แผนสามโครงการต้นปี 2565 รวม 45,150 บาท โดย BIR The Future ใช้ 35,000 บาท",
      },
      columns: [
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "quantity", label: { en: "Quantity (planned)", th: "จำนวนตามแผน" }, kind: "number" },
        {
          key: "unitCost",
          label: { en: "Cost per unit (baht, planned)", th: "ค่าใช้จ่ายต่อหน่วย (บาท) ตามแผน" },
          kind: "money",
        },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "งบตามแผน (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      declaredTotal: { amount: 45150 },
      rows: [
        line(
          futureDay,
          {
            en: "Lunch for 200 first-year BIR students",
            th: "อาหารกลางวันสำหรับนักศึกษา BIR ชั้นปีที่ 1 จำนวน 200 คน",
          },
          200,
          50,
          10000
        ),
        line(
          futureDay,
          {
            en: "Snacks for 200 first-year BIR students",
            th: "อาหารว่างสำหรับนักศึกษา BIR ชั้นปีที่ 1 จำนวน 200 คน",
          },
          200,
          30,
          6000
        ),
        line(
          futureDay,
          { en: "Handouts for participants", th: "เอกสารแจกผู้เข้าร่วมโครงการ" },
          null,
          null,
          12000
        ),
        line(futureDay, { en: "Miscellaneous", th: "ค่าใช้จ่ายเบ็ดเตล็ด" }, null, null, 4000),
        line(futureDay, { en: "Publicity", th: "ค่าประชาสัมพันธ์" }, null, null, 3000),
        line(
          rightsTalk,
          {
            en: "Two speakers for 2 hours at ฿1,200 an hour each",
            th: "วิทยากร 2 คน คนละ 2 ชั่วโมง ชั่วโมงละ 1,200 บาท",
          },
          null,
          null,
          4800
        ),
        line(
          rightsTalk,
          {
            en: "One speaker for 2 hours at ฿600 an hour",
            th: "วิทยากร 1 คน 2 ชั่วโมง ชั่วโมงละ 600 บาท",
          },
          null,
          null,
          1200
        ),
        line(rightsTalk, { en: "Two souvenir sets", th: "ของที่ระลึก 2 ชุด" }, 2, 500, 1000),
        line(
          rightsTalk,
          { en: "Drinks and snacks for 5 people", th: "เครื่องดื่มและของว่างสำหรับ 5 คน" },
          5,
          30,
          150
        ),
        line(
          esports,
          { en: "Prize for the Valorant winners", th: "เงินรางวัลผู้ชนะเลิศเกม Valorant" },
          null,
          null,
          1000
        ),
        line(
          esports,
          { en: "Prize for the ROV winners", th: "เงินรางวัลผู้ชนะเลิศเกม ROV" },
          null,
          null,
          1000
        ),
        line(
          esports,
          { en: "Prize for the Valorant runners-up", th: "เงินรางวัลรองชนะเลิศเกม Valorant" },
          null,
          null,
          500
        ),
        line(
          esports,
          { en: "Prize for the ROV runners-up", th: "เงินรางวัลรองชนะเลิศเกม ROV" },
          null,
          null,
          500
        ),
      ],
      notes: [
        {
          en: "BIR The Future was planned by the BIR cohort 13 student committee. Its plan numbers the lines 1, 2, 4, 5 and 6, and the lines add up to its stated ฿35,000.",
          th: "BIR The Future วางแผนโดยคณะกรรมการแกนนักศึกษา BIR รุ่นที่ 13 แผนของโครงการเรียงรายการเป็น 1, 2, 4, 5 และ 6 และรายการรวมได้ตามยอดที่ระบุ 35,000 บาท",
        },
        {
          en: "The rights protection talk has two plans. The later one, a copy of the form saved on 15 February 2022, is used here, at ฿7,150 for a talk on 5 March 2022. The earlier draft planned ฿8,660 for 5 February 2022, with 5 speakers at ฿1,500 each.",
          th: "เสวนาพิทักษ์สิทธิมีแผนสองฉบับ ตารางนี้ใช้ฉบับหลังซึ่งเป็นสำเนาแบบฟอร์มที่บันทึกไว้เมื่อ 15 กุมภาพันธ์ 2565 งบ 7,150 บาท สำหรับเสวนาวันที่ 5 มีนาคม 2565 ฉบับร่างก่อนหน้าวางงบ 8,660 บาท สำหรับวันที่ 5 กุมภาพันธ์ 2565 โดยจ่ายวิทยากร 5 คน คนละ 1,500 บาท",
        },
        {
          en: "The esports plan lists prize money only. It is a plan, and no record shows the event was paid for.",
          th: "แผนอีสปอร์ตระบุเฉพาะเงินรางวัล และไม่มีบันทึกว่าได้จ่ายเงินจริง",
        },
      ],
      source: {
        en: "BIRSA project plans for BIR The Future, the rights protection talk and The Rise of Val-rO-V",
        th: "ใบโครงการของ BIRSA สำหรับ BIR The Future เสวนาพิทักษ์สิทธิ และ The Rise of Val-rO-V",
      },
      period: { en: "February to March 2022", th: "กุมภาพันธ์ถึงมีนาคม 2565" },
    },
  ],
};
