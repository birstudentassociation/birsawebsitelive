import type { Part } from "./types";

export const part02: Part = {
  num: 2,
  title: { en: "Rights and duties of students", th: "สิทธิและหน้าที่ของนักศึกษา" },
  provisions: [
    {
      num: 5,
      title: { en: "Rights and duties", th: "สิทธิและหน้าที่" },
      lead: {
        en: "Students have the following rights and duties:",
        th: "นักศึกษามีสิทธิและหน้าที่ ดังต่อไปนี้",
      },
      items: [
        {
          marker: "(1)",
          text: {
            en: "the right, on an equal basis, to stand for election and to vote in the various student activities, in accordance with the regulations and notices relating to that activity;",
            th: "มีสิทธิโดยเท่าเทียมกันในการสมัครรับเลือกตั้งและออกเสียงในกิจกรรมต่างๆ ของนักศึกษาตามระเบียบและประกาศเกี่ยวกับกิจกรรมนั้นๆ",
          },
        },
        {
          marker: "(2)",
          text: {
            en: "the right to freely express opinions on and to comment on the various activities of the University and the Faculty;",
            th: "มีสิทธิในการแสดงความคิดเห็นและวิจารณ์อย่างเสรีเกี่ยวกับกิจกรรมต่างๆ ของมหาวิทยาลัยและคณะ",
          },
        },
        {
          marker: "(3)",
          text: {
            en: "the right, on an equal basis, to take part in the various student activities within the Faculty, in accordance with the objectives of student activities;",
            th: "มีสิทธิเท่าเทียมกันในกิจกรรมต่างๆ ของนักศึกษาในคณะ ตามวัตถุประสงค์ของกิจกรรมนักศึกษา",
          },
        },
        {
          marker: "(4)",
          text: {
            en: "the duty to maintain unity and solidarity, both within the Faculty and throughout the University;",
            th: "มีหน้าที่ดำรงไว้ซึ่งความสามัคคี ความเป็นเอกภาพทั้งภายในคณะและทั่วทั้งมหาวิทยาลัย",
          },
        },
        {
          marker: "(5)",
          text: { en: "the duty to comply with this Notice.", th: "มีหน้าที่ปฏิบัติตามประกาศนี้" },
        },
      ],
    },
  ],
};
