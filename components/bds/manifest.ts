/**
 * The BIRSA Design System component manifest (REDESIGN-2.0 §4.1, §4.3, §11.3).
 *
 * FROZEN CONTRACT. Wave 0 owns this file. Subagents READ it. An agent that
 * believes an entry is wrong STOPS and reports; it does not edit (§11.1).
 *
 * §4.1: "the failure mode is not building the components. It is the twelfth
 * module quietly inventing a thirteenth kind of box." This file is the answer
 * to that. It is the single enumeration of what the system contains, and three
 * separate mechanisms read it rather than a human remembering:
 *
 *   - `/design`, the public reference page, renders one entry per component
 *     from this list, so a component cannot be on the site and absent from the
 *     reference (§4.1, and §11.6 point 5: "a component that shipped without an
 *     entry there has not shipped").
 *   - `tests/unit/bds-manifest.test.ts` asserts that every entry has a file,
 *     every file has an entry, and no two Wave 2 agents own the same one,
 *     which is Rule 2 (§11.2) made checkable instead of reviewed.
 *   - The per-component axe assertion on `/design` iterates this list, so a
 *     component is accessible before it is used rather than after it ships on
 *     nine pages (§4.1).
 *
 * `usage` is the rule §4.1 asks every component to carry: what to use INSTEAD.
 * The existing `NavList` doc comment is the template. A component whose usage
 * rule does not say what to reach for instead has not answered the question
 * that causes the twelfth module to invent the thirteenth box.
 */

/**
 * The Wave 2 clusters (§11.4). One agent per cluster, and a cluster is the
 * unit of file ownership: an agent creates and modifies the files of its own
 * cluster and no other.
 */
export const clusters = ["forms", "navigation", "status", "content", "service", "media"] as const;

export type Cluster = (typeof clusters)[number];

export type ManifestEntry = {
  /** The component name, which is also its file name in `components/bds/`. */
  name: string;
  cluster: Cluster;
  /**
   * The `govuk-frontend` 6.4.0 component this implements, or `null` where it
   * is BIRSA-specific with no GDS equivalent. Names verified against the
   * package's own component directory (§4.3), not remembered.
   */
  gds: string | null;
  /**
   * What 2.0 does with it, in the words of §4.3's table. `new` entries are the
   * ones that change what BIRSA can offer and deserve the most review.
   */
  status: "new" | "keep" | "rebuild" | "generalise" | "split" | "merge";
  /** The 1.0 component it comes from, where there is one. */
  from: string | null;
  /** What to use instead. §4.1: every component carries this or it is not done. */
  usage: string;
};

