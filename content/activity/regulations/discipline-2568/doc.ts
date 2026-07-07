/**
 * Assembles the University Regulation on Student Discipline, B.E. 2568, from
 * its per-section modules (preliminary, four Chapters, transitional).
 */
import type { RegulationDoc } from "../types";
import { disciplineMeta } from "./meta";
import { preliminary } from "./prelim";
import { chapter1 } from "./chapter1";
import { chapter2 } from "./chapter2";
import { chapter3 } from "./chapter3";
import { chapter4 } from "./chapter4";
import { transitional } from "./transitional";

export const discipline2568: RegulationDoc = {
  slug: "discipline-2568",
  ...disciplineMeta,
  sections: [preliminary, chapter1, chapter2, chapter3, chapter4, transitional],
};
