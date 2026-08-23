/**
 * English UI microcopy: the `help` namespace.
 *
 * Wave 5 (/help). Smart Answers, guides, the rules that apply to you, reporting,
 * welfare, international student support, and emergency mode (REDESIGN-2.0 §3.2).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/help.ts` is annotated against
 * `typeof help`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const help = {
  /** Breadcrumb root label for the whole /help family, after the site name. */
  sectionLabel: "Get help",

  hub: {
    title: "Get help",
    lede: "Smart Answers, the rules that apply to you, reporting, welfare, and support for international students.",
  },

  /**
   * `ExitThisPage` copy, shared by every welfare, reporting and rights page
   * (REDESIGN-2.0 §4.4). `exitHref` and `historyDecoyHref` stay page props;
   * only the visible and announced text lives here, so every page that
   * carries the control says the same thing.
   */
  exitThisPage: {
    label: "Leave this page now",
    shortcutHint: "Press Shift three times in a row to leave this page immediately.",
    leavingAnnouncement: "Leaving now.",
  },

  /**
   * `InterruptionPage` copy shared by the welfare and reporting flows
   * (REDESIGN-2.0 §4.3b `interruption-pages`). The boundary content itself
   * is written per page; only the two forward actions are common.
   */
  interruption: {
    continueLabel: "Continue",
    secondaryLabel: "I do not want to continue",
  },

  /** Shared copy for the §3.6 signpost page type. */
  signpost: {
    /** Label above the block naming who actually owns the rest of the picture. */
    whoToAskLabel: "Who to ask",
    /** Label on the outbound link to the authoritative source. */
    visitLabel: "Visit",
  },

  guidesIndex: {
    title: "Guides",
    lede: "Short pages that say what BIRSA knows and point you to whoever actually runs the rest.",
  },

  internationalIndex: {
    title: "International student support",
    lede: "Where BIRSA can help directly, and where TU International Affairs is the office that actually decides.",
  },

  emergencyBanner: {
    cta: "Read the emergency guidance",
  },

  emergencyPage: {
    breadcrumb: "Emergency",
    atAGlance: "At a glance",
    alertLevel: "Alert level",
    doThisFirst: "Do this first",
    keyNumbers: "Key numbers",
    severity: {
      critical: "Critical",
      warning: "Warning",
      info: "Advisory",
    },
    whatToDo: "What to do now",
    usefulContacts: "Useful contacts",
    birsaContacts: "Contact BIRSA",
    phone: "Phone",
    address: "Address",
    disclaimer:
      "This is general guidance from a student-run site. In an emergency, always follow the instructions of the emergency services and Thammasat University.",
    noActiveTitle: "No active emergency",
    noActiveLede: "There is no emergency affecting the faculty right now.",
    noActiveBody:
      "If you have an urgent safety concern, contact the emergency services directly: police 191, medical 1669, fire 199.",
    backHome: "Go to the home page",
  },
};
