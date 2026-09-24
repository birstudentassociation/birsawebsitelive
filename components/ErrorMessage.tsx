const THAI = /[฀-๿]/;

export type ErrorMessageProps = {
  id?: string;
  children?: string | null;
};

/**
 * Inline validation message. Starts with a visually hidden "Error:" (in the
 * message's own language) so screen reader users hear that the text is an
 * error, not a hint (GOV.UK Error message component). The language is read
 * from the message itself, which keeps this usable from server and client
 * components alike without threading the locale through every form.
 */
export default function ErrorMessage({ id, children }: ErrorMessageProps) {
  if (!children) return null;
  const prefix = THAI.test(children) ? "ข้อผิดพลาด:" : "Error:";

  return (
    <p id={id} className="flex items-start gap-1.5 font-semibold text-error">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth={1.75} />
        <path d="M10 6.5v4.2" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
        <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
      </svg>
      <span>
        <span className="sr-only">{prefix} </span>
        {children}
      </span>
    </p>
  );
}
