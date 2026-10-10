import type { Locale } from "@/lib/i18n";

type Bi = Record<Locale, string>;

export const advisoryCopy: Record<
  Locale,
  {
    title: string;
    metaDescription: string;
    lede: string;
    sealAlt: string;
    breadcrumb: string;
    noticeTitle: string;
    notice: string;
    tableHeading: string;
    caption: string;
    columns: { date: string; classes: string; work: string };
    rows: { date: string; classes: string; work: string }[];
    meansHeading: string;
    means: string[];
    whyHeading: string;
    why: string[];
    announcementHeading: string;
    announcementLede: string;
    contact: string;
  }
> = {
  en: {
    title: "Classes move online for the World Bank and IMF meetings",
    metaDescription:
      "Thammasat moves classes online on 12 October and 14 to 16 October 2026, and closes Tha Prachan on 16 October, for the World Bank and IMF Annual Meetings.",
    lede: "Thammasat University moves teaching online on 12 October and from 14 to 16 October 2026, and closes its offices at Tha Prachan on 16 October.",
    sealAlt: "Seal of Thammasat University",
    breadcrumb: "Advisory",
    noticeTitle: "Classes move online on the dates below",
    notice:
      "The Cabinet's measures aim to ease traffic and support security during the Annual Meetings of the World Bank Group and the International Monetary Fund in Bangkok.",
    tableHeading: "Dates",
    caption: "What changes at Thammasat Tha Prachan, 12 to 16 October 2026",
    columns: { date: "Date", classes: "Classes", work: "Offices at Tha Prachan" },
    rows: [
      {
        date: "Monday 12 October 2026",
        classes: "Online. No classroom teaching.",
        work: "Staff work from home.",
      },
      {
        date: "Tuesday 13 October 2026",
        classes: "Public holiday. No classes.",
        work: "Public holiday. Offices closed.",
      },
      {
        date: "Wednesday 14 October 2026",
        classes: "Online. No classroom teaching.",
        work: "Staff work from home.",
      },
      {
        date: "Thursday 15 October 2026",
        classes: "Online. No classroom teaching.",
        work: "Staff work from home.",
      },
      {
        date: "Friday 16 October 2026",
        classes: "Online. No classroom teaching.",
        work: "Closed to teaching, work and official business, except staff their supervisors have assigned.",
      },
    ],
    meansHeading: "What this means for you",
    means: [
      "The university asks faculties and instructors to move classes to an online format on 12 October and from 14 to 16 October.",
      "The university asks units to suspend classroom teaching on those days.",
      "The university asks units to suspend official business at Tha Prachan on 16 October, except for staff their supervisors have already assigned to duty.",
      "Ask your instructor if you are not sure how your class will meet.",
    ],
    whyHeading: "Why this is happening",
    why: [
      "On 19 May 2026 the Cabinet approved Friday 16 October 2026 as a special public holiday in Bangkok. It also agreed that government agencies in Bangkok work from home on Monday 12 October and on Wednesday 14 and Thursday 15 October.",
      "The Cabinet did this to ease traffic, to help delegates travel to the Annual Meetings of the World Bank Group and the International Monetary Fund 2026, and to keep the visiting finance ministers and central bank governors safe.",
      "Thammasat University set out how it will teach and work at Tha Prachan during the meetings in response.",
    ],
    announcementHeading: "The announcement in full",
    announcementLede:
      "The university announced these arrangements on 7 August 2026. This is an English translation of the Thai original.",
    contact: "Contact your faculty if you need to confirm arrangements for a specific class.",
  },
  th: {
    title: "ธรรมศาสตร์ให้เรียนออนไลน์ช่วงประชุมธนาคารโลกและ IMF",
    metaDescription:
      "มหาวิทยาลัยธรรมศาสตร์ให้เรียนออนไลน์วันที่ 12 และ 14 ถึง 16 ตุลาคม 2569 และงดปฏิบัติงานที่ท่าพระจันทร์วันที่ 16 ตุลาคม ช่วงประชุมธนาคารโลกและ IMF",
    lede: "มหาวิทยาลัยธรรมศาสตร์ปรับการเรียนการสอนเป็นออนไลน์ในวันที่ 12 ตุลาคม และวันที่ 14 ถึง 16 ตุลาคม 2569 และงดการปฏิบัติงานที่ท่าพระจันทร์ในวันที่ 16 ตุลาคม",
    sealAlt: "ตราสัญลักษณ์มหาวิทยาลัยธรรมศาสตร์",
    breadcrumb: "ประกาศแจ้งเตือน",
    noticeTitle: "เรียนออนไลน์ตามวันที่ระบุด้านล่าง",
    notice:
      "มาตรการของคณะรัฐมนตรีนี้มีเป้าหมายเพื่อบรรเทาปัญหาการจราจรและดูแลความปลอดภัยในช่วงการประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศที่กรุงเทพมหานคร",
    tableHeading: "วันที่เปลี่ยนแปลง",
    caption: "การเปลี่ยนแปลงที่ธรรมศาสตร์ ท่าพระจันทร์ วันที่ 12 ถึง 16 ตุลาคม 2569",
    columns: { date: "วันที่", classes: "การเรียนการสอน", work: "การปฏิบัติงานที่ท่าพระจันทร์" },
    rows: [
      {
        date: "วันจันทร์ที่ 12 ตุลาคม 2569",
        classes: "เรียนออนไลน์ งดเรียนในชั้นเรียน",
        work: "ปฏิบัติงานนอกสถานที่ตั้ง (Work from Home)",
      },
      {
        date: "วันอังคารที่ 13 ตุลาคม 2569",
        classes: "วันหยุดราชการ งดการเรียนการสอน",
        work: "วันหยุดราชการ",
      },
      {
        date: "วันพุธที่ 14 ตุลาคม 2569",
        classes: "เรียนออนไลน์ งดเรียนในชั้นเรียน",
        work: "ปฏิบัติงานนอกสถานที่ตั้ง (Work from Home)",
      },
      {
        date: "วันพฤหัสบดีที่ 15 ตุลาคม 2569",
        classes: "เรียนออนไลน์ งดเรียนในชั้นเรียน",
        work: "ปฏิบัติงานนอกสถานที่ตั้ง (Work from Home)",
      },
      {
        date: "วันศุกร์ที่ 16 ตุลาคม 2569",
        classes: "เรียนออนไลน์ งดเรียนในชั้นเรียน",
        work: "งดการเรียนการสอน การปฏิบัติงาน และการติดต่อราชการ ยกเว้นบุคลากรที่ผู้บังคับบัญชามอบหมายให้ปฏิบัติหน้าที่",
      },
    ],
    meansHeading: "สิ่งที่นักศึกษาต้องรู้",
    means: [
      "มหาวิทยาลัยขอความร่วมมือส่วนงานและคณาจารย์ปรับการเรียนการสอนเป็นรูปแบบออนไลน์ในวันที่ 12 ตุลาคม และวันที่ 14 ถึง 16 ตุลาคม",
      "มหาวิทยาลัยขอให้งดการเรียนการสอนในรูปแบบชั้นเรียนในวันดังกล่าว",
      "มหาวิทยาลัยขอให้ส่วนงานงดการติดต่อราชการที่ท่าพระจันทร์ในวันที่ 16 ตุลาคม ยกเว้นบุคลากรที่ผู้บังคับบัญชามอบหมายหน้าที่ไว้แล้ว",
      "หากไม่แน่ใจว่ารายวิชาของตนเรียนอย่างไร ให้สอบถามอาจารย์ผู้สอน",
    ],
    whyHeading: "เหตุผลของการเปลี่ยนแปลง",
    why: [
      "เมื่อวันที่ 19 พฤษภาคม 2569 คณะรัฐมนตรีอนุมัติให้วันศุกร์ที่ 16 ตุลาคม 2569 เป็นวันหยุดราชการเป็นกรณีพิเศษในพื้นที่กรุงเทพมหานคร และเห็นชอบให้หน่วยงานราชการในกรุงเทพมหานครปฏิบัติงานนอกสถานที่ตั้งในวันจันทร์ที่ 12 ตุลาคม วันพุธที่ 14 ตุลาคม และวันพฤหัสบดีที่ 15 ตุลาคม",
      "มติดังกล่าวมีเป้าหมายเพื่อบรรเทาปัญหาการจราจร อำนวยความสะดวกแก่ผู้เข้าร่วมการประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศ ปี 2569 และดูแลความปลอดภัยของรัฐมนตรีว่าการกระทรวงการคลังและผู้ว่าการธนาคารกลางของประเทศสมาชิก",
      "มหาวิทยาลัยธรรมศาสตร์จึงกำหนดแนวทางการเรียนการสอนและการปฏิบัติงานที่ท่าพระจันทร์ในช่วงการประชุม",
    ],
    announcementHeading: "ประกาศฉบับเต็ม",
    announcementLede: "มหาวิทยาลัยประกาศแนวทางนี้เมื่อวันที่ 7 สิงหาคม 2569",
    contact: "หากต้องการยืนยันรูปแบบการเรียนของรายวิชาใด ให้ติดต่อคณะของตน",
  },
};

