/**
 * Bilingual (Thai + English) email renderers for every transactional email
 * BIRSA sends: student-facing loan lifecycle emails, and officer/inbox-facing
 * notifications (delivered to `BIRSA_INBOX`). Each renderer is a pure
 * function returning `{ subject, html, text }`; no env/DB access here, that
 * lives in the callers (e.g. lib/inventory/notifications.ts, API routes).
 *
 * Every interpolated dynamic value is escaped via `escapeHtml` /
 * `escapeHtmlMultiline` before being placed into `html`, since names, item
 * names, references, and free-text messages all originate from user input.
 * User-submitted free text (contact message, start-a-club description) is
 * never translated or altered, only escaped.
 */
import {
  badge,
  bilingualBlock,
  escapeHtml,
  escapeHtmlMultiline,
  heading,
  infoTable,
  mutedParagraph,
  paragraph,
  renderLayout,
  type InfoRow,
} from "@/lib/email/layout";
import { pluralize } from "@/lib/i18n";

export type RenderedEmail = { subject: string; html: string; text: string };

/** Falls back to the English name when the Thai name is empty/whitespace. */
function thName(nameTh: string, nameEn: string): string {
  return nameTh.trim().length > 0 ? nameTh : nameEn;
}

// ---------------------------------------------------------------------------
// Student-facing: loan lifecycle
// ---------------------------------------------------------------------------

export function renderLoanApproved(i: {
  borrowerName: string;
  itemNameEn: string;
  itemNameTh: string;
  reference: string;
  startDate: string;
  endDate: string;
}): RenderedEmail {
  const name = escapeHtml(i.borrowerName);
  const itemEn = escapeHtml(i.itemNameEn);
  const itemTh = escapeHtml(thName(i.itemNameTh, i.itemNameEn));
  const ref = escapeHtml(i.reference);
  const start = escapeHtml(i.startDate);
  const end = escapeHtml(i.endDate);

  const rowsTh: InfoRow[] = [
    { label: "หมายเลขอ้างอิง", value: ref },
    { label: "รายการ", value: itemTh },
    { label: "วันที่ยืม", value: start },
    { label: "วันที่คืน", value: end },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Reference", value: ref },
    { label: "Item", value: itemEn },
    { label: "Start date", value: start },
    { label: "End date", value: end },
  ];

  const bodyHtml =
    heading("คำขอยืมของคุณได้รับการอนุมัติ &middot; Your loan request is approved") +
    badge("อนุมัติแล้ว &middot; Approved", "success") +
    bilingualBlock({
      th:
        paragraph(`สวัสดีคุณ${name},`) +
        paragraph(`คำขอยืมของคุณได้รับการอนุมัติแล้ว กรุณานำบัตรนักศึกษามาแสดงเมื่อมารับอุปกรณ์`) +
        infoTable(rowsTh),
      en:
        paragraph(`Hi ${name},`) +
        paragraph(
          `Your loan request has been approved. Bring your student ID when you come to collect the item.`
        ) +
        infoTable(rowsEn),
    });

  return {
    subject: `[BIRSA] คำขอยืม ${ref} ได้รับอนุมัติ · Loan ${ref} approved`,
    html: renderLayout({ previewText: `Your loan ${ref} has been approved.`, bodyHtml }),
    text: [
      `Hi ${i.borrowerName},`,
      "",
      `Your loan request has been approved.`,
      `Reference: ${i.reference}`,
      `Item: ${i.itemNameEn}`,
      `Start date: ${i.startDate}`,
      `End date: ${i.endDate}`,
      "",
      "Bring your student ID when you come to collect the item.",
    ].join("\n"),
  };
}

