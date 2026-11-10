// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import RightNow from "@/components/home/RightNow";

const busBody = {
  ok: true,
  updatedAt: "2026-11-10T07:14:00Z",
  stops: {
    "2373": { "2-9 (53L)|Thewet": [{ waitSeconds: 400, airCondition: true }] },
    "1573": {},
    "1061": { "4-11 (43)|Pak Nam": [{ waitSeconds: 180, airCondition: false }] },
  },
};

const conditionsBody = {
  ok: true,
  generatedAt: "2026-11-10T07:14:00Z",
  cards: [
    { card: "travel", level: "normal" },
    { card: "campus", level: "normal" },
    { card: "riverside", level: "unknown" },
    { card: "health", level: "normal" },
  ],
  readings: [{ id: "heatIndex", value: 32.4 }],
};

function jsonResponse(body: unknown, ok = true) {
  return Promise.resolve({ ok, json: () => Promise.resolve(body) } as Response);
}

function mockFetch(handlers: {
  bus?: () => Promise<Response>;
  conditions?: () => Promise<Response>;
}) {
  const fetchMock = vi.fn((input: RequestInfo | URL) => {
    const url = String(input);
    if (url.startsWith("/api/bus-eta")) return (handlers.bus ?? (() => jsonResponse(busBody)))();
    return (handlers.conditions ?? (() => jsonResponse(conditionsBody)))();
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function renderSettled(locale: "en" | "th" = "en") {
  render(<RightNow locale={locale} />);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-10T07:14:00Z"));
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("RightNow", () => {
  it("states the next shuttle for a known Bangkok time", async () => {
    mockFetch({});
    await renderSettled();
    const link = screen.getByRole("link", { name: /Shuttle to MRT Sanam Chai/ });
    expect(link).toHaveAttribute("href", "/en/student-life/getting-around/shuttle-bus");
    expect(link).toHaveTextContent(/Leaves \d\d:\d\d, in \d+ minutes?/);
    expect(screen.getByText("Updated 14:14")).toBeInTheDocument();
  });

  it("shows the soonest bus and a conditions verdict", async () => {
    mockFetch({});
    await renderSettled();
    expect(screen.getByText("Bus 43 in 3 minutes")).toBeInTheDocument();
    expect(screen.getByText("Public bus, Opposite Tha Phra Chan")).toBeInTheDocument();
    expect(screen.getByText("Fine to go out, feels like 32°C")).toBeInTheDocument();
  });

  it("shows the fallback text when fetches fail", async () => {
    mockFetch({
      bus: () => Promise.reject(new Error("offline")),
      conditions: () => jsonResponse({ ok: false }, false),
    });
    await renderSettled();
    expect(screen.getByText("Live bus times unavailable. See the stops.")).toBeInTheDocument();
    expect(screen.getByText("Conditions unavailable. See the details.")).toBeInTheDocument();
  });

  it("toggles aria-pressed and stops refreshing while paused", async () => {
    const fetchMock = mockFetch({});
    await renderSettled();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);

    const button = screen.getByRole("button", { name: "Pause updates" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Resume updates" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("Paused at 14:15")).toBeInTheDocument();
    expect(window.localStorage.getItem("birsa.home.liveUpdates")).toBe("off");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(180_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("does not throw when storage fails", async () => {
    mockFetch({});
    vi.resetModules();
    const { default: FreshRightNow } = await import("@/components/home/RightNow");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<FreshRightNow locale="en" />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    const button = screen.getByRole("button", { name: "Pause updates" });
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(screen.getByRole("button", { name: "Resume updates" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("has no live regions", async () => {
    mockFetch({});
    const { container } = render(<RightNow locale="en" />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(container.querySelector("[aria-live]")).toBeNull();
  });

  it("renders Thai copy", async () => {
    mockFetch({});
    await renderSettled("th");
    expect(screen.getByRole("heading", { level: 2, name: "ตอนนี้" })).toBeInTheDocument();
    expect(screen.getByText("อัปเดตเมื่อ 14.14 น.")).toBeInTheDocument();
  });
});
