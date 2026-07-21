/**
 * Home page copy (English): authored natively, not translated.
 * See `content/home/th.ts` for the Thai version (same facts, own phrasing).
 */
export const homeEn = {
  hero: {
    heading: "Your student association, standing by you.",
    intro:
      "BIRSA runs events, support and representation for every BIR student. You can find the latest updates, clubs, and practical help here.",
    primaryCta: "Quick actions",
    secondaryCta: "Information and services",
  },
  whatsOn: {
    heading: "What's on",
    seeAll: "See all",
  },
  calendar: {
    heading: "Activity calendar",
    intro:
      "Key dates for BIR students this term. Tap a highlighted day to see what's happening and read more.",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    selectedFor: "On {date}",
    noEventsDay: "Nothing scheduled on this day.",
    open: "Read",
    // Screen-reader suffix on a day cell, appended after the date. `{n}` is the
    // number of events on that day; `one` is used when n === 1.
    eventCount: {
      one: "{n} event",
      other: "{n} events",
    },
    legend: {
      birsa: "BIRSA activities",
      academic: "Academic dates",
      university: "University and faculty",
    },
    styleLegend: {
      period: "Multi-day period",
      single: "Single-day event",
    },
  },
  quickLinks: {
    heading: "Get around",
    items: {
      activity: {
        label: "BIRSA activity",
        description: "Officer roles, student regulations, transparency documents, and news.",
      },
      clubs: {
        label: "Clubs",
        description: "Find a club to join, or see how to start your own.",
      },
      informationServices: {
        label: "Information and services",
        description:
          "Equipment loans and guides for settling in, whether you're a home or international student.",
      },
      news: {
        label: "What's on",
        description: "The latest news and events from BIRSA.",
      },
    },
  },
  activityHighlight: {
    heading: "BIRSA activity",
    intro:
      "The section that explains who runs BIRSA and how: officer roles, the regulations that govern student activities, and more.",
    items: {
      roles: {
        label: "Officer roles",
        description: "Who sits on the BIRSA committee, and what each role is responsible for.",
      },
      regulations: {
        label: "Student regulations",
        description:
          "The University's regulations and Faculty Notice on student activities and discipline.",
      },
      overview: {
        label: "BIRSA activity",
        description:
          "Officer roles, student regulations, transparency documents, and news, all in one place.",
      },
    },
  },
  newHere: {
    title: "New here?",
    body: "Whether you've just arrived from a Thai school or you're joining us from abroad, our student-life guide has a track built for you.",
    cta: "Go to Information and services",
  },
};
