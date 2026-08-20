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
