import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Activity } from "./collections/Activity";
import { Media } from "./collections/Media";
import { News } from "./collections/News";
import { StudentLife } from "./collections/StudentLife";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Payload CMS configuration.
 *
 * - Postgres: shares the existing Vercel Postgres database but is isolated in
 *   its own `payload` schema, so it never collides with the Equipment-Loan /
 *   inventory tables in the `public` schema. Reads `PAYLOAD_DATABASE_URI` and
 *   falls back to `POSTGRES_URL` (so on Vercel it "just works").
 * - REST/GraphQL live under `/cms-api` (not the default `/api`) to avoid
 *   clashing with the app's existing `app/api/*` routes.
 * - Localization mirrors the site: Thai default, English secondary.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: "· BIRSA Portal CMS",
    },
  },
  routes: {
    api: "/cms-api",
  },
  collections: [News, Activity, StudentLife, Media, Users],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Native (experimental) tables so raw HTML `<table>`s in the source MDX
      // migrate to real, editable table nodes.
      EXPERIMENTAL_TableFeature(),
      // Custom blocks mirroring the site's bespoke MDX components:
      // `notice` (block-level callout) and `email` (inline scrape-resistant
      // mailto link). The content migration emits these; RichTextRenderer maps
      // them back to <Notice>/<Email>.
      BlocksFeature({
        blocks: [
          {
            slug: "notice",
            interfaceName: "NoticeBlock",
            fields: [
              {
                name: "variant",
                type: "select",
                defaultValue: "placeholder",
                options: ["info", "success", "warning", "error", "placeholder"],
              },
              { name: "title", type: "text" },
              { name: "content", type: "textarea", required: true },
            ],
          },
        ],
        inlineBlocks: [
          {
            slug: "email",
            interfaceName: "EmailBlock",
            fields: [
              { name: "address", type: "text", required: true },
              { name: "label", type: "text" },
              { name: "subject", type: "text" },
            ],
          },
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: [
      { label: "ไทย", code: "th" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "th",
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URI || process.env.POSTGRES_URL || "",
    },
    schemaName: "payload",
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      // Vercel serverless functions cap request bodies at 4.5MB; upload the
      // binary straight from the browser to Blob to sidestep that limit.
      clientUploads: true,
    }),
  ],
});
