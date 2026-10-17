import { useId } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";

const defaultTitle: Record<Locale, string> = {
  en: "Important",
  th: "สำคัญ",
};

export type NotificationBannerProps = {
  /** Header strip text. Defaults to "Important" / "สำคัญ" for the locale. */
  title?: string;
  variant?: "neutral" | "success";
  /** Bold heading at the top of the body. */
  heading?: string;
  locale?: Locale;
  /** Success only: set `role="alert"` so the message is announced when it appears. */
  announce?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Notification banner after the GOV.UK Design System pattern: a border all
 * round and a coloured header strip with white text, over a plain surface
 * body. `neutral` (brand colour) is for the few notices that must not be
 * missed; `success` is for an in-page confirmation. For a "sent" page use
 * Panel instead.
 */
export default function NotificationBanner({
  title,
  variant = "neutral",
  heading,
  locale = "en",
  announce = false,
  className,
  children,
}: NotificationBannerProps) {
  const titleId = useId();
  const success = variant === "success";
  const alert = success && announce;
  return (
    <div
      role={alert ? "alert" : success ? undefined : "region"}
      aria-labelledby={alert || success ? undefined : titleId}
      className={clsx(
        "overflow-hidden border-[5px] bg-surface text-ink",
        success ? "border-success" : "border-brand-strong",
        className
      )}
    >
      <div
        className={clsx(
          "px-4 py-2 sm:px-5",
          success ? "bg-success text-cream" : "bg-brand-strong text-white"
        )}
      >
        <h2 id={titleId} className="text-base font-bold">
          {title ?? defaultTitle[locale]}
        </h2>
      </div>
      <div className="px-4 py-4 leading-relaxed sm:px-5 [&>:last-child]:mb-0">
        {heading ? <p className="mb-2 text-lg leading-snug font-bold">{heading}</p> : null}
        {children}
      </div>
    </div>
  );
}
