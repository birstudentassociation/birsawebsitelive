import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Written for the aftermath of the Bangkok floods of September 2026: classes
 * and exams, claiming the government payment and BMA compensation, going home,
 * cleaning up and staying well, from BMA, DDPM and Department of Disease
 * Control announcements and the sources below. When the alert is ended,
 * restore the general flooding guide from git history (commit 2656287).
 */
const flooding: EmergencyScenario = {
  id: "flooding",
  severity: "warning",
  hero: "blue",
  group: "hazard",
  keyContacts: ["bma", "ambulance", "mea"],
  moreContacts: [
    "bmaFlood",
    "ddpm",
    "ddc",
    "mentalHealth",
    "erawan",
    "tmd",
    "police",
    "tuClinic",
    "facultyOffice",
  ],
  sources: [
    {
      label: {
        en: "Government Public Relations Department, 2 channels to claim flood relief in Bangkok, October 2026 (Thai)",
        th: "กรมประชาสัมพันธ์ เปิด 2 ช่องทางยื่นขอรับเงินเยียวยาผู้ประสบอุทกภัยในพื้นที่ กทม. ตุลาคม 2569",
      },
      href: "https://www.prd.go.th/th/content/category/detail/id/33/iid/547633",
    },
    {
      label: {
        en: "Government Public Relations Department, DDPM opens flood relief registration in the Tang Rat app, 1 October 2026 (Thai)",
        th: "กรมประชาสัมพันธ์ ปภ. เปิดลงทะเบียนเยียวยาน้ำท่วมผ่านแอปทางรัฐ 1 ตุลาคม 2569",
      },
      href: "https://www.prd.go.th/th/content/category/detail/id/33/iid/547129",
    },
    {
      label: {
        en: "Thai PBS, registration for flood relief opens in the Tang Rat app at 08:00, 2 October 2026 (Thai)",
        th: "ไทยพีบีเอส เริ่ม 08.00 น. วันนี้ เปิดลงทะเบียนเยียวยาน้ำท่วม 2569 ผ่านแอปทางรัฐ 2 ตุลาคม 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/559005",
    },
    {
      label: {
        en: "The Nation, DDPM's 9,000 baht flood aid and separate BMA assistance for Bangkok explained, 28 September 2026",
        th: "The Nation อธิบายเงินช่วยเหลือ 9,000 บาทของ ปภ. และความช่วยเหลือของ กทม. 28 กันยายน 2569",
      },
      href: "https://www.nationthailand.com/news/general/40071582",
    },
    {
      label: {
        en: "The Standard, BMA flood compensation rules, 30 day limit and no police report, 3 October 2026 (Thai)",
        th: "THE STANDARD กทม. กางหลักเกณฑ์จ่ายเงินเยียวยาน้ำท่วม ต้องยื่นเรื่องภายใน 30 วัน 3 ตุลาคม 2569",
      },
      href: "https://thestandard.co/bangkok-metropolitan-administration-bma-outlines-flood-compensation-guideli/",
    },
    {
      label: {
        en: "Sanook, how to claim at claim.bangkok.go.th, 3 October 2026 (Thai)",
        th: "สนุก เปิดลงทะเบียนรับเงินเยียวยาน้ำท่วม กทม. claim.bangkok.go.th 3 ตุลาคม 2569",
      },
      href: "https://www.sanook.com/money/958639/",
    },
    {
      label: {
        en: "Thairath, why the BMA cannot yet set a date for flood payments, October 2026 (Thai)",
        th: "ไทยรัฐ กทม. แจงสาเหตุที่ยังไม่กำหนดเวลาการจ่ายเงินเยียวยาน้ำท่วม 2569 ตุลาคม 2569",
      },
      href: "https://www.thairath.co.th/news/local/bangkok/2963872",
    },
    {
      label: {
        en: "Thai PBS, BMA online flood claims open on 2 October without a police report, 1 October 2026 (Thai)",
        th: "ไทยพีบีเอส เปิดยื่นออนไลน์ 2 ต.ค. รับเงินเยียวยาน้ำท่วม กทม. ยกเลิกใบแจ้งความ 1 ตุลาคม 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/558961",
    },
    {
      label: {
        en: "Bangkok Biz News, BMA raises flood relief rates and opens online claims, 1 October 2026 (Thai)",
        th: "กรุงเทพธุรกิจ กทม. เปิดเกณฑ์เยียวยาน้ำท่วมชาวกรุงเทพ ปรับเพดานเพิ่ม ยื่นออนไลน์ได้ 1 ตุลาคม 2569",
      },
      href: "https://www.bangkokbiznews.com/news/news-update/1254494",
    },
    {
      label: {
        en: "Bangkok Biz News, DDPM names 118 subdistricts in 38 districts for flood relief, 29 September 2026 (Thai)",
        th: "กรุงเทพธุรกิจ กางพื้นที่ กทม. 38 เขต 118 แขวง เป็นเขตช่วยเหลือภัยพิบัติน้ำท่วม 29 กันยายน 2569",
      },
      href: "https://www.bangkokbiznews.com/news/news-update/1254219",
    },
    {
      label: {
        en: "BMA, fact-finding form for people affected by flooding, September 2026 (Thai)",
        th: "กรุงเทพมหานคร แบบสอบข้อเท็จจริงผู้ประสบอุทกภัย กันยายน 2569",
      },
      href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
    },
    {
      label: {
        en: "The Nation, the new disaster insurance from 1 October will not cover the current floods, 30 September 2026",
        th: "The Nation ประกันภัยพิบัติที่เริ่ม 1 ตุลาคม ไม่ครอบคลุมน้ำท่วมครั้งนี้ 30 กันยายน 2569",
      },
      href: "https://www.nationthailand.com/news/policy/40071699",
    },
    {
      label: {
        en: "Siam Rath, BMA drains canals before rain on 5 October, collects flood rubbish and opens online claims, 2 October 2026 (Thai)",
        th: "สยามรัฐ กทม. เร่งระบายน้ำรับฝน 5 ต.ค. ลุยเก็บขยะ เปิดเคลมเยียวยาออนไลน์ 2 ตุลาคม 2569",
      },
      href: "https://siamrath.co.th/quality-of-life/325866",
    },
    {
      label: {
        en: "InfoQuest, BMA lowers main canals before more rain from 5 to 8 October, 2 October 2026 (Thai)",
        th: "อินโฟเควสท์ กทม. เร่งพร่องน้ำคลองหลัก เตรียมพื้นที่รองรับฝนระลอกใหม่ 5 ถึง 8 ต.ค. 2 ตุลาคม 2569",
      },
      href: "https://www.infoquest.co.th/2026/658397",
    },
    {
      label: {
        en: "Bangkok Biz News, Thai Meteorological Department warning No. 4 on heavy rain from 4 to 7 October, 3 October 2026 (Thai)",
        th: "กรุงเทพธุรกิจ กรมอุตุฯ ประกาศฉบับ 4 ฝนตกหนัก 4 ถึง 7 ต.ค. 3 ตุลาคม 2569",
      },
      href: "https://www.bangkokbiznews.com/news/news-update/1254843",
    },
    {
      label: {
        en: "Thansettakij, DDPM flood figures for 26 provinces and Bangkok, 3 October 2026 (Thai)",
        th: "ฐานเศรษฐกิจ น้ำท่วม 3 ตุลาคม 2569 ยังท่วม 26 จังหวัดและ กทม.",
      },
      href: "https://www.thansettakij.com/general-news/670561",
    },
    {
      label: {
        en: "Thai PBS, Chao Phraya Dam raises its release to 2,500 cubic metres a second, 1 October 2026 (Thai)",
        th: "ไทยพีบีเอส เขื่อนเจ้าพระยาปรับเพิ่มระบายน้ำเป็น 2,500 ลบ.ม./วินาที 1 ตุลาคม 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/559003",
    },
    {
      label: {
        en: "Department of Disease Control, safety guide to looking after your home after floods, November 2025 (PDF, Thai)",
        th: "กรมควบคุมโรค คู่มือความปลอดภัยในการดูแลบ้านหลังน้ำลด พฤศจิกายน 2568",
      },
      href: "https://ddc.moph.go.th/uploads/publish/1761920260602112057.pdf",
    },
    {
      label: {
        en: "The Standard, Ministry of Public Health on leptospirosis during and after floods, 29 September 2026 (Thai)",
        th: "THE STANDARD สธ. สั่งเฝ้าระวังโรคไข้ฉี่หนูช่วงน้ำท่วมและน้ำลด 29 กันยายน 2569",
      },
      href: "https://thestandard.co/leptospirosis-flood-prevention/",
    },
    {
      label: {
        en: "Department of Disease Control, leptospirosis (Thai)",
        th: "กรมควบคุมโรค โรคเลปโตสไปโรซิส (โรคฉี่หนู)",
      },
      href: "https://ddc.moph.go.th/disease_detail.php?d=16",
    },
    {
      label: {
        en: "Hfocus, Department of Disease Control on leptospirosis, melioidosis and electric shock in floods (Thai)",
        th: "Hfocus กรมควบคุมโรคแนะป้องกันไข้ฉี่หนู ไข้ดิน และไฟฟ้าดูดช่วงน้ำท่วม",
      },
      href: "https://www.hfocus.org/content/2026/08/39249",
    },
    {
      label: {
        en: "Top News, MEA opens a 24 hour centre on 1130 for electricity in flooded areas (Thai)",
        th: "ท็อปนิวส์ MEA เปิดศูนย์รับแจ้งเหตุด้านระบบไฟฟ้าพื้นที่น้ำท่วม โทร 1130 ตลอด 24 ชั่วโมง",
      },
      href: "https://www.topnews.co.th/news/1703075",
    },
    {
      label: {
        en: "MEA, using electricity safely in flooded areas (Thai)",
        th: "การไฟฟ้านครหลวง แนะวิธีใช้ไฟฟ้าให้ปลอดภัยในพื้นที่น้ำท่วม",
      },
      href: "https://www.mea.or.th/public-relations/corporate-news-activities/announcement/10-11-2025",
    },
    {
      label: {
        en: "Thai PBS, BMA declares all 50 districts a disaster area, 26 September 2026 (Thai)",
        th: "Thai PBS กทม. ยกระดับประกาศเขตภัยพิบัติอุทกภัย ครอบคลุมทั้ง 50 เขต 26 กันยายน 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/558588",
    },
    {
      label: {
        en: "BMA Drainage and Sewerage Department, rain, canal and road flood data",
        th: "สำนักการระบายน้ำ กทม. ข้อมูลฝน ระดับน้ำในคลอง และน้ำท่วมถนน",
      },
      href: "https://weather.bangkok.go.th/",
    },
    {
      label: {
        en: "Thai Meteorological Department, weather warnings (Thai)",
        th: "กรมอุตุนิยมวิทยา ประกาศเตือนภัยลักษณะอากาศ",
      },
      href: "https://www.tmd.go.th/warning-and-events/warning-storm",
    },
    {
      label: {
        en: "Thaiwater, live river levels on the Chao Phraya (Thai)",
        th: "คลังข้อมูลน้ำแห่งชาติ ระดับน้ำแม่น้ำเจ้าพระยา",
      },
      href: "https://www.thaiwater.net/water/wl",
    },
  ],
  reviewed: "2026-10-03",
  en: {
    title: "After the Bangkok floods",
    summary:
      "The floods that began on 24 September have gone down across most of Bangkok. Parts of Lat Krabang and Saphan Sung are still under water, and more heavy rain is forecast for 5 and 6 October. This page tells you about Thammasat classes and exams, how to claim money for flood damage, and how to go home and clean up safely.",
    banner:
      "The floods have gone down. Find out how to claim the government's 9,000 baht and BMA compensation.",
    now: [
      "Photograph or film the damage before you clean up or throw anything away. You need the pictures to claim.",
      "Apply for the government's 9,000 baht in the Tang Rat app and for BMA compensation at claim.bangkok.go.th. They are separate schemes, so apply to both. Claim from the BMA within 30 days of the flood.",
      "Keep the power off at the main switch until the floor, wiring and sockets are dry. Call MEA on 1130 if you are not sure it is safe.",
      "Wear rubber boots and gloves to clean up. See a doctor if you get a fever in the 4 weeks after being in floodwater, and say you were in floodwater.",
      "Sit any postponed midterms on Sunday 4 or Sunday 11 October. Your lecturer will tell you if classes stay online.",
      "Heavy rain is forecast for Bangkok on 5 and 6 October. Check the BMA flood alert page before you travel and keep away from the piers at high tide.",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "Thammasat classes and exams",
        body: [
          "All classes at every campus were online until Saturday 3 October. By 16:00 on 3 October the university had not announced arrangements from Monday 5 October.",
          "The university's announcement of 29 September says that after 3 October lecturers may keep classes online or hybrid while students are still affected. Your lecturer will tell you in advance. If you are still affected by the floods, tell your lecturer or your faculty office.",
        ],
        directoryOpen: true,
        directory: [
          {
            heading: "Midterm exams, undergraduate programmes",
            places: [
              { name: "Exams set for Saturday 26 September", detail: "Moved to Sunday 4 October" },
              { name: "Exams set for Sunday 27 September", detail: "Moved to Sunday 11 October" },
              {
                name: "Exams already held that you could not sit because of the rain",
                detail: "Your lecturer will set another assessment, worth the same as the exam.",
              },
              {
                name: "Withdrawing with a W through the system",
                detail: "Deadline extended to 26 October",
              },
              {
                name: "Midterm results",
                detail:
                  "Marking is extended by 14 days. Lecturers will give results before the withdrawal deadline.",
              },
            ],
            note: "First semester 2026.",
          },
          {
            heading: "Help from the student union",
            places: [
              {
                name: "Temporary shelter, Student Activities Building (ตึกกิจกรรมนักศึกษา), Tha Prachan campus",
                detail:
                  "Opened by the Thammasat University Student Union, Tha Prachan, for students whose homes were flooded. Contact TUSU to check it is still open before you go.",
              },
              {
                name: "TUSU Tha Prachan",
                detail: "Instagram TUSU.TPC",
                phone: { phone: "095-249-5014" },
              },
              { name: "TUSU Tha Prachan, second line", phone: { phone: "094-965-9926" } },
              { name: "Student Affairs Division", phone: { phone: "02-222-8871" } },
            ],
            links: [
              {
                label: "Register to stay at the shelter",
                href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
              },
            ],
          },
        ],
        links: [
          {
            label: "Read the university announcement No. 2 of 29 September (scanned, in Thai)",
            href: "/emergency/tu-announcement-2-2026-09-29.jpg",
          },
          {
            label: "Read the university announcement of 26 September (scanned, in Thai)",
            href: "/emergency/tu-announcement-2026-09-26.jpg",
          },
        ],
      },
      {
        id: "money",
        heading: "Money you can claim",
        body: [
          "There are 2 separate schemes. Applying to one does not apply you to the other, so if you qualify for both you must apply to both.",
        ],
        items: [
          "The government pays 9,000 baht per household towards basic living costs. Apply in the Tang Rat app or at your district office.",
          "The BMA pays towards repairs, rent, tools for your work, medical bills, funerals and basic living costs, based on what you actually lost. Apply at claim.bangkok.go.th or at your district office.",
          "At the district office you can apply for both at once. Go to the office for the district where your flooded home is, Monday to Friday during office hours.",
          "You do not need a police report for either scheme.",
          "The new national disaster insurance started on 1 October and does not cover these floods.",
        ],
        links: [
          {
            label: "Read the BMA guide to the 2 schemes (image, in Thai)",
            href: "/emergency/bma-flood-claims-2-sources-2026-10.jpg",
          },
        ],
      },
      {
        id: "government-payment",
        heading: "Government payment of 9,000 baht",
        body: [
          "The Department of Disaster Prevention and Mitigation (DDPM) pays 9,000 baht once per household. It is for people whose usual home is in a declared disaster area and was affected by flooding between 15 May and 30 September 2026.",
          "In Bangkok, DDPM named 118 subdistricts in 38 districts as the area where help can be given. Phra Nakhon, where Tha Prachan is, is not one of them. If you are not sure your subdistrict is included, ask your district office.",
          "If you rent, the money is paid to you, not to your landlord. Homes without a house registration can also qualify.",
          "You can get the payment if, between 15 May and 30 September, one of these happened.",
        ],
        items: [
          "Your home was flooded for more than 7 days in a row.",
          "Your home was flooded for 7 days or fewer and your belongings were damaged.",
          "Your home was cut off by water for more than 7 days, so you could not live there normally.",
          "You live in a high rise above the water, but could not live normally for more than 7 days.",
        ],
      },
      {
        id: "apply-government-payment",
        heading: "How to apply for the 9,000 baht",
        body: [
          "Registration opened at 08:00 on 2 October. No closing date has been announced, so apply as soon as you can.",
        ],
        steps: [
          "Ask your bank to link PromptPay to your ID card number, if it is not linked already. The money is paid this way.",
          "Open the Tang Rat app and log in.",
          "Tap All services (บริการทั้งหมด), then Register to check eligibility (ลงทะเบียนตรวจสอบสิทธิ).",
          "Choose Apply for disaster relief payment (ยื่นขอรับเงินเยียวยาผู้ประสบภัย), give permission and accept the terms.",
          "Tap Register for help (ลงทะเบียนขอรับความช่วยเหลือ), fill in your details, check them and send the form.",
        ],
        items: [
          "If you do not have a smartphone, go to your district office. Staff will enter your details for you.",
          "The app checks your details against the civil registration database. You can follow your application in the app.",
          "If your application is approved, the Government Savings Bank pays the money to the PromptPay account linked to your ID card number.",
        ],
      },
      {
        id: "bma-compensation",
        heading: "BMA compensation for damage",
        body: [
          "The BMA pays towards your actual losses, under its own rules and Ministry of Finance rules. The amounts below are the most you can get. What you get depends on the damage, whether you qualify and your documents, so it may be less.",
          "Every kind of help needs the fact-finding form, a copy of your ID card and, if you are not paid by PromptPay linked to your ID card number, a copy of your bank book. The other documents are listed under each kind of help.",
        ],
        items: [
          "The home must be the place you usually live. It must have been damaged by the floods, or water must have come into the rooms you live in.",
          "Only the owner or the head of the household can claim for repairs. Repairs to rented homes are not covered.",
          "If you rent, including a room or a condo, you can claim the other kinds of help even if your name is not on the house registration.",
          "In a building with several floors, only the floors that flooded can claim.",
          "Cars are not covered. If your car is insured, contact your insurer.",
        ],
        directory: [
          {
            heading: "Repairs to your home",
            places: [
              {
                name: "Up to 88,600 baht per home",
                detail:
                  "Based on the actual damage. Covers only repair materials for the structure of the building, on the BMA's form.",
              },
              {
                name: "Documents",
                detail:
                  "A copy of your house registration, a copy of the land title deed showing the owner or a request form instead, the request for repair materials, and photographs of the damage.",
              },
            ],
          },
          {
            heading: "Temporary accommodation or rent",
            places: [
              { name: "Home partly damaged", detail: "Up to 3,000 baht per household" },
              {
                name: "Whole home damaged",
                detail: "Up to 3,000 baht per household a month, for up to 2 months",
              },
              {
                name: "Who can claim",
                detail:
                  "Someone who usually lived in the home and had to pay for somewhere else to stay or rent because the home was damaged or flooded.",
              },
              {
                name: "Documents",
                detail:
                  "Photographs of the damage, and your tenancy agreement and receipts or proof of payment.",
              },
            ],
          },
          {
            heading: "Basic living costs",
            places: [
              { name: "Whole home damaged", detail: "3,800 baht" },
              { name: "Home partly damaged", detail: "1,900 baht" },
              {
                name: "Documents",
                detail:
                  "Photographs of the damage, and anything else that helps, such as a tenancy agreement or rent receipt.",
              },
            ],
          },
          {
            heading: "Tools and stock for your work",
            places: [
              {
                name: "Up to 13,500 baht per household",
                detail:
                  "For tools you need for the main work that supports your household, including raw materials, goods and services, at what you actually paid.",
              },
              { name: "Documents", detail: "Photographs of the damage." },
            ],
          },
          {
            heading: "Medical treatment and injury",
            places: [
              { name: "Outpatients", detail: "Up to 2,000 baht per person, at what you paid" },
              { name: "Inpatients", detail: "Up to 4,000 baht per person, at what you paid" },
              { name: "If you were injured", detail: "A further 2,300 baht per person" },
              {
                name: "Documents",
                detail:
                  "A medical certificate saying you were injured in the flood, and your medical receipts.",
              },
            ],
          },
          {
            heading: "Funerals",
            places: [
              { name: "Up to 35,700 baht per person" },
              {
                name: "If the person who died supported the household",
                detail: "A further amount of up to 35,700 baht",
              },
              {
                name: "Documents",
                detail:
                  "The fact-finding form filled in by the heir, copies of the ID cards and house registrations of the person who died and the heir, the death certificate and the autopsy certificate.",
              },
            ],
          },
        ],
        links: [
          {
            label: "Read the BMA's rules on who can claim (image, in Thai)",
            href: "/emergency/bma-flood-claims-eligibility-2026-10.jpg",
          },
          {
            label: "Read the BMA's rates and documents, part 1 (image, in Thai)",
            href: "/emergency/bma-flood-claims-rates-1-2026-10.jpg",
          },
          {
            label: "Read the BMA's rates and documents, part 2 (image, in Thai)",
            href: "/emergency/bma-flood-claims-rates-2-2026-10.jpg",
          },
        ],
      },
      {
        id: "claim-bma-compensation",
        heading: "How to claim BMA compensation",
        body: [
          "You must claim within 30 days of the flood. You can claim online at any time, or in person at your district office.",
        ],
        steps: [
          "Photograph or film the damage to your home and belongings before you clean up.",
          "Get your documents ready. They are listed under each kind of help above.",
          "Go to claim.bangkok.go.th and choose to check your eligibility. Answer the questions about your home, the damage and any injuries.",
          "If the result says you may qualify, agree and upload your documents. You fill in and sign the form online, so you do not need to print anything.",
          "To claim in person instead, download the fact-finding form or pick one up at the district office. Take it with paper copies of your documents to the office for the district where your home is.",
        ],
        items: [
          "To claim online you need to have verified your identity in the ThaiD or Tang Rat app first.",
          "If you are missing documents, have no land title deed, the name on the deed is not yours or your home has no house number, go to your district office. Staff can record a statement from you instead (form Por Kor 14).",
          "Claims for repairs made by the owner or the head of the household are checked faster.",
        ],
        links: [
          { label: "Claim online at claim.bangkok.go.th", href: "https://claim.bangkok.go.th/" },
          {
            label: "Download the fact-finding form (PDF, in Thai)",
            href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
          },
          {
            label: "Read the BMA's answers to common questions (image, in Thai)",
            href: "/emergency/bma-flood-claims-faq-2026-10.jpg",
          },
        ],
      },
      {
        id: "after-you-claim",
        heading: "After you claim",
        items: [
          "District staff may send you an SMS if they need anything more, and may visit to check the damage.",
          "The BMA pays to the PromptPay account linked to your ID card number, or to a bank account. Banks other than Krungthai may charge a fee.",
          "The BMA says payment takes at least 60 days. It has not set a date, because about 270,000 to 300,000 households were affected.",
          "The amounts for each kind of help may still change by Cabinet decision.",
          "For help with your claim, call 1555 or your district office.",
        ],
      },
      {
        id: "international-students",
        heading: "If you are not Thai",
        body: [
          "Neither scheme says whether people who are not Thai can claim. Both check applicants against Thai records and pay through PromptPay linked to a Thai ID card number, and the online systems need ThaiD or Tang Rat.",
        ],
        items: [
          "Go to your district office with your passport, your tenancy agreement or other proof of where you live, and photographs of the damage. Ask what you can claim.",
          "If you rent, photograph your landlord's furniture and fittings and get their agreement in writing before you throw any of it away. Repairs to the building are normally your landlord's responsibility.",
          "If you have insurance through your embassy, your scholarship or your own policy, contact the insurer before you clean up.",
          "Ask a Thai friend or BIRSA to help you with forms in Thai.",
        ],
      },
      {
        id: "going-home",
        heading: "Going back into your home",
        steps: [
          "Wait until the water has gone and officials say it is safe to go back.",
          "Before you go in, look for leaning walls, cracks and sagging ceilings. Do not go in if the building looks unsafe.",
          "Take a torch. Do not light a flame or use a switch inside until you know there is no gas leak.",
          "If you use bottled gas, check that the cylinder is turned off. If you smell gas, open the doors and windows and leave.",
          "Look out for snakes, scorpions and other animals hiding in the rubbish, buckets and corners. Use a long stick to check.",
          "Keep the main switch off while the floor is wet. When everything is dry, turn on one circuit at a time. If a socket or switch is still damp, turn the power off again.",
        ],
        items: [
          "Do not use appliances that were under water until they have been checked.",
          "MEA on 1130, 24 hours, can check the supply and move meters and sockets higher.",
          "Report fallen cables or sparking equipment to MEA on 1130 straight away.",
        ],
      },
      {
        id: "cleaning-up",
        heading: "Cleaning up",
        items: [
          "Wear rubber boots, household rubber gloves, a mask (N95 if you have one) and something to protect your eyes.",
          "Cover cuts with waterproof plasters, and shower with soap as soon as you finish.",
          "Scrub hard surfaces with detergent, then disinfect them with chlorine solution or 0.5% sodium hypochlorite. Never mix chlorine bleach with ammonia.",
          "Open the windows and use fans to dry rooms. Throw away mattresses, carpets and soft furniture that cannot be dried, and watch for mould for several weeks.",
          "Throw away food that touched floodwater. Drink bottled or boiled water.",
          "Empty buckets, pots and anything else holding water, so mosquitoes cannot breed.",
          "Tie rubbish bags shut. Report piles of flood rubbish in Traffy Fondue under Found flood rubbish (เจอกองขยะน้ำท่วม), or call 1555.",
          "Check Greener Bangkok for free drop off points for large items near you.",
        ],
        links: [
          {
            label: "Find free drop off points on Greener Bangkok",
            href: "https://greener.bangkok.go.th/",
          },
        ],
      },
      {
        id: "health",
        heading: "Your health after the floods",
        body: [
          "Leptospirosis and melioidosis are common after floods. They can be treated if you see a doctor early.",
        ],
        items: [
          "See a doctor straight away if, within 4 weeks of being in floodwater or mud, you get a high fever, a headache, aching calves, thighs or lower back, or red eyes. Say you were in floodwater.",
          "Call 1669 if you have trouble breathing, yellow skin or eyes, or you pass very little urine.",
          "See a doctor if a cut that touched floodwater becomes red, swollen or painful.",
          "Watch for diarrhoea, sore red eyes and itchy skin between your toes, which are also common after floods.",
          "For advice on diseases, call the Department of Disease Control on 1422.",
          "Floods are stressful. If you are struggling, talk to someone you trust or call the mental health hotline on 1323.",
        ],
      },
      {
        id: "weather",
        heading: "More rain on 5 and 6 October",
        body: [
          "At 05:00 on 3 October the Thai Meteorological Department warned of thunderstorms, strong winds and heavy to very heavy rain in Bangkok on 5 and 6 October, which can cause flash flooding in low areas. The BMA is lowering the main canals to make room, and expects showers on and off rather than days of heavy rain.",
        ],
        items: [
          "Parts of Saphan Sung and the Kheha Romklao flats in Lat Krabang are still flooded while Khlong Prawet Burirom drains.",
          "The Chao Phraya Dam is still releasing 2,500 cubic metres a second. Keep away from Tha Prachan, Tha Chang and other piers at high tide, because they are outside the river wall.",
          "Do not walk or drive through floodwater.",
          "Check the BMA flood alert page before you travel.",
          "Keep your phone charged and your documents in a waterproof bag.",
        ],
        links: [
          {
            label: "Open the BMA flood alert page",
            href: "https://now.bangkok.go.th/flood-alert.html",
          },
          {
            label: "Check live river levels on Thaiwater",
            href: "https://www.thaiwater.net/water/wl",
          },
        ],
      },
      {
        id: "help",
        heading: "Reporting problems and getting help",
        items: [
          "Report flooding, blocked drains, rubbish and people who need food or help through Traffy Fondue on LINE (@Traffyfondue) or the BMA hotline 1555.",
          "If your home is still flooded and you need somewhere to stay, BMA Flood Support lists the shelters that are open.",
          "For a medical emergency, call 1669.",
          "For disaster help, call DDPM on 1784 or message @1784DDPM on LINE.",
          "Only trust flood news from the BMA, the Thai Meteorological Department, DDPM and Thammasat. Check before you share anything.",
          "Check on friends and neighbours, especially international students who do not read Thai.",
        ],
        links: [
          {
            label: "Open BMA Flood Support",
            href: "https://floodsupport.bangkok.go.th/",
          },
        ],
      },
    ],
  },
  th: {
    title: "หลังน้ำท่วมกรุงเทพฯ",
    summary:
      "น้ำท่วมที่เริ่มตั้งแต่วันที่ 24 กันยายนลดลงแล้วในกรุงเทพฯ เกือบทุกพื้นที่ เหลือบางส่วนของเขตลาดกระบังและเขตสะพานสูงที่ยังมีน้ำท่วมขัง และคาดว่าจะมีฝนตกหนักอีกในวันที่ 5 และ 6 ตุลาคม หน้านี้รวบรวมเรื่องการเรียนและการสอบของธรรมศาสตร์ วิธีขอรับเงินช่วยเหลือค่าเสียหายจากน้ำท่วม และการกลับเข้าบ้านและทำความสะอาดอย่างปลอดภัย",
    banner: "น้ำลดแล้ว ดูวิธีขอรับเงิน 9,000 บาทของรัฐบาลและเงินช่วยเหลือค่าเสียหายของ กทม.",
    now: [
      "ถ่ายภาพหรือวิดีโอความเสียหายไว้ก่อนทำความสะอาดหรือทิ้งของ เพราะต้องใช้เป็นหลักฐานในการยื่นขอรับเงิน",
      "ยื่นขอเงิน 9,000 บาทของรัฐบาลผ่านแอปทางรัฐ และยื่นขอเงินช่วยเหลือของ กทม. ที่ claim.bangkok.go.th ทั้งสองโครงการแยกจากกัน จึงต้องยื่นทั้งสองทาง ส่วนของ กทม. ต้องยื่นภายใน 30 วันนับแต่วันที่ประสบภัย",
      "ยกคัตเอาต์ค้างไว้จนกว่าพื้น สายไฟ และเต้ารับจะแห้งสนิท หากไม่แน่ใจว่าปลอดภัย โทรการไฟฟ้านครหลวง 1130",
      "สวมรองเท้าบูทและถุงมือยางขณะทำความสะอาด หากมีไข้ภายใน 4 สัปดาห์หลังลุยน้ำ ให้ไปพบแพทย์และบอกว่าเคยลุยน้ำท่วม",
      "เข้าสอบกลางภาคที่เลื่อนไปวันอาทิตย์ที่ 4 หรือวันอาทิตย์ที่ 11 ตุลาคม อาจารย์ผู้สอนจะแจ้งว่าจะเรียนออนไลน์ต่อหรือไม่",
      "คาดว่ากรุงเทพฯ จะมีฝนตกหนักในวันที่ 5 และ 6 ตุลาคม ตรวจสอบหน้าแจ้งเตือนน้ำท่วมของ กทม. ก่อนเดินทาง และหลีกเลี่ยงท่าเรือในช่วงน้ำขึ้น",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "การเรียนและการสอบของธรรมศาสตร์",
        body: [
          "ทุกรายวิชาทุกศูนย์การศึกษาเรียนออนไลน์ถึงวันเสาร์ที่ 3 ตุลาคม จนถึงเวลา 16.00 น. วันที่ 3 ตุลาคม มหาวิทยาลัยยังไม่ประกาศรูปแบบการเรียนตั้งแต่วันจันทร์ที่ 5 ตุลาคม",
          "ประกาศมหาวิทยาลัยเมื่อวันที่ 29 กันยายนระบุว่า หลังวันที่ 3 ตุลาคม หากนักศึกษายังได้รับผลกระทบ อาจารย์อาจจัดการเรียนการสอนแบบออนไลน์หรือแบบผสมผสานต่อไป และจะแจ้งล่วงหน้า หากยังได้รับผลกระทบจากน้ำท่วม ให้แจ้งอาจารย์ผู้สอนหรือหน่วยงานของคณะ",
        ],
        directoryOpen: true,
        directory: [
          {
            heading: "สอบกลางภาค หลักสูตรระดับปริญญาตรี",
            places: [
              {
                name: "รายวิชาที่สอบวันเสาร์ที่ 26 กันยายน",
                detail: "เลื่อนไปสอบวันอาทิตย์ที่ 4 ตุลาคม",
              },
              {
                name: "รายวิชาที่สอบวันอาทิตย์ที่ 27 กันยายน",
                detail: "เลื่อนไปสอบวันอาทิตย์ที่ 11 ตุลาคม",
              },
              {
                name: "รายวิชาที่สอบไปแล้ว แต่เข้าสอบไม่ได้เพราะฝนตกหนัก",
                detail:
                  "อาจารย์ผู้สอนจะจัดเก็บคะแนนด้วยวิธีอื่นตามดุลยพินิจ โดยคิดคะแนนเทียบเท่ากับการสอบ",
              },
              {
                name: "การขอถอนรายวิชา (บันทึกอักษร W ผ่านระบบ)",
                detail: "ขยายเวลาถึงวันที่ 26 ตุลาคม",
              },
              {
                name: "ผลสอบกลางภาค",
                detail: "ขยายเวลาตรวจข้อสอบออกไป 14 วัน อาจารย์จะแจ้งผลก่อนครบกำหนดถอนรายวิชา",
              },
            ],
            note: "ภาคการศึกษาที่ 1/2569",
          },
          {
            heading: "ความช่วยเหลือจาก อมธ.",
            places: [
              {
                name: "ศูนย์พักพิงชั่วคราว ตึกกิจกรรมนักศึกษา มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
                detail:
                  "อมธ. ท่าพระจันทร์เปิดให้นักศึกษาที่บ้านถูกน้ำท่วมเข้าพัก โปรดติดต่อ อมธ. เพื่อสอบถามว่ายังเปิดอยู่หรือไม่ก่อนเดินทาง",
              },
              {
                name: "อมธ. ท่าพระจันทร์",
                detail: "Instagram TUSU.TPC",
                phone: { phone: "095-249-5014" },
              },
              { name: "อมธ. ท่าพระจันทร์ (เบอร์สำรอง)", phone: { phone: "094-965-9926" } },
              { name: "กองกิจการนักศึกษา", phone: { phone: "02-222-8871" } },
            ],
            links: [
              {
                label: "ลงทะเบียนเข้าพักศูนย์พักพิง",
                href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
              },
            ],
          },
        ],
        links: [
          {
            label: "อ่านประกาศมหาวิทยาลัยธรรมศาสตร์ ฉบับที่ 2 วันที่ 29 กันยายน (ฉบับสแกน)",
            href: "/emergency/tu-announcement-2-2026-09-29.jpg",
          },
          {
            label: "อ่านประกาศมหาวิทยาลัยธรรมศาสตร์ วันที่ 26 กันยายน (ฉบับสแกน)",
            href: "/emergency/tu-announcement-2026-09-26.jpg",
          },
        ],
      },
      {
        id: "money",
        heading: "เงินช่วยเหลือที่ขอรับได้",
        body: [
          "เงินช่วยเหลือมี 2 แหล่งที่แยกจากกัน การยื่นทางหนึ่งไม่ถือว่ายื่นอีกทางหนึ่งด้วย หากเข้าเกณฑ์ทั้งสองแหล่งต้องยื่นทั้งสองทาง",
        ],
        items: [
          "รัฐบาลจ่ายเงินช่วยเหลือค่าดำรงชีพครัวเรือนละ 9,000 บาท ยื่นผ่านแอปทางรัฐหรือที่สำนักงานเขต",
          "กทม. จ่ายค่าซ่อมแซมบ้าน ค่าเช่าบ้าน ค่าเครื่องมือประกอบอาชีพ ค่ารักษาพยาบาล ค่าจัดการศพ และค่าดำรงชีพเบื้องต้น ตามความเสียหายจริง ยื่นที่ claim.bangkok.go.th หรือที่สำนักงานเขต",
          "ที่สำนักงานเขตยื่นทั้งสองทางได้พร้อมกัน ให้ไปที่สำนักงานเขตตามที่ตั้งของบ้านที่ถูกน้ำท่วม ในวันจันทร์ถึงศุกร์ เวลาราชการ",
          "ทั้งสองทางไม่ต้องใช้ใบแจ้งความหรือบันทึกประจำวัน",
          "ระบบประกันภัยพิบัติแห่งชาติที่เริ่มวันที่ 1 ตุลาคม ไม่ครอบคลุมน้ำท่วมครั้งนี้",
        ],
        links: [
          {
            label: "อ่านอินโฟกราฟิกของ กทม. เรื่องเงินช่วยเหลือ 2 แหล่ง",
            href: "/emergency/bma-flood-claims-2-sources-2026-10.jpg",
          },
        ],
      },
      {
        id: "government-payment",
        heading: "เงินช่วยเหลือ 9,000 บาทของรัฐบาล",
        body: [
          "กรมป้องกันและบรรเทาสาธารณภัย (ปภ.) จ่ายเงินช่วยเหลือครัวเรือนละ 9,000 บาท ได้ครั้งเดียว สำหรับผู้ที่ที่อยู่อาศัยประจำอยู่ในพื้นที่ที่ประกาศเป็นเขตประสบภัย และได้รับผลกระทบจากน้ำท่วมระหว่างวันที่ 15 พฤษภาคม ถึงวันที่ 30 กันยายน 2569",
          "ในกรุงเทพฯ ปภ. ประกาศเขตการให้ความช่วยเหลือ 38 เขต 118 แขวง ไม่รวมเขตพระนครซึ่งเป็นที่ตั้งของท่าพระจันทร์ หากไม่แน่ใจว่าแขวงของคุณอยู่ในเขตช่วยเหลือหรือไม่ ให้สอบถามสำนักงานเขต",
          "กรณีบ้านเช่า ผู้เช่าเป็นผู้รับเงิน ไม่ใช่เจ้าของบ้าน และบ้านที่ไม่มีทะเบียนบ้านก็มีสิทธิได้",
          "มีสิทธิได้รับเงินหากระหว่างวันที่ 15 พฤษภาคม ถึงวันที่ 30 กันยายน เกิดกรณีใดกรณีหนึ่งต่อไปนี้",
        ],
        items: [
          "บ้านถูกน้ำท่วมขังติดต่อกันเกิน 7 วัน",
          "บ้านถูกน้ำท่วมไม่เกิน 7 วัน และทรัพย์สินได้รับความเสียหาย",
          "บ้านถูกน้ำล้อมจนใช้ชีวิตตามปกติไม่ได้เกิน 7 วัน",
          "อยู่อาคารสูงที่น้ำท่วมไม่ถึงห้อง แต่ใช้ชีวิตตามปกติไม่ได้เกิน 7 วัน",
        ],
      },
      {
        id: "apply-government-payment",
        heading: "วิธียื่นขอเงิน 9,000 บาท",
        body: [
          "เปิดลงทะเบียนตั้งแต่เวลา 08.00 น. วันที่ 2 ตุลาคม ยังไม่มีการประกาศวันปิดรับ ควรยื่นโดยเร็วที่สุด",
        ],
        steps: [
          "ผูกพร้อมเพย์กับเลขบัตรประชาชนไว้กับธนาคาร หากยังไม่ได้ผูก เพราะเงินจะโอนเข้าทางนี้",
          "เปิดแอปทางรัฐแล้วเข้าสู่ระบบ",
          "แตะ บริการทั้งหมด แล้วเลือกหมวด ลงทะเบียนตรวจสอบสิทธิ",
          "เลือก ยื่นขอรับเงินเยียวยาผู้ประสบภัย แล้วอนุญาตการเข้าถึงข้อมูลและยอมรับเงื่อนไข",
          "แตะ ลงทะเบียนขอรับความช่วยเหลือ กรอกข้อมูล ตรวจสอบความถูกต้อง แล้วส่งแบบฟอร์ม",
        ],
        items: [
          "หากไม่มีสมาร์ตโฟน ให้ไปที่สำนักงานเขต เจ้าหน้าที่จะช่วยกรอกข้อมูลให้",
          "ระบบตรวจสอบข้อมูลกับฐานข้อมูลทะเบียนราษฎร และติดตามสถานะได้ในแอป",
          "หากผ่านการตรวจสอบ ธนาคารออมสินจะโอนเงินเข้าพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน",
        ],
      },
      {
        id: "bma-compensation",
        heading: "เงินช่วยเหลือค่าเสียหายของ กทม.",
        body: [
          "กทม. จ่ายเงินช่วยเหลือตามความเสียหายจริง ตามระเบียบของ กทม. และระเบียบกระทรวงการคลัง จำนวนเงินด้านล่างเป็นอัตราสูงสุด เงินที่ได้รับจริงขึ้นอยู่กับความเสียหาย คุณสมบัติของผู้ประสบภัย และเอกสารหลักฐาน จึงอาจต่ำกว่านี้",
          "ทุกประเภทต้องใช้แบบสอบข้อเท็จจริงผู้ประสบภัย สำเนาบัตรประชาชน และสำเนาสมุดบัญชีธนาคาร กรณีไม่รับเงินผ่านพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน ส่วนเอกสารอื่นระบุไว้ใต้แต่ละประเภท",
        ],
        items: [
          "ต้องเป็นที่อยู่อาศัยประจำที่ได้รับความเสียหายจากน้ำท่วม หรือน้ำท่วมถึงพื้นที่พักอาศัย",
          "ค่าซ่อมแซมบ้านให้เฉพาะเจ้าของบ้านหรือเจ้าบ้าน ไม่รวมบ้านเช่า",
          "ผู้เช่าห้องหรือคอนโดที่ไม่มีชื่อในทะเบียนบ้าน ขอรับความช่วยเหลือประเภทอื่นได้",
          "บ้านหรืออาคารที่มีหลายชั้น ได้รับเฉพาะชั้นที่น้ำท่วมถึง",
          "รถยนต์ที่จมน้ำไม่ได้รับการชดเชย หากทำประกันรถยนต์ไว้ ให้ติดต่อตัวแทนประกันภัย",
        ],
        directory: [
          {
            heading: "ค่าซ่อมแซมบ้านหรือที่พักอาศัย",
            places: [
              {
                name: "ไม่เกิน 88,600 บาทต่อหลัง",
                detail:
                  "ตามความเสียหายจริง ช่วยเฉพาะค่าวัสดุซ่อมแซมส่วนที่เป็นโครงสร้างอาคาร ตามแบบฟอร์มที่กำหนด",
              },
              {
                name: "เอกสาร",
                detail:
                  "สำเนาทะเบียนบ้าน สำเนาโฉนดที่ดินที่ระบุชื่อเจ้าบ้านหรือเจ้าของบ้าน หรือแบบคำร้องแทนโฉนด เอกสารประกอบการขอรับความช่วยเหลือค่าซ่อมแซม และภาพถ่ายความเสียหาย",
              },
            ],
          },
          {
            heading: "ค่าที่พักชั่วคราวหรือค่าเช่าบ้าน",
            places: [
              { name: "บ้านเสียหายบางส่วน", detail: "ไม่เกิน 3,000 บาทต่อครอบครัว" },
              {
                name: "บ้านเสียหายทั้งหลัง",
                detail: "ไม่เกิน 3,000 บาทต่อครอบครัวต่อเดือน ไม่เกิน 2 เดือน",
              },
              {
                name: "ผู้มีสิทธิ",
                detail:
                  "ผู้ที่อยู่ในบ้านนั้นเป็นประจำ และต้องเสียค่าที่พักชั่วคราวหรือค่าเช่าบ้าน เพราะบ้านได้รับความเสียหายหรือถูกน้ำท่วมขัง",
              },
              {
                name: "เอกสาร",
                detail: "ภาพถ่ายความเสียหาย สัญญาเช่า และใบเสร็จหรือหลักฐานการโอนเงิน",
              },
            ],
          },
          {
            heading: "ค่าดำรงชีพเบื้องต้น",
            places: [
              { name: "บ้านเสียหายทั้งหลัง", detail: "3,800 บาท" },
              { name: "บ้านเสียหายบางส่วน", detail: "1,900 บาท" },
              {
                name: "เอกสาร",
                detail: "ภาพถ่ายความเสียหาย และเอกสารอื่น เช่น สัญญาเช่าหรือใบเสร็จค่าเช่า",
              },
            ],
          },
          {
            heading: "ค่าเครื่องมือประกอบอาชีพและเงินทุน",
            places: [
              {
                name: "ไม่เกิน 13,500 บาทต่อครอบครัว",
                detail:
                  "สำหรับเครื่องมือที่ใช้ในอาชีพหลักที่เลี้ยงครอบครัว รวมถึงวัตถุดิบ สินค้า และบริการ เท่าที่จ่ายจริง",
              },
              { name: "เอกสาร", detail: "ภาพถ่ายความเสียหาย" },
            ],
          },
          {
            heading: "ค่ารักษาพยาบาลและผู้บาดเจ็บ",
            places: [
              { name: "ผู้ป่วยนอก", detail: "ไม่เกิน 2,000 บาทต่อราย ตามที่จ่ายจริง" },
              { name: "ผู้ป่วยใน", detail: "ไม่เกิน 4,000 บาทต่อราย ตามที่จ่ายจริง" },
              { name: "ผู้ที่ได้รับบาดเจ็บ", detail: "เงินปลอบขวัญอีก 2,300 บาทต่อราย" },
              {
                name: "เอกสาร",
                detail: "ใบรับรองแพทย์ที่ระบุว่าได้รับบาดเจ็บจากอุทกภัย และใบเสร็จค่ารักษาพยาบาล",
              },
            ],
          },
          {
            heading: "ค่าจัดการศพผู้เสียชีวิต",
            places: [
              { name: "ไม่เกิน 35,700 บาทต่อราย" },
              {
                name: "กรณีผู้เสียชีวิตเป็นผู้หารายได้เลี้ยงดูครอบครัว",
                detail: "เงินสงเคราะห์เพิ่มอีกไม่เกิน 35,700 บาท",
              },
              {
                name: "เอกสาร",
                detail:
                  "แบบสอบข้อเท็จจริงที่ทายาทเป็นผู้กรอก สำเนาบัตรประชาชนและสำเนาทะเบียนบ้านของผู้เสียชีวิตและทายาท ใบมรณบัตร และใบชันสูตรศพ",
              },
            ],
          },
        ],
        links: [
          {
            label: "อ่านหลักเกณฑ์ผู้มีสิทธิของ กทม. (อินโฟกราฟิก)",
            href: "/emergency/bma-flood-claims-eligibility-2026-10.jpg",
          },
          {
            label: "อ่านอัตราและเอกสารของ กทม. ส่วนที่ 1 (อินโฟกราฟิก)",
            href: "/emergency/bma-flood-claims-rates-1-2026-10.jpg",
          },
          {
            label: "อ่านอัตราและเอกสารของ กทม. ส่วนที่ 2 (อินโฟกราฟิก)",
            href: "/emergency/bma-flood-claims-rates-2-2026-10.jpg",
          },
        ],
      },
      {
        id: "claim-bma-compensation",
        heading: "วิธียื่นขอเงินช่วยเหลือของ กทม.",
        body: [
          "ต้องยื่นภายใน 30 วันนับแต่วันที่ประสบสาธารณภัย ยื่นออนไลน์ได้ตลอด 24 ชั่วโมง หรือยื่นด้วยตนเองที่สำนักงานเขต",
        ],
        steps: [
          "ถ่ายภาพหรือวิดีโอความเสียหายของบ้านและทรัพย์สินไว้ก่อนทำความสะอาด",
          "เตรียมเอกสารตามที่ระบุไว้ใต้แต่ละประเภทด้านบน",
          "เข้า claim.bangkok.go.th แล้วเลือกตรวจสอบสิทธิ ตอบคำถามเรื่องที่พัก ความเสียหาย และการบาดเจ็บ",
          "หากระบบแสดงว่าอาจมีสิทธิ ให้กดยอมรับแล้วอัปโหลดเอกสาร กรอกและเซ็นเอกสารออนไลน์ได้เลย ไม่ต้องปรินต์",
          "หากจะยื่นด้วยตนเอง ให้ดาวน์โหลดแบบสอบข้อเท็จจริงหรือรับได้ที่สำนักงานเขต แล้วนำไปยื่นพร้อมสำเนาเอกสารที่สำนักงานเขตตามที่ตั้งของบ้านที่ได้รับผลกระทบ",
        ],
        items: [
          "การยื่นออนไลน์ต้องยืนยันตัวตนในแอป ThaiD หรือทางรัฐไว้ก่อน",
          "หากเอกสารไม่ครบ ไม่มีโฉนด ชื่อหลังโฉนดไม่ตรงกับผู้ยื่น หรือที่อยู่อาศัยไม่มีเลขที่บ้าน ให้ติดต่อสำนักงานเขต เจ้าหน้าที่จะสอบบันทึกถ้อยคำ (ปค.14) แทน",
          "ค่าซ่อมแซมที่เจ้าบ้านหรือเจ้าของบ้านเป็นผู้ยื่น จะได้รับการตรวจสอบสิทธิและเยียวยาได้เร็ว",
        ],
        links: [
          { label: "ยื่นออนไลน์ที่ claim.bangkok.go.th", href: "https://claim.bangkok.go.th/" },
          {
            label: "ดาวน์โหลดแบบสอบข้อเท็จจริงผู้ประสบอุทกภัย (PDF)",
            href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
          },
          {
            label: "อ่านคำถามที่พบบ่อยของ กทม. (อินโฟกราฟิก)",
            href: "/emergency/bma-flood-claims-faq-2026-10.jpg",
          },
        ],
      },
      {
        id: "after-you-claim",
        heading: "หลังยื่นคำร้อง",
        items: [
          "หากต้องการข้อมูลเพิ่ม เจ้าหน้าที่เขตจะติดต่อทาง SMS และอาจลงพื้นที่ตรวจสอบความเสียหาย",
          "กทม. โอนเงินเข้าพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน หรือเข้าบัญชีธนาคาร ซึ่งอาจมีค่าธรรมเนียมหากไม่ใช่ธนาคารกรุงไทย",
          "กทม. ระบุว่าใช้เวลาดำเนินการจ่ายไม่ต่ำกว่า 60 วัน และยังกำหนดวันจ่ายที่แน่นอนไม่ได้ เพราะมีผู้ได้รับผลกระทบราว 270,000 ถึง 300,000 ครัวเรือน",
          "อัตราเงินช่วยเหลือแต่ละประเภทอาจปรับขึ้นลงตามมติคณะรัฐมนตรี",
          "หากต้องการความช่วยเหลือเรื่องการยื่นคำร้อง โทร 1555 หรือติดต่อสำนักงานเขต",
        ],
      },
      {
        id: "international-students",
        heading: "สำหรับผู้ที่ไม่มีสัญชาติไทย",
        body: [
          "ทั้งสองโครงการไม่ได้ระบุว่าผู้ที่ไม่มีสัญชาติไทยยื่นได้หรือไม่ ทั้งคู่ตรวจสอบผู้ยื่นกับฐานข้อมูลทะเบียนราษฎร จ่ายเงินผ่านพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน และระบบออนไลน์ต้องใช้ ThaiD หรือทางรัฐ",
        ],
        items: [
          "นำหนังสือเดินทาง สัญญาเช่าหรือหลักฐานที่อยู่อื่น และภาพถ่ายความเสียหายไปสอบถามที่สำนักงานเขตว่ามีสิทธิขอรับอะไรได้บ้าง",
          "หากเช่าที่พัก ให้ถ่ายภาพเฟอร์นิเจอร์และอุปกรณ์ของผู้ให้เช่า และขอความยินยอมเป็นลายลักษณ์อักษรก่อนทิ้ง การซ่อมแซมตัวอาคารโดยปกติเป็นหน้าที่ของผู้ให้เช่า",
          "หากมีประกันจากสถานทูต ทุนการศึกษา หรือที่ทำเอง ให้ติดต่อบริษัทประกันก่อนทำความสะอาด",
          "ขอให้เพื่อนคนไทยหรือ BIRSA ช่วยกรอกแบบฟอร์มภาษาไทย",
        ],
      },
      {
        id: "going-home",
        heading: "การกลับเข้าบ้าน",
        steps: [
          "รอให้น้ำลดและเจ้าหน้าที่แจ้งว่าปลอดภัยก่อนกลับเข้าบ้าน",
          "ก่อนเข้าบ้าน ดูว่าผนังเอียง มีรอยร้าว หรือฝ้าเพดานหย่อนหรือไม่ หากดูไม่ปลอดภัยอย่าเข้าไป",
          "ใช้ไฟฉาย อย่าจุดไฟหรือเปิดสวิตช์ในบ้านจนกว่าจะแน่ใจว่าไม่มีแก๊สรั่ว",
          "หากใช้ถังแก๊สหุงต้ม ตรวจดูว่าปิดวาล์วแล้ว หากได้กลิ่นแก๊ส ให้เปิดประตูหน้าต่างแล้วออกจากบ้าน",
          "ระวังงู แมงป่อง และสัตว์มีพิษที่ซ่อนอยู่ตามกองขยะ ถัง กะละมัง และซอกมุม ใช้ไม้ยาวเขี่ยดูก่อน",
          "ยกคัตเอาต์ค้างไว้ตลอดเวลาที่พื้นยังเปียก เมื่อแห้งสนิทแล้วให้ลองเปิดไฟทีละวงจร หากเต้ารับหรือสวิตช์จุดใดยังชื้น ให้ปิดไฟอีกครั้ง",
        ],
        items: [
          "อย่าใช้เครื่องใช้ไฟฟ้าที่จมน้ำจนกว่าจะได้รับการตรวจสอบ",
          "การไฟฟ้านครหลวง โทร 1130 ตลอด 24 ชั่วโมง ตรวจสอบระบบไฟฟ้าและย้ายมิเตอร์หรือเต้ารับขึ้นที่สูงได้",
          "หากพบสายไฟขาดหรืออุปกรณ์ไฟฟ้ามีประกายไฟ แจ้งการไฟฟ้านครหลวง 1130 ทันที",
        ],
      },
      {
        id: "cleaning-up",
        heading: "การทำความสะอาดบ้าน",
        items: [
          "สวมรองเท้าบูทยาง ถุงมือยางสำหรับงานบ้าน หน้ากาก (N95 ถ้ามี) และแว่นป้องกันตา",
          "ปิดแผลด้วยพลาสเตอร์กันน้ำ และอาบน้ำฟอกสบู่ทันทีเมื่อทำเสร็จ",
          "ขัดล้างพื้นผิวแข็งด้วยผงซักฟอก แล้วฆ่าเชื้อด้วยน้ำคลอรีนหรือโซเดียมไฮโปคลอไรต์ 0.5 เปอร์เซ็นต์ ห้ามผสมน้ำยาคลอรีนกับแอมโมเนีย",
          "เปิดหน้าต่างและใช้พัดลมช่วยให้ห้องแห้ง ทิ้งที่นอน พรม และเฟอร์นิเจอร์บุนวมที่ทำให้แห้งไม่ได้ และคอยสังเกตเชื้อราไปอีกหลายสัปดาห์",
          "ทิ้งอาหารที่สัมผัสน้ำท่วม ดื่มน้ำบรรจุขวดหรือน้ำต้มสุก",
          "เทน้ำขังในถัง กระถาง และภาชนะต่าง ๆ ทิ้ง เพื่อไม่ให้ยุงวางไข่",
          "มัดปากถุงขยะให้แน่น แจ้งกองขยะน้ำท่วมใน Traffy Fondue หัวข้อ เจอกองขยะน้ำท่วม หรือโทร 1555",
          "ตรวจสอบจุดทิ้งขยะชิ้นใหญ่ฟรีใกล้บ้านได้ที่ Greener Bangkok",
        ],
        links: [
          {
            label: "ค้นหาจุดทิ้งขยะชิ้นใหญ่ฟรีที่ Greener Bangkok",
            href: "https://greener.bangkok.go.th/",
          },
        ],
      },
      {
        id: "health",
        heading: "สุขภาพหลังน้ำลด",
        body: ["โรคฉี่หนูและโรคไข้ดินพบบ่อยหลังน้ำท่วม หากไปพบแพทย์เร็วจะรักษาได้"],
        items: [
          "หากมีไข้สูง ปวดศีรษะ ปวดกล้ามเนื้อน่อง ต้นขา หรือหลังส่วนล่าง หรือตาแดง ภายใน 4 สัปดาห์หลังลุยน้ำหรือย่ำโคลน ให้ไปพบแพทย์ทันทีและบอกว่าเคยลุยน้ำท่วม",
          "โทร 1669 หากหายใจลำบาก ตัวเหลืองหรือตาเหลือง หรือปัสสาวะน้อยมาก",
          "ไปพบแพทย์หากแผลที่โดนน้ำท่วมบวมแดงหรือเจ็บมากขึ้น",
          "สังเกตอาการท้องร่วง ตาแดง และน้ำกัดเท้า ซึ่งพบบ่อยหลังน้ำท่วมเช่นกัน",
          "สอบถามเรื่องโรคติดต่อได้ที่สายด่วนกรมควบคุมโรค 1422",
          "น้ำท่วมทำให้เครียดได้ หากรู้สึกหนักใจ ให้คุยกับคนที่ไว้ใจ หรือโทรสายด่วนสุขภาพจิต 1323",
        ],
      },
      {
        id: "weather",
        heading: "ฝนตกหนักอีกในวันที่ 5 และ 6 ตุลาคม",
        body: [
          "เวลา 05.00 น. วันที่ 3 ตุลาคม กรมอุตุนิยมวิทยาเตือนว่ากรุงเทพฯ จะมีพายุฝนฟ้าคะนอง ลมกระโชกแรง และฝนตกหนักถึงหนักมากในวันที่ 5 และ 6 ตุลาคม ซึ่งอาจทำให้เกิดน้ำท่วมฉับพลันในที่ลุ่ม กทม. กำลังพร่องน้ำในคลองหลักเพื่อรองรับฝน และคาดว่าจะเป็นฝนตกเป็นช่วง ๆ ไม่ใช่ฝนตกหนักสะสมหลายวัน",
        ],
        items: [
          "บางส่วนของเขตสะพานสูงและเคหะร่มเกล้า เขตลาดกระบัง ยังมีน้ำท่วมขังระหว่างรอระบายน้ำจากคลองประเวศบุรีรมย์",
          "เขื่อนเจ้าพระยายังระบายน้ำ 2,500 ลูกบาศก์เมตรต่อวินาที หลีกเลี่ยงท่าพระจันทร์ ท่าช้าง และท่าเรืออื่น ๆ ในช่วงน้ำขึ้น เพราะอยู่นอกแนวกำแพงกั้นน้ำ",
          "อย่าเดินหรือขับรถลุยน้ำท่วม",
          "ตรวจสอบหน้าแจ้งเตือนน้ำท่วมของ กทม. ก่อนออกเดินทาง",
          "ชาร์จโทรศัพท์ให้พร้อม และเก็บเอกสารไว้ในถุงกันน้ำ",
        ],
        links: [
          {
            label: "เปิดหน้าแจ้งเตือนน้ำท่วมของ กทม.",
            href: "https://now.bangkok.go.th/flood-alert.html",
          },
          {
            label: "ดูระดับน้ำในแม่น้ำเจ้าพระยาแบบเรียลไทม์ที่ Thaiwater",
            href: "https://www.thaiwater.net/water/wl",
          },
        ],
      },
      {
        id: "help",
        heading: "แจ้งเหตุและขอความช่วยเหลือ",
        items: [
          "แจ้งน้ำท่วมขัง ท่อระบายน้ำอุดตัน ขยะ หรือผู้ที่ต้องการอาหารหรือความช่วยเหลือ ได้ทาง Traffy Fondue บน LINE (@Traffyfondue) หรือสายด่วน กทม. 1555",
          "หากบ้านยังมีน้ำท่วมและต้องการที่พัก ดูศูนย์พักพิงที่ยังเปิดอยู่ได้ที่ BMA Flood Support",
          "หากเจ็บป่วยฉุกเฉิน โทร 1669",
          "หากประสบสาธารณภัยและต้องการความช่วยเหลือ ติดต่อ ปภ. โทร 1784 หรือ LINE @1784DDPM",
          "ติดตามข่าวน้ำท่วมจากแหล่งที่เชื่อถือได้เท่านั้น ได้แก่ กทม. กรมอุตุนิยมวิทยา ปภ. และธรรมศาสตร์ และตรวจสอบข้อเท็จจริงทุกครั้งก่อนแชร์",
          "หมั่นถามไถ่เพื่อนและเพื่อนบ้าน โดยเฉพาะนักศึกษาต่างชาติที่อ่านภาษาไทยไม่ได้",
        ],
        links: [
          {
            label: "เปิด BMA Flood Support",
            href: "https://floodsupport.bangkok.go.th/",
          },
        ],
      },
    ],
  },
};

export default flooding;
