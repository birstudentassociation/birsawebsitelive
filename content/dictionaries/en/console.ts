/**
 * English UI microcopy: the `console` namespace.
 *
 * Wave 4C (console lift). Officer-facing strings. WCAG 2.2 AA applies to these
 * exactly as it does to the public site (REDESIGN-2.0 §9).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/console.ts` is annotated against
 * `typeof officerConsole`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const officerConsole = {
  officerHub: {
    metaTitle: "Officer console",
    metaDescription:
      "Where BIRSA officers sign in to manage equipment loans, officer access and the site's other online services.",
    title: "Officer console",
    lede: "Sign in to manage equipment loans, officer access and BIRSA's other online services.",
    authNotConfiguredTitle: "Officer accounts are not set up yet",
    authNotConfiguredBody: "Nobody can sign in to the officer console yet.",
    greeting: "Signed in as {name}.",
    inventoryTitle: "Equipment and loans",
    inventoryBody: "The CBEMS catalogue, loan requests, borrowers and reports.",
    accessTitle: "Access register",
    accessBody: "Every officer account, their portfolio, and when their access ends.",
    studioTitle: "Content Studio",
    studioBody: "Where officers edit pages and articles.",
    studioUnavailableTag: "Not available yet",
    studioUnavailableBody: "BIRSA has not set up a separate sign in for editing pages yet.",
  },
  officerAccess: {
    metaTitle: "Access register",
    metaDescription:
      "Every officer account and what it holds, plus the daily check for access that has drifted.",
    title: "Access register",
    lede: "Every officer account and what it holds, plus who can edit pages once the Studio is connected.",
    consoleHomeLabel: "Officer console",
    signInNeededTitle: "Sign in first",
    signInNeededBody: "Sign in on the officer console home page to see the access register.",
    signInLink: "Go to the officer console",
    adminsOnlyTitle: "Administrators only",
    adminsOnlyBody:
      "Only officers with the administrator role can see the access register. It lists everyone's personal details.",
    dbNotConfiguredTitle: "The officer database is not connected",
    dbNotConfiguredBody: "POSTGRES_URL is not configured, so there is no register to show yet.",
    officersHeading: "Officers",
    officersLede: "Every account that can sign in to the officer console.",
    officersCaption: "Officer accounts",
    officersEmpty: "There are no officer accounts yet.",
    colName: "Name",
    colEmail: "Email",
    colRole: "Console role",
    colPortfolio: "Portfolio",
    colTermEnd: "Term ends",
    colStatus: "Status",
    statusActive: "Active",
    statusInactive: "Inactive",
    noPortfolioText: "None set (global officer)",
    unrecognisedPortfolioSuffix: "(not a recognised portfolio)",
    noTermEndText: "No end date set",
    termEndedSuffix: "Term ended",
    studioHeading: "Content Studio",
    studioBlockedTitle: "The Studio is not connected yet",
    studioBlockedBody:
      "BIRSA has not applied for its Sanity hosting plan yet, so there is no Studio project to read membership from. This register cannot show who can edit pages and articles until that is set up. It will list Studio members here, alongside officers, as soon as it can.",
    driftHeading: "Access drift",
    driftLede: "What the daily check found.",
    pastTermEndHeading: "Past their term end",
    pastTermEndEmpty: "No officer is past their term end.",
    noTermEndHeading: "No term end set",
    noTermEndEmpty: "Every active officer has a term end date.",
    underStaffedHeading: "Held by fewer than two people",
    underStaffedEmpty: "Every capability is held by at least two people.",
    underStaffedCapabilityCol: "Capability",
    underStaffedHoldersCol: "Held by",
    studioDriftHeading: "Studio members without an officer account",
    studioDriftBlockedBody: "This check cannot run yet. It needs the Studio connection above.",
    studioDriftEmpty: "Every Studio member also has an officer account.",
  },
};
