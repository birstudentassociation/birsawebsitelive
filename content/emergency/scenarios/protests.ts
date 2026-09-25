import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Large gatherings near campus, whatever their cause. Safety guidance only,
 * taking no position on any gathering. Crowd advice from crowd scientist
 * G. Keith Still, irritant advice from the US CDC fact sheet on riot control
 * agents, and the UK FCDO's advice to foreign nationals in Thailand.
 */
const protests: EmergencyScenario = {
  id: "protests",
  severity: "warning",
  hero: "red",
  group: "unrest",
  keyContacts: ["police", "ambulance", "touristPolice"],
  moreContacts: ["erawan", "tlhr", "tuLaw", "facultyOffice", "birOffice", "oia"],
  sources: [
    {
      label: {
        en: "The Conversation, ten tips for surviving a crowd crush",
        th: "The Conversation สิบวิธีเอาตัวรอดเมื่อฝูงชนเบียดอัด",
      },
      href: "https://theconversation.com/ten-tips-for-surviving-a-crowd-crush-112169",
    },
    {
      label: {
        en: "US CDC, riot control agents fact sheet",
        th: "CDC สหรัฐฯ ข้อเท็จจริงเรื่องสารควบคุมฝูงชน (แก๊สน้ำตา)",
      },
      href: "https://www.cdc.gov/chemical-emergencies/chemical-fact-sheets/riot-control-agents.html",
    },
    {
      label: {
        en: "UK FCDO, Thailand safety and security",
        th: "กระทรวงการต่างประเทศสหราชอาณาจักร คำแนะนำความปลอดภัยในประเทศไทย",
      },
      href: "https://www.gov.uk/foreign-travel-advice/thailand/safety-and-security",
    },
    {
      label: {
        en: "Thai Code of Criminal Procedure, rights on arrest (section 7/1)",
        th: "ประมวลกฎหมายวิธีพิจารณาความอาญา มาตรา 7/1 สิทธิของผู้ถูกจับ",
      },
      href: "https://en.wikisource.org/wiki/Translation:Criminal_Procedure_Code_of_Thailand/Provisions",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Protests near campus",
    summary:
      "Tha Prachan is next to Sanam Luang and a short walk from Ratchadamnoen Avenue and Democracy Monument, where large gatherings often take place. This guide is about staying safe, whatever the gathering is about.",
    banner: "There is a large gathering near campus. Plan your route and follow official updates.",
    now: [
      "Check the latest update on this page and faculty announcements before you travel.",
      "Plan a route that avoids the gathering. Allow extra time, as roads and piers may close.",
      "If you are near a crowd and do not want to be there, leave early by a side street.",
      "Keep your phone charged and your ID with you.",
      "Tell someone where you are going and when you expect to be back.",
    ],
    sections: [
      {
        id: "on-campus",
        heading: "On campus",
        items: [
          "Follow instructions from security and faculty staff. Gates may be closed at short notice.",
          "If classes continue, the faculty will say so. If you cannot get there safely, tell your lecturer.",
        ],
      },
      {
        id: "if-you-are-in-a-crowd",
        heading: "If you are in a crowd",
        items: [
          "Know where the way out is. Keep to the edges and away from barriers, stages and narrow streets.",
          "If the crowd gets so tight that you are pushed along, go with the flow, not against it. Hold your arms in front of your chest, like a boxer, to keep room to breathe.",
          "Move sideways across the flow a little at a time, in the pauses between surges, towards the edge.",
          "If you fall, get up quickly. If you cannot, curl up on your side and protect your head.",
          "Agree a meeting point with friends in case you are separated. Phone networks often fail in big crowds.",
        ],
      },
      {
        id: "tear-gas",
        heading: "Tear gas and other irritants",
        items: [
          "Get away from the cloud into fresh air. The gas is heavy and stays low, so higher ground helps.",
          "Do not rub your eyes. Rinse them with plain clean water for 10 to 15 minutes.",
          "Take out contact lenses and throw them away.",
          "Wash your skin with soap and water, and put the clothes you wore in a sealed bag.",
          "Get medical help for breathing trouble or pain that does not ease. Call 1669.",
        ],
      },
      {
        id: "police",
        heading: "If police stop you",
        items: [
          "Stay calm and polite. Show your ID if asked.",
          "Under the Code of Criminal Procedure, if you are arrested you have the right to tell a relative or someone you trust where you are, and to see a lawyer.",
          "Do not sign anything you have not read and understood. You can ask for a copy.",
          "Thai Lawyers for Human Rights gives free legal help at any hour on 092-271-3172.",
        ],
      },
      {
        id: "international-students",
        heading: "If you are an international student",
        body: [
          "The UK and other governments advise foreign nationals in Thailand to avoid protests and political gatherings. Taking part, or even being there, can put your visa at risk, and Thai law on criticising the monarchy is strict and applies to posts online. Keep away, and if you are caught up in one, leave as soon as you can.",
        ],
      },
      {
        id: "online",
        heading: "What you post",
        items: [
          "Before you post photos or videos, think about whether they show other people's faces.",
          "Check any claim of violence or arrests with a reliable source before sharing it.",
        ],
      },
    ],
  },
  th: {
    title: "การชุมนุมใกล้มหาวิทยาลัย",
    summary:
      "ท่าพระจันทร์อยู่ติดสนามหลวง และเดินไปถนนราชดำเนินและอนุสาวรีย์ประชาธิปไตยได้ ซึ่งเป็นพื้นที่ชุมนุมขนาดใหญ่บ่อยครั้ง หน้านี้ว่าด้วยความปลอดภัยเท่านั้น ไม่ว่าการชุมนุมจะเป็นเรื่องใด",
    banner: "มีการชุมนุมขนาดใหญ่ใกล้มหาวิทยาลัย วางแผนเส้นทาง และติดตามประกาศทางการ",
    now: [
      "อ่านข้อมูลล่าสุดในหน้านี้และประกาศของคณะก่อนเดินทาง",
      "วางแผนเส้นทางเลี่ยงพื้นที่ชุมนุม และเผื่อเวลา เพราะถนนและท่าเรืออาจปิด",
      "ถ้าอยู่ใกล้ฝูงชนแต่ไม่ได้ตั้งใจจะอยู่ตรงนั้น ให้ออกไปก่อนทางซอยด้านข้าง",
      "ชาร์จโทรศัพท์ให้เต็ม และพกบัตรประชาชนหรือบัตรนักศึกษา",
      "บอกคนที่ไว้ใจว่าจะไปไหนและจะกลับเมื่อไร",
    ],
    sections: [
      {
        id: "on-campus",
        heading: "ในมหาวิทยาลัย",
        items: [
          "ทำตามคำแนะนำของเจ้าหน้าที่รักษาความปลอดภัยและเจ้าหน้าที่คณะ ประตูอาจปิดกะทันหัน",
          "ถ้ายังมีเรียน คณะจะแจ้ง ถ้าเดินทางมาอย่างปลอดภัยไม่ได้ ให้แจ้งอาจารย์",
        ],
      },
      {
        id: "if-you-are-in-a-crowd",
        heading: "ถ้าอยู่ในฝูงชน",
        items: [
          "รู้ไว้ว่าทางออกอยู่ตรงไหน อยู่ริมขอบฝูงชน ห่างจากแนวรั้ว เวที และซอยแคบ",
          "ถ้าคนแน่นจนถูกดันไปเอง ให้ไหลไปตามแรงดัน อย่าต้าน ยกแขนตั้งการ์ดไว้หน้าอกแบบนักมวย เพื่อให้มีที่ว่างหายใจ",
          "ค่อย ๆ ขยับเฉียงออกทางด้านข้างทีละนิด ในจังหวะที่แรงดันผ่อนลง เพื่อไปถึงขอบฝูงชน",
          "ถ้าล้ม ให้รีบลุก ถ้าลุกไม่ได้ ให้นอนตะแคงขดตัวและป้องศีรษะ",
          "นัดจุดเจอกับเพื่อนไว้ก่อนเผื่อพลัดหลง สัญญาณโทรศัพท์มักล่มเมื่อคนเยอะ",
        ],
      },
      {
        id: "tear-gas",
        heading: "แก๊สน้ำตาและสารระคายเคือง",
        items: [
          "ออกจากกลุ่มควันไปที่อากาศบริสุทธิ์ แก๊สหนักและลอยต่ำ การขึ้นที่สูงจึงช่วยได้",
          "อย่าขยี้ตา ล้างตาด้วยน้ำสะอาดนาน 10 ถึง 15 นาที",
          "ถอดคอนแทกต์เลนส์แล้วทิ้งไป",
          "ล้างผิวด้วยสบู่และน้ำ แล้วใส่เสื้อผ้าที่ใส่อยู่ลงถุงปิดสนิท",
          "ถ้าหายใจลำบากหรือเจ็บไม่หาย ให้ไปพบแพทย์ โทร 1669",
        ],
      },
      {
        id: "police",
        heading: "ถ้าถูกตำรวจเรียกตรวจ",
        items: [
          "ใจเย็นและสุภาพ แสดงบัตรประชาชนเมื่อถูกขอ",
          "ตามประมวลกฎหมายวิธีพิจารณาความอาญา ถ้าถูกจับ คุณมีสิทธิแจ้งญาติหรือผู้ที่ไว้วางใจว่าถูกจับและถูกควบคุมตัวอยู่ที่ไหน และมีสิทธิพบทนายความ",
          "อย่าลงชื่อในเอกสารที่ยังไม่ได้อ่านหรือไม่เข้าใจ และขอสำเนาได้",
          "ศูนย์ทนายความเพื่อสิทธิมนุษยชนช่วยเหลือทางกฎหมายโดยไม่มีค่าใช้จ่าย ตลอด 24 ชั่วโมง โทร 092-271-3172",
        ],
      },
      {
        id: "international-students",
        heading: "สำหรับนักศึกษาต่างชาติ",
        body: [
          "สหราชอาณาจักรและอีกหลายประเทศแนะนำให้ชาวต่างชาติในไทยหลีกเลี่ยงการชุมนุมทางการเมือง การเข้าร่วมหรือแม้แต่อยู่ในพื้นที่อาจกระทบวีซ่า และกฎหมายเกี่ยวกับสถาบันพระมหากษัตริย์ของไทยเข้มงวด รวมถึงโพสต์ออนไลน์ด้วย ถ้ามีเพื่อนต่างชาติอยู่ด้วย ช่วยพาเขาออกจากพื้นที่",
        ],
      },
      {
        id: "online",
        heading: "สิ่งที่คุณโพสต์",
        items: [
          "ก่อนโพสต์รูปหรือคลิป ลองคิดว่ามีใบหน้าของคนอื่นอยู่ด้วยหรือไม่",
          "ตรวจสอบข่าวเรื่องความรุนแรงหรือการจับกุมกับแหล่งที่เชื่อถือได้ก่อนแชร์",
        ],
      },
    ],
  },
};

export default protests;
