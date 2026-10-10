import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactElement, ReactNode } from "react";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
}));

vi.mock("@/lib/inventory/items", () => ({
  getItemByKey: async () => ({
    key: "first-aid-kit",
    isRetired: false,
    maxLoanDays: 7,
    name: { en: "First-aid kit", th: "ชุดปฐมพยาบาล" },
  }),
}));

vi.mock("@/components/equipment/loanWizardCopy", () => ({
  buildLoanWizardLabels: () => ({
    dates: { title: "Dates" },
    common: { back: "Back", stepOf: "" },
  }),
}));

vi.mock("@/components/PageHeader", () => ({ default: () => null }));
vi.mock("@/components/forms/StepNav", () => ({ default: () => null }));
vi.mock("@/components/forms/wizardChromeCopy", () => ({ formatStepOf: () => "" }));
vi.mock("@/components/equipment/DatesStepForm", () => ({ default: function DatesStepForm() {} }));

vi.mock("@/app/[lang]/services/equipment-loan/[item]/request/actions", () => ({
  getLoanDraft: async () => ({}),
  submitDatesStep: () => undefined,
}));

import DatesStepForm from "@/components/equipment/DatesStepForm";
import LoanRequestDatesPage from "@/app/[lang]/services/equipment-loan/[item]/request/dates/page";

function findByType(node: ReactNode, type: unknown): ReactElement | undefined {
  if (!node || typeof node !== "object") return undefined;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findByType(child, type);
      if (found) return found;
    }
    return undefined;
  }
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.type === type) return element;
  return findByType(element.props?.children, type);
}

describe("equipment loan dates page", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("offers today's Bangkok date as the earliest start, not the server's UTC date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-31T18:00:00Z"));

    const page = await LoanRequestDatesPage({
      params: Promise.resolve({ lang: "en", item: "first-aid-kit" }),
      searchParams: Promise.resolve({}),
    });

    const form = findByType(page, DatesStepForm);
    expect(form?.props).toMatchObject({ minStartDate: "2026-08-01" });
  });
});
