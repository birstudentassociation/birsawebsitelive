import type { Edition } from "@/lib/open-data";
import { votes } from "./votes";
import { money } from "./money";
import { activities } from "./activities";
import { meetings } from "./meetings";
import { people } from "./people";
import { about } from "./about";

export const edition2021: Edition = {
  slug: "2021-22",
  label: { en: "2021 to 2022", th: "ปีการศึกษา 2564" },
  published: "2026-11-07",
  lede: {
    en: "The records let us show the exam dress referendum in full, the plans for a welfare budget and three projects, and nine meetings. The biggest gap is that BIRSA holds no record of money actually spent.",
    th: "เอกสารของปีนี้แสดงผลประชามติเรื่องการแต่งกายเข้าสอบได้ครบถ้วน แผนงบสวัสดิการและสามโครงการ และการประชุมเก้าครั้ง ช่องว่างที่ใหญ่ที่สุดคือ BIRSA ไม่มีบันทึกรายจ่ายจริง",
  },
  topics: [votes, money, activities, meetings, people],
  about,
};
