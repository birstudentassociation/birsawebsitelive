import type { AboutSection } from "@/lib/open-data";

/**
 * "About the data" for the 2022 to 2023 edition: how the figures were made,
 * how people's privacy was protected, where sources disagree and what BIRSA
 * does not hold for the year.
 */
export const about: AboutSection[] = [
  {
    id: "how",
    heading: { en: "How these figures were made", th: "ตัวเลขเหล่านี้มาจากไหน" },
    paragraphs: [
      {
        en: "Every figure comes from BIRSA's own working files for the year, such as its budget plan, project forms, event reports, survey response sheets, meeting notes and group register. Nothing was estimated. Where a value was missing, the table leaves the cell empty.",
        th: "ตัวเลขทุกตัวมาจากเอกสารทำงานของ BIRSA ในปีนั้น เช่น แผนงบประมาณ แบบเสนอโครงการ รายงานโครงการ ข้อมูลดิบของแบบสอบถาม บันทึกการประชุม และทะเบียนกลุ่ม เราไม่ได้ประมาณตัวเลขใดขึ้นเอง หากไม่มีค่าใด ช่องในตารางจะเว้นว่างไว้",
      },
      {
        en: "Survey scores were worked out from the raw response sheets. Each score is a simple average on a scale of 1 to 5, rounded to 2 decimal places, and blank answers are skipped.",
        th: "คะแนนจากแบบสอบถามคำนวณจากข้อมูลดิบ แต่ละคะแนนเป็นค่าเฉลี่ยธรรมดาในระดับ 1 ถึง 5 ปัดเป็นทศนิยม 2 ตำแหน่ง และข้ามคำตอบที่เว้นว่าง",
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
        en: "The source files hold names, student ID numbers, phone numbers, email addresses and signatures. None of these appear here. People are shown only as roles or as counts. Survey answers were counted and averaged, and no respondent's details or written comments are published.",
        th: "เอกสารต้นทางมีชื่อ เลขทะเบียนนักศึกษา เบอร์โทรศัพท์ อีเมล และลายมือชื่อ ข้อมูลเหล่านี้ไม่ปรากฏในหน้านี้เลย เราแสดงบุคคลเป็นตำแหน่งหรือเป็นจำนวนเท่านั้น คำตอบแบบสอบถามถูกนับและหาค่าเฉลี่ย โดยไม่เผยแพร่ข้อมูลของผู้ตอบหรือข้อความที่เขียนไว้",
      },
    ],
  },
  {
    id: "disagree",
    heading: { en: "Where the sources disagree", th: "จุดที่เอกสารให้ตัวเลขไม่ตรงกัน" },
    items: [
      {
        en: "Sports Day budget. The project form says ฿21,590, the budget plan ฿18,690, an equipment sheet ฿11,990 and an earlier division sheet ฿6,400. The money page shows the form and the plan side by side.",
        th: "งบงานกีฬาสี แบบเสนอโครงการระบุ 21,590 บาท แผนงบประมาณ 18,690 บาท ตารางอุปกรณ์ 11,990 บาท และตารางของฝ่ายฉบับก่อนหน้า 6,400 บาท หน้าการเงินแสดงตัวเลขของแบบเสนอโครงการและแผนไว้เทียบกัน",
      },
      {
        en: "Seminar budget. The project form says ฿7,350 and the plan ฿8,900.",
        th: "งบงานเสวนา แบบเสนอโครงการระบุ 7,350 บาท ส่วนแผนระบุ 8,900 บาท",
      },
      {
        en: "Running costs. The plan has ฿30,000 for two semesters and the project form ฿20,500 for semester 1.",
        th: "ค่าใช้จ่ายสโมสร แผนระบุ 30,000 บาทสำหรับสองภาคการศึกษา ส่วนแบบเสนอโครงการระบุ 20,500 บาทสำหรับภาคการศึกษาที่ 1",
      },
      {
        en: "Open House room. The plan says room 107 and the report says room R103. This page uses the report.",
        th: "ห้องจัดงาน Open House แผนระบุห้อง 107 ส่วนรายงานระบุห้อง ร.103 หน้านี้ใช้ตามรายงาน",
      },
      {
        en: "Sports Day surveys. Two forms exist with different activity lists. Both are shown. The second matches BIRSA's event report.",
        th: "แบบสอบถามงานกีฬาสี มีสองชุดที่รายการกิจกรรมต่างกัน แสดงทั้งสองชุด โดยชุดที่สองตรงกับรายงานโครงการของ BIRSA",
      },
      {
        en: "Seminar attendance. The report gives exactly the planned 45 people, so it may repeat the plan rather than a count on the day.",
        th: "ผู้เข้าร่วมงานเสวนา รายงานระบุ 45 คนตรงกับที่วางแผนไว้พอดี จึงอาจเป็นการคัดตัวเลขจากแผน ไม่ใช่การนับในวันงาน",
      },
      {
        en: "The budget file is titled for the 2023 fiscal year, but its lines are for academic year 2022 to 2023.",
        th: "ไฟล์งบประมาณตั้งชื่อว่าปีงบประมาณ 2566 แต่รายการเป็นของปีการศึกษา 2565",
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
        en: "Actual income, actual spending and balances for the year, and any financial report.",
        th: "รายรับ รายจ่าย และเงินคงเหลือจริงของปี รวมถึงรายงานการเงินใด ๆ",
      },
      {
        en: "Election results. A form for the first year student leaders election in autumn 2022 exists, but no candidates, votes, turnout or eligible voters.",
        th: "ผลการเลือกตั้ง มีแบบใบสมัครสำหรับการเลือกแกนนำนักศึกษาชั้นปีที่ 1 ในฤดูใบไม้ร่วง 2565 แต่ไม่มีผู้สมัคร คะแนนเสียง อัตราการออกมาใช้สิทธิ์ หรือจำนวนผู้มีสิทธิ์",
      },
      {
        en: "The size of the committee, its roles and any recruitment figures.",
        th: "จำนวนกรรมการ ตำแหน่ง และตัวเลขการรับสมัครสมาชิก",
      },
      {
        en: "Attendance at Sports Day, orientation and the Road Show, and the number of online viewers of the seminar.",
        th: "จำนวนผู้เข้าร่วมงานกีฬาสี ปฐมนิเทศ และ Road Show และจำนวนผู้ชมออนไลน์ของงานเสวนา",
      },
      {
        en: "Attendance at committee meetings.",
        th: "จำนวนผู้เข้าประชุมคณะกรรมการ",
      },
      {
        en: "Follower or reach figures for BIRSA's social media.",
        th: "จำนวนผู้ติดตามหรือการเข้าถึงของโซเชียลมีเดียของ BIRSA",
      },
    ],
  },
  {
    id: "left-out",
    heading: { en: "What was left out on purpose", th: "ข้อมูลที่ตั้งใจไม่เผยแพร่" },
    items: [
      {
        en: "Items for the common room, which is not a BIRSA project. They are left out of every figure and total.",
        th: "รายการของห้องคอมมอน ซึ่งไม่ใช่โครงการของ BIRSA จึงไม่รวมอยู่ในตัวเลขหรือยอดรวมใด",
      },
      {
        en: "Written survey comments, and respondents' schools and personal details.",
        th: "ข้อความที่ผู้ตอบแบบสอบถามเขียนไว้ รวมถึงโรงเรียนและข้อมูลส่วนบุคคลของผู้ตอบ",
      },
      {
        en: "Names of speakers, organisers and group leaders.",
        th: "ชื่อวิทยากร ผู้จัดงาน และผู้นำกลุ่ม",
      },
      {
        en: "Two opinion polls, on Thammasat Tha Prachan and Rangsit activities and on Tha Prachan Games rules. They are not feedback on a BIRSA event, so they are not in this edition.",
        th: "แบบสำรวจความคิดเห็นสองชุด เรื่องกิจกรรมร่วมท่าพระจันทร์และรังสิต และเรื่องกติกา TPC Game ซึ่งไม่ใช่ความเห็นต่อกิจกรรมของ BIRSA จึงไม่รวมไว้ในชุดข้อมูลนี้",
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
