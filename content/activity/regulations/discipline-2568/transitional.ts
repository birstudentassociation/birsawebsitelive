import type { Section } from "../types";

/**
 * Transitional provisions (บทเฉพาะกาล), ข้อ 41, of the Regulation of
 * Thammasat University on Student Discipline, B.E. 2568 (2025).
 */
export const transitional: Section = {
  title: { en: "Transitional provisions", th: "บทเฉพาะกาล" },
  provisions: [
    {
      num: 41,
      title: { en: "Pending proceedings", th: "เรื่องที่ค้างพิจารณา" },
      body: [
        {
          kind: "para",
          text: {
            en: "Where disciplinary proceedings have been taken, or an appeal against a penalty has been filed, before this Regulation comes into force, such matter shall be proceeded with under the Regulation of Thammasat University on Student Discipline, B.E. 2564 (2021), until finished, except that where any provision of this Regulation is more favourable to the student, that provision shall apply instead.",
            th: "ในกรณีที่ได้มีการดำเนินการทางวินัยหรือมีการยื่นเรื่องอุทธรณ์โทษไว้ก่อนที่ข้อบังคับนี้มีผลใช้บังคับ ให้ดำเนินการตามข้อบังคับมหาวิทยาลัยธรรมศาสตร์ ว่าด้วยวินัยนักศึกษา พ.ศ. ๒๕๖๔ จนกว่าจะแล้วเสร็จ เว้นแต่บทบัญญัติใดแห่งข้อบังคับนี้ที่เป็นคุณแก่นักศึกษา ให้ใช้บทบัญญัตินั้นแทน",
          },
        },
      ],
    },
  ],
};
