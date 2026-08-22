/**
 * A regulation (REDESIGN-2.0 §10, §6.3).
 *
 * Regulations need effective dates and supersession, because a student
 * reading a rule needs to know it is the rule that applies to them NOW, not
 * an older or a not-yet-effective version.
 *
 * `effectiveDate` is required and publish blocking. `supersedes` links a new
 * regulation to the one it replaces, so the chain is explicit rather than
 * something a reader has to reconstruct. Deliberately absent: a manually set
 * "is this current" flag. Whether a regulation is currently in force is a
 * fact derivable from `effectiveDate` and the supersession chain, computed
 * where the site renders it, not a checkbox an officer could leave stale:
 * the same reasoning §10 applies to minutes' public and withheld split
 * applies here, a fact that can be derived should not also be hand set.
 */
import { defineField, defineType } from "sanity";
import { localizedString } from "@/sanity/schemaTypes/objects/localizedString";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";
import { portableText } from "@/sanity/schemaTypes/objects/portableText";

export const regulation = defineType({
  name: "regulation",
  title: "Regulation / ระเบียบ",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title / ชื่อระเบียบ",
      description:
        "The name of this regulation, as students should refer to it.\n\nชื่อของระเบียบนี้ ตามที่ควรใช้อ้างอิง",
      type: localizedString.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifier / รหัสอ้างอิง",
      description:
        "An English kebab-case key for this regulation, shared across both locales.\n\n" +
        "รหัสภาษาอังกฤษแบบ kebab-case สำหรับระเบียบนี้ ใช้ร่วมกันทั้งสองภาษา",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Text / เนื้อหา",
      description: "The regulation's full text.\n\nเนื้อหาเต็มของระเบียบนี้",
      type: portableText.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "effectiveDate",
      title: "Effective date / วันที่มีผลบังคับใช้",
      description:
        "The date this version of the regulation takes effect. A regulation cannot publish without this field: a student reading a rule needs to know it is the rule that applies to them now.\n\n" +
        "วันที่ระเบียบฉบับนี้เริ่มมีผลบังคับใช้ ระเบียบจะเผยแพร่ไม่ได้หากไม่มีข้อมูลนี้ เพราะนักศึกษาที่อ่านระเบียบต้องทราบว่านี่คือฉบับที่ใช้บังคับอยู่ในปัจจุบัน",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "supersedes",
      title: "Supersedes / แทนที่ระเบียบฉบับ",
      description:
        "Optional. The earlier regulation this version replaces, if any, so the history of the rule is explicit rather than left to a reader to reconstruct.\n\n" +
        "ไม่บังคับ ระเบียบฉบับก่อนหน้าที่ฉบับนี้เข้ามาแทนที่ หากมี เพื่อให้ประวัติของระเบียบชัดเจน ไม่ต้องให้ผู้อ่านมาปะติดปะต่อเอง",
      type: "reference",
      to: [{ type: "regulation" }],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true;
          const id = (context.document as { _id?: string } | undefined)?._id;
          const normalizedId = id?.replace(/^drafts\./, "");
          if (value._ref && normalizedId && value._ref === normalizedId) {
            return "A regulation cannot supersede itself / ระเบียบฉบับหนึ่งไม่สามารถแทนที่ตัวเองได้";
          }
          return true;
        }),
    }),
    defineField({
      name: "lifecycle",
      title: "Publishing status / สถานะการเผยแพร่",
      description:
        "Status, owner portfolio, review date and the rest of the fields every document on this site carries. Regulations require a second approver before publishing (lib/content/lifecycle.ts).\n\n" +
        "สถานะ ฝ่ายงานเจ้าของ วันตรวจสอบ และฟิลด์อื่น ๆ ที่ทุกเอกสารบนเว็บไซต์นี้มีร่วมกัน ระเบียบต้องมีผู้อนุมัติคนที่สองก่อนเผยแพร่",
      type: lifecycle.name,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.en", date: "effectiveDate" },
    prepare({ title, date }) {
      return { title: title ?? "Untitled regulation", subtitle: date };
    },
  },
});
