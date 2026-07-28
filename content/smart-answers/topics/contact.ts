/**
 * Two smart answers that share one theme: getting to the right person.
 *
 * "who-to-contact" (`q-contact-topic`) is the general triage: equipment,
 * clubs, registration, programme matters, the internship, representation,
 * events, or a fallback to BIRSA. It reuses the routing already verified in
 * `content/student-life/en/home/rights-and-welfare.mdx` and
 * `.../safety-and-emergencies.mdx` (registration to the Registrar, programme
 * matters to the faculty student committee, general matters to TUSU Tha
 * Prachan), the elected-body ladder in `content/activity/en/student-bodies.mdx`,
 * and the BIR programme office contact in `content/activity/en/bir-programme.mdx`.
 *
 * "raise-a-problem" (`q-problem-kind`) is narrower: someone already has a
 * problem and needs to know who receives it, what happens next, and what
 * protection exists. Registration and teaching problems reuse the same
 * subject-based routing. Harassment or misconduct by another student is
 * grounded in the University Regulation on Student Discipline, B.E. 2568
 * (`content/activity/regulations/discipline-2568`): ข้อ 7(2) defines the
 * conduct, ข้อ 13 to 24 set out how the Dean has to act on a report, and ข้อ
 * 14 adds the specific protections that apply when the report concerns an
 * act of a sexual nature. Problems with a club, a student body, or the
 * Faculty itself have no equivalent procedural regulation on file, so they
 * route to BIRSA or `out-not-covered` rather than inventing a process.
 *
 * BIRSA is a student association, not a university office (see
 * `content/site.ts` `officialLinks`), so most outcomes in both topics hand
 * off to the real office or elected body responsible.
 */
import type { SmartAnswerService } from "../types";

