/**
 * Study: the degree's rules and choices, as situations rather than chapters.
 *
 * Three doors into one subject. `academic-rules` is the wide one: everything
 * about registration, exams, leave, probation, misconduct and graduating that
 * a student runs into without warning. `internship-check` and `choose-courses`
 * are narrower and more procedural, each keyed to one thing a student sets
 * out to do on purpose.
 *
 * All three are BIRSA's write-up of programme and University rules, not the
 * rules themselves. Where a decision is the Registrar's, the Dean's, the
 * Rector's, or the BIR programme office's to make, `owner` says so, because
 * routing someone correctly is the whole point of a page like this.
 *
 * Grounded in `content/student-life/en/handbook/academic-life.mdx`,
 * `assessment-and-degree.mdx`, `curriculum-and-study-plan.mdx` and
 * `admission-and-fees.mdx`; `content/student-life/en/handbook/internship.mdx`;
 * and `content/course-review/{types,courses}.ts`. Nothing here states a
 * number, deadline, form name or procedure that isn't in one of those files.
 */
import type { SmartAnswerService } from "../types";

export const study: SmartAnswerService = {
  topics: [
    {
      slug: "academic-rules",
      title: {
        en: "Academic rules: registration, exams, leave and graduating",
        th: "ระเบียบการเรียน การลงทะเบียน การสอบ การลาพัก และการจบการศึกษา",
      },
      lede: {
        en: "Find the rule that covers the situation you're in, from adding a course to working out if you'll get honours.",
        th: "หาข้อกำหนดที่ตรงกับสถานการณ์ของคุณ ตั้งแต่การเพิ่มวิชาไปจนถึงการดูว่าจะได้เกียรตินิยมหรือไม่",
      },
      group: "study",
      start: "q-academic-topic",
      whatYoullNeed: [
        {
          en: "Which situation you're asking about",
          th: "สถานการณ์ที่คุณกำลังเจอ",
        },
      ],
      keywords: [
        "registration",
        "add drop",
        "exam",
        "leave",
        "probation",
        "warning",
        "gpa",
        "plagiarism",
        "graduate",
        "honours",
        "ลงทะเบียน",
        "เพิ่มถอน",
        "สอบ",
        "ลาพัก",
        "รอพินิจ",
        "เกรดเฉลี่ย",
        "คัดลอกผลงาน",
        "จบการศึกษา",
        "เกียรตินิยม",
      ],
    },
    {
      slug: "internship-check",
      title: {
        en: "The PI574 internship: eligibility, forms and marking",
        th: "การฝึกงาน PI574 คุณสมบัติ แบบฟอร์ม และการให้คะแนน",
      },
      lede: {
        en: "Check whether you can do the internship yet, what the two forms are, when they're due, and how it's marked.",
        th: "ตรวจสอบว่าคุณฝึกงานได้หรือยัง แบบฟอร์มที่ต้องใช้มีอะไรบ้าง กำหนดส่งเมื่อไหร่ และให้คะแนนอย่างไร",
      },
      group: "study",
      start: "q-internship-stage",
      whatYoullNeed: [
        {
          en: "Roughly which year and semester you're in",
          th: "ชั้นปีและภาคการศึกษาของคุณโดยประมาณ",
        },
      ],
      keywords: [
        "internship",
        "pi574",
        "internship request form",
        "secured internship form",
        "training",
        "ฝึกงาน",
        "แบบฟอร์มฝึกงาน",
        "รายงานฝึกงาน",
      ],
      spotlightWhen: { fact: "stage", is: "finishing" },
    },
    {
      slug: "choose-courses",
      title: {
        en: "Choosing courses for next semester",
        th: "เลือกวิชาสำหรับเทอมหน้า",
      },
      lede: {
        en: "See how the course categories and tracks fit together, check a prerequisite, and find what other students said about a course.",
        th: "ดูว่าหมวดวิชาและกลุ่มวิชาต่าง ๆ เชื่อมโยงกันอย่างไร ตรวจวิชาบังคับก่อน และดูความเห็นของรุ่นพี่เกี่ยวกับวิชานั้น",
      },
      group: "study",
      start: "q-course-need",
      whatYoullNeed: [
        {
          en: "The course code, if you already have one in mind",
          th: "รหัสวิชา ถ้ามีวิชาที่สนใจอยู่แล้ว",
        },
      ],
      keywords: [
        "course",
        "elective",
        "minor",
        "prerequisite",
        "study plan",
        "course review",
        "รายวิชา",
        "วิชาเลือก",
        "วิชาโท",
        "วิชาบังคับก่อน",
        "แผนการเรียน",
        "รีวิววิชา",
      ],
      spotlightWhen: { fact: "stage", is: "starting" },
    },
  ],

  nodes: [
    /* ================================================================ */
    /* Topic 1: academic-rules                                          */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-academic-topic",
      question: {
        en: "Which situation is closest to yours?",
        th: "ข้อไหนใกล้เคียงสถานการณ์ของคุณที่สุด",
      },
      hint: {
        en: "Just starting out, you probably want registration. Close to finishing, you probably want graduating and honours.",
        th: "ถ้าเพิ่งเริ่มเรียน อาจต้องการเรื่องการลงทะเบียน ถ้าใกล้จบ อาจต้องการเรื่องการจบการศึกษาและเกียรตินิยม",
      },
      options: [
        {
          id: "register",
          label: {
            en: "Registering for courses, or adding and dropping",
            th: "ลงทะเบียนเรียน หรือเพิ่ม-ถอนรายวิชา",
          },
          next: "q-academic-register",
        },
        {
          id: "exam",
          label: {
            en: "I missed an exam, or was ill on the day",
            th: "ขาดสอบ หรือป่วยในวันสอบ",
          },
          next: "out-academic-exam-absence",
        },
        {
          id: "leave",
          label: {
            en: "Taking a leave of absence, or a disciplinary suspension",
            th: "ลาพักการศึกษา หรือถูกให้พักการศึกษาทางวินัย",
          },
          next: "q-academic-leave",
        },
        {
          id: "probation",
          label: {
            en: "Academic warning, probation, or my GPA",
            th: "การเตือน สถานะรอพินิจ หรือเกรดเฉลี่ยของฉัน",
          },
          next: "out-academic-probation",
        },
        {
          id: "plagiarism",
          label: {
            en: "Plagiarism and academic misconduct",
            th: "การคัดลอกผลงานผู้อื่นและการทุจริตทางวิชาการ",
          },
          next: "out-academic-plagiarism",
        },
        {
          id: "graduate",
          label: {
            en: "What I need to graduate, and honours",
            th: "เงื่อนไขการจบการศึกษา และเกียรตินิยม",
          },
          next: "q-academic-graduate",
        },
      ],
    },

    /* ---- Registration ---- */

    {
      kind: "question",
      id: "q-academic-register",
      question: {
        en: "What do you need to do?",
        th: "คุณต้องการทำอะไร",
      },
      options: [
        {
          id: "how",
          label: {
            en: "Register for the semester",
            th: "ลงทะเบียนเรียนของภาคการศึกษา",
          },
          next: "out-academic-register-general",
        },
        {
          id: "add",
          label: {
            en: "Add a course after I've already registered",
            th: "เพิ่มรายวิชาหลังจากลงทะเบียนไปแล้ว",
          },
          next: "out-academic-add-course",
        },
        {
          id: "drop",
          label: {
            en: "Drop or withdraw from a course",
            th: "ถอนรายวิชา",
          },
          next: "out-academic-drop-withdraw",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-academic-register-general",
      title: {
        en: "Registration runs through the Registrar's online system",
        th: "การลงทะเบียนทำผ่านระบบออนไลน์ของสำนักงานทะเบียนนักศึกษา",
      },
      summary: {
        en: "You find out what's offered from BIR's own announcements, then register online during the period the Registrar's Office sets for that semester.",
        th: "ดูรายวิชาที่เปิดสอนจากประกาศของ BIR เอง แล้วลงทะเบียนออนไลน์ในช่วงเวลาที่สำนักงานทะเบียนนักศึกษากำหนดสำหรับภาคการศึกษานั้น",
      },
      owner: {
        en: "The Registrar's Office runs registration and sets the dates. BIR announces course offerings; BIRSA does neither.",
        th: "สำนักงานทะเบียนนักศึกษาเป็นผู้ดำเนินการลงทะเบียนและกำหนดวันที่ ส่วน BIR เป็นผู้ประกาศรายวิชาที่เปิดสอน BIRSA ไม่ได้ทำทั้งสองอย่างนี้",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: 'Course offerings for the year are announced on the BIR website or Facebook (birpolsci.com, facebook/birprogram). Registration itself, including adding and dropping, is done online through the Registrar\'s Office system at reg.tu.ac.th, under the "Enroll" menu, on the dates it sets for that semester.',
            th: 'รายวิชาที่เปิดสอนในแต่ละปีจะประกาศบนเว็บไซต์หรือเฟซบุ๊กของ BIR (birpolsci.com, facebook/birprogram) ส่วนการลงทะเบียนเอง รวมถึงการเพิ่มและถอนวิชา ทำผ่านระบบออนไลน์ของสำนักงานทะเบียนนักศึกษาที่ reg.tu.ac.th ในเมนู "Enroll" ตามวันที่กำหนดไว้สำหรับภาคการศึกษานั้น',
          },
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "Full-time students must register for at least 9 and no more than 21 credits in a regular semester, or no more than 6 credits in the summer session (Bachelor Degree Regulations, 3rd edition, item 10.4).",
            th: "นักศึกษาภาคปกติต้องลงทะเบียนไม่น้อยกว่า 9 หน่วยกิตและไม่เกิน 21 หน่วยกิตในภาคการศึกษาปกติ หรือไม่เกิน 6 หน่วยกิตในภาคฤดูร้อน (ข้อบังคับมหาวิทยาลัยธรรมศาสตร์ว่าด้วยการศึกษาระดับปริญญาตรี ฉบับที่ 3 ข้อ 10.4)",
          },
        },
      ],
      actions: [
        {
          label: {
            en: "Registrar's Office registration system",
            th: "ระบบลงทะเบียนของสำนักงานทะเบียนนักศึกษา",
          },
          href: "https://www.reg.tu.ac.th",
          external: true,
        },
      ],
      related: [
        {
          label: { en: "Curriculum and study plan", th: "หลักสูตรและแผนการศึกษา" },
          href: "/student-life/handbook/curriculum-and-study-plan",
          when: { fact: "stage", is: "starting" },
        },
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-academic-add-course",
      title: {
        en: "Adding a course needs approval once the adding period is open",
        th: "การเพิ่มรายวิชาต้องได้รับความเห็นชอบเมื่อเปิดช่วงเพิ่มรายวิชาแล้ว",
      },
      summary: {
        en: "With your advisor's or the instructor's approval, you can add a course up to the end of the adding and dropping period: the first 14 days of a regular semester, or the first 7 days of the summer session.",
        th: "ด้วยความเห็นชอบของอาจารย์ที่ปรึกษาหรืออาจารย์ผู้สอน คุณสามารถเพิ่มรายวิชาได้จนถึงสิ้นสุดช่วงเวลาเพิ่ม-ถอนรายวิชา คือ 14 วันแรกของภาคการศึกษาปกติ หรือ 7 วันแรกของภาคฤดูร้อน",
      },
      owner: {
        en: "Your advisor or the course instructor approves adding. After the adding period, only the Dean can approve it.",
        th: "อาจารย์ที่ปรึกษาหรืออาจารย์ผู้สอนเป็นผู้อนุมัติการเพิ่มวิชา หลังพ้นช่วงเพิ่มรายวิชา มีเพียงคณบดีเท่านั้นที่อนุมัติได้",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "Adding a course after the adding and dropping period is only permitted in certain circumstances, with the Dean's approval.",
            th: "การเพิ่มรายวิชาหลังพ้นช่วงเวลาเพิ่ม-ถอนรายวิชาจะได้รับอนุญาตเฉพาะในบางกรณีเท่านั้น โดยต้องได้รับความเห็นชอบจากคณบดี",
          },
        },
      ],
      related: [
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-academic-drop-withdraw",
      title: {
        en: "Dropping and withdrawing are different, and use different windows",
        th: "การถอนวิชาในช่วงเพิ่ม-ถอน กับการถอนวิชาหลังจากนั้น ไม่เหมือนกัน",
      },
      summary: {
        en: 'Drop within the adding and dropping period and the course never appears on your record. Withdraw later and it\'s recorded with a "W".',
        th: 'ถ้าถอนภายในช่วงเพิ่ม-ถอนรายวิชา วิชานั้นจะไม่ปรากฏในระเบียนผลการเรียนเลย แต่ถ้าถอนหลังจากนั้น จะถูกบันทึกด้วยตัวอักษร "W"',
      },
      owner: {
        en: "The Dean approves anything outside these windows, or a drop that would take your registration below 9 credits.",
        th: "คณบดีเป็นผู้อนุมัติกรณีที่อยู่นอกช่วงเวลาเหล่านี้ หรือกรณีที่การถอนจะทำให้จำนวนหน่วยกิตที่ลงทะเบียนต่ำกว่า 9 หน่วยกิต",
      },
      body: [
        {
          kind: "steps",
          title: {
            en: "Two windows, two outcomes",
            th: "สองช่วงเวลา สองผลลัพธ์",
          },
          items: [
            {
              en: "Drop within the adding and dropping period (the first 14 days of a regular semester, or the first 7 days of the summer session): the course does not appear on your academic record at all, as long as your overall registration stays at 9 credits or above.",
              th: "ถอนภายในช่วงเพิ่ม-ถอนรายวิชา (14 วันแรกของภาคการศึกษาปกติ หรือ 7 วันแรกของภาคฤดูร้อน): วิชานั้นจะไม่ปรากฏในระเบียนผลการเรียนเลย ตราบใดที่จำนวนหน่วยกิตที่ลงทะเบียนโดยรวมยังไม่ต่ำกว่า 9 หน่วยกิต",
            },
            {
              en: 'Withdraw within the withdrawal period (the first 10 weeks of a regular semester, or the first 4 weeks of the summer session): the course is recorded with the letter "W" on your academic record.',
              th: 'ถอนภายในช่วงเวลาถอนรายวิชา (10 สัปดาห์แรกของภาคการศึกษาปกติ หรือ 4 สัปดาห์แรกของภาคฤดูร้อน): วิชานั้นจะถูกบันทึกด้วยตัวอักษร "W" ในระเบียนผลการเรียน',
            },
          ],
        },
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "Withdrawing after the withdrawal period is only permitted in certain circumstances, with the Dean's approval.",
            th: "การถอนรายวิชาหลังพ้นช่วงเวลาถอนรายวิชาจะได้รับอนุญาตเฉพาะในบางกรณีเท่านั้น โดยต้องได้รับความเห็นชอบจากคณบดี",
          },
        },
      ],
      related: [
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
    },

    /* ---- Exam absence ---- */

    {
      kind: "outcome",
      id: "out-academic-exam-absence",
      title: {
        en: "File a petition with the course instructor",
        th: "ยื่นคำร้องต่ออาจารย์ผู้สอนวิชานั้น",
      },
      summary: {
        en: "If you can't sit an exam because of unavoidable circumstances, you or someone you designate can petition the instructor. If it's approved, you either withdraw from the course with a \"W\" or are assessed as the instructor decides; if not, you're assessed on your coursework so far.",
        th: 'หากไม่สามารถเข้าสอบได้เนื่องจากเหตุสุดวิสัย คุณหรือผู้ที่ได้รับมอบหมายสามารถยื่นคำร้องต่ออาจารย์ผู้สอนได้ ถ้าคำร้องได้รับอนุมัติ คุณจะถอนวิชานั้นโดยได้ "W" หรือได้รับการประเมินตามดุลยพินิจของอาจารย์ผู้สอน ถ้าไม่ได้รับอนุมัติ คุณจะถูกประเมินจากผลงานที่ทำมาก่อนหน้านั้น',
      },
      owner: {
        en: "The course instructor decides whether the petition is approved and how you're assessed.",
        th: "อาจารย์ผู้สอนเป็นผู้พิจารณาว่าคำร้องจะได้รับอนุมัติหรือไม่ และจะประเมินผลอย่างไร",
      },
      related: [
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
      contactCategory: "question",
    },

    /* ---- Leave and suspension ---- */

    {
      kind: "question",
      id: "q-academic-leave",
      question: {
        en: "Are you applying for a leave of absence, or asking about a disciplinary suspension?",
        th: "คุณกำลังจะขอลาพักการศึกษา หรือถามเรื่องการถูกให้พักการศึกษาทางวินัย",
      },
      options: [
        {
          id: "apply",
          label: {
            en: "I want to apply for a leave of absence",
            th: "ต้องการยื่นขอลาพักการศึกษา",
          },
          next: "out-academic-leave-apply",
        },
        {
          id: "suspended",
          label: {
            en: "I've been suspended, or I want to know what that means",
            th: "ถูกให้พักการศึกษา หรืออยากรู้ว่าหมายความว่าอย่างไร",
          },
          next: "out-academic-suspension",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-academic-leave-apply",
      title: {
        en: "A leave of absence needs the Dean's approval",
        th: "การลาพักการศึกษาต้องได้รับความเห็นชอบจากคณบดี",
      },
      summary: {
        en: "You can apply for a leave of absence with an appropriate reason, approved by the Dean. First-year students can't take leave in their first 2 semesters, and no one can take more than 2 consecutive semesters of leave (not counting summer), except with the Rector's special permission.",
        th: "คุณสามารถยื่นขอลาพักการศึกษาได้โดยระบุเหตุผลที่เหมาะสมและได้รับความเห็นชอบจากคณบดี นักศึกษาชั้นปีที่ 1 ไม่สามารถลาพักในช่วง 2 ภาคการศึกษาแรกได้ และไม่มีใครลาพักติดต่อกันเกิน 2 ภาคการศึกษา (ไม่นับภาคฤดูร้อน) ได้ เว้นแต่ได้รับอนุญาตพิเศษจากอธิการบดี",
      },
      owner: {
        en: "The Dean approves a leave of absence; the Rector can grant exceptions to the first-year and consecutive-semester limits.",
        th: "คณบดีเป็นผู้อนุมัติการลาพักการศึกษา ส่วนอธิการบดีเป็นผู้ให้อนุญาตพิเศษในกรณีที่เกินข้อจำกัดสำหรับนักศึกษาชั้นปีที่ 1 หรือการลาพักติดต่อกัน",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: 'If you apply within the first 14 days of a regular semester, that semester is marked "LEAVE" on your record, and you pay a fee for maintaining student status instead of tuition.',
            th: 'หากยื่นภายใน 14 วันแรกของภาคการศึกษาปกติ ภาคการศึกษานั้นจะถูกบันทึกเป็น "LEAVE" ในระเบียนผลการเรียน และคุณต้องชำระค่าธรรมเนียมรักษาสถานภาพนักศึกษาแทนค่าเล่าเรียน',
          },
        },
        {
          kind: "note",
          tone: "info",
          when: { fact: "origin", is: "international" },
          text: {
            en: "A leave of absence can affect your student visa status. Check with the BIR programme office or Thammasat's international affairs office before you apply; this guide does not cover visa rules.",
            th: "การลาพักการศึกษาอาจมีผลต่อสถานะวีซ่านักศึกษาของคุณ ควรสอบถามสำนักงานหลักสูตร BIR หรือกองงานวิเทศสัมพันธ์ของมหาวิทยาลัยก่อนยื่นขอ คู่มือนี้ไม่ครอบคลุมกฎเรื่องวีซ่า",
          },
        },
      ],
      related: [
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-academic-suspension",
      title: {
        en: "A disciplinary suspension is a penalty, not something you apply for",
        th: "การให้พักการศึกษาทางวินัยเป็นบทลงโทษ ไม่ใช่สิ่งที่ยื่นขอเอง",
      },
      summary: {
        en: "A student suspended for a disciplinary reason still has to pay a fee for maintaining student status. If the suspension starts the following semester after you've already paid, tuition and fees are refunded and the maintenance fee applies instead; if it starts in the current semester, all your enrolled courses are deleted from your record.",
        th: "นักศึกษาที่ถูกให้พักการศึกษาเนื่องจากเหตุทางวินัยยังต้องชำระค่าธรรมเนียมรักษาสถานภาพนักศึกษา หากการพักการศึกษามีผลในภาคการศึกษาถัดไปหลังจากที่ชำระค่าเล่าเรียนไปแล้ว จะได้รับเงินค่าเล่าเรียนและค่าธรรมเนียมคืน แล้วชำระค่าธรรมเนียมรักษาสถานภาพแทน หากมีผลในภาคการศึกษาปัจจุบัน รายวิชาที่ลงทะเบียนไว้ทั้งหมดจะถูกลบออกจากระเบียนผลการเรียน",
      },
      owner: {
        en: "Suspension is a disciplinary penalty imposed by the University, not something the Faculty or BIRSA can waive.",
        th: "การพักการศึกษาทางวินัยเป็นบทลงโทษที่มหาวิทยาลัยเป็นผู้กำหนด ไม่ใช่สิ่งที่คณะหรือ BIRSA จะยกเว้นให้ได้",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "Leave and suspension can't be used as a reason to extend the maximum 7-year limit to complete the degree.",
            th: "การลาพักการศึกษาและการให้พักการศึกษาไม่สามารถใช้เป็นเหตุผลในการขยายระยะเวลาสูงสุด 7 ปีสำหรับการสำเร็จการศึกษาได้",
          },
        },
        {
          kind: "note",
          tone: "info",
          when: { fact: "origin", is: "international" },
          text: {
            en: "A suspension can affect your student visa status. Check with the BIR programme office or Thammasat's international affairs office; this guide does not cover visa rules.",
            th: "การถูกให้พักการศึกษาอาจมีผลต่อสถานะวีซ่านักศึกษาของคุณ ควรสอบถามสำนักงานหลักสูตร BIR หรือกองงานวิเทศสัมพันธ์ของมหาวิทยาลัย คู่มือนี้ไม่ครอบคลุมกฎเรื่องวีซ่า",
          },
        },
      ],
      citations: [
        {
          label: {
            en: "Suspension as a disciplinary penalty (University Regulation on Student Discipline, provision 10)",
            th: "การพักการศึกษาในฐานะบทลงโทษทางวินัย (ข้อบังคับว่าด้วยวินัยนักศึกษา ข้อ 10)",
          },
          href: "/activity/regulations/discipline-2568#prov-10",
        },
      ],
      related: [
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
      contactCategory: "question",
    },

    /* ---- Probation ---- */

    {
      kind: "outcome",
      id: "out-academic-probation",
      title: {
        en: "Two consecutive warnings put you on probation",
        th: "การถูกเตือนสองครั้งติดต่อกันจะทำให้อยู่ในสถานะรอพินิจ",
      },
      summary: {
        en: "You must keep a cumulative GPA of at least 2.00. Drop below that in any semester and you get a WARNING; two consecutive WARNINGs put you on PROBATION the following semester; fail to bring your GPA back to 2.00 after one semester on PROBATION and you're dismissed.",
        th: "คุณต้องรักษาเกรดเฉลี่ยสะสมไว้ไม่ต่ำกว่า 2.00 หากเกรดเฉลี่ยในภาคการศึกษาใดต่ำกว่า 2.00 จะได้รับการเตือน (WARNING) หากถูกเตือนติดต่อกัน 2 ภาคการศึกษาจะเข้าสู่สถานะรอพินิจ (PROBATION) ในภาคถัดไป และหากทำเกรดเฉลี่ยกลับไม่ถึง 2.00 หลังอยู่ในสถานะรอพินิจครบ 1 ภาคการศึกษา จะพ้นสภาพนักศึกษา",
      },
      owner: {
        en: "The University sets and applies this GPA rule. Talk to your academic advisor as soon as you get a WARNING.",
        th: "มหาวิทยาลัยเป็นผู้กำหนดและใช้กฎเกรดเฉลี่ยนี้ ควรปรึกษาอาจารย์ที่ปรึกษาทันทีที่ได้รับการเตือน",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "Summer session grades count as part of the second semester's grades, so they don't affect your status from the semester before.",
            th: "เกรดของภาคฤดูร้อนจะนับรวมเป็นส่วนหนึ่งของเกรดภาคการศึกษาที่ 2 จึงไม่ส่งผลต่อสถานะทางการศึกษาของภาคการศึกษาก่อนหน้า",
          },
        },
        {
          kind: "steps",
          title: {
            en: "Extra rules for first-year students",
            th: "ข้อกำหนดเพิ่มเติมสำหรับนักศึกษาชั้นปีที่ 1",
          },
          items: [
            {
              en: "A first-year student with a GPA of 2.00 exactly is given a WARNING (equivalent to WARNING 1).",
              th: "นักศึกษาชั้นปีที่ 1 ที่มีเกรดเฉลี่ย 2.00 พอดี จะได้รับการเตือน (เทียบเท่า WARNING 1)",
            },
            {
              en: "A first-year student who gets a WARNING in the first semester, then a GPA below 1.50 in the second, is dismissed.",
              th: "นักศึกษาชั้นปีที่ 1 ที่ได้รับการเตือนในภาคการศึกษาที่ 1 แล้วมีเกรดเฉลี่ยต่ำกว่า 1.50 ในภาคการศึกษาที่ 2 จะพ้นสภาพนักศึกษา",
            },
            {
              en: "A first-year student who doesn't bring their GPA back to at least 1.50 within their first two semesters is dismissed.",
              th: "นักศึกษาชั้นปีที่ 1 ที่ทำเกรดเฉลี่ยกลับไม่ถึง 1.50 ภายใน 2 ภาคการศึกษาแรก จะพ้นสภาพนักศึกษา",
            },
          ],
        },
        {
          kind: "note",
          tone: "info",
          when: { fact: "origin", is: "international" },
          text: {
            en: "Dismissal ends your student status, which can affect your visa. Check with the BIR programme office or Thammasat's international affairs office if your GPA is close to these thresholds; this guide does not cover visa rules.",
            th: "การพ้นสภาพนักศึกษาส่งผลต่อสถานภาพนักศึกษาของคุณ ซึ่งอาจมีผลต่อวีซ่า หากเกรดเฉลี่ยของคุณใกล้เกณฑ์เหล่านี้ ควรสอบถามสำนักงานหลักสูตร BIR หรือกองงานวิเทศสัมพันธ์ของมหาวิทยาลัย คู่มือนี้ไม่ครอบคลุมกฎเรื่องวีซ่า",
          },
        },
      ],
      related: [
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
      contactCategory: "question",
    },

    /* ---- Plagiarism ---- */

    {
      kind: "outcome",
      id: "out-academic-plagiarism",
      title: {
        en: "Plagiarism is punished at the lecturer's discretion, and can also be a serious disciplinary offence",
        th: "การคัดลอกผลงานผู้อื่นถูกลงโทษตามดุลยพินิจของอาจารย์ผู้สอน และอาจเป็นความผิดวินัยร้ายแรงได้ด้วย",
      },
      summary: {
        en: "Plagiarism is using material from someone else's published or unpublished work without acknowledging them. Whether intentional or not, it's punished at the course lecturer's discretion; in the worst case, you fail that subject.",
        th: "การคัดลอกผลงานผู้อื่น คือการนำเนื้อหาจากผลงานที่ตีพิมพ์แล้วหรือยังไม่ได้ตีพิมพ์มาใช้โดยไม่ให้เครดิตเจ้าของผลงาน ไม่ว่าจะตั้งใจหรือไม่ก็ตาม จะถูกลงโทษตามดุลยพินิจของอาจารย์ผู้สอนวิชานั้น กรณีร้ายแรงที่สุดคือสอบตกในวิชานั้น",
      },
      owner: {
        en: "Your course lecturer decides the academic consequence. Copying work or infringing intellectual property in graded work can also count as a serious disciplinary offence under the University's student discipline regulation, which the Dean and Rector handle separately.",
        th: "อาจารย์ผู้สอนวิชานั้นเป็นผู้พิจารณาบทลงโทษทางวิชาการ การคัดลอกผลงานหรือการละเมิดทรัพย์สินทางปัญญาในงานที่ใช้ประเมินผลยังอาจเข้าข่ายความผิดวินัยร้ายแรงตามข้อบังคับว่าด้วยวินัยนักศึกษาของมหาวิทยาลัย ซึ่งคณบดีและอธิการบดีเป็นผู้ดำเนินการแยกต่างหาก",
      },
      body: [
        {
          kind: "steps",
          title: {
            en: "Counts as plagiarism, among other things",
            th: "นับเป็นการคัดลอกผลงานผู้อื่น รวมถึง",
          },
          items: [
            {
              en: "Copying someone else's work, in whole or in part, without proper referencing.",
              th: "การคัดลอกผลงานของผู้อื่นทั้งหมดหรือบางส่วน โดยไม่มีการอ้างอิงที่ถูกต้อง",
            },
            {
              en: "Copying a classmate's work, whether or not they agreed to it.",
              th: "การคัดลอกผลงานของเพื่อนร่วมชั้น ไม่ว่าจะได้รับความยินยอมหรือไม่",
            },
            {
              en: "Using statistics or tables without acknowledging where they came from.",
              th: "การใช้สถิติและตารางข้อมูลโดยไม่อ้างอิงแหล่งที่มา",
            },
            {
              en: "Summarising or paraphrasing someone else's work, ideas or arguments without acknowledging them.",
              th: "การสรุปหรือถอดความผลงาน ความคิด หรือข้อโต้แย้งของผู้อื่น โดยไม่อ้างอิงแหล่งที่มา",
            },
            {
              en: "Submitting the same piece of work to two or more subjects.",
              th: "การส่งผลงานชิ้นเดียวกันไปใช้ในสองวิชาหรือมากกว่านั้น",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "All assessed work needs proper referencing. Any consistent referencing system is acceptable, including the traditional and Harvard systems. Ask your lecturer if you're not sure how to reference something.",
            th: "ผลงานทุกชิ้นที่ใช้ประเมินผลต้องมีการอ้างอิงที่ถูกต้อง ระบบการอ้างอิงแบบใดก็ได้ที่ใช้อย่างสม่ำเสมอ รวมถึงระบบดั้งเดิมและระบบ Harvard หากไม่แน่ใจว่าจะอ้างอิงอย่างไร ให้สอบถามอาจารย์ผู้สอน",
          },
        },
      ],
      citations: [
        {
          label: {
            en: "Dishonesty in academic assessment as a serious disciplinary offence (University Regulation on Student Discipline, provision 8)",
            th: "การทุจริตในการวัดผลการศึกษาในฐานะความผิดวินัยร้ายแรง (ข้อบังคับว่าด้วยวินัยนักศึกษา ข้อ 8)",
          },
          href: "/activity/regulations/discipline-2568#prov-8",
        },
      ],
      related: [
        {
          label: {
            en: "Academic life: rules and procedures",
            th: "ชีวิตการเรียน: ระเบียบและขั้นตอน",
          },
          href: "/student-life/handbook/academic-life",
        },
      ],
    },

    /* ---- Graduating and honours ---- */

    {
      kind: "question",
      id: "q-academic-graduate",
      question: {
        en: "Do you want the degree requirements, or the honours criteria?",
        th: "ต้องการดูเงื่อนไขการจบการศึกษา หรือเกณฑ์เกียรตินิยม",
      },
      options: [
        {
          id: "requirements",
          label: {
            en: "What I need to complete the degree",
            th: "สิ่งที่ต้องทำให้ครบเพื่อจบการศึกษา",
          },
          next: "out-academic-graduate-requirements",
        },
        {
          id: "honours",
          label: {
            en: "Whether I'll get honours",
            th: "จะได้เกียรตินิยมหรือไม่",
          },
          next: "out-academic-honours",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-academic-graduate-requirements",
      title: {
        en: "127 credits, a 2.00 GPA, 7 semesters, and a nomination request on time",
        th: "127 หน่วยกิต เกรดเฉลี่ย 2.00 ลงทะเบียนอย่างน้อย 7 ภาคการศึกษา และยื่นคำร้องขอเสนอชื่อให้ทันเวลา",
      },
      summary: {
        en: "You're nominated for the degree once you've completed at least 127 credits (30 general education, 91 major, 6 free elective), met all curriculum requirements with a GPA of at least 2.00, been enrolled for at least 7 semesters, and submitted a nomination request within the first 14 days of your final semester (or the first 7 days of your final summer session).",
        th: "คุณจะได้รับการเสนอชื่อรับปริญญาเมื่อเรียนครบหน่วยกิตขั้นต่ำ 127 หน่วยกิต (วิชาศึกษาทั่วไป 30 วิชาเฉพาะ 91 วิชาเลือกเสรี 6) เรียนครบทุกเงื่อนไขของหลักสูตรด้วยเกรดเฉลี่ยสะสมอย่างน้อย 2.00 ลงทะเบียนเรียนในหลักสูตรมาแล้วอย่างน้อย 7 ภาคการศึกษา และยื่นคำร้องขอเสนอชื่อรับปริญญาภายใน 14 วันแรกของภาคการศึกษาสุดท้าย หรือ 7 วันแรกของภาคฤดูร้อนสุดท้าย",
      },
      owner: {
        en: "The Faculty confirms you meet these before your name is submitted for the degree.",
        th: "คณะเป็นผู้ยืนยันว่าคุณครบเงื่อนไขก่อนเสนอชื่อขอรับปริญญา",
      },
      related: [
        {
          label: {
            en: "Assessment and degree requirements",
            th: "การวัดผลและเงื่อนไขการสำเร็จการศึกษา",
          },
          href: "/student-life/handbook/assessment-and-degree",
        },
        {
          label: { en: "The PI574 internship", th: "การฝึกงาน PI574" },
          href: "/answers/internship-check",
          description: {
            en: "The internship is compulsory before you can graduate.",
            th: "การฝึกงานเป็นข้อบังคับก่อนจะจบการศึกษาได้",
          },
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-academic-honours",
      title: {
        en: "Honours depends on GPA, timing, and a clean record",
        th: "เกียรตินิยมขึ้นอยู่กับเกรดเฉลี่ย ระยะเวลาเรียน และประวัติที่ไม่มีปัญหา",
      },
      summary: {
        en: "First-Class Honours needs all requirements completed within 4 years (not counting leave), a GPA of at least 3.50, never below C or a U grade, no repeated course or F, and no disciplinary punishment at the written-probation level or higher.",
        th: "เกียรตินิยมอันดับหนึ่งต้องเรียนครบทุกเงื่อนไขภายใน 4 ปี (ไม่นับช่วงลาพัก) เกรดเฉลี่ยสะสมอย่างน้อย 3.50 ไม่เคยได้เกรดต่ำกว่า C หรือเกรด U ไม่เคยลงทะเบียนซ้ำวิชาใดหรือได้เกรด F และไม่เคยได้รับโทษทางวินัยระดับทำทัณฑ์บนหรือสูงกว่า",
      },
      body: [
        {
          kind: "steps",
          title: {
            en: "Second-Class Honours: meet either set of criteria",
            th: "เกียรตินิยมอันดับสอง: เข้าเกณฑ์ข้อใดข้อหนึ่งต่อไปนี้",
          },
          items: [
            {
              en: "Criteria 1: complete within 4 years, GPA at least 3.50, below C in one course only, never U, no repeated course or F, no disciplinary punishment at written-probation level or higher.",
              th: "เกณฑ์ที่ 1: เรียนครบภายใน 4 ปี เกรดเฉลี่ยอย่างน้อย 3.50 ได้เกรดต่ำกว่า C ได้ไม่เกิน 1 วิชา ไม่เคยได้เกรด U ไม่เคยลงทะเบียนซ้ำวิชาใดหรือได้เกรด F และไม่เคยได้รับโทษทางวินัยระดับทำทัณฑ์บนหรือสูงกว่า",
            },
            {
              en: "Criteria 2: complete within 4 years, GPA at least 3.25, never below C in a major-area course, never U, no repeated course or F, no disciplinary punishment at written-probation level or higher.",
              th: "เกณฑ์ที่ 2: เรียนครบภายใน 4 ปี เกรดเฉลี่ยอย่างน้อย 3.25 ไม่เคยได้เกรดต่ำกว่า C ในวิชาเฉพาะสาขา ไม่เคยได้เกรด U ไม่เคยลงทะเบียนซ้ำวิชาใดหรือได้เกรด F และไม่เคยได้รับโทษทางวินัยระดับทำทัณฑ์บนหรือสูงกว่า",
            },
          ],
        },
      ],
      owner: {
        en: "The Faculty applies these criteria when your degree is confirmed.",
        th: "คณะเป็นผู้ใช้เกณฑ์เหล่านี้เมื่อยืนยันการสำเร็จการศึกษาของคุณ",
      },
      citations: [
        {
          label: {
            en: "Written disciplinary probation as the lowest disciplinary penalty (University Regulation on Student Discipline, provision 10)",
            th: "การทำทัณฑ์บนในฐานะบทลงโทษทางวินัยขั้นต่ำสุด (ข้อบังคับว่าด้วยวินัยนักศึกษา ข้อ 10)",
          },
          href: "/activity/regulations/discipline-2568#prov-10",
        },
      ],
      related: [
        {
          label: {
            en: "Assessment and degree requirements",
            th: "การวัดผลและเงื่อนไขการสำเร็จการศึกษา",
          },
          href: "/student-life/handbook/assessment-and-degree",
        },
      ],
    },

    /* ================================================================ */
    /* Topic 2: internship-check                                        */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-internship-stage",
      question: {
        en: "What do you need to know about the internship?",
        th: "ต้องการรู้เรื่องอะไรเกี่ยวกับการฝึกงาน",
      },
      hint: {
        en: "The internship (PI574) is run by the BIR programme office, not by BIRSA.",
        th: "การฝึกงาน (PI574) อยู่ในความรับผิดชอบของสำนักงานหลักสูตร BIR ไม่ใช่ BIRSA",
      },
      options: [
        {
          id: "eligible",
          label: {
            en: "Whether I can do it yet",
            th: "ตอนนี้ฝึกงานได้หรือยัง",
          },
          next: "out-internship-eligibility",
        },
        {
          id: "forms",
          label: {
            en: "The forms I need, and their deadlines",
            th: "แบบฟอร์มที่ต้องใช้ และกำหนดส่ง",
          },
          next: "out-internship-forms",
        },
        {
          id: "schedule",
          label: {
            en: "What the schedule looks like",
            th: "ตารางเวลาการฝึกงานเป็นอย่างไร",
          },
          next: "out-internship-schedule",
        },
        {
          id: "marks",
          label: {
            en: "How it's graded",
            th: "ให้คะแนนอย่างไร",
          },
          next: "out-internship-marking",
        },
        {
          id: "switch",
          label: {
            en: "I want to change organisation after being accepted",
            th: "อยากเปลี่ยนหน่วยงานหลังจากได้รับตอบรับแล้ว",
          },
          next: "out-internship-switch",
        },
        {
          id: "who",
          label: {
            en: "Who to contact about it",
            th: "ติดต่อใครเรื่องนี้",
          },
          next: "out-internship-contact",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-internship-eligibility",
      title: {
        en: "You need your third-year coursework done first",
        th: "ต้องเรียนวิชาของชั้นปีที่ 3 ให้ครบก่อน",
      },
      summary: {
        en: "The internship (PI574 Internship in Politics and International Relations) runs in the summer session of your third year, for 8 weeks, from June to July. To earn credit for it, you must complete your third-year coursework first.",
        th: "การฝึกงาน (PI574 Internship in Politics and International Relations) จัดในภาคฤดูร้อนของชั้นปีที่ 3 เป็นเวลา 8 สัปดาห์ ตั้งแต่มิถุนายนถึงกรกฎาคม การจะได้หน่วยกิตจากการฝึกงาน ต้องเรียนวิชาของชั้นปีที่ 3 ให้ครบก่อน",
      },
      owner: {
        en: "The BIR programme office runs the internship, not BIRSA.",
        th: "สำนักงานหลักสูตร BIR เป็นผู้ดูแลการฝึกงาน ไม่ใช่ BIRSA",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "You find your own host organisation. Once you tell the programme where you're going, it issues the paperwork.",
            th: "คุณต้องหาหน่วยงานที่รับฝึกงานด้วยตนเอง เมื่อแจ้งหลักสูตรว่าจะไปฝึกงานที่ใด หลักสูตรจะออกเอกสารให้",
          },
        },
      ],
      related: [
        { label: { en: "Internship", th: "การฝึกงาน" }, href: "/student-life/handbook/internship" },
        {
          label: { en: "Curriculum and study plan", th: "หลักสูตรและแผนการศึกษา" },
          href: "/student-life/handbook/curriculum-and-study-plan",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-internship-forms",
      title: {
        en: "Two forms: a request, then confirmation",
        th: "สองแบบฟอร์ม คำขอ แล้วตามด้วยการยืนยัน",
      },
      summary: {
        en: "Submit the Internship Request Form between November 2025 and 31 March 2026 to tell the programme which organisation you intend to intern with. Then submit the Secured Internship Form by 28 April 2026 to confirm the internship is secured.",
        th: "ส่งแบบฟอร์ม Internship Request Form ระหว่างเดือนพฤศจิกายน 2568 ถึง 31 มีนาคม 2569 เพื่อแจ้งหลักสูตรว่าจะฝึกงานกับหน่วยงานใด จากนั้นส่งแบบฟอร์ม Secured Internship Form ภายใน 28 เมษายน 2569 เพื่อยืนยันว่าได้รับการตอบรับแล้ว",
      },
      owner: {
        en: "The BIR programme office collects both forms and issues the letters.",
        th: "สำนักงานหลักสูตร BIR เป็นผู้รับแบบฟอร์มทั้งสองฉบับและออกหนังสือที่เกี่ยวข้อง",
      },
      body: [
        {
          kind: "steps",
          items: [
            {
              en: "Submit the Internship Request Form. It tells the programme which organisation you intend to intern with, and requests the documents the programme sends to that organisation.",
              th: "ส่งแบบฟอร์ม Internship Request Form เพื่อแจ้งว่าจะฝึกงานกับหน่วยงานใด และขอให้หลักสูตรออกเอกสารส่งไปยังหน่วยงานนั้น",
            },
            {
              en: "Obtain and submit both required letters within the deadline: a letter from the BIR programme to the organisation, and a letter of confirmation from the organisation back to the programme.",
              th: "ขอและส่งหนังสือทั้ง 2 ฉบับภายในกำหนด ได้แก่ หนังสือจากหลักสูตร BIR ถึงหน่วยงาน และหนังสือตอบรับจากหน่วยงานกลับมายังหลักสูตร",
            },
            {
              en: "Submit the Secured Internship Form to confirm the name of the student who will be interning at the organisation.",
              th: "ส่งแบบฟอร์ม Secured Internship Form เพื่อยืนยันชื่อนักศึกษาที่จะเข้าฝึกงานกับหน่วยงานนั้น",
            },
          ],
        },
        {
          kind: "note",
          tone: "info",
          text: {
            en: "The schedule and deadlines are subject to change. The current version is posted in the Internship 66 Google Classroom and on the BIR programme's internship page.",
            th: "ปฏิทินและกำหนดส่งแบบฟอร์มอาจมีการเปลี่ยนแปลง ฉบับล่าสุดจะประกาศใน Google Classroom ของ Internship 66 และหน้าการฝึกงานของหลักสูตร BIR",
          },
        },
      ],
      actions: [
        {
          label: { en: "Internship Request Form", th: "แบบฟอร์ม Internship Request Form" },
          href: "https://forms.gle/UzhAN9qiWb3mGdCu9",
          external: true,
        },
        {
          label: { en: "Secured Internship Form", th: "แบบฟอร์ม Secured Internship Form" },
          href: "https://forms.gle/M5oysLm3wSu9c8CQ7",
          external: true,
        },
      ],
      related: [
        { label: { en: "Internship", th: "การฝึกงาน" }, href: "/student-life/handbook/internship" },
      ],
    },

    {
      kind: "outcome",
      id: "out-internship-schedule",
      title: {
        en: "The internship period runs June to July, with two evaluations and a report",
        th: "ช่วงฝึกงานอยู่ระหว่างมิถุนายนถึงกรกฎาคม มีการประเมิน 2 ครั้งและรายงาน 1 ฉบับ",
      },
      summary: {
        en: "For students with ID 66 (academic year 2025 / B.E. 2568): orientation on 25 May 2026, the internship period runs 2 June to 24 July 2026, the first evaluation is due 26 June 2026, the final evaluation is due 24 to 31 July 2026, and the internship report is due 2 August 2026.",
        th: "สำหรับนักศึกษารหัส 66 (ปีการศึกษา 2568) ปฐมนิเทศวันที่ 25 พฤษภาคม 2569 ช่วงฝึกงานอยู่ระหว่างวันที่ 2 มิถุนายน ถึง 24 กรกฎาคม 2569 ส่งแบบประเมินครั้งที่ 1 ภายใน 26 มิถุนายน 2569 ส่งแบบประเมินครั้งสุดท้ายระหว่าง 24 ถึง 31 กรกฎาคม 2569 และส่งรายงานการฝึกงานภายใน 2 สิงหาคม 2569",
      },
      owner: {
        en: "The BIR programme office sets and updates this schedule.",
        th: "สำนักงานหลักสูตร BIR เป็นผู้กำหนดและปรับปรุงปฏิทินนี้",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "This schedule is specific to the ID 66 cohort and can change. Check the Internship 66 Google Classroom or the BIR programme's internship page for the current version if you're not in that cohort, or if the date has passed.",
            th: "ตารางนี้เป็นของนักศึกษารหัส 66 โดยเฉพาะ และอาจมีการเปลี่ยนแปลง หากคุณไม่ใช่รหัส 66 หรือวันที่ผ่านไปแล้ว ควรตรวจสอบฉบับล่าสุดจาก Google Classroom ของ Internship 66 หรือหน้าการฝึกงานของหลักสูตร BIR",
          },
        },
      ],
      actions: [
        {
          label: { en: "BIR programme's internship page", th: "หน้าการฝึกงานของหลักสูตร BIR" },
          href: "https://www.birpolsci.com/birinternship",
          external: true,
        },
      ],
      related: [
        { label: { en: "Internship", th: "การฝึกงาน" }, href: "/student-life/handbook/internship" },
      ],
    },

    {
      kind: "outcome",
      id: "out-internship-marking",
      title: {
        en: "100 marks split between the programme and your supervisor, graded S or U",
        th: "คะแนนเต็ม 100 แบ่งระหว่างหลักสูตรและผู้ควบคุมการฝึกงาน ให้ผลเป็น S หรือ U",
      },
      summary: {
        en: "The internship is graded satisfactory (S) or unsatisfactory (U), not on the standard grade-point scale. 50 marks come from BIR (5 for internship supervision, 45 for your internship report), and 50 from your workplace supervisor (20 for the first evaluation, 30 for the final evaluation).",
        th: "การฝึกงานให้ผลเป็นผ่าน (S) หรือไม่ผ่าน (U) ไม่ใช้ระบบแต้มเกรดตามปกติ คะแนน 50 ส่วนมาจากหลักสูตร BIR (5 คะแนนจากการนิเทศการฝึกงาน 45 คะแนนจากรายงานการฝึกงาน) และอีก 50 ส่วนมาจากผู้ควบคุมการฝึกงานที่หน่วยงาน (20 คะแนนจากการประเมินครั้งที่ 1 และ 30 คะแนนจากการประเมินครั้งสุดท้าย)",
      },
      owner: {
        en: "The BIR programme office and your workplace supervisor mark the internship jointly.",
        th: "สำนักงานหลักสูตร BIR และผู้ควบคุมการฝึกงานที่หน่วยงานเป็นผู้ให้คะแนนร่วมกัน",
      },
      body: [
        {
          kind: "paragraph",
          text: {
            en: "If your first evaluation comes in below 10 marks, the lecturer in charge discusses your responsibilities and performance with you and your supervisor.",
            th: "หากการประเมินครั้งที่ 1 ได้ต่ำกว่า 10 คะแนน อาจารย์ผู้รับผิดชอบจะหารือกับคุณและผู้ควบคุมการฝึกงานเรื่องความรับผิดชอบและผลการปฏิบัติงาน",
          },
        },
        {
          kind: "steps",
          title: { en: "The internship report", th: "รายงานการฝึกงาน" },
          items: [
            {
              en: "Worth 45 marks. Length 12 to 15 pages, not counting tables, charts and pictures. Times New Roman 12, single-spaced.",
              th: "มีคะแนน 45 คะแนน ความยาว 12 ถึง 15 หน้า ไม่นับตาราง แผนภูมิ และรูปภาพ ใช้ตัวอักษร Times New Roman ขนาด 12 ระยะบรรทัดเดี่ยว",
            },
            {
              en: "Must cover: the organisation's structure, objectives and tasks; a weekly journal; self-assessment of what you gained, your strengths and weaknesses; and linkage with theories and approaches.",
              th: "ต้องครอบคลุม 4 ส่วน คือ โครงสร้าง วัตถุประสงค์ และภารกิจขององค์กร บันทึกการปฏิบัติงานรายสัปดาห์ การประเมินตนเองว่าได้ประโยชน์อะไร จุดแข็งและจุดอ่อนของตนเอง และการเชื่อมโยงกับทฤษฎีและแนวคิดที่เรียนมา",
            },
          ],
        },
      ],
      related: [
        { label: { en: "Internship", th: "การฝึกงาน" }, href: "/student-life/handbook/internship" },
      ],
    },

    {
      kind: "outcome",
      id: "out-internship-switch",
      title: {
        en: "You can't switch organisations freely once you're accepted",
        th: "เปลี่ยนหน่วยงานไม่ได้อย่างอิสระเมื่อได้รับตอบรับแล้ว",
      },
      summary: {
        en: "Once an organisation has made its decision and issued the letter approving your internship, you can't change or abort that decision without valid reasons and the programme's approval.",
        th: "เมื่อหน่วยงานพิจารณาและออกหนังสือตอบรับการฝึกงานแล้ว คุณจะเปลี่ยนหรือยกเลิกการตัดสินใจนั้นไม่ได้ เว้นแต่มีเหตุผลอันสมควรและได้รับอนุมัติจากหลักสูตร",
      },
      owner: {
        en: "The BIR programme office decides whether a change is approved.",
        th: "สำนักงานหลักสูตร BIR เป็นผู้พิจารณาว่าจะอนุมัติการเปลี่ยนแปลงหรือไม่",
      },
      body: [
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "If you intern at a different organisation instead, you're responsible for informing the organisation that approved you, and your reasons. That internship will not be credited and will not be graded.",
            th: "หากคุณเลือกไปฝึกงานกับหน่วยงานอื่นแทน คุณต้องแจ้งการตัดสินใจและเหตุผลต่อหน่วยงานที่ตอบรับไว้เดิมด้วยตนเอง และการฝึกงานครั้งนั้นจะไม่ได้รับหน่วยกิตและไม่มีการประเมินผล",
          },
        },
      ],
      related: [
        { label: { en: "Internship", th: "การฝึกงาน" }, href: "/student-life/handbook/internship" },
      ],
      contactCategory: "question",
    },

    {
      kind: "outcome",
      id: "out-internship-contact",
      title: {
        en: "Contact the BIR programme office, not BIRSA",
        th: "ติดต่อสำนักงานหลักสูตร BIR ไม่ใช่ BIRSA",
      },
      summary: {
        en: "The internship is run by the BIR programme office. Phone 02-221-6111 ext. 3409, email bir@tu.ac.th.",
        th: "การฝึกงานอยู่ในความรับผิดชอบของสำนักงานหลักสูตร BIR โทร 02-221-6111 ต่อ 3409 อีเมล bir@tu.ac.th",
      },
      owner: {
        en: "The BIR programme office, not BIRSA.",
        th: "สำนักงานหลักสูตร BIR ไม่ใช่ BIRSA",
      },
      actions: [
        {
          label: { en: "BIR programme's internship page", th: "หน้าการฝึกงานของหลักสูตร BIR" },
          href: "https://www.birpolsci.com/birinternship",
          external: true,
        },
      ],
      related: [
        { label: { en: "Internship", th: "การฝึกงาน" }, href: "/student-life/handbook/internship" },
      ],
    },

    /* ================================================================ */
    /* Topic 3: choose-courses                                          */
    /* ================================================================ */

    {
      kind: "question",
      id: "q-course-need",
      question: {
        en: "What do you need help with?",
        th: "ต้องการความช่วยเหลือเรื่องอะไร",
      },
      options: [
        {
          id: "structure",
          label: {
            en: "Understand the course categories and tracks",
            th: "ทำความเข้าใจหมวดวิชาและกลุ่มวิชา",
          },
          next: "out-course-structure",
        },
        {
          id: "order",
          label: {
            en: "See where a course sits in the year order",
            th: "ดูว่าวิชานั้นควรเรียนตอนไหนตามแผนการศึกษา",
          },
          next: "out-course-order",
        },
        {
          id: "prereq",
          label: {
            en: "Check a prerequisite before I register",
            th: "ตรวจสอบวิชาบังคับก่อนที่ต้องเรียน",
          },
          next: "out-course-prereq",
        },
        {
          id: "reviews",
          label: {
            en: "Read what other students said about a course",
            th: "อ่านความเห็นของรุ่นพี่เกี่ยวกับวิชานั้น",
          },
          next: "out-course-reviews",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-course-structure",
      title: {
        en: "127 credits, in three blocks: general education, major, free elective",
        th: "127 หน่วยกิต แบ่งเป็น 3 หมวด วิชาศึกษาทั่วไป วิชาเฉพาะ และวิชาเลือกเสรี",
      },
      summary: {
        en: "The programme needs a minimum of 127 credits: 30 general education, 91 major requirements, and 6 free elective. The major requirements are made up of core courses, required and elective courses in your concentration, one required course in the Faculty of Economics, and 21 credits in one of three minors.",
        th: "หลักสูตรกำหนดให้เรียนไม่ต่ำกว่า 127 หน่วยกิต แบ่งเป็นวิชาศึกษาทั่วไป 30 หน่วยกิต วิชาเฉพาะ 91 หน่วยกิต และวิชาเลือกเสรี 6 หน่วยกิต วิชาเฉพาะประกอบด้วยวิชาแกน วิชาบังคับและวิชาเลือกในกลุ่มวิชาในสาขา วิชาบังคับ 1 วิชาของคณะเศรษฐศาสตร์ และวิชาโท 21 หน่วยกิตจาก 1 ใน 3 กลุ่มที่เลือก",
      },
      body: [
        {
          kind: "steps",
          title: {
            en: "The three minors (choose one, 21 credits)",
            th: "วิชาโท 3 กลุ่ม (เลือก 1 กลุ่ม รวม 21 หน่วยกิต)",
          },
          items: [
            {
              en: "Governance and Transnational Studies",
              th: "Governance and Transnational Studies",
            },
            {
              en: "Public Administration and Public Policy",
              th: "Public Administration and Public Policy",
            },
            {
              en: "Global Political Economy",
              th: "Global Political Economy",
            },
          ],
        },
        {
          kind: "paragraph",
          text: {
            en: "Each minor has required courses (9 credits), elective courses within the minor (2 courses, 6 credits), and elective courses from the other minors (6 credits). The course catalogue also groups electives outside the minors into two pools: Area Studies, and Approaches and Issues.",
            th: "แต่ละกลุ่มวิชาโทมีวิชาบังคับ (9 หน่วยกิต) วิชาเลือกภายในกลุ่ม (เลือก 2 วิชา 6 หน่วยกิต) และวิชาเลือกจากกลุ่มวิชาโทอื่น (6 หน่วยกิต) นอกจากนี้ยังมีวิชาเลือกในกลุ่มวิชาในสาขาอีก 2 กลุ่ม คือ กลุ่มพื้นที่ศึกษา (Area Studies) และกลุ่มแนวทางและประเด็นศึกษา (Approaches and Issues)",
          },
        },
      ],
      related: [
        {
          label: { en: "Curriculum and study plan", th: "หลักสูตรและแผนการศึกษา" },
          href: "/student-life/handbook/curriculum-and-study-plan",
        },
        {
          label: { en: "Course reviews", th: "รีวิวรายวิชา" },
          href: "/student-life/course-reviews",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-course-order",
      title: {
        en: "The four-year plan sets a typical order, but some courses can shift",
        th: "แผน 4 ปีกำหนดลำดับโดยทั่วไป แต่บางวิชาสามารถสลับได้",
      },
      summary: {
        en: "Year 1 covers general education plus PI211 and PI271. Year 2 adds most core and required courses. Year 3 adds methodology, your minor, and the compulsory summer internship. Year 4 is mostly electives and the seminar course; the handout doesn't list a second semester for year 4.",
        th: "ปีที่ 1 เรียนวิชาศึกษาทั่วไป และ PI211 กับ PI271 ปีที่ 2 เพิ่มวิชาแกนและวิชาบังคับส่วนใหญ่ ปีที่ 3 เพิ่มวิชาวิธีวิทยา วิชาโท และการฝึกงานภาคฤดูร้อนซึ่งเป็นวิชาบังคับ ปีที่ 4 ส่วนใหญ่เป็นวิชาเลือกและวิชาสัมมนา เอกสารต้นฉบับไม่ได้ระบุรายวิชาของภาคการศึกษาที่ 2 ของปีที่ 4",
      },
      body: [
        {
          kind: "note",
          tone: "info",
          text: {
            en: "The exact general education courses you take, and the order, can vary with your English-exemption result and each term's course arrangement. Courses the handout marks as changeable can be shuffled between semesters.",
            th: "วิชาศึกษาทั่วไปที่เรียนจริงและลำดับการเรียนอาจแตกต่างกันไป ขึ้นอยู่กับผลการสอบยกเว้นภาษาอังกฤษและการจัดรายวิชาในแต่ละภาคการศึกษา วิชาที่เอกสารต้นฉบับระบุว่าสามารถเปลี่ยนแปลงได้ อาจสลับภาคการศึกษาได้เช่นกัน",
          },
        },
        {
          kind: "note",
          tone: "warning",
          text: {
            en: "The internship's Internship Request Form opens the November before your third-year summer, and the host organisation must be confirmed by the end of April.",
            th: "แบบฟอร์มขอฝึกงานเปิดยื่นตั้งแต่เดือนพฤศจิกายนของปีก่อนหน้าภาคฤดูร้อนของชั้นปีที่ 3 และต้องยืนยันหน่วยงานที่รับฝึกงานภายในสิ้นเดือนเมษายน",
          },
        },
      ],
      related: [
        {
          label: { en: "Curriculum and study plan", th: "หลักสูตรและแผนการศึกษา" },
          href: "/student-life/handbook/curriculum-and-study-plan",
        },
        {
          label: { en: "The PI574 internship", th: "การฝึกงาน PI574" },
          href: "/answers/internship-check",
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-course-prereq",
      title: {
        en: "Check the specific course; several build on PI211 or PI280",
        th: "ตรวจสอบวิชานั้นโดยตรง หลายวิชาต้องเรียน PI211 หรือ PI280 ผ่านมาก่อน",
      },
      summary: {
        en: "PI280 requires you to have earned credits of PI271. PI300, PI320 and PI321 each require PI211. Many of the Area Studies and Approaches and Issues electives, taken in the third and fourth year, require PI280. Not every course has a prerequisite; check the specific course page for the one you're taking.",
        th: "PI280 ต้องสอบได้วิชา PI271 มาก่อน ส่วน PI300 PI320 และ PI321 แต่ละวิชาต้องสอบได้ PI211 มาก่อน วิชาเลือกในกลุ่มพื้นที่ศึกษาและกลุ่มแนวทางและประเด็นศึกษาส่วนใหญ่ ซึ่งเรียนในชั้นปีที่ 3 และ 4 ต้องสอบได้ PI280 มาก่อน ไม่ใช่ทุกวิชาที่มีวิชาบังคับก่อน ควรตรวจสอบหน้าของวิชาที่คุณกำลังจะลงทะเบียนโดยตรง",
      },
      owner: {
        en: "The Registrar's system enforces prerequisites at registration. If a prerequisite genuinely doesn't fit your situation, that's the Dean's exception to grant, not BIRSA's.",
        th: "ระบบของสำนักงานทะเบียนนักศึกษาเป็นผู้บังคับใช้เงื่อนไขวิชาบังคับก่อนตอนลงทะเบียน หากมีเหตุผลที่ทำให้เงื่อนไขนี้ไม่เหมาะกับสถานการณ์ของคุณจริง ๆ คณบดีเป็นผู้พิจารณายกเว้น ไม่ใช่ BIRSA",
      },
      related: [
        {
          label: { en: "Course reviews", th: "รีวิวรายวิชา" },
          href: "/student-life/course-reviews",
          description: {
            en: "Each course's page lists its prerequisite, if it has one.",
            th: "หน้าของแต่ละวิชาจะระบุวิชาบังคับก่อน ถ้ามี",
          },
        },
      ],
    },

    {
      kind: "outcome",
      id: "out-course-reviews",
      title: {
        en: "Course reviews are on the course reviews page",
        th: "รีวิวรายวิชาอยู่ที่หน้ารีวิวรายวิชา",
      },
      summary: {
        en: "Search or filter the full course catalogue by track and category. Where BIRSA has collected one, a course's page shows a student-written review: workload, assessment style, tips, and quotes from students who took it.",
        th: "ค้นหาหรือกรองรายวิชาทั้งหมดตามกลุ่มวิชาและหมวดวิชาได้ที่หน้ารีวิวรายวิชา หากมีข้อมูลจากรุ่นพี่ หน้าของวิชานั้นจะแสดงรีวิว ได้แก่ ปริมาณงาน รูปแบบการประเมินผล เคล็ดลับ และคำบอกเล่าจากนักศึกษาที่เคยเรียน",
      },
      body: [
        {
          kind: "note",
          tone: "info",
          text: {
            en: "Not every course has a review yet. Where one is missing, the course's page invites you to contribute one.",
            th: "ไม่ใช่ทุกวิชาที่มีรีวิวแล้ว หากวิชานั้นยังไม่มีรีวิว หน้าของวิชานั้นจะชวนให้คุณส่งรีวิวของตัวเองเข้ามา",
          },
        },
      ],
      actions: [
        {
          label: { en: "Course reviews", th: "รีวิวรายวิชา" },
          href: "/student-life/course-reviews",
        },
      ],
      contactCategory: "suggestion",
    },
  ],
};
