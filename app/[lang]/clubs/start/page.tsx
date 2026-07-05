import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StartClubForm from "@/components/forms/StartClubForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "เริ่มชมรมใหม่" : "Start a club";
  const description =
    locale === "th"
      ? "ขั้นตอนง่าย ๆ ในการเริ่มชมรมนักศึกษาใหม่กับ BIRSA"
      : "The simple steps to start a new student club with BIRSA.";

  return buildMetadata({ locale, title, description, path: "/clubs/start" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    clubs: string;
    stepsTitle: string;
    steps: string[];
    formTitle: string;
  }
> = {
  en: {
    title: "Start a club",
    lede: "If a few of you share an interest that isn't covered by an existing club, BIRSA can help you get a new one off the ground.",
    clubs: "Clubs",
    stepsTitle: "How it works",
    steps: [
      "Tell BIRSA your idea. Fill in the form below with what the club would do and who it's for — you don't need a full plan yet.",
      "Talk it through with the committee. A BIRSA committee member will get in touch to help you shape the idea and figure out what support you need (a room, a small budget, promotion).",
      "Start meeting. Once the basics are sorted, you're free to run your first session — BIRSA can help spread the word to other students.",
    ],
    formTitle: "Tell us your idea",
  },
  th: {
    title: "เริ่มชมรมใหม่",
    lede: "ถ้าคุณและเพื่อน ๆ มีความสนใจร่วมกันที่ยังไม่มีชมรมไหนรองรับ BIRSA ช่วยให้ชมรมใหม่ของคุณเกิดขึ้นจริงได้",
    clubs: "ชมรม",
    stepsTitle: "ขั้นตอนการเริ่มชมรม",
    steps: [
      "บอกไอเดียของคุณกับ BIRSA กรอกแบบฟอร์มด้านล่างว่าชมรมนี้จะทำอะไรและเหมาะกับใคร ยังไม่ต้องมีแผนที่สมบูรณ์แบบก็ได้",
      "คุยรายละเอียดกับกรรมการ กรรมการ BIRSA จะติดต่อกลับเพื่อช่วยปรับไอเดียให้ชัดเจน และดูว่าต้องการการสนับสนุนอะไรบ้าง เช่น ห้องประชุม งบประมาณเล็กน้อย หรือการประชาสัมพันธ์",
      "เริ่มนัดพบกันได้เลย เมื่อเรื่องพื้นฐานเรียบร้อย คุณก็จัดกิจกรรมแรกของชมรมได้ทันที BIRSA ช่วยกระจายข่าวให้เพื่อนนักศึกษาคนอื่น ๆ รู้จักด้วย",
    ],
    formTitle: "บอกไอเดียของคุณ",
  },
};

export default async function StartClubPage({ params }: { params: Promise<{ lang: string }> }) {
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
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.clubs, href: "/clubs" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-2xl">{t.stepsTitle}</h2>
          <ol className="text-muted mt-4 flex flex-col gap-4 text-sm leading-relaxed">
            {t.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="bg-brand-tint text-brand-deep flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="font-display text-2xl">{t.formTitle}</h2>
          <div className="mt-4">
            <StartClubForm locale={locale} dict={dict} />
          </div>
        </div>
      </div>
    </>
  );
}
