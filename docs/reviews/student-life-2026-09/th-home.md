# Thai review: student-life/th/home (11 files) and content/onboarding/home.ts (Thai strings)

Reviewer note: read-only pass, no repo files edited. Line numbers are the real line numbers of each file
(checked with a script). Commentary is British English, examples are Thai. All rewrites avoid colons,
dashes and ครับ/ค่ะ, in line with docs/NEWS-STYLE.md and docs/EDITING.md.

## 0. Read this first: the register brief conflicts with the house rules

The brief asks for a friendly senior student (รุ่นพี่) voice. docs/EDITING.md (the Thai bullet, around line 319)
says the opposite: formal, polite, concise, neutral; use "คุณ" or drop the subject; "เลี่ยงน้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง"
and avoid stiff official Thai. docs/NEWS-STYLE.md 3.2 repeats this ("เป็นทางการระดับประกาศนักศึกษา สุภาพ กระชับ เป็นกลาง").

So the target I have used is the house one, which is also what a good student handbook sounds like in practice:

- polite but plain written Thai, no particles (no นะ, จ้ะ, ครับ, ค่ะ), no น้อง, no คุณ in running text
- subject dropped wherever the reader is obvious ("ขอผ้าอนามัยฟรีได้ที่...", not "คุณสามารถขอ...ได้")
- everyday student loanwords where students really use them (แอป, ไลน์, เน็ต, เซฟ, โน้ตบุ๊ก, ทรานสคริปต์, รถตู้)
- no ราชการ scaffolding (ณ, ดังกล่าว, ข้างต้น, ภายหลัง, มีความ..., ในการ...)

The actual files do neither consistently. They swing between chatty headings ("ถ้าเงินตึง", "ไปมหาลัยยังไงดี", "เด็ก ทพจ.",
"เมื่อไหร่ควรไปหาหมอ") and stiff or calqued bodies ("มาพร้อมสิทธิ", "ไม่มีการปรากฏ", "ที่กล่าวไปข้างต้น", "ณ ตอนที่").
The mixed register is the single biggest naturalness problem, more than any individual word. If the owner really wants the
รุ่นพี่ voice, that is a decision to make in EDITING.md first, then apply everywhere; I recommend keeping the house rule.

Pronoun census: "คุณ" appears 23 times in the 11 pages (rights-and-welfare 6, getting-involved 4, health 4, safety 3, study-support 2,
food/getting-around/money/places 1 each) and 3 times in home.ts. "น้อง" appears once, legitimately, in "ต้อนรับน้องใหม่".
Almost every "คุณ" is a calque of English "you/your" and can be deleted (see NEWS-STYLE 3.4, "ของคุณ" ละได้). Recommendation: drop
the subject; keep "คุณ" only where dropping it makes the sentence ambiguous. Titles with "ของคุณ" ("สิทธิและสวัสดิการของคุณ",
"สิทธิการเลือกตั้งของคุณ", "รู้สิทธิและบริการสนับสนุนของคุณ") should lose it.

## 1. Cross-cutting findings (fix once, everywhere)

### 1.1 "มหาลัย" (26 occurrences) mixed with "มหาวิทยาลัย" (38) and "มธ." (40)

"มหาลัย" is a spoken clipping, not the standard spelling, and here it sits beside formal "มหาวิทยาลัย" in the same paragraph.
Files: getting-around 8 (lines 11, 15, 31, 45, 47, 52, 55, 59), safety 5, money-matters 4, shuttle-bus 3, health 2, rights 2, food 1, live-bus-tracker 1.
Fix: "มหาวิทยาลัย" in prose; "มธ." only before a campus name ("มธ. ท่าพระจันทร์"). Where the sentence just means "here", use "ในมหาวิทยาลัย" or drop it.

### 1.2 Same thing, several names

