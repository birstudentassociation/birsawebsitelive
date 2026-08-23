import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import Notice from "@/components/bds/Notice";
import ExternalLink from "@/components/bds/ExternalLink";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";

/**
 * `/help/university-services` (ROUTE-MAP-2.0 Wave 5C,
 * SCOPE-AUDIT-2.0 §3.4 SIGNPOST row for
 * `app/[lang]/services/university-services/page.tsx`, plus the §3.2 ABSORB
 * row for `home/study-support.mdx`).
 *
 * The audit calls the 1.0 page "already the signpost pattern §3.6 asks
 * for", so this page carries its content forward through `bds/`
 * primitives rather than raw Tailwind (defect D7), and folds in
 * `study-support.mdx`'s library entitlements, room booking steps and
 * TU-GET table, since that page had "essentially no BIR-specific slice"
 * and already duplicated this one on libraries and printing.
 * `international/phones-and-internet.mdx`'s "connecting to TU wifi"
 * paragraph is folded into the Dome account section per the audit's Target
 * column for that page, rather than restated in full.
 *
 * The printing quota (200 baht, split across two 100 baht funds) was
 * already corrected before this audit was approved (DECISIONS-2.0.md
 * Gate 2) and matches `home/study-support.mdx`'s own figure; not
 * re-decided here.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type TermDesc = { term: string; desc: string };
type LeadText = { lead: string; text: string };

const copy = {
  en: {
    title: "University services",
    lede: "Services and support Thammasat University provides to every student. BIRSA collects them here for BIR students; the services themselves are run by the University and its offices.",
    onThisPageLabel: "On this page",
    disclaimerTitle: "These are University-run services",
    disclaimerBody:
      "BIRSA lists them for convenience but does not operate them. Dates and requirements can change. Always confirm the latest details on the official channel linked in each section before you act.",
    sections: {
      accidentInsurance: {
        title: "Accident insurance for TU students",
        intro:
          "Every Thammasat student is covered. Academic year 2025 coverage runs 1 August 2025 to 31 July 2026.",
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
        ] as LeadText[],
        documentsTitle: "Documents for an advance-payment claim",
        documents: [
          "Compensation claim form (AC_01), from the TU Student Affairs Division website or the responsible officer",
          "Original medical certificate",
          "Original medical receipt",
          "One copy of your ID card, certified with a blue pen",
          "One copy of your bank account page, certified with a blue pen",
        ],
        coverageTitle: "What's covered",
        coverage: [
          {
            term: "Medical expenses",
            desc: "Up to 15,000 baht per accident, general accidents, subject to policy exclusions",
          },
          {
            term: "Death or disability from an accident",
            desc: "150,000 baht for death, loss of organs, eyesight, hearing or speech, or permanent disability from accidents, including murder and assault",
          },
          { term: "Funeral costs (death from illness)", desc: "15,000 baht" },
        ] as TermDesc[],
        contactTitle: "Who to contact",
        contacts: [
          { term: "Rangsit", desc: "Student Affairs Division, Building B, 02-564-4440 ext. 1275" },
          { term: "Tha Prachan", desc: "Student Activities Building, 3rd floor, 02-221-6111 ext. 1710" },
          { term: "Lampang", desc: "Student Affairs, 054-237-999 ext. 5171" },
          { term: "Pattaya", desc: "Pattaya Campus Administration, 038-259-050 ext. 1202" },
        ] as TermDesc[],
        linkLabel: "Full insurance details",
      },
      militaryService: {
        title: "Military service postponement",
        intro:
          "For male students born in 2006 (B.E. 2549) at the Tha Prachan, Rangsit and Pattaya campuses. Submit in one round only.",
        roundsTitle: "Submission rounds, choose one",
        rounds: [
          { term: "Round 1", desc: "10 August to 9 October 2026" },
          { term: "Round 2", desc: "11 January to 10 February 2027" },
        ] as TermDesc[],
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
          "Questions: Scholarships, Discipline and Student Welfare, Student Affairs Division, 0-2564-2921 (Facebook: TU Scholarships).",
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
          { term: "Pridi Banomyong Library", desc: "Thammasat's main central library, at Tha Prachan. Open daily, 08:30 to 21:30, except public holidays." },
          { term: "Professor Direk Jayanama Library", desc: "The library for the Faculty of Political Science and other social-science faculties." },
          { term: "Puey Ungphakorn Library (Faculty of Economics)", desc: "The Faculty of Economics library, at Tha Prachan." },
          { term: "Sanya Dharmasakti Library", desc: "The Faculty of Law library." },
        ] as TermDesc[],
        cardEntitlementTitle: "What your library card entitles you to",
        cardEntitlement: [
          "Borrowing up to 25 books at a time, for 30 days.",
          "Book Delivery, which moves a book between Thammasat's library branches for you.",
          "Full Text Finder, for locating articles, journals, e-books and theses.",
        ],
        studyRoomsTitle: "Booking a study room",
        studyRoomsBody:
          "Rooms at Pridi Banomyong Library, including reading, working, meeting and film rooms, are booked through the library's LINE account, published under both @Lifeonline and @TULIBLifeOnline. Add the account, choose Booking, then choose the room, time slot and co-booking code.",
        bookingLinkLabel: "Book a study room",
        libraryOfThingsTitle: "Library of Things",
        libraryOfThingsBody:
          "The library also lends out equipment against your student card, including laptops, iPads, cameras, extension leads, heaters, hot water bottles and board games.",
        printingTitle: "Printing allowance",
        printingIntro: "Every semester you receive a printing quota split between two funds, for 200 baht in total.",
        printingFunds: [
          { term: "Faculty fund", desc: "100 baht per semester" },
          { term: "University fund", desc: "100 baht per semester" },
        ] as TermDesc[],
        researchTitle: "Research and writing support",
        research: [
          "Turnitin and the library's AI Tools Services check your own work for plagiarism and AI-generated content, free of charge, before you submit it.",
          "English abstract editing, through U-Services: upload your abstract and a language specialist edits it, returned by email within three working days.",
        ],
        tuGetTitle: "TU-GET",
        tuGetIntro:
          "Thammasat's own English proficiency test. Results can be used to apply for credit exemption, or compared against TOEFL iBT and IELTS scores.",
        tuGetColumns: ["", "TU-GET PBT", "TU-GET CBT"],
        tuGetRows: [
          { label: "Format", pbt: "Paper-based, multiple choice", cbt: "Computer-based, all four skills" },
          { label: "Fee", pbt: "800 baht (1,000 baht late)", cbt: "1,500 baht (1,800 baht late)" },
          { label: "Results", pbt: "About 5 to 7 days", cbt: "About 15 days" },
        ],
        tuGetLinkLabel: "TU-GET registration",
        libraryLinkLabel: "Thammasat University Library",
      },
      sportFitness: {
        title: "Sport and fitness",
        body: "The Thammasat University Sport and Fitness Center gives students access to fitness facilities and a gym on campus.",
      },
      domeAccount: {
        title: "Your Dome account and campus wifi",
        body: "Every Thammasat student is issued a Dome account: the single university login used across TU's online systems, including course registration (TU REG), your university email, and apps such as TU GREATS. Your Dome account credentials are also what connects you to campus wifi.",
      },
      counselling: {
        title: "Counselling and mental-health support",
        intro: "Free, confidential support for TU students. Three ways to get help.",
        wellBeing: {
          title: "Thammasat Well Being Center",
          body: "Appointments and counselling for all TU students, day or night. Call 02-026-2345, press 2 (available 24 hours). You can also book and take a well-being self-assessment in the TU GREATS app under Services, TU Well Being.",
          linkLabel: "About the Well Being Center",
        },
        psychologist: {
          title: "Faculty psychologist (Political Science)",
          body: "One-on-one counselling by a professional psychologist, for Faculty of Political Science students specifically. Book a time online.",
          linkLabel: "Booking form",
        },
        bedee: { title: "BeDee by BDMS", body: "Telehealth consultations through the BeDee app by BDMS." },
      },
      itSupport: {
        title: "IT support and TU apps",
        helpdesk: {
          title: "ICT Helpdesk",
          body: "Get help with TU accounts, wifi, email and university systems via LINE (@icttuhelpdesk).",
          linkLabel: "Open ICT Helpdesk on LINE",
        },
        appStore: {
          title: "TU application store",
          body: "Find the official Thammasat apps, including TU GREATS, in the TU application store.",
          linkLabel: "Browse TU apps",
        },
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
    sections: {
      accidentInsurance: {
        title: "ประกันอุบัติเหตุสำหรับนักศึกษาธรรมศาสตร์",
        intro: "นักศึกษาธรรมศาสตร์ทุกคนได้รับความคุ้มครอง ปีการศึกษา 2568 คุ้มครองระหว่างวันที่ 1 สิงหาคม 2568 ถึง 31 กรกฎาคม 2569",
        claimTitle: "วิธียื่นเคลม",
        claimSteps: [
          { lead: "ยืนยันสิทธิ์", text: "แสดงบัตรประชาชน (หรือพาสปอร์ต) และบัตรนักศึกษาต่อเจ้าหน้าที่โรงพยาบาล" },
          { lead: "เคลมตรง", text: "หากชื่อของคุณอยู่ในกรมธรรม์และเข้ารับการรักษาที่โรงพยาบาลคู่สัญญา (เช่น โรงพยาบาลธรรมศาสตร์) สามารถเบิกได้โดยตรงโดยไม่ต้องสำรองจ่าย" },
          { lead: "สำรองจ่าย", text: "หากยังไม่มีชื่อในกรมธรรม์ หรือโรงพยาบาลไม่ใช่คู่สัญญา ให้สำรองจ่ายก่อน แล้วยื่นเอกสารด้านล่างต่อเจ้าหน้าที่ผู้รับผิดชอบเพื่อส่งให้บริษัทประกัน" },
        ] as LeadText[],
        documentsTitle: "เอกสารสำหรับการเคลมแบบสำรองจ่าย",
        documents: [
          "แบบฟอร์มเบิกค่าสินไหม (AC_01) ดาวน์โหลดจากเว็บไซต์กองกิจการนักศึกษา มธ. หรือขอจากเจ้าหน้าที่ผู้รับผิดชอบ",
          "ใบรับรองแพทย์ฉบับจริง",
          "ใบเสร็จค่ารักษาพยาบาลฉบับจริง",
          "สำเนาบัตรประชาชน 1 ชุด รับรองสำเนาด้วยปากกาสีน้ำเงิน",
          "สำเนาหน้าสมุดบัญชีธนาคาร 1 ชุด รับรองสำเนาด้วยปากกาสีน้ำเงิน",
        ],
        coverageTitle: "ความคุ้มครอง",
        coverage: [
          { term: "ค่ารักษาพยาบาล", desc: "สูงสุด 15,000 บาทต่ออุบัติเหตุ อุบัติเหตุทั่วไป ตามเงื่อนไขยกเว้นในกรมธรรม์" },
          { term: "เสียชีวิตหรือทุพพลภาพจากอุบัติเหตุ", desc: "150,000 บาท กรณีเสียชีวิต สูญเสียอวัยวะ สายตา การได้ยิน การพูด หรือทุพพลภาพถาวรจากอุบัติเหตุ รวมถึงการถูกฆาตกรรมและทำร้ายร่างกาย" },
          { term: "ค่าปลงศพ (เสียชีวิตจากการเจ็บป่วยทั่วไป)", desc: "15,000 บาท" },
        ] as TermDesc[],
        contactTitle: "ติดต่อสอบถาม",
        contacts: [
          { term: "ศูนย์รังสิต", desc: "งานยุทธศาสตร์กิจการนักศึกษา 02-564-4440 ต่อ 1275" },
          { term: "ท่าพระจันทร์", desc: "ตึกกิจกรรมนักศึกษา ชั้น 3 02-221-6111 ต่อ 1710" },
          { term: "ศูนย์ลำปาง", desc: "ฝ่ายการนักศึกษา 054-237-999 ต่อ 5171" },
          { term: "ศูนย์พัทยา", desc: "กองบริหารศูนย์พัทยา 038-259-050 ต่อ 1202" },
        ] as TermDesc[],
        linkLabel: "รายละเอียดประกันฉบับเต็ม",
      },
      militaryService: {
        title: "การผ่อนผันการเกณฑ์ทหาร",
        intro: "สำหรับนักศึกษาชายที่เกิด พ.ศ. 2549 ศูนย์ท่าพระจันทร์ ศูนย์รังสิต และศูนย์พัทยา เลือกยื่นเพียงรอบเดียว",
        roundsTitle: "รอบการยื่น (เลือกรอบเดียว)",
        rounds: [
          { term: "รอบที่ 1", desc: "10 สิงหาคม ถึง 9 ตุลาคม 2569" },
          { term: "รอบที่ 2", desc: "11 มกราคม ถึง 10 กุมภาพันธ์ 2570" },
        ] as TermDesc[],
        stepsTitle: "ขั้นตอนการดำเนินการ",
        steps: [
          "ยื่นเอกสารทั้งสองรูปแบบ ส่งไฟล์ผ่านระบบออนไลน์ และส่งฉบับกระดาษที่มหาวิทยาลัย",
          "มหาวิทยาลัยตรวจสอบสถานะ",
          "ประกาศรายชื่อผู้ได้รับสิทธิ์",
          "ไปรายงานตัวตามหมายเรียก",
        ],
        documentsLinkLabel: "เอกสารและคำแนะนำ",
        approvedListLinkLabel: "ตรวจสอบรายชื่อผู้ได้สิทธิ์ปีที่ผ่านมา",
        contactLine: "สอบถาม งานทุน วินัย และสวัสดิการนักศึกษา กองกิจการนักศึกษา 0-2564-2921 (เฟซบุ๊ก TU Scholarships)",
      },
      certificates: {
        title: "การขอเอกสารสำคัญออนไลน์",
        body: "ขอเอกสารทางการ เช่น หนังสือรับรองการเป็นนักศึกษาและใบรับรองต่าง ๆ ผ่านระบบทะเบียน TU REG ออนไลน์",
        linkLabel: "เข้าสู่ระบบ TU REG",
      },
      libraries: {
        title: "ห้องสมุด ห้องอ่านหนังสือ และสิทธิ์การพิมพ์",
        intro: "สถานะนักศึกษาธรรมศาสตร์ของคุณให้สิทธิ์เข้าใช้ห้องสมุดของมหาวิทยาลัย จองห้องอ่านหนังสือ และรับสิทธิ์การพิมพ์เอกสารทุกภาคการศึกษา",
        librariesTitle: "ห้องสมุดในและใกล้ท่าพระจันทร์",
        libraries: [
          { term: "หอสมุดปรีดี พนมยงค์", desc: "หอสมุดกลางหลักของมหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ เปิดทุกวัน 08.30 ถึง 21.30 น. ยกเว้นวันหยุดนักขัตฤกษ์" },
          { term: "ห้องสมุดศาสตราจารย์ดิเรก ชัยนาม", desc: "ห้องสมุดคณะรัฐศาสตร์และกลุ่มคณะทางสังคมศาสตร์" },
          { term: "หอสมุดป๋วย อึ๊งภากรณ์ (คณะเศรษฐศาสตร์)", desc: "ห้องสมุดคณะเศรษฐศาสตร์ ท่าพระจันทร์" },
          { term: "หอสมุดสัญญา ธรรมศักดิ์", desc: "ห้องสมุดคณะนิติศาสตร์" },
        ] as TermDesc[],
        cardEntitlementTitle: "สิทธิ์ที่ได้รับจากบัตรห้องสมุด",
        cardEntitlement: [
          "ยืมหนังสือได้สูงสุด 25 เล่มต่อครั้ง นาน 30 วัน",
          "บริการ Book Delivery ที่ย้ายหนังสือระหว่างสาขาห้องสมุดของธรรมศาสตร์ให้",
          "บริการ Full Text Finder สำหรับค้นหาบทความ วารสาร อีบุ๊ก และวิทยานิพนธ์",
        ],
        studyRoomsTitle: "การจองห้องอ่านหนังสือ",
        studyRoomsBody:
          "ห้องที่หอสมุดปรีดี พนมยงค์ ทั้งห้องอ่านหนังสือ ห้องประชุม และห้องฉายภาพยนตร์ จองผ่านบัญชี LINE ของห้องสมุด ซึ่งเผยแพร่ไว้ทั้งชื่อ @Lifeonline และ @TULIBLifeOnline เพิ่มบัญชีแล้วเลือกเมนู Booking จากนั้นเลือกห้อง ช่วงเวลา และกรอกรหัสจองร่วม",
        bookingLinkLabel: "จองห้องอ่านหนังสือ",
        libraryOfThingsTitle: "Library of Things",
        libraryOfThingsBody:
          "ห้องสมุดยังให้ยืมอุปกรณ์โดยใช้บัตรนักศึกษา เช่น โน้ตบุ๊ก ไอแพด กล้อง ปลั๊กพ่วง เครื่องทำความร้อน กระเป๋าน้ำร้อน และบอร์ดเกม",
        printingTitle: "สิทธิ์การพิมพ์เอกสาร",
        printingIntro: "ทุกภาคการศึกษาคุณจะได้รับสิทธิ์การพิมพ์เอกสารจาก 2 กองทุน รวมทั้งสิ้น 200 บาท",
        printingFunds: [
          { term: "กองทุนจากคณะ", desc: "100 บาทต่อภาคการศึกษา" },
          { term: "กองทุนจากมหาวิทยาลัย", desc: "100 บาทต่อภาคการศึกษา" },
        ] as TermDesc[],
        researchTitle: "การสนับสนุนงานวิจัยและการเขียน",
        research: [
          "Turnitin และ AI Tools Services ของห้องสมุด ช่วยตรวจงานของคุณเองว่ามีการคัดลอกหรือใช้ AI หรือไม่ ฟรี ก่อนส่งงาน",
          "บริการตรวจแก้บทคัดย่อภาษาอังกฤษผ่าน U-Services ส่งบทคัดย่อแล้วผู้เชี่ยวชาญด้านภาษาจะตรวจแก้และส่งกลับทางอีเมลภายในสามวันทำการ",
        ],
        tuGetTitle: "TU-GET",
        tuGetIntro: "แบบทดสอบภาษาอังกฤษของธรรมศาสตร์เอง ผลสอบใช้ขอยกเว้นหน่วยกิตได้ หรือใช้เทียบกับคะแนน TOEFL iBT และ IELTS",
        tuGetColumns: ["", "TU-GET PBT", "TU-GET CBT"],
        tuGetRows: [
          { label: "รูปแบบ", pbt: "กระดาษ แบบปรนัย", cbt: "คอมพิวเตอร์ ครบสี่ทักษะ" },
          { label: "ค่าธรรมเนียม", pbt: "800 บาท (สมัครล่าช้า 1,000 บาท)", cbt: "1,500 บาท (สมัครล่าช้า 1,800 บาท)" },
          { label: "ผลสอบ", pbt: "ประมาณ 5 ถึง 7 วัน", cbt: "ประมาณ 15 วัน" },
        ],
        tuGetLinkLabel: "สมัครสอบ TU-GET",
        libraryLinkLabel: "หอสมุดมหาวิทยาลัยธรรมศาสตร์",
      },
      sportFitness: {
        title: "กีฬาและการออกกำลังกาย",
        body: "ศูนย์กีฬาและฟิตเนสของมหาวิทยาลัยธรรมศาสตร์เปิดให้นักศึกษาเข้าใช้สิ่งอำนวยความสะดวกด้านกีฬาและฟิตเนสภายในมหาวิทยาลัย",
      },
      domeAccount: {
        title: "บัญชี Dome และไวไฟในมหาวิทยาลัย",
        body: "นักศึกษาธรรมศาสตร์ทุกคนจะได้รับบัญชี Dome ซึ่งเป็นบัญชีเดียวที่ใช้เข้าสู่ระบบออนไลน์ต่าง ๆ ของมหาวิทยาลัย ทั้งระบบทะเบียน (TU REG) อีเมลมหาวิทยาลัย และแอปพลิเคชันต่าง ๆ เช่น TU GREATS บัญชี Dome ของคุณยังใช้เชื่อมต่อไวไฟในมหาวิทยาลัยด้วย",
      },
      counselling: {
        title: "บริการให้คำปรึกษาและสุขภาพจิต",
        intro: "บริการฟรีและเป็นความลับสำหรับนักศึกษาธรรมศาสตร์ มี 3 ช่องทาง",
        wellBeing: {
          title: "ศูนย์สุขภาวะธรรมศาสตร์ (TU Well Being Center)",
          body: "นัดหมายและปรึกษาสำหรับนักศึกษาธรรมศาสตร์ทุกคน โทร 02-026-2345 กด 2 (ตลอด 24 ชั่วโมง) หรือจองและทำแบบประเมินสุขภาวะผ่านแอป TU GREATS ที่เมนู Services แล้วเลือก TU Well Being",
          linkLabel: "ข้อมูลศูนย์สุขภาวะ",
        },
        psychologist: {
          title: "นักจิตวิทยาประจำคณะรัฐศาสตร์",
          body: "ปรึกษาแบบตัวต่อตัวกับนักจิตวิทยาอาชีพ เฉพาะนักศึกษาคณะรัฐศาสตร์ จองเวลาออนไลน์ได้",
          linkLabel: "แบบฟอร์มจองเวลา",
        },
        bedee: { title: "BeDee by BDMS", body: "ปรึกษาสุขภาพทางไกลผ่านแอป BeDee โดย BDMS" },
      },
      itSupport: {
        title: "ความช่วยเหลือด้านไอทีและแอปของมหาวิทยาลัย",
        helpdesk: {
          title: "ศูนย์ช่วยเหลือไอที (ICT Helpdesk)",
          body: "ขอความช่วยเหลือเรื่องบัญชี มธ. ไวไฟ อีเมล และระบบต่าง ๆ ผ่าน LINE (@icttuhelpdesk)",
          linkLabel: "เปิด ICT Helpdesk บน LINE",
        },
        appStore: {
          title: "คลังแอปพลิเคชันของมหาวิทยาลัย",
          body: "ค้นหาแอปทางการของธรรมศาสตร์ รวมถึง TU GREATS ได้ที่คลังแอปของมหาวิทยาลัย",
          linkLabel: "ดูแอปของมหาวิทยาลัย",
        },
      },
    },
    closing: {
      title: "แจ้งปัญหาเกี่ยวกับหน้านี้",
      body: "หากพบข้อมูลผิดหรือล้าสมัยในหน้านี้ แจ้ง BIRSA ได้",
      cta: "แจ้งข้อมูลที่ขาดหาย",
    },
  },
} satisfies Record<Locale, unknown>;

function DefinitionGrid({ rows }: { rows: TermDesc[] }) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.term} className="rounded-lg border border-line bg-sunken p-4">
          <Text as="dt" step="body" className="font-semibold text-ink">
            {row.term}
          </Text>
          <Text as="dd" step="body-sm" className="text-muted">
            {row.desc}
          </Text>
        </div>
      ))}
    </dl>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];
  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/help/university-services",
  });
}

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
  const s = t.sections;
  const linkClass = "font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]";

  const navSections = [
    { id: "accident-insurance", label: s.accidentInsurance.title },
    { id: "military-service", label: s.militaryService.title },
    { id: "certificates", label: s.certificates.title },
    { id: "libraries", label: s.libraries.title },
    { id: "sport-fitness", label: s.sportFitness.title },
    { id: "dome-account", label: s.domeAccount.title },
    { id: "counselling", label: s.counselling.title },
    { id: "it-support", label: s.itSupport.title },
  ];

  return (
    <HelpPageShell
      locale={locale}
      title={t.title}
      lede={t.lede}
      narrow={false}
      breadcrumbItems={[
        { label: dict.site.name, href: "/" },
        { label: dict.hub.title, href: "/help" },
        { label: t.title },
      ]}
    >
      <nav aria-label={t.onThisPageLabel}>
        <Text step="body-sm" className="mb-2 block font-semibold text-muted uppercase">
          {t.onThisPageLabel}
        </Text>
        <Text as="ul" step="body-sm" className="flex flex-wrap gap-x-6 gap-y-1">
          {navSections.map((section) => (
            <Text as="li" step="body-sm" key={section.id}>
              <a href={`#${section.id}`} className={`${linkClass} inline-flex min-h-11 items-center`}>
                {section.label}
              </a>
            </Text>
          ))}
        </Text>
      </nav>

      <Notice variant="info" title={t.disclaimerTitle}>
        {t.disclaimerBody}
      </Notice>

      <section id="accident-insurance" aria-label={s.accidentInsurance.title} className="max-w-[var(--measure)]">
        <Stack gap="md">
          <Heading level={2}>
            {s.accidentInsurance.title}
          </Heading>
          <Text step="body" className="text-muted">
            {s.accidentInsurance.intro}
          </Text>

          <Stack gap="sm" className="rounded-lg border border-line bg-sunken p-6">
            <Heading level={3}>{s.accidentInsurance.claimTitle}</Heading>
            <Text as="ol" step="body-sm" className="list-decimal space-y-2 pl-5 text-muted">
              {s.accidentInsurance.claimSteps.map((step, index) => (
                <Text as="li" step="body-sm" key={index}>
                  <Text as="span" step="body-sm" className="font-semibold text-ink">
                    {step.lead}
                  </Text>{" "}
                  {step.text}
                </Text>
              ))}
            </Text>
          </Stack>

          <Stack gap="sm" className="rounded-lg border border-line bg-sunken p-6">
            <Heading level={3}>{s.accidentInsurance.documentsTitle}</Heading>
            <Text as="ul" step="body-sm" className="list-disc space-y-2 pl-5 text-muted">
              {s.accidentInsurance.documents.map((doc, index) => (
                <Text as="li" step="body-sm" key={index}>
                  {doc}
                </Text>
              ))}
            </Text>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>{s.accidentInsurance.coverageTitle}</Heading>
            <DefinitionGrid rows={s.accidentInsurance.coverage} />
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>{s.accidentInsurance.contactTitle}</Heading>
            <DefinitionGrid rows={s.accidentInsurance.contacts} />
          </Stack>

          <ExternalLink
            href="http://satu.colorpack.net/index.php/th/student-services/accident-insurance"
            newTabLabel={dict.a11y.newTab}
            className={linkClass}
          >
            {s.accidentInsurance.linkLabel}
          </ExternalLink>
        </Stack>
      </section>

      <section id="military-service" aria-label={s.militaryService.title} className="max-w-[var(--measure)]">
        <Stack gap="md">
          <Heading level={2}>
            {s.militaryService.title}
          </Heading>
          <Text step="body" className="text-muted">
            {s.militaryService.intro}
          </Text>

          <Stack gap="sm">
            <Heading level={3}>{s.militaryService.roundsTitle}</Heading>
            <DefinitionGrid rows={s.militaryService.rounds} />
          </Stack>

          <Stack gap="sm" className="rounded-lg border border-line bg-sunken p-6">
            <Heading level={3}>{s.militaryService.stepsTitle}</Heading>
            <Text as="ol" step="body-sm" className="list-decimal space-y-2 pl-5 text-muted">
              {s.militaryService.steps.map((step, index) => (
                <Text as="li" step="body-sm" key={index}>
                  {step}
                </Text>
              ))}
            </Text>
          </Stack>

          <Stack gap="xs">
            <ExternalLink
              href="https://drive.google.com/file/d/1-88fSuUc4VrKAAO-wQytYRoLaFM6qge9/view?usp=sharing"
              newTabLabel={dict.a11y.newTab}
              className={linkClass}
            >
              {s.militaryService.documentsLinkLabel}
            </ExternalLink>
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/1nJOQvregi3ja7_xJYs1RAe8HWuWW4vZ5ls56_D8YdNQ/edit?usp=sharing"
              newTabLabel={dict.a11y.newTab}
              className={linkClass}
            >
              {s.militaryService.approvedListLinkLabel}
            </ExternalLink>
          </Stack>

          <Text step="body-sm" className="text-muted">
            {s.militaryService.contactLine}
          </Text>
        </Stack>
      </section>

      <section id="certificates" aria-label={s.certificates.title} className="max-w-[var(--measure)]">
        <Stack gap="sm">
          <Heading level={2}>
            {s.certificates.title}
          </Heading>
          <Text step="body" className="text-muted">
            {s.certificates.body}
          </Text>
          <ExternalLink href="https://www.reg.tu.ac.th/" newTabLabel={dict.a11y.newTab} className={linkClass}>
            {s.certificates.linkLabel}
          </ExternalLink>
        </Stack>
      </section>

      <section id="libraries" aria-label={s.libraries.title} className="max-w-[var(--measure)]">
        <Stack gap="md">
          <Heading level={2}>
            {s.libraries.title}
          </Heading>
          <Text step="body" className="text-muted">
            {s.libraries.intro}
          </Text>

          <Stack gap="sm">
            <Heading level={3}>{s.libraries.librariesTitle}</Heading>
            <DefinitionGrid rows={s.libraries.libraries} />
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>{s.libraries.cardEntitlementTitle}</Heading>
            <Text as="ul" step="body-sm" className="list-disc space-y-2 pl-5 text-muted">
              {s.libraries.cardEntitlement.map((item, index) => (
                <Text as="li" step="body-sm" key={index}>
                  {item}
                </Text>
              ))}
            </Text>
          </Stack>

          <Stack gap="sm" className="rounded-lg border border-line bg-sunken p-6">
            <Heading level={3}>{s.libraries.studyRoomsTitle}</Heading>
            <Text step="body-sm" className="text-muted">
              {s.libraries.studyRoomsBody}
            </Text>
            <ExternalLink href="https://booking.library.tu.ac.th" newTabLabel={dict.a11y.newTab} className={linkClass}>
              {s.libraries.bookingLinkLabel}
            </ExternalLink>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>{s.libraries.libraryOfThingsTitle}</Heading>
            <Text step="body-sm" className="text-muted">
              {s.libraries.libraryOfThingsBody}
            </Text>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>{s.libraries.printingTitle}</Heading>
            <Text step="body-sm" className="text-muted">
              {s.libraries.printingIntro}
            </Text>
            <DefinitionGrid rows={s.libraries.printingFunds} />
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>{s.libraries.researchTitle}</Heading>
            <Text as="ul" step="body-sm" className="list-disc space-y-2 pl-5 text-muted">
              {s.libraries.research.map((item, index) => (
                <Text as="li" step="body-sm" key={index}>
                  {item}
                </Text>
              ))}
            </Text>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>{s.libraries.tuGetTitle}</Heading>
            <Text step="body-sm" className="text-muted">
              {s.libraries.tuGetIntro}
            </Text>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <caption className="sr-only">{s.libraries.tuGetTitle}</caption>
                <thead>
                  <tr className="border-b border-line">
                    {s.libraries.tuGetColumns.map((col, index) => (
                      <th scope="col" key={index} className="py-2 pr-4">
                        <Text as="span" step="body-sm" className="font-semibold text-ink">
                          {col}
                        </Text>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.libraries.tuGetRows.map((row) => (
                    <tr key={row.label} className="border-b border-line align-top">
                      <th scope="row" className="py-2 pr-4">
                        <Text as="span" step="body-sm" className="font-semibold text-ink">
                          {row.label}
                        </Text>
                      </th>
                      <Text as="td" step="body-sm" className="py-2 pr-4 text-muted">
                        {row.pbt}
                      </Text>
                      <Text as="td" step="body-sm" className="py-2 text-muted">
                        {row.cbt}
                      </Text>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ExternalLink href="https://litu.tu.ac.th/testing/tu-get/" newTabLabel={dict.a11y.newTab} className={linkClass}>
              {s.libraries.tuGetLinkLabel}
            </ExternalLink>
          </Stack>

          <ExternalLink href="https://library.tu.ac.th" newTabLabel={dict.a11y.newTab} className={linkClass}>
            {s.libraries.libraryLinkLabel}
          </ExternalLink>
        </Stack>
      </section>

      <section id="sport-fitness" aria-label={s.sportFitness.title} className="max-w-[var(--measure)]">
        <Stack gap="sm">
          <Heading level={2}>
            {s.sportFitness.title}
          </Heading>
          <Text step="body" className="text-muted">
            {s.sportFitness.body}
          </Text>
        </Stack>
      </section>

      <section id="dome-account" aria-label={s.domeAccount.title} className="max-w-[var(--measure)]">
        <Stack gap="sm">
          <Heading level={2}>
            {s.domeAccount.title}
          </Heading>
          <Text step="body" className="text-muted">
            {s.domeAccount.body}
          </Text>
        </Stack>
      </section>

      <section id="counselling" aria-label={s.counselling.title} className="max-w-[var(--measure)]">
        <Stack gap="md">
          <Heading level={2}>
            {s.counselling.title}
          </Heading>
          <Text step="body" className="text-muted">
            {s.counselling.intro}
          </Text>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stack gap="xs" className="rounded-lg border border-line bg-sunken p-6">
              <Heading level={3}>{s.counselling.wellBeing.title}</Heading>
              <Text step="body-sm" className="text-muted">
                {s.counselling.wellBeing.body}
              </Text>
              <ExternalLink
                href="https://www.facebook.com/permalink.php?story_fbid=1139583574836463&id=100063544931301&locale=th_TH"
                newTabLabel={dict.a11y.newTab}
                className={linkClass}
              >
                {s.counselling.wellBeing.linkLabel}
              </ExternalLink>
            </Stack>

            <Stack gap="xs" className="rounded-lg border border-line bg-sunken p-6">
              <Heading level={3}>{s.counselling.psychologist.title}</Heading>
              <Text step="body-sm" className="text-muted">
                {s.counselling.psychologist.body}
              </Text>
              <ExternalLink
                href="https://docs.google.com/forms/d/e/1FAIpQLSd2r-09b7q6RI3bymPI6qhgKopCPXUZ-gyoxoYb9ClLXNm8wg/viewform"
                newTabLabel={dict.a11y.newTab}
                className={linkClass}
              >
                {s.counselling.psychologist.linkLabel}
              </ExternalLink>
            </Stack>

            <Stack gap="xs" className="rounded-lg border border-line bg-sunken p-6">
              <Heading level={3}>{s.counselling.bedee.title}</Heading>
              <Text step="body-sm" className="text-muted">
                {s.counselling.bedee.body}
              </Text>
            </Stack>
          </div>
        </Stack>
      </section>

      <section id="it-support" aria-label={s.itSupport.title} className="max-w-[var(--measure)]">
        <Stack gap="md">
          <Heading level={2}>
            {s.itSupport.title}
          </Heading>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stack gap="xs" className="rounded-lg border border-line bg-sunken p-6">
              <Heading level={3}>{s.itSupport.helpdesk.title}</Heading>
              <Text step="body-sm" className="text-muted">
                {s.itSupport.helpdesk.body}
              </Text>
              <ExternalLink href="https://page.line.me/pib5088f" newTabLabel={dict.a11y.newTab} className={linkClass}>
                {s.itSupport.helpdesk.linkLabel}
              </ExternalLink>
            </Stack>

            <Stack gap="xs" className="rounded-lg border border-line bg-sunken p-6">
              <Heading level={3}>{s.itSupport.appStore.title}</Heading>
              <Text step="body-sm" className="text-muted">
                {s.itSupport.appStore.body}
              </Text>
              <ExternalLink
                href="https://ict.tu.ac.th/index.php/th/it-ict/personnel-information-system/tu-application-store"
                newTabLabel={dict.a11y.newTab}
                className={linkClass}
              >
                {s.itSupport.appStore.linkLabel}
              </ExternalLink>
            </Stack>
          </div>
        </Stack>
      </section>

      <section className="rounded-lg border border-line bg-sunken p-8">
        <Stack gap="xs">
          <Heading level={2}>{t.closing.title}</Heading>
          <Text step="body-sm" className="max-w-[var(--measure)] text-muted">
            {t.closing.body}{" "}
            <a href={localeHref(locale, "/contact")} className={linkClass}>
              {t.closing.cta}
            </a>
          </Text>
        </Stack>
      </section>
    </HelpPageShell>
  );
}
