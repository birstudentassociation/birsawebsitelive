import Link from "next/link";
import Icon, { type IconName } from "@/components/icons/Icon";
import { localeHref, type Locale } from "@/lib/i18n";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";

const homeCopy = { en: homeEn, th: homeTh };

type Tone = "study" | "forest" | "warning" | "community";

const tones: Record<Tone, string> = {
  study: "bg-study-tint text-study",
  forest: "bg-forest-tint text-forest",
  warning: "bg-warning-tint text-warning",
  community: "bg-community-tint text-community",
};

const shortcuts: {
  key: keyof (typeof homeCopy)["en"]["shortcuts"]["items"];
  href: string;
  icon: IconName;
  tone: Tone;
}[] = [
  { key: "courseReviews", href: "/student-life/course-reviews", icon: "review", tone: "study" },
  {
    key: "timetable",
    href: "/news/bir-timetable-semester-2-2569",
    icon: "timetable",
    tone: "study",
  },
  { key: "calendar", href: "/services/calendar", icon: "calendar", tone: "study" },
  {
    key: "foodMap",
    href: "/student-life/living-nearby/where-to-eat",
    icon: "food",
    tone: "warning",
  },
  { key: "equipment", href: "/services/equipment-loan", icon: "loan", tone: "community" },
  { key: "clubs", href: "/clubs", icon: "club", tone: "community" },
];

export default function Shortcuts({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const copy = homeCopy[locale].shortcuts;
  return (
    <nav
      aria-labelledby="shortcuts-heading"
      className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${className}`}
    >
      <h2 id="shortcuts-heading" className="font-display text-xl">
        {copy.heading}
      </h2>
      <ul className="mt-4 grid grid-cols-3 gap-2">
        {shortcuts.map(({ key, href, icon, tone }) => (
          <li key={key}>
            <Link
              href={localeHref(locale, href)}
              className="focus-highlight flex min-h-11 flex-col items-center gap-2 rounded-xl p-2 text-center text-sm font-semibold text-ink hover:bg-sunken"
            >
              <span
                aria-hidden="true"
                className={`grid size-12 place-items-center rounded-xl ${tones[tone]}`}
              >
                <Icon name={icon} className="h-6 w-6" />
              </span>
              <span>{copy.items[key]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
