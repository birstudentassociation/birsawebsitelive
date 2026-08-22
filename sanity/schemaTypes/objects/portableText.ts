/**
 * Portable Text (REDESIGN-2.0 §4.6, §6.10, `docs/CMS-SCHEMA-CONVENTIONS.md`
 * #5).
 *
 * Mirrors `components/bds/sectionPalette.ts`'s `allowedMarks` and
 * `allowedBlocks` field for value, generated FROM those constants rather
 * than retyped next to them, so the two files cannot drift apart. If a
 * block or mark value is ever added to the frozen contract without a title
 * here, `BLOCK_TITLES`/`LIST_TITLES` below throw at import time rather than
 * silently shipping an unlabelled option.
 *
 * `h1` is deliberately absent from the style list below, so an officer
 * cannot choose it in the Studio. It is also checked in `blockValidator`,
 * so a document that somehow arrives with an `h1` block (an import, a
 * direct API write) still cannot publish, matching the frozen contract's
 * "an officer cannot produce an h1 inside a page body, which protects the
 * heading order the accessibility tests assert".
 *
 * House style runs on every block through the single implementation in
 * `lib/content/houseStyle.ts` (`docs/CMS-SCHEMA-CONVENTIONS.md` #4), so the
 * Studio, the build check and the tests agree. `blockingRules` (dashes,
 * colons, "click here") block publication. The rules that cannot tell a
 * mistake from a legitimate choice (heading case, a trailing full stop)
 * only warn, matching `lib/content/houseStyle.ts`'s own comment: "the
 * first officer to write 'Welcome week at Thammasat' must not be stuck
 * with no way forward and no developer to ask".
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import type { CustomValidator, PortableTextBlock } from "sanity";

import { allowedBlocks, allowedMarks } from "@/components/bds/sectionPalette";
import { blocksPublication, checkHouseStyle } from "@/lib/content/houseStyle";

const BLOCK_TITLES: Record<string, string> = {
  normal: "ปกติ / Normal",
  h2: "หัวข้อย่อยระดับ 2 / Heading 2",
  h3: "หัวข้อย่อยระดับ 3 / Heading 3",
  blockquote: "คำพูดอ้างอิง / Quote",
};

const LIST_TITLES: Record<string, string> = {
  ul: "รายการหัวข้อย่อย / Bulleted list",
  ol: "รายการลำดับเลข / Numbered list",
};

const MARK_TITLES: Record<string, string> = {
  strong: "ตัวหนา / Bold",
  em: "ตัวเอียง / Italic",
  code: "โค้ด / Code",
};

function titleFor(map: Record<string, string>, value: string): string {
  const title = map[value];
  if (!title) {
    throw new Error(
      `portableText.ts has no Studio title for block/mark value "${value}". ` +
        "allowedBlocks or allowedMarks in sectionPalette.ts changed without this file being updated."
    );
  }
  return title;
}

const styleValues = allowedBlocks.filter(
  (value) => value !== "ul" && value !== "ol" && value !== "table"
);
const listValues = allowedBlocks.filter(
  (value): value is "ul" | "ol" => value === "ul" || value === "ol"
);

const blockStyles = styleValues.map((value) => ({ title: titleFor(BLOCK_TITLES, value), value }));
const blockLists = listValues.map((value) => ({ title: titleFor(LIST_TITLES, value), value }));
const blockDecorators = allowedMarks
  .filter((mark) => mark !== "link")
  .map((value) => ({ title: titleFor(MARK_TITLES, value), value }));

/**
 * `PortableTextBlock` is `PortableTextTextBlock | PortableTextObject`
 * (the table array member above is the only `PortableTextObject` this
 * schema ever produces). Both helpers narrow with `in` rather than casting,
 * so a table block, which carries neither `style` nor text `children`,
 * safely reads as "not a heading, no text" instead of being assumed to be
 * a text block.
 */
function blockStyle(block: PortableTextBlock): string | undefined {
  return "style" in block && typeof block.style === "string" ? block.style : undefined;
}

