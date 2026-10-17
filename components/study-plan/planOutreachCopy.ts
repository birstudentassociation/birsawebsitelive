/**
 * Copy for the places where a study plan leaves the student's device or asks
 * someone a question: sharing it with an advisor, sending the electives in it
 * to Academic Affairs, asking the BIR office about it, listing its
 * registration dates, and the line a course page shows once enough students
 * have planned the course.
 *
 * Kept in its own module, typed explicitly like `planLinkCopy.ts` so the Thai
 * must cover every English key, rather than added to the site dictionary,
 * which several other pieces of work are editing at once. Thai here is
 * written as Thai, not translated word for word.
 *
 * Everything here is optional for the student and says so. Nothing describes
 * a procedure BIRSA does not have: Academic Affairs reads the electives sent
 * to it, the BIR office answers questions about courses and registration and
 * announces BIR's registration dates, and the copy never promises an answer, a
 * decision or a course running.
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
    /** The subject of the email the button opens. */
    subject: string;
    /** The email body when the summary is too long for a link: a prompt to paste it. */
    pasteBody: string;
    summaryLabel: string;
    summaryHint: string;
    otherWaysHeading: string;
  };
  calendar: {
    heading: string;
    intro: string;
    windows: Record<"registration" | "add-drop", string>;
    download: string;
    emptyTitle: string;
    emptyBody: string;
    websiteLink: string;
    contactLink: string;
    calendarPostLink: string;
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
    heading: "Ask the BIR office about this plan",
    body: "The BIR office answers questions about courses and registration. This opens an email to the BIR office with a summary of your plan already in it. You can read and change the email before you send it. BIRSA does not receive it.",
    button: "Email the BIR office about my plan",
    note: "The summary lists your courses by term, what this service found, your curriculum and your minor. It does not include your name, your student ID or the courses you have passed.",
    subject: "Question about my study plan",
    pasteBody:
      "My question:\n\n\nMy study plan summary (pasted from the BIRSA study plan page):\n\n",
    summaryLabel: "Your plan summary",
    summaryHint:
      "If your email does not already contain this summary, select this text, copy it and paste it into your email.",
    otherWaysHeading: "Other ways to reach the BIR office",
  },
  calendar: {
    heading: "Registration and add-drop dates",
    intro:
      "These are the dates the BIR office has announced for the terms in your plan. Download them to add to your own calendar.",
    windows: { registration: "Registration", "add-drop": "Add and drop" },
    download: "Download the dates (.ics)",
    emptyTitle: "No registration dates recorded yet",
    emptyBody:
      "The BIR office announces registration and add-drop dates for BIR. BIR is a special programme, so its dates are not the same as the Registrar's. Find them on birpolsci.com or ask the BIR office. When they are recorded here, you will be able to download them.",
    websiteLink: "Registration dates on birpolsci.com",
    contactLink: "Contact the BIR office",
    calendarPostLink: "University-wide dates in the AY 2569 calendar",
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
  heading: "ส่งแผนให้ผู้อื่นหรือสอบถามเรื่องแผน",
  intro:
    "ทุกข้อด้านล่างเป็นทางเลือก แผนจะอยู่ในอุปกรณ์เครื่องนี้ต่อไปจนกว่าคุณจะเลือกทำข้อใดข้อหนึ่ง และไม่มีข้อใดแก้ไขแผน",
  share: {
    heading: "ส่งแผนให้อาจารย์ที่ปรึกษา",
    body: "ส่งลิงก์ให้อาจารย์ที่ปรึกษาเปิดดูแผนได้ แต่แก้ไขไม่ได้ ข้อมูลแผนอยู่ในลิงก์ส่วนที่ตามหลังเครื่องหมาย # ซึ่งเบราว์เซอร์ไม่ส่งไปยังเซิร์ฟเวอร์ BIRSA จึงไม่ได้รับแผนนี้ แต่ใครก็ตามที่มีลิงก์จะเปิดดูแผนได้ จึงควรส่งให้เฉพาะคนที่ตั้งใจจะให้ดู",
    linkLabel: "ลิงก์สำหรับส่ง",
    openLink: "เปิดหน้าดูแผน",
    copyButton: "คัดลอกลิงก์",
    copied: "คัดลอกลิงก์แล้ว",
    copyFailed: "คัดลอกไม่สำเร็จ เลือกลิงก์ด้านบนแล้วคัดลอกเอง",
    datedNote: "ลิงก์นี้แสดงแผนตามที่เป็นอยู่ในวันนี้ หากแก้ไขแผนภายหลัง ต้องส่งลิงก์ใหม่",
    noScriptNote:
      "ผู้รับต้องเปิดใช้ JavaScript จึงจะเปิดลิงก์นี้ได้ หากผู้รับปิดไว้ ให้ส่งแผนฉบับพิมพ์แทน",
  },
  view: {
    title: "แผนการศึกษาที่นักศึกษาส่งมา",
    lede: "สำเนาแผนการศึกษาของนักศึกษา เปิดดูได้อย่างเดียว แก้ไขไม่ได้",
    readOnlyTitle: "ดูได้อย่างเดียว",
    readOnlyDated:
      "สำเนานี้จัดทำเมื่อ {date} แก้ไขในหน้านี้ไม่ได้ และจะไม่เปลี่ยนตามเมื่อนักศึกษาแก้แผนภายหลัง เบราว์เซอร์นี้อ่านแผนจากลิงก์โดยตรง ไม่ได้ส่งแผนไปยัง BIRSA",
    readOnlyUndated:
      "ลิงก์นี้ไม่ได้ระบุวันที่จัดทำ ควรถามนักศึกษาว่าเป็นแผนฉบับล่าสุดหรือไม่ แก้ไขในหน้านี้ไม่ได้ และจะไม่เปลี่ยนตามเมื่อนักศึกษาแก้แผนภายหลัง เบราว์เซอร์นี้อ่านแผนจากลิงก์โดยตรง ไม่ได้ส่งแผนไปยัง BIRSA",
    openedOn: "เปิดดูเมื่อ {date}",
    emptyTitle: "ลิงก์นี้ไม่มีแผน",
    emptyBody:
      "ข้อมูลแผนต้องอยู่ในลิงก์ส่วนที่ตามหลังเครื่องหมาย # แต่ลิงก์นี้ไม่มีส่วนนั้น ขอให้นักศึกษาส่งลิงก์มาใหม่",
    invalidTitle: "เปิดแผนนี้ไม่ได้",
    invalidBody:
      "ลิงก์อาจขาดหายบางส่วนหรือถูกแก้ระหว่างส่ง ขอให้นักศึกษาส่งลิงก์มาใหม่ หรือส่งแผนฉบับพิมพ์มาแทน",
    noScriptTitle: "หน้านี้ต้องใช้ JavaScript",
    noScriptBody:
      "ข้อมูลแผนอยู่ในตัวลิงก์ และต้องใช้ JavaScript จึงจะเปิดได้ หากไม่ใช้ JavaScript ขอให้นักศึกษาเปิดแผนของตนในหน้าพิมพ์ของบริการวางแผนการศึกษา แล้วส่งฉบับพิมพ์หรือไฟล์ PDF มาให้",
    noScriptLink: "เกี่ยวกับบริการวางแผนการศึกษา",
    startLink: "ทำแผนการศึกษาของคุณเอง",
    sharedOnLabel: "ส่งแผนนี้เมื่อ",
  },
  demand: {
    heading: "ช่วยฝ่ายวิชาการวางแผนวิชาเลือก",
    intro:
      "แจ้งฝ่ายวิชาการได้ว่าคุณวางแผนจะเรียนวิชาเลือกใดบ้าง จะแจ้งหรือไม่ก็ได้ แผนยังใช้งานได้ตามปกติทั้งสองกรณี",
    sentHeading: "ข้อมูลทั้งหมดที่จะส่ง",
    versionTemplate: "หลักสูตร: {version}",
    entryTemplate: "{code} ใน{term}",
    notSent:
      "ระบบไม่ส่งข้อมูลอื่น เช่น รุ่น วิชาโท รายวิชาที่ผ่านแล้ว ชื่อ หรือรหัสนักศึกษา และ BIRSA ไม่เก็บหมายเลขไอพีของอุปกรณ์ที่ใช้ส่ง",
    usedFor:
      "ฝ่ายวิชาการจะเห็นว่าแต่ละวิชามีนักศึกษาวางแผนเรียนกี่คนในแต่ละภาค และนำไปแจ้งสำนักงานหลักสูตรได้ หน้ารายวิชาจะแสดงตัวเลขนี้เป็นช่วงเท่านั้น และแสดงเมื่อมีผู้วางแผนเรียนวิชานั้นในภาคเดียวกันตั้งแต่ {n} คนขึ้นไป",
    limitNote:
      "แต่ละเบราว์เซอร์ส่งได้ภาคละ 1 ครั้ง แต่ BIRSA ไม่รู้ว่าผู้ส่งเป็นใคร จึงกันการส่งซ้ำได้ไม่หมด ตัวเลขที่ได้จึงใช้ดูแนวโน้ม ไม่ใช่จำนวนที่แน่นอน",
    checkboxLabel: "ส่งรายชื่อวิชาเลือกที่ฉันวางแผนไว้ให้ฝ่ายวิชาการ โดยไม่ระบุตัวตน",
    submit: "ส่งวิชาเลือกของฉัน",
    submitting: "กำลังส่ง",
    none: "แผนยังไม่มีวิชาเลือก เพิ่มวิชาเลือกในภาคการศึกษาด้านบนก่อน แล้วกลับมาที่นี่",
    shared: "ส่งวิชาเลือกที่วางแผนไว้เรียบร้อยแล้ว ขอบคุณ",
    alreadyShared: "เบราว์เซอร์นี้ส่งวิชาเลือกของ{term}ไปแล้ว ส่งใหม่ได้ในภาคการศึกษาถัดไป",
    errorSummaryTitle: "ยังไม่ได้ส่งวิชาเลือก",
    errors: {
      "not-agreed": "ทำเครื่องหมายในช่องนี้หากต้องการส่งวิชาเลือกที่วางแผนไว้",
      invalid:
        "ระบบใช้ข้อมูลที่ส่งมาไม่ได้ โหลดหน้าแผนการศึกษาใหม่แล้วลองอีกครั้ง ยังไม่มีการบันทึกข้อมูล",
      "rate-limited": "เครือข่ายนี้ส่งข้อมูลหลายครั้งในไม่กี่นาทีที่ผ่านมา ลองใหม่ภายหลัง",
      "not-configured": "ระบบนี้ยังไม่เปิดใช้งาน จึงยังไม่มีการส่งข้อมูล",
      error: "เกิดข้อผิดพลาด ยังไม่มีการบันทึกข้อมูล ลองใหม่ภายหลัง",
    },
  },
  ask: {
    heading: "สอบถามสำนักงานโครงการ BIR เรื่องแผนนี้",
    body: "สำนักงานโครงการ BIR ตอบคำถามเรื่องรายวิชาและการลงทะเบียน ปุ่มนี้จะเปิดร่างอีเมลถึงสำนักงานพร้อมสรุปแผนไว้ให้ ตรวจและแก้ไขได้ก่อนส่ง BIRSA ไม่ได้รับอีเมลนี้",
    button: "ส่งอีเมลถามสำนักงานโครงการ BIR เรื่องแผนของฉัน",
    note: "สรุปแผนมีรายวิชาแยกตามภาคการศึกษา ผลที่ระบบตรวจพบ หลักสูตร และวิชาโท โดยไม่มีชื่อ รหัสนักศึกษา หรือรายวิชาที่ผ่านแล้ว",
    subject: "สอบถามเรื่องแผนการศึกษา",
    pasteBody: "คำถาม\n\n\nสรุปแผนการศึกษา (คัดลอกจากหน้าแผนการศึกษาบนเว็บไซต์ BIRSA)\n\n",
    summaryLabel: "สรุปแผนของคุณ",
    summaryHint: "หากในอีเมลยังไม่มีสรุปนี้ ให้คัดลอกข้อความนี้ไปวางในอีเมล",
    otherWaysHeading: "ช่องทางอื่นในการติดต่อสำนักงานโครงการ BIR",
  },
  calendar: {
    heading: "วันลงทะเบียนและวันเพิ่ม-ถอนรายวิชา",
    intro:
      "วันที่สำนักงานโครงการ BIR ประกาศสำหรับภาคการศึกษาในแผนนี้ ดาวน์โหลดไปเพิ่มในปฏิทินของตัวเองได้",
    windows: { registration: "ลงทะเบียน", "add-drop": "เพิ่ม-ถอนรายวิชา" },
    download: "ดาวน์โหลดวันที่เหล่านี้ (.ics)",
    emptyTitle: "ยังไม่มีวันลงทะเบียนในระบบ",
    emptyBody:
      "BIR เป็นหลักสูตรพิเศษ สำนักงานโครงการ BIR จึงประกาศวันลงทะเบียนและวันเพิ่ม-ถอนรายวิชาเอง ซึ่งไม่ตรงกับวันของสำนักงานทะเบียนนักศึกษา ดูวันเหล่านี้ได้ที่ birpolsci.com หรือสอบถามสำนักงานโครงการ BIR เมื่อมีวันในระบบแล้วจะดาวน์โหลดได้ที่นี่",
    websiteLink: "วันลงทะเบียนที่ birpolsci.com",
    contactLink: "ติดต่อสำนักงานโครงการ BIR",
    calendarPostLink: "วันของมหาวิทยาลัยในปฏิทินการศึกษา 2569",
  },
  published: {
    label: "ความสนใจของนักศึกษา",
    template: "มีนักศึกษาวางแผนเรียนวิชานี้ใน{term} ตั้งแต่ {n} คนขึ้นไป",
    note: "ตัวเลขนี้มาจากนักศึกษาที่เลือกส่งแผนโดยไม่ระบุตัวตน BIRSA แสดงเฉพาะเมื่อมีผู้วางแผนเรียนวิชานี้ในภาคเดียวกันตั้งแต่ {n} คนขึ้นไป และไม่แสดงจำนวนที่แน่นอน ตัวเลขนี้ไม่ได้รับรองว่าวิชาจะเปิดสอน",
  },
  summary: {
    heading: "สรุปแผนการศึกษา (จากบริการวางแผนการศึกษาของ BIRSA)",
    curriculum: "หลักสูตร",
    minor: "วิชาโท",
    coursesHeading: "รายวิชาที่วางแผนไว้",
    noCourses: "ยังไม่มีรายวิชาที่วางแผนไว้",
    creditsTemplate: "{n} หน่วยกิต",
    freeElectiveTemplate: "วิชาเลือกเสรี {n} หน่วยกิต",
    findingsHeading: "ผลการตรวจแผน",
    noFindings: "ไม่พบสิ่งที่ต้องระวัง",
    severity: { problem: "ปัญหา", warning: "ข้อควรระวัง", note: "หมายเหตุ" },
    moreFindingsTemplate: "ดูผลการตรวจอีก {n} รายการได้ในหน้าแผนการศึกษา",
    truncated: "(สรุปนี้ตัดให้สั้นลง ดูส่วนที่เหลือได้ในหน้าแผนการศึกษา)",
  },
};
