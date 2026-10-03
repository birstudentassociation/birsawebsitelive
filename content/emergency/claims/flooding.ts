import type { EmergencyGuide } from "@/content/emergency/types";

/**
 * How to claim money after the Bangkok floods of September 2026, one thing per
 * page. Facts come from DDPM, the BMA's own infographics (in
 * `public/emergency/bma-flood-claims-*`) and the reports below. The checker at
 * `/emergency/flooding/claims/check` uses the same amounts, from
 * `content/emergency/claims/checker.ts`, so change both together.
 */
const CHECK = "/emergency/flooding/claims/check";

const floodingClaims: EmergencyGuide = {
  slug: "claims",
  reviewed: "2026-10-03",
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
        en: "Bangkok Biz News, DDPM names 118 subdistricts in 38 districts for flood relief, 29 September 2026 (Thai)",
        th: "กรุงเทพธุรกิจ กางพื้นที่ กทม. 38 เขต 118 แขวง เป็นเขตช่วยเหลือภัยพิบัติน้ำท่วม 29 กันยายน 2569",
      },
      href: "https://www.bangkokbiznews.com/news/news-update/1254219",
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
  ],
  en: {
    title: "Claim money after the Bangkok floods",
    summary:
      "There are 2 separate schemes for people whose homes were flooded. Find out who can get what, the documents you need, and how to apply.",
    parts: [
      {
        slug: "overview",
        title: "Overview",
        blocks: [
          {
            kind: "paragraph",
            text: "If the place you usually live was flooded, you may be able to get money from 2 separate schemes.",
          },
          {
            kind: "table",
            caption: "The 2 schemes",
            rows: [
              ["Scheme", "What you can get", "Where to apply"],
              [
                "Government payment, from DDPM",
                "9,000 baht per household, once",
                "Tang Rat app or your district office",
              ],
              [
                "BMA compensation",
                "Money towards repairs, rent, living costs, tools, medical bills and funerals, based on your damage",
                "claim.bangkok.go.th or your district office",
              ],
            ],
          },
          {
            kind: "warning",
            text: "Applying to one scheme does not apply you to the other. If you qualify for both, you must apply to both.",
          },
          {
            kind: "list",
            items: [
              "You must claim BMA compensation within 30 days of the flood. No closing date has been announced for the government payment.",
              "You do not need a police report for either scheme.",
              "The national disaster insurance that started on 1 October 2026 does not cover these floods.",
            ],
          },
          {
            kind: "inset",
            text: "Photograph or film the damage before you clean up or throw anything away. You need the pictures to claim.",
          },
          { kind: "heading", text: "Check what you can claim" },
          {
            kind: "paragraph",
            text: "Answer up to 6 questions to find out which money you may be able to get. It takes about 2 minutes.",
          },
          { kind: "start", label: "Start now", href: CHECK },
        ],
      },
      {
        slug: "who-can-get-9000-baht",
        title: "Who can get the 9,000 baht",
        blocks: [
          {
            kind: "paragraph",
            text: "The Department of Disaster Prevention and Mitigation (DDPM) pays 9,000 baht once to each household whose usual home is in a declared disaster area and was affected by flooding between 15 May and 30 September 2026.",
          },
          {
            kind: "paragraph",
            text: "You can get it if, during that time, one of these happened to your home.",
          },
          {
            kind: "list",
            items: [
              "It was flooded for more than 7 days in a row.",
              "It was flooded for 7 days or fewer and your belongings were damaged.",
              "It was cut off by water for more than 7 days, so you could not live there normally.",
              "It is in a high rise above the water, but you could not live normally for more than 7 days.",
            ],
          },
          { kind: "heading", text: "Where in Bangkok" },
          {
            kind: "paragraph",
            text: "DDPM named 118 subdistricts in 38 Bangkok districts as the area where help can be given. Phra Nakhon, where Tha Prachan is, is not one of them.",
          },
          {
            kind: "paragraph",
            text: "If you are not sure your subdistrict is included, ask your district office.",
          },
          { kind: "heading", text: "If you rent" },
          {
            kind: "paragraph",
            text: "The money is paid to you as the tenant, not to your landlord. Homes without a house registration can also qualify.",
          },
          {
            kind: "links",
            links: [{ label: "Check what you can claim", href: CHECK }],
          },
        ],
      },
      {
        slug: "apply-for-9000-baht",
        title: "How to apply for the 9,000 baht",
        blocks: [
          {
            kind: "paragraph",
            text: "Registration opened at 08:00 on 2 October 2026. No closing date has been announced, so apply as soon as you can.",
          },
          { kind: "heading", text: "Before you start" },
          {
            kind: "paragraph",
            text: "Ask your bank to link PromptPay to your ID card number, if it is not linked already. The money is paid this way.",
          },
          { kind: "heading", text: "Apply in the Tang Rat app" },
          {
            kind: "steps",
            items: [
              "Open the Tang Rat app and log in.",
              "Tap All services (บริการทั้งหมด), then Register to check eligibility (ลงทะเบียนตรวจสอบสิทธิ).",
              "Choose Apply for disaster relief payment (ยื่นขอรับเงินเยียวยาผู้ประสบภัย), give permission and accept the terms.",
              "Tap Register for help (ลงทะเบียนขอรับความช่วยเหลือ), fill in your details, check them and send the form.",
            ],
          },
          {
            kind: "paragraph",
            text: "The app checks your details against the civil registration database straight away.",
          },
          { kind: "heading", text: "If you do not have a smartphone" },
          {
            kind: "paragraph",
            text: "Go to your district office. Staff will enter your details for you, and you can claim BMA compensation at the same time.",
          },
        ],
      },
      {
        slug: "who-can-get-bma-compensation",
        title: "Who can get BMA compensation",
        blocks: [
          {
            kind: "paragraph",
            text: "You can claim if the place you usually live in Bangkok was damaged by the floods, or if water came into the rooms you live in.",
          },
          {
            kind: "list",
            items: [
              "Only the owner or the head of the household can claim for repairs. Repairs to rented homes are not covered.",
              "If you rent, including a room or a condo, you can claim the other kinds of help even if your name is not on the house registration.",
              "In a building with several floors, only the floors that flooded can claim.",
              "If someone in your household was injured or died because of the floods, you can claim for treatment or a funeral.",
            ],
          },
          {
            kind: "paragraph",
            text: "The BMA does not pay the same to everyone. It looks at the kind of damage, how bad it is, and your documents.",
          },
          {
            kind: "inset",
            text: "Cars are not covered. If your car is insured, contact your insurer.",
          },
          {
            kind: "links",
            links: [
              {
                label: "Read the BMA's rules on who can claim (image, in Thai)",
                href: "/emergency/bma-flood-claims-eligibility-2026-10.jpg",
              },
            ],
          },
        ],
      },
      {
        slug: "what-the-bma-pays",
        title: "What the BMA pays",
        blocks: [
          {
            kind: "paragraph",
            text: "These are the most you can get. What you get depends on your damage, whether you qualify and your documents, so it may be less.",
          },
          {
            kind: "table",
            caption: "Most you can get from the BMA",
            rows: [
              ["Kind of help", "Most you can get"],
              ["Repairs to your home", "88,600 baht per home"],
              ["Temporary accommodation, home partly damaged", "3,000 baht per household"],
              [
                "Temporary accommodation, whole home damaged",
                "3,000 baht per household a month, for up to 2 months",
              ],
              ["Basic living costs, whole home damaged", "3,800 baht"],
              ["Basic living costs, home partly damaged", "1,900 baht"],
              ["Tools and stock for your work", "13,500 baht per household"],
              ["Treatment as an outpatient", "2,000 baht per person"],
              ["Treatment as an inpatient", "4,000 baht per person"],
              ["If you were injured", "A further 2,300 baht per person"],
              ["Funeral", "35,700 baht per person"],
              [
                "If the person who died supported the household",
                "A further 35,700 baht per person",
              ],
            ],
          },
          {
            kind: "details",
            summary: "What repairs cover",
            blocks: [
              {
                kind: "paragraph",
                text: "Only repair materials for the structure of the building, listed on the BMA's form, at what the damage really costs. Labour and furniture are not covered.",
              },
            ],
          },
          {
            kind: "details",
            summary: "What temporary accommodation covers",
            blocks: [
              {
                kind: "paragraph",
                text: "Rent or somewhere else to stay, if you usually lived in the home and had to move out because it was damaged or flooded. You need a tenancy agreement and receipts or proof of payment.",
              },
            ],
          },
          {
            kind: "details",
            summary: "What tools and stock cover",
            blocks: [
              {
                kind: "paragraph",
                text: "Tools for the main work that supports your household, including raw materials, goods and services, at what you actually paid.",
              },
            ],
          },
          {
            kind: "paragraph",
            text: "The amounts may still change by Cabinet decision.",
          },
          {
            kind: "links",
            links: [
              {
                label: "Read the BMA's rates, part 1 (image, in Thai)",
                href: "/emergency/bma-flood-claims-rates-1-2026-10.jpg",
              },
              {
                label: "Read the BMA's rates, part 2 (image, in Thai)",
                href: "/emergency/bma-flood-claims-rates-2-2026-10.jpg",
              },
            ],
          },
        ],
      },
      {
        slug: "documents",
        title: "Documents you need for BMA compensation",
        blocks: [
          { kind: "paragraph", text: "Every claim needs these." },
          {
            kind: "list",
            items: [
              "The fact-finding form (แบบสอบข้อเท็จจริงผู้ประสบภัย).",
              "A copy of your ID card.",
              "A copy of your bank book, if you are not paid by PromptPay linked to your ID card number.",
            ],
          },
          {
            kind: "paragraph",
            text: "You also need the documents for each kind of help you claim.",
          },
          {
            kind: "details",
            summary: "Repairs to your home",
            blocks: [
              {
                kind: "list",
                items: [
                  "A copy of your house registration.",
                  "A copy of the land title deed showing the owner, or a request form instead.",
                  "The request for repair materials.",
                  "Photographs of the damage.",
                ],
              },
            ],
          },
          {
            kind: "details",
            summary: "Temporary accommodation or rent",
            blocks: [
              {
                kind: "list",
                items: [
                  "Photographs of the damage.",
                  "Your tenancy agreement.",
                  "Receipts or proof of payment.",
                ],
              },
            ],
          },
          {
            kind: "details",
            summary: "Basic living costs",
            blocks: [
              {
                kind: "list",
                items: [
                  "Photographs of the damage.",
                  "Anything else that helps, such as a tenancy agreement or rent receipt.",
                ],
              },
            ],
          },
          {
            kind: "details",
            summary: "Tools and stock for your work",
            blocks: [{ kind: "list", items: ["Photographs of the damage."] }],
          },
          {
            kind: "details",
            summary: "Medical treatment or injury",
            blocks: [
              {
                kind: "list",
                items: [
                  "A medical certificate saying you were injured in the flood.",
                  "Your medical receipts.",
                ],
              },
            ],
          },
          {
            kind: "details",
            summary: "Funerals",
            blocks: [
              {
                kind: "list",
                items: [
                  "The fact-finding form, filled in by the heir.",
                  "Copies of the ID cards of the person who died and the heir.",
                  "Copies of the house registrations of the person who died and the heir.",
                  "The death certificate.",
                  "The autopsy certificate.",
                ],
              },
            ],
          },
          { kind: "heading", text: "If you are missing documents" },
          {
            kind: "paragraph",
            text: "If you are missing documents, have no land title deed, the name on the deed is not yours, or your home has no house number, go to your district office. Staff can record a statement from you instead (form Por Kor 14).",
          },
          {
            kind: "links",
            links: [
              {
                label: "Download the fact-finding form (PDF, in Thai)",
                href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
              },
            ],
          },
        ],
      },
      {
        slug: "claim-online",
        title: "Claim BMA compensation online",
        blocks: [
          {
            kind: "warning",
            text: "You must claim within 30 days of the flood.",
          },
          { kind: "heading", text: "Before you start" },
          {
            kind: "list",
            items: [
              "Verify your identity in the ThaiD or Tang Rat app.",
              "Have photographs of the damage and your documents ready as files or photos on your phone.",
            ],
          },
          { kind: "heading", text: "Claim" },
          {
            kind: "steps",
            items: [
              "Go to claim.bangkok.go.th and choose to check your eligibility.",
              "Answer the questions about your home, the damage and any injuries.",
              "If the result says you may qualify, agree and continue.",
              "Upload your documents, then fill in and sign the form online. You do not need to print anything.",
            ],
          },
          {
            kind: "paragraph",
            text: "The eligibility result is not a decision. District staff check every claim.",
          },
          { kind: "start", label: "Claim online", href: "https://claim.bangkok.go.th/" },
          {
            kind: "paragraph",
            text: "Claims for repairs made by the owner or the head of the household are checked faster.",
          },
        ],
      },
      {
        slug: "district-office",
        title: "Apply at your district office",
        blocks: [
          {
            kind: "paragraph",
            text: "At the district office you can apply for the government payment and BMA compensation at the same time. Go to the office for the district where your flooded home is, Monday to Friday during office hours.",
          },
          {
            kind: "steps",
            items: [
              "Download the fact-finding form, or pick one up at the district office.",
              "Fill it in.",
              "Take it with paper copies of your documents and your ID card to the district office.",
            ],
          },
          {
            kind: "paragraph",
            text: "Staff can help you fill in the forms and enter your details for the government payment.",
          },
          {
            kind: "paragraph",
            text: "If you do not know which district office to go to, call the BMA on 1555.",
          },
          {
            kind: "links",
            links: [
              {
                label: "Download the fact-finding form (PDF, in Thai)",
                href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
              },
            ],
          },
        ],
      },
      {
        slug: "after-you-apply",
        title: "After you apply",
        blocks: [
          { kind: "heading", text: "Government payment" },
          {
            kind: "list",
            items: [
              "You can follow your application in the Tang Rat app.",
              "If it is approved, the Government Savings Bank pays the money to the PromptPay account linked to your ID card number.",
              "No payment date has been announced.",
            ],
          },
          { kind: "heading", text: "BMA compensation" },
          {
            kind: "list",
            items: [
              "District staff may send you an SMS if they need anything more, and may visit to check the damage.",
              "The BMA pays to the PromptPay account linked to your ID card number, or to a bank account. Banks other than Krungthai may charge a fee.",
              "The BMA says payment takes at least 60 days. It has not set a date, because about 270,000 to 300,000 households were affected.",
            ],
          },
          {
            kind: "inset",
            text: "You may get less than the most shown, because the BMA pays for the damage it finds.",
          },
        ],
      },
      {
        slug: "if-you-rent",
        title: "If you rent",
        blocks: [
          {
            kind: "list",
            items: [
              "You can get the government's 9,000 baht. It is paid to you, not to your landlord.",
              "You cannot claim BMA money for repairs to a rented home. Repairs to the building are normally your landlord's responsibility.",
              "You can claim the BMA's other help, such as temporary accommodation, basic living costs and tools for your work, even if your name is not on the house registration.",
              "Keep your tenancy agreement and rent receipts. You need them as proof that you live there.",
            ],
          },
          {
            kind: "inset",
            text: "Photograph your landlord's furniture and fittings, and get their agreement in writing before you throw any of it away.",
          },
        ],
      },
      {
        slug: "if-you-are-not-thai",
        title: "If you are not Thai",
        blocks: [
          {
            kind: "paragraph",
            text: "Neither scheme says whether people who are not Thai can claim. Both check applicants against Thai records and pay through PromptPay linked to a Thai ID card number, and the online systems need ThaiD or Tang Rat.",
          },
          {
            kind: "steps",
            items: [
              "Take your passport, your tenancy agreement or other proof of where you live, and photographs of the damage to your district office.",
              "Ask what you can claim.",
            ],
          },
          {
            kind: "list",
            items: [
              "If you have insurance through your embassy, your scholarship or your own policy, contact the insurer before you clean up.",
              "Ask a Thai friend or BIRSA to help you with forms in Thai.",
            ],
          },
        ],
      },
      {
        slug: "get-help",
        title: "Get help with a claim",
        blocks: [
          {
            kind: "list",
            items: [
              "Call the BMA on 1555, 24 hours, for help with BMA compensation or to find your district office.",
              "Call DDPM on 1784, or message @1784DDPM on LINE, for help with the government payment.",
              "Ask your district office, Monday to Friday during office hours.",
              "If you are a BIR student, BIRSA can help you understand the forms.",
            ],
          },
          {
            kind: "links",
            links: [
              { label: "Contact BIRSA", href: "/contact" },
              { label: "Back to the flood guide", href: "/emergency/flooding" },
            ],
          },
        ],
      },
    ],
  },
  th: {
    title: "ขอรับเงินช่วยเหลือหลังน้ำท่วมกรุงเทพฯ",
    summary:
      "ผู้ที่บ้านถูกน้ำท่วมขอรับเงินช่วยเหลือได้จาก 2 แหล่งที่แยกจากกัน ดูว่าใครได้อะไร ต้องใช้เอกสารอะไร และยื่นอย่างไร",
    parts: [
      {
        slug: "overview",
        title: "ภาพรวม",
        blocks: [
          {
            kind: "paragraph",
            text: "หากที่อยู่อาศัยประจำของคุณถูกน้ำท่วม คุณอาจขอรับเงินช่วยเหลือได้จาก 2 แหล่งที่แยกจากกัน",
          },
          {
            kind: "table",
            caption: "เงินช่วยเหลือ 2 แหล่ง",
            rows: [
              ["แหล่งเงิน", "สิ่งที่ได้รับ", "ช่องทางยื่น"],
              [
                "เงินช่วยเหลือจากรัฐบาล ผ่าน ปภ.",
                "ครัวเรือนละ 9,000 บาท ครั้งเดียว",
                "แอปทางรัฐหรือสำนักงานเขต",
              ],
              [
                "เงินช่วยเหลือของ กทม.",
                "ค่าซ่อมแซม ค่าเช่า ค่าดำรงชีพ ค่าเครื่องมือประกอบอาชีพ ค่ารักษาพยาบาล และค่าจัดการศพ ตามความเสียหาย",
                "claim.bangkok.go.th หรือสำนักงานเขต",
              ],
            ],
          },
          {
            kind: "warning",
            text: "การยื่นทางหนึ่งไม่ถือว่ายื่นอีกทางหนึ่งด้วย หากเข้าเกณฑ์ทั้งสองแหล่ง ต้องยื่นทั้งสองทาง",
          },
          {
            kind: "list",
            items: [
              "ต้องยื่นขอเงินช่วยเหลือของ กทม. ภายใน 30 วันนับแต่วันที่ประสบภัย ส่วนเงินของรัฐบาลยังไม่มีการประกาศวันปิดรับ",
              "ทั้งสองทางไม่ต้องใช้ใบแจ้งความหรือบันทึกประจำวัน",
              "ระบบประกันภัยพิบัติแห่งชาติที่เริ่มวันที่ 1 ตุลาคม 2569 ไม่ครอบคลุมน้ำท่วมครั้งนี้",
            ],
          },
          {
            kind: "inset",
            text: "ถ่ายภาพหรือวิดีโอความเสียหายไว้ก่อนทำความสะอาดหรือทิ้งของ เพราะต้องใช้เป็นหลักฐาน",
          },
          { kind: "heading", text: "ตรวจสอบว่าขอรับอะไรได้บ้าง" },
          {
            kind: "paragraph",
            text: "ตอบคำถามไม่เกิน 6 ข้อ เพื่อดูว่าคุณอาจขอรับเงินช่วยเหลือประเภทใดได้บ้าง ใช้เวลาราว 2 นาที",
          },
          { kind: "start", label: "เริ่มเลย", href: CHECK },
        ],
      },
      {
        slug: "who-can-get-9000-baht",
        title: "ใครได้รับเงิน 9,000 บาท",
        blocks: [
          {
            kind: "paragraph",
            text: "กรมป้องกันและบรรเทาสาธารณภัย (ปภ.) จ่ายเงินครัวเรือนละ 9,000 บาท ครั้งเดียว ให้ครัวเรือนที่ที่อยู่อาศัยประจำอยู่ในพื้นที่ที่ประกาศเป็นเขตประสบภัย และได้รับผลกระทบจากน้ำท่วมระหว่างวันที่ 15 พฤษภาคม ถึงวันที่ 30 กันยายน 2569",
          },
          {
            kind: "paragraph",
            text: "มีสิทธิได้รับเงินหากในช่วงเวลานั้น บ้านของคุณเข้ากรณีใดกรณีหนึ่งต่อไปนี้",
          },
          {
            kind: "list",
            items: [
              "ถูกน้ำท่วมขังติดต่อกันเกิน 7 วัน",
              "ถูกน้ำท่วมไม่เกิน 7 วัน และทรัพย์สินได้รับความเสียหาย",
              "ถูกน้ำล้อมจนใช้ชีวิตตามปกติไม่ได้เกิน 7 วัน",
              "อยู่อาคารสูงที่น้ำท่วมไม่ถึงห้อง แต่ใช้ชีวิตตามปกติไม่ได้เกิน 7 วัน",
            ],
          },
          { kind: "heading", text: "พื้นที่ในกรุงเทพฯ" },
          {
            kind: "paragraph",
            text: "ปภ. ประกาศเขตการให้ความช่วยเหลือในกรุงเทพฯ 38 เขต 118 แขวง ไม่รวมเขตพระนครซึ่งเป็นที่ตั้งของท่าพระจันทร์",
          },
          {
            kind: "paragraph",
            text: "หากไม่แน่ใจว่าแขวงของคุณอยู่ในเขตช่วยเหลือหรือไม่ ให้สอบถามสำนักงานเขต",
          },
          { kind: "heading", text: "กรณีเช่าบ้าน" },
          {
            kind: "paragraph",
            text: "ผู้เช่าเป็นผู้รับเงิน ไม่ใช่เจ้าของบ้าน และบ้านที่ไม่มีทะเบียนบ้านก็มีสิทธิได้",
          },
          {
            kind: "links",
            links: [{ label: "ตรวจสอบว่าขอรับอะไรได้บ้าง", href: CHECK }],
          },
        ],
      },
      {
        slug: "apply-for-9000-baht",
        title: "วิธียื่นขอเงิน 9,000 บาท",
        blocks: [
          {
            kind: "paragraph",
            text: "เปิดลงทะเบียนตั้งแต่เวลา 08.00 น. วันที่ 2 ตุลาคม 2569 ยังไม่มีการประกาศวันปิดรับ ควรยื่นโดยเร็วที่สุด",
          },
          { kind: "heading", text: "ก่อนเริ่ม" },
          {
            kind: "paragraph",
            text: "ผูกพร้อมเพย์กับเลขบัตรประชาชนไว้กับธนาคาร หากยังไม่ได้ผูก เพราะเงินจะโอนเข้าทางนี้",
          },
          { kind: "heading", text: "ยื่นผ่านแอปทางรัฐ" },
          {
            kind: "steps",
            items: [
              "เปิดแอปทางรัฐแล้วเข้าสู่ระบบ",
              "แตะ บริการทั้งหมด แล้วเลือกหมวด ลงทะเบียนตรวจสอบสิทธิ",
              "เลือก ยื่นขอรับเงินเยียวยาผู้ประสบภัย แล้วอนุญาตการเข้าถึงข้อมูลและยอมรับเงื่อนไข",
              "แตะ ลงทะเบียนขอรับความช่วยเหลือ กรอกข้อมูล ตรวจสอบความถูกต้อง แล้วส่งแบบฟอร์ม",
            ],
          },
          {
            kind: "paragraph",
            text: "ระบบตรวจสอบข้อมูลกับฐานข้อมูลทะเบียนราษฎรได้ทันที",
          },
          { kind: "heading", text: "หากไม่มีสมาร์ตโฟน" },
          {
            kind: "paragraph",
            text: "ไปที่สำนักงานเขต เจ้าหน้าที่จะช่วยกรอกข้อมูลให้ และยื่นขอเงินช่วยเหลือของ กทม. ไปพร้อมกันได้",
          },
        ],
      },
      {
        slug: "who-can-get-bma-compensation",
        title: "ใครขอรับเงินช่วยเหลือของ กทม. ได้",
        blocks: [
          {
            kind: "paragraph",
            text: "ยื่นได้หากที่อยู่อาศัยประจำของคุณในกรุงเทพฯ ได้รับความเสียหายจากน้ำท่วม หรือน้ำท่วมถึงพื้นที่พักอาศัย",
          },
          {
            kind: "list",
            items: [
              "ค่าซ่อมแซมบ้านให้เฉพาะเจ้าของบ้านหรือเจ้าบ้าน ไม่รวมบ้านเช่า",
              "ผู้เช่า รวมถึงผู้เช่าห้องหรือคอนโด ขอรับความช่วยเหลือประเภทอื่นได้ แม้ไม่มีชื่อในทะเบียนบ้าน",
              "บ้านหรืออาคารที่มีหลายชั้น ได้รับเฉพาะชั้นที่น้ำท่วมถึง",
              "หากมีคนในครอบครัวบาดเจ็บหรือเสียชีวิตจากน้ำท่วม ขอรับค่ารักษาพยาบาลหรือค่าจัดการศพได้",
            ],
          },
          {
            kind: "paragraph",
            text: "การช่วยเหลือไม่ได้จ่ายแบบเหมาจ่ายให้ทุกครัวเรือน แต่พิจารณาตามประเภทและความเสียหายจริง และเอกสารหลักฐาน",
          },
          {
            kind: "inset",
            text: "รถยนต์ที่จมน้ำไม่ได้รับการชดเชย หากทำประกันรถยนต์ไว้ ให้ติดต่อตัวแทนประกันภัย",
          },
          {
            kind: "links",
            links: [
              {
                label: "อ่านหลักเกณฑ์ผู้มีสิทธิของ กทม. (อินโฟกราฟิก)",
                href: "/emergency/bma-flood-claims-eligibility-2026-10.jpg",
              },
            ],
          },
        ],
      },
      {
        slug: "what-the-bma-pays",
        title: "กทม. จ่ายเท่าไร",
        blocks: [
          {
            kind: "paragraph",
            text: "จำนวนเงินด้านล่างเป็นอัตราสูงสุด เงินที่ได้รับจริงขึ้นอยู่กับความเสียหาย คุณสมบัติ และเอกสารหลักฐาน จึงอาจต่ำกว่านี้",
          },
          {
            kind: "table",
            caption: "อัตราสูงสุดของเงินช่วยเหลือ กทม.",
            rows: [
              ["ประเภท", "อัตราสูงสุด"],
              ["ค่าซ่อมแซมบ้าน", "88,600 บาทต่อหลัง"],
              ["ค่าที่พักชั่วคราว บ้านเสียหายบางส่วน", "3,000 บาทต่อครอบครัว"],
              [
                "ค่าที่พักชั่วคราว บ้านเสียหายทั้งหลัง",
                "3,000 บาทต่อครอบครัวต่อเดือน ไม่เกิน 2 เดือน",
              ],
              ["ค่าดำรงชีพเบื้องต้น บ้านเสียหายทั้งหลัง", "3,800 บาท"],
              ["ค่าดำรงชีพเบื้องต้น บ้านเสียหายบางส่วน", "1,900 บาท"],
              ["ค่าเครื่องมือประกอบอาชีพและเงินทุน", "13,500 บาทต่อครอบครัว"],
              ["ค่ารักษาพยาบาล ผู้ป่วยนอก", "2,000 บาทต่อราย"],
              ["ค่ารักษาพยาบาล ผู้ป่วยใน", "4,000 บาทต่อราย"],
              ["เงินปลอบขวัญผู้บาดเจ็บ", "เพิ่มอีก 2,300 บาทต่อราย"],
              ["ค่าจัดการศพ", "35,700 บาทต่อราย"],
              [
                "กรณีผู้เสียชีวิตเป็นผู้หารายได้เลี้ยงดูครอบครัว",
                "เงินสงเคราะห์เพิ่มอีก 35,700 บาทต่อราย",
              ],
            ],
          },
          {
            kind: "details",
            summary: "ค่าซ่อมแซมครอบคลุมอะไรบ้าง",
            blocks: [
              {
                kind: "paragraph",
                text: "ช่วยเฉพาะค่าวัสดุซ่อมแซมส่วนที่เป็นโครงสร้างอาคาร ตามแบบฟอร์มของ กทม. และตามความเสียหายจริง ไม่รวมค่าแรงและเฟอร์นิเจอร์",
              },
            ],
          },
          {
            kind: "details",
            summary: "ค่าที่พักชั่วคราวครอบคลุมอะไรบ้าง",
            blocks: [
              {
                kind: "paragraph",
                text: "ค่าเช่าบ้านหรือค่าที่พักที่อื่น สำหรับผู้ที่อยู่ในบ้านนั้นเป็นประจำและต้องย้ายออกเพราะบ้านเสียหายหรือถูกน้ำท่วมขัง ต้องมีสัญญาเช่า และใบเสร็จหรือหลักฐานการโอนเงิน",
              },
            ],
          },
          {
            kind: "details",
            summary: "ค่าเครื่องมือประกอบอาชีพครอบคลุมอะไรบ้าง",
            blocks: [
              {
                kind: "paragraph",
                text: "เครื่องมือที่ใช้ในอาชีพหลักที่เลี้ยงครอบครัว รวมถึงวัตถุดิบ สินค้า และบริการ เท่าที่จ่ายจริง",
              },
            ],
          },
          {
            kind: "paragraph",
            text: "อัตราเงินช่วยเหลืออาจปรับขึ้นลงตามมติคณะรัฐมนตรี",
          },
          {
            kind: "links",
            links: [
              {
                label: "อ่านอัตราของ กทม. ส่วนที่ 1 (อินโฟกราฟิก)",
                href: "/emergency/bma-flood-claims-rates-1-2026-10.jpg",
              },
              {
                label: "อ่านอัตราของ กทม. ส่วนที่ 2 (อินโฟกราฟิก)",
                href: "/emergency/bma-flood-claims-rates-2-2026-10.jpg",
              },
            ],
          },
        ],
      },
      {
        slug: "documents",
        title: "เอกสารที่ต้องใช้ขอเงินช่วยเหลือของ กทม.",
        blocks: [
          { kind: "paragraph", text: "ทุกประเภทต้องใช้เอกสารเหล่านี้" },
          {
            kind: "list",
            items: [
              "แบบสอบข้อเท็จจริงผู้ประสบภัย",
              "สำเนาบัตรประจำตัวประชาชน",
              "สำเนาสมุดบัญชีธนาคาร กรณีไม่รับเงินผ่านพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน",
            ],
          },
          {
            kind: "paragraph",
            text: "และต้องใช้เอกสารเพิ่มเติมตามประเภทที่ขอรับ",
          },
          {
            kind: "details",
            summary: "ค่าซ่อมแซมบ้าน",
            blocks: [
              {
                kind: "list",
                items: [
                  "สำเนาทะเบียนบ้าน",
                  "สำเนาโฉนดที่ดินที่ระบุชื่อเจ้าบ้านหรือเจ้าของบ้าน หรือแบบคำร้องแทนโฉนด",
                  "เอกสารประกอบการขอรับความช่วยเหลือค่าซ่อมแซม",
                  "ภาพถ่ายความเสียหาย",
                ],
              },
            ],
          },
          {
            kind: "details",
            summary: "ค่าที่พักชั่วคราวหรือค่าเช่าบ้าน",
            blocks: [
              {
                kind: "list",
                items: ["ภาพถ่ายความเสียหาย", "สัญญาเช่า", "ใบเสร็จหรือหลักฐานการโอนเงิน"],
              },
            ],
          },
          {
            kind: "details",
            summary: "ค่าดำรงชีพเบื้องต้น",
            blocks: [
              {
                kind: "list",
                items: ["ภาพถ่ายความเสียหาย", "เอกสารอื่น เช่น สัญญาเช่าหรือใบเสร็จค่าเช่า"],
              },
            ],
          },
          {
            kind: "details",
            summary: "ค่าเครื่องมือประกอบอาชีพ",
            blocks: [{ kind: "list", items: ["ภาพถ่ายความเสียหาย"] }],
          },
          {
            kind: "details",
            summary: "ค่ารักษาพยาบาลหรือผู้บาดเจ็บ",
            blocks: [
              {
                kind: "list",
                items: ["ใบรับรองแพทย์ที่ระบุว่าได้รับบาดเจ็บจากอุทกภัย", "ใบเสร็จค่ารักษาพยาบาล"],
              },
            ],
          },
          {
            kind: "details",
            summary: "ค่าจัดการศพ",
            blocks: [
              {
                kind: "list",
                items: [
                  "แบบสอบข้อเท็จจริงที่ทายาทเป็นผู้กรอก",
                  "สำเนาบัตรประชาชนของผู้เสียชีวิตและทายาท",
                  "สำเนาทะเบียนบ้านของผู้เสียชีวิตและทายาท",
                  "ใบมรณบัตร",
                  "ใบชันสูตรศพ",
                ],
              },
            ],
          },
          { kind: "heading", text: "หากเอกสารไม่ครบ" },
          {
            kind: "paragraph",
            text: "หากเอกสารไม่ครบ ไม่มีโฉนด ชื่อหลังโฉนดไม่ตรงกับผู้ยื่น หรือที่อยู่อาศัยไม่มีเลขที่บ้าน ให้ติดต่อสำนักงานเขต เจ้าหน้าที่จะสอบบันทึกถ้อยคำ (ปค.14) แทน",
          },
          {
            kind: "links",
            links: [
              {
                label: "ดาวน์โหลดแบบสอบข้อเท็จจริงผู้ประสบอุทกภัย (PDF)",
                href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
              },
            ],
          },
        ],
      },
      {
        slug: "claim-online",
        title: "ยื่นขอเงินช่วยเหลือของ กทม. ทางออนไลน์",
        blocks: [
          {
            kind: "warning",
            text: "ต้องยื่นภายใน 30 วันนับแต่วันที่ประสบภัย",
          },
          { kind: "heading", text: "ก่อนเริ่ม" },
          {
            kind: "list",
            items: [
              "ยืนยันตัวตนในแอป ThaiD หรือทางรัฐไว้ก่อน",
              "เตรียมภาพถ่ายความเสียหายและเอกสารเป็นไฟล์หรือรูปในโทรศัพท์",
            ],
          },
          { kind: "heading", text: "ขั้นตอนการยื่น" },
          {
            kind: "steps",
            items: [
              "เข้า claim.bangkok.go.th แล้วเลือกตรวจสอบสิทธิ",
              "ตอบคำถามเรื่องที่พัก ความเสียหาย และการบาดเจ็บ",
              "หากระบบแสดงว่าอาจมีสิทธิ ให้กดยอมรับแล้วดำเนินการต่อ",
              "อัปโหลดเอกสาร แล้วกรอกและเซ็นเอกสารออนไลน์ ไม่ต้องปรินต์",
            ],
          },
          {
            kind: "paragraph",
            text: "ผลการตรวจสอบสิทธิในระบบยังไม่ใช่คำตัดสิน เจ้าหน้าที่เขตจะตรวจสอบทุกคำร้อง",
          },
          { kind: "start", label: "ยื่นออนไลน์", href: "https://claim.bangkok.go.th/" },
          {
            kind: "paragraph",
            text: "ค่าซ่อมแซมที่เจ้าบ้านหรือเจ้าของบ้านเป็นผู้ยื่น จะได้รับการตรวจสอบสิทธิและเยียวยาได้เร็ว",
          },
        ],
      },
      {
        slug: "district-office",
        title: "ยื่นที่สำนักงานเขต",
        blocks: [
          {
            kind: "paragraph",
            text: "ที่สำนักงานเขตยื่นขอเงินของรัฐบาลและเงินช่วยเหลือของ กทม. ได้พร้อมกัน ให้ไปที่สำนักงานเขตตามที่ตั้งของบ้านที่ถูกน้ำท่วม ในวันจันทร์ถึงศุกร์ เวลาราชการ",
          },
          {
            kind: "steps",
            items: [
              "ดาวน์โหลดแบบสอบข้อเท็จจริง หรือรับได้ที่สำนักงานเขต",
              "กรอกแบบฟอร์ม",
              "นำแบบฟอร์ม สำเนาเอกสาร และบัตรประชาชนไปยื่นที่สำนักงานเขต",
            ],
          },
          {
            kind: "paragraph",
            text: "เจ้าหน้าที่ช่วยกรอกแบบฟอร์มและบันทึกข้อมูลขอเงินของรัฐบาลให้ได้",
          },
          {
            kind: "paragraph",
            text: "หากไม่ทราบว่าต้องไปสำนักงานเขตใด โทรสายด่วน กทม. 1555",
          },
          {
            kind: "links",
            links: [
              {
                label: "ดาวน์โหลดแบบสอบข้อเท็จจริงผู้ประสบอุทกภัย (PDF)",
                href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
              },
            ],
          },
        ],
      },
      {
        slug: "after-you-apply",
        title: "หลังยื่นคำร้อง",
        blocks: [
          { kind: "heading", text: "เงินช่วยเหลือจากรัฐบาล" },
          {
            kind: "list",
            items: [
              "ติดตามสถานะได้ในแอปทางรัฐ",
              "หากผ่านการตรวจสอบ ธนาคารออมสินจะโอนเงินเข้าพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน",
              "ยังไม่มีการประกาศวันจ่ายเงิน",
            ],
          },
          { kind: "heading", text: "เงินช่วยเหลือของ กทม." },
          {
            kind: "list",
            items: [
              "หากต้องการข้อมูลเพิ่ม เจ้าหน้าที่เขตจะติดต่อทาง SMS และอาจลงพื้นที่ตรวจสอบความเสียหาย",
              "กทม. โอนเงินเข้าพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน หรือเข้าบัญชีธนาคาร ซึ่งอาจมีค่าธรรมเนียมหากไม่ใช่ธนาคารกรุงไทย",
              "กทม. ระบุว่าใช้เวลาดำเนินการจ่ายไม่ต่ำกว่า 60 วัน และยังกำหนดวันจ่ายที่แน่นอนไม่ได้ เพราะมีผู้ได้รับผลกระทบราว 270,000 ถึง 300,000 ครัวเรือน",
            ],
          },
          {
            kind: "inset",
            text: "เงินที่ได้รับจริงอาจต่ำกว่าอัตราสูงสุด เพราะ กทม. จ่ายตามความเสียหายที่ตรวจพบ",
          },
        ],
      },
      {
        slug: "if-you-rent",
        title: "กรณีเช่าที่พัก",
        blocks: [
          {
            kind: "list",
            items: [
              "ผู้เช่าขอรับเงิน 9,000 บาทของรัฐบาลได้ โดยผู้เช่าเป็นผู้รับเงิน ไม่ใช่เจ้าของบ้าน",
              "ผู้เช่าขอค่าซ่อมแซมบ้านจาก กทม. ไม่ได้ การซ่อมแซมตัวอาคารโดยปกติเป็นหน้าที่ของผู้ให้เช่า",
              "ผู้เช่าขอรับความช่วยเหลืออื่นของ กทม. ได้ เช่น ค่าที่พักชั่วคราว ค่าดำรงชีพเบื้องต้น และค่าเครื่องมือประกอบอาชีพ แม้ไม่มีชื่อในทะเบียนบ้าน",
              "เก็บสัญญาเช่าและใบเสร็จค่าเช่าไว้ เพราะต้องใช้เป็นหลักฐานว่าอาศัยอยู่ที่นั่น",
            ],
          },
          {
            kind: "inset",
            text: "ถ่ายภาพเฟอร์นิเจอร์และอุปกรณ์ของผู้ให้เช่า และขอความยินยอมเป็นลายลักษณ์อักษรก่อนทิ้ง",
          },
        ],
      },
      {
        slug: "if-you-are-not-thai",
        title: "สำหรับผู้ที่ไม่มีสัญชาติไทย",
        blocks: [
          {
            kind: "paragraph",
            text: "ทั้งสองโครงการไม่ได้ระบุว่าผู้ที่ไม่มีสัญชาติไทยยื่นได้หรือไม่ ทั้งคู่ตรวจสอบผู้ยื่นกับฐานข้อมูลทะเบียนราษฎร จ่ายเงินผ่านพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน และระบบออนไลน์ต้องใช้ ThaiD หรือทางรัฐ",
          },
          {
            kind: "steps",
            items: [
              "นำหนังสือเดินทาง สัญญาเช่าหรือหลักฐานที่อยู่อื่น และภาพถ่ายความเสียหายไปที่สำนักงานเขต",
              "สอบถามว่ามีสิทธิขอรับอะไรได้บ้าง",
            ],
          },
          {
            kind: "list",
            items: [
              "หากมีประกันจากสถานทูต ทุนการศึกษา หรือที่ทำเอง ให้ติดต่อบริษัทประกันก่อนทำความสะอาด",
              "ขอให้เพื่อนคนไทยหรือ BIRSA ช่วยกรอกแบบฟอร์มภาษาไทย",
            ],
          },
        ],
      },
      {
        slug: "get-help",
        title: "ขอความช่วยเหลือเรื่องการยื่นคำร้อง",
        blocks: [
          {
            kind: "list",
            items: [
              "โทรสายด่วน กทม. 1555 ตลอด 24 ชั่วโมง สอบถามเรื่องเงินช่วยเหลือของ กทม. หรือสำนักงานเขตที่ต้องไป",
              "โทร ปภ. 1784 หรือ LINE @1784DDPM สอบถามเรื่องเงินช่วยเหลือจากรัฐบาล",
              "สอบถามสำนักงานเขต ในวันจันทร์ถึงศุกร์ เวลาราชการ",
              "นักศึกษา BIR ขอให้ BIRSA ช่วยอธิบายแบบฟอร์มได้",
            ],
          },
          {
            kind: "links",
            links: [
              { label: "ติดต่อ BIRSA", href: "/contact" },
              { label: "กลับไปหน้าคำแนะนำเรื่องน้ำท่วม", href: "/emergency/flooding" },
            ],
          },
        ],
      },
    ],
  },
};

export default floodingClaims;
