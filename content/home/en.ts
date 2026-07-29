/**
 * Home page copy (English): authored natively, not translated.
 * See `content/home/th.ts` for the Thai version (same facts, own phrasing).
 */
export const homeEn = {
  hero: {
    heading: "Your student association, standing by you.",
    intro: "BIRSA runs events, support and representation for every BIR student.",
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
    subscribe: {
      heading: "Subscribe to this calendar",
      intro:
        "Add these dates to your own calendar app. Your app checks back for new dates on its own.",
      webcal: "Subscribe (Apple Calendar, Outlook)",
      https: "Calendar file link (Google Calendar, download)",
    },
  },
  quickLinks: {
    heading: "Popular right now",
    items: {
      getAnswer: {
        label: "Get an answer",
        description:
          "Guided answers on rules, your degree and student life. Say who you are and get the version that applies to you.",
      },
      placesNearby: {
        label: "Food and housing nearby",
        description:
          "Around 70 places to eat around Tha Prachan and Pinklao, plus dorms and condos passed down by seniors, all mapped.",
      },
      gettingStarted: {
        label: "Getting started at BIR",
        description:
          "A step-by-step checklist for new students, whether you are moving to Bangkok or already here.",
      },
      shuttleBus: {
        label: "Shuttle bus",
        description: "Live departures and timetables for the campus shuttle.",
      },
    },
  },
  activityHighlight: {
    heading: "BIRSA activity",
    intro: "Officer roles, the regulations that govern student activities, and more.",
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
    body: "Whether you've just arrived from a Thai school or you're joining us from abroad, there's a step-by-step checklist built for your first weeks at BIR.",
    cta: "Start the step-by-step checklist",
  },
};
