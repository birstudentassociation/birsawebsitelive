import type { en } from "../en";
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
 * The Thai dictionary, composed from its namespace files.
 *
 * FROZEN CONTRACT. Wave 0 owns this file (REDESIGN-2.0 §11.1, §11.2).
 *
 * The `typeof en` annotation is the whole-tree half of the parity assertion,
 * and each Thai namespace file carries the per-namespace half. A Thai
 * namespace that is missing a key, or that has invented one, does not compile.
 * Principle 14: bilingual parity is a constraint rather than a courtesy.
 */
export const th: typeof en = {
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
