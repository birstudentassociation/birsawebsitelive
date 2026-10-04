import type { CardId, Level, Text } from "@/lib/conditions/types";

export const RIVER_KRUNG_THEP_TAKE_CARE_M = 1.7;
export const RIVER_KRUNG_THEP_RISING_M = 1.5;
export const RIVER_KRUNG_THEP_DISRUPTION_M = 1.9;
export const RIVER_KRUNG_THEP_BANK_M = 2.16;
export const RIVER_PAK_KHLONG_TALAT_DISRUPTION_M = 2.2;
export const RIVER_PAK_KHLONG_TALAT_WARNING_M = 2.8;
export const RIVER_PAK_KHLONG_TALAT_WALL_M = 3;
export const DAM_RELEASE_TAKE_CARE_M3S = 2500;
export const HIGH_TIDE_MIN_M = 0.6;
export const HIGH_TIDE_AHEAD_HOURS = 3;

export const HEAVY_RAIN_MMH = 7.6;
export const RUSH_HOUR_RAIN_MMH = 2.5;
export const RAIN_LOOKAHEAD_HOURS = 3;
export const HIGH_TIDE_WINDOW_HOURS = 2;
export const RAIN_FALLEN_HOUR_TAKE_CARE_MM = 20;
export const RAIN_FALLEN_3H_DISRUPTION_MM = 60;
export const ROAD_FLOOD_TAKE_CARE_CM = 5;
export const ROAD_FLOOD_DISRUPTION_CM = 20;
export const CAP_ALERT_TAKE_CARE_COUNT = 1;

export const ROAD_INCIDENTS_TAKE_CARE_COUNT = 1;
export const ROAD_CLOSURES_NEAR_DISRUPTION_COUNT = 1;
export const MORNING_RUSH_HOURS = { from: 7, to: 9 } as const;
export const EVENING_RUSH_HOURS = { from: 16, to: 19 } as const;

export const PM25_THAI_STANDARD_UGM3 = 37.5;
export const PM25_THAI_RED_UGM3 = 75;
export const HEAT_INDEX_TAKE_CARE_C = 42;
export const HEAT_INDEX_DISRUPTION_C = 52;
export const UV_INDEX_VERY_HIGH = 8;
export const STORM_DISRUPTION_KM = 300;

export type RuleId =
  | "R1"
  | "R2"
  | "R3"
  | "R4"
  | "R5"
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "C6"
  | "C7"
  | "C8"
  | "C9"
  | "C10"
  | "C11"
  | "T1"
  | "T2"
  | "T3"
  | "T4"
  | "T5"
  | "T6"
  | "T7"
  | "H1"
  | "H2"
  | "H4"
  | "H5"
  | "H6"
  | "H7";

export type VerdictCopy = { headline: Text; action: Text };

const metres = (value: number) => value.toFixed(2);
const whole = (value: number) => value.toLocaleString("en-GB");

export const cardTitles: Record<CardId, Text> = {
  travel: { en: "Getting to campus", th: "การเดินทางมาท่าพระจันทร์" },
  campus: { en: "On campus", th: "ในมหาวิทยาลัย" },
  riverside: { en: "Riverside and piers", th: "ริมแม่น้ำและท่าเรือ" },
  health: { en: "Your health outdoors", th: "สุขภาพเมื่ออยู่กลางแจ้ง" },
};

export const levelLabels: Record<Level, Text> = {
  normal: { en: "Normal", th: "ปกติ" },
  takeCare: { en: "Take care", th: "ควรระวัง" },
  disruption: { en: "Disruption likely", th: "มีแนวโน้มได้รับผลกระทบ" },
  unknown: { en: "Cannot check right now", th: "ตรวจสอบไม่ได้ในขณะนี้" },
};

const unknownHeadline: Text = {
  en: "We cannot check this right now.",
  th: "ขณะนี้ตรวจสอบข้อมูลส่วนนี้ไม่ได้",
};

