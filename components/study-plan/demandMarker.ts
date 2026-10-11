/**
 * The soft limit on sending electives to Academic Affairs, kept in this
 * browser.
 *
 * After a student sends, the academic term they sent in is written to
 * localStorage under `birsa-elective-demand`, and the plan screen then offers
 * nothing more to send until the term changes. It is a courtesy, not a lock:
 * clearing site data or using another browser gets round it, and BIRSA has no
 * way to tell, because it holds nothing that identifies a sender. The server
 * adds a per-network rate limit, which is just as soft. The register says so
 * (content/privacy/register.ts).
 *
 * The value is a JSON array of term keys such as `2569-1`, newest last and
 * capped, and it never leaves the device. Every access is wrapped in
 * try/catch: private browsing or blocked storage means no limit, never an
 * error. The delete button on the plan screen clears it along with the plan.
 */

const KEY = "birsa-elective-demand";

/** The event that tells this tab's subscribers the marker changed (the `storage` event only fires in other tabs). */
const CHANGED = "demandmarker";

/** How many terms are remembered. Older ones can never matter again. */
const MAX_REMEMBERED = 8;

/** The raw stored value, or null. A plain string so it is a stable snapshot for `useSyncExternalStore`. */
export function readDemandMarker(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** The term keys a raw stored value holds. Anything that is not an array of strings counts as none. */
export function parseDemandMarker(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** Remembers that electives were sent in the term `termKey`. */
export function markDemandShared(termKey: string): void {
  try {
    const known = parseDemandMarker(readDemandMarker()).filter((key) => key !== termKey);
    window.localStorage.setItem(KEY, JSON.stringify([...known, termKey].slice(-MAX_REMEMBERED)));
    window.dispatchEvent(new Event(CHANGED));
  } catch {
    // The limit just will not be remembered; the server still limits by network.
  }
}

/** Forgets everything. Called when the student deletes their plan. */
export function clearDemandMarker(): void {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(CHANGED));
  } catch {
    // Nothing to clear if storage was never available.
  }
}

/** For `useSyncExternalStore`: calls `onChange` when the marker changes in this tab or another. */
export function subscribeToDemandMarker(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGED, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGED, onChange);
  };
}
