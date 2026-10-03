import type { ReadingId, Text } from "@/lib/conditions/types";
import {
  CAP_ALERT_TAKE_CARE_COUNT,
  DAM_RELEASE_DISRUPTION_M3S,
  DAM_RELEASE_TAKE_CARE_M3S,
  HEAT_INDEX_DISRUPTION_C,
  HEAT_INDEX_TAKE_CARE_C,
  HEAVY_RAIN_MMH,
  HIGH_TIDE_MIN_M,
  PM25_WHO_GUIDELINE_UGM3,
  PM25_WHO_INTERIM_TARGET_3_UGM3,
  RIVER_KRUNG_THEP_BANK_M,
  RIVER_KRUNG_THEP_DISRUPTION_M,
  RIVER_KRUNG_THEP_TAKE_CARE_M,
  RIVER_PAK_KHLONG_TALAT_DISRUPTION_M,
  RIVER_PAK_KHLONG_TALAT_WALL_M,
  ROAD_FLOOD_DISRUPTION_CM,
  ROAD_FLOOD_TAKE_CARE_CM,
  RUSH_HOUR_RAIN_MMH,
  STORM_DISRUPTION_KM,
  UV_INDEX_TAKE_CARE,
} from "@/content/conditions/rules";

export type ReadingCopy = { label: Text; threshold: Text };

export type ReadingSectionId = "water" | "weather" | "air" | "travel";

export type ReadingSection = {
  id: ReadingSectionId;
  heading: Text;
  readings: ReadingId[];
};

const metres = (value: number) => value.toFixed(2);
const whole = (value: number) => value.toLocaleString("en-GB");

