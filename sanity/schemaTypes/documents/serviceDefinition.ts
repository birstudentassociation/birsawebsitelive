/**
 * A service, as an editable document (REDESIGN-2.0 §6.7, §5.1, §5.2).
 *
 * "An officer creates a service the way they create a page." This schema is
 * the CMS half of the promise `lib/services/defineService.ts` makes in its
 * own header: "the schema mirrors it, and `validateServiceDefinition` runs at
 * load in the registry and again at publish time in the Studio, so the two
 * cannot disagree." This file is that publish time enforcement.
 *
 * FIELD FOR FIELD, DELIBERATELY, NO MORE. Every field below is named and
 * shaped after `ServiceDefinition` in `lib/services/defineService.ts`
 * (FROZEN), field for field, and this document type carries NOTHING that
 * type does not have. In particular it does NOT embed Wave 3B's `lifecycle`
 * object, even though `docs/CMS-SCHEMA-CONVENTIONS.md` #2 says "every
 * document type carries the lifecycle field set". That is a deliberate,
 * reported divergence for this one type: the wave brief for this integration
 * point states the mirror requirement in so many words ("every field,
 * including... The schema mirrors `ServiceDefinition` exactly"), and a
 * `lifecycle` object would add `status`, `publishAt`, `lastReviewed`,
 * `reviewBy`, `slugHistory` and `maintainedBecause`, none of which
 * `ServiceDefinition` has. Sanity's own draft and published states already
 * give a service the draft or published half of that; what it loses is the
 * staleness dashboard, slug history redirects and the `archived` state,
 * which is a real gap this file's own report names for the orchestrator to
 * reconcile, not a decision quietly made and hidden.
 *
 * A NOTE ON `owner`. `ServiceDefinition.owner` and `Lifecycle.owner` mean the
 * same thing (the owning portfolio), so there is no double field here even
 * without embedding `lifecycle`: this document's own `owner` field already
 * answers "who owns this", which is what makes the deliberate omission above
 * safe rather than merely convenient.
 *
 * THE PUBLISH BLOCKING RULE. `serviceDefinitionProblems` below turns the
 * document's current field values back into a `ServiceDefinition` and calls
 * `validateServiceDefinition` (`lib/services/defineService.ts`, FROZEN)
 * directly, the SAME function the registry calls at load
 * (`lib/services/registry.ts`). The document level `validation` rule on
 * `serviceDefinition` calls this and turns every `ServiceProblem` into a
 * Studio validation marker at the matching field path, so an officer who
 * tries to publish a service that collects personal data with no privacy
 * register entry, no retention trigger, or a register entry with no
 * implemented deletion path, sees exactly that, next to the field, in both
 * languages, and cannot publish until it is fixed. This is REDESIGN-2.0
 * §5.1 item 10, the rule the whole chassis exists for.
 *
 * A KNOWN DRIFT RISK, REPORTED RATHER THAN HIDDEN. `validateServiceDefinition`
 * needs `implementedRetentionActivityIds` and `sensitiveServiceIds`, which
 * `lib/services/registry.ts` computes as its own private, unexported
 * `IMPLEMENTED_RETENTION_ACTIVITY_IDS` and `SENSITIVE_SERVICE_IDS` consts.
 * `registry.ts` is Wave 4A's file, not this wave's, and is not in this
 * wave's owned path list, so it cannot be edited here to export them.
 * `STUDIO_IMPLEMENTED_RETENTION_ACTIVITY_IDS` and
 * `STUDIO_SENSITIVE_SERVICE_IDS` below are copies of their current values,
 * current as of this wave. If `retention.ts` gains a new purge step, or a
 * service is allowlisted sensitive, and `registry.ts` is updated to match,
 * this file's copies will silently fall behind unless someone updates both.
 * The fix is a one line export change in `registry.ts` in a later wave; this
 * file's report flags it so that change actually gets made rather than the
 * drift going unnoticed, which is precisely the failure class REDESIGN-2.0
 * §5.1 item 10 exists to prevent.
 */
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  validateServiceDefinition,
  type RetentionTrigger,
  type ServiceDefinition,
  type ServiceProblem,
} from "@/lib/services/defineService";
import { portfolios, type PortfolioId } from "@/lib/portfolios";
import { activities } from "@/content/privacy/register";

