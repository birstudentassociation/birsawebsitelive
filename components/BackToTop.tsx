export type BackToTopProps = {
  /** dict.actions.backToTop */
  label: string;
  className?: string;
};

/** Simple anchor to #main, styled as a ghost button. */
export default function BackToTop({ label, className }: BackToTopProps) {
  return (
    <a
      href="#main"
      className={`focus-halo text-ink hover:bg-sunken inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${className ?? ""}`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
        <path
          d="M10 15V5M5 9.5 10 5l5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </a>
  );
}
