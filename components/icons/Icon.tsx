/**
 * Dashboard icon set: one family on a 20px grid with a 1.6px rounded stroke,
 * matching `components/quick/QuickIcon.tsx`. Icons are always decorative and
 * sit next to a text label, so every glyph is hidden from assistive technology.
 */

export type IconName =
  | "alert"
  | "arrow"
  | "boat"
  | "briefcase"
  | "bus"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "club"
  | "conditions"
  | "exam"
  | "flag"
  | "food"
  | "globe"
  | "grid"
  | "health"
  | "help"
  | "home"
  | "loan"
  | "lock"
  | "mail"
  | "menu"
  | "money"
  | "news"
  | "pause"
  | "phone"
  | "pin"
  | "plan"
  | "review"
  | "scale"
  | "search"
  | "shield"
  | "shuttle"
  | "study"
  | "timetable";

const paths: Record<IconName, React.ReactNode> = {
  alert: (
    <>
      <path d="M10 3 2.5 16.5h15L10 3Z" />
      <path d="M10 8v4" />
      <circle cx="10" cy="14.3" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </>
  ),
  boat: (
    <>
      <path d="M2.5 13h15l-2 3.5h-11L2.5 13ZM5 13V8h8l2 5M8 8V5h3" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="6" width="15" height="10.5" rx="1.8" />
      <path d="M7 6V4.5A1 1 0 0 1 8 3.5h4a1 1 0 0 1 1 1V6M2.5 10.5h15" />
    </>
  ),
  bus: (
    <>
      <rect x="3.5" y="3.5" width="13" height="10.5" rx="2" />
      <path d="M3.5 8h13M6.5 14v2M13.5 14v2" />
      <circle cx="7" cy="11" r=".6" fill="currentColor" stroke="none" />
      <circle cx="13" cy="11" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="14" height="12" rx="2" />
      <path d="M3 8.5h14M6.5 3v3M13.5 3v3" />
      <path d="M6.5 12h2" />
    </>
  ),
  check: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="m6.8 10.2 2.2 2.2 4.2-4.6" />
    </>
  ),
  chevron: (
    <>
      <path d="m8 5 5 5-5 5" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6v4l2.5 2" />
    </>
  ),
  club: (
    <>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="14" cy="8" r="2" />
      <path d="M2.5 16.5c0-2.6 2-4.5 4.5-4.5s4.5 1.9 4.5 4.5M12 12.2c2.6-.5 5.5 1 5.5 4.3" />
    </>
  ),
  conditions: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 2v1.3M8 12.7V14M2 8h1.3M3.8 3.8l.9.9M11.3 3.8l-.9.9" />
      <path d="M9 17h6.5a2.5 2.5 0 0 0 0-5h-.3A3.5 3.5 0 0 0 9 13.3" />
    </>
  ),
  exam: (
    <>
      <path d="M13.5 3.5l3 3L8 15l-4 1 1-4 8.5-8.5Z" />
      <path d="M11.5 5.5l3 3" />
    </>
  ),
  flag: (
    <>
      <path d="M5 17V3M5 4h9l-2.5 3L14 10H5" />
    </>
  ),
  food: (
    <>
      <path d="M5 2.5v5a2 2 0 0 0 4 0v-5M7 2.5v15M14 17.5V2.5c-2 0-3 2.5-3 6h3" />
    </>
  ),
  globe: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c2 2.2 3 4.7 3 7.5s-1 5.3-3 7.5c-2-2.2-3-4.7-3-7.5s1-5.3 3-7.5Z" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="5.5" height="5.5" rx="1.2" />
      <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2" />
      <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2" />
    </>
  ),
  health: (
    <>
      <path d="M10 16.5S3 12.4 3 7.6A3.6 3.6 0 0 1 10 6a3.6 3.6 0 0 1 7 1.6c0 4.8-7 8.9-7 8.9Z" />
      <path d="M7.5 9.5h1.5l1-2 1.2 4 .8-2h1.5" />
    </>
  ),
  help: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M7.8 8a2.2 2.2 0 1 1 3.3 1.9c-.7.5-1.1 1-1.1 1.9" />
      <circle cx="10" cy="14.3" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  home: (
    <>
      <path d="M3 9 10 3l7 6v8H12v-5H8v5H3V9Z" />
    </>
  ),
  loan: (
    <>
      <path d="M3 6.8 10 3l7 3.8-7 3.8-7-3.8Z" />
      <path d="M3 6.8v6.4L10 17l7-3.8V6.8M10 10.6V17" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="9" width="12" height="8" rx="1.8" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.8" />
      <path d="m3 5.5 7 5.5 7-5.5" />
    </>
  ),
  menu: (
    <>
      <path d="M3 5.5h14M3 10h14M3 14.5h14" />
    </>
  ),
  money: (
    <>
      <rect x="2.5" y="5" width="15" height="10" rx="1.8" />
      <circle cx="10" cy="10" r="2.2" />
      <path d="M5.5 8v4M14.5 8v4" />
    </>
  ),
  news: (
    <>
      <rect x="3" y="3.5" width="11" height="13" rx="1.5" />
      <path d="M14 7h2.5v8a1.5 1.5 0 0 1-3 0M6 7h5M6 10h5M6 13h3" />
    </>
  ),
  pause: (
    <>
      <path d="M7 5v10M13 5v10" />
    </>
  ),
  phone: (
    <>
      <path d="M5 3h3l1.5 4-2 1.2a8.5 8.5 0 0 0 4.3 4.3L13 10.5l4 1.5v3a2 2 0 0 1-2 2A12 12 0 0 1 3 5a2 2 0 0 1 2-2Z" />
    </>
  ),
  pin: (
    <>
      <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0 1 11 0c0 4-5.5 9-5.5 9Z" />
      <circle cx="10" cy="8.5" r="2" />
    </>
  ),
  plan: (
    <>
      <path d="M5 3h7l3 3v11H5V3Z" />
      <path d="M7.5 9.5l1.5 1.5 3-3M7.5 14h5" />
    </>
  ),
  review: (
    <>
      <path d="M10 3.2l2 4.1 4.5.6-3.3 3.2.8 4.5L10 13.5l-4 2.1.8-4.5-3.3-3.2 4.5-.6 2-4.1Z" />
    </>
  ),
  scale: (
    <>
      <path d="M10 3v14M6 17h8M4 6h12M4 6l-2 5a2.2 2.2 0 0 0 4 0L4 6ZM16 6l-2 5a2.2 2.2 0 0 0 4 0l-2-5Z" />
    </>
  ),
  search: (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13 13 4 4" />
    </>
  ),
  shield: (
    <>
      <path d="M10 2.5 4 5v5c0 3.6 2.6 6.4 6 7.5 3.4-1.1 6-3.9 6-7.5V5l-6-2.5Z" />
    </>
  ),
  shuttle: (
    <>
      <path d="M2.5 13V7.5a2 2 0 0 1 2-2h8l4 3.5V13a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1Z" />
      <path d="M2.5 9.5h14M7.5 5.5v4" />
      <circle cx="6" cy="14.5" r="1.4" />
      <circle cx="14" cy="14.5" r="1.4" />
    </>
  ),
  study: (
    <>
      <path d="M3 5.5 10 2.5l7 3-7 3-7-3Z" />
      <path d="M5.5 7v4.5c0 1.4 2 2.5 4.5 2.5s4.5-1.1 4.5-2.5V7M17 5.5V10" />
    </>
  ),
  timetable: (
    <>
      <rect x="3" y="3.5" width="14" height="13" rx="2" />
      <path d="M3 7.5h14M7.5 7.5v9M12.5 7.5v9M3 12h14" />
    </>
  ),
};

export default function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  );
}
