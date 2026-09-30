# Review: English "home" student life guides (content/student-life/en/home/*.mdx) and content/onboarding/home.ts

Reviewer notes. Read-only review; no repo files edited. All paths relative to /home/user/birsawebsitelive.
Line refs are file:line in the current tree (checked 2026-09-30).

## 0. Headline findings

1. **Audience mismatch with the brief.** Every guide has `audience: home` (Thai and home students), and the onboarding track is titled "Starting at BIR: for Thai and home students" (onboarding/home.ts:18). International BIR students have a separate track under content/student-life/en/international/ (6 guides: arrival, banking, culture, healthcare, phones, visa). So this set is not written for the international cohort, and it contains almost nothing an international newcomer needs. Several home guides do mention passports (health-and-wellbeing.mdx:11, "or passport, for international students") which shows the audiences leak. Decide whether "home" means "Thai" and say so in the summary lines, or whether these are for everyone at Tha Prachan.
2. **Whole set is a lightly edited copy of one source** (TU91 Handbook: The Magic of TPC, 2025, a Tha Prachan student union orientation journal). Eight of eleven guides end with the same 8-line "Source" Notice (food-and-budgeting:73-81, getting-around:73-81, getting-involved:131-139, health-and-wellbeing:109-117, money-matters:71-79, places-nearby:64-72, rights-and-welfare:83-91, safety-and-emergencies:57-65, study-support:103-111). That is 9 guides, not 8. The content is TPC-wide, not BIR-specific. There is almost nothing about the BIR programme, the Faculty of Political Science, or BIRSA services (see gaps).
3. **A live placeholder is showing.** food-and-budgeting.mdx:50 renders `<Notice variant="placeholder">Example guidance; BIRSA will verify details before launch.</Notice>` on a published page, above the monthly budget table. Either verify the figures and remove it, or remove the table.
4. **Style-rule breaches, mechanical.** Colons in headings and prose where the house rule allows only clock times and URLs (list in section 4). Positive contractions are allowed, negative ones are not; I found no negative contractions in the English body, good. No dashes found. Ranges use "to", good.
5. **Time-limited text baked into evergreen prose.** shuttle-bus.mdx:29 hard-codes "Until Wednesday 30 September ... From Thursday 1 October". Today is 30 September 2026, so this is stale within a day. Move date-specific notices into the `ShuttleServiceNotice` component or news.
6. **Structure is too fragmented and duplicated** (section 2): three transport pages plus a parking answer in two places; money split across money-matters and food-and-budgeting; food split across food-and-budgeting and places-nearby; health, safety and rights repeat each other and the emergency numbers.
7. **Voice is mostly acceptable but has a recognisable machine tone** in intros, "Benefits", "Tips" and closing lines (section 3).
8. **The onboarding file mirrors the structure problem** and has its own errors (section 5): the home page-level link "Learn the shuttle bus routes" skips the live bus tracker entirely; hints and blurbs use "you'll", "Get the lay of the land" and a stale "roughly in order" promise.

---

## 1. What renders (components)

Grepped components/. Relevant MDX components used in these guides:

- `<Notice variant=info|warning|placeholder title=...>` (components/Notice.tsx). `placeholder` is a warning-tinted "unfinished" box. It must never ship.
- `<Accordion summary=...>` (rights-and-welfare only).
- `<Email address=... />`.
- `<ReportHarassment />` (components/ReportHarassment.tsx) in safety-and-emergencies:45.
- `<LiveBusTracker />` (components/bus-tracker/), `<ShuttleServiceNotice />`, `<ShuttleLiveWaitTimes />`, `<ShuttleTimer />`, `<ShuttleRoute />`, `<ShuttleTimetable />` (components/shuttle/).
- `<NearbyFood />`, `<NearbyHousing />` (components/places/; map plus numbered lists).
- Raw `<table>` with `className="sr-only"` caption in health-and-wellbeing:65-91 (the only hand-written HTML table; every other table is Markdown). Keep, it is accessible, but note it is inconsistent.
- Tables are Markdown pipe tables everywhere else.

Pages render `title` as h1 (per EDITING.md rules), so the first heading in body should be h2. All guides comply.

---

## 2. Per-guide review

### 2.1 getting-around.mdx (order 1, 81 lines)

**Purpose / audience:** how to reach and move around Tha Prachan, plus Rangsit and landmarks. For any new student, especially home students who commute.

**Works:** the Rangsit table is concrete (fares, times). Landmark and taxi tip (:55) is genuinely useful. Parking rule (:45) is specific.

**Does not work:**

- :9 opens with a list of ten faculties and colleges. That is a fact about the campus, not about getting around, and it buries the task. It also lists "Political Science" without saying "your faculty". Move to a "The campus in brief" line or to the handbook.
- The "Reaching campus" section has no starting point for the reader. The bus list (:15) is 18 numbers with no origin, so a student cannot tell which bus serves them. Replace with "Find your route" by starting area, or link to the live tracker and to Google Maps/Moovit, and keep the list as a reference.
- :17 heading "By boat, ferry or rail" then a table mixing Express Boat, ferry, MRT, BTS. Rail and boat are different tasks. The table's "How" column is long sentences; better as short numbered steps or three columns (Start, Change at, Finish).
- :27 "Most students combine these depending on where they live and the time of day." Filler. Delete or replace with a concrete tip ("The boat is the usual choice from Nonthaburi and Sathorn; the MRT from Sukhumvit").
- :31 "BIR classes are at Tha Prachan, but you may still need to reach Thammasat's Rangsit campus for a joint faculty event, a central office, or a course held there. Five routes work:" Rewrite: "BIR classes are at Tha Prachan. You may need to go to Rangsit for university offices, events or a course held there. There are five routes." "Five routes work" is clunky.
- :41 "The expressway bus 1-9E is a single direct journey. The MRT and SRT combination is usually the fastest but involves the most changes." The table already says this. Cut to one sentence: "The 1-9E is direct but slow. The MRT and SRT route is usually fastest and needs three changes."
- Landmarks :49 "Tha Prachan sits inside a cluster of some of Bangkok's most recognisable sites:" tourist-guide filler. :52 "easy to point to when giving directions to visitors" is not useful. :53 "Wat Phra Kaew and the river piers, useful orientation points if you're new to the area." "Wat Phra Kaew" is inside the Grand Palace so it is not a separate landmark from :52.
- Rangsit fares and the 1-9E route number, "ปอ.32", "ปอ.524" need fact-checking (see section 4).
- :59 "Wear shoes you can walk in, and allow extra time in the rainy season when some routes flood briefly." Vague. Say which streets flood or drop it.
- :63 "For trips across the city, ride-hailing apps and the BTS/MRT network (reachable by connecting through Sanam Chai or a short taxi ride) cover most destinations." Vague and overlong. "the boat is usually the most reliable way home along the river" is a claim with no source; the file itself says Express Boat closes on some afternoons (news).
- :65 duplicates shuttle-bus content and links to it; the "live countdown" mention duplicates the shuttle page summary.
- :67 "Tips from students who've done it" is a chatty heading. "rabbit card" (:69) is a BTS card, but the same tip says "at the pier or station" where a Rabbit card does not pay for Express Boat. Wrong or misleading. Fact-check.
- Parking (:43-45) is repeated verbatim-ish in rights-and-welfare.mdx:65-68. Keep in one place.

**Suggested rewrite of the opening and one tip:**

- Now: "Tha Prachan is Thammasat's first campus, a compact, historic site opposite Sanam Luang and on the Chao Phraya river, inside Bangkok's old city. It is home to 10 faculties and colleges: Law, ..."
- Better: "The Tha Prachan campus is beside the Chao Phraya river, opposite Sanam Luang in Bangkok's old city. There is no BTS or MRT station at the gate. Most students arrive by bus, boat or the free shuttle."
  (Check that last sentence; it is the actual answer to "how do I get here" and the current page never says it plainly.)
- Now: "Top up a rabbit card or use a transit app to avoid needing cash at the pier or station."
- Better: "Carry small notes and coins. Boats and buses take cash, and a Rabbit card works only on the BTS." (fact-check)

### 2.2 shuttle-bus.mdx (order 2, 44 lines)

**Purpose:** free university shuttle lines, routes, timetable, live countdown. For everyone.

**Works:** the components carry the real content; the prose is short. The warning Notice (:35-40) is accurate and useful. The "no service on weekends" note is concrete.

**Does not work:**

