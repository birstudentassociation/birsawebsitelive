import type { AboutSection } from "@/lib/open-data";

/**
 * "About the data" for the 2023 to 2024 edition: how the figures were made,
 * how privacy was protected, where sources disagree and what BIRSA does not
 * hold for this year.
 */
export const about: AboutSection[] = [
  {
    id: "how",
    heading: { en: "How these figures were made", th: "ตัวเลขเหล่านี้มาจากไหน" },
    paragraphs: [
      {
        en: "Every figure comes from BIRSA's own working files for the year, such as its budget plan, project approval forms, project reports, meeting minutes, activity calendar and Master Sheet. Nothing was estimated. Where a value was missing from the source, the table leaves the cell empty and a note says why.",
        th: "ตัวเลขทุกตัวมาจากเอกสารทำงานของ BIRSA ในปีนั้น เช่น แผนงบประมาณ แบบเสนอโครงการ รายงานโครงการ รายงานการประชุม ปฏิทินกิจกรรม และ Master Sheet เราไม่ได้ประมาณตัวเลขใดขึ้นเอง หากเอกสารต้นทางไม่มีค่าใด ช่องในตารางจะเว้นว่างไว้ และมีหมายเหตุบอกเหตุผล",
      },
      {
        en: "The figures were gathered after the year ended and published once. They will not be revised. Money columns say whether an amount is planned. Where sources give different figures, the signed approval form comes first, then the budget plan, then reports, minutes and trackers.",
        th: "ตัวเลขชุดนี้รวบรวมหลังจบปีการศึกษาและเผยแพร่ครั้งเดียว จะไม่มีการแก้ไขอีก คอลัมน์เงินระบุว่าเป็นยอดตามแผนหรือไม่ หากเอกสารให้ตัวเลขต่างกัน เราใช้แบบอนุมัติที่ลงนามก่อน ตามด้วยแผนงบประมาณ รายงาน รายงานการประชุม และตารางติดตาม",
      },
    ],
  },
  {
    id: "privacy",
    heading: { en: "How people's privacy was protected", th: "เราปกป้องข้อมูลส่วนบุคคลอย่างไร" },
    paragraphs: [
      {
        en: "The source files hold names, student ID numbers, phone numbers, email addresses and signatures. None of these appear here. People are shown only as role titles or as counts. The bus survey is published as counts only, and original documents are not published.",
        th: "เอกสารต้นทางมีชื่อ เลขทะเบียนนักศึกษา เบอร์โทรศัพท์ อีเมล และลายมือชื่อ ข้อมูลเหล่านี้ไม่ปรากฏในหน้านี้เลย เราแสดงบุคคลเป็นตำแหน่งหรือจำนวนเท่านั้น แบบสอบถามรถบัสเผยแพร่เฉพาะจำนวนรวม และไม่เผยแพร่เอกสารต้นฉบับ",
      },
    ],
  },
  {
    id: "sources-disagree",
    heading: { en: "Where sources disagree", th: "จุดที่เอกสารไม่ตรงกัน" },
    items: [
      {
        en: "The budget plan states a grand total of ฿156,000, but its lines add up to ฿111,100. The pages use the lines.",
        th: "แผนงบประมาณระบุยอดรวม 156,000 บาท แต่รายการย่อยรวมกันได้ 111,100 บาท หน้านี้ใช้ตามรายการย่อย",
      },
      {
        en: "The plan states ฿9,600 for Club Day, but its lines and the approved form give ฿9,700. The pages use ฿9,700.",
        th: "แผนระบุ Club Day ไว้ 9,600 บาท แต่รายการย่อยและแบบที่อนุมัติระบุ 9,700 บาท หน้านี้ใช้ 9,700 บาท",
      },
      {
        en: "The date of the Rights seminar on gender and of the BIR Festival changed in the minutes, so only the month is shown.",
        th: "วันจัดสัมมนาด้านสิทธิหัวข้อเรื่องเพศและ BIR Festival เปลี่ยนไปในรายงานการประชุม จึงแสดงเฉพาะเดือน",
      },
      {
        en: "The first year cohort election is described as online in its announcement and as on site in the minutes.",
        th: "การเลือกตั้งแกนนำปี 1 ระบุในประกาศว่าลงคะแนนออนไลน์ แต่รายงานการประชุมระบุว่าลงคะแนนในสถานที่",
      },
    ],
  },
  {
    id: "not-held",
    heading: { en: "What BIRSA does not hold", th: "ข้อมูลที่ BIRSA ไม่มี" },
    paragraphs: [
      {
        en: "Some figures you might expect are missing because they were not found in BIRSA's records, not because they were left out.",
        th: "ตัวเลขบางอย่างที่คุณอาจคาดว่าจะเห็นไม่ได้อยู่ในหน้านี้ เพราะไม่พบในบันทึกของ BIRSA ไม่ใช่เพราะเราตัดออก",
      },
    ],
    items: [
      {
        en: "Income, actual spending and a closing balance. The Master Sheet points to an actual budget file held by the Treasurer, but it is not in the records.",
        th: "รายรับ รายจ่ายจริง และเงินคงเหลือสิ้นปี Master Sheet อ้างถึงไฟล์งบประมาณจริงที่เหรัญญิกถือ แต่ไม่อยู่ในบันทึก",
      },
      {
        en: "Attendance at events. Forms give the number planned for, not the number who came.",
        th: "จำนวนผู้เข้าร่วมกิจกรรมจริง แบบเสนอโครงการระบุจำนวนที่วางแผนไว้ ไม่ใช่จำนวนที่มาจริง",
      },
      {
        en: "Satisfaction scores. Survey forms exist for several events, but their results appear only as pictures in the reports, so no scores are given.",
        th: "คะแนนความพึงพอใจ มีแบบประเมินของหลายกิจกรรม แต่ผลปรากฏเป็นภาพในรายงานเท่านั้น จึงไม่มีคะแนนในหน้านี้",
      },
      {
        en: "Election results. The committee took office after an election planned for 20 April 2023, before this year. No vote counts or turnout are held for it or for the first year cohort election.",
        th: "ผลการเลือกตั้ง คณะกรรมการชุดนี้เข้ารับตำแหน่งหลังการเลือกตั้งที่วางแผนไว้วันที่ 20 เมษายน 2566 ซึ่งอยู่ก่อนปีนี้ ไม่มีคะแนนเสียงหรือผู้มาใช้สิทธิ์ของการเลือกตั้งนั้นหรือของการเลือกตั้งแกนนำปี 1",
      },
      {
        en: "Recruitment figures, a full member list, club funding and membership, merchandise sales, and reports for most events after January 2024.",
        th: "จำนวนผู้สมัครและผู้ได้รับเลือก รายชื่อสมาชิกฉบับเต็ม งบและสมาชิกของชมรม ยอดขาย Merchandise และรายงานของกิจกรรมส่วนใหญ่หลังเดือนมกราคม 2567",
      },
    ],
  },
  {
    id: "left-out",
    heading: { en: "What was left out on purpose", th: "ข้อมูลที่ตั้งใจไม่เผยแพร่" },
    items: [
      {
        en: "A block of four unlabelled figures on the Club Day approval form. Without labels we cannot say what they mean.",
        th: "ตัวเลข 4 ตัวที่ไม่มีป้ายกำกับในแบบอนุมัติ Club Day เมื่อไม่มีป้ายกำกับ เราบอกไม่ได้ว่าหมายถึงอะไร",
      },
      {
        en: "Comments about individual people in minutes, and case files that involve students.",
        th: "ความเห็นเกี่ยวกับบุคคลรายบุคคลในรายงานการประชุม และแฟ้มกรณีที่เกี่ยวข้องกับนักศึกษา",
      },
      {
        en: "Costs and meetings for the faculty common room, which is not a BIRSA project.",
        th: "ค่าใช้จ่ายและการประชุมเรื่องห้องคอมมอนของคณะ ซึ่งไม่ใช่โครงการของ BIRSA",
      },
      {
        en: "Photos and receipt images, because we do not have consent from everyone in them.",
        th: "ภาพถ่ายและภาพใบเสร็จ เพราะเราไม่ได้รับความยินยอมจากทุกคนในภาพ",
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
