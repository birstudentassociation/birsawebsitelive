import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StepNav from "@/components/forms/StepNav";
import QuestionStepForm from "@/components/forms/QuestionStepForm";
import { buildWizardChromeLabels, formatStepOf } from "@/components/forms/wizardChromeCopy";
import { buildStartClubWizardLabels } from "@/components/forms/startClubWizardCopy";
import { getStartClubDraft, submitClubNameStep } from "./actions";
import { START_CLUB_STEPS } from "./steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "เริ่มชมรมใหม่" : "Start a club";
  const description =
    locale === "th"
      ? "ขั้นตอนง่าย ๆ ในการเริ่มชมรมนักศึกษาใหม่กับ BIRSA"
      : "The simple steps to start a new student club with BIRSA.";

  return buildMetadata({ locale, title, description, path: "/clubs/start" });
}

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    clubs: string;
    stepsTitle: string;
    steps: string[];
    checkTitle: string;
    checkBody: string;
    checkCta: string;
    formTitle: string;
  }
> = {
  en: {
    title: "Start a club",
    lede: "If a few of you share an interest that is not covered by an existing club, BIRSA can help you get a new one off the ground.",
    clubs: "Clubs",
    stepsTitle: "How it works",
    steps: [
      "Tell BIRSA your idea. Answer a few short questions about what the club would do and who it's for.",
      "Talk it through with the committee. A BIRSA committee member will get in touch to help you shape the idea and figure out what support you need (a room, a small budget, promotion).",
      "Start meeting. Run your first session, and BIRSA can help spread the word to other students.",
    ],
    checkTitle: "Check what you need first",
    checkBody:
      "A club needs a certain number of members and a committee before the Faculty or the University will register it. The guided check tells you where you stand and what to sort out first.",
    checkCta: "Check if you're ready to start a club",
    formTitle: "Tell us your idea",
  },
  th: {
    title: "เริ่มชมรมใหม่",
    lede: "ถ้าคุณและเพื่อน ๆ มีความสนใจร่วมกันที่ยังไม่มีชมรมไหนรองรับ BIRSA ช่วยให้ชมรมใหม่ของคุณเกิดขึ้นจริงได้",
    clubs: "ชมรม",
    stepsTitle: "ขั้นตอนการเริ่มชมรม",
    steps: [
      "บอกไอเดียของคุณกับ BIRSA ตอบคำถามสั้น ๆ ไม่กี่ข้อว่าชมรมนี้จะทำอะไรและเหมาะกับใคร",
      "คุยรายละเอียดกับกรรมการ กรรมการ BIRSA จะติดต่อกลับเพื่อช่วยปรับไอเดียให้ชัดเจน และดูว่าต้องการการสนับสนุนอะไรบ้าง เช่น ห้องประชุม งบประมาณเล็กน้อย หรือการประชาสัมพันธ์",
      "เริ่มนัดพบ จัดกิจกรรมแรกของชมรม BIRSA ช่วยกระจายข่าวให้เพื่อนนักศึกษาคนอื่น ๆ รู้จักด้วย",
    ],
    checkTitle: "เช็กก่อนว่าต้องเตรียมอะไรบ้าง",
    checkBody:
      "การจดทะเบียนชมรมกับคณะหรือมหาวิทยาลัยมีเงื่อนไขเรื่องจำนวนสมาชิกและคณะกรรมการ แบบสอบถามนำทางจะบอกว่าคุณพร้อมแค่ไหน และต้องเตรียมอะไรก่อน",
    checkCta: "เช็กความพร้อมก่อนเริ่มชมรม",
    formTitle: "บอกไอเดียของคุณ",
  },
};

export default async function StartClubPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const chrome = buildWizardChromeLabels(locale);
  const wizard = buildStartClubWizardLabels(locale);
  const draft = await getStartClubDraft();
  const { returnTo } = await searchParams;
  const backHref = returnTo === "check" ? localeHref(locale, "/clubs/start/check") : undefined;
  const progress =
    returnTo === "check"
      ? undefined
      : formatStepOf(
          chrome.stepOf,
          START_CLUB_STEPS.indexOf("clubName") + 1,
          START_CLUB_STEPS.length
        );

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
              { label: t.clubs, href: "/clubs" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-2xl">{t.stepsTitle}</h2>
          <ol className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted">
            {t.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-semibold text-brand-deep">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-2 rounded-lg border border-line p-5">
            <h3 className="font-display text-lg text-ink">{t.checkTitle}</h3>
            <p className="text-sm leading-relaxed text-muted">{t.checkBody}</p>
            <Link
              href={localeHref(locale, "/answers/start-a-club-check")}
              className="text-sm font-semibold text-brand-deep hover:underline"
            >
              {t.checkCta} &rarr;
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl">{t.formTitle}</h2>
          <StepNav backHref={backHref} progressText={progress} backLabel={chrome.back} />
          <h3 className="font-display text-xl sm:text-2xl">{wizard.clubNameHeading}</h3>
          <QuestionStepForm
            action={submitClubNameStep.bind(null, locale, returnTo)}
            initialState={{ status: "idle" }}
            errorSummaryTitle={wizard.errorSummaryTitle}
            continueLabel={chrome.continueLabel}
            continuingLabel={chrome.continuing}
            field={{
              name: "clubName",
              label: wizard.fieldLabels.clubName,
              hint: wizard.clubNameHint,
              required: true,
              requiredLabel: dict.actions.required,
              defaultValue: draft.clubName,
            }}
          />
        </div>
      </div>
    </>
  );
}
