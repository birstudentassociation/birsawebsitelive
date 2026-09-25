import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * The Faculty of Political Science building is closed, for example after a
 * power or water failure or building damage, while the rest of campus stays
 * open. Contacts from the faculty's and BIR Programme's own contact pages.
 */
const facultyClosure: EmergencyScenario = {
  id: "faculty-closure",
  severity: "info",
  hero: "slate",
  group: "disruption",
  keyContacts: ["birOffice", "facultyOffice"],
  moreContacts: ["oia", "tuSwitchboard", "mea", "police", "ambulance"],
  sources: [
    {
      label: {
        en: "Faculty of Political Science, contact information",
        th: "คณะรัฐศาสตร์ มธ. ข้อมูลการติดต่อ",
      },
      href: "https://polsci.tu.ac.th/en/contact-us-2/",
    },
    {
      label: { en: "BIR Programme, contact us", th: "หลักสูตร BIR ติดต่อเรา" },
      href: "https://www.birpolsci.com/contact-us",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Faculty building closed",
    summary:
      "The Faculty of Political Science building at Tha Prachan is closed. The rest of campus may still be open. This guide covers classes, deadlines and who to contact.",
    banner:
      "The Faculty of Political Science building is closed. Check your email before coming in.",
    now: [
      "Do not come to the faculty building until the faculty says it has reopened.",
      "Check your Thammasat email and course pages for where and how each class will run.",
      "If you are in the building when it closes, leave calmly by the nearest exit and follow staff.",
      "Ask the BIR Programme office if you are not sure whether something still applies to you.",
    ],
    sections: [
      {
        id: "classes",
        heading: "Classes, exams and deadlines",
        items: [
          "A closure does not automatically cancel classes, exams or deadlines. Classes may move online or to another building.",
          "Each lecturer will tell you about their own course. If you have heard nothing by the evening before, email them.",
          "If the closure stops you handing in work or sitting an exam, write to your lecturer and the BIR Programme office straight away.",
        ],
      },
      {
        id: "services",
        heading: "Services while the building is closed",
        items: [
          "The faculty office and the BIR Programme office can usually deal with letters, forms and questions by email.",
          "Other campus buildings, including the university library, may still be open. Check before you travel.",
          "If you left something important inside, such as medicine or a passport, contact the faculty office. Do not try to get into the building yourself.",
        ],
      },
      {
        id: "official-news",
        heading: "Where the news comes from",
        body: [
          "Closure and reopening notices come from the Faculty of Political Science on its website and Facebook page, and by Thammasat email. Treat anything else as unconfirmed until one of those says the same.",
        ],
      },
    ],
  },
  th: {
    title: "อาคารคณะรัฐศาสตร์ปิดทำการ",
    summary:
      "อาคารคณะรัฐศาสตร์ ท่าพระจันทร์ ปิดทำการ ส่วนอื่นของมหาวิทยาลัยอาจยังเปิดตามปกติ หน้านี้อธิบายเรื่องการเรียน กำหนดส่งงาน และช่องทางติดต่อ",
    banner: "อาคารคณะรัฐศาสตร์ปิดทำการ ตรวจอีเมลก่อนเดินทางมาคณะ",
    now: [
      "อย่าเพิ่งมาที่อาคารคณะจนกว่าคณะจะประกาศเปิดอีกครั้ง",
      "ตรวจอีเมลธรรมศาสตร์และหน้ารายวิชาว่าแต่ละวิชาจะเรียนที่ไหนและอย่างไร",
      "ถ้าอยู่ในอาคารตอนประกาศปิด ให้ออกทางออกที่ใกล้ที่สุดอย่างใจเย็น และทำตามเจ้าหน้าที่",
      "ถ้าไม่แน่ใจว่าเรื่องไหนยังต้องทำ ให้ถามสำนักงานหลักสูตร BIR",
    ],
    sections: [
      {
        id: "classes",
        heading: "การเรียน การสอบ และกำหนดส่งงาน",
        items: [
          "การปิดอาคารไม่ได้แปลว่างดเรียน งดสอบ หรือเลื่อนกำหนดส่งงานโดยอัตโนมัติ บางวิชาอาจเรียนออนไลน์หรือย้ายไปอาคารอื่น",
          "อาจารย์แต่ละวิชาจะแจ้งเรื่องวิชาของตนเอง ถ้าถึงเย็นวันก่อนเรียนยังไม่ได้ข่าว ให้อีเมลถามอาจารย์",
          "ถ้าการปิดอาคารทำให้ส่งงานหรือเข้าสอบไม่ได้ ให้เขียนถึงอาจารย์และสำนักงานหลักสูตร BIR ทันที",
        ],
      },
      {
        id: "services",
        heading: "บริการระหว่างที่อาคารปิด",
        items: [
          "สำนักงานคณะและสำนักงานหลักสูตร BIR มักรับเรื่องหนังสือรับรอง แบบฟอร์ม และคำถามทางอีเมลได้",
          "อาคารอื่นในมหาวิทยาลัย รวมถึงห้องสมุด อาจยังเปิดอยู่ ตรวจสอบก่อนเดินทาง",
          "ถ้าลืมของสำคัญไว้ข้างใน เช่น ยาหรือหนังสือเดินทาง ให้ติดต่อสำนักงานคณะ อย่าพยายามเข้าไปเอง",
        ],
      },
      {
        id: "official-news",
        heading: "ข่าวทางการมาจากไหน",
        body: [
          "ประกาศปิดและเปิดอาคารมาจากคณะรัฐศาสตร์ ทางเว็บไซต์ เพจเฟซบุ๊ก และอีเมลธรรมศาสตร์ ข้อมูลจากที่อื่นให้ถือว่ายังไม่ยืนยัน จนกว่าช่องทางเหล่านี้จะประกาศตรงกัน",
        ],
      },
    ],
  },
};

export default facultyClosure;
