/**
 * Shared "chrome" copy for the site's server-driven, one-question-per-page
 * form journeys (contact, start a club, equipment loan status). The
 * equipment loan *request* wizard keeps its own richer copy module,
 * `components/equipment/loanWizardCopy.ts`, since it already existed and
 * has extra item-specific strings; this module exists so the three simpler
 * journeys don't each redefine "Back" / "Continue" / "Change" / "Step X of Y".
 */
import type { Locale } from "@/lib/i18n";

export type WizardChromeLabels = {
  back: string;
  continueLabel: string;
  continuing: string;
  change: string;
  /** Template with {current}/{total} placeholders, e.g. "Step {current} of {total}". */
  stepOf: string;
};

export function buildWizardChromeLabels(locale: Locale): WizardChromeLabels {
  if (locale === "th") {
    return {
      back: "ย้อนกลับ",
      continueLabel: "ดำเนินการต่อ",
      continuing: "กำลังดำเนินการ…",
      change: "แก้ไข",
      stepOf: "ขั้นตอนที่ {current} จาก {total}",
    };
  }
  return {
    back: "Back",
    continueLabel: "Continue",
    continuing: "Continuing…",
    change: "Change",
    stepOf: "Step {current} of {total}",
  };
}

export function formatStepOf(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}
