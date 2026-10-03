import Link from "next/link";
import ExternalLink from "@/components/ExternalLink";
import type { GuideBlock } from "@/content/emergency/types";
import { localeHref, type Locale } from "@/lib/i18n";

type LinkProps = {
  href: string;
  locale: Locale;
  newTabLabel: string;
  className?: string;
  children: React.ReactNode;
};

/** A site page goes through the locale, a file in `public` does not, and anything else opens in a new tab. */
export function GuideLink({ href, locale, newTabLabel, className, children }: LinkProps) {
  if (href.startsWith("https://")) {
    return (
      <ExternalLink href={href} newTabLabel={newTabLabel} className={className}>
        {children}
      </ExternalLink>
    );
  }
  if (/\.[a-z0-9]+$/.test(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={localeHref(locale, href)} className={className}>
      {children}
    </Link>
  );
}

export function StartButton({
  label,
  href,
  locale,
  newTabLabel,
}: {
  label: string;
  href: string;
  locale: Locale;
  newTabLabel: string;
}) {
  return (
    <GuideLink
      href={href}
      locale={locale}
      newTabLabel={newTabLabel}
      className="focus-halo inline-flex min-h-12 items-center gap-2 self-start rounded-lg bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-strong"
    >
      {label}
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0">
        <path
          d="M7 4l6 6-6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </GuideLink>
  );
}

type Props = {
  blocks: GuideBlock[];
  locale: Locale;
  newTabLabel: string;
};

/** The body of one guide part, following the GOV.UK content components. */
export default function GuideBlocks({ blocks, locale, newTabLabel }: Props) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "paragraph":
            return (
              <p key={index} className="leading-relaxed text-ink">
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h3 key={index} className="mt-3 font-display text-xl text-ink">
                {block.text}
              </h3>
            );
          case "list":
            return (
              <ul
                key={index}
                className="flex list-disc flex-col gap-2 pl-6 leading-relaxed text-ink"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol
                key={index}
                className="flex list-decimal flex-col gap-2 pl-6 leading-relaxed text-ink"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case "inset":
            return (
              <p
                key={index}
                className="border-l-4 border-input-border py-1 pl-4 leading-relaxed text-ink"
              >
                {block.text}
              </p>
            );
          case "warning":
            return (
              <div key={index} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-surface"
                >
                  !
                </span>
                <p className="pt-1 leading-relaxed font-semibold text-ink">{block.text}</p>
              </div>
            );
          case "table": {
            const [head, ...rows] = block.rows;
            return (
              <div key={index} className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[0.95rem] leading-relaxed">
                  <caption className="mb-2 text-left font-display text-lg text-ink">
                    {block.caption}
                  </caption>
                  <thead>
                    <tr>
                      {head!.map((cell) => (
                        <th
                          key={cell}
                          scope="col"
                          className="border-b-2 border-line-strong py-2 pr-4 align-bottom font-semibold text-ink"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.join("|")}>
                        {row.map((cell, cellIndex) =>
                          cellIndex === 0 ? (
                            <th
                              key={cellIndex}
                              scope="row"
                              className="border-b border-line py-2 pr-4 align-top font-normal text-ink"
                            >
                              {cell}
                            </th>
                          ) : (
                            <td
                              key={cellIndex}
                              className="border-b border-line py-2 pr-4 align-top text-ink"
                            >
                              {cell}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          case "details":
            return (
              <details key={index} className="group">
                <summary className="focus-halo inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded font-semibold text-brand-deep underline marker:content-none [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-open:rotate-90"
                  >
                    &#9656;
                  </span>
                  {block.summary}
                </summary>
                <div className="mt-2 flex flex-col gap-3 border-l-4 border-input-border py-1 pl-4">
                  <GuideBlocks blocks={block.blocks} locale={locale} newTabLabel={newTabLabel} />
                </div>
              </details>
            );
          case "start":
            return (
              <StartButton
                key={index}
                label={block.label}
                href={block.href}
                locale={locale}
                newTabLabel={newTabLabel}
              />
            );
          case "links":
            return (
              <ul key={index} className="flex flex-col gap-1">
                {block.links.map((link) => (
                  <li key={link.href}>
                    <GuideLink
                      href={link.href}
                      locale={locale}
                      newTabLabel={newTabLabel}
                      className="font-semibold text-brand-deep underline"
                    >
                      {link.label}
                    </GuideLink>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </>
  );
}
