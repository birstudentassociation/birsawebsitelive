import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { formatDate, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getClosure, isServiceId, SERVICES, type ServiceId } from "@/lib/closures";
import { contact } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import Email from "@/components/Email";

const copy = {
  en: {
    title: "Sorry, the service is unavailable",
    reopens: (date: string) => `You will be able to use the service from ${date}.`,
    later: "You will be able to use the service later.",
    answers: "If you had started, you will need to start again when the service is available.",
    help: "If you need help before then, email",
    names: {
      "equipment-loan": "Borrow equipment",
      contact: "Contact BIRSA",
      "start-club": "Start a club",
      "your-data": "Ask about your data",
    },
  },
  th: {
    title: "ขออภัย บริการนี้ปิดชั่วคราว",
    reopens: (date: string) => `คุณจะใช้บริการได้อีกครั้งตั้งแต่วันที่ ${date}`,
    later: "คุณจะใช้บริการได้อีกครั้งภายหลัง",
    answers: "หากคุณเริ่มกรอกไว้แล้ว จะต้องเริ่มใหม่เมื่อบริการเปิดอีกครั้ง",
    help: "หากต้องการความช่วยเหลือระหว่างนี้ อีเมลถึง",
    names: {
      "equipment-loan": "ยืมอุปกรณ์",
      contact: "ติดต่อ BIRSA",
      "start-club": "เริ่มชมรมใหม่",
      "your-data": "คำร้องเกี่ยวกับข้อมูลส่วนบุคคล",
    },
  },
} satisfies Record<Locale, unknown>;

type Params = Promise<{ lang: string; service: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, service } = await params;
  if (!isLocale(lang) || !isServiceId(service)) return {};
  const t = copy[lang];
  return {
    title: { absolute: `${t.title} | ${t.names[service]}` },
    robots: { index: false },
  };
}

/**
 * GOV.UK "Service unavailable" page for a service switched off on purpose
 * (lib/closures.ts). No breadcrumbs, no red, no "maintenance": when it will
 * be back, what happened to any answers, and how to get help meanwhile.
 * While the service is open this page just sends people to its start.
 */
export default async function UnavailablePage({ params }: { params: Params }) {
  const { lang, service } = await params;
  if (!isLocale(lang) || !isServiceId(service)) notFound();
  const locale: Locale = lang;
  const id: ServiceId = service;
  const closure = await getClosure(id);
  if (!closure.closed) redirect(localeHref(locale, SERVICES[id].start));
  const t = copy[locale];

  return (
    <>
      <PageHeader title={t.title} />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-4 py-10">
        <p>{closure.reopens ? t.reopens(formatDate(locale, closure.reopens)) : t.later}</p>
        <p>{t.answers}</p>
        <p>
          {t.help} <Email address={contact.email} className="font-semibold text-brand-deep" />
          {locale === "en" ? "." : ""}
        </p>
      </div>
    </>
  );
}
