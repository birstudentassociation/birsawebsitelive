# How to write a news post

This is the rule for everything under `content/news/en/` and `content/news/th/`. It covers news
posts and events, the two `type` values that folder holds.

It sits on top of the general voice rules in [EDITING.md](EDITING.md), which apply to all content.
Where this file is more specific, follow this file.

The short version:

- English is written to **GOV.UK content standards**: plain, front-loaded, active, one idea per
  sentence.
- Thai is **written in Thai**, not translated from the English. It should read as a competent Thai
  announcement written by someone who never saw the English version.
- Neither version leans on a colon to hold a sentence together.

---

## 1. Both languages, before anything else

**Write the two versions from the facts, not from each other.** Open the source (the Instagram
post, the Registrar PDF, the Marine Department notice), and write each language from it directly.
The moment one version is produced by rendering the other sentence by sentence, both get worse: the
English inherits Thai sentence shapes, and the Thai inherits English grammar.

The two versions must agree on:

- every fact, date, time, price, room number, eligibility rule and link
- the `slug`, `date`, `type`, `category` and `links` frontmatter
- the running order of the sections

They do not have to agree on wording, heading text, sentence count, or which sentences carry which
facts. A Thai heading that reads well is worth more than a Thai heading that matches the English
word for word.

**Never trade a fact for tone.** Cutting a sentence because it was fluff is correct. Cutting a
sentence that carried a deadline is not.

---

## 2. English: writing to GOV.UK standards

