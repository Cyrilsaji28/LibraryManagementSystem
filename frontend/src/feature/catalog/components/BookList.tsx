import BookCard from "./BookCard";
import type { Book, PagedResult } from "../types";
import { BookOpen, AlertCircle } from "lucide-react";

type Props = {
  data?: PagedResult<Book>;
  isLoading: boolean;
  error: Error | null;
};

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="skeleton h-44 sm:h-48 w-full" />
      <div className="p-3.5 sm:p-4 space-y-2.5">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-1.5 mt-2">
          <div className="skeleton h-4 w-14 rounded" />
          <div className="skeleton h-4 w-10 rounded" />
        </div>
        <div className="mt-3 space-y-1">
          <div className="skeleton h-1 w-full rounded-full" />
        </div>
        <div className="skeleton h-7 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}

export default function BookList({ data, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
          <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Failed to load books
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950">
          <BookOpen className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          No books found
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your search or clearing the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
      {data.items.map((book, index) => (
        <BookCard key={book.id} book={book} index={index} />
      ))}
    </div>
  );
}
