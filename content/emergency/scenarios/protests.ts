import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Protests and crowds near campus: strictly apolitical, safety-only guidance.
 * Transcribed from the researched dossier. Does not take, or imply, any
 * political position.
 */
const protests: EmergencyScenario = {
  id: "protests",
  severity: "warning",
  en: {
    bannerMessage:
      "A demonstration has been reported near campus. Avoid the area and leave calmly if you are nearby.",
    title: "Protests and Crowds Near Campus: Staying Safe",
    lede: "Tha Prachan campus sits close to Sanam Luang and other places sometimes used for public gatherings. This is safety guidance only.",
    immediateActions: [
      "If you see or hear a crowd forming, move away calmly in the opposite direction. Do not walk toward it to look.",
      "Leave the area early rather than waiting to see what happens.",
      "Head to a safe indoor space: a classroom building, the library, or a nearby shop or café away from the gathering.",
      "Tell someone (a friend, housemate, or family member) where you are and that you are safe.",
      "Check official Thammasat and Faculty channels before deciding whether to go to, or stay on, campus.",
      "Keep your phone charged and your student ID or passport with you.",
    ],
    sections: [
      {
        heading: "If you are on campus",
        items: [
          "Move indoors and away from gates, courtyards, and the riverside promenade if a crowd is forming nearby.",
          "Follow instructions from faculty staff and security.",
          "Avoid gathering at windows or gates to watch what is happening outside.",
          "If class is in session and a situation develops outside, wait for guidance from your instructor or the faculty before leaving the building.",
        ],
      },
      {
        heading: "If you are off campus or at home",
        items: [
          "If you are heading toward campus and hear of a demonstration nearby, change your route or postpone your trip.",
          "Use a different route home if your normal route passes near Sanam Luang or another gathering point. Consider the Chao Phraya Express boat, alternative piers such as Wang Lang or Tha Chang, or side streets away from the main crowd routes.",
          "Avoid the main roads immediately around Sanam Luang, Ratchadamnoen, and the Grand Palace area when a gathering is reported there.",
        ],
      },
      {
        heading: "If you get caught in a crowd",
        items: [
          "Stay calm. Do not run or push. Move steadily toward the edges of the crowd, not the middle.",
          "Move in the same general direction as the crowd flow rather than against it, while working your way toward open side streets.",
          "Keep away from barricades, security lines, and any point where two groups are facing each other.",
          "If the crowd becomes dense, keep your arms crossed in front of your chest for protection and move diagonally, not straight across, to reach the edge.",
          "If a chemical irritant such as tear gas is used, move upwind, cover your nose and mouth with a cloth, avoid rubbing your eyes, and get to fresh air as soon as possible. Once safe, flush your eyes and skin with clean water and remove affected clothing if you can.",
          "Once clear, go to a safe indoor location and let someone know you are okay.",
        ],
      },
      {
        heading: "Basic first aid for crowd-related injuries",
        items: [
          "Minor cuts or scrapes: clean with water, cover with a clean cloth or bandage, and seek proper first aid or medical care when it is safe to do so.",
          "Someone who has fainted or is struggling to breathe in a crowd: help them to open space with fresh air, loosen tight clothing, and call 1669 (EMS) if they do not recover quickly.",
          "Chemical irritant exposure to eyes or skin: flush with plenty of clean water for several minutes, avoid rubbing, and seek medical attention if irritation continues.",
          "This is general awareness only, not a substitute for first aid training or professional medical care. For any serious injury, call 1669 immediately.",
        ],
      },
      {
        heading: "Staying informed",
        items: [
          "Follow Thammasat University's and the Faculty of Political Science's official Facebook pages for real-time updates on campus access and class arrangements.",
          "Follow Royal Thai Police and Bangkok Metropolitan Administration announcements about planned demonstrations and road closures.",
          "Check traffic and transit apps before heading out if a gathering has been announced nearby.",
        ],
      },
      {
        heading: "For international students",
        items: [
          "Avoid demonstrations even as an observer. Being a bystander can still carry legal or physical risk.",
          "Contact your embassy if you have concerns and follow their guidance.",
          "Keep your passport and visa documents accessible in case you need to show identification.",
          "Monitor your government's travel advisory, which is sometimes updated during periods of unrest.",
        ],
      },
      {
        heading: "What not to do",
        items: [
          "Do not join, photograph up close, or livestream a demonstration out of curiosity.",
          "Do not argue or engage with anyone on any side of a demonstration.",
          "Do not walk through or linger near a security checkpoint or line.",
          "Do not share unverified rumours about violence or arrests. Confirm with official sources first.",
        ],
      },
      {
        heading: "When it is over",
        items: [
          "Wait for confirmation from official channels that the area is clear before resuming your normal route.",
          "Report any lost items or safety concerns to the appropriate office once it is safe to do so.",
        ],
      },
    ],
    extraContacts: [
      {
        label: "Royal Thai Police / general emergency",
        value: "191",
        href: "tel:191",
      },
      {
        label: "Medical emergency (EMS / Narenthorn)",
        value: "1669",
        href: "tel:1669",
      },
      {
        label: "Bangkok Erawan EMS Center",
        value: "1646",
        href: "tel:1646",
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
    ],
  },
  th: {
    bannerMessage: "มีรายงานการชุมนุมใกล้มหาวิทยาลัย ขอให้หลีกเลี่ยงพื้นที่และเดินทางออกอย่างสงบ",
    title: "ความปลอดภัยเมื่อมีการชุมนุมหรือฝูงชนใกล้มหาวิทยาลัย",
    lede: "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ ตั้งอยู่ใกล้สนามหลวงและพื้นที่ที่บางครั้งใช้เป็นจุดชุมนุมสาธารณะ เนื้อหานี้เป็นคำแนะนำด้านความปลอดภัยเท่านั้น",
    immediateActions: [
      "หากเห็นหรือได้ยินว่ามีฝูงชนกำลังรวมตัว ให้เดินออกไปในทิศทางตรงข้ามอย่างสงบ อย่าเดินเข้าไปดู",
      "ออกจากพื้นที่แต่เนิ่น ๆ ดีกว่ารอดูว่าจะเกิดอะไรขึ้น",
      "ไปยังพื้นที่ปลอดภัยในร่ม เช่น อาคารเรียน ห้องสมุด หรือร้านค้า/ร้านกาแฟที่อยู่ห่างจากจุดชุมนุม",
      "แจ้งคนใกล้ตัว (เพื่อน เพื่อนร่วมหอ ครอบครัว) ว่าคุณอยู่ที่ไหนและปลอดภัยดี",
      "ตรวจสอบช่องทางทางการของธรรมศาสตร์และคณะก่อนตัดสินใจว่าจะไปหรืออยู่ในมหาวิทยาลัยต่อ",
      "ชาร์จโทรศัพท์ให้พร้อมและพกบัตรนักศึกษาหรือพาสปอร์ตติดตัว",
    ],
    sections: [
      {
        heading: "หากคุณอยู่ในมหาวิทยาลัย",
        items: [
          "เข้าไปในอาคารและอยู่ห่างจากประตู ลานกิจกรรม และทางเดินริมแม่น้ำ หากมีฝูงชนกำลังรวมตัวใกล้เคียง",
          "ปฏิบัติตามคำแนะนำของเจ้าหน้าที่คณะและเจ้าหน้าที่รักษาความปลอดภัย",
          "อย่ามุงดูที่หน้าต่างหรือประตูเพื่อดูสถานการณ์ภายนอก",
          "หากกำลังเรียนอยู่และมีสถานการณ์เกิดขึ้นด้านนอก ให้รอฟังคำแนะนำจากอาจารย์หรือคณะก่อนออกจากอาคาร",
        ],
      },
      {
        heading: "หากคุณอยู่นอกมหาวิทยาลัยหรือที่พัก",
        items: [
          "หากกำลังเดินทางมามหาวิทยาลัยและทราบว่ามีการชุมนุมใกล้เคียง ให้เปลี่ยนเส้นทางหรือเลื่อนการเดินทาง",
          "ใช้เส้นทางอื่นกลับบ้านหากเส้นทางปกติผ่านใกล้สนามหลวงหรือจุดชุมนุม เช่น เรือด่วนเจ้าพระยา ท่าเรือวังหลังหรือท่าช้าง หรือถนนซอยที่ห่างจากเส้นทางฝูงชนหลัก",
          "หลีกเลี่ยงถนนสายหลักรอบสนามหลวง ถนนราชดำเนิน และบริเวณพระบรมมหาราชวัง เมื่อมีรายงานการชุมนุมในบริเวณนั้น",
        ],
      },
      {
        heading: "หากติดอยู่ในฝูงชน",
        items: [
          "ตั้งสติ อย่าวิ่งหรือผลักดัน ให้ค่อย ๆ เคลื่อนตัวไปทางขอบของฝูงชน ไม่ใช่เข้าไปตรงกลาง",
          "เคลื่อนที่ไปในทิศทางเดียวกับการไหลของฝูงชน ไม่ใช่ฝืนทิศทาง พร้อมค่อย ๆ ขยับไปยังถนนซอยที่เปิดโล่ง",
          "อยู่ห่างจากแนวกั้น แนวเจ้าหน้าที่ และจุดที่มีกลุ่มคนสองฝ่ายเผชิญหน้ากัน",
          "หากฝูงชนหนาแน่นมาก ให้กอดอกป้องกันหน้าอกและเคลื่อนตัวในแนวทแยง ไม่ใช่ตัดผ่านตรง ๆ เพื่อออกไปยังขอบฝูงชน",
          "หากมีการใช้สารเคมีระคายเคือง เช่น แก๊สน้ำตา ให้เดินทวนลม ใช้ผ้าปิดจมูกและปาก หลีกเลี่ยงการขยี้ตา และรีบไปยังที่ที่มีอากาศบริสุทธิ์โดยเร็วที่สุด เมื่อปลอดภัยแล้วให้ล้างตาและผิวหนังด้วยน้ำสะอาด และถอดเสื้อผ้าที่สัมผัสสารออกหากทำได้",
          "เมื่อออกมาปลอดภัยแล้ว ให้ไปยังที่ปลอดภัยในร่มและแจ้งคนใกล้ตัวว่าคุณปลอดภัย",
        ],
      },
      {
        heading: "การปฐมพยาบาลเบื้องต้นสำหรับอาการบาดเจ็บจากฝูงชน",
        items: [
          "บาดแผลเล็กน้อยหรือรอยขีดข่วน: ล้างด้วยน้ำสะอาด ปิดด้วยผ้าสะอาดหรือผ้าพันแผล และไปรับการปฐมพยาบาลหรือการรักษาที่เหมาะสมเมื่อปลอดภัย",
          "หากมีคนเป็นลมหรือหายใจลำบากในฝูงชน: ช่วยพาไปยังที่โล่งมีอากาศถ่ายเท คลายเสื้อผ้าที่รัดแน่น และโทร 1669 (หน่วยแพทย์ฉุกเฉิน) หากอาการไม่ดีขึ้นอย่างรวดเร็ว",
          "หากสัมผัสสารระคายเคืองที่ตาหรือผิวหนัง: ล้างด้วยน้ำสะอาดปริมาณมากเป็นเวลาหลายนาที หลีกเลี่ยงการขยี้ และไปพบแพทย์หากยังระคายเคืองต่อเนื่อง",
          "ข้อมูลนี้เป็นความรู้เบื้องต้นเท่านั้น ไม่ใช่การฝึกปฐมพยาบาลหรือการรักษาโดยแพทย์ หากมีการบาดเจ็บรุนแรง ให้โทร 1669 ทันที",
        ],
      },
      {
        heading: "การติดตามข้อมูลข่าวสาร",
        items: [
          "ติดตามเพจเฟซบุ๊กทางการของมหาวิทยาลัยธรรมศาสตร์และคณะรัฐศาสตร์ เพื่อรับข้อมูลอัปเดตแบบเรียลไทม์เกี่ยวกับการเข้าใช้พื้นที่มหาวิทยาลัยและการจัดการเรียนการสอน",
          "ติดตามประกาศของสำนักงานตำรวจแห่งชาติและกรุงเทพมหานครเกี่ยวกับการชุมนุมที่วางแผนไว้และการปิดถนน",
          "ตรวจสอบแอปพลิเคชันจราจรและระบบขนส่งก่อนออกเดินทาง หากมีการประกาศว่าจะมีการชุมนุมใกล้เคียง",
        ],
      },
      {
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "หลีกเลี่ยงการเข้าร่วมการชุมนุมแม้ในฐานะผู้สังเกตการณ์ เพราะการอยู่ในที่เกิดเหตุอาจมีความเสี่ยงทั้งด้านกฎหมายและร่างกาย",
          "ติดต่อสถานทูตของคุณหากมีข้อกังวล และปฏิบัติตามคำแนะนำ",
          "พกพาสปอร์ตและเอกสารวีซ่าไว้ในที่หยิบใช้สะดวก เผื่อต้องแสดงตัวตน",
          "ติดตามคำเตือนการเดินทางจากรัฐบาลประเทศของคุณ ซึ่งบางครั้งมีการอัปเดตในช่วงที่มีความไม่สงบ",
        ],
      },
      {
        heading: "สิ่งที่ไม่ควรทำ",
        items: [
          "อย่าเข้าร่วม ถ่ายภาพระยะใกล้ หรือไลฟ์สตรีมการชุมนุมด้วยความอยากรู้อยากเห็น",
          "อย่าโต้เถียงหรือมีปฏิสัมพันธ์กับฝ่ายใดฝ่ายหนึ่งในที่ชุมนุม",
          "อย่าเดินผ่านหรือมัวมุงอยู่ใกล้จุดตรวจหรือแนวเจ้าหน้าที่",
          "อย่าแชร์ข่าวลือที่ยังไม่ได้รับการยืนยันเกี่ยวกับความรุนแรงหรือการจับกุม ให้ตรวจสอบกับแหล่งข้อมูลทางการก่อน",
        ],
      },
      {
        heading: "เมื่อสถานการณ์คลี่คลาย",
        items: [
          "รอการยืนยันจากช่องทางทางการว่าพื้นที่ปลอดภัยแล้ว ก่อนกลับไปใช้เส้นทางตามปกติ",
          "แจ้งของหายหรือข้อกังวลด้านความปลอดภัยต่อหน่วยงานที่เกี่ยวข้องเมื่อปลอดภัยแล้ว",
        ],
      },
    ],
    extraContacts: [
      {
        label: "ตำรวจ/เหตุฉุกเฉินทั่วไป",
        value: "191",
        href: "tel:191",
      },
      {
        label: "หน่วยแพทย์ฉุกเฉิน (EMS/นเรนทร)",
        value: "1669",
        href: "tel:1669",
      },
      {
        label: "ศูนย์เอราวัณ กรุงเทพมหานคร",
        value: "1646",
        href: "tel:1646",
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
    ],
  },
};

export default protests;
