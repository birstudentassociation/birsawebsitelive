# BIRSA Portal

The BIRSA Portal is the bilingual (Thai/English) website for the **BIR Student Association**
(BIRSA) — the student association of the Bachelor of Political Science in Politics and
International Relations (BIR) programme, Faculty of Political Science, Thammasat University.
It gives BIR students one place to find news and events, everyday student services, the club
directory, a student-life guide (for both home and international students), and a way to
contact BIRSA directly — all written natively in Thai and English, not machine-translated.

This is currently a student-run, unofficial site. For official programme matters, always use
the BIR Program and Faculty links in the footer.

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com) — design tokens defined in `app/globals.css`
- MDX content via `next-mdx-remote/rsc` + `gray-matter`, validated with [Zod](https://zod.dev)
- [Resend](https://resend.com) for optional form email delivery
- [Vitest](https://vitest.dev) for unit tests, [Playwright](https://playwright.dev) +
  [axe-core](https://github.com/dequelabs/axe-core) for accessibility/e2e tests
- [Vercel Analytics](https://vercel.com/analytics)
- Deployed on [Vercel](https://vercel.com)

## Getting started

Requires Node.js `>=18.18`.

```bash
npm install
cp .env.example .env.local   # then fill in values as needed — see table below
npm run dev
```

The site runs at `http://localhost:3000` and redirects to `/th` or `/en` depending on your
browser's language (or a previously-set cookie).

## npm scripts

| Script                 | What it does                                                  |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Start the Next.js dev server                                    |
| `npm run build`        | Production build (`next build`)                                 |
| `npm run start`        | Serve the production build (`next start`) — run `build` first  |
| `npm run lint`         | Run ESLint (`next lint`)                                        |
| `npm run typecheck`    | Run the TypeScript compiler with no output (`tsc --noEmit`)     |
| `npm run format`       | Format the repo with Prettier                                   |
| `npm run format:check` | Check formatting without writing changes                        |
| `npm run test`         | Run unit tests once (Vitest)                                     |
| `npm run test:watch`   | Run unit tests in watch mode                                     |
| `npm run e2e`          | Run Playwright end-to-end and accessibility tests                |

## Environment variables

None of these are required for the site to build or run — the contact and "start a club" forms
fall back gracefully to an "email us directly" message when email isn't configured.

| Variable               | Purpose                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Public base URL of the deployed site — used for canonical URLs, the sitemap, and hreflang.  |
| `RESEND_API_KEY`       | API key from [resend.com](https://resend.com). If unset, forms validate but don't send email. |
| `BIRSA_INBOX`          | Inbox that form submissions are delivered to (default `bir@tu.ac.th`).                      |
| `CONTACT_FROM`         | Verified "from" address Resend sends on behalf of.                                          |

## Project structure

```
app/                # Next.js App Router — all pages live under app/[lang]/...
components/         # Shared design-system components (PascalCase filenames)
content/            # All editable content: news, services, clubs, student-life, dictionaries
docs/               # This README's companion docs, including the content editing guide
lib/                # i18n, content loaders, MDX rendering, SEO helpers, validation
public/             # Static assets (logo, etc.)
tests/              # Vitest unit tests (tests/unit) and Playwright e2e tests (tests/e2e)
middleware.ts       # Locale detection and redirect logic
```

## Deploying to Vercel

1. Import this repository into Vercel.
2. Set the environment variables from the table above (all optional, but `NEXT_PUBLIC_SITE_URL`
   is recommended so canonical URLs and the sitemap point at the real domain).
3. Leave the build command as the default (`next build`) — no custom configuration is needed.

## Design principles and accessibility

The site follows the spirit of the GOV.UK Government Design Principles and Service Standard —
start with user needs, use plain language, and build in accessibility and security from the
start — but with BIRSA's own visual identity ("warm cream editorial" on BIR red), not GOV.UK's
visuals.

Accessibility target: **WCAG 2.2 AA**. See [`/standards`](http://localhost:3000/th/standards)
on the running site for the plain-language explanation of how the site is built to be usable by
everyone, including keyboard and screen-reader users.

## Editing content

BIRSA committee members who want to add or update news, services, clubs, or student-life guides
should read [`docs/EDITING.md`](docs/EDITING.md) — it covers frontmatter templates, the
placeholder-removal checklist for going live, and how publishing works.

## Repository status

This repository is private for now. It will move to a public or organisation-owned location once
BIRSA is ready to publish it more widely.
