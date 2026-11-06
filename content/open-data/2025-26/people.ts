import type { Bilingual, Dataset, Row, Topic } from "@/lib/open-data";

const elected: Bilingual = { en: "Elected", th: "เลือกตั้ง" };
const appointed: Bilingual = { en: "Appointed", th: "แต่งตั้ง" };
const filled: Bilingual = { en: "Filled", th: "มีผู้ดำรงตำแหน่ง" };
const vacant: Bilingual = { en: "Vacant", th: "ว่าง" };

function role(
  roleEn: string,
  roleTh: string,
  teamEn: string,
  teamTh: string,
  how: Bilingual,
  status: Bilingual,
  dutyEn: string,
  dutyTh: string
): Row {
  return {
    role: { en: roleEn, th: roleTh },
    team: { en: teamEn, th: teamTh },
    how,
    status,
    duty: { en: dutyEn, th: dutyTh },
  };
}

const rolesDataset: Dataset = {
  id: "roles",
  title: {
    en: "Role slots, how each was filled and whether it was filled",
    th: "ตำแหน่งทั้งหมด วิธีได้มา และสถานะ",
  },
  summary: {
    en: "BIRSA had 22 role slots, 11 elected and 11 appointed, and 4 of the appointed slots were vacant.",
    th: "BIRSA มี 22 ตำแหน่ง เลือกตั้ง 11 และแต่งตั้ง 11 โดยตำแหน่งที่แต่งตั้งว่างอยู่ 4 ตำแหน่ง",
  },
  columns: [
    { key: "role", label: { en: "Role", th: "ตำแหน่ง" }, kind: "text" },
    { key: "team", label: { en: "Team", th: "ฝ่าย" }, kind: "text" },
    { key: "how", label: { en: "How filled", th: "วิธีได้มา" }, kind: "text" },
    { key: "status", label: { en: "Status", th: "สถานะ" }, kind: "text" },
    { key: "duty", label: { en: "Main duty", th: "หน้าที่หลัก" }, kind: "text" },
  ],
  rows: [
    role(
      "President",
      "นายกสโมสร",
      "Leadership",
      "ฝ่ายบริหาร",
      elected,
      filled,
      "Oversees the whole association and approves projects and events.",
      "ดูแลการดำเนินงานโดยรวมและอนุมัติโครงการและกิจกรรม"
    ),
    role(
      "Vice President",
      "อุปนายกสโมสร",
      "Leadership",
      "ฝ่ายบริหาร",
      elected,
      filled,
      "Assists the President, oversees internal work and acts when the President is absent.",
      "ช่วยนายกสโมสร ดูแลงานภายใน และทำหน้าที่แทนเมื่อนายกสโมสรไม่อยู่"
    ),
    role(
      "Secretary 1",
      "เลขานุการ คนที่ 1",
      "Secretariat",
      "ฝ่ายเลขานุการ",
      elected,
      filled,
      "Prepares documents, takes minutes, manages the email account and translates.",
      "จัดทำเอกสาร จดรายงานการประชุม ดูแลอีเมลของสโมสร และแปลเอกสาร"
    ),
    role(
      "Secretary 2",
      "เลขานุการ คนที่ 2",
      "Secretariat",
      "ฝ่ายเลขานุการ",
      elected,
      filled,
      "Shares the Secretary duties and tracks the progress of each team.",
      "แบ่งงานกับเลขานุการคนที่ 1 และติดตามความคืบหน้าของแต่ละฝ่าย"
    ),
    role(
      "Treasurer",
      "เหรัญญิก",
      "Finance",
      "ฝ่ายการเงิน",
      elected,
      filled,
      "Looks after the finances and organises activities that raise money.",
      "ดูแลการเงินและจัดกิจกรรมที่หารายได้ให้สโมสร"
    ),
    role(
      "Spokesperson",
      "โฆษก",
      "Communications",
      "ฝ่ายสื่อสาร",
      elected,
      filled,
      "Speaks for BIRSA, announces news and represents it at events.",
      "เป็นตัวแทนสื่อสารของ BIRSA ประกาศข่าวสาร และเป็นตัวแทนในงานต่าง ๆ"
    ),
    role(
      "Academic Affairs Officer",
      "กรรมการฝ่ายวิชาการ",
      "Academic",
      "ฝ่ายวิชาการ",
      elected,
      filled,
      "Coordinates academic activities and runs BIRSA seminars.",
      "ประสานกิจกรรมทางวิชาการและดูแลสัมมนาของ BIRSA"
    ),
    role(
      "Communications Officer",
      "กรรมการฝ่ายประชาสัมพันธ์",
      "Communications",
      "ฝ่ายสื่อสาร",
      elected,
      filled,
      "Designs posters and graphics and manages the social media accounts.",
      "ออกแบบโปสเตอร์และกราฟิก และดูแลช่องทางโซเชียลมีเดีย"
    ),
    role(
      "Activity Affairs Officer",
      "กรรมการฝ่ายกิจกรรมนักศึกษา",
      "Activities",
      "ฝ่ายกิจกรรม",
      elected,
      filled,
      "Designs student activities and oversees the clubs.",
      "ออกแบบกิจกรรมนักศึกษาและดูแลงานของชมรม"
    ),
    role(
      "General Coordinator",
      "กรรมการฝ่ายประสานกิจการภายในและรังสิต",
      "Coordination",
      "ฝ่ายประสานงาน",
      elected,
      filled,
      "Coordinates with outside organisations and with the Rangsit student council.",
      "ประสานงานกับหน่วยงานภายนอกและสภานักศึกษาศูนย์รังสิต"
    ),
    role(
      "Wellbeing Officer",
      "กรรมการฝ่ายบุคคล",
      "Personnel",
      "ฝ่ายบุคคล",
      elected,
      filled,
      "Oversees the officers and manages the recruitment of staff.",
      "ดูแลกรรมการและบริหารการรับสมัครทีมงาน"
    ),
    role(
      "Rights Advocate",
      "กรรมการฝ่ายพิทักษ์สิทธิ์",
      "Rights and welfare",
      "ฝ่ายพิทักษ์สิทธิ์และสวัสดิการ",
      appointed,
      filled,
      "Listens to student concerns and speaks up for students who face unfair treatment.",
      "รับฟังข้อร้องเรียนของนักศึกษาและช่วยปกป้องสิทธิ์เมื่อพบความไม่เป็นธรรม"
    ),
    role(
      "Information Technology and Digital Strategy Officer",
      "อนุกรรมการฝ่ายเทคโนโลยีสารสนเทศ",
      "Information technology",
      "ฝ่ายเทคโนโลยีสารสนเทศ",
      appointed,
      filled,
      "Looks after the BIRSA website, Discord server and Minecraft server.",
      "ดูแลเว็บไซต์ เซิร์ฟเวอร์ Discord และเซิร์ฟเวอร์ Minecraft ของ BIRSA"
    ),
    role(
      "News Team Member 1",
      "อนุกรรมการฝ่ายการข่าว คนที่ 1",
      "News",
      "ฝ่ายการข่าว",
      appointed,
      filled,
      "Writes news articles for the website and keeps the officers up to date.",
      "เขียนข่าวลงเว็บไซต์และแจ้งความเคลื่อนไหวให้กรรมการทราบ"
    ),
    role(
      "News Team Member 2",
      "อนุกรรมการฝ่ายการข่าว คนที่ 2",
      "News",
      "ฝ่ายการข่าว",
      appointed,
      filled,
      "Writes news articles for the website and keeps the officers up to date.",
      "เขียนข่าวลงเว็บไซต์และแจ้งความเคลื่อนไหวให้กรรมการทราบ"
    ),
    role(
      "Assistant Treasurer",
      "อนุกรรมการฝ่ายเหรัญญิก",
      "Finance",
      "ฝ่ายการเงิน",
      appointed,
      filled,
      "Assists the Treasurer.",
      "ช่วยงานเหรัญญิก"
    ),
    role(
      "Assistant Wellbeing Officer",
      "อนุกรรมการฝ่ายบุคคล",
      "Personnel",
      "ฝ่ายบุคคล",
      appointed,
      filled,
      "Assists the Wellbeing Officer.",
      "ช่วยงานกรรมการฝ่ายบุคคล"
    ),
    role(
      "Assistant Coordinator",
      "อนุกรรมการฝ่ายประสานงาน",
      "Coordination",
      "ฝ่ายประสานงาน",
      appointed,
      filled,
      "Assists the General Coordinator.",
      "ช่วยงานกรรมการฝ่ายประสานงาน"
    ),
    role(
      "International Affairs Officer",
      "อนุกรรมการฝ่ายกิจการต่างประเทศ",
      "International affairs",
      "ฝ่ายกิจการต่างประเทศ",
      appointed,
      vacant,
      "Speaks for international students and brings their needs to the officers.",
      "เป็นตัวแทนนักศึกษาต่างชาติและนำความต้องการของนักศึกษาเสนอต่อกรรมการ"
    ),
    role(
      "Assistant Activity Affairs Officer",
      "อนุกรรมการฝ่ายกิจกรรมนักศึกษา",
      "Activities",
      "ฝ่ายกิจกรรม",
      appointed,
      vacant,
      "Assists the Activity Affairs Officer.",
      "ช่วยงานกรรมการฝ่ายกิจกรรมนักศึกษา"
    ),
    role(
      "Assistant Communications Officer",
      "อนุกรรมการฝ่ายประชาสัมพันธ์",
      "Communications",
      "ฝ่ายสื่อสาร",
      appointed,
      vacant,
      "Assists the Communications Officer.",
      "ช่วยงานกรรมการฝ่ายประชาสัมพันธ์"
    ),
    role(
      "Assistant Secretary",
      "อนุกรรมการฝ่ายเลขานุการ",
      "Secretariat",
      "ฝ่ายเลขานุการ",
      appointed,
      vacant,
      "Assists the Secretaries.",
      "ช่วยงานเลขานุการ"
    ),
  ],
  notes: [
    {
      en: "Role slots and duties come from the BIRSA positions list. A role with two holders is shown as two slots.",
      th: "ตำแหน่งและหน้าที่มาจากเอกสารรายการตำแหน่งของ BIRSA ตำแหน่งที่มีสองคนนับเป็นสองตำแหน่ง",
    },
    {
      en: "The Information Technology role is a committee role in the positions list and a subcommittee role in the 26 June 2025 appointment. It is counted once, as appointed.",
      th: "ตำแหน่งฝ่ายเทคโนโลยีสารสนเทศอยู่ในกลุ่มกรรมการตามรายการตำแหน่ง แต่อยู่ในกลุ่มอนุกรรมการตามประกาศวันที่ 26 มิถุนายน 2568 จึงนับครั้งเดียวและจัดเป็นตำแหน่งแต่งตั้ง",
    },
  ],
  source: {
    en: "BIRSA positions list, faculty appointment of 2 May 2025, and BIRSA appointment of 26 June 2025",
    th: "เอกสารรายการตำแหน่งของ BIRSA ประกาศแต่งตั้งของคณะวันที่ 2 พฤษภาคม 2568 และประกาศแต่งตั้งของ BIRSA วันที่ 26 มิถุนายน 2568",
  },
  period: { en: "Academic year 2025 to 2026", th: "ปีการศึกษา 2568" },
};

