import type { Metadata } from "next";

import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import { Wrap, Stack, Section } from "@/components/bds/Layout";
import PageHeader from "@/components/bds/PageHeader";
import Table from "@/components/bds/Table";
import { Heading, Text } from "@/components/bds/Type";
import { browserStorage, cookieRecords } from "@/content/privacy/register";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * `/privacy/cookies` (ROUTE-MAP-2.0 Wave 5F, BUILD-BRIEF-2.0 §8, Gate 4).
 *
 * EVERY COOKIE AND EVERY STORAGE KEY LISTED HERE COMES FROM
 * `content/privacy/register.ts`, never from prose typed on this page. The
 * `cookieRecords` and `browserStorage` loops are the whole factual content;
 * everything in `content` below is a label or a connective sentence.
 *
 * Gate 4 is decided: no banner, because no consent is required, conditional
 * on every cookie remaining strictly necessary. This page is where that
 * condition is stated honestly, not asserted: it says what is set, why each
 * one is necessary, and that no consent is asked because none is required.
 * It never implies a banner exists or that consent was collected.
 */

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
  cookiesCaption: string;
  colName: string;
  colPurpose: string;
  colExpires: string;

  storageTitle: string;
  storageIntro: string;
  storageCaption: string;
  colKey: string;

  clearingTitle: string;
  clearingBody1: string;
  clearingBody2: string;
};