- :9 is fine but "One is a quick hop to the MRT; the other loops across the river..." uses a semicolon-and-metaphor style; acceptable. Minor: "quick hop" is casual.
- :15-19 "Next departures. The board below shows the next scheduled departure for each line, live." Self-narrating ("the board below"), and "scheduled" and "live" contradict each other. The Notice at :35 admits it is not live. Rename "Next departures" and drop the sentence, or write "Next scheduled departure from campus."
- Sections are in a poor order for a task: waiting time, next departures, routes, timetable. Users want (1) when is the next bus, (2) where does it go, (3) full timetable.
- :23 "useful if you're heading onto the Blue Line." Fine; "Some of its rounds also double as dormitory shuttles" needs specifics (which rounds, which dorms) or removal.
- :29 the transitional paragraph is the worst problem: a date-bound schedule change written into prose, three sentences of "until/from", and "Both lines are running as normal" (a status claim that will be false the next time there is a disruption; that is what `ShuttleServiceNotice` is for). Also "Some hours have no service on either line, so check the table before you plan a tight connection" is fine advice.
- :38 "Build in a buffer if you're catching a train or exam." duplicates the phrasing at live-bus-tracker:21 ("leave a buffer if you are catching a train or sitting an exam"). Also grammar: "catching ... exam" is wrong; you sit an exam.
- :42 Viabus is named as the live tracker for the shuttle. Fact-check that this is still the case and give the store or link. The live-bus-tracker page is for public buses, so the two pages should cross-link, and currently do not.
- :43 "There's no shuttle service on Saturdays or Sundays." Repeated from :9 ("Monday to Friday"). Keep one. Add public holidays and exam or break periods (fact-check).
- :44 "If you're unsure which bus you're looking at, ask there." Vague. Say what to look for (line colour, sign).

**Suggested rewrite of :29:**
"Both lines run on weekdays from 07:00 to 21:30." (after the change is confirmed; move any dated notice into `ShuttleServiceNotice`.)

### 2.3 live-bus-tracker.mdx (order 3, 24 lines)

**Purpose:** live arrival times for public buses at three nearby stops. For anyone taking a public bus.

**Works:** the Notice (:17-22) is honest and specific (source: Namtang). The stop names are precise.

**Does not work:**

- :11 is a 118-word paragraph that describes the widget's UI ("Each stop is a card you can open or close ... Use the toggle at the top to switch"). This is exactly the meta-commentary EDITING.md forbids ("this page explains", "below you'll find") and the visual-only instructions rule ("the toggle at the top", "The board below"). Cut to one sentence: "Select a stop to see its lines and arrival times." If the component needs explaining, fix the component.
- :9 "Three public bus stops ring the Tha Prachan campus" then "a short walk north" for Sanam Luang; "ring" is metaphor, "almost every bus you can catch near campus" is unsourced.
- Contradiction with getting-around: that page lists 18 routes at "Sanam Luang or Tha Phra Chan" and this one names three stops. Reconcile.
- :15 heading "Good to know" is a generic filler heading (used in two guides). Rename "How accurate are the times".
- :24 "Fares, air-conditioning and step-free access are shown per line where the operator publishes them." Passive and vague. "Most routes here are run by the Bangkok Mass Transit Authority or Thai Smile Bus." Fine, but fact-check. Is it BMTA and Thai Smile Bus? Thai Smile Bus is a BMTA-affiliated operator; the sentence reads as if they were separate. Fact-check.
- Duplicated with shuttle-bus: both explain "times are estimates, build in a buffer".

### 2.4 money-matters.mdx (order 5, 79 lines)

**Purpose:** money habits, work, discounts, printing quota, tuition refunds.

**Works:** the discount tables are the most useful thing on the page: named places, amounts, conditions. Refund and W grade section (:57-61) is concrete.

**Does not work:**

- The page mixes four unrelated tasks: budgeting advice, part-time work, discounts, tuition admin. Headings do not tell a student what they will find. "Tuition, refunds and withdrawals" (the most consequential content) is buried fifth.
- :11 "Most home students rely on a mix of family support and, for some, scholarships or loans. Whatever your source of income, the same habits help:" Unsourced generalisation plus "Whatever your...". Then :13-15 are generic advice: "Track spending for a month." "Build a buffer if you can, even a few hundred baht, for weeks that do not go to plan." No BIR or Thammasat fact in the section. Also, no mention of tuition amounts, which are in the onboarding hint (125,000 baht Thai, 144,000 non-Thai) and the handbook.
- :19 "Some students take on part-time or freelance work alongside their studies: tutoring, content work, café shifts, or campus-related roles. Before committing to anything:" Filler. :21-23 three bullets say the same thing twice (fits around classes; does not eat into study time). :22 and the Notice at :25-28 say the same thing again (ask the faculty office). Triple redundancy. Also no mention of scholarships (Thai students at TU get named funds, TU loans, กยศ. student loan fund) which is the thing home students need.
- :32 "There is a set of student discounts around campus. Show your student card and ask; some are automatic, others need you to mention it." Good, but "some are automatic" contradicts the table which gives every condition as "show your student card".
- :30 "Benefits for dek TPC" uses insider slang without explaining it (dek TPC = a Tha Prachan student). Colon in heading. Rename "Student discounts near campus" and "Free entry to museums".
- :55 "Your student card also gets you a free printing quota of 100 baht per semester at Pridi Banomyong Library U2, plus free AI and plagiarism-checking tools" duplicates study-support:70-80 and the Notice at study-support:20.
- :59 "your student card doubles as a Bangkok Bank card, which is why refunds land there automatically." "doubles as" repeated in safety:19. Fact-check that this applies to all students, including students who never activated the account.
- :63 "Keeping track without the stress" is a heading that tells the reader nothing, and the paragraph repeats :13 ("Track spending"). Delete.
- :67-69 "If things get difficult. See Health and wellbeing for where to start, and check BIRSA's announcements for student support schemes." Pointing to a health page for money problems is odd; the real route is scholarships and the Student Affairs office (fact-check names). "Check BIRSA's announcements" is unspecific.
- Table row "Amazon, Faculty of Law (Amazon @คณะนิติศาสตร์)" is the Amazon café chain (coffee), not the retailer. Add "café" to avoid confusion.
- Overlap: LUA Café and ช่างคั่ว discounts appear here (:39-40) and in food-and-budgeting:41. Same for Theatre Riverside and KRAFT CAFE, listed here and as "starred" in places-nearby:50-51.

### 2.5 food-and-budgeting.mdx (order 4, 81 lines)

**Purpose:** cheap places to eat, recommendations, monthly budget.

**Works:** the recommendations table with price ranges is the right idea and concrete.

**Does not work:**

- :9 "Food near Tha Prachan is among the best value in Bangkok, away from the tourist-facing streets." Unsourced superlative, and "away from the tourist-facing streets" is odd given that the campus is next to the Grand Palace. Cut or state a fact ("A rice dish at a campus canteen costs about X baht", with a real number).
- :13 "the cheapest options" has no price. :14 "everything from boat noodles to grilled skewers at student-friendly prices" ("student-friendly prices" is marketing). :15 "well-known food market popular with students for its range and prices" says nothing. Give the price, the hours, the ferry name.
- :15 "Wang Lang (Siriraj) market. Across the river by a short boat hop" repeats the ferry tip in places-nearby:32 and getting-around:22.
- :17 "For a wider map of places, ratings and a small map" says "map" twice. Rewrite: "See Food and housing nearby for a map of about 70 places."
- :21 "Recommendations from students, with what to order and roughly how much it costs." Self-narration. Cut; the table header says it.
- :26-31 rows are fine but check: "Tam luang prabang" and "fried mid-wings" (:28) with a price range of "20 to 300 baht" is so wide that it is not information. "From 25 to 30 baht" (:30) reads badly ("From ... to"). Table rows mix a Thai-only name with an English gloss in brackets inconsistently (นิวย่งฮั้ว (New Yong Hua); the others have no English). places-nearby:42 spells the same shop "นิวยั่งฮั้วโภชนา" (ย่ง vs ยั่ง). Reconcile.
- :33-40 "A few notes from the students who recommend these:" quotes with no attribution and translation artefacts: "everything is good, from duck rice to red pork rice to duck noodles; the noodles are soft, the roast duck is fragrant, and every bowl comes with soup." Unattributed second-hand quotes in a page the site publishes as its own voice, in a semicolon-joined run-on. Rewrite as plain statements: "Order the duck noodles or red pork rice. Each bowl comes with soup." Also ":36 a sweet sauce if you cannot handle spicy", ":38 a must for Isaan food fans", ":39 they will adjust the sweetness" are recruitment-pitch phrases.
- :42-46 "Eating well on a budget" bullets are generic ("Refillable water bottles save money; many buildings have drinking water points"). :46 "Splitting shared plates or ordering family-style with friends stretches a budget further than eating alone every meal." Machine-sounding and low-value.
- :44 "Rice-and-one-topping ("khao rad gaeng") stalls" ("khao rad gaeng" is rice with curry; "one topping" is "ข้าวราดแกง" or "ข้าวหน้าเป็ด"). Check the gloss. Also duplicates the canteen line in :13.
- :48-61 the budget table: "Food 4,000 to 7,000", "Transport (boat/MRT/bus) 800 to 1,500", "Phone and data 300 to 600", "Personal and social spending 1,500 to 4,000" are given with no source, no rent line (the biggest cost, and the one where places-nearby covers housing), no tuition, and the placeholder Notice above says "BIRSA will verify details before launch". Total range would be 6,600 to 13,100 baht/month but the page never adds it. Either verify with a student survey (say "from a BIRSA survey of N students, 2026") or remove.
- :61 "Prices shift and habits differ; treat these as a planning starting point." Hedging filler.
- :63-67 "Stretching your budget further" duplicates :42-46 (two sections on saving money). :66 "Convenience stores are useful for basics but usually cost more..." obvious. :67 "Cooking is rare in most student housing near Tha Prachan, but some dorms have shared kitchens worth asking about." Unsourced, vague.
- :69-71 "When money gets tight" sends to Money matters and to Health and wellbeing "if money stress is affecting you". Weak signpost, see money-matters comment.
- Overlap: the two "budget" sections and the "Eating well" section should be one.

