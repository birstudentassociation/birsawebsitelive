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
