import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { browserStorage, cookieRecords } from "@/content/privacy/register";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = content[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/privacy/cookies" });
}

type Labels = {
  title: string;
  lede: string;
  privacyBreadcrumb: string;

  noBannerTitle: string;
  noBannerBody1: string;
  noBannerBody2: string;

  cookiesTitle: string;
  cookiesIntro: string;
  colName: string;
  colPurpose: string;
  colExpires: string;

  storageTitle: string;
  storageIntro: string;
  colKey: string;

  clearingTitle: string;
  clearingBody1: string;
  clearingBody2: string;
};

const content: Record<Locale, Labels> = {
  en: {
    title: "Cookies",
    lede: "Every cookie this site sets, what it's for, and how long it lasts.",
    privacyBreadcrumb: "Privacy",

    noBannerTitle: "Why there's no cookie banner",
    noBannerBody1:
      "This site sets no tracking or advertising cookies. Every cookie listed below is strictly necessary: it exists to make a feature you're actively using work, such as remembering your language or holding a form you're partway through filling in.",
    noBannerBody2:
      "The guidance we follow says you shouldn't interrupt people to ask for consent to cookies you'd set anyway, because they're needed to provide the service being asked for. That's why we don't show a cookie banner. If we ever add a cookie that isn't strictly necessary, for example one used for tracking or advertising, we'll ask for your consent first and add a banner then.",

    cookiesTitle: "Cookies this site sets",
    cookiesIntro: "These are all the cookies we use, across the whole site.",
    colName: "Name",
    colPurpose: "Purpose",
    colExpires: "Expires",

    storageTitle: "What we store in your browser",
    storageIntro:
      "These two items aren't cookies: they're stored in your browser's local storage, which means they never get sent to us over the network. We only ever read or write them while you're using the relevant feature.",
    colKey: "Key",

    clearingTitle: "Clearing cookies and site data",
    clearingBody1:
      "You can clear cookies at any time from your browser's settings, usually under \"privacy\" or \"site data\". Clearing them is safe: nothing on this site stops working permanently.",
    clearingBody2:
      "Here's what happens if you clear everything: we'll ask your language preference again next visit. Any form you were partway through filling in will be lost, so you'll need to start it again. If you're a BIRSA officer signed in to the equipment console, you'll be signed out. Your light or dark mode choice and your onboarding checklist progress, both stored only on your device, will also reset.",
  },
  th: {
    title: "คุกกี้",
    lede: "รายการคุกกี้ทั้งหมดที่เว็บไซต์นี้ใช้ วัตถุประสงค์ และระยะเวลาการจัดเก็บ",
    privacyBreadcrumb: "ประกาศความเป็นส่วนตัว",

    noBannerTitle: "เหตุใดเว็บไซต์นี้จึงไม่มีแบนเนอร์คุกกี้",
    noBannerBody1:
      "เว็บไซต์นี้ไม่มีการใช้คุกกี้เพื่อการติดตามพฤติกรรมหรือเพื่อการโฆษณาแต่อย่างใด คุกกี้ทุกรายการที่ระบุไว้ด้านล่างเป็นคุกกี้ที่จำเป็นอย่างยิ่งต่อการให้บริการ กล่าวคือ มีไว้เพื่อให้บริการที่ท่านกำลังใช้งานอยู่ทำงานได้ เช่น การจดจำภาษาที่ท่านเลือก หรือการเก็บรักษาข้อมูลในแบบฟอร์มที่ท่านกรอกค้างไว้",
    noBannerBody2:
      "แนวปฏิบัติที่ BIRSA ยึดถือกำหนดว่า ไม่ควรขัดจังหวะผู้ใช้บริการเพื่อขอความยินยอมสำหรับคุกกี้ที่จำเป็นต้องตั้งค่าอยู่แล้ว เนื่องจากเป็นคุกกี้ที่จำเป็นต่อการให้บริการตามที่ผู้ใช้บริการร้องขอ ด้วยเหตุนี้ เว็บไซต์นี้จึงไม่แสดงแบนเนอร์คุกกี้ ทั้งนี้ หากในอนาคตมีการเพิ่มคุกกี้ที่มิได้มีความจำเป็นอย่างยิ่ง เช่น คุกกี้เพื่อการติดตามพฤติกรรมหรือเพื่อการโฆษณา BIRSA จะขอความยินยอมจากท่านก่อน และจะจัดให้มีแบนเนอร์ในกรณีดังกล่าว",

    cookiesTitle: "รายการคุกกี้ที่เว็บไซต์นี้ใช้",
    cookiesIntro: "รายการต่อไปนี้คือคุกกี้ทั้งหมดที่ใช้ทั่วทั้งเว็บไซต์",
    colName: "ชื่อ",
    colPurpose: "วัตถุประสงค์",
    colExpires: "ระยะเวลาการจัดเก็บ",

    storageTitle: "ข้อมูลที่จัดเก็บไว้ในเบราว์เซอร์ของท่าน",
    storageIntro:
      "รายการทั้งสองต่อไปนี้มิใช่คุกกี้ แต่จัดเก็บไว้ใน local storage ของเบราว์เซอร์ของท่าน กล่าวคือ ไม่มีการส่งข้อมูลดังกล่าวมายัง BIRSA ผ่านเครือข่ายแต่อย่างใด และจะมีการอ่านหรือเขียนข้อมูลก็ต่อเมื่อท่านกำลังใช้บริการที่เกี่ยวข้องเท่านั้น",
    colKey: "คีย์",

    clearingTitle: "การลบคุกกี้และข้อมูลเว็บไซต์",
    clearingBody1:
      "ท่านสามารถลบคุกกี้ได้ทุกเมื่อผ่านการตั้งค่าเบราว์เซอร์ ซึ่งโดยทั่วไปอยู่ในหมวด \"ความเป็นส่วนตัว\" หรือ \"ข้อมูลเว็บไซต์\" การลบคุกกี้ไม่ก่อให้เกิดความเสียหายถาวรต่อการใช้งานเว็บไซต์นี้แต่อย่างใด",
    clearingBody2:
      "ในกรณีที่ท่านลบข้อมูลทั้งหมด จะเกิดผลดังนี้ เว็บไซต์จะสอบถามภาษาที่ท่านประสงค์จะใช้อีกครั้งในการเข้าชมครั้งถัดไป ข้อมูลในแบบฟอร์มที่ท่านกรอกค้างไว้จะสูญหายและต้องเริ่มกรอกใหม่ หากท่านเป็นเจ้าหน้าที่ BIRSA ที่เข้าใช้งานระบบจัดการอุปกรณ์อยู่ ท่านจะออกจากระบบ ส่วนการเลือกโหมดสว่างหรือโหมดมืด และความคืบหน้าในรายการแนะนำเริ่มต้น ซึ่งทั้งสองรายการจัดเก็บไว้บนอุปกรณ์ของท่านเท่านั้น จะถูกลบไปด้วยเช่นกัน",
  },
};

