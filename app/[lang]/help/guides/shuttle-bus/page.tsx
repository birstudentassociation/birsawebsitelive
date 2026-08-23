import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import SignpostSource from "@/components/help/SignpostSource";
import { Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/help/guides/shuttle-bus` (SCOPE-AUDIT-2.0 §3.2 SIGNPOST row,
 * `home/shuttle-bus.mdx`).
 *
 * Thammasat runs the shuttle, not BIRSA, and the 1.0 page's own full
 * timetable is hardcoded in `lib/shuttle.ts` rather than sourced live,
 * which the audit flags as a staleness risk with no engineered check. This
 * page therefore states only what stays true regardless of the current
 * timetable (two free weekday lines from Tha Prachan) and does not restate
 * route numbers, stop names or departure times, which is exactly the kind
 * of detail that goes stale first. No BIRSA-controlled page currently
 * republishes Thammasat's own shuttle timetable live, so this signpost
 * links to the university's own site rather than inventing a deep link to a
 * transport office page this checkout has no verified source for.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy = {
  en: {
    title: "Shuttle bus service",
    lede: "Thammasat runs two free shuttle lines from Tha Prachan, Monday to Friday. Thammasat sets the routes and timetable, not BIRSA.",
    body: "Both lines board in front of the Thammasat University Auditorium. One line runs to MRT Sanam Chai; the other loops through the Pinklao area. There is no shuttle service on Saturdays or Sundays.",
    liveNote:
      "Schedules can change. The Viabus app shows the shuttles' live position on the road, which is a more reliable check on the day than a printed timetable.",
    signpostName: "Thammasat University",
    signpostBody:
      "Thammasat operates the shuttle service and sets its routes and timetable. BIRSA does not run or update this service.",
    signpostLinkLabel: "Thammasat University website",
  },
  th: {
    title: "รถรับส่งของมหาวิทยาลัย",
    lede: "ธรรมศาสตร์จัดรถรับส่งฟรีสองสายจากท่าพระจันทร์ ในวันจันทร์ถึงวันศุกร์ มหาวิทยาลัยเป็นผู้กำหนดเส้นทางและตารางเวลา ไม่ใช่ BIRSA",
    body: "รถทั้งสองสายขึ้นที่หน้าหอประชุมมหาวิทยาลัยธรรมศาสตร์ สายหนึ่งวิ่งไป MRT สนามไชย อีกสายวิ่งวนย่านปิ่นเกล้า ไม่มีบริการในวันเสาร์และวันอาทิตย์",
    liveNote:
      "ตารางเวลาอาจเปลี่ยนแปลงได้ แอป Viabus แสดงตำแหน่งรถแบบเรียลไทม์ ซึ่งเชื่อถือได้มากกว่าตารางเวลาที่พิมพ์ไว้ในวันที่ใช้งานจริง",
    signpostName: "มหาวิทยาลัยธรรมศาสตร์",
    signpostBody:
      "มหาวิทยาลัยธรรมศาสตร์เป็นผู้ดำเนินการรถรับส่งและกำหนดเส้นทางกับตารางเวลา BIRSA ไม่ได้เป็นผู้ดูแลหรืออัปเดตบริการนี้",
    signpostLinkLabel: "เว็บไซต์มหาวิทยาลัยธรรมศาสตร์",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];
  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/help/guides/shuttle-bus" });
}

export default async function ShuttleBusGuidePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  return (
    <HelpPageShell
      locale={locale}
      title={t.title}
      lede={t.lede}
      breadcrumbItems={[
        { label: dict.site.name, href: "/" },
        { label: dict.hub.title, href: "/help" },
        { label: dict.guidesIndex.title, href: "/help/guides" },
        { label: t.title },
      ]}
    >
      <Stack gap="sm">
        <Text step="body">{t.body}</Text>
        <Text step="body" className="text-muted">
          {t.liveNote}
        </Text>
      </Stack>

      <SignpostSource
        locale={locale}
        name={t.signpostName}
        body={t.signpostBody}
        href="https://www.tu.ac.th"
        linkLabel={t.signpostLinkLabel}
      />
    </HelpPageShell>
  );
}
