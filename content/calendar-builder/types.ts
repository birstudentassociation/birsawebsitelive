/**
 * Shape of the calendar builder's copy. English (`en.ts`) and Thai (`th.ts`)
 * are each written natively and share only this shape. Strings with `{name}`
 * placeholders are filled in by the component; plural pairs use `one` and
 * `other` (Thai repeats the same text in both).
 *
 * Inside a guide step, text wrapped in `**double asterisks**` is a menu name
 * or button label and is shown in bold.
 */
import type { CategoryId } from "@/lib/calendar-builder/selection";

export type Plural = { one: string; other: string };

export type DeviceId = "iphone" | "mac" | "android" | "samsung" | "google" | "outlook" | "other";

/** Which link from `buildFeedLinks` an action uses. */
export type LinkKey = "webcal" | "google" | "outlookLive" | "outlookOffice" | "download";

export type GuideCopy = {
  id: DeviceId;
  /** Radio label. */
  label: string;
  /** Heading of the guide itself. */
  heading: string;
  /** One sentence before the button, when the app needs a warning. */
  intro?: string;
  primary: { label: string; link: LinkKey };
  /** Other links worth offering, shown as quiet links under the buttons. */
  more?: { label: string; link: LinkKey }[];
  steps: string[];
  notes?: string[];
  notAppear: string[];
  remove: string[];
};

export type ClassField = "code" | "day" | "start" | "end" | "place";

export type CalendarBuilderCopy = {
  meta: { title: string; description: string };
  title: string;
  lede: string;
  /** Name shown in the calendar app. */
  calendarName: string;
  skipToPreview: string;
  stepLabel: string;
  noScript: string;
  categories: Record<CategoryId, { label: string; description: string; preview: string }>;
  step1: {
    heading: string;
    intro: string;
    upcoming: Plural;
    none: string;
    next: string;
    classesPrompt: string;
    classesCount: Plural;
    classesNoTerm: string;
  };
  step2: {
    heading: string;
    intro: string;
    termRange: string;
    termName: string;
    noTermTitle: string;
    noTermBody: string;
    empty: string;
    add: string;
    limit: string;
    formAdd: string;
    formEdit: string;
    code: { label: string; hint: string };
    day: { label: string; placeholder: string };
    start: string;
    end: string;
    place: { label: string; hint: string };
    optional: string;
    save: string;
    saveEdit: string;
    cancel: string;
    edit: string;
    remove: string;
    editFor: string;
    removeFor: string;
    added: string;
    updated: string;
    removed: string;
    undo: string;
    duplicate: string;
    errorTitle: string;
    errors: {
      "code-missing": string;
      "code-invalid": string;
      "day-missing": string;
      "start-invalid": string;
      "end-invalid": string;
      "end-before-start": string;
      "place-too-long": string;
    };
  };
  step3: {
    heading: string;
    intro: string;
    question: string;
    summaryDates: Plural;
    summaryClasses: Plural;
    summaryJoin: string;
    summaryNone: string;
    classesMissing: string;
    linkLabel: string;
    copy: string;
    copied: string;
    copyFailed: string;
    subscribeNote: string;
    changeNote: string;
    stepsHeading: string;
    notAppear: string;
    remove: string;
    guides: GuideCopy[];
  };
  preview: {
    heading: string;
    empty: string;
    classesHeading: string;
    classesMissing: string;
    addClass: string;
    showPast: string;
    hidePast: string;
    range: string;
    every: string;
    placeAt: string;
    days: [string, string, string, string, string, string, string];
    ongoing: string;
  };
};
