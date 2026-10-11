/**
 * Copy for the places where a study plan leaves the student's device or asks
 * someone a question: sharing it with an advisor, sending the electives in it
 * to Academic Affairs, asking Academic Affairs about it, exporting its
 * registration dates, and the line a course page shows once enough students
 * have planned the course.
 *
 * Kept in its own module, typed explicitly like `planLinkCopy.ts` so the Thai
 * must cover every English key, rather than added to the site dictionary,
 * which several other pieces of work are editing at once. Thai here is
 * written as Thai, not translated word for word.
 *
 * Everything here is optional for the student and says so. Nothing describes
 * a procedure BIRSA does not have: Academic Affairs reads what is sent, and
 * the copy never promises an answer, a decision or a course running.
 */
import type { Locale } from "@/lib/i18n";
import type { PlanSummaryLabels } from "@/lib/study-plan/summaryText";
import { buildStudyPlanCopy } from "@/components/study-plan/studyPlanCopy";

export type PlanOutreachCopy = {
  heading: string;
  intro: string;
  share: {
    heading: string;
    body: string;
    linkLabel: string;
    openLink: string;
    copyButton: string;
    copied: string;
    copyFailed: string;
    datedNote: string;
    noScriptNote: string;
  };
  view: {
    title: string;
    lede: string;
    readOnlyTitle: string;
    /** Contains "{date}". */
    readOnlyDated: string;
    readOnlyUndated: string;
    /** Contains "{date}". */
    openedOn: string;
    emptyTitle: string;
    emptyBody: string;
    invalidTitle: string;
    invalidBody: string;
    noScriptTitle: string;
    noScriptBody: string;
    noScriptLink: string;
    startLink: string;
    sharedOnLabel: string;
  };
  demand: {
    heading: string;
    intro: string;
    sentHeading: string;
    /** Contains "{version}". */
    versionTemplate: string;
    /** Contains "{code}" and "{term}". */
    entryTemplate: string;
    notSent: string;
    /** Contains "{n}". */
    usedFor: string;
    limitNote: string;
    checkboxLabel: string;
    submit: string;
    submitting: string;
    none: string;
    shared: string;
    /** Contains "{term}". */
    alreadyShared: string;
    errorSummaryTitle: string;
    errors: Record<"not-agreed" | "invalid" | "rate-limited" | "not-configured" | "error", string>;
  };
  ask: {
    heading: string;
    body: string;
    button: string;
    note: string;
    subject: string;
  };
  attach: {
    label: string;
    hint: string;
  };
  calendar: {
    heading: string;
    intro: string;
    windows: Record<"registration" | "add-drop", string>;
    download: string;
    emptyTitle: string;
    emptyBody: string;
    announcementsLink: string;
  };
  published: {
    label: string;
    /** Contains "{n}" and "{term}". */
    template: string;
    /** Contains "{n}". */
    note: string;
  };
  summary: PlanSummaryLabels;
};

type OwnCopy = Omit<PlanOutreachCopy, "summary"> & {
  summary: Omit<PlanSummaryLabels, "terms">;
};

export function buildPlanOutreachCopy(locale: Locale): PlanOutreachCopy {
  const base = locale === "th" ? th : en;
  return { ...base, summary: { ...base.summary, terms: buildStudyPlanCopy(locale).terms } };
}

