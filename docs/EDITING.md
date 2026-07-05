# Editing BIRSA Portal content

**สรุปสั้น ๆ (อ่านก่อน):** เนื้อหาทุกภาษาต้องเขียนขึ้นใหม่โดยคนที่ใช้ภาษานั้นจริง ๆ
**ห้ามแปลตรงตัว** ระหว่างไทย-อังกฤษ ทั้งสองเวอร์ชันต้องใช้ **slug เดียวกัน** (ชื่อไฟล์ภาษาอังกฤษ
แบบ kebab-case) เพื่อให้ระบบจับคู่หน้าได้ถูกต้อง เนื้อหาที่ยังไม่ใช่ข้อมูลจริงต้องติดป้าย
`placeholder: true` และมีกล่อง Notice แจ้งผู้อ่านเสมอ ก่อนเผยแพร่จริงให้ตรวจสอบตามเช็กลิสต์
"Going live" ด้านล่างทุกครั้ง

This guide is for whoever on the BIRSA committee is adding or updating content on the portal.
No coding knowledge is required beyond editing text files — but a few rules keep the two
language versions correct and keep the site's automated checks (`npm run test`) passing.

## The golden rules

1. **Same slug in both locales.** Every news post, service guide, about page, or student-life
   entry has an English kebab-case filename (e.g. `freshers-orientation-2026.mdx`). The Thai and
   English versions of the same piece of content **must use the identical filename** in their
   respective `en/` and `th/` folders — that's how the site matches them up and builds the
   language toggle correctly.
2. **Never machine-translate.** Write the Thai version for Thai readers and the English version
   for English readers, independently. They should cover the same facts, but the wording,
   structure, and examples can differ where that reads more naturally in each language. See the
   voice notes below.
3. **Mark placeholder content clearly.** If you don't yet have the real information (a committee
   member's name, an exact date, a room number), write something plausible but obviously
   temporary, add `placeholder: true` to the frontmatter (where the content type supports it),
   and add a `<Notice variant="placeholder">` at the top of the page saying it's example content.
4. **Never invent real people's names.** Use role titles instead — "President", "Head of Student
   Welfare" — never a made-up name for a real person.

## Adding a news post or event

News posts and events live in `content/news/en/<slug>.mdx` and `content/news/th/<slug>.mdx`.
Create both files with the **same `<slug>.mdx` filename**.

### News frontmatter template

```mdx
---
title: "Your headline here"
summary: "One sentence summarising the post — shown on cards and in search results."
date: 2026-08-01
type: news
category: announcements
---

<Notice variant="placeholder">Example content — BIRSA will replace this with real announcements.</Notice>

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

- `links` — an array of `{ label, href }` for related links (e.g. a registration form).
- `placeholder: true` — add this while the post is still example content.

Remove the `<Notice variant="placeholder">` line and the `placeholder: true` frontmatter field
once the post is real.

## Editing clubs

Clubs are **not** MDX files — they're a single typed list in `content/clubs/clubs.ts`. Find the
club you want to edit (or copy an existing entry as a starting point for a new one) and update
these fields:

| Field                | Notes                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------- |
| `key`                 | Internal identifier — lowercase, hyphenated, doesn't need to match anything visible.   |
| `slug`                | The URL segment (`/clubs/<slug>`) — English kebab-case, must be unique.                |
| `category`            | One of `academic`, `sports`, `arts`, `community`, `social`.                            |
| `placeholder`         | `true` while this is example content; set to `false` once BIRSA confirms it's real.    |
| `email` / `instagram` | Optional contact details — omit the field entirely if the club doesn't have one.       |
| `join.open`           | Whether the club is currently open to new members.                                    |
| `en` / `th`           | Each has `name`, `tagline`, `description` (an array of 2–3 paragraph strings), `meets` (optional), `lead` (a **role title**, never a person's name), and `howToJoin`. |

Every club needs **both** an `en` block and a `th` block, written natively (not translated).
Keep `slug` values unique across the whole file — the content test suite checks this.

## Quick actions (`content/quick.ts`)

`content/quick.ts` powers the `/quick` page — BIRSA's "link in bio" page. It's organised into
`quickGroups`, each with a heading and a list of `items`. Each item needs `key`, `href` (an
internal path like `/services/tu-accounts`, or a full external URL with `external: true`), an
`icon` (pick from the existing `QuickIcon` union), and `en`/`th` blocks with a `label` and
optional `hint`. Set `placeholder: true` on an item if the destination isn't real yet (e.g. a
social channel that doesn't exist).

## Services and student-life guides

Services (`content/services/{en,th}/<slug>.mdx`) and student-life guide entries
(`content/student-life/{en,th}/{home,international}/<slug>.mdx`) share a similar frontmatter
shape. As with news, create matching `<slug>.mdx` files in both locale folders.

### Services frontmatter template

```mdx
---
title: "Service or guide title"
summary: "One sentence shown on the services hub."
category: "it-and-accounts"
order: 1
updated: 2026-08-01
---

