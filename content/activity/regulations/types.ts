/**
 * Typed model for the bilingual "regulations library" under /activity,
 * documents rendered in a legislation.gov.uk-style layout (nested
 * Titles/Chapters/Divisions → numbered provisions, each with a short summary
 * heading / marginal note, an arrangement-of-provisions contents list, and
 * deep links).
 *
 * Two documents use this model:
 *   - the Faculty of Political Science Notice, B.E. 2565 (flat Parts), authored
 *     with the simple Provision shape (`lead`/`items`/`tail`/`definitions`);
 *   - the University Regulation on Student Activities, B.E. 2563 (deeply
 *     nested), authored with the ordered `body` block shape.
 *
 * `en` is a faithful reference translation; the Thai (`th`) is authoritative.
 */

/** A bilingual string. `th` is the authoritative original; `en` is a translation. */
export type Bi = { en: string; th: string };

/** A numbered/lettered sub-item within a provision, e.g. "(1)" or "A.". May nest. */
export type ProvisionItem = {
  /** The marker exactly as rendered, e.g. "(1)", "A.". */
  marker: string;
  text: Bi;
  /** An optional trailing sentence attached to this item (its own line). */
  note?: Bi;
  /** Nested sub-items (e.g. the "(1)(2)…" under an "A. Qualifications" head). */
  children?: ProvisionItem[];
};

/** A defined term (used by definitions provisions). */
export type Definition = { term: Bi; meaning: Bi };

/** An ordered content block inside a provision, lets prose paragraphs and
 * lists interleave in the exact order of the source. */
export type Block =
  | { kind: "para"; text: Bi }
  | { kind: "list"; items: ProvisionItem[] }
  | { kind: "definitions"; entries: Definition[] };

export type Provision = {
  /** The provision (ข้อ) number. */
  num: number;
  /** Very short summary heading, the legislation-style marginal note. */
  title: Bi;

  // --- Simple shape (Faculty Notice) -------------------------------------
  /** Opening paragraph. */
  lead?: Bi;
  /** Defined terms. */
  definitions?: Definition[];
  /** Numbered sub-items. */
  items?: ProvisionItem[];
  /** Closing paragraph after the sub-items. */
  tail?: Bi;

  // --- Ordered shape (University Regulation) -----------------------------
  /** Ordered blocks; when present, the renderer uses these instead of the
   * simple fields above so paragraphs and lists keep their source order. */
  body?: Block[];
};

/** A heading node in the document tree. A node either groups sub-sections
 * (`children`) or holds `provisions` (a leaf); deeply nested documents use
 * both levels (Title → Chapter → Division → provisions). */
export type Section = {
  /** Kind label, e.g. { en: "Chapter", th: "หมวด" }; omit for an unlabelled
   * group such as the preliminary or transitional provisions. */
  kind?: Bi;
  /** Display number as rendered, e.g. "1"; omit if the group has none. */
  number?: string;
  title: Bi;
  children?: Section[];
  provisions?: Provision[];
};

/** Front-matter shared by every document. */
export type RegulationMeta = {
  /** Concise page/breadcrumb/card title. */
  shortTitle: Bi;
  /** Full citation (the name given in the citation provision). */
  citation: Bi;
  /** Issuing authority line. */
  authority: Bi;
  /** Legal basis / recital preamble paragraph. */
  preamble: Bi;
  /** "Made on" date line. */
  made: Bi;
  /** Signatory block. */
  signatory: Bi;
};

export type RegulationDoc = RegulationMeta & {
  /** URL slug under /activity/regulations/<slug>. */
  slug: string;
  sections: Section[];
};

/** Legacy per-Part shape still used by the Faculty Notice's part files. */
export type Part = {
  /** The Part (ส่วนที่) number; `null` for the preliminary provisions. */
  num: number | null;
  title: Bi;
  provisions: Provision[];
};
