import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Email from "@/components/Email";
import { contact } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = content[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/privacy" });
}

type LabelledItem = { label: string; body: string };

const content: Record<
  Locale,
  {
    title: string;
    lede: string;

    controllerTitle: string;
    controllerBody: string;
    controllerAddressLabel: string;
    controllerEmailLabel: string;

    collectTitle: string;
    collectIntro: string;
    collectContactTitle: string;
    collectContactSteps: string[];
    collectLoanTitle: string;
    collectLoanSteps: string[];

    legalTitle: string;
    legalBody: string;

    retentionTitle: string;
    retentionIntro: string;
    retentionList: LabelledItem[];
    retentionPlaceholderTitle: string;
    retentionPlaceholder: string;

    sharingTitle: string;
    sharingIntro: string;
    sharingList: LabelledItem[];

    transferTitle: string;
    transferBody: string;
    transferPlaceholderTitle: string;
    transferPlaceholder: string;

    automatedTitle: string;
    automatedBody: string;

    cookiesTitle: string;
    cookiesBody: string;
    onboardingTitle: string;
    onboardingBody: string;
    analyticsTitle: string;
    analyticsBody: string;
    adsTitle: string;
    adsBody: string;

    choicesTitle: string;
    choicesIntro: string;
    rightsList: string[];
    choicesBody: string;
    contactCta: string;
  }