export const advisoryBanner: { message: Bi; cta: Bi } = {
  message: {
    en: "Thammasat Tha Prachan moves classes online on 12 October and from 14 to 16 October for the World Bank and IMF meetings.",
    th: "ธรรมศาสตร์ ท่าพระจันทร์ เรียนออนไลน์วันที่ 12 และ 14 ถึง 16 ตุลาคม ช่วงประชุมธนาคารโลกและ IMF",
  },
  cta: { en: "Read the advisory", th: "อ่านประกาศ" },
};

export type AnnouncementText = {
  title: string;
  subject: string;
  paragraphs: string[];
  intro: string;
  items: string[];
  dateline: string;
  signatory: string;
  position: string;
};

export const announcementThai: AnnouncementText = {
  title: "ประกาศมหาวิทยาลัยธรรมศาสตร์",
  subject:
    "เรื่อง แนวทางการจัดการเรียนการสอนและการปฏิบัติงาน ณ ท่าพระจันทร์ ในช่วงการประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศ ปี ๒๕๖๙",
  paragraphs: [
    "ตามที่ ที่ประชุมคณะรัฐมนตรี (ครม.) เมื่อวันที่ ๑๙ พฤษภาคม ๒๕๖๙ มีติอนุมัติให้วันศุกร์ที่ ๑๖ ตุลาคม ๒๕๖๙ เป็นวันหยุดราชการเป็นกรณีพิเศษในพื้นที่กรุงเทพมหานคร และเห็นชอบให้หน่วยงานราชการในพื้นที่กรุงเทพมหานครปฏิบัติงานนอกสถานที่ตั้ง (Work from Home) ในวันจันทร์ที่ ๑๒ ตุลาคม ๒๕๖๙ และในช่วงระหว่างวันพุธที่ ๑๔ ตุลาคม ๒๕๖๙ และวันพฤหัสบดีที่ ๑๕ ตุลาคม ๒๕๖๙ เพื่อบรรเทาปัญหาด้านการจราจร และอำนวยความสะดวกในการเดินทางของผู้เข้าร่วมการประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศ ปี ๒๕๖๙ รวมทั้งเพื่อให้การอารักขาและการรักษาความปลอดภัยรัฐมนตรีว่าการกระทรวงการคลังและผู้ว่าการธนาคารกลางของประเทศสมาชิกเป็นไปด้วยความเรียบร้อยและมีประสิทธิภาพสูงสุด นั้น",
  ],
  intro:
    "มหาวิทยาลัยธรรมศาสตร์ จึงกำหนดแนวทางการจัดการเรียนการสอนและการปฏิบัติงาน ณ ท่าพระจันทร์ ในช่วงการประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศ ปี ๒๕๖๙ ดังต่อไปนี้",
  items: [
    "ขอให้ส่วนงานงดการเรียนการสอน การปฏิบัติงาน และการติดต่อราชการที่ท่าพระจันทร์ ในวันศุกร์ที่ ๑๖ ตุลาคม ๒๕๖๙ ยกเว้น บุคลากรที่ผู้บังคับบัญชาได้มอบหมายหน้าที่ให้ต้องปฏิบัติเป็นการเฉพาะไว้แล้ว",
    "ขอความร่วมมือส่วนงานและคณาจารย์ปรับรูปแบบการเรียนการสอนเป็นรูปแบบออนไลน์ (Online) และงดการเรียนการสอนในรูปแบบชั้นเรียน (Onsite) ในวันจันทร์ที่ ๑๒ ตุลาคม ๒๕๖๙ และในช่วงระหว่างวันพุธที่ ๑๔ ตุลาคม ๒๕๖๙ ถึงวันศุกร์ที่ ๑๖ ตุลาคม ๒๕๖๙",
    "ขอให้ส่วนงานและบุคลากรที่ปฏิบัติหน้าที่ประจำ ณ ท่าพระจันทร์ปฏิบัติงานนอกสถานที่ตั้ง (Work from Home) ในวันจันทร์ที่ ๑๒ ตุลาคม ๒๕๖๙ และในช่วงระหว่างวันพุธที่ ๑๔ ตุลาคม ๒๕๖๙ และวันพฤหัสบดีที่ ๑๕ ตุลาคม ๒๕๖๙",
  ],
  dateline: "ประกาศ ณ วันที่ ๗ เดือน สิงหาคม พ.ศ. ๒๕๖๙",
  signatory: "(ศาสตราจารย์ศุภสวัสดิ์ ชัชวาลย์)",
  position: "อธิการบดี",
};

