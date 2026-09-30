# Review: English handbook and international guides

Scope read in full: content/student-life/en/handbook/_.mdx (7), content/student-life/en/international/_.mdx (6), English strings in content/onboarding/international.ts, content/onboarding/index.ts, content/student-life/tracks.ts. Also skimmed docs/EDITING.md "Voice and language", docs/NEWS-STYLE.md, components/Notice.tsx, and the home guides where they overlap. Nothing in the repo was edited. Today is 2026-09-30, which matters for stale dates.

Paths are relative to content/student-life/en/ unless stated. "H:" = handbook/, "I:" = international/, "ob/" = content/onboarding/.

## 0. Headline findings

1. The handbook is a lightly edited copy of the 2021 official handbook. Facts are largely usable, but the prose is stiff, and several rule passages are garbled or contradict each other (leave, first-year probation, fees, 4-year plan).
2. The internship page (H:internship.mdx) is stale today. Every date is for the ID 66 cohort and has already passed (internship ended 24 July 2026, report due 2 August 2026). The next cohort (ID 67) has no dates.
3. Three international pages still carry a `placeholder` Notice ("Example guidance; BIRSA will verify details before launch") and the visa page carries a similar one. The pages are live, so readers see unverified immigration and banking advice with a "draft" banner. Either verify and remove the banners, or do not surface the pages in the checklist.
4. The international pages are thin and hedged ("usually", "typically", "often", "some universities"). The visa page has no rule a student can act on. There is no 90-day report procedure, no TM30, no extension timing, no work permit rule, no fee, no URL.
5. "TU International Affairs" (I: pages), "Thammasat International Office" (H:about-bir.mdx:68, www.oia.tu.ac.th) and "Office of International Affairs" (H:academic-activities.mdx:18, oia.polsci) are used as if they were one office. They are probably three different offices. Every "ask TU International Affairs" sentence is unactionable until this is pinned down with a name, place, hours and contact.
6. Contradictions between pages, listed in section 4 (for example onboarding says SIM registration needs a Thai address or ID; the phones page says passport only).
7. House style breaches are few in the mdx (no dashes anywhere, no "please"). The real style problems are officialese, contraction rules ("doesn't" x2), American spellings ("Enrollment", "Program fee"), the "Notice" over-use, and "about this page" scaffolding.
8. The information architecture (handbook, international, home) mixes three axes at once: who you are (international), what you do (home), and what document it came from (handbook). A task-based split is proposed in section 3.

## 1. Per-guide review

### 1.1 H:about-bir.mdx ("About BIR and Thammasat", order 1)

Purpose: welcome, university and faculty history, programme office contact and official websites.
Audience: new students, parents, and staff who want the office details.
Works: the contact block and website table are the only genuinely useful parts. The "not BIRSA" line at :43 is good.
Does not work: the top two-thirds is history and mission copy that a first-year will not use. It buries the office contact at the bottom (:41 onward). It is the first item in the handbook, so a new student lands on 1934.

Offending text and rewrites:

- :11 "Welcome to the Bachelor of Political Science Programme in Politics and International Relations (BIR), Faculty of Political Science, Thammasat University." Welcome banner plus full official name in one line.
  Rewrite: "BIR is the international programme of Thammasat University's Faculty of Political Science. Its full name is the Bachelor of Political Science (Politics and International Relations)."
- :13 "Managing your time between study, social life, sports and other activities is a key part of the first year." Tricolon plus filler. Advice with no fact. Delete, or replace with a real first-year fact (for example the minimum credit load, see academic-life).
- :15 "Throughout your studies, you'll learn from BIR's professors and from guest lecturers from various fields and professions. The programme includes extracurricular activities such as a field trip and an internship abroad." Stock phrase ("Throughout your studies", "various fields and professions"). Also a factual conflict: the internship page never says the internship is abroad, and the internship is credited, compulsory and not extracurricular (H:curriculum-and-study-plan.mdx:294 to 298).
  Rewrite: "Some classes have guest lecturers from government, business and international organisations. In your third year you take part in a field trip and a compulsory internship."
  (Check who the guest lecturers actually are before naming sectors.)
- :17 "Faculty staff support students throughout their studies, but your progress depends mainly on your own effort. Visit the office for further information or assistance." Officialese, and "throughout" again.
  Rewrite: "Faculty staff can answer questions about registration, records and forms. Go to the programme office on the 2nd floor of the Faculty building." (Then merge into the contact section.)
- :21 "Its original name, given by Professor Dr Pridi Banomyong, was the University of Moral and Political Sciences. Professor Dr Banomyong wished to establish a university to educate the Thai people about the concept of democracy, which had been introduced to the nation two years before the University was founded." Translated feel ("the concept of democracy ... introduced to the nation"). Also "Professor Dr Banomyong" is wrong usage. Thai surnames are used with title only where the source does; the usual English form is "Pridi Banomyong".
  Rewrite: "Pridi Banomyong founded Thammasat on 27 June 1934 as the University of Moral and Political Sciences. He wanted to teach the Thai public about democracy, which Thailand had adopted in 1932."
- :23 to :25 quote: keep only if sourced. Typo in the quote ("rightly belong to every citizen" should be "rightly belongs" if quoting verbatim, or mark [sic]). Needs a citation.
- :27 "The coup d'état on 8 November 1947 had a dramatic effect on the University." "Dramatic effect" is vague. "The Thammasat University Act of 2495 B.E. mandated that each programme offer its own degree" is unclear (which programmes?). Use "1952 (B.E. 2495)" for the English reader, with the Buddhist Era in brackets. Rewrite: "After the coup of 8 November 1947, the university dropped its open admission system, took the name Thammasat University, and offered four degrees in Law, Political Science, Economics, and Commerce and Accountancy."
- :29 "In 2011, Thammasat's goal of guiding students to the highest standards of ethics and community service remained true, as staff and students came together to serve society in times of need, giving truth to the motto..." Translated ("giving truth to"). It refers to the 2011 floods without saying so. Rewrite or cut: "In the 2011 floods, staff and students volunteered to help affected communities."
- :33 "has a strong tradition of public service. It offers a full spectrum of undergraduate and graduate studies in three majors" Stock ("full spectrum", "strong tradition"). Rewrite: "The Faculty offers undergraduate and graduate degrees in Politics and Government, Public Administration, and International Relations."
- :35 "regular students on a full-time basis and to executives on a part-time basis" Officialese. Rewrite: "Graduate programmes run full time for regular students and part time for working executives."
- :37 "In addition, the Faculty offers an international programme for undergraduate studies: the BIR Programme, ..." Restates :11. Cut, or merge.
- :39 "considers that studying political science prepares graduates with a strong foundation for understanding important political issues, local, domestic and international in scope. Its mission is ... aware, active and responsible citizens of Thailand and of the world." Mission statement. Fails EDITING "one test" (:326 to :329 of docs/EDITING.md). "local, domestic and international" is redundant (local and domestic mean the same here). Cut, or move to a short "Mission" line on an about page.
- :43 "This is the Faculty's own BIR programme office, which handles admissions, academic administration and official records." Good content, but "This is" is a meta opener. Keep the fact, lead with it.
- :45 to :47 fine, but hours should be checked (and public holidays, lunch closure).
- :49 "**Address**" and :59 "**Official websites**" are fake headings (bold paragraphs). Use h3 so the outline and the anchor links work.
- :53 "(66) 02-613-2304" mixes international prefix and a local leading zero. Use "+66 2 613 2304" and a tel link (internship page uses a different number, see section 4).
- :57 vs internship.mdx:125 two different emails (bir@staff.tu.ac.th and bir@tu.ac.th).

Structure: reorder to contact first, history last, or move history to a short "About Thammasat" page. Cut roughly half the words.

### 1.2 H:admission-and-fees.mdx (order 2)

Purpose: rationale, entry requirements, programme structure, fees.
Audience: applicants and parents, not current students. It is in a "student handbook" for people who are already in.
Works: the tables (English tests, fees) are clear.
Does not work: rationale section is marketing copy; the fee totals cannot be reconciled with the table; mixed terminology; nothing about how to actually apply or pay.

- :11 "aims to provide high-quality education comparable to international standards." Empty claim. "(English Program)" here versus "(International Program)" at :24 and about-bir.mdx:37. Pick one official name. Also "established since 2008" is ungrammatical, use "established in 2008".
- :13 "The Faculty of Political Science sees the importance of offering a taught programme in English in the field of politics and international relations, one that integrates theoretical approaches with case studies, current issues and practical skills. It also gives priority to a diverse range of academic questions essential to the field..." Officialese, no fact. Cut. Also "a diverse range of academic questions" is nothing.
- :15 to :20 objectives 1 to 4 are mission copy ("Create ethical and moral awareness as well as social responsibility"). Cut or move to about. Objective 4 "Provide international knowledge in response to the labour market in Thailand, within the region and in international organisations" is machine-translated.
- :24 "must meet the following requirements" is a list of applicant rules inside a student handbook. If the audience is applicants, say so and link the official admissions page. If not, cut down to a line.
- :26 "item 7 of Thammasat University's Bachelor Degree Regulations (1997)" is an unlinked regulation citation. Academic-life.mdx:17 cites a different edition ("3rd Edition (2012)"). Confirm both edition years and give a link.
- :27 "total GPA of at least 2.80 for the last four terms" needs a source and a date. Does it apply to all applicants, or only Thai high-school applicants?
- :30 to :36 English test table: TU-GET "500 on PBT or 61 on CBT" is suspicious (61 is an iBT-style score; CBT scales differ). SAT/GSAT "400 on Reading, Writing and Language" is not a normal SAT score description (SAT Evidence-Based Reading and Writing is scored 200 to 800). GSAT is not explained. Fact-check all rows. Add an "as of" year: TOEFL PBT is discontinued.
- :40 "The programme operates on a full-time bi-semester system." "Bi-semester" is uncommon (use "two semesters a year"). "Summer session is optional" contradicts the study plan, where a summer session is compulsory for the internship (H:curriculum-and-study-plan.mdx:294) and used for required minor courses (:264 to :267).
- :42 to :46 semester dates: "August to December", "January to May", "June to July". Exact start dates change each year; link to the Registrar's calendar.
- :48 to :50 "Full name:" and "Abbreviated name:" are bare paragraphs. Fine as a small table or definition list. Does a student ever need the abbreviation? Cut unless transcript-related.
- :52 "For all BIR classes, the lectures, reading assignments, exams and class participation are in English." Fine, except free electives can be taken across TU (curriculum :213), which may be in Thai. Clarify.
- :56 to :59 "Estimated totals per academic year" (125,000 / 144,000 Baht). See fact-check list. The itemised table gives no Thai/non-Thai split, so a reader cannot see where the 19,000 difference comes from. "Baht" should be "baht" (house style, onboarding uses "baht"). Also "Enrollment fee" (:64) should be "Enrolment fee" in British English (though it may be the official name), "Program fee" (:66) is the official fee name but not British; decide whether to keep official names in quotation marks.
- :61 "The table below sets out the individual fees that make up the tuition and fee structure." Meta sentence pointing at the table. Cut.

Suggested rewrite of fees intro: "Tuition costs about 125,000 baht a year for Thai students and 144,000 baht a year for non-Thai students. These are estimates, and the total depends on how many credits you take." (Then say what is in the estimate and which fees each group pays.)

### 1.3 H:assessment-and-degree.mdx (order 3)

Purpose: grades, graduation requirements, honours.
Works: the grade table is clear; honours criteria are complete.
Does not work: reads as a translated regulation; honours section is three near-identical numbered lists with a repeated line.

