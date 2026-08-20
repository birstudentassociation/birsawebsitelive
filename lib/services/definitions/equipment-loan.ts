/**
 * THE EQUIPMENT LOAN SERVICE, EXPRESSED AS A SERVICE DEFINITION
 * (Wave 4B, REDESIGN-2.0 §11.4, ROUTE-MAP-2.0 "Wave 4B").
 *
 * "This wave is the proof the chassis works." Every field below is taken
 * from the existing service's own copy, not invented:
 *
 *   - Questions and their order come from
 *     `app/[lang]/services/equipment-loan/[item]/request/steps.ts`
 *     (`LOAN_STEPS`) and each step's own page and
 *     `components/equipment/loanWizardCopy.ts`.
 *   - `start` copy is assembled from `app/[lang]/services/equipment-loan/page.tsx`
 *     (the catalogue landing page, which is the one item-independent
 *     description of "the equipment loan service" that exists) and
 *     `loanWizardCopy.ts`'s `start` and `confirmation` sections.
 *   - `privacyActivityId`/`retentionTrigger` are the `equipment-loan` entry
 *     in `content/privacy/register.ts` (`storage: "database"`,
 *     `retentionTrigger: "closed"`), confirmed implemented by
 *     `selectExpiredLoanIds` in `lib/privacy/retention.ts` and listed in
 *     `lib/services/registry.ts`'s `IMPLEMENTED_RETENTION_ACTIVITY_IDS`.
 *
 * THIS DEFINITION DOES NOT PUBLISH THE WHOLE LOAN SERVICE ON ITS OWN. Two
 * things the existing service does needed more than a question list, and
 * both are reported in full rather than papered over:
 *
 * 1. WHICH ITEM. RESOLVED, gate 7 (`docs/DECISIONS-2.0.md`, decided
 *    2026-08-20). The existing service is not one form, it is one form per
 *    catalogue item (`/services/equipment-loan/[item]/request/*`), where the
 *    item is chosen by clicking a card on `/services/equipment-loan` before
 *    the wizard's own steps begin. `LOAN_STEPS` itself has no "which item"
 *    step, which is why this definition's `questions` do not have one
 *    either (nothing is dropped: every id in `LOAN_STEPS` bar `"check"` has
 *    a question below, in the same order): the item was never one of the
 *    wizard's own questions, and it still is not one here. Wave 4B found a
 *    chassis submission through `/do/equipment-loan` could never carry
 *    which item it was for, because the route had no segment for one and
 *    `choose-one`/`choose-several` take options an officer writes into the
 *    document while the catalogue is live rows in Postgres. The `subject`
 *    field below is the fix: the service is served at
 *    `/do/equipment-loan/<item-key>/...`, the same shape 1.0's own
 *    `[item]/request` URL already has (old links map across), and
 *    `submitService` (`lib/services/intake.ts`) carries the chosen item
 *    through to `Submission.subject`, which
 *    `lib/services/loanSubmissionStore.ts`'s `save()` now reads instead of
 *    throwing. See that file's header for the resolver this `source`
 *    registers against.
 *
 * 2. THE SERVICE STANDARD. `standardHours` below is NOT a real BIRSA
 *    commitment. Read its own comment before changing it.
 *
 * EVERYTHING ELSE MAPS CLEANLY. All six questions the wizard actually asks
 * (name, student ID, email, phone, the date range, the reason) map onto the
 * frozen palette with no awkwardness: `student-id` exists specifically for
 * this, and `date-range` says so itself ("the existing loan date logic").
 * The one exception worth flagging: `lib/services/validate.ts`'s
 * `date-range` case checks the two dates are real, in order and not in the
 * past, but has no per-item maximum length (the wizard's own `errorTooLong`,
 * `item.maxLoanDays`), because "maximum length" is a fact about which item
 * was chosen, and this definition has no item. `createLoanRequest`
 * (`lib/inventory/loans.ts`) still enforces it server-side regardless, so no
 * loan can be created over length even though the chassis form cannot warn
 * about it before submitting; see the submission store's header.
 */
import type { ServiceDefinition } from "@/lib/services/defineService";

