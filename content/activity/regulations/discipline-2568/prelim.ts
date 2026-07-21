import type { Section } from "../types";

/**
 * Preliminary provisions (ข้อ 1 to 5) of the Regulation of Thammasat University
 * on Student Discipline, B.E. 2568 (2025).
 */
export const preliminary: Section = {
  title: { en: "Preliminary", th: "บทเบื้องต้น" },
  provisions: [
    {
      num: 1,
      title: { en: "Citation", th: "ชื่อข้อบังคับ" },
      body: [
        {
          kind: "para",
          text: {
            en: 'This Regulation is called the "Regulation of Thammasat University on Student Discipline, B.E. 2568 (2025)."',
            th: 'ข้อบังคับนี้เรียกว่า "ข้อบังคับมหาวิทยาลัยธรรมศาสตร์ ว่าด้วยวินัยนักศึกษา พ.ศ. ๒๕๖๘"',
          },
        },
      ],
    },
    {
      num: 2,
      title: { en: "Commencement", th: "วันใช้บังคับ" },
      body: [
        {
          kind: "para",
          text: {
            en: "This Regulation shall come into force on the day following the date of its announcement.",
            th: "ข้อบังคับนี้ให้ใช้บังคับตั้งแต่วันถัดจากวันประกาศเป็นต้นไป",
          },
        },
      ],
    },
    {
      num: 3,
      title: { en: "Repeal", th: "การยกเลิก" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Regulation of Thammasat University on Student Discipline, B.E. 2564 (2021), is hereby repealed.",
            th: "ให้ยกเลิกข้อบังคับมหาวิทยาลัยธรรมศาสตร์ ว่าด้วยวินัยนักศึกษา พ.ศ. ๒๕๖๔",
          },
        },
      ],
    },
    {
      num: 4,
      title: { en: "Definitions", th: "บทนิยาม" },
      body: [
        {
          kind: "para",
          text: {
            en: "In this Regulation:",
            th: "ในข้อบังคับนี้",
          },
        },
        {
          kind: "definitions",
          entries: [
            {
              term: { en: '"the University"', th: '"มหาวิทยาลัย"' },
              meaning: {
                en: "means Thammasat University;",
                th: "หมายความว่า มหาวิทยาลัยธรรมศาสตร์",
              },
            },
            {
              term: { en: '"the Rector"', th: '"อธิการบดี"' },
              meaning: {
                en: "means the Rector of Thammasat University;",
                th: "หมายความว่า อธิการบดีมหาวิทยาลัยธรรมศาสตร์",
              },
            },
            {
              term: { en: '"a Faculty"', th: '"คณะ"' },
              meaning: {
                en: "includes a College, Institute, or other unit however named that is responsible for providing instruction under the curricula of the University;",
                th: "ให้หมายความรวมถึงวิทยาลัย สถาบัน หรือส่วนงานที่เรียกชื่ออย่างอื่นที่ทำหน้าที่ในการจัดให้มีการเรียนการสอนตามหลักสูตรของมหาวิทยาลัย",
              },
            },
            {
              term: { en: '"the Dean"', th: '"คณบดี"' },
              meaning: {
                en: "includes the Director of an Institute, or the head of a unit however named that is responsible for providing instruction under the curricula of the University;",
                th: "ให้หมายความรวมถึงผู้อำนวยการสถาบัน หรือหัวหน้าส่วนงานที่เรียกชื่ออย่างอื่นที่ทำหน้าที่ในการจัดให้มีการเรียนการสอนตามหลักสูตรของมหาวิทยาลัย",
              },
            },
            {
              term: { en: '"a student"', th: '"นักศึกษา"' },
              meaning: {
                en: "means a student at any level who is registered as a student of the University;",
                th: "หมายความว่า นักศึกษาทุกระดับที่ขึ้นทะเบียนเป็นนักศึกษาของมหาวิทยาลัย",
              },
            },
            {
              term: { en: '"academic assessment"', th: '"การวัดผลการศึกษา"' },
              meaning: {
                en: "means academic assessment of any kind, whether inter-sessional assessment, final examinations, or assessment by any method prescribed by the instructor, comprehensive examinations, qualifying examinations, thesis-proposal examinations, independent study or thesis research, thesis examinations, independent study or thesis research, credit-transfer equivalency testing, or academic assessment of any other character.",
                th: "หมายความว่า การวัดผลการศึกษาทั้งที่เป็นการวัดผลการศึกษาระหว่างภาค การสอบไล่ หรือวิธีการวัดผลตามวิธีการที่อาจารย์ผู้สอนกำหนด การสอบประมวลวิชา การสอบวัดคุณสมบัติ การสอบเค้าโครงสารนิพนธ์ การค้นคว้าอิสระหรือวิทยานิพนธ์ การสอบสารนิพนธ์ การค้นคว้าอิสระหรือวิทยานิพนธ์ การทดสอบเทียบความรู้แทนการวัดผลการศึกษา หรือการวัดผลการศึกษาในลักษณะอื่น",
              },
            },
          ],
        },
      ],
    },
    {
      num: 5,
      title: { en: "Enforcement by the Rector", th: "ผู้รักษาการ" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Rector shall be in charge of the enforcement of this Regulation. In the event of any problem concerning compliance with this Regulation, the Rector shall have the power to make orders for compliance as the Rector deems appropriate, and such orders shall be final.",
            th: "ให้อธิการบดีเป็นผู้รักษาการตามข้อบังคับนี้ ในกรณีที่มีปัญหาเกี่ยวกับการปฏิบัติตามข้อบังคับนี้ ให้อธิการบดีมีอำนาจสั่งการให้ปฏิบัติตามที่เห็นสมควรและถือเป็นที่สุด",
          },
        },
      ],
    },
  ],
};
