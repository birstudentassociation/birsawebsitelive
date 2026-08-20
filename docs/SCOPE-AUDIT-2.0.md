# BIRSA Portal 2.0. Scope audit (§3.6, gate 2)

## 1. What this document is

This is a recommendation, not a decision. `docs/REDESIGN-2.0.md` §3.6 and
`docs/DECISIONS-2.0.md` gate 2 both say the disposition of each page is a
committee judgement, and an agent may not make it. Nothing in this audit has
been acted on. No content file has been edited, moved or deleted. No entry in
`lib/redirects.ts` has been added, because that file is frozen and any new
rule it needs is listed here as "needed" for the committee and Wave 5 to add
once a disposition is approved.

Prepared 2026-08-20. Every claim about "what a page covers" and every
staleness signal below comes from reading the file, not from its title or
frontmatter summary.

## 2. Summary counts

Counted across the three student life tracks (23 documents, not 24, see
section 6), `/services/university-services`, and the 10 emergency scenario
files. Smart Answers nodes are reviewed separately in section 3.6 and are not
counted here, because they are not independent pages with their own URL.

| Disposition | Count | Where                                                                                             |
| ----------- | ----- | ------------------------------------------------------------------------------------------------- |
| KEEP        | 22    | 7 handbook docs, 3 home docs, 2 international docs, 10 emergency scenarios                        |
| SIGNPOST    | 6     | 2 home docs, 3 international docs, `/services/university-services`                                |
| ABSORB      | 6     | 5 home docs, 1 international doc                                                                  |
| DELETE      | 0     | None recommended outright. Every candidate either has a BIR-specific slice or works as a signpost |

Zero DELETEs is itself a finding worth the committee's attention, not a sign
the audit went easy. See section 4.

## 3. The full audit

### 3.1 Handbook track (`content/student-life/{en,th}/handbook/`)

The programme's own material. Every document here is BIR's to publish and
nobody else will ever write it, which is exactly what §3.6 says KEEP means.
Reading each one surfaced internal inconsistencies worth fixing regardless of
disposition.

