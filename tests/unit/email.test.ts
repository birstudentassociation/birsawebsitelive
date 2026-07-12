import { describe, expect, it } from "vitest";
import { escapeHtml, escapeHtmlMultiline } from "@/lib/email/layout";
import {
  renderContact,
  renderDueSoon,
  renderLoanApproved,
  renderLoanRejected,
  renderOfficerDigest,
  renderOfficerNewRequest,
  renderOverdue,
  renderPickupReady,
  renderStartClub,
} from "@/lib/email/templates";

describe("escapeHtml", () => {
  it("neutralizes a script tag", () => {
    const escaped = escapeHtml("<script>alert('xss')</script>");
    expect(escaped).not.toContain("<script>");
    expect(escaped).toBe("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
  });

  it("escapes ampersands and quotes", () => {
    expect(escapeHtml(`Tom & Jerry "fun" <ok>`)).toBe("Tom &amp; Jerry &quot;fun&quot; &lt;ok&gt;");
  });
});

describe("escapeHtmlMultiline", () => {
  it("escapes markup and converts newlines to <br>", () => {
    const result = escapeHtmlMultiline("<script>evil()</script>\nline two");
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;evil()&lt;/script&gt;<br>line two");
  });
});

function assertWellFormedEmail(email: { subject: string; html: string; text: string }) {
  expect(email.html.trim().toLowerCase().startsWith("<!doctype html>")).toBe(true);
  expect(email.html).toContain("<table");
  expect(email.text.length).toBeGreaterThan(0);
  expect(email.subject.length).toBeGreaterThan(0);
}

describe("renderLoanApproved", () => {
  it("includes reference, item, and both languages", () => {
    const email = renderLoanApproved({
      borrowerName: "Somchai Jaidee",
      itemNameEn: "DSLR Camera",
      itemNameTh: "กล้อง DSLR",
      reference: "R-1023",
      startDate: "2026-07-15",
      endDate: "2026-07-20",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("R-1023");
    expect(email.html).toContain("DSLR Camera");
    expect(email.html).toContain("กล้อง DSLR");
    expect(email.html).toContain("อนุมัติ");
    expect(email.html).toContain("approved");
    expect(email.text).toContain("R-1023");
  });

  it("escapes malicious input in dynamic fields", () => {
    const email = renderLoanApproved({
      borrowerName: "<script>alert(1)</script>",
      itemNameEn: "Tripod",
      itemNameTh: "",
      reference: "R-9",
      startDate: "2026-07-15",
      endDate: "2026-07-20",
    });
    expect(email.html).not.toContain("<script>alert(1)</script>");
    expect(email.html).toContain("&lt;script&gt;");
  });

  it("falls back to the English item name when Thai is empty", () => {
    const email = renderLoanApproved({
      borrowerName: "Somchai",
      itemNameEn: "Tripod",
      itemNameTh: "   ",
      reference: "R-9",
      startDate: "2026-07-15",
      endDate: "2026-07-20",
    });
    expect(email.html).toContain("Tripod");
  });
});

describe("renderLoanRejected", () => {
  it("includes reference and both languages", () => {
    const email = renderLoanRejected({
      borrowerName: "Somchai Jaidee",
      itemNameEn: "Tent",
      itemNameTh: "เต็นท์",
      reference: "R-1024",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("R-1024");
    expect(email.html).toContain("เต็นท์");
    expect(email.html).toContain("Tent");
    expect(email.text).toContain("R-1024");
  });
});

describe("renderOverdue", () => {
  it("includes reference, end date, and an overdue badge", () => {
    const email = renderOverdue({
      borrowerName: "Somchai Jaidee",
      itemNameEn: "Speaker",
      itemNameTh: "ลำโพง",
      reference: "R-1025",
      endDate: "2026-07-10",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("R-1025");
    expect(email.html).toContain("2026-07-10");
    expect(email.html).toContain("Overdue");
    expect(email.text).toContain("overdue");
  });
});

describe("renderDueSoon", () => {
  it("includes reference and due date in both languages", () => {
    const email = renderDueSoon({
      borrowerName: "Somchai Jaidee",
      itemNameEn: "Projector",
      itemNameTh: "โปรเจกเตอร์",
      reference: "R-1026",
      endDate: "2026-07-14",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("R-1026");
    expect(email.html).toContain("2026-07-14");
    expect(email.html).toContain("โปรเจกเตอร์");
    expect(email.html).toContain("Projector");
  });
});

describe("renderPickupReady", () => {
  it("includes reference and start date", () => {
    const email = renderPickupReady({
      borrowerName: "Somchai Jaidee",
      itemNameEn: "Microphone",
      itemNameTh: "ไมโครโฟน",
      reference: "R-1027",
      startDate: "2026-07-13",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("R-1027");
    expect(email.html).toContain("2026-07-13");
    expect(email.html).toContain("pickup");
  });
});

describe("renderOfficerDigest", () => {
  it("includes counts and low-stock items", () => {
    const email = renderOfficerDigest({
      date: "2026-07-12",
      pending: 3,
      overdue: 1,
      dueSoon: 2,
      dueSoonDays: 2,
      lowStock: [{ nameEn: "Batteries AA", nameTh: "ถ่านไฟฉาย AA", qty: 1 }],
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("2026-07-12");
    expect(email.html).toContain("Batteries AA");
    expect(email.html).toContain("ถ่านไฟฉาย AA");
    expect(email.text).toContain("Pending loan requests: 3");
  });

  it("omits the low-stock list when there is none", () => {
    const email = renderOfficerDigest({
      date: "2026-07-12",
      pending: 0,
      overdue: 0,
      dueSoon: 0,
      dueSoonDays: 2,
      lowStock: [],
    });
    assertWellFormedEmail(email);
    expect(email.text).not.toContain("Low-stock items:");
  });
});

describe("renderOfficerNewRequest", () => {
  it("includes item, reference, and student details", () => {
    const email = renderOfficerNewRequest({
      itemNameEn: "Ladder",
      itemNameTh: "บันได",
      reference: "R-1028",
      studentName: "Somchai Jaidee",
      studentId: "6412345678",
      studentEmail: "somchai@example.com",
      startDate: "2026-07-15",
      endDate: "2026-07-20",
      reason: "For a club event",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("R-1028");
    expect(email.html).toContain("6412345678");
    expect(email.html).toContain("somchai@example.com");
    expect(email.html).toContain("For a club event");
  });

  it("omits the reason row when reason is missing", () => {
    const email = renderOfficerNewRequest({
      itemNameEn: "Ladder",
      itemNameTh: "บันได",
      reference: "R-1028",
      studentName: "Somchai Jaidee",
      studentId: "6412345678",
      studentEmail: "somchai@example.com",
      startDate: "2026-07-15",
      endDate: "2026-07-20",
      reason: null,
    });
    expect(email.html).not.toContain("Reason:");
    expect(email.text).not.toContain("Reason:");
  });
});

describe("renderContact", () => {
  it("includes category, sender, subject, and escaped message with line breaks", () => {
    const email = renderContact({
      name: "Somchai Jaidee",
      email: "somchai@example.com",
      categoryLabel: "General inquiry",
      subject: "Question about membership",
      message: "Line one\nLine two <script>evil()</script>",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("General inquiry");
    expect(email.html).toContain("somchai@example.com");
    expect(email.html).toContain("Question about membership");
    expect(email.html).toContain("Line one<br>Line two");
    expect(email.html).not.toContain("<script>evil()</script>");
    expect(email.text).toContain("Line one\nLine two");
  });
});

describe("renderStartClub", () => {
  it("includes club name, sender, and description", () => {
    const email = renderStartClub({
      name: "Somchai Jaidee",
      email: "somchai@example.com",
      clubName: "Chess Club",
      description: "We want to start a chess club for BIR students.",
      members: "5 interested students",
    });
    assertWellFormedEmail(email);
    expect(email.html).toContain("Chess Club");
    expect(email.html).toContain("somchai@example.com");
    expect(email.html).toContain("We want to start a chess club");
    expect(email.html).toContain("5 interested students");
  });

  it("omits the members row when not provided", () => {
    const email = renderStartClub({
      name: "Somchai Jaidee",
      email: "somchai@example.com",
      clubName: "Chess Club",
      description: "We want to start a chess club.",
      members: null,
    });
    expect(email.html).not.toContain("Interested members");
  });
});
