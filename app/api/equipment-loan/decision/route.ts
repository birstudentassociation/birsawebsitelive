import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { OFFICER_COOKIE, verifySessionToken } from "@/lib/officer-session";
import { decideLoanRequest } from "@/lib/equipment-loan";
import { getEquipmentItem } from "@/content/services/equipment";

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(OFFICER_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const id =
    typeof body === "object" && body !== null && typeof (body as { id?: unknown }).id === "string"
      ? (body as { id: string }).id
      : "";
  const decision =
    typeof body === "object" && body !== null ? (body as { decision?: unknown }).decision : undefined;

  if (!id || (decision !== "approved" && decision !== "rejected")) {
    return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
  }

  const result = await decideLoanRequest(id, decision);
  if (!result.ok) {
    const status = result.reason === "not-found" ? 404 : result.reason === "not-configured" ? 200 : 400;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  const { row } = result;
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const from = process.env.CONTACT_FROM ?? "BIRSA Portal <onboarding@resend.dev>";
      const item = getEquipmentItem(row.itemKey);
      const itemName = item?.name.en ?? row.itemKey;

      const subject =
        row.status === "approved"
          ? `[BIRSA] Your equipment loan request ${row.reference} was approved`
          : `[BIRSA] Your equipment loan request ${row.reference} was not approved`;

      const text =
        row.status === "approved"
          ? [
              `Good news! Your request to borrow "${itemName}" has been approved.`,
              "",
              `Reference: ${row.reference}`,
              `Pickup date: ${row.pickupDate}`,
              `Return date: ${row.returnDate}`,
              `Pickup / storage location: ${item?.storageLocation.en ?? "BIRSA office"}`,
              "",
              "Please bring your student ID when you collect the item.",
            ].join("\n")
          : [
              `Thank you for your interest in borrowing "${itemName}".`,
              "",
              `Unfortunately your request (reference ${row.reference}) could not be approved at this time.`,
              "If you have questions or would like to discuss alternatives, please contact BIRSA directly.",
            ].join("\n");

      await resend.emails.send({
        from,
        to: row.studentEmail,
        subject,
        text,
      });
    } catch {
      // Notification email is optional; the decision itself already succeeded.
    }
  }

  return NextResponse.json({ ok: true, row }, { status: 200 });
}
