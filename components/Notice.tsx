import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import InsetText from "@/components/InsetText";
import NotificationBanner from "@/components/NotificationBanner";
import Tag from "@/components/Tag";

type Variant = "info" | "important" | "success" | "error" | "placeholder";

const placeholderTag: Record<Locale, string> = {
  en: "Example content",
  th: "ตัวอย่างเนื้อหา",
};

/** A `title` up to this length becomes the banner's header strip; longer ones become its heading. */
const MAX_STRIP_TITLE = 30;

export type NoticeProps = {
  variant?: Variant;
  title?: string;
  /** Used for the default banner title and the placeholder tag. Defaults to English. */
  locale?: Locale;
  className?: string;
  children: React.ReactNode;
};

/**
 * Message block built on the GOV.UK-style components, with no tinted fill or
 * coloured side lip.
 *
 * - `info` (default) is inset text: grey left border, no icon. A `title` is a bold first line.
 * - `important` is a neutral notification banner for the few notices that must not be missed.
 *   A short `title` (30 characters or fewer) is the header strip text; a longer one is the bold
 *   heading under a default "Important" strip.
 * - `success` is a success notification banner. A short `title` is the strip text, a longer one
 *   is the heading under the default strip.
 * - `error` is a red-bordered block with a bold heading, after the GOV.UK error summary.
 * - `placeholder` is an amber "Example content" tag followed by inset text.
 *
 * Warnings use WarningText.
 */
export default function Notice({
  variant = "info",
  title,
  locale = "en",
  className,
  children,
}: NoticeProps) {
  switch (variant) {
    case "important":
    case "success": {
      const short = title !== undefined && title.length <= MAX_STRIP_TITLE;
      return (
        <NotificationBanner
          variant={variant === "success" ? "success" : "neutral"}
          title={short ? title : variant === "success" ? successTitle[locale] : undefined}
          heading={short ? undefined : title}
          locale={locale}
          className={className}
        >
          {children}
        </NotificationBanner>
      );
    }
    case "error":
      return (
        <div className={clsx("border-4 border-error bg-surface p-4 text-ink", className)}>
          {title ? <p className="mb-2 text-base font-bold">{title}</p> : null}
          <div className="leading-relaxed [&>:last-child]:mb-0">{children}</div>
        </div>
      );
    case "placeholder":
      return (
        <div className={className}>
          <p className="mb-2">
            <Tag variant="amber">{placeholderTag[locale]}</Tag>
          </p>
          <InsetText>
            {title ? <p className="mb-1 font-bold">{title}</p> : null}
            {children}
          </InsetText>
        </div>
      );
    case "info":
    default:
      return (
        <InsetText className={className}>
          {title ? <p className="mb-1 font-bold">{title}</p> : null}
          {children}
        </InsetText>
      );
  }
}

const successTitle: Record<Locale, string> = {
  en: "Success",
  th: "สำเร็จ",
};