- :11 "You're graded according to Thammasat University's Grade Point system, as set out below." Meta plus officialese. Rewrite: "Grades map to points as follows."
- Grade table :13 to :22 has no "W", "S", "U", "I" and no grade for missing. See gaps. Cross-page consistency: academic-life uses "W", assessment mentions "S"/"U" only in passing at :26.
- :24 "Attendance is mandatory, and you have to attend at least 80% of classes in order to pass. The specific rules on grading and attendance may vary from one course to another, so check the course syllabus or ask your instructor at the start of each term." Two conflicting claims (80% fixed, but rules vary by course). Hedge plus advice. Rewrite: "You must attend at least 80% of classes to pass. Some courses set their own attendance and grading rules, so read the syllabus in the first week." Also verify the 80%.
- :26 "The exception is certain courses graded "S" for satisfactory and "U" for unsatisfactory: these results do not count towards your GPA." Colon usage plus "certain". Name the courses (internship, others?). Rewrite: "Courses graded S (satisfactory) or U (unsatisfactory), such as the internship, do not count towards your GPA."
- :30 "You'll be nominated for the Bachelor of Political Science once you have:" "nominated" is translated ("เสนอชื่อ"). Say "You can graduate once you have:". Colon lead-in list: house style for content other than news allows it, but see the colon comment in section 5.
- :32 "127 credits, made up of 30 credits of general education courses, 91 credits of major courses and 6 credits of free elective courses" duplicates the table at H:curriculum-and-study-plan.mdx:26 to :31. Link instead.
- :34 "been enrolled in the curriculum for at least 7 semesters" vs 4-year honours limit at :41. (The study plan does in fact total 127 credits in seven regular semesters plus two summers, see section 4.)
- :35 "submitted a request to be nominated ... within the first 14 days of your final semester, or the first 7 days of your final summer session" Important deadline, buried in a list. Give it its own heading "Apply to graduate", and say where (Registrar? Faculty?) and how.
- :39 to :65 honours: three lists, each repeating "complete all curriculum requirements within 4 years, not including leaves of absence" and "have never repeated any course or received an F". Rewrite as a table: rows are criteria; columns are First-Class, Second-Class (route A), Second-Class (route B). "Criteria #1" and "Criteria #2" are unhelpful labels. "Second-Class Honours" is more usually "Second-Class Honours" with no distinction in Thai (เกียรตินิยมอันดับสอง), and note whether there is Second-Class Lower. Also: "never received any disciplinary punishment at parole level or higher" "parole" is odd, probably a mistranslation of "ภาคทัณฑ์" (probation). Use the term the University uses in English regulations and check it. "have been graded below C in one course" (:53) needs "at most one course".
- Criteria are ambiguous: "have never repeated any course" (does retaking for improvement count?).

### 1.4 H:curriculum-and-study-plan.mdx (order 4, 314 lines)

Purpose: curriculum structure, course lists, four-year plan.
Works: the credit arithmetic is internally consistent (30 + 91 + 6 = 127; 91 = 30 + 19 + 3 + 18 + 21; the plan sums to 127 across seven semesters plus two summers). The link to the study plan service at :16 to :20 is useful.
Does not work: 314 lines of course codes with no course titles' credit values, no prerequisites, and a plan that hides a strange fact. Too long for one page and it duplicates the study-plan service.

- :9 to :14 Notice "About this chapter": "This chapter reproduces the 2023 revision of Curriculum 2021 (B.E. 2564), the BIR Academic Handout that sets out..." Meta commentary about the page (EDITING.md forbids it). Rewrite as one line: "This is the 2023 revision of Curriculum 2021 (B.E. 2564)." Then state which cohorts it applies to. A student who entered before 2023 may be on a different curriculum. That is the most important sentence and it is missing.
- :16 to :20 second Notice: fine but "with your own cohort, your own minor and what you've already taken" is a tricolon. Rewrite: "To plan your own degree, use the study plan service."
- Two Notices at the top; only one is needed.
- :44 "You must complete the following courses in accordance with the requirements of Thammasat University." Officialese. Rewrite: "Thammasat University requires these courses."
- :46, :51, :55, :59 category labels with a trailing colon (Sociology:, Anthropology:) are paragraphs, not headings. These are TU's GE category names. Do students need them? Cut or make them a table with credits.
- :71, :235 "Select one course from: AH208 ..., or EL295 ..." Colon, and unclear whether one is credit-bearing (3 credits?). Credits per course are not listed anywhere; only totals.
- :75 "the minor courses covered in the next section" meta pointer.
- :77 to :104 headings "2.1", "2.2", "2.3", "2.4" are numbers left from the source document with no "1" or "3". Remove numbering.
- :106 "**Area Studies Group**: select 3 courses" bold pseudo-heading with colon.
- :139 "Minor Courses make up 21 credits ... Each minor has Required Courses (9 credits), Elective Courses within the minor (select 2 courses, 6 credits), and Elective Courses in other minors (6 credits)." Title case for "Required Courses", "Elective Courses" (sentence case rule). Also unclear: can the "other minors" 6 credits come from any minor's electives? Not stated.
- :163, :185, :209 "Elective Courses in other Minors (6 credits)." is a dangling fragment.
- :213 "You must select at least 6 credits of Free Elective Courses from any courses offered by Thammasat University." Fine; add "except ..." exclusions if any (courses taught in Thai, restricted courses).
- :217 "Courses shown as changeable in the source handout (marked "coloured and underlined" in the original) can be changed or shuffled" The original colouring is not reproduced, so the reader cannot tell which courses are movable. Repeated in three Notices (:239, :269, :309). This is a real usability bug: the page tells the reader to look for something that is not on the page. Fix by marking movable courses in the list itself (for example "(flexible)") and cut the three Notices.
- :239 to :242 duplicates :9 to :14 ("TU/PI/EL/LAS courses may differ..."). Cut.
- :264 "Summer (optional)" listing required minor electives. Optional in name, but the plan needs it to reach 127 credits in seven semesters. Explain, or restate the plan for students who skip summers.
- :294 "Summer (compulsory)". But H:admission-and-fees.mdx:40 says "Summer session is optional". Reconcile.
- :298 "The request form for the summer internship opens in the November before it, and the host organisation must be confirmed by the end of April." Consistent with internship.mdx but duplicated; keep in one place.
- :314 "The BIR Academic Handout for the 2023 revision does not list a Semester 2 for Year 4. Check with the Registrar's Office or your academic advisor for the arrangement of your final semester." This is an unresolved editorial gap presented to the reader as a puzzle. Credit arithmetic shows the plan finishes in Year 4 semester 1 (118 + ... = 127), so the honest wording is: "The plan finishes at the end of Year 4 semester 1. Semester 2 of Year 4 is free unless you need to retake or change courses." Confirm with the programme office before publishing. Also "advisor" should be "adviser" in British English (used at academic-life.mdx:21, :82, arrival-and-first-week.mdx:35). Minor.
- The 4-year plan puts a compulsory summer internship, a compulsory course load and exchange all in year 3, but H:academic-activities.mdx:15 says exchange is typically in year 3. State how the two fit (is exchange in Year 3 semester 1 or 2? Does the field trip fit?).

Split recommendation: move course lists to a "Course catalogue by requirement" page or table with credits and prerequisites; keep the plan on its own page.

### 1.5 H:academic-life.mdx (order 5)

Purpose: registration, add/drop, withdrawal, absence from exams, leave, probation, plagiarism.
Audience: every current student. This is the single most important handbook page and the roughest.
Works: worked example table; warning Notice; plain list of plagiarism examples.
Does not work: garbled leave and suspension sections, contradictory first-year probation rules, historical example data (2021), and rule text that mixes "must" and "may" without saying who decides.

- :9 "Refer to Thammasat University's Regulations for Undergraduate Degrees, available online on the Registrar's Office website, for the formal requirements of your studies." Officialese with no link. Rewrite: "The formal rules are in Thammasat University's Regulations for Undergraduate Degrees on the Registrar's Office website." Link it.
- :13 "Students find out about course offerings for each year through programme announcements on the BIR website or Facebook (www.birpolsci.com or facebook/birprogram)." Passive, translated. "facebook/birprogram" is not a URL. "Once you've decided which courses to take, you must complete your course registration during the registration period, which is announced on the BIR website or Facebook." Circular. Rewrite: "The programme posts each term's course list on birpolsci.com and on its Facebook page. The Registrar's Office sets the registration dates."
- :15 "Registration must be done online, on the date specified by the Registrar's Office for each semester." Then :17 repeats "registration ... online". Merge.
- :17 One 100-word paragraph carries three unrelated facts (where to register, which menu, credit limits and the regulation citation). Split. "no fewer than 9 credits and no more than 21 credits ... or no more than 6 credits in the summer" is the most useful rule for a new student, buried. Give it a heading "How many credits you can take". Also "Full-time students": all BIR students?
- :19 to :25 Add/drop: "With your advisor's or course instructor's approval" (or?). Who approves add: adviser or instructor? "in certain circumstances, with the Dean's approval" hides the circumstances. Rewrite: "You can add a course until day 14 of the semester (day 7 of the summer session), with your adviser's or the instructor's approval. After that you need the Dean's approval and a good reason."
- :25 "won't appear" contraction; house style prefers "will not".
- :27 "Course withdrawal" heading duplicates the ordering "Dropping a course". Students do not know the difference. Explain in one sentence: dropping in the first 14 days leaves no trace, withdrawing later leaves a W. Consider merging under "Drop or withdraw from a course". Also check with home/money-matters.mdx:61 (W and refunds), which uses "add/drop window" and says W does not affect results.
- :29 colon after "period" used as connector.
- :35 "If you're unable to attend an examination due to unavoidable circumstances, you or a designated person may file a petition with the instructor" No deadline, no form, no evidence requirement. "designated person" is translated. Say "someone you appoint". Add the deadline.
- :37 "or be assessed as the instructor decides. If it's not approved, you'll be assessed based on your previous coursework." Two outcomes; unclear whether a missed final exam gives zero or is assessed on coursework only.
- :41 to :46 Leave: truncated sentence. :46 "A leave results in one of the following: if applied for within the first 14 days of a regular semester, that semester is marked "LEAVE" on your academic record, and you must pay fees for maintaining student status." "one of the following" then lists one thing. The second branch (leave after 14 days) is missing. This is a clear content gap from the source. Fix: state what happens if you apply after day 14 (likely W on all courses or grades as normal).
- :44 "First-year students cannot apply for leave during their first 2 semesters, unless special permission is granted by the Rector." Clear. Keep. Check whether it applies to summer.
- :45 "more than two consecutive semesters (not including the summer session)" fine.
- :50 to :54 Suspension: :53 "Leave and suspension cannot be used as a reason to extend the maximum limit of 7 years" is under Suspension but concerns both and is the only mention of the 7-year maximum anywhere. Move to its own line under "Time limit for your degree". The bullets under Suspension are ordered oddly (:52 case, :53 general rule, :54 the other case). The intro at :50 ends "as follows" but the bullets are not fees. Restructure as a table: when suspension takes effect, what happens to fees and courses.
- :56 to :62 Warning and probation: "You're required to maintain a cumulative GPA of at least 2.00." then "If your GPA drops below 2.00 in any semester" (semester GPA or cumulative GPA?). The rules mix the two. :62 summer counting as part of second semester needs a sentence of explanation.
- :64 to :70 Worked example: uses "Semester 1/2021" and "Summer 2021" (five years old). "1/2021" is a Thai term format not explained. The example row "Semester 1/2021, GPA 2.00, No warning" contradicts :74, which says a first-year with GPA 2.00 gets a WARNING. Use a neutral example ("Semester 1, Year 2") and say whether it is a first-year example.
- :72 to :76 first-year rules overlap and conflict:
  - :74 first-year GPA of 2.00 gets WARNING 1 (but a 2.00 is otherwise fine at :58).
  - :75 WARNING in semester 1, then GPA below 1.50 in semester 2 gives DISMISSED.
  - :76 "fails to bring their GPA back up to at least 1.50 within their first two semesters" gives DISMISSED. This reads as a different threshold from :75 and :61.
    Rewrite as a single table with three columns (situation, result, source clause). Needs checking against the regulation before any rewording. Also "DISMISSED" in capitals throughout, sentence case is fine ("dismissed"), keep status names as a defined term at most once.
