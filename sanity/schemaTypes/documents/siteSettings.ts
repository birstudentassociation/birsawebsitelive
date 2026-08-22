/**
 * The site settings singleton (REDESIGN-2.0 §6.6, §4.5).
 *
 * "Configuration without a dashboard." Everything an officer might
 * reasonably need to change without a developer, and without waking IT,
 * lives here rather than in code: `§6.6` names feature flags per module,
 * contact routing per category, homepage section order, sign-ups open or
 * closed, service standards, the phase banner text and state, opening
 * hours, term dates, and the sitewide contact details. Exactly one
 * `siteSettings` document exists, enforced the same way `navigation` is
 * (`sanity/structure/index.ts` pins it to a fixed document id rather than
 * offering a create action).
 *
 * THE PHASE BANNER (§4.5). "A 2.0 should ship each rebuilt area behind a
 * beta phase banner with a feedback link, then remove the banner when the
 * area is trusted... The banner's text and its on/off state are editable
 * (6.6), so removing it does not need a developer." `phaseBanner.enabled`
 * is that on/off switch.
 *
 * EMERGENCY MODE IS DELIBERATELY ABSENT FROM THIS DOCUMENT, EVEN THOUGH
 * THIS WAVE'S BRIEF NAMES "the emergency banner" AS BELONGING HERE. §6.6
 * itself says the opposite, in as many words: "Emergency mode stays in
 * Vercel Edge Config. It is the one thing that must work when the
 * application and the database are broken, and it is deliberately
 * independent of both... Officers never see Edge Config; they see a page
 * on their own site with a confirm dialog", meaning the console
 * (`/officer/emergency`, `docs/ROUTE-MAP-2.0.md` Wave 4C), not the Studio.
 * `lib/emergency.ts` (frozen to this wave, read only) confirms the
 * mechanism: Edge Config plus a cache tag, with no Sanity document in the
 * path anywhere. Putting an emergency toggle in Sanity would mean the one
 * banner that has to work when Sanity itself might be the thing broken
 * depends on Sanity, which is exactly backwards. This is a real conflict
 * between this wave's own brief and the frozen source document it
 * instructs following, resolved here in the frozen document's favour and
 * reported for the orchestrator to reconcile the brief's wording.
 *
 * WHAT IS HERE INSTEAD, AND WHY EACH ONE IS A FIELD RATHER THAN A GUESS.
 * Every field below names a real §6.6 item and nothing beyond it: no
 * invented BIRSA fact is stored as a schema DEFAULT (a schema has no
 * content of its own to be wrong about, only shape), and every field is
 * either a plain toggle, a portfolio reference, or bilingual free text an
 * officer writes, never a hardcoded institutional claim.
 */
import { defineArrayMember, defineField, defineType } from "sanity";

import { portfolios } from "@/lib/portfolios";

const PORTFOLIO_OPTIONS = portfolios.map((portfolio) => ({
  title: `${portfolio.label.th} / ${portfolio.label.en}`,
  value: portfolio.id,
}));

/** A labelled bilingual value, reused for opening hours, term dates and service standards: they are all "a label, and what it currently is". */
export const labelledValue = defineType({
  name: "labelledValue",
  title: "รายการป้ายกำกับและค่า / Labelled value",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "ป้ายกำกับ / Label",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "ค่า / Value",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label.en", subtitle: "value.en" },
  },
});

/** One row of "if you write to us about X, it goes to portfolio Y" (§6.6, "contact routing per category"). */
export const contactRoute = defineType({
  name: "contactRoute",
  title: "เส้นทางการติดต่อ / Contact route",
  type: "object",
  fields: [
    defineField({
      name: "category",
      title: "หมวดหมู่ / Category",
      type: "localizedString",
      description:
        "หัวข้อที่ผู้อ่านเลือกในแบบฟอร์มติดต่อ / The subject a reader picks on the contact form.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "portfolio",
      title: "ฝ่ายที่รับผิดชอบ / Routed to",
      type: "string",
      options: { list: PORTFOLIO_OPTIONS },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "category.en", subtitle: "portfolio" },
  },
});

/** One feature flag (§6.6, "feature flags per module"). An officer switches an existing module on or off; adding a new module to switch is code (§6.12). */
export const featureFlag = defineType({
  name: "featureFlag",
  title: "สวิตช์ฟีเจอร์ / Feature flag",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "รหัสโมดูล / Module id",
      type: "string",
      description:
        "รหัสคงที่ของโมดูลนี้ กำหนดโดยนักพัฒนาเมื่อสร้างโมดูล / The module's stable id, set by a developer when the module is built.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "ชื่อที่แสดงใน Studio / Label shown in the Studio",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "เปิดใช้งาน / Enabled",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label.en", subtitle: "id" },
  },
});

const HOMEPAGE_SECTION_IDS = ["hero", "top-tasks", "whats-on", "status"] as const;

const HOMEPAGE_SECTION_TITLES: Record<(typeof HOMEPAGE_SECTION_IDS)[number], string> = {
  hero: "ส่วนหัว / Hero",
  "top-tasks": "งานที่ทำบ่อย / Top tasks",
  "whats-on": "ข่าวและกิจกรรม / What's on",
  status: "สถานะฉุกเฉินและบริการ / Emergency and service status",
};

