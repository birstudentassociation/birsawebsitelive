import type { Edition } from "@/lib/open-data";
import { money } from "./money";
import { activities } from "./activities";
import { feedback } from "./feedback";
import { meetings } from "./meetings";
import { clubs } from "./clubs";
import { about } from "./about";

export const edition2022: Edition = {
  slug: "2022-23",
  label: { en: "2022 to 2023", th: "ปีการศึกษา 2565" },
  published: "2026-11-07",
  lede: {
    en: "This year's records show the planned budget, three events with reports and the scores from four satisfaction surveys. The biggest gap is that no actual spending was recorded.",
    th: "เอกสารของปีนี้แสดงงบประมาณตามแผน สามกิจกรรมที่มีรายงาน และคะแนนจากแบบสอบถามความพึงพอใจสี่ชุด ช่องว่างใหญ่ที่สุดคือไม่มีบันทึกรายจ่ายจริง",
  },
  topics: [money, activities, feedback, meetings, clubs],
  about,
};
