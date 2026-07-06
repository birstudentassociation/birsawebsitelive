import type { Part } from "./types";

export const preliminary: Part = {
  num: null,
  title: { en: "Preliminary", th: "บทเบื้องต้น" },
  provisions: [
    {
      num: 1,
      title: { en: "Citation", th: "ชื่อประกาศ" },
      lead: {
        en: 'This Notice is called the "Notice of the Faculty of Political Science, Thammasat University, on Student Activities of the Faculty of Political Science, B.E. 2565".',
        th: "ประกาศนี้เรียกว่า “ประกาศคณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เรื่อง กิจกรรมนักศึกษา คณะรัฐศาสตร์ พ.ศ. 2565”",
      },
    },
    {
      num: 2,
      title: { en: "Commencement", th: "วันบังคับใช้" },
      lead: {
        en: "This Notice shall come into force from the day following the date of its announcement.",
        th: "ประกาศนี้ให้ใช้ตั้งแต่วันถัดจากวันประกาศเป็นต้นไป",
      },
    },
    {
      num: 3,
      title: { en: "Definitions", th: "คำนิยาม" },
      lead: {
        en: "In this Notice:",
        th: "ตามประกาศนี้",
      },
      definitions: [
        {
          term: { en: '"University"', th: "“มหาวิทยาลัย”" },
          meaning: { en: "means Thammasat University;", th: "หมายถึง มหาวิทยาลัยธรรมศาสตร์" },
        },
        {
          term: { en: '"Notice"', th: "“ประกาศ”" },
          meaning: {
            en: "means a notice of the Faculty of Political Science, Thammasat University;",
            th: "หมายถึง ประกาศคณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
          },
        },
        {
          term: { en: '"Faculty"', th: "“คณะ”" },
          meaning: {
            en: "means the Faculty of Political Science, Thammasat University;",
            th: "หมายถึง คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
          },
        },
        {
          term: { en: '"Dean"', th: "“คณบดี”" },
          meaning: {
            en: "means the Dean of the Faculty of Political Science, Thammasat University;",
            th: "หมายถึง คณบดีคณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
          },
        },
        {
          term: { en: '"Student"', th: "“นักศึกษา”" },
          meaning: {
            en: "means a student of the Faculty of Political Science, Thammasat University.",
            th: "หมายถึง นักศึกษาคณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
          },
        },
      ],
    },
  ],
};
