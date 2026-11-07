import type { Edition } from "@/lib/open-data";
import { money } from "./money";
import { activities } from "./activities";
import { meetings } from "./meetings";
import { people } from "./people";
import { clubs } from "./clubs";
import { about } from "./about";

export const edition2025: Edition = {
  slug: "2025-26",
  label: { en: "2025 to 2026", th: "ปีการศึกษา 2568" },
  published: "2026-11-07",
  lede: {
    en: "What BIRSA planned and spent, what it ran, how often it met and how it was organised during the academic year.",
    th: "BIRSA วางแผนและใช้เงินอย่างไร จัดกิจกรรมอะไร ประชุมบ่อยแค่ไหน และมีโครงสร้างอย่างไรตลอดปีการศึกษา",
  },
  topics: [money, activities, meetings, people, clubs],
  about,
};
