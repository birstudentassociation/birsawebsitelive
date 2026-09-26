/**
 * The live emergency alert. `null` means no alert.
 *
 * To raise one, set this to an object and deploy (a commit to master deploys
 * in about a minute). The banner appears on every page and the guide shows the
 * issue time and updates at the top. To add an update, put a new entry at the
 * start of `updates` and deploy again. To end the alert, set this back to
 * `null` and deploy. Step-by-step instructions are in `docs/EDITING.md`.
 *
 * Example:
 *
 *   export const activeEmergency: ActiveEmergency<ScenarioId> | null = {
 *     scenario: "flooding",
 *     issuedAt: "2026-10-12T07:30:00+07:00",
 *     banner: {
 *       en: "Roads around Tha Prachan are flooded. Classes today are online.",
 *       th: "ถนนรอบท่าพระจันทร์น้ำท่วม วันนี้เรียนออนไลน์",
 *     },
 *     updates: [
 *       {
 *         at: "2026-10-12T07:30:00+07:00",
 *         text: {
 *           en: "Prachan Road and Na Phra That Road are flooded. The faculty has moved today's classes online.",
 *           th: "ถนนพระจันทร์และถนนหน้าพระธาตุน้ำท่วม คณะให้เรียนออนไลน์ทุกวิชาในวันนี้",
 *         },
 *       },
 *     ],
 *   };
 */
import type { ActiveEmergency } from "@/content/emergency/types";
import type { ScenarioId } from "@/content/emergency/scenarios";

