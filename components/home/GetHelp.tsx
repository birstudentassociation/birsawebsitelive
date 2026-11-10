import Link from "next/link";
import Icon, { type IconName } from "@/components/icons/Icon";
import { localeHref, type Locale } from "@/lib/i18n";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";

const homeCopy = { en: homeEn, th: homeTh };

const rows: {
  key: keyof (typeof homeCopy)["en"]["getHelp"]["items"];
  href: string;
  icon: IconName;
  urgent?: boolean;
}[] = [
  { key: "whereToGo", href: "/contact/where-to-go", icon: "help" },
  { key: "contact", href: "/contact", icon: "mail" },
];

export default function GetHelp({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const copy = homeCopy[locale].getHelp;
  return (
    <section
      aria-labelledby="get-help-heading"
      className={`rounded-2xl border border-line bg-sunken p-4 sm:p-5 ${className}`}
    >
      <h2 id="get-help-heading" className="font-display text-xl">
        {copy.heading}
      </h2>
      <ul className="mt-4 flex flex-col gap-2">
        {rows.map(({ key, href, icon, urgent }) => (
          <li key={key}>
            <Link
              href={localeHref(locale, href)}
              className={`focus-highlight flex min-h-12 items-center gap-3 rounded-xl px-4 font-semibold ${
                urgent
                  ? "bg-brand text-white"
                  : "border border-line bg-surface text-ink hover:bg-cream"
              }`}
            >
              <Icon name={icon} className="h-5 w-5 shrink-0" />
              <span className="flex-1">{copy.items[key]}</span>
              <Icon name="chevron" className="h-4 w-4 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
