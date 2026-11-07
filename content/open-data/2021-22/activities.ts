import type { Bilingual, Row, Topic } from "@/lib/open-data";

const online: Bilingual = { en: "Online", th: "ออนไลน์" };
const held: Bilingual = { en: "Held, recorded", th: "จัดแล้ว มีบันทึก" };
const unknown: Bilingual = {
  en: "Unknown, no record it was held",
  th: "ไม่ทราบ ไม่มีบันทึกว่าจัดแล้ว",
};

function project(
  name: Bilingual,
  date: string,
  format: Bilingual,
  plannedParticipants: number | null,
  actualParticipants: number | null,
  plannedBudget: number | null,
  status: Bilingual
): Row {
  return {
    project: name,
    date,
    format,
    plannedParticipants,
    actualParticipants,
    plannedBudget,
    status,
  };
}

export const activities: Topic = {
  slug: "activities",
  title: {
    en: "What BIRSA ran during the year",
    th: "BIRSA จัดกิจกรรมอะไรบ้างในปีนี้",
  },
  summary: {
    en: "BIRSA ran an exam dress consultation and a survey in 2021, and planned three projects for 2022. Numbers of people are recorded for three.",
    th: "BIRSA จัดการรับฟังความคิดเห็นเรื่องแต่งกายเข้าสอบและแบบสอบถามในปี 2564 และวางแผนอีกสามโครงการในปี 2565 มีบันทึกจำนวนผู้เข้าร่วมจริงสามรายการ",
  },
  headlines: [
    {
      value: "80",
      label: { en: "People at the public discussion", th: "ผู้เข้าร่วมเวทีเสวนาสาธารณะ" },
      context: { en: "10 September 2021, actual", th: "10 กันยายน 2564 จำนวนจริง" },
    },
    {
      value: "84",
      label: { en: "Responses to the sanitary pad survey", th: "ผู้ตอบแบบสอบถามผ้าอนามัย" },
      context: { en: "25 to 26 July 2021, actual", th: "25 ถึง 26 กรกฎาคม 2564 จำนวนจริง" },
    },
    {
      value: "246",
      label: { en: "Planned at BIR The Future", th: "ผู้เข้าร่วมตามแผนของ BIR The Future" },
      context: { en: "12 and 13 February 2022", th: "12 และ 13 กุมภาพันธ์ 2565" },
    },
  ],
  mainPoints: [
    {
      en: "The exam dress consultation ran from a focus group on 10 July 2021 to a referendum on 13 September 2021.",
      th: "การรับฟังความคิดเห็นเรื่องแต่งกายเข้าสอบเริ่มจากการสนทนากลุ่มวันที่ 10 กรกฎาคม 2564 และจบที่การลงประชามติวันที่ 13 กันยายน 2564",
    },
    {
      en: "80 people joined the public discussion on Clubhouse on 10 September 2021.",
      th: "มีผู้เข้าร่วมเวทีเสวนาสาธารณะผ่าน Clubhouse วันที่ 10 กันยายน 2564 จำนวน 80 คน",
    },
    {
      en: "84 people answered the sanitary pad welfare survey on 25 and 26 July 2021.",
      th: "มีผู้ตอบแบบสอบถามโครงการสวัสดิการผ้าอนามัย 84 คน ในวันที่ 25 และ 26 กรกฎาคม 2564",
    },
    {
      en: "BIR The Future planned for 246 people online on 12 and 13 February 2022, with a budget of ฿35,000.",
      th: "BIR The Future วางแผนผู้เข้าร่วม 246 คน แบบออนไลน์ วันที่ 12 และ 13 กุมภาพันธ์ 2565 งบ 35,000 บาท",
    },
    {
      en: "A rights protection talk planned for 12 people and an esports event for 100 people. BIRSA has no record that either was held.",
      th: "เสวนาพิทักษ์สิทธิวางแผนผู้เข้าร่วม 12 คน และอีสปอร์ต 100 คน BIRSA ไม่มีบันทึกว่าจัดแล้วทั้งสองงาน",
    },
  ],
  datasets: [
    {
      id: "projects",
      title: {
        en: "Projects and consultations, 2021 to 2022",
        th: "โครงการและการรับฟังความเห็น ปี 2564 ถึง 2565",
      },
      summary: {
        en: "BIRSA's records list nine activities. Three have recorded numbers of people, and three more are plans with no record they were held.",
        th: "เอกสารของ BIRSA มีกิจกรรม 9 รายการ มีจำนวนผู้เข้าร่วมจริงบันทึกไว้ 3 รายการ และอีก 3 รายการเป็นแผนที่ไม่มีบันทึกว่าจัดแล้ว",
      },
      columns: [
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        { key: "date", label: { en: "Date", th: "วันที่จัด" }, kind: "date" },
        { key: "format", label: { en: "Format", th: "รูปแบบ" }, kind: "text" },
        {
          key: "plannedParticipants",
          label: { en: "People expected (planned)", th: "ผู้เข้าร่วมตามแผน" },
          kind: "number",
        },
        {
          key: "actualParticipants",
          label: { en: "People who took part (actual)", th: "ผู้เข้าร่วมจริง" },
          kind: "number",
        },
        {
          key: "plannedBudget",
          label: { en: "Budget (baht, planned)", th: "งบประมาณตามแผน (บาท)" },
          kind: "money",
        },
        { key: "status", label: { en: "Status", th: "สถานะ" }, kind: "text" },
      ],
      rows: [
        project(
          { en: "Exam dress focus group", th: "สนทนากลุ่มเรื่องแต่งกายเข้าสอบ" },
          "2021-07-10",
          { en: "Online", th: "ออนไลน์" },
          null,
          null,
          null,
          held
        ),
        project(
          { en: "Sanitary pad welfare survey", th: "แบบสอบถามโครงการสวัสดิการผ้าอนามัย" },
          "2021-07-25",
          { en: "Online form", th: "แบบฟอร์มออนไลน์" },
          null,
          84,
          null,
          held
        ),
        project(
          { en: "Exam dress public discussion", th: "เวทีเสวนาสาธารณะเรื่องแต่งกายเข้าสอบ" },
          "2021-09-10",
          { en: "Online, Clubhouse", th: "ออนไลน์ ผ่าน Clubhouse" },
          null,
          80,
          null,
          held
        ),
        project(
          { en: "Exam dress referendum", th: "ประชามติเรื่องแต่งกายเข้าสอบ" },
          "2021-09-13",
          online,
          null,
          506,
          null,
          held
        ),
        project(
          { en: "Left-handed lecture desks", th: "โต๊ะเลคเชอร์สำหรับคนถนัดซ้าย" },
          "2021-11-26",
          { en: "Faculty facility", th: "สิ่งอำนวยความสะดวกของคณะ" },
          null,
          null,
          null,
          { en: "Reported done at a meeting", th: "รายงานว่าเสร็จแล้วในที่ประชุม" }
        ),
        project(
          { en: "BIR The Future", th: "BIR The Future" },
          "2022-02-12",
          online,
          246,
          null,
          35000,
          unknown
        ),
        project(
          { en: "Rights protection talk", th: "เสวนาพิทักษ์สิทธิ" },
          "2022-03-05",
          online,
          12,
          null,
          7150,
          unknown
        ),
        project(
          { en: "The Rise of Val-rO-V", th: "The Rise of Val-rO-V" },
          "2022-03-21",
          { en: "Online, live stream", th: "ออนไลน์ ถ่ายทอดสด" },
          100,
          null,
          3000,
          unknown
        ),
        project(
          { en: "Student association election", th: "การเลือกตั้งสโมสรนักศึกษา" },
          "2022-04-21",
          online,
          null,
          null,
          null,
          { en: "Scheduled, result not held", th: "กำหนดไว้ ไม่มีผลการเลือกตั้ง" }
        ),
      ],
      notes: [
        {
          en: "Dates are the first day of each project. BIR The Future ran over 12 and 13 February 2022, the esports event over 21 to 25 March 2022, and the survey over 25 and 26 July 2021.",
          th: "วันที่คือวันแรกของแต่ละโครงการ BIR The Future จัดวันที่ 12 และ 13 กุมภาพันธ์ 2565 อีสปอร์ตจัดวันที่ 21 ถึง 25 มีนาคม 2565 และแบบสอบถามเปิดวันที่ 25 และ 26 กรกฎาคม 2564",
        },
        {
          en: "For the referendum, the actual figure is the 506 valid votes. The survey figure is the number of responses, not of people reached. See the votes page for the full result.",
          th: "ประชามติใช้จำนวนบัตรที่ใช้ได้ 506 ใบเป็นจำนวนจริง ส่วนแบบสอบถามคือจำนวนผู้ตอบ ไม่ใช่จำนวนผู้ที่ได้รับแบบสอบถาม ดูผลทั้งหมดในหน้าผลการลงคะแนน",
        },
        {
          en: "BIR The Future planned 150 prospective students and 96 BIR cohort 13 students, 246 in all. The rights protection talk planned 7 students and 5 speakers. The cohort 13 student committee organised BIR The Future.",
          th: "BIR The Future วางแผนผู้สนใจเข้าเรียน 150 คน และนักศึกษา BIR รุ่นที่ 13 จำนวน 96 คน รวม 246 คน เสวนาพิทักษ์สิทธิวางแผนนักศึกษา 7 คนและวิทยากร 5 คน โดยคณะกรรมการแกนนักศึกษารุ่นที่ 13 เป็นผู้จัด BIR The Future",
        },
        {
          en: "The earlier draft of the rights protection talk planned 20 people on 5 February 2022. The later plan, used here, planned 12 people on 5 March 2022.",
          th: "ฉบับร่างก่อนหน้าของเสวนาพิทักษ์สิทธิวางแผนผู้เข้าร่วม 20 คน วันที่ 5 กุมภาพันธ์ 2565 ส่วนแผนฉบับหลังที่ใช้ในตารางนี้วางแผน 12 คน วันที่ 5 มีนาคม 2565",
        },
        {
          en: "The meeting of 16 July 2021 recorded 29 people in the left-handed desk survey. The desks are reported done on 26 November 2021, with no cost recorded.",
          th: "การประชุมวันที่ 16 กรกฎาคม 2564 บันทึกผู้ตอบสำรวจโต๊ะสำหรับคนถนัดซ้ายรวม 29 คน และมีรายงานว่าเสร็จแล้วเมื่อวันที่ 26 พฤศจิกายน 2564 โดยไม่มีบันทึกค่าใช้จ่าย",
        },
      ],
      source: {
        en: "BIRSA project plans, the exam dress consultation report, the survey response sheet and meeting minutes",
        th: "ใบโครงการของ BIRSA รายงานการรับฟังความคิดเห็นเรื่องแต่งกายเข้าสอบ ตารางคำตอบแบบสอบถาม และรายงานการประชุม",
      },
      period: { en: "July 2021 to April 2022", th: "กรกฎาคม 2564 ถึงเมษายน 2565" },
    },
  ],
};
