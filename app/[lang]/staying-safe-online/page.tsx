import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import ExitThisPage from "@/components/ExitThisPage";

type Labels = {
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; items: string[] }[];
};

/**
 * The GOV.UK "Exit a page quickly" pattern's safety content page: what the
 * Exit this page button does and does not do, and other steps that keep a
 * visit private.
 */
const content: Record<Locale, Labels> = {
  en: {
    title: "Staying safe online",
    description:
      "What the Exit this page button does, what it does not do, and how to keep a visit to this site private.",
    intro:
      "If someone might be checking what you look at online, these steps make it harder for them to see that you visited this site.",
    sections: [
      {
        heading: "What Exit this page does",
        items: [
          "Select Exit this page, or press Shift 3 times, to replace the page at once with a weather page.",
          "The back button will not bring the page back.",
          "It does not delete your browsing history. The pages you visited can still be found there.",
        ],
      },
      {
        heading: "Before you read about harassment or abuse",
        items: [
          "Use a device the other person cannot get into, such as a library or faculty computer.",
          "Use private browsing (called Incognito in Chrome), which does not keep history once you close the window.",
          "If you cannot use private browsing, delete this site from your browsing history afterwards, and only this site, since an empty history can look suspicious.",
          "Log out of shared accounts, such as a shared LINE or Google account, before you start.",
        ],
      },
      {
        heading: "If you are in danger now",
        items: ["Call the police on 191."],
      },
    ],
  },
  th: {
    title: "ใช้งานออนไลน์อย่างปลอดภัย",
    description:
      "ปุ่มออกจากหน้านี้ทำอะไรได้และทำอะไรไม่ได้ และวิธีเข้าเว็บไซต์นี้โดยไม่ให้ผู้อื่นรู้",
    intro:
      "หากอาจมีคนคอยตรวจดูว่าคุณเปิดอะไรบนอินเทอร์เน็ต ขั้นตอนเหล่านี้ช่วยให้เขารู้ได้ยากขึ้นว่าคุณเข้าเว็บไซต์นี้",
    sections: [
      {
        heading: "ปุ่มออกจากหน้านี้ทำอะไร",
        items: [
          "กดปุ่มออกจากหน้านี้ หรือกด Shift 3 ครั้ง หน้านี้จะถูกแทนที่ด้วยหน้าพยากรณ์อากาศทันที",
          "ปุ่มย้อนกลับจะไม่พากลับมาหน้านี้",
          "ปุ่มนี้ไม่ได้ลบประวัติการเข้าชม หน้าที่คุณเปิดยังค้นพบได้ในประวัติ",
        ],
      },
      {
        heading: "ก่อนอ่านเรื่องการคุกคามหรือการล่วงละเมิด",
        items: [
          "ใช้อุปกรณ์ที่อีกฝ่ายเข้าถึงไม่ได้ เช่น คอมพิวเตอร์ของห้องสมุดหรือคณะ",
          "ใช้โหมดท่องเว็บแบบส่วนตัว (ใน Chrome เรียกว่า Incognito) ซึ่งไม่เก็บประวัติหลังปิดหน้าต่าง",
          "หากใช้โหมดส่วนตัวไม่ได้ ให้ลบเฉพาะเว็บไซต์นี้ออกจากประวัติหลังใช้งาน เพราะประวัติที่ว่างเปล่าทั้งหมดอาจดูน่าสงสัย",
          "ออกจากระบบบัญชีที่ใช้ร่วมกับผู้อื่น เช่น LINE หรือบัญชี Google ก่อนเริ่ม",
        ],
      },
      {
        heading: "หากคุณตกอยู่ในอันตรายตอนนี้",
        items: ["โทรแจ้งตำรวจ 191"],
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = content[lang];
  return buildMetadata({
    locale: lang,
    title: t.title,
    description: t.description,
    path: "/staying-safe-online",
  });
}

export default async function StayingSafeOnlinePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = content[locale];

  return (
    <>
      <ExitThisPage locale={locale} />
      <PageHeader title={t.title} lede={t.intro} />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        {t.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="font-display text-2xl">{section.heading}</h2>
            <ul className="flex list-disc flex-col gap-2 pl-6">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
