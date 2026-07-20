import Link from "next/link";

export type EmergencyBannerProps = {
  href: string;
  message: string;
  cta: string;
};

/**
 * Site-wide emergency notice, shown above everything when emergency mode is
 * switched on via Edge Config (see `lib/emergency.ts`). Uses the error palette
 * so it reads as urgent and is clearly distinct from the rest of the chrome.
 * Not dismissible: every visitor on every page should see it while it is
 * active.
 *
 * The whole banner is a single link to `/emergency` for more detail. Its
 * accessible name is the visible text (message + cta), so no `aria-label`
 * is needed.
 */
export default function EmergencyBanner({ href, message, cta }: EmergencyBannerProps) {
  return (
    <Link
      href={href}
      className="border-error bg-error-tint text-ink hover:bg-error/10 block border-b px-4 py-2 text-center text-sm font-semibold"
    >
      <span>{message}</span> <span className="underline">{cta}</span>
    </Link>
  );
}
