import { chrome } from "./chrome";
import { a11y } from "./a11y";
import { forms } from "./forms";
import { services } from "./services";
import { whatson } from "./whatson";
import { help } from "./help";
import { studies } from "./studies";
import { about } from "./about";
import { officerConsole } from "./console";
import { doNamespace } from "./do";
import { homeNamespace } from "./home";

/**
 * The English dictionary, composed from its namespace files.
 *
 * FROZEN CONTRACT. Wave 0 owns this file (REDESIGN-2.0 §11.1, §11.2).
 * Subagents own ONE namespace file per locale and never this index.
 *
 * Why the split exists: two ~243-line monoliths that every page agent must add
 * keys to is twelve agents editing two files, which is twelve conflicts. One
 * file per domain per locale takes that to zero.
 *
 * The namespaces are spread flat, so every call site keeps the shape it
 * already had: `dict.actions.readMore`, not `dict.chrome.actions.readMore`.
 * The split is a source-layout change, not an API change. A key may therefore
 * appear in exactly one namespace; two namespaces declaring the same key is a
 * silent overwrite, and `tests/unit/dictionary-namespaces.test.ts` fails on it.
 */
export const en = {
  ...chrome,
  ...a11y,
  ...forms,
  ...services,
  ...whatson,
  ...help,
  ...studies,
  ...about,
  ...officerConsole,
  ...doNamespace,
  ...homeNamespace,
};
