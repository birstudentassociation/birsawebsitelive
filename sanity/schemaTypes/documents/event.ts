/**
 * Event (REDESIGN-2.0 §6.3 "News and events", Wave 3B).
 *
 * Models what `content/news/{en,th}/*.mdx` already carries for a
 * `type: "event"` entry (`lib/content.ts`'s `newsFrontmatterSchema`, whose
 * `location`, `start` and `end` fields only ever appear together on event
 * posts today), split into its own document type because an event carries
 * a when and a where that a plain news post does not, and 1.0's single
 * `type` flag on one schema is exactly the ambiguity this wave is meant to
 * remove. See the wave report for the field 1.0 has that this schema does
 * not carry unlocalised.
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

export const event = defineType({
  name: "event",
  title: "กิจกรรม / Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "ชื่อกิจกรรม / Event title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "slug",
      type: "slug",
      description:
        "ใช้ร่วมกันทั้งสองภาษา สร้างจากชื่อกิจกรรมภาษาอังกฤษ / Shared across both locales, generated from the English title.",
      options: { source: titleEnSource, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "สรุปย่อ / Summary",
      type: "localizedText",
      description: "ข้อความสั้นที่แสดงในรายการและใช้เป็นคำอธิบายเมื่อแชร์ลิงก์ / The short text shown in listings and used as the link preview description.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "หมวดหมู่ / Category",
      type: "string",
      description: "หมวดหมู่ เช่น กิจกรรม ปฐมนิเทศ กีฬา ใช้ตัวพิมพ์เล็กคั่นด้วยขีดกลาง / The category, e.g. orientation, sport. Lowercase, hyphen separated.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "วันที่เผยแพร่ข่าวนี้ / Published date",
      type: "date",
      description: "วันที่ประกาศข่าวนี้ ซึ่งอาจไม่ใช่วันที่จัดกิจกรรม / When this announcement was published, which may differ from when the event happens.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "สถานที่ / Location",
      type: "localizedString",
      description: "สถานที่จัดกิจกรรม เช่น อาคาร ห้อง หรือชื่อสถานที่ / Where the event happens.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "start",
      title: "เริ่มกิจกรรม / Start",
      type: "datetime",
      description: "วันและเวลาที่กิจกรรมเริ่ม / The date and time the event starts.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "สิ้นสุดกิจกรรม (ไม่บังคับ) / End (optional)",
      type: "datetime",
      description: "ใส่เฉพาะเมื่อทราบเวลาสิ้นสุดหรือกิจกรรมมีหลายวัน / Set only when the end time is known, or the event runs over several days.",
      validation: (Rule) =>
        Rule.min(Rule.valueOfField("start")).error(
          "เวลาสิ้นสุดต้องไม่ก่อนเวลาเริ่ม / The end time cannot be before the start time."
        ),
    }),
    defineField({
      name: "heroImage",
      title: "ภาพหลัก (ไม่บังคับ) / Hero image (optional)",
      type: "imageField",
      description: "ภาพเดียวต่อหน้าเท่านั้น / At most one per page.",
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
    select: { title: "title.en", subtitle: "start", media: "heroImage.image" },
  },
});
