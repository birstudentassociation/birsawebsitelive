import type { Section } from "../types";

/**
 * Preliminary provisions (ข้อ 1–4) of the Regulation of Thammasat University
 * on Student Activities, B.E. 2563 (2020).
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
            en: "This Regulation is called the \"Regulation of Thammasat University on Student Activities, Thammasat University, B.E. 2563 (2020).\"",
            th: "ข้อบังคับนี้เรียกว่า \"ข้อบังคับมหาวิทยาลัยธรรมศาสตร์ว่าด้วยกิจกรรมนักศึกษา มหาวิทยาลัยธรรมศาสตร์ พ.ศ. ๒๕๖๓\"",
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
            th: "ข้อบังคับนี้ให้ใช้บังคับนับถัดจากวันประกาศเป็นต้นไป",
          },
        },
      ],
    },
    {
      num: 3,
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
              term: { en: "\"the University\"", th: "\"มหาวิทยาลัย\"" },
              meaning: { en: "means Thammasat University;", th: "หมายความว่า มหาวิทยาลัยธรรมศาสตร์" },
            },
            {
              term: { en: "\"a Faculty\"", th: "\"คณะ\"" },
              meaning: {
                en: "means a Faculty or College, and includes an institute or other unit however named that provides instruction and has undergraduate students;",
                th: "หมายความว่า คณะ วิทยาลัย และให้หมายความรวมถึงสถาบันหรือส่วนงานที่เรียกชื่ออย่างอื่นที่มีการจัดการเรียนการสอนและมีนักศึกษาระดับปริญญาตรี",
              },
            },
            {
              term: { en: "\"Tha Prachan Campus\"", th: "\"ศูนย์ท่าพระจันทร์\"" },
              meaning: { en: "means Thammasat University, Tha Prachan Campus;", th: "หมายความว่า มหาวิทยาลัยธรรมศาสตร์ ศูนย์ท่าพระจันทร์" },
            },
            {
              term: { en: "\"Rangsit Campus\"", th: "\"ศูนย์รังสิต\"" },
              meaning: { en: "means Thammasat University, Rangsit Campus;", th: "หมายความว่า มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต" },
            },
            {
              term: { en: "\"Lampang Campus\"", th: "\"ศูนย์ลำปาง\"" },
              meaning: { en: "means Thammasat University, Lampang Campus;", th: "หมายความว่า มหาวิทยาลัยธรรมศาสตร์ ศูนย์ลำปาง" },
            },
            {
              term: { en: "\"a Campus\"", th: "\"ศูนย์\"" },
              meaning: {
                en: "means Tha Prachan Campus, Rangsit Campus, Lampang Campus, or any other campus established by the University;",
                th: "หมายความว่า ศูนย์ท่าพระจันทร์ ศูนย์รังสิต ศูนย์ลำปาง หรือศูนย์การศึกษาอื่นที่มหาวิทยาลัยจัดตั้งขึ้น",
              },
            },
            {
              term: { en: "\"student\"", th: "\"นักศึกษา\"" },
              meaning: {
                en: "means an undergraduate student of Thammasat University, or a student studying in a continuing bachelor's-to-master's degree programme, but does not include a student studying in a bachelor's degree programme for graduates or a programme that admits students who have already completed a bachelor's degree;",
                th: "หมายความว่า นักศึกษามหาวิทยาลัยธรรมศาสตร์ระดับปริญญาตรี หรือนักศึกษาที่ศึกษาในหลักสูตรปริญญาตรีต่อเนื่องปริญญาโท แต่ไม่รวมถึงนักศึกษาที่ศึกษาในหลักสูตรปริญญาตรีภาคบัณฑิตหรือหลักสูตรที่รับนักศึกษาจากผู้จบการศึกษาระดับปริญญาตรีมาแล้ว",
              },
            },
            {
              term: { en: "\"TUSC\"", th: "\"สภานักศึกษา\"" },
              meaning: {
                en: "means the Thammasat University Student Council;",
                th: "หมายความว่า สภานักศึกษามหาวิทยาลัยธรรมศาสตร์",
              },
            },
            {
              term: { en: "\"a Campus Student Council\"", th: "\"สภานักศึกษาระดับศูนย์\"" },
              meaning: {
                en: "means the Student Council of Tha Prachan Campus, the Student Council of Rangsit Campus, the Student Council of Lampang Campus, or the Student Council of any other campus established by the University;",
                th: "หมายความว่า สภานักศึกษา ศูนย์ท่าพระจันทร์ หรือสภานักศึกษา ศูนย์รังสิต สภานักศึกษา ศูนย์ลำปาง หรือสภานักศึกษาศูนย์การศึกษาที่มหาวิทยาลัยจัดตั้งขึ้น",
              },
            },
            {
              term: { en: "\"TUSU\"", th: "\"องค์การนักศึกษา\"" },
              meaning: {
                en: "means the Thammasat University Student Union;",
                th: "หมายความว่า องค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์",
              },
            },
            {
              term: { en: "\"the TUSU Executive Committee\"", th: "\"คณะกรรมการบริหารองค์การนักศึกษา\"" },
              meaning: { en: "means the Executive Committee of TUSU;", th: "หมายความว่า คณะกรรมการบริหารองค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์" },
            },
            {
              term: { en: "\"a Campus TUSU Executive Committee\"", th: "\"คณะกรรมการบริหารองค์การนักศึกษา ระดับศูนย์\"" },
              meaning: {
                en: "means the Executive Committee of TUSU at Tha Prachan Campus, at Rangsit Campus, at Lampang Campus, or at any other campus established by the University;",
                th: "หมายความว่า คณะกรรมการบริหารองค์การนักศึกษา ศูนย์ท่าพระจันทร์ คณะกรรมการบริหารองค์การนักศึกษา ศูนย์รังสิต คณะกรรมการบริหารองค์การนักศึกษา ศูนย์ลำปาง หรือคณะกรรมการบริหารองค์การนักศึกษาศูนย์การศึกษาที่มหาวิทยาลัยจัดตั้งขึ้น",
              },
            },
            {
              term: { en: "\"the Election Commission\"", th: "\"คณะกรรมการการเลือกตั้ง\"" },
              meaning: { en: "means the Election Commission of Thammasat University;", th: "หมายความว่า คณะกรรมการการเลือกตั้งมหาวิทยาลัยธรรมศาสตร์" },
            },
            {
              term: { en: "\"the Faculty Student Committee\"", th: "\"คณะกรรมการนักศึกษาประจำคณะ\"" },
              meaning: {
                en: "means the Faculty Student Committee, the College Student Committee, or the Institute Student Committee, whichever provides undergraduate instruction of Thammasat University;",
                th: "หมายความว่า คณะกรรมการนักศึกษาประจำคณะ คณะกรรมการนักศึกษาประจำวิทยาลัย หรือคณะกรรมการนักศึกษาประจำสถาบัน ซึ่งมีการจัดการเรียนการสอนในระดับปริญญาตรีของมหาวิทยาลัยธรรมศาสตร์",
              },
            },
            {
              term: { en: "\"the Student Dormitory Committee\"", th: "\"คณะกรรมการหอพักนักศึกษา\"" },
              meaning: { en: "means the Student Dormitory Committee of Thammasat University;", th: "หมายความว่า คณะกรรมการหอพักนักศึกษามหาวิทยาลัยธรรมศาสตร์" },
            },
            {
              term: { en: "\"a student activity club\"", th: "\"ชุมนุมกิจกรรมนักศึกษา\"" },
              meaning: { en: "means a student activity club of Thammasat University;", th: "หมายความว่า ชุมนุมกิจกรรมนักศึกษามหาวิทยาลัยธรรมศาสตร์" },
            },
            {
              term: { en: "\"the Student Affairs Committee\"", th: "\"คณะกรรมการกิจการนักศึกษา\"" },
              meaning: { en: "means the Student Affairs Committee of Thammasat University.", th: "หมายความว่า คณะกรรมการกิจการนักศึกษามหาวิทยาลัยธรรมศาสตร์" },
            },
          ],
        },
      ],
    },
    {
      num: 4,
      title: { en: "Enforcement by the Rector", th: "ผู้รักษาการ" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Rector shall be in charge of the enforcement of this Regulation.",
            th: "ให้อธิการบดีเป็นผู้รักษาการตามข้อบังคับนี้",
          },
        },
      ],
    },
  ],
};
