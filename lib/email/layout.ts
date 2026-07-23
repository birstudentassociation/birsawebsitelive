/**
 * Email-safe HTML building blocks for BIRSA's bilingual (Thai + English)
 * transactional emails. Email clients strip `<style>` blocks and ignore CSS
 * variables, so every rule here is emitted as an inline `style="..."`
 * attribute with literal hex colors, using a table-based layout with no
 * external images, fonts, or CSS. Pure string templating, no dependencies.
 *
 * Brand palette ("BIR cream editorial"):
 * - red (brand):    #d81f26   header band, primary accents
 * - red (hover):    #b3161c
 * - page bg:        #f3ead9   sunken cream around the card
 * - card surface:   #fffdf8
 * - hairline:       #e6dccb
 * - ink (body):     #211c19
 * - muted:          #5b524a
 * - success:        #2f6b3d / tint #e8f1e8
 * - warning:        #8a5a00 / tint #fbf0d9
 * - forest (info):  #2f5e4e / tint #e7efe9
 */

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI','Sarabun','Noto Sans Thai',Tahoma,Arial,sans-serif";

/**
 * Escapes `& < > " '` so dynamic values (names, references, user-submitted
 * text) can never break out of HTML markup or attributes. Every interpolated
 * dynamic value in the templates MUST pass through this first.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes free-text (e.g. a contact-form message) and converts newlines to
 * `<br>` AFTER escaping, so line breaks survive without opening any HTML
 * injection risk.
 */
export function escapeHtmlMultiline(s: string): string {
  return escapeHtml(s).replace(/\r\n|\r|\n/g, "<br>");
}

export type Tone = "success" | "warning" | "info" | "neutral";

const TONE_COLORS: Record<Tone, { fg: string; bg: string }> = {
  success: { fg: "#2f6b3d", bg: "#e8f1e8" },
  warning: { fg: "#8a5a00", bg: "#fbf0d9" },
  info: { fg: "#2f5e4e", bg: "#e7efe9" },
  neutral: { fg: "#5b524a", bg: "#f3ead9" },
};

/** A section heading inside the card body. */
export function heading(text: string): string {
  return `<h1 style="margin:0 0 12px;padding:0;font-family:${FONT_STACK};font-size:20px;line-height:1.4;font-weight:700;color:#211c19;">${text}</h1>`;
}

/** A body paragraph, dark ink text on the cream card. */
export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;padding:0;font-family:${FONT_STACK};font-size:15px;line-height:1.6;color:#211c19;">${html}</p>`;
}

/** A small, muted paragraph (captions, footnotes). */
export function mutedParagraph(html: string): string {
  return `<p style="margin:0 0 16px;padding:0;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:#5b524a;">${html}</p>`;
}

/** A rounded, colored status pill (e.g. "Approved" / "Overdue"). */
export function badge(text: string, tone: Tone = "neutral"): string {
  const { fg, bg } = TONE_COLORS[tone];
  return `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${bg};color:${fg};font-family:${FONT_STACK};font-size:13px;font-weight:600;line-height:1.4;">${text}</span>`;
}

/** A label -> value row used by {@link infoTable}. */
export type InfoRow = { label: string; value: string };

/**
 * A two-column label/value table (Reference, Item, Dates, ...), rendered on
 * a hairline-bordered card with a cream tint, in the given rows' order.
 */
export function infoTable(rows: InfoRow[]): string {
  const body = rows
    .map(
      (row, i) => `<tr>
        <td style="padding:10px 14px;border-top:${i === 0 ? "none" : "1px solid #e6dccb"};font-family:${FONT_STACK};font-size:13px;font-weight:600;color:#5b524a;white-space:nowrap;vertical-align:top;width:120px;">${row.label}</td>
        <td style="padding:10px 14px;border-top:${i === 0 ? "none" : "1px solid #e6dccb"};font-family:${FONT_STACK};font-size:14px;color:#211c19;vertical-align:top;">${row.value}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;border:1px solid #e6dccb;border-radius:8px;background:#f3ead9;border-collapse:separate;">
    <tbody>${body}</tbody>
  </table>`;
}

/** An optional call-to-action button, filled with brand red. Only render when a URL is actually relevant. */
export function button(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
    <tbody>
      <tr>
        <td style="border-radius:8px;background:#d81f26;">
          <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:${FONT_STACK};font-size:15px;font-weight:700;color:#fffdf8;text-decoration:none;border-radius:8px;">${text}</a>
        </td>
      </tr>
    </tbody>
  </table>`;
}

/** A Thai block, a thin hairline divider, then an English block. */
export function bilingualBlock(input: { th: string; en: string }): string {
  return `${input.th}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 16px;">
    <tbody><tr><td style="border-top:1px solid #e6dccb;font-size:0;line-height:0;">&nbsp;</td></tr></tbody>
  </table>
  ${input.en}`;
}

/**
 * Wraps `bodyHtml` in the full email shell: outer full-width table on the
 * sunken cream page background, a centered 600px card with a red BIRSA
 * header band, and the bilingual "do not reply" footer. Include
 * `previewText` to control the hidden inbox-preview snippet most clients
 * show next to the subject line.
 */
export function renderLayout(input: { previewText?: string; bodyHtml: string }): string {
  const preview = input.previewText
    ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(input.previewText)}</div>`
    : "";

  return `<!doctype html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>BIRSA</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3ead9;">
    ${preview}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3ead9;">
      <tbody>
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#fffdf8;border:1px solid #e6dccb;border-radius:12px;overflow:hidden;">
              <tbody>
                <tr>
                  <td style="background-color:#d81f26;padding:24px 28px;">
                    <div style="font-family:${FONT_STACK};font-size:22px;font-weight:800;letter-spacing:0.5px;color:#fffdf8;">BIRSA</div>
                    <div style="font-family:${FONT_STACK};font-size:12px;color:#fbeceb;margin-top:2px;">BIR Student Association &middot; Thammasat University</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    ${input.bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 28px;border-top:1px solid #e6dccb;">
                    <p style="margin:0 0 4px;padding:0;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:#5b524a;">อีเมลนี้ส่งโดยอัตโนมัติจากระบบของสโมสรนักศึกษา BIR (BIRSA) กรุณาอย่าตอบกลับอีเมลนี้</p>
                    <p style="margin:0 0 4px;padding:0;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:#5b524a;">This is an automated message from the BIR Student Association (BIRSA). Do not reply.</p>
                    <p style="margin:0;padding:0;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:#5b524a;">BIRSA &middot; Faculty of Political Science, Thammasat University (Tha Prachan) &middot; bir@tu.ac.th &middot; birstudentassociation@gmail.com</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
}
