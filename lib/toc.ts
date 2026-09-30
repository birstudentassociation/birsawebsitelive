/**
 * Table-of-contents extraction for MDX sources.
 *
 * Pulls `##` (h2) headings from the raw MDX string and generates the same
 * ids rehype-slug will produce at render time; both use github-slugger,
 * so anchor links always match the rendered heading ids (including Thai
 * headings, whose characters github-slugger preserves).
 */
import GithubSlugger from "github-slugger";

export type TocItem = { id: string; label: string };

/** Strip inline markdown that shouldn't appear in a TOC label. */
export function cleanHeadingText(raw: string): string {
  return raw
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/\*\*([^*]*)\*\*/g, "$1") // bold
    .replace(/\*([^*]*)\*/g, "$1") // italic
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .trim();
}

/** Number of h2 headings above which a page's TOC also lists its h3 headings. */
export const H3_TOC_THRESHOLD = 6;

/**
 * Every heading in an MDX source (h1 to h6) with its rehype-slug-compatible
 * id. All levels go through one slugger, as rehype-slug does, so duplicate
 * headings get the same `-1` suffixes here as in the rendered page.
 */
export function extractHeadings(source: string): (TocItem & { level: number })[] {
  const slugger = new GithubSlugger();
  const items: (TocItem & { level: number })[] = [];
  let inCodeFence = false;

  for (const line of source.split(/\r?\n/)) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{1,6})\s+(.+)$/.exec(line);
    if (match?.[1] && match[2]) {
      const label = cleanHeadingText(match[2]);
      items.push({ id: slugger.slug(label), label, level: match[1].length });
    }
  }
  return items;
}

/** Extract h2 headings from raw MDX, with rehype-slug-compatible ids. */
export function extractH2Toc(source: string): TocItem[] {
  return extractHeadings(source)
    .filter((h) => h.level === 2)
    .map(({ id, label }) => ({ id, label }));
}

export type TocEntry = TocItem & { level: 2 | 3 };

/**
 * Table of contents for a page: h2 headings, plus h3 headings nested under
 * them when the page has more than `H3_TOC_THRESHOLD` h2 headings (long pages
 * are easier to scan with the second level).
 */
export function extractToc(source: string): TocEntry[] {
  const headings = extractHeadings(source).filter((h) => h.level === 2 || h.level === 3);
  const h2Count = headings.filter((h) => h.level === 2).length;
  const withH3 = h2Count > H3_TOC_THRESHOLD;
  return headings
    .filter((h) => h.level === 2 || withH3)
    .map(({ id, label, level }) => ({ id, label, level: level as 2 | 3 }));
}

export type H2Section = TocItem & { body: string };

/**
 * Split an MDX source at its h2 headings. Each section carries the heading's
 * rehype-slug id and the raw text beneath it (h3 sections included) up to the
 * next h2. Text before the first h2 is not a section.
 */
export function extractH2Sections(source: string): H2Section[] {
  const slugger = new GithubSlugger();
  const sections: { id: string; label: string; lines: string[] }[] = [];
  let inCodeFence = false;

  for (const line of source.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
    } else if (!inCodeFence) {
      const match = /^(#{1,6})\s+(.+)$/.exec(line);
      if (match?.[1] && match[2]) {
        const label = cleanHeadingText(match[2]);
        const id = slugger.slug(label);
        if (match[1].length === 2) {
          sections.push({ id, label, lines: [] });
          continue;
        }
      }
    }
    sections[sections.length - 1]?.lines.push(line);
  }
  return sections.map(({ id, label, lines }) => ({ id, label, body: lines.join("\n") }));
}
