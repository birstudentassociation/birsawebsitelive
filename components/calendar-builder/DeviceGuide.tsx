"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Accordion from "@/components/Accordion";
import type { CalendarBuilderCopy, GuideCopy } from "@/content/calendar-builder/types";
import type { FeedLinks } from "@/lib/calendar-builder/links";
import { Marked } from "./helpers";

export type DeviceGuideProps = {
  guide: GuideCopy;
  /** The https feed URL. */
  feedUrl: string;
  links: FeedLinks;
  copy: CalendarBuilderCopy["step3"];
  active: boolean;
};

/**
 * One device's instructions: a primary deep link, a copy button with a polite
 * confirmation, numbered steps and two disclosures. Always in the document
 * (hidden when not selected) so that with JavaScript off every guide is shown.
 */
export default function DeviceGuide({ guide, feedUrl, links, copy, active }: DeviceGuideProps) {
  const [outcome, setOutcome] = useState<"idle" | "copied" | "failed">("idle");
  const href = (key: GuideCopy["primary"]["link"]) => links[key];
  const download = guide.primary.link === "download";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setOutcome("copied");
    } catch {
      setOutcome("failed");
    }
  }

  return (
    <section
      hidden={!active}
      data-guide={guide.id}
      aria-labelledby={`guide-${guide.id}-heading`}
      className="js-guide flex flex-col gap-5"
    >
      <h3 id={`guide-${guide.id}-heading`} className="font-display text-lg">
        {guide.heading}
      </h3>
      {guide.intro ? <p className="leading-relaxed text-ink">{guide.intro}</p> : null}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            href={href(guide.primary.link)}
            download={download ? "" : undefined}
            className="whitespace-normal"
          >
            {guide.primary.label}
          </Button>
          <Button type="button" variant="secondary" onClick={copyLink} className="js-only">
            {copy.copy}
          </Button>
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-sm font-medium text-ink">
          {outcome === "copied" ? copy.copied : outcome === "failed" ? copy.copyFailed : ""}
        </p>
        {guide.more && guide.more.length > 0 ? (
          <ul className="flex flex-col gap-1 text-sm">
            {guide.more.map((item) => (
              <li key={item.link}>
                <a href={href(item.link)} className="text-brand-deep underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`guide-${guide.id}-link`} className="text-sm font-semibold text-ink">
            {copy.linkLabel}
          </label>
          <input
            id={`guide-${guide.id}-link`}
            type="text"
            readOnly
            value={feedUrl}
            onFocus={(event) => event.currentTarget.select()}
            className="focus-halo h-11 w-full rounded-md border border-input-border bg-surface px-3.5 text-sm text-ink"
          />
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold text-ink">{copy.stepsHeading}</h4>
        <ol className="mt-2 list-decimal space-y-2 pl-5 leading-relaxed marker:font-semibold">
          {guide.steps.map((step) => (
            <li key={step} className="pl-1">
              <Marked text={step} />
            </li>
          ))}
        </ol>
      </div>

      {guide.notes && guide.notes.length > 0 ? (
        <ul className="flex flex-col gap-1 text-sm leading-relaxed text-muted">
          {guide.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-3">
        <Accordion summary={copy.notAppear}>
          <ul className="list-disc space-y-2 pl-5">
            {guide.notAppear.map((item) => (
              <li key={item}>
                <Marked text={item} />
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion summary={copy.remove}>
          <ol className="list-decimal space-y-2 pl-5">
            {guide.remove.map((item) => (
              <li key={item}>
                <Marked text={item} />
              </li>
            ))}
          </ol>
        </Accordion>
      </div>
    </section>
  );
}
