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
    sourceHeading: string;
    source: string;
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
    noticeTitle: "Do not travel to Tha Prachan for classes on these days",
    notice:
      "The Annual Meetings of the World Bank Group and the International Monetary Fund bring heavy traffic and security measures to Bangkok. Teach and learn online on the dates below.",
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
        classes: "Not covered by this announcement.",
        work: "Not covered by this announcement.",
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
      "Faculty and instructors move their classes to an online format on 12 October and from 14 to 16 October.",
      "Units stop classroom teaching on those days.",
      "Units do not handle official business at Tha Prachan on 16 October, except where a supervisor has assigned staff to do so.",
      "Ask your instructor if you are not sure how your class will meet.",
    ],
    whyHeading: "Why this is happening",
    why: [
      "On 19 May 2026 the Cabinet approved Friday 16 October 2026 as a special public holiday in Bangkok. It also agreed that government agencies in Bangkok work from home on Monday 12 October and on Wednesday 14 and Thursday 15 October.",
      "The Cabinet did this to ease traffic, to help delegates travel to the Annual Meetings of the World Bank Group and the International Monetary Fund 2026, and to keep the visiting finance ministers and central bank governors safe.",
      "Thammasat University set out how it will teach and work at Tha Prachan during the meetings in response.",
    ],
    sourceHeading: "Source",
    source:
      "Announcement of Thammasat University on the arrangements for teaching and work at Tha Prachan during the World Bank and IMF Annual Meetings 2026, dated 7 August 2026.",
    contact: "Contact your faculty if you need to confirm arrangements for a specific class.",
  },
  th: {
    title: "ธรรมศาสตร์ให้เรียนออนไลน์ช่วงประชุมธนาคารโลกและ IMF",
    metaDescription:
      "มหาวิทยาลัยธรรมศาสตร์ให้เรียนออนไลน์วันที่ 12 และ 14 ถึง 16 ตุลาคม 2569 และงดปฏิบัติงานที่ท่าพระจันทร์วันที่ 16 ตุลาคม ช่วงประชุมธนาคารโลกและ IMF",
    lede: "มหาวิทยาลัยธรรมศาสตร์ปรับการเรียนการสอนเป็นออนไลน์ในวันที่ 12 ตุลาคม และวันที่ 14 ถึง 16 ตุลาคม 2569 และงดการปฏิบัติงานที่ท่าพระจันทร์ในวันที่ 16 ตุลาคม",
    sealAlt: "ตราสัญลักษณ์มหาวิทยาลัยธรรมศาสตร์",
    breadcrumb: "ประกาศแจ้งเตือน",
    noticeTitle: "ไม่ต้องเดินทางมาท่าพระจันทร์เพื่อเรียนในวันดังกล่าว",
    notice:
      "การประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศทำให้การจราจรในกรุงเทพฯ หนาแน่นและมีมาตรการรักษาความปลอดภัยเข้มงวด ให้เรียนและสอนออนไลน์ตามวันที่ระบุด้านล่าง",
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
        classes: "ไม่อยู่ในประกาศฉบับนี้",
        work: "ไม่อยู่ในประกาศฉบับนี้",
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
      "คณะและอาจารย์ปรับการเรียนการสอนเป็นรูปแบบออนไลน์ในวันที่ 12 ตุลาคม และวันที่ 14 ถึง 16 ตุลาคม",
      "ส่วนงานงดการเรียนการสอนในชั้นเรียนในวันดังกล่าว",
      "ส่วนงานไม่ติดต่อราชการที่ท่าพระจันทร์ในวันที่ 16 ตุลาคม ยกเว้นบุคลากรที่ผู้บังคับบัญชามอบหมาย",
      "หากไม่แน่ใจว่ารายวิชาของตนเรียนอย่างไร ให้สอบถามอาจารย์ผู้สอน",
    ],
    whyHeading: "เหตุผลของการเปลี่ยนแปลง",
    why: [
      "เมื่อวันที่ 19 พฤษภาคม 2569 คณะรัฐมนตรีอนุมัติให้วันศุกร์ที่ 16 ตุลาคม 2569 เป็นวันหยุดราชการเป็นกรณีพิเศษในพื้นที่กรุงเทพมหานคร และเห็นชอบให้หน่วยงานราชการในกรุงเทพมหานครปฏิบัติงานนอกสถานที่ตั้งในวันจันทร์ที่ 12 ตุลาคม วันพุธที่ 14 ตุลาคม และวันพฤหัสบดีที่ 15 ตุลาคม",
      "มติดังกล่าวมีเป้าหมายเพื่อบรรเทาปัญหาการจราจร อำนวยความสะดวกแก่ผู้เข้าร่วมการประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศ ปี 2569 และดูแลความปลอดภัยของรัฐมนตรีว่าการกระทรวงการคลังและผู้ว่าการธนาคารกลางของประเทศสมาชิก",
      "มหาวิทยาลัยธรรมศาสตร์จึงกำหนดแนวทางการเรียนการสอนและการปฏิบัติงานที่ท่าพระจันทร์ในช่วงการประชุม",
    ],
    sourceHeading: "ที่มา",
    source:
      "ประกาศมหาวิทยาลัยธรรมศาสตร์ เรื่อง แนวทางการจัดการเรียนการสอนและการปฏิบัติงาน ณ ท่าพระจันทร์ ในช่วงการประชุมประจำปีสภาผู้ว่าการธนาคารโลกและกองทุนการเงินระหว่างประเทศ ปี 2569 ลงวันที่ 7 สิงหาคม 2569",
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
