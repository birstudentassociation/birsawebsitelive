import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * A coup, martial law or a declared state of emergency. Factual and neutral:
 * what the special powers allow, how to stay safe, and where to get legal help.
 * Powers as described by Human Rights Watch (Martial Law Act 1914) and the
 * Emergency Decree 2005; arrest rights from section 7/1 of the Code of
 * Criminal Procedure; legal aid from TLHR and the TU Law Center.
 */
const coup: EmergencyScenario = {
  id: "coup",
  severity: "critical",
  hero: "black",
  group: "unrest",
  keyContacts: ["tlhr", "police", "ambulance"],
  moreContacts: ["tuLaw", "touristPolice", "birOffice", "facultyOffice", "oia", "mentalHealth"],
  sources: [
    {
      label: {
        en: "Human Rights Watch, powers under the Martial Law Act 1914",
        th: "Human Rights Watch อำนาจตามพระราชบัญญัติกฎอัยการศึก พ.ศ. 2457",
      },
      href: "https://www.hrw.org/news/2014/05/20/thailand-revoke-martial-law-undermining-rights",
    },
    {
      label: {
        en: "Emergency Decree on Public Administration in a State of Emergency, 2005",
        th: "พระราชกำหนดการบริหารราชการในสถานการณ์ฉุกเฉิน พ.ศ. 2548",
      },
      href: "https://en.wikisource.org/wiki/Emergency_Decree_on_Public_Administration_in_State_of_Emergency,_BE_2548_(2005)",
    },
    {
      label: {
        en: "Thai Code of Criminal Procedure, rights on arrest (section 7/1)",
        th: "ประมวลกฎหมายวิธีพิจารณาความอาญา มาตรา 7/1 สิทธิของผู้ถูกจับ",
      },
      href: "https://en.wikisource.org/wiki/Translation:Criminal_Procedure_Code_of_Thailand/Provisions",
    },
    {
      label: {
        en: "Thai Lawyers for Human Rights, about us and hotline",
        th: "ศูนย์ทนายความเพื่อสิทธิมนุษยชน เกี่ยวกับเราและสายด่วน",
      },
      href: "https://tlhr2014.com/en/about-us",
    },
    {
      label: {
        en: "UK FCDO, Thailand safety and security",
        th: "กระทรวงการต่างประเทศสหราชอาณาจักร คำแนะนำความปลอดภัยในประเทศไทย",
      },
      href: "https://www.gov.uk/foreign-travel-advice/thailand/safety-and-security",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Coup or state of emergency",
    summary:
      "The armed forces have taken power, or the government has declared martial law or a state of emergency. Special powers can limit gatherings, movement and what is published. This guide covers staying safe, your rights, and where to get legal help.",
    banner:
      "Martial law or a state of emergency is in force. Check what is restricted and read your rights.",
    now: [
      "Find out exactly what has been announced, including any curfew, gathering ban and the areas it covers.",
      "Stay in touch with family and friends, and tell them where you are.",
      "Keep your ID or passport and student card with you at all times.",
      "Save a legal aid number somewhere other than your phone. Thai Lawyers for Human Rights, 092-271-3172, 24 hours.",
      "Check anything alarming against a reliable source before you share it.",
    ],
    sections: [
      {
        id: "what-the-powers-allow",
        heading: "What special powers allow",
        items: [
          "Under martial law, the military can ban gatherings, search people and places, seize property, censor the media and hold people for up to seven days without charge.",
          "Under the Emergency Decree, the government can impose curfews, ban gatherings, restrict travel and publishing, and detain suspects. Breaking an order can mean up to two years in prison.",
          "Rules can change quickly. What is allowed today may not be tomorrow.",
        ],
      },
      {
        id: "your-rights",
        heading: "If you are stopped or detained",
        items: [
          "Stay calm and do not resist, even if you think the stop is wrong.",
          "Ask who is holding you and why, and where you are being taken.",
          "Ask to tell a relative or someone you trust where you are, and to see a lawyer. The Code of Criminal Procedure gives you these rights, though under martial law they may be limited in practice.",
          "Do not sign anything you have not read and understood. Ask for a copy of anything you do sign.",
          "Call Thai Lawyers for Human Rights, or ask someone else to, as early as possible.",
        ],
      },
      {
        id: "if-a-friend-is-detained",
        heading: "If a friend is detained",
        steps: [
          "Write down the time, place, and any names, uniforms or vehicle numbers you saw.",
          "Call Thai Lawyers for Human Rights on 092-271-3172 or 096-789-3173.",
          "Tell their family, and BIRSA if you want support from the association.",
        ],
      },
      {
        id: "online-safety",
        heading: "Your phone and what you post",
        items: [
          "Posts, messages and shares can be used as evidence. Laws on computer crime and on the monarchy apply to online content.",
          "Lock your phone with a passcode and turn on two-step login for your accounts.",
          "Think before you post images that identify other people.",
        ],
      },
      {
        id: "classes",
        heading: "Classes and campus",
        body: [
          "The university may close campus, move teaching online or change exams. Follow announcements from Thammasat University and the faculty by email and on their official pages. If you cannot attend safely, tell your lecturer and the BIR Programme office.",
        ],
      },
      {
        id: "international-students",
        heading: "If you are an international student",
        items: [
          "Follow your government's travel advice and register with your embassy if it offers that.",
          "Stay away from political gatherings. Taking part can put your visa at risk.",
          "Keep your passport, visa and enough cash to travel within reach.",
          "The Office of International Affairs can help with university and visa matters. Your embassy handles consular help such as a lost passport or leaving the country.",
        ],
      },
    ],
  },
  th: {
    title: "รัฐประหาร กฎอัยการศึก หรือสถานการณ์ฉุกเฉิน",
    summary:
      "กองทัพเข้ายึดอำนาจ หรือรัฐบาลประกาศกฎอัยการศึกหรือสถานการณ์ฉุกเฉิน อำนาจพิเศษเหล่านี้จำกัดการชุมนุม การเดินทาง และการเผยแพร่ข้อมูลได้ หน้านี้อธิบายวิธีดูแลความปลอดภัย สิทธิของคุณ และช่องทางขอความช่วยเหลือทางกฎหมาย",
    banner: "มีการประกาศกฎอัยการศึกหรือสถานการณ์ฉุกเฉิน ตรวจสอบข้อห้าม และอ่านสิทธิของคุณ",
    now: [
      "ตรวจสอบให้แน่ชัดว่ามีประกาศอะไรบ้าง ทั้งเคอร์ฟิว การห้ามชุมนุม และพื้นที่ที่บังคับใช้",
      "ติดต่อครอบครัวและเพื่อนไว้ และบอกว่าคุณอยู่ที่ไหน",
      "พกบัตรประชาชนและบัตรนักศึกษาติดตัวตลอดเวลา",
      "จดเบอร์ช่วยเหลือทางกฎหมายไว้นอกโทรศัพท์ด้วย ศูนย์ทนายความเพื่อสิทธิมนุษยชน 092-271-3172 ตลอด 24 ชั่วโมง",
      "ตรวจสอบข่าวที่น่าตกใจกับแหล่งที่เชื่อถือได้ก่อนแชร์",
    ],
    sections: [
      {
        id: "what-the-powers-allow",
        heading: "อำนาจพิเศษทำอะไรได้บ้าง",
        items: [
          "ภายใต้กฎอัยการศึก ทหารห้ามการชุมนุม ตรวจค้นบุคคลและสถานที่ ยึดทรัพย์สิน ควบคุมสื่อ และควบคุมตัวบุคคลได้ไม่เกินเจ็ดวันโดยไม่ต้องตั้งข้อหา",
          "ภายใต้พระราชกำหนดการบริหารราชการในสถานการณ์ฉุกเฉิน รัฐบาลประกาศเคอร์ฟิว ห้ามชุมนุม จำกัดการเดินทางและการเผยแพร่ข้อมูล และควบคุมตัวผู้ต้องสงสัยได้ ผู้ฝ่าฝืนคำสั่งมีโทษจำคุกไม่เกินสองปี",
          "ข้อห้ามเปลี่ยนได้เร็ว สิ่งที่ทำได้วันนี้อาจทำไม่ได้ในวันพรุ่งนี้",
        ],
      },
      {
        id: "your-rights",
        heading: "ถ้าถูกเรียกตรวจหรือถูกควบคุมตัว",
        items: [
          "ใจเย็นและอย่าขัดขืน แม้จะคิดว่าการเรียกตรวจไม่ถูกต้อง",
          "ถามว่าใครเป็นผู้ควบคุมตัว ด้วยเหตุใด และจะพาไปที่ไหน",
          "ขอแจ้งญาติหรือผู้ที่ไว้วางใจว่าคุณอยู่ที่ไหน และขอพบทนายความ ประมวลกฎหมายวิธีพิจารณาความอาญารับรองสิทธิเหล่านี้ แม้ในทางปฏิบัติอาจถูกจำกัดภายใต้กฎอัยการศึก",
          "อย่าลงชื่อในเอกสารที่ยังไม่ได้อ่านหรือไม่เข้าใจ และขอสำเนาเอกสารที่ลงชื่อไปแล้ว",
          "โทรหาศูนย์ทนายความเพื่อสิทธิมนุษยชน หรือขอให้คนอื่นโทรแทน โดยเร็วที่สุด",
        ],
      },
      {
        id: "if-a-friend-is-detained",
        heading: "ถ้าเพื่อนถูกควบคุมตัว",
        steps: [
          "จดเวลา สถานที่ ชื่อ เครื่องแบบ หรือทะเบียนรถที่เห็น",
          "โทรศูนย์ทนายความเพื่อสิทธิมนุษยชน 092-271-3172 หรือ 096-789-3173",
          "แจ้งครอบครัวของเพื่อน และแจ้ง BIRSA ถ้าต้องการให้สโมสรช่วยประสาน",
        ],
      },
      {
        id: "online-safety",
        heading: "โทรศัพท์และสิ่งที่คุณโพสต์",
        items: [
          "โพสต์ ข้อความ และการแชร์อาจถูกใช้เป็นหลักฐาน กฎหมายว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์และกฎหมายเกี่ยวกับสถาบันพระมหากษัตริย์ใช้กับเนื้อหาออนไลน์ด้วย",
          "ตั้งรหัสล็อกโทรศัพท์ และเปิดการยืนยันตัวตนสองขั้นตอนในบัญชีต่าง ๆ",
          "คิดก่อนโพสต์ภาพที่ระบุตัวตนของคนอื่นได้",
        ],
      },
      {
        id: "classes",
        heading: "การเรียนและมหาวิทยาลัย",
        body: [
          "มหาวิทยาลัยอาจปิดพื้นที่ ให้เรียนออนไลน์ หรือเปลี่ยนการสอบ ติดตามประกาศของมหาวิทยาลัยธรรมศาสตร์และคณะทางอีเมลและช่องทางทางการ ถ้าเดินทางมาอย่างปลอดภัยไม่ได้ ให้แจ้งอาจารย์และสำนักงานหลักสูตร BIR",
        ],
      },
      {
        id: "international-students",
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "เพื่อนนักศึกษาต่างชาติควรทำตามคำแนะนำการเดินทางของรัฐบาลประเทศตน และลงทะเบียนกับสถานทูตถ้ามีบริการ",
          "ชาวต่างชาติควรอยู่ห่างจากการชุมนุมทางการเมือง เพราะการเข้าร่วมอาจกระทบวีซ่า",
          "เก็บหนังสือเดินทาง วีซ่า และเงินสดสำหรับเดินทางไว้ใกล้ตัว",
          "กองวิเทศสัมพันธ์ช่วยเรื่องมหาวิทยาลัยและวีซ่า ส่วนสถานทูตช่วยเรื่องกงสุล เช่น หนังสือเดินทางหาย หรือการเดินทางออกนอกประเทศ",
        ],
      },
    ],
  },
};

export default coup;
