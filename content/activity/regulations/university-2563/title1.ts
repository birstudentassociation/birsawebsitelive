import type { Section } from "../types";

/**
 * Title 1 (ลักษณะ ๑): Rights and duties of students in student activities
 * (ข้อ 5–6), of the Regulation of Thammasat University on Student
 * Activities, B.E. 2563 (2020).
 */
export const title1: Section = {
  kind: { en: "Title", th: "ลักษณะ" },
  number: "1",
  title: {
    en: "Rights and duties of students in student activities",
    th: "สิทธิและหน้าที่ของนักศึกษาในการทำกิจกรรมนักศึกษา",
  },
  provisions: [
    {
      num: 5,
      title: { en: "Freedom of expression", th: "เสรีภาพในการแสดงความคิดเห็น" },
      body: [
        {
          kind: "para",
          text: {
            en: "In carrying out student activities, students shall have freedom of expression within the limits of the law and the University's regulations, having regard to being responsible members of society.",
            th: "ในการทำกิจกรรมนักศึกษานักศึกษาย่อมมีเสรีภาพในการแสดงความคิดเห็น ภายใต้ขอบเขตของกฎหมายและข้อบังคับของมหาวิทยาลัย ทั้งนี้ต้องคำนึงถึงความเป็นสุภาพชนที่มีความรับผิดชอบต่อสังคม",
          },
        },
      ],
    },
    {
      num: 6,
      title: { en: "Objectives of activities", th: "วัตถุประสงค์ของกิจกรรม" },
      body: [
        {
          kind: "para",
          text: {
            en: "Students have the right to carry out student activities under the following objectives:",
            th: "นักศึกษามีสิทธิในการทำกิจกรรมนักศึกษาภายใต้วัตถุประสงค์ของการดำเนินกิจกรรม ดังต่อไปนี้",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "to promote learning and self-training to become good citizens responsible to society;",
                th: "เพื่อส่งเสริมการเรียนรู้และฝึกฝนตนเองให้เป็นพลเมืองดีที่มีความรับผิดชอบต่อสังคม",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "to promote virtue and ethics;",
                th: "เพื่อส่งเสริมความมีคุณธรรมและจริยธรรม",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "to promote and preserve arts and culture;",
                th: "เพื่อส่งเสริมและทำนุบำรุงศิลปวัฒนธรรม",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "to promote learning in academic subjects and professions;",
                th: "เพื่อส่งเสริมการเรียนรู้ในวิชาการและวิชาชีพ",
              },
            },
            {
              marker: "(5)",
              text: {
                en: "to promote unity among students;",
                th: "เพื่อส่งเสริมความสามัคคีของนักศึกษา",
              },
            },
            {
              marker: "(6)",
              text: {
                en: "to promote and develop good character, sound health, and good human relations;",
                th: "เพื่อส่งเสริมและพัฒนาให้มีบุคลิกภาพที่ดี มีพลานามัยสมบูรณ์ และมีมนุษยสัมพันธ์ที่ดี",
              },
            },
            {
              marker: "(7)",
              text: {
                en: "to promote and support creative initiative;",
                th: "เพื่อส่งเสริมและสนับสนุนให้มีความคิดริเริ่มสร้างสรรค์",
              },
            },
            {
              marker: "(8)",
              text: {
                en: "to promote living happily and safely, using natural resources sustainably, and preserving the environment.",
                th: "เพื่อส่งเสริมให้ดำรงชีวิตอย่างมีความสุข ปลอดภัย ใช้ทรัพยากรธรรมชาติอย่างยั่งยืนและรักษาสิ่งแวดล้อม",
              },
            },
          ],
        },
      ],
    },
  ],
};
