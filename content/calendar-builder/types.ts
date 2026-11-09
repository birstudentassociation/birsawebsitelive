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

export type ClassField = "code" | "section" | "day" | "start" | "end" | "place";

export type CalendarBuilderCopy = {
  meta: { title: string; description: string };
  title: string;
  lede: string;
  /** Name shown in the calendar app. */
  calendarName: string;
  skipToPreview: string;
  stepLabel: string;
  continue: string;
  back: string;
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
    /** Why "My exams" is switched off until a timetable class is added. */
    examsNone: string;
    examsCount: Plural;
  };
  step2: {
    heading: string;
    intro: string;
    termRange: string;
    termName: string;
    /** The semester choice at the top of the step. */
    term: { legend: string; option: string; dates: string };
    /** Said when the chosen semester has a BIR timetable built in. */
    timetableNote: string;
    /** Said when it has not. */
    noTimetableNote: string;
    quick: {
      legend: string;
      year1: string;
      year2: string;
      added: Plural;
      none: string;
      section: string;
      full: string;
    };
    noTermTitle: string;
    noTermBody: string;
    empty: string;
    add: string;
    limit: string;
    formAdd: string;
    formEdit: string;
    code: { label: string; hint: string };
    combo: {
      groupOther: string;
      groupAll: string;
      noMatches: string;
      noMatchesHint: string;
      results: Plural;
      more: string;
      added: string;
    };
    /** Second line of a timetable option, `{day} {start} to {end} · {room}`. */
    detail: string;
    section: { legend: string; option: string; missing: string; roomsJoin: string };
    summary: {
      heading: string;
      when: string;
      place: string;
      lecturer: string;
      exams: string;
      midterm: string;
      final: string;
      dateTime: string;
      change: string;
      reset: string;
    };
    clash: string;
    clashInList: string;
    undone: string;
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
      "section-invalid": string;
    };
  };
  step3: {
    heading: string;
    intro: string;
    question: string;
    summaryDates: Plural;
    summaryClasses: Plural;
    summaryExams: Plural;
    summaryJoin: string;
    summaryJoin3: string;
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
    daysShort: [string, string, string, string, string, string, string];
    section: string;
    ongoing: string;
  };
};
