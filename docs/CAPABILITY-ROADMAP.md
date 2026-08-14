# BIRSA Portal: organisational capability roadmap

This document reads BIRSA's own committee structure off the repository, asks what each
portfolio actually does, and works out what the portal could do for each of them. It then
sets out how to build those things so that the work of ten portfolios does not queue behind
one assistant officer with commit access.

It is a proposal for the committee to decide on, not a spec that has been agreed. Nothing
here has been built.

Sources: `content/committee.ts`, `content/activity/roleInfo.ts`,
`content/activity/{en,th}/*.mdx`, `content/reporting.ts`, `content/privacy/register.ts`,
`db/migrations/*.sql`, `lib/inventory/*`, `docs/EDITING.md`, `docs/PROJECT-BRIEF.md`.

---

## 1. The organisation as the repository records it

Twenty-one people in two tiers.

### Officers

| Role                                       | Scope recorded in `roleInfo.ts`                                  |
| ------------------------------------------ | ---------------------------------------------------------------- |
| President                                  | Leads BIRSA; represents BIR students to faculty, university, and outside partners |
| Vice President and Public Relations Commissioner | Deputises for the President; owns communications and social media |
| Secretary 1                                | Official records, committee minutes, documentation               |
| Secretary 2                                | Shares the secretarial duties                                    |
| Treasurer                                  | Finances and budget: income, expenses, funds raised for events   |
| Spokesperson                               | BIRSA's official voice; public statements and committee positions |
| Academic Affairs Officer                   | Academic liaison with the faculty; surfaces academic concerns    |
| General Coordinator                        | Internal affairs and Rangsit campus matters; day-to-day running  |
| Sport Coordinator                          | Sports activities, inter-faculty and inter-university competition |
| Rights Advocate and Student Welfare Officer | Rights and welfare concerns; advocacy and resolution             |

### Assistant officers

Secretariat, Academic Affairs, Public Relations (three people), Sport Coordination, Rights
Advocacy and Welfare, Student Activities, Merchandise, Foreign Students Assistance, IT
Infrastructure.

### Five things the structure tells us

**Four portfolios exist only at assistant level.** Student Activities, Merchandise, Foreign
Students Assistance, and IT Infrastructure have no officer above them holding the same brief.
Activities and merchandise are the two portfolios that touch the most students and the most
money. IT owns the entire digital estate alone.

**The IT portfolio is a single point of failure, and it is the junior tier.** Every change to
the site currently needs a git commit (`docs/EDITING.md`, "How publishing works"). So the
Public Relations officer cannot publish news, the Treasurer cannot publish a budget, and the
Spokesperson cannot raise an emergency banner, without one assistant officer being awake,
free, and still enrolled. That person is also junior in the hierarchy, which makes "no, not
this week" an awkward thing for them to say to the President.

**The committee turns over every year.** `content/privacy/register.ts` already reasons from
this: the two-year retention period is deliberately one number rather than a per-category
schedule, because "a student association turns its committee over annually, and a
per-category schedule nobody remembers is not a retention policy." The same logic applies to
every system proposed below. Anything that depends on undocumented knowledge held by one
student dies each June.

**Geography is a named portfolio.** The General Coordinator's Thai title
(กรรมการฝ่ายประสานกิจการภายในและรังสิต) puts Rangsit in the job title. The site currently
treats the reader as a Tha Prachan reader by default.

**BIRSA sits on a ladder and is not at the top of it.** `student-bodies.mdx` sets out four
levels: BIRSA, the Political Science Students' Committee, the Tha Prachan campus bodies, and
the university-wide bodies. BIRSA is a student association, not a university office, and
`docs/EDITING.md` already makes "say who actually decides" a content rule. Any new service
has to respect that boundary or it will mislead students about who can fix their problem.

---

## 2. What the site does today, and who it serves