const en: OwnCopy = {
  heading: "Share this plan or ask about it",
  intro:
    "Each of these is optional. Your plan stays on this device unless you choose one, and nothing here changes it.",
  share: {
    heading: "Share with an advisor",
    body: "Send an advisor a link that opens your plan as a page they can read but not change. The plan is inside the link, after the # sign, and a browser never sends that part to a server, so BIRSA does not receive it. Anyone who has the link can read the plan, so send it only to the person you mean to.",
    linkLabel: "Your link",
    openLink: "Open the read-only view",
    copyButton: "Copy link",
    copied: "Link copied",
    copyFailed: "Could not copy. Select the link above and copy it by hand.",
    datedNote: "The link shows your plan as it is today. If you change your plan, make a new link.",
    noScriptNote:
      "The person you send it to needs JavaScript to open it. If they do not have it, send them your printed plan instead.",
  },
  view: {
    title: "Shared study plan",
    lede: "A copy of a student's study plan that you can read but not change.",
    readOnlyTitle: "Read only",
    readOnlyDated:
      "This is a copy of a plan made on {date}. You cannot change it here, and it does not update when the student changes their plan. It was read from the link in your browser and was not sent to BIRSA.",
    readOnlyUndated:
      "This is a copy of a plan. The link does not say when it was made, so ask the student how recent it is. You cannot change it here, and it does not update when the student changes their plan. It was read from the link in your browser and was not sent to BIRSA.",
    openedOn: "Opened on {date}",
    emptyTitle: "There is no plan in this link",
    emptyBody:
      "A shared plan is held in the part of the link after the # sign. This link does not have one. Ask the student to send it again.",
    invalidTitle: "We could not read this plan",
    invalidBody:
      "The link may have been cut short when it was sent, or changed along the way. Ask the student to send it again, or to send their printed plan.",
    noScriptTitle: "This page needs JavaScript",
    noScriptBody:
      "A shared plan is held in the link itself, and only JavaScript can read it. Without JavaScript the print page of the study plan service is the way to share a plan. Ask the student to open their plan, use its print page, and send you the printout or a PDF of it.",
    noScriptLink: "About the study plan service",
    startLink: "Make your own study plan",
    sharedOnLabel: "Plan shared on",
  },
  demand: {
    heading: "Help Academic Affairs plan electives",
    intro:
      "You can tell Academic Affairs which elective courses you plan to take. It is optional, and your plan works the same whether you do or not.",
    sentHeading: "This is everything that would be sent",
    versionTemplate: "Curriculum: {version}",
    entryTemplate: "{code}, planned for {term}",
    notSent:
      "Nothing else is sent. That means no cohort, no minor, no courses you have passed, no name and no student ID. BIRSA does not keep the address you send from.",
    usedFor:
      "Academic Affairs sees how many students plan each course in each term and can pass that to the programme office. A course page says how many only as a band, and only once {n} or more students have planned it for a term.",
    limitNote:
      "You can send once from each browser each term. That limit is soft. BIRSA does not know who you are, so it cannot stop someone sending again, and the number it adds up is an indication rather than an exact count.",
    checkboxLabel: "Share my planned electives anonymously with Academic Affairs",
    submit: "Send my electives",
    submitting: "Sending",
    none: "There are no elective courses in your plan yet. Add some to the terms above, then come back here.",
    shared: "Thank you. Your planned electives were sent.",
    alreadyShared:
      "You have already sent your electives from this browser this term ({term}). You can send again next term.",
    errorSummaryTitle: "Your electives were not sent",
    errors: {
      "not-agreed": "Tick the box if you want to share your planned electives.",
      invalid:
        "We could not use what was sent. Reload the plan screen and try again, and nothing was stored.",
      "rate-limited":
        "Several people have sent from your network in the last few minutes. Try again soon.",
      "not-configured": "Sharing is not switched on yet, so nothing was sent.",
      error: "Something went wrong and nothing was stored. Try again later.",
    },
  },
  ask: {
    heading: "Ask Academic Affairs about this plan",
    body: "This opens the contact form with a short summary of your plan ready to attach. You can read it, change it or delete it before you send anything. Nothing is sent until you press send on the last page.",
    button: "Start a message about my plan",
    note: "The summary lists your courses by term, what this service found, your curriculum and your minor. It does not include your name, your student ID or the courses you have passed.",
    subject: "Question about my study plan",
  },
  attach: {
    label: "Study plan summary",
    hint: "This is a summary of the plan you came from. It goes with your message. You can change it, or delete all of it to send your message without it.",
  },
  calendar: {
    heading: "Registration and add-drop dates",
    intro:
      "These are the dates BIRSA has recorded for the terms in your plan. Download them to add to your own calendar.",
    windows: { registration: "Registration", "add-drop": "Add and drop" },
    download: "Download the dates (.ics)",
    emptyTitle: "No registration dates recorded yet",
    emptyBody:
      "BIRSA has not recorded registration or add-drop dates for the terms in your plan. BIR is a special programme, so its dates are announced by BIRSA and are not the same as the Registrar's. Use the dates BIRSA announces. When they are recorded, they will appear here for you to download.",
    announcementsLink: "Where BIRSA announces academic dates",
  },
  published: {
    label: "Student interest",
    template: "Planned by {n} or more students for {term}.",
    note: "From students who chose to share their plans anonymously. BIRSA shows this only once {n} or more students have planned the course for a term, and never shows the exact number. It is not a promise that the course will run.",
  },
  summary: {
    heading: "Study plan summary (from the BIRSA study plan service)",
    curriculum: "Curriculum",
    minor: "Minor",
    coursesHeading: "Planned courses",
    noCourses: "No courses are planned yet.",
    creditsTemplate: "{n} credits",
    freeElectiveTemplate: "{n} free elective credits",
    findingsHeading: "What the service found",
    noFindings: "Nothing to flag.",
    severity: { problem: "Problem", warning: "Warning", note: "Note" },
    moreFindingsTemplate: "{n} more findings are on the plan screen.",
    truncated: "(Summary cut short. The rest is on the plan screen.)",
  },
};

