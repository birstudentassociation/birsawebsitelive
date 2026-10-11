/**
 * The plan screen's scenarios section: the switcher, the two built-in
 * questions (switch minor, spend a term away) and the comparison of two
 * scenarios.
 *
 * Everything except saving is computed here, on the server, from plans carried
 * in the address: the minor and the term to try are GET forms that reload the
 * screen with `?minor=` or `?away=`, and the comparison reads the other plan
 * from `?compare=`. So the previews and the comparison work with JavaScript
 * off. The switcher and the buttons that keep a result as a scenario need the
 * device's storage and are client enhancements; the section says so once, in
 * `copy.needsScript`, rather than leaving a reader without JavaScript to wonder
 * what is missing.
 *
 * A preview never changes the plan on screen: it is a second, hypothetical
 * plan, and what it reports are facts about that plan.
 */
import type { CurriculumVersion, MinorId, TermRef } from "@/content/curriculum";
import { parseTermKey } from "@/lib/study-plan/addToPlan";
import { termIndex, termKey } from "@/lib/study-plan/derive";
import { PLAN_FIELD, deserialisePlan, serialisePlan, type StudyPlan } from "@/lib/study-plan/plan";
import { awayTerm, compareScenarios, minorSwitch, type AwayKind } from "@/lib/study-plan/scenarios";
import {
  AWAY_FIELD,
  AWAY_KIND_FIELD,
  MINOR_FIELD,
  cleanScenarioName,
} from "@/lib/study-plan/scenarioStore";
import { whatIfSentences } from "@/lib/study-plan/whatIfText";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Notice from "@/components/Notice";
import SaveScenarioButton from "@/components/study-plan/SaveScenarioButton";
import ScenarioManager from "@/components/study-plan/ScenarioManager";
import type { TermInsightCopy } from "@/components/study-plan/termInsightCopy";
import {
  categoryLabel,
  formatTermRef,
  type StudyPlanCopy,
} from "@/components/study-plan/studyPlanCopy";
import type { Locale } from "@/lib/i18n";

export type ScenarioSectionProps = {
  locale: Locale;
  version: CurriculumVersion;
  plan: StudyPlan;
  copy: StudyPlanCopy;
  insight: TermInsightCopy;
  /** The localised plan screen path, e.g. "/en/services/study-plan/plan". */
  planHref: string;
  /** The raw query values, each already reduced to its first value. */
  params: {
    minor?: string;
    away?: string;
    awayKind?: string;
    compare?: string;
    compareName?: string;
  };
};

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

/** A GET form that reloads the plan screen with the plan and one more parameter. */
function PreviewForm({
  planHref,
  serialisedPlan,
  anchor,
  children,
}: {
  planHref: string;
  serialisedPlan: string;
  anchor: string;
  children: React.ReactNode;
}) {
  return (
    <form method="get" action={`${planHref}#${anchor}`} className="flex flex-col gap-3">
      <input type="hidden" name={PLAN_FIELD} value={serialisedPlan} />
      {children}
    </form>
  );
}

