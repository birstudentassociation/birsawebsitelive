// @vitest-environment jsdom
/**
 * Unit tests for the status cluster (REDESIGN-2.0 `components/bds/manifest.ts`,
 * "status": `Notice`, `NotificationBanner`, `WarningText`, `InsetText`,
 * `Panel`, `Tag`, `PhaseBanner`, `EmergencyBanner`). §8 heuristic 4: 1.0 had
 * four kinds of box with overlapping jobs and no rule, and two status tags.
 * These tests pin down the rule and the merge so neither regresses:
 *
 *   - every status variant renders a visible word, never colour alone
 *     (BUILD-BRIEF-2.0 §7).
 *   - role="status" or role="alert" lands on the component whose usage rule
 *     calls for it, and nowhere else.
 *   - `Panel` renders the reference number as the most prominent element.
 *   - `PhaseBanner` renders nothing when `active` is false.
 *   - `Tag` covers every status value 1.0's `Tag.tsx` and `StatusPill.tsx`
 *     supported between them.
 *   - no component in this cluster emits a Tailwind font-size or
 *     line-height utility (the D7 regression guard from
 *     `tests/unit/bds-type.test.tsx`, applied to this cluster).
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import Notice, { type NoticeVariant } from "@/components/bds/Notice";
import NotificationBanner, {
  type NotificationBannerVariant,
} from "@/components/bds/NotificationBanner";
import WarningText from "@/components/bds/WarningText";
import InsetText from "@/components/bds/InsetText";
import Panel from "@/components/bds/Panel";
import Tag, { loanStatusVariant, type TagVariant } from "@/components/bds/Tag";
import PhaseBanner from "@/components/bds/PhaseBanner";
import EmergencyBanner from "@/components/bds/EmergencyBanner";
import type { LoanStatus } from "@/lib/inventory/types";

afterEach(cleanup);

/** Any Tailwind font-size or line-height utility, the utilities D7 forbids (matches tests/unit/bds-type.test.tsx). */
const TAILWIND_TYPE_UTILITY = /\b(text-(xs|sm|base|lg|xl|\d?xl)|leading-)/;

