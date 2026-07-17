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
function cleanHeadingText(raw: string): string {
  return raw
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/\*\*([^*]*)\*\*/g, "$1") // bold
    .replace(/\*([^*]*)\*/g, "$1") // italic
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .trim();
}

/** Extract h2 headings from raw MDX, with rehype-slug-compatible ids. */
export function extractH2Toc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inCodeFence = false;

  for (const line of source.split(/\r?\n/)) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^##\s+(.+)$/.exec(line);
    if (match?.[1]) {
      const label = cleanHeadingText(match[1]);
      items.push({ id: slugger.slug(label), label });
    }
  }
  return items;
}
