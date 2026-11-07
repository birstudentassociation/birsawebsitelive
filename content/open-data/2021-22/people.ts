import type { Topic } from "@/lib/open-data";

export const people: Topic = {
  slug: "people",
  title: {
    en: "How big was the BIRSA committee?",
    th: "คณะกรรมการ BIRSA มีกี่ตำแหน่ง",
  },
  summary: {
    en: "BIRSA's committee had 15 seats in 2021 to 2022, and the next committee was planned with 13. No applicant numbers are held.",
    th: "คณะกรรมการ BIRSA มี 15 ตำแหน่งในปีการศึกษา 2564 และคณะชุดถัดไปวางแผนไว้ 13 ตำแหน่ง ไม่มีข้อมูลจำนวนผู้สมัคร",
  },
  headlines: [
    {
      value: "15",
      label: { en: "Committee seats, 2021 to 2022", th: "ตำแหน่งกรรมการ ปีการศึกษา 2564" },
    },
    {
      value: "13",
      label: {
        en: "Seats planned for the next committee",
        th: "ตำแหน่งที่วางแผนไว้สำหรับชุดถัดไป",
      },
    },
  ],
  mainPoints: [
    {
      en: "The minutes of 12 April 2022 record a committee of 15 seats.",
      th: "รายงานการประชุมวันที่ 12 เมษายน 2565 บันทึกว่าคณะกรรมการมี 15 ตำแหน่ง",
    },
    {
      en: "The next committee was planned with 13 seats, as sports and clubs were merged into activities.",
      th: "คณะกรรมการชุดถัดไปวางแผนไว้ 13 ตำแหน่ง โดยรวมฝ่ายกีฬาและชมรมเข้ากับฝ่ายกิจกรรม",
    },
    {
      en: "The 2022 election rules asked each slate for 7 to 13 people.",
      th: "กติกาเลือกตั้งปี 2565 กำหนดให้แต่ละกลุ่มผู้สมัครมีสมาชิก 7 ถึง 13 คน",
    },
    {
      en: "Each slate had to name 10 set roles and could add up to 3 other members.",
      th: "แต่ละกลุ่มต้องระบุผู้ดำรงตำแหน่งที่กำหนด 10 ตำแหน่ง และเพิ่มกรรมการอื่นได้ไม่เกิน 3 คน",
    },
  ],
  datasets: [
    {
      id: "committee-seats",
      title: { en: "Committee seats by year", th: "จำนวนตำแหน่งกรรมการแต่ละปี" },
      summary: {
        en: "The committee had 15 seats in 2021 to 2022 and was planned to have 13 in the year after.",
        th: "คณะกรรมการมี 15 ตำแหน่งในปีการศึกษา 2564 และวางแผนไว้ 13 ตำแหน่งในปีถัดไป",
      },
      columns: [
        { key: "year", label: { en: "Academic year", th: "ปีการศึกษา" }, kind: "text" },
        { key: "seats", label: { en: "Committee seats", th: "จำนวนตำแหน่ง" }, kind: "number" },
        { key: "basis", label: { en: "Basis", th: "ที่มา" }, kind: "text" },
      ],
      rows: [
        {
          year: { en: "2021 to 2022", th: "ปีการศึกษา 2564" },
          seats: 15,
          basis: { en: "Actual, from the minutes", th: "จำนวนจริง จากรายงานการประชุม" },
        },
        {
          year: { en: "2022 to 2023", th: "ปีการศึกษา 2565" },
          seats: 13,
          basis: { en: "Planned, from the minutes", th: "ตามแผน จากรายงานการประชุม" },
        },
      ],
      notes: [
        {
          en: "The minutes of 12 April 2022 say seats go from 15 to 13 and that sports and clubs are merged into activities. They do not list the roles, so no role list is given for 2021 to 2022.",
          th: "รายงานการประชุมวันที่ 12 เมษายน 2565 ระบุว่าตำแหน่งลดจาก 15 เป็น 13 และรวมฝ่ายกีฬาและชมรมเข้ากับฝ่ายกิจกรรม แต่ไม่ได้ระบุตำแหน่งทั้งหมด จึงไม่มีรายการตำแหน่งของปีการศึกษา 2564",
        },
      ],
      source: { en: "BIRSA meeting minutes", th: "รายงานการประชุมของ BIRSA" },
      period: { en: "April 2022", th: "เมษายน 2565" },
    },
    {
      id: "election-rules",
      title: {
        en: "Rules for a slate in the 2022 election",
        th: "กติกาของกลุ่มผู้สมัครในการเลือกตั้งปี 2565",
      },
      summary: {
        en: "A slate needed 7 to 13 people, including 10 named roles, and a grade average of at least 2.00 for each candidate.",
        th: "กลุ่มผู้สมัครต้องมี 7 ถึง 13 คน รวม 10 ตำแหน่งที่ระบุ และผู้สมัครแต่ละคนต้องมีผลการเรียนไม่ต่ำกว่า 2.00",
      },
      columns: [
        { key: "rule", label: { en: "Rule", th: "ข้อกำหนด" }, kind: "text" },
        { key: "value", label: { en: "Value", th: "ค่า" }, kind: "text" },
      ],
      rows: [
        {
          rule: { en: "Fewest people in a slate", th: "จำนวนสมาชิกในกลุ่มน้อยที่สุด" },
          value: "7",
        },
        {
          rule: { en: "Most people in a slate", th: "จำนวนสมาชิกในกลุ่มมากที่สุด" },
          value: "13",
        },
        {
          rule: { en: "Named roles every slate must fill", th: "ตำแหน่งที่ทุกกลุ่มต้องระบุ" },
          value: "10",
        },
        {
          rule: { en: "Other members a slate may add", th: "กรรมการอื่นที่เพิ่มได้ไม่เกิน" },
          value: "3",
        },
        {
          rule: {
            en: "Lowest grade average for a candidate",
            th: "ผลการเรียนเฉลี่ยต่ำสุดของผู้สมัคร",
          },
          value: "2.00",
        },
        {
          rule: {
            en: "Most years a candidate may have studied",
            th: "จำนวนปีที่ศึกษามาแล้วไม่เกิน",
          },
          value: "4",
        },
      ],
      notes: [
        {
          en: "The 10 named roles are president, vice president, two secretaries, treasurer, spokesperson, and the heads of academic, public relations, student activities and internal and Rangsit coordination.",
          th: "10 ตำแหน่งที่ระบุ ได้แก่ นายก อุปนายก เลขานุการ 2 คน เหรัญญิก โฆษก และกรรมการฝ่ายวิชาการ ประชาสัมพันธ์ กิจกรรมนักศึกษา และประสานกิจการภายในและรังสิต",
        },
        {
          en: "Candidates also could not sit on another faculty committee, be under discipline or be on leave from study.",
          th: "ผู้สมัครต้องไม่เป็นกรรมการของกลุ่มหรือกิจกรรมอื่นในคณะ ไม่อยู่ระหว่างถูกลงโทษทางวินัย และไม่อยู่ระหว่างลาพักการศึกษา",
        },
      ],
      source: {
        en: "The faculty notice on the 2022 association election",
        th: "ประกาศคณะเรื่องการเลือกตั้งสโมสรนักศึกษา ปี 2565",
      },
      period: { en: "March to April 2022", th: "มีนาคมถึงเมษายน 2565" },
    },
  ],
};
