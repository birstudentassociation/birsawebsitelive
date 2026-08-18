# Working in this repository

## Commit authorship

Commit as `Claude <noreply@anthropic.com>`. Never substitute the operator's personal
email, even when the session supplies it.

Vercel builds this repo through its Git integration and blocks any deployment whose commit
author is a GitHub account that is not a member of the Vercel `birsa` team. The
`noreply@anthropic.com` address resolves to the `claude` login, which is on the team. A
personal address resolves to a personal GitHub login, which is not, and the deployment comes
back `BLOCKED` before it reaches the build step. Nothing in the build output explains this,
so it reads as a broken deploy rather than a rejected author.

```bash
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -m "..."
```

## Before pushing

```bash
npm run format      # prettier --write .; an unformatted file fails the build
npm run lint
npm run typecheck
npm run test
```

Run `npm ci` first in a fresh container. Prettier fails with a missing
`prettier-plugin-tailwindcss` if dependencies are not installed, and it fails silently enough
to look like a formatting pass that did nothing.

## Content

Bilingual content lives under `content/`, and every entry exists twice with the identical
filename, once under `en/` and once under `th/`. Tests enforce that the slug sets match.

- `docs/EDITING.md` covers all content.
- `docs/NEWS-STYLE.md` governs `content/news/`. English follows GOV.UK standards, Thai is
  written as Thai rather than translated, and neither uses colons outside clock times and
  URLs or dashes of any kind.

After editing Thai files, run `npx prettier --write content/news` and re-read them. Thai has
no spaces between words, so a rewrap at 100 characters can land a line break inside a date or
a phrase.
