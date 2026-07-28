/**
 * Two topics that both sit under the "life" group: settling in, and money.
 *
 * `settle-in` is the topic where the `origin` fact does the most work in the
 * whole service. An international student arriving from abroad and a Thai
 * student already living in Bangkok are sorting out genuinely different
 * things in their first weeks, so `q-settle-need` uses `skipWhen` to route
 * straight past the question when `origin` is already known, the way
 * `docs/EDITING.md`'s "one test to apply to every sentence" asks every
 * sentence to earn its place: a reader who has already told us where they
 * are coming from should never be asked again.
 *
 * Several of the international guides this topic draws on
 * (`content/student-life/en/international/visa-and-immigration.mdx`,
 * `banking-and-money.mdx`, and the phrase table in `culture-and-language.mdx`)
 * carry a placeholder Notice marking their specifics as unverified. Outcomes
 * built on those sections say so plainly, point at the guide and at the
 * office that actually decides, and never state a procedure as settled.
 * `visa-and-immigration.mdx` also says outright that it is general
 * orientation, not legal advice; every visa outcome here repeats that.
 *
 * `money-and-fees` is more settled ground: tuition figures come from
 * `content/student-life/en/handbook/admission-and-fees.mdx`, discounts and
 * refund mechanics from `content/student-life/en/home/money-matters.mdx`,
 * and the monthly cost ranges from `content/student-life/en/home/food-and-budgeting.mdx`,
 * whose "rough monthly budget" table is itself marked example guidance
 * pending verification, so that outcome carries the same caveat forward.
 * No page on the site states an exact fee due date, so `out-money-fees` does
 * not invent one; it says so and points to the Registrar and TU Greats.
 */
import type { SmartAnswerService } from "../types";

