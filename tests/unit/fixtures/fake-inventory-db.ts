/**
 * An in-memory stand-in for the handful of statements lib/inventory/loans.ts
 * and lib/inventory/borrowers.ts issue. There is no local Postgres, so it
 * recognises each statement by shape and applies it to plain arrays. It
 * checks the application logic around the SQL (which rows are written, in
 * which order, with which parameters), not the SQL itself.
 */
export type FakeItem = {
  id: string;
  key: string;
  max_loan_days: number;
  is_retired: boolean;
  online_loanable: boolean;
  tracking_mode: "asset" | "consumable";
  qty_on_hand: number | null;
};

export type FakeUnit = {
  id: string;
  item_id: string;
  state: string;
  condition: string;
};

export type FakeLoan = {
  id: string;
  reference: string;
  item_id: string;
  unit_id: string | null;
  borrower_id: string;
  quantity: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: string;
  condition_in?: string | null;
  closed_at?: string | null;
};

export type FakeBorrower = {
  id: string;
  tu_student_id: string;
  name: string;
  email: string;
  phone: string | null;
  blocklisted: boolean;
  blocklist_reason: string | null;
  max_concurrent_loans: number | null;
  created_at: string;
  updated_at: string;
};

type Result = { rows: unknown[] };

const ACTIVE = ["pending", "approved", "checked_out", "overdue"];

export class FakeInventoryDb {
  items: FakeItem[] = [];
  units: FakeUnit[] = [];
  loans: FakeLoan[] = [];
  borrowers: FakeBorrower[] = [];
  statements: { text: string; values: unknown[] }[] = [];
  failOn: RegExp | null = null;
  private nextId = 1;

  id(prefix: string): string {
    const n = String(this.nextId++).padStart(12, "0");
    return `${prefix}-0000-4000-8000-${n}`;
  }

