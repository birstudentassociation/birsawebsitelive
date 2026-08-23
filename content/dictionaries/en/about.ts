/**
 * English UI microcopy: the `about` namespace.
 *
 * Wave 5 (/about). Committee, commitments, minutes, decisions, budget, elections
 * and how to reach a portfolio (REDESIGN-2.0 §3.2).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/about.ts` is annotated against
 * `typeof about`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 *
 * Everything here is nested under one `about` key rather than spread flat
 * (the way `chrome` is), matching `whatson`'s pattern, so a new key added
 * here can never collide with a top-level key another in-flight namespace
 * file happens to pick.
 */
export const about = {
  about: {
    /** The `/about` hub page. */
    hub: {
      title: "About BIRSA",
      lede: "Who sits on the committee, what BIRSA has decided, what it has spent, and how to reach the portfolio that handles what you need.",
      sections: {
        committee: {
          title: "Committee",
          body: "Every officer and assistant officer currently serving.",
          cta: "See the committee",
        },
        portfolios: {
          title: "Portfolios",
          body: "The standing jobs BIRSA is organised around, and who to contact for each one.",
          cta: "See all portfolios",
        },
        thisYear: {
          title: "This year",
          body: "How BIRSA's work becomes visible as it happens.",
          cta: "Read more",
        },
        minutes: {
          title: "Minutes",
          body: "What was discussed at committee meetings, and when the next one is.",
          cta: "Read minutes",
        },
        decisions: {
          title: "Decisions",
          body: "What the committee has decided, and what each decision changed.",
          cta: "See decisions",
        },
        budget: {
          title: "Budget",
          body: "What BIRSA has taken in and spent, by portfolio.",
          cta: "See the budget",
        },
        elections: {
          title: "Elections",
          body: "How BIRSA is elected, and who runs the election.",
          cta: "Read about elections",
        },
      },
    },

    /** `/about/committee`: the full roster. */
    committee: {
      title: "Committee",
      lede: "Officers first, then the assistant officers who support them. BIRSA does not publish a photograph of a committee member without their written consent, so most rows show a placeholder rather than a photograph.",
    },

    /** `/about/portfolios`: the directory. */
    portfolios: {
      title: "Portfolios",
      lede: "A portfolio is a standing job, not a person. Every portfolio at BIRSA is held by at least one committee member; most are held by two or more, so nobody is the only person who can answer for it.",
      holderCount: {
        one: "1 holder",
        other: "{n} holders",
      },
    },

    /** `/about/portfolios/[portfolio]`: one portfolio's holders and how to reach it. */
    portfolioDetail: {
      backToPortfolios: "Back to portfolios",
      holdersHeading: "Who holds this portfolio",
      singleHolderNote:
        "This portfolio currently has one holder rather than two. BIRSA's own rule is that every portfolio is held by at least two people, so this is a gap, shown here rather than hidden.",
      contactHeading: "How to reach this portfolio",
      roleEmailIntro: "Email this portfolio directly.",
      noRoleEmail:
        "This portfolio has no dedicated email address published yet. Contact BIRSA generally instead, and ask for this portfolio by name.",
      generalContactCta: "Contact BIRSA",
    },

    /** `/about/this-year`: how BIRSA's work becomes visible. */
    thisYear: {
      title: "This year",
      lede: "BIRSA does not publish a separate essay about its plans for the year. The concrete record is what actually happens: decisions the committee makes, and the minutes those decisions come from.",
      body: "As the committee meets and decides things, both appear here as they are published. Checking decisions and minutes over the year is a more reliable picture of what BIRSA has actually done than a plan written in August.",
      decisionsCta: "See decisions",
      minutesCta: "See minutes",
    },

    /** `/about/minutes`: the index. */
    minutesIndex: {
      title: "Minutes",
      lede: "What committee meetings discussed, publicly. Some agenda items are withheld, and this page says so plainly rather than hiding the gap.",
      empty: "BIRSA has not published any minutes yet.",
      dateHeader: "Date",
      titleHeader: "Meeting",
    },

    /** `/about/minutes/[slug]`: one meeting's minutes. */
    minutesDetail: {
      backToMinutes: "Back to minutes",
      meetingDateLabel: "Meeting date",
      publicSummaryHeading: "Public summary",
      withheldHeading: "Withheld items",
      withheldIntro:
        "The items below were discussed at this meeting but are not published. Each is shown by its agenda item number and the general kind of matter it concerned, never by its content.",
      withheldItemLabel: "Item {n}",
      notFound: "BIRSA has not published minutes with this name.",
      categories: {
        welfare: "A welfare matter",
        disciplinary: "A disciplinary matter",
        personnel: "A personnel matter",
        "legal-advice": "Legal advice",
        "other-confidential": "Another confidential matter",
      },
    },

    /** `/about/decisions`: the index. */
    decisionsIndex: {
      title: "Decisions",
      lede: "What the committee has decided, and what each decision changed. Every decision here is answerable to a named portfolio.",
      empty: "BIRSA has not published any decisions yet.",
      dateHeader: "Date",
      titleHeader: "Decision",
    },

    /** `/about/decisions/[slug]`: one decision. */
    decisionDetail: {
      backToDecisions: "Back to decisions",
      dateLabel: "Decided on",
      portfolioLabel: "Portfolio",
      meetingLabel: "From the meeting of",
      summaryHeading: "What was decided",
      whatChangedHeading: "What it changed",
      notFound: "BIRSA has not published a decision with this name.",
    },

    /** `/about/budget`: entries and the computed total. */
    budget: {
      title: "Budget",
      lede: "Every published item of income and spending, by portfolio. The totals below are calculated from these entries, not typed in separately, so they always match the rows above them.",
      empty: "BIRSA has not published any budget entries yet.",
      tableCaption: "Published budget entries",
      dateHeader: "Date",
      descriptionHeader: "Description",
      portfolioHeader: "Portfolio",
      directionHeader: "Direction",
      amountHeader: "Amount, baht",
      direction: {
        income: "Income",
        expense: "Expense",
      },
      totalsHeading: "Totals",
      totalIncomeLabel: "Total income",
      totalExpenseLabel: "Total expense",
      netLabel: "Net",
    },

    /** `/about/elections`: how BIRSA is elected. */
    elections: {
      title: "Elections",
      lede: "BIRSA's committee is elected under the Faculty's own regulation, run by a committee set up for that purpose rather than by BIRSA itself.",
      committeeHeading: "The election committee",
      committeeBody:
        "Elections are run by the BIR Election Committee, known by its Thai abbreviation กกต.BIR, chaired by a Faculty administrator rather than a student. This keeps the body that runs the election separate from the students standing in it.",
      timingHeading: "When elections happen",
      timingBody:
        "The regulation requires the election committee to be formed within thirty days of the second semester opening, though the Dean can extend that if there is good reason to.",
      resultsHeading: "Results",
      resultsBody:
        "Once an election is complete, the result becomes a decision, published on the decisions page like any other.",
      resultsCta: "See decisions",
      regulationCta: "Read the full regulation",
    },
  },
};
