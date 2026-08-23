/**
 * The primary navigation data, deliberately in a module with NO "use client".
 *
 * WHY THIS FILE IS SEPARATE FROM `Header.tsx`. It used to live there, and the
 * whole site's prerender failed with "defaultPrimaryNav.find is not a
 * function". `Header.tsx` is a client component, and a server component that
 * imports a plain VALUE from a client module does not get the value: it gets
 * the client reference proxy the bundler substitutes at the boundary. Calling
 * an array method on that proxy throws at build time, on every page.
 *
 * The whole test suite passed while this was broken, because the tests render
 * components directly and never cross a real server-to-client boundary. Only
 * `next build` sees it. That is why the build runs at every wave boundary.
 *
 * So the data lives here, where either side may import it, and `Header.tsx`
 * re-exports it for the callers that already reach for it there.
 */
export type NavLink = {
  /** Path relative to the locale root, e.g. "/do". Passed through `localeHref`. */
  href: string;
  label: { th: string; en: string };
};

/**
 * The five primary destinations from `docs/ROUTE-MAP-2.0.md` §3.2 and
 * `docs/DECISIONS-2.0.md` Decision 2. This is the default value of `Header`'s
 * `nav` prop, and therefore the seam the CMS fills: a future edit here is "the
 * CMS is not up yet", never "the copy changed", because once Sanity exists this
 * array stops being read at all.
 */
export const defaultPrimaryNav: NavLink[] = [
  { href: "/do", label: { en: "Do something", th: "ทำเรื่อง" } },
  { href: "/help", label: { en: "Get help", th: "ขอความช่วยเหลือ" } },
  { href: "/whats-on", label: { en: "What's on", th: "ข่าวและกิจกรรม" } },
  { href: "/studies", label: { en: "Your studies", th: "เรื่องเรียน" } },
  { href: "/about", label: { en: "About BIRSA", th: "เกี่ยวกับ BIRSA" } },
];
