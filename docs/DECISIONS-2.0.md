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

## Gate 1: the Sanity plan. OPEN. Project vbo54y9j exists

**§6.11, §15 item 1. Status: OPEN as of 2026-08-21. Wave 3 is unblocked and running.**

Project id `vbo54y9j`, dataset `production`, on the FREE plan. The id is not a
secret and lives in `sanity/projectConfig.ts` next to the code that uses it,
along with what the free plan costs. The write token is a secret and is in no file.

**ACCOUNT CUSTODY, and a deviation from §7.4 worth stating plainly.** The project
is owned by `birstudentassociation@gmail.com`, which the operator confirms is the
account used for all IT backend, not `birsa@tu.ac.th` as §7.4 asks for.

The important half of §7.4 holds: this is an ORGANISATIONAL account rather than a
student's personal one, so the failure the section exists to prevent, a graduating
student walking away with BIRSA's infrastructure, does not apply. The half that
does not hold is that a Gmail address is not an institutional one. If the faculty
ever needs to recover access without the current officers, a `tu.ac.th` address is
the one an institution can vouch for and a Gmail address is not. Recorded so it is
a known trade rather than an oversight, and noting that migrating the owner later
is possible but tedious across eight services.

The remaining §7.4 items are unchanged people work with no dependency on this:
GitHub, Vercel, the domain and DNS, Resend, Postgres, Blob and Edge Config should
all sit on the same organisational account.

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

## Gate 2: the scope audit. APPROVED as recommended, 2026-08-22

The operator approved `docs/SCOPE-AUDIT-2.0.md` in full: KEEP 22, SIGNPOST 6,
ABSORB 6, DELETE 0. Waves 5 and 6 execute that list. An agent still may not
change a disposition; a change is a new operator decision.

Two of the audit's section 4 findings were already fixed before approval and must
not be re-decided: the printing quota is 200 baht split across two funds, and the
BIR office contact is the one `internship.mdx` carries, which `content/site.ts`
and the build brief already agreed with.

One fact the audit could not settle, now settled by the operator: **health
insurance IS required for an international student to enter Thailand.**
`international/healthcare-and-insurance.mdx` currently says Thammasat "expects or
requires" it, which is exactly the vagueness that leaves a student unable to act.
Its SIGNPOST rewrite must state the requirement plainly and then point at TU
International Affairs for the current detail, rather than hedging.

## Decision 2: the IA. DECIDED by the operator, 2026-08-22

§15 item 2, the plan's "highest value hour". One card sort respondent, plus the
operator's own ruling on two tasks. Held as definitive for Wave 5.

| Task                             | Destination  |
| -------------------------------- | ------------ |
| Borrow a camera                  | Do something |
| Drop a course late in the term   | Your studies |
| When is the next general meeting | About BIRSA  |
| Report harassment                | Get help     |
| What the committee spent         | About BIRSA  |
| Pick electives                   | Your studies |
| Lost student card                | Get help     |
| Join a club                      | Do something |

Tasks 2 and 6 were answered Get help by the respondent and OVERRIDDEN to Your
studies by the operator. Recorded as an override rather than as a result, because
the two are different kinds of evidence and a later reader should be able to tell
them apart.

**What this sample cannot tell us, stated so nobody mistakes it for a finding.**
This is one respondent, not the ten the plan asked for. Eight tasks is also not
the whole IA: nothing tested news, events or the calendar, which is most of
What's on.

**The one signal worth acting on carefully.** What's on received ZERO picks
across all eight tasks. Clubs went to Do something and meetings went to About
BIRSA. That is not evidence What's on is wrong, because the tasks that would have
tested it were never asked, but it is a reason not to treat it as validated.

**The conflict this creates with the approved audit, and how it is resolved.**
The audit sends `home/getting-involved.mdx` to `/whats-on/clubs`, while the nav
answer puts joining a club under Do something. Both readings are defensible:
§3.2's own description of `/do` lists "sign up" as one of its categories, and
About genuinely holds minutes, decisions and the committee. So the clubs
DIRECTORY lives at `/whats-on/clubs` as the audit says, and the ACT of joining is
a service under `/do` that links to it. One canonical page, two ways in, which is
what the split between a directory and a service is for.

If a fuller card sort later contradicts this, the fix is a navigation document
change rather than a rebuild, because §3.3 made navigation content rather than
code precisely so this kind of answer can move without a developer.

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

## Decisions taken by the operator on 2026-08-20

All recorded here so a later reader can tell what was decided from what was assumed.

### Gate 7: a chassis request names its subject in the route. DECIDED

`/do/[service]/[subject]/[step]`. The loan is one form per catalogue item, and this
mirrors the 1.0 URL `/services/equipment-loan/[item]/request`, so old links map cleanly
and the catalogue stays live rows in Postgres rather than options frozen into a
definition. A definition declares that it takes a subject; the chassis carries it to the
submission store. The question palette is untouched.

### Gate 3: photographs of people, with written consent per photo. DECIDED

BIRSA may publish identifiable people. That makes consent a system, not a habit, and the
work it implies is real:

- A consent record per subject per photo, held where §6.3 says personal data lives, which
  is NOT the CMS.
- A takedown path, because consent can be withdrawn and a photo that cannot be removed
  quickly is a photo that should not have been published.