| Path                                     | What it actually covers                                                                                          | Disposition | Target | Reason                                                                                                        | Redirect needed                                                     | Staleness signals found                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handbook/about-bir.mdx`                 | Programme welcome, a history of Thammasat and the Faculty, and the BIR office's contact details                  | KEEP        |        | Only BIR can publish its own office's contact details                                                         | None. Covered by the existing `/student-life/handbook` subtree rule | BIR office phone and email here (`02-613-2304`, `bir@staff.tu.ac.th`) do not match `internship.mdx` (`02-221-6111 ext. 3409`, `bir@tu.ac.th`) or the facts BUILD-BRIEF-2.0.md §3 states. One of these three is wrong                                                                                                                                                                                                                                                               |
| `handbook/academic-activities.mdx`       | Exchange partners, BIR conferences, the annual field trip, BISC                                                  | KEEP        |        | BIR-run programmes with no other publisher                                                                    | None                                                                | Names a named officer, "Ms Suphorn Mukphimphan", at a personal `gmail.com` address for an office contact. A personal address for an official contact is fragile if she moves roles                                                                                                                                                                                                                                                                                                 |
| `handbook/academic-life.mdx`             | Registration, adding/dropping, exam absence, leave, probation and dismissal rules, plagiarism                    | KEEP        |        | The BIR-specific rewrite of TU regulations that students actually read                                        | None                                                                | Cites "Bachelor Degree Regulations, 3rd Edition (2012)" by name. If TU has issued a newer edition since, the citation is wrong even if the rule text is still correct                                                                                                                                                                                                                                                                                                              |
| `handbook/admission-and-fees.mdx`        | Programme rationale, entry requirements (GPA, TOEFL/IELTS/TU-GET/SAT/GSAT), bi-semester structure, tuition table | KEEP        |        | Admission criteria are BIR's to set and publish                                                               | None                                                                | Says the programme was "established since 2008"; BUILD-BRIEF-2.0.md §3 says "Founded 2009". Tuition figures (125,000 / 144,000 baht) are a figure that changes; no year is attached to them so a reader cannot tell how current they are                                                                                                                                                                                                                                           |
| `handbook/assessment-and-degree.mdx`     | Grade scale, the 127-credit degree requirement, honours criteria                                                 | KEEP        |        | BIR's own grading and honours rules                                                                           | None                                                                | States 127 credits; BUILD-BRIEF-2.0.md §3 says "about 126 credits". Minor, but another instance of the same figure disagreeing across the site's own sources                                                                                                                                                                                                                                                                                                                       |
| `handbook/curriculum-and-study-plan.mdx` | The full 127-credit course structure and a recommended four year plan, tied to "Curriculum 2021, 2023 revision"  | KEEP        |        | The single most BIR-specific document on the site; feeds the study plan service                               | None                                                                | Explicitly a snapshot of one curriculum revision. `docs/curriculum-sources.md` (crawled 2026-08-01) documents real contradictions across the university's own source PDFs for this same curriculum (credit totals given as both 91 and 94 in different official documents). The next curriculum revision will make this page wrong until someone updates it                                                                                                                        |
| `handbook/internship.mdx`                | Internship eligibility, forms, a cohort-specific schedule, marking, contact                                      | KEEP        |        | The internship is run by the BIR programme office and BIRSA is the only one who would write this for students | None                                                                | **Reads as true for one specific cohort.** The schedule table is headed "For students with ID 66, academic year 2025 (B.E. 2568)" with specific 2025 to 2026 dates. Both form links are Google Forms and both evaluation PDFs are hosted on a third party CDN (`image.makewebcdn.com`), none of which BIRSA controls or can verify stays live. Phone and email here (`02-221-6111 ext. 3409`, `bir@tu.ac.th`) match BUILD-BRIEF-2.0.md but conflict with `about-bir.mdx`, as above |

### 3.2 Home track (`content/student-life/{en,th}/home/`)

Nine of these ten documents carry an identical closing note reading, in
part, "Much of this page is drawn from the TU91 Handbook. The Magic of TPC,
the 2025 orientation journal published by the Thammasat University Student
Union, Tha Prachan," with a caveat that prices, hours and contacts were
correct only when that handbook was published. That is a direct, in-page admission that most of
this track is a republished copy of someone else's 2025 document, which is
the exact failure mode §3.6 exists to stop. `shuttle-bus.mdx` is the one
exception, it is a live data widget, not republished text.

| Path                              | What it actually covers                                                                                                                  | Disposition | Target                                                                                                  | Reason                                                                                                                                                                                                                                                                         | Redirect needed                                                                                                 | Staleness signals found                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home/shuttle-bus.mdx`            | Live departure countdown, route map and full weekday timetable for the two TU shuttle lines                                              | SIGNPOST    | Thammasat University's own transport channel                                                            | TU runs the shuttle, not BIRSA. This is a Tha Prachan fact, not a BIR one                                                                                                                                                                                                      | None, page stays at its URL as a signpost                                                                       | The timetable is hardcoded in `lib/shuttle.ts`, not sourced live. If TU changes the schedule, this page goes wrong silently with no engineered check (unlike the external link cron in §3.6). Flagged separately below                                                                                                                                     |
| `home/getting-around.mdx`         | How to reach Tha Prachan from the airport and BTS/MRT/boat, five routes to Rangsit, parking, landmarks                                   | ABSORB      | `/help/getting-started` (Rangsit routing slice)                                                         | The generic Bangkok transit content duplicates what Google Maps transit directions already do live, and the page says so itself. The Rangsit routing table is the one thing that is BIR-specific, since BIR classes are at Tha Prachan but BIR students sometimes need Rangsit | New rule needed, old slug to `/help/getting-started`, since the general content does not survive at its own URL | Bus and van fares (27, 45, 25, 47 baht) are figures that change. No date attached                                                                                                                                                                                                                                                                          |
| `home/getting-involved.mdx`       | 12 BIR clubs, TPC-level clubs and independent groups, TUSU/TUSC/faculty committee structure and contacts, BIRSA events, volunteering     | ABSORB      | `/whats-on/clubs` (BIR clubs, events) plus a signpost to TUSU Tha Prachan and TUSC for their own bodies | BIR clubs are BIRSA's own directory and belong with the rest of What's on. The TPC and TU-level club tables and TUSU/TUSC contact details are those bodies' own information, copied from their handbook                                                                        | New rule needed for the parts that move to `/whats-on/clubs`                                                    | TUSC's listed email is a personal-style `gmail.com` address for an official student council, not an institutional one. Source handbook is dated 2025                                                                                                                                                                                                       |
| `home/health-and-wellbeing.mdx`   | TU Virtual Clinic, TU hospital and accident insurance coverage figures, counselling routes, emergency numbers                            | SIGNPOST    | TU Student Affairs / TU Well Being / the student insurer                                                | This is TU-wide policy and TU-wide insurance cover, equally true for any Thammasat student. BIRSA did not set these figures and cannot update them if the policy changes                                                                                                       | None, page stays as a signpost                                                                                  | **High consequence, see section 4.** Coverage figures (15,000 / 150,000 / 15,000 baht) exactly duplicate `/services/university-services`, a second copy of the same numbers that can drift apart. The page itself flags one number as unverified, marking the mental health support hotline, 1323, with a note to check it is current before relying on it |
| `home/money-matters.mdx`          | Student discounts around campus, budgeting habits, tuition refund and deferral procedure                                                 | KEEP        | (trim the refund/deferral paragraph to a signpost)                                                      | The discount table and budgeting tips are curated student knowledge nobody else publishes. The refund and deferral procedure is TU/faculty policy that could change without BIRSA knowing                                                                                      | None                                                                                                            | Discount list sourced from the 2025 handbook, prices and terms may have moved                                                                                                                                                                                                                                                                              |
| `home/places-nearby.mdx`          | Around 70 mapped food places and 16 recommended dorms/condos, collected from BIRSA seniors' own Google Maps lists                        | KEEP        |                                                                                                         | No authoritative source exists for "where BIR seniors actually recommend living and eating." This fails gate test 1 (no authoritative source), so §3.6's own gate says keep it                                                                                                 | None                                                                                                            | The page discloses its own staleness well, noting that ratings and review counts are Google Maps averages as of July 2026 and should be treated as a snapshot. Good practice already in place                                                                                                                                                              |
| `home/rights-and-welfare.mdx`     | Voting in three elections, dress and title rights, free menstrual products and condoms, TPC facility hours, harassment reporting pointer | ABSORB      | `/help/regulations`                                                                                     | This is "the rules that apply to you," which is what `/help/regulations` is for. The elections content duplicates `getting-involved.mdx`. Facility hours and free-product locations are TPC-level, not BIR-level                                                               | New rule needed, old slug to `/help/regulations`                                                                | Same 2025 handbook source. Facility opening hours given to the minute with no verification date                                                                                                                                                                                                                                                            |
| `home/safety-and-emergencies.mdx` | Campus security, lost student card, complaint routing, river safety, common scams, a harassment reporting component                      | ABSORB      | `/help/reporting` (harassment reporting is core and must migrate there per the route map)               | The harassment reporting mechanism (`<ReportHarassment />`) is core BIRSA functionality, not delegable. River safety and scam patterns are genuine local knowledge worth keeping. Lost card and general complaint routing are TUSU/Registrar matters                           | New rule needed, old slug to `/help/reporting`, since the page splits across destinations                       | None dated, but bundles at least four different jobs on one page, which is itself a scope problem independent of §3.6                                                                                                                                                                                                                                      |
| `home/study-support.mdx`          | Pridi Banomyong Library, faculty libraries and hours, library card entitlements, room booking by LINE, free printing, TU-GET             | ABSORB      | `/help/university-services`                                                                             | This is TU library and TU-GET content with essentially no BIR-specific slice. It also already duplicates `/services/university-services`, which covers libraries and printing too                                                                                              | New rule needed, old slug to `/help/university-services`                                                        | **Directly contradicts another BIRSA page. See section 4.** States the printing quota as "100 baht per semester." `home/money-matters.mdx` agrees (100 baht). `/services/university-services` states "200 baht in total," split between two 100 baht funds. Two of BIRSA's own three pages disagree with the third on a concrete figure                    |
| `home/food-and-budgeting.mdx`     | Where to eat near campus with student-recommended dishes and quoted opinions, a rough monthly budget                                     | KEEP        |                                                                                                         | Curated, opinionated local recommendations with named dishes and direct quotes from students. No authoritative source publishes this and none should be expected to                                                                                                            | None                                                                                                            | Explicitly marked `placeholder`, reading "Example guidance; BIRSA will verify details before launch." Not yet verified, flagged as such in the page itself                                                                                                                                                                                                 |

