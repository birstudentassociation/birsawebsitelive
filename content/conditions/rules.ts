import type { CardId, Level, Text } from "@/lib/conditions/types";

export const RIVER_KRUNG_THEP_TAKE_CARE_M = 1.5;
export const RIVER_KRUNG_THEP_DISRUPTION_M = 1.9;
export const RIVER_KRUNG_THEP_BANK_M = 2.16;
export const RIVER_PAK_KHLONG_TALAT_DISRUPTION_M = 2.8;
export const RIVER_PAK_KHLONG_TALAT_WALL_M = 3;
export const DAM_RELEASE_TAKE_CARE_M3S = 1800;
export const DAM_RELEASE_DISRUPTION_M3S = 2400;
export const HIGH_TIDE_MIN_M = 0.6;
export const HIGH_TIDE_WINDOW_HOURS = 2;
export const TIDE_LOOKAHEAD_HOURS = 24;

export const HEAVY_RAIN_MMH = 20;
export const RUSH_HOUR_RAIN_MMH = 10;
export const RAIN_LOOKAHEAD_HOURS = 3;
export const ROAD_FLOOD_TAKE_CARE_CM = 5;
export const ROAD_FLOOD_DISRUPTION_CM = 20;
export const CAP_ALERT_TAKE_CARE_COUNT = 1;

export const ROAD_INCIDENTS_TAKE_CARE_COUNT = 1;
export const ROAD_CLOSURES_NEAR_DISRUPTION_COUNT = 1;
export const MORNING_RUSH_HOURS = { from: 7, to: 9 } as const;
export const EVENING_RUSH_HOURS = { from: 16, to: 19 } as const;

export const PM25_WHO_GUIDELINE_UGM3 = 15;
export const PM25_WHO_INTERIM_TARGET_3_UGM3 = 37.5;
export const HEAT_INDEX_TAKE_CARE_C = 41;
export const HEAT_INDEX_DISRUPTION_C = 54;
export const UV_INDEX_TAKE_CARE = 8;
export const STORM_DISRUPTION_KM = 300;

