/**
 * Configuration for the Sanity CLI (`sanity dev`, `sanity deploy`,
 * `sanity documents ...`). Not used by this Next app at runtime and not
 * invoked by anything this wave verifies with (`npm run` scripts never call
 * the Sanity CLI), but it has to exist and has to agree with
 * `sanity/projectConfig.ts` for anyone who runs the CLI directly.
 */
import { defineCliConfig } from "sanity/cli";

import { SANITY_DATASET, SANITY_PROJECT_ID } from "@/sanity/projectConfig";

export default defineCliConfig({
  api: {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
  },
});
