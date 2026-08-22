/**
 * A short bilingual text field (REDESIGN-2.0 principle 14, §10).
 *
 * Used for titles, labels, headings and other short reader facing phrases.
 * Both `en` and `th` are required, which is what makes "a document without
 * both locales cannot leave draft" true at the field an officer is actually
 * looking at, rather than a single document level "something is
 * incomplete" (`docs/CMS-SCHEMA-CONVENTIONS.md` #3, §6.5 step 3, acceptance
 * test row 34).
 *
 * Field titles and descriptions are written in both languages, Thai first,
 * because the Studio's own interface language (`@sanity/locale-th-th`)
 * translates Sanity's chrome and not BIRSA's schema
 * (`docs/CMS-SCHEMA-CONVENTIONS.md` #10).
 */
import { defineField, defineType } from "sanity";
import type { CustomValidator } from "sanity";

const requiredLocale: (labelTh: string, labelEn: string) => CustomValidator<string | undefined> =
  (labelTh, labelEn) => (value) => {
    if (!value || value.trim() === "") {
      return `กรุณากรอก${labelTh} เอกสารจะเผยแพร่ไม่ได้จนกว่าจะกรอกครบทั้งสองภาษา / Enter the ${labelEn}. This cannot publish until both languages are filled in.`;
    }
    return true;
  };

export const localizedString = defineType({
  name: "localizedString",
  title: "ข้อความสองภาษา (สั้น) / Localised text (short)",
  type: "object",
  fields: [
    defineField({
      name: "th",
      title: "ภาษาไทย / Thai",
      type: "string",
      description:
        "เขียนเป็นภาษาไทยโดยตรง ไม่ใช่คำแปลจากภาษาอังกฤษ / Write natively in Thai, never a translation of the English.",
      validation: (Rule) => Rule.custom(requiredLocale("ข้อความภาษาไทย", "Thai text")),
    }),
    defineField({
      name: "en",
      title: "ภาษาอังกฤษ / English",
      type: "string",
      description:
        "เขียนเป็นภาษาอังกฤษโดยตรง ไม่ใช่คำแปลจากภาษาไทย / Write natively in English, never a translation of the Thai.",
      validation: (Rule) => Rule.custom(requiredLocale("ข้อความภาษาอังกฤษ", "English text")),
    }),
  ],
  preview: {
    select: { title: "en", subtitle: "th" },
  },
});