export const siteSettings = defineType({
  name: "siteSettings",
  title: "ตั้งค่าเว็บไซต์ / Site settings",
  type: "document",
  description:
    "การตั้งค่าที่เจ้าหน้าที่ต้องเปลี่ยนได้เองโดยไม่ต้องพึ่งนักพัฒนา มีเอกสารนี้เพียงฉบับเดียวเสมอ / Configuration an officer must be able to change without a developer. Exactly one of this document exists.",
  fields: [
    defineField({
      name: "lifecycle",
      title: "วงจรเอกสาร / Lifecycle",
      type: "lifecycle",
    }),
    defineField({
      name: "phaseBanner",
      title: "แถบแจ้งช่วงทดลอง / Phase banner",
      type: "object",
      description:
        "แถบแจ้งด้านบนของหน้าที่ยังอยู่ในช่วงทดลอง พร้อมลิงก์รับความคิดเห็น ปิดได้เองเมื่อพื้นที่นั้นเชื่อถือได้แล้วโดยไม่ต้องพึ่งนักพัฒนา (§4.5) / The banner on a page still in beta, with a feedback link. Switch it off yourself once that area is trusted, no developer needed (§4.5).",
      fields: [
        defineField({
          name: "enabled",
          title: "แสดงแถบนี้ / Show this banner",
          type: "boolean",
          initialValue: false,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "message",
          title: "ข้อความ / Message",
          type: "localizedString",
        }),
        defineField({
          name: "feedbackHref",
          title: "ลิงก์รับความคิดเห็น / Feedback link",
          type: "string",
          description:
            'เส้นทางภายในเว็บไซต์ เช่น "/feedback" (ไม่บังคับ) / An internal path, e.g. "/feedback". Optional.',
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "ข้อมูลติดต่อของเว็บไซต์ / Sitewide contact details",
      type: "object",
      description: "ใช้แสดงในท้ายเว็บไซต์และหน้าติดต่อ / Shown in the footer and the contact page.",
      fields: [
        defineField({
          name: "email",
          title: "อีเมลหลัก / Primary email",
          type: "string",
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: "secondaryEmail",
          title: "อีเมลสำรอง / Secondary email",
          type: "string",
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: "phone",
          title: "เบอร์โทรศัพท์ / Phone",
          type: "string",
        }),
        defineField({
          name: "address",
          title: "ที่อยู่ / Address",
          type: "localizedString",
        }),
      ],
    }),
    defineField({
      name: "serviceStandards",
      title: "มาตรฐานการให้บริการ / Service standards",
      type: "array",
      of: [defineArrayMember({ type: "labelledValue" })],
      description:
        "คำมั่นระยะเวลาการให้บริการทั่วไป เช่น การตอบกลับข้อความ ไม่ใช่ระยะเวลาของบริการรายบุคคล ซึ่งกำหนดในเอกสารบริการนั้นเอง / General service commitments, e.g. replying to a message. Not a single service's own standard, which is set on that service's own document.",
    }),
    defineField({
      name: "openingHours",
      title: "เวลาทำการ / Opening hours",
      type: "array",
      of: [defineArrayMember({ type: "labelledValue" })],
    }),
    defineField({
      name: "termDates",
      title: "กำหนดการภาคการศึกษา / Term dates",
      type: "array",
      of: [defineArrayMember({ type: "labelledValue" })],
    }),
    defineField({
      name: "signUpsOpen",
      title: "เปิดรับสมัคร / Sign-ups open",
      type: "boolean",
      initialValue: true,
      description:
        "สวิตช์รวมสำหรับเปิดหรือปิดรับสมัครกิจกรรมและชมรม / The overall switch for whether activity and club sign-ups are open.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "homepageSectionOrder",
      title: "ลำดับส่วนหน้าแรก / Homepage section order",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: HOMEPAGE_SECTION_IDS.map((id) => ({
              title: HOMEPAGE_SECTION_TITLES[id],
              value: id,
            })),
          },
        }),
      ],
      description:
        "ลำดับที่ส่วนต่าง ๆ ปรากฏในหน้าแรก สูงสุดสี่ส่วนตามที่ออกแบบไว้ (§8.2) / The order these blocks appear on the home page. At most the four blocks the design allows (§8.2).",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "contactRouting",
      title: "เส้นทางการติดต่อ / Contact routing",
      type: "array",
      of: [defineArrayMember({ type: "contactRoute" })],
      description:
        "หมวดหมู่ในแบบฟอร์มติดต่อ และฝ่ายที่รับผิดชอบแต่ละหมวดหมู่ / The categories on the contact form, and which portfolio each one reaches.",
    }),
    defineField({
      name: "featureFlags",
      title: "สวิตช์ฟีเจอร์ / Feature flags",
      type: "array",
      of: [defineArrayMember({ type: "featureFlag" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "ตั้งค่าเว็บไซต์ / Site settings" };
    },
  },
});
