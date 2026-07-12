import type { CollectionConfig } from "payload";

/**
 * Student-life guides — mirrors `content/student-life/{locale}/{audience}/*.mdx`.
 *
 * Slugs are only unique *within* an audience (home / international), so the
 * uniqueness constraint is the compound (`audience`, `slug`) index below rather
 * than a global unique on `slug`. `order` and `audience` are shared across
 * locales; `title`, `summary` and `body` are localized.
 */
export const StudentLife: CollectionConfig = {
  slug: "student-life",
  labels: { singular: "Student-life guide", plural: "Student-life guides" },
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "audience", "order", "slug"],
    group: "Content",
  },
  defaultSort: "order",
  indexes: [{ fields: ["audience", "slug"], unique: true }],
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
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "audience",
      type: "select",
      required: true,
      options: [
        { label: "Home (Thai students)", value: "home" },
        { label: "International", value: "international" },
      ],
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
