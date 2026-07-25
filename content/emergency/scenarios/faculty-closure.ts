import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Faculty of Political Science building or programme closure.
 * Transcribed from the researched dossier.
 */
const facultyClosure: EmergencyScenario = {
  id: "faculty-closure",
  severity: "warning",
  en: {
    bannerMessage:
      "The Faculty of Political Science building is closed. Do not come to campus until further notice; check official channels for updates.",
    title: "Faculty of Political Science Closure: What to Do",
    lede: "The Faculty of Political Science building or programme may occasionally close for reasons such as a safety issue, a utilities failure, or another incident.",
    immediateActions: [
      "Do not travel to the faculty building until you have seen an official announcement that it is safe to do so.",
      "Check the Faculty of Political Science's official Facebook page and Thammasat University's official channels for the closure notice and any instructions.",
      "Check your Thammasat email and any course pages (for example Google Classroom or MS Teams links your instructors use) for class-specific instructions.",
      "If you were on your way to campus, turn back or wait at a safe location nearby until you have confirmed information.",
      "If you are currently inside the building when a closure is announced, follow staff instructions and leave calmly by the nearest safe exit.",
    ],
    sections: [
      {
        heading: "How you will be told",
        items: [
          "Official closure notices will be posted on the Faculty of Political Science's website and Facebook page, and on Thammasat University's official channels.",
          "Instructors may also email you directly or post to your course's online platform about changes to a specific class.",
          "Treat only these official channels as authoritative. Do not rely on second-hand messages, unofficial group chats, or rumours for confirmation that the building is closed or reopened.",
        ],
      },
      {
        heading: "Classes, exams, and deadlines",
        items: [
          "Do not assume that a closure automatically cancels or postpones a class, exam, or deadline. Some may move online, some may be rescheduled, and some may continue as planned if alternative arrangements are made.",
          "Check official faculty announcements or contact your instructor directly for each affected class.",
          "If a deadline is approaching and you are unsure whether it still applies, email your instructor or the faculty office rather than assuming either way.",
        ],
      },
      {
        heading: "Accessing services remotely",
        items: [
          "Many administrative matters (transcripts, letters, registration questions) can often be handled by email with the faculty office; check the faculty website for current remote-service options during the closure.",
          "The Direk Jayanama Library's online catalogue and any digital resources remain accessible from off campus if the library building itself is affected.",
          "If you need a specific document or service and are unsure whether it is available remotely, email the relevant office and ask before making a trip to campus.",
        ],
      },
      {
        heading: "Who to contact",
        items: [
          "For programme-specific questions (BIR students): the BIR programme office.",
          "For general faculty administration: the Faculty of Political Science main office.",
          "For matters affecting international students specifically: Thammasat's Office of International Affairs (OIA).",
          "If you have safety concerns for yourself or believe you need emergency help, use the national emergency numbers below rather than waiting for an office to reply to email.",
        ],
      },
      {
        heading: "When it reopens",
        items: [
          "Wait for an official reopening announcement before returning to the building.",
          "Expect a short period of adjustment to class schedules; check announcements rather than assuming everything resumes exactly as before.",
        ],
      },
    ],
    extraContacts: [
      {
        label: "Faculty of Political Science main office",
        value: "02-221-6111 ext. 3400",
        href: "tel:022216111",
      },
      {
        label: "Faculty of Political Science main office (email)",
        value: "polscitu@tu.ac.th",
        href: "mailto:polscitu@tu.ac.th",
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
        label: "Direk Jayanama Library",
        value: "02-221-6111 ext. 3406",
        href: "tel:022216111",
      },
      {
        label: "Office of International Affairs (OIA), Thammasat University",
        value: "info.inter@tu.ac.th",
        href: "mailto:info.inter@tu.ac.th",
      },
      {
        label:
          "DDPM 24-hour safety hotline (for a safety incident such as fire, structural damage, or utilities failure)",
        value: "1784",
        href: "tel:1784",
      },
    ],
  },
  th: {
    bannerMessage:
      "อาคารคณะรัฐศาสตร์ปิดทำการ งดเดินทางมามหาวิทยาลัยจนกว่าจะมีประกาศเพิ่มเติม โปรดติดตามช่องทางทางการ",
    title: "คณะรัฐศาสตร์ปิดทำการ: สิ่งที่ควรทำ",
    lede: "อาคารคณะรัฐศาสตร์หรือการเรียนการสอนของคณะอาจปิดทำการเป็นครั้งคราว ด้วยเหตุผลต่าง ๆ เช่น ปัญหาด้านความปลอดภัย ระบบสาธารณูปโภคขัดข้อง หรือเหตุการณ์อื่น ๆ",
    immediateActions: [
      "อย่าเดินทางมาที่อาคารคณะจนกว่าจะเห็นประกาศทางการยืนยันว่าปลอดภัย",
      "ตรวจสอบเพจเฟซบุ๊กทางการของคณะรัฐศาสตร์และช่องทางทางการของมหาวิทยาลัยธรรมศาสตร์ เพื่อดูประกาศการปิดทำการและคำแนะนำ",
      "ตรวจสอบอีเมลธรรมศาสตร์ของคุณและหน้าวิชาเรียนต่าง ๆ (เช่น Google Classroom หรือ MS Teams ที่อาจารย์ใช้) เพื่อดูคำแนะนำเฉพาะรายวิชา",
      "หากกำลังเดินทางมามหาวิทยาลัยอยู่ ให้กลับหรือรอในที่ปลอดภัยใกล้เคียงจนกว่าจะได้รับข้อมูลที่ยืนยันแล้ว",
      "หากคุณอยู่ในอาคารขณะที่มีการประกาศปิดทำการ ให้ปฏิบัติตามคำแนะนำของเจ้าหน้าที่และออกจากอาคารอย่างสงบทางทางออกที่ปลอดภัยใกล้ที่สุด",
    ],
    sections: [
      {
        heading: "วิธีที่คุณจะได้รับแจ้ง",
        items: [
          "ประกาศการปิดทำการอย่างเป็นทางการจะเผยแพร่ทางเว็บไซต์และเฟซบุ๊กของคณะรัฐศาสตร์ รวมถึงช่องทางทางการของมหาวิทยาลัยธรรมศาสตร์",
          "อาจารย์อาจส่งอีเมลถึงคุณโดยตรง หรือประกาศทางแพลตฟอร์มออนไลน์ของรายวิชาเกี่ยวกับการเปลี่ยนแปลงของวิชานั้น ๆ",
          "ให้เชื่อถือเฉพาะช่องทางทางการเหล่านี้เท่านั้น อย่าใช้ข้อความที่ส่งต่อกันมา กลุ่มแชทที่ไม่เป็นทางการ หรือข่าวลือ เป็นหลักฐานยืนยันว่าอาคารปิดหรือเปิดทำการ",
        ],
      },
      {
        heading: "การเรียน การสอบ และกำหนดส่งงาน",
        items: [
          "อย่าเข้าใจเองว่าการปิดทำการจะทำให้การเรียน การสอบ หรือกำหนดส่งงานถูกยกเลิกหรือเลื่อนโดยอัตโนมัติ บางรายวิชาอาจย้ายไปเรียนออนไลน์ บางรายวิชาอาจเลื่อนกำหนด และบางรายวิชาอาจดำเนินการตามปกติหากมีการจัดการทางเลือกอื่น",
          "ตรวจสอบประกาศทางการของคณะ หรือติดต่ออาจารย์ผู้สอนโดยตรงสำหรับแต่ละวิชาที่ได้รับผลกระทบ",
          "หากใกล้ถึงกำหนดส่งงานและไม่แน่ใจว่ายังมีผลอยู่หรือไม่ ให้อีเมลสอบถามอาจารย์หรือสำนักงานคณะ แทนที่จะสันนิษฐานเอาเอง",
        ],
      },
      {
        heading: "การเข้าถึงบริการทางไกล",
        items: [
          "เรื่องธุรการหลายอย่าง (ใบแสดงผลการเรียน หนังสือรับรอง คำถามเกี่ยวกับการลงทะเบียน) มักดำเนินการทางอีเมลกับสำนักงานคณะได้ ให้ตรวจสอบเว็บไซต์คณะสำหรับช่องทางบริการทางไกลที่เปิดให้บริการระหว่างการปิดทำการ",
          "ระบบสืบค้นออนไลน์ของห้องสมุดดิเรก ชัยนามและทรัพยากรดิจิทัลต่าง ๆ ยังสามารถเข้าถึงได้จากนอกมหาวิทยาลัย แม้ตัวอาคารห้องสมุดจะได้รับผลกระทบ",
          "หากต้องการเอกสารหรือบริการใดเป็นการเฉพาะและไม่แน่ใจว่าสามารถทำทางไกลได้หรือไม่ ให้อีเมลสอบถามหน่วยงานที่เกี่ยวข้องก่อนเดินทางมามหาวิทยาลัย",
        ],
      },
      {
        heading: "ควรติดต่อใคร",
        items: [
          "สำหรับคำถามเฉพาะโครงการ (นักศึกษา BIR): สำนักงานโครงการ BIR",
          "สำหรับเรื่องธุรการทั่วไปของคณะ: สำนักงานคณะรัฐศาสตร์",
          "สำหรับเรื่องที่เกี่ยวข้องกับนักศึกษาต่างชาติโดยเฉพาะ: กองงานวิเทศสัมพันธ์ (OIA) ของธรรมศาสตร์",
          "หากมีความกังวลด้านความปลอดภัยส่วนตัว หรือคิดว่าต้องการความช่วยเหลือฉุกเฉิน ให้ใช้หมายเลขฉุกเฉินระดับประเทศด้านล่างแทนการรอคำตอบทางอีเมล",
        ],
      },
      {
        heading: "เมื่อเปิดทำการอีกครั้ง",
        items: [
          "รอประกาศเปิดทำการอย่างเป็นทางการก่อนกลับเข้าอาคาร",
          "ตารางเรียนอาจมีการปรับเปลี่ยนช่วงสั้น ๆ ให้ตรวจสอบประกาศแทนการสันนิษฐานว่าทุกอย่างจะกลับมาเหมือนเดิมทันที",
        ],
      },
    ],
    extraContacts: [
      {
        label: "สำนักงานคณะรัฐศาสตร์",
        value: "02-221-6111 ต่อ 3400",
        href: "tel:022216111",
      },
      {
        label: "สำนักงานคณะรัฐศาสตร์ (อีเมล)",
        value: "polscitu@tu.ac.th",
        href: "mailto:polscitu@tu.ac.th",
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
        label: "ห้องสมุดดิเรก ชัยนาม",
        value: "02-221-6111 ต่อ 3406",
        href: "tel:022216111",
      },
      {
        label: "กองงานวิเทศสัมพันธ์ (OIA) มหาวิทยาลัยธรรมศาสตร์",
        value: "info.inter@tu.ac.th",
        href: "mailto:info.inter@tu.ac.th",
      },
      {
        label:
          "สายด่วนความปลอดภัยและภัยพิบัติ ปภ. 24 ชั่วโมง (สำหรับเหตุด้านความปลอดภัย เช่น ไฟไหม้ โครงสร้างเสียหาย หรือระบบสาธารณูปโภคขัดข้อง)",
        value: "1784",
        href: "tel:1784",
      },
    ],
  },
};

export default facultyClosure;
