# BIRSA Portal: Build Brief (read me first)

You are building part of the **BIRSA Portal**: a production-ready, bilingual (Thai/English),
WCAG 2.2 AA website for the **BIR Student Association (BIRSA)**, the student association of
the Bachelor of Political Science in Politics and International Relations (BIR), Faculty of
Political Science, Thammasat University (Tha Prachan campus, Bangkok). Deployed on Vercel.

Founding principles: GOV.UK Government Design Principles + Service Standard **in spirit**
(user needs, plain language, accessibility, security, reliability), but with our **own
visual identity**: warm "cream editorial" on BIR red. Do NOT imitate GOV.UK visuals.

## Environment quirks (IMPORTANT)

- Windows. Project root: `C:\BIRSA files\BIRSA portal` (note the spaces, always quote).
- **Node is NOT on PATH.** Before any `node`/`npm`/`npx` command:
  - PowerShell: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`
  - Bash: `export PATH="/c/Program Files/nodejs:$PATH"`
- Verify your work with `npx tsc --noEmit --incremental false` (quote paths). Do **not** run
  `next build` or `next dev`, do not start servers, do not run `git` (orchestrator does).
- Dependencies are already installed. Do not add new dependencies unless truly necessary.

## Facts (use these; do not invent institutional facts)

- BIR = English-medium international BPolSc programme in Politics & International Relations,
  Faculty of Political Science, Thammasat University; Tha Prachan campus, 2 Prachan Rd,
  Bangkok 10200. Founded 2009, the first English-language political science programme in
  Thailand. ~126 credits, bi-semester (Aug to Dec, Jan to May, optional summer Jun to Jul).
- Exchange/double-degree partners incl. Meiji University (Japan), Aberystwyth University and
  University of Bristol (UK). Annual third-year field trip; Bangkok International Student
  Conference (BISC); internships.
- BIR office contact: bir@tu.ac.th · 02-221-6111 ext. 3409 · www.birpolsci.com
- BIRSA socials: Instagram `@student_birsa`, Facebook "BIR Student Association".
- Thammasat founded 1934 by Pridi Banomyong; motto "I love Thammasat because Thammasat
  teaches me to love the people." University registrar: www.reg.tu.ac.th
- Anything about BIRSA's internal committee/activity/clubs that isn't above is UNKNOWN →
  write it as clearly-marked placeholder (see Placeholder rules).

## Stack & repo layout

Next.js 16 App Router + React 19 + TypeScript strict + Tailwind CSS v4 (tokens in
`app/globals.css` via `@theme`, READ IT before styling). MDX via `next-mdx-remote/rsc` +
`gray-matter`; zod validation; Resend email (optional, env-gated); `next/font` fonts.
Path alias `@/*` → repo root.

```
app/[lang]/...            # ALL pages live under [lang]; there is NO app/layout.tsx;
                          # app/[lang]/layout.tsx is the root layout and renders <html lang>
app/api/*                 # route handlers (forms)
components/*.tsx          # shared design system (PascalCase filenames)
lib/*.ts(x)               # i18n, content loaders, mdx, seo, validation
content/                  # ALL editable content (see Content model)
docs/                     # this brief + editor guide
public/                   # static assets; logo at public/birsa-logo.png
proxy.ts                  # locale detection/redirect
```

## i18n architecture (contract)

- Locales: `th` (default) and `en`. Type `Locale = "th" | "en"` in `lib/i18n.ts`.
- Routes: `/{lang}/...` for every page. `proxy.ts` redirects unprefixed paths using
  cookie `NEXT_LOCALE`, else `Accept-Language`, else `th`; it also refreshes the cookie to
  the locale of the page being visited (so a plain `<a>` toggle persists choice). Middleware
  must skip `/api`, `/_next`, and any path with a file extension.
- **Slugs are identical across locales** (English kebab-case, acting as the shared key);
  only titles/content differ. The language toggle is a link to the same pathname with the
  locale segment swapped (client component using `usePathname`).
- `app/[lang]/layout.tsx` renders `<html lang={lang}>`, loads fonts, Header/Footer/SkipLink.
  `generateStaticParams` returns both locales. Invalid `lang` → `notFound()`.
- Fonts with CSS variables **exactly**: Fraunces → `--font-en-display`, Inter →
  `--font-en-body`, Sarabun (weights 400/500/600/700, subsets `["thai","latin"]`) →
  `--font-th` (all `next/font/google`), and JenjrusVris → `--font-th-display`, the Thai
  display face, self-hosted from `assets/fonts` via `lib/fonts.ts` (`next/font/local`).
  `app/globals.css` already maps them per `html[lang]`.
- UI strings come from `lib/i18n.ts#getDictionary(locale)` returning
  `content/dictionaries/{en,th}.ts` (READ both, they define tone). Never hard-code chrome
  strings in components.
- All internal links must be locale-prefixed via `localeHref(locale, "/path")` from
  `lib/i18n.ts`.

## lib API contracts (implemented in wave 1; later waves READ the real files before use)

```ts
// lib/i18n.ts
export type Locale = "th" | "en";
export const locales: Locale[];
export const defaultLocale: Locale; // "th"
export function isLocale(x: string): x is Locale;
export function getDictionary(locale: Locale): Dictionary; // typeof en
export function localeHref(locale: Locale, path: string): string; // "/en/news"
export function swapLocalePath(pathname: string, to: Locale): string;

// lib/content.ts  (build-time fs loaders, zod-validated frontmatter)
export type Section = "news" | "activity" | "about";
export function getEntries(section: Section, locale: Locale): Entry[]; // sorted
export function getEntry(section: Section, locale: Locale, slug: string): Entry | null;
export function getGuideEntries(locale: Locale, audience: "home" | "international"): Entry[];
export function getGuideEntry(locale, audience, slug): Entry | null;
// Entry = { slug, frontmatter, content(raw mdx string) }

// lib/mdx.tsx
export function Mdx({ source }: { source: string }): JSX.Element; // RSC; remark-gfm,
// rehype-slug, rehype-autolink-headings({behavior:"append", class:"anchor"}), custom
// component map (Notice, links w/ external handling); output wrapped in .prose styling

// lib/seo.ts
export function buildMetadata(opts: { locale; title; description; path }): Metadata;
// sets canonical + hreflang alternates (th, en, x-default) using NEXT_PUBLIC_SITE_URL

// lib/validation.ts: zod schemas for the forms (shared client+server)
```

## Content model

```
content/site.ts                     # socials, contact, official links (typed, per-locale labels)
content/dictionaries/{en,th}.ts     # UI microcopy (EXISTS, do not restructure)
content/home/{en,th}.ts             # home page blocks
content/quick.ts                    # quick-actions link groups
content/news/{en,th}/<slug>.mdx     # same slug in both locales
content/activity/{en,th}/<slug>.mdx
content/student-life/{en,th}/{home,international}/<slug>.mdx
content/about/{en,th}/<slug>.mdx
content/clubs/{en,th}/<slug>.mdx    # one file per club per locale
content/clubs/clubs.ts              # category vocabulary + the client-safe ClubSummary type
```

News frontmatter: `title, summary, date (YYYY-MM-DD), type ("news"|"event"), category,
location?, start? (ISO datetime), end?, links? [{label,href}]`.
Activity frontmatter: `title, summary, order, updated, placeholder?`.
Student-life frontmatter: `title, summary, order, updated, audience`.
Club frontmatter: `title, tagline, category, order, updated, joinOpen, lead?, meets?, where?,
custodian?, links? [{label,href}], placeholder?`. The body is the club's own write-up; only the
card/sidebar fields live in frontmatter.
Validate all frontmatter with zod in `lib/content.ts`; build must fail loudly on bad content.

## Design system

READ `app/globals.css` first: tokens, `.wrap`, `.prose`, `.skip-link`, focus rules exist.
Style with Tailwind utilities referencing tokens (e.g. `bg-cream`, `text-ink`, `text-muted`,
`bg-surface`, `border-line`, `bg-brand`, `text-brand-deep`, `rounded-lg`, `shadow-md`).

- Editorial feel: generous whitespace, hairline borders, serif display headings (EN),
  red used for accents/CTAs/rules; body text is always ink on cream/surface.
- Buttons: primary = white on brand red (hover brand-dark); secondary = ink text on
  transparent with 1.5px ink border; min target 44×44px (WCAG 2.5.8 AA is 24px, we exceed).
- Cards: `bg-surface border border-line rounded-lg shadow-sm`, red top hairline or tag
  accents; entire card clickable via stretched link with the title as the accessible name.
- NEVER convey meaning by colour alone; pair icons/labels. Decorative SVGs need
  `aria-hidden="true"`; informative images need real alt text.

## Accessibility requirements (every page, non-negotiable)

- One `<h1>` per page; logical heading order; landmarks (`header/nav/main/footer`);
  `<main id="main">` targeted by the existing SkipLink.
- Full keyboard operability; visible focus (globals handles); never remove outlines.
- Forms: every input has a `<label>`; errors rendered inline `id`-linked via
  `aria-describedby` AND in an error summary box at top which receives focus on failed
  submit; `aria-invalid` on bad fields. Success/status messages use `role="status"`.
- Disclosure widgets (mobile menu, accordions): correct `aria-expanded`/`aria-controls`;
  accordions use native `<details>/<summary>` where possible.
- External links: append visually-hidden text `(dict.a11y.newTab)` when `target="_blank"`
  plus `rel="noopener noreferrer"`, and an inline ↗ icon `aria-hidden`.
- Tables for tabular data only, with `<th scope>`. Lists as `<ul>/<ol>`.
- Content readable at 320px width and 400% zoom: no fixed heights on text containers,
  wrap-friendly flex/grid.
- `prefers-reduced-motion` already globally respected; do not add JS animations that ignore it.

## Copy voice (write natively per language; NEVER translate mechanically)

- **English**: plain, direct, warm. Short sentences. Active verbs. Sentence case everywhere
  (headings too). "You" = the student, "we" = BIRSA. No jargon, no exclamation-mark spam.
- **Thai**: เขียนใหม่สำหรับผู้อ่านไทยโดยตรง ไม่แปลตรงตัวจากอังกฤษ น้ำเสียงเหมือนรุ่นพี่ที่เชื่อถือได้:
  สุภาพ เป็นกันเอง กระชับ ใช้ "คุณ" กับผู้อ่าน เลี่ยงภาษาราชการแข็ง ๆ และเลี่ยงทับศัพท์ที่ไม่จำเป็น
  (คำเฉพาะอย่าง BIRSA, TU Greats, Resend คงรูปอังกฤษได้) ตัวเลขใช้เลขอารบิก
- The two versions should cover the same facts but may differ in structure/examples where
  that reads more naturally.

## Placeholder rules (content the user will replace)

Unknown facts (committee names, club details, dates, venues) must be plausible but clearly
marked: MDX/data gets `placeholder: true` where the schema allows, AND visible copy is
wrapped in the `PlaceholderNote` pattern, e.g. a Notice at top of the page/entry saying
(EN) "Example content. BIRSA will replace this with real details." / (TH)
"เนื้อหาตัวอย่าง: BIRSA จะแทนที่ด้วยข้อมูลจริง". Never invent real people's names; use role
titles ("President", "Head of Student Welfare") or obviously generic names.

## Security (forms)

API route handlers under `app/api/`: zod-validate server-side; silently accept+discard when
the hidden honeypot field (`nickname`) is filled; best-effort in-memory rate limit per IP
(e.g. 5/10min, Map, fine on serverless); send via Resend ONLY if `RESEND_API_KEY` set, else
respond `{ ok: false, reason: "not-configured" }` so the client shows the "email us directly"
fallback with `BIRSA_INBOX` (default `birsa@tu.ac.th`). Never store submissions. Never echo
user input as HTML (plain-text email bodies). No secrets in client code.

## Emergency mode (Edge Config toggle)

The site-wide emergency banner is switched on by editing the `emergency` item in the
project's Vercel Edge Config store (`lib/emergency.ts` documents the shape:
`active`, `scenario`, optional `messageOverride`). To turn it on or off:

1. Edit the `emergency` item in Edge Config (Vercel dashboard or `vercel env`/Edge Config CLI).
2. `POST /api/emergency/revalidate` with header `Authorization: Bearer <CRON_SECRET>` to make
   the change instant. Without this step the change still reaches everyone, just on the site's
   normal hourly background refresh plus the client banner's 60-second poll, both of which are
   slower than an emergency should be.

## Definition of done for your task

1. `npx tsc --noEmit --incremental false` passes from repo root.
2. Every new page works in BOTH locales with natively-authored copy.
3. Accessibility requirements above are implemented, not deferred.
4. Report back: files created/changed, decisions taken, anything you couldn't finish.
