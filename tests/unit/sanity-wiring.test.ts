/**
 * Wave 3A wiring tests (REDESIGN-2.0 sections 6.4, 6.5, 6.9, 6.11).
 *
 * Four things this wave must get right before any schema work matters.
 *
 *   1. The client is built from `sanity/projectConfig.ts`, and the project
 *      id is not hardcoded anywhere else in the source tree.
 *   2. The read token never reaches a client component or a public export,
 *      because a leaked write token is a stranger editing BIRSA's content.
 *   3. Draft mode enable refuses an unauthorised request rather than
 *      leaking unpublished content, and does so by returning a response
 *      rather than throwing, which is what REDESIGN-2.0 section 6.9 asks
 *      of every module on the site.
 *   4. Draft mode disable exists and clears what enable set.
 *
 * Plus the studio route placement, which section 6.4's own routing choice
 * depends on staying true.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { client } from "@/sanity/lib/client";
import { apiVersion, dataset, projectId, studioBasePath } from "@/sanity/env";
import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from "@/sanity/projectConfig";

const REPO_ROOT = process.cwd();

// ---------------------------------------------------------------------------
// A small source tree walker, in the spirit of the repo wide sweep
// `tests/unit/bds-type.test.tsx` and `tests/unit/design-completeness.test.ts`
// run over `components/bds/`, widened here to the directories that could
// plausibly hardcode a Sanity value or import the token.
// ---------------------------------------------------------------------------

const SOURCE_DIRS = ["app", "components", "content", "db", "lib", "sanity", "scripts", "tests"];
const ROOT_FILES = [
  "sanity.config.ts",
  "sanity.cli.ts",
  "proxy.ts",
  "next.config.mjs",
  "eslint.config.mjs",
  "postcss.config.mjs",
  "vitest.config.ts",
  "playwright.config.ts",
];
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".next-verify",
  "out",
  "build",
  "coverage",
  ".vercel",
]);

function walk(dir: string, out: string[]): void {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (CODE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
}

/** Every source file this wiring test is responsible for sweeping. */
function allSourceFiles(): string[] {
  const files: string[] = [];
  for (const dir of SOURCE_DIRS) {
    walk(path.join(REPO_ROOT, dir), files);
  }
  for (const rootFile of ROOT_FILES) {
    const full = path.join(REPO_ROOT, rootFile);
    if (existsSync(full)) files.push(full);
  }
  return files;
}