export default function ScenarioSection({
  locale,
  version,
  plan,
  copy,
  insight,
  planHref,
  params,
}: ScenarioSectionProps) {
  const serialisedPlan = serialisePlan(plan);
  const termText = (term: TermRef) => formatTermRef(copy.terms, term);
  const minorNameOf = (id: MinorId) => version.minors.find((m) => m.id === id)?.name[locale] ?? "";
  const ownMinorName = minorNameOf(plan.minorId);
  const s = insight.scenarios;

  // Minor switch.
  const tryMinor = version.minors.find((m) => m.id === params.minor);
  const minorResult = tryMinor ? minorSwitch(version, plan, tryMinor.id) : null;

  // Away term: only a term that has something in it can be left empty.
  const usedTerms = plan.terms
    .filter((t) => t.codes.length > 0 || t.freeElectiveCredits > 0)
    .map((t) => t.term)
    .sort((a, b) => termIndex(a) - termIndex(b));
  const requestedAway = params.away ? parseTermKey(params.away) : null;
  const awayChoice = requestedAway
    ? usedTerms.find((t) => termIndex(t) === termIndex(requestedAway))
    : undefined;
  const awayKind: AwayKind = params.awayKind === "leave" ? "leave" : "exchange";
  const awayResult = awayChoice ? awayTerm(version, plan, awayChoice, awayKind) : null;

  // Comparison with another scenario's plan carried in the address.
  const otherPlan = params.compare ? deserialisePlan(params.compare) : null;
  const comparison = otherPlan
    ? compareScenarios(
        { name: s.currentTag, plan },
        { name: cleanScenarioName(params.compareName ?? "") ?? s.defaultName, plan: otherPlan }
      )
    : null;

  return (
    <section aria-labelledby="scenarios-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 id="scenarios-heading" className="font-display text-xl">
          {s.heading}
        </h2>
        <p className="leading-relaxed text-muted">{s.intro}</p>
        <p className="text-sm leading-relaxed text-muted">{s.needsScript}</p>
        <ScenarioManager copy={s} currentPlan={serialisedPlan} planHref={planHref} />
      </div>

      {comparison ? (
        <div id="compare" className="flex flex-col gap-3 rounded-lg border border-line p-5">
          <h3 className="font-display text-lg">{insight.compare.heading}</h3>
          <p className="text-sm text-muted">{insight.compare.intro}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[24rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th scope="col" className="py-2 pr-3 font-semibold text-muted">
                    <span className="sr-only">{insight.compare.categoryHeader}</span>
                  </th>
                  <th scope="col" className="py-2 pr-3 font-semibold text-ink">
                    {comparison.a.name}
                  </th>
                  <th scope="col" className="py-2 font-semibold text-ink">
                    {comparison.b.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <th scope="row" className="py-2 pr-3 text-left font-semibold text-muted">
                    {insight.compare.graduationRow}
                  </th>
                  <td className="py-2 pr-3 text-ink">
                    {comparison.a.graduation
                      ? termText(comparison.a.graduation)
                      : insight.compare.noGraduation}
                  </td>
                  <td className="py-2 text-ink">
                    {comparison.b.graduation
                      ? termText(comparison.b.graduation)
                      : insight.compare.noGraduation}
                    {comparison.graduationDiffers ? ` (${insight.compare.differs})` : ""}
                  </td>
                </tr>
                <tr className="border-b border-line">
                  <th scope="row" className="py-2 pr-3 text-left font-semibold text-muted">
                    {insight.compare.creditsRow}
                  </th>
                  {[comparison.a, comparison.b].map((summary, i) => (
                    <td key={i} className="py-2 pr-3 text-ink">
                      {fill(insight.compare.creditsTemplate, {
                        counted: String(summary.creditsCounted),
                        required: String(summary.creditsRequired),
                      })}
                    </td>
                  ))}
                </tr>
                {comparison.categories.map((category) => {
                  const name = categoryLabel(
                    copy.plan,
                    category.id,
                    category.name[locale],
                    ownMinorName
                  );
                  const show = (value: number | null) =>
                    value === null ? insight.compare.notInCurriculum : String(value);
                  return (
                    <tr key={category.id} className="border-b border-line">
                      <th scope="row" className="py-2 pr-3 text-left font-normal text-muted">
                        {name}
                      </th>
                      <td className="py-2 pr-3 text-ink">{show(category.a)}</td>
                      <td className="py-2 text-ink">
                        {show(category.b)}
                        {category.a !== category.b ? ` (${insight.compare.differs})` : ""}
                      </td>
                    </tr>
                  );
                })}
                {(
                  [
                    ["problem", insight.compare.problems],
                    ["warning", insight.compare.warnings],
                    ["note", insight.compare.notes],
                  ] as const
                ).map(([severity, label]) => (
                  <tr key={severity} className="border-b border-line">
                    <th scope="row" className="py-2 pr-3 text-left font-normal text-muted">
                      {insight.compare.findingsHeading}
                      {": "}
                      {label}
                    </th>
                    <td className="py-2 pr-3 text-ink">{comparison.a.findings[severity]}</td>
                    <td className="py-2 text-ink">
                      {comparison.b.findings[severity]}
                      {comparison.a.findings[severity] !== comparison.b.findings[severity]
                        ? ` (${insight.compare.differs})`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <a
            href={`${planHref}?${PLAN_FIELD}=${encodeURIComponent(serialisedPlan)}`}
            className="focus-halo inline-flex min-h-11 items-center self-start font-semibold text-brand-deep hover:underline"
          >
            {insight.compare.closeLink}
          </a>
        </div>
      ) : null}

      <div id="minor-switch" className="flex flex-col gap-3 rounded-lg border border-line p-5">
        <h3 className="font-display text-lg">{insight.minorSwitch.heading}</h3>
        <p className="text-sm leading-relaxed text-muted">{insight.minorSwitch.intro}</p>
        <PreviewForm planHref={planHref} serialisedPlan={serialisedPlan} anchor="minor-switch">
          <div className="flex flex-wrap items-end gap-3">
            <Field
              as="select"
              label={insight.minorSwitch.selectLabel}
              name={MINOR_FIELD}
              defaultValue={tryMinor?.id ?? ""}
              options={version.minors.map((m) => ({ value: m.id, label: m.name[locale] }))}
              className="min-w-0 flex-1"
            />
            <Button type="submit" variant="secondary">
              {insight.minorSwitch.button}
            </Button>
          </div>
        </PreviewForm>

        {minorResult && tryMinor ? (
          <div className="flex flex-col gap-3" aria-live="polite">
            <h4 className="font-display text-base">
              {fill(insight.minorSwitch.resultHeading, { minor: tryMinor.name[locale] })}
            </h4>
            {tryMinor.id === plan.minorId ? (
              <p className="text-sm text-muted">{insight.minorSwitch.sameMinor}</p>
            ) : (
              <>
                {minorResult.rows.length === 0 ? (
                  <p className="text-sm text-ink">{insight.minorSwitch.nothingMoves}</p>
                ) : (
                  <ul className="flex flex-col gap-1.5 text-sm text-ink">
                    {(
                      [
                        ["carried", insight.minorSwitch.carried],
                        ["otherMinor", insight.minorSwitch.otherMinor],
                        ["reclassified", insight.minorSwitch.reclassified],
                      ] as const
                    ).map(([outcome, template]) => {
                      const rows = minorResult.rows.filter((r) => r.outcome === outcome);
                      if (rows.length === 0) return null;
                      return (
                        <li key={outcome}>
                          {fill(template, {
                            n: String(rows.reduce((n, r) => n + r.credits, 0)),
                            codes: rows.map((r) => r.code).join(", "),
                          })}
                        </li>
                      );
                    })}
                    {minorResult.credits.noLongerCounting > 0 ? (
                      <li>
                        {fill(insight.minorSwitch.noLongerCounting, {
                          n: String(minorResult.credits.noLongerCounting),
                        })}
                      </li>
                    ) : null}
                  </ul>
                )}
                {minorResult.rows.length > 0 ? (
                  <ul className="flex flex-col gap-1 text-sm text-muted">
                    {minorResult.rows.map((row) => (
                      <li key={row.code}>
                        {row.code} &middot; {insight.minorSwitch.countsAs}{" "}
                        {row.to
                          ? categoryLabel(
                              copy.plan,
                              row.to,
                              version.categories.find((c) => c.id === row.to)?.name[locale] ?? "",
                              tryMinor.name[locale]
                            )
                          : copy.plan.pickOtherGroup}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="text-sm text-ink">
                  {fill(insight.minorSwitch.remaining, {
                    before: String(minorResult.remainingBefore),
                    after: String(minorResult.remainingAfter),
                  })}
                </p>
                <SaveScenarioButton
                  plan={serialisePlan(minorResult.plan)}
                  name={fill(insight.minorSwitch.defaultName, { minor: tryMinor.name[locale] })}
                  label={insight.minorSwitch.saveButton}
                  copy={s}
                  planHref={planHref}
                />
              </>
            )}
          </div>
        ) : null}
      </div>

      <div id="away-term" className="flex flex-col gap-3 rounded-lg border border-line p-5">
        <h3 className="font-display text-lg">{insight.awayTerm.heading}</h3>
        <p className="text-sm leading-relaxed text-muted">{insight.awayTerm.intro}</p>
        {usedTerms.length === 0 ? (
          <p className="text-sm text-muted">{insight.awayTerm.noTerms}</p>
        ) : (
          <PreviewForm planHref={planHref} serialisedPlan={serialisedPlan} anchor="away-term">
            <div className="flex flex-wrap items-end gap-3">
              <Field
                as="select"
                label={insight.awayTerm.termLabel}
                name={AWAY_FIELD}
                defaultValue={awayChoice ? termKey(awayChoice) : ""}
                options={usedTerms.map((term) => ({
                  value: termKey(term),
                  label: termText(term),
                }))}
                className="min-w-0 flex-1"
              />
              <Field
                as="select"
                label={insight.awayTerm.kindLabel}
                name={AWAY_KIND_FIELD}
                defaultValue={awayKind}
                options={[
                  { value: "exchange", label: insight.awayTerm.exchange },
                  { value: "leave", label: insight.awayTerm.leave },
                ]}
                className="min-w-0"
              />
              <Button type="submit" variant="secondary">
                {insight.awayTerm.button}
              </Button>
            </div>
          </PreviewForm>
        )}

        {awayResult && awayChoice ? (
          <div className="flex flex-col gap-3" aria-live="polite">
            <h4 className="font-display text-base">
              {fill(insight.awayTerm.resultHeading, { term: termText(awayChoice) })}
            </h4>
            <ul className="flex flex-col gap-1.5 text-sm text-ink">
              {whatIfSentences(awayResult.whatIf, insight.whatIf, termText).map((sentence) => (
                <li key={sentence}>{sentence}</li>
              ))}
              {awayResult.chains.length === 0 ? (
                <li>{insight.awayTerm.noChains}</li>
              ) : (
                awayResult.chains.map((chain) => (
                  <li key={chain.code}>
                    {fill(insight.awayTerm.chainTemplate, {
                      code: chain.code,
                      list: chain.dependents.join(", "),
                    })}
                  </li>
                ))
              )}
            </ul>
            <p className="text-sm text-muted">
              {awayKind === "leave" ? insight.awayTerm.leaveNote : insight.awayTerm.exchangeNote}
            </p>
            {awayResult.beyondTimeLimit ? (
              <Notice variant="warning">{insight.awayTerm.beyondLimit}</Notice>
            ) : null}
            <SaveScenarioButton
              plan={serialisePlan(awayResult.plan)}
              name={fill(insight.awayTerm.defaultName, { term: termText(awayChoice) })}
              label={insight.awayTerm.saveButton}
              copy={s}
              planHref={planHref}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
