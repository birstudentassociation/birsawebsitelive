import type { Part } from "./types";

export const part09: Part = {
  num: 9,
  title: {
    en: "The BIR Election Committee (กกต.BIR)",
    th: "คณะกรรมการเลือกตั้ง สาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ",
  },
  provisions: [
    {
      num: 75,
      title: { en: "Establishment of the Election Committee", th: "การจัดตั้ง กกต.BIR" },
      lead: {
        en: "There shall be a “Politics and International Relations (English Programme) Election Committee”, abbreviated as “กกต.BIR”, whose duty is to conduct the election of BIRSA.",
        th: "ให้มี “คณะกรรมการเลือกตั้งสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ” ชื่อย่อ “กกต.BIR.” มีหน้าที่ดำเนินการเลือกตั้ง BIRSA",
      },
    },
    {
      num: 76,
      title: { en: "Composition of the กกต.BIR", th: "องค์ประกอบของ กกต.BIR" },
      lead: {
        en: "The กกต.BIR shall be composed of:",
        th: "ที่มาของ กกต.BIR. ประกอบไปด้วย",
      },
      items: [
        { marker: "(1)", text: { en: "the Chair of the กกต.BIR, being the Faculty administrator appointed by the Dean to superintend the international programme;", th: "ประธาน กกต.BIR. ให้เป็นผู้บริหารคณะที่คณบดีแต่งตั้งให้เป็นผู้ดูแลโครงการหลักสูตรนานาชาติ" } },
        { marker: "(2)", text: { en: "not more than 2 full-time lecturers of the Faculty of Political Science;", th: "อาจารย์ประจำคณะรัฐศาสตร์ ไม่เกิน 2 คน" } },
        { marker: "(3)", text: { en: "not more than 3 officers responsible for student affairs of the BIR programme;", th: "เจ้าหน้าที่ที่ดูแลกิจการนักศึกษาสาขาการเมืองและการระหว่างประเทศภาคภาษาอังกฤษ ไม่เกิน 3 คน" } },
        {
          marker: "(4)",
          text: { en: "1 representative of BIR programme students from each year.", th: "ตัวแทนนักศึกษาสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ แต่ละชั้นปี ชั้นปีละ 1 คน" },
          note: {
            en: "Provided that a representative of students of each year must not be a candidate for election to BIRSA, or a person holding office in that academic year.",
            th: "โดยทั้งนี้ตัวแทนนักศึกษาฯ แต่ละชั้นปีนั้น จะต้องไม่เป็นผู้สมัครรับเลือกตั้ง BIRSA หรือเป็นผู้ดำรงตำแหน่งในปีการศึกษานั้น ๆ",
          },
        },
      ],
    },
    {
      num: 77,
      title: { en: "Powers of the กกต.BIR", th: "อำนาจหน้าที่ของ กกต.BIR" },
      lead: { en: "The กกต.BIR shall have the following powers and duties:", th: "กกต.BIR. มีอำนาจหน้าที่ดังนี้" },
      items: [
        { marker: "(1)", text: { en: "to conduct the election of BIRSA in accordance with the regulations;", th: "ดำเนินการจัดการเลือกตั้ง BIRSA ให้เป็นไปตามข้อบังคับ" } },
        { marker: "(2)", text: { en: "to receive complaints before and after the election;", th: "รับเรื่องร้องเรียนก่อนและหลังการเลือกตั้ง" } },
        { marker: "(3)", text: { en: "after the election results are known, to submit the list of BIRSA to the Dean for appointment;", th: "หลังทราบผลการเลือกตั้ง ให้ กกต.BIR. นำรายชื่อ BIRSA แจ้งต่อคณบดีเพื่อประกาศแต่งตั้ง" } },
        { marker: "(4)", text: { en: "to fix the date of the election.", th: "กำหนดวันเลือกตั้ง" } },
      ],
    },
    {
      num: 78,
      title: { en: "Timeline for forming the กกต.BIR", th: "กำหนดเวลาสรรหา กกต.BIR" },
      lead: {
        en: "The selection of the กกต.BIR must be completed within 30 days after the opening of the second semester of that academic year, unless there is a reasonable necessity/emergency, in which case it shall be at the Dean's discretion to extend the time as appropriate.",
        th: "การสรรหา กกต.BIR. ต้องแล้วเสร็จภายในเวลา 30 วันหลังเปิดภาคการศึกษาที่ 2 ของปีการศึกษานั้น เว้นแต่มีเหตุจำเป็น/ฉุกเฉินอันสมควร ให้เป็นดุลยพินิจของคณบดีในการขยายเวลาได้ตามความเหมาะสม",
      },
    },
    {
      num: 79,
      title: { en: "Dean's signature of appointment", th: "การลงนามแต่งตั้ง" },
      lead: {
        en: "The Dean shall sign the appointment within 15 days after the nomination.",
        th: "ให้คณบดีลงนามแต่งตั้งภายใน 15 วันหลังการเสนอชื่อ",
      },
    },
    {
      num: 80,
      title: { en: "End of the กกต.BIR's term", th: "การสิ้นสุดวาระ กกต.BIR" },
      lead: {
        en: "The กกต.BIR shall end its term after the appointment of BIRSA is announced.",
        th: "กกต.BIR. จะหมดวาระหลังการประกาศแต่งตั้ง BIRSA",
      },
    },
  ],
};
