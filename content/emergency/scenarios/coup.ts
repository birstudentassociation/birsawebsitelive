import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Political instability or coup: strictly apolitical, safety-only guidance.
 * Transcribed from the researched dossier. Does not take, or imply, any
 * political position.
 */
const coup: EmergencyScenario = {
  id: "coup",
  severity: "critical",
  en: {
    bannerMessage:
      "A period of political instability has been declared. Stay indoors if possible, avoid crowds, and follow official updates.",
    title: "Political Instability or Coup: Staying Safe",
    lede: "If Thailand enters a period of political instability, such as a declared state of emergency, martial law, or a change of government by non-electoral means, your safety depends on staying calm, staying informed through official channels, and avoiding areas of tension. This page is safety guidance only.",
    immediateActions: [
      "Move to a safe indoor location (your residence, a dorm, or another secure building) and stay there until you have reliable information.",
      "Check official sources (the Royal Thai Government, Thammasat University, your embassy) before making any decisions.",
      "Charge your phone fully and keep a power bank ready.",
      "Tell a friend, housemate, or family member where you are.",
      "Keep your passport, Thai ID or student card, and some cash within reach in case you need to move quickly or prove your identity.",
      "Avoid Sanam Luang, government buildings, military installations, and any area with a visible security or troop presence.",
      "If a curfew is announced, plan to be at your accommodation well before it starts.",
    ],
    sections: [
      {
        heading: "If you are on campus",
        items: [
          "Follow instructions from faculty staff and campus security.",
          "Move away from gates, main roads, and open squares if there is any sign of a crowd forming nearby.",
          "Do not go toward Sanam Luang or other gathering points \"to see what's happening.\"",
          "Wait for official word from the Faculty of Political Science or Thammasat University before leaving campus if the situation outside seems unclear.",
        ],
      },
      {
        heading: "If you are off campus or at home",
        items: [
          "Stay where you are unless officially told to evacuate.",
          "Keep a small emergency kit ready: water, snacks, a torch, any medication you need, a phone charger, and copies of your documents.",
          "Limit non-essential travel, especially at night or near curfew hours.",
          "If you must go out, tell someone your route and expected return time.",
        ],
      },
      {
        heading: "Staying informed",
        items: [
          "Follow Thammasat University's and the Faculty of Political Science's official Facebook pages and websites for announcements about classes and campus access.",
          "Follow official Royal Thai Government announcements for any national measures such as curfews or restricted zones.",
          "Be cautious with information on social media. Unverified rumours spread quickly during instability. Confirm anything alarming against an official source before acting on it or sharing it.",
          "Keep in touch with family so they know you are safe.",
        ],
      },
      {
        heading: "For international students",
        items: [
          "Contact your embassy or consulate in Bangkok and follow their guidance.",
          "Register your presence in Thailand with your government's travel-registration service if one exists (for example the US STEP programme, or the UK's travel advice service), so your embassy can reach you.",
          "Check your home country's travel advisory level for Thailand regularly. It may change during a period of instability.",
          "Keep your passport and visa documents accessible, and know the location and contact details of your embassy in Bangkok.",
          "Thammasat's Office of International Affairs (OIA) can help with university-related questions. Your embassy is the right contact for consular matters such as a lost passport, evacuation advice, or personal safety concerns.",
        ],
      },
      {
        heading: "What not to do",
        items: [
          "Do not go to watch, photograph, or livestream a demonstration, checkpoint, or security operation out of curiosity.",
          "Do not share unverified information or rumours.",
          "Do not attempt to cross checkpoints, restricted zones, or curfew lines to save time.",
          "Do not comment publicly in ways that could be read as taking a political position. This guidance is about safety, not politics.",
        ],
      },
      {
        heading: "When it is over",
        items: [
          "Keep checking official Thammasat and government channels for confirmation that normal activity has resumed before returning to your normal routine.",
          "Class schedules, deadlines, and exams may be adjusted. Do not assume normal schedules resume automatically; check official faculty announcements.",
          "Let your family and, if applicable, your embassy know that you are safe.",
        ],
      },
    ],
    extraContacts: [
      {
        label: "DDPM 24-hour disaster and safety hotline (LINE: @1784DDPM)",
        value: "1784",
        href: "tel:1784",
      },
      {
        label: "Tourist Police (English-speaking, 24 hours)",
        value: "1155",
        href: "tel:1155",
      },
      {
        label: "Faculty of Political Science main office",
        value: "02-221-6111 ext. 3400",
        href: "tel:022216111",
      },
      {
        label: "BIR Programme office",
        value: "02-221-6111 ext. 3409",
        href: "tel:022216111",
      },
      {
        label: "BIR Programme office (email)",
        value: "bir@tu.ac.th",
        href: "mailto:bir@tu.ac.th",
      },
      {
        label: "Office of International Affairs (OIA), Thammasat University",
        value: "info.inter@tu.ac.th",
        href: "mailto:info.inter@tu.ac.th",
      },
    ],
  },
  th: {
    bannerMessage:
      "ประเทศอยู่ในช่วงสถานการณ์ทางการเมืองที่ไม่แน่นอน ขอให้อยู่ในที่ปลอดภัย หลีกเลี่ยงการรวมกลุ่มคน และติดตามประกาศจากหน่วยงานทางการ",
    title: "ความปลอดภัยในช่วงสถานการณ์ทางการเมืองไม่แน่นอนหรือรัฐประหาร",
    lede: "หากประเทศไทยเข้าสู่ช่วงสถานการณ์ทางการเมืองไม่แน่นอน เช่น การประกาศสถานการณ์ฉุกเฉิน กฎอัยการศึก หรือการเปลี่ยนแปลงรัฐบาลนอกวิถีการเลือกตั้ง ความปลอดภัยของคุณขึ้นอยู่กับการตั้งสติ ติดตามข้อมูลจากช่องทางทางการ และหลีกเลี่ยงพื้นที่ที่มีความตึงเครียด เนื้อหาในหน้านี้เป็นคำแนะนำด้านความปลอดภัยเท่านั้น",
    immediateActions: [
      "ไปยังสถานที่ปลอดภัยในร่ม เช่น ที่พักของคุณหรืออาคารที่มั่นคง และอยู่ที่นั่นจนกว่าจะได้รับข้อมูลที่เชื่อถือได้",
      "ตรวจสอบแหล่งข้อมูลทางการ (รัฐบาลไทย มหาวิทยาลัยธรรมศาสตร์ สถานทูตของคุณ) ก่อนตัดสินใจใด ๆ",
      "ชาร์จโทรศัพท์ให้เต็มและเตรียมพาวเวอร์แบงก์ไว้ให้พร้อม",
      "แจ้งเพื่อน เพื่อนร่วมหอ หรือครอบครัวว่าคุณอยู่ที่ไหน",
      "พกพาสปอร์ต บัตรประชาชนหรือบัตรนักศึกษา และเงินสดจำนวนหนึ่งไว้ใกล้ตัว เผื่อต้องเคลื่อนย้ายอย่างรวดเร็วหรือต้องยืนยันตัวตน",
      "หลีกเลี่ยงสนามหลวง สถานที่ราชการ พื้นที่ทางทหาร และบริเวณที่มีกำลังเจ้าหน้าที่รักษาความปลอดภัยปรากฏชัดเจน",
      "หากมีการประกาศเคอร์ฟิว ให้วางแผนกลับถึงที่พักก่อนเวลาเริ่มเคอร์ฟิวล่วงหน้ามาก ๆ",
    ],
    sections: [
      {
        heading: "หากคุณอยู่ในมหาวิทยาลัย",
        items: [
          "ปฏิบัติตามคำแนะนำของเจ้าหน้าที่คณะและเจ้าหน้าที่รักษาความปลอดภัยของมหาวิทยาลัย",
          "เคลื่อนตัวออกห่างจากประตูทางเข้า ถนนสายหลัก และลานเปิดโล่ง หากมีสัญญาณว่ากำลังมีคนมารวมตัวกันบริเวณใกล้เคียง",
          "อย่าเดินไปดูบริเวณสนามหลวงหรือจุดชุมนุมอื่น ๆ เพียงเพราะอยากรู้ว่าเกิดอะไรขึ้น",
          "รอฟังประกาศทางการจากคณะรัฐศาสตร์หรือมหาวิทยาลัยธรรมศาสตร์ก่อนออกจากมหาวิทยาลัย หากสถานการณ์ภายนอกยังไม่ชัดเจน",
        ],
      },
      {
        heading: "หากคุณอยู่นอกมหาวิทยาลัยหรือที่พัก",
        items: [
          "อยู่ในที่พักของคุณ เว้นแต่จะได้รับคำสั่งอพยพอย่างเป็นทางการ",
          "เตรียมชุดของใช้ฉุกเฉินขนาดเล็ก เช่น น้ำดื่ม อาหารว่าง ไฟฉาย ยาที่จำเป็น สายชาร์จโทรศัพท์ และสำเนาเอกสารสำคัญ",
          "ลดการเดินทางที่ไม่จำเป็น โดยเฉพาะช่วงกลางคืนหรือใกล้เวลาเคอร์ฟิว",
          "หากจำเป็นต้องออกจากที่พัก ให้แจ้งเส้นทางและเวลาที่คาดว่าจะกลับให้คนใกล้ตัวทราบ",
        ],
      },
      {
        heading: "การติดตามข้อมูลข่าวสาร",
        items: [
          "ติดตามเพจเฟซบุ๊กและเว็บไซต์ทางการของมหาวิทยาลัยธรรมศาสตร์และคณะรัฐศาสตร์ เพื่อดูประกาศเกี่ยวกับการเรียนการสอนและการเข้าใช้พื้นที่มหาวิทยาลัย",
          "ติดตามประกาศทางการของรัฐบาลไทยเกี่ยวกับมาตรการระดับประเทศ เช่น เคอร์ฟิวหรือพื้นที่ควบคุม",
          "ใช้วิจารณญาณกับข้อมูลบนโซเชียลมีเดีย ข่าวลือที่ยังไม่ได้รับการยืนยันสามารถแพร่กระจายอย่างรวดเร็วในช่วงสถานการณ์ไม่แน่นอน ควรตรวจสอบกับแหล่งข้อมูลทางการก่อนเชื่อหรือแชร์ต่อ",
          "ติดต่อครอบครัวเป็นระยะเพื่อให้พวกเขารู้ว่าคุณปลอดภัย",
        ],
      },
      {
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "ติดต่อสถานทูตหรือสถานกงสุลของคุณในกรุงเทพฯ และปฏิบัติตามคำแนะนำของสถานทูต",
          "ลงทะเบียนการพำนักในประเทศไทยกับระบบแจ้งการเดินทางของประเทศคุณ หากมีบริการดังกล่าว (เช่น โครงการ STEP ของสหรัฐฯ หรือบริการคำแนะนำการเดินทางของสหราชอาณาจักร) เพื่อให้สถานทูตสามารถติดต่อคุณได้",
          "ตรวจสอบระดับคำเตือนการเดินทางของประเทศคุณสำหรับประเทศไทยอย่างสม่ำเสมอ เนื่องจากอาจเปลี่ยนแปลงได้ในช่วงสถานการณ์ไม่แน่นอน",
          "เก็บพาสปอร์ตและเอกสารวีซ่าไว้ในที่ที่หยิบใช้ได้สะดวก และจดจำที่ตั้งและช่องทางติดต่อสถานทูตของคุณในกรุงเทพฯ",
          "กองงานวิเทศสัมพันธ์ (OIA) ของธรรมศาสตร์สามารถช่วยเรื่องที่เกี่ยวข้องกับมหาวิทยาลัยได้ ส่วนเรื่องกงสุล เช่น เอกสารสูญหาย คำแนะนำการอพยพ หรือความปลอดภัยส่วนตัว ให้ติดต่อสถานทูตของคุณโดยตรง",
        ],
      },
      {
        heading: "สิ่งที่ไม่ควรทำ",
        items: [
          "อย่าไปมุงดู ถ่ายภาพ หรือไลฟ์สตรีมการชุมนุม จุดตรวจ หรือปฏิบัติการของเจ้าหน้าที่ด้วยความอยากรู้อยากเห็น",
          "อย่าแชร์ข้อมูลหรือข่าวลือที่ยังไม่ได้รับการยืนยัน",
          "อย่าพยายามฝ่าจุดตรวจ พื้นที่ควบคุม หรือฝ่าฝืนเคอร์ฟิวเพื่อประหยัดเวลา",
          "หลีกเลี่ยงการแสดงความเห็นต่อสาธารณะในลักษณะที่อาจตีความว่าเป็นการเลือกฝ่ายทางการเมือง คำแนะนำนี้ว่าด้วยความปลอดภัย ไม่ใช่เรื่องการเมือง",
        ],
      },
      {
        heading: "เมื่อสถานการณ์คลี่คลาย",
        items: [
          "ติดตามช่องทางทางการของธรรมศาสตร์และรัฐบาลอย่างต่อเนื่องเพื่อยืนยันว่ากิจกรรมกลับสู่ภาวะปกติแล้ว ก่อนกลับไปใช้ชีวิตตามปกติ",
          "ตารางเรียน กำหนดส่งงาน และการสอบอาจมีการเปลี่ยนแปลง อย่าเข้าใจเองว่าทุกอย่างจะกลับมาเป็นปกติทันที ให้ตรวจสอบประกาศจากคณะอย่างเป็นทางการ",
          "แจ้งครอบครัวและสถานทูต (ถ้าเกี่ยวข้อง) ว่าคุณปลอดภัยแล้ว",
        ],
      },
    ],
    extraContacts: [
      {
        label: "สายด่วนความปลอดภัยและภัยพิบัติ ปภ. (24 ชั่วโมง) (LINE: @1784DDPM)",
        value: "1784",
        href: "tel:1784",
      },
      {
        label: "ตำรวจท่องเที่ยว (พูดภาษาอังกฤษ, 24 ชั่วโมง)",
        value: "1155",
        href: "tel:1155",
      },
      {
        label: "สำนักงานคณะรัฐศาสตร์",
        value: "02-221-6111 ต่อ 3400",
        href: "tel:022216111",
      },
      {
        label: "สำนักงานโครงการ BIR",
        value: "02-221-6111 ต่อ 3409",
        href: "tel:022216111",
      },
      {
        label: "สำนักงานโครงการ BIR (อีเมล)",
        value: "bir@tu.ac.th",
        href: "mailto:bir@tu.ac.th",
      },
      {
        label: "กองงานวิเทศสัมพันธ์ (OIA) มหาวิทยาลัยธรรมศาสตร์",
        value: "info.inter@tu.ac.th",
        href: "mailto:info.inter@tu.ac.th",
      },
    ],
  },
};

export default coup;
