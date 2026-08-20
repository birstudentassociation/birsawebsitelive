// @vitest-environment jsdom
/**
 * Unit tests for the media cluster's image components (REDESIGN-2.0 §4.7B):
 * `Figure`, `HeroImage`, `CardImage`, `Gallery`, `Portrait`.
 *
 * `Gallery`'s `<dialog>` uses the same native-dialog approach as
 * `ConfirmDialog` (`tests/unit/confirm-dialog.test.tsx`), so it needs the
 * same jsdom polyfill for `showModal`/`close` for the same reason: jsdom
 * reflects `<dialog>`'s `open` attribute but does not implement those two
 * methods. Real-browser modal behaviour (the actual focus trap a browser's
 * top layer gives a native `<dialog>` for free) is out of scope for jsdom,
 * exactly as `confirm-dialog.test.tsx` notes; what is tested here is the
 * wiring `Gallery` shares with `ConfirmDialog` (open/close state, the
 * `cancel` event standing in for Escape, keyboard-reachable controls) and
 * the no-JavaScript fallback markup, which is real, ordinary HTML this
 * jsdom environment renders exactly as any browser would.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import Figure from "@/components/bds/Figure";
import HeroImage from "@/components/bds/HeroImage";
import CardImage from "@/components/bds/CardImage";
import Gallery, { type GalleryItem } from "@/components/bds/Gallery";
import Portrait from "@/components/bds/Portrait";
import { ratioClassName } from "@/components/bds/Figure";
import { aspectRatios, type AspectRatio, type ImageField } from "@/components/bds/imageContract";

vi.mock("@/lib/committee-portrait", () => ({
  findPortrait: vi.fn(),
}));
import { findPortrait } from "@/lib/committee-portrait";

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    };
  }
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const validImage: ImageField = {
  assetId: "welcome-fair-1",
  decorative: false,
  alt: { en: "Students at the welcome fair", th: "นักศึกษาในงานต้อนรับ" },
  caption: { en: "The 2026 welcome fair", th: "งานต้อนรับ ปี 2569" },
  credit: "BIRSA",
  ratio: "16:9",
};

const source = { src: "/images/welcome-fair-1.jpg" };

describe("Figure", () => {
  it("renders the locale's alt text for a valid image", () => {
    render(<Figure image={validImage} locale="en" source={source} />);
    expect(screen.getByAltText("Students at the welcome fair")).toBeInTheDocument();
  });

  it("renders the Thai alt text on the Thai locale", () => {
    render(<Figure image={validImage} locale="th" source={source} />);
    expect(screen.getByAltText("นักศึกษาในงานต้อนรับ")).toBeInTheDocument();
  });

  it("renders the caption and credit as real text, not baked into the image", () => {
    render(<Figure image={validImage} locale="en" source={source} />);
    expect(screen.getByText("The 2026 welcome fair")).toBeInTheDocument();
    expect(screen.getByText("BIRSA")).toBeInTheDocument();
  });

  it("throws a loud development error for an image missing Thai alt text, rather than rendering an unlabelled image", () => {
    const englishOnly: ImageField = { ...validImage, alt: { en: "Students", th: "" } };
    expect(() => render(<Figure image={englishOnly} locale="en" source={source} />)).toThrow(
      /invalid ImageField/
    );
  });

  it("throws a loud development error for an image with no alt text at all", () => {
    const noAlt: ImageField = { ...validImage, alt: null };
    expect(() => render(<Figure image={noAlt} locale="en" source={source} />)).toThrow(
      /invalid ImageField/
    );
  });

  it("renders alt=\"\" for a decorative image, as a deliberate choice rather than a default", () => {
    const decorative: ImageField = { ...validImage, decorative: true, alt: null };
    render(<Figure image={decorative} locale="en" source={source} />);
    const img = document.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("alt", "");
  });

  it("never sets fetchPriority high, never sets eager loading: every Figure image is lazy", () => {
    render(<Figure image={validImage} locale="en" source={source} />);
    const img = document.querySelector("img")!;
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it.each(aspectRatios)("renders exactly the contract ratio class for %s", (ratio: AspectRatio) => {
    const image: ImageField = { ...validImage, ratio };
    const { container } = render(<Figure image={image} locale="en" source={source} />);
    const box = container.querySelector("figure > div");
    expect(box).not.toBeNull();
    for (const className of ratioClassName[ratio].split(" ")) {
      expect(box).toHaveClass(className);
    }
  });

  it("accepts only the three contract aspect ratios at the type level", () => {
    // Compile-time guarantee: `ratioClassName` (this cluster's one ratio
    // map, re-used by every sibling component) is keyed by `AspectRatio`,
    // so a fourth ratio is a type error wherever it is used, not just here.
    // @ts-expect-error -- "3:2" is not one of the three contract ratios.
    const invalid: keyof typeof ratioClassName = "3:2";
    expect(typeof invalid).toBe("string");
  });
});

describe("HeroImage: the only component in this cluster that sets priority", () => {
  it("renders eagerly (no loading=lazy), unlike every other image in this cluster", () => {
    render(<HeroImage image={validImage} locale="en" source={source} />);
    const img = document.querySelector("img")!;
    expect(img).not.toHaveAttribute("loading", "lazy");
  });

  it("still never places text over the image: fullBleed carries no title/overlay prop", () => {
    // Type-level check: HeroImageProps has no field for overlay text at all,
    // so there is nothing to assert at runtime beyond "it was never passed
    // one" — confirmed by reading the props type, not a rendered DOM query.
    render(<HeroImage image={validImage} locale="en" source={source} fullBleed />);
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("HeroImage.tsx is the only file in this cluster that passes `priority` to next/image", async () => {
    // A behavioural DOM check (loading=lazy vs eager, above and in every
    // other component's own describe block) proves the effect; this checks
    // the JSX call site itself, so a future edit that adds a `priority`
    // prop to, say, `CardImage`'s `<Image>` call fails here even if its
    // default value happened to still behave lazily in some code path.
    // Matches `priority` only as a JSX attribute (preceded by whitespace,
    // followed by whitespace/`}`/`=`), not the many prose mentions of the
    // word in this cluster's own TSDoc comments.
    const fs = await import("node:fs");
    const path = await import("node:path");
    const jsxPropPattern = /<Image\b[\s\S]*?\/>/g;
    const priorityAttrPattern = /(^|\s)priority(\s|>|\/|$)/;

    function usesPriorityProp(source: string): boolean {
      const matches = source.match(jsxPropPattern) ?? [];
      return matches.some((tag) => priorityAttrPattern.test(tag));
    }

    for (const file of ["Figure.tsx", "CardImage.tsx", "Portrait.tsx", "Gallery.tsx"]) {
      const source = fs.readFileSync(path.join(process.cwd(), "components/bds", file), "utf8");
      expect(usesPriorityProp(source), file).toBe(false);
    }

    const heroSource = fs.readFileSync(
      path.join(process.cwd(), "components/bds/HeroImage.tsx"),
      "utf8"
    );
    expect(usesPriorityProp(heroSource)).toBe(true);
  });
});

describe("CardImage", () => {
  it("is always lazy and never renders a caption", () => {
    render(<CardImage image={validImage} locale="en" source={source} />);
    const img = document.querySelector("img")!;
    expect(img).toHaveAttribute("loading", "lazy");
    expect(screen.queryByText("The 2026 welcome fair")).toBeNull();
  });
});

describe("Gallery", () => {
  const items: GalleryItem[] = [
    {
      image: { ...validImage, assetId: "gallery-1", ratio: "4:3" },
      source: { src: "/images/gallery-1.jpg" },
    },
    {
      image: {
        ...validImage,
        assetId: "gallery-2",
        ratio: "4:3",
        alt: { en: "Officers at orientation", th: "กรรมการในวันปฐมนิเทศ" },
      },
      source: { src: "/images/gallery-2.jpg" },
    },
  ];

  const labels = {
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    positionLabel: (position: number, total: number) => `Image ${position} of ${total}`,
  };

  it("no-JS fallback: is simply the images in a list, as real links to the real images, before any script runs", () => {
    render(<Gallery items={items} locale="en" labels={labels} />);
    // Every thumbnail is a real <a href> to the full image, present in the
    // initial render exactly as it would be with JavaScript disabled: no
    // onClick has attached yet in that world, so this markup is the whole
    // experience, not a stand-in for one.
    const link1 = screen.getByRole("link", { name: "Students at the welcome fair" });
    expect(link1).toHaveAttribute("href", "/images/gallery-1.jpg");
    const link2 = screen.getByRole("link", { name: "Officers at orientation" });
    expect(link2).toHaveAttribute("href", "/images/gallery-2.jpg");

    // The lightbox itself is inert until something opens it: no `open`
    // attribute, nothing rendered inside.
    const dialog = document.querySelector("dialog")!;
    expect(dialog).not.toHaveAttribute("open");
  });

  it("opens the lightbox on a plain click and is escapable via the dialog's cancel event", () => {
    render(<Gallery items={items} locale="en" labels={labels} />);
    const dialog = document.querySelector("dialog")!;

    fireEvent.click(screen.getByRole("link", { name: "Students at the welcome fair" }), {
      button: 0,
    });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAttribute("aria-labelledby");

    // Escape fires the dialog's native "cancel" event; ConfirmDialog's own
    // handler is the model this one copies (both prevent the default close
    // and route through the same close path a Cancel-button click uses).
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("leaves a modified click (e.g. Ctrl-click, to open in a new tab) alone", () => {
    render(<Gallery items={items} locale="en" labels={labels} />);
    const dialog = document.querySelector("dialog")!;
    fireEvent.click(screen.getByRole("link", { name: "Students at the welcome fair" }), {
      button: 0,
      ctrlKey: true,
    });
    expect(dialog).not.toHaveAttribute("open");
  });

  it("is keyboard operable: Previous, Next and Close are real, named buttons", () => {
    render(<Gallery items={items} locale="en" labels={labels} />);
    fireEvent.click(screen.getByRole("link", { name: "Students at the welcome fair" }), {
      button: 0,
    });
    const dialog = document.querySelector("dialog")!;
    const within_ = within(dialog);
    expect(within_.getByRole("button", { name: "Previous image" })).toBeInTheDocument();
    expect(within_.getByRole("button", { name: "Next image" })).toBeInTheDocument();
    const closeButton = within_.getByRole("button", { name: "Close" });

    fireEvent.click(within_.getByRole("button", { name: "Next image" }));
    expect(within_.getByAltText("Officers at orientation")).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(dialog).not.toHaveAttribute("open");
  });

  it("moves between images with the arrow keys while open", () => {
    render(<Gallery items={items} locale="en" labels={labels} />);
    fireEvent.click(screen.getByRole("link", { name: "Students at the welcome fair" }), {
      button: 0,
    });
    const dialog = document.querySelector("dialog")!;
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByAltText("Officers at orientation")).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(within(dialog).getByAltText("Students at the welcome fair")).toBeInTheDocument();
  });
});

describe("Portrait: preserves lib/committee-portrait.ts's placeholder fallback exactly", () => {
  const image: ImageField = {
    assetId: "chayapon-srisukho",
    decorative: true,
    alt: null,
    ratio: "1:1",
  };

  it("renders the placeholder silhouette when findPortrait finds nothing, same as CommitteeRoster.tsx", () => {
    vi.mocked(findPortrait).mockReturnValue(null);
    render(<Portrait image={image} locale="en" />);
    expect(findPortrait).toHaveBeenCalledWith("chayapon-srisukho");
    expect(document.querySelector("img")).toBeNull();
    // The placeholder is a decorative circular silhouette: an aria-hidden
    // wrapper containing an svg, no accessible name of its own, exactly
    // like `CommitteeRoster.tsx`'s `PortraitPlaceholder`.
    const placeholder = document.querySelector('[aria-hidden="true"] svg');
    expect(placeholder).not.toBeNull();
  });

  it("renders the found image, at 1:1, when findPortrait resolves a source", () => {
    vi.mocked(findPortrait).mockReturnValue("/committee/chayapon-srisukho.webp");
    render(<Portrait image={image} locale="en" />);
    const img = document.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", expect.stringContaining("chayapon-srisukho"));
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("throws in development if a non-1:1 ratio is passed: committee portraits are square only", () => {
    vi.mocked(findPortrait).mockReturnValue(null);
    const wrongRatio: ImageField = { ...image, ratio: "16:9" };
    expect(() => render(<Portrait image={wrongRatio} locale="en" />)).toThrow(/1:1/);
  });
});
