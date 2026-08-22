/**
 * Generic page (REDESIGN-2.0 §6.3 "Generic pages", Wave 3B).
 *
 * "So a new page never needs a developer." This is the plainest expression
 * of the section palette: a page IS a slug, a title, an optional summary
 * for search and link previews, and a `body` composed from the eleven
 * section types. Nothing else, because anything else would be a second way
 * to add content that is not the palette.
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

export const page = defineType({
  name: "page",
  title: "หน้าเว็บทั่วไป / Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "ชื่อหน้า / Page title",
      type: "localizedString",
      description: "แสดงเป็นหัวข้อระดับ 1 ของหน้า / Rendered as the page's own heading 1.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "slug",
      type: "slug",
      description:
        "ใช้ร่วมกันทั้งสองภาษา สร้างจากชื่อหน้าภาษาอังกฤษ เปลี่ยนภายหลังได้และลิงก์เดิมจะยังใช้งานได้ / Shared across both locales, generated from the English title. Can be changed later; the old link still works.",
      options: { source: titleEnSource, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "คำอธิบายหน้า (ไม่บังคับ) / Page description (optional)",
      type: "localizedText",
      description:
        "ใช้เป็นคำอธิบายเมื่อแชร์ลิงก์และในผลการค้นหา ไม่แสดงบนหน้าเว็บโดยตรง / Used as the link preview and search result description. Not shown on the page itself.",
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
    select: { title: "title.en", subtitle: "slug.current" },
  },
});
