import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Someone attacking people with a gun or other weapon on or near campus.
 * Follows the Royal Thai Police หนี ซ่อน สู้ (run, hide, fight) advice given
 * after the 2023 Siam Paragon shooting, with UK Counter Terrorism Policing's
 * Run Hide Tell for what to tell the police.
 */
const activeShooting: EmergencyScenario = {
  id: "active-shooting",
  severity: "critical",
  hero: "purple",
  group: "life",
  keyContacts: ["police", "touristPolice", "ambulance"],
  moreContacts: ["erawan", "facultyOffice", "birOffice", "mentalHealth"],
  sources: [
    {
      label: {
        en: "Thai PBS, run, hide, fight explained after the Siam Paragon shooting",
        th: "ไทยพีบีเอส เปิดกลวิธี หนี ซ่อน สู้ เอาตัวรอดเหตุกราดยิง",
      },
      href: "https://www.thaipbs.or.th/news/content/332421",
    },
    {
      label: {
        en: "Bangkok Biz News, Royal Thai Police commissioner on run, hide, fight",
        th: "กรุงเทพธุรกิจ ผบ.ตร. ย้ำให้ความรู้ประชาชนเรื่อง หนี ซ่อน สู้",
      },
      href: "https://www.bangkokbiznews.com/politics/1098101",
    },
    {
      label: {
        en: "ProtectUK, Run Hide Tell",
        th: "ProtectUK แนวทาง Run Hide Tell ของตำรวจอังกฤษ",
      },
      href: "https://www.protectuk.police.uk/advice-and-guidance/response/run-hide-tell",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Attack with a weapon",
    summary:
      "What to do if someone is attacking people with a gun, knife or other weapon on or near campus. Thai police teach the same three steps as police worldwide. Run, hide, and fight only as a last resort.",
    banner:
      "Police are responding to an attack near campus. Get away if you can, or hide. Call 191 when it is safe.",
    now: [
      "Run if there is a safe way out. Leave your belongings behind.",
      "If you cannot get out, hide. Lock or block the door, turn off the lights and put your phone on silent, with vibrate off too.",
      "Call 191 when it is safe to do so, or 1155 in English.",
      "Only if your life is in immediate danger and you cannot run or hide, fight back with others.",
    ],
    sections: [
      {
        id: "run",
        heading: "Run",
        items: [
          "Move away from the sound of the attack, not towards it. Use any exit, including fire exits and ground-floor windows.",
          "Leave bags, laptops and everything else. Do not stop to film.",
          "Take others with you, but do not wait for people who will not come.",
          "Keep your hands empty and visible as you go, so police do not mistake you for the attacker.",
          "Warn other people away from the area once you are out.",
        ],
      },
      {
        id: "hide",
        heading: "Hide",
        items: [
          "Choose a room you can lock, away from the door. Barricade it with desks and cabinets.",
          "Get behind something solid, such as a concrete wall or pillar. A closed door alone will not stop a bullet. If you can see the attacker, they may be able to see you.",
          "Turn off the lights, close blinds and stay silent.",
          "Put your phone on silent and turn off vibrate.",
          "Stay hidden until police tell you it is safe. Do not open the door to anyone who knocks, even if they say they are police, unless you are sure.",
        ],
      },
      {
        id: "tell",
        heading: "Tell the police",
        body: [
          "Call 191 when you can do it safely, or 1155 for English. If you cannot speak, stay on the line so the operator can listen. Tell them what you can.",
        ],
        items: [
          "Where you are and where the attacker is, or where you last saw them go.",
          "How many attackers and what they look like, including clothes and weapons.",
          "How many people are hurt, and where.",
          "How to get into the building and which exits are open.",
        ],
      },
      {
        id: "fight",
        heading: "Fight, only as a last resort",
        body: [
          "If the attacker reaches you and there is no way to run or hide, act together with the people around you and commit fully. Use whatever is at hand, such as a chair or a fire extinguisher, to stop the attack and get away.",
        ],
      },
      {
        id: "when-police-arrive",
        heading: "When police arrive",
        items: [
          "Officers will go straight towards the danger and may not stop to help the injured at first.",
          "Drop anything you are holding. Keep your hands raised and your fingers spread.",
          "Do not run towards officers, shout, point or grab at them.",
          "Do exactly what they tell you. You may be searched or held until they know who you are.",
        ],
      },
      {
        id: "afterwards",
        heading: "Afterwards",
        items: [
          "Tell your family and friends you are safe by message. Keep phone lines free.",
          "Do not share photos or videos of the scene or of people who were hurt. They can help an attacker, hurt families and spread false information.",
          "Many people have strong reactions for days or weeks afterwards. The mental health hotline on 1323 is open at all hours.",
        ],
      },
    ],
  },
  th: {
    title: "เหตุคนร้ายใช้อาวุธทำร้ายผู้คน",
    summary:
      "สิ่งที่ต้องทำเมื่อมีคนร้ายใช้ปืน มีด หรืออาวุธอื่นทำร้ายผู้คนในหรือใกล้มหาวิทยาลัย สำนักงานตำรวจแห่งชาติแนะนำหลักเดียวกับตำรวจทั่วโลก คือ หนี ซ่อน และสู้เป็นทางเลือกสุดท้ายเท่านั้น",
    banner:
      "ตำรวจกำลังระงับเหตุคนร้ายใช้อาวุธใกล้มหาวิทยาลัย หนีให้ห่างถ้าทำได้ หรือหาที่ซ่อน โทร 191 เมื่อปลอดภัย",
    now: [
      "หนี ถ้ามีทางออกที่ปลอดภัย ทิ้งของทุกอย่างไว้",
      "ถ้าหนีไม่ได้ ให้ซ่อน ล็อกหรือกั้นประตู ปิดไฟ และปิดเสียงโทรศัพท์รวมถึงระบบสั่น",
      "โทร 191 เมื่อปลอดภัยพอที่จะโทร",
      "สู้ ก็ต่อเมื่อชีวิตตกอยู่ในอันตรายทันทีและไม่มีทางหนีหรือซ่อน โดยร่วมมือกับคนรอบข้าง",
    ],
    sections: [
      {
        id: "run",
        heading: "หนี",
        items: [
          "หนีออกห่างจากทิศที่ได้ยินเสียง อย่าเข้าไปใกล้ ใช้ทางออกไหนก็ได้ รวมถึงทางหนีไฟและหน้าต่างชั้นล่าง",
          "ทิ้งกระเป๋า โน้ตบุ๊ก และของทุกอย่าง อย่าหยุดถ่ายคลิป",
          "ชวนคนอื่นหนีไปด้วย แต่อย่ารอคนที่ไม่ยอมไป",
          "ปล่อยมือให้ว่างและให้เห็นมือตลอด ตำรวจจะได้ไม่เข้าใจผิดว่าคุณเป็นคนร้าย",
          "เมื่อออกมาได้แล้ว ให้เตือนคนอื่นไม่ให้เข้าไปในบริเวณนั้น",
        ],
      },
      {
        id: "hide",
        heading: "ซ่อน",
        items: [
          "เลือกห้องที่ล็อกได้ อยู่ห่างจากประตู แล้วใช้โต๊ะหรือตู้กั้นประตูไว้",
          "หลบหลังสิ่งที่แข็งแรง เช่น ผนังคอนกรีตหรือเสา ประตูที่ปิดอยู่อย่างเดียวกันกระสุนไม่ได้ ถ้าคุณมองเห็นคนร้าย คนร้ายก็อาจมองเห็นคุณ",
          "ปิดไฟ ปิดม่าน และเงียบที่สุด",
          "ปิดเสียงโทรศัพท์และปิดระบบสั่น",
          "ซ่อนอยู่จนกว่าตำรวจจะบอกว่าปลอดภัย อย่าเปิดประตูให้ใครที่มาเคาะ แม้จะอ้างว่าเป็นตำรวจ ถ้ายังไม่แน่ใจ",
        ],
      },
      {
        id: "tell",
        heading: "แจ้งตำรวจ",
        body: [
          "โทร 191 เมื่อปลอดภัยพอที่จะโทร ถ้าพูดไม่ได้ให้ถือสายค้างไว้ให้เจ้าหน้าที่ฟังเสียง แล้วให้ข้อมูลเท่าที่ทำได้",
        ],
        items: [
          "คุณอยู่ที่ไหน และคนร้ายอยู่ที่ไหน หรือเห็นครั้งสุดท้ายว่าไปทางไหน",
          "คนร้ายมีกี่คน รูปร่างหน้าตา เสื้อผ้า และอาวุธที่ใช้",
          "มีคนบาดเจ็บกี่คน อยู่ตรงไหน",
          "ทางเข้าอาคาร และทางออกที่ยังใช้ได้",
        ],
      },
      {
        id: "fight",
        heading: "สู้ เป็นทางเลือกสุดท้ายเท่านั้น",
        body: [
          "ถ้าคนร้ายมาถึงตัวและไม่มีทางหนีหรือซ่อนแล้ว ให้ร่วมกับคนรอบข้างสู้อย่างเต็มกำลัง ใช้ของที่หยิบได้ เช่น เก้าอี้หรือถังดับเพลิง เพื่อหยุดคนร้ายและหาทางหนี",
        ],
      },
      {
        id: "when-police-arrive",
        heading: "เมื่อตำรวจมาถึง",
        items: [
          "ตำรวจจะมุ่งไปหาคนร้ายก่อน และอาจยังไม่หยุดช่วยผู้บาดเจ็บในทันที",
          "วางของในมือทั้งหมด ชูมือขึ้นและกางนิ้วให้เห็นชัด",
          "อย่าวิ่งเข้าหาตำรวจ ตะโกน ชี้มือ หรือคว้าตัวตำรวจ",
          "ทำตามที่ตำรวจสั่งทุกอย่าง คุณอาจถูกตรวจค้นหรือกักตัวไว้ก่อนจนกว่าจะยืนยันตัวตนได้",
        ],
      },
      {
        id: "afterwards",
        heading: "หลังเหตุการณ์",
        items: [
          "ส่งข้อความบอกครอบครัวและเพื่อนว่าคุณปลอดภัย เว้นคู่สายโทรศัพท์ไว้",
          "อย่าส่งต่อภาพหรือคลิปที่เกิดเหตุหรือผู้บาดเจ็บ ภาพเหล่านี้อาจเป็นประโยชน์กับคนร้าย ทำร้ายจิตใจครอบครัวผู้สูญเสีย และทำให้ข่าวลือแพร่",
          "หลายคนยังมีอาการทางใจอยู่หลายวันหรือหลายสัปดาห์ โทรสายด่วนสุขภาพจิต 1323 ได้ตลอดเวลา",
        ],
      },
    ],
  },
};

export default activeShooting;
