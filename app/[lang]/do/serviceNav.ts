import type { ServiceNavLink } from "@/components/bds/ServiceNavigation";
import type { ServiceDefinition } from "@/lib/services/defineService";
import type { Locale } from "@/lib/i18n";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";
// Side effect only: registers the loan's SubmissionStore and its subject
// resolver (lib/services/loanSubmissionStore.ts's bottom two calls). This is
// the fix for that file's own "finding 1, NOT WIRED IN": Wave 4B built a
// correct store and found no route imported it, so `getSubmissionStore`
// handed every request the in-memory placeholder regardless, and (as of gate
// 7) `equipmentLoan`'s own `subject.source` would fail rule 9 the same way
// for the same reason. Every chassis route under app/[lang]/do/** imports
// this module already, for `chassisServiceNavLinks` below, so it is the one
// place a side-effect import reaches every request before `getService` is
// ever called, without adding an import solely for this to a route that
// otherwise would not need one. A future second chassis service registers
// its own store and resolver here the same way.
import "@/lib/services/loanSubmissionStore";

/**
 * The links every `ServiceNavigation` bar on a chassis route carries
 * (REDESIGN-2.0 §3.5, §4.4): back to the service's own start page, and check
 * status. `current` names whichever one matches `activePath` so
 * `ServiceNavigation` can render `aria-current="page"` on it, the same
 * pattern `Breadcrumbs` uses.
 */
export function chassisServiceNavLinks(
  definition: ServiceDefinition,
  locale: Locale,
  activePath: "start" | "status" | "other"
): ServiceNavLink[] {
  const dict = getDoDictionary(locale);
  return [
    {
      href: `/do/${definition.id}`,
      label: dict.do.serviceNav.start,
      current: activePath === "start",
    },
    {
      href: `/do/${definition.id}/status`,
      label: dict.do.serviceNav.checkStatus,
      current: activePath === "status",
    },
  ];
}
