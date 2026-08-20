# BIRSA Portal 2.0: build brief (read me first)

Every agent working on the 2.0 redesign reads this file before anything else.

It replaces `docs/PROJECT-BRIEF.md`, which had drifted in three ways that mattered
(`REDESIGN-2.0.md` §1.3): it named the wrong body font, documented a Windows path and a
Node-not-on-PATH workaround that do not apply here, and described the lib contracts as they
stood several waves ago. **A brief that is wrong in its first three sections is worse than no
brief, because agents trust it.** If you find something in this file that is wrong, stop and
report it rather than working around it.

Read alongside this: `docs/REDESIGN-2.0.md` (the plan), `docs/DECISIONS-2.0.md` (what is
still undecided, and what you must not assume), `docs/ROUTE-MAP-2.0.md` (which agent owns
which route), and `docs/EDITING.md` (content and voice).

---

## 1. What you are building

A production-ready, bilingual (Thai and English), WCAG 2.2 AA website for the **BIR Student
Association (BIRSA)**, the student association of the Bachelor of Political Science in
Politics and International Relations (BIR), Faculty of Political Science, Thammasat
University, Tha Prachan campus, Bangkok. Deployed on Vercel.

2.0 is built to one governing requirement:

> Every officer of BIRSA can run the whole website, including publishing, configuring and
> operating it, without writing code and without needing the IT officer.

Founding principles: the Government Design Principles and the GOV.UK Service Standard **in
spirit** (user needs, plain language, accessibility, security, reliability), with BIRSA's own
visual identity, a warm "cream editorial" on BIR red. **Do not imitate GOV.UK visuals.**

---

## 2. Environment

- Linux. Repository root is the working directory. Paths in briefs are repo-relative.
- Node 22 and `npm` are on the PATH. Dependencies are installed; run `npm ci` only in a fresh
  container.
- Verify with `npm run typecheck`, `npm run lint`, `npm run test`.
- **Do not run `next build` or `next dev`, do not start servers, and do not run `git`.** The
  orchestrator does all three. A subagent running a build burns several minutes of wall clock
  and tells you nothing `typecheck` did not.
- `npm run format` is `prettier --write .`. An unformatted file fails the build, and prettier
  fails with a missing `prettier-plugin-tailwindcss` if dependencies are not installed, in a
  way that looks like a formatting pass that did nothing.
- Thai has no spaces between words, so prettier's 100-character rewrap can put a line break
  inside a date or a phrase. After editing Thai content, run `npx prettier --write` on it and
  **re-read the result**.

---

## 3. Facts. Use these; do not invent institutional facts

This is a hard rule and it is in every agent's forbidden list. BIRSA is a real organisation
and an invented fact about it is a lie published under its name.

- BIR is the English-medium international BPolSc programme in Politics and International
  Relations, Faculty of Political Science, Thammasat University; Tha Prachan campus, 2
  Prachan Rd, Bangkok 10200. Founded 2009, the first English-language political science
  programme in Thailand. About 126 credits, bi-semester (August to December, January to May,
  optional summer June to July).
- Exchange and double-degree partners include Meiji University (Japan), Aberystwyth
  University and the University of Bristol (UK). Annual third-year field trip; Bangkok
  International Student Conference (BISC); internships.
- BIR office: bir@tu.ac.th, 02-221-6111 ext. 3409, www.birpolsci.com
- BIRSA socials: Instagram `@student_birsa`, Facebook "BIR Student Association".
- Thammasat was founded in 1934 by Pridi Banomyong. University registrar: www.reg.tu.ac.th
- The committee is real and is in `content/committee.ts`. **Never invent a committee member,
  and never move a name between roles.** The portfolios derived from it are
  `lib/portfolios.ts`, which is frozen.
