/**
 * Typed model for the Faculty of Political Science "Student Activities"
 * Notice, B.E. 2565 (2022), rendered in a legislation.gov.uk-style layout
 * (Parts → numbered provisions, each with a short summary heading / marginal
 * note, plus an arrangement-of-provisions contents list and deep links).
 *
 * Everything is authored bilingually (en/th) so the page renders in whichever
 * locale the visitor is reading. `en` is a faithful translation of the Thai
 * original — see the per-Part files under this directory.
 */

/** A bilingual string. `th` is the authoritative original; `en` is a translation. */
export type Bi = { en: string; th: string };

/** A numbered sub-item within a provision, e.g. the "(1)", "(2)" clauses. */
export type ProvisionItem = {
  /** The bracketed marker exactly as printed, e.g. "(1)". */
  marker: string;
  text: Bi;
  /** An optional trailing sentence attached to this item (its own line). */
  note?: Bi;
};

/** A defined term (used only by the definitions provision, ข้อ 3). */
export type Definition = { term: Bi; meaning: Bi };

export type Provision = {
  /** The provision (ข้อ) number. */
  num: number;
  /** Very short summary heading — the legislation-style marginal note. */
  title: Bi;
  /** Opening paragraph, if the provision has running text. */
  lead?: Bi;
  /** Defined terms — only the definitions provision uses this. */
  definitions?: Definition[];
  /** Numbered sub-items, if any. */
  items?: ProvisionItem[];
  /** Closing paragraph after the sub-items, if any. */
  tail?: Bi;
};

export type Part = {
  /** The Part (ส่วนที่) number; `null` for the preliminary provisions that
   * sit before Part 1. */
  num: number | null;
  title: Bi;
  provisions: Provision[];
};

export type Regulation = {
  /** Concise page/breadcrumb title. */
  shortTitle: Bi;
  /** Full citation (the name given in ข้อ 1). */
  citation: Bi;
  /** Issuing authority line. */
  authority: Bi;
  /** Legal basis / recital (the "โดยที่…" preamble paragraph). */
  preamble: Bi;
  parts: Part[];
  /** "Made on" date line. */
  made: Bi;
  /** Signatory block. */
  signatory: Bi;
};