- :78 to :82 Notice duplicates :60 to :61 almost word for word. Cut one. Titles of Notices that state the rule ("Two consecutive warnings can lead to dismissal") work well; the body should not repeat.
- :86 "The BIR programme takes plagiarism seriously." Stock opener. "Any student caught plagiarising, whether intentional or not, will face punitive measures at the course lecturer's discretion. In the worst case, plagiarism can result in the student failing that subject." "Punitive measures" is officialese and "in the worst case" understates the actual maximum sanction (University discipline can go further than an F). Rewrite: "Plagiarism means using someone else's work or ideas without saying where they came from. If you plagiarise, even by accident, the lecturer decides the penalty. You can fail the course."
  Also "whether intentional or not" grammar, and the definition sentence is a single garbled clause ("the inclusion of any material derived from published or unpublished work without acknowledgment of the author(s)").
- :88 "Examples of acts of plagiarism, not limited to the following, include:" Rewrite: "These count as plagiarism, and so can other things:"
- :91 "Copying a fellow classmate's work, with or without their acknowledgement." Should be "permission" (acknowledgement is a translation error).
- :96 "Any referencing system is acceptable, including but not limited to the traditional and Harvard systems" "the traditional system" is unexplained. "Consult your lecturer" is vague. Link to a referencing guide (library).

### 1.6 H:academic-activities.mdx (order 7)

Purpose: exchange, conferences, field trip, BISC.
Works: it is short and each item has a name.
Does not work: brochure language, no dates, no how-to for exchange (the item students actually need), out-of-date-looking contact, a named individual and personal Gmail address.

- :11 "has established partnerships with a variety of prestigious universities in the US, Europe, Asia and Australia" "variety of prestigious" is brochure filler. Rewrite: "Thammasat has exchange partners in the United States, Europe, Asia and Australia. You can spend a semester or a year at one."
- :13 "The Faculty of Political Science also has exchange programmes open only to Political Science students. These include LMU Munich in Germany, Halmstad University in Sweden, and Nottingham Trent University in England. Check the BIR website and BIR staff for the complete, current list of exchange partners." A list of three plus an instruction to check elsewhere. Either list the current partners or link one page. Verify each partner is current.
- :15 "Students typically complete their international exchange during the third year" clashes with the third-year study plan (see 1.4), and "typically" is a hedge. Say which semester.
- :17 to :24 Notice titled "More information" contains a bare "Office of International Affairs", a http URL, and a named staff member with a Gmail address. Data-protection and staleness risk. The Notice title is generic. Use "Contact the faculty exchange office". Confirm that "Ms Suphorn Mukphimphan" is still in post, and that the oia.polsci@gmail.com address is official.
- :28 "In addition to their regular coursework, students can attend a number of conferences and seminars that are held at irregular intervals, such as the yearly student organised conference ..." "held at irregular intervals" versus "yearly". "offers the chance of experiencing first-hand contact with seasoned diplomatic personnel" is machine-speak. Rewrite: "Each year students run a conference on politics and international relations. The Diplomatic Forum at Thammasat (DFAT) lets you meet serving diplomats." Also "student organised" needs a hyphen (student-organised) in British style; better: "organised by students".
- :32 "BIR provides an annual field trip for third-year students. Students visit people and places to observe and gain knowledge on International Relations and Development, especially in Southeast Asian countries. Past destinations include Taiwan and Turkey." Southeast Asia claim contradicted by the destinations. Check cost, whether compulsory, and whether it counts for credit.
- :36 to :40 BISC: "annual educational conference open to undergraduate and graduate students to explore various academic concepts and perceptions at the global level" is empty ("various academic concepts and perceptions"). Say who organises it, when, and whether it needs registration. "Facebook page: [Bangkok International Student Conference, BISC]" has a comma splice link text.
- Missing: scholarships, awards, research assistantships, language courses (see gaps).

### 1.7 H:internship.mdx (order 6, 129 lines)

Purpose: how the compulsory summer internship works.
Audience: third-year students (and second-years planning).
Works: clearest and best structured handbook page. Numbered steps, a warning Notice, a marks table. This is the model for the others.
Does not work: stale for the current year; duplicated deadlines; heavy form-link repetition; date format inconsistent.

- :9 "opens the opportunity for students to gain first-hand work experience with organisations that are relevant to the field of study. It also allows students to apply theoretical knowledge to practical use." Stock ("opens the opportunity", "apply theoretical knowledge to practical use"). Rewrite: "You spend eight weeks working at an organisation related to politics or international relations."
- :18 "Duration: 8 weeks (June to July)" vs the schedule at :59 "2 June to 24 July 2026" (which is 8 weeks). Fine, but see admission-and-fees.mdx:40 "6 to 8 weeks" summer session. Confirm.
- :20 "To earn credit for the internship, you must complete your third-year coursework first." Is that all semesters, or a credit total? Say.
- :24 "You find the host organisation yourself. The programme office issues the paperwork once you tell it where you are going." Plain and good.
- :26 to :30 steps 1 to 3: step 2 "Obtain and submit both letters within the deadline" hides which letter is requested by whom. It is a five-step process: request form, programme letter, organisation confirmation letter, secured form, acceptance form. Number them in order, and say who produces each.
- :30 "The host organisation completes the Internship Acceptance Form." belongs inside step 2. "Both formats are linked under Forms and downloads below." meta pointer, cut.
- :32 to :37 Notice "You cannot switch organisations freely": good. Grammar in :35 "If you intern at a different organisation instead, you are responsible for informing ..." good, active. Check the tone of "valid reasons": who decides? (the programme, per line :33).
- :41 to :44 Form deadlines table: "November 2025 to 31 March 2026", "Within 28 April 2026". "Within" a date is wrong English ("By 28 April 2026"). Compare curriculum-and-study-plan.mdx:298 "by the end of April" (28 April is not the end of April). The dates are past (see stale list).
- :46 to :49 "Online submission:" duplicates the form links at :108 to :110.
- :51 heading "Internship schedule" and :53 "For students with ID 66, academic year 2025 (B.E. 2568)". Stale: ID 67 cohort is not covered and ID 66 is finished. Add a "Which cohort is this for?" line at the top, and archive or remove dates that have passed.
- :57 "Happy Hour: Internship" unexplained (an info session?). Colon in table cell.
- :60 "First evaluation due (focus group or Zoom, by supervisor)" fine but unclear who does the focus group.
- :65 to :67 Notice "Dates can change": "The revised version is posted in the Internship 66 Google Classroom" only useful to the 66 cohort.
- :71 to :80 grading: "not on the standard grade-point scale" fine. Table duplicates the S/U mention in assessment-and-degree.mdx:26. Make one canonical place.
- :82 to :87 marks table repeats "BIR (50)" and "Internship supervisor (50)" in each row. Rewrite as two small groups or a single table with a subtotal row. "internship supervision" at 5 marks (focus group) unclear.
- :89 "If the first evaluation comes in below 10 marks, the lecturer in charge discusses your responsibilities and performance with you and your supervisor." Good, plain.
- :93 to :102 report requirements: "Font: Times New Roman 12, single-spaced" fine. Item 3 has a colon-list form ("Self-assessment: what you gained...").
- :107 to :114 forms list duplicates :46 to :49. Link Thai form name (แบบฟอร์มตอบรับ...) fine for a Thai-language form; in English add a gloss ("Internship Acceptance Form, in Thai"). The two very long Makeweb URLs are fragile.
- :121 to :126 contact block: phone "02-221-6111 ext. 3409", email bir@tu.ac.th, differs from about-bir.mdx:53 and :57. Not internationally formatted.
- :121 "The internship is run by the BIR programme office, not by BIRSA." Good.
- Missing: abroad internships (about-bir.mdx:15 says internship abroad), visa/work permit implications for international students interning in Thailand (important, see gaps), pay and insurance, what happens if you fail (U), can you do the internship earlier or later, and whether the internship counts towards the 8-week summer session.

### 1.8 I:arrival-and-first-week.mdx (order 1)

Purpose: getting from the airport to campus and the first week's tasks.
Audience: an international student about to land.
Works: the tip at :18 (say "Tha Prachan campus", not "Thammasat") is real local knowledge; the checklist form suits it.
Does not work: generic, hedged, and no actual route, price or time. Overlaps heavily with the onboarding checklist.

- :12 "you have a few options into the city" then three bullets, one of which (":14 Airport rail link and connections") is described as "fast and predictable from Suvarnabhumi, but you'll need to connect to reach the old city near Tha Prachan" with no route. Add the actual route (rail link to Phaya Thai then BTS then Chao Phraya Express boat, or taxi), a rough taxi fare, journey times, and Don Mueang (which has no rail link). Colon in bold lead (":14 **Airport rail link and connections**: fast...") is a bold lead-in with a colon. House rule (EDITING.md) lets non-news content use colons but the "one test" rule applies.
- :15 "Agree to use the meter (taxis) or confirm the fare in-app before starting." Fine ("Ask the driver to use the meter."). Airport taxi fee/tolls not mentioned.
- :16 "Pre-arranged pickup, if your accommodation or a senior student can arrange this." Vague; BIRSA buddy scheme? If it exists, say how to request it.
- :18 "Tha Prachan itself sits in the old city, near the river" fine.
- :22 "In roughly this order:" then six steps. This is the same as the onboarding track but in a different order (see section 4). "get the keys/access sorted" (:24) is slang plus a slash. Rewrite: "Collect your keys and check that you can get into your building."
- :26 "Register with TU International Affairs and complete any arrival paperwork they require." Circular ("any paperwork they require"). Name the office, the place, the hours, the paperwork (passport, visa, enrolment letter, TM30?).
- :27 "Open a Thai bank account once you have the necessary documents" duplicates banking-and-money.
- :28 "Walk the route from your accommodation to campus at least once before your first class." Advice, fine; keep.
- :29 "Save key numbers: campus security, your programme office, and BIRSA's contact." A list of things to save without the numbers. Print the numbers (or link the emergency page).
- :31 to :38 "Your first week checklist" uses task-list checkboxes. Do they render as interactive? (Static "- [ ]" in MDX renders as disabled checkboxes and are not persisted.) The onboarding page does this properly with local storage. Duplicate. Remove from here and link.
- :33 "Attend orientation sessions run by TU International Affairs and/or BIR." "and/or", no dates. :35 "if introduced" hedge. :36 "Join BIRSA's channels" no link (use /quick). :38 "Note your visa's 90-day reporting deadline" the 90 days does not run from the visa date; it runs from arrival. Clarify (see fact-check).
- :40 to :42 "Settling in socially": "BIRSA runs welcome events for new students to meet each other, international and home students alike. Check What's on (/news) for upcoming dates." Fine but generic; give the name and typical month of the welcome event.
- :44 to :48 "If something goes wrong in week one" uses "goes wrong", then "leaves you feeling unsafe, uncomfortable or violated, by anyone" Tricolon; the last line is a duplicate of the emergency guidance elsewhere. Keep the link, cut "uncomfortable or violated". Note :46: "TU International Affairs handles visa and enrolment issues." Enrolment is handled by the Registrar and the programme office, not International Affairs.
- Title: "Arrival and first week" is fine (task-based alternative "What to do in your first week").

### 1.9 I:visa-and-immigration.mdx (order 2)

Purpose: ED visa, 90-day reports, re-entry permits, extensions.
Audience: non-Thai students, most at risk from getting this wrong.
Works: the disclaimer is honest; the point about re-entry permits is genuinely important.
Does not work: it says nothing specific. Every rule is softened ("usually", "typically", "often", "some universities", "where available"). A student cannot act on it. A "placeholder" Notice sits at the top (:9 to :13) so it looks like a draft.