export function renderLoanRejected(i: {
  borrowerName: string;
  itemNameEn: string;
  itemNameTh: string;
  reference: string;
}): RenderedEmail {
  const name = escapeHtml(i.borrowerName);
  const itemEn = escapeHtml(i.itemNameEn);
  const itemTh = escapeHtml(thName(i.itemNameTh, i.itemNameEn));
  const ref = escapeHtml(i.reference);

  const rowsTh: InfoRow[] = [
    { label: "หมายเลขอ้างอิง", value: ref },
    { label: "รายการ", value: itemTh },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Reference", value: ref },
    { label: "Item", value: itemEn },
  ];

  const bodyHtml =
    heading("คำขอยืมของคุณไม่ได้รับการอนุมัติ &middot; Your loan request was not approved") +
    bilingualBlock({
      th:
        paragraph(`สวัสดีคุณ${name},`) +
        paragraph(
          `ขอบคุณที่สนใจใช้บริการยืมอุปกรณ์ของ BIRSA คำขอยืมของคุณไม่ได้รับการอนุมัติในครั้งนี้ หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม สามารถติดต่อ BIRSA ได้โดยตรง`
        ) +
        infoTable(rowsTh),
      en:
        paragraph(`Hi ${name},`) +
        paragraph(
          `Thank you for your interest in borrowing from BIRSA. Unfortunately, your loan request was not approved this time. Contact BIRSA directly if you have questions.`
        ) +
        infoTable(rowsEn),
    });

  return {
    subject: `[BIRSA] คำขอยืม ${ref} ไม่ได้รับอนุมัติ · Loan ${ref} was not approved`,
    html: renderLayout({ previewText: `Your loan ${ref} was not approved.`, bodyHtml }),
    text: [
      `Hi ${i.borrowerName},`,
      "",
      `Thank you for your interest in borrowing from BIRSA. Unfortunately, your loan request was not approved this time.`,
      `Reference: ${i.reference}`,
      `Item: ${i.itemNameEn}`,
      "",
      "Contact BIRSA directly if you have questions.",
    ].join("\n"),
  };
}

export function renderOverdue(i: {
  borrowerName: string;
  itemNameEn: string;
  itemNameTh: string;
  reference: string;
  endDate: string;
}): RenderedEmail {
  const name = escapeHtml(i.borrowerName);
  const itemEn = escapeHtml(i.itemNameEn);
  const itemTh = escapeHtml(thName(i.itemNameTh, i.itemNameEn));
  const ref = escapeHtml(i.reference);
  const end = escapeHtml(i.endDate);

  const rowsTh: InfoRow[] = [
    { label: "หมายเลขอ้างอิง", value: ref },
    { label: "รายการ", value: itemTh },
    { label: "ครบกำหนดคืน", value: end },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Reference", value: ref },
    { label: "Item", value: itemEn },
    { label: "Was due", value: end },
  ];

  const bodyHtml =
    heading("อุปกรณ์ของคุณเลยกำหนดคืนแล้ว &middot; Your item is overdue") +
    badge("เลยกำหนดคืน &middot; Overdue", "warning") +
    bilingualBlock({
      th:
        paragraph(`สวัสดีคุณ${name},`) +
        paragraph(
          `อุปกรณ์ที่คุณยืมครบกำหนดคืนเมื่อวันที่ ${end} และขณะนี้เลยกำหนดคืนแล้ว กรุณานำมาคืนที่ห้อง BIRSA โดยเร็วที่สุด`
        ) +
        infoTable(rowsTh),
      en:
        paragraph(`Hi ${name},`) +
        paragraph(
          `Your item was due back on ${end} and is now overdue. Return it to the BIRSA office as soon as possible.`
        ) +
        infoTable(rowsEn),
    });

  return {
    subject: `[BIRSA] อุปกรณ์ ${ref} เลยกำหนดคืน · Loan ${ref} is overdue`,
    html: renderLayout({
      previewText: `Your loan ${ref} was due on ${i.endDate} and is now overdue.`,
      bodyHtml,
    }),
    text: [
      `Hi ${i.borrowerName},`,
      "",
      `Your loan of "${i.itemNameEn}" (reference ${i.reference}) was due back on ${i.endDate} and is now overdue.`,
      "Return it to the BIRSA office as soon as possible.",
    ].join("\n"),
  };
}

