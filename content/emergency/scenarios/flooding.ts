import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Flooding around Tha Prachan, from heavy rain or high tides on the Chao
 * Phraya (usually October to December). Draws on BMA flood warnings, MEA
 * electrical safety advice, the Department of Disease Control on
 * leptospirosis, and the US National Weather Service on moving water.
 */
const flooding: EmergencyScenario = {
  id: "flooding",
  severity: "warning",
  hero: "blue",
  group: "hazard",
  keyContacts: ["bma", "ambulance", "mea"],
  moreContacts: ["bmaFlood", "ddpm", "tmd", "police", "ddc", "tuClinic", "facultyOffice"],
  sources: [
    {
      label: {
        en: "The Nation, high tide and Chao Phraya flood alerts for Bangkok",
        th: "The Nation ประกาศเตือนน้ำทะเลหนุนและน้ำเจ้าพระยาล้นในกรุงเทพฯ",
      },
      href: "https://www.nationthailand.com/news/general/40056529",
    },
    {
      label: {
        en: "MEA, using electricity safely in flooded areas",
        th: "MEA แนะวิธีใช้ไฟฟ้าให้ปลอดภัยในพื้นที่น้ำท่วม",
      },
      href: "https://www.mea.or.th/public-relations/corporate-news-activities/announcement/10-11-2025",
    },
    {
      label: {
        en: "Department of Disease Control, leptospirosis",
        th: "กรมควบคุมโรค โรคเลปโตสไปโรซิส (โรคฉี่หนู)",
      },
      href: "https://ddc.moph.go.th/disease_detail.php?d=16",
    },
    {
      label: {
        en: "US National Weather Service, Turn Around Don't Drown",
        th: "กรมอุตุนิยมวิทยาสหรัฐฯ แคมเปญ Turn Around Don't Drown",
      },
      href: "https://www.weather.gov/aly/fldsafetyTuesday",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Flooding",
    summary:
      "Tha Prachan sits on the Chao Phraya. Heavy rain and high tides, most often from October to December, can flood the roads and piers around campus within hours.",
    banner:
      "Flooding is affecting the Tha Prachan area. Avoid floodwater and check before you travel.",
    now: [
      "Do not walk, ride or drive through moving water. Fifteen centimetres can knock you off your feet.",
      "Keep away from anything electrical that is wet, and from fallen cables. Report them to MEA on 1130.",
      "Move your belongings, especially electronics and documents, off the floor or upstairs.",
      "Check for class changes and travel updates before you set off.",
      "If staff or officials tell you to leave, go straight away.",
    ],
    sections: [
      {
        id: "travelling",
        heading: "Travelling to and from campus",
        items: [
          "Turn around if a road, underpass or path is flooded. Floodwater hides open drains, loose manhole covers and debris.",
          "Roads by the river, around Tha Chang and Sanam Luang, often flood first. Express boats may skip piers or stop running when the river is high.",
          "If a vehicle stalls in water, get out and move to higher ground if it is safe to do so.",
          "Allow extra time. Traffic around the old town slows sharply when roads flood.",
        ],
      },
      {
        id: "electricity",
        heading: "Electricity",
        items: [
          "Never touch a switch, socket or appliance while you are standing in water or your hands are wet.",
          "If water is rising indoors and you can reach the main switch from a dry spot, turn the power off.",
          "Stay well away from fallen power cables and anything touching them, including water. Call MEA on 1130.",
          "Have a qualified electrician check wiring and appliances that got wet before you use them again.",
        ],
      },
      {
        id: "health",
        heading: "Health after contact with floodwater",
        body: [
          "Floodwater carries sewage and animal urine. Leptospirosis, known in Thai as rat urine fever, gets in through cuts and soft wet skin and is common after floods in Thailand.",
        ],
        items: [
          "Wear boots if you have to walk through water, and cover any cuts.",
          "Wash with soap and clean water as soon as you can afterwards.",
          "See a doctor straight away if you get a high fever, headache and aching calf muscles within about two weeks of wading through floodwater. Say you were in floodwater. Do not treat it yourself.",
          "Drink bottled or boiled water until you know the tap water is safe.",
        ],
      },
      {
        id: "at-home",
        heading: "Where you live",
        items: [
          "Keep a bag ready with water, a torch, a power bank, medicines, your ID and some cash.",
          "Put important documents in a sealed plastic bag.",
          "If you live on a ground floor near the river, agree with a friend on somewhere higher you can go.",
        ],
      },
      {
        id: "warnings",
        heading: "Getting warnings",
        items: [
          "Turn on emergency alerts on your phone. DDPM sends flood warnings by cell broadcast in Thai and English.",
          "Follow BMA announcements about high tides. They usually say which days and hours the river will peak.",
          "Report flooding in Bangkok to the BMA hotline on 1555.",
        ],
      },
    ],
  },
  th: {
    title: "น้ำท่วม",
    summary:
      "ท่าพระจันทร์อยู่ริมแม่น้ำเจ้าพระยา ฝนตกหนักและน้ำทะเลหนุน ซึ่งมักเกิดช่วงเดือนตุลาคมถึงธันวาคม ทำให้ถนนและท่าเรือรอบมหาวิทยาลัยท่วมได้ภายในไม่กี่ชั่วโมง",
    banner: "เกิดน้ำท่วมบริเวณท่าพระจันทร์ หลีกเลี่ยงการลุยน้ำ และตรวจสอบเส้นทางก่อนเดินทาง",
    now: [
      "อย่าเดิน ขี่ หรือขับรถผ่านน้ำที่ไหลเชี่ยว น้ำลึกเพียง 15 เซนติเมตรก็ทำให้ล้มได้",
      "อยู่ห่างจากอุปกรณ์ไฟฟ้าที่เปียกน้ำและสายไฟที่ขาด แจ้งการไฟฟ้านครหลวงที่ 1130",
      "ยกของขึ้นที่สูงหรือขึ้นชั้นบน โดยเฉพาะอุปกรณ์อิเล็กทรอนิกส์และเอกสาร",
      "ตรวจประกาศเรื่องการเรียนและเส้นทางเดินทางก่อนออกจากบ้าน",
      "ถ้าเจ้าหน้าที่ให้อพยพ ให้ไปทันที",
    ],
    sections: [
      {
        id: "travelling",
        heading: "การเดินทางไปกลับมหาวิทยาลัย",
        items: [
          "ถ้าถนน อุโมงค์ลอด หรือทางเดินมีน้ำท่วม ให้กลับไปใช้ทางอื่น น้ำท่วมซ่อนท่อระบายน้ำที่เปิดอยู่ ฝาท่อที่หลุด และเศษวัสดุไว้",
          "ถนนริมแม่น้ำ แถวท่าช้างและสนามหลวงมักท่วมก่อน เรือด่วนอาจงดจอดบางท่าหรืองดเดินเรือเมื่อน้ำขึ้นสูง",
          "ถ้ารถดับกลางน้ำ ให้ออกจากรถและไปที่สูงถ้าปลอดภัย",
          "เผื่อเวลาเดินทาง รถบริเวณเกาะรัตนโกสินทร์ติดหนักเมื่อถนนมีน้ำท่วม",
        ],
      },
      {
        id: "electricity",
        heading: "ไฟฟ้า",
        items: [
          "ห้ามแตะสวิตช์ ปลั๊ก หรือเครื่องใช้ไฟฟ้าขณะยืนอยู่ในน้ำหรือมือเปียก",
          "ถ้าน้ำเริ่มเข้าในอาคารและเอื้อมถึงเบรกเกอร์หลักจากจุดที่แห้ง ให้ตัดไฟ",
          "อยู่ห่างจากสายไฟที่ขาดและทุกอย่างที่แตะสายไฟ รวมถึงน้ำ โทรแจ้งการไฟฟ้านครหลวง 1130",
          "ให้ช่างไฟฟ้าตรวจสายไฟและเครื่องใช้ที่โดนน้ำก่อนใช้งานอีกครั้ง",
        ],
      },
      {
        id: "health",
        heading: "สุขภาพหลังสัมผัสน้ำท่วม",
        body: [
          "น้ำท่วมปนเปื้อนสิ่งปฏิกูลและปัสสาวะสัตว์ โรคฉี่หนูหรือเลปโตสไปโรซิสเข้าสู่ร่างกายทางบาดแผลและผิวหนังที่แช่น้ำนาน และพบบ่อยในไทยหลังน้ำท่วม",
        ],
        items: [
          "ใส่รองเท้าบูทถ้าจำเป็นต้องลุยน้ำ และปิดแผลให้มิดชิด",
          "ล้างตัวด้วยสบู่และน้ำสะอาดโดยเร็วหลังลุยน้ำ",
          "ถ้ามีไข้สูง ปวดศีรษะ และปวดน่อง ภายในราวสองสัปดาห์หลังลุยน้ำ ให้ไปพบแพทย์ทันทีและบอกว่าเคยลุยน้ำท่วม อย่าซื้อยากินเอง",
          "ดื่มน้ำขวดหรือน้ำต้มสุกจนกว่าจะแน่ใจว่าน้ำประปาปลอดภัย",
        ],
      },
      {
        id: "at-home",
        heading: "ที่พัก",
        items: [
          "เตรียมกระเป๋าฉุกเฉินไว้ มีน้ำดื่ม ไฟฉาย พาวเวอร์แบงก์ ยาประจำตัว บัตรประชาชน และเงินสดจำนวนหนึ่ง",
          "ใส่เอกสารสำคัญในถุงพลาสติกที่ปิดสนิท",
          "ถ้าพักชั้นล่างใกล้แม่น้ำ ให้ตกลงกับเพื่อนไว้ก่อนว่าจะไปพักที่สูงที่ไหนได้",
        ],
      },
      {
        id: "warnings",
        heading: "การรับคำเตือน",
        items: [
          "เปิดการแจ้งเตือนเหตุฉุกเฉินในโทรศัพท์ ปภ. ส่งคำเตือนน้ำท่วมผ่านระบบ Cell Broadcast เป็นภาษาไทยและอังกฤษ",
          "ติดตามประกาศน้ำทะเลหนุนของกรุงเทพมหานคร ซึ่งมักบอกวันและช่วงเวลาที่น้ำขึ้นสูงสุด",
          "แจ้งน้ำท่วมในกรุงเทพฯ ได้ที่สายด่วนกรุงเทพมหานคร 1555",
        ],
      },
    ],
  },
};

export default flooding;
