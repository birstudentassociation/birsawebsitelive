import { describe, expect, it } from "vitest";
import { getTopic, resolveTopic } from "@/lib/smart-answers";
import { service } from "@/content/smart-answers";
import { admissionRounds, getAdmissionRound } from "@/content/information/admissions";
import { formatSpan } from "@/components/information/format";
import type { SmartAnswerOutcome } from "@/content/smart-answers/types";

const topic = getTopic(service, "admission-round")!;

function outcomeAfter(answers: string[]): SmartAnswerOutcome {
  const { node, answerIds } = resolveTopic(service, topic, answers);
  expect(answerIds, `${answers.join("/")} was cut short`).toEqual(answers);
  expect(node.kind).toBe("outcome");
  return node as SmartAnswerOutcome;
}

describe("the admission round check", () => {
  it.each([
    [["thai", "m6", "yes", "yes", "yes", "yes"], "bir-out-ip1-ip2-tcas3"],
    [["thai", "m6", "yes", "yes", "yes", "no"], "bir-out-ip1-tcas3"],
    [["thai", "m6", "yes", "no"], "bir-out-ip1"],
    [["thai", "m6", "no", "yes", "yes", "yes"], "bir-out-ip2-tcas3"],
    [["thai", "m6", "no", "yes", "no", "yes"], "bir-out-tcas3"],
    [["thai", "m6", "no", "no"], "bir-out-none"],
    [["thai", "graduated", "yes", "yes", "yes"], "bir-out-ip1-tcas3"],
    [["thai", "intl", "yes", "yes", "no"], "bir-out-ip1"],
    [["thai", "ged", "yes", "yes", "yes"], "bir-out-ip1-tcas3"],
    [["thai", "ged", "no", "yes", "no"], "bir-out-none"],
    [["not-thai", "yes"], "bir-out-non-thai"],
    [["not-thai", "no"], "bir-out-non-thai-no-sat"],
  ])("takes %j to %s", (answers, outcomeId) => {
    expect(outcomeAfter(answers).id).toBe(outcomeId);
  });

  it("shows each eligible round's dates, seats and fee from the admissions data", () => {
    const outcome = outcomeAfter(["thai", "m6", "yes", "yes", "yes", "yes"]);
    const steps = outcome.body?.filter((block) => block.kind === "steps") ?? [];
    expect(steps).toHaveLength(3);

    for (const id of ["inter-portfolio-1", "inter-portfolio-2", "tcas-3"]) {
      const round = getAdmissionRound(id)!;
      const block = steps.find((candidate) => candidate.title?.en === round.name.en);
      const text = {
        en: block?.items.map((item) => item.en).join(" ") ?? "",
        th: block?.items.map((item) => item.th).join(" ") ?? "",
      };
      for (const locale of ["en", "th"] as const) {
        expect(text[locale], `${id} ${locale} seats`).toContain(`${round.seats}`);
        expect(text[locale], `${id} ${locale} fee`).toContain(round.fee[locale]);
        for (const window of round.window) {
          expect(text[locale], `${id} ${locale} dates`).toContain(formatSpan(locale, window));
        }
      }
    }
  });

  it("never offers TCAS 3 to a reader who is not Thai", () => {
    for (const id of ["bir-out-non-thai", "bir-out-non-thai-no-sat"]) {
      const outcome = service.nodes.find((node) => node.id === id) as SmartAnswerOutcome;
      const hrefs = [...(outcome.actions ?? []), ...(outcome.related ?? [])].map((x) => x.href);
      expect(hrefs.some((href) => href.endsWith("/tcas-3-written-exam"))).toBe(false);
    }
  });

  it("links every action and related page to a guide that exists", () => {
    const guides = new Set(
      [...admissionRounds.map((round) => round.guide)].concat(
        ["admission-rounds", "key-dates", "documents", "english-tests-and-qualifications"].map(
          (slug) => `/services/applying-to-bir/${slug}`
        )
      )
    );
    for (const node of service.nodes) {
      if (node.kind !== "outcome" || !node.id.startsWith("bir-out-")) continue;
      const internal = [...(node.actions ?? []), ...(node.related ?? [])].filter(
        (link) => !("external" in link && link.external)
      );
      for (const link of internal) {
        expect(guides.has(link.href), `${node.id} links to ${link.href}`).toBe(true);
      }
    }
  });
});
