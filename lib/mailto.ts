/**
 * A `mailto:` link with a subject and a message body. Each part is
 * percent-encoded, so a line break travels as `%0A` and a Thai character as its
 * UTF-8 bytes, which mail apps decode back to the text that went in.
 *
 * Not `components/Email`, which writes every character of the address as an
 * HTML entity to keep scrapers out. That would multiply a long encoded body
 * several times over, and the address here is already public.
 */
export function mailtoHref(address: string, subject: string, body: string): string {
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Some mail apps cut a `mailto:` link well short of what browsers allow
 * (Outlook on Windows near 2,000 characters), and a Thai body percent-encodes
 * to nine characters per letter. Past this length the link carries
 * `fallbackBody` instead, a short note asking the reader to paste the text
 * the page shows them, so no app opens a message cut off mid-sentence.
 */
export const MAILTO_MAX_LENGTH = 2000;

export function mailtoHrefWithFallback(
  address: string,
  subject: string,
  body: string,
  fallbackBody: string
): string {
  const full = mailtoHref(address, subject, body);
  return full.length <= MAILTO_MAX_LENGTH ? full : mailtoHref(address, subject, fallbackBody);
}
