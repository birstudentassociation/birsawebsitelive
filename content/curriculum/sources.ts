/**
 * The faculty documents this service's curriculum data was read from,
 * crawled on 2026-08-01. Every fact in `content/curriculum/*` cites one of
 * these by id, so a maintainer can always get back to the page it came from.
 * The narrative record, including what each document contradicts, is in
 * `docs/curriculum-sources.md`.
 */
export type SourceDocument = {
  id: string;
  title: string;
  /**
   * Empty when the evidence was supplied directly (e.g. as images handed to
   * BIRSA) rather than published at a URL; `note` then explains how it was
   * supplied. Every document must have either a url or a note, never neither.
   */
  url: string;
  /** How the document was supplied, required when `url` is empty. */
  note?: string;
  /** ISO date the document was fetched. */
  retrieved: string;
};

export const SOURCES = {
  sampleStudyPlan: {
    id: "sampleStudyPlan",
    title: "Sample Study Plan (Curri. 2561)",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Sample_Study_Plan.pdf",
    retrieved: "2026-08-01",
  },
  outline2018: {
    id: "outline2018",
    title: "Outline, BIR Curriculum 2018",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Outline_BIR_Curr_2018.pdf",
    retrieved: "2026-08-01",
  },
  courseDescriptions2018: {
    id: "courseDescriptions2018",
    title: "BIR Curriculum 2018 Course Descriptions",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_Curr2018_CourseDescription.pdf",
    retrieved: "2026-08-01",
  },
  mko2561: {
    id: "mko2561",
    title: "BIR มคอ.2 2561",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_%E0%B8%A1%E0%B8%84%E0%B8%AD_2561.pdf?v=202012190947",
    retrieved: "2026-08-01",
  },
  bir64: {
    id: "bir64",
    title: "BIR Academic Handout, Curriculum 2021 (B.E. 2564), รหัส 64, 65",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64.pdf?v=202305101549",
    retrieved: "2026-08-01",
  },
  bir64rev66: {
    id: "bir64rev66",
    title: "BIR Academic Handout, Curriculum 2021 (B.E. 2564) Revision 2023, รหัส 66",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64_rev66.pdf?v=202305101549",
    retrieved: "2026-08-01",
  },
  handbook2021: {
    id: "handbook2021",
    title: "BIR Student Handbook, Revision 2021, Online Edition",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Handbook2021_OnlineEdition_1.pdf?v=202012190947",
    retrieved: "2026-08-01",
  },
  doubleDegree64: {
    id: "doubleDegree64",
    title: "BIR Double Degree, curriculum revision B.E. 2564",
    url: "https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_DoubleDegree_64.pdf?v=202012190947",
    retrieved: "2026-08-01",
  },
  comparison2568: {
    id: "comparison2568",
    title: "Curriculum comparison, B.E. 2564 against B.E. 2568",
    url: "https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/68_2025.pdf?v=202405291424",
    retrieved: "2026-08-01",
  },
  classSchedule2568Year1: {
    id: "classSchedule2568Year1",
    title:
      "BIR Class Schedule Semester 1/2025 and registration record Semester 2/2568, first year",
    url: "",
    note: "Supplied directly by BIRSA as images, not published at a URL.",
    retrieved: "2026-08-02",
  },
} as const satisfies Record<string, SourceDocument>;

export type SourceId = keyof typeof SOURCES;
