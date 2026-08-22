/**
 * The question palette, mirrored into the Studio (REDESIGN-2.0 §6.7, §6.12).
 *
 * FROZEN CONTRACT this file MUST agree with: `lib/services/questionTypes.ts`.
 * That file draws the line "the officer decides what to ask, the developer
 * decides what a question can be": an officer composing a service picks one
 * of the eleven ids in `questionTypeIds` and writes the wording. They cannot
 * define a field. This schema is how that boundary actually holds in the
 * Studio: the `type` field below offers exactly those eleven options, taken
 * from the frozen list itself rather than retyped, so the two cannot drift
 * apart. A twelfth question type is code (§6.12), never a schema edit.
 *
 * Field names mirror `Question` in `lib/services/questionTypes.ts` exactly:
 * `id`, `type`, `label`, `hint`, `required`, `options`, `maxLength`.
 *
 * `label` and `hint` use `localizedString` (Wave 3B), because a question is a
 * short reader facing phrase, not a paragraph. `options[].label` is the same.
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import type { CustomValidator } from "sanity";

import { questionTypeIds, type QuestionTypeId } from "@/lib/services/questionTypes";

/**
 * Bilingual titles for the eleven types, authored natively (not translated),
 * in the Studio's "Thai / English" convention (`docs/CMS-SCHEMA-CONVENTIONS.md`
 * #10, matching `sanity/schemaTypes/objects/localizedString.ts`).
 */
const QUESTION_TYPE_TITLES: Record<QuestionTypeId, string> = {
  "short-text": "ข้อความสั้น / Short text",
  "long-text": "ข้อความยาว / Long text",
  email: "ที่อยู่อีเมล / Email address",
  phone: "หมายเลขโทรศัพท์ / Phone number",
  "student-id": "รหัสนักศึกษา / Student ID",
  date: "วันที่ / Date",
  "date-range": "ช่วงวันที่ / Date range",
  "choose-one": "เลือกหนึ่งตัวเลือก / Choose one",
  "choose-several": "เลือกได้หลายตัวเลือก / Choose several",
  "file-upload": "แนบไฟล์ / File upload",
  "yes-no": "ใช่หรือไม่ใช่ / Yes or no",
};

/** The options list the `type` field renders. Exported for the test suite. */
export const questionTypeOptions = questionTypeIds.map((id) => ({
  title: QUESTION_TYPE_TITLES[id],
  value: id,
}));

/**
 * Matches `URL_SAFE_ID` in `lib/services/defineService.ts`. Duplicated here
 * (that constant is private to that file) so the Studio can reject an unsafe
 * id at entry time rather than only at publish; `validateServiceDefinition`
 * remains the authoritative check either way, since it runs again on the
 * whole document.
 */
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const idValidator: CustomValidator<string> = (value) => {
  if (!value || !value.trim()) {
    return "กรุณาระบุรหัสคำถาม / Enter a question id.";
  }
  if (!ID_PATTERN.test(value)) {
    return "รหัสคำถามต้องใช้ตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และเครื่องหมายขีดกลางเท่านั้น และห้ามขึ้นต้นหรือลงท้ายด้วยขีดกลาง เนื่องจากใช้เป็นส่วนหนึ่งของที่อยู่หน้าเว็บ / Use only lowercase letters, numbers and hyphens, and do not start or end with a hyphen. This becomes part of a page address.";
  }
  return true;
};

function questionParentType(context: { parent?: unknown }): QuestionTypeId | undefined {
  return (context.parent as { type?: QuestionTypeId } | undefined)?.type;
}

/** One option for `choose-one` and `choose-several`. Not itself in `questionTypeIds`: it is a sub-part of one question, not a question type. */
export const questionOption = defineType({
  name: "questionOption",
  title: "ตัวเลือก / Option",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "ค่า / Value",
      type: "string",
      description:
        "ค่าที่ระบบบันทึกเมื่อเลือกตัวเลือกนี้ ไม่แสดงต่อผู้อ่าน / The value recorded when this option is chosen. Not shown to the reader.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "ป้ายกำกับ / Label",
      type: "localizedString",
      description: "ข้อความที่ผู้อ่านเห็นสำหรับตัวเลือกนี้ / The text a reader sees for this option.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label.en", subtitle: "value" },
  },
});

