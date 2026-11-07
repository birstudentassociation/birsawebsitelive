import type { Topic } from "@/lib/open-data";

export const people: Topic = {
  slug: "people",
  title: {
    en: "Who was on the BIRSA committee",
    th: "ใครอยู่ในคณะกรรมการ BIRSA บ้าง",
  },
  summary: {
    en: "BIRSA's January 2024 minutes show 21 committee members in 11 roles. No record counts applicants or places.",
    th: "รายงานการประชุมเดือนมกราคม 2567 แสดงกรรมการ 21 คนใน 11 ตำแหน่ง ไม่มีบันทึกจำนวนผู้สมัครหรือจำนวนที่รับ",
  },
  headlines: [
    {
      value: "21",
      label: { en: "Committee members", th: "กรรมการ" },
      context: { en: "At 15 January 2024", th: "ณ 15 มกราคม 2567" },
    },
    { value: "11", label: { en: "Roles and teams", th: "ตำแหน่งและฝ่าย" } },
    {
      value: "6",
      label: { en: "Seats on the first year committee", th: "ที่นั่งในคณะแกนนำปี 1 สูงสุด" },
    },
  ],
  mainPoints: [
    {
      en: "The minutes of 15 January 2024 list 21 committee members in 11 roles and teams.",
      th: "รายงานการประชุมวันที่ 15 มกราคม 2567 ระบุกรรมการ 21 คนใน 11 ตำแหน่งและฝ่าย",
    },
    {
      en: "The executive board has 6 members, including 2 secretaries and 2 treasurers.",
      th: "คณะกรรมการบริหารมี 6 คน รวมเลขานุการ 2 คนและเหรัญญิก 2 คน",
    },
    {
      en: "Student activities and location are the largest teams outside the board, with 3 members each.",
      th: "ฝ่ายกิจกรรมนักศึกษาและฝ่ายสถานที่เป็นฝ่ายที่ใหญ่ที่สุดนอกคณะกรรมการบริหาร ฝ่ายละ 3 คน",
    },
    {
      en: "The first year cohort committee has at most 6 seats. It is a cohort body, not part of BIRSA.",
      th: "คณะแกนนำนักศึกษาปี 1 มีที่นั่งสูงสุด 6 ที่ เป็นองค์กรของรุ่น ไม่ใช่ส่วนหนึ่งของ BIRSA",
    },
    {
      en: "BIRSA holds no count of applicants, places or accepted members for the year.",
      th: "BIRSA ไม่มีบันทึกจำนวนผู้สมัคร จำนวนที่รับ หรือจำนวนผู้ได้รับเลือกในปีนี้",
    },
  ],
  datasets: [
    {
      id: "committee-roles",
      title: { en: "Committee members by role", th: "กรรมการแยกตามตำแหน่ง" },
      summary: {
        en: "The 15 January 2024 minutes list 21 committee members across 11 roles and teams.",
        th: "รายงานการประชุมวันที่ 15 มกราคม 2567 ระบุกรรมการ 21 คนใน 11 ตำแหน่งและฝ่าย",
      },
      columns: [
        { key: "role", label: { en: "Role or team", th: "ตำแหน่งหรือฝ่าย" }, kind: "text" },
        { key: "members", label: { en: "Members", th: "จำนวนคน" }, kind: "number", total: true },
      ],
      declaredTotal: { members: 21 },
      rows: [
        { role: { en: "Student activities", th: "ฝ่ายกิจกรรมนักศึกษา" }, members: 3 },
        { role: { en: "Location", th: "ฝ่ายสถานที่" }, members: 3 },
        { role: { en: "Secretary", th: "เลขานุการ" }, members: 2 },
        { role: { en: "Treasurer", th: "เหรัญญิก" }, members: 2 },
        { role: { en: "Academic", th: "ฝ่ายวิชาการ" }, members: 2 },
        { role: { en: "Public relations", th: "ฝ่ายประชาสัมพันธ์" }, members: 2 },
        {
          role: { en: "External and internal affairs", th: "ฝ่ายกิจการภายนอกและภายใน" },
          members: 2,
        },
        { role: { en: "Rights advocates", th: "ฝ่ายคุ้มครองสิทธิ" }, members: 2 },
        { role: { en: "President", th: "ประธาน" }, members: 1 },
        { role: { en: "Vice president", th: "รองประธาน" }, members: 1 },
        { role: { en: "Spokesperson", th: "โฆษก" }, members: 1 },
      ],
      notes: [
        {
          en: "Only role titles were counted. The Master Sheet member tab returned only seven rows, so the minutes are the fuller list.",
          th: "นับเฉพาะตำแหน่ง แท็บรายชื่อสมาชิกใน Master Sheet อ่านได้เพียง 7 แถว จึงใช้รายงานการประชุมซึ่งครบกว่า",
        },
      ],
      source: {
        en: "BIRSA meeting minutes of 15 January 2024 (working structure)",
        th: "รายงานการประชุม BIRSA วันที่ 15 มกราคม 2567 (โครงสร้างการทำงาน)",
      },
      period: { en: "At 15 January 2024", th: "ณ 15 มกราคม 2567" },
    },
    {
      id: "cohort-committee-seats",
      title: {
        en: "Seats on the first year cohort committee",
        th: "ที่นั่งในคณะแกนนำนักศึกษาปี 1",
      },
      summary: {
        en: "The first year cohort committee has at most 6 seats, filled by an election among first year students.",
        th: "คณะแกนนำนักศึกษาปี 1 มีที่นั่งสูงสุด 6 ที่ มาจากการเลือกตั้งในหมู่นักศึกษาปี 1",
      },
      columns: [
        { key: "seat", label: { en: "Seat", th: "ตำแหน่ง" }, kind: "text" },
        {
          key: "seats",
          label: { en: "Maximum seats", th: "จำนวนที่นั่งสูงสุด" },
          kind: "number",
          total: true,
        },
      ],
      declaredTotal: { seats: 6 },
      rows: [
        { seat: { en: "Cohort leader", th: "แกนนำรุ่น" }, seats: 1 },
        { seat: { en: "Rangsit coordinator", th: "ผู้ประสานงานศูนย์รังสิต" }, seats: 1 },
        { seat: { en: "Tha Prachan coordinator", th: "ผู้ประสานงานท่าพระจันทร์" }, seats: 1 },
        { seat: { en: "Other members, up to", th: "กรรมการอื่น ไม่เกิน" }, seats: 3 },
      ],
      notes: [
        {
          en: "This is the election of the first year cohort for intake 15, not a BIRSA election. No candidates, turnout or results are held.",
          th: "นี่คือการเลือกตั้งแกนนำของนักศึกษาปี 1 รุ่น 15 ไม่ใช่การเลือกตั้ง BIRSA และไม่มีข้อมูลผู้สมัคร ผู้มาใช้สิทธิ หรือผลการเลือกตั้ง",
        },
      ],
      source: {
        en: "Announcement of the first year cohort committee election",
        th: "ประกาศการเลือกตั้งแกนนำนักศึกษาปี 1",
      },
      period: { en: "Academic year 2023 to 2024", th: "ปีการศึกษา 2566" },
    },
    {
      id: "cohort-election-timetable",
      title: {
        en: "Timetable of the first year cohort election",
        th: "กำหนดการเลือกตั้งแกนนำปี 1",
      },
      summary: {
        en: "Applications opened on 29 August 2023 and voting was set for 20 September 2023.",
        th: "เปิดรับสมัครวันที่ 29 สิงหาคม 2566 และกำหนดลงคะแนนวันที่ 20 กันยายน 2566",
      },
      columns: [
        { key: "stage", label: { en: "Stage", th: "ขั้นตอน" }, kind: "text" },
        { key: "start", label: { en: "Start", th: "เริ่ม" }, kind: "date" },
        { key: "end", label: { en: "End", th: "สิ้นสุด" }, kind: "date" },
      ],
      rows: [
        { stage: { en: "Applications", th: "รับสมัคร" }, start: "2023-08-29", end: "2023-09-05" },
        {
          stage: {
            en: "Candidates announced and numbers drawn",
            th: "ประกาศรายชื่อและจับสลากหมายเลข",
          },
          start: "2023-09-07",
          end: "2023-09-07",
        },
        { stage: { en: "Campaigning", th: "หาเสียง" }, start: "2023-09-07", end: "2023-09-19" },
        {
          stage: { en: "Policy speeches", th: "แถลงนโยบาย" },
          start: "2023-09-12",
          end: "2023-09-12",
        },
        { stage: { en: "Voting", th: "ลงคะแนน" }, start: "2023-09-20", end: "2023-09-20" },
        {
          stage: { en: "Objections to the result", th: "ช่วงทักท้วงผล" },
          start: "2023-09-20",
          end: "2023-09-28",
        },
      ],
      notes: [
        {
          en: "The announcement says voting was online, while the minutes of 5 September 2023 plan it on site. This page does not take a side. The objection period starts when the unofficial result is announced, so its start is shown as the voting day.",
          th: "ประกาศระบุว่าลงคะแนนออนไลน์ แต่รายงานการประชุมวันที่ 5 กันยายน 2566 วางแผนให้ลงคะแนนในสถานที่ หน้านี้จึงไม่ฟันธง ช่วงทักท้วงเริ่มเมื่อประกาศผลไม่เป็นทางการ จึงแสดงวันเริ่มเป็นวันลงคะแนน",
        },
      ],
      source: {
        en: "Announcement of the first year cohort committee election",
        th: "ประกาศการเลือกตั้งแกนนำนักศึกษาปี 1",
      },
      period: { en: "August to September 2023", th: "สิงหาคมถึงกันยายน 2566" },
    },
  ],
};
