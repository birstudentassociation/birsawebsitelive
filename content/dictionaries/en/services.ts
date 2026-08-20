/**
 * English UI microcopy: the `services` namespace.
 *
 * Wave 2 (service cluster). Chassis chrome shared by every service built on
 * `lib/services/defineService.ts`: the start page, check answers, the
 * confirmation panel, status lookup, task lists, the exit-this-page control
 * and interruption pages. This is generic, reusable microcopy the chassis
 * components (`components/bds/StartPage.tsx` and its siblings) take as
 * props; it is not any one service's copy; a service's own title, questions
 * and "who this is for" text live in that service's own definition, not
 * here.
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English
 * tree is the shape; `content/dictionaries/th/services.ts` is annotated
 * against `typeof services`, so the compiler rejects a Thai file that is
 * missing a key or has invented one. Bilingual parity is a constraint, not a
 * courtesy (principle 14).
 *
 * English voice: plain, direct, warm. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard. No em
 * dashes or colons outside clock times and URLs (docs/NEWS-STYLE.md).
 */
export const services = {
  service: {
    startPage: {
      beforeHeading: "Before you begin",
      howLongHeading: "How long it takes",
      whatNextHeading: "What happens next",
      startCta: "Start now",
    },
    checkAnswers: {
      heading: "Check your answers",
      changeLabel: "Change",
    },
    confirmation: {
      referenceLabel: "Your reference number",
      saveReference:
        "Save this reference number. You will need it to check your request, because BIRSA services do not use accounts.",
    },
    statusLookup: {
      heading: "Check the status of a request",
      submitLabel: "Check status",
    },
    taskList: {
      notStarted: "Not started",
      inProgress: "In progress",
      cannotStartYet: "Cannot start yet",
      completed: "Completed",
    },
    interruptionPage: {
      continueLabel: "Continue",
      secondaryLabel: "I do not want to continue",
    },
    exitThisPage: {
      label: "Leave this page now",
      shortcutHint: "Press the Shift key three times in a row to leave this page quickly.",
      leavingAnnouncement: "Leaving.",
    },
  },
};
