import type { Locale } from "@/lib/i18n";

export type DueSoonCopy = {
  heading: string;
  allDates: string;
  allDatesContext: string;
  empty: string;
  listLabel: string;
  today: string;
  tomorrow: string;
  inDays: (days: number) => string;
  onNow: string;
  range: (start: string, end: string) => string;
  sources: { birsa: string; university: string; birOffice: string };
  closesToday: string;
  closesIn: (days: number) => string;
  actions: { planCourses: string; withdraw: string };
};

export const dueSoonCopy: Record<Locale, DueSoonCopy> = {
  en: {
    heading: "Due soon",
    allDates: "All dates",
    allDatesContext: " for this academic year",
    empty: "Nothing is due in the next 30 days. New dates appear here when they are announced.",
    listLabel: "Upcoming dates",
    today: "today",
    tomorrow: "tomorrow",
    inDays: (days) => (days === 1 ? "in 1 day" : `in ${days} days`),
    onNow: "on now",
    range: (start, end) => `${start} to ${end}`,
    sources: {
      birsa: "BIRSA event",
      university: "University",
      birOffice: "Set by the BIR office",
    },
    closesToday: "Closes today",
    closesIn: (days) => (days === 1 ? "Closes in 1 day" : `Closes in ${days} days`),
    actions: {
      planCourses: "Plan your courses before it opens",
      withdraw: "How to withdraw a course",
    },
  },
  th: {
    heading: "ใกล้ถึงกำหนด",
    allDates: "วันสำคัญทั้งหมด",
    allDatesContext: " ของปีการศึกษานี้",
    empty: "ช่วง 30 วันข้างหน้ายังไม่มีกำหนดการ หากมีประกาศเพิ่มจะขึ้นที่นี่",
    listLabel: "กำหนดการที่กำลังจะมาถึง",
    today: "วันนี้",
    tomorrow: "พรุ่งนี้",
    inDays: (days) => `อีก ${days} วัน`,
    onNow: "อยู่ในช่วงนี้",
    range: (start, end) => `${start} ถึง ${end}`,
    sources: {
      birsa: "กิจกรรมของ BIRSA",
      university: "ประกาศของมหาวิทยาลัย",
      birOffice: "ประกาศของสำนักงานโครงการ BIR",
    },
    closesToday: "หมดเขตวันนี้",
    closesIn: (days) => `เหลืออีก ${days} วัน`,
    actions: {
      planCourses: "วางแผนเลือกวิชาก่อนเปิดลงทะเบียน",
      withdraw: "วิธีถอนรายวิชา",
    },
  },
};
