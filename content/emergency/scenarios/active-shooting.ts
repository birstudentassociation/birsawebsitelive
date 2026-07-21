import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Active threat on campus (armed attacker). Defensive, victim-protective
 * guidance only: Run, Hide, Fight (last resort), and what to do when police
 * arrive. Based on CISA/Ready.gov Run, Hide, Fight guidance, adapted for
 * Thailand's emergency numbers.
 */
const activeShooting: EmergencyScenario = {
  id: "active-shooting",
  severity: "critical",
  en: {
    bannerMessage: "Active threat on campus: Run, Hide, Fight. Call 191 when it is safe to do so.",
    title: "Active Threat on Campus: Run, Hide, Fight",
    lede: "If someone with a weapon is attacking people on or near campus, your safety comes first. Follow Run, Hide, Fight, in that order of preference, and call the police on 191 as soon as you safely can.",
    immediateActions: [
      "If you can get away safely, run. Leave your belongings behind.",
      "If you cannot run, hide. Lock or barricade the door and stay silent.",
      "Call 191 (police) as soon as you are safe. Give your location and a description of the threat.",
      "Silence your phone, including vibrate, once you are hidden.",
      "Only as an absolute last resort, if your life is in immediate danger and you have no other option, act to protect yourself.",
    ],
    sections: [
      {
        heading: "Run",
        items: [
          "Have an exit route and plan in mind. Move away from the source of danger, not toward it.",
          "Leave your belongings, including bags and laptops. They are not worth the delay.",
          "Keep your hands visible as you move, so arriving officers can see you are not a threat.",
          "Help others escape if you can do so safely, but do not let helping others put you at greater risk.",
          "Do not stop to move injured people if it puts you in danger. Alert emergency services to their location once you are safe.",
          "Once you are safe, call 191 (police). Stay on the line and follow the operator's instructions.",
        ],
      },
      {
        heading: "Hide",
        items: [
          "Use this option only if running is not safe.",
          "Get out of the attacker's view. Move behind solid objects that can stop a bullet, such as thick walls or concrete pillars, not just a locked door alone.",
          "Lock and barricade the door with whatever is available: desks, chairs, cabinets.",
          "Close blinds or curtains and turn off the lights.",
          "Silence your phone completely, including vibration, and stay quiet.",
          "Do not open the door for anyone until you are certain it is safe. Police will identify themselves clearly.",
          "If you can safely and quietly call 191, do so and describe your location. If speaking is not safe, many phones let you send a text or stay on a silent line so the operator can still hear.",
        ],
      },
      {
        heading: "Fight (last resort)",
        items: [
          "This is a last resort, only when you are in immediate danger and running or hiding is not possible.",
          "The goal is to protect yourself and create a chance to escape, not to confront or pursue anyone.",
          "Commit fully to protecting yourself and get away as soon as you can.",
          "This guidance does not include any weapon or tactical instruction. Your only goal is to get to safety.",
        ],
      },
      {
        heading: "When police arrive",
        items: [
          "Stay calm. Remain where you are or follow officers' shouted instructions immediately.",
          "Drop anything in your hands.",
          "Raise your hands, keep your fingers spread, and keep your hands visible at all times.",
          "Avoid sudden movements, pointing, screaming, or running toward officers.",
          "Do not stop to ask officers for help or directions. Their first priority is to end the threat. Follow them out or move to the exit they indicate.",
          "Once you are in a safe location, wait for instructions from police or emergency responders before contacting others.",
        ],
      },
    ],
    extraContacts: [
      { label: "Police / general emergency", value: "191", href: "tel:191" },
      { label: "Tourist Police (English-language support)", value: "1155", href: "tel:1155" },
      { label: "Medical emergency (national ambulance, EMS)", value: "1669", href: "tel:1669" },
      {
        label: "Bangkok Erawan Medical Centre (Bangkok EMS coordination)",
        value: "1646",
        href: "tel:1646",
      },
    ],
  },
  th: {
    bannerMessage:
      'หากมีเหตุคนร้ายก่อเหตุรุนแรงในมหาวิทยาลัย ให้ยึดหลัก "หนี ซ่อน สู้" และโทรแจ้ง 191 ทันทีที่ปลอดภัย',
    title: "เหตุคนร้ายก่อเหตุรุนแรงในมหาวิทยาลัย: หนี ซ่อน สู้",
    lede: 'หากมีผู้ก่อเหตุใช้อาวุธทำร้ายผู้คนในหรือใกล้มหาวิทยาลัย ความปลอดภัยของคุณสำคัญที่สุด ให้ปฏิบัติตามหลัก "หนี ซ่อน สู้" ตามลำดับความสำคัญ และโทรแจ้งตำรวจที่หมายเลข 191 ทันทีที่ทำได้อย่างปลอดภัย',
    immediateActions: [
      "หากสามารถหนีออกจากพื้นที่ได้อย่างปลอดภัย ให้รีบหนีทันที ทิ้งข้าวของไว้ไม่ต้องเสียเวลาเก็บ",
      "หากหนีไม่ได้ ให้หาที่ซ่อน ล็อกหรือกั้นประตู และอยู่นิ่ง ๆ เงียบที่สุด",
      "โทรแจ้ง 191 (ตำรวจ) ทันทีที่ปลอดภัย แจ้งตำแหน่งที่อยู่และลักษณะของผู้ก่อเหตุเท่าที่ทราบ",
      "ปิดเสียงโทรศัพท์ รวมถึงโหมดสั่น ทันทีที่ซ่อนตัว",
      "การต่อสู้เป็นทางเลือกสุดท้ายเท่านั้น ใช้เมื่อชีวิตตกอยู่ในอันตรายถึงชีวิตและไม่มีทางเลือกอื่นแล้วเท่านั้น",
    ],
    sections: [
      {
        heading: "หนี",
        items: [
          "นึกเส้นทางหนีและแผนการไว้ล่วงหน้า เคลื่อนที่ออกห่างจากจุดเกิดเหตุ ไม่ใช่เข้าใกล้",
          "ทิ้งข้าวของทุกอย่างไว้ ทั้งกระเป๋าและโน้ตบุ๊ก ไม่คุ้มกับเวลาที่เสียไป",
          "ขณะเคลื่อนที่ให้ยกมือให้เห็นชัดเจน เพื่อให้เจ้าหน้าที่ที่มาถึงรู้ว่าคุณไม่ใช่ผู้ก่อเหตุ",
          "ช่วยผู้อื่นให้หนีได้หากทำได้อย่างปลอดภัย แต่อย่าให้การช่วยเหลือทำให้ตัวเองตกอยู่ในอันตรายมากขึ้น",
          "หากมีผู้บาดเจ็บ อย่าหยุดเคลื่อนย้ายหากทำให้ตัวเองเสี่ยง ให้แจ้งตำแหน่งผู้บาดเจ็บแก่หน่วยกู้ภัยทันทีที่ปลอดภัย",
          "เมื่อปลอดภัยแล้ว โทรแจ้ง 191 (ตำรวจ) อยู่ในสายและปฏิบัติตามคำแนะนำของเจ้าหน้าที่",
        ],
      },
      {
        heading: "ซ่อน",
        items: [
          "ใช้วิธีนี้เมื่อการหนีไม่ปลอดภัยเท่านั้น",
          "หลบให้พ้นสายตาของผู้ก่อเหตุ เลือกที่กำบังที่แข็งแรง เช่น กำแพงหนาหรือเสาคอนกรีต ไม่ใช่แค่ประตูที่ล็อกเพียงอย่างเดียว",
          "ล็อกและกั้นประตูด้วยสิ่งของที่หาได้ เช่น โต๊ะ เก้าอี้ ตู้เอกสาร",
          "ปิดม่านหรือมู่ลี่ และปิดไฟ",
          "ปิดเสียงโทรศัพท์ให้สนิท รวมถึงโหมดสั่น และอยู่ในความเงียบ",
          "อย่าเปิดประตูให้ใครจนกว่าจะแน่ใจว่าปลอดภัย เจ้าหน้าที่ตำรวจจะแสดงตัวอย่างชัดเจน",
          "หากโทร 191 ได้อย่างเงียบและปลอดภัย ให้โทรแจ้งตำแหน่งที่อยู่ หากพูดไม่ได้ โทรศัพท์บางรุ่นส่งข้อความแจ้งเหตุได้ หรือคงสายไว้แบบเงียบเพื่อให้เจ้าหน้าที่รับฟังสถานการณ์",
        ],
      },
      {
        heading: "สู้ (ทางเลือกสุดท้าย)",
        items: [
          "เป็นทางเลือกสุดท้ายเท่านั้น ใช้เมื่ออยู่ในอันตรายถึงชีวิตและไม่สามารถหนีหรือซ่อนตัวได้แล้ว",
          "เป้าหมายคือปกป้องตัวเองและหาจังหวะหนีออกจากสถานการณ์ ไม่ใช่เข้าปะทะหรือไล่ตามผู้ก่อเหตุ",
          "ทุ่มเทเพื่อปกป้องตัวเองอย่างเต็มที่และรีบออกจากพื้นที่ทันทีที่ทำได้",
          "คำแนะนำนี้ไม่มีการสอนใช้อาวุธหรือเทคนิคการต่อสู้ใด ๆ เป้าหมายเดียวคือไปให้ถึงที่ปลอดภัย",
        ],
      },
      {
        heading: "เมื่อตำรวจมาถึง",
        items: [
          "ตั้งสติ อยู่กับที่หรือปฏิบัติตามคำสั่งของเจ้าหน้าที่ทันทีที่ได้ยิน",
          "วางสิ่งของที่ถืออยู่ในมือลง",
          "ยกมือขึ้น กางนิ้วออก และให้มือเห็นชัดเจนตลอดเวลา",
          "หลีกเลี่ยงการเคลื่อนไหวกะทันหัน การชี้นิ้ว การตะโกน หรือการวิ่งเข้าหาเจ้าหน้าที่",
          "อย่าหยุดถามทางหรือขอความช่วยเหลือจากเจ้าหน้าที่ที่กำลังปฏิบัติการ ภารกิจแรกของพวกเขาคือระงับเหตุ ให้เดินตามหรือไปยังจุดที่เจ้าหน้าที่ชี้บอก",
          "เมื่ออยู่ในที่ปลอดภัยแล้ว รอคำแนะนำจากตำรวจหรือหน่วยกู้ภัยก่อนติดต่อผู้อื่น",
        ],
      },
    ],
    extraContacts: [
      { label: "ตำรวจ / เหตุฉุกเฉินทั่วไป", value: "191", href: "tel:191" },
      { label: "ตำรวจท่องเที่ยว (ให้ความช่วยเหลือภาษาอังกฤษ)", value: "1155", href: "tel:1155" },
      { label: "การแพทย์ฉุกเฉิน (รถพยาบาลทั่วประเทศ)", value: "1669", href: "tel:1669" },
      {
        label: "ศูนย์เอราวัณ กรุงเทพมหานคร (ประสานงานการแพทย์ฉุกเฉินในกรุงเทพฯ)",
        value: "1646",
        href: "tel:1646",
      },
    ],
  },
};

export default activeShooting;
