/**
 * A committee decision (REDESIGN-2.0 §10, roadmap §4F, §6.3).
 *
 * Transparency is the point: a decision records what was decided, when, by
 * which portfolio or meeting, and what it changed. It is not a personal
 * account of how the decision came about, and there is no field here for
 * one: no "decided by" person, no narrative of who argued for what. `owner`
 * (in `lifecycle`, required on every document) already says which portfolio
 * is answerable for this decision, and `meeting` optionally says which
 * minuted meeting it came from. Neither can name an individual outside the
 * public roster, and this document does not try to.
 *
 * `whatChanged` is a field of its own, separate from `summary`, because
 * REDESIGN-2.0 is explicit that a decision records "what it changed", a
 * concrete fact a student can check against, not folded into a paragraph
 * where it can go missing.
 */
import { defineField, defineType } from "sanity";
import { localizedText } from "@/sanity/schemaTypes/objects/localizedText";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";
import { portableText } from "@/sanity/schemaTypes/objects/portableText";

export const decision = defineType({
  name: "decision",
  title: "Decision / มติ",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title / หัวข้อ",
      description:
        "A short, factual title for what was decided. No dashes and no colons other than a clock time (house style).\n\n" +
        "หัวข้อสั้น ๆ ตามข้อเท็จจริงของมติ ห้ามใช้เครื่องหมายขีดกลางหรือทวิภาคยกเว้นในการบอกเวลา",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifier / รหัสอ้างอิง",
      description:
        "An English kebab-case key for this decision, shared across both locales.\n\n" +
        "รหัสภาษาอังกฤษแบบ kebab-case สำหรับมตินี้ ใช้ร่วมกันทั้งสองภาษา",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "decisionDate",
      title: "Decision date / วันที่มีมติ",
      description: "The date the decision was made.\n\nวันที่มีมตินี้",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meeting",
      title: "Meeting / การประชุม",
      description:
        "Optional. The minutes of the meeting this decision came from, where there was one. Some decisions are made within a portfolio's own remit without a minuted meeting.\n\n" +
        "ไม่บังคับ รายงานการประชุมที่มีมตินี้เกิดขึ้น หากมี มติบางเรื่องเกิดขึ้นภายในขอบเขตงานของฝ่ายงานเองโดยไม่มีการประชุมที่บันทึกไว้",
      type: "reference",
      to: [{ type: "minutes" }],
    }),
    defineField({
      name: "summary",
      title: "What was decided / สิ่งที่มีมติ",
      description:
        "What the committee decided, in plain language a student can read without context.\n\n" +
        "สิ่งที่คณะกรรมการมีมติ เขียนด้วยภาษาที่นักศึกษาอ่านเข้าใจได้โดยไม่ต้องมีความรู้พื้นหลัง",
      type: portableText.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatChanged",
      title: "What it changed / สิ่งที่เปลี่ยนแปลง",
      description:
        "The concrete effect of this decision, for example a service standard, a rule, or a budget line. This is what makes the decision checkable rather than a headline.\n\n" +
        "ผลที่เกิดขึ้นจริงจากมตินี้ เช่น มาตรฐานการให้บริการ กฎระเบียบ หรือรายการงบประมาณ ข้อมูลนี้ทำให้ตรวจสอบมติได้จริง ไม่ใช่เพียงพาดหัว",
      type: localizedText.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lifecycle",
      title: "Publishing status / สถานะการเผยแพร่",
      description:
        "Status, owner portfolio, review date and the rest of the fields every document on this site carries. Decisions require a second approver before publishing (lib/content/lifecycle.ts).\n\n" +
        "สถานะ ฝ่ายงานเจ้าของ วันตรวจสอบ และฟิลด์อื่น ๆ ที่ทุกเอกสารบนเว็บไซต์นี้มีร่วมกัน มติต้องมีผู้อนุมัติคนที่สองก่อนเผยแพร่",
      type: lifecycle.name,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", date: "decisionDate" },
    prepare({ title, date }) {
      return { title: title ?? "Untitled decision", subtitle: date };
    },
  },
});
