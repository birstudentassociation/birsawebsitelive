import type { CollectionConfig } from "payload";

/**
 * BIRSA activity pages — mirrors `content/activity/{locale}/*.mdx`.
 *
 * `slug`, `order` and `updated` are shared across locales; `title`, `summary`
 * and `body` are localized.
 */
export const Activity: CollectionConfig = {
  slug: "activity",
  labels: { singular: "Activity page", plural: "Activity pages" },
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "updated", "slug"],
    group: "Content",
  },
  defaultSort: "order",
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
      admin: { position: "sidebar" },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "order",
      type: "number",
      required: true,
      admin: { position: "sidebar", description: "Sort order (ascending)." },
    },
    {
      name: "updated",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
      },
    },
    {
      name: "placeholder",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
    },
  ],
};
