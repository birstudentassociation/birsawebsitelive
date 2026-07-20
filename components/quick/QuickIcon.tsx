import type { QuickIcon } from "@/content/quick";

const common = {
  "aria-hidden": "true" as const,
  viewBox: "0 0 20 20",
  className: "h-5 w-5 shrink-0",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.6,
};

/** Small inline-SVG icon set for quick-action items. Purely decorative. */
export default function QuickIconGlyph({ icon }: { icon: QuickIcon }) {
  switch (icon) {
    case "register":
      return (
        <svg {...common}>
          <path d="M5 3h7l3 3v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
          <path d="M7 9h6M7 12h6M7 15h4" strokeLinecap="round" />
        </svg>
      );
    case "pay":
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="15" height="10" rx="1.5" strokeLinejoin="round" />
          <path d="M2.5 8.5h15" strokeLinecap="round" />
          <path d="M5 12h3" strokeLinecap="round" />
        </svg>
      );
    case "wifi":
      return (
        <svg {...common}>
          <path d="M3 8.2a10 10 0 0 1 14 0" strokeLinecap="round" />
          <path d="M5.8 11.2a6.2 6.2 0 0 1 8.4 0" strokeLinecap="round" />
          <path d="M8.6 14.2a2.4 2.4 0 0 1 2.8 0" strokeLinecap="round" />
          <circle cx="10" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="14" height="12" rx="1.5" strokeLinejoin="round" />
          <path d="M3 8h14M6.5 3v3M13.5 3v3" strokeLinecap="round" />
        </svg>
      );
    case "club":
      return (
        <svg {...common}>
          <circle cx="10" cy="6.5" r="2.5" />
          <path d="M4.5 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 17V3" strokeLinecap="round" />
          <path d="M5 4h9l-2.5 3L14 10H5" strokeLinejoin="round" />
        </svg>
      );
    case "help":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7.5" />
          <path d="M7.8 8a2.2 2.2 0 1 1 3.3 1.9c-.7.5-1.1 1-1.1 1.9" strokeLinecap="round" />
          <circle cx="10" cy="14.3" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "feedback":
      return (
        <svg {...common}>
          <path d="M3 4.5h14v9H8.5L4.5 17v-3.5H3v-9Z" strokeLinejoin="round" />
          <path d="M6.5 8h7M6.5 10.5h4.5" strokeLinecap="round" />
        </svg>
      );
    case "guide":
      return (
        <svg {...common}>
          <path d="M10 5.5c-1.3-1-3-1.5-4.5-1.5-1 0-1.5.2-1.5.2v10.3s.5-.2 1.5-.2c1.5 0 3.2.5 4.5 1.5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M10 5.5c1.3-1 3-1.5 4.5-1.5 1 0 1.5.2 1.5.2v10.3s-.5-.2-1.5-.2c-1.5 0-3.2.5-4.5 1.5V5.5Z" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case "loan":
      return (
        <svg {...common}>
          <path d="M3 6.8 10 3l7 3.8-7 3.8-7-3.8Z" strokeLinejoin="round" />
          <path d="M3 6.8v6.4L10 17l7-3.8V6.8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M10 10.6V17" strokeLinecap="round" />
        </svg>
      );
    case "bus":
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="13" height="10" rx="1.5" strokeLinejoin="round" />
          <path d="M3.5 8h13" strokeLinecap="round" />
          <path d="M6.5 14v1.5M13.5 14v1.5" strokeLinecap="round" />
          <circle cx="7" cy="11" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="13" cy="11" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="M4.5 3.5h8l3 3v10a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
          <path d="M10 8.6l.9 1.8 2 .3-1.45 1.4.34 2-1.79-.95-1.79.94.34-1.99L7 10.7l2-.3.9-1.8Z" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="14" height="14" rx="4" strokeLinejoin="round" />
          <circle cx="10" cy="10" r="3.2" />
          <circle cx="14.2" cy="5.8" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7.5" />
          <path d="M11.6 17V10.8h1.7l.3-2.2h-2V7.2c0-.6.2-1 1.1-1h1V4.2c-.2 0-.8-.1-1.6-.1-1.6 0-2.6 1-2.6 2.7v1.8H8v2.2h1.5V17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "email":
      return (
        <svg {...common}>
          <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" strokeLinejoin="round" />
          <path d="M3 5.5 10 11l7-5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "line":
      return (
        <svg {...common}>
          <rect x="2.5" y="4" width="15" height="10.5" rx="4" strokeLinejoin="round" />
          <path d="M6 7.5v5M9 7.5v5M9 7.5l3 5v-5M14 7.5v5h1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "external":
    default:
      return (
        <svg {...common}>
          <path d="M7 13 13 7M8 7h5v5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="3" width="14" height="14" rx="2" />
        </svg>
      );
  }
}