describe("Notice", () => {
  const variants: NoticeVariant[] = ["info", "success", "warning", "error", "placeholder"];

  it.each(variants)("renders the visible word for the %s variant, not colour alone", (variant) => {
    render(<Notice variant={variant}>Message for {variant}.</Notice>);
    expect(screen.getByText(`Message for ${variant}.`)).toBeInTheDocument();
  });

  it("renders an optional title as visible text", () => {
    render(
      <Notice variant="info" title="Heads up">
        Details.
      </Notice>
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("carries no live-region role: it is inline content, not a result", () => {
    render(<Notice variant="success">Done.</Notice>);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(
      <Notice variant="warning" title="Title">
        Body
      </Notice>
    );
    for (const el of container.querySelectorAll("*")) {
      expect(el.getAttribute("class") || "").not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  });
});

describe("NotificationBanner", () => {
  const variants: NotificationBannerVariant[] = ["success", "info", "warning", "error"];

  it.each(variants)(
    "renders the visible title and body for the %s variant, not colour alone",
    (variant) => {
      render(
        <NotificationBanner variant={variant} title={`Title ${variant}`}>
          Body {variant}.
        </NotificationBanner>
      );
      expect(screen.getByText(`Title ${variant}`)).toBeInTheDocument();
      expect(screen.getByText(`Body ${variant}.`)).toBeInTheDocument();
    }
  );

  it('uses role="status" for success, info and warning', () => {
    for (const variant of ["success", "info", "warning"] as const) {
      const { unmount } = render(
        <NotificationBanner variant={variant} title="Result">
          Body
        </NotificationBanner>
      );
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).toBeNull();
      unmount();
    }
  });

  it('uses role="alert" for error, and only for error', () => {
    render(
      <NotificationBanner variant="error" title="Failed">
        Something went wrong.
      </NotificationBanner>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("is focusable but not part of the Tab order (tabIndex -1) and takes focus on mount", () => {
    render(
      <NotificationBanner variant="success" title="Submitted">
        Saved.
      </NotificationBanner>
    );
    const banner = screen.getByRole("status");
    expect(banner).toHaveAttribute("tabindex", "-1");
    expect(banner).toHaveFocus();
  });

  it("does not take focus when autoFocus is false", () => {
    render(
      <NotificationBanner variant="success" title="Submitted" autoFocus={false}>
        Saved.
      </NotificationBanner>
    );
    expect(screen.getByRole("status")).not.toHaveFocus();
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(
      <NotificationBanner variant="info" title="Title">
        Body
      </NotificationBanner>
    );
    for (const el of container.querySelectorAll("*")) {
      expect(el.getAttribute("class") || "").not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  });
});

describe("WarningText", () => {
  it("renders the visible label word and the consequence, not colour alone", () => {
    render(<WarningText label="Warning">You cannot undo this.</WarningText>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText(/You cannot undo this\./)).toBeInTheDocument();
  });

  it("carries no live-region role: it is a consequence in the page flow, not a result", () => {
    render(<WarningText label="Warning">Read this first.</WarningText>);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(<WarningText label="Warning">Body</WarningText>);
    for (const el of container.querySelectorAll("*")) {
      expect(el.getAttribute("class") || "").not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  });
});

describe("InsetText", () => {
  it("renders its content as a plain aside with no status role", () => {
    render(<InsetText>A quoted aside.</InsetText>);
    expect(screen.getByText("A quoted aside.")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("renders as a blockquote when asked", () => {
    render(<InsetText as="blockquote">A real quotation.</InsetText>);
    expect(screen.getByText("A real quotation.").closest("blockquote")).not.toBeNull();
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(<InsetText>Body</InsetText>);
    for (const el of container.querySelectorAll("*")) {
      expect(el.getAttribute("class") || "").not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  });
});

describe("Panel", () => {
  it("renders the title, reference label and reference number as visible text", () => {
    render(
      <Panel
        title="Application complete"
        referenceLabel="Your reference number"
        reference="HDJ2123F"
      />
    );
    expect(screen.getByText("Application complete")).toBeInTheDocument();
    expect(screen.getByText("Your reference number")).toBeInTheDocument();
    expect(screen.getByText("HDJ2123F")).toBeInTheDocument();
  });

  it("renders the reference number as the most prominent (largest type-scale) element", () => {
    render(
      <Panel
        title="Application complete"
        referenceLabel="Your reference number"
        reference="HDJ2123F"
      />
    );
    const reference = screen.getByText("HDJ2123F");
    const title = screen.getByText("Application complete");
    const label = screen.getByText("Your reference number");

    // The scale, in ascending order (components/bds/tokens.ts's typeSteps).
    const scaleRank = [
      "text-body-sm",
      "text-body",
      "text-heading-3",
      "text-heading-2",
      "text-heading-1",
      "text-display-2",
      "text-display-1",
    ];
    const rankOf = (el: Element) =>
      scaleRank.findIndex((cls) => el.className.split(/\s+/).includes(cls));

    const referenceRank = rankOf(reference);
    expect(referenceRank).toBeGreaterThan(-1);
    expect(referenceRank).toBeGreaterThan(rankOf(title));
    expect(referenceRank).toBeGreaterThan(rankOf(label));
  });

  it("renders the title at the level the caller asks for", () => {
    render(
      <Panel
        level={2}
        title="Application complete"
        referenceLabel="Your reference number"
        reference="HDJ2123F"
      />
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Application complete" })
    ).toBeInTheDocument();
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(
      <Panel title="Title" referenceLabel="Reference label" reference="REF123" />
    );
    for (const el of container.querySelectorAll("*")) {
      expect(el.getAttribute("class") || "").not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  });
});

describe("Tag", () => {
  // 1.0's `components/Tag.tsx` category variants plus
  // `components/inventory/StatusPill.tsx`'s LoanStatus values, taken from
  // the source (see Tag.tsx's file-level TSDoc), not guessed.
  const categoryVariants: TagVariant[] = ["neutral", "brand"];
  const loanStatuses: LoanStatus[] = [
    "pending",
    "approved",
    "checked_out",
    "overdue",
    "returned",
    "rejected",
    "cancelled",
    "no_show",
  ];

  it.each(categoryVariants)("renders the visible word for the %s category variant", (variant) => {
    render(<Tag variant={variant}>{`Label ${variant}`}</Tag>);
    expect(screen.getByText(`Label ${variant}`)).toBeInTheDocument();
  });

  it.each(loanStatuses)(
    "covers the LoanStatus value %s with a variant, and still renders the caller's word",
    (status) => {
      expect(loanStatusVariant[status]).toBeDefined();
      render(<Tag variant={loanStatusVariant[status]}>{`Status: ${status}`}</Tag>);
      expect(screen.getByText(`Status: ${status}`)).toBeInTheDocument();
    }
  );

  it("supports an aria-label override for an ambiguous visible word", () => {
    render(
      <Tag variant="info" aria-label="Price range: two of three">
        ฿฿
      </Tag>
    );
    expect(screen.getByLabelText("Price range: two of three")).toBeInTheDocument();
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    render(<Tag variant="success">Returned</Tag>);
    const el = screen.getByText("Returned");
    expect(el.className).not.toMatch(TAILWIND_TYPE_UTILITY);
  });
});

describe("PhaseBanner", () => {
  it("renders nothing when active is false", () => {
    const { container } = render(
      <PhaseBanner
        active={false}
        phaseLabel="Beta"
        feedbackHref="/feedback"
        feedbackLabel="Give feedback"
      >
        This is a new area of the site.
      </PhaseBanner>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the phase word, the message and the feedback link when active", () => {
    render(
      <PhaseBanner
        active={true}
        phaseLabel="Beta"
        feedbackHref="/feedback"
        feedbackLabel="Give feedback"
      >
        This is a new area of the site.
      </PhaseBanner>
    );
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText(/This is a new area of the site\./)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Give feedback" })).toHaveAttribute(
      "href",
      "/feedback"
    );
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(
      <PhaseBanner
        active={true}
        phaseLabel="Beta"
        feedbackHref="/feedback"
        feedbackLabel="Feedback"
      >
        Body
      </PhaseBanner>
    );
    for (const el of container.querySelectorAll("*")) {
      expect(el.getAttribute("class") || "").not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  });
});

describe("EmergencyBanner", () => {
  it("renders the message and call to action as visible text, not colour alone", () => {
    render(
      <EmergencyBanner
        href="/emergency/flooding"
        message="Campus is closed."
        cta="Read more"
        severity="critical"
      />
    );
    expect(screen.getByText("Campus is closed.")).toBeInTheDocument();
    expect(screen.getByText("Read more")).toBeInTheDocument();
  });

  it('uses role="alert" for critical severity', () => {
    render(
      <EmergencyBanner
        href="/emergency/flooding"
        message="Campus is closed."
        cta="Read more"
        severity="critical"
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it.each(["warning", "info"] as const)('uses role="status" for %s severity', (severity) => {
    render(
      <EmergencyBanner
        href="/emergency/generic"
        message="Advisory."
        cta="Read more"
        severity={severity}
      />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("keeps the anchor's own link semantics under the live-region wrapper", () => {
    render(
      <EmergencyBanner
        href="/emergency/flooding"
        message="Campus is closed."
        cta="Read more"
        severity="critical"
      />
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/emergency/flooding");
  });

  it("never emits a Tailwind font-size or line-height utility", () => {
    const { container } = render(
      <EmergencyBanner
        href="/emergency/flooding"
        message="Campus is closed."
        cta="Read more"
        severity="info"
      />
    );
    for (const el of container.querySelectorAll("*")) {
      expect(el.getAttribute("class") || "").not.toMatch(TAILWIND_TYPE_UTILITY);
    }
  });
});
