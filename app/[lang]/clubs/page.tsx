import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ClubsExplorer from "@/components/clubs/ClubsExplorer";
import { getClubEntries } from "@/lib/content";
import type { ClubSummary } from "@/content/clubs/clubs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ชมรม" : "Clubs";
  const description =
    locale === "th"
      ? "สำรวจชมรมนักศึกษา BIR ค้นหาสิ่งที่ใช่ หรือเริ่มชมรมของคุณเอง"
      : "Explore BIR student clubs, find one that fits, or start your own.";

  return buildMetadata({ locale, title, description, path: "/clubs" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    startTitle: string;
    startBody: string;
    startCta: string;
  }
> = {
  en: {
    title: "Clubs",
    lede: "Clubs are groups of BIR students with a shared interest, such as sport, music, volunteering, gaming, writing, or a model parliament. Anyone can join one, and anyone can start a new one.",
    startTitle: "Start a new club",
    startBody:
      "If a handful of you share an interest that is not covered yet, BIRSA can help you set up a new club.",
    startCta: "Start a club",
  },
  th: {
    title: "ชมรม",
    lede: "ชมรมคือกลุ่มนักศึกษา BIR ที่มีความสนใจร่วมกัน ไม่ว่าจะเป็นกีฬา ดนตรี งานอาสา เกม งานเขียน หรือการจำลองการประชุมรัฐสภา ใครก็เข้าร่วมได้ และใครก็เริ่มชมรมใหม่ได้",
    startTitle: "การตั้งชมรมใหม่",
    startBody:
      "ถ้าคุณและเพื่อน ๆ มีความสนใจร่วมกันที่ยังไม่มีชมรมรองรับ BIRSA ช่วยตั้งชมรมใหม่ให้ได้",
    startCta: "เริ่มชมรมใหม่",
  },
};

export default async function ClubsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  // Only the card fields cross into the client explorer; MDX bodies stay here.
  const clubs: ClubSummary[] = getClubEntries(locale).map((entry) => ({
    slug: entry.slug,
    title: entry.frontmatter.title,
    tagline: entry.frontmatter.tagline,
    category: entry.frontmatter.category,
    joinOpen: entry.frontmatter.joinOpen,
  }));

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
      <div className="wrap flex flex-col gap-8 py-10">
        <ClubsExplorer
          clubs={clubs}
          locale={locale}
          dict={{
            search: dict.actions.search,
            searchPlaceholder: dict.actions.searchPlaceholder,
            category: dict.actions.category,
            allCategories: dict.actions.allCategories,
            showing: dict.actions.showing,
            result: dict.actions.result,
            results: dict.actions.results,
            noResults: dict.actions.noResults,
            clearFilters: dict.actions.clearFilters,
            openToJoin: locale === "th" ? "รับสมาชิกอยู่" : "Open to join",
          }}
        />

        <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-sunken p-8">
          <h2 className="font-display text-2xl">{t.startTitle}</h2>
          <p className="max-w-[var(--measure)] text-muted">{t.startBody}</p>
          <Button href={localeHref(locale, "/clubs/start")}>{t.startCta}</Button>
        </div>
      </div>
    </>
  );
}
