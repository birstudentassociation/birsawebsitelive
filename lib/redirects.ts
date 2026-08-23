/**
 * The 1.0 to 2.0 URL map (REDESIGN-2.0 §3.4).
 *
 * FROZEN CONTRACT. Wave 0 owns this file (§11.3 item 10). It is an IA
 * decision, not work (§11.7), so no subagent adds, removes or retargets a
 * rule; an agent that finds a route with no rule STOPS and reports.
 *
 * **No URL that works today may stop working.** This is a GDS rule and it
 * matters more here than usual, because BIRSA's links live in Instagram bios
 * and printed orientation packs that nobody can edit. A 404 on a link in last
 * year's orientation pack is not a broken page, it is a student who concludes
 * the association does not have the thing they were told it had.
 *
 * `tests/unit/redirects.test.ts` is the gate on the whole redesign: it walks
 * the 1.0 sitemap, which is generated from the same content loaders the pages
 * use, and asserts that every path either still exists in 2.0 or resolves
 * through this map to one that does. It fails the moment a wave rebuilds a
 * route family and forgets a rule.
 *
 * WHEN THIS IS WIRED UP. The map is checked in and tested from Wave 0, but it
 * is deliberately NOT applied yet: the 2.0 targets do not exist until Wave 5
 * rebuilds them, and a 301 to a route that 404s is worse than no redirect. The
 * wiring is a Wave 5 task and belongs in `next.config.mjs`'s `redirects()`,
 * not in `proxy.ts`. §3.4 says proxy.ts because that is where 1.0 put
 * path logic, but the current `proxy` matcher deliberately excludes every
 * locale-prefixed non-officer path so that ordinary pages are a pure CDN hit
 * with no middleware invocation. Widening it to catch redirects would pay a
 * function invocation on every page view to serve a static 301 the CDN can
 * serve for free. The dynamic half of §3.4, the CMS slug history, does need a
 * request-time lookup and is Wave 3's; that one belongs in proxy.ts, and the
 * two halves do not have to live in the same place.
 *
 * Paths here carry NO locale prefix. The locale segment is preserved across a
 * redirect, so a Thai reader who follows an old link stays in Thai.
 */

export type RedirectRule = {
  /** The 1.0 path, with no locale prefix and no trailing slash. */
  from: string;
  /** The 2.0 path it moves to. */
  to: string;
  /**
   * Whether descendants move with it. `/news` with `subtree: true` sends
   * `/news/welcome-week` to `/whats-on/news/welcome-week`.
   */
  subtree: boolean;
  /** Why, in the words of §3.2's table. Read at review time, not by code. */
  why: string;
};

/**
 * Ordered, most specific first. `resolveRedirect` takes the first match, so
 * `/clubs/start` must precede `/clubs` or a club proposal would be redirected
 * into the club directory.
 *
 * `/contact`, `/emergency`, `/feedback`, `/privacy`, `/standards`, `/search`
 * and `/officer` are absent on purpose: §3.2 keeps them as utilities that are
 * never nav items but are always reachable, so their URLs do not move.
 */
