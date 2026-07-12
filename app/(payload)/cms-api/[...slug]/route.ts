/* THIS FILE WAS GENERATED FOR PAYLOAD — the REST API catch-all. Mounted at
 * `/cms-api` (see `routes.api` in payload.config.ts) to avoid colliding with
 * the app's existing `app/api/*` routes. */
import config from "@payload-config";
import "@payloadcms/next/css";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
