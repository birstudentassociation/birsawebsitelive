/**
 * Three topics that did not fit "start where you are with your degree" or
 * "run an event": health and safety, getting to and around Tha Prachan, and
 * a student's standing in the University's own rules.
 *
 * Grounded in `content/student-life/en/home/health-and-wellbeing.mdx`,
 * `safety-and-emergencies.mdx`, `content/student-life/en/international/
 * healthcare-and-insurance.mdx`, `getting-around.mdx`, `shuttle-bus.mdx`,
 * `places-nearby.mdx`, `food-and-budgeting.mdx`, `study-support.mdx`,
 * `rights-and-welfare.mdx`, `content/activity/en/student-bodies.mdx`, and the
 * University Regulation on Student Activities B.E. 2563 (`university-2563`)
 * and the Faculty Notice B.E. 2565 (`political-science-2565`).
 *
 * `origin` changes health cover and what a hospital will ask for (the Thai
 * student healthcare and accident insurance scheme versus an international
 * student's own insurance), so `q-wellbeing-cover-origin` asks and skips the
 * question once the fact is known. `role` changes who acts on a rights
 * question: an officer already sitting on a body has a duty to put the
 * matter on that body's own agenda; an ordinary student needs the route to
 * their representative instead. That split is written into
 * `out-rights-raise-something` and the eligibility note in
 * `out-rights-voting`, both as conditional body blocks rather than separate
 * questions, since the rest of the answer is identical either way.
 */
import type { SmartAnswerService } from "../types";

