/**
 * Calendar builder copy (English): authored natively, not translated.
 * See `content/calendar-builder/th.ts` for the Thai version (same facts, own
 * phrasing). No colons or dashes in prose, other than clock times and URLs.
 */
import type { CalendarBuilderCopy } from "./types";

export const calendarBuilderEn: CalendarBuilderCopy = {
  meta: {
    title: "Build your calendar",
    description:
      "Choose the BIR dates you want, add your class times, and put them in the calendar app you already use. It works with iPhone, Android, Google Calendar and Outlook.",
  },
  title: "Build your calendar",
  lede: "Choose the BIR dates you want, add your class times, and put them in the calendar app you already use.",
  calendarName: "My BIR calendar",
  skipToPreview: "See what will be added",
  stepLabel: "Step {n} of 3",
  noScript:
    "Choosing dates and adding class times needs JavaScript. Without it, you can still subscribe to the full BIRSA calendar using the steps below.",
  categories: {
    birsa: {
      label: "BIRSA activities",
      description: "Events, recruitment and other things BIRSA runs.",
      preview: "BIRSA activity",
    },
    holidays: {
      label: "University days, holidays and closures",
      description: "Public holidays, university anniversaries and days the campus is closed.",
      preview: "University day or holiday",
    },
    registration: {
      label: "Registration and add or drop dates",
      description: "The windows BIR announces for registering and changing courses.",
      preview: "Registration",
    },
    classes: {
      label: "My class times",
      description: "Your own weekly classes, repeated through the term.",
      preview: "Class",
    },
  },
  step1: {
    heading: "Choose what to include",
    intro: "Tick the groups of dates you want. You can change this at any time.",
    upcoming: { one: "{n} upcoming date", other: "{n} upcoming dates" },
    none: "No upcoming dates yet",
    next: "Next, {date}, {title}",
    classesPrompt: "Add your class times in step 2",
    classesCount: { one: "{n} class added", other: "{n} classes added" },
    classesNoTerm: "Available once the term dates are published",
  },
  step2: {
    heading: "Add your class times",
    intro: "This step is optional. Add each class once and it repeats every week.",
    termRange:
      "Classes repeat every week from {start} to {end}, for semester {semester} of {year}. Days with no classes, such as public holidays, are skipped for you.",
    termName: "Semester {semester} of {year}",
    noTermTitle: "Term dates are not published yet",
    noTermBody:
      "You can add class times once the faculty publishes the dates for the next term. Until then, choose the other dates in step 1.",
    empty: "You have not added any classes yet.",
    add: "Add a class",
    limit: "You have added the most classes you can, which is {n}. Remove one to add another.",
    formAdd: "Add a class",
    formEdit: "Edit this class",
    code: {
      label: "Course",
      hint: "Type a course code such as PI271, or pick one from the list.",
    },
    day: { label: "Day", placeholder: "Choose a day" },
    start: "Start time",
    end: "End time",
    place: { label: "Place", hint: "For example, Room 301." },
    optional: "optional",
    save: "Add this class",
    saveEdit: "Save changes",
    cancel: "Cancel",
    edit: "Edit",
    remove: "Remove",
    editFor: "Edit {course} on {day}",
    removeFor: "Remove {course} on {day}",
    added: "Added {course} on {day}.",
    updated: "Updated {course} on {day}.",
    removed: "Removed {course} on {day}.",
    undo: "Undo",
    duplicate: "You have already added this class at this time",
    errorTitle: "There is a problem",
    errors: {
      "code-missing": "Enter a course code",
      "code-invalid": "Enter a course code such as PI271",
      "day-missing": "Choose a day",
      "start-invalid": "Enter a start time",
      "end-invalid": "Enter an end time",
      "end-before-start": "Choose an end time that is after the start time",
      "place-too-long": "Use {n} characters or fewer for the place",
    },
  },
  step3: {
    heading: "Add it to your calendar",
    intro: "Subscribe so your calendar keeps up as BIRSA adds dates.",
    question: "Where do you keep your calendar?",
    summaryDates: { one: "{n} date", other: "{n} dates" },
    summaryClasses: { one: "{n} weekly class", other: "{n} weekly classes" },
    summaryJoin: "{a} and {b}",
    summaryNone: "Nothing chosen yet",
    classesMissing: "You chose My class times, but have not added a class yet. Add one in step 2.",
    linkLabel: "Your calendar link",
    copy: "Copy link",
    copied: "Link copied",
    copyFailed: "Could not copy. Select the link and copy it by hand.",
    subscribeNote:
      "A subscription keeps updating when BIRSA adds dates. A downloaded file is a one off snapshot and will not update.",
    changeNote:
      "If you change your choices you get a new link. Remove the old calendar first so you do not see dates twice.",
    stepsHeading: "Steps",
    notAppear: "If it does not appear",
    remove: "How to remove it",
    guides: [
      {
        id: "iphone",
        label: "iPhone or iPad",
        heading: "iPhone or iPad",
        primary: { label: "Add to Apple Calendar", link: "webcal" },
        steps: [
          "Tap **Add to Apple Calendar** above.",
          "When your phone asks, tap **Subscribe**.",
          "Check the name and tap **Add**.",
          "Open the Calendar app and tap **Calendars** to see it in the list.",
        ],
        notes: [
          "Apple Calendar refreshes subscribed calendars on its own, usually within a few hours.",
        ],
        notAppear: [
          "Open the Calendar app, tap **Calendars** and make sure the calendar is ticked.",
          "Add it by hand. Open **Settings**, then **Apps**, then **Calendar**, then **Calendar Accounts**, then **Add Account**, then **Other**, then **Add Subscribed Calendar**. Paste your link and tap **Next**, then **Save**.",
          "On older versions of iOS, go to **Settings**, then **Calendar**, then **Accounts** instead.",
        ],
        remove: [
          "Open **Settings**, then **Apps**, then **Calendar**, then **Calendar Accounts**, then **Subscribed Calendars**.",
          "Tap the calendar, then tap **Delete Account**.",
        ],
      },
      {
        id: "mac",
        label: "Mac",
        heading: "Mac",
        primary: { label: "Add to Apple Calendar", link: "webcal" },
        steps: [
          "Click **Add to Apple Calendar** above and allow your browser to open Calendar.",
          "Click **Subscribe** when Calendar asks.",
          "Choose where to keep it, and set **Auto refresh** to **Every day**.",
          "Click **OK**.",
        ],
        notAppear: [
          "Add it by hand. In Calendar, choose **File**, then **New Calendar Subscription**.",
          "Paste your link and click **Subscribe**, then **OK**.",
        ],
        remove: [
          "In Calendar, hold the Control key and click the calendar in the sidebar.",
          "Choose **Unsubscribe**.",
        ],
      },
      {
        id: "android",
        label: "Android (Google Calendar app)",
        heading: "Android with the Google Calendar app",
        intro:
          "The Google Calendar app cannot add a calendar from a link. Do the first part once on a computer, and your phone picks it up.",
        primary: { label: "Open Google Calendar to add it", link: "google" },
        steps: [
          "On a computer, open **Add to Google Calendar** above and sign in to the same Google account you use on your phone.",
          "Confirm when Google asks if you want to add the calendar.",
          "On your phone, open the Google Calendar app and tap the menu, then **Settings**.",
          "Tap your Google account, find the calendar in the list and turn it on.",
        ],
        notes: ["Google can take up to a day to refresh a calendar it has subscribed to."],
        notAppear: [
          "Make sure your phone is signed in to the same Google account and is syncing.",
          "Wait a little and pull down in the app to refresh. The first sync can take a while.",
          "On a computer, open calendar.google.com. Next to **Other calendars**, choose **+**, then **From URL**, and paste your link.",
        ],
        remove: [
          "On a computer, open calendar.google.com.",
          "Under **Other calendars**, point at the calendar and choose the three dots, then **Settings**.",
          "Scroll to the bottom and choose **Unsubscribe**.",
        ],
      },
      {
        id: "samsung",
        label: "Samsung Calendar",
        heading: "Samsung Calendar",
        intro:
          "Samsung Calendar cannot subscribe to a link by itself. It shows Google calendars once your Google account is synced, so you add it to Google first.",
        primary: { label: "Open Google Calendar to add it", link: "google" },
        steps: [
          "On a computer, open **Add to Google Calendar** above and confirm when Google asks.",
          "On your phone, open **Settings**, then **Accounts and backup**, then **Manage accounts**, and choose your Google account.",
          "Tap **Sync account** and make sure **Calendar** is on.",
          "Open Samsung Calendar, tap the menu and tick the calendar under your Google account.",
        ],
        notes: ["Google can take up to a day to refresh a calendar it has subscribed to."],
        notAppear: [
          "In Samsung Calendar, tap the menu and check the calendar is ticked under your Google account.",
          "Tap **Sync now** in your Google account settings, then wait a few minutes.",
          "On a computer, open calendar.google.com. Next to **Other calendars**, choose **+**, then **From URL**, and paste your link.",
        ],
        remove: [
          "On a computer, open calendar.google.com.",
          "Under **Other calendars**, point at the calendar and choose the three dots, then **Settings**.",
          "Scroll to the bottom and choose **Unsubscribe**.",
        ],
      },
      {
        id: "google",
        label: "Google Calendar on a computer",
        heading: "Google Calendar on a computer",
        primary: { label: "Add to Google Calendar", link: "google" },
        steps: [
          "Click **Add to Google Calendar** above and sign in if Google asks.",
          "Click **Add** when Google asks if you want to add the calendar.",
          "Find it under **Other calendars** on the left.",
        ],
        notes: ["Google can take up to a day to refresh a calendar it has subscribed to."],
        notAppear: [
          "Open calendar.google.com. Next to **Other calendars**, choose **+**, then **From URL**.",
          "Paste your link and choose **Add calendar**.",
          "Check the calendar is ticked in the left hand list.",
        ],
        remove: [
          "Under **Other calendars**, point at the calendar and choose the three dots, then **Settings**.",
          "Scroll to the bottom and choose **Unsubscribe**.",
        ],
      },
      {
        id: "outlook",
        label: "Outlook (Windows, Mac or web)",
        heading: "Outlook, including Microsoft 365 work or school accounts",
        primary: { label: "Add to Outlook on the web", link: "outlookLive" },
        more: [
          { label: "Use a work or school account instead", link: "outlookOffice" },
          { label: "Use classic Outlook on Windows or Mac", link: "webcal" },
        ],
        steps: [
          "Choose **Add to Outlook on the web** above and sign in with your Microsoft account. For a work or school account, use the link for that.",
          "Check the name and choose **Import**.",
          "Find it in the calendar list on the left.",
        ],
        notes: ["Outlook decides how often it refreshes, and this can take several hours."],
        notAppear: [
          "In Outlook on the web or new Outlook, choose **Add calendar**, then **Subscribe from web**. Paste your link, give it a name and choose **Import**.",
          "In classic Outlook, choose **Add Calendar** on the **Home** tab, then **From Internet**. Paste your link and choose **OK**.",
        ],
        remove: [
          "In Outlook, right click the calendar in the left hand list.",
          "Choose **Remove**, or **Delete Calendar** in classic Outlook.",
        ],
      },
      {
        id: "other",
        label: "Something else",
        heading: "Another calendar app",
        primary: { label: "Download the file", link: "download" },
        more: [{ label: "Open as a subscription", link: "webcal" }],
        steps: [
          "To keep your calendar up to date, copy your link and look for an option such as **Subscribe**, **Add by URL** or **From Internet** in your app. Paste the link there.",
          "Or choose **Download the file** above and open it in your app to import it.",
        ],
        notes: [
          "A downloaded file is a one off snapshot. It does not update when BIRSA adds dates.",
        ],
        notAppear: [
          "Some apps only accept a link that starts with webcal. Use **Open as a subscription** for that.",
          "If your app has no subscribe option, import the downloaded file instead.",
        ],
        remove: [
          "Delete the calendar in your app.",
          "If you imported the file, delete the events it added. Some apps put them in a calendar of their own, which makes this one step.",
        ],
      },
    ],
  },
  preview: {
    heading: "What will be added",
    empty: "Nothing is chosen. Tick a group of dates in step 1.",
    classesHeading: "Every week",
    classesMissing: "You chose My class times, but have not added a class yet.",
    addClass: "Add a class",
    showPast: "Show past dates ({n})",
    hidePast: "Hide past dates",
    range: "{start} to {end}",
    every: "Every {day}, {start} to {end}",
    placeAt: "at {place}",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    ongoing: "Happening now",
  },
};
