import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * General guidance for an incident that none of the specific guides covers.
 * Raised with a custom banner and updates in `content/emergency/active.ts` that
 * say what is actually happening.
 */
const generic: EmergencyScenario = {
  id: "generic",
  severity: "warning",
  hero: "slate",
  group: "other",
  keyContacts: ["police", "ambulance", "fire", "touristPolice"],
  moreContacts: ["ddpm", "tuSwitchboard", "facultyOffice", "birOffice", "oia", "mentalHealth"],
  sources: [
    {
      label: {
        en: "The Nation, DDPM nationwide cell broadcast test",
        th: "The Nation การทดสอบระบบแจ้งเตือน Cell Broadcast ทั่วประเทศของ ปภ.",
      },
      href: "https://www.nationthailand.com/news/general/40061477",
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
    title: "Emergency affecting the faculty",
    summary:
      "Something is happening that affects Tha Prachan campus or the Faculty of Political Science. The update at the top of this page says what it is. This guide covers what to do in the meantime.",
    banner:
      "There is an emergency affecting the faculty. Read what to do and follow official instructions.",
    now: [
      "If anyone is in danger or hurt, call for help first. Police 191, ambulance 1669, fire 199.",
      "Follow instructions from university staff, security guards and the emergency services.",
      "Move away from the problem, not towards it. Do not go to look.",
      "Tell a friend or family member where you are and that you are safe.",
      "Check the latest update on this page before you travel to campus.",
    ],
    sections: [
      {
        id: "calling-for-help",
        heading: "Calling for help",
        items: [
          "Say what has happened, exactly where you are and how many people are hurt. Give a building name or number and the floor.",
          "Stay on the line and answer the operator's questions. Do not hang up first.",
          "If you do not speak Thai, call the Tourist Police on 1155. They speak English and can connect you to other services.",
          "If you cannot talk, stay on the line so the operator can hear what is happening.",
        ],
      },
      {
        id: "getting-information",
        heading: "Getting reliable information",
        items: [
          "Official alerts reach your phone by cell broadcast from the Department of Disaster Prevention and Mitigation. They arrive in Thai and English, with a loud tone, even when your phone is on silent.",
          "For campus news, rely on Thammasat University, the Faculty of Political Science and the BIR Programme on their own websites and Facebook pages.",
          "Screenshots in group chats are often old or wrong. Check anything important against an official source before you act on it or pass it on.",
        ],
      },
      {
        id: "classes",
        heading: "Classes, exams and deadlines",
        items: [
          "Do not assume classes are cancelled. Check your Thammasat email and each course page.",
          "If an emergency stops you reaching an exam or meeting a deadline, tell your lecturer and the BIR Programme office as soon as you safely can. Keep any evidence, such as a photo or an official notice.",
        ],
      },
      {
        id: "international-students",
        heading: "If you are an international student",
        items: [
          "Keep your passport or a copy of it with you, and your student card.",
          "Your embassy can help if you are hurt, arrested or lose your passport. Save its emergency number in your phone.",
          "The Office of International Affairs can help with visa questions if an emergency disrupts your studies.",
        ],
      },
      {
        id: "afterwards",
        heading: "Afterwards",
        body: [
          "Feeling shaken, anxious or unable to sleep after an emergency is normal. It usually eases within a few weeks. Talk to friends, or call the mental health hotline on 1323 at any hour. You can also ask BIRSA to put you in touch with university counselling.",
        ],
      },
    ],
  },
  th: {
    title: "เหตุฉุกเฉินที่ส่งผลต่อคณะ",
    summary:
      "ขณะนี้มีเหตุที่ส่งผลต่อมหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ หรือคณะรัฐศาสตร์ รายละเอียดล่าสุดอยู่ด้านบนของหน้านี้ ส่วนด้านล่างคือสิ่งที่ควรทำระหว่างนี้",
    banner: "มีเหตุฉุกเฉินที่ส่งผลต่อคณะ อ่านสิ่งที่ควรทำ และปฏิบัติตามคำแนะนำของเจ้าหน้าที่",
    now: [
      "หากมีคนตกอยู่ในอันตรายหรือบาดเจ็บ ให้โทรขอความช่วยเหลือก่อน ตำรวจ 191 รถพยาบาล 1669 ดับเพลิง 199",
      "ทำตามคำแนะนำของเจ้าหน้าที่มหาวิทยาลัย เจ้าหน้าที่รักษาความปลอดภัย และหน่วยกู้ภัย",
      "ออกห่างจากจุดเกิดเหตุ อย่าเข้าไปดู",
      "บอกเพื่อนหรือครอบครัวว่าคุณอยู่ที่ไหนและปลอดภัยดี",
      "อ่านข้อมูลล่าสุดในหน้านี้ก่อนออกเดินทางมามหาวิทยาลัย",
    ],
    sections: [
      {
        id: "calling-for-help",
        heading: "โทรขอความช่วยเหลือ",
        items: [
          "บอกว่าเกิดอะไรขึ้น อยู่ตรงไหน และมีคนบาดเจ็บกี่คน ระบุชื่อหรือเลขอาคารและชั้นให้ชัด",
          "ถือสายไว้และตอบคำถามของเจ้าหน้าที่ อย่าวางสายก่อน",
          "ถ้าเพื่อนต่างชาติที่อยู่ด้วยพูดภาษาไทยไม่ได้ ให้โทรตำรวจท่องเที่ยว 1155 ซึ่งมีเจ้าหน้าที่พูดภาษาอังกฤษ",
          "ถ้าพูดไม่ได้ ให้ถือสายค้างไว้ เจ้าหน้าที่จะได้ยินเสียงรอบตัวคุณ",
        ],
      },
      {
        id: "getting-information",
        heading: "ติดตามข้อมูลจากแหล่งที่เชื่อถือได้",
        items: [
          "กรมป้องกันและบรรเทาสาธารณภัยส่งข้อความเตือนภัยเข้าโทรศัพท์ผ่านระบบ Cell Broadcast เป็นภาษาไทยและอังกฤษ มีเสียงดังแม้ตั้งโทรศัพท์เป็นโหมดเงียบ",
          "ข่าวเกี่ยวกับมหาวิทยาลัย ให้ดูจากเว็บไซต์และเพจเฟซบุ๊กของมหาวิทยาลัยธรรมศาสตร์ คณะรัฐศาสตร์ และหลักสูตร BIR โดยตรง",
          "ภาพแคปหน้าจอที่ส่งต่อกันในกลุ่มแชตมักเก่าหรือผิด ตรวจสอบกับแหล่งทางการก่อนทำตามหรือส่งต่อ",
        ],
      },
      {
        id: "classes",
        heading: "การเรียน การสอบ และกำหนดส่งงาน",
        items: [
          "อย่าเพิ่งคิดว่าเรียนไม่มี ตรวจอีเมลธรรมศาสตร์และหน้ารายวิชาทุกวิชา",
          "ถ้าเหตุฉุกเฉินทำให้ไปสอบหรือส่งงานไม่ทัน ให้แจ้งอาจารย์และสำนักงานหลักสูตร BIR ทันทีที่ทำได้อย่างปลอดภัย เก็บหลักฐานไว้ด้วย เช่น รูปถ่ายหรือประกาศทางการ",
        ],
      },
      {
        id: "international-students",
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "พกหนังสือเดินทางหรือสำเนา และบัตรนักศึกษาติดตัวไว้",
          "สถานทูตช่วยได้หากคุณบาดเจ็บ ถูกจับกุม หรือหนังสือเดินทางหาย บันทึกเบอร์ฉุกเฉินของสถานทูตไว้ในโทรศัพท์",
          "กองวิเทศสัมพันธ์ช่วยเรื่องวีซ่าได้ หากเหตุฉุกเฉินกระทบการเรียนของคุณ",
        ],
      },
      {
        id: "afterwards",
        heading: "หลังเหตุการณ์",
        body: [
          "ความรู้สึกตกใจ กังวล หรือนอนไม่หลับหลังเหตุฉุกเฉินเป็นเรื่องปกติ และมักดีขึ้นภายในไม่กี่สัปดาห์ คุยกับเพื่อน หรือโทรสายด่วนสุขภาพจิต 1323 ได้ตลอดเวลา หรือบอก BIRSA ให้ช่วยประสานบริการให้คำปรึกษาของมหาวิทยาลัย",
        ],
      },
    ],
  },
};

export default generic;
