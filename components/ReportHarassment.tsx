/**
 * The harassment and bullying reporting callout: the message, the two
 * official channels (`content/reporting.ts`), and the 48-hour assurance.
 *
 * Server component with no props but the locale, so it can be dropped into
 * MDX as `<ReportHarassment />` (see `lib/mdx.tsx`) and into ordinary pages
 * alike, and so the numbers only ever have to change in one place.
 *
 * Renders its own `<h2>`: place it under page-level content, never inside a
 * section that would break the heading order. Colour is never the only
 * signal, the heading text carries the message on its own (WCAG 1.4.1).
 * The heading id is fixed, so render it at most once per page.
 *
 * Inside `.prose` (MDX) the layout utilities here win over the `.prose`
 * descendant rules because Tailwind's `utilities` layer is ordered after the
 * `components` layer that `.prose` lives in (see `app/globals.css`).
 */
import clsx from "clsx";
import Email from "@/components/Email";
import { reportingChannels, reportingCopy } from "@/content/reporting";
import type { Locale } from "@/lib/i18n";

export type ReportHarassmentProps = {
  locale?: Locale;
  /** Render the heading as `<h3>` when the callout sits under an `<h2>`. */
  headingLevel?: "h2" | "h3";
  className?: string;
};

export default function ReportHarassment({
  locale = "en",
  headingLevel = "h2",
  className,
}: ReportHarassmentProps) {
  const Heading = headingLevel;

  return (
    <section
      aria-labelledby="report-harassment"
      className={clsx("rounded-md border-l-4 border-error bg-error-tint p-5 text-ink", className)}
    >
      <Heading
        id="report-harassment"
        className="m-0 border-b-0 pb-0 text-xl font-bold text-brand-deep"
      >
        {reportingCopy.heading[locale]}
      </Heading>

      <p className="mt-3 mb-0 text-sm leading-relaxed">{reportingCopy.intro[locale]}</p>

      <ul className="mt-5 mb-0 grid list-none gap-5 p-0 sm:grid-cols-2">
        {reportingChannels.map((channel) => (
          <li key={channel.id} className="m-0 p-0">
            <p className="m-0 text-sm font-semibold">{channel.organisation[locale]}</p>
            <p className="m-0 text-sm text-muted">{channel.person[locale]}</p>
            <p className="mt-2 mb-0 text-sm">
              {reportingCopy.callLabel[locale]}{" "}
              <a href={channel.phoneHref} className="font-semibold">
                {channel.phone}
              </a>
              {channel.extension
                ? ` ${reportingCopy.extensionLabel[locale]} ${channel.extension}`
                : null}
            </p>
            <p className="mt-1 mb-0 text-sm break-words">
              {reportingCopy.emailLabel[locale]}{" "}
              <Email address={channel.email} className="font-semibold" />
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-5 mb-0 text-sm font-semibold">{reportingCopy.assurance[locale]}</p>
    </section>
  );
}
