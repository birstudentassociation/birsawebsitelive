/**
 * English UI microcopy: the `do` namespace.
 *
 * Wave 4A (service chassis). Route chrome for `/do/[service]/**`: the
 * question-step progress line, the service navigation links, the "not
 * available" and "not found" states a half-built or unknown service shows
 * instead of crashing, the status lookup's result screen, and the
 * check-answers display helpers. A service's OWN copy (its title, who it is
 * for, its question wording) lives in that service's `ServiceDefinition`
 * (`lib/services/definitions/`), never here: this file is chassis chrome
 * shared by every service, the same split `content/dictionaries/en/services.ts`
 * already draws for `StartPage`, `CheckAnswers` and the rest.
 *
 * NOT WIRED INTO `content/dictionaries/en/index.ts`. That file is a frozen
 * contract (BUILD-BRIEF-2.0 §5, owned by Wave 0) and composes a fixed list of
 * namespaces that does not yet include this one. `app/[lang]/do/dictionary.ts`
 * (owned by this wave) imports this file directly rather than going through
 * `getDictionary()`. This is a reported finding, not a silent workaround: see
 * the Wave 4A report for what adding `do` to the index would need. Written to
 * the same per-namespace shape as every other file here (a plain object, the
 * Thai file annotated against `typeof en`) so wiring it in later, once index.ts
 * is revisited, is a one-line change and not a rewrite.
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). Bilingual parity
 * is a constraint, not a courtesy (principle 14): `content/dictionaries/th/do.ts`
 * is annotated against `typeof en`, so a Thai file missing a key or inventing
 * one does not compile.
 *
 * English voice: plain, direct, warm. Short sentences. Active verbs. GOV.UK
 * guidance register: state the fact, do not describe or soften it. No em
 * dashes or colons outside clock times and URLs (docs/NEWS-STYLE.md).
 *
 * Templates carry a literal `{token}` placeholder that the calling code
 * substitutes, matching `CharacterCount`'s own convention
 * (`components/bds/CharacterCount.tsx`) rather than a full sentence, because
 * the value is only known at render time (a step number, an hour count).
 */
export const doNamespace = {
  do: {
    /** "Question {current} of {total}", filled in by the question step page. */
    stepOf: "Question {current} of {total}",
    continueLabel: "Continue",
    continuing: "Continuing…",
    confirmAndSend: "Confirm and send",
    sending: "Sending…",
    genericSubmitError: "Something went wrong. Try again, or contact BIRSA directly.",
    rateLimited: "Too many attempts. Wait a few minutes and try again.",

    serviceNav: {
      start: "Start",
      checkStatus: "Check status",
    },

    /** Shown at `/do/[service]` and every step under it when the service id does not resolve to a valid, published definition (REDESIGN-2.0 §5.2's "not configured" house rule). */
    unavailable: {
      title: "This service is not available right now",
      body: "This service has not finished being set up and cannot be used yet. Try again later, or contact BIRSA directly.",
    },

    backToServices: "Back to services",

    /** Shown when a step, or a change link, names a question that does not exist on this service. */
    stepNotFound: {
      title: "That question does not exist",
      body: "The page you tried to reach is not part of this service. Go back to the start and try again.",
    },

    /** `ConfirmationPanel`'s `heading` and `standardMessage`. `dict.service.confirmation` (frozen `services` namespace) supplies `referenceLabel` and `saveReference`; this fills the two fields that namespace does not carry. `{hours}` is `ServiceDefinition["standardHours"]`. */
    confirmation: {
      heading: "Request received",
      standardMessage: "We aim to respond within {hours} hours.",
    },

    statusLookup: {
      intro: "Enter your reference number and the detail you gave when you submitted your request.",
      referenceHint: "This was in the acknowledgement email BIRSA sent you.",
      /** The corroborating detail's question. Generic on purpose: `lib/services/status.ts` checks it against whichever field the service collected for this. */
      detailLabel: "Detail you gave, for example your email address",
      invalidBody: "Enter both your reference number and the detail you gave.",
      notFoundTitle: "We could not find a matching request",
      notFoundBody: "Check your reference number and the detail you entered, and try again.",
      errorTitle: "Something went wrong",
      errorBody: "Try again, or contact BIRSA directly.",
      resultHeading: "Your request",
      referenceLabel: "Reference number",
      statusLabel: "Status",
      submittedLabel: "Submitted on",
    },

    /** Machine states `lib/services/queue.ts` and `lib/services/status.ts` track, in the reader's own words. */
    status: {
      received: "Received",
      inProgress: "In progress",
      done: "Done",
    },

    /** Filled in by `lib/services/validate.ts`'s `formatAnswerForDisplay`. */
    checkAnswers: {
      notAnswered: "Not answered",
      yes: "Yes",
      no: "No",
      listSeparator: ", ",
    },
  },
};
