import clsx from "clsx";
import type { Locale } from "@/lib/i18n";

const hiddenLabel: Record<Locale, string> = {
  en: "Warning",
  th: "คำเตือน",
};

export type WarningTextProps = {
  title?: string;
  locale?: Locale;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Warning text after the GOV.UK Design System pattern: a bold "!" disc and
 * bold text, with a visually-hidden "Warning" prefix so screen readers hear
 * the meaning the icon carries. A `title` becomes the bold line and the
 * children follow at normal weight; without one the children are bold.
 */
export default function WarningText({
  title,
  locale = "en",
  className,
  children,
}: WarningTextProps) {
  const label = <span className="sr-only">{hiddenLabel[locale]}: </span>;
  return (
    <div className={clsx("warning-text relative py-1 pl-12 text-ink", className)}>
      <span
        aria-hidden="true"
        className="absolute top-0.5 left-0 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-ink font-sans text-[1.75rem] leading-none font-bold text-cream"
      >
        !
      </span>
      {title ? (
        <>
          <p className="mb-1 leading-snug font-bold">
            {label}
            {title}
          </p>
          {children ? <div className="leading-relaxed">{children}</div> : null}
        </>
      ) : (
        <div className="leading-snug font-bold">
          {label}
          {children}
        </div>
      )}
    </div>
  );
}
