/**
 * Club (REDESIGN-2.0 §6.3 "Club directory", Wave 3B).
 *
 * Models what `content/clubs/{en,th}/*.mdx` already carries
 * (`lib/content.ts`'s `clubFrontmatterSchema`). `socialLinks` replaces
 * 1.0's open-ended `links` list with the same shape (a club reaches
 * students on whatever it actually uses: Instagram, LINE, Discord), kept
 * as a dedicated field rather than a `related-links` section because it is
 * sidebar data a template positions on its own, not part of the club's
 * prose.
 *
 * `custodian` is a slug into the inventory system's Custodian table
 * (`db/migrations/009_custodians.sql`), set manually and only when
 * confirmed (`lib/content.ts`'s own comment on the 1.0 field). It is a
 * slug string, not a reference, because the custodian record lives outside
 * Sanity entirely (§6.3: the CMS holds published content, not operational
 * inventory data).
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

export const club = defineType({
  name: "club",
  title: "ชมรม / Club",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "ชื่อชมรม / Club name",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "slug",
      type: "slug",
      description:
        "ใช้ร่วมกันทั้งสองภาษา สร้างจากชื่อชมรมภาษาอังกฤษ / Shared across both locales, generated from the English name.",
      options: { source: titleEnSource, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "คำโปรยสั้น / Tagline",
      type: "localizedString",
      description: "ประโยคเดียวที่บอกว่าชมรมนี้ทำอะไร แสดงในรายการชมรม / One line saying what the club does, shown in the club listing.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "หมวดหมู่ / Category",
      type: "string",
      options: {
        list: [
          { title: "วิชาการ / Academic", value: "academic" },
          { title: "กีฬา / Sports", value: "sports" },
          { title: "ศิลปะ / Arts", value: "arts" },
          { title: "จิตอาสาและชุมชน / Community", value: "community" },
          { title: "สังสรรค์ / Social", value: "social" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "ลำดับการแสดงผล / Display order",
      type: "number",
      description: "เลขน้อยแสดงก่อนในรายการชมรม / Lower numbers show first in the club listing.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "joinOpen",
      title: "เปิดรับสมาชิกอยู่หรือไม่ / Currently taking new members",
      type: "boolean",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lead",
      title: "หัวหน้าชมรม (ไม่บังคับ) / Club lead (optional)",
      type: "localizedString",
      description:
        "ใส่เฉพาะตำแหน่ง เช่น \"ประธานชมรม\" ห้ามใส่ชื่อบุคคลเด็ดขาด ชื่อบุคคลไม่ใช่เนื้อหาที่ CMS นี้เก็บได้ / Role title only, e.g. \"President\". Never a person's name; this CMS has nowhere to safely hold one.",
    }),
    defineField({
      name: "meets",
      title: "เวลานัดพบ (ไม่บังคับ) / Meets (optional)",
      type: "localizedString",
      description: "ใส่เฉพาะเมื่อยืนยันแล้ว / Set only when confirmed.",
    }),
    defineField({
      name: "where",
      title: "สถานที่นัดพบ (ไม่บังคับ) / Where (optional)",
      type: "localizedString",
      description: "ใส่เฉพาะเมื่อยืนยันแล้ว / Set only when confirmed.",
    }),
    defineField({
      name: "custodian",
      title: "slug ผู้ดูแลครุภัณฑ์ (ไม่บังคับ) / Inventory custodian slug (optional)",
      type: "string",
      description:
        "slug ของผู้ดูแลครุภัณฑ์ที่ตรงกันในระบบยืมคืน กรอกเฉพาะเมื่อยืนยันแล้วเท่านั้น ไม่ใช่การเดาจาก slug ของชมรม / The matching Custodian slug in the loan system. Set only when confirmed, never assumed from this club's own slug.",
    }),
    defineField({
      name: "socialLinks",
      title: "ช่องทางติดตาม (ไม่บังคับ) / Social links (optional)",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          title: "ช่องทาง / Channel",
          fields: [
            defineField({
              name: "label",
              title: "ชื่อช่องทาง / Channel name",
              type: "localizedString",
              description: 'เช่น "Instagram" หรือ "LINE OpenChat" / e.g. "Instagram" or "LINE OpenChat".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "ที่อยู่เว็บ / URL",
              type: "url",
              validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
        },
      ],
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
    select: { title: "title.en", subtitle: "tagline.en" },
  },
});
