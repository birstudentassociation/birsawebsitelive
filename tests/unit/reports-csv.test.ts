import { describe, expect, it, vi } from "vitest";

const dbState = vi.hoisted(() => ({
  row: {} as Record<string, string>,
}));

vi.mock("@/lib/inventory/db", () => ({
  isInventoryConfigured: () => true,
  sql: async () => ({ rows: [dbState.row] }),
}));

import { loansCsv } from "@/lib/inventory/reports";

function setRow(overrides: Record<string, string>) {
  dbState.row = {
    reference: "L-1",
    item_name: "Camera",
    tu_student_id: "6612345678",
    name: "Somchai",
    email: "somchai@example.com",
    start_date: "2026-07-10",
    end_date: "2026-07-12",
    status: "approved",
    created_at: "2026-07-01",
    ...overrides,
  };
}

async function dataLine() {
  const csv = await loansCsv();
  return csv.split("\r\n")[1];
}

describe("csv formula injection", () => {
  it("prefixes a leading equals sign with a single quote", async () => {
    setRow({ item_name: "=1+1" });
    expect(await dataLine()).toContain(",'=1+1,");
  });

  it("prefixes a leading plus sign with a single quote", async () => {
    setRow({ name: "+66123" });
    expect(await dataLine()).toContain(",'+66123,");
  });

  it("prefixes a leading minus sign on text with a single quote", async () => {
    setRow({ name: "-cmd" });
    expect(await dataLine()).toContain(",'-cmd,");
  });

  it("prefixes a leading at sign with a single quote", async () => {
    setRow({ email: "@SUM(A1)" });
    expect(await dataLine()).toContain(",'@SUM(A1),");
  });

  it("prefixes a leading tab with a single quote", async () => {
    setRow({ name: "\tx" });
    expect(await dataLine()).toContain(",'\tx,");
  });

  it("prefixes a leading carriage return and still quotes the field", async () => {
    setRow({ name: "\rx" });
    expect(await dataLine()).toContain(',"\'\rx",');
  });

  it("quotes and escapes a dangerous value containing a comma and quotes", async () => {
    setRow({ item_name: '=HYPERLINK("http://x",1)' });
    expect(await dataLine()).toContain(`"'=HYPERLINK(""http://x"",1)"`);
  });

  it("leaves plain negative numbers alone", async () => {
    setRow({ status: "-5" });
    expect(await dataLine()).toContain(",-5,");
  });
});
