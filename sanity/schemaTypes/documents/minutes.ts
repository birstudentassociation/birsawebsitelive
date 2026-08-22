/**
 * Committee minutes (REDESIGN-2.0 §6.3, §10, §7.3).
 *
 * Minutes are the sharp case §6.3 names directly: real minutes name people
 * and can record welfare or disciplinary matters, and this schema has to
 * make the public and the withheld parts STRUCTURALLY different rather than
 * a checkbox an officer can forget or a rushed hand can leave unticked.
 *
 * THE DESIGN. This document has exactly one place to write body content:
 * `publicSummary`, a bilingual Portable Text field built from Wave 3B's
 * `portableText` array type. There is no second field anywhere on this type
 * shaped to hold a fuller account, an internal note, or the substance of a
 * withheld item. That is the structural separation, not a flag on top of
 * one shared field: the schema enforces the boundary by having nowhere to
 * put what must not be here, exactly the pattern REDESIGN-2.0 §6.3 uses for
 * the personal data boundary generally.
 *
 * `redactedItems` records, honestly, that something was withheld and roughly
 * why, WITHOUT holding the withheld content. Each entry is an item number (a
 * plain integer) and a category chosen from a closed list. Neither can carry
 * a name, a description of a person, or an account of what happened: a
 * number has no room for one and a picklist value is one of five fixed
 * strings. An officer physically cannot paste a welfare case into this
 * field, which is the point, because a rule that only says "do not type a
 * name here" is a rule the tired officer this brief asks us to design for
 * will eventually break.
 *
 * What this deliberately does NOT attempt: recording where the fuller,
 * withheld record is kept. This agent does not know BIRSA's actual internal
 * process for withheld minutes (paper, a locked drive, a future console
 * feature), and inventing one would be inventing an institutional fact this
 * brief forbids. See this agent's report for where that link should live
 * once it exists.
 *
 * `attendees` references `committeeMember` documents rather than accepting
 * free text, for the same reason `portfolio.holder` does: naming who
 * attended a meeting in their public capacity is exactly what a roster
 * already publishes, and a reference cannot smuggle in a name that is not
 * already a public officer's.
 *
 * NOTE ON `portableText`: Wave 3B's `portableText` object is a single
 * locale's rich text array, not a bilingual wrapper (`localizedString` and
 * `localizedText` are the bilingual object types; `portableText` is the
 * building block a document composes twice, once per locale, matching how
 * every other locale-carrying document on this site works). `publicSummary`
 * below builds that two-field wrapper itself, `th` and `en`, both required,
 * so bilingual parity is still publish blocking on this field specifically.
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";
import { portableText } from "@/sanity/schemaTypes/objects/portableText";

/**
 * Closed, non-free-text categories for a withheld agenda item. Chosen to be
 * broad enough to be honest about the kind of matter without describing it:
 * "welfare" says a welfare matter was withheld, never what it concerned or
 * about whom.
 */
export const redactionCategories = [
  "welfare",
  "disciplinary",
  "personnel",
  "legal-advice",
  "other-confidential",
] as const;

export type RedactionCategory = (typeof redactionCategories)[number];

