import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Written for the Bangkok floods of September 2026: shelters, sandbags, roads
 * to avoid and who to call, from BMA and district office announcements and
 * the Thai official sources below. When this flood is over, restore the
 * general flooding guide from git history (commit 2656287) before the alert
 * is ended.
 */
const flooding: EmergencyScenario = {
  id: "flooding",
  severity: "critical",
  hero: "red",
  group: "hazard",
  keyContacts: ["bma", "ambulance", "bmaFlood"],
  moreContacts: ["ddpm", "mea", "erawan", "tmd", "police", "ddc", "tuClinic", "facultyOffice"],
  sources: [
    {
      label: {
        en: "BMA, help for people affected by flooding in Bangkok, fact-finding form, September 2026 (Thai)",
        th: "กรุงเทพมหานคร แบบสอบข้อเท็จจริงผู้ประสบอุทกภัย กันยายน 2569",
      },
      href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
    },
    {
      label: {
        en: "The Standard, BMA flood relief rates, conditions and documents, 26 September 2026 (Thai)",
        th: "THE STANDARD เช็กเงื่อนไขและเอกสาร กทม. เปิดหลักเกณฑ์จ่ายเงินเยียวยาผู้ประสบอุทกภัย 26 กันยายน 2569",
      },
      href: "https://thestandard.co/bma-flood-relief-50-districts/",
    },
    {
      label: {
        en: "Thai PBS, Chao Phraya Dam raises its release to 1,950 cubic metres a second, 26 September 2026 (Thai)",
        th: "ไทยพีบีเอส เขื่อนเจ้าพระยาเพิ่มการระบายน้ำจาก 1,850 เป็น 1,950 ลบ.ม./วินาที 26 กันยายน 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/558580",
    },
    {
      label: {
        en: "Spacebar, Chao Phraya Dam release held at 1,950 cubic metres a second from 14:00, 26 September 2026 (Thai)",
        th: "Spacebar เขื่อนเจ้าพระยาระบายน้ำ 1,950 ลบ.ม./วินาที ตั้งแต่เวลา 14.00 น. 26 กันยายน 2569",
      },
      href: "https://spacebar.th/social/chao-phraya-dam-discharge-2000-warning-26-sep-2026",
    },
    {
      label: {
        en: "Spacebar, RID expects water from the north to peak around 2 October, 25 September 2026 (Thai)",
        th: "Spacebar กรมชลประทานคาดน้ำเหนือสูงสุดราววันที่ 2 ตุลาคม 25 กันยายน 2569",
      },
      href: "https://spacebar.th/social/chao-phraya-river-water-rise-october-2-2026",
    },
    {
      label: {
        en: "Hydrographic Department, Royal Thai Navy, 2026 tide predictions for Navy Headquarters, Bangkok, above mean sea level (PDF, Thai and English)",
        th: "กรมอุทกศาสตร์ กองทัพเรือ มาตราน้ำ พ.ศ. 2569 กองบัญชาการกองทัพเรือ เหนือระดับทะเลปานกลาง",
      },
      href: "https://hydro.navy.mi.th/storage/frontend/article/22989/file/th/HD2026msl.pdf",
    },
    {
      label: {
        en: "Thaiwater, live river levels on the Chao Phraya (Thai)",
        th: "คลังข้อมูลน้ำแห่งชาติ ระดับน้ำแม่น้ำเจ้าพระยา",
      },
      href: "https://www.thaiwater.net/water/wl",
    },
    {
      label: {
        en: "Spring News, how long water from the Chao Phraya Dam takes to reach Bangkok, 4 October 2022 (Thai)",
        th: "สปริงนิวส์ คาดการณ์มวลน้ำภาคกลาง 56 ชั่วโมงก่อนถึงกรุงเทพฯ 4 ตุลาคม 2565",
      },
      href: "https://www.springnews.co.th/keep-the-world/climate-change/830717",
    },
    {
      label: {
        en: "MGR Online, governor checks the river wall at Saphan Phut and Tha Tien, 10 November 2025 (Thai)",
        th: "ผู้จัดการออนไลน์ ผู้ว่าฯ ชัชชาติลงพื้นที่สะพานพุทธและท่าเตียน ตรวจแนวป้องกันน้ำท่วม 10 พฤศจิกายน 2568",
      },
      href: "https://mgronline.com/qol/detail/9680000107502",
    },
    {
      label: {
        en: "InfoQuest, BMA raises sandbag defences along the Chao Phraya, 2 September 2026 (Thai)",
        th: "อินโฟเควสท์ กทม. เฝ้าระวังระดับน้ำเจ้าพระยาเพิ่มสูง เตรียมแนวป้องกันรับมือมวลน้ำ 2 กันยายน 2569",
      },
      href: "https://www.infoquest.co.th/2026/641730",
    },
    {
      label: {
        en: "MGR Online, the Chao Phraya overflows onto Maharaj and Phra Chan roads at Tha Prachan, 29 October 2011 (Thai)",
        th: "ผู้จัดการออนไลน์ น้ำเจ้าพระยาเอ่อล้นท่วมท่าพระจันทร์และถนนมหาราช 29 ตุลาคม 2554",
      },
      href: "https://mgronline.com/onlinesection/detail/9540000137876",
    },
    {
      label: {
        en: "The Standard, heavy rain floods Maharaj Road from Tha Chang to Tha Prachan, 22 October 2024 (Thai)",
        th: "THE STANDARD ฝนตกหนัก น้ำท่วมถนนมหาราชตั้งแต่ท่าช้างถึงท่าพระจันทร์ 22 ตุลาคม 2567",
      },
      href: "https://thestandard.co/bkk-heavy-rain-flooded-maharaj-road/",
    },
    {
      label: {
        en: "Thai Post, Thai Meteorological Department warning No. 12, 26 September 2026 (Thai)",
        th: "ไทยโพสต์ กรมอุตุนิยมวิทยาประกาศฉบับที่ 12 วันที่ 26 กันยายน 2569",
      },
      href: "https://www.thaipost.net/general-news/1076964/",
    },
    {
      label: {
        en: "Thai Post, governor expects two to three days to drain the water if no more rain falls, 26 September 2026 (Thai)",
        th: "ไทยโพสต์ ชัชชาติเผยฝนสะสม 300 มม. คาดคลี่คลายใน 2 ถึง 3 วันหากไม่ตกเพิ่ม 26 กันยายน 2569",
      },
      href: "https://www.thaipost.net/x-cite-news/1076877/",
    },
    {
      label: {
        en: "Khaosod English, BMA schools closed and work from home on Monday, 26 September 2026",
        th: "Khaosod English กทม. ปิดโรงเรียนและให้ทำงานที่บ้านวันจันทร์ 26 กันยายน 2569 (ภาษาอังกฤษ)",
      },
      href: "https://www.khaosodenglish.com/news/2026/09/26/closed-schools-and-work-from-home-on-monday-as-bangkok-battles-floods/",
    },
    {
      label: {
        en: "Matichon, governor adds 1 million sandbags for district offices, 26 September 2026 (Thai)",
        th: "มติชน ชัชชาติเพิ่มกระสอบทรายแจก 1 ล้านใบ 26 กันยายน 2569",
      },
      href: "https://www.matichon.co.th/local/news_5905753",
    },
    {
      label: {
        en: "Bangkok Biz News, DDPM figures on people affected in 21 provinces, 26 September 2026 (Thai)",
        th: "กรุงเทพธุรกิจ ปภ. เผยน้ำท่วมกระทบ 21 จังหวัด กว่า 8.4 หมื่นคน 26 กันยายน 2569",
      },
      href: "https://www.bangkokbiznews.com/news/1253620",
    },
    {
      label: {
        en: "Thai PBS, Vibhavadi Rangsit Road flooded over 1 m, 26 September 2026 (Thai)",
        th: "Thai PBS กทม. น้ำท่วมขังหลายจุด ถนนวิภาวดีสัญจรยากลำบาก 26 กันยายน 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/558575",
    },
    {
      label: {
        en: "Daily News, governor advises staying at home and avoiding six flooded main roads, 26 September 2026 (Thai)",
        th: "เดลินิวส์ ชัชชาติแนะตั้งหลักอยู่บ้าน เลี่ยงถนนสายหลักน้ำท่วมสูง 26 กันยายน 2569",
      },
      href: "https://www.dailynews.co.th/news/6222377/",
    },
    {
      label: {
        en: "Thai PBS, BMA pumps at full capacity after nearly 300 mm in 48 hours, 26 September 2026 (Thai)",
        th: "Thai PBS กทม. รับมือฝนสะสม 48 ชม. ใกล้แตะ 300 มม. เร่งสูบเต็มกำลัง 26 กันยายน 2569",
      },
      href: "https://www.thaipbs.or.th/news/content/558595",
    },
    {
      label: {
        en: "PPTV, Thai Meteorological Department warning No. 11, 26 September 2026 (Thai)",
        th: "PPTV กรมอุตุนิยมวิทยาประกาศฉบับที่ 11 วันที่ 26 กันยายน 2569",
      },
      href: "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284170",
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
        en: "The Bangkok Insight, DDPM cell broadcast on critical canal levels in Bangkok, 26 September 2026 (Thai)",
        th: "The Bangkok Insight ปภ. แจ้งเตือนผ่าน Cell Broadcast ระดับน้ำในคลอง กทม. วิกฤต 26 กันยายน 2569",
      },
      href: "https://www.thebangkokinsight.com/news/politics-general/general/1700728/",
    },
    {
      label: {
        en: "Government Public Relations Department, the BMA's seven flood measures, 26 September 2026 (Thai)",
        th: "กรมประชาสัมพันธ์ กทม. เร่ง 7 มาตรการรับมืออุทกภัย 26 กันยายน 2569",
      },
      href: "https://www.prd.go.th/th/content/category/detail/id/33/iid/545032",
    },
    {
      label: {
        en: "Thai Post, Bangkok governor on nearly 300 mm of rain and canals at critical level (Thai)",
        th: "ไทยโพสต์ ชัชชาติรับฝนสะสมเกือบ 300 มม. คลองหลายสายขึ้นสีแดง",
      },
      href: "https://www.thaipost.net/x-cite-news/1076623/",
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
        en: "Government Public Relations Department, DDPM watch on the rising Chao Phraya (Thai)",
        th: "กรมประชาสัมพันธ์ ปภ. แจ้งเฝ้าระวังระดับน้ำแม่น้ำเจ้าพระยาเพิ่มสูงขึ้น",
      },
      href: "https://www.prd.go.th/th/content/category/detail/id/33/iid/543624",
    },
    {
      label: {
        en: "MGR Online, DDPM advice on staying safe in floods (Thai)",
        th: "ผู้จัดการออนไลน์ ปภ. แนะวิธีปฏิบัติตนให้ปลอดภัยช่วงน้ำท่วม",
      },
      href: "https://mgronline.com/uptodate/detail/9680000108066",
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
        en: "Hfocus, Department of Disease Control on leptospirosis, melioidosis and electric shock in floods (Thai)",
        th: "Hfocus กรมควบคุมโรคแนะป้องกันไข้ฉี่หนู ไข้ดิน และไฟฟ้าดูดช่วงน้ำท่วม",
      },
      href: "https://www.hfocus.org/content/2026/08/39249",
    },
    {
      label: {
        en: "Department of Disease Control, leptospirosis (Thai)",
        th: "กรมควบคุมโรค โรคเลปโตสไปโรซิส (โรคฉี่หนู)",
      },
      href: "https://ddc.moph.go.th/disease_detail.php?d=16",
    },
  ],
  reviewed: "2026-09-26",
  en: {
    title: "Bangkok floods, September 2026",
    summary:
      "Heavy rain since 24 September has pushed canals across Bangkok to critical levels and flooded roads in the north, east and west of the city. All 50 districts are a declared disaster area. This page covers Thammasat exam and class changes first, then shelters, sandbags, roads to avoid and who to call.",
    banner:
      "Because of flooding across Bangkok, all Thammasat classes are online on Monday 28 and Tuesday 29 September.",
    now: [
      "Study online on 28 and 29 September. This weekend's midterms move to 4 and 11 October. See the Thammasat section below.",
      "Stay at home if you can and keep out of floodwater. The governor expects the water to take two to three days to drain if no more rain falls.",
      "If water comes in, move valuables and your car higher. Turn off the main switch if you can reach it from somewhere dry.",
      "Register for the student union shelter at Tha Prachan if you need to leave home. Others can find a shelter on BMA Flood Support or call 1555.",
      "Report flooding on 1555 or Traffy Fondue on LINE. Call 1669 for a medical emergency or to move a patient.",
      "Photograph damage before you clean up, then claim up to 49,500 baht for repairs through your district office, even if you rent. See claiming compensation below.",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "Thammasat shelter, exams, classes and libraries",
        body: [
          "On 26 September the university postponed this weekend's undergraduate midterm exams and moved classes online on 28 and 29 September. The student union is running a shelter for Tha Prachan students. Thammasat University Library has closed some branches, and will review the 28 September closures and announce any change on library.tu.ac.th and LINE @lifeonline.",
          "BIRSA is monitoring the situation and updating this page.",
        ],
        directoryOpen: true,
        directory: [
          {
            heading: "Temporary shelter for Tha Prachan students",
            places: [
              {
                name: "Student Activities Building (ตึกกิจกรรมนักศึกษา), Tha Prachan campus",
                detail:
                  "Run by the Thammasat University Student Union, Tha Prachan, for students affected by the floods who need somewhere to stay. Register before you go.",
              },
              {
                name: "TUSU Tha Prachan",
                detail: "Instagram TUSU.TPC",
                phone: { phone: "095-249-5014" },
              },
              { name: "TUSU Tha Prachan, second line", phone: { phone: "094-965-9926" } },
              { name: "Student Affairs Division", phone: { phone: "02-222-8871" } },
            ],
            note: "TUSU Tha Prachan says students can contact it for help at any time.",
            links: [
              {
                label: "Register to stay at the shelter",
                href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
              },
            ],
          },
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
            heading: "Classes, Monday 28 and Tuesday 29 September",
            places: [
              { name: "All courses at every campus", detail: "Online" },
              {
                name: "Courses that must be taught in person",
                detail: "At the faculty's discretion. Your lecturer will tell you in advance.",
              },
            ],
            note: "All programmes.",
          },
          {
            heading: "Libraries, Sunday 27 September",
            places: [
              { name: "Tha Prachan, all branch libraries", detail: "Closed" },
              { name: "Rangsit, Puey Ungphakorn Library", detail: "Closed" },
              { name: "Rangsit, Public Library", detail: "Closed" },
              { name: "Rangsit, Learning Center", detail: "Open as usual" },
              { name: "Rangsit, Nongyao Chaiseri Library", detail: "Open as usual" },
              { name: "Lampang, Boonchu Treethong Library", detail: "Open as usual" },
            ],
          },
          {
            heading: "Libraries, Monday 28 September",
            places: [
              { name: "Tha Prachan, Sanya Dharmasakti Library", detail: "Closed" },
              { name: "Rangsit, Puey Ungphakorn Library", detail: "Closed" },
              { name: "Rangsit, Public Library", detail: "Closed" },
            ],
            note: "The library may change this. Check before you go.",
          },
        ],
        links: [
          {
            label: "Read the university announcement (scanned, in Thai)",
            href: "/emergency/tu-announcement-2026-09-26.jpg",
          },
          { label: "Thammasat University Library", href: "https://www.library.tu.ac.th" },
        ],
      },
      {
        id: "campus",
        heading: "Tha Prachan, the river and getting to campus",
        body: [
          "Tha Prachan has not flooded. The campus is behind the river wall, and if the river ever came over it most of Bangkok would already be under water. The real risk is water backing up out of the drains.",
        ],
        items: [
          "Watch the Tha Prachan gate area and the area around the Faculty of Liberal Arts. Water overflowing from the drains collects there first.",
          "Drains overflow when heavy rain falls at high tide, because the canals cannot empty into the river.",
          "The riskiest days are 29 September to 3 October, when high tides, water from the north and rain all arrive together.",
          "High tide is every evening from about 19:00 to 22:00. From 29 September there is a second high tide in the morning or around midday.",
          "Keep away from Tha Prachan, Tha Chang and other piers at high tide, because they are outside the wall. Check boat services before you travel.",
          "Coming from the north or east, expect flooded roads around Din Daeng, Ratchadaphisek, Lat Phrao, Phahon Yothin and Ngam Wong Wan.",
        ],
        links: [
          {
            label: "Check live river levels on Thaiwater",
            href: "https://www.thaiwater.net/water/wl",
          },
        ],
      },
      {
        id: "prepare",
        heading: "Preparing for flooding",
        items: [
          "Keep your phone charged and a power bank ready.",
          "Put your ID card, passport and other documents in a waterproof bag.",
          "Pack a few days of any medicine you take.",
          "Keep a torch, drinking water and some food that does not need cooking.",
          "Save 1669 for medical emergencies and 1555 for the BMA hotline in your phone.",
          "Move valuables, electrical items and important papers off the floor.",
        ],
      },
      {
        id: "shelters",
        heading: "Shelters and parking",
        body: [
          "Temporary shelters, safe places to park and shuttle buses are listed on BMA Flood Support, the BMA's help and information page. It shows which places are open, nearly full or full, by district. Check it before you go, or call 1555 or your district office.",
        ],
        items: [
          "The BMA has opened 233 shelters across the city, many of them in schools, with room for about 15,000 people.",
          "Thammasat students at Tha Prachan can stay at the Thammasat University Student Union's temporary shelter in the Student Activities Building. Register first, and see the Thammasat section for contacts.",
        ],
        districtFinder: {
          kinds: ["shelters", "parking"],
          prompt:
            "Choose your district to see the shelters and free parking published there. Places fill up and change, so call before you go.",
        },
        links: [
          {
            label: "Register for the Tha Prachan student shelter",
            href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
          },
          {
            label: "Open BMA Flood Support",
            href: "https://floodsupport.awarehouse.tech/",
          },
        ],
      },
      {
        id: "sandbags",
        heading: "Sandbags",
        body: [
          "District offices are giving sandbags to households in flooded areas. Bring your ID card to register. Districts give up to 20 bags per household.",
        ],
        items: [
          "At some points you fill the bags yourself and take them home in your own vehicle.",
          "Times and amounts can change with the situation. Call your district office or 1555 before you go.",
          "If your district shows nothing, ask your district office or request sandbags through Traffy Fondue on LINE.",
        ],
        districtFinder: {
          kinds: ["sandbags"],
          prompt:
            "Choose your district to see where sandbags are being given out there and the district office number.",
        },
      },
      {
        id: "roads",
        heading: "Roads to avoid",
        body: [
          "Flooded roads and closures change through the day. Check the BMA's official flood alert page before you set off, and do what officers at the scene tell you. You can also call 1555 or check Traffy Fondue on LINE.",
        ],
        links: [
          {
            label: "Open the BMA flood alert page",
            href: "https://now.bangkok.go.th/flood-alert.html",
          },
        ],
      },
      {
        id: "help",
        heading: "Reporting flooding and getting help",
        items: [
          "Report flooding, blocked drains and people who need help through Traffy Fondue on LINE (@Traffyfondue) or the BMA hotline 1555.",
          "The BMA flood control centre is on 02-248-5115 and posts updates on its Facebook page, ศูนย์ป้องกันน้ำท่วม กทม.",
          "For a medical emergency, or to move a patient with a medical condition, call 1669.",
          "For disaster help, call DDPM on 1784 or message @1784DDPM on LINE.",
          "Report fallen cables or sparking equipment to MEA on 1130.",
          "Only trust flood news from the BMA, the Thai Meteorological Department, DDPM and Thammasat. Check before you share anything.",
          "Check on friends and neighbours, especially international students who do not read Thai.",
        ],
      },
      {
        id: "disaster-area",
        heading: "The disaster declaration and claiming compensation",
        body: [
          "On 26 September Governor Chadchart Sittipunt declared all 50 districts a disaster area under the Disaster Prevention and Mitigation Act 2007, extending the 25 September declaration for Nong Chok, Suan Luang and Khan Na Yao. It lets government agencies act quickly and means people whose homes were damaged by the floods can claim compensation from the BMA.",
        ],
        steps: [
          "Photograph or film the damage to your home and belongings before you clean up.",
          "Report the damage to your district office. Staff will come and assess it.",
          "Ask the district office for a certificate that you were affected by the disaster, with a list of the damage (form Bor Sor 3). The district must give the cause as flooding.",
          "Download the fact-finding form below, fill it in and take it to your district office with the documents listed under each kind of help.",
        ],
        items: [
          "You can claim if the place you normally live was damaged, or if water came into the rooms you live in.",
          "If you rent, you claim, not your landlord.",
          "In a building with several floors, only the floors that flooded can claim.",
          "If you do not have a house registration at the address, for example because you live in a dormitory, the district office will also take a statement from you (form Por Kor 14).",
          "The BMA also pays for household essentials, tools you need for your work, medical treatment and funerals at set rates. Ask your district office, call 1555 or the flood control centre on 02-248-5115, or use Traffy Fondue on LINE.",
        ],
        directoryOpen: true,
        directory: [
          {
            heading: "Repairs to your home",
            places: [
              {
                name: "Up to 49,500 baht per home",
                detail:
                  "Based on the actual damage. Covers only the cost of repair materials for the building's structure, at the rates on the form.",
              },
              {
                name: "Documents",
                detail:
                  "The fact-finding form, a copy of your ID card (not expired), a copy of your current house registration, a copy of the land title deed showing the owner or a request form instead, form Bor Sor 3, the Por Kor 14 statement, the repair materials request, and photographs of the damage.",
              },
            ],
          },
          {
            heading: "Temporary accommodation or rent",
            places: [
              {
                name: "Home partly damaged",
                detail: "Up to 3,000 baht per household",
              },
              {
                name: "Whole home damaged",
                detail: "Up to 3,000 baht per household a month, for up to 2 months",
              },
              {
                name: "Who can claim",
                detail:
                  "The owner, the head of the household or the tenant, who really lives there as their usual home. The home must have been damaged by the floods, or flooded so that you cannot live in it.",
              },
              {
                name: "Documents",
                detail:
                  "The fact-finding form, a copy of your ID card (not expired), form Bor Sor 3, the Por Kor 14 statement, photographs of the damage, and anything else that helps, such as your tenancy agreement or rent receipts.",
              },
            ],
          },
          {
            heading: "Household essentials",
            places: [
              { name: "Home partly damaged", detail: "Up to 1,800 baht per household" },
              { name: "Whole home damaged", detail: "Up to 3,800 baht per household" },
            ],
          },
        ],
        links: [
          {
            label: "Download the fact-finding form (PDF, in Thai)",
            href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
          },
          {
            label: "Read the BMA's rules for compensation (image, in Thai)",
            href: "/emergency/bma-flood-relief-2026-09-26.webp",
          },
          {
            label: "Read the BMA announcement (scanned, in Thai)",
            href: "/emergency/bma-disaster-area-2026-09-26.png",
          },
        ],
      },
      {
        id: "safety",
        heading: "Staying safe in floodwater",
        items: [
          "Do not walk or drive through deep or fast water. If you must cross, go slowly, hold on to something fixed and test the ground ahead.",
          "Never touch switches, sockets or appliances while you are wet. Keep away from fallen cables, poles and metal fences in water.",
          "Wear boots and rubber gloves if you have to wade or clean up, cover cuts with waterproof plasters, and shower with soap straight afterwards.",
          "Watch for snakes and other animals sheltering in homes.",
          "See a doctor straight away if you get a high fever, headache, aching calves or back, or red eyes within about two weeks of floodwater, and say you were in floodwater. Leptospirosis and melioidosis are common after floods.",
          "Drink bottled or boiled water.",
        ],
      },
    ],
  },
  th: {
    title: "น้ำท่วมกรุงเทพฯ กันยายน 2569",
    summary:
      "ฝนตกหนักต่อเนื่องตั้งแต่วันที่ 24 กันยายน ทำให้ระดับน้ำในคลองทั่วกรุงเทพฯ อยู่ในขั้นวิกฤต และถนนทางเหนือ ตะวันออก และตะวันตกของเมืองมีน้ำท่วมขัง กทม. ประกาศให้ทั้ง 50 เขตเป็นเขตพื้นที่ประสบสาธารณภัยแล้ว หน้านี้แจ้งการเปลี่ยนแปลงเรื่องการสอบและการเรียนของธรรมศาสตร์ก่อน ตามด้วยศูนย์พักพิง จุดรับกระสอบทราย เส้นทางที่ควรเลี่ยง และเบอร์ติดต่อ",
    banner:
      "เนื่องจากน้ำท่วมทั่วกรุงเทพฯ ธรรมศาสตร์ให้ทุกรายวิชาเรียนออนไลน์ในวันจันทร์ที่ 28 และวันอังคารที่ 29 กันยายน",
    now: [
      "เรียนออนไลน์วันที่ 28 และ 29 กันยายน ส่วนสอบกลางภาคสุดสัปดาห์นี้เลื่อนไปวันที่ 4 และ 11 ตุลาคม ดูหัวข้อธรรมศาสตร์ด้านล่าง",
      "อยู่บ้านหากทำได้และอย่าลุยน้ำ ผู้ว่าฯ กทม. คาดว่าหากฝนไม่ตกเพิ่ม จะใช้เวลาราว 2 ถึง 3 วันในการระบายน้ำ",
      "หากน้ำเข้าบ้าน ให้ยกของมีค่าและย้ายรถขึ้นที่สูง ตัดไฟที่เบรกเกอร์หลักหากเอื้อมถึงได้จากจุดที่แห้ง",
      "นักศึกษาท่าพระจันทร์ที่ต้องออกจากบ้าน ลงทะเบียนเข้าพักศูนย์พักพิงของ อมธ. ได้ ผู้อื่นค้นหาศูนย์พักพิงใน BMA Flood Support หรือโทร 1555",
      "แจ้งน้ำท่วมที่ 1555 หรือ Traffy Fondue ใน LINE เจ็บป่วยฉุกเฉินหรือต้องเคลื่อนย้ายผู้ป่วย โทร 1669",
      "ถ่ายภาพความเสียหายก่อนทำความสะอาด แล้วยื่นขอค่าซ่อมแซมไม่เกิน 49,500 บาทที่สำนักงานเขต ผู้เช่าก็มีสิทธิ ดูหัวข้อการขอรับเงินช่วยเหลือด้านล่าง",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "ธรรมศาสตร์ ศูนย์พักพิง การสอบ การเรียน และห้องสมุด",
        body: [
          "เมื่อวันที่ 26 กันยายน มหาวิทยาลัยธรรมศาสตร์ประกาศเลื่อนการสอบกลางภาคของหลักสูตรระดับปริญญาตรีในสุดสัปดาห์นี้ และให้เรียนออนไลน์ในวันที่ 28 และ 29 กันยายน อมธ. ท่าพระจันทร์เปิดศูนย์พักพิงสำหรับนักศึกษาท่าพระจันทร์ ส่วนหอสมุดแห่งมหาวิทยาลัยธรรมศาสตร์ปิดให้บริการห้องสมุดบางแห่งชั่วคราว และจะประเมินสถานการณ์สำหรับวันที่ 28 กันยายนอีกครั้ง หากมีการเปลี่ยนแปลงจะแจ้งทาง library.tu.ac.th และ LINE @lifeonline",
          "BIRSA กำลังติดตามสถานการณ์และปรับปรุงข้อมูลในหน้านี้",
        ],
        directoryOpen: true,
        directory: [
          {
            heading: "ศูนย์พักพิงชั่วคราวสำหรับนักศึกษาท่าพระจันทร์",
            places: [
              {
                name: "ตึกกิจกรรมนักศึกษา มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
                detail:
                  "อมธ. ท่าพระจันทร์เปิดให้เพื่อนนักศึกษาที่ประสบอุทกภัยและจำเป็นต้องหาที่พักชั่วคราว โปรดลงทะเบียนก่อนเข้าพัก",
              },
              {
                name: "อมธ. ท่าพระจันทร์",
                detail: "Instagram TUSU.TPC",
                phone: { phone: "095-249-5014" },
              },
              { name: "อมธ. ท่าพระจันทร์ (เบอร์ที่สอง)", phone: { phone: "094-965-9926" } },
              { name: "กองกิจการนักศึกษา", phone: { phone: "02-222-8871" } },
            ],
            note: "หากต้องการความช่วยเหลือ ติดต่อ อมธ. ท่าพระจันทร์ได้ตลอดเวลา",
            links: [
              {
                label: "ลงทะเบียนเข้าพักศูนย์พักพิง",
                href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
              },
            ],
          },
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
                detail: "ขยายถึงวันที่ 26 ตุลาคม",
              },
              {
                name: "ผลสอบกลางภาค",
                detail: "ขยายเวลาตรวจข้อสอบออกไป 14 วัน อาจารย์จะแจ้งผลก่อนครบกำหนดถอนรายวิชา",
              },
            ],
            note: "ภาคการศึกษาที่ 1/2569",
          },
          {
            heading: "การเรียนการสอน วันจันทร์ที่ 28 และวันอังคารที่ 29 กันยายน",
            places: [
              { name: "ทุกรายวิชา ทุกศูนย์การศึกษา", detail: "เรียนออนไลน์" },
              {
                name: "รายวิชาที่จำเป็นต้องเรียนในชั้นเรียน",
                detail: "อยู่ในดุลยพินิจของคณะหรือส่วนงาน อาจารย์ผู้สอนจะแจ้งล่วงหน้า",
              },
            ],
            note: "ทุกระดับหลักสูตร",
          },
          {
            heading: "ห้องสมุด วันอาทิตย์ที่ 27 กันยายน",
            places: [
              { name: "ศูนย์ท่าพระจันทร์ ห้องสมุดสาขาทุกแห่ง", detail: "ปิดให้บริการ" },
              { name: "ศูนย์รังสิต หอสมุดป๋วย อึ๊งภากรณ์", detail: "ปิดให้บริการ" },
              { name: "ศูนย์รังสิต ห้องสมุดประชาชน", detail: "ปิดให้บริการ" },
              { name: "ศูนย์รังสิต ศูนย์การเรียนรู้ฯ", detail: "เปิดให้บริการตามปกติ" },
              { name: "ศูนย์รังสิต ห้องสมุดนงเยาว์ ชัยเสรี", detail: "เปิดให้บริการตามปกติ" },
              { name: "ศูนย์ลำปาง ห้องสมุดบุญชู ตรีทอง", detail: "เปิดให้บริการตามปกติ" },
            ],
          },
          {
            heading: "ห้องสมุด วันจันทร์ที่ 28 กันยายน",
            places: [
              { name: "ศูนย์ท่าพระจันทร์ ห้องสมุดสัญญา ธรรมศักดิ์", detail: "ปิดให้บริการ" },
              { name: "ศูนย์รังสิต หอสมุดป๋วย อึ๊งภากรณ์", detail: "ปิดให้บริการ" },
              { name: "ศูนย์รังสิต ห้องสมุดประชาชน", detail: "ปิดให้บริการ" },
            ],
            note: "หอสมุดฯ อาจเปลี่ยนแปลงกำหนดการ โปรดตรวจสอบก่อนเดินทาง",
          },
        ],
        links: [
          {
            label: "อ่านประกาศมหาวิทยาลัยธรรมศาสตร์ (ฉบับสแกน)",
            href: "/emergency/tu-announcement-2026-09-26.jpg",
          },
          { label: "หอสมุดแห่งมหาวิทยาลัยธรรมศาสตร์", href: "https://www.library.tu.ac.th" },
        ],
      },
      {
        id: "campus",
        heading: "ท่าพระจันทร์ แม่น้ำเจ้าพระยา และการเดินทางมามหาวิทยาลัย",
        body: [
          "ท่าพระจันทร์ยังไม่มีน้ำท่วม มหาวิทยาลัยอยู่หลังแนวป้องกันริมแม่น้ำ หากน้ำเจ้าพระยาล้นแนวป้องกันเมื่อใด กรุงเทพฯ ส่วนใหญ่ก็จมน้ำไปแล้ว ความเสี่ยงจริงคือน้ำที่เอ่อขึ้นมาจากท่อระบายน้ำ",
        ],
        items: [
          "เฝ้าระวังบริเวณประตูท่าพระจันทร์และบริเวณคณะศิลปศาสตร์ น้ำที่เอ่อจากท่อระบายน้ำจะท่วมขังตรงนี้ก่อน",
          "ท่อระบายน้ำจะเอ่อล้นเมื่อฝนตกหนักในช่วงน้ำขึ้น เพราะคลองระบายน้ำลงแม่น้ำไม่ได้",
          "ช่วงที่ต้องเฝ้าระวังมากที่สุดคือวันที่ 29 กันยายนถึง 3 ตุลาคม ซึ่งน้ำทะเลหนุน น้ำเหนือ และฝนมาพร้อมกัน",
          "น้ำขึ้นสูงทุกค่ำช่วงประมาณ 19.00 ถึง 22.00 น. และตั้งแต่วันที่ 29 กันยายน จะขึ้นสูงอีกรอบในช่วงเช้าหรือราวเที่ยง",
          "อย่าเข้าใกล้ท่าพระจันทร์ ท่าช้าง และท่าเรืออื่นในช่วงน้ำขึ้น เพราะอยู่นอกแนวป้องกัน ตรวจสอบการเดินเรือก่อนออกเดินทาง",
          "หากเดินทางมาจากทางเหนือหรือตะวันออก ถนนแถวดินแดง รัชดาภิเษก ลาดพร้าว พหลโยธิน และงามวงศ์วานมีน้ำท่วม ให้เผื่อเวลา",
        ],
        links: [
          {
            label: "ดูระดับน้ำแม่น้ำแบบเรียลไทม์ที่ Thaiwater",
            href: "https://www.thaiwater.net/water/wl",
          },
        ],
      },
      {
        id: "prepare",
        heading: "เตรียมตัวรับน้ำท่วม",
        items: [
          "ชาร์จโทรศัพท์ให้เต็มและเตรียมพาวเวอร์แบงก์ไว้",
          "เก็บบัตรประชาชน หนังสือเดินทาง และเอกสารสำคัญไว้ในถุงกันน้ำ",
          "เตรียมยาที่ใช้ประจำไว้ให้พอสำหรับหลายวัน",
          "เตรียมไฟฉาย น้ำดื่ม และอาหารที่ไม่ต้องปรุง",
          "บันทึกเบอร์ 1669 สำหรับเจ็บป่วยฉุกเฉิน และสายด่วน กทม. 1555 ไว้ในโทรศัพท์",
          "ยกของมีค่าและเครื่องใช้ไฟฟ้าขึ้นจากพื้น",
        ],
      },
      {
        id: "shelters",
        heading: "ศูนย์พักพิงและที่จอดรถ",
        body: [
          "ศูนย์พักพิงชั่วคราว จุดจอดรถที่ปลอดภัย และรถรับส่งประชาชน รวบรวมไว้ที่ BMA Flood Support ศูนย์ช่วยเหลือและอำนวยความสะดวกประชาชนของ กทม. ซึ่งแสดงสถานะว่าเปิด ใกล้เต็ม หรือเต็ม แยกตามเขต ตรวจสอบก่อนเดินทาง หรือโทร 1555 หรือติดต่อสำนักงานเขต",
        ],
        items: [
          "กทม. เปิดศูนย์พักพิง 233 แห่งทั่วกรุงเทพฯ หลายแห่งอยู่ในโรงเรียน รองรับได้ราว 15,000 คน",
          "นักศึกษาธรรมศาสตร์ท่าพระจันทร์เข้าพักได้ที่ศูนย์พักพิงชั่วคราวของ อมธ. ท่าพระจันทร์ ณ ตึกกิจกรรมนักศึกษา โปรดลงทะเบียนก่อน และดูช่องทางติดต่อในหัวข้อธรรมศาสตร์",
        ],
        districtFinder: {
          kinds: ["shelters", "parking"],
          prompt:
            "เลือกเขตของคุณเพื่อดูศูนย์พักพิงและจุดจอดรถฟรีที่มีประกาศในเขตนั้น สถานที่อาจเต็มหรือเปลี่ยนแปลง โปรดโทรสอบถามก่อนเดินทาง",
        },
        links: [
          {
            label: "ลงทะเบียนศูนย์พักพิงนักศึกษาท่าพระจันทร์",
            href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
          },
          {
            label: "เปิด BMA Flood Support",
            href: "https://floodsupport.awarehouse.tech/",
          },
        ],
      },
      {
        id: "sandbags",
        heading: "กระสอบทราย",
        body: [
          "สำนักงานเขตแจกกระสอบทรายให้ครัวเรือนในพื้นที่น้ำท่วม นำบัตรประจำตัวประชาชนไปลงทะเบียน ครัวเรือนละไม่เกิน 20 กระสอบ",
        ],
        items: [
          "บางจุดให้ประชาชนบรรจุทรายใส่กระสอบเอง และเตรียมยานพาหนะมาขนกลับเอง",
          "เวลาและปริมาณอาจเปลี่ยนตามสถานการณ์ โปรดโทรสอบถามสำนักงานเขตหรือสายด่วน 1555 ก่อนเดินทาง",
          "หากเขตของท่านยังไม่มีข้อมูล ให้สอบถามสำนักงานเขต หรือขอรับกระสอบทรายผ่าน Traffy Fondue ใน LINE",
        ],
        districtFinder: {
          kinds: ["sandbags"],
          prompt: "เลือกเขตของคุณเพื่อดูจุดแจกกระสอบทรายในเขตนั้นและเบอร์โทรสำนักงานเขต",
        },
      },
      {
        id: "roads",
        heading: "เส้นทางที่ควรเลี่ยง",
        body: [
          "ถนนที่น้ำท่วมและจุดที่ปิดการจราจรเปลี่ยนแปลงตลอดวัน ก่อนออกเดินทางให้ตรวจสอบหน้าแจ้งเตือนน้ำท่วมของ กทม. ซึ่งเป็นเว็บไซต์ทางการ และปฏิบัติตามคำแนะนำของเจ้าหน้าที่ในพื้นที่ หรือโทร 1555 หรือตรวจสอบผ่าน Traffy Fondue ใน LINE",
        ],
        links: [
          {
            label: "เปิดหน้าแจ้งเตือนน้ำท่วมของ กทม.",
            href: "https://now.bangkok.go.th/flood-alert.html",
          },
        ],
      },
      {
        id: "help",
        heading: "แจ้งเหตุและขอความช่วยเหลือ",
        items: [
          "แจ้งน้ำท่วมขัง ท่อระบายน้ำอุดตัน หรือผู้ที่ต้องการความช่วยเหลือ ผ่าน Traffy Fondue ใน LINE (@Traffyfondue) หรือสายด่วน กทม. 1555",
          "ศูนย์ควบคุมระบบป้องกันน้ำท่วม กทม. โทร 02-248-5115 และติดตามข่าวได้ที่เพจ Facebook ศูนย์ป้องกันน้ำท่วม กทม.",
          "เจ็บป่วยฉุกเฉิน หรือต้องการเคลื่อนย้ายผู้ป่วยที่มีเงื่อนไขทางการแพทย์ โทร 1669",
          "ขอความช่วยเหลือจากสาธารณภัยได้ที่ ปภ. โทร 1784 หรือ LINE @1784DDPM",
          "หากพบสายไฟขาดหรืออุปกรณ์ไฟฟ้ามีประกายไฟ แจ้งการไฟฟ้านครหลวง โทร 1130",
          "เชื่อข่าวน้ำท่วมจาก กทม. กรมอุตุนิยมวิทยา ปภ. และธรรมศาสตร์เท่านั้น ตรวจสอบก่อนแชร์ทุกครั้ง",
          "ถามไถ่เพื่อนและเพื่อนบ้าน โดยเฉพาะนักศึกษาต่างชาติที่อ่านภาษาไทยไม่ได้",
        ],
      },
      {
        id: "disaster-area",
        heading: "ประกาศเขตพื้นที่ประสบสาธารณภัยและการขอรับเงินช่วยเหลือ",
        body: [
          "เมื่อวันที่ 26 กันยายน นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ประกาศให้ทั้ง 50 เขตเป็นเขตพื้นที่ประสบสาธารณภัย ตามพระราชบัญญัติป้องกันและบรรเทาสาธารณภัย พ.ศ. 2550 ขยายจากประกาศเมื่อวันที่ 25 กันยายน ซึ่งครอบคลุมเฉพาะเขตหนองจอก สวนหลวง และคันนายาว ประกาศนี้เปิดทางให้หน่วยงานเข้าช่วยเหลือได้อย่างรวดเร็ว และทำให้ผู้ที่ที่พักเสียหายจากน้ำท่วมยื่นขอรับเงินช่วยเหลือจาก กทม. ได้",
        ],
        steps: [
          "ถ่ายภาพหรือวิดีโอความเสียหายของที่พักและทรัพย์สินไว้ก่อนทำความสะอาด",
          "แจ้งความเสียหายที่สำนักงานเขต เจ้าหน้าที่จะลงพื้นที่สำรวจ",
          "ขอหนังสือรับรองผู้ประสบภัยและบัญชีความเสียหายแนบท้าย (แบบ บส.3) จากสำนักงานเขต โดยสำนักงานเขตต้องระบุว่าเป็นอุทกภัย",
          "ดาวน์โหลดแบบสอบข้อเท็จจริงผู้ประสบอุทกภัยด้านล่าง กรอกให้ครบ แล้วยื่นที่สำนักงานเขตพร้อมเอกสารหลักฐานตามประเภทความช่วยเหลือ",
        ],
        items: [
          "ผู้มีสิทธิคือผู้ที่บ้านหรือที่อยู่อาศัยประจำได้รับความเสียหาย หรือน้ำท่วมถึงพื้นที่พักอาศัย",
          "บ้านเช่า ผู้เช่าเป็นผู้ได้รับสิทธิ",
          "บ้านพักอาศัยหรือบ้านที่มีหลายชั้น ได้รับเฉพาะชั้นที่มีน้ำท่วมถึงเท่านั้น",
          "หากไม่มีทะเบียนบ้านในที่อยู่นั้น เช่น พักอยู่ในหอพัก สำนักงานเขตจะบันทึก ปค.14 เพิ่มเติม",
          "กทม. ยังช่วยเหลือค่าเครื่องใช้ที่จำเป็นในการดำรงชีพ ค่าเครื่องมือประกอบอาชีพ ค่ารักษาพยาบาล และค่าจัดการศพตามอัตราที่กำหนด สอบถามสำนักงานเขต สายด่วน 1555 ศูนย์ป้องกันน้ำท่วม กทม. โทร 02-248-5115 หรือ Traffy Fondue ใน LINE",
        ],
        directoryOpen: true,
        directory: [
          {
            heading: "ค่าซ่อมแซมบ้านหรือที่พักอาศัย",
            places: [
              {
                name: "ไม่เกิน 49,500 บาทต่อหลัง",
                detail:
                  "ตามความเสียหายจริง ช่วยเฉพาะค่าวัสดุซ่อมแซมส่วนที่เป็นโครงสร้างอาคาร ตามแบบฟอร์มที่กำหนด",
              },
              {
                name: "เอกสารหลักฐาน",
                detail:
                  "แบบสอบข้อเท็จจริงผู้ประสบอุทกภัย สำเนาบัตรประจำตัวประชาชน (ยังไม่หมดอายุ) สำเนาทะเบียนบ้าน (ปัจจุบัน) สำเนาโฉนดที่ดินที่ระบุชื่อเจ้าของบ้าน หรือแบบคำร้องแทนโฉนดที่ดิน แบบ บส.3 บันทึก ปค.14 เอกสารประกอบการขอรับความช่วยเหลือค่าวัสดุซ่อมแซม และรูปภาพความเสียหาย",
              },
            ],
          },
          {
            heading: "ค่าที่พักชั่วคราวหรือค่าเช่าบ้าน",
            places: [
              {
                name: "เสียหายบางส่วน",
                detail: "ครอบครัวละไม่เกิน 3,000 บาท",
              },
              {
                name: "เสียหายทั้งหลัง",
                detail: "ครอบครัวละไม่เกิน 3,000 บาทต่อเดือน ไม่เกิน 2 เดือน",
              },
              {
                name: "ผู้มีสิทธิ",
                detail:
                  "เจ้าบ้าน ผู้ครอบครอง หรือผู้เช่า ที่พักอาศัยอยู่จริงเป็นประจำ และที่พักได้รับความเสียหายจากอุทกภัย หรือน้ำท่วมจนไม่สามารถอยู่อาศัยได้",
              },
              {
                name: "เอกสารหลักฐาน",
                detail:
                  "แบบสอบข้อเท็จจริงผู้ประสบอุทกภัย สำเนาบัตรประจำตัวประชาชน (ยังไม่หมดอายุ) แบบ บส.3 บันทึก ปค.14 รูปภาพความเสียหาย และเอกสารอื่น เช่น สัญญาเช่าหรือใบเสร็จค่าเช่า",
              },
            ],
          },
          {
            heading: "ค่าเครื่องใช้ที่จำเป็นในการดำรงชีพ",
            places: [
              { name: "เสียหายบางส่วน", detail: "ครอบครัวละไม่เกิน 1,800 บาท" },
              { name: "เสียหายทั้งหลัง", detail: "ครอบครัวละไม่เกิน 3,800 บาท" },
            ],
          },
        ],
        links: [
          {
            label: "ดาวน์โหลดแบบสอบข้อเท็จจริงผู้ประสบอุทกภัย (PDF)",
            href: "https://drive.google.com/file/d/1NyCZUZ2O9liGVNUOZVB4YayOmh7AV9xW/view",
          },
          {
            label: "อ่านหลักเกณฑ์ช่วยเหลือผู้ประสบอุทกภัยของ กทม.",
            href: "/emergency/bma-flood-relief-2026-09-26.webp",
          },
          {
            label: "อ่านประกาศของ กทม. (ฉบับสแกน)",
            href: "/emergency/bma-disaster-area-2026-09-26.png",
          },
        ],
      },
      {
        id: "safety",
        heading: "ความปลอดภัยเมื่อต้องเจอน้ำท่วม",
        items: [
          "อย่าเดินลุยหรือขับรถผ่านน้ำที่ลึกหรือไหลเชี่ยว หากจำเป็นต้องข้าม ให้ค่อย ๆ เดิน ยึดจับสิ่งที่มั่นคง และหยั่งพื้นข้างหน้าก่อนก้าว",
          "ห้ามสัมผัสสวิตช์ ปลั๊กไฟ หรือเครื่องใช้ไฟฟ้าขณะตัวเปียก และอยู่ห่างจากสายไฟที่ขาด เสาไฟฟ้า และรั้วเหล็กที่แช่อยู่ในน้ำ",
          "สวมรองเท้าบูทและถุงมือยางเมื่อต้องลุยน้ำหรือทำความสะอาด ปิดแผลด้วยพลาสเตอร์กันน้ำ และอาบน้ำฟอกสบู่ทันทีหลังสัมผัสน้ำ",
          "ระวังงูและสัตว์มีพิษที่หนีน้ำเข้ามาอาศัยในบ้าน",
          "หากมีไข้สูง ปวดศีรษะ ปวดน่องหรือปวดหลัง หรือตาแดง ภายในราวสองสัปดาห์หลังลุยน้ำ ให้รีบไปพบแพทย์และแจ้งว่าเคยลุยน้ำท่วม โรคฉี่หนูและโรคไข้ดินพบบ่อยหลังน้ำท่วม",
          "ดื่มน้ำขวดหรือน้ำต้มสุก",
        ],
      },
    ],
  },
};

export default flooding;