The reference is the [GOV.UK style guide](https://www.gov.uk/guidance/style-guide) and
[Writing for GOV.UK](https://www.gov.uk/guidance/content-design/writing-for-gov-uk). What follows
is the part of it that applies to this site, plus the places we deliberately go further.

### 2.1 Front-load everything

Put the thing the reader needs first: in the title, in the summary, in each section, and in each
sentence. A reader who stops after the title should still know what happened.

```
Bad   Express boat and the Tha Phra Chan ferry: the river closes on three August afternoons
Good  The river to campus closes on three August afternoons
```

```
Bad   BIR18 Student Council Election 2026: timeline and how to apply
Good  How to run in the BIR18 Student Council election 2026
```

### 2.2 Titles

- Say what happened or what to do. A title is a statement, not a label with a gloss attached.
- Sentence case, except proper nouns.
- No colon. No em dash or en dash. If a title needs two halves, a comma will do, and usually the
  second half was not needed.
- Aim for about 65 characters so it survives in search results and on a card.
- Do not repeat "BIRSA" or "news" in the title. The reader knows where they are.

### 2.3 Summaries

One or two sentences, and they must work standing alone, because the summary is what appears on
cards, in search results, and in the calendar. Lead with the change, not with the announcement of
the change:

```
Bad   BIRSA has announced the timeline for the BIR18 Student Council election.
Good  BIRSA takes applications for the BIR18 Student Council from 10 to 14 August 2026, names
      the candidates on 16 August, hears policy statements on 19 August, and opens voting on
      24 August.
```

### 2.4 Sentences and paragraphs

- One idea per sentence. Around 25 words is the ceiling.
- Split rather than subordinate. Two plain sentences beat one sentence with a clause hanging off it.
- Paragraphs stay short. If a paragraph is running past five lines, it is usually two paragraphs or
  a list.
- Aim to be understood by a reader who is skimming on a phone between classes, in their second
  language.

### 2.5 Active voice, and name the actor

Passive voice hides who does the thing, which on this site is exactly the information a student
needs, because BIRSA, the Faculty, the Registrar and the University are four different desks.

```
Bad   Registration, payment and add-drop dates for BIR are announced separately by BIRSA.
Good  BIRSA announces BIR's registration, payment and add-drop dates separately.
```

```
Bad   Winners are picked by 19:00.
Good  The judges pick winners by 19:00.
```

```
Bad   ...so expect the cut-off to be observed strictly rather than loosely.
Good  ...Expect them to hold the cut-off strictly.
```

If you cannot name the actor, you probably do not know it yet, and that is worth finding out before
publishing.

### 2.6 The colon rule

This is the one place we are stricter than GOV.UK, which permits a colon on a bullet lead-in line.
News posts here do not use colons at all, except in clock times and URLs. The rule exists because
the colon had quietly become the site's default connector, doing several unrelated jobs at once.

| Colon doing this                                        | Write instead                                  |
| ------------------------------------------------------- | ---------------------------------------------- |
| Splitting a title into topic and gloss                  | One statement                                  |
| Tagging a bullet, `**Advocacy:** Representing students` | A sentence, `Represents BIR18 students and...` |
| Splicing two independent clauses                        | Two sentences                                  |
| Introducing a table or a list                           | End the lead-in with a full stop               |
| Keying a date to an event, `August 12: Mother's Day`    | A two-column table                             |

A bullet list follows a lead-in line that ends in a full stop, or runs on grammatically from the
lead-in with no punctuation at all:

```markdown
Candidates and their parties must not

- threaten, intimidate, or use violence against voters
- give money or gifts to win votes
```

### 2.7 Bullets, steps and tables

Following GOV.UK:

- always use a lead-in line
- start each bullet in lower case when it runs on from the lead-in
- keep to one sentence per bullet
- no semicolons at the end of bullets, no "and" or "or" between them, no full stop after the last one
- use numbered steps, not bullets, for a process the reader works through in order, and end each
  step with a full stop because each step is a full sentence

Bullets that begin with a bold phrase are a different pattern and take a full stop after the bold
phrase, not a colon:

```markdown
- **Cross before 12:30.** The last ferry to Tha Phra Chan leaves at 12:30.
```

**Anything keyed to a date, a time or a deadline goes in a table**, not a bullet list. Calendars,
timelines, exam periods and opening hours are all tables. Two columns is usually right.

### 2.8 Dates, times and numbers

| Thing         | Write                                                                | Not                                        |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------ |
| Date          | `3 August 2026`                                                      | `August 3rd, 2026`, `03/08/2026`           |
| Range         | `10 to 14 August 2026`                                               | `10-14 August`, or an en dash between them |
| Time          | `12:30`, `16:00`                                                     | `12.30pm`, `1230hrs`                       |
| Time range    | `from 12:30 to 15:00`                                                | `12:30-15:00`                              |
| Number        | numerals, including 1 to 9, for anything the reader acts on or scans | `three positions`                          |
| Money         | `500 to 5,000 baht`                                                  | `THB 500-5000`                             |
| Academic year | `AY 2569 (2026/2027)` on first use                                   | `2569` alone in English copy               |

A number stays a word only inside a fixed expression, where numerals would read as a typo ("one or
two of them", "on the other hand").

Years in English copy are Gregorian. Thai Buddhist Era years appear in English only when quoting an
official Thai title or an admission cohort that is itself a BE number, and then with the Gregorian
year alongside on first use.

### 2.9 Words and constructions to avoid

GOV.UK keeps a list of words that sound like activity and carry no information. The ones that turn
up in student-association copy are: _deliver_, _drive_, _foster_, _facilitate_, _empower_,
_robust_, _key_, _overarching_, _going forward_, _utilise_, _leverage_, _collaborate_, _engage_,
_strengthen_, _transform_, _tackle_, _promote_, _ensure_.

Also cut, per EDITING.md:

- self-narration: "this post explains", "below you'll find", "read on"
- rationale padding: "which is useful because...", "that way you..."
- hedging: "it's worth", "in practice", "a good idea", "don't worry"
- filler: "really", "very", "simply", "just", "actually", "basically"

### 2.10 Punctuation and spelling

- **No em dashes or en dashes anywhere.** This is a hard site rule, not a preference. Use a full
  stop, a comma, or two sentences. Hyphens in compounds (`add-drop`, `cross-river`) are fine.
- British spelling: organise, colour, programme, recognisable, favourite.
- Expand negative contractions (do not, cannot, is not). Keep positive ones (you'll, it's, we'll).
- "for example", never "eg" or "ie".
- No ampersands outside proper names.
- Drop "please" unless its absence would read as an order.

### 2.11 Links and abbreviations

- Link text says where the link goes, read on its own: `Read the Registrar's academic calendar`,
  never `click here` or a bare `read more`.
- Front-load the link text with the words the reader is scanning for.
- Spell out an abbreviation the first time it appears **on that page**, even if another page already
  did: `BIR Student Association (BIRSA)`. The reader may have landed here from search.

### 2.12 Where we deviate from GOV.UK, and why

| GOV.UK                         | Here                    | Why                                                                                                |
| ------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------- |
| Colon on a bullet lead-in line | No colons at all        | The colon had become the site's default connector; a flat ban is easier to hold than a nuanced one |
| 12-hour times, `5:30pm`        | 24-hour, `16:00`        | Matches Thai campus notices, timetables and the Thai copy's `16.00 น.`                             |
| UK date and money conventions  | Thai campus conventions | Bangkok context, baht, Thammasat term structure                                                    |

Everything else in the GOV.UK style guide applies as written.

---

## 3. Thai: professional and natural

เป้าหมายคือภาษาไทยที่ **เป็นทางการพอสำหรับประกาศ แต่ยังอ่านลื่นเหมือนคนไทยเขียนเอง** ไม่ใช่ภาษาแปล
และไม่ใช่ภาษาราชการแข็ง ๆ

### 3.1 เขียนใหม่ ไม่ใช่แปล

เขียนภาษาไทยจากข้อเท็จจริงต้นทางโดยตรง อย่าเปิดไฟล์ภาษาอังกฤษแล้วไล่แปลทีละประโยค เพราะโครงประโยคอังกฤษ
จะติดมาทั้งย่อหน้า ประโยคไทยที่ดีมักสั้นกว่า เรียงลำดับต่างจากอังกฤษ และยุบสองประโยคอังกฤษเป็นประโยคเดียวได้

ข้อทดสอบง่าย ๆ คือ อ่านออกเสียงแล้วฟังเหมือนประกาศของคณะหรือของมหาวิทยาลัยไหม ถ้าฟังเหมือนคำบรรยายใต้ภาพ
ที่แปลมา ให้เขียนใหม่

### 3.2 น้ำเสียง

- เป็นทางการระดับประกาศนักศึกษา สุภาพ กระชับ เป็นกลาง
- ไม่ใส่ ครับ/ค่ะ ไม่ใช้ภาษาแชท ไม่ประชด ไม่หยอกผู้อ่าน (ดูหัวข้อ "Thai: no sarcasm" ใน EDITING.md)
- เนื้อหาที่ต้นทางเป็นงานสนุก เช่น กิจกรรมแต่งตัวตามธีม เขียนให้มีชีวิตชีวาได้ แต่ยังต้องเป็นภาษาเขียน
- เลี่ยงภาษาราชการที่ไม่จำเป็น เช่น ทั้งนี้ อนึ่ง ดังกล่าว แต่อย่างใด อย่างไรก็ตาม

### 3.3 ประธานของประโยค และรูปถูกกระทำ

ภาษาไทยไม่นิยมรูปถูกกระทำแบบอังกฤษ `ถูก` มักสื่อความหมายในทางลบ ส่วน `ได้รับการ` และ `โดย` ที่ห้อยท้าย
ประโยคเป็นร่องรอยของการแปล วิธีแก้คือ **เอาผู้กระทำขึ้นต้นประโยค**

| อย่าเขียน                               | เขียนว่า                                     |
| --------------------------------------- | -------------------------------------------- |
| กำหนดการ...ประกาศแยกต่างหากโดย BIRSA    | BIRSA จะประกาศกำหนดการ...แยกต่างหาก          |
| TPC Crazy Week จัดโดยองค์การนักศึกษา... | องค์การนักศึกษา... เป็นผู้จัด TPC Crazy Week |
| ผู้ชนะจะถูกประกาศเวลา 19.00 น.          | กรรมการจะประกาศผู้ชนะเวลา 19.00 น.           |

### 3.4 คำและรูปประโยคที่ส่อว่าแปลมา

| อย่าเขียน              | ทำไม                                | เขียนว่า                              |
| ---------------------- | ----------------------------------- | ------------------------------------- |
| นี่คือกำหนดการที่...   | ลอกรูป "Here are the dates"         | ด้านล่างนี้คือกำหนดการ... หรือตัดทิ้ง |
| ควรคาดหมายว่า...จะ...  | ลอกรูป "expect ... to be ..."       | บอกข้อเท็จจริงตรง ๆ                   |
| สีที่บอกตัวตนของคุณ    | `ของคุณ` มาจาก "your" ภาษาไทยละได้  | สีที่บอกตัวตนได้มากที่สุด             |
| ทำการลงทะเบียน         | `ทำการ` เป็นคำเติม                  | ลงทะเบียน                             |
| มีความจำเป็นต้อง       | เปลี่ยนคำกริยาเป็นคำนามโดยไม่จำเป็น | ต้อง                                  |
| สามารถ...ได้ ทุกประโยค | ใช้ถี่เกินจนอ่านเยิ่นเย้อ           | ใช้คำกริยาเปล่า ๆ                     |
| อยู่รอดตลอดวัน         | แปลตรงจาก "survives a day"          | ทนอยู่ได้ทั้งวัน                      |
| ...แต่อย่างใด          | ภาษาราชการ                          | ...เลย                                |

### 3.5 คำศัพท์ทางการที่ต้องคงไว้

ศัพท์ของหน่วยงานให้ใช้ตามต้นฉบับ ห้ามแปลง่าย ๆ ให้เข้าใจง่ายขึ้นเอง เพราะนักศึกษาต้องเอาคำนี้ไปค้นต่อ
และไปติดต่อหน่วยงานจริง

ตัวอย่าง สำนักทะเบียน, ลงทะเบียนล่าช้า, เพิ่ม-ถอนรายวิชา, บันทึกอักษร W, ตามอำนาจคณบดี,
แจ้งขอสำเร็จการศึกษา, ภาคฤดูร้อน, พื้นที่ควบคุมการเดินเรือเป็นการเฉพาะคราว, ขบวนพยุหยาตราทางชลมารค

เนื้อหาที่เกี่ยวข้องกับสถาบันพระมหากษัตริย์ ให้คัดถ้อยคำจากประกาศต้นทางมาใช้ อย่าเรียบเรียงราชาศัพท์เอง

### 3.6 ตัวเลข วันที่ และเวลา

| สิ่งที่เขียน | เขียนว่า               | ไม่ใช่                  |
| ------------ | ---------------------- | ----------------------- |
| ตัวเลข       | เลขอารบิก 1 2 3        | เลขไทย ๑ ๒ ๓            |
| ปี           | พุทธศักราช เช่น 2569   | 2026 ในเนื้อความภาษาไทย |
| วันที่       | 3 สิงหาคม 2569         | 2569-08-03              |
| ช่วงวัน      | 10 ถึง 14 สิงหาคม 2569 | 10-14 ส.ค. 69           |
| เวลา         | 12.30 น.               | 12:30                   |

ข้อยกเว้นเรื่องปี คือ **ชื่อเฉพาะให้คงปีตามเจ้าของชื่อ** เช่น งาน `TPC Firstmeet 2026` และ
`TPC Crazy Week 2026` ใช้ 2026 เพราะเป็นชื่องาน ส่วนวันที่ในเนื้อความยังเป็น พ.ศ. ตามปกติ

### 3.7 การเว้นวรรคและการพิมพ์

- ภาษาไทยไม่มีเครื่องหมายจุลภาค ใช้ **การเว้นวรรค** แบ่งความ แต่อย่าเว้นวรรคถี่จนประโยคขาดเป็นท่อน
- เว้นวรรคหน้า ๆ เสมอ เช่น `ต่าง ๆ` `ครึ่ง ๆ กลาง ๆ` ไม่ใช่ `ต่างๆ`
- ห้ามใช้ em dash และ en dash เช่นเดียวกับภาษาอังกฤษ
- ไม่ต้องใส่เครื่องหมายคำถามท้ายหัวข้อที่เป็นคำถาม ยกเว้นในกล่อง Notice ที่ตั้งใจให้เป็นคำถามกับผู้อ่าน
- คำทับศัพท์ที่มีคำไทยใช้อยู่แล้ว ให้ใช้คำไทย ส่วนชื่อเฉพาะ เช่น BIRSA, Instagram, MRT คงรูปอังกฤษ

### 3.8 การตัดบรรทัด

Prettier ตัดบรรทัดที่ 100 ตัวอักษร ภาษาไทยไม่มีช่องว่างระหว่างคำ จึงต้องตรวจว่าจุดตัดบรรทัดตกลงตรง
ช่องว่างที่เป็นการแบ่งความจริง ๆ ไม่ใช่กลางคำ อ่านไฟล์อีกครั้งหลังรัน `npx prettier --write` ทุกครั้ง

---

## 4. Before publishing

- [ ] The English reads as English and the Thai reads as Thai, and neither is a rendering of the
      other.
- [ ] No colons outside clock times and URLs.
- [ ] No em dashes or en dashes in either file.
- [ ] Every date-keyed list is a table.
- [ ] Every passive sentence either names the actor or has been rewritten.
- [ ] The title states what happened, in sentence case, with no colon.
- [ ] The summary stands alone on a card.
- [ ] Dates, times, numbers and years follow the tables above, in the right convention per language.
- [ ] Official terminology is quoted, not paraphrased.
- [ ] Both files have the same slug, date, type, category, links, and the same facts.
- [ ] `npx prettier --write content/news` then re-read the Thai file for bad line breaks.
- [ ] `npm run test` passes.

---

## 5. Worked examples

The five posts dated 1 to 13 August 2026 were rewritten against this rule and are the reference:

- `express-boat-royal-barge-rehearsals-august-2026` for a factual notice with tables and a source
  document
- `bir18-student-council-election-2026` for a process with eligibility, rules and a deadline
- `tpc-crazy-week-2026` for a lively event that still holds the register
- `academic-calendar-2569` and `august-2026-activity-calendar` for date-keyed tables

Posts older than those still contain colon-keyed lists and em dashes. Bring a post up to this rule
when you next edit it, rather than in a separate sweep.