export const redirectRules: RedirectRule[] = [
  // --- /services becomes /do, except the two things that were never services
  {
    from: "/services/equipment-loan",
    to: "/do/equipment-loan",
    subtree: true,
    why: "§5.3: the loan service moves onto the chassis and keeps its own availability logic.",
  },
  {
    from: "/services/study-plan",
    to: "/studies/study-plan",
    subtree: true,
    why: "§3.2: the study plan is a study task, not an intake service.",
  },
  {
    from: "/services/university-services",
    to: "/help/university-services",
    subtree: true,
    why: "§3.6: this is signposting to bodies above BIRSA, which is a Get help job.",
  },
  {
    from: "/services",
    to: "/do",
    subtree: true,
    why: "§3.2: Do something. Every service, grouped by need.",
  },
  {
    from: "/quick",
    to: "/do",
    subtree: true,
    why: "§8 heuristic 7: /quick is a good power-user surface but was a header CTA rather than part of the IA. It folds into /do as its top section.",
  },

  // --- What's on
  {
    from: "/clubs/start",
    to: "/do/start-a-club",
    subtree: true,
    why: "§4.4: starting a club is an intake service and belongs under /do, not in the directory.",
  },
  {
    from: "/clubs",
    to: "/whats-on/clubs",
    subtree: true,
    why: "§3.2: What's on. News, events, the calendar, clubs, sport fixtures.",
  },
  {
    from: "/news",
    to: "/whats-on/news",
    subtree: true,
    why: "§3.2: What's on.",
  },

  // --- Get help
  {
    from: "/answers",
    to: "/help/answers",
    subtree: true,
    why: "§3.2: Get help. Smart Answers is the centrepiece of it.",
  },
  {
    from: "/activity/regulations",
    to: "/help/regulations",
    subtree: true,
    why: "§3.2 and D2: a student looking for the rules on club funding does not think 'activity'. The regulations library is one of three unrelated jobs filed under one internal label, and this is the one that is help.",
  },

  // --- The §3.6 ABSORB dispositions (docs/SCOPE-AUDIT-2.0.md §3.2 and §3.3,
  // approved by the operator 2026-08-23).
  //
  // These six documents do NOT survive at their own URL. Each one's BIR
  // specific slice is folded into a destination page and the rest is dropped
  // as content somebody else already publishes better, so the old slug has to
  // point at whichever 2.0 page absorbed it rather than at the subtree rule's
  // generic target. They are listed BEFORE the `/student-life/...` subtree
  // rules below because `resolveRedirect` takes the first match, and the
  // subtree rules would otherwise swallow them into `/help/guides` and
  // `/help/international`.
  //
  // `subtree: false` on every one: these are leaf documents under
  // `/student-life/[audience]/[slug]`, with nothing beneath them.
  //
  // These are the audit's dispositions, not a subagent's judgement. The
  // frozen-contract rule at the top of this file still holds: Wave 6's
  // dispositions agent may not touch this list.
  {
    from: "/student-life/home/getting-around",
    to: "/help/getting-started",
    subtree: false,
    why: "§3.6 ABSORB. The generic Bangkok transit content duplicates live Google Maps directions; the Rangsit routing table is the BIR specific slice and moves into Getting started.",
  },
  {
    from: "/student-life/home/getting-involved",
    to: "/whats-on/clubs",
    subtree: false,
    why: "§3.6 ABSORB. The BIR club directory is BIRSA's own and joins the rest of What's on; the TPC/TU club tables and TUSU/TUSC contacts are those bodies' information and become a signpost. D2 resolves the apparent conflict with the nav card sort: the DIRECTORY lives here, the ACT of joining is a /do service that links to it.",
  },
  {
    from: "/student-life/home/rights-and-welfare",
    to: "/help/regulations",
    subtree: false,
    why: "§3.6 ABSORB. 'The rules that apply to you' is what /help/regulations is for, and the elections half already duplicated getting-involved.mdx.",
  },
  {
    from: "/student-life/home/safety-and-emergencies",
    to: "/help/reporting",
    subtree: false,
    why: "§3.6 ABSORB. The page bundles four jobs. Harassment reporting is core BIRSA functionality and is the half that has to keep working, so the old slug follows it; river safety and scam patterns move with it as local knowledge.",
  },
  {
    from: "/student-life/home/study-support",
    to: "/help/university-services",
    subtree: false,
    why: "§3.6 ABSORB. TU library and TU-GET content with no BIR specific slice, already a second copy of what /services/university-services carried, and the two disagreed on the printing quota.",
  },
  {
    from: "/student-life/international/arrival-and-first-week",
    to: "/help/getting-started",
    subtree: false,
    why: "§3.6 ABSORB. The BIRSA welcome content and the first week setup checklist are BIR specific and belong in Getting started; the visa and enrolment items already pointed out to TU International Affairs.",
  },

  // --- Your studies
  {
    from: "/student-life/course-reviews",
    to: "/studies/course-reviews",
    subtree: true,
    why: "§3.2: Your studies.",
  },
  {
    from: "/student-life/handbook",
    to: "/studies/handbook",
    subtree: true,
    why: "§3.6 keeps the whole handbook track because it is the programme and nobody else will ever write it. §3.2 puts programme and curriculum material under Your studies.",
  },
  {
    from: "/student-life/international",
    to: "/help/international",
    subtree: true,
    why: "§3.2: Get help covers international student support. Individual documents in this track are subject to the §3.6 dispositions, which are a committee decision and are not in this file.",
  },
  {
    from: "/student-life/getting-started",
    to: "/help/getting-started",
    subtree: true,
    why: "§3.2: Get help.",
  },
  {
    from: "/student-life/home",
    to: "/help/guides",
    subtree: true,
    why: "§3.2: Get help. Individual documents here are subject to the §3.6 dispositions.",
  },
  {
    from: "/student-life",
    to: "/help",
    subtree: true,
    why: "§3.2: Get help absorbs student life as a whole.",
  },

  // --- About BIRSA
  {
    from: "/activity",
    to: "/about",
    subtree: true,
    why: "D2: 'BIRSA activity' is named after the organisation. Government Design Principle 1 is start with user needs, not government needs. Its remaining contents (role descriptions, minutes, the committee) are About.",
  },
];

/**
 * The 2.0 path for a 1.0 path, or `null` if the path does not move.
 *
 * Takes a path with NO locale prefix. Callers strip and reattach the locale
 * segment, so a Thai reader following an old link lands in Thai.
 *
 * Total and pure, so the test can walk the whole 1.0 sitemap through it.
 */
export function resolveRedirect(path: string): string | null {
  const normalized = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
  for (const rule of redirectRules) {
    if (normalized === rule.from) return rule.to;
    if (rule.subtree && normalized.startsWith(`${rule.from}/`)) {
      return `${rule.to}${normalized.slice(rule.from.length)}`;
    }
  }
  return null;
}

/**
 * Follow the map to a fixed point, giving up after a bounded number of hops.
 *
 * A rule whose target is itself a source is a redirect chain, which costs a
 * round trip and which browsers stop following at around twenty. The test
 * asserts there are none, so in practice this resolves in one hop; it exists
 * so that when the CMS slug history (§3.4) starts feeding rules in at Wave 3,
 * a chain is a caught error rather than a hang.
 */
export function resolveRedirectChain(path: string, maxHops = 5): string | null {
  let current = path;
  let moved = false;
  for (let hop = 0; hop < maxHops; hop += 1) {
    const next = resolveRedirect(current);
    if (next === null) return moved ? current : null;
    current = next;
    moved = true;
  }
  throw new Error(`Redirect chain from ${path} did not settle within ${maxHops} hops`);
}

/**
 * The 2.0 top-level route families (§3.2). Five primary destinations, each
 * named for a job, plus the utilities that are never nav items but are always
 * reachable.
 *
 * The test asserts every redirect target lands inside one of these, which is
 * what stops a rule quietly inventing a sixth top level.
 */
export const routeFamilies2_0 = [
  "/do",
  "/help",
  "/whats-on",
  "/studies",
  "/about",
  // Utilities. Never nav items, always reachable (§3.2).
  "/contact",
  "/privacy",
  "/standards",
  "/search",
  "/officer",
  "/emergency",
  "/feedback",
  "/design",
] as const;