| Surface                                    | Portfolio it serves        | How it is changed today       |
| ------------------------------------------ | -------------------------- | ------------------------------ |
| News and events (MDX)                      | Public Relations, Spokesperson | Git commit                 |
| Activity calendar and the `.ics` feed      | Student Activities         | Git commit (`content/calendar/events.ts`) |
| Committee roster and role descriptions     | Secretariat                | Git commit                     |
| Regulations library                        | Rights and Welfare, Secretariat | Git commit                |
| Club directory and "start a club" form     | Student Activities, Sport  | Git commit; form emails out    |
| Student-life guides, home and international | Welfare, Foreign Students Assistance | Git commit          |
| Smart Answers                              | Academic Affairs, Welfare  | Git commit                     |
| Course review catalogue                    | Academic Affairs           | Git commit. Students are invited to submit a review "via /contact", which means an email that someone then hand-copies into a TypeScript file |
| Study plan tool                            | Academic Affairs           | Client-side only; collects nothing |
| Equipment loan and the CBEMS console       | Whoever holds the equipment | **Self-service console**      |
| Satisfaction feedback and its console page | Whole committee            | **Self-service console**       |
| Emergency mode                             | President, Spokesperson    | Vercel Edge Config dashboard   |
| Contact, start-a-club, PDPA rights forms   | Everyone                   | Email out via Resend. No state, no reference number, no record that anyone replied |
| Transparency page                          | Treasurer, Secretaries     | **Placeholder. Budget, minutes, election results, and bylaws are all empty** |

The pattern is stark. BIRSA has ten portfolios. The portal has industrialised exactly one
workflow end to end, the equipment loan, and it is the workflow that belongs to no named
officer. Everything else is either a page that needs a developer, or an email address with no
memory.

The transparency placeholder is the clearest symptom: it is a page written for the Treasurer
and the Secretaries that neither of them can fill in.

---

## 3. What more the site can do, portfolio by portfolio

Each item below names the officer who would own it, what it replaces, and how much of the
existing codebase it reuses. Items marked **(reuses loan pattern)** are variations on a flow
the site already runs: a public request form, a reference number, an officer queue, and a
status lookup that needs no account.

### President

- **Commitment tracker.** `this-year.mdx` lists what the committee is keeping, bringing, and
  fixing: the Common Room renovation, Movie Day voting, Wellness Days, the Seminar and Book
  Fair, new fundraising for clubs. None of these has a status anyone can check. A tracked list
  with an owner and a state per commitment turns a manifesto into something a successor
  inherits and a student can hold the committee to.
- **Handover pack.** A print view, per portfolio, of open cases, assets held, recurring dates,
  external contacts, and account custody, generated from live data at the end of a term. This
  is the direct answer to annual turnover.
- **Representation log.** Which faculty or university meeting BIRSA attended, when, and what
  was raised. Feeds the Spokesperson and the transparency page.

### Vice President and Public Relations

- **Publishing without git.** The single highest-value change on this list. See section 4.
- **Scheduled publication.** A post written on Tuesday that goes live on Friday. Today
  everything is instant on merge, so announcements have to be timed by hand.
- **Managed link-in-bio.** `/quick` already exists and already does the job; PR just cannot
  reorder it without a commit.
- **Campaign links with counts.** A `/go/<slug>` redirector managed in the console gives PR
  per-post click counts from the Instagram bio without adding a tracking vendor or a cookie.

### Secretaries

- **Minutes and agenda register.** Document number, date, attendance, and the decisions taken.
  This is what the transparency placeholder is waiting for.
- **Decision log.** Decisions lifted out of minutes into a searchable list, each with an id, a
  date, a subject, and an outcome. Smart Answers already has an `owner` field for saying who
  decides; a decision log is what it should be able to cite.
- **Announcement register.** Numbered official announcements (ประกาศ), published bilingually,
  with the decision that authorised each one.
- **Attendance and quorum.** Evidence that a meeting was quorate, recorded once rather than
  argued about later.

### Treasurer

- **Published budget against actual spend, per activity.** The other half of the transparency
  placeholder.
- **Reimbursement claims (reuses loan pattern).** A student or club officer submits a claim
  with a receipt photo, gets a reference, and can check whether the Treasurer has approved it.
  Vercel Blob is already configured for photo upload; the approval queue is the loan decision
  queue with different labels.
- **Club and sports funding applications (reuses loan pattern).** `this-year.mdx` commits to
  new fundraising "so sports teams and clubs get more resources, instead of a thin budget
  stretched across everyone". An application form, a decision queue, and published outcomes
  make that commitment auditable.
- **Merchandise ledger.** Shared with the Merchandise portfolio, below.

### Spokesperson