export function renderDueSoon(i: {
  borrowerName: string;
  itemNameEn: string;
  itemNameTh: string;
  reference: string;
  endDate: string;
}): RenderedEmail {
  const name = escapeHtml(i.borrowerName);
  const itemEn = escapeHtml(i.itemNameEn);
  const itemTh = escapeHtml(thName(i.itemNameTh, i.itemNameEn));
  const ref = escapeHtml(i.reference);
  const end = escapeHtml(i.endDate);

  const rowsTh: InfoRow[] = [
    { label: "หมายเลขอ้างอิง", value: ref },
    { label: "รายการ", value: itemTh },
    { label: "ครบกำหนดคืน", value: end },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Reference", value: ref },
    { label: "Item", value: itemEn },
    { label: "Due date", value: end },
  ];

  const bodyHtml =
    heading("แจ้งเตือนกำหนดคืนอุปกรณ์ &middot; Reminder: your item is due soon") +
    bilingualBlock({
      th:
        paragraph(`สวัสดีคุณ${name},`) +
        paragraph(
          `อุปกรณ์ที่คุณยืมจะครบกำหนดคืนในวันที่ ${end} กรุณานำมาคืนที่ห้อง BIRSA ภายในหรือก่อนวันดังกล่าว`
        ) +
        infoTable(rowsTh),
      en:
        paragraph(`Hi ${name},`) +
        paragraph(
          `Your item is due back on ${end}. Return it to the BIRSA office on or before that date.`
        ) +
        infoTable(rowsEn),
    });

  return {
    subject: `[BIRSA] แจ้งเตือน: อุปกรณ์ ${ref} ใกล้ครบกำหนดคืน · Reminder: loan ${ref} is due soon`,
    html: renderLayout({ previewText: `Your loan ${ref} is due back on ${i.endDate}.`, bodyHtml }),
    text: [
      `Hi ${i.borrowerName},`,
      "",
      `Your loan of "${i.itemNameEn}" (reference ${i.reference}) is due back on ${i.endDate}.`,
      "Return it to the BIRSA office on or before that date.",
    ].join("\n"),
  };
}

export function renderPickupReady(i: {
  borrowerName: string;
  itemNameEn: string;
  itemNameTh: string;
  reference: string;
  startDate: string;
}): RenderedEmail {
  const name = escapeHtml(i.borrowerName);
  const itemEn = escapeHtml(i.itemNameEn);
  const itemTh = escapeHtml(thName(i.itemNameTh, i.itemNameEn));
  const ref = escapeHtml(i.reference);
  const start = escapeHtml(i.startDate);

  const rowsTh: InfoRow[] = [
    { label: "หมายเลขอ้างอิง", value: ref },
    { label: "รายการ", value: itemTh },
    { label: "พร้อมรับตั้งแต่", value: start },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Reference", value: ref },
    { label: "Item", value: itemEn },
    { label: "Ready from", value: start },
  ];

  const bodyHtml =
    heading("อุปกรณ์ของคุณพร้อมให้รับแล้ว &middot; Your item is ready for pickup") +
    badge("พร้อมรับ &middot; Ready for pickup", "info") +
    bilingualBlock({
      th:
        paragraph(`สวัสดีคุณ${name},`) +
        paragraph(
          `คำขอยืมของคุณได้รับการอนุมัติแล้ว และอุปกรณ์พร้อมให้มารับได้ตั้งแต่วันที่ ${start} กรุณามารับที่ห้อง BIRSA พร้อมนำบัตรนักศึกษามาแสดง`
        ) +
        infoTable(rowsTh),
      en:
        paragraph(`Hi ${name},`) +
        paragraph(
          `Your approved loan is ready for pickup starting ${start}. Collect it from the BIRSA office and bring your student ID.`
        ) +
        infoTable(rowsEn),
    });

  return {
    subject: `[BIRSA] อุปกรณ์ ${ref} พร้อมให้รับ · Loan ${ref} is ready for pickup`,
    html: renderLayout({
      previewText: `Your loan ${ref} is ready for pickup from ${i.startDate}.`,
      bodyHtml,
    }),
    text: [
      `Hi ${i.borrowerName},`,
      "",
      `Your approved loan of "${i.itemNameEn}" (reference ${i.reference}) is ready for pickup starting ${i.startDate}.`,
      "Collect it from the BIRSA office and bring your student ID.",
    ].join("\n"),
  };
}

// ---------------------------------------------------------------------------
// Officer/inbox-facing
// ---------------------------------------------------------------------------