### 3.3 International track (`content/student-life/{en,th}/international/`)

Every Thai version in this track is a deliberate short summary that links to
the English original ("เนื้อหาฉบับละเอียด...อยู่ในเวอร์ชันภาษาอังกฤษ"), written
for Thai buddy students and staff rather than translated in full. That is a
design choice recorded in `content/student-life/tracks.ts`, not a
translation gap, so it is not flagged as a staleness signal below.

| Path                                         | What it actually covers                                                                          | Disposition | Target                                                                                       | Reason                                                                                                                                                                          | Redirect needed                                      | Staleness signals found                                                                                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `international/arrival-and-first-week.mdx`   | Airport to campus, a setup order for the first week, a checklist, BIRSA's welcome events         | ABSORB      | `/help/getting-started`                                                                      | The BIR/BIRSA welcome content and the setup checklist are BIR-specific. Visa and enrolment items already point out to TU International Affairs                                  | New rule needed, old slug to `/help/getting-started` | None found. Already written close to how §3.6 wants a delegated page to read                                                                                                                                                                                    |
| `international/visa-and-immigration.mdx`     | Non-immigrant ED visa in outline, 90-day reporting, re-entry permits, extensions                 | SIGNPOST    | TU International Affairs and the Thai Immigration Bureau                                     | **The highest-risk page on the site. See section 4.** BIRSA has no authority over immigration law and no way to know when it changes                                            | None, page stays as a signpost                       | Already carries a "not legal advice" disclaimer throughout, which is good, but still states procedural detail (a named building, "Chaeng Watthana Government Complex," for visa extension) that REDESIGN-2.0.md §3.6 explicitly says this page should not carry |
| `international/banking-and-money.mdx`        | Opening a Thai bank account, PromptPay, everyday spending, sending money from home               | SIGNPOST    | TU International Affairs (for the enrolment letter banks ask for) and the student's own bank | No single bank's requirements are authoritative for all of them, and the university does not run this either                                                                    | None                                                 | Explicitly marked `placeholder`, not yet verified, per the page itself                                                                                                                                                                                          |
| `international/culture-and-language.mdx`     | Wai etiquette, temple dress code, five basic Thai phrases, Buddhist holidays, everyday etiquette | KEEP        |                                                                                              | No single authoritative, stable, bilingual source exists for general Thai social etiquette aimed at students. Fails gate test 1, so §3.6's own gate says keep it                | None                                                 | Evergreen content, low staleness risk. Still marked `placeholder` pending verification                                                                                                                                                                          |
| `international/healthcare-and-insurance.mdx` | Hospitals near campus, insurance expectations, emergency numbers, pharmacies                     | SIGNPOST    | TU International Affairs and Thammasat University Hospital                                   | TU-wide insurance policy, not something BIRSA can confirm or update                                                                                                             | None                                                 | Duplicates `home/health-and-wellbeing.mdx`'s hospital and emergency number content on a separate page. The insurance requirement is stated vaguely ("many universities, including Thammasat, expect or require") rather than confirmed                          |
| `international/phones-and-internet.mdx`      | Getting a Thai SIM, topping up, connecting to TU wifi                                            | KEEP        | (fold the "Connecting to TU wifi" paragraph into `/help/university-services`)                | SIM registration and carrier choice have no single authoritative source. TU wifi setup is already covered better on the ICT Helpdesk section of `/services/university-services` | None for the page as a whole                         | Deliberately vague on prices ("promotions change often"), which is good self-awareness rather than a staleness risk                                                                                                                                             |

