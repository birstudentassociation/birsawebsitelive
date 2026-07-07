/**
 * The regulations library: every document rendered under
 * /activity/regulations/<slug>. The University Regulation (B.E. 2563) is the
 * parent instrument; the Faculty Notice (B.E. 2565) was issued under it.
 *
 * The Faculty Notice keeps its original flat `Part[]` authoring; a small
 * adapter maps each Part onto the shared nested `Section` shape so both
 * documents render through the same view.
 */
import type { RegulationDoc, Section, Part } from "./types";
import { meta as facultyMeta } from "./meta";
import { preliminary as facultyPreliminary } from "./preliminary";
import { part01 } from "./part01";
import { part02 } from "./part02";
import { part03 } from "./part03";
import { part04 } from "./part04";
import { part05 } from "./part05";
import { part06 } from "./part06";
import { part07 } from "./part07";
import { part08 } from "./part08";
import { part09 } from "./part09";
import { part10 } from "./part10";
import { part11 } from "./part11";
import { part12 } from "./part12";
import { university2563 } from "./university-2563/doc";

/** A Faculty Part is a flat leaf section; the preliminary Part (num null) is
 * an unlabelled group, the rest are "Part N". */
function partToSection(part: Part): Section {
  return {
    kind: part.num === null ? undefined : { en: "Part", th: "ส่วนที่" },
    number: part.num === null ? undefined : String(part.num),
    title: part.title,
    provisions: part.provisions,
  };
}

const politicalScience2565: RegulationDoc = {
  slug: "political-science-2565",
  ...facultyMeta,
  sections: [
    facultyPreliminary,
    part01,
    part02,
    part03,
    part04,
    part05,
    part06,
    part07,
    part08,
    part09,
    part10,
    part11,
    part12,
  ].map(partToSection),
};

/** Ordered newest-authority-first: the University Regulation, then the
 * Faculty Notice issued under it. */
export const documents: RegulationDoc[] = [university2563, politicalScience2565];

export function getDocument(slug: string): RegulationDoc | undefined {
  return documents.find((doc) => doc.slug === slug);
}
