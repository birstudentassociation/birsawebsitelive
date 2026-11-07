import type { Locale } from "@/lib/i18n";

/** Labels shared by the open data index, edition and topic pages. */
export const openDataCopy: Record<
  Locale,
  {
    title: string;
    indexLede: string;
    editionTitle: (year: string) => string;
    editionLede: string;
    published: string;
    mainPoints: string;
    topics: string;
    aboutTitle: string;
    aboutSummary: string;
    status: string;
    trendsTitle: string;
    trendsLede: string;
    trendsLink: string;
    editionsHeading: string;
    editionsLede: string;
    onThisPage: string;
  }
> = {
  en: {
    title: "Open data",
    indexLede:
      "Figures about what BIRSA planned, spent, ran and decided in each year since 2021, published as tables you can read and download.",
    editionTitle: (year) => `BIRSA in numbers, ${year}`,
    editionLede:
      "What BIRSA planned and spent, what it ran, how often it met and how it was organised during the academic year.",
    published: "Published",
    mainPoints: "Main points",
    topics: "Explore the figures",
    aboutTitle: "About the data",
    aboutSummary: "Where the figures come from, what they leave out and what BIRSA does not hold.",
    status: "Final. These figures will not be updated.",
    trendsTitle: "BIRSA over five years",
    trendsLede:
      "How BIRSA's plans, events and records compare from 2021 to 2022 through 2025 to 2026, drawn from each year's own files.",
    trendsLink: "See how the five years compare",
    editionsHeading: "Each year in full",
    editionsLede:
      "Every year is published once, as it was recorded, with its own tables, notes and downloads.",
    onThisPage: "On this page",
  },
  th: {
    title: "ข้อมูลเปิด",
    indexLede:
      "ตัวเลขว่า BIRSA วางแผนใช้เงินอย่างไร ใช้ไปเท่าไร จัดกิจกรรมอะไร และตัดสินใจเรื่องใดในแต่ละปีตั้งแต่ปีการศึกษา 2564 ในรูปตารางที่อ่านและดาวน์โหลดได้",
    editionTitle: (year) => `BIRSA ในตัวเลข ${year}`,
    editionLede:
      "BIRSA วางแผนและใช้เงินอย่างไร จัดกิจกรรมอะไร ประชุมบ่อยแค่ไหน และมีโครงสร้างอย่างไรตลอดปีการศึกษา",
    published: "เผยแพร่เมื่อ",
    mainPoints: "ประเด็นสำคัญ",
    topics: "สำรวจตัวเลข",
    aboutTitle: "เกี่ยวกับข้อมูล",
    aboutSummary: "ตัวเลขมาจากไหน มีข้อจำกัดอะไร และข้อมูลใดที่ BIRSA ไม่มี",
    status: "ข้อมูลฉบับสุดท้าย จะไม่มีการแก้ไขอีก",
    trendsTitle: "BIRSA ตลอดห้าปี",
    trendsLede:
      "เปรียบเทียบแผนงาน กิจกรรม และการเก็บบันทึกของ BIRSA ตั้งแต่ปีการศึกษา 2564 ถึง 2568 จากเอกสารของแต่ละปีเอง",
    trendsLink: "ดูว่าห้าปีต่างกันอย่างไร",
    editionsHeading: "ข้อมูลรายปีฉบับเต็ม",
    editionsLede:
      "ข้อมูลแต่ละปีเผยแพร่ครั้งเดียวตามที่บันทึกไว้ พร้อมตาราง หมายเหตุ และไฟล์ดาวน์โหลดของปีนั้น",
    onThisPage: "ในหน้านี้",
  },
};