- **Statements archive.** Dated, bilingual, tagged by subject, linked to the minute that
  authorised the position.
- **Emergency mode from BIRSA's own console.** Emergency mode already works without a redeploy,
  but flipping it needs access to the Vercel dashboard, which means it needs IT. A console page
  over the same Edge Config value moves that to the Spokesperson and the President, which is
  where it belongs. Emergencies do not wait for a student to check their messages.
- **Press and enquiry routing.** The contact form has categories but one destination inbox.
  Route by category to the right portfolio instead.

### Academic Affairs

- **Student-submitted course reviews with moderation.** The catalogue already has a
  `reviewCount` field and a "no review yet" state that asks students to write in. Turning that
  into a submission form with an Academic Affairs moderation queue converts a manual
  email-to-TypeScript pipeline into a service.
- **Academic issue intake with pattern reporting.** One student saying a section clashes is an
  anecdote; eleven saying it is evidence the officer can take to the programme. Intake with a
  reference, plus an anonymised aggregate view, changes what the officer can do in a meeting.
- **Elective demand signal.** The study plan tool already knows which electives students are
  planning to take, client-side. An opt-in, aggregate-only submission ("share my plan
  anonymously with Academic Affairs") would give the officer real demand data for the programme
  office, at the cost of one checkbox. Opt-in and aggregate are not optional here; see
  section 5.
- **Handoff from the study plan.** A "ask Academic Affairs about this plan" route that carries
  the plan summary, so the officer is not reconstructing it from a chat message.

### General Coordinator

- **Campus as a reader fact.** `/answers/you` already stores origin, stage, and role. Adding
  campus lets shuttle information, opening hours, and location advice adapt for Rangsit readers
  instead of assuming Tha Prachan.
- **Common Room booking (reuses loan pattern).** Once the renovation lands. Migration
  `007_btree_gist_exclude.sql` already installs the exclusion constraint that stops two
  bookings overlapping, because the loan service needed exactly that. A room is an item with a
  calendar.
- **Internal committee dashboard.** What each portfolio owes, and by when. Internal only.

### Sport Coordinator

- **Fixtures, results, and standings** for inter-faculty and inter-university competition.
  Currently these live on Instagram stories and vanish.
- **Trials and team sign-up with capacity limits.**
- **Kit issue per team.** CBEMS already models club custodians separately from BIRSA's own
  stock, so a club's kit can be tracked by that club's own officer without giving them access
  to everything else.

### Rights Advocate and Student Welfare

This is the highest-stakes portfolio and the one with the weakest tooling.

- **Case tracking with a promise the system keeps.** `content/reporting.ts` tells students
  "reports are processed within 48 hours, with the utmost secrecy and care." Today a report is
  an email, and nothing anywhere measures those 48 hours. A minimal case record (reference,
  category, opened, acknowledged, closed) with automatic escalation to the President when a
  case goes unacknowledged is what turns that sentence from a hope into a commitment.
- **A status page for the person who reported.** Reference number, no account, same mechanism
  as the loan status lookup. It removes the worst part of reporting something: silence.
- **Anonymous reporting with a claim code**, so a student can follow up without ever giving a
  name.
- **Published aggregate counts, quarterly.** How many reports, in what categories, how many
  closed. Accountability without identifying a single person.

The data minimisation rules for this are strict and are set out in section 5. If they cannot
be met, build the status page and the escalation timer only, and leave the narrative in email.

### Student Activities

- **Event sign-up with capacity, waitlist, and check-in.** Today this is MDX plus a Google
  Form. In-house sign-up gives capacity control, a real waitlist, and check-in on the door.
  It also removes a processor: `docs/pdpa/processor-agreements.md` exists because sending
  student data to an external form provider is a thing BIRSA has to account for.
- **Movie Day voting.** `this-year.mdx` commits to "letting students vote on which films get
  shown, instead of the committee picking alone". That commitment currently has no
  implementation anywhere. A simple poll is a weekend of work and it is already promised.
- **Volunteer shifts.** `birsa.mdx` says many activities rely on volunteers and short-term
  helpers. A shift roster is how you stop recruiting them one Instagram story at a time.
- **Post-event feedback.** The `satisfaction_feedback` table and its console page already
  exist; point them at an event id.

### Merchandise

- **Catalogue and pre-order (reuses loan pattern).** Size, quantity, pickup slot, reference,
  status lookup.
- **Stock levels.** CBEMS already tracks consumables with `qty_on_hand` and a reorder
  threshold. Merchandise is a consumable item with a price.

### Foreign Students Assistance

- **Immigration deadline reminders.** The 90-day report is a real recurring obligation that
  catches people out. An opt-in reminder, or an `.ics` the student subscribes to, needs almost
  no data.
- **Arrival checklist that keeps state client-side**, the same way the study plan does, so
  BIRSA collects nothing at all.
- **Buddy matching for arrivals**, run by the portfolio rather than by luck.
- **Translation and paperwork help requests**, routed to this portfolio rather than to the
  general inbox.

### IT Infrastructure

The proposal for this portfolio is that it stops being the publishing bottleneck and becomes
what its title says: infrastructure. Platform, access, backups, upgrades, and the runbook.
Content and configuration move to the portfolios that own them. That is section 4.

---

## 4. Building all of this without routing it through the IT officer

### The core idea: separate four kinds of change

Almost every proposal above fails for the same reason if it is built the obvious way. The fix
is to stop treating "changing the site" as one activity. There are four, and they need
different mechanisms and different people.

| Kind              | Example                                              | Who should be able to do it     | Today                |
| ----------------- | ---------------------------------------------------- | ------------------------------- | -------------------- |
| **Content**       | A news post, an event date, a committee photo        | The portfolio that owns it      | Git commit (IT)      |
| **Configuration** | Emergency mode, contact routing, a feature on or off | An authorised officer, at runtime | Git commit or Vercel dashboard (IT) |
| **Operations**    | A loan decision, a welfare case, a sign-up           | The officer on duty             | Console (correct already) |
| **Code**          | A new feature, a schema change                       | IT and their successors         | Git commit (correct already) |

Buckets one and two are currently stuck in bucket four. That is the whole defect, and it is
also the whole fix.

### A. Grow the officer console into BIRSA's console

The most important asset in this repository is not any page; it is
`lib/inventory/auth.ts` and the `officers` table. BIRSA already has per-person accounts with
scrypt-hashed passcodes, signed 12-hour sessions, role checks (`requireRole`), scope checks
(`canManageCustodian`, so a club officer sees only their club), an audit log, CSV export, rate
limiting, a nonce-based CSP for officer routes, and a house rule that every module degrades to
"not configured" rather than crashing.

That is an identity and permissions system. It was built for equipment, but nothing about it
is equipment-specific. Every module proposed above should reuse it rather than invent a second
login.

Two changes make it general:

1. **Portfolio-shaped permissions.** `Role` is currently
   `admin | inventory_manager | loan_officer | read_only`. Add grants that name portfolios and
   verbs (`news:publish`, `finance:approve`, `cases:read`, `emergency:toggle`) so the President
   can give Public Relations the right to publish without an IT commit and without making them
   an admin of the equipment system.
2. **A console shell that is not the inventory console.** `app/[lang]/officer/inventory/` is
   already the pattern: a layout with nav, per-page auth gating, and forced dynamic rendering.
   Lift that to `app/[lang]/officer/` and hang the new modules off it.

Cost is moderate. Payoff is that every subsequent module is cheap, because auth, audit,
scoping, and the console chrome are already done.

### B. Move the fast-moving content into the database, and only the fast-moving content

Not all of it. The decision rule is how often it changes and how much a mistake costs.

**Move to the database, edited in the console:**

- News and events, with draft, scheduled, and published states
- The activity calendar
- The committee roster and role descriptions, because it churns completely every year
- Quick links
- The club directory

**Leave in git, edited by pull request:**

- Student-life guides, the regulations library, Smart Answers, curriculum data, the privacy
  register

These change slowly, carry real consequences when wrong, and are protected by a test suite
that would have to be rewritten as runtime validation to move them. Keep the safety net.

Three implementation details matter more than the choice itself:

- **Read through, fall back to files.** `getEntries()` should try the database and fall back to
  the MDX loader. That preserves the existing contract that the site builds and renders with no
  environment configuration at all, and it lets the migration happen one content type at a
  time instead of as one frightening cutover.
- **Both languages before publish, enforced in the schema.** A console that lets someone
  publish English only will produce a half-Thai site inside one term. The rule already exists in
  `docs/EDITING.md`; make it a constraint rather than a convention.
- **House style becomes a validation message, not a build failure.** Today an em dash in
  content fails the build. In a console it should be an inline error next to the field, in the
  editor's own language, that they can fix themselves in five seconds. Same rule, radically
  different experience for a non-technical officer.

### C. The cheaper interim: keep git, remove the developer

If the committee does not want to build and maintain a CMS, most of the bottleneck can be
removed without one. This is a realistic option for a student organisation and it can start
this month.

- **A "new post" issue form.** The officer fills in a form on GitHub. An Action generates the
  two MDX files with correct frontmatter and opens a pull request. They never see a file path.
- **Preview deployments.** Vercel already builds a preview URL for every pull request. The
  officer sees their post before it is live, on their phone.
- **A content-only check** that runs the content tests and the formatter, so feedback is
  seconds rather than a full build.
- **Merge rights for two or three officers**, not one. Whoever merges is doing review, not
  development.
- **A git-backed CMS** (Decap, Sveltia, or similar) gives a visual editor with no database at
  all, at the cost of an OAuth proxy that someone has to keep running. It is a real option, but
  be honest that it swaps one piece of infrastructure knowledge for another.

Recommended path: **C now, B for the five fast-moving content types once C proves what people
actually edit, A alongside B.** Building the console first and discovering nobody publishes
news is the expensive mistake.

### D. Configuration at runtime, not in the source

Emergency mode already proves the pattern: a value outside the codebase changes site behaviour
with no redeploy. Extend the idea, but put the switch on BIRSA's own site rather than in a
vendor dashboard.

- Keep Edge Config for emergency mode specifically. It is the one thing that must work when
  the application itself is broken, and it is deliberately independent of the database.
- Put everything else (feature flags per module, contact routing, homepage ordering, sign-ups
  open or closed) in Postgres behind a cache tag, so a console page can change it and call
  `revalidateTag`. No extra vendor access, no extra credential to lose.

### E. Design every intake so that no officer is needed for the common case

The reason the President and the Secretaries get so much mail is that email has no memory. The
loan service already solved this and nothing else uses the solution.

Every new intake flow should have, from day one:

- **A reference number and a status page** that needs no account. This removes the entire "did
  you get my message?" category of work.
- **An automatic acknowledgement** that states the actual service standard, for example the 48
  hours that `reporting.ts` already promises.
- **An escalation on the daily cron.** `/api/cron/daily` already exists and already runs loan
  reminders and the PDPA purge. It is the natural place for "this case has been unacknowledged
  for 24 hours, tell the Rights Officer and copy the President." Escalation is what makes a
  system survive an officer having a bad week, which every student officer will.

### F. Handover as a feature, not a tradition

This is the highest-value item in the whole document relative to its cost, and most of it is
not code.

- **Account custody.** Verify that the GitHub repository, the Vercel project, the domain and
  DNS, the Resend account, the Postgres and Blob stores, and the Edge Config store are all
  owned by a BIRSA-controlled account (`birsa@tu.ac.th`), not by any student's personal
  account. If any of them is personal, BIRSA loses that asset the week that person graduates.
  This should be checked before anything else on this list is built.
- **At least two admins at all times**, one of whom is the President or a Secretary rather
  than IT. `scripts/seed-admin-officer.mjs` bootstraps the first one; the console creates the
  rest. Nobody should be the only holder of anything.
- **Term dates on officer accounts.** The `officers` table already has `is_active`. Add a term
  end so accounts expire by default instead of by memory.
- **A written runbook** for the ten things that break, and a handover checklist per portfolio
  that the outgoing officer completes in the console.

### G. What IT actually does afterwards

Platform upgrades, dependency and security updates, backups and restore drills, new modules,
schema changes, the runbook, and the accessibility and performance budgets. That is a real
job and a better one. It is not "publish this for me by Friday."

---

## 5. Constraints that shape every option above

These are not obstacles to route around. They are why the obvious version of several ideas is
the wrong version.

**PDPA.** `content/privacy/register.ts` is the site's single record of what personal data it
handles, and three public pages render from it. Every new feature that collects anything needs
an entry there, a lawful basis under section 24, a retention trigger, and a matching deletion
path in `lib/privacy/retention.ts`. The register deliberately avoids relying on consent,
because Thai majority is twenty and most first-year students are minors whose consent would
need a guardian. Design to that: **prefer features that collect nothing.** The study plan tool
is the model, and the arrival checklist and the elective demand signal should follow it.

**Welfare case data is the most sensitive thing BIRSA will ever hold.** If a case tracker is
built: store a reference, a category, timestamps, and a status, and keep the narrative out of
the database unless there is a real reason for it to be there. Restrict reads to the single
role that needs them. Audit reads as well as writes, which the current `audit_log` does not
do. Set a retention period shorter than the general two years. Anonymous reporting must mean
anonymous, including in the audit trail.

**Bilingual parity.** Enforced at the schema level or it will not hold.

**Accessibility and progressive enhancement.** WCAG 2.2 AA, forms that work without
JavaScript, tests in `tests/e2e/a11y.spec.ts` and `progressive-enhancement.spec.ts`. New
console pages are not exempt; officers use phones and some of them will use a screen reader.

**Graceful degradation.** Every module reports itself as not configured rather than throwing.
This is what lets the site build and run with no environment at all, and it is why a
half-finished module never takes the site down.

**Never state a procedure BIRSA does not have.** `docs/EDITING.md` makes this a rule for Smart
Answers, with `out-not-covered` as the honest fallback. It applies just as much to publishing:
a budget page that says "coming soon" for two years is worse than a page that says BIRSA does
not currently publish this.

**BIRSA is not a university office.** Any new service has to say who actually decides. A
service that looks like it can change a grade, an enrolment, or a fee will send students to
the wrong desk at the worst moment.

---

## 6. What not to build

- **Online voting.** Elections are run by the Election Commission of Thammasat University and
  the relevant council. A student-built ballot system is a security and credibility trap with
  no upside. Publishing candidate information, turnout, and results is useful and safe.
- **Anything that mirrors a registrar function.** Grades, enrolment, fees, transcripts. Link
  to `reg.tu.ac.th` and the programme office.
- **A second login for students.** Every proposal above works with a reference number and no
  account. Keep it that way: accounts mean passwords, resets, and a permanent identity
  database, all for services a student uses twice a year.
- **A chatbot over this content.** Smart Answers is a deliberate design: one reader, one
  answer, with citations to real provisions and an honest "there is no rule on file" outcome.
  A model that improvises procedures would undo that.
- **General analytics on welfare or academic complaint pages.** Do not instrument the pages
  where being observed is the reason someone does not report.

---

## 7. Suggested sequence

**Phase 0, this month, almost no code.** Confirm account custody. Create a second and third
admin. Write the runbook. Decide which of the transparency placeholders BIRSA will actually
fill, and remove the ones it will not.

**Phase 1, publishing without git.** Option C first: the issue-form-to-pull-request flow,
preview deployments, and merge rights for more than one person. Move emergency mode onto a
console page for the Spokesperson and the President.

**Phase 2, intake that remembers.** Welfare case references, acknowledgement, and cron
escalation. Event sign-ups with capacity. Both reuse the loan pattern; both replace a
process that currently loses things.

**Phase 3, the console proper.** Portfolio permissions, the general officer shell, and
database-backed news, calendar, and roster with draft and scheduled states.

**Phase 4, transparency and handover.** Minutes, decisions, budget against actual, the
commitment tracker, and the generated handover pack.

**Phase 5, portfolio depth.** Fixtures and results, merchandise pre-orders, student-submitted
course reviews, the elective demand signal, Rangsit as a reader fact.

Each phase is useful on its own. None of them requires the next one to exist.

---

## 8. Decisions the committee needs to make

1. Are all the platform accounts owned by BIRSA rather than by a student? If not, fixing that
   comes before everything else here.
2. Who, other than IT, is allowed to publish, and does the committee want that to be a git
   flow (cheap, some friction) or a console (more work, no friction)?
3. Does BIRSA want to hold welfare case records at all, or only timestamps and a status? Both
   are defensible. Deciding by accident is not.
4. Which transparency documents will actually be published, and by when? The placeholder page
   is a promise that is currently ageing.
5. Movie Day voting is already promised in this year's plan. Is it in scope for this committee
   or is the commitment being carried over?