### 2.6 places-nearby.mdx (order 9, 72 lines)

**Purpose:** mapped list of ~70 food places and 16 housing options. Strongest page for the "senior student" voice because it is a real curated resource.

**Works:** the map plus numbered list, "as of July 2026" snapshot warning (:12-14), and honest provenance ("Google Maps lists kept and shared by BIRSA seniors", :9) are good.

**Does not work:**

- :9 "Tha Prachan sits in one of Bangkok's most walkable, food-dense old-town neighbourhoods" is brochure copy. Delete or replace with "Most of these places are within 15 minutes' walk of the gate" (if true).
- :12 "use each entry's "Open in Google Maps" link" refers to UI. Fine as a link label, but say "Select" not "use".
- :19 "The places below are grouped by type of food rather than by location, and numbered on two maps: ... Tap a number on either map to jump to that entry." UI narration; "Tap" is device-specific.
- :25 "Recommended places to live passed down from seniors... Visit in person and check current prices and availability directly with each place before booking." Good advice, but there is no price band, distance to campus or scam warning (deposit scams, contract length, utilities charged at rates above the state rate). Add three lines of real advice on renting: deposit (typically 1 to 2 months), electricity price per unit, lease length, and never paying before seeing the room.
- :31-33 "Tips" is a generic heading and the tips are thin. "The buffet and BBQ places around Pinklao suit group dinners after activities" is fine but "suit" is soft.
- :35-62 "More places worth knowing": a bare list of names with no description, no link, and half the entries are tourist destinations (Icon Siam, River City, Museum Siam) that are not "food and housing". "Wider destinations worth a trip" and "A starred shortlist" are fluff. This section could be dropped or moved to a "Things to do" page. Mixed languages (Thai and English forms, "LUA CAFE (BKK)" vs "LUA Café" elsewhere).
- Title says "Food and housing nearby" but the summary says "Tha Prachan and Pinklao" while body :25 says "Pinklao and Siriraj side"; unify.
- Overlap with food-and-budgeting (see 2.5).

### 2.7 health-and-wellbeing.mdx (order 6, 117 lines)

**Purpose:** clinic, insurance and entitlements, counselling, emergency numbers.

**Works:** concrete hours, floors, phone numbers and cover amounts. The insurance and "direct claim" explanation (:36-40) is clear and useful.

**Does not work:**

- :9 "Everyday health care: the TU Virtual Clinic" colon in heading. Also the "Virtual Clinic" name suggests online; the text says it is a physical sick bay. Explain the name or write "TU Virtual Clinic (campus sick bay)".
- :11 "The TU Virtual Clinic is the campus sick bay, in the health area beneath the student activity building, opposite the gym." Repeated word for word in safety-and-emergencies:15. Keep once here.
- :13 "For minor illnesses and injuries, check here before going to a private hospital." "check here" is ambiguous. "Go to the clinic first for minor illness or injury. Staff can refer you to hospital."
- :15-17 "What your student status pays for. As a Thammasat student, you are covered for both routine treatment and accidents." Bland; the table is the content. The heading "student status pays for" is odd.
- :21-30 entitlement table: "General treatment 5,000 baht per visit, up to 20,000 baht per academic year" versus "Basic dental up to 300 baht per visit, 3 times". Then :30 "Thammasat University Hospital is at the Rangsit campus, not Tha Prachan." This critical fact comes after the table and is the reason most Tha Prachan students cannot use the benefit conveniently. Front-load it: "This cover applies at Thammasat University Hospital in Rangsit, which is about 90 minutes from Tha Prachan" (fact-check the time, the getting-around page says 1 h 30 for 1-9E).
- :32 "Separately, if you hold the universal coverage "gold card" (บัตรทอง), you can transfer it ..." An 88-word sentence chain: "Either way, the gold card covers diagnosis, treatment and rehabilitation; food and a standard room as an inpatient; drugs and medical supplies on the national essential list; unlimited extractions, fillings and scaling; plastic-base dentures; and health promotion and disease prevention and control." Institutional-passive list, and it explains the gold card scheme (UCS) rather than what the student does. Rewrite as steps: who holds a gold card, what to do (register at a named hospital, how to transfer), and one line on what it covers. Also "In an accident or emergency you can use any hospital near where it happened, with no limit on which one" duplicates :38-40 in a way that conflicts (contract hospital versus any hospital). Clarify which rule applies to insurance and which to the gold card.
- :36 "Every Thammasat student is covered by student accident insurance." Then :38 "If you are not yet on the policy, you can be added afterwards." Contradiction ("every student is covered" versus "if you are not on the policy"). Fix.
- :38 "you can direct claim" is not English. "you can claim directly from the hospital" or "you do not pay upfront".
- :40 "The contract hospital for Tha Prachan is Chao Phraya Pinklao Hospital". Fact-check the name (probably Chaophraya Abhaibhubejhr? No: the Pinklao hospital is "Bangkok Hospital"? Verify; also that it is a contract hospital, plural options exist).
- :42-46 table: three rows with "Amount" only, no time limit or cover per year. "Death from general illness: funeral costs 15,000 baht" fine but the sensitive rows should be presented with plain labels, not "Death, loss of organ/sight/hearing/speech, or permanent disability from accident, assault or murder". "murder" is startling in a guide; use "an accident or assault".
- :50 "Routes into support at Tha Prachan:" fine but "routes into" is jargon. Bulleted items mix hours, floors, and phone numbers well. :52 "Online sessions run Monday to Friday; onsite sessions run Wednesday to Friday, 08:00 to 16:00." good. But Viva City (:53), TCAPS (:54) have no location or how to book; TCAPS is at Faculty of Liberal Arts (which floor, which hours?). :55 Relationflip: "It does not prescribe medication." Good; "If you register but do not receive your login details by email, or run into any other issue, contact the RF call centre..." fine.
- :57 "If you're supporting a friend who seems to be struggling, encourage them to talk to someone: a counsellor, a trusted staff member, or you." Colon; tricolon; "or you" is a stock line. Rewrite: "If a friend is struggling, tell them these services exist and offer to go with them."
- :59 "not just how to cope with it" is a rhetorical flourish; cut to "See Safety and emergencies for how to report harassment or bullying."
- :61-63 "Keep these saved in your phone. In a genuine emergency, call immediately rather than trying to find a website first." Good and direct. But there is now a dedicated /emergency section (onboarding links to it, home.ts:188) and content/emergency/contacts.ts holds numbers "once" per EDITING.md ("Phone numbers and other contacts live once in contacts.ts"). This page hard-codes 1669, 191, 1323 and 02-026-2345, breaking that single-source rule. Link or import.
- :88 "1323 (check this is current before relying on it)". A hotline listing that tells the reader to verify it defeats the purpose. Check it (1323 is the Department of Mental Health hotline; contacts.ts elsewhere uses it at content/emergency/scenarios/generic.ts:86 without caveat). Remove the caveat once checked.
- :93 AED location: the same sentence is at safety-and-emergencies:15. Keep once.
- :95-97 "When to see a doctor versus wait it out. Minor colds and aches usually resolve with rest. See a doctor promptly if symptoms are severe, do not improve after a few days, or if you're unsure." Generic; adds nothing that the clinic line does not; the tricolon and "if you're unsure" are hedging. Delete or write actual red flags (fever over 3 days, dengue, PM2.5 season).
- :99-103 "Taking care of yourself day to day" generic ("Sleep and regular meals support mood and focus during busy weeks.") and "BIRSA and faculty events are a low-pressure way to stay socially connected" is recruitment-pitch. Delete.
- :105-107 "In a crisis" repeats :61-63 and safety:53-55.

### 2.8 safety-and-emergencies.mdx (order 7, 65 lines)

**Purpose:** campus safety, lost card, complaints, river safety, scams, harassment reporting.

**Works:** lost student card procedure (:19) is specific and useful. `<ReportHarassment />` gives a real action.

**Does not work:**

