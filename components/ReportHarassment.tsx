/**
 * The harassment and bullying reporting block: a plain heading, one sentence,
 * a GOV.UK-style summary list of the two official channels
 * (`content/reporting.ts`), and the 48-hour assurance. No container.
 *
 * Server component with no props but the locale, so it can be dropped into
 * MDX as `<ReportHarassment />` (see `lib/mdx.tsx`) and into ordinary pages
 * alike, and so the numbers only ever have to change in one place.
 *
 * Renders its own `<h2>`: place it under page-level content, never inside a
 * section that would break the heading order. Colour is never the only
 * signal; the heading text carries the message on its own (WCAG 1.4.1).
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
    <section aria-labelledby="report-harassment" className={clsx("text-ink", className)}>
      <Heading id="report-harassment" className="m-0 border-b-0 pb-0 text-xl font-bold">
        {reportingCopy.heading[locale]}
      </Heading>

      <p className="mt-3 mb-0 leading-relaxed">{reportingCopy.intro[locale]}</p>

      <dl className="mt-5 mb-0 border-t border-line">
        {reportingChannels.map((channel) => (
          <div
            key={channel.id}
            className="grid gap-1 border-b border-line py-3 sm:grid-cols-[2fr_3fr] sm:gap-x-6"
          >
            <dt className="m-0 p-0 font-semibold">
              {channel.organisation[locale]}
              <span className="block text-sm font-normal text-muted">{channel.person[locale]}</span>
            </dt>
            <dd className="m-0 p-0">
              <p className="m-0">
                {reportingCopy.callLabel[locale]}{" "}
                <a href={channel.phoneHref} className="font-semibold">
                  {channel.phone}
                </a>
                {channel.extension
                  ? ` ${reportingCopy.extensionLabel[locale]} ${channel.extension}`
                  : null}
              </p>
              <p className="mt-1 mb-0 break-words">
                {reportingCopy.emailLabel[locale]}{" "}
                <Email address={channel.email} className="font-semibold" />
              </p>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 mb-0 font-semibold">{reportingCopy.assurance[locale]}</p>
    </section>
  );
}