export const minutes = defineType({
  name: "minutes",
  title: "รายงานการประชุม / Minutes",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "หัวข้อ / Title",
      description:
        "หัวข้อสั้น ๆ ตามข้อเท็จจริงของการประชุมครั้งนี้ เช่น วันที่ประชุม ห้ามใช้เครื่องหมายขีดกลางหรือทวิภาคยกเว้นในการบอกเวลา / " +
        "A short, factual title for this meeting's minutes, for example a date. No dashes and no colons other than a clock time (house style).",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "รหัสอ้างอิง / Identifier",
      description:
        "รหัสภาษาอังกฤษแบบ kebab-case สำหรับรายงานการประชุมนี้ ใช้ร่วมกันทั้งสองภาษา / " +
        "An English kebab-case key for this meeting's minutes, shared across both locales.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meetingDate",
      title: "วันที่ประชุม / Meeting date",
      description: "วันที่คณะกรรมการประชุมกัน / The date the committee met.",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "attendees",
      title: "ผู้เข้าร่วมประชุม / Attendees",
      description:
        "ไม่บังคับ กรรมการที่เข้าร่วมประชุม อ้างอิงจากรายชื่อกรรมการเท่านั้น ไม่ใช่การพิมพ์ชื่อเอง เพื่อให้ระบุได้เฉพาะผู้ที่เป็นกรรมการสาธารณะอยู่แล้ว / " +
        "Optional. Committee members who attended, referenced from the roster rather than typed, so this can only ever name someone already public as an officer.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "committeeMember" }] })],
    }),
    defineField({
      name: "publicSummary",
      title: "สรุปสาธารณะ / Public summary",
      description:
        "บันทึกทั้งหมดที่จะเผยแพร่ต่อสาธารณะของการประชุมครั้งนี้ นี่เป็นช่องเดียวสำหรับเนื้อหาของเอกสารนี้ หากมีเรื่องใดที่เผยแพร่ไม่ได้ ห้ามเขียนไว้ที่นี่แม้เพียงสรุปย่อ เพราะเอกสารนี้ไม่มีช่องอื่นให้เขียนแทน ห้ามระบุชื่อนักศึกษา และห้ามอธิบายเรื่องสวัสดิการหรือวินัยแม้เพียงกว้าง ๆ ให้ใช้ช่องรายการที่งดเผยแพร่ด้านล่างแทน / " +
        "THE ENTIRE PUBLISHABLE RECORD of this meeting. This is the only place body content goes on this document: if something cannot be published, it does not belong here, not even in outline, and there is deliberately no other field on this document to put it in instead. Never name a student, and never describe a welfare or disciplinary matter, even generally. Use Withheld items below for those.",
      type: "object",
      fields: [
        defineField({
          name: "th",
          title: "ภาษาไทย / Thai",
          type: portableText.name,
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: "en",
          title: "ภาษาอังกฤษ / English",
          type: portableText.name,
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "decisions",
      title: "มติจากการประชุมนี้ / Decisions from this meeting",
      description:
        "ไม่บังคับ เอกสารมติที่เกิดจากการประชุมนี้ เพื่อให้ผู้อ่านหน้าความโปร่งใสตามลิงก์จากรายงานการประชุมไปยังมติได้ / " +
        "Optional. Decision documents that came out of this meeting, for a reader following the transparency pages from minutes to decision.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "decision" }] })],
    }),
    defineField({
      name: "redactedItems",
      title: "รายการที่งดเผยแพร่ / Withheld items",
      description:
        "ไม่บังคับ บันทึกเชิงโครงสร้างว่ามีรายการวาระใดที่งดเผยแพร่และเหตุผลโดยกว้าง โดยไม่มีเนื้อหาที่งดเผยแพร่อยู่ในนี้ มีเพียงหมายเลขรายการและหมวดหมู่เท่านั้น ช่องนี้ถูกออกแบบมาไม่ให้ใส่ชื่อบุคคลหรือรายละเอียดเหตุการณ์ได้ / " +
        "Optional. A structural record that an agenda item was withheld and roughly why, WITHOUT the withheld content itself: an item number and a category, nothing else. This field cannot hold a name or an account of what happened, by design.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "redactedItem",
          fields: [
            defineField({
              name: "itemNumber",
              title: "ลำดับที่ / Item number",
              description:
                "หมายเลขวาระที่งดเผยแพร่ เช่น 4 / The agenda item number that was withheld, for example 4.",
              type: "number",
              validation: (Rule) => Rule.required().integer().positive(),
            }),
            defineField({
              name: "category",
              title: "หมวดหมู่ / Category",
              description:
                "ประเภทเรื่องโดยกว้าง เลือกจากรายการที่กำหนดไว้ตายตัว ห้ามอธิบายเนื้อหาของเรื่องนั้น / " +
                "The general kind of matter, chosen from a fixed list. Never a description of the matter itself.",
              type: "string",
              options: {
                list: redactionCategories.map((value) => ({ title: value, value })),
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { itemNumber: "itemNumber", category: "category" },
            prepare({ itemNumber, category }) {
              return { title: `Item ${itemNumber ?? "?"}`, subtitle: category };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "lifecycle",
      title: "สถานะการเผยแพร่ / Publishing status",
      description:
        "สถานะ ฝ่ายงานเจ้าของ วันตรวจสอบ และฟิลด์อื่น ๆ ที่ทุกเอกสารบนเว็บไซต์นี้มีร่วมกัน รายงานการประชุมต้องมีผู้อนุมัติคนที่สองก่อนเผยแพร่ / " +
        "Status, owner portfolio, review date and the rest of the fields every document on this site carries. Minutes require a second approver before publishing (lib/content/lifecycle.ts).",
      type: lifecycle.name,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", date: "meetingDate" },
    prepare({ title, date }) {
      return { title: title ?? "Untitled minutes", subtitle: date };
    },
  },
});
