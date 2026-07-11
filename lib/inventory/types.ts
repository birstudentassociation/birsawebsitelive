/**
 * Shared app-facing (camelCase) types for the inventory management suite.
 *
 * These mirror the tables defined in db/migrations/*.sql. Dates are ISO
 * strings, ids are string uuids, and nullable columns are typed `| null`.
 * Data-access modules under lib/inventory/* are responsible for mapping
 * snake_case database rows to these shapes, matching the convention in
 * lib/equipment-loan.ts.
 */

export type Role = "admin" | "inventory_manager" | "loan_officer" | "read_only";

export type TrackingMode = "asset" | "consumable";

export type UnitCondition = "good" | "worn" | "damaged" | "lost";

export type UnitState = "available" | "reserved" | "on_loan" | "maintenance" | "retired";

export type LoanStatus =
  | "pending"
  | "approved"
  | "checked_out"
  | "overdue"
  | "returned"
  | "rejected"
  | "cancelled"
  | "no_show";

export type Bilingual = { en: string; th: string };

export type Category = {
  id: string;
  slug: string;
  name: Bilingual;
  sortOrder: number;
  createdAt: string;
};

export type Location = {
  id: string;
  slug: string;
  name: Bilingual;
  description: Bilingual;
  sortOrder: number;
  createdAt: string;
};

export type CustodianKind = "birsa" | "club";

export type Custodian = {
  id: string;
  slug: string;
  kind: CustodianKind;
  name: Bilingual;
  contactName: Bilingual;
  contactEmail: string | null;
  contactInstagram: string | null;
  contactOther: string | null;
  borrowNote: Bilingual;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
};

export type Item = {
  id: string;
  key: string;
  categoryId: string | null;
  custodianId: string;
  name: Bilingual;
  description: Bilingual;
  trackingMode: TrackingMode;
  defaultLocationId: string | null;
  maxLoanDays: number;
  onlineLoanable: boolean;
  photoUrl: string | null;
  qtyOnHand: number | null;
  reorderThreshold: number | null;
  isRetired: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Unit = {
  id: string;
  itemId: string;
  label: string;
  condition: UnitCondition;
  state: UnitState;
  locationId: string | null;
  photoUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceEntry = {
  id: string;
  unitId: string;
  openedAt: string;
  closedAt: string | null;
  issue: string;
  actionTaken: string | null;
  conditionBefore: UnitCondition | null;
  conditionAfter: UnitCondition | null;
  officerId: string | null;
  createdAt: string;
};

export type ConsumableAdjustment = {
  id: string;
  itemId: string;
  delta: number;
  reason: string | null;
  borrowerId: string | null;
  officerId: string | null;
  resultingQty: number;
  createdAt: string;
};

/** NOTE: never include passcodeHash in this app type. */
export type Officer = {
  id: string;
  email: string;
  name: string;
  role: Role;
  custodianId: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export type Borrower = {
  id: string;
  tuStudentId: string;
  name: string;
  email: string;
  phone: string | null;
  blocklisted: boolean;
  blocklistReason: string | null;
  maxConcurrentLoans: number | null;
  createdAt: string;
  updatedAt: string;
};

export type AuditEntry = {
  id: string;
  officerId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  detail: unknown;
  createdAt: string;
};

export type Loan = {
  id: string;
  reference: string;
  itemId: string;
  unitId: string | null;
  borrowerId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LoanStatus;
  decidedBy: string | null;
  decidedAt: string | null;
  checkedOutBy: string | null;
  checkedOutAt: string | null;
  checkedInBy: string | null;
  checkedInAt: string | null;
  conditionOut: UnitCondition | null;
  conditionIn: UnitCondition | null;
  createdAt: string;
};
