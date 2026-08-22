/**
 * Link integrity (REDESIGN-2.0 §3.6, §10).
 *
 * Two different failure modes, checked two different ways:
 *
 *   INTERNAL links resolve against the site's own content, so checking one
 *   is a lookup: does the target document exist, and is it published. No
 *   network call is ever involved, which is why this half of the file takes
 *   a plain resolver function rather than `fetch`.
 *
 *   EXTERNAL links resolve against someone else's server, so checking one
 *   is a real HTTP request. §3.6's whole argument is that this is the check
 *   that matters most: a link BIRSA does not control can die, or worse,
 *   start redirecting to a page whose content changed, and nothing in this
 *   codebase would notice unless something asks.
 *
 * NEITHER HALF MAKES A REAL NETWORK CALL ITSELF. The wave brief is explicit
 * that tests must not touch the network, so both `checkInternalLinks` and
 * `checkExternalLink` take their means of resolution as a parameter
 * (`resolve`, `fetchImpl`) rather than importing `fetch` or a Sanity client
 * directly. Production code (the cron, eventually a Studio custom
 * validation) supplies the real thing; tests supply a fake. This is the
 * same shape `lib/email/*` already uses to keep Resend out of the test
 * suite, applied to link checking.
 */
import type { Locale } from "@/lib/i18n";
import type { ExternalLinkRegisterEntry } from "@/lib/cms/externalLinkRegister";

// ---------------------------------------------------------------------------
// Internal links
// ---------------------------------------------------------------------------

export type LinkResolution = {
  exists: boolean;
  /** Meaningless when `exists` is false. A document that exists but is not
   * published (draft, or archived) is still a broken link for a reader. */
  published: boolean;
};

export type LinkResolver = (path: string) => LinkResolution | Promise<LinkResolution>;

export type InternalLinkCheck = {
  /** Where the link appears, e.g. `"news/orientation.body.links[0]"`. Never
   * the link's surrounding text. */
  sourcePath: string;
  /** The internal path the link points at, e.g. `"/en/services/lost-and-found"`. */
  href: string;
};

export type InternalLinkFinding = {
  sourcePath: string;
  href: string;
  reason: "missing" | "unpublished";
  message: Record<Locale, string>;
};

export async function checkInternalLinks(
  links: InternalLinkCheck[],
  resolve: LinkResolver
): Promise<InternalLinkFinding[]> {
  const findings: InternalLinkFinding[] = [];

  for (const link of links) {
    const resolution = await resolve(link.href);

    if (!resolution.exists) {
      findings.push({
        sourcePath: link.sourcePath,
        href: link.href,
        reason: "missing",
        message: {
          en: `"${link.sourcePath}" links to "${link.href}", which does not exist. Fix the link or remove it.`,
          th: `ฟิลด์ "${link.sourcePath}" ลิงก์ไปยัง "${link.href}" ซึ่งไม่มีอยู่จริง โปรดแก้ไขหรือลบลิงก์นี้`,
        },
      });
      continue;
    }

    if (!resolution.published) {
      findings.push({
        sourcePath: link.sourcePath,
        href: link.href,
        reason: "unpublished",
        message: {
          en: `"${link.sourcePath}" links to "${link.href}", which exists but is not published. A reader would see a 404.`,
          th: `ฟิลด์ "${link.sourcePath}" ลิงก์ไปยัง "${link.href}" ซึ่งมีอยู่แต่ยังไม่เผยแพร่ ผู้อ่านจะเห็นหน้า 404`,
        },
      });
    }
  }

  return findings;
}

export function blocksPublication(findings: InternalLinkFinding[]): boolean {
  return findings.length > 0;
}

// ---------------------------------------------------------------------------
// External links
// ---------------------------------------------------------------------------

/**
 * The slice of the `fetch` contract this file actually needs, so a test's
 * fake does not have to implement the whole Fetch API. `redirect: "manual"`
 * is the one non-obvious part: without it, `fetch` follows the redirect
 * itself and this code never sees the 3xx, which is exactly the signal
 * §3.6 wants surfaced ("a redirect is a signal, not just a pass").
 */
