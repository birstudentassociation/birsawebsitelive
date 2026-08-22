/**
 * Tests for link integrity (lib/cms/validation/linkIntegrity.ts), the
 * external link register (lib/cms/externalLinkRegister.ts), and the nightly
 * content integrity cron (app/api/cron/content-integrity/route.ts).
 *
 * NO REAL NETWORK CALL ANYWHERE IN THIS FILE. Every fetch is a hand written
 * fake matching the narrow FetchLike contract, and next-sanity's
 * createClient is mocked so the cron route never opens a real connection to
 * the Content Lake. Network is restricted in this environment, so a test
 * that needs the internet is a test that fails in CI, not a test that
 * proves anything.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkInternalLinks,
  checkExternalLink,
  checkExternalLinkRegister,
  blocksPublication as internalLinksBlockPublication,
  type FetchLike,
  type InternalLinkCheck,
  type LinkResolver,
} from "@/lib/cms/validation/linkIntegrity";
import {
  extractExternalUrls,
  seedExternalLinkCandidates,
  type ExternalLinkRegisterEntry,
} from "@/lib/cms/externalLinkRegister";

// ---------------------------------------------------------------------------
// Internal links: no network involved at all, a plain resolver lookup
// ---------------------------------------------------------------------------

describe("checkInternalLinks", () => {
  const resolver: LinkResolver = (path) => {
    if (path === "/en/services/lost-and-found") return { exists: true, published: true };
    if (path === "/en/services/draft-only") return { exists: true, published: false };
    return { exists: false, published: false };
  };

  it("fails a link to a document that does not exist", async () => {
    const links: InternalLinkCheck[] = [
      { sourcePath: "news.orientation.body.links[0]", href: "/en/services/does-not-exist" },
    ];
    const findings = await checkInternalLinks(links, resolver);

    expect(findings).toHaveLength(1);
    expect(findings[0]!.reason).toBe("missing");
    expect(findings[0]!.sourcePath).toBe("news.orientation.body.links[0]");
    expect(internalLinksBlockPublication(findings)).toBe(true);
  });

  it("fails a link to a document that exists but is not published", async () => {
    const links: InternalLinkCheck[] = [
      { sourcePath: "news.orientation.body.links[1]", href: "/en/services/draft-only" },
    ];
    const findings = await checkInternalLinks(links, resolver);

    expect(findings).toHaveLength(1);
    expect(findings[0]!.reason).toBe("unpublished");
  });

  it("passes a link to an existing, published document", async () => {
    const links: InternalLinkCheck[] = [
      { sourcePath: "news.orientation.body.links[2]", href: "/en/services/lost-and-found" },
    ];
    const findings = await checkInternalLinks(links, resolver);
    expect(findings).toEqual([]);
    expect(internalLinksBlockPublication(findings)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// External links: a hand-rolled fake fetch, never the real thing
// ---------------------------------------------------------------------------

function fakeFetch(status: number, location: string | null = null): FetchLike {
  return async () => ({
    status,
    headers: { get: (name: string) => (name.toLowerCase() === "location" ? location : null) },
  });
}

describe("checkExternalLink", () => {
  it("raises a 404 as dead", async () => {
    const outcome = await checkExternalLink("https://example.com/gone", fakeFetch(404));
    expect(outcome).toEqual({ kind: "dead", httpStatus: 404 });
  });

  it("raises a redirect distinctly from a 404", async () => {
    const redirect = await checkExternalLink(
      "https://example.com/moved",
      fakeFetch(301, "https://example.com/new")
    );
    const dead = await checkExternalLink("https://example.com/gone", fakeFetch(404));

    // Different kind...
    expect(redirect.kind).toBe("redirect");
    expect(dead.kind).toBe("dead");
    expect(redirect.kind).not.toBe(dead.kind);
    // ...and a redirect carries the destination a 404 has no equivalent of.
    expect(redirect).toEqual({
      kind: "redirect",
      httpStatus: 301,
      location: "https://example.com/new",
    });
  });

  it("treats 200 to 299 as ok", async () => {
    const outcome = await checkExternalLink("https://example.com/fine", fakeFetch(200));
    expect(outcome).toEqual({ kind: "ok", httpStatus: 200 });
  });

  it("degrades a thrown network error to an error outcome rather than throwing", async () => {
    const throwingFetch: FetchLike = async () => {
      throw new Error("getaddrinfo ENOTFOUND example.invalid");
    };
    const outcome = await checkExternalLink("https://example.invalid", throwingFetch);
    expect(outcome.kind).toBe("error");
    if (outcome.kind === "error") {
      expect(outcome.error).toContain("ENOTFOUND");
    }
  });

  it("requests with redirect: manual, so a real redirect is seen rather than silently followed", async () => {
    const seenInit: { method?: string; redirect?: string }[] = [];
    const spyFetch: FetchLike = async (_url, init) => {
      seenInit.push(init);
      return { status: 200, headers: { get: () => null } };
    };
    await checkExternalLink("https://example.com", spyFetch);
    expect(seenInit[0]).toEqual({ method: "HEAD", redirect: "manual" });
  });
});

describe("checkExternalLinkRegister", () => {
  const entries: ExternalLinkRegisterEntry[] = [
    {
      id: "fictional-registrar",
      url: "https://registrar.example.invalid",
      owner: "academic-affairs",
      body: "registrar",
      label: { en: "Fictional Registrar", th: "สำนักทะเบียนสมมติ" },
      lastCheckedAt: null,
    },
    {
      id: "fictional-oia",
      url: "https://oia.example.invalid",
      owner: "foreign-students",
      body: "oia",
      label: { en: "Fictional OIA", th: "กองวิเทศสัมพันธ์สมมติ" },
      lastCheckedAt: null,
    },
    {
      id: "fictional-healthy",
      url: "https://healthy.example.invalid",
      owner: "sport",
      body: "other",
      label: { en: "Fictional Healthy Link", th: "ลิงก์สมมติที่ยังใช้ได้" },
      lastCheckedAt: null,
    },
  ];

  it("raises only the entries that are not ok, and reports dead and redirect distinctly", async () => {
    const routedFetch: FetchLike = async (url) => {
      if (url.includes("registrar")) return { status: 404, headers: { get: () => null } };
      if (url.includes("oia"))
        return { status: 302, headers: { get: () => "https://oia.example.invalid/new" } };
      return { status: 200, headers: { get: () => null } };
    };

    const findings = await checkExternalLinkRegister(entries, routedFetch);

    // The healthy link produces nothing: a cron whose output includes every
    // healthy link is a cron whose output nobody reads.
    expect(findings).toHaveLength(2);

    const dead = findings.find((f) => f.entryId === "fictional-registrar")!;
    const redirect = findings.find((f) => f.entryId === "fictional-oia")!;

    expect(dead.outcome.kind).toBe("dead");
    expect(redirect.outcome.kind).toBe("redirect");
    expect(dead.outcome.kind).not.toBe(redirect.outcome.kind);

    // The messages are distinct too, in both locales, not just the kind tag.
    expect(dead.message.en).not.toBe(redirect.message.en);
    expect(dead.message.en.toLowerCase()).toContain("no longer reachable");
    expect(redirect.message.en.toLowerCase()).toContain("redirect");

    // Never the raw content of the page, only the entry's own label.
    expect(dead.message.en).toContain("Fictional Registrar");
    expect(redirect.message.en).toContain("Fictional OIA");
  });

  it("degrades a fetch that throws to an error finding rather than failing the whole register", async () => {
    const throwingFetch: FetchLike = async () => {
      throw new Error("network unreachable");
    };
    const findings = await checkExternalLinkRegister(entries, throwingFetch);
    expect(findings).toHaveLength(3);
    expect(findings.every((f) => f.outcome.kind === "error")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// The external link register: seeding from existing content
// ---------------------------------------------------------------------------

describe("extractExternalUrls", () => {
  it("finds an external URL and excludes BIRSA's own and social hosts", () => {
    const text = `
      See https://www.reg.tu.ac.th/en for the registrar.
      Follow us at https://instagram.com/birsa_tu and https://birsa.example.com/internal.
      Submit the form at https://forms.gle/abcd1234.
    `;
    expect(extractExternalUrls(text)).toEqual(["https://www.reg.tu.ac.th/en"]);
  });

  it("deduplicates repeated URLs", () => {
    const text = "https://oia.tu.ac.th and again https://oia.tu.ac.th";
    expect(extractExternalUrls(text)).toEqual(["https://oia.tu.ac.th"]);
  });
});

describe("seedExternalLinkCandidates", () => {
  it("can seed candidates from existing 1.0 content, with a guessed body and the source file kept", () => {
    const files = [
      {
        path: "content/student-life/en/handbook/about-bir.mdx",
        text: "Registrar: https://www.reg.tu.ac.th",
      },
      { path: "content/site.ts", text: "oia: https://www.oia.tu.ac.th" },
    ];
    const candidates = seedExternalLinkCandidates(files);

    expect(candidates).toHaveLength(2);
    const registrar = candidates.find((c) => c.url === "https://www.reg.tu.ac.th");
    expect(registrar?.sourceFile).toBe("content/student-life/en/handbook/about-bir.mdx");
    expect(registrar?.guessedBody).toBe("registrar");
  });
});

// ---------------------------------------------------------------------------
// The nightly cron route: degrades, never throws, faked network throughout
// ---------------------------------------------------------------------------

// vi.mock factories are hoisted above imports, so a mutable fixture the
// factory reads has to live in a vi.hoisted container (same pattern as
// tests/unit/retention.test.ts's FakeClient for lib/inventory/db).
const sanityState = vi.hoisted(() => ({
  fetchImpl: async (): Promise<unknown[]> => [],
}));

vi.mock("next-sanity", () => ({
  createClient: () => ({
    fetch: (...args: unknown[]) => sanityState.fetchImpl(...(args as [])),
  }),
}));

describe("content integrity cron route", () => {
  const ORIGINAL_ENV = { ...process.env };
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.CRON_SECRET = "test-cron-secret";
    delete process.env.SANITY_API_READ_TOKEN;
    sanityState.fetchImpl = async () => [];
    // Every external link check in these tests goes through this fake, never
    // a real network call, even though SEEDED_EXTERNAL_LINKS carries real
    // looking Thammasat URLs.
    global.fetch = (async () => ({
      status: 200,
      headers: { get: () => null },
    })) as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function makeRequest(secret = "test-cron-secret") {
    return new Request("https://internal.example.com/api/cron/content-integrity", {
      headers: { authorization: `Bearer ${secret}` },
    });
  }

  it("returns 401 without the correct cron secret", async () => {
    const { GET } = await import("@/app/api/cron/content-integrity/route");
    const response = await GET(makeRequest("wrong-secret"));
    expect(response.status).toBe(401);
  });

  it("returns ok: false, not-configured when CRON_SECRET itself is unset, without running anything", async () => {
    delete process.env.CRON_SECRET;
    const { GET } = await import("@/app/api/cron/content-integrity/route");
    const response = await GET(makeRequest());
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: false, reason: "not-configured" });
  });

  it("degrades to sanity: not-configured when there is no Sanity read token, and still checks external links", async () => {
    const { GET } = await import("@/app/api/cron/content-integrity/route");
    const response = await GET(makeRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.sanity).toBe("not-configured");
    expect(body.summary.documentsChecked).toBe(0);
    // External links still get checked: that half never needs Sanity at all.
    expect(body.summary.externalLinks.checked).toBeGreaterThan(0);
  });

  it("degrades to sanity: unreachable rather than throwing when the Content Lake fetch rejects", async () => {
    process.env.SANITY_API_READ_TOKEN = "fake-token-for-test";
    sanityState.fetchImpl = async () => {
      throw new Error("fetch failed");
    };

    const { GET } = await import("@/app/api/cron/content-integrity/route");
    const response = await GET(makeRequest());
    const body = await response.json();

    // The site must not go down because a third party is down: this is a
    // 200 with a reason, never a thrown error or a failed request.
    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.sanity).toBe("unreachable");
    expect(body.summary.documentsChecked).toBe(0);
    expect(body.staleDocuments).toEqual([]);
    expect(body.parityIssues).toEqual([]);
  });

  it("raises a dead external link distinctly from a redirecting one, entirely through the faked fetch", async () => {
    global.fetch = (async (url: string) => {
      if (url.includes("reg.tu.ac.th")) return { status: 404, headers: { get: () => null } };
      if (url.includes("oia.tu.ac.th"))
        return { status: 301, headers: { get: () => "https://oia.tu.ac.th/new" } };
      return { status: 200, headers: { get: () => null } };
    }) as unknown as typeof fetch;

    const { GET } = await import("@/app/api/cron/content-integrity/route");
    const response = await GET(makeRequest());
    const body = await response.json();

    expect(body.summary.externalLinks.dead).toBeGreaterThanOrEqual(1);
    expect(body.summary.externalLinks.redirected).toBeGreaterThanOrEqual(1);
    const kinds = new Set(body.externalLinkIssues.map((i: { kind: string }) => i.kind));
    expect(kinds.has("dead")).toBe(true);
    expect(kinds.has("redirect")).toBe(true);
  });

  it("reports parity and staleness issues by id only, never the document's own text", async () => {
    process.env.SANITY_API_READ_TOKEN = "fake-token-for-test";
    const sensitiveTitle = "Jane Testperson lost her national ID card near the Prachan Gate";

    sanityState.fetchImpl = async () => [
      {
        _id: "news.fixture-one",
        _type: "news",
        title: { en: sensitiveTitle, th: "" },
        lifecycle: {
          status: "published",
          owner: "academic-affairs",
          reviewBy: "2020-01-01",
          lastReviewed: "2019-01-01",
          slugHistory: [],
          maintainedBecause: null,
        },
      },
    ];

    const { GET } = await import("@/app/api/cron/content-integrity/route");
    const response = await GET(makeRequest());
    const body = await response.json();

    expect(body.summary.bilingualParity.documentsWithMissingLocale).toBe(1);
    expect(body.summary.staleness.overdueCount).toBe(1);
    expect(body.parityIssues[0]).toEqual({
      id: "news.fixture-one",
      documentType: "news",
      missingLocales: ["th"],
    });
    expect(body.staleDocuments[0].id).toBe("news.fixture-one");
    expect(body.staleDocuments[0].owner).toBe("academic-affairs");

    // The whole response, never just the fields we already asserted on,
    // must not carry the sentence a reader actually wrote.
    expect(JSON.stringify(body)).not.toContain("Jane Testperson");
    expect(JSON.stringify(body)).not.toContain("Prachan Gate");
  });
});