- :9 "Tha Prachan is generally a safe campus. Take extra care around the river, at night, and around common scams targeting students." Reassurance, unsourced, then a tricolon. Lead with the action.
- :13 "Security staff are present around campus buildings and gates. If something feels wrong (an unfamiliar person loitering, a broken lock, a lighting issue), tell a guard or staff member." No phone number for campus security, no location of the security office. :51 later says "Save campus security and a trusted contact's number" but never gives it. Add the number.
- :15 the whole clinic and AED sentence duplicates health-and-wellbeing (see above). Delete here and link.
- :19 "Report it to TUSU Tha Prachan so they can post a Lost and Found notice. Your student card also doubles as a bank card, so if it does not turn up, freeze the account through the Bangkok Bank app, then go in person to the Bangkok Bank branch by the Tha Prachan gate." Best sentence on the page but runs two tasks together. Number the steps. Also missing: what to do about the TU Greats app card and whether a replacement card costs money.
- :21-27 "Where to take a complaint" repeats rights-and-welfare.mdx:71-77 almost word for word. Also the heading is not about safety.
- :29-35 River safety: "The Chao Phraya is a working river with strong currents and heavy boat traffic." Scene-setting; generic. :33 "Wait for boats to fully dock before stepping on or off." fine. :34 "Keep bags and phones held securely near the open sides of express boats." fine. :35 "Avoid piers and railings late at night when lighting is poor." vague; which piers?
- :39 "Bangkok's tourist-facing areas near campus occasionally attract scams aimed at both visitors and students. Typical patterns include unofficial "closed today, but I can take you somewhere better" approaches near the Grand Palace, and unsolicited "great deal" offers from strangers. Decline and walk on; you do not owe anyone an explanation." Only one specific scam (the "closed today" tuk-tuk line, aimed at tourists, not students). Students actually meet phishing texts claiming to be from the university, fake rental deposits, part-time job "click" scams, and impersonation of Thammasat staff or police; none appear. The page says "targeting students" in :9 and never shows one. Rewrite around what students really face.
- :43 "You do not need complete evidence or a tidy account of what happened before you ask for advice, and you can also just talk to a trusted BIRSA committee member first if that feels easier." Kind, but "just" is a banned intensifier and it makes an unsourced promise on BIRSA's behalf. Check that BIRSA committee members are trained to receive reports and say what confidentiality applies.
- :47-51 "Everyday precautions": three generic bullets ("Share your live location with a friend when travelling alone late at night."). Fine but this is stock advice.
- :53-55 "In an emergency" duplicates health:105-107. There is a real /emergency section; link it.

### 2.9 rights-and-welfare.mdx (order 11, 91 lines)

**Purpose:** voting, dress and titles, free products, facilities, FAQs.

**Works:** the dress and title rights are specific and clearly stated. The FAQ accordions (:45-77) answer real questions: prayer rooms, equipment, parking, complaints.

**Does not work:**

- Title "Your rights and welfare" and summary are grab-bags. The page combines political rights, health products, facilities and admin FAQs. Nothing matches a user task like "I need a prayer room", so the accordion carries the useful content and the headings do not.
- :9 "These are entitlements you already have as a Thammasat student, not favours anyone needs to grant you. That includes the right to feel safe: ..." Slightly rhetorical, self-congratulatory tone (a house-rule miss: "mission-framing"), and "the right to feel safe" is not a defined entitlement. Cut to the safety pointer.
- :13-19 "Your vote" repeats what getting-involved:49-79 says, and vice versa (getting-involved:125 refers here for "what you can vote on"; this page refers there for "what each of these bodies actually does"). A circular link between two pages. Merge into one "Elections and student bodies" page. Also :15 repeats getting-involved:69 word for word (100 members across three campuses; approves and scrutinises budgets).
- :21-27 "Freedom of dress and forms of address": passive institutional voice ("No gendered title is imposed in any part of student business, except where the law requires one or a specific process (such as new student registration) needs one."). Rewrite: "You do not have to use a gendered title. The university uses one only when the law requires it, or at new student registration. No title appears on your student card." Add the source (which TU regulation) and what to do if a staff member refuses.
- :23 "You may wear your own clothes (private clothes)" duplicate gloss. "private clothes" is a Thai-English artefact for "ชุดสุภาพ/ชุดไปรเวท"; say "your own clothes".
- :31-33 Free menstrual products: :31 is the useful fact but then :33 gives Rangsit locations (irrelevant to Tha Prachan students, and detail like "Princess Narathiwat Learning Centre" goes past this audience). Cut Rangsit or mark it as such. Condom dispenser on floor 1: say which building and whether it is free ("available" is ambiguous, and the onboarding hint says "free ... condoms").
- :35-41 Facilities table: "Fitness room ... 14:00 to 20:00" etc. Good, but the fitness room and the gym booking process should be together; fitness room has no rules (who can use, ID, fee). "Tha Prachan Computer Service Center, gymnasium building" is a study facility and belongs in study-support.
- :43-77 Common questions: many belong elsewhere. "Which app do I actually need?" (:45; "actually" is a filler intensifier, and the heading is chatty) belongs in an "Essentials" page. Parking (:65) duplicates getting-around. Sports equipment (:55) duplicates getting-involved:109. Booking a room (:61) duplicates getting-involved:111. Complaints (:71) duplicates safety:21-27. Four of the six accordion items are duplicates.
- :47 "The TU Greats App. It is the one app every Thammasat student needs: your student card lives in it, and you book counselling appointments and other services through it." "lives in it" is casual; "one app every ... needs" is puffery. Say what it does: digital student card, timetable, grades, booking (fact-check) and how to install it.
- :79-81 "More on health and study support" is a signpost with two links and adds nothing to the page's own topic.

### 2.10 study-support.mdx (order 10, 111 lines)

**Purpose:** libraries, borrowing, printing, room booking, research help, TU-GET.

**Works:** library table with hours; the numbered room-booking steps (:59-62); TU-GET table. This is the closest to good GOV.UK style in the set.

**Does not work:**

- :9 "Pridi Banomyong Library: the second home of Tha Prachan students" colon; a "second home" claim is a sales line. Rename "Pridi Banomyong Library".
- :13-18 bullets: "Blankets to borrow; the air conditioning is strong." is a nice real-student detail, keep. "A Performative room used for events." unclear (Performative room?). "Power sockets and phone chargers throughout" and "Board games" duplicate :68 (Library of Things).
- :20-23 the Notice about AI checking is repeated at :80 and in money-matters:55. Say once.
- :25 "For research help, abstract editing and searching international news, the library runs U-Services at [link]." "searching international news" is odd; check what the service does.
- :27 "open daily, 08:30 to 21:30, except on public holidays." good; "open daily" versus faculty libraries' weekday-only hours is a useful contrast.
- :31 "generally smaller and with shorter hours than Pridi Banomyong. Check hours before making a special trip, especially on weekends." fine. The table lists five faculty libraries but the campus has ten faculties; missing ones are not explained. The Direk Jayanama Library at Political Science (:36), which is BIR's own faculty library, is buried in row 2. Bring the BIR-relevant library to the top: "Your faculty library".
- :35 "Sanya Dharmasakti Library ... Floors 1 to 3" fine. Check Saturday hours claims and the Faculty of Economics library name/hours (:37; 08:00 to 16:00 Monday to Saturday reads short).
- :41-47 "What your library card entitles you to" then "As an undergraduate, your student card gets you:" then bullets mixing a loan limit with two services described in a way the reader cannot act on ("Full Text Finder, for locating articles, journals, e-books and theses" gives no link).
- :49-64 room booking: numbered steps good. Step 3 "enter the co-booking code" is unexplained (what is a co-booking code, where do you get it?). :53-57 "Two names for the same account" notice is good honest detail but suggests the source is unreliable; verify and publish one handle. :64 "The film room comes with free Netflix and HBO Go." HBO Go was discontinued in Thailand (replaced by HBO Max / Max in 2024 and later by Max rebrands); very likely stale. Fact-check, or say "streaming services".
- :66-68 "Library of Things" fine; list "heaters, hot water bottles" in Bangkok: check. "(physical card or the TU Greats App)" good.
- :70-75 Free printing: "Every student" then location list; state how to top up and page price. Repeats money-matters:55.
- :77-82 "Research and writing support": "Turnitin checks your own work ... before you submit." Turnitin is a plagiarism checker; whether students can self-check via the library is unstated. :80 "AI Tools Services, mentioned above, does the same for AI-generated content" (and the earlier notice says AI use). :81 "Questions: 02-613-3546" fine. :82 "Here to Help ... and a Freepik and Flaticon image service" reads as a list of vendor names.
- :84-97 TU-GET: table is clear but the fee row (800 / 1,500 baht, late fees) and test centre details will go stale; add "checked date". "credit exemption" needs one line: which BIR courses (English requirement) it applies to. BIR is an international programme taught in English; TU-GET matters for entry and graduation English requirements. The page never says whether BIR students must take it (fact-check with handbook admission-and-fees).
- :99-101 "Related pages" signposts with no information (Money matters for discounts; rights-and-welfare for welfare). Remove.
- The page is the right home for "Computer Service Center" now sitting in rights-and-welfare.

### 2.11 getting-involved.mdx (order 8, 139 lines)

**Purpose:** clubs, student bodies, BIRSA events, volunteering.

**Works:** the club tables with Instagram handles are the most concrete and BIR-relevant content in the set. The BIR clubs line (:16) is real detail. Contacts for TUSU and TUSC are useful.

**Does not work:**

