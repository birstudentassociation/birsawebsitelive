import type { Edition } from "@/lib/open-data";
import { money } from "./money";
import { activities } from "./activities";
import { meetings } from "./meetings";
import { people } from "./people";
import { clubs } from "./clubs";
import { about } from "./about";

export const edition2024: Edition = {
  slug: "2024-25",
  label: { en: "2024 to 2025", th: "ปีการศึกษา 2567" },
  published: "2026-11-07",
  lede: {
    en: "What BIRSA planned to spend and run, how it recruited and how it met during the academic year. The biggest gap is that no actual spending or attendance was recorded.",
    th: "BIRSA วางแผนใช้เงินและจัดกิจกรรมอะไร รับสมาชิกอย่างไร และประชุมกันอย่างไรตลอดปีการศึกษา ช่องว่างใหญ่ที่สุดคือไม่มีบันทึกรายจ่ายจริงหรือจำนวนผู้เข้าร่วม",
  },
  topics: [money, activities, meetings, people, clubs],
  about,
};
