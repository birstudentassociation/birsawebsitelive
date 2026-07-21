import type { Part } from "./types";

export const part08: Part = {
  num: 8,
  title: {
    en: "The Faculty Election Committee (กกต.ร.)",
    th: "คณะกรรมการการเลือกตั้ง คณะรัฐศาสตร์",
  },
  provisions: [
    {
      num: 69,
      title: { en: "Establishment of the Election Committee", th: "การจัดตั้ง กกต.ร." },
      lead: {
        en: "There shall be a “Faculty of Political Science Election Committee”, abbreviated as “กกต.ร.”, whose duty is to conduct the election of the PSC.",
        th: "ให้มี “คณะกรรมการการเลือกตั้ง คณะรัฐศาสตร์” ชื่อย่อ “กกต.ร.” มีหน้าที่ดำเนินการเลือกตั้ง กนศ.ร.",
      },
    },
    {
      num: 70,
      title: { en: "Composition of the กกต.ร.", th: "องค์ประกอบของ กกต.ร." },
      lead: {
        en: "The กกต.ร. shall be composed of:",
        th: "ที่มาของ กกต.ร. ประกอบไปด้วย",
      },
      items: [
        {
          marker: "(1)",
          text: {
            en: "the Chair of the กกต.ร., being ex officio the Faculty administrator appointed by the Dean to superintend student affairs;",
            th: "ประธาน กกต.ร. ให้ผู้บริหารคณะที่คณบดีแต่งตั้งให้เป็นผู้ดูแลด้านกิจการนักศึกษาเป็นประธานโดยตำแหน่ง",
          },
        },
        {
          marker: "(2)",
          text: {
            en: "not more than 2 full-time lecturers of the Faculty of Political Science;",
            th: "อาจารย์ประจำคณะรัฐศาสตร์ ไม่เกิน 2 คน",
          },
        },
        {
          marker: "(3)",
          text: {
            en: "not more than 4 officers of the Faculty's student activities office;",
            th: "เจ้าหน้าที่งานกิจกรรมนักศึกษาคณะ ไม่เกิน 4 คน",
          },
        },
        {
          marker: "(4)",
          text: {
            en: "1 representative of the คกร. from each undergraduate year.",
            th: "ตัวแทน คกร. ระดับปริญญาตรีแต่ละชั้นปี ชั้นปีละ 1 คน",
          },
          note: {
            en: "Provided that a representative of the คกร. of each undergraduate year must not be a candidate for election to the PSC, or a person holding office in that academic year.",
            th: "โดยทั้งนี้ตัวแทน คกร. ระดับปริญญาตรีแต่ละชั้นปี นั้นจะต้องไม่เป็นผู้สมัครรับเลือกตั้ง กนศ.ร. หรือเป็นผู้ที่ดำรงตำแหน่งในปีการศึกษานั้น ๆ",
          },
        },
      ],
    },
    {
      num: 71,
      title: { en: "Powers of the กกต.ร.", th: "อำนาจหน้าที่ของ กกต.ร." },
      lead: {
        en: "The กกต.ร. shall have the following powers and duties:",
        th: "กกต.ร. มีอำนาจหน้าที่ดังนี้",
      },
      items: [
        {
          marker: "(1)",
          text: {
            en: "to conduct the election of the PSC in accordance with the regulations;",
            th: "ดำเนินการจัดการเลือกตั้ง กนศ.ร. ให้เป็นไปตามข้อบังคับ",
          },
        },
        {
          marker: "(2)",
          text: {
            en: "to receive complaints before and after the election;",
            th: "รับเรื่องร้องเรียนก่อนและหลังการเลือกตั้ง",
          },
        },
        {
          marker: "(3)",
          text: {
            en: "after the election results are known, to submit the list of the PSC to the Dean for appointment;",
            th: "หลังทราบผลการเลือกตั้ง ให้ กกต.ร. นำรายชื่อ กนศ.ร. แจ้งต่อคณบดีเพื่อประกาศแต่งตั้ง",
          },
        },
        {
          marker: "(4)",
          text: { en: "to fix the date of the election.", th: "กำหนดวันเลือกตั้ง" },
        },
      ],
    },
    {
      num: 72,
      title: { en: "Timeline for forming the กกต.ร.", th: "กำหนดเวลาสรรหา กกต.ร." },
      lead: {
        en: "The selection of the กกต.ร. must be completed within 30 days after the opening of the second semester of that academic year, unless there is a reasonable necessity/emergency, in which case it shall be at the Dean's discretion to extend the time as appropriate.",
        th: "การสรรหา กกต.ร. ต้องแล้วเสร็จภายในเวลา 30 วันหลังเปิดภาคการศึกษาที่ 2 ของปีการศึกษานั้น เว้นแต่มีเหตุจำเป็น/ฉุกเฉินอันสมควร ให้เป็นดุลพินิจของคณบดีในการขยายเวลาได้ตามความเหมาะสม",
      },
    },
    {
      num: 73,
      title: { en: "Dean's signature of appointment", th: "การลงนามแต่งตั้ง" },
      lead: {
        en: "The Dean shall sign the appointment within 15 days after the nomination.",
        th: "ให้คณบดีลงนามแต่งตั้งภายใน 15 วันหลังการเสนอชื่อ",
      },
    },
    {
      num: 74,
      title: { en: "End of the กกต.ร.'s term", th: "การสิ้นสุดวาระ กกต.ร." },
      lead: {
        en: "The กกต.ร. shall end its term after the appointment of the PSC is announced.",
        th: "กกต.ร. จะหมดวาระหลังจากการประกาศแต่งตั้ง กนศ.ร.",
      },
    },
  ],
};