- :9 to :13 Notice: "This page is general orientation only, not legal advice. Immigration rules and procedures change, so always confirm current requirements with TU International Affairs or the Thai Immigration Bureau before acting." Disclaimer: acceptable but very long for a Notice. Placeholder variant reads as "unfinished". Rewrite as info: "Immigration rules change. Check current requirements with the Thammasat international office or the Immigration Bureau before you act. Last checked on [date]."
- :17 "Most degree-seeking international students study in Thailand on a Non-Immigrant "ED" (education) visa, tied to your enrolment at the university." "Most ... typically" hedge. Which students do not? (Those on other visas, such as dependants or long-stay categories.) "TU International Affairs is your main point of contact ... they issue supporting letters you'll need." OK but which letters, how long they take, and are they free?
- :21 "If you stay in Thailand continuously, immigration law requires you to report your address every 90 days. This is a routine notification, not a new visa application, but missing the deadline can result in a fine." Hedged and colon-less but vague. Add the amount (fact-check), who is subject (foreigners staying more than 90 days), where (Chaeng Watthana or online), and what the 90 days count from. The claim "options usually include" (:21) is filler. The bullet ":25 Some universities help coordinate group reporting for students, so ask TU International Affairs whether this is offered." Not information; either the university does or does not.
- :29 "If you plan to travel outside Thailand and return on the same visa, you will need a re-entry permit before you leave; otherwise your visa may be automatically cancelled the moment you exit the country." "may be" here should be "is". Semicolon use. "can usually be arranged at the airport or an immigration office" hedge. Add cost (fact-check), single versus multiple entry, and that multiple-entry ED visas may not need it.
- :33 "Student visas typically need periodic extension to remain valid for the length of your programme." Vague. Say how long a visa/extension lasts, when to apply (about 30 days before expiry), and what to bring. "for Bangkok-based students, this often means Chaeng Watthana Government Complex, though requirements and locations can change" hedged. "Incomplete applications are the most common cause of delay." Unsupported claim.
- :35 to :39 "A general note on staying compliant": "photocopies ... of your passport, visa page, and departure card at all times" ("departure card" TM6 is no longer issued to air arrivals, check); "Set calendar reminders well ahead" generic advice; "When in doubt, ask ... Individual circumstances and rules can differ." Filler. The section adds no facts.
- :41 to :43 "Where to go for help" repeats :17 and the placeholder Notice. "BIRSA can point you toward the right office but cannot advise on immigration matters directly." Good honest statement, keep once.
- Missing: TM30 (accommodation reporting), address change, working (interning in Thailand on ED visa requires permission), visa run rules, visa expiry when you graduate or take leave (a leave of absence can affect ED visa status), overstay fines, and pointing to official URLs. See gaps.

### 1.10 I:banking-and-money.mdx (order 3)

Purpose: bank account, PromptPay, money transfers.
Works: PromptPay paragraph is a real, useful explanation. The document list is what students need.
Does not work: placeholder Notice; no bank names, no fees, no branch; hedges. The "Ask other international students or TU International Affairs which branches near Tha Prachan process student applications most often" line admits the page has no answer.

- :9 "Most day-to-day payments in Thailand run through a local bank account, directly or via linked apps." fine.
- :13 Notice placeholder "Example guidance; BIRSA will verify details before launch." This text on a live page is a red flag. Verify or remove.
- :15 "Requirements vary by bank and sometimes by branch. International students are typically asked for a combination of:" Hedge. Rewrite: "Banks ask for different documents. Take all of these:"
- :17 to :20 bullets: "Passport (original, plus a photocopy)." fine. "Visa page showing your Non-Immigrant ED status." "A letter confirming enrolment from the university or faculty." "Proof of address in Thailand (sometimes a dorm or landlord letter)." Missing: TM30 or work/residence certificate (many banks now ask for it), minimum opening deposit, which banks accept students on a short visa, how long the account takes to open, whether the account gets a debit card immediately.
- :22 "Ask other international students or TU International Affairs which branches near Tha Prachan process student applications most often." Filler. Replace with a named branch list once verified. Note TU's student card is a Bangkok Bank card (home/money-matters.mdx:59), so tell international students whether they get one and how refunds reach them; the two pages should agree.
- :26 "PromptPay is Thailand's national instant-payment system, linked to your phone number or national/passport ID. Once your account supports it, you can send and receive money instantly between banks, split bills with friends, and pay many small vendors by scanning a QR code." Long sentence, tricolon. Rewrite: "PromptPay is Thailand's instant payment system. Your account links to your phone number or ID number. You can send money to friends, and pay at most shops and stalls by scanning a QR code." Also, foreigners may need a Thai mobile number and a bank app registered before they can use PromptPay, say so.
- :28 to :32 "Everyday spending": three generic bullets. ":30 smaller stalls and markets are often cash or QR-code only." Fine but generic. ":32 Keep a small amount of cash on hand for markets, food stalls, and transport." Filler.
- :34 to :36 "International transfers usually work through your home bank or a transfer service, arriving into your Thai account. Fees and exchange rates vary between providers." Empty. Say what the student must do: a foreign remittance to a Thai account needs the account details, SWIFT code, and may need a purpose statement; how long; and fees (fact-check).
- :38 to :40 "Resolve lost cards, blocked accounts, or login problems through your bank's official app or branch. Thai banking apps typically support English." Both statements are obvious, and "official" implies scams without saying so. Add scam warning (fake bank apps, remote SIM scams), which is a real risk.
- Missing: what a student budget looks like (rent, food, transport) for internationals; the tuition payment method (how do international students pay tuition, by transfer from overseas? Registrar deadlines); scholarships; tax; ATM withdrawal fees for foreign cards (a flat fee per withdrawal); cash exchange; and card safety.

### 1.11 I:phones-and-internet.mdx (order 4)

Purpose: SIM, top-up, wifi.
Works: the SIM registration-by-law line is the key fact. The metaDescription is good.
Does not work: no carrier names, no prices, no shop locations, no TU wifi instructions at all.

- :10 "A working Thai number is needed for ride-hailing apps, bank verification and other everyday services." Tricolon lead-in, mild. Fine.
- :14 "Registration requires your passport by law; bring it with you when buying a SIM. An unregistered SIM cannot be activated." Clear. Check "by law" and whether tourist SIMs need biometric (face) registration. "An unregistered SIM cannot be activated" is circular.
- :16 "Thailand has several major mobile carriers, each offering prepaid tourist and longer-term student-style packages with data, calls, and texts. Compare current data allowances and prices at the point of purchase, since promotions change often. Airport kiosks are convenient but not always the cheapest option compared to a shop in the city." Three sentences that tell the reader nothing concrete. Name the carriers (AIS, True, dtac now merged into True, with 2025 status to check), give price ranges, and say which are cheaper. "student-style packages" is invented category.
- :20 "Most carriers let you top up and change packages through their own app, at convenience stores, or via short dial codes. Keep track of your renewal date if you're on a monthly package to avoid losing data mid-month." Generic.
- :22 to :24 "Thammasat provides campus wifi for enrolled students. You'll need your university account credentials to connect." No network name, no where to get the account, no steps. This is the only TU-specific paragraph and it has no how-to. How do you get credentials (TU account activation, on enrolment day)? Does the wifi work for VPN or streaming? See gaps: TU accounts.
- :26 to :30 "Staying connected": ":29 Messaging apps commonly used in Thailand (alongside the usual global ones) are worth installing" does not name LINE. Name LINE. "worth installing" is hedging. ":30 If you travel regionally, check whether your Thai SIM offers roaming, or plan to pick up a local SIM at your destination." Filler.
- :32 to :34 "Carrier shops ... can resolve registration or activation issues. Bring your passport and the SIM itself." Fine.
- Conflict: ob/international.ts:107 says SIM registration needs a Thai address or ID first. This page says passport only.

### 1.12 I:healthcare-and-insurance.mdx (order 5)

Purpose: hospitals, insurance, emergency numbers, pharmacies.
Works: the emergency number table (1669, 191) is right and accessible (uses scope="row" and a caption).
Does not work: contradictory insurance messaging versus the home health page; hedged; leaves out the actual TU services.

- :11 "Siriraj Hospital, one of Thailand's largest hospitals, is directly across the river from Tha Prachan, reachable by a short cross-river boat." Fact-check (Siriraj is across the river from Tha Chang/Wang Lang area, Prannok pier; check the pier used). "Several other hospitals and clinics ... serve the wider old-city area." Vague. "Private hospitals tend to have shorter waits and more English-speaking staff, generally at higher cost than public hospitals." Hedge but useful; name one or two private hospitals and the university clinic.
- :15 "Many universities, including Thammasat, expect or require international students to hold valid health insurance for the duration of their stay, sometimes as a visa or enrolment condition." "expect or require" and "sometimes" is the biggest dodge on the site. Either TU requires it (and then say what type, minimum cover, and where to buy it) or it does not. Meanwhile home/health-and-wellbeing.mdx:36 says every Thammasat student is covered by student accident insurance. The international page never mentions this cover or the TU clinic, and the home page never says international students are included. Reconcile and cross-link.
- :17 to :39 Emergency numbers: only two rows. Add 1155 (tourist police), fire 199, and campus security (arrival page :29 asks students to save campus security but nowhere gives the number). "Medical emergency / ambulance" and "Police" fine. Link to /emergency. :39 "For non-urgent care, going directly to a hospital's outpatient department is usually faster and cheaper than calling an ambulance." Slightly odd advice; "usually" hedge.
- :43 "Pharmacies are common across Bangkok, identified by a green cross sign. Pharmacists can often help directly with minor ailments without needing a doctor's visit. Bring the name of your regular medication (or its active ingredient) if you take something specific, since brand names differ from your home country." Useful. Add a warning that some drugs legal at home (for example some ADHD, codeine or cannabis-related medicines) are controlled in Thailand, and how to import prescription medicine. Green cross claim check.
- :45 to :47 "Registering with a health provider: Some students choose a regular clinic ... Do this in your first few weeks." A heading that does not match the content (there is no registration system). Rename "Choose a regular clinic".
- :49 to :51 "If you're ever unsure: Thai hospitals are used to treating international patients. If in doubt about how serious something is, get checked." Filler ("ever"), and the second sentence is fine as advice but is a summary line. Cut heading; move sentence into emergency section.
- Missing: mental health (home guide has TU Well Being and Viva City, not linked), vaccination requirements, dentist, medical certificate for exam absence (link to academic-life), and how to claim insurance.

### 1.13 I:culture-and-language.mdx (order 6)

Purpose: etiquette, dress, basic Thai, holidays.
Works: the phrase table is accessible (caption, scope). The content is broadly sensible.
Does not work: the heaviest use of hedging and stock lines; placeholder banner sits above the phrase table; Thai learning is one table; "Buddhist holidays" content is thin.

