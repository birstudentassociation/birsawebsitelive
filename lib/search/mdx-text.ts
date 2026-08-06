/**
 * Turn raw MDX bodies into plain text for indexing.
 *
 * The content loader hands back unrendered MDX, so indexing it directly would
 * fill the index with component names, import statements and markdown
 * punctuation. Readers never type `<Notice variant="warning">`, so none of it
 * should be searchable; the words inside those components very much should.
 */

/** Extract the prose from an MDX body, dropping syntax and component markup. */
export function mdxToText(source: string): string {
  return (
    source
      // Fenced code blocks: identifiers and syntax, not prose.
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`\n]*`/g, " ")
      // ESM at the top of a file.
      .replace(/^\s*import[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, " ")
      .replace(/^\s*export\s+(const|default|function)[\s\S]*?$/gm, " ")
      // JSX/MDX expression braces, e.g. {locale === "th" ? ... : ...}.
      .replace(/\{[^{}]*\}/g, " ")
      // Component tags. Attribute *values* are dropped with the tag: they are
      // props like `variant="warning"`, not something a reader searches for.
      .replace(/<\/?[A-Za-z][^>]*>/g, " ")
      // Images: keep the alt text, drop the path.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, " $1 ")
      // Links: keep the label, drop the href.
      .replace(/\[([^\]]+)\]\([^)]*\)/g, " $1 ")
      // Markdown emphasis, headings, list bullets, table pipes, quotes.
      .replace(/^\s{0,3}#{1,6}\s+/gm, " ")
      .replace(/^\s{0,3}>\s?/gm, " ")
      .replace(/^\s{0,3}[-*+]\s+/gm, " ")
      .replace(/^\s{0,3}\d+\.\s+/gm, " ")
      .replace(/^\s*\|[-:\s|]+\|\s*$/gm, " ")
      .replace(/[|*_~]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Collect the headings of an MDX body. Headings are the author's own summary
 * of what a long page covers, so they are indexed at a higher weight than the
 * prose beneath them.
 */
export function mdxHeadings(source: string): string[] {
  const headings: string[] = [];
  const pattern = /^\s{0,3}#{1,6}\s+(.+)$/gm;
  let match = pattern.exec(source);
  while (match !== null) {
    const text = match[1];
    if (text) headings.push(mdxToText(text));
    match = pattern.exec(source);
  }
  return headings.filter(Boolean);
}
