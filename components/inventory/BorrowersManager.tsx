"use client";

/**
 * Officer-facing borrower search + list. Search updates the `?search=`
 * query param via the router so the server page re-runs `listBorrowers`,
 * keeping the search itself SSR-driven.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import Field from "@/components/Field";
import Button from "@/components/Button";
import { localeHref } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Borrower, Role } from "@/lib/inventory/types";

export type BorrowersManagerProps = {
  locale: Locale;
  role: Role;
  borrowers: Borrower[];
  activeCountsById: Record<string, number>;
  initialSearch: string;
};

type Copy = {
  searchLabel: string;
  searchPlaceholder: string;
  searchCta: string;
  clearCta: string;
  emptyList: string;
  studentIdLabel: string;
  emailLabel: string;
  activeLoansLabel: (n: number) => string;
  blocklistedLabel: string;
  viewLabel: (name: string) => string;
};

const copy: Record<Locale, Copy> = {
  en: {
    searchLabel: "Search borrowers",
    searchPlaceholder: "Name, student ID, or email",
    searchCta: "Search",
    clearCta: "Clear",
    emptyList: "No borrowers match this search.",
    studentIdLabel: "Student ID",
    emailLabel: "Email",
    activeLoansLabel: (n) => (n === 1 ? "1 active loan" : `${n} active loans`),
    blocklistedLabel: "Blocklisted",
    viewLabel: (name) => `View ${name}`,
  },
  th: {
    searchLabel: "ค้นหาผู้ยืม",
    searchPlaceholder: "ชื่อ, รหัสนักศึกษา หรืออีเมล",
    searchCta: "ค้นหา",
    clearCta: "ล้างค่า",
    emptyList: "ไม่พบผู้ยืมที่ตรงกับการค้นหานี้",
    studentIdLabel: "รหัสนักศึกษา",
    emailLabel: "อีเมล",
    activeLoansLabel: (n) => `กำลังยืม ${n} รายการ`,
    blocklistedLabel: "ถูกระงับสิทธิ์",
    viewLabel: (name) => `ดู ${name}`,
  },
};

export default function BorrowersManager({
  locale,
  borrowers,
  activeCountsById,
  initialSearch,
}: BorrowersManagerProps) {
  const t = copy[locale];
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = search.trim();
    const href = trimmed
      ? `/officer/inventory/borrowers?search=${encodeURIComponent(trimmed)}`
      : "/officer/inventory/borrowers";
    router.push(localeHref(locale, href));
  }

  function clearSearch() {
    setSearch("");
    router.push(localeHref(locale, "/officer/inventory/borrowers"));
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={submitSearch} className="flex flex-wrap items-end gap-3">
        <Field
          label={t.searchLabel}
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="max-w-sm flex-1"
        />
        <Button type="submit">{t.searchCta}</Button>
        {initialSearch || search ? (
          <Button type="button" variant="ghost" onClick={clearSearch}>
            {t.clearCta}
          </Button>
        ) : null}
      </form>

      {borrowers.length === 0 ? (
        <p className="text-muted text-sm">{t.emptyList}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {borrowers.map((borrower) => {
            const activeCount = activeCountsById[borrower.id] ?? 0;
            return (
              <li
                key={borrower.id}
                className="border-line bg-surface group relative flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
              >
                <div className="min-w-0">
                  <p className="font-display text-ink text-lg">
                    <Link
                      href={localeHref(locale, `/officer/inventory/borrowers/${borrower.id}`)}
                      className="after:absolute after:inset-0 hover:underline"
                    >
                      {borrower.name}
                    </Link>
                  </p>
                  <p className="text-muted text-sm">
                    {t.studentIdLabel}: {borrower.tuStudentId} &middot; {t.emailLabel}: {borrower.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-muted text-sm">{t.activeLoansLabel(activeCount)}</span>
                  {borrower.blocklisted ? (
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
                        "bg-error-tint text-error"
                      )}
                    >
                      {t.blocklistedLabel}
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