export const verdictCopy: Record<CardId, Record<Level, VerdictCopy>> = {
  travel: {
    normal: {
      headline: {
        en: "Nothing we can check is likely to slow your journey.",
        th: "ยังไม่พบสิ่งที่น่าจะทำให้การเดินทางล่าช้า",
      },
      action: {
        en: "Travel as you normally would. Roads, boats and trains can still change, so look at your usual travel app before you set off.",
        th: "เดินทางได้ตามปกติ แต่ถนน เรือ และรถไฟฟ้าอาจเปลี่ยนแปลงได้ ดูแอปเดินทางที่ใช้เป็นประจำก่อนออกจากบ้าน",
      },
    },
    takeCare: {
      headline: {
        en: "Your journey may take longer than usual.",
        th: "การเดินทางอาจใช้เวลานานกว่าปกติ",
      },
      action: {
        en: "Leave extra time. If you come by express boat or the ferry from Wang Lang, check the boat company's Facebook page before you travel.",
        th: "เผื่อเวลาเดินทางเพิ่ม หากมาทางเรือด่วนหรือเรือข้ามฟากจากท่าวังหลัง ให้ดูประกาศในเฟซบุ๊กของเรือก่อนออกเดินทาง",
      },
    },
    disruption: {
      headline: {
        en: "Getting to campus is likely to be disrupted.",
        th: "การเดินทางมาท่าพระจันทร์น่าจะติดขัด",
      },
      action: {
        en: "Check your route before you leave. Boats and the Wang Lang ferry may stop, and Maharat and Phra Chan roads may flood. The university decides on class changes and announces them by email.",
        th: "ตรวจเส้นทางก่อนออกเดินทาง เรือด่วนและเรือข้ามฟากจากท่าวังหลังอาจหยุดวิ่ง ถนนมหาราชและถนนพระจันทร์อาจมีน้ำท่วม มหาวิทยาลัยเป็นผู้ตัดสินใจเรื่องการเรียนการสอนและจะแจ้งทางอีเมล",
      },
    },
    unknown: {
      headline: unknownHeadline,
      action: {
        en: "Check the official sources listed below, and look at your route and the boat company's Facebook page before you travel.",
        th: "ดูแหล่งข้อมูลทางการที่ระบุไว้ด้านล่าง และตรวจเส้นทางกับประกาศในเฟซบุ๊กของเรือด่วนก่อนเดินทาง",
      },
    },
  },
  campus: {
    normal: {
      headline: {
        en: "Heavy rain and flooding are not expected on campus.",
        th: "ยังไม่คาดว่าจะมีฝนตกหนักหรือน้ำท่วมในมหาวิทยาลัย",
      },
      action: {
        en: "Carry on as normal. If it starts to rain heavily, check this page again.",
        th: "ใช้ชีวิตตามปกติได้ หากฝนเริ่มตกหนัก ให้เปิดหน้านี้ดูอีกครั้ง",
      },
    },
    takeCare: {
      headline: {
        en: "Rain, water on the roads or a warning may affect campus.",
        th: "ฝน น้ำขังบนถนน หรือประกาศเตือนภัยอาจกระทบการใช้ชีวิตในมหาวิทยาลัย",
      },
      action: {
        en: "Take an umbrella and watch for water near the Tha Prachan gate and on Maharat Road. Leave extra time to get between buildings.",
        th: "พกร่ม และระวังน้ำขังบริเวณประตูท่าพระจันทร์และถนนมหาราช เผื่อเวลาเดินระหว่างอาคารเพิ่ม",
      },
    },
    disruption: {
      headline: {
        en: "Parts of campus are likely to flood.",
        th: "บางส่วนของมหาวิทยาลัยมีแนวโน้มน้ำท่วม",
      },
      action: {
        en: "Keep away from the riverside, the canteen by the river, the Tha Prachan gate and low ground. Only the university decides on closures, so watch your Thammasat email.",
        th: "หลีกเลี่ยงริมแม่น้ำ โรงอาหารริมน้ำ ประตูท่าพระจันทร์ และที่ต่ำ มหาวิทยาลัยเป็นผู้ตัดสินใจเรื่องการปิดพื้นที่ ติดตามอีเมลธรรมศาสตร์ไว้",
      },
    },
    unknown: {
      headline: unknownHeadline,
      action: {
        en: "Check the official sources listed below, and watch your Thammasat email for any announcement from the university.",
        th: "ดูแหล่งข้อมูลทางการที่ระบุไว้ด้านล่าง และติดตามประกาศของมหาวิทยาลัยทางอีเมลธรรมศาสตร์",
      },
    },
  },
  riverside: {
    normal: {
      headline: {
        en: "The river is below the levels that have reached the campus before.",
        th: "ระดับแม่น้ำยังต่ำกว่าระดับที่เคยท่วมถึงมหาวิทยาลัย",
      },
      action: {
        en: "Nothing special to do. If your trip depends on a boat, check the boat company's Facebook page first.",
        th: "ไม่ต้องทำอะไรเป็นพิเศษ หากต้องใช้เรือ ให้ดูประกาศในเฟซบุ๊กของเรือด่วนก่อน",
      },
    },
    takeCare: {
      headline: {
        en: "The river is high and may reach the riverside walkways.",
        th: "ระดับแม่น้ำสูงและอาจเอ่อขึ้นทางเดินริมน้ำ",
      },
      action: {
        en: "Take care on the piers at Tha Prachan and Tha Chang and along the riverside, most of all around high tide. Boats may run slowly.",
        th: "ระวังเมื่ออยู่บนท่าเรือท่าพระจันทร์ ท่าช้าง และริมแม่น้ำ โดยเฉพาะช่วงน้ำขึ้นสูง เรืออาจวิ่งช้าลง",
      },
    },
    disruption: {
      headline: {
        en: "The river is at a level that has flooded the Tha Prachan riverside before.",
        th: "แม่น้ำอยู่ในระดับที่เคยท่วมริมน้ำท่าพระจันทร์มาแล้ว",
      },
      action: {
        en: "Keep off the piers and the riverside around high tide. The Wang Lang ferry and express boats may stop, so check before you travel.",
        th: "หลีกเลี่ยงท่าเรือและริมแม่น้ำในช่วงน้ำขึ้นสูง เรือข้ามฟากท่าวังหลังและเรือด่วนอาจหยุดวิ่ง ตรวจสอบก่อนออกเดินทาง",
      },
    },
    unknown: {
      headline: unknownHeadline,
      action: {
        en: "Check the official sources listed below before you go near the piers, and look at the boat company's Facebook page.",
        th: "ดูแหล่งข้อมูลทางการที่ระบุไว้ด้านล่างก่อนไปบริเวณท่าเรือ และดูประกาศในเฟซบุ๊กของเรือด่วน",
      },
    },
  },
  health: {
    normal: {
      headline: {
        en: "Air and heat are at levels most people can manage outdoors.",
        th: "คุณภาพอากาศและความร้อนอยู่ในระดับที่คนส่วนใหญ่ทำกิจกรรมกลางแจ้งได้ตามปกติ",
      },
      action: {
        en: "Drink water and keep to the shade around midday. The sun in Bangkok is strong enough to burn on most clear days, so use sunscreen.",
        th: "ดื่มน้ำให้พอ และหลบแดดช่วงเที่ยงวัน แดดในกรุงเทพฯ แรงพอจะทำให้ผิวไหม้ได้ในวันที่ท้องฟ้าโปร่งเกือบทุกวัน ควรทาครีมกันแดด",
      },
    },
    takeCare: {
      headline: {
        en: "Dust, heat or storms may affect you outdoors.",
        th: "ฝุ่น ความร้อน หรือพายุฝนฟ้าคะนองอาจมีผลต่อคุณเมื่ออยู่กลางแจ้ง",
      },
      action: {
        en: "Cut down long or hard activity outdoors. Wear a well fitting mask when the dust is high, drink water often, and go indoors if you hear thunder. Take extra care if you have asthma or a heart condition.",
        th: "ลดกิจกรรมกลางแจ้งที่ใช้เวลานานหรือใช้แรงมาก สวมหน้ากากที่แนบกระชับเมื่อฝุ่นสูง ดื่มน้ำบ่อย ๆ และเข้าอาคารเมื่อได้ยินเสียงฟ้าร้อง ผู้ที่เป็นหอบหืดหรือโรคหัวใจต้องระวังเป็นพิเศษ",
      },
    },
    disruption: {
      headline: {
        en: "Being outdoors may harm your health.",
        th: "การอยู่กลางแจ้งอาจเป็นอันตรายต่อสุขภาพ",
      },
      action: {
        en: "Stay indoors where you can. If you must go out, wear a well fitting N95 or KN95 mask, avoid hard exercise and drink water often. If you feel dizzy, confused or stop sweating, get to shade and call 1669.",
        th: "อยู่ในอาคารถ้าทำได้ หากต้องออกไป ให้สวมหน้ากาก N95 หรือ KN95 ที่แนบกระชับ งดออกกำลังกายหนัก และดื่มน้ำบ่อย ๆ หากเวียนศีรษะ สับสน หรือเหงื่อไม่ออก ให้เข้าที่ร่มและโทร 1669",
      },
    },
    unknown: {
      headline: unknownHeadline,
      action: {
        en: "Check the official sources listed below before you spend a long time outdoors.",
        th: "ดูแหล่งข้อมูลทางการที่ระบุไว้ด้านล่างก่อนอยู่กลางแจ้งเป็นเวลานาน",
      },
    },
  },
};

