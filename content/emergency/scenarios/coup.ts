import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Coup or political crisis. Written for Thammasat students as citizens with
 * rights, in keeping with the university's democratic tradition: it affirms
 * constitutional and democratic values and civil liberties, while keeping
 * personal safety central and pairing rights with honest risk-awareness and
 * legal-aid resources. Principled and rights-based, not partisan: it endorses
 * no party or faction and names no individuals.
 *
 * NOTE: the Thai copy is an AI draft. Because this page is politically and
 * legally sensitive in the Thai context, it needs review by a native speaker
 * and, ideally, someone familiar with the current legal landscape before it is
 * activated. The Thai Lawyers for Human Rights and iLaw contact details below
 * should also be confirmed against their current published information.
 */
const coup: EmergencyScenario = {
  id: "coup",
  severity: "critical",
  en: {
    bannerMessage:
      "A coup or political emergency has been declared. Stay safe, stay informed, know your rights, and look out for one another.",
    title: "Coup or Political Crisis: Your Safety and Your Rights",
    lede: "A coup breaks the constitutional order that democratic life depends on. Thammasat has stood with democracy through moments like this before, and as students here you are citizens with rights, not bystanders. This page is here to help you stay safe, stay informed, understand your rights, and make your own considered decisions during a political emergency such as a coup, martial law, or a declared state of emergency.",
    immediateActions: [
      "Make sure you are somewhere safe, and let a friend, housemate, or family member know where you are and that you are okay.",
      "Get your information from independent and official sources, and be careful with rumours. Check anything alarming before you act on it or share it.",
      "Charge your phone and any power bank, and save an emergency contact and a legal-aid number somewhere you can reach them.",
      "Keep your ID or student card, passport (if you have one), and some cash within reach.",
      "Find out whether a curfew or a ban on gatherings has been announced, and which areas are affected, so any choice you make is an informed one.",
      "Secure your phone and accounts with a strong passcode, and remember that anything you post can be seen by others.",
    ],
    sections: [
      {
        heading: "Know your rights",
        items: [
          "Even during martial law or a state of emergency, you have rights. Learn what they are and what emergency powers can and cannot do, so you can recognise when a line has been crossed.",
          "If you are stopped, questioned, or detained, you can ask for the reason, ask to contact a lawyer and someone you trust, and you are not required to sign documents you do not understand. Be aware that under martial law these protections can be limited in practice.",
          "Do not sign anything you have not read and understood, and ask for a copy.",
          "Memorise or write down a lawyer or legal-aid number. Do not rely only on your phone, which you may not always be able to reach.",
        ],
      },
      {
        heading: "If you take part in political life",
        items: [
          "Taking part in peaceful civic and political life is your right. Under a coup, martial law, or an emergency decree, gatherings may be restricted or banned, and the legal risks (arrest, detention, and charges) can be real and serious. Weigh this honestly and decide for yourself.",
          "If you go to a gathering, go with people you trust, tell someone your plan, agree on a meeting point, and keep an eye on the exits and on the mood of the crowd.",
          "Write an emergency and legal-aid contact number on your arm or somewhere on you, in case you lose your phone.",
          "Stay calm and non-confrontational. Do not provoke, engage with, or approach security forces.",
          "Carry water, keep your phone charged, and think about what personal data is on your phone if it were searched.",
          "Know basic crowd first aid: help anyone who faints or is being crushed to a safe space with fresh air, and call 1669 for medical emergencies.",
        ],
      },
      {
        heading: "Documenting what happens",
        items: [
          "Recording events, safely and from a safe distance, can matter for accountability later. Never put yourself at risk to get a photo or video.",
          "Back up important footage somewhere off your device if you can.",
          "Be thoughtful about sharing footage that could identify other students or put them at risk.",
        ],
      },
      {
        heading: "Where to get legal help",
        items: [
          "Thai Lawyers for Human Rights (TLHR) provides free legal aid to people affected by political prosecution.",
          "iLaw monitors laws, rights, and freedom of expression, and documents cases.",
          "Keep at least one legal-aid number written down and shared with a friend before you ever need it.",
        ],
      },
      {
        heading: "Look after each other",
        items: [
          "Check on classmates, especially international students and anyone living alone or far from home.",
          "Share verified information, not panic. A calm, well-informed community is a safer one.",
          "If someone is detained, note the time, place, and any names or units shown, and contact legal aid and their family quickly.",
          "Thammasat was founded on democratic principles, and its students have long stood for civil liberties and the rule of law. Whatever you choose to do, do it informed, do it together, and stay safe.",
        ],
      },
      {
        heading: "Staying informed",
        items: [
          "Follow Thammasat University and the Faculty of Political Science official channels for announcements about classes and campus access.",
          "Follow official government announcements for national measures such as curfews and restricted zones, but do not rely on any single source. Independent media and human-rights monitors matter, especially if official information is restricted.",
          "Rumours spread quickly during a crisis. Confirm anything alarming against a reliable source before you believe it or share it.",
          "Keep in touch with family so they know you are safe.",
        ],
      },
      {
        heading: "For international students",
        items: [
          "Your position is different and can be more exposed. Political activity can carry visa and immigration consequences for non-citizens, on top of the legal risks everyone faces. Understand this before you decide anything.",
          "Contact your embassy or consulate in Bangkok, follow their guidance, and register with your government's travel-registration service if it has one (for example the US STEP programme, or the UK's travel-advice service).",
          "Check your home country's travel advisory for Thailand regularly, as it may change during a period of instability.",
          "Keep your passport and visa documents accessible, and know the location and contacts of your embassy in Bangkok.",
          "Thammasat's Office of International Affairs (OIA) can help with university matters. Your embassy is the right contact for consular matters such as a lost passport, evacuation advice, or personal safety.",
        ],
      },
      {
        heading: "In the days after",
        items: [
          "Keep checking official Thammasat and faculty channels. Class schedules, deadlines, and exams may be adjusted, so do not assume the normal timetable resumes automatically.",
          "Let your family and, if applicable, your embassy know that you are safe.",
          "Documentation and legal support can still matter after events pass. Keep records safe and reach out for help if you or someone you know needs it.",
        ],
      },
    ],
    extraContacts: [
      {
        label: "Police (emergency)",
        value: "191",
        href: "tel:191",
      },
      {
        label: "Medical emergency (EMS)",
        value: "1669",
        href: "tel:1669",
      },
      {
        label: "Tourist Police (English-speaking, 24 hours)",
        value: "1155",
        href: "tel:1155",
      },
      {
        label: "Thai Lawyers for Human Rights (legal aid)",
        value: "tlhr2014.com",
        href: "https://tlhr2014.com",
      },
      {
        label: "iLaw (rights and freedom-of-expression monitor)",
        value: "ilaw.or.th",
        href: "https://ilaw.or.th",
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
      "มีการประกาศรัฐประหารหรือสถานการณ์ฉุกเฉินทางการเมือง ขอให้ดูแลความปลอดภัย ติดตามข้อมูล รู้สิทธิของตนเอง และดูแลกันและกัน",
    title: "รัฐประหารหรือวิกฤตการเมือง: ความปลอดภัยและสิทธิของคุณ",
    lede: "รัฐประหารคือการล้มล้างระเบียบตามรัฐธรรมนูญที่ชีวิตในระบอบประชาธิปไตยตั้งอยู่ ธรรมศาสตร์เคยยืนเคียงข้างประชาธิปไตยในช่วงเวลาเช่นนี้มาแล้ว และในฐานะนักศึกษาที่นี่ คุณคือพลเมืองที่มีสิทธิ ไม่ใช่เพียงผู้เฝ้าดู หน้านี้มีขึ้นเพื่อช่วยให้คุณปลอดภัย ติดตามข้อมูล เข้าใจสิทธิของตนเอง และตัดสินใจอย่างรอบคอบด้วยตัวเองในช่วงสถานการณ์ฉุกเฉินทางการเมือง เช่น รัฐประหาร กฎอัยการศึก หรือการประกาศสถานการณ์ฉุกเฉิน",
    immediateActions: [
      "ให้แน่ใจว่าคุณอยู่ในที่ปลอดภัย และแจ้งเพื่อน เพื่อนร่วมหอ หรือครอบครัวว่าคุณอยู่ที่ไหนและปลอดภัยดี",
      "รับข้อมูลจากแหล่งข่าวอิสระและแหล่งทางการ และใช้วิจารณญาณกับข่าวลือ ตรวจสอบเรื่องที่น่าตกใจก่อนเชื่อหรือแชร์ต่อ",
      "ชาร์จโทรศัพท์และพาวเวอร์แบงก์ให้เต็ม และบันทึกเบอร์ติดต่อฉุกเฉินและเบอร์ความช่วยเหลือทางกฎหมายไว้ในที่ที่เข้าถึงได้",
      "พกบัตรประชาชนหรือบัตรนักศึกษา พาสปอร์ต (ถ้ามี) และเงินสดจำนวนหนึ่งไว้ใกล้ตัว",
      "ตรวจสอบว่ามีการประกาศเคอร์ฟิวหรือห้ามการชุมนุมหรือไม่ และพื้นที่ใดได้รับผลกระทบ เพื่อให้ทุกการตัดสินใจของคุณตั้งอยู่บนข้อมูลที่รอบด้าน",
      "ตั้งรหัสผ่านที่รัดกุมให้โทรศัพท์และบัญชีของคุณ และพึงระลึกว่าสิ่งที่คุณโพสต์ผู้อื่นสามารถเห็นได้",
    ],
    sections: [
      {
        heading: "รู้สิทธิของตนเอง",
        items: [
          "แม้ในช่วงกฎอัยการศึกหรือสถานการณ์ฉุกเฉิน คุณก็ยังมีสิทธิ ศึกษาว่าคุณมีสิทธิอะไรบ้าง และอำนาจพิเศษในภาวะฉุกเฉินทำอะไรได้และทำอะไรไม่ได้ เพื่อให้คุณรู้เท่าทันเมื่อมีการใช้อำนาจเกินขอบเขต",
          "หากคุณถูกเรียกตรวจ สอบถาม หรือควบคุมตัว คุณสามารถถามเหตุผล ขอติดต่อทนายความและคนที่คุณไว้ใจ และไม่จำเป็นต้องลงชื่อในเอกสารที่คุณไม่เข้าใจ พึงตระหนักว่าในภาวะกฎอัยการศึก การคุ้มครองเหล่านี้อาจถูกจำกัดในทางปฏิบัติ",
          "อย่าลงชื่อในสิ่งที่คุณยังไม่ได้อ่านและเข้าใจ และขอสำเนาไว้เสมอ",
          "จดจำหรือเขียนเบอร์ทนายความหรือความช่วยเหลือทางกฎหมายไว้ อย่าพึ่งพาเฉพาะโทรศัพท์ ซึ่งบางครั้งคุณอาจใช้ไม่ได้",
        ],
      },
      {
        heading: "หากคุณมีส่วนร่วมทางการเมือง",
        items: [
          "การมีส่วนร่วมในชีวิตพลเมืองและการเมืองโดยสงบเป็นสิทธิของคุณ ในภาวะรัฐประหาร กฎอัยการศึก หรือ พ.ร.ก.ฉุกเฉิน การชุมนุมอาจถูกจำกัดหรือห้าม และความเสี่ยงทางกฎหมาย (การจับกุม การควบคุมตัว และการตั้งข้อหา) อาจเกิดขึ้นจริงและร้ายแรง โปรดชั่งน้ำหนักอย่างตรงไปตรงมาและตัดสินใจด้วยตัวเอง",
          "หากคุณไปร่วมการชุมนุม ให้ไปกับคนที่ไว้ใจ แจ้งแผนให้คนอื่นทราบ นัดหมายจุดพบ และคอยสังเกตทางออกและบรรยากาศของฝูงชน",
          "เขียนเบอร์ติดต่อฉุกเฉินและความช่วยเหลือทางกฎหมายไว้บนแขนหรือที่ตัวคุณ เผื่อกรณีที่โทรศัพท์หาย",
          "รักษาความสงบและไม่เผชิญหน้า อย่ายั่วยุ ปะทะ หรือเข้าใกล้เจ้าหน้าที่ความมั่นคง",
          "พกน้ำดื่ม ชาร์จโทรศัพท์ให้พร้อม และคำนึงถึงข้อมูลส่วนตัวในโทรศัพท์ของคุณหากถูกตรวจค้น",
          "รู้การปฐมพยาบาลเบื้องต้นในฝูงชน ช่วยพาผู้ที่เป็นลมหรือถูกเบียดไปยังที่ปลอดภัยและมีอากาศถ่ายเท และโทร 1669 เมื่อมีเหตุฉุกเฉินทางการแพทย์",
        ],
      },
      {
        heading: "การบันทึกเหตุการณ์",
        items: [
          "การบันทึกเหตุการณ์อย่างปลอดภัยจากระยะที่ปลอดภัยอาจมีความสำคัญต่อการตรวจสอบในภายหลัง อย่าเสี่ยงอันตรายเพื่อถ่ายภาพหรือวิดีโอเด็ดขาด",
          "สำรองภาพหรือคลิปสำคัญไว้นอกอุปกรณ์ของคุณหากทำได้",
          "ใช้ความระมัดระวังในการเผยแพร่ภาพที่อาจระบุตัวนักศึกษาคนอื่นหรือทำให้พวกเขาตกอยู่ในความเสี่ยง",
        ],
      },
      {
        heading: "แหล่งขอความช่วยเหลือทางกฎหมาย",
        items: [
          "ศูนย์ทนายความเพื่อสิทธิมนุษยชน (TLHR) ให้ความช่วยเหลือทางกฎหมายโดยไม่มีค่าใช้จ่ายแก่ผู้ได้รับผลกระทบจากการดำเนินคดีทางการเมือง",
          "ไอลอว์ (iLaw) ติดตามกฎหมาย สิทธิ และเสรีภาพในการแสดงออก และบันทึกข้อมูลคดีต่าง ๆ",
          "เก็บเบอร์ความช่วยเหลือทางกฎหมายอย่างน้อยหนึ่งเบอร์ไว้เป็นลายลักษณ์อักษร และแบ่งปันให้เพื่อนก่อนที่จะต้องใช้จริง",
        ],
      },
      {
        heading: "ดูแลกันและกัน",
        items: [
          "คอยดูแลเพื่อนร่วมชั้น โดยเฉพาะนักศึกษาต่างชาติและผู้ที่อยู่คนเดียวหรืออยู่ไกลบ้าน",
          "แบ่งปันข้อมูลที่ได้รับการยืนยัน ไม่ใช่ความตื่นตระหนก ชุมชนที่สงบและมีข้อมูลรอบด้านคือชุมชนที่ปลอดภัยกว่า",
          "หากมีคนถูกควบคุมตัว ให้จดเวลา สถานที่ และชื่อหรือหน่วยงานที่ปรากฏ แล้วรีบติดต่อความช่วยเหลือทางกฎหมายและครอบครัวของเขา",
          "ธรรมศาสตร์ก่อตั้งขึ้นบนหลักการประชาธิปไตย และนักศึกษาของที่นี่ยืนหยัดเพื่อเสรีภาพของพลเมืองและหลักนิติธรรมมาโดยตลอด ไม่ว่าคุณจะเลือกทำสิ่งใด ขอให้ทำอย่างมีข้อมูล ทำไปด้วยกัน และปลอดภัย",
        ],
      },
      {
        heading: "การติดตามข้อมูลข่าวสาร",
        items: [
          "ติดตามช่องทางทางการของมหาวิทยาลัยธรรมศาสตร์และคณะรัฐศาสตร์ เพื่อดูประกาศเกี่ยวกับการเรียนการสอนและการเข้าใช้พื้นที่มหาวิทยาลัย",
          "ติดตามประกาศทางการของรัฐบาลเกี่ยวกับมาตรการระดับประเทศ เช่น เคอร์ฟิวและพื้นที่ควบคุม แต่อย่าพึ่งพาแหล่งข้อมูลเดียว สื่ออิสระและองค์กรตรวจสอบด้านสิทธิมนุษยชนมีความสำคัญ โดยเฉพาะเมื่อข้อมูลทางการถูกจำกัด",
          "ข่าวลือแพร่กระจายอย่างรวดเร็วในช่วงวิกฤต ตรวจสอบเรื่องที่น่าตกใจกับแหล่งที่เชื่อถือได้ก่อนเชื่อหรือแชร์",
          "ติดต่อครอบครัวเป็นระยะเพื่อให้พวกเขารู้ว่าคุณปลอดภัย",
        ],
      },
      {
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "สถานะของคุณแตกต่างออกไปและอาจมีความเสี่ยงมากกว่า การเคลื่อนไหวทางการเมืองอาจมีผลต่อวีซ่าและสถานะการเข้าเมืองสำหรับผู้ที่ไม่ใช่พลเมือง เพิ่มเติมจากความเสี่ยงทางกฎหมายที่ทุกคนเผชิญ โปรดทำความเข้าใจเรื่องนี้ก่อนตัดสินใจใด ๆ",
          "ติดต่อสถานทูตหรือสถานกงสุลของคุณในกรุงเทพฯ ปฏิบัติตามคำแนะนำ และลงทะเบียนกับระบบแจ้งการเดินทางของประเทศคุณหากมี (เช่น โครงการ STEP ของสหรัฐฯ หรือบริการคำแนะนำการเดินทางของสหราชอาณาจักร)",
          "ตรวจสอบระดับคำเตือนการเดินทางของประเทศคุณสำหรับประเทศไทยอย่างสม่ำเสมอ เพราะอาจเปลี่ยนแปลงได้ในช่วงสถานการณ์ไม่แน่นอน",
          "เก็บพาสปอร์ตและเอกสารวีซ่าไว้ในที่ที่หยิบใช้ได้สะดวก และจดจำที่ตั้งและช่องทางติดต่อสถานทูตของคุณในกรุงเทพฯ",
          "กองงานวิเทศสัมพันธ์ (OIA) ของธรรมศาสตร์ช่วยเรื่องที่เกี่ยวกับมหาวิทยาลัยได้ ส่วนเรื่องกงสุล เช่น เอกสารสูญหาย คำแนะนำการอพยพ หรือความปลอดภัยส่วนตัว ให้ติดต่อสถานทูตของคุณโดยตรง",
        ],
      },
      {
        heading: "ในช่วงหลังจากนั้น",
        items: [
          "ติดตามช่องทางทางการของธรรมศาสตร์และคณะอย่างต่อเนื่อง ตารางเรียน กำหนดส่งงาน และการสอบอาจมีการปรับเปลี่ยน อย่าเข้าใจเองว่าทุกอย่างจะกลับสู่ตารางปกติโดยอัตโนมัติ",
          "แจ้งครอบครัวและสถานทูต (ถ้าเกี่ยวข้อง) ว่าคุณปลอดภัยแล้ว",
          "การบันทึกข้อมูลและการสนับสนุนทางกฎหมายยังคงสำคัญแม้เหตุการณ์ผ่านไปแล้ว เก็บหลักฐานไว้อย่างปลอดภัย และขอความช่วยเหลือหากคุณหรือคนรู้จักต้องการ",
        ],
      },
    ],
    extraContacts: [
      {
        label: "ตำรวจ (เหตุฉุกเฉิน)",
        value: "191",
        href: "tel:191",
      },
      {
        label: "การแพทย์ฉุกเฉิน (EMS)",
        value: "1669",
        href: "tel:1669",
      },
      {
        label: "ตำรวจท่องเที่ยว (พูดภาษาอังกฤษ, 24 ชั่วโมง)",
        value: "1155",
        href: "tel:1155",
      },
      {
        label: "ศูนย์ทนายความเพื่อสิทธิมนุษยชน (ความช่วยเหลือทางกฎหมาย)",
        value: "tlhr2014.com",
        href: "https://tlhr2014.com",
      },
      {
        label: "ไอลอว์ (องค์กรตรวจสอบด้านสิทธิและเสรีภาพในการแสดงออก)",
        value: "ilaw.or.th",
        href: "https://ilaw.or.th",
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