export const living: SmartAnswerService = {
  topics: [
    {
      slug: "settle-in",
      title: {
        en: "Settle in",
        th: "การตั้งตัว",
      },
      lede: {
        en: "Visas, arrival, banking, phones, health cover and the campus basics, in one place.",
        th: "วีซ่า การเดินทางมาถึง บัญชีธนาคาร โทรศัพท์ ประกันสุขภาพ และเรื่องพื้นฐานในมหาวิทยาลัย รวมไว้ในที่เดียว",
      },
      group: "life",
      start: "q-settle-need",
      whatYoullNeed: [
        {
          en: "Whether you're arriving from abroad or already in Thailand",
          th: "คุณมาจากต่างประเทศหรืออยู่ในไทยอยู่แล้ว",
        },
      ],
      keywords: [
        "visa",
        "immigration",
        "90-day",
        "bank account",
        "sim card",
        "wifi",
        "insurance",
        "arrival",
        "settle in",
        "วีซ่า",
        "บัญชีธนาคาร",
        "ซิม",
        "ประกันสุขภาพ",
        "ตั้งตัว",
      ],
      spotlightWhen: {
        any: [
          { fact: "origin", is: "international" },
          { fact: "stage", is: "starting" },
        ],
      },
    },
    {
      slug: "money-and-fees",
      title: {
        en: "Money and fees",
        th: "เรื่องเงินและค่าเล่าเรียน",
      },
      lede: {
        en: "Tuition, what a month actually costs, student discounts, and where to go if paying is difficult.",
        th: "ค่าเล่าเรียน ค่าใช้จ่ายรายเดือน ส่วนลดนักศึกษา และช่องทางเมื่อจ่ายเงินลำบาก",
      },
      group: "life",
      start: "q-money-need",
      whatYoullNeed: [
        {
          en: "Nothing, just what you want to know about",
          th: "ไม่ต้องเตรียมอะไร แค่รู้ว่าอยากถามเรื่องไหน",
        },
      ],
      keywords: [
        "tuition",
        "fees",
        "budget",
        "cost of living",
        "discount",
        "refund",
        "deferral",
        "ค่าเล่าเรียน",
        "ค่าธรรมเนียม",
        "งบประมาณ",
        "ส่วนลด",
        "คืนเงิน",
      ],
    },
  ],

  nodes: [
    /* ================================================================ */
    /* settle-in                                                         */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-settle-need",
      question: {
        en: "Which of these is closer to your situation?",
        th: "ข้อไหนตรงกับสถานการณ์ของคุณมากกว่ากัน",
      },
      hint: {
        en: "This changes what we ask next, so answer honestly even if neither fits perfectly.",
        th: "คำตอบนี้มีผลต่อคำถามถัดไป ตอบตามจริงแม้จะไม่ตรงเป๊ะทั้งสองข้อ",
      },
      skipWhen: [
        { when: { fact: "origin", is: "international" }, option: "abroad" },
        { when: { fact: "origin", is: "thai" }, option: "campus" },
      ],
      options: [
        {
          id: "abroad",
          label: {
            en: "I'm coming to BIR from abroad, or arrived recently and still need to sort out a visa, bank account, phone line or health cover",
            th: "จะมาเรียน BIR จากต่างประเทศ หรือเพิ่งมาถึงและยังต้องจัดการเรื่องวีซ่า บัญชีธนาคาร เบอร์โทรศัพท์ หรือประกันสุขภาพ",
          },
          next: "q-settle-abroad-topic",
          set: { origin: "international" },
        },
        {
          id: "campus",
          label: {
            en: "I'm already based in Thailand and need to get set up on campus: student card, wifi, accounts",
            th: "อยู่ในไทยอยู่แล้ว และต้องการตั้งตัวในมหาวิทยาลัย เช่น บัตรนักศึกษา wifi และบัญชีต่าง ๆ",
          },
          next: "out-settle-campus",
          set: { origin: "thai" },
        },
        {
          id: "other",
          label: {
            en: "Something else about settling in",
            th: "เรื่องอื่นเกี่ยวกับการตั้งตัว",
          },
          next: "out-contact-birsa",
        },
      ],
    },

    {
      kind: "question",
      id: "q-settle-abroad-topic",
      question: {
        en: "What do you need first?",
        th: "อยากรู้เรื่องไหนก่อน",
      },
      options: [
        {
          id: "visa",
          label: { en: "Visa and immigration", th: "วีซ่าและการเข้าเมือง" },
          next: "q-settle-visa",
        },
        {
          id: "arrival",
          label: {
            en: "Getting from the airport, and the first week",
            th: "การเดินทางจากสนามบิน และสัปดาห์แรก",
          },
          next: "out-settle-arrival",
        },
        {
          id: "banking",
          label: { en: "Opening a Thai bank account", th: "เปิดบัญชีธนาคารไทย" },
          next: "out-settle-banking",
        },
        {
          id: "phone",
          label: { en: "Phone and internet", th: "โทรศัพท์และอินเทอร์เน็ต" },
          next: "out-settle-phone",
        },
        {
          id: "health",
          label: { en: "Health cover and insurance", th: "ประกันสุขภาพ" },
          next: "out-settle-health",
        },
        {
          id: "culture",
          label: { en: "Thai culture and language basics", th: "วัฒนธรรมและภาษาไทยเบื้องต้น" },
          next: "out-settle-culture",
        },
      ],
    },

    {
      kind: "question",
      id: "q-settle-visa",
      question: {
        en: "What do you need about your visa?",
        th: "อยากรู้เรื่องวีซ่าด้านไหน",
      },
      options: [
        {
          id: "reporting",
          label: { en: "90-day address reporting", th: "การรายงานตัวทุก 90 วัน" },
          next: "out-settle-visa-90day",
        },
        {
          id: "reentry",
          label: {
            en: "A re-entry permit before travelling",
            th: "การขอใบอนุญาตกลับเข้าประเทศก่อนเดินทาง",
          },
          next: "out-settle-visa-reentry",
        },
        {
          id: "extend",
          label: { en: "Extending your visa", th: "การต่อวีซ่า" },
          next: "out-settle-visa-extension",
        },
        {
          id: "general",
          label: {
            en: "I'm just starting out and want the basics",
            th: "เพิ่งเริ่มต้น อยากรู้ภาพรวมก่อน",
          },
          next: "out-settle-visa-general",
        },
      ],
    },

    /* ---- settle-in outcomes: visa ------------------------------------ */

    {
      kind: "outcome",
      id: "out-settle-visa-general",
      title: {
        en: "The Non-Immigrant ED visa, in outline",
        th: "ภาพรวมวีซ่านักเรียนประเภท Non-Immigrant ED",
      },
      summary: {
        en: 'Most degree-seeking international students study on a Non-Immigrant "ED" (education) visa, tied to your enrolment at the university. TU International Affairs is your main point of contact for the paperwork it requires.',
        th: "นักศึกษาต่างชาติส่วนใหญ่เรียนด้วยวีซ่านักเรียนประเภท Non-Immigrant ED ซึ่งผูกกับสถานะการลงทะเบียนเรียน ฝ่ายกิจการนักศึกษาต่างชาติของธรรมศาสตร์ (TU International Affairs) เป็นจุดติดต่อหลักสำหรับเอกสารที่เกี่ยวข้อง",
      },
      owner: {
        en: "TU International Affairs and the Thai Immigration Bureau, not BIRSA.",
        th: "ฝ่ายกิจการนักศึกษาต่างชาติของธรรมศาสตร์และสำนักงานตรวจคนเข้าเมือง ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "This is general orientation, not legal advice. Immigration rules and procedures change, so confirm current requirements with TU International Affairs or the Immigration Bureau before you act.",
            th: "เนื้อหานี้เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางกฎหมาย กฎและขั้นตอนด้านการเข้าเมืองเปลี่ยนแปลงได้ ควรตรวจสอบข้อกำหนดล่าสุดกับฝ่ายกิจการนักศึกษาต่างชาติหรือสำนักงานตรวจคนเข้าเมืองก่อนดำเนินการ",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "TU International Affairs issues the supporting letters your visa and extension applications need.",
            th: "ฝ่ายกิจการนักศึกษาต่างชาติเป็นผู้ออกหนังสือรับรองที่ใช้ประกอบการยื่นขอวีซ่าและการต่อวีซ่า",
          },
        },
        {
          kind: "steps",
          title: { en: "Staying on top of it", th: "สิ่งที่ควรทำไว้ล่วงหน้า" },
          items: [
            {
              en: "Keep photocopies, and photos on your phone, of your passport, visa page and departure card at all times.",
              th: "พกสำเนา และถ่ายรูปเก็บไว้ในโทรศัพท์ ของหนังสือเดินทาง หน้าวีซ่า และบัตร ตม. 6 ไว้ตลอดเวลา",
            },
            {
              en: "Set calendar reminders well ahead of your 90-day and extension deadlines, not on the due date itself.",
              th: "ตั้งเตือนในปฏิทินล่วงหน้าก่อนถึงกำหนดรายงานตัว 90 วันและวันต่อวีซ่า ไม่ใช่ตั้งเตือนวันสุดท้าย",
            },
            {
              en: "Ask TU International Affairs when in doubt. Individual circumstances and rules can differ.",
              th: "หากไม่แน่ใจ ให้สอบถามฝ่ายกิจการนักศึกษาต่างชาติ เพราะแต่ละกรณีอาจมีรายละเอียดต่างกัน",
            },
          ],
        },
      ],
      actions: [
        {
          label: { en: "Visa and immigration guide", th: "คู่มือวีซ่าและการเข้าเมือง" },
          href: "/student-life/international/visa-and-immigration",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-settle-visa-90day",
      title: {
        en: "90-day address reporting",
        th: "การรายงานตัวทุก 90 วัน",
      },
      summary: {
        en: "If you stay in Thailand continuously, immigration law requires you to report your address every 90 days. It is a routine notification, not a new visa application, but missing the deadline can bring a fine.",
        th: "หากอยู่ในไทยต่อเนื่อง กฎหมายตรวจคนเข้าเมืองกำหนดให้รายงานที่อยู่ทุก 90 วัน ถือเป็นการแจ้งตามปกติ ไม่ใช่การขอวีซ่าใหม่ แต่หากพลาดกำหนดอาจมีค่าปรับ",
      },
      owner: {
        en: "TU International Affairs and the Thai Immigration Bureau, not BIRSA.",
        th: "ฝ่ายกิจการนักศึกษาต่างชาติของธรรมศาสตร์และสำนักงานตรวจคนเข้าเมือง ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "General orientation, not legal advice. Confirm the current process with TU International Affairs or your local immigration office.",
            th: "เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางกฎหมาย ควรตรวจสอบขั้นตอนล่าสุดกับฝ่ายกิจการนักศึกษาต่างชาติหรือสำนักงานตรวจคนเข้าเมืองในพื้นที่",
          },
        },
        {
          kind: "steps",
          title: { en: "How reporting usually works", th: "ช่องทางการรายงานตัวที่ใช้กันทั่วไป" },
          items: [
            {
              en: "Reporting in person at an immigration office.",
              th: "ไปรายงานตัวด้วยตนเองที่สำนักงานตรวจคนเข้าเมือง",
            },
            {
              en: "Reporting online, where available.",
              th: "รายงานตัวออนไลน์ ในกรณีที่เปิดให้บริการ",
            },
            {
              en: "Some universities help coordinate group reporting for students, so ask TU International Affairs whether this is offered.",
              th: "บางมหาวิทยาลัยช่วยประสานการรายงานตัวเป็นกลุ่มให้นักศึกษา ลองสอบถามฝ่ายกิจการนักศึกษาต่างชาติว่ามีบริการนี้หรือไม่",
            },
          ],
        },
      ],
      actions: [
        {
          label: { en: "Visa and immigration guide", th: "คู่มือวีซ่าและการเข้าเมือง" },
          href: "/student-life/international/visa-and-immigration",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-settle-visa-reentry",
      title: {
        en: "Re-entry permits before you travel",
        th: "ใบอนุญาตกลับเข้าประเทศก่อนเดินทาง",
      },
      summary: {
        en: "If you plan to travel outside Thailand and return on the same visa, you need a re-entry permit before you leave. Without one, your visa may be cancelled the moment you exit the country.",
        th: "หากจะเดินทางออกนอกประเทศไทยและกลับมาด้วยวีซ่าเดิม ต้องขอใบอนุญาตกลับเข้าประเทศก่อนออกเดินทาง ไม่เช่นนั้นวีซ่าอาจถูกยกเลิกทันทีที่ออกนอกประเทศ",
      },
      owner: {
        en: "The Thai Immigration Bureau, not BIRSA.",
        th: "สำนักงานตรวจคนเข้าเมือง ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "General orientation, not legal advice. Confirm the current process with TU International Affairs or an immigration office before you book travel.",
            th: "เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางกฎหมาย ควรตรวจสอบขั้นตอนล่าสุดกับฝ่ายกิจการนักศึกษาต่างชาติหรือสำนักงานตรวจคนเข้าเมืองก่อนจองการเดินทาง",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "Re-entry permits can usually be arranged at the airport or at an immigration office before departure. Plan this ahead of any trip home or regional travel.",
            th: "โดยทั่วไปสามารถขอใบอนุญาตกลับเข้าประเทศได้ที่สนามบินหรือสำนักงานตรวจคนเข้าเมืองก่อนเดินทาง ควรวางแผนล่วงหน้าก่อนกลับบ้านหรือเดินทางในภูมิภาค",
          },
        },
      ],
      actions: [
        {
          label: { en: "Visa and immigration guide", th: "คู่มือวีซ่าและการเข้าเมือง" },
          href: "/student-life/international/visa-and-immigration",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-settle-visa-extension",
      title: {
        en: "Extending your visa",
        th: "การต่อวีซ่า",
      },
      summary: {
        en: "Student visas typically need periodic extension to remain valid for the length of your programme. Extensions are usually processed at an immigration office, though requirements and locations can change.",
        th: "วีซ่านักเรียนมักต้องต่ออายุเป็นระยะตลอดหลักสูตร โดยทั่วไปดำเนินการที่สำนักงานตรวจคนเข้าเมือง แต่เอกสารและสถานที่อาจเปลี่ยนแปลงได้",
      },
      owner: {
        en: "The Thai Immigration Bureau, not BIRSA.",
        th: "สำนักงานตรวจคนเข้าเมือง ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "General orientation, not legal advice. For Bangkok-based students this often means Chaeng Watthana Government Complex, but confirm the current location and document list with TU International Affairs before you go.",
            th: "เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางกฎหมาย สำหรับนักศึกษาในกรุงเทพฯ มักดำเนินการที่ศูนย์ราชการแจ้งวัฒนะ แต่ควรตรวจสอบสถานที่และเอกสารล่าสุดกับฝ่ายกิจการนักศึกษาต่างชาติก่อนไปติดต่อ",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "Bring every document your university tells you to bring. Incomplete applications are the most common cause of delay.",
            th: "เตรียมเอกสารทุกอย่างตามที่มหาวิทยาลัยแจ้งให้ครบ เอกสารไม่ครบเป็นสาเหตุที่พบบ่อยที่สุดของความล่าช้า",
          },
        },
      ],
      actions: [
        {
          label: { en: "Visa and immigration guide", th: "คู่มือวีซ่าและการเข้าเมือง" },
          href: "/student-life/international/visa-and-immigration",
        },
      ],
      contactCategory: "question",
    },

    /* ---- settle-in outcomes: arrival, banking, phone, health, culture */

    {
      kind: "outcome",
      id: "out-settle-arrival",
      title: {
        en: "Getting from the airport, and the first week",
        th: "การเดินทางจากสนามบิน และสัปดาห์แรก",
      },
      summary: {
        en: 'Bangkok has two main airports, Suvarnabhumi (BKK) and Don Mueang (DMK). Tha Prachan sits in the old city near the river, so tell your driver "Thammasat, Tha Prachan campus" rather than just "Thammasat," which has multiple campuses.',
        th: 'กรุงเทพฯ มีสนามบินหลักสองแห่งคือสุวรรณภูมิ (BKK) และดอนเมือง (DMK) ท่าพระจันทร์อยู่ในเขตเมืองเก่าริมแม่น้ำ บอกคนขับว่า "ธรรมศาสตร์ ท่าพระจันทร์" แทนที่จะพูดแค่ "ธรรมศาสตร์" เพราะมีหลายวิทยาเขต',
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "From either airport: an airport rail link plus connections is fast and predictable from Suvarnabhumi but needs a change to reach the old city; a taxi or ride-hailing app is simplest with luggage (agree to use the meter, or confirm the fare in-app, before starting); or a pre-arranged pickup if your accommodation or a senior student can arrange one.",
            th: "จากสนามบินทั้งสองแห่ง เลือกได้ทั้งรถไฟฟ้าเชื่อมสนามบินต่อรถอื่น ซึ่งเร็วและคาดการณ์เวลาได้จากสุวรรณภูมิแต่ต้องต่อรถเข้าเมืองเก่า หรือแท็กซี่/แอปเรียกรถ ซึ่งสะดวกที่สุดเมื่อมีสัมภาระเยอะ (ให้กดมิเตอร์หรือยืนยันค่าโดยสารในแอปก่อนออกรถ) หรือให้ที่พักหรือรุ่นพี่ช่วยจัดรถมารับ",
          },
        },
        {
          kind: "steps",
          title: {
            en: "What to set up first, roughly in this order",
            th: "สิ่งที่ควรจัดการก่อน เรียงตามลำดับคร่าว ๆ",
          },
          items: [
            {
              en: "Confirm your accommodation and get the keys or access sorted.",
              th: "ยืนยันที่พักและรับกุญแจหรือสิทธิ์เข้าออก",
            },
            {
              en: "Get a local SIM card so you have data and a Thai number.",
              th: "ซื้อซิมการ์ดในไทยเพื่อให้มีอินเทอร์เน็ตและเบอร์โทรไทย",
            },
            {
              en: "Register with TU International Affairs and complete any arrival paperwork they require.",
              th: "ลงทะเบียนกับฝ่ายกิจการนักศึกษาต่างชาติและดำเนินเอกสารที่กำหนดเมื่อมาถึง",
            },
            {
              en: "Open a Thai bank account once you have the necessary documents.",
              th: "เปิดบัญชีธนาคารไทยเมื่อมีเอกสารครบ",
            },
            {
              en: "Walk the route from your accommodation to campus at least once before your first class.",
              th: "เดินสำรวจเส้นทางจากที่พักไปมหาวิทยาลัยอย่างน้อยหนึ่งครั้งก่อนเปิดเรียนวันแรก",
            },
            {
              en: "Save key numbers: campus security, your programme office, and BIRSA's contact.",
              th: "บันทึกเบอร์สำคัญไว้ เช่น รักษาความปลอดภัยในมหาวิทยาลัย สำนักงานโครงการ และช่องทางติดต่อ BIRSA",
            },
          ],
        },
        {
          kind: "steps",
          title: { en: "First week checklist", th: "รายการที่ควรทำในสัปดาห์แรก" },
          items: [
            {
              en: "Attend orientation sessions run by TU International Affairs and/or BIR.",
              th: "เข้าร่วมปฐมนิเทศที่จัดโดยฝ่ายกิจการนักศึกษาต่างชาติและ/หรือ BIR",
            },
            {
              en: "Locate your faculty building and where your classes are held.",
              th: "หาตำแหน่งอาคารคณะและห้องเรียนของคุณ",
            },
            {
              en: "Meet your academic advisor or programme coordinator if introduced.",
              th: "พบอาจารย์ที่ปรึกษาหรือผู้ประสานงานหลักสูตร หากมีการแนะนำตัว",
            },
            {
              en: "Join BIRSA's channels for events and updates.",
              th: "เข้าร่วมช่องทางของ BIRSA เพื่อติดตามกิจกรรมและข่าวสาร",
            },
            {
              en: "Identify the nearest pharmacy, hospital, and grocery store to where you live.",
              th: "หาร้านขายยา โรงพยาบาล และร้านของชำที่ใกล้ที่พักที่สุด",
            },
            {
              en: "Note your visa's 90-day reporting deadline.",
              th: "จดกำหนดรายงานตัว 90 วันของวีซ่าไว้",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "BIRSA runs welcome events for new students to meet each other, international and home students alike. TU International Affairs handles visa and enrolment issues; BIRSA can help you find your feet socially and point you to the right office if you are not sure who to ask.",
            th: "BIRSA จัดกิจกรรมต้อนรับให้นักศึกษาใหม่ได้รู้จักกัน ทั้งนักศึกษาต่างชาติและนักศึกษาไทย ฝ่ายกิจการนักศึกษาต่างชาติดูแลเรื่องวีซ่าและการลงทะเบียน ส่วน BIRSA ช่วยเรื่องการปรับตัวทางสังคมและช่วยชี้ช่องทางติดต่อหน่วยงานที่ถูกต้องหากไม่แน่ใจว่าต้องถามใคร",
          },
        },
      ],
      owner: {
        en: "TU International Affairs handles visa and enrolment issues; BIRSA cannot resolve those directly.",
        th: "ฝ่ายกิจการนักศึกษาต่างชาติดูแลเรื่องวีซ่าและการลงทะเบียน BIRSA ไม่สามารถจัดการเรื่องเหล่านี้ให้ได้โดยตรง",
      },
      actions: [
        {
          label: { en: "Arrival and first week guide", th: "คู่มือการเดินทางมาถึงและสัปดาห์แรก" },
          href: "/student-life/international/arrival-and-first-week",
        },
      ],
      related: [
        {
          label: { en: "What's on", th: "กิจกรรมที่กำลังจะจัดขึ้น" },
          href: "/news",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-settle-banking",
      title: {
        en: "Opening a Thai bank account",
        th: "เปิดบัญชีธนาคารไทย",
      },
      summary: {
        en: "Most day-to-day payments in Thailand run through a local bank account, directly or via linked apps. Requirements vary by bank and sometimes by branch.",
        th: "การใช้จ่ายในชีวิตประจำวันในไทยส่วนใหญ่ทำผ่านบัญชีธนาคารในประเทศ ไม่ว่าจะโดยตรงหรือผ่านแอปที่เชื่อมกับบัญชี ข้อกำหนดของแต่ละธนาคารและแต่ละสาขาอาจแตกต่างกัน",
      },
      owner: {
        en: "The bank decides what it needs to open an account, not BIRSA. TU International Affairs can clarify what the university can issue on your behalf.",
        th: "ธนาคารเป็นผู้กำหนดเอกสารที่ต้องใช้เปิดบัญชี ไม่ใช่ BIRSA ฝ่ายกิจการนักศึกษาต่างชาติช่วยชี้แจงได้ว่ามหาวิทยาลัยออกเอกสารใดให้ได้บ้าง",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "This document list is an example BIRSA has not yet verified. Confirm exactly what your chosen bank and branch need before you go.",
            th: "รายการเอกสารนี้เป็นตัวอย่างที่ BIRSA ยังไม่ได้ตรวจสอบยืนยัน ควรสอบถามธนาคารและสาขาที่จะไปใช้บริการโดยตรงว่าต้องใช้เอกสารอะไรบ้าง",
          },
        },
        {
          kind: "steps",
          title: { en: "Documents banks typically ask for", th: "เอกสารที่ธนาคารมักขอ" },
          items: [
            {
              en: "Passport, the original plus a photocopy.",
              th: "หนังสือเดินทางตัวจริงพร้อมสำเนา",
            },
            {
              en: "The visa page showing your Non-Immigrant ED status.",
              th: "หน้าวีซ่าที่แสดงสถานะ Non-Immigrant ED",
            },
            {
              en: "A letter confirming enrolment from the university or faculty.",
              th: "หนังสือรับรองการเป็นนักศึกษาจากมหาวิทยาลัยหรือคณะ",
            },
            {
              en: "Proof of address in Thailand, sometimes a dorm or landlord letter.",
              th: "หลักฐานที่อยู่ในไทย บางกรณีเป็นหนังสือรับรองจากหอพักหรือเจ้าของบ้าน",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "Ask other international students or TU International Affairs which branches near Tha Prachan process student applications most often. PromptPay, Thailand's national instant-payment system, links to your phone number once your account supports it, and lets you send and receive money instantly, split bills, and pay by scanning a QR code.",
            th: "ลองสอบถามนักศึกษาต่างชาติรุ่นก่อนหรือฝ่ายกิจการนักศึกษาต่างชาติว่าสาขาไหนใกล้ท่าพระจันทร์ที่รับเปิดบัญชีให้นักศึกษาบ่อยที่สุด พร้อมเพย์ ระบบโอนเงินด่วนของไทย ผูกกับเบอร์โทรศัพท์เมื่อบัญชีรองรับแล้ว ใช้โอนเงินได้ทันที หารบิล หรือจ่ายด้วยการสแกน QR code",
          },
        },
      ],
      actions: [
        {
          label: { en: "Banking and money guide", th: "คู่มือธนาคารและการเงิน" },
          href: "/student-life/international/banking-and-money",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-settle-phone",
      title: {
        en: "Phone and internet",
        th: "โทรศัพท์และอินเทอร์เน็ต",
      },
      summary: {
        en: "A working Thai number is needed for ride-hailing apps, bank verification and other everyday services. SIM registration requires your passport by law; an unregistered SIM cannot be activated.",
        th: "เบอร์โทรไทยที่ใช้งานได้จำเป็นสำหรับแอปเรียกรถ การยืนยันตัวตนกับธนาคาร และบริการอื่น ๆ ในชีวิตประจำวัน การลงทะเบียนซิมต้องใช้หนังสือเดินทางตามกฎหมาย ซิมที่ไม่ได้ลงทะเบียนจะเปิดใช้งานไม่ได้",
      },
      owner: {
        en: "Mobile carriers, not BIRSA or the university, set SIM registration rules, plans and prices.",
        th: "ผู้ให้บริการเครือข่ายมือถือเป็นผู้กำหนดกฎการลงทะเบียนซิม แพ็กเกจ และราคา ไม่ใช่ BIRSA หรือมหาวิทยาลัย",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "SIM cards are widely available at the airport, convenience stores and phone shops across the city; bring your passport when you buy one. Compare current data allowances and prices at the point of purchase, since promotions change often; airport kiosks are convenient but not always the cheapest option compared to a shop in the city.",
            th: "ซิมการ์ดหาซื้อได้ทั่วไปที่สนามบิน ร้านสะดวกซื้อ และร้านมือถือทั่วเมือง ให้พกหนังสือเดินทางไปด้วยตอนซื้อ ควรเทียบปริมาณอินเทอร์เน็ตและราคา ณ จุดขาย เพราะโปรโมชันเปลี่ยนบ่อย ร้านในสนามบินสะดวกแต่ไม่ได้ถูกที่สุดเมื่อเทียบกับร้านในเมือง",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "Thammasat provides campus wifi for enrolled students; you will need your university account credentials to connect. Most carriers let you top up and change packages through their own app, at convenience stores, or via short dial codes.",
            th: "ธรรมศาสตร์มี wifi ให้นักศึกษาที่ลงทะเบียนใช้งาน ต้องใช้บัญชีมหาวิทยาลัยของตัวเองในการเชื่อมต่อ ผู้ให้บริการส่วนใหญ่เติมเงินและเปลี่ยนแพ็กเกจได้ผ่านแอปของตัวเอง ร้านสะดวกซื้อ หรือกดรหัสสั้น ๆ",
          },
        },
      ],
      actions: [
        {
          label: { en: "Phones and internet guide", th: "คู่มือโทรศัพท์และอินเทอร์เน็ต" },
          href: "/student-life/international/phones-and-internet",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-settle-health",
      title: {
        en: "Health cover and insurance",
        th: "ประกันสุขภาพ",
      },
      summary: {
        en: "Many universities, including Thammasat, expect or require international students to hold valid health insurance for the duration of their stay, sometimes as a visa or enrolment condition.",
        th: "มหาวิทยาลัยหลายแห่ง รวมถึงธรรมศาสตร์ กำหนดหรือคาดหวังให้นักศึกษาต่างชาติมีประกันสุขภาพที่ยังไม่หมดอายุตลอดระยะเวลาที่อยู่ในไทย บางกรณีเป็นเงื่อนไขของวีซ่าหรือการลงทะเบียน",
      },
      owner: {
        en: "TU International Affairs confirms the specific insurance requirement, not BIRSA.",
        th: "ฝ่ายกิจการนักศึกษาต่างชาติเป็นผู้ยืนยันข้อกำหนดด้านประกันที่แน่ชัด ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Confirm the specific requirement and any university-arranged options with TU International Affairs, and keep your insurance documents, physical or digital, accessible in case a hospital asks at check-in.",
            th: "สอบถามข้อกำหนดที่แน่ชัดและทางเลือกที่มหาวิทยาลัยจัดให้กับฝ่ายกิจการนักศึกษาต่างชาติ และเก็บเอกสารประกัน ทั้งฉบับกระดาษหรือดิจิทัล ไว้ให้พร้อมใช้เมื่อโรงพยาบาลขอดูตอนเช็กอิน",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "Siriraj Hospital, one of Thailand's largest hospitals, is directly across the river from Tha Prachan, reachable by a short cross-river boat. Private hospitals tend to have shorter waits and more English-speaking staff, generally at higher cost than public hospitals. Pharmacies, identified by a green cross sign, can often help directly with minor ailments without needing a doctor's visit.",
            th: "โรงพยาบาลศิริราช หนึ่งในโรงพยาบาลที่ใหญ่ที่สุดของไทย อยู่ฝั่งตรงข้ามแม่น้ำจากท่าพระจันทร์ นั่งเรือข้ามฟากได้ในเวลาสั้น ๆ โรงพยาบาลเอกชนมักรอคิวสั้นกว่าและมีเจ้าหน้าที่ที่พูดภาษาอังกฤษได้มากกว่า แต่ค่าใช้จ่ายสูงกว่าโรงพยาบาลรัฐโดยทั่วไป ร้านขายยาที่มีสัญลักษณ์กากบาทสีเขียวมักช่วยดูอาการเจ็บป่วยเล็กน้อยได้โดยไม่ต้องพบแพทย์",
          },
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "Medical emergency / ambulance: 1669. Police: 191.",
            th: "เหตุฉุกเฉินทางการแพทย์ / รถพยาบาล โทร 1669 ตำรวจ โทร 191",
          },
        },
      ],
      actions: [
        {
          label: {
            en: "Healthcare and insurance guide",
            th: "คู่มือการรักษาพยาบาลและประกันสุขภาพ",
          },
          href: "/student-life/international/healthcare-and-insurance",
        },
        {
          label: { en: "Emergency guidance", th: "คำแนะนำเหตุฉุกเฉิน" },
          href: "/emergency",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-settle-culture",
      title: {
        en: "Thai culture and language basics",
        th: "วัฒนธรรมและภาษาไทยเบื้องต้น",
      },
      summary: {
        en: "The wai, pressing your palms together at chest height with a slight bow, is Thailand's traditional greeting and sign of respect. Returning a wai when offered one is polite; a smile plus a slight nod is a safe fallback if you're unsure.",
        th: "การไหว้ ด้วยการประนมมือระดับอกพร้อมก้มศีรษะเล็กน้อย เป็นการทักทายและแสดงความเคารพแบบไทย เมื่อมีคนไหว้มาควรไหว้ตอบ หากไม่แน่ใจ ยิ้มพร้อมพยักหน้าเล็กน้อยก็เป็นทางเลือกที่ปลอดภัย",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Many temples and some official buildings expect modest dress: shoulders and knees covered, and shoes removed before entering certain areas. The Grand Palace, near campus, enforces this strictly and can refuse entry for inappropriate dress. Thailand also observes several Buddhist holidays across the year, such as Makha Bucha, Visakha Bucha and Asalha Bucha, when some shops, government offices, and, on certain dates, alcohol sales may be restricted or closed.",
            th: "วัดหลายแห่งและอาคารราชการบางแห่งคาดหวังการแต่งกายสุภาพ ปกไหล่และเข่า และถอดรองเท้าก่อนเข้าบางพื้นที่ พระบรมมหาราชวังซึ่งอยู่ใกล้มหาวิทยาลัยเข้มงวดเรื่องนี้มาก และอาจปฏิเสธไม่ให้เข้าหากแต่งกายไม่เหมาะสม ไทยยังมีวันสำคัญทางพุทธศาสนาหลายวันในแต่ละปี เช่น วันมาฆบูชา วิสาขบูชา และอาสาฬหบูชา ซึ่งบางร้านค้า หน่วยงานราชการ และการขายเครื่องดื่มแอลกอฮอล์ในบางวันอาจถูกจำกัดหรือปิด",
          },
        },
        {
          kind: "steps",
          title: { en: "Everyday etiquette worth knowing", th: "มารยาทที่ควรรู้ในชีวิตประจำวัน" },
          items: [
            {
              en: "Remove shoes when a home, some shops, and certain temple buildings clearly expect it; a pile of shoes at the entrance is the cue.",
              th: "ถอดรองเท้าเมื่อเข้าบ้าน ร้านค้าบางแห่ง หรืออาคารในวัดบางส่วนที่คาดหวังไว้ชัดเจน สังเกตจากรองเท้าที่วางกองอยู่หน้าทางเข้า",
            },
            {
              en: "Avoid touching people's heads or pointing your feet directly at people or Buddha images; both are considered disrespectful.",
              th: "หลีกเลี่ยงการแตะศีรษะผู้อื่น หรือชี้เท้าไปทางคนหรือพระพุทธรูปโดยตรง เพราะถือว่าไม่สุภาพ",
            },
            {
              en: "Public displays of anger or raised voices are viewed less favourably than in some other cultures.",
              th: "การแสดงความโกรธหรือตะโกนในที่สาธารณะไม่เป็นที่ยอมรับเท่ากับในบางวัฒนธรรม",
            },
          ],
        },
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "The guide's basic Thai phrases table is example content BIRSA has not yet verified. Check pronunciation with a Thai speaker rather than relying on the guide alone.",
            th: "ตารางวลีภาษาไทยพื้นฐานในคู่มือเป็นเนื้อหาตัวอย่างที่ BIRSA ยังไม่ได้ตรวจสอบยืนยัน ควรตรวจสอบการออกเสียงกับเจ้าของภาษาแทนการอ้างอิงจากคู่มือเพียงอย่างเดียว",
          },
        },
      ],
      actions: [
        {
          label: { en: "Culture and language guide", th: "คู่มือวัฒนธรรมและภาษา" },
          href: "/student-life/international/culture-and-language",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-settle-campus",
      title: {
        en: "Getting set up on campus",
        th: "การตั้งตัวในมหาวิทยาลัย",
      },
      summary: {
        en: "Your student card doubles as your ID, your library card, and a Bangkok Bank card, and the TU Greats App handles booking campus services and shows facility hours.",
        th: "บัตรนักศึกษาใช้เป็นทั้งบัตรประจำตัว บัตรห้องสมุด และบัตรธนาคารกรุงเทพในใบเดียว ส่วนแอป TU Greats ใช้จองบริการต่าง ๆ ในมหาวิทยาลัยและดูเวลาเปิดปิดของสถานที่ต่าง ๆ",
      },
      owner: {
        en: "The University issues your student account, card and login credentials, not BIRSA.",
        th: "มหาวิทยาลัยเป็นผู้ออกบัญชี บัตรนักศึกษา และรหัสผ่านต่าง ๆ ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Thammasat provides campus wifi for enrolled students; you will need your university account credentials to connect. Check the latest news for orientation and term dates.",
            th: "ธรรมศาสตร์มี wifi ให้นักศึกษาที่ลงทะเบียนใช้งาน ต้องใช้บัญชีมหาวิทยาลัยของตัวเองในการเชื่อมต่อ ตรวจสอบข่าวล่าสุดสำหรับวันปฐมนิเทศและกำหนดการเปิดเทอม",
          },
        },
      ],
      actions: [
        {
          label: {
            en: "Rights and welfare, including the TU Greats App",
            th: "สิทธิและสวัสดิการ รวมถึงแอป TU Greats",
          },
          href: "/student-life/home/rights-and-welfare",
        },
        {
          label: { en: "What's on", th: "กิจกรรมที่กำลังจะจัดขึ้น" },
          href: "/news",
        },
      ],
      related: [
        {
          label: { en: "Libraries and study support", th: "ห้องสมุดและบริการสนับสนุนการเรียน" },
          href: "/student-life/home/study-support",
          description: {
            en: "Libraries, printing quota, TU-GET, and plagiarism checking.",
            th: "ห้องสมุด โควตาพรินต์ TU-GET และการตรวจสอบการคัดลอกผลงาน",
          },
        },
        {
          label: { en: "Shuttle bus", th: "รถรับส่ง" },
          href: "/student-life/home/shuttle-bus",
        },
        {
          label: { en: "Getting around Tha Prachan", th: "การเดินทางรอบท่าพระจันทร์" },
          href: "/student-life/home/getting-around",
        },
        {
          label: { en: "Phones and internet guide", th: "คู่มือโทรศัพท์และอินเทอร์เน็ต" },
          href: "/student-life/international/phones-and-internet",
          description: {
            en: "Written for international students, but the wifi section applies to everyone.",
            th: "เขียนไว้สำหรับนักศึกษาต่างชาติ แต่ส่วนของ wifi ใช้ได้กับนักศึกษาทุกคน",
          },
        },
      ],
      contactCategory: "question",
    },

    /* ================================================================ */
    /* money-and-fees                                                    */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-money-need",
      question: {
        en: "What do you need to know?",
        th: "อยากรู้เรื่องไหน",
      },
      options: [
        {
          id: "fees",
          label: { en: "Tuition and fees", th: "ค่าเล่าเรียนและค่าธรรมเนียม" },
          next: "out-money-fees",
        },
        {
          id: "budget",
          label: { en: "What a month actually costs", th: "ค่าใช้จ่ายรายเดือนที่แท้จริง" },
          next: "out-money-budget",
        },
        {
          id: "discounts",
          label: { en: "Student discounts around campus", th: "ส่วนลดนักศึกษารอบมหาวิทยาลัย" },
          next: "out-money-discounts",
        },
        {
          id: "trouble",
          label: {
            en: "I'm having trouble paying, or need a deferral or refund",
            th: "จ่ายเงินลำบาก หรือต้องการผ่อนผัน/ขอคืนเงิน",
          },
          next: "out-money-trouble",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-money-fees",
      title: {
        en: "Tuition and fees",
        th: "ค่าเล่าเรียนและค่าธรรมเนียม",
      },
      summary: {
        en: "Estimated totals per academic year: 125,000 baht for Thai students, 144,000 baht for non-Thai students.",
        th: "ค่าใช้จ่ายโดยประมาณต่อปีการศึกษา นักศึกษาไทย 125,000 บาท นักศึกษาต่างชาติ 144,000 บาท",
      },
      owner: {
        en: "The Registrar and your faculty office set the fee schedule and due dates, not BIRSA.",
        th: "สำนักทะเบียนและสำนักงานคณะเป็นผู้กำหนดตารางค่าธรรมเนียมและวันครบกำหนดชำระ ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "steps",
          title: { en: "What makes up the total", th: "รายการที่รวมอยู่ในค่าใช้จ่าย" },
          items: [
            {
              en: "Enrollment fee: 400 baht, payable once.",
              th: "ค่าขึ้นทะเบียนนักศึกษา 400 บาท จ่ายครั้งเดียว",
            },
            { en: "Tuition fee: 2,500 baht per credit.", th: "ค่าหน่วยกิต 2,500 บาทต่อหน่วยกิต" },
            {
              en: "Program fee: 12,000 baht per semester.",
              th: "ค่าธรรมเนียมพิเศษหลักสูตร 12,000 บาทต่อภาคการศึกษา",
            },
            {
              en: "Health fee: 125 baht per semester.",
              th: "ค่าบำรุงสุขภาพ 125 บาทต่อภาคการศึกษา",
            },
            { en: "Sport fee: 200 baht per semester.", th: "ค่าบำรุงกีฬา 200 บาทต่อภาคการศึกษา" },
            {
              en: "Activities fee: 200 baht per semester.",
              th: "ค่าบำรุงกิจกรรม 200 บาทต่อภาคการศึกษา",
            },
            { en: "Library fee: 2,000 baht per year.", th: "ค่าบำรุงห้องสมุด 2,000 บาทต่อปี" },
          ],
        },
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "This site doesn't list the exact date fees are due each semester. Check the payment deadline on TU Greats or with the Registrar before the semester starts.",
            th: "เว็บไซต์นี้ไม่ได้ระบุวันครบกำหนดชำระค่าเล่าเรียนที่แน่ชัดของแต่ละภาคการศึกษา ตรวจสอบกำหนดชำระเงินได้ทางแอป TU Greats หรือสอบถามสำนักทะเบียนก่อนเปิดภาคการศึกษา",
          },
        },
      ],
      actions: [
        {
          label: {
            en: "Admission, structure and fees",
            th: "การรับเข้า โครงสร้างหลักสูตร และค่าเล่าเรียน",
          },
          href: "/student-life/handbook/admission-and-fees",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-money-budget",
      title: {
        en: "What a month actually costs",
        th: "ค่าใช้จ่ายรายเดือนที่แท้จริง",
      },
      summary: {
        en: "Food near Tha Prachan is among the best value in Bangkok, away from the tourist-facing streets. Costs vary by lifestyle, but here's a rough starting point.",
        th: "อาหารรอบท่าพระจันทร์ถือว่าคุ้มค่าที่สุดแห่งหนึ่งในกรุงเทพฯ โดยเฉพาะนอกถนนที่เน้นนักท่องเที่ยว ค่าใช้จ่ายแตกต่างกันไปตามไลฟ์สไตล์ แต่นี่คือจุดเริ่มต้นคร่าว ๆ",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "These ranges are BIRSA's example figures, not yet verified. Treat them as a planning starting point, not confirmed numbers.",
            th: "ช่วงตัวเลขเหล่านี้เป็นตัวอย่างที่ BIRSA ยังไม่ได้ตรวจสอบยืนยัน ให้ใช้เป็นจุดเริ่มต้นในการวางแผน ไม่ใช่ตัวเลขที่ยืนยันแล้ว",
          },
        },
        {
          kind: "steps",
          title: { en: "Rough monthly ranges", th: "ช่วงค่าใช้จ่ายรายเดือนโดยประมาณ" },
          items: [
            {
              en: "Food, mostly local eateries: 4,000 to 7,000 baht.",
              th: "อาหาร ส่วนใหญ่จากร้านท้องถิ่น 4,000 ถึง 7,000 บาท",
            },
            {
              en: "Transport, boat, MRT or bus: 800 to 1,500 baht.",
              th: "การเดินทาง เรือ รถไฟฟ้า หรือรถเมล์ 800 ถึง 1,500 บาท",
            },
            {
              en: "Phone and data: 300 to 600 baht.",
              th: "โทรศัพท์และอินเทอร์เน็ต 300 ถึง 600 บาท",
            },
            {
              en: "Personal and social spending: 1,500 to 4,000 baht.",
              th: "ค่าใช้จ่ายส่วนตัวและสังสรรค์ 1,500 ถึง 4,000 บาท",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: 'Faculty and university canteens are the cheapest options for a quick lunch. Rice-and-one-topping ("khao rad gaeng") stalls are usually the cheapest hot meal, and refillable water bottles save money since many buildings have drinking water points.',
            th: "โรงอาหารของคณะและมหาวิทยาลัยเป็นตัวเลือกที่ถูกที่สุดสำหรับมื้อกลางวัน ร้านข้าวราดแกงมักเป็นมื้อร้อนที่ถูกที่สุด และการพกขวดน้ำเติมช่วยประหยัดเงินได้ เพราะหลายอาคารมีจุดน้ำดื่ม",
          },
        },
      ],
      actions: [
        {
          label: { en: "Food and budgeting guide", th: "คู่มืออาหารและงบประมาณ" },
          href: "/student-life/home/food-and-budgeting",
        },
      ],
      related: [
        {
          label: { en: "Food and housing nearby", th: "ร้านอาหารและที่พักใกล้เคียง" },
          href: "/student-life/home/places-nearby",
        },
        {
          label: { en: "Money matters", th: "เรื่องการเงิน" },
          href: "/student-life/home/money-matters",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-money-discounts",
      title: {
        en: "Student discounts around campus",
        th: "ส่วนลดนักศึกษารอบมหาวิทยาลัย",
      },
      summary: {
        en: "Your student card gets you discounts at a set of shops and cafés around campus, plus free or discounted entry to some museums. Show your card and ask; some discounts are automatic, others need you to mention it.",
        th: "บัตรนักศึกษาใช้รับส่วนลดได้ที่ร้านค้าและคาเฟ่รอบมหาวิทยาลัย รวมถึงส่วนลดหรือเข้าฟรีที่พิพิธภัณฑ์บางแห่ง แสดงบัตรและสอบถามได้เลย บางร้านให้ส่วนลดอัตโนมัติ บางร้านต้องแจ้งเอง",
      },
      body: [
        {
          kind: "steps",
          title: { en: "A sample of what's on offer", th: "ตัวอย่างส่วนลดที่มีให้" },
          items: [
            {
              en: "Thammasat Book Centre: 10% off when you spend 100 baht or more.",
              th: "ศูนย์หนังสือธรรมศาสตร์ ลด 10% เมื่อซื้อครบ 100 บาทขึ้นไป",
            },
            {
              en: "LUA Café and ช่างคั่ว (Tha Prachan branch): 10% off, show your student card.",
              th: "LUA Café และช่างคั่ว สาขาท่าพระจันทร์ ลด 10% เมื่อแสดงบัตรนักศึกษา",
            },
            {
              en: "Theatre Riverside restaurant: 10% off food and drink, show your card.",
              th: "ร้านอาหารเธียเตอร์ริเวอร์ไซด์ ลด 10% ค่าอาหารและเครื่องดื่มเมื่อแสดงบัตร",
            },
            {
              en: "KRAFT CAFE: 50 baht off food and drink, show your card.",
              th: "KRAFT CAFE ลด 50 บาทค่าอาหารและเครื่องดื่มเมื่อแสดงบัตร",
            },
            {
              en: "National Museum Bangkok, National Gallery and Nitasrattanakosin: free entry with your student card.",
              th: "พิพิธภัณฑสถานแห่งชาติ พระนคร หอศิลป์ และนิทรรศน์รัตนโกสินทร์ เข้าชมฟรีเมื่อแสดงบัตรนักศึกษา",
            },
            {
              en: "Museum Pier: 50% off with your student card.",
              th: "ท่าพิพิธภัณฑ์ Museum Pier ลด 50% เมื่อแสดงบัตรนักศึกษา",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "Your student card also gets you a free printing quota of 100 baht per semester at Pridi Banomyong Library U2, plus free AI and plagiarism-checking tools through the library's U-Services.",
            th: "บัตรนักศึกษายังใช้รับโควตาพิมพ์เอกสารฟรี 100 บาทต่อภาคการศึกษาที่หอสมุดปรีดี พนมยงค์ U2 พร้อมเครื่องมือ AI และตรวจสอบการคัดลอกผลงานฟรีผ่าน U-Services ของห้องสมุด",
          },
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "These details are drawn from the TU91 Handbook, the 2025 orientation journal from the Thammasat University Student Union, Tha Prachan. Details can change, so check before you rely on them.",
            th: "ข้อมูลนี้อ้างอิงจากคู่มือ TU91 หนังสือปฐมนิเทศปี 2568 ขององค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ รายละเอียดอาจเปลี่ยนแปลงได้ ควรตรวจสอบก่อนใช้งานจริง",
          },
        },
      ],
      actions: [
        {
          label: { en: "Money matters guide", th: "คู่มือเรื่องการเงิน" },
          href: "/student-life/home/money-matters",
        },
      ],
      related: [
        {
          label: { en: "Libraries and study support", th: "ห้องสมุดและบริการสนับสนุนการเรียน" },
          href: "/student-life/home/study-support",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-money-trouble",
      title: {
        en: "If paying is a problem",
        th: "เมื่อจ่ายเงินลำบาก",
      },
      summary: {
        en: "Deferrals and refunds are decided by your own faculty, not BIRSA, and each case is handled individually.",
        th: "การผ่อนผันและการคืนเงินตัดสินโดยคณะของคุณเอง ไม่ใช่ BIRSA และพิจารณาเป็นรายกรณี",
      },
      owner: {
        en: "Your faculty office decides deferrals and refunds, not BIRSA.",
        th: "สำนักงานคณะเป็นผู้ตัดสินเรื่องการผ่อนผันและคืนเงิน ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "steps",
          title: { en: "What the rules say", th: "สิ่งที่ระเบียบกำหนดไว้" },
          items: [
            {
              en: "Tuition deferral: request it through your own faculty. Deferrals are decided case by case, so ask your faculty office what they need from you.",
              th: "การผ่อนผันค่าเล่าเรียน ยื่นเรื่องผ่านคณะของคุณเอง พิจารณาเป็นรายกรณี สอบถามสำนักงานคณะว่าต้องเตรียมอะไรบ้าง",
            },
            {
              en: "Course refunds: if you withdraw from a course and are owed a refund, it is paid into your Bangkok Bank account, since your student card doubles as a Bangkok Bank card.",
              th: "การคืนเงินค่าวิชา หากถอนวิชาและมีสิทธิ์ได้เงินคืน เงินจะโอนเข้าบัญชีธนาคารกรุงเทพของคุณ เพราะบัตรนักศึกษาทำหน้าที่เป็นบัตรธนาคารกรุงเทพในตัว",
            },
            {
              en: "Withdrawing after add/drop: TU Greats shows a W for that course. A W does not affect your results, but you cannot get a refund for that course once the window has passed.",
              th: "การถอนวิชาหลังหมดช่วงเพิ่ม-ถอน ระบบ TU Greats จะแสดงผล W สำหรับวิชานั้น W ไม่มีผลต่อผลการเรียน แต่จะไม่ได้รับเงินคืนสำหรับวิชานั้นแล้ว",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "If money is affecting you more broadly, check BIRSA's announcements for student support schemes.",
            th: "หากเรื่องเงินกระทบชีวิตในภาพรวม ลองติดตามประกาศของ BIRSA เกี่ยวกับโครงการช่วยเหลือนักศึกษา",
          },
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      related: [
        {
          label: { en: "Money matters guide", th: "คู่มือเรื่องการเงิน" },
          href: "/student-life/home/money-matters",
        },
        {
          label: { en: "Health and wellbeing", th: "สุขภาพและความเป็นอยู่ที่ดี" },
          href: "/student-life/home/health-and-wellbeing",
        },
      ],
      contactCategory: "problem",
    },
  ],
};
