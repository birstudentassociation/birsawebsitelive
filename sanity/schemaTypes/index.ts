/**
 * The schema registry (REDESIGN-2.0 §6.4, `docs/CMS-SCHEMA-CONVENTIONS.md`
 * §1). Every document and object type the Studio knows about is imported
 * here and named exactly once in `schemaTypes` below. This wave (3D) is the
 * integration point across Wave 3B (objects `localizedString`,
 * `localizedText`, `imageField`, `portableText`, `lifecycle`,
 * `sectionTypes`, and documents `newsArticle`, `event`, `page`, `guide`,
 * `club`) and Wave 3C (documents `committeeMember`, `portfolio`, `minutes`,
 * `decision`, `budgetEntry`, `regulation`), plus this wave's own
 * `siteSettings`, `navigation`, `serviceDefinition` and `question`.
 *
 * ADDING A TYPE LATER is one import plus one line in the matching group
 * below. Nothing else in the Studio needs to change: `sanity.config.ts`
 * (Wave 3A) reads `schemaTypes` as a whole, and `sanity/structure/index.ts`
 * (this wave) resolves document types by name rather than by a hardcoded
 * list, so a new document type only needs a structure entry if it should be
 * portfolio scoped or a singleton; anything else falls through Sanity's own
 * default document list.
 *
 * `tests/unit/sanity-schema-config.test.ts` asserts two properties of the
 * array below, not just that it is non-empty: no two entries share a
 * `name`, since Sanity silently lets the second one win and an officer
 * would never find out which; and every entry the array claims to register
 * is a real, structurally valid schema object.
 */
import type { SchemaTypeDefinition } from "sanity";

// ---------------------------------------------------------------------------
// Objects, Wave 3B.
// ---------------------------------------------------------------------------
import { localizedString } from "@/sanity/schemaTypes/objects/localizedString";
import { localizedText } from "@/sanity/schemaTypes/objects/localizedText";
import { imageField } from "@/sanity/schemaTypes/objects/imageField";
import { lifecycle } from "@/sanity/schemaTypes/objects/lifecycle";
import { portableText, portableTextInline } from "@/sanity/schemaTypes/objects/portableText";
import { sectionTypeList } from "@/sanity/schemaTypes/objects/sectionTypes";

// ---------------------------------------------------------------------------
// Objects, this wave (3D).
// ---------------------------------------------------------------------------
import { questionOption, question } from "@/sanity/schemaTypes/objects/question";
import { navLink, footerNavGroup } from "@/sanity/schemaTypes/documents/navigation";
import { labelledValue, contactRoute, featureFlag } from "@/sanity/schemaTypes/documents/siteSettings";

// ---------------------------------------------------------------------------
// Documents, Wave 3B.
// ---------------------------------------------------------------------------
import { newsArticle } from "@/sanity/schemaTypes/documents/newsArticle";
import { event } from "@/sanity/schemaTypes/documents/event";
import { page } from "@/sanity/schemaTypes/documents/page";
import { guide } from "@/sanity/schemaTypes/documents/guide";
import { club } from "@/sanity/schemaTypes/documents/club";

// ---------------------------------------------------------------------------
// Documents, Wave 3C.
// ---------------------------------------------------------------------------
import { committeeMember } from "@/sanity/schemaTypes/documents/committeeMember";
import { portfolio } from "@/sanity/schemaTypes/documents/portfolio";
import { minutes } from "@/sanity/schemaTypes/documents/minutes";
import { decision } from "@/sanity/schemaTypes/documents/decision";
import { budgetEntry } from "@/sanity/schemaTypes/documents/budgetEntry";
import { regulation } from "@/sanity/schemaTypes/documents/regulation";

// ---------------------------------------------------------------------------
// Documents, this wave (3D). Two singletons (§6.6) plus the service chassis
// document (§6.7).
// ---------------------------------------------------------------------------
import { siteSettings } from "@/sanity/schemaTypes/documents/siteSettings";
import { navigation } from "@/sanity/schemaTypes/documents/navigation";
import { serviceDefinition } from "@/sanity/schemaTypes/documents/serviceDefinition";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects, Wave 3B.
  localizedString,
  localizedText,
  imageField,
  lifecycle,
  portableText,
  portableTextInline,
  ...sectionTypeList,

  // Objects, this wave.
  questionOption,
  question,
  navLink,
  footerNavGroup,
  labelledValue,
  contactRoute,
  featureFlag,

  // Documents, this wave. The two configuration singletons (§6.6) and the
  // service chassis document (§6.7) first, since they are what makes this
  // wave the integration point.
  siteSettings,
  navigation,
  serviceDefinition,

  // Documents, Wave 3B.
  newsArticle,
  event,
  page,
  guide,
  club,

  // Documents, Wave 3C.
  committeeMember,
  portfolio,
  minutes,
  decision,
  budgetEntry,
  regulation,
];
