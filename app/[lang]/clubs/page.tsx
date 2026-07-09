import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Button from "@/components/Button";
import ClubsExplorer from "@/components/clubs/ClubsExplorer";
import { clubs } from "@/content/clubs/clubs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title =
    locale === "th" ? "ชมรม" : "Clubs";
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
    placeholderNotice: string;
    startTitle: string;
    startBody: string;
    startCta: string;
  }
> = {
  en: {
    title: "Clubs",
    lede: "Clubs are small groups of BIR students who share an interest, such as sport, debate, film, volunteering and more. Anyone can join one, and anyone can start a new one.",
    placeholderNotice:
      "The clubs listed below are examples: BIRSA will replace them with the real, current club list.",
    startTitle: "Don't see your thing? Start a club.",
    startBody:
      "If a handful of you share an interest that isn't covered yet, BIRSA can help you set up a new club. It's a simpler process than you'd think.",
    startCta: "Start a club",
  },
  th: {
    title: "ชมรม",
    lede: "ชมรมคือกลุ่มนักศึกษา BIR ที่มีความสนใจร่วมกัน ไม่ว่าจะเป็นกีฬา โต้วาที ภาพยนตร์ งานอาสา และอื่น ๆ ใครก็เข้าร่วมได้ และใครก็เริ่มชมรมใหม่ได้เช่นกัน",
    placeholderNotice:
      "รายชื่อชมรมด้านล่างเป็นตัวอย่าง BIRSA จะแทนที่ด้วยรายชื่อชมรมจริงที่ใช้งานอยู่",
    startTitle: "ยังไม่มีชมรมที่ใช่? เริ่มชมรมของคุณเองได้",
    startBody:
      "ถ้าคุณและเพื่อน ๆ มีความสนใจร่วมกันที่ยังไม่มีชมรมรองรับ BIRSA ช่วยตั้งชมรมใหม่ให้ได้ ขั้นตอนง่ายกว่าที่คิด",
    startCta: "เริ่มชมรมใหม่",
  },
};

export default async function ClubsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

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
        <Notice variant="placeholder">{t.placeholderNotice}</Notice>

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

        <div className="border-line bg-sunken flex flex-col items-start gap-4 rounded-lg border p-8">
          <h2 className="font-display text-2xl">{t.startTitle}</h2>
          <p className="text-muted max-w-[var(--measure)]">{t.startBody}</p>
          <Button href={localeHref(locale, "/clubs/start")}>{t.startCta}</Button>
        </div>
      </div>
    </>
  );
}
