export type SkipLinkProps = {
  /** dict.a11y.skip */
  label: string;
};

/** Hidden-until-focused link to `#main`, styled via the `.skip-link` class in globals.css. */
export default function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#main" className="skip-link">
      {label}
    </a>
  );
}