- Two very different jobs on one page (join a club; understand student government). 139 lines, the longest guide, and two-thirds is tables of Thai names.
- No intro paragraph, so the page begins with an h2 "Clubs" and the reader does not learn what is here.
- :12 "Clubs at Thammasat run at three levels: within the BIR programme itself, across Tha Prachan Campus, and university-wide. You can join clubs at any or all of these levels." fine but "any or all" is filler.
- :16 "BIR students run 12 clubs of their own: volunteer camps, a podcast, ... three clubs that simulate an institution (the United Nations, the Thai Parliament, and an investment fund)." Listing without names makes /clubs necessary; fine as a summary but "12" must match the directory (fact-check). The count should be generated from data, not typed.
- :20 "Clubs and independent groups sometimes cover the same activity under a different name and Instagram handle, so use the handle in this table." Confusing instruction; say what to do: "Some clubs and independent groups do the same activity. Follow the account listed here."
- Tables: three columns with a long Thai name first, the "What it does" column starts with a category ("Academic, religion and ethics.", "Sport and health.", "Arts and culture.") that reads like a taxonomy label pasted into prose. Rewrite as "Debate in English" etc. The English Debate row "gives students a space to practise English" is fine. TPC Allstar "for fitness and friendship" is a pitch phrase.
- :43 "University clubs (TU). Thammasat also runs university-wide clubs and societies, covering academics, hobbies and service. As a Thammasat student, you can join those too." Empty. No name, no link, no how. Either link the Student Affairs club list or delete.
- :45-47 "Thammasat also elects students to represent you and to hold student organisations accountable." fine but "also" twice (:43, :47).
- :49-65 TUSU subsection: "structured in four parts: a central union alongside separate unions for each campus, Tha Prachan, Rangsit and Lampang" (that is one central plus three campuses = four; fine). Then "TUSU's role has three parts:" then bullets. "has three parts" is a tricolon signpost. Also the whole "Contact" block lists five channels for TUSU; most students need one (Instagram). :62-64 lists X and TikTok handles; cut to the ones actively used (fact-check activity).
- :67-79 TUSC: same structure. "it speaks for students to the university's administrators on complaints, welfare and campus life issues". Passive institutional: "It takes student complaints to the university's administrators."
- :81-105 committees table: a 20-row list of Thai names for other faculties' student committees; ~19 rows are irrelevant to a BIR student. Keep BIRSA, PBIC, LL.B. and any BIR-adjacent ones (SEAS etc.) or move the full list to /activity/student-bodies (which already exists). :83 "BIRSA itself, the publisher of this site" duplicates the row below (:87).
- :105 "See Student bodies you can run for if you want to stand for election yourself rather than just vote." Good link, but "rather than just vote" is pitch language.
- :107-111 "Doing things on campus": "Borrowing sports equipment" and "Booking a room" duplicate rights-and-welfare:55-63 word for word. Wrong page for both.
- :113-115 BIRSA events: "BIRSA organises events throughout the year: orientation activities, socials, talks, and faculty-wide gatherings. These are open to all BIR students and are usually free or low-cost. Check What's on for sign-up windows." Generic and precisely the mission-framing style EDITING.md forbids. Name the actual annual events (fact-check with /news and /activity/birsa: orientation, BIR Freshy night, sports day, etc.) and give the Instagram.
- :117-119 Volunteering: "Volunteering opportunities run through BIRSA, the faculty, and independent causes, ranging from one-off event support to ongoing commitments. Check BIRSA's channels for calls for volunteers, especially around bigger events." Vague filler with no name, no link. It duplicates the Volunteer Club row (:31).
- :121-125 "Benefits of taking part": "Regular club meetings build friendships that last past a single semester." "Clubs and volunteering build skills, organising, public speaking, teamwork, that do not show up on a transcript." Recruitment pitch plus tricolon. House style says write the fact, not the sales line. Delete the section.
- :127-129 "Getting started. Turn up to a BIRSA event, or message a club directly." One sentence under an h2; belongs at the top. It is the actual call to action and is at the bottom.
- The page's second paragraph in metaDescription (:4) says "from BIR, Tha Prachan and university clubs" fine.

### 2.12 Rewritten short samples (house style)

Below are model rewrites the editor can drop in. All follow GOV.UK plain English, British spelling, no colons or dashes outside times and URLs.

- getting-involved intro (new): "Join a club, follow BIRSA on Instagram (@student_birsa) or go to an event in your first two weeks. Clubs meet at three levels: BIR, Tha Prachan campus and Thammasat as a whole."
- getting-involved BIRSA events (replace :115): "BIRSA runs orientation, sports and social events across the year. Announcements go on [What's on](/news) and on Instagram at [@student_birsa](https://instagram.com/student_birsa)." (Add named events once checked.)
- health entitlement front-load (replace :21 and :30): "Your health cover applies at Thammasat University Hospital in Rangsit, not at Tha Prachan. From Tha Prachan the journey takes about 90 minutes."
- safety opening (replace :9): "Tell a guard if something looks wrong on campus. Call 191 for the police or 1669 for an ambulance."
- rights dress intro (replace :23-27): "You can wear your own clothes to class and exams. You can wear the student uniform for your gender identity, including for photographs and graduation. You do not need to use a gendered title, and none appears on your student card."
- shuttle Notice line (replace :38-39): "Buses can run late at peak times. Leave 15 minutes spare if you have an exam or a train." (fact-check buffer)
- money opening (replace :11-15): "Tuition is 125,000 baht a year for Thai students. Most living costs are food, transport and rent (see the budget below). If you cannot pay on time, ask your faculty about deferring." (fact-check; source: onboarding hint at home.ts:68)
- study-support opening (replace :9): "## Pridi Banomyong Library"

---

## 3. Machine-sounding prose: pattern inventory

Stock phrases and structures to remove across the set (with location):

- "Whatever your source of income, the same habits help:" money-matters:11.
- "A few notes from the students who recommend these:" food:33. "Tips from students who've done it" getting-around:67.
- "Good to know" heading, twice: live-bus-tracker:15, shuttle-bus:33.
- "Getting started" one-line section: getting-involved:127.
- "Benefits of taking part" tricolon: getting-involved:121-125.
- "Taking care of yourself day to day" health:99; "Keeping track without the stress" money:63; "Stretching your budget further" food:63.
- Scene-setting openers: "Tha Prachan is generally a safe campus." safety:9; "Tha Prachan sits in one of Bangkok's most walkable, food-dense old-town neighbourhoods" places:9; "Food near Tha Prachan is among the best value in Bangkok" food:9; "the second home of Tha Prachan students" study:9.
- Tricolons: "Take extra care around the river, at night, and around common scams" safety:9; "a counsellor, a trusted staff member, or you" health:57; "organising, public speaking, teamwork" involved:124; "orientation activities, socials, talks, and faculty-wide gatherings" involved:115.
- Hedging: "Prices shift and habits differ; treat these as a planning starting point." food:61; "Costs vary by lifestyle." food:52; "if you're unsure" health:97; "Most students combine these depending on..." getting-around:27; "generally" safety:9, "usually" food:44,66.
- Redundant summary sentences: "The expressway bus 1-9E is a single direct journey. The MRT and SRT combination is usually the fastest..." getting-around:41; "Related pages" study:99-101; "More on health and study support" rights:79-81; "When money gets tight" food:69-71; "In a crisis" health:105; "In an emergency" safety:53.
- UI narration and visual-only instructions (banned by EDITING.md): "The board below is live. Each stop is a card you can open or close..." live-bus-tracker:11; "Use the toggle at the top" same line; "The board below shows the next scheduled departure" shuttle:17; "Tap a number on either map" places:19; "use each entry's Open in Google Maps link" places:12.
- Unattributed quotation and pitch phrases: food:35-40 ("a must for Isaan food fans", "generously filled", "student-friendly prices" food:14).
- Filler intensifiers: "just talk to" safety:43; "actually" rights:45 ("Which app do I actually need?"), money:1 summary "the discounts your student card actually gets you", live-bus-tracker:11 "how long until the next bus actually arrives".
- Chatty or insider words: "dek TPC" money:30,44; "a quick hop" shuttle:9; "a short boat hop" food:15; "lives in it" rights:46; "stretches a budget" food:46; "ring the campus" live-bus-tracker:9.
- Passive institutional voice: "No gendered title is imposed in any part of student business" rights:27; "Deferrals are decided case by case" money:60; "It is structured in four parts" involved:51; "Recommended places to live passed down from seniors" places:25; "Fares ... are shown per line where the operator publishes them" live-bus-tracker:24.
- Translation artefacts from Thai: "direct claim" health:38; "private clothes" rights:23; "Routes into support" health:50; "Performative room" study:18; "mid-wings" food:28; "co-booking code" study:61; "a must for Isaan food fans" food:38; "dek TPC" money:30.

Colons in headings and prose (house rule: none except clock times and URLs):

