import type { EmergencyScenario } from "@/content/emergency/types";

const earthquake: EmergencyScenario = {
  id: "earthquake",
  severity: "critical",
  en: {
    bannerMessage: "Earthquake shaking may be felt in Bangkok. Drop, cover, and hold on.",
    title: "Earthquake",
    lede: "Thailand is not a high-earthquake country, but Bangkok's soft soil can amplify shaking from large, distant earthquakes, as happened in March 2025. In tall buildings the sway can feel strong even when the epicentre is far away. Knowing what to do keeps you safe.",
    immediateActions: [
      "Drop where you are, onto your hands and knees, before the shaking knocks you down.",
      "Cover your head and neck with your arms. If you can, get under a sturdy desk or table.",
      "Hold on to your shelter, or to your head and neck, until the shaking stops.",
      "Stay away from windows, glass, mirrors, and tall furniture or shelving that could fall.",
      "Do not run outside and do not use lifts while the building is shaking.",
    ],
    sections: [
      {
        heading: "If you are inside a building",
        items: [
          "Drop, cover, and hold on immediately. Get under a sturdy desk or table if one is nearby.",
          "If there is no shelter, move to an interior wall away from windows, and cover your head and neck with your arms.",
          "In a high-rise, expect the building to sway, sometimes for longer than the ground shaking itself. This is normal for a well-built tall building and does not mean it is about to collapse.",
          "Do not use lifts during or immediately after shaking, in case of power loss or damage.",
        ],
      },
      {
        heading: "If you are outdoors",
        items: [
          "Move away from buildings, walls, glass, and overhead power lines, since falling debris is the main danger outdoors.",
          "Find an open area if possible and stay there, in a crouched position, until the shaking stops.",
          "If you are driving, pull over away from buildings, bridges, and overpasses, and stay in the vehicle with your seatbelt on until shaking stops.",
        ],
      },
      {
        heading: "Evacuating safely",
        items: [
          "Wait until the shaking has completely stopped before moving.",
          "Use the stairs, not lifts, to leave the building.",
          "Watch for hazards as you move: fallen debris, cracked stairs, broken glass, and damaged handrails.",
          "Expect aftershocks. They can happen minutes, hours, or days later and can also cause damage, so stay alert once you are in a safe, open area.",
        ],
      },
      {
        heading: "After it passes",
        items: [
          "Check yourself and people near you for injuries before checking anything else.",
          "If you smell gas, see sparking wires, or see structural damage such as large cracks, leave the building and report it. Do not re-enter a building you suspect is damaged.",
          "Follow official updates from Thammasat University and Bangkok authorities on when it is safe to return to buildings.",
          "Keep your phone charged where possible, since networks can be congested after a large earthquake.",
        ],
      },
      {
        heading: "For international students",
        items: [
          "Thailand's national alert for the March 2025 Myanmar earthquake showed that even a distant, powerful earthquake can be strongly felt in Bangkok high-rises and, in rare cases, cause serious structural damage. Take shaking seriously even if you are used to living in a low-earthquake country.",
          'Learn where the stairwells are in the buildings you use most, and practise "drop, cover, and hold on" mentally so it becomes automatic.',
          "Save Thailand's emergency numbers in your phone now.",
        ],
      },
    ],
    extraContacts: [
      { label: "Police / general emergency", value: "191", href: "tel:191" },
      { label: "Medical emergency (EMS, national)", value: "1669", href: "tel:1669" },
      { label: "Department of Disaster Prevention and Mitigation (DDPM)", value: "1784", href: "tel:1784" },
      { label: "Bangkok Erawan Emergency Medical Service", value: "1646", href: "tel:1646" },
    ],
  },
  th: {
    bannerMessage: "อาจรู้สึกถึงแรงสั่นสะเทือนจากแผ่นดินไหวในกรุงเทพฯ ให้หมอบ ป้อง เกาะ ทันที",
    title: "แผ่นดินไหว",
    lede: "ประเทศไทยไม่ใช่พื้นที่เสี่ยงแผ่นดินไหวสูง แต่ชั้นดินอ่อนของกรุงเทพฯ สามารถขยายแรงสั่นสะเทือนจากแผ่นดินไหวขนาดใหญ่ที่อยู่ไกลออกไปได้ ดังที่เกิดขึ้นในเดือนมีนาคม 2568 อาคารสูงอาจรู้สึกโยกแรงแม้ศูนย์กลางแผ่นดินไหวจะอยู่ไกล การรู้วิธีปฏิบัติตัวจะช่วยให้ปลอดภัย",
    immediateActions: [
      "หมอบลงกับพื้นทันทีบนมือและเข่า ก่อนที่แรงสั่นจะทำให้ล้ม",
      "ป้องกันศีรษะและคอด้วยแขน หากทำได้ให้เข้าไปหลบใต้โต๊ะที่แข็งแรง",
      "เกาะโต๊ะหรือที่หลบภัยไว้ หรือใช้มือป้องกันศีรษะและคอ จนกว่าแรงสั่นจะหยุด",
      "อยู่ห่างจากหน้าต่าง กระจก และเฟอร์นิเจอร์หรือชั้นวางของสูงที่อาจล้มทับ",
      "ห้ามวิ่งออกนอกอาคารและห้ามใช้ลิฟต์ขณะที่อาคารกำลังสั่น",
    ],
    sections: [
      {
        heading: "หากอยู่ในอาคาร",
        items: [
          "หมอบ ป้อง เกาะ ทันที หากมีโต๊ะที่แข็งแรงอยู่ใกล้ ให้เข้าไปหลบใต้โต๊ะ",
          "หากไม่มีที่หลบ ให้ย้ายไปอยู่ชิดผนังด้านในที่ห่างจากหน้าต่าง และใช้แขนป้องกันศีรษะและคอ",
          "ในอาคารสูง อาคารอาจโยกไปมา บางครั้งนานกว่าช่วงที่พื้นดินสั่นจริง ถือเป็นเรื่องปกติของอาคารสูงที่ก่อสร้างได้มาตรฐาน ไม่ได้หมายความว่าอาคารกำลังจะถล่ม",
          "ห้ามใช้ลิฟต์ระหว่างหรือทันทีหลังแผ่นดินไหว เนื่องจากไฟฟ้าอาจดับหรือลิฟต์อาจเสียหาย",
        ],
      },
      {
        heading: "หากอยู่กลางแจ้ง",
        items: [
          "เดินออกห่างจากอาคาร กำแพง กระจก และสายไฟฟ้าเหนือศีรษะ เพราะอันตรายหลักกลางแจ้งคือเศษวัสดุที่ร่วงหล่นลงมา",
          "หาพื้นที่โล่งหากทำได้ และอยู่ในท่าหมอบต่ำจนกว่าแรงสั่นจะหยุด",
          "หากกำลังขับรถ ให้จอดรถห่างจากอาคาร สะพาน และทางยกระดับ และอยู่ในรถโดยคาดเข็มขัดนิรภัยจนกว่าแรงสั่นจะหยุด",
        ],
      },
      {
        heading: "การอพยพอย่างปลอดภัย",
        items: [
          "รอจนกว่าแรงสั่นจะหยุดสนิทก่อนเคลื่อนที่",
          "ใช้บันไดออกจากอาคาร ห้ามใช้ลิฟต์",
          "สังเกตอันตรายระหว่างเดิน เช่น เศษวัสดุที่ร่วงหล่น บันไดที่แตกร้าว กระจกแตก และราวบันไดที่ชำรุด",
          "เตรียมรับมือกับอาฟเตอร์ช็อก ซึ่งอาจเกิดขึ้นภายในไม่กี่นาที ชั่วโมง หรือหลายวันหลังจากนั้น และอาจสร้างความเสียหายเพิ่มเติมได้ จึงควรตื่นตัวแม้จะอยู่ในที่ปลอดภัยและโล่งแล้ว",
        ],
      },
      {
        heading: "หลังเหตุแผ่นดินไหว",
        items: [
          "ตรวจสอบอาการบาดเจ็บของตนเองและผู้ที่อยู่ใกล้ก่อนสิ่งอื่นใด",
          "หากได้กลิ่นแก๊ส เห็นสายไฟช็อต หรือเห็นความเสียหายของโครงสร้าง เช่น รอยร้าวขนาดใหญ่ ให้ออกจากอาคารและแจ้งเหตุทันที ห้ามกลับเข้าไปในอาคารที่สงสัยว่าเสียหาย",
          "ติดตามประกาศอย่างเป็นทางการจากมหาวิทยาลัยธรรมศาสตร์และหน่วยงานกรุงเทพมหานคร ว่าเมื่อใดจึงจะปลอดภัยที่จะกลับเข้าอาคาร",
          "พยายามชาร์จโทรศัพท์ให้พร้อมใช้งานเมื่อทำได้ เนื่องจากเครือข่ายโทรศัพท์อาจแออัดหลังเกิดแผ่นดินไหวขนาดใหญ่",
        ],
      },
      {
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "เหตุแผ่นดินไหวที่เมียนมาในเดือนมีนาคม 2568 แสดงให้เห็นว่าแม้แผ่นดินไหวขนาดใหญ่ที่อยู่ไกลออกไปก็สามารถรู้สึกได้ชัดเจนในอาคารสูงของกรุงเทพฯ และในบางกรณีอาจสร้างความเสียหายต่อโครงสร้างอย่างร้ายแรง จึงควรให้ความสำคัญกับแรงสั่นสะเทือนอย่างจริงจัง แม้จะคุ้นเคยกับการอยู่ในประเทศที่มีแผ่นดินไหวน้อย",
          "จดจำตำแหน่งบันไดในอาคารที่ใช้งานบ่อย และฝึกนึกถึงขั้นตอน \"หมอบ ป้อง เกาะ\" ให้กลายเป็นความเคยชิน",
          "บันทึกเบอร์ฉุกเฉินของประเทศไทยไว้ในโทรศัพท์ตั้งแต่วันนี้",
        ],
      },
    ],
    extraContacts: [
      { label: "ตำรวจ / เหตุฉุกเฉินทั่วไป", value: "191", href: "tel:191" },
      { label: "การแพทย์ฉุกเฉิน (ทั่วประเทศ)", value: "1669", href: "tel:1669" },
      { label: "กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)", value: "1784", href: "tel:1784" },
      { label: "ศูนย์เอราวัณ บริการการแพทย์ฉุกเฉินกรุงเทพมหานคร", value: "1646", href: "tel:1646" },
    ],
  },
};

export default earthquake;
