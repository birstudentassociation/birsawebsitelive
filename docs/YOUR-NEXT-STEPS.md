# What you need to do next

Three things block all remaining work. Nothing else is waiting on anything.

Do them in this order. Task 1 has a waiting period, so start it first and do the
other two while it sits.

---

## Task 1. DONE. Sanity project exists

Project `vbo54y9j`, dataset `production`, free plan, owned by
birstudentassociation@gmail.com. Wave 3 is running.

Two things still worth doing, neither blocking:

**Apply for the non profit plan anyway.** You accepted the free plan knowingly,
and that decision stands, but the application costs nothing and the non profit
plan removes both limits you accepted. The two limits are real: every officer who
can edit anything is an administrator of everything, and document history is kept
for three days, so an officer's mistake from last week is a developer's problem
again. Apply here, and the text to paste is below.

https://www.sanity.io/contact/sales?type=nonprofit

```
BIR Student Association (BIRSA) is the student association of the Bachelor of
Arts in Interdisciplinary Studies, Social Sciences programme at the Faculty of
Political Science, Thammasat University, Bangkok, Thailand.

We are a student run, non commercial organisation. We publish a bilingual Thai
and English portal for students in the programme: news, events, guides,
regulations, committee minutes and decisions, and a small number of student
services such as equipment loans.

We have no revenue and no budget for software. The site is maintained by
student officers who change every June, which is why editorial permissions and
version history matter to us more than they might to a commercial team.

We are asking to use Sanity as the content platform so that officers can
publish and correct content without a developer.
```

**Set the environment variable.** Wave 3 needs a read token to preview drafts.
Create one in the Sanity project under API, Tokens, with **Viewer** permission,
then add it in Vercel under the project's environment variables.

```
SANITY_API_READ_TOKEN
```

Give it Viewer, not Editor. Preview only needs to read.

---

## Task 2. Test the navigation with ten students

**Time** about one hour total.
**Unblocks** Wave 5, the page rebuild, which is six agents of work.

The plan calls this the highest value hour in the whole project. Everything
built in Wave 5 assumes this navigation is right, and right now it is a
reasonable guess that nobody has tested.

### 2a. What you are testing

The proposed top level is five items.

```
Do something     everything BIRSA does for you, all services in one place
Get help         answers, guides, the rules, reporting, welfare, international
What's on        news, events, the calendar, clubs, sport
Your studies     study plan, course reviews, curriculum, electives
About BIRSA      committee, minutes, decisions, budget, elections, contact
```

### 2b. How to run it

Find ten students. A mix of years, and at least three international students,
because they use the site differently.

Do it one at a time. Two minutes each. Do not explain the site first.

Ask them where they would click to do each of these. Read the task, not the nav
item name.

```
1.  You want to borrow a camera for a class project.
2.  You are not sure whether you can drop a course this late in the term.
3.  You want to know when the next general meeting is.
4.  Someone in your class is harassing you and you want to report it.
5.  You want to see what the committee spent this semester's budget on.
6.  You need to pick your electives for next term.
7.  You lost your student card somewhere on campus.
8.  You want to join a club.
```

### 2c. What to write down

For each task, just the first thing they say. Not where they end up after
thinking about it. First instinct.

```
Task 1: student 1 said ___, student 2 said ___, ...
```

### 2d. What the result means

- **Eight or more of ten pick the same item** for a task. That item is right.
- **They split between two items.** The two items overlap and the label is
  doing the work the structure should do.
- **They hesitate or say "search"**. The item is missing, or its name is a
  BIRSA word rather than a student word.

Send me the tally. I do not need the notes, only which item each student picked
for each task.

### 2e. Expect at least one to be wrong

If all five items test perfectly, be suspicious of the test rather than pleased
with the navigation. The most likely to fail is **Do something**, because it is
the newest idea and the least like anything students have seen on this site.

---

## Task 3. Approve the scope audit

**Time** 45 minutes reading, plus a committee decision on the flagged rows.
**Unblocks** the rest of Wave 5, and Wave 6.

### 3a. Read the recommendation

It is in the repository at

```
docs/SCOPE-AUDIT-2.0.md
```

Thirty four rows. For each one it recommends **keep**, **absorb**, **signpost**
or **delete**, with a reason.

Summary of what it recommends: keep 22, signpost 6, absorb 6, delete 0.

### 3b. Read section 4 first

Section 4 of that document is titled read these first. It is the rows where
being wrong has real consequences for a student: visas, immigration, work
rights, money, health, insurance and legal status.

For those rows the question is not whether the page is good. It is whether
BIRSA should be the one publishing it at all, given that the authoritative
source will change without telling us.

### 3c. The test to apply to every row

One question, from the plan.

> Does BIRSA add anything by publishing this, or is it restating a university,
> faculty or government page that will be updated without BIRSA noticing?

A page that goes stale silently is worse than no page, because a student acts
on it.

You have already seen two live examples of this happening: the printing quota
said 100 baht on two pages and 200 on a third, and the BIR office contact was
wrong on the About BIR page. Both were internally consistent, well written and
confidently wrong.

### 3d. Four rows need a person, not an editorial call

The audit could not classify these. They are listed in the document. One of them
needs somebody to ring two phone numbers and find out which is answered.

### 3e. Tell me the result

You do not need to write anything formal. Just tell me which rows you are
changing from the recommendation, like this.

```
Row 12 signpost not keep
Row 19 keep not absorb
Everything else as recommended
```

If you accept all of it, say so and I will proceed on that basis.

---

## What I do when each one lands

| You finish                         | I start                                         |
| ---------------------------------- | ----------------------------------------------- |
| Task 1, Sanity accepted or refused | Wave 3, the CMS, five agents                    |
| Task 2, card sort tally            | Wave 5, the page rebuild, six agents            |
| Task 3, audit approved             | The signpost and redirect work in Waves 5 and 6 |

Any one of them unblocks real work on its own. You do not need to finish all
three before telling me.

---

## One more thing, not blocking, but it is people work and it is cheap

Account custody. The plan calls this the first task in the whole programme and
the cheapest and most important thing in either document.

Every one of these should be owned by **birsa@tu.ac.th**, not by any student.

```
GitHub repository
Vercel project
Domain and DNS
Resend
Postgres
Blob storage
Edge Config
Sanity, once it exists
```

If any of them is currently owned by a student account, that account leaving in
June takes BIRSA's infrastructure with it. Transferring ownership costs nothing
and takes an afternoon.
