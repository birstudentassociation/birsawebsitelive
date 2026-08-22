/**
 * A committee member document (REDESIGN-2.0 §6.3, §4.7C).
 *
 * This is the personal data line drawn in code. §6.3 says a committee member
 * document may hold what a PUBLIC ROSTER already publishes: the role, the
 * portfolio, a name, a portrait, a role email. It holds nothing else, because
 * nothing else about a person is public by virtue of them holding the role.
 *
 * Deliberately absent, and this is not an oversight: a personal phone number,
 * a personal email address, a student id, a home address, a date of birth.
 * `tests/unit/sanity-schema-organisational.test.ts` asserts their absence by
 * field name, which is a floor and not a proof (a field can hold anything an
 * officer types into it), so the field list here is the real control.
 *
 * The portrait uses Wave 3B's `imageField` object, which is the same
 * bilingual-alt-text, decorative-flag contract every image on the site
 * carries (`components/bds/imageContract.ts`, frozen). No consent field, no
 * consent date, no guardian field lives here or anywhere else in this
 * cluster: DECISIONS-2.0.md's gate 3 entry is explicit that the consent
 * record per photo lives outside the CMS, in Postgres behind the officer
 * console, where the rest of BIRSA's operational and personal data already
 * lives. See this agent's report for where the link between a portrait and
 * its consent record should live.
 */
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";
import { localizedString } from "@/sanity/schemaTypes/objects/localizedString";
import { imageField } from "@/sanity/schemaTypes/objects/imageField";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";

/** Mirrors `content/committee.ts`'s `CommitteeGroup`, not re-exported from it: that file is a
 * separate, git-authored fixture this schema replaces for editing purposes, not a contract
 * this schema depends on. */
export const committeeMemberGroups = ["officer", "assistant"] as const;

export type CommitteeMemberGroup = (typeof committeeMemberGroups)[number];

/** Loosely typed: this schema only reads the English half of a `localizedString` value to build
 * a slug, and does not depend on the rest of Wave 3B's internal shape for that object. */
type LocalizedStringDraft = { en?: string; th?: string } | undefined;

