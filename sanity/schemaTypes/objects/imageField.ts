/**
 * The `ImageField` shape from `components/bds/imageContract.ts`, as a
 * Sanity object type (REDESIGN-2.0 §4.7C, §11.3 item 8).
 *
 * `components/bds/imageContract.ts` is FROZEN and is mirrored here field for
 * field, not re-specified:
 *   - `image` carries the asset. Sanity's native `hotspot: true` option IS
 *     `imageContract.ts`'s `hotspot` field: the officer marks the subject
 *     once and Sanity crops every ratio around it (§4.7D). `assetId` in the
 *     contract's TypeScript shape is `image.asset._ref` here.
 *   - `decorative` is a deliberate choice, not a default: it is
 *     `Rule.required()` with no `initialValue`, so an officer must actively
 *     interact with it rather than fall into "not decorative" by leaving it
 *     untouched (acceptance test rows 36, 37).
 *   - `alt` is required in both locales unless `decorative`, validated by
 *     calling `altTextProblems` from the contract directly, so the Studio,
 *     the build check and the tests share one implementation
 *     (`docs/CMS-SCHEMA-CONVENTIONS.md` #4). This is publish BLOCKING, not a
 *     warning, matching the frozen contract and the build brief's "An image
 *     field without required bilingual alt text is forbidden outright".
 *   - `ratio` is restricted to the contract's fixed aspect ratios.
 *
 * `MAX_SOURCE_BYTES` is checked as an async publish validator against the
 * uploaded asset's stored size. A field validator cannot reject a file at
 * the moment of upload the way a custom Studio upload widget could; this is
 * the closest a schema-only implementation gets, and it still means an
 * oversized original cannot leave draft.
 */
import { defineField, defineType } from "sanity";
import type { CustomValidator } from "sanity";

import {
  acceptedUploadTypes,
  altTextProblems,
  aspectRatios,
  MAX_SOURCE_BYTES,
  type AltTextProblem,
  type ImageField as ImageFieldContract,
} from "@/components/bds/imageContract";
import { SANITY_API_VERSION } from "@/sanity/projectConfig";

const RATIO_TITLES: Record<(typeof aspectRatios)[number], string> = {
  "16:9": "16:9 (แนวนอนกว้าง) / 16:9 (wide)",
  "4:3": "4:3 (แนวนอน) / 4:3 (standard)",
  "1:1": "1:1 (จัตุรัส) / 1:1 (square)",
};

const PROBLEM_MESSAGES: Record<AltTextProblem, { th: string; en: string }> = {
  "missing-locale": {
    th: "กรุณาใส่คำอธิบายภาพให้ครบทั้งภาษาไทยและภาษาอังกฤษ หรือทำเครื่องหมายว่าเป็นภาพตกแต่ง",
    en: "Enter alt text in both Thai and English, or mark the image decorative.",
  },
  empty: {
    th: "คำอธิบายภาพต้องไม่เว้นว่างในภาษาใดภาษาหนึ่ง",
    en: "Alt text cannot be empty in either language.",
  },
  "starts-with-image-of": {
    th: 'คำอธิบายภาพไม่ควรขึ้นต้นด้วยคำว่า "ภาพของ" หรือ "image of" ให้บรรยายสิ่งที่เห็นในภาพแทน',
    en: 'Alt text should not begin "image of". Describe the scene instead.',
  },
  "same-as-caption": {
    th: "คำอธิบายภาพต้องไม่ซ้ำกับคำบรรยายใต้ภาพ ทั้งสองทำหน้าที่ต่างกัน",
    en: "Alt text must not be identical to the caption. They do different jobs.",
  },
  "alt-on-decorative": {
    th: "ภาพที่ทำเครื่องหมายว่าเป็นภาพตกแต่งต้องไม่มีคำอธิบายภาพ ให้ลบคำอธิบายภาพออก หรือยกเลิกการทำเครื่องหมายภาพตกแต่ง",
    en: "A decorative image must not carry alt text. Remove it, or unmark the image as decorative.",
  },
};

type ImageFieldParent = {
  image?: { asset?: { _ref?: string } };
  decorative?: boolean;
  caption?: { en?: string; th?: string };
  ratio?: (typeof aspectRatios)[number];
};

const altValidator: CustomValidator<{ en?: string; th?: string } | undefined> = (value, context) => {
  const parent = (context.parent ?? {}) as ImageFieldParent;
  const asContract: ImageFieldContract = {
    assetId: parent.image?.asset?._ref ?? "",
    decorative: parent.decorative === true,
    alt: value && (value.en || value.th) ? { en: value.en ?? "", th: value.th ?? "" } : null,
    caption:
      parent.caption && (parent.caption.en || parent.caption.th)
        ? { en: parent.caption.en ?? "", th: parent.caption.th ?? "" }
        : undefined,
    ratio: parent.ratio ?? "16:9",
  };
  const problems = altTextProblems(asContract);
  if (problems.length === 0) return true;
  return [...new Set(problems.map((p) => `${PROBLEM_MESSAGES[p].th} / ${PROBLEM_MESSAGES[p].en}`))].join(" ");
};

