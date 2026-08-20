/**
 * The service definition type and its validator (REDESIGN-2.0 §5.2).
 *
 * FROZEN CONTRACT. Wave 0 owns this file (§11.3 item 6). Wave 4A implements
 * `intake`, `status`, `queue`, `escalation` and `registry` against it.
 *
 * D3: `app/[lang]/services/` is a folder. `equipment-loan` and `study-plan`
 * share a parent directory and nothing else. The roadmap proposes at least
 * eleven more intake flows; built the current way that is eleven more bespoke
 * folders, each needing a developer. Built once as a chassis whose service
 * definitions are editable documents, it is eleven things an officer creates
 * in an afternoon.
 *
 * A definition names everything §5.1 lists, and the ten items in that list are
 * what every intake already wants and only the loan service currently has.
 * Item 10 is the one that makes the chassis non-negotiable rather than merely
 * tidy: every new intake needs a privacy register entry and a matching branch
 * in `lib/privacy/retention.ts`. Built eleven times by hand, some will be
 * forgotten. Built once, the chassis can REFUSE TO PUBLISH a service that has
 * no retention rule, which is principle 12 (a constraint in the schema, not a
 * rule in someone's head). It matters more once the person creating the
 * service is an officer rather than a developer, because the officer has no
 * way of knowing the rule exists unless the system tells them.
 *
 * In 1.0 terms a definition would be a TypeScript file. In 2.0 it is a
 * document in the CMS, so an officer creates a service the way they create a
 * page (§6.7). This type is the shape of both: the schema mirrors it, and
 * `validateServiceDefinition` runs at load in the registry and again at
 * publish time in the Studio, so the two cannot disagree.
 */
import type { PortfolioId } from "@/lib/portfolios";
import type { Locale } from "@/lib/i18n";
import type { Question } from "@/lib/services/questionTypes";
import { collectsPersonalData, questionTypes } from "@/lib/services/questionTypes";
// Read-only import of the privacy register (never edited, per BUILD-BRIEF-2.0
// §8). `context.knownPrivacyActivityIds` below carries only ids, deliberately,
// so a test can exercise "unknown activity" and "no register entry" without
// depending on the real register's contents. But checking that a definition's
// `retentionTrigger` actually MATCHES the register activity's own trigger
// needs the trigger value itself, which the frozen `context` type does not
// carry (an agent that believes a contract is wrong stops and reports rather
// than editing it, per BUILD-BRIEF-2.0 §10, and this file's own header says
// the same for `defineService.ts` specifically). Importing the register
// directly for this one lookup, rather than widening `context`, is the fix
// that needs no signature change: it is a read, and this file's job already
// requires the register to be the source of truth for what each activity
// promises.

export type LocalizedText = Record<Locale, string>;

/**
 * When the retention clock starts for this service's submissions. Mirrors
 * `RetentionTrigger` in `content/privacy/register.ts` deliberately: the
 * register is the promise and `lib/privacy/retention.ts` is the code that
 * keeps it, and a service whose trigger does not exist in both is a service
 * whose privacy notice is a lie.
 */
export type RetentionTrigger = "created" | "closed" | "last-active";

