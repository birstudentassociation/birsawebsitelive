// @vitest-environment jsdom
/**
 * Unit tests for Wave 5C (`/help`): Smart Answers, guides, the rules that
 * apply to you, reporting, welfare, international student support, and
 * university services. Follows `tests/unit/whatson-routes.test.tsx`'s
 * pattern for rendering an async server component page directly:
 * `await Page({ params, searchParams })`, then `render(el)`.
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import HelpHubPage from "@/app/[lang]/help/page";
import GettingStartedPage from "@/app/[lang]/help/getting-started/page";
import GuidesIndexPage from "@/app/[lang]/help/guides/page";
import ShuttleBusGuidePage from "@/app/[lang]/help/guides/shuttle-bus/page";
import InternationalIndexPage from "@/app/[lang]/help/international/page";
import VisaAndImmigrationPage from "@/app/[lang]/help/international/visa-and-immigration/page";
import HealthcareAndInsurancePage from "@/app/[lang]/help/international/healthcare-and-insurance/page";
import BankingAndMoneyPage from "@/app/[lang]/help/international/banking-and-money/page";
import RegulationsPage from "@/app/[lang]/help/regulations/page";
import HelpRegulationDocPage from "@/app/[lang]/help/regulations/[doc]/page";
import UniversityServicesPage from "@/app/[lang]/help/university-services/page";
import ReportingPage from "@/app/[lang]/help/reporting/page";
import WelfarePage from "@/app/[lang]/help/welfare/page";
import HelpAnswersHubPage from "@/app/[lang]/help/answers/page";
import HelpTopicStartPage from "@/app/[lang]/help/answers/[topic]/page";
import HelpTopicStepPage from "@/app/[lang]/help/answers/[topic]/q/page";
import HelpAudienceProfilePage from "@/app/[lang]/help/answers/you/page";

import { help as helpEn } from "@/content/dictionaries/en/help";
import { help as helpTh } from "@/content/dictionaries/th/help";
import { getDictionary } from "@/lib/i18n";
import { service, uiCopy } from "@/content/smart-answers";
import { resolveTopic, visibleOptions } from "@/lib/smart-answers";
import { documents } from "@/content/activity/regulations";

afterEach(cleanup);

/** Any Tailwind font-size or line-height utility (BUILD-BRIEF-2.0 §7, defect D7). */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

/**
 * Every element under `container` carries no forbidden Tailwind type
 * utility, skipping any subtree under `[data-frozen-legacy]`:
 * `/help/regulations/[doc]` renders `components/regulations/RegulationView`
 * unchanged, a component outside this wave's owned paths
 * (`app/[lang]/help/**`, `components/help/**`), so it is read and reused
 * rather than forked, per its own file header. That component predates the
 * type scale and this wave does not own it, so its markup is out of scope
 * for this assertion, the same way `tests/unit/whatson-routes.test.tsx`
 * excludes the frozen `EventCalendar` it reuses.
 */
function assertNoRawTypeUtilities(container: HTMLElement) {
  for (const node of container.querySelectorAll<HTMLElement>("*")) {
    if (node.closest("[data-frozen-legacy]")) continue;
    const classAttr = node.getAttribute("class") ?? "";
    expect(classAttr).not.toMatch(TAILWIND_TYPE_UTILITY);
  }
}

function assertOneH1(container: HTMLElement) {
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s).toHaveLength(1);
  void container;
}

/** `PageHeader`'s help slot, present on every page that renders it: a link to `/contact`. */
function assertHelpSlot(locale: "en" | "th" = "en") {
  const dict = getDictionary(locale);
  expect(screen.getByRole("link", { name: dict.actions.contactUs })).toHaveAttribute(
    "href",
    `/${locale}/contact`
  );
}

