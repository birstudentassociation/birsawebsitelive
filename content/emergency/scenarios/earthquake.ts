import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Earthquake felt in Bangkok. Ordered for someone reading after the shaking has
 * stopped, since nobody reads a website while the ground is moving. Follows
 * DDPM's หมอบ ป้อง เกาะ (drop, cover, hold on) advice and the Earthquake
 * Country Alliance's guidance, with the 28 March 2025 Myanmar earthquake as
 * the local reference point.
 */
const earthquake: EmergencyScenario = {
  id: "earthquake",
  severity: "critical",
  hero: "red",
  group: "hazard",
  keyContacts: ["ambulance", "fire", "ddpm"],
  moreContacts: ["police", "tmd", "erawan", "mea", "touristPolice", "mentalHealth"],
  sources: [
    {
      label: {
        en: "DDPM, drop, cover and hold on (via Channel 7 News)",
        th: "ปภ. แนะ หมอบ ป้อง เกาะ เมื่อเกิดแผ่นดินไหว (ข่าวช่อง 7)",
      },
      href: "https://news.ch7.com/detail/793297",
    },
    {
      label: {
        en: "Earthquake Country Alliance, drop, cover and hold on",
        th: "Earthquake Country Alliance วิธีหมอบ ป้อง เกาะ",
      },
      href: "https://www.earthquakecountry.org/step5/",
    },
    {
      label: {
        en: "Wikipedia, collapse of the State Audit Office building, March 2025",
        th: "Wikipedia อาคารสำนักงานการตรวจเงินแผ่นดินถล่ม มีนาคม 2568",
      },
      href: "https://en.wikipedia.org/wiki/Collapse_of_Thailand_State_Audit_Office_building",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Earthquake",
    summary:
      "Bangkok is far from active faults, but its soft ground amplifies shaking from large distant earthquakes. On 28 March 2025 a magnitude 7.7 earthquake in Myanmar shook high-rise buildings across the city and brought down a tower under construction in Chatuchak.",
    banner:
      "An earthquake has been felt in Bangkok. Check for injuries and damage and expect aftershocks.",
    now: [
      "If it is still shaking, drop to your hands and knees, cover your head and neck, and hold on until it stops.",
      "When the shaking stops, check yourself and the people around you for injuries. Call 1669 for anyone badly hurt.",
      "Leave a tall or damaged building by the stairs. Never use the lift.",
      "Once outside, go to an open space away from buildings, walls and power cables.",
      "Expect aftershocks. Do not go back inside until staff say the building is safe.",
    ],
    sections: [
      {
        id: "during-the-shaking",
        heading: "During the shaking",
        items: [
          "Drop, cover and hold on where you are. Get under a sturdy desk or table if one is within a step or two. If not, crouch by an inside wall and protect your head and neck with your arms.",
          "Stay inside. Most injuries happen when people try to move or run out and are hit by falling glass and debris.",
          "Do not stand in a doorway. In modern buildings it is no safer than anywhere else.",
          "Keep away from windows, glass partitions, bookshelves and anything that could fall.",
          "In bed, stay there and cover your head with a pillow.",
          "If you use a wheelchair, lock the wheels, bend forward and cover your head and neck.",
        ],
      },
      {
        id: "tall-buildings",
        heading: "In a tall building",
        body: [
          "High floors can sway for a long time, sometimes after the ground has stopped moving. Swaying on its own does not mean the building is failing. Fire alarms and sprinklers may go off.",
          "Stay where you are until the shaking stops, then leave by the stairs, as DDPM advises. Look out for cracked stairs, fallen ceiling panels and broken glass on the way down.",
        ],
      },
      {
        id: "outside-or-travelling",
        heading: "Outside or travelling",
        items: [
          "Move away from buildings, walls, signs, trees and power cables, then crouch and cover your head.",
          "In a vehicle, pull over away from bridges, flyovers and buildings and stay inside until the shaking stops.",
          "On a river boat or pier, hold on and follow the crew. Keep clear of the pier edge.",
        ],
      },
      {
        id: "after",
        heading: "After the shaking",
        items: [
          "If you smell gas, see sparking cables or notice wide new cracks in walls, pillars or beams, leave the building and report it.",
          "Do not light a flame or switch on electrical equipment if you smell gas.",
          "Use text messages or chat apps instead of calls, so lines stay free for emergencies.",
          "Follow updates from Thammasat University and the Thai Meteorological Department before returning to any building.",
        ],
      },
      {
        id: "before",
        heading: "Be ready before it happens",
        items: [
          "Turn on emergency alerts on your phone. DDPM now sends warnings by cell broadcast, in Thai and English.",
          "Learn where the stairs are in the buildings you use, especially above the fourth floor.",
          "Keep heavy objects off high shelves above where you sit or sleep.",
        ],
      },
    ],
  },
  th: {
    title: "แผ่นดินไหว",
    summary:
      "กรุงเทพฯ อยู่ห่างจากรอยเลื่อนมีพลัง แต่ดินอ่อนของกรุงเทพฯ ขยายแรงสั่นจากแผ่นดินไหวใหญ่ที่อยู่ไกลออกไป เมื่อวันที่ 28 มีนาคม 2568 แผ่นดินไหวขนาด 7.7 ในเมียนมาทำให้อาคารสูงทั่วกรุงเทพฯ สั่นไหว และอาคารที่กำลังก่อสร้างในเขตจตุจักรถล่ม",
    banner: "รู้สึกได้ถึงแผ่นดินไหวในกรุงเทพฯ ตรวจดูผู้บาดเจ็บและความเสียหาย และระวังอาฟเตอร์ช็อก",
    now: [
      "ถ้ายังสั่นอยู่ ให้หมอบลง ป้องศีรษะและลำคอ และเกาะสิ่งที่มั่นคงไว้จนกว่าจะหยุดสั่น",
      "เมื่อหยุดสั่นแล้ว ตรวจดูตัวเองและคนรอบข้างว่าบาดเจ็บหรือไม่ ถ้ามีคนเจ็บหนักให้โทร 1669",
      "ออกจากอาคารสูงหรืออาคารที่เสียหายทางบันได ห้ามใช้ลิฟต์",
      "เมื่อออกมาแล้ว ไปอยู่ที่โล่งห่างจากอาคาร กำแพง และสายไฟ",
      "ระวังอาฟเตอร์ช็อก อย่ากลับเข้าอาคารจนกว่าเจ้าหน้าที่จะบอกว่าปลอดภัย",
    ],
    sections: [
      {
        id: "during-the-shaking",
        heading: "ระหว่างที่แผ่นดินสั่น",
        items: [
          "หมอบ ป้อง เกาะ ตรงที่คุณอยู่ ถ้ามีโต๊ะแข็งแรงอยู่ใกล้ ๆ ให้มุดลงใต้โต๊ะ ถ้าไม่มี ให้หมอบชิดผนังด้านในอาคาร แล้วใช้แขนป้องศีรษะและลำคอ",
          "อยู่ในอาคารไว้ก่อน การบาดเจ็บส่วนใหญ่เกิดตอนคนพยายามวิ่งออกไป แล้วถูกกระจกหรือเศษวัสดุตกใส่",
          "อย่ายืนหลบใต้วงกบประตู ในอาคารสมัยใหม่ตรงนั้นไม่ได้ปลอดภัยกว่าจุดอื่น",
          "อยู่ห่างจากหน้าต่าง ผนังกระจก ชั้นหนังสือ และสิ่งของที่อาจล้มหรือหล่นลงมา",
          "ถ้าอยู่บนเตียง ให้อยู่บนเตียงและใช้หมอนป้องศีรษะ",
          "ถ้าใช้รถเข็น ให้ล็อกล้อ ก้มตัวไปด้านหน้า และป้องศีรษะกับลำคอ",
        ],
      },
      {
        id: "tall-buildings",
        heading: "ถ้าอยู่บนอาคารสูง",
        body: [
          "ชั้นสูงอาจโยกนานกว่าพื้นดิน บางครั้งยังโยกอยู่หลังพื้นดินหยุดสั่นแล้ว การโยกอย่างเดียวไม่ได้แปลว่าอาคารกำลังพัง สัญญาณเตือนไฟไหม้และสปริงเกลอร์อาจทำงานเอง",
          "อยู่กับที่จนกว่าจะหยุดสั่น แล้วลงทางบันไดตามคำแนะนำของ ปภ. ระหว่างทางให้ระวังบันไดร้าว ฝ้าเพดานหล่น และเศษกระจก",
        ],
      },
      {
        id: "outside-or-travelling",
        heading: "ถ้าอยู่นอกอาคารหรือกำลังเดินทาง",
        items: [
          "ออกห่างจากอาคาร กำแพง ป้าย ต้นไม้ และสายไฟ แล้วหมอบลงและป้องศีรษะ",
          "ถ้าอยู่ในรถ ให้จอดห่างจากสะพาน ทางยกระดับ และอาคาร แล้วอยู่ในรถจนกว่าจะหยุดสั่น",
          "ถ้าอยู่บนเรือหรือท่าเรือ ให้จับราวไว้และทำตามพนักงานเรือ อยู่ห่างจากขอบท่า",
        ],
      },
      {
        id: "after",
        heading: "หลังแผ่นดินหยุดสั่น",
        items: [
          "ถ้าได้กลิ่นแก๊ส เห็นสายไฟมีประกายไฟ หรือเห็นรอยร้าวใหม่ขนาดใหญ่ที่ผนัง เสา หรือคาน ให้ออกจากอาคารและแจ้งเจ้าหน้าที่",
          "ถ้าได้กลิ่นแก๊ส ห้ามจุดไฟหรือเปิดเครื่องใช้ไฟฟ้า",
          "ส่งข้อความหรือแชตแทนการโทร เพื่อให้คู่สายว่างสำหรับเหตุฉุกเฉิน",
          "ติดตามประกาศของมหาวิทยาลัยธรรมศาสตร์และกรมอุตุนิยมวิทยาก่อนกลับเข้าอาคาร",
        ],
      },
      {
        id: "before",
        heading: "เตรียมพร้อมไว้ก่อน",
        items: [
          "เปิดการแจ้งเตือนเหตุฉุกเฉินในโทรศัพท์ ตอนนี้ ปภ. ส่งคำเตือนผ่านระบบ Cell Broadcast เป็นภาษาไทยและอังกฤษ",
          "จำตำแหน่งบันไดในอาคารที่ใช้เป็นประจำ โดยเฉพาะถ้าเรียนหรือพักสูงกว่าชั้นสี่",
          "อย่าวางของหนักบนชั้นสูงเหนือที่นั่งหรือที่นอน",
        ],
      },
    ],
  },
};

export default earthquake;