export const readingCopy: Record<ReadingId, ReadingCopy> = {
  riverKrungThep: {
    label: { en: "River at Krung Thep Bridge", th: "แม่น้ำเจ้าพระยาที่สะพานกรุงเทพ" },
    threshold: {
      en: `Take care from ${metres(RIVER_KRUNG_THEP_TAKE_CARE_M)} m, disruption from ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} m. Bank ${metres(RIVER_KRUNG_THEP_BANK_M)} m.`,
      th: `ควรระวังเมื่อถึง ${metres(RIVER_KRUNG_THEP_TAKE_CARE_M)} ม. มีแนวโน้มกระทบเมื่อถึง ${metres(RIVER_KRUNG_THEP_DISRUPTION_M)} ม. ตลิ่งสูง ${metres(RIVER_KRUNG_THEP_BANK_M)} ม.`,
    },
  },
  riverSamsen: {
    label: { en: "River at Samsen", th: "แม่น้ำเจ้าพระยาที่สามเสน" },
    threshold: {
      en: "Shown for information. It does not change a verdict.",
      th: "แสดงไว้เพื่อประกอบการติดตาม ไม่มีผลต่อการประเมิน",
    },
  },
  riverPakKhlongTalat: {
    label: { en: "River at Pak Khlong Talat", th: "แม่น้ำเจ้าพระยาที่ปากคลองตลาด" },
    threshold: {
      en: `Disruption from ${metres(RIVER_PAK_KHLONG_TALAT_DISRUPTION_M)} m. Wall ${metres(RIVER_PAK_KHLONG_TALAT_WALL_M)} m.`,
      th: `มีแนวโน้มกระทบเมื่อถึง ${metres(RIVER_PAK_KHLONG_TALAT_DISRUPTION_M)} ม. กำแพงกั้นน้ำสูง ${metres(RIVER_PAK_KHLONG_TALAT_WALL_M)} ม.`,
    },
  },
  damRelease: {
    label: { en: "Chao Phraya Dam release", th: "การระบายน้ำเขื่อนเจ้าพระยา" },
    threshold: {
      en: `Take care from ${whole(DAM_RELEASE_TAKE_CARE_M3S)} cubic metres a second. Disruption from ${whole(DAM_RELEASE_DISRUPTION_M3S)} when a high tide is due.`,
      th: `ควรระวังเมื่อระบาย ${whole(DAM_RELEASE_TAKE_CARE_M3S)} ลูกบาศก์เมตรต่อวินาที มีแนวโน้มกระทบเมื่อระบาย ${whole(DAM_RELEASE_DISRUPTION_M3S)} และมีน้ำขึ้นสูง`,
    },
  },
  damReleaseForecast: {
    label: {
      en: "Dam release forecast, next 7 days",
      th: "คาดการณ์การระบายน้ำเขื่อน 7 วันข้างหน้า",
    },
    threshold: {
      en: "Shown for information. It does not change a verdict.",
      th: "แสดงไว้เพื่อประกอบการติดตาม ไม่มีผลต่อการประเมิน",
    },
  },
  riverForecastNonthaburi: {
    label: {
      en: "River forecast at Nonthaburi, next 7 days",
      th: "คาดการณ์ระดับน้ำที่นนทบุรี 7 วันข้างหน้า",
    },
    threshold: {
      en: "Shown for information. It does not change a verdict.",
      th: "แสดงไว้เพื่อประกอบการติดตาม ไม่มีผลต่อการประเมิน",
    },
  },
  tide: {
    label: { en: "Next high tide", th: "น้ำขึ้นสูงสุดครั้งถัดไป" },
    threshold: {
      en: `Counts above ${metres(HIGH_TIDE_MIN_M)} m. Take care within 2 hours of it.`,
      th: `นับเฉพาะน้ำขึ้นที่สูงกว่า ${metres(HIGH_TIDE_MIN_M)} ม. ควรระวังในช่วง 2 ชั่วโมงก่อนและหลังเวลาน้ำขึ้นสูงสุด`,
    },
  },
  rainGauge24h: {
    label: { en: "Rain in the last 24 hours", th: "ปริมาณฝนสะสม 24 ชั่วโมงที่ผ่านมา" },
    threshold: {
      en: "Shown for information. It does not change a verdict.",
      th: "แสดงไว้เพื่อประกอบการติดตาม ไม่มีผลต่อการประเมิน",
    },
  },
  roadFlood: {
    label: { en: "Standing water on roads near campus", th: "น้ำขังบนถนนใกล้มหาวิทยาลัย" },
    threshold: {
      en: `Take care from ${ROAD_FLOOD_TAKE_CARE_CM} cm, disruption from ${ROAD_FLOOD_DISRUPTION_CM} cm.`,
      th: `ควรระวังเมื่อน้ำขัง ${ROAD_FLOOD_TAKE_CARE_CM} ซม. มีแนวโน้มกระทบเมื่อ ${ROAD_FLOOD_DISRUPTION_CM} ซม.`,
    },
  },
  urbanFloodWarning: {
    label: { en: "Urban flood warning area", th: "พื้นที่เตือนภัยน้ำท่วมในเมือง" },
    threshold: {
      en: "Disruption when the campus lies inside a warning area.",
      th: "มีแนวโน้มกระทบเมื่อมหาวิทยาลัยอยู่ในพื้นที่เตือนภัย",
    },
  },
  rainForecast: {
    label: { en: "Heaviest rain in the next 3 hours", th: "ฝนตกหนักที่สุดใน 3 ชั่วโมงข้างหน้า" },
    threshold: {
      en: `Take care from ${HEAVY_RAIN_MMH} mm an hour. In rush hours take care from ${RUSH_HOUR_RAIN_MMH} mm an hour.`,
      th: `ควรระวังเมื่อฝนตกตั้งแต่ ${HEAVY_RAIN_MMH} มม. ต่อชั่วโมง ช่วงเร่งด่วนควรระวังตั้งแต่ ${RUSH_HOUR_RAIN_MMH} มม. ต่อชั่วโมง`,
    },
  },
  rainProbability: {
    label: { en: "Chance of rain in the next 3 hours", th: "โอกาสฝนตกใน 3 ชั่วโมงข้างหน้า" },
    threshold: {
      en: "Shown for information. It does not change a verdict.",
      th: "แสดงไว้เพื่อประกอบการติดตาม ไม่มีผลต่อการประเมิน",
    },
  },
  heatIndex: {
    label: { en: "Heat index in the next 12 hours", th: "ดัชนีความร้อนใน 12 ชั่วโมงข้างหน้า" },
    threshold: {
      en: `Take care from ${HEAT_INDEX_TAKE_CARE_C} °C, disruption from ${HEAT_INDEX_DISRUPTION_C} °C.`,
      th: `ควรระวังเมื่อถึง ${HEAT_INDEX_TAKE_CARE_C} °C มีแนวโน้มกระทบเมื่อถึง ${HEAT_INDEX_DISRUPTION_C} °C`,
    },
  },
  uvIndex: {
    label: { en: "UV index today", th: "ดัชนีรังสียูวีวันนี้" },
    threshold: {
      en: `Take care from ${UV_INDEX_TAKE_CARE}.`,
      th: `ควรระวังเมื่อถึง ${UV_INDEX_TAKE_CARE}`,
    },
  },
  tmdWarning: {
    label: {
      en: "Thai Meteorological Department warning",
      th: "ประกาศเตือนของกรมอุตุนิยมวิทยา",
    },
    threshold: {
      en: "Take care when a warning from the past 36 hours names Bangkok.",
      th: "ควรระวังเมื่อมีประกาศภายใน 36 ชั่วโมงที่กล่าวถึงกรุงเทพฯ",
    },
  },
  capAlert: {
    label: { en: "Weather alerts for Bangkok", th: "ประกาศแจ้งเตือนสภาพอากาศสำหรับกรุงเทพฯ" },
    threshold: {
      en: `Take care from ${CAP_ALERT_TAKE_CARE_COUNT} current alert.`,
      th: `ควรระวังเมื่อมีประกาศที่ยังมีผลอยู่อย่างน้อย ${CAP_ALERT_TAKE_CARE_COUNT} ฉบับ`,
    },
  },
  pm25Nearest: {
    label: { en: "PM2.5 dust at Suan Luang Rama 8", th: "ฝุ่น PM2.5 ที่สวนหลวง ร.8" },
    threshold: {
      en: `24 hour average. Take care above ${PM25_WHO_GUIDELINE_UGM3}, disruption above ${PM25_WHO_INTERIM_TARGET_3_UGM3} micrograms per cubic metre.`,
      th: `ค่าเฉลี่ย 24 ชั่วโมง ควรระวังเมื่อเกิน ${PM25_WHO_GUIDELINE_UGM3} มีแนวโน้มกระทบเมื่อเกิน ${PM25_WHO_INTERIM_TARGET_3_UGM3} ไมโครกรัมต่อลูกบาศก์เมตร`,
    },
  },
  pm25Official: {
    label: {
      en: "PM2.5 dust, Pollution Control Department",
      th: "ฝุ่น PM2.5 จากสถานีกรมควบคุมมลพิษ",
    },
    threshold: {
      en: `Used when the nearer station has no reading. Take care above ${PM25_WHO_GUIDELINE_UGM3}, disruption above ${PM25_WHO_INTERIM_TARGET_3_UGM3}.`,
      th: `ใช้เมื่อสถานีที่ใกล้กว่าไม่มีข้อมูล ควรระวังเมื่อเกิน ${PM25_WHO_GUIDELINE_UGM3} มีแนวโน้มกระทบเมื่อเกิน ${PM25_WHO_INTERIM_TARGET_3_UGM3}`,
    },
  },
  pm25Forecast: {
    label: { en: "PM2.5 dust forecast for tomorrow", th: "คาดการณ์ฝุ่น PM2.5 พรุ่งนี้" },
    threshold: {
      en: "Shown for information. It does not change a verdict.",
      th: "แสดงไว้เพื่อประกอบการติดตาม ไม่มีผลต่อการประเมิน",
    },
  },
  roadIncidents: {
    label: { en: "Traffic reports within 3 km", th: "รายงานจราจรในรัศมี 3 กม." },
    threshold: {
      en: "Take care from 1 flood, diversion or closure.",
      th: "ควรระวังเมื่อมีน้ำท่วม ทางเบี่ยง หรือถนนปิดอย่างน้อย 1 จุด",
    },
  },
  roadClosuresNear: {
    label: { en: "Floods and closures within 1 km", th: "น้ำท่วมและถนนปิดในรัศมี 1 กม." },
    threshold: {
      en: "Disruption from 1 flood or closure.",
      th: "มีแนวโน้มกระทบเมื่อมีน้ำท่วมหรือถนนปิดอย่างน้อย 1 จุด",
    },
  },
  earthquake: {
    label: { en: "Earthquakes felt in Bangkok", th: "แผ่นดินไหวที่รู้สึกได้ในกรุงเทพฯ" },
    threshold: {
      en: "Disruption after any earthquake in the past 6 hours that Bangkok would feel.",
      th: "มีแนวโน้มกระทบเมื่อภายใน 6 ชั่วโมงที่ผ่านมามีแผ่นดินไหวที่รับรู้ได้ในกรุงเทพฯ",
    },
  },
  storm: {
    label: {
      en: "Distance to the nearest tropical storm",
      th: "ระยะห่างจากพายุหมุนเขตร้อนที่ใกล้ที่สุด",
    },
    threshold: {
      en: `Disruption within ${STORM_DISRUPTION_KM} km.`,
      th: `มีแนวโน้มกระทบเมื่ออยู่ห่างไม่เกิน ${STORM_DISRUPTION_KM} กม.`,
    },
  },
};

export const readingSections: ReadingSection[] = [
  {
    id: "water",
    heading: { en: "River, tides and flooding", th: "แม่น้ำ น้ำขึ้นน้ำลง และน้ำท่วม" },
    readings: [
      "riverKrungThep",
      "riverPakKhlongTalat",
      "riverSamsen",
      "damRelease",
      "damReleaseForecast",
      "riverForecastNonthaburi",
      "tide",
      "rainGauge24h",
      "roadFlood",
      "urbanFloodWarning",
    ],
  },
  {
    id: "weather",
    heading: { en: "Weather", th: "สภาพอากาศ" },
    readings: ["rainForecast", "rainProbability", "heatIndex", "uvIndex", "tmdWarning", "capAlert"],
  },
  {
    id: "air",
    heading: { en: "Air quality", th: "คุณภาพอากาศ" },
    readings: ["pm25Nearest", "pm25Official", "pm25Forecast"],
  },
  {
    id: "travel",
    heading: { en: "Roads and hazards", th: "ถนนและภัยอันตราย" },
    readings: ["roadIncidents", "roadClosuresNear", "earthquake", "storm"],
  },
];
