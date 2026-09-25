import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * An infectious illness spreading among students and staff, usually a
 * respiratory virus. Uses the US CDC's 2024 respiratory virus guidance for when
 * to stay home and when to return, with Thai health contacts and the TU
 * Virtual Clinic.
 */
const healthAdvisory: EmergencyScenario = {
  id: "health-advisory",
  severity: "warning",
  hero: "green",
  group: "disruption",
  keyContacts: ["tuClinic", "ambulance", "ddc"],
  moreContacts: ["siriraj", "mentalHealth", "facultyOffice", "birOffice", "oia"],
  sources: [
    {
      label: {
        en: "US CDC, updated respiratory virus guidance, March 2024",
        th: "CDC สหรัฐฯ แนวทางป้องกันโรคติดเชื้อทางเดินหายใจ มีนาคม 2567",
      },
      href: "https://www.cdc.gov/media/releases/2024/p0301-respiratory-virus.html",
    },
    {
      label: {
        en: "Thammasat Office of International Affairs, well-being services",
        th: "กองวิเทศสัมพันธ์ มธ. บริการด้านสุขภาวะ",
      },
      href: "https://oia.tu.ac.th/well-being-services/",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Illness outbreak",
    summary:
      "An infectious illness is spreading among students or staff. Most people recover at home. This guide covers how to avoid passing it on, when to get medical help, and what to do about classes.",
    banner:
      "An illness is spreading in the faculty. Stay home if you are unwell and read the health advice.",
    now: [
      "If you feel unwell, stay home and away from classes and events.",
      "Tell your lecturers you are ill, and keep any medical certificate.",
      "Wash your hands often and cover coughs and sneezes.",
      "Wear a mask in crowded indoor places, and always if you have symptoms and must be around others.",
      "Call 1669 if someone has trouble breathing, chest pain, confusion or cannot stay awake.",
    ],
    sections: [
      {
        id: "if-you-are-ill",
        heading: "If you are ill",
        items: [
          "Rest, drink plenty and take paracetamol for fever if you need it.",
          "Keep away from other people where you live as far as you can, and open windows.",
          "The TU Virtual Clinic at Tha Prachan is free for students. Call first if you have a fever or cough so staff can prepare.",
          "Take a test if the university, a doctor or the Ministry of Public Health asks you to, and follow what the result tells you.",
        ],
      },
      {
        id: "going-back",
        heading: "When to go back",
        body: [
          "Unless a doctor or the university gives other instructions for this illness, you can go back to classes once both of these have been true for at least 24 hours.",
        ],
        items: [
          "Your symptoms are getting better overall.",
          "You have had no fever without taking fever medicine.",
        ],
      },
      {
        id: "after-going-back",
        heading: "For five days after you go back",
        items: [
          "Wear a mask around other people.",
          "Keep your distance from anyone who is older, pregnant or has a weak immune system.",
          "Keep washing your hands and let fresh air into shared rooms.",
        ],
      },
      {
        id: "get-help-urgently",
        heading: "Get help urgently",
        body: [
          "Call 1669 or go to a hospital emergency department for difficulty breathing, pain or pressure in the chest, confusion, bluish lips, being unable to keep fluids down, or a fever that lasts more than three days. Siriraj Hospital, across the river, is the nearest large hospital.",
        ],
      },
      {
        id: "classes",
        heading: "Classes and exams",
        items: [
          "Tell your lecturers before class if you can. Ask the BIR Programme office what to do if you will miss an exam.",
          "If the faculty moves teaching online, it will announce it by Thammasat email and on its Facebook page.",
          "International students off sick for a long time should tell the Office of International Affairs, in case it affects a visa.",
        ],
      },
    ],
  },
  th: {
    title: "โรคติดต่อระบาดในคณะ",
    summary:
      "ขณะนี้มีโรคติดต่อระบาดในหมู่นักศึกษาหรือบุคลากร ผู้ป่วยส่วนใหญ่หายได้เองที่บ้าน หน้านี้อธิบายวิธีไม่ให้แพร่เชื้อต่อ เมื่อไรควรไปพบแพทย์ และจะทำอย่างไรกับการเรียน",
    banner: "มีโรคติดต่อระบาดในคณะ ถ้าไม่สบายให้พักอยู่บ้าน และอ่านคำแนะนำด้านสุขภาพ",
    now: [
      "ถ้ารู้สึกไม่สบาย ให้พักอยู่บ้าน งดเข้าเรียนและร่วมกิจกรรม",
      "แจ้งอาจารย์ว่าป่วย และเก็บใบรับรองแพทย์ไว้",
      "ล้างมือบ่อย ๆ และปิดปากปิดจมูกเวลาไอหรือจาม",
      "สวมหน้ากากในที่แออัดในอาคาร และสวมทุกครั้งถ้ามีอาการแต่ต้องอยู่ใกล้คนอื่น",
      "โทร 1669 ถ้ามีคนหายใจลำบาก เจ็บหน้าอก สับสน หรือซึมจนปลุกไม่ค่อยตื่น",
    ],
    sections: [
      {
        id: "if-you-are-ill",
        heading: "ถ้าคุณป่วย",
        items: [
          "พักผ่อน ดื่มน้ำมาก ๆ และกินยาพาราเซตามอลลดไข้ถ้าจำเป็น",
          "แยกตัวจากคนที่พักด้วยเท่าที่ทำได้ และเปิดหน้าต่างให้อากาศถ่ายเท",
          "ห้องพยาบาล Virtual Clinic ท่าพระจันทร์ ไม่มีค่าใช้จ่ายสำหรับนักศึกษา ถ้ามีไข้หรือไอ ให้โทรแจ้งก่อนไปเพื่อให้เจ้าหน้าที่เตรียมรับ",
          "ตรวจหาเชื้อถ้ามหาวิทยาลัย แพทย์ หรือกระทรวงสาธารณสุขขอให้ตรวจ และปฏิบัติตามผลตรวจ",
        ],
      },
      {
        id: "going-back",
        heading: "กลับไปเรียนได้เมื่อไร",
        body: [
          "หากแพทย์หรือมหาวิทยาลัยไม่ได้กำหนดไว้เป็นอย่างอื่นสำหรับโรคนี้ กลับไปเรียนได้เมื่อครบทั้งสองข้อนี้ติดต่อกันอย่างน้อย 24 ชั่วโมง",
        ],
        items: ["อาการโดยรวมดีขึ้น", "ไม่มีไข้โดยไม่ต้องกินยาลดไข้"],
      },
      {
        id: "after-going-back",
        heading: "ห้าวันหลังกลับไปเรียน",
        items: [
          "สวมหน้ากากเมื่ออยู่ใกล้คนอื่น",
          "เว้นระยะจากผู้สูงอายุ หญิงตั้งครรภ์ และผู้มีภูมิคุ้มกันต่ำ",
          "ล้างมือต่อไป และเปิดให้อากาศถ่ายเทในห้องที่ใช้ร่วมกัน",
        ],
      },
      {
        id: "get-help-urgently",
        heading: "อาการที่ต้องรีบไปโรงพยาบาล",
        body: [
          "โทร 1669 หรือไปห้องฉุกเฉินของโรงพยาบาล ถ้าหายใจลำบาก เจ็บหรือแน่นหน้าอก สับสน ริมฝีปากเขียว ดื่มน้ำแล้วอาเจียนตลอด หรือมีไข้นานเกินสามวัน โรงพยาบาลศิริราชฝั่งตรงข้ามแม่น้ำเป็นโรงพยาบาลใหญ่ที่ใกล้ที่สุด",
        ],
      },
      {
        id: "classes",
        heading: "การเรียนและการสอบ",
        items: [
          "แจ้งอาจารย์ก่อนเริ่มเรียนถ้าทำได้ ถ้าจะขาดสอบ ให้สอบถามสำนักงานหลักสูตร BIR ว่าต้องทำอย่างไร",
          "ถ้าคณะเปลี่ยนเป็นเรียนออนไลน์ จะประกาศทางอีเมลธรรมศาสตร์และเพจเฟซบุ๊กของคณะ",
          "เพื่อนนักศึกษาต่างชาติที่ป่วยนานควรแจ้งกองวิเทศสัมพันธ์ เผื่อกระทบเรื่องวีซ่า",
        ],
      },
    ],
  },
};

export default healthAdvisory;
