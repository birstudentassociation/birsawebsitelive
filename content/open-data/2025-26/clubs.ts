import type { Bilingual, Topic } from "@/lib/open-data";

const yes: Bilingual = { en: "Yes", th: "มี" };
const no: Bilingual = { en: "No", th: "ไม่มี" };
const inYes: Bilingual = { en: "Yes", th: "อยู่ในทะเบียน" };
const inNo: Bilingual = { en: "No", th: "ไม่อยู่ในทะเบียน" };

const academic: Bilingual = { en: "Academic", th: "วิชาการ" };
const sports: Bilingual = { en: "Sports", th: "กีฬา" };
const arts: Bilingual = { en: "Arts and culture", th: "ศิลปะและวัฒนธรรม" };
const community: Bilingual = { en: "Community and service", th: "ชุมชนและจิตอาสา" };
const social: Bilingual = { en: "Social", th: "สังสรรค์" };

export const clubs: Topic = {
  slug: "clubs",
  title: {
    en: "Which clubs were registered with BIRSA",
    th: "ชมรมใดบ้างที่ขึ้นทะเบียนกับสมาคม BIRSA",
  },
  summary: {
    en: "The BIR website lists 12 clubs, and 7 of them filed a founding application with BIRSA for 2025 to 2026.",
    th: "เว็บไซต์ BIR แสดงชมรม 12 ชมรม และมี 7 ชมรมที่ยื่นใบสมัครจัดตั้งต่อ BIRSA ในปีการศึกษา 2568",
  },
  mainPoints: [
    {
      en: "BIRSA's club sheet lists 9 clubs, and 7 of them filed a founding application for 2025 to 2026.",
      th: "ตารางชมรมของ BIRSA มี 9 ชมรม และ 7 ชมรมยื่นใบสมัครจัดตั้งสำหรับปีการศึกษา 2568",
    },
    {
      en: "Three of the 12 clubs on the BIR website are not on BIRSA's club sheet. They are TU MUN, Parliamock.TU and BIR CardGame.",
      th: "ในชมรม 12 ชมรมบนเว็บไซต์ BIR มี 3 ชมรมที่ไม่อยู่ในตารางของ BIRSA ได้แก่ TU MUN, Parliamock.TU และ BIR CardGame",
    },
    {
      en: "The earliest founding date on file is 2022, for BIR Music, BIRify and BIR Football.",
      th: "วันก่อตั้งที่เก่าที่สุดในเอกสารคือปี 2565 ได้แก่ ชมรมดนตรี BIR, BIRify และฟุตบอล BIR",
    },
    {
      en: "A club needs at least 5 members to be founded, including a President and a Treasurer.",
      th: "การจัดตั้งชมรมต้องมีสมาชิกอย่างน้อย 5 คน รวมประธานและเหรัญญิก",
    },
    {
      en: "Each of the 7 applications lists 5 people at founding, which is the minimum.",
      th: "ใบสมัครทั้ง 7 ฉบับระบุรายชื่อผู้ก่อตั้ง 5 คน ซึ่งเป็นจำนวนขั้นต่ำ",
    },
  ],
  headlines: [
    {
      value: "12",
      label: { en: "Clubs on this website", th: "ชมรมบนเว็บไซต์นี้" },
    },
    {
      value: "9",
      label: { en: "Clubs on BIRSA's club sheet", th: "ชมรมในตารางของ BIRSA" },
    },
    {
      value: "7",
      label: { en: "Founding applications filed", th: "ใบสมัครจัดตั้งที่ยื่นแล้ว" },
    },
    {
      value: "2022",
      label: { en: "Earliest founding year on file", th: "ปีก่อตั้งที่เก่าที่สุดในเอกสาร" },
    },
  ],
  warning: {
    en: "The number of people is a snapshot from each founding application. It is not current membership.",
    th: "จำนวนคนมาจากใบสมัครจัดตั้งของแต่ละชมรม เป็นข้อมูล ณ ตอนก่อตั้ง ไม่ใช่จำนวนสมาชิกปัจจุบัน",
  },
  datasets: [
    {
      id: "clubs-register",
      title: {
        en: "Clubs, founding dates and applications, 2025 to 2026",
        th: "ชมรม วันก่อตั้ง และใบสมัครจัดตั้ง ปีการศึกษา 2568",
      },
      summary: {
        en: "Seven of the 12 clubs on the BIR website filed a founding application, each listing 5 people.",
        th: "7 จาก 12 ชมรมบนเว็บไซต์ BIR ยื่นใบสมัครจัดตั้ง โดยแต่ละใบสมัครระบุรายชื่อ 5 คน",
      },
      columns: [
        { key: "club", label: { en: "Club", th: "ชมรม" }, kind: "text" },
        { key: "category", label: { en: "Category", th: "หมวด" }, kind: "text" },
        { key: "year", label: { en: "Year founded", th: "ปีที่ก่อตั้ง" }, kind: "text" },
        { key: "date", label: { en: "Date founded", th: "วันที่ก่อตั้ง" }, kind: "date" },
        {
          key: "register",
          label: { en: "On BIRSA's club sheet", th: "อยู่ในตารางของ BIRSA" },
          kind: "text",
        },
        {
          key: "application",
          label: {
            en: "Founding application on file",
            th: "มีใบสมัครจัดตั้ง",
          },
          kind: "text",
        },
        {
          key: "people",
          label: { en: "People listed at founding", th: "จำนวนคนที่ระบุตอนก่อตั้ง" },
          kind: "number",
        },
      ],
      rows: [
        {
          club: { en: "BIR Music Club", th: "ชมรมดนตรี BIR" },
          category: arts,
          year: { en: "2022", th: "2565" },
          date: "2022-06-26",
          register: inYes,
          application: yes,
          people: 5,
        },
        {
          club: { en: "BIRify", th: "BIRify" },
          category: arts,
          year: { en: "2022", th: "2565" },
          date: "2022-08-07",
          register: inYes,
          application: yes,
          people: 5,
        },
        {
          club: { en: "BIR Football", th: "ฟุตบอล BIR" },
          category: sports,
          year: { en: "2022", th: "2565" },
          date: null,
          register: inYes,
          application: yes,
          people: 5,
        },
        {
          club: { en: "Kien Club", th: "Kien Club" },
          category: arts,
          year: { en: "2023", th: "2566" },
          date: "2023-01-15",
          register: inYes,
          application: yes,
          people: 5,
        },
        {
          club: { en: "BIR Volleyball", th: "วอลเลย์บอล BIR" },
          category: sports,
          year: { en: "2023", th: "2566" },
          date: null,
          register: inYes,
          application: yes,
          people: 5,
        },
        {
          club: { en: "BIR Esports Club", th: "ชมรมอีสปอร์ต BIR" },
          category: sports,
          year: { en: "2025", th: "2568" },
          date: "2025-06-19",
          register: inYes,
          application: yes,
          people: 5,
        },
        {
          club: { en: "ASA IR", th: "อาสาไออาร์ (ASA IR)" },
          category: community,
          year: { en: "2025", th: "2568" },
          date: null,
          register: inYes,
          application: yes,
          people: 5,
        },
        {
          club: { en: "BIR Basketball", th: "บาสเกตบอล BIR" },
          category: sports,
          year: null,
          date: null,
          register: inYes,
          application: no,
          people: null,
        },
        {
          club: { en: "BIR Mock Fund (IAIC)", th: "กองทุนจำลอง BIR (IAIC)" },
          category: academic,
          year: null,
          date: null,
          register: inYes,
          application: no,
          people: null,
        },
        {
          club: { en: "TU MUN", th: "TU MUN" },
          category: academic,
          year: null,
          date: null,
          register: inNo,
          application: no,
          people: null,
        },
        {
          club: { en: "Parliamock.TU", th: "รัฐสภาจำลอง (Parliamock.TU)" },
          category: academic,
          year: null,
          date: null,
          register: inNo,
          application: no,
          people: null,
        },
        {
          club: { en: "BIR CardGame Club", th: "ชมรมการ์ดเกม BIR" },
          category: social,
          year: null,
          date: null,
          register: inNo,
          application: no,
          people: null,
        },
      ],
      notes: [
        {
          en: "Clubs are ordered by founding year. Within a year, clubs with a full date come first. Clubs with no application are last.",
          th: "เรียงตามปีที่ก่อตั้ง ในปีเดียวกันชมรมที่มีวันที่ครบจะมาก่อน ชมรมที่ไม่มีใบสมัครอยู่ท้ายตาราง",
        },
        {
          en: "A blank date means the application gives only a year, or the month could not be read from the scan. A blank year means no founding application is on file.",
          th: "ช่องวันที่ว่างหมายถึงใบสมัครระบุเพียงปี หรืออ่านเดือนจากเอกสารสแกนไม่ได้ ช่องปีว่างหมายถึงไม่มีใบสมัครจัดตั้ง",
        },
        {
          en: "The BIR Volleyball form is signed with the year 2015, which is an error on a 2025 form. Its founding year, 2023, comes from the founding date field.",
          th: "ใบสมัครของวอลเลย์บอล BIR ลงปีที่ลงนามเป็น 2558 ซึ่งผิดพลาดบนแบบฟอร์มปี 2568 ปีก่อตั้ง 2566 ใช้ตามช่องวันที่ก่อตั้ง",
        },
        {
          en: "People listed at founding are the President, the Treasurer and the other members named on the form, counted from scanned copies. No names are published.",
          th: "จำนวนคนที่ระบุตอนก่อตั้งนับรวมประธาน เหรัญญิก และสมาชิกอื่นที่ระบุในใบสมัคร นับจากเอกสารสแกน ไม่มีการเผยแพร่ชื่อ",
        },
        {
          en: "BIRSA's club sheet has 9 clubs. An older BIRSA club list also has 9, but it names two Basketball clubs and no Mock Fund. This table follows the club sheet.",
          th: "ตารางชมรมของ BIRSA มี 9 ชมรม รายชื่อชมรมฉบับเก่าของ BIRSA ก็มี 9 ชมรมเช่นกัน แต่ระบุบาสเกตบอลสองชมรมและไม่มีกองทุนจำลอง ตารางนี้ใช้ตามตารางชมรม",
        },
        {
          en: "The older club list marked Kien Club as having no founding document. Its application is now on file.",
          th: "รายชื่อชมรมฉบับเก่าระบุว่าชมรม Kien ไม่มีเอกสารจัดตั้ง ปัจจุบันมีใบสมัครของชมรมนี้แล้ว",
        },
        {
          en: "TU MUN, Parliamock.TU and BIR CardGame presented at the BIR orientation but are not on BIRSA's club sheet. The 12 clubs follow the BIR website.",
          th: "TU MUN, Parliamock.TU และ BIR CardGame แนะนำตัวในงานปฐมนิเทศ BIR แต่ไม่อยู่ในตารางชมรมของ BIRSA ชมรมทั้ง 12 อ้างตามเว็บไซต์ BIR",
        },
      ],
      source: {
        en: "BIRSA club sheet, BIRSA's older club list and the 7 club founding applications for academic year 2025. Club names and categories follow the BIR website.",
        th: "ตารางชมรมของ BIRSA รายชื่อชมรมฉบับเก่าของ BIRSA และใบสมัครจัดตั้งชมรม 7 ฉบับของปีการศึกษา 2568 ชื่อและหมวดของชมรมอ้างตามเว็บไซต์ BIR",
      },
      period: {
        en: "Academic year 2025 to 2026",
        th: "ปีการศึกษา 2568",
      },
    },
  ],
};