export const announcementEnglish: AnnouncementText = {
  title: "Announcement of Thammasat University",
  subject:
    "Subject. Arrangements for teaching and work at Tha Prachan during the Annual Meetings of the Boards of Governors of the World Bank and the International Monetary Fund 2026 (Buddhist Era 2569)",
  paragraphs: [
    "At its meeting on 19 May 2026, the Cabinet resolved to approve Friday 16 October 2026 as a special public holiday in the Bangkok area. It also agreed that government agencies in the Bangkok area should work away from their usual premises (work from home) on Monday 12 October 2026 and between Wednesday 14 October 2026 and Thursday 15 October 2026. The purpose is to ease traffic problems, to make travel easier for those attending the Annual Meetings of the Boards of Governors of the World Bank and the International Monetary Fund 2026, and to ensure that the protection and security of the finance ministers and central bank governors of the member countries are carried out in good order and as effectively as possible.",
  ],
  intro:
    "Thammasat University therefore sets the following arrangements for teaching and work at Tha Prachan during the Annual Meetings of the Boards of Governors of the World Bank and the International Monetary Fund 2026.",
  items: [
    "Units are requested to suspend teaching, work and official contact at Tha Prachan on Friday 16 October 2026, except for personnel whom their supervisors have already specifically assigned to duty.",
    "Units and teaching staff are asked to cooperate by changing teaching to an online format and suspending classroom (onsite) teaching on Monday 12 October 2026 and from Wednesday 14 October 2026 to Friday 16 October 2026.",
    "Units and personnel on regular duty at Tha Prachan are requested to work away from their usual premises (work from home) on Monday 12 October 2026 and between Wednesday 14 October 2026 and Thursday 15 October 2026.",
  ],
  dateline: "Announced on 7 August 2026 (Buddhist Era 2569)",
  signatory: "(Professor Supasawad Chardchawarn)",
  position: "Rector",
};