export const committeeMember = defineType({
  name: "committeeMember",
  title: "กรรมการ / Committee member",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "รหัสอ้างอิง / Identifier",
      description:
        "รหัสภาษาอังกฤษสั้น ๆ แบบ kebab-case เช่น jane-doe ใช้ร่วมกันทั้งสองภาษาและใช้จับคู่กับไฟล์ภาพประจำตัว / " +
        "A short English key for this member, kebab-case, for example jane-doe. Shared across both locales and used to match this record to a portrait file.",
      type: "slug",
      options: {
        // `SlugSourceFn` receives a full `SanityDocument`, which has no
        // properties in common with this document's own draft shape. Narrow
        // inside the function rather than typing the parameter narrowly, so
        // the signature stays honest about what Sanity actually calls this
        // with.
        source: (doc: SanityDocument) => {
          const { firstName, lastName } = doc as {
            firstName?: LocalizedStringDraft;
            lastName?: LocalizedStringDraft;
          };
          return `${firstName?.en ?? ""} ${lastName?.en ?? ""}`;
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "firstName",
      title: "ชื่อจริง / First name",
      description:
        "ชื่อจริงของกรรมการ ตามที่ต้องการให้แสดงต่อสาธารณะบนหน้ารายชื่อ / " +
        "The member's first name, as it should appear publicly on the roster.",
      type: localizedString.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastName",
      title: "นามสกุล / Last name",
      description:
        "นามสกุลของกรรมการ ตามที่ต้องการให้แสดงต่อสาธารณะบนหน้ารายชื่อ / " +
        "The member's last name, as it should appear publicly on the roster.",
      type: localizedString.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nickname",
      title: "ชื่อเล่น / Nickname",
      description:
        "ชื่อเล่นที่นักศึกษาส่วนใหญ่รู้จัก จะแสดงในวงเล็บบนหน้ารายชื่อ / " +
        "The name most students actually know this officer by, shown in brackets on the roster.",
      type: localizedString.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "ตำแหน่ง / Role title",
      description:
        "ตำแหน่งในคณะกรรมการที่กรรมการท่านนี้ดำรงอยู่ เช่น เลขานุการ คนที่ 1 หรือ อนุกรรมการฝ่ายกีฬา ข้อมูลนี้เป็นข้อมูลสาธารณะโดยธรรมชาติของการมีรายชื่อกรรมการ และต้องกรอกก่อนเผยแพร่ / " +
        "The committee title this member holds, for example Secretary 1 or Assistant Officer, Sport Coordination. This is public information: it is the reason a roster exists at all. A member cannot be published without this field.",
      type: localizedString.name,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "group",
      title: "กลุ่มกรรมการ / Committee group",
      description:
        "กรรมการสโมสรหรืออนุกรรมการ เพื่อจัดกลุ่มบนหน้ารายชื่อตามที่ BIRSA ใช้อยู่แล้ว / " +
        "Officer or assistant officer, so the roster groups members the way BIRSA already does.",
      type: "string",
      options: {
        list: committeeMemberGroups.map((value) => ({ title: value, value })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "portfolio",
      title: "ฝ่ายงาน / Portfolio",
      description:
        "ฝ่ายงานที่ตำแหน่งนี้สังกัดอยู่ โปรดเลือกจากเอกสารฝ่ายงานแทนการพิมพ์ชื่อเอง เพื่อให้หน้ารายชื่อ ทะเบียนสิทธิ์การเข้าถึง และสคีมานี้ตรงกันเสมอ และต้องกรอกก่อนเผยแพร่ / " +
        "The standing portfolio this role belongs to. Reference the portfolio document rather than typing a name, so the roster, the access register and this schema always agree on what a portfolio is. A member cannot be published without this field.",
      type: "reference",
      to: [{ type: "portfolio" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "roleEmail",
      title: "อีเมลประจำตำแหน่ง / Role email",
      description:
        "อีเมลกลางประจำตำแหน่งนี้เท่านั้น เช่น อีเมลของฝ่ายงาน ห้ามใส่อีเมลส่วนตัวโดยเด็ดขาด และหากตำแหน่งนี้ไม่มีอีเมลกลางให้เว้นว่างไว้ / " +
        "A shared or role inbox for this position only, for example the portfolio's own address. Never a personal email address, and leave this empty if the role has no dedicated inbox.",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          const email = String(value).trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "ข้อความนี้ไม่ใช่รูปแบบอีเมลที่ถูกต้อง / This does not look like an email address.";
          }
          return true;
        }),
    }),
    defineField({
      name: "portrait",
      title: "ภาพประจำตัว / Portrait",
      description:
        "ไม่บังคับ ภาพถ่ายของกรรมการท่านนี้สำหรับหน้ารายชื่อและหน้าบทบาทหน้าที่ BIRSA จะเผยแพร่ภาพที่ระบุตัวบุคคลได้ก็ต่อเมื่อมีการให้ความยินยอมเป็นลายลักษณ์อักษรซึ่งบันทึกไว้นอกระบบนี้เท่านั้น ห้ามเพิ่มช่องความยินยอมหรือผู้ปกครองไว้ในระบบนี้ / " +
        "Optional. A photograph of this member for the roster and role pages. BIRSA may only publish a photograph that identifies someone with written consent recorded outside this system (DECISIONS-2.0.md gate 3); the consent record itself is never entered here, and this field never grows a consent or guardian field.",
      type: imageField.name,
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
      firstNameEn: "firstName.en",
      lastNameEn: "lastName.en",
      roleEn: "role.en",
      media: "portrait",
    },
    prepare({ firstNameEn, lastNameEn, roleEn, media }) {
      const name = [firstNameEn, lastNameEn].filter(Boolean).join(" ");
      return {
        title: name || "Untitled member",
        subtitle: roleEn,
        media,
      };
    },
  },
});