- A new processing activity in `content/privacy/register.ts` with a lawful basis and a
  retention rule, and a matching branch in `lib/privacy/retention.ts`.

Until those three exist, the image components stay as they are and no photograph of an
identifiable person is published. The components already support the events-and-spaces
case, so nothing is blocked by waiting.

### Gate 4: no cookie banner, because no consent is required. DECIDED

Conditional on every cookie remaining strictly necessary: the service draft cookies, the
theme preference, the officer session. PDPA and GDPR both exempt those from consent. The
condition is the decision: **the day anything non-essential is added, analytics above all,
this answer expires and a reject-by-default banner becomes mandatory.** A test should hold
that line rather than a comment, since the cost of getting it wrong is on every visit.

### Decision 5: visible beta phase banners, with a feedback link. DECIDED

`components/bds/PhaseBanner.tsx` already takes its text and its on/off state as props, so
turning one off never needs a developer, which was §4.5's requirement.

### Decision 6: no welfare service at all for now. DECIDED

BIRSA signposts to university counselling and holds nothing. §5.4 already says the chassis
must not be used here, and this makes that permanent rather than pending. The practical
effect is that the question of whether BIRSA holds case records does not arise, and
`ExitThisPage` remains what protects a reader on the reporting and rights pages that do
exist.

### Gate 11: found items are held indefinitely by the faculty office. DECIDED, with one gap

That settles the PHYSICAL item: BIRSA hands it to the faculty office and does not become a
warehouse.

It does not settle BIRSA's own DATABASE RECORD of the claim, which is a separate thing and
is what the chassis actually refuses to publish without. Recorded default, pending a
correction from the operator: the record follows the register's existing
`RETENTION_YEARS = 2`. "Indefinitely" cannot apply to a record containing a student's name
and contact details, because a retention period with no end is not a retention period.

### Gate 1: the free Sanity plan is accepted, knowingly. DECIDED

The operator has accepted the free plan's compromises. §6.11 called this the one
indefensible answer, so what is being accepted is recorded plainly rather than softened:

- **Admin and Viewer roles only.** Every officer who can edit anything is an administrator
  of everything. §7.1's permission model does not exist on this plan, and §7.2's
  two-person rule becomes twenty administrators. `/officer/access` and the drift cron
  become the only place the real access picture is visible, which raises their importance
  rather than lowering it.
- **Three day history retention.** §6.5's "revert, one click, no developer" is true for
  three days. An officer's mistake from last week is a developer's problem again.

Both defects are invisible until they bite, which is why they are written down here. The
decision stands and Wave 3 is unblocked on this basis.

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

## Gate 12: the rich text fields are not bilingual. OPEN, found by Wave 6, 2026-08-24

Not a decision anyone took. A defect two Wave 6 agents found independently, in two
different schema files, on the same day, without knowing about each other.

Every other text field in `sanity/schemaTypes/` is bilingual by construction:
`localizedString` and `localizedText` wrap their value in `{ en, th }`, and
`tests/unit/sanity-schema-*.test.ts` enforce that both halves exist. The two RICH
text types do not. `portableText` and `portableTextInline` are a bare array of
blocks with no locale wrapper at all, and `regulation.body` is a single one of
those.

The consequence, stated plainly: **as the schema stands today, an officer cannot
write the Thai version of any long-form page.** Not news, not a guide, not a club
page, not a regulation. The section palette (§4.6) is built on `portableText`, so
this is not one document type, it is every content type that carries prose.

How the two agents hit it:

- Wave 6A (MDX to Portable Text) had 126 files in 63 bilingual pairs and one field
  to put them in. It put the English blocks in `content` and the Thai blocks in an
  undeclared `_i18nGapPortableText` sidecar, so no content is lost on import. That
  sidecar is a holding pen, not a design: the Studio will not render it and no
  officer can edit it.
- Wave 6B (TypeScript modules to documents) hit the same wall from the other side
  on `regulation.body`, and stopped rather than flatten a bilingual, legally
  numbered tree of 226 provisions into a single-locale prose blob. It migrated the
  title, the slug and a derived effective date, and reported the rest.

**Nothing may be imported into `production` until this is resolved.** Importing the
sidecar shape would put unreachable Thai text in a real dataset and make the gap
look solved.

The fix is a Wave 3 schema change, and it is a schema decision rather than
migration work, so no Wave 6 agent made it. Two shapes are available: wrap
`portableText` the way `localizedText` wraps a string, or give every prose document
paired `contentEn` and `contentTh` fields. The first is consistent with the rest of
the schema; the second is what Sanity's own documentation reaches for more often.
Whoever takes it should also decide what `regulation` needs, since legal text wants
provision numbering that ordinary prose does not.

## Gate 13: three fields no 1.0 source can fill. OPEN

`lifecycle.owner` and `lifecycle.reviewBy` are required on every document the schema
defines, and **no 1.0 content file carries either**. Wave 6A omitted them on all 50
documents it produced rather than invent an owning portfolio and a review date for
content nobody has reviewed.

This is the §10 review cycle asking who is responsible for each page, which is
exactly the question the redesign exists to make answerable. It is an editorial
decision for the committee, one row per document, and it is small work that only
BIRSA can do.

Related, and the same shape: only **5 of 13 portfolios** can be created, because
§7.2's two-person rule makes `secondHolder` required and eight portfolios have one
holder in the real 2026 roster. That is a fact about the committee, not about the
data.

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
