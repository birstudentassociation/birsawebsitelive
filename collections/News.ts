import type { CollectionConfig } from "payload";

/**
 * News & events — mirrors the frontmatter of `content/news/{locale}/*.mdx`.
 *
 * Localization: `slug` and the structural fields (`date`, `type`, `start`,
 * `end`, `placeholder`) are shared across locales; the human-facing text
 * (`title`, `summary`, `category`, `location`, `links`, `body`) is localized so
 * the Thai and English versions of one story live on a single document.
 */
export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "News item", plural: "News" },
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "date", "slug"],
    group: "Content",
  },
  defaultSort: "-date",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Shared across locales — the English kebab-case key, e.g. pride-month-2026.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "news",
      options: [
        { label: "News", value: "news" },
        { label: "Event", value: "event" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "category",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "location",
      type: "text",
      localized: true,
      admin: { description: "Events only." },
    },
    {
      name: "start",
      type: "date",
      admin: {
        description: "Events only — start date/time.",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "end",
      type: "date",
      admin: {
        description: "Events only — end date/time.",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "links",
      type: "array",
      localized: true,
      labels: { singular: "Link", plural: "Links" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "placeholder",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Hidden placeholder entry (kept for structure, not shown).",
      },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
    },
  ],
};
