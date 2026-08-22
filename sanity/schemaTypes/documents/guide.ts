/**
 * Student life guide (REDESIGN-2.0 §6.3 "Student-life guides", Wave 3B).
 *
 * Models what `content/student-life/{en,th}/<audience>/*.mdx` already
 * carries (`lib/content.ts`'s `studentLifeFrontmatterSchema`): a long-form
 * page that belongs to one of three audiences and sorts by a manual order
 * rather than by date, because a handbook's table of contents is authored,
 * not chronological.
 */
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { sectionsField } from "@/sanity/schemaTypes/objects/sectionTypes";

/**
 * `SlugSourceFn` receives the full `SanityDocument`, which has nothing in
 * common with this document type's own shape, so the narrowing happens
 * inside the function rather than in the parameter type.
 */
function titleEnSource(doc: SanityDocument): string {
  const title = doc.title as { en?: string } | undefined;
  return title?.en ?? "";
}

export const guide = defineType({
  name: "guide",
  title: "คู่มือชีวิตนักศึกษา / Student life guide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "ชื่อเรื่อง / Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "slug",
      type: "slug",
      description:
        "ใช้ร่วมกันทั้งสองภาษา สร้างจากชื่อเรื่องภาษาอังกฤษ / Shared across both locales, generated from the English title.",
      options: { source: titleEnSource, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "สรุปย่อ / Summary",
      type: "localizedText",
      description: "ข้อความสั้นที่แสดงในรายการคู่มือ / The short text shown in the guide listing.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audience",
      title: "กลุ่มผู้อ่าน / Audience",
      type: "string",
      options: {
        list: [
          { title: "นักศึกษาทั่วไป / General student home", value: "home" },
          { title: "นักศึกษาต่างชาติ / International students", value: "international" },
          { title: "คู่มือฉบับเต็ม / Handbook", value: "handbook" },
        ],
      },
      description: "หมวดที่คู่มือนี้ปรากฏ / Which listing this guide appears in.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "ลำดับการแสดงผล / Display order",
      type: "number",
      description: "เลขน้อยแสดงก่อน ใช้จัดลำดับสารบัญด้วยมือ ไม่ใช่ตามวันที่ / Lower numbers show first. A hand-set table of contents order, not by date.",
      validation: (Rule) => Rule.required(),
    }),
    sectionsField("body"),
    defineField({
      name: "placeholder",
      title: "ยังไม่มีข้อมูลจริง / Placeholder",
      type: "boolean",
      description:
        "เปิดใช้เฉพาะเมื่อเนื้อหานี้เป็นข้อมูลที่ยังไม่ยืนยัน ต้องมีข้อความแจ้งเตือนที่มองเห็นได้ในเนื้อหาด้วย / Turn on only when this content is an unconfirmed placeholder. Pair it with a visible note in the body, never a silent guess.",
      initialValue: false,
    }),
    defineField({
      name: "lifecycle",
      title: "วงจรเอกสาร / Lifecycle",
      type: "lifecycle",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "audience" },
  },
});
