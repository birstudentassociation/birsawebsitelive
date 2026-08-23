import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import ExitThisPage from "@/components/bds/ExitThisPage";
import InterruptionPage from "@/components/bds/InterruptionPage";
import WarningText from "@/components/bds/WarningText";
import SignpostSource from "@/components/help/SignpostSource";
import { Heading, Text } from "@/components/bds/Type";
import { Wrap, Stack } from "@/components/bds/Layout";

/**
 * `/help/welfare` (ROUTE-MAP-2.0 Wave 5C, SCOPE-AUDIT-2.0 §3.2 SIGNPOST row
 * `home/health-and-wellbeing.mdx`).
 *
 * A genuine §3.6 signpost, not a restatement of the source: the counselling
 * routes, hours and phone numbers already live in full on
 * `/help/university-services` (ported from `/services/university-services`,
 * itself the disposition the audit already approved for that content).
 * Repeating them here would be the exact drift the audit found live twice
 * (`docs/SCOPE-AUDIT-2.0.md` §4). This page instead says what BIRSA itself
 * offers, names TU Well Being as the body that actually runs counselling,
 * and points at the one page on this site that already carries the detail.
 *
 * No `HelpPageShell`/`PageHeader`: see the matching note on
 * `/help/reporting`, this route's sibling in the route map. Same reasoning
 * applies here: `InterruptionPage` owns the page's one `<h1>`.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const EXIT_HREF = "https://www.google.com";

const copy = {
  en: {
    title: "Welfare and wellbeing",
    intro:
      "What BIRSA can do if something is affecting your wellbeing, and where Thammasat's own wellbeing service takes over.",
    boundaryLead: "What BIRSA can and cannot do here.",
    boundaryBody:
      "A BIRSA committee member can listen to what you're going through and point you to the right service. BIRSA is a student association, not a clinic: it cannot diagnose, prescribe, or provide counselling itself. If what is affecting you is harassment or bullying, BIRSA's own reporting channels can act on that directly.",
    continueLabel: "See BIRSA's role and where to get support",
    secondaryLabel: "I do not want to continue",
    supportHeading: "What BIRSA offers",
    supportBody:
      "Talking to a BIRSA committee member is a low pressure first step if you are not sure where else to start, and BIRSA runs events and channels that are a way to stay socially connected during a difficult stretch. If what's affecting your wellbeing is harassment or bullying, use BIRSA's reporting channels rather than only how to cope with it.",
    reportingCta: "Report harassment or bullying",
    signpostName: "Thammasat Well Being Center",
    signpostBody:
      "TU Well Being runs the university's counselling service for every Thammasat student, and decides what it offers and how appointments work. It is the office that actually provides clinical and counselling support, which BIRSA does not.",
    signpostLinkLabel: "About the Well Being Center",
    detailNote:
      "For the full list of counselling routes at Tha Prachan, opening hours and phone numbers, see University services.",
    detailCta: "University services",
    emergencyLabel: "In a crisis",
    emergencyBody: "call 1669 for medical emergencies or 191 for police, without delay.",
  },
  th: {
    title: "สวัสดิการและสุขภาพใจ",
    intro:
      "สิ่งที่ BIRSA ช่วยได้เมื่อมีเรื่องกระทบสุขภาพใจของคุณ และจุดที่บริการดูแลสุขภาวะของธรรมศาสตร์เป็นผู้ดูแลต่อ",
    boundaryLead: "สิ่งที่ BIRSA ทำได้และทำไม่ได้ในเรื่องนี้",
    boundaryBody:
      "กรรมการ BIRSA รับฟังสิ่งที่คุณกำลังเผชิญและช่วยชี้ไปยังบริการที่เหมาะสมได้ แต่ BIRSA เป็นองค์กรนักศึกษา ไม่ใช่คลินิก จึงไม่สามารถวินิจฉัย จ่ายยา หรือให้การปรึกษาทางจิตวิทยาเองได้ หากสิ่งที่กระทบสุขภาพใจของคุณคือการคุกคามหรือการกลั่นแกล้ง ช่องทางแจ้งเรื่องของ BIRSA ดำเนินการเรื่องนั้นได้โดยตรง",
    continueLabel: "ดูบทบาทของ BIRSA และจุดขอความช่วยเหลือ",
    secondaryLabel: "ฉันไม่ต้องการไปต่อ",
    supportHeading: "สิ่งที่ BIRSA ช่วยได้",
    supportBody:
      "การพูดคุยกับกรรมการ BIRSA เป็นก้าวแรกที่ไม่กดดัน หากยังไม่แน่ใจว่าจะเริ่มจากตรงไหน และ BIRSA จัดกิจกรรมและช่องทางต่าง ๆ ที่ช่วยให้คุณยังเชื่อมต่อกับเพื่อนได้ในช่วงเวลาที่ยากลำบาก หากสิ่งที่กระทบสุขภาพใจของคุณคือการคุกคามหรือการกลั่นแกล้ง ให้ใช้ช่องทางแจ้งเรื่องของ BIRSA แทนการรับมือด้วยตัวเองเพียงอย่างเดียว",
    reportingCta: "แจ้งการคุกคามหรือการกลั่นแกล้ง",
    signpostName: "ศูนย์สุขภาวะธรรมศาสตร์ (TU Well Being Center)",
    signpostBody:
      "TU Well Being เป็นผู้ดูแลบริการให้คำปรึกษาของมหาวิทยาลัยสำหรับนักศึกษาธรรมศาสตร์ทุกคน และเป็นผู้กำหนดว่าจะให้บริการอะไรและนัดหมายอย่างไร เป็นหน่วยงานที่ให้การดูแลทางคลินิกและการปรึกษาจริง ซึ่ง BIRSA ไม่ได้เป็นผู้ให้บริการส่วนนี้",
    signpostLinkLabel: "ข้อมูลศูนย์สุขภาวะ",
    detailNote:
      "ดูรายการช่องทางให้คำปรึกษาที่ท่าพระจันทร์ เวลาทำการ และเบอร์โทรฉบับเต็มได้ที่บริการจากมหาวิทยาลัย",
    detailCta: "บริการจากมหาวิทยาลัย",
    emergencyLabel: "ในสถานการณ์วิกฤต",
    emergencyBody: "โทร 1669 สำหรับเหตุฉุกเฉินทางการแพทย์ หรือ 191 สำหรับตำรวจ โดยไม่ชักช้า",
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
  return buildMetadata({ locale, title: t.title, description: t.intro, path: "/help/welfare" });
}

export default async function WelfarePage({
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
            continueHref="#support"
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

          <Stack gap="lg" id="support">
            <Stack gap="sm">
              <Heading level={2}>{t.supportHeading}</Heading>
              <Text step="body">{t.supportBody}</Text>
              <div>
                <a
                  href={localeHref(locale, "/help/reporting")}
                  className="focus-halo font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
                >
                  <Text as="span" step="body">
                    {t.reportingCta}
                  </Text>
                </a>
              </div>
            </Stack>

            <SignpostSource
              locale={locale}
              name={t.signpostName}
              body={t.signpostBody}
              href="https://www.facebook.com/permalink.php?story_fbid=1139583574836463&id=100063544931301&locale=th_TH"
              linkLabel={t.signpostLinkLabel}
            />

            <Stack gap="xs">
              <Text step="body">{t.detailNote}</Text>
              <div>
                <a
                  href={localeHref(locale, "/help/university-services")}
                  className="focus-halo font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
                >
                  <Text as="span" step="body">
                    {t.detailCta}
                  </Text>
                </a>
              </div>
            </Stack>

            <WarningText label={t.emergencyLabel}>{t.emergencyBody}</WarningText>
          </Stack>
        </Stack>
      </Wrap>
    </>
  );
}
