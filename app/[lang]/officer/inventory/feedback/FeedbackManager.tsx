"use client";

/**
 * Officer-facing recent feedback comments table: client-side pagination over
 * an already-loaded array, matching the pattern in
 * components/inventory/BorrowersManager.tsx (usePagination + Pager) rather
 * than re-deriving it.
 */
import { formatDate, type Locale } from "@/lib/i18n";
import { usePagination } from "@/lib/usePagination";
import Pager from "@/components/Pager";
import Tag from "@/components/Tag";
import type { FeedbackEntry } from "@/lib/feedback";
import type { FeedbackCopy } from "@/components/feedback/feedbackCopy";

const PAGE_SIZE = 20;

export type FeedbackManagerProps = {
  locale: Locale;
  entries: FeedbackEntry[];
  copy: {
    commentHeader: string;
    dateHeader: string;
    localeHeader: string;
    pathHeader: string;
    ratingHeader: string;
    empty: string;
    previous: string;
    next: string;
    /** Template containing the literal placeholders "{current}" and "{total}". */
    pageOf: string;
  };
  ratingLabels: FeedbackCopy["ratingLabels"];
};

export default function FeedbackManager({
  locale,
  entries,
  copy,
  ratingLabels,
}: FeedbackManagerProps) {
  const { page, totalPages, pageItems, goToPage } = usePagination(entries, PAGE_SIZE);

  if (entries.length === 0) {
    return <p className="text-sm text-muted">{copy.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink">
          <caption className="sr-only">{copy.commentHeader}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 pr-4 font-semibold">
                {copy.dateHeader}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {copy.ratingHeader}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {copy.commentHeader}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {copy.localeHeader}
              </th>
              <th scope="col" className="py-2 font-semibold">
                {copy.pathHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((entry) => (
              <tr key={entry.id} className="border-b border-line align-top last:border-0">
                <td className="py-2 pr-4 whitespace-nowrap">
                  {formatDate(locale, entry.createdAt)}
                </td>
                <td className="py-2 pr-4 whitespace-nowrap">{ratingLabels[entry.rating]}</td>
                <td className="py-2 pr-4 break-words">{entry.comment}</td>
                <td className="py-2 pr-4 uppercase">{entry.locale}</td>
                <td className="py-2">
                  <Tag>{entry.path}</Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager
        page={page}
        totalPages={totalPages}
        goToPage={goToPage}
        previousLabel={copy.previous}
        nextLabel={copy.next}
        pageOfTemplate={copy.pageOf}
      />
    </div>
  );
}
