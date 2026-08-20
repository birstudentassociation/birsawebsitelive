# BIRSA Portal 2.0: decisions register

`REDESIGN-2.0.md` §15 lists eleven decisions needed before Wave 0. Several of them are not
decisions anybody with a terminal can make, and this file is the honest record of which.

**Why this file exists rather than a set of assumptions in code.** §11.7 lists what must never
be parallelised, and three of its entries are on this page: the section 3.6 dispositions, the
photography policy, and the privacy paths. Of the dispositions it says plainly that "a
subagent deciding it would be deleting BIRSA's content on its own authority". The same
reasoning applies to an orchestrator. An agent that guesses here does not save the committee
a decision, it takes one away from them and hides that it did.

Status values: **open** (nobody has decided), **decided** (recorded below, with who), and
**blocked** (waiting on someone outside this repository).

---

## Gate 1: the Sanity plan. Blocked, and it gates Wave 3

**§6.11, §15 item 1. Status: blocked.**

The plan is explicit that this is a Wave 0 gate: "no schema work starts until the plan is
known, because the answer determines whether section 7's permission model is enforceable or
merely documented."

What has to happen, by a person:

1. Apply for the Sanity non-profit plan from the `birsa@tu.ac.th` account, not a student's.
   It is an application rather than a signup, so allow time for it.
2. Confirm the Sanity project is created under `birsa@tu.ac.th` (§7.4).
3. Verify the quotas, which is the part the free price hides: API requests, bandwidth, and
   asset storage against real traffic plus the new image load from §4.7. The non-profit plan
   is free "within the quotas", so the quotas are the thing to check, not the price.
4. Count the editing seats honestly first. Twenty-one committee members does not mean
   twenty-one editing seats; ask each portfolio who actually publishes. Note the trap: the
   built-in Viewer role is free, but a **custom** read-only role is billed as a full user.

**Decide in advance what BIRSA does if it is refused**, because deciding that under time
pressure is how a project ends up on the free plan by accident. §6.11 names the two
defensible answers, Growth at roughly $150 a month or the roadmap's §4C flow as a permanent
arrangement with the governing requirement knowingly unmet, and names the one indefensible
one:

> **The free plan is not an option.** It offers Admin and Viewer roles only, so every officer
> who can edit anything is an administrator of everything: §7.1 simply does not exist on it
> and §7.2's two-person rule degrades into twenty administrators. And its 3-day history
> retention guts §6.5, because "revert, one click, no developer" would be true for three days
> and an officer's mistake from last week would be a developer's problem again. Both defects
> are invisible until they bite.

**What this blocks:** Wave 3 entirely, and Wave 6 through it. Not Waves 1, 2 or 4A.

---

## Gate 2: the scope audit. Open, and it gates Waves 5 and 6

**§3.6, §15 item 9. Status: open. This is a committee judgement and agents may not make it.**

Every document in `content/student-life/` (24 per locale, 48 files), plus
`/services/university-services`, the emergency scenario content, and any Smart Answers node
whose owner is not BIRSA or the faculty, needs a level and a disposition: **keep**,
**signpost**, **absorb** or **delete**.

§3.6 supplies the audit and the four dispositions. It also supplies the gate that has to be
applied per document before anything is signposted or deleted. All four must be true:

1. An authoritative source exists and is publicly reachable.
2. It is maintained. Check when it last changed.
3. It is available in the language the reader needs. A Thai-only source fails an international
   student; an English-only source fails many Thai students.
4. It is stable enough to link to.

**If any of the four fails, keep the content** and mark it `maintainedBecause: "no
authoritative source"`, with an owner and a review date. That label is a trigger, not an
excuse: when TUSU does publish it, the review surfaces the page and BIRSA deletes it then.

Two specific things the committee should not skip:

- **`visa-and-immigration.mdx` carries the most risk on the site.** Immigration rules change
  without notice and the consequence of a stale sentence is a student out of status. BIRSA has
  no authority here and no way to know when the rules move. That page should hold no
  procedural detail at all.
- **Deleting is a redirect, never a 404.** Every disposition produces a rule in
  `lib/redirects.ts`, which is why that file is frozen and why an agent that finds a route
  with no rule stops rather than inventing one.

**What this blocks:** Wave 5's page rebuild and Wave 6's migration, both of which would
otherwise do work on pages that are about to be deleted. Not Waves 1, 2 or 4A.

---

## Gate 3: the photography policy. Open, and it shapes §4.7

**§4.7E, §15 item 10. Status: open.**

Publishing photographs of students is a standing commitment to four things, not a feature
flag: a photography notice at events with a practical opt-out that does not require a student
to argue with a committee member holding a camera; a default of wide shots with agreement
recorded where an individual is the clear subject; a takedown route with a service standard
measured in days rather than the general thirty; and a new processing activity in the privacy
register with a lawful basis, a retention trigger and a deletion path.

