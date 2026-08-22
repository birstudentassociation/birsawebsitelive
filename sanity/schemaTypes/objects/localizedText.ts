/**
 * A longer bilingual text field (REDESIGN-2.0 principle 14, §10).
 *
 * The `localizedString` sibling of this file is for titles and labels;
 * this one is for summaries, captions and other short paragraphs that are
 * still plain text, not rich text. Anything that needs headings, lists or
 * links belongs in `portableText.ts` instead, composed through the section
 * palette (`docs/CMS-SCHEMA-CONVENTIONS.md` #5).
 *
 * Both locales are required for the same reason as `localizedString`: a
 * document missing one language cannot publish, checked at the field
 * itself rather than once for the whole document.
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

export const localizedText = defineType({
  name: "localizedText",
  title: "ข้อความสองภาษา (ย่อหน้า) / Localised text (paragraph)",
  type: "object",
  fields: [
    defineField({
      name: "th",
      title: "ภาษาไทย / Thai",
      type: "text",
      rows: 4,
      description:
        "เขียนเป็นภาษาไทยโดยตรง ไม่ใช่คำแปลจากภาษาอังกฤษ ข้อความธรรมดา ไม่มีการจัดรูปแบบ / Write natively in Thai, never a translation of the English. Plain text, no formatting.",
      validation: (Rule) => Rule.custom(requiredLocale("ข้อความภาษาไทย", "Thai text")),
    }),
    defineField({
      name: "en",
      title: "ภาษาอังกฤษ / English",
      type: "text",
      rows: 4,
      description:
        "เขียนเป็นภาษาอังกฤษโดยตรง ไม่ใช่คำแปลจากภาษาไทย ข้อความธรรมดา ไม่มีการจัดรูปแบบ / Write natively in English, never a translation of the Thai. Plain text, no formatting.",
      validation: (Rule) => Rule.custom(requiredLocale("ข้อความภาษาอังกฤษ", "English text")),
    }),
  ],
  preview: {
    select: { title: "en", subtitle: "th" },
  },
});
