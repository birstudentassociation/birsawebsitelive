// @vitest-environment jsdom
/**
 * Accessibility smoke tests for the officer inventory console's client
 * components, run with axe-core over jsdom-rendered output.
 *
 * There is no local Postgres, so the behind-login console pages can't be
 * server-rendered end to end here. Instead each CLIENT component is rendered
 * directly with minimal, realistic fixture props (mirroring the shapes in
 * lib/inventory/types.ts) and axe is run over the resulting DOM.
 *
 * `color-contrast` is disabled: jsdom has no layout engine, so contrast
 * cannot be meaningfully evaluated here. Real-browser contrast checks live
 * elsewhere (Playwright/axe in tests/e2e).
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";

import ItemsManager from "@/components/inventory/ItemsManager";
import LoanQueue from "@/components/inventory/LoanQueue";
import BorrowersManager from "@/components/inventory/BorrowersManager";
import BorrowerDetail from "@/components/inventory/BorrowerDetail";
import OfficersManager from "@/components/inventory/OfficersManager";
import ReferenceManager from "@/components/inventory/ReferenceManager";
import CustodiansManager from "@/components/inventory/CustodiansManager";
import PhotoUpload from "@/components/inventory/PhotoUpload";
import OfficerLogin from "@/components/inventory/OfficerLogin";
import StatusPill from "@/components/inventory/StatusPill";
import { LogoutButton, ConsoleNav } from "@/components/inventory/ConsoleGate";

import type {
  Borrower,
  Category,
  Custodian,
  Item,
  Loan,
  Location,
  Officer,
  Unit,
} from "@/lib/inventory/types";

// BorrowersManager and OfficerLogin call `useRouter()` from next/navigation,
// which throws ("invariant expected app router to be mounted") when rendered
// outside a Next.js <AppRouterContext> provider, as confirmed by a scratch
// spike against next/link (fine without a provider) vs. useRouter (throws).
// usePathname() does NOT throw (it returns null), so ConsoleNav needs no mock,
// but we stub it anyway for a deterministic "current page" assertion.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/en/officer/inventory/items",
}));

const AXE_OPTIONS: Parameters<typeof axe.run>[1] = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  rules: { "color-contrast": { enabled: false } },
};

async function expectNoViolations(container: Element) {
  const results = await axe.run(container, AXE_OPTIONS);
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

const NOW = "2026-07-01T00:00:00.000Z";

const category: Category = {
  id: "cat-1",
  slug: "camping-gear",
  name: { en: "Camping gear", th: "อุปกรณ์แคมป์" },
  sortOrder: 1,
  createdAt: NOW,
};

const location: Location = {
  id: "loc-1",
  slug: "main-storage",
  name: { en: "Main storage", th: "คลังหลัก" },
  description: { en: "Ground floor storage room", th: "ห้องเก็บของชั้นล่าง" },
  sortOrder: 1,
  createdAt: NOW,
};

const custodian: Custodian = {
  id: "cust-1",
  slug: "birsa",
  kind: "birsa",
  name: { en: "BIRSA", th: "BIRSA" },
  contactName: { en: "", th: "" },
  contactEmail: null,
  contactInstagram: null,
  contactOther: null,
  borrowNote: { en: "", th: "" },
  isActive: true,
  sortOrder: 0,
  createdAt: NOW,
};

const clubCustodian: Custodian = {
  id: "cust-2",
  slug: "bir-basketball",
  kind: "club",
  name: { en: "BIR Basketball", th: "บาสเกตบอล BIR" },
  contactName: { en: "Club captain", th: "หัวหน้าชมรม" },
  contactEmail: "basketball@example.com",
  contactInstagram: "birbasketball",
  contactOther: null,
  borrowNote: { en: "Message us on Instagram to borrow.", th: "ทักมาทาง Instagram เพื่อยืม" },
  isActive: true,
  sortOrder: 3,
  createdAt: NOW,
};

const assetItem: Item = {
  id: "item-1",
  key: "TENT-01",
  categoryId: "cat-1",
  custodianId: "cust-1",
  name: { en: "4-person tent", th: "เต็นท์ 4 คน" },
  description: { en: "A 4-person camping tent.", th: "เต็นท์แคมป์สำหรับ 4 คน" },
  trackingMode: "asset",
  defaultLocationId: "loc-1",
  maxLoanDays: 7,
  photoUrl: null,
  qtyOnHand: null,
  reorderThreshold: null,
  onlineLoanable: true,
  isRetired: false,
  createdBy: "officer-1",
  createdAt: NOW,
  updatedAt: NOW,
};

const consumableItem: Item = {
  id: "item-2",
  key: "BATT-AA",
  categoryId: null,
  custodianId: "cust-2",
  name: { en: "AA batteries", th: "ถ่าน AA" },
  description: { en: "Rechargeable AA batteries.", th: "ถ่านชาร์จ AA" },
  trackingMode: "consumable",
  defaultLocationId: null,
  maxLoanDays: 3,
  photoUrl: null,
  qtyOnHand: 24,
  reorderThreshold: 10,
  onlineLoanable: false,
  isRetired: true,
  createdBy: "officer-1",
  createdAt: NOW,
  updatedAt: NOW,
};

const unit: Unit = {
  id: "unit-1",
  itemId: "item-1",
  label: "Tent #1",
  condition: "good",
  state: "available",
  locationId: "loc-1",
  photoUrl: null,
  notes: null,
  createdAt: NOW,
  updatedAt: NOW,
};

const borrower: Borrower = {
  id: "borrower-1",
  tuStudentId: "6410000000",
  name: "Somsri Somchai",
  email: "somsri@example.com",
  phone: "0812345678",
  blocklisted: false,
  blocklistReason: null,
  maxConcurrentLoans: null,
  createdAt: NOW,
  updatedAt: NOW,
};

const blocklistedBorrower: Borrower = {
  ...borrower,
  id: "borrower-2",
  name: "Somchai Somsri",
  blocklisted: true,
  blocklistReason: "Overdue equipment on a prior loan.",
};

const officer: Officer = {
  id: "officer-1",
  email: "officer@example.com",
  name: "Officer One",
  role: "admin",
  custodianId: null,
  isActive: true,
  portfolio: null,
  termEnd: null,
  createdAt: NOW,
  lastLoginAt: NOW,
};

const inactiveOfficer: Officer = {
  id: "officer-2",
  email: "officer2@example.com",
  name: "Officer Two",
  role: "loan_officer",
  custodianId: "cust-2",
  isActive: false,
  portfolio: null,
  termEnd: null,
  createdAt: NOW,
  lastLoginAt: null,
};

const pendingLoan: Loan = {
  id: "loan-1",
  reference: "LN-0001",
  itemId: "item-1",
  unitId: null,
  borrowerId: "borrower-1",
  quantity: 1,
  startDate: "2026-07-15",
  endDate: "2026-07-20",
  reason: "Club field trip",
  status: "pending",
  decidedBy: null,
  decidedAt: null,
  checkedOutBy: null,
  checkedOutAt: null,
  checkedInBy: null,
  checkedInAt: null,
  conditionOut: null,
  conditionIn: null,
  createdAt: NOW,
  closedAt: null,
};

const checkedOutLoan: Loan = {
  ...pendingLoan,
  id: "loan-2",
  reference: "LN-0002",
  unitId: "unit-1",
  status: "checked_out",
  decidedBy: "officer-1",
  decidedAt: NOW,
  checkedOutBy: "officer-1",
  checkedOutAt: NOW,
  conditionOut: "good",
};

describe("inventory console accessibility (axe)", () => {
  it("ItemsManager has no axe violations", async () => {
    const { container } = render(
      <ItemsManager
        items={[assetItem, consumableItem]}
        categories={[category]}
        locations={[location]}
        custodians={[custodian, clubCustodian]}
        scopedCustodianId={null}
        role="admin"
        locale="en"
      />
    );
    await expectNoViolations(container);
  });

  it("LoanQueue has no axe violations", async () => {
    const { container } = render(
      <LoanQueue
        locale="en"
        loans={[pendingLoan, checkedOutLoan]}
        itemsById={{ [assetItem.id]: assetItem }}
        borrowersById={{ [borrower.id]: borrower }}
        availableUnitsByLoan={{ [pendingLoan.id]: [unit] }}
        role="admin"
        groupByStatus
      />
    );
    await expectNoViolations(container);
  });

  it("BorrowersManager has no axe violations", async () => {
    const { container } = render(
      <BorrowersManager
        locale="en"
        role="admin"
        borrowers={[borrower, blocklistedBorrower]}
        activeCountsById={{ [borrower.id]: 1, [blocklistedBorrower.id]: 0 }}
        initialSearch=""
      />
    );
    await expectNoViolations(container);
  });

  it("BorrowerDetail has no axe violations", async () => {
    const { container } = render(
      <BorrowerDetail
        locale="en"
        borrower={blocklistedBorrower}
        loans={[pendingLoan, checkedOutLoan]}
        itemsById={{ [assetItem.id]: assetItem }}
        activeCount={1}
        role="admin"
      />
    );
    await expectNoViolations(container);
  });

  it("OfficersManager has no axe violations", async () => {
    const { container } = render(
      <OfficersManager
        locale="en"
        officers={[officer, inactiveOfficer]}
        custodians={[custodian, clubCustodian]}
      />
    );
    await expectNoViolations(container);
  });

  it("CustodiansManager has no axe violations", async () => {
    const { container } = render(
      <CustodiansManager locale="en" custodians={[custodian, clubCustodian]} />
    );
    await expectNoViolations(container);
  });

  it("ReferenceManager has no axe violations", async () => {
    const { container } = render(
      <ReferenceManager categories={[category]} locations={[location]} role="admin" locale="en" />
    );
    await expectNoViolations(container);
  });

  it("PhotoUpload has no axe violations", async () => {
    const { container } = render(
      <PhotoUpload
        currentUrl="https://example.com/photo.jpg"
        onUploaded={() => {}}
        labels={{
          upload: "Upload photo",
          uploading: "Uploading...",
          remove: "Remove",
          hint: "JPG or PNG, up to 5MB.",
          tooLarge: "That file is too large.",
          notConfigured: "Photo storage is not configured.",
          error: "Something went wrong. Please try again.",
          photoAlt: "Photo of the 4-person tent",
        }}
      />
    );
    await expectNoViolations(container);
  });

  it("OfficerLogin has no axe violations", async () => {
    const { container } = render(<OfficerLogin locale="en" />);
    await expectNoViolations(container);
  });

  it("StatusPill has no axe violations", async () => {
    const { container } = render(<StatusPill status="pending" label="Pending" />);
    await expectNoViolations(container);
  });

  it("ConsoleGate's LogoutButton and ConsoleNav have no axe violations", async () => {
    const { container } = render(
      <>
        <ConsoleNav
          ariaLabel="Inventory console"
          items={[
            { href: "/en/officer/inventory", label: "Dashboard" },
            { href: "/en/officer/inventory/items", label: "Catalogue" },
          ]}
        />
        <LogoutButton locale="en" />
      </>
    );
    await expectNoViolations(container);
  });
});
