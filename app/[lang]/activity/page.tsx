import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import NavList, { NavListItem } from "@/components/NavList";
import GridRow, { GridMain } from "@/components/GridRow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/activity" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    aboutHeading: string;
    rolesTitle: string;
    rolesSummary: string;
    eventsHeading: string;
    governanceHeading: string;
    regsTitle: string;
    regsSummary: string;
    connectHeading: string;
    newsTitle: string;
    newsSummary: string;
  }
> = {
  en: {
    title: "BIRSA activity",
    lede: "What BIRSA is, how it's run, and how to reach us: officer roles, student regulations, transparency documents, the BIR programme, contact details, and the latest news and events.",
    aboutHeading: "About BIRSA",
    rolesTitle: "Current officers",
    rolesSummary: "Who sits on the BIRSA committee, and what each role is responsible for.",
    eventsHeading: "Events and getting involved",
    governanceHeading: "Governance and transparency",
    regsTitle: "Student regulations and rules",
    regsSummary: "The University's regulations that apply to us.",
    connectHeading: "Connect",
    newsTitle: "News",
    newsSummary: "BIRSA's latest news and upcoming events.",
  },
  th: {
    title: "การดำเนินงานของ BIRSA",
    lede: "BIRSA คือใคร ดำเนินงานอย่างไร และติดต่อได้ที่ไหน ตั้งแต่บทบาทหน้าที่ของกรรมการ ระเบียบนักศึกษา เอกสารความโปร่งใส หลักสูตร BIR ช่องทางติดต่อ ไปจนถึงข่าวสารกิจกรรมล่าสุด",
    aboutHeading: "เกี่ยวกับ BIRSA",
    rolesTitle: "คณะกรรมการชุดปัจจุบัน",
    rolesSummary: "ใครอยู่ในคณะกรรมการ BIRSA บ้าง และแต่ละตำแหน่งรับผิดชอบเรื่องอะไร",
    eventsHeading: "กิจกรรมและการมีส่วนร่วม",
    governanceHeading: "การกำกับดูแลและความโปร่งใส",
    regsTitle: "ระเบียบและข้อบังคับนักศึกษา",
    regsSummary: "บรรดาข้อบังคับมหาวิทยาลัยที่เกี่ยวข้องกับเรา",
    connectHeading: "ช่องทางติดต่อ",
    newsTitle: "ข่าวและกิจกรรม",
    newsSummary: "ข่าวสารล่าสุดและกิจกรรมที่กำลังจะมาถึงของ BIRSA",
  },
};

export default async function ActivityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const entries = getEntries("activity", locale);
  const findEntry = (slug: string) => entries.find((entry) => entry.slug === slug);

  const entryItem = (entry: (typeof entries)[number]) => {
    const href = localeHref(locale, `/activity/${entry.slug}`);
    return (
      <NavListItem key={entry.slug} href={href} title={entry.frontmatter.title}>
        {entry.frontmatter.summary}
      </NavListItem>
    );
  };

  const birsaEntry = findEntry("birsa");
  const thisYearEntry = findEntry("this-year");
  const programmeEntry = findEntry("bir-programme");
  const eventsEntry = findEntry("events");
  const studentBodiesEntry = findEntry("student-bodies");
  const transparencyEntry = findEntry("transparency");
  const contactEntry = findEntry("contact");

  const rolesHref = localeHref(locale, "/activity/roles");
  const regsHref = localeHref(locale, "/activity/regulations");
  const newsHref = localeHref(locale, "/news");

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <section className="flex flex-col gap-4">
          <GridRow>
            <GridMain className="flex flex-col gap-4">
              <h2 className="font-display text-2xl">{t.aboutHeading}</h2>
              <NavList>
                {birsaEntry ? entryItem(birsaEntry) : null}

                {thisYearEntry ? entryItem(thisYearEntry) : null}

                <NavListItem href={rolesHref} title={t.rolesTitle}>
                  {t.rolesSummary}
                </NavListItem>

                {programmeEntry ? entryItem(programmeEntry) : null}
              </NavList>
            </GridMain>
          </GridRow>
        </section>

        <section className="flex flex-col gap-4">
          <GridRow>
            <GridMain className="flex flex-col gap-4">
              <h2 className="font-display text-2xl">{t.eventsHeading}</h2>
              <NavList>
                {eventsEntry ? entryItem(eventsEntry) : null}

                {studentBodiesEntry ? entryItem(studentBodiesEntry) : null}
              </NavList>
            </GridMain>
          </GridRow>
        </section>

        <section className="flex flex-col gap-4">
          <GridRow>
            <GridMain className="flex flex-col gap-4">
              <h2 className="font-display text-2xl">{t.governanceHeading}</h2>
              <NavList>
                <NavListItem href={regsHref} title={t.regsTitle}>
                  {t.regsSummary}
                </NavListItem>

                {transparencyEntry ? entryItem(transparencyEntry) : null}
              </NavList>
            </GridMain>
          </GridRow>
        </section>

        <section className="flex flex-col gap-4">
          <GridRow>
            <GridMain className="flex flex-col gap-4">
              <h2 className="font-display text-2xl">{t.connectHeading}</h2>
              <NavList>
                {contactEntry ? entryItem(contactEntry) : null}

                <NavListItem href={newsHref} title={t.newsTitle}>
                  {t.newsSummary}
                </NavListItem>
              </NavList>
            </GridMain>
          </GridRow>
        </section>
      </div>
    </>
  );
}