- **BIRSA is the bottom rung of a four-level ladder** (`content/activity/*/student-bodies.mdx`):
  BIR, then Singhadang (the Faculty of Political Science), then Tha Prachan campus (TUSU TPC,
  TUSC TPC), then the university (TUSU, TUSC, ECTU). BIRSA publishes what only BIRSA can
  publish. If a fact is equally true for a law student at Rangsit, it belongs to TUSU or TUSC
  and BIRSA keeping a second copy means keeping a copy that will be wrong first.
- Anything about BIRSA's internal committee, activity or clubs not covered above is
  **unknown**. Write it as a clearly marked placeholder (section 9), or stop and report.

---

## 4. Stack and repository layout

Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4. MDX via
`next-mdx-remote/rsc` with `gray-matter`; zod validation; Resend email (optional,
environment-gated); `next/font`. Path alias `@/*` maps to the repository root.

```
app/[lang]/...            ALL pages live under [lang]. There is NO app/layout.tsx;
                          app/[lang]/layout.tsx is the root layout and renders <html lang>
app/api/*                 route handlers
components/bds/*          the design system. Frozen contracts plus Wave 2's components
components/*              1.0 components, migrating into bds/ wave by wave
lib/*                     i18n, content loaders, services, privacy, inventory
content/                  editable content
docs/                     this brief, the plan, the decisions register, the route map
proxy.ts                  locale detection; officer-route CSP nonce
```

### Fonts, corrected

`app/[lang]/layout.tsx` imports **`Fraunces`, `Lexend` and `Sarabun`** from
`next/font/google`, plus **JenjrusVris** self-hosted from `assets/fonts` via `lib/fonts.ts`.

| Variable            | Face        | Used for         |
| ------------------- | ----------- | ---------------- |
| `--font-en-display` | Fraunces    | English headings |
| `--font-en-body`    | **Lexend**  | English body     |
| `--font-th`         | Sarabun     | Thai body        |
| `--font-th-display` | JenjrusVris | Thai headings    |

**The body font is Lexend, not Inter.** `docs/PROJECT-BRIEF.md` said Inter and was wrong.

---

## 5. The frozen contracts

Wave 0 produced these. **They are read-only to every subagent.** An agent that believes a
contract is wrong STOPS and reports; it does not edit. A contract change is an orchestrator
decision, applied once, before the next wave starts (`REDESIGN-2.0.md` §11.1).

| File                                    | What it fixes                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `components/bds/tokens.css`             | Colour, radius, shadow, fonts, the bilingual type scale, spacing, the chrome height |
| `components/bds/tokens.ts`              | The TypeScript mirror and the contrast pairs                                        |
| `components/bds/manifest.ts`            | Every component, its cluster, its owner, its usage rule                             |
| `components/bds/sectionPalette.ts`      | The eleven officer-composable sections, and the fields that may never exist         |
| `components/bds/imageContract.ts`       | Aspect ratios, alt text rules, upload limits, per-template image budgets            |
| `lib/portfolios.ts`                     | The portfolio vocabulary and the grant verbs                                        |
| `lib/services/questionTypes.ts`         | The question palette                                                                |
| `lib/services/defineService.ts`         | The service definition type and its validation rules                                |
| `lib/redirects.ts`                      | The 1.0 to 2.0 URL map                                                              |
| `app/globals.css`                       | Base layer, prose, focus, the language-conditional fonts                            |
| `lib/i18n.ts`                           | Locales, dictionary lookup, locale-aware link helpers                               |
| `content/dictionaries/{en,th}/index.ts` | The dictionary composition                                                          |

### Typography: use the scale, never a Tailwind size utility

`text-display-1`, `text-display-2`, `text-heading-1`, `text-heading-2`, `text-heading-3`,
`text-body`, `text-body-sm`.

**A `bds/` component that reaches for `text-4xl`, `text-lg` or `leading-tight` is a bug.**
Defect D7 was that Tailwind's font-size utilities each carry a line-height Thai cannot use,
and 1.0 fought them with unlayered overrides that had to be remembered for every new heading
size. The scale makes leading and tracking properties of the step, resolved through a
per-script custom property. Use it and Thai is correct without you thinking about it. Reach
around it and you have reintroduced the defect.

