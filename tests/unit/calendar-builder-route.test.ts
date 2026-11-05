import { describe, expect, it } from "vitest";
import { GET } from "@/app/[lang]/my-calendar.ics/route";

function call(lang: string, query = "") {
  return GET(new Request(`https://example.test/${lang}/my-calendar.ics${query}`), {
    params: Promise.resolve({ lang }),
  });
}

describe("GET /[lang]/my-calendar.ics", () => {
  it("serves text/calendar with the cache header", async () => {
    const res = await call("en", "?inc=birsa");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/calendar; charset=utf-8");
    expect(res.headers.get("Cache-Control")).toBe(
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    );
    expect(res.headers.get("Content-Disposition")).toMatch(/^inline/);
    expect(await res.text()).toContain("BEGIN:VEVENT");
  });

  it("serves an attachment for download=1", async () => {
    const res = await call("th", "?download=1");
    expect(res.headers.get("Content-Disposition")).toBe(
      'attachment; filename="bir-calendar-th.ics"'
    );
  });

  it("returns a valid empty calendar for an empty selection", async () => {
    const res = await call("en", "?inc=");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).not.toContain("BEGIN:VEVENT");
  });

  it("includes class events from the query", async () => {
    const res = await call("en", "?inc=classes&c=PI271~1~0930~1220~Room%20301");
    expect(await res.text()).toContain("RRULE:FREQ=WEEKLY");
  });

  it("404s on an unknown locale", async () => {
    await expect(call("fr")).rejects.toThrow();
  });
});