describe("the client is configured from projectConfig, not literals", () => {
  it("carries the exact project id, dataset and api version projectConfig exports", () => {
    expect(client.config().projectId).toBe(SANITY_PROJECT_ID);
    expect(client.config().dataset).toBe(SANITY_DATASET);
    expect(client.config().apiVersion).toBe(SANITY_API_VERSION);
    // sanity/env.ts is the one file allowed to re-export these under new
    // names, so the re-exports themselves have to agree too.
    expect(projectId).toBe(SANITY_PROJECT_ID);
    expect(dataset).toBe(SANITY_DATASET);
    expect(apiVersion).toBe(SANITY_API_VERSION);
  });

  it("the literal project id appears nowhere in the source tree except projectConfig.ts", () => {
    const projectConfigPath = path.join(REPO_ROOT, "sanity", "projectConfig.ts");
    const offenders: string[] = [];
    for (const file of allSourceFiles()) {
      if (file === projectConfigPath) continue;
      const text = readFileSync(file, "utf8");
      if (text.includes(SANITY_PROJECT_ID)) {
        offenders.push(path.relative(REPO_ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});

/** Any import statement (alias or relative) that resolves to sanity/lib/token. */
const TOKEN_IMPORT =
  /from\s+["'][^"']*sanity\/lib\/token["']|require\(\s*["'][^"']*sanity\/lib\/token["']\s*\)/;

describe("the read token never reaches a client component or a public export", () => {
  function importersOfToken(): string[] {
    const importers: string[] = [];
    for (const file of allSourceFiles()) {
      if (file.endsWith(path.join("sanity", "lib", "token.ts"))) continue;
      const text = readFileSync(file, "utf8");
      if (TOKEN_IMPORT.test(text)) {
        importers.push(file);
      }
    }
    return importers;
  }

  it("finds at least the two importers this wave wired up, so the sweep below is exercising something real", () => {
    const importers = importersOfToken().map((f) => path.relative(REPO_ROOT, f));
    expect(importers).toContain(path.join("sanity", "lib", "live.ts"));
    expect(importers).toContain(path.join("app", "api", "draft-mode", "enable", "route.ts"));
  });

  it("no importer of the token lives under components/", () => {
    const offenders = importersOfToken()
      .map((f) => path.relative(REPO_ROOT, f))
      .filter((rel) => rel.startsWith(`components${path.sep}`));
    expect(offenders).toEqual([]);
  });

  it("no importer of the token is an app/**/page.tsx", () => {
    const offenders = importersOfToken()
      .map((f) => path.relative(REPO_ROOT, f))
      .filter((rel) => rel.startsWith(`app${path.sep}`) && rel.endsWith("page.tsx"));
    expect(offenders).toEqual([]);
  });

  it("no importer of the token is marked \"use client\"", () => {
    const offenders: string[] = [];
    for (const file of importersOfToken()) {
      const text = readFileSync(file, "utf8");
      if (/^\s*["']use client["']/m.test(text)) {
        offenders.push(path.relative(REPO_ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("sanity/env.ts, which sanity.config.ts bundles for the browser, never imports the token module", () => {
    // The token itself living in sanity/env.ts would be the leak: that
    // file's own header explains sanity.config.ts imports it and
    // sanity.config.ts ships in the Studio's client JavaScript. A prose
    // mention of the token module's name in a comment is fine and
    // expected (env.ts's header names it deliberately); an actual import
    // statement is not, so this checks for the import, not the name.
    const envSource = readFileSync(path.join(REPO_ROOT, "sanity", "env.ts"), "utf8");
    expect(envSource).not.toMatch(TOKEN_IMPORT);
    expect(envSource).not.toMatch(/process\.env\.SANITY_API_READ_TOKEN/);
  });
});

describe("draft mode enable refuses an unauthorised request", () => {
  const ORIGINAL_TOKEN = process.env.SANITY_API_READ_TOKEN;

  afterEach(() => {
    if (ORIGINAL_TOKEN === undefined) {
      delete process.env.SANITY_API_READ_TOKEN;
    } else {
      process.env.SANITY_API_READ_TOKEN = ORIGINAL_TOKEN;
    }
    vi.resetModules();
  });

  it("401s, and does not throw, when no read token is configured at all", async () => {
    delete process.env.SANITY_API_READ_TOKEN;
    vi.resetModules();
    const { GET } = await import("@/app/api/draft-mode/enable/route");
    const response = await GET(new Request("http://localhost/api/draft-mode/enable"));
    expect(response.status).toBe(401);
  });

  it("401s a request with no preview secret, even with a token configured", async () => {
    // A fake, non secret value is enough here. This path never calls
    // Sanity: `@sanity/preview-url-secret`'s `parsePreviewUrl` rejects a
    // request with no `sanity-preview-secret` query parameter before it
    // builds a query, so this assertion holds with no network access.
    process.env.SANITY_API_READ_TOKEN = "test-token-not-a-real-secret";
    vi.resetModules();
    const { GET } = await import("@/app/api/draft-mode/enable/route");
    const response = await GET(new Request("http://localhost/api/draft-mode/enable"));
    expect(response.status).toBe(401);
  });
});

describe("draft mode disable exists and clears it", () => {
  const draftModeState = vi.hoisted(() => ({ disable: vi.fn() }));

  vi.mock("next/headers", () => ({
    draftMode: async () => draftModeState,
  }));
  vi.mock("next/navigation", () => ({
    redirect: (to: string) => {
      // The real `redirect()` also aborts the handler by throwing; a
      // route that swallowed that would keep running past the redirect,
      // which is its own bug, so the fake reproduces the throw.
      throw new Error(`redirect:${to}`);
    },
  }));

  afterEach(() => {
    draftModeState.disable.mockClear();
  });

  it("calls draftMode().disable() and redirects", async () => {
    const { GET } = await import("@/app/api/draft-mode/disable/route");
    await expect(GET()).rejects.toThrow("redirect:/");
    expect(draftModeState.disable).toHaveBeenCalledTimes(1);
  });
});

describe("the studio route is not under app/[lang]", () => {
  it("is mounted at app/studio, outside the bilingual route tree", () => {
    expect(existsSync(path.join(REPO_ROOT, "app", "studio", "[[...tool]]", "page.tsx"))).toBe(
      true
    );
    expect(existsSync(path.join(REPO_ROOT, "app", "[lang]", "studio"))).toBe(false);
  });

  it("studioBasePath is a bare path with no locale segment", () => {
    expect(studioBasePath).toBe("/studio");
    expect(studioBasePath).not.toMatch(/^\/(en|th)\b/);
  });
});
