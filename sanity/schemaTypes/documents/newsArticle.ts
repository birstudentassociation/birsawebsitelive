/**
 * News article (REDESIGN-2.0 §6.3 "News and events", Wave 3B).
 *
 * Models what `content/news/{en,th}/*.mdx` already carries for a
 * `type: "news"` entry (`lib/content.ts`'s `newsFrontmatterSchema`), so
 * Wave 6 can migrate every existing news post into this shape. See the
 * wave report for the one field 1.0 has that this schema does not carry
 * unlocalised.
 *
 * Dated announcements that are not tied to a single future happening
 * (committee news, policy changes, results). A post about something that
 * happens on a particular day and place is an `event` instead.
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

export const newsArticle = defineType({
  name: "newsArticle",
  title: "ข่าว / News article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "หัวข้อข่าว / Headline",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "slug",
      type: "slug",
      description:
        "ใช้ร่วมกันทั้งสองภาษา สร้างจากหัวข้อภาษาอังกฤษ เปลี่ยน slug ภายหลังได้ ระบบจะจำ slug เดิมไว้เพื่อเปลี่ยนเส้นทางอัตโนมัติ / Shared across both locales, generated from the English headline. Can be changed later; the previous slug is kept so the old link still redirects.",
      options: { source: titleEnSource, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "สรุปย่อ / Summary",
      type: "localizedText",
      description:
        "ข้อความสั้นที่แสดงในรายการข่าวและใช้เป็นคำอธิบายเมื่อแชร์ลิงก์ / The short text shown in news listings and used as the link preview description.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "หมวดหมู่ / Category",
      type: "string",
      description:
        "หมวดหมู่ข่าว เช่น ประกาศ กิจกรรม ทุนการศึกษา ใช้ตัวพิมพ์เล็กคั่นด้วยขีดกลาง / The news category, e.g. announcements, scholarships. Lowercase, hyphen separated.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "วันที่เผยแพร่ / Published date",
      type: "date",
      description: "วันที่ของข่าวนี้ ใช้จัดเรียงรายการข่าว / The date this news item carries, used to sort the listing.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "ภาพหลัก (ไม่บังคับ) / Hero image (optional)",
      type: "imageField",
      description:
        "ภาพเดียวต่อหน้าเท่านั้น แสดงด้านบนสุดของข่าว / At most one per page, shown at the top of the article.",
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
    select: { title: "title.en", subtitle: "date", media: "heroImage.image" },
  },
});
