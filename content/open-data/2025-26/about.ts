import type { AboutSection } from "@/lib/open-data";

/**
 * "About the data" for the 2025 to 2026 edition: how the figures were made,
 * how people's privacy was protected, where sources disagree and, as plainly
 * as the figures themselves, what BIRSA does not hold.
 */
export const about: AboutSection[] = [
  {
    id: "how",
    heading: { en: "How these figures were made", th: "ตัวเลขเหล่านี้มาจากไหน" },
    paragraphs: [
      {
        en: "Every figure comes from BIRSA's own working files for the year, such as its budget plan, account tracker, signed project approvals, meeting minutes and club founding forms. Nothing was estimated. Where a value was missing from the source, the table leaves the cell empty and a note says why.",
        th: "ตัวเลขทุกตัวมาจากเอกสารทำงานของ BIRSA ในปีนั้น เช่น แผนงบประมาณ ตารางบันทึกบัญชี แบบขออนุมัติโครงการที่ลงนามแล้ว รายงานการประชุม และแบบขอจัดตั้งชมรม เราไม่ได้ประมาณตัวเลขใดขึ้นเอง หากเอกสารต้นทางไม่มีค่าใด ช่องในตารางจะเว้นว่างไว้ และมีหมายเหตุบอกเหตุผล",
      },
      {
        en: "The figures were gathered after the year ended and published once. They will not be revised. If a later year is published, it will appear beside this one and will not change it.",
        th: "ตัวเลขชุดนี้รวบรวมหลังจบปีการศึกษาและเผยแพร่ครั้งเดียว จะไม่มีการแก้ไขอีก หากเผยแพร่ข้อมูลของปีถัดไป จะเป็นชุดใหม่แยกต่างหาก โดยไม่กระทบชุดนี้",
      },
    ],
  },
  {
    id: "privacy",
    heading: { en: "How people's privacy was protected", th: "เราปกป้องข้อมูลส่วนบุคคลอย่างไร" },
    paragraphs: [
      {
        en: "The source files hold names, student ID numbers, phone numbers and signatures. None of these appear here. People are shown only as role titles, such as Treasurer, or as counts, such as the number present at a meeting. Original documents are not published.",
        th: "เอกสารต้นทางมีชื่อ เลขทะเบียนนักศึกษา เบอร์โทรศัพท์ และลายมือชื่อ ข้อมูลเหล่านี้ไม่ปรากฏในหน้านี้เลย เราแสดงบุคคลเป็นตำแหน่ง เช่น เหรัญญิก หรือเป็นจำนวน เช่น จำนวนผู้เข้าประชุม และไม่เผยแพร่เอกสารต้นฉบับ",
      },
    ],
  },
  {
    id: "not-held",
    heading: { en: "What BIRSA does not hold", th: "ข้อมูลที่ BIRSA ไม่มี" },
    paragraphs: [
      {
        en: "Some figures you might expect are missing because BIRSA never recorded them, not because they were left out.",
        th: "ตัวเลขบางอย่างที่คุณอาจคาดว่าจะเห็นไม่ได้อยู่ในหน้านี้ เพราะ BIRSA ไม่เคยบันทึกไว้ ไม่ใช่เพราะเราตัดออก",
      },
    ],
    items: [
      {
        en: "Election results. There are no vote counts, turnout figures or numbers of eligible voters for the April 2025 election.",
        th: "ผลการเลือกตั้ง ไม่มีคะแนนเสียง อัตราการออกมาใช้สิทธิ์ หรือจำนวนผู้มีสิทธิ์เลือกตั้งของการเลือกตั้งเดือนเมษายน 2568",
      },
      {
        en: "Attendance at events. Project approvals give the number of people expected, not the number who came.",
        th: "จำนวนผู้เข้าร่วมกิจกรรมจริง แบบขออนุมัติโครงการระบุเพียงจำนวนผู้เข้าร่วมที่คาดไว้ ไม่ใช่จำนวนที่มาจริง",
      },
      {
        en: "Satisfaction. No feedback survey results were kept for any event.",
        th: "ความพึงพอใจ ไม่มีผลแบบสอบถามความคิดเห็นของกิจกรรมใดเก็บไว้",
      },
      {
        en: "The organisations at the Job Fair. The approval gives how many were invited, not which ones.",
        th: "รายชื่อหน่วยงานที่มาร่วมงาน Job Fair แบบขออนุมัติระบุเพียงจำนวนหน่วยงานที่เชิญ ไม่ได้ระบุชื่อ",
      },
      {
        en: "A full year of accounts. The account tracker has no entries for August to December 2025, February 2026 or April to June 2026.",
        th: "บัญชีครบทั้งปี ตารางบันทึกบัญชีไม่มีรายการของเดือนสิงหาคมถึงธันวาคม 2568 เดือนกุมภาพันธ์ 2569 และเดือนเมษายนถึงมิถุนายน 2569",
      },
    ],
  },
  {
    id: "left-out",
    heading: { en: "What was left out on purpose", th: "ข้อมูลที่ตั้งใจไม่เผยแพร่" },
    items: [
      {
        en: "The air purifier petition. We could not confirm that the people who signed agreed to be counted in public, so we do not publish even the total.",
        th: "รายชื่อสนับสนุนเรื่องเครื่องฟอกอากาศ เรายืนยันไม่ได้ว่าผู้ลงชื่อยินยอมให้นับและเผยแพร่ต่อสาธารณะ จึงไม่เผยแพร่แม้แต่ยอดรวม",
      },
      {
        en: "Comments about individual members in the end of year review meeting.",
        th: "ความเห็นเกี่ยวกับสมาชิกรายบุคคลในการประชุมทบทวนสิ้นปี",
      },
      {
        en: "Event photos, because we do not have consent from everyone in them.",
        th: "ภาพถ่ายในกิจกรรม เพราะเราไม่ได้รับความยินยอมจากทุกคนในภาพ",
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
