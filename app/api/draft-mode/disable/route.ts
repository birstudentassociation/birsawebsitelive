/**
 * Turns draft mode off (Wave 3A, REDESIGN-2.0 §6.5 step 2). The Presentation
 * tool's "exit preview" action calls this route, and it is the route an
 * officer's browser is sent to once they leave the Studio's preview frame,
 * so a draft-mode cookie set for a preview session does not linger and keep
 * serving unpublished content to that browser after the officer is done.
 *
 * NO AUTHORISATION CHECK, deliberately, and this is safe rather than an
 * oversight. `app/api/draft-mode/enable/route.ts` must refuse an
 * unauthorised caller, because enabling draft mode grants a browser the
 * ability to read unpublished content. Disabling it does the opposite: it
 * only ever narrows what a request can see, back down to the published
 * perspective every visitor already gets by default. A request to this
 * route with no draft-mode cookie set has nothing to disable and nothing
 * to lose. There is no state this route can put a browser into that a
 * visitor who never called it was not already in.
 *
 * `next-sanity/draft-mode` does not export a symmetrical
 * `defineDisableDraftMode` the way it exports `defineEnableDraftMode`, so
 * this route calls Next's own `draftMode().disable()` directly, which is
 * the standard shape for a Next.js draft mode "exit" route.
 *
 * Always redirects to the site root rather than to a caller-supplied path,
 * so this route can never be used as an open redirect.
 */
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}
