/**
 * Assembles the University Regulation on Student Activities, B.E. 2563, from
 * its per-section modules (one Title/Chapter group per file). Title 3 is
 * stitched from its two authoring halves (Chapters 1–3 and 4–5).
 */
import type { RegulationDoc, Section } from "../types";
import { uniMeta } from "./meta";
import { preliminary } from "./prelim";
import { title1 } from "./title1";
import { title2 } from "./title2";
import { title3Chapters1to3 } from "./title3a";
import { title3Chapters4to5 } from "./title3b";
import { title4 } from "./title4";
import { title5 } from "./title5";
import { transitional } from "./transitional";

const title3: Section = {
  kind: { en: "Title", th: "ลักษณะ" },
  number: "3",
  title: {
    en: "The Student Organisation of Thammasat University",
    th: "องค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์",
  },
  children: [...title3Chapters1to3, ...title3Chapters4to5],
};

export const university2563: RegulationDoc = {
  slug: "university-2563",
  ...uniMeta,
  sections: [preliminary, title1, title2, title3, title4, title5, transitional],
};