- Headings: health:9 "Everyday health care: the TU Virtual Clinic"; study:9 "Pridi Banomyong Library: the second home..."; money:30 and :44 "Benefits for dek TPC: ..."; food:73 etc. are "Source" (fine).
- Body colons before lists are common ("Five routes work:" getting-around:31; "Before committing to anything:" money:19; "TUSU's role has three parts:" involved:53; "As an undergraduate, your student card gets you:" study:43). GOV.UK allows colons to introduce lists, but this project's stricter rule (EDITING.md and NEWS-STYLE.md "no colon outside clock times and URLs") says otherwise. Decide whether list-introducing colons are in scope for these guides or only for news. NEWS-STYLE.md applies to content/news, and EDITING.md's "Voice and language" says "no colon" only implicitly (the colon prohibition is stated in NEWS-STYLE.md and the CLAUDE.md summary). Recommend the rule be applied consistently and lists introduced with a full sentence ending in a full stop.
- onboarding/home.ts:1 and :18 "Starting at BIR: for Thai and home students" (the title has a colon; the Thai title too). Also the hint at :345 "Three documents: the University's regulation ...".
- Semicolons carry sentences that should be two: food:36, food:38, getting-around:31, money:22, study:15, health:52.

Contractions: only positive ones appear in English (you're, it's, you'll, there's, who've, "you're supporting"). That is allowed by EDITING.md. There are no "don't/can't", good. But the pattern "if you're unsure" and "there's no shuttle" reads chatty against the "no warmth performed" instruction. Optional tidy.

"Please" is not used. Sentence case headings mostly comply; "Live public bus tracker" and "Places students recommend" are fine.

---

## 4. Structure, overlap and proposed information architecture

### 4.1 Current duplication map

| Content                                                     | Where it appears                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| Parking rule                                                | getting-around:43-45; rights-and-welfare:65-68                      |
| Sports equipment borrowing                                  | rights-and-welfare:55-58; getting-involved:109                      |
| Room booking (SATU)                                         | rights-and-welfare:61-63; getting-involved:111                      |
| Complaints routes                                           | rights-and-welfare:71-77; safety-and-emergencies:21-27              |
| TU Virtual Clinic + AED                                     | health:11,93; safety:15                                             |
| Emergency numbers 1669/191                                  | health:75-80,107; safety:55; /emergency contacts.ts                 |
| Student discounts (LUA, ช่างคั่ว, Theatre Riverside, KRAFT) | money:39-42; food:41; places:50-51                                  |
| Free printing 100 baht + AI checking                        | money:55; study:20-23,70-80                                         |
| Voting and student bodies (TUSC 100 members)                | rights:15-19; involved:49-79                                        |
| Shuttle                                                     | getting-around:65; shuttle-bus; live-bus-tracker (public, separate) |
| Buffer warning "catching a train or exam"                   | shuttle:38; live-bus-tracker:21                                     |
| Ferry to Wang Lang                                          | getting-around:22; food:15; places:32                               |
| Food and budget saving tips                                 | food:42-46; food:63-67; money:9-15                                  |
| The 8-line TU91 credit Notice                               | 9 pages                                                             |

### 4.2 Mismatched headings

- rights-and-welfare mixes voting, dress, products, facilities and admin FAQs; heading names do not map to tasks.
- money-matters headings "Benefits for dek TPC" and "Keeping track without the stress" are opaque.
- safety-and-emergencies includes lost card and complaints (admin, not safety).
- getting-around begins with the faculties list.
- "Good to know" x2.
- The page order (`order:`) mixes the transport trio (1, 2, 3) then money (5) and food (4), health (6), safety (7), involved (8), places (9), study (10), rights (11). Places-nearby (9) is separated from food (4). Study support (10) is far from anything academic.

### 4.3 Proposed structure (11 pages to 7)

Aim: one page per student task; move everything with a phone number to one emergency source.

1. **Getting to and around campus** (`getting-there`; merges getting-around, shuttle-bus, live-bus-tracker). Sections: Free shuttle (components, timetable), Public buses now (`LiveBusTracker`), Boat, MRT and BTS, Getting to Rangsit, Parking, Taxis and ride-hailing tips. Remove faculties list and landmarks listing (move to "The campus in brief" in the handbook). One "times are estimates" warning. Keep the shuttle and live tracker components adjacent under "Next bus", since the questions are the same. If a single page is too long, keep two: `getting-there` (routes, Rangsit, parking) and `bus-and-shuttle-times` (both live tools, one warning).
2. **Money** (`money`; merges money-matters and food-and-budgeting's budget and saving parts). Sections: What a month costs at Tha Prachan (verified, with rent), Tuition, deferral and refunds, Student loans and scholarships (new), Student discounts (one table incl. cafés and museums), Part-time work (three lines).
3. **Food and where to live** (`food-and-housing`; merges food-and-budgeting's eating sections and places-nearby). Sections: Cheap meals on and near campus, Student favourites, Map of food, Where to live (with rental advice), Places to visit (or drop). Prevents "student discounts" being in three places.
4. **Health and insurance** (`health`; health-and-wellbeing minus the emergency numbers and generic advice). Sections: Campus clinic, What your cover pays (front-load Rangsit fact), Accident insurance and claims, Counselling. Link to /emergency for numbers.
5. **Safety, reporting and complaints** (`safety-and-reporting`; safety-and-emergencies + complaints from rights-and-welfare). Sections: Report harassment or bullying, Lost or stolen student card, Scams students see, River and night safety, Who to contact with a complaint (once). Emergency numbers link to /emergency.
6. **Your rights and campus facilities** (`rights-and-facilities`; rights-and-welfare minus duplicates). Sections: Dress and titles, Free menstrual products and condoms, Prayer rooms, Gym, fitness room, student lounge (booking once), TU Greats app. Voting moves to page 7.
7. **Study, libraries and English tests** (`study-support`, keep slug; add printing and Computer Service Center). Add faculty library at top; add TU-GET requirements.
8. **Clubs and student bodies** (`clubs-and-student-bodies`; getting-involved trimmed). Sections: Join a club, BIRSA events, Volunteering, Vote and stand for election (TUSU, TUSC, and only BIR-relevant committees; link to /activity/student-bodies for the full list). Sports equipment and room booking move to page 6.

That is eight pages, or seven if page 6 folds into page 4 and 5. The onboarding steps (home.ts) already group "Money and food", "Stay safe and well", "Know your rights and support", "Get involved", which supports this consolidation.

Slug migration: the repo has `content/quick.ts`, `content/smart-answers/topics/*.ts`, `app/[lang]/services/page.tsx`, `app/[lang]/page.tsx`, components/places/PlacesMap.tsx and `app/[lang]/openhouse/OpenHouseExperience.tsx` that reference `/student-life/home/...` paths. Add redirects and update links before renaming. Thai files must be renamed in lockstep (tests enforce slug parity). If renames are too costly, keep slugs and only merge content into the strongest existing slug (`getting-around`, `money-matters`, `places-nearby`, `health-and-wellbeing`, `safety-and-emergencies`).

### 4.4 Source credit

Replace nine copies of the 8-line Notice with one line at the foot of each page ("Adapted from the TU91 Handbook ...") or a single credit on the index page. The current Notice is longer than several sections of real content, and its claim "Details such as prices, opening hours and contacts were correct when that handbook was published and can change, so check before you rely on them" is a blanket disclaimer that should be per-page with a "last checked" date instead. Frontmatter has `updated:` but the pages do not show when the facts were last verified against the source, only when the file was edited.

---

## 5. content/onboarding/home.ts (English strings)

General: the track lede is fine and factual (:22). Line refs below.

- :17-19 Title "Starting at BIR: for Thai and home students". Colon breaks house rule. Suggest "Starting at BIR for Thai and home students" or "Your first weeks at BIR (Thai and home students)".
- :22 lede "Everything to do, roughly in order, before and during your first weeks at BIR. Tick tasks off as you complete them. Nothing is sent anywhere, it all stays on this device." Comma splice in the last sentence. "Everything" overclaims (the track has 24 tasks; the handbook is far larger). Rewrite: "Tasks for before and during your first weeks at BIR, in a rough order. Tick each one off when it is done. Your ticks stay on this device and are not sent anywhere."
- :28 "Before term starts" fine. :30 blurb "Get the lay of the land before you set foot on campus." Idiom and cliche. Replace: "Read the basics before term starts."
- :38 "Curriculum, fees, academic rules and how BIR works." Vague tail; drop "how BIR works".
- :50 "Look for the latest announcements and events." Tells the reader nothing; say "Orientation and term dates are posted in news."
- :59 "A history of Thammasat and the Faculty, and how to contact the BIR programme office." fine.
- :68 "Application requirements and estimated annual tuition: 125,000 baht for Thai students, 144,000 baht for non-Thai students." colon; also for students already admitted, "application requirements" is the wrong task on a "before term" list. Fact-check the numbers and whether they are per year and per programme; and check they match money-matters (which gives no tuition figure at all).
- :78-81 "Get set up around campus" / "Work out how you'll get to and around Tha Prachan." "you'll" is allowed; "Work out" fine. Title is an odd mix with "Learn your way around Tha Prachan" (:96) as the label for the getting-around page (page title is "Getting around Tha Prachan"; keep labels equal to page titles).
- :86-90 label "Learn the shuttle bus routes"; hint "Thammasat's two free shuttle lines from Tha Prachan." Missing task: use the live bus tracker (no onboarding step points to /student-life/home/live-bus-tracker, so the tool is undiscoverable from onboarding). Add a step.
- :101 hint "Campus, the old city, and nearby landmarks." Tricolon; and the page barely covers "the old city". Replace with "Buses, boats, the MRT, and how to reach Rangsit."
- :108-113 "Money and food" / "Get a feel for everyday costs before they surprise you." Casual and slightly cutesy ("before they surprise you"). Replace: "Find out what everyday costs are."
- :117-123 "Read about money matters" hint "Allowances, part-time work basics and student discounts." The page has a tuition and refunds section that the hint omits; that is the highest stakes section. Update.
- :129 "Where to eat around Tha Prachan and Wang Lang, and rough monthly costs." fine; but page also has Pinklao and the budget placeholder, see above.
- :138 "Around 70 food places and 16 recommended places to live near Tha Prachan and Pinklao." "Around 70" versus the actual data count; generate from data or check. Thai says "เกือบ 70" (almost 70), English says "around 70". Reconcile.
- :146-151 "Stay safe and well" / "Know where to turn for health support and how to stay safe day to day." Fine but "Know where to turn" is stock. "Find out where to get health support and how to report a problem."
- :161 "TU health services, counselling and mental health support." fine.
- :173 "Campus security, river safety, common scams and how to report harassment." fine, but the page does not have a campus security number. OK.
- :180-189 "Know where to find emergency information" is a knowledge task, not an action. Rewrite: "Save the emergency numbers in your phone". Hint "Alert levels, key numbers and what to do first." fine.
- :193-199 "Know your rights and support": "Entitlements and services that come with being a Thammasat student." Fine. :208 hint "Voting rights, dress and title rights, free menstrual products and condoms, and the TU Greats App." Good but long.
- :220 "Libraries, printing quota, TU-GET, and plagiarism checking." "and" with an Oxford comma is inconsistent with GOV.UK (no Oxford comma). Check the rest of the file: :208 "Voting rights, dress and title rights, free menstrual products and condoms, and the TU Greats App." also uses Oxford comma. House style (GOV.UK) drops the serial comma except to avoid ambiguity. Standardise.
- :231-233 "Get involved" / "Ways to meet people and get involved in your first weeks." "get involved" repeated in title and blurb; say "Ways to meet people in your first weeks."
- :240 "Clubs, elected student bodies, BIRSA events, and volunteering." Oxford comma again.
- :245-249 "Browse clubs" has no hint (inconsistent with siblings). It also duplicates :237 "Read about getting involved" (the same page links to /clubs). Merge or explain.
- :253-259 "Read about student bodies you can run for", hint "The ladder of elected student bodies you vote in and can stand for, from BIRSA to Thammasat-wide." Metaphor "ladder" is inside the page's own vocabulary (the /activity/student-bodies page), fine; but "Thammasat-wide" is awkward.
- :263-271 "Read about joining BIRSA's committee" hint "What BIRSA does, and how committee positions open each year." fine.
- :275-281 "Follow BIRSA's quick links" hint "Socials, official links and other useful shortcuts in one place." "useful" filler.
- :284-290 "Contact BIRSA" hint "Message the committee directly with a question or concern." fine.
- :294-301 "Plan your studies" blurb "Choosing courses and understanding the rules that govern your degree." "govern" is heavy; "Choose courses and check the rules for your degree."
- :305 "Read student course reviews" no hint.
- :311-313 "Course registration, exam absences, leave, and probation rules." Oxford comma; "leave" is ambiguous (leave of absence). Say "leave of absence".
- :324 "The full course structure and the 127-credit total for BIR's 2023 revised curriculum." Fact-check 127; also check consistency with the handbook page.
- :336 "Grading, the credit and GPA requirements for graduating, and honours criteria." fine.
- :345 "Three documents: the University's regulation on student activities, the Faculty's notice on student activities, and the University's regulation on student discipline (B.E. 2568)." Colon; heavy. "Three documents. The University's regulation ..." or list them. Mixed Buddhist-era year "B.E. 2568" without the Gregorian year (2025) confuses non-Thai readers; write "B.E. 2568 (2025)".
- Header comment :1-12: says the track is "step by step: home (Thai) student track", with a docstring listing a verification date "at the time of writing", claims every href is a real route. Not user-facing. It does say "Starting at BIR: step by step" but the title is different. Update the comment or leave.
- Missing steps (see gaps): no orientation step naming BIRSA orientation, no student ID card / TU Greats app activation, no registration steps, no bank account activation (money-matters says the student card is a Bangkok Bank card), no "meet your faculty/programme office", no "join the year group LINE chat", no rent/housing step even though places-nearby covers it (it is under "Money and food" as an optional browse).
- The `connector: "and"` key on steps (:78) is unexplained; not user-facing.

---

## 6. Gaps: what a new BIR student at Tha Prachan would actually need

Missing or badly covered. Priority order.

1. **The first two weeks, in order.** Nothing says where to go on day one: BIR programme office location, orientation and freshy events (names, dates), registration, class schedule, how to find your building and room, who your programme officer and academic adviser are, your year group LINE/Discord. Onboarding tries to cover this but links only to general pages.
2. **TU Greats app setup.** The app is called essential (rights:47) and used for counselling bookings, cards and the library, but there is no how-to (install, activate student ID, what to do if login fails).
3. **Student ID card and Bangkok Bank account activation.** Refunds arrive there (money:59), lost card handling (safety:19), yet no step says how to activate the account, who to ask, or what the card can do.
4. **Money that matters most.** Tuition figures (only in onboarding hint), payment deadlines, instalments, refund calendar, scholarships (TU and Faculty), student loan fund (กยศ.), emergency hardship funds, and how the international programme fees differ (the 144,000 non-Thai fee shows an international cohort exists here).
5. **Housing that people can use.** Real rental advice: deposit (usually 1 to 2 months), electricity and water rates, lease length, contract red flags, how to view a room, typical price by area (Pinklao, Siriraj, Bangkok Noi, Phra Nakhon), distance to campus, commute time by boat or bus. Current page is a list.
6. **Health basics that apply to Tha Prachan.** Nearest hospital and walk-in clinic (Siriraj is a river hop; is it covered?), pharmacy, vaccines, dengue and PM2.5 season advice, what to do if you are sick during exams (link to the handbook's exam absence rule), mental health crisis line.
7. **Transport costs and passes.** Fares for the boat, monthly caps, Rabbit card versus cash, MRT student discount (does one exist?), Grab/Bolt fares from key areas, boat operating hours and August closures (news item referenced in NEWS-STYLE.md example: "The river to campus closes on three August afternoons"), flooding season.
8. **Food and dietary needs.** Halal, vegetarian and vegan places near campus; allergy phrases; Muslim prayer facilities are covered (rights:51) but halal food is not.
9. **Phone, SIM and internet.** Only the international track covers this. Home students need TU wifi login (eduroam / TU-WIFI), university email setup, VPN, Microsoft 365 or Google Workspace, and LMS access (MyCourseVille, TU e-learning, etc.).
10. **Academic life links.** Course registration windows, add/drop dates (money:61 mentions add/drop, but the calendar is not linked), how to get transcripts and letters (certificate of student status), exam rules, where to print and copy, where to get course reading packs; only partly in the handbook. Link the handbook chapters from the guides.
11. **English and academic support specific to BIR.** How to use writing help, whether BIR students need TU-GET, resources for speaking in English classes, exchange and study abroad, internships (for a Politics and IR degree: MFA, embassies, think tanks, NGOs). Exchange and career pages are missing entirely.
12. **Social life and culture.** Nightlife, safe going-out advice, drinking and vaping rules, festival dates, Loy Krathong and Songkran (river events), campus traditions (Thammasat "TU Greats", Thammasat-Chulalongkorn football tradition, the Tha Prachan "dek TPC" identity, which money-matters uses without explaining), religious and cultural practices, dress expectations for temples.
13. **Accessibility.** Step-free routes, lifts, accessible toilets, support for students with disabilities, and a named contact. Only a passing mention on the bus tracker.
14. **Working and internships rules.** Part-time work rights for Thai students (allowed) versus international students (work permit); the page treats "general" advice only.
15. **Equality and reporting.** Information for LGBTQ+ students beyond dress rules, discrimination reporting, whistleblowing on staff conduct.
16. **Contacts hub.** One table: BIR programme office, Faculty Student Affairs, security, TUSU, BIRSA, counselling, hospital. Currently scattered across seven pages.
17. **Weekend and holiday hours.** Shuttle has none; libraries listed; clinic closes at 16:30 weekdays. What to do out of hours (only 1669/191 and TU Well Being 24-hour line appear). Say where the nearest 24-hour pharmacy or ER is.
18. **Accessibility of the site itself.** Not the guides' concern but the raw `<table>` in health-and-wellbeing is fine; most tables have header rows only, none have captions, which screen reader users may miss. Add captions or keep short lead-in sentences.

---

## 7. Stale, vague or possibly wrong: claims to fact-check

Nothing here was checked against the web. Each item is a claim in the files to verify with the source or the office concerned.

Dates and time-limited:

- shuttle-bus.mdx:29 schedule change "until Wednesday 30 September ... From Thursday 1 October", "one bus on each line", "Both lines are running as normal". Confirm; remove after 1 October.
- shuttle-bus.mdx:42 Viabus as the live tracker.
- places-nearby.mdx:13 ratings "as of July 2026", `updated: 2026-07-29`. Ratings age fast. Count "around 70" and "16" versus the data.
- All pages cite the 2025 TU91 handbook (TU91 = 91st intake?). Prices, opening hours, discounts, contacts date from 2025. Academic year 2026 now.
- food-and-budgeting.mdx:50 placeholder Notice and the whole budget table (:53-59).
- study-support.mdx:64 "free Netflix and HBO Go" (HBO Go discontinued; likely wrong).
- study-support.mdx:55-57 the two LINE handles.
- study-support.mdx:95-97 TU-GET fees (800/1,500 baht, late 1,000/1,800), result times (5 to 7 days; 15 days), test centre names (SC1, Rangsit; Language Institute Tha Prachan).
- study-support.mdx:35-39 library hours and names, especially Economics (08:00 to 16:00 Monday to Saturday) and Journalism (unnamed library).
- health-and-wellbeing.mdx:88 1323 caveat. Check the hotline is current; also confirm it is the correct national mental health line.
- health-and-wellbeing.mdx:52-55 TU Well Being hours, "02-026-2345, press 2", Viva City, TCAPS, Relationflip URL and call-centre number 099-002-6888.
- rights-and-welfare.mdx:39-41 opening hours of fitness room, lounge, Computer Service Center.

Facts that look wrong or ambiguous:

- getting-around.mdx:15 bus numbers list (1, 3, 15, 19, 25, 30, 32, 53, 64, 80, 91, 123, 124, 189, 203, 208, ปอ.32, ปอ.524). Cross-check with the live tracker data (which lines serve the three stops); several may have been renumbered.
- getting-around.mdx:21-25 station names and change points (Tha Phrannok pier; "MRT Blue Line ... Sanam Chai" (correct station), "BTS Silom Line get off at Taksin then the Chao Phraya Express Boat to Tha Chang pier" (Taksin is the BTS station named Saphan Taksin; check the name); "Koh Phaya Thai stop" (unclear); bus 32 or 53 from Sanam Chai; "BTS Sukhumvit to Victory Monument" fine).
- getting-around.mdx:35-39 Rangsit fares and times (27 baht for 1-9E; MRT 45 baht; SRT from 20 baht; van 45 to 47 baht; bus 59, 503, 510 numbers). MRT and SRT: "MRT Sanam Chai to Bang Sue (Blue Line), 5 minute walk to Krung Thep Aphiwat, then the Red Line" fine but check the Sanam Chai to Bang Sue leg is correct; the earlier row says "MRT Sanam Chai to Chatuchak Park ... exit 4". Plausible.
- getting-around.mdx:45 "Undergraduates may bring a car onto campus, but only from 16.30 onwards." Note the format "16.30" (full stop) versus "16:30" everywhere else. House style for times: EDITING.md allows colon in clock times; the set mixes 16.30 (getting-around:45, rights:66) with 09:00. Standardise to 16:30.
- getting-around.mdx:69-70 Rabbit card usable at "the pier". Very likely not. Express boat (Chao Phraya Express) sells paper tickets; Rabbit works on BTS and some buses.
- getting-around.mdx:9 "10 faculties and colleges" and the list contains 10 names: Law, Commerce and Accountancy, Political Science, Economics, Social Administration, Liberal Arts, Journalism and Mass Communication, College of Interdisciplinary Studies, College of Innovation, Pridi Banomyong International College = 10. But getting-involved:88-103 lists LL.B., BASIC, BBA, BE etc. that belong to programmes at Tha Prachan, and the students' unions "PPE", "SEAS", "RES" etc. Check the current faculty list (Faculty of Journalism vs Social Administration: "Social Administration" vs "Social Work").
- money-matters.mdx:59 "your student card doubles as a Bangkok Bank card, which is why refunds land there automatically." Verify for all cohorts and for international students.
- money-matters.mdx:36-42 discount partners: check each is still active (Thammasat Book Centre 10% at 100 baht; Amazon @ Law; ครัวม่วน; LUA Café; ช่างคั่ว; Theatre Riverside; KRAFT CAFE "50 baht off").
- money-matters.mdx:48-51 free museum entry for students: National Museum Bangkok, National Gallery, Nitasrattanakosin, Museum Pier 50%. Thai national museums often give free entry to Thai students, not always to foreign students. State who qualifies.
- money-matters.mdx:55 "100 baht per semester". study-support repeats "Every student gets ... 100 baht per semester" at two locations (Pridi U2 and Puey Library floor 2).
- health-and-wellbeing.mdx:25-28 entitlement figures (5,000 per visit; 20,000 per year; dental 300 baht x 3), "Drugs on the national essential medicines list, room, and standard meals" and Puey/Thammasat Hospital coverage. Confirm current academic year.
- health-and-wellbeing.mdx:40 "Chao Phraya Pinklao Hospital" as the accident-insurance contract hospital for Tha Prachan. The Bangkok hospital near Pinklao is "โรงพยาบาลเจ้าพระยา..." check name. Also check that the accident insurance sums (15,000 / 150,000 / 15,000) are current.
- health-and-wellbeing.mdx:11 "Bring your student card and your ID card (or passport, for international students)". Confirm.
- health-and-wellbeing.mdx:93 AED "in front of Sri Burapha Auditorium".
- safety-and-emergencies.mdx:19 Bangkok Bank branch "by the Tha Prachan gate". Confirm and give the gate.
- rights-and-welfare.mdx:15 "TUSC ... 100 members" (also involved:69) and "elected at campus level" (:15) vs "100 members drawn from students across all three campuses" (involved:69). The two statements conflict (campus-level election versus one council across three campuses). Fix.
- rights-and-welfare.mdx:13 "you vote in three separate elections": student council, TUSU (campus and central: that's two ballots), faculty committee = at least four ballots. Recount.
- rights-and-welfare.mdx:31-33 free menstrual products and condom dispenser (floor 1) locations.
- rights-and-welfare.mdx:51-52 prayer rooms (three).
- getting-involved.mdx:16 "12 clubs" and category counts ("four sports teams including esports"). Check against content/clubs.
- getting-involved.mdx:65 email addresses for TUSU and TUSC (tusc uses a gmail address, tusu a tu.ac.th address); verify.
- getting-involved.mdx:81-105 list of 18 committees: check names, some expired; instagram handles.
- home.ts:68 tuition 125,000 and 144,000 baht. Cross-check with handbook admission-and-fees. Also :324 "127-credit".
- Inconsistent romanisation: "Tha Prachan" vs "Tha Phra Chan" (used for the pier and stop names: getting-around:15,22; live-bus-tracker:9). The "Tha Phra Chan" pier is the official pier name; fine but explain once that both spellings refer to the same place. "Phrachan Road" (live-bus-tracker:9), "Phra Chan Klang" (money:38), New Yong Hua vs นิวยั่งฮั้ว (food:25, places:42).
- Time format: 16.30 versus 16:30 (see above).
- Serial commas: mixed (see home.ts notes).

Plain-English structure checks that fail these files against docs/EDITING.md "The one test":

- Any sentence that describes, justifies or softens rather than delivers a fact: about 25 sentences across the set (see section 3). Removing them would shorten the set by an estimated 10 to 15 per cent.
- No tests or lint checked, per instructions (read-only). Note that CLAUDE.md requires `npx prettier --write content/news` after Thai edits; these guides are in `content/student-life`, not news, but `npm run format` still applies.

---

## 8. Suggested next steps for the editor

1. Remove or verify the placeholder budget (food:50). Blocker for publication.
2. Delete the date-bound schedule text at shuttle-bus:29 today.
3. Decide the audience (Thai home students only, or all BIR). If all, retitle and add international pointers; if home only, add a link to the international track and drop passport references.
4. Merge to the eight-page structure in 4.3 (or at least remove the duplicates in 4.1).
5. Apply the rewrite pass in section 3 (UI narration, tricolons, pitch phrases, translation artefacts, colons).
6. Replace 9 credit Notices with one line each.
7. Fact-check the list in section 7, starting with health cover, TU-GET fees, bus numbers and Rabbit card claims.
8. Fill top gaps in section 6, starting with first-two-weeks, TU Greats setup, tuition and hardship support, and rental advice.
9. Bring onboarding home.ts in line (section 5), including a step for the live bus tracker.
10. Keep Thai in lockstep: slugs and structure must match for tests; Thai should not be a translation of the rewritten English.
