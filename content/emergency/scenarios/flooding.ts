import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Flooding in Bangkok and around Tha Prachan, from monsoon downpours that fill
 * the canals (worst in September and October) or high water and tides on the
 * Chao Phraya (usually October to December). Written from Thai official
 * sources: DDPM, the BMA and its Drainage and Sewerage Department, the Thai
 * Meteorological Department, MEA and the Department of Disease Control.
 */
const flooding: EmergencyScenario = {
  id: "flooding",
  severity: "critical",
  hero: "red",
  group: "hazard",
  keyContacts: ["bma", "ambulance", "mea"],
  moreContacts: ["bmaFlood", "ddpm", "erawan", "tmd", "police", "ddc", "tuClinic", "facultyOffice"],
  sources: [
    {
      label: {
        en: "Thai PBS, BMA declares all 50 districts a disaster area, 26 September 2026 (Thai)",
        th: "Thai PBS กทม. ยกระดับประกาศเขตภัยพิบัติอุทกภัย ครอบคลุมทั้ง 50 เขต 26 กันยายน 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/558588",
    },
    {
      label: {
        en: "The Bangkok Insight, DDPM cell broadcast on critical canal levels in Bangkok, 26 September 2026 (Thai)",
        th: "The Bangkok Insight ปภ. แจ้งเตือนผ่าน Cell Broadcast ระดับน้ำในคลอง กทม. วิกฤต 26 กันยายน 2569",
      },
      href: "https://www.thebangkokinsight.com/news/politics-general/general/1700728/",
    },
    {
      label: {
        en: "Government Public Relations Department, the BMA's seven flood measures, 26 September 2026 (Thai)",
        th: "กรมประชาสัมพันธ์ กทม. เร่ง 7 มาตรการรับมืออุทกภัย 26 กันยายน 2569",
      },
      href: "https://www.prd.go.th/th/content/category/detail/id/33/iid/545032",
    },
    {
      label: {
        en: "Thai Post, Bangkok governor on nearly 300 mm of rain and canals at critical level (Thai)",
        th: "ไทยโพสต์ ชัชชาติรับฝนสะสมเกือบ 300 มม. คลองหลายสายขึ้นสีแดง",
      },
      href: "https://www.thaipost.net/x-cite-news/1076623/",
    },
    {
      label: {
        en: "BMA Drainage and Sewerage Department, rain, canal and road flood data",
        th: "สำนักการระบายน้ำ กทม. ข้อมูลฝน ระดับน้ำในคลอง และน้ำท่วมถนน",
      },
      href: "https://weather.bangkok.go.th/",
    },
    {
      label: {
        en: "Thai Meteorological Department, weather warnings (Thai)",
        th: "กรมอุตุนิยมวิทยา ประกาศเตือนภัยลักษณะอากาศ",
      },
      href: "https://www.tmd.go.th/warning-and-events/warning-storm",
    },
    {
      label: {
        en: "Government Public Relations Department, DDPM watch on the rising Chao Phraya (Thai)",
        th: "กรมประชาสัมพันธ์ ปภ. แจ้งเฝ้าระวังระดับน้ำแม่น้ำเจ้าพระยาเพิ่มสูงขึ้น",
      },
      href: "https://www.prd.go.th/th/content/category/detail/id/33/iid/543624",
    },
    {
      label: {
        en: "MGR Online, DDPM advice on staying safe in floods (Thai)",
        th: "ผู้จัดการออนไลน์ ปภ. แนะวิธีปฏิบัติตนให้ปลอดภัยช่วงน้ำท่วม",
      },
      href: "https://mgronline.com/uptodate/detail/9680000108066",
    },
    {
      label: {
        en: "MEA, using electricity safely in flooded areas (Thai)",
        th: "การไฟฟ้านครหลวง แนะวิธีใช้ไฟฟ้าให้ปลอดภัยในพื้นที่น้ำท่วม",
      },
      href: "https://www.mea.or.th/public-relations/corporate-news-activities/announcement/10-11-2025",
    },
    {
      label: {
        en: "Hfocus, Department of Disease Control on leptospirosis, melioidosis and electric shock in floods (Thai)",
        th: "Hfocus กรมควบคุมโรคแนะป้องกันไข้ฉี่หนู ไข้ดิน และไฟฟ้าดูดช่วงน้ำท่วม",
      },
      href: "https://www.hfocus.org/content/2026/08/39249",
    },
    {
      label: {
        en: "Department of Disease Control, leptospirosis (Thai)",
        th: "กรมควบคุมโรค โรคเลปโตสไปโรซิส (โรคฉี่หนู)",
      },
      href: "https://ddc.moph.go.th/disease_detail.php?d=16",
    },
  ],
  reviewed: "2026-09-26",
  en: {
    title: "Flooding",
    summary:
      "Heavy monsoon rain, worst in September and October, can fill Bangkok's canals and flood roads across the city within hours. Tha Prachan also sits on the Chao Phraya, and from October to December high water and tides can flood the piers and riverside roads around campus.",
    banner:
      "Canals in Bangkok are at critical levels and roads are flooding. Keep out of floodwater and check your route before you travel.",
    now: [
      "Do not walk, ride or drive through deep or fast water. If you have to cross, go slowly, hold on to something fixed and test the ground ahead.",
      "Keep away from power lines, poles and anything wet that could carry electricity. Report hazards to MEA on 1130.",
      "If you live beside a canal or on low ground, move belongings, valuables and your vehicle somewhere higher now.",
      "Check flooded roads and class changes before you set off, and travel home early.",
      "If officials or an emergency alert on your phone tell you to move or leave, go straight away.",
    ],
    sections: [
      {
        id: "how-it-floods",
        heading: "How Bangkok floods",
        body: [
          "Rain falls into a network of canals that the BMA pumps out into the Chao Phraya. When heavy rain lasts a day or more, the canals fill faster than they can be pumped, and water backs up onto roads and into low ground beside them. The river itself can stay well below its flood wall while the canals overflow.",
          "The BMA publishes live readings from its canal and road sensors at weather.bangkok.go.th. A canal shown as critical is close to overtopping its banks.",
        ],
        items: [
          "In the September 2026 rain the canals reached critical level first in the north and east of the city, including Don Mueang, Lak Si, Sai Mai, Bang Khen, Lat Phrao, Bang Kapi, Min Buri, Lat Krabang and Khlong Sam Wa.",
          "Canals in west Thonburi, including Thawi Watthana, Bang Khae and Phasi Charoen, rose quickly too. If you live there or travel through, check the sensors before you set off.",
        ],
      },
      {
        id: "travelling",
        heading: "Travelling to and from campus",
        items: [
          "Turn back if a road, underpass or path is flooded. Floodwater hides open drains, loose manhole covers and debris. Avoid wading at night.",
          "The BMA closes badly flooded roads to small cars. Check Traffy Fondue on LINE or call 1555 before you leave.",
          "If you drive, look at how deep and how fast the water is before you go in. Do not drive through deep water.",
          "Leave extra time and travel home early. Traffic slows sharply across the city when roads flood, especially in the evening.",
          "During floods the BMA asks residents in flooded areas to move their cars to safe spots such as district offices and schools.",
          "When the Chao Phraya is high, express boats may skip piers or stop running, and roads by Tha Chang and Sanam Luang flood first.",
        ],
      },
      {
        id: "electricity",
        heading: "Electricity",
        items: [
          "Never touch a switch, socket or appliance while you are wet or standing in water.",
          "If water reaches the sockets and you can reach the main switch from a dry spot, turn the power off. If you cannot do it safely, leave it and call MEA on 1130.",
          "Keep well away from fallen cables, poles and metal fences in water.",
          "Have wiring and appliances that got wet checked before you use them again.",
        ],
      },
      {
        id: "health",
        heading: "Health after contact with floodwater",
        body: [
          "Floodwater carries sewage and animal urine. The Department of Disease Control warns of two infections that spread through cuts and skin soaked in water or mud. Leptospirosis, known as rat urine fever, appears about one to two weeks later. Melioidosis, known as soil fever, can appear from one day to three weeks later, and is more dangerous for people with diabetes or kidney disease.",
        ],
        items: [
          "Wear boots and rubber gloves if you have to walk through water or clean up, and cover cuts with waterproof plasters.",
          "Shower with soap and clean water as soon as you can afterwards.",
          "See a doctor straight away if you get a high fever, headache, aching calves or back, or red eyes within about two weeks of floodwater. Tell them you were in floodwater. Do not treat it yourself.",
          "Watch for snakes and other animals that shelter in homes during floods.",
          "Drink bottled or boiled water, and keep drinking water covered.",
        ],
      },
      {
        id: "at-home",
        heading: "Where you live",
        items: [
          "Keep a bag ready with water, a torch, a power bank, medicines, your ID and some cash.",
          "Put important documents in a sealed plastic bag.",
          "If you live on a ground floor near a canal or the river, agree with a friend on somewhere higher you can go.",
          "Check on neighbours who may need help to move, such as older people and anyone who is ill or disabled.",
          "If your home is damaged, take photographs before you clean up. The BMA asks for evidence of damage when people apply for help.",
          "If you have to leave home, the BMA opens shelters in its schools with food, water and toilets. Ask your district office or call 1555.",
        ],
      },
      {
        id: "warnings",
        heading: "Getting warnings",
        items: [
          "Turn on emergency alerts on your phone. DDPM sends cell broadcast warnings in Thai and English to every phone in an area at risk.",
          "If an alert says canal levels are critical, anyone beside a canal or on low ground should move belongings and valuables higher and avoid flooded routes.",
          "The Thai Meteorological Department issues numbered heavy rain warnings on tmd.go.th and on 1182. Each one says which days and areas to expect.",
          "Follow BMA announcements about the Chao Phraya and high tides. They say which days and hours the river will peak.",
          "Report flooding in Bangkok on 1555 or through Traffy Fondue on LINE. For disaster help, call DDPM on 1784 or message @1784DDPM on LINE. For a medical emergency, call 1669.",
        ],
      },
    ],
  },
  th: {
    title: "น้ำท่วม",
    summary:
      "ในฤดูฝน โดยเฉพาะเดือนกันยายนและตุลาคม ฝนที่ตกหนักอาจทำให้น้ำในคลองเต็มและถนนทั่วกรุงเทพฯ ท่วมขังได้ภายในไม่กี่ชั่วโมง ส่วนท่าพระจันทร์ตั้งอยู่ริมแม่น้ำเจ้าพระยา ในช่วงเดือนตุลาคมถึงธันวาคม น้ำเหนือที่ไหลหลากประกอบกับน้ำทะเลหนุนอาจทำให้ท่าเรือและถนนริมน้ำรอบมหาวิทยาลัยท่วมได้",
    banner:
      "ระดับน้ำในคลองทั่วกรุงเทพฯ อยู่ในขั้นวิกฤต ถนนหลายสายมีน้ำท่วมขัง หลีกเลี่ยงการลุยน้ำ และตรวจสอบเส้นทางก่อนเดินทาง",
    now: [
      "อย่าเดินลุย ขี่รถ หรือขับรถผ่านน้ำที่ลึกหรือไหลเชี่ยว หากจำเป็นต้องข้าม ให้ค่อย ๆ เดิน ยึดจับสิ่งที่มั่นคง และใช้ไม้หยั่งพื้นข้างหน้าก่อนก้าวทุกครั้ง",
      "อยู่ห่างจากสายไฟ เสาไฟฟ้า และวัตถุที่เปียกน้ำซึ่งอาจเป็นสื่อนำไฟฟ้า หากพบจุดที่เป็นอันตรายจากไฟฟ้า ให้แจ้งการไฟฟ้านครหลวง โทร 1130",
      "หากพักอยู่ริมคลองหรือในพื้นที่ลุ่มต่ำ ให้ยกสิ่งของและทรัพย์สินมีค่าขึ้นที่สูง และย้ายรถไปจอดในที่สูงตั้งแต่ตอนนี้",
      "ก่อนออกจากบ้าน ให้ตรวจสอบเส้นทางที่น้ำท่วมและประกาศเรื่องการเรียนการสอน และวางแผนกลับบ้านให้เร็วขึ้น",
      "หากเจ้าหน้าที่หรือข้อความแจ้งเตือนภัยในโทรศัพท์แจ้งให้ย้ายออกหรืออพยพ ให้ปฏิบัติตามทันที",
    ],
    sections: [
      {
        id: "how-it-floods",
        heading: "น้ำท่วมในกรุงเทพฯ เกิดขึ้นอย่างไร",
        body: [
          "น้ำฝนจะไหลลงคลอง แล้ว กทม. สูบระบายออกสู่แม่น้ำเจ้าพระยา เมื่อฝนตกหนักต่อเนื่องนานเป็นวัน น้ำไหลลงคลองเร็วกว่าที่สูบออกได้ทัน จึงเอ่อล้นขึ้นมาท่วมถนนและพื้นที่ต่ำริมคลอง แม้ระดับน้ำในแม่น้ำเจ้าพระยาจะยังต่ำกว่าแนวคันกั้นน้ำอยู่มากก็ตาม",
          "สำนักการระบายน้ำ กทม. เผยแพร่ข้อมูลจากสถานีวัดระดับน้ำในคลองและสถานีวัดน้ำท่วมบนถนนแบบเรียลไทม์ที่ weather.bangkok.go.th หากคลองใดขึ้นสถานะวิกฤต แสดงว่าระดับน้ำใกล้ล้นตลิ่งแล้ว",
        ],
        items: [
          "ในช่วงฝนตกหนักเดือนกันยายน 2569 คลองในเขตทางเหนือและตะวันออกของกรุงเทพฯ ขึ้นถึงระดับวิกฤตก่อน เช่น เขตดอนเมือง หลักสี่ สายไหม บางเขน ลาดพร้าว บางกะปิ มีนบุรี ลาดกระบัง และคลองสามวา",
          "คลองในฝั่งธนบุรีด้านตะวันตก เช่น เขตทวีวัฒนา บางแค และภาษีเจริญ ก็มีระดับน้ำสูงขึ้นเร็วเช่นกัน หากพักอยู่หรือต้องเดินทางผ่านย่านนี้ ควรตรวจสอบข้อมูลจากสถานีวัดก่อนออกเดินทาง",
        ],
      },
      {
        id: "travelling",
        heading: "การเดินทางไปกลับมหาวิทยาลัย",
        items: [
          "หากถนน อุโมงค์ลอด หรือทางเดินมีน้ำท่วม ให้เลี่ยงไปใช้เส้นทางอื่น ใต้น้ำอาจมีท่อระบายน้ำที่เปิดอยู่ ฝาท่อที่หลุด หรือเศษวัสดุซ่อนอยู่ และควรหลีกเลี่ยงการเดินลุยน้ำในเวลากลางคืน",
          "กทม. อาจปิดถนนที่น้ำท่วมสูงไม่ให้รถเล็กผ่าน ก่อนออกเดินทางให้ตรวจสอบเส้นทางผ่าน Traffy Fondue ใน LINE หรือโทรสายด่วน 1555",
          "หากขับรถ ให้ประเมินความลึกและความแรงของกระแสน้ำก่อน และห้ามขับผ่านเส้นทางที่น้ำท่วมสูง",
          "เผื่อเวลาเดินทางและวางแผนกลับบ้านให้เร็วขึ้น เมื่อถนนมีน้ำท่วมขัง การจราจรจะติดขัดหนักทั่วเมือง โดยเฉพาะช่วงเย็น",
          "ในช่วงน้ำท่วม กทม. แนะนำให้ประชาชนในพื้นที่น้ำท่วมนำรถไปจอดในที่ปลอดภัย เช่น สำนักงานเขตและโรงเรียน",
          "เมื่อระดับน้ำในแม่น้ำเจ้าพระยาสูงขึ้น เรือด่วนอาจงดจอดบางท่าหรืองดให้บริการ และถนนบริเวณท่าช้างและสนามหลวงมักท่วมก่อนจุดอื่น",
        ],
      },
      {
        id: "electricity",
        heading: "ไฟฟ้า",
        items: [
          "ห้ามสัมผัสสวิตช์ ปลั๊กไฟ หรือเครื่องใช้ไฟฟ้าขณะตัวเปียกหรือยืนอยู่ในน้ำ",
          "หากน้ำท่วมถึงระดับปลั๊กไฟ และเอื้อมถึงคัตเอาต์หรือเบรกเกอร์หลักได้จากจุดที่แห้ง ให้ตัดไฟทันที หากทำไม่ได้อย่างปลอดภัย อย่าฝืน ให้โทรแจ้งการไฟฟ้านครหลวง 1130",
          "อยู่ห่างจากสายไฟที่ขาด เสาไฟฟ้า และรั้วเหล็กที่แช่อยู่ในน้ำ",
          "ให้ช่างไฟฟ้าตรวจสอบสายไฟและเครื่องใช้ไฟฟ้าที่ถูกน้ำก่อนนำกลับมาใช้งาน",
        ],
      },
      {
        id: "health",
        heading: "สุขภาพหลังสัมผัสน้ำท่วม",
        body: [
          "น้ำท่วมมักปนเปื้อนสิ่งปฏิกูลและปัสสาวะสัตว์ กรมควบคุมโรคเตือนให้ระวังสองโรคที่ติดต่อผ่านบาดแผลหรือผิวหนังที่แช่น้ำหรือย่ำโคลนเป็นเวลานาน ได้แก่ โรคฉี่หนู ซึ่งมักแสดงอาการหลังสัมผัสเชื้อราวหนึ่งถึงสองสัปดาห์ และโรคไข้ดินหรือเมลิออยโดสิส ซึ่งแสดงอาการได้ตั้งแต่หนึ่งวันถึงสามสัปดาห์ และรุนแรงกว่าในผู้ป่วยเบาหวานหรือโรคไต",
        ],
        items: [
          "สวมรองเท้าบูทและถุงมือยางเมื่อต้องลุยน้ำหรือทำความสะอาด และปิดแผลด้วยพลาสเตอร์กันน้ำ",
          "รีบอาบน้ำฟอกสบู่ให้สะอาดทันทีหลังสัมผัสน้ำหรือโคลน",
          "หากมีไข้สูง ปวดศีรษะ ปวดน่องหรือปวดหลัง หรือตาแดง ภายในราวสองสัปดาห์หลังลุยน้ำ ให้รีบไปพบแพทย์และแจ้งว่าเคยลุยน้ำท่วม อย่าซื้อยากินเอง",
          "ระวังงูและสัตว์มีพิษที่หนีน้ำเข้ามาอาศัยในบ้าน",
          "ดื่มน้ำขวดหรือน้ำต้มสุก และปิดภาชนะใส่น้ำดื่มให้มิดชิด",
        ],
      },
      {
        id: "at-home",
        heading: "ที่พัก",
        items: [
          "เตรียมกระเป๋าฉุกเฉินที่มีน้ำดื่ม ไฟฉาย พาวเวอร์แบงก์ ยาประจำตัว บัตรประชาชน และเงินสดจำนวนหนึ่ง",
          "ใส่เอกสารสำคัญในถุงพลาสติกที่ปิดสนิท",
          "หากพักอยู่ชั้นล่างใกล้คลองหรือแม่น้ำ ให้ตกลงกับเพื่อนไว้ล่วงหน้าว่าจะไปพักในที่สูงได้ที่ไหน",
          "คอยดูแลเพื่อนบ้านที่อาจย้ายออกเองไม่ได้ เช่น ผู้สูงอายุ ผู้ป่วย และผู้พิการ",
          "หากที่พักเสียหาย ให้ถ่ายภาพเก็บไว้ก่อนทำความสะอาด เพราะ กทม. ใช้หลักฐานความเสียหายประกอบการขอรับความช่วยเหลือ",
          "หากต้องออกจากบ้าน กทม. เปิดศูนย์พักพิงในโรงเรียนสังกัด กทม. ซึ่งมีอาหาร น้ำดื่ม และห้องสุขา สอบถามได้ที่สำนักงานเขตหรือโทร 1555",
        ],
      },
      {
        id: "warnings",
        heading: "การรับคำเตือน",
        items: [
          "เปิดการแจ้งเตือนเหตุฉุกเฉินในโทรศัพท์ไว้ ปภ. ส่งข้อความเตือนภัยผ่านระบบ Cell Broadcast เป็นภาษาไทยและภาษาอังกฤษถึงโทรศัพท์ทุกเครื่องในพื้นที่เสี่ยง",
          "หากได้รับข้อความเตือนว่าระดับน้ำในคลองวิกฤต ผู้ที่อยู่ริมคลองหรือในพื้นที่ลุ่มต่ำควรยกสิ่งของและทรัพย์สินมีค่าขึ้นที่สูง และหลีกเลี่ยงเส้นทางที่น้ำท่วม",
          "กรมอุตุนิยมวิทยาออกประกาศเตือนฝนตกหนักเป็นระยะ โดยแต่ละฉบับระบุวันและพื้นที่ที่ต้องเฝ้าระวัง ติดตามได้ที่ tmd.go.th หรือโทร 1182",
          "ติดตามประกาศของ กทม. เรื่องระดับน้ำในแม่น้ำเจ้าพระยาและน้ำทะเลหนุน ซึ่งจะระบุวันและช่วงเวลาที่น้ำขึ้นสูงสุด",
          "แจ้งเหตุน้ำท่วมในกรุงเทพฯ ได้ที่สายด่วน 1555 หรือ Traffy Fondue ใน LINE ขอความช่วยเหลือจากสาธารณภัยได้ที่ ปภ. โทร 1784 หรือ LINE @1784DDPM หากเจ็บป่วยฉุกเฉินโทร 1669",
        ],
      },
    ],
  },
};

export default flooding;