export const contact: SmartAnswerService = {
  topics: [
    {
      slug: "who-to-contact",
      title: {
        en: "Find the right person to contact",
        th: "หาคนที่ใช่สำหรับติดต่อ",
      },
      lede: {
        en: "A couple of quick questions to point you to the right place, from equipment loans to who represents you.",
        th: "ตอบคำถามสั้น ๆ เพื่อหาช่องทางที่ใช่ ตั้งแต่การยืมอุปกรณ์ไปจนถึงว่าใครเป็นตัวแทนนักศึกษาของคุณ",
      },
      group: "help",
      start: "q-contact-topic",
      whatYoullNeed: [
        { en: "A rough idea of what your question is about", th: "เรื่องคร่าว ๆ ที่อยากสอบถาม" },
      ],
      keywords: [
        "contact",
        "who do i ask",
        "email",
        "phone",
        "office",
        "ติดต่อ",
        "สอบถาม",
        "เบอร์โทร",
        "อีเมล",
      ],
    },
    {
      slug: "raise-a-problem",
      title: {
        en: "Raise a problem or complaint",
        th: "แจ้งปัญหาหรือร้องเรียน",
      },
      lede: {
        en: "Who receives this, what happens next, and what protections apply, depending on what the problem is.",
        th: "ใครเป็นผู้รับเรื่อง ขั้นตอนต่อไปคืออะไร และมีสิทธิคุ้มครองอะไรบ้าง ขึ้นอยู่กับประเภทของปัญหา",
      },
      group: "rights",
      start: "q-problem-kind",
      whatYoullNeed: [
        { en: "What kind of problem this is", th: "ประเภทของปัญหาที่เจอ" },
        {
          en: "Whether it involves another student, a course, or the Faculty",
          th: "เกี่ยวข้องกับนักศึกษาคนอื่น รายวิชา หรือคณะ",
        },
      ],
      keywords: [
        "complaint",
        "problem",
        "harassment",
        "report",
        "rights",
        "ร้องเรียน",
        "แจ้งปัญหา",
        "คุกคาม",
        "สิทธิ",
      ],
    },
  ],

  nodes: [
    /* ------------------------------------------------------------------ */
    /* Topic 1: who to contact                                            */
    /* ------------------------------------------------------------------ */

    {
      kind: "question",
      id: "q-contact-topic",
      question: {
        en: "What do you need help with?",
        th: "คุณต้องการความช่วยเหลือเรื่องอะไร",
      },
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
          id: "equipment",
          label: { en: "Borrowing equipment", th: "ยืมอุปกรณ์" },
          next: "out-contact-equipment",
        },
        {
          id: "clubs",
          label: {
            en: "Clubs: joining or starting one",
            th: "เรื่องชมรม (เข้าร่วมหรือเริ่มใหม่)",
          },
          next: "q-contact-clubs",
        },
        {
          id: "registration",
          label: {
            en: "Registration, enrolment, or official transcripts",
            th: "การลงทะเบียน การขึ้นทะเบียน หรือใบแสดงผลการเรียน",
          },
          next: "out-contact-registrar",
        },
        {
          id: "programme",
          label: {
            en: "Course content, fees, or another BIR programme matter",
            th: "เนื้อหารายวิชา ค่าใช้จ่าย หรือเรื่องอื่นของหลักสูตร BIR",
          },
          next: "out-contact-programme",
        },
        {
          id: "internship",
          label: {
            en: "The third-year summer internship",
            th: "การฝึกงานภาคฤดูร้อนของชั้นปีที่ 3",
          },
          next: "out-contact-internship",
        },
        {
          id: "representation",
          label: {
            en: "Who represents me, or how to run for a student body",
            th: "ใครเป็นตัวแทนนักศึกษา หรือวิธีลงสมัครองค์กรนักศึกษา",
          },
          next: "out-contact-representation",
        },
        {
          id: "events",
          label: { en: "What's on, or upcoming events", th: "กิจกรรมที่กำลังจะจัดขึ้น" },
          next: "out-contact-events",
        },
        {
          id: "problem",
          label: {
            en: "A problem, complaint, or something about my rights",
            th: "แจ้งปัญหา ร้องเรียน หรือเรื่องสิทธิของตัวเอง",
          },
          next: "q-problem-kind",
        },
        {
          id: "other",
          label: {
            en: "Something else, or general feedback",
            th: "เรื่องอื่น ๆ หรือข้อเสนอแนะทั่วไป",
          },
          next: "out-contact-birsa",
        },
      ],
    },

    {
      kind: "question",
      id: "q-contact-clubs",
      question: {
        en: "Do you want to join an existing club, or start a new one?",
        th: "คุณต้องการเข้าร่วมชมรมที่มีอยู่แล้ว หรือเริ่มชมรมใหม่",
      },
      options: [
        {
          id: "join",
          label: { en: "Join an existing club", th: "เข้าร่วมชมรมที่มีอยู่" },
          next: "out-contact-clubs-join",
        },
        {
          id: "start",
          label: { en: "Start a new club", th: "เริ่มชมรมใหม่" },
          next: "out-contact-clubs-start",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-contact-equipment",
      title: { en: "Equipment loans", th: "บริการยืมอุปกรณ์" },
      summary: {
        en: "BIRSA lends out equipment like cameras and speakers at no charge.",
        th: "BIRSA มีอุปกรณ์ให้ยืมฟรี เช่น กล้องและลำโพง",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "For sports equipment, borrow from your own faculty, or from the TUSU Tha Prachan room on floor 2 of the student activity building. Bring your student card.",
            th: "สำหรับอุปกรณ์กีฬา ยืมได้ที่คณะของตัวเอง หรือที่ห้อง อมธ. ท่าพระจันทร์ ชั้น 2 อาคารกิจกรรมนักศึกษา อย่าลืมนำบัตรนักศึกษาไปด้วย",
          },
        },
      ],
      actions: [
        {
          label: { en: "Go to equipment loans", th: "ไปหน้าบริการยืมอุปกรณ์" },
          href: "/information-services/equipment-loan",
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
      id: "out-contact-clubs-join",
      title: { en: "Find a club to join", th: "หาชมรมที่อยากเข้าร่วม" },
      summary: {
        en: "Browse existing clubs and see how to join.",
        th: "ดูรายชื่อชมรมที่มีอยู่และวิธีเข้าร่วม",
      },
      actions: [{ label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" }, href: "/clubs" }],
    },

    {
      kind: "outcome",
      id: "out-contact-clubs-start",
      title: { en: "Start a new club", th: "เริ่มชมรมใหม่" },
      summary: {
        en: "If nothing existing covers your idea, BIRSA can help you start a club.",
        th: "ถ้ายังไม่มีชมรมที่ตรงกับไอเดียของคุณ BIRSA ช่วยให้เกิดขึ้นจริงได้",
      },
      actions: [
        {
          label: { en: "Check if you're ready to start a club", th: "เช็กความพร้อมก่อนเริ่มชมรม" },
          href: "/answers/start-a-club-check",
        },
        { label: { en: "Start a club", th: "เริ่มชมรมใหม่" }, href: "/clubs/start" },
      ],
    },

    {
      kind: "outcome",
      id: "out-contact-registrar",
      title: {
        en: "Contact your faculty and the Registrar's office",
        th: "ติดต่อคณะและสำนักงานทะเบียน",
      },
      summary: {
        en: "Registration, enrolment, and official transcripts go through your faculty and the university Registrar's office, not BIRSA.",
        th: "เรื่องการลงทะเบียน การขึ้นทะเบียน และใบแสดงผลการเรียน ดำเนินการผ่านคณะและสำนักงานทะเบียนของมหาวิทยาลัย ไม่ใช่ BIRSA",
      },
      owner: {
        en: "The Faculty office and the TU Registrar decide these matters. BIRSA cannot process them for you.",
        th: "สำนักงานคณะและสำนักทะเบียน มธ. เป็นผู้ดำเนินการเรื่องนี้ BIRSA ไม่สามารถดำเนินการแทนได้",
      },
      actions: [
        {
          label: { en: "TU Registrar", th: "สำนักทะเบียน มธ." },
          href: "https://www.reg.tu.ac.th",
          external: true,
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
      id: "out-contact-programme",
      title: {
        en: "Contact BIRSA, or the BIR programme office directly",
        th: "ติดต่อ BIRSA หรือสำนักงานหลักสูตร BIR โดยตรง",
      },
      summary: {
        en: "Course content and other programme matters go to your faculty student committee first, because rules differ between faculties. For BIR, that committee is BIRSA. For fees or anything that needs the programme office directly, contact it yourself.",
        th: "เรื่องเนื้อหารายวิชาและเรื่องอื่นของหลักสูตร ให้ติดต่อกรรมการนักศึกษาประจำคณะก่อน เพราะแต่ละคณะมีเงื่อนไขต่างกัน สำหรับ BIR กรรมการนักศึกษาคือ BIRSA ส่วนค่าใช้จ่ายหรือเรื่องที่ต้องติดต่อสำนักงานหลักสูตรโดยตรง ให้ติดต่อได้เอง",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "BIRSA is BIR's own elected faculty student committee. For official academic matters (fees, enrolment, forms that need the programme office's signature), contact the BIR programme office directly.",
            th: "BIRSA คือคณะกรรมการนักศึกษาประจำสาขา BIR ที่มาจากการเลือกตั้ง สำหรับเรื่องทางการของหลักสูตร เช่น ค่าใช้จ่าย การขึ้นทะเบียน หรือแบบฟอร์มที่ต้องมีลายเซ็นสำนักงานหลักสูตร ให้ติดต่อสำนักงานหลักสูตร BIR โดยตรง",
          },
        },
      ],
      actions: [
        { label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" },
        {
          label: { en: "Email the BIR programme office", th: "ส่งอีเมลถึงสำนักงานหลักสูตร BIR" },
          href: "mailto:bir@tu.ac.th",
          external: true,
        },
      ],
      related: [
        {
          label: { en: "The BIR programme", th: "หลักสูตร BIR" },
          href: "/activity/bir-programme",
        },
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-contact-internship",
      title: {
        en: "Contact the BIR programme office",
        th: "ติดต่อสำนักงานหลักสูตร BIR",
      },
      summary: {
        en: "The internship is run by the BIR programme office, not BIRSA. Forms, letters, deadlines, and grading all go through the programme.",
        th: "การฝึกงานอยู่ในความรับผิดชอบของสำนักงานหลักสูตร BIR ไม่ใช่ BIRSA ทั้งแบบฟอร์ม หนังสือราชการ กำหนดส่ง และการให้คะแนน ดำเนินการผ่านหลักสูตรทั้งหมด",
      },
      owner: {
        en: "The BIR programme office. BIRSA does not process internship paperwork.",
        th: "สำนักงานหลักสูตร BIR เป็นผู้ดำเนินการ BIRSA ไม่ได้ดำเนินการเอกสารฝึกงาน",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "You find the host organisation yourself. The programme office issues the request letter once you submit the Internship Request Form, and the organisation returns a letter of confirmation.",
            th: "นักศึกษาต้องหาหน่วยงานที่รับฝึกงานด้วยตนเอง เมื่อส่งแบบฟอร์ม Internship Request Form แล้ว สำนักงานหลักสูตรจะออกหนังสือขอความอนุเคราะห์ และหน่วยงานจะส่งหนังสือตอบรับกลับมา",
          },
        },
      ],
      actions: [
        {
          label: { en: "Internship: forms and deadlines", th: "การฝึกงาน: แบบฟอร์มและกำหนดส่ง" },
          href: "/student-life/handbook/internship",
        },
        {
          label: { en: "Email the BIR programme office", th: "ส่งอีเมลถึงสำนักงานหลักสูตร BIR" },
          href: "mailto:bir@tu.ac.th",
          external: true,
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-contact-representation",
      title: {
        en: "The ladder of elected student bodies",
        th: "บันไดองค์กรนักศึกษาแบบเลือกตั้ง",
      },
      summary: {
        en: "BIR students are represented at four levels: your programme, your faculty, your campus, and the university as a whole.",
        th: "นักศึกษา BIR มีตัวแทนถึง 4 ระดับ ได้แก่ ระดับหลักสูตร ระดับคณะ ระดับวิทยาเขต และระดับมหาวิทยาลัย",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "BIR (programme level): BIRSA and BIR class councils.",
              th: "BIR (ระดับหลักสูตร): BIRSA และสภานักศึกษาประจำชั้นปีของ BIR",
            },
            {
              en: "Faculty of Political Science (Singhadang): the Political Science Students' Committee and class councils.",
              th: "คณะรัฐศาสตร์ (สิงห์แดง): คณะกรรมการนักศึกษาคณะรัฐศาสตร์ และสภานักศึกษาประจำชั้นปี",
            },
            {
              en: "Tha Prachan Campus (TPC): TUSU TPC and TUSC TPC, the campus branches of the university student union and council.",
              th: "ศูนย์ท่าพระจันทร์ (TPC): TUSU TPC และ TUSC TPC ซึ่งเป็นสาขาระดับวิทยาเขตของสภานักศึกษาและองค์การนักศึกษามหาวิทยาลัย",
            },
            {
              en: "Thammasat University (all campuses): TUSU, TUSC, and ECTU.",
              th: "มหาวิทยาลัยธรรมศาสตร์ (ทุกศูนย์): TUSU, TUSC และ ECTU",
            },
          ],
        },
      ],
      actions: [
        {
          label: { en: "Student bodies you can run for", th: "องค์กรนักศึกษาที่คุณลงสมัครได้" },
          href: "/activity/student-bodies",
        },
        {
          label: { en: "Getting involved", th: "มาร่วมกิจกรรม" },
          href: "/student-life/home/getting-involved",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-contact-events",
      title: { en: "See what's on", th: "ดูกิจกรรมที่จะจัดขึ้น" },
      summary: {
        en: "News and event listings are all in one place.",
        th: "ข่าวสารและกิจกรรมทั้งหมดรวมอยู่ที่หน้าเดียว",
      },
      actions: [{ label: { en: "Go to news", th: "ไปหน้าข่าวสาร" }, href: "/news" }],
    },

    /* ------------------------------------------------------------------ */
    /* Topic 2: raise a problem                                           */
    /* ------------------------------------------------------------------ */

    {
      kind: "question",
      id: "q-problem-kind",
      question: {
        en: "What kind of problem is this?",
        th: "ปัญหานี้เกี่ยวกับเรื่องอะไร",
      },
      hint: {
        en: "Who receives this depends on what it's about, not just that something went wrong.",
        th: "ผู้รับเรื่องขึ้นอยู่กับประเภทของปัญหา ไม่ใช่แค่ว่ามีเรื่องผิดปกติเกิดขึ้น",
      },
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
          id: "registration",
          label: {
            en: "Registration, enrolment, or academic records",
            th: "การลงทะเบียน การขึ้นทะเบียน หรือระเบียนการศึกษา",
          },
          next: "out-problem-registration",
        },
        {
          id: "teaching",
          label: {
            en: "A course, or how you were taught or graded",
            th: "รายวิชา หรือวิธีการสอนและการให้คะแนน",
          },
          next: "out-problem-teaching",
        },
        {
          id: "harassment",
          label: {
            en: "Harassment, bullying, or misconduct by another student",
            th: "การคุกคาม การกลั่นแกล้ง หรือความประพฤติไม่เหมาะสมของนักศึกษาคนอื่น",
          },
          next: "out-problem-harassment-student",
        },
        {
          id: "harassment-other",
          label: {
            en: "Harassment or being treated badly by staff or someone outside the university",
            th: "การคุกคามหรือถูกปฏิบัติไม่ดีจากอาจารย์ เจ้าหน้าที่ หรือบุคคลภายนอก",
          },
          next: "out-problem-harassment-other",
        },
        {
          id: "club",
          label: {
            en: "A problem with a club or a student body (BIRSA, a club committee, or similar)",
            th: "ปัญหาเกี่ยวกับชมรมหรือองค์กรนักศึกษา (BIRSA คณะกรรมการชมรม หรือองค์กรอื่น)",
          },
          next: "out-problem-club",
        },
        {
          id: "faculty",
          label: {
            en: "A decision or how you were treated by the Faculty itself",
            th: "คำสั่งหรือการปฏิบัติจากคณะโดยตรง",
          },
          next: "out-problem-faculty",
        },
        {
          id: "other",
          label: {
            en: "Something else, or not sure",
            th: "เรื่องอื่น หรือไม่แน่ใจ",
          },
          next: "out-not-covered",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-problem-registration",
      title: {
        en: "Take this to your faculty and the Registrar's office",
        th: "แจ้งเรื่องนี้ที่คณะและสำนักงานทะเบียน",
      },
      summary: {
        en: "Registration and records problems go to your faculty and the university Registrar's office, not BIRSA.",
        th: "ปัญหาการลงทะเบียนและระเบียนการศึกษา ให้แจ้งที่คณะและสำนักงานทะเบียนของมหาวิทยาลัย ไม่ใช่ BIRSA",
      },
      owner: {
        en: "The Faculty office and the TU Registrar decide these matters.",
        th: "สำนักงานคณะและสำนักทะเบียน มธ. เป็นผู้ตัดสินเรื่องนี้",
      },
      body: [
        {
          kind: "note",
          tone: "info",
          when: { fact: "origin", is: "international" },
          text: {
            en: "Your student visa is tied to your enrolment. If this problem could affect your enrolment status (a hold, a suspension, an incomplete registration), tell TU International Affairs about it early rather than after your status changes.",
            th: "วีซ่านักศึกษาของคุณผูกกับสถานภาพการเป็นนักศึกษา หากปัญหานี้อาจกระทบสถานภาพนักศึกษาของคุณ เช่น การถูกระงับสิทธิ พักการศึกษา หรือลงทะเบียนไม่สมบูรณ์ ให้แจ้งกองงานวิเทศสัมพันธ์ (TU International Affairs) ตั้งแต่เนิ่น ๆ ก่อนที่สถานภาพจะเปลี่ยนไป",
          },
        },
      ],
      actions: [
        {
          label: { en: "TU Registrar", th: "สำนักทะเบียน มธ." },
          href: "https://www.reg.tu.ac.th",
          external: true,
        },
      ],
      related: [
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
        {
          label: { en: "Visa and immigration", th: "วีซ่าและการตรวจคนเข้าเมือง" },
          href: "/student-life/international/visa-and-immigration",
          when: { fact: "origin", is: "international" },
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-problem-teaching",
      title: {
        en: "Take this to your faculty student committee first",
        th: "แจ้งเรื่องนี้ที่กรรมการนักศึกษาประจำคณะก่อน",
      },
      summary: {
        en: "Problems with course content, teaching, or grading go to your faculty student committee first, because the rules and channels differ between faculties. For BIR, that committee is BIRSA.",
        th: "ปัญหาเรื่องเนื้อหารายวิชา การสอน หรือการให้คะแนน ให้แจ้งกรรมการนักศึกษาประจำคณะก่อน เพราะแต่ละคณะมีระเบียบและช่องทางต่างกัน สำหรับ BIR กรรมการนักศึกษาคือ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "BIRSA is BIR's own elected faculty student committee, so raise this with BIRSA directly. Where the problem needs the programme office itself (a grade dispute after BIRSA has raised it, for instance), BIRSA can tell you the next step.",
            th: "BIRSA คือคณะกรรมการนักศึกษาประจำสาขา BIR ที่มาจากการเลือกตั้ง สามารถแจ้งเรื่องกับ BIRSA ได้โดยตรง หากเรื่องต้องส่งต่อให้สำนักงานหลักสูตรเอง เช่น กรณีโต้แย้งคะแนนหลังจาก BIRSA ยกเรื่องแล้ว BIRSA จะบอกขั้นตอนถัดไปให้",
          },
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      related: [
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
      ],
      contactCategory: "problem",
    },

    {
      kind: "outcome",
      id: "out-problem-harassment-student",
      title: {
        en: "Report it, and the Dean has to act",
        th: "แจ้งเรื่องได้ และคณบดีต้องดำเนินการ",
      },
      summary: {
        en: "Harassment, bullying, intimidation, or sexual harassment by another student is a disciplinary offence. Once the Dean has reasonable evidence that it happened, the Dean has to open disciplinary proceedings without delay.",
        th: "การคุกคาม กลั่นแกล้ง ข่มขู่ หรือคุกคามทางเพศโดยนักศึกษาคนอื่น ถือเป็นความผิดวินัยนักศึกษา เมื่อคณบดีมีหลักฐานตามสมควรว่าเกิดเหตุขึ้นจริง คณบดีต้องเริ่มดำเนินการทางวินัยโดยไม่ชักช้า",
      },
      owner: {
        en: "The Dean opens and runs the disciplinary process. BIRSA can help you report it and is not the decision-maker.",
        th: "คณบดีเป็นผู้เริ่มและดำเนินกระบวนการทางวินัย BIRSA ช่วยแจ้งเรื่องให้ได้ แต่ไม่ใช่ผู้ตัดสิน",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "You can speak to a trusted BIRSA committee member, report it to the Faculty office, or use BIRSA's contact form if you are unsure where else to start. You do not need a complete account or full evidence before asking for advice.",
            th: "คุณสามารถคุยกับกรรมการ BIRSA ที่ไว้ใจได้ แจ้งสำนักงานคณะ หรือใช้แบบฟอร์มติดต่อ BIRSA หากไม่แน่ใจว่าจะเริ่มจากช่องทางใด ไม่จำเป็นต้องมีเรื่องราวครบถ้วนหรือหลักฐานสมบูรณ์ก่อนขอคำแนะนำ",
          },
        },
        {
          kind: "paragraph",
          text: {
            en: "Where the report concerns an act of a sexual nature, the investigation committee must include a psychologist, social worker, or psychiatrist alongside a law faculty member, and you can ask for up to two people of your choosing to observe while your own testimony is taken.",
            th: "หากเรื่องที่แจ้งเกี่ยวข้องกับการกระทำทางเพศ คณะกรรมการสอบสวนต้องมีผู้เชี่ยวชาญด้านจิตวิทยา สังคมสงเคราะห์ หรือจิตแพทย์ ร่วมกับคณาจารย์ด้านกฎหมาย และคุณสามารถขอให้บุคคลที่เลือกเองไม่เกิน 2 คน เข้าร่วมสังเกตการณ์ขณะให้ปากคำได้",
          },
        },
        {
          kind: "note",
          tone: "info",
          when: { fact: "role", is: "officer" },
          text: {
            en: "If this is reported to you as a committee member, pass it to the Faculty office rather than trying to resolve it within the club or committee. The Dean is the one with the power to open a disciplinary case, not BIRSA or a club committee.",
            th: "หากมีคนแจ้งเรื่องนี้กับคุณในฐานะกรรมการ ให้ส่งต่อสำนักงานคณะแทนการพยายามจัดการเองภายในชมรมหรือคณะกรรมการ เพราะคณบดีเท่านั้นที่มีอำนาจเปิดคดีทางวินัย ไม่ใช่ BIRSA หรือคณะกรรมการชมรม",
          },
        },
        {
          kind: "note",
          tone: "info",
          when: { fact: "origin", is: "international" },
          text: {
            en: "A disciplinary penalty can include suspension from study, which changes your enrolment status and can affect a visa tied to it. This applies to whoever is found to have committed the offence, not to the person reporting it.",
            th: "โทษทางวินัยอาจรวมถึงการพักการศึกษา ซึ่งเปลี่ยนสถานภาพนักศึกษาและอาจกระทบวีซ่าที่ผูกกับสถานภาพนั้น ทั้งนี้ใช้กับฝ่ายที่ถูกตัดสินว่ากระทำผิด ไม่ใช่ฝ่ายที่แจ้งเรื่อง",
          },
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      citations: [
        {
          label: {
            en: "Discipline Regulation, ข้อ 7(2): what counts as harassment",
            th: "ระเบียบวินัยนักศึกษา ข้อ 7(2): ลักษณะของการคุกคาม",
          },
          href: "/activity/regulations/discipline-2568#prov-7",
        },
        {
          label: {
            en: "Discipline Regulation, ข้อ 13: the Dean must act without delay",
            th: "ระเบียบวินัยนักศึกษา ข้อ 13: คณบดีต้องดำเนินการโดยไม่ชักช้า",
          },
          href: "/activity/regulations/discipline-2568#prov-13",
        },
        {
          label: {
            en: "Discipline Regulation, ข้อ 14: protections in cases of a sexual nature",
            th: "ระเบียบวินัยนักศึกษา ข้อ 14: การคุ้มครองในกรณีที่เกี่ยวข้องกับการกระทำทางเพศ",
          },
          href: "/activity/regulations/discipline-2568#prov-14",
        },
        {
          label: {
            en: "Discipline Regulation, ข้อ 24: notice of the penalty and the right of appeal",
            th: "ระเบียบวินัยนักศึกษา ข้อ 24: การแจ้งคำสั่งลงโทษและสิทธิอุทธรณ์",
          },
          href: "/activity/regulations/discipline-2568#prov-24",
        },
      ],
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
      id: "out-problem-harassment-other",
      title: {
        en: "Report it to the Faculty, and BIRSA can help",
        th: "แจ้งเรื่องกับคณะ และ BIRSA ช่วยได้",
      },
      summary: {
        en: "The Discipline Regulation covers offences by students, not staff. For harassment or bad treatment by a staff member or someone outside the university, report it to the Faculty office or the university's welfare channel.",
        th: "ระเบียบวินัยนักศึกษาครอบคลุมการกระทำผิดของนักศึกษา ไม่ใช่บุคลากร สำหรับการคุกคามหรือการปฏิบัติไม่ดีจากอาจารย์ เจ้าหน้าที่ หรือบุคคลภายนอก ให้แจ้งสำนักงานคณะหรือช่องทางดูแลสวัสดิภาพนักศึกษาของมหาวิทยาลัย",
      },
      owner: {
        en: "The Faculty office, or the relevant university welfare channel. BIRSA is not the decision-maker but can help you report it.",
        th: "สำนักงานคณะ หรือช่องทางดูแลสวัสดิภาพนักศึกษาที่เกี่ยวข้องของมหาวิทยาลัย BIRSA ไม่ใช่ผู้ตัดสิน แต่ช่วยแจ้งเรื่องให้ได้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "You can speak to a trusted BIRSA committee member first, and BIRSA can help you find the right channel. You do not need a complete account before asking for advice.",
            th: "คุณสามารถคุยกับกรรมการ BIRSA ที่ไว้ใจได้ก่อน และ BIRSA ช่วยหาช่องทางที่เหมาะสมให้ได้ ไม่จำเป็นต้องมีเรื่องราวครบถ้วนก่อนขอคำแนะนำ",
          },
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
      id: "out-problem-club",
      title: {
        en: "Contact the body involved, or BIRSA if it's unclear",
        th: "ติดต่อองค์กรที่เกี่ยวข้อง หรือ BIRSA หากไม่แน่ใจ",
      },
      summary: {
        en: "There is no separate complaints procedure on file for a problem with a club or a student body. Raise it with that body directly, or with BIRSA if the body itself is the problem or you are unsure who to ask.",
        th: "ไม่มีขั้นตอนร้องเรียนแยกต่างหากสำหรับปัญหาเกี่ยวกับชมรมหรือองค์กรนักศึกษาที่เรามีระบุไว้ ให้แจ้งองค์กรนั้นโดยตรง หรือแจ้ง BIRSA หากปัญหาคือองค์กรนั้นเอง หรือไม่แน่ใจว่าจะติดต่อใคร",
      },
      body: [
        {
          kind: "paragraph",
          when: { fact: "role", is: "officer" },
          text: {
            en: "If a member has raised this with you as an officer, that is your committee's to receive and act on, not to refer elsewhere without a reason. If the problem concerns another officer or the committee as a whole, take it to BIRSA or the Faculty office instead.",
            th: "ถ้ามีสมาชิกแจ้งเรื่องนี้กับคุณในฐานะกรรมการ นั่นคือหน้าที่ของคณะกรรมการที่ต้องรับเรื่องและดำเนินการ ไม่ใช่ส่งต่อที่อื่นโดยไม่มีเหตุผล หากปัญหาเกี่ยวข้องกับกรรมการคนอื่นหรือคณะกรรมการทั้งชุด ให้แจ้ง BIRSA หรือสำนักงานคณะแทน",
          },
        },
        {
          kind: "paragraph",
          when: { not: { fact: "role", is: "officer" } },
          text: {
            en: "Start with the club or body's own committee. If the problem is with that committee itself, or you don't know who to ask, BIRSA can take it from there.",
            th: "เริ่มจากคณะกรรมการของชมรมหรือองค์กรนั้นก่อน หากปัญหาคือตัวคณะกรรมการเอง หรือไม่รู้ว่าจะติดต่อใคร BIRSA ช่วยรับเรื่องต่อได้",
          },
        },
      ],
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
      related: [
        {
          label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" },
          href: "/clubs",
        },
      ],
      contactCategory: "problem",
    },

    {
      kind: "outcome",
      id: "out-problem-faculty",
      title: {
        en: "Take this to TUSU Tha Prachan or BIRSA",
        th: "แจ้งเรื่องนี้ที่ อมธ. ท่าพระจันทร์ หรือ BIRSA",
      },
      summary: {
        en: "A problem with a decision or treatment from the Faculty itself is not something BIRSA can overrule. Raise a BIR-specific matter through BIRSA as your elected faculty student committee; raise a general or unfair-treatment matter with TUSU Tha Prachan, the directly elected student union for all Tha Prachan students.",
        th: "ปัญหาเกี่ยวกับคำสั่งหรือการปฏิบัติจากคณะโดยตรง ไม่ใช่เรื่องที่ BIRSA มีอำนาจยกเลิกได้ หากเป็นเรื่องเฉพาะของ BIR ให้ยกผ่าน BIRSA ในฐานะกรรมการนักศึกษาประจำสาขาที่มาจากการเลือกตั้ง ส่วนเรื่องทั่วไปหรือการปฏิบัติที่ไม่เป็นธรรม แจ้ง อมธ. ท่าพระจันทร์ ซึ่งเป็นองค์การนักศึกษาที่มาจากการเลือกตั้งโดยตรงและเป็นตัวแทนของนักศึกษาทั้งหมดที่ท่าพระจันทร์",
      },
      owner: {
        en: "The Faculty makes its own decisions. BIRSA and TUSU Tha Prachan can raise the matter but cannot overrule the Faculty.",
        th: "คณะเป็นผู้ตัดสินใจเอง BIRSA และ อมธ. ท่าพระจันทร์ ช่วยยกเรื่องให้ได้ แต่ไม่มีอำนาจยกเลิกคำสั่งของคณะ",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Email tusu.thaprachan@tu.ac.th, or reach TUSU Tha Prachan on Instagram @tusu.tpc, X @tusu_tpc, or TikTok @tusu.tpc.",
            th: "อีเมล tusu.thaprachan@tu.ac.th หรือติดต่อผ่าน Instagram @tusu.tpc, X @tusu_tpc หรือ TikTok @tusu.tpc",
          },
        },
      ],
      actions: [
        { label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" },
        {
          label: { en: "Email TUSU Tha Prachan", th: "ส่งอีเมลถึง อมธ. ท่าพระจันทร์" },
          href: "mailto:tusu.thaprachan@tu.ac.th",
          external: true,
        },
      ],
      related: [
        {
          label: { en: "Your rights and welfare", th: "สิทธิและสวัสดิการของคุณ" },
          href: "/student-life/home/rights-and-welfare",
        },
        {
          label: { en: "Student bodies you can run for", th: "องค์กรนักศึกษาที่คุณลงสมัครได้" },
          href: "/activity/student-bodies",
        },
      ],
      contactCategory: "problem",
    },
  ],
};
