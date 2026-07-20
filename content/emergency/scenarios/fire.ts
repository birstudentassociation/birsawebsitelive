import type { EmergencyScenario } from "@/content/emergency/types";

const fire: EmergencyScenario = {
  id: "fire",
  severity: "critical",
  en: {
    bannerMessage: "There is a fire alert for this building. Leave now by the stairs, do not use lifts.",
    title: "Building Fire",
    lede: "If you see fire or smoke, or hear the fire alarm, act immediately. Fast, calm evacuation is the most important thing you can do to stay safe.",
    immediateActions: [
      "Raise the alarm. If you discover a fire and the alarm has not sounded, activate the nearest fire alarm point and shout to alert others nearby.",
      "Leave immediately by the nearest stairwell. Do not stop to collect belongings.",
      "Do not use lifts. Power can fail or lifts can open onto a floor filled with smoke.",
      "Stay low if there is smoke. Smoke and toxic gases collect near the ceiling first and cause more deaths than flames, so crawl below the smoke line if needed.",
      "Close doors behind you as you leave. This slows the spread of fire and smoke.",
      "Go to the assembly point and stay there. Do not re-enter the building for any reason until officials confirm it is safe.",
    ],
    sections: [
      {
        heading: "If you are inside a building",
        items: [
          "Before opening any door, feel it and the handle with the back of your hand. If it feels hot, or smoke is coming through the gap, do not open it. Use another exit.",
          "Follow illuminated exit signs and staff or fire marshal instructions.",
          "Help anyone nearby who needs assistance evacuating, including anyone with a mobility difficulty, but do not put yourself at serious risk.",
        ],
      },
      {
        heading: "Evacuating safely",
        items: [
          "Walk quickly, do not run or push.",
          "Take the nearest safe stairwell down and out of the building.",
          "Once outside, move well away from the building entrance so you do not block firefighters or other people evacuating.",
          "Go to the designated assembly point so staff can check everyone is accounted for.",
        ],
      },
      {
        heading: "If you are trapped",
        items: [
          "Close the door of the room you are in and, if possible, seal gaps at the bottom with clothing or towels to slow smoke entering.",
          "Move to a window if there is one, open it if you can, and signal for help by waving something bright or shouting.",
          "Call the fire and rescue hotline (199) and tell them your exact location, including floor and room number.",
          "Do not break a window unless you need to for air or to be seen. Broken glass draws smoke in and creates a fall hazard.",
        ],
      },
      {
        heading: "After the fire",
        items: [
          "Do not go back inside the building until fire officials or university staff say it is safe.",
          "Report anyone you believe is still missing to fire crews or staff at the assembly point immediately.",
          "Follow official updates about when classes and building access will resume.",
        ],
      },
      {
        heading: "For international students",
        items: [
          "Learn the location of your building's stairwells and at least two exits on your first week, before you ever need them.",
          "Save the fire and rescue number (199) in your phone now.",
          "If you do not speak Thai, tell nearby staff or classmates clearly if you need help finding the way out, and stay with a group if possible.",
        ],
      },
    ],
    extraContacts: [
      { label: "Fire and rescue (national)", value: "199", href: "tel:199" },
      { label: "Bangkok Erawan Emergency Medical Service (for injuries)", value: "1646", href: "tel:1646" },
    ],
  },
  th: {
    bannerMessage: "อาคารนี้มีการแจ้งเตือนเพลิงไหม้ ให้รีบออกทางบันไดทันที ห้ามใช้ลิฟต์",
    title: "เพลิงไหม้อาคาร",
    lede: "หากพบเพลิงไหม้ ควันไฟ หรือได้ยินสัญญาณเตือนไฟไหม้ ให้รีบดำเนินการทันที การอพยพอย่างรวดเร็วและมีสติคือสิ่งสำคัญที่สุดในการรักษาความปลอดภัย",
    immediateActions: [
      "แจ้งเตือนทันที หากพบเพลิงไหม้แต่สัญญาณเตือนยังไม่ดัง ให้กดสัญญาณแจ้งเหตุเพลิงไหม้ที่ใกล้ที่สุดและตะโกนเตือนผู้อื่นที่อยู่บริเวณนั้น",
      "ออกจากอาคารทันทีทางบันไดที่ใกล้ที่สุด ห้ามหยุดเก็บสิ่งของ",
      "ห้ามใช้ลิฟต์ เพราะไฟฟ้าอาจดับหรือลิฟต์อาจเปิดออกสู่ชั้นที่เต็มไปด้วยควัน",
      "หากมีควัน ให้ก้มตัวต่ำ เพราะควันและก๊าซพิษจะลอยขึ้นสะสมที่เพดานก่อน และเป็นสาเหตุการเสียชีวิตมากกว่าเปลวไฟ หากจำเป็นให้คลานต่ำกว่าระดับควัน",
      "ปิดประตูทุกบานที่ผ่านหลังออกมาแล้ว เพื่อชะลอการลุกลามของไฟและควัน",
      "ไปยังจุดรวมพลและอยู่ที่นั่น ห้ามกลับเข้าไปในอาคารไม่ว่ากรณีใดจนกว่าเจ้าหน้าที่จะยืนยันว่าปลอดภัย",
    ],
    sections: [
      {
        heading: "หากอยู่ในอาคาร",
        items: [
          "ก่อนเปิดประตูทุกครั้ง ให้ใช้หลังมือสัมผัสประตูและลูกบิดก่อน หากรู้สึกร้อนหรือมีควันลอดเข้ามาตามช่องประตู ห้ามเปิด ให้ใช้ทางออกอื่น",
          "ปฏิบัติตามป้ายทางออกฉุกเฉินที่ส่องสว่างและคำแนะนำของเจ้าหน้าที่หรือทีมอพยพ",
          "ช่วยเหลือผู้ที่อยู่ใกล้และต้องการความช่วยเหลือในการอพยพ รวมถึงผู้ที่เคลื่อนไหวลำบาก แต่ต้องไม่ทำให้ตนเองตกอยู่ในความเสี่ยงร้ายแรง",
        ],
      },
      {
        heading: "การอพยพอย่างปลอดภัย",
        items: [
          "เดินให้เร็วแต่ห้ามวิ่งหรือแซงผลักผู้อื่น",
          "ใช้บันไดที่ปลอดภัยและใกล้ที่สุดลงไปจนออกจากอาคาร",
          "เมื่อออกมาแล้ว ให้เดินออกห่างจากทางเข้าอาคาร เพื่อไม่กีดขวางนักดับเพลิงหรือผู้ที่กำลังอพยพคนอื่น",
          "ไปยังจุดรวมพลที่กำหนดไว้ เพื่อให้เจ้าหน้าที่ตรวจนับจำนวนคนได้ครบถ้วน",
        ],
      },
      {
        heading: "หากติดอยู่ในอาคาร",
        items: [
          "ปิดประตูห้องที่อยู่ และหากทำได้ ให้ใช้เสื้อผ้าหรือผ้าขนหนูอุดช่องว่างใต้ประตูเพื่อชะลอควันไม่ให้เข้ามา",
          "หากมีหน้าต่าง ให้ไปที่หน้าต่าง เปิดถ้าเปิดได้ และส่งสัญญาณขอความช่วยเหลือโดยโบกสิ่งของสีสว่างหรือตะโกน",
          "โทรแจ้งสายด่วนดับเพลิงและกู้ภัย (199) และบอกตำแหน่งที่อยู่ให้ชัดเจน รวมถึงชั้นและหมายเลขห้อง",
          "อย่าทุบกระจกหน้าต่างเว้นแต่จำเป็นเพื่ออากาศหายใจหรือให้คนเห็น เพราะกระจกแตกจะดึงควันเข้ามาและเสี่ยงบาดเจ็บจากเศษแก้ว",
        ],
      },
      {
        heading: "หลังเหตุเพลิงไหม้",
        items: [
          "ห้ามกลับเข้าไปในอาคารจนกว่าเจ้าหน้าที่ดับเพลิงหรือเจ้าหน้าที่มหาวิทยาลัยจะยืนยันว่าปลอดภัย",
          "หากคิดว่ามีผู้สูญหาย ให้แจ้งทีมดับเพลิงหรือเจ้าหน้าที่ที่จุดรวมพลทันที",
          "ติดตามประกาศอย่างเป็นทางการว่าการเรียนการสอนและการเข้าใช้อาคารจะกลับมาเป็นปกติเมื่อใด",
        ],
      },
      {
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "จดจำตำแหน่งบันไดและทางออกอย่างน้อยสองทางของอาคารที่เรียนตั้งแต่สัปดาห์แรก ก่อนที่จะต้องใช้จริง",
          "บันทึกเบอร์สายด่วนดับเพลิงและกู้ภัย (199) ไว้ในโทรศัพท์ตั้งแต่วันนี้",
          "หากพูดภาษาไทยไม่ได้ ให้บอกเจ้าหน้าที่หรือเพื่อนที่อยู่ใกล้อย่างชัดเจนหากต้องการความช่วยเหลือในการหาทางออก และพยายามอยู่รวมกับกลุ่มหากทำได้",
        ],
      },
    ],
    extraContacts: [
      { label: "สายด่วนดับเพลิงและกู้ภัย (ทั่วประเทศ)", value: "199", href: "tel:199" },
      {
        label: "ศูนย์เอราวัณ บริการการแพทย์ฉุกเฉินกรุงเทพมหานคร (กรณีบาดเจ็บ)",
        value: "1646",
        href: "tel:1646",
      },
    ],
  },
};

export default fire;
