/**
 * The navigation singleton (REDESIGN-2.0 §3.3, §6.4, §6.6).
 *
 * "An editable site whose navigation is not editable is not an editable
 * site." `components/bds/Header.tsx` and `components/bds/Footer.tsx` (Wave
 * 2, frozen to this wave) already take their link groups as a typed PROP
 * with a hardcoded default, documented in both files as the seam the CMS
 * fills: "Whoever wires the CMS replaces the default value passed to `nav`,
 * not this component, and not its rendering." This document is that seam's
 * source. It is a SINGLETON: exactly one `navigation` document exists, never
 * a list of them, enforced by `sanity/structure/index.ts` pinning it to a
 * single fixed document id rather than offering a create action.
 *
 * THE SHAPE MUST MATCH EXACTLY. `navLink` below reproduces `NavLink` from
 * `Header.tsx` field for field (`href: string`, `label: { th, en }`), and
 * `footerNavGroup` reproduces `FooterNavGroup` from `Footer.tsx`
 * (`id: string`, `title: { th, en }`, `links: NavLink[]`). A future loader
 * reading this document needs no reshaping before passing the result
 * straight into `nav={...}` and `groups={...}`.
 *
 * THE FOOTER UTILITY ROW IS DELIBERATELY NOT HERE. `Footer.tsx`'s own header
 * says the bottom row (accessibility, standards, privacy, cookies,
 * emergency) "stays hardcoded" because officers "must not be able to remove
 * the accessibility statement or the privacy notice from every page's
 * footer, which is what an editable document there would allow"
 * (`docs/ROUTE-MAP-2.0.md`: those five are fixed utility routes, "never nav
 * items"). This schema has no field for them, on purpose, and
 * `tests/unit/sanity-schema-config.test.ts` asserts their absence by name.
 *
 * A KNOWN GAP, REPORTED RATHER THAN SILENTLY SKIPPED. §3.3 says "a nav item
 * can only point at a published document or at a route the application
 * actually serves. The schema validates the target, so an officer cannot
 * publish a menu item that 404s." Checking a target against the real set of
 * published documents and served routes needs a live query against both the
 * dataset and the route table, neither of which this schema can reach
 * offline (this wave must be verifiable without a live Sanity connection).
 * `href` below is validated as a well formed internal path (starts with
 * `/`), which catches a typo that is not even a plausible path; it does NOT
 * catch a well formed path to a document nobody published. That check
 * belongs to whichever wave builds the route registry this schema can query
 * against, and this file's report names the gap so it is not lost.
 */
import { defineArrayMember, defineField, defineType } from "sanity";

import type { NavLink } from "@/components/bds/Header";
import type { FooterNavGroup } from "@/components/bds/Footer";

/** Matches `NavLink` (`components/bds/Header.tsx`) exactly: `{ href, label: { th, en } }`. */
export const navLink = defineType({
  name: "navLink",
  title: "ลิงก์เมนู / Nav link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "ที่อยู่หน้าเว็บ / Path",
      type: "string",
      description:
        'เส้นทางภายในเว็บไซต์ เช่น "/do" หรือ "/whats-on/news" ไม่ต้องใส่รหัสภาษานำหน้า ระบบจะเติมให้อัตโนมัติ / An internal path, e.g. "/do" or "/whats-on/news". Do not prefix a locale segment; that is added automatically.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value !== "string" || !value.startsWith("/")) {
            return 'ที่อยู่ต้องขึ้นต้นด้วยเครื่องหมาย "/" / The path must start with "/".';
          }
          return true;
        }),
    }),
    defineField({
      name: "label",
      title: "ป้ายกำกับ / Label",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label.en", subtitle: "href" },
  },
});

/** Matches `FooterNavGroup` (`components/bds/Footer.tsx`) exactly: `{ id, title: { th, en }, links: NavLink[] }`. */
export const footerNavGroup = defineType({
  name: "footerNavGroup",
  title: "กลุ่มลิงก์ท้ายเว็บไซต์ / Footer link group",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "รหัสกลุ่ม / Group id",
      type: "string",
      description: "คีย์ที่คงที่สำหรับกลุ่มนี้ / A stable key for this group.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "หัวข้อกลุ่ม / Group title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      title: "ลิงก์ในกลุ่ม / Links in this group",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title.en" },
  },
});

export const navigation = defineType({
  name: "navigation",
  title: "เมนูนำทาง / Navigation",
  type: "document",
  description:
    "เมนูหลักและกลุ่มลิงก์ท้ายเว็บไซต์ มีเอกสารนี้เพียงฉบับเดียวเสมอ การเปลี่ยนแปลงต้องมีผู้อนุมัติสองคน / The primary menu and the footer link groups. Exactly one of this document exists. A change here requires a second approver.",
  fields: [
    defineField({
      name: "lifecycle",
      title: "วงจรเอกสาร / Lifecycle",
      type: "lifecycle",
    }),
    defineField({
      name: "primaryNav",
      title: "เมนูหลัก / Primary navigation",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      description:
        "รายการเมนูบนสุดของเว็บไซต์ (§3.2) ตามค่าเริ่มต้นคือห้ารายการปลายทางหลัก / The site's top level menu (§3.2). The default is the five primary destinations.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "footerGroups",
      title: "กลุ่มลิงก์ท้ายเว็บไซต์ / Footer link groups",
      type: "array",
      of: [defineArrayMember({ type: "footerNavGroup" })],
      description:
        "คอลัมน์ลิงก์ในท้ายเว็บไซต์ แถวล่างสุด (การเข้าถึง มาตรฐาน ความเป็นส่วนตัว คุกกี้ ภาวะฉุกเฉิน) ไม่อยู่ในนี้และแก้ไขไม่ได้เสมอ / The link columns in the footer. The bottom utility row (accessibility, standards, privacy, cookies, emergency) is not here and is never editable.",
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "primaryNav.0.label.en" },
    prepare({ title }) {
      return { title: title ? `เมนูนำทาง / Navigation (${title}…)` : "เมนูนำทาง / Navigation" };
    },
  },
});

/**
 * Reads a `navigation` document's `primaryNav` back into the exact shape
 * `Header`'s `nav` prop accepts. A future loader (not this wave: reading
 * live Sanity content is a later wave's job) calls this rather than
 * reshaping the query result by hand at every call site.
 */
export function toHeaderNav(doc: { primaryNav?: NavLink[] }): NavLink[] {
  return doc.primaryNav ?? [];
}

/** The same, for `Footer`'s `groups` prop. */
export function toFooterGroups(doc: { footerGroups?: FooterNavGroup[] }): FooterNavGroup[] {
  return doc.footerGroups ?? [];
}
