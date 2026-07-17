/**
 * Server-safe, accessible, scrape-resistant email link. Every character of
 * both the `mailto:` href and the visible text is emitted as an HTML numeric
 * character entity, so the raw HTML never contains a plaintext address or a
 * literal `@` for scrapers to harvest, but browsers parse entities normally,
 * so this renders as an ordinary, fully accessible, copy-pasteable mailto
 * link with no JavaScript required.
 *
 * React escapes `&` in normal children/attributes (which would double-escape
 * our entities), so the anchor is built as a raw HTML string and injected via
 * `dangerouslySetInnerHTML` instead.
 *
 * No default classes are applied: inside `.prose` (MDX) the `.prose a` rules
 * already style the inner `<a>`; elsewhere, pass `className` explicitly.
 */
type EmailProps = { address: string; className?: string; label?: string; subject?: string };

function toEntities(s: string): string {
  return Array.from(s)
    .map((c) => `&#${c.codePointAt(0)};`)
    .join("");
}

export default function Email({ address, className, label, subject }: EmailProps) {
  const mailto = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  const visible = label ?? address;
  const cls = className ? ` class="${className.replace(/"/g, "&quot;")}"` : "";
  const html = `<a href="${toEntities(mailto)}"${cls}>${toEntities(visible)}</a>`;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
