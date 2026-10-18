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
      : "Borrow BIRSA equipment, read course reviews and student-written guides to life at BIR, and find practical guidance for international students.";

  return buildMetadata({ locale, title, description, path: "/services" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    studyPlan: { title: string; description: string; cta: string };
    equipmentLoan: { title: string; description: string; cta: string };
    equipmentDirectory: { title: string; description: string; cta: string };
    universityServices: { eyebrow: string; title: string; description: string; cta: string };
    servicesHeading: string;
  }
> = {
  en: {
    title: "Information and services",
    lede: "Borrow equipment, read course reviews and student-life guides written by students, or get logistics guidance if you're new to Bangkok.",
    studyPlan: {
      title: "Plan your BIR degree",
      description:
        "Work out what you still need to take, put it into semesters, and check it against the rules.",
      cta: "Plan your degree",
    },
    equipmentLoan: {
      title: "Equipment loan service",
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
  },
  th: {
    title: "ข้อมูลและบริการ",
    lede: "ยืมอุปกรณ์ อ่านรีวิวรายวิชาและคู่มือชีวิตนักศึกษาที่เขียนโดยรุ่นพี่ หรือดูข้อมูลสำหรับนักศึกษาต่างชาติที่เริ่มต้นชีวิตในกรุงเทพฯ",
    studyPlan: {
      title: "วางแผนปริญญา BIR ของคุณ",
      description:
        "ดูว่าคุณยังต้องลงวิชาอะไรอีกบ้าง จัดเรียงเป็นภาคการศึกษา และตรวจสอบกับกฎระเบียบ",
      cta: "วางแผนการเรียนของคุณ",
    },
    equipmentLoan: {
      title: "บริการยืมอุปกรณ์",
      description:
        "ยืมอุปกรณ์ของ BIRSA เช่น ชุดปฐมพยาบาล สำหรับกิจกรรมหรือความจำเป็นในชีวิตประจำวัน",
      cta: "ขอยืมอุปกรณ์",
    },
    equipmentDirectory: {
      title: "ทำเนียบอุปกรณ์ของชมรม",
      description: "อุปกรณ์ที่เป็นของชมรมต่าง ๆ ใน BIR ไม่ใช่ของ BIRSA พร้อมช่องทางติดต่อขอยืม",
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

  const studyPlanHref = localeHref(locale, "/services/study-plan");
  const equipmentHref = localeHref(locale, "/services/equipment-loan");
  const equipmentDirectoryHref = localeHref(locale, "/services/equipment-loan/directory");
  const universityServicesHref = localeHref(locale, "/services/university-services");
  const conditionsHref = localeHref(locale, "/conditions");

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
                <NavListItem href={studyPlanHref} title={t.studyPlan.title} as="h3">
                  {t.studyPlan.description}
                </NavListItem>
                <NavListItem
                  href={conditionsHref}
                  title={dict.conditionsPage.services.title}
                  as="h3"
                >
                  {dict.conditionsPage.services.description}
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
      </div>
    </>
  );
}
