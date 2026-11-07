import type { Edition } from "@/lib/open-data";
import { money } from "./money";
import { activities } from "./activities";
import { meetings } from "./meetings";
import { people } from "./people";
import { clubs } from "./clubs";
import { about } from "./about";

export const edition2023: Edition = {
  slug: "2023-24",
  label: { en: "2023 to 2024", th: "ปีการศึกษา 2566" },
  published: "2026-11-07",
  lede: {
    en: "A planned budget, a list of 19 projects, 43 sets of meeting minutes and the clubs at Club Day. The biggest gap is money, because no record shows income or what was spent.",
    th: "แผนงบประมาณ รายการ 19 โครงการ รายงานการประชุม 43 ครั้ง และชมรมที่ร่วม Club Day ช่องว่างที่ใหญ่ที่สุดคือเรื่องเงิน เพราะไม่มีบันทึกรายรับหรือรายจ่ายจริง",
  },
  topics: [money, activities, meetings, people, clubs],
  about,
};
