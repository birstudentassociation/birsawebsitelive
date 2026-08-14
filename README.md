# BIRSA Portal

The BIRSA Portal is the bilingual (Thai/English) website for the **BIR Student Association**
(BIRSA), the student association of the Bachelor of Political Science in Politics and
International Relations (BIR) programme, Faculty of Political Science, Thammasat University.
It gives BIR students one place to find news and events, BIRSA's activity and committee
information, the club directory, a student-life guide (for both home and international
students), guided answers to common "what do I actually do here?" questions, the equipment
loan service, and a way to contact BIRSA directly, all written natively in Thai and English,
not machine-translated.

This is BIRSA's official site, run by students. BIRSA is not a university office. For official
programme matters, always use the BIR Program and Faculty links in the footer.

## What's on the site

| Section                  | Route                                         | What it is                                                                                |
| ------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Home                     | `/[lang]`                                     | Hero, top tasks, Smart Answers entry point, latest news                                   |
| Smart Answers            | `/[lang]/answers`                             | Guided, step-by-step checks that give one reader one answer, based on an audience profile |
| News and events          | `/[lang]/news`                                | MDX news posts and event announcements                                                    |
| Activity                 | `/[lang]/activity`                            | BIRSA's work, committee roles, and the regulations library                                |
| Clubs                    | `/[lang]/clubs`                               | Club directory (MDX per club) plus a "start a club" form                                  |
| Student life             | `/[lang]/student-life`                        | Guide tracks for home and international students, getting-started paths, course reviews   |
| Find a service           | `/[lang]/services`                            | University services directory and the equipment loan service                              |
| Equipment loan           | `/[lang]/services/equipment-loan`             | Public catalogue, request form, and self-service status lookup                            |
| Officer console          | `/[lang]/officer/inventory`                   | Passcode-protected inventory management suite (items, loans, borrowers, reports, audit)   |
| Quick links              | `/[lang]/quick`                               | One-page list of the links students ask for most                                          |
| Search                   | `/[lang]/search`                              | Site-wide content search                                                                  |
| Contact                  | `/[lang]/contact`                             | Contact form, falls back to a mailto message when email is not configured                 |
| Emergency                | `/[lang]/emergency`                           | Scenario pages shown when site-wide emergency mode is switched on                         |
| Standards                | `/[lang]/standards`                           | Plain-language accessibility and design-standards statement                               |
| Privacy                  | `/[lang]/privacy`                             | Privacy notice                                                                            |
| Calendar feed            | `/[lang]/calendar.ics`                        | Subscribable iCalendar feed of the TU academic calendar and BIRSA events                  |

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com), with design tokens defined in `app/globals.css`
- MDX content via `next-mdx-remote/rsc` + `gray-matter` (`remark-gfm`, `rehype-slug`,
  `rehype-autolink-headings`), validated with [Zod](https://zod.dev)
- [Resend](https://resend.com) for optional form and notification email delivery
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) for the equipment loan and
  inventory suite, [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for item photos,
  [Vercel Edge Config](https://vercel.com/docs/storage/edge-config) for runtime emergency mode
- [Vitest](https://vitest.dev) for unit tests, [Playwright](https://playwright.dev) +
  [axe-core](https://github.com/dequelabs/axe-core) for accessibility/e2e tests
- [Vercel Analytics](https://vercel.com/analytics)
- Deployed on [Vercel](https://vercel.com)

Every backend-dependent feature is env-gated and degrades gracefully: with no environment
variables at all, the site still builds, renders, and passes its tests. Features whose backing
service is missing report themselves as "not configured" rather than throwing.

## Getting started

Requires Node.js `>=20.9` (the floor Next.js 16 sets).

```bash
npm install
cp .env.example .env.local   # then fill in values as needed, see the table below
npm run dev
```

The site runs at `http://localhost:3000` and redirects to `/th` or `/en` depending on your
browser's language (or a previously-set cookie).

## npm scripts

| Script                 | What it does                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Start the Next.js dev server                                 |
| `npm run build`        | Production build (`next build`)                              |
| `npm run start`        | Serve the production build (`next start`), run `build` first |
| `npm run lint`         | Run ESLint (`eslint .`, configured in `eslint.config.mjs`)   |
| `npm run typecheck`    | Run the TypeScript compiler with no output (`tsc --noEmit`)  |
| `npm run format`       | Format the repo with Prettier                                |
| `npm run format:check` | Check formatting without writing changes                     |
| `npm run test`         | Run unit tests once (Vitest)                                 |
| `npm run test:watch`   | Run unit tests in watch mode                                 |
| `npm run e2e`          | Run Playwright end-to-end and accessibility tests            |

Two database maintenance scripts are run directly with `node`, not through npm. Both need
`POSTGRES_URL` (or `POSTGRES_URL_NON_POOLING`) in the environment, so pull the deployment's
environment first with `vercel env pull`:

```bash
node scripts/migrate.mjs               # apply db/migrations/*.sql, each at most once
ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSCODE=your-passcode \
  node scripts/seed-admin-officer.mjs  # bootstrap the first admin officer
```

## Environment variables

None of these are required for the site to build or run. See `.env.example` for the annotated
originals.

| Variable                 | Purpose                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | Public base URL of the deployed site, used for canonical URLs, the sitemap, and hreflang.                            |
| `RESEND_API_KEY`         | API key from [resend.com](https://resend.com). If unset, forms validate but don't send email.                        |
| `BIRSA_INBOX`            | Inbox that form submissions are delivered to (default `birsa@tu.ac.th`).                                             |
| `CONTACT_FROM`           | Verified "from" address Resend sends on behalf of.                                                                   |
| `POSTGRES_URL`           | Equipment loan and inventory database. Auto-set by the Vercel Postgres integration; run the migrations against it.   |
| `OFFICER_SESSION_SECRET` | Signing key for the per-officer session cookie (`openssl rand -hex 32`). Without it, officer sign-in is unavailable. |
| `CRON_SECRET`            | Bearer token the daily cron (`/api/cron/daily`) and the emergency cache purge (`/api/emergency/revalidate`) require. |
| `BLOB_READ_WRITE_TOKEN`  | Vercel Blob token for inventory item photos. Auto-set by the Blob integration; without it uploads are disabled.      |
| `EDGE_CONFIG`            | Vercel Edge Config connection string, used to switch emergency mode on and off with no redeploy.                     |

## Project structure

```
app/                # Next.js App Router; all pages live under app/[lang]/...
app/api/            # Route handlers: contact, start-club, loans, inventory, emergency, cron
components/         # Shared design-system components (PascalCase filenames)
content/            # All editable content: news, activity, clubs, student-life, calendar,
                    #   smart answers, onboarding, emergency scenarios, course reviews,
                    #   dictionaries
db/                 # schema.sql and the numbered migrations in db/migrations/
docs/               # Build brief and the content editing guide
lib/                # i18n, content loaders, MDX rendering, SEO, validation, CSP, email,
                    #   smart answers, places, shuttle, ICS, emergency, lib/inventory/*
public/             # Static assets (logo, committee portraits, etc.)
scripts/            # migrate.mjs and seed-admin-officer.mjs
tests/              # Vitest unit tests (tests/unit) and Playwright e2e tests (tests/e2e)
proxy.ts            # Locale detection, redirects, and the nonce-based CSP for officer routes
```

## Equipment loan and inventory suite

The loan service has a public half and an officer half. Students browse the catalogue, request
an item, and check their request's status without an account. Committee officers sign in at
`/[lang]/officer/inventory` with a per-officer email and passcode (scrypt-hashed, role-scoped,
12-hour session) to manage items, units, loans, borrowers, custodians, consumables,
maintenance, and reports, with an audit trail behind it.

To stand it up on a fresh database:

1. Attach Vercel Postgres to the project (sets `POSTGRES_URL`).
2. Set `OFFICER_SESSION_SECRET`.
3. Run `node scripts/migrate.mjs`.
4. Run `scripts/seed-admin-officer.mjs` once to create the first admin, then add the rest of
   the officers through the console.

Optional extras: `BLOB_READ_WRITE_TOKEN` enables item photos, and `CRON_SECRET` enables the
daily loan-reminder emails sent by the Vercel Cron job declared in `vercel.json`.

## Emergency mode

A site-wide alert banner and scenario pages that can be switched on **without a redeploy**.
Edge Config only selects which scenario is live; the wording lives in `content/emergency/`.
Set an item keyed `emergency` in the Edge Config store:

```json
{ "active": true, "scenario": "flooding", "messageOverride": { "en": "", "th": "" } }
```

Reads are cached for an hour (that window doubles as the site's ISR window), so after flipping
the value, `POST /api/emergency/revalidate` with `Authorization: Bearer $CRON_SECRET` to make
the change live immediately. With `EDGE_CONFIG` unset, emergency mode is always off.

## Deploying to Vercel

1. Import this repository into Vercel.
2. Set the environment variables from the table above. All are optional, but
   `NEXT_PUBLIC_SITE_URL` is recommended so canonical URLs and the sitemap point at the real
   domain.
3. Attach the Postgres, Blob, and Edge Config integrations if you want the loan suite and
   emergency mode; then run the migrations as described above.
4. Leave the build command as the default (`next build`). `vercel.json` declares the daily cron
   job; no other custom configuration is needed.

## Design principles, accessibility, and security

The site follows the spirit of the GOV.UK Government Design Principles and Service Standard:
start with user needs, use plain language, and build in accessibility and security from the
start, but with BIRSA's own visual identity ("warm cream editorial" on BIR red), not GOV.UK's
visuals.

Accessibility target: **WCAG 2.2 AA**. See [`/standards`](http://localhost:3000/th/standards)
on the running site for the plain-language explanation of how the site is built to be usable by
everyone, including keyboard and screen-reader users. The site also ships a WCAG-AA-verified
dark mode (system-preference aware, with a header toggle to override it). Forms work without
JavaScript; `tests/e2e/progressive-enhancement.spec.ts` and `tests/e2e/a11y.spec.ts` guard
both properties.

Security headers (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`) are set in `next.config.mjs`. Content-Security-Policy is built in
`lib/csp.mjs`: public pages get a static policy attached at the CDN edge, while officer routes
get a stricter nonce-based policy from `proxy.ts`.

## Editing content

BIRSA committee members who want to add or update news, activity entries, clubs, or student-life
guides should read [`docs/EDITING.md`](docs/EDITING.md). It covers frontmatter templates, the
placeholder-removal checklist for going live, and how publishing works.
[`docs/PROJECT-BRIEF.md`](docs/PROJECT-BRIEF.md) is the build brief for anyone working on the
code: the i18n contract, content model, and the facts that must not be invented.

## Repository status

This repository is private for now. It will move to a public or organisation-owned location once
BIRSA is ready to publish it more widely.
