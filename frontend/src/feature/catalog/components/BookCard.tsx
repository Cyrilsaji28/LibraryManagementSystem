import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { Book } from "../types";

type Props = {
  book: Book;
  index?: number;
};

export default function BookCard({ book, index = 0 }: Props) {
  const isAvailable = book.availableCopies > 0;
  const availabilityPercent =
    book.totalCopies > 0
      ? (book.availableCopies / book.totalCopies) * 100
      : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800"
    >
      {/* ── Cover Image ── */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={
            book.coverImageUrl ||
            "https://placehold.co/300x450/6366f1/ffffff?text=No+Cover"
          }
          alt={`Cover of ${book.title}`}
          className="h-44 sm:h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/300x450/6366f1/ffffff?text=No+Cover";
          }}
        />
        {/* Gradient hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Availability badge */}
        <div className="absolute right-2 top-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold shadow-md ${isAvailable
              ? "bg-emerald-500 text-white"
              : "bg-red-700 text-red-200"
              }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* ── Book Info ── */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Top Content: Title, Subtitle, Tags */}
        <div className="flex-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {book.title}
          </h3>

          {book.subtitle && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
              {book.subtitle}
            </p>
          )}

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="inline-flex items-center rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {book.language}
            </span>
            <span className="inline-flex items-center rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {book.publicationYear}
            </span>
          </div>
        </div>

        {/* Bottom Content: Always pinned to the bottom */}
        <div className="mt-auto pt-3 space-y-3">
          {/* Copies availability */}
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">
                Copies available
              </span>
              <span
                className={`font-semibold ${isAvailable
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-500"
                  }`}
              >
                {book.availableCopies}/{book.totalCopies}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${isAvailable ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"
                  }`}
                style={{ width: `${availabilityPercent}%` }}
              />
            </div>
          </div>

          {/* CTA */}
          <Link
            to={`/catalog/books/${book.id}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/30"
          >
            <BookOpen className="h-3.5 w-3.5" />
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
