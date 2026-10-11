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
