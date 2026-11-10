import Link from "next/link";
import Icon, { type IconName } from "@/components/icons/Icon";
import { localeHref, type Locale } from "@/lib/i18n";
import { studentLifeTopics } from "@/content/student-life/topics";
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

type Items = (typeof homeCopy)["en"]["allTopics"]["items"];

export default function AllTopics({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const copy = homeCopy[locale].allTopics;
  const topics = studentLifeTopics[locale];
  const rows: { key: keyof Items; title: string; href: string; icon: IconName; tone: Tone }[] = [
    {
      key: "studying",
      title: topics.studying.title,
      href: "/student-life/studying",
      icon: "study",
      tone: "study",
    },
    {
      key: "money",
      title: topics.money.title,
      href: "/student-life/money",
      icon: "money",
      tone: "study",
    },
    {
      key: "gettingAround",
      title: topics["getting-around"].title,
      href: "/student-life/getting-around",
      icon: "bus",
      tone: "forest",
    },
    {
      key: "livingNearby",
      title: topics["living-nearby"].title,
      href: "/student-life/living-nearby",
      icon: "home",
      tone: "warning",
    },
    {
      key: "health",
      title: topics["health-and-safety"].title,
      href: "/student-life/health-and-safety",
      icon: "health",
      tone: "warning",
    },
    {
      key: "rules",
      title: topics["rules-and-rights"].title,
      href: "/student-life/rules-and-rights",
      icon: "scale",
      tone: "study",
    },
    { key: "clubs", title: copy.clubsTitle, href: "/clubs", icon: "club", tone: "community" },
    {
      key: "firstWeeks",
      title: topics["first-weeks"].title,
      href: "/student-life/getting-started",
      icon: "flag",
      tone: "community",
    },
    { key: "about", title: copy.aboutTitle, href: "/activity", icon: "globe", tone: "community" },
  ];
  return (
    <nav
      aria-labelledby="all-topics-heading"
      className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${className}`}
    >
      <h2 id="all-topics-heading" className="font-display text-xl">
        {copy.heading}
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ key, title, href, icon, tone }) => (
          <li key={key}>
            <Link
              href={localeHref(locale, href)}
              className="focus-highlight flex min-h-11 items-center gap-3 rounded-xl p-2 hover:bg-sunken"
            >
              <span
                aria-hidden="true"
                className={`grid size-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}
              >
                <Icon name={icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-ink">{title}</span>
                <span className="block text-sm text-muted">{copy.items[key]}</span>
              </span>
              <Icon name="chevron" className="h-4 w-4 shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
