import { Fragment, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Other-language text inside a page must carry its own `lang` so screen
 * readers switch voice (WCAG 3.1.2 Language of parts). English pages quote a
 * lot of Thai: office names, abbreviations like คกร., regulation titles. These
 * helpers find each run of Thai script in English text and tag it, so authors
 * never have to wrap anything by hand.
 *
 * A run is Thai characters, optionally joined by spaces or full stops, so
 * "กกต.ร." and "ศูนย์ ความเป็นเลิศ" stay whole. Thai pages are left alone: the
 * Latin text they contain is mostly names, codes and acronyms, which Thai
 * voices already read acceptably.
 */
const THAI_RUN = /[฀-๿](?:[฀-๿ .]*[฀-๿.])?/g;

export type LangSegment = { text: string; lang?: "th" };

export function splitLangRuns(text: string, locale: Locale): LangSegment[] {
  if (locale !== "en" || !/[฀-๿]/.test(text)) return [{ text }];
  const segments: LangSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(THAI_RUN)) {
    const start = match.index;
    if (start > last) segments.push({ text: text.slice(last, start) });
    segments.push({ text: match[0], lang: "th" });
    last = start + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}

/** `text` as React children, with every Thai run on an English page in `<span lang="th">`. */
export function langRuns(text: string | undefined, locale: Locale): ReactNode {
  if (!text) return text;
  const segments = splitLangRuns(text, locale);
  if (segments.length === 1 && !segments[0]?.lang) return text;
  return segments.map((segment, index) =>
    segment.lang ? (
      <span key={index} lang={segment.lang}>
        {segment.text}
      </span>
    ) : (
      <Fragment key={index}>{segment.text}</Fragment>
    )
  );
}

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const SKIP_TAGS = new Set(["code", "pre", "script", "style"]);

/**
 * Rehype plugin: the MDX equivalent of `langRuns`. Walks into MDX components
 * too, and leaves text alone inside code and inside any element that already
 * declares a `lang`.
 */
export function rehypeLangRuns({ locale }: { locale: Locale }) {
  function walk(node: HastNode) {
    if (!node.children) return;
    const next: HastNode[] = [];
    for (const child of node.children) {
      if (child.type === "text" && child.value) {
        const segments = splitLangRuns(child.value, locale);
        for (const segment of segments) {
          next.push(
            segment.lang
              ? {
                  type: "element",
                  tagName: "span",
                  properties: { lang: segment.lang },
                  children: [{ type: "text", value: segment.text }],
                }
              : { type: "text", value: segment.text }
          );
        }
        continue;
      }
      const skip =
        child.type === "element" &&
        (SKIP_TAGS.has(child.tagName ?? "") || child.properties?.lang !== undefined);
      if (!skip) walk(child);
      next.push(child);
    }
    node.children = next;
  }

  return (tree: HastNode) => {
    if (locale === "en") walk(tree);
  };
}
