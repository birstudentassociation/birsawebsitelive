import type { CollectionConfig } from "payload";

/**
 * Admin users — the people (BIRSA officers) who sign in to `/admin` to edit
 * content. Payload's `auth: true` adds the `email` + `password` fields and the
 * login/session machinery; we only add a display `name` on top.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
