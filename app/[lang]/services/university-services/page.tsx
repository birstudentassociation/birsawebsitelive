import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import ExternalLink from "@/components/ExternalLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  const title = locale === "th" ? "บริการจากมหาวิทยาลัย" : "University services";
  const description =
    locale === "th"
      ? "บริการที่มหาวิทยาลัยธรรมศาสตร์จัดให้นักศึกษาทุกคน ทั้งประกันอุบัติเหตุ การผ่อนผันเกณฑ์ทหาร การขอเอกสาร บริการให้คำปรึกษา และความช่วยเหลือด้านไอที รวบรวมไว้ในที่เดียวโดย BIRSA"
      : "Services Thammasat University provides to all students, including accident insurance, military-service postponement, certificates, counselling, and IT help, collected in one place by BIRSA.";

  return buildMetadata({
    locale,
    title,
    description,
    path: "/services/university-services",
  });
}

type TermDesc = { term: string; desc: string };
type LeadText = { lead: string; text: string };
type LinkedBlock = { title: string; body: string; linkLabel: string };

const copy: Record<
  Locale,
  {
    title: string;
    lede: string;
    onThisPageLabel: string;
    disclaimerTitle: string;
    disclaimerBody: string;
    accidentInsurance: {
      title: string;
      intro: string;
      claimTitle: string;
      claimSteps: LeadText[];
      documentsTitle: string;
      documents: string[];
      coverageTitle: string;
      coverage: TermDesc[];
      contactTitle: string;
      contacts: TermDesc[];
      linkLabel: string;
    };
    militaryService: {
      title: string;
      intro: string;
      roundsTitle: string;
      rounds: TermDesc[];
      stepsTitle: string;
      steps: string[];
      documentsLinkLabel: string;
      approvedListLinkLabel: string;
      contactLine: string;
    };
    certificates: {
      title: string;
      body: string;
      linkLabel: string;
    };
    libraries: {
      title: string;
      intro: string;
      librariesTitle: string;
      libraries: TermDesc[];
      studyRoomsTitle: string;
      studyRoomsBody: string;
      bookingLinkLabel: string;
      printingTitle: string;
      printingIntro: string;
      printingFunds: TermDesc[];
      libraryLinkLabel: string;
    };
    sportFitness: {
      title: string;
      body: string;
    };
    domeAccount: {
      title: string;
      body: string;
    };
    counselling: {
      title: string;
      intro: string;
      wellBeing: LinkedBlock;
      psychologist: LinkedBlock;
      bedee: { title: string; body: string };
    };
    itSupport: {
      title: string;
      helpdesk: LinkedBlock;
      appStore: LinkedBlock;
    };
    closing: {
      title: string;
      body: string;
      cta: string;
    };
  }