### 3.4 `/services/university-services`

Not an MDX document, a hand-built page at
`app/[lang]/services/university-services/page.tsx` covering eight TU-run
services in one page (accident insurance, military service postponement,
online certificates, libraries, sport and fitness, the Dome account,
counselling, and IT support).

| Path                                               | What it actually covers                                                                                                       | Disposition | Target                                                                     | Reason                                                                                                                                                                               | Redirect needed                                                                                      | Staleness signals found                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/[lang]/services/university-services/page.tsx` | Eight bundled TU-run services, none of them BIR-specific, all clearly labelled as University-run in the page's own disclaimer | SIGNPOST    | Thammasat University's own offices per section (already named in the page) | This page is already the signpost pattern §3.6 asks for, a disclaimer plus curated links, not a page of bare links. The route map already targets `/help/university-services` for it | None, `lib/redirects.ts` already maps `/services/university-services` to `/help/university-services` | **High consequence, see section 4.** Accident insurance section duplicates `home/health-and-wellbeing.mdx`'s figures exactly. Military service dates ("Round 1, 10 August to 9 October 2026") are cohort and year specific and will need updating every year. Two links point to a Google Drive file and a Google Sheet, and one to a Facebook permalink, none of which BIRSA controls, all of which fail gate test 4 (stable enough to link to). The printing figure contradicts `home/study-support.mdx`, above |

### 3.5 Emergency scenario content (`content/emergency/scenarios/`)

Ten pre-written scenarios (nine specific plus a `generic` fallback),
selected by an Edge Config switch during a real incident so nobody has to
write public safety copy under pressure. This content is different in kind
from the rest of the audit. It does not restate a page that TU or TUSU
already maintains, it is BIRSA's own prepared response for the moment TU's
own channels are what a reader is told to check. The safety guidance itself
(Run, Hide, Fight, drop and cover, fire evacuation) is generic and not BIR
specific, but the mechanism, ready-to-publish, faculty-scoped copy triggered
instantly, is the value BIRSA adds, so the test in §3.6 still points to KEEP
for all ten.

| Path                                             | What it actually covers                                                                             | Disposition | Target | Reason                                                                                  | Redirect needed | Staleness signals found                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ----------- | ------ | --------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/emergency/scenarios/generic.ts`         | Fallback banner shown if Edge Config names no scenario or an unknown one                            | KEEP        |        | Prevents a blank banner or 404 during a live incident. Structural, not delegable        | None            | None                                                                                                                                                                                                                                                                                                      |
| `content/emergency/scenarios/active-shooting.ts` | Run, Hide, Fight guidance adapted from CISA/Ready.gov for Thailand's emergency numbers              | KEEP        |        | Nobody else prepares faculty-scoped guidance like this in advance                       | None            | None                                                                                                                                                                                                                                                                                                      |
| `content/emergency/scenarios/campus-closure.ts`  | What to do if the whole Tha Prachan campus closes                                                   | KEEP        |        | Same                                                                                    | None            | None                                                                                                                                                                                                                                                                                                      |
| `content/emergency/scenarios/coup.ts`            | Safety and rights guidance for a coup or political crisis, explicitly rights-based and non-partisan | KEEP        |        | Same, and there is no other body positioned to write this for BIR students specifically | None            | **Needs a human before it is activated. See section 4.** The file's own header comment says the Thai copy is an AI draft that needs review by a native speaker and someone familiar with the current legal landscape, and that the Thai Lawyers for Human Rights and iLaw contact details need confirming |
| `content/emergency/scenarios/earthquake.ts`      | Drop, cover, hold on guidance, with Bangkok-specific context (soft soil, tall building sway)        | KEEP        |        | Same                                                                                    | None            | References "as happened in March 2025" as a concrete example. Not wrong, but ages the page                                                                                                                                                                                                                |
| `content/emergency/scenarios/faculty-closure.ts` | What to do if the Faculty of Political Science building or programme closes                         | KEEP        |        | Same                                                                                    | None            | None                                                                                                                                                                                                                                                                                                      |
| `content/emergency/scenarios/fire.ts`            | Building fire evacuation guidance                                                                   | KEEP        |        | Same                                                                                    | None            | None                                                                                                                                                                                                                                                                                                      |
| `content/emergency/scenarios/flooding.ts`        | Severe flooding guidance, specific to Tha Prachan's riverside location                              | KEEP        |        | Same                                                                                    | None            | None                                                                                                                                                                                                                                                                                                      |
| `content/emergency/scenarios/health-advisory.ts` | Contagious illness advisory, based on WHO/CDC guidance adapted with TU contacts                     | KEEP        |        | Same                                                                                    | None            | None                                                                                                                                                                                                                                                                                                      |
| `content/emergency/scenarios/protests.ts`        | Safety-only guidance for demonstrations and crowds near campus, explicitly apolitical               | KEEP        |        | Same                                                                                    | None            | None                                                                                                                                                                                                                                                                                                      |

