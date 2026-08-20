/**
 * BIRSA Design System: `Email` (REDESIGN-2.0 §4.3, content cluster).
 *
 * An address the reader may want to copy or open. Never write a raw
 * `mailto:` link in prose; an address typed straight into MDX or a page is
 * both unstyled and sits there for every scraper on the internet to harvest.
 * This is the one place BIRSA renders an email address.
 *
 * Server-safe, accessible and scrape-resistant: every character of both the
 * `mailto:` href and the visible text is emitted as an HTML numeric
 * character entity, so the raw HTML response never contains a plaintext
 * address or a literal "@" for a scraper to find, while a browser parses the
 * entities normally and a screen reader announces the address exactly as it
 * would announce a plain one. No JavaScript is involved, so this works with
 * scripting off.
 *
 * React escapes `&` in ordinary children and attributes, which would
 * double-escape the entities above, so the anchor is built as a raw HTML
 * string and injected via `dangerouslySetInnerHTML`. That string is built
 * entirely from character entities of the props this component receives; it
 * never carries caller-supplied markup.
 *
 * Carried over from 1.0's `components/Email.tsx` unchanged in behaviour. No
 * default classes are applied: inside `.prose` (MDX) the `.prose a` rules
 * already style the inner `<a>`; elsewhere, pass `className` explicitly.
 */
export type EmailProps = {
  address: string;
  className?: string;
  /** Visible text. Defaults to the address itself. */
  label?: string;
  /** Pre-fills the mailto `subject` line. */
  subject?: string;
};

function toEntities(value: string): string {
  return Array.from(value)
    .map((character) => `&#${character.codePointAt(0)};`)
    .join("");
}

export default function Email({ address, className, label, subject }: EmailProps) {
  const mailto = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  const visible = label ?? address;
  const classAttribute = className ? ` class="${className.replace(/"/g, "&quot;")}"` : "";
  const html = `<a href="${toEntities(mailto)}"${classAttribute}>${toEntities(visible)}</a>`;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
