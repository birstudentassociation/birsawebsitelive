import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Written for the aftermath of the Bangkok floods of September 2026: classes
 * and exams, a step by step for going home, cleaning up and staying well, and
 * links to the claims guide in `content/emergency/claims/flooding.ts`, from
 * BMA, DDPM and Department of Disease Control announcements and the sources
 * below. When the alert is ended, restore the general flooding guide from git
 * history (commit 2656287).
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
      "The floods that began on 24 September have gone down across most of Bangkok. Parts of Lat Krabang and Saphan Sung are still under water, and more heavy rain is forecast for 5 and 6 October. Work through the steps below, and claim money for any damage.",
    banner:
      "The floods have gone down. Find out how to claim the government's 9,000 baht and BMA compensation.",
    now: [
      "Photograph or film the damage before you clean up or throw anything away.",
      "Claim money for the damage. Check what you can get below, and claim from the BMA within 30 days of the flood.",
      "Keep the power off at the main switch until the floor, wiring and sockets are dry.",
      "Sit any postponed midterms on Sunday 4 or Sunday 11 October.",
      "Heavy rain is forecast for 5 and 6 October. Keep away from the piers at high tide.",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "Thammasat classes and exams",
        body: [
          "All classes at every campus were online until Saturday 3 October. By 16:00 on 3 October the university had not announced arrangements from Monday 5 October.",
          "The university's announcement of 29 September says that after 3 October lecturers may keep classes online or hybrid while students are still affected. Your lecturer will tell you in advance. If you are still affected by the floods, tell your lecturer or your faculty office.",
        ],
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
        id: "claims",
        heading: "Claim money for flood damage",
        body: [
          "If the place you usually live was flooded, you may be able to get 9,000 baht from the government and compensation from the BMA. They are separate schemes, so apply to both. Claim from the BMA within 30 days of the flood.",
        ],
        actions: [
          {
            label: "Check what you can claim",
            href: "/emergency/flooding/claims/check",
            description: "Up to 6 questions. It takes about 2 minutes.",
          },
          {
            label: "Read the guide to claiming",
            href: "/emergency/flooding/claims",
            description:
              "Who can get what, the documents you need and how to apply, one thing at a time.",
          },
        ],
      },
      {
        id: "after-the-flood",
        heading: "After the flood, step by step",
        body: [
          "Open each step to see what to do, and tick things off as you go. Your ticks are saved in this browser only.",
        ],
        stepByStep: [
          {
            id: "safe-to-go-back",
            title: "Check it is safe to go back",
            tasks: [
              {
                id: "wait",
                label: "Wait until the water has gone and officials say it is safe",
              },
              {
                id: "building",
                label: "Look for leaning walls, cracks and sagging ceilings before you go in",
                hint: "Do not go in if the building looks unsafe.",
              },
              {
                id: "torch",
                label:
                  "Take a torch, and do not light a flame or use a switch until you know there is no gas leak",
              },
              {
                id: "gas",
                label: "Check that any gas cylinder is turned off",
                hint: "If you smell gas, open the doors and windows and leave.",
              },
              {
                id: "animals",
                label: "Check for snakes and scorpions with a long stick",
                hint: "They hide in rubbish, buckets and corners.",
              },
            ],
          },
          {
            id: "power",
            title: "Turn the power back on safely",
            tasks: [
              {
                id: "main-switch",
                label: "Keep the main switch off while the floor is wet",
              },
              {
                id: "one-circuit",
                label: "When everything is dry, turn on one circuit at a time",
                hint: "If a socket or switch is still damp, turn the power off again.",
              },
              {
                id: "appliances",
                label: "Get appliances that were under water checked before you use them",
              },
              {
                id: "mea",
                label: "Call MEA on 1130 if you are not sure it is safe",
                hint: "24 hours. MEA can check the supply and move meters and sockets higher.",
              },
            ],
            items: ["Report fallen cables or sparking equipment to MEA on 1130 straight away."],
          },
          {
            id: "record-damage",
            title: "Record the damage",
            tasks: [
              {
                id: "photos",
                label: "Photograph or film the damage to your home and belongings",
                hint: "Do this before you clean up or throw anything away.",
              },
              {
                id: "receipts",
                label: "Keep receipts for repairs, rent and medical treatment",
              },
              {
                id: "landlord",
                label:
                  "If you rent, get your landlord's agreement in writing before you throw away their things",
              },
              {
                id: "insurer",
                label: "If you have insurance, contact your insurer",
              },
            ],
          },
          {
            id: "claim",
            title: "Claim money",
            blurb: "There are 2 separate schemes. Apply to both if you qualify.",
            tasks: [
              {
                id: "check",
                label: "Check what you can claim",
                href: "/emergency/flooding/claims/check",
              },
              {
                id: "government",
                label: "Apply for the government's 9,000 baht",
                href: "/emergency/flooding/claims/apply-for-9000-baht",
              },
              {
                id: "bma",
                label: "Claim BMA compensation within 30 days",
                href: "/emergency/flooding/claims/claim-online",
              },
            ],
          },
          {
            id: "clean-up",
            title: "Clean up safely",
            tasks: [
              {
                id: "protect",
                label: "Wear rubber boots, rubber gloves, a mask and eye protection",
                hint: "Use an N95 mask if you have one.",
              },
              {
                id: "cuts",
                label: "Cover cuts with waterproof plasters",
              },
              {
                id: "scrub",
                label: "Scrub hard surfaces with detergent, then disinfect them",
                hint: "Use chlorine solution or 0.5% sodium hypochlorite. Never mix chlorine bleach with ammonia.",
              },
              {
                id: "dry",
                label: "Open the windows and use fans to dry each room",
              },
              {
                id: "soft",
                label: "Throw away mattresses, carpets and soft furniture that cannot be dried",
              },
              {
                id: "food",
                label: "Throw away food that touched floodwater",
              },
              {
                id: "containers",
                label: "Empty buckets, pots and anything else holding water",
                hint: "Mosquitoes breed in standing water.",
              },
              {
                id: "shower",
                label: "Shower with soap as soon as you finish",
              },
            ],
            items: ["Watch for mould for several weeks.", "Drink bottled or boiled water."],
          },
          {
            id: "rubbish",
            title: "Get rid of flood rubbish",
            tasks: [
              {
                id: "tie",
                label: "Tie rubbish bags shut",
              },
              {
                id: "report",
                label: "Report piles of flood rubbish in Traffy Fondue",
                hint: "Choose Found flood rubbish (เจอกองขยะน้ำท่วม), or call 1555.",
              },
              {
                id: "large",
                label: "Find a free drop off point for large items on Greener Bangkok",
                href: "https://greener.bangkok.go.th/",
              },
            ],
          },
          {
            id: "health",
            title: "Look after your health",
            blurb:
              "Leptospirosis and melioidosis are common after floods. They can be treated if you see a doctor early.",
            tasks: [
              {
                id: "watch",
                label: "Watch for symptoms for 4 weeks after you were in floodwater or mud",
                hint: "A high fever, a headache, aching calves, thighs or lower back, or red eyes. See a doctor straight away and say you were in floodwater.",
              },
            ],
            items: [
              "Call 1669 if you have trouble breathing, yellow skin or eyes, or you pass very little urine.",
              "See a doctor if a cut that touched floodwater becomes red, swollen or painful.",
              "Diarrhoea, sore red eyes and itchy skin between your toes are also common after floods.",
              "For advice on diseases, call the Department of Disease Control on 1422.",
              "If you are struggling, talk to someone you trust or call the mental health hotline on 1323.",
            ],
          },
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
      "น้ำท่วมที่เริ่มตั้งแต่วันที่ 24 กันยายนลดลงแล้วในกรุงเทพฯ เกือบทุกพื้นที่ เหลือบางส่วนของเขตลาดกระบังและเขตสะพานสูงที่ยังมีน้ำท่วมขัง และคาดว่าจะมีฝนตกหนักอีกในวันที่ 5 และ 6 ตุลาคม ทำตามขั้นตอนด้านล่าง และยื่นขอรับเงินช่วยเหลือค่าเสียหาย",
    banner: "น้ำลดแล้ว ดูวิธีขอรับเงิน 9,000 บาทของรัฐบาลและเงินช่วยเหลือค่าเสียหายของ กทม.",
    now: [
      "ถ่ายภาพหรือวิดีโอความเสียหายไว้ก่อนทำความสะอาดหรือทิ้งของ",
      "ยื่นขอรับเงินช่วยเหลือค่าเสียหาย ตรวจสอบได้ด้านล่างว่าขอรับอะไรได้บ้าง และยื่นขอเงินของ กทม. ภายใน 30 วันนับแต่วันที่ประสบภัย",
      "ยกคัตเอาต์ค้างไว้จนกว่าพื้น สายไฟ และเต้ารับจะแห้งสนิท",
      "เข้าสอบกลางภาคที่เลื่อนไปวันอาทิตย์ที่ 4 หรือวันอาทิตย์ที่ 11 ตุลาคม",
      "คาดว่าจะมีฝนตกหนักในวันที่ 5 และ 6 ตุลาคม หลีกเลี่ยงท่าเรือในช่วงน้ำขึ้น",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "การเรียนและการสอบของธรรมศาสตร์",
        body: [
          "ทุกรายวิชาทุกศูนย์การศึกษาเรียนออนไลน์ถึงวันเสาร์ที่ 3 ตุลาคม จนถึงเวลา 16.00 น. วันที่ 3 ตุลาคม มหาวิทยาลัยยังไม่ประกาศรูปแบบการเรียนตั้งแต่วันจันทร์ที่ 5 ตุลาคม",
          "ประกาศมหาวิทยาลัยเมื่อวันที่ 29 กันยายนระบุว่า หลังวันที่ 3 ตุลาคม หากนักศึกษายังได้รับผลกระทบ อาจารย์อาจจัดการเรียนการสอนแบบออนไลน์หรือแบบผสมผสานต่อไป และจะแจ้งล่วงหน้า หากยังได้รับผลกระทบจากน้ำท่วม ให้แจ้งอาจารย์ผู้สอนหรือหน่วยงานของคณะ",
        ],
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
        id: "claims",
        heading: "ขอรับเงินช่วยเหลือค่าเสียหายจากน้ำท่วม",
        body: [
          "หากที่อยู่อาศัยประจำถูกน้ำท่วม คุณอาจได้รับเงิน 9,000 บาทจากรัฐบาล และเงินช่วยเหลือค่าเสียหายจาก กทม. ทั้งสองโครงการแยกจากกัน จึงต้องยื่นทั้งสองทาง ส่วนของ กทม. ต้องยื่นภายใน 30 วันนับแต่วันที่ประสบภัย",
        ],
        actions: [
          {
            label: "ตรวจสอบว่าขอรับอะไรได้บ้าง",
            href: "/emergency/flooding/claims/check",
            description: "คำถามไม่เกิน 6 ข้อ ใช้เวลาราว 2 นาที",
          },
          {
            label: "อ่านคู่มือการขอรับเงินช่วยเหลือ",
            href: "/emergency/flooding/claims",
            description: "ใครได้อะไร ต้องใช้เอกสารอะไร และยื่นอย่างไร ทีละเรื่อง",
          },
        ],
      },
      {
        id: "after-the-flood",
        heading: "สิ่งที่ต้องทำหลังน้ำลด ทีละขั้นตอน",
        body: [
          "เปิดแต่ละขั้นตอนเพื่อดูว่าต้องทำอะไร และติ๊กเมื่อทำเสร็จ ระบบเก็บรายการที่ติ๊กไว้ในเบราว์เซอร์นี้เท่านั้น",
        ],
        stepByStep: [
          {
            id: "safe-to-go-back",
            title: "ตรวจสอบว่ากลับเข้าบ้านได้อย่างปลอดภัย",
            tasks: [
              {
                id: "wait",
                label: "รอให้น้ำลดและเจ้าหน้าที่แจ้งว่าปลอดภัย",
              },
              {
                id: "building",
                label: "ดูว่าผนังเอียง มีรอยร้าว หรือฝ้าเพดานหย่อนหรือไม่ก่อนเข้าบ้าน",
                hint: "หากดูไม่ปลอดภัยอย่าเข้าไป",
              },
              {
                id: "torch",
                label: "ใช้ไฟฉาย อย่าจุดไฟหรือเปิดสวิตช์จนกว่าจะแน่ใจว่าไม่มีแก๊สรั่ว",
              },
              {
                id: "gas",
                label: "ตรวจดูว่าปิดวาล์วถังแก๊สแล้ว",
                hint: "หากได้กลิ่นแก๊ส ให้เปิดประตูหน้าต่างแล้วออกจากบ้าน",
              },
              {
                id: "animals",
                label: "ใช้ไม้ยาวเขี่ยหางูและแมงป่อง",
                hint: "สัตว์มีพิษมักซ่อนอยู่ตามกองขยะ ถัง และซอกมุม",
              },
            ],
          },
          {
            id: "power",
            title: "เปิดไฟฟ้าอย่างปลอดภัย",
            tasks: [
              {
                id: "main-switch",
                label: "ยกคัตเอาต์ค้างไว้ตลอดเวลาที่พื้นยังเปียก",
              },
              {
                id: "one-circuit",
                label: "เมื่อแห้งสนิทแล้ว ลองเปิดไฟทีละวงจร",
                hint: "หากเต้ารับหรือสวิตช์จุดใดยังชื้น ให้ปิดไฟอีกครั้ง",
              },
              {
                id: "appliances",
                label: "ให้ช่างตรวจเครื่องใช้ไฟฟ้าที่จมน้ำก่อนใช้งาน",
              },
              {
                id: "mea",
                label: "โทรการไฟฟ้านครหลวง 1130 หากไม่แน่ใจว่าปลอดภัย",
                hint: "ตลอด 24 ชั่วโมง ตรวจสอบระบบไฟฟ้าและย้ายมิเตอร์หรือเต้ารับขึ้นที่สูงได้",
              },
            ],
            items: ["หากพบสายไฟขาดหรืออุปกรณ์ไฟฟ้ามีประกายไฟ แจ้งการไฟฟ้านครหลวง 1130 ทันที"],
          },
          {
            id: "record-damage",
            title: "เก็บหลักฐานความเสียหาย",
            tasks: [
              {
                id: "photos",
                label: "ถ่ายภาพหรือวิดีโอความเสียหายของบ้านและทรัพย์สิน",
                hint: "ทำก่อนทำความสะอาดหรือทิ้งของ",
              },
              {
                id: "receipts",
                label: "เก็บใบเสร็จค่าซ่อมแซม ค่าเช่า และค่ารักษาพยาบาล",
              },
              {
                id: "landlord",
                label:
                  "หากเช่าที่พัก ขอความยินยอมจากผู้ให้เช่าเป็นลายลักษณ์อักษรก่อนทิ้งของของผู้ให้เช่า",
              },
              {
                id: "insurer",
                label: "หากทำประกันไว้ ให้ติดต่อบริษัทประกัน",
              },
            ],
          },
          {
            id: "claim",
            title: "ขอรับเงินช่วยเหลือ",
            blurb: "เงินช่วยเหลือมี 2 แหล่งที่แยกจากกัน หากเข้าเกณฑ์ให้ยื่นทั้งสองทาง",
            tasks: [
              {
                id: "check",
                label: "ตรวจสอบว่าขอรับอะไรได้บ้าง",
                href: "/emergency/flooding/claims/check",
              },
              {
                id: "government",
                label: "ยื่นขอเงิน 9,000 บาทของรัฐบาล",
                href: "/emergency/flooding/claims/apply-for-9000-baht",
              },
              {
                id: "bma",
                label: "ยื่นขอเงินช่วยเหลือของ กทม. ภายใน 30 วัน",
                href: "/emergency/flooding/claims/claim-online",
              },
            ],
          },
          {
            id: "clean-up",
            title: "ทำความสะอาดอย่างปลอดภัย",
            tasks: [
              {
                id: "protect",
                label: "สวมรองเท้าบูทยาง ถุงมือยาง หน้ากาก และแว่นป้องกันตา",
                hint: "ใช้หน้ากาก N95 ถ้ามี",
              },
              {
                id: "cuts",
                label: "ปิดแผลด้วยพลาสเตอร์กันน้ำ",
              },
              {
                id: "scrub",
                label: "ขัดล้างพื้นผิวแข็งด้วยผงซักฟอก แล้วฆ่าเชื้อ",
                hint: "ใช้น้ำคลอรีนหรือโซเดียมไฮโปคลอไรต์ 0.5 เปอร์เซ็นต์ ห้ามผสมน้ำยาคลอรีนกับแอมโมเนีย",
              },
              {
                id: "dry",
                label: "เปิดหน้าต่างและใช้พัดลมช่วยให้ห้องแห้ง",
              },
              {
                id: "soft",
                label: "ทิ้งที่นอน พรม และเฟอร์นิเจอร์บุนวมที่ทำให้แห้งไม่ได้",
              },
              {
                id: "food",
                label: "ทิ้งอาหารที่สัมผัสน้ำท่วม",
              },
              {
                id: "containers",
                label: "เทน้ำขังในถัง กระถาง และภาชนะต่าง ๆ ทิ้ง",
                hint: "ยุงวางไข่ในน้ำขัง",
              },
              {
                id: "shower",
                label: "อาบน้ำฟอกสบู่ทันทีเมื่อทำเสร็จ",
              },
            ],
            items: ["คอยสังเกตเชื้อราไปอีกหลายสัปดาห์", "ดื่มน้ำบรรจุขวดหรือน้ำต้มสุก"],
          },
          {
            id: "rubbish",
            title: "กำจัดขยะน้ำท่วม",
            tasks: [
              {
                id: "tie",
                label: "มัดปากถุงขยะให้แน่น",
              },
              {
                id: "report",
                label: "แจ้งกองขยะน้ำท่วมใน Traffy Fondue",
                hint: "เลือกหัวข้อ เจอกองขยะน้ำท่วม หรือโทร 1555",
              },
              {
                id: "large",
                label: "ค้นหาจุดทิ้งขยะชิ้นใหญ่ฟรีที่ Greener Bangkok",
                href: "https://greener.bangkok.go.th/",
              },
            ],
          },
          {
            id: "health",
            title: "ดูแลสุขภาพ",
            blurb: "โรคฉี่หนูและโรคไข้ดินพบบ่อยหลังน้ำท่วม หากไปพบแพทย์เร็วจะรักษาได้",
            tasks: [
              {
                id: "watch",
                label: "สังเกตอาการไปอีก 4 สัปดาห์หลังลุยน้ำหรือย่ำโคลน",
                hint: "ไข้สูง ปวดศีรษะ ปวดกล้ามเนื้อน่อง ต้นขา หรือหลังส่วนล่าง หรือตาแดง ให้ไปพบแพทย์ทันทีและบอกว่าเคยลุยน้ำท่วม",
              },
            ],
            items: [
              "โทร 1669 หากหายใจลำบาก ตัวเหลืองหรือตาเหลือง หรือปัสสาวะน้อยมาก",
              "ไปพบแพทย์หากแผลที่โดนน้ำท่วมบวมแดงหรือเจ็บมากขึ้น",
              "ท้องร่วง ตาแดง และน้ำกัดเท้า ก็พบบ่อยหลังน้ำท่วมเช่นกัน",
              "สอบถามเรื่องโรคติดต่อได้ที่สายด่วนกรมควบคุมโรค 1422",
              "หากรู้สึกหนักใจ ให้คุยกับคนที่ไว้ใจ หรือโทรสายด่วนสุขภาพจิต 1323",
            ],
          },
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
