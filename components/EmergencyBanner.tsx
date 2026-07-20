export type EmergencyBannerProps = {
  message: string;
  label: string;
};

/**
 * Site-wide emergency notice, shown above everything when emergency mode is
 * switched on via Edge Config (see `lib/emergency.ts`). Uses the error palette
 * so it reads as urgent and is clearly distinct from the beta notice. Not
 * dismissible: every visitor on every page should see it while it is active.
 *
 * Rendered as a labelled region rather than `role="alert"` so screen readers
 * can reach it without it re-announcing on every client navigation.
 */
export default function EmergencyBanner({ message, label }: EmergencyBannerProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className="border-error bg-error-tint text-ink border-b px-4 py-2 text-center text-sm font-semibold"
    >
      {message}
    </div>
  );
}
