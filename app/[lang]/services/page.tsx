import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
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
    getAnswer: { title: string; description: string; cta: string };
    equipmentLoan: { title: string; description: string; cta: string };
    equipmentDirectory: { title: string; description: string; cta: string };
    universityServices: { eyebrow: string; title: string; description: string; cta: string };
    servicesHeading: string;
    informationHeading: string;
    informationLede: string;
    courseReviews: { title: string; description: string; cta: string };
    guides: { title: string; description: string; cta: string };
    international: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
    };
    handbook: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
    };
  }
> = {
  en: {
    title: "Information and services",
    lede: "Borrow equipment, read course reviews and student-life guides written by students, or get logistics guidance if you're new to Bangkok.",
    getAnswer: {
      title: "Get an answer",
      description:
        "Answer a few questions and get the part of the rules, the handbook or the service that applies to you, with the provision it comes from.",
      cta: "Get an answer",
    },
    equipmentLoan: {
      title: "Equipment Loan Service",
      description:
        "Borrow BIRSA equipment such as the first-aid kit for your event or everyday need.",
      cta: "Request equipment",
    },
    equipmentDirectory: {
      title: "Club equipment directory",
      description:
        "Equipment owned by BIR clubs rather than BIRSA, with who to contact to borrow it.",
      cta: "See the club equipment directory",
    },
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
    courseReviews: {
      title: "Course reviews",
      description:
        "Honest, student-written notes on BIR courses and electives: workload, assessment style, and what to expect before you register.",
      cta: "See what's coming",
    },
    guides: {
      title: "Student life and culture guides",
      description:
        "Guidance for all BIR students on getting around Tha Prachan, budgeting, health and safety, culture, and getting involved.",
      cta: "Explore the guides",
    },
    international: {
      eyebrow: "For international students",
      title: "Arriving in Bangkok",
      description:
        "Arrival, visas, banking, phones, healthcare, and everyday culture and language: everything for your first weeks and beyond.",
      cta: "Explore the international student guide",
    },
    handbook: {
      eyebrow: "Reference",
      title: "Student handbook",
      description:
        "The BIR handbook: admission and fees, the curriculum and 2023 revised study plan, academic rules, the internship, and academic activities.",
      cta: "Read the student handbook",
    },
  },
  th: {
    title: "ข้อมูลและบริการ",
    lede: "ยืมอุปกรณ์ อ่านรีวิวรายวิชาและคู่มือชีวิตนักศึกษาที่เขียนโดยรุ่นพี่ หรือดูข้อมูลที่จำเป็นสำหรับการเริ่มต้นชีวิตในกรุงเทพฯ สำหรับนักศึกษาต่างชาติ",
    getAnswer: {
      title: "ค้นหาคำตอบ",
      description:
        "ตอบคำถามไม่กี่ข้อ แล้วดูว่ากฎระเบียบ คู่มือนักศึกษา หรือบริการส่วนไหนที่ใช้กับกรณีของคุณ พร้อมข้ออ้างอิงที่มา",
      cta: "ค้นหาคำตอบ",
    },
    equipmentLoan: {
      title: "บริการยืมอุปกรณ์",
      description:
        "ยืมอุปกรณ์ของ BIRSA เช่น ชุดปฐมพยาบาล สำหรับกิจกรรมหรือความจำเป็นในชีวิตประจำวัน",
      cta: "ขอยืมอุปกรณ์",
    },
    equipmentDirectory: {
      title: "ทำเนียบอุปกรณ์ของชมรม",
      description:
        "อุปกรณ์ที่เป็นของชมรมต่าง ๆ ใน BIR ไม่ใช่ของ BIRSA พร้อมช่องทางติดต่อขอยืม",
      cta: "ดูทำเนียบอุปกรณ์ของชมรม",
    },
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
    courseReviews: {
      title: "รีวิวรายวิชา",
      description:
        "บันทึกตรงไปตรงมาจากนักศึกษาเกี่ยวกับรายวิชาและวิชาเลือกของ BIR ทั้งปริมาณงาน รูปแบบการวัดผล และสิ่งที่ควรรู้ก่อนลงทะเบียน",
      cta: "ดูว่ากำลังจะมีอะไรบ้าง",
    },
    guides: {
      title: "คู่มือชีวิตนักศึกษาและวัฒนธรรม",
      description:
        "คำแนะนำสำหรับนักศึกษา BIR ทุกคน ครอบคลุมการเดินทางแถวท่าพระจันทร์ การจัดการเงิน สุขภาพและความปลอดภัย วัฒนธรรม และการเข้าร่วมกิจกรรม",
      cta: "ดูคู่มือทั้งหมด",
    },
    international: {
      eyebrow: "สำหรับนักศึกษาต่างชาติ",
      title: "การเดินทางมาถึงกรุงเทพฯ",
      description:
        "การเดินทางมาถึง วีซ่า บัญชีธนาคาร มือถือ การรักษาพยาบาล และวัฒนธรรมในชีวิตประจำวัน ครบทุกอย่างสำหรับสัปดาห์แรกและหลังจากนั้น",
      cta: "ดูคู่มือสำหรับนักศึกษาต่างชาติ",
    },
    handbook: {
      eyebrow: "เอกสารอ้างอิง",
      title: "คู่มือนักศึกษา",
      description:
        "คู่มือนักศึกษา BIR ทั้งการรับเข้าและค่าเล่าเรียน โครงสร้างหลักสูตรและแผนการศึกษาฉบับปรับปรุง พ.ศ. 2566 ระเบียบด้านการเรียน การฝึกงาน และกิจกรรมทางวิชาการ",
      cta: "อ่านคู่มือนักศึกษา",
    },
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
  const equipmentDirectoryHref = localeHref(locale, "/services/equipment-loan/directory");
  const answersHref = localeHref(locale, "/answers");
  const universityServicesHref = localeHref(locale, "/services/university-services");
  const courseReviewsHref = localeHref(locale, "/student-life/course-reviews");
  const guidesHref = localeHref(locale, "/student-life/home");
  const internationalHref = localeHref(locale, "/student-life/international");
  const handbookHref = localeHref(locale, "/student-life/handbook");

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
          <GridRow>
            <GridMain className="flex flex-col gap-4">
              <h2 className="font-display text-2xl">{t.servicesHeading}</h2>
              <NavList>
                <NavListItem href={answersHref} title={t.getAnswer.title} as="h3">
                  {t.getAnswer.description}
                </NavListItem>
                <NavListItem href={equipmentHref} title={t.equipmentLoan.title} as="h3">
                  {t.equipmentLoan.description}
                </NavListItem>
                <NavListItem
                  href={equipmentDirectoryHref}
                  title={t.equipmentDirectory.title}
                  as="h3"
                >
                  {t.equipmentDirectory.description}
                </NavListItem>
                <NavListItem
                  href={universityServicesHref}
                  title={t.universityServices.title}
                  meta={t.universityServices.eyebrow}
                  as="h3"
                >
                  {t.universityServices.description}
                </NavListItem>
              </NavList>
            </GridMain>
          </GridRow>
        </section>

        <section className="flex flex-col gap-4">
          <GridRow>
            <GridMain className="flex flex-col gap-4">
              <h2 className="font-display text-2xl">{t.informationHeading}</h2>
              <p className="text-muted text-sm leading-relaxed">{t.informationLede}</p>

              <NavList>
                <NavListItem href={courseReviewsHref} title={t.courseReviews.title} as="h3">
                  {t.courseReviews.description}
                </NavListItem>

                <NavListItem href={guidesHref} title={t.guides.title} as="h3">
                  {t.guides.description}
                </NavListItem>

                <NavListItem
                  href={handbookHref}
                  title={t.handbook.title}
                  meta={t.handbook.eyebrow}
                  as="h3"
                >
                  {t.handbook.description}
                </NavListItem>

                <NavListItem
                  href={internationalHref}
                  title={t.international.title}
                  meta={t.international.eyebrow}
                  as="h3"
                >
                  {t.international.description}
                </NavListItem>
              </NavList>
            </GridMain>
          </GridRow>
        </section>
      </div>
    </>
  );
}