const headcountDataset: Dataset = {
  id: "headcount",
  title: {
    en: "People in BIRSA by how they took their role",
    th: "จำนวนคนใน BIRSA แบ่งตามวิธีได้ตำแหน่ง",
  },
  summary: {
    en: "BIRSA had 21 people in post, 11 elected and 10 appointed, counted from the member list.",
    th: "BIRSA มีผู้ดำรงตำแหน่ง 21 คน เลือกตั้ง 11 คนและแต่งตั้ง 10 คน นับจากรายชื่อสมาชิก",
  },
  columns: [
    { key: "group", label: { en: "How they took the role", th: "วิธีได้ตำแหน่ง" }, kind: "text" },
    { key: "people", label: { en: "People", th: "จำนวนคน" }, kind: "number", total: true },
  ],
  rows: [
    { group: { en: "Elected officers", th: "กรรมการที่มาจากการเลือกตั้ง" }, people: 11 },
    { group: { en: "Appointed members", th: "กรรมการและอนุกรรมการที่แต่งตั้ง" }, people: 10 },
  ],
  notes: [
    {
      en: "The member list has 21 positions, more than the 18 filled slots in the roles table, because it also names roles that the positions list does not.",
      th: "รายชื่อสมาชิกมี 21 ตำแหน่ง มากกว่า 18 ตำแหน่งที่มีผู้ดำรงในตารางตำแหน่ง เพราะรายชื่อสมาชิกมีบางตำแหน่งที่ไม่อยู่ในรายการตำแหน่ง",
    },
    {
      en: "The 11 elected officers are the ones named in the faculty appointment. Only role titles were counted.",
      th: "กรรมการที่มาจากการเลือกตั้ง 11 คนคือผู้ที่ระบุในประกาศแต่งตั้งของคณะ การนับใช้เฉพาะชื่อตำแหน่ง",
    },
  ],
  source: {
    en: "BIRSA 2025 to 2026 member list (position column only) and faculty appointment of 2 May 2025",
    th: "รายชื่อสมาชิก BIRSA ปีการศึกษา 2568 (เฉพาะคอลัมน์ตำแหน่ง) และประกาศแต่งตั้งของคณะวันที่ 2 พฤษภาคม 2568",
  },
  period: { en: "Academic year 2025 to 2026", th: "ปีการศึกษา 2568" },
};

