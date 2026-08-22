/**
 * A budget entry (REDESIGN-2.0 §10, roadmap §4F, §6.3).
 *
 * "A budget entry records money, not who spent it personally." There is
 * deliberately no field here for who requested, approved or spent anything:
 * no name, no reference to a reimbursement claim, no receipt. Those stay
 * exactly where §6.3 already puts them, in Postgres behind the officer
 * console under the existing retention path, because a reimbursement claim
 * is a student submission and this is published content.
 *
 * `owner` (in `lifecycle`, required on every document) is which portfolio
 * this entry belongs to, which is enough to answer "what did the sport
 * portfolio spend this term" without naming a person. `amount` is always
 * positive and `direction` says whether it is money in or out, rather than
 * relying on officers to remember a sign convention, so entries actually add
 * up: a free text amount field would be a filing cabinet, not transparency.
 */
import { defineField, defineType } from "sanity";
import { localizedString } from "@/sanity/schemaTypes/objects/localizedString";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";

export const budgetEntryDirections = ["income", "expense"] as const;

export type BudgetEntryDirection = (typeof budgetEntryDirections)[number];

export const budgetEntry = defineType({
  name: "budgetEntry",
  title: "Budget entry / รายการงบประมาณ",
  type: "document",
  fields: [
    defineField({
      name: "description",
      title: "Description / รายละเอียด",
      description:
        "What this money is for, in plain language, for example catering for freshers orientation.\n\n" +
        "รายการนี้เกี่ยวกับอะไร เขียนด้วยภาษาที่เข้าใจง่าย เช่น ค่าอาหารในกิจกรรมต้อนรับนักศึกษาใหม่",
      type: localizedString.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Amount, THB / จำนวนเงิน (บาท)",
      description:
        "The amount in Thai baht, always a positive number. Whether it is money in or out is set by Direction below.\n\n" +
        "จำนวนเงินเป็นบาท ระบุเป็นจำนวนบวกเสมอ ส่วนที่ว่าเป็นเงินเข้าหรือเงินออกให้เลือกที่ช่องทิศทางด้านล่าง",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "direction",
      title: "Direction / ทิศทาง",
      description:
        "Whether this entry is money coming in or money going out. Required so entries can be added up correctly.\n\n" +
        "รายการนี้เป็นเงินเข้าหรือเงินออก จำเป็นต้องระบุเพื่อให้รวมยอดได้ถูกต้อง",
      type: "string",
      options: {
        list: budgetEntryDirections.map((value) => ({ title: value, value })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entryDate",
      title: "Date / วันที่",
      description: "The date this entry falls on, for comparing spending over time.\n\nวันที่ของรายการนี้ เพื่อใช้เปรียบเทียบการใช้จ่ายในแต่ละช่วงเวลา",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meeting",
      title: "Meeting / การประชุม",
      description:
        "Optional. The minutes of the meeting this entry was approved at, where there was one.\n\nไม่บังคับ รายงานการประชุมที่อนุมัติรายการนี้ หากมี",
      type: "reference",
      to: [{ type: "minutes" }],
    }),
    defineField({
      name: "lifecycle",
      title: "Publishing status / สถานะการเผยแพร่",
      description:
        "Status, owner portfolio, review date and the rest of the fields every document on this site carries. The owner portfolio is which portfolio this entry belongs to. Budget entries require a second approver before publishing (lib/content/lifecycle.ts).\n\n" +
        "สถานะ ฝ่ายงานเจ้าของ วันตรวจสอบ และฟิลด์อื่น ๆ ที่ทุกเอกสารบนเว็บไซต์นี้มีร่วมกัน ฝ่ายงานเจ้าของคือฝ่ายงานที่รายการนี้เกี่ยวข้อง รายการงบประมาณต้องมีผู้อนุมัติคนที่สองก่อนเผยแพร่",
      type: lifecycle.name,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { description: "description.en", amount: "amount", direction: "direction" },
    prepare({ description, amount, direction }) {
      return {
        title: description ?? "Untitled entry",
        subtitle: amount !== undefined ? `${direction ?? ""} ${amount}` : undefined,
      };
    },
  },
});
