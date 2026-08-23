/**
 * English UI microcopy: the `whatson` namespace.
 *
 * Wave 5 (/whats-on). News, events, the calendar, clubs and sport fixtures
 * (REDESIGN-2.0 §3.2).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/whatson.ts` is annotated against
 * `typeof whatson`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard. No em
 * dashes or colons outside clock times and URLs (docs/NEWS-STYLE.md).
 *
 * Everything here is nested under one `whatson` key rather than spread flat
 * (the way `chrome` is), so a new key added here can never collide with a
 * top-level key another in-flight namespace file happens to pick, which
 * `tests/unit/dictionary-namespaces.test.ts` would otherwise only catch after
 * the fact. Page copy that already exists in another namespace, such as
 * `dict.meta.event`/`dict.meta.when`/`dict.meta.where` (chrome) or
 * `dict.actions.contactUs` (chrome), is reused rather than duplicated here.
 */
export const whatson = {
  whatson: {
    /** The `/whats-on` hub page: four destinations, briefly. */
    hub: {
      title: "What's on",
      lede: "News, events, the calendar, clubs and sport, all from BIRSA in one place.",
      sections: {
        news: {
          title: "News",
          body: "Announcements and updates from BIRSA.",
          cta: "See all news",
        },
        events: {
          title: "Events",
          body: "Everything BIRSA is running that you can go along to.",
          cta: "See all events",
        },
        calendar: {
          title: "Calendar",
          body: "Every date in one view, with a feed you can subscribe to.",
          cta: "Open the calendar",
        },
        clubs: {
          title: "Clubs",
          body: "Find a BIR club to join, or find out who runs the rest.",
          cta: "Browse clubs",
        },
        sport: {
          title: "Sport",
          body: "BIR's sports clubs, and their fixtures when they are confirmed.",
          cta: "See sport",
        },
      },
    },

    /** `/whats-on/news`: the listing. */
    news: {
      title: "News",
      lede: "News and events from BIRSA.",
      followUsPrefix: "For anything more immediate, follow BIRSA on",
      and: "and",
      filterNav: "Filter news and events",
      typeLabel: "Type",
      allTypes: "All",
      newsType: "News",
      eventType: "Events",
      categoryLabel: "Category",
      allCategories: "All categories",
      categories: {
        announcements: "Announcements",
        events: "Events",
        community: "Community",
      } as Record<string, string>,
    },

    /** `/whats-on/news/[slug]`: the article page. */
    article: {
      detailsHeading: "Details",
      backToNews: "Back to news",
    },

    /** `/whats-on/events`: the events-only listing. */
    events: {
      title: "Events",
      lede: "Everything BIRSA is running that you can go along to.",
      empty: "No events are scheduled right now. Check back soon, or see all news instead.",
      seeNews: "See all news",
    },

    /** `/whats-on/calendar`: the month calendar and its no-JavaScript fallback list. */
    calendar: {
      title: "Calendar",
      lede: "Every BIRSA and university date in one view. Pick a month, then a day, to see what is on.",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      /** "Events on {date}": {date} is substituted. */
      selectedFor: "Events on {date}",
      noEventsDay: "Nothing is scheduled on this day.",
      /** Unused by the component itself; kept because `EventCalendarLabels` requires it. */
      open: "Read",
      eventCount: {
        one: "{n} event",
        other: "{n} events",
      },
      legend: {
        birsa: "BIRSA",
        university: "University",
      },
      styleLegend: {
        period: "Runs over several days",
        single: "One day only",
      },
      subscribe: {
        heading: "Subscribe to this calendar",
        intro: "Add every date on this calendar to your own calendar app, and it stays up to date.",
        webcal: "Subscribe",
        https: "Calendar file link",
      },
      /** The no-JavaScript fallback: a plain table of every dated item, so paging through the calendar is never the only way to see what is on. */
      upcoming: {
        heading: "Every date on this calendar",
        empty: "Nothing is scheduled yet.",
        dateHeader: "Date",
        eventHeader: "What",
        typeHeader: "Runs by",
        /** Joins a start and end date, e.g. "10 to 14 August 2026" (NEWS-STYLE §2.8: never a dash). */
        dateRangeJoiner: "to",
      },
    },

    /** `/whats-on/clubs`: the directory. */
    clubs: {
      title: "Clubs",
      lede: "Clubs are groups of BIR students with a shared interest, such as sport, music, volunteering, gaming, writing, or a model parliament. Anyone can join one, and anyone can start a new one.",
      search: "Search",
      searchPlaceholder: "Search clubs",
      category: "Category",
      allCategories: "All categories",
      showing: "Showing",
      result: "result",
      results: "results",
      noResults: "Nothing matched your filters. Try clearing them.",
      clearFilters: "Clear filters",
      openToJoin: "Open to join",
      startTitle: "Start a new club",
      startBody:
        "If a handful of you share an interest that is not covered yet, BIRSA can help you set up a new club.",
      startCta: "Start a club",
      beyondTitle: "Clubs beyond BIR",
      beyondLede:
        "Tha Prachan campus and Thammasat University run many more clubs and elected student bodies than BIR does on its own. Those are run and published by the bodies named below, not by BIRSA, so go to them directly for the current list, contact details and how to join.",
      tusuTitle: "TUSU Tha Prachan",
      tusuBody:
        "The Thammasat University Student Union, Tha Prachan branch, runs and lists Tha Prachan campus clubs and independent groups, and supports student activities across the whole campus.",
      tusuCta: "Contact TUSU Tha Prachan",
      tuscTitle: "TUSC",
      tuscBody:
        "The Thammasat University Student Council approves and reviews the budgets that clubs and student unions draw from, across all three campuses.",
      tuscCta: "Contact TUSC",
    },

    /** `/whats-on/clubs/[slug]`: the detail page. */
    clubDetail: {
      clubsLabel: "Clubs",
      meets: "Meets",
      where: "Where",
      lead: "Lead",
      contact: "Contact",
      back: "Back to clubs",
      equipment: "Equipment",
      equipmentCta: "See what this club lends out",
    },

    /** `/whats-on/sport`: fixtures. */
    sport: {
      title: "Sport",
      lede: "BIR's sports clubs, and their fixtures when a club has confirmed one.",
      noFixturesTitle: "No fixtures are published yet",
      noFixturesBody:
        "BIRSA does not currently hold a confirmed fixture list. Contact a sports club directly for its own training times and matches.",
      clubsHeading: "BIR's sports clubs",
      clubsCta: "See all clubs",
      fixtureDateHeader: "Date",
      fixtureClubHeader: "BIR club",
      fixtureOpponentHeader: "Opponent",
      fixtureVenueHeader: "Venue",
    },
  },
};
