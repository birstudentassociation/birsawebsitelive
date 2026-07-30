import Notice from "@/components/Notice";
import Button from "@/components/Button";

export type ResultPanelProps = {
  variant: "info" | "warning" | "error";
  title: string;
  body: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  retryHref?: string;
  retryLabel?: string;
};

/**
 * Shared terminal-state panel for a form journey's non-success outcomes
 * (rate-limited, not configured, blocklisted, and so on). A plain
 * server-rendered link/button, not client state, so it works with or
 * without JavaScript: "retry" re-visits the same step (the draft cookie
 * still holds the reader's answers), "action" leaves the journey entirely
 * (e.g. back to the catalogue, or to the contact page).
 */
export default function ResultPanel({
  variant,
  title,
  body,
  actionHref,
  actionLabel,
  retryHref,
  retryLabel,
}: ResultPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <Notice variant={variant} title={title}>
        {body}
      </Notice>
      <div className="flex gap-3">
        {retryHref ? (
          <Button href={retryHref} variant={actionHref ? "secondary" : "primary"}>
            {retryLabel}
          </Button>
        ) : null}
        {actionHref ? <Button href={actionHref}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}