function blockText(block: PortableTextBlock): string {
  if (!("children" in block) || !Array.isArray(block.children)) return "";
  return block.children
    .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
    .join("");
}

/** House style rules that block publication (§6.5 step 3). */
const blockValidator: CustomValidator<PortableTextBlock | undefined> = (block) => {
  if (!block) return true;
  const style = blockStyle(block);
  if (style === "h1") {
    return "ห้ามใช้หัวข้อระดับ 1 ในเนื้อหา หัวข้อระดับ 1 คือชื่อหน้าเท่านั้น เลือกหัวข้อระดับ 2 หรือ 3 แทน / An h1 is not allowed in body content. The page title is the only h1. Choose Heading 2 or Heading 3 instead.";
  }
  const text = blockText(block);
  const findings = checkHouseStyle(text, { isHeading: style === "h2" || style === "h3" });
  if (blocksPublication(findings)) {
    const blocking = findings.filter(
      (f) => f.rule !== "heading-title-case" && f.rule !== "heading-full-stop"
    );
    const messages = blocking.map((f) => `${f.message.th} / ${f.message.en}`);
    return [...new Set(messages)].join(" ");
  }
  return true;
};

/** House style rules that only warn (a proper noun cannot be told from a mistake). */
const blockWarning: CustomValidator<PortableTextBlock | undefined> = (block) => {
  if (!block) return true;
  const style = blockStyle(block);
  if (style !== "h2" && style !== "h3") return true;
  const findings = checkHouseStyle(blockText(block), { isHeading: true });
  const hints = findings.filter(
    (f) => f.rule === "heading-title-case" || f.rule === "heading-full-stop"
  );
  if (hints.length === 0) return true;
  return [...new Set(hints.map((f) => `${f.message.th} / ${f.message.en}`))].join(" ");
};

const linkAnnotation = defineField({
  name: "link",
  title: "ลิงก์ / Link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "ที่อยู่ลิงก์ / Link destination",
      type: "url",
      description:
        "ที่อยู่เว็บ (https://...) หรืออีเมล (mailto:...) / A web address (https://...) or an email address (mailto:...).",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
  ],
});

/**
 * The full rich text config for the `rich-text` section: prose, headings,
 * lists, links and tables (§4.6's palette row).
 */
export const portableText = defineType({
  name: "portableText",
  title: "เนื้อหาสมบูรณ์ / Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: blockStyles,
      lists: blockLists,
      marks: {
        decorators: blockDecorators,
        annotations: [linkAnnotation],
      },
      validation: (Rule) => [Rule.custom(blockValidator), Rule.custom(blockWarning).warning()],
    }),
    defineArrayMember({
      type: "object",
      name: "table",
      title: "ตาราง / Table",
      description:
        "ตารางข้อความล้วน ไม่มีการจัดรูปแบบภายในเซลล์ / A plain text table. No formatting inside a cell.",
      fields: [
        defineField({
          name: "rows",
          title: "แถว / Rows",
          type: "array",
          of: [
            {
              type: "object",
              name: "row",
              title: "แถว / Row",
              fields: [
                defineField({
                  name: "cells",
                  title: "เซลล์ / Cells",
                  type: "array",
                  of: [{ type: "string" }],
                }),
              ],
            },
          ],
          validation: (Rule) =>
            Rule.min(1).error("ตารางต้องมีอย่างน้อยหนึ่งแถว / A table needs at least one row."),
        }),
      ],
    }),
  ],
});

/**
 * A restricted rich text config for the `inset-text` section: "plain text
 * with inline marks only" (§4.6's palette row). No headings, no lists, no
 * table, because an aside is not a place to build a second page structure.
 */
export const portableTextInline = defineType({
  name: "portableTextInline",
  title: "ข้อความเน้น / Inline rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: titleFor(BLOCK_TITLES, "normal"), value: "normal" }],
      lists: [],
      marks: {
        decorators: blockDecorators,
        annotations: [linkAnnotation],
      },
      validation: (Rule) => Rule.custom(blockValidator),
    }),
  ],
});
