import { NextResponse } from "next/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function notFoundResponse(): NextResponse {
  return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
}

export function quantityMismatchReason(
  trackingMode: "asset" | "consumable",
  qtyOnHand: number | null | undefined
): "quantity-required" | "quantity-not-allowed" | null {
  if (trackingMode === "consumable" && (qtyOnHand === null || qtyOnHand === undefined)) {
    return "quantity-required";
  }
  if (trackingMode === "asset" && qtyOnHand !== null && qtyOnHand !== undefined) {
    return "quantity-not-allowed";
  }
  return null;
}