export type RuleId =
  | "R1"
  | "R2"
  | "R3"
  | "R4"
  | "R5"
  | "R6"
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "C6"
  | "C7"
  | "T1"
  | "T2"
  | "T3"
  | "T4"
  | "T5"
  | "T6"
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5"
  | "H6";

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
  disruption: { en: "Disruption likely", th: "อาจกระทบการเดินทาง" },
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
        en: "Leave extra time. If you plan to use a boat, check the boat company's Facebook page before you travel.",
        th: "เผื่อเวลาเดินทางเพิ่ม หากจะใช้เรือ ให้ดูประกาศในเฟซบุ๊กของเรือด่วนก่อนออกเดินทาง",
      },
    },
    disruption: {
      headline: {
        en: "Getting to campus is likely to be disrupted.",
        th: "การเดินทางมาท่าพระจันทร์น่าจะติดขัด",
      },
      action: {
        en: "Check your route and the boat company's Facebook page before you leave. The university decides on class changes and announces them by email.",
        th: "ตรวจเส้นทางและดูประกาศในเฟซบุ๊กของเรือด่วนก่อนออกเดินทาง มหาวิทยาลัยเป็นผู้ตัดสินใจเรื่องการเรียนการสอนและจะแจ้งทางอีเมล",
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
        en: "Rain or water on the roads may affect campus.",
        th: "ฝนหรือน้ำบนถนนอาจกระทบการใช้ชีวิตในมหาวิทยาลัย",
      },
      action: {
        en: "Take an umbrella and watch for water near the Tha Prachan gate. Leave extra time to get between buildings.",
        th: "พกร่ม และระวังน้ำขังบริเวณประตูท่าพระจันทร์ เผื่อเวลาเดินระหว่างอาคารเพิ่ม",
      },
    },
    disruption: {
      headline: {
        en: "Water is likely to back up from the drains on campus.",
        th: "น้ำจากท่อระบายน้ำน่าจะเอ่อล้นในมหาวิทยาลัย",
      },
      action: {
        en: "Keep away from the Tha Prachan gate and low ground. Only the university decides on closures, so watch your Thammasat email.",
        th: "หลีกเลี่ยงบริเวณประตูท่าพระจันทร์และที่ต่ำ มหาวิทยาลัยเป็นผู้ตัดสินใจเรื่องการปิดพื้นที่ ติดตามอีเมลธรรมศาสตร์ไว้",
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
        en: "The river is well below the top of the bank.",
        th: "แม่น้ำยังต่ำกว่าตลิ่งอยู่มาก",
      },
      action: {
        en: "Nothing special to do. If your trip depends on a boat, check the boat company's Facebook page first.",
        th: "ไม่ต้องทำอะไรเป็นพิเศษ หากต้องใช้เรือ ให้ดูประกาศในเฟซบุ๊กของเรือด่วนก่อน",
      },
    },
    takeCare: {
      headline: {
        en: "The river is higher than usual.",
        th: "ระดับแม่น้ำสูงกว่าปกติ",
      },
      action: {
        en: "Take care on the piers at Tha Prachan and Tha Chang. Boats may run slowly, so check the boat company's Facebook page before you travel.",
        th: "ระวังเมื่ออยู่บนท่าเรือท่าพระจันทร์และท่าช้าง เรืออาจวิ่งช้าลง ดูประกาศในเฟซบุ๊กของเรือด่วนก่อนเดินทาง",
      },
    },
    disruption: {
      headline: {
        en: "The river is close to the top of the bank.",
        th: "แม่น้ำเกือบเสมอตลิ่ง",
      },
      action: {
        en: "Keep off the piers at Tha Prachan and Tha Chang, and check the boat company's Facebook page before you travel.",
        th: "หลีกเลี่ยงท่าเรือท่าพระจันทร์และท่าช้าง และดูประกาศในเฟซบุ๊กของเรือด่วนก่อนออกเดินทาง",
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
        th: "คุณภาพอากาศและอุณหภูมิอยู่ในระดับที่คนส่วนใหญ่อยู่กลางแจ้งได้",
      },
      action: {
        en: "Drink water and take shade in the middle of the day as usual.",
        th: "ดื่มน้ำให้พอ และหลบแดดช่วงเที่ยงวันตามปกติ",
      },
    },
    takeCare: {
      headline: {
        en: "The air, heat or sun may affect your health outdoors.",
        th: "ฝุ่น ความร้อน หรือแดดอาจมีผลต่อสุขภาพเมื่ออยู่กลางแจ้ง",
      },
      action: {
        en: "If you have asthma or a heart condition, limit your time outdoors and wear a well fitting mask. Drink water and keep out of the midday sun.",
        th: "ผู้ที่เป็นหอบหืดหรือโรคหัวใจควรลดเวลาอยู่กลางแจ้งและสวมหน้ากากที่แนบกระชับ ดื่มน้ำให้พอ และหลบแดดช่วงเที่ยงวัน",
      },
    },
    disruption: {
      headline: {
        en: "Being outdoors may harm your health.",
        th: "การอยู่กลางแจ้งอาจเป็นอันตรายต่อสุขภาพ",
      },
      action: {
        en: "Stay indoors where you can. If you must go out, wear a well fitting N95 or KN95 mask and avoid hard exercise. People with asthma or heart conditions should take extra care.",
        th: "อยู่ในอาคารถ้าทำได้ หากต้องออกไป ให้สวมหน้ากาก N95 หรือ KN95 ที่แนบกระชับและงดออกกำลังกายหนัก ผู้ที่เป็นหอบหืดหรือโรคหัวใจต้องระวังเป็นพิเศษ",
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
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_TAKE_CARE_M)} m or higher, so water is rising towards the piers.`,
    th: `ระดับน้ำที่สะพานกรุงเทพตั้งแต่ ${metres(RIVER_KRUNG_THEP_TAKE_CARE_M)} ม. ขึ้นไป น้ำกำลังสูงขึ้นใกล้ท่าเรือ`,
  },
  R2: {
    en: `The Chao Phraya Dam is releasing ${whole(DAM_RELEASE_TAKE_CARE_M3S)} cubic metres a second or more, so the river runs higher downstream.`,
    th: `เขื่อนเจ้าพระยาระบายน้ำตั้งแต่ ${whole(DAM_RELEASE_TAKE_CARE_M3S)} ลูกบาศก์เมตรต่อวินาทีขึ้นไป แม่น้ำช่วงท้ายเขื่อนจึงสูงกว่าปกติ`,
  },
  R3: {
    en: `It is within ${HIGH_TIDE_WINDOW_HOURS} hours of a predicted high tide above ${metres(HIGH_TIDE_MIN_M)} m, when the river at the piers is at its highest.`,
    th: `ขณะนี้อยู่ในช่วง ${HIGH_TIDE_WINDOW_HOURS} ชั่วโมงก่อนหรือหลังน้ำขึ้นสูงที่คาดว่าเกิน ${metres(HIGH_TIDE_MIN_M)} ม. ซึ่งเป็นช่วงที่น้ำหน้าท่าเรือสูงที่สุด`,
  },
  R4: {
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} m or higher. The bank is ${metres(RIVER_KRUNG_THEP_BANK_M)} m.`,
    th: `ระดับน้ำที่สะพานกรุงเทพตั้งแต่ ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} ม. ขึ้นไป ขณะที่ตลิ่งสูง ${metres(RIVER_KRUNG_THEP_BANK_M)} ม.`,
  },
  R5: {
    en: `The river at Pak Khlong Talat is at ${metres(RIVER_PAK_KHLONG_TALAT_DISRUPTION_M)} m or higher, the Bangkok Metropolitan Administration warning level.`,
    th: `ระดับน้ำที่ปากคลองตลาดตั้งแต่ ${metres(RIVER_PAK_KHLONG_TALAT_DISRUPTION_M)} ม. ขึ้นไป ซึ่งเป็นระดับเฝ้าระวังของ กทม.`,
  },
  R6: {
    en: `The dam releases ${whole(DAM_RELEASE_DISRUPTION_M3S)} cubic metres a second or more and a high tide above ${metres(HIGH_TIDE_MIN_M)} m is due within ${TIDE_LOOKAHEAD_HOURS} hours. Together they can push the river over the piers.`,
    th: `เขื่อนระบายน้ำตั้งแต่ ${whole(DAM_RELEASE_DISRUPTION_M3S)} ลูกบาศก์เมตรต่อวินาทีขึ้นไป และจะมีน้ำขึ้นสูงเกิน ${metres(HIGH_TIDE_MIN_M)} ม. ภายใน ${TIDE_LOOKAHEAD_HOURS} ชั่วโมง สองอย่างนี้รวมกันอาจดันน้ำท่วมท่าเรือ`,
  },
  C1: {
    en: `Rain of ${HEAVY_RAIN_MMH} mm or more in an hour is forecast within the next ${RAIN_LOOKAHEAD_HOURS} hours.`,
    th: `คาดว่าจะมีฝนตกตั้งแต่ ${HEAVY_RAIN_MMH} มม. ขึ้นไปในหนึ่งชั่วโมง ภายใน ${RAIN_LOOKAHEAD_HOURS} ชั่วโมงข้างหน้า`,
  },
  C2: {
    en: `A Bangkok Metropolitan Administration road sensor near campus shows ${ROAD_FLOOD_TAKE_CARE_CM} cm or more of standing water.`,
    th: `เซ็นเซอร์น้ำท่วมถนนของ กทม. ใกล้มหาวิทยาลัยวัดน้ำขังได้ ${ROAD_FLOOD_TAKE_CARE_CM} ซม. ขึ้นไป`,
  },
  C3: {
    en: "The Thai Meteorological Department has issued a warning that names Bangkok in the past 36 hours.",
    th: "กรมอุตุนิยมวิทยาประกาศเตือนที่กล่าวถึงกรุงเทพฯ ภายใน 36 ชั่วโมงที่ผ่านมา",
  },
  C4: {
    en: "The Thai Meteorological Department has a current alert that covers Bangkok.",
    th: "กรมอุตุนิยมวิทยามีประกาศแจ้งเตือนที่ยังมีผลและครอบคลุมกรุงเทพฯ",
  },
  C5: {
    en: "Heavy rain is forecast close to a high tide while the river is high. The drains cannot empty into the river, so water backs up on campus.",
    th: "คาดว่าฝนจะตกหนักใกล้ช่วงน้ำขึ้นสูงขณะที่แม่น้ำสูงอยู่ ท่อระบายน้ำระบายลงแม่น้ำไม่ได้ น้ำจึงเอ่อล้นขึ้นมาในมหาวิทยาลัย",
  },
  C6: {
    en: "The Hydro Informatics Institute shows the campus inside an urban flood warning area.",
    th: "สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) แสดงว่ามหาวิทยาลัยอยู่ในพื้นที่เตือนภัยน้ำท่วมในเมือง",
  },
  C7: {
    en: `A Bangkok Metropolitan Administration road sensor near campus shows ${ROAD_FLOOD_DISRUPTION_CM} cm or more of standing water.`,
    th: `เซ็นเซอร์น้ำท่วมถนนของ กทม. ใกล้มหาวิทยาลัยวัดน้ำขังได้ ${ROAD_FLOOD_DISRUPTION_CM} ซม. ขึ้นไป`,
  },
  T1: {
    en: "Traffic reports show a flood, diversion or road closure within 3 km of campus.",
    th: "รายงานจราจรแจ้งว่ามีน้ำท่วม ทางเบี่ยง หรือถนนปิดภายในรัศมี 3 กม. จากมหาวิทยาลัย",
  },
  T2: {
    en: `Rain of ${RUSH_HOUR_RAIN_MMH} mm or more in an hour is forecast in a rush hour, from 07:00 to 09:59 or from 16:00 to 19:59.`,
    th: `คาดว่าฝนจะตกตั้งแต่ ${RUSH_HOUR_RAIN_MMH} มม. ขึ้นไปในหนึ่งชั่วโมง ช่วงเร่งด่วนเช้า (07.00 ถึง 09.59 น.) หรือเย็น (16.00 ถึง 19.59 น.)`,
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
    en: `The river at Krung Thep Bridge is at ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} m or higher, so boats may stop.`,
    th: `ระดับน้ำที่สะพานกรุงเทพตั้งแต่ ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} ม. ขึ้นไป เรืออาจหยุดวิ่ง`,
  },
  T6: {
    en: "An earthquake that Bangkok would feel happened in the past 6 hours. The MRT and BTS stop to check their tracks.",
    th: "เกิดแผ่นดินไหวที่กรุงเทพฯ รู้สึกได้ภายใน 6 ชั่วโมงที่ผ่านมา MRT และ BTS จะหยุดวิ่งเพื่อตรวจสอบราง",
  },
  H1: {
    en: `The 24 hour average of PM2.5 dust is above ${PM25_WHO_GUIDELINE_UGM3} micrograms per cubic metre, the World Health Organization guideline.`,
    th: `ค่าเฉลี่ย 24 ชั่วโมงของฝุ่น PM2.5 สูงกว่า ${PM25_WHO_GUIDELINE_UGM3} ไมโครกรัมต่อลูกบาศก์เมตร ซึ่งเป็นค่าแนะนำขององค์การอนามัยโลก`,
  },
  H2: {
    en: `The heat index is forecast to reach ${HEAT_INDEX_TAKE_CARE_C} °C or more in the next 12 hours. It will feel much hotter than the air.`,
    th: `คาดว่าดัชนีความร้อนจะถึง ${HEAT_INDEX_TAKE_CARE_C} °C ขึ้นไปภายใน 12 ชั่วโมงข้างหน้า ทำให้รู้สึกร้อนกว่าอุณหภูมิจริงมาก`,
  },
  H3: {
    en: `The UV index today is forecast at ${UV_INDEX_TAKE_CARE} or more, which is very high.`,
    th: `คาดว่าดัชนีรังสียูวีวันนี้จะอยู่ที่ ${UV_INDEX_TAKE_CARE} ขึ้นไป ซึ่งสูงมาก`,
  },
  H4: {
    en: `The 24 hour average of PM2.5 dust is above ${PM25_WHO_INTERIM_TARGET_3_UGM3} micrograms per cubic metre, the World Health Organization interim target 3.`,
    th: `ค่าเฉลี่ย 24 ชั่วโมงของฝุ่น PM2.5 สูงกว่า ${PM25_WHO_INTERIM_TARGET_3_UGM3} ไมโครกรัมต่อลูกบาศก์เมตร ซึ่งเกินเป้าหมายระหว่างทางที่ 3 ขององค์การอนามัยโลก`,
  },
  H5: {
    en: `The heat index is forecast to reach ${HEAT_INDEX_DISRUPTION_C} °C or more, a level where heat stroke is likely.`,
    th: `คาดว่าดัชนีความร้อนจะถึง ${HEAT_INDEX_DISRUPTION_C} °C ขึ้นไป ซึ่งเสี่ยงต่อโรคลมแดดมาก`,
  },
  H6: {
    en: `A tropical storm is within ${STORM_DISRUPTION_KM} km of campus.`,
    th: `มีพายุหมุนเขตร้อนอยู่ห่างจากมหาวิทยาลัยไม่เกิน ${STORM_DISRUPTION_KM} กม.`,
  },
};
