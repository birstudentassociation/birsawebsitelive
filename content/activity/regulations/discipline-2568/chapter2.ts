import type { Section } from "../types";

/**
 * Chapter 2 (หมวด ๒ โทษ และการพิจารณาโทษทางวินัย: Penalties and disciplinary
 * consideration), ข้อ 10 to 12, of the Regulation of Thammasat University on
 * Student Discipline, B.E. 2568 (2025).
 */
export const chapter2: Section = {
  kind: { en: "Chapter", th: "หมวด" },
  number: "2",
  title: {
    en: "Penalties and disciplinary consideration",
    th: "โทษและการพิจารณาโทษทางวินัย",
  },
  provisions: [
    {
      num: 10,
      title: { en: "Disciplinary penalties", th: "โทษทางวินัย" },
      body: [
        {
          kind: "para",
          text: {
            en: "There are seven disciplinary penalties, namely:",
            th: "โทษวินัยมี ๗ สถาน คือ",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "a written disciplinary probation;",
                th: "ทำทัณฑ์บน",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "suspension from study for one semester;",
                th: "ให้พักการศึกษาหนึ่งภาคการศึกษา",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "suspension from study for up to one academic year;",
                th: "ให้พักการศึกษาไม่เกินหนึ่งปีการศึกษา",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "withholding of the submission of the student's name for approval of graduation for one semester;",
                th: "ไม่เสนอชื่อเพื่อขออนุมัติให้สำเร็จการศึกษาตามหลักสูตรเป็นเวลาหนึ่งภาคการศึกษา",
              },
            },
            {
              marker: "(5)",
              text: {
                en: "withholding of the submission of the student's name for approval of graduation for up to one academic year;",
                th: "ไม่เสนอชื่อเพื่อขออนุมัติให้สำเร็จการศึกษาตามหลักสูตรเป็นเวลาไม่เกินหนึ่งปีการศึกษา",
              },
            },
            {
              marker: "(6)",
              text: {
                en: "disqualification from sitting examinations in all or some courses, applicable only in a case of cheating in academic assessment;",
                th: "ตัดสิทธิการเข้าสอบในทุกรายวิชาหรือบางรายวิชา เฉพาะกรณีทุจริตในการวัดผลการศึกษาเท่านั้น",
              },
            },
            {
              marker: "(7)",
              text: {
                en: "dismissal from student status.",
                th: "ให้พ้นสภาพนักศึกษา",
              },
            },
          ],
        },
      ],
    },
    {
      num: 11,
      title: {
        en: "Penalties for ordinary offences",
        th: "การลงโทษความผิดวินัย",
      },
      body: [
        {
          kind: "para",
          text: {
            en: "A student who commits a disciplinary offence under section 7 shall be given a penalty under section 10(1), (2), or (4).",
            th: "นักศึกษาผู้ใดกระทำความผิดวินัยนักศึกษาตามข้อ ๗ ให้ลงโทษตามข้อ ๑๐ (๑) (๒) หรือ (๔)",
          },
        },
        {
          kind: "para",
          text: {
            en: "In imposing a penalty under the first paragraph, the Rector and the Dean shall consider the severity of the offence, the opportunity for registration, and the student's completion of study.",
            th: "ในการลงโทษตามวรรคแรก ให้อธิการบดีและคณบดีพิจารณาถึงความร้ายแรงของความผิดและโอกาสในการลงทะเบียน และการสำเร็จการศึกษาของนักศึกษา",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where there is reasonable cause to remit the penalty under section 10(1), the Rector or the Dean shall consider remitting such penalty, and shall instead give a warning with reasons recorded.",
            th: "ในกรณีมีเหตุอันควรงดโทษตามข้อ ๑๐ (๑) ให้อธิการบดีหรือคณบดีพิจารณางดโทษดังกล่าว โดยให้ว่ากล่าวตักเตือนและให้เหตุผลไว้",
          },
        },
      ],
    },
    {
      num: 12,
      title: {
        en: "Penalties for serious offences",
        th: "การลงโทษความผิดร้ายแรง",
      },
      body: [
        {
          kind: "para",
          text: {
            en: "A student who commits a serious disciplinary offence under section 8 shall be given a penalty under section 10(3), (5), (6), or (7).",
            th: "นักศึกษาผู้ใดกระทำความผิดวินัยนักศึกษาอย่างร้ายแรงตามข้อ ๘ ให้ลงโทษตามข้อ ๑๐ (๓) (๕) (๖) หรือ (๗)",
          },
        },
        {
          kind: "para",
          text: {
            en: "In addition to the penalty imposed under the first paragraph, a student who commits a serious disciplinary offence under section 8(4) may also be required to receive a penalty under section 10(6).",
            th: "นอกจากการลงโทษตามวรรคแรก ให้นักศึกษาที่กระทำความผิดวินัยนักศึกษาอย่างร้ายแรงตามข้อ ๘ (๔) อาจต้องรับโทษตามข้อ ๑๐ (๖) ร่วมด้วย",
          },
        },
      ],
    },
  ],
};
