import type { Locale } from "@/lib/i18n";

export type RightNowCopy = {
  heading: string;
  checking: string;
  updatedAt: (time: string) => string;
  pausedAt: (time: string) => string;
  pause: string;
  resume: string;
  shuttle: {
    label: string;
    labelWithFlag: (flag: string) => string;
    leaves: (time: string, minutes: number) => string;
    noMoreToday: string;
    firstToday: (time: string) => string;
    weekend: string;
    holiday: string;
  };
  bus: {
    label: string;
    labelAtStop: (stop: string) => string;
    arrival: (route: string, minutes: number) => string;
    arriving: (route: string) => string;
    unavailable: string;
    stopNames: Record<string, string>;
  };
  conditions: {
    label: string;
    normal: string;
    takeCare: string;
    disruption: string;
    withFeelsLike: (verdict: string, degrees: number) => string;
    unavailable: string;
  };
};

function durationEn(minutes: number): string {
  const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  if (minutes < 60) return unit(minutes, "minute");
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? unit(hours, "hour") : `${unit(hours, "hour")} ${unit(rest, "minute")}`;
}

function durationTh(minutes: number): string {
  if (minutes < 60) return `${minutes} นาที`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} ชั่วโมง` : `${hours} ชั่วโมง ${rest} นาที`;
}

export const rightNowCopy: Record<Locale, RightNowCopy> = {
  en: {
    heading: "Right now",
    checking: "Checking",
    updatedAt: (time) => `Updated ${time}`,
    pausedAt: (time) => `Paused at ${time}`,
    pause: "Pause updates",
    resume: "Resume updates",
    shuttle: {
      label: "Shuttle to MRT Sanam Chai",
      labelWithFlag: (flag) => `Shuttle to MRT Sanam Chai, ${flag.toLowerCase()}`,
      leaves: (time, minutes) => `Leaves ${time}, in ${durationEn(minutes)}`,
      noMoreToday: "No more shuttles today",
      firstToday: (time) => `First shuttle today leaves ${time}`,
      weekend: "No shuttle at weekends. Back on Monday",
      holiday: "No shuttle on public holidays",
    },
    bus: {
      label: "Public bus",
      labelAtStop: (stop) => `Public bus, ${stop}`,
      arrival: (route, minutes) =>
        `Bus ${route} in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`,
      arriving: (route) => `Bus ${route} arriving now`,
      unavailable: "Live bus times unavailable. See the stops.",
      stopNames: {
        "2373": "Sanam Luang",
        "1573": "Thammasat University",
        "1061": "Opposite Tha Phra Chan",
      },
    },
    conditions: {
      label: "Conditions on campus",
      normal: "Fine to go out",
      takeCare: "Take care outside",
      disruption: "Expect disruption",
      withFeelsLike: (verdict, degrees) => `${verdict}, feels like ${degrees}°C`,
      unavailable: "Conditions unavailable. See the details.",
    },
  },
  th: {
    heading: "ตอนนี้",
    checking: "กำลังตรวจสอบ",
    updatedAt: (time) => `อัปเดตเมื่อ ${time} น.`,
    pausedAt: (time) => `หยุดอัปเดตตอน ${time} น.`,
    pause: "หยุดอัปเดตชั่วคราว",
    resume: "อัปเดตต่อ",
    shuttle: {
      label: "รถเวียนไป MRT สนามไชย",
      labelWithFlag: (flag) => `รถเวียนไป MRT สนามไชย ${flag}`,
      leaves: (time, minutes) => `ออก ${time} น. อีก ${durationTh(minutes)}`,
      noMoreToday: "วันนี้หมดรอบรถเวียนแล้ว",
      firstToday: (time) => `รถเวียนเที่ยวแรกของวันนี้ออก ${time} น.`,
      weekend: "เสาร์อาทิตย์ไม่มีรถเวียน กลับมาวิ่งวันจันทร์",
      holiday: "วันหยุดนักขัตฤกษ์ไม่มีรถเวียน",
    },
    bus: {
      label: "รถเมล์",
      labelAtStop: (stop) => `รถเมล์ที่ป้าย${stop}`,
      arrival: (route, minutes) => `สาย ${route} อีก ${minutes} นาที`,
      arriving: (route) => `สาย ${route} กำลังจะถึง`,
      unavailable: "ยังไม่มีเวลารถเมล์แบบสด ดูรายการป้ายรถเมล์",
      stopNames: {
        "2373": "สนามหลวง",
        "1573": "ม.ธรรมศาสตร์",
        "1061": "ตรงข้ามท่าพระจันทร์",
      },
    },
    conditions: {
      label: "สภาพแวดล้อมในมหาวิทยาลัย",
      normal: "ออกไปข้างนอกได้",
      takeCare: "ออกไปข้างนอกควรระวัง",
      disruption: "อาจเดินทางติดขัด",
      withFeelsLike: (verdict, degrees) => `${verdict} ร้อนเหมือน ${degrees}°C`,
      unavailable: "ยังตรวจสภาพแวดล้อมไม่ได้ ดูรายละเอียด",
    },
  },
};
