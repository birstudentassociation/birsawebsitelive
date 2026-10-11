/**
 * The registration and add-drop dates for the terms in a student's plan as an
 * iCalendar download (`/en/services/study-plan/plan/registration.ics?terms=2569-1,2569-2`).
 * The trailing dot in the path segment means `proxy.ts`'s matcher never
 * touches this route, so the handler validates `lang` itself and 404s on
 * anything else.
 *
 * It lists whatever `content/calendar/events.ts` holds with an `academic` tag
 * for those terms, and nothing else: no date is made up. When the calendar
 * holds none, it answers 404 with a sentence rather than a calendar file that
 * imports as nothing. The plan screen does not link here in that case, so the
 * 404 is only reached by a hand-made or stale link.
 *
 * Reads only its query, which names terms and nothing about the student, so
 * the plan itself never reaches this route.
 */
import { notFound } from "next/navigation";
import { calendarEvents } from "@/content/calendar/events";
import { buildIcs } from "@/lib/ics";
import { isLocale, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import {
  parseTermsParam,
  registrationEventsFor,
  TERMS_PARAM,
} from "@/lib/study-plan/registrationDates";

const CALENDAR_NAME: Record<Locale, string> = {
  en: "BIRSA registration and add-drop dates",
  th: "วันลงทะเบียนและวันเพิ่มถอนรายวิชาตามที่ BIRSA ประกาศ",
};

const NO_DATES: Record<Locale, string> = {
  en: "BIRSA has not recorded registration or add-drop dates for those terms yet.",
  th: "BIRSA ยังไม่ได้บันทึกวันลงทะเบียนหรือวันเพิ่มถอนรายวิชาของภาคการศึกษาเหล่านั้น",
};

export async function GET(request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const terms = parseTermsParam(new URL(request.url).searchParams.get(TERMS_PARAM));
  const events = registrationEventsFor(calendarEvents, terms);

  if (events.length === 0) {
    return new Response(NO_DATES[locale], {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(buildIcs(events, locale, { siteUrl: SITE_URL, name: CALENDAR_NAME }), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="birsa-registration-dates-${locale}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
