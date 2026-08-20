import type { ServiceNavLink } from "@/components/bds/ServiceNavigation";
import type { ServiceDefinition } from "@/lib/services/defineService";
import type { Locale } from "@/lib/i18n";
import { getDoDictionary } from "@/app/[lang]/do/dictionary";

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
