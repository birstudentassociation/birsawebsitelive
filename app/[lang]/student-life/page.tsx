import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getGuideEntries, type GuideAudience } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "ชีวิตนักศึกษา" : "Student life";
  const description =
    locale === "th"
      ? "คู่มือใช้ชีวิตนอกห้องเรียนที่ BIR เขียนโดยรุ่นพี่นักศึกษา ครอบคลุมทั้งนักศึกษาไทยและนักศึกษาต่างชาติ"
      : "A plain-language guide to life outside the classroom at BIR, written by students — for home and international students.";

  return buildMetadata({ locale, title, description, path: "/student-life" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    tracks: Record<
      GuideAudience,
      { title: string; description: string; topicsLabel: string; cta: string }
    >;
    howToUseTitle: string;
    howToUseBody: string;
    reportGaps: string;
  }
> = {
  en: {
    title: "Student life",
    lede: "A plain-language guide to life outside the classroom at BIR — written by students, for students. Pick the track that matches you to get started.",
    tracks: {
      home: {
        title: "For home students",
        description:
          "Practical, everyday guidance for Thai students at BIR — getting around Tha Prachan, budgeting, staying healthy and safe, and finding ways to get involved.",
        topicsLabel: "Top topics",
        cta: "Explore the home student guide",
      },
      international: {
        title: "For international students",
        description:
          "Everything you need for your first weeks and beyond in Bangkok — arrival, visas, banking, phones, healthcare, and everyday culture and language.",
        topicsLabel: "Top topics",
        cta: "Explore the international student guide",
      },
    },
    howToUseTitle: "How to use this guide",
    howToUseBody:
      "This guide is built to work well with screen readers and keyboard navigation, and every section stands on its own — you don't need to read start to finish. If you spot something missing, out of date, or wrong, please tell BIRSA.",
    reportGaps: "Report a gap",
  },
  th: {
    title: "ชีวิตนักศึกษา",
    lede: "คู่มือใช้ชีวิตนอกห้องเรียนที่ BIR เขียนโดยนักศึกษา เพื่อนักศึกษาด้วยกัน เลือกเส้นทางที่ตรงกับคุณเพื่อเริ่มอ่านได้เลย",
    tracks: {
      home: {
        title: "สำหรับนักศึกษาไทย",
        description:
          "คำแนะนำที่ใช้ได้จริงในชีวิตประจำวันของนักศึกษาไทยที่ BIR ทั้งการเดินทางแถวท่าพระจันทร์ การจัดการเงิน การดูแลสุขภาพและความปลอดภัย ไปจนถึงการเข้าร่วมกิจกรรมต่าง ๆ",
        topicsLabel: "หัวข้อยอดนิยม",
        cta: "ดูคู่มือสำหรับนักศึกษาไทย",
      },
      international: {
        title: "สำหรับนักศึกษาต่างชาติ",
        description:
          "ทุกอย่างที่ต้องรู้ตั้งแต่สัปดาห์แรกในกรุงเทพฯ ไปจนถึงการใช้ชีวิตระยะยาว ทั้งการเดินทางมาถึง วีซ่า บัญชีธนาคาร มือถือ การรักษาพยาบาล และวัฒนธรรมในชีวิตประจำวัน",
        topicsLabel: "หัวข้อยอดนิยม",
        cta: "ดูคู่มือสำหรับนักศึกษาต่างชาติ",
      },
    },
    howToUseTitle: "วิธีใช้คู่มือนี้",
    howToUseBody:
      "คู่มือนี้ออกแบบมาให้ใช้งานได้ดีกับโปรแกรมอ่านหน้าจอและการกดคีย์บอร์ด แต่ละหัวข้ออ่านแยกกันได้ ไม่จำเป็นต้องอ่านตามลำดับ ถ้าคุณพบว่ามีข้อมูลตกหล่น ล้าสมัย หรือผิดพลาด บอก BIRSA ได้เลย",
    reportGaps: "แจ้งข้อมูลที่ขาดหาย",
  },
};

const audiences: GuideAudience[] = ["home", "international"];

export default async function StudentLifePage({
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {audiences.map((audience) => {
            const track = t.tracks[audience];
            const href = localeHref(locale, `/student-life/${audience}`);
            const topics = getGuideEntries(locale, audience).slice(0, 4);
            return (
              <Card key={audience} href={href} className="gap-4 p-6">
                <CardTitle href={href} as="h2" className="text-2xl">
                  {track.title}
                </CardTitle>
                <p className="text-muted leading-relaxed">{track.description}</p>
                {topics.length > 0 ? (
                  <div className="mt-1">
                    <p className="text-ink text-sm font-semibold">{track.topicsLabel}</p>
                    <ul className="text-muted mt-1 flex flex-col gap-1 text-sm">
                      {topics.map((entry) => (
                        <li key={entry.slug}>{entry.frontmatter.title}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>

        <section className="border-line bg-sunken flex flex-col gap-3 rounded-lg border p-8">
          <h2 className="font-display text-2xl">{t.howToUseTitle}</h2>
          <p className="text-muted max-w-[var(--measure)]">
            {t.howToUseBody}{" "}
            <a
              href={localeHref(locale, "/contact")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.reportGaps}
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