const th: OwnCopy = {
  heading: "ส่งต่อแผนนี้หรือสอบถามเกี่ยวกับแผนนี้",
  intro:
    "ทุกข้อด้านล่างเป็นไปตามความสมัครใจ แผนของท่านยังคงอยู่ในอุปกรณ์เครื่องนี้ เว้นแต่ท่านเลือกทำข้อใดข้อหนึ่ง และไม่มีข้อใดแก้ไขแผนของท่าน",
  share: {
    heading: "ส่งแผนให้อาจารย์ที่ปรึกษา",
    body: "ส่งลิงก์ให้อาจารย์ที่ปรึกษาเพื่อเปิดแผนของท่านเป็นหน้าที่อ่านได้อย่างเดียวและแก้ไขไม่ได้ ตัวแผนอยู่ในลิงก์หลังเครื่องหมาย # ซึ่งเบราว์เซอร์จะไม่ส่งส่วนนี้ไปยังเซิร์ฟเวอร์ BIRSA จึงไม่ได้รับแผนของท่าน ผู้ที่ได้รับลิงก์อ่านแผนได้ทุกคน โปรดส่งให้เฉพาะผู้ที่ท่านตั้งใจจะส่งให้",
    linkLabel: "ลิงก์ของท่าน",
    openLink: "เปิดหน้าอ่านอย่างเดียว",
    copyButton: "คัดลอกลิงก์",
    copied: "คัดลอกลิงก์แล้ว",
    copyFailed: "คัดลอกไม่สำเร็จ โปรดเลือกลิงก์ด้านบนแล้วคัดลอกด้วยตนเอง",
    datedNote: "ลิงก์นี้แสดงแผนตามที่เป็นอยู่ในวันนี้ หากท่านแก้ไขแผน โปรดสร้างลิงก์ใหม่",
    noScriptNote:
      "ผู้รับต้องเปิด JavaScript จึงจะเปิดลิงก์นี้ได้ หากผู้รับไม่ได้เปิดไว้ โปรดส่งแผนฉบับพิมพ์ให้แทน",
  },
  view: {
    title: "แผนการศึกษาที่ส่งมาให้ดู",
    lede: "สำเนาแผนการศึกษาของนักศึกษา อ่านได้อย่างเดียวและแก้ไขไม่ได้",
    readOnlyTitle: "อ่านได้อย่างเดียว",
    readOnlyDated:
      "นี่คือสำเนาแผนที่จัดทำเมื่อ {date} แก้ไขในหน้านี้ไม่ได้ และจะไม่เปลี่ยนตามเมื่อนักศึกษาแก้ไขแผนภายหลัง ระบบอ่านแผนจากลิงก์ในเบราว์เซอร์ของท่าน และไม่ได้ส่งแผนไปยัง BIRSA",
    readOnlyUndated:
      "นี่คือสำเนาแผน ลิงก์นี้ไม่ได้ระบุวันที่จัดทำ จึงควรสอบถามนักศึกษาว่าแผนนี้เป็นฉบับล่าสุดหรือไม่ แก้ไขในหน้านี้ไม่ได้ และจะไม่เปลี่ยนตามเมื่อนักศึกษาแก้ไขแผนภายหลัง ระบบอ่านแผนจากลิงก์ในเบราว์เซอร์ของท่าน และไม่ได้ส่งแผนไปยัง BIRSA",
    openedOn: "เปิดดูเมื่อ {date}",
    emptyTitle: "ลิงก์นี้ไม่มีแผนอยู่",
    emptyBody:
      "แผนที่ส่งต่อกันจะอยู่ในส่วนของลิงก์หลังเครื่องหมาย # แต่ลิงก์นี้ไม่มีส่วนดังกล่าว โปรดขอให้นักศึกษาส่งลิงก์มาใหม่",
    invalidTitle: "อ่านแผนนี้ไม่ได้",
    invalidBody:
      "ลิงก์อาจถูกตัดให้สั้นลงระหว่างการส่ง หรือถูกแก้ไขระหว่างทาง โปรดขอให้นักศึกษาส่งลิงก์มาใหม่ หรือส่งแผนฉบับพิมพ์มาแทน",
    noScriptTitle: "หน้านี้ต้องใช้ JavaScript",
    noScriptBody:
      "แผนที่ส่งต่อกันอยู่ในตัวลิงก์ และต้องใช้ JavaScript จึงจะอ่านได้ หากไม่ใช้ JavaScript ให้ส่งต่อแผนผ่านหน้าพิมพ์ของบริการวางแผนการศึกษาแทน โปรดขอให้นักศึกษาเปิดแผนของตน ใช้หน้าพิมพ์ แล้วส่งฉบับพิมพ์หรือไฟล์ PDF มาให้",
    noScriptLink: "เกี่ยวกับบริการวางแผนการศึกษา",
    startLink: "จัดทำแผนการศึกษาของท่านเอง",
    sharedOnLabel: "แผนนี้ส่งต่อเมื่อ",
  },
  demand: {
    heading: "ช่วยฝ่ายวิชาการวางแผนวิชาเลือก",
    intro:
      "ท่านเลือกแจ้งฝ่ายวิชาการได้ว่าวางแผนจะเรียนวิชาเลือกใดบ้าง การแจ้งเป็นไปตามความสมัครใจ และแผนของท่านใช้งานได้เหมือนเดิมไม่ว่าท่านจะแจ้งหรือไม่",
    sentHeading: "ข้อมูลทั้งหมดที่จะถูกส่ง",
    versionTemplate: "หลักสูตร: {version}",
    entryTemplate: "{code} วางแผนไว้ที่{term}",
    notSent:
      "ไม่มีข้อมูลอื่นถูกส่งไปด้วย ได้แก่ รุ่น วิชาโท รายวิชาที่ผ่านแล้ว ชื่อ และรหัสนักศึกษา และ BIRSA ไม่เก็บหมายเลขไอพีของอุปกรณ์ที่ท่านใช้ส่ง",
    usedFor:
      "ฝ่ายวิชาการจะเห็นว่ามีนักศึกษากี่คนวางแผนเรียนแต่ละวิชาในแต่ละภาคการศึกษา และนำไปแจ้งสำนักงานหลักสูตรได้ หน้ารายวิชาจะแสดงข้อมูลนี้เป็นช่วงเท่านั้น และแสดงเมื่อมีนักศึกษาวางแผนเรียนวิชานั้นในภาคการศึกษาหนึ่งตั้งแต่ {n} คนขึ้นไป",
    limitNote:
      "ส่งได้หนึ่งครั้งต่อเบราว์เซอร์ในแต่ละภาคการศึกษา ข้อจำกัดนี้ไม่เข้มงวด เพราะ BIRSA ไม่ทราบว่าท่านเป็นใคร จึงไม่อาจป้องกันการส่งซ้ำได้ ตัวเลขที่รวบรวมได้จึงเป็นเพียงข้อบ่งชี้ ไม่ใช่จำนวนที่แน่นอน",
    checkboxLabel: "แบ่งปันวิชาเลือกที่วางแผนไว้ของฉันกับฝ่ายวิชาการโดยไม่ระบุตัวตน",
    submit: "ส่งวิชาเลือกของฉัน",
    submitting: "กำลังส่ง",
    none: "แผนของท่านยังไม่มีวิชาเลือก โปรดเพิ่มวิชาเลือกในภาคการศึกษาด้านบนก่อน แล้วกลับมาที่นี่",
    shared: "ขอบคุณ ระบบส่งวิชาเลือกที่ท่านวางแผนไว้เรียบร้อยแล้ว",
    alreadyShared: "ท่านส่งวิชาเลือกจากเบราว์เซอร์นี้แล้วใน{term} ส่งใหม่ได้ในภาคการศึกษาถัดไป",
    errorSummaryTitle: "ยังไม่ได้ส่งวิชาเลือกของท่าน",
    errors: {
      "not-agreed": "โปรดทำเครื่องหมายในช่องหากท่านต้องการแบ่งปันวิชาเลือกที่วางแผนไว้",
      invalid:
        "ระบบใช้ข้อมูลที่ส่งมาไม่ได้ โปรดโหลดหน้าแผนการศึกษาใหม่แล้วลองอีกครั้ง ยังไม่มีการบันทึกข้อมูลใด",
      "rate-limited":
        "ช่วงไม่กี่นาทีที่ผ่านมามีการส่งข้อมูลจากเครือข่ายของท่านหลายครั้ง โปรดลองใหม่ภายหลัง",
      "not-configured": "ระบบนี้ยังไม่เปิดใช้งาน จึงยังไม่มีการส่งข้อมูล",
      error: "เกิดข้อผิดพลาดและยังไม่มีการบันทึกข้อมูล โปรดลองใหม่ภายหลัง",
    },
  },
  ask: {
    heading: "สอบถามฝ่ายวิชาการเกี่ยวกับแผนนี้",
    body: "ปุ่มนี้จะพาไปยังแบบฟอร์มติดต่อพร้อมสรุปแผนของท่านที่เตรียมไว้ให้แนบ ท่านอ่าน แก้ไข หรือลบสรุปนั้นได้ก่อนส่ง และจะไม่มีการส่งข้อความใดจนกว่าท่านจะกดส่งในหน้าสุดท้าย",
    button: "เริ่มเขียนข้อความเกี่ยวกับแผนของฉัน",
    note: "สรุปประกอบด้วยรายวิชาแยกตามภาคการศึกษา สิ่งที่ระบบตรวจพบ หลักสูตร และวิชาโทของท่าน ไม่มีชื่อ รหัสนักศึกษา หรือรายวิชาที่ท่านผ่านแล้ว",
    subject: "คำถามเกี่ยวกับแผนการศึกษา",
  },
  attach: {
    label: "สรุปแผนการศึกษา",
    hint: "นี่คือสรุปแผนที่ท่านเปิดมา จะถูกส่งไปพร้อมข้อความของท่าน ท่านแก้ไขได้ หรือลบทั้งหมดเพื่อส่งข้อความโดยไม่แนบสรุปนี้",
  },
  calendar: {
    heading: "วันลงทะเบียนและวันเพิ่มถอนรายวิชา",
    intro:
      "นี่คือวันที่ BIRSA บันทึกไว้สำหรับภาคการศึกษาในแผนของท่าน ดาวน์โหลดเพื่อเพิ่มลงในปฏิทินของท่านเองได้",
    windows: { registration: "ลงทะเบียน", "add-drop": "เพิ่มถอนรายวิชา" },
    download: "ดาวน์โหลดวันที่เหล่านี้ (.ics)",
    emptyTitle: "ยังไม่มีการบันทึกวันลงทะเบียน",
    emptyBody:
      "BIRSA ยังไม่ได้บันทึกวันลงทะเบียนหรือวันเพิ่มถอนรายวิชาของภาคการศึกษาในแผนของท่าน หลักสูตร BIR เป็นหลักสูตรพิเศษ BIRSA จึงเป็นผู้ประกาศวันเหล่านี้ และไม่ตรงกับวันของสำนักทะเบียน โปรดใช้วันที่ BIRSA ประกาศ เมื่อบันทึกวันเหล่านี้แล้ว จะแสดงที่นี่ให้ดาวน์โหลดได้",
    announcementsLink: "ดูว่า BIRSA ประกาศวันสำคัญทางการศึกษาที่ใด",
  },
  published: {
    label: "ความสนใจของนักศึกษา",
    template: "มีนักศึกษาวางแผนเรียนวิชานี้ใน{term} ตั้งแต่ {n} คนขึ้นไป",
    note: "มาจากนักศึกษาที่เลือกแบ่งปันแผนโดยไม่ระบุตัวตน BIRSA แสดงข้อมูลนี้เมื่อมีนักศึกษาวางแผนเรียนวิชานี้ในภาคการศึกษาหนึ่งตั้งแต่ {n} คนขึ้นไปเท่านั้น และไม่แสดงจำนวนที่แน่นอน ทั้งนี้มิได้เป็นการรับรองว่าจะเปิดสอนวิชานี้",
  },
  summary: {
    heading: "สรุปแผนการศึกษา (จากบริการวางแผนการศึกษาของ BIRSA)",
    curriculum: "หลักสูตร",
    minor: "วิชาโท",
    coursesHeading: "รายวิชาที่วางแผนไว้",
    noCourses: "ยังไม่มีรายวิชาที่วางแผนไว้",
    creditsTemplate: "{n} หน่วยกิต",
    freeElectiveTemplate: "วิชาเลือกเสรี {n} หน่วยกิต",
    findingsHeading: "สิ่งที่ระบบตรวจพบ",
    noFindings: "ไม่พบข้อควรระวัง",
    severity: { problem: "ปัญหา", warning: "ข้อควรระวัง", note: "หมายเหตุ" },
    moreFindingsTemplate: "ยังมีข้อตรวจพบอีก {n} รายการในหน้าแผนการศึกษา",
    truncated: "(สรุปถูกตัดให้สั้นลง ส่วนที่เหลืออยู่ในหน้าแผนการศึกษา)",
  },
};
