/**
 * A `WhatIfResult` as short sentences, for the plan screen's "If I move this
 * later" disclosure, the course page's panel and the scenario previews.
 *
 * The words are passed in (`WhatIfCopy`), as the picker's context line does,
 * and so is the way a term is named, so this module stays free of the screen
 * copy and the same sentences read the same everywhere. It states what moves
 * and what that does to graduation, and it says nothing about whether the
 * change is a good idea: findings, not what-ifs, carry judgement.
 */
import type { TermRef } from "@/content/curriculum";
import type { WhatIfResult } from "@/lib/study-plan/whatIf";

export type WhatIfCopy = {
  /** Contains "{code}", "{from}" and "{to}". */
  moveTemplate: string;
  /** Contains "{term}". */
  emptyTemplate: string;
  /** Contains "{from}" and "{to}". */
  graduationMovesTemplate: string;
  /** Contains "{term}". */
  graduationStaysTemplate: string;
  /** Contains "{n}" and "{list}", the list being "{code} to {term}" items. */
  pushedTemplate: string;
  /** Contains "{list}"; used when exactly one course is pushed back. */
  pushedOneTemplate: string;
  noDependentsText: string;
  /** Contains "{code}" and "{term}"; the list's "{code} to {term}" item. */
  listItemTemplate: string;
  /** Contains "{term}", "{credits}" and "{limit}". */
  overloadTemplate: string;
  /** Contains "{code}". */
  notPlannedTemplate: string;
  /** Used when the term named has nothing in it. */
  emptyTermNothingText: string;
};

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

export function whatIfSentences(
  result: WhatIfResult,
  copy: WhatIfCopy,
  termText: (term: TermRef) => string
): string[] {
  const { change } = result;
  if (!result.applied) {
    return [
      change.kind === "deferCourse"
        ? fill(copy.notPlannedTemplate, { code: change.code })
        : copy.emptyTermNothingText,
    ];
  }

  const sentences: string[] = [];
  const moved = result.pushedBack.filter((p) => p.reason === "moved");
  const dependents = result.pushedBack.filter((p) => p.reason === "dependent");

  if (change.kind === "deferCourse" && moved[0]) {
    sentences.push(
      fill(copy.moveTemplate, {
        code: moved[0].code,
        from: termText(moved[0].from),
        to: termText(moved[0].to),
      })
    );
  } else if (change.kind === "emptyTerm") {
    sentences.push(fill(copy.emptyTemplate, { term: termText(change.term) }));
  }

  if (result.graduationBefore && result.graduationAfter) {
    sentences.push(
      result.graduationMoved
        ? fill(copy.graduationMovesTemplate, {
            from: termText(result.graduationBefore),
            to: termText(result.graduationAfter),
          })
        : fill(copy.graduationStaysTemplate, { term: termText(result.graduationAfter) })
    );
  }

  if (dependents.length > 0) {
    const list = dependents
      .map((p) => fill(copy.listItemTemplate, { code: p.code, term: termText(p.to) }))
      .join(", ");
    sentences.push(
      fill(dependents.length === 1 ? copy.pushedOneTemplate : copy.pushedTemplate, {
        n: String(dependents.length),
        list,
      })
    );
  } else if (change.kind === "deferCourse") {
    sentences.push(copy.noDependentsText);
  }

  for (const over of result.overloaded) {
    sentences.push(
      fill(copy.overloadTemplate, {
        term: termText(over.term),
        credits: String(over.credits),
        limit: String(over.limit),
      })
    );
  }
  return sentences;
}