const PORTFOLIO_OPTIONS = portfolios.map((portfolio) => ({
  title: `${portfolio.label.th} / ${portfolio.label.en}`,
  value: portfolio.id,
}));

const RETENTION_TRIGGER_TITLES: Record<RetentionTrigger, string> = {
  created: "เมื่อสร้างคำขอ / When the request is created",
  closed: "เมื่อปิดคำขอ / When the request closes",
  "last-active": "เมื่อมีการใช้งานล่าสุด / On last activity",
};

const RETENTION_TRIGGER_OPTIONS = (
  Object.keys(RETENTION_TRIGGER_TITLES) as RetentionTrigger[]
).map((value) => ({ title: RETENTION_TRIGGER_TITLES[value], value }));

const PRIVACY_ACTIVITY_OPTIONS = activities.map((activity) => ({
  title: `${activity.name.th} / ${activity.name.en} (${activity.id})`,
  value: activity.id,
}));

/** A fortnight in hours. Mirrors `defineService.ts`'s private `MAX_STANDARD_HOURS`: past this, "escalation" stops being a standard and becomes an apology (that file's own words). */
const MAX_STANDARD_HOURS = 24 * 14;

/** See this file's own header, "A KNOWN DRIFT RISK". Copies `lib/services/registry.ts`'s `IMPLEMENTED_RETENTION_ACTIVITY_IDS`, current as of this wave. */
const STUDIO_IMPLEMENTED_RETENTION_ACTIVITY_IDS: readonly string[] = [
  "equipment-loan",
  "borrower-record",
  "audit-log",
  "feedback",
  "officer-account",
];

/** See this file's own header, "A KNOWN DRIFT RISK". Copies `lib/services/registry.ts`'s `SENSITIVE_SERVICE_IDS`, current as of this wave (empty: no chassis service is allowlisted sensitive yet). */
const STUDIO_SENSITIVE_SERVICE_IDS: readonly string[] = [];

/**
 * Reconstructs a `ServiceDefinition` from the raw Studio document value.
 * Field names on `serviceDefinition` below match `ServiceDefinition` one for
 * one, so this is mostly a shape normalisation: Sanity omits an unset field
 * entirely rather than storing `null`, so the two nullable fields
 * (`privacyActivityId`, `retentionTrigger`) need `?? null`, and the rest pass
 * through.
 */
export function toServiceDefinition(doc: Record<string, unknown>): ServiceDefinition {
  return {
    id: (doc.id as string | undefined) ?? "",
    owner: doc.owner as PortfolioId,
    secondHolder: doc.secondHolder as PortfolioId,
    start: (doc.start ?? {}) as ServiceDefinition["start"],
    questions: ((doc.questions as ServiceDefinition["questions"] | undefined) ?? []).map(
      (q) => q
    ),
    standardHours: (doc.standardHours as number | undefined) ?? 0,
    escalateTo: doc.escalateTo as PortfolioId,
    privacyActivityId: (doc.privacyActivityId as string | undefined) ?? null,
    retentionTrigger: (doc.retentionTrigger as RetentionTrigger | undefined) ?? null,
    sensitive: Boolean(doc.sensitive),
    publishStandard: doc.publishStandard as boolean | undefined,
    subject: doc.subject as ServiceDefinition["subject"],
  };
}

/**
 * The registry's own context, rebuilt from the read only privacy register
 * import (`content/privacy/register.ts`, never edited) plus the two Studio
 * copies documented in this file's header.
 */
