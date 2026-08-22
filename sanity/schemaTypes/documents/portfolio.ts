/**
 * A portfolio document (REDESIGN-2.0 §7.2, §6.3).
 *
 * `lib/portfolios.ts` is FROZEN and carries `PortfolioId`, the closed
 * vocabulary of BIRSA's standing jobs. This document references those ids
 * rather than inventing free text names, so the console, the access register
 * and the CMS cannot disagree about what a portfolio is.
 *
 * §7.2, the two person rule, made operational: nobody is the only holder of
 * anything. `holder` and `secondHolder` are both required references to
 * `committeeMember`, and a portfolio cannot publish holding only one person.
 * `additionalHolders` exists because some portfolios genuinely have three
 * role holders (secretariat, for one), not because two is a minimum to relax.
 *
 * No new personal data here: a holder is a reference to a committee member
 * document, never a name typed by hand, so this document cannot become a
 * second place a person's details live.
 */
import { defineField, defineType } from "sanity";
import { portfolioIds } from "@/lib/portfolios";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";

export const portfolio = defineType({
  name: "portfolio",
  title: "ฝ่ายงาน / Portfolio",
  type: "document",
  fields: [
    defineField({
      name: "portfolioId",
      title: "ฝ่ายงาน / Portfolio",
      description:
        "ฝ่ายงานใดของ BIRSA เลือกจากรายการที่กำหนดไว้ตายตัวใน lib/portfolios.ts เท่านั้น ห้ามพิมพ์เอง เพื่อไม่ให้เอกสารนี้อ้างถึงฝ่ายงานที่ไม่มีอยู่จริง / " +
        "Which of BIRSA's standing portfolios this is. Chosen from the fixed list in lib/portfolios.ts, never typed freely, so this document can never name a portfolio that does not exist.",
      type: "string",
      options: {
        list: portfolioIds.map((value) => ({ title: value, value })),
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          return (portfolioIds as readonly string[]).includes(value)
            ? true
            : "ไม่ใช่รหัสฝ่ายงานจริงจาก lib/portfolios.ts / Not a real portfolio id from lib/portfolios.ts";
        }),
    }),
    defineField({
      name: "holder",
      title: "ผู้ดำรงตำแหน่งคนที่หนึ่ง / Holder",
      description:
        "กรรมการคนแรกที่ดำรงตำแหน่งในฝ่ายงานนี้ เอกสารฝ่ายงานจะเผยแพร่ไม่ได้หากไม่มีข้อมูลนี้ เนื่องจากไม่มีฝ่ายงานใดที่มีผู้ดำรงตำแหน่งเพียงคนเดียว (REDESIGN-2.0 §7.2) / " +
        "The first committee member who holds this portfolio. A portfolio cannot publish without this field, because nobody is the only holder of anything.",
      type: "reference",
      to: [{ type: "committeeMember" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondHolder",
      title: "ผู้ดำรงตำแหน่งคนที่สอง / Second holder",
      description:
        "กรรมการอีกคนหนึ่งที่ดำรงตำแหน่งในฝ่ายงานนี้ร่วมกัน จำเป็นต้องกรอกและต้องเป็นคนละคนกับผู้ดำรงตำแหน่งคนแรก ตามกฎสองคนของ BIRSA มิใช่ทางเลือก (REDESIGN-2.0 §7.2) / " +
        "A second, different committee member who also holds this portfolio. Required, and it must be a different person from the first holder: this is the two person rule, not a suggestion.",
      type: "reference",
      to: [{ type: "committeeMember" }],
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          if (!value) return true;
          const holder = (context.document as { holder?: { _ref?: string } } | undefined)?.holder;
          if (holder?._ref && value._ref === holder._ref) {
            return "ผู้ดำรงตำแหน่งคนที่สองต้องเป็นคนละคนกับคนแรก / The second holder must be a different person from the first holder.";
          }
          return true;
        }),
    }),
    defineField({
      name: "additionalHolders",
      title: "ผู้ดำรงตำแหน่งเพิ่มเติม / Additional holders",
      description:
        "กรรมการท่านอื่นที่ดำรงตำแหน่งในฝ่ายงานนี้ร่วมด้วย นอกเหนือจากสองคนแรก ฝ่ายงานส่วนใหญ่ไม่ต้องกรอกช่องนี้ แต่บางฝ่าย เช่น ฝ่ายเลขานุการ มีผู้ดำรงตำแหน่งคนที่สามจริง ๆ / " +
        "Any further committee members who also hold this portfolio, beyond the first two. Most portfolios leave this empty; some, like the secretariat, genuinely have a third role holder.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "committeeMember" }] }],
    }),
    defineField({
      name: "lifecycle",
      title: "สถานะการเผยแพร่ / Publishing status",
      description:
        "สถานะ ฝ่ายงานเจ้าของ วันตรวจสอบ และฟิลด์อื่น ๆ ที่ทุกเอกสารบนเว็บไซต์นี้มีร่วมกัน / " +
        "Status, owner portfolio, review date and the rest of the fields every document on this site carries.",
      type: lifecycle.name,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      portfolioId: "portfolioId",
      holderFirstName: "holder.firstName.en",
      holderLastName: "holder.lastName.en",
    },
    prepare({ portfolioId, holderFirstName, holderLastName }) {
      const holderName = [holderFirstName, holderLastName].filter(Boolean).join(" ");
      return {
        title: portfolioId ?? "Untitled portfolio",
        subtitle: holderName || undefined,
      };
    },
  },
});