### 3.6 Smart Answers nodes naming a non-BIRSA owner

`content/smart-answers/types.ts` gives every outcome node an optional
`owner` field, described in the schema's own comment as "who actually
decides or acts on this, when it is not BIRSA." This is the same §3.6 test
already built into the content model at the node level rather than the page
level. 43 outcome nodes across five topic files name a non-BIRSA owner. These
are not independent pages with their own URL (they live inside the one
`/help/answers` graph, which the route map already keeps), so they are not
counted in section 2's disposition totals, and no redirect question applies
to any of them. Reading through all 43, the mechanism is already working as
intended. Each one names who actually decides in a single sentence rather
than restating their procedure. None needs a KEEP/SIGNPOST/ABSORB/DELETE call
of its own. Two groups are worth the committee's attention anyway.

**The four visa nodes** (`out-settle-visa-general`, `out-settle-visa-90day`,
`out-settle-visa-reentry`, `out-settle-visa-extension`, all in
`content/smart-answers/topics/living.ts`) each carry a "not legal advice"
warning and name "TU International Affairs and the Thai Immigration Bureau,
not BIRSA" as owner. This is the correct pattern and matches how §3.6 wants
`visa-and-immigration.mdx` itself to read. Flagged in section 4 anyway
because the underlying subject is immigration status.