export const wellbeing: SmartAnswerService = {
  topics: [
    {
      slug: "health-and-safety",
      title: {
        en: "Health, safety and feeling unsafe",
        th: "สุขภาพ ความปลอดภัย และความรู้สึกไม่ปลอดภัย",
      },
      lede: {
        en: "Where to go when you're unwell, what your student healthcare and insurance actually cover, mental health routes, and what to do about a lost card, a scam, or harassment.",
        th: "จะไปที่ไหนเมื่อไม่สบาย สิทธิรักษาพยาบาลและประกันของนักศึกษาครอบคลุมอะไรบ้าง ช่องทางด้านสุขภาพจิต และควรทำอย่างไรเมื่อบัตรนักศึกษาหาย เจอมิจฉาชีพ หรือถูกคุกคาม",
      },
      group: "life",
      start: "q-wellbeing-need",
      whatYoullNeed: [
        {
          en: "Whether this is happening right now, or something you can plan around",
          th: "เรื่องนี้กำลังเกิดขึ้นตอนนี้ หรือเป็นเรื่องที่วางแผนล่วงหน้าได้",
        },
        {
          en: "Whether you're covered by Thai student healthcare or your own insurance",
          th: "คุณใช้สิทธิรักษาพยาบาลนักศึกษาไทย หรือใช้ประกันของตัวเอง",
        },
      ],
      keywords: [
        "health",
        "clinic",
        "hospital",
        "insurance",
        "counselling",
        "mental health",
        "safety",
        "scam",
        "harassment",
        "lost card",
        "สุขภาพ",
        "คลินิก",
        "โรงพยาบาล",
        "ประกัน",
        "ให้คำปรึกษา",
        "สุขภาพจิต",
        "ปลอดภัย",
        "มิจฉาชีพ",
        "คุกคาม",
        "บัตรหาย",
      ],
    },
    {
      slug: "getting-around",
      title: {
        en: "Getting to Tha Prachan and around it",
        th: "การเดินทางมาท่าพระจันทร์และเดินทางในมหาวิทยาลัย",
      },
      lede: {
        en: "How to reach campus, the free TU shuttle, where to eat and live nearby, and study spaces including the library and printing.",
        th: "วิธีเดินทางมาคณะ รถรับส่งฟรีของมหาวิทยาลัย ที่กินที่พักใกล้เคียง และพื้นที่อ่านหนังสือรวมถึงห้องสมุดและการพิมพ์งาน",
      },
      group: "life",
      start: "q-around-need",
      whatYoullNeed: [
        { en: "Where you're starting from", th: "คุณเดินทางมาจากจุดไหน" },
        {
          en: "Roughly what you're looking for once you're on campus",
          th: "สิ่งที่ต้องการหาเมื่อมาถึงคณะแล้ว",
        },
      ],
      keywords: [
        "getting around",
        "shuttle",
        "bus",
        "boat",
        "mrt",
        "food",
        "housing",
        "dorm",
        "library",
        "printing",
        "study room",
        "การเดินทาง",
        "รถรับส่ง",
        "รถเมล์",
        "เรือ",
        "ที่กิน",
        "ที่พัก",
        "หอสมุด",
        "ปริ้นท์",
        "จองห้อง",
      ],
    },
    {
      slug: "rights-and-representation",
      title: { en: "Your rights and student representation", th: "สิทธิของคุณและตัวแทนนักศึกษา" },
      lede: {
        en: "What you're entitled to as a Thammasat student, the free welfare provision at Tha Prachan, and how the ladder of elected student bodies, votes and elections work.",
        th: "สิทธิที่คุณมีในฐานะนักศึกษาธรรมศาสตร์ สวัสดิการฟรีที่ท่าพระจันทร์ และการทำงานของบันไดองค์กรนักศึกษาที่มาจากการเลือกตั้ง การลงคะแนน และการเลือกตั้ง",
      },
      group: "rights",
      start: "q-rights-need",
      whatYoullNeed: [
        {
          en: "Whether you already sit on a committee or body",
          th: "คุณอยู่ในคณะกรรมการหรือองค์กรใดอยู่แล้วหรือไม่",
        },
      ],
      keywords: [
        "rights",
        "welfare",
        "vote",
        "election",
        "run for",
        "student council",
        "student union",
        "psc",
        "birsa",
        "complaint",
        "สิทธิ",
        "สวัสดิการ",
        "เลือกตั้ง",
        "ลงสมัคร",
        "สภานักศึกษา",
        "องค์การนักศึกษา",
        "กนศ.ร",
        "ร้องเรียน",
      ],
    },
  ],

  nodes: [
    /* ================================================================ */
    /* Topic 1: health-and-safety                                        */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-wellbeing-need",
      question: { en: "What's this about?", th: "เรื่องนี้เกี่ยวกับอะไร" },
      options: [
        {
          id: "emergency",
          label: {
            en: "Something is happening right now and someone could get hurt",
            th: "มีเหตุเกิดขึ้นตอนนี้ และอาจมีคนได้รับอันตราย",
          },
          next: "out-emergency-now",
        },
        {
          id: "unwell",
          label: { en: "I feel unwell or I've been hurt", th: "รู้สึกไม่สบายหรือได้รับบาดเจ็บ" },
          next: "q-wellbeing-unwell",
        },
        {
          id: "mental-health",
          label: {
            en: "I want to talk to someone about how I'm feeling",
            th: "อยากพูดคุยกับใครสักคนเรื่องความรู้สึกของตัวเอง",
          },
          next: "out-wellbeing-mental-health",
        },
        {
          id: "cover",
          label: {
            en: "What does my health cover or insurance actually pay for?",
            th: "สิทธิรักษาพยาบาลหรือประกันของฉันครอบคลุมอะไรบ้าง",
          },
          next: "q-wellbeing-cover-origin",
        },
        {
          id: "safety",
          label: {
            en: "A safety concern: a lost card, a scam, harassment, or something on campus",
            th: "เรื่องความปลอดภัย เช่น บัตรหาย มิจฉาชีพ การคุกคาม หรือเรื่องในมหาวิทยาลัย",
          },
          next: "q-wellbeing-safety-kind",
        },
      ],
    },

    {
      kind: "question",
      id: "q-wellbeing-unwell",
      question: { en: "How does it feel?", th: "อาการเป็นอย่างไร" },
      options: [
        {
          id: "minor",
          label: {
            en: "Minor, I can get myself somewhere",
            th: "ไม่รุนแรง สามารถเดินทางไปเองได้",
          },
          next: "out-wellbeing-clinic",
        },
        {
          id: "beyond-clinic",
          label: {
            en: "More than a sick bay can handle",
            th: "รุนแรงกว่าที่ห้องพยาบาลจะดูแลได้",
          },
          next: "out-wellbeing-hospital",
        },
      ],
    },

    {
      kind: "question",
      id: "q-wellbeing-cover-origin",
      question: {
        en: "Which cover are you asking about?",
        th: "ต้องการเช็กสิทธิแบบไหน",
      },
      hint: {
        en: "Thai student healthcare and accident insurance work differently from an international student's own insurance.",
        th: "สิทธิรักษาพยาบาลและประกันอุบัติเหตุของนักศึกษาไทยทำงานต่างจากประกันของนักศึกษาต่างชาติ",
      },
      skipWhen: [
        { when: { fact: "origin", is: "thai" }, option: "thai" },
        { when: { fact: "origin", is: "international" }, option: "international" },
      ],
      options: [
        {
          id: "thai",
          label: {
            en: "Thai student healthcare and accident insurance",
            th: "สิทธิรักษาพยาบาลนักศึกษาไทยและประกันอุบัติเหตุ",
          },
          set: { origin: "thai" },
          next: "out-wellbeing-cover-thai",
        },
        {
          id: "international",
          label: {
            en: "My own international insurance",
            th: "ประกันของตัวเองในฐานะนักศึกษาต่างชาติ",
          },
          set: { origin: "international" },
          next: "out-wellbeing-cover-international",
        },
      ],
    },

    {
      kind: "question",
      id: "q-wellbeing-safety-kind",
      question: { en: "What's this about?", th: "เรื่องนี้เกี่ยวกับอะไร" },
      options: [
        {
          id: "lost-card",
          label: { en: "I've lost my student card", th: "บัตรนักศึกษาหาย" },
          next: "out-wellbeing-lost-card",
        },
        {
          id: "scam",
          label: {
            en: "Someone approached me and it felt like a scam",
            th: "มีคนเข้ามาชวน รู้สึกว่าน่าจะเป็นมิจฉาชีพ",
          },
          next: "out-wellbeing-scam",
        },
        {
          id: "harassment",
          label: { en: "I'm dealing with harassment", th: "กำลังเจอการคุกคาม" },
          next: "out-wellbeing-harassment",
        },
        {
          id: "general",
          label: {
            en: "A general safety question about campus",
            th: "คำถามทั่วไปเรื่องความปลอดภัยในมหาวิทยาลัย",
          },
          next: "out-wellbeing-general-safety",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-wellbeing-clinic",
      title: { en: "Start at the TU Virtual Clinic", th: "เริ่มที่ TU Virtual Clinic" },
      summary: {
        en: "The TU Virtual Clinic is the campus sick bay, in the health area beneath the student activity building, opposite the gym. Open Monday to Friday, 09:00 to 16:30.",
        th: "TU Virtual Clinic คือห้องพยาบาลของมหาวิทยาลัย อยู่ในโซนสุขภาพใต้อาคารกิจกรรมนักศึกษา ตรงข้ามโรงยิม เปิดวันจันทร์ถึงศุกร์ 09:00 ถึง 16:30 น.",
      },
      owner: {
        en: "The TU Virtual Clinic, not BIRSA.",
        th: "TU Virtual Clinic เป็นผู้ดูแล ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Bring your student card and your ID card, or your passport if you're an international student. If your symptoms turn out to be more than the clinic can handle, staff there refer you on to hospital.",
            th: "นำบัตรนักศึกษาและบัตรประชาชนไปด้วย หรือพาสปอร์ตสำหรับนักศึกษาต่างชาติ ถ้าอาการรุนแรงกว่าที่คลินิกจะดูแลได้ เจ้าหน้าที่จะส่งต่อไปโรงพยาบาลให้",
          },
        },
      ],
      related: [
        {
          label: { en: "Health and wellbeing", th: "สุขภาพและความเป็นอยู่" },
          href: "/student-life/home/health-and-wellbeing",
          description: {
            en: "Emergency numbers, everyday health care, and what your student status covers.",
            th: "เบอร์ฉุกเฉิน การดูแลสุขภาพในชีวิตประจำวัน และสิทธิที่มาพร้อมสถานะนักศึกษา",
          },
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-wellbeing-hospital",
      title: {
        en: "See a doctor beyond what the clinic covers",
        th: "ไปพบแพทย์ในกรณีที่เกินกว่าคลินิกจะดูแลได้",
      },
      summary: {
        en: "If it's more than a sick bay can handle, go to a hospital. What a hospital asks for, and what's covered, differs depending on your student status.",
        th: "ถ้าอาการเกินกว่าห้องพยาบาลจะดูแลได้ ให้ไปโรงพยาบาล สิ่งที่โรงพยาบาลจะขอดู และสิทธิที่ครอบคลุม แตกต่างกันไปตามสถานะนักศึกษาของคุณ",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "The contract hospital for Tha Prachan under the student accident insurance scheme is Chao Phraya Pinklao Hospital. Being on the policy at a contract hospital means you can direct claim, with no need to pay upfront.",
            th: "โรงพยาบาลคู่สัญญาของท่าพระจันทร์ตามประกันอุบัติเหตุนักศึกษา คือโรงพยาบาลเจ้าพระยาปิ่นเกล้า ถ้าอยู่ในสิทธิที่โรงพยาบาลคู่สัญญา สามารถเคลมตรงได้ ไม่ต้องสำรองจ่ายก่อน",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "origin", is: "thai" },
          text: {
            en: "As a Thammasat student, accident insurance covers up to 15,000 baht per accident, and general treatment at Thammasat University Hospital in Rangsit is covered up to 5,000 baht per visit, up to 20,000 baht a year. If you hold the universal coverage gold card (บัตรทอง), you can also transfer it to Thammasat University Hospital, and in a genuine emergency you can use any hospital near where it happened.",
            th: "ในฐานะนักศึกษาธรรมศาสตร์ ประกันอุบัติเหตุครอบคลุมไม่เกิน 15,000 บาทต่ออุบัติเหตุหนึ่งครั้ง และการรักษาทั่วไปที่โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ (รังสิต) ครอบคลุมไม่เกิน 5,000 บาทต่อครั้ง สูงสุด 20,000 บาทต่อปีการศึกษา ถ้าถือบัตรทอง สามารถโอนสิทธิมาที่โรงพยาบาลธรรมศาสตร์ได้ และในกรณีฉุกเฉินจริงสามารถใช้สิทธิที่โรงพยาบาลใดก็ได้ใกล้จุดเกิดเหตุ",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "origin", is: "international" },
          text: {
            en: "Siriraj Hospital, one of Thailand's largest, is directly across the river from Tha Prachan by a short cross-river boat. Private hospitals nearby tend to have shorter waits and more English-speaking staff, at higher cost than public hospitals. Keep your insurance documents, physical or digital, accessible in case a hospital asks for them at check-in.",
            th: "โรงพยาบาลศิริราช หนึ่งในโรงพยาบาลที่ใหญ่ที่สุดของไทย อยู่ฝั่งตรงข้ามแม่น้ำจากท่าพระจันทร์ นั่งเรือข้ามฟากไม่กี่นาทีก็ถึง โรงพยาบาลเอกชนแถวนั้นมักรอสั้นกว่าและมีเจ้าหน้าที่พูดภาษาอังกฤษได้มากกว่า แต่ค่าใช้จ่ายสูงกว่าโรงพยาบาลรัฐ เตรียมเอกสารประกัน ทั้งฉบับจริงหรือไฟล์ ให้พร้อมหยิบใช้ เผื่อโรงพยาบาลขอดูตอนลงทะเบียน",
          },
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "If you're not sure how serious it is, get checked rather than waiting it out.",
            th: "ถ้าไม่แน่ใจว่าอาการรุนแรงแค่ไหน ควรไปตรวจดีกว่ารอดูอาการเอง",
          },
        },
      ],
      related: [
        {
          label: { en: "Health and wellbeing", th: "สุขภาพและความเป็นอยู่" },
          href: "/student-life/home/health-and-wellbeing",
          when: { fact: "origin", is: "thai" },
        },
        {
          label: { en: "Healthcare and insurance", th: "การรักษาพยาบาลและประกัน" },
          href: "/student-life/international/healthcare-and-insurance",
          when: { fact: "origin", is: "international" },
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-wellbeing-mental-health",
      title: { en: "Routes into mental health support", th: "ช่องทางเข้าถึงการดูแลสุขภาพจิต" },
      summary: {
        en: "These are the services available at Tha Prachan and how to book them. None of this replaces a proper assessment; it's how to reach someone who can give you one.",
        th: "นี่คือบริการที่มีที่ท่าพระจันทร์และวิธีจองคิว เนื้อหานี้ไม่ใช่การประเมินอาการ แต่เป็นช่องทางไปถึงคนที่จะประเมินให้ได้",
      },
      owner: {
        en: "TU Well Being, Viva City, TCAPS and Relationflip run these services, not BIRSA.",
        th: "TU Well Being, Viva City, TCAPS และ Relationflip เป็นผู้ให้บริการเหล่านี้ ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "TU Well Being, booked through the TU Greats App. Online sessions run Monday to Friday; onsite sessions run Wednesday to Friday, 08:00 to 16:00, on floor 3 of the Student Affairs office in the student activity building. There's also a 24-hour booking line: 02-026-2345, press 2.",
              th: "TU Well Being จองผ่านแอป TU Greats นัดออนไลน์วันจันทร์ถึงศุกร์ นัดที่ศูนย์วันพุธถึงศุกร์ 08:00 ถึง 16:00 น. ที่ชั้น 3 สำนักงานกิจการนักศึกษา อาคารกิจกรรมนักศึกษา มีสายจองด่วน 24 ชั่วโมง โทร 02-026-2345 กด 2",
            },
            {
              en: "Viva City counselling centre, weekdays 08:30 to 16:30, also bookable through the TU Greats App.",
              th: "ศูนย์ให้คำปรึกษา Viva City วันจันทร์ถึงศุกร์ 08:30 ถึง 16:30 น. จองผ่านแอป TU Greats ได้เช่นกัน",
            },
            {
              en: "TCAPS, the counselling centre at the Faculty of Liberal Arts, at both Tha Prachan and Rangsit.",
              th: "TCAPS ศูนย์ให้คำปรึกษาของคณะศิลปศาสตร์ มีทั้งที่ท่าพระจันทร์และรังสิต",
            },
            {
              en: "Relationflip, an online counselling service. It does not prescribe medication. If you register but don't receive your login details, or run into any other issue, call the RF call centre on 099-002-6888.",
              th: "Relationflip บริการให้คำปรึกษาออนไลน์ ไม่มีการจ่ายยา ถ้าลงทะเบียนแล้วแต่ไม่ได้รับข้อมูลเข้าสู่ระบบ หรือมีปัญหาอื่น โทรหา call center ของ RF ที่ 099-002-6888",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "If you're supporting a friend who seems to be struggling, encourage them to talk to someone: a counsellor, a trusted staff member, or you.",
            th: "ถ้าคุณกำลังช่วยเพื่อนที่ดูเหมือนกำลังลำบาก ชวนเขาพูดคุยกับใครสักคน จะเป็นนักจิตวิทยา เจ้าหน้าที่ที่ไว้ใจได้ หรือตัวคุณเองก็ได้",
          },
        },
      ],
      actions: [
        {
          label: { en: "Register with Relationflip", th: "ลงทะเบียน Relationflip" },
          href: "https://happy.relationflip.com/registerUniversity",
          external: true,
        },
        {
          label: {
            en: "Ask BIRSA if you're not sure where to start",
            th: "ถ้าไม่รู้จะเริ่มตรงไหน ถามได้ที่ BIRSA",
          },
          href: "/contact",
        },
      ],
      related: [
        {
          label: { en: "Health and wellbeing", th: "สุขภาพและความเป็นอยู่" },
          href: "/student-life/home/health-and-wellbeing",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-wellbeing-cover-thai",
      title: { en: "What your student status pays for", th: "สิทธิที่มาพร้อมสถานะนักศึกษา" },
      summary: {
        en: "You're covered for both routine treatment and accidents as a Thammasat student, at Thammasat University Hospital or through the universal coverage gold card.",
        th: "ในฐานะนักศึกษาธรรมศาสตร์ คุณมีสิทธิทั้งการรักษาทั่วไปและอุบัติเหตุ ที่โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ หรือผ่านบัตรทอง",
      },
      owner: {
        en: "Thammasat University and the student accident insurance scheme, not BIRSA.",
        th: "มหาวิทยาลัยธรรมศาสตร์และประกันอุบัติเหตุนักศึกษาเป็นผู้ดูแล ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "steps",
          title: {
            en: "Treatment at Thammasat University Hospital (Rangsit, not Tha Prachan)",
            th: "การรักษาที่โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ (รังสิต ไม่ใช่ท่าพระจันทร์)",
          },
          items: [
            {
              en: "General treatment: 5,000 baht per visit, up to 20,000 baht per academic year.",
              th: "การรักษาทั่วไป 5,000 บาทต่อครั้ง สูงสุด 20,000 บาทต่อปีการศึกษา",
            },
            {
              en: "Basic dental (check-up, filling, extraction, scaling, X-ray): up to 300 baht per visit, 3 times a year.",
              th: "ทันตกรรมพื้นฐาน (ตรวจ อุด ถอน ขูดหินปูน เอกซเรย์) ไม่เกิน 300 บาทต่อครั้ง 3 ครั้งต่อปีการศึกษา",
            },
            {
              en: "Basic lab tests, national essential medicines, room and standard meals: covered.",
              th: "การตรวจแล็บพื้นฐาน ยาในบัญชียาหลักแห่งชาติ ห้องพักและอาหารมาตรฐาน ครอบคลุมทั้งหมด",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "Separately, if you hold the gold card (บัตรทอง), you can transfer it to Thammasat University Hospital. In an accident or emergency you can use any hospital near where it happened, with no limit on which one.",
            th: "แยกต่างหาก ถ้าถือบัตรทอง สามารถโอนสิทธิมาที่โรงพยาบาลธรรมศาสตร์ได้ ในกรณีอุบัติเหตุหรือฉุกเฉิน สามารถใช้สิทธิที่โรงพยาบาลใดก็ได้ใกล้จุดเกิดเหตุ ไม่จำกัดว่าต้องเป็นโรงพยาบาลไหน",
          },
        },
        {
          kind: "steps",
          title: { en: "Accident insurance", th: "ประกันอุบัติเหตุ" },
          items: [
            {
              en: "Accident treatment: 15,000 baht per accident.",
              th: "การรักษาอุบัติเหตุ 15,000 บาทต่ออุบัติเหตุหนึ่งครั้ง",
            },
            {
              en: "Death, loss of organ, sight, hearing or speech, or permanent disability from accident, assault or murder: 150,000 baht.",
              th: "เสียชีวิต สูญเสียอวัยวะ การมองเห็น การได้ยิน หรือการพูด หรือทุพพลภาพถาวรจากอุบัติเหตุ การถูกทำร้าย หรือถูกฆาตกรรม 150,000 บาท",
            },
            {
              en: "Funeral costs, death from general illness: 15,000 baht.",
              th: "ค่าทำศพ กรณีเสียชีวิตจากการเจ็บป่วยทั่วไป 15,000 บาท",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "The contract hospital for Tha Prachan is Chao Phraya Pinklao Hospital. If you're on the policy there, you can direct claim with no upfront payment. At a hospital that isn't a contract hospital, pay upfront yourself, then bring the documents to your centre's Student Affairs office, who forward them to the insurance company for reimbursement.",
            th: "โรงพยาบาลคู่สัญญาของท่าพระจันทร์คือโรงพยาบาลเจ้าพระยาปิ่นเกล้า ถ้าอยู่ในสิทธิที่นั่น สามารถเคลมตรงได้โดยไม่ต้องสำรองจ่าย ถ้าใช้โรงพยาบาลที่ไม่ใช่คู่สัญญา ต้องสำรองจ่ายเองก่อน แล้วนำเอกสารไปยื่นที่สำนักงานกิจการนักศึกษาประจำศูนย์ เพื่อส่งเรื่องเบิกคืนจากบริษัทประกัน",
          },
        },
      ],
      related: [
        {
          label: { en: "Health and wellbeing", th: "สุขภาพและความเป็นอยู่" },
          href: "/student-life/home/health-and-wellbeing",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-wellbeing-cover-international",
      title: {
        en: "Insurance expectations as an international student",
        th: "ข้อกำหนดเรื่องประกันสำหรับนักศึกษาต่างชาติ",
      },
      summary: {
        en: "Thammasat expects or requires international students to hold valid health insurance for the duration of their stay, sometimes as a visa or enrolment condition. Confirm the specific requirement with TU International Affairs.",
        th: "ธรรมศาสตร์กำหนดหรือคาดหวังให้นักศึกษาต่างชาติมีประกันสุขภาพที่ยังไม่หมดอายุตลอดช่วงที่พำนักอยู่ ในบางกรณีเป็นเงื่อนไขของวีซ่าหรือการลงทะเบียนเรียน ควรตรวจสอบข้อกำหนดที่แน่ชัดกับ TU International Affairs",
      },
      owner: {
        en: "TU International Affairs and your own insurer decide this, not BIRSA.",
        th: "TU International Affairs และบริษัทประกันของคุณเป็นผู้กำหนดเรื่องนี้ ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Keep your insurance documents, physical or digital, accessible in case a hospital asks at check-in. Some students choose a regular clinic or hospital near where they live for routine care in their first few weeks, rather than deciding only when something goes wrong.",
            th: "เตรียมเอกสารประกัน ทั้งฉบับจริงหรือไฟล์ ให้พร้อมหยิบใช้เผื่อโรงพยาบาลขอดูตอนลงทะเบียน นักศึกษาบางคนเลือกคลินิกหรือโรงพยาบาลประจำใกล้ที่พักไว้ตั้งแต่สัปดาห์แรก ๆ แทนที่จะเพิ่งตัดสินใจตอนมีปัญหา",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "Siriraj Hospital, one of Thailand's largest, is directly across the river from Tha Prachan by a short cross-river boat. Private hospitals nearby tend to have shorter waits and more English-speaking staff, at higher cost than public hospitals. Pharmacies, identified by a green cross sign, can often help with minor ailments directly, without needing a doctor's visit; bring the name of your regular medication or its active ingredient, since brand names differ from your home country.",
            th: "โรงพยาบาลศิริราช หนึ่งในโรงพยาบาลที่ใหญ่ที่สุดของไทย อยู่ฝั่งตรงข้ามแม่น้ำจากท่าพระจันทร์ นั่งเรือข้ามฟากไม่กี่นาทีก็ถึง โรงพยาบาลเอกชนแถวนั้นมักรอสั้นกว่าและมีเจ้าหน้าที่พูดภาษาอังกฤษได้มากกว่า แต่ค่าใช้จ่ายสูงกว่าโรงพยาบาลรัฐ ร้านขายยาที่มีป้ายกากบาทเขียวช่วยดูอาการเล็กน้อยได้โดยไม่ต้องพบแพทย์ ควรจำชื่อยาประจำตัวหรือชื่อสารออกฤทธิ์ไปด้วย เพราะชื่อการค้าต่างจากประเทศบ้านเกิด",
          },
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "Thai hospitals are used to treating international patients. If you're unsure how serious something is, get checked.",
            th: "โรงพยาบาลไทยคุ้นเคยกับการรักษาผู้ป่วยต่างชาติ ถ้าไม่แน่ใจว่าอาการรุนแรงแค่ไหน ควรไปตรวจ",
          },
        },
      ],
      related: [
        {
          label: { en: "Healthcare and insurance", th: "การรักษาพยาบาลและประกัน" },
          href: "/student-life/international/healthcare-and-insurance",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-wellbeing-lost-card",
      title: { en: "Report a lost student card", th: "แจ้งบัตรนักศึกษาหาย" },
      summary: {
        en: "Report it to TUSU Tha Prachan so they can post a Lost and Found notice. Your student card also doubles as a bank card.",
        th: "แจ้ง TUSU ท่าพระจันทร์ เพื่อให้ประกาศแจ้งของหาย บัตรนักศึกษายังทำหน้าที่เป็นบัตรธนาคารด้วย",
      },
      owner: {
        en: "TUSU Tha Prachan and Bangkok Bank, not BIRSA.",
        th: "TUSU ท่าพระจันทร์ และธนาคารกรุงเทพเป็นผู้ดูแล ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "If your card doesn't turn up, freeze the account through the Bangkok Bank app, then go in person to the Bangkok Bank branch by the Tha Prachan gate.",
            th: "ถ้าบัตรไม่กลับมา ให้ระงับบัญชีผ่านแอป Bangkok Bank ก่อน แล้วไปที่สาขาธนาคารกรุงเทพบริเวณประตูท่าพระจันทร์ด้วยตัวเอง",
          },
        },
      ],
      related: [
        {
          label: { en: "Safety and emergencies", th: "ความปลอดภัยและเหตุฉุกเฉิน" },
          href: "/student-life/home/safety-and-emergencies",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-wellbeing-scam",
      title: { en: "Decline and walk on", th: "ปฏิเสธแล้วเดินต่อไป" },
      summary: {
        en: "Bangkok's tourist-facing areas near campus occasionally attract scams aimed at both visitors and students. You don't owe anyone an explanation.",
        th: "ย่านที่มีนักท่องเที่ยวใกล้มหาวิทยาลัยบางครั้งมีมิจฉาชีพเล็งเป้าทั้งนักท่องเที่ยวและนักศึกษา คุณไม่จำเป็นต้องอธิบายอะไรกับใคร",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: 'Typical patterns include an unofficial "closed today, but I can take you somewhere better" approach near the Grand Palace, and unsolicited "great deal" offers from strangers.',
            th: "รูปแบบที่พบบ่อยคือคนที่เข้ามาบอกว่า “วันนี้ปิด แต่พาไปที่ที่ดีกว่าได้” แถวพระบรมมหาราชวัง หรือคนแปลกหน้าเสนอ “ดีลสุดพิเศษ” แบบไม่มีปี่มีขลุ่ย",
          },
        },
      ],
      related: [
        {
          label: { en: "Safety and emergencies", th: "ความปลอดภัยและเหตุฉุกเฉิน" },
          href: "/student-life/home/safety-and-emergencies",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-wellbeing-harassment",
      title: { en: "You have the right to report it", th: "คุณมีสิทธิแจ้งเรื่องนี้" },
      summary: {
        en: "If you experience harassment, from another student, staff member, or member of the public, you have options for where to take it.",
        th: "ถ้าคุณเจอการคุกคาม ไม่ว่าจะจากนักศึกษาด้วยกัน เจ้าหน้าที่ หรือบุคคลภายนอก คุณมีทางเลือกว่าจะแจ้งเรื่องกับใครได้บ้าง",
      },
      owner: {
        en: "The faculty office or the university's relevant welfare channel decides on a formal report. BIRSA can help you get started.",
        th: "สำนักงานคณะหรือช่องทางสวัสดิการที่เกี่ยวข้องของมหาวิทยาลัยเป็นผู้พิจารณาเรื่องร้องเรียนอย่างเป็นทางการ BIRSA ช่วยเริ่มเรื่องให้ได้",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Speak to a trusted BIRSA committee member.",
              th: "พูดคุยกับกรรมการ BIRSA ที่คุณไว้ใจ",
            },
            {
              en: "Report it to the faculty office or the university's relevant welfare channel.",
              th: "แจ้งสำนักงานคณะ หรือช่องทางสวัสดิการที่เกี่ยวข้องของมหาวิทยาลัย",
            },
            {
              en: "Contact BIRSA if you're unsure where else to start.",
              th: "ติดต่อ BIRSA ถ้าไม่แน่ใจว่าจะเริ่มจากตรงไหน",
            },
          ],
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      related: [
        {
          label: { en: "Safety and emergencies", th: "ความปลอดภัยและเหตุฉุกเฉิน" },
          href: "/student-life/home/safety-and-emergencies",
        },
      ],
      contactCategory: "problem",
    },

    {
      kind: "outcome",
      id: "out-wellbeing-general-safety",
      title: {
        en: "Tha Prachan is generally a safe campus",
        th: "ท่าพระจันทร์เป็นมหาวิทยาลัยที่ปลอดภัยโดยทั่วไป",
      },
      summary: {
        en: "Take extra care around the river, at night, and around common scams. Security staff are present around campus buildings and gates.",
        th: "ควรระวังเป็นพิเศษบริเวณริมแม่น้ำ ตอนกลางคืน และเรื่องมิจฉาชีพที่พบบ่อย เจ้าหน้าที่รักษาความปลอดภัยประจำอยู่ตามอาคารและประตูต่าง ๆ",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "If something feels wrong, an unfamiliar person loitering, a broken lock, a lighting issue, tell a guard or staff member. The campus AED (automated external defibrillator) is in front of Sri Burapha Auditorium.",
            th: "ถ้ารู้สึกว่ามีอะไรผิดปกติ เช่น คนแปลกหน้าเดินวนอยู่ กุญแจชำรุด หรือไฟส่องสว่างเสีย ให้แจ้งเจ้าหน้าที่รักษาความปลอดภัยหรือบุคลากรที่อยู่แถวนั้น เครื่อง AED (เครื่องกระตุกหัวใจไฟฟ้าอัตโนมัติ) ของมหาวิทยาลัยอยู่หน้าหอประชุมศรีบูรพา",
          },
        },
        {
          kind: "steps",
          title: { en: "River safety", th: "ความปลอดภัยริมแม่น้ำ" },
          items: [
            {
              en: "Wait for boats to fully dock before stepping on or off.",
              th: "รอให้เรือจอดเทียบท่าเรียบร้อยก่อนขึ้นหรือลง",
            },
            {
              en: "Keep bags and phones held securely near the open sides of express boats.",
              th: "ถือกระเป๋าและโทรศัพท์ให้มั่นเมื่ออยู่ใกล้ด้านเปิดของเรือด่วน",
            },
            {
              en: "Avoid piers and railings late at night when lighting is poor.",
              th: "หลีกเลี่ยงท่าเรือและราวกันตกช่วงดึกที่แสงไฟไม่เพียงพอ",
            },
          ],
        },
        {
          kind: "steps",
          title: { en: "Everyday precautions", th: "ข้อควรระวังทั่วไป" },
          items: [
            {
              en: "Share your live location with a friend when travelling alone late at night.",
              th: "แชร์ตำแหน่งเรียลไทม์ให้เพื่อนเมื่อเดินทางคนเดียวตอนดึก",
            },
            {
              en: "Keep a photo of your student ID and important documents saved on your phone in case of loss or theft.",
              th: "เก็บรูปถ่ายบัตรนักศึกษาและเอกสารสำคัญไว้ในโทรศัพท์ เผื่อกรณีทำหายหรือถูกขโมย",
            },
            {
              en: "Save campus security and a trusted contact's number somewhere you can reach quickly.",
              th: "บันทึกเบอร์รักษาความปลอดภัยของมหาวิทยาลัยและผู้ติดต่อที่ไว้ใจได้ไว้ในที่หยิบใช้เร็ว",
            },
          ],
        },
      ],
      related: [
        {
          label: { en: "Safety and emergencies", th: "ความปลอดภัยและเหตุฉุกเฉิน" },
          href: "/student-life/home/safety-and-emergencies",
        },
      ],
    },

    /* ================================================================ */
    /* Topic 2: getting-around                                           */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-around-need",
      question: { en: "What do you need?", th: "ต้องการอะไร" },
      options: [
        {
          id: "reach",
          label: { en: "How to reach Tha Prachan", th: "วิธีเดินทางมาท่าพระจันทร์" },
          next: "out-around-reaching-campus",
        },
        {
          id: "rangsit",
          label: { en: "How to get to Rangsit campus", th: "วิธีเดินทางไปศูนย์รังสิต" },
          next: "out-around-rangsit",
        },
        {
          id: "shuttle",
          label: { en: "The free TU shuttle bus", th: "รถรับส่งฟรีของมหาวิทยาลัย" },
          next: "out-around-shuttle",
        },
        {
          id: "food",
          label: { en: "Somewhere to eat nearby", th: "ที่กินใกล้ ๆ" },
          next: "out-around-food",
        },
        {
          id: "housing",
          label: { en: "Somewhere to live nearby", th: "ที่พักใกล้ ๆ" },
          next: "out-around-housing",
        },
        {
          id: "study",
          label: { en: "A place to study, or the library", th: "ที่อ่านหนังสือ หรือห้องสมุด" },
          next: "q-around-study",
        },
      ],
    },

    {
      kind: "question",
      id: "q-around-study",
      question: { en: "What do you need to do?", th: "ต้องการทำอะไร" },
      options: [
        {
          id: "library",
          label: {
            en: "Find out what the library offers",
            th: "อยากรู้ว่าห้องสมุดมีอะไรให้ใช้บ้าง",
          },
          next: "out-around-library",
        },
        {
          id: "book-room",
          label: { en: "Book a study room", th: "จองห้องอ่านหนังสือ" },
          next: "out-around-book-room",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-around-reaching-campus",
      title: { en: "Reaching Tha Prachan", th: "การเดินทางมาท่าพระจันทร์" },
      summary: {
        en: "Tha Prachan is a compact, historic site opposite Sanam Luang and on the Chao Phraya river, inside Bangkok's old city. Bus, boat, ferry and rail all reach it.",
        th: "ท่าพระจันทร์เป็นวิทยาเขตขนาดกะทัดรัดในย่านเกาะรัตนโกสินทร์ ตรงข้ามสนามหลวงและติดแม่น้ำเจ้าพระยา เดินทางมาได้ทั้งรถเมล์ เรือ เรือข้ามฟาก และรถไฟ",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Bus routes 1, 3, 15, 19, 25, 30, 32, 53, 64, 80, 91, 123, 124, 189, 203, 208, plus the air-conditioned ปอ.32 and ปอ.524, all stop at Sanam Luang or Tha Phra Chan, on the edge of campus.",
            th: "รถเมล์สาย 1, 3, 15, 19, 25, 30, 32, 53, 64, 80, 91, 123, 124, 189, 203, 208 และรถปรับอากาศ ปอ.32 กับ ปอ.524 จอดที่สนามหลวงหรือท่าพระจันทร์ ซึ่งอยู่ติดกับคณะ",
          },
        },
        {
          kind: "steps",
          title: { en: "By boat, ferry or rail", th: "เรือ เรือข้ามฟาก หรือรถไฟ" },
          items: [
            {
              en: "Chao Phraya Express Boat to Tha Phra Nok pier, then the cross-river ferry to Tha Wang Lang pier and walk to Tha Prachan.",
              th: "เรือด่วนเจ้าพระยาไปท่าพระนก แล้วต่อเรือข้ามฟากไปท่าวังหลัง เดินต่อไปท่าพระจันทร์",
            },
            {
              en: "MRT Blue Line to Sanam Chai station, then bus route 32 or 53, or walk through the old city to Tha Prachan.",
              th: "MRT สายสีน้ำเงินลงสถานีสนามไชย ต่อรถเมล์สาย 32 หรือ 53 หรือเดินผ่านเกาะรัตนโกสินทร์ไปท่าพระจันทร์",
            },
            {
              en: "BTS Sukhumvit Line to Victory Monument, then a bus from the Koh Phaya Thai stop to Tha Prachan.",
              th: "BTS สายสุขุมวิทลงอนุสาวรีย์ชัยสมรภูมิ ต่อรถเมล์จากป้ายเกาะพญาไทไปท่าพระจันทร์",
            },
            {
              en: "BTS Silom Line to Taksin, then the Chao Phraya Express Boat to Tha Chang pier and walk to Tha Prachan.",
              th: "BTS สายสีลมลงสถานีตากสิน ต่อเรือด่วนเจ้าพระยาไปท่าช้าง เดินต่อไปท่าพระจันทร์",
            },
          ],
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: '"Thammasat Tha Prachan" alone doesn\'t always register with taxi or ride-hailing drivers; naming a nearby landmark like Sanam Luang or the Grand Palace helps. Streets in the old city are narrow and pavements can be uneven, so wear shoes you can walk in, and allow extra time in the rainy season.',
            th: "บอกแค่ “ธรรมศาสตร์ท่าพระจันทร์” บางครั้งคนขับแท็กซี่หรือแอปเรียกรถอาจไม่รู้จัก ลองบอกจุดสังเกตใกล้เคียงอย่างสนามหลวงหรือพระบรมมหาราชวังแทน ถนนในเกาะรัตนโกสินทร์ค่อนข้างแคบและทางเท้าไม่เรียบ ควรใส่รองเท้าที่เดินสะดวก และเผื่อเวลาเพิ่มในช่วงหน้าฝน",
          },
        },
      ],
      related: [
        {
          label: { en: "Getting around Tha Prachan", th: "การเดินทางในท่าพระจันทร์" },
          href: "/student-life/home/getting-around",
        },
        {
          label: { en: "Food and housing nearby", th: "ที่กินและที่พักใกล้เคียง" },
          href: "/student-life/home/places-nearby",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-around-rangsit",
      title: { en: "Getting to Rangsit campus", th: "การเดินทางไปศูนย์รังสิต" },
      summary: {
        en: "BIR classes are at Tha Prachan, but you may still need Rangsit for a joint faculty event, a central office, or a course held there. Five routes work.",
        th: "การเรียน BIR อยู่ที่ท่าพระจันทร์ แต่บางครั้งอาจต้องไปรังสิตเพื่อกิจกรรมร่วมของมหาวิทยาลัย ติดต่อสำนักงานส่วนกลาง หรือเรียนวิชาที่จัดที่นั่น มีเส้นทางให้เลือก 5 แบบ",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Expressway bus 1-9E, direct from the Sanam Luang stop opposite Tha Prachan: 27 baht, about 1 hour 30 minutes depending on traffic.",
              th: "รถทางด่วนสาย 1-9E ขึ้นตรงจากป้ายสนามหลวงตรงข้ามท่าพระจันทร์ ค่าโดยสาร 27 บาท ใช้เวลาประมาณ 1 ชั่วโมง 30 นาที ขึ้นกับสภาพจราจร",
            },
            {
              en: 'MRT Sanam Chai to Chatuchak Park, then the "Mo Chit to Thammasat Rangsit" van from exit 4: 45 baht plus 45 baht, about 30 minutes plus about 1 hour.',
              th: "MRT สนามไชยไปสวนจตุจักร ต่อรถตู้ “หมอชิต ถึง ธรรมศาสตร์รังสิต” จากทางออก 4 ค่าโดยสาร 45 บาท บวก 45 บาท ใช้เวลาประมาณ 30 นาที บวก 1 ชั่วโมง",
            },
            {
              en: "MRT Sanam Chai to Bang Sue, walk to Krung Thep Aphiwat, then the SRT Red Line to Rangsit, then a taxi or ride-hail to campus: 45 baht plus from 20 baht.",
              th: "MRT สนามไชยไปบางซื่อ เดินไปสถานีกลางกรุงเทพอภิวัฒน์ ต่อรถไฟสายสีแดงไปรังสิต แล้วต่อแท็กซี่หรือเรียกรถเข้ามหาวิทยาลัย ค่าโดยสาร 45 บาท บวกเริ่มต้น 20 บาท",
            },
            {
              en: 'Bus 59 or 503 from Tha Prachan to Victory Monument, then the "Victory Monument to Thammasat Rangsit" van: 25 baht plus 47 baht.',
              th: "รถเมล์สาย 59 หรือ 503 จากท่าพระจันทร์ไปอนุสาวรีย์ชัยสมรภูมิ ต่อรถตู้ “อนุสาวรีย์ชัย ถึง ธรรมศาสตร์รังสิต” ค่าโดยสาร 25 บาท บวก 47 บาท",
            },
            {
              en: "Bus 59 or 503 to Victory Monument, then bus route 510 from Koh Phahonyothin: 25 baht plus 25 baht.",
              th: "รถเมล์สาย 59 หรือ 503 ไปอนุสาวรีย์ชัยสมรภูมิ ต่อรถเมล์สาย 510 จากเกาะพหลโยธิน ค่าโดยสาร 25 บาท บวก 25 บาท",
            },
          ],
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "The expressway bus 1-9E is a single direct journey. The MRT and SRT combination is usually fastest but involves the most changes. Journey times run longer at peak hours.",
            th: "รถทางด่วน 1-9E เดินทางตรงเที่ยวเดียว ส่วน MRT ต่อรถไฟสายสีแดงมักเร็วที่สุดแต่ต้องเปลี่ยนขบวนหลายต่อ ช่วงเวลาเร่งด่วนใช้เวลานานกว่าปกติ",
          },
        },
      ],
      related: [
        {
          label: { en: "Getting around Tha Prachan", th: "การเดินทางในท่าพระจันทร์" },
          href: "/student-life/home/getting-around",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-around-shuttle",
      title: { en: "Take the free TU shuttle", th: "นั่งรถรับส่งฟรีของมหาวิทยาลัย" },
      summary: {
        en: "Two free shuttle lines run Monday to Friday from in front of the Thammasat University Auditorium. Live departures and the full timetable are on the shuttle bus page.",
        th: "รถรับส่งฟรีมี 2 สาย วิ่งวันจันทร์ถึงศุกร์ ขึ้นได้ที่หน้าหอประชุมมหาวิทยาลัยธรรมศาสตร์ ดูเวลารถออกแบบเรียลไทม์และตารางเต็มได้ที่หน้ารถรับส่ง",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Sanam Chai Line: a straight shuttle to the MRT, running 07:45 to 21:30.",
              th: "สายสนามไชย รถรับส่งตรงไปสถานี MRT วิ่ง 07:45 ถึง 21:30 น.",
            },
            {
              en: "Pinklao Line: a loop out to the Pinklao area and back, running 07:00 to 21:30. Two rounds a day also double as dormitory shuttles.",
              th: "สายปิ่นเกล้า วิ่งวนไปย่านปิ่นเกล้าแล้ววนกลับ วิ่ง 07:00 ถึง 21:30 น. รอบรถ 2 รอบต่อวันทำหน้าที่เป็นรถรับส่งหอพักด้วย",
            },
          ],
        },
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "Times are scheduled, not guaranteed. A bus can fall behind in traffic during peak hours; a missed departure is pushed to the next slot rather than skipped. There's no service on Saturdays or Sundays. Track live positions in the Viabus app.",
            th: "เวลาที่แจ้งไว้เป็นตารางเดินรถ ไม่ใช่การรับประกัน ช่วงเร่งด่วนรถอาจล่าช้าเพราะจราจร ถ้าพลาดรอบก็จะเลื่อนไปรอบถัดไป ไม่มีรถวิ่งวันเสาร์และอาทิตย์ ติดตามตำแหน่งรถแบบเรียลไทม์ได้ในแอป Viabus",
          },
        },
      ],
      actions: [
        {
          label: {
            en: "Live departures and full timetable",
            th: "เวลารถออกแบบเรียลไทม์และตารางเต็ม",
          },
          href: "/student-life/home/shuttle-bus",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-around-food",
      title: { en: "Finding food near campus", th: "หาที่กินใกล้คณะ" },
      summary: {
        en: "Food near Tha Prachan is among the best value in Bangkok, away from the tourist-facing streets.",
        th: "อาหารแถวท่าพระจันทร์ถือว่าคุ้มค่าที่สุดแห่งหนึ่งในกรุงเทพ ถ้าหลีกเลี่ยงถนนที่เน้นนักท่องเที่ยว",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Faculty and university canteens, the cheapest option, with rotating rice-and-curry stalls, noodle stands and drinks counters.",
              th: "โรงอาหารของคณะและมหาวิทยาลัย ถูกที่สุด มีร้านข้าวราดแกงหมุนเวียน ร้านก๋วยเตี๋ยว และร้านเครื่องดื่ม",
            },
            {
              en: "Tha Prachan market streets, small family-run shops serving everything from boat noodles to grilled skewers.",
              th: "ตรอกตลาดท่าพระจันทร์ ร้านเล็ก ๆ ของครอบครัวที่ขายตั้งแต่ก๋วยเตี๋ยวเรือไปจนถึงลูกชิ้นปิ้ง",
            },
            {
              en: "Wang Lang (Siriraj) market, across the river by a short boat hop, popular for its range and prices, especially in the evenings.",
              th: "ตลาดวังหลัง (ศิริราช) ข้ามแม่น้ำไปไม่ไกล เป็นที่นิยมเพราะมีให้เลือกเยอะและราคาย่อมเยา โดยเฉพาะช่วงเย็น",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "A few student-recommended stops: นิวย่งฮั้ว for duck and red pork noodles, 50 to 100 baht; หม่าล่าหน้ามอ for fish tofu and bacon-wrapped skewers, from 10 baht a skewer; แซ่บอำหลำ for Isaan food, 20 to 300 baht. LUA Café and ช่างคั่ว both give a 10% discount when you show your student card.",
            th: "ร้านที่นักศึกษาแนะนำ เช่น นิวย่งฮั้ว ก๋วยเตี๋ยวเป็ดและหมูแดง 50 ถึง 100 บาท หม่าล่าหน้ามอ เต้าหู้ปลาและหมูสามชั้นห่อเบคอน เริ่ม 10 บาทต่อไม้ แซ่บอำหลำ อาหารอีสาน 20 ถึง 300 บาท LUA Café และช่างคั่วให้ส่วนลด 10% เมื่อโชว์บัตรนักศึกษา",
          },
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "Small market stalls mostly expect cash, so keep small notes and coins on you.",
            th: "แผงลอยในตลาดส่วนใหญ่รับเงินสด ควรพกแบงก์ย่อยและเหรียญติดตัวไว้",
          },
        },
      ],
      related: [
        {
          label: { en: "Food and housing nearby", th: "ที่กินและที่พักใกล้เคียง" },
          href: "/student-life/home/places-nearby",
          description: {
            en: "A map of around 70 food places numbered for both sides of the river.",
            th: "แผนที่ร้านอาหารราว 70 ร้าน แบ่งเป็นฝั่งเกาะรัตนโกสินทร์และฝั่งปิ่นเกล้า",
          },
        },
        {
          label: { en: "Food and budgeting", th: "เรื่องกินและงบประมาณ" },
          href: "/student-life/home/food-and-budgeting",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-around-housing",
      title: { en: "Finding somewhere to live", th: "หาที่พัก" },
      summary: {
        en: "Around 16 recommended dorms and condos, mostly on the Pinklao and Siriraj side of the river, passed down from BIRSA seniors.",
        th: "มีที่พักแนะนำประมาณ 16 แห่ง ส่วนใหญ่อยู่ฝั่งปิ่นเกล้าและศิริราช ส่งต่อจากรุ่นพี่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: 'Visit in person and check current prices and availability directly with each place before booking. Map pins are approximate, so use each entry\'s "Open in Google Maps" link for exact directions.',
            th: "ควรไปดูสถานที่จริงและเช็กราคากับความว่างโดยตรงกับแต่ละที่ก่อนจอง หมุดบนแผนที่เป็นตำแหน่งโดยประมาณ ใช้ลิงก์ “เปิดใน Google Maps” ของแต่ละที่เพื่อดูเส้นทางที่แม่นยำ",
          },
        },
      ],
      related: [
        {
          label: { en: "Food and housing nearby", th: "ที่กินและที่พักใกล้เคียง" },
          href: "/student-life/home/places-nearby",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-around-library",
      title: {
        en: "What Pridi Banomyong Library offers",
        th: "สิ่งที่หอสมุดปรีดี พนมยงค์ มีให้ใช้",
      },
      summary: {
        en: "Open daily 08:30 to 21:30, except public holidays. Study rooms, borrowing, printing, and research help all live here.",
        th: "เปิดทุกวัน 08:30 ถึง 21:30 น. ยกเว้นวันหยุดนักขัตฤกษ์ มีทั้งห้องอ่านหนังสือ การยืมหนังสือ การพิมพ์งาน และความช่วยเหลือด้านงานวิจัย",
      },
      owner: {
        en: "Pridi Banomyong Library and the faculty libraries, not BIRSA.",
        th: "หอสมุดปรีดี พนมยงค์ และห้องสมุดประจำคณะเป็นผู้ดูแล ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Study rooms and a co-learning space, power sockets and chargers, blankets to borrow, board games, and books in both Thai and English.",
              th: "ห้องอ่านหนังสือและพื้นที่ co-learning ปลั๊กไฟและที่ชาร์จ ผ้าห่มให้ยืม บอร์ดเกม และหนังสือทั้งภาษาไทยและอังกฤษ",
            },
            {
              en: "AI Tools Services, free AI-use and plagiarism checking for your own writing before you submit it.",
              th: "AI Tools Services ตรวจการใช้ AI และการคัดลอกผลงานตัวเองได้ฟรีก่อนส่งงาน",
            },
            {
              en: "Borrowing up to 25 books at a time, for 30 days, plus Book Delivery between branches and Full Text Finder for articles, journals and theses.",
              th: "ยืมหนังสือได้สูงสุด 25 เล่ม นาน 30 วัน มีบริการ Book Delivery ส่งหนังสือข้ามสาขา และ Full Text Finder สำหรับบทความ วารสาร และวิทยานิพนธ์",
            },
            {
              en: "Free printing, 100 baht per semester, at Pridi Banomyong Library floor U2 and the computer room on floor 2 of Puey Ungphakorn Library.",
              th: "โควตาปริ้นท์ฟรี 100 บาทต่อภาคการศึกษา ใช้ได้ที่ชั้น U2 หอสมุดปรีดี พนมยงค์ และห้องคอมพิวเตอร์ชั้น 2 หอสมุดป๋วย อึ๊งภากรณ์",
            },
            {
              en: "Library of Things: laptops, iPads, cameras, extension leads, heaters, hot water bottles and board games, against your student card.",
              th: "Library of Things ยืมได้ทั้งโน้ตบุ๊ก iPad กล้อง ปลั๊กพ่วง เครื่องทำความร้อน กระเป๋าน้ำร้อน และบอร์ดเกม ใช้บัตรนักศึกษายืม",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "The Faculty of Political Science's own Direk Jayanama Library, on floor 5, is open Monday to Friday 08:30 to 19:00, closed on Saturdays, Sundays and public holidays, generally shorter hours than Pridi Banomyong.",
            th: "ห้องสมุด ศ.ดิเรก ชัยนาม ของคณะรัฐศาสตร์เอง อยู่ชั้น 5 เปิดวันจันทร์ถึงศุกร์ 08:30 ถึง 19:00 น. ปิดวันเสาร์ อาทิตย์ และวันหยุดนักขัตฤกษ์ เปิดสั้นกว่าหอสมุดปรีดีทั่วไป",
          },
        },
      ],
      related: [
        {
          label: { en: "Libraries and study support", th: "ห้องสมุดและความช่วยเหลือด้านการเรียน" },
          href: "/student-life/home/study-support",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-around-book-room",
      title: { en: "Booking a study room", th: "จองห้องอ่านหนังสือ" },
      summary: {
        en: "Rooms at Pridi Banomyong Library, including reading rooms, meeting rooms and a film room, are booked through the library's LINE official account.",
        th: "ห้องที่หอสมุดปรีดี พนมยงค์ ทั้งห้องอ่านหนังสือ ห้องประชุม และห้องดูหนัง จองผ่านไลน์ทางการของห้องสมุด",
      },
      owner: {
        en: "Pridi Banomyong Library, not BIRSA.",
        th: "หอสมุดปรีดี พนมยงค์ เป็นผู้ดูแล ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Add the LINE account, @Lifeonline or @TULIBLifeOnline, or scan the library's QR code.",
              th: "เพิ่มเพื่อนไลน์ @Lifeonline หรือ @TULIBLifeOnline หรือสแกน QR code ของห้องสมุด",
            },
            {
              en: "Choose the Booking menu, then choose to book a room.",
              th: "เลือกเมนู Booking แล้วเลือกจองห้อง",
            },
            {
              en: "Choose the room and time slot, and enter the co-booking code.",
              th: "เลือกห้องและช่วงเวลา แล้วกรอกรหัสจองร่วม",
            },
            { en: "Confirm the booking in LINE.", th: "ยืนยันการจองในไลน์" },
          ],
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "The library's LINE account is published under both @Lifeonline and @TULIBLifeOnline. If one handle doesn't add correctly, try the other. The film room comes with free Netflix and HBO Go.",
            th: "ไลน์ของห้องสมุดมีสองชื่อคือ @Lifeonline และ @TULIBLifeOnline ถ้าชื่อหนึ่งเพิ่มเพื่อนไม่ได้ ให้ลองอีกชื่อ ห้องดูหนังมี Netflix และ HBO Go ให้ใช้ฟรี",
          },
        },
      ],
      related: [
        {
          label: { en: "Libraries and study support", th: "ห้องสมุดและความช่วยเหลือด้านการเรียน" },
          href: "/student-life/home/study-support",
        },
      ],
    },

    /* ================================================================ */
    /* Topic 3: rights-and-representation                                */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-rights-need",
      question: { en: "What do you want to know?", th: "อยากรู้เรื่องอะไร" },
      options: [
        {
          id: "activities-rights",
          label: {
            en: "My rights when taking part in student activities",
            th: "สิทธิของฉันเมื่อเข้าร่วมกิจกรรมนักศึกษา",
          },
          next: "out-rights-in-activities",
        },
        {
          id: "dress-title",
          label: { en: "Dress and how I'm addressed", th: "การแต่งกายและคำนำหน้าชื่อ" },
          next: "out-rights-dress-title",
        },
        {
          id: "welfare",
          label: {
            en: "Free welfare and facilities at Tha Prachan",
            th: "สวัสดิการฟรีและสิ่งอำนวยความสะดวกที่ท่าพระจันทร์",
          },
          next: "out-rights-welfare",
        },
        {
          id: "bodies",
          label: {
            en: "The elected student bodies: what they are and how to vote or stand",
            th: "องค์กรนักศึกษาที่มาจากการเลือกตั้ง มีอะไรบ้าง และลงคะแนนหรือลงสมัครอย่างไร",
          },
          next: "q-rights-bodies-which",
        },
        {
          id: "raise-something",
          label: {
            en: "How to raise something with the right body",
            th: "จะยื่นเรื่องกับองค์กรที่ถูกต้องได้อย่างไร",
          },
          next: "out-rights-raise-something",
        },
        {
          id: "election-committees",
          label: {
            en: "Who actually runs these elections",
            th: "ใครเป็นผู้จัดการเลือกตั้งเหล่านี้",
          },
          next: "out-rights-election-committees",
        },
      ],
    },

    {
      kind: "question",
      id: "q-rights-bodies-which",
      question: { en: "Which do you want?", th: "ต้องการทราบเรื่องไหน" },
      options: [
        {
          id: "ladder",
          label: { en: "What the bodies are, at each level", th: "องค์กรมีอะไรบ้างในแต่ละระดับ" },
          next: "out-rights-ladder",
        },
        {
          id: "vote",
          label: {
            en: "Who can vote, and who can stand",
            th: "ใครมีสิทธิลงคะแนน และใครมีสิทธิลงสมัคร",
          },
          next: "out-rights-voting",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-rights-in-activities",
      title: { en: "Your rights in student activities", th: "สิทธิของคุณในการทำกิจกรรมนักศึกษา" },
      summary: {
        en: "In carrying out student activities, you have freedom of expression within the limits of the law and the University's regulations, with regard to being a responsible member of society.",
        th: "ในการทำกิจกรรมนักศึกษา คุณมีเสรีภาพในการแสดงความคิดเห็นภายใต้ขอบเขตของกฎหมายและข้อบังคับมหาวิทยาลัย โดยคำนึงถึงความรับผิดชอบต่อสังคม",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "You have the right to carry out student activities under these objectives: to promote learning and self-training toward responsible citizenship; to promote virtue and ethics; to preserve arts and culture; to promote learning in academic subjects and professions; to promote unity among students; to develop good character, sound health and good human relations; to support creative initiative; and to promote living happily and safely, using resources sustainably.",
            th: "คุณมีสิทธิทำกิจกรรมนักศึกษาภายใต้วัตถุประสงค์เหล่านี้ ส่งเสริมการเรียนรู้และฝึกฝนตนเองให้เป็นพลเมืองที่มีความรับผิดชอบ ส่งเสริมคุณธรรมและจริยธรรม ทำนุบำรุงศิลปวัฒนธรรม ส่งเสริมการเรียนรู้ทางวิชาการและวิชาชีพ ส่งเสริมความสามัคคีของนักศึกษา พัฒนาบุคลิกภาพ สุขภาพ และมนุษยสัมพันธ์ที่ดี สนับสนุนความคิดริเริ่มสร้างสรรค์ และส่งเสริมการดำรงชีวิตอย่างมีความสุขและปลอดภัย ใช้ทรัพยากรอย่างยั่งยืน",
          },
        },
      ],
      citations: [
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 5: Freedom of expression",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 5 เสรีภาพในการแสดงความคิดเห็น",
          },
          href: "/activity/regulations/university-2563#prov-5",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 6: Objectives of activities",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 6 วัตถุประสงค์ของกิจกรรม",
          },
          href: "/activity/regulations/university-2563#prov-6",
        },
      ],
      related: [
        {
          label: { en: "The regulations we hold", th: "ระเบียบที่เรารวบรวมไว้" },
          href: "/activity/regulations",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-rights-dress-title",
      title: {
        en: "Dress and forms of address are your own choice",
        th: "การแต่งกายและคำนำหน้าชื่อเป็นสิทธิของคุณเอง",
      },
      summary: {
        en: "These are entitlements you already have as a Thammasat student, not favours anyone needs to grant you.",
        th: "นี่คือสิทธิที่คุณมีอยู่แล้วในฐานะนักศึกษาธรรมศาสตร์ ไม่ใช่ความกรุณาที่ต้องขอจากใคร",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "You may wear your own clothes on general occasions, including classes and exams, as long as you don't disturb others' concentration or rights.",
              th: "คุณสวมชุดส่วนตัวได้ในโอกาสทั่วไป รวมถึงการเรียนและการสอบ ตราบใดที่ไม่รบกวนสมาธิหรือสิทธิของผู้อื่น",
            },
            {
              en: "You may wear the student uniform according to your own gender identity for classes, exams, placements, university business, ceremonies and faculty events, and be photographed in it the same way.",
              th: "คุณสวมชุดนักศึกษาตามอัตลักษณ์ทางเพศของตัวเองได้ในการเรียน สอบ ฝึกงาน กิจธุระของมหาวิทยาลัย พิธีการ และกิจกรรมของคณะ และถ่ายภาพในชุดนั้นตามอัตลักษณ์ของตัวเองได้เช่นกัน",
            },
            {
              en: "If you're graduating, you may dress in academic dress and submit your graduation photographs according to your own gender identity.",
              th: "ถ้ากำลังจะจบการศึกษา คุณแต่งครุยและส่งรูปถ่ายรับปริญญาตามอัตลักษณ์ทางเพศของตัวเองได้",
            },
            {
              en: "No gendered title is imposed in student business, except where the law or a specific process, such as new student registration, requires one. No title appears on your student card.",
              th: "ไม่มีการบังคับใช้คำนำหน้าชื่อตามเพศในกิจกรรมนักศึกษา ยกเว้นกรณีที่กฎหมายหรือกระบวนการเฉพาะ เช่น การขึ้นทะเบียนนักศึกษาใหม่ กำหนดไว้ บัตรนักศึกษาไม่มีคำนำหน้าชื่อ",
            },
          ],
        },
      ],
      related: [
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-rights-welfare",
      title: {
        en: "Free welfare and facilities at Tha Prachan",
        th: "สวัสดิการฟรีและสิ่งอำนวยความสะดวกที่ท่าพระจันทร์",
      },
      summary: {
        en: "Free menstrual products, a condom dispenser, and a handful of facilities are already there for you to use.",
        th: "ผลิตภัณฑ์อนามัยฟรี ตู้ถุงยางอนามัย และสิ่งอำนวยความสะดวกอีกหลายอย่างพร้อมให้ใช้อยู่แล้ว",
      },
      owner: {
        en: "The University and the Faculty provide these, not BIRSA.",
        th: "มหาวิทยาลัยและคณะเป็นผู้จัดให้ ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Free menstrual products are available from your own faculty, or from the TUSU Tha Prachan room. A condom dispenser is on floor 1 of the student activity building.",
            th: "รับผลิตภัณฑ์อนามัยฟรีได้ที่คณะของคุณ หรือที่ห้อง TUSU ท่าพระจันทร์ ตู้ถุงยางอนามัยอยู่ชั้น 1 อาคารกิจกรรมนักศึกษา",
          },
        },
        {
          kind: "steps",
          title: { en: "Facilities", th: "สิ่งอำนวยความสะดวก" },
          items: [
            {
              en: "Fitness room, beside the gymnasium building, Monday to Friday 14:00 to 20:00.",
              th: "ห้องฟิตเนส ข้างอาคารยิม เปิดวันจันทร์ถึงศุกร์ 14:00 ถึง 20:00 น.",
            },
            {
              en: "Student lounge, floor 3 of the student activity building, Monday to Friday 10:00 to 20:00.",
              th: "ห้องพักนักศึกษา ชั้น 3 อาคารกิจกรรมนักศึกษา เปิดวันจันทร์ถึงศุกร์ 10:00 ถึง 20:00 น.",
            },
            {
              en: "Tha Prachan Computer Service Center, in the gymnasium building, Monday to Friday 08:00 to 19:00.",
              th: "ศูนย์บริการคอมพิวเตอร์ท่าพระจันทร์ ในอาคารยิม เปิดวันจันทร์ถึงศุกร์ 08:00 ถึง 19:00 น.",
            },
          ],
        },
      ],
      related: [
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-rights-ladder",
      title: {
        en: "The ladder of elected bodies open to you",
        th: "บันไดองค์กรที่มาจากการเลือกตั้งที่คุณลงสมัครได้",
      },
      summary: {
        en: "There's a ladder of elected student bodies at four levels: your programme, your faculty, your campus, and the university as a whole.",
        th: "องค์กรนักศึกษาที่มาจากการเลือกตั้งมีอยู่ 4 ระดับ คือระดับสาขา ระดับคณะ ระดับศูนย์การศึกษา และระดับมหาวิทยาลัย",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "BIR (programme level): BIRSA and the BIR cohort committee (คกร. BIR) for your year.",
              th: "ระดับ BIR (สาขา) BIRSA และ คกร. BIR ของรุ่นคุณ",
            },
            {
              en: "Singhadang, the Faculty of Political Science: the Political Science Student Committee (กนศ.ร.) and the faculty cohort committee (คกร.) for your year.",
              th: "สิงห์แดง คณะรัฐศาสตร์ กนศ.ร. และ คกร. ของรุ่นคุณ",
            },
            {
              en: "TPC, Tha Prachan Campus: TUSU TPC and TUSC TPC, the campus branches of the university student union and council.",
              th: "TPC ศูนย์ท่าพระจันทร์ TUSU TPC และ TUSC TPC ซึ่งเป็นสาขาระดับศูนย์ของ TUSU และ TUSC",
            },
            {
              en: "TU, Thammasat University as a whole: TUSU, TUSC, and the Election Commission of Thammasat University (ECTU).",
              th: "TU ทั้งมหาวิทยาลัย TUSU, TUSC และคณะกรรมการการเลือกตั้งมหาวิทยาลัยธรรมศาสตร์ (ECTU)",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "Running for any of these represents BIR students beyond BIRSA itself.",
            th: "การลงสมัครองค์กรเหล่านี้คือการเป็นตัวแทนนักศึกษา BIR ในระดับที่กว้างกว่า BIRSA เอง",
          },
        },
      ],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 6: Establishment of the PSC",
            th: "ประกาศ พ.ศ. 2565 ข้อ 6 การจัดตั้ง กนศ.ร.",
          },
          href: "/activity/regulations/political-science-2565#prov-6",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 24: Establishment of BIRSA",
            th: "ประกาศ พ.ศ. 2565 ข้อ 24 การจัดตั้ง BIRSA",
          },
          href: "/activity/regulations/political-science-2565#prov-24",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 55: Establishment of the คกร.",
            th: "ประกาศ พ.ศ. 2565 ข้อ 55 การจัดตั้ง คกร.",
          },
          href: "/activity/regulations/political-science-2565#prov-55",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 62: Establishment of the คกร. BIR",
            th: "ประกาศ พ.ศ. 2565 ข้อ 62 การจัดตั้ง คกร. BIR",
          },
          href: "/activity/regulations/political-science-2565#prov-62",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 7: Composition of the TUSC, including the Tha Prachan Campus council",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 7 องค์ประกอบของสภานักศึกษา รวมถึงสภานักศึกษาระดับศูนย์ท่าพระจันทร์",
          },
          href: "/activity/regulations/university-2563#prov-7",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 36: Campus TUSU executive committees, including Tha Prachan",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 36 คณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ รวมถึงท่าพระจันทร์",
          },
          href: "/activity/regulations/university-2563#prov-36",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 80: Composition of the Election Commission of Thammasat University",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 80 องค์ประกอบของคณะกรรมการการเลือกตั้ง",
          },
          href: "/activity/regulations/university-2563#prov-80",
        },
      ],
      related: [
        {
          label: { en: "Student bodies you can run for", th: "องค์กรนักศึกษาที่คุณลงสมัครได้" },
          href: "/activity/student-bodies",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-rights-voting",
      title: {
        en: "Who can vote, and who can stand",
        th: "ใครมีสิทธิลงคะแนน และใครมีสิทธิลงสมัคร",
      },
      summary: {
        en: "As a Thammasat student you vote in three university-wide elections, plus BIRSA and the PSC as a BIR student. Eligibility to stand has a common baseline across all of them.",
        th: "ในฐานะนักศึกษาธรรมศาสตร์ คุณมีสิทธิลงคะแนนใน 3 การเลือกตั้งระดับมหาวิทยาลัย บวกกับ BIRSA และ กนศ.ร. ในฐานะนักศึกษา BIR คุณสมบัติผู้สมัครมีเกณฑ์พื้นฐานร่วมกันในทุกองค์กร",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "You vote in the TUSC, elected at campus level; the TUSU, at both campus level (TUSU Tha Prachan) and central level; and your own faculty or programme's student committee. As a BIR student you also vote for BIRSA and, as a Faculty of Political Science student, for the PSC.",
            th: "คุณมีสิทธิลงคะแนนเลือก TUSC ระดับศูนย์การศึกษา TUSU ทั้งระดับศูนย์ (TUSU ท่าพระจันทร์) และระดับมหาวิทยาลัย และคณะกรรมการนักศึกษาประจำคณะหรือสาขาของคุณเอง ในฐานะนักศึกษา BIR คุณยังมีสิทธิเลือก BIRSA และในฐานะนักศึกษาคณะรัฐศาสตร์ มีสิทธิเลือก กนศ.ร. ด้วย",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "To stand for any of these, the common baseline is an academic record of at least 2.00, no student disciplinary punishment in the year before applying, and studying within your programme's normal duration (4, 5 or 6 years depending on the curriculum).",
            th: "เกณฑ์พื้นฐานร่วมกันในการลงสมัครทุกองค์กรคือ ผลการศึกษาเฉลี่ยไม่ต่ำกว่า 2.00 ไม่เคยถูกลงโทษวินัยนักศึกษาในหนึ่งปีก่อนสมัคร และศึกษาอยู่ในระยะเวลาปกติของหลักสูตร (4, 5 หรือ 6 ปี ตามหลักสูตร)",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "role", is: "officer" },
          text: {
            en: "Holding one position can rule you out of standing for another: sitting on the TUSU Executive Committee, a Faculty Student Committee, the Student Dormitory Committee, or a club executive committee makes you ineligible for the TUSC, and being a TUSC member makes you ineligible for TUSU President or Vice-President. A current member of the Election Commission can't also be on the TUSC, the TUSU Executive Committee, a Faculty Student Committee, the Student Dormitory Committee, or a club executive committee.",
            th: "การดำรงตำแหน่งหนึ่งอาจทำให้ขาดคุณสมบัติลงสมัครอีกตำแหน่งหนึ่ง เช่น การเป็นกรรมการบริหารองค์การนักศึกษา คณะกรรมการนักศึกษาประจำคณะ คณะกรรมการหอพักนักศึกษา หรือกรรมการบริหารชุมนุม ทำให้ขาดคุณสมบัติสมัครสมาชิกสภานักศึกษา และการเป็นสมาชิกสภานักศึกษาก็ทำให้ขาดคุณสมบัติสมัครนายกหรืออุปนายกองค์การนักศึกษา กรรมการการเลือกตั้งที่ดำรงตำแหน่งอยู่ก็เป็นสมาชิกสภานักศึกษา กรรมการบริหารองค์การนักศึกษา กรรมการนักศึกษาประจำคณะ กรรมการหอพักนักศึกษา หรือกรรมการบริหารชุมนุม พร้อมกันไม่ได้เช่นกัน",
          },
        },
      ],
      citations: [
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 14: Right to vote in the TUSC election",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 14 สิทธิลงคะแนนเสียงเลือกตั้งสภานักศึกษา",
          },
          href: "/activity/regulations/university-2563#prov-14",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 15: Eligibility to stand for the TUSC",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 15 คุณสมบัติผู้สมัครสภานักศึกษา",
          },
          href: "/activity/regulations/university-2563#prov-15",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 43: Electorate for the TUSU President",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 43 ผู้มีสิทธิเลือกตั้งนายกองค์การนักศึกษา",
          },
          href: "/activity/regulations/university-2563#prov-43",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 44: Eligibility to stand for TUSU President or Vice-President",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 44 คุณสมบัติผู้สมัครนายกและอุปนายกองค์การนักศึกษา",
          },
          href: "/activity/regulations/university-2563#prov-44",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 10: Electorate for the PSC",
            th: "ประกาศ พ.ศ. 2565 ข้อ 10 ผู้มีสิทธิเลือกตั้ง กนศ.ร.",
          },
          href: "/activity/regulations/political-science-2565#prov-10",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 11: Eligibility to stand for the PSC",
            th: "ประกาศ พ.ศ. 2565 ข้อ 11 คุณสมบัติผู้สมัคร กนศ.ร.",
          },
          href: "/activity/regulations/political-science-2565#prov-11",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 27: Right to vote for BIRSA",
            th: "ประกาศ พ.ศ. 2565 ข้อ 27 สิทธิเลือกตั้ง BIRSA",
          },
          href: "/activity/regulations/political-science-2565#prov-27",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 28: Eligibility to stand for BIRSA",
            th: "ประกาศ พ.ศ. 2565 ข้อ 28 คุณสมบัติผู้สมัคร BIRSA",
          },
          href: "/activity/regulations/political-science-2565#prov-28",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 82: Election Commission qualifications and prohibited characteristics",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 82 คุณสมบัติและลักษณะต้องห้ามของกรรมการการเลือกตั้ง",
          },
          href: "/activity/regulations/university-2563#prov-82",
          when: { fact: "role", is: "officer" },
        },
      ],
      related: [
        {
          label: { en: "Student bodies you can run for", th: "องค์กรนักศึกษาที่คุณลงสมัครได้" },
          href: "/activity/student-bodies",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-rights-raise-something",
      title: { en: "Take it to the right body", th: "ยื่นเรื่องกับองค์กรที่ถูกต้อง" },
      summary: {
        en: "Where you take something depends on what it is, and whether you already sit on the body concerned.",
        th: "จะยื่นเรื่องกับใครขึ้นอยู่กับว่าเรื่องนั้นเกี่ยวกับอะไร และคุณอยู่ในองค์กรที่เกี่ยวข้องอยู่แล้วหรือไม่",
      },
      owner: {
        en: "Whichever body the issue actually belongs to: the Registrar's office, your faculty student committee, or TUSU Tha Prachan, not BIRSA.",
        th: "องค์กรที่เกี่ยวข้องโดยตรงกับเรื่องนั้น เช่น สำนักงานทะเบียน คณะกรรมการนักศึกษาประจำคณะ หรือ TUSU ท่าพระจันทร์ ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Registration issues go to your faculty and the university Registrar's office. Course content, fees, or anything specific to your own programme goes to your faculty student committee (the PSC) first, since rules and conditions differ by faculty. General matters can go to TUSU Tha Prachan.",
            th: "เรื่องการลงทะเบียนแจ้งที่คณะและสำนักงานทะเบียนมหาวิทยาลัย เรื่องเนื้อหาวิชา ค่าธรรมเนียม หรือเรื่องเฉพาะของสาขาคุณ ให้แจ้งคณะกรรมการนักศึกษาประจำคณะ (กนศ.ร.) ก่อน เพราะกฎเกณฑ์และเงื่อนไขต่างกันไปในแต่ละคณะ เรื่องทั่วไปแจ้ง TUSU ท่าพระจันทร์ได้",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "role", is: "officer" },
          text: {
            en: "If you already sit on a committee, this is your body's job to take up, not just something to pass along. The PSC and BIRSA both meet at least twice a month during term, and a committee member can put an item on the agenda by a written submission to the chair.",
            th: "ถ้าคุณอยู่ในคณะกรรมการอยู่แล้ว เรื่องนี้เป็นหน้าที่ขององค์กรของคุณที่ต้องหยิบขึ้นมาพิจารณาเอง ไม่ใช่แค่ส่งต่อให้คนอื่น ทั้ง กนศ.ร. และ BIRSA ประชุมอย่างน้อยเดือนละ 2 ครั้งระหว่างเปิดภาคการศึกษา และกรรมการเสนอเรื่องเข้าวาระการประชุมได้ด้วยการทำเป็นหนังสือถึงประธาน",
          },
        },
        {
          kind: "paragraph",
          when: { fact: "role", is: "student" },
          text: {
            en: "If you don't sit on a committee, take it to your representative instead: your คกร. (cohort committee), BIRSA, or the PSC, depending on what it's about.",
            th: "ถ้าคุณไม่ได้อยู่ในคณะกรรมการ ให้ยื่นเรื่องผ่านตัวแทนของคุณแทน อาจเป็น คกร. ของรุ่น BIRSA หรือ กนศ.ร. แล้วแต่ว่าเรื่องนั้นเกี่ยวกับอะไร",
          },
        },
      ],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 22: PSC meetings and quorum",
            th: "ประกาศ พ.ศ. 2565 ข้อ 22 การประชุมและองค์ประชุม กนศ.ร.",
          },
          href: "/activity/regulations/political-science-2565#prov-22",
          when: { fact: "role", is: "officer" },
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 38: BIRSA meetings and quorum",
            th: "ประกาศ พ.ศ. 2565 ข้อ 38 การประชุมและองค์ประชุม BIRSA",
          },
          href: "/activity/regulations/political-science-2565#prov-38",
          when: { fact: "role", is: "officer" },
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 50: Setting the meeting agenda",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 50 การกำหนดระเบียบวาระการประชุม",
          },
          href: "/activity/regulations/university-2563#prov-50",
          when: { fact: "role", is: "officer" },
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 61: Powers of the คกร.",
            th: "ประกาศ พ.ศ. 2565 ข้อ 61 อำนาจของ คกร.",
          },
          href: "/activity/regulations/political-science-2565#prov-61",
          when: { fact: "role", is: "student" },
        },
      ],
      actions: [
        {
          label: { en: "Ask BIRSA if you're not sure", th: "ถ้าไม่แน่ใจ ถามได้ที่ BIRSA" },
          href: "/contact",
        },
      ],
      related: [
        {
          label: { en: "Student bodies you can run for", th: "องค์กรนักศึกษาที่คุณลงสมัครได้" },
          href: "/activity/student-bodies",
        },
      ],
      contactCategory: "problem",
    },

    {
      kind: "outcome",
      id: "out-rights-election-committees",
      title: { en: "Who runs these elections", th: "ใครเป็นผู้จัดการเลือกตั้งเหล่านี้" },
      summary: {
        en: "A separate election committee runs the PSC and BIRSA elections at Faculty level; a university-wide Election Commission runs the TUSC and TUSU elections.",
        th: "การเลือกตั้ง กนศ.ร. และ BIRSA มีคณะกรรมการการเลือกตั้งของตัวเองระดับคณะ ส่วนการเลือกตั้ง TUSC และ TUSU มีคณะกรรมการการเลือกตั้งระดับมหาวิทยาลัย",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "The Faculty Election Committee (กกต.ร.) runs the PSC election. It's chaired ex officio by the Faculty administrator who oversees student affairs, with up to 2 full-time lecturers, up to 4 officers from the Faculty's student activities office, and 1 คกร. representative per undergraduate year, who can't themselves be a candidate that year. It's selected within 30 days of the second semester opening, and ends once the PSC is appointed.",
            th: "คณะกรรมการการเลือกตั้ง คณะรัฐศาสตร์ (กกต.ร.) เป็นผู้จัดการเลือกตั้ง กนศ.ร. มีผู้บริหารคณะที่ดูแลกิจการนักศึกษาเป็นประธานโดยตำแหน่ง อาจารย์ประจำคณะไม่เกิน 2 คน เจ้าหน้าที่งานกิจกรรมนักศึกษาคณะไม่เกิน 4 คน และตัวแทน คกร. ชั้นปีละ 1 คน ซึ่งต้องไม่เป็นผู้สมัครในปีนั้น สรรหาให้เสร็จภายใน 30 วันหลังเปิดภาคการศึกษาที่ 2 และหมดวาระเมื่อประกาศแต่งตั้ง กนศ.ร. แล้ว",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "The BIR Election Committee (กกต.BIR) works the same way for the BIRSA election: chaired by the Faculty administrator who oversees the international programme, with up to 2 lecturers, up to 3 officers responsible for BIR student affairs, and 1 BIR student representative per year.",
            th: "คณะกรรมการเลือกตั้ง สาขา BIR (กกต.BIR) ทำหน้าที่เดียวกันสำหรับการเลือกตั้ง BIRSA มีผู้บริหารคณะที่ดูแลโครงการหลักสูตรนานาชาติเป็นประธาน อาจารย์ไม่เกิน 2 คน เจ้าหน้าที่ดูแลกิจการนักศึกษา BIR ไม่เกิน 3 คน และตัวแทนนักศึกษา BIR ชั้นปีละ 1 คน",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "At university level, the Election Commission of Thammasat University runs the TUSC and TUSU elections: 9 undergraduate students sought out and nominated, serving 1-year terms renewable once, approved by the TUSC before the Rector appoints them.",
            th: "ในระดับมหาวิทยาลัย คณะกรรมการการเลือกตั้งมหาวิทยาลัยธรรมศาสตร์เป็นผู้จัดการเลือกตั้ง TUSC และ TUSU ประกอบด้วยนักศึกษาปริญญาตรีที่ได้รับการสรรหา 9 คน วาระคราวละ 1 ปี ดำรงตำแหน่งติดต่อกันได้ไม่เกิน 2 วาระ ต้องได้รับความเห็นชอบจากสภานักศึกษาก่อนอธิการบดีแต่งตั้ง",
          },
        },
      ],
      citations: [
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 69: Establishment of the กกต.ร.",
            th: "ประกาศ พ.ศ. 2565 ข้อ 69 การจัดตั้ง กกต.ร.",
          },
          href: "/activity/regulations/political-science-2565#prov-69",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 70: Composition of the กกต.ร.",
            th: "ประกาศ พ.ศ. 2565 ข้อ 70 องค์ประกอบของ กกต.ร.",
          },
          href: "/activity/regulations/political-science-2565#prov-70",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 75: Establishment of the กกต.BIR",
            th: "ประกาศ พ.ศ. 2565 ข้อ 75 การจัดตั้ง กกต.BIR",
          },
          href: "/activity/regulations/political-science-2565#prov-75",
        },
        {
          label: {
            en: "Notice B.E. 2565, ข้อ 76: Composition of the กกต.BIR",
            th: "ประกาศ พ.ศ. 2565 ข้อ 76 องค์ประกอบของ กกต.BIR",
          },
          href: "/activity/regulations/political-science-2565#prov-76",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 80: Composition of the Election Commission of Thammasat University",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 80 องค์ประกอบของคณะกรรมการการเลือกตั้ง",
          },
          href: "/activity/regulations/university-2563#prov-80",
        },
        {
          label: {
            en: "Regulation B.E. 2563, ข้อ 81: Term of office",
            th: "ข้อบังคับ พ.ศ. 2563 ข้อ 81 วาระการดำรงตำแหน่ง",
          },
          href: "/activity/regulations/university-2563#prov-81",
        },
      ],
      related: [
        {
          label: { en: "Student bodies you can run for", th: "องค์กรนักศึกษาที่คุณลงสมัครได้" },
          href: "/activity/student-bodies",
        },
      ],
    },
  ],
};