**If the committee will not run that, the honest answer is to keep images for things rather
than people.** That is a smaller change and still a worthwhile one.

`components/bds/imageContract.ts` is written so that it presumes neither answer: its
constraints are equally correct for photographs of things.

---

## Gate 4: the cookie banner. Open, and it affects every single visit

**§4.5, §15 item 4. Status: open. This is a factual PDPA question, not a design preference.**

The site has a cookies page and no banner, and uses Vercel Analytics. Whether a banner is
required depends on what Vercel Analytics actually stores in this configuration and on how
`content/privacy/register.ts` characterises it.

**Do not add a banner defensively.** An unnecessary consent dialog is a cognitive load tax on
every visit, forever. Establish the fact, then decide.

---

## Gate 6: the equipment loan service standard. DECIDED, 48 hours

**§1.2 D3, §5.1 item 7. Status: decided by the operator on 2026-08-20. 48 hours.**

`publishStandard: true` on the loan definition, so the confirmation page now states it. The
split below still stands for every future service: a standard is stated only when someone
says so out loud, and the reasoning is kept because the near miss is the useful part.

`ServiceDefinition.standardHours` is required, because §4E escalation needs a threshold to
escalate against. The equipment loan has no agreed turnaround time. §1.2 D3 says so
outright: the 1.0 service has "no shared service standard," and reading every file of it
confirms no turnaround promise exists anywhere.

So the migrated definition carries a documented placeholder of 48 hours in order to publish
at all, and that is the honest state of it rather than a decision anyone made.

**How this nearly became a promise.** The chassis confirmation page rendered `standardHours`
directly into "We aim to respond within {hours} hours." Wave 4B used a placeholder because
the field is required; Wave 4A rendered the field because a confirmation should say what
happens next. Both are defensible alone. Composed, the site would have told every student
who submitted a loan request that BIRSA commits to 48 hours, which no committee agreed and
nobody would have noticed until a student held BIRSA to it.

Fixed at the wave boundary by splitting the two uses. `standardHours` always drives
escalation. A new optional `publishStandard` decides whether it is also stated to a reader,
and OMITTING IT MEANS SAY NOTHING. A service that forgets the field promises nothing; the
opposite default would mean a forgotten field becomes a commitment. Two tests hold the line,
because the defect is invisible in review when each half looks correct on its own.

**Still worth a committee sanity check:** that 48 hours is meetable in exam weeks as well as
quiet ones, since it is now a promise rather than a threshold.

**What this blocks:** nothing.

---

## Gate 7: which equipment item a chassis request is for. Open, and it is a design question

**§5.2, §6.7. Status: open. Architectural, and it needs an orchestrator or committee answer.**

Wave 4B migrated the loan onto the chassis and the definition publishes. But the loan is not
one form. It is one form per catalogue item, chosen at `/services/equipment-loan/[item]/request`,
and the chassis has no way to express that:

- `/do/[service]/[step]` has one dynamic segment for the step and none for a subject.
- `choose-one` and `choose-several` take statically authored options, while the catalogue is
  rows in Postgres that officers add and retire through the console at any time.
- The registry loads every definition once, synchronously, at process start, so it could not
  fetch that list even if a question type existed for it.

Nothing was dropped from the wizard's own questions: the item was never one of them. But a
chassis submission cannot become a real loan without one, so the loan store rejects precisely
rather than guessing.

This is a finding about the chassis, not something a service definition could route around,
and it is the single thing standing between the migrated loan and retiring the 1.0 routes.
Three shapes are worth weighing: a subject segment on the route, a question type whose options
are resolved at request time rather than load time, or a service that is parameterised by a
catalogue at definition level. Each has consequences for the CMS, so it is recorded rather
than picked here.

**What this blocks:** retiring `app/[lang]/services/equipment-loan/**` in Wave 5. Both the
old routes and the new definition coexist until it is answered.

---

## Gate 5: the remaining §15 items. Open

| #   | Decision                                                               | Who decides          | Blocks  |
| --- | ---------------------------------------------------------------------- | -------------------- | ------- |
| 2   | Is the §3.2 IA right? Test with ten students and a card sort           | Committee + students | Wave 5  |
| 3   | Is the cream-editorial identity kept?                                  | Committee            | Wave 1  |
| 5   | Will BIRSA ship visible beta phase banners?                            | Committee            | Wave 5  |
| 6   | Does BIRSA hold welfare case records at all, or only status and dates? | Committee            | Wave 4  |
| 7   | Who holds which grant, and who is the second holder of each?           | The President        | Wave 3  |
| 8   | Who reviews Thai copy, and who is the second Studio administrator?     | The President        | Wave 7  |
| 11  | How long are found items held, and where do they go afterwards?        | Committee + faculty  | Wave 4D |

