import type { Part } from "./types";

export const part10: Part = {
  num: 10,
  title: { en: "Finance", th: "การเงิน" },
  provisions: [
    {
      num: 81,
      title: { en: "Annual budget", th: "งบประมาณประจำปี" },
      lead: {
        en: "The Faculty shall prepare a budget allocated into three parts, as follows:",
        th: "ให้คณะจัดทำงบประมาณโดยจัดสรรเป็น 3 ส่วน ดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "the PSC's part;", th: "ส่วนของ กนศ.ร." } },
        {
          marker: "(2)",
          text: {
            en: "the part subsidizing Faculty activity groups;",
            th: "ส่วนอุดหนุนกลุ่มกิจกรรมคณะ",
          },
        },
        { marker: "(3)", text: { en: "the central fund part.", th: "ส่วนงบกลาง" } },
      ],
      tail: {
        en: "In any year in which no activity group affiliated to the PSC is formed, paragraph (2) shall not apply.",
        th: "ในปีใดที่ไม่มีการจัดตั้งกลุ่มกิจกรรมสังกัด กนศ.ร. ขึ้นมา ให้ยกเลิกข้อ (2)",
      },
    },
    {
      num: 82,
      title: { en: "Revenue of the PSC", th: "รายได้ของ กนศ.ร." },
      lead: { en: "The PSC's revenue consists of:", th: "รายได้ของ กนศ.ร. คือ" },
      items: [
        { marker: "(1)", text: { en: "subsidy funds from the Faculty;", th: "เงินอุดหนุนจากคณะ" } },
        {
          marker: "(2)",
          text: {
            en: "special income from the PSC's own fundraising.",
            th: "เงินรายได้พิเศษ จากการหาทุนของ กนศ.ร. เอง",
          },
        },
      ],
    },
    {
      num: 83,
      title: { en: "Disbursement of the budget", th: "การเบิกจ่ายงบประมาณ" },
      lead: {
        en: "The disbursement of the budget of the PSC and Faculty activity groups shall follow the operating regulations of the Faculty's Finance Division, applied mutatis mutandis.",
        th: "การเบิกจ่ายงบประมาณของ กนศ.ร. และกลุ่มกิจกรรมคณะ ให้เป็นไปตามระเบียบปฏิบัติของฝ่ายการเงินของคณะโดยอนุโลม",
      },
    },
    {
      num: 84,
      title: { en: "Special disbursements outside the budget", th: "การสั่งจ่ายกรณีพิเศษ" },
      lead: {
        en: "A special disbursement outside the budget must first receive the approval of the Faculty.",
        th: "การสั่งจ่ายกรณีพิเศษนอกเหนือไปจากงบประมาณ ต้องได้รับความเห็นชอบจากคณะก่อน",
      },
    },
    {
      num: 85,
      title: { en: "Right to audit accounts", th: "สิทธิตรวจสอบบัญชี" },
      lead: {
        en: "50 or more students of the Faculty of Political Science may sign a petition requesting an audit of the PSC's financial accounts, as they see fit, not more than once per semester.",
        th: "นักศึกษาคณะรัฐศาสตร์จำนวน 50 คนขึ้นไป สามารถเข้าชื่อขอตรวจสอบบัญชีการเงินของ กนศ.ร. ได้ ตามที่เห็นสมควร ไม่เกินภาคละ 1 ครั้ง",
      },
    },
  ],
};
