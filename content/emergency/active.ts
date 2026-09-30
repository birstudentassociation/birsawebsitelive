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
    en: "Because of flooding across Bangkok, all Thammasat classes are online until Saturday 3 October.",
    th: "เนื่องจากน้ำท่วมทั่วกรุงเทพฯ ธรรมศาสตร์เรียนออนไลน์ทุกรายวิชาถึงวันเสาร์ที่ 3 ตุลาคม",
  },
  headline: {
    en: "Because of flooding across Bangkok, Thammasat has made these changes.",
    th: "เนื่องจากน้ำท่วมทั่วกรุงเทพฯ ธรรมศาสตร์ประกาศมาตรการดังนี้",
  },
  headlinePoints: {
    en: [
      "All classes at every campus are online until Saturday 3 October.",
      "Faculties decide which courses must be taught in person. Your lecturer will tell you in advance.",
      "After 3 October lecturers may keep classes online or hybrid if students are still affected.",
      "Midterms set for 26 and 27 September are still on 4 and 11 October.",
      "Thammasat shuttle buses are running as normal on both lines.",
    ],
    th: [
      "ทุกรายวิชาทุกศูนย์การศึกษาเรียนออนไลน์ถึงวันเสาร์ที่ 3 ตุลาคม",
      "คณะจะพิจารณาว่ารายวิชาใดจำเป็นต้องเรียนในชั้นเรียน และอาจารย์ผู้สอนจะแจ้งล่วงหน้า",
      "หลังวันที่ 3 ตุลาคม หากนักศึกษายังได้รับผลกระทบ อาจารย์อาจจัดการเรียนการสอนแบบออนไลน์หรือแบบผสมผสานต่อไป",
      "สอบกลางภาคของวันที่ 26 และ 27 กันยายน ยังคงเลื่อนไปสอบวันที่ 4 และ 11 ตุลาคมตามเดิม",
      "รถเวียนธรรมศาสตร์ให้บริการตามปกติทั้ง 2 เส้นทาง",
    ],
  },
  updates: [
    {
      at: "2026-09-30T13:00:00+07:00",
      text: {
        en: "The Chao Phraya Dam has raised its release to 2,500 cubic metres a second. Riverside areas outside the flood walls may rise another 20 to 30 cm, so keep away from the river and the piers at Tha Prachan.",
        th: "เขื่อนเจ้าพระยาเพิ่มการระบายน้ำเป็น 2,500 ลูกบาศก์เมตรต่อวินาที พื้นที่ริมแม่น้ำนอกแนวคันกั้นน้ำอาจมีระดับน้ำสูงขึ้นอีก 20 ถึง 30 ซม. อย่าเข้าใกล้ริมแม่น้ำและท่าเรือบริเวณท่าพระจันทร์",
      },
      points: {
        en: [
          "The Royal Irrigation Department has warned 11 provinces and Bangkok to move belongings to higher ground. Flow from the north is expected to peak around 2 October.",
          "At Pak Khlong Talat, the nearest gauge to Tha Prachan, the river is about 2.0 m, below the flood wall of about 3.0 m. Only communities outside the wall are at risk.",
          "BMA schools in the 15 worst hit districts are closed until 2 October. These are Bang Kapi, Bang Khen, Bueng Kum, Chatuchak, Khan Na Yao, Khlong Sam Wa, Lak Si, Lat Krabang, Min Buri, Nong Chok, Prawet, Sai Mai, Saphan Sung, Suan Luang and Wang Thonglang.",
          "The governor expects main roads to be mostly dry by 1 October. Parts of Lat Krabang drain slowly because Khlong Prawet Buri is still high. If you are stuck in floodwater, call 1555 for a high clearance vehicle.",
          "The government's 9,000 baht per household is separate from BMA compensation for damage, which you claim through your district office. The cabinet has not yet formally approved the 9,000 baht for Bangkok. The BMA is building an online system for sending photos of damage.",
          "National disaster insurance starts on 1 October and covers homes up to 100,000 baht for future floods, storms and earthquakes. It does not cover the current floods.",
          "The Thai Meteorological Department now expects the next rain from 5 to 8 October, starting in the north and northeast.",
          "DDPM counts 31 provinces and Bangkok affected, about 2.93 million people.",
        ],
        th: [
          "กรมชลประทานแจ้งเตือน 11 จังหวัดและกรุงเทพฯ ให้ขนย้ายสิ่งของขึ้นที่สูง คาดว่าน้ำเหนือจะสูงสุดราววันที่ 2 ตุลาคม",
          "ที่สถานีปากคลองตลาด ซึ่งใกล้ท่าพระจันทร์ที่สุด ระดับน้ำอยู่ราว 2.0 ม. ต่ำกว่าแนวป้องกันซึ่งสูงราว 3.0 ม. ชุมชนที่เสี่ยงมีเฉพาะชุมชนนอกแนวป้องกัน",
          "โรงเรียนสังกัด กทม. ใน 15 เขตที่ได้รับผลกระทบสูงปิดถึงวันที่ 2 ตุลาคม ได้แก่ คลองสามวา คันนายาว จตุจักร บางเขน บางกะปิ บึงกุ่ม ประเวศ มีนบุรี ลาดกระบัง วังทองหลาง สวนหลวง สะพานสูง สายไหม หนองจอก และหลักสี่",
          "ผู้ว่าฯ กทม. คาดว่าถนนสายหลักส่วนใหญ่จะแห้งภายในวันที่ 1 ตุลาคม บางส่วนของเขตลาดกระบังระบายน้ำได้ช้าเพราะคลองประเวศบุรีรมย์ยังสูง หากติดน้ำท่วม โทร 1555 เพื่อขอรถยกสูง",
          "เงิน 9,000 บาทต่อครัวเรือนของรัฐบาลแยกจากเงินช่วยเหลือค่าเสียหายของ กทม. ซึ่งยื่นขอที่สำนักงานเขต ครม. ยังไม่มีมติอนุมัติเงิน 9,000 บาทสำหรับกรุงเทพฯ อย่างเป็นทางการ กทม. กำลังทำระบบออนไลน์ให้ส่งภาพความเสียหายได้",
          "ประกันภัยพิบัติแห่งชาติเริ่มวันที่ 1 ตุลาคม คุ้มครองบ้านสูงสุด 100,000 บาท สำหรับน้ำท่วม วาตภัย และแผ่นดินไหวที่เกิดหลังจากนี้ แต่ไม่ครอบคลุมน้ำท่วมครั้งนี้",
          "กรมอุตุนิยมวิทยาคาดว่าฝนรอบใหม่จะมาในวันที่ 5 ถึง 8 ตุลาคม เริ่มจากภาคเหนือและภาคตะวันออกเฉียงเหนือ",
          "ปภ. รายงานว่ามีพื้นที่ได้รับผลกระทบ 31 จังหวัดและกรุงเทพฯ ผู้ได้รับผลกระทบราว 2.93 ล้านคน",
        ],
      },
    },
    {
      at: "2026-09-29T23:30:00+07:00",
      text: {
        en: "Tides are high until 4 October, and water from the north peaks around 2 October. Take care near the river and the piers at Tha Prachan.",
        th: "น้ำทะเลหนุนสูงถึงวันที่ 4 ตุลาคม และน้ำเหนือจะสูงสุดราววันที่ 2 ตุลาคม โปรดระวังเมื่ออยู่ริมแม่น้ำและท่าเรือบริเวณท่าพระจันทร์",
      },
      points: {
        en: [
          "The BMA and the National Water Resources Office expect rivers to rise a further 0.70 to 1.70 m. Communities outside the flood walls are most at risk.",
          "The Chao Phraya Dam raised its release to 2,200 cubic metres a second at 19:00.",
          "The BMA is watching Sukhumvit, Suksawat and Rama 2 roads.",
          "The cabinet has set aside 4 billion baht for flood relief. Reports say Bangkok households will get the same 9,000 baht as other provinces, but the Prime Minister has not confirmed it.",
          "The governor expects about 90% of main roads to be dry within two days. More than 40 points are still being watched, mostly in Lat Krabang and Sai Mai.",
          "Ramkhamhaeng, Seri Thai, Nawamin and Luang Phaeng roads are still being watched. Khlong Saen Saep has fallen clearly.",
          "Free travel on expressways and motorways ends at midnight tonight.",
          "Thunderstorms are forecast over 40 to 60% of Bangkok until 4 October. The Thai Meteorological Department expects more rain from 5 to 10 October.",
          "At 23:19 BMA Flood Support listed 207 shelters with 4,461 people staying. The district search on this page has the new numbers.",
        ],
        th: [
          "กทม. และ สทนช. คาดว่าระดับน้ำในแม่น้ำจะสูงขึ้นอีก 0.70 ถึง 1.70 ม. ชุมชนนอกแนวคันกั้นน้ำเสี่ยงที่สุด",
          "เขื่อนเจ้าพระยาเพิ่มการระบายน้ำเป็น 2,200 ลูกบาศก์เมตรต่อวินาที ตั้งแต่เวลา 19.00 น.",
          "กทม. เฝ้าระวังถนนสุขุมวิท ถนนสุขสวัสดิ์ และถนนพระราม 2",
          "ครม. อนุมัติงบกลาง 4,000 ล้านบาทเพื่อเยียวยาผู้ประสบอุทกภัย มีรายงานว่ากรุงเทพฯ จะใช้เกณฑ์เดียวกับต่างจังหวัด ครัวเรือนละ 9,000 บาท แต่นายกรัฐมนตรียังไม่ยืนยัน",
          "ผู้ว่าฯ กทม. คาดว่าถนนสายหลักราวร้อยละ 90 จะแห้งภายใน 2 วัน ยังมีจุดที่ต้องติดตามกว่า 40 จุด ส่วนใหญ่อยู่ในเขตลาดกระบังและสายไหม",
          "ยังเฝ้าระวังถนนรามคำแหง ถนนเสรีไทย ถนนนวมินทร์ และถนนหลวงแพ่ง ส่วนระดับน้ำในคลองแสนแสบลดลงชัดเจน",
          "ขึ้นทางพิเศษและมอเตอร์เวย์ฟรีถึงเวลา 24.00 น. คืนนี้เป็นวันสุดท้าย",
          "พยากรณ์อากาศกรุงเทพฯ มีพายุฝนฟ้าคะนองร้อยละ 40 ถึง 60 ของพื้นที่ถึงวันที่ 4 ตุลาคม กรมอุตุนิยมวิทยาคาดว่าจะมีฝนรอบใหม่ในวันที่ 5 ถึง 10 ตุลาคม",
          "เวลา 23.19 น. BMA Flood Support มีศูนย์พักพิง 207 แห่ง มีผู้เข้าพัก 4,461 คน ดูตัวเลขล่าสุดได้ที่ช่องค้นหาตามเขตในหน้านี้",
        ],
      },
    },
    {
      at: "2026-09-29T18:15:00+07:00",
      emblem: "thammasat",
      text: {
        en: "Thammasat has extended online teaching. All courses at every campus are online until Saturday 3 October.",
        th: "ธรรมศาสตร์ขยายการเรียนออนไลน์ ทุกรายวิชาทุกศูนย์การศึกษาเรียนออนไลน์ถึงวันเสาร์ที่ 3 ตุลาคม",
      },
      points: {
        en: [
          "Faculties decide which courses must be taught in person. Your lecturer will tell you in advance.",
          "If students are still affected after 3 October, lecturers may keep classes online or hybrid until things improve, and will tell you in advance.",
          "Midterms stay as announced on 26 September, on 4 and 11 October.",
          "Rector Supasawad Chardchawarn signed the announcement (No. 2) on 29 September.",
        ],
        th: [
          "รายวิชาที่จำเป็นต้องเรียนในชั้นเรียน อยู่ในดุลยพินิจของคณะหรือส่วนงาน อาจารย์ผู้สอนจะแจ้งล่วงหน้า",
          "หากหลังวันที่ 3 ตุลาคม นักศึกษายังได้รับผลกระทบ อาจารย์ผู้สอนอาจจัดการเรียนการสอนแบบออนไลน์หรือแบบผสมผสานต่อไปจนกว่าสถานการณ์จะคลี่คลาย และจะแจ้งล่วงหน้า",
          "การสอบกลางภาคยังเป็นไปตามประกาศวันที่ 26 กันยายน คือวันที่ 4 และ 11 ตุลาคม",
          "ศาสตราจารย์ศุภสวัสดิ์ ชัชวาลย์ อธิการบดี ลงนามในประกาศ (ฉบับที่ 2) เมื่อวันที่ 29 กันยายน",
        ],
      },
    },
    {
      at: "2026-09-29T17:25:00+07:00",
      emblem: "garuda",
      text: {
        en: "The BMA has ended the disaster declaration in 21 of Bangkok's 50 districts, including Phra Nakhon, where Tha Prachan is. The other 29 districts are still a disaster area.",
        th: "กทม. ประกาศให้สาธารณภัยสิ้นสุดลงใน 21 เขต จากทั้งหมด 50 เขต รวมถึงเขตพระนครซึ่งเป็นที่ตั้งของท่าพระจันทร์ ส่วนอีก 29 เขตยังเป็นเขตพื้นที่ประสบสาธารณภัย",
      },
      points: {
        en: [
          "Governor Chadchart Sittipunt signed the announcement on 29 September. The BMA found 21 districts unaffected, 14 moderately affected and 15 badly affected.",
          "The 29 districts still in the disaster area are Bang Bon, Bang Kapi, Bang Khen, Bang Na, Bang Phlat, Bang Sue, Bueng Kum, Chatuchak, Din Daeng, Don Mueang, Dusit, Huai Khwang, Khan Na Yao, Khlong Sam Wa, Lak Si, Lat Krabang, Min Buri, Nong Chok, Phaya Thai, Phra Khanong, Prawet, Ratchathewi, Sai Mai, Saphan Sung, Suan Luang, Thawi Watthana, Thung Khru, Wang Thonglang and Watthana.",
          "Government offices reopen on Wednesday 30 September. BMA schools in the 15 worst hit districts stay closed until 2 October. The BMA is clearing flood rubbish and towing abandoned cars overnight.",
          "The education minister says 155 flooded schools in Bangkok will stay closed this week.",
          "At 06:00 about 20 roads were still flooded. The deepest were Phatthanakan at Srinagarindra (31 cm), Lat Phrao 122 (22 cm) and Nawamin (22 cm).",
          "DDPM counts 329,000 families affected in Bangkok. Canal levels are steady.",
          "Scattered thunderstorms are forecast for Bangkok.",
        ],
        th: [
          "นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ลงนามในประกาศเมื่อวันที่ 29 กันยายน ผลการตรวจสอบพบว่า 21 เขตไม่ได้รับผลกระทบ 14 เขตได้รับผลกระทบปานกลาง และ 15 เขตได้รับผลกระทบระดับสูง",
          "29 เขตที่ยังเป็นเขตพื้นที่ประสบสาธารณภัย ได้แก่ คลองสามวา คันนายาว จตุจักร ดอนเมือง ดินแดง ดุสิต ทวีวัฒนา ทุ่งครุ บางเขน บางกะปิ บางซื่อ บางนา บางบอน บางพลัด บึงกุ่ม ประเวศ พญาไท พระโขนง มีนบุรี ราชเทวี ลาดกระบัง วังทองหลาง วัฒนา สวนหลวง สะพานสูง สายไหม หนองจอก หลักสี่ และห้วยขวาง",
          "หน่วยงานราชการกลับมาเปิดตามปกติในวันพุธที่ 30 กันยายน ส่วนโรงเรียนสังกัด กทม. ใน 15 เขตที่ได้รับผลกระทบสูงยังปิดถึงวันที่ 2 ตุลาคม คืนนี้ กทม. เร่งเก็บขยะหลังน้ำลดและยกรถที่จอดทิ้งไว้กีดขวางทาง",
          "รัฐมนตรีว่าการกระทรวงศึกษาธิการระบุว่า โรงเรียนในกรุงเทพฯ 155 แห่งที่น้ำยังท่วมขังจะยังเปิดเรียนไม่ได้ในสัปดาห์นี้",
          "เวลา 06.00 น. ยังมีถนนน้ำท่วมขังราว 20 สาย จุดที่ลึกที่สุด ได้แก่ ถนนพัฒนาการแยกศรีนครินทร์ (31 ซม.) ซอยลาดพร้าว 122 (22 ซม.) และถนนนวมินทร์ (22 ซม.)",
          "ปภ. รายงานว่ามีผู้ได้รับผลกระทบในกรุงเทพฯ 329,000 ครัวเรือน ระดับน้ำในคลองทรงตัว",
          "คาดว่ากรุงเทพฯ จะมีพายุฝนฟ้าคะนองกระจายเป็นแห่ง ๆ",
        ],
      },
    },
    {
      at: "2026-09-28T14:45:00+07:00",
      text: {
        en: "BIR has emailed all BIR students a survey on whether you can study during the heavy rain. The results will help the programme decide how to arrange classes. Check your email for the link and fill in the survey.",
        th: "BIR ส่งแบบสำรวจความพร้อมในการเรียนช่วงฝนตกหนักให้นักศึกษา BIR ทุกคนทางอีเมลแล้ว ผลสำรวจจะนำไปใช้ประกอบการตัดสินใจเรื่องการจัดการเรียนการสอน โปรดตรวจสอบอีเมลเพื่อดูลิงก์และตอบแบบสำรวจ",
      },
    },
    {
      at: "2026-09-28T10:05:00+07:00",
      text: {
        en: "BMA readings at 10:00 show the rain has almost stopped and fewer canals are at critical level, but roads in the north and east are still flooded. Thammasat classes are online today and tomorrow, as announced before.",
        th: "ข้อมูลจากสถานีตรวจวัดของ กทม. เวลา 10.00 น. พบว่าฝนเกือบหยุดตกแล้ว และคลองที่อยู่ในขั้นวิกฤตลดลง แต่ถนนทางเหนือและตะวันออกของเมืองยังมีน้ำท่วมขัง ธรรมศาสตร์เรียนออนไลน์วันนี้และพรุ่งนี้ตามที่ประกาศไว้ก่อนหน้า",
      },
      points: {
        en: [
          "By 10:00 Thammasat had announced no change for Wednesday 30 September. This page will say if that changes.",
          "At 07:00 the BMA flood centre listed high water on Ramkhamhaeng Road from Rama 9 Road to the Lam Sali junction, Srinagarindra Road from Lam Sali to Phatthanakan, Nawamin Road, Lat Phrao Road near Bang Kapi, Ngam Wong Wan Road, Phahon Yothin Road near Kasetsart University, Seri Thai Road, Suwinthawong Road in Min Buri and Krungthep Kreetha Road. Small cars cannot pass the Bang Kapi junction. Vibhavadi Rangsit Road was passable again by 06:30.",
          "No rain gauge recorded more than 3.5 mm in the past hour. The highest 24 hour totals were 49.5 mm on Khlong Prawet Burirom in Lat Krabang and 48.5 mm in Min Buri.",
          "95 of 302 canal stations were at critical level, down from 115 at 16:50 yesterday, and 27 were at warning level. Most are in Lat Krabang, Bang Kapi, Suan Luang, Nong Chok, Khlong Sam Wa, Thawi Watthana, Prawet and Wang Thonglang. Khlong Prawet Burirom is critical at all 7 stations, Khlong Lat Phrao at all 5 working stations and Khlong Saen Saep at 8 of 11.",
          "Road sensors showed flooding at 8 points. The deepest were Phatthanakan at Srinagarindra (44 cm), Lat Phrao 122 (44 cm), Nawamin at Santi Asoke (40 cm), Ngam Wong Wan at Phong Phet (32 cm), Ngam Wong Wan at Soi Chinnakhet (23 cm) and Phahon Yothin 60/1 (22 cm). Sena Nikhom 1 is down to 9 cm from 55 cm yesterday evening. A further 38 points without a live reading were reported flooded at 5 to 20 cm, including Ramkhamhaeng, Srinagarindra at Lam Sali, Chaeng Watthana and Chao Khun Thahan Road in Lat Krabang.",
          "Around Tha Prachan 8 to 17 mm fell in 24 hours. The canals are normal and the roads are dry. The Chao Phraya is 1.56 m at Pak Khlong Talat and 1.38 m at Sathon, below the warning levels of 2.30 m and 2.10 m.",
          "The BMA is pumping hardest on Khlong Saen Saep, Khlong Lat Phrao, Khlong Prawet Burirom and Khlong Prem Prachakon, and the Makkasan tunnel is draining water into the Chao Phraya. Governor Chadchart Sittipunt says about 700,000 people have been affected in Bangkok.",
          "At 10:00 BMA Flood Support listed 205 shelters with 3,919 people staying. Nine were full, four in Saphan Sung, four in Khlong Sam Wa and Sena Nikhom School in Chatuchak. KMITL has opened its Chao Phraya Surawong Waiwat Hall in Lat Krabang, with 490 people staying in space for 1,500. Four of 42 car parks were full, including Rattana Pracharak Hospital in Khlong Sam Wa. The district search on this page has the new numbers.",
          "BMA schools are closed today. Thai Meteorological Department warning No. 16, issued at 17:00 yesterday, says rain in Bangkok is easing but still falling, with heavy rain in places. Thunderstorms are forecast over 70% of Bangkok today.",
        ],
        th: [
          "จนถึงเวลา 10.00 น. ธรรมศาสตร์ยังไม่มีประกาศเปลี่ยนแปลงสำหรับวันพุธที่ 30 กันยายน หากมีการเปลี่ยนแปลงจะแจ้งในหน้านี้",
          "เวลา 07.00 น. ศูนย์ป้องกันน้ำท่วมของ กทม. รายงานว่ายังมีน้ำสูงที่ถนนรามคำแหงช่วงถนนพระราม 9 ถึงแยกลำสาลี ถนนศรีนครินทร์ช่วงแยกลำสาลีถึงแยกพัฒนาการ ถนนนวมินทร์ ถนนลาดพร้าวบริเวณบางกะปิ ถนนงามวงศ์วาน ถนนพหลโยธินใกล้มหาวิทยาลัยเกษตรศาสตร์ ถนนเสรีไทย ถนนสุวินทวงศ์ เขตมีนบุรี และถนนกรุงเทพกรีฑา รถเล็กผ่านแยกบางกะปิไม่ได้ ส่วนถนนวิภาวดีรังสิตกลับมาสัญจรได้ตั้งแต่เวลา 06.30 น.",
          "ในชั่วโมงที่ผ่านมาไม่มีสถานีวัดน้ำฝนใดวัดฝนได้เกิน 3.5 มม. ฝนสะสม 24 ชั่วโมงสูงสุด 49.5 มม. ที่คลองประเวศบุรีรมย์ เขตลาดกระบัง และ 48.5 มม. ที่เขตมีนบุรี",
          "ระดับน้ำในคลองอยู่ในขั้นวิกฤตที่ 95 สถานี จาก 302 สถานี ลดลงจาก 115 สถานีเมื่อเวลา 16.50 น. เมื่อวานนี้ และอยู่ในขั้นเฝ้าระวังอีก 27 สถานี ส่วนใหญ่อยู่ในเขตลาดกระบัง บางกะปิ สวนหลวง หนองจอก คลองสามวา ทวีวัฒนา ประเวศ และวังทองหลาง คลองประเวศบุรีรมย์อยู่ในขั้นวิกฤตทั้ง 7 สถานี คลองลาดพร้าวทั้ง 5 สถานีที่ใช้งานได้ และคลองแสนแสบ 8 จาก 11 สถานี",
          "สถานีวัดบนถนนพบน้ำท่วมขัง 8 จุด จุดที่ลึกที่สุด ได้แก่ ถนนพัฒนาการแยกศรีนครินทร์ (44 ซม.) ซอยลาดพร้าว 122 (44 ซม.) ถนนนวมินทร์ช่วงสันติอโศก (40 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (32 ซม.) ถนนงามวงศ์วานซอยชินเขต (23 ซม.) และซอยพหลโยธิน 60/1 (22 ซม.) ส่วนถนนเสนานิคม 1 ลดลงเหลือ 9 ซม. จาก 55 ซม. เมื่อเย็นวานนี้ นอกจากนี้ยังมีรายงานน้ำท่วม 5 ถึง 20 ซม. อีก 38 จุดที่ไม่มีสถานีวัดแบบเรียลไทม์ เช่น ถนนรามคำแหง ถนนศรีนครินทร์แยกลำสาลี ถนนแจ้งวัฒนะ และถนนเจ้าคุณทหาร เขตลาดกระบัง",
          "บริเวณรอบท่าพระจันทร์มีฝนตก 8 ถึง 17 มม. ใน 24 ชั่วโมง ระดับน้ำในคลองยังปกติ และจุดวัดน้ำบนถนนไม่มีน้ำขัง ระดับแม่น้ำเจ้าพระยาที่ปากคลองตลาดอยู่ที่ 1.56 ม. และที่สาทร 1.38 ม. ต่ำกว่าระดับเตือนภัยที่ 2.30 ม. และ 2.10 ม.",
          "กทม. เร่งสูบน้ำในคลองแสนแสบ คลองลาดพร้าว คลองประเวศบุรีรมย์ และคลองเปรมประชากร และใช้อุโมงค์ระบายน้ำบึงมักกะสันระบายน้ำลงแม่น้ำเจ้าพระยา นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ระบุว่ามีผู้ได้รับผลกระทบในกรุงเทพฯ ราว 700,000 คน",
          "เวลา 10.00 น. BMA Flood Support แสดงศูนย์พักพิง 205 แห่ง มีผู้เข้าพักรวม 3,919 คน ในจำนวนนี้เต็มแล้ว 9 แห่ง อยู่ในเขตสะพานสูง 4 แห่ง เขตคลองสามวา 4 แห่ง และโรงเรียนเสนานิคม เขตจตุจักร สจล. เปิดหอประชุมเจ้าพระยาสุรวงษ์ไวยวัฒน์ เขตลาดกระบัง เป็นศูนย์พักพิง มีผู้เข้าพัก 490 คน จากที่รองรับได้ 1,500 คน ส่วนจุดจอดรถ 42 แห่ง เต็มแล้ว 4 แห่ง รวมถึงโรงพยาบาลรัตนประชารักษ์ เขตคลองสามวา ดูตัวเลขล่าสุดได้ที่ช่องค้นหาตามเขตในหน้านี้",
          "โรงเรียนสังกัด กทม. หยุดเรียนวันนี้ ประกาศกรมอุตุนิยมวิทยาฉบับที่ 16 ซึ่งออกเมื่อเวลา 17.00 น. เมื่อวานนี้ ระบุว่าฝนในกรุงเทพฯ ลดลงแต่ยังตกต่อเนื่อง และอาจมีฝนตกหนักบางแห่ง วันนี้คาดว่าจะมีพายุฝนฟ้าคะนองร้อยละ 70 ของพื้นที่กรุงเทพฯ",
        ],
      },
    },
    {
      at: "2026-09-27T23:40:00+07:00",
      text: {
        en: "The Thammasat shuttle buses are running as normal on both lines, on their usual timetables, for students, staff and visitors. New timetables with one bus on each line start on Thursday 1 October.",
        th: "รถเวียนธรรมศาสตร์ให้บริการตามปกติทั้ง 2 เส้นทางตามตารางเวลาเดิม รองรับการเดินทางของนักศึกษา บุคลากร และผู้มาติดต่อ และตั้งแต่วันพฤหัสบดีที่ 1 ตุลาคม จะเปลี่ยนเป็นตารางเวลาใหม่ โดยเหลือรถสายละ 1 คัน",
      },
    },
    {
      at: "2026-09-27T17:30:00+07:00",
      text: {
        en: "The cabinet has made Monday 28 and Tuesday 29 September special public holidays for government offices in Bangkok, Nonthaburi, Pathum Thani and Samut Prakan because of the floods.",
        th: "ครม. มีมติให้วันจันทร์ที่ 28 และวันอังคารที่ 29 กันยายน เป็นวันหยุดราชการกรณีพิเศษในกรุงเทพฯ นนทบุรี ปทุมธานี และสมุทรปราการ เพื่อบรรเทาผลกระทบจากน้ำท่วม",
      },
      points: {
        en: [
          "The government has also extended free travel on the expressways until midnight on Tuesday 29 September. Thammasat classes are online on both days, as announced before.",
          "BMA readings at 16:50 show the rain has almost stopped. No rain gauge recorded more than 1.5 mm in the past hour. Some rain fell in the north and east this afternoon, so the highest 24 hour total rose to 63 mm at Don Mueang.",
          "115 of 304 canal stations were at critical level, down from 118 at midday, and 31 were at warning level. Most are in Lat Krabang, Thawi Watthana and Bang Kapi.",
          "BMA road sensors cover only part of the city. The BMA flood reporting centre listed 135 flooded points on 31 main roads this morning. Water was over 20 cm on Ram Inthra Road from Soi 5 to Soi 13/1, on Phahon Yothin Road near Kasetsart University, on Ramkhamhaeng Road, on Srinagarindra Road from the Lam Sali junction and on Nawamin Road. At midday New Phetchaburi Road was flooded 40 to 50 cm from Thong Lo to Khlong Tan.",
          "At 16:50 the deepest sensor readings were Sena Nikhom 1 (55 cm), Lat Phrao 122 (50 cm), Phatthanakan at Srinagarindra (48 cm), Ngam Wong Wan at Phong Phet (46 cm) and Nawamin at Santi Asoke (43 cm). Phahon Yothin 60/1 and Ramkhamhaeng Soi 3 have flooded since midday.",
          "Around Tha Prachan the canals are normal and the roads are dry. The Chao Phraya has risen with the evening tide to 1.64 m at Pak Khlong Talat and 1.61 m at Sathon, still below warning level. Take care at piers tonight. The Chao Phraya Dam kept its release at 1,950 cubic metres a second for a second day.",
          "At 16:56 BMA Flood Support listed 204 shelters with 3,429 people staying. Nine were full, four in Saphan Sung and four in Khlong Sam Wa, and Sena Nikhom School in Chatuchak had 299 people in space for 150. The district search on this page has the new numbers.",
          "Residents of the Khlong Chan flats in Bang Kapi have been cut off by water, and 20 more people have been moved out of Kheha Romklao building 27 in Lat Krabang.",
          "DDPM counted 174,803 families affected in 25 provinces at 06:00, about 52,000 of them in Bangkok. Thai Meteorological Department warning No. 15, issued at 11:00, says rain in Bangkok is easing but may still be heavy in places.",
        ],
        th: [
          "รัฐบาลขยายเวลาขึ้นทางพิเศษฟรีถึงเวลา 24.00 น. ของวันอังคารที่ 29 กันยายน ส่วนธรรมศาสตร์เรียนออนไลน์ทั้งสองวันตามที่ประกาศไว้ก่อนหน้า",
          "ข้อมูลจากสถานีตรวจวัดของ กทม. เวลา 16.50 น. พบว่าฝนเกือบหยุดตกแล้ว ในชั่วโมงที่ผ่านมาไม่มีสถานีใดวัดฝนได้เกิน 1.5 มม. แต่ช่วงบ่ายมีฝนตกทางเหนือและตะวันออกของเมือง ฝนสะสม 24 ชั่วโมงสูงสุดจึงเพิ่มเป็น 63 มม. ที่เขตดอนเมือง",
          "ระดับน้ำในคลองอยู่ในขั้นวิกฤตที่ 115 สถานี จาก 304 สถานี ลดลงจาก 118 สถานีเมื่อช่วงเที่ยง และอยู่ในขั้นเฝ้าระวังอีก 31 สถานี ส่วนใหญ่อยู่ในเขตลาดกระบัง ทวีวัฒนา และบางกะปิ",
          "สถานีวัดน้ำบนถนนของ กทม. ครอบคลุมเพียงบางส่วนของเมือง เมื่อเช้านี้ศูนย์รายงานสถานการณ์น้ำท่วมของ กทม. พบน้ำท่วมขัง 135 จุด บนถนนสายหลัก 31 สาย น้ำสูงเกิน 20 ซม. ที่ถนนรามอินทราช่วงซอย 5 ถึงซอย 13/1 ถนนพหลโยธินใกล้มหาวิทยาลัยเกษตรศาสตร์ ถนนรามคำแหง ถนนศรีนครินทร์ตั้งแต่แยกลำสาลี และถนนนวมินทร์ ช่วงเที่ยงถนนเพชรบุรีตัดใหม่ช่วงทองหล่อถึงคลองตันมีน้ำท่วม 40 ถึง 50 ซม.",
          "เวลา 16.50 น. สถานีวัดที่พบน้ำลึกที่สุด ได้แก่ ถนนเสนานิคม 1 (55 ซม.) ซอยลาดพร้าว 122 (50 ซม.) ถนนพัฒนาการแยกศรีนครินทร์ (48 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (46 ซม.) และถนนนวมินทร์ช่วงสันติอโศก (43 ซม.) ส่วนซอยพหลโยธิน 60/1 และถนนรามคำแหงซอย 3 มีน้ำท่วมขังตั้งแต่ช่วงเที่ยง",
          "บริเวณรอบท่าพระจันทร์ ระดับน้ำในคลองยังปกติและถนนไม่มีน้ำขัง ระดับแม่น้ำเจ้าพระยาสูงขึ้นตามน้ำขึ้นช่วงค่ำ ที่ปากคลองตลาดอยู่ที่ 1.64 ม. และที่สาทร 1.61 ม. ยังต่ำกว่าระดับเตือนภัย โปรดระวังเมื่ออยู่ที่ท่าเรือคืนนี้ เขื่อนเจ้าพระยาคงการระบายน้ำไว้ที่ 1,950 ลูกบาศก์เมตรต่อวินาทีเป็นวันที่สอง",
          "เวลา 16.56 น. BMA Flood Support แสดงศูนย์พักพิง 204 แห่ง มีผู้เข้าพักรวม 3,429 คน ในจำนวนนี้เต็มแล้ว 9 แห่ง อยู่ในเขตสะพานสูง 4 แห่ง และเขตคลองสามวา 4 แห่ง ส่วนโรงเรียนเสนานิคม เขตจตุจักร มีผู้เข้าพักถึง 299 คน ทั้งที่รองรับได้เพียง 150 คน ดูตัวเลขล่าสุดได้ที่ช่องค้นหาตามเขตในหน้านี้",
          "ผู้พักอาศัยในแฟลตคลองจั่น เขตบางกะปิ ติดน้ำออกมาไม่ได้ ส่วนที่เคหะร่มเกล้า เขตลาดกระบัง อพยพผู้พักอาศัยอาคาร 27 ออกมาอีก 20 คน",
          "ปภ. รายงานเมื่อเวลา 06.00 น. ว่ามีผู้ได้รับผลกระทบ 174,803 ครัวเรือน ใน 25 จังหวัด ในจำนวนนี้อยู่ในกรุงเทพฯ ราว 52,000 ครัวเรือน ประกาศกรมอุตุนิยมวิทยาฉบับที่ 15 ซึ่งออกเมื่อเวลา 11.00 น. ระบุว่าฝนในกรุงเทพฯ ลดลง แต่ยังอาจมีฝนตกหนักบางแห่ง",
        ],
      },
    },
    {
      at: "2026-09-27T14:00:00+07:00",
      text: {
        en: "The Faculty of Political Science has closed its offices at Tha Prachan and Rangsit to in-person visits on Monday 28 and Tuesday 29 September. Staff are working remotely, so contact the faculty online instead.",
        th: "คณะรัฐศาสตร์ งดติดต่อ Onsite ทั้งท่าพระจันทร์และศูนย์รังสิต ในวันจันทร์ที่ 28 และวันอังคารที่ 29 กันยายน บุคลากรปฏิบัติงานแบบ Work from Anywhere โปรดติดต่อคณะทางออนไลน์",
      },
    },
    {
      at: "2026-09-27T12:30:00+07:00",
      text: {
        en: "BMA readings at 12:05 show the rain has almost stopped and canals are slowly falling, but roads in the north and east are still flooded. The governor expects main roads to be back to normal in two to three days.",
        th: "ข้อมูลจากสถานีตรวจวัดของ กทม. เวลา 12.05 น. พบว่าฝนเกือบหยุดตกแล้ว และระดับน้ำในคลองค่อย ๆ ลดลง แต่ถนนทางเหนือและตะวันออกของเมืองยังมีน้ำท่วมขัง ผู้ว่าราชการกรุงเทพมหานครคาดว่าถนนสายหลักจะกลับมาสัญจรได้ตามปกติภายใน 2 ถึง 3 วัน",
      },
      points: {
        en: [
          "No rain gauge recorded more than 1.5 mm in the past hour, and the most in the past three hours was 15.5 mm at Don Mueang. In the 24 hours to 12:05 no gauge recorded more than 100 mm, down from 62 at 18:35 yesterday. The highest was 55 mm at Don Mueang.",
          "118 of 304 canal stations were at critical level, down from 138 at 18:35 yesterday, and 30 more were at warning level. Most are in Lat Krabang, Thawi Watthana and Bang Kapi, and in the north along Khlong Prem Prachakon. The governor said Khlong Prem Prachakon, Khlong Lat Phrao, Khlong Saen Saep and Khlong Prawet Burirom are still critical because water from surrounding areas keeps flowing in as it is pumped out.",
          "Road sensors showed flooding at 11 points, down from 18. The deepest were Sena Nikhom 1 (57 cm), Lat Phrao 122 (53 cm), Ngam Wong Wan at Phong Phet (50 cm), Phatthanakan at Srinagarindra (49 cm) and Nawamin at Santi Asoke (41 cm). New Phetchaburi at Singha Complex is now dry. A further 42 points without a live reading were reported flooded at about 10 to 20 cm. Lat Phrao Road from Big C towards Bang Kapi was closed to small cars this morning.",
          "Around Tha Prachan 6.5 to 15 mm fell in 24 hours. The canals are normal and the road sensors are dry. The Chao Phraya is 0.99 m at Pak Khlong Talat and 0.77 m at Sathon, well below warning level, but it rises at the evening high tide.",
          "Governor Chadchart Sittipunt said at 09:20 that the low pressure has moved towards Myanmar and rain should fall to 10 to 20 mm a day. Communities beside canals will take about two weeks to dry out. At Kheha Romklao in Lat Krabang more than 1,000 people have moved to KMITL, and 40 to 50 bedridden patients have been moved.",
          "At 12:23 BMA Flood Support listed 208 shelters in 35 districts, with 2,546 people staying. Eight were full, four in Saphan Sung and four in Khlong Sam Wa. Four of its 41 car parks were full, including Rattana Pracharak Hospital in Khlong Sam Wa and Robinson Suvarnabhumi in Lat Krabang. The district search on this page has the latest numbers.",
          "Thai Meteorological Department warning No. 14, issued at 05:00, says rain in Bangkok is starting to ease but may still be heavy in places.",
        ],
        th: [
          "ในชั่วโมงที่ผ่านมาไม่มีสถานีวัดน้ำฝนใดวัดฝนได้เกิน 1.5 มม. และในสามชั่วโมงที่ผ่านมา ฝนตกสูงสุด 15.5 มม. ที่เขตดอนเมือง ใน 24 ชั่วโมงจนถึงเวลา 12.05 น. ไม่มีสถานีใดวัดฝนได้เกิน 100 มม. ลดลงจาก 62 แห่งเมื่อเวลา 18.35 น. เมื่อวานนี้ สูงสุด 55 มม. ที่เขตดอนเมือง",
          "ระดับน้ำในคลองอยู่ในขั้นวิกฤตที่ 118 สถานี จาก 304 สถานี ลดลงจาก 138 สถานีเมื่อเวลา 18.35 น. เมื่อวานนี้ และอยู่ในขั้นเฝ้าระวังอีก 30 สถานี ส่วนใหญ่อยู่ในเขตลาดกระบัง ทวีวัฒนา และบางกะปิ รวมถึงทางเหนือของเมืองตามแนวคลองเปรมประชากร ผู้ว่าฯ ระบุว่าคลองเปรมประชากร คลองลาดพร้าว คลองแสนแสบ และคลองประเวศบุรีรมย์ ยังอยู่ในขั้นวิกฤต เพราะเมื่อสูบน้ำออก น้ำจากพื้นที่โดยรอบก็ไหลเข้ามาเติมตลอด",
          "สถานีวัดบนถนนพบน้ำท่วมขัง 11 จุด ลดลงจาก 18 จุด จุดที่ลึกที่สุด ได้แก่ ถนนเสนานิคม 1 (57 ซม.) ซอยลาดพร้าว 122 (53 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (50 ซม.) ถนนพัฒนาการแยกศรีนครินทร์ (49 ซม.) และถนนนวมินทร์ช่วงสันติอโศก (41 ซม.) ส่วนถนนเพชรบุรีตัดใหม่หน้าสิงห์คอมเพล็กซ์ไม่มีน้ำขังแล้ว นอกจากนี้ยังมีรายงานน้ำท่วมราว 10 ถึง 20 ซม. อีก 42 จุดที่ไม่มีสถานีวัดแบบเรียลไทม์ และเมื่อเช้านี้ถนนลาดพร้าวช่วงบิ๊กซีมุ่งหน้าบางกะปิ รถเล็กผ่านไม่ได้",
          "บริเวณรอบท่าพระจันทร์มีฝนตก 6.5 ถึง 15 มม. ใน 24 ชั่วโมง ระดับน้ำในคลองยังปกติ และจุดวัดน้ำบนถนนไม่มีน้ำขัง ระดับแม่น้ำเจ้าพระยาที่ปากคลองตลาดอยู่ที่ 0.99 ม. และที่สาทร 0.77 ม. ต่ำกว่าระดับเตือนภัยอยู่มาก แต่ระดับน้ำจะสูงขึ้นช่วงน้ำขึ้นตอนค่ำ",
          "นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ระบุเมื่อเวลา 09.20 น. ว่าหย่อมความกดอากาศต่ำเคลื่อนไปทางเมียนมาแล้ว และฝนน่าจะลดลงเหลือวันละ 10 ถึง 20 มม. ส่วนชุมชนริมคลองจะใช้เวลาราว 2 สัปดาห์กว่าน้ำจะแห้ง ที่ชุมชนเคหะร่มเกล้า เขตลาดกระบัง มีผู้อพยพไปพักที่ สจล. แล้วกว่า 1,000 คน และเคลื่อนย้ายผู้ป่วยติดเตียงแล้ว 40 ถึง 50 คน",
          "เวลา 12.23 น. BMA Flood Support แสดงศูนย์พักพิง 208 แห่งใน 35 เขต มีผู้เข้าพักรวม 2,546 คน ในจำนวนนี้เต็มแล้ว 8 แห่ง อยู่ในเขตสะพานสูง 4 แห่ง และเขตคลองสามวา 4 แห่ง ส่วนจุดจอดรถ 41 แห่ง เต็มแล้ว 4 แห่ง รวมถึงโรงพยาบาลรัตนประชารักษ์ เขตคลองสามวา และโรบินสัน สุวรรณภูมิ เขตลาดกระบัง ดูตัวเลขล่าสุดได้ที่ช่องค้นหาตามเขตในหน้านี้",
          "ประกาศกรมอุตุนิยมวิทยาฉบับที่ 14 ซึ่งออกเมื่อเวลา 05.00 น. ระบุว่าฝนในกรุงเทพฯ เริ่มลดลง แต่ยังอาจมีฝนตกหนักบางแห่ง",
        ],
      },
    },
    {
      at: "2026-09-26T23:35:00+07:00",
      text: {
        en: "Thammasat University Library has closed every branch at Tha Prachan, Rangsit and Lampang from 27 to 29 September. The Learning Center at Rangsit stays open as usual.",
        th: "หอสมุดแห่งมหาวิทยาลัยธรรมศาสตร์ปิดห้องสมุดสาขาทุกแห่งที่ท่าพระจันทร์ ศูนย์รังสิต และศูนย์ลำปาง ในวันที่ 27 ถึง 29 กันยายน ยกเว้นศูนย์การเรียนรู้ฯ ศูนย์รังสิต ซึ่งเปิดให้บริการตามปกติ",
      },
      points: {
        en: [
          "Contact the library on LINE @LifeONLine (live chat) or on Facebook at Thammasat University Library.",
          "The library will announce any change to these dates.",
        ],
        th: [
          "ติดต่อห้องสมุดได้ทาง LINE @LifeONLine (Live Chat) หรือเพจ Facebook Thammasat University Library",
          "หอสมุดฯ จะแจ้งให้ทราบหากมีการเปลี่ยนแปลงวันเปิดให้บริการ",
        ],
      },
    },
    {
      at: "2026-09-26T21:45:00+07:00",
      text: {
        en: "You can now claim compensation from the BMA if your home was damaged or flooded. This page explains how, and where flooding is most likely near Tha Prachan over the next week.",
        th: "ผู้ที่บ้านหรือที่พักเสียหาย หรือมีน้ำท่วมเข้าที่พัก ยื่นขอรับเงินช่วยเหลือจาก กทม. ได้แล้ว หน้านี้อธิบายขั้นตอนการยื่น และจุดเสี่ยงน้ำท่วมบริเวณท่าพระจันทร์ในสัปดาห์หน้า",
      },
      points: {
        en: [
          "The BMA pays up to 49,500 baht for repairs to your home and up to 3,000 baht for somewhere to stay, or 3,000 baht a month for up to two months if the whole home was damaged. Tenants claim, not landlords. Report the damage to your district office, then take the fact-finding form and your documents there. The form and the full list of documents are in the section on claiming help.",
          "The Chao Phraya Dam raised its release from 1,850 to 1,950 cubic metres a second on 26 September, close to its 2,000 limit. The extra water reaches Bangkok around 28 and 29 September, and the flow from the north is expected to peak around 2 October.",
          "The tides are at their highest of the month until about 3 October, with high water every evening between about 19:00 and 22:00 and, from 29 September, again in the morning. Heavy rain at high tide can make the drains overflow around the Tha Prachan gate and the Faculty of Liberal Arts. Take care at piers around high tide.",
        ],
        th: [
          "กทม. ช่วยเหลือค่าซ่อมแซมที่พักไม่เกิน 49,500 บาท และค่าที่พักชั่วคราวไม่เกิน 3,000 บาท หรือเดือนละไม่เกิน 3,000 บาท ไม่เกิน 2 เดือนหากเสียหายทั้งหลัง กรณีบ้านเช่า ผู้เช่าเป็นผู้มีสิทธิ แจ้งความเสียหายที่สำนักงานเขต แล้วนำแบบสอบข้อเท็จจริงและเอกสารหลักฐานไปยื่น แบบฟอร์มและรายการเอกสารทั้งหมดอยู่ในหัวข้อการขอรับเงินช่วยเหลือ",
          "เขื่อนเจ้าพระยาเพิ่มการระบายน้ำจาก 1,850 เป็น 1,950 ลูกบาศก์เมตรต่อวินาทีเมื่อวันที่ 26 กันยายน ใกล้ขีดจำกัดที่ 2,000 ลูกบาศก์เมตรต่อวินาที น้ำส่วนที่เพิ่มจะถึงกรุงเทพฯ ราววันที่ 28 และ 29 กันยายน และคาดว่าน้ำเหนือจะสูงสุดราววันที่ 2 ตุลาคม",
          "ตั้งแต่นี้ถึงราววันที่ 3 ตุลาคม เป็นช่วงน้ำทะเลหนุนสูงสุดของเดือน น้ำขึ้นสูงทุกค่ำช่วงประมาณ 19.00 ถึง 22.00 น. และตั้งแต่วันที่ 29 กันยายนจะขึ้นสูงอีกรอบช่วงเช้า หากฝนตกหนักช่วงน้ำขึ้น น้ำอาจเอ่อจากท่อระบายน้ำบริเวณประตูท่าพระจันทร์และคณะศิลปศาสตร์ โปรดระวังเมื่ออยู่ที่ท่าเรือช่วงน้ำขึ้น",
        ],
      },
    },
    {
      at: "2026-09-26T20:50:00+07:00",
      text: {
        en: "The shelter and parking search on this page now includes every shelter and car park on BMA Flood Support, with capacity, numbers at 20:47, map links and phone numbers.",
        th: "ช่องค้นหาศูนย์พักพิงและจุดจอดรถตามเขตในหน้านี้ มีข้อมูลครบทุกแห่งจาก BMA Flood Support แล้ว พร้อมจำนวนที่รองรับ จำนวนผู้เข้าพัก ณ เวลา 20.47 น. ลิงก์แผนที่ และเบอร์โทรศัพท์",
      },
      points: {
        en: [
          "BMA Flood Support lists 198 shelters in 34 districts and 33 car parks. Places that were full or nearly full at 20:47 are marked.",
          "Pracharat Upatham Witthaya School in Khlong Sam Wa was over capacity with 125 people, and the Robinson Suvarnabhumi car park in Lat Krabang was full.",
          "Some shelters in Dusit and Bang Kho Laem are prepared but not open yet. Call before you go.",
          "Numbers change through the night. Check BMA Flood Support for the latest.",
        ],
        th: [
          "BMA Flood Support มีศูนย์พักพิง 198 แห่งใน 34 เขต และจุดจอดรถ 33 แห่ง สถานที่ที่เต็มหรือใกล้เต็ม ณ เวลา 20.47 น. จะมีป้ายระบุไว้",
          "โรงเรียนประชาราษฎร์อุปถัมภ์วิทยา เขตคลองสามวา มีผู้เข้าพัก 125 คน เกินจำนวนที่รองรับ และลานจอดรถโรบินสัน สุวรรณภูมิ เขตลาดกระบัง เต็มแล้ว",
          "ศูนย์พักพิงบางแห่งในเขตดุสิตและบางคอแหลมเตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
          "ตัวเลขเปลี่ยนแปลงตลอดคืน ตรวจสอบข้อมูลล่าสุดได้ที่ BMA Flood Support",
        ],
      },
    },
    {
      at: "2026-09-26T20:35:00+07:00",
      text: {
        en: "Shelter, parking and shuttle bus information has moved to BMA Flood Support, which replaces BKK Care Monitor. It is linked in the shelters section of this page.",
        th: "ข้อมูลศูนย์พักพิง จุดจอดรถ และรถรับส่งประชาชน ย้ายไปอยู่ที่ BMA Flood Support แทน BKK Care Monitor แล้ว ลิงก์อยู่ในหัวข้อศูนย์พักพิงของหน้านี้",
      },
      points: {
        en: [
          "Choose your district and it shows each shelter, car park and shuttle bus point with its status, open, nearly full or full.",
          "The shelter and parking search on this page lists places by district too, and adds sandbag points and parks you can park in.",
        ],
        th: [
          "เลือกเขตแล้วจะเห็นศูนย์พักพิง จุดจอดรถ และจุดรถรับส่งแต่ละแห่ง พร้อมสถานะว่าเปิด ใกล้เต็ม หรือเต็ม",
          "ช่องค้นหาตามเขตในหน้านี้ก็แสดงศูนย์พักพิงและจุดจอดรถแยกตามเขตเช่นกัน พร้อมจุดแจกกระสอบทรายและสวนสาธารณะที่เปิดให้จอดรถ",
        ],
      },
    },
    {
      at: "2026-09-26T19:00:00+07:00",
      text: {
        en: "BMA readings at 18:35 show the rain has almost stopped, but canals are still high and roads in the north and east are still flooded. The governor says the water will take two to three days to drain if no more rain falls.",
        th: "ข้อมูลจากสถานีตรวจวัดของ กทม. เวลา 18.35 น. พบว่าฝนเกือบหยุดตกแล้ว แต่ระดับน้ำในคลองยังสูง และถนนทางเหนือและตะวันออกของเมืองยังมีน้ำท่วมขัง ผู้ว่าราชการกรุงเทพมหานครระบุว่าหากไม่มีฝนตกเพิ่ม จะระบายน้ำได้หมดภายในราว 2 ถึง 3 วัน",
      },
      points: {
        en: [
          "No rain gauge recorded more than 4 mm in the past hour, and the most in the past three hours was 17 mm in Lat Krabang. In the 24 hours to 18:35, 62 of 122 working gauges recorded more than 100 mm, down from 108 at 13:15, peaking at 178.5 mm at Bueng Khwang in Min Buri.",
          "138 of about 300 canal stations were at critical level, down from 148 at 13:15 and 151 at 10:10. Most are in the north and east of the city and in western Thonburi, with the most in Thawi Watthana and Lat Krabang.",
          "Road sensors showed flooding at 18 points. The deepest were Sena Nikhom 1 (66 cm), Ngam Wong Wan at Phong Phet (61 cm), Lat Phrao 122 (57 cm), Ramkhamhaeng 43/1 (55 cm) and New Phetchaburi at Singha Complex (50 cm), much the same as this morning. A further 52 points without a live reading, mostly in the north and east, were reported flooded at about 10 to 20 cm.",
          "Around Tha Prachan 89 to 138 mm fell in 24 hours, but less than 3 mm in the past three hours. The canals in the old town are normal and the road sensors are dry. The river gauge at Pak Khlong Talat is working again and reads 1.96 m, below the 2.30 m warning level. Downstream at Sathon the Chao Phraya is 1.90 m, 0.20 m below the 2.10 m warning level and much higher than at midday, so take care at piers.",
          "The governor said water in the east is falling slowly because more is still flowing in from surrounding areas. The BMA has opened 233 shelters, many in schools, with room for about 15,000 people. By this afternoon 981 people were staying in them, and 36 bedridden patients had been moved to hospital.",
          "BMA schools are closed on Monday 28 September, and BMA staff who do not need to be on site will work from home. The Office of the Civil Service Commission has asked government agencies to consider letting staff work from home on 28 and 29 September.",
          "Thai Meteorological Department warning No. 12, issued at 17:00, says heavy to very heavy rain will continue in Bangkok until 27 September and begin to ease on 28 September.",
        ],
        th: [
          "ในชั่วโมงที่ผ่านมาไม่มีสถานีวัดน้ำฝนใดวัดฝนได้เกิน 4 มม. และในสามชั่วโมงที่ผ่านมา ฝนตกสูงสุด 17 มม. ที่เขตลาดกระบัง ใน 24 ชั่วโมงจนถึงเวลา 18.35 น. สถานีวัดน้ำฝนของ กทม. 62 แห่ง จาก 122 แห่งที่ใช้งานได้ วัดปริมาณฝนได้เกิน 100 มม. ลดลงจาก 108 แห่งเมื่อเวลา 13.15 น. สูงสุด 178.5 มม. ที่ประตูระบายน้ำบึงขวาง เขตมีนบุรี",
          "ระดับน้ำในคลองอยู่ในขั้นวิกฤตที่ 138 สถานี จากสถานีวัดราว 300 สถานี ลดลงจาก 148 สถานีเมื่อเวลา 13.15 น. และ 151 สถานีเมื่อเวลา 10.10 น. ส่วนใหญ่อยู่ทางเหนือและตะวันออกของเมือง และฝั่งธนบุรีด้านตะวันตก โดยเขตทวีวัฒนาและลาดกระบังมีมากที่สุด",
          "สถานีวัดบนถนนพบน้ำท่วมขัง 18 จุด จุดที่ลึกที่สุด ได้แก่ ถนนเสนานิคม 1 (66 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (61 ซม.) ซอยลาดพร้าว 122 (57 ซม.) ซอยรามคำแหง 43/1 (55 ซม.) และถนนเพชรบุรีตัดใหม่หน้าสิงห์คอมเพล็กซ์ (50 ซม.) ใกล้เคียงกับเมื่อเช้า นอกจากนี้ยังมีรายงานน้ำท่วมราว 10 ถึง 20 ซม. อีก 52 จุดที่ไม่มีสถานีวัดแบบเรียลไทม์ ส่วนใหญ่อยู่ทางเหนือและตะวันออก",
          "บริเวณรอบท่าพระจันทร์มีฝนตก 89 ถึง 138 มม. ใน 24 ชั่วโมง แต่ในสามชั่วโมงที่ผ่านมามีฝนไม่ถึง 3 มม. ระดับน้ำในคลองย่านเมืองเก่ายังปกติ และจุดวัดน้ำบนถนนยังไม่มีน้ำขัง สถานีวัดระดับแม่น้ำที่ปากคลองตลาดกลับมาใช้งานได้แล้ว วัดได้ 1.96 ม. ต่ำกว่าระดับเตือนภัย 2.30 ม. ส่วนที่สาทรซึ่งอยู่ท้ายน้ำ ระดับแม่น้ำเจ้าพระยาอยู่ที่ 1.90 ม. ต่ำกว่าระดับเตือนภัย 2.10 ม. อยู่ 0.20 ม. และสูงขึ้นมากจากช่วงเที่ยง โปรดระวังเมื่ออยู่ที่ท่าเรือ",
          "ผู้ว่าฯ ระบุว่าระดับน้ำฝั่งตะวันออกลดลงช้า เพราะยังมีน้ำจากพื้นที่โดยรอบไหลเข้ามาเติม กทม. เปิดศูนย์พักพิง 233 แห่ง หลายแห่งอยู่ในโรงเรียน รองรับได้ราว 15,000 คน เมื่อช่วงบ่ายมีผู้เข้าพักแล้ว 981 คน และเคลื่อนย้ายผู้ป่วยติดเตียง 36 คนไปโรงพยาบาลแล้ว",
          "วันจันทร์ที่ 28 กันยายน โรงเรียนสังกัด กทม. หยุดเรียน และบุคลากร กทม. ที่ไม่จำเป็นต้องปฏิบัติงานในพื้นที่ให้ทำงานที่บ้าน สำนักงาน ก.พ. ขอให้ส่วนราชการพิจารณาให้ข้าราชการทำงานที่บ้านในวันที่ 28 และ 29 กันยายน",
          "ประกาศกรมอุตุนิยมวิทยาฉบับที่ 12 ซึ่งออกเมื่อเวลา 17.00 น. ระบุว่ากรุงเทพฯ จะยังมีฝนตกหนักถึงหนักมากจนถึงวันที่ 27 กันยายน และฝนจะเริ่มลดลงในวันที่ 28 กันยายน",
        ],
      },
    },
    {
      at: "2026-09-26T16:20:00+07:00",
      text: {
        en: "The Thammasat University Student Union, Tha Prachan, has opened a temporary shelter for students affected by the floods.",
        th: "อมธ. ท่าพระจันทร์เปิดศูนย์พักพิงชั่วคราวสำหรับเพื่อนนักศึกษาที่ประสบอุทกภัย",
      },
      points: {
        en: [
          "The shelter is in the Student Activities Building on the Tha Prachan campus, for students who need somewhere to stay.",
          "Register before you go using the link in the Thammasat section of this page.",
          "Contact TUSU Tha Prachan on 095-249-5014 or 094-965-9926, or Instagram TUSU.TPC, at any time. The Student Affairs Division is on 02-222-8871.",
        ],
        th: [
          "ศูนย์พักพิงอยู่ที่ตึกกิจกรรมนักศึกษา มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ สำหรับเพื่อนนักศึกษาที่จำเป็นต้องหาที่พักชั่วคราว",
          "ลงทะเบียนก่อนเข้าพักผ่านลิงก์ในหัวข้อธรรมศาสตร์ของหน้านี้",
          "ติดต่อ อมธ. ท่าพระจันทร์ได้ตลอดเวลาที่ 095-249-5014 หรือ 094-965-9926 หรือ Instagram TUSU.TPC และกองกิจการนักศึกษา โทร 02-222-8871",
        ],
      },
    },
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
          "ประกาศกรมอุตุนิยมวิทยาฉบับที่ 11 ซึ่งออกเมื่อเวลา 11.00 น. ระบุว่ากรุงเทพฯ จะยังมีฝนตกหนักถึงหนักมากในวันที่ 26 และ 27 กันยายน และฝนจะเริ่มลดลงในวันที่ 28 กันยายน",
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
          "ใน 24 ชั่วโมงจนถึงเวลา 13.15 น. สถานีวัดน้ำฝนของ กทม. มากถึง 108 แห่ง จาก 122 แห่งที่ใช้งานได้ วัดปริมาณฝนได้เกิน 100 มม. สูงสุด 211.5 มม. ที่ประตูระบายน้ำบึงขวาง เขตมีนบุรี ในชั่วโมงที่ผ่านมาไม่มีสถานีใดวัดฝนได้เกิน 9 มม. แต่ในสามชั่วโมงที่ผ่านมา เขตหนองจอกยังมีฝนตกสูงสุด 36.5 มม.",
          "ระดับน้ำในคลองอยู่ในขั้นวิกฤตที่ 148 สถานี จากสถานีวัดราว 300 สถานี ส่วนใหญ่อยู่ทางเหนือและตะวันออกของเมือง และฝั่งธนบุรีด้านตะวันตก และตั้งแต่เวลา 10.00 น. สถานีที่ระดับน้ำสูงขึ้นยังมีมากกว่าสถานีที่ระดับน้ำลดลง",
          "สถานีวัดบนถนนพบน้ำท่วมขัง 20 จุด จุดที่ลึกที่สุด ได้แก่ ถนนเสนานิคม 1 (67 ซม.) ซอยลาดพร้าว 122 (58 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (57 ซม.) ถนนเพชรบุรีตัดใหม่หน้าสิงห์คอมเพล็กซ์ (55 ซม.) และซอยรามคำแหง 43/1 (52 ซม.) นอกจากนี้ยังมีรายงานน้ำท่วมราว 10 ถึง 20 ซม. อีก 59 จุดที่ไม่มีสถานีวัดแบบเรียลไทม์ ส่วนใหญ่อยู่ทางเหนือและตะวันออก",
          "บริเวณรอบท่าพระจันทร์มีฝนตก 145 ถึง 178 มม. ใน 24 ชั่วโมง แต่ระดับน้ำในคลองยังปกติ และจุดวัดน้ำบนถนนยังไม่มีน้ำขัง สถานีวัดระดับแม่น้ำที่ปากคลองตลาดขัดข้องชั่วคราว ส่วนที่สาทรซึ่งอยู่ท้ายน้ำ ระดับแม่น้ำเจ้าพระยาอยู่ที่ 0.52 ม. ต่ำกว่าระดับเตือนภัย 2.10 ม. อยู่มาก",
        ],
      },
    },
    {
      at: "2026-09-26T13:10:00+07:00",
      emblem: "thammasat",
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
          "วันที่ 27 กันยายน ปิดห้องสมุดสาขาทุกแห่งที่ศูนย์ท่าพระจันทร์ และหอสมุดป๋วย อึ๊งภากรณ์ กับห้องสมุดประชาชนที่ศูนย์รังสิต วันที่ 28 กันยายน ปิดห้องสมุดสัญญา ธรรมศักดิ์ และห้องสมุดทั้งสองแห่งข้างต้นที่ศูนย์รังสิต",
          "เพิ่มลิงก์ประกาศของมหาวิทยาลัยและของ กทม. ฉบับสแกนไว้ในหน้านี้แล้ว",
        ],
      },
    },
    {
      at: "2026-09-26T12:15:00+07:00",
      text: {
        en: "Sandbag points are now listed on this page, by district.",
        th: "หน้านี้มีรายชื่อจุดรับกระสอบทรายแยกตามเขตแล้ว",
      },
      points: {
        en: [
          "Khan Na Yao, Lat Krabang and Watthana are giving out sandbags. Bring your ID card, up to 20 bags per household.",
          "Din Daeng Road, the Din Daeng underpass and Pracha Songkhro Road at the Bot Mae Phra junction are closed to small cars.",
        ],
        th: [
          "เขตคันนายาว ลาดกระบัง และวัฒนา แจกกระสอบทรายครัวเรือนละไม่เกิน 20 กระสอบ โปรดนำบัตรประจำตัวประชาชนไปติดต่อ",
          "ถนนดินแดง อุโมงค์ดินแดง และถนนประชาสงเคราะห์ช่วงแยกโบสถ์แม่พระ ห้ามรถเล็กผ่าน",
        ],
      },
    },
    {
      at: "2026-09-26T10:45:00+07:00",
      emblem: "garuda",
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
          "แจ้งเหตุหรือขอความช่วยเหลือได้ที่สายด่วน 1555 หรือ Traffy Fondue ทาง LINE หากเจ็บป่วยฉุกเฉินโทร 1669",
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
          "ใน 24 ชั่วโมงจนถึงเวลา 10.15 น. สถานีวัดน้ำฝนของ กทม. มากถึง 111 แห่ง จาก 122 แห่งที่ใช้งานได้ วัดปริมาณฝนได้เกิน 100 มม. สูงสุด 212.5 มม. ที่ประตูระบายน้ำบึงขวาง เขตมีนบุรี ฝั่งตะวันออกมีฝนสะสมเกือบ 300 มม. ตั้งแต่วันพฤหัสบดี และในชั่วโมงที่ผ่านมา เขตสายไหมยังมีฝนตกสูงสุด 15 มม.",
          "บริเวณรอบท่าพระจันทร์มีฝนตก 134 ถึง 161 มม. แต่ระดับน้ำในคลองยังปกติ และจุดวัดน้ำท่วมบนถนนย่านเมืองเก่ายังไม่มีน้ำขัง ระดับน้ำในแม่น้ำเจ้าพระยาที่ปากคลองตลาดอยู่ที่ 1.06 ม. ต่ำกว่าระดับเตือนภัย 2.30 ม. อยู่มาก",
          "กรมอุตุนิยมวิทยาคาดว่าจะมีฝนตกหนักถึงหนักมากต่อเนื่องไปจนถึงวันที่ 27 กันยายน",
        ],
      },
    },
  ],
};
