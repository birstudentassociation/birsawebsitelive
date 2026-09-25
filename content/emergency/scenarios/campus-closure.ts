import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * The whole Tha Prachan campus is closed, for example by the university for
 * safety, by the authorities, or because of events in the old town around it.
 */
const campusClosure: EmergencyScenario = {
  id: "campus-closure",
  severity: "warning",
  hero: "slate",
  group: "disruption",
  keyContacts: ["birOffice", "tuSwitchboard", "touristPolice"],
  moreContacts: ["facultyOffice", "oia", "police", "ambulance", "mentalHealth"],
  sources: [
    {
      label: {
        en: "Faculty of Political Science, contact information",
        th: "คณะรัฐศาสตร์ มธ. ข้อมูลการติดต่อ",
      },
      href: "https://polsci.tu.ac.th/en/contact-us-2/",
    },
    {
      label: {
        en: "Thammasat Office of International Affairs",
        th: "กองวิเทศสัมพันธ์ มหาวิทยาลัยธรรมศาสตร์",
      },
      href: "https://oia.tu.ac.th/",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Tha Prachan campus closed",
    summary:
      "Thammasat University has closed the whole Tha Prachan campus. This guide covers getting away safely if you are there, and what happens to classes.",
    banner:
      "Tha Prachan campus is closed. Do not travel to campus until the university says it has reopened.",
    now: [
      "Do not travel to campus until the university announces it has reopened.",
      "If you are on campus, leave calmly through the gate staff tell you to use.",
      "Check your Thammasat email and course pages for arrangements for each class.",
      "Tell someone where you are if the closure is because of a safety threat.",
    ],
    sections: [
      {
        id: "leaving",
        heading: "If you are on campus",
        items: [
          "Follow security guards and staff. Some gates may be shut.",
          "Do not try to get in or out through closed gates or over walls.",
          "If the closure is because of trouble outside, ask staff which route is safe. The piers and the roads towards Sanam Luang may be affected.",
          "If you cannot get home safely, stay with a group in a safe place and call someone to tell them where you are.",
        ],
      },
      {
        id: "classes",
        heading: "Classes, exams and deadlines",
        items: [
          "Do not assume anything is cancelled. Classes may move online, and exams may be moved or rescheduled.",
          "Check official announcements from the university and the faculty, and your email from each lecturer.",
          "If you cannot do an exam or meet a deadline because of the closure, write to your lecturer and the BIR Programme office straight away.",
        ],
      },
      {
        id: "belongings-and-housing",
        heading: "Belongings and housing",
        items: [
          "Wait for the university to say how and when you can collect things left on campus.",
          "If you need something urgently, such as medicine or a passport, tell the BIR Programme office.",
          "If where you live is affected by the same event, follow instructions from your housing and ask BIRSA for help finding a place to stay.",
        ],
      },
      {
        id: "international-students",
        heading: "If you are an international student",
        body: [
          "Check your government's travel advice for Thailand and tell your embassy where you are if the closure is linked to wider unrest. The Office of International Affairs can advise on visas if your studies are disrupted for a long time.",
        ],
      },
      {
        id: "reopening",
        heading: "Reopening",
        body: [
          "Only an announcement from Thammasat University reopens the campus. Expect changed timetables for a few days after.",
        ],
      },
    ],
  },
  th: {
    title: "มหาวิทยาลัยปิดพื้นที่ท่าพระจันทร์",
    summary:
      "มหาวิทยาลัยธรรมศาสตร์ประกาศปิดพื้นที่ท่าพระจันทร์ทั้งหมด หน้านี้อธิบายวิธีออกจากมหาวิทยาลัยอย่างปลอดภัยถ้าคุณอยู่ในพื้นที่ และจะเกิดอะไรกับการเรียน",
    banner: "มหาวิทยาลัยปิดพื้นที่ท่าพระจันทร์ อย่าเดินทางมาจนกว่ามหาวิทยาลัยจะประกาศเปิดอีกครั้ง",
    now: [
      "อย่าเดินทางมามหาวิทยาลัยจนกว่าจะมีประกาศเปิดอีกครั้ง",
      "ถ้าอยู่ในมหาวิทยาลัย ให้ออกอย่างใจเย็นทางประตูที่เจ้าหน้าที่บอก",
      "ตรวจอีเมลธรรมศาสตร์และหน้ารายวิชาว่าแต่ละวิชาจะจัดการอย่างไร",
      "ถ้าปิดเพราะมีภัยต่อความปลอดภัย ให้บอกคนที่ไว้ใจว่าคุณอยู่ที่ไหน",
    ],
    sections: [
      {
        id: "leaving",
        heading: "ถ้าคุณอยู่ในมหาวิทยาลัย",
        items: [
          "ทำตามเจ้าหน้าที่รักษาความปลอดภัยและเจ้าหน้าที่มหาวิทยาลัย บางประตูอาจปิด",
          "อย่าพยายามเข้าออกทางประตูที่ปิดหรือปีนกำแพง",
          "ถ้าปิดเพราะเหตุข้างนอก ให้ถามเจ้าหน้าที่ว่าเส้นทางไหนปลอดภัย ท่าเรือและถนนไปทางสนามหลวงอาจได้รับผลกระทบ",
          "ถ้ายังกลับที่พักอย่างปลอดภัยไม่ได้ ให้อยู่รวมกลุ่มในที่ปลอดภัย และโทรบอกคนที่ไว้ใจว่าคุณอยู่ที่ไหน",
        ],
      },
      {
        id: "classes",
        heading: "การเรียน การสอบ และกำหนดส่งงาน",
        items: [
          "อย่าเพิ่งคิดว่าทุกอย่างถูกยกเลิก บางวิชาอาจเรียนออนไลน์ และการสอบอาจย้ายที่หรือเลื่อนวัน",
          "ติดตามประกาศทางการจากมหาวิทยาลัยและคณะ และอีเมลจากอาจารย์แต่ละวิชา",
          "ถ้าการปิดทำให้สอบหรือส่งงานไม่ได้ ให้เขียนถึงอาจารย์และสำนักงานหลักสูตร BIR ทันที",
        ],
      },
      {
        id: "belongings-and-housing",
        heading: "ของที่ลืมไว้และที่พัก",
        items: [
          "รอประกาศจากมหาวิทยาลัยว่าจะเข้าไปเอาของที่ลืมไว้ได้เมื่อไรและอย่างไร",
          "ถ้าต้องใช้ของด่วน เช่น ยาหรือหนังสือเดินทาง ให้แจ้งสำนักงานหลักสูตร BIR",
          "ถ้าที่พักได้รับผลกระทบจากเหตุเดียวกัน ให้ทำตามคำแนะนำของที่พัก และขอให้ BIRSA ช่วยหาที่พักชั่วคราว",
        ],
      },
      {
        id: "international-students",
        heading: "สำหรับนักศึกษาต่างชาติ",
        body: [
          "เพื่อนนักศึกษาต่างชาติควรตรวจคำแนะนำการเดินทางของรัฐบาลประเทศตน และแจ้งสถานทูตว่าอยู่ที่ไหน หากการปิดเกี่ยวข้องกับความไม่สงบในวงกว้าง กองวิเทศสัมพันธ์ให้คำแนะนำเรื่องวีซ่าได้หากการเรียนหยุดชะงักเป็นเวลานาน",
        ],
      },
      {
        id: "reopening",
        heading: "การเปิดอีกครั้ง",
        body: [
          "มหาวิทยาลัยจะเปิดพื้นที่อีกครั้งก็ต่อเมื่อมหาวิทยาลัยธรรมศาสตร์ประกาศเท่านั้น ตารางเรียนอาจเปลี่ยนไปอีกสองสามวันหลังเปิด",
        ],
      },
    ],
  },
};

export default campusClosure;
