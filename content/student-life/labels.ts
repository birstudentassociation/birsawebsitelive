/** Small UI labels shared by the student-life pages and search. */
import type { Locale } from "@/lib/i18n";

/** Audience tag for guides whose `audience` is not `all`. */
export const audienceLabels: Record<Locale, Record<"international" | "thai", string>> = {
  en: { international: "For international students", thai: "For Thai students" },
  th: { international: "สำหรับนักศึกษาต่างชาติ", thai: "สำหรับนักศึกษาไทย" },
};
