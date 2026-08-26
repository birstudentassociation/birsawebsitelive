/**
 * Resolves a committee member's portrait from the filesystem at render time
 * (build-time `fs` read, same pattern as `lib/content.ts`). BIRSA can drop a
 * photo into `public/committee/<key>.{avif,webp,jpg,jpeg,png}` with no code
 * change; callers fall back to a placeholder when none is found.
 *
 * Shared by `components/about/CommitteeRoster.tsx` (MDX component) and the
 * Current officers page so the lookup lives in exactly one place.
 */
import fs from "node:fs";
import path from "node:path";

const PORTRAIT_EXTENSIONS = ["avif", "webp", "jpg", "jpeg", "png"] as const;

/** Public URL of the member's portrait, or `null` if no file exists. */
export function findPortrait(key: string): string | null {
  for (const ext of PORTRAIT_EXTENSIONS) {
    const filePath = path.join(process.cwd(), "public", "committee", `${key}.${ext}`);
    if (fs.existsSync(filePath)) {
      return `/committee/${key}.${ext}`;
    }
  }
  return null;
}
