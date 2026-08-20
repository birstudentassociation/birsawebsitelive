/**
 * THE ONE EXAMPLE DEFINITION (BUILD-BRIEF-2.0, Wave 4A brief item 2).
 *
 * THIS IS NOT A REAL BIRSA SERVICE. Do not link to it from navigation, do not
 * treat its copy as a real commitment, and do not use its portfolio pairing,
 * its service standard or its escalation target as evidence of what BIRSA has
 * actually decided. It exists to prove the chassis works and to be read
 * alongside `lib/services/registry.ts` and `tests/unit/service-chassis.test.ts`
 * as a worked example of a `ServiceDefinition`.
 *
 * IT IS DELIBERATELY INVALID, AND THAT IS THE POINT. `lib/services/defineService.ts`
 * rule 4 requires exactly one `email` question (it is the acknowledgement
 * recipient), and every `email` question collects personal data
 * (`lib/services/questionTypes.ts`). So every publishable service, this one
 * included, is a PDPA processing activity whether or not anyone remembers to
 * say so, and rule 6 (REDESIGN-2.0 §5.1 item 10, the rule the whole chassis
 * exists for) requires `privacyActivityId` to name a `content/privacy/register.ts`
 * activity with an implemented `lib/privacy/retention.ts` path before the
 * service can publish.
 *
 * `content/privacy/register.ts` is off limits to this wave (BUILD-BRIEF-2.0
 * §8, forbidden list), so this definition cannot be given a real register
 * entry of its own, and reusing an existing one (`equipment-loan`,
 * `contact-message`, and so on) would misrepresent what that activity
 * actually collects, which is exactly the dishonesty item 10 exists to
 * prevent. So `privacyActivityId` is left `null` on purpose. The registry
 * (`lib/services/registry.ts`) runs this through `validateServiceDefinition`
 * at load, finds it invalid for exactly that reason, and refuses to serve it,
 * the same "not configured" way a half-built service degrades anywhere else
 * on the site (REDESIGN-2.0 §5.2). `/do/example-chassis-demo` therefore shows
 * the chassis's own "this service is not available" state, live, in the
 * running application, not only in a unit test. That IS the demonstration:
 * before this file can ever render a working start page, a developer has to
 * add a register entry for it (or, more usefully, for the first real service
 * built on this chassis, §5.5's lost and found) and be certain a retention
 * path exists in code first. See the Wave 4A report for this exact finding.
 *
 * Every other rule this definition satisfies cleanly (both locales complete,
 * unique URL-safe question ids, exactly one email question, a positive
 * `standardHours` under the fortnight ceiling, `owner` and `secondHolder`
 * different, `sensitive` matching the code-side allowlist), so the ONLY
 * problem `validateServiceDefinition` reports for it is the missing register
 * entry. Confirmed by `tests/unit/service-chassis.test.ts`.
 */
import type { ServiceDefinition } from "@/lib/services/defineService";

export const exampleChassisDemo: ServiceDefinition = {
  id: "example-chassis-demo",

  // Illustrative pairing only, not a real committee decision. Any two
  // different portfolios would do; these were picked because both exist in
  // `lib/portfolios.ts` and neither is the president (so the example does
  // not read as though it needed the most senior officer to matter).
  owner: "general-coordination",
  secondHolder: "rights-and-welfare",

  start: {
    title: {
      en: "Example service (demonstration only)",
      th: "บริการตัวอย่าง (สำหรับสาธิตเท่านั้น)",
    },
    whoFor: {
      en: "Nobody. This definition exists to prove the BIRSA service chassis works end to end. It is not a real BIRSA service, and it cannot currently publish (see the file header in lib/services/definitions/example-chassis-demo.ts).",
      th: "บริการนี้ไม่มีผู้ใช้จริง จัดทำขึ้นเพื่อสาธิตการทำงานของระบบบริการ BIRSA เท่านั้น ไม่ใช่บริการจริงของ BIRSA และยังไม่สามารถเผยแพร่ได้ในขณะนี้ (ดูรายละเอียดในไฟล์ lib/services/definitions/example-chassis-demo.ts)",
    },
    before: [
      {
        en: "Nothing. There is nothing to prepare for a demonstration service.",
        th: "ไม่มีสิ่งใดต้องเตรียม เนื่องจากเป็นบริการสาธิตเท่านั้น",
      },
    ],
    howLong: {
      en: "About two minutes, if it were ever published.",
      th: "ประมาณสองนาที หากมีการเผยแพร่จริงในอนาคต",
    },
    whatNext: {
      en: "Nothing happens. This service cannot accept a submission until a developer adds it to the privacy register.",
      th: "ไม่มีขั้นตอนต่อไป เนื่องจากบริการนี้ยังไม่สามารถรับคำขอได้ จนกว่าผู้พัฒนาจะเพิ่มรายการในทะเบียนข้อมูลส่วนบุคคล",
    },
  },

  questions: [
    {
      id: "name",
      type: "short-text",
      label: { en: "Your name", th: "ชื่อของคุณ" },
      required: true,
      maxLength: 120,
    },
    {
      id: "email",
      type: "email",
      label: { en: "Your email address", th: "ที่อยู่อีเมลของคุณ" },
      hint: {
        en: "We use this to acknowledge your submission and, if you check its status later, as your corroborating detail.",
        th: "ใช้เพื่อยืนยันการรับคำขอของคุณ และใช้เป็นข้อมูลยืนยันตัวตนหากคุณตรวจสอบสถานะภายหลัง",
      },
      required: true,
    },
    {
      id: "topic",
      type: "choose-one",
      label: { en: "What is this about", th: "เรื่องนี้เกี่ยวกับอะไร" },
      required: true,
      options: [
        { value: "question", label: { en: "A question", th: "คำถาม" } },
        { value: "suggestion", label: { en: "A suggestion", th: "ข้อเสนอแนะ" } },
        { value: "other", label: { en: "Something else", th: "เรื่องอื่น ๆ" } },
      ],
    },
    {
      id: "details",
      type: "long-text",
      label: { en: "Tell us more", th: "อธิบายรายละเอียดเพิ่มเติม" },
      required: false,
      maxLength: 500,
    },
    {
      id: "preferred-date",
      type: "date",
      label: { en: "A date that works for you", th: "วันที่คุณสะดวก" },
      hint: {
        en: "Optional. Shown to exercise the date question type.",
        th: "ไม่บังคับ แสดงไว้เพื่อสาธิตประเภทคำถามวันที่",
      },
      required: false,
    },
  ],

  // Illustrative only, chosen to be a round, plausible-looking number and
  // nothing more. Not a real BIRSA service standard.
  standardHours: 48,
  escalateTo: "rights-and-welfare",

  // Deliberately absent. See the file header: this is the demonstration.
  privacyActivityId: null,
  retentionTrigger: null,

  sensitive: false,
};
