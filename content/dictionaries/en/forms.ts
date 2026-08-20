/**
 * English UI microcopy: the `forms` namespace.
 *
 * Wave 2 (forms cluster) and Wave 7. Field labels, hints and validation messages
 * shared by every form on the site.
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/forms.ts` is annotated against
 * `typeof forms`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const forms = {
  form: {
    send: "Send message",
    sending: "Sending…",
    sent: "Message sent",
    yourName: "Your name",
    email: "Email address",
    emailHint: "We'll only use this to reply to you.",
    subject: "Subject",
    message: "Message",
    category: "What is this about?",
    privacyNote:
      "We use what you send only to answer you. We do not share it. See our privacy notice.",
    errorSummaryTitle: "There is a problem",
    genericError: "Something went wrong. Try again, or email us directly.",
    successTitle: "Thank you. Your message is on its way",
    successBody: "A member of the BIRSA committee will get back to you by email.",
    fallbackTitle: "Email is not set up yet",
    fallbackBody: "Send your message directly to:",
    errors: {
      nameRequired: "Enter your name",
      emailRequired: "Enter your email address",
      emailInvalid: "Enter an email address in the correct format, like name@example.com",
      subjectRequired: "Enter a subject",
      messageRequired: "Enter your message",
      messageShort: "Your message is a little short. Add more detail",
      categoryRequired: "Choose what this is about",
    },
  },
};