Body copy in Markdown, using `##` headings to break up longer guides.
```

`category` must be one of the values defined in `content/services/categories.ts`
(`it-and-accounts`, `academic-admin`, `money`, `opportunities`, `wellbeing`, `help`). `order`
controls the sort position within that category (lower numbers first).

### Student-life guide frontmatter template

```mdx
---
title: "Guide section title"
summary: "One sentence shown on the guide hub."
order: 1
updated: 2026-08-01
audience: home
---

Body copy in Markdown.
```

`audience` is either `home` (for Thai/home students) or `international`. Each audience has its
own folder (`student-life/{en,th}/home/` or `.../international/`) and its own `order` sequence.

Both services and student-life entries accept an optional `placeholder: true`.

## Placeholder flag and Notice removal checklist (going live)

Before telling students a piece of content is final, go through this checklist:

- [ ] Remove `placeholder: true` from the frontmatter (news, services, student-life, and each
      relevant `clubs.ts` entry).
- [ ] Remove any `<Notice variant="placeholder">…</Notice>` block from the MDX body.
- [ ] Replace any obviously generic names, dates, room numbers, or links with the real details.
- [ ] Check both the Thai and English versions were updated — not just one.
- [ ] Re-run `npm run test` locally (or check the next deploy) to confirm the content still
      passes validation (a required field can't be blank, dates must be `YYYY-MM-DD`, etc.).

## Voice and language

- **Write natively, not by translating.** The Thai and English versions should read like two
  people who each know their own audience wrote them — not like one was run through a
  translator.
- **English**: plain, direct, warm. Short sentences, active verbs, sentence case even in
  headings. "You" is the student, "we" is BIRSA.
- **Thai**: เขียนใหม่สำหรับผู้อ่านไทยโดยตรง ไม่แปลตรงตัวจากอังกฤษ น้ำเสียงเหมือนรุ่นพี่ที่เชื่อถือได้
  สุภาพ เป็นกันเอง กระชับ ใช้ "คุณ" กับผู้อ่าน เลี่ยงภาษาราชการแข็ง ๆ และเลี่ยงทับศัพท์ที่ไม่จำเป็น
  (คำเฉพาะอย่าง BIRSA, TU Greats, Resend คงรูปอังกฤษได้) ตัวเลขใช้เลขอารบิก

## How publishing works

The site is deployed on Vercel and auto-deploys from this repository. To publish a change:

1. Edit the content files (or `clubs.ts` / `quick.ts`) directly.
2. Commit your change with a clear message describing what you added or updated.
3. Push to the repository's main branch.
4. Vercel automatically builds and deploys the new version — no manual deploy step needed. If the
   build fails (for example, invalid frontmatter), Vercel will show the error and the previous
   version stays live until it's fixed.
