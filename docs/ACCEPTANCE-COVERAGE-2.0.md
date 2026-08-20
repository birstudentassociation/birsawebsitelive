# The hardening acceptance test: what is automated, and what is not

`REDESIGN-2.0.md` §12 is the definition of done for the governing requirement, and it opens
with a sentence this file exists to protect:

> **Every row is performed by an actual BIRSA officer, on a phone, without a developer present
> and without opening a terminal. An agent cannot pass this test on BIRSA's behalf.**

Some rows are validation rules with definite answers, and those can and should have automated
backing, because a rule that is only checked when someone remembers to check it is not a rule.
Most rows are not: they ask whether a person who has never seen a CMS can do their job in it,
and no test answers that.

**The risk this file addresses** is the one §13 names as the commonest outcome: officers are
given the keys and do not use them. A green test suite is a very comfortable way to stop asking
whether that has happened. So the columns below are deliberately separate, and the second one
never substitutes for the third.

| Column        | Means                                                                     |
| ------------- | ------------------------------------------------------------------------- |
| **Automated** | A test asserts the rule. Named here, so the claim is checkable            |
| **Officer**   | Requires a person doing the task on a phone. Always required where marked |

---

## Rows with automated backing today

These are the validation rules. Every one of them is a **blocked** row: the test asserts that
the system says no, which is the half a machine can check.

| Row | Task                                              | Automated by                                                                                                                                                                                                                     |
| --- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 15  | Try to publish English only                       | Compiler, twice: `typeof en` on the Thai dictionary index and per namespace. `tests/unit/dictionary-namespaces.test.ts` for key order                                                                                            |
| 16  | Try to publish with an em dash                    | `lib/content/houseStyle.ts`, `tests/unit/house-style.test.ts`                                                                                                                                                                    |
| 17  | Try to publish a link to nothing                  | **Not yet.** Needs Wave 3's schema. `sectionPalette.ts` declares the rule; nothing enforces it                                                                                                                                   |
| 19  | Try to create a service with no retention rule    | `lib/services/defineService.ts` rule 6. **Rule frozen, validator is a Wave 4A stub**                                                                                                                                             |
| 34  | Find out why a page will not publish              | Partly. Every validator returns findings with a field path and a bilingual message rather than a boolean, which is the precondition. Whether the message is _understandable_ is row 34's real content and is an officer question |
| 36  | Try to publish a photograph with no Thai alt text | `components/bds/imageContract.ts`, `tests/unit/bds-contracts.test.ts`                                                                                                                                                            |
| 37  | Mark a photograph decorative                      | Same. Asserts the field hides and `alt=""` renders                                                                                                                                                                               |
| 42  | Try to hand in a found student ID card            | **Not yet.** Wave 4D                                                                                                                                                                                                             |

Row 7 (renaming a slug 301s automatically) has half its backing: `lib/redirects.ts` and
`tests/unit/redirects.test.ts` cover the **1.0 to 2.0** map exhaustively, walking the real
sitemap. The **officer-initiated** rename that row 7 actually describes depends on `slugHistory`
in `lib/content/lifecycle.ts` and is enforced only once Wave 3 exists.

---

## Rows no test can pass, and why

**Rows 1 to 14, 18, 20 to 33, 35, 38 to 41, 43 to 47.** These ask whether an officer can do a
thing. A test can prove the button exists and the API returns 200; only a person can find out
whether they knew where to click, whether the label made sense in Thai, and whether they gave up.
§8.2 is explicit that this is the number to watch: "an editing surface nobody can face using is
functionally the same as no editing surface", and the site goes back to being published by
whoever is comfortable with git.

Four deserve calling out separately, because each is a place where a passing automated check
would be actively misleading:

- **Row 25, turning emergency mode OFF under pressure.** The row's condition is "two people can
  do it; **both have done it once in practice**". That is a rehearsal requirement. No test can
  be a rehearsal.
- **Row 27, a welfare case.** §5.4 requires that the narrative stays out of the store, reads are
  audited as well as writes, and anonymous means anonymous including in the audit trail. §11.7
  requires this service to be built last, alone, and reviewed by someone other than its author.
  A green test here without that human review would be the most dangerous artifact in the
  project.
- **Row 39, taking down a photograph a student objects to.** The condition is "gone from the live
  site in minutes". §4.7E makes this a service standard measured in days rather than the general
  thirty. Whether BIRSA actually meets it is an operational fact about the committee.
- **Row 48, do all of the above with the IT officer unreachable.** This is the whole test, and it
  is the one row whose subject is the absence of a person.

---

## Rows that are deliberately still code

§12 closes by naming them, and the plan asks that anyone claiming this delivers "no code" be
shown the list too. From §6.12:

change the site's colours or typography; add a new page section type; add a new question type;
change a retention rule; mark a service sensitive; change permissions logic.

Each has a contract file in this repository, each is frozen, and each is a real job. §6.12's
own summary is the honest one: this is "what IT actually does afterwards", it is a better job
than the one it replaces, and it is not "publish this for me by Friday".

---

## How to run the test

It is not run in a terminal. §12 is a session with real officers and real phones. What this
repository can do beforehand is make sure that no row fails for a reason a test would have
caught, so that the session spends its time on the rows that need people.

Before booking it, the orchestrator runs `npm run test` and confirms the rows in the first table
are green. That is the extent of the claim.
