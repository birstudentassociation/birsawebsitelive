import type { Bilingual, Row, Topic } from "@/lib/open-data";

const welfare = { en: "Welfare division", th: "ฝ่ายสวัสดิการ" };
const activitiesDiv = { en: "Student activities division", th: "ฝ่ายกิจกรรมนักศึกษา" };
const facilities = { en: "Facilities division", th: "ฝ่ายสถานที่" };
const rights = { en: "Rights and advocacy division", th: "ฝ่ายพิทักษ์และส่งเสริมสิทธิ" };
const academic = { en: "Academic division", th: "ฝ่ายวิชาการ" };
const running = { en: "BIRSA running costs", th: "ค่าใช้จ่ายสโมสรนักศึกษา" };
const roadShow = { en: "Road Show", th: "Road Show" };

const pads = { en: "Sanitary pad project", th: "โครงการผ้าอนามัยสวัสดิการ" };
const seating = { en: "Comfortable seating project", th: "โครงการนั่งสบายไม่แย่งกัน" };
const sportsDay = { en: "BIR Sports Day", th: "กีฬาสี BIR" };
const birify = { en: "BIRIFY", th: "BIRIFY" };
const asaIr = { en: "ASA IR volunteer project", th: "โครงการอาสาไออาร์" };
const smoking = { en: "Smoking area project", th: "โครงการสูบเป็นที่แฮปปี้ทุกคน" };
const wiring = { en: "Classroom wiring repair project", th: "โครงการซ่อมบำรุงสายไฟในห้องเรียน" };
const water = { en: "Free water dispensers project", th: "โครงการตู้กดน้ำฟรีภายในตึก" };
const flies = { en: "Fly control project", th: "โครงการเซ็ตซีโร่ไอต้าวแมลงวัน" };
const rightsSeminar = {
  en: "Rights seminar, semester 2",
  th: "โครงการเสวนาส่งเสริมสิทธิ ภาคการศึกษาที่ 2",
};
const seminar1 = { en: "Academic seminar, semester 1", th: "โครงการเสวนาวิชาการ ภาคการศึกษาที่ 1" };
const seminar2 = { en: "Academic seminar, semester 2", th: "โครงการเสวนาวิชาการ ภาคการศึกษาที่ 2" };
const operating = { en: "Student association running costs", th: "ค่าใช้จ่ายสโมสรนักศึกษา" };

function line(
  division: Bilingual,
  project: Bilingual,
  item: Bilingual,
  quantity: number | null,
  unitCost: number | null,
  amount: number
): Row {
  return { division, project, item, quantity, unitCost, amount };
}

const speakerFee = { en: "Speaker fees", th: "ค่าตอบแทนวิทยากร" };
const snacks = { en: "Snacks and drinks", th: "ค่าอาหารว่างและเครื่องดื่ม" };
const souvenirs = { en: "Gifts for speakers", th: "ค่าของที่ระลึกแก่วิทยากร" };

function seminarLines(division: Bilingual, project: Bilingual): Row[] {
  return [
    line(division, project, speakerFee, null, 1200, 7200),
    line(division, project, snacks, 4, 50, 200),
    line(division, project, souvenirs, 3, 500, 1500),
  ];
}

