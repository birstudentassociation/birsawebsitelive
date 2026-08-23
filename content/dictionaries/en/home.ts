/**
 * English UI copy: the `home` namespace, plus two small un-wired bundles
 * this file also carries (`doIndex`, `phaseBanner`). See "NOT WIRED INTO
 * `content/dictionaries/en/index.ts`" below before assuming
 * `getDictionary(locale).home` works.
 *
 * Wave 5A (home page and `/do` index, REDESIGN-2.0 §3.2, §8.2). Owns:
 *
 *   - `home`: the home page's own copy (`app/[lang]/page.tsx`).
 *   - `doIndex`: the `/do` service index's own copy (`app/[lang]/do/page.tsx`).
 *     Chassis chrome shared by every individual service already lives in
 *     `content/dictionaries/{en,th}/do.ts` (Wave 4A's `do` namespace); this
 *     is the index page ABOVE that, which Wave 4A's brief never owned.
 *   - `phaseBanner`: the sitewide beta banner's copy (`app/[lang]/layout.tsx`,
 *     REDESIGN-2.0 §4.5, Decision 2 in `docs/DECISIONS-2.0.md`). Not
 *     page-scoped, but this is the only namespace file this wave's brief
 *     lists, so it lives here rather than in a file this wave does not own.
 *
 * NOT WIRED INTO `content/dictionaries/en/index.ts`. That file is a frozen
 * contract (BUILD-BRIEF-2.0 §5, owned by Wave 0) and composes a fixed list
 * of namespaces that does not yet include this one, the same gap Wave 4A
 * reported for `do.ts` (read that file's own header: the orchestrator wired
 * `doNamespace` in at the wave boundary once it existed). `app/[lang]/page.tsx`,
 * `app/[lang]/do/page.tsx` and `app/[lang]/layout.tsx` (all owned by this
 * wave) import `homeNamespace` directly rather than going through
 * `getDictionary()`. Reported as a finding in the Wave 5A report, not a
 * silent workaround, exactly as Wave 4A's report did for `do`.
 *
 * One namespace bundle per domain, one file per bundle per locale, so
 * parallel agents never share a dictionary file (REDESIGN-2.0 §11.2).
 * Bilingual parity is a constraint, not a courtesy (principle 14):
 * `content/dictionaries/th/home.ts` is annotated against `typeof
 * homeNamespace`, so a Thai file missing a key or inventing one does not
 * compile.
 *
 * English voice: plain, direct, warm. Short sentences. Active verbs.
 * Sentence case everywhere, headings included. GOV.UK guidance register:
 * state the fact, do not describe or soften it. No em dashes or colons
 * outside clock times and URLs (docs/NEWS-STYLE.md).
 *
 * Every fact below is one BUILD-BRIEF-2.0 §3 already establishes (that
 * BIRSA is the BIR Student Association, that the equipment loan is free)
 * or a plain description of what a page does. Nothing here states a
 * turnaround time, a statistic or an institutional fact BUILD-BRIEF-2.0 §3
 * does not already carry.
 */
export const homeNamespace = {
  home: {
    hero: {
      /** The page's one <h1> (`app/[lang]/page.tsx`). */
      heading: "BIR Student Association",
      intro:
        "We run services for BIR students, share what's on, and represent you to the faculty. Start here.",
      /** `Button` label. The hero's one primary action (§8.2), to `/do`. */
      primaryCta: "Do something",
    },
    topTasks: {
      heading: "Popular tasks",
      /**
       * SEAM, same pattern as `Header`'s `defaultPrimaryNav`
       * (`components/bds/Header.tsx`). §8.2 asks for top tasks "chosen from
       * search-query and page-feedback data rather than committee
       * preference, and editable without a developer". Neither a search-query
       * data source nor the CMS that would make this editable exists yet
       * (`docs/DECISIONS-2.0.md` gate 1, still open), so this is a fixed,
       * documented list instead: the closest honest proxy available is
       * `content/quick.ts`'s existing "Popular right now" group, trimmed to
       * the five items whose 2.0 destination `lib/redirects.ts` already
       * confirms (read-only reference, not edited). Reported as a finding:
       * whoever wires the CMS and real usage data replaces this object, not
       * the page that reads it.
       */
      items: {
        borrowEquipment: {
          label: "Borrow equipment",
          hint: "Free loans of BIRSA equipment.",
        },
        gettingStarted: {
          label: "Getting started at BIR",
          hint: "A step by step guide for new students.",
        },
        courseReviews: {
          label: "Course reviews",
          hint: "See what other students think of a course before you choose it.",
        },
        joinAClub: {
          label: "Join a club",
          hint: "Find a club to join, or see how to start your own.",
        },
        whatsOn: {
          label: "What's on",
          hint: "News and events from BIRSA.",
        },
      },
    },
    whatsOn: {
      heading: "What's on",
      seeAll: "See all news and events",
    },
  },

  doIndex: {
    /** The page's one <h1>. */
    title: "Do something",
    lede: "Every BIRSA service in one place, grouped by what you need.",
    /** `PageHeader`'s mandatory `helpSlot` (WCAG 3.2.6). A plain link to `/help`. */
    helpLabel: "Get help choosing",
    categories: {
      borrow: "Borrow something",
      signUp: "Sign up",
      tellUs: "Tell us something",
      other: "Other services",
    },
    /**
     * Curated links, not driven by `listServices()`. Decision 2
     * (`docs/DECISIONS-2.0.md`) puts joining a club under "Do something"
     * while the clubs directory itself lives at `/whats-on/clubs`, owned by
     * another wave: "the clubs DIRECTORY lives at /whats-on/clubs... the ACT
     * of joining is a service under /do that links to it." `contact` is the
     * honest equivalent for "tell us something": `/contact` is a real,
     * already-live utility route (`docs/ROUTE-MAP-2.0.md`, "routes that do
     * not move"), not an invented service.
     */
    staticLinks: {
      joinClub: {
        label: "Join a club",
        hint: "Browse clubs and find out how to join one.",
      },
      contact: {
        label: "Contact BIRSA",
        hint: "Send a message to the committee.",
      },
    },
  },

  phaseBanner: {
    phaseLabel: "Beta",
    message: "This is the new BIRSA site. Some pages are still being finished.",
    feedbackLabel: "Give feedback on this site",
  },
};
