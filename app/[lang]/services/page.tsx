import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getGuideEntries } from "@/lib/content";
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

  const title = locale === "th" ? "ข้อมูลและบริการ" : "Information and services";
  const description =
    locale === "th"
      ? "บริการยืมอุปกรณ์ของ BIRSA รีวิวรายวิชา และคู่มือใช้ชีวิตนอกห้องเรียนที่ BIR เขียนโดยรุ่นพี่นักศึกษา สำหรับนักศึกษาทุกคน พร้อมข้อมูลเฉพาะสำหรับนักศึกษาต่างชาติ"
      : "BIRSA's equipment loan service, course reviews, and plain-language guides to life outside the classroom at BIR, written by students, for everyone at BIR, plus dedicated logistics guidance for international students.";

  return buildMetadata({ locale, title, description, path: "/services" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    getAnswer: { eyebrow: string; title: string; description: string; cta: string };
    equipmentLoan: { eyebrow: string; title: string; description: string; cta: string };
    directoryLinkLine: string;
    directoryLinkCta: string;
    universityServices: { eyebrow: string; title: string; description: string; cta: string };
    servicesHeading: string;
    informationHeading: string;
    informationLede: string;
    studentLifeIndexLine: string;
    studentLifeIndexCta: string;
    courseReviews: { eyebrow: string; title: string; description: string; cta: string };
    guides: { title: string; description: string; topicsLabel: string; cta: string };
    international: {
      eyebrow: string;
      title: string;
      description: string;
      topicsLabel: string;
      cta: string;
    };
    handbook: {
      eyebrow: string;
      title: string;
      description: string;
      topicsLabel: string;
      cta: string;
    };
    howToUseTitle: string;
    howToUseBody: string;
    reportGaps: string;
  }
> = {
  en: {
    title: "Information and services",
    lede: "Borrow equipment, read course reviews and student-life guides written by students, or get logistics guidance if you're new to Bangkok.",
    getAnswer: {
      eyebrow: "Service",
      title: "Get an answer",
      description:
        "Answer a few questions and get the part of the rules, the handbook or the service that applies to you, with the provision it comes from.",
      cta: "Get an answer",
    },
    equipmentLoan: {
      eyebrow: "Service",
      title: "Equipment Loan Service",
      description:
        "Borrow BIRSA equipment such as the first-aid kit for your event or everyday need.",
      cta: "Request equipment",
    },
    directoryLinkLine: "Looking for equipment owned by a club instead of BIRSA?",
    directoryLinkCta: "See the club equipment directory",
    universityServices: {
      eyebrow: "From the University",
      title: "University services",
      description:
        "Accident insurance, military-service postponement, certificates, counselling, and IT help: the University's services for students, in one place.",
      cta: "See University services",
    },
    servicesHeading: "Services",
    informationHeading: "Information",
    informationLede:
      "Course reviews, plus practical guides, cultural notes, and other student-life knowledge that does not fit in a syllabus.",
    studentLifeIndexLine: "Want everything in one list?",
    studentLifeIndexCta: "See the student life index",
    courseReviews: {
      eyebrow: "New",
      title: "Course reviews",
      description:
        "Honest, student-written notes on BIR courses and electives: workload, assessment style, and what to expect before you register.",
      cta: "See what's coming",
    },
    guides: {
      title: "Student life and culture guides",
      description:
        "Guidance for all BIR students on getting around Tha Prachan, budgeting, health and safety, culture, and getting involved.",
      topicsLabel: "Top topics",
      cta: "Explore the guides",
    },
    international: {
      eyebrow: "For international students",
      title: "Arriving in Bangkok",
      description:
        "Arrival, visas, banking, phones, healthcare, and everyday culture and language: everything for your first weeks and beyond.",
      topicsLabel: "Top topics",
      cta: "Explore the international student guide",
    },
    handbook: {
      eyebrow: "Reference",
      title: "Student handbook",
      description:
        "The BIR handbook: admission and fees, the curriculum and 2023 revised study plan, academic rules, the internship, and academic activities.",
      topicsLabel: "In this handbook",
      cta: "Read the student handbook",
    },
    howToUseTitle: "Report a problem with this page",
    howToUseBody: "If you spot something missing, out of date, or wrong, tell BIRSA.",
    reportGaps: "Report a gap",
  },
  th: {
    title: "ข้อมูลและบริการ",
    lede: "ยืมอุปกรณ์ อ่านรีวิวรายวิชาและคู่มือชีวิตนักศึกษาที่เขียนโดยรุ่นพี่ หรือดูข้อมูลที่จำเป็นสำหรับการเริ่มต้นชีวิตในกรุงเทพฯ สำหรับนักศึกษาต่างชาติ",
    getAnswer: {
      eyebrow: "บริการ",
      title: "ค้นหาคำตอบ",
      description:
        "ตอบคำถามไม่กี่ข้อ แล้วดูว่ากฎระเบียบ คู่มือนักศึกษา หรือบริการส่วนไหนที่ใช้กับกรณีของคุณ พร้อมข้ออ้างอิงที่มา",
      cta: "ค้นหาคำตอบ",
    },
    equipmentLoan: {
      eyebrow: "บริการ",
      title: "บริการยืมอุปกรณ์",
      description:
        "ยืมอุปกรณ์ของ BIRSA เช่น ชุดปฐมพยาบาล สำหรับกิจกรรมหรือความจำเป็นในชีวิตประจำวัน",
      cta: "ขอยืมอุปกรณ์",
    },
    directoryLinkLine: "ตามหาอุปกรณ์ที่เป็นของชมรมแทน BIRSA อยู่หรือเปล่า",
    directoryLinkCta: "ดูทำเนียบอุปกรณ์ของชมรม",
    universityServices: {
      eyebrow: "จากมหาวิทยาลัย",
      title: "บริการจากมหาวิทยาลัย",
      description:
        "ประกันอุบัติเหตุ การผ่อนผันเกณฑ์ทหาร การขอเอกสาร บริการให้คำปรึกษา และความช่วยเหลือด้านไอที รวมบริการของมหาวิทยาลัยสำหรับนักศึกษาไว้ในที่เดียว",
      cta: "ดูบริการจากมหาวิทยาลัย",
    },
    servicesHeading: "บริการ",
    informationHeading: "ข้อมูล",
    informationLede:
      "รีวิวรายวิชา และความรู้ชีวิตนักศึกษาที่ไม่มีสอนในซิลลาบัส ทั้งคู่มือใช้งานจริง มุมมองด้านวัฒนธรรม และสิ่งที่รุ่นพี่อยากรู้ตั้งแต่เนิ่น ๆ",
    studentLifeIndexLine: "อยากดูรวมทุกอย่างในที่เดียวไหม",
    studentLifeIndexCta: "ไปที่หน้ารวมชีวิตนักศึกษา",
    courseReviews: {
      eyebrow: "ใหม่",
      title: "รีวิวรายวิชา",
      description:
        "บันทึกตรงไปตรงมาจากนักศึกษาเกี่ยวกับรายวิชาและวิชาเลือกของ BIR ทั้งปริมาณงาน รูปแบบการวัดผล และสิ่งที่ควรรู้ก่อนลงทะเบียน",
      cta: "ดูว่ากำลังจะมีอะไรบ้าง",
    },
    guides: {
      title: "คู่มือชีวิตนักศึกษาและวัฒนธรรม",
      description:
        "คำแนะนำสำหรับนักศึกษา BIR ทุกคน ครอบคลุมการเดินทางแถวท่าพระจันทร์ การจัดการเงิน สุขภาพและความปลอดภัย วัฒนธรรม และการเข้าร่วมกิจกรรม",
      topicsLabel: "หัวข้อยอดนิยม",
      cta: "ดูคู่มือทั้งหมด",
    },
    international: {
      eyebrow: "สำหรับนักศึกษาต่างชาติ",
      title: "การเดินทางมาถึงกรุงเทพฯ",
      description:
        "การเดินทางมาถึง วีซ่า บัญชีธนาคาร มือถือ การรักษาพยาบาล และวัฒนธรรมในชีวิตประจำวัน ครบทุกอย่างสำหรับสัปดาห์แรกและหลังจากนั้น",
      topicsLabel: "หัวข้อยอดนิยม",
      cta: "ดูคู่มือสำหรับนักศึกษาต่างชาติ",
    },
    handbook: {
      eyebrow: "เอกสารอ้างอิง",
      title: "คู่มือนักศึกษา",
      description:
        "คู่มือนักศึกษา BIR ทั้งการรับเข้าและค่าเล่าเรียน โครงสร้างหลักสูตรและแผนการศึกษาฉบับปรับปรุง พ.ศ. 2566 ระเบียบด้านการเรียน การฝึกงาน และกิจกรรมทางวิชาการ",
      topicsLabel: "ในคู่มือนี้",
      cta: "อ่านคู่มือนักศึกษา",
    },
    howToUseTitle: "แจ้งปัญหาเกี่ยวกับหน้านี้",
    howToUseBody: "หากพบข้อมูลตกหล่น ล้าสมัย หรือผิดพลาด แจ้ง BIRSA ได้",
    reportGaps: "แจ้งข้อมูลที่ขาดหาย",
  },
};

export default async function InformationServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;

  const equipmentHref = localeHref(locale, "/services/equipment-loan");
  const equipmentDirectoryHref = localeHref(
    locale,
    "/services/equipment-loan/directory"
  );
  const answersHref = localeHref(locale, "/answers");
  const universityServicesHref = localeHref(locale, "/services/university-services");
  const courseReviewsHref = localeHref(locale, "/student-life/course-reviews");
  const studentLifeHref = localeHref(locale, "/student-life");
  const guidesHref = localeHref(locale, "/student-life/home");
  const internationalHref = localeHref(locale, "/student-life/international");
  const handbookHref = localeHref(locale, "/student-life/handbook");

  const guideTopics = getGuideEntries(locale, "home").slice(0, 4);
  const internationalTopics = getGuideEntries(locale, "international").slice(0, 4);
  const handbookTopics = getGuideEntries(locale, "handbook").slice(0, 4);

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: infoServicesLabel }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-12 py-10">
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.servicesHeading}</h2>
          <Card href={answersHref}>
            <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              {t.getAnswer.eyebrow}
            </span>
            <CardTitle href={answersHref} as="h3">
              {t.getAnswer.title}
            </CardTitle>
            <p className="text-muted text-sm leading-relaxed">{t.getAnswer.description}</p>
            <span className="text-brand-deep text-sm font-semibold">{t.getAnswer.cta} &rarr;</span>
          </Card>

          <Card href={equipmentHref}>
            <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              {t.equipmentLoan.eyebrow}
            </span>
            <CardTitle href={equipmentHref} as="h3">
              {t.equipmentLoan.title}
            </CardTitle>
            <p className="text-muted text-sm leading-relaxed">{t.equipmentLoan.description}</p>
            <span className="text-brand-deep text-sm font-semibold">
              {t.equipmentLoan.cta} &rarr;
            </span>
          </Card>
          <p className="text-muted text-sm">
            {t.directoryLinkLine}{" "}
            <Link
              href={equipmentDirectoryHref}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.directoryLinkCta}
            </Link>
          </p>

          <Card href={universityServicesHref}>
            <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              {t.universityServices.eyebrow}
            </span>
            <CardTitle href={universityServicesHref} as="h3">
              {t.universityServices.title}
            </CardTitle>
            <p className="text-muted text-sm leading-relaxed">{t.universityServices.description}</p>
            <span className="text-brand-deep text-sm font-semibold">
              {t.universityServices.cta} &rarr;
            </span>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.informationHeading}</h2>
          <p className="text-muted max-w-[var(--measure)] text-sm leading-relaxed">
            {t.informationLede}
          </p>
          <p className="text-muted text-sm">
            {t.studentLifeIndexLine}{" "}
            <Link
              href={studentLifeHref}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.studentLifeIndexCta}
            </Link>
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card href={courseReviewsHref}>
              <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                {t.courseReviews.eyebrow}
              </span>
              <CardTitle href={courseReviewsHref} as="h3">
                {t.courseReviews.title}
              </CardTitle>
              <p className="text-muted text-sm leading-relaxed">{t.courseReviews.description}</p>
              <span className="text-brand-deep text-sm font-semibold">
                {t.courseReviews.cta} &rarr;
              </span>
            </Card>

            <Card href={guidesHref}>
              <CardTitle href={guidesHref} as="h3">
                {t.guides.title}
              </CardTitle>
              <p className="text-muted text-sm leading-relaxed">{t.guides.description}</p>
              {guideTopics.length > 0 ? (
                <div className="mt-1">
                  <p className="text-ink text-sm font-semibold">{t.guides.topicsLabel}</p>
                  <ul className="text-muted mt-1 flex flex-col gap-1 text-sm">
                    {guideTopics.map((entry) => (
                      <li key={entry.slug}>{entry.frontmatter.title}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card href={handbookHref}>
              <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                {t.handbook.eyebrow}
              </span>
              <CardTitle href={handbookHref} as="h3">
                {t.handbook.title}
              </CardTitle>
              <p className="text-muted text-sm leading-relaxed">{t.handbook.description}</p>
              {handbookTopics.length > 0 ? (
                <div className="mt-1">
                  <p className="text-ink text-sm font-semibold">{t.handbook.topicsLabel}</p>
                  <ul className="text-muted mt-1 flex flex-col gap-1 text-sm">
                    {handbookTopics.map((entry) => (
                      <li key={entry.slug}>{entry.frontmatter.title}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <span className="text-brand-deep text-sm font-semibold">{t.handbook.cta} &rarr;</span>
            </Card>

            <Card href={internationalHref}>
              <span className="text-brand-deep bg-brand-tint w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                {t.international.eyebrow}
              </span>
              <CardTitle href={internationalHref} as="h3">
                {t.international.title}
              </CardTitle>
              <p className="text-muted text-sm leading-relaxed">{t.international.description}</p>
              {internationalTopics.length > 0 ? (
                <div className="mt-1">
                  <p className="text-ink text-sm font-semibold">{t.international.topicsLabel}</p>
                  <ul className="text-muted mt-1 flex flex-col gap-1 text-sm">
                    {internationalTopics.map((entry) => (
                      <li key={entry.slug}>{entry.frontmatter.title}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <span className="text-brand-deep text-sm font-semibold">
                {t.international.cta} &rarr;
              </span>
            </Card>
          </div>
        </section>

        <section className="border-line bg-sunken flex flex-col gap-3 rounded-lg border p-8">
          <h2 className="font-display text-2xl">{t.howToUseTitle}</h2>
          <p className="text-muted max-w-[var(--measure)] text-sm leading-relaxed">
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