export const question = defineType({
  name: "question",
  title: "คำถาม / Question",
  type: "object",
  description:
    "หนึ่งคำถามในบริการ หนึ่งเรื่องต่อหนึ่งหน้า เลือกประเภทจากรายการที่กำหนดไว้แล้วเขียนคำถามเอง เจ้าหน้าที่ไม่สามารถกำหนดชนิดฟิลด์ใหม่ได้ ประเภทคำถามใหม่คืองานของนักพัฒนา (§6.12) / One question in a service, one thing per page. Pick a type from the fixed list and write the wording yourself. You cannot define a new kind of field: a new question type is a developer's job.",
  fields: [
    defineField({
      name: "id",
      title: "รหัสคำถาม / Question id",
      type: "string",
      description:
        "คีย์ที่คงที่ กลายเป็นส่วนหนึ่งของที่อยู่หน้าเว็บ (/do/<บริการ>/<รหัส>) และชื่อฟิลด์ในฉบับร่าง เปลี่ยนภายหลังจะทำให้ลิงก์เดิมเสีย / Stable key. Becomes part of the page address (/do/<service>/<id>) and the draft field name. Changing it later breaks the old link.",
      validation: (Rule) => Rule.required().custom(idValidator),
    }),
    defineField({
      name: "type",
      title: "ประเภทคำถาม / Question type",
      type: "string",
      description:
        "เลือกจากสิบเอ็ดประเภทที่เว็บไซต์นี้รองรับเท่านั้น รายการนี้คือทั้งหมด ไม่มีประเภทอื่น / Choose from the eleven types this site supports. This is the whole list, nothing else exists.",
      options: { list: questionTypeOptions },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "คำถาม / Label",
      type: "localizedString",
      description: "ข้อความคำถามที่ผู้อ่านจะเห็น / The question text a reader sees.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hint",
      title: "คำแนะนำเพิ่มเติม / Hint",
      type: "localizedString",
      description:
        "ข้อความเสริมใต้คำถาม ไม่ใช่สิ่งทดแทนคำถามที่ชัดเจน (ไม่บังคับ) / Optional text below the label. Never a substitute for a clear label.",
    }),
    defineField({
      name: "required",
      title: "บังคับตอบ / Required",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "options",
      title: "ตัวเลือก / Options",
      type: "array",
      of: [defineArrayMember({ type: "questionOption" })],
      description:
        'ใช้กับประเภท "เลือกหนึ่งตัวเลือก" และ "เลือกได้หลายตัวเลือก" เท่านั้น ต้องมีอย่างน้อยสองตัวเลือก / Only for "choose one" and "choose several". At least two options.',
      hidden: ({ parent }) => {
        const type = questionParentType({ parent });
        return type !== "choose-one" && type !== "choose-several";
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const type = questionParentType(context);
          const needsOptions = type === "choose-one" || type === "choose-several";
          if (!needsOptions) return true;
          const options = (value as unknown[] | undefined) ?? [];
          if (options.length < 2) {
            return "ต้องมีอย่างน้อยสองตัวเลือกสำหรับคำถามประเภทนี้ / Give this question at least two options.";
          }
          return true;
        }),
    }),
    defineField({
      name: "maxLength",
      title: "ความยาวสูงสุด / Max length",
      type: "number",
      description:
        'ใช้กับประเภท "ข้อความสั้น" และ "ข้อความยาว" เท่านั้น (ไม่บังคับ) / Only for "short text" and "long text". Optional.',
      hidden: ({ parent }) => {
        const type = questionParentType({ parent });
        return type !== "short-text" && type !== "long-text";
      },
      validation: (Rule) => Rule.positive().integer(),
    }),
  ],
  preview: {
    select: { title: "label.en", subtitle: "type" },
  },
});
