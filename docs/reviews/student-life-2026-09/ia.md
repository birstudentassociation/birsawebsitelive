# Student life: navigability and information architecture review

Method: static read of code, content and docs. No site run and no screenshots were taken, so visual findings (wrapping, mobile layout) are not covered. Word counts are English MDX (`wc -w`); Thai counts are unreliable because Thai has no spaces.

## 1. Summary of the problem

The section is organised by who the reader is (home, international, handbook), not by what they are trying to do. Students rarely know which "audience" a fact belongs to, so they must guess a track, then guess a guide, then scan a long page. Facts on the same task are split across two or three guides in different tracks, and no guide links to its siblings.

## 2. Findings by task

Click counts assume the student starts on the home page and uses navigation, not search. The header has four items (`content/dictionaries/en.ts:25-30`: What's on, Find a service, Clubs, BIRSA activity), so the section is not in the header at all. The routes in are `/services` (`app/[lang]/services/page.tsx:206-208, 265-284`), the quick actions page (`content/quick.ts:146-150`), or search.

| Task                    | Where the answer lives                                                                                                                                                                                                       | Clicks via nav                                                                                                                                | Problems                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tha Prachan to Rangsit  | `home/getting-around.mdx:29-41` (H2 "Getting to Rangsit campus", five-route table)                                                                                                                                           | Home > Find a service > Student life and culture guides > Getting around Tha Prachan > scroll = 4 clicks plus a scroll past "Reaching campus" | Slug and H2 are fine, but the track title is "Student life and culture guides" and the audience slug is `home`. Summary does mention Rangsit (`getting-around.mdx:3`). No TOC jump from the listing; the guide TOC does help (see 3).                                                                                                                                                                                                                                                    |
| GPA below 1.75          | `handbook/academic-life.mdx:56-82` ("Warning and probation")                                                                                                                                                                 | 4 clicks plus scroll of a 1,102-word page                                                                                                     | The figure 1.75 appears nowhere. The rules are 2.00 (warning), 1.50 (first years). A student with 1.75 finds nothing by searching that number. The title "Academic life: rules and procedures" hides "probation" and "dismissal". Summary does name probation (`academic-life.mdx:3`). Worked example uses 2021 semesters. `assessment-and-degree.mdx` also discusses GPA but never links to the probation rules.                                                                        |
| Where to report 90 days | `international/visa-and-immigration.mdx:19-25`                                                                                                                                                                               | 4 clicks                                                                                                                                      | Thai and home students who are also on visas do not think they are "international". The section gives options but the page opens with a placeholder notice (`:9`) that says the content is unverified. The Thai version is a "summary for buddies and staff" (`th/international/visa-and-immigration.mdx:2-3`), so a Thai reader asking the same question gets a page not written for them. `REDESIGN-2.0.md` already flags this page as safety critical (docs/REDESIGN-2.0.md:345-395). |
| I'm sick, where do I go | `home/health-and-wellbeing.mdx` (TU Virtual Clinic, entitlement, hospital note at `:30` that the hospital is at Rangsit) and `international/healthcare-and-insurance.mdx:9-49`                                               | 4 clicks, but two candidate pages                                                                                                             | Duplicated. A home student who lands on the international page gets 296 words and no clinic detail; an international student who lands on the home page may not think it applies. Emergency numbers are printed in both (`health-and-wellbeing.mdx:61`, `healthcare-and-insurance.mdx:17`) and in `/emergency` and `safety-and-emergencies.mdx:53`. Four copies of the same numbers.                                                                                                     |
| First month cost        | `home/food-and-budgeting.mdx:48-61` (monthly table, has a placeholder notice at `:50`), `home/money-matters.mdx`, `handbook/admission-and-fees.mdx`, `international/banking-and-money.mdx`, plus rent in `places-nearby.mdx` | 4 clicks, then 3 to 4 guides                                                                                                                  | No single answer. The only monthly table omits rent, tuition, deposits and set-up costs. It is filed under "Food". The unverified notice sits above the numbers.                                                                                                                                                                                                                                                                                                                         |

### Dead ends, confusing labels and duplicated routes

- "home" audience means Thai students in the URL (`/student-life/home`) and in the copy (`content/student-life/tracks.ts:15-18`), but its title is "Student life and culture guides", which sounds like the parent of everything. The parent page is also called "Student life" (`app/[lang]/student-life/page.tsx:25`). Two things called "student life" sit one level apart. The `home` track is not just for Thai students: it holds the shuttle, health, safety and study support that international students need (onboarding for international links into it, `content/onboarding/international.ts:98,150`).
- The international track is not a sibling by topic. It sits next to home and handbook although "banking", "phones" and "healthcare" are topics that also exist elsewhere. The onboarding track proves this: the international checklist links to `home/places-nearby`, `home/rights-and-welfare`, `home/getting-involved`, `home/study-support` and four handbook pages.
- Three overlapping entry routes to the same content:
  1. Guides listing (`/student-life/[audience]`),
  2. Getting started checklists (`/student-life/getting-started/[audience]`, home and international only),
  3. Handbook (`/student-life/handbook`), which the home checklist links to as its first task (`content/onboarding/home.ts:37-49`).
     The chooser offers a third card "Browse all student life guides" that goes back to the index (`getting-started/page.tsx:96-101`), a loop.
- The student-life index (`page.tsx:78-96`) lists five equal rows, in the order Getting started, Course reviews, Home, Handbook, International (array order is `["home", "handbook", "international"]`, `:47`). Course reviews, a database, sits at the same level as guide collections. There is no search box and no list of tasks.
- Naming mismatches (slug vs title vs summary):
  - `places-nearby` is titled "Food and housing nearby" (`places-nearby.mdx:2`) while `food-and-budgeting` is titled "Food and budgeting". Two "food" guides; the first is a map, the second a table and a list of recommendations. Both summaries begin "Where to eat around Tha Prachan" (`food-and-budgeting.mdx:3`, `places-nearby.mdx:3`).
  - `getting-around` is "Getting around Tha Prachan" but 1 of its 8 H2s is Rangsit and another is "Getting further afield".
  - `rights-and-welfare` is "Your rights and welfare" but its summary lists elections, dress, menstrual products and facilities; it is really "Campus rights and facilities".
  - `money-matters` (home) vs `banking-and-money` (international) vs `food-and-budgeting` (home): three "money" pages in two tracks.
  - `academic-life` titled "Academic life: rules and procedures" uses a colon, which conflicts with the house style rule in CLAUDE.md for news, though this is not news. Not a navigability fault but inconsistent (`handbook/academic-life.mdx:2`).
  - Titles are mixed noun phrases ("Internship") and topics ("Money matters"); none is phrased as a task.
- `live-bus-tracker` (order 3, 292 words) and `shuttle-bus` (order 2, 371 words) are both transport widgets, listed as separate guides between "Getting around" (1) and "Food" (4). The shuttle page and tracker page are not cross-linked from each other in the listing order except by prev/next. The tracker has no inbound links from onboarding or `quick.ts`.
- Order is by author convenience, not by lifecycle. Home track: getting-around 1, shuttle 2, tracker 3, food 4, money 5, health 6, safety 7, involved 8, places 9, study-support 10, rights 11. Prev/next therefore takes a student from "Getting around" to "Shuttle" to "Tracker" then to "Food", which is neither a story nor a hierarchy.
- Breadcrumbs are inconsistent. The index uses Home > Student life (`page.tsx:71`). Track and guide pages use Home > Find a service > Track > Guide (`[audience]/page.tsx:73-77`, `[slug]/page.tsx:137-143`), skipping the "Student life" parent. Getting started uses Home > Student life > Getting started (`getting-started/page.tsx:72-76`). So the same page has two different parents depending on which template renders it. The "Student life" label is duplicated in three files by design (`getting-started/page.tsx:10-17`, comment admits it).
- Two placeholder-labelled pages read as unfinished to students: `visa-and-immigration.mdx:9`, `banking-and-money.mdx:13`, `culture-and-language.mdx:19`, `food-and-budgeting.mdx:50` (all "Example guidance; BIRSA will verify details before launch."). The visa one is the most consequential.
- The Thai international track is a different product (23 to 36 Thai words per page versus 300 to 430 English words): `th/international/*.mdx` are summaries. Tracks copy says so (`tracks.ts:21, 35`). Slug parity holds, so tests pass, but a Thai reader on the international pages gets 5 to 10 percent of the content, while the reader most likely to be on the Thai page is the buddy, not the student.
- Search intent already routes around the IA. `lib/search/intent.ts` has hand-written best bets that point to guides (`:184, 315, 360, 400-437, 565-571, 607-612, 647, 685-690, 728-733, 767, 802, 827`). This shows which tasks the team believes students ask, and it is a ready-made list of "quick answers" (visa, money, health, shuttle, food, phone, internship, rights, involvement). Guide indexing (`lib/search/sources/content.ts:92-112`) uses the title, summary, H2 headings and the slug words, plus the body. The badge is "Student life", "International" or "Handbook", i.e. the audience, not the topic, so results from the three tracks cannot be told apart by subject. Search does not index per-section anchors as separate results (see `lib/search/sections.ts`, which is a section-type list, not H2 anchors), so "1.75" or "Rangsit" returns the whole guide with no jump link.

## 3. Guide page anatomy

Template: `app/[lang]/student-life/[audience]/[slug]/page.tsx`.

Present:

- H1 title and summary as lede (`:130-132`).
- Breadcrumbs (`:134-143`), inconsistent as above.
- "On this page" TOC, shown only when there are 2 or more H2s (`:147-162`), built from H2s only by `lib/toc.ts:24-43`. H3s are not listed. Placed in a full-width box above the content, on every viewport, not sticky; on a 1,593-word page, the TOC is left behind after the first scroll.
- "Last updated" date (`:164-166`), plain text with no visual link to reviewed-by.
- Prev/next cards within the same track (`:120-124, 170-202`), by `order`.
- "Report a problem with this guide" box linking to `/contact` (`:204-208`), with no pre-filled guide name or URL.
- Back to track link (`:210-215`).

Absent:

- Related links (no `related` frontmatter; schema is `title, summary, metaDescription?, order, updated, audience`, see `docs/PROJECT-BRIEF.md:130`). Cross-links exist only as hand-written inline links: 26 in English across 10 guides; 13 of 24 guides have none, including `assessment-and-degree`, `admission-and-fees`, `internship`, `shuttle-bus`, `banking-and-money`, `healthcare-and-insurance`.
- A "quick answer" or key facts box.
- Source attribution as structure. Several guides end with a manual `## Source` H2 (`getting-around.mdx:73`, `health-and-wellbeing.mdx:109`, `money-matters.mdx:71`, `food-and-budgeting.mdx:73`, `places-nearby.mdx:64`, `safety-and-emergencies.mdx:57`, `study-support.mdx:103`). This H2 appears in the TOC as if it were a topic. Handbook guides carry provenance only in the track lede (`tracks.ts:25`), not on the page.
- "Who is this for" / owner / review date. Only "Last updated" exists. Nothing says which body owns a fact (see docs/REDESIGN-2.0.md:379-389, "maintainedBecause").
- Print or share. The handbook and visa pages are the pages students print or send to a friend. No print stylesheet check was possible without running the site.
- "Related pages" as a component: `study-support.mdx:99` and `rights-and-welfare.mdx:79` each hand-write one.
- Language switch parity note: `/th/...` for international guides is a summary; nothing warns an English reader on that page in the other direction, or points the Thai reader to the full English page beyond one sentence in the copy.

Length and structure (English):

| Guide                              | Words           | H2        | H3  | TOC usefulness                                                                                         |
| ---------------------------------- | --------------- | --------- | --- | ------------------------------------------------------------------------------------------------------ |
| handbook/curriculum-and-study-plan | 1,593           | 6         | 13  | High need; TOC shows 6 H2 but 13 H3s hidden; 314 lines                                                 |
| handbook/academic-life             | 1,102           | 5         | 3   | Good; but contains probation, plagiarism, leave and exams in one page                                  |
| home/getting-involved              | 1,091           | 8         | 6   | Clubs, elected bodies, events, volunteering in one page                                                |
| home/getting-around                | 1,035           | 8         | 2   | Needs it; mixes campus arrival, Rangsit, parking, landmarks                                            |
| home/health-and-wellbeing          | 944             | 8         | 2   | OK                                                                                                     |
| home/study-support                 | 938             | 10        | 0   | 10 H2 TOC, too many                                                                                    |
| handbook/internship                | 787             | 8         | 2   | OK                                                                                                     |
| home/rights-and-welfare            | 778             | 7         | 0   | Contains a "Common questions" H2 (`:43`) with about 35 lines of FAQ that would be better as a real FAQ |
| home/money-matters                 | 734             | 9         | 0   | 9 H2 including "Benefits for dek TPC" twice                                                            |
| home/food-and-budgeting            | 696             | 7         | 0   |                                                                                                        |
| about-bir                          | 659             | 4         | 0   |                                                                                                        |
| safety-and-emergencies             | 596             | 9         | 0   |                                                                                                        |
| admission-and-fees                 | 545             | 4         | 0   |                                                                                                        |
| assessment-and-degree              | 499             | 3         | 0   | 3 H2, TOC appears                                                                                      |
| arrival-and-first-week             | 432             | 5         | 0   |                                                                                                        |
| places-nearby                      | 403             | 5         | 0   | map heavy                                                                                              |
| visa-and-immigration               | 407             | 6         | 0   |                                                                                                        |
| shuttle-bus                        | 371             | 4         | 0   |                                                                                                        |
| culture-and-language               | 364             | 6         | 0   |                                                                                                        |
| banking / phones / healthcare      | 306 / 306 / 296 | 5 / 5 / 6 | 0   |                                                                                                        |
| academic-activities                | 281             | 4         | 0   |                                                                                                        |
| live-bus-tracker                   | 292             | 1         | 0   | no TOC (needs 2+)                                                                                      |

Median is about 600 words. The problem is not raw length; it is that seven pages combine several tasks under one title, so the title cannot tell a reader whether their question is inside.

## 4. Intent versus reality (docs)

- `docs/PROJECT-BRIEF.md:96, 121, 130` describes two audiences (home, international). The code and content now have three (handbook was added), and getting-started is unmentioned. The brief is out of date.
- `docs/REDESIGN-2.0.md:253-267` proposes a five-item top level and puts `/student-life` under "Get help" (`/help`) and course reviews under "Your studies" (`/studies`). Sections 3.6 (`:340-412`) propose that about half of `student-life` becomes signposts, keep handbook, and treat `visa-and-immigration` as a signpost with no procedural detail. My proposal below is compatible: it changes grouping and slugs, not the keep/signpost decisions, and each page carries a `owner` field so signposting can happen page by page. If the 2.0 plan proceeds, the URL prefix would change again, so the redirect map should be written once, on the final URL scheme.

## 5. Proposed information architecture

### Principles

1. Group by what the student is doing, not who they are. Audience becomes a filter or a note on the page ("mainly for international students"), not a URL segment.
2. Titles say the task or question ("Getting to Rangsit", not "Getting around Tha Prachan").
3. One fact, one home; everything else links to it (emergency numbers, monthly costs, health care).
4. Search first: a search box and 6 to 8 top questions on the index.
5. Keep the URL two levels deep: `/student-life/[topic]/[slug]`.
6. Keep slug parity: slugs are English kebab-case in both locales, one file per locale with the same filename (CLAUDE.md, `tests/unit/content.test.ts:45-47`).

### Top-level topics (replaces audience)

| Topic slug          | Label             | Covers                                                                              |
| ------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| `before-you-arrive` | Before you arrive | Admission, fees, visa, first documents                                              |
| `first-weeks`       | Your first weeks  | Arrival, set-up, SIM, bank, culture, orientation                                    |
| `studying`          | Studying          | Curriculum, registration, grades, probation, internship, libraries, exams, exchange |
| `money`             | Money             | Costs, budgeting, banking, discounts, tuition and refunds                           |
| `health-and-safety` | Health and safety | Health care, counselling, emergencies, security, scams, harassment                  |
| `getting-around`    | Getting around    | Shuttle, live bus tracker, transport, Rangsit, parking                              |
| `living-nearby`     | Living nearby     | Food, housing, places, landmarks                                                    |
| `getting-involved`  | Getting involved  | Clubs, student bodies, volunteering, events                                         |
| `rules-and-rights`  | Rules and rights  | Rights, welfare, regulations, complaints, immigration rules                         |

Nine topics is at the upper limit; if that feels too many, merge `living-nearby` into `getting-around` under the name "Around campus" and fold `rules-and-rights` into `health-and-safety` as "Welfare and rules". Course reviews and Getting started stay as their own top-level items on the index (a database and a checklist, not guides).

### Proposed sitemap

New URL is `/student-life/<topic>/<slug>`. "Split" means one existing file becomes two or more guides; the Thai file must be split in the same way with the same new filenames.

| Existing (audience/slug)                             | New topic / slug                                | New title                                         | Action                                                                               |
| ---------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| handbook/about-bir                                   | first-weeks/about-bir                           | About BIR and Thammasat                           | Move                                                                                 |
| handbook/admission-and-fees                          | before-you-arrive/admission                     | How to apply to BIR                               | Split; fees go to money                                                              |
| handbook/admission-and-fees (fees H2)                | money/tuition-and-fees                          | Tuition and fees                                  | Split from above and merge with the tuition H2 of home/money-matters                 |
| handbook/curriculum-and-study-plan                   | studying/curriculum                             | The BIR curriculum                                | Split (course list)                                                                  |
| handbook/curriculum-and-study-plan (plan H2)         | studying/four-year-study-plan                   | Four-year study plan                              | Split; link to `/services/study-plan`                                                |
| handbook/assessment-and-degree                       | studying/grades-and-graduation                  | Grades, GPA and graduating                        | Move, rename                                                                         |
| handbook/academic-life (registration)                | studying/registering-for-courses                | Registering, adding and dropping courses          | Split                                                                                |
| handbook/academic-life (exams, leave)                | studying/exam-absence-and-leave                 | Missing an exam, leave and suspension             | Split                                                                                |
| handbook/academic-life (warning and probation)       | studying/low-gpa-warning-and-probation          | If your GPA is low: warning, probation, dismissal | Split; add an explicit table for GPA bands, so 1.75 is findable                      |
| handbook/academic-life (plagiarism)                  | studying/plagiarism                             | Plagiarism and academic honesty                   | Split                                                                                |
| handbook/internship                                  | studying/internship                             | Summer internship                                 | Move                                                                                 |
| handbook/academic-activities                         | studying/exchange-and-conferences               | Exchange, conferences and field trips             | Move, rename                                                                         |
| home/study-support                                   | studying/libraries-and-study-support            | Libraries, printing and study help                | Move, rename                                                                         |
| international/visa-and-immigration                   | rules-and-rights/visa-and-90-day-reporting      | Visa and 90-day reporting                         | Move, rename; signpost per REDESIGN 3.6                                              |
| home/rights-and-welfare                              | rules-and-rights/rights-and-facilities          | Your rights and campus facilities                 | Move, rename                                                                         |
| home/safety-and-emergencies (complaints, harassment) | rules-and-rights/complaints-and-reporting       | Complaints and reporting harassment               | Split                                                                                |
| home/safety-and-emergencies (rest)                   | health-and-safety/safety-on-and-around-campus   | Safety on and around campus                       | Move                                                                                 |
| home/health-and-wellbeing                            | health-and-safety/getting-medical-help          | If you are ill: where to go                       | Merge with international/healthcare-and-insurance; audience notes in headings        |
| home/health-and-wellbeing (mental health)            | health-and-safety/counselling-and-mental-health | Counselling and mental health                     | Split                                                                                |
| international/healthcare-and-insurance               | health-and-safety/getting-medical-help          | (merged)                                          | Merge, redirect                                                                      |
| home/money-matters                                   | money/student-discounts-and-allowances          | Allowances, discounts and refunds                 | Move, keep tuition H2 as link to tuition-and-fees                                    |
| home/food-and-budgeting (budget table)               | money/monthly-costs                             | How much will a month cost?                       | Split; add rent, tuition, set-up costs; single source for the "first month" question |
| home/food-and-budgeting (eating)                     | living-nearby/where-to-eat                      | Where to eat near Tha Prachan                     | Merge with the "Where to eat" H2 of places-nearby                                    |
| international/banking-and-money                      | money/opening-a-bank-account                    | Opening a bank account and PromptPay              | Move, rename                                                                         |
| international/arrival-and-first-week                 | first-weeks/arrival-checklist                   | Arriving and your first week                      | Move; airport route moves to getting-around/from-the-airport                         |
| international/arrival-and-first-week (airport H2)    | getting-around/from-the-airport                 | From the airport to Tha Prachan                   | Split                                                                                |
| international/phones-and-internet                    | first-weeks/sim-cards-and-wifi                  | SIM cards and campus wifi                         | Move, rename                                                                         |
| international/culture-and-language                   | first-weeks/culture-and-language                | Thai etiquette and useful phrases                 | Move                                                                                 |
| home/getting-around (reaching campus)                | getting-around/reaching-tha-prachan             | Getting to Tha Prachan                            | Split                                                                                |
| home/getting-around (Rangsit)                        | getting-around/tha-prachan-to-rangsit           | Getting from Tha Prachan to Rangsit               | Split                                                                                |
| home/getting-around (rest)                           | living-nearby/around-the-campus                 | Landmarks, parking and walking the campus         | Split                                                                                |
| home/shuttle-bus                                     | getting-around/shuttle-bus                      | Free shuttle bus                                  | Move                                                                                 |
| home/live-bus-tracker                                | getting-around/live-bus-tracker                 | Live public bus arrivals                          | Move; embed a summary on shuttle-bus                                                 |
| home/places-nearby                                   | living-nearby/housing-and-map                   | Where to live and what is nearby (map)            | Move, rename; retitle to match slug                                                  |
| home/getting-involved                                | getting-involved/clubs-and-events               | Clubs, BIRSA events and volunteering              | Split                                                                                |
| home/getting-involved (elected bodies)               | getting-involved/student-bodies-and-elections   | TUSU, TUSC and elections                          | Split; link to `/activity/student-bodies`                                            |

Count: 24 existing files become about 33 guides per locale, so 66 files. Splitting more than the schedule allows is a risk; a minimal first step is to only do the moves and renames (no splits) and add anchors, which gets 80 percent of the value. Recommended order is set out in section 6.

### Index page (`/student-life`)

1. Search box (reuse `components/search/SearchBox.tsx`) with placeholder "Search: visa, GPA, shuttle, doctor".
2. "Common questions" list of 6 to 8 direct links to sections (with anchors), seeded from the best bets already in `lib/search/intent.ts`:
   - How do I get from Tha Prachan to Rangsit? > `getting-around/tha-prachan-to-rangsit`
   - What happens if my GPA is low? > `studying/low-gpa-warning-and-probation`
   - Where do I report my 90 days? > `rules-and-rights/visa-and-90-day-reporting#90-day-reporting`
   - I'm ill, where do I go? > `health-and-safety/getting-medical-help`
   - How much will my first month cost? > `money/monthly-costs`
   - Which shuttle bus do I take? > `getting-around/shuttle-bus`
3. Three cards for "I'm new here" (Getting started, home; Getting started, international; Course reviews).
4. Nine topic cards, each listing its two or three most used guides (not just a description).
5. Show audience as a small tag on a guide row ("International students", "All students"), not a route.

### Topic page (`/student-life/[topic]`)

Replace `[audience]/page.tsx` with `[topic]/page.tsx`. Same NavList layout, now with the guide's `keyQuestions` (see below) under each summary so a reader sees "Includes: 90-day report, re-entry permit". Order guides by lifecycle within the topic, not by author.

### Getting started

Keep the checklists. Change the chooser to one page with an audience toggle ("Thai or home student" / "International student") instead of a three-card page whose third card loops back to the index (`getting-started/page.tsx:96`). Each checklist item already links to guides (`content/onboarding/*.ts`), so all `href`s in `home.ts` and `international.ts` must be updated in the same change; `tests/unit/onboarding.test.ts:146-199` verifies the routes exist, which acts as the safety net.

## 6. Redirects

Old URL shape is `/{lang}/student-life/{audience}/{slug}`. Add permanent (308) redirects in `next.config.mjs` after the existing block (`:55-88`) using explicit entries; a wildcard cannot express the mapping because slugs change. Suggested:

```
/:lang/student-life/handbook/admission-and-fees            -> /:lang/student-life/before-you-arrive/admission
/:lang/student-life/handbook/assessment-and-degree          -> /:lang/student-life/studying/grades-and-graduation
/:lang/student-life/handbook/academic-life                  -> /:lang/student-life/studying/registering-for-courses   (anchors lost; see below)
/:lang/student-life/handbook/internship                     -> /:lang/student-life/studying/internship
/:lang/student-life/international/visa-and-immigration      -> /:lang/student-life/rules-and-rights/visa-and-90-day-reporting
/:lang/student-life/international/healthcare-and-insurance  -> /:lang/student-life/health-and-safety/getting-medical-help
/:lang/student-life/home/health-and-wellbeing               -> /:lang/student-life/health-and-safety/getting-medical-help
/:lang/student-life/home/getting-around                     -> /:lang/student-life/getting-around/reaching-tha-prachan
/:lang/student-life/home/shuttle-bus                        -> /:lang/student-life/getting-around/shuttle-bus
... one line per row in the table above (about 24 lines)
/:lang/student-life/home                                    -> /:lang/student-life
/:lang/student-life/international                           -> /:lang/student-life/getting-started/international
/:lang/student-life/handbook                                -> /:lang/student-life/studying
```

Notes:

- Fragments are not sent to the server, so the split pages lose deep links such as `#warning-and-probation`. Redirect the parent page to the guide that holds the original page's opening topic, and put a one-line "Looking for X? It has moved" notice at the top of that guide. For `academic-life`, a small client component reading `location.hash` could forward known legacy hashes to the split pages; only add this if analytics show hash links are used.
- Also update: `content/quick.ts:82, 96`, `content/onboarding/home.ts`, `content/onboarding/international.ts`, `lib/search/intent.ts` (about 25 hrefs, listed in section 2), `lib/search/pages.ts:355-510` (page records for `/student-life/home|international|handbook`), `lib/places.ts`, `lib/shuttle.ts`, `components/shuttle/ShuttleRoute.tsx`, `components/places/*`, `app/sitemap.ts:104-111`, `app/[lang]/services/page.tsx:206-208, 269-284`, `lib/structured-data.ts`, `app/[lang]/openhouse/OpenHouseExperience.tsx`, `app/[lang]/search/page.tsx`, `content/home` (grep `student-life`). Inline links inside 10 MDX guides (26 links) also need changing.
- Keep the old slug names in `lib/search/sources/content.ts` search keywords (`slugKeyword`) by adding `aliases` in frontmatter, so old bookmarks and remembered words still find the page.
- Sitemap: `app/sitemap.ts` builds entries from `getGuideEntries`; it will need to read the new topic field.
- Tests: `tests/unit/content.test.ts:45-47, 78-88` loops over `GuideAudience`; change to `GuideTopic`, keep the same parity and ordering assertions, and add a test that every legacy URL in a `legacyRedirects` list resolves to a real guide.

## 7. Component and template changes

Data model (`lib/content.ts:275-302`, schema in same file):

- Add frontmatter `topic` (enum of nine) replacing directory-as-audience; loader reads `content/student-life/{locale}/*.mdx` flat or `{topic}/`. Keep directories by topic so parity tests stay simple.
- Add `audience: all | international | thai` (rename current `audience` field, which today means the folder).
- Add `related: [slug, ...]` (validated against existing slugs; same test style as club categories).
- Add `keyQuestions: [string, ...]` (2 to 5, used on topic pages, in search keywords and in the quick-answers box).
- Add `quickAnswers: [{ q, a, anchor? }]` (optional, 2 to 4), rendered at the top of the guide and indexed by search.
- Add `owner` (body that actually decides: registrar, TU Health Service, BIR office, TUSU) and `reviewed` (date), in line with `docs/REDESIGN-2.0.md:379-389`.
- Add `sources: [{ label, href }]` to replace the hand-written `## Source` H2 that pollutes the TOC.
- Note: gray-matter dates are coerced (`lib/content.ts:20-40`), use the existing `dateOnly` helper for `reviewed`.

Guide page (`[slug]/page.tsx`):

- Move the TOC into a sticky "On this page" column at desktop widths and a collapsible `<details>` at mobile; include H3s when a page has more than 6 H2s; exclude the Source heading. `lib/toc.ts:24-43` needs an `H3` option and an `exclude` list.
- Add a "Quick answers" box above the TOC when `quickAnswers` is present, with anchor links.
- Add a "Who this is for and who decides" line under the H1 (audience tag plus owner), replacing the bare "Last updated" line (`:164-166`).
- Add a "Related guides" block driven by `related` before prev/next, and change prev/next to move within the topic by lifecycle order.
- Add a print stylesheet and a "Copy link to this section" affordance on H2s, since section links will be shared in chats. A "Print or save as PDF" button is optional; a print stylesheet alone is enough.
- Prefill the "Report a problem" link with the guide title and URL, e.g. `/contact?about=/student-life/...`, so casework does not need to ask which page.
- Fix breadcrumbs to Home > Student life > Topic > Guide on every template, and export a single `studentLifeLabel` instead of the three duplicated constants (`getting-started/page.tsx:14`, `[audience]/page.tsx`, `[slug]/page.tsx`).

Index and topic pages:

- Replace `[audience]/page.tsx` with `[topic]/page.tsx`; keep `generateStaticParams` for `locales x topics`.
- Index gets the search box and the common questions block as in section 5. Reuse `NavList` and `Card`.

Search (`lib/search/sources/content.ts:31-35, 92-112`):

- Replace `AUDIENCE_BADGE` by topic labels; keep audience as a secondary tag.
- Index each H2 as a section-level result with its anchor (the `mdxHeadings` function already extracts them, `:107`) so a query like "Rangsit" or "90 day" opens the right heading; add `quickAnswers` and `keyQuestions` to `keywords`.
- Add the number bands to searchable text: "GPA 1.75", "GPA below 2.00", "1.50". A `synonyms` entry ("probation", "gpa warning", "dismissed") in `lib/search/synonyms.ts`.
- Update `lib/search/pages.ts:355-510` page records to the new topic pages.

Nav and other entry points:

- Add "Student life" (or "Guides") to the header nav; today it is reachable only through Find a service (`services/page.tsx:206-284`, which repeats four separate cards for the tracks) and `quick.ts:146`. If REDESIGN 2.0 goes ahead this becomes "Get help", so make it a config change, not a hard-code.
- On `/services`, replace the four track links with one "Student life guides" link and the three or four top questions.
- `content/quick.ts`: keep "Shuttle bus", "Getting started", "Internship"; add "GPA and probation" and "Getting medical help" as quick actions; update hrefs.
- Footer: not audited for student-life links beyond a grep (no `student-life` match found in `Footer.tsx` or `Header.tsx`); add a "Student life" column with the nine topics.

Thai and bilingual constraints:

- Slugs stay English kebab-case and identical in both locales; titles, summaries, `keyQuestions` and `quickAnswers` are authored natively in Thai (not translated), per CLAUDE.md and `docs/EDITING.md`.
- The Thai international track must be replaced by real Thai guides for the merged topics (health, money, first weeks), or else each Thai page should state plainly "this is a summary, full guide in English" as a component rather than a sentence in the lede (`tracks.ts:21, 35`). Decide before the split, because every split doubles Thai work.
- Each split, merge or rename touches two files per guide; after editing Thai files run `npx prettier --write content/news` (only for news; for student-life run prettier on the touched directory) and re-read for bad line breaks per CLAUDE.md.
- The new `topic`/`related` fields must exist in both locales (the parity test compares slug sets, not frontmatter; add frontmatter parity for `topic`, `order` and `related`, as already done for clubs at `tests/unit/content.test.ts:118-127`).

## 8. Suggested phasing

1. Quick wins, no URL change: rename titles to tasks (places-nearby, getting-around, academic-life, rights-and-welfare), add "GPA 1.75" style text to probation section, fix breadcrumbs, exclude Source H2 from TOC, cross-link healthcare and health-and-wellbeing, add a search box to the index, add a "Common questions" block. Removing the four "Example guidance" placeholder notices or verifying their content.
2. Add frontmatter fields (`related`, `quickAnswers`, `owner`, `reviewed`, `sources`) and the guide template components. No URL changes.
3. Introduce topics and the redirect map with moves and renames only (no splits). Update onboarding, quick, search, sitemap and inline links in one pull request; the onboarding and content tests are the safety net.
4. Splits and merges (`academic-life`, `getting-around`, `getting-involved`, health pair, `admission-and-fees`, `food-and-budgeting`), one topic at a time, en and th together.
5. Reconcile with REDESIGN 2.0: decide which pages become signposts, then apply owner metadata and the link-rot check to their external links.

## 9. Not covered

No dev server, no Playwright screenshots (mobile or desktop). Thai render checks, print output and the actual footer contents were not verified. The `wc -w` figures for Thai are indicative only. I did not read `components/Header.tsx` or `Footer.tsx` in full; the nav items were taken from `content/dictionaries/en.ts:25-30`.
