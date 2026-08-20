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
export function validateServiceDefinition(
  _definition: ServiceDefinition,
  _context: {
    /** Activity ids from `content/privacy/register.ts`. */
    knownPrivacyActivityIds: readonly string[];
    /** Activity ids `lib/privacy/retention.ts` actually implements a path for. */
    implementedRetentionActivityIds: readonly string[];
    /** Service ids a developer has marked sensitive, in code (§6.12). */
    sensitiveServiceIds: readonly string[];
  }
): ServiceProblem[] {
  throw new Error("validateServiceDefinition is a Wave 0 stub; Wave 4A implements it.");
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
