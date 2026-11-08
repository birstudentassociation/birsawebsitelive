import { academicCalendar2569 } from "@/content/calendar/academic-2569";
import { todayInBangkok } from "@/lib/bangkok-today";
import type { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import AcademicCalendarView from "./AcademicCalendarView";

export default function AcademicCalendar({ locale }: { locale: Locale }) {
  return (
    <AcademicCalendarView
      locale={locale}
      periods={academicCalendar2569}
      todayKey={todayInBangkok()}
      siteUrl={SITE_URL}
    />
  );
}