---

## 6. i18n architecture (contract)

- Locales `th` (default) and `en`. `Locale = "th" | "en"` in `lib/i18n.ts`.
- Every page is `/{lang}/...`. `proxy.ts` redirects unprefixed paths using the `NEXT_LOCALE`
  cookie, then `Accept-Language`, then `th`.
- **Slugs are identical across locales.** English kebab-case is the shared key; only titles
  and content differ. The language toggle is a plain link to the same pathname with the
  locale segment swapped.
- All internal links go through `localeHref(locale, "/path")`. Never hand-roll a locale
  segment.
- UI strings come from `getDictionary(locale)`.

### The dictionaries are split by namespace. This matters to you

```
content/dictionaries/{en,th}/{chrome,a11y,forms,services,whatson,help,studies,about,console}.ts
content/dictionaries/{en,th}/index.ts     # FROZEN. Composes the namespaces
```

**You own one namespace file per locale, named in your brief, and you never touch another.**
This is `REDESIGN-2.0.md` §11.2's fix for the contention that would otherwise make the
parallel plan impossible. The namespaces spread flat into the index, so call sites are
unchanged: it is still `dict.actions.readMore`, not `dict.chrome.actions.readMore`.

Parity is enforced by the compiler twice, on the index and again per namespace. A key added
to English and not to Thai does not compile. **This is not a nudge to machine-translate it:**
copy is authored natively per language, always (section 9).

---

## 7. Accessibility. Every page, non-negotiable

WCAG 2.2 AA is the floor, not the target, **and it applies to officer-facing surfaces too**.
Officers use phones, some will use a screen reader, and an editing surface that fails them
removes them from the two-person rule as effectively as taking away their password.

- One `<h1>` per page; logical heading order; landmarks; `<main id="main">` for the skip link.
- Full keyboard operability. Visible focus is handled globally; never remove an outline.
- Forms: every input has a `<label>`; errors inline and `id`-linked via `aria-describedby`
  **and** in an error summary at the top that takes focus on a failed submit; `aria-invalid`
  on bad fields. Status messages use `role="status"`.
- Native `<details>`/`<summary>` for disclosure wherever possible.
- External links get visually hidden `(dict.a11y.newTab)`, `rel="noopener noreferrer"`, and
  an `aria-hidden` icon.
- Readable at 320px and at 400% zoom. No fixed heights on text containers.
- Never convey meaning by colour alone.
- **Forms work with JavaScript off.** This is tested (`tests/e2e/progressive-enhancement.spec.ts`).

The criteria that specifically bite in this rebuild:

- **2.4.11 focus not obscured.** `scroll-padding-top` derives from `--bds-chrome-height`.
  If you build sticky chrome, set its height variable; do not hard code an offset.
- **2.5.8 target size.** AA asks 24px; the site targets 44px. Keep the higher bar.
- **3.2.6 consistent help.** `PageHeader`'s `helpSlot` in the same place on every page, and
  in 2.0 it is mandatory rather than optional.
- **3.3.7 redundant entry.** The draft cookie already avoids re-asking within a wizard.
- **3.3.8 accessible authentication.** Officer login is compliant. Do not regress it and do
  not add a puzzle CAPTCHA.

---

## 8. Privacy and personal data. Read this before you add a field

- **`content/privacy/register.ts`, `lib/privacy/retention.ts` and `lib/inventory/auth.ts` are
  off limits to subagents.** They are Opus work, reviewed by a human.
- **The CMS holds published content and site configuration. It never holds a student
  submission.** Loan requests, welfare cases, reimbursement claims, sign-ups, feedback and
  rights requests stay in Postgres behind the officer console, under the existing audit log
  and retention paths. Adding a field to a CMS schema that would hold a student submission is
  forbidden (`REDESIGN-2.0.md` §6.3).
