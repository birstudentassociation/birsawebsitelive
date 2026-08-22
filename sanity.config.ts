/**
 * The Studio configuration (Wave 3A, REDESIGN-2.0 §6.4, §6.5, §6.11).
 *
 * Mounted at `app/studio/[[...tool]]/page.tsx`, embedded in this Next app
 * rather than deployed separately, so officers have one origin and one
 * place to go (`/officer` links here). Project id, dataset and API version
 * all come from `sanity/env.ts`, which mirrors the frozen
 * `sanity/projectConfig.ts`; nothing here is a literal.
 *
 * Schema and desk structure are owned by Wave 3B, 3C, 3D and 3E
 * (`sanity/schemaTypes/index.ts`, `sanity/structure/index.ts`). This file
 * only imports them.
 */
import { visionTool } from "@sanity/vision";
import { createElement, Fragment } from "react";
import { defineConfig, type LayoutProps } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioBasePath } from "@/sanity/env";
import { SANITY_HISTORY_RETENTION_DAYS } from "@/sanity/projectConfig";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

/**
 * A one-line, always-visible reminder of the free plan's three day history
 * retention (`sanity/projectConfig.ts`'s comment on why this matters,
 * REDESIGN-2.0 §6.11 gate 1). The Studio's own document history and
 * "revert" affordances give no hint that the window is finite; without
 * this, an officer discovers the limit for the first time when a two week
 * old mistake turns out not to be revertible, which is exactly the moment
 * REDESIGN-2.0 §6.9 says a module should have already reported itself as
 * not configured rather than let someone find out the hard way.
 *
 * `studio.components.layout` wraps every Studio screen, so this sits above
 * the structure tool, the document editor and the Presentation tool alike
 * rather than a place an officer could navigate past without seeing it.
 *
 * Built with `createElement` rather than JSX: this file is `sanity.config.ts`
 * (a `.ts` file, per Wave 3A's owned path list), and a `.ts` file cannot
 * parse JSX syntax.
 */
function HistoryRetentionBanner(props: LayoutProps) {
  return createElement(
    Fragment,
    null,
    createElement(
      "div",
      {
        style: {
          padding: "8px 16px",
          fontSize: "13px",
          lineHeight: 1.4,
          background: "#fdf6e3",
          color: "#5c4813",
          borderBottom: "1px solid #e8dcb0",
        },
      },
      `This plan keeps document history for ${SANITY_HISTORY_RETENTION_DAYS} days. A change older than that needs a developer to restore it from a backup.`
    ),
    props.renderDefault(props)
  );
}

export default defineConfig({
  name: "birsa-portal",
  title: "BIRSA Portal",

  projectId,
  dataset,

  basePath: studioBasePath,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    // Vision lets an officer run raw GROQ queries. Read only against
    // whatever perspective the Studio session is authenticated as; it
    // cannot write, so it carries the same "admin and viewer only" ceiling
    // as everything else on the free plan (`sanity/projectConfig.ts`).
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  studio: {
    components: {
      layout: HistoryRetentionBanner,
    },
  },
});
