import Link from "next/link";
import ExternalLink from "@/components/ExternalLink";
import { localeHref, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    defaultTitle: "Registration form",
    fallback: "If the form doesn't load,",
    openLink: "open it in a new tab",
    newTab: "opens in a new tab",
    dataNotice: "This is a Google Form, not a BIRSA form. What you type goes straight to Google and to whoever set the form up, not to this site.",
    dataNoticeLink: "Read more in the privacy notice",
  },
  th: {
    defaultTitle: "แบบฟอร์มลงทะเบียน",
    fallback: "หากแบบฟอร์มไม่แสดง",
    openLink: "เปิดในแท็บใหม่",
    newTab: "เปิดในแท็บใหม่",
    dataNotice: "แบบฟอร์มนี้เป็น Google Form มิใช่แบบฟอร์มของ BIRSA ข้อมูลที่ท่านกรอกจะถูกส่งตรงไปยัง Google และผู้จัดทำแบบฟอร์ม โดยไม่ผ่านเว็บไซต์นี้",
    dataNoticeLink: "อ่านรายละเอียดในประกาศความเป็นส่วนตัว",
  },
} as const;

export type GoogleFormProps = {
  /** The form's `.../viewform` URL. `embedded=true` is appended automatically. */
  src: string;
  /** Accessible name for the iframe. Every embed needs a descriptive title (WCAG 4.1.2). */
  title?: string;
  /**
   * Embed height in pixels. Google Forms don't auto-resize, so size it to the
   * form. Accepts a string because `next-mdx-remote` only forwards string-valued
   * MDX attributes (`height="1300"`), not expressions (`height={1300}`).
   */
  height?: number | string;
  /** Injected by the MDX renderer so the fallback copy matches the page language. */
  locale?: Locale;
};

/**
 * Embeds a Google Form in an accessible, responsive frame with a visible
 * "open in a new tab" fallback for when the iframe is blocked or scripting is
 * off. Loading the embed requires `frame-src https://docs.google.com` in the
 * site CSP (see `middleware.ts`). The frame is lazy-loaded so it never blocks
 * first paint of the article.
 */
export default function GoogleForm({ src, title, height = 1100, locale = "en" }: GoogleFormProps) {
  const t = copy[locale];
  const label = title ?? t.defaultTitle;
  const numericHeight = typeof height === "string" ? Number.parseInt(height, 10) : height;
  const frameHeight = Number.isFinite(numericHeight) ? numericHeight : 1100;
  const embedSrc = /[?&]embedded=true\b/.test(src)
    ? src
    : `${src}${src.includes("?") ? "&" : "?"}embedded=true`;

  return (
    <div className="my-6">
      <p className="text-muted mb-3 text-sm">
        {t.dataNotice}{" "}
        <Link href={localeHref(locale, "/privacy")} className="text-brand-deep font-semibold">
          {t.dataNoticeLink}
        </Link>
        .
      </p>
      <div className="border-line bg-sunken overflow-hidden rounded-lg border">
        <iframe
          src={embedSrc}
          title={label}
          loading="lazy"
          className="block w-full"
          style={{ height: frameHeight, border: 0 }}
        >
          {label}
        </iframe>
      </div>
      <p className="text-muted mt-3 text-sm">
        {t.fallback}{" "}
        <ExternalLink href={src} newTabLabel={t.newTab} className="text-brand-deep font-semibold">
          {t.openLink}
        </ExternalLink>
        .
      </p>
    </div>
  );
}
