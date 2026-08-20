/**
 * The content lifecycle field set (REDESIGN-2.0 §10, §11.3 item 7).
 *
 * FROZEN CONTRACT. Wave 0 owns this file, and §11.7 names the CMS schema
 * conventions as something that must never be parallelised.
 *
 * **Every document type carries these fields, enforced in the schema.** D8 was
 * that 1.0 content has no lifecycle at all: no draft state, no scheduled
 * publication, no last-reviewed date, no owner on anything except Smart
 * Answers. The consequence is not untidiness. A student association turns over
 * every June, and **content with no review date and no named portfolio owner
 * is content nobody will ever dare to delete**, so the site only ever grows.
 *
 * This file is the TypeScript half. The schema half mirrors it, and
 * `docs/CMS-SCHEMA-CONVENTIONS.md` is the prose. The three cannot disagree
 * because the schema is generated against these types.
 */
import type { PortfolioId } from "@/lib/portfolios";

/**
 * `draft` and `published` are native to the CMS. `scheduled` is the scheduling
 * feature, which is one of the two reasons the free plan cannot carry this
 * plan (§6.11). `archived` is ours: it keeps a document out of the site
 * WITHOUT deleting the record, which is what lets an officer retire something
 * they are not certain about.
 */
export const documentStatuses = ["draft", "scheduled", "published", "archived"] as const;

export type DocumentStatus = (typeof documentStatuses)[number];

export type Lifecycle = {
  status: DocumentStatus;
  /** For scheduled publication. Required when `status` is `scheduled`. */
  publishAt: string | null;
  /**
   * The portfolio that owns this document. REQUIRED, on everything.
   *
   * This is the field that prevents D8's failure mode. It is also what makes
   * the review queue and the handover pack generatable, because both are "show
   * me what this portfolio owns" (§7.4).
   */
  owner: PortfolioId;
  /** ISO date. When someone last confirmed this document is still true. */
  lastReviewed: string | null;
  /**
   * ISO date after which the document shows as stale in the Studio and appears
   * on the owning portfolio's dashboard. Not an expiry: nothing unpublishes
   * itself, because a page silently vanishing is worse than a stale one.
   */
  reviewBy: string | null;
  /**
   * Previous slugs, so a rename redirects automatically (§3.4). An officer
   * renaming a page does not have to know that redirects exist, which is the
   * point: once officers can change slugs they will, and no test written in
   * advance can catch a link broken next March.
   */
  slugHistory: string[];
  /**
   * Set ONLY where §3.6's delegation gate failed and BIRSA is keeping content
   * that properly belongs to TUSU, TUSC or the faculty.
   *
   * It names the reason, and `reviewBy` is the trigger to delete the page once
   * an authoritative source appears. Content carrying this field appears in a
   * standing list, so the cull is a POLICY rather than an EVENT, which is the
   * only kind that survives turnover. Acceptance test row 46.
   */
  maintainedBecause: string | null;
};

export type LifecycleProblem = {
  field: keyof Lifecycle;
  message: { en: string; th: string };
};

/**
 * Lifecycle problems that block publication. Pure, so the Studio validation,
 * the nightly integrity check and the tests all run the same rules.
 *
 * Note what is NOT here: bilingual parity. That is enforced at the field level
 * on every localised field rather than once on the document, because an
 * officer needs the error next to the field that is missing, not a document
 * level "something is incomplete" (§6.5 step 3, acceptance row 34).
 */
export function lifecycleProblems(lifecycle: Lifecycle, today: string): LifecycleProblem[] {
  const problems: LifecycleProblem[] = [];

  if (lifecycle.status === "scheduled" && !lifecycle.publishAt) {
    problems.push({
      field: "publishAt",
      message: {
        en: "Choose the date and time this should go live, or set the status back to draft.",
        th: "เลือกวันและเวลาที่ต้องการให้เผยแพร่ หรือเปลี่ยนสถานะกลับเป็นฉบับร่าง",
      },
    });
  }

  if (lifecycle.status === "scheduled" && lifecycle.publishAt && lifecycle.publishAt <= today) {
    problems.push({
      field: "publishAt",
      message: {
        en: "The publication date is in the past. Choose a future date, or publish it now.",
        th: "วันที่เผยแพร่เป็นวันที่ผ่านมาแล้ว โปรดเลือกวันในอนาคต หรือเผยแพร่ทันที",
      },
    });
  }

  if (lifecycle.status === "published" && !lifecycle.reviewBy) {
    // The field that stops the site only ever growing. A document with no
    // review date is one nobody will admit to owning in two years' time.
    problems.push({
      field: "reviewBy",
      message: {
        en: "Set a date to check this is still true. A year is usual; a term is right for anything that changes.",
        th: "กำหนดวันที่จะกลับมาตรวจสอบว่าข้อมูลนี้ยังถูกต้อง โดยทั่วไปใช้หนึ่งปี หากเป็นเรื่องที่เปลี่ยนบ่อยให้ใช้หนึ่งภาคการศึกษา",
      },
    });
  }

  if (lifecycle.maintainedBecause !== null && !lifecycle.reviewBy) {
    problems.push({
      field: "reviewBy",
      message: {
        en: "This page is kept because no one else publishes it. Set a review date, so BIRSA finds out when someone does.",
        th: "หน้านี้คงไว้เพราะยังไม่มีหน่วยงานอื่นเผยแพร่ โปรดกำหนดวันตรวจสอบ เพื่อให้ BIRSA ทราบเมื่อมีผู้เผยแพร่แล้ว",
      },
    });
  }

  return problems;
}

/** Documents whose review date has passed. Drives the portfolio dashboard. */
export function isStale(lifecycle: Lifecycle, today: string): boolean {
  return lifecycle.reviewBy !== null && lifecycle.reviewBy < today;
}

/**
 * The document types requiring a SECOND approver before publication (§6.5
 * step 4, §7.3).
 *
 * Deliberately short. A review process that covers everything is a review
 * process that gets clicked through, so everything else is trusted to the
 * portfolio that owns it. The second approver is a ROLE rather than a person,
 * and any two of the three site administrators satisfy it.
 */
export const requiresSecondApprover = [
  // An error sends a student to the wrong graduation.
  "curriculum",
  // A legal claim the code has to honour.
  "privacy-register",
  "regulation",
  // Published commitments BIRSA is held to.
  "minutes",
  "decision",
  "budget",
  "commitment",
  // §3.3: an officer cannot publish a menu item that 404s, and a broken nav
  // breaks every page at once rather than one.
  "navigation",
] as const;

export type SecondApproverType = (typeof requiresSecondApprover)[number];

export function needsSecondApprover(documentType: string): boolean {
  return (requiresSecondApprover as readonly string[]).includes(documentType);
}
