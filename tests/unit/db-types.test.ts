import { describe, expect, it } from "vitest";
import { types } from "@vercel/postgres";
import "@/lib/inventory/db";

describe("inventory db type parsers", () => {
  it("returns Postgres date columns (OID 1082) as raw strings", () => {
    const parse = types.getTypeParser(1082);
    expect(parse("2026-07-10")).toBe("2026-07-10");
  });
});