export const equipmentLoan: ServiceDefinition = {
  id: "equipment-loan",

  // Gate 7 (docs/DECISIONS-2.0.md, decided 2026-08-20): the equipment loan
  // is one form per catalogue item, not one form. `source` is a plain
  // string id, matched by convention against
  // `lib/services/loanSubmissionStore.ts`'s own
  // `EQUIPMENT_ITEM_SUBJECT_SOURCE` (which registers the resolver for it),
  // the same way this definition's own `id` above is matched by convention
  // against that file's `LOAN_SERVICE_ID` rather than imported: a
  // definition is a CMS document in 2.0 and cannot reference a code module
  // (`defineService.ts`'s own header), so the two agree on a name rather
  // than one importing the other. `paramName` is what the URL segment is
  // called for a human reading it, and `label` is what this service calls
  // the thing it is about, used anywhere a page has to name it generically
  // rather than by its own name.
  subject: {
    source: "equipment-item",
    paramName: "item",
    label: {
      en: "item",
      th: "อุปกรณ์",
    },
  },

  // No portfolio owns this service by name. docs/CAPABILITY-ROADMAP.md says
  // so explicitly: "the equipment loan... is the workflow that belongs to no
  // named officer" (its "Portfolio it serves" column reads "Whoever holds
  // the equipment"), and lib/inventory/auth.ts's own header confirms loan
  // decisions are made centrally rather than by one scoped portfolio
  // ("Loans and borrowers are deliberately BIRSA-global"). `owner` and
  // `secondHolder` are both real, distinct portfolios from
  // lib/portfolios.ts, picked for plausibility (general administration and
  // logistics, and the portfolio most associated with looking after
  // students' interests) rather than read off any document that names them
  // for this service, because no such document exists. Reported as a
  // finding: a real committee decision on which portfolio owns the loan
  // queue would replace this pairing.
  owner: "general-coordination",
  secondHolder: "rights-and-welfare",

  start: {
    title: {
      en: "Equipment loan service",
      th: "บริการยืมอุปกรณ์",
    },
    // "who it is for, and who it is NOT for" (StartPage's own TSDoc).
    // Assembled from the catalogue page's lede and "how it works" copy plus
    // the request wizard's own "what you will need" list, not invented.
    whoFor: {
      en: "For Thammasat University students who want to borrow BIRSA equipment for an event or an everyday need, free of charge. You will need your Thammasat University student ID and your Thammasat University student email address (@dome.tu.ac.th or @tu.ac.th). It is not for equipment owned by a club rather than BIRSA itself; see the club equipment directory for those instead.",
      th: "สำหรับนักศึกษามหาวิทยาลัยธรรมศาสตร์ที่ต้องการยืมอุปกรณ์ของ BIRSA ไปใช้ในกิจกรรมหรือความจำเป็นในชีวิตประจำวันโดยไม่มีค่าใช้จ่าย ต้องเตรียมรหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์และอีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ (@dome.tu.ac.th หรือ @tu.ac.th) ให้พร้อม ไม่รวมอุปกรณ์ที่เป็นของชมรมโดยตรง ซึ่งดูได้ที่ทำเนียบอุปกรณ์ของชมรมแทน",
    },
    before: [
      {
        en: "Your Thammasat University student ID",
        th: "รหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์",
      },
      {
        en: "Your Thammasat University student email address (@dome.tu.ac.th or @tu.ac.th)",
        th: "อีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ (@dome.tu.ac.th หรือ @tu.ac.th)",
      },
    ],
    // Not stated anywhere as a promise; derived from the number of
    // questions below (six short pages), the same way the example
    // definition's own howLong is a plain estimate rather than a quoted
    // commitment.
    howLong: {
      en: "About 5 minutes. There are six short questions.",
      th: "ประมาณ 5 นาที มีคำถามสั้น ๆ หกข้อ",
    },
    // From the catalogue page's "how it works" steps and the wizard's own
    // confirmation "what happens next", with no claim about how long
    // BIRSA's decision takes (see standardHours below).
    whatNext: {
      en: "BIRSA reviews your request and emails you the outcome. Once approved, collect the item in person from the BIRSA office on the date you chose, and return it by the date you agreed to.",
      th: "BIRSA ตรวจสอบคำขอของคุณและแจ้งผลทางอีเมล เมื่อคำขอได้รับการอนุมัติ ให้มารับอุปกรณ์ที่สำนักงาน BIRSA ด้วยตนเองตามวันที่เลือกไว้ และคืนอุปกรณ์ตามวันที่ตกลงไว้",
    },
  },

  // Order and ids follow LOAN_STEPS
  // (app/[lang]/services/equipment-loan/[item]/request/steps.ts) exactly,
  // minus "check" (serviceSteps() appends that itself) and minus the item
  // choice, which is not one of LOAN_STEPS either (see the file header).
  questions: [
    {
      id: "name",
      type: "short-text",
      label: {
        en: "What is your full name?",
        th: "ชื่อ-นามสกุลของคุณคืออะไร",
      },
      required: true,
      // inventoryLoanRequestSchema's studentName cap (lib/validation.ts).
      maxLength: 120,
    },
    {
      // Not "studentId": rule 2 (defineService.ts) requires a URL-safe id
      // (lowercase, hyphens only), because the id becomes the step's own
      // route segment. LOAN_STEPS spells this field "studentId" because
      // that is a JS object key (the draft cookie's field name), not a URL
      // segment; the wizard's own URL for this step is already
      // "student-id" (STEP_SLUG in
      // app/[lang]/services/equipment-loan/[item]/request/actions.ts), so
      // this id matches the wizard's URL, not its internal draft key.
      id: "student-id",
      type: "student-id",
      label: {
        en: "What is your student ID?",
        th: "รหัสนักศึกษาของคุณคืออะไร",
      },
      hint: {
        en: "Your Thammasat University student ID number.",
        th: "รหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์ของคุณ",
      },
      required: true,
    },
    {
      id: "email",
      type: "email",
      label: {
        en: "What is your student email address?",
        th: "อีเมลนักศึกษาของคุณคืออะไร",
      },
      hint: {
        en: "We will use this to let you know the outcome of your request.",
        th: "เราจะใช้อีเมลนี้แจ้งผลการพิจารณาคำขอของคุณ",
      },
      required: true,
    },
    {
      id: "phone",
      type: "phone",
      label: {
        en: "What is your phone number?",
        th: "เบอร์โทรศัพท์ของคุณคืออะไร",
      },
      hint: {
        en: "Optional. Used if BIRSA needs to reach you urgently about this request.",
        th: "ไม่บังคับ ใช้ในกรณีที่ BIRSA ต้องการติดต่อคุณอย่างเร่งด่วนเกี่ยวกับคำขอนี้",
      },
      required: false,
    },
    {
      id: "dates",
      type: "date-range",
      label: {
        en: "When do you need to borrow it?",
        th: "คุณต้องการยืมอุปกรณ์วันไหนถึงวันไหน",
      },
      // No maximum loan length here; see the file header. The date itself
      // still cannot be in the past (lib/services/validate.ts's date-range
      // case), matching the wizard's own errorStartPast.
      hint: {
        en: "Choose the date you will collect the item and the date you will return it. Each item has its own maximum loan length, shown on its page in the equipment list.",
        th: "เลือกวันที่ต้องการมารับอุปกรณ์และวันที่จะคืน แต่ละอุปกรณ์มีระยะเวลายืมสูงสุดของตนเอง ดูได้จากหน้าอุปกรณ์นั้น ๆ ในรายการอุปกรณ์",
      },
      required: true,
    },
    {
      id: "reason",
      type: "long-text",
      label: {
        en: "What will you use it for?",
        th: "คุณต้องการยืมไปใช้ทำอะไร",
      },
      hint: {
        en: "A short description of the event or activity you need it for. Optional, but giving a reason helps BIRSA review your request faster.",
        th: "อธิบายสั้น ๆ ว่าจะนำอุปกรณ์ไปใช้ในกิจกรรมหรือเหตุการณ์ใด ไม่บังคับ แต่ช่วยให้ BIRSA พิจารณาคำขอได้เร็วขึ้น",
      },
      required: false,
      // inventoryLoanRequestSchema's reason cap (lib/validation.ts).
      maxLength: 1000,
    },
  ],

  // NOT A REAL BIRSA COMMITMENT. REDESIGN-2.0 §1.2 (D3) says so about the
  // 1.0 loan service in so many words: "no shared service standard." Every
  // page of the existing wizard and its copy (loanWizardCopy.ts,
  // app/[lang]/services/equipment-loan/page.tsx) was read for this wave and
  // none of them states a turnaround time; the closest thing is "BIRSA
  // reviews your request and emails you the outcome", with no bound on how
  // long that takes. There is no cron, no overdue-request board, and no
  // email template anywhere in the codebase that promises a number either.
  //
  // `standardHours` is non-optional in the frozen ServiceDefinition type and
  // validateServiceDefinition's rule 5 requires a positive number for this
  // definition to publish at all, so an unset value is not an option the
  // type or the chassis leaves open. 48 is used here the same way
  // `example-chassis-demo.ts` uses 48 for its own illustrative standard,
  // and the same way REDESIGN-2.0.md's own acceptance-test row 20 uses 48
  // as its example ("change a service's standard from 48 to 72 hours"): a
  // round, clearly-a-placeholder number, not a quoted institutional fact.
  // THIS IS THE HEADLINE FINDING OF THIS WAVE'S DELIVERABLE 1: see the
  // Wave 4B report. A real committee decision belongs here before this
  // number is treated as a promise BIRSA has made, because right now it is
  // a developer's placeholder standing in for a decision nobody has made.
  standardHours: 48,
  // Decided by the operator, 2026-08-20 (gate 6). 48 hours is now a real
  // commitment, so it is stated on the confirmation page rather than only
  // driving escalation.
  publishStandard: true,
  escalateTo: "rights-and-welfare",

  privacyActivityId: "equipment-loan",
  retentionTrigger: "closed",

  sensitive: false,
};
