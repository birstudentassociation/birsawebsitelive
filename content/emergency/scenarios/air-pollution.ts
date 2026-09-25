import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Hazardous PM2.5 in Bangkok, usually January to March. Uses the Pollution
 * Control Department's colour bands under the 37.5 µg/m³ 24-hour standard in
 * force since 1 June 2023, and the Department of Health's mask advice.
 */
const airPollution: EmergencyScenario = {
  id: "air-pollution",
  severity: "warning",
  hero: "brown",
  group: "hazard",
  keyContacts: ["air4thai", "ambulance"],
  moreContacts: ["tuClinic", "ddc", "facultyOffice"],
  sources: [
    {
      label: {
        en: "Pollution Control Department, new PM2.5 standard from 1 June 2023",
        th: "กรมควบคุมมลพิษ ค่ามาตรฐาน PM2.5 ใหม่ บังคับใช้ 1 มิถุนายน 2566",
      },
      href: "https://www.pcd.go.th/pcd_news/29901/",
    },
    {
      label: {
        en: "Department of Health, who should wear an N95 mask (via Hfocus)",
        th: "กรมอนามัย แนะกลุ่มไหนควรสวม N95 (Hfocus)",
      },
      href: "https://www.hfocus.org/content/2023/11/29001",
    },
    {
      label: {
        en: "Wikipedia, 2025 Bangkok smog",
        th: "Wikipedia วิกฤตฝุ่นกรุงเทพฯ 2568",
      },
      href: "https://en.wikipedia.org/wiki/2025_Bangkok_smog",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Air pollution",
    summary:
      "Fine dust (PM2.5) builds up over Bangkok most years between January and March. In January 2025 it closed hundreds of schools. Readings in the orange or red band harm health, especially for people with asthma or heart conditions.",
    banner:
      "PM2.5 dust in Bangkok is at a harmful level. Limit time outdoors and wear a well-fitting mask.",
    now: [
      "Check the current reading for Phra Nakhon on Air4Thai before you go out.",
      "Outdoors, wear a well-fitting N95 or KN95 mask. A loose cloth mask does not stop fine dust.",
      "Keep windows closed and spend time in air-conditioned or filtered rooms.",
      "Cut down on running, cycling and other hard exercise outdoors.",
      "If you have asthma, keep your reliever inhaler with you and follow your action plan.",
    ],
    sections: [
      {
        id: "reading-the-colours",
        heading: "What the colours mean",
        body: [
          "Thailand reports PM2.5 as a 24-hour average in micrograms per cubic metre. The national standard is 37.5.",
        ],
        items: [
          "Blue, 0 to 15, very good.",
          "Green, 15.1 to 25, good.",
          "Yellow, 25.1 to 37.5, moderate. People with lung or heart conditions should take care.",
          "Orange, 37.6 to 75, starting to affect health. Everyone should limit time outdoors and wear a mask outside.",
          "Red, above 75, affecting health. Avoid going outside where you can. Wear a mask outdoors, and consider one indoors if the air is not filtered.",
        ],
      },
      {
        id: "masks",
        heading: "Masks",
        items: [
          "An N95 or KN95 mask protects you only if it seals around your nose and chin. Pinch the metal strip to fit your nose.",
          "Replace a mask when it gets damp, dirty or hard to breathe through.",
          "The Department of Health warns that people with severe lung or heart disease may struggle to breathe through an N95. Ask a doctor which mask suits you.",
        ],
      },
      {
        id: "symptoms",
        heading: "When to get help",
        items: [
          "Sore eyes, a scratchy throat and a cough are common on bad days. Rinse your eyes and nose with saline and drink water.",
          "Go to the TU Virtual Clinic or a doctor if a cough will not go away or your asthma is getting worse.",
          "Call 1669 at once for chest pain, severe breathlessness or wheezing that your inhaler does not relieve.",
        ],
      },
      {
        id: "classes",
        heading: "Classes",
        body: [
          "On the worst days the university or faculty may move teaching online or ask people to work from home. Check your Thammasat email and course pages the evening before.",
        ],
      },
    ],
  },
  th: {
    title: "ฝุ่น PM2.5",
    summary:
      "ฝุ่นละเอียด PM2.5 สะสมในกรุงเทพฯ แทบทุกปีช่วงมกราคมถึงมีนาคม เดือนมกราคม 2568 ฝุ่นหนักจนโรงเรียนหลายร้อยแห่งต้องปิด ค่าฝุ่นระดับสีส้มหรือสีแดงเป็นอันตรายต่อสุขภาพ โดยเฉพาะผู้ที่เป็นหอบหืดหรือโรคหัวใจ",
    banner:
      "ค่าฝุ่น PM2.5 ในกรุงเทพฯ อยู่ในระดับที่มีผลต่อสุขภาพ ลดเวลาอยู่กลางแจ้ง และสวมหน้ากากที่แนบกระชับ",
    now: [
      "ดูค่าฝุ่นล่าสุดของเขตพระนครใน Air4Thai ก่อนออกจากบ้าน",
      "เมื่ออยู่กลางแจ้ง ให้สวมหน้ากาก N95 หรือ KN95 ที่แนบกระชับ หน้ากากผ้าหลวม ๆ กันฝุ่นละเอียดไม่ได้",
      "ปิดหน้าต่าง และอยู่ในห้องที่เปิดแอร์หรือมีเครื่องฟอกอากาศ",
      "งดวิ่ง ปั่นจักรยาน และออกกำลังกายหนักกลางแจ้ง",
      "ถ้าเป็นหอบหืด ให้พกยาพ่นบรรเทาอาการไว้ และทำตามแผนการรักษาที่แพทย์ให้",
    ],
    sections: [
      {
        id: "reading-the-colours",
        heading: "ความหมายของสีค่าฝุ่น",
        body: [
          "ประเทศไทยรายงานค่า PM2.5 เป็นค่าเฉลี่ย 24 ชั่วโมง หน่วยไมโครกรัมต่อลูกบาศก์เมตร ค่ามาตรฐานคือ 37.5",
        ],
        items: [
          "สีฟ้า 0 ถึง 15 คุณภาพอากาศดีมาก",
          "สีเขียว 15.1 ถึง 25 คุณภาพอากาศดี",
          "สีเหลือง 25.1 ถึง 37.5 ปานกลาง ผู้ที่มีโรคปอดหรือโรคหัวใจควรระวัง",
          "สีส้ม 37.6 ถึง 75 เริ่มมีผลต่อสุขภาพ ทุกคนควรลดเวลากลางแจ้งและสวมหน้ากากเมื่อออกนอกอาคาร",
          "สีแดง มากกว่า 75 มีผลต่อสุขภาพ งดออกนอกอาคารถ้าทำได้ สวมหน้ากากเมื่ออยู่กลางแจ้ง และพิจารณาสวมในอาคารถ้าไม่มีเครื่องฟอกอากาศ",
        ],
      },
      {
        id: "masks",
        heading: "หน้ากาก",
        items: [
          "หน้ากาก N95 หรือ KN95 จะป้องกันได้ก็ต่อเมื่อแนบสนิทรอบจมูกและคาง บีบแถบโลหะให้เข้ากับสันจมูก",
          "เปลี่ยนหน้ากากเมื่อชื้น สกปรก หรือหายใจลำบาก",
          "กรมอนามัยเตือนว่าผู้ที่เป็นโรคปอดหรือโรคหัวใจรุนแรงอาจหายใจผ่าน N95 ลำบาก ควรปรึกษาแพทย์ว่าหน้ากากแบบไหนเหมาะกับตนเอง",
        ],
      },
      {
        id: "symptoms",
        heading: "เมื่อไรควรไปพบแพทย์",
        items: [
          "วันที่ฝุ่นหนัก มักแสบตา ระคายคอ และไอ ล้างตาและล้างจมูกด้วยน้ำเกลือ และดื่มน้ำมาก ๆ",
          "ไปห้องพยาบาล Virtual Clinic หรือพบแพทย์ ถ้าไอไม่หาย หรืออาการหอบหืดแย่ลง",
          "โทร 1669 ทันทีถ้าเจ็บหน้าอก หายใจไม่ทันอย่างรุนแรง หรือหายใจมีเสียงวี้ดที่ยาพ่นช่วยไม่ได้",
        ],
      },
      {
        id: "classes",
        heading: "การเรียน",
        body: [
          "วันที่ฝุ่นหนักมาก มหาวิทยาลัยหรือคณะอาจให้เรียนออนไลน์หรือทำงานจากบ้าน ตรวจอีเมลธรรมศาสตร์และหน้ารายวิชาตั้งแต่เย็นวันก่อน",
        ],
      },
    ],
  },
};

export default airPollution;
