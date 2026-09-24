import clsx from "clsx";

type Variant = "info" | "success" | "warning" | "error" | "placeholder";

const styles: Record<Variant, { border: string; bg: string; text: string }> = {
  info: { border: "border-info", bg: "bg-info-tint", text: "text-ink" },
  success: { border: "border-success", bg: "bg-success-tint", text: "text-ink" },
  warning: { border: "border-warning", bg: "bg-warning-tint", text: "text-ink" },
  error: { border: "border-error", bg: "bg-error-tint", text: "text-ink" },
  placeholder: { border: "border-warning", bg: "bg-warning-tint", text: "text-ink" },
};

function NoticeIcon({ variant }: { variant: Variant }) {
  const common = {
    "aria-hidden": "true" as const,
    className: "h-5 w-5 shrink-0",
    viewBox: "0 0 20 20",
  };

  switch (variant) {
    case "success":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M4 10.5 8 14l8-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "warning":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M10 2 1 17h18L10 2Z" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M10 8v4" strokeLinecap="round" />
          <circle cx="10" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "error":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6.5v4.2" strokeLinecap="round" />
          <circle cx="10" cy="13.6" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "placeholder":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
          <path
            d="m13.5 2.5 4 4L6 18H2v-4L13.5 2.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "info":
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="10" cy="10" r="8" />
          <path d="M10 9v5" strokeLinecap="round" />
          <circle cx="10" cy="6.4" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export type NoticeProps = {
  variant?: Variant;
  title?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Callout box. Each variant stands in for one GOV.UK component, and should
 * only be used for that component's job:
 *
 * - `info`: Inset text. Sets a short aside apart from the text around it
 *   (a tip, a quotation, contact details). Use sparingly; people skip it,
 *   so never put something everyone must read here.
 * - `warning`: Warning text. A consequence of doing, or not doing,
 *   something (a deadline, a penalty, a rule that disqualifies you).
 * - `error`: a problem the reader must act on that is not a form error.
 *   Form errors use ErrorSummary and ErrorMessage, never this.
 * - `success`: the outcome of something the reader just did, at the top of
 *   the page that follows (GOV.UK success Notification banner). One per page.
 * - `placeholder`: BIRSA's own. Marks example content awaiting real details.
 *
 * Messages that are not about the current page (site-wide news, service
 * problems) belong in the announcement or emergency banner, not here.
 * Never the sole way meaning is conveyed: icon, colour and text always
 * travel together.
 */
export default function Notice({ variant = "info", title, className, children }: NoticeProps) {
  const style = styles[variant];
  return (
    <div
      className={clsx(
        "flex gap-3 rounded-md border-l-4 p-4",
        style.border,
        style.bg,
        style.text,
        className
      )}
    >
      <NoticeIcon variant={variant} />
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        {title ? <p className="mb-1 font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
