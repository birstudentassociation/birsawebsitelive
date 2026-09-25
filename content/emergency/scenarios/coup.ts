import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * A coup, martial law or a declared state of emergency. Takes a clear position
 * for constitutional democracy and civil liberties, in keeping with Thammasat's
 * history, while endorsing no party or person and keeping personal safety and
 * honest risk first.
 *
 * History from Wikipedia (Thammasat University, the 1973 uprising and the
 * 6 October 1976 massacre). Powers as described by Human Rights Watch (Martial
 * Law Act 1914) and the Emergency Decree 2005; arrest rights from section 7/1
 * of the Code of Criminal Procedure; legal aid from TLHR and the TU Law Center.
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
        en: "Wikipedia, Thammasat University",
        th: "Wikipedia มหาวิทยาลัยธรรมศาสตร์",
      },
      href: "https://en.wikipedia.org/wiki/Thammasat_University",
    },
    {
      label: {
        en: "Wikipedia, the 1973 Thai popular uprising",
        th: "Wikipedia เหตุการณ์ 14 ตุลา 2516",
      },
      href: "https://en.wikipedia.org/wiki/1973_Thai_popular_uprising",
    },
    {
      label: {
        en: "Wikipedia, the 6 October 1976 massacre",
        th: "Wikipedia เหตุการณ์ 6 ตุลา 2519",
      },
      href: "https://en.wikipedia.org/wiki/6_October_1976_massacre",
    },
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
    title: "Coup or military rule",
    summary:
      "A coup takes power away from the people who elected their government. Thammasat was founded to teach constitutional government, and its students have defended it before. BIRSA stands with democracy. This guide sets out where we stand, your rights, and how to stay safe whatever you decide to do.",
    banner:
      "The military has seized power. Stay safe, know your rights and look out for one another.",
    now: [
      "Get somewhere safe and tell a friend or family member where you are.",
      "Find out exactly what has been announced, including any curfew, ban on gatherings and the areas covered.",
      "Save a legal aid number somewhere other than your phone. Thai Lawyers for Human Rights, 092-271-3172, 24 hours.",
      "Keep your ID card or passport and your student card with you.",
      "Check anything alarming against a reliable source before you believe it or pass it on.",
    ],
    sections: [
      {
        id: "where-we-stand",
        heading: "Where BIRSA stands",
        body: [
          "Power in a democracy comes from the people, through elections and a constitution. A coup replaces that with force. No promise of order or stability makes that legitimate, and we will not pretend otherwise.",
          "We stand for a government chosen by the people, the rule of law, and the freedom to speak, write, meet and disagree without fear. We endorse no party and no politician. Our loyalty is to those principles and to the students who hold them.",
          "Every student has the right to decide how to respond to a coup. Some will speak out, some will stay quiet, and some will need to protect themselves and their families first. All of those choices deserve respect. Our job is to make sure you choose with full knowledge of the risks, and that nobody who is detained is left alone.",
        ],
      },
      {
        id: "thammasat",
        heading: "Why this is Thammasat's fight",
        items: [
          "Thammasat was founded on 27 June 1934 as the University of Moral and Political Sciences by Pridi Banomyong, one of the leaders of the 1932 revolution that brought constitutional government to Siam.",
          "In October 1973, more than 2,000 Thammasat students began the protests that grew to hundreds of thousands and ended the military government of Field Marshal Thanom Kittikachorn. At least 77 people were killed.",
          "On 6 October 1976, police and paramilitary forces attacked students gathered on this campus at Tha Prachan. The official death toll was 46, and many believe the true number was over a hundred. The military seized power that same evening.",
          "Thammasat marks 6 October every year, and a memorial stands on campus. When you walk past it, you are walking where students paid for the freedoms this guide asks you to protect.",
        ],
      },
      {
        id: "what-the-powers-allow",
        heading: "What military and emergency powers allow",
        items: [
          "Under martial law, the military can ban gatherings, search people and places, seize property, censor the media and hold people for up to seven days without charge.",
          "Under the Emergency Decree, the government can impose curfews, ban gatherings, restrict travel and publishing, and detain suspects. Breaking an order can mean up to two years in prison.",
          "After a coup, new orders can appear overnight, and they are often used against students, academics and journalists first. Check what is in force before you act.",
        ],
      },
      {
        id: "if-you-speak-out",
        heading: "If you choose to speak out",
        body: [
          "Peaceful expression is a right, but after a coup it can lead to arrest and charges. These steps reduce the risk. They cannot remove it.",
        ],
        items: [
          "Stay non-violent, whatever happens around you. Violence harms people, hands the authorities a reason to crack down, and loses public support.",
          "Go with people you trust, tell someone outside your plans, and agree a meeting point in case you are separated.",
          "Write a legal aid number on your arm in pen, in case your phone is taken.",
          "Know what has been banned and the penalty, so you decide knowingly.",
          "Keep away from barricades and lines of soldiers or police, and do not provoke them.",
          "Think about what is on your phone if it is searched, and lock it with a passcode rather than your face or fingerprint.",
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
          "Tell their family, and tell BIRSA. We will help find support and make sure they are not forgotten.",
        ],
      },
      {
        id: "recording",
        heading: "Recording what happens",
        items: [
          "Records made at the time matter later, in court and in history. Film from a safe distance and never put yourself at risk for a shot.",
          "Back up footage somewhere off your phone as soon as you can.",
          "Blur or crop out the faces of other protesters before you share anything. A photo can be used to identify and charge them.",
          "Posts, messages and shares can be used as evidence. Laws on computer crime apply to what you post online.",
        ],
      },
      {
        id: "look-after-each-other",
        heading: "Look after each other",
        items: [
          "Check on classmates, especially those living alone, far from home or from abroad.",
          "Share verified information, not panic.",
          "Fear, anger and exhaustion are normal. Talk to people you trust, or call the mental health hotline on 1323 at any hour.",
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
          "Your risks are different. Taking part in political activity can cost you your visa and lead to deportation, on top of the legal risks Thai students face. Most governments advise their citizens to stay away from political gatherings in Thailand.",
          "Follow your government's travel advice and register with your embassy if it offers that.",
          "Keep your passport, visa and enough money to travel within reach.",
          "The Office of International Affairs can help with university and visa matters. Your embassy handles consular help such as a lost passport or leaving the country.",
        ],
      },
    ],
  },
  th: {
    title: "รัฐประหารและการปกครองโดยทหาร",
    summary:
      "รัฐประหารคือการยึดอำนาจไปจากประชาชนผู้เลือกรัฐบาล ธรรมศาสตร์ก่อตั้งขึ้นเพื่อสอนการปกครองตามรัฐธรรมนูญ และนักศึกษาธรรมศาสตร์เคยยืนหยัดปกป้องหลักการนี้มาแล้ว BIRSA ยืนข้างประชาธิปไตย หน้านี้บอกจุดยืนของเรา สิทธิของคุณ และวิธีดูแลความปลอดภัยไม่ว่าคุณจะเลือกทางใด",
    banner: "ทหารยึดอำนาจการปกครอง ดูแลความปลอดภัย รู้สิทธิของตัวเอง และดูแลกันและกัน",
    now: [
      "อยู่ในที่ปลอดภัย และบอกเพื่อนหรือครอบครัวว่าคุณอยู่ที่ไหน",
      "ตรวจสอบให้แน่ชัดว่ามีประกาศอะไรบ้าง ทั้งเคอร์ฟิว การห้ามชุมนุม และพื้นที่ที่บังคับใช้",
      "จดเบอร์ช่วยเหลือทางกฎหมายไว้นอกโทรศัพท์ด้วย ศูนย์ทนายความเพื่อสิทธิมนุษยชน 092-271-3172 ตลอด 24 ชั่วโมง",
      "พกบัตรประชาชนและบัตรนักศึกษาติดตัว",
      "ตรวจสอบข่าวที่น่าตกใจกับแหล่งที่เชื่อถือได้ก่อนเชื่อหรือส่งต่อ",
    ],
    sections: [
      {
        id: "where-we-stand",
        heading: "จุดยืนของ BIRSA",
        body: [
          "ในระบอบประชาธิปไตย อำนาจมาจากประชาชน ผ่านการเลือกตั้งและรัฐธรรมนูญ รัฐประหารเอากำลังมาแทนที่สิ่งนั้น ไม่ว่าจะอ้างความสงบเรียบร้อยหรือเสถียรภาพอย่างไร ก็ไม่ทำให้การยึดอำนาจชอบธรรม และเราจะไม่แสร้งทำเป็นว่าเป็นอย่างอื่น",
          "เรายืนหยัดเพื่อรัฐบาลที่ประชาชนเลือก หลักนิติธรรม และเสรีภาพที่จะพูด เขียน รวมตัว และเห็นต่างได้โดยไม่ต้องหวาดกลัว เราไม่สนับสนุนพรรคการเมืองหรือนักการเมืองคนใด ความภักดีของเราอยู่ที่หลักการเหล่านี้ และอยู่กับนักศึกษาทุกคนที่ยึดถือหลักการเดียวกัน",
          "นักศึกษาทุกคนมีสิทธิเลือกเองว่าจะตอบสนองต่อรัฐประหารอย่างไร บางคนจะออกมาแสดงออก บางคนจะเงียบ และบางคนต้องปกป้องตัวเองและครอบครัวก่อน ทุกทางเลือกควรได้รับความเคารพ หน้าที่ของเราคือทำให้คุณเลือกโดยรู้ความเสี่ยงอย่างครบถ้วน และไม่ปล่อยให้ใครที่ถูกควบคุมตัวต้องอยู่อย่างโดดเดี่ยว",
        ],
      },
      {
        id: "thammasat",
        heading: "ทำไมเรื่องนี้จึงเป็นเรื่องของธรรมศาสตร์",
        items: [
          "ธรรมศาสตร์ก่อตั้งเมื่อวันที่ 27 มิถุนายน 2477 ในชื่อมหาวิทยาลัยวิชาธรรมศาสตร์และการเมือง โดยปรีดี พนมยงค์ หนึ่งในผู้นำการปฏิวัติ 2475 ที่นำการปกครองตามรัฐธรรมนูญมาสู่สยาม",
          "เดือนตุลาคม 2516 นักศึกษาธรรมศาสตร์กว่าสองพันคนเริ่มการชุมนุมที่ขยายเป็นหลายแสนคน และยุติรัฐบาลทหารของจอมพลถนอม กิตติขจร มีผู้เสียชีวิตอย่างน้อย 77 คน",
          "วันที่ 6 ตุลาคม 2519 ตำรวจและกองกำลังกึ่งทหารบุกทำร้ายนักศึกษาที่ชุมนุมอยู่ในธรรมศาสตร์ ท่าพระจันทร์ แห่งนี้ ตัวเลขผู้เสียชีวิตทางการคือ 46 คน และหลายฝ่ายเชื่อว่าจริง ๆ แล้วเกินร้อยคน เย็นวันเดียวกันนั้นทหารก็ยึดอำนาจ",
          "ธรรมศาสตร์รำลึกเหตุการณ์ 6 ตุลาทุกปี และมีอนุสรณ์สถานอยู่ในมหาวิทยาลัย ทุกครั้งที่เดินผ่าน คุณกำลังเดินอยู่บนพื้นที่ที่นักศึกษารุ่นก่อนแลกมาด้วยชีวิต เพื่อเสรีภาพที่หน้านี้ชวนให้คุณปกป้อง",
        ],
      },
      {
        id: "what-the-powers-allow",
        heading: "อำนาจทหารและอำนาจฉุกเฉินทำอะไรได้บ้าง",
        items: [
          "ภายใต้กฎอัยการศึก ทหารห้ามการชุมนุม ตรวจค้นบุคคลและสถานที่ ยึดทรัพย์สิน ควบคุมสื่อ และควบคุมตัวบุคคลได้ไม่เกินเจ็ดวันโดยไม่ต้องตั้งข้อหา",
          "ภายใต้พระราชกำหนดการบริหารราชการในสถานการณ์ฉุกเฉิน รัฐบาลประกาศเคอร์ฟิว ห้ามชุมนุม จำกัดการเดินทางและการเผยแพร่ข้อมูล และควบคุมตัวผู้ต้องสงสัยได้ ผู้ฝ่าฝืนคำสั่งมีโทษจำคุกไม่เกินสองปี",
          "หลังรัฐประหาร คำสั่งใหม่ออกมาได้ชั่วข้ามคืน และมักถูกใช้กับนักศึกษา นักวิชาการ และสื่อมวลชนก่อน ตรวจสอบว่ามีคำสั่งอะไรบังคับใช้อยู่ก่อนลงมือทำอะไร",
        ],
      },
      {
        id: "if-you-speak-out",
        heading: "ถ้าคุณเลือกออกมาแสดงออก",
        body: [
          "การแสดงออกโดยสงบเป็นสิทธิ แต่หลังรัฐประหาร อาจนำไปสู่การจับกุมและการดำเนินคดี ข้อแนะนำเหล่านี้ช่วยลดความเสี่ยงได้ แต่ทำให้หมดไปไม่ได้",
        ],
        items: [
          "ยึดสันติวิธีไม่ว่าจะเกิดอะไรขึ้นรอบตัว ความรุนแรงทำร้ายผู้คน เปิดโอกาสให้ฝ่ายผู้มีอำนาจใช้ปราบปราม และทำให้เสียแรงสนับสนุนจากสังคม",
          "ไปกับคนที่ไว้ใจ บอกแผนกับคนที่ไม่ได้ไปด้วย และนัดจุดเจอกันไว้เผื่อพลัดหลง",
          "เขียนเบอร์ช่วยเหลือทางกฎหมายไว้ที่แขนด้วยปากกา เผื่อโทรศัพท์ถูกยึด",
          "รู้ว่ามีข้อห้ามอะไรและโทษเป็นอย่างไร เพื่อให้ตัดสินใจโดยรู้เท่าทัน",
          "อยู่ห่างจากแนวรั้วกั้นและแนวทหารหรือตำรวจ และอย่ายั่วยุ",
          "คิดถึงข้อมูลในโทรศัพท์เผื่อถูกตรวจค้น และล็อกโทรศัพท์ด้วยรหัสผ่านแทนการสแกนใบหน้าหรือลายนิ้วมือ",
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
          "แจ้งครอบครัวของเพื่อน และแจ้ง BIRSA เราจะช่วยหาความช่วยเหลือ และไม่ปล่อยให้เพื่อนถูกลืม",
        ],
      },
      {
        id: "recording",
        heading: "การบันทึกเหตุการณ์",
        items: [
          "บันทึกที่ทำไว้ในเวลาจริงมีความหมายในภายหลัง ทั้งในชั้นศาลและในประวัติศาสตร์ ถ่ายจากระยะที่ปลอดภัย และอย่าเสี่ยงชีวิตเพื่อภาพเดียว",
          "สำรองไฟล์ไว้นอกโทรศัพท์โดยเร็วที่สุด",
          "เบลอหรือตัดใบหน้าผู้ชุมนุมคนอื่นออกก่อนแชร์ ภาพเพียงภาพเดียวอาจถูกใช้ระบุตัวและดำเนินคดีกับเขาได้",
          "โพสต์ ข้อความ และการแชร์อาจถูกใช้เป็นหลักฐาน กฎหมายว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ใช้กับสิ่งที่คุณโพสต์ออนไลน์ด้วย",
        ],
      },
      {
        id: "look-after-each-other",
        heading: "ดูแลกันและกัน",
        items: [
          "ถามไถ่เพื่อนร่วมชั้น โดยเฉพาะคนที่อยู่คนเดียว อยู่ไกลบ้าน หรือมาจากต่างประเทศ",
          "ส่งต่อข้อมูลที่ตรวจสอบแล้ว ไม่ใช่ความตื่นตระหนก",
          "ความกลัว ความโกรธ และความเหนื่อยล้าเป็นเรื่องปกติ คุยกับคนที่ไว้ใจ หรือโทรสายด่วนสุขภาพจิต 1323 ได้ตลอดเวลา",
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
          "เพื่อนนักศึกษาต่างชาติมีความเสี่ยงต่างออกไป การร่วมกิจกรรมทางการเมืองอาจทำให้ถูกยกเลิกวีซ่าและถูกส่งตัวออกนอกประเทศ นอกเหนือจากความเสี่ยงทางกฎหมายที่นักศึกษาไทยเผชิญ รัฐบาลส่วนใหญ่แนะนำให้พลเมืองของตนอยู่ห่างจากการชุมนุมทางการเมืองในไทย",
          "ทำตามคำแนะนำการเดินทางของรัฐบาลประเทศตน และลงทะเบียนกับสถานทูตถ้ามีบริการ",
          "เก็บหนังสือเดินทาง วีซ่า และเงินสำหรับเดินทางไว้ใกล้ตัว",
          "กองวิเทศสัมพันธ์ช่วยเรื่องมหาวิทยาลัยและวีซ่า ส่วนสถานทูตช่วยเรื่องกงสุล เช่น หนังสือเดินทางหาย หรือการเดินทางออกนอกประเทศ",
        ],
      },
    ],
  },
};

export default coup;