> = {
  en: {
    title: "University services",
    lede: "Services and support Thammasat University provides to every student. BIRSA collects them here for BIR students; the services themselves are run by the University and its offices.",
    onThisPageLabel: "On this page",
    disclaimerTitle: "These are University-run services",
    disclaimerBody:
      "BIRSA lists them for convenience but does not operate them. Dates and requirements can change. Always confirm the latest details on the official channel linked in each section before you act.",
    accidentInsurance: {
      title: "Accident insurance for TU students",
      intro:
        "Every Thammasat student is covered. Academic year 2025 coverage runs 1 Aug 2025 to 31 Jul 2026.",
      claimTitle: "How to make a claim",
      claimSteps: [
        {
          lead: "Verify your rights",
          text: "show your national ID card (or passport) and student ID card to the hospital staff.",
        },
        {
          lead: "Direct claim",
          text: "if your name is on the policy and you're treated at a partner hospital (such as Thammasat Hospital), you can claim benefits directly without paying in advance.",
        },
        {
          lead: "Advance payment",
          text: "if your name is not listed yet, or the hospital is not a partner, pay first and submit the documents below to the responsible officer to forward to the insurer.",
        },
      ],
      documentsTitle: "Documents for an advance-payment claim",
      documents: [
        "Compensation claim form (AC_01): download from the TU Student Affairs Division website or ask the responsible officer",
        "Original medical certificate",
        "Original medical receipt",
        "One copy of your ID card, certified with a blue pen",
        "One copy of your bank account page, certified with a blue pen",
      ],
      coverageTitle: "What's covered",
      coverage: [
        {
          term: "Medical expenses",
          desc: "Up to 15,000 baht per accident (general accidents, subject to policy exclusions)",
        },
        {
          term: "Death or disability from an accident",
          desc: "150,000 baht: death, loss of organs, eyesight, hearing or speech, or permanent disability from accidents, including murder and assault",
        },
        {
          term: "Funeral costs (death from illness)",
          desc: "15,000 baht",
        },
      ],
      contactTitle: "Who to contact",
      contacts: [
        { term: "Rangsit", desc: "Student Affairs Division, Building B · 02-564-4440 ext. 1275" },
        {
          term: "Tha Prachan",
          desc: "Student Activities Building, 3rd floor · 02-221-6111 ext. 1710",
        },
        { term: "Lampang", desc: "Student Affairs · 054-237-999 ext. 5171" },
        { term: "Pattaya", desc: "Pattaya Campus Administration · 038-259-050 ext. 1202" },
      ],
      linkLabel: "Full insurance details",
    },
    militaryService: {
      title: "Military service postponement",
      intro:
        "For male students born in 2006 (B.E. 2549) at the Tha Prachan, Rangsit and Pattaya campuses. Submit in one round only.",
      roundsTitle: "Submission rounds (choose one)",
      rounds: [
        { term: "Round 1", desc: "10 August to 9 October 2026" },
        { term: "Round 2", desc: "11 January to 10 February 2027" },
      ],
      stepsTitle: "What to do",
      steps: [
        "Submit your documents both ways: upload the files online and hand in the paper copies at the University.",
        "The University checks your status.",
        "The list of approved students is announced.",
        "Report to the authorities as instructed in your call-up notice.",
      ],
      documentsLinkLabel: "Documents and instructions",
      approvedListLinkLabel: "Check last year's approved list",
      contactLine:
        "Questions: Scholarships, Discipline and Student Welfare, Student Affairs Division: 0-2564-2921 (Facebook: TU Scholarships).",
    },
    certificates: {
      title: "Online certificate requests",
      body: "Request official documents such as enrolment and graduation certificates online through the TU REG registration system.",
      linkLabel: "Open TU REG",
    },
    libraries: {
      title: "Libraries, study rooms and printing",
      intro:
        "Your status as a Thammasat student gives you access to the University's libraries, bookable study rooms, and a printing allowance every semester.",
      librariesTitle: "Libraries at and near Tha Prachan",
      libraries: [
        {
          term: "Pridi Banomyong Library",
          desc: "Thammasat's main central library, at Tha Prachan.",
        },
        {
          term: "Professor Direk Jayanama Library",
          desc: "The library for the Faculty of Political Science and other social-science faculties.",
        },
        {
          term: "Puey Ungphakorn Library (Faculty of Economics)",
          desc: "The Faculty of Economics library, at Tha Prachan.",
        },
        {
          term: "Sanya Dharmasakti Library",
          desc: "The Faculty of Law library.",
        },
      ],
      studyRoomsTitle: "Study rooms",
      studyRoomsBody: "Group study rooms across these libraries can be booked online in advance.",
      bookingLinkLabel: "Book a study room",
      printingTitle: "Printing allowance",
      printingIntro:
        "Every semester you receive a printing quota split between two funds, for 200 baht in total.",
      printingFunds: [
        { term: "Faculty fund", desc: "100 baht per semester" },
        { term: "University fund", desc: "100 baht per semester" },
      ],
      libraryLinkLabel: "Thammasat University Library",
    },
    sportFitness: {
      title: "Sport and fitness",
      body: "The Thammasat University Sport and Fitness Center gives students access to fitness facilities and a gym on campus.",
    },
    domeAccount: {
      title: "Your Dome account",
      body: "Every Thammasat student is issued a Dome account: the single university login used across TU's online systems, including course registration (TU REG), your university email, campus Wi-Fi, and apps such as TU GREATS.",
    },
    counselling: {
      title: "Counselling and mental-health support",
      intro: "Free, confidential support for TU students. Three ways to get help:",
      wellBeing: {
        title: "Thammasat Well Being Center",
        body: "Appointments and counselling for all TU students, day or night. Call 02-026-2345, press 2 (available 24 hours). You can also book and take a well-being self-assessment in the TU GREATS app under Services → TU Well Being.",
        linkLabel: "About the Well Being Center",
      },
      psychologist: {
        title: "Faculty psychologist (Political Science)",
        body: "One-on-one counselling by a professional psychologist, for Faculty of Political Science students specifically. Book a time online.",
        linkLabel: "Booking form",
      },
      bedee: {
        title: "BeDee by BDMS",
        body: "Telehealth consultations through the BeDee app by BDMS.",
      },
    },
    itSupport: {
      title: "IT support and TU apps",
      helpdesk: {
        title: "ICT Helpdesk",
        body: "Get help with TU accounts, Wi-Fi, email and university systems via LINE (@icttuhelpdesk).",
        linkLabel: "Open ICT Helpdesk on LINE",
      },
      appStore: {
        title: "TU application store",
        body: "Find the official Thammasat apps, including TU GREATS, in the TU application store.",
        linkLabel: "Browse TU apps",
      },
    },
    closing: {
      title: "Report a problem with this page",
      body: "If you spot something wrong or outdated on this page, tell BIRSA.",
      cta: "Report a gap",
    },
  },
  th: {
    title: "บริการจากมหาวิทยาลัย",
    lede: "บริการและความช่วยเหลือที่มหาวิทยาลัยธรรมศาสตร์จัดให้นักศึกษาทุกคน BIRSA รวบรวมไว้ที่นี่เพื่อนักศึกษา BIR ส่วนตัวบริการดำเนินการโดยมหาวิทยาลัยและหน่วยงานที่เกี่ยวข้อง",
    onThisPageLabel: "ในหน้านี้",
    disclaimerTitle: "บริการเหล่านี้ดำเนินการโดยมหาวิทยาลัย",
    disclaimerBody:
      "BIRSA รวบรวมไว้เพื่อความสะดวก แต่ไม่ได้เป็นผู้ดำเนินการ กำหนดการและเงื่อนไขอาจเปลี่ยนแปลงได้ กรุณาตรวจสอบข้อมูลล่าสุดจากช่องทางทางการที่ลิงก์ไว้ในแต่ละหัวข้อก่อนดำเนินการทุกครั้ง",
    accidentInsurance: {
      title: "ประกันอุบัติเหตุสำหรับนักศึกษาธรรมศาสตร์",
      intro:
        "นักศึกษาธรรมศาสตร์ทุกคนได้รับความคุ้มครอง ปีการศึกษา 2568 คุ้มครองระหว่าง 1 ส.ค. 2568 ถึง 31 ก.ค. 2569",
      claimTitle: "วิธียื่นเคลม",
      claimSteps: [
        {
          lead: "ยืนยันสิทธิ์",
          text: "แสดงบัตรประชาชน (หรือพาสปอร์ต) และบัตรนักศึกษาต่อเจ้าหน้าที่โรงพยาบาล",
        },
        {
          lead: "เคลมตรง",
          text: "หากชื่อของคุณอยู่ในกรมธรรม์และเข้ารับการรักษาที่โรงพยาบาลคู่สัญญา (เช่น โรงพยาบาลธรรมศาสตร์) สามารถเบิกได้โดยตรงโดยไม่ต้องสำรองจ่าย",
        },
        {
          lead: "สำรองจ่าย",
          text: "หากยังไม่มีชื่อในกรมธรรม์ หรือโรงพยาบาลไม่ใช่คู่สัญญา ให้สำรองจ่ายก่อน แล้วยื่นเอกสารด้านล่างต่อเจ้าหน้าที่ผู้รับผิดชอบเพื่อส่งให้บริษัทประกัน",
        },
      ],
      documentsTitle: "เอกสารสำหรับการเคลมแบบสำรองจ่าย",
      documents: [
        "แบบฟอร์มเบิกค่าสินไหม (AC_01): ดาวน์โหลดจากเว็บไซต์กองกิจการนักศึกษา มธ. หรือขอจากเจ้าหน้าที่ผู้รับผิดชอบ",
        "ใบรับรองแพทย์ฉบับจริง",
        "ใบเสร็จค่ารักษาพยาบาลฉบับจริง",
        "สำเนาบัตรประชาชน 1 ชุด รับรองสำเนาด้วยปากกาสีน้ำเงิน",
        "สำเนาหน้าสมุดบัญชีธนาคาร 1 ชุด รับรองสำเนาด้วยปากกาสีน้ำเงิน",
      ],
      coverageTitle: "ความคุ้มครอง",
      coverage: [
        {
          term: "ค่ารักษาพยาบาล",
          desc: "สูงสุด 15,000 บาทต่ออุบัติเหตุ (อุบัติเหตุทั่วไป ตามเงื่อนไขยกเว้นในกรมธรรม์)",
        },
        {
          term: "เสียชีวิตหรือทุพพลภาพจากอุบัติเหตุ",
          desc: "150,000 บาท: เสียชีวิต สูญเสียอวัยวะ สายตา การได้ยิน การพูด หรือทุพพลภาพถาวรจากอุบัติเหตุ รวมถึงการถูกฆาตกรรมและทำร้ายร่างกาย",
        },
        {
          term: "ค่าปลงศพ (เสียชีวิตจากการเจ็บป่วยทั่วไป)",
          desc: "15,000 บาท",
        },
      ],
      contactTitle: "ติดต่อสอบถาม",
      contacts: [
        { term: "ศูนย์รังสิต", desc: "งานยุทธศาสตร์กิจการนักศึกษา · 02-564-4440 ต่อ 1275" },
        { term: "ท่าพระจันทร์", desc: "ตึกกิจกรรมนักศึกษา ชั้น 3 · 02-221-6111 ต่อ 1710" },
        { term: "ศูนย์ลำปาง", desc: "ฝ่ายการนักศึกษา · 054-237-999 ต่อ 5171" },
        { term: "ศูนย์พัทยา", desc: "กองบริหารศูนย์พัทยา · 038-259-050 ต่อ 1202" },
      ],
      linkLabel: "รายละเอียดประกันฉบับเต็ม",
    },
    militaryService: {
      title: "การผ่อนผันการเกณฑ์ทหาร",
      intro:
        "สำหรับนักศึกษาชายที่เกิด พ.ศ. 2549 ศูนย์ท่าพระจันทร์ / ศูนย์รังสิต / ศูนย์พัทยา เลือกยื่นเพียงรอบเดียว",
      roundsTitle: "รอบการยื่น (เลือกรอบเดียว)",
      rounds: [
        { term: "รอบที่ 1", desc: "10 สิงหาคม ถึง 9 ตุลาคม 2569" },
        { term: "รอบที่ 2", desc: "11 มกราคม ถึง 10 กุมภาพันธ์ 2570" },
      ],
      stepsTitle: "ขั้นตอนการดำเนินการ",
      steps: [
        "ยื่นเอกสารทั้งสองรูปแบบ: ส่งไฟล์ผ่านระบบออนไลน์ และส่งฉบับกระดาษที่มหาวิทยาลัย",
        "มหาวิทยาลัยตรวจสอบสถานะ",
        "ประกาศรายชื่อผู้ได้รับสิทธิ์",
        "ไปรายงานตัวตามหมายเรียก",
      ],
      documentsLinkLabel: "เอกสารและคำแนะนำ",
      approvedListLinkLabel: "ตรวจสอบรายชื่อผู้ได้สิทธิ์ปีที่ผ่านมา",
      contactLine:
        "สอบถาม: งานทุน วินัย และสวัสดิการนักศึกษา กองกิจการนักศึกษา: 0-2564-2921 (เฟซบุ๊ก: TU Scholarships)",
    },
    certificates: {
      title: "การขอเอกสารสำคัญออนไลน์",
      body: "ขอเอกสารทางการ เช่น หนังสือรับรองการเป็นนักศึกษาและใบรับรองต่าง ๆ ผ่านระบบทะเบียน TU REG ออนไลน์",
      linkLabel: "เข้าสู่ระบบ TU REG",
    },
    libraries: {
      title: "ห้องสมุด ห้องอ่านหนังสือ และสิทธิ์การพิมพ์",
      intro:
        "สถานะนักศึกษาธรรมศาสตร์ของคุณให้สิทธิ์เข้าใช้ห้องสมุดของมหาวิทยาลัย จองห้องอ่านหนังสือ และรับสิทธิ์การพิมพ์เอกสารทุกภาคการศึกษา",
      librariesTitle: "ห้องสมุดในและใกล้ท่าพระจันทร์",
      libraries: [
        {
          term: "หอสมุดปรีดี พนมยงค์",
          desc: "หอสมุดกลางหลักของมหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
        },
        {
          term: "ห้องสมุดศาสตราจารย์ดิเรก ชัยนาม",
          desc: "ห้องสมุดคณะรัฐศาสตร์และกลุ่มคณะทางสังคมศาสตร์",
        },
        {
          term: "หอสมุดป๋วย อึ๊งภากรณ์ (คณะเศรษฐศาสตร์)",
          desc: "ห้องสมุดคณะเศรษฐศาสตร์ ท่าพระจันทร์",
        },
        {
          term: "หอสมุดสัญญา ธรรมศักดิ์",
          desc: "ห้องสมุดคณะนิติศาสตร์",
        },
      ],
      studyRoomsTitle: "ห้องอ่านหนังสือ",
      studyRoomsBody:
        "ห้องอ่านหนังสือแบบกลุ่มของห้องสมุดเหล่านี้สามารถจองล่วงหน้าผ่านระบบออนไลน์ได้",
      bookingLinkLabel: "จองห้องอ่านหนังสือ",
      printingTitle: "สิทธิ์การพิมพ์เอกสาร",
      printingIntro:
        "ทุกภาคการศึกษาคุณจะได้รับสิทธิ์การพิมพ์เอกสารจาก 2 กองทุน รวมทั้งสิ้น 200 บาท",
      printingFunds: [
        { term: "กองทุนจากคณะ", desc: "100 บาทต่อภาคการศึกษา" },
        { term: "กองทุนจากมหาวิทยาลัย", desc: "100 บาทต่อภาคการศึกษา" },
      ],
      libraryLinkLabel: "หอสมุดมหาวิทยาลัยธรรมศาสตร์",
    },
    sportFitness: {
      title: "กีฬาและการออกกำลังกาย",
      body: "ศูนย์กีฬาและฟิตเนสของมหาวิทยาลัยธรรมศาสตร์เปิดให้นักศึกษาเข้าใช้สิ่งอำนวยความสะดวกด้านกีฬาและฟิตเนสภายในมหาวิทยาลัย",
    },
    domeAccount: {
      title: "บัญชี Dome ของคุณ",
      body: "นักศึกษาธรรมศาสตร์ทุกคนจะได้รับบัญชี Dome ซึ่งเป็นบัญชีเดียวที่ใช้เข้าสู่ระบบออนไลน์ต่าง ๆ ของมหาวิทยาลัย ทั้งระบบทะเบียน (TU REG) อีเมลมหาวิทยาลัย Wi-Fi ภายในมหาวิทยาลัย และแอปพลิเคชันต่าง ๆ เช่น TU GREATS",
    },
    counselling: {
      title: "บริการให้คำปรึกษาและสุขภาพจิต",
      intro: "บริการฟรีและเป็นความลับสำหรับนักศึกษาธรรมศาสตร์ มี 3 ช่องทาง",
      wellBeing: {
        title: "ศูนย์สุขภาวะธรรมศาสตร์ (TU Well Being Center)",
        body: "นัดหมายและปรึกษาสำหรับนักศึกษาธรรมศาสตร์ทุกคน โทร 02-026-2345 กด 2 (ตลอด 24 ชั่วโมง) หรือจองและทำแบบประเมินสุขภาวะผ่านแอป TU GREATS ที่เมนู Services → TU Well Being",
        linkLabel: "ข้อมูลศูนย์สุขภาวะ",
      },
      psychologist: {
        title: "นักจิตวิทยาประจำคณะรัฐศาสตร์",
        body: "ปรึกษาแบบตัวต่อตัวกับนักจิตวิทยาอาชีพ เฉพาะนักศึกษาคณะรัฐศาสตร์ จองเวลาออนไลน์ได้",
        linkLabel: "แบบฟอร์มจองเวลา",
      },
      bedee: {
        title: "BeDee by BDMS",
        body: "ปรึกษาสุขภาพทางไกลผ่านแอป BeDee โดย BDMS",
      },
    },
    itSupport: {
      title: "ความช่วยเหลือด้านไอทีและแอปของมหาวิทยาลัย",
      helpdesk: {
        title: "ศูนย์ช่วยเหลือไอที (ICT Helpdesk)",
        body: "ขอความช่วยเหลือเรื่องบัญชี มธ. Wi-Fi อีเมล และระบบต่าง ๆ ผ่าน LINE (@icttuhelpdesk)",
        linkLabel: "เปิด ICT Helpdesk บน LINE",
      },
      appStore: {
        title: "คลังแอปพลิเคชันของมหาวิทยาลัย",
        body: "ค้นหาแอปทางการของธรรมศาสตร์ รวมถึง TU GREATS ได้ที่คลังแอปของมหาวิทยาลัย",
        linkLabel: "ดูแอปของมหาวิทยาลัย",
      },
    },
    closing: {
      title: "แจ้งปัญหาเกี่ยวกับหน้านี้",
      body: "หากพบข้อมูลผิดหรือล้าสมัยในหน้านี้ แจ้ง BIRSA ได้",
      cta: "แจ้งข้อมูลที่ขาดหาย",
    },
  },
};

