import type { Locale } from "@/lib/i18n";
import { calendarBuilderEn } from "./en";
import { calendarBuilderTh } from "./th";
import type { CalendarBuilderCopy } from "./types";

export type { CalendarBuilderCopy } from "./types";

export function getCalendarBuilderCopy(locale: Locale): CalendarBuilderCopy {
  return locale === "th" ? calendarBuilderTh : calendarBuilderEn;
}