export function serviceDefinitionProblems(doc: Record<string, unknown>): ServiceProblem[] {
  const definition = toServiceDefinition(doc);
  return validateServiceDefinition(definition, {
    knownPrivacyActivityIds: activities.map((activity) => activity.id),
    implementedRetentionActivityIds: STUDIO_IMPLEMENTED_RETENTION_ACTIVITY_IDS,
    registerRetentionTriggers: Object.fromEntries(
      activities.map((activity) => [activity.id, activity.retentionTrigger])
    ),
    sensitiveServiceIds: STUDIO_SENSITIVE_SERVICE_IDS,
  });
}

/**
 * Converts a `ServiceProblem.field` path ("start.title", "questions[0].id",
 * "secondHolder") into the array form Sanity's validation markers use, so
 * the message lands on the field itself rather than at the top of the
 * document (`docs/CMS-SCHEMA-CONVENTIONS.md` #4, §6.5 step 3).
 */
export function fieldPathToSanityPath(field: string): Array<string | number> {
  const path: Array<string | number> = [];
  for (const part of field.split(".")) {
    const match = /^([A-Za-z0-9_]+)(?:\[(\d+)\])?$/.exec(part);
    if (!match) {
      path.push(part);
      continue;
    }
    path.push(match[1]!);
    if (match[2] !== undefined) path.push(Number(match[2]));
  }
  return path;
}