export const ruleWhy: Record<RuleId, Text> = {
  R1: {
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_TAKE_CARE_M)} m or higher. In 2021, when it peaked between 1.73 m and 2.03 m, the river came over the wall by the riverside canteen.`,
    th: `ระดับน้ำที่สะพานกรุงเทพสูงถึง ${metres(RIVER_KRUNG_THEP_TAKE_CARE_M)} ม. ขึ้นไป ในปี 2564 ซึ่งระดับสูงสุดอยู่ระหว่าง 1.73 ถึง 2.03 ม. น้ำเคยล้นกำแพงข้างโรงอาหารริมน้ำ`,
  },
  R2: {
    en: `The Chao Phraya Dam is releasing ${whole(DAM_RELEASE_TAKE_CARE_M3S)} cubic metres a second or more. The Royal Irrigation Department warns Bangkok at this rate, and the river here rises over the next few days.`,
    th: `เขื่อนเจ้าพระยาระบายน้ำตั้งแต่ ${whole(DAM_RELEASE_TAKE_CARE_M3S)} ลูกบาศก์เมตรต่อวินาทีขึ้นไป กรมชลประทานแจ้งเตือนกรุงเทพฯ ที่อัตรานี้ และระดับแม่น้ำช่วงกรุงเทพฯ จะสูงขึ้นในอีกไม่กี่วัน`,
  },
  R3: {
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_RISING_M)} m or higher and a high tide is due within ${HIGH_TIDE_AHEAD_HOURS} hours. It will rise further.`,
    th: `ระดับน้ำที่สะพานกรุงเทพสูงถึง ${metres(RIVER_KRUNG_THEP_RISING_M)} ม. ขึ้นไปแล้ว และจะมีน้ำขึ้นสูงสุดภายใน ${HIGH_TIDE_AHEAD_HOURS} ชั่วโมง ระดับน้ำจึงจะสูงขึ้นอีก`,
  },
  R4: {
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} m or higher. The river reached this level in 2021, the year it flooded parts of the campus by the riverside canteen. The bank is ${metres(RIVER_KRUNG_THEP_BANK_M)} m.`,
    th: `ระดับน้ำที่สะพานกรุงเทพสูงถึง ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} ม. ขึ้นไป ระดับน้ำเคยขึ้นถึงระดับนี้ในปี 2564 ซึ่งเป็นปีที่น้ำท่วมบางส่วนของมหาวิทยาลัยข้างโรงอาหารริมน้ำ ตลิ่งสูง ${metres(RIVER_KRUNG_THEP_BANK_M)} ม.`,
  },
  R5: {
    en: `The river at Pak Khlong Talat is at ${metres(RIVER_PAK_KHLONG_TALAT_DISRUPTION_M)} m or higher. The river reached this level in 2021, the year it flooded parts of the campus by the riverside canteen.`,
    th: `ระดับน้ำที่ปากคลองตลาดสูงถึง ${metres(RIVER_PAK_KHLONG_TALAT_DISRUPTION_M)} ม. ขึ้นไป ระดับน้ำเคยขึ้นถึงระดับนี้ในปี 2564 ซึ่งเป็นปีที่น้ำท่วมบางส่วนของมหาวิทยาลัยข้างโรงอาหารริมน้ำ`,
  },
  C1: {
    en: `Heavy rain of ${HEAVY_RAIN_MMH} mm or more in an hour is forecast within the next ${RAIN_LOOKAHEAD_HOURS} hours. The forecast averages over a wide area, so the heaviest showers can be much stronger.`,
    th: `คาดว่าจะมีฝนตกหนักตั้งแต่ ${HEAVY_RAIN_MMH} มม. ขึ้นไปในหนึ่งชั่วโมง ภายใน ${RAIN_LOOKAHEAD_HOURS} ชั่วโมงข้างหน้า ค่าพยากรณ์เป็นค่าเฉลี่ยของพื้นที่กว้าง ฝนที่ตกจริงบางจุดจึงอาจหนักกว่านี้มาก`,
  },
  C2: {
    en: `A Bangkok Metropolitan Administration road sensor near campus shows ${ROAD_FLOOD_TAKE_CARE_CM} cm or more of standing water.`,
    th: `เซนเซอร์น้ำท่วมถนนของ กทม. ใกล้มหาวิทยาลัยวัดน้ำขังได้ ${ROAD_FLOOD_TAKE_CARE_CM} ซม. ขึ้นไป`,
  },
  C3: {
    en: "The Thai Meteorological Department has issued a warning that names Bangkok in the past 36 hours.",
    th: "กรมอุตุนิยมวิทยาออกประกาศเตือนที่ระบุถึงกรุงเทพฯ ภายใน 36 ชั่วโมงที่ผ่านมา",
  },
  C4: {
    en: "The Thai Meteorological Department has a current alert that covers Bangkok.",
    th: "กรมอุตุนิยมวิทยามีประกาศแจ้งเตือนที่ยังมีผลและครอบคลุมกรุงเทพฯ",
  },
  C5: {
    en: "Heavy rain is forecast close to a high tide while the river is high. The drains cannot empty into the river, so water backs up on campus.",
    th: "คาดว่าฝนจะตกหนักในช่วงน้ำขึ้นสูงขณะที่แม่น้ำยังสูงอยู่ น้ำในท่อระบายน้ำจึงระบายลงแม่น้ำไม่ทันและอาจเอ่อล้นขึ้นมาในมหาวิทยาลัย",
  },
  C6: {
    en: "The Hydro Informatics Institute shows the campus inside an urban flood warning area.",
    th: "สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) ระบุว่ามหาวิทยาลัยอยู่ในพื้นที่เตือนภัยน้ำท่วมในเมือง",
  },
  C7: {
    en: `A Bangkok Metropolitan Administration road sensor near campus shows ${ROAD_FLOOD_DISRUPTION_CM} cm or more of standing water.`,
    th: `เซนเซอร์น้ำท่วมถนนของ กทม. ใกล้มหาวิทยาลัยวัดน้ำขังได้ ${ROAD_FLOOD_DISRUPTION_CM} ซม. ขึ้นไป`,
  },
  C8: {
    en: `${RAIN_FALLEN_HOUR_TAKE_CARE_MM} mm or more of rain fell in the latest hour at the Memorial Bridge gauge. Water may be pooling on roads and paths.`,
    th: `สถานีวัดฝนสะพานพุทธวัดฝนได้ ${RAIN_FALLEN_HOUR_TAKE_CARE_MM} มม. ขึ้นไปในชั่วโมงล่าสุด อาจมีน้ำขังบนถนนและทางเดิน`,
  },
  C9: {
    en: `${RAIN_FALLEN_3H_DISRUPTION_MM} mm or more of rain fell in the past 3 hours at the Memorial Bridge gauge. Rain like this fills the drains, and roads around campus can stay flooded for hours.`,
    th: `สถานีวัดฝนสะพานพุทธวัดฝนได้ ${RAIN_FALLEN_3H_DISRUPTION_MM} มม. ขึ้นไปใน 3 ชั่วโมงที่ผ่านมา ฝนระดับนี้ทำให้ท่อระบายน้ำเต็ม ถนนรอบมหาวิทยาลัยอาจมีน้ำท่วมขังอยู่หลายชั่วโมง`,
  },
  C10: {
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} m or higher. The river reached this level in 2021, the year it came over the wall by the riverside canteen.`,
    th: `ระดับน้ำที่สะพานกรุงเทพสูงถึง ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} ม. ขึ้นไป ระดับน้ำเคยขึ้นถึงระดับนี้ในปี 2564 ซึ่งเป็นปีที่น้ำล้นกำแพงข้างโรงอาหารริมน้ำ`,
  },
  C11: {
    en: "An earthquake that Bangkok would feel happened in the past 6 hours. Buildings may be closed while they are checked, so follow the university's announcements.",
    th: "ภายใน 6 ชั่วโมงที่ผ่านมามีแผ่นดินไหวที่รับรู้แรงสั่นได้ในกรุงเทพฯ อาคารอาจปิดเพื่อตรวจสอบความปลอดภัย ติดตามประกาศของมหาวิทยาลัย",
  },
  T1: {
    en: "Traffic reports show a flood, diversion or road closure within 3 km of campus.",
    th: "รายงานจราจรแจ้งว่ามีน้ำท่วม ทางเบี่ยง หรือถนนปิดภายในรัศมี 3 กม. จากมหาวิทยาลัย",
  },
  T2: {
    en: `Rain of ${RUSH_HOUR_RAIN_MMH} mm or more in an hour is forecast in a rush hour, from 07:00 to 09:59 or from 16:00 to 19:59. Rain like this slows Bangkok traffic.`,
    th: `คาดว่าฝนจะตกตั้งแต่ ${RUSH_HOUR_RAIN_MMH} มม. ขึ้นไปในหนึ่งชั่วโมง ช่วงเร่งด่วนเช้า (07.00 ถึง 09.59 น.) หรือเย็น (16.00 ถึง 19.59 น.) ฝนระดับนี้ทำให้การจราจรในกรุงเทพฯ ช้าลง`,
  },
  T3: {
    en: "Boats may run slowly or stop while the river is high. Check the boat company before you travel.",
    th: "เรืออาจวิ่งช้าหรือหยุดวิ่งขณะแม่น้ำสูง ตรวจสอบกับบริษัทเรือก่อนเดินทาง",
  },
  T4: {
    en: "Traffic reports show a flood or road closure within 1 km of campus.",
    th: "รายงานจราจรแจ้งว่ามีน้ำท่วมหรือถนนปิดภายในรัศมี 1 กม. จากมหาวิทยาลัย",
  },
  T5: {
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} m or higher. When the river flooded Tha Prachan in 2011, the Wang Lang ferry stopped and Phra Chan Road was closed.`,
    th: `ระดับน้ำที่สะพานกรุงเทพสูงถึง ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} ม. ขึ้นไป เมื่อน้ำท่วมท่าพระจันทร์ในปี 2554 เรือข้ามฟากท่าวังหลังหยุดวิ่ง และถนนพระจันทร์ถูกปิด`,
  },
  T6: {
    en: "An earthquake that Bangkok would feel happened in the past 6 hours. The BTS and MRT stop to check their tracks. After the March 2025 earthquake some lines stayed closed until the next day.",
    th: "ภายใน 6 ชั่วโมงที่ผ่านมามีแผ่นดินไหวที่รับรู้แรงสั่นได้ในกรุงเทพฯ รถไฟฟ้า BTS และ MRT จะหยุดเพื่อตรวจสอบราง หลังแผ่นดินไหวเมื่อมีนาคม 2568 บางสายปิดถึงวันรุ่งขึ้น",
  },
  T7: {
    en: `${RAIN_FALLEN_3H_DISRUPTION_MM} mm or more of rain fell in the past 3 hours at the Memorial Bridge gauge. Maharat Road has flooded after heavy rain before, so roads near campus may be slow or closed.`,
    th: `สถานีวัดฝนสะพานพุทธวัดฝนได้ ${RAIN_FALLEN_3H_DISRUPTION_MM} มม. ขึ้นไปใน 3 ชั่วโมงที่ผ่านมา ถนนมหาราชเคยมีน้ำท่วมขังหลังฝนตกหนัก ถนนใกล้มหาวิทยาลัยจึงอาจติดขัดหรือถูกปิด`,
  },
  H1: {
    en: `The 24 hour average of PM2.5 dust is above ${PM25_THAI_STANDARD_UGM3} micrograms per cubic metre, the Thai standard. The Pollution Control Department rates this orange, when health starts to be affected.`,
    th: `ค่าเฉลี่ย 24 ชั่วโมงของฝุ่น PM2.5 สูงกว่า ${PM25_THAI_STANDARD_UGM3} ไมโครกรัมต่อลูกบาศก์เมตร ซึ่งเกินค่ามาตรฐานของไทย กรมควบคุมมลพิษจัดอยู่ในระดับสีส้ม เริ่มมีผลกระทบต่อสุขภาพ`,
  },
  H2: {
    en: `The heat index is at or forecast to reach ${HEAT_INDEX_TAKE_CARE_C} °C or more in the next 12 hours. The Thai Meteorological Department rates this as dangerous.`,
    th: `ดัชนีความร้อนอยู่ที่หรือคาดว่าจะถึง ${HEAT_INDEX_TAKE_CARE_C} °C ขึ้นไปภายใน 12 ชั่วโมงข้างหน้า กรมอุตุนิยมวิทยาจัดอยู่ในระดับอันตราย`,
  },
  H4: {
    en: `The 24 hour average of PM2.5 dust is above ${PM25_THAI_RED_UGM3} micrograms per cubic metre. The Pollution Control Department rates this red, and Bangkok schools have closed during spells like this.`,
    th: `ค่าเฉลี่ย 24 ชั่วโมงของฝุ่น PM2.5 สูงกว่า ${PM25_THAI_RED_UGM3} ไมโครกรัมต่อลูกบาศก์เมตร กรมควบคุมมลพิษจัดอยู่ในระดับสีแดง มีผลกระทบต่อสุขภาพ และโรงเรียนใน กทม. เคยปิดเรียนในช่วงที่ฝุ่นสูงระดับนี้`,
  },
  H5: {
    en: `The heat index is at or forecast to reach ${HEAT_INDEX_DISRUPTION_C} °C or more. The Thai Meteorological Department rates this as very dangerous, and heat stroke is likely.`,
    th: `ดัชนีความร้อนอยู่ที่หรือคาดว่าจะถึง ${HEAT_INDEX_DISRUPTION_C} °C ขึ้นไป กรมอุตุนิยมวิทยาจัดอยู่ในระดับอันตรายมาก เสี่ยงต่อโรคลมแดด`,
  },
  H6: {
    en: `A tropical storm is within ${STORM_DISRUPTION_KM} km of campus.`,
    th: `มีพายุหมุนเขตร้อนอยู่ห่างจากมหาวิทยาลัยไม่เกิน ${STORM_DISRUPTION_KM} กม.`,
  },
  H7: {
    en: "Thunderstorms are forecast within the next 3 hours. Lightning strikes open ground such as Sanam Luang, the piers and sports fields.",
    th: "คาดว่าจะมีพายุฝนฟ้าคะนองภายใน 3 ชั่วโมงข้างหน้า ฟ้าผ่ามักเกิดในที่โล่ง เช่น สนามหลวง ท่าเรือ และสนามกีฬา",
  },
};