export type ServiceDefinition = {
  /** URL slug. The service is served at `/do/<id>`. */
  id: string;
  /** §7.1. Scopes the officer queue and receives escalations. */
  owner: PortfolioId;
  /** §7.2: nobody is the only holder of anything. */
  secondHolder: PortfolioId;

  /** The GDS start page (§5.1 item 1). Every field is publish-blocking. */
  start: {
    /** What the service does. A job, never a committee portfolio (§2.1). */
    title: LocalizedText;
    /** Who it is for, and who it is NOT for (`check-a-service-is-suitable`). */
    whoFor: LocalizedText;
    /** What you need before you begin. */
    before: LocalizedText[];
    /** How long it takes to fill in. */
    howLong: LocalizedText;
    /** What happens next, which must agree with `standardHours` below. */
    whatNext: LocalizedText;
  };

  /** §5.1 item 2. One thing per page, in this order. */
  questions: Question[];

  /**
   * §5.1 item 7. The service standard in hours, stated in the acknowledgement
   * email rather than left as an intention. Officer-editable (§6.6): changing
   * it changes the email and the escalation together, which is acceptance
   * test row 20.
   */
  standardHours: number;

  /** §5.1 item 8. Who the daily cron chases when the standard is at risk. */
  escalateTo: PortfolioId;

  /**
   * §5.1 item 10. The `id` of an activity in `content/privacy/register.ts`.
   * Publish-blocking where any question collects personal data.
   */
  privacyActivityId: string | null;

  /** Must match the register entry's trigger, and be implemented in code. */
  retentionTrigger: RetentionTrigger | null;

  /**
   * §5.4 and §6.12. NOT OFFICER-EDITABLE. An officer can create a service;
   * only a developer can mark one sensitive or unmark it, because this flag
   * changes the retention, audit and access rules: reads are audited as well
   * as writes, reads are restricted to one role, retention is shorter than the
   * general period, and anonymous means anonymous including in the audit
   * trail. The Studio schema renders this field read-only; the registry
   * rejects a definition whose CMS copy disagrees with the code.
   */
  sensitive: boolean;
};

/**
 * A problem that blocks a service from serving or publishing. `field` is the
 * path the Studio highlights, so the message lands next to the thing to fix
 * rather than at the top of the page (§6.5 step 3, acceptance test row 34:
 * "the message says what to fix, not what failed").
 */
export type ServiceProblem = {
  field: string;
  message: LocalizedText;
};

/**
 * Validate a definition. Called by the registry at load, and by the Studio at
 * publish. Returns every problem rather than the first, because an officer
 * fixing one error at a time across six round trips gives up.
 *
 * NOT IMPLEMENTED. Wave 4A implements this. The signature and the rules below
 * are the frozen part; an agent that believes a rule is wrong stops and
 * reports rather than editing (§11.1).
 *
 * The rules, in the order §5.1 and §6.7 state them:
 *
 *   1. Both locales complete on every piece of copy (principle 14).
 *   2. At least one question, and every question id unique.
 *   3. `choose-one` and `choose-several` have at least two options.
 *   4. Exactly one `email` question, because it is the acknowledgement
 *      recipient and a service with two has no defined one.
 *   5. `standardHours` is positive and no greater than a fortnight, which is
 *      the point at which §4E escalation stops being a standard and starts
 *      being an apology.
 *   6. If any question collects personal data, `privacyActivityId` names an
 *      activity that exists in the register AND `retentionTrigger` is set AND
 *      `lib/privacy/retention.ts` implements a path for that activity. This is
 *      the rule the whole chassis exists for.
 *   7. `owner` and `secondHolder` are different portfolios (§7.2).
 *   8. `sensitive` matches the code-side allowlist, never the document.
 */
