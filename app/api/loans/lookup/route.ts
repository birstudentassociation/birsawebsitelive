import { NextResponse } from "next/server";
import { loanLookupSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/app/api/_lib/guard";
import { getLoanByReferenceAndEmail } from "@/lib/inventory/loans";
import { getItem } from "@/lib/inventory/items";

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot filled — silently accept and discard, never reveal detection.
  if (typeof body === "object" && body !== null && (body as { nickname?: unknown }).nickname) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 200 });
  }

  const result = loanLookupSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { reference, email } = result.data;

  const loan = await getLoanByReferenceAndEmail(reference, email);
  if (!loan) {
    // Generic response to avoid enumeration of valid references.
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 200 });
  }

  const item = await getItem(loan.itemId);

  return NextResponse.json(
    {
      ok: true,
      loan: {
        reference: loan.reference,
        status: loan.status,
        startDate: loan.startDate,
        endDate: loan.endDate,
        itemName: item?.name.en ?? null,
      },
    },
    { status: 200 }
  );
}
