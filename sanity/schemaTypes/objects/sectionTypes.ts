/**
 * The eleven officer composable section types (REDESIGN-2.0 §4.6, §11.3
 * item 7, `docs/CMS-SCHEMA-CONVENTIONS.md` #5).
 *
 * Mirrors `components/bds/sectionPalette.ts`'s `sectionTypeIds` one to one:
 * `sectionTypes` below is keyed by every id in that list, no extras and
 * none missing, and each Sanity type `name` IS the id string, so the two
 * files cannot drift into two different palettes.
 *
 * THIS is where the frozen contract's rule lives in the schema: "Officers
 * compose pages from a fixed palette of section types. They never write
 * layout, CSS, class names, HTML, or free-form components." Every
 * document's `body` field is `sectionsField()` below, an array of exactly
 * these eleven object types. There is no field anywhere in this file named
 * in `forbiddenSchemaFields`, and the test suite asserts it.
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import type { CustomValidator, ObjectDefinition } from "sanity";

import { sectionTypeIds, type SectionTypeId } from "@/components/bds/sectionPalette";
import { portfolios } from "@/lib/portfolios";

// ---------------------------------------------------------------------------
// A link target shared by nav-list, card-grid and related-links: either a
// reference to one of the site's own document types, or an external URL.
// Not a `forbiddenSchemaFields` escape hatch: it is two structured fields,
// never HTML, never a class name, never free markup.
// ---------------------------------------------------------------------------

const INTERNAL_DOCUMENT_TYPES = ["newsArticle", "event", "page", "guide", "club"] as const;

function linkTargetFields(options: { allowNone: boolean }) {
  const listOptions = [
    { title: "หน้าเว็บภายในเว็บไซต์นี้ / An internal page", value: "internal" },
    { title: "เว็บไซต์ภายนอก / An external site", value: "external" },
    ...(options.allowNone ? [{ title: "ยังไม่มีลิงก์ / No link yet", value: "none" }] : []),
  ];

  const requiredWhen =
    (linkType: "internal" | "external"): CustomValidator<unknown> =>
    (value, context) => {
      const parent = context.parent as { linkType?: string } | undefined;
      if (parent?.linkType !== linkType) return true;
      if (!value) {
        return linkType === "internal"
          ? "กรุณาเลือกหน้าเว็บภายใน หรือเปลี่ยนประเภทลิงก์ / Choose an internal page, or change the link type."
          : "กรุณากรอกที่อยู่เว็บภายนอก หรือเปลี่ยนประเภทลิงก์ / Enter the external address, or change the link type.";
      }
      return true;
    };

  return [
    defineField({
      name: "linkType",
      title: "ประเภทลิงก์ / Link type",
      type: "string",
      options: { list: listOptions, layout: "radio" },
      initialValue: "internal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internalRef",
      title: "หน้าเว็บภายใน / Internal page",
      type: "reference",
      to: INTERNAL_DOCUMENT_TYPES.map((type) => ({ type })),
      hidden: ({ parent }) =>
        (parent as { linkType?: string } | undefined)?.linkType !== "internal",
      validation: (Rule) => Rule.custom(requiredWhen("internal")),
    }),
    defineField({
      name: "externalHref",
      title: "ที่อยู่เว็บภายนอก / External URL",
      type: "url",
      hidden: ({ parent }) =>
        (parent as { linkType?: string } | undefined)?.linkType !== "external",
      validation: (Rule) => [
        Rule.uri({ scheme: ["http", "https", "mailto"] }),
        Rule.custom(requiredWhen("external")),
      ],
    }),
  ];
}

const linkItemFields = [
  defineField({
    name: "title",
    title: "ชื่อลิงก์ / Link title",
    type: "localizedString",
    description:
      'ข้อความลิงก์ต้องบอกปลายทาง เช่น "อ่านระเบียบชมรม" ไม่ใช่ "คลิกที่นี่" / Link text must say where it goes, e.g. "read the club rules", never "click here".',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "description",
    title: "คำอธิบายสั้น / Short description",
    type: "localizedText",
    description: "อธิบายว่าลิงก์นี้พาไปหาอะไร ไม่บังคับ / What the link leads to. Optional.",
  }),
  ...linkTargetFields({ allowNone: false }),
];

// ---------------------------------------------------------------------------
// 1. rich-text
// ---------------------------------------------------------------------------

const richTextSection = defineType({
  name: "rich-text",
  title: "เนื้อหาสมบูรณ์ / Rich text",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "เนื้อหา / Content",
      type: "portableText",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "content.0.children.0.text" } },
});

// ---------------------------------------------------------------------------
// 2. nav-list
// ---------------------------------------------------------------------------

const navListSection = defineType({
  name: "nav-list",
  title: "รายการลิงก์ / Nav list",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "รายการ / Items",
      type: "array",
      of: [{ type: "object", name: "navListItem", title: "ลิงก์ / Link", fields: linkItemFields }],
      validation: (Rule) => Rule.min(1).error("ต้องมีอย่างน้อยหนึ่งลิงก์ / Add at least one link."),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 3. card-grid
// ---------------------------------------------------------------------------

const cardGridSection = defineType({
  name: "card-grid",
  title: "การ์ดหลายคอลัมน์ / Card grid",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      title: "จำนวนคอลัมน์ / Columns",
      type: "number",
      options: { list: [2, 3] },
      initialValue: 3,
      description: "สองหรือสามคอลัมน์เท่านั้น / Two or three columns only.",
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .max(3)
          .error("เลือกได้เฉพาะสองหรือสามคอลัมน์ / Only two or three columns are allowed."),
    }),
    defineField({
      name: "cards",
      title: "การ์ด / Cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "cardGridItem",
          title: "การ์ด / Card",
          fields: [
            defineField({
              name: "title",
              title: "ชื่อการ์ด / Card title",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "คำอธิบาย / Description",
              type: "localizedText",
            }),
            defineField({
              name: "image",
              title: "ภาพ (ไม่บังคับ) / Image (optional)",
              type: "imageField",
              description:
                "ทุกภาพต้องมีคำอธิบายภาพสองภาษา หรือทำเครื่องหมายว่าเป็นภาพตกแต่ง / Every image needs bilingual alt text, or must be marked decorative.",
            }),
            defineField({
              name: "link",
              title: "ลิงก์ (ไม่บังคับ) / Link (optional)",
              type: "object",
              fields: linkTargetFields({ allowNone: true }),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error("ต้องมีอย่างน้อยหนึ่งการ์ด / Add at least one card."),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 4. notice
// ---------------------------------------------------------------------------

const noticeSection = defineType({
  name: "notice",
  title: "กล่องแจ้งเตือน / Notice",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "ประเภท / Variant",
      type: "string",
      options: {
        list: [
          { title: "ข้อมูล / Info", value: "info" },
          { title: "สำเร็จ / Success", value: "success" },
          { title: "คำเตือน / Warning", value: "warning" },
          { title: "ข้อผิดพลาด / Error", value: "error" },
        ],
      },
      initialValue: "info",
      description:
        "ผลลัพธ์ระดับหน้าทั้งหน้าใช้ NotificationBanner ไม่ใช่กล่องนี้ / A page level result is a NotificationBanner, not this.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "หัวข้อ (ไม่บังคับ) / Title (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "body",
      title: "ข้อความ / Message",
      type: "localizedText",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 5. inset-text
// ---------------------------------------------------------------------------

const insetTextSection = defineType({
  name: "inset-text",
  title: "ข้อความเน้น / Inset text",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "เนื้อหา / Content",
      type: "portableTextInline",
      description:
        "ข้อความธรรมดาพร้อมตัวหนา ตัวเอียง และลิงก์เท่านั้น / Plain text with inline marks only.",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 6. accordion
// ---------------------------------------------------------------------------

const accordionSection = defineType({
  name: "accordion",
  title: "คำถามที่พบบ่อย / Accordion",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "คู่คำถามคำตอบ / Question and answer pairs",
      type: "array",
      of: [
        {
          type: "object",
          name: "accordionItem",
          title: "คำถามคำตอบ / Q&A",
          fields: [
            defineField({
              name: "question",
              title: "คำถาม / Question",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "คำตอบ / Answer",
              type: "localizedText",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.min(2).error(
          "ต้องมีอย่างน้อยสองคู่คำถามคำตอบ / Add at least two question and answer pairs."
        ),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 7. step-by-step
// ---------------------------------------------------------------------------

const stepByStepSection = defineType({
  name: "step-by-step",
  title: "ขั้นตอนตามลำดับ / Step by step",
  type: "object",
  fields: [
    defineField({
      name: "steps",
      title: "ขั้นตอน / Steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "stepItem",
          title: "ขั้นตอน / Step",
          fields: [
            defineField({
              name: "heading",
              title: "หัวข้อขั้นตอน / Step heading",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "รายละเอียด (ไม่บังคับ) / Detail (optional)",
              type: "localizedText",
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.min(2).error(
          "ต้องมีอย่างน้อยสองขั้นตอน แต่ละขั้นต้องมีหัวข้อ / Add at least two steps, each with a heading."
        ),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 8. task-list
// ---------------------------------------------------------------------------

const taskListSection = defineType({
  name: "task-list",
  title: "รายการงานพร้อมสถานะ / Task list",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "หัวข้อ / Heading",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "คำนำ (ไม่บังคับ) / Intro (optional)",
      type: "localizedText",
    }),
    defineField({
      name: "tasks",
      title: "งาน / Tasks",
      type: "array",
      of: [
        {
          type: "object",
          name: "taskItem",
          title: "งาน / Task",
          fields: [
            defineField({
              name: "title",
              title: "ชื่องาน / Task title",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "hint",
              title: "คำอธิบายสั้น (ไม่บังคับ) / Hint (optional)",
              type: "localizedText",
            }),
            defineField({
              name: "status",
              title: "สถานะ / Status",
              type: "string",
              options: {
                list: [
                  { title: "ยังไม่เริ่ม / Not started", value: "not-started" },
                  { title: "กำลังดำเนินการ / In progress", value: "in-progress" },
                  { title: "ยังเริ่มไม่ได้ / Cannot start yet", value: "cannot-start" },
                  { title: "เสร็จสิ้น / Completed", value: "completed" },
                ],
              },
              description:
                "สถานะเป็นคำ ไม่ใช่แค่สี ผู้อ่านที่ตาบอดสีต้องอ่านออก / The word IS the status. Never colour alone.",
              validation: (Rule) => Rule.required(),
            }),
            ...linkTargetFields({ allowNone: true }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.min(1).error(
          "ต้องมีอย่างน้อยหนึ่งงาน และทุกงานต้องมีสถานะ / Add at least one task; every task needs a status."
        ),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 9. contact-panel
// ---------------------------------------------------------------------------

const contactPanelSection = defineType({
  name: "contact-panel",
  title: "ข้อมูลติดต่อของฝ่าย / Contact panel",
  type: "object",
  fields: [
    defineField({
      name: "portfolio",
      title: "ฝ่ายที่ติดต่อ / Portfolio to contact",
      type: "string",
      description:
        "ข้อมูลติดต่อดึงมาจากที่เดียวเสมอ ไม่พิมพ์ซ้ำ เมื่อที่อยู่เปลี่ยนจะเปลี่ยนทุกที่โดยอัตโนมัติ / The details are pulled from one place, never typed in twice, so a changed address changes everywhere.",
      options: {
        list: portfolios.map((p) => ({ title: `${p.label.th} / ${p.label.en}`, value: p.id })),
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 10. related-links
// ---------------------------------------------------------------------------

const relatedLinksSection = defineType({
  name: "related-links",
  title: "ลิงก์ที่เกี่ยวข้อง / Related links",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "หัวข้อ (ไม่บังคับ) / Heading (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "items",
      title: "ลิงก์ / Links",
      type: "array",
      of: [
        { type: "object", name: "relatedLinkItem", title: "ลิงก์ / Link", fields: linkItemFields },
      ],
      validation: (Rule) => Rule.min(1).error("ต้องมีอย่างน้อยหนึ่งลิงก์ / Add at least one link."),
    }),
  ],
});

// ---------------------------------------------------------------------------
// 11. embedded-service
// ---------------------------------------------------------------------------

const embeddedServiceSection = defineType({
  name: "embedded-service",
  title: "การ์ดเริ่มบริการ / Embedded service",
  type: "object",
  fields: [
    defineField({
      name: "serviceSlug",
      title: "slug ของบริการ / Service slug",
      type: "string",
      description:
        "slug ของนิยามบริการที่เผยแพร่แล้วในทะเบียนบริการ (§5.2) การ์ดนี้ลิงก์ไปหน้าเริ่มต้นจริงของบริการนั้น ไม่ใช่หน้าเริ่มต้นเอง / The slug of a published service definition in the registry (§5.2). This card links to that service's real start page; it is not the start page itself.",
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { name: "slug" })
          .error(
            "slug ต้องเป็นตัวพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น / A slug is lowercase letters, numbers and hyphens only."
          ),
    }),
  ],
});

// ---------------------------------------------------------------------------
// The palette, keyed exactly like `sectionPalette` (one to one, tested).
// ---------------------------------------------------------------------------

export const sectionTypes: Record<SectionTypeId, ObjectDefinition> = {
  "rich-text": richTextSection,
  "nav-list": navListSection,
  "card-grid": cardGridSection,
  notice: noticeSection,
  "inset-text": insetTextSection,
  accordion: accordionSection,
  "step-by-step": stepByStepSection,
  "task-list": taskListSection,
  "contact-panel": contactPanelSection,
  "related-links": relatedLinksSection,
  "embedded-service": embeddedServiceSection,
};

export const sectionTypeList: ObjectDefinition[] = sectionTypeIds.map((id) => sectionTypes[id]);

/**
 * The `body` field every document type uses: an array composed only from
 * the section palette above. This IS "the section palette is the only way
 * to build a page" (`docs/CMS-SCHEMA-CONVENTIONS.md` #5) applied at the
 * document level.
 */
export function sectionsField(fieldName = "body") {
  return defineField({
    name: fieldName,
    title: "เนื้อหาของหน้า / Page content",
    type: "array",
    of: sectionTypeIds.map((id) => defineArrayMember({ type: id })),
    description:
      "ประกอบหน้าจากบล็อกสำเร็จรูปด้านล่าง ไม่มีช่องสำหรับ HTML, CSS หรือโค้ดฝังใด ๆ / Compose the page from the blocks below. There is no field anywhere for HTML, CSS or embedded code.",
    validation: (Rule) =>
      Rule.min(1).error(
        "หน้าต้องมีเนื้อหาอย่างน้อยหนึ่งบล็อก / The page needs at least one content block."
      ),
  });
}