- :11 "The wai, pressing your palms together at chest height with a slight bow, is Thailand's traditional greeting and sign of respect. As a student, you'll generally see it used toward teachers and elders. Returning a wai when offered one is polite. A smile plus a slight nod is a safe fallback if you're unsure." OK, but "generally", "safe fallback" are filler. Do not wai toward children or service staff is the common nuance; whether foreign students should initiate a wai to teachers matters more. Add that.
- :15 "Many temples and some official buildings expect modest dress: shoulders and knees covered, and shoes removed before entering certain areas. Carrying a light scarf or sarong in your bag helps you meet this without planning your outfit around it. The Grand Palace, near campus, enforces this strictly and can refuse entry for inappropriate dress." Good local specificity. Check the Grand Palace rule (also no sleeveless tops, no leggings, no torn trousers). Colon usage.
- :19 Notice placeholder above the phrase table "Example guidance; BIRSA will verify details before launch." A native speaker can verify five words in two minutes; fix and remove.
- :21 to :57 table: "Sorry / excuse me" uses a slash, "Delicious" (อร่อย) fine, "How much?" (เท่าไหร่) spelling gives "เท่าไร" as standard, "tao-rai" romanisation is non-standard (RTGS "thao rai"). Pronunciation: "khor-thot" is a non-standard mix. Tone marks not shown, so pronunciation will be wrong; say so or add a tone note. The audience will almost certainly be greeting in a sentence; add polite particles "khrap/kha" (ครับ/ค่ะ) which the table omits. That is the most common learner error.
- :59 "Pronunciation guides are approximate. Thai is a tonal language, so tone matters more than spelling here." "matters more than spelling" muddled. Rewrite: "Thai has five tones, and a wrong tone can change the meaning. Ask a Thai friend to say each phrase."
- :63 "Thailand observes several Buddhist holidays across the year (such as Makha Bucha, Visakha Bucha, and Asalha Bucha), when some shops, government offices, and, on certain dates, alcohol sales may be restricted or closed. Check the calendar before planning errands or travel around these dates." "several", "some", "may", "on certain dates" makes it impossible to use. State: the dates change each year (lunar calendar), the University closes on these dates, and link the TU academic calendar. Alcohol-sales rules have changed recently, fact-check.
- :65 to :69 etiquette bullets: ":67 Remove shoes when a home, some shops, and certain temple buildings clearly expect it; look for a pile of shoes at the entrance as a cue." Ungrammatical (wrong noun). Rewrite: "Take your shoes off when entering a home or temple building. If you see shoes by the door, take yours off too." ":68 Avoid touching people's heads or pointing your feet directly at people or Buddha images; both are considered disrespectful." Semicolon; good content. ":69 Public displays of anger or raised voices are viewed less favourably than in some other cultures." Vague and slightly othering; rewrite as "Stay calm in a dispute. Raising your voice is seen as losing face." Missing the most important: the monarchy and lese-majeste (Section 112), which is a legal, not a cultural, risk for foreign students, including on social media. Also religion (Buddha images, monks not touched by women), and 8 p.m. quiet norms in dorms, and tipping, which are common questions.
- :71 to :73 "If you get something wrong: A sincere apology and a willingness to learn go a long way." Idiom filler; a heading plus one platitude. Cut.
- Missing: academic culture at TU (how to address teachers: "Ajarn"), student uniform requirements (the TU uniform rule matters for first-years, see home/rights-and-welfare), classroom norms, and Thai-language classes offered by the university.

### 1.14 ob/international.ts (checklist)

Reviewed English strings only.

- :25 to :30 title "Starting at BIR: for international students" has a colon in a title (EDITING.md and NEWS-STYLE.md rule out colons in titles for news; not strictly stated for this file, but consistent style says use "Starting at BIR as an international student"). Same in ob/index.ts:119 "Starting at BIR: step by step" and 149 (Thai).
- :32 lede: "Everything to sort out, roughly in order, before and after you arrive in Bangkok to study at BIR. Tick tasks off as you complete them. Nothing is sent anywhere, it all stays on this device." "Everything to sort out" overclaims; "roughly in order" hedge; comma splice at the end. Rewrite: "Here is what to do before and after you arrive, in order. Tick each task when you finish it. Your progress is saved only in this browser."
- Step titles are labels not tasks: "Sort your visa" (:38), "Arrive and settle in" (:57), "Open a bank account", "Get connected", "Look after your health", "Get involved", "Plan your studies". Fine as GOV.UK step-by-step headings. But "Sort your visa" has one task that is "Read about visa and immigration", so the step is a reading task, not a doing task. The same pattern (Read about X) repeats ~15 times. A checklist of "Read..." tasks is a reading list. Convert to actions: "Ask the international office for your enrolment letter", "Report your address to Immigration within 90 days of arrival", "Open a bank account".
- :40 "Start with the paperwork that takes the longest." Good, but the paperwork it points to is only a reading page.
- :60 "The first week is mostly logistics." Filler.
- :107 blurb "Sort out money matters early; some other things, like SIM registration, need a Thai address or ID first." Contradicts I:phones-and-internet.mdx:14 (passport is enough) and the step order (SIM step 2 in arrival page :25, before bank account). Also the semicolon.
- :127 blurb "A working phone, internet, and the campus apps you'll rely on make everything else easier." Tricolon plus filler; the step has only two tasks: phones (which does not cover apps) and TU Greats.
- :143 label "Read about the TU Greats App and campus rights" points at /student-life/home/rights-and-welfare whose summary is "The elections you can vote in, dress and title rights, free menstrual products and condoms, and campus facilities". The hint (:147) says "The TU Greats App for your student card and booking services, plus campus facility hours." Check the linked page really covers the app; if not, this is a wrong link. A student card is not "campus rights".
- :159 blurb "Know where to go for healthcare, and where to find emergency information, before it's needed." Filler.
- :178 "Know where to find emergency information" is not a task, it is a state. "Read the emergency page".
- :190 "The BIR and BIRSA community is one of the fastest ways to settle in." Unsupported claim, promotional voice ("community"). Cut.
- :198 hint "Clubs, elected student bodies, BIRSA events, and volunteering." Tricolon plus, then the next five tasks repeat the same topics (clubs, student bodies, committee, quick links, contact). Six tasks about "get involved" in a first-weeks checklist is too many and pushes crucial things (registration, student ID) off the list.
- :211 "Read about student bodies international students can run for" Are international students eligible to run? (check the election regulation.) If yes, say so in a plain fact.
- :253 blurb "After settling in, plan courses and the rules that govern the degree." Fine.
- :263 to :303: Seven "read" tasks for the studies step. Missing the real tasks: register for courses, pay tuition, get student ID, activate TU account, check English exemption result. The academic tasks are 60% of the list's length but the list does not tell an international student what to do first.
- :275 hint "Application requirements and estimated annual tuition: 125,000 baht for Thai students, 144,000 baht for non-Thai students." Duplicates a fee figure that can drift from H:admission-and-fees.mdx:58 to :59 (two places to update). Also, at the checklist stage, the student has already applied, so "application requirements" is irrelevant; the useful part is the fee table.
- :287 "The full course structure and the 127-credit total for BIR's 2023 revised curriculum." fine.
- :311 "Libraries, printing quota, TU-GET, and plagiarism checking." fine.
- :320 "Three documents: the University's regulation on student activities, the Faculty's notice on student activities, and the University's regulation on student discipline (B.E. 2568)." Long; also checks that the label reads "Check BIRSA activity regulations" (Thai title th:318) but the hint lists University and Faculty documents, not BIRSA's. Rename label "Read the student activity and discipline regulations".
- No task about: registration, student ID card, TU account, TM30, 90-day report, insurance purchase, enrolment letter, Thai language course, buddy.

### 1.15 ob/index.ts (UI copy)

- :119 title "Starting at BIR: step by step" colon; suggest "Starting at BIR, step by step".
- :120 lede "A step-by-step checklist for your first weeks at BIR, tailored to you. Tick things off as you go. Your progress stays in your browser and is never sent to us." "tailored to you" is inaccurate (there are two tracks, not tailoring). "as you go" filler. "never sent to us" is a promise; verify this is true of the implementation.
- :121 "I'm a Thai or home student" vs Thai copy which says "นักศึกษาไทย" only. "home student" is British university jargon that international BIR readers may not know; keep "Thai student" or "I live in Thailand".
- :123 to :124 "Start here if you're joining BIR from a Thai high school, or you already live in Thailand." Fine; but where does a Thai student who was educated abroad (returning) go? Rewrite headings around a fact: "I already live in Thailand" and "I am moving to Thailand to study".
- :126 "Start here if you're moving to Bangkok from abroad to study at BIR. A condensed Thai-language summary is also available for buddies and staff." The second sentence is aimed at a different reader (the buddy) placed on a student's choice card. Move it to the track page.
- :128 to :129 "See every guide if no track fits, or if you want to explore at your own pace." "at your own pace" filler. Rewrite: "See all student life guides."
- :132 to :137 privacy copy: "Ticked tasks are saved only in this browser's local storage. We never see it, and it's never sent to BIRSA or anyone else." "We" is BIRSA (site convention, EDITING.md), so "never sent to BIRSA" contradicts "we". Also "Use the reset button above" is a visual-only positional instruction (EDITING.md forbids). Rewrite: "Your ticks are saved in this browser only. BIRSA cannot see them. Select Reset your progress to clear them, or clear your browser's site data."
- :114 "You have marked ${done} of ${total} task as done." grammar OK. Fine.
- :77 to :80 comments only.

### 1.16 tracks.ts

- :16 to :17 home: "Practical, everyday guidance for all BIR students, plus culturally specific knowledge that is not written down elsewhere." "Practical, everyday guidance" filler; "culturally specific knowledge that is not written down elsewhere" is a boast. Rewrite: "Guides to getting around, eating, studying and staying safe around Tha Prachan, for every BIR student."
- :20 to :21 international: "Everything you need for your first weeks and beyond in Bangkok." Overclaim. "A condensed Thai-language version of each section is also available, written for Thai buddies and staff who support international students." Meta and the wrong audience for this card. Rewrite: "Visas, arrival, banking, phones, healthcare and culture for students moving to Bangkok from abroad."
- :25 handbook: "The BIR student handbook: admission and fees, the curriculum and the 2023 revised study plan, the academic rules that govern your degree, the internship, and academic activities. Based on the 2021 edition, with the study plan updated to the 2023 revision." Run-on list; colon; "that govern your degree" officialese. Rewrite: "Fees, the curriculum, the four-year study plan, academic rules, the internship and exchange. Adapted from the 2021 handbook, with the study plan from the 2023 revision." The "adapted from the 2021 edition" line is useful for trust, but also admits the rest (fees, dates) may be old: say which sections were re-checked.

## 2. Voice and language patterns across the scope (with counts)

- Officialese carried from the source: "in accordance with", "designated person", "punitive measures", "nominated for", "mandated", "inaugurated", "is granted by the Rector", "in certain circumstances", "shall" style ("must complete" is fine). Fix by naming the actor and the action.
- Stock phrases to remove: "Throughout your studies" (about-bir:15, :17 "throughout their studies"), "various fields and professions" (:15), "various academic concepts" (academic-activities:38), "a variety of prestigious universities" (academic-activities:11), "a strong tradition" (about-bir:33), "a full spectrum" (:33), "opens the opportunity" (internship:9), "a key part of the first year" (about-bir:13), "worth", "safe fallback", "go a long way" (culture:73).
- Tricolons: about-bir:13 (study, social life, sports), about-bir:39, admission-and-fees:13, banking:26, ob/international.ts:127, :198, culture:11.
- Over-hedging: in the international pages, "usually", "typically", "often", "generally", "sometimes", "some" appear in almost every paragraph. Count is high (roughly 40 across six pages). Rule of thumb: state the rule, then name the exception, or say who decides.
- Filler summaries and platitudes: culture:71 to :73, healthcare:49 to :51, visa:35 to :39, banking:32.
- Meta commentary about the page (forbidden by EDITING.md): curriculum:9 to :14, curriculum:75, admission:61, internship:30, academic-life:9, arrival:20 to :22.
- Mixed-in Thai-English structures: "on the date specified by", "facebook/birprogram", "Baht", "Enrollment", "advisor" (British: adviser), "acknowledgement" for permission (academic-life:91).
- Contractions: house rule expands negatives. Found "doesn't" (academic-life:25), "don't" (:62), and "won't" (:25, :37, :38 use "won't"/"it's not"). Fix to "does not", "do not", "will not". Positive contractions (you'll, it's) are allowed.
- Colons: EDITING.md forbids dashes only for general content, and bans colons only in news. Still, the handbook uses colons as connectors in many places (academic-life:29, :46; assessment:26; internship table :57; arrival:14). Consider following the news rule for consistency; at minimum remove colon-as-connector inside sentences.
- Capitals: "Required Courses", "Elective Courses", "Free Elective Course" (curriculum) against sentence case; status words "WARNING", "PROBATION", "DISMISSED" in capitals.
- No dashes anywhere in the scoped files (checked programmatically for U+2013 and U+2014). Hyphens in ranges: none found; ranges use "to". Good.
- "please": none. Good.
- Bold used as pseudo-headings: about-bir:49, :59; academic-life:41, :48, :64; assessment:39, :47; curriculum:106, :121, :221 etc. They do not appear in the page outline and cannot be linked to. Use h3.
- Notice overuse: 12 Notices over 13 pages, several duplicating body text (academic-life:78, curriculum:9, :16, :239, :269, :309; internship:65). Placeholder variant used on four international pages: banking:13, culture:19, visa:9 (and check Thai).