export const manifest: ManifestEntry[] = [
  // --- forms -------------------------------------------------------------
  // §4.3 splits 1.0's single `Field.tsx` into named components over a shared
  // field wrapper, because each one also becomes a question type in the §6.7
  // palette and a question type needs its own validation and its own
  // accessibility surface.
  {
    name: "FormField",
    cluster: "forms",
    gds: null,
    status: "new",
    from: "Field.tsx",
    usage:
      "The shared label, hint, error and describedby wiring every control sits in. Never used alone: reach for the named control, which renders through this.",
  },
  {
    name: "TextInput",
    cluster: "forms",
    gds: "text-input",
    status: "split",
    from: "Field.tsx",
    usage:
      "One short answer on a line. Use Textarea past a sentence, and CharacterCount when there is a limit worth showing.",
  },
  {
    name: "Textarea",
    cluster: "forms",
    gds: "textarea",
    status: "split",
    from: "Field.tsx",
    usage: "More than a sentence. Wrap in CharacterCount wherever a length limit applies.",
  },
  {
    name: "CharacterCount",
    cluster: "forms",
    gds: "character-count",
    status: "new",
    from: null,
    usage:
      "A length limit the reader needs to see as they type. Needed for free-text intake (§4.3). Not for limits so generous nobody reaches them, which is noise.",
  },
  {
    name: "Radios",
    cluster: "forms",
    gds: "radios",
    status: "split",
    from: "Field.tsx",
    usage:
      "Pick exactly one from a set you can show. Use Select past about eight options and only when the list is familiar, like a country.",
  },
  {
    name: "Checkboxes",
    cluster: "forms",
    gds: "checkboxes",
    status: "split",
    from: "Field.tsx",
    usage:
      "Pick any number, including none. One checkbox alone is a yes-or-no question: use Radios.",
  },
  {
    name: "Select",
    cluster: "forms",
    gds: "select",
    status: "split",
    from: "Field.tsx",
    usage:
      "A long, familiar list where the reader knows what they are looking for. Prefer Radios: a select hides its options and is poor on a phone.",
  },
  {
    name: "DateInput",
    cluster: "forms",
    gds: "date-input",
    status: "generalise",
    from: "DatesStepForm.tsx",
    usage:
      "One date the reader knows, as three fields. Never a date picker: a picker is worse for a date somebody already knows, like a birthday.",
  },
  {
    name: "DateRangeInput",
    cluster: "forms",
    gds: "date-input",
    status: "generalise",
    from: "DatesStepForm.tsx",
    usage: "A from-and-to pair. Carries the loan date logic; anything else uses two DateInputs.",
  },
  {
    name: "FileUpload",
    cluster: "forms",
    gds: "file-upload",
    status: "generalise",
    from: "PhotoUpload.tsx",
    usage:
      "A file the reader has to supply, such as a reimbursement receipt. Always into Vercel Blob, never into the CMS (§6.3), and always under a retention path.",
  },
  {
    name: "Fieldset",
    cluster: "forms",
    gds: "fieldset",
    status: "new",
    from: "inline",
    usage:
      "Groups controls that answer one question together, with a legend as the question. Radios and Checkboxes render their own; reach for this only when grouping several controls.",
  },
  {
    name: "ErrorMessage",
    cluster: "forms",
    gds: "error-message",
    status: "keep",
    from: "ErrorSummary.tsx",
    usage: "The inline message beside the field. Always paired with an ErrorSummary at the top.",
  },
  {
    name: "ErrorSummary",
    cluster: "forms",
    gds: "error-summary",
    status: "keep",
    from: "ErrorSummary.tsx",
    usage:
      "Every failed submit, at the top of the page, taking focus. Already implemented correctly in 1.0 (§8 heuristic 9); do not regress the focus management.",
  },
  {
    name: "PasswordInput",
    cluster: "forms",
    gds: "password-input",
    status: "keep",
    from: "OfficerLogin.tsx",
    usage:
      "Officer login only. Already correct for WCAG 3.3.8: a real password field, autoComplete=current-password, no paste blocking. Do not add a CAPTCHA (§9).",
  },

  // --- navigation --------------------------------------------------------
  {
    name: "Header",
    cluster: "navigation",
    gds: "header",
    status: "rebuild",
    from: "Header.tsx",
    usage:
      "Site chrome, once per page. Rebuilt around the §3.2 IA with its link groups editable (§3.3). Look at govuk-frontend 6's `generic-header` before rebuilding, not after (§4.3).",
  },
  {
    name: "Footer",
    cluster: "navigation",
    gds: "footer",
    status: "rebuild",
    from: "Footer.tsx",
    usage: "Site chrome, once per page. Link groups are editable documents, not code (§3.3).",
  },
  {
    name: "ServiceNavigation",
    cluster: "navigation",
    gds: "service-navigation",
    status: "new",
    from: null,
    usage:
      "A second bar below the header, scoped to the current service, carrying its start, status and help links. This is the piece 1.0 was missing and what makes /do viable at eleven services rather than two (§3.5). Sets --bds-service-nav-height.",
  },
  {
    name: "Breadcrumbs",
    cluster: "navigation",
    gds: "breadcrumbs",
    status: "keep",
    from: "Breadcrumbs.tsx",
    usage: "Where a page sits in the IA. Not a substitute for a BackLink inside a wizard.",
  },
  {
    name: "BackLink",
    cluster: "navigation",
    gds: "back-link",
    status: "new",
    from: null,
    usage:
      "Every wizard step. The correct GDS answer for going back one question, rather than leaving the reader to use browser-back against a draft cookie (§8 heuristic 3).",
  },
  {
    name: "SkipLink",
    cluster: "navigation",
    gds: "skip-link",
    status: "keep",
    from: "SkipLink.tsx",
    usage: 'First focusable thing on every page, targeting <main id="main">.',
  },
  {
    name: "Pagination",
    cluster: "navigation",
    gds: "pagination",
    status: "keep",
    from: "Pager.tsx",
    usage: "A list longer than one page. Never infinite scroll: it breaks the footer and Back.",
  },
  {
    name: "LanguageToggle",
    cluster: "navigation",
    gds: null,
    status: "keep",
    from: "LanguageToggle.tsx",
    usage:
      "A plain link to the same page in the other language. Never a dropdown, and never a flag: a flag is a country, not a language.",
  },
  {
    name: "ThemeToggle",
    cluster: "navigation",
    gds: null,
    status: "keep",
    from: "ThemeToggle.tsx",
    usage: "Site chrome. Respects the system setting until the reader chooses otherwise.",
  },

  // --- status ------------------------------------------------------------
  // §8 heuristic 4: 1.0 had four kinds of box with overlapping jobs and no
  // rule. These entries are that rule.
  {
    name: "Notice",
    cluster: "status",
    gds: null,
    status: "split",
    from: "Notice.tsx",
    usage:
      "Inline content that needs setting apart within a page's flow. NOT a result: a page-level outcome is a NotificationBanner, an aside is InsetText, and a consequence is WarningText.",
  },
  {
    name: "NotificationBanner",
    cluster: "status",
    gds: "notification-banner",
    status: "split",
    from: "Notice.tsx",
    usage:
      "A page-level result of something the reader just did, at the top, taking focus where it is important. Not for standing information, which is InsetText.",
  },
  {
    name: "WarningText",
    cluster: "status",
    gds: "warning-text",
    status: "split",
    from: "Notice.tsx",
    usage:
      "A consequence the reader must not miss, with the exclamation icon. Reserve it: a page of warnings warns nobody.",
  },
  {
    name: "InsetText",
    cluster: "status",
    gds: "inset-text",
    status: "split",
    from: "Notice.tsx",
    usage: "A quoted or emphasised aside. It is not a status message; those are the three above.",
  },
  {
    name: "Panel",
    cluster: "status",
    gds: "panel",
    status: "keep",
    from: "ResultPanel.tsx",
    usage:
      "The confirmation at the end of a service, carrying the reference number. One per page, and the reference is the largest thing on it (§8 heuristic 6).",
  },
  {
    name: "Tag",
    cluster: "status",
    gds: "tag",
    status: "merge",
    from: "Tag.tsx, StatusPill.tsx",
    usage:
      "The state of one thing in a list or on a TaskList. 1.0 had two components for this; there is now one. Never colour alone: the word is the meaning.",
  },
  {
    name: "PhaseBanner",
    cluster: "status",
    gds: "phase-banner",
    status: "new",
    from: null,
    usage:
      "An area that is rebuilt but not yet trusted, with a feedback link. Its text and its on/off state are editable, so removing it does not need a developer (§4.5).",
  },
  {
    name: "EmergencyBanner",
    cluster: "status",
    gds: null,
    status: "keep",
    from: "EmergencyBanner.tsx",
    usage:
      "Site-wide, driven by Edge Config, deliberately independent of the CMS and the database (§6.6). Never rendered for anything short of an emergency.",
  },

  // --- content -----------------------------------------------------------
  {
    name: "Button",
    cluster: "content",
    gds: "button",
    status: "keep",
    from: "Button.tsx",
    usage:
      "An action. Add the `start` variant for service start pages. A link that navigates is a link, styled as one.",
  },
  {
    name: "Card",
    cluster: "content",
    gds: null,
    status: "keep",
    from: "Card.tsx",
    usage:
      "A listing item carrying dates, tags or images. When the job is only 'pick where to go next', use NavList.",
  },
  {
    name: "NavList",
    cluster: "content",
    gds: null,
    status: "keep",
    from: "NavList.tsx",
    usage:
      "Wherever the job is 'pick where to go next'. Card stays for listings that carry dates, tags or images. (Carried over verbatim from 1.0: §4.1 names this comment as the template for every usage rule.)",
  },
  {
    name: "Accordion",
    cluster: "content",
    gds: "accordion",
    status: "rebuild",
    from: "Accordion.tsx",
    usage:
      "Question and answer pairs the reader skims. Rebuilt on native <details>. Never for content the reader needs all of.",
  },
  {
    name: "Details",
    cluster: "content",
    gds: "details",
    status: "rebuild",
    from: "inline",
    usage: "One disclosure of secondary detail. Several of them in a row is an Accordion.",
  },
  {
    name: "SummaryList",
    cluster: "content",
    gds: "summary-list",
    status: "generalise",
    from: "SummaryRow.tsx",
    usage:
      "Answers the reader can check and change, on a check-answers page. Its card variant is what the officer console needs for a record.",
  },
  {
    name: "Table",
    cluster: "content",
    gds: "table",
    status: "rebuild",
    from: "inline in .prose",
    usage:
      "Tabular data only, with a real <th scope>. Must behave at 320px: it scrolls in its own container, the page never does.",
  },
  {
    name: "PageHeader",
    cluster: "content",
    gds: null,
    status: "keep",
    from: "PageHeader.tsx",
    usage:
      "Every page. Its helpSlot implements WCAG 3.2.6 consistent help and is MANDATORY in 2.0 rather than optional: 1.0 had it right and most pages passed nothing (§8 heuristic 10).",
  },
  {
    name: "PageFeedback",
    cluster: "content",
    gds: null,
    status: "keep",
    from: "PageFeedback.tsx",
    usage:
      "Every page. One of the three data sources §2 principle 3 permits. Never on a welfare or reporting page, where being observed is the reason someone does not report.",
  },
  {
    name: "ExternalLink",
    cluster: "content",
    gds: null,
    status: "keep",
    from: "ExternalLink.tsx",
    usage:
      "Any link off the site. Registers in the external link register (§3.6) so the daily cron can find it when it dies.",
  },
  {
    name: "Email",
    cluster: "content",
    gds: null,
    status: "keep",
    from: "Email.tsx",
    usage: "An address the reader may want to copy or open. Never a raw mailto in prose.",
  },
  {
    name: "VisuallyHidden",
    cluster: "content",
    gds: null,
    status: "keep",
    from: "VisuallyHidden.tsx",
    usage:
      "Text for assistive technology only. If sighted readers would also benefit, it is not hidden text, it is missing text.",
  },

  // --- service UI --------------------------------------------------------
  {
    name: "StartPage",
    cluster: "service",
    gds: null,
    status: "new",
    from: null,
    usage:
      "The one entry point to every service (§5.1 item 1, GDS `start-pages`). Says what it does, who it is for, what you need, how long, and what happens next. Also where `check-a-service-is-suitable` tells a student this is not for them before six pages of questions.",
  },
  {
    name: "CheckAnswers",
    cluster: "service",
    gds: null,
    status: "new",
    from: null,
    usage:
      "The last step before submitting anything (§5.1 item 3). Must not re-ask what the wizard already holds (WCAG 3.3.7 redundant entry).",
  },
  {
    name: "ConfirmationPanel",
    cluster: "service",
    gds: "panel",
    status: "new",
    from: "ResultPanel.tsx",
    usage:
      "After a successful submission, wrapping Panel with the reference number and the service standard. Says explicitly to save the reference, because the status lookup will ask for it (§8 heuristic 6).",
  },
  {
    name: "StatusLookup",
    cluster: "service",
    gds: null,
    status: "new",
    from: null,
    usage:
      "Reference number plus one corroborating detail, no account (§5.1 item 5). Accounts are refused outright and this is what replaces them.",
  },
  {
    name: "TaskList",
    cluster: "service",
    gds: "task-list",
    status: "new",
    from: null,
    usage:
      "Several sections completed in any order, each with a status Tag (§4.4). Three immediate uses: the international arrival checklist, the per-portfolio handover checklist, and starting a club, which is a set of parallel tasks that 1.0 made a linear wizard.",
  },
  {
    name: "ExitThisPage",
    cluster: "service",
    gds: "exit-this-page",
    status: "new",
    from: null,
    usage:
      "Every welfare, reporting and rights page. GDS built it for domestic abuse services: it navigates away immediately and pollutes browser history, with Shift pressed three times as a shortcut. A student reporting harassment may be on a shared laptop or have someone nearby, and this is the difference between content/reporting.ts's promise of secrecy being a sentence and being a property of the page (§4.4).",
  },
  {
    name: "InterruptionPage",
    cluster: "service",
    gds: "interruption-card",
    status: "new",
    from: null,
    usage:
      "A full page the reader must take in before continuing. Its home is the welfare and reporting flows, where §5.4's boundary on what BIRSA can and cannot do needs saying at the moment it matters, before anyone starts typing (§4.3b).",
  },

  // --- media and the section palette (§4.7B, §4.6) -----------------------
  // One cluster, not two. §11.4 gives the media components and the eleven
  // officer-composable section types to the same agent because they share the
  // aspect ratio contract and belong together; splitting them would put the
  // ratio decision on a boundary between two agents, which is exactly the kind
  // of shared dependency Rule 2 exists to prevent.
  {
    name: "Figure",
    cluster: "media",
    gds: null,
    status: "new",
    from: null,
    usage:
      "The workhorse: an image with an optional caption and credit. Captions and credits are real text, never baked into the image (§4.7C).",
  },
  {
    name: "HeroImage",
    cluster: "media",
    gds: null,
    status: "new",
    from: null,
    usage:
      "At most one per page, and it is the LCP candidate, so it is the only image with `priority` (§4.7D). Full-bleed is rare and deliberate, not the default for every post.",
  },
  {
    name: "CardImage",
    cluster: "media",
    gds: null,
    status: "new",
    from: null,
    usage:
      "The image variant of a Card, at a fixed ratio so cards never jump and layout shift stays at zero.",
  },
  {
    name: "Gallery",
    cluster: "media",
    gds: null,
    status: "new",
    from: null,
    usage:
      "An ordered set with a lightbox. The one to be careful with: a lightbox is a modal, so it needs focus trapping, an escape route, and a no-JavaScript fallback that is simply the images in a list. Model it on the existing ConfirmDialog and useConfirmDialog (§4.7B).",
  },
  {
    name: "Portrait",
    cluster: "media",
    gds: null,
    status: "new",
    from: "lib/committee-portrait.ts",
    usage:
      "Committee portraits at 1:1. Preserve the existing placeholder fallback behaviour exactly; only the source changes, from the filesystem to the CMS (§4.7F).",
  },
];

/** The manifest keyed by name, for the `/design` page and its tests. */
export const manifestByName: Record<string, ManifestEntry> = Object.fromEntries(
  manifest.map((entry) => [entry.name, entry])
);

export function componentsInCluster(cluster: Cluster): ManifestEntry[] {
  return manifest.filter((entry) => entry.cluster === cluster);
}
