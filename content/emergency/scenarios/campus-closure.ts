import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Whole Tha Prachan campus closure (not limited to one faculty).
 * Transcribed from the researched dossier.
 */
const campusClosure: EmergencyScenario = {
  id: "campus-closure",
  severity: "warning",
  en: {
    bannerMessage:
      "Thammasat University's Tha Prachan campus is closed. Do not travel to campus until further notice; check official channels for updates.",
    title: "Tha Prachan Campus Closure: What to Do",
    lede: "The whole Tha Prachan campus, not just one faculty, may occasionally close, for example for a safety issue, a citywide emergency, or an order from the university or authorities.",
    immediateActions: [
      "Do not travel to campus until you have seen an official announcement confirming it is safe and open.",
      "Check Thammasat University's official website and Facebook page, and the Faculty of Political Science's channels, for the closure notice.",
      "Check your Thammasat email and course platforms for class-specific instructions.",
      "If you live in university housing or nearby, follow any specific instructions for residents; if you live off campus, stay where you are unless told otherwise.",
      "If you are already on campus when a closure is announced, follow staff and security instructions and leave calmly through an open gate.",
    ],
    sections: [
      {
        heading: "Campus access",
        items: [
          "Gates may be locked or access restricted to staff and essential personnel only. Do not attempt to enter through a closed gate or an unofficial route.",
          "If you have belongings inside a building (dorm room, locker, office), wait for official guidance on when and how you can safely retrieve them rather than trying to access the campus during the closure.",
        ],
      },
      {
        heading: "Transport",
        items: [
          "Check whether river boat piers near campus (such as Tha Chang or Tha Phra Chan) and nearby bus and BTS/MRT connections are affected before planning a route.",
          "If you were planning to travel to campus, check for updated transport advice from the university before setting out, since roads around the campus may also be affected by the same event that caused the closure.",
        ],
      },
      {
        heading: "Exams and deadlines",
        items: [
          "Do not assume a campus closure automatically cancels or postpones exams or deadlines. Some may move online or to a different location, and some may be rescheduled.",
          "Check official university and faculty announcements, or contact your instructor, for the specific status of each exam or deadline.",
        ],
      },
      {
        heading: "If you live far from campus or in university accommodation",
        items: [
          "If your accommodation is affected by the same event that closed the campus, follow instructions from your dormitory or accommodation management, and contact them directly if you are unsure what to do.",
          "If you need to relocate temporarily and are unsure where to go, contact the relevant office below rather than making decisions based on rumours.",
          "International students who are unsure whether they need to leave the country or region should contact their embassy for guidance in addition to following university instructions.",
        ],
      },
      {
        heading: "Staying informed",
        items: [
          "Treat Thammasat University's official website and Facebook page, and the Faculty of Political Science's official channels, as your primary sources.",
          "For citywide issues, also check Bangkok Metropolitan Administration and, for any large-scale emergency, DDPM announcements.",
          "Avoid relying on unofficial group chats or social media rumours to decide whether it is safe to travel to or from campus.",
        ],
      },
      {
        heading: "Who to contact",
        items: [
          "For programme-specific questions (BIR students): the BIR programme office.",
          "For general faculty administration: the Faculty of Political Science main office.",
          "For international-student matters: Thammasat's Office of International Affairs (OIA).",
          "For a safety incident (fire, structural damage, flooding, and similar): the DDPM 24-hour hotline.",
        ],
      },
      {
        heading: "When it reopens",
        items: [
          "Wait for an official reopening announcement before returning to campus.",
          "Expect some disruption to schedules and services immediately after reopening; check official channels rather than assuming a full return to normal on day one.",
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
        label: "Office of International Affairs (OIA), Thammasat University",
        value: "info.inter@tu.ac.th",
        href: "mailto:info.inter@tu.ac.th",
      },
      {
        label: "Thammasat University main line",
        value: "02-221-6111 to 20",
        href: "tel:022216111",
      },
      {
        label: "DDPM 24-hour safety hotline",
        value: "1784",
        href: "tel:1784",
      },
    ],
  },
  th: {
    bannerMessage:
      "มหาวิทยาลัยธรรมศาสตร์ ศูนย์ท่าพระจันทร์ ปิดทำการ งดเดินทางมามหาวิทยาลัยจนกว่าจะมีประกาศเพิ่มเติม โปรดติดตามช่องทางทางการ",
    title: "การปิดมหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์: สิ่งที่ควรทำ",
    lede: "บางครั้งมหาวิทยาลัยธรรมศาสตร์ ศูนย์ท่าพระจันทร์ทั้งหมด ไม่ใช่เพียงคณะใดคณะหนึ่ง อาจปิดทำการ เช่น เนื่องจากปัญหาด้านความปลอดภัย เหตุฉุกเฉินระดับเมือง หรือคำสั่งจากมหาวิทยาลัยหรือหน่วยงานราชการ",
    immediateActions: [
      "อย่าเดินทางมามหาวิทยาลัยจนกว่าจะเห็นประกาศทางการยืนยันว่าปลอดภัยและเปิดทำการแล้ว",
      "ตรวจสอบเว็บไซต์และเฟซบุ๊กทางการของมหาวิทยาลัยธรรมศาสตร์ รวมถึงช่องทางของคณะรัฐศาสตร์ เพื่อดูประกาศการปิดทำการ",
      "ตรวจสอบอีเมลธรรมศาสตร์และแพลตฟอร์มรายวิชาของคุณเพื่อดูคำแนะนำเฉพาะวิชา",
      "หากคุณพักอาศัยในหอพักมหาวิทยาลัยหรือบริเวณใกล้เคียง ให้ปฏิบัติตามคำแนะนำเฉพาะสำหรับผู้พักอาศัย หากคุณอยู่นอกมหาวิทยาลัย ให้อยู่ในที่พักจนกว่าจะได้รับแจ้งเป็นอย่างอื่น",
      "หากคุณอยู่ในมหาวิทยาลัยขณะที่มีการประกาศปิดทำการ ให้ปฏิบัติตามคำแนะนำของเจ้าหน้าที่และเจ้าหน้าที่รักษาความปลอดภัย และออกไปอย่างสงบทางประตูที่เปิดอยู่",
    ],
    sections: [
      {
        heading: "การเข้าออกมหาวิทยาลัย",
        items: [
          "ประตูอาจถูกล็อกหรือจำกัดการเข้าออกเฉพาะเจ้าหน้าที่และบุคลากรที่จำเป็น อย่าพยายามเข้าทางประตูที่ปิดหรือเส้นทางที่ไม่เป็นทางการ",
          "หากมีสิ่งของอยู่ในอาคาร (ห้องพัก ล็อกเกอร์ ห้องทำงาน) ให้รอคำแนะนำอย่างเป็นทางการว่าจะสามารถเข้าไปนำของออกมาได้เมื่อใดและอย่างไร แทนที่จะพยายามเข้ามหาวิทยาลัยระหว่างที่ปิดทำการ",
        ],
      },
      {
        heading: "การเดินทาง",
        items: [
          "ตรวจสอบว่าท่าเรือใกล้มหาวิทยาลัย (เช่น ท่าช้างหรือท่าพระจันทร์) รวมถึงรถโดยสารและรถไฟฟ้า BTS/MRT ที่เชื่อมต่อบริเวณนั้นได้รับผลกระทบหรือไม่ ก่อนวางแผนเส้นทาง",
          "หากวางแผนจะเดินทางมามหาวิทยาลัย ให้ตรวจสอบคำแนะนำด้านการเดินทางที่อัปเดตจากมหาวิทยาลัยก่อนออกเดินทาง เนื่องจากถนนรอบมหาวิทยาลัยอาจได้รับผลกระทบจากเหตุการณ์เดียวกับที่ทำให้ต้องปิดทำการ",
        ],
      },
      {
        heading: "การสอบและกำหนดส่งงาน",
        items: [
          "อย่าเข้าใจเองว่าการปิดมหาวิทยาลัยจะทำให้การสอบหรือกำหนดส่งงานถูกยกเลิกหรือเลื่อนโดยอัตโนมัติ บางรายการอาจย้ายไปสอบออนไลน์หรือสถานที่อื่น และบางรายการอาจเลื่อนกำหนด",
          "ตรวจสอบประกาศทางการของมหาวิทยาลัยและคณะ หรือติดต่ออาจารย์ผู้สอน เพื่อทราบสถานะของการสอบหรือกำหนดส่งงานแต่ละรายการ",
        ],
      },
      {
        heading: "หากคุณอยู่ไกลจากมหาวิทยาลัยหรือพักในหอพักมหาวิทยาลัย",
        items: [
          "หากที่พักของคุณได้รับผลกระทบจากเหตุการณ์เดียวกับที่ทำให้มหาวิทยาลัยปิด ให้ปฏิบัติตามคำแนะนำของฝ่ายบริหารหอพัก และติดต่อโดยตรงหากไม่แน่ใจว่าควรทำอย่างไร",
          "หากจำเป็นต้องย้ายที่พักชั่วคราวและไม่แน่ใจว่าควรไปที่ใด ให้ติดต่อหน่วยงานที่เกี่ยวข้องด้านล่าง แทนที่จะตัดสินใจตามข่าวลือ",
          "นักศึกษาต่างชาติที่ไม่แน่ใจว่าจำเป็นต้องออกนอกประเทศหรือพื้นที่หรือไม่ ควรติดต่อสถานทูตของตนเพื่อขอคำแนะนำ นอกเหนือจากการปฏิบัติตามคำแนะนำของมหาวิทยาลัย",
        ],
      },
      {
        heading: "การติดตามข้อมูลข่าวสาร",
        items: [
          "ให้ถือว่าเว็บไซต์และเฟซบุ๊กทางการของมหาวิทยาลัยธรรมศาสตร์ รวมถึงช่องทางทางการของคณะรัฐศาสตร์ เป็นแหล่งข้อมูลหลักของคุณ",
          "สำหรับปัญหาระดับเมือง ให้ตรวจสอบประกาศของกรุงเทพมหานครด้วย และสำหรับเหตุฉุกเฉินขนาดใหญ่ ให้ตรวจสอบประกาศของกรมป้องกันและบรรเทาสาธารณภัย (ปภ.)",
          "หลีกเลี่ยงการใช้กลุ่มแชทที่ไม่เป็นทางการหรือข่าวลือในโซเชียลมีเดียเป็นเกณฑ์ตัดสินใจว่าปลอดภัยที่จะเดินทางไปหรือกลับจากมหาวิทยาลัยหรือไม่",
        ],
      },
      {
        heading: "ควรติดต่อใคร",
        items: [
          "สำหรับคำถามเฉพาะโครงการ (นักศึกษา BIR): สำนักงานโครงการ BIR",
          "สำหรับเรื่องธุรการทั่วไปของคณะ: สำนักงานคณะรัฐศาสตร์",
          "สำหรับเรื่องนักศึกษาต่างชาติ: กองงานวิเทศสัมพันธ์ (OIA) ของธรรมศาสตร์",
          "สำหรับเหตุด้านความปลอดภัย (ไฟไหม้ โครงสร้างเสียหาย น้ำท่วม และอื่น ๆ ที่คล้ายกัน): สายด่วน ปภ. 24 ชั่วโมง",
        ],
      },
      {
        heading: "เมื่อเปิดทำการอีกครั้ง",
        items: [
          "รอประกาศเปิดทำการอย่างเป็นทางการก่อนกลับเข้ามหาวิทยาลัย",
          "คาดว่าจะมีความไม่สะดวกด้านตารางเรียนและบริการต่าง ๆ ในช่วงแรกหลังเปิดทำการ ให้ตรวจสอบช่องทางทางการแทนการสันนิษฐานว่าทุกอย่างจะกลับมาเป็นปกติทันทีในวันแรก",
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
        label: "กองงานวิเทศสัมพันธ์ (OIA) มหาวิทยาลัยธรรมศาสตร์",
        value: "info.inter@tu.ac.th",
        href: "mailto:info.inter@tu.ac.th",
      },
      {
        label: "มหาวิทยาลัยธรรมศาสตร์ สายหลัก",
        value: "02-221-6111 ถึง 20",
        href: "tel:022216111",
      },
      {
        label: "สายด่วนความปลอดภัยและภัยพิบัติ ปภ. 24 ชั่วโมง",
        value: "1784",
        href: "tel:1784",
      },
    ],
  },
};

export default campusClosure;
