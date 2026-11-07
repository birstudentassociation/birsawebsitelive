import type { Bilingual, Row, Topic } from "@/lib/open-data";

const period: Bilingual = { en: "Academic year 2024 to 2025", th: "ปีการศึกษา 2567" };

function team(en: string, th: string, places: number, applicants: number, accepted: number): Row {
  return { team: { en, th }, places, applicants, accepted };
}

function role(
  roleEn: string,
  roleTh: string,
  teamEn: string,
  teamTh: string,
  seenEn: string,
  seenTh: string
): Row {
  return {
    role: { en: roleEn, th: roleTh },
    team: { en: teamEn, th: teamTh },
    seen: { en: seenEn, th: seenTh },
  };
}

function date(d: string, en: string, th: string): Row {
  return { date: d, event: { en, th } };
}

export const people: Topic = {
  slug: "people",
  title: {
    en: "How was BIRSA organised in 2024 to 2025?",
    th: "BIRSA จัดโครงสร้างอย่างไรในปีการศึกษา 2567",
  },
  summary: {
    en: "BIRSA advertised 8 subcommittee places in June 2024, received 5 applications and accepted 4.",
    th: "BIRSA เปิดรับอนุกรรมการ 8 ตำแหน่งในเดือนมิถุนายน 2567 มีผู้สมัคร 5 คน และรับ 4 คน",
  },
  headlines: [
    {
      value: "8",
      label: { en: "Subcommittee places advertised", th: "ตำแหน่งอนุกรรมการที่เปิดรับ" },
    },
    { value: "5", label: { en: "Applicants", th: "ผู้สมัคร" } },
    { value: "4", label: { en: "Accepted", th: "ผู้ที่ได้รับคัดเลือก" } },
  ],
  mainPoints: [
    {
      en: "BIRSA advertised 8 subcommittee places, received 5 applications and accepted 4 on 29 June 2024.",
      th: "BIRSA เปิดรับอนุกรรมการ 8 ตำแหน่ง มีผู้สมัคร 5 คน และรับ 4 คนเมื่อ 29 มิถุนายน 2567",
    },
    {
      en: "The sports and health place had no applicant, so 1 of the 8 places was not filled.",
      th: "ตำแหน่งฝ่ายกีฬาและสุขภาพไม่มีผู้สมัคร จึงมี 1 จาก 8 ตำแหน่งที่ยังว่าง",
    },
    {
      en: "BIRSA's working files name 9 officer roles, but do not say how many officers served.",
      th: "เอกสารทำงานของ BIRSA ระบุตำแหน่งกรรมการ 9 ตำแหน่ง แต่ไม่ระบุจำนวนกรรมการที่ดำรงตำแหน่ง",
    },
    {
      en: "The first-year cohort committee had up to 6 seats, with voting on 16 September 2024.",
      th: "คณะกรรมการนักศึกษารุ่นปีที่ 1 มีได้ไม่เกิน 6 ตำแหน่ง ลงคะแนนวันที่ 16 กันยายน 2567",
    },
    {
      en: "The Job Fair team had 20 people, including 3 new recruits, and 14 members staffed the orientation.",
      th: "ทีมงาน Job Fair มี 20 คน รวมสมาชิกใหม่ 3 คน และมีสมาชิก 14 คนประจำงานปฐมนิเทศ",
    },
  ],
  warning: {
    en: "The size of the committee is not recorded, and there are no vote counts or turnout for the cohort election.",
    th: "ไม่มีบันทึกขนาดของคณะกรรมการ และไม่มีคะแนนเสียงหรืออัตราผู้มาใช้สิทธิ์ของการเลือกตั้งคณะกรรมการรุ่น",
  },
  datasets: [
    {
      id: "recruitment",
      title: { en: "Subcommittee recruitment, June 2024", th: "การรับอนุกรรมการ มิถุนายน 2567" },
      summary: {
        en: "BIRSA had 8 places, 5 applicants and 4 people accepted, and the sports and health place had no applicant.",
        th: "BIRSA เปิดรับ 8 ตำแหน่ง มีผู้สมัคร 5 คน รับ 4 คน และตำแหน่งฝ่ายกีฬาและสุขภาพไม่มีผู้สมัคร",
      },
      columns: [
        { key: "team", label: { en: "Team", th: "ฝ่าย" }, kind: "text" },
        {
          key: "places",
          label: { en: "Places advertised", th: "ตำแหน่งที่เปิดรับ" },
          kind: "number",
          total: true,
        },
        {
          key: "applicants",
          label: { en: "Applicants by first choice", th: "ผู้สมัครตามความต้องการอันดับแรก" },
          kind: "number",
          total: true,
        },
        {
          key: "accepted",
          label: { en: "Accepted and placed", th: "ผู้ได้รับคัดเลือกและจัดเข้าฝ่าย" },
          kind: "number",
          total: true,
        },
      ],
      rows: [
        team("Academic", "วิชาการ", 2, 2, 1),
        team("Communications (PR)", "ประชาสัมพันธ์", 2, 1, 1),
        team("Activities", "กิจกรรม", 2, 1, 1),
        team("Facilities", "สถานที่", 1, 1, 1),
        team("Sports and health", "กีฬาและสุขภาพ", 1, 0, 0),
      ],
      notes: [
        {
          en: "One applicant who chose academic first was accepted and placed in communications, so the accepted column is by the team they joined.",
          th: "ผู้สมัครคนหนึ่งเลือกฝ่ายวิชาการเป็นอันดับแรก ได้รับคัดเลือกและจัดเข้าฝ่ายประชาสัมพันธ์ คอลัมน์ผู้ได้รับคัดเลือกจึงนับตามฝ่ายที่เข้าร่วม",
        },
        {
          en: "The meeting of 2 June 2024 planned 9 places, with 2 for facilities. The public call listed 8, and this table uses the call.",
          th: "การประชุมวันที่ 2 มิถุนายน 2567 วางแผนรับ 9 ตำแหน่ง โดยฝ่ายสถานที่ 2 ตำแหน่ง แต่ประกาศรับสมัครระบุ 8 ตำแหน่ง ตารางนี้ใช้ตามประกาศ",
        },
        {
          en: "The sports and health post was not confirmed at the selection meeting on 29 June 2024.",
          th: "ตำแหน่งฝ่ายกีฬาและสุขภาพยังไม่ยืนยันในการประชุมคัดเลือกวันที่ 29 มิถุนายน 2567",
        },
      ],
      source: {
        en: "BIRSA recruitment call, selection meeting notes and activity timeline",
        th: "ประกาศรับสมัคร บันทึกการประชุมคัดเลือก และตารางกิจกรรมของ BIRSA",
      },
      period: { en: "June 2024", th: "มิถุนายน 2567" },
    },
    {
      id: "roles-named",
      title: {
        en: "Officer roles named in BIRSA's files",
        th: "ตำแหน่งกรรมการที่ปรากฏในเอกสารของ BIRSA",
      },
      summary: {
        en: "BIRSA's files name 9 officer roles, and none says how many people held them.",
        th: "เอกสารของ BIRSA ระบุตำแหน่งกรรมการ 9 ตำแหน่ง และไม่ระบุว่ามีผู้ดำรงตำแหน่งกี่คน",
      },
      columns: [
        { key: "role", label: { en: "Role", th: "ตำแหน่ง" }, kind: "text" },
        { key: "team", label: { en: "Team", th: "ฝ่าย" }, kind: "text" },
        {
          key: "seen",
          label: { en: "What the files show", th: "สิ่งที่เอกสารแสดง" },
          kind: "text",
        },
      ],
      rows: [
        role(
          "President",
          "นายกสโมสร",
          "Leadership",
          "ฝ่ายบริหาร",
          "Interviewed sports applicants and led the Job Fair.",
          "สัมภาษณ์ผู้สมัครฝ่ายกีฬา และเป็นหัวหน้าโครงการ Job Fair"
        ),
        role(
          "Vice President",
          "อุปนายกสโมสร",
          "Leadership",
          "ฝ่ายบริหาร",
          "Interviewed sports applicants and led Tha Prachan Games.",
          "สัมภาษณ์ผู้สมัครฝ่ายกีฬา และดูแลท่าพระจันทร์เกม"
        ),
        role(
          "Secretary 1",
          "เลขานุการ คนที่ 1",
          "Secretariat",
          "ฝ่ายเลขานุการ",
          "Prepared the project request forms.",
          "จัดทำแบบขออนุมัติโครงการ"
        ),
        role(
          "Secretary 2",
          "เลขานุการ คนที่ 2",
          "Secretariat",
          "ฝ่ายเลขานุการ",
          "Prepared the project request forms and interviewed facilities applicants.",
          "จัดทำแบบขออนุมัติโครงการ และสัมภาษณ์ผู้สมัครฝ่ายสถานที่"
        ),
        role(
          "Treasurer",
          "เหรัญญิก",
          "Finance",
          "ฝ่ายการเงิน",
          "Prepared the miscellaneous items request and the shirt documents.",
          "จัดทำเอกสารขอค่าเบ็ดเตล็ดและเอกสารเกี่ยวกับเสื้อ"
        ),
        role(
          "Spokesperson",
          "โฆษก",
          "Communications",
          "ฝ่ายสื่อสาร",
          "Interviewed communications applicants.",
          "สัมภาษณ์ผู้สมัครฝ่ายประชาสัมพันธ์"
        ),
        role(
          "Communications Officer",
          "กรรมการฝ่ายประชาสัมพันธ์",
          "Communications",
          "ฝ่ายสื่อสาร",
          "Interviewed communications applicants and posted recruitment calls.",
          "สัมภาษณ์ผู้สมัครฝ่ายประชาสัมพันธ์ และโพสต์ประกาศรับสมัคร"
        ),
        role(
          "Activity Affairs Officer",
          "กรรมการฝ่ายกิจกรรม",
          "Activities",
          "ฝ่ายกิจกรรม",
          "Interviewed activities applicants.",
          "สัมภาษณ์ผู้สมัครฝ่ายกิจกรรม"
        ),
        role(
          "Registrar Officer",
          "กรรมการฝ่ายทะเบียน",
          "Registration",
          "ฝ่ายทะเบียน",
          "Interviewed academic applicants and ran registration at the orientation.",
          "สัมภาษณ์ผู้สมัครฝ่ายวิชาการ และดูแลการลงทะเบียนในงานปฐมนิเทศ"
        ),
      ],
      notes: [
        {
          en: "This is not a full list of positions. It is the roles that appear in the activity timeline, orientation plan and meeting notes.",
          th: "ตารางนี้ไม่ใช่รายการตำแหน่งทั้งหมด แต่เป็นตำแหน่งที่ปรากฏในตารางกิจกรรม แผนปฐมนิเทศ และบันทึกการประชุม",
        },
        {
          en: "The files use role titles only. No person is shown.",
          th: "เอกสารใช้เฉพาะชื่อตำแหน่ง ไม่แสดงตัวบุคคล",
        },
      ],
      source: {
        en: "BIRSA activity timeline, orientation plan and meeting notes",
        th: "ตารางกิจกรรม แผนปฐมนิเทศ และบันทึกการประชุมของ BIRSA",
      },
      period,
    },
    {
      id: "cohort-committee",
      title: {
        en: "Seats on the first-year cohort committee",
        th: "ตำแหน่งในคณะกรรมการรุ่นปีที่ 1",
      },
      summary: {
        en: "The BIR16 cohort committee had up to 6 seats, filled by an election of first-year students.",
        th: "คณะกรรมการรุ่น BIR16 มีได้ไม่เกิน 6 ตำแหน่ง มาจากการเลือกตั้งของนักศึกษาชั้นปีที่ 1",
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
      rows: [
        { seat: { en: "Cohort core representative", th: "แกนรุ่นนักศึกษา BIR16" }, seats: 1 },
        { seat: { en: "Rangsit campus coordinator", th: "ประสานงานศูนย์รังสิต" }, seats: 1 },
        { seat: { en: "Tha Prachan campus coordinator", th: "ประสานงานท่าพระจันทร์" }, seats: 1 },
        { seat: { en: "Other members, up to", th: "กรรมการอื่น ไม่เกิน" }, seats: 3 },
      ],
      notes: [
        {
          en: "The number of candidates, parties, eligible voters, votes cast and the result are not recorded.",
          th: "ไม่มีบันทึกจำนวนผู้สมัคร พรรค ผู้มีสิทธิ์เลือกตั้ง ผู้มาใช้สิทธิ์ และผลการเลือกตั้ง",
        },
      ],
      source: {
        en: "Election notice for the BIR16 cohort committee",
        th: "ประกาศการเลือกตั้งคณะกรรมการแกนนักศึกษารุ่นที่ 16",
      },
      period: { en: "August to September 2024", th: "สิงหาคมถึงกันยายน 2567" },
    },
    {
      id: "key-dates",
      title: {
        en: "Key dates in recruitment and the cohort election",
        th: "วันสำคัญของการรับสมัครและการเลือกตั้ง",
      },
      summary: {
        en: "BIRSA chose its subcommittee on 29 June 2024, and first-year students voted on 16 September 2024.",
        th: "BIRSA คัดเลือกอนุกรรมการเมื่อ 29 มิถุนายน 2567 และนักศึกษาชั้นปีที่ 1 ลงคะแนนเมื่อ 16 กันยายน 2567",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "event", label: { en: "What happened", th: "เหตุการณ์" }, kind: "text" },
      ],
      rows: [
        date(
          "2024-06-13",
          "Applications for the BIRSA subcommittee opened",
          "เปิดรับสมัครอนุกรรมการ BIRSA"
        ),
        date(
          "2024-06-20",
          "Applications closed and interviews began, running to 27 June",
          "ปิดรับสมัครและเริ่มสัมภาษณ์ ต่อเนื่องถึง 27 มิถุนายน"
        ),
        date("2024-06-29", "BIRSA held the selection meeting", "BIRSA ประชุมคัดเลือก"),
        date("2024-06-30", "Results were announced to applicants", "ประกาศผลให้ผู้สมัคร"),
        date(
          "2024-08-26",
          "Applications opened for the BIR16 cohort committee",
          "เปิดรับสมัครคณะกรรมการรุ่น BIR16"
        ),
        date("2024-09-03", "Applications closed at 16:00", "ปิดรับสมัคร เวลา 16:00"),
        date(
          "2024-09-04",
          "Candidates announced and party numbers drawn",
          "ประกาศรายชื่อผู้สมัครและจับสลากหมายเลขพรรค"
        ),
        date(
          "2024-09-11",
          "Candidates gave policy speeches from 12:00 to 13:00",
          "ผู้สมัครแถลงนโยบาย เวลา 12:00 ถึง 13:00"
        ),
        date(
          "2024-09-16",
          "Voting took place in room R101 from 8:00 to 17:00",
          "ลงคะแนนที่ห้อง ร.101 เวลา 8:00 ถึง 17:00"
        ),
        date(
          "2024-09-23",
          "Last day to object to the result",
          "วันสุดท้ายของการทักท้วงผลการเลือกตั้ง"
        ),
      ],
      notes: [
        {
          en: "The activity timeline gives voting hours of 8:00 to 19:00. The election notice says 8:00 to 17:00, which is used here.",
          th: "ตารางกิจกรรมระบุเวลาลงคะแนน 8:00 ถึง 19:00 แต่ประกาศการเลือกตั้งระบุ 8:00 ถึง 17:00 ซึ่งใช้ในตารางนี้",
        },
        {
          en: "The timeline marks the cohort election as done. No result was kept.",
          th: "ตารางกิจกรรมระบุว่าการเลือกตั้งรุ่นเสร็จสิ้นแล้ว แต่ไม่มีการเก็บผลไว้",
        },
      ],
      source: {
        en: "BIRSA activity timeline, recruitment call and election notice",
        th: "ตารางกิจกรรม ประกาศรับสมัคร และประกาศการเลือกตั้งของ BIRSA",
      },
      period: { en: "June to September 2024", th: "มิถุนายนถึงกันยายน 2567" },
    },
  ],
};