export default async function CookiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = content[locale];

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
              { label: t.privacyBreadcrumb, href: "/privacy" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.noBannerTitle}</h2>
          <p className="text-muted leading-relaxed">{t.noBannerBody1}</p>
          <p className="text-muted leading-relaxed">{t.noBannerBody2}</p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.cookiesTitle}</h2>
            <p className="text-muted leading-relaxed">{t.cookiesIntro}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="border-line w-full border-collapse text-sm">
              <thead>
                <tr className="border-line border-b text-left">
                  <th scope="col" className="p-2 font-semibold">
                    {t.colName}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colPurpose}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colExpires}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cookieRecords.map((cookie) => (
                  <tr key={cookie.name} className="border-line border-b">
                    <td className="p-2 align-top font-mono">{cookie.name}</td>
                    <td className="p-2 align-top text-muted leading-relaxed">
                      {cookie.purpose[locale]}
                    </td>
                    <td className="p-2 align-top whitespace-nowrap">{cookie.expires[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.storageTitle}</h2>
            <p className="text-muted leading-relaxed">{t.storageIntro}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="border-line w-full border-collapse text-sm">
              <thead>
                <tr className="border-line border-b text-left">
                  <th scope="col" className="p-2 font-semibold">
                    {t.colKey}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colPurpose}
                  </th>
                </tr>
              </thead>
              <tbody>
                {browserStorage.map((item) => (
                  <tr key={item.key} className="border-line border-b">
                    <td className="p-2 align-top font-mono">{item.key}</td>
                    <td className="p-2 align-top text-muted leading-relaxed">
                      {item.purpose[locale]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.clearingTitle}</h2>
          <p className="text-muted leading-relaxed">{t.clearingBody1}</p>
          <p className="text-muted leading-relaxed">{t.clearingBody2}</p>
        </section>
      </div>
    </>
  );
}