**Five wellbeing/insurance nodes** (`out-wellbeing-clinic`,
`out-wellbeing-mental-health`, `out-wellbeing-cover-thai`,
`out-wellbeing-cover-international`, `out-settle-health`) and **two money
nodes** (`out-money-fees`, `out-money-trouble`) similarly name TU Well Being,
TU International Affairs, or a student's faculty office as owner rather than
BIRSA. Same pattern, same "already correct" assessment, flagged in section 4
because health, insurance and money are in the task's high-consequence list.

The remaining 34 nodes (academic rules, club and equipment ownership,
harassment escalation, contact routing) follow the same pattern for lower
consequence subjects, such as the Dean, the Registrar, TUSU Tha Prachan, or a
student's own faculty office. No action recommended.

## 4. Read these first

### High consequence subjects (visas, immigration, money, health, insurance, legal status)

1. **`international/visa-and-immigration.mdx`.** REDESIGN-2.0.md §3.6 and
   DECISIONS-2.0.md gate 2 both name this the highest-risk page on the site
   before this audit even started, and reading it confirms why. Being wrong
   here can put a student out of status. It already carries good
   disclaimers, but it still states one piece of procedural detail (a named
   government complex) that §3.6 says it should not. The four Smart Answers
   visa nodes already do this correctly and can be a model for rewriting the
   page itself.
2. **`home/health-and-wellbeing.mdx`** and
   **`/services/university-services`** carry the same accident insurance
   coverage figures (15,000 / 150,000 / 15,000 baht) independently. They
   agree today. They have no shared source of truth, so there is nothing
   stopping them from silently disagreeing the way the printing figures
   already have (finding 4, below).
