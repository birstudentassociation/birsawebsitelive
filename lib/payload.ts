/**
 * Shared Payload Local API client. `getPayload` initializes Payload once
 * (connecting to Postgres, loading the config) and caches the instance, so
 * server components / route handlers / scripts can all query the CMS in-process
 * without an HTTP round-trip.
 */
import config from "@payload-config";
import { getPayload, type Payload } from "payload";

let cached: Promise<Payload> | null = null;

/** Returns the shared, lazily-initialized Payload instance. */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config });
  }
  return cached;
}
