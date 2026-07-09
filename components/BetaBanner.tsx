export type BetaBannerProps = {
  message: string;
};

/**
 * Persistent site-wide notice that the site is in beta. Not dismissible:
 * every visitor on every page should see it, on every visit.
 */
export default function BetaBanner({ message }: BetaBannerProps) {
  return (
    <div className="border-warning bg-warning-tint text-ink border-b px-4 py-2 text-center text-sm font-medium">
      {message}
    </div>
  );
}