§15 item 2 is described in the plan as "the highest-value hour in the whole plan", and it is
the one on this list that costs an hour rather than a meeting. The IA in §3.2 is the decision
every later wave depends on, and it is a decision about students rather than about code.

Item 3 is assumed **kept** for the purpose of the work done so far: `components/bds/tokens.css`
carries the 1.0 colour values over unchanged. This is the plan's own assumption ("this plan
assumes cream-editorial on BIR red survives, and spends the budget on structure instead"), and
it is reversible, since a rebrand is a change to one file. It is recorded here rather than
left silent so the committee knows it was assumed rather than decided.

---

## Decided, and by whom

| Decision                                                                           | Decided by   | Where it lives                    |
| ---------------------------------------------------------------------------------- | ------------ | --------------------------------- |
| The seven-step bilingual type scale and its per-script leading and tracking        | Orchestrator | `components/bds/tokens.css`       |
| The nine dictionary namespaces and the flat composition                            | Orchestrator | `content/dictionaries/*/index.ts` |
| The portfolio vocabulary, derived from `content/committee.ts`                      | Orchestrator | `lib/portfolios.ts`               |
| The 1.0 to 2.0 URL map, and that it is wired at Wave 5 rather than now             | Orchestrator | `lib/redirects.ts`                |
| That the static half of the redirects belongs in `next.config.mjs`, not `proxy.ts` | Orchestrator | `lib/redirects.ts` header         |
| The six Wave 2 component clusters and their membership                             | Orchestrator | `components/bds/manifest.ts`      |
| Per-template image budgets                                                         | Orchestrator | `components/bds/imageContract.ts` |

Everything in that table is a build decision inside a contract the plan already set, which is
what §11.1 gives the orchestrator. Nothing in it decides what BIRSA is for, what it publishes,
or what it promises a student. Those are the four gates above.

---

## Deviations from §11's letter, and why

Two. Both are recorded here rather than left for a reviewer to discover in a diff.

### Subagents run in the shared checkout, not in git worktrees

§11.4 says "every agent runs with `isolation: "worktree"` so it has its own checkout". Measured
here, a git worktree of this repository has no `node_modules`, so an agent inside one cannot run
`npm run typecheck`, `npm run lint` or `npm run test` without first paying an `npm ci` per
worktree. The choice is therefore between isolation and verification, and §11.5's "VERIFY BEFORE
REPORTING" is worth more: Rule 2 already guarantees the agents' file paths are disjoint, which
is what worktrees would have been protecting against, and an unverified agent report is a defect
that surfaces at the wave boundary instead of before it.

What is lost is the merge step catching a Rule 2 violation as a conflict (§11.6 point 3). That
check moves to the orchestrator, who reviews each agent's changed-file list against its brief at
the wave boundary. Agents are told explicitly that others are working in the same checkout and
that a failure in a file they do not own is to be reported, not fixed.

### Wave 0 ships a component manifest rather than a stub file per component

§11.3 item 4 asks for "every component in §4.3 as a typed, documented, non-implemented file.
Props and TSDoc only", so that a Wave 4 page agent can import a component a Wave 2 agent is
still writing.

`components/bds/manifest.ts` carries the part of that which is genuinely a contract: the
enumeration, the cluster ownership, the GDS mapping and the usage rule. The per-component prop
signatures do not, yet, because a prop signature invented for an unimplemented `Gallery` is a
guess, and a guessed contract that Wave 2 then has to break is worse than no contract, since
breaking it costs an orchestrator decision under §11.1. The cluster agent that implements a
component authors its signature, and the manifest is what stops two of them inventing the same
component twice.

**This deviation expires the moment Wave 5 starts.** Page agents genuinely do need to import
components that are still being written, and at that point the signatures are real rather than
guessed and can be frozen from the implementations. If Waves 2 and 5 are ever run concurrently
before that, the stubs have to exist first.

---

## Two things an agent cannot do at all, whatever the gates say

**The §12 hardening acceptance test.** Forty-eight rows, and the plan is explicit: "every row
is performed by an actual BIRSA officer, on a phone, without a developer present and without
opening a terminal. **An agent cannot pass this test on BIRSA's behalf.**" Row 48 is the whole
test: do all of the above with the IT officer unreachable. Automated coverage of rows 15 to 19
and 34 to 37 is worth building, because they are validation rules with definite answers, but
passing them is not passing §12.

**Account custody.** §7.4 and roadmap Phase 0. The GitHub repository, the Vercel project, the
domain and DNS, Resend, Postgres, Blob, Edge Config and now the Sanity project must all be
owned by `birsa@tu.ac.th` rather than by any student. The plan calls this the first task in
the whole programme and the cheapest and most important thing in either document. It is people
work, it has no dependency on any of the above, and it should happen now.
