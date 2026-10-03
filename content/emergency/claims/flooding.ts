import type { EmergencyGuide } from "@/content/emergency/types";

/**
 * How to claim money after the Bangkok floods of September 2026, one thing per
 * page. BIRSA adds no checker of its own: the BMA's site at claim.bangkok.go.th
 * checks eligibility. This guide only brings together what DDPM, the BMA's
 * infographics (in `public/emergency/bma-flood-claims-*`) and the reports below
 * say, and sends readers to the official services to apply.
 */
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
      "What the BMA, DDPM and the news have published about the 2 schemes for people whose homes were flooded, in one place. Apply through the official services.",
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
            kind: "warning",
            text: "Applying to one does not apply you to the other. If you qualify for both, you must apply to both.",
          },
          {
            kind: "card",
            title: "Government payment",
            rows: [
              ["Paid by", "DDPM, under a Cabinet decision"],
              ["For", "Basic living costs"],
              ["How much", "9,000 baht per household, once"],
              [
                "Who can get it",
                "Households whose usual home in a declared disaster area was flooded between 15 May and 30 September 2026",
              ],
              ["Apply", "In the Tang Rat app, or at your district office"],
              ["Closing date", "None announced"],
              ["Paid into", "PromptPay linked to your ID card number"],
            ],
          },
          {
            kind: "card",
            title: "BMA compensation",
            rows: [
              ["Paid by", "Bangkok Metropolitan Administration"],
              [
                "For",
                "Repairs, temporary accommodation, basic living costs, tools for work, medical treatment and funerals",
              ],
              ["How much", "Based on your damage, up to 88,600 baht for repairs"],
              [
                "Who can get it",
                "People whose usual home in Bangkok was damaged, or flooded into the rooms they live in",
              ],
              ["Apply", "At claim.bangkok.go.th, or at your district office"],
              ["Closing date", "30 days after the flood"],
              ["Paid into", "PromptPay linked to your ID card number, or a bank account"],
              ["How long it takes", "At least 60 days"],
            ],
          },
          {
            kind: "list",
            items: [
              "You do not need a police report for either scheme.",
              "The national disaster insurance that started on 1 October 2026 does not cover these floods.",
            ],
          },
          {
            kind: "inset",
            text: "Photograph or film the damage before you clean up or throw anything away. You need the pictures to claim.",
          },
          {
            kind: "paragraph",
            text: "The BMA's site checks whether you qualify before you claim.",
          },
          { kind: "start", label: "Claim BMA compensation", href: "https://claim.bangkok.go.th/" },
        ],
      },
      {
        slug: "who-can-get-9000-baht",
        title: "Who can get the 9,000 baht",
        blocks: [
          {
            kind: "paragraph",
            text: "DDPM pays 9,000 baht once to each household whose usual home is in a declared disaster area and was affected by flooding between 15 May and 30 September 2026.",
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
            text: "DDPM named 118 subdistricts in 38 Bangkok districts as the area where help can be given. Phra Nakhon, where Tha Prachan is, is not one of them. If you are not sure your subdistrict is included, ask your district office.",
          },
          { kind: "heading", text: "If you rent" },
          {
            kind: "paragraph",
            text: "The money is paid to you as the tenant, not to your landlord. Homes without a house registration can also qualify.",
          },
        ],
      },
      {
        slug: "who-can-get-bma-compensation",
        title: "Who can get BMA compensation",
        blocks: [
          {
            kind: "paragraph",
            text: "You can claim if all of these are true.",
          },
          {
            kind: "list",
            items: [
              "The home is the place you usually live.",
              "It was damaged by the floods, or water came into the rooms you live in.",
              "It is in a district where the BMA declared emergency flood help.",
            ],
          },
          {
            kind: "paragraph",
            text: "The district office gives you a certificate that you were affected, which is your proof.",
          },
          { kind: "heading", text: "Which homes count" },
          {
            kind: "list",
            items: [
              "Rented homes, including rooms and condos, even if you are not on the house registration. Repairs to rented homes are not covered, but the other kinds of help are.",
              "In a building with several floors, only the floors that flooded.",
              "A home you usually live in that has no house registration. The district office records a statement from you instead (form Por Kor 14).",
            ],
          },
          {
            kind: "paragraph",
            text: "Only the owner or the head of the household can claim for repairs.",
          },
          {
            kind: "links",
            links: [
              {
                label: "See the BMA's rules on who can claim (image, in Thai)",
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
            text: "These are the most you can get. The BMA does not pay the same to everyone. It pays for the damage it finds, so you may get less.",
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
                text: "Only repair materials for the structure of the building, listed on the BMA's form, at what the damage really costs. Rented homes are not covered.",
              },
            ],
          },
          {
            kind: "details",
            summary: "What temporary accommodation covers",
            blocks: [
              {
                kind: "paragraph",
                text: "Rent or somewhere else to stay, if you usually lived in the home and had to move out because it was damaged or flooded.",
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
                label: "See the BMA's rates, part 1 (image, in Thai)",
                href: "/emergency/bma-flood-claims-rates-1-2026-10.jpg",
              },
              {
                label: "See the BMA's rates, part 2 (image, in Thai)",
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
            text: "Open each kind of help you are claiming to see what else you need.",
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
        slug: "apply-for-9000-baht",
        title: "Apply for the 9,000 baht",
        blocks: [
          {
            kind: "paragraph",
            text: "Registration opened at 08:00 on 2 October 2026. No closing date has been announced, so apply as soon as you can.",
          },
          {
            kind: "inset",
            text: "Link PromptPay to your ID card number with your bank first, if it is not linked already. The money is paid this way.",
          },
          { kind: "heading", text: "In the Tang Rat app" },
          {
            kind: "steps",
            items: [
              "Log in.",
              "Tap All services (บริการทั้งหมด), then Register to check eligibility (ลงทะเบียนตรวจสอบสิทธิ).",
              "Choose Apply for disaster relief payment (ยื่นขอรับเงินเยียวยาผู้ประสบภัย), give permission and accept the terms.",
              "Tap Register for help (ลงทะเบียนขอรับความช่วยเหลือ), fill in your details, check them and send the form.",
            ],
          },
          { kind: "heading", text: "At your district office" },
          {
            kind: "paragraph",
            text: "If you do not have a smartphone, staff will enter your details for you. You can claim BMA compensation at the same time.",
          },
        ],
      },
      {
        slug: "claim-from-the-bma",
        title: "Claim BMA compensation",
        blocks: [
          { kind: "warning", text: "You must claim within 30 days of the flood." },
          {
            kind: "card",
            title: "Online",
            rows: [
              ["Where", "claim.bangkok.go.th"],
              ["When", "Any time"],
              [
                "You need",
                "Your identity verified in the ThaiD or Tang Rat app, and photos of your documents and the damage",
              ],
              ["Forms", "Filled in and signed online, so there is nothing to print"],
            ],
          },
          {
            kind: "card",
            title: "At your district office",
            rows: [
              ["Where", "The office for the district where your flooded home is"],
              ["When", "Monday to Friday, during office hours"],
              ["You need", "The fact-finding form and paper copies of your documents"],
              ["Also", "You can apply for the 9,000 baht at the same time"],
            ],
          },
          {
            kind: "paragraph",
            text: "Online, the site checks whether you qualify before you start. Its result is not a decision. District staff check every claim.",
          },
          { kind: "start", label: "Claim online", href: "https://claim.bangkok.go.th/" },
          {
            kind: "paragraph",
            text: "Claims for repairs made by the owner or the head of the household are checked faster. If you do not know which district office to go to, call 1555.",
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
          {
            kind: "card",
            title: "Government payment",
            rows: [
              ["Follow it", "In the Tang Rat app"],
              ["Paid by", "The Government Savings Bank"],
              ["Paid into", "PromptPay linked to your ID card number"],
              ["When", "No date announced"],
            ],
          },
          {
            kind: "card",
            title: "BMA compensation",
            rows: [
              [
                "What happens",
                "District staff may send you an SMS if they need anything more, and may visit to check the damage",
              ],
              [
                "Paid into",
                "PromptPay linked to your ID card number, or a bank account. Banks other than Krungthai may charge a fee",
              ],
              [
                "When",
                "At least 60 days. No date is set, because about 270,000 to 300,000 households were affected",
              ],
            ],
          },
        ],
      },
      {
        slug: "common-questions",
        title: "Common questions",
        blocks: [
          {
            kind: "details",
            summary: "Do I need a police report?",
            blocks: [{ kind: "paragraph", text: "No. Neither scheme needs one." }],
          },
          {
            kind: "details",
            summary: "Can I claim for a flooded car?",
            blocks: [
              {
                kind: "paragraph",
                text: "No. If your car is insured, contact your insurer.",
              },
            ],
          },
          {
            kind: "details",
            summary:
              "I rent a room or a condo and I am not on the house registration. Can I claim?",
            blocks: [
              {
                kind: "paragraph",
                text: "Yes. You can get the 9,000 baht, paid to you rather than your landlord, and the BMA's help other than repairs. Keep your tenancy agreement and rent receipts as proof that you live there.",
              },
            ],
          },
          {
            kind: "details",
            summary: "Who pays for repairs to a rented home?",
            blocks: [
              {
                kind: "paragraph",
                text: "Normally your landlord. Photograph your landlord's furniture and fittings, and get their agreement in writing before you throw any of it away.",
              },
            ],
          },
          {
            kind: "details",
            summary: "I am not Thai. Can I claim?",
            blocks: [
              {
                kind: "paragraph",
                text: "Neither scheme says. Both check applicants against Thai records and pay through PromptPay linked to a Thai ID card number, and the online systems need ThaiD or Tang Rat.",
              },
              {
                kind: "paragraph",
                text: "Take your passport, proof of where you live and photographs of the damage to your district office and ask. If you have insurance through your embassy, your scholarship or your own policy, contact the insurer.",
              },
            ],
          },
          {
            kind: "details",
            summary: "I am missing documents. What do I do?",
            blocks: [
              {
                kind: "paragraph",
                text: "If you are missing documents, have no land title deed, the name on the deed is not yours, or your home has no house number, go to your district office. Staff can record a statement from you instead (form Por Kor 14).",
              },
            ],
          },
          {
            kind: "details",
            summary: "Will I get the full amount?",
            blocks: [
              {
                kind: "paragraph",
                text: "Not necessarily. The BMA does not pay a flat rate. It looks at the kind of damage, how bad it is, whether you qualify and your documents, and staff may check the facts.",
              },
            ],
          },
          { kind: "heading", text: "Get help" },
          {
            kind: "list",
            items: [
              "BMA hotline 1555, 24 hours, for BMA compensation or to find your district office.",
              "DDPM on 1784, or @1784DDPM on LINE, for the government payment.",
              "Your district office, Monday to Friday during office hours.",
              "BIRSA, if you are a BIR student and need help understanding the forms.",
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
      "รวมข้อมูลที่ กทม. ปภ. และสื่อเผยแพร่เรื่องเงินช่วยเหลือ 2 แหล่งสำหรับผู้ที่บ้านถูกน้ำท่วมไว้ในที่เดียว ยื่นคำร้องผ่านช่องทางทางการ",
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
            kind: "warning",
            text: "การยื่นทางหนึ่งไม่ถือว่ายื่นอีกทางหนึ่งด้วย หากเข้าเกณฑ์ทั้งสองแหล่ง ต้องยื่นทั้งสองทาง",
          },
          {
            kind: "card",
            title: "เงินช่วยเหลือจากรัฐบาล",
            rows: [
              ["ผู้จ่าย", "ปภ. ตามมติคณะรัฐมนตรี"],
              ["สำหรับ", "ค่าดำรงชีพเบื้องต้น"],
              ["จำนวน", "ครัวเรือนละ 9,000 บาท ครั้งเดียว"],
              [
                "ผู้มีสิทธิ",
                "ครัวเรือนที่ที่อยู่อาศัยประจำในพื้นที่ประกาศเขตประสบภัยถูกน้ำท่วมระหว่างวันที่ 15 พฤษภาคม ถึงวันที่ 30 กันยายน 2569",
              ],
              ["ช่องทางยื่น", "แอปทางรัฐ หรือสำนักงานเขต"],
              ["วันปิดรับ", "ยังไม่ประกาศ"],
              ["รับเงินทาง", "พร้อมเพย์ที่ผูกกับเลขบัตรประชาชน"],
            ],
          },
          {
            kind: "card",
            title: "เงินช่วยเหลือของ กทม.",
            rows: [
              ["ผู้จ่าย", "กรุงเทพมหานคร"],
              [
                "สำหรับ",
                "ค่าซ่อมแซมบ้าน ค่าที่พักชั่วคราว ค่าดำรงชีพเบื้องต้น ค่าเครื่องมือประกอบอาชีพ ค่ารักษาพยาบาล และค่าจัดการศพ",
              ],
              ["จำนวน", "ตามความเสียหาย ค่าซ่อมแซมบ้านไม่เกิน 88,600 บาท"],
              [
                "ผู้มีสิทธิ",
                "ผู้ที่ที่อยู่อาศัยประจำในกรุงเทพฯ ได้รับความเสียหาย หรือน้ำท่วมถึงพื้นที่พักอาศัย",
              ],
              ["ช่องทางยื่น", "claim.bangkok.go.th หรือสำนักงานเขต"],
              ["วันปิดรับ", "ภายใน 30 วันนับแต่วันที่ประสบภัย"],
              ["รับเงินทาง", "พร้อมเพย์ที่ผูกกับเลขบัตรประชาชน หรือบัญชีธนาคาร"],
              ["ระยะเวลา", "ไม่ต่ำกว่า 60 วัน"],
            ],
          },
          {
            kind: "list",
            items: [
              "ทั้งสองทางไม่ต้องใช้ใบแจ้งความหรือบันทึกประจำวัน",
              "ระบบประกันภัยพิบัติแห่งชาติที่เริ่มวันที่ 1 ตุลาคม 2569 ไม่ครอบคลุมน้ำท่วมครั้งนี้",
            ],
          },
          {
            kind: "inset",
            text: "ถ่ายภาพหรือวิดีโอความเสียหายไว้ก่อนทำความสะอาดหรือทิ้งของ เพราะต้องใช้เป็นหลักฐาน",
          },
          {
            kind: "paragraph",
            text: "เว็บไซต์ของ กทม. ตรวจสอบสิทธิให้ก่อนยื่นคำร้อง",
          },
          {
            kind: "start",
            label: "ยื่นขอเงินช่วยเหลือของ กทม.",
            href: "https://claim.bangkok.go.th/",
          },
        ],
      },
      {
        slug: "who-can-get-9000-baht",
        title: "ใครได้รับเงิน 9,000 บาท",
        blocks: [
          {
            kind: "paragraph",
            text: "ปภ. จ่ายเงินครัวเรือนละ 9,000 บาท ครั้งเดียว ให้ครัวเรือนที่ที่อยู่อาศัยประจำอยู่ในพื้นที่ที่ประกาศเป็นเขตประสบภัย และได้รับผลกระทบจากน้ำท่วมระหว่างวันที่ 15 พฤษภาคม ถึงวันที่ 30 กันยายน 2569",
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
            text: "ปภ. ประกาศเขตการให้ความช่วยเหลือในกรุงเทพฯ 38 เขต 118 แขวง ไม่รวมเขตพระนครซึ่งเป็นที่ตั้งของท่าพระจันทร์ หากไม่แน่ใจว่าแขวงของคุณอยู่ในเขตช่วยเหลือหรือไม่ ให้สอบถามสำนักงานเขต",
          },
          { kind: "heading", text: "กรณีเช่าบ้าน" },
          {
            kind: "paragraph",
            text: "ผู้เช่าเป็นผู้รับเงิน ไม่ใช่เจ้าของบ้าน และบ้านที่ไม่มีทะเบียนบ้านก็มีสิทธิได้",
          },
        ],
      },
      {
        slug: "who-can-get-bma-compensation",
        title: "ใครขอรับเงินช่วยเหลือของ กทม. ได้",
        blocks: [
          {
            kind: "paragraph",
            text: "ยื่นได้หากเข้าเงื่อนไขทุกข้อต่อไปนี้",
          },
          {
            kind: "list",
            items: [
              "เป็นที่อยู่อาศัยประจำ",
              "ได้รับความเสียหายจากน้ำท่วม หรือน้ำท่วมถึงพื้นที่พักอาศัย",
              "อยู่ในเขตที่ กทม. ประกาศให้ความช่วยเหลือฉุกเฉินกรณีอุทกภัย",
            ],
          },
          {
            kind: "paragraph",
            text: "สำนักงานเขตจะออกหนังสือรับรองผู้ประสบภัยให้เป็นหลักฐาน",
          },
          { kind: "heading", text: "ที่อยู่อาศัยที่มีสิทธิ" },
          {
            kind: "list",
            items: [
              "บ้านเช่า รวมถึงห้องเช่าและคอนโด แม้ไม่มีชื่อในทะเบียนบ้าน ค่าซ่อมแซมไม่รวมบ้านเช่า แต่ขอรับความช่วยเหลือประเภทอื่นได้",
              "บ้านหรืออาคารที่มีหลายชั้น ได้รับเฉพาะชั้นที่น้ำท่วมถึง",
              "ที่อยู่อาศัยประจำที่ไม่มีทะเบียนบ้าน สำนักงานเขตจะสอบบันทึกถ้อยคำ (ปค.14) เพิ่มเติม",
            ],
          },
          {
            kind: "paragraph",
            text: "ค่าซ่อมแซมบ้านให้เฉพาะเจ้าของบ้านหรือเจ้าบ้าน",
          },
          {
            kind: "links",
            links: [
              {
                label: "ดูหลักเกณฑ์ผู้มีสิทธิของ กทม. (อินโฟกราฟิก)",
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
            text: "จำนวนเงินด้านล่างเป็นอัตราสูงสุด การช่วยเหลือไม่ได้จ่ายแบบเหมาจ่ายให้ทุกครัวเรือน แต่จ่ายตามความเสียหายที่ตรวจพบ จึงอาจได้รับต่ำกว่านี้",
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
                text: "ช่วยเฉพาะค่าวัสดุซ่อมแซมส่วนที่เป็นโครงสร้างอาคาร ตามแบบฟอร์มของ กทม. และตามความเสียหายจริง ไม่รวมบ้านเช่า",
              },
            ],
          },
          {
            kind: "details",
            summary: "ค่าที่พักชั่วคราวครอบคลุมอะไรบ้าง",
            blocks: [
              {
                kind: "paragraph",
                text: "ค่าเช่าบ้านหรือค่าที่พักที่อื่น สำหรับผู้ที่อยู่ในบ้านนั้นเป็นประจำและต้องย้ายออกเพราะบ้านเสียหายหรือถูกน้ำท่วมขัง",
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
                label: "ดูอัตราของ กทม. ส่วนที่ 1 (อินโฟกราฟิก)",
                href: "/emergency/bma-flood-claims-rates-1-2026-10.jpg",
              },
              {
                label: "ดูอัตราของ กทม. ส่วนที่ 2 (อินโฟกราฟิก)",
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
            text: "เปิดดูประเภทที่ต้องการขอรับ เพื่อดูเอกสารเพิ่มเติม",
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
        slug: "apply-for-9000-baht",
        title: "ยื่นขอเงิน 9,000 บาท",
        blocks: [
          {
            kind: "paragraph",
            text: "เปิดลงทะเบียนตั้งแต่เวลา 08.00 น. วันที่ 2 ตุลาคม 2569 ยังไม่มีการประกาศวันปิดรับ ควรยื่นโดยเร็วที่สุด",
          },
          {
            kind: "inset",
            text: "ผูกพร้อมเพย์กับเลขบัตรประชาชนไว้กับธนาคารก่อน หากยังไม่ได้ผูก เพราะเงินจะโอนเข้าทางนี้",
          },
          { kind: "heading", text: "ผ่านแอปทางรัฐ" },
          {
            kind: "steps",
            items: [
              "เข้าสู่ระบบ",
              "แตะ บริการทั้งหมด แล้วเลือกหมวด ลงทะเบียนตรวจสอบสิทธิ",
              "เลือก ยื่นขอรับเงินเยียวยาผู้ประสบภัย แล้วอนุญาตการเข้าถึงข้อมูลและยอมรับเงื่อนไข",
              "แตะ ลงทะเบียนขอรับความช่วยเหลือ กรอกข้อมูล ตรวจสอบความถูกต้อง แล้วส่งแบบฟอร์ม",
            ],
          },
          { kind: "heading", text: "ที่สำนักงานเขต" },
          {
            kind: "paragraph",
            text: "หากไม่มีสมาร์ตโฟน เจ้าหน้าที่จะช่วยกรอกข้อมูลให้ และยื่นขอเงินช่วยเหลือของ กทม. ไปพร้อมกันได้",
          },
        ],
      },
      {
        slug: "claim-from-the-bma",
        title: "ยื่นขอเงินช่วยเหลือของ กทม.",
        blocks: [
          { kind: "warning", text: "ต้องยื่นภายใน 30 วันนับแต่วันที่ประสบภัย" },
          {
            kind: "card",
            title: "ยื่นออนไลน์",
            rows: [
              ["ที่ไหน", "claim.bangkok.go.th"],
              ["เมื่อไร", "ได้ตลอด 24 ชั่วโมง"],
              ["ต้องเตรียม", "ยืนยันตัวตนในแอป ThaiD หรือทางรัฐ และรูปเอกสารกับภาพความเสียหาย"],
              ["แบบฟอร์ม", "กรอกและเซ็นออนไลน์ ไม่ต้องปรินต์"],
            ],
          },
          {
            kind: "card",
            title: "ยื่นที่สำนักงานเขต",
            rows: [
              ["ที่ไหน", "สำนักงานเขตตามที่ตั้งของบ้านที่ถูกน้ำท่วม"],
              ["เมื่อไร", "วันจันทร์ถึงศุกร์ เวลาราชการ"],
              ["ต้องเตรียม", "แบบสอบข้อเท็จจริงและสำเนาเอกสารฉบับกระดาษ"],
              ["เพิ่มเติม", "ยื่นขอเงิน 9,000 บาทไปพร้อมกันได้"],
            ],
          },
          {
            kind: "paragraph",
            text: "เว็บไซต์จะตรวจสอบสิทธิก่อนเริ่มยื่น ผลที่ได้ยังไม่ใช่คำตัดสิน เจ้าหน้าที่เขตจะตรวจสอบทุกคำร้อง",
          },
          { kind: "start", label: "ยื่นออนไลน์", href: "https://claim.bangkok.go.th/" },
          {
            kind: "paragraph",
            text: "ค่าซ่อมแซมที่เจ้าบ้านหรือเจ้าของบ้านเป็นผู้ยื่น จะได้รับการตรวจสอบสิทธิและเยียวยาได้เร็ว หากไม่ทราบว่าต้องไปสำนักงานเขตใด โทร 1555",
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
          {
            kind: "card",
            title: "เงินช่วยเหลือจากรัฐบาล",
            rows: [
              ["ติดตามสถานะ", "ในแอปทางรัฐ"],
              ["ผู้โอนเงิน", "ธนาคารออมสิน"],
              ["รับเงินทาง", "พร้อมเพย์ที่ผูกกับเลขบัตรประชาชน"],
              ["เมื่อไร", "ยังไม่ประกาศวันจ่าย"],
            ],
          },
          {
            kind: "card",
            title: "เงินช่วยเหลือของ กทม.",
            rows: [
              [
                "ขั้นตอนถัดไป",
                "หากต้องการข้อมูลเพิ่ม เจ้าหน้าที่เขตจะติดต่อทาง SMS และอาจลงพื้นที่ตรวจสอบความเสียหาย",
              ],
              [
                "รับเงินทาง",
                "พร้อมเพย์ที่ผูกกับเลขบัตรประชาชน หรือบัญชีธนาคาร ซึ่งอาจมีค่าธรรมเนียมหากไม่ใช่ธนาคารกรุงไทย",
              ],
              [
                "เมื่อไร",
                "ไม่ต่ำกว่า 60 วัน ยังกำหนดวันที่แน่นอนไม่ได้ เพราะมีผู้ได้รับผลกระทบราว 270,000 ถึง 300,000 ครัวเรือน",
              ],
            ],
          },
        ],
      },
      {
        slug: "common-questions",
        title: "คำถามที่พบบ่อย",
        blocks: [
          {
            kind: "details",
            summary: "ต้องไปแจ้งความหรือลงบันทึกประจำวันหรือไม่",
            blocks: [{ kind: "paragraph", text: "ไม่ต้อง ทั้งสองโครงการไม่ต้องใช้" }],
          },
          {
            kind: "details",
            summary: "รถจมน้ำได้ชดเชยไหม",
            blocks: [
              {
                kind: "paragraph",
                text: "ไม่ได้ หากทำประกันรถยนต์ไว้ ให้ติดต่อตัวแทนประกันภัย",
              },
            ],
          },
          {
            kind: "details",
            summary: "เช่าห้องหรืออยู่คอนโด ไม่มีชื่อในทะเบียนบ้าน มีสิทธิไหม",
            blocks: [
              {
                kind: "paragraph",
                text: "มีสิทธิ ขอรับเงิน 9,000 บาทได้ โดยผู้เช่าเป็นผู้รับเงิน และขอรับความช่วยเหลือของ กทม. ประเภทอื่นนอกจากค่าซ่อมแซมได้ เก็บสัญญาเช่าและใบเสร็จค่าเช่าไว้เป็นหลักฐานว่าอาศัยอยู่ที่นั่น",
              },
            ],
          },
          {
            kind: "details",
            summary: "ใครรับผิดชอบค่าซ่อมแซมบ้านเช่า",
            blocks: [
              {
                kind: "paragraph",
                text: "โดยปกติเป็นหน้าที่ของผู้ให้เช่า ถ่ายภาพเฟอร์นิเจอร์และอุปกรณ์ของผู้ให้เช่า และขอความยินยอมเป็นลายลักษณ์อักษรก่อนทิ้ง",
              },
            ],
          },
          {
            kind: "details",
            summary: "ไม่มีสัญชาติไทย ยื่นได้ไหม",
            blocks: [
              {
                kind: "paragraph",
                text: "ทั้งสองโครงการไม่ได้ระบุไว้ ทั้งคู่ตรวจสอบผู้ยื่นกับฐานข้อมูลทะเบียนราษฎร จ่ายเงินผ่านพร้อมเพย์ที่ผูกกับเลขบัตรประชาชน และระบบออนไลน์ต้องใช้ ThaiD หรือทางรัฐ",
              },
              {
                kind: "paragraph",
                text: "นำหนังสือเดินทาง หลักฐานที่อยู่ และภาพถ่ายความเสียหายไปสอบถามที่สำนักงานเขต หากมีประกันจากสถานทูต ทุนการศึกษา หรือที่ทำเอง ให้ติดต่อบริษัทประกัน",
              },
            ],
          },
          {
            kind: "details",
            summary: "เอกสารไม่ครบ ต้องทำอย่างไร",
            blocks: [
              {
                kind: "paragraph",
                text: "หากเอกสารไม่ครบ ไม่มีโฉนด ชื่อหลังโฉนดไม่ตรงกับผู้ยื่น หรือที่อยู่อาศัยไม่มีเลขที่บ้าน ให้ติดต่อสำนักงานเขต เจ้าหน้าที่จะสอบบันทึกถ้อยคำ (ปค.14) แทน",
              },
            ],
          },
          {
            kind: "details",
            summary: "จะได้รับเงินเต็มจำนวนไหม",
            blocks: [
              {
                kind: "paragraph",
                text: "ไม่แน่เสมอไป กทม. ไม่ได้จ่ายแบบเหมาจ่าย แต่พิจารณาตามประเภทและความเสียหายจริง คุณสมบัติ และเอกสารหลักฐาน และเจ้าหน้าที่อาจตรวจสอบข้อเท็จจริง",
              },
            ],
          },
          { kind: "heading", text: "ขอความช่วยเหลือ" },
          {
            kind: "list",
            items: [
              "สายด่วน กทม. 1555 ตลอด 24 ชั่วโมง เรื่องเงินช่วยเหลือของ กทม. หรือสำนักงานเขตที่ต้องไป",
              "ปภ. โทร 1784 หรือ LINE @1784DDPM เรื่องเงินช่วยเหลือจากรัฐบาล",
              "สำนักงานเขต วันจันทร์ถึงศุกร์ เวลาราชการ",
              "BIRSA หากเป็นนักศึกษา BIR และต้องการให้ช่วยอธิบายแบบฟอร์ม",
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