export function renderOfficerDigest(i: {
  date: string;
  pending: number;
  overdue: number;
  dueSoon: number;
  dueSoonDays: number;
  lowStock: { nameEn: string; nameTh: string; qty: number }[];
}): RenderedEmail {
  const date = escapeHtml(i.date);

  const rowsTh: InfoRow[] = [
    { label: "คำขอรออนุมัติ", value: String(i.pending) },
    { label: "เลยกำหนดคืน", value: String(i.overdue) },
    { label: `ครบกำหนดใน ${i.dueSoonDays} วัน`, value: String(i.dueSoon) },
    { label: "สินค้าใกล้หมด", value: String(i.lowStock.length) },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Pending requests", value: String(i.pending) },
    { label: "Overdue loans", value: String(i.overdue) },
    {
      label: `Due within ${pluralize(i.dueSoonDays, { one: "1 day", other: `${i.dueSoonDays} days` })}`,
      value: String(i.dueSoon),
    },
    { label: "Low-stock items", value: String(i.lowStock.length) },
  ];

  const lowStockListTh =
    i.lowStock.length > 0
      ? `<ul style="margin:0 0 16px;padding-left:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Sarabun','Noto Sans Thai',Tahoma,Arial,sans-serif;font-size:14px;line-height:1.7;color:#211c19;">${i.lowStock
          .map(
            (item) =>
              `<li>${escapeHtml(thName(item.nameTh, item.nameEn))} (คงเหลือ ${item.qty})</li>`
          )
          .join("")}</ul>`
      : "";
  const lowStockListEn =
    i.lowStock.length > 0
      ? `<ul style="margin:0 0 16px;padding-left:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Sarabun','Noto Sans Thai',Tahoma,Arial,sans-serif;font-size:14px;line-height:1.7;color:#211c19;">${i.lowStock
          .map((item) => `<li>${escapeHtml(item.nameEn)} (qty ${item.qty})</li>`)
          .join("")}</ul>`
      : "";

  const bodyHtml =
    heading(`สรุปประจำวัน ${date} &middot; Daily digest for ${date}`) +
    bilingualBlock({
      th: paragraph(`สรุปคลังอุปกรณ์ประจำวันของ BIRSA:`) + infoTable(rowsTh) + lowStockListTh,
      en:
        paragraph(`Here is today's inventory summary for BIRSA:`) +
        infoTable(rowsEn) +
        lowStockListEn,
    });

  const textLowStock =
    i.lowStock.length > 0
      ? ["", "Low-stock items:", ...i.lowStock.map((item) => `- ${item.nameEn} (qty ${item.qty})`)]
      : [];

  return {
    subject: `[BIRSA] สรุปคลังอุปกรณ์ประจำวัน (${i.date}) · Daily inventory digest (${i.date})`,
    html: renderLayout({
      previewText: `Pending ${i.pending} · Overdue ${i.overdue} · Due soon ${i.dueSoon} · Low stock ${i.lowStock.length}`,
      bodyHtml,
    }),
    text: [
      `Daily inventory summary for ${i.date}:`,
      "",
      `Pending loan requests: ${i.pending}`,
      `Overdue loans: ${i.overdue}`,
      `Due within ${pluralize(i.dueSoonDays, { one: "1 day", other: `${i.dueSoonDays} days` })}: ${i.dueSoon}`,
      `Low-stock consumables: ${i.lowStock.length}`,
      ...textLowStock,
    ].join("\n"),
  };
}

