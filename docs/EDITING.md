# Editing BIRSA Portal content

**สรุปสั้น ๆ (อ่านก่อน):** เนื้อหาทุกภาษาต้องเขียนขึ้นใหม่โดยคนที่ใช้ภาษานั้นจริง ๆ
**ห้ามแปลตรงตัว** ระหว่างไทย-อังกฤษ ทั้งสองเวอร์ชันต้องใช้ **slug เดียวกัน** (ชื่อไฟล์ภาษาอังกฤษ
แบบ kebab-case) เพื่อให้ระบบจับคู่หน้าได้ถูกต้อง เนื้อหาที่ยังไม่ใช่ข้อมูลจริงต้องติดป้าย
`placeholder: true` และมีกล่อง Notice แจ้งผู้อ่านเสมอ ก่อนเผยแพร่จริงให้ตรวจสอบตามเช็กลิสต์
"Going live" ด้านล่างทุกครั้ง

This guide is for whoever on the BIRSA committee is adding or updating content on the portal.
No coding knowledge is required beyond editing text files. A few rules keep the two
language versions correct and keep the site's automated checks (`npm run test`) passing.

## The golden rules

1. **Same slug in both locales.** Every news post, service guide, about page, or student-life
   entry has an English kebab-case filename (e.g. `freshers-orientation-2026.mdx`). The Thai and
   English versions of the same piece of content **must use the identical filename** in their
   respective `en/` and `th/` folders; that's how the site matches them up and builds the
   language toggle correctly.
2. **Never machine-translate.** Write the Thai version for Thai readers and the English version
   for English readers, independently. They should cover the same facts, but the wording,
   structure, and examples can differ where that reads more naturally in each language. See the
   voice notes below.
3. **Mark placeholder content clearly.** If you don't yet have the real information (a committee
   member's name, an exact date, a room number), write something plausible but obviously
   temporary, add `placeholder: true` to the frontmatter (where the content type supports it),
   and add a `<Notice variant="placeholder">` at the top of the page saying it's example content.
4. **Never invent real people's names.** Use role titles instead, like "President" or "Head of Student
   Welfare", never a made-up name for a real person.

## Adding a news post or event

News posts and events live in `content/news/en/<slug>.mdx` and `content/news/th/<slug>.mdx`.
Create both files with the **same `<slug>.mdx` filename**.

**Read [NEWS-STYLE.md](NEWS-STYLE.md) before writing one.** It is the authoring rule for this
folder: how the English is written to GOV.UK standards, how the Thai is written natively rather
than translated, and the checklist to run before publishing. This section covers the file shape
only.

### News frontmatter template

```mdx
---
title: "Your headline here"
summary: "One sentence summarising the post, shown on cards and in search results."
date: 2026-08-01
type: news
category: announcements
---

<Notice variant="placeholder">
  Example content. BIRSA will replace this with real announcements.
</Notice>

Write the body of the post here in plain Markdown. Use `##` for section headings if the post
is long enough to need them.
```

### Event frontmatter template

Events use `type: event` and add `location`, `start`, and `end` (an ISO datetime, with
Bangkok's `+07:00` offset):

```mdx
---
title: "Event name"
summary: "One sentence describing the event."
date: 2026-08-01
type: event
category: events
location: "Faculty of Political Science, Tha Prachan"
start: 2026-08-10T09:00:00+07:00
end: 2026-08-10T16:00:00+07:00
---

Body copy here.
```

Optional fields for either type:

- `links`: an array of `{ label, href }` for related links (e.g. a registration form).
- `placeholder: true`: add this while the post is still example content.
- `updated`: the date you corrected or changed a post after publishing it, as `YYYY-MM-DD`. Leave
  `date` as it was.
- `metaDescription`: the text shown under the title in search results, when the `summary` is
  too long or too short for it (see [Search results](#search-results)).

Remove the `<Notice variant="placeholder">` line and the `placeholder: true` frontmatter field
once the post is real.

### The activity calendar

There is one calendar post, `activity-calendar.mdx`, at the fixed URL `/news/activity-calendar`.
Do not start a new post each month. At the start of each month:

1. Add a `## Month year` section with that month's table above the previous month.
2. Add the month's Instagram post to `links`, newest first.
3. Set `date` to the first of the month so the post moves to the top of What's on.
4. Point any new entries in `content/calendar/events.ts` at the `activity-calendar` slug.