  async handle(rawText: string, values: unknown[] = []): Promise<Result> {
    const text = rawText.replace(/\s+/g, " ").trim();
    this.statements.push({ text, values });
    if (this.failOn?.test(text)) {
      throw new Error("simulated database failure");
    }

    if (/^(begin|commit|rollback)$/.test(text)) {
      return { rows: [] };
    }

    if (/^select .* from items where key = \$1/.test(text)) {
      const found = this.items.find(
        (item) =>
          item.key === values[0] &&
          (!text.includes("is_retired = false") || !item.is_retired) &&
          (!text.includes("online_loanable = true") || item.online_loanable) &&
          (!text.includes("tracking_mode = 'asset'") || item.tracking_mode === "asset")
      );
      return { rows: found ? [{ ...found }] : [] };
    }

    if (/^insert into borrowers .* on conflict \(tu_student_id\) do nothing/.test(text)) {
      if (!this.borrowers.some((b) => b.tu_student_id === values[0])) {
        this.borrowers.push({
          id: this.id("b0000000"),
          tu_student_id: String(values[0]),
          name: String(values[1]),
          email: String(values[2]),
          phone: (values[3] as string | null) ?? null,
          blocklisted: false,
          blocklist_reason: null,
          max_concurrent_loans: null,
          created_at: "2026-10-10T00:00:00Z",
          updated_at: "2026-10-10T00:00:00Z",
        });
      }
      return { rows: [] };
    }

    if (/^select \* from borrowers where tu_student_id = \$1/.test(text)) {
      const found = this.borrowers.find((b) => b.tu_student_id === values[0]);
      return { rows: found ? [{ ...found }] : [] };
    }

    if (/^update borrowers set phone = \$1/.test(text)) {
      const found = this.borrowers.find((b) => b.id === values[1]);
      if (found) found.phone = values[0] as string | null;
      return { rows: found ? [{ ...found }] : [] };
    }

    if (/^select count\(\*\)::text as count from loans where borrower_id/.test(text)) {
      const count = this.loans.filter(
        (l) => l.borrower_id === values[0] && ACTIVE.includes(l.status)
      ).length;
      return { rows: [{ count: String(count) }] };
    }

    if (/^select count\(\*\)::text as count from units u where/.test(text)) {
      const item = this.items.find((i) => i.id === values[0]);
      const free = this.units.filter(
        (u) =>
          u.item_id === item?.id &&
          !["maintenance", "retired"].includes(u.state) &&
          !this.loans.some((l) => l.unit_id === u.id && ACTIVE.includes(l.status))
      );
      return { rows: [{ count: String(free.length) }] };
    }

    if (/^select count\(\*\)::text as count from units where item_id/.test(text)) {
      const total = this.units.filter(
        (u) => u.item_id === values[0] && u.state !== "retired"
      ).length;
      return { rows: [{ count: String(total) }] };
    }

    if (/^insert into loans .* on conflict \(reference\) do nothing returning id/.test(text)) {
      if (this.loans.some((l) => l.reference === values[0])) {
        return { rows: [] };
      }
      const loan: FakeLoan = {
        id: this.id("10000000"),
        reference: String(values[0]),
        item_id: String(values[1]),
        unit_id: null,
        borrower_id: String(values[2]),
        quantity: Number(values[3]),
        start_date: String(values[4]),
        end_date: String(values[5]),
        reason: (values[6] as string | null) ?? null,
        status: "pending",
      };
      this.loans.push(loan);
      return { rows: [{ id: loan.id }] };
    }

    if (/^select \* from loans where id = \$1/.test(text)) {
      const found = this.loans.find((l) => l.id === values[0]);
      return { rows: found ? [{ ...found }] : [] };
    }

    if (/^select item_id, state from units where id = \$1/.test(text)) {
      const found = this.units.find((u) => u.id === values[0]);
      return { rows: found ? [{ item_id: found.item_id, state: found.state }] : [] };
    }

    if (/^select state from units where id = \$1/.test(text)) {
      const found = this.units.find((u) => u.id === values[0]);
      return { rows: found ? [{ state: found.state }] : [] };
    }

    if (
      /^select 1 from loans where unit_id = \$1 .* status in \('checked_out', 'overdue'\)/.test(
        text
      )
    ) {
      return { rows: [] };
    }

    if (/^update loans set unit_id = \$1, status = 'approved'/.test(text)) {
      const found = this.loans.find((l) => l.id === values[2] && l.status === "pending");
      if (!found) return { rows: [] };
      found.unit_id = String(values[0]);
      found.status = "approved";
      return { rows: [{ ...found }] };
    }

    if (/^update loans set status = 'checked_out'/.test(text)) {
      const found = this.loans.find((l) => l.id === values[2] && l.status === "approved");
      if (!found) return { rows: [] };
      found.status = "checked_out";
      return { rows: [{ ...found }] };
    }

    if (/^update loans set status = 'returned'/.test(text)) {
      const found = this.loans.find(
        (l) => l.id === values[2] && ["checked_out", "overdue"].includes(l.status)
      );
      if (!found) return { rows: [] };
      found.status = "returned";
      found.condition_in = (values[1] as string | null) ?? null;
      return { rows: [{ ...found }] };
    }

    if (/^update loans set status = 'cancelled'/.test(text)) {
      const found = this.loans.find(
        (l) => l.id === values[0] && ["pending", "approved"].includes(l.status)
      );
      if (!found) return { rows: [] };
      found.status = "cancelled";
      return { rows: [{ ...found }] };
    }

    if (/^select status from loans where unit_id = \$1/.test(text)) {
      const rows = this.loans
        .filter(
          (l) =>
            l.unit_id === values[0] && ["approved", "checked_out", "overdue"].includes(l.status)
        )
        .map((l) => ({ status: l.status }));
      return { rows };
    }

    if (/^update units set state = \$1, condition = coalesce\(\$2, condition\)/.test(text)) {
      const found = this.units.find((u) => u.id === values[2]);
      if (found) {
        found.state = String(values[0]);
        if (values[1]) found.condition = String(values[1]);
      }
      return { rows: [] };
    }

    throw new Error(`FakeInventoryDb does not recognise: ${text}`);
  }
}

export function inventoryDbModule(getDb: () => FakeInventoryDb) {
  const run = (text: string, values?: unknown[]) => getDb().handle(text, values ?? []);
  const sql = Object.assign(
    (strings: TemplateStringsArray, ...values: unknown[]) =>
      run(
        strings.reduce((acc, part, i) => acc + part + (i < values.length ? `$${i + 1}` : ""), ""),
        values
      ),
    {
      query: run,
      connect: async () => ({ query: run, release: () => undefined }),
    }
  );
  return { isInventoryConfigured: () => true, sql };
}
