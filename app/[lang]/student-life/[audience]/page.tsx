import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, locales, type Locale } from "@/lib/i18n";
import { getGuides, type GuideAudience } from "@/lib/content-payload";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";

const audiences: GuideAudience[] = ["home", "international"];

function isAudience(x: string): x is GuideAudience {
  return audiences.includes(x as GuideAudience);
}

export function generateStaticParams() {
  return locales.flatMap((lang) => audiences.map((audience) => ({ lang, audience })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; audience: string }>;
}): Promise<Metadata> {
  const { lang, audience } = await params;
  if (!isLocale(lang) || !isAudience(audience)) return {};
  const locale: Locale = lang;
  const t = copy[locale].tracks[audience];

  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: `/student-life/${audience}`,
  });
}

const copy: Record<
  Locale,
  {
    studentLife: string;
    updated: string;
    tracks: Record<GuideAudience, { title: string; lede: string }>;
  }
> = {
  en: {
    studentLife: "Information & services",
    updated: "Updated",
    tracks: {
      home: {
        title: "Student life & culture guides",
        lede: "Practical, everyday guidance for all BIR students, plus course reviews and the kind of non-obvious, culturally-enriching knowledge you only pick up from someone who's already been through it. Pick a topic below to get started.",
      },
      international: {
        title: "For international students",
        lede: "Everything you need for your first weeks and beyond in Bangkok. A condensed Thai-language version of each section is also available, written for Thai buddies and staff who support international students.",
      },
    },
  },
  th: {
    studentLife: "ข้อมูลและบริการ",
    updated: "อัปเดตล่าสุด",
    tracks: {
      home: {
        title: "คู่มือชีวิตนักศึกษาและวัฒนธรรม",
        lede: "คำแนะนำที่ใช้ได้จริงในชีวิตประจำวันสำหรับนักศึกษา BIR ทุกคน พร้อมรีวิวรายวิชาและเกร็ดความรู้ด้านวัฒนธรรมที่ไม่ค่อยมีใครพูดถึง เลือกหัวข้อด้านล่างเพื่อเริ่มอ่าน",
      },
      international: {
        title: "สำหรับนักศึกษาต่างชาติ",
        lede: "หน้านี้เป็นเวอร์ชันสรุปย่อของคู่มือสำหรับนักศึกษาต่างชาติ เขียนไว้ให้เพื่อนบัดดี้ไทยและเจ้าหน้าที่ที่ช่วยดูแลนักศึกษาต่างชาติเข้าใจภาพรวม เนื้อหาฉบับเต็มอยู่ในเวอร์ชันภาษาอังกฤษ",
      },
    },
  },
};

export default async function StudentLifeTrackPage({
  params,
}: {
  params: Promise<{ lang: string; audience: string }>;
}) {
  const { lang, audience } = await params;
  if (!isLocale(lang) || !isAudience(audience)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const track = t.tracks[audience];

  const entries = await getGuides(locale, audience);

  return (
    <>
      <PageHeader
        title={track.title}
        lede={track.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.studentLife, href: "/information-services" },
              { label: track.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const href = localeHref(locale, `/student-life/${audience}/${entry.slug}`);
            return (
              <Card key={entry.slug} href={href}>
                <CardTitle href={href}>{entry.frontmatter.title}</CardTitle>
                <p className="text-muted text-sm leading-relaxed">{entry.frontmatter.summary}</p>
                <p className="text-muted mt-auto text-xs">
                  {t.updated}: {formatDate(locale, entry.frontmatter.updated)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