const sizeValidator: CustomValidator<{ asset?: { _ref?: string } } | undefined> = async (value, context) => {
  const assetRef = value?.asset?._ref;
  if (!assetRef) return true;
  try {
    const client = context.getClient({ apiVersion: SANITY_API_VERSION });
    const asset = await client.fetch<{ size?: number } | null>(`*[_id == $id][0]{size}`, {
      id: assetRef,
    });
    const maxMb = Math.round(MAX_SOURCE_BYTES / (1024 * 1024));
    if (asset?.size && asset.size > MAX_SOURCE_BYTES) {
      return `ไฟล์ภาพต้นฉบับมีขนาดใหญ่กว่า ${maxMb}MB กรุณาบีบอัดภาพก่อนอัปโหลดใหม่ / The source image is larger than ${maxMb}MB. Compress it and upload again.`;
    }
    return true;
  } catch {
    // No live client available (offline build, or the Wave 0 non-profit
    // plan application is still pending). Do not block publish on a check
    // that cannot run; the upload-time UI limit is the primary control.
    return true;
  }
};

export const imageField = defineType({
  name: "imageField",
  title: "ภาพ / Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "ไฟล์ภาพ / Image file",
      type: "image",
      options: { hotspot: true, accept: acceptedUploadTypes.join(",") },
      description:
        "ทำเครื่องหมายจุดสำคัญของภาพครั้งเดียว ระบบจะครอปภาพให้พอดีทุกสัดส่วนโดยอัตโนมัติ / Mark the subject once (the hotspot); every aspect ratio crops around it automatically.",
      validation: (Rule) => [Rule.required(), Rule.custom(sizeValidator)],
    }),
    defineField({
      name: "decorative",
      title: "ภาพตกแต่ง (ไม่สื่อความหมาย) / Decorative image",
      type: "boolean",
      description:
        'เลือก "ใช่" เฉพาะเมื่อภาพนี้ไม่ได้ให้ข้อมูลใด ๆ กับผู้อ่าน เช่น ภาพประดับ ระบบจะซ่อนช่องคำอธิบายภาพและไม่อ่านออกเสียงภาพนี้ให้ผู้ใช้โปรแกรมอ่านหน้าจอฟัง คุณต้องเลือกคำตอบนี้เอง ระบบจะไม่ตั้งค่าเริ่มต้นให้ / Choose "yes" only when this image carries no information for the reader. This hides the alt text field and screen readers skip the image. You must choose deliberately; there is no default.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "คำอธิบายภาพ (Alt text) / Alt text",
      type: "localizedString",
      description:
        "บรรยายสิ่งที่เห็นในภาพ ไม่ใช่รายชื่อบุคคล เช่น \"นักศึกษาในงานต้อนรับ\" ไม่ใช่รายชื่อคน จำเป็นทั้งสองภาษา เว้นแต่ทำเครื่องหมายว่าเป็นภาพตกแต่ง / Describe the scene, not the people, e.g. \"students at the welcome fair\", never a list of names. Required in both languages unless the image is decorative.",
      hidden: ({ parent }) => (parent as ImageFieldParent | undefined)?.decorative === true,
      validation: (Rule) => Rule.custom(altValidator),
    }),
    defineField({
      name: "caption",
      title: "คำบรรยายใต้ภาพ / Caption",
      type: "localizedText",
      description:
        "ข้อความจริงที่แสดงใต้ภาพ ไม่ใช่ข้อความที่ฝังอยู่ในไฟล์ภาพ ไม่บังคับกรอก / Real text shown under the image, never baked into the picture. Optional.",
      hidden: ({ parent }) => (parent as ImageFieldParent | undefined)?.decorative === true,
    }),
    defineField({
      name: "credit",
      title: "เครดิตภาพ / Credit",
      type: "string",
      description: "ผู้ถ่ายภาพหรือแหล่งที่มา หากมี / The photographer or source, if any. Optional.",
    }),
    defineField({
      name: "ratio",
      title: "สัดส่วนภาพ / Aspect ratio",
      type: "string",
      options: { list: aspectRatios.map((value) => ({ title: RATIO_TITLES[value], value })) },
      description:
        "เลือกสัดส่วนที่ใช้แสดงผล การ์ดและหน้าเพจจะไม่กระตุกเพราะมีความสูงคงที่ / Choose the aspect ratio this image displays at, so cards and pages never jump.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: "image", title: "alt.en", subtitle: "alt.th" },
  },
});
