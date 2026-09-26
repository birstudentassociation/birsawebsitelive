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
      "Thammasat classes are online on 28 and 29 September, and this weekend's midterms move to 4 and 11 October. Details are in the Thammasat section below.",
      "Stay at home if you can. The governor has asked people not to travel unless they need to, and expects the water to take two to three days to drain if no more rain falls. Keep out of floodwater and do not drive a small car through flooded roads.",
      "If water is coming into your home, move valuables and your car somewhere higher. If you can reach the main switch from a dry spot, turn the power off.",
      "If you need to leave home, Thammasat students at Tha Prachan can register for the student union shelter in the Student Activities Building. Anyone else can find the nearest shelter on BKK Care Monitor or call 1555.",
      "Report flooding on 1555 or Traffy Fondue on LINE. For a medical emergency or to move a patient, call 1669.",
      "Photograph any damage before you clean up. You will need the photographs to claim help.",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "Thammasat shelter, exams, classes and libraries",
        body: [
          "On 26 September the university postponed this weekend's undergraduate midterm exams and moved classes online on 28 and 29 September. Thammasat University Library has also closed some branches. The library will review the 28 September closures and announce any change on library.tu.ac.th and LINE @lifeonline.",
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
        heading: "Tha Prachan and getting to campus",
        items: [
          "The old town has not flooded so far. At 18:35 on 26 September the canals near Tha Prachan were normal and the road sensors there were dry. The Chao Phraya was 1.96 m at Pak Khlong Talat, below the 2.30 m warning level, and 1.90 m downstream at Sathon, 0.20 m below the 2.10 m warning level.",
          "If you travel in from the north or east, expect flooded roads and long delays, especially around Din Daeng, Ratchadaphisek, Lat Phrao, Phahon Yothin and Ngam Wong Wan. If you do not need to come in, stay at home.",
          "Classes at every campus are online on 28 and 29 September unless your lecturer says a class must be in person. See the Thammasat section.",
          "DDPM has asked Bangkok to watch the Chao Phraya, which is expected to rise towards 29 September. Take care at piers and check express boat services before you travel.",
        ],
      },
      {
        id: "shelters",
        heading: "Shelters and parking",
        body: [
          "Temporary shelters and safe places to park are listed on BKK Care Monitor, the BMA's official help and information page. Check it for the nearest place, or call 1555 or your district office.",
        ],
        items: [
          "The BMA has opened 233 shelters across the city, many of them in schools, with room for about 15,000 people.",
          "Thammasat students at Tha Prachan can stay at the Thammasat University Student Union's temporary shelter in the Student Activities Building. Register first, and see the Thammasat section for contacts.",
        ],
        links: [
          {
            label: "Register for the Tha Prachan student shelter",
            href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
          },
          {
            label: "Open BKK Care Monitor",
            href: "https://script.google.com/macros/s/AKfycbyhm_nEAcAWyv58_k-uhFO0-QyiejXfPygbcOrAgnKd6tT86yn7C76r4ThY9Najwlrf/exec",
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
          "If your district is not listed, ask your district office or request sandbags through Traffy Fondue on LINE.",
        ],
        directory: [
          {
            heading: "Khan Na Yao",
            places: [{ name: "Khan Na Yao District Office (สำนักงานเขตคันนายาว)" }],
            note: "Bring your ID card. Up to 20 bags per household.",
          },
          {
            heading: "Lat Krabang",
            places: [
              { name: "Wat Sutthaphot (วัดสุทธาโภชน์)", detail: "5 truckloads" },
              { name: "Wat Thipphawat (วัดทิพพาวาส)", detail: "5 truckloads" },
              { name: "Wat Khum Thong (วัดขุมทอง)", detail: "5 truckloads" },
              { name: "Wat Ratchakosa (วัดราชโกษา)", detail: "5 truckloads" },
              { name: "Wat Sangkharacha (วัดสังฆราชา)", detail: "5 truckloads" },
              { name: "Surao Thap Yao (สุเหร่าทับยาว)", detail: "3 truckloads" },
              {
                name: "Lat Krabang District Office (สำนักงานเขตลาดกระบัง)",
                detail: "8 truckloads",
              },
            ],
            note: "Delivered on 26 September. Bring your ID card, up to 20 bags per household. Fill the bags yourself and bring your own vehicle.",
          },
          {
            heading: "Watthana",
            places: [{ name: "Watthana District Office (สำนักงานเขตวัฒนา)" }],
            phones: [{ phone: "02-381-3107" }],
            note: "Up to 20 bags per household. Call to ask, or use Traffy Fondue on LINE.",
          },
        ],
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
        ],
      },
      {
        id: "disaster-area",
        heading: "The disaster declaration and claiming help",
        body: [
          "On 26 September Governor Chadchart Sittipunt declared all 50 districts a disaster area under the Disaster Prevention and Mitigation Act 2007, extending the 25 September declaration for Nong Chok, Suan Luang and Khan Na Yao. It lets government agencies act quickly and is the basis for help to people affected.",
        ],
        items: [
          "Photograph damage to your home and belongings before you clean up.",
          "Ask your district office how to apply for help.",
        ],
        links: [
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
      "ธรรมศาสตร์ให้เรียนออนไลน์วันที่ 28 และ 29 กันยายน และเลื่อนสอบกลางภาคในสุดสัปดาห์นี้ไปเป็นวันที่ 4 และ 11 ตุลาคม ดูรายละเอียดในหัวข้อธรรมศาสตร์ด้านล่าง",
      "หากไม่มีธุระจำเป็น ให้อยู่ในบ้านตามที่ผู้ว่าราชการกรุงเทพมหานครขอความร่วมมือ ผู้ว่าฯ คาดว่าหากไม่มีฝนตกเพิ่ม จะใช้เวลาราว 2 ถึง 3 วันในการระบายน้ำ หลีกเลี่ยงการลุยน้ำ และอย่าขับรถเล็กผ่านถนนที่น้ำท่วม",
      "หากน้ำเริ่มเข้าบ้าน ให้ยกทรัพย์สินมีค่าขึ้นที่สูงและย้ายรถไปจอดในที่สูง หากเอื้อมถึงคัตเอาต์หรือเบรกเกอร์หลักได้จากจุดที่แห้ง ให้ตัดไฟ",
      "หากต้องออกจากบ้าน นักศึกษาธรรมศาสตร์ท่าพระจันทร์ลงทะเบียนเข้าพักศูนย์พักพิงของ อมธ. ท่าพระจันทร์ ณ ตึกกิจกรรมนักศึกษาได้ ส่วนผู้อื่นค้นหาศูนย์พักพิงที่ใกล้ที่สุดใน BKK Care Monitor หรือโทร 1555",
      "แจ้งเหตุน้ำท่วมได้ที่สายด่วน 1555 หรือ Traffy Fondue ใน LINE หากเจ็บป่วยฉุกเฉินหรือต้องเคลื่อนย้ายผู้ป่วย โทร 1669",
      "ถ่ายภาพความเสียหายไว้ก่อนทำความสะอาด เพื่อใช้เป็นหลักฐานขอรับความช่วยเหลือ",
    ],
    sections: [
      {
        id: "thammasat",
        heading: "ธรรมศาสตร์ ศูนย์พักพิง การสอบ การเรียน และห้องสมุด",
        body: [
          "เมื่อวันที่ 26 กันยายน มหาวิทยาลัยธรรมศาสตร์ประกาศเลื่อนการสอบกลางภาคของหลักสูตรระดับปริญญาตรีในสุดสัปดาห์นี้ และให้เรียนออนไลน์ในวันที่ 28 และ 29 กันยายน ส่วนหอสมุดแห่งมหาวิทยาลัยธรรมศาสตร์ปิดให้บริการห้องสมุดบางแห่งชั่วคราว และจะประเมินสถานการณ์สำหรับวันที่ 28 กันยายนอีกครั้ง หากมีการเปลี่ยนแปลงจะแจ้งทาง library.tu.ac.th และ LINE @lifeonline",
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
        heading: "ท่าพระจันทร์และการเดินทางมามหาวิทยาลัย",
        items: [
          "ย่านเมืองเก่ายังไม่มีน้ำท่วม ข้อมูล ณ เวลา 18.35 น. วันที่ 26 กันยายน ระดับน้ำในคลองใกล้ท่าพระจันทร์ยังปกติ และจุดวัดน้ำบนถนนยังไม่มีน้ำขัง ระดับแม่น้ำเจ้าพระยาที่ปากคลองตลาดอยู่ที่ 1.96 ม. ต่ำกว่าระดับเตือนภัย 2.30 ม. ส่วนที่สาทรซึ่งอยู่ท้ายน้ำอยู่ที่ 1.90 ม. ต่ำกว่าระดับเตือนภัย 2.10 ม. อยู่ 0.20 ม.",
          "หากเดินทางมาจากทางเหนือหรือตะวันออก ให้เผื่อเวลาเพราะถนนหลายสายน้ำท่วมและรถติดหนัก โดยเฉพาะย่านดินแดง รัชดาภิเษก ลาดพร้าว พหลโยธิน และงามวงศ์วาน หากไม่มีธุระจำเป็นต้องมามหาวิทยาลัย ควรอยู่ในบ้าน",
          "วันที่ 28 และ 29 กันยายน ทุกศูนย์การศึกษาเรียนออนไลน์ เว้นแต่อาจารย์ผู้สอนแจ้งว่ารายวิชาใดต้องเรียนในชั้นเรียน ดูรายละเอียดในหัวข้อธรรมศาสตร์",
          "ปภ. ให้กรุงเทพฯ เฝ้าระวังระดับน้ำในแม่น้ำเจ้าพระยาซึ่งคาดว่าจะสูงขึ้นจนถึงราววันที่ 29 กันยายน ระวังเมื่ออยู่ที่ท่าเรือ และตรวจสอบการเดินเรือด่วนก่อนออกเดินทาง",
        ],
      },
      {
        id: "shelters",
        heading: "ศูนย์พักพิงและที่จอดรถ",
        body: [
          "ศูนย์พักพิงชั่วคราวและจุดจอดรถที่ปลอดภัยรวบรวมไว้ที่ BKK Care Monitor ศูนย์ช่วยเหลือและอำนวยความสะดวกประชาชน เว็บไซต์ทางการของ กทม. ตรวจสอบจุดที่ใกล้ที่สุดได้ที่นั่น หรือโทร 1555 หรือติดต่อสำนักงานเขต",
        ],
        items: [
          "กทม. เปิดศูนย์พักพิง 233 แห่งทั่วกรุงเทพฯ หลายแห่งอยู่ในโรงเรียน รองรับได้ราว 15,000 คน",
          "นักศึกษาธรรมศาสตร์ท่าพระจันทร์เข้าพักได้ที่ศูนย์พักพิงชั่วคราวของ อมธ. ท่าพระจันทร์ ณ ตึกกิจกรรมนักศึกษา โปรดลงทะเบียนก่อน และดูช่องทางติดต่อในหัวข้อธรรมศาสตร์",
        ],
        links: [
          {
            label: "ลงทะเบียนศูนย์พักพิงนักศึกษาท่าพระจันทร์",
            href: "https://docs.google.com/forms/d/e/1FAIpQLSdG_isowlNPt9vbbw5rK4ieJZbDvrTNeoJ_hgdt7uebXhVbjg/viewform",
          },
          {
            label: "เปิด BKK Care Monitor",
            href: "https://script.google.com/macros/s/AKfycbyhm_nEAcAWyv58_k-uhFO0-QyiejXfPygbcOrAgnKd6tT86yn7C76r4ThY9Najwlrf/exec",
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
          "หากไม่มีเขตของท่านในรายการ ให้สอบถามสำนักงานเขต หรือขอรับกระสอบทรายผ่าน Traffy Fondue ใน LINE",
        ],
        directory: [
          {
            heading: "เขตคันนายาว",
            places: [{ name: "สำนักงานเขตคันนายาว" }],
            note: "นำบัตรประจำตัวประชาชนมาลงทะเบียน ครัวเรือนละ 20 กระสอบ",
          },
          {
            heading: "เขตลาดกระบัง",
            places: [
              { name: "วัดสุทธาโภชน์", detail: "5 คัน" },
              { name: "วัดทิพพาวาส", detail: "5 คัน" },
              { name: "วัดขุมทอง", detail: "5 คัน" },
              { name: "วัดราชโกษา", detail: "5 คัน" },
              { name: "วัดสังฆราชา", detail: "5 คัน" },
              { name: "สุเหร่าทับยาว", detail: "3 คัน" },
              { name: "สำนักงานเขตลาดกระบัง", detail: "8 คัน" },
            ],
            note: "จัดส่งวันที่ 26 กันยายน นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง",
          },
          {
            heading: "เขตวัฒนา",
            places: [{ name: "สำนักงานเขตวัฒนา" }],
            phones: [{ phone: "02-381-3107" }],
            note: "ครัวเรือนละ 20 กระสอบ โทรติดต่อขอรับ หรือแจ้งผ่าน Traffy Fondue ใน LINE",
          },
        ],
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
        ],
      },
      {
        id: "disaster-area",
        heading: "ประกาศเขตพื้นที่ประสบสาธารณภัยและการขอรับความช่วยเหลือ",
        body: [
          "เมื่อวันที่ 26 กันยายน นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ประกาศให้ทั้ง 50 เขตเป็นเขตพื้นที่ประสบสาธารณภัย ตามพระราชบัญญัติป้องกันและบรรเทาสาธารณภัย พ.ศ. 2550 ขยายจากประกาศเมื่อวันที่ 25 กันยายน ซึ่งครอบคลุมเฉพาะเขตหนองจอก สวนหลวง และคันนายาว ประกาศนี้เปิดทางให้หน่วยงานเข้าช่วยเหลือได้อย่างรวดเร็ว และใช้เป็นฐานในการให้ความช่วยเหลือผู้ได้รับผลกระทบ",
        ],
        items: [
          "ถ่ายภาพความเสียหายของที่พักและทรัพย์สินไว้ก่อนทำความสะอาด",
          "สอบถามสำนักงานเขตเรื่องขั้นตอนการยื่นขอรับความช่วยเหลือ",
        ],
        links: [
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
