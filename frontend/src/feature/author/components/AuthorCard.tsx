import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, User } from "lucide-react";
import type { AuthorSummary } from "../types";

type Props = {
  author: AuthorSummary;
  index?: number;
};

export default function AuthorCard({ author, index = 0 }: Props) {
  const initials = author.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800"
    >
      {/* ── Top Header Banner ── */}
      <div className="relative h-24 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 p-4">
        {/* Subtle decorative circles */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-sm" />
        <div className="absolute right-12 bottom-0 h-10 w-10 rounded-full bg-white/10 blur-sm" />

        {/* Books count badge floating top right */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm border border-white/20">
            <BookOpen className="h-3 w-3" />
            {author.bookCount} {author.bookCount === 1 ? "Book" : "Books"}
          </span>
        </div>
      </div>

      {/* ── Author Avatar (Overlapping header) ── */}
      <div className="px-6 -mt-10 flex items-end justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white dark:border-slate-900 bg-gradient-to-br from-indigo-600 to-violet-700 text-xl font-bold text-white shadow-md">
          {initials || <User className="h-8 w-8 text-white" />}
        </div>
      </div>

      {/* ── Body Info ── */}
      <div className="flex flex-1 flex-col p-6 pt-4">
        {/* Top Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {author.fullName}
          </h3>

          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {author.biography ||
              "Celebrated author contributing memorable literature to the LibraryHub collection."}
          </p>
        </div>

        {/* Bottom CTA: Pinned to bottom */}
        <div className="mt-auto pt-6">
          <Link
            to={`/authors/${author.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            <span>View Books</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
