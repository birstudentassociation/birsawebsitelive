import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import ExitThisPage from "@/components/bds/ExitThisPage";
import InterruptionPage from "@/components/bds/InterruptionPage";
import ReportingChannels from "@/components/help/ReportingChannels";
import { Text } from "@/components/bds/Type";
import { Wrap, Stack } from "@/components/bds/Layout";

/**
 * `/help/reporting` (ROUTE-MAP-2.0 Wave 5C, SCOPE-AUDIT-2.0 §3.2 ABSORB row
 * `home/safety-and-emergencies.mdx`, harassment reporting slice only).
 *
 * ROUTE-MAP-2.0 names this page and `/help/welfare` as the two that carry
 * `ExitThisPage` and an `InterruptionPage`, and carry no `PageFeedback`
 * (instrumenting the page where being observed is the reason someone does
 * not report is the exact thing principle 3 forbids).
 *
 * No `HelpPageShell`/`PageHeader` here: `InterruptionPage` renders the
 * page's own `<h1>` itself (see its file-level TSDoc, "HEADING ORDER:
 * page-level"), and a second `<h1>` from `PageHeader` would violate the one
 * heading rule. `continueHref` is an in-page anchor to the reporting
 * channels rendered below, which is a real, working `href` with JavaScript
 * off, exactly as `InterruptionPage`'s contract requires: no separate
 * `/help/reporting/*` route exists in the approved route map to send it to
 * instead.
 *
 * `exitHref` is a genuinely neutral destination unrelated to BIRSA or to
 * harassment reporting, per `ExitThisPage`'s own TSDoc (a search engine home
 * page, one of the two examples that TSDoc itself names).
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const EXIT_HREF = "https://www.google.com";

const copy = {
  en: {
    title: "Report harassment or bullying",
    intro:
      "If anything happens, from another student, staff member or member of the public, that leaves you feeling unsafe, uncomfortable or violated, you have the right to report it.",
    boundaryLead:
      "Before you continue, it helps to know what these two channels are.",
    boundaryBody:
      "The BIR Programme office and BIRSA's Rights Advocate and Student Welfare Officer are BIRSA's own reporting channels, not the police and not a court. You do not need complete evidence or a tidy account of what happened before you ask for advice, and you can talk to a trusted BIRSA committee member first if that feels easier. Reporting here does not replace calling the police (191) in an emergency, and it does not replace the university's own formal disciplinary process if that is the route you choose instead or as well.",
    continueLabel: "See how to report",
    secondaryLabel: "I do not want to continue",
    channelsHeading: "Report harassment or bullying",
  },
  th: {
    title: "แจ้งการคุกคามหรือการกลั่นแกล้ง",
    intro:
      "หากเกิดเหตุการณ์ใดก็ตาม ไม่ว่าจะมาจากนักศึกษาคนอื่น เจ้าหน้าที่ หรือบุคคลภายนอก ที่ทำให้คุณรู้สึกไม่ปลอดภัย ไม่สบายใจ หรือถูกล่วงละเมิด คุณมีสิทธิ์ที่จะแจ้งเรื่องนี้",
    boundaryLead: "ก่อนไปต่อ ควรทราบก่อนว่าสองช่องทางนี้คืออะไร",
    boundaryBody:
      "สำนักงานหลักสูตร BIR และกรรมการฝ่ายพิทักษ์สิทธิ์และสวัสดิการของ BIRSA เป็นช่องทางแจ้งเรื่องของ BIRSA เอง ไม่ใช่ตำรวจและไม่ใช่ศาล คุณไม่จำเป็นต้องมีหลักฐานครบถ้วนหรือเรียบเรียงเหตุการณ์ให้เป็นระบบก่อนขอคำแนะนำ และสามารถพูดคุยกับกรรมการ BIRSA ที่ไว้ใจได้ก่อนก็ได้ถ้าจะทำให้สบายใจกว่า การแจ้งเรื่องผ่านช่องทางนี้ไม่ได้แทนที่การโทรแจ้งตำรวจ (191) ในสถานการณ์ฉุกเฉิน และไม่ได้แทนที่กระบวนการทางวินัยอย่างเป็นทางการของมหาวิทยาลัย หากคุณเลือกใช้ช่องทางนั้นแทนหรือควบคู่กันไป",
    continueLabel: "ดูวิธีแจ้งเรื่อง",
    secondaryLabel: "ฉันไม่ต้องการไปต่อ",
    channelsHeading: "แจ้งการคุกคามหรือการกลั่นแกล้ง",
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
  return buildMetadata({ locale, title: t.title, description: t.intro, path: "/help/reporting" });
}

export default async function ReportingPage({
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
    <>
      <ExitThisPage
        exitHref={EXIT_HREF}
        historyDecoyHref={localeHref(locale, "/")}
        label={dict.exitThisPage.label}
        shortcutHint={dict.exitThisPage.shortcutHint}
        leavingAnnouncement={dict.exitThisPage.leavingAnnouncement}
      />
      <Wrap className="py-10">
        <Stack gap="2xl" className="max-w-[var(--measure)]">
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: dict.hub.title, href: "/help" },
              { label: t.title },
            ]}
          />

          <InterruptionPage
            heading={t.title}
            intro={t.intro}
            continueHref="#channels"
            continueLabel={t.continueLabel}
            secondaryHref={localeHref(locale, "/")}
            secondaryLabel={t.secondaryLabel}
          >
            <Stack gap="sm">
              <Text step="body" className="font-semibold text-ink">
                {t.boundaryLead}
              </Text>
              <Text step="body">{t.boundaryBody}</Text>
            </Stack>
          </InterruptionPage>

          <div id="channels">
            <ReportingChannels locale={locale} headingLevel={2} />
          </div>
        </Stack>
      </Wrap>
    </>
  );
}