export default async function UniversityServicesPage({
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

  const linkClass = "text-brand-deep hover:text-brand-dark font-semibold underline";

  const sections = [
    { id: "accident-insurance", label: t.accidentInsurance.title },
    { id: "military-service", label: t.militaryService.title },
    { id: "certificates", label: t.certificates.title },
    { id: "libraries", label: t.libraries.title },
    { id: "sport-fitness", label: t.sportFitness.title },
    { id: "dome-account", label: t.domeAccount.title },
    { id: "counselling", label: t.counselling.title },
    { id: "it-support", label: t.itSupport.title },
  ];

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
              { label: infoServicesLabel, href: "/services" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <nav aria-label={t.onThisPageLabel} className="flex flex-col gap-2">
          <p className="text-muted text-sm font-semibold tracking-wide uppercase">
            {t.onThisPageLabel}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`${linkClass} inline-flex min-h-11 items-center`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Notice variant="info" title={t.disclaimerTitle}>
          <p>{t.disclaimerBody}</p>
        </Notice>

        <section
          id="accident-insurance"
          aria-labelledby="accident-insurance-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="accident-insurance-heading" className="font-display text-2xl">
            {t.accidentInsurance.title}
          </h2>
          <p className="text-muted leading-relaxed">{t.accidentInsurance.intro}</p>

          <div className="border-line bg-sunken flex flex-col gap-3 rounded-lg border p-6">
            <h3 className="font-display text-lg">{t.accidentInsurance.claimTitle}</h3>
            <ol className="text-muted flex flex-col gap-2 text-sm leading-relaxed">
              {t.accidentInsurance.claimSteps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink font-semibold">
                    {index + 1}.
                  </span>
                  <span>
                    <strong className="text-ink">{step.lead}:</strong> {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-line bg-sunken flex flex-col gap-3 rounded-lg border p-6">
            <h3 className="font-display text-lg">{t.accidentInsurance.documentsTitle}</h3>
            <ul className="text-muted flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
              {t.accidentInsurance.documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg">{t.accidentInsurance.coverageTitle}</h3>
            <dl className="mt-2 flex flex-col gap-3">
              {t.accidentInsurance.coverage.map((row, index) => (
                <div key={index} className="border-line border-b pb-2">
                  <dt className="text-ink font-semibold">{row.term}</dt>
                  <dd className="text-muted text-sm leading-relaxed">{row.desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="font-display text-lg">{t.accidentInsurance.contactTitle}</h3>
            <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {t.accidentInsurance.contacts.map((row, index) => (
                <div key={index} className="border-line bg-sunken rounded-lg border p-4">
                  <dt className="text-ink font-semibold">{row.term}</dt>
                  <dd className="text-muted text-sm leading-relaxed">{row.desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p>
            <ExternalLink
              href="http://satu.colorpack.net/index.php/th/student-services/accident-insurance"
              newTabLabel={dict.a11y.newTab}
              className={linkClass}
            >
              {t.accidentInsurance.linkLabel}
            </ExternalLink>
          </p>
        </section>

        <section
          id="military-service"
          aria-labelledby="military-service-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="military-service-heading" className="font-display text-2xl">
            {t.militaryService.title}
          </h2>
          <p className="text-muted leading-relaxed">{t.militaryService.intro}</p>

          <div>
            <h3 className="font-display text-lg">{t.militaryService.roundsTitle}</h3>
            <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {t.militaryService.rounds.map((row, index) => (
                <div key={index} className="border-line bg-sunken rounded-lg border p-4">
                  <dt className="text-ink font-semibold">{row.term}</dt>
                  <dd className="text-muted text-sm leading-relaxed">{row.desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-line bg-sunken flex flex-col gap-3 rounded-lg border p-6">
            <h3 className="font-display text-lg">{t.militaryService.stepsTitle}</h3>
            <ol className="text-muted flex flex-col gap-2 text-sm leading-relaxed">
              {t.militaryService.steps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink font-semibold">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <ExternalLink
                href="https://drive.google.com/file/d/1-88fSuUc4VrKAAO-wQytYRoLaFM6qge9/view?usp=sharing"
                newTabLabel={dict.a11y.newTab}
                className={linkClass}
              >
                {t.militaryService.documentsLinkLabel}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                href="https://docs.google.com/spreadsheets/d/1nJOQvregi3ja7_xJYs1RAe8HWuWW4vZ5ls56_D8YdNQ/edit?usp=sharing"
                newTabLabel={dict.a11y.newTab}
                className={linkClass}
              >
                {t.militaryService.approvedListLinkLabel}
              </ExternalLink>
            </li>
          </ul>

          <p className="text-muted text-sm leading-relaxed">{t.militaryService.contactLine}</p>
        </section>

        <section
          id="certificates"
          aria-labelledby="certificates-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="certificates-heading" className="font-display text-2xl">
            {t.certificates.title}
          </h2>
          <p className="text-muted leading-relaxed">{t.certificates.body}</p>
          <p>
            <ExternalLink
              href="https://www.reg.tu.ac.th/"
              newTabLabel={dict.a11y.newTab}
              className={linkClass}
            >
              {t.certificates.linkLabel}
            </ExternalLink>
          </p>
        </section>

        <section id="libraries" aria-labelledby="libraries-heading" className="flex flex-col gap-4">
          <h2 id="libraries-heading" className="font-display text-2xl">
            {t.libraries.title}
          </h2>
          <p className="text-muted leading-relaxed">{t.libraries.intro}</p>

          <div>
            <h3 className="font-display text-lg">{t.libraries.librariesTitle}</h3>
            <dl className="mt-2 flex flex-col gap-3">
              {t.libraries.libraries.map((row, index) => (
                <div key={index} className="border-line border-b pb-2">
                  <dt className="text-ink font-semibold">{row.term}</dt>
                  <dd className="text-muted text-sm leading-relaxed">{row.desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-line bg-sunken flex flex-col gap-2 rounded-lg border p-6">
            <h3 className="font-display text-lg">{t.libraries.studyRoomsTitle}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.libraries.studyRoomsBody}</p>
            <p>
              <ExternalLink
                href="https://booking.library.tu.ac.th"
                newTabLabel={dict.a11y.newTab}
                className={linkClass}
              >
                {t.libraries.bookingLinkLabel}
              </ExternalLink>
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg">{t.libraries.printingTitle}</h3>
            <p className="text-muted mt-1 text-sm leading-relaxed">{t.libraries.printingIntro}</p>
            <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {t.libraries.printingFunds.map((row, index) => (
                <div key={index} className="border-line bg-sunken rounded-lg border p-4">
                  <dt className="text-ink font-semibold">{row.term}</dt>
                  <dd className="text-muted text-sm leading-relaxed">{row.desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p>
            <ExternalLink
              href="https://library.tu.ac.th"
              newTabLabel={dict.a11y.newTab}
              className={linkClass}
            >
              {t.libraries.libraryLinkLabel}
            </ExternalLink>
          </p>
        </section>

        <section
          id="sport-fitness"
          aria-labelledby="sport-fitness-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="sport-fitness-heading" className="font-display text-2xl">
            {t.sportFitness.title}
          </h2>
          <p className="text-muted leading-relaxed">{t.sportFitness.body}</p>
        </section>

        <section
          id="dome-account"
          aria-labelledby="dome-account-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="dome-account-heading" className="font-display text-2xl">
            {t.domeAccount.title}
          </h2>
          <p className="text-muted leading-relaxed">{t.domeAccount.body}</p>
        </section>

        <section
          id="counselling"
          aria-labelledby="counselling-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="counselling-heading" className="font-display text-2xl">
            {t.counselling.title}
          </h2>
          <p className="text-muted leading-relaxed">{t.counselling.intro}</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="border-line bg-sunken flex flex-col gap-2 rounded-lg border p-6">
              <h3 className="font-display text-lg">{t.counselling.wellBeing.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.counselling.wellBeing.body}</p>
              <p>
                <ExternalLink
                  href="https://www.facebook.com/permalink.php?story_fbid=1139583574836463&id=100063544931301&locale=th_TH"
                  newTabLabel={dict.a11y.newTab}
                  className={linkClass}
                >
                  {t.counselling.wellBeing.linkLabel}
                </ExternalLink>
              </p>
            </div>

            <div className="border-line bg-sunken flex flex-col gap-2 rounded-lg border p-6">
              <h3 className="font-display text-lg">{t.counselling.psychologist.title}</h3>
              <p className="text-muted text-sm leading-relaxed">
                {t.counselling.psychologist.body}
              </p>
              <p>
                <ExternalLink
                  href="https://docs.google.com/forms/d/e/1FAIpQLSd2r-09b7q6RI3bymPI6qhgKopCPXUZ-gyoxoYb9ClLXNm8wg/viewform"
                  newTabLabel={dict.a11y.newTab}
                  className={linkClass}
                >
                  {t.counselling.psychologist.linkLabel}
                </ExternalLink>
              </p>
            </div>

            <div className="border-line bg-sunken flex flex-col gap-2 rounded-lg border p-6">
              <h3 className="font-display text-lg">{t.counselling.bedee.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.counselling.bedee.body}</p>
            </div>
          </div>
        </section>

        <section
          id="it-support"
          aria-labelledby="it-support-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="it-support-heading" className="font-display text-2xl">
            {t.itSupport.title}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border-line bg-sunken flex flex-col gap-2 rounded-lg border p-6">
              <h3 className="font-display text-lg">{t.itSupport.helpdesk.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.itSupport.helpdesk.body}</p>
              <p>
                <ExternalLink
                  href="https://page.line.me/pib5088f"
                  newTabLabel={dict.a11y.newTab}
                  className={linkClass}
                >
                  {t.itSupport.helpdesk.linkLabel}
                </ExternalLink>
              </p>
            </div>

            <div className="border-line bg-sunken flex flex-col gap-2 rounded-lg border p-6">
              <h3 className="font-display text-lg">{t.itSupport.appStore.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{t.itSupport.appStore.body}</p>
              <p>
                <ExternalLink
                  href="https://ict.tu.ac.th/index.php/th/it-ict/personnel-information-system/tu-application-store"
                  newTabLabel={dict.a11y.newTab}
                  className={linkClass}
                >
                  {t.itSupport.appStore.linkLabel}
                </ExternalLink>
              </p>
            </div>
          </div>
        </section>

        <section className="border-line bg-sunken flex flex-col gap-3 rounded-lg border p-8">
          <h2 className="font-display text-2xl">{t.closing.title}</h2>
          <p className="text-muted max-w-[var(--measure)] text-sm leading-relaxed">
            {t.closing.body}{" "}
            <a href={localeHref(locale, "/contact")} className={linkClass}>
              {t.closing.cta}
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
