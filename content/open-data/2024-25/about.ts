import type { AboutSection } from "@/lib/open-data";

/**
 * "About the data" for the 2024 to 2025 edition. This year's records are
 * plans and process documents, so the page says plainly what is a plan and
 * what BIRSA does not hold.
 */
export const about: AboutSection[] = [
  {
    id: "how",
    heading: { en: "How these figures were made", th: "ตัวเลขเหล่านี้มาจากไหน" },
    paragraphs: [
      {
        en: "Every figure comes from BIRSA's own working files for the year, such as its budget plan, activity timeline, project request forms, meeting notes, recruitment call and election notice. Nothing was estimated. Where a value was missing, the table leaves the cell empty.",
        th: "ตัวเลขทุกตัวมาจากเอกสารทำงานของ BIRSA ในปีนั้น เช่น แผนงบประมาณ ตารางกิจกรรม แบบขออนุมัติโครงการ บันทึกการประชุม ประกาศรับสมัคร และประกาศการเลือกตั้ง เราไม่ได้ประมาณตัวเลขใดขึ้นเอง หากไม่มีค่าใด ช่องในตารางจะเว้นว่างไว้",
      },
      {
        en: "Almost everything for this year is a plan. The files hold budgets, dates and expected numbers, not results. The budget spreadsheet is headed 2023, but its content and dates are for 2024 to 2025.",
        th: "ข้อมูลของปีนี้เกือบทั้งหมดเป็นแผน เอกสารมีงบประมาณ วันที่ และจำนวนที่คาดไว้ ไม่ใช่ผลที่เกิดขึ้นจริง ตารางงบประมาณมีหัวข้อว่าปี 2566 แต่เนื้อหาและวันที่เป็นของปีการศึกษา 2567",
      },
      {
        en: "The figures were gathered after the year ended and published once. They will not be revised.",
        th: "ตัวเลขชุดนี้รวบรวมหลังจบปีการศึกษาและเผยแพร่ครั้งเดียว จะไม่มีการแก้ไขอีก",
      },
    ],
  },
  {
    id: "privacy",
    heading: { en: "How people's privacy was protected", th: "เราปกป้องข้อมูลส่วนบุคคลอย่างไร" },
    paragraphs: [
      {
        en: "The source files hold names, email addresses, phone numbers and student ID numbers of officers, applicants and project leads. None of these appear here. People are shown only as role titles or as counts. Original documents are not published.",
        th: "เอกสารต้นทางมีชื่อ อีเมล เบอร์โทรศัพท์ และเลขทะเบียนนักศึกษาของกรรมการ ผู้สมัคร และหัวหน้าโครงการ ข้อมูลเหล่านี้ไม่ปรากฏในหน้านี้เลย เราแสดงบุคคลเป็นตำแหน่งหรือเป็นจำนวนเท่านั้น และไม่เผยแพร่เอกสารต้นฉบับ",
      },
    ],
  },
  {
    id: "conflicts",
    heading: { en: "Where sources disagree", th: "จุดที่เอกสารขัดแย้งกัน" },
    paragraphs: [
      {
        en: "When documents disagree, the project request form is used first, then the budget plan, then minutes and the timeline. If a total in a document does not match its own lines, the lines are used.",
        th: "เมื่อเอกสารขัดแย้งกัน เราใช้แบบขออนุมัติโครงการก่อน ตามด้วยแผนงบประมาณ แล้วจึงเป็นรายงานการประชุมและตารางกิจกรรม หากยอดรวมในเอกสารไม่ตรงกับรายการของเอกสารเอง เราใช้ตามรายการ",
      },
    ],
    items: [
      {
        en: "Budget total. The plan states ฿124,137, but its lines add up to ฿141,442. The stated total leaves out the Tham Sing gathering, and two subtotals are ฿1,000 too low.",
        th: "ยอดรวมงบประมาณ แผนระบุ 124,137 บาท แต่รายการรวมได้ 141,442 บาท ยอดที่ระบุไม่รวมรวมถ้ำสิงห์ และมีสองยอดย่อยต่ำไป 1,000 บาท",
      },
      {
        en: "Job Fair budget. The request form says ฿3,530, the proposal says ฿2,260 and the budget plan's lines give ฿5,860.",
        th: "งบ Job Fair แบบขออนุมัติโครงการระบุ 3,530 บาท เอกสารโครงการระบุ 2,260 บาท และรายการในแผนงบประมาณรวมได้ 5,860 บาท",
      },
      {
        en: "Bonding event. The budget plan is for 200 people and ฿42,685. The 11 June 2024 minutes expected 250 people and ฿20,000 from BIRSA.",
        th: "งานสานสัมพันธ์ แผนงบประมาณวางไว้ที่ 200 คน และ 42,685 บาท ส่วนรายงานประชุม 11 มิถุนายน 2567 คาดไว้ 250 คน และงบจาก BIRSA 20,000 บาท",
      },
      {
        en: "Dates. The timeline gives Meet Ajarn and Open House in May, but the forms and the order of the list point to November 2024. Party Night is 4 April in the timeline and 8 April in the minutes.",
        th: "วันที่ ตารางกิจกรรมระบุอาจารย์พบนิสิตและ Open House ในเดือนพฤษภาคม แต่แบบขอและลำดับในตารางชี้ว่าเป็นพฤศจิกายน 2567 ส่วน Party Night คือ 4 เมษายนในตารางกิจกรรม และ 8 เมษายนในรายงานประชุม",
      },
    ],
  },
  {
    id: "not-held",
    heading: { en: "What BIRSA does not hold", th: "ข้อมูลที่ BIRSA ไม่มี" },
    paragraphs: [
      {
        en: "Some figures you might expect are missing because BIRSA did not record them for this year, not because they were left out.",
        th: "ตัวเลขบางอย่างที่คุณอาจคาดว่าจะเห็นไม่ได้อยู่ในหน้านี้ เพราะ BIRSA ไม่ได้บันทึกไว้ในปีนี้ ไม่ใช่เพราะเราตัดออก",
      },
    ],
    items: [
      {
        en: "Actual money. There is no record of income, spending or closing balance, apart from ฿4,000 carried over from the previous committee.",
        th: "เงินที่ใช้จริง ไม่มีบันทึกรายรับ รายจ่าย หรือยอดคงเหลือปลายปี นอกจากเงิน 4,000 บาทที่ยกมาจากคณะกรรมการชุดก่อน",
      },
      {
        en: "Attendance. No event has a count of people who came.",
        th: "จำนวนผู้เข้าร่วมจริง ไม่มีกิจกรรมใดมีจำนวนผู้ที่มาร่วมงาน",
      },
      {
        en: "Satisfaction. No feedback survey results were kept. The only response count is 19 replies to an interest form for the bonding event.",
        th: "ความพึงพอใจ ไม่มีผลแบบสอบถามความคิดเห็นเก็บไว้ มีเพียงจำนวนผู้ตอบแบบสอบถามความสนใจงานสานสัมพันธ์ 19 คน",
      },
      {
        en: "Election results. There are no candidate numbers, eligible voters, votes cast or results for the September 2024 cohort election.",
        th: "ผลการเลือกตั้ง ไม่มีจำนวนผู้สมัคร ผู้มีสิทธิ์เลือกตั้ง ผู้มาใช้สิทธิ์ หรือผลของการเลือกตั้งคณะกรรมการรุ่นเดือนกันยายน 2567",
      },
      {
        en: "Meetings and events after September 2024. The meeting records and the timeline stop then.",
        th: "การประชุมและกิจกรรมหลังเดือนกันยายน 2567 บันทึกการประชุมและตารางกิจกรรมหยุดอยู่เพียงนั้น",
      },
      {
        en: "A club register, the size of the committee and attendance at meetings.",
        th: "ทะเบียนชมรม ขนาดของคณะกรรมการ และจำนวนผู้เข้าประชุม",
      },
    ],
  },
  {
    id: "left-out",
    heading: { en: "What was left out on purpose", th: "ข้อมูลที่ตั้งใจไม่เผยแพร่" },
    items: [
      {
        en: "Names and contact details of applicants, officers and project leads.",
        th: "ชื่อและช่องทางติดต่อของผู้สมัคร กรรมการ และหัวหน้าโครงการ",
      },
      {
        en: "A handover document with internal working details, which was not used.",
        th: "เอกสารส่งมอบงานที่มีรายละเอียดการทำงานภายใน ซึ่งเราไม่ได้นำมาใช้",
      },
    ],
  },
  {
    id: "contact",
    heading: { en: "Questions about the figures", th: "สอบถามเรื่องตัวเลข" },
    paragraphs: [
      {
        en: "If you think a figure is wrong, or you want to know more about how it was made, contact BIRSA.",
        th: "หากคิดว่าตัวเลขใดไม่ถูกต้อง หรืออยากทราบว่าได้ตัวเลขมาอย่างไร ติดต่อ BIRSA ได้",
      },
    ],
  },
];