const keyDatesDataset: Dataset = {
  id: "key-dates",
  title: {
    en: "Key dates in the election and appointment of officers",
    th: "วันสำคัญของการเลือกตั้งและการแต่งตั้ง",
  },
  summary: {
    en: "The officers were elected on 24 April 2025, and the next election was set for 2 April 2026.",
    th: "กรรมการได้รับเลือกตั้งเมื่อ 24 เมษายน 2568 และการเลือกตั้งครั้งถัดไปกำหนดไว้วันที่ 2 เมษายน 2569",
  },
  columns: [
    { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
    { key: "event", label: { en: "What happened", th: "เหตุการณ์" }, kind: "text" },
  ],
  rows: [
    {
      date: "2025-04-24",
      event: { en: "Election of the 2025 to 2026 officers", th: "เลือกตั้งกรรมการปีการศึกษา 2568" },
    },
    {
      date: "2025-05-02",
      event: {
        en: "Faculty announced the appointment of the 11 elected officers",
        th: "คณะประกาศแต่งตั้งกรรมการที่ได้รับเลือกตั้ง 11 คน",
      },
    },
    {
      date: "2025-06-26",
      event: {
        en: "BIRSA appointed 5 committee and subcommittee members",
        th: "BIRSA ประกาศแต่งตั้งกรรมการและอนุกรรมการ 5 คน",
      },
    },
    {
      date: "2026-04-02",
      event: {
        en: "Election for the next officers opened to voters",
        th: "เปิดให้ลงคะแนนเลือกตั้งกรรมการชุดถัดไป",
      },
    },
    {
      date: "2026-04-09",
      event: {
        en: "Official election results due to be announced",
        th: "กำหนดประกาศผลการเลือกตั้งอย่างเป็นทางการ",
      },
    },
  ],
  notes: [
    {
      en: "The April 2026 dates are the plan in the minutes of the 1 April 2026 communications team meeting.",
      th: "วันที่ในเดือนเมษายน 2569 เป็นแผนตามรายงานการประชุมฝ่ายสื่อสารเมื่อ 1 เมษายน 2569",
    },
  ],
  source: {
    en: "Faculty appointment, BIRSA appointment and communications team minutes",
    th: "ประกาศแต่งตั้งของคณะ ประกาศแต่งตั้งของ BIRSA และรายงานการประชุมฝ่ายสื่อสาร",
  },
  period: { en: "April 2025 to April 2026", th: "เมษายน 2568 ถึงเมษายน 2569" },
};

export const people: Topic = {
  slug: "people",
  title: { en: "How BIRSA was organised", th: "BIRSA จัดโครงสร้างอย่างไร" },
  summary: {
    en: "BIRSA had 11 elected officers and 22 role slots in 2025 to 2026, and 4 slots were vacant.",
    th: "ปีการศึกษา 2568 BIRSA มีกรรมการที่มาจากการเลือกตั้ง 11 คนและมี 22 ตำแหน่ง โดยว่างอยู่ 4 ตำแหน่ง",
  },
  headlines: [
    { value: "11", label: { en: "Elected officers", th: "กรรมการที่มาจากการเลือกตั้ง" } },
    { value: "22", label: { en: "Role slots", th: "ตำแหน่งทั้งหมด" } },
    { value: "4", label: { en: "Vacant slots", th: "ตำแหน่งที่ว่าง" } },
    { value: "21", label: { en: "People in post", th: "ผู้ดำรงตำแหน่ง" } },
  ],
  mainPoints: [
    {
      en: "Voters elected 11 officers on 24 April 2025, and the faculty appointed them on 2 May 2025.",
      th: "นักศึกษาเลือกกรรมการ 11 คนเมื่อ 24 เมษายน 2568 และคณะประกาศแต่งตั้งเมื่อ 2 พฤษภาคม 2568",
    },
    {
      en: "BIRSA appointed 5 more members on 26 June 2025 to committee and subcommittee roles.",
      th: "BIRSA แต่งตั้งกรรมการและอนุกรรมการเพิ่มอีก 5 คนเมื่อ 26 มิถุนายน 2568",
    },
    {
      en: "The positions list has 22 role slots, 11 elected and 11 appointed.",
      th: "รายการตำแหน่งมี 22 ตำแหน่ง เลือกตั้ง 11 และแต่งตั้ง 11",
    },
    {
      en: "4 of the 11 appointed slots were vacant, all of them assistant or international affairs roles.",
      th: "ตำแหน่งที่แต่งตั้ง 11 ตำแหน่งว่างอยู่ 4 ตำแหน่ง ได้แก่ผู้ช่วยฝ่ายต่าง ๆ และฝ่ายกิจการต่างประเทศ",
    },
    {
      en: "Voting for the next officers was set for 2 April 2026, with results due on 9 April 2026.",
      th: "การลงคะแนนเลือกกรรมการชุดถัดไปกำหนดวันที่ 2 เมษายน 2569 และประกาศผลวันที่ 9 เมษายน 2569",
    },
  ],
  warning: {
    en: "The member list counts 21 people in post, while the positions list shows 18 filled slots, because the lists name some roles differently.",
    th: "รายชื่อสมาชิกนับผู้ดำรงตำแหน่งได้ 21 คน ส่วนรายการตำแหน่งมี 18 ตำแหน่งที่มีผู้ดำรง เพราะสองเอกสารเรียกบางตำแหน่งต่างกัน",
  },
  datasets: [rolesDataset, headcountDataset, keyDatesDataset],
};
