import Link from "next/link";
import { localeHref, type Locale } from "@/lib/i18n";

/** Course codes as small pill links to their course pages, for facts that name other courses. */
export default function CourseLinks({ codes, locale }: { codes: string[]; locale: Locale }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {codes.map((code) => (
        <li key={code}>
          <Link
            href={localeHref(locale, `/student-life/course-reviews/${code}`)}
            className="inline-block rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-semibold text-brand-deep hover:text-brand-dark"
          >
            {code}
          </Link>
        </li>
      ))}
    </ul>
  );
}
