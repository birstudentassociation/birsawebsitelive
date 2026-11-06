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
  }
> = {
  en: {
    title: "Open data",
    indexLede:
      "Figures about what BIRSA planned, spent, ran and decided, published as tables you can read and download.",
    editionTitle: (year) => `BIRSA in numbers, ${year}`,
    editionLede:
      "What BIRSA planned and spent, what it ran, how often it met and how it was organised during the academic year.",
    published: "Published",
    mainPoints: "Main points",
    topics: "Explore the figures",
    aboutTitle: "About the data",
    aboutSummary: "Where the figures come from, what they leave out and what BIRSA does not hold.",
    status: "Final. These figures will not be updated.",
  },
  th: {
    title: "ข้อมูลเปิด",
    indexLede:
      "ตัวเลขว่า BIRSA วางแผนใช้เงินอย่างไร ใช้ไปเท่าไร จัดกิจกรรมอะไร และตัดสินใจเรื่องใด ในรูปตารางที่อ่านและดาวน์โหลดได้",
    editionTitle: (year) => `BIRSA ในตัวเลข ${year}`,
    editionLede:
      "BIRSA วางแผนและใช้เงินอย่างไร จัดกิจกรรมอะไร ประชุมบ่อยแค่ไหน และมีโครงสร้างอย่างไรตลอดปีการศึกษา",
    published: "เผยแพร่เมื่อ",
    mainPoints: "ประเด็นสำคัญ",
    topics: "สำรวจตัวเลข",
    aboutTitle: "เกี่ยวกับข้อมูล",
    aboutSummary: "ตัวเลขมาจากไหน มีข้อจำกัดอะไร และข้อมูลใดที่ BIRSA ไม่มี",
    status: "ข้อมูลฉบับสุดท้าย จะไม่มีการแก้ไขอีก",
  },
};
