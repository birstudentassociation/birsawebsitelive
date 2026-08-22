/**
 * Image URL builder (Wave 3A). Turns a Sanity image reference into a
 * rendered URL, without ever needing the read token: image delivery is
 * public by project id and dataset the same way the project id itself is
 * (`sanity/projectConfig.ts`'s comment on why that value is not a secret).
 *
 * `createImageUrlBuilder` is the named export `@sanity/image-url` asks
 * callers to use; its `default` export is deprecated.
 */
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Builds an image URL builder for `source`, or `undefined` when `source`
 * is missing or has no asset reference yet (a field left empty in a
 * draft). Callers chain `.width()`, `.height()`, `.auto("format")` and so
 * on before calling `.url()`, same as any `@sanity/image-url` builder.
 */
export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source) {
    return undefined;
  }
  return builder.image(source);
}