> = {
  en: {
    title: "Privacy",
    lede: "A plain-language notice of what we collect on this site, why, and what happens to it.",

    controllerTitle: "Who runs this site",
    controllerBody:
      "BIRSA (the BIR Student Association), the student association of the BIR programme, Faculty of Political Science, Thammasat University, is the data controller for this site: it decides what data is collected and why.",
    controllerAddressLabel: "Address:",
    controllerEmailLabel: "Email:",

    collectTitle: "What we collect and why",
    collectIntro:
      "This site collects personal data in two places: when you send a message through a form, and when you request to borrow equipment.",
    collectContactTitle: "Contact and start-a-club messages",
    collectContactSteps: [
      "You type your name, email address, and message into the contact form or the start-a-club form.",
      "The form sends that information as one email to BIRSA's inbox, using Resend, our email delivery provider.",
      "A BIRSA officer reads the email and replies to you directly.",
      "The message is not stored in a database. It exists only as an email, in BIRSA's inbox and in Resend's delivery records.",
    ],
    collectLoanTitle: "Equipment loan requests",
    collectLoanSteps: [
      "You enter your name, TU student ID, email address, and optionally your phone number, along with the dates and reason for the loan.",
      "The system checks whether the item is available and whether your account is blocked or at its loan limit.",
      "If the request is valid, we save it as a loan record, and an officer is emailed a summary of the request.",
      "A BIRSA officer decides whether to approve or reject the request, and you receive an email with the decision.",
      "If approved, the loan record and your borrower details stay on file as part of the equipment's loan history.",
    ],

    legalTitle: "Our legal basis",
    legalBody:
      "Thailand's Personal Data Protection Act B.E. 2562 (2019) is the law that applies to this site, not the EU's GDPR. We rely on your consent, given when you choose to submit a form on this site. Where you ask us to arrange something for you, for example borrowing equipment, processing your data is also necessary to provide that service.",

    retentionTitle: "How long we keep it",
    retentionIntro: "How long we keep your data depends on what it is.",
    retentionList: [
      {
        label: "Contact and start-a-club messages",
        body: "Not stored in a database. They exist as emails in BIRSA's inbox until an officer deletes them.",
      },
      {
        label: "Equipment loan and borrower records",
        body: "Kept on file as part of the equipment's loan history for as long as the loan service runs.",
      },
      {
        label: "Officer accounts and the audit log",
        body: "Kept on file for as long as someone holds an officer role, plus a record of past actions for accountability.",
      },
    ],
    retentionPlaceholderTitle: "Not yet confirmed",
    retentionPlaceholder:
      "BIRSA has not yet set exact deletion dates for these records. This section will be updated once the committee confirms a retention schedule.",

    sharingTitle: "Who we share it with",
    sharingIntro:
      "This site uses a small number of outside providers to work at all. They process data only to provide their service to us, never for their own purposes, and we never sell or share your data beyond what is listed here.",
    sharingList: [
      {
        label: "Resend",
        body: "Delivers every email this site sends: contact-form messages, start-a-club proposals, and equipment-loan emails, which can include your name, student ID, email address, and phone number.",
      },
      {
        label: "Vercel (hosting and Analytics)",
        body: "Hosts this site and runs the cookieless page-view counts described under Analytics below. It does not receive personal data beyond ordinary web server logs.",
      },
      {
        label: "Vercel Postgres",
        body: "Stores equipment loan and borrower records (name, student ID, email, phone if given, and loan history), officer accounts, and the audit log of officer actions.",
      },
      {
        label: "Vercel Blob",
        body: "Stores photos of equipment items that officers upload. It does not hold personal data about borrowers.",
      },
      {
        label: "Vercel Edge Config",
        body: "Stores the on or off switch for site-wide emergency mode. It holds no personal data.",
      },
    ],

    transferTitle: "Data sent outside Thailand",
    transferBody:
      "Resend and Vercel are both based outside Thailand, so your data may be processed on servers outside the country when you use any of the features above.",
    transferPlaceholderTitle: "Not yet confirmed",
    transferPlaceholder:
      "BIRSA has not yet confirmed the specific cross-border transfer safeguards, for example standard contractual clauses, that apply under section 28 of the Personal Data Protection Act. This section will be updated once confirmed.",

    automatedTitle: "Automated decisions",
    automatedBody:
      "When you request to borrow equipment, the system automatically checks whether the item is available and whether your account is blocked or at its loan limit, and stops an invalid request going any further. It does not automatically approve or reject a request: every loan decision is made by a BIRSA officer.",

    cookiesTitle: "Cookies",
    cookiesBody:
      "This site sets one functional cookie, NEXT_LOCALE, which remembers whether you last read the site in Thai or English so we do not ask again. We do not set any tracking or advertising cookies. If you switch the light/dark mode toggle, we also save that choice in your browser's local storage (key birsa-theme) so the site remembers it next time. This stays on your device and is never sent to us.",
    onboardingTitle: '"Starting at BIR: step by step" checklist',
    onboardingBody:
      "If you tick off tasks on the Getting started step-by-step pages, that progress is saved only in your browser's local storage (one key per track, e.g. birsa-onboarding-home). We never see it, and it is never sent to BIRSA or anyone else. Use the \"Reset your progress\" button on that page to clear it, or clear it at any time by clearing your browser's site data.",
    analyticsTitle: "Analytics",
    analyticsBody:
      "We use cookieless, privacy-friendly analytics that count things like page views in aggregate. This does not identify you personally and cannot be linked back to an individual visitor.",
    adsTitle: "No ads, no data sales",
    adsBody:
      "We do not run advertising on this site, and we never sell or share your data with third parties.",

    choicesTitle: "Your rights and choices",
    choicesIntro:
      "Under the Personal Data Protection Act, you can ask us to do any of the following with the data we hold about you:",
    rightsList: [
      "Tell you what personal data we hold about you and give you a copy of it.",
      "Correct data that is wrong or out of date.",
      "Delete data we no longer need, or that you no longer consent to us holding.",
      "Stop processing your data if you withdraw your consent, without affecting anything already done under that consent.",
    ],
    choicesBody:
      "You can also clear your cookies at any time using your browser settings. This means we'll ask your language preference again. If you have any questions about this notice or your data, get in touch.",
    contactCta: "Contact BIRSA",
  },
  th: {
    title: "ความเป็นส่วนตัว",
    lede: "ประกาศฉบับนี้อธิบายแบบเข้าใจง่ายว่าเว็บไซต์นี้เก็บข้อมูลอะไร เพราะอะไร และนำไปใช้อย่างไร",

    controllerTitle: "ผู้ดูแลเว็บไซต์นี้",
    controllerBody:
      "BIRSA (สโมสรนักศึกษาหลักสูตร BIR) หลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เป็นผู้ควบคุมข้อมูลของเว็บไซต์นี้ เป็นผู้กำหนดว่าจะเก็บข้อมูลอะไรและเพราะอะไร",
    controllerAddressLabel: "ที่อยู่:",
    controllerEmailLabel: "อีเมล:",

    collectTitle: "ข้อมูลที่เราเก็บและเหตุผล",
    collectIntro:
      "เว็บไซต์นี้เก็บข้อมูลส่วนบุคคลใน 2 จุด คือเมื่อคุณส่งข้อความผ่านแบบฟอร์ม และเมื่อคุณขอยืมอุปกรณ์",
    collectContactTitle: "ข้อความติดต่อและข้อเสนอจัดตั้งชมรม",
    collectContactSteps: [
      "คุณกรอกชื่อ อีเมล และข้อความ ลงในแบบฟอร์มติดต่อหรือแบบฟอร์มเสนอจัดตั้งชมรม",
      "ระบบส่งข้อมูลนั้นเป็นอีเมลฉบับเดียวไปยังกล่องข้อความของ BIRSA ผ่าน Resend ผู้ให้บริการส่งอีเมลของเรา",
      "เจ้าหน้าที่ BIRSA อ่านอีเมลและตอบกลับคุณโดยตรง",
      "ข้อความนี้ไม่ถูกเก็บในฐานข้อมูล มีอยู่เพียงในรูปอีเมล ทั้งในกล่องข้อความของ BIRSA และในบันทึกการส่งของ Resend",
    ],
    collectLoanTitle: "คำขอยืมอุปกรณ์",
    collectLoanSteps: [
      "คุณกรอกชื่อ รหัสนักศึกษา อีเมล และเบอร์โทรศัพท์ (ถ้ามี) พร้อมวันที่และเหตุผลการยืม",
      "ระบบตรวจสอบว่าอุปกรณ์ว่างหรือไม่ และบัญชีของคุณถูกระงับหรือครบโควตาการยืมหรือไม่",
      "หากคำขอถูกต้อง เราจะบันทึกเป็นรายการยืม และส่งอีเมลสรุปคำขอให้เจ้าหน้าที่",
      "เจ้าหน้าที่ BIRSA เป็นผู้ตัดสินใจอนุมัติหรือไม่อนุมัติคำขอ และคุณจะได้รับอีเมลแจ้งผล",
      "หากอนุมัติ รายการยืมและข้อมูลผู้ยืมจะถูกเก็บไว้เป็นส่วนหนึ่งของประวัติการยืมอุปกรณ์ชิ้นนั้น",
    ],

    legalTitle: "ฐานทางกฎหมายที่เราใช้",
    legalBody:
      "กฎหมายที่ใช้กับเว็บไซต์นี้คือพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ของไทย ไม่ใช่ GDPR ของสหภาพยุโรป เราอาศัยความยินยอมของคุณ ซึ่งเกิดขึ้นเมื่อคุณเลือกส่งแบบฟอร์มบนเว็บไซต์นี้ ในกรณีที่คุณขอให้เราจัดการบางอย่างให้ เช่น การยืมอุปกรณ์ การประมวลผลข้อมูลของคุณยังจำเป็นต่อการให้บริการนั้นด้วย",

    retentionTitle: "ระยะเวลาที่เราเก็บข้อมูล",
    retentionIntro: "ระยะเวลาเก็บข้อมูลขึ้นอยู่กับประเภทของข้อมูล",
    retentionList: [
      {
        label: "ข้อความติดต่อและข้อเสนอจัดตั้งชมรม",
        body: "ไม่ถูกเก็บในฐานข้อมูล มีอยู่ในรูปอีเมลในกล่องข้อความของ BIRSA จนกว่าเจ้าหน้าที่จะลบ",
      },
      {
        label: "รายการยืมและข้อมูลผู้ยืมอุปกรณ์",
        body: "เก็บไว้เป็นส่วนหนึ่งของประวัติการยืมอุปกรณ์ ตลอดระยะเวลาที่บริการยืมอุปกรณ์ยังเปิดให้ใช้งาน",
      },
      {
        label: "บัญชีเจ้าหน้าที่และบันทึกการใช้งาน",
        body: "เก็บไว้ตลอดระยะเวลาที่บุคคลนั้นดำรงตำแหน่งเจ้าหน้าที่ พร้อมบันทึกการกระทำในอดีตเพื่อการตรวจสอบย้อนหลัง",
      },
    ],
    retentionPlaceholderTitle: "ยังไม่ได้กำหนด",
    retentionPlaceholder:
      "BIRSA ยังไม่ได้กำหนดวันลบข้อมูลที่แน่นอนสำหรับรายการเหล่านี้ ส่วนนี้จะปรับปรุงเมื่อคณะกรรมการกำหนดระยะเวลาเก็บรักษาข้อมูลแล้วเสร็จ",

    sharingTitle: "ผู้ที่เราแบ่งปันข้อมูลด้วย",
    sharingIntro:
      "เว็บไซต์นี้ใช้ผู้ให้บริการภายนอกจำนวนน้อยรายเท่าที่จำเป็นต่อการทำงาน ผู้ให้บริการเหล่านี้ประมวลผลข้อมูลเพื่อให้บริการแก่เราเท่านั้น ไม่นำไปใช้เพื่อวัตถุประสงค์ของตนเอง และเราไม่ขายหรือแบ่งปันข้อมูลของคุณนอกเหนือจากรายชื่อนี้",
    sharingList: [
      {
        label: "Resend",
        body: "ส่งอีเมลทุกฉบับที่เว็บไซต์นี้ส่งออก ทั้งข้อความติดต่อ ข้อเสนอจัดตั้งชมรม และอีเมลเกี่ยวกับการยืมอุปกรณ์ ซึ่งอาจมีชื่อ รหัสนักศึกษา อีเมล และเบอร์โทรศัพท์ของคุณ",
      },
      {
        label: "Vercel (โฮสติ้งและ Analytics)",
        body: "โฮสต์เว็บไซต์นี้และประมวลผลสถิติจำนวนการเข้าชมหน้าแบบไม่ใช้คุกกี้ตามที่อธิบายไว้ในหัวข้อการวิเคราะห์ข้อมูลด้านล่าง ไม่ได้รับข้อมูลส่วนบุคคลนอกเหนือจากบันทึกเซิร์ฟเวอร์ทั่วไป",
      },
      {
        label: "Vercel Postgres",
        body: "เก็บรายการยืมและข้อมูลผู้ยืมอุปกรณ์ (ชื่อ รหัสนักศึกษา อีเมล เบอร์โทรศัพท์ถ้ามี และประวัติการยืม) บัญชีเจ้าหน้าที่ และบันทึกการใช้งานของเจ้าหน้าที่",
      },
      {
        label: "Vercel Blob",
        body: "เก็บรูปถ่ายอุปกรณ์ที่เจ้าหน้าที่อัปโหลด ไม่มีข้อมูลส่วนบุคคลของผู้ยืม",
      },
      {
        label: "Vercel Edge Config",
        body: "เก็บสถานะเปิดหรือปิดของโหมดฉุกเฉินทั้งเว็บไซต์ ไม่มีข้อมูลส่วนบุคคล",
      },
    ],

    transferTitle: "การส่งข้อมูลออกนอกประเทศไทย",
    transferBody:
      "Resend และ Vercel ตั้งอยู่นอกประเทศไทยทั้งคู่ ข้อมูลของคุณจึงอาจถูกประมวลผลบนเซิร์ฟเวอร์นอกประเทศเมื่อคุณใช้ฟีเจอร์ต่าง ๆ ที่กล่าวมาข้างต้น",
    transferPlaceholderTitle: "ยังไม่ได้กำหนด",
    transferPlaceholder:
      "BIRSA ยังไม่ได้ยืนยันมาตรการคุ้มครองการส่งข้อมูลข้ามพรมแดนที่ใช้อยู่ เช่น ข้อสัญญามาตรฐาน ตามมาตรา 28 ของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล ส่วนนี้จะปรับปรุงเมื่อยืนยันแล้วเสร็จ",

    automatedTitle: "การตัดสินใจอัตโนมัติ",
    automatedBody:
      "เมื่อคุณขอยืมอุปกรณ์ ระบบจะตรวจสอบอัตโนมัติว่าอุปกรณ์ว่างหรือไม่ และบัญชีของคุณถูกระงับหรือครบโควตาการยืมหรือไม่ และจะหยุดคำขอที่ไม่ถูกต้องไว้ตั้งแต่ขั้นตอนนี้ ระบบไม่ได้อนุมัติหรือปฏิเสธคำขอโดยอัตโนมัติ การตัดสินใจทุกคำขอยืมทำโดยเจ้าหน้าที่ BIRSA เสมอ",

    cookiesTitle: "คุกกี้",
    cookiesBody:
      "เว็บไซต์นี้ใช้คุกกี้เพื่อการทำงานเพียงตัวเดียวคือ NEXT_LOCALE ซึ่งจดจำว่าครั้งล่าสุดคุณอ่านเว็บนี้เป็นภาษาไทยหรืออังกฤษ เพื่อไม่ต้องถามซ้ำ เราไม่ใช้คุกกี้เพื่อติดตามหรือโฆษณา นอกจากนี้ หากคุณสลับโหมดสว่าง/มืดด้วยปุ่มที่ส่วนหัวเว็บไซต์ เราจะบันทึกตัวเลือกนั้นไว้ใน local storage ของเบราว์เซอร์คุณ (คีย์ birsa-theme) เพื่อจดจำไว้ใช้ครั้งถัดไป ข้อมูลนี้อยู่บนอุปกรณ์ของคุณเท่านั้น ไม่ถูกส่งมาหาเรา",
    onboardingTitle: 'เช็กลิสต์ "เริ่มต้นที่ BIR: ทีละขั้นตอน"',
    onboardingBody:
      'หากคุณติ๊กรายการในหน้าเริ่มต้นที่ BIR แบบทีละขั้นตอน ความคืบหน้านั้นจะถูกบันทึกไว้ใน local storage ของเบราว์เซอร์คุณเท่านั้น (คีย์แยกตามแต่ละเส้นทาง เช่น birsa-onboarding-home) เราไม่เห็นข้อมูลนี้ และไม่ถูกส่งไปให้ BIRSA หรือใครทั้งสิ้น ใช้ปุ่ม "ล้างความคืบหน้า" ในหน้านั้นเพื่อล้างข้อมูล หรือล้างได้ทุกเมื่อจากการล้างข้อมูลเว็บไซต์ในเบราว์เซอร์',
    analyticsTitle: "การวิเคราะห์ข้อมูลการใช้งาน",
    analyticsBody:
      "เราใช้ระบบวิเคราะห์ข้อมูลแบบไม่ใช้คุกกี้และเป็นมิตรกับความเป็นส่วนตัว ซึ่งนับจำนวนการเข้าชมหน้าต่าง ๆ แบบภาพรวมเท่านั้น ไม่สามารถระบุตัวตนของคุณ หรือเชื่อมโยงกลับไปหาผู้เข้าชมรายใดรายหนึ่งได้",
    adsTitle: "ไม่มีโฆษณา ไม่ขายข้อมูล",
    adsBody: "เว็บไซต์นี้ไม่มีการลงโฆษณา และเราไม่ขายหรือแบ่งปันข้อมูลของคุณให้บุคคลที่สามเด็ดขาด",

    choicesTitle: "สิทธิและทางเลือกของคุณ",
    choicesIntro:
      "ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล คุณสามารถขอให้เราดำเนินการต่อไปนี้กับข้อมูลของคุณที่เราเก็บไว้ได้",
    rightsList: [
      "แจ้งว่าเราเก็บข้อมูลส่วนบุคคลอะไรของคุณไว้บ้าง และขอสำเนาข้อมูลนั้น",
      "แก้ไขข้อมูลที่ผิดพลาดหรือล้าสมัย",
      "ลบข้อมูลที่เราไม่จำเป็นต้องเก็บอีกต่อไป หรือที่คุณไม่ยินยอมให้เก็บอีกต่อไป",
      "หยุดการประมวลผลข้อมูลของคุณเมื่อคุณถอนความยินยอม โดยไม่กระทบสิ่งที่ดำเนินการไปแล้วภายใต้ความยินยอมนั้น",
    ],
    choicesBody:
      "คุณสามารถล้างคุกกี้ได้ทุกเมื่อผ่านการตั้งค่าเบราว์เซอร์ ซึ่งแปลว่าเราจะถามภาษาที่คุณต้องการอีกครั้งเท่านั้น หากมีคำถามเกี่ยวกับประกาศนี้หรือข้อมูลของคุณ ติดต่อเรา",
    contactCta: "ติดต่อ BIRSA",
  },
};

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
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
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.controllerTitle}</h2>
          <p className="text-muted leading-relaxed">{t.controllerBody}</p>
          <p className="text-muted leading-relaxed">
            {t.controllerAddressLabel} {contact.address[locale]}
          </p>
          <p className="text-muted leading-relaxed">
            {t.controllerEmailLabel} <Email address={contact.email} className="text-brand-deep hover:text-brand-dark" />
            {locale === "th" ? " หรือ " : " or "}
            <Email address={contact.secondaryEmail} className="text-brand-deep hover:text-brand-dark" />
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.collectTitle}</h2>
          <p className="text-muted leading-relaxed">{t.collectIntro}</p>

          <h3 className="text-ink font-semibold">{t.collectContactTitle}</h3>
          <ol className="text-muted flex list-decimal flex-col gap-2 pl-5 leading-relaxed">
            {t.collectContactSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="text-ink font-semibold">{t.collectLoanTitle}</h3>
          <ol className="text-muted flex list-decimal flex-col gap-2 pl-5 leading-relaxed">
            {t.collectLoanSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.legalTitle}</h2>
          <p className="text-muted leading-relaxed">{t.legalBody}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.retentionTitle}</h2>
          <p className="text-muted leading-relaxed">{t.retentionIntro}</p>
          <dl className="flex flex-col gap-3">
            {t.retentionList.map((item) => (
              <div key={item.label}>
                <dt className="text-ink font-semibold">{item.label}</dt>
                <dd className="text-muted leading-relaxed">{item.body}</dd>
              </div>
            ))}
          </dl>
          <Notice variant="placeholder" title={t.retentionPlaceholderTitle}>
            {t.retentionPlaceholder}
          </Notice>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.sharingTitle}</h2>
          <p className="text-muted leading-relaxed">{t.sharingIntro}</p>
          <dl className="flex flex-col gap-3">
            {t.sharingList.map((item) => (
              <div key={item.label}>
                <dt className="text-ink font-semibold">{item.label}</dt>
                <dd className="text-muted leading-relaxed">{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.transferTitle}</h2>
          <p className="text-muted leading-relaxed">{t.transferBody}</p>
          <Notice variant="placeholder" title={t.transferPlaceholderTitle}>
            {t.transferPlaceholder}
          </Notice>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.automatedTitle}</h2>
          <p className="text-muted leading-relaxed">{t.automatedBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.cookiesTitle}</h2>
          <p className="text-muted leading-relaxed">{t.cookiesBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.onboardingTitle}</h2>
          <p className="text-muted leading-relaxed">{t.onboardingBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.analyticsTitle}</h2>
          <p className="text-muted leading-relaxed">{t.analyticsBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.adsTitle}</h2>
          <p className="text-muted leading-relaxed">{t.adsBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.choicesTitle}</h2>
          <p className="text-muted leading-relaxed">{t.choicesIntro}</p>
          <ul className="text-muted flex list-disc flex-col gap-2 pl-5 leading-relaxed">
            {t.rightsList.map((right) => (
              <li key={right}>{right}</li>
            ))}
          </ul>
          <p className="text-muted leading-relaxed">
            {t.choicesBody}{" "}
            <Link
              href={localeHref(locale, "/contact")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.contactCta}
            </Link>{" "}
            {locale === "th"
              ? `หรืออีเมล ${contact.email} หรือ ${contact.secondaryEmail}`
              : `or email ${contact.email} or ${contact.secondaryEmail}.`}
          </p>
        </section>
      </div>
    </>
  );
}