export const serviceDefinition = defineType({
  name: "serviceDefinition",
  title: "บริการ / Service",
  type: "document",
  description:
    "บริการหนึ่งรายการ ระบบสร้างหน้าเริ่มต้น คำถามทีละหน้า หน้าตรวจคำตอบ หมายเลขอ้างอิง อีเมลยืนยัน และคิวเจ้าหน้าที่ให้อัตโนมัติจากข้อมูลด้านล่าง / One service. The site builds the start page, question pages, check-answers page, reference number, acknowledgement email and officer queue automatically from what is filled in below.",
  fields: [
    defineField({
      name: "id",
      title: "รหัสบริการ (slug) / Service id (slug)",
      type: "string",
      description:
        "ใช้เป็นที่อยู่หน้าเว็บ /do/<รหัส> ใช้ตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น / Becomes the page address /do/<id>. Lowercase letters, numbers and hyphens only.",
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
          name: "url-safe",
          invert: false,
        }),
    }),
    defineField({
      name: "owner",
      title: "ฝ่ายเจ้าของบริการ / Owning portfolio",
      type: "string",
      description:
        "ฝ่ายที่ดูแลคิวคำขอและเป็นผู้รับผิดชอบบริการนี้ / The portfolio that scopes the officer queue and is responsible for this service.",
      options: { list: PORTFOLIO_OPTIONS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondHolder",
      title: "ผู้ถือครองรายที่สอง / Second holder",
      type: "string",
      description:
        "ต้องเป็นคนละฝ่ายกับเจ้าของบริการ เนื่องจากไม่มีฝ่ายใดถือครองสิ่งใดเพียงลำพัง (หลักสองคน) / Must be a different portfolio from the owner. Nobody is the only holder of anything (the two person rule).",
      options: { list: PORTFOLIO_OPTIONS },
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const owner = (context.document as { owner?: string } | undefined)?.owner;
          if (value && owner && value === owner) {
            return "ผู้ถือครองรายที่สองต้องเป็นคนละฝ่ายกับเจ้าของบริการ / The second holder must be a different portfolio from the owner.";
          }
          return true;
        }),
    }),
    defineField({
      name: "start",
      title: "หน้าเริ่มต้น / Start page",
      type: "object",
      description:
        "ทุกฟิลด์ในหน้านี้บังคับกรอกก่อนเผยแพร่ เนื่องจากหน้าเริ่มต้นแสดงผลทุกฟิลด์โดยไม่มีข้อความสำรอง / Every field here is publish blocking: the start page renders each one with no fallback copy.",
      fields: [
        defineField({
          name: "title",
          title: "ชื่อบริการ / Title",
          type: "localizedString",
          description:
            "สิ่งที่บริการนี้ทำ เป็นงานที่ต้องทำ ไม่ใช่ชื่อฝ่ายงาน / What the service does. A job to be done, never a committee portfolio name.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "whoFor",
          title: "เหมาะสำหรับใคร / Who this is for",
          type: "localizedText",
          description: "ใครควรใช้บริการนี้ และใครไม่ควรใช้ / Who it is for, and who it is not for.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "before",
          title: "สิ่งที่ต้องเตรียม / What you need before you begin",
          type: "array",
          of: [defineArrayMember({ type: "localizedString" })],
          description: "รายการอย่างน้อยหนึ่งรายการ / At least one item.",
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: "howLong",
          title: "ใช้เวลานานเท่าใด / How long it takes",
          type: "localizedString",
          description: "ใช้เวลากรอกแบบฟอร์มนานเท่าใด / How long the form takes to fill in.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "whatNext",
          title: "ขั้นตอนต่อไป / What happens next",
          type: "localizedText",
          description:
            "สิ่งที่เกิดขึ้นหลังผู้อ่านส่งคำขอ ต้องสอดคล้องกับระยะเวลามาตรฐานด้านล่าง / What happens after the reader submits. Must agree with the service standard below.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "questions",
      title: "คำถาม / Questions",
      type: "array",
      of: [defineArrayMember({ type: "question" })],
      description:
        "หนึ่งเรื่องต่อหนึ่งหน้า ตามลำดับนี้ ต้องมีอย่างน้อยหนึ่งคำถาม และต้องมีคำถามประเภทที่อยู่อีเมลเพียงหนึ่งข้อ ซึ่งใช้เป็นผู้รับอีเมลยืนยัน / One thing per page, in this order. At least one question, and exactly one email question, which becomes the acknowledgement recipient.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "standardHours",
      title: "ระยะเวลามาตรฐาน (ชั่วโมง) / Service standard (hours)",
      type: "number",
      description:
        "ระยะเวลาที่ใช้เป็นเกณฑ์เลื่อนขั้นการแจ้งเตือน ต้องมากกว่าศูนย์ และไม่เกินสองสัปดาห์ (336 ชั่วโมง) / The threshold escalation uses. Must be greater than zero and no more than a fortnight (336 hours).",
      validation: (Rule) => Rule.required().positive().max(MAX_STANDARD_HOURS),
    }),
    defineField({
      name: "escalateTo",
      title: "แจ้งเตือนไปยัง / Escalate to",
      type: "string",
      description:
        "ฝ่ายที่ระบบแจ้งเตือนทุกวันเมื่อใกล้เกินระยะเวลามาตรฐาน / The portfolio the daily cron chases when the standard is at risk.",
      options: { list: PORTFOLIO_OPTIONS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "privacyActivityId",
      title: "กิจกรรมในทะเบียนข้อมูลส่วนบุคคล / Privacy register activity",
      type: "string",
      description:
        "บังคับกรอกหากบริการนี้เก็บข้อมูลส่วนบุคคล (เช่น มีคำถามที่อยู่อีเมล) เลือกจากทะเบียนที่มีอยู่แล้วเท่านั้น เพิ่มรายการใหม่ในทะเบียนได้โดยนักพัฒนาเท่านั้น / Required if this service collects personal data (an email question, at minimum). Choose only from the existing register. A new register entry is a developer's job.",
      options: { list: PRIVACY_ACTIVITY_OPTIONS },
    }),
    defineField({
      name: "retentionTrigger",
      title: "จุดเริ่มต้นการเก็บรักษาข้อมูล / Retention trigger",
      type: "string",
      description:
        "เมื่อใดเริ่มนับระยะเวลาการเก็บรักษาข้อมูลของคำขอในบริการนี้ ต้องตรงกับกิจกรรมในทะเบียนที่เลือกไว้ / When the retention clock starts for this service's submissions. Must match the chosen register activity's own trigger.",
      options: { list: RETENTION_TRIGGER_OPTIONS },
    }),
    defineField({
      name: "sensitive",
      title: "บริการอ่อนไหว / Sensitive service",
      type: "boolean",
      readOnly: true,
      initialValue: false,
      description:
        "แก้ไขได้โดยนักพัฒนาเท่านั้น เนื่องจากมีผลต่อการตรวจสอบ การเก็บรักษา และสิทธิ์การเข้าถึงข้อมูล เจ้าหน้าที่ไม่สามารถทำเครื่องหมายหรือยกเลิกเครื่องหมายนี้ได้ในหน้าจัดการ / Only a developer can set or unset this: it changes retention, audit and access rules. An officer cannot change it here.",
    }),
    defineField({
      name: "publishStandard",
      title: "แสดงระยะเวลามาตรฐานต่อผู้อ่าน / Show the standard to the reader",
      type: "boolean",
      description:
        "เปิดเฉพาะเมื่อ BIRSA ให้คำมั่นระยะเวลานี้จริง หากไม่แน่ใจให้เว้นว่างไว้ เนื่องจากการเว้นว่างหมายถึงยังไม่ได้ให้คำมั่นสิ่งใด ซึ่งปลอดภัยกว่าการให้คำมั่นที่ไม่มีใครเห็นด้วย (ไม่บังคับ) / Turn on only when BIRSA has actually promised this timing. Leave unset if unsure: unset means promising nothing, which is safer than promising something no committee agreed to. Optional.",
    }),
    defineField({
      name: "subject",
      title: "สิ่งที่บริการนี้อ้างอิงถึง / What this service is about",
      type: "object",
      description:
        'สำหรับบริการที่ต้องเลือกสิ่งของก่อนเริ่ม เช่น การยืมอุปกรณ์ ผู้อ่านเลือกก่อนเริ่มกรอกแบบฟอร์ม เว้นว่างไว้หากบริการนี้ไม่เกี่ยวกับสิ่งของใดสิ่งหนึ่งโดยเฉพาะ (ไม่บังคับ) / For a service about a specific thing chosen before starting, like which item to borrow. Leave empty if this service is not about any one particular thing. Optional.',
      fields: [
        defineField({
          name: "source",
          title: "ตัวแปลงข้อมูล (source) / Resolver (source)",
          type: "string",
          description:
            "ชื่อรหัสตัวแปลงข้อมูลที่นักพัฒนาลงทะเบียนไว้ (lib/services/subject.ts) เอกสารนี้ไม่สามารถอ้างอิงโมดูลโค้ดได้โดยตรง จึงระบุชื่อไว้แล้วให้โค้ดอ้างสิทธิ์ชื่อนั้น / The code id of a resolver a developer has registered (lib/services/subject.ts). A document cannot reference a code module directly, so it names it and lets code claim the name.",
        }),
        defineField({
          name: "paramName",
          title: "ชื่อส่วนของที่อยู่เว็บ / URL segment name",
          type: "string",
          description: "ชื่อส่วนของที่อยู่เว็บสำหรับมนุษย์อ่าน / The segment's name for humans reading a URL.",
        }),
        defineField({
          name: "label",
          title: "ชื่อเรียกสิ่งที่อ้างอิงถึง / What the service calls it",
          type: "localizedString",
          description: "คำที่บริการนี้ใช้เรียกสิ่งที่อ้างอิงถึง / What the service calls the thing, used where a page has to name it.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "start.title.en", subtitle: "id" },
  },
  validation: (Rule) =>
    Rule.custom((doc) => {
      if (!doc) return true;
      const problems = serviceDefinitionProblems(doc as Record<string, unknown>);
      if (problems.length === 0) return true;
      return problems.map((problem) => ({
        message: `${problem.message.th} / ${problem.message.en}`,
        path: fieldPathToSanityPath(problem.field),
      }));
    }),
});