export function renderOfficerNewRequest(i: {
  itemNameEn: string;
  itemNameTh: string;
  reference: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}): RenderedEmail {
  const itemEn = escapeHtml(i.itemNameEn);
  const itemTh = escapeHtml(thName(i.itemNameTh, i.itemNameEn));
  const ref = escapeHtml(i.reference);
  const studentName = escapeHtml(i.studentName);
  const studentId = escapeHtml(i.studentId);
  const studentEmail = escapeHtml(i.studentEmail);
  const start = escapeHtml(i.startDate);
  const end = escapeHtml(i.endDate);
  const reason = i.reason && i.reason.trim().length > 0 ? escapeHtmlMultiline(i.reason) : null;

  const rowsTh: InfoRow[] = [
    { label: "หมายเลขอ้างอิง", value: ref },
    { label: "รายการ", value: itemTh },
    { label: "ผู้ยืม", value: studentName },
    { label: "รหัสนักศึกษา", value: studentId },
    { label: "อีเมล", value: studentEmail },
    { label: "วันที่ยืม", value: start },
    { label: "วันที่คืน", value: end },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Reference", value: ref },
    { label: "Item", value: itemEn },
    { label: "Student", value: studentName },
    { label: "Student ID", value: studentId },
    { label: "Email", value: studentEmail },
    { label: "Start date", value: start },
    { label: "End date", value: end },
  ];

  const bodyHtml =
    heading("มีคำขอยืมใหม่ &middot; New loan request") +
    bilingualBlock({
      th:
        paragraph(`มีคำขอยืมอุปกรณ์ใหม่รอการพิจารณา:`) +
        infoTable(rowsTh) +
        (reason ? mutedParagraph(`เหตุผลการยืม: ${reason}`) : ""),
      en:
        paragraph(`A new loan request is awaiting review:`) +
        infoTable(rowsEn) +
        (reason ? mutedParagraph(`Reason: ${reason}`) : ""),
    });

  return {
    subject: `[BIRSA] คำขอยืมใหม่ ${ref} · New loan request ${ref}`,
    html: renderLayout({
      previewText: `New loan request ${i.reference} from ${i.studentName}.`,
      bodyHtml,
    }),
    text: [
      `A new loan request is awaiting review.`,
      `Reference: ${i.reference}`,
      `Item: ${i.itemNameEn}`,
      `Student: ${i.studentName} (${i.studentId})`,
      `Email: ${i.studentEmail}`,
      `Start date: ${i.startDate}`,
      `End date: ${i.endDate}`,
      ...(reason ? ["", `Reason: ${i.reason}`] : []),
    ].join("\n"),
  };
}

export function renderContact(i: {
  name: string;
  email: string;
  categoryLabel: string;
  subject: string;
  message: string;
}): RenderedEmail {
  const name = escapeHtml(i.name);
  const email = escapeHtml(i.email);
  const category = escapeHtml(i.categoryLabel);
  const subjectLine = escapeHtml(i.subject);
  const message = escapeHtmlMultiline(i.message);

  const rowsTh: InfoRow[] = [
    { label: "หมวดหมู่", value: category },
    { label: "จาก", value: `${name} (${email})` },
    { label: "หัวข้อ", value: subjectLine },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Category", value: category },
    { label: "From", value: `${name} (${email})` },
    { label: "Subject", value: subjectLine },
  ];

  const bodyHtml =
    heading("ข้อความติดต่อใหม่ &middot; New contact message") +
    bilingualBlock({
      th:
        paragraph(`มีข้อความติดต่อใหม่ผ่านแบบฟอร์มบนเว็บไซต์:`) +
        infoTable(rowsTh) +
        paragraph(message),
      en:
        paragraph(`A new message was submitted through the website contact form:`) +
        infoTable(rowsEn) +
        paragraph(message),
    });

  return {
    subject: `[BIRSA] ข้อความติดต่อใหม่: ${subjectLine} · New contact message: ${subjectLine}`,
    html: renderLayout({
      previewText: `New contact message from ${i.name}: ${i.subject}`,
      bodyHtml,
    }),
    text: [
      `A new message was submitted through the website contact form.`,
      `Category: ${i.categoryLabel}`,
      `From: ${i.name} (${i.email})`,
      `Subject: ${i.subject}`,
      "",
      i.message,
    ].join("\n"),
  };
}

/**
 * `/privacy/your-data`: a reader exercising a PDPA right (sections 30 to 36,
 * 19 or 73). The subject and opening line always name the section and the
 * date section 30 requires an answer by, so this can never be mistaken for
 * an ordinary contact message that happens to sit in the same inbox.
 */