- File uploads go to Vercel Blob, never to the CMS, and always under a retention path.
- **Collect nothing by default.** Thai majority is twenty, most first-years are minors, and
  the register deliberately avoids relying on consent. The study plan tool is the model: a
  genuinely useful service that stores nothing. Prefer that shape.
- Every image field carries required bilingual alt text and an explicit decorative flag.
  See `components/bds/imageContract.ts`.

---

## 9. Copy. Write natively per language, never translate mechanically

- **English:** plain, direct, warm. Short sentences. Active verbs. Sentence case everywhere,
  headings included. "You" is the student, "we" is BIRSA.
- **Thai:** เขียนใหม่สำหรับผู้อ่านไทยโดยตรง ไม่แปลตรงตัวจากอังกฤษ สุภาพ กระชับ เป็นกลาง ใช้ "คุณ" กับผู้อ่าน
  เลี่ยงภาษาราชการแข็ง ๆ และเลี่ยงทับศัพท์ที่ไม่จำเป็น ตัวเลขใช้เลขอารบิก
- The two versions cover the same facts and may differ in structure and examples where that
  reads more naturally.
- **No em dashes, and no dashes of any kind, in either language.** No colons outside clock
  times and URLs. `docs/NEWS-STYLE.md` is the full standard.
- **Never state a procedure BIRSA does not have.** A "coming soon" that is two years old is
  worse than an honest "BIRSA does not publish this".

Unknown facts must be plausible but clearly marked: `placeholder: true` where the schema
allows, plus a visible note. Never invent a real person's name.

---

## 10. How to work as a subagent on this project

This section is new in 2.0 and it is the part that makes parallel execution safe.

### The two rules

1. **Contracts are frozen.** Section 5 lists them. You read them and never write them. If one
   is wrong: STOP, report it, do not edit it.
2. **You own a disjoint set of file paths, listed literally in your brief.** Not "the news
   pages": a list. If you need to change a file that is not on your list, STOP and report.
   Two agents never hold the same path in the same wave, and a wave that cannot be
   partitioned this way is a wave that needs splitting.

### What you do

- Work only inside your owned paths.
- Verify with `npm run typecheck`, `npm run lint`, `npm run test` before reporting.
- Report: files created or changed; decisions taken; **contracts you wanted to change and did
  not**; anything you could not finish. That third item is the most useful thing in your
  report, so do not omit it when it is empty either: say so.

### What you never do

- Add a dependency.
- Edit another agent's owned paths, or any frozen contract.
- Run `git`, `next build` or `next dev`.
- Invent an institutional fact (section 3).
- Machine-translate copy between locales.
- Put personal data into a CMS schema, including any field that would hold a student
  submission or an operational upload.
- Add a raw HTML, arbitrary embed, or custom CSS field to any schema.
- Add an image field without required bilingual alt text and an explicit decorative flag.
- Delete or signpost any content. Dispositions come from the §3.6 scope audit, which is a
  committee decision. Execute the one you were given; if a file is not on your list, STOP and
  report it.
- Touch `lib/inventory/auth.ts`, `content/privacy/register.ts` or `lib/privacy/retention.ts`.

### A component has not shipped until it is on `/design`

`/design` is the public reference page and it renders from `components/bds/manifest.ts`. A
component that exists in `components/bds/` and not on `/design` fails the wave boundary
check, and so does an entry on `/design` with no component behind it.

---

## 11. Definition of done

1. `npm run typecheck`, `npm run lint` and `npm run test` pass from the repository root.
2. Everything works in **both** locales, with copy authored natively in each.
3. The accessibility requirements in section 7 are implemented, not deferred.
4. Anything you built that is in the manifest has an entry on `/design` and an axe assertion.
5. You have reported, in the shape section 10 describes.