const URL_SAFE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** A fortnight in hours (§5.1 item 5's own ceiling): past this, "escalation" is not a standard any more, it is an apology. */
const MAX_STANDARD_HOURS = 24 * 14;

function bothLocalesPresent(text: LocalizedText | undefined): boolean {
  return Boolean(text && text.en.trim() && text.th.trim());
}

function problem(field: string, en: string, th: string): ServiceProblem {
  return { field, message: { en, th } };
}

/**
 * Implements the eight rules named in this file's own TSDoc, in the order
 * §5.1 and §6.7 state them. Every rule below is commented with WHY it
 * exists, not just what it checks, because the failure mode this whole
 * module exists to prevent is someone adding a bypass flag six months from
 * now without understanding what the flag would let through.
 *
 * Returns every problem found rather than stopping at the first (this
 * file's own TSDoc: "an officer fixing one error at a time across six
 * round trips gives up"), so every branch below is additive: it pushes onto
 * `problems` and keeps going, never returns early on a single bad field.
 */
export function validateServiceDefinition(
  definition: ServiceDefinition,
  context: {
    /** Activity ids from `content/privacy/register.ts`. */
    knownPrivacyActivityIds: readonly string[];
    /** Activity ids `lib/privacy/retention.ts` actually implements a path for. */
    implementedRetentionActivityIds: readonly string[];
    /**
     * Each register activity's own `retentionTrigger`, keyed by activity id.
     *
     * Injected rather than read from the register directly, for the same
     * reason every other register fact here is. The point of taking a context
     * at all is that this stays a pure function of its two arguments: the
     * Studio calls it at publish, the registry at load, and the tests with
     * fixtures. A validator that reached into the real register behind the
     * caller's back would ignore the fixture a test had just handed it and
     * quietly assert against production data, which makes a passing test mean
     * less than it appears to.
     */
    registerRetentionTriggers: Readonly<Record<string, RetentionTrigger>>;
    /** Service ids a developer has marked sensitive, in code (§6.12). */
    sensitiveServiceIds: readonly string[];
  }
): ServiceProblem[] {
  const problems: ServiceProblem[] = [];

  // Rule 1 (§5.1 item 1): every `start` field is publish-blocking in BOTH
  // locales, because `StartPage` (components/bds/StartPage.tsx) renders
  // every one of them unconditionally and has no fallback copy to fall
  // back to. A definition missing one is not a service with a rough start
  // page, it is a service that cannot render its start page at all.
  if (!bothLocalesPresent(definition.start?.title)) {
    problems.push(
      problem(
        "start.title",
        "Enter the service title in both English and Thai.",
        "กรุณากรอกชื่อบริการทั้งภาษาอังกฤษและภาษาไทย"
      )
    );
  }
  if (!bothLocalesPresent(definition.start?.whoFor)) {
    problems.push(
      problem(
        "start.whoFor",
        "Enter who this service is for (and who it is not for) in both languages.",
        "กรุณาระบุว่าบริการนี้เหมาะกับใคร และไม่เหมาะกับใคร ทั้งสองภาษา"
      )
    );
  }
  if (!definition.start?.before || definition.start.before.length === 0) {
    problems.push(
      problem(
        "start.before",
        "List at least one thing the reader needs before they begin, in both languages.",
        "กรุณาระบุสิ่งที่ต้องเตรียมก่อนเริ่มอย่างน้อยหนึ่งรายการ ทั้งสองภาษา"
      )
    );
  } else {
    definition.start.before.forEach((item, index) => {
      if (!bothLocalesPresent(item)) {
        problems.push(
          problem(
            `start.before[${index}]`,
            "Enter this item in both English and Thai.",
            "กรุณากรอกรายการนี้ทั้งภาษาอังกฤษและภาษาไทย"
          )
        );
      }
    });
  }
  if (!bothLocalesPresent(definition.start?.howLong)) {
    problems.push(
      problem(
        "start.howLong",
        "Enter how long the service takes to fill in, in both languages.",
        "กรุณาระบุระยะเวลาที่ใช้กรอก ทั้งสองภาษา"
      )
    );
  }
  if (!bothLocalesPresent(definition.start?.whatNext)) {
    problems.push(
      problem(
        "start.whatNext",
        "Enter what happens after the reader submits, in both languages.",
        "กรุณาระบุขั้นตอนหลังจากส่งคำขอ ทั้งสองภาษา"
      )
    );
  }

  // Rule 2 (§5.1 item 2): at least one question, and every id unique.
  // A question id becomes a route segment (`serviceSteps`, this file) and
  // the draft cookie's field name, so a duplicate does not just confuse an
  // officer editing the Studio form, it makes two different questions
  // silently share one draft field and one URL, and the second one always
  // wins.
  if (!definition.questions || definition.questions.length === 0) {
    problems.push(
      problem("questions", "Add at least one question.", "กรุณาเพิ่มคำถามอย่างน้อยหนึ่งข้อ")
    );
  }

  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();
  for (const question of definition.questions ?? []) {
    if (seenIds.has(question.id)) duplicateIds.add(question.id);
    seenIds.add(question.id);
  }
  if (duplicateIds.size > 0) {
    problems.push(
      problem(
        "questions",
        `Question ids must be unique. These are repeated, ${[...duplicateIds].join(", ")}.`,
        `รหัสคำถามต้องไม่ซ้ำกัน รายการที่ซ้ำ ${[...duplicateIds].join(" ")}`
      )
    );
  }

  (definition.questions ?? []).forEach((question, index) => {
    // A question id becomes `/do/<service>/<id>` (`serviceSteps` below), so
    // anything that is not URL safe breaks the route it is supposed to
    // name rather than merely looking untidy.
    if (!URL_SAFE_ID.test(question.id)) {
      problems.push(
        problem(
          `questions[${index}].id`,
          `Question id "${question.id}" must use only lowercase letters, numbers and hyphens, and cannot start or end with a hyphen, because it becomes a page address.`,
          `รหัสคำถาม "${question.id}" ต้องใช้ตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และเครื่องหมายขีดกลางเท่านั้น และห้ามขึ้นต้นหรือลงท้ายด้วยขีดกลาง เนื่องจากใช้เป็นส่วนหนึ่งของที่อยู่หน้าเว็บ`
        )
      );
    }

    // Rule for "a question whose type is not in questionTypes": the
    // TypeScript type already restricts `question.type` for code written
    // against this file, but a CMS document is data at runtime, not a type
    // the compiler can see (§6.7's whole point: an officer edits a
    // document, not TypeScript), so this is the runtime half of that
    // guarantee.
    if (!(question.type in questionTypes)) {
      problems.push(
        problem(
          `questions[${index}].type`,
          `"${question.type}" is not a question type this site supports.`,
          `ประเภทคำถาม "${question.type}" ไม่ใช่ประเภทที่เว็บไซต์นี้รองรับ`
        )
      );
      return;
    }

    // Rule 3 (§5.1 item 3, the §6.7 table): `choose-one` and
    // `choose-several` need something to choose between. One option is not
    // a choice.
    if (
      (question.type === "choose-one" || question.type === "choose-several") &&
      (!question.options || question.options.length < 2)
    ) {
      problems.push(
        problem(
          `questions[${index}].options`,
          "Give this question at least two options.",
          "กรุณาระบุตัวเลือกอย่างน้อยสองรายการสำหรับคำถามนี้"
        )
      );
    }
  });

  // Rule 4: exactly one `email` question. It is the acknowledgement
  // recipient (§5.1 item 7's email, `intake.ts`), and a service with two
  // email questions has no defined recipient, while a service with none
  // can never send the acknowledgement §5.1 item 7 promises.
  const emailQuestionCount = (definition.questions ?? []).filter((q) => q.type === "email").length;
  if (emailQuestionCount !== 1) {
    problems.push(
      problem(
        "questions",
        `Add exactly one email address question (found ${emailQuestionCount}). It is where the acknowledgement is sent.`,
        `กรุณาระบุคำถามประเภทที่อยู่อีเมลเพียงข้อเดียว (พบ ${emailQuestionCount} ข้อ) เนื่องจากใช้เป็นที่อยู่สำหรับส่งอีเมลยืนยัน`
      )
    );
  }

  // Rule 5 (§5.1 item 7, §4E): `standardHours` has to be a real, positive
  // promise. `whatNext` on the start page and the acknowledgement email
  // both state it, and `escalation.ts` depends on it existing to know when
  // to chase anyone. A ceiling of a fortnight matches this file's own
  // TSDoc: past that point, calling it a "standard" is not honest.
  if (
    typeof definition.standardHours !== "number" ||
    !Number.isFinite(definition.standardHours) ||
    definition.standardHours <= 0
  ) {
    problems.push(
      problem(
        "standardHours",
        "Enter a service standard in hours, greater than zero.",
        "กรุณาระบุระยะเวลามาตรฐานในการให้บริการเป็นชั่วโมง ต้องมากกว่าศูนย์"
      )
    );
  } else if (definition.standardHours > MAX_STANDARD_HOURS) {
    problems.push(
      problem(
        "standardHours",
        "The service standard cannot be more than a fortnight (336 hours). Past that, it is not a standard any more.",
        "ระยะเวลามาตรฐานต้องไม่เกินสองสัปดาห์ (336 ชั่วโมง) เกินกว่านั้นถือว่าไม่ใช่มาตรฐานที่แท้จริงอีกต่อไป"
      )
    );
  }

  // Rule 6 (§5.1 item 10). THE RULE THE WHOLE CHASSIS EXISTS FOR.
  //
  // If any question collects personal data, this service is a processing
  // activity under the PDPA whether or not anyone remembered to write that
  // down. `content/privacy/register.ts` is the site's one record of what
  // personal data it handles (its own file header says so) and
  // `lib/privacy/retention.ts` is the code that actually deletes it when
  // the promised period runs out. A definition can name a `privacyActivityId`
  // that does not exist, or that exists but whose `retentionTrigger` does
  // not match what this definition claims, or that exists and matches but
  // has no code path in `retention.ts` actually deleting anything on that
  // trigger. Any of those three is a privacy notice that is, in effect, a
  // lie, and built by hand across eleven services some of them WILL be
  // forgotten (this file's own TSDoc). So this branch is the one place in
  // the whole validator that must never grow a bypass: a flag that skips
  // it is a flag that lets a service collect personal data with nowhere
  // for it to legally rest and nothing that ever deletes it.
  if (collectsPersonalData(definition.questions ?? [])) {
    if (!definition.privacyActivityId) {
      problems.push(
        problem(
          "privacyActivityId",
          "This service collects personal data (it has an email question, at minimum). Name the privacy register activity it belongs to before publishing.",
          "บริการนี้เก็บข้อมูลส่วนบุคคล (อย่างน้อยมีคำถามเกี่ยวกับอีเมล) กรุณาระบุกิจกรรมในทะเบียนข้อมูลส่วนบุคคลที่เกี่ยวข้องก่อนเผยแพร่"
        )
      );
    } else if (!context.knownPrivacyActivityIds.includes(definition.privacyActivityId)) {
      problems.push(
        problem(
          "privacyActivityId",
          `"${definition.privacyActivityId}" is not an activity in the privacy register. Ask a developer to add one before this service can publish.`,
          `"${definition.privacyActivityId}" ไม่ใช่กิจกรรมในทะเบียนข้อมูลส่วนบุคคล กรุณาแจ้งผู้พัฒนาให้เพิ่มรายการก่อนเผยแพร่บริการนี้`
        )
      );
    }

    if (!definition.retentionTrigger) {
      problems.push(
        problem(
          "retentionTrigger",
          "Set when the retention period starts for this service's submissions.",
          "กรุณาระบุจุดเริ่มต้นของระยะเวลาการเก็บรักษาข้อมูลสำหรับบริการนี้"
        )
      );
    }

    if (
      definition.privacyActivityId &&
      context.knownPrivacyActivityIds.includes(definition.privacyActivityId) &&
      !context.implementedRetentionActivityIds.includes(definition.privacyActivityId)
    ) {
      problems.push(
        problem(
          "privacyActivityId",
          `The register has a "${definition.privacyActivityId}" activity, but lib/privacy/retention.ts has no code path that deletes it yet. Ask a developer to implement one before this service can publish.`,
          `ทะเบียนมีกิจกรรม "${definition.privacyActivityId}" อยู่แล้ว แต่ lib/privacy/retention.ts ยังไม่มีขั้นตอนลบข้อมูลดังกล่าว กรุณาแจ้งผู้พัฒนาให้ดำเนินการก่อนเผยแพร่บริการนี้`
        )
      );
    }

    // The register is the promise and `retention.ts` is the code that keeps
    // it (this file's own TSDoc on `RetentionTrigger`); a definition whose
    // `retentionTrigger` disagrees with the register activity it names is a
    // definition whose privacy notice would be wrong the moment someone
    // reads the register entry next to it.
    if (definition.retentionTrigger && definition.privacyActivityId) {
      const registerTrigger = context.registerRetentionTriggers[definition.privacyActivityId];
      if (registerTrigger && registerTrigger !== definition.retentionTrigger) {
        problems.push(
          problem(
            "retentionTrigger",
            `This service's retention trigger ("${definition.retentionTrigger}") does not match the "${definition.privacyActivityId}" register activity's trigger ("${registerTrigger}"). They must agree.`,
            `จุดเริ่มต้นการเก็บรักษาข้อมูลของบริการนี้ ("${definition.retentionTrigger}") ไม่ตรงกับกิจกรรม "${definition.privacyActivityId}" ในทะเบียน ("${registerTrigger}") ทั้งสองรายการต้องตรงกัน`
          )
        );
      }
    }
  }

  // Rule 7 (§7.2): nobody is the only holder of anything. If `owner` and
  // `secondHolder` are the same portfolio, an escalation has no second
  // person to escalate to and the two-person rule the rest of the site
  // enforces (`lib/portfolios.ts`'s own file header) has nowhere to point
  // for this one service.
  if (definition.owner && definition.secondHolder && definition.owner === definition.secondHolder) {
    problems.push(
      problem(
        "secondHolder",
        "The second holder must be a different portfolio from the owner. Nobody is the only holder of anything.",
        "ผู้ถือครองรายที่สองต้องเป็นคนละฝ่ายกับเจ้าของบริการ เนื่องจากไม่มีฝ่ายใดถือครองสิ่งใดเพียงลำพัง"
      )
    );
  }

  // Rule 8 (§5.4, §6.12): `sensitive` is not officer-editable. The Studio
  // renders the field read-only, but a CMS document is data, and data can
  // disagree with the code that is supposed to control it (accidentally,
  // or because someone edited the raw document). The registry is the
  // backstop: if the code-side allowlist and the document disagree in
  // EITHER direction, the definition is invalid, never merely "trusted
  // less". This is what keeps the flag a developer decision rather than a
  // checkbox an officer can tick.
  const isAllowlistedSensitive = context.sensitiveServiceIds.includes(definition.id);
  if (definition.sensitive && !isAllowlistedSensitive) {
    problems.push(
      problem(
        "sensitive",
        "This service is marked sensitive, but no developer has allowlisted it as one. Only a developer can mark a service sensitive.",
        "บริการนี้ถูกทำเครื่องหมายว่ามีความอ่อนไหว แต่ยังไม่มีผู้พัฒนากำหนดไว้ในรายการที่อนุญาต การทำเครื่องหมายดังกล่าวทำได้โดยผู้พัฒนาเท่านั้น"
      )
    );
  }
  if (!definition.sensitive && isAllowlistedSensitive) {
    problems.push(
      problem(
        "sensitive",
        "A developer has allowlisted this service as sensitive, but the definition does not mark it. The document and the code must agree.",
        "ผู้พัฒนากำหนดให้บริการนี้มีความอ่อนไหวไว้ในรายการที่อนุญาต แต่เอกสารบริการยังไม่ได้ทำเครื่องหมายไว้ เอกสารและโค้ดต้องตรงกัน"
      )
    );
  }

  return problems;
}

/**
 * Whether a definition needs a privacy register entry at all. Pure, and
 * exported separately so the Studio can show the requirement the moment an
 * officer adds a question that collects personal data, rather than at publish.
 * Explaining the rule before it blocks is the difference between a constraint
 * and an ambush.
 */
export function needsPrivacyRegisterEntry(definition: ServiceDefinition): boolean {
  return collectsPersonalData(definition.questions);
}

/**
 * The ordered route segments for a service, including the check-answers step.
 * `/do/<id>/<segment>` for each question, then `check`, then `confirm`.
 *
 * Pure and total, so Wave 5 page agents can build navigation against it before
 * Wave 4A implements the routes (§11.4's overlap).
 */
export function serviceSteps(definition: ServiceDefinition): string[] {
  return [...definition.questions.map((q) => q.id), "check", "confirm"];
}

/** The `bds/` components a definition needs. Used by the `/design` coverage check. */
export function componentsUsed(definition: ServiceDefinition): string[] {
  return [...new Set(definition.questions.map((q) => questionTypes[q.type].component))].sort();
}