export function renderRightsRequest(i: {
  name: string;
  email: string;
  rightNameEn: string;
  rightNameTh: string;
  section: string;
  details?: string | null;
  deadlineEn: string;
  deadlineTh: string;
}): RenderedEmail {
  const name = escapeHtml(i.name);
  const email = escapeHtml(i.email);
  const rightEn = escapeHtml(i.rightNameEn);
  const rightTh = escapeHtml(thName(i.rightNameTh, i.rightNameEn));
  const section = escapeHtml(i.section);
  const deadlineEn = escapeHtml(i.deadlineEn);
  const deadlineTh = escapeHtml(i.deadlineTh);
  const details = i.details && i.details.trim().length > 0 ? escapeHtmlMultiline(i.details) : null;

  const rowsTh: InfoRow[] = [
    { label: "สิทธิที่ขอใช้", value: `${rightTh} (มาตรา ${section})` },
    { label: "จาก", value: `${name} (${email})` },
    { label: "ต้องตอบภายในวันที่", value: deadlineTh },
  ];
  const rowsEn: InfoRow[] = [
    { label: "Right requested", value: `${rightEn} (section ${section})` },
    { label: "From", value: `${name} (${email})` },
    { label: "Respond by", value: deadlineEn },
  ];

  const bodyHtml =
    heading("คำร้องตามสิทธิ PDPA ของคุณ &middot; A PDPA data rights request") +
    badge(`มาตรา ${section} &middot; Section ${section}`, "warning") +
    bilingualBlock({
      th:
        paragraph(
          `มีคำร้องเกี่ยวกับข้อมูลส่วนบุคคลใหม่ผ่านเว็บไซต์ ยื่นภายใต้มาตรา ${section} แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ต้องตอบกลับภายในวันที่ ${deadlineTh}:`
        ) +
        infoTable(rowsTh) +
        (details ? paragraph(details) : ""),
      en:
        paragraph(
          `A new data rights request was submitted through the website, made under section ${section} of the Personal Data Protection Act B.E. 2562. It must be answered by ${deadlineEn}:`
        ) +
        infoTable(rowsEn) +
        (details ? paragraph(details) : ""),
    });

  return {
    subject: `[BIRSA][PDPA มาตรา ${section}] คำร้องสิทธิข้อมูลส่วนบุคคล ตอบภายใน ${deadlineTh} · Data rights request, section ${section}, respond by ${deadlineEn}`,
    html: renderLayout({
      previewText: `PDPA section ${i.section} request from ${i.name}. Respond by ${i.deadlineEn}.`,
      bodyHtml,
    }),
    text: [
      `A new data rights request was submitted through the website.`,
      `Made under section ${i.section} of the Personal Data Protection Act B.E. 2562.`,
      `Must be answered by ${i.deadlineEn}.`,
      `Right requested: ${i.rightNameEn}`,
      `From: ${i.name} (${i.email})`,
      ...(details ? ["", `Details: ${i.details}`] : []),
    ].join("\n"),
  };
}

export function renderStartClub(i: {
  name: string;
  email: string;
  clubName: string;
  description: string;
  members?: string | null;
}): RenderedEmail {
  const name = escapeHtml(i.name);
  const email = escapeHtml(i.email);
  const clubName = escapeHtml(i.clubName);
  const description = escapeHtmlMultiline(i.description);
  const members = i.members && i.members.trim().length > 0 ? escapeHtml(i.members) : null;

  const rowsTh: InfoRow[] = [
    { label: "ชื่อชมรมที่เสนอ", value: clubName },
    { label: "จาก", value: `${name} (${email})` },
    ...(members ? [{ label: "สมาชิกที่สนใจ", value: members }] : []),
  ];
  const rowsEn: InfoRow[] = [
    { label: "Proposed club", value: clubName },
    { label: "From", value: `${name} (${email})` },
    ...(members ? [{ label: "Interested members", value: members }] : []),
  ];

  const bodyHtml =
    heading("ข้อเสนอจัดตั้งชมรมใหม่ &middot; New start-a-club proposal") +
    bilingualBlock({
      th:
        paragraph(`มีข้อเสนอจัดตั้งชมรมใหม่ผ่านเว็บไซต์:`) +
        infoTable(rowsTh) +
        paragraph(description),
      en:
        paragraph(`A new club proposal was submitted through the website:`) +
        infoTable(rowsEn) +
        paragraph(description),
    });

  return {
    subject: `[BIRSA] ข้อเสนอจัดตั้งชมรม: ${clubName} · New start-a-club proposal: ${clubName}`,
    html: renderLayout({
      previewText: `New club proposal "${i.clubName}" from ${i.name}.`,
      bodyHtml,
    }),
    text: [
      `A new club proposal was submitted through the website.`,
      `Proposed club: ${i.clubName}`,
      `From: ${i.name} (${i.email})`,
      ...(members ? [`Interested members: ${i.members}`] : []),
      "",
      i.description,
    ].join("\n"),
  };
}
