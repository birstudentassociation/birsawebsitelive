import type { CollectionConfig } from "payload";

/**
 * Media library — images uploaded through the admin panel. Binaries are stored
 * on Vercel Blob (wired up via the `vercelBlobStorage` plugin in
 * `payload.config.ts`), not on the local filesystem, so this works on Vercel's
 * read-only serverless filesystem.
 *
 * `alt` is localized so the same image can carry Thai and English alt text.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // Public site needs to read image metadata/URLs.
    read: () => true,
  },
  upload: {
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
    },
  ],
};