3. **`international/healthcare-and-insurance.mdx`** states Thammasat's
   insurance requirement for international students only vaguely ("many
   universities, including Thammasat, expect or require"), which is not
   useful to a student trying to find out whether they are actually
   required to buy insurance.
4. **The printing quota contradiction.** `home/study-support.mdx` and
   `home/money-matters.mdx` both say the free printing quota is 100 baht per
   semester. `/services/university-services` says it is 200 baht in total,
   from two separate 100 baht funds. This is not a hypothetical risk, it is
   the exact failure §3.6 warns about, already happened, on the live site,
   right now. The committee should resolve which figure is correct before
   deciding anything else about these three pages.
5. **`/services/university-services`, military service section.** Dates are
   specific to one intake ("Round 1, 10 August to 9 October 2026") and will
   need updating every year without fail. The documents and approved-list
   links point to a Google Drive file and a Google Sheet BIRSA does not
   control.
6. **`handbook/internship.mdx`** and **`handbook/about-bir.mdx`** give two
   different phone numbers and two different emails for the BIR programme
   office. `internship.mdx`'s figures match BUILD-BRIEF-2.0.md §3;
   `about-bir.mdx`'s do not. One of these three sources is wrong, and it is
   the kind of error a student would only discover by calling the wrong
   number.
7. **The Smart Answers visa, wellbeing/insurance and money nodes** (listed
   in section 3.6) touch the same categories. They already implement the
   correct pattern, they are listed here so the committee reviews them
   alongside the pages that do not yet.

### Cannot confidently classify

- **`home/money-matters.mdx`** and **`international/phones-and-internet.mdx`**
  are each mostly one disposition with one paragraph that behaves like
  another (a TU policy paragraph inside an otherwise-KEEP page). The table
  above resolves this as KEEP with a named paragraph to trim, but a case
  could be made for ABSORB on either. Worth a second opinion.
- **`home/getting-around.mdx`** duplicates what Google Maps transit
  directions already do, and says so in its own text. Whether that alone is
  reason enough for DELETE rather than ABSORB (keeping only the Rangsit
  routing table) is a judgement call this audit did not feel able to make
  alone, since a first-week international student may still prefer a
  written page to a live map query.
- **The `about-bir.mdx` / `internship.mdx` contact conflict** (finding 6,
  above) needs someone who can actually call both numbers to resolve, not
  an editorial disposition call.

## 5. Named in §3.6 but not found, or found differently than expected

- **File count.** §3.6's own prose and DECISIONS-2.0.md gate 2 both say
  "24 per locale, 48 files." The repository has 23 per locale, 46 files (7
  handbook, 10 home, 6 international), which matches §3.6's own itemised
  audit table exactly (7 + 10 + 6 = 23). The "24" figure appears to be a
  stale count in the prose, not a missing file. Flagged so it is corrected
  rather than triggering a search for a 24th document that does not exist.
- **Smart Answers nodes whose `owner` is not BIRSA or the faculty.** Found
  and reviewed, section 3.6 above. Not missing, but worth noting these are
  graph nodes inside one route, not separate pages, so they do not fit the
  page-level disposition table cleanly and are reported separately.
- Nothing else named in §3.6, gate 2, or the route map's description of
  `/help` was missing from the repository. `/services/university-services`
  and the emergency scenario content were both found and are covered above.

## 6. Where this audit differs from §3.6's own shorthand table

REDESIGN-2.0.md §3.6 sketches a disposition for each home/ document by
which level of the ladder it sits on (BIR, TPC, TU). Reading the actual text
rather than relying on that shorthand changed a few calls, listed here so
the committee can see where and why.

- **`food-and-budgeting.mdx`** and **`places-nearby.mdx`** are grouped with
  the "TPC, Signpost" set in §3.6's table. Reading them, both are curated,
  opinionated, first-hand student recommendations with no authoritative
  source to delegate to. This audit recommends KEEP for both, under §3.6's
  own gate rule (test 1 fails, no authoritative source exists).
- **`culture-and-language.mdx`** is grouped with the "TU and national,
  Signpost" set. Reading it, there is no single stable, bilingual,
  authoritative source for general Thai social etiquette aimed at students,
  so the same gate rule applies. This audit recommends KEEP.
- **`getting-involved.mdx`, `rights-and-welfare.mdx`, `study-support.mdx`**
  are grouped as "Keep, trimmed" in §3.6's table, which is not one of the
  four formal dispositions. This audit treats "trimmed and merged into a
  named different page" as ABSORB and gives each a specific target, since
  that is closer to what reading them actually supports (especially
  `study-support.mdx`, given the printing figure contradiction with
  `/services/university-services`).
- **`getting-around.mdx`** and **`safety-and-emergencies.mdx`** are not
  single-disposition pages once read closely. Each bundles several
  unrelated jobs (Rangsit routing plus generic Bangkok transit; harassment
  reporting plus lost-card procedure plus general safety tips). This audit
  recommends ABSORB for both with the split described in the reason column,
  rather than one clean disposition for the whole page.