export const money: Topic = {
  slug: "money",
  title: {
    en: "What did BIRSA plan to spend in 2022 to 2023?",
    th: "BIRSA วางแผนใช้เงินอะไรบ้างในปีการศึกษา 2565",
  },
  summary: {
    en: "BIRSA's plan lists ฿223,690 across seven areas. No record of actual spending was found.",
    th: "แผนของ BIRSA ตั้งงบรวม 223,690 บาทใน 7 ด้าน และไม่พบบันทึกรายจ่ายจริง",
  },
  headlines: [
    {
      value: "฿223,690",
      label: { en: "Planned spending", th: "รายจ่ายตามแผน" },
      context: { en: "Seven areas in the budget plan", th: "7 ด้านในแผนงบประมาณ" },
    },
    {
      value: "฿76,690",
      label: { en: "Planned for student activities", th: "งบที่วางแผนไว้สำหรับกิจกรรมนักศึกษา" },
      context: { en: "The largest area", th: "ด้านที่ใช้งบมากที่สุด" },
    },
    {
      value: "None",
      label: { en: "Records of actual spending", th: "บันทึกรายจ่ายจริง" },
      context: { en: "Not found for this year", th: "ไม่พบของปีนี้" },
    },
  ],
  mainPoints: [
    {
      en: "The budget plan adds up to ฿223,690 across seven areas. The plan itself states no grand total.",
      th: "แผนงบประมาณรวมได้ 223,690 บาทใน 7 ด้าน แผนเองไม่ได้ระบุยอดรวมทั้งหมด",
    },
    {
      en: "Student activities is the largest area at ฿76,690, mostly the ฿55,000 ASA IR volunteer project.",
      th: "กิจกรรมนักศึกษาเป็นด้านที่ใหญ่ที่สุดที่ 76,690 บาท ส่วนใหญ่คือโครงการอาสาไออาร์ 55,000 บาท",
    },
    {
      en: "Facilities, Road Show, running costs and welfare each plan between ฿25,800 and ฿33,500.",
      th: "ฝ่ายสถานที่ Road Show ค่าใช้จ่ายสโมสร และฝ่ายสวัสดิการ ตั้งงบด้านละ 25,800 ถึง 33,500 บาท",
    },
    {
      en: "Each seminar is planned at ฿8,900, for two academic seminars and one rights seminar.",
      th: "งานเสวนาตั้งงบครั้งละ 8,900 บาท ได้แก่ งานเสวนาวิชาการสองครั้งและงานเสวนาด้านสิทธิหนึ่งครั้ง",
    },
    {
      en: "Three items have no amount in the plan, so the real total may be higher.",
      th: "มี 3 รายการที่แผนไม่ระบุจำนวนเงิน ยอดจริงจึงอาจสูงกว่านี้",
    },
    {
      en: "No actual income, spending or balance for the year was found in BIRSA's files.",
      th: "ไม่พบรายรับ รายจ่าย หรือเงินคงเหลือจริงของปีนี้ในเอกสารของ BIRSA",
    },
  ],
  warning: {
    en: "These figures are a plan, not what was spent. BIRSA's files hold no record of actual spending for 2022 to 2023.",
    th: "ตัวเลขเหล่านี้เป็นเพียงแผน ไม่ใช่ยอดที่ใช้จริง เอกสารของ BIRSA ไม่มีบันทึกรายจ่ายจริงของปีการศึกษา 2565",
  },
  chart: {
    datasetId: "planned-budget-by-area",
    labelKey: "area",
    valueKey: "amount",
    title: {
      en: "Student activities is planned at more than twice any other area",
      th: "กิจกรรมนักศึกษาตั้งงบมากกว่าด้านอื่นเกินสองเท่า",
    },
    subtitle: {
      en: "Planned spending in baht by area, 2022 to 2023",
      th: "รายจ่ายตามแผนเป็นบาท แยกตามด้าน ปีการศึกษา 2565",
    },
    alt: {
      en: "A bar chart showing that student activities is planned at 76,690 baht, well above facilities at 33,500 baht and every other area.",
      th: "แผนภูมิแท่งแสดงว่ากิจกรรมนักศึกษาตั้งงบ 76,690 บาท สูงกว่าฝ่ายสถานที่ที่ 33,500 บาท และด้านอื่นทุกด้านอย่างชัดเจน",
    },
  },
  datasets: [
    {
      id: "planned-budget-by-area",
      title: { en: "Planned budget by area", th: "งบประมาณตามแผน แยกตามด้าน" },
      summary: {
        en: "The plan adds up to ฿223,690 across seven areas, and student activities is the largest at ฿76,690.",
        th: "แผนรวมได้ 223,690 บาทใน 7 ด้าน โดยกิจกรรมนักศึกษาใหญ่ที่สุดที่ 76,690 บาท",
      },
      columns: [
        { key: "area", label: { en: "Area", th: "ด้าน" }, kind: "text" },
        {
          key: "group",
          label: { en: "Group used for comparison", th: "กลุ่มสำหรับเปรียบเทียบ" },
          kind: "text",
        },
        {
          key: "amount",
          label: { en: "Planned amount (baht)", th: "ประมาณการค่าใช้จ่าย (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      rows: [
        {
          area: activitiesDiv,
          group: { en: "Student activities", th: "กิจกรรมนักศึกษา" },
          amount: 76690,
        },
        {
          area: facilities,
          group: { en: "Other", th: "อื่น ๆ" },
          amount: 33500,
        },
        {
          area: roadShow,
          group: { en: "Other", th: "อื่น ๆ" },
          amount: 31000,
        },
        {
          area: running,
          group: { en: "Running costs", th: "ค่าดำเนินงาน" },
          amount: 30000,
        },
        {
          area: welfare,
          group: { en: "Rights and welfare", th: "สิทธิและสวัสดิการ" },
          amount: 25800,
        },
        {
          area: academic,
          group: { en: "Academic", th: "วิชาการ" },
          amount: 17800,
        },
        {
          area: rights,
          group: { en: "Rights and welfare", th: "สิทธิและสวัสดิการ" },
          amount: 8900,
        },
      ],
      notes: [
        {
          en: "The plan states totals only for welfare (฿25,800), rights and advocacy (฿8,900), academic (฿17,800) and running costs (฿30,000). The other totals are the sum of their lines.",
          th: "แผนระบุยอดรวมเฉพาะฝ่ายสวัสดิการ (25,800 บาท) ฝ่ายพิทักษ์และส่งเสริมสิทธิ (8,900 บาท) ฝ่ายวิชาการ (17,800 บาท) และค่าใช้จ่ายสโมสร (30,000 บาท) ยอดอื่นคือผลรวมของรายการย่อย",
        },
        {
          en: "The facilities division in the source also lists items for the common room. The common room is not a BIRSA project, so those items are left out and the facilities total here is lower than the source's lines.",
          th: "ฝ่ายสถานที่ในเอกสารต้นทางมีรายการของห้องคอมมอนด้วย ห้องคอมมอนไม่ใช่โครงการของ BIRSA จึงไม่นับรายการเหล่านั้น ยอดฝ่ายสถานที่ในตารางนี้จึงต่ำกว่ายอดรวมรายการในเอกสารต้นทาง",
        },
        {
          en: "Group used for comparison puts Facilities and Road Show under Other. Road Show is travel to visit schools.",
          th: "กลุ่มสำหรับเปรียบเทียบจัดฝ่ายสถานที่และ Road Show ไว้ในกลุ่มอื่น ๆ โดย Road Show คือการเดินทางไปแนะแนวตามโรงเรียน",
        },
        {
          en: "Three items have no amount in the plan and are not counted. They are the sport week project, the board game project and Road Show lunches.",
          th: "มี 3 รายการที่แผนไม่ระบุจำนวนเงินและไม่นับรวม ได้แก่ โครงการ sport week โครงการแข่ง board game และค่าอาหารกลางวัน Road Show",
        },
      ],
      source: {
        en: "BIRSA budget plan spreadsheet, titled for the 2023 fiscal year",
        th: "สเปรดชีตแผนงบประมาณ BIRSA ที่ตั้งชื่อว่าปีงบประมาณ 2566",
      },
      period: { en: "Academic year 2022 to 2023", th: "ปีการศึกษา 2565" },
    },
    {
      id: "planned-budget",
      title: { en: "Planned budget by line", th: "งบประมาณตามแผน แยกรายการ" },
      summary: {
        en: "The plan has 45 priced lines adding up to ฿223,690, and the largest is ฿30,000 for ASA IR bus hire.",
        th: "แผนมี 45 รายการที่ระบุราคา รวมได้ 223,690 บาท และรายการใหญ่สุดคือค่าเช่ารถบัสโครงการอาสาไออาร์ 30,000 บาท",
      },
      columns: [
        { key: "division", label: { en: "Area", th: "ด้าน" }, kind: "text" },
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
      rows: [
        line(
          welfare,
          pads,
          { en: "Storage box, 17.1 by 22.2 by 6 cm", th: "กล่องใส่ของ ขนาด 17.1 x 22.2 x 6 ซม." },
          3,
          200,
          600
        ),
        line(welfare, pads, { en: "Hand tissue box", th: "กล่องทิชชู่เช็ดมือ" }, 6, 300, 1800),
        line(
          welfare,
          pads,
          { en: "Wheeled box with lid, 85 litres", th: "กล่องล้อเลื่อนพร้อมฝา ความจุ 85 ลิตร" },
          3,
          300,
          900
        ),
        line(
          welfare,
          seating,
          { en: "Canteen tables and long benches", th: "โต๊ะโรงอาหารและม้านั่งยาว" },
          4,
          4500,
          18000
        ),
        line(welfare, seating, { en: "Wall fans", th: "พัดลมติดผนัง" }, 3, 1500, 4500),
        line(
          activitiesDiv,
          sportsDay,
          { en: "Small drinking water bottles, packs of 12", th: "น้ำดื่มขวดเล็ก แพ็ก 12 ขวด" },
          35,
          50,
          1750
        ),
        line(
          activitiesDiv,
          sportsDay,
          { en: "Cool towels, packs of 100", th: "ผ้าขนหนูเย็น แพ็ก 100 ซอง" },
          5,
          280,
          1400
        ),
        line(
          activitiesDiv,
          sportsDay,
          {
            en: "Electrolyte drink, sponsored, packs of 12",
            th: "เครื่องดื่มเกลือแร่ (สปอนเซอร์) แพ็ก 12 ขวด",
          },
          5,
          240,
          1200
        ),
        line(activitiesDiv, sportsDay, { en: "First aid kit", th: "กล่องปฐมพยาบาล" }, 1, 500, 500),
        line(activitiesDiv, sportsDay, { en: "Venue hire", th: "ค่าเช่าสถานที่" }, 1, 250, 250),
        line(activitiesDiv, sportsDay, { en: "Volleyballs", th: "ลูกวอลเลย์บอล" }, 4, 545, 2180),
        line(activitiesDiv, sportsDay, { en: "Basketballs", th: "ลูกบาสเกตบอล" }, 4, 1200, 4800),
        line(activitiesDiv, sportsDay, { en: "Footballs", th: "ลูกฟุตบอล" }, 4, 700, 2800),
        line(
          activitiesDiv,
          sportsDay,
          { en: "Ball storage net", th: "ตาข่ายเก็บลูกบอล" },
          1,
          200,
          200
        ),
        line(activitiesDiv, sportsDay, { en: "Ball pump", th: "ที่สูบลม" }, 1, 350, 350),
        line(
          activitiesDiv,
          sportsDay,
          { en: "Training cones, sets", th: "กรวยซ้อมบอล เป็นชุด" },
          2,
          130,
          260
        ),
        line(
          activitiesDiv,
          sportsDay,
          { en: "Prizes for first to fourth place", th: "ของรางวัลที่ 1 ถึง 4" },
          4,
          null,
          3000
        ),
        line(
          activitiesDiv,
          birify,
          { en: "Recording microphone", th: "ไมโครโฟนอัดเสียง" },
          1,
          3000,
          3000
        ),
        line(
          activitiesDiv,
          asaIr,
          { en: "Bus hire for the trip", th: "ค่าเช่าเหมารถบัสสำหรับเดินทาง" },
          null,
          null,
          30000
        ),
        line(
          activitiesDiv,
          asaIr,
          { en: "Food and drinks, two meals", th: "ค่าอาหารและเครื่องดื่ม ไปกลับ 2 มื้อ" },
          100,
          50,
          5000
        ),
        line(activitiesDiv, asaIr, { en: "Materials", th: "ค่าวัสดุอุปกรณ์" }, null, null, 20000),
        line(
          facilities,
          smoking,
          { en: "Bin with ashtray", th: "ถังขยะพร้อมที่เขี่ยบุหรี่" },
          1,
          1000,
          1000
        ),
        line(
          facilities,
          wiring,
          {
            en: "New wiring and plug sockets in room 103",
            th: "ค่าเดินสายไฟและติดหัวปลั๊กใหม่ในห้อง 103",
          },
          null,
          null,
          5000
        ),
        line(
          facilities,
          wiring,
          {
            en: "Replacement equipment for damaged items",
            th: "อุปกรณ์ใหม่ทดแทนอุปกรณ์ที่เสียหาย",
          },
          null,
          null,
          15000
        ),
        line(facilities, water, { en: "Water dispensers", th: "ตู้กดน้ำ" }, 3, 3500, 10500),
        line(
          facilities,
          flies,
          { en: "Pest control company, two treatments", th: "บริษัทกำจัดแมลงวัน 2 ครั้ง" },
          null,
          null,
          2000
        ),
        ...seminarLines(rights, rightsSeminar),
        ...seminarLines(academic, seminar1),
        ...seminarLines(academic, seminar2),
        line(
          running,
          operating,
          { en: "Snacks and drinks, per month", th: "ค่าอาหารว่างและเครื่องดื่ม ต่อเดือน" },
          6,
          3000,
          18000
        ),
        line(
          running,
          operating,
          { en: "Office supplies, per semester", th: "วัสดุอุปกรณ์สำนักงาน ต่อภาคการศึกษา" },
          2,
          3000,
          6000
        ),
        line(
          running,
          operating,
          { en: "First aid supplies, per semester", th: "อุปกรณ์ปฐมพยาบาล ต่อภาคการศึกษา" },
          2,
          2000,
          4000
        ),
        line(
          running,
          operating,
          { en: "Cleaning supplies, per semester", th: "อุปกรณ์ทำความสะอาด ต่อภาคการศึกษา" },
          2,
          1000,
          2000
        ),
        line(
          roadShow,
          roadShow,
          { en: "Flights to Udon Thani", th: "ค่าเครื่องบินไปอุดรธานี" },
          7,
          1500,
          10500
        ),
        line(
          roadShow,
          roadShow,
          { en: "Flights to Hat Yai", th: "ค่าเครื่องบินไปหาดใหญ่" },
          7,
          1500,
          10500
        ),
        line(
          roadShow,
          roadShow,
          { en: "Van, Udon Thani trip", th: "ค่ารถตู้ เที่ยวอุดรธานี" },
          1,
          2500,
          2500
        ),
        line(
          roadShow,
          roadShow,
          { en: "Van, Hat Yai trip", th: "ค่ารถตู้ เที่ยวหาดใหญ่" },
          1,
          2500,
          2500
        ),
        line(
          roadShow,
          roadShow,
          { en: "Van, Nakhon Ratchasima trip", th: "ค่ารถตู้ เที่ยวนครราชสีมา" },
          1,
          2500,
          2500
        ),
        line(
          roadShow,
          roadShow,
          { en: "Van, Chiang Mai trip", th: "ค่ารถตู้ เที่ยวเชียงใหม่" },
          1,
          2500,
          2500
        ),
      ],
      notes: [
        {
          en: "The source file is titled for the 2023 fiscal year but its lines are for semesters 1 and 2 of academic year 2022 to 2023.",
          th: "ชื่อไฟล์ต้นทางระบุปีงบประมาณ 2566 แต่รายการเป็นของภาคการศึกษาที่ 1 และ 2 ของปีการศึกษา 2565",
        },
        {
          en: "Seminar speaker fees are ฿1,200 an hour for three speakers over a two hour event, which the plan prices at ฿7,200. The quantity cell is left empty for that reason.",
          th: "ค่าตอบแทนวิทยากรงานเสวนาคิดชั่วโมงละ 1,200 บาท สำหรับวิทยากร 3 คนในงาน 2 ชั่วโมง แผนระบุไว้ 7,200 บาท จึงเว้นช่องจำนวนไว้",
        },
        {
          en: "Lines with no quantity or unit cost are lump sums in the plan. The microphone is noted in the plan as borrowed from a centre.",
          th: "รายการที่ไม่มีจำนวนหรือราคาต่อหน่วยเป็นยอดเหมาในแผน และแผนหมายเหตุว่าไมโครโฟนยืมมาจากศูนย์แห่งหนึ่ง",
        },
        {
          en: "The common room items in the source facilities division are not a BIRSA project and are not shown.",
          th: "รายการของห้องคอมมอนในฝ่ายสถานที่ของเอกสารต้นทางไม่ใช่โครงการของ BIRSA จึงไม่แสดง",
        },
      ],
      source: {
        en: "BIRSA budget plan spreadsheet, titled for the 2023 fiscal year",
        th: "สเปรดชีตแผนงบประมาณ BIRSA ที่ตั้งชื่อว่าปีงบประมาณ 2566",
      },
      period: { en: "Academic year 2022 to 2023", th: "ปีการศึกษา 2565" },
    },
    {
      id: "project-form-budgets",
      title: { en: "Project form budgets against the plan", th: "งบตามแบบเสนอโครงการเทียบกับแผน" },
      summary: {
        en: "Project forms and the budget plan disagree for all three projects they share, with Sports Day ฿2,900 higher on its form.",
        th: "แบบเสนอโครงการกับแผนงบประมาณให้ตัวเลขต่างกันทั้งสามโครงการที่มีทั้งสองเอกสาร โดยงานกีฬาสีสูงกว่าในแบบเสนอโครงการ 2,900 บาท",
      },
      columns: [
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        {
          key: "form",
          label: { en: "Planned on project form (baht)", th: "ตั้งงบในแบบเสนอโครงการ (บาท)" },
          kind: "money",
        },
        {
          key: "plan",
          label: { en: "Planned in budget plan (baht)", th: "ตั้งงบในแผนงบประมาณ (บาท)" },
          kind: "money",
        },
      ],
      rows: [
        {
          project: { en: "BIR Sports Day", th: "กีฬาสี BIR" },
          form: 21590,
          plan: 18690,
        },
        {
          project: { en: "BIR Open House 2023", th: "BIR Open House" },
          form: 16800,
          plan: null,
        },
        {
          project: {
            en: "Academic seminar on Japan policy",
            th: "งานเสวนาวิชาการเรื่องนโยบายต่างประเทศญี่ปุ่น",
          },
          form: 7350,
          plan: 8900,
        },
        {
          project: {
            en: "Student association running costs, semester 1",
            th: "ค่าใช้จ่ายสโมสรนักศึกษา ภาคการศึกษาที่ 1",
          },
          form: 20500,
          plan: 30000,
        },
      ],
      notes: [
        {
          en: "For these four projects this page uses the project form as the figure for the event itself, because it is the more specific document.",
          th: "สำหรับสี่โครงการนี้ หน้านี้ใช้ตัวเลขในแบบเสนอโครงการเป็นงบของกิจกรรมนั้น เพราะเป็นเอกสารที่เจาะจงกว่า",
        },
        {
          en: "Sports Day has two earlier versions. A June 2022 division sheet totals ฿6,400, and an equipment sheet lists ฿11,990 of equipment only.",
          th: "งานกีฬาสีมีเอกสารเวอร์ชันก่อนหน้าสองฉบับ ตารางของฝ่ายเดือนมิถุนายน 2565 รวม 6,400 บาท และตารางอุปกรณ์รวมเฉพาะอุปกรณ์ 11,990 บาท",
        },
        {
          en: "Open House is not in the budget plan. Its form lists speaker fees ฿6,000, snacks ฿1,350, lunch ฿2,250 and room hire ฿7,200.",
          th: "งาน Open House ไม่อยู่ในแผนงบประมาณ แบบเสนอโครงการระบุค่าวิทยากร 6,000 บาท อาหารว่าง 1,350 บาท อาหารกลางวัน 2,250 บาท และค่าห้อง 7,200 บาท",
        },
        {
          en: "The plan prices every seminar at ฿8,900. The seminar form is ฿7,350. The plan's running costs of ฿30,000 cover two semesters, and the form of ฿20,500 covers semester 1.",
          th: "แผนตั้งงบงานเสวนาทุกครั้ง 8,900 บาท แบบเสนอโครงการงานเสวนาคือ 7,350 บาท ค่าใช้จ่ายสโมสรในแผน 30,000 บาทครอบคลุมสองภาคการศึกษา ส่วนแบบเสนอโครงการ 20,500 บาทครอบคลุมภาคการศึกษาที่ 1",
        },
      ],
      source: {
        en: "BIRSA project forms and the BIRSA budget plan spreadsheet",
        th: "แบบเสนอโครงการของ BIRSA และสเปรดชีตแผนงบประมาณ BIRSA",
      },
      period: { en: "Academic year 2022 to 2023", th: "ปีการศึกษา 2565" },
    },
    {
      id: "unit-costs",
      title: { en: "Unit costs used in plans", th: "ราคาต่อหน่วยที่ใช้ในแผน" },
      summary: {
        en: "Plans cost snacks at ฿30 a person on project forms and ฿50 in the budget plan, and speakers at ฿600 to ฿2,000 an hour.",
        th: "แผนคิดอาหารว่างคนละ 30 บาทในแบบเสนอโครงการ และ 50 บาทในแผนงบประมาณ ส่วนวิทยากรชั่วโมงละ 600 ถึง 2,000 บาท",
      },
      columns: [
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "source", label: { en: "Used in", th: "ใช้ใน" }, kind: "text" },
        {
          key: "amount",
          label: { en: "Planned cost (baht)", th: "ราคาที่ตั้งไว้ (บาท)" },
          kind: "money",
        },
      ],
      rows: [
        {
          item: { en: "Speaker fee per hour", th: "ค่าวิทยากรต่อชั่วโมง" },
          source: { en: "Open House form", th: "แบบเสนอโครงการ Open House" },
          amount: 2000,
        },
        {
          item: { en: "Speaker fee per hour", th: "ค่าวิทยากรต่อชั่วโมง" },
          source: { en: "Budget plan, all seminars", th: "แผนงบประมาณ งานเสวนาทุกครั้ง" },
          amount: 1200,
        },
        {
          item: {
            en: "Speaker fee per hour, one speaker",
            th: "ค่าวิทยากรต่อชั่วโมง วิทยากร 1 คน",
          },
          source: { en: "Japan seminar form", th: "แบบเสนอโครงการงานเสวนาเรื่องญี่ปุ่น" },
          amount: 1200,
        },
        {
          item: {
            en: "Speaker fee per hour, three speakers",
            th: "ค่าวิทยากรต่อชั่วโมง วิทยากร 3 คน",
          },
          source: { en: "Japan seminar form", th: "แบบเสนอโครงการงานเสวนาเรื่องญี่ปุ่น" },
          amount: 600,
        },
        {
          item: { en: "Host fee per hour", th: "ค่าผู้ดำเนินรายการต่อชั่วโมง" },
          source: { en: "Japan seminar form", th: "แบบเสนอโครงการงานเสวนาเรื่องญี่ปุ่น" },
          amount: 600,
        },
        {
          item: { en: "Lunch per person", th: "ค่าอาหารกลางวันต่อคน" },
          source: { en: "Open House form", th: "แบบเสนอโครงการ Open House" },
          amount: 50,
        },
        {
          item: { en: "Snacks and drinks per person", th: "ค่าอาหารว่างและเครื่องดื่มต่อคน" },
          source: { en: "Budget plan, all seminars", th: "แผนงบประมาณ งานเสวนาทุกครั้ง" },
          amount: 50,
        },
        {
          item: { en: "Snacks and drinks per person", th: "ค่าอาหารว่างและเครื่องดื่มต่อคน" },
          source: { en: "Open House form", th: "แบบเสนอโครงการ Open House" },
          amount: 30,
        },
        {
          item: { en: "Snacks and drinks per person", th: "ค่าอาหารว่างและเครื่องดื่มต่อคน" },
          source: { en: "Sports Day form", th: "แบบเสนอโครงการงานกีฬาสี" },
          amount: 30,
        },
        {
          item: { en: "Snacks and drinks per person", th: "ค่าอาหารว่างและเครื่องดื่มต่อคน" },
          source: { en: "Japan seminar form", th: "แบบเสนอโครงการงานเสวนาเรื่องญี่ปุ่น" },
          amount: 30,
        },
      ],
      notes: [
        {
          en: "These are planned unit costs, not what was paid. The Sports Day form prices snacks for 350 expected people.",
          th: "เป็นราคาต่อหน่วยที่ตั้งไว้ในแผน ไม่ใช่ราคาที่จ่ายจริง แบบเสนอโครงการงานกีฬาสีคิดอาหารว่างสำหรับผู้เข้าร่วมที่คาดไว้ 350 คน",
        },
      ],
      source: {
        en: "BIRSA project forms and the BIRSA budget plan spreadsheet",
        th: "แบบเสนอโครงการของ BIRSA และสเปรดชีตแผนงบประมาณ BIRSA",
      },
      period: { en: "Academic year 2022 to 2023", th: "ปีการศึกษา 2565" },
    },
  ],
};