| Concept                                | Variants found                                                                                   | Recommend                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Campus                                 | วิทยาเขต (getting-around:9), ศูนย์ (getting-involved, health), แคมปัส (6x)                       | "ศูนย์ท่าพระจันทร์" (TU's own term); "แคมปัส" only in casual asides                    |
| Tha Prachan                            | ท่าพระจันทร์, TPC, ทพจ. (money-matters:3, 30, 44)                                                | ท่าพระจันทร์ (TPC only inside official names); never bare ทพจ.                         |
| Shuttle                                | รถเวียน (page titles, 4x), รถรับส่ง (home.ts:86, 89; shuttle-bus:23)                             | รถเวียนธรรมศาสตร์ everywhere; "รถรับส่งหอใน" only for the dorm service                 |
| Bus                                    | รถเมล์ (18x), รถโดยสารประจำทาง (getting-around:13 heading)                                       | รถเมล์                                                                                 |
| Activity building                      | ตึกกิจกรรม (4x), อาคารกิจกรรมนักศึกษา (5x)                                                       | อาคารกิจกรรมนักศึกษา, then อาคารกิจกรรม                                                |
| Gym                                    | โรงยิม (5x), ยิมเนเซียม (3x)                                                                     | โรงยิม in prose; official name only in tables                                          |
| Show a card                            | โชว์บัตร (6x, money-matters:48-51), แสดงบัตร (6x)                                                | แสดงบัตรนักศึกษา (or โชว์ everywhere, but pick one)                                    |
| Fees                                   | ค่าเทอม (food, money-matters:60), ค่าเล่าเรียน (home.ts:39, 69), ค่าธรรมเนียม (money-matters:61) | ค่าเล่าเรียน for the official charge (NEWS-STYLE 3.5), ค่าเทอม only in chat-like lines |
| Faculty student committee abbreviation | กนศ. (rights:17), กกน. (safety:26)                                                               | check the official abbreviation and use one                                            |
| Right                                  | สิทธิ (most), สิทธิ์ (money-matters:59, safety:43, getting-involved)                             | pick one; สิทธิ is fine in every case                                                  |
| TU Greats                              | "TU Greats App" (health:54-55, study-support:70, rights:50), "แอป TU Greats" (home.ts:60)        | แอป TU Greats (drop the redundant "App")                                               |
| Line                                   | "Line" (6x), "ไลน์" (1x)                                                                         | LINE for the brand or ไลน์ in running text, not both                                   |
| Part-time                              | พาร์ทไทม์ (money-matters:17, home.ts:121), พาร์ท (study-support:93)                              | Royal Institute form is พาร์ต, "พาร์ทไทม์" is widespread; just be consistent           |
| อมธ. spacing                           | "ของอมธ." (getting-involved:54, 73, 74, 76, 114) vs "อมธ. ท่าพระจันทร์"                          | always "อมธ." followed by a space                                                      |
| New Yong Hua                           | นิวย่งฮั้ว (food:25, 35) vs นิวยั่งฮั้วโภชนา (places-nearby:42)                                  | check the shop sign, use one                                                           |
| LUA Café                               | "LUA Café" (food), "LUA café" (money-matters:39), "LUA CAFE (BKK)" (places-nearby:44)            | one casing                                                                             |
| Registrar                              | สำนักงานทะเบียนนักศึกษา (rights:77-78, safety:25)                                                | NEWS-STYLE 3.5 uses "สำนักทะเบียน"; confirm the official name                          |

### 1.3 Colons and dashes (house rule broken in several places)

Colons outside times and URLs:

- content/onboarding/home.ts:19 title "เริ่มต้นที่ BIR: สำหรับนักศึกษาไทย" (English twin also has one).
- health-and-wellbeing.mdx:11 heading "ดูแลสุขภาพในชีวิตประจำวัน: TU Virtual Clinic" (English twin has one too).
- getting-involved.mdx:62-66 and 80-82 label lists ("Facebook: ...", "Instagram: ...", "อีเมล: ...").
- food-and-budgeting.mdx:35-39 "ชื่อร้าน: คำแนะนำ" list.
- getting-involved.mdx:32 "ชุมนุมอาสาท่าพระจันทร์ : เพื่อประชาชน" (spaced colon, official name; leave if verbatim).
- "**TU91 Handbook: The Magic of TPC**" in the source Notice, repeated verbatim in 9 files (food:78, getting-around:76, getting-involved:139,
  health:114, money-matters:74, places-nearby:67, rights:91, safety:60, study-support:108). It is a proper title, but it is still a colon.
  Either state an explicit exception in EDITING.md or write "TU91 Handbook (The Magic of TPC)".
  Dash-like hyphens (brief says "dashes of any kind"; the test only bans em/en dashes):
- getting-around:22 "ศิริราช-วังหลัง"; :36 and :38 spaced hyphens inside quoted van signs ("หมอชิต - มธ.รังสิต", "อนุสาวรีย์ชัยฯ - มธ.รังสิต", "สนามหลวง - รังสิต");
  getting-involved:102 "อังกฤษ - อเมริกันศึกษา". Rewrites: "ศิริราช (ท่าวังหลัง)", "รถตู้สายหมอชิต มธ.รังสิต", "รถเมล์สาย 59 หรือ 503 (สนามหลวงไปรังสิต)".
  Route names such as "1-9E", "X-ray", "TU-GET" and phone numbers are fine.
  Clock format: shuttle-bus.mdx:29 uses "07:45 ถึง 21:30" while every other page (and NEWS-STYLE 3.6) uses "09.00 ถึง 16.30 น." Use "07.45 ถึง 21.30 น.".

### 1.4 Repeated source Notice (9 files) is itself stiff

"เนื้อหาส่วนใหญ่ในหน้านี้เรียบเรียงจาก ... ข้อมูลอย่างราคา เวลาเปิดทำการ และช่องทางติดต่อ เป็นข้อมูล ณ ตอนที่วารสารเผยแพร่ อาจมีการเปลี่ยนแปลง ควรตรวจสอบอีกครั้งก่อนใช้งานจริง"
Problems: "เนื้อหาส่วนใหญ่ในหน้านี้" is page self-reference (EDITING.md "meta-commentary" family); "ณ ตอนที่" mixes ราชการ ณ with a colloquial "ตอนที่";
"ข้อมูลอย่างราคา" is clumsy; "มีการเปลี่ยนแปลง" is the มีการ+nominal pattern. Suggested single text (ideally a shared component, since it is copied nine times):
"ข้อมูลส่วนใหญ่มาจาก TU91 Handbook (The Magic of TPC) วารสารปฐมนิเทศนักศึกษาปีการศึกษา 2568 ขององค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ (อมธ. ท่าพระจันทร์) ราคา เวลาเปิดทำการ และช่องทางติดต่อเป็นข้อมูลตอนที่วารสารพิมพ์ อาจเปลี่ยนไปแล้ว ควรตรวจอีกครั้งก่อนไปจริง".

### 1.5 Recurring translationese patterns (counts across the 11 pages)

- "สามารถ...ได้" 12x (rights-and-welfare alone 7). Use the bare verb: "แต่งชุดไปรเวทได้", not "สามารถแต่งชุดไปรเวทได้".
- "ครอบคลุม" 10x, mostly a calque of "covers/covering" (getting-around:59 "ครอบคลุมเกือบทุกจุดหมาย", live-bus-tracker:9, health cells "ครอบคลุม" as a table value). Say "ไปได้เกือบทุกที่", "ใช้สิทธิได้".
- "ซึ่ง" chains 7x (health:34, 59; getting-involved:17, 86; money-matters:61; live-bus-tracker:18; shuttle-bus:41).
- "สำหรับ X ดูที่ Y" 7x, a calque of "For X, see Y" (study-support:103, rights:86, food:73...). Say "X ดูที่ Y" or make the link the sentence.
- "นี่คือ" (shuttle-bus:29, food:54): NEWS-STYLE 3.4 lists this exact calque ("Here is/are").
- "ในการ" 5x, "ความ" 37x, "การ" 281x: heavy nominalisation. Worst: "การเข้าชมรมเป็นช่องทางหนึ่งในการรู้จัก..." (getting-involved:17), "การชวนเขาคุยกับใครสักคน ... หรือการรับฟังโดยไม่ตัดสิน ช่วยได้" (health:59).
- "มี...ให้" and "มีความ..." patterns: "มีความเร็ว ค่าใช้จ่าย และจำนวนต่อรถที่ต่างกัน" (getting-around:31).
- Self-narrating scaffolding the house rules say to cut: "ห้องสมุดของธรรมศาสตร์มีมากกว่าแค่ที่ยืมหนังสือ ได้แก่..." (study-support:9), "หน้านี้ครอบคลุมเรื่องสิทธิ..." (rights:86),
  the whole UI description in live-bus-tracker:11, "การมีส่วนร่วมไม่ได้แปลว่าต้องเข้าชมรมเท่านั้น..." (getting-involved:112), "คำถามที่นักศึกษาใหม่ถามบ่อยที่สุด" (rights:47).
- Run-on paragraphs where several full sentences are joined only by single spaces, so the reader cannot tell a clause break from a sentence break:
  getting-around:9, :63; health:34, :40; safety:43; shuttle-bus:29; getting-involved:17. Thai has no full stop, so the fix is shorter sentences, a list or a table, not punctuation.
- Untranslated Latin words with Latin commas in the middle of Thai lists (study-support:70 "Notebook, iPad, กล้อง, ปลั๊กพ่วงสายไฟ, ฮีตเตอร์"; food:31; health:29). In Thai lists use spaces, and Thai-script forms for common words.

### 1.6 Prettier and line breaks

I searched all 11 files for a break inside a word or date, for lines starting with a dependent vowel or tone mark, and for lines ending in a leading vowel (เ แ โ ไ ใ). Prettier only wraps at existing spaces, and no mid-word break was found.
One ugly wrap: rights-and-welfare.mdx:50-51 leaves a lone "ๆ" at the start of line 51 ("บริการต่าง\n ๆ"). It renders correctly as "ต่าง ๆ" but the source is fragile; rewriting the sentence (see 6.x below) removes the problem.
Notice text wrapped across lines becomes a space in rendered HTML, which is right here because every wrap sits on a real word gap.
Spacing errors that are not Prettier's: getting-around:15 "ได้แก่สาย" (needs space), :36 "มธ.รังสิต" vs :37 "มธ. รังสิต", :45 stray space before "ตั้งแต่เวลา", study-support:29 "พนมยงค์เปิด" (add space as at :13), getting-involved:54 "อมธ. มี", rights spacing "ที่ท่าพระจันทร์ สามารถ" (space between subject and verb, :33, :35).

### 1.7 Loanword balance

Too English (students would say the Thai or transliterated form): "Onsite/Online" (health:54), "Direct Claim" (health:40, gloss as "เคลมประกันโดยตรง"), "Lost and Found" (safety:17 → ประกาศตามหา), "User และ Password" (health:57 → ชื่อผู้ใช้และรหัสผ่าน),
"Notebook" (study-support:70 → โน้ตบุ๊ก), "icon" (study-support:84 → ไอคอน), "X-ray ฟัน" (health:28 → เอกซเรย์ฟัน), "ห้อง Performative room" (study-support:20, "ห้อง" plus "room"), "Study room/Study Room" casing (study-support:15, 51), an all-English heading "Library of Things" (study-support:68), "บอร์ด" (shuttle-bus:17) vs "กระดาน" (live-bus-tracker:11).
Fine and natural, keep: แอป, เน็ต, เช็ก, เซฟ, เบรก, แอปเรียกรถ, บัตรแรบบิท, รถตู้, MRT, BTS, SRT, Google Maps.
Stiff Thai coinages where students say something else: "ตัวจับเวลาถอยหลัง" (shuttle-bus:3, 37; say นับถอยหลัง), "เครื่องกระตุกหัวใจไฟฟ้าอัตโนมัติ (AED)" (fine once with gloss, then "เครื่อง AED"), "สิ่งอำนวยความสะดวก" (rights:37, 39; say ห้อง/บริการ/สิ่งที่มีให้ใช้),
"ใบผลการเรียน" (getting-involved:129; say ทรานสคริปต์ or ใบแสดงผลการเรียน), "รถปรับอากาศ" (fine formally, "รถแอร์" is what students say).
No วินมอเตอร์ไซค์ mention exists in the pages; getting-around would benefit from one line since it is how students cover the last 500 m from the pier.

### 1.8 Time-bound copy that will go stale today

shuttle-bus.mdx:29 (and its English twin) says the timetable changes "ตั้งแต่วันพฤหัสบดีที่ 1 ตุลาคม" and "จนถึงวันพุธที่ 30 กันยายน", with no year. Today is 30 September 2026, so the sentence is wrong from tomorrow.
Restructure as a small table (ช่วงวันที่, สายสนามไชย, สายปิ่นเกล้า, จำนวนรถ) with the year, or remove the old period after 1 October.

### 1.9 Duplicated content that will drift

TU Virtual Clinic details are in health:13 and safety:15; parking is in getting-around:45 and rights:69-74; sports loans and room booking are in getting-involved:114-116 and rights:59-66; print quota and AI tools are in money-matters:55 and study-support:22-25, 74-82; the complaints route is in rights:76-82 and safety:21-27.
Each duplicate has slightly different wording (safety:25-27 is the better version of the complaints list). Keep one full text and link from the other page.

### 1.10 Content contradictions noticed in passing (not language, but a native editor would catch them)

- TUSC level: rights-and-welfare.mdx:15 "สภานักศึกษาในระดับศูนย์ (TUSC)" vs getting-involved.mdx:70 (university-wide, 100 members from all three centres).
- money-matters.mdx:3 summary promises "ค่าใช้จ่ายรายเดือน", which is on the food page, not this one.
- money-matters.mdx:69 sends someone with money trouble to the health page.
- health-and-wellbeing.mdx:90 hotline "1323 (กรุณาเช็กว่ายังใช้งานได้จริงก่อนพึ่งพา)": a crisis number with an "is it real?" hedge undermines trust and mixes กรุณา with เช็ก. Verify it, name the operator, and delete the hedge.
- study-support.mdx:66 "HBO Go" may no longer exist in Thailand; verify.
- money-matters.mdx:50 "นิทรรศน์รัตนโกสินทร์": the official name is normally written "นิทรรศรัตนโกสินทร์"; check.
- getting-involved.mdx:86, 90 "สาขาการเมืองการระหว่างประเทศ": check against the official programme name.

## 2. Verdicts

Scale: 5 = reads as written by a Thai editor; 3 = understandable, visibly translated in places; 1 = should be rewritten.

| File                       | Score | One line                                                                                                                                     |
| -------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| food-and-budgeting.mdx     | 3     | Good ideas and some native phrases, but "ข้าวราดแกงร้านเดียว", "สั่งแบบครอบครัว", run-on notes, a duplicated caveat paragraph and colon list |
| getting-around.mdx         | 3     | Tables are strong; intro is one 90 word sentence plus padding; "เที่ยวเดียว", "หลายต่อ", chatty headings over formal text                    |
| getting-involved.mdx       | 3     | Tables fine; prose is the most nominalised in the set, wrong words ("สถาบัน", "อีกสี่ชมรม"), meta padding, colon lists                       |
| health-and-wellbeing.mdx   | 2.5   | Longest calque density: "มาพร้อมสิทธิ", "ภาวะหมดพลัง", "ลำบากใจ", one 95 word insurance sentence, colon heading                              |
| live-bus-tracker.mdx       | 3     | Useful facts, but UI narration paragraph and a garbled Notice ("แอปนำทาง ซึ่งเป็นบริการ...")                                                 |
| money-matters.mdx          | 3.5   | Mostly natural; "เงินพิเศษ", "เงินที่ได้รับ", duplicate Notice, ทพจ. slang                                                                   |
| places-nearby.mdx          | 3.5   | Short and mostly fine; "กินได้หลายคน" is a real error, "ณ" doubled, inconsistent shop names                                                  |
| rights-and-welfare.mdx     | 2.5   | Six "คุณ", seven "สามารถ", official-announcement Thai mixed with chatty FAQ headings, meta paragraph                                         |
| safety-and-emergencies.mdx | 3.5   | Best prose in the set (ไม่ชอบมาพากล, อย่าคิดว่าคนอื่นคงแจ้งไปแล้ว, แชร์ตำแหน่ง); weak on harassment paragraph and lost card order            |
| shuttle-bus.mdx            | 3     | Clear and short; "นี่คือ", "ตกรอบ", stale dates, colon clock format, "ตัวจับเวลาถอยหลัง"                                                     |
| study-support.mdx          | 3     | Fragments without verbs, "เปิดสั้นกว่า", English words, misleading heading "หน้าที่เกี่ยวข้อง"                                               |
| onboarding/home.ts (Thai)  | 3.5   | Short strings, mostly fine; colon in title, "ของคุณ", "หาทางเดินทางไปและรอบ", "บันไดองค์กร"                                                  |

Where the Thai is better than the English: study-support.mdx drops the English "the second home of Tha Prachan students" heading fluff; safety-and-emergencies.mdx opening and the "อย่าคิดว่าคนอื่นคงแจ้งไปแล้ว" line are more direct;
rights-and-welfare.mdx and safety keep the useful bullet form for complaints in one place; the shuttle "ตารางปล่อยรถ" wording is idiomatic.
Where the Thai is longer than the English without adding a fact: getting-around.mdx:9 (last sentence and faculty list), food-and-budgeting.mdx:63 (repeats :54), money-matters.mdx:26-27 (repeats :22), money-matters.mdx:63-65 (repeats :13), getting-involved.mdx:112 and :126-130 (rationale padding), health-and-wellbeing.mdx:9, :99, :103, :109.

## 3. File by file findings

Format: `file:line` "quoted Thai" then what is wrong then a rewrite.

### 3.1 food-and-budgeting.mdx

- :2 "เรื่องกินและเรื่องเงิน" collides with the separate page "เรื่องเงิน" (money-matters). Rewrite: "อาหารและงบรายเดือน".
- :9 "ของกินแถวท่าพระจันทร์อยู่ในกลุ่มที่คุ้มค่าที่สุดของกรุงเทพฯ ราคาย่อมเยากว่าร้านบนถนนสายท่องเที่ยว" calque of "among the best value"; "ย่อมเยา" is stiff. Rewrite: "ของกินแถวท่าพระจันทร์คุ้มมากเมื่อเทียบกับที่อื่นในกรุงเทพฯ และถูกกว่าร้านตามถนนท่องเที่ยว".
- :13 "**โรงอาหารในคณะและมหาลัย** ถูกที่สุด มีร้านข้าวแกง ก๋วยเตี๋ยว และเครื่องดื่มหมุนเวียน เหมาะกินมื้อเที่ยวไว ๆ" bold label runs into the description with no break; "หมุนเวียน" is a calque of "rotating" (stalls do not "rotate" in Thai); "ข้าวแกง" here vs "ข้าวราดแกง" at :44; "มื้อเที่ยว". Rewrite: "โรงอาหารในคณะและมหาวิทยาลัยถูกที่สุด มีร้านข้าวราดแกง ก๋วยเตี๋ยว และร้านเครื่องดื่ม เหมาะกับมื้อกลางวันที่ต้องรีบกินระหว่างคาบเรียน".
- :14 "ราคาเป็นมิตรกับกระเป๋านักศึกษา" advertising cliché, calque of "friendly prices"; "ยัน" is spoken. Rewrite: "ร้านเล็ก ๆ ของคนแถวนั้น มีตั้งแต่ก๋วยเตี๋ยวเรือไปจนถึงของปิ้งย่าง ราคาไม่แพงสำหรับนักศึกษา".
- :15 "นั่งเรือข้ามฟากไปไม่ไกล เป็นตลาดที่นักศึกษานิยมเพราะ..." Rewrite: "นั่งเรือข้ามฟากไปได้ นักศึกษามักไปเพราะมีของกินหลากหลาย ราคาดี โดยเฉพาะตอนเย็น".
- :17 "อยากรู้ชื่อร้านเจาะจง คะแนนรีวิว และแผนที่คร่าว ๆ" "ชื่อร้านเจาะจง" is not natural; "แผนที่คร่าว ๆ" wrong (a map is not rough). Rewrite: "ดูรายชื่อร้าน คะแนนรีวิว และแผนที่ได้ที่ [..]".
- :21 "รายชื่อนี้รวบรวมจากคำแนะนำและความเห็นของนักศึกษา พร้อมเมนูแนะนำและช่วงราคา" passive, "แนะนำ" three times. Rewrite: "นักศึกษาแนะนำร้านเหล่านี้ พร้อมเมนูเด็ดและช่วงราคา".
- :29 "เริ่มต้น 25 ถึง 30 บาท" "เริ่มต้น" plus a range is contradictory. Rewrite: "25 ถึง 30 บาท".
- :31 "Caramel Macchiato, Earl grey peach pinkvine" Latin comma; English twin has "pink vine", check the menu spelling.
- :33 "คำแนะนำจากนักศึกษาที่แชร์ไว้" fragment, unclear. Rewrite: "นักศึกษาที่เคยไปบอกไว้ว่า" and turn :35-39 into "**ร้าน** คำอธิบาย" with no colon.
- :36 "มีน้ำจิ้มให้เลือกหลายแบบ บอกระดับความเผ็ดได้ตามใจ มีน้ำจิ้มหวานสำหรับคนไม่ทานเผ็ด" "น้ำจิ้ม" twice; "ทาน" while the rest of the page says "กิน". Rewrite: "มีน้ำจิ้มหลายแบบ สั่งระดับความเผ็ดได้ และมีน้ำจิ้มหวานสำหรับคนกินเผ็ดไม่ได้".
- :38 "ห้ามพลาดสำหรับสายอีสาน" ad copy, chatty against the neutral rest. Rewrite: "แนะนำสำหรับคนชอบอาหารอีสาน".
- :40 "LUA Café และช่างคั่ว ลด 10% เมื่อโชว์บัตรนักศึกษาทั้งสองร้าน" "ทั้งสองร้าน" dangles. Rewrite: "LUA Café และช่างคั่วลด 10% เมื่อแสดงบัตรนักศึกษา".
- :44 "ข้าวราดแกงร้านเดียวมักเป็นมื้อร้อนที่ถูกที่สุด" mistranslation of "rice with one topping": "ร้านเดียว" reads "from a single shop"; "มื้อร้อน" is a calque of "hot meal". Rewrite: "ข้าวราดแกงหน้าเดียวมักเป็นมื้อหลักที่ถูกที่สุด" (or "ข้าวราดแกงจานเดียว").
- :45 "พกขวดน้ำเติมได้ หลายอาคารมีจุดบริการน้ำดื่มฟรี" ambiguous. Rewrite: "พกขวดน้ำไปเติมได้ เพราะหลายอาคารมีตู้น้ำดื่มฟรี".
- :46 "สั่งแบบครอบครัว" calque of "family-style". Rewrite: "หารกับข้าวกับเพื่อนหลายจานประหยัดกว่ากินคนเดียวทุกมื้อ".
- :54 "แต่นี่คือจุดเริ่มต้นคร่าว ๆ ให้ลองวางแผน" "นี่คือ" calque; and :63 says the same again. Rewrite :54: "ค่าใช้จ่ายจริงต่างกันมากตามการใช้ชีวิตของแต่ละคน ตารางนี้ให้ช่วงราคาคร่าว ๆ สำหรับวางแผน" and delete :63.
- :68 "ร้านสะดวกซื้อสะดวกดีแต่ปกติแพงกว่าตลาดถ้าเทียบเป็นมื้ออาหารเต็มมื้อ" "สะดวกซื้อสะดวกดี" tautology. Rewrite: "ร้านสะดวกซื้อสะดวกก็จริง แต่ถ้าซื้อกินเป็นมื้อจะแพงกว่าตลาด".
- :69 Rewrite: "หอพักแถวท่าพระจันทร์ส่วนใหญ่ไม่ให้ทำอาหารเอง แต่บางแห่งมีครัวส่วนกลาง ลองถามก่อนเช่า".
- :71-73 heading "ถ้าเงินตึง" vs money-matters:67 "ถ้าลำบากเรื่องเงิน" (pick one, e.g. "ถ้าเงินไม่พอ"); the paragraph joins two thoughts. Rewrite: "เรื่องเงินช่วยเหลือและช่องทางขอคำแนะนำ ดู [เรื่องเงิน](..) ถ้าความเครียดเรื่องเงินเริ่มกระทบใจ ดู [สุขภาพและความเป็นอยู่ที่ดี](..)".

### 3.2 getting-around.mdx

- :3 "ควรรู้จักไว้" unnatural. Rewrite: "วิธีเดินทางไปท่าพระจันทร์และรังสิต การเดินทางในเกาะรัตนโกสินทร์ และสถานที่สำคัญใกล้ท่าพระจันทร์".
- :9 one 90 word paragraph: "...ตั้งอยู่ตรงข้ามสนามหลวงและติดกับแม่น้ำเจ้าพระยา ในเขตเกาะรัตนโกสินทร์ มธ. ท่าพระจันทร์มีด้วยกัน 10 คณะและวิทยาลัย ได้แก่ ... รู้เส้นทางเหล่านี้ไว้ช่วยให้การเดินทางไปเรียนแต่ละวันเร็วขึ้นและประหยัดขึ้น".
  Problems: three sentences fused; "วิทยาเขต" (elsewhere ศูนย์); the faculty list is irrelevant to a travel page; the final sentence points to "เส้นทางเหล่านี้" which have not been introduced yet (Thai-only padding, not in English) and is nominalised.
  Rewrite: "ท่าพระจันทร์เป็นศูนย์แรกของธรรมศาสตร์ อยู่ตรงข้ามสนามหลวง ติดแม่น้ำเจ้าพระยา ในเกาะรัตนโกสินทร์ มี 10 คณะและวิทยาลัย" and move or drop the list.
- :11 heading "ไปมหาลัยยังไงดี" chatty, while :13 "รถโดยสารประจำทาง" is formal and the body says รถเมล์. Rewrite headings: "การเดินทางไปท่าพระจันทร์" and "รถเมล์".
- :15 "ได้แก่สาย" missing space; "รถปรับอากาศ" (รถแอร์ is what students say).
- :22 "นั่งรถมาลงโรงพยาบาลศิริราช-วังหลัง ขึ้นเรือที่ท่าวังหลัง ต่อเรือข้ามฟากมาลงที่ท่าพระจันทร์" hyphen; "ขึ้นเรือ ... ต่อเรือข้ามฟาก" says the same thing twice. Rewrite: "นั่งรถมาลงที่โรงพยาบาลศิริราช (ท่าวังหลัง) แล้วนั่งเรือข้ามฟากมาลงท่าพระจันทร์".
- :23 "ต่อรถเมล์สาย 32 หรือ 53 หรือเดินผ่านเกาะรัตนโกสินทร์" double "หรือ". Rewrite: "ต่อรถเมล์สาย 32 หรือ 53 หรือจะเดินผ่านเกาะรัตนโกสินทร์ก็ได้".
- :27 "นักศึกษาส่วนใหญ่ใช้ผสมกันไปตามที่พักและช่วงเวลา" "ใช้ผสมกัน" calque of "combine". Rewrite: "นักศึกษาส่วนใหญ่เลือกใช้หลายแบบสลับกัน ตามที่พักและช่วงเวลา".
- :31 "แต่บางครั้งก็อาจต้องไปรังสิต เช่น กิจกรรมร่วมคณะ ติดต่อหน่วยงานกลาง หรือวิชาที่เปิดสอนที่รังสิต มีเส้นทางให้เลือก 5 แบบ แต่ละแบบมีความเร็ว ค่าใช้จ่าย และจำนวนต่อรถที่ต่างกัน" double hedge "บางครั้งก็อาจ"; the example list mixes nouns and verb phrases; "มีความเร็ว...ที่ต่างกัน" and "จำนวนต่อรถ" (unclear). Rewrite: "นักศึกษา BIR เรียนที่ท่าพระจันทร์ แต่บางครั้งต้องไปรังสิต เช่น ไปกิจกรรมร่วมระหว่างคณะ ติดต่อหน่วยงานกลาง หรือเรียนวิชาที่เปิดที่รังสิต มี 5 เส้นทางให้เลือก ต่างกันที่เวลา ค่าโดยสาร และจำนวนครั้งที่ต้องต่อรถ".
- :33 table header "ช่วงการเดินทาง" ("Legs") is a literal calque; "ขั้นตอนการเดินทาง" reads better.
- :35 "รถเมล์ตรงจากป้ายสนามหลวงตรงข้าม มธ. ท่าพระจันทร์ ไปรังสิต" "ตรง...ตรงข้าม". Rewrite: "รถเมล์สายตรงจากป้ายสนามหลวง ฝั่งตรงข้าม มธ. ท่าพระจันทร์ ไปรังสิต".
- :35-39 "(... ขึ้นอยู่กับการจราจร)" repeated six times in the duration column while :41 says it again; delete from the cells.
- :41 "ถ้าอยากเดินทางเที่ยวเดียวไม่ต้องต่อรถหลายทอด ... ต่อรถหลายต่อ ทุกเส้นทางระยะเวลาขึ้นอยู่กับการจราจร" "เที่ยวเดียว" means one way (not "one leg"); "หลายทอด" and "หลายต่อ" repeat; "ต่อรถหลายต่อ" is nearly meaningless. Rewrite: "ถ้าไม่อยากเปลี่ยนรถ ให้ขึ้นรถเมล์ 1-9E ทางด่วน ส่วน MRT ต่อ SRT มักเร็วที่สุดแต่ต้องเปลี่ยนหลายครั้ง เวลาเดินทางขึ้นกับการจราจร ช่วงเร่งด่วนอาจนานกว่านี้".
- :45 "นักศึกษาปริญญาตรีสามารถนำรถเข้ามาจอดในมหาลัยได้ ตั้งแต่เวลา 16.30 น. เป็นต้นไปเท่านั้น ในช่วงกลางวันที่จอดรถภายในมหาลัยเป็นสวัสดิการสำหรับ..." "สามารถ...ได้", "เท่านั้น" twice, stray space, "ที่จอดรถ...เป็นสวัสดิการ" stiff. The FAQ version (rights:69-72) is better. Rewrite: "นักศึกษาปริญญาตรีนำรถเข้ามหาวิทยาลัยได้ตั้งแต่ 16.30 น. เป็นต้นไป ช่วงกลางวันที่จอดรถสงวนไว้ให้นักศึกษาปริญญาโทและบุคลากร ถ้าต้องจอดตอนกลางวัน ที่ใกล้ที่สุดคือสนามหลวง (ฟรี) และวัดมหาธาตุฯ (มีค่าจอด)".
- :49 heading "แลนด์มาร์กรอบตัว" "รอบตัว" is a calque of "around you". Rewrite: "สถานที่สำคัญใกล้ท่าพระจันทร์".
- :53 "จุดสังเกตที่มีประโยชน์เวลาบอกตำแหน่งตัวเอง" calque of "useful orientation points". Rewrite: "ใช้เป็นจุดอ้างอิงเวลาบอกตำแหน่ง".
- :55 "การบอกชื่อสถานที่เหล่านี้ช่วยระบุตำแหน่งได้ชัดเจนกว่า เพราะบอกแค่ 'ธรรมศาสตร์ท่าพระจันทร์' คนขับบางคนอาจไม่แน่ใจว่าเป็นแคมปัสไหน" nominal subject, reason clause in front. Rewrite: "ถ้าบอกคนขับแค่ 'ธรรมศาสตร์ท่าพระจันทร์' บางคนอาจไม่แน่ใจว่าหมายถึงแคมปัสไหน ควรบอกสถานที่ใกล้เคียงด้วย".
- :63 "แอปเรียกรถและรถไฟฟ้า BTS/MRT ครอบคลุมเกือบทุกจุดหมาย ต่อผ่านสถานีสนามไชยหรือนั่งแท็กซี่สั้น ๆ ก็ได้ ช่วงเย็นวันธรรมดารถติดหนัก เรือมักยังเป็นทางเลือกที่เชื่อถือได้ที่สุดตอนกลับบ้าน" three sentences fused; "ครอบคลุมเกือบทุกจุดหมาย" calque; "ต่อผ่านสถานีสนามไชย" unclear. Rewrite: "ถ้าจะไปที่อื่นในเมือง ใช้แอปเรียกรถ หรือ BTS/MRT ได้เกือบทุกที่ (ต่อที่สถานีสนามไชย หรือนั่งแท็กซี่ระยะสั้น) ช่วงเย็นวันธรรมดารถติดหนัก ตอนกลับบ้านเรือมักแน่นอนที่สุด".
- :65 "สำหรับ...ดู..." chain; the final "ส่วนร้านอาหารและที่พัก..." glued on. Split into two sentences.
- :69 "ไว้ล่วงหน้า จะได้ไม่ต้องรีบหาเงินสด..." natural enough; keep. :71 "ค่อนข้างแม่นยำ" fine.

### 3.3 getting-involved.mdx

- :9 "BIR มีทางเลือกให้นักศึกษาเข้าร่วมกิจกรรมนอกห้องเรียนหลายรูปแบบ" calque of "has options"; the subject is really students. Rewrite: "นักศึกษา BIR ทำกิจกรรมนอกห้องเรียนได้หลายแบบ ทั้งชมรม องค์กรนักศึกษา กิจกรรมของ BIRSA และงานอาสาสมัคร".
- :17 the whole BIR clubs paragraph. "กลุ่มนี้คือชมรมที่..." calque; "ครอบคลุมหลากหลายความสนใจ" filler; "กีฬาอีกสี่ชมรมรวมถึงอีสปอร์ต" (English "four sports teams including esports") reads as "another four clubs", which breaks the count of 12; "จำลองการทำงานของสถาบัน" uses สถาบัน (an institute) where the English means international bodies (องค์กร); "กองทุนการลงทุน"; "การเข้าชมรมเป็นช่องทางหนึ่งในการรู้จักนักศึกษานอกกลุ่มเรียนของตัวเอง" is triple nominalisation; four sentences share single spaces.
  Rewrite: "BIR มีชมรมที่นักศึกษาตั้งและดูแลเองรวม 12 ชมรม ได้แก่ ค่ายอาสา พอดแคสต์ นักเขียน ดนตรี กีฬา 4 ชมรม (รวมอีสปอร์ต) การ์ดเกม และชมรมจำลององค์กรระหว่างประเทศ 3 ชมรม (สหประชาชาติ รัฐสภาไทย และกองทุนลงทุน) เข้าชมรมแล้วจะได้รู้จักเพื่อนนอกกลุ่มเรียน ดูรายชื่อทั้งหมดที่ [ชมรม](/clubs)".
- :19-21 heading "ชมรมคณะและศูนย์ท่าพระจันทร์" but the table lists ชุมนุม and กลุ่มอิสระ; the difference between ชมรม, ชุมนุม and กลุ่มอิสระ is never explained in a line. :21 "จึงยึดตามที่ระบุไว้ในตารางนี้" is vague and passive. Rewrite: "บางกลุ่มทำกิจกรรมคล้ายกันแต่ใช้ชื่อและบัญชี Instagram ต่างกัน ให้ใช้บัญชีตามตารางนี้".
- :23, :34 bold pseudo headings "**ชุมนุม**", "**กลุ่มอิสระ**" should be real headings (h4) for navigation.
- :27 "ประเภทวิชาการ (ศาสนาและจริยธรรม) พูดถึงปัญหาที่เกิดขึ้นในโลกปัจจุบัน แลกเปลี่ยนความคิดเห็นผ่านทักษะภาษาอังกฤษ" category label runs into description; "ผ่านทักษะภาษาอังกฤษ" calque. Rewrite: "ประเภทวิชาการ (ศาสนาและจริยธรรม) ถกปัญหาของโลกปัจจุบันเป็นภาษาอังกฤษ".
- :40 "วิเคราะห์เชิงวิจารณ์" redundant. Rewrite: "ดู วิจารณ์ และทำหนัง".
- :44 "ครอบคลุมตั้งแต่วิชาการ งานอดิเรก ไปจนถึงงานจิตอาสา" calque; "จิตอาสา" vs "อาสาสมัคร" (:124) vs "อาสา" (home.ts). Pick one.
- :48 "เข้ามามีส่วนร่วม" (calque of "get involved"); "และตรวจสอบการทำงานขององค์กรนักศึกษาด้วยกัน" fine.
- :52 "มีที่มาจากการเลือกตั้งทางตรงของนักศึกษา แบ่งโครงสร้างเป็น 4 ส่วน" nominal. Rewrite: "นักศึกษาเลือก อมธ. โดยตรง เพื่อเป็นตัวแทนของนักศึกษา อมธ. แบ่งเป็น 4 ส่วน ได้แก่ ...".
- :54 "หน้าที่ของอมธ. มี 3 บทบาท" calque ("has 3 roles"), missing space. Rewrite: "อมธ. ทำหน้าที่ 3 อย่าง".
- :56 "จัดกิจกรรม โครงการ พัฒนากิจกรรมนักศึกษา..." three verbs with no connector. Rewrite: "จัดกิจกรรมและโครงการ และพัฒนากิจกรรมนักศึกษาภายในมหาวิทยาลัย".
- :60-66, :78-82 colon label lists ("Facebook: ..."), "Tiktok" should be "TikTok". Convert to a two column table (ช่องทาง, ชื่อบัญชี) like the club tables.
- :70 "สภานักศึกษา เป็นผู้แทนของนักศึกษาทั้งหมดในมหาวิทยาลัยที่มาจากการเลือกตั้งโดยตรงจากนักศึกษาเช่นกัน ประกอบด้วยสมาชิก 100 คนจากนักศึกษาทั้ง 3 ศูนย์... มีหน้าที่หลักดังนี้" stray space after subject; long clause chain; "ดังนี้". Rewrite: "สภานักศึกษา (TUSC) มีสมาชิก 100 คน มาจากการเลือกตั้งของนักศึกษาทั้ง 3 ศูนย์ (ท่าพระจันทร์ รังสิต และลำปาง) และเป็นตัวแทนนักศึกษาทั้งมหาวิทยาลัย หน้าที่หลักมีดังนี้".
- :72 "เป็นกระบอกเสียงแทนนักศึกษากับทางมหาวิทยาลัยในเรื่องร้องเรียน สิทธิสวัสดิการ และความเป็นอยู่ในมหาวิทยาลัย" "มหาวิทยาลัย" twice. Rewrite: "เป็นกระบอกเสียงของนักศึกษาต่อมหาวิทยาลัย ทั้งเรื่องร้องเรียน สิทธิสวัสดิการ และความเป็นอยู่".
- :73 "อนุมัติงบประมาณในการจัดกิจกรรมของอมธ. ชุมนุม และกลุ่มกิจกรรมที่ขอจากกองทุน..." hard to parse; "ในการ". Rewrite: "อนุมัติงบจัดกิจกรรมที่ อมธ. ชุมนุม และกลุ่มกิจกรรมขอมาจากกองทุนอุดหนุนกิจกรรมนักศึกษา".
- :76 explanatory sentence repeats :73-74 (padding); delete or keep as the only statement.
- :86 "สำหรับ BIR คณะกรรมการนี้คือ สโมสรนักศึกษา... (BIR) ซึ่งก็คือ BIRSA เอง" stray space after "คือ"; "ซึ่งก็คือ BIRSA เอง" redundant, and it is pasted into the table cell at :90. Rewrite: "สำหรับ BIR คือสโมสรนักศึกษาสาขาการเมืองการระหว่างประเทศ (BIRSA)" and in the table just "BIRSA".
- :102 "อังกฤษ - อเมริกันศึกษา" spaced hyphen.
- :108 link text "ตำแหน่งตัวแทนนักศึกษาที่คุณลงสมัครได้" has คุณ. Rewrite: "ตำแหน่งที่นักศึกษาลงสมัครได้".
- :112 "การมีส่วนร่วมไม่ได้แปลว่าต้องเข้าชมรมเท่านั้น การรู้จักใช้สิ่งที่ TPC มีให้อยู่แล้วก็สำคัญเช่นกัน" rationale padding (EDITING.md family 3). Delete.
- :114 "ห้องอมธ." missing space; "ตึกกิจกรรม" vs อาคาร.
- :116 "หากต้องการใช้ห้อง... สามารถจองได้ที่" Rewrite: "จองห้องที่อาคารกิจกรรมนักศึกษาหรือโรงยิมได้ที่ [ระบบจองห้อง SATU](..) พร้อมแนบแบบฟอร์มขอความอนุเคราะห์".
- :120 "จะได้ไม่พลาดช่วงลงทะเบียน" "ลงทะเบียน" in TU means course enrolment, so an event sign-up should be "สมัคร" or "ลงชื่อ". Rewrite: "ติดตาม [ข่าวและกิจกรรม](/news) ไว้จะได้ไม่พลาดช่วงเปิดรับสมัคร". "ค่าใช้จ่ายน้อย" reads "low expenses", use "เสียค่าใช้จ่ายน้อย".
- :124 "งานอาสาสมัครมีทั้งผ่าน BIRSA คณะ หรือกิจกรรมอิสระ" ungrammatical ("มีทั้งผ่าน"); "งานช่วยอีเวนต์ครั้งเดียว". Rewrite: "งานอาสาสมัครมีทั้งที่จัดผ่าน BIRSA ผ่านคณะ และผ่านกลุ่มอิสระ ตั้งแต่ช่วยงานครั้งเดียวไปจนถึงงานต่อเนื่อง ควรติดตามช่องทางของ BIRSA โดยเฉพาะก่อนงานใหญ่ ซึ่งมักเปิดรับอาสาสมัคร".
- :126-130 "ประโยชน์ของการเข้าร่วมกิจกรรม" is a sales pitch. If kept: :128 "เครือข่ายทางสังคม" (calque of "social network"; say เพื่อนและคนรู้จัก) "...สร้างความสัมพันธ์ระยะยาวได้มากกว่าการเข้าร่วมงานใหญ่เป็นครั้งคราว"; :129 "ทักษะที่ไม่ปรากฏในใบผลการเรียน" (say ทรานสคริปต์); :130 "สิทธิเลือกตั้งที่มีผลจริง ... คุณมีสิทธิเลือกตั้งถึง 3 ระดับ ... องค์กรที่เลือกตั้งอยู่" ("ที่เลือกตั้งอยู่" is garbled).
  Rewrite set: "**เพื่อนใหม่** ไปประชุมชมรมสม่ำเสมอจะสนิทกับคนมากกว่าไปงานใหญ่นาน ๆ ครั้ง", "**ทักษะที่ทรานสคริปต์ไม่บอก** เช่น จัดงาน พูดต่อหน้าคน และทำงานเป็นทีม", "**เข้าใจสิทธิเลือกตั้ง** นักศึกษาธรรมศาสตร์เลือกตั้งได้ 3 ระดับ การทำกิจกรรมทำให้เข้าใจว่าองค์กรที่เราเลือกทำอะไร ดู [สิทธิและสวัสดิการนักศึกษา](..)".

### 3.4 health-and-wellbeing.mdx

- :3 "สิทธิที่มากับสถานะนักศึกษา ช่องทางปรึกษาสุขภาพจิตจริง" "มากับ" calque; "จริง" meaningless here. Rewrite: "TU Virtual Clinic สิทธิรักษาพยาบาลของนักศึกษา ช่องทางปรึกษาสุขภาพจิต และเบอร์ฉุกเฉินที่ควรเซฟไว้".
- :9 "การดูแลสุขภาพทั้งกายและใจเป็นส่วนหนึ่งของการใช้ชีวิตนักศึกษา ไม่ใช่เรื่องที่ต้องคิดถึงแค่ตอนฉุกเฉิน" generic opener, nominalised; carries no fact. Delete and start with the clinic.
- :11 colon heading. Rewrite: "TU Virtual Clinic ห้องพยาบาลของมหาวิทยาลัย".
- :13 mostly good ("อย่าลืมพก...ไปด้วย" is natural). Minor: "พาสปอร์ต สำหรับนักศึกษาต่างชาติ" is out of place in the home guide; "ห้องพยาบาลของมหาลัย".
- :15 "ให้เริ่มที่นี่ก่อนไปโรงพยาบาลเอกชนโดยตรง", "เจ้าหน้าที่จะส่งต่อโรงพยาบาลให้" "โดยตรง" misplaced; "ส่งต่อ" needs "ไป". Rewrite: "ถ้าเจ็บป่วยเล็กน้อย ให้ไปที่นี่ก่อนแทนที่จะไปโรงพยาบาลเอกชนเลย ถ้าเกินกว่าที่ห้องพยาบาลดูแลได้ เจ้าหน้าที่จะส่งต่อไปยังโรงพยาบาลให้".
- :17-19 "การเป็นนักศึกษาธรรมศาสตร์มาพร้อมสิทธิทั้งการรักษาทั่วไปและกรณีอุบัติเหตุ ดังนี้" calque of "comes with"; the heading :17 and :21 say the same thing. Rewrite: "นักศึกษาธรรมศาสตร์มีสิทธิรักษาพยาบาลทั่วไปและกรณีอุบัติเหตุ ดังนี้".
- :23 "การรักษาที่โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติมีสิทธิดังนี้" wrong subject (treatment does not have rights). Rewrite: "นักศึกษามีสิทธิรักษาที่โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติดังนี้".
- :25-30 table header "วงเงิน" but two rows say only "ครอบคลุม"; "X-ray ฟัน" and Latin lab terms with commas; :30 "ค่ายาตามบัญชียาหลัก" vs :34 "บัญชียาหลักแห่งชาติ". Rewrite header "วงเงินและเงื่อนไข", cell "ใช้สิทธิได้", "เอกซเรย์ฟัน", "ตรวจเลือด (CBC) อุจจาระ ปัสสาวะ และเอกซเรย์ทั่วไป".
- :32 "สิทธินี้จึงเหมาะกับการวางแผนไปใช้ล่วงหน้า มากกว่าจะพึ่งพาตอนมีเหตุด่วนที่ท่าพระจันทร์" comparative calque. Rewrite: "โรงพยาบาลอยู่ที่ศูนย์รังสิต จึงเหมาะกับการไปตรวจตามนัดมากกว่าใช้ตอนป่วยกะทันหันที่ท่าพระจันทร์".
- :34 one 95 word sentence, "ซึ่ง", "ไม่ว่าจะ...หรือไม่", list of benefits with no separators, and an ambiguous "ไม่จำกัดจำนวนครั้ง". Rewrite as text plus bullets:
  "นักศึกษายังใช้สิทธิบัตรทอง (หลักประกันสุขภาพถ้วนหน้า) ได้ ย้ายสิทธิมาที่โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติได้ แต่ไม่ย้ายก็ใช้สิทธิดังนี้ได้
  - ตรวจ วินิจฉัย รักษา และฟื้นฟูร่างกาย
  - ค่าอาหารและค่าห้องสามัญกรณีผู้ป่วยใน
  - ค่ายาและเวชภัณฑ์ตามบัญชียาหลักแห่งชาติ
  - ถอนฟัน อุดฟัน ขูดหินปูน (ไม่จำกัดจำนวนครั้ง) และฟันปลอมฐานพลาสติก
  - การส่งเสริมสุขภาพและการป้องกันควบคุมโรค
    กรณีอุบัติเหตุหรือฉุกเฉิน ใช้โรงพยาบาลที่ใกล้ที่สุดได้ทุกแห่ง".
- :40 the insurance decision tree in one paragraph, "สามารถ Direct Claim ได้" with dropped subject and a sentence order that jumps between three cases. Rewrite as three bullets: "มีชื่อในกรมธรรม์และใช้โรงพยาบาลคู่สัญญา เคลมประกันโดยตรง (Direct Claim) ได้ ไม่ต้องสำรองจ่าย", "ยังไม่มีชื่อในกรมธรรม์ เพิ่มชื่อภายหลังได้", "มีชื่อแต่ใช้โรงพยาบาลอื่น สำรองจ่ายก่อน แล้วยื่นเอกสารที่กองกิจการนักศึกษาประจำศูนย์เพื่อเบิกกับบริษัทประกัน".
- :47 "เสียชีวิต เสียอวัยวะ สายตา การได้ยิน การพูดออกเสียง หรือทุพพลภาพถาวร จากอุบัติเหตุ ถูกทำร้ายร่างกาย หรือถูกฆาตกรรม" verb and noun mixed. Rewrite: "เสียชีวิต สูญเสียอวัยวะ สายตา การได้ยิน หรือการพูด หรือทุพพลภาพถาวร จากอุบัติเหตุ การถูกทำร้าย หรือการถูกฆาตกรรม".
- :52 "ความเครียด ความกังวล หรือภาวะหมดพลังในช่วงเรียนเป็นเรื่องปกติ การขอความช่วยเหลือไม่ใช่ความอ่อนแอ ที่ท่าพระจันทร์มีช่องทางปรึกษาสุขภาพจิตหลายช่องทางดังนี้" four ความ; "ภาวะหมดพลัง" is a wrong collocation for burnout (Thai: หมดไฟ); the reassurance sentence is editorialising; "ช่องทาง" twice. Rewrite: "เครียด กังวล หรือหมดไฟระหว่างเรียนเป็นเรื่องปกติ ขอความช่วยเหลือได้ ที่ท่าพระจันทร์มีช่องทางปรึกษาสุขภาพจิตดังนี้".
- :54 "แบบ Online ... ส่วนแบบ Onsite ... เวลา 08.00 ถึง 16.00 น." the time window is ambiguous (online or onsite?), "TU Greats App". Rewrite as sub bullets: "ออนไลน์ จันทร์ถึงศุกร์", "นัดพบที่ห้องกองกิจการนักศึกษา ชั้น 3 อาคารกิจกรรมนักศึกษา พุธถึงศุกร์ 08.00 ถึง 16.00 น.", "สายด่วนจองคิว 24 ชั่วโมง 02-026-2345 กด 2".
- :56 "ณ คณะศิลปศาสตร์" official ณ. Rewrite: "ที่คณะศิลปศาสตร์".
- :57 "ที่ [link] ไม่มีบริการรักษาด้วยยา" abrupt; "User และ Password". Rewrite: "Relationflip ให้คำปรึกษาสุขภาพจิตออนไลน์ สมัครที่ [..] (ไม่มีบริการจ่ายยา) ถ้าสมัครแล้วยังไม่ได้รับอีเมลชื่อผู้ใช้และรหัสผ่าน หรือมีปัญหาอื่น ติดต่อ RF Call Center 099-002-6888".
- :59 "หากเพื่อนคุณดูเหมือนกำลังลำบากใจ การชวนเขาคุยกับใครสักคน ... หรือการรับฟังโดยไม่ตัดสิน ช่วยได้" "เพื่อนคุณ", nominal subject, "ลำบากใจ" means awkward or uneasy, not distressed. Rewrite: "ถ้าเพื่อนดูเหมือนกำลังทุกข์ใจ ลองชวนคุยหรือชวนไปพบนักจิตวิทยาหรืออาจารย์ที่ไว้ใจ และฟังโดยไม่ตัดสิน".
- :61 "ถ้าสิ่งที่กระทบใจคุณคือการถูกคุกคามหรือกลั่นแกล้ง ไม่ใช่แค่เรื่องสุขภาพทั่วไป" Rewrite: "ถ้าเจอการคุกคามหรือกลั่นแกล้ง ดูวิธีแจ้งเรื่องที่ [..]".
- :90 "1323 (กรุณาเช็กว่ายังใช้งานได้จริงก่อนพึ่งพา)" see 1.10.
- :97-99 heading "เมื่อไหร่ควรไปหาหมอ" (spoken) over a body that repeats :13-15. "จุดแรกที่ไปง่ายที่สุด" is a calque of "the easiest first stop". Rewrite: "ไข้หวัดหรืออาการเล็กน้อยมักหายเองถ้าได้พัก แต่ถ้าอาการรุนแรง ไม่ดีขึ้นใน 2 ถึง 3 วัน หรือไม่แน่ใจ ควรไปตรวจ ไป TU Virtual Clinic ก่อนได้".
- :103 "การนอนพอและกินอาหารตรงเวลาช่วยเรื่องอารมณ์และสมาธิ โดยเฉพาะในช่วงสัปดาห์ที่งานยุ่ง" "งานยุ่ง" is not idiomatic (งานเยอะ). Rewrite: "นอนให้พอและกินข้าวตรงเวลาช่วยเรื่องอารมณ์และสมาธิ โดยเฉพาะสัปดาห์ที่งานเยอะ".
- :104 "เชื่อมต่อกับเพื่อนแบบไม่กดดัน" calque of "connect". Rewrite: "กิจกรรมของ BIRSA และคณะเป็นวิธีทำความรู้จักเพื่อนแบบสบาย ๆ ซึ่งดีต่อใจเหมือนกัน".
- :105 "ค่าใช้จ่ายในการขอความช่วยเหลือ" Rewrite: "ถ้ากังวลเรื่องค่ารักษา ให้เช็กก่อนว่าสิทธิรักษาพยาบาลหรือประกันอุบัติเหตุของนักศึกษาครอบคลุมหรือไม่ ก่อนจ่ายเอง".
- :109 "หากคุณหรือคนใกล้ตัวตกอยู่ในอันตรายเฉียบพลัน ... เป็นทางเลือกที่เหมาะสมเสมอ" "อันตรายเฉียบพลัน" is medical calque; the last clause is filler. Rewrite: "ถ้าตัวเองหรือคนใกล้ตัวอยู่ในอันตราย โทร 1669 หรือ 191 ทันที ขอความช่วยเหลือเร็วเท่าไรยิ่งดี".

### 3.5 live-bus-tracker.mdx

- :3 "ที่ป้ายสามป้ายรอบแคมปัส" clumsy. Rewrite: "เวลารถเมล์เข้าแบบเรียลไทม์จาก GPS ที่ 3 ป้ายใกล้ท่าพระจันทร์ พร้อมป้ายถัดไปของแต่ละสายและปลายทาง".
- :9 "ครอบคลุมรถเมล์แทบทุกสายที่ขึ้นได้แถวมหาลัย" Rewrite: "ทั้ง 3 ป้ายรวมกันมีรถเมล์เกือบทุกสายที่ผ่านย่านมหาวิทยาลัย". "ม.ธรรมศาสตร์" is the stop name, fine, but elsewhere it is "มธ.".
- :11 the interface description paragraph (seven clauses: "แต่ละป้ายเป็นการ์ดที่กดเปิดหรือปิดได้...ทุก 5 ป้าย...ถูกยุบรวมไว้ด้านล่าง...สลับระหว่างแบบเต็มกับแบบย่อ"). This is the page describing itself; the widget is self-explanatory. Also "ป้ายสำคัญตลอดเส้นทางทุก 5 ป้าย" is unclear, "ถูกยุบรวม" is passive. Rewrite: "กระดานด้านล่างแสดงเวลารถเมล์เข้าแบบเรียลไทม์ กดที่ป้ายเพื่อดูแต่ละสาย สายที่ยังไม่มีรถให้ติดตามจะพับรวมไว้ด้านล่าง".
- :18-20 Notice "เวลารถเข้ามาจากตำแหน่ง GPS แบบเรียลไทม์ของรถบนแอปนำทาง ซึ่งเป็นบริการข้อมูลเปิดของกรมการขนส่งทางบก" "ซึ่ง" has two possible antecedents and "บนแอปนำทาง" is unclear. Rewrite: "ระบบคำนวณเวลารถเข้าจากตำแหน่ง GPS ของรถ ซึ่งเป็นข้อมูลเปิดของกรมการขนส่งทางบก".
  :19 "ไม่ปรากฏเลย" fine. :20 "ใช้ตัวเลขนี้เป็นแนวทางได้ แต่ไม่ใช่การรับประกัน" calque of "guide not guarantee". Rewrite: "ใช้ประมาณเวลาได้ แต่ไม่รับประกัน".
- :23 "ค่าโดยสาร รถปรับอากาศ และการขึ้นได้ด้วยรถเข็นจะแสดงไว้รายสาย" "การขึ้นได้ด้วยรถเข็น" garbled. Rewrite: "ค่าโดยสาร ประเภทรถแอร์ และรถที่รถเข็นขึ้นได้ จะแสดงรายสายเท่าที่ผู้ให้บริการเปิดเผยข้อมูล".

### 3.6 money-matters.mdx

- :3 "พร้อมสิทธิพิเศษที่บัตรนักศึกษาใช้ได้จริงรอบ ทพจ." undefined ทพจ., "ใช้ได้จริง" filler, lists monthly costs that are not on this page. Rewrite: "การวางแผนเงิน งานพาร์ทไทม์ ค่าเทอมและเงินคืน และส่วนลดที่ใช้บัตรนักศึกษาได้ใกล้ท่าพระจันทร์".
- :9 heading "วางแผนเงินที่ได้รับ" "เงินที่ได้รับ" is a calque of "allowances" (Thai: เงินที่บ้านให้, ค่าขนม). Rewrite: "วางแผนใช้เงิน". Same phrase in home.ts:121.
- :11 "ใช้เงินจากครอบครัวผสมกับทุนหรือเงินกู้เพื่อการศึกษาในบางกรณี ... นิสัยพื้นฐานเหล่านี้ช่วยได้เสมอ" misplaced "ในบางกรณี"; "นิสัยพื้นฐาน...ช่วยได้เสมอ" calque. Rewrite: "นักศึกษาส่วนใหญ่ใช้เงินจากที่บ้าน บางคนมีทุนหรือกู้เพื่อการศึกษาด้วย ไม่ว่าเงินจะมาจากไหน วิธีเหล่านี้ช่วยได้".
- :14 "แล้วค่อยใช้ส่วนที่เหลือเป็น 'เงินพิเศษ'" wrong collocation ("เงินพิเศษ" is a bonus). Rewrite: "แล้วค่อยใช้ส่วนที่เหลือเป็นเงินสนุก" or "เงินใช้ส่วนตัว".
- :15 "ไว้ใช้ในสัปดาห์ที่ไม่เป็นไปตามแผน" calque. Rewrite: "ไว้ใช้ตอนมีเรื่องไม่คาดคิด". "ถ้าไหว ลองกัน..." is natural, keep.
- :17 heading "งานพาร์ทไทม์ คร่าว ๆ" stray space and a filler tag. Rewrite: "งานพาร์ทไทม์".
- :21 "การเรียนต้องมาก่อนเสมอ" editorialising; delete. :23 "ประเมินตามจริงว่าคุ้มไหม ... อาจไม่ใช่ทางเลือกที่ดี" Rewrite: "ถ้างานกินเวลาเรียนจนผลการเรียนตก ก็ไม่คุ้ม".
- :25-28 Notice duplicates :22. Delete.
- :30, :44 "สิทธิประโยชน์สำหรับเด็ก ทพจ." slang heading over formal contents (English twin has "dek TPC", so this may be deliberate; if kept, explain once). Rewrite: "ส่วนลดร้านค้าและร้านอาหาร" and "สิทธิพิเศษ พิพิธภัณฑ์และแหล่งวัฒนธรรม".
- :48-51 "เข้าฟรีเมื่อโชว์บัตรนักศึกษา" vs :39-41 "แสดงบัตรนักศึกษา".
- :50 "นิทรรศน์รัตนโกสินทร์" see 1.10.
- :55 one sentence covering print quota, AI tools and a link; "ใช้รับโควตา". Rewrite: "บัตรนักศึกษาใช้รับโควตาพรินต์ฟรีคนละ 100 บาทต่อภาคการศึกษาที่หอสมุดปรีดี พนมยงค์ ชั้น U2 และตรวจการคัดลอกเนื้อหาและ AI ฟรีผ่านบริการ AI TOOLs Services ใน U-Services ของหอสมุด เวลาเปิด การจองห้อง และบริการอื่นดูที่ [..]" (better still, link only).
- :59 "เงินคืนจึงเข้าบัญชีนี้โดยอัตโนมัติ" repeats itself. Rewrite: "ถ้าถอนรายวิชาแล้วมีสิทธิ์ได้เงินคืน เงินจะเข้าบัญชีธนาคารกรุงเทพของนักศึกษาโดยอัตโนมัติ เพราะบัตรนักศึกษาเป็นบัตรธนาคารกรุงเทพด้วย".
- :60 "ต้องติดต่อคณะของตัวเองเพื่อยื่นคำร้อง ทางคณะจะพิจารณาเป็นรายบุคคล" Rewrite: "ยื่นคำร้องที่คณะของตัวเอง คณะจะพิจารณาเป็นรายบุคคล".
- :61 "จะขึ้น W สำหรับวิชานั้น ซึ่งไม่ส่งผลต่อผลการเรียน แต่จะไม่สามารถขอเงินค่าธรรมเนียมคืนได้ในกรณีนี้" Rewrite: "ระบบ TU Greats จะบันทึก W ในวิชานั้น ไม่กระทบผลการเรียน แต่ขอเงินคืนไม่ได้".
- :63-65 section "จดบันทึกแบบไม่ต้องซับซ้อน" duplicates :13; "ไม่จำเป็นต้องใช้ระบบซับซ้อน" and "เป้าหมายคือให้เห็นรูปแบบการใช้เงิน" are calques. Merge into :13: "จดรายจ่ายสักเดือนในแอปโน้ต สเปรดชีต หรือสมุดก็ได้ เพื่อดูว่าเงินไปกับอะไรบ้างก่อนที่เงินจะขาดมือ" ("ก่อนที่เงินจะขาดมือ" is good native Thai, keep).
- :67-69 "หากประสบปัญหาการเงิน" is ราชการ. Rewrite: "ถ้าเงินไม่พอ ติดตามประกาศของ BIRSA เรื่องทุนหรือความช่วยเหลือด้านการเงิน ถ้าเครียดมาก ดู [สุขภาพและความเป็นอยู่ที่ดี](..)".

### 3.7 places-nearby.mdx

- :3 "พร้อมหอพักและคอนโดแนะนำ มาพร้อมแผนที่และเลขกำกับ" "พร้อม...มาพร้อม". Rewrite: "รวมร้านอาหารแถวท่าพระจันทร์และปิ่นเกล้า หอพักและคอนโดแนะนำ พร้อมแผนที่และเลขกำกับ".
- :9 "เป็นหนึ่งในย่านเมืองเก่าที่เดินสะดวกและมีร้านอาหารหนาแน่นที่สุดของกรุงเทพฯ ฝั่งปิ่นเกล้าอยู่ห่างออกไปเพียงข้ามแม่น้ำ" superlative calque, "หนาแน่น" for restaurants, "ห่างออกไปเพียงข้ามแม่น้ำ" awkward. Rewrite: "ท่าพระจันทร์เดินสะดวกและมีร้านอาหารเยอะที่สุดย่านหนึ่งของกรุงเทพฯ ข้ามแม่น้ำไปก็ถึงฝั่งปิ่นเกล้า ร้านอาหารเกือบ 70 ร้านและที่พัก 16 แห่งด้านล่างมาจากลิสต์ Google Maps ที่ BIRSA รวบรวมไว้".
- :12-14 Notice "ตำแหน่ง...เป็นตำแหน่งโดยประมาณ ... เป็นค่าเฉลี่ยจาก Google Maps ณ เดือนกรกฎาคม 2569 จึงถือเป็นข้อมูล ณ ช่วงเวลานั้น" "ณ" twice, redundant; review count is not an average. Rewrite: "หมุดบนแผนที่บอกตำแหน่งคร่าว ๆ ถ้าต้องการเส้นทางที่แน่นอนให้กด 'เปิดใน Google Maps' ที่ร้านนั้น คะแนนและจำนวนรีวิวเป็นข้อมูลจาก Google Maps เดือนกรกฎาคม 2569 อาจเปลี่ยนไปแล้ว".
- :19 "ไม่ได้จัดตามโซน จึงมีเลขกำกับบนแผนที่สองแผ่นแยกกันคือ" the "จึง" is illogical and the page narrates its own controls. Rewrite: "ร้านจัดตามประเภทอาหาร เลขบนแผนที่มี 2 ชุด คือฝั่งเมืองเก่า (ท่าพระจันทร์ วังหลัง และใกล้เคียง) และฝั่งปิ่นเกล้า กดเลขเพื่อดูรายละเอียดร้านนั้น".
- :25 "ใช้เป็นจุดเริ่มต้นไปดูสถานที่จริงก่อนตัดสินใจ" calque. Rewrite: "ใช้เป็นข้อมูลเบื้องต้นก่อนไปดูห้องจริง และสอบถามราคากับห้องว่างล่าสุดกับที่พักโดยตรงก่อนจอง".
- :29 heading "เกร็ดเล็กน้อย" (trivia); use "เคล็ดลับ" as getting-around does.
- :32 "เป็นวิธีที่เร็วและถูกที่สุดในการไปกินของฝั่งวังหลัง" "ในการไป". Rewrite: "นั่งเรือข้ามฟากจากท่าพระจันทร์ไปวังหลังเร็วและถูกที่สุด".
- :33 "ร้านบุฟเฟ่ต์และหมูกระทะแถวปิ่นเกล้าเหมาะกับมื้อรวมกลุ่มหลังทำกิจกรรมกันเสร็จ ราคาย่อมเยาและกินได้หลายคน" "กินได้หลายคน" literally "can eat many people": an error. Rewrite: "บุฟเฟต์และหมูกระทะแถวปิ่นเกล้าเหมาะกับไปกินเป็นกลุ่มหลังเสร็จกิจกรรม ราคาไม่แพง".
- :35 heading "ที่อื่น ๆ ที่น่าไปเพิ่มเติม" redundant. Rewrite: "ที่อื่นที่น่าไป". :37 "ที่น่าไปเยือน" is brochure language; drop it (also :54 bold label).
- :42 "นิวยั่งฮั้วโภชนา" vs food:25 "นิวย่งฮั้ว"; :44 "LUA CAFE (BKK)"; :62 "Icon Siam" (official ICONSIAM).

### 3.8 rights-and-welfare.mdx

- :2 "สิทธิและสวัสดิการของคุณ" drop คุณ ("สิทธิและสวัสดิการนักศึกษา"); same for :11 heading.
- :9 "สิทธิเหล่านี้เป็นของคุณอยู่แล้วในฐานะนักศึกษาธรรมศาสตร์ ไม่ใช่เรื่องที่ต้องขอร้องใคร รวมถึงสิทธิที่จะรู้สึกปลอดภัยด้วย ถ้าพฤติกรรมของใครก็ตามทำให้คุณรู้สึก..." calque of "these are yours", rhetorical reassurance, "สิทธิที่จะ", two คุณ. Rewrite: "นักศึกษาธรรมศาสตร์มีสิทธิเหล่านี้อยู่แล้ว ไม่ต้องไปขอใคร รวมถึงสิทธิที่จะปลอดภัยในมหาวิทยาลัย ถ้าใครทำให้รู้สึกไม่ปลอดภัย ไม่สบายใจ หรือถูกล่วงละเมิด ดูวิธีแจ้งเรื่องที่ [..]".
- :13 "ในฐานะนักศึกษาธรรมศาสตร์ คุณมีสิทธิเลือกตั้งถึง 3 ระดับ" Rewrite: "นักศึกษาธรรมศาสตร์เลือกตั้งได้ 3 ระดับ".
- :15-17 bullets start with the noun "การเลือกตั้ง..." and :15 has an unmarked apposition ("(TUSC) องค์กรที่มีสมาชิก 100 คน ทำหน้าที่เป็น...") plus the TUSC level contradiction (1.10). Rewrite: "เลือกสภานักศึกษา (TUSC) ซึ่งมีสมาชิก 100 คน ทำหน้าที่เป็นตัวแทนนักศึกษาและอนุมัติและตรวจสอบงบกิจกรรมนักศึกษา", "เลือกองค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ (อมธ.) ทั้งระดับศูนย์ (อมธ. ท่าพระจันทร์) และส่วนกลาง", "เลือกกรรมการนักศึกษาประจำคณะหรือสาขาของตัวเอง".
- :19 "ดูรายละเอียดว่าแต่ละองค์กรทำหน้าที่อะไรและติดต่อได้ที่ไหน รวมถึงวิธีลงสมัครรับเลือกตั้งด้วยตัวเอง ได้ที่" long sentence with the pointer at the far end. Rewrite: "หน้าที่ ช่องทางติดต่อ และวิธีลงสมัครของแต่ละองค์กรอยู่ที่ [มาร่วมกิจกรรม](..)".
- :21-29 official dress and title policy. This is the one place formal ราชการ is defensible because it reproduces a university announcement, but it should be either quoted and attributed or rewritten. If rewritten: :25 "นักศึกษาสามารถแต่งชุดไปรเวทได้..." drop สามารถ; "ตามเพศวิถีของตน" is official phrasing (keep only if verbatim).
  :29 "ไม่มีการบังคับใช้คำนำหน้านามที่แสดงถึงเพศ... เว้นแต่มีกฎหมายกำหนดให้ต้องใช้ หรือบางกรณีที่มีความจำเป็น เช่น ... ที่จำเป็นต้องมีคำนำหน้า แต่จะไม่มีการปรากฏคำนำหน้านามบนบัตร" has "มีความจำเป็น...จำเป็นต้อง", "ไม่มีการบังคับใช้", "จะไม่มีการปรากฏ". Rewrite: "มหาวิทยาลัยไม่บังคับให้ใช้คำนำหน้านามที่ระบุเพศในงานของนักศึกษา ยกเว้นกรณีที่กฎหมายกำหนดหรือมีเหตุจำเป็น เช่น การขึ้นทะเบียนนักศึกษาใหม่ที่ต้องระบุคำนำหน้า และบัตรนักศึกษาจะไม่พิมพ์คำนำหน้านาม".
- :33 "ที่ท่าพระจันทร์ สามารถขอผ้าอนามัยฟรีได้ที่แต่ละคณะ..." Rewrite: "ที่ท่าพระจันทร์ขอผ้าอนามัยฟรีได้ที่แต่ละคณะหรือที่ห้อง อมธ. ท่าพระจันทร์ ส่วนถุงยางอนามัยกดได้จากตู้ที่ชั้น 1 อาคารกิจกรรมนักศึกษา".
- :35 "และจุดแจกบริเวณห้องน้ำ หอสมุดป๋วย อึ๊งภากรณ์ และศูนย์การเรียนรู้..." unclear list boundary, and a Rangsit paragraph on a Tha Prachan guide. Rewrite: "และจุดแจกในห้องน้ำของหอสมุดป๋วย อึ๊งภากรณ์ กับศูนย์การเรียนรู้กรมหลวงนราธิวาสราชนครินทร์ (ศกร.)". Also confirm which "ป๋วย อึ๊งภากรณ์" library is meant (Rangsit vs the Economics faculty library in study-support:39).
- :39-43 the table packs facility and location into one cell ("ฟิตเนส ข้างอาคารยิมเนเซียม"). Split into สถานที่, ที่ตั้ง, เวลา. "วันจันทร์ถึงวันศุกร์" vs health "วันจันทร์ถึงศุกร์": drop the second วัน.
- :47 "คำถามที่นักศึกษาใหม่ถามบ่อยที่สุด" unverifiable superlative, meta. Delete.
- :49 "แอปที่นักศึกษา มธ. ต้องมีคือแอปอะไร" but the answer says "ควรติดตั้ง" (must vs should). :50-51 "ใช้แสดงบัตรนักศึกษาและจองบริการต่าง ๆ เช่น การนัดพบนักจิตวิทยา ได้ในแอปเดียว" order of English "all in one app", nominal "การนัดพบ", and the stranded "ๆ". Rewrite: "TU Greats เป็นแอปที่นักศึกษาธรรมศาสตร์ควรติดตั้งทุกคน ใช้แสดงบัตรนักศึกษาและจองบริการ เช่น นัดพบนักจิตวิทยา ได้ในแอปเดียว".
- :55 "ที่ท่าพระจันทร์มีทั้งหมด 3 จุด" "ห้องละหมาด" is a room, say "3 แห่ง"; "หน้าโรงยิมเนเซียม" vs โรงยิม elsewhere.
- :64 question "อยากใช้ห้อง... ต้องทำอย่างไร" (chatty then formal). Rewrite: "จองห้องที่อาคารกิจกรรมนักศึกษาหรือโรงยิมอย่างไร".
- :76-82 the complaints answer is one paragraph with three "ส่วน" and the calque "มีช่องทางแจ้งเรื่องของตัวเองโดยเฉพาะ แยกจากช่องทางข้างต้น" ("ข้างต้น" ราชการ). Copy the bullet layout from safety:25-27 and shorten: "ส่วนการคุกคามและการกลั่นแกล้งมีช่องทางแจ้งเหตุแยกต่างหาก ดู [..]".
- :84-86 "หน้านี้ครอบคลุมเรื่องสิทธิและสวัสดิการ ไม่ใช่การรักษาพยาบาลหรือบริการห้องสมุดทั้งหมด สำหรับ... ดูที่... สำหรับ... ดูที่..." meta plus double "สำหรับ...ดูที่". Rewrite: "เรื่องประกันอุบัติเหตุ สุขภาพจิต และการรักษาพยาบาล ดู [..] เรื่องห้องสมุด โควตาพรินต์ และที่อ่านหนังสือ ดู [..]" ("พื้นที่การเรียน" is a calque).

### 3.9 safety-and-emergencies.mdx

- :9 "ควรระมัดระวังเป็นพิเศษบริเวณริมน้ำ ตอนกลางคืน และเรื่องกลโกง" mixed list (place, time, topic). Rewrite: "ท่าพระจันทร์ค่อนข้างปลอดภัย แต่ควรระวังเป็นพิเศษบริเวณริมน้ำ ตอนกลางคืน และกลโกงที่มักเล็งนักศึกษา".
- :13 mostly native and good ("ไม่ชอบมาพากล", "อย่าคิดว่าคนอื่นคงแจ้งไปแล้ว"). Keep; define "รปภ." once.
- :15 duplicates the health page; "แบบไม่ฉุกเฉิน" calque; AED bolted on. Rewrite: "ถ้าบาดเจ็บหรือไม่สบายแต่ไม่ฉุกเฉิน ไปที่ TU Virtual Clinic ก่อน (ที่ตั้งและเวลาดู [..]) เครื่อง AED อยู่หน้าหอประชุมศรีบูรพา".
- :17-19 lost card. "แจ้งที่ อมธ. ท่าพระจันทร์ เพื่อให้ประกาศ Lost and Found ให้ เนื่องจากบัตรนักศึกษาเป็นบัตรธนาคารในตัวด้วย" double "ให้", "เนื่องจาก", and the urgent step (freeze the card) comes last. Also "อายัดบัญชี" (freeze account) may mean "อายัดบัตร"; verify with the bank text. Rewrite: "บัตรนักศึกษาเป็นบัตรธนาคารกรุงเทพด้วย ถ้าบัตรหาย ให้อายัดผ่านแอปธนาคารกรุงเทพทันที แล้วแจ้ง อมธ. ท่าพระจันทร์ให้ประกาศตามหา ถ้ายังไม่พบ ไปติดต่อสาขาธนาคารกรุงเทพฝั่งประตูท่าพระจันทร์".
- :31 "ข้อควรระวังพื้นฐาน" dangling fragment (a colon dropped, not replaced). Rewrite: "แม่น้ำเจ้าพระยามีเรือสัญจรมากและกระแสน้ำแรง ควรระวังดังนี้".
- :34 "ถือกระเป๋าและโทรศัพท์ให้มั่นคง" calque. Rewrite: "ถือกระเป๋าและโทรศัพท์ให้แน่นเวลาอยู่ใกล้ข้างเรือด่วนที่เปิดโล่ง". :35 Rewrite: "อย่าไปท่าเรือหรือยืนริมราวกันตกตอนดึกที่ไฟสลัว".
- :39 "รูปแบบที่พบบ่อยคือคนแปลกหน้าเข้ามาบอกว่า 'วันนี้ปิด แต่พาไปที่ดีกว่าได้' แถวพระบรมมหาราชวัง หรือข้อเสนอ 'ดีลพิเศษ'..." three ideas in one sentence, the place phrase stranded after the quote, and the quoted line is not what a Thai tout says. Rewrite: "คนแปลกหน้าอาจเข้ามาบอกแถวพระบรมมหาราชวังว่า 'วันนี้วัดปิด เดี๋ยวพาไปที่อื่นที่ดีกว่า' หรือเสนอ 'ดีลพิเศษ' ให้ปฏิเสธอย่างสุภาพแล้วเดินต่อ ไม่ต้องอธิบายเหตุผลให้ใคร".
- :43 the harassment paragraph (95 words). "มีสิทธิ์แจ้งเรื่องได้เสมอ" double modality; "ก่อนถึงจะขอคำปรึกษา" spoken; "เรียบเรียงเรื่องราวให้สมบูรณ์" calque; "และจะเริ่มจาก...ก็ได้เช่นกัน". Keep the reassurance, split it. Rewrite: "การคุกคามและการกลั่นแกล้งยอมรับไม่ได้ ไม่ว่าจะมาจากเพื่อนนักศึกษา อาจารย์ เจ้าหน้าที่ หรือคนนอก ถ้ารู้สึกไม่ปลอดภัย ไม่สบายใจ หรือถูกล่วงละเมิด แจ้งเรื่องได้เสมอ ไม่ต้องมีหลักฐานครบ และไม่ต้องเล่าให้เรียบร้อยก่อน จะเริ่มจากคุยกับกรรมการ BIRSA ที่ไว้ใจก็ได้".
- :47 heading "ข้อควรระวังในชีวิตประจำวัน" nominal. Rewrite: "ระวังตัวในชีวิตประจำวัน".
- :50 "เผื่อกรณีของหายหรือถูกขโมย" "เผื่อ" already means in case. Rewrite: "เผื่อของหายหรือโดนขโมย". :51 "เซฟเบอร์...ไว้ในที่ที่หยิบใช้ได้เร็ว" calque. Rewrite: "เซฟเบอร์ รปภ. ของมหาวิทยาลัยและเบอร์คนที่ไว้ใจไว้ในโทรศัพท์".
- :55 "โทร 1669 (การแพทย์) หรือ 191 (ตำรวจ) ก่อนเป็นอันดับแรก แล้วค่อยแจ้ง BIRSA หรือคณะภายหลังถ้ากระทบการเรียนหรือความเป็นอยู่ของคุณ" "ก่อนเป็นอันดับแรก" redundant, "ภายหลัง", "ของคุณ". Rewrite: "ถ้าเกิดเหตุฉุกเฉิน โทร 1669 (แพทย์) หรือ 191 (ตำรวจ) ก่อน แล้วค่อยแจ้ง BIRSA หรือคณะถ้าเรื่องนั้นกระทบการเรียน".

### 3.10 shuttle-bus.mdx

- :3 "ตารางเวลาเต็ม และตัวจับเวลาถอยหลังนับถึงรถคันต่อไปแบบเรียลไทม์" "ตารางเวลาเต็ม" (full timetable) and "ตัวจับเวลาถอยหลังนับถึง" are literal. Rewrite: "รถเวียนฟรี 2 สายจากท่าพระจันทร์ เส้นทาง ตารางเวลาทั้งหมด และนับถอยหลังถึงรถคันต่อไป".
- :9 "ขึ้นรถได้ที่หน้าหอประชุมมหาวิทยาลัยธรรมศาสตร์เหมือนกันทั้งสองสาย" tail heavy. Rewrite: "ทั้งสองสายขึ้นรถที่หน้าหอประชุมมหาวิทยาลัยธรรมศาสตร์". (The rest of :9 is good.)
- :17 "บอร์ด" vs กระดาน (live-bus-tracker).
- :23 "วิ่งวนเป็นลูป ออกไปฝั่งปิ่นเกล้า วนจุดจอดฝั่งนั้นครบรอบ แล้ววนกลับมหาลัย" "วน" three times, "ลูป", "ครบรอบ". Rewrite: "สายปิ่นเกล้าวิ่งข้ามไปฝั่งปิ่นเกล้า ผ่านจุดจอดฝั่งนั้นครบแล้ววนกลับมาที่มหาวิทยาลัย บางรอบเป็นรถรับส่งหอในด้วย".
- :29 "นี่คือตารางเวลาเต็มของวันธรรมดา นับจากเวลาที่ออกจากมหาลัย ตอนนี้รถทั้งสองสายให้บริการตามปกติ จนถึงวันพุธที่ 30 กันยายน..." "นี่คือ" (NEWS-STYLE 3.4), colon style times, dates without year that expire today, ambiguity in "ตอนนี้...จนถึง", "รีบไปไหนแบบเผื่อเวลาน้อย". Rewrite as: "ตารางด้านล่างเป็นเวลาออกจากมหาวิทยาลัยในวันธรรมดา" then a table (ช่วงวัน, สายสนามไชย, สายปิ่นเกล้า): "ถึงวันพุธที่ 30 กันยายน 2569 | 07.45 ถึง 21.30 น. | 07.00 ถึง 21.30 น." and "ตั้งแต่วันพฤหัสบดีที่ 1 ตุลาคม 2569 | 07.00 ถึง 21.30 น. สายละ 1 คัน | 07.00 ถึง 21.30 น. สายละ 1 คัน", then "บางชั่วโมงไม่มีรถทั้งสองสาย ถ้าต้องต่อรถหรือมีเวลาน้อย ควรเช็กตารางก่อน".
- :35 warning title "เวลาที่แจ้งคือเวลาตามตาราง ไม่ใช่เวลาจริงเป๊ะ ๆ" "เป๊ะ ๆ" too chatty inside a warning. Rewrite: "เวลาในตารางเป็นเวลาตามแผน ไม่ใช่เวลาจริง".
- :36-38 "รถอาจตกรอบเพราะรถติด ถ้าตกรอบ..." "ตกรอบ" means to be eliminated, wrong collocation. Rewrite: "ช่วงเร่งด่วนรถอาจมาช้าเพราะรถติด รอบที่พลาดไปจะไปรวมกับรอบถัดไป ไม่ได้ยกเลิก เวลาในตารางและตัวนับถอยหลังจึงเป็นเวลาตามแผน ไม่ใช่ตำแหน่งรถจริง เผื่อเวลาไว้ด้วยถ้าต้องต่อรถไฟหรือไปสอบ".
- :41 "ซึ่งจะโชว์ตำแหน่งจริงของรถ ไม่ใช่แค่เวลาตามตาราง" Rewrite: "ดูตำแหน่งรถจริงได้ในแอป Viabus".
- :42 "เรือ MRT" ambiguous. Rewrite: "เรือ รถไฟฟ้า MRT หรือแอปเรียกรถ".
- :43 "สอบถามได้ที่จุดนี้" (ask whom?). Rewrite: "ถามคนขับได้".

### 3.11 study-support.mdx

- :9 "ห้องสมุดของธรรมศาสตร์มีมากกว่าแค่ที่ยืมหนังสือ ได้แก่..." table of contents in prose. Delete.
- :13 "เปิดให้ใช้งานทั้งช่วงใกล้สอบและหลังเลิกเรียน มีสิ่งอำนวยความสะดวกดังนี้" vague and it contradicts nothing but adds nothing; "ใช้งาน" for a library (ใช้บริการ). Rewrite: "หอสมุดปรีดี พนมยงค์มีดังนี้".
- :15 "Study room และ Co-learning space ให้ไปทำงานหรือพักผ่อนหลังเลิกเรียน" verb missing. Rewrite: "ห้อง Study Room และ Co-learning Space สำหรับทำงานหรือพักหลังเลิกเรียน". :20 "ห้อง Performative room ที่ใช้จัดกิจกรรม" Rewrite: "Performative Room สำหรับจัดกิจกรรม".
- :22-25 Notice "ให้ตรวจงานเขียนของตัวเองว่ามีการใช้ AI หรือคัดลอกเนื้อหาหรือไม่ ฟรี ก่อนส่งงานจริง" "ฟรี" stranded. Rewrite: "AI TOOLs Services ของหอสมุดตรวจงานเขียนของตัวเองได้ฟรีก่อนส่งงานจริง ว่าใช้ AI หรือคัดลอกเนื้อหามาหรือไม่".
- :29 "พนมยงค์เปิดบริการ" missing space.
- :33 "เปิดสั้นกว่า" wrong collocation; "ก่อนตั้งใจไปเป็นพิเศษ" calque of "before making a special trip". Rewrite: "แต่ละคณะมีห้องสมุดของตัวเอง ส่วนใหญ่เล็กกว่าและปิดเร็วกว่าหอสมุดปรีดี พนมยงค์ ควรเช็กเวลาก่อนไป โดยเฉพาะวันเสาร์และอาทิตย์".
- :37-41 the hours cells run several time ranges together ("จันทร์ถึงศุกร์ 08.30 ถึง 21.30 น. เสาร์ 09.00 ถึง 19.00 น. ปิดวันอาทิตย์และวันหยุดนักขัตฤกษ์"). Use line breaks inside the cell or a separate column for weekday, Saturday, Sunday. :40 "ห้องสมุดศ. สังเวียน" missing space vs :38 "ศ.ดิเรก".
- :45 "นักศึกษาระดับปริญญาตรีจะได้รับสิทธิ" dangling. Rewrite: "นักศึกษาปริญญาตรีมีสิทธิดังนี้".
- :49 "**Full Text Finder** สำหรับค้นหา..." fragment without a verb. Rewrite: "ค้นบทความ วารสาร หนังสืออิเล็กทรอนิกส์ และวิทยานิพนธ์ได้ผ่าน Full Text Finder".
- :51 heading "การจองห้อง Study Room" nominal. Rewrite: "จองห้อง Study Room".
- :53 "จองผ่าน Line Official ของหอสมุด" brand name (LINE Official Account).
- :55-59 "บัญชี Line ของหอสมุดปรากฏอยู่สองชื่อ" calque; stray space in "<strong> @TULIBLifeOnline</strong>". Rewrite: "บัญชี LINE ของหอสมุดมี 2 ชื่อ คือ @Lifeonline และ @TULIBLifeOnline ถ้าค้นชื่อหนึ่งไม่เจอ ให้ลองอีกชื่อ หรือค้นบัญชีทางการของหอสมุดใน LINE".
- :63 "กรอกรหัสร่วมจอง" unclear (shared booking code?); explain or check.
- :66 "HBO Go" see 1.10.
- :68-70 all English heading; "ข้าวของเครื่องใช้" is good native Thai, keep. Rewrite heading "ยืมของใช้ (Library of Things)"; list "โน้ตบุ๊ก iPad กล้อง ปลั๊กพ่วง ฮีตเตอร์ ถุงน้ำร้อน และบอร์ดเกม" (no Latin commas).
- :82 "ที่กล่าวไปข้างต้น ตรวจการใช้ AI ในลักษณะเดียวกัน ฟรี" ราชการ plus stranded "ฟรี". Rewrite: "AI TOOLs Services (ดูด้านบน) ตรวจการใช้ AI ได้ฟรีเช่นกัน".
- :83 "รับกลับทางอีเมล" Rewrite: "รับผลทางอีเมลภายใน 3 วันทำการ".
- :84 "icon" → "ไอคอน".
- :86-88 "TU-GET คือข้อสอบวัดระดับภาษาอังกฤษของธรรมศาสตร์เอง มีสองรูปแบบ และสามารถใช้ผลยื่นขอยกเว้นหน่วยกิตวิชาเรียนได้ รวมถึงเทียบเคียงกับ TOEFL iBT และ IELTS ได้" Rewrite: "TU-GET เป็นข้อสอบวัดระดับภาษาอังกฤษของธรรมศาสตร์ มี 2 รูปแบบ ใช้ผลสอบยื่นขอยกเว้นรายวิชาได้ และเทียบคะแนนกับ TOEFL iBT และ IELTS ได้".
- :90 table's top left header cell is empty (accessibility), :93 "พาร์ทละ" spelling.
- :101 heading "หน้าที่เกี่ยวข้อง" is a homograph trap: it reads first as "หน้าที่" (duty) "เกี่ยวข้อง". Rewrite: "หน้าอื่นที่เกี่ยวข้อง" or "อ่านต่อ". :103 "สำหรับ...ดูที่...และสำหรับ...ดูที่". Rewrite: "สิทธิและสวัสดิการอื่นดูที่ [..] ส่วนลดที่ใช้บัตรนักศึกษาได้ใกล้ท่าพระจันทร์ดูที่ [..]".

### 3.12 content/onboarding/home.ts (Thai strings)

- :19 title colon. Rewrite: "เริ่มต้นที่ BIR สำหรับนักศึกษาไทย" (or "เริ่มเรียนที่ BIR สำหรับนักศึกษาไทย").
- :23 lede "สิ่งที่ควรทำเรียงตามลำดับคร่าว ๆ ก่อนและระหว่างสัปดาห์แรกที่ BIR ติ๊กในช่องเมื่อทำเสร็จ ข้อมูลจะถูกเก็บไว้ในอุปกรณ์นี้เท่านั้น ไม่ถูกส่งไปที่ใด" two passives, "ที่ใด" ราชการ, the "ก่อนและระหว่างสัปดาห์แรก" reads oddly. Rewrite: "สิ่งที่ควรทำก่อนเปิดเทอมและในสัปดาห์แรกที่ BIR เรียงตามลำดับคร่าว ๆ ทำเสร็จแล้วติ๊กช่องไว้ ข้อมูลเก็บในอุปกรณ์เครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน".
- :31 blurb "ทำความเข้าใจภาพรวมก่อนเปิดเทอม" repeats the title "ก่อนเปิดเทอม" (:28); and "ทำความเข้าใจ" again at :113. Vary: "ดูภาพรวมของ BIR และธรรมศาสตร์ก่อนไปจริง".
- :47 "ตรวจสอบวันปฐมนิเทศและกำหนดการเปิดเทอม" ตรวจสอบ is heavy for a checklist item. Rewrite: "ดูวันปฐมนิเทศและวันเปิดเทอม".
- :69 "เกณฑ์การสมัครและค่าเล่าเรียนโดยประมาณต่อปี นักศึกษาไทย 125,000 บาท นักศึกษาต่างชาติ 144,000 บาท" two figures side by side with no linking word. Rewrite: "เกณฑ์การสมัครและค่าเล่าเรียนโดยประมาณ ปีละ 125,000 บาทสำหรับนักศึกษาไทย และ 144,000 บาทสำหรับนักศึกษาต่างชาติ".
- :81 "หาทางเดินทางไปและรอบท่าพระจันทร์" garbled. Rewrite: "ดูวิธีเดินทางไปท่าพระจันทร์และในย่านนั้น".
- :86, :89 "รถรับส่ง" vs page title รถเวียน. Rewrite: "เรียนรู้เส้นทางรถเวียน", "รถเวียนฟรี 2 สายจากท่าพระจันทร์".
- :118 "อ่านเรื่องการเงิน" vs page "เรื่องเงิน". Rewrite: "อ่านเรื่องเงิน". :121 "เงินที่ได้รับ" see 3.6.
- :194, :198, :205 "รู้สิทธิและบริการสนับสนุนของคุณ", "ที่คุณมีในฐานะนักศึกษาธรรมศาสตร์", "อ่านเรื่องสิทธิและสวัสดิการของคุณ". Rewrite: "รู้สิทธิและบริการสำหรับนักศึกษา", "สิทธิและบริการที่นักศึกษาธรรมศาสตร์ได้รับ", "อ่านเรื่องสิทธิและสวัสดิการนักศึกษา".
- :233 "วิธีเริ่มรู้จักคนและเข้าร่วมกิจกรรมในช่วงแรกที่ BIR" Rewrite: "ทำความรู้จักเพื่อนและเข้าร่วมกิจกรรมในช่วงแรกที่ BIR".
- :258 "บันไดองค์กรนักศึกษาแบบเลือกตั้งที่ลงคะแนนหรือลงสมัครได้" "บันได" is a literal ladder. Rewrite: "องค์กรนักศึกษาที่มาจากการเลือกตั้งทุกระดับ ตั้งแต่ BIRSA ถึงมหาวิทยาลัย ลงคะแนนและลงสมัครได้".
- :288 "ข้อกังวล" calque of "concern". Rewrite: "ส่งข้อความถึงกรรมการโดยตรงเมื่อมีคำถามหรือเรื่องที่ไม่สบายใจ".
- :300 "การเลือกวิชาเรียนและกติกาที่เกี่ยวกับการสำเร็จการศึกษา" "กติกา" (game rules) vs ระเบียบ/เกณฑ์. Rewrite: "วิธีเลือกวิชาเรียนและเกณฑ์การสำเร็จการศึกษา".
- :325 "โครงสร้างรายวิชาทั้งหมดและหน่วยกิตรวม 127 หน่วยกิต" "หน่วยกิต" twice. Rewrite: "โครงสร้างรายวิชาทั้งหมดและจำนวนหน่วยกิตรวม 127 หน่วยกิต ของหลักสูตร BIR ฉบับปรับปรุง พ.ศ. 2566" (or "รวม 127 หน่วยกิต").
- :346 "เอกสารสามฉบับ" house rule is Arabic numerals. Rewrite: "เอกสาร 3 ฉบับ ได้แก่ ...".
- Pattern: 12 tasks begin "อ่านเรื่อง..." (mirrors "Read about"). Acceptable in a checklist but vary where the action is really "ดู" or "เข้าไปดู".

## 4. Thai style guide for this site (derived from the problems above)

1. **Pick one voice: polite, neutral, subject dropped.** No คุณ, no น้อง, no particles. Bad "คุณสามารถขอผ้าอนามัยฟรีได้ที่แต่ละคณะ" Good "ขอผ้าอนามัยฟรีได้ที่แต่ละคณะ".
2. **Match heading and body register.** Headings are short noun or verb phrases, not spoken questions. Bad "ไปมหาลัยยังไงดี" over formal text; Good "การเดินทางไปท่าพระจันทร์".
3. **Say มหาวิทยาลัย, or มธ. before a campus name; never มหาลัย.** Bad "จอดรถในมหาลัย" Good "จอดรถในมหาวิทยาลัย".
4. **Verb before noun: cut การ/ความ/ทำการ/มีความ/ในการ.** Bad "การเข้าชมรมเป็นช่องทางหนึ่งในการรู้จักนักศึกษา" Good "เข้าชมรมแล้วจะได้รู้จักเพื่อนนอกกลุ่มเรียน".
5. **Bare verb instead of สามารถ...ได้.** Bad "นักศึกษาสามารถแต่งชุดไปรเวทได้" Good "นักศึกษาแต่งชุดไปรเวทได้".
6. **Name the actor; avoid passive and มีการ.** Bad "จะไม่มีการปรากฏคำนำหน้านามบนบัตร" Good "บัตรนักศึกษาจะไม่พิมพ์คำนำหน้านาม". Passive with ถูก stays only for genuinely bad events (ถูกล่วงละเมิด, ถูกขโมย).
7. **One idea per sentence; break run-ons with a list or table, not more spaces.** Bad the 95 word insurance sentence (health:34) Good five bullets.
8. **Do not describe the page or the widget.** Bad "หน้านี้ครอบคลุมเรื่องสิทธิและสวัสดิการ...", "แต่ละป้ายเป็นการ์ดที่กดเปิดหรือปิดได้..." Good say the fact, or nothing.
9. **Drop "For X, see Y" as สำหรับ...ดูที่.** Bad "สำหรับส่วนลด...ดูที่ [เรื่องเงิน]" Good "ส่วนลดดูที่ [เรื่องเงิน]".
10. **Use the Thai collocation, not the English one.** Bad "ภาวะหมดพลัง", "เปิดสั้นกว่า", "ตกรอบ", "เงินพิเศษ", "กินได้หลายคน", "เทียบเป็นมื้ออาหารเต็มมื้อ" Good "หมดไฟ", "ปิดเร็วกว่า", "มาช้า", "เงินสนุก", "ไปกินกันได้หลายคน", "ถ้าซื้อเป็นมื้อ".
11. **Loanwords: Thai script for common words, Latin for product and organisation names.** Good "ออนไลน์", "โน้ตบุ๊ก", "แอป", "ไลน์" or LINE (one only); Latin for TU Greats, BIRSA, Viabus, TU-GET. Bad "Onsite", "Notebook, iPad," (Latin comma), "TU Greats App".
12. **Use one name per thing (see table 1.2).** รถเวียน, รถเมล์, อาคารกิจกรรมนักศึกษา, ศูนย์ท่าพระจันทร์, แสดงบัตร, อมธ. with a space after the full stop.
13. **No colons, no dashes, no hyphen as dash.** Bad "Facebook: อมธ.", "ศิริราช-วังหลัง", "หมอชิต - มธ.รังสิต" Good a two column table; "ศิริราช (ท่าวังหลัง)"; "รถตู้สายหมอชิต มธ.รังสิต". Clock times stay "09.00 น." (dot form) except where a colon time is the source's own.
14. **Spacing.** Space before ๆ ("ต่าง ๆ"), space between a Thai word and a following Latin or numeral group only where it aids reading ("ชั้น 2", "125,000 บาท"), a space after every abbreviation full stop ("อมธ. ท่าพระจันทร์", "มธ. รังสิต"), and one Prettier check per edited Thai file for a stranded ๆ or line starting with a dependent vowel.
15. **Cut rationale and reassurance unless it carries a fact.** Bad "การขอความช่วยเหลือไม่ใช่ความอ่อนแอ", "การเรียนต้องมาก่อนเสมอ", "เป็นทางเลือกที่เหมาะสมเสมอ" Good the action and the number to call. Put dated facts (1 ตุลาคม) in a table with the year so they can be removed cleanly.
