import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CLOSED_LOAN_STATUSES,
  LOAN_STATUSES,
  LOAN_TRANSITIONS,
  ON_LOAN_STATUSES,
  OPEN_LOAN_STATUSES,
  UNIT_HOLDING_LOAN_STATUSES,
  canTransition,
  isClosedLoanStatus,
  isLoanStatus,
  sqlStatusList,
  type LoanAction,
  type LoanStatus,
} from "@/lib/inventory/loan-lifecycle";

const ROOT = join(__dirname, "..", "..");

function sorted(list: readonly string[]): string[] {
  return [...list].sort();
}

describe("loan lifecycle", () => {
  it("splits every status into exactly one of open or closed", () => {
    expect(sorted([...OPEN_LOAN_STATUSES, ...CLOSED_LOAN_STATUSES])).toEqual(sorted(LOAN_STATUSES));
  });

  it("never moves a closed loan", () => {
    for (const status of CLOSED_LOAN_STATUSES) {
      for (const action of Object.keys(LOAN_TRANSITIONS) as LoanAction[]) {
        expect(canTransition(status, action)).toBe(false);
      }
    }
  });

  it("allows only the documented transitions", () => {
    const allowed = Object.fromEntries(
      LOAN_STATUSES.map((status) => [
        status,
        (Object.keys(LOAN_TRANSITIONS) as LoanAction[]).filter((action) =>
          canTransition(status, action)
        ),
      ])
    );
    expect(allowed).toEqual({
      pending: ["approve", "reject", "cancel", "borrowerCancel"],
      approved: ["checkout", "cancel"],
      checked_out: ["markOverdue", "checkin"],
      overdue: ["checkin"],
      returned: [],
      rejected: [],
      cancelled: [],
      no_show: [],
    });
  });

  it("targets a real status from every transition", () => {
    for (const { to } of Object.values(LOAN_TRANSITIONS)) {
      expect(isLoanStatus(to)).toBe(true);
    }
    expect(isClosedLoanStatus("returned")).toBe(true);
    expect(isClosedLoanStatus("overdue")).toBe(false);
  });

  it("keeps unit-holding and on-loan statuses within open ones", () => {
    for (const status of [...UNIT_HOLDING_LOAN_STATUSES, ...ON_LOAN_STATUSES]) {
      expect((OPEN_LOAN_STATUSES as readonly LoanStatus[]).includes(status)).toBe(true);
    }
  });

  it("renders a SQL list", () => {
    expect(sqlStatusList(ON_LOAN_STATUSES)).toBe("'checked_out', 'overdue'");
  });
});

describe("hand-written SQL status lists", () => {
  const named: Record<string, readonly string[]> = {
    LOAN_STATUSES,
    OPEN_LOAN_STATUSES,
    CLOSED_LOAN_STATUSES,
    UNIT_HOLDING_LOAN_STATUSES,
    ON_LOAN_STATUSES,
    ...Object.fromEntries(
      Object.entries(LOAN_TRANSITIONS).map(([action, { from }]) => [`${action}.from`, from])
    ),
  };
  const known = Object.values(named).map((list) => sorted(list).join(","));

  const files = [
    ...readdirSync(join(ROOT, "lib/inventory"))
      .filter((name) => name.endsWith(".ts"))
      .map((name) => join("lib/inventory", name)),
    ...readdirSync(join(ROOT, "db/migrations"))
      .filter((name) => name.endsWith(".sql") && !name.includes("course"))
      .map((name) => join("db/migrations", name)),
  ];

  const found = files.flatMap((file) =>
    [...readFileSync(join(ROOT, file), "utf8").matchAll(/status\s+in\s*\(\s*('[^)]*)\)/g)].map(
      (match) => ({
        file,
        statuses: sorted([...(match[1] ?? "").matchAll(/'([a-z_]+)'/g)].map((m) => m[1] ?? "")),
      })
    )
  );

  it("finds the lists it guards", () => {
    expect(found.length).toBeGreaterThan(5);
  });

  it.each(found)("$file lists a status set defined in lib/inventory/loan-lifecycle.ts", (entry) => {
    expect(known).toContain(entry.statuses.join(","));
  });
});
