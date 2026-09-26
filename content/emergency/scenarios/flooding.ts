import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Flooding in Bangkok and around Tha Prachan, from monsoon downpours (worst in
 * September and October) or high water and tides on the Chao Phraya (usually
 * October to December). Draws on TMD and DDPM warnings, BMA flood
 * announcements, MEA electrical safety advice, the Department of Disease
 * Control on leptospirosis, and the US National Weather Service on moving
 * water.
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
        en: "Thai Post, DDPM cell broadcast on critical canal levels in Bangkok, 26 September 2026",
        th: "ไทยโพสต์ ปภ. ส่ง Cell Broadcast เตือนระดับน้ำในคลองวิกฤตในกรุงเทพฯ 26 กันยายน 2569",
      },
      href: "https://www.thaipost.net/x-cite-news/1076611/",
    },
    {
      label: {
        en: "Thai Meteorological Department, weather warnings",
        th: "กรมอุตุนิยมวิทยา ประกาศเตือนภัยลักษณะอากาศ",
      },
      href: "https://www.tmd.go.th/en/warning-and-events/warning-storm",
    },
    {
      label: {
        en: "The Nation, DDPM warns Bangkok and 70 provinces of flash floods",
        th: "The Nation ปภ. เตือนกรุงเทพฯ และ 70 จังหวัดระวังน้ำท่วมฉับพลัน",
      },
      href: "https://www.nationthailand.com/news/general/40071375",
    },
    {
      label: {
        en: "The Nation, Bangkok governor warns canal side communities in the east",
        th: "The Nation ผู้ว่าฯ กทม. เตือนชุมชนริมคลองฝั่งตะวันออก",
      },
      href: "https://www.nationthailand.com/news/general/40071486",
    },
    {
      label: {
        en: "The Nation, BMA warns small cars off flooded roads",
        th: "The Nation กทม. เตือนรถเล็กเลี่ยงถนนที่น้ำท่วม",
      },
      href: "https://www.nationthailand.com/thailand/bangkok/40071509",
    },
    {
      label: {
        en: "Government Public Relations Department, DDPM warning on the rising Chao Phraya",
        th: "กรมประชาสัมพันธ์ ปภ. เตือนเฝ้าระวังระดับน้ำแม่น้ำเจ้าพระยาเพิ่มสูงขึ้น",
      },
      href: "https://www.prd.go.th/th/content/category/detail/id/33/iid/543624",
    },
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
  reviewed: "2026-09-26",
  en: {
    title: "Flooding",
    summary:
      "Heavy rain in the monsoon, at its worst in September and October, can flood roads and canals across Bangkok within hours. Tha Prachan also sits on the Chao Phraya, and from October to December high water and tides can flood the piers and riverside roads around campus.",
    banner:
      "Flooding is affecting parts of Bangkok. Avoid floodwater and check your route before you travel.",
    now: [
      "Do not walk, ride or drive through moving water. Fifteen centimetres can knock you off your feet.",
      "Keep away from anything electrical that is wet, and from fallen cables. Report them to MEA on 1130.",
      "If you live beside a canal or on low ground, move your belongings and vehicle somewhere higher, and keep documents and valuables in a sealed bag.",
      "Check your route, class changes and express boat services before you set off.",
      "If staff, officials or an emergency alert on your phone tell you to move or leave, go straight away.",
    ],
    sections: [
      {
        id: "travelling",
        heading: "Travelling to and from campus",
        items: [
          "Turn around if a road, underpass or path is flooded. Floodwater hides open drains, loose manhole covers and debris.",
          "In a heavy downpour the east and north of the city, including Min Buri, Lat Krabang, Sai Mai, Lat Phrao and Chaeng Watthana Road, often flood first. Leave extra time if you travel from there.",
          "The BMA closes badly flooded roads to small cars. Check Traffy Fondue on LINE or call 1555 for flooded roads before you leave.",
          "Roads by the river, around Tha Chang and Sanam Luang, flood first when the Chao Phraya is high. Express boats may skip piers or stop running.",
          "If a vehicle stalls in water, get out and move to higher ground if it is safe to do so.",
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
          "If you live on a ground floor near a canal or the river, agree with a friend on somewhere higher you can go.",
          "Check on neighbours and friends who may need help to move, such as older people and anyone who is ill or disabled.",
        ],
      },
      {
        id: "warnings",
        heading: "Getting warnings",
        items: [
          "Turn on emergency alerts on your phone. DDPM sends flood warnings by cell broadcast in Thai and English to every phone in the area at risk.",
          "If an alert says canal levels are critical, anyone beside a canal or on low ground should move belongings and vehicles higher, keep documents and valuables safe, watch for electrical hazards and check on people who may need help.",
          "The Thai Meteorological Department issues numbered heavy rain warnings on tmd.go.th and on 1182. Each one says which days and areas to expect.",
          "Follow BMA announcements about the Chao Phraya and high tides. They usually say which days and hours the river will peak.",
          "Report flooding in Bangkok on 1555 or through Traffy Fondue on LINE. For disaster help, call DDPM on 1784 or message @1784DDPM on LINE.",
        ],
      },
    ],
  },
  th: {
    title: "น้ำท่วม",
    summary:
      "ฝนตกหนักช่วงฤดูมรสุม ซึ่งหนักที่สุดในเดือนกันยายนและตุลาคม ทำให้ถนนและคลองทั่วกรุงเทพฯ ท่วมได้ภายในไม่กี่ชั่วโมง ท่าพระจันทร์ยังอยู่ริมแม่น้ำเจ้าพระยา ช่วงเดือนตุลาคมถึงธันวาคม น้ำเหนือและน้ำทะเลหนุนอาจทำให้ท่าเรือและถนนริมน้ำรอบมหาวิทยาลัยท่วมได้",
    banner: "เกิดน้ำท่วมในหลายพื้นที่ของกรุงเทพฯ หลีกเลี่ยงการลุยน้ำ และตรวจเส้นทางก่อนเดินทาง",
    now: [
      "อย่าเดิน ขี่ หรือขับรถผ่านน้ำที่ไหลเชี่ยว น้ำลึกเพียง 15 เซนติเมตรก็ทำให้ล้มได้",
      "อยู่ห่างจากอุปกรณ์ไฟฟ้าที่เปียกน้ำและสายไฟที่ขาด แจ้งการไฟฟ้านครหลวงที่ 1130",
      "ถ้าพักริมคลองหรือในพื้นที่ลุ่มต่ำ ให้ขนย้ายสิ่งของและรถขึ้นที่สูง และเก็บเอกสารกับของมีค่าใส่ถุงที่ปิดสนิท",
      "ตรวจเส้นทาง ประกาศเรื่องการเรียน และการเดินเรือด่วนก่อนออกจากบ้าน",
      "ถ้าเจ้าหน้าที่หรือข้อความเตือนภัยในโทรศัพท์ให้ย้ายหรืออพยพ ให้ไปทันที",
    ],
    sections: [
      {
        id: "travelling",
        heading: "การเดินทางไปกลับมหาวิทยาลัย",
        items: [
          "ถ้าถนน อุโมงค์ลอด หรือทางเดินมีน้ำท่วม ให้กลับไปใช้ทางอื่น น้ำท่วมซ่อนท่อระบายน้ำที่เปิดอยู่ ฝาท่อที่หลุด และเศษวัสดุไว้",
          "เวลาฝนตกหนัก ฝั่งตะวันออกและทางเหนือของเมือง เช่น มีนบุรี ลาดกระบัง สายไหม ลาดพร้าว และถนนแจ้งวัฒนะ มักท่วมก่อน ถ้าเดินทางมาจากแถวนั้นให้เผื่อเวลา",
          "กทม. ปิดถนนที่น้ำท่วมสูงไม่ให้รถเล็กผ่าน ตรวจถนนที่น้ำท่วมผ่าน Traffy Fondue ใน LINE หรือโทร 1555 ก่อนออกเดินทาง",
          "เมื่อน้ำเจ้าพระยาขึ้นสูง ถนนริมแม่น้ำแถวท่าช้างและสนามหลวงมักท่วมก่อน เรือด่วนอาจงดจอดบางท่าหรืองดเดินเรือ",
          "ถ้ารถดับกลางน้ำ ให้ออกจากรถและไปที่สูงถ้าปลอดภัย",
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
          "ถ้าพักชั้นล่างใกล้คลองหรือแม่น้ำ ให้ตกลงกับเพื่อนไว้ก่อนว่าจะไปพักที่สูงที่ไหนได้",
          "ดูแลเพื่อนบ้านและเพื่อนที่อาจย้ายเองไม่ไหว เช่น ผู้สูงอายุ คนป่วย และผู้พิการ",
        ],
      },
      {
        id: "warnings",
        heading: "การรับคำเตือน",
        items: [
          "เปิดการแจ้งเตือนเหตุฉุกเฉินในโทรศัพท์ ปภ. ส่งคำเตือนน้ำท่วมผ่านระบบ Cell Broadcast เป็นภาษาไทยและอังกฤษถึงโทรศัพท์ทุกเครื่องในพื้นที่เสี่ยง",
          "ถ้าข้อความเตือนว่าระดับน้ำในคลองวิกฤต คนที่พักริมคลองหรือในพื้นที่ลุ่มต่ำควรขนย้ายสิ่งของและรถขึ้นที่สูง เก็บเอกสารและของมีค่าให้ปลอดภัย ระวังไฟฟ้าดูด และดูแลคนที่ต้องการความช่วยเหลือ",
          "กรมอุตุนิยมวิทยาออกประกาศเตือนฝนตกหนักเป็นฉบับ ดูได้ที่ tmd.go.th หรือโทร 1182 แต่ละฉบับบอกวันและพื้นที่ที่ต้องระวัง",
          "ติดตามประกาศของกรุงเทพมหานครเรื่องระดับน้ำเจ้าพระยาและน้ำทะเลหนุน ซึ่งมักบอกวันและช่วงเวลาที่น้ำขึ้นสูงสุด",
          "แจ้งน้ำท่วมในกรุงเทพฯ ได้ที่ 1555 หรือ Traffy Fondue ใน LINE ขอความช่วยเหลือจากภัยพิบัติได้ที่ ปภ. 1784 หรือ LINE @1784DDPM",
        ],
      },
    ],
  },
};

export default flooding;