## 3. Structure and proposed information architecture

### 3.1 Diagnosis

- The split mixes three axes. "International" is an audience, "home" is a topic set (everyday life on and near campus), and "handbook" is a source document. A student thinking "how do I register?" has to guess between handbook and home. International students get their own health, phone and money pages, while the home pages already cover student cards, TU clinic, accident insurance, TU Greats and money (home/money-matters.mdx, home/health-and-wellbeing.mdx, home/rights-and-welfare.mdx). The two overlap without linking, and they conflict on insurance.
- The "handbook" is really three things: a university and programme profile (about-bir), a set of rules (academic-life, assessment-and-degree), and a course catalogue (curriculum). Only the internship page is a task.
- Duplicated and drifting content: credit totals (assessment:32 versus curriculum:26 to :31), 90-day and 7-year numbers, contact details (three phone numbers or emails), the fee estimate in ob/international.ts:275, S/U grading (assessment:26 versus internship:74 to :80), plagiarism (also in home/study-support), the first-year probation rule stated three times (academic-life:60 to :61, :78 to :82, :74 to :76), and the internship deadlines in three places (curriculum:298, internship table, internship schedule).
- The onboarding checklist and the arrival page cover the same ground with different orders (checklist: visa, arrival, bank, SIM; arrival page: keys, SIM, TU international office, bank). The arrival page has its own static checkbox list that does not persist.
- International pages are 34 to 73 lines and none has a single verified fact a student could act on (no name, number, fee, URL or date). The handbook pages are dense but mostly unedited copy.
- The onboarding checklist is a reading list. Every task is "Read about X". A checklist should be actions with a page behind each one.
- Home versus international duplication for a non-Thai student: they must read both tracks, but the chooser presents them as alternatives ("Start here if...").

### 3.2 Proposed structure

Keep two front doors (onboarding checklist for newcomers; a library for everyone), but organise the library by task, not by audience or source. Use the international audience as a tag or a callout on each page ("If you are not a Thai citizen"), rather than a separate section. Keep the existing `audience` frontmatter values if the schema is hard to change (lib/content.ts:86 uses a fixed enum), or add a fourth value "study". Suggested groups, titles and slugs (sentence case titles, no colons):

A. Before you arrive and in your first week (audience: international, plus a home equivalent)

1. `first-week/plan-your-first-week` "Your first week at BIR" (merge arrival-and-first-week, keep only actions, link out)
2. `first-week/get-to-tha-prachan` "Get from the airport to Tha Prachan" (the transport half of arrival page, with route, times and fares)
3. `first-week/student-id-and-tu-account` "Get your student card and TU account" (new)
4. `first-week/register-for-courses` "Register for your courses" (from academic-life:11 to :31 plus the credit limit; new registration walk-through)

B. Living in Thailand as an international student (audience: international) 5. `visa/visa-and-stay` "Your ED visa and staying legally" (visa-and-immigration, expanded: enrolment letter, extension, 90-day report, re-entry permit, TM30, working and interning, what leave of absence does to your visa) 6. `visa/90-day-report` "Report your address every 90 days" (own page; it is the most searched task) 7. `visa/tm30` "Check your landlord has reported your address (TM30)" (new) 8. `money/open-a-bank-account` "Open a Thai bank account" 9. `money/pay-tuition-and-fees` "Pay your tuition and fees" (from admission-and-fees fee section, plus international transfer, receipts, deadlines) 10. `money/money-from-abroad-and-promptpay` "Send money to Thailand and use PromptPay" 11. `connectivity/sim-card-and-wifi` "Get a Thai SIM card and connect to TU wifi" 12. `health/health-cover-and-clinics` "Health insurance and where to get treatment" (merge international healthcare with home/health-and-wellbeing accident insurance and the TU clinic, and label what applies to international students) 13. `housing/find-a-place-to-live` "Find a place to live" (dorms, TU dorms, private rental, deposit, contract; new; link to home/places-nearby) 14. `culture/customs-and-etiquette` "Customs and etiquette" and `culture/basic-thai-phrases` "Basic Thai phrases"

C. Studying at BIR (audience: all; replaces most of handbook) 15. `study/how-your-degree-works` "How your BIR degree works" (credits, structure, semester dates; short; from admission-and-fees:38 to :52 and assessment:30 to :35) 16. `study/course-structure` "Course requirements" (curriculum lists, table with credits) 17. `study/four-year-plan` "The four-year study plan" (plan only; links to /services/study-plan) 18. `study/add-drop-and-withdraw` "Add, drop or withdraw from a course" 19. `study/grades-gpa-and-warnings` "Grades, GPA, warnings and probation" (single canonical rule table) 20. `study/missed-exam-and-leave` "Miss an exam or take leave of absence" 21. `study/plagiarism-and-referencing` "Plagiarism and referencing" 22. `study/internship` "The compulsory internship" (keep, add cohort switch and abroad and visa notes) 23. `study/exchange-and-field-trip` "Exchange, field trip and conferences" (academic-activities) 24. `study/graduate` "Graduate with honours" (assessment:30 to :65 as apply-to-graduate, honours table)

D. About (audience: all; move out of handbook) 25. `about/contact-the-programme-office` "Contact the BIR programme office" (contacts and hours, three offices explained: BIR programme office, Faculty, TU international office) 26. `about/thammasat-and-the-faculty` "About Thammasat and the Faculty" (history condensed to about 150 words) 27. `about/admission-requirements` "Entry requirements and applying" (for applicants and parents; not student guide; or link out to admissions)

Redirects: keep old slugs (`/student-life/handbook/academic-life` and so on) with redirects, since onboarding href values and Thai slugs must match (tests enforce identical filenames under th/). Any rename needs the same rename under content/student-life/th/ and updates to ob/home.ts and ob/international.ts hrefs, and the search index.

### 3.3 If a full restructure is too big

Minimum viable changes:

1. Split visa-and-immigration into "Your ED visa", "Report your address every 90 days" and "Get your enrolment letter and extend your visa".
2. Split academic-life into "Register, add, drop and withdraw", "Grades, warnings and probation", and "Leave, suspension and missed exams".
3. Move about-bir's history to the bottom or a separate page; lead with contact.
4. Cut duplicated tables (credits, S/U) to one canonical page each.
5. Make the checklist action-based and link each action to one page.
6. Turn the arrival page into the single list of first-week actions and delete the static checkbox list.
7. Cross-link the international and home pages (insurance, TU clinic, TU Greats, student card).

Length targets: about-bir 68 lines to about 35; academic-life 96 lines to three pages of about 40; curriculum 314 lines is acceptable only as a reference table; international pages should grow to 60 to 90 lines each with verified facts and per-fact "last checked" dates.

## 4. Contradictions and internal inconsistencies (fix before publishing)

1. Summer session "optional" (H:admission-and-fees.mdx:40; H:curriculum-and-study-plan.mdx:264) versus "compulsory" (:294) versus summer 6 to 8 weeks (:40) versus internship 8 weeks (H:internship.mdx:18).
2. Programme name "English Program" (H:admission-and-fees.mdx:11) versus "International Program" (:24, H:about-bir.mdx:37).
3. Contact details: phone (66) 02-613-2304 (H:about-bir.mdx:53) versus 02-221-6111 ext. 3409 (H:internship.mdx:123); email bir@staff.tu.ac.th (:57) versus bir@tu.ac.th (H:internship.mdx:125); two websites for international office (polsci.tu.ac.th/oia.polsci in H:academic-activities.mdx:20; www.oia.tu.ac.th in H:about-bir.mdx:68).
4. Office naming: "TU International Affairs" (I: all pages), "Thammasat International Office" (H:about-bir.mdx:68), "Office of International Affairs" (H:academic-activities.mdx:18).
5. Internship "abroad" (H:about-bir.mdx:15) versus the internship page, which never mentions abroad; and "extracurricular" (same line) versus compulsory credit-bearing.
6. Exchange "typically during third year" (H:academic-activities.mdx:15) versus the third-year plan with a compulsory summer internship and a full course load (H:curriculum-and-study-plan.mdx:274 to :298) and field trip in third year (:32).
7. Minimum 7 semesters (H:assessment-and-degree.mdx:34) versus a four-year plan of eight semesters (H:curriculum-and-study-plan.mdx:219 to :312, which stops after Year 4 semester 1); versus 7-year time limit (H:academic-life.mdx:53); versus 4 years for honours (H:assessment-and-degree.mdx:41).
8. First-year probation rules at H:academic-life.mdx:58 to :62, :72 to :76 and :78 to :82 (see 1.5). Worked example row (:68) says a GPA of 2.00 has no warning; :74 says a first-year GPA of 2.00 is a warning.
9. Attendance: fixed 80% (H:assessment-and-degree.mdx:24) versus "may vary from one course to another" (same line).
10. Fees: total per year cannot be derived from the table (H:admission-and-fees.mdx:58 to :71).
11. Regulation editions: Bachelor Degree Regulations (1997) (H:admission-and-fees.mdx:26) versus 3rd Edition (2012) (H:academic-life.mdx:17).
12. Insurance: I:healthcare-and-insurance.mdx:15 "expect or require" versus home/health-and-wellbeing.mdx:36 "every Thammasat student is covered".
13. SIM registration: ob/international.ts:107 "need a Thai address or ID first" versus I:phones-and-internet.mdx:14 "your passport".
14. First-week order: I:arrival-and-first-week.mdx:22 to :29 versus ob/international.ts steps.
15. Onboarding "Check BIRSA activity regulations" (ob/international.ts:318) but the hint lists University and Faculty documents, not BIRSA's.
16. ob/index.ts:134 "never sent to BIRSA" versus "We" (BIRSA) in the same sentence.
17. Internship deadline "end of April" (H:curriculum-and-study-plan.mdx:298) versus "Within 28 April 2026" (H:internship.mdx:44).
18. Study plan credits: the four-year plan totals 127 only if the "optional" Year 2 summer is taken (H:curriculum-and-study-plan.mdx:264 to :267).

## 5. Gaps (what a first-year or international BIR student needs and cannot find)

Academic and administrative (all students)