const content: Record<Locale, Labels> = {
  en: {
    title: "Cookies",
    lede: "Every cookie this site sets, what it is for, and how long it lasts.",
    privacyBreadcrumb: "Privacy",

    noBannerTitle: "Why there is no cookie banner",
    noBannerBody1:
      "This site sets no tracking or advertising cookies. Every cookie listed below is strictly necessary. It exists to make a feature you are actively using work, such as remembering your language or holding a form you are partway through filling in.",
    noBannerBody2:
      "The guidance we follow says you should not interrupt people to ask for consent to cookies you would set anyway, because they are needed to provide the service being asked for. That is why we do not show a cookie banner, and no consent has been asked for or collected here. If we ever add a cookie that is not strictly necessary, for example one used for tracking or advertising, this answer expires and we will ask for your consent first, with a banner, before that cookie is set.",

    cookiesTitle: "Cookies this site sets",
    cookiesIntro: "These are all the cookies we use, across the whole site.",
    cookiesCaption: "Cookies this site sets",
    colName: "Name",
    colPurpose: "Purpose",
    colExpires: "Expires",

    storageTitle: "What we store in your browser",
    storageIntro:
      "These items are not cookies. They are stored in your browser's local storage, which means they never get sent to us over the network. We only ever read or write them while you are using the relevant feature.",
    storageCaption: "What this site stores in your browser",
    colKey: "Key",

    clearingTitle: "Clearing cookies and site data",
    clearingBody1:
      'You can clear cookies at any time from your browser\'s settings, usually under "privacy" or "site data". Clearing them is safe. Nothing on this site stops working permanently.',
    clearingBody2:
      "Here is what happens if you clear everything. We will ask your language preference again next visit. Any form you were partway through filling in will be lost, so you will need to start it again. If you are a BIRSA officer signed in to the equipment console, you will be signed out. Your light or dark mode choice, your onboarding checklist progress, and any study plan you have built, all stored only on your device, will also reset.",
  },
  th: {
    title: "คุกกี้",
    lede: "รายการคุกกี้ทั้งหมดที่เว็บไซต์นี้ใช้ วัตถุประสงค์ และระยะเวลาการจัดเก็บ",
    privacyBreadcrumb: "ประกาศความเป็นส่วนตัว",

    noBannerTitle: "เหตุใดเว็บไซต์นี้จึงไม่มีแบนเนอร์คุกกี้",
    noBannerBody1:
      "เว็บไซต์นี้ไม่มีการใช้คุกกี้เพื่อการติดตามพฤติกรรมหรือเพื่อการโฆษณาแต่อย่างใด คุกกี้ทุกรายการที่ระบุไว้ด้านล่างเป็นคุกกี้ที่จำเป็นอย่างยิ่งต่อการให้บริการ กล่าวคือ มีไว้เพื่อให้บริการที่ท่านกำลังใช้งานอยู่ทำงานได้ เช่น การจดจำภาษาที่ท่านเลือก หรือการเก็บรักษาข้อมูลในแบบฟอร์มที่ท่านกรอกค้างไว้",
    noBannerBody2:
      "แนวปฏิบัติที่ BIRSA ยึดถือกำหนดว่าไม่ควรขัดจังหวะผู้ใช้บริการเพื่อขอความยินยอมสำหรับคุกกี้ที่จำเป็นต้องตั้งค่าอยู่แล้ว เนื่องจากเป็นคุกกี้ที่จำเป็นต่อการให้บริการตามที่ผู้ใช้บริการร้องขอ ด้วยเหตุนี้เว็บไซต์นี้จึงไม่แสดงแบนเนอร์คุกกี้ และไม่มีการขอหรือเก็บความยินยอมใดในเรื่องนี้ ทั้งนี้ หากในอนาคตมีการเพิ่มคุกกี้ที่มิได้มีความจำเป็นอย่างยิ่ง เช่น คุกกี้เพื่อการติดตามพฤติกรรมหรือเพื่อการโฆษณา คำตอบนี้ย่อมสิ้นผลลง และ BIRSA จะขอความยินยอมจากท่านก่อนพร้อมแบนเนอร์ ก่อนตั้งค่าคุกกี้ดังกล่าว",

    cookiesTitle: "รายการคุกกี้ที่เว็บไซต์นี้ใช้",
    cookiesIntro: "รายการต่อไปนี้คือคุกกี้ทั้งหมดที่ใช้ทั่วทั้งเว็บไซต์",
    cookiesCaption: "รายการคุกกี้ที่เว็บไซต์นี้ใช้",
    colName: "ชื่อ",
    colPurpose: "วัตถุประสงค์",
    colExpires: "ระยะเวลาการจัดเก็บ",

    storageTitle: "ข้อมูลที่จัดเก็บไว้ในเบราว์เซอร์ของท่าน",
    storageIntro:
      "รายการต่อไปนี้มิใช่คุกกี้ แต่จัดเก็บไว้ใน local storage ของเบราว์เซอร์ของท่าน กล่าวคือไม่มีการส่งข้อมูลดังกล่าวมายัง BIRSA ผ่านเครือข่ายแต่อย่างใด และจะมีการอ่านหรือเขียนข้อมูลก็ต่อเมื่อท่านกำลังใช้บริการที่เกี่ยวข้องเท่านั้น",
    storageCaption: "ข้อมูลที่จัดเก็บไว้ในเบราว์เซอร์ของท่าน",
    colKey: "คีย์",

    clearingTitle: "การลบคุกกี้และข้อมูลเว็บไซต์",
    clearingBody1:
      'ท่านสามารถลบคุกกี้ได้ทุกเมื่อผ่านการตั้งค่าเบราว์เซอร์ ซึ่งโดยทั่วไปอยู่ในหมวด "ความเป็นส่วนตัว" หรือ "ข้อมูลเว็บไซต์" การลบคุกกี้ไม่ก่อให้เกิดความเสียหายถาวรต่อการใช้งานเว็บไซต์นี้แต่อย่างใด',
    clearingBody2:
      "ในกรณีที่ท่านลบข้อมูลทั้งหมด จะเกิดผลดังนี้ เว็บไซต์จะสอบถามภาษาที่ท่านประสงค์จะใช้อีกครั้งในการเข้าชมครั้งถัดไป ข้อมูลในแบบฟอร์มที่ท่านกรอกค้างไว้จะสูญหายและต้องเริ่มกรอกใหม่ หากท่านเป็นเจ้าหน้าที่ BIRSA ที่เข้าใช้งานระบบจัดการอุปกรณ์อยู่ ท่านจะออกจากระบบ ส่วนการเลือกโหมดสว่างหรือโหมดมืด ความคืบหน้าในรายการแนะนำเริ่มต้น และแผนการศึกษาที่ท่านจัดทำไว้ ซึ่งทั้งสามรายการจัดเก็บไว้บนอุปกรณ์ของท่านเท่านั้น จะถูกลบไปด้วยเช่นกัน",
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
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.noBannerTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.noBannerBody1}
            </Text>
            <Text step="body" className="text-muted">
              {t.noBannerBody2}
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="md">
            <Stack gap="xs">
              <Heading level={2}>{t.cookiesTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.cookiesIntro}
              </Text>
            </Stack>
            <Table
              caption={t.cookiesCaption}
              captionHidden
              columns={[
                { key: "name", header: t.colName },
                { key: "purpose", header: t.colPurpose },
                { key: "expires", header: t.colExpires },
              ]}
              rows={cookieRecords.map((cookie) => ({
                name: cookie.name,
                purpose: cookie.purpose[locale],
                expires: cookie.expires[locale],
              }))}
              rowKey={(row) => row.name as string}
              rowHeaders
            />
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="md">
            <Stack gap="xs">
              <Heading level={2}>{t.storageTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.storageIntro}
              </Text>
            </Stack>
            <Table
              caption={t.storageCaption}
              captionHidden
              columns={[
                { key: "key", header: t.colKey },
                { key: "purpose", header: t.colPurpose },
              ]}
              rows={browserStorage.map((item) => ({
                key: item.key,
                purpose: item.purpose[locale],
              }))}
              rowKey={(row) => row.key as string}
              rowHeaders
            />
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.clearingTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.clearingBody1}
            </Text>
            <Text step="body" className="text-muted">
              {t.clearingBody2}
            </Text>
          </Stack>
        </Section>
      </Wrap>
    </>
  );
}