Old monthly URLs such as `/news/august-2026-activity-calendar` redirect here permanently.

### Past events

An event post (`type: event` with a `start`) looks after itself once it is over:

- after its `end` (or `start`), the page shows "This event has ended" and links to the activity
  calendar
- a year after that, the page stays online but is hidden from search engines and left out of the
  sitemap

Pages regenerate at least once a day, so both happen without a new deploy.

At the start of each semester, review the news posts from the semester before. Correct anything
that has changed. If a post is wrong and cannot be fixed, delete it from both `en/` and `th/` and
add a permanent redirect in `next.config.mjs` to the page that replaced it, or to `/news`.

## Search results

Every page's `<title>` and description are fitted to what search engines display, following the
[GOV.UK SEO best practice guide](https://www.gov.uk/government/publications/search-engine-optimisation-for-publishers-best-practice-guide/search-engine-optimisation-seo-for-data-publishers-best-practice-guide).
`lib/seo.ts` does this automatically.

- **Titles** get ` | BIRSA` added when the result still fits in 60 characters. Longer titles are
  cut at a word and end in `…`, so put the most important words first.
- **Descriptions** come from `summary` (or `tagline` for clubs). Anything over 160 characters is
  cut after the last whole sentence that fits, or at a word. Aim for 70 to 160 characters.
- News posts, activity pages, guides and clubs accept an optional `metaDescription` in
  frontmatter. Use it when the summary reads badly once cut, or is too short to describe the
  page. Write it as full sentences, never a list of keywords.

`tests/unit/seo.test.ts` fails if two pages in the same language share a title or description.

## Editing clubs

Clubs are **not** MDX files; they're a single typed list in `content/clubs/clubs.ts`. Find the
club you want to edit (or copy an existing entry as a starting point for a new one) and update
these fields:

| Field                 | Notes                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`                 | Internal identifier: lowercase, hyphenated. Does not need to match anything visible.                                                                                     |
| `slug`                | The URL segment (`/clubs/<slug>`): English kebab-case, must be unique.                                                                                                   |
| `category`            | One of `academic`, `sports`, `arts`, `community`, `social`.                                                                                                              |
| `placeholder`         | `true` while this is example content; set to `false` once BIRSA confirms it's real.                                                                                      |
| `email` / `instagram` | Optional contact details: omit the field entirely if the club does not have one.                                                                                         |
| `join.open`           | Whether the club is currently open to new members.                                                                                                                       |
| `en` / `th`           | Each has `name`, `tagline`, `description` (an array of 2 to 3 paragraph strings), `meets` (optional), `lead` (a **role title**, never a person's name), and `howToJoin`. |

Every club needs **both** an `en` block and a `th` block, written natively (not translated).
Keep `slug` values unique across the whole file; the content test suite checks this.

## Committee roster and portraits

The committee roster shown on the "What is BIRSA?" about page (`content/about/{en,th}/birsa.mdx`,
rendered via the `<CommitteeRoster />` component) comes from a single typed file:
`content/committee.ts`. It is **not** MDX; edit the array directly.

### Editing `content/committee.ts`

Each entry in the `committee` array is one person, with these fields:

| Field       | Notes                                                                                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`       | Unique, lowercase, hyphenated identifier (e.g. `chayapon-srisukho`). Also doubles as the portrait filename stem, see below. Do not change an existing member's `key` casually, since it's tied to their photo filename. |
| `group`     | Either `"officer"` (core committee) or `"assistant"` (assistant officers).                                                                                                                                              |
| `en` / `th` | Each has `firstName`, `lastName`, `nickname`, and `title`, all required, written in that language.                                                                                                                      |

To add a new committee member, copy an existing entry as a template, give them a unique `key`,
and fill in both the `en` and `th` blocks. To remove someone, delete their entry. To update a
title after a re-shuffle, just edit the `title` field in both `en` and `th`.

Group headings ("Officers" / "Assistant Officers" and their Thai equivalents) come from
`committeeGroupLabels` in the same file; edit those if the group names themselves change.

**Never add an email address or student ID to this file.** The roster is public-facing, and
`tests/unit/content.test.ts` checks that no entry contains one.

### Adding a portrait photo

Portraits are optional. Any committee member without a photo automatically gets a neutral
placeholder icon, so there's no rush to have photos for everyone before publishing an update.

To add or replace a photo:

1. Crop the photo to a square, ideally at least 640×640px.
2. Keep the file size small: aim for under ~300 KB (re-export/compress if needed).
3. Name the file **exactly** `<key>.<extension>`, matching the member's `key` in
   `content/committee.ts`, e.g. `chayapon-srisukho.jpg`. Accepted extensions: `.webp`, `.jpg`,
   `.jpeg`, `.png` (checked in that order if more than one exists for the same key).
4. Drop the file into `public/committee/`.
5. Commit and push. No code changes are needed. The site picks up the photo automatically on
   the next build; if the file is missing or misnamed, that member just keeps showing the
   placeholder icon instead of erroring.

## Quick actions (`content/quick.ts`)

`content/quick.ts` powers the `/quick` page, BIRSA's "link in bio" page. It's organised into
`quickGroups`, each with a heading and a list of `items`. Each item needs `key`, `href` (an
internal path like `/activity/roles`, or a full external URL with `external: true`), an
`icon` (pick from the existing `QuickIcon` union), and `en`/`th` blocks with a `label` and
optional `hint`. Set `placeholder: true` on an item if the destination isn't real yet (e.g. a
social channel that doesn't exist).

## Checks (`content/smart-answers/`)

There are three checks, each hosted on the page it belongs to rather than in a section of its
own:

| Check (`slug`)      | Lives at                   |
| ------------------- | -------------------------- |
| `activity-approval` | `/activity/approval-check` |
| `club-readiness`    | `/clubs/start-check`       |
| `where-to-go`       | `/contact/where-to-go`     |

A check is a door into one graph, not a separate quiz. Topic files under
`content/smart-answers/topics/` each export `{ topics, nodes }`, and
`content/smart-answers/index.ts` concatenates them into a single service, so a question in one
file can send someone to an outcome in another. Each topic has a `path` (the page that hosts it),
a `title`, a `lede`, a `start` node and search `keywords`. Every question is a plain GET form on
that page and the answers so far ride in the `?a=` query parameter, so there is no profile and no
stored state.

A new check is only justified when the answer genuinely depends on the reader's answers. If
everyone should get the same advice, write or extend a guide under `content/student-life/` instead.

To add or change a check:

- **Nodes** are either a `question` (an id, a bilingual question, and at least two options) or
  an `outcome` (a title, a summary, and at least one action, related page, or citation). Give
  every id a prefix matching its area (`q-money-…`, `out-money-…`) so files cannot collide.
- **Citations** are `/activity/regulations/<doc-slug>#prov-<N>`. The provision number must
  really exist: a unit test checks every citation against the regulation documents and fails
  the build if one does not.
- **Never invent a procedure.** If the regulations and guides do not cover the case, point the
  option at `out-not-covered`, which tells the reader plainly that there is no rule on file and
  sends them to a human. This is a rule, not a fallback of last resort.
- **`owner`** says who actually decides, whenever it is not BIRSA. Use it. BIRSA is a student
  association, and an answer that quietly implies otherwise sends people to the wrong desk.
- **A new check needs a home.** Set its `path` to the page it belongs to, add a route there that
  renders `CheckFlow`, and link to it from that section's index.

`npm run test` validates the whole graph: dangling links, unreachable nodes, cycles, questions
that could leave a reader with nothing to choose, missing Thai or English, and em dashes.

## BIRSA activity and student-life guides

BIRSA activity (`content/activity/{en,th}/<slug>.mdx`) and student-life guide entries
(`content/student-life/{en,th}/<topic>/<slug>.mdx`) share a similar frontmatter
shape. As with news, create matching `<slug>.mdx` files in both locale folders.

### BIRSA activity frontmatter template

```mdx
---
title: "Activity entry title"
summary: "One sentence shown on the activity hub."
order: 1
updated: 2026-08-01
---

Body copy in Markdown, using `##` headings to break up longer entries.
```

`order` controls the sort position (lower numbers first).

### Student-life guides

Guides are grouped by task into nine topics, not by audience. The topic is the folder name and
the second URL segment (`/student-life/<topic>/<slug>`). Slugs are English kebab-case and the
filename is identical in `en/` and `th/`. Titles, summaries, `keyQuestions` and `quickAnswers`
are written natively in each language, never translated line by line.

| Topic folder        | English title     | Thai title               |
| ------------------- | ----------------- | ------------------------ |
| `before-you-arrive` | Before you arrive | ก่อนเข้าเรียน            |
| `first-weeks`       | Your first weeks  | ช่วงสัปดาห์แรก           |
| `studying`          | Studying          | การเรียน                 |
| `money`             | Money             | การเงิน                  |
| `health-and-safety` | Health and safety | สุขภาพและความปลอดภัย     |
| `getting-around`    | Getting around    | การเดินทาง               |
| `living-nearby`     | Food and housing  | อาหารและที่พัก           |
| `getting-involved`  | Getting involved  | กิจกรรมและองค์กรนักศึกษา |
| `rules-and-rights`  | Rights and rules  | สิทธิและกฎระเบียบ        |

```mdx
---
title: "Registering, adding and dropping courses"
summary: "One sentence shown on the topic page and as the lede."
metaDescription: "Optional, 120 to 160 characters."
topic: studying # must equal the folder name
order: 1 # position within the topic
updated: 2026-09-30 # date the file was edited
reviewed: 2026-09-30 # date the facts were last checked against their sources
audience: all # all | international | thai (default all); shown as a tag, not a route
owner: "Registrar's Office and the BIR office" # who sets these rules, in the page language
keyQuestions: # 2 to 5 short questions the guide answers
  - "When is the add and drop deadline?"
quickAnswers: # optional, 2 to 4; shown in a box at the top
  - q: "How many credits can I take?"
    a: "Up to 22 a semester and 6 in summer."
    anchor: "credit-limits" # id of a ## or ### heading in this file
related: # 1 to 4 other guides, "topic/slug"
  - "studying/low-gpa"
sources: # official pages the facts come from; replaces a "Source" heading
  - label: "TU Regulation on Undergraduate Studies B.E. 2568"
    href: "https://db.legal.tu.ac.th/05010201-01/"
aliases: # optional search words, such as old slugs
  - "academic-life"
---

Body copy in Markdown. Headings start at `##`; the title is the page's h1.
```

Rules for guides:

- **One home per fact.** Each fact lives in one guide. Other guides link to it with a normal
  link such as `/student-life/money/monthly-costs` instead of repeating it. Emergency numbers
  link to `/emergency`.
- **Colon rule.** As in news, no colons outside clock times and URLs, in headings, labels, list
  introductions and frontmatter, in both languages. No em or en dashes.
- **Anchors.** Every `quickAnswers.anchor` must match a heading id generated from the heading
  text (lowercase, spaces to hyphens, punctuation removed, Thai kept). A test checks this.
- **Related and moved guides.** `related` entries must exist. When a guide is renamed or moved,
  add the old path to `lib/student-life-redirects.mjs` (a test checks each destination exists)
  and the old slug to `aliases`.
- **Reviewing.** Update `reviewed` when the facts are checked, and `updated` when the file is
  edited. The page shows both.
- Thai follows the register rules earlier in this document. After editing Thai files, run
  `npx prettier --write content/student-life` and re-read them for line breaks inside dates,
  numbers or phrases.

Both activity and student-life entries accept an optional `placeholder: true`.

## Placeholder flag and Notice removal checklist (going live)

Before telling students a piece of content is final, go through this checklist:

- [ ] Remove `placeholder: true` from the frontmatter (news, activity, student-life, and each
      relevant `clubs.ts` entry).
- [ ] Remove any `<Notice variant="placeholder">…</Notice>` block from the MDX body.
- [ ] Replace any obviously generic names, dates, room numbers, or links with the real details.
- [ ] Check both the Thai and English versions were updated, not just one.
- [ ] Re-run `npm run test` locally (or check the next deploy) to confirm the content still
      passes validation (a required field can't be blank, dates must be `YYYY-MM-DD`, etc.).
- [ ] For a form: every input has a label or legend, every error message is calm rather than
      jokey, and no page title, heading, or URL for that flow contains a real person's name,
      student ID, or other personal data.

## Voice and language

These rules apply to all content. News posts and events have a fuller rule of their own in
[NEWS-STYLE.md](NEWS-STYLE.md), which builds on this section.

- **Write natively, not by translating.** The Thai and English versions should read like two
  people who each know their own audience wrote them, not like one was run through a
  translator.
- **English**: plain, direct, neutral. Short sentences, active verbs, sentence case even in
  headings. "You" is the student, "we" is BIRSA. Aim for GOV.UK guidance prose: factual and
  unhurried, with no warmth performed at the reader.
  - No em dashes or en dashes anywhere, including code comments. Use a full stop, a comma, or
    two sentences instead. This is a hard rule: the content test suite fails the build on
    either dash character.
  - Ranges use "to": "June 15 to 25", not "June 15-25".
  - British spelling throughout: organise, colour, licence (noun), defence, programme.
  - Expand negative contractions (do not, cannot, is not); keep positive ones (you'll, it's,
    we'll). "Do not" reads as an instruction; "don't" reads as reassurance, which is not the
    register this site writes in.
  - Drop "please" except where its absence would read as an order rather than a request (for
    example, asking someone to bring a document is fine without it).
- **Thai**: เขียนใหม่สำหรับผู้อ่านไทยโดยตรง ไม่แปลตรงตัวจากอังกฤษ น้ำเสียงเป็นทางการ สุภาพ กระชับ
  และเป็นกลาง ใช้ "คุณ" กับผู้อ่านหรือละสรรพนามไปเลยเมื่ออ่านแล้วเป็นทางการกว่า (อย่าใช้ "ท่าน")
  เลี่ยงน้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง และเลี่ยงภาษาราชการแข็ง ๆ อย่าง "ทั้งนี้ อนึ่ง ดังกล่าว"
  เลี่ยงทับศัพท์ที่ไม่จำเป็น (คำเฉพาะอย่าง BIRSA, TU Greats, Resend คงรูปอังกฤษได้) ตัวเลขใช้เลขอารบิก
  ห้ามใช้เครื่องหมาย em dash หรือ en dash เช่นกัน ใช้จุด จุลภาค หรือแยกประโยคแทน ส่วนคำว่า
  กรุณา/โปรด ยังคงใช้ได้ตามความเหมาะสม เพราะภาษาไทยไม่มีกฎเรื่อง "please" หรือรูปย่อแบบภาษาอังกฤษ

### The one test to apply to every sentence

Does this sentence deliver a fact the reader needs, or does it describe, justify, or soften the
facts around it? If it is the second kind, delete it. If a sentence does both, keep only the fact.

**Do not write text that talks about itself.** Cut anything in these families:

- Self-narration and mission-framing: "At the core, BIRSA exists to be...", "We do this mostly
  by starting things", "that is all part of the same job".
- Meta-commentary about the page or site: "this page explains", "below you'll find", "here's
  what you need to know", "read on", "this is where you will find guidance". A genuine pointer
  to _another_ page is fine and should stay.
- Rationale padding tacked onto a fact: "...so neither side is guessing what the other needs",
  "which is useful because...", "that way you...".
- Hedging and editorialising: "is a reasonable first step", "it's worth", "in practice",
  "a good idea", "don't worry", "the good news is", "it's simpler than you'd think".
- Chatty scaffolding: "That said,", "Of course,", "Think of it as", "The short answer is",
  and rhetorical questions used as openers or headings.
- Filler intensifiers: "really", "very", "simply", "just", "actually", "basically".

Recruitment-pitch voice is the same failure in club and event copy. "Whether you're a total
beginner or a seasoned player, there's a place for you" is a fact about who may join, buried in
a sales line. Write the fact: "Open to players at any level."

### Thai: no sarcasm

Thai copy must not land as a dig at anyone or as a knowing wink at the reader. Watch for:

- "กันเอง" / "เอง" used to imply insularity or blame
- "ก็แค่", "ก็เท่านั้น", "นั่นแหละ", "ซะ", "เสียที", "จริง ๆ" used as emphasis
- Rhetorical questions, "ไม่ต้องห่วง", "อย่าเพิ่งตกใจ", "เชื่อเถอะ"
- Irony or understatement: "ก็ไม่ได้แย่ขนาดนั้น", "เท่าที่ควร" used snidely
- Chatty softeners: "ก็", "นะ", "ล่ะ", "เลย" as filler, "แบบว่า", "ประมาณว่า"

Any sentence a reader could hear in a raised eyebrow needs rewriting. State the function or the
procedure plainly instead. Do not add ครับ/ค่ะ.

### Never trade a fact for tone

This is a tone standard, not a licence to cut content. Dates, times, venues, prices, phone
numbers, eligibility rules, and links always survive. If a sentence's only content was fluff,
delete it; never replace it with invented substance. Keep attributed claims attributed: if a club
"calls itself the biggest music club in BIR", do not promote that to a flat statement of fact.

### Writing for forms, buttons, and errors

These rules cover interface copy specifically: labels, buttons, links, help text, and error and
validation messages. Some are English-only, marked below, since Thai has no letter case and its
own contraction and abbreviation conventions already covered above.

- **Sentence case everywhere except proper nouns** (English only; Thai has no letter case).
  Headings and input labels are sentence case and take no full stop. A heading phrased as a
  question keeps its question mark, for example "What is your name?": the mark is not decoration,
  it is what makes the heading grammatical. This carve-out is English-only; Thai does not
  conventionally punctuate questions with a question mark, so Thai headings stay as written. Other
  copy is full sentences ending in a full stop.
- **Say "sorry" only when something has genuinely gone wrong technically.** A 500-style error
  page or a failed submission can apologise. An ordinary validation message ("Enter your email
  address") never does: the reader has not been wronged, they just missed a field.
- **Never use humorous error messages.** Aim to be boring. A reader hitting an error is already
  frustrated; a joke reads as making light of their problem.
- **No visual-only instructions.** Never "click the green button", "the menu on the left", "the
  box below". These exclude screen reader users and break the moment the layout changes on a
  different viewport. Refer to controls by their name instead: "select Try again".
- **Link text must make sense read on its own**, because screen readers can list all links on a
  page out of context. "Click here" and a bare "Read more" are not acceptable; say what the link
  goes to, for example "Read the equipment loan policy".
- **One `<h1>` per page, describing what the page does.** Do not add a second top-level heading
  for a subsection.
- **Page title format**: "Page name - Section - BIRSA Portal". Keep the same order everywhere so
  the browser tab and search results stay predictable.
- **Every input needs a programmatically associated question**, via a `<label>` or, for a group
  of related fields, a `<fieldset>`/`<legend>`. If the design does not show the label visually,
  it still has to exist for assistive technology (visually hidden, not removed).
- **Pronouns**: when the site speaks, the reader is "you" and BIRSA is "we". When the reader is
  speaking about themselves, for example a checkbox confirming something about their own
  situation, use "I"/"my", not "you"/"your".
- **Use "they", never "he or she" or "he/she"**, for a person whose gender is not specified.
- **Use "for example", not "eg" or "ie"** (English only; this is not a Thai abbreviation issue).
- **Do not rely on the reader remembering an acronym across pages.** Spell it out on each page
  where it matters, even if an earlier page already did.
- **Keep help text short and action-focused.** Do not use help text to explain how the interface
  works ("this field has a dropdown"); if the interface needs that explanation, the interface is
  wrong and should be fixed, not documented around.
- **Never put personal information in a page title, an `<h1>`, or a URL.** These all leak into
  analytics and browser history. Use a reference number or a generic label instead of a name.

## Check conditions at Tha Prachan (`content/conditions/`)

`/en/conditions` and `/th/conditions` tell students whether weather, the river, flooding, air or
hazards will affect the campus or their journey. The page is built from live public data and
refreshes about every five minutes.

- **Thresholds and sentences** live in `content/conditions/rules.ts`. Each rule has a threshold,
  the level it triggers (`takeCare` or `disruption`), and an English and Thai `why` line. The
  card titles, level words, headlines and actions are in the same file. Change a number or a
  sentence there and the page, the API and the tests follow.
- **Where the thresholds come from.** River levels are set from the 2021 season, when the river
  came over the wall by the riverside canteen while Krung Thep Bridge peaked between 1.73 m and
  2.03 m (Pak Khlong Talat 2.09 m to 2.37 m). The dam release only raises take care, at the
  2,500 m³/s rate at which the Royal Irrigation Department warns Bangkok. PM2.5 uses the Pollution
  Control Department's orange (above 37.5) and red (above 75) bands. Heat uses the Thai
  Meteorological Department's dangerous (42 °C) and very dangerous (52 °C) heat index levels,
  checked against both the forecast and the measured reading. Model rain is averaged over a wide
  area and never reached 20 mm an hour in the 2025 rainy season, so the forecast rules use the WMO
  heavy (7.6 mm) and moderate (2.5 mm) rates, and the rain gauge at Memorial Bridge catches the
  downpours the model misses. The earthquake check counts magnitude 7.5 or more within 1,500 km,
  so a quake like Myanmar's in March 2025 (1,036 km away) is caught. The UV index is shown but
  does not change a verdict, because Bangkok reaches very high UV on most clear days.
- **Reading names and threshold lines** live in `content/conditions/readings.ts`. Each reading has
  a label and a one line description of what it is checked against, in both languages. The
  same file sets which section of the page the reading appears in.
- **Page wording** (headings, table labels, disclaimer, attributions) is `conditionsPage` in
  `content/dictionaries/en.ts` and `th.ts`.
- **Stale data.** Every reading says how many minutes it stays valid (`staleAfterMinutes`). A
  reading older than that, or one that could not be fetched, is greyed out on the page and is
  not used by any rule. A card that loses a reading says so under "Not checked right now".
- **The service never raises alerts.** It only reports readings. A real alert, banner or
  closure is raised by officers in `content/emergency/active.ts` (see "Emergency alerts"
  below). The live alert appears at the top of the conditions page when one exists.

Keep the English and Thai entries in step, and follow `docs/NEWS-STYLE.md` for tone: short
sentences, no colons or dashes in the copy.

## Emergency alerts (`content/emergency/`)

The emergency guides are written in advance, one file per situation in
`content/emergency/scenarios/`, each in English and Thai. Phone numbers and other contacts live
once in `content/emergency/contacts.ts`; guides refer to them by id. Each guide lists the
sources its advice comes from and the date it was last checked (`reviewed`). Check every guide
against its sources at least once a year and update `reviewed`.

### Raising an alert

1. Open `content/emergency/active.ts` on GitHub and choose **Edit**.
2. Replace `null` with an object naming the guide and the time, in Bangkok time:

   ```ts
   export const activeEmergency: ActiveEmergency<ScenarioId> | null = {
     scenario: "flooding",
     issuedAt: "2026-10-12T07:30:00+07:00",
     banner: {
       en: "Roads around Tha Prachan are flooded. Classes today are online.",
       th: "ถนนรอบท่าพระจันทร์น้ำท่วม วันนี้เรียนออนไลน์",
     },
   };
   ```

   `banner` is optional; without it the guide's own banner line is used. Use `generic` for a
   situation none of the guides covers, and say what is happening in `banner` and `updates`.

3. Commit to `master`. The site deploys in about a minute. Open the site and check the banner.

The build fails if `scenario` does not name a guide, so a typo cannot go live. A failed build
leaves the previous version up, so always check the site after committing. Vercel only deploys
commits from members of the BIRSA Vercel team; whoever will raise alerts must be on it, and
should try it once before they need it.

### Updating and ending an alert

- To post an update, add an entry at the **start** of `updates`, newest first:
  `updates: [{ at: "2026-10-12T11:00:00+07:00", text: { en: "...", th: "..." } }]`. The newest
  entry's time shows as "last updated".
- To end the alert, set `activeEmergency` back to `null` and commit.

## Course reviews (`content/course-review/`)

The course pages under `/student-life/course-reviews` are driven by `content/course-review/courses.ts`,
one entry per PI course, sorted by code. The types and their comments are in `types.ts`. Titles,
descriptions and instructor names are bilingual (`{ en, th }`), and both languages must be filled in.

### Adding a review

Add a `reviews` entry to the course. A review is written only: there are no scores or star
ratings, and the tests fail if a numeric rating field is added. Describe how the course felt in
words.

- `reviewCount`: how many students the summary draws on.
- `term`: the Buddhist Era academic year and semester (`1`, `2` or `"summer"`), for example
  `{ year: 2567, semester: 1 }`.
- `instructor`: who taught that term, when known. Reuse the instructor constant defined at the top
  of the file.
- `workload`, `assessmentStyle`, `tips`, and optionally `quotes`. Attribute quotes by year of
  study only, never by name.

Set `sample: true` on any review written to demonstrate the layout rather than taken from real
students, so the pages can say it is an example. Remove the flag only when the entry is replaced by
a real submission.

### Assessment facts

Syllabi are copyrighted and are not public. Never copy syllabus text onto the site, never upload or
link to a syllabus, and never reproduce its weekly schedule or reading list.

The optional `assessmentFacts` block holds plain facts about how a course is assessed for a named
term. Facts are not covered by copyright, so these are fine when written in your own words.

- `weights` lists each part of the grade and its percentage, for example a midterm at 30. The
  weights must add up to 100.
- `examFormat` says whether exams are open or closed book, in person or take home, and so on.
- `attendance` states any attendance requirement.

Record them only from the syllabus for that term, never from memory or hearsay.

The course descriptions come from the public curriculum document and may be copied as published.

### Do not hand-write curriculum facts

Prerequisites, what a course unlocks, its recommended term and the minors it counts towards are
derived from `content/curriculum/2568.ts` by `lib/course-review/facts.ts`. Do not copy them into
`courses.ts`. To correct one, fix the curriculum data and the course pages follow. Every course
code and credit total in the catalogue must match that data; `npm run test` checks it.

## How publishing works

The site is deployed on Vercel and auto-deploys from this repository. To publish a change:

1. Edit the content files (or `clubs.ts` / `quick.ts`) directly.
2. Commit your change with a clear message describing what you added or updated.
3. Push to the repository's main branch.
4. Vercel automatically builds and deploys the new version. No manual deploy step needed. If the
   build fails (for example, invalid frontmatter), Vercel will show the error and the previous
   version stays live until it's fixed.