- How to register on the first day: which system, how to log in, first-year defaults, what to do if the course is full, and the English exemption test (referred to at curriculum:12 and :240 but never explained: who takes it, when, what result exempts which course).
- Add/drop dates as a calendar (only day counts given), tuition payment deadlines, late payment penalty, receipts.
- Grade appeals, "I" (incomplete) or "X", retaking courses, how repeat grades replace or average, GPA calculation formula (GPA versus GPAX).
- Leave of absence: the actual procedure, forms, deadline, and the missing second branch (H:academic-life.mdx:46). Medical leave and exam absence certificates.
- Graduation: how to apply, ceremony, transcript and certificate requests, degree certificate timing, English-language transcript, graduation fee.
- Scholarships and financial aid: TU and Faculty scholarships, external scholarships, deadlines; none appears anywhere in scope.
- Exchange: how to apply, eligibility GPA, language requirement, cost, credit transfer, deadlines.
- Student ID card: how to get it, replacement, what it does (TU Greats app shows a digital card, per onboarding), Bangkok Bank card link.
- TU accounts: email, TU Greats (login, first-time activation), Google Workspace, wifi credentials, VPN for library resources, e-learning platform.
- Advisor system: who is your adviser, how to contact, and what they approve (add/drop approval appears at academic-life:21).
- Where each office is on campus (Registrar, Faculty, programme office at 2nd floor of the Faculty building, Student Affairs), hours, and queue procedures. A map.
- Academic calendar: link with semester start and exam dates. Public holidays and exam weeks.
- Dress code and uniform for classes and ceremonies; ID card display.
- Academic support: writing centre, Thai-language help, disability support, mental health (home guide has counselling; not linked from the handbook).
- Research or thesis: does BIR require an independent study? (Not in curriculum list; confirm.)
- Complaints, academic misconduct procedure beyond plagiarism, harassment (link exists on arrival page).

International-specific

- Before you arrive: acceptance letter, what documents to bring, how to apply for the ED visa from your home country (Thai embassy or consulate, timing), medical certificate, police check requirement, how long it takes, fees.
- Visa extension after arrival: what documents the university issues, when to apply (before expiry), fees, processing time, number of days per extension (typical one year, check).
- 90-day report: procedure, online link, how far ahead, fine amount, whether ED visa holders in some categories are exempt.
- TM30: what it is, landlord or dorm duty, what students need to check, how to look up status.
- Re-entry permit: cost, single or multiple, airport availability, how it interacts with a multiple-entry visa.
- Work permit and internship rules: students on ED visas generally cannot work without permission; what counts as work; whether the compulsory summer internship needs a work permit or written permission, and who arranges it; part-time work rules; volunteering. The internship page is silent on this, and it is an obligatory 8-week placement.
- What happens to your visa if you take leave, are dismissed, drop below credits, or graduate (grace period, changing visa type).
- Overstay penalties and consequences.
- Dorms and housing: TU dorm options (Rangsit dorm vs Tha Prachan), private dorms, deposit norms, contract length, utilities, a standard rental contract in English, scams, how to report; the onboarding step links only "places to live" on the home page.
- Getting around: Chao Phraya Express boat, ferry, BTS/MRT, taxi apps; there is a home guide but no cross-link from the arrival page; add route from the airports.
- Insurance: what TU requires, the accident cover, buying a policy, claiming, dental; and the emergency contact for the international office.
- Language: Thai courses at TU, English support, how much Thai you need for daily life and in class.
- Buddy programme: the onboarding text mentions "buddies" but the English international pages do not explain how to get one.
- Religion and food: halal, vegetarian, prayer rooms (home guide may cover; not linked).
- Safety: scams targeting foreign students, drink spiking, lese-majeste and political expression (legal risk), drugs laws (cannabis rules changed; carry documents for prescription drugs), drink-driving and motorbike licence rules (renting a motorbike without a Thai licence invalidates insurance).
- Home-country contacts: your embassy in Bangkok, how to register with it.
- Tax and money: currency exchange, ATM fees for foreign cards, overseas transfers, budget.
- Climate and flood season: an emergency section exists; cross-link from arrival.

## 6. Fact-check list

Everything below should be verified by someone with access to current official sources. I did not research any of it. Line numbers are within the named file (H: handbook, I: international).

### 6.1 Fees, credits and dates

