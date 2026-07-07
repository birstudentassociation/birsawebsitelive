/**
 * Barrel for the regulations library. Pages import the document registry and
 * the shared types from here.
 */
export { documents, getDocument } from "./documents";
export type {
  Bi,
  Provision,
  ProvisionItem,
  Definition,
  Block,
  Section,
  RegulationMeta,
  RegulationDoc,
  Part,
} from "./types";
