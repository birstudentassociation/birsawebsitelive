/**
 * The lifecycle field set every document type carries (REDESIGN-2.0 §10,
 * §6.5, `docs/CMS-SCHEMA-CONVENTIONS.md` #2).
 *
 * This object mirrors `lib/content/lifecycle.ts`'s `Lifecycle` type field
 * for field, and its validation calls that file's `lifecycleProblems`
 * directly rather than re-deriving the rules. `docs/CMS-SCHEMA-CONVENTIONS.md`
 * #4 is explicit that a validator has exactly one implementation, shared by
 * the Studio, the build check and the tests, "so the three cannot
 * disagree". Duplicating the rule here in Sanity's validation DSL would be
 * a second implementation and therefore a second, driftable rule.
 *
 * `owner` is required on every document (`lib/content/lifecycle.ts`): it is
 * what makes the review queue and the handover pack generatable, both
 * being "show me what this portfolio owns" (§7.4).
 *
 * `reviewBy` is what stops a page going stale silently (§3.6, §10): a
 * document with no review date is a document nobody will admit to owning
 * in two years. Publishing with `status: "published"` and no `reviewBy`
 * is blocked, not warned, because a warning is advice an officer can click
 * past at 2am before an event.
 */
import { defineField, defineType } from "sanity";
import type { CustomValidator } from "sanity";

import { lifecycleProblems, documentStatuses, type Lifecycle } from "@/lib/content/lifecycle";
import { portfolios, type PortfolioId } from "@/lib/portfolios";

const STATUS_TITLES: Record<(typeof documentStatuses)[number], string> = {
  draft: "ฉบับร่าง / Draft",
  scheduled: "ตั้งเวลาเผยแพร่ / Scheduled",
  published: "เผยแพร่แล้ว / Published",
  archived: "เก็บถาวร / Archived",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Reconstructs the `Lifecycle` shape from the object field's own siblings
 * (`context.parent`, since this validator always runs on a field nested
 * inside the `lifecycle` object) and returns the ONE `lifecycleProblems`
 * finding that targets `field`, formatted for the Studio in both
 * languages, or `true` when there is none.
 */
function lifecycleFieldProblem(field: keyof Lifecycle): CustomValidator<unknown> {
  return (_value, context) => {
    const parent = (context.parent ?? {}) as Partial<Record<keyof Lifecycle, unknown>>;
    const full: Lifecycle = {
      status: (parent.status as Lifecycle["status"]) ?? "draft",
      publishAt: (parent.publishAt as string | null | undefined) ?? null,
      owner: (parent.owner as PortfolioId) ?? ("" as PortfolioId),
      lastReviewed: (parent.lastReviewed as string | null | undefined) ?? null,
      reviewBy: (parent.reviewBy as string | null | undefined) ?? null,
      slugHistory: (parent.slugHistory as string[] | undefined) ?? [],
      maintainedBecause: (parent.maintainedBecause as string | null | undefined) ?? null,
    };
    const problems = lifecycleProblems(full, today());
    const match = problems.find((problem) => problem.field === field);
    if (!match) return true;
    return `${match.message.th} / ${match.message.en}`;
  };
}

export const lifecycle = defineType({
  name: "lifecycle",
  title: "วงจรเอกสาร / Lifecycle",
  type: "object",
  description:
    "ใครเป็นเจ้าของเอกสารนี้ และเมื่อใดควรกลับมาตรวจสอบ ทุกเอกสารต้องมีข้อมูลนี้ / Who owns this document and when to check it again. Every document carries this.",
  fields: [
    defineField({
      name: "status",
      title: "สถานะ / Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: documentStatuses.map((value) => ({ title: STATUS_TITLES[value], value })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishAt",
      title: "เผยแพร่เมื่อ / Publish at",
      type: "datetime",
      description:
        "จำเป็นเมื่อสถานะเป็น \"ตั้งเวลาเผยแพร่\" เท่านั้น / Required only when status is \"scheduled\".",
      hidden: ({ parent }) => (parent as { status?: string } | undefined)?.status !== "scheduled",
      validation: (Rule) => Rule.custom(lifecycleFieldProblem("publishAt")),
    }),
    defineField({
      name: "owner",
      title: "ฝ่ายที่รับผิดชอบ / Owning portfolio",
      type: "string",
      description:
        "ฝ่ายที่เป็นเจ้าของเอกสารนี้ จำเป็นทุกเอกสาร เพื่อให้ทราบว่าใครต้องตรวจสอบและส่งมอบงานต่อ / The portfolio that owns this document. Required on everything, so the review queue and handover pack can show what a portfolio holds.",
      options: {
        list: portfolios.map((p) => ({ title: `${p.label.th} / ${p.label.en}`, value: p.id })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastReviewed",
      title: "ตรวจสอบล่าสุดเมื่อ / Last reviewed",
      type: "date",
      description:
        "วันที่มีคนยืนยันล่าสุดว่าข้อมูลนี้ยังถูกต้อง / When someone last confirmed this document is still true.",
    }),
    defineField({
      name: "reviewBy",
      title: "ต้องตรวจสอบภายในวันที่ / Review by",
      type: "date",
      description:
        "หลังวันนี้เอกสารจะแสดงว่าเก่าเกินไปใน Studio และในแดชบอร์ดของฝ่ายที่รับผิดชอบ ปีละครั้งเป็นค่าปกติ ภาคการศึกษาละครั้งสำหรับเรื่องที่เปลี่ยนบ่อย / After this date the document shows as stale in the Studio and on the owning portfolio's dashboard. A year is usual; a term is right for anything that changes often.",
      validation: (Rule) => Rule.custom(lifecycleFieldProblem("reviewBy")),
    }),
    defineField({
      name: "slugHistory",
      title: "ประวัติ slug เดิม / Previous slugs",
      type: "array",
      of: [{ type: "string" }],
      description:
        "slug เดิมของเอกสารนี้ ใช้สำหรับเปลี่ยนเส้นทางอัตโนมัติเมื่อเปลี่ยนชื่อ URL ไม่ต้องกรอกเอง ระบบจะเพิ่มให้เมื่อมีการเปลี่ยน slug / Previous slugs, so a rename redirects automatically. Not usually edited by hand.",
    }),
    defineField({
      name: "maintainedBecause",
      title: "เหตุผลที่ยังคงเนื้อหานี้ไว้ / Kept because",
      type: "text",
      rows: 2,
      description:
        "กรอกเฉพาะเมื่อเนื้อหานี้ควรเป็นของ TUSU, TUSC หรือคณะ แต่ยังไม่มีหน่วยงานอื่นเผยแพร่ ระบุเหตุผล และตั้งวันตรวจสอบไว้เสมอ (ดูช่อง \"ต้องตรวจสอบภายในวันที่\") เพื่อให้ทราบเมื่อควรลบเนื้อหานี้ / Set only where this properly belongs to TUSU, TUSC or the faculty, and BIRSA is keeping it because nobody else publishes it yet. Name the reason, and always set a review date (see \"Review by\" above), so BIRSA finds out when someone does.",
    }),
  ],
});