export const activeEmergency: ActiveEmergency<ScenarioId> | null = {
  scenario: "flooding",
  updatesAfter: "campus",
  issuedAt: "2026-09-26T10:30:00+07:00",
  banner: {
    en: "Because of flooding across Bangkok, all Thammasat classes are online on Monday 28 and Tuesday 29 September.",
    th: "เนื่องจากน้ำท่วมทั่วกรุงเทพฯ ธรรมศาสตร์ให้ทุกรายวิชาเรียนออนไลน์ในวันจันทร์ที่ 28 และวันอังคารที่ 29 กันยายน",
  },
  updates: [
    {
      at: "2026-09-26T14:30:00+07:00",
      text: {
        en: "The governor has asked people to stay at home if they can. Canal levels are starting to level off, but heavy rain is forecast until 27 September.",
        th: "ผู้ว่าราชการกรุงเทพมหานครขอให้ประชาชนงดออกจากบ้านหากไม่มีธุระจำเป็น ระดับน้ำในคลองเริ่มทรงตัว แต่คาดว่ายังมีฝนตกหนักไปจนถึงวันที่ 27 กันยายน",
      },
      points: {
        en: [
          "Governor Chadchart Sittipunt advised people to stay at home and not to travel unless they need to, because flooding is changing quickly.",
          "The six main roads with the deepest water are Ramkhamhaeng, New Phetchaburi, Ekkamai, Sena Nikhom 1, Lat Krabang and Vibhavadi Rangsit from Chatuchak onwards. Avoid them. This morning parts of Vibhavadi Rangsit had water over 1 m deep.",
          "Nearly 300 mm has fallen in the east of the city in 48 hours, with 274.5 mm in Min Buri and 273 mm in Khlong Sam Wa, about 30 million cubic metres of water. With pumps at full capacity, 1,200 cubic metres a second, levels in the main canals have started to level off. The BMA expects conditions to improve within about six hours if no more rain falls.",
          "Thai Meteorological Department warning No. 11, issued at 11:00, says heavy to very heavy rain will continue in Bangkok on 26 and 27 September and begin to ease on 28 September.",
          "DDPM counted 84,605 people in 21 provinces affected by flooding at 07:00. In Bangkok it reported standing water on roads at 44 points, with the water falling at most of them.",
          "Governor Chadchart Sittipunt said the BMA is adding 1 million sandbags for district offices to give out. Collect them from your district office.",
          "If someone who is bedridden or relies on medical equipment needs help, call 1669. The governor has asked such patients to consider staying in hospital for now.",
        ],
        th: [
          "นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ขอให้ประชาชนอยู่ในบ้านและงดเดินทางหากไม่มีธุระจำเป็น เพราะสถานการณ์น้ำเปลี่ยนแปลงอย่างรวดเร็ว",
          "หลีกเลี่ยงถนนสายหลัก 6 สายที่น้ำท่วมสูง ได้แก่ รามคำแหง เพชรบุรีตัดใหม่ เอกมัย เสนานิคม 1 ลาดกระบัง และวิภาวดีรังสิตตั้งแต่เขตจตุจักรเป็นต้นไป เช้านี้ถนนวิภาวดีรังสิตบางช่วงมีน้ำท่วมสูงกว่า 1 เมตร",
          "ฝั่งตะวันออกของเมืองมีฝนสะสมเกือบ 300 มม. ใน 48 ชั่วโมง เขตมีนบุรี 274.5 มม. และคลองสามวา 273 มม. คิดเป็นปริมาณน้ำราว 30 ล้านลูกบาศก์เมตร กทม. เดินเครื่องสูบน้ำเต็มกำลัง 1,200 ลูกบาศก์เมตรต่อวินาที ระดับน้ำในคลองสายหลักจึงเริ่มทรงตัว และคาดว่าสถานการณ์จะดีขึ้นภายในราว 6 ชั่วโมงหากไม่มีฝนตกเพิ่ม",
          "ประกาศกรมอุตุนิยมวิทยาฉบับที่ 11 เวลา 11.00 น. ระบุว่ากรุงเทพฯ ยังมีฝนตกหนักถึงหนักมากในวันที่ 26 และ 27 กันยายน และฝนจะเริ่มลดลงในวันที่ 28 กันยายน",
          "ปภ. รายงานเมื่อเวลา 07.00 น. ว่ามีผู้ได้รับผลกระทบจากน้ำท่วม 84,605 คน ใน 21 จังหวัด ส่วนกรุงเทพฯ มีน้ำท่วมขังผิวการจราจร 44 จุด ซึ่งส่วนใหญ่ระดับน้ำมีแนวโน้มลดลง",
          "นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ระบุว่า กทม. เพิ่มกระสอบทราย 1 ล้านใบให้สำนักงานเขตแจกจ่าย ติดต่อรับได้ที่สำนักงานเขต",
          "หากผู้ป่วยติดเตียงหรือผู้ที่ต้องใช้อุปกรณ์การแพทย์ต้องการความช่วยเหลือ โทร 1669 ผู้ว่าฯ ขอให้ผู้ป่วยกลุ่มนี้พิจารณาเข้าพักในโรงพยาบาลชั่วคราว",
        ],
      },
    },
    {
      at: "2026-09-26T13:45:00+07:00",
      text: {
        en: "Shelter and parking information has moved to BKK Care Monitor, the BMA's official page, linked in the shelters section of this page.",
        th: "ข้อมูลศูนย์พักพิงและที่จอดรถย้ายไปอยู่ที่ BKK Care Monitor เว็บไซต์ทางการของ กทม. ซึ่งมีลิงก์อยู่ในหัวข้อศูนย์พักพิงของหน้านี้",
      },
    },
    {
      at: "2026-09-26T13:25:00+07:00",
      text: {
        en: "BMA readings at 13:15 show the rain easing, but canals are still high and many roads are still flooded.",
        th: "ข้อมูลจากสถานีตรวจวัดของ กทม. เวลา 13.15 น. พบว่าฝนเริ่มเบาลง แต่ระดับน้ำในคลองยังสูง และถนนหลายสายยังมีน้ำท่วมขัง",
      },
      points: {
        en: [
          "In the 24 hours to 13:15, 108 of 122 working rain gauges recorded more than 100 mm, peaking at 211.5 mm at Bueng Khwang in Min Buri. No gauge recorded more than 9 mm in the past hour, though Nong Chok had up to 36.5 mm in the past three hours.",
          "148 of about 300 canal stations were at critical level, mostly in the north and east of the city and in western Thonburi. More canal readings were rising than falling since 10:00.",
          "Road sensors showed flooding at 20 points. The deepest were Sena Nikhom 1 (67 cm), Lat Phrao 122 (58 cm), Ngam Wong Wan at Phong Phet (57 cm), New Phetchaburi at Singha Complex (55 cm) and Ramkhamhaeng 43/1 (52 cm). A further 59 points without a live reading, mostly in the north and east, were reported flooded at about 10 to 20 cm.",
          "Around Tha Prachan 145 to 178 mm fell in 24 hours, but the canals are normal and the road sensors are dry. The river gauge at Pak Khlong Talat is temporarily down. Downstream at Sathon the Chao Phraya is 0.52 m, well below the 2.10 m warning level.",
        ],
        th: [
          "ใน 24 ชั่วโมงจนถึงเวลา 13.15 น. สถานีวัดน้ำฝนของ กทม. วัดปริมาณฝนได้เกิน 100 มม. ถึง 108 แห่ง จาก 122 แห่งที่ใช้งานได้ สูงสุด 211.5 มม. ที่ประตูระบายน้ำบึงขวาง เขตมีนบุรี ในชั่วโมงที่ผ่านมาไม่มีสถานีใดวัดฝนได้เกิน 9 มม. แต่ในสามชั่วโมงที่ผ่านมา เขตหนองจอกยังมีฝนตกสูงสุด 36.5 มม.",
          "ระดับน้ำในคลองอยู่ในขั้นวิกฤตที่ 148 สถานี จากสถานีวัดราว 300 สถานี ส่วนใหญ่อยู่ทางเหนือและตะวันออกของเมือง และฝั่งธนบุรีด้านตะวันตก และตั้งแต่เวลา 10.00 น. สถานีที่ระดับน้ำสูงขึ้นยังมีมากกว่าสถานีที่ระดับน้ำลดลง",
          "สถานีวัดบนถนนพบน้ำท่วมขัง 20 จุด จุดที่ลึกที่สุด ได้แก่ ถนนเสนานิคม 1 (67 ซม.) ซอยลาดพร้าว 122 (58 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (57 ซม.) ถนนเพชรบุรีตัดใหม่หน้าสิงห์คอมเพล็กซ์ (55 ซม.) และซอยรามคำแหง 43/1 (52 ซม.) นอกจากนี้ยังมีรายงานน้ำท่วมราว 10 ถึง 20 ซม. อีก 59 จุดที่ไม่มีค่าจากสถานีวัดแบบเรียลไทม์ ส่วนใหญ่อยู่ทางเหนือและตะวันออก",
          "บริเวณรอบท่าพระจันทร์มีฝนตก 145 ถึง 178 มม. ใน 24 ชั่วโมง แต่ระดับน้ำในคลองยังปกติ และจุดวัดน้ำบนถนนยังไม่มีน้ำขัง สถานีวัดระดับแม่น้ำที่ปากคลองตลาดขัดข้องชั่วคราว ส่วนที่สาทรซึ่งอยู่ท้ายน้ำ ระดับแม่น้ำเจ้าพระยาอยู่ที่ 0.52 ม. ต่ำกว่าระดับเตือนภัย 2.10 ม. อยู่มาก",
        ],
      },
    },
    {
      at: "2026-09-26T13:10:00+07:00",
      text: {
        en: "Thammasat has postponed this weekend's midterm exams, moved classes online on 28 and 29 September and closed some libraries.",
        th: "ธรรมศาสตร์เลื่อนสอบกลางภาคในสุดสัปดาห์นี้ ให้เรียนออนไลน์วันที่ 28 และ 29 กันยายน และปิดห้องสมุดบางแห่ง",
      },
      points: {
        en: [
          "Undergraduate midterms set for Saturday 26 September move to Sunday 4 October, and those set for Sunday 27 September move to Sunday 11 October.",
          "If you missed an exam already held because of the rain, your lecturer will set another assessment worth the same. The W withdrawal deadline is extended to 26 October.",
          "Classes at every campus are online on 28 and 29 September. Your lecturer will tell you in advance if a class must be in person.",
          "On 27 September all branch libraries at Tha Prachan are closed, and at Rangsit the Puey Ungphakorn Library and the Public Library. On 28 September Sanya Dharmasakti Library and the same two Rangsit libraries are closed.",
          "The scanned university and BMA announcements are now linked on this page.",
        ],
        th: [
          "สอบกลางภาคระดับปริญญาตรีที่กำหนดสอบวันเสาร์ที่ 26 กันยายน เลื่อนไปสอบวันอาทิตย์ที่ 4 ตุลาคม และที่กำหนดสอบวันอาทิตย์ที่ 27 กันยายน เลื่อนไปสอบวันอาทิตย์ที่ 11 ตุลาคม",
          "หากสอบไปแล้วแต่เข้าสอบไม่ได้เพราะฝนตกหนัก อาจารย์ผู้สอนจะจัดเก็บคะแนนด้วยวิธีอื่นโดยคิดคะแนนเทียบเท่ากับการสอบ และขยายกำหนดถอนรายวิชา (W) ถึงวันที่ 26 ตุลาคม",
          "วันที่ 28 และ 29 กันยายน ทุกศูนย์การศึกษาเรียนออนไลน์ หากรายวิชาใดต้องเรียนในชั้นเรียน อาจารย์ผู้สอนจะแจ้งล่วงหน้า",
          "วันที่ 27 กันยายน ปิดห้องสมุดสาขาทุกแห่งที่ศูนย์ท่าพระจันทร์ และหอสมุดป๋วย อึ๊งภากรณ์ กับห้องสมุดประชาชนที่ศูนย์รังสิต วันที่ 28 กันยายน ปิดห้องสมุดสัญญา ธรรมศักดิ์ และห้องสมุดสองแห่งเดิมที่ศูนย์รังสิต",
          "เพิ่มลิงก์ประกาศของมหาวิทยาลัยและของ กทม. ฉบับสแกนไว้ในหน้านี้แล้ว",
        ],
      },
    },
    {
      at: "2026-09-26T12:15:00+07:00",
      text: {
        en: "Sandbag points are now listed on this page, by district.",
        th: "รายชื่อจุดรับกระสอบทราย แยกตามเขต อยู่ในหน้านี้แล้ว",
      },
      points: {
        en: [
          "Khan Na Yao, Lat Krabang and Watthana are giving out sandbags. Bring your ID card, up to 20 bags per household.",
          "Din Daeng Road, the Din Daeng underpass and Pracha Songkhro Road at the Bot Mae Phra junction are closed to small cars.",
        ],
        th: [
          "เขตคันนายาว ลาดกระบัง และวัฒนา แจกกระสอบทราย นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
          "ถนนดินแดง อุโมงค์ดินแดง และถนนประชาสงเคราะห์ช่วงแยกโบสถ์แม่พระ ห้ามรถเล็กผ่าน",
        ],
      },
    },
    {
      at: "2026-09-26T10:45:00+07:00",
      text: {
        en: "All 50 districts of Bangkok are now a declared disaster area.",
        th: "กทม. ประกาศให้พื้นที่กรุงเทพฯ ทั้ง 50 เขตเป็นเขตพื้นที่ประสบสาธารณภัยแล้ว",
      },
      points: {
        en: [
          "Governor Chadchart Sittipunt signed the announcement under the Disaster Prevention and Mitigation Act 2007.",
          "It extends the declaration made on 25 September for Nong Chok, Suan Luang and Khan Na Yao to the whole city.",
          "It lets government agencies, district offices and the private sector act quickly, and is the basis for help to people affected.",
          "If your home or belongings are damaged, take photographs before you clean up and keep them for a claim.",
          "To report flooding or ask for help, call 1555 or use Traffy Fondue on LINE. For a medical emergency, call 1669.",
        ],
        th: [
          "นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ลงนามในประกาศกองอำนวยการป้องกันและบรรเทาสาธารณภัยกรุงเทพมหานคร ตามพระราชบัญญัติป้องกันและบรรเทาสาธารณภัย พ.ศ. 2550",
          "เป็นการขยายพื้นที่จากประกาศเมื่อวันที่ 25 กันยายน ซึ่งครอบคลุมเฉพาะเขตหนองจอก สวนหลวง และคันนายาว ให้ครอบคลุมทั้งกรุงเทพฯ",
          "ประกาศนี้เปิดทางให้ส่วนราชการ หน่วยงาน องค์กรปกครองส่วนท้องถิ่น และภาคเอกชน เข้าดำเนินการตามอำนาจหน้าที่ได้อย่างรวดเร็ว และใช้เป็นฐานในการให้ความช่วยเหลือผู้ได้รับผลกระทบ",
          "หากที่พักหรือทรัพย์สินเสียหาย ให้ถ่ายภาพเก็บไว้เป็นหลักฐานก่อนทำความสะอาด",
          "แจ้งเหตุหรือขอความช่วยเหลือได้ที่สายด่วน 1555 หรือ Traffy Fondue ใน LINE หากเจ็บป่วยฉุกเฉินโทร 1669",
        ],
      },
    },
    {
      at: "2026-09-26T10:30:00+07:00",
      text: {
        en: "DDPM sent a cell broadcast to phones in Bangkok at 09:22. Canal levels are critical and still rising.",
        th: "เวลา 09.22 น. ปภ. ส่งข้อความแจ้งเตือนผ่านระบบ Cell Broadcast ถึงโทรศัพท์ในกรุงเทพฯ ว่าระดับน้ำในคลองอยู่ในขั้นวิกฤตและมีแนวโน้มสูงขึ้น",
      },
      points: {
        en: [
          "If you live beside a canal or on low ground, move belongings and valuables higher, avoid flooded roads and check your route before you set off.",
          "At 10:10, 151 of about 300 BMA canal stations were at critical level, mostly in the north and east of the city and in western Thonburi.",
          "Roads were flooded at 15 points. The deepest were Sena Nikhom 1 (64 cm), Lat Phrao 122 (58 cm), Ngam Wong Wan at Phong Phet (56 cm), New Phetchaburi at Singha Complex (52 cm) and Ramkhamhaeng 43/1 (50 cm).",
          "In the 24 hours to 10:15, 111 of 122 working rain gauges recorded more than 100 mm, peaking at 212.5 mm at Bueng Khwang in Min Buri. The east of the city has had nearly 300 mm since Thursday, and up to 15 mm fell in the past hour in Sai Mai.",
          "Around Tha Prachan, 134 to 161 mm fell, but the canals are normal and the road sensors in and around the old town are dry. The Chao Phraya at Pak Khlong Talat is 1.06 m, well below the 2.30 m warning level.",
          "The Thai Meteorological Department expects heavy to very heavy rain until 27 September.",
        ],
        th: [
          "ผู้ที่อยู่ริมคลองหรือในพื้นที่ลุ่มต่ำ ให้ยกสิ่งของและทรัพย์สินมีค่าขึ้นที่สูง หลีกเลี่ยงเส้นทางที่น้ำท่วม และตรวจสอบเส้นทางก่อนออกเดินทาง",
          "ข้อมูล ณ เวลา 10.10 น. ระดับน้ำในคลองอยู่ในขั้นวิกฤตที่ 151 สถานี จากสถานีวัดของ กทม. ราว 300 สถานี ส่วนใหญ่อยู่ทางเหนือและตะวันออกของเมือง และฝั่งธนบุรีด้านตะวันตก",
          "ถนนมีน้ำท่วมขัง 15 จุด จุดที่ลึกที่สุด ได้แก่ ถนนเสนานิคม 1 (64 ซม.) ซอยลาดพร้าว 122 (58 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (56 ซม.) ถนนเพชรบุรีตัดใหม่หน้าสิงห์คอมเพล็กซ์ (52 ซม.) และซอยรามคำแหง 43/1 (50 ซม.)",
          "ใน 24 ชั่วโมงจนถึงเวลา 10.15 น. สถานีวัดน้ำฝนของ กทม. วัดปริมาณฝนได้เกิน 100 มม. ถึง 111 แห่ง จาก 122 แห่งที่ใช้งานได้ สูงสุด 212.5 มม. ที่ประตูระบายน้ำบึงขวาง เขตมีนบุรี ฝั่งตะวันออกมีฝนสะสมเกือบ 300 มม. ตั้งแต่วันพฤหัสบดี และในชั่วโมงที่ผ่านมา เขตสายไหมยังมีฝนตกสูงสุด 15 มม.",
          "บริเวณรอบท่าพระจันทร์มีฝนตก 134 ถึง 161 มม. แต่ระดับน้ำในคลองยังปกติ และจุดวัดน้ำท่วมบนถนนย่านเมืองเก่ายังไม่มีน้ำขัง ระดับน้ำในแม่น้ำเจ้าพระยาที่ปากคลองตลาดอยู่ที่ 1.06 ม. ต่ำกว่าระดับเตือนภัย 2.30 ม. อยู่มาก",
          "กรมอุตุนิยมวิทยาคาดว่าจะมีฝนตกหนักถึงหนักมากต่อเนื่องไปจนถึงวันที่ 27 กันยายน",
        ],
      },
    },
  ],
};