- H:admission-and-fees.mdx:58 "Thai students: 125,000 Baht" and :59 "Non-Thai students: 144,000 Baht" per academic year. Also duplicated at ob/international.ts:275 (and Thai at th line 276).
- H:admission-and-fees.mdx:64 to :71 individual fees: enrolment 400 (once), tuition 2,500 per credit, programme 12,000 per semester, health 125 per semester, sport 200 per semester, activities 200 per semester, library 2,000 per year. Check that the fees produce the totals, that non-Thai students pay a different figure and what it is, whether the "Program fee" differs by nationality, and the year of the fee schedule. My arithmetic: 24,000 + 250 + 400 + 400 + 2,000 = 27,050 per year plus 400 once, so 125,000 implies about 39 credits a year at 2,500 per credit, and 144,000 implies about 46 credits; neither matches the normal 30 to 36 credit load. Something is missing (for example nationality surcharge).
- H:admission-and-fees.mdx:11 "established since 2008".
- H:admission-and-fees.mdx:26 "item 7 of Thammasat University's Bachelor Degree Regulations (1997)".
- H:admission-and-fees.mdx:27 "total GPA of at least 2.80 for the last four terms".
- H:admission-and-fees.mdx:32 to :36 every English test score (TOEFL 500 PBT / 61 iBT; IELTS 6.0; TU-GET 500 PBT / 61 CBT; SAT 400; GSAT 400). Which tests are currently accepted (TOEFL PBT no longer offered; TU-GET format).
- H:admission-and-fees.mdx:40 summer session "optional, 6 to 8 weeks"; :44 to :46 semester month ranges (Aug to Dec, Jan to May, Jun to Jul).
- H:academic-life.mdx:17 credit limits "no fewer than 9 and no more than 21 credits" per regular semester, "no more than 6" in summer, "Item 10.4 of ... Bachelor Degree Regulations, 3rd Edition (2012)".
- H:academic-life.mdx:21 and :25 add/drop period "first 14 days" (regular) and "first 7 days" (summer).
- H:academic-life.mdx:29 withdrawal period "first 10 weeks" (regular) and "first 4 weeks" (summer), and the "W" grade.
- H:academic-life.mdx:31, :37 Dean's approval outcomes.
- H:academic-life.mdx:44 first-year leave restriction (first 2 semesters, Rector's permission).
- H:academic-life.mdx:45 "more than two consecutive semesters" leave.
- H:academic-life.mdx:46 the 14-day leave rule and "fees for maintaining student status" (and the amount).
- H:academic-life.mdx:50 to :54 suspension refund and fee rules.
- H:academic-life.mdx:53 "maximum limit of 7 years".
- H:academic-life.mdx:58 to :62 GPA thresholds (2.00), the WARNING then PROBATION then dismissal chain, the summer grade rule.
- H:academic-life.mdx:68 to :70 worked example figures.
- H:academic-life.mdx:74 to :76 first-year thresholds (2.00 warning, 1.50 dismissal).
- H:academic-life.mdx:86 to :87 plagiarism penalty (fail the subject).
- H:assessment-and-degree.mdx:13 to :22 grade point values (A 4.0, B+ 3.5, ... F 0), and whether there is no "D" boundary change or whether TU uses "W", "I", "S", "U" separately.
- H:assessment-and-degree.mdx:24 "at least 80% of classes".
- H:assessment-and-degree.mdx:32 "127 credits ... 30 GE, 91 major, 6 free electives" (also H:curriculum-and-study-plan.mdx:24 to :31, :35 to :38 (21 + 9), :75, :137, :139).
- H:assessment-and-degree.mdx:33 GPA at least 2.00; :34 at least 7 semesters; :35 request within "first 14 days" of the final semester or "first 7 days" of the final summer session.
- H:assessment-and-degree.mdx:41 to :65 honours criteria: 4 years, GPA 3.50 and 3.25, "below C" counts, U, repeats, F, disciplinary level ("parole"). Check the term and the second-class lower/upper structure.
- H:curriculum-and-study-plan.mdx:24 to :215 every credit total and course code and title (the arithmetic checks out: 30 + 19 + 3 + 18 + 21 = 91; 21 + 9 = 30). Verify which courses are offered this year, that PI574 is 1 credit (:98, :296), that AH208/EL295 choices are right, that PI293 (:197) and other listed codes exist, and whether the exemption rule (:12, :240) is described correctly. Confirm that "2023 revision of Curriculum 2021 (B.E. 2564)" applies to the current first-year cohort and which cohorts are on this plan.
- H:curriculum-and-study-plan.mdx:264, :294 summer optional versus compulsory.
- H:curriculum-and-study-plan.mdx:298, :314 internship request timing "November before", "end of April", and the missing Year 4 semester 2.

### 6.2 Internship (all date claims are for a finished cohort)

- H:internship.mdx:18 "8 weeks (June to July)".
- H:internship.mdx:43 to :44 form periods "November 2025 to 31 March 2026" and "Within 28 April 2026".
- H:internship.mdx:46 to :49 and :108 to :110 Google Forms links (are they still live for the new cohort?).
- H:internship.mdx:53 "students with ID 66, academic year 2025 (B.E. 2568)" and rows :57 to :62: 7 Oct 2025, 25 May 2026, 2 June to 24 July 2026, 26 June 2026, 24 to 31 July 2026, 2 August 2026. All are past as of 2026-09-30. Need ID 67 dates (or the current cohort) and archive the old ones.
- H:internship.mdx:65 "Internship 66 Google Classroom", and :66 "https://www.birpolsci.com/birinternship".
- H:internship.mdx:82 to :87 marks split (5 + 45 + 20 + 30 = 100) and :89 the "below 10 marks" rule for the first evaluation.
- H:internship.mdx:95 to :96 report length "12 to 15 pages" and font "Times New Roman 12, single-spaced".
- H:internship.mdx:112 to :117 evaluation form PDF URLs (image.makewebcdn.com; "V2026" file names) and acceptance form link, in particular the long percent-encoded URLs.
- H:internship.mdx:121 to :126 phone "02-221-6111 ext. 3409" and email bir@tu.ac.th.
- H:internship.mdx:74 to :80 S/U grading of PI574.

### 6.3 About, contacts and URLs

- H:about-bir.mdx:21 "inaugurated on 27 June 1934"; "University of Moral and Political Sciences"; "two years before" (1932).
- H:about-bir.mdx:25 Pridi quote wording and source.
- H:about-bir.mdx:27 "coup d'état on 8 November 1947", the renaming, the abandoned open system, "four new degree programmes: Law, Political Science, Economics, and Commerce and Accountancy", "Act of 2495 B.E.".
- H:about-bir.mdx:29 "In 2011", the motto wording.
- H:about-bir.mdx:33 "established in 1949", "three majors"; :35 "doctoral programme, established in 2001".
- H:about-bir.mdx:45 "2nd floor of the Faculty of Political Science Building"; :47 hours "Monday to Friday, 09:00 to 16:00" (and lunch closure, holidays).
- H:about-bir.mdx:51 address "2 Prachan Rd, Bangkok 10200".
- H:about-bir.mdx:53 phone "(66) 02-613-2304"; :55 fax "(66) 02-226-5652"; :57 email bir@staff.tu.ac.th.
- H:about-bir.mdx:63 to :68 all six URLs (birpolsci.com, polsci.tu.ac.th, tu.ac.th, reg.tu.ac.th, library.tu.ac.th, oia.tu.ac.th).
- H:academic-life.mdx:13 "www.birpolsci.com" and "facebook/birprogram".
- H:academic-life.mdx:17 Registrar's site "www.reg.tu.ac.th" and the "Enroll" menu name.
- H:academic-activities.mdx:11 partner regions; :13 partners LMU Munich, Halmstad University, Nottingham Trent University; "open only to Political Science students".
- H:academic-activities.mdx:15 "typically ... third year".
- H:academic-activities.mdx:20 "http://www.polsci.tu.ac.th/oia.polsci" (http, not https; check it resolves); :22 oia.polsci@gmail.com and the named contact "Ms Suphorn Mukphimphan" (a personal name and a Gmail address: confirm consent and that it is current).
- H:academic-activities.mdx:28 "Diplomatic Forum at Thammasat (DFAT)" exists and is run yearly, and the "yearly student organised conference".
- H:academic-activities.mdx:32 to :34 "annual field trip for third-year students", "Past destinations include Taiwan and Turkey", "especially in Southeast Asian countries".
- H:academic-activities.mdx:38 to :40 BISC and the Facebook URL "facebook.com/BISC.BIR", whether it is annual and open to graduate students.

### 6.4 International: visas, immigration, money, health, culture

- I:visa-and-immigration.mdx:17 "Non-Immigrant ED visa", "tied to your enrolment", and that TU International Affairs issues supporting letters.
- I:visa-and-immigration.mdx:21 90-day address reporting for continuous stay; the "fine" for missing it (and the amount); online reporting availability; whether "some universities" coordinate it and whether TU does.
- I:visa-and-immigration.mdx:29 re-entry permit rule and automatic cancellation on exit; availability at the airport; fee; single versus multiple.
- I:visa-and-immigration.mdx:33 extension timing and length; "Chaeng Watthana Government Complex" as the Bangkok office; document list; "Incomplete applications are the most common cause of delay".
- I:visa-and-immigration.mdx:37 "departure card" (TM6) still issued; "at all times" carry photocopies.
- I:banking-and-money.mdx:17 to :20 document list banks require; :19 "Visa page showing your Non-Immigrant ED status"; :20 proof of address; the TM30 or residence certificate that many banks now require.
- I:banking-and-money.mdx:26 PromptPay linked to "national/passport ID"; whether foreigners can register with a passport or need a phone number; QR usage.
- I:banking-and-money.mdx:36 international transfer flow.
- I:phones-and-internet.mdx:14 registration with passport "by law", and any face-scan requirement; :16 carriers and package categories; :24 TU wifi for "enrolled students" using "university account credentials", and the SSID.
- I:healthcare-and-insurance.mdx:11 Siriraj is "directly across the river from Tha Prachan" and reachable by "a short cross-river boat"; public versus private hospital claims.
- I:healthcare-and-insurance.mdx:15 whether Thammasat requires health insurance for international students (and whether the visa requires it).
- I:healthcare-and-insurance.mdx:30, :34 emergency numbers 1669 and 191 (and consider adding 1155 tourist police, 199 fire, campus security).
- I:healthcare-and-insurance.mdx:43 "green cross sign" pharmacy identification and prescription rules.
- I:culture-and-language.mdx:11 wai etiquette statements.
- I:culture-and-language.mdx:15 "The Grand Palace, near campus, enforces this strictly and can refuse entry".
- I:culture-and-language.mdx:34 to :55 Thai words, Thai script, romanisation (especially "tao-rai" and "khor-thot").
- I:culture-and-language.mdx:63 Buddhist holidays named (Makha Bucha, Visakha Bucha, Asalha Bucha) and closures, "government offices", "alcohol sales" restrictions.
- I:culture-and-language.mdx:67 to :69 etiquette claims.
- I:arrival-and-first-week.mdx:12 airports (BKK, DMK); :14 "Airport rail link ... fast and predictable from Suvarnabhumi ... need to connect"; :15 meter and app fare; :18 "Thammasat, Tha Prachan campus" phrasing; "which has multiple campuses".
- I:arrival-and-first-week.mdx:26 "Register with TU International Affairs and complete any arrival paperwork they require".
- I:arrival-and-first-week.mdx:38 "visa's 90-day reporting deadline" (the 90 days run from arrival or the last report, not from the visa).
- I:arrival-and-first-week.mdx:42 welcome events run by BIRSA (dates, whether the event exists).
- I:arrival-and-first-week.mdx:46 "TU International Affairs handles visa and enrolment issues" (enrolment is not usually the international office's job).
- ob/international.ts:143 to :150 that /student-life/home/rights-and-welfare covers the TU Greats App and student card and facility hours.
- ob/international.ts:211 to :217 whether international students are eligible for the student body roles.
- ob/index.ts:120, :134 the claim that progress "is never sent to us".
- content/student-life/tracks.ts:21, :25 the claim that a "condensed Thai-language version of each section" exists (yes, files exist under th/international) and "Based on the 2021 edition" (confirm the edition year).

### 6.5 Placeholder Notices still on live pages

- I:banking-and-money.mdx:13 (placeholder), I:culture-and-language.mdx:19 (placeholder), I:visa-and-immigration.mdx:9 to :13 (placeholder variant). Also check I:phones and I:healthcare (no notice, yet unverified in style). Every fact in sections 6.4 relating to these pages is unverified by the site's own admission. Note ob/international.ts:8 to :11 header comment says the same.

## 7. Suggested rewrites (samples)

Before and after, ready to paste (verify each fact first).

1. H:about-bir.mdx:15 to :17
   Before: "Throughout your studies, you'll learn from BIR's professors and from guest lecturers from various fields and professions. ... Faculty staff support students throughout their studies, but your progress depends mainly on your own effort. Visit the office for further information or assistance."
   After: "You learn from BIR lecturers and, in some courses, guest speakers. In your third year you take a field trip and a compulsory summer internship. The programme office on the 2nd floor of the Faculty building answers questions about registration, forms and your records."

2. H:academic-life.mdx:21
   Before: "With your advisor's or course instructor's approval, you may register for additional courses no later than the end of the adding/dropping period (the first 14 days of a regular semester, or the first 7 days of the summer session). Registration for additional courses after this period is permitted only in certain circumstances, with the Dean's approval."
   After: "You can add a course up to day 14 of a regular semester, or day 7 of the summer session. You need approval from your adviser or the course instructor. After that date you need the Dean's approval and a good reason."

3. H:academic-life.mdx:35 to :37
   Before: "If you're unable to attend an examination due to unavoidable circumstances, you or a designated person may file a petition with the instructor of the course for consideration."
   After: "If you cannot sit an exam for a reason outside your control, ask the course instructor to excuse you. You can send someone to ask for you. Say when the petition must be filed once that is confirmed."

4. H:academic-life.mdx:86
   Before: "The BIR programme takes plagiarism seriously. Plagiarism is the inclusion of any material derived from published or unpublished work without acknowledgment of the author(s). Any student caught plagiarising, whether intentional or not, will face punitive measures at the course lecturer's discretion."
   After: "Plagiarism means using someone else's work or ideas without saying where they came from. It counts even if you did not mean to. The course lecturer decides the penalty, and you can fail the course."

5. H:assessment-and-degree.mdx:24
   Before: "Attendance is mandatory, and you have to attend at least 80% of classes in order to pass. The specific rules on grading and attendance may vary from one course to another, so check the course syllabus or ask your instructor at the start of each term."
   After: "You must attend at least 80% of classes to pass. Some courses set their own attendance and grading rules, so read the syllabus in the first week."

6. H:academic-activities.mdx:28
   Before: "...such as the yearly student organised conference on topics of Politics and International Relations, or the Diplomatic Forum at Thammasat (DFAT), which offers the chance of experiencing first-hand contact with seasoned diplomatic personnel."
   After: "Students organise a conference on politics and international relations each year. The Diplomatic Forum at Thammasat (DFAT) lets you meet serving diplomats."

7. I:visa-and-immigration.mdx:29
   Before: "If you plan to travel outside Thailand and return on the same visa, you will need a re-entry permit before you leave; otherwise your visa may be automatically cancelled the moment you exit the country."
   After: "Get a re-entry permit before you leave Thailand. Without one, your visa is cancelled when you exit. You can buy one at an immigration office or, at some airports, before you fly. [Add fee and options after checking.]"

8. I:visa-and-immigration.mdx:21 to :25
   Before: "If you stay in Thailand continuously, immigration law requires you to report your address every 90 days. This is a routine notification, not a new visa application, but missing the deadline can result in a fine. Options usually include: ..."
   After: "If you stay in Thailand for more than 90 days in a row, you must tell Immigration your address every 90 days. This is not a new visa application. A late report can lead to a fine of [amount]. You can report in person at [office], online at [link], or by post [if allowed]. Ask [named TU office] whether the University files for you."

9. I:banking-and-money.mdx:15 to :22
   Before: "Requirements vary by bank and sometimes by branch. International students are typically asked for a combination of: ... Ask other international students or TU International Affairs which branches near Tha Prachan process student applications most often."
   After: "Take your passport, a photocopy of the passport, your visa page, an enrolment letter, and proof of your address. Banks ask for different things, so call the branch first. The branches near Tha Prachan that open student accounts are [names]."

10. I:healthcare-and-insurance.mdx:15
    Before: "Many universities, including Thammasat, expect or require international students to hold valid health insurance for the duration of their stay, sometimes as a visa or enrolment condition."
    After: "Thammasat [requires / does not require] international students to have health insurance. [Say what is required, where to buy it, cost.] Every TU student also has accident insurance, which is separate. See Health and wellbeing."

11. I:culture-and-language.mdx:63
    Before: "Thailand observes several Buddhist holidays across the year (such as Makha Bucha, Visakha Bucha, and Asalha Bucha), when some shops, government offices, and, on certain dates, alcohol sales may be restricted or closed."
    After: "Makha Bucha, Visakha Bucha and Asalha Bucha are public holidays. The University and government offices close. Dates follow the lunar calendar and change each year, so check the TU academic calendar. [State the current alcohol-sales rule after checking.]"

12. ob/international.ts:32 lede
    Before: "Everything to sort out, roughly in order, before and after you arrive in Bangkok to study at BIR. Tick tasks off as you complete them. Nothing is sent anywhere, it all stays on this device."
    After: "Do these in order before and after you arrive. Tick a task when you finish it. Your ticks are saved in this browser only."

13. ob/index.ts:134 privacy body
    Before: "Ticked tasks are saved only in this browser's local storage. We never see it, and it's never sent to BIRSA or anyone else. Use the reset button above to clear it, or clear it by clearing your browser's site data."
    After: "Your ticks are saved in this browser only. BIRSA cannot see them. Select Reset your progress to clear them, or clear your browser's site data."

14. tracks.ts:21
    Before: "Everything you need for your first weeks and beyond in Bangkok. A condensed Thai-language version of each section is also available, written for Thai buddies and staff who support international students."
    After: "Visas, arrival, money, phones, healthcare and culture for students moving to Bangkok from abroad. A short Thai version is available for buddies and staff."

15. Checklist task rewrite (ob/international.ts steps): change label pattern from "Read about X" to an action, for example:
    - "Ask the international office for your enrolment letter" (links to visa page)
    - "Report your address to Immigration within 90 days of arriving"
    - "Open a Thai bank account"
    - "Register for your courses"
    - "Get your student card and activate your TU account"

## 8. Prioritised recommendations

1. Replace or archive the stale ID 66 internship dates; add a cohort banner and ID 67 dates (blocker for third-year students now).
2. Resolve the three "international office" names; give one office name, place, hours and contact, and use it in every "ask TU International Affairs" sentence.
3. Verify and remove the placeholder Notices on banking, culture and visa, or unpublish those pages from the checklist.
4. Fix the contradictions in section 4, especially probation rules, leave, summer optional versus compulsory, fees and SIM registration.
5. Add the missing high-value pages: register and pay, student card and TU account, TM30 and 90-day report, work rules for the internship, scholarships, graduation.
6. Rewrite prose in the order: academic-life, assessment, about-bir, admission, visa, healthcare, culture, banking, phones, arrival, academic-activities, internship (lightest), curriculum (mostly structure).
7. Convert the onboarding checklist to actions, cut the Get involved step to two tasks, and stop duplicating fee figures.
8. Adopt the task-based IA in section 3 (or the minimum viable version), keep old slugs redirected and keep Thai filenames in step (tests enforce matching slugs).
9. Add "last checked" dates to every page with a rule, fee or phone number, matching the practice in docs/EDITING.md for emergency guides.
10. Fix style issues in bulk: negative contractions, "adviser", "enrolment", "baht", sentence-case course headings, bold pseudo-headings to h3, remove colons as connectors.