export type FetchLike = (
  url: string,
  init: { method: "HEAD"; redirect: "manual" }
) => Promise<{ status: number; headers: { get(name: string): string | null } }>;

export type ExternalLinkOutcome =
  | { kind: "ok"; httpStatus: number }
  | { kind: "redirect"; httpStatus: number; location: string | null }
  | { kind: "dead"; httpStatus: number }
  | { kind: "error"; error: string };

/**
 * Resolve one URL. Never throws: a network failure becomes an `"error"`
 * outcome, exactly the same "degrade rather than throw" house rule the
 * crons already follow (`app/api/cron/daily/route.ts`), applied to a single
 * link instead of a whole job.
 */
export async function checkExternalLink(
  url: string,
  fetchImpl: FetchLike
): Promise<ExternalLinkOutcome> {
  try {
    const response = await fetchImpl(url, { method: "HEAD", redirect: "manual" });

    if (response.status >= 300 && response.status < 400) {
      return { kind: "redirect", httpStatus: response.status, location: response.headers.get("location") };
    }
    if (response.status >= 200 && response.status < 300) {
      return { kind: "ok", httpStatus: response.status };
    }
    return { kind: "dead", httpStatus: response.status };
  } catch (err) {
    return { kind: "error", error: err instanceof Error ? err.message : "unknown error" };
  }
}

export type ExternalLinkFinding = {
  entryId: string;
  outcome: Exclude<ExternalLinkOutcome, { kind: "ok" }>;
  message: Record<Locale, string>;
};

/**
 * Check a whole register and return only the entries worth raising: dead,
 * redirecting, or errored. An `"ok"` entry produces nothing, because a cron
 * whose output includes every healthy link is a cron whose output nobody
 * reads (`docs/BUILD-BRIEF-2.0.md` §2, and the same "who reads this" test
 * this wave's report applies to the integrity cron as a whole).
 */
export async function checkExternalLinkRegister(
  entries: ExternalLinkRegisterEntry[],
  fetchImpl: FetchLike
): Promise<ExternalLinkFinding[]> {
  const findings: ExternalLinkFinding[] = [];

  for (const entry of entries) {
    const outcome = await checkExternalLink(entry.url, fetchImpl);
    if (outcome.kind === "ok") continue;

    findings.push({
      entryId: entry.id,
      outcome,
      message: messageFor(entry, outcome),
    });
  }

  return findings;
}

function messageFor(
  entry: ExternalLinkRegisterEntry,
  outcome: Exclude<ExternalLinkOutcome, { kind: "ok" }>
): Record<Locale, string> {
  switch (outcome.kind) {
    case "redirect":
      return {
        en: `"${entry.label.en}" now redirects (HTTP ${outcome.httpStatus}). The destination may have changed; check whether the linked content still matches what BIRSA says about it.`,
        th: `ลิงก์ "${entry.label.th}" มีการเปลี่ยนเส้นทาง (HTTP ${outcome.httpStatus}) ปลายทางอาจเปลี่ยนไป โปรดตรวจสอบว่าเนื้อหายังตรงกับที่ BIRSA ระบุไว้หรือไม่`,
      };
    case "dead":
      return {
        en: `"${entry.label.en}" is no longer reachable (HTTP ${outcome.httpStatus}). Find a replacement link or remove the reference.`,
        th: `ลิงก์ "${entry.label.th}" ไม่สามารถเข้าถึงได้แล้ว (HTTP ${outcome.httpStatus}) โปรดหาลิงก์ใหม่หรือลบการอ้างอิงนี้`,
      };
    case "error":
      return {
        en: `"${entry.label.en}" could not be checked (${outcome.error}). This may be temporary; it will be checked again tomorrow.`,
        th: `ไม่สามารถตรวจสอบลิงก์ "${entry.label.th}" ได้ (${outcome.error}) อาจเป็นปัญหาชั่วคราว ระบบจะตรวจสอบอีกครั้งในวันถัดไป`,
      };
  }
}
