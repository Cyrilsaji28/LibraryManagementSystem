import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(
      1,
      "...",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total
    );
  } else {
    pages.push(
      1,
      "...",
      current - 1,
      current,
      current + 1,
      "...",
      total
    );
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const btnBase =
    "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-150";

  const btnInactive =
    "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white";

  const btnActive =
    "bg-indigo-600 text-white shadow-md hover:bg-indigo-700";

  const btnDisabled =
    "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed";

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`${btnBase} ${
              currentPage === page ? btnActive : btnInactive
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${btnBase} ${
          currentPage === totalPages ? btnDisabled : btnInactive
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