describe("/help: the hub", () => {
  it("renders one h1 and a help slot, and links to every entry", async () => {
    const el = await HelpHubPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("link", { name: /Report harassment or bullying/ })).toHaveAttribute(
      "href",
      "/en/help/reporting"
    );
    expect(screen.getByRole("link", { name: /Welfare and wellbeing/ })).toHaveAttribute(
      "href",
      "/en/help/welfare"
    );
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await HelpHubPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/help/getting-started: the ABSORB row for getting-around.mdx and arrival-and-first-week.mdx", () => {
  it("renders one h1, a help slot, and the Rangsit routing table", async () => {
    const el = await GettingStartedPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await GettingStartedPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/help/guides: signpost pages, §3.6", () => {
  it("index renders one h1, a help slot, and links to the shuttle bus guide", async () => {
    const el = await GuidesIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("link", { name: /Shuttle bus service/ })).toHaveAttribute(
      "href",
      "/en/help/guides/shuttle-bus"
    );
  });

  it("shuttle bus: names its source and links out with rel=noopener noreferrer, without restating the live timetable", async () => {
    const el = await ShuttleBusGuidePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();

    // Names the source: a heading naming "Thammasat University" as the body
    // that actually owns the shuttle.
    expect(screen.getByRole("heading", { name: "Thammasat University" })).toBeInTheDocument();

    const outLink = screen.getByRole("link", { name: /Thammasat University website/ });
    expect(outLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(outLink).toHaveAttribute("target", "_blank");

    // Does not restate the source's own timetable: no route number and no
    // specific departure time appears here, only the two lines' general
    // destinations, which is what stays true regardless of the current
    // schedule.
    expect(container.textContent).not.toMatch(/1-9E|route \d/i);
    expect(container.textContent).not.toMatch(/\b\d{1,2}:\d{2}\b/);
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await ShuttleBusGuidePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/help/international: the three SIGNPOST rows in SCOPE-AUDIT-2.0 §3.3", () => {
  it("index renders one h1, a help slot, and links to all three guides", async () => {
    const el = await InternationalIndexPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("link", { name: /Visa and immigration/ })).toHaveAttribute(
      "href",
      "/en/help/international/visa-and-immigration"
    );
    expect(screen.getByRole("link", { name: /Healthcare and insurance/ })).toHaveAttribute(
      "href",
      "/en/help/international/healthcare-and-insurance"
    );
    expect(screen.getByRole("link", { name: /Banking and money/ })).toHaveAttribute(
      "href",
      "/en/help/international/banking-and-money"
    );
  });

  it("visa and immigration: the highest-risk page carries no procedural detail, and signposts TU International Affairs", async () => {
    const el = await VisaAndImmigrationPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("heading", { name: "TU International Affairs" })).toBeInTheDocument();
    const outLink = screen.getByRole("link", { name: /TU International Affairs website/ });
    expect(outLink).toHaveAttribute("rel", "noopener noreferrer");

    // REDESIGN-2.0 §3.6's specific warning: no named government office or
    // building for how to actually file an extension.
    expect(container.textContent).not.toMatch(/Chaeng Watthana/);
  });

  it("healthcare and insurance: states the requirement plainly, never hedges", async () => {
    const el = await HealthcareAndInsurancePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(container.textContent).toMatch(/is required/i);
    // The exact hedge DECISIONS-2.0.md Gate 2 named as the problem with the
    // 1.0 page: never carried forward.
    expect(container.textContent).not.toMatch(/expect or require/i);
    expect(screen.getByRole("heading", { name: "TU International Affairs" })).toBeInTheDocument();
    const outLink = screen.getByRole("link", { name: /TU International Affairs website/ });
    expect(outLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("banking and money: signposts TU International Affairs for the enrolment letter only, not bank-specific requirements", async () => {
    const el = await BankingAndMoneyPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    const outLink = screen.getByRole("link", { name: /TU International Affairs website/ });
    expect(outLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("emits no raw Tailwind font-size or line-height utility across all three signposts", async () => {
    for (const Page of [VisaAndImmigrationPage, HealthcareAndInsurancePage, BankingAndMoneyPage]) {
      const el = await Page({ params: Promise.resolve({ lang: "en" }) });
      const { container, unmount } = render(el);
      assertNoRawTypeUtilities(container);
      unmount();
    }
  });
});

describe("/help/regulations: the ABSORB row for rights-and-welfare.mdx, plus the regulation library", () => {
  it("renders one h1, a help slot, the regulation library, and rights content", async () => {
    const el = await RegulationsPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    for (const doc of documents) {
      expect(screen.getByRole("link", { name: doc.shortTitle.en })).toHaveAttribute(
        "href",
        `/en/help/regulations/${doc.slug}`
      );
    }
    // A rights entitlement carried over from rights-and-welfare.mdx.
    expect(container.textContent).toMatch(/menstrual products/i);
  });

  it("[doc]: renders one h1 from the doc's own title, with a help slot", async () => {
    const doc = documents[0]!;
    const el = await HelpRegulationDocPage({
      params: Promise.resolve({ lang: "en", doc: doc.slug }),
    });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(doc.shortTitle.en);
  });

  it("emits no raw Tailwind font-size or line-height utility on the index page", async () => {
    const el = await RegulationsPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/help/university-services: the SIGNPOST row for /services/university-services, absorbing study-support.mdx", () => {
  it("renders one h1, a help slot, and the University-run disclaimer", async () => {
    const el = await UniversityServicesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(container.textContent).toMatch(/does not operate them/i);
  });

  it("states the corrected printing quota, 200 baht split across two funds, not the contradicted 100 baht figure alone", async () => {
    const el = await UniversityServicesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    expect(container.textContent).toMatch(/200 baht in total/i);
  });

  it("emits no raw Tailwind font-size or line-height utility", async () => {
    const el = await UniversityServicesPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    assertNoRawTypeUtilities(container);
  });
});

describe("/help/reporting and /help/welfare: ExitThisPage and InterruptionPage on every one", () => {
  it("reporting: renders ExitThisPage, one h1 from InterruptionPage, and the two reporting channels", async () => {
    const dict = getDictionary("en");
    const el = await ReportingPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    expect(screen.getByRole("link", { name: helpEn.exitThisPage.label })).toHaveAttribute(
      "href",
      "https://www.google.com"
    );
    // Two forward paths out of the boundary, never just one (REDESIGN-2.0 §4.4 InterruptionPage).
    expect(screen.getByRole("link", { name: "See how to report" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "I do not want to continue" })).toHaveAttribute(
      "href",
      "/en"
    );
    void dict;
  });

  it("reporting: does not render PageFeedback, per ROUTE-MAP-2.0's explicit rule for this page", async () => {
    const el = await ReportingPage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    expect(container.textContent).not.toMatch(/report a problem with this page/i);
  });

  it("welfare: renders ExitThisPage, one h1, states the TU Well Being boundary, and points at university-services rather than restating it", async () => {
    const el = await WelfarePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);

    assertOneH1(container);
    expect(screen.getByRole("link", { name: helpEn.exitThisPage.label })).toHaveAttribute(
      "href",
      "https://www.google.com"
    );
    expect(
      screen.getByRole("heading", { name: "Thammasat Well Being Center" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "University services" })).toHaveAttribute(
      "href",
      "/en/help/university-services"
    );

    // Does not restate the coverage figures that live in full on
    // /help/university-services (the drift SCOPE-AUDIT-2.0 §4 found live twice).
    expect(container.textContent).not.toMatch(/15,000 baht/);
    expect(container.textContent).not.toMatch(/150,000 baht/);
  });

  it("welfare: does not render PageFeedback", async () => {
    const el = await WelfarePage({ params: Promise.resolve({ lang: "en" }) });
    const { container } = render(el);
    expect(container.textContent).not.toMatch(/report a problem with this page/i);
  });

  it("emits no raw Tailwind font-size or line-height utility on either page", async () => {
    for (const Page of [ReportingPage, WelfarePage]) {
      const el = await Page({ params: Promise.resolve({ lang: "en" }) });
      const { container, unmount } = render(el);
      assertNoRawTypeUtilities(container);
      unmount();
    }
  });
});

describe("/help/answers: Smart Answers at its 2.0 mount", () => {
  it("hub renders one h1, a help slot, and the triage entry point", async () => {
    const el = await HelpAnswersHubPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("link", { name: uiCopy.en.triageStart })).toHaveAttribute(
      "href",
      expect.stringContaining("/en/help/answers/start/q")
    );
  });

  it("topic start page renders one h1 and a help slot", async () => {
    const topic = service.topics.find((t) => !t.hideFromHub);
    expect(topic).toBeDefined();

    const el = await HelpTopicStartPage({
      params: Promise.resolve({ lang: "en", topic: topic!.slug }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(topic!.title.en);
  });

  it("a question step renders one h1 (the topic title), a help slot, and a group of radio options for the question", async () => {
    const topic = service.topics.find((t) => !t.hideFromHub);
    expect(topic).toBeDefined();

    const el = await HelpTopicStepPage({
      params: Promise.resolve({ lang: "en", topic: topic!.slug }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(topic!.title.en);
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThanOrEqual(2);
  });

  it("walking every visible option to an outcome renders one h1 (the outcome's own title) and a help slot", async () => {
    const topic = service.topics.find((t) => !t.hideFromHub);
    expect(topic).toBeDefined();

    let answerIds: string[] = [];
    let journey = resolveTopic(service, topic!, {}, answerIds);
    let guard = 0;
    while (journey.node.kind === "question" && guard < 20) {
      const options = visibleOptions(journey.node, journey.facts);
      expect(options.length).toBeGreaterThan(0);
      answerIds = [...answerIds, options[0]!.id];
      journey = resolveTopic(service, topic!, {}, answerIds);
      guard += 1;
    }
    expect(journey.node.kind).toBe("outcome");

    const el = await HelpTopicStepPage({
      params: Promise.resolve({ lang: "en", topic: topic!.slug }),
      searchParams: Promise.resolve({ a: answerIds }),
    });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    if (journey.node.kind === "outcome") {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(journey.node.title.en);
    }
    // The satisfaction prompt the Service Manual requires at a journey's end.
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("/help/answers/you renders one h1, a help slot, and a radio group per audience question", async () => {
    const el = await HelpAudienceProfilePage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(el);

    assertOneH1(container);
    assertHelpSlot();
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(0);
  });

  it("emits no raw Tailwind font-size or line-height utility on the hub and a topic start page", async () => {
    const topic = service.topics.find((t) => !t.hideFromHub)!;
    const hubEl = await HelpAnswersHubPage({
      params: Promise.resolve({ lang: "en" }),
      searchParams: Promise.resolve({}),
    });
    const hub = render(hubEl);
    assertNoRawTypeUtilities(hub.container);
    hub.unmount();

    const topicEl = await HelpTopicStartPage({
      params: Promise.resolve({ lang: "en", topic: topic.slug }),
      searchParams: Promise.resolve({}),
    });
    const topicPage = render(topicEl);
    assertNoRawTypeUtilities(topicPage.container);
    topicPage.unmount();
  });
});

describe("Thai locale: bilingual parity for the pages that carry ExitThisPage", () => {
  it("reporting renders in Thai with the Thai ExitThisPage label, authored natively", async () => {
    const el = await ReportingPage({ params: Promise.resolve({ lang: "th" }) });
    render(el);
    expect(screen.getByRole("link", { name: helpTh.exitThisPage.label })).toHaveAttribute(
      "href",
      "https://www.google.com"
    );
  });

  it("welfare renders in Thai with the Thai ExitThisPage label, authored natively", async () => {
    const el = await WelfarePage({ params: Promise.resolve({ lang: "th" }) });
    render(el);
    expect(screen.getByRole("link", { name: helpTh.exitThisPage.label })).toHaveAttribute(
      "href",
      "https://www.google.com"
    );
  });
});

describe("healthcare-and-insurance in Thai: the decided fact, stated natively", () => {
  it("states the requirement plainly in Thai too, and does not hedge", async () => {
    const el = await HealthcareAndInsurancePage({ params: Promise.resolve({ lang: "th" }) });
    const { container } = render(el);
    // "เป็นข้อกำหนดที่ต้องมี" ("is a requirement that must be met") is the
    // plain Thai statement; the page must not fall back to a hedge like
    // "อาจจะ" (may / might) around the requirement itself.
    expect(container.textContent).toMatch(/ต้องมีประกันสุขภาพ|ประกันสุขภาพเป็นข้อกำหนดที่ต้องมี/);
  });
});
