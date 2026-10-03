/**
 * Pure engine for the flood claims checker at `/emergency/flooding/claims/check`:
 * which question comes next, and what someone may be able to claim from their
 * answers. No React, so it is unit-testable (see `tests/unit/claims-check.test.ts`).
 *
 * Answers travel in the query string, one parameter per question, so every step
 * is a plain GET URL that works without JavaScript. The query is untrusted: an
 * unknown value, or an answer to a question that is not reached, is dropped and
 * the reader lands on the first question still to answer.
 */

export const questionOptions = {
  home: ["bangkok", "elsewhere", "no"],
  flood: ["over7", "damaged", "cutoff", "highrise", "brief"],
  tenure: ["owner", "rent", "other"],
  damage: ["whole", "part", "none"],
  costs: ["stay", "tools", "treatment", "injury", "death", "none"],
  id: ["thai", "other"],
} as const;

export type QuestionId = keyof typeof questionOptions;
export type OptionId<Q extends QuestionId> = (typeof questionOptions)[Q][number];

/** Questions that take several answers, as checkboxes. */
export const multipleChoice: QuestionId[] = ["costs"];

export type Answers = {
  home?: OptionId<"home">;
  flood?: OptionId<"flood">;
  tenure?: OptionId<"tenure">;
  damage?: OptionId<"damage">;
  costs?: OptionId<"costs">[];
  id?: OptionId<"id">;
};

/** The questions asked for these answers, in order. Later ones depend on earlier ones. */
export function questionSequence(answers: Answers): QuestionId[] {
  if (answers.home === undefined || answers.home === "no") return ["home"];
  return answers.home === "bangkok"
    ? ["home", "flood", "tenure", "damage", "costs", "id"]
    : ["home", "flood", "tenure", "id"];
}

type Query = Record<string, string | string[] | undefined>;

function values(query: Query, key: string): string[] {
  const raw = query[key];
  if (raw === undefined) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function isOption<Q extends QuestionId>(question: Q, value: string): value is OptionId<Q> {
  return (questionOptions[question] as readonly string[]).includes(value);
}

/**
 * Read the answers from a query, keeping only a valid run from the first
 * question. For several answers, "none" alone means none and is dropped when
 * anything else is chosen.
 */
export function parseAnswers(query: Query): Answers {
  const answers: Answers = {};
  for (let i = 0; ; i++) {
    const question = questionSequence(answers)[i];
    if (!question) return answers;
    const given = values(query, question).filter((value) => isOption(question, value));
    if (given.length === 0) return answers;
    if (question === "costs") {
      const chosen = [...new Set(given)] as OptionId<"costs">[];
      answers.costs = chosen.length > 1 ? chosen.filter((c) => c !== "none") : chosen;
    } else {
      (answers as Record<string, string>)[question] = given[0]!;
    }
  }
}

/** The next question to ask, or null when every question is answered. */
export function nextQuestion(answers: Answers): QuestionId | null {
  return questionSequence(answers).find((question) => answers[question] === undefined) ?? null;
}

/** Query string for these answers, keeping only the questions before `until`. */
export function answersQuery(answers: Answers, until?: QuestionId): string {
  const params = new URLSearchParams();
  for (const question of questionSequence(answers)) {
    if (question === until) break;
    const value = answers[question];
    if (value === undefined) break;
    for (const v of Array.isArray(value) ? value : [value]) params.append(question, v);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export type ClaimItem =
  | "government"
  | "repairs"
  | "stayWhole"
  | "stayPart"
  | "livingWhole"
  | "livingPart"
  | "tools"
  | "treatment"
  | "injury"
  | "death";

export type ClaimNote =
  | "bangkokArea"
  | "outsideBangkok"
  | "tenantPaid"
  | "household"
  | "repairsLandlord"
  | "waterCameIn"
  | "bmaDeadline"
  | "notThai"
  | "nothingFound"
  | "notYourHome";

export type ClaimsResult = {
  government: ClaimItem[];
  bma: ClaimItem[];
  notes: ClaimNote[];
};

/** What someone may be able to claim. Call once `nextQuestion` is null. */
export function assessClaims(answers: Answers): ClaimsResult {
  const result: ClaimsResult = { government: [], bma: [], notes: [] };
  if (answers.home === "no") {
    result.notes.push("notYourHome");
    return result;
  }

  const affected = answers.flood !== undefined && answers.flood !== "brief";
  if (affected) {
    result.government.push("government");
    if (answers.home === "bangkok") result.notes.push("bangkokArea");
    if (answers.tenure === "rent") result.notes.push("tenantPaid");
    if (answers.tenure === "other") result.notes.push("household");
  }
  if (answers.home === "elsewhere") result.notes.push("outsideBangkok");

  if (answers.home === "bangkok") {
    const costs = answers.costs ?? [];
    const damaged = answers.damage === "whole" || answers.damage === "part";
    if (answers.tenure === "owner" && damaged) result.bma.push("repairs");
    if (costs.includes("stay"))
      result.bma.push(answers.damage === "whole" ? "stayWhole" : "stayPart");
    if (answers.damage === "whole") result.bma.push("livingWhole");
    if (answers.damage === "part") result.bma.push("livingPart");
    if (costs.includes("tools")) result.bma.push("tools");
    if (costs.includes("treatment")) result.bma.push("treatment");
    if (costs.includes("injury")) result.bma.push("injury");
    if (costs.includes("death")) result.bma.push("death");
    if (answers.tenure === "rent" && damaged) result.notes.push("repairsLandlord");
    if (answers.damage === "none" && result.bma.length === 0) result.notes.push("waterCameIn");
    if (result.bma.length > 0) result.notes.push("bmaDeadline");
  }

  if (answers.id === "other") result.notes.push("notThai");
  const nothing = result.government.length === 0 && result.bma.length === 0;
  if (nothing && !result.notes.includes("waterCameIn")) result.notes.push("nothingFound");
  return result;
}
